const fs = require('fs');

const files = [
  'build/client/index.html',
  'build/client/co-so-vat-chat/index.html',
  'build/client/gioi-thieu/index.html',
  'build/client/doi-ngu/index.html',
  'build/client/dat-lich/index.html',
  'build/client/tai-khoan/index.html',
  'build/client/404.html',
];

console.log('--- PRERENDERED HTML METADATA AUDIT ---');
for (const f of files) {
  if (!fs.existsSync(f)) {
    console.log(f, 'MISSING!');
    continue;
  }
  const h = fs.readFileSync(f, 'utf8');
  const t = (h.match(/<title>(.*?)<\/title>/) || [])[1];
  const d = (h.match(/<meta name="description" content="(.*?)"\/>/) || [])[1];
  const r = (h.match(/<meta name="robots" content="(.*?)"\/>/) || [])[1];
  console.log(`[FILE] ${f}`);
  console.log(`  Title : ${t}`);
  console.log(`  Desc  : ${d}`);
  console.log(`  Robots: ${r}`);
}
