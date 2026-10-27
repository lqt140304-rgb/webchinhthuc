#!/usr/bin/env bash
# Đối chiếu asset Preview với build cục bộ của SHA dự kiến.
# Usage: VERCEL_AUTOMATION_BYPASS_SECRET=... tests/vercel/verify-deploy-sha.sh https://<preview-host> [expected-file]
set -u; U="${1%/}"; EXP="${2:-$(dirname "$0")/expected-assets-db78738.txt}"
H=(); [ -n "${VERCEL_AUTOMATION_BYPASS_SECRET:-}" ] && H=(-H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET")
html=$(curl -sS --max-time 20 "${H[@]}" "$U/") || { echo "FAIL: không tải được /"; exit 2; }
assets=$(printf '%s' "$html" | grep -oE '/assets/[A-Za-z0-9._-]+\.(js|css)' | sort -u)
[ -z "$assets" ] && { echo "FAIL: / không chứa asset build (có thể vẫn là trang Vercel SSO)"; exit 2; }
rc=0
for a in $assets; do
  got=$(curl -sS --max-time 20 "${H[@]}" "$U$a" | sha256sum | cut -d' ' -f1)
  want=$(grep -F " ${a#/}" "$EXP" | cut -d' ' -f1)
  if [ -z "$want" ]; then echo "MISMATCH  $a  (không có trong $EXP)  got=$got"; rc=1
  elif [ "$got" = "$want" ]; then echo "MATCH     $a  $got"
  else echo "MISMATCH  $a  want=$want got=$got"; rc=1; fi
done
for w in $(grep -v '^#' "$EXP" | awk '{print "/"$2}'); do printf '%s\n' $assets | grep -qx "$w" || { echo "MISSING   $w (Preview không tham chiếu)"; rc=1; }; done
exit $rc
