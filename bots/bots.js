// 20 jogadores de teste que entram na vila de Brumafria pelo Supabase Realtime
const { createClient } = require('@supabase/supabase-js');
const URL = 'https://dhqdikdhhxohoyfuaqpm.supabase.co', KEY = 'sb_publishable_NJ3_ude0cMuanBfrkkSvsQ_ZJC8CHTQ';
const MIN = +(process.env.MINUTOS || 30), N = Math.min(40, +(process.env.QTD || 20));
const sb = createClient(URL, KEY, { realtime: { params: { eventsPerSecond: 120 } } });
const ch = sb.channel('aetherion-mundo', { config: { broadcast: { self: false, ack: false } } });
const NOMES = ['DarkWolf', 'Lunna', 'Kaiser_BR', 'ShadowMage', 'Pirapora_Zé', 'NinjaRox', 'FeehGamer', 'Tiaguinho', 'Valkiria', 'MestreYoda', 'CapitãoK', 'Ruivinha', 'Ghost_PVP', 'Dragonzinho', 'LuaNegra', 'SrBatata', 'Mia_Arqueira', 'ReiLeão', 'BrunoBlade', 'Saphira', 'Kratos_MG', 'Pandinha', 'Thor99', 'EstrelaGuia'];
const GUILDAS = [['Lobos do Norte', '🐺'], ['Ordem de Prata', '🛡️'], ['Chama Eterna', '🔥'], ['Sombras', '🌙'], ['', '']];
const ARMAS = ['espada', 'glacial', 'besta', 'bastao', 'dragao', 'espada'];
const rnd = (a, b) => a + Math.random() * (b - a);
const reais = {};
const bots = Array.from({ length: N }, (_, i) => { const g = GUILDAS[i % GUILDAS.length]; const a = rnd(0, 6.28), r = rnd(1, 9);
  return { id: 'bot' + i, n: NOMES[i % NOMES.length], lv: Math.floor(rnd(3, 60)), g: g[0], ge: g[1], z: 'vila', dn: 0, x: Math.cos(a) * r, y: 0, zz: 2 + Math.sin(a) * r, r: 0, a: 'para', w: ARMAS[i % ARMAS.length], alvo: null, espera: rnd(0, 3), seg: i < 4, pulo: 0, atk: 0 }; });
function novoAlvo(b) { const a = rnd(0, 6.28), r = rnd(0, 10); b.alvo = [Math.cos(a) * r, 2 + Math.sin(a) * r]; b.corre = Math.random() < 0.3; }
function passo(b, dt) {
  const real = Object.values(reais).filter(p => Date.now() - p.t < 6000 && p.z === 'vila')[0];
  if (b.seg && real) { const dx = real.x - b.x, dz = real.zz - b.zz, d = Math.hypot(dx, dz); const ang = (b.id.charCodeAt(3) % 4) * 1.57; b.alvo = [real.x + Math.cos(ang) * 2.2, real.zz + Math.sin(ang) * 2.2]; b.corre = d > 6; }
  if (b.espera > 0) { b.espera -= dt; b.a = b.atk > 0 ? 'atk' : 'para'; if (b.atk > 0) b.atk -= dt; return; }
  if (!b.alvo) novoAlvo(b); const dx = b.alvo[0] - b.x, dz = b.alvo[1] - b.zz, d = Math.hypot(dx, dz);
  if (d < 0.4) { b.alvo = null; b.espera = b.seg ? 0.3 : rnd(1, 5); if (Math.random() < 0.25) b.atk = 1.2; b.a = 'para'; return; }
  const v = (b.corre ? 5.5 : 2.4) * dt, s = Math.min(v, d); b.x += dx / d * s; b.zz += dz / d * s; b.r = Math.atan2(dx, dz); b.a = b.corre ? 'corre' : 'anda';
  if (b.pulo > 0) { b.pulo -= dt; b.y = Math.max(0, Math.sin((1 - b.pulo / 0.6) * Math.PI) * 1.4); b.a = 'pulo'; } else { b.y = 0; if (Math.random() < 0.004) b.pulo = 0.6; } }
ch.on('broadcast', { event: 'p' }, m => { const p = m.payload; if (p && !String(p.id).startsWith('bot')) { if (!reais[p.id]) console.log('Jogador real entrou:', p.n, p.g ? '[' + p.g + ']' : ''); reais[p.id] = { ...p, t: Date.now() }; } });
ch.subscribe(st => { console.log('canal:', st); if (st !== 'SUBSCRIBED') return; console.log(`${N} bots na vila por ${MIN} minutos`);
  let t0 = Date.now(), ult = Date.now(), k = 0;
  const tick = setInterval(() => { const ag = Date.now(), dt = (ag - ult) / 1000; ult = ag; bots.forEach(b => passo(b, dt));
    // manda metade dos bots por vez (cada bot 2x por segundo)
    bots.forEach((b, i) => { if ((i + k) % 2) return; const { alvo, espera, seg, pulo, atk, corre, ...pl } = b; pl.x = +pl.x.toFixed(2); pl.zz = +pl.zz.toFixed(2); pl.y = +pl.y.toFixed(2); pl.r = +pl.r.toFixed(2); ch.send({ type: 'broadcast', event: 'p', payload: pl }); }); k++;
    if (ag - t0 > MIN * 60000) { clearInterval(tick); bots.forEach(b => ch.send({ type: 'broadcast', event: 'sai', payload: { id: b.id } })); console.log('fim'); setTimeout(() => process.exit(0), 1500); } }, 250);
  setInterval(() => console.log(new Date().toISOString().slice(11, 19), 'jogadores reais vistos:', Object.values(reais).filter(p => Date.now() - p.t < 6000).map(p => p.n).join(', ') || 'nenhum'), 30000); });
