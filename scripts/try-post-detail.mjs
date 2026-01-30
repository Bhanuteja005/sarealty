import fs from 'fs';

const MLS_API_BASE = 'https://ntrdd.mlsmatrix.com/Matrix/Public/IDXSearch.aspx';
const MLS_API_KEY = 'c2c9438e';
const MLS_COMPRESSED_C = 'H4sIAAAAAAAEAItWMlDSySvNyRklqEEoHZpzeNnhBYdnowdqLABfRk5uaQEAAA))';

async function main() {
  // First, fetch the page to get viewstate
  const url = `${MLS_API_BASE}?c=${encodeURIComponent(MLS_COMPRESSED_C)}&idx=${MLS_API_KEY}`;
  console.log('Fetching initial page...');
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html',
    }
  });
  
  const h = await res.text();
  console.log('HTML length:', h.length);
  
  // Extract viewstate
  const vsMatch = h.match(/id="__VIEWSTATE"\s+value="([^"]+)"/);
  const vsgMatch = h.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/);
  const evMatch = h.match(/id="__EVENTVALIDATION"\s+value="([^"]+)"/);
  
  if (!vsMatch) {
    console.log('No VIEWSTATE found');
    return;
  }
  
  console.log('VIEWSTATE length:', vsMatch[1].length);
  console.log('VIEWSTATEGENERATOR:', vsgMatch ? vsgMatch[1] : 'none');
  console.log('EVENTVALIDATION:', evMatch ? 'found' : 'none');
  
  // Try POST to get detail view for a specific listing
  // The postback is: __doPostBack('m_DisplayCore','Redisplay|69,,2')
  // which means: m_DisplayCore as event target, 'Redisplay|69,,2' as event argument
  
  const formData = new URLSearchParams();
  formData.append('__VIEWSTATE', vsMatch[1]);
  if (vsgMatch) formData.append('__VIEWSTATEGENERATOR', vsgMatch[1]);
  if (evMatch) formData.append('__EVENTVALIDATION', evMatch[1]);
  formData.append('__EVENTTARGET', 'm_DisplayCore');
  formData.append('__EVENTARGUMENT', 'Redisplay|69,,2'); // Try to get detail view for listing at index 2
  
  console.log('\nSending POST request for detail view...');
  
  const postRes = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString()
  });
  
  const postHtml = await postRes.text();
  console.log('POST response length:', postHtml.length);
  
  // Check for detail view sections
  const sections = ['General Description', 'Property Info', 'School Info', 'Lease Info', 'Room Type', 'Features'];
  console.log('\n=== Checking for detail sections ===');
  for (const s of sections) {
    const found = postHtml.toLowerCase().includes(s.toLowerCase());
    console.log(s + ':', found ? 'FOUND' : 'not found');
  }
  
  // Save post result
  fs.writeFileSync('post-detail.html', postHtml);
  console.log('\nPOST result saved to post-detail.html');
  
  // If we found detail sections, extract a sample
  if (postHtml.toLowerCase().includes('general description')) {
    const idx = postHtml.toLowerCase().indexOf('general description');
    console.log('\n=== Sample around General Description ===');
    console.log(postHtml.slice(idx, idx + 2000));
  }
}

main().catch(console.error);
