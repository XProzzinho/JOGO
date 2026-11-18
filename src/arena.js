  // ===================== ARENA DA LIVE (só ADM): quem entra na live do TikTok vira lutador, batalha sozinho, sobe no ranking; presente = artefato divino =====================
  const ARENA = { on: false, X: -1400, Z: 0, R: 25, lut: {}, max: 24, feed: [], fila: [], cam: { modo: 'orbita', alvo: null, t: 0, a: 0, look: new T3.Vector3() }, volta: null, uiT: 0 };
  const ARENA_DIV = [['emblema', 'Emblema Flamejante', '#ff6a2a'], ['astrolabio', 'Astrolábio Arcano', '#7ad8ff'], ['manto', 'Manto do Abismo', '#a07aff']];
  // ----- o lugar: chão de areia, muro, arquibancada, pilares com tochas e estandartes -----
  const ARG = (() => { const G = grp(world, ARENA.X, 0, ARENA.Z); G.visible = false; const R = ARENA.R;
    const tx = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; };
    const areia = tx(1024, 1024, (g, w) => { const c = w / 2; const gr = g.createRadialGradient(c, c, 40, c, c, c); gr.addColorStop(0, '#e8c890'); gr.addColorStop(1, '#c49a5a'); g.fillStyle = gr; g.fillRect(0, 0, w, w);
      for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${120 + Math.random() * 60},${90 + Math.random() * 40},50,.18)`; g.fillRect(Math.random() * w, Math.random() * w, 3, 3); }
      [[c - 10, 14, '#7a1424'], [c * 0.55, 8, '#d8a840'], [120, 10, '#7a1424']].forEach(([r, l, cor]) => { g.strokeStyle = cor; g.lineWidth = l; g.beginPath(); g.arc(c, c, r, 0, 7); g.stroke(); });
      g.fillStyle = 'rgba(122,20,36,.75)'; g.font = 'bold 120px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('⚔', c, c); });
    const chao = new T3.Mesh(new T3.CircleGeometry(R, 64), new T3.MeshStandardMaterial({ map: areia, roughness: 0.95 })); chao.rotation.x = -Math.PI / 2; chao.position.y = 0.02; chao.receiveShadow = true; G.add(chao);
    const fora = new T3.Mesh(new T3.CircleGeometry(90, 48), new T3.MeshStandardMaterial({ color: '#2a2230', roughness: 1 })); fora.rotation.x = -Math.PI / 2; fora.position.y = 0.005; G.add(fora);
    const pedra = new T3.MeshToonMaterial({ color: '#a89c8a', gradientMap: GRAD }), pedra2 = new T3.MeshToonMaterial({ color: '#7d7264', gradientMap: GRAD }), verm = new T3.MeshStandardMaterial({ color: '#8a1424', roughness: 0.8, side: T3.DoubleSide }), ouro = new T3.MeshStandardMaterial({ color: '#e0b040', metalness: 0.7, roughness: 0.3 });
    // muro baixo em volta da areia + arquibancada em degraus
    const muro = new T3.Mesh(new T3.CylinderGeometry(R + 0.8, R + 0.8, 2.2, 64, 1, true), pedra); muro.position.y = 1.1; muro.material.side = T3.DoubleSide; G.add(muro);
    const tampa = new T3.Mesh(new T3.TorusGeometry(R + 0.8, 0.35, 6, 64), ouro); tampa.rotation.x = Math.PI / 2; tampa.position.y = 2.2; G.add(tampa);
    for (let k = 0; k < 6; k++) { const r0 = R + 1.2 + k * 2.2, h = 2.6 + k * 1.3, mt = k % 2 ? pedra : pedra2; /* degrau = parede da frente (cilindro aberto) + tampa em anel: nada cobre a areia */ const fr = new T3.Mesh(new T3.CylinderGeometry(r0, r0, h, 64, 1, true), mt.clone()); fr.material.side = T3.BackSide; fr.position.y = h / 2; G.add(fr); const tp = new T3.Mesh(new T3.RingGeometry(r0, r0 + 2.2, 64), mt.clone()); tp.material.side = T3.DoubleSide; tp.rotation.x = -Math.PI / 2; tp.position.y = h; G.add(tp); }
    const topo = new T3.Mesh(new T3.CylinderGeometry(R + 16, R + 16, 11, 64, 1, true), pedra2); topo.position.y = 5.5; topo.material.side = T3.DoubleSide; G.add(topo);
    // plateia (bonequinhos coloridos baratos) nos degraus
    { const n = 260, im = new T3.InstancedMesh(new T3.CapsuleGeometry(0.28, 0.5, 3, 6), new T3.MeshToonMaterial({ color: '#ffffff', gradientMap: GRAD }), n), m4 = new T3.Matrix4(), c = new T3.Color();
      for (let i = 0; i < n; i++) { const k = i % 5, a = Math.random() * Math.PI * 2, r = R + 2.3 + k * 2.2, y = 2.6 + k * 1.3 + 0.55; m4.makeTranslation(Math.sin(a) * r, y, Math.cos(a) * r); im.setMatrixAt(i, m4); im.setColorAt(i, c.setHSL(Math.random(), 0.55, 0.55)); }
      im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; G.add(im); ARENA.plateia = im; }
    // pilares com tocha e estandarte vermelho
    const tochas = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, x = Math.sin(a) * (R + 0.9), z = Math.cos(a) * (R + 0.9);
      const p = new T3.Mesh(new T3.CylinderGeometry(0.55, 0.65, 6.5, 10), pedra); p.position.set(x, 3.25, z); p.castShadow = true; G.add(p); const cap = new T3.Mesh(new T3.CylinderGeometry(0.85, 0.6, 0.5, 10), ouro); cap.position.set(x, 6.7, z); G.add(cap);
      const f = new T3.Mesh(new T3.ConeGeometry(0.42, 1.1, 10), new T3.MeshBasicMaterial({ color: '#ff7a2a', transparent: true, opacity: 0.9, blending: T3.AdditiveBlending, toneMapped: false })); f.position.set(x, 7.5, z); G.add(f); glowSpr(G, x, 7.4, z, 3.2, '#ff9a3a', 0.6); tochas.push(f);
      const b = new T3.Mesh(new T3.PlaneGeometry(1.4, 3.2), verm); b.position.set(x * 0.985, 4.2, z * 0.985); b.rotation.y = a + Math.PI; G.add(b); }
    // portão grande
    { const pg = grp(G, 0, 0, -R - 1.2); [-3, 3].forEach(s => { const t = new T3.Mesh(new T3.BoxGeometry(1.6, 9, 1.6), pedra2); t.position.set(s, 4.5, 0); pg.add(t); }); const v = new T3.Mesh(new T3.BoxGeometry(7.6, 1.6, 1.8), pedra2); v.position.y = 9; pg.add(v);
      const pl = new T3.Mesh(new T3.PlaneGeometry(6, 1.2), new T3.MeshBasicMaterial({ map: tx(512, 100, (g, w, h) => { g.fillStyle = '#5a0a18'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffcf5a'; g.lineWidth = 6; g.strokeRect(4, 4, w - 8, h - 8); g.fillStyle = '#ffd86a'; g.font = 'bold 54px serif'; g.textAlign = 'center'; g.fillText('⚔ ARENA DA LIVE ⚔', w / 2, 70); }), toneMapped: false })); pl.position.set(0, 9, 0.95); pg.add(pl); }
    return { G, tochas }; })();
  // ----- lutadores -----
  function arenaEsc(s) { return String(s == null ? '' : s).replace(/[<>&]/g, '').slice(0, 24); }
  function arenaNovo(id, nome) { const h = mpHash(id), R = MP_ROUPAS[h % MP_ROUPAS.length];
    const c = makeChar({ skin: MP_PELE[(h >> 3) % MP_PELE.length], hairStyle: ['short', 'long', 'short', 'bald'][(h >> 5) % 4], hairC: MP_CAB[(h >> 7) % MP_CAB.length], top: R[0], top2: R[1], pants: '#3a3040', shoe: '#2a2020', iris: '#3a2a1a', s: 0.9, ph: (h % 100) / 10 });
    c.traverse(o => { if (o.isMesh) o.castShadow = true; }); world.add(c); { const ix = CHARS.indexOf(c); if (ix >= 0) CHARS.splice(ix, 1); }
    // espada simples na mão direita (cor pela pessoa)
    const esp = grp(c.userData.P.elR, 0, -0.34, 0.06); esp.rotation.x = -1.35; const cor = ['#d8dde8', '#ffd86a', '#ff8a6a', '#8ad8ff', '#c89aff'][(h >> 9) % 5];
    part(esp, BOX, cor, 0, 0.42, 0, 0.07, 0.8, 0.02, 0, true); part(esp, BOX, '#5a3a20', 0, 0, 0, 0.26, 0.05, 0.07); part(esp, CYL, '#3a2414', 0, -0.1, 0, 0.035, 0.18, 0.035);
    const tag = document.createElement('div'); tag.className = 'mp-tag ar-tag'; mpTags.appendChild(tag);
    const a = Math.random() * Math.PI * 2, r = ARENA.R * (0.4 + Math.random() * 0.5);
    const L = { id, nome: arenaEsc(nome) || 'Visitante', c, tag, x: ARENA.X + Math.sin(a) * r, z: ARENA.Z + Math.cos(a) * r, rot: a + Math.PI, hp: 100, max: 100, kills: 0, mortes: 0, alvo: null, cd: 1 + Math.random(), atkT: -9, morto: 0, div: null, divK: '', fala: '', falaT: 0, t: performance.now(), h: '' };
    c.position.set(L.x, 0, L.z); return L; }
  function arenaLut(id, nome) { let L = ARENA.lut[id]; if (L) { L.t = performance.now(); if (nome && L.nome === 'Visitante') L.nome = arenaEsc(nome); return L; }
    const ks = Object.keys(ARENA.lut); if (ks.length >= ARENA.max) { const fora = ks.map(k => ARENA.lut[k]).sort((p, q) => (p.kills - q.kills) || (p.t - q.t))[0]; arenaTira(fora.id); }
    L = ARENA.lut[id] = arenaNovo(id, nome); fx('luz', [L.x, 0, L.z], 1); try { som('portal', 0.5, 1.2); } catch (e) {} return L; }
  function arenaTira(id) { const L = ARENA.lut[id]; if (!L) return; world.remove(L.c); L.tag.remove(); delete ARENA.lut[id]; }
  function arenaDivino(L, presente) { const k = ARENA_DIV[(mpHash(L.id) + L.kills) % ARENA_DIV.length]; if (L.div) { L.c.userData.P.spine.remove(L.div.g); L.div = null; }
    let o = null; try { const sp = L.c.userData.P.spine;
      if (k[0] === 'emblema') { const e = createFieryCrestItem(T3); const g = new T3.Group(); g.add(e); e.scale.setScalar(0.33); e.rotation.y = Math.PI; g.position.set(0, 0.55, -0.45); sp.add(g); o = { g, up: t => e.userData.update(t) }; }
      else if (k[0] === 'astrolabio') { const a = createArcaneAstrolabe(T3); const g = new T3.Group(); g.add(a); a.scale.setScalar(0.2); a.rotation.y = Math.PI; g.position.set(0, 0.5, -0.62); a.traverse(x => { if (x.isPoints) x.material.size = 0.025; }); sp.add(g); let tl = 0; o = { g, up: t => { const dt = Math.min(0.1, Math.max(0, t - tl)); tl = t; a.userData.update(dt, t); } }; }
      else { const m = createSpectralCloak3D(T3); const g = new T3.Group(); g.add(m.group); m.group.scale.setScalar(0.42); m.group.position.set(0, -0.22, 0); const [arm, asas, capa] = m.group.children; arm.position.z = 0.42; arm.scale.setScalar(0.8); arm.position.y = 1.2; asas.position.z = -0.55; capa.position.z = -0.5; m.group.children[3].position.z = -0.6; sp.add(g); o = { g, up: t => m.update(t, { windSpeed: 1, windAmp: 1, energyIntensity: 0.38 }) }; }
      o.g.traverse(x => { if (x.isMesh) x.frustumCulled = false; }); } catch (e) { console.warn('arena divino', e); o = null; }
    L.div = o; L.divK = k[1]; L.max = 160; L.hp = L.max; fx('luz', [L.x, 0, L.z], 1.2); fx('cura', [L.x, 0, L.z], 1);
    arenaFeed('🎁 <b>' + L.nome + '</b> mandou ' + arenaEsc(presente || 'um presente') + ' e ganhou <i style="color:' + k[2] + '">' + k[1] + '</i>!'); aviso('🎁 ' + L.nome + ' ganhou o artefato divino ' + k[1] + '!', k[2]); arenaFoca(L, 4.5); }
  function arenaFeed(t) { ARENA.feed.unshift({ t, em: performance.now() }); ARENA.feed.length = Math.min(ARENA.feed.length, 5); ARENA.uiT = 0; }
  // ----- eventos da live -----
  function arenaEvento(m) { const L = arenaLut(String(m.id), m.name);
    if (m.type === 'join') { arenaFeed('📺 <b>' + L.nome + '</b> entrou na arena!'); arenaFoca(L, 3.5); }
    else if (m.type === 'chat' && m.text) { L.fala = arenaEsc(m.text); L.falaT = performance.now() + 5000; }
    else if (m.type === 'gift') arenaDivino(L, m.gift);
    else if (m.type === 'like') { L.hp = Math.min(L.max, L.hp + 6); }
    else if (m.type === 'follow') { L.hp = L.max; arenaFeed('❤️ <b>' + L.nome + '</b> seguiu a live!'); } }
  { const _le = liveEvento; liveEvento = function (m) { if (ARENA.on && m && souAdmin()) { try { arenaEvento(m); } catch (e) { console.warn('arena', e); } return; } return _le(m); }; }
  // ----- câmera de transmissão: foca quem entrou, sobe igual drone e fica rodeando -----
  function arenaFoca(L, seg) { const C = ARENA.cam; if (C.modo === 'foco' && C.alvo && performance.now() - C.ini < 2200) { if (!ARENA.fila.includes(L)) ARENA.fila.push(L); ARENA.fila.length = Math.min(ARENA.fila.length, 2); return; } C.modo = 'foco'; C.alvo = L; C.t = seg || 3.5; C.ini = performance.now(); }
  const _cv = new T3.Vector3(), _lv = new T3.Vector3();
  function arenaCam(dt) { if (zona !== 'arena') return; const C = ARENA.cam, k = 1 - Math.exp(-dt * 2.6);
    if (C.modo === 'foco') { const L = C.alvo; if (!L || !ARENA.lut[L.id]) { C.modo = 'sobe'; C.t = 2.4; } else { C.t -= dt;
        _cv.set(L.x - Math.sin(L.rot) * 4.2, 2.3, L.z - Math.cos(L.rot) * 4.2); _lv.set(L.x, 1.3, L.z); cam.position.lerp(_cv, 1 - Math.exp(-dt * 4)); C.look.lerp(_lv, 1 - Math.exp(-dt * 6));
        if (C.t <= 0) { const prox = ARENA.fila.shift(); if (prox && ARENA.lut[prox.id]) { C.alvo = prox; C.t = 2.5; C.ini = performance.now(); } else { C.modo = 'sobe'; C.t = 2.6; C.a = Math.atan2(cam.position.x - ARENA.X, cam.position.z - ARENA.Z); } } } }
    else { if (C.modo === 'sobe') { C.t -= dt; if (C.t <= 0) C.modo = 'orbita'; } C.a += dt * 0.12; const r = ARENA.R + 9, y = C.modo === 'sobe' ? 12 + (2.6 - C.t) * 5 : 24 + Math.sin(gT * 0.3) * 2;
      _cv.set(ARENA.X + Math.sin(C.a) * r, y, ARENA.Z + Math.cos(C.a) * r); _lv.set(ARENA.X, 0.5, ARENA.Z); cam.position.lerp(_cv, C.modo === 'sobe' ? 1 - Math.exp(-dt * 1.8) : k); C.look.lerp(_lv, 1 - Math.exp(-dt * 2.2)); }
    cam.lookAt(C.look); cam.updateMatrixWorld();
    // nomes e vida em cima de cada lutador (depois da câmera, pra não tremer)
    const agora = performance.now(); Object.values(ARENA.lut).forEach(L => { const d = cam.position.distanceTo(L.c.position); if (L.morto || d > 60) { L.tag.hidden = true; return; } L.tag.hidden = false;
      const falando = L.fala && agora < L.falaT, h = '<b>' + (L.div ? '✨ ' : '') + L.nome + '</b><span class="ar-hp"><i style="width:' + Math.round(L.hp / L.max * 100) + '%"></i></span><small>⚔️ ' + L.kills + (falando ? ' · 💬 ' + L.fala : '') + '</small>';
      if (L.h !== h) { L.h = h; L.tag.innerHTML = h; } guildPosition(L.tag, L.c, 2.0); L.tag.style.transform = 'translate(-50%,-100%) scale(' + clamp(1.3 - d / 40, 0.55, 1.2).toFixed(2) + ')'; L.tag.style.zIndex = String(200 - Math.round(d)); }); }
  // ----- luta automática -----
  function arenaFrame(dt) { const on = zona === 'arena'; ARG.G.visible = on; arenaUi(); if (!on) { Object.values(ARENA.lut).forEach(L => { L.c.visible = false; L.tag.hidden = true; }); return; }
    ARG.tochas.forEach((f, i) => { const s = 0.85 + Math.sin(gT * 13 + i * 2) * 0.15; f.scale.set(s, 0.9 + Math.cos(gT * 17 + i) * 0.2, s); });
    const Ls = Object.values(ARENA.lut), vivos = Ls.filter(L => !L.morto);
    Ls.forEach(L => { L.c.visible = true; if (L.div) L.div.up(gT);
      if (L.morto) { L.morto -= dt; pose(L.c, gT, { mood: 'sad', lean: 1.2, hipY: 0.35, legs: { thL: -1.4, knL: 1.6, thR: -1.4, knR: 1.6 } }); L.c.position.y = -0.2;
        if (L.morto <= 0) { L.morto = 0; L.hp = L.max; const a = Math.random() * Math.PI * 2, r = ARENA.R * 0.85; L.x = ARENA.X + Math.sin(a) * r; L.z = ARENA.Z + Math.cos(a) * r; L.c.position.y = 0; fx('luz', [L.x, 0, L.z], 0.8); } L.c.position.x = L.x; L.c.position.z = L.z; return; }
      // escolhe alvo: o mais perto, às vezes troca
      if (!L.alvo || L.alvo.morto || !ARENA.lut[L.alvo.id] || Math.random() < dt * 0.15) { let best = null, bd = 1e9; vivos.forEach(o => { if (o === L) return; const d = Math.hypot(o.x - L.x, o.z - L.z) + Math.random() * 6; if (d < bd) { bd = d; best = o; } }); L.alvo = best; }
      const A = L.alvo; let anda = false, atk = gT - L.atkT < 0.35;
      if (A) { const dx = A.x - L.x, dz = A.z - L.z, d = Math.hypot(dx, dz); let dr = Math.atan2(dx, dz) - L.rot; while (dr > Math.PI) dr -= Math.PI * 2; while (dr < -Math.PI) dr += Math.PI * 2; L.rot += dr * clamp(dt * 8);
        if (d > 1.5) { const v = (L.div ? 3.8 : 3.2) * dt; L.x += dx / d * v; L.z += dz / d * v; anda = true; }
        else { L.cd -= dt; if (L.cd <= 0) { L.cd = 0.8 + Math.random() * 0.6; L.atkT = gT; const dano = Math.round((7 + Math.random() * 7) * (L.div ? 1.6 : 1)); A.hp -= dano; try { numero(A.c.position, String(dano), L.div ? '#ffd86a' : '#ffffff', 2.2); } catch (e) {} try { som('espada', 0.25, 1); } catch (e) {} fx('vento', [A.x, 1, A.z], 0.3);
            if (A.hp <= 0) { A.hp = 0; A.morto = 3; A.mortes++; L.kills++; L.alvo = null; arenaFeed('⚔️ <b>' + L.nome + '</b> derrotou <b>' + A.nome + '</b>' + (L.kills % 5 === 0 ? ' · 🔥 ' + L.kills + ' abates!' : '')); } } } }
      // não sai da areia e não fica um em cima do outro
      vivos.forEach(o => { if (o === L) return; const dx = L.x - o.x, dz = L.z - o.z, d = Math.hypot(dx, dz); if (d < 0.8 && d > 1e-3) { L.x += dx / d * (0.8 - d) * 0.5; L.z += dz / d * (0.8 - d) * 0.5; } });
      { const dx = L.x - ARENA.X, dz = L.z - ARENA.Z, d = Math.hypot(dx, dz), m = ARENA.R - 1.2; if (d > m) { L.x = ARENA.X + dx / d * m; L.z = ARENA.Z + dz / d * m; } }
      L.c.position.set(L.x, 0, L.z); L.c.rotation.y = L.rot;
      if (atk) { const u = (gT - L.atkT) / 0.35; pose(L.c, gT, { mood: 'angry', arms: { shR: [-2.4 + u * 2.6, 0, 0.3], elR: [-0.4, 0, 0], shL: [-0.4, 0, -0.2] }, lean: 0.15 }); }
      else pose(L.c, gT, anda ? { run: true, mood: 'angry' } : { mood: 'neutral' }); }); }
  // ----- painel: ranking ao lado, mural de lutas, botões do ADM -----
  const arUi = document.createElement('div'); arUi.id = 'arena-ui'; arUi.hidden = true; document.body.appendChild(arUi);
  function arenaUi() { const on = zona === 'arena'; arUi.hidden = !on; if (!on) return; ARENA.uiT -= 1 / 60; if (ARENA.uiT > 0) return; ARENA.uiT = 0.5;
    const L = Object.values(ARENA.lut).sort((p, q) => q.kills - p.kills || p.mortes - q.mortes).slice(0, 8), med = ['👑', '🥈', '🥉'];
    arUi.innerHTML = `<div class="ar-rk"><b class="tt">🏆 RANKING DA ARENA</b>${L.length ? L.map((x, i) => `<div class="ln${i < 3 ? ' t' + (i + 1) : ''}"><span>${med[i] || (i + 1) + 'º'}</span><em>${x.div ? '✨' : ''}${x.nome}</em><i>⚔️ ${x.kills}</i></div>`).join('') : '<p>Esperando a galera entrar na live...</p>'}
      <small class="dc">Entrou na live = entra na luta · Presente = artefato divino</small></div>
      <div class="ar-feed">${ARENA.feed.filter(f => performance.now() - f.em < 9000).map(f => `<div>${f.t}</div>`).join('')}</div>
      <div class="ar-bt"><button data-a="bot">➕ Lutador de teste</button><button data-a="pres">🎁 Presente de teste</button><button data-a="sai">🚪 Sair</button></div>`;
    arUi.querySelectorAll('[data-a]').forEach(b => tapBtn(b, () => { const a = b.dataset.a;
      if (a === 'sai') arenaSai(); else if (a === 'bot') { const id = 'teste' + Math.random().toString(36).slice(2, 7); arenaEvento({ type: 'join', id, name: 'Teste ' + id.slice(-3).toUpperCase() }); }
      else { const Ls = Object.values(ARENA.lut); if (!Ls.length) return; const L = Ls[Math.floor(Math.random() * Ls.length)]; arenaEvento({ type: 'gift', id: L.id, name: L.nome, gift: 'Rosa' }); } ARENA.uiT = 0; })); }
  // ----- entrar / sair (só ADM) -----
  function arenaEntra() { if (!souAdmin()) { aviso('🔒 A Arena da Live é só do Administrador.', '#ff6a6a'); return; } if (zona === 'arena') return; if (montado) montar(false); if (voando) voa(false);
    ARENA.volta = { zona, x: heroi.position.x, z: heroi.position.z, dentro }; ARENA.on = true; zona = 'arena'; dentro = false; heroi.position.set(ARENA.X, 0, ARENA.Z); heroi.visible = false;
    ARENA.cam.modo = 'sobe'; ARENA.cam.t = 2.6; ARENA.cam.a = Math.PI; cam.position.set(ARENA.X, 6, ARENA.Z - ARENA.R - 6); ARENA.cam.look.set(ARENA.X, 1, ARENA.Z); document.body.classList.add('arena-on');
    aviso('🏟️ Arena da Live aberta! Quem entrar na live vai aparecer lutando.' + (LIVE.ws ? '' : ' (Ligue a live no 📡 ou use o Lutador de teste.)'), '#ffd86a'); }
  function arenaSai() { if (zona !== 'arena') return; const V = ARENA.volta || { zona: 'vila', x: 0, z: 4.2 }; ARENA.on = false; zona = V.zona === 'arena' ? 'vila' : V.zona; dentro = !!V.dentro; heroi.position.set(V.x, 0, V.z); heroi.visible = true; document.body.classList.remove('arena-on'); }
  function arenaLimita(p) { p.x = ARENA.X; p.z = ARENA.Z; p.y = 0; }
  const arBtn = document.createElement('button'); arBtn.textContent = '🏟️'; arBtn.hidden = true; arBtn.title = 'Arena da Live';
  arBtn.style.cssText = 'position:fixed;left:60px;bottom:8px;z-index:250;width:44px;height:44px;border-radius:50%;border:3px solid #2b2340;background:#ffe08a;font-size:20px;opacity:.95;padding:0'; document.body.appendChild(arBtn);
  arBtn.className = 'arena-keep'; arBtn.onclick = () => { if (zona === 'arena') arenaSai(); else arenaEntra(); };
  let arChk = 0; function arenaLoop(dt) { arChk -= dt; if (arChk <= 0) { arChk = 1; arBtn.hidden = !souAdmin(); if (LIVE.btn) LIVE.btn.classList.add('arena-keep'); if (zona === 'arena' && !souAdmin()) arenaSai(); } try { arenaFrame(dt); } catch (e) { console.warn('arena', e); } }
