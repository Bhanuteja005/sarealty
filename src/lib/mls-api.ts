// MLS Matrix API integration for PropEase
export interface Property {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    price: number;
    beds: number;
    baths: number;
    halfBaths?: number;
    sqft: number;
    propertyType: string;
    propertySubType?: string;
    yearBuilt: number;
    status: string;
    listingDate: string;
    description: string;
    images: string[];
    features: string[];
    agentName: string;
    agentPhone: string;
    agentEmail: string;
    agentCompany?: string;
    openHouse?: {
        date: string;
        startTime: string;
        endTime: string;
    };
    lotSize?: number;
    lotSizeUnits?: string;
    parking?: number;
    garageSpaces?: number;
    carportSpaces?: number;
    coveredSpaces?: number;
    hoa?: number;
    hoaType?: string;
    pricePerSqft?: number;
    latitude?: number;
    longitude?: number;
    mlsNumber?: string;
    parcelNumber?: string;
    subdivision?: string;
    county?: string;
    taxYear?: number;
    taxAnnualAmount?: number;
    taxLot?: string;
    taxBlock?: string;
    taxLegalDescription?: string;
    originalListPrice?: number;
    forSale?: string;
    multiParcelIdYn?: string;
    municipalUtilityDistrictYn?: string;
    accessibilityFeaturesYn?: string;
    greenType?: string;
    greenStatus?: string;
    appliancesYn?: string;
    moniesRequired?: string;
    fireplaceFeatures?: string;
    housingType?: string;
    waterfrontYn?: string;
    lakePumpYn?: string;
    publicDrivingDirections?: string;
    directions?: string;
    garageSize?: string;
    schools?: {
        elementary?: string;
        middle?: string;
        high?: string;
        district?: string;
    };
    rooms?: Array<{
        type: string;
        dimensions: string;
    }>;
    acres?: number;
    fireplaces?: number;
    livingAreas?: number;
    diningAreas?: number;
    stories?: number;
    cooling?: string;
    heating?: string;
    flooring?: string;
    architecturalStyle?: string;
    exteriorFeatures?: string[];
    parkingFeatures?: string[];
    accessibilityFeatures?: string[];
    fencing?: string[];
    poolFeatures?: string[];
    constructionMaterials?: string[];
    securityFeatures?: string[];
    otherEquipment?: string[];
    availableDate?: string;
    depositAmount?: number;
    applicationFee?: number;
    tenantPays?: string[];
    petDeposit?: number;
    petsAllowed?: number;
    monthlyPetFee?: number;
    furnishedYn?: string;
    numVehicles?: number;
    daysGuestsAllowed?: number;
    nonRefundablePetFeeYn?: string;
    // Index in MLS list for detail fetch
    listIndex?: number;
}

export interface PropertySearchParams {
    q?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    propertyType?: string;
}

// MLS Matrix API base URL and key
const MLS_API_BASE = 'https://ntrdd.mlsmatrix.com/Matrix/Public/IDXSearch.aspx';
const MLS_API_KEY = 'c2c9438e';

// Compressed 'c' query parameter from user's URL
const MLS_COMPRESSED_C = 'H4sIAAAAAAAEAItWMlDSySvNyRklqEEoHZpzeNnhBYdnowdqLABfRk5uaQEAAA))';

type PartialDeep<T> = {
    [K in keyof T]?: T[K] extends Array<infer U>
        ? Array<U>
        : T[K] extends object
            ? PartialDeep<T[K]>
            : T[K];
};

function normalizeText(input: string): string {
    return input
        .replace(/\r/g, '')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function stripHtmlToText(html: string): string {
    // We don't need perfect HTML-to-text; we only need stable label scanning.
    const withoutScripts = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/gi, ' '); // Remove comments

    const text = withoutScripts
        .replace(/<br\s*\/?\s*>/gi, '\n')
        .replace(/<\/p\s*>/gi, '\n')
        .replace(/<\/div\s*>/gi, '\n')
        .replace(/<[^>]+>/g, ' ');

    return normalizeText(text.replace(/\n\s*/g, '\n'));
}

function extractAfterLabel(text: string, label: string, stopLabels: string[] = []): string | undefined {
    const idx = text.toLowerCase().indexOf(label.toLowerCase());
    if (idx < 0) return undefined;

    const start = idx + label.length;
    const tail = text.slice(start);
    if (!tail) return undefined;

    if (stopLabels.length === 0) {
        // Grab until newline
        const line = tail.split('\n')[0] ?? '';
        const out = normalizeText(line);
        return out.length ? out : undefined;
    }

    // Find the earliest stop label
    let stopIndex = tail.length;
    for (const stop of stopLabels) {
        const sIdx = tail.toLowerCase().indexOf(stop.toLowerCase());
        if (sIdx >= 0 && sIdx < stopIndex) stopIndex = sIdx;
    }
    const out = normalizeText(tail.slice(0, stopIndex));
    return out.length ? out : undefined;
}

function parseYesNo(value?: string): string | undefined {
    if (!value) return undefined;
    const v = value.trim();
    if (!v) return undefined;
    if (/^(y|yes)$/i.test(v)) return 'Yes';
    if (/^(n|no)$/i.test(v)) return 'No';
    return v;
}

