const { test } = require('node:test');
const assert = require('node:assert/strict');
const { remoteOptions } = require('./vercel-routing-support.cjs');
const sha = 'a'.repeat(40);
const env = { BASE_URL: 'https://fixture.vercel.app', EXPECTED_COMMIT_SHA: sha, EXPECTED_DEPLOYMENT_ID: 'dpl_fixture' };
const evidence = { id: 'dpl_fixture', url: 'fixture.vercel.app', readyState: 'READY', target: null,
  customEnvironment: null, alias: [], project: { name: 'le-son-website-qa', id: 'prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3' }, meta: { githubCommitSha: sha } };
test('documented REST null target requires explicit no-custom-environment and alias evidence', () => {
  assert.equal(remoteOptions(env, evidence).sha, sha);
  for (const change of [{ target: undefined }, { target: 'null' }, { customEnvironment: undefined },
    { customEnvironment: { id: 'env_custom' } }, { customEnvironmentId: 'env_custom' },
    { alias: ['production.example.com'] }, { alias: undefined }, { meta: {} },
    { meta: { githubCommitSha: 'b'.repeat(40) } }]) {
    assert.throws(() => remoteOptions(env, { ...evidence, ...change }), { code: 'NOT_VERIFIED' });
  }
});
