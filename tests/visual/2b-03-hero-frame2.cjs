const { chromium } = require('playwright');
(async()=>{const br=await chromium.launch();
for (const [port,tag] of [[4174,'bd2fb62'],[4173,'4c824c4']]) for (const w of [390,1366]){
 const p=await br.newPage({viewport:{width:w,height:900}});await p.goto(`http://localhost:${port}/`,{waitUntil:'networkidle'});
 const r=await p.evaluate(()=>{const img=[...document.images].find(i=>/happy-cat/.test(i.currentSrc));const fig=img.parentElement;const cap=[...fig.parentElement.querySelectorAll('*')].find(e=>/Môi trường dịu nhẹ/.test(e.textContent)&&e.children.length<=3&&e!==fig.parentElement);
 const b=e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.right),Math.round(r.bottom)]};
 let c=cap;while(c&&getComputedStyle(c).backgroundImage==='none'&&c.parentElement)c=c.parentElement;
 return {img:b(img),fig:b(img.parentElement),cap:b(cap),gradEl:c&&b(c),gradTag:c&&c.className.slice(0,40),imgW:img.clientWidth,natural:img.naturalWidth,src:img.currentSrc.split('/').pop()}});
 console.log(tag,w,JSON.stringify(r));
 const el=await p.$('img[src*="happy-cat"], img[srcset*="happy-cat"]');await el.evaluate(e=>e.parentElement.parentElement.scrollIntoView({block:'center'}));await p.waitForTimeout(300);
 await (await el.evaluateHandle(e=>e.parentElement.parentElement)).asElement().screenshot({path:`${process.argv[2]}/frame2-${tag}-${w}.png`});
 await p.close();}
await br.close();})();