function parseCurrencyToNumber(value?: string): number | undefined {
    if (!value) return undefined;
    const cleaned = value.replace(/[^\d.]/g, '');
    if (!cleaned) return undefined;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : undefined;
}

// Cache viewstate for detail POST requests
let cachedViewState: string | null = null;
let cachedViewStateGenerator: string | null = null;

// Helper function to fetch with timeout and retry
async function fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries: number = 3,
    timeoutMs: number = 30000
): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (e) {
            clearTimeout(timeoutId);
            lastError = e as Error;
            console.warn(`Fetch attempt ${attempt}/${maxRetries} failed:`, (e as Error).message);
            
            if (attempt < maxRetries) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }
    
    throw lastError || new Error('Fetch failed after retries');
}

async function fetchMlsDetailHtml(listIndex: number): Promise<string | null> {
    const baseUrl = `${MLS_API_BASE}?c=${MLS_COMPRESSED_C}&idx=${MLS_API_KEY}`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    };
    
    try {
        // First, get viewstate if not cached
        if (!cachedViewState) {
            const initRes = await fetchWithRetry(baseUrl, { headers, cache: 'no-store' });
            if (!initRes.ok) return null;
            const initHtml = await initRes.text();
            
            const vsMatch = initHtml.match(/id="__VIEWSTATE"\s+value="([^"]+)"/);
            const vsgMatch = initHtml.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/);
            
            if (!vsMatch) return null;
            cachedViewState = vsMatch[1];
            cachedViewStateGenerator = vsgMatch ? vsgMatch[1] : '';
        }
        
        // Now POST with the index to get detail view
        // The postback arg is 'Redisplay|69,,INDEX' where 69 is the display type for full detail
        const formData = new URLSearchParams();
        formData.append('__VIEWSTATE', cachedViewState);
        if (cachedViewStateGenerator) formData.append('__VIEWSTATEGENERATOR', cachedViewStateGenerator);
        formData.append('__EVENTTARGET', 'm_DisplayCore');
        formData.append('__EVENTARGUMENT', `Redisplay|69,,${listIndex}`);
        
        const res = await fetchWithRetry(baseUrl, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            cache: 'no-store',
        });
        
        if (!res.ok) return null;
        return await res.text();
    } catch (e) {
        console.error('Error fetching MLS detail HTML:', e);
        return null;
    }
}

function extractSection(text: string, startLabel: string, stopLabels: string[]): string | undefined {
    const startIdx = text.toLowerCase().indexOf(startLabel.toLowerCase());
    if (startIdx < 0) return undefined;
    
    // Start after the label
    const contentStart = startIdx + startLabel.length;
    let contentEnd = text.length;

    // Find the nearest stop label
    for (const stop of stopLabels) {
        const stopIdx = text.toLowerCase().indexOf(stop.toLowerCase(), contentStart);
        if (stopIdx >= 0 && stopIdx < contentEnd) {
            contentEnd = stopIdx;
        }
    }

    return text.slice(contentStart, contentEnd).trim();
}

function extractValueFromSection(sectionText: string, label: string, nextLabels: string[] = []): string | undefined {
    const idx = sectionText.toLowerCase().indexOf(label.toLowerCase());
    if (idx < 0) return undefined;

    const start = idx + label.length;
    const tail = sectionText.slice(start);
    
    let stopIndex = tail.length;
    
    // Stop at newline if no specific nextLabels provided, or use nextLabels
    // But usually in these sections, fields are "Label Value Label Value"
    // So we often want to stop at the *next* known label in the list.
    
    if (nextLabels.length > 0) {
        for (const stop of nextLabels) {
            const sIdx = tail.toLowerCase().indexOf(stop.toLowerCase());
            if (sIdx >= 0 && sIdx < stopIndex) stopIndex = sIdx;
        }
    } else {
        // Fallback to newline
        const lineEnd = tail.indexOf('\n');
        if (lineEnd >= 0 && lineEnd < stopIndex) stopIndex = lineEnd;
    }

    const out = normalizeText(tail.slice(0, stopIndex));
    return out.length ? out : undefined;
}

/**
 * Parse the structured detail HTML from POST request
 * HTML structure uses: <span class="d-textStrong">Label</span> paired with <span class="d-text">Value</span>
 */
