const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const r of ['/','/gioi-thieu']){ const p=await b.newPage(); const resp=await p.goto('http://localhost:5108'+r,{waitUntil:'networkidle'}); const raw=await resp.text();
 const rawRobots=(raw.match(/<meta name="robots" content="([^"]*)"/)||[])[1];
 const hyd=await p.evaluate(()=>[...document.querySelectorAll('meta[name=robots]')].map(m=>m.content));
 console.log(r,'RAW robots:',rawRobots,'| HYDRATED robots:',JSON.stringify(hyd)); await p.close();}
await b.close();})();
