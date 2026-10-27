const { chromium } = require('playwright');
(async()=>{const br=await chromium.launch();
for (const w of [1440,1024,768,375]) { const p=await br.newPage({viewport:{width:w,height:900}});
 await p.goto('http://127.0.0.1:4191/docs/design/phase-3a-interactive-mockups.html',{waitUntil:'networkidle'});await p.evaluate(()=>switchPageByNav('doi-ngu'));
 const vp={1440:'1440',1024:'1024',768:'768',375:'390'}[w]; await p.click(`button:has-text("${vp}px")`);
 for (const [n,mode] of [[1,'standard'],[2,'standard'],[3,'standard'],[5,'standard'],[7,'7-balanced'],[7,'standard'],[8,'standard']]) {
  await p.evaluate(([n,mode])=>setTeamCount(n,mode),[n,mode]); await p.waitForTimeout(100);
  const rows=await p.evaluate(()=>{const g=document.getElementById('p3a-vet-grid');const cs=[...g.querySelectorAll('.p3a-team-card')].filter(c=>!c.hidden);const gb=g.getBoundingClientRect();
   const byTop={};cs.forEach(c=>{const b=c.getBoundingClientRect();const k=Math.round(b.top);(byTop[k]=byTop[k]||[]).push([Math.round(b.left-gb.left),Math.round(b.width),Math.round(b.height)])});
   return {gridW:Math.round(gb.width),rows:Object.values(byTop).map(r=>({n:r.length,w:[...new Set(r.map(x=>x[1]))],h:[...new Set(r.map(x=>x[2]))],leftGap:r[0][0],rightGap:Math.round(gb.width-(r[r.length-1][0]+r[r.length-1][1]))}))}});
  console.log(w,'N='+n,mode,'grid',rows.gridW,JSON.stringify(rows.rows));
 }
 const small=await p.evaluate(()=>[...document.querySelectorAll('#page-doi-ngu a, #page-doi-ngu button')].filter(e=>e.offsetParent).filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent.trim().slice(0,30)+':'+Math.round(e.getBoundingClientRect().height)));
 console.log(w,'tap<44:',small.join(' | '));
 await p.close();}
await br.close();})();
