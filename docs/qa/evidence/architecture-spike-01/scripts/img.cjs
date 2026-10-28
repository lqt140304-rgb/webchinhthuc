const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [name,port] of [['base',5101],['spike',5102]]) for (const w of [412,1440]) {
  const p=await b.newPage({viewport:{width:w,height:823}}); const fails=[];
  p.on('requestfailed',r=>fails.push(r.url())); p.on('response',r=>{if(r.status()>=400) fails.push(r.status()+' '+r.url())});
  await p.goto('http://localhost:'+port+'/',{waitUntil:'networkidle'});
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(1500);
  const imgs=await p.$$eval('img',is=>is.map(i=>({src:i.currentSrc||i.src,ok:i.complete&&i.naturalWidth>0,alt:i.alt.slice(0,40),loading:i.loading,srcset:(i.getAttribute('srcset')||'').slice(0,60)})).filter(x=>!x.ok||/fdb|bulldog|team|cham|thau/i.test(x.src+x.alt)));
  console.log(name,w,JSON.stringify(imgs),'fails',JSON.stringify(fails));
  await p.close();}
await b.close();})();
