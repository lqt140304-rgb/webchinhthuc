const EXPECTED_404_PATHS = new Set([
  '/khong-ton-tai-e2e', '/khong-ton-tai-r2', '/dich-vu-khong-ton-tai',
  '/dich-vu-khong-ton-tai/', '/gioi-thieu-abc', '/goc-thu-cung-abc',
]);

function recordConsoleErrors(page, errors, measurements, tag, base, paths = EXPECTED_404_PATHS) {
  const expectedDocuments = new Set();
  page.on('response', response => {
    const url = new URL(response.url());
    expectedDocuments.delete(response.url());
    if (response.status() === 404 && response.request().resourceType() === 'document'
      && url.origin === new URL(base).origin && paths.has(url.pathname)) {
      expectedDocuments.add(response.url());
    }
  });
  page.on('console', message => {
    if (message.type() !== 'error') return;
    const resource = message.location().url;
    if (message.text() === 'Failed to load resource: the server responded with a status of 404 (Not Found)'
      && expectedDocuments.has(resource)) {
      measurements.push({ id: 'expected-document-404', resource, tag });
      return;
    }
    errors.push(`${tag}: ${message.text()} [resource=${resource}]`);
  });
  page.on('pageerror', error => errors.push(`${tag}: ${error.message}`));
}
module.exports = { recordConsoleErrors };
