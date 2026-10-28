const { chromium } = require('playwright');
const out=process.argv[2];
const routes=['/','/gioi-thieu','/doi-ngu','/co-so-vat-chat','/dat-lich'];
(async()=>{const b=await chromium.launch();
for (const [w,h] of [[1440,900],[412,823]]) for (const [name,port] of [['base',5101],['h2',5106]]) for (const r of routes){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto('http://localhost:'+port+r,{waitUntil:'networkidle'}); for(let y=0;y<20000;y+=600){await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(80);} await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(800);
  await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager'); await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));});
  await p.addStyleTag({content:'*{animation:none!important;transition:none!important;caret-color:transparent!important}'});
  await p.waitForTimeout(500);
  await p.screenshot({path:`${out}/${name}-${w}-${(r.replace(/\//g,'_')||'_')}.png`,fullPage:true}); await p.close();}
await b.close();})();
