const { chromium } = require('playwright');
const routes=['/','/gioi-thieu','/doi-ngu','/co-so-vat-chat','/dat-lich'];
const RUNS=3;
(async()=>{
  const b=await chromium.launch();
  const res={};
  for (const [name,port] of [['base',5101],['hard',5104]]) for (const r of routes) for (let i=0;i<RUNS;i++){
    const ctx=await b.newContext({viewport:{width:412,height:823},deviceScaleFactor:2.625,isMobile:true,hasTouch:true});
    const p=await ctx.newPage(); const c=await ctx.newCDPSession(p);
    await c.send('Network.enable'); await c.send('Network.setCacheDisabled',{cacheDisabled:true});
    await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
    await c.send('Emulation.setCPUThrottlingRate',{rate:4});
    await p.addInitScript(()=>{window.__cls=0;window.__lcp=0;window.__fcp=0;
      new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});
      new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(l=>{for(const e of l.getEntries()) if(e.name==='first-contentful-paint') window.__fcp=e.startTime}).observe({type:'paint',buffered:true});});
    await p.goto('http://localhost:'+port+r,{waitUntil:'load',timeout:120000});
    await p.waitForTimeout(4000);
    const m=await p.evaluate(()=>({cls:window.__cls,lcp:window.__lcp,fcp:window.__fcp,bytes:performance.getEntriesByType('resource').reduce((a,e)=>a+(e.transferSize||0),0)+(performance.getEntriesByType('navigation')[0]?.transferSize||0)}));
    (res[name+' '+r]??=[]).push(m); await ctx.close();
  }
  const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)]};
  console.log('method: Chromium (Playwright) local static server, mobile 412x823 DPR2.625, CPU 4x, 150ms RTT / 1.6 Mbps down, cache disabled, '+RUNS+' runs, median; CLS via layout-shift observer, LCP/FCP via PerformanceObserver, 4s settle after load');
  for (const [k,v] of Object.entries(res)) console.log(k.padEnd(24),'FCP',Math.round(med(v.map(x=>x.fcp))),'ms | LCP',Math.round(med(v.map(x=>x.lcp))),'ms | CLS',med(v.map(x=>x.cls)).toFixed(4),'| max CLS',Math.max(...v.map(x=>x.cls)).toFixed(4),'| KB',Math.round(med(v.map(x=>x.bytes))/1024),'| runs LCP',v.map(x=>Math.round(x.lcp)).join(','));
  await b.close();
})();
