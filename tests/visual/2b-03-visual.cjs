const { chromium } = require('playwright');
const E = process.argv[2]; const B = 'http://localhost:4173';
function lum(r,g,b){const f=c=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)}
(async()=>{
  const br = await chromium.launch(); const out = {};
  for (const w of [320,360,390,768,1366,1440,1920]) {
    const p = await br.newPage({viewport:{width:w,height:900}});
    await p.goto(B+'/',{waitUntil:'networkidle'});
    // scroll everything to load lazy images
    const h = await p.evaluate(()=>document.body.scrollHeight);
    for (let y=0;y<h;y+=600){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(80);}
    await p.waitForLoadState('networkidle');
    const r = await p.evaluate(()=>{
      const imgs=[...document.images].map(i=>({src:i.currentSrc.replace(/.*images\//,''),alt:i.alt,ok:i.complete&&i.naturalWidth>0,
        ratioDiff:(i.naturalWidth&&i.clientHeight)?Math.abs((i.clientWidth/i.clientHeight)-(i.naturalWidth/i.naturalHeight)).toFixed(2):null,
        fit:getComputedStyle(i).objectFit,cw:i.clientWidth,nw:i.naturalWidth}));
      const labels=[...document.querySelectorAll('span,div,p')].filter(e=>/^(Ảnh minh họa|Câu chuyện minh họa)$/i.test(e.textContent.trim())&&e.children.length===0)
        .map(e=>{const cs=getComputedStyle(e);const b=e.getBoundingClientRect();const sec=e.closest('section');return {t:e.textContent.trim(),fs:cs.fontSize,color:cs.color,bg:cs.backgroundColor,w:Math.round(b.width),h:Math.round(b.height),sec:sec&&(sec.getAttribute('aria-labelledby')||sec.className.slice(0,30))}});
      return {overflow:document.documentElement.scrollWidth-innerWidth, imgs, labels};
    });
    out[w]=r;
    await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(200);
    await p.screenshot({path:`${E}/home-${w}.png`,fullPage:true});
    const p2 = await br.newPage({viewport:{width:w,height:900}});
    await p2.goto(B+'/dat-lich',{waitUntil:'networkidle'});
    out[w].datlichOverflow = await p2.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    await p2.screenshot({path:`${E}/dat-lich-${w}.png`,fullPage:true});
    await p2.close();
    if (w===1366||w===390){
      // label contrast: sample screenshot pixels inside each label
      const els = await p.$$('xpath=//span[normalize-space(text())="Ảnh minh họa"]');
      out[w].labelShots=[];
      for (const [i,el] of els.entries()){ await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
        const box=await el.boundingBox(); const card=await el.evaluateHandle(e=>e.closest('article,a,div[class]')?.parentElement||e.parentElement);
        await el.screenshot({path:`${E}/label-${w}-${i}.png`});
        try{ await card.asElement().screenshot({path:`${E}/label-card-${w}-${i}.png`}); }catch(e){}
        out[w].labelShots.push(box);
      }
    }
    await p.close();
  }
  require('fs').writeFileSync(E+'/visual.json',JSON.stringify(out,null,1));
  for (const w in out){const o=out[w];console.log(w,'overflow',o.overflow,'datlich',o.datlichOverflow,'imgsBad',o.imgs.filter(i=>!i.ok).map(i=>i.src),'distort',o.imgs.filter(i=>i.fit!=='cover'&&i.ratioDiff>0.05).map(i=>i.src),'labels',o.labels.length)}
  console.log(JSON.stringify(out[1366].labels,null,0)); console.log(out[1366].imgs.map(i=>i.src+' | '+i.alt).join('\n'));
  await br.close();
})();
