const { chromium } = require('playwright');
(async()=>{const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const p=await ctx.newPage();
await p.goto('http://127.0.0.1:4190/docs/design/mockup-repaired-QA.html',{waitUntil:'networkidle'});await p.evaluate(()=>switchPageByNav('doi-ngu'));
const st=await p.$eval('#p3a-filter-status',e=>({role:e.getAttribute('role'),live:e.getAttribute('aria-live')}));console.log('status region',st);
// keyboard: focus the "Bộ phận Bác sĩ Thú y" button and press Enter
const btn=await p.$('button:has-text("Bộ phận Bác sĩ Thú y")');await btn.focus();await p.keyboard.press('Enter');
const r=await p.evaluate(()=>({vet:document.getElementById('dept-vet').hidden,groom:document.getElementById('dept-grooming').hidden,support:document.getElementById('dept-support').hidden,pressed:[...document.querySelectorAll('#page-doi-ngu .p3a-filter-btn')].filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>b.textContent.trim().slice(0,30)),status:document.getElementById('p3a-filter-status').textContent.slice(0,90),focusVisible:getComputedStyle(document.activeElement).outlineStyle+' '+getComputedStyle(document.activeElement).outlineWidth}));console.log('after Enter on vet filter',r);
// tab order count of focusable in hidden sections
const tabbableHidden=await p.evaluate(()=>[...document.querySelectorAll('#dept-grooming a,#dept-grooming button')].filter(e=>e.offsetParent!==null).length);console.log('tabbable inside hidden grooming:',tabbableHidden);
const trans=await p.$eval('.p3a-team-card',e=>getComputedStyle(e).transitionDuration);console.log('reduced-motion card transition:',trans);
// LTS card position and styling vs others
const cards=await p.evaluate(()=>[...document.querySelectorAll('#p3a-vet-grid .p3a-team-card')].slice(0,3).map(c=>{const s=getComputedStyle(c);return {t:c.querySelector('h3,h4')?.textContent.trim().slice(0,22),bg:s.backgroundColor,border:s.borderColor+' '+s.borderWidth,shadow:s.boxShadow.slice(0,40),w:Math.round(c.getBoundingClientRect().width),h:Math.round(c.getBoundingClientRect().height),hf:getComputedStyle(c.querySelector('h3,h4')).fontSize}}));console.log(JSON.stringify(cards,null,0));
await br.close();})();
