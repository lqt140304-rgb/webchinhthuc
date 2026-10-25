#!/usr/bin/env bash
# Chạy E2E mốc 2A trên một bản sao tách riêng, đúng SHA được giao.
# Dùng: tests/e2e/run-2a-e2e.sh <SHA> <thư-mục-làm-việc> [thư-mục-evidence]
# Tùy chọn: HOST_URL=<host đích> để chạy nhóm P1-8.
set -euo pipefail
SHA="$1"; WORK="$2"; EVID="${3:-$WORK/evidence}"
REPO="$(git rev-parse --show-toplevel)"
SPEC="$REPO/tests/e2e/2a.e2e.test.cjs"
PORT="${PORT:-4173}"

rm -rf "$WORK/app"; mkdir -p "$WORK/app" "$EVID"
git -C "$REPO" archive "$SHA" | tar -x -C "$WORK/app"
cd "$WORK/app"
{
  echo "sha=$(git -C "$REPO" rev-parse "$SHA")"
  echo "node=$(node -v) npm=$(npm -v) os=$(uname -sr)"
  echo "playwright=$(node -e "console.log(require('playwright/package.json').version)")"
} | tee "$EVID/env.txt"

npm ci --no-audit --no-fund > "$EVID/npm-ci.txt" 2>&1
set +e
npm run lint > "$EVID/lint.txt" 2>&1; echo "lint_exit=$?" | tee -a "$EVID/env.txt"
npm run build > "$EVID/build.txt" 2>&1; BUILD=$?; echo "build_exit=$BUILD" | tee -a "$EVID/env.txt"
set -e
[ "$BUILD" -eq 0 ] || { echo "build lỗi, dừng"; exit 1; }

npx vite preview --port "$PORT" --strictPort > "$EVID/preview.txt" 2>&1 &
PREVIEW=$!
trap 'kill $PREVIEW 2>/dev/null || true' EXIT
for _ in $(seq 1 50); do curl -sf "http://localhost:$PORT/" > /dev/null && break; sleep 0.2; done

set +e
BASE_URL="http://localhost:$PORT" EVIDENCE_DIR="$EVID" \
  node --test --test-reporter=spec --test-reporter-destination=stdout \
  --test-reporter=tap --test-reporter-destination="$EVID/e2e.tap" "$SPEC" | tee "$EVID/e2e.txt"
E2E=${PIPESTATUS[0]}
echo "e2e_exit=$E2E" | tee -a "$EVID/env.txt"
exit "$E2E"
