#!/usr/bin/env bash
# Usage: VERCEL_AUTOMATION_BYPASS_SECRET=... tests/vercel/a05-headers.sh https://<preview-host> > out.tsv
# Không có biến secret thì chạy không bypass (sẽ thấy 302 → Vercel SSO). Secret không bao giờ được in ra.
# Records HTTP status + X-Robots-Tag (+ Vercel headers) for each route; no request body is stored.
set -u; U="${1%/}"; H=(); B="${VERCEL_AUTOMATION_BYPASS_SECRET:-${BYPASS:-}}"; [ -n "$B" ] && H=(-H "x-vercel-protection-bypass: $B")
for p in / /dat-lich /dat-lich/ "/dat-lich?utm_source=qa" /gioi-thieu /dich-vu /dich-vu/kham-dieu-tri /lien-he /bang-gia \
         /tai-khoan /tai-khoan/ /tai-khoan/dang-nhap /tai-khoan/ho-so /quan-ly /quan-ly/dashboard \
         /khong-ton-tai /abc/xyz /robots.txt /sitemap.xml /fonts/be-vietnam-pro-400.woff2 /images/logo.png \
         /assets/index-CvVwFN8Z.js /assets/index-vrX09Urw.css; do
  r=$(curl -sS -o /dev/null -D - --max-time 20 "${H[@]}" "$U$p" 2>&1)
  st=$(echo "$r" | awk 'toupper($1) ~ /^HTTP/ {s=$2} END{print s}')
  xr=$(echo "$r" | grep -i '^x-robots-tag:' | cut -d' ' -f2- | tr -d '\r' | paste -sd'|')
  ct=$(echo "$r" | grep -i '^content-type:' | cut -d' ' -f2- | tr -d '\r' | head -1)
  loc=$(echo "$r" | grep -i '^location:' | cut -d' ' -f2- | tr -d '\r' | head -1)
  vid=$(echo "$r" | grep -i '^x-vercel-id:' | cut -d' ' -f2- | tr -d '\r' | head -1)
  printf '%s\t%s\tX-Robots-Tag=%s\t%s\t%s\t%s\n' "$p" "$st" "${xr:--}" "$ct" "${loc:+Location=$loc}" "$vid"
done
