#!/bin/bash
# Usage: run.sh <route> <mobile|desktop> <n>
S=/tmp/claude-0/-home-user-webchinhthuc/1900487a-6900-57f5-abbe-3137ea7f2a0f/scratchpad
U=https://le-son-website-q5i16t9zn-lqt140304-rgb.vercel.app
LH=$S/tools/lighthouse/node_modules/.bin/lighthouse
CH=$(ls -d /opt/pw-browsers/chromium-1243/chrome-linux*/chrome | head -1)
r=$1; mode=$2; n=$3; name=$(echo ${r:-home} | tr -d '/'); [ -z "$name" ] && name=home
for i in $(seq ${4:-1} $((${4:-1}+n-1))); do
  extra=""; [ "$mode" = desktop ] && extra="--preset=desktop"
  CHROME_PATH=$CH $LH "$U$r" $extra --quiet --chrome-flags="--headless=new --no-sandbox" --only-categories=performance --extra-headers=/tmp/claude-0/lhh.json --output=json --output-path=$S/pfix/lh/$name-$mode-$i.json >/dev/null 2>&1
  python3 - "$S/pfix/lh/$name-$mode-$i.json" <<'PY'
import json,sys
p=sys.argv[1]; d=json.load(open(p))
d['configSettings'].pop('extraHeaders',None)
json.dump(d,open(p,'w'))
a=d['audits']; print(p.split('/')[-1], round(d['categories']['performance']['score']*100), 'LCP', round(a['largest-contentful-paint']['numericValue']), 'FCP', round(a['first-contentful-paint']['numericValue']), 'TBT', round(a['total-blocking-time']['numericValue']), 'CLS', round(a['cumulative-layout-shift']['numericValue'],3), 'SI', round(a['speed-index']['numericValue']), d['lighthouseVersion'])
PY
done
