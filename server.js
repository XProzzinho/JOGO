// Uso: node server.js @seu_usuario   (a live precisa estar ligada)
const http=require('http'),fs=require('fs'),path=require('path');
const {WebSocketServer}=require('ws');
const lib=require('tiktok-live-connector');
const Conn=lib.TikTokLiveConnection||lib.WebcastPushConnection; // v2 ou v1
const user=process.argv[2]||process.env.TIKTOK_USER, PORT=process.env.PORT||3000, ROOT=path.join(__dirname,'public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8'};

const server=http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html';
  const f=path.join(ROOT,path.normalize(p));
  if(!f.startsWith(ROOT)){res.writeHead(403);return res.end();}
  fs.readFile(f,(e,d)=>{
    if(e){res.writeHead(404);return res.end('404');}
    res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(d);
  });
});
const wss=new WebSocketServer({server});
const send=o=>{const s=JSON.stringify(o);wss.clients.forEach(c=>c.readyState===1&&c.send(s));};

if(!user){ console.log('Falta o usuário. Exemplo: node server.js @seu_usuario'); }
else{
  const who=u=>{const x=(u&&u.user)||u||{};return{id:String(x.userId||x.uniqueId||x.nickname||Math.random()),name:x.nickname||x.uniqueId||'anônimo'};};
  const live=new Conn(user.replace('@',''));
  const connect=()=>live.connect()
    .then(()=>console.log('✅ Conectado na live de',user))
    .catch(e=>{console.log('❌ Não conectou (a live está ligada?):',e.message||e);setTimeout(connect,10000);});
  live.on('member',d=>send({type:'join',...who(d)}));
  live.on('chat',d=>send({type:'chat',...who(d),text:d.comment}));
  live.on('gift',d=>send({type:'gift',...who(d),gift:d.giftName,count:d.repeatCount||1}));
  live.on('like',d=>send({type:'like',...who(d)}));
  live.on('follow',d=>send({type:'follow',...who(d)}));
  live.on('disconnected',()=>{console.log('Desconectado, tentando de novo...');setTimeout(connect,10000);});
  connect();
}
server.listen(PORT,()=>console.log(`🎮 Jogo em http://localhost:${PORT}`));
