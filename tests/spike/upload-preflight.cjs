// Offline inventory gate only. Never invokes a deployment or reads credentials.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(root, prefix = '') {
  return fs.readdirSync(path.join(root, prefix), { withFileTypes: true }).flatMap(entry => {
    const name = prefix + entry.name;
    assert(!entry.isSymbolicLink(), 'Symlink forbidden: ' + name);
    if (entry.isDirectory()) return inventory(root, name + '/');
    assert(entry.isFile(), 'Special file forbidden: ' + name);
    const bytes = fs.readFileSync(path.join(root, name));
    return [{ path: name, size: bytes.length, sha256: hash(bytes) }];
  }).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}
async function select(root, bundle) {
  const stop = () => { throw Error('Network forbidden in preflight'); };
  require('node:net').Socket.prototype.connect = stop;
  global.fetch = stop;
  const client = (await import(pathToFileURL(path.resolve(bundle)).href)).require_dist();
  const result = await client.buildFileTree(path.resolve(root), { isDirectory: true, prebuilt: false }, () => {});
  return result.fileList.map(file => {
    const bytes = fs.readFileSync(file);
    return { path: path.relative(root, file).split(path.sep).join('/'), size: bytes.length, sha256: hash(bytes) };
  }).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}
async function verify(root, manifest, bundle) {
  assert.equal(hash(fs.readFileSync(bundle)), manifest.selectorSHA256, 'CLI selector changed');
  const actual = inventory(root);
  assert(!actual.some(row => /^(build|\.react-router)\//.test(row.path)), 'Generated build/typegen files forbidden in staging');
  assert.deepEqual(actual, manifest.source, 'Staging differs from exact Git export');
  assert.deepEqual(await select(root, bundle), manifest.upload, 'Upload inventory/hash mismatch');
  return { verdict: 'MATCH', source: actual.length, selected: manifest.upload.length,
    provenance: 'LOCAL ONLY; does not verify uploaded or deployed bytes' };
}
module.exports = { inventory, select, verify, hash };
if (require.main === module) {
  const [root, expected, bundle] = process.argv.slice(2);
  Promise.resolve().then(() => verify(path.resolve(root), JSON.parse(fs.readFileSync(expected)), bundle))
    .then(report => console.log(JSON.stringify(report)))
    .catch(error => { console.error('NOT VERIFIED: ' + error.message); process.exitCode = 2; });
}
