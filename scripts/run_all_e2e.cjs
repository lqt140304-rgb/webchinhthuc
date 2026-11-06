const { spawn, execSync } = require('child_process');
const path = require('path');

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server did not respond within ${timeoutMs}ms at ${url}`);
}

async function main() {
  console.log('>>> KHỞI ĐỘNG VITE PREVIEW SERVER CHO BỘ KIỂM THỬ E2E <<<');
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'pipe',
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`[Preview] Đang chạy tại ${BASE_URL}\n`);

    const suites = [
      'tests/e2e/2a-round03.e2e.test.cjs',
      'tests/e2e/2a-round02.e2e.test.cjs',
      'tests/e2e/2b-booking.e2e.test.cjs',
      'tests/e2e/2b.e2e.test.cjs',
    ];

    for (const suite of suites) {
      console.log(`\n======================================================`);
      console.log(`CHẠY TEST SUITE: ${suite}`);
      console.log(`======================================================`);

      const env = {
        ...process.env,
        BASE_URL,
        NODE_PATH: 'C:/Users/Admin/AppData/Roaming/npm/node_modules',
      };

      try {
        const out = execSync(`node --test ${suite}`, {
          env,
          encoding: 'utf8',
          stdio: 'pipe',
        });
        console.log(out);
      } catch (err) {
        console.error(`[FAIL]: ${suite}`);
        if (err.stdout) console.log(err.stdout);
        if (err.stderr) console.error(err.stderr);
      }
    }
  } finally {
    console.log('\n>>> ĐANG DỪNG VITE PREVIEW SERVER <<<');
    if (preview.pid) {
      try {
        if (process.platform === 'win32') {
          execSync(`taskkill /pid ${preview.pid} /f /t`);
        } else {
          preview.kill();
        }
      } catch {
        // ignore
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
