// usage: node serve.cjs <root> <port> <mode: spa-base|spa-spike|strict-spike>
const http=require('http'),fs=require('fs'),path=require('path');
const [root,port,mode]=process.argv.slice(2);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain','.xml':'application/xml'};
function send(res,code,f){res.writeHead(code,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);}
http.createServer((req,res)=>{
  const p=decodeURIComponent(req.url.split('?')[0]);
  const f=path.join(root,p);
  if(fs.existsSync(f)&&fs.statSync(f).isFile()) return send(res,200,f);
  const idx=path.join(root,p.replace(/\/$/,''),'index.html');
  if(fs.existsSync(idx)) return send(res,200,idx);
  if(mode==='spa-base') return send(res,200,path.join(root,'index.html'));
  if(mode==='vercel-hard'){ if(/^\/tai-khoan\//.test(p)) return send(res,200,path.join(root,'__spa-fallback.html')); return send(res,404,path.join(root,'404.html')); }
  if(mode==='spa-spike') return send(res,200,path.join(root,'__spa-fallback.html'));
  return send(res,404,path.join(root,'404/index.html'));
}).listen(+port,()=>console.log('listening',port,mode));
