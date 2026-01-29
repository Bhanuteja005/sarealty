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
    openHouse?: {
        date: string;
        startTime: string;
        endTime: string;
    };
    lotSize?: number;
    lotSizeUnits?: string;
    parking?: number;
    hoa?: number;
    pricePerSqft?: number;
    latitude?: number;
    longitude?: number;
    mlsNumber?: string;
    parcelNumber?: string;
    subdivision?: string;
    taxYear?: number;
    taxAnnualAmount?: number;
    schools?: {
        elementary?: string;
        middle?: string;
        high?: string;
        district?: string;
    };
    roomDimensions?: {
        living?: string;
        kitchen?: string;
        masterBed?: string;
    };
    acres?: number;
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
    const res = await fetch(baseUrl, { headers, cache: 'no-store' });
    if (!res.ok) {
        console.error('MLS API responded with non-OK status', res.status);
        return [];
    }

    let html = await res.text();

    // Parse first page listings
    const firstPageListings = parseHtmlListings(html);
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
                const pageRes = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                });

                html = await pageRes.text();
                const pageListings = parseHtmlListings(html);
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
function parseHtmlListings(html: string): Property[] {
    const listings: Property[] = [];

    // Find all record blocks: <!--@Record:549544577@-->
    const recordPattern = /<!--@Record:(\d+)@-->([\s\S]*?)(?=<!--@Record:\d+@-->|$)/g;
    let match: RegExpExecArray | null;

    while ((match = recordPattern.exec(html)) !== null) {
        const mlsNumber = match[1];
        const recordHtml = match[2];

        try {
            const listing = parseRecordHtml(mlsNumber, recordHtml);
            if (listing && listing.address) {
                listings.push(listing);
            }
        } catch (err) {
            console.error(`Error parsing record ${mlsNumber}:`, err);
        }
    }

    return listings;
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
    const cityStateMatch = html.match(/>\s*([A-Za-z\s]+),\s*(Texas|TX)\s+(\d{5})\s*</);
    const city = cityStateMatch ? cityStateMatch[1].trim() : '';
    const state = cityStateMatch ? 'Texas' : 'TX';
    const zipCode = cityStateMatch ? cityStateMatch[3].trim() : '';

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
        const sectionText = sectionMatch[1];
        const typeMatch = sectionText.match(/^([^,]+),\s*([^,]+),\s*in the\s+(.+?)\s*Subdivision/i);
        if (typeMatch) {
            propertyType = typeMatch[1].trim();
            propertySubType = typeMatch[2].trim();
            subdivision = typeMatch[3].trim();
        } else {
            const parts = sectionText.split(',');
            if (parts.length >= 1) propertyType = parts[0].trim();
            if (parts.length >= 2) propertySubType = parts[1].trim();
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
    const yearBuilt = yearMatch ? parseInt(yearMatch[1]) : 0;

    // Extract description from d-textSoft span
    const descMatch = html.match(/<span class="d-textSoft">([^<]+)<\/span>/);
    const description = descMatch ? descMatch[1].trim() : '';

    // Check for "New Listing" badge
    const isNewListing = html.includes('New Listing');

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
        agentName: '',
        agentPhone: '+1 (123) 456-7890',
        agentEmail: '',
        subdivision: subdivision || undefined,
        pricePerSqft: sqft > 0 ? Math.round(price / sqft) : undefined,
    };
}

// Get property by ID
export async function getPropertyById(id: string): Promise<Property | null> {
    try {
        // Use the cached listings function to search all properties
        const allListings = await fetchAllMlsListings();
        const property = allListings.find(p => p.id === id || p.mlsNumber === id);
        return property || null;
    } catch (error) {
        console.error('Error fetching property by ID:', error);
        return null;
    }
}

export function formatPrice(price: number): string {
    if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
}

export function formatNumber(num: number): string {
    return num.toLocaleString();
}
