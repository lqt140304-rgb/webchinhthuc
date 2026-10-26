// Verify actual rendered font faces via CDP CSS.getPlatformFontsForNode, per weight/style class.
const { chromium } = require('playwright');
const [,, base, outDir, tag] = process.argv;
(async()=>{
 const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1366,height:900}}); const p=await ctx.newPage();
 const fontReq=[]; p.on('requestfinished',async r=>{if(/woff2/.test(r.url())){const t=r.timing();fontReq.push({file:r.url().split('/').pop(),start:Math.round(t.startTime),end:Math.round(t.responseEnd)})}});
 const out={};
 for (const path of ['/','/dat-lich']) {
  await p.goto(base+path,{waitUntil:'networkidle'});
  const h=await p.evaluate(()=>document.body.scrollHeight);for(let y=0;y<h;y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(50)}
  await p.evaluate(()=>document.fonts.ready);
  // tag one sample element per (family,style,weight) with own text
  const groups=await p.evaluate(()=>{const g={};let i=0;
   for(const e of document.querySelectorAll('body *')){const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('');if(!t)continue;
    const s=getComputedStyle(e);const k=s.fontFamily.split(',')[0].replace(/"/g,'')+'|'+s.fontStyle+'|'+s.fontWeight;
    (g[k]=g[k]||{count:0,ids:[]}).count++; if(g[k].ids.length<3){const id='qa'+(i++);e.setAttribute('data-qa-font',id);g[k].ids.push({id,text:t.slice(0,40)})}}
   return g});
  const cdp=await ctx.newCDPSession(p); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const {root}=await cdp.send('DOM.getDocument',{depth:-1});
  const res={};
  for(const [k,v] of Object.entries(groups)){res[k]={count:v.count,samples:[]};
   for(const s of v.ids){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:`[data-qa-font="${s.id}"]`});
    const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    res[k].samples.push({text:s.text,rendered:fonts.map(f=>`${f.postScriptName||f.familyName}${f.isCustomFont?' (web)':' (system)'} x${f.glyphCount}`)})}}
  out[path]=res; await cdp.detach();
 }
 out.fontRequests=fontReq;
 require('fs').writeFileSync(`${outDir}/rendered-fonts-${tag}.json`,JSON.stringify(out,null,1));
 for(const path of ['/','/dat-lich']){console.log('==',tag,path);for(const [k,v] of Object.entries(out[path]).sort())console.log('  ',k.padEnd(30),'n='+v.count,'→',[...new Set(v.samples.flatMap(s=>s.rendered))].join(' ; '))}
 console.log('font files requested:',[...new Set(fontReq.map(f=>f.file))].join(', '));
 await br.close();})();
