const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { inventory, hash } = require('./upload-preflight.cjs');

test('actual offline preflight CLI rejects source/selection/pin corruption before upload', () => {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'upload-preflight-'));
  const stage = path.join(scratch, 'stage');
  fs.mkdirSync(stage);
  fs.writeFileSync(path.join(stage, 'index.html'), '<p>fixture</p>');
  fs.writeFileSync(path.join(stage, 'ignored.txt'), 'source-only evidence');
  const bundle = path.join(scratch, 'selector.cjs');
  // A deterministic selector fixture isolates the gate; real CLI inventory is tested separately.
  fs.writeFileSync(bundle, `exports.require_dist=()=>({buildFileTree:async root=>({fileList:[require('node:path').join(root,'index.html')]})});`);
  const expectedPath = path.join(scratch, 'expected.json');
  const source = inventory(stage);
  const expected = { selectorSHA256: hash(fs.readFileSync(bundle)), source,
    upload: source.filter(row => row.path === 'index.html') };
  const save = value => fs.writeFileSync(expectedPath, JSON.stringify(value));
  const run = exit => {
    const child = spawnSync(process.execPath, [path.join(__dirname, 'upload-preflight.cjs'),
      stage, expectedPath, bundle], { encoding: 'utf8', timeout: 10000 });
    assert.equal(child.status, exit, child.stdout + child.stderr);
    if (exit === 2) assert.match(child.stderr, /NOT VERIFIED/);
    else assert.equal(JSON.parse(child.stdout).verdict, 'MATCH');
  };
  try {
    save(expected); run(0);
    for (const name of ['extra.txt', 'build/rogue.txt', '.react-router/rogue.txt']) {
      const file = path.join(stage, name);
      fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, 'rogue');
      try { run(2); } finally {
        fs.unlinkSync(file); if (name.includes('/')) fs.rmdirSync(path.dirname(file));
      }
    }
    const file = path.join(stage, 'index.html'), bytes = fs.readFileSync(file);
    try { fs.appendFileSync(file, '!'); run(2); fs.unlinkSync(file); run(2); }
    finally { fs.writeFileSync(file, bytes); }
    const ignored = path.join(stage, 'ignored.txt'), original = fs.readFileSync(ignored);
    try { fs.appendFileSync(ignored, '!'); run(2); } finally { fs.writeFileSync(ignored, original); }
    for (const manifest of [{ ...expected, selectorSHA256: '0'.repeat(64) },
      { ...expected, upload: [] }, { ...expected, source: [] }]) { save(manifest); run(2); }
    fs.writeFileSync(expectedPath, '{'); run(2);
    save(expected); run(0);
  } finally { fs.rmSync(scratch, { recursive: true, force: true }); }
});
