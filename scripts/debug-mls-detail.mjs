import fs from 'fs';

const MLS_API_BASE = 'https://ntrdd.mlsmatrix.com/Matrix/Public/IDXSearch.aspx';
const MLS_API_KEY = 'c2c9438e';
const MLS_COMPRESSED_C = 'H4sIAAAAAAAEAItWMlDSySvNyRklqEEoHZpzeNnhBYdnowdqLABfRk5uaQEAAA))';

const mls = process.argv[2] || '550109260';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'text/html',
      'Accept-Language': 'en-US',
    },
  });
  return await res.text();
}

(async () => {
  // Step 1: Try to get single listing page
  const keyUrl = `${MLS_API_BASE}?c=${encodeURIComponent(MLS_COMPRESSED_C)}&idx=${MLS_API_KEY}&Key=${encodeURIComponent(mls)}`;
  console.log('Key URL:', keyUrl);

  const h = await fetchHtml(keyUrl);
  console.log('HTML length:', h.length);
  
  // Extract the single record
  const recordPattern = new RegExp('<!--@Record:' + mls + '@-->([\\s\\S]*?)(?=<!--@Record:|<\\/div>\\s*<\\/div>\\s*<!--\\s*/Display panel)', 'i');
  const recordMatch = h.match(recordPattern);
  
  if (recordMatch) {
    console.log('\n=== Found record block, length:', recordMatch[1].length, '===');
    fs.writeFileSync('record-single.html', recordMatch[1]);
    console.log('Saved to record-single.html');
  }
  
  // Extract all span and div text pairs that look like label/value
  const textContent = h
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Look for label patterns
  const labelValuePatterns = [
    /d-label[^>]*>([^<]+)<\/[^>]+>\s*[^<]*<[^>]+>([^<]+)</gi,
    /d-fontWeight--bold[^>]*>([^<]+)<\/[^>]+>\s*<[^>]+>([^<]+)</gi,
  ];
  
  console.log('\n=== Extracting d-section content ===');
  const sectionRe = /<span class="d-section">([^<]*(?:<[^>]+>[^<]*)*)<\/span>/gi;
  let match;
  while ((match = sectionRe.exec(h)) !== null) {
    const txt = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log('Section:', txt.slice(0, 200));
  }
  
  // Look for labeled data patterns more broadly
  console.log('\n=== Looking for data patterns ===');
  
  // Pattern: text with d-fontSize--small followed by value
  const smallFontRe = /<[^>]+d-fontSize--small[^>]*>([^<]+)<\/[^>]+>/gi;
  const smallFonts = [];
  while ((match = smallFontRe.exec(h)) !== null) {
    smallFonts.push(match[1].trim());
  }
  console.log('Small font labels:', smallFonts.filter(s => s.length > 2 && s.length < 50).slice(0, 20).join(' | '));
  
  // Look for structured data in script tags (JSON data)
  const jsonDataRe = /ImageViewerResponsiveClass\s*\([^,]+,[^,]+,[^,]+,\s*(\{[^}]+\})/g;
  while ((match = jsonDataRe.exec(h)) !== null) {
    console.log('\nImage JSON:', match[1].slice(0, 200));
  }
  
  // Extract address links
  const addressRe = /__doPostBack\([^)]+\)[^>]*>([^<]+)<\/a>/gi;
  console.log('\n=== Address links ===');
  while ((match = addressRe.exec(h)) !== null) {
    console.log(match[1].trim());
  }
  
  // Save full HTML
  fs.writeFileSync('debug-full.html', h);
  console.log('\nFull HTML saved to debug-full.html');
})();