function parseDetailFieldsFromHtml(detailHtml: string): PartialDeep<Property> {
    // Extract all label-value pairs from the structured HTML
    // Pattern: <span class="d-textStrong">LABEL</span></div><div...><span class="d-text">VALUE</span>
    const labelValuePattern = /<span class="d-textStrong">([^<]+)<\/span>[\s\S]*?<span class="d-text">([^<]*)<\/span>/g;
    
    const fields: Record<string, string> = {};
    let match: RegExpExecArray | null;
    
    while ((match = labelValuePattern.exec(detailHtml)) !== null) {
        const label = normalizeText(match[1]);
        const value = normalizeText(match[2]);
        if (label && value) {
            fields[label] = value;
        }
    }
    
    // Helper to get a field value
    const getField = (label: string): string | undefined => fields[label] || undefined;
    
    // Helper to parse numeric
    const getNumeric = (label: string): number | undefined => {
        const v = getField(label);
        if (!v) return undefined;
        const cleaned = v.replace(/[^\d.]/g, '');
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : undefined;
    };
    
    // Helper to parse currency
    const getCurrency = (label: string): number | undefined => {
        const v = getField(label);
        return parseCurrencyToNumber(v);
    };
    
    // Helper to parse Yes/No
    const getYesNo = (label: string): string | undefined => parseYesNo(getField(label));
    
    // Helper to parse comma-separated list
    const getList = (label: string): string[] | undefined => {
        const v = getField(label);
        if (!v) return undefined;
        const items = v.split(',').map(s => s.trim()).filter(Boolean);
        return items.length > 0 ? items : undefined;
    };
    
    // Parse rooms - look for Room Type / Room Dimensions pairs
    const parsedRooms: { type: string; dimensions: string }[] = [];
    const roomTypePattern = /<span class="d-textStrong">Room Type<\/span>[\s\S]*?<span class="d-text">([^<]+)<\/span>/g;
    const roomDimPattern = /<span class="d-textStrong">Room Dimensions<\/span>[\s\S]*?<span class="d-text">([^<]+)<\/span>/g;
    
    const roomTypes: string[] = [];
    const roomDims: string[] = [];
    
    while ((match = roomTypePattern.exec(detailHtml)) !== null) {
        roomTypes.push(normalizeText(match[1]));
    }
    while ((match = roomDimPattern.exec(detailHtml)) !== null) {
        roomDims.push(normalizeText(match[1]));
    }
    
    for (let i = 0; i < Math.min(roomTypes.length, roomDims.length); i++) {
        if (roomTypes[i] && roomDims[i]) {
            parsedRooms.push({ type: roomTypes[i], dimensions: roomDims[i] });
        }
    }
    
    // Extract description from d-textSoft (remarks section)
    const remarksMatch = detailHtml.match(/<span class="d-textSoft[^"]*">([^<]+)<\/span>/);
    const description = remarksMatch ? normalizeText(remarksMatch[1]) : undefined;
    
    // Extract agent info from Listing Info section
    const agentName = getField('List Agent Full Name');
    const agentCompany = getField('List Office Name');
    
    // Extract directions
    const directions = getField('Directions');

    return {
        description,
        
        // General Description
        propertyType: getField('Property Type'),
        propertySubType: getField('Property Sub Type'),
        originalListPrice: getCurrency('Original List Price'),
        forSale: getField('For Sale'),
        subdivision: getField('Subdivision Name') || getField('Subdivision'),
        county: getField('County'),
        parcelNumber: getField('Parcel Number'),
        taxLot: getField('Tax Lot'),
        taxBlock: getField('Tax Block'),
        taxLegalDescription: getField('Tax Legal Description'),
        multiParcelIdYn: getYesNo('Multi Parcel IDYN') || getYesNo('Multi Parcel ID YN'),
        municipalUtilityDistrictYn: getYesNo('Municipal Utility District YN'),

        // Property Info
        sqft: getNumeric('SqFt'),
        beds: getNumeric('Beds Total'),
        baths: getNumeric('Bath Full'),
        halfBaths: getNumeric('Baths Half'),
        fireplaces: getNumeric('Fireplaces Total'),
        livingAreas: getNumeric('# Living Areas'),
        diningAreas: getNumeric('# Dining Areas'),
        stories: getNumeric('Stories Total'),
        yearBuilt: (() => {
            const v = getField('Year Blt/Src');
            if (!v) return undefined;
            const m = v.match(/(\d{4})/);
            return m ? Number(m[1]) : undefined;
        })(),
        garageSpaces: getNumeric('Garage Spaces'),
        carportSpaces: getNumeric('Carport Spaces'),
        coveredSpaces: getNumeric('Covered Spaces'),
        garageSize: getField('Garage Szie') || getField('Garage Size'),
        hoaType: getField('HOA Type'),
        hoa: getCurrency('HOA'),
        acres: getNumeric('Lot Size Area'),
        accessibilityFeaturesYn: getYesNo('Accessibility Features YN'),

        // Green Info
        greenType: getField('Type'),
        greenStatus: getField('Status'),

        // School Info
        schools: {
            district: getField('School District'),
            elementary: getField('Elementary School Name'),
            middle: getField('Middle School Name'),
            high: getField('High School Name'),
        },

        // Lease Info
        availableDate: getField('Available Date'),
        appliancesYn: getYesNo('Appliances YN'),
        applicationFee: getCurrency('Application Fee Amount'),
        depositAmount: getCurrency('Deposit Amount'),
        petDeposit: getCurrency('Deposit Pet'),
        petsAllowed: getNumeric('# Pets Allowed'),
        monthlyPetFee: getCurrency('Monthly Pet Fee'),
        furnishedYn: getYesNo('Furnished YN'),
        numVehicles: getNumeric('# Vehicles'),
        daysGuestsAllowed: getNumeric('# Days Guests Allowed'),
        nonRefundablePetFeeYn: getYesNo('Non Refundable Pet Fee YN'),
        moniesRequired: getField('Monies Required'),
        tenantPays: getList('Tenant Pays'),

        // Features
        fireplaceFeatures: getField('Fireplace Features'),
        flooring: getField('Flooring'),
        architecturalStyle: getField('Architectural Style'),
        heating: getField('Heating'),
        cooling: getField('Cooling'),
        constructionMaterials: getList('Construction Materials'),
        exteriorFeatures: getList('Exterior Features'),
        accessibilityFeatures: getList('Accessibility Features'),
        poolFeatures: getList('Pool Features'),
        fencing: getList('Fencing'),
        housingType: getField('Housing Type'),
        parkingFeatures: getList('Parking Features'),
        securityFeatures: getList('Security Features'),
        otherEquipment: getList('Other Equipment'),
        waterfrontYn: getYesNo('Waterfront YN'),
        lakePumpYn: getYesNo('Lake Pump YN'),

        // Directions
        directions,
        publicDrivingDirections: directions,

        // Agent Info
        agentName,
        agentCompany,
        
        rooms: parsedRooms.length ? parsedRooms : undefined,
    };
}

