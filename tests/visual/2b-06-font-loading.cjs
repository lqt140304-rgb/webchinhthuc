// Loading-phase font behaviour under throttling: FOUT/FOIT, layout shift, weight swaps.
const { chromium } = require('playwright');
const fs=require('fs');
const [,, base, outDir, tag, vw] = process.argv; const W=+vw||390;
(async()=>{
 const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:W,height:844},deviceScaleFactor:1}); const p=await ctx.newPage();
 await p.addInitScript(()=>{window.__qa={t0:performance.now(),fonts:[],shifts:[],paints:[]};
  new PerformanceObserver(l=>{for(const e of l.getEntries())__qa.shifts.push({t:Math.round(e.startTime),v:+e.value.toFixed(4),src:(e.sources||[]).map(s=>s.node&&s.node.nodeName+(s.node.className?'.'+String(s.node.className).slice(0,30):'')).join(',')})}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries())__qa.paints.push({n:e.name,t:Math.round(e.startTime)})}).observe({type:'paint',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries())__qa.paints.push({n:'lcp',t:Math.round(e.startTime),el:e.element&&e.element.nodeName})}).observe({type:'largest-contentful-paint',buffered:true});
  const seen={};const poll=()=>{if(document.fonts){for(const f of document.fonts){const k=f.family+' '+f.style+' '+f.weight;if(seen[k]!==f.status){seen[k]=f.status;__qa.fonts.push({k:k.replace(/"/g,''),s:f.status,t:Math.round(performance.now())})}}}requestAnimationFrame(poll)};requestAnimationFrame(poll);
 });
 const cdp=await ctx.newCDPSession(p);
 await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const frames=[]; cdp.on('Page.screencastFrame',async f=>{frames.push({ts:f.metadata.timestamp,data:f.data});await cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}).catch(()=>{})});
 const req={}; cdp.on('Network.requestWillBeSent',e=>{if(/woff2/.test(e.request.url))req[e.requestId]={file:e.request.url.split('/').pop(),start:e.timestamp}});
 cdp.on('Network.loadingFinished',e=>{if(req[e.requestId])req[e.requestId].end=e.timestamp});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:60,everyNthFrame:1});
 const navStart=Date.now()/1000; let navTs;
 cdp.on('Network.requestWillBeSent',e=>{if(!navTs&&e.type==='Document')navTs=e.timestamp});
 await p.goto(base+'/',{waitUntil:'load'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1500);
 await cdp.send('Page.stopScreencast');
 const qa=await p.evaluate(()=>window.__qa);
 const fr=Object.values(req).map(r=>({file:r.file,startMs:Math.round((r.start-navTs)*1000),endMs:Math.round((r.end-navTs)*1000)}));
 // save frames: first 40 distinct, with ms from first frame
 const dir=`${outDir}/frames-${tag}-${W}`;fs.mkdirSync(dir,{recursive:true});
 const t0=frames.length?frames[0].ts:0; const list=[];
 frames.forEach((f,i)=>{const ms=Math.round((f.ts-t0)*1000);const fn=`${dir}/f${String(i).padStart(3,'0')}-${ms}ms.jpg`;fs.writeFileSync(fn,Buffer.from(f.data,'base64'));list.push(fn)});
 const out={tag,viewport:W,paints:qa.paints,layoutShifts:qa.shifts,clsTotal:qa.shifts.reduce((a,s)=>a+s.v,0),fontStatus:qa.fonts,fontRequests:fr,frames:list.length};
 fs.writeFileSync(`${outDir}/fontload-${tag}-${W}.json`,JSON.stringify(out,null,1));
 console.log(tag,W,'paints',JSON.stringify(qa.paints),'\n CLS',out.clsTotal.toFixed(4),JSON.stringify(qa.shifts).slice(0,300),'\n fonts loaded at',qa.fonts.filter(f=>f.s==='loaded').map(f=>f.k+'@'+f.t).join(' | '),'\n requests',fr.map(r=>r.file+' '+r.startMs+'-'+r.endMs).join(' | '),'\n frames',list.length);
 await br.close();})();
