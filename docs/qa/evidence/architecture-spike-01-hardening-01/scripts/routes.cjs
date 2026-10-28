const { chromium } = require('playwright');
const routes=['/','/gioi-thieu','/doi-ngu','/co-so-vat-chat','/dich-vu','/dich-vu/kham-dieu-tri','/dich-vu/noi-tru','/dich-vu/spa','/cau-chuyen/abc','/bai-viet/xyz','/dich-vu/cap-cuu','/bang-gia','/cau-chuyen','/goc-thu-cung','/san-pham','/dat-lich','/lien-he','/dang-nhap','/dang-ky','/tai-khoan/lich-hen','/quan-ly/lich-truc','/khong-ton-tai'];
(async()=>{
  const b=await chromium.launch();
  for (const [name,port] of [['base',5101],['hard',5104]]) {
    console.log('##',name);
    for (const r of routes) {
      const p=await b.newPage(); const logs=[];
      p.on('console',m=>{ if(['error','warning'].includes(m.type())) logs.push(m.type()+': '+m.text().slice(0,140)); });
      p.on('pageerror',e=>logs.push('pageerror: '+e.message.slice(0,140)));
      const resp=await p.goto('http://localhost:'+port+r,{waitUntil:'networkidle'});
      const raw=await resp.text(); const rawTitle=(raw.match(/<title>(.*?)<\/title>/)||[])[1]||'';
      const info=await p.evaluate(()=>({t:document.title,d:document.querySelector('meta[name=description]')?.content||'',rb:[...document.querySelectorAll('meta[name=robots]')].map(m=>m.content).join('|'),h1:document.querySelector('h1')?.innerText.slice(0,60)||'',nf:/404|Không tìm thấy/.test(document.body.innerText),nmeta:document.querySelectorAll('meta[name=description]').length,ntitle:document.querySelectorAll('title').length}));
      console.log(JSON.stringify({r,status:resp.status(),rawTitle:rawTitle.slice(0,60),...info,logs}));
      await p.close();
    }
  }
  // client-side nav from home through header links
  for (const [name,port] of [['base',5101],['hard',5104]]) {
    const p=await b.newPage(); await p.setViewportSize({width:1440,height:900});
    await p.goto('http://localhost:'+port+'/',{waitUntil:'networkidle'});
    const hrefs=await p.$$eval('header a[href^="/"]',as=>[...new Set(as.map(a=>a.getAttribute('href')))]);
    const out=[];
    for (const h of hrefs){ await p.goto('http://localhost:'+port+'/',{waitUntil:'networkidle'}); const a=await p.$(`header a[href="${h}"]`); if(!a||!(await a.isVisible())){out.push([h,'hidden']);continue;} await a.click(); await p.waitForTimeout(600); out.push([h,p.url().replace('http://localhost:'+port,''), await p.evaluate(()=>/Không tìm thấy trang/.test(document.body.innerText)?'NOT-FOUND':'ok')]); }
    console.log('## header-nav',name,JSON.stringify(out));
    await p.close();
  }
  await b.close();
})();
