const { chromium } = require('playwright');
(async()=>{const br=await chromium.launch();const E=process.argv[2];
for (const w of [1366,390]){const p=await br.newPage({viewport:{width:w,height:900}});await p.goto('http://localhost:4173/',{waitUntil:'networkidle'});
const secs=await p.$$('main section');for(const [i,s] of secs.entries()){await s.scrollIntoViewIfNeeded();await p.waitForTimeout(400);await p.waitForLoadState('networkidle');await s.screenshot({path:`${E}/sec-${w}-${i}.png`});}
await p.close();}await br.close();})();
