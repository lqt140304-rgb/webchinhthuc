const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
 for (const [name,port] of [['base',5101],['h2',5106]]) {
  const p=await b.newPage({viewport:{width:1440,height:900}}); const logs=[];
  p.on('console',m=>{if(['error','warning'].includes(m.type())&&!/Failed to load resource/.test(m.text())) logs.push(m.text().slice(0,100))}); p.on('pageerror',e=>logs.push('pageerror '+e.message.slice(0,100)));
  await p.goto('http://localhost:'+port+'/',{waitUntil:'networkidle'});
  // client-side nav to unknown route via history API link click
  await p.evaluate(()=>{const a=document.createElement('a');a.href='/trang-khong-co/lop-2';a.id='qa-link';a.textContent='x';document.body.appendChild(a)}); 
  await p.click('#qa-link'); await p.waitForTimeout(700);
  const t1=await p.evaluate(()=>({u:location.pathname,nf:/Không tìm thấy trang/.test(document.body.innerText),t:document.title}));
  await p.reload({waitUntil:'networkidle'}); const t2=await p.evaluate(()=>({u:location.pathname,nf:/Không tìm thấy trang/.test(document.body.innerText),t:document.title}));
  await p.goBack(); await p.waitForTimeout(500); const t3=await p.evaluate(()=>({u:location.pathname,t:document.title}));
  // client nav to slug route
  await p.goto('http://localhost:'+port+'/cau-chuyen',{waitUntil:'networkidle'}); const hasSlugLink=await p.$$eval('a[href^="/cau-chuyen/"]',a=>a.length);
  console.log(name,'clientNav->404',JSON.stringify(t1),'| refresh',JSON.stringify(t2),'| back',JSON.stringify(t3),'| slugLinksOnPage',hasSlugLink,'| console',JSON.stringify(logs)); await p.close();}
 await b.close();})();
