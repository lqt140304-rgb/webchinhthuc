const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join('public', 'fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

const url = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&display=swap';

function fetchBuffer(u) {
  return new Promise((resolve, reject) => {
    https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function run() {
  const cssBuffer = await fetchBuffer(url);
  const cssText = cssBuffer.toString('utf8');
  console.log('Fetched Google Fonts CSS of length', cssText.length);
  
  const blocks = cssText.split('/* ');
  const relevantBlocks = [];
  const downloadedFiles = new Map();

  for (const b of blocks) {
    if (!b.trim()) continue;
    const subset = b.substring(0, b.indexOf(' */')).trim();
    if (!['vietnamese', 'latin-ext', 'latin'].includes(subset)) continue;

    const family = (b.match(/font-family:\s*'([^']+)'/) || [])[1];
    const style = (b.match(/font-style:\s*(\w+)/) || [])[1];
    const weight = (b.match(/font-weight:\s*([^;]+)/) || [])[1];
    const range = (b.match(/unicode-range:\s*([^;]+);/) || [])[1];
    const urlMatch = (b.match(/src:\s*url\((https:[^)]+)\)/) || [])[1];

    if (!family || !style || !weight || !urlMatch) continue;

    const cleanFamily = family.toLowerCase().replace(/\s+/g, '-');
    const cleanWeight = weight.replace(/\s+/g, '').replace('..', '-');
    const filename = cleanFamily + '-' + style + '-' + cleanWeight + '-' + subset + '.woff2';
    const localPath = path.join(fontsDir, filename);

    if (!downloadedFiles.has(urlMatch)) {
      console.log('Downloading ' + filename + ' from ' + urlMatch + '...');
      const fileBuffer = await fetchBuffer(urlMatch);
      fs.writeFileSync(localPath, fileBuffer);
      downloadedFiles.set(urlMatch, { filename, size: fileBuffer.length });
    }

    const localUrl = '/fonts/' + downloadedFiles.get(urlMatch).filename;
    const localFontFace = '/* ' + subset + ' */\n' +
'@font-face {\n' +
'  font-family: \'' + family + '\';\n' +
'  font-style: ' + style + ';\n' +
'  font-weight: ' + weight + ';\n' +
'  font-display: swap;\n' +
'  src: url(\'' + localUrl + '\') format(\'woff2\');\n' +
'  unicode-range: ' + range + ';\n' +
'}\n';
    relevantBlocks.push(localFontFace);
  }

  const generatedCss = '/* Self-hosted fonts for Bệnh viện Thú y Lê Sơn 2026 (SIL Open Font License) */\n' +
'/* Zero external render-blocking network requests, optimal FCP/LCP */\n\n' +
relevantBlocks.join('\n');

  fs.writeFileSync(path.join('src', 'styles', 'fonts.css'), generatedCss, 'utf8');
  console.log('Finished! Downloaded ' + downloadedFiles.size + ' unique font files.');
  let totalSize = 0;
  for (const [, info] of downloadedFiles.entries()) {
    totalSize += info.size;
  }
  console.log('Total fonts size on disk: ' + (totalSize / 1024).toFixed(1) + ' KB');
}

run().catch(console.error);
