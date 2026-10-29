// Test utilities only; no application/runtime code.
const assert = require('node:assert/strict');
function configuredHeaders(config, pathname) {
  const headers = {};
  for (const rule of config.headers || []) {
    // Deliberately supports only the two source patterns used in this repository.
    // Never silently pretend to implement the full Vercel routing engine.
    assert(['/(.*)', '/assets/(.*)'].includes(rule.source), 'Unsupported header source in local model');
    if (rule.source === '/(.*)' || pathname.startsWith('/assets/')) {
      for (const header of rule.headers) headers[header.key.toLowerCase()] = header.value;
    }
  }
  return headers;
}
function remoteOptions(env, evidence) {
  const url = new URL(env.BASE_URL);
  assert(url.protocol === 'https:' && url.hostname.endsWith('.vercel.app') && !url.port
    && !url.username && !url.password && !url.search && !url.hash && url.pathname === '/',
  'BASE_URL must be an HTTPS Preview origin without credentials, path or query');
  assert.match(env.EXPECTED_COMMIT_SHA || '', /^[a-f0-9]{40}$/i, 'Full EXPECTED_COMMIT_SHA required');
  assert.equal(evidence.url, url.hostname, 'Deployment URL mismatch');
  assert.equal(evidence.meta?.githubCommitSha, env.EXPECTED_COMMIT_SHA, 'Deployment SHA mismatch');
  assert.equal(evidence.project?.name, 'le-son-website-qa', 'Deployment project mismatch');
  assert.equal(evidence.project?.id, 'prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3', 'Deployment project ID mismatch');
  assert.equal(evidence.readyState, 'READY');
  assert.equal(evidence.target, null, 'Only Preview deployments allowed');
  assert.match(evidence.id, /^dpl_/);
  return { base: url.origin, sha: evidence.meta.githubCommitSha, deploymentId: evidence.id };
}
async function checkAccess(context, url) {
  const response = await context.request.get(url, { maxRedirects: 0 });
  try {
    const status = response.status();
    const location = response.headers().location || '';
    const body = await response.text();
    if ([401, 403].includes(status) || /vercel\.com\/(?:sso-api|login)/i.test(location)
      || /Authentication Required|Vercel Authentication|<title>Login[^<]*Vercel/i.test(body)) {
      const error = new Error('BLOCKED: Vercel Authentication; stop and request an authorized session.');
      error.code = 'AUTH_BLOCKED';
      throw error;
    }
    assert(!location || new URL(location, url).origin === new URL(url).origin,
      'Unexpected external redirect; stopped');
  } finally {
    await response.dispose();
  }
}
module.exports = { configuredHeaders, remoteOptions, checkAccess };
