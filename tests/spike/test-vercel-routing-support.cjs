const { test } = require('node:test');
const assert = require('node:assert/strict');
const { configuredHeaders, remoteOptions } = require('./vercel-routing-support.cjs');
const { checkAccess } = require('./vercel-routing-support.cjs');
const sha = 'a'.repeat(40);
const env = { BASE_URL: 'https://preview-unique.vercel.app/', EXPECTED_COMMIT_SHA: sha, EXPECTED_DEPLOYMENT_ID: 'dpl_test' };
const evidence = { id: 'dpl_test', url: 'preview-unique.vercel.app', readyState: 'READY', target: 'preview',
  project: { name: 'le-son-website-qa', id: 'prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3' }, meta: { githubCommitSha: sha } };
test('headers follow matching source rules and do not invent noindex', () => {
  const config = { headers: [
    { source: '/(.*)', headers: [{ key: 'X-Test', value: 'global' }] },
    { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'immutable' }] },
  ] };
  assert.deepEqual(configuredHeaders(config, '/bai-viet/demo'), { 'x-test': 'global' });
  assert.deepEqual(configuredHeaders(config, '/assets/demo.js'), { 'x-test': 'global', 'cache-control': 'immutable' });
  assert.deepEqual(configuredHeaders({}, '/'), {});
});
test('authentication wall stops without following SSO and app response is allowed', async () => {
  const http = require('node:http');
  const { request } = require('playwright');
  let followed = false;
  const server = http.createServer((req, res) => {
    if (req.url === '/sso') { followed = true; res.end('should not follow'); }
    else if (req.url === '/redirect') { res.writeHead(302, { location: 'https://vercel.com/sso-api' }); res.end(); }
    else if (req.url === '/wall') { res.end('<title>Authentication Required</title>'); }
    else if (req.url === '/unauthorized') { res.writeHead(401); res.end(); }
    else { res.end('<html>application</html>'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const api = await request.newContext();
  try {
    const context = { request: api };
    const base = `http://127.0.0.1:${server.address().port}`;
    await checkAccess(context, base + '/app');
    for (const route of ['/redirect', '/wall', '/unauthorized']) {
      await assert.rejects(checkAccess(context, base + route), { code: 'AUTH_BLOCKED' });
    }
    assert.equal(followed, false);
  } finally {
    await api.dispose();
    await new Promise(resolve => server.close(resolve));
  }
});
test('remote URL normalizes and evidence binds exact Preview URL, project and commit', () => {
  assert.equal(remoteOptions(env, evidence).base, 'https://preview-unique.vercel.app');
  assert.equal(remoteOptions(env, evidence).sha, sha);
  for (const invalid of [
    { ...evidence, meta: { githubCommitSha: 'b'.repeat(40) } },
    { ...evidence, url: 'another.vercel.app' },
    { ...evidence, target: null },
    { ...evidence, target: undefined },
    { ...evidence, target: 'production' },
    { ...evidence, id: 'dpl_other' },
    { ...evidence, readyState: 'ERROR' },
    { ...evidence, project: { name: 'webchinhthuc', id: 'prj_8tLN2c3zlnzxtleF5zm5p96SFW2A' } },
    { ...evidence, project: { ...evidence.project, id: 'prj_wrong' } },
  ]) assert.throws(() => remoteOptions(env, invalid));
  for (const base of ['https://preview-unique.vercel.app/path', 'https://user:secret@preview-unique.vercel.app',
    'https://preview-unique.vercel.app/?token=secret', 'http://preview-unique.vercel.app']) {
    assert.throws(() => remoteOptions({ ...env, BASE_URL: base }, evidence));
  }
  assert.throws(() => remoteOptions({ BASE_URL: env.BASE_URL }, evidence));
});

test('missing deployment scope fails closed', () => {
  const { EXPECTED_DEPLOYMENT_ID: _deploymentId, ...unscoped } = env;
  assert.throws(() => remoteOptions(unscoped, evidence));
});
test('null target is never Preview evidence', () => {
  assert.throws(() => remoteOptions(env, { ...evidence, target: null }), /Preview/);
});
