const { chromium } = require('playwright');
(async()=>{const br=await chromium.launch();const E=process.argv[2];const out={};
for (const [port,tag] of [[4174,'4c824c4'],[4173,'b8d5dd2']]) for (const path of ['/','/dat-lich']) {
 const p=await br.newPage({viewport:{width:1366,height:900}});const fonts=[];const bad=[];const ext=[];
 p.on('response',r=>{const u=r.url();if(/woff2/.test(u))fonts.push(u.split('/').pop().slice(0,40));if(r.status()>=400)bad.push(r.status()+' '+u);if(!u.startsWith('http://localhost'))ext.push(u.slice(0,50))});
 await p.goto(`http://localhost:${port}${path}`,{waitUntil:'networkidle'});
 const h=await p.evaluate(()=>document.body.scrollHeight);for(let y=0;y<h;y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(60)}
 await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);
 const r=await p.evaluate(()=>{const c={};const samples={};
  for(const e of document.querySelectorAll('body *')){const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ');if(!t)continue;
   const s=getComputedStyle(e);const k=s.fontFamily.split(',')[0].replace(/"/g,'')+' '+s.fontStyle+' '+s.fontWeight;c[k]=(c[k]||0)+1;if(!samples[k])samples[k]=t.slice(0,50);}
  return {counts:c,samples,loaded:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replace(/"/g,'')+' '+f.style+' '+f.weight)}});
 out[tag+path]={...r,fonts,bad,ext};
 if(path==='/'){await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);await p.screenshot({path:`${E}/top-${tag}.png`});
  // crop samples: nav (500?), CTA buttons(600/700), italic text
  const sel={nav:'header nav',h1:'h1',cta:'main a[href="/dat-lich"]'};
  for(const [n,s] of Object.entries(sel)){const el=await p.$(s);if(el)await el.screenshot({path:`${E}/crop-${n}-${tag}.png`});}
  const it=await p.$('xpath=//*[contains(@class,"italic") or self::em or self::i][normalize-space()]');if(it){await it.scrollIntoViewIfNeeded();await it.screenshot({path:`${E}/crop-italic-${tag}.png`});}
 }
 await p.close();}
require('fs').writeFileSync(E+'/typography.json',JSON.stringify(out,null,1));
for(const k in out){console.log('==',k,'fonts',out[k].fonts.length,'bad',out[k].bad.length,'ext',out[k].ext.length);for(const [s,n] of Object.entries(out[k].counts).sort())console.log('  ',s.padEnd(32),n,'|',out[k].samples[s]);console.log('  loaded:',[...new Set(out[k].loaded)].join(' ; '))}
await br.close();})();
