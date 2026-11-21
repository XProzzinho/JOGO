  // ======== LIVE DO TIKTOK (só administrador) — espectadores viram bonecos no seu mundo ========
  const LIVE = { ws: null, url: 'wss://live-tik-tok.onrender.com', av: {}, max: 14, btn: null, quer: false, chk: 0 };
  const liveEsc = s => String(s == null ? '' : s).replace(/[<>&]/g, '').slice(0, 40);
  function liveBtn() {
    if (LIVE.btn) return LIVE.btn;
    const b = document.createElement('button'); b.textContent = '📡'; b.hidden = true;
    b.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:250;width:44px;height:44px;border-radius:50%;border:3px solid #2b2340;background:#fff;font-size:20px;opacity:.9;padding:0';
    b.onclick = () => {
      if (LIVE.quer) { if (confirm('Desligar a live do TikTok?')) liveDesliga(false); return; }
      let k = ''; try { k = localStorage.getItem('liveKey') || ''; } catch (e) {}
      const pin = prompt('PIN da live (deixe vazio se não tiver):', k); if (pin === null) return;
      try { localStorage.setItem('liveKey', pin); } catch (e) {}
      liveLiga(pin);
    };
    document.body.appendChild(b); LIVE.btn = b; return b;
  }
  function liveCor(on) { const b = liveBtn(); b.style.background = on ? '#8affb0' : LIVE.quer ? '#ffe08a' : '#fff'; }
  function liveCria(id, nome) {
    const h = mpHash(id), R = MP_ROUPAS[h % MP_ROUPAS.length];
    const c = makeChar({ skin: MP_PELE[(h >> 3) % MP_PELE.length], hairStyle: ['short', 'long', 'short', 'bald'][(h >> 5) % 4], hairC: MP_CAB[(h >> 7) % MP_CAB.length], top: R[0], top2: R[1], pants: '#3a3040', shoe: '#2a2020', iris: '#3a2a1a', s: 0.82, ph: (h % 100) / 10 });
    c.traverse(o => { if (o.isMesh) o.castShadow = true; }); world.add(c);
    const tag = document.createElement('div'); tag.className = 'mp-tag'; mpTags.appendChild(tag);
    const a = Math.random() * 6.283, r = 3.5 + Math.random() * 4, x = heroi.position.x + Math.cos(a) * r, z = heroi.position.z + Math.sin(a) * r;
    return { c, tag, nome: liveEsc(nome) || 'Visitante', x, z, y: heroi.position.y, tx: x, tz: z, rot: 0, ph: (h % 100) / 10, wT: 0, fala: '', falaT: 0, pulo: -9, t: performance.now(), h: '' };
  }
  function liveAv(id, nome) {
    let a = LIVE.av[id];
    if (!a) {
      const ks = Object.keys(LIVE.av); if (ks.length >= LIVE.max) liveRemove(ks[0]);
      a = LIVE.av[id] = liveCria(id, nome); try { flash('rgba(120,200,255,.25)'); } catch (e) {}
    }
    a.t = performance.now(); return a;
  }
  function liveRemove(id) { const a = LIVE.av[id]; if (!a) return; world.remove(a.c); a.tag.remove(); delete LIVE.av[id]; }
  function liveEvento(m) {
    if (!m || !souAdmin()) return;
    const a = liveAv(String(m.id), m.name), nome = a.nome;
    if (m.type === 'join') aviso('📺 ' + nome + ' entrou na live!', '#ff4a8a');
    else if (m.type === 'chat' && m.text) { a.fala = liveEsc(m.text); a.falaT = performance.now() + 5000; }
    else if (m.type === 'gift') {
      a.pulo = gT; try { flash('rgba(255,210,74,.35)'); } catch (e) {}
      ['cb_atk', 'cb_def', 'cb_regen'].forEach(k => BUFF[k] = Math.max(BUFF[k] || 0, 30));
      vida = Math.min(VIDA_MAX, vida + VIDA_MAX * 0.3);
      aviso('🎁 ' + nome + ' mandou ' + liveEsc(m.gift || 'um presente') + '! Poder concedido por 30 s', '#ffd24a');
    }
    else if (m.type === 'follow') { vida = Math.min(VIDA_MAX, vida + VIDA_MAX * 0.2); aviso('❤️ ' + nome + ' seguiu a live! +vida', '#ff7aa8'); }
    else if (m.type === 'like') a.pulo = gT;
  }
  function liveDesliga(manter) {
    const w = LIVE.ws; LIVE.ws = null; if (w) { w.onclose = null; try { w.close(); } catch (e) {} }
    if (!manter) { LIVE.quer = false; Object.keys(LIVE.av).forEach(liveRemove); liveCor(false); }
  }
  function liveLiga(pin) {
    liveDesliga(true); LIVE.quer = true; liveCor(false);
    let w; try { w = new WebSocket(LIVE.url + (pin ? '?key=' + encodeURIComponent(pin) : '')); } catch (e) { aviso('Live: endereço inválido', '#ff6a6a'); LIVE.quer = false; return; }
    LIVE.ws = w;
    w.onopen = () => { aviso('📺 Live conectada!', '#5aff9a'); liveCor(true); };
    w.onmessage = e => { try { const m = JSON.parse(e.data); if (m && m.type === 'tela') { LIVE.telaN = m.n || 0; return; } liveEvento(m); } catch (er) {} };
    w.onclose = () => { liveCor(false); if (LIVE.quer) setTimeout(() => { if (LIVE.quer) liveLiga(pin); }, 4000); };
  }
  function liveFrame(dt, p) {
    LIVE.chk -= dt; if (LIVE.chk <= 0) { LIVE.chk = 2; let adm = false; try { adm = souAdmin() || /[?&]live=1/.test(location.search); } catch (e) {} liveBtn().hidden = !adm; if (!adm && LIVE.quer) liveDesliga(false); }
    const agora = performance.now();
    Object.keys(LIVE.av).forEach(id => {
      const a = LIVE.av[id]; if (agora - a.t > 900000) { liveRemove(id); return; }
      const vis = !dentro; a.c.visible = vis; if (!vis) { a.tag.hidden = true; return; }
      a.wT -= dt; const dh = Math.hypot(a.x - heroi.position.x, a.z - heroi.position.z);
      if (a.wT <= 0 || dh > 16) { a.wT = 2 + Math.random() * 3; const an = Math.random() * 6.283, r = 3 + Math.random() * 5; a.tx = heroi.position.x + Math.cos(an) * r; a.tz = heroi.position.z + Math.sin(an) * r; }
      const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz), anda = d > 0.4;
      if (anda) { const v = (dh > 12 ? 5 : 2.2) * dt; a.x += dx / d * v; a.z += dz / d * v; let dr = Math.atan2(dx, dz) - a.rot; while (dr > Math.PI) dr -= Math.PI * 2; while (dr < -Math.PI) dr += Math.PI * 2; a.rot += dr * clamp(dt * 10); }
      if (heroi.position.y < 0.5) a.y += (heroi.position.y - a.y) * clamp(dt * 4);
      const pulando = gT - a.pulo < 0.8; a.c.position.set(a.x, a.y + (pulando ? Math.abs(Math.sin((gT - a.pulo) / 0.8 * Math.PI)) * 1.1 : 0), a.z); a.c.rotation.y = a.rot;
      if (pulando) pose(a.c, gT, { mood: 'smile', arms: { shL: [-2.6, 0, -0.3], shR: [-2.6, 0, 0.3], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] }, legs: { thL: -0.4, knL: 0.8, thR: -0.2, knR: 0.4 } });
      else pose(a.c, gT + a.ph, anda ? { walk: true, mood: 'smile' } : { mood: 'smile' });
      const falando = a.fala && agora < a.falaT, h = '<b>' + a.nome + '</b>' + (falando ? '<small>💬 ' + a.fala + '</small>' : '');
      if (a.h !== h) { a.h = h; a.tag.innerHTML = h; }
      const dd = Math.hypot(a.x - p.x, a.z - p.z); if (dd > 24) { a.tag.hidden = true; return; }
      guildPosition(a.tag, a.c, 1.75); a.tag.style.transform = 'translate(-50%,-100%) scale(' + clamp(1.15 - dd / 24, 0.5, 1).toFixed(2) + ')'; a.tag.style.zIndex = String(100 - Math.round(dd));
    });
  }
  // diagnóstico da live: etiqueta de versão + botão imediato com ?live=1
  try { const vt = document.createElement('div'); vt.textContent = 'versão live-8'; vt.style.cssText = 'position:fixed;right:6px;bottom:4px;z-index:9999;font:11px sans-serif;color:#fff;background:rgba(0,0,0,.6);padding:2px 6px;border-radius:6px;pointer-events:none'; document.body.appendChild(vt); setTimeout(() => vt.remove(), 15000);
    if (/[?&]live=1/.test(location.search)) liveBtn().hidden = false; } catch (e) { console.error('live', e); }
  // a live roda no próprio laço (não precisa mexer no jogo.js)
  let liveUlt = 0;
  function liveLoop(now) { const dt = Math.min(0.1, (now - (liveUlt || now)) / 1000); liveUlt = now; try { liveFrame(dt, heroi.position); } catch (e) { console.error('live', e); } requestAnimationFrame(liveLoop); }
  requestAnimationFrame(liveLoop);
