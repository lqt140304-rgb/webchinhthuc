const { chromium } = require('playwright');
const URL='http://127.0.0.1:4191/docs/design/phase-3a-interactive-mockups.html';
(async()=>{const br=await chromium.launch();const out={};
// Mobile menu at real 375 + studio 390
const ctx=await br.newContext({viewport:{width:375,height:812}});const p=await ctx.newPage();await p.goto(URL,{waitUntil:'networkidle'});
await p.click('button:has-text("390px")');await p.waitForTimeout(200);
const t=await p.$('.p3a-menu-toggle');const tb=t&&await t.boundingBox();
out.toggle={exists:!!t,visible:t?await t.isVisible():false,box:tb&&[Math.round(tb.width),Math.round(tb.height)],attrs:t&&await t.evaluate(e=>({expanded:e.getAttribute('aria-expanded'),controls:e.getAttribute('aria-controls'),label:e.getAttribute('aria-label')||e.textContent.trim()}))};
await t.focus();const ring=await t.evaluate(e=>{const s=getComputedStyle(e);return s.outlineStyle+' '+s.outlineWidth+' '+s.outlineColor+' off '+s.outlineOffset});out.toggleFocusRing=ring;
await p.keyboard.press('Enter');await p.waitForTimeout(300);
out.afterOpen=await p.evaluate(()=>{const d=document.getElementById('p3a-mobile-drawer');const t=document.querySelector('.p3a-menu-toggle');return {expanded:t.getAttribute('aria-expanded'),drawerVisible:!!d&&d.offsetParent!==null&&!d.hidden,links:d?[...d.querySelectorAll('a,button')].map(a=>a.textContent.trim()).slice(0,10):[],linkHeights:d?[...d.querySelectorAll('a')].map(a=>Math.round(a.getBoundingClientRect().height)):[]}});
await p.screenshot({path:process.argv[2]+'/mobile-menu-open-375.png'});
await p.keyboard.press('Escape');await p.waitForTimeout(300);
out.afterEsc=await p.evaluate(()=>{const d=document.getElementById('p3a-mobile-drawer');const t=document.querySelector('.p3a-menu-toggle');return {expanded:t.getAttribute('aria-expanded'),drawerVisible:!!d&&d.offsetParent!==null&&!d.hidden,focusOnToggle:document.activeElement===t}});
// navigate via drawer link to doi-ngu
await t.click();await p.waitForTimeout(200);const l=await p.$('#p3a-mobile-drawer a:has-text("Đội ngũ"), #p3a-mobile-drawer button:has-text("Đội ngũ")');if(l){await l.click();await p.waitForTimeout(400);}
out.navViaDrawer=await p.evaluate(()=>document.getElementById('page-doi-ngu').classList.contains('p3a-is-active'));
await ctx.close();
// Desktop focus + breadcrumb
const c2=await br.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const p2=await c2.newPage();await p2.goto(URL,{waitUntil:'networkidle'});
out.breadcrumb=await p2.evaluate(()=>[...document.querySelectorAll('#page-gioi-thieu .p3a-breadcrumb a, #page-gioi-thieu nav[aria-label] a')].map(a=>[a.textContent.trim(),Math.round(a.getBoundingClientRect().height)]));
const cta=await p2.$('#page-gioi-thieu a.p3a-btn, #page-gioi-thieu .p3a-btn');await cta.focus();out.ctaFocusRing=await cta.evaluate(e=>{const s=getComputedStyle(e);return s.outlineStyle+' '+s.outlineWidth+' off '+s.outlineOffset});
// Tab through first 6 focusables on page and record outline width
await p2.evaluate(()=>document.activeElement.blur());const rings=[];for(let i=0;i<8;i++){await p2.keyboard.press('Tab');rings.push(await p2.evaluate(()=>{const e=document.activeElement;const s=getComputedStyle(e);return (e.textContent.trim().slice(0,18)||e.tagName)+': '+s.outlineStyle+' '+s.outlineWidth}))}out.tabRings=rings;
out.reducedMotion=await p2.$eval('.p3a-btn',e=>getComputedStyle(e).transitionDuration);
await p2.evaluate(()=>switchPageByNav('doi-ngu'));
const sim=await p2.evaluate(()=>{const b=[...document.querySelectorAll('#page-doi-ngu .p3a-filter-btn')].find(x=>/N = 1/.test(x.textContent));const box=b.closest('div[class],section');return {simText:box.innerText.slice(0,260)}});out.simulatorPanel=sim;
const btn=await p2.$('#page-doi-ngu button:has-text("Bộ phận Bác sĩ Thú y")');await btn.focus();await p2.keyboard.press('Enter');
out.filter=await p2.evaluate(()=>({vet:document.getElementById('dept-vet').hidden,groom:document.getElementById('dept-grooming').hidden,support:document.getElementById('dept-support').hidden,status:document.getElementById('p3a-filter-status').textContent.slice(0,120),live:document.getElementById('p3a-filter-status').getAttribute('aria-live')}));
out.vipCheck=await p2.evaluate(()=>[...document.querySelectorAll('#p3a-vet-grid .p3a-team-card')].slice(0,3).map(c=>{const s=getComputedStyle(c);const h=c.querySelector('h3,h4');return [h.textContent.trim().slice(0,20),s.backgroundColor,s.borderColor,s.boxShadow.slice(0,30),Math.round(c.getBoundingClientRect().width)+'x'+Math.round(c.getBoundingClientRect().height),getComputedStyle(h).fontSize,getComputedStyle(h).color]}));
out.teamImgs=await p2.evaluate(()=>document.querySelectorAll('#page-doi-ngu img').length);
console.log(JSON.stringify(out,null,1));await br.close();})();
