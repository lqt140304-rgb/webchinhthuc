/**
 * DEPRECATED SCRIPT — BỆNH VIỆN THÚ Y LÊ SƠN 2026
 *
 * This script previously downloaded 21 split-subset font files.
 * Per CEO Directive 010-A, 011-A, and 012-A, split subsets are replaced by
 * single-file complete WOFF2 fonts with Tiered Loading Strategy (Phương án C).
 *
 * This file is safely redirected to `scripts/optimize-fonts.cjs`.
 */

const { spawn } = require('child_process');
const path = require('path');

console.warn('⚠️  NOTICE: download-fonts.cjs is deprecated. Redirecting to scripts/optimize-fonts.cjs...');

const child = spawn('node', [path.join(__dirname, 'optimize-fonts.cjs'), ...process.argv.slice(2)], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
