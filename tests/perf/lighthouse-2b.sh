#!/usr/bin/env bash
# B04 — đo Lighthouse trang chủ: mobile và desktop, mỗi cấu hình 3 lượt, báo trung vị.
# Lighthouse KHÔNG thuộc dependency của repo: cài riêng trong thư mục công cụ kiểm tra.
# Dùng: LIGHTHOUSE_DIR=<thư mục có node_modules/lighthouse> tests/perf/lighthouse-2b.sh <URL> <thư-mục-kết-quả>
set -euo pipefail
URL="${1:-http://localhost:4173/}"
OUT="${2:-./lh}"
LH_DIR="${LIGHTHOUSE_DIR:?đặt LIGHTHOUSE_DIR}"
RUNS="${RUNS:-3}"
mkdir -p "$OUT"
export CHROME_PATH="${CHROME_PATH:-$(node -e "console.log(require('playwright').chromium.executablePath())")}"

for preset in mobile desktop; do
  for i in $(seq 1 "$RUNS"); do
    extra=()
    [ "$preset" = desktop ] && extra=(--preset=desktop)
    # Tùy chọn: LH_EXTRA_HEADERS_FILE=<file JSON> để gửi header (vd. x-vercel-protection-bypass) khi đo Vercel Preview
    [ -n "${LH_EXTRA_HEADERS_FILE:-}" ] && extra+=(--extra-headers="$LH_EXTRA_HEADERS_FILE")
    (cd "$LH_DIR" && npx lighthouse "$URL" --quiet "${extra[@]}" \
      --chrome-flags="--headless=new --no-sandbox" \
      --output=json --output-path="$OUT/lh-$preset-$i.json") > "$OUT/lh-$preset-$i.log" 2>&1
    # Không lưu secret: xóa extraHeaders khỏi JSON kết quả
    [ -n "${LH_EXTRA_HEADERS_FILE:-}" ] && [ -f "$OUT/lh-$preset-$i.json" ] && node -e 'const f=process.argv[1],r=JSON.parse(require("fs").readFileSync(f));if(r.configSettings)r.configSettings.extraHeaders="<redacted>";require("fs").writeFileSync(f,JSON.stringify(r))' "$OUT/lh-$preset-$i.json"
  done
done

node - "$OUT" "$RUNS" <<'EOF'
const [out, runs] = process.argv.slice(2)
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] }
const rows = []
for (const preset of ['mobile', 'desktop']) {
  const rs = Array.from({ length: +runs }, (_, i) => require(`${out}/lh-${preset}-${i + 1}.json`))
  const err = rs.map((r) => r.runtimeError?.code).filter(Boolean)
  const cat = (k) => med(rs.map((r) => Math.round(r.categories[k].score * 100)))
  const aud = (k) => med(rs.map((r) => r.audits[k].numericValue))
  rows.push({
    preset, runs: rs.length, errors: err,
    performance: cat('performance'), accessibility: cat('accessibility'), bestPractices: cat('best-practices'), seo: cat('seo'),
    lcp_s: +(aud('largest-contentful-paint') / 1000).toFixed(2), cls: +aud('cumulative-layout-shift').toFixed(3),
    tbt_ms: Math.round(aud('total-blocking-time')), fcp_s: +(aud('first-contentful-paint') / 1000).toFixed(2),
    lcpElement: rs[0].audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet || null,
    lighthouse: rs[0].lighthouseVersion,
  })
}
require('fs').writeFileSync(`${out}/lighthouse-summary.json`, JSON.stringify(rows, null, 2))
console.table(rows.map(({ lcpElement, ...r }) => r))
EOF
