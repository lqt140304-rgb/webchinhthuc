const { chromium } = require('playwright');
(async()=>{const br=await chromium.launch();const E=process.argv[2];const out={};
for (const [port,tag] of [[4174,'4c824c4'],[4173,'820a907']]){
 for (const path of ['/','/dat-lich','/khong-ton-tai']){
 const p=await br.newPage({viewport:{width:1366,height:900}});const ext=[],bad=[],fonts=[];
 p.on('response',r=>{const u=r.url();if(!u.startsWith('http://localhost'))ext.push(u.slice(0,60));if(r.status()>=400)bad.push(r.status()+' '+u);if(/\.woff2/.test(u))fonts.push(u.split('/').pop())});
 await p.goto(`http://localhost:${port}${path}`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const r=await p.evaluate(()=>{const f=s=>{const e=document.querySelector(s);return e&&getComputedStyle(e).fontFamily.split(',')[0]+'/'+getComputedStyle(e).fontWeight};
  const loaded=[...document.fonts].filter(x=>x.status==='loaded').map(x=>x.family.replace(/"/g,'')+' '+x.style+' '+x.weight);
  const used=[...new Set([...document.querySelectorAll('body *')].map(e=>{const c=getComputedStyle(e);return c.fontFamily.split(',')[0].replace(/"/g,'')+' '+c.fontStyle+' '+c.fontWeight}))];
  return {h1:f('h1'),body:f('p'),btn:f('a,button'),loaded:[...new Set(loaded)].sort(),used:used.sort()}});
 out[tag+path]={...r,ext:[...new Set(ext)],bad,fontsFetched:fonts.length};
 if(path==='/'){const h=await p.$('h1');await h.screenshot({path:`${E}/h1-${tag}.png`});await p.screenshot({path:`${E}/top-${tag}-1366.png`});}
 await p.close();}}
require('fs').writeFileSync(E+'/fontcheck.json',JSON.stringify(out,null,1));
for(const k in out){const o=out[k];console.log(k,'h1',o.h1,'body',o.body,'ext',o.ext.length?o.ext:'none','bad',o.bad,'fontsFetched',o.fontsFetched);}
console.log('used new:',out['820a907/'].used.join(' | '));console.log('loaded new:',out['820a907/'].loaded.join(' | '));
await br.close();})();
