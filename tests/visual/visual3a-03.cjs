// Visual QA mockup 3A (bản phục hồi mã hoá): viewport thật của trình duyệt + chế độ data-vp của studio.
const { chromium } = require('playwright'); const fs=require('fs');
const URL='http://127.0.0.1:4191/docs/design/phase-3a-interactive-mockups.html'; const OUT=process.argv[2];
const pages=['gioi-thieu','doi-ngu','co-so-vat-chat']; const widths=[320,375,768,1024,1440,1920];
(async()=>{const br=await chromium.launch();const res={};
for(const w of widths){const ctx=await br.newContext({viewport:{width:w,height:900}});const p=await ctx.newPage();
 const errs=[];p.on('console',m=>{if(m.type()==='error'&&!/file:\/\/\/d:/.test(m.text()))errs.push(m.text().slice(0,120))});p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url())});
 await p.goto(URL,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 for(const pg of pages){
  await p.evaluate(pg=>switchPageByNav(pg),pg);await p.waitForTimeout(400);
  const vpBtn=await p.$(`button:has-text("${w>=1920?'1920':w>=1440?'1440':w>=1366?'1366':w>=1024?'1024':w>=768?'768':w>=390?'390':w>=360?'360':'320'}px")`);
  if(vpBtn) await vpBtn.click(); await p.waitForTimeout(200);
  const r=await p.evaluate((pg)=>{const root=document.getElementById('page-'+pg);const W=document.documentElement.clientWidth;
   const over=document.documentElement.scrollWidth-W;
   const wide=[...root.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.right>W+1)}).slice(0,5).map(e=>e.tagName+'.'+String(e.className).slice(0,30)+' r='+Math.round(e.getBoundingClientRect().right));
   const clipped=[...root.querySelectorAll('h1,h2,h3,p,a,button,span,li')].filter(e=>{const s=getComputedStyle(e);return e.scrollWidth>e.clientWidth+2&&(s.overflow==='hidden'||s.textOverflow==='ellipsis'||s.whiteSpace==='nowrap')&&e.clientWidth>0}).slice(0,5).map(e=>e.textContent.trim().slice(0,40));
   const imgs=[...root.querySelectorAll('img')].map(i=>{const b=i.getBoundingClientRect();const fit=getComputedStyle(i).objectFit;return {src:i.getAttribute('src').split('/').pop(),ok:i.complete&&i.naturalWidth>0,alt:i.alt,distort:(fit!=='cover'&&fit!=='contain'&&i.naturalWidth&&b.height)?Math.abs(b.width/b.height-i.naturalWidth/i.naturalHeight)>0.05:false,label:!!i.closest('figure,div')?.querySelector('[class*=badge],[class*=label],[class*=illus]')}});
   const h1=root.querySelectorAll('h1').length; const hs=[...root.querySelectorAll('h1,h2,h3,h4')].map(h=>+h.tagName[1]); let skip=false;for(let i=1;i<hs.length;i++)if(hs[i]-hs[i-1]>1)skip=true;
   const ff=[...new Set([...root.querySelectorAll('h1,h2,h3,p,a,button')].map(e=>{const s=getComputedStyle(e);return s.fontFamily.split(',')[0].replace(/"/g,'')+'/'+s.fontWeight+(s.fontStyle==='italic'?'i':'')}))];
   const minFont=Math.min(...[...root.querySelectorAll('p,span,a,li,button,small,figcaption')].filter(e=>e.offsetParent&&e.textContent.trim()).map(e=>parseFloat(getComputedStyle(e).fontSize)));
   const tap=[...root.querySelectorAll('a,button')].filter(e=>e.offsetParent).map(e=>e.getBoundingClientRect()).filter(b=>b.height<44&&b.height>0).length;
   const cards=[...root.querySelectorAll('.p3a-team-card')].filter(c=>!c.hidden&&c.offsetParent).map(c=>{const b=c.getBoundingClientRect();return [Math.round(b.width),Math.round(b.height)]});
   return {overflowPx:over,wide,clipped,imgs,h1,headingSkip:skip,fonts:ff,minFont,smallTapTargets:tap,cards};},pg);
  res[`${pg}@${w}`]=r;
  await p.screenshot({path:`${OUT}/${pg}-${w}.png`,fullPage:true});
 }
 res[`errors@${w}`]=errs; await ctx.close();}
fs.writeFileSync(OUT+'/visual3a.json',JSON.stringify(res,null,1));
for(const k in res){if(k.startsWith('errors')){if(res[k].length)console.log(k,res[k]);continue}const r=res[k];console.log(k,'overflow',r.overflowPx,'wide',r.wide.length,'clipped',r.clipped.length,'imgsBad',r.imgs.filter(i=>!i.ok).length,'distort',r.imgs.filter(i=>i.distort).length,'h1',r.h1,'skip',r.headingSkip,'minFont',r.minFont,'tap<44',r.smallTapTargets,'cards',JSON.stringify([...new Set(r.cards.map(c=>c.join('x')))]))}
console.log('fonts used:',[...new Set(Object.values(res).flatMap(r=>r.fonts||[]))].join(' | '));
await br.close();})();
