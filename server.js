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
  if (req.url.startsWith('/tts')) return tts(req, res);
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

/* ---------- VOZ (ElevenLabs): o jogo manda um texto e recebe o áudio falado ----------
   A chave fica SÓ aqui no servidor, na variável ELEVENLABS_API_KEY do Render (nunca no jogo). */
const TTS_CACHE = new Map();
async function tts(req, res) {
  const u = new URL(req.url, 'http://x');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (ADMIN_KEY && u.searchParams.get('key') !== ADMIN_KEY) { res.writeHead(403); return res.end(); }
  const KEY = process.env.ELEVENLABS_API_KEY;
  if (u.pathname === '/tts-ok') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: !!KEY })); }
  const t = String(u.searchParams.get('t') || '').slice(0, 220).trim();
  if (!KEY || !t) { res.writeHead(KEY ? 400 : 503); return res.end(); }
  const voz = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
  const k = voz + '|' + t;
  try {
    let buf = TTS_CACHE.get(k);
    if (!buf) {
      const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voz + '?output_format=mp3_44100_64', {
        method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text: t, model_id: process.env.ELEVENLABS_MODEL || 'eleven_flash_v2_5', language_code: 'pt', voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35 } })
      });
      if (!r.ok) { console.log('ElevenLabs erro', r.status, (await r.text()).slice(0, 200)); res.writeHead(502); return res.end(); }
      buf = Buffer.from(await r.arrayBuffer());
      TTS_CACHE.set(k, buf); if (TTS_CACHE.size > 300) TTS_CACHE.delete(TTS_CACHE.keys().next().value);
    }
    res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' }); res.end(buf);
  } catch (e) { console.log('TTS falhou:', e.message || e); res.writeHead(500); res.end(); }
}

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
      const pp = x.profilePicture || {}, lista = pp.url || pp.urls || pp.urlList || [];
      const foto = x.profilePictureUrl || (Array.isArray(lista) ? lista[0] : '') || '';
      return { id: String(x.userId || x.uniqueId || x.nickname || Math.random()), name: x.nickname || x.uniqueId || 'anônimo', foto };
    };

    const live = new Conn(user.replace('@', ''), {});
    const connect = () => live.connect()
      .then(() => console.log('Conectado na live de', user))
      .catch(e => { console.log('Não conectou (a live está ligada?):', e.message || e); setTimeout(connect, 15000); });

    /* o TikTok nem sempre manda o aviso de "entrou" pra todo mundo: também usa a lista de quem está assistindo,
       compartilhamento e outras ações pra colocar a pessoa no jogo (cada pessoa só 1 vez a cada 10 min) */
    const visto = new Map();
    const entra = u => { const w = who(u); if (!w.name || w.name === 'anônimo') return; const t = visto.get(w.id); if (t && Date.now() - t < 600000) return; visto.set(w.id, Date.now()); if (visto.size > 2000) visto.delete(visto.keys().next().value); send({ type: 'join', ...w }); };
    live.on('member', d => { const w = who(d); visto.set(w.id, Date.now()); send({ type: 'join', ...w }); });
    live.on('roomUser', d => { (d && (d.topViewers || d.ranksList) || []).forEach(v => entra(v.user || v)); });
    live.on('share', d => entra(d));
    live.on('social', d => entra(d));
    live.on('chat', d => send({ type: 'chat', ...who(d), text: d.comment }));
    live.on('gift', d => send({ type: 'gift', ...who(d), gift: d.giftName || (d.giftDetails && d.giftDetails.giftName), count: d.repeatCount || 1, diamonds: d.diamondCount || (d.giftDetails && d.giftDetails.diamondCount) || 0 }));
    live.on('like', d => send({ type: 'like', ...who(d) }));
    live.on('follow', d => send({ type: 'follow', ...who(d) }));
    live.on('disconnected', () => { console.log('Desconectado, tentando de novo...'); setTimeout(connect, 15000); });
    connect();
  }).catch(e => console.log('Falha ao iniciar a conexão com o TikTok:', e.message || e));
}
