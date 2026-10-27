/**
 * A05 HEADER MATRIX VERIFICATION SCRIPT
 * Simulates and verifies Vercel route matching for X-Robots-Tag header rules
 * against the compiled .vercel/output/config.json routes.
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join('.vercel', 'output', 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('Missing .vercel/output/config.json. Run `npx vercel build` first.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Extract header rules from compiled config
const headerRules = config.routes.filter(r => r.headers && r.headers['X-Robots-Tag']);

console.log(`Loaded ${headerRules.length} X-Robots-Tag header rules from .vercel/output/config.json:`);
headerRules.forEach((r, idx) => {
  console.log(`  Rule ${idx + 1}: ${r.src}`);
});

function getHeader(url) {
  // Strip query string for route matching, as Vercel does
  const pathname = url.split('?')[0];
  for (const r of headerRules) {
    const regex = new RegExp(r.src);
    if (regex.test(pathname)) {
      return r.headers['X-Robots-Tag'];
    }
  }
  return null;
}

const testMatrix = [
  // 1. Root and static public assets (MUST NOT be noindexed by vercel.json)
  { url: '/', expected: null, desc: 'Trang chủ / (public indexable)' },
  { url: '/robots.txt', expected: null, desc: 'Robots.txt' },
  { url: '/sitemap.xml', expected: null, desc: 'Sitemap.xml' },
  { url: '/favicon.png', expected: null, desc: 'Favicon' },
  { url: '/assets/index.js', expected: null, desc: 'Static JS asset' },
  { url: '/assets/index.css', expected: null, desc: 'Static CSS asset' },

  // 2. Pending public pages — WITHOUT trailing slash
  { url: '/gioi-thieu', expected: 'noindex, nofollow', desc: 'Về Lê Sơn (no slash)' },
  { url: '/doi-ngu', expected: 'noindex, nofollow', desc: 'Đội ngũ (no slash)' },
  { url: '/co-so-vat-chat', expected: 'noindex, nofollow', desc: 'Cơ sở vật chất (no slash)' },
  { url: '/bang-gia', expected: 'noindex, nofollow', desc: 'Bảng giá (no slash)' },
  { url: '/san-pham', expected: 'noindex, nofollow', desc: 'Sản phẩm (no slash)' },
  { url: '/dat-lich', expected: 'noindex, nofollow', desc: 'Đặt lịch (no slash)' },
  { url: '/lien-he', expected: 'noindex, nofollow', desc: 'Liên hệ (no slash)' },
  { url: '/dang-nhap', expected: 'noindex, nofollow', desc: 'Đăng nhập (no slash)' },
  { url: '/dang-ky', expected: 'noindex, nofollow', desc: 'Đăng ký (no slash)' },

  // 3. Pending public pages — WITH trailing slash (A05-F1 fix targets)
  { url: '/gioi-thieu/', expected: 'noindex, nofollow', desc: 'Về Lê Sơn (trailing slash)' },
  { url: '/doi-ngu/', expected: 'noindex, nofollow', desc: 'Đội ngũ (trailing slash)' },
  { url: '/co-so-vat-chat/', expected: 'noindex, nofollow', desc: 'Cơ sở vật chất (trailing slash)' },
  { url: '/bang-gia/', expected: 'noindex, nofollow', desc: 'Bảng giá (trailing slash)' },
  { url: '/san-pham/', expected: 'noindex, nofollow', desc: 'Sản phẩm (trailing slash)' },
  { url: '/dat-lich/', expected: 'noindex, nofollow', desc: 'Đặt lịch (trailing slash)' },
  { url: '/lien-he/', expected: 'noindex, nofollow', desc: 'Liên hệ (trailing slash)' },
  { url: '/dang-nhap/', expected: 'noindex, nofollow', desc: 'Đăng nhập (trailing slash)' },
  { url: '/dang-ky/', expected: 'noindex, nofollow', desc: 'Đăng ký (trailing slash)' },

  // 4. Portal & deep public routes — WITHOUT trailing slash
  { url: '/dich-vu', expected: 'noindex, nofollow', desc: 'Dịch vụ root (no slash)' },
  { url: '/dich-vu/kham-dieu-tri', expected: 'noindex, nofollow', desc: 'Dịch vụ subpath' },
  { url: '/cau-chuyen', expected: 'noindex, nofollow', desc: 'Câu chuyện root (no slash)' },
  { url: '/cau-chuyen/mot-ca-bat-ky', expected: 'noindex, nofollow', desc: 'Câu chuyện subpath' },
  { url: '/goc-thu-cung', expected: 'noindex, nofollow', desc: 'Góc thú cưng root (no slash)' },
  { url: '/bai-viet/mot-bai-bat-ky', expected: 'noindex, nofollow', desc: 'Bài viết subpath' },
  { url: '/tai-khoan', expected: 'noindex, nofollow', desc: 'Tài khoản root (no slash)' },
  { url: '/tai-khoan/ho-so', expected: 'noindex, nofollow', desc: 'Tài khoản subpath' },
  { url: '/quan-ly', expected: 'noindex, nofollow', desc: 'Quản lý root (no slash)' },
  { url: '/quan-ly/lich-hen', expected: 'noindex, nofollow', desc: 'Quản lý subpath' },

  // 5. Portal & deep public routes — WITH trailing slash (A05-F1 fix targets)
  { url: '/dich-vu/', expected: 'noindex, nofollow', desc: 'Dịch vụ root (trailing slash)' },
  { url: '/dich-vu/spa/', expected: 'noindex, nofollow', desc: 'Dịch vụ subpath (trailing slash)' },
  { url: '/dich-vu/kham-dieu-tri/', expected: 'noindex, nofollow', desc: 'Dịch vụ subpath (trailing slash)' },
  { url: '/cau-chuyen/', expected: 'noindex, nofollow', desc: 'Câu chuyện root (trailing slash)' },
  { url: '/cau-chuyen/mot-ca-bat-ky/', expected: 'noindex, nofollow', desc: 'Câu chuyện subpath (trailing slash)' },
  { url: '/goc-thu-cung/', expected: 'noindex, nofollow', desc: 'Góc thú cưng root (trailing slash)' },
  { url: '/tai-khoan/', expected: 'noindex, nofollow', desc: 'Tài khoản root (trailing slash)' },
  { url: '/tai-khoan/ho-so/', expected: 'noindex, nofollow', desc: 'Tài khoản subpath (trailing slash)' },
  { url: '/quan-ly/', expected: 'noindex, nofollow', desc: 'Quản lý root (trailing slash)' },
  { url: '/quan-ly/lich-hen/', expected: 'noindex, nofollow', desc: 'Quản lý subpath (trailing slash)' },

  // 6. With Query string
  { url: '/gioi-thieu/?utm=1', expected: 'noindex, nofollow', desc: 'Trailing slash + query param' },
  { url: '/dich-vu/spa/?fbclid=abc', expected: 'noindex, nofollow', desc: 'Subpath slash + query param' },
  { url: '/dat-lich?source=hero', expected: 'noindex, nofollow', desc: 'No slash + query param' },

  // 7. Route boundary & 404 (MUST NOT be falsely matched by vercel.json)
  { url: '/gioi-thieu-abc', expected: null, desc: 'Boundary: /gioi-thieu-abc (soft 404)' },
  { url: '/dich-vu-khong-ton-tai', expected: null, desc: 'Boundary: /dich-vu-khong-ton-tai (soft 404)' },
  { url: '/cau-chuyenxyz', expected: null, desc: 'Boundary: /cau-chuyenxyz (soft 404)' },
  { url: '/khong-ton-tai', expected: null, desc: 'Non-existent URL (soft 404)' }
];

console.log('\n=== RUNNING A05 FULL MATRIX VERIFICATION ===\n');

let passCount = 0;
let failCount = 0;

testMatrix.forEach((t, i) => {
  const actual = getHeader(t.url);
  const pass = actual === t.expected;
  if (pass) {
    passCount++;
    console.log(`  ✔ [${String(i + 1).padStart(2)}] ${t.url.padEnd(35)} -> ${actual || 'NONE (indexable)'} (${t.desc})`);
  } else {
    failCount++;
    console.error(`  ✕ [${String(i + 1).padStart(2)}] ${t.url.padEnd(35)} -> ACTUAL: ${actual || 'NONE'}, EXPECTED: ${t.expected || 'NONE'} (${t.desc})`);
  }
});

console.log(`\n=============================================`);
console.log(`TOTAL: ${testMatrix.length} | PASS: ${passCount} | FAIL: ${failCount}`);
console.log(`=============================================\n`);

if (failCount > 0) {
  process.exit(1);
}