export interface PropertySearchResult {
    items: Property[];
    total: number;
    totalPages: number;
    page: number;
    perPage: number;
}

export async function searchProperties(params: PropertySearchParams & { page?: number; perPage?: number } = {}): Promise<PropertySearchResult> {
    try {
        const perPage = params.perPage && params.perPage > 0 ? params.perPage : 20;
        const page = params.page && params.page > 0 ? params.page : 1;

        // Fetch all listings from all MLS pages
        const allListings = await fetchAllMlsListings();
        console.log('Total MLS listings fetched:', allListings.length);

        if (allListings.length === 0) {
            console.warn('No listings found from MLS');
            return { items: [], total: 0, totalPages: 0, page, perPage };
        }

        // Apply filters if provided
        let filteredListings = allListings;

        if (params.location) {
            const loc = params.location.toLowerCase();
            filteredListings = filteredListings.filter(p =>
                p.city.toLowerCase().includes(loc) ||
                p.state.toLowerCase().includes(loc) ||
                p.zipCode.includes(loc) ||
                p.address.toLowerCase().includes(loc)
            );
        }

        if (params.minPrice) {
            filteredListings = filteredListings.filter(p => p.price >= params.minPrice!);
        }

        if (params.maxPrice) {
            filteredListings = filteredListings.filter(p => p.price <= params.maxPrice!);
        }

        if (params.beds) {
            filteredListings = filteredListings.filter(p => p.beds >= params.beds!);
        }

        if (params.baths) {
            filteredListings = filteredListings.filter(p => p.baths >= params.baths!);
        }

        if (params.q) {
            const q = params.q.toLowerCase();
            filteredListings = filteredListings.filter(p =>
                p.address.toLowerCase().includes(q) ||
                p.city.toLowerCase().includes(q) ||
                p.state.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.propertyType.toLowerCase().includes(q) ||
                (p.subdivision && p.subdivision.toLowerCase().includes(q))
            );
        }

        // Apply pagination
        const start = (page - 1) * perPage;
        const items = filteredListings.slice(start, start + perPage);

        console.log(`Returning page ${page}: ${items.length} items of ${filteredListings.length} filtered`);

        return {
            items,
            total: filteredListings.length,
            totalPages: Math.max(1, Math.ceil(filteredListings.length / perPage)),
            page,
            perPage
        };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { items: [], total: 0, totalPages: 0, page: params.page || 1, perPage: params.perPage || 25 };
    }
}

