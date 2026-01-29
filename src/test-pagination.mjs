// Test MLS pagination using ASP.NET postback

const MLS_API_BASE = 'https://ntrdd.mlsmatrix.com/Matrix/Public/IDXSearch.aspx';
const MLS_API_KEY = 'c2c9438e';
const MLS_COMPRESSED_C = 'H4sIAAAAAAAEAItWMlDSySvNyRklqEEoHZpzeNnhBYdnowdqLABfRk5uaQEAAA))';

async function fetchAllPages() {
    const allRecords = [];
    const baseUrl = `${MLS_API_BASE}?c=${MLS_COMPRESSED_C}&idx=${MLS_API_KEY}`;
    
    // First, fetch the initial page to get viewstate and total count
    console.log('Fetching initial page...');
    const res = await fetch(baseUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
    });
    
    let html = await res.text();
    
    // Extract total count
    const paginationMatch = html.match(/<b>(\d+)<\/b>-<b>(\d+)<\/b>\s*of\s*<b>(\d+)<\/b>/);
    const total = paginationMatch ? parseInt(paginationMatch[3]) : 0;
    console.log('Total listings:', total);
    
    // Extract records from first page
    const firstPageRecords = html.match(/<!--@Record:(\d+)@-->/g);
    console.log('First page records:', firstPageRecords ? firstPageRecords.length : 0);
    
    if (firstPageRecords) {
        allRecords.push(...firstPageRecords.map(r => r.match(/\d+/)[0]));
    }
    
    // Extract viewstate and other form fields
    const viewstateMatch = html.match(/id="__VIEWSTATE"\s+value="([^"]+)"/);
    const viewstateGeneratorMatch = html.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/);
    const eventValidationMatch = html.match(/id="__EVENTVALIDATION"\s+value="([^"]+)"/);
    
    if (!viewstateMatch) {
        console.log('No viewstate found - cannot paginate via POST');
        console.log('Checking for alternative pagination method...');
        
        // Check all pagination links to get offsets
        const pageLinks = html.match(/Redisplay\|,,(\d+)/g);
        if (pageLinks) {
            const offsets = pageLinks.map(l => parseInt(l.match(/\d+/)[0]));
            console.log('Available page offsets:', offsets);
        }
        
        return allRecords;
    }
    
    console.log('ViewState found, attempting POST pagination...');
    
    const viewstate = viewstateMatch[1];
    const viewstateGenerator = viewstateGeneratorMatch ? viewstateGeneratorMatch[1] : '';
    const eventValidation = eventValidationMatch ? eventValidationMatch[1] : '';
    
    // Fetch remaining pages (offset 24, 48, 72, etc.)
    const perPage = 24;
    const totalPages = Math.ceil(total / perPage);
    
    console.log(`Total pages to fetch: ${totalPages}`);
    
    for (let pageNum = 2; pageNum <= totalPages && pageNum <= 3; pageNum++) {
        const offset = (pageNum - 1) * perPage;
        console.log(`\nFetching page ${pageNum} (offset ${offset})...`);
        
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
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                },
                body: formData.toString(),
            });
            
            html = await pageRes.text();
            
            const pageRecords = html.match(/<!--@Record:(\d+)@-->/g);
            console.log(`  Page ${pageNum} records:`, pageRecords ? pageRecords.length : 0);
            
            // Check pagination info
            const pagMatch = html.match(/<b>(\d+)<\/b>-<b>(\d+)<\/b>\s*of\s*<b>(\d+)<\/b>/);
            if (pagMatch) {
                console.log(`  Pagination: ${pagMatch[1]}-${pagMatch[2]} of ${pagMatch[3]}`);
            }
            
            if (pageRecords) {
                const newIds = pageRecords.map(r => r.match(/\d+/)[0]);
                console.log(`  First record ID: ${newIds[0]}`);
                allRecords.push(...newIds);
            }
        } catch (err) {
            console.log(`  Error: ${err.message}`);
        }
    }
    
    console.log(`\nTotal unique records: ${new Set(allRecords).size}`);
    return allRecords;
}

fetchAllPages().catch(console.error);
