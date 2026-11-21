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
  if (req.url.startsWith('/lumia') || req.url.startsWith('/online')) return lumia(req, res);
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  if (p === '/painel') p = '/controle.html';
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
  const t = String(u.searchParams.get('t') || '').slice(0, 450).trim();
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

/* ---------- LUMIA STREAM (ou qualquer app que mande webhook) ----------
   O Lumia manda pra https://SEU-SERVIDOR/lumia?key=SEU_PIN
   (GET com ?acao=...&nome=... ou POST com JSON {"acao":"...","nome":"{{username}}","foto":"{{avatar}}","presente":"...","texto":"{{message}}"})
   acao: arena (entra como palhaço) · lutar (vira guerreiro) · poder (dá o item do presente) · chat (fala na arena)
   /online?key=SEU_PIN mostra quem apareceu na live nos últimos 10 minutos */
/* O TikTok não avisa quando alguém SAI da live. Então: quem fica 2 minutos sem aparecer
   (lista de quem está assistindo, curtida, comentário, presente, compartilhar) é considerado fora:
   o boneco sai da arena e a pessoa some da lista da TV. Se aparecer de novo, entra de novo. */
const SAI_MS = 120000;
const SAIU = new Set();
const PESSOAS = new Map(); // nome/@ em minúsculo -> { id, name, foto, t }
function lembra(r, ...nomes) { r.t = Date.now(); nomes.concat(r.name).forEach(n => { if (n) PESSOAS.set(String(n).toLowerCase().replace(/^@/, ''), r); }); if (PESSOAS.size > 5000) PESSOAS.delete(PESSOAS.keys().next().value); }
function lumia(req, res) {
  const u = new URL(req.url, 'http://x');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (ADMIN_KEY && u.searchParams.get('key') !== ADMIN_KEY) { res.writeHead(403); return res.end('PIN errado'); }
  if (u.pathname === '/online') {
    const vis = new Set(), lista = [];
    PESSOAS.forEach(p => { if (!vis.has(p.id) && Date.now() - p.t < 600000) { vis.add(p.id); lista.push(p.name); } });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); return res.end(JSON.stringify({ online: lista.length, nomes: lista }));
  }
  let corpo = '';
  req.on('data', c => { corpo += c; if (corpo.length > 20000) req.destroy(); });
  req.on('end', () => {
    let d = {}; try { d = corpo ? JSON.parse(corpo) : {}; } catch (e) { d = {}; }
    const q = k => String(d[k] != null ? d[k] : (u.searchParams.get(k) || '')).trim();
    const acao = q('acao').toLowerCase() || 'arena', nome = q('nome') || q('username') || q('usuario');
    if (!nome) { res.writeHead(400); return res.end('falta o nome'); }
    const k = nome.toLowerCase().replace(/^@/, ''), conhecido = PESSOAS.get(k);
    const p = conhecido || { id: 'lumia_' + k, name: nome.replace(/^@/, ''), foto: '' };
    const foto = q('foto') || q('avatar'); if (foto && !p.foto) p.foto = foto; lembra(p, k);
    const base = { id: p.id, name: p.name, foto: p.foto };
    if (acao === 'lutar' || acao === 'guerreiro') send({ type: 'chat', ...base, text: 'LUTAR' });
    else if (acao === 'poder' || acao === 'presente') send({ type: 'gift', ...base, gift: q('presente') || q('gift') || 'rosa', count: +q('quantidade') || 1, diamonds: +q('moedas') || 0 });
    else if (acao === 'chat') send({ type: 'chat', ...base, text: q('texto') || q('message') });
    else if (acao === 'vida') send({ type: 'follow', ...base });
    else send({ type: 'join', ...base });
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('ok: ' + acao + ' ' + p.name);
  });
}

const wss = new WebSocketServer({
  server,
  verifyClient: ({ req }) => {
    if (!ADMIN_KEY) return true;
    return new URL(req.url, 'http://x').searchParams.get('key') === ADMIN_KEY;
  }
});
const send = o => { // vai pro jogo e pro painel
  const s = JSON.stringify(o);
  wss.clients.forEach(c => c.readyState === 1 && c.send(s));
};
const paraPainel = (o, menos) => { const s = JSON.stringify(o); wss.clients.forEach(c => c !== menos && c.papel === 'painel' && c.readyState === 1 && c.send(s)); };

