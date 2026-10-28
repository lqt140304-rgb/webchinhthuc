const { chromium } = require('playwright'); const fs=require('fs');
const axeSrc=fs.readFileSync(process.argv[2]+'/node_modules/axe-core/axe.min.js','utf8');
const routes=['/','/gioi-thieu','/doi-ngu','/co-so-vat-chat','/dat-lich','/lien-he','/dich-vu','/khong-ton-tai'];
(async()=>{const b=await chromium.launch();
 for (const [name,port] of [['base',5101],['h2',5112]]) for (const w of [320,412,1440]) { let tot=0; const out=[];
  for (const r of routes){ const p=await b.newPage({viewport:{width:w,height:800}}); await p.goto('http://localhost:'+port+r,{waitUntil:'networkidle'}); await p.evaluate(axeSrc);
   const res=await p.evaluate(async()=>{const x=await axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa']}); return x.violations.map(v=>v.id+':'+v.nodes.length)}); tot+=res.length; out.push(r+' '+JSON.stringify(res)); await p.close();}
  console.log(name,w,'violation-rules:',tot,'|',out.filter(o=>!o.endsWith('[]')).join(' ; ')||'none'); }
 await b.close();})();
