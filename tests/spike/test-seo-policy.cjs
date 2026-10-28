const assert = require('assert');

// Test policy logic in CJS
function getPolicyForEnv(env, pathname) {
  if (env !== 'production') {
    return { robots: 'noindex, nofollow', isIndexable: false };
  }
  if (pathname.startsWith('/tai-khoan') || pathname.startsWith('/quan-ly')) {
    return { robots: 'noindex, nofollow', isIndexable: false };
  }
  if (pathname === '/') {
    return { robots: 'index, follow', isIndexable: true };
  }
  return { robots: 'noindex, nofollow', isIndexable: false };
}

console.log('Testing SEO Policy by Environment...');

// 1. Local / Spike environment
const localHome = getPolicyForEnv('local', '/');
assert.strictEqual(localHome.robots, 'noindex, nofollow');
assert.strictEqual(localHome.isIndexable, false);

const localPortal = getPolicyForEnv('local', '/tai-khoan/lich-hen');
assert.strictEqual(localPortal.robots, 'noindex, nofollow');
assert.strictEqual(localPortal.isIndexable, false);

// 2. Preview environment
const previewHome = getPolicyForEnv('preview', '/');
assert.strictEqual(previewHome.robots, 'noindex, nofollow');
assert.strictEqual(previewHome.isIndexable, false);

const previewAbout = getPolicyForEnv('preview', '/gioi-thieu');
assert.strictEqual(previewAbout.robots, 'noindex, nofollow');
assert.strictEqual(previewAbout.isIndexable, false);

// 3. Production environment (future)
const prodHome = getPolicyForEnv('production', '/');
assert.strictEqual(prodHome.robots, 'index, follow');
assert.strictEqual(prodHome.isIndexable, true);

const prodPortal = getPolicyForEnv('production', '/tai-khoan/lich-hen');
assert.strictEqual(prodPortal.robots, 'noindex, nofollow', 'Portal must be noindex even in production');
assert.strictEqual(prodPortal.isIndexable, false);

const prodWip = getPolicyForEnv('production', '/dich-vu/spa');
assert.strictEqual(prodWip.robots, 'noindex, nofollow', 'WIP service page must remain noindex in production');
assert.strictEqual(prodWip.isIndexable, false);

console.log('[PASS] All SEO environment policy tests passed successfully.');