/* ---------- PAINEL DE CONTROLE (abre no navegador da TV ou do celular: /painel) ----------
   o painel manda {cmd:'acao', acao, id}; o servidor repassa pro jogo como se fosse da live.
   o jogo manda {type:'estado'} (quem está na arena) e o servidor repassa pros painéis. */
const PRES_NOME = { rosa: 'rosa', sorvete: 'casquinha', gg: 'bom jogo', coracao: 'heart me', dino: 'mini dino', controle: 'controle', bau: 'baú' };
let ESTADO = null;
function online() { const vis = new Set(), lista = []; PESSOAS.forEach(p => { if (!vis.has(p.id) && Date.now() - p.t < SAI_MS && !SAIU.has(p.id)) { vis.add(p.id); lista.push({ id: p.id, nome: p.name, foto: p.foto || '', t: p.t }); } }); return lista.sort((a, b) => b.t - a.t).slice(0, 150); }
// avisa o jogo quantos painéis estão olhando a telinha (se ninguém olha, o jogo não gasta bateria mandando imagem)
function avisaTela() { setTimeout(() => { let n = 0; wss.clients.forEach(c => { if (c.papel === 'painel' && c.readyState === 1) n++; }); const s = JSON.stringify({ type: 'tela', n }); wss.clients.forEach(c => c.papel !== 'painel' && c.readyState === 1 && c.send(s)); }, 300); }
wss.on('connection', (ws, req) => {
  ws.papel = new URL(req.url, 'http://x').searchParams.get('papel') || 'jogo';
  if (ws.papel === 'painel') { ws.send(JSON.stringify({ type: 'online', lista: online() })); if (ESTADO) ws.send(JSON.stringify(ESTADO)); }
  avisaTela();
  ws.on('close', avisaTela);
  ws.on('message', (d, bin) => {
    // TELINHA: o jogo manda a imagem da arena (jpg pequeno) e o servidor repassa pros painéis da TV
    if (bin) { if (ws.papel !== 'painel' && d.length < 120000) wss.clients.forEach(c => c.papel === 'painel' && c.readyState === 1 && c.bufferedAmount < 400000 && c.send(d, { binary: true })); return; }
    let o; try { o = JSON.parse(String(d).slice(0, 50000)); } catch (e) { return; }
    if (o.type === 'estado' && ws.papel !== 'painel') { ESTADO = o; return paraPainel(o, ws); }
    if (ws.papel !== 'painel' || o.cmd !== 'acao') return;
    const id = String(o.id || ''); let p = null; PESSOAS.forEach(x => { if (x.id === id) p = x; });
    if (!p && ESTADO) [].concat(ESTADO.lut || [], ESTADO.plat || []).forEach(x => { if (x.id === id) p = { id, name: x.nome, foto: x.foto || '' }; });
    if (!p) return;
    const base = { id: p.id, name: p.name, foto: p.foto || '', painel: true }, a = String(o.acao || '');
    if (a === 'lutar') send({ type: 'chat', ...base, text: 'LUTAR' });
    else if (a === 'vida') send({ type: 'follow', ...base });
    else if (a === 'tirar') send({ type: 'tirar', ...base });
    else if (a.startsWith('p:')) send({ type: 'gift', ...base, gift: PRES_NOME[a.slice(2)] || 'rosa', count: 1, diamonds: 0 });
    else send({ type: 'join', ...base });
  });
});
setInterval(() => paraPainel({ type: 'online', lista: online() }), 3000);
// a cada 10 s: quem sumiu há 2 min sai da arena
setInterval(() => {
  const ult = new Map();
  PESSOAS.forEach(p => { if (!ult.has(p.id) || ult.get(p.id).t < p.t) ult.set(p.id, p); });
  ult.forEach(p => {
    if (SAIU.has(p.id) || p.painel) return;
    if (Date.now() - p.t > SAI_MS && Date.now() - p.t < SAI_MS + 3600000) { SAIU.add(p.id); send({ type: 'tirar', id: p.id, name: p.name, saiu: true }); }
  });
  if (SAIU.size > 5000) SAIU.clear();
}, 10000);

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
      const r = { id: String(x.userId || x.uniqueId || x.nickname || Math.random()), name: x.nickname || x.uniqueId || 'anônimo', foto };
      lembra(r, x.uniqueId, x.nickname);
      // voltou pra live depois de ter saído: entra de novo
      if (SAIU.has(r.id)) { SAIU.delete(r.id); setTimeout(() => send({ type: 'join', ...r }), 50); }
      return r;
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