// Cache for all MLS listings to avoid refetching on every request
let cachedListings: Property[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchAllMlsListings(): Promise<Property[]> {
    // Return cached data if still valid
    if (cachedListings.length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
        console.log('Using cached MLS listings:', cachedListings.length);
        return cachedListings;
    }

    const baseUrl = `${MLS_API_BASE}?c=${MLS_COMPRESSED_C}&idx=${MLS_API_KEY}`;
    const allListings: Property[] = [];
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    };

    console.log('Fetching all MLS pages...');

    // Fetch first page
    const res = await fetchWithRetry(baseUrl, { headers, cache: 'no-store' });
    if (!res.ok) {
        console.error('MLS API responded with non-OK status', res.status);
        return [];
    }

    let html = await res.text();

    // Parse image map from scripts
    const imageMap = parseImageMap(html);
    
    // Cache viewstate for detail POST requests
    const vsMatch = html.match(/id="__VIEWSTATE"\s+value="([^"]+)"/);
    const vsgMatch = html.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/);
    if (vsMatch) {
        cachedViewState = vsMatch[1];
        cachedViewStateGenerator = vsgMatch ? vsgMatch[1] : '';
    }

    // Parse first page listings
    const firstPageListings = parseHtmlListings(html, imageMap, 0);
    allListings.push(...firstPageListings);
    console.log('Page 1:', firstPageListings.length, 'listings');

    // Extract total count and pagination info
    const paginationMatch = html.match(/<b>(\d+)<\/b>-<b>(\d+)<\/b>\s*of\s*<b>(\d+)<\/b>/);
    const total = paginationMatch ? parseInt(paginationMatch[3]) : firstPageListings.length;
    const mlsPerPage = 24; // MLS returns 24 per page
    const totalMlsPages = Math.ceil(total / mlsPerPage);

    console.log(`Total MLS listings: ${total}, Pages: ${totalMlsPages}`);

    // Extract viewstate for POST pagination
    const viewstateMatch = html.match(/id="__VIEWSTATE"\s+value="([^"]+)"/);
    const viewstateGeneratorMatch = html.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/);
    const eventValidationMatch = html.match(/id="__EVENTVALIDATION"\s+value="([^"]+)"/);

    if (viewstateMatch && totalMlsPages > 1) {
        const viewstate = viewstateMatch[1];
        const viewstateGenerator = viewstateGeneratorMatch ? viewstateGeneratorMatch[1] : '';
        const eventValidation = eventValidationMatch ? eventValidationMatch[1] : '';

        // Fetch remaining pages
        for (let pageNum = 2; pageNum <= totalMlsPages; pageNum++) {
            const offset = (pageNum - 1) * mlsPerPage;

            const formData = new URLSearchParams();
            formData.append('__VIEWSTATE', viewstate);
            formData.append('__VIEWSTATEGENERATOR', viewstateGenerator);
            formData.append('__EVENTVALIDATION', eventValidation);
            formData.append('__EVENTTARGET', 'm_DisplayCore');
            formData.append('__EVENTARGUMENT', `Redisplay|,,${offset}`);

            try {
                const pageRes = await fetchWithRetry(baseUrl, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                });

                html = await pageRes.text();
                // Parse image map for this page
                const validImageMap = parseImageMap(html);
                const pageListings = parseHtmlListings(html, validImageMap, offset);
                allListings.push(...pageListings);
                console.log(`Page ${pageNum}:`, pageListings.length, 'listings');
            } catch (err) {
                console.error(`Error fetching page ${pageNum}:`, err);
            }
        }
    }

    // Update cache
    cachedListings = allListings;
    cacheTimestamp = Date.now();

    console.log('Total listings fetched:', allListings.length);
    return allListings;
}

// Parse HTML listings from MLS Matrix response
function parseHtmlListings(html: string, imageMap: Record<string, string[]> = {}, startIndex: number = 0): Property[] {
    const listings: Property[] = [];

    // Find all record blocks: <!--@Record:549544577@-->
    const recordPattern = /<!--@Record:(\d+)@-->([\s\S]*?)(?=<!--@Record:\d+@-->|$)/g;
    let match: RegExpExecArray | null;
    let localIndex = 0;

    while ((match = recordPattern.exec(html)) !== null) {
        const mlsNumber = match[1];
        const recordHtml = match[2];

        try {
            const listing = parseRecordHtml(mlsNumber, recordHtml);
            if (listing && listing.address) {
                // Track list index for detail fetch
                listing.listIndex = startIndex + localIndex;
                
                // Add additional images from map if available
                if (imageMap[mlsNumber] && imageMap[mlsNumber].length > 0) {
                     // Prefer Size=5 (Large), falling back to what we found
                     listing.images = imageMap[mlsNumber];
                }
                listings.push(listing);
            }
            localIndex++;
        } catch (err) {
            console.error(`Error parsing record ${mlsNumber}:`, err);
            localIndex++;
        }
    }

    return listings;
}

function parseImageMap(html: string): Record<string, string[]> {
    const imageMap: Record<string, string[]> = {};
    
    // Pattern to find ImageViewerResponsiveClass calls
    // ImageViewerResponsiveClass('#m_DisplayCore_dpy1', 23, [], {L:1,tid:9,key:'550298327',...}, {t:...,m:...,l:...}, 0, true, 'true', '550298327', {'0_1':'...'})
    
    const scriptPattern = /ImageViewerResponsiveClass\s*\([^,]+,[^,]+,[^,]+,\s*{[^}]*key:'(\d+)'[^}]*}.*?,\s*({'[^']+'\s*:[^}]+})\)/g;
    let match: RegExpExecArray | null;
    
    while ((match = scriptPattern.exec(html)) !== null) {
        const key = match[1];
        const jsonStr = match[2];
        
        try {
            // Fix quotes to make it valid JSON (simple approximation)
            // The string is like {'0_1':'url', '1_1':'url'}
            // We can just extract URLs directly using regex
            const urlPattern = /'(\d+)_(\d+)':'([^']+)'/g;
            let urlMatch;
            const images: { index: number, size: number, url: string }[] = [];
            
            while ((urlMatch = urlPattern.exec(jsonStr)) !== null) {
                images.push({
                    index: parseInt(urlMatch[1]),
                    size: parseInt(urlMatch[2]),
                    url: urlMatch[3]
                });
            }
            
            if (images.length > 0) {
                // Group by size
                // We want largest size (5)
                const largeImages = images.filter(img => img.size === 5).sort((a, b) => a.index - b.index);
                const mediumImages = images.filter(img => img.size === 2).sort((a, b) => a.index - b.index);
                const smallImages = images.filter(img => img.size === 1).sort((a, b) => a.index - b.index);
                
                let bestImages = largeImages;
                if (bestImages.length === 0) bestImages = mediumImages;
                if (bestImages.length === 0) bestImages = smallImages;
                
                imageMap[key] = bestImages.map(img => img.url);
            }
        } catch (e) {
            console.error('Error parsing image JSON for key', key, e);
        }
    }
    
    return imageMap;
}

