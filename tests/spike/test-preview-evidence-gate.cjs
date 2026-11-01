const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { remoteOptions } = require('./vercel-routing-support.cjs');
const sha = 'a'.repeat(40);
const env = { BASE_URL: 'https://preview-fixture.vercel.app/', EXPECTED_COMMIT_SHA: sha,
  EXPECTED_DEPLOYMENT_ID: 'dpl_fixture' };
const deployment = { id: 'dpl_fixture', url: 'preview-fixture.vercel.app', readyState: 'READY',
  project: { name: 'le-son-website-qa', id: 'prj_wZg6o5vvbDe6UTT52vaqvGTNC4e3' },
  meta: { githubCommitSha: sha } };

test('incomplete or non-Preview metadata is NOT VERIFIED, never an eligible remote run', () => {
  for (const target of [null, undefined, 'production']) {
    assert.throws(() => remoteOptions(env, { ...deployment, target }), { code: 'NOT_VERIFIED' });
  }
});

test('CLI writes NOT VERIFIED and exits before browser/network for missing or invalid evidence', () => {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'preview-gate-'));
  try {
    // Guard the boundary: a regression that attempts any network or browser launch fails this test.
    const guard = path.join(scratch, 'no-network.cjs');
    fs.writeFileSync(guard, `const stop=()=>{throw Error('UNEXPECTED_NETWORK')};
      require('node:net').Socket.prototype.connect=stop;
      require('node:child_process').spawn=stop;`);
    for (const scenario of ['missing', 'unreadable', 'invalid-json', 'null', 'absent', 'production']) {
      const evidence = path.join(scratch, 'deployment.json');
      const result = path.join(scratch, scenario + '.json');
      if (scenario === 'invalid-json') fs.writeFileSync(evidence, '{');
      else fs.writeFileSync(evidence, JSON.stringify({ ...deployment,
        ...(scenario === 'absent' ? {} : { target: scenario === 'null' ? null : 'production' }) }));
      const childEnv = { ...process.env, ...env, QA_EVIDENCE_FILE: result };
      delete childEnv.DEPLOYMENT_EVIDENCE_FILE;
      delete childEnv.PLAYWRIGHT_STORAGE_STATE;
      if (scenario !== 'missing') childEnv.DEPLOYMENT_EVIDENCE_FILE = scenario === 'unreadable'
        ? path.join(scratch, 'not-present.json') : evidence;
      const child = spawnSync(process.execPath, ['--require', guard,
        path.join(__dirname, 'test-vercel-routing.cjs')], { env: childEnv, encoding: 'utf8', timeout: 15000 });
      assert.equal(child.status, 2, `${scenario}: ${child.stdout} ${child.stderr}`);
      assert.match(child.stderr, /NOT VERIFIED/);
      assert.doesNotMatch(child.stdout + child.stderr, /UNEXPECTED_NETWORK|PASS:/);
      const report = JSON.parse(fs.readFileSync(result));
      assert.equal(report.verdict, 'NOT VERIFIED');
      assert.deepEqual(report.checks, []);
    }
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});
