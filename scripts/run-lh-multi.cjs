const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost:4173/';
const outputDir = path.join(process.cwd(), 'lh-results');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function runLighthouse(preset, runIndex) {
  const outputPath = path.join(outputDir, `lh-${preset}-run${runIndex}.json`);
  console.log(`Running Lighthouse [${preset}] - Run ${runIndex}...`);
  const cmd = `npx lighthouse ${url} --preset=${preset} --chrome-flags="--headless=new" --output=json --output-path="${outputPath}"`;
  execSync(cmd, { stdio: 'ignore' });
  const raw = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  const score = Math.round(raw.categories.performance.score * 100);
  const fcp = raw.audits['first-contentful-paint'].numericValue;
  const lcp = raw.audits['largest-contentful-paint'].numericValue;
  const tbt = raw.audits['total-blocking-time'].numericValue;
  const cls = raw.audits['cumulative-layout-shift'].numericValue;
  const speedIndex = raw.audits['speed-index'].numericValue;

  const reqs = raw.audits['network-requests']?.details?.items || [];
  const fonts = reqs.filter(i => i.resourceType === 'Font');
  let fontBytes = 0;
  fonts.forEach(f => fontBytes += (f.transferSize || 0));

  const rb = raw.audits['render-blocking-resources']?.details?.items || [];

  return {
    run: runIndex,
    score,
    fcp: (fcp / 1000).toFixed(2) + 's',
    fcpMs: fcp,
    lcp: (lcp / 1000).toFixed(2) + 's',
    lcpMs: lcp,
    tbt: Math.round(tbt) + 'ms',
    tbtMs: tbt,
    cls: cls.toFixed(3),
    clsVal: cls,
    speedIndex: (speedIndex / 1000).toFixed(2) + 's',
    fontsCount: fonts.length,
    fontBytes: (fontBytes / 1024).toFixed(1) + ' KB',
    renderBlockingCount: rb.length
  };
}

async function main() {
  console.log('=== STARTING 3-RUN LIGHTHOUSE BENCHMARK ===\n');

  const mobileRuns = [];
  for (let i = 1; i <= 3; i++) {
    const res = runLighthouse('perf', i);
    console.log(`  Run ${i} Mobile: Score = ${res.score}, LCP = ${res.lcp}, TBT = ${res.tbt}, CLS = ${res.cls}, Fonts = ${res.fontsCount} (${res.fontBytes})`);
    mobileRuns.push(res);
  }

  const desktopRuns = [];
  for (let i = 1; i <= 3; i++) {
    const res = runLighthouse('desktop', i);
    console.log(`  Run ${i} Desktop: Score = ${res.score}, LCP = ${res.lcp}, TBT = ${res.tbt}, CLS = ${res.cls}, Fonts = ${res.fontsCount} (${res.fontBytes})`);
    desktopRuns.push(res);
  }

  // Calculate medians by sorting by LCP or Score
  mobileRuns.sort((a, b) => a.lcpMs - b.lcpMs);
  const medianMobile = mobileRuns[1];

  desktopRuns.sort((a, b) => a.lcpMs - b.lcpMs);
  const medianDesktop = desktopRuns[1];

  console.log('\n=============================================');
  console.log('MEDIAN MOBILE RESULTS:');
  console.log(`  Performance Score:    ${medianMobile.score}`);
  console.log(`  LCP:                  ${medianMobile.lcp}`);
  console.log(`  FCP:                  ${medianMobile.fcp}`);
  console.log(`  TBT:                  ${medianMobile.tbt}`);
  console.log(`  CLS:                  ${medianMobile.cls}`);
  console.log(`  Speed Index:          ${medianMobile.speedIndex}`);
  console.log(`  Fonts Requested:      ${medianMobile.fontsCount}`);
  console.log(`  Font Payload:         ${medianMobile.fontBytes}`);
  console.log(`  Render Blocking:      ${medianMobile.renderBlockingCount}`);

  console.log('\nMEDIAN DESKTOP RESULTS:');
  console.log(`  Performance Score:    ${medianDesktop.score}`);
  console.log(`  LCP:                  ${medianDesktop.lcp}`);
  console.log(`  FCP:                  ${medianDesktop.fcp}`);
  console.log(`  TBT:                  ${medianDesktop.tbt}`);
  console.log(`  CLS:                  ${medianDesktop.cls}`);
  console.log(`  Speed Index:          ${medianDesktop.speedIndex}`);
  console.log(`  Fonts Requested:      ${medianDesktop.fontsCount}`);
  console.log(`  Font Payload:         ${medianDesktop.fontBytes}`);
  console.log(`  Render Blocking:      ${medianDesktop.renderBlockingCount}`);
  console.log('=============================================\n');

  fs.writeFileSync('lh-summary.json', JSON.stringify({
    mobile: { runs: mobileRuns, median: medianMobile },
    desktop: { runs: desktopRuns, median: medianDesktop }
  }, null, 2));
}

main().catch(console.error);
