// Test script to verify MLS API fetch and parsing
// Run with: node src/test-mls-fetch.mjs

const MLS_API_BASE = 'https://ntrdd.mlsmatrix.com/Matrix/Public/IDXSearch.aspx';
const MLS_API_KEY = 'c2c9438e';
const MLS_COMPRESSED_C = 'H4sIAAAAAAAEAItWMlDSySvNyRklqEEoHZpzeNnhBYdnowdqLABfRk5uaQEAAA))';

async function testMlsFetch() {
    const urlString = `${MLS_API_BASE}?c=${MLS_COMPRESSED_C}&idx=${MLS_API_KEY}`;
    
    console.log('='.repeat(60));
    console.log('MLS API Test Script');
    console.log('='.repeat(60));
    console.log('URL:', urlString);
    console.log('');

    try {
        const response = await fetch(urlString, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
        });

        console.log('Response Status:', response.status, response.ok ? '✓' : '✗');
        
        if (!response.ok) {
            console.error('Failed to fetch');
            return;
        }

        const html = await response.text();
        console.log('Response Length:', html.length, 'characters');
        console.log('');

        // Check for pagination info
        const paginationMatch = html.match(/<b>(\d+)<\/b>-<b>(\d+)<\/b>\s*of\s*<b>(\d+)<\/b>/);
        if (paginationMatch) {
            console.log(`Pagination: Showing ${paginationMatch[1]}-${paginationMatch[2]} of ${paginationMatch[3]} total listings`);
        }
        console.log('');

        // Parse listings
        const listings = parseHtmlListings(html);
        console.log('Parsed Listings:', listings.length);
        console.log('');

        if (listings.length > 0) {
            console.log('='.repeat(60));
            console.log('Sample Listings:');
            console.log('='.repeat(60));
            
            listings.slice(0, 3).forEach((listing, i) => {
                console.log(`\n--- Listing ${i + 1} ---`);
                console.log('MLS#:', listing.mlsNumber);
                console.log('Address:', listing.address);
                console.log('Location:', `${listing.city}, ${listing.state} ${listing.zipCode}`);
                console.log('Price:', `$${listing.price.toLocaleString()}`);
                console.log('Beds:', listing.beds, '| Baths:', listing.baths, listing.halfBaths ? `(+${listing.halfBaths} half)` : '');
                console.log('SqFt:', listing.sqft.toLocaleString());
                console.log('Year Built:', listing.yearBuilt);
                console.log('Type:', listing.propertyType, listing.propertySubType ? `- ${listing.propertySubType}` : '');
                console.log('Subdivision:', listing.subdivision || 'N/A');
                console.log('Status:', listing.status);
                console.log('Image:', listing.images[0]?.substring(0, 80) + '...');
                console.log('Description:', listing.description?.substring(0, 100) + '...');
            });

            console.log('\n' + '='.repeat(60));
            console.log('TEST PASSED ✓');
            console.log(`Successfully parsed ${listings.length} listings from MLS`);
            console.log('='.repeat(60));
        } else {
            console.log('TEST FAILED ✗');
            console.log('No listings parsed from HTML');
            console.log('HTML Preview:', html.substring(0, 1000));
        }

    } catch (error) {
        console.error('TEST FAILED ✗');
        console.error('Fetch error:', error.message);
    }
}

function parseHtmlListings(html) {
    const listings = [];
    const recordPattern = /<!--@Record:(\d+)@-->([\s\S]*?)(?=<!--@Record:\d+@-->|$)/g;
    let match;

    while ((match = recordPattern.exec(html)) !== null) {
        const mlsNumber = match[1];
        const recordHtml = match[2];

        try {
            const listing = parseRecordHtml(mlsNumber, recordHtml);
            if (listing && listing.address) {
                listings.push(listing);
            }
        } catch (err) {
            console.error(`Error parsing record ${mlsNumber}:`, err.message);
        }
    }

    return listings;
}

function parseRecordHtml(mlsNumber, html) {
    // Extract image URL - keep original URL
    const imgMatch = html.match(/src="(https:\/\/ntrdd\.mlsmatrix\.com\/mediaserver\/GetMedia\.ashx[^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : '';

    // Extract address
    const addrMatch = html.match(/<a[^>]*href="javascript:__doPostBack[^"]*"[^>]*>([^<]+)<\/a>/);
    const address = addrMatch ? addrMatch[1].trim() : '';

    if (!address) return null;

    // Extract city, state, zip
    const cityStateMatch = html.match(/>\s*([A-Za-z\s]+),\s*(Texas|TX)\s+(\d{5})\s*</);
    const city = cityStateMatch ? cityStateMatch[1].trim() : '';
    const state = 'Texas';
    const zipCode = cityStateMatch ? cityStateMatch[3].trim() : '';

    // Extract price
    const priceMatch = html.match(/>\$([0-9,]+)</);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;

    // Extract status
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

    // Extract property type and subdivision
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
        }
    }

    // Extract beds
    const bedsMatch = html.match(/>(\d+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>Beds/);
    const beds = bedsMatch ? parseInt(bedsMatch[1]) : 0;

    // Extract full baths
    const fullBathsMatch = html.match(/>(\d+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>Full Baths/);
    const baths = fullBathsMatch ? parseInt(fullBathsMatch[1]) : 0;

    // Extract half baths
    const halfBathsMatch = html.match(/>(\d+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>Half Baths/);
    const halfBaths = halfBathsMatch ? parseInt(halfBathsMatch[1]) : undefined;

    // Extract sqft
    const sqftMatch = html.match(/>([\d,]+)<\/span><span[^>]*d-text[^>]*d-fontWeight--bold[^>]*>SqFt/);
    const sqft = sqftMatch ? parseInt(sqftMatch[1].replace(/,/g, '')) : 0;

    // Extract year built
    const yearMatch = html.match(/Built in<\/span><span[^>]*>(\d{4})/);
    const yearBuilt = yearMatch ? parseInt(yearMatch[1]) : 0;

    // Extract description
    const descMatch = html.match(/<span class="d-textSoft">([^<]+)<\/span>/);
    const description = descMatch ? descMatch[1].trim() : '';

    return {
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
        yearBuilt,
        propertyType,
        propertySubType,
        subdivision,
        status,
        description,
        images: [imageUrl],
    };
}

testMlsFetch();
