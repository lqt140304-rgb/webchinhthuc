const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '..', 'build', 'client');
const static404 = path.join(clientDir, '404', 'index.html');
const root404 = path.join(clientDir, '404.html');

if (fs.existsSync(static404)) {
  fs.copyFileSync(static404, root404);
  console.log(`[postbuild] Generated root 404.html: ${root404}`);
} else {
  console.warn(`[postbuild] Warning: ${static404} not found, skipping 404.html generation.`);
}
