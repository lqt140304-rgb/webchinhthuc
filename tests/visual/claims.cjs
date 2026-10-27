const { chromium } = require('playwright');
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1440,height:900}});
for (const [u,tag] of [['http://127.0.0.1:4191/docs/design/phase-3a-interactive-mockups.html','2fc3387']]) {
 await p.goto(u,{waitUntil:'networkidle'});
 const out=await p.evaluate(()=>{const r={};
  r.cards=[...document.querySelectorAll('#page-doi-ngu .p3a-team-card')].slice(0,3).concat([...document.querySelectorAll('#dept-grooming .p3a-team-card, #dept-support .p3a-team-card')]).map(c=>c.innerText.replace(/\s+/g,' ').trim());
  r.deptIntro=[...document.querySelectorAll('#page-doi-ngu section')].map(s=>{const h=s.querySelector('h2');const p=h&&h.nextElementSibling;return h?h.innerText+' :: '+(p?p.innerText:''):null}).filter(Boolean);
  r.facility=[...document.querySelectorAll('#page-co-so-vat-chat h3, #page-co-so-vat-chat h3 + p')].map(e=>e.innerText.replace(/\s+/g,' ').trim());
  r.principles=[...document.querySelectorAll('#page-gioi-thieu li, #page-gioi-thieu [class*=ledger] p')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,12);
  return r;});
 require('fs').writeFileSync(process.argv[2],JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1).slice(0,6000));
}
await br.close();})();
