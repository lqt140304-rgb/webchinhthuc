// Mô phỏng tầng header của vercel.json bằng @vercel/routing-utils (cùng thư viện Vercel dùng để biên dịch route).
const ru = require(process.argv[2]); const cfg = JSON.parse(require('fs').readFileSync(process.argv[3]));
const { routes, error } = ru.getTransformedRoutes(cfg); if (error) { console.error(error); process.exit(1); }
const hdr = routes.filter(r => r.headers);
const paths = ['/', '/gioi-thieu', '/gioi-thieu/', '/dat-lich', '/dat-lich/', '/tai-khoan', '/tai-khoan/', '/tai-khoan/ho-so', '/tai-khoan/ho-so/', '/quan-ly', '/quan-ly/', '/quan-ly/lich-hen/', '/dang-nhap', '/dang-nhap/', '/dich-vu/spa', '/dich-vu/spa/', '/gioi-thieu-abc', '/dat-lichx', '/khong-ton-tai', '/khong-ton-tai/', '/robots.txt'];
for (const p of paths) { const m = hdr.filter(r => new RegExp(r.src).test(p)); console.log(p.padEnd(22), m.length ? m.map(r => JSON.stringify(r.headers)).join(' ') : '(không có header từ vercel.json)'); }
console.log('\nregex:'); hdr.forEach(r => console.log('  ', r.src));