// Parse a single record block
function parseRecordHtml(mlsNumber: string, html: string): Property | null {
    // Extract image URL from GetMedia.ashx - keep original size
    const imgMatch = html.match(/src="(https:\/\/ntrdd\.mlsmatrix\.com\/mediaserver\/GetMedia\.ashx[^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : '/images/dashboards.png';

    // Extract address from the link with __doPostBack
    const addrMatch = html.match(/<a[^>]*href="javascript:__doPostBack[^"]*"[^>]*>([^<]+)<\/a>/);
    const address = addrMatch ? addrMatch[1].trim() : '';

    if (!address) {
        return null; // Skip if no address found
    }

    // Extract city, state, zip: " Saginaw, Texas 76179"
    // Try multiple patterns to be robust
    let city = '', state = 'TX', zipCode = '';
    
    const cityStateMatch = html.match(/>\s*([A-Za-z\s.-]+),\s*(Texas|TX)\s+(\d{5})\s*</);
    if (cityStateMatch) {
        city = cityStateMatch[1].trim();
        state = 'TX';
        zipCode = cityStateMatch[3].trim();
    } else {
        // Fallback: search for pattern "City, TX Zip" anywhere
        const fallbackMatch = html.match(/([A-Za-z\s.-]+),\s*(Texas|TX)\s+(\d{5})/);
        if (fallbackMatch) {
            city = fallbackMatch[1].trim(); 
            // Cleanup city if it caught HTML tag start/end
            city = city.replace(/^.*>/, '').trim(); 
            state = 'TX';
            zipCode = fallbackMatch[3].trim();
        }
    }

    // Extract price: >$3,321<
    const priceMatch = html.match(/>\$([0-9,]+)</);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;

    // Extract status from Status_ACT class
    const statusMatch = html.match(/Status_([A-Z]+)/);
    let status = 'Active';
    if (statusMatch) {
        switch (statusMatch[1]) {
            case 'ACT': status = 'Active'; break;
            case 'PND': status = 'Pending'; break;
            case 'SLD': status = 'Sold'; break;
            default: status = statusMatch[1];
        }
    }

    // Extract property type and subdivision from d-section span
    // Example: "Residential Lease Property, Single Family, in the Whisperwood Estates Addition Subdivision"
    const sectionMatch = html.match(/<span class="d-section">([^<]+)<\/span>/);
    let propertyType = 'Residential';
    let propertySubType = '';
    let subdivision = '';

    if (sectionMatch) {
        // The MLS often inserts hard newlines inside words (e.g. "Subd\nivision")
        // so normalize whitespace before parsing.
        const sectionText = normalizeText(sectionMatch[1]);

        const typeMatch = sectionText.match(/^([^,]+),\s*([^,]+),\s*in\s+(?:the\s+)?(.+?)\s*Subdivision/i);
        if (typeMatch) {
            propertyType = typeMatch[1].trim();
            propertySubType = typeMatch[2].trim();
            subdivision = typeMatch[3].trim();
        } else {
            const parts = sectionText.split(',');
            if (parts.length >= 1) propertyType = parts[0].trim();
            if (parts.length >= 2) propertySubType = parts[1].trim();

            // Best-effort subdivision extraction even when the first regex fails
            const subMatch = sectionText.match(/in\s+(?:the\s+)?(.+?)\s*Subdivision/i);
            if (subMatch) subdivision = subMatch[1].trim();
        }
    }

    // Extract beds: >4</span><span...>Beds,</span>
    const bedsMatch = html.match(/>(\d+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>Beds/);
    const beds = bedsMatch ? parseInt(bedsMatch[1]) : 0;

    // Extract full baths
    const fullBathsMatch = html.match(/>(\d+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>Full Baths/);
    const baths = fullBathsMatch ? parseInt(fullBathsMatch[1]) : 0;

    // Extract half baths
    const halfBathsMatch = html.match(/>(\d+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>Half Baths/);
    const halfBaths = halfBathsMatch ? parseInt(halfBathsMatch[1]) : undefined;

    // Extract sqft: >2,416</span><span...>SqFt,</span>
    const sqftMatch = html.match(/>([\d,]+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>SqFt/);
    const sqft = sqftMatch ? parseInt(sqftMatch[1].replace(/,/g, '')) : 0;

    // Extract year built: >Built in</span><span...>1998</span>
    const yearMatch = html.match(/Built in<\/span><span[^>]*>(\d{4})/);
    const yearMatch2 = yearMatch ? null : html.match(/Built\s*in[^\d]{0,20}(\d{4})/i);
    const yearBuilt = yearMatch ? parseInt(yearMatch[1]) : (yearMatch2 ? parseInt(yearMatch2[1]) : 0);

    // Extract description from d-textSoft span
    const descMatch = html.match(/<span class="d-textSoft">([^<]+)<\/span>/);
    const description = descMatch ? descMatch[1].trim() : '';

    // Check for "New Listing" badge
    const isNewListing = html.includes('New Listing');

    // Extract additional detailed fields extraction moved to unified block below

    // Extract Agent Information (Improved)
    // Supports formats like "List Agent Full NameKrish Reddy" (concatenated text) or structured
    // Check for "List Agent Full Name" followed immediately by text
    let agentName = '';
    const agentNamePattern = /List Agent Full Name\s*([A-Za-z0-9\s.]+)(?:<|\n|$)/;
    const agentNameMatch = html.match(agentNamePattern);
    
    // Also try the original structured match
    const agentNameStructMatch = html.match(/List Agent Full Name[^<]*<\/[^>]+>\s*<[^>]+>([^<]+)</i);
    
    if (agentNameStructMatch) {
        agentName = agentNameStructMatch[1].trim();
    } else if (agentNameMatch) {
         agentName = agentNameMatch[1].trim();
    } else {
         // Fallback: "List Agent: Name"
         const listAgentTextMatch = html.match(/List Agent:\s*([^(<\n]+)/i);
         if (listAgentTextMatch) agentName = listAgentTextMatch[1].trim();
    }
    
    if (!agentName || agentName === 'Agent Information Not Available') {
        agentName = 'Agent Information Not Available';
    }

    // Agent Company (Improved)
    let agentCompany = undefined;
    const companyPattern = /List Office Name\s*([A-Za-z0-9\s.,&]+)(?:<|\n|$)/;
    const companyMatch = html.match(companyPattern);
    const companyStructMatch = html.match(/List Office Name[^<]*<\/[^>]+>\s*<[^>]+>([^<]+)</i);

    if (companyStructMatch) {
        agentCompany = companyStructMatch[1].trim();
    } else if (companyMatch) {
        agentCompany = companyMatch[1].trim();
    }

    // Extract Agent Phone
    let agentPhone = '+1 (123) 456-7890';
    // Try to find phone near agent name or generally in contact section
    const phonePattern = /(?:List Agent|Contact).*?(\(\d{3}\)\s*\d{3}-\d{4})/;
    const phoneMatch = html.match(phonePattern);
    if (phoneMatch) {
        agentPhone = phoneMatch[1];
    }

    // Helper to extract fields by label
    const extractField = (label: string) => {
        // pattern: Label followed by value, maybe ignoring tags
        // Regex: Label \s* (value...)
        const regex = new RegExp(`${label}\\s*([A-Za-z0-9\\s.-]+)(?:<|\n|$)`, 'i');
        const m = html.match(regex);
        if (m) return m[1].trim();
        
        // Try structured
        const regexStruct = new RegExp(`${label}[^<]*<\\/[^>]+>\\s*<[^>]+>([^<]+)<`, 'i');
        const mStruct = html.match(regexStruct);
        if (mStruct) return mStruct[1].trim();

        return undefined;
    };

    // Extract Schools (Improved)
    const schools = {
        district: extractField('School District'),
        elementary: extractField('Elementary School Name'),
        middle: extractField('Middle School Name'),
        high: extractField('High School Name'),
    };
    
    const hasSchools = Object.values(schools).some(v => v !== undefined);
    const validSchools = hasSchools ? schools : undefined;


    // Extract additional detailed fields using extractField to avoid duplication logic
    // We reuse the 'subdivision' variable declared at the top
    const subDivNew = extractField('Subdivision') || extractField('Subdivision Name');
    if (subDivNew) subdivision = subDivNew;

    const county = extractField('County');
    const parcelNumber = extractField('Parcel Number');
    const taxLot = extractField('Tax Lot');
    const taxBlock = extractField('Tax Block');
    
    // Numeric fields needing parsing
    const garageStr = extractField('Garage Spaces');
    const garageSpaces = garageStr ? parseInt(garageStr) : undefined;
    
    const hoaType = extractField('HOA Type');
    const hoaAnnual = extractField('HOA/ Annually') || extractField('HOA/Annually');
    const hoa = hoaAnnual ? parseInt(hoaAnnual.replace(/[^\d.]/g, '')) : undefined;

    const acresStr = extractField('Lot Size Area');
    const acres = acresStr ? parseFloat(acresStr) : undefined;

    const fireplacesStr = extractField('Fireplaces Total');
    const fireplaces = fireplacesStr ? parseInt(fireplacesStr) : undefined;

    const liveAreaStr = extractField('# Living Areas');
    const livingAreas = liveAreaStr ? parseInt(liveAreaStr) : undefined;

    const dineAreaStr = extractField('# Dining Areas');
    const diningAreas = dineAreaStr ? parseInt(dineAreaStr) : undefined;

    // Interior/Exterior Features
    const extractFeatureList = (label: string): string[] => {
         const regex = new RegExp(`${label}\\s*([A-Za-z0-9\\s,.-]+)(?:<|\n|$)`, 'i');
         const m = html.match(regex);
         if (m) return m[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
         return [];
    };

    const constructionMaterials = extractFeatureList('Construction Materials');
    const exteriorFeatures = extractFeatureList('Exterior Features');
    const parkingFeatures = extractFeatureList('Parking Features');
    const fencing = extractFeatureList('Fencing');
    
    const flooring = extractField('Flooring');
    const heating = extractField('Heating');
    const cooling = extractField('Cooling');
    const architecturalStyle = extractField('Architectural Style');

    // Lease Info
    const availableDate = extractField('Available Date');
    const depositStr = extractField('Deposit Amount');
    const depositAmount = depositStr ? parseInt(depositStr.replace(/,/g, '').replace('$', '')) : undefined;
    const appFeeStr = extractField('Application Fee Amount');
    const applicationFee = appFeeStr ? parseInt(appFeeStr.replace(/,/g, '').replace('$', '')) : undefined;

    // Rooms
    const rooms: {type: string, dimensions: string}[] = [];
    const roomBlockMatch = html.match(/Rooms([\s\S]*?)Property Info/i);
    if (roomBlockMatch) {
        const roomBlock = roomBlockMatch[1];
        const typeMatches = Array.from(roomBlock.matchAll(/Room Type\s*([A-Za-z0-9\s-]+)/g));
        const dimMatches = Array.from(roomBlock.matchAll(/Room Dimensions\s*(\d+\s*x\s*\d+)/g));
        
        for (let i = 0; i < Math.min(typeMatches.length, dimMatches.length); i++) {
            rooms.push({
                type: typeMatches[i][1].trim(),
                dimensions: dimMatches[i][1].trim()
            });
        }
    }

    // Open House
    const openHouseDate = extractField('Open House Date');
    const openHouseTime = extractField('Open House Time');
    let openHouse = undefined;
    if (openHouseDate) {
         // Parse time "1:00 PM - 3:00 PM"
         const times = openHouseTime ? openHouseTime.split('-').map(t => t.trim()) : ['',''];
         openHouse = {
             date: openHouseDate,
             startTime: times[0],
             endTime: times[1]
         };
    }

    return {
        id: mlsNumber,
        mlsNumber,
        address,
        city,
        state,
        zipCode,
        price,
        beds,
        baths,
        halfBaths,
        sqft,
        propertyType,
        propertySubType: propertySubType || undefined,
        yearBuilt,
        status,
        listingDate: isNewListing ? 'New' : '',
        description,
        images: [imageUrl],
        features: [],
        agentName,
        agentPhone,
        agentEmail: '',
        agentCompany,
        openHouse,
        lotSize: acres,
        lotSizeUnits: acres ? 'Acres' : undefined,
        subdivision: subdivision || undefined,
        county,
        parcelNumber,
        taxLot,
        taxBlock,
        garageSpaces,
        hoaType,
        hoa,
        acres,
        fireplaces,
        livingAreas,
        diningAreas,
        schools: validSchools,
        flooring,
        heating,
        cooling,
        architecturalStyle,
        constructionMaterials,
        exteriorFeatures,
        parkingFeatures,
        fencing,
        rooms,
        availableDate,
        depositAmount,
        applicationFee,
        pricePerSqft: sqft > 0 ? Math.round(price / sqft) : undefined,
    };
}

// Get property by ID
export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        // Use the cached listings function to search all properties
        const allListings = await fetchAllMlsListings();
        const base = allListings.find(p => p.id === id || p.mlsNumber === id);
        
        if (!base) return null;

        // Use the list index for detail fetch (POST requires index, not MLS number)
        const listIndex = base.listIndex;
        
        if (listIndex === undefined || listIndex < 0) {
            console.warn('No list index available for property:', id);
            return base;
        }

        // Fetch detail HTML for richer fields (full description, schools, lease info, etc)
        const detailHtml = await fetchMlsDetailHtml(listIndex);
        if (!detailHtml) return base;

        const detail = parseDetailFieldsFromHtml(detailHtml);

        // Normalize schools: drop if all empty
        const mergedSchools = detail.schools;
        const hasSchoolValues = mergedSchools && Object.values(mergedSchools).some(v => Boolean(v && String(v).trim()));

        const merged: Property = {
            ...base,
            // Only override when detail provides a value
            ...(Object.fromEntries(Object.entries(detail).filter(([, v]) => v !== undefined)) as Partial<Property>),
            schools: hasSchoolValues ? (mergedSchools as Property['schools']) : base?.schools,
        };

        // Prefer base agent name/company if detail didn't provide
        if (!merged.agentName || merged.agentName === 'Agent Information Not Available') {
            merged.agentName = base.agentName;
        }
        if (!merged.agentCompany && base.agentCompany) {
            merged.agentCompany = base.agentCompany;
        }

        // Prefer full description from detail (avoid truncated card snippet)
        if (detail.description && detail.description.length > 0) {
            merged.description = detail.description;
        }

        // Fix NaN-ish numeric overrides (if parsing failed)
        if (!Number.isFinite(merged.price)) merged.price = base?.price || 0;
        if (!Number.isFinite(merged.sqft)) merged.sqft = base?.sqft || 0;

        return merged;
    } catch (error) {
        console.error('Error fetching property by ID:', error);
        return null;
    }
}

export function formatPrice(price: number): string {
    if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString('en-US')}`;
}

export function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
}
