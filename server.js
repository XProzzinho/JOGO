const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');

const user = process.argv[2] || process.env.TIKTOK_USER;
const PORT = process.env.PORT || 10000;
const ADMIN_KEY = process.env.ADMIN_KEY;
const ROOT = fs.existsSync(path.join(__dirname, 'public')) ? path.join(__dirname, 'public') : __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

process.on('uncaughtException', e => console.log('Erro:', e.message || e));
process.on('unhandledRejection', e => console.log('Erro:', (e && e.message) || e));

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, path.normalize(p));
  if (!f.startsWith(ROOT) || /server\.js$|package\.json$/.test(f)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    res.end(d);
  });
});

const wss = new WebSocketServer({
  server,
  verifyClient: ({ req }) => {
    if (!ADMIN_KEY) return true;
    return new URL(req.url, 'http://x').searchParams.get('key') === ADMIN_KEY;
  }
});
const send = o => {
  const s = JSON.stringify(o);
  wss.clients.forEach(c => c.readyState === 1 && c.send(s));
};

server.listen(PORT, '0.0.0.0', () => console.log('Servidor no ar na porta', PORT));

if (!user) {
  console.log('Falta a variável TIKTOK_USER com o seu @ do TikTok.');
} else {
  import('tiktok-live-connector').then(lib => {
    const d0 = lib.default || {};
    const Conn = lib.TikTokLiveConnection || lib.WebcastPushConnection ||
                 d0.TikTokLiveConnection || d0.WebcastPushConnection;
    if (!Conn) return console.log('Biblioteca do TikTok não reconhecida.');
    const Sign = lib.SignConfig || d0.SignConfig;
    if (process.env.EULER_API_KEY && Sign) Sign.apiKey = process.env.EULER_API_KEY;

    const who = u => {
      const x = (u && u.user) || u || {};
      return { id: String(x.userId || x.uniqueId || x.nickname || Math.random()), name: x.nickname || x.uniqueId || 'anônimo' };
    };

    const live = new Conn(user.replace('@', ''), {});
    const connect = () => live.connect()
      .then(() => console.log('Conectado na live de', user))
      .catch(e => { console.log('Não conectou (a live está ligada?):', e.message || e); setTimeout(connect, 15000); });

    live.on('member', d => send({ type: 'join', ...who(d) }));
    live.on('chat', d => send({ type: 'chat', ...who(d), text: d.comment }));
    live.on('gift', d => send({ type: 'gift', ...who(d), gift: d.giftName, count: d.repeatCount || 1 }));
    live.on('like', d => send({ type: 'like', ...who(d) }));
    live.on('follow', d => send({ type: 'follow', ...who(d) }));
    live.on('disconnected', () => { console.log('Desconectado, tentando de novo...'); setTimeout(connect, 15000); });
    connect();
  }).catch(e => console.log('Falha ao iniciar a conexão com o TikTok:', e.message || e));
}
