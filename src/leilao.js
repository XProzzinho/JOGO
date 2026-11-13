  // ===================== PEDRAS DE TELEPORTE + CASA DE LEILÕES =====================
  const HX = -700, HZ = 700; // a Casa de Leilões fica num "mundo" separado, longe de tudo
  // ---- textura do círculo de runas no chão das pedras ----
  const PED_TEX = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.translate(128, 128);
    x.strokeStyle = '#bff4ff'; x.shadowColor = '#3ad8ff'; x.shadowBlur = 14; x.lineWidth = 6; x.beginPath(); x.arc(0, 0, 118, 0, 7); x.stroke(); x.lineWidth = 2.5; x.beginPath(); x.arc(0, 0, 100, 0, 7); x.stroke(); x.beginPath(); x.arc(0, 0, 58, 0, 7); x.stroke();
    x.font = 'bold 20px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#e8fbff'; const R = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊ'; for (let i = 0; i < 16; i++) { x.save(); x.rotate(i / 16 * Math.PI * 2); x.fillText(R[i], 0, -80); x.restore(); }
    x.lineWidth = 2.5; x.beginPath(); for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI * 2 * 2 - Math.PI / 2; i ? x.lineTo(Math.cos(a) * 58, Math.sin(a) * 58) : x.moveTo(Math.cos(a) * 58, Math.sin(a) * 58); } x.stroke();
    const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; })();
  const PED_GEO = { base: new T3.CylinderGeometry(1.05, 1.25, 0.45, 6), deg: new T3.CylinderGeometry(0.8, 0.95, 0.3, 6), obel: new T3.CylinderGeometry(0.22, 0.42, 2.2, 4), crist: new T3.OctahedronGeometry(0.34, 0), anel: new T3.TorusGeometry(0.62, 0.035, 8, 40), chao: new T3.PlaneGeometry(3.2, 3.2) };
  const PED_MAT = { pedra: new T3.MeshStandardMaterial({ color: '#7a7a8e', roughness: 0.9 }), pedra2: new T3.MeshStandardMaterial({ color: '#5a5a70', roughness: 0.95 }), crist: new T3.MeshBasicMaterial({ color: '#7af0ff', toneMapped: false }),
    anel: new T3.MeshBasicMaterial({ color: '#c8f8ff', transparent: true, opacity: 0.85, toneMapped: false }), runa: new T3.MeshBasicMaterial({ color: '#5ae8ff', toneMapped: false }),
    chao: new T3.MeshBasicMaterial({ map: PED_TEX, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0.85 }) };
  function fazPedra(par, x, z) { const g = grp(par, x, 0, z);
    const b = new T3.Mesh(PED_GEO.base, PED_MAT.pedra2); b.position.y = 0.22; b.castShadow = b.receiveShadow = true; g.add(b);
    const d = new T3.Mesh(PED_GEO.deg, PED_MAT.pedra); d.position.y = 0.6; d.castShadow = true; g.add(d);
    const o = new T3.Mesh(PED_GEO.obel, PED_MAT.pedra); o.position.y = 1.85; o.rotation.y = Math.PI / 4; o.castShadow = true; g.add(o);
    [0, 1, 2, 3].forEach(i => { const r = new T3.Mesh(BOX, PED_MAT.runa); const a = i * Math.PI / 2 + Math.PI / 4; r.position.set(Math.sin(a) * 0.255, 1.7, Math.cos(a) * 0.255); r.rotation.y = a; r.scale.set(0.12, 0.6, 0.02); g.add(r); });
    const cr = new T3.Mesh(PED_GEO.crist, PED_MAT.crist); cr.position.y = 3.35; cr.scale.set(1, 1.5, 1); g.add(cr);
    const an = new T3.Mesh(PED_GEO.anel, PED_MAT.anel); an.position.y = 3.35; an.rotation.x = Math.PI / 2; g.add(an);
    const an2 = new T3.Mesh(PED_GEO.anel, PED_MAT.anel); an2.position.y = 3.35; an2.scale.setScalar(0.75); g.add(an2);
    const gl = glowSpr(g, 0, 3.35, 0, 2.2, '#5ae8ff', 0.7);
    const ch = new T3.Mesh(PED_GEO.chao, PED_MAT.chao); ch.rotation.x = -Math.PI / 2; ch.position.y = 0.47; g.add(ch);
    g.userData = { cr, an, an2, gl, ch, f: Math.random() * 6 }; return g; }
  // ---- onde ficam as pedras (perto de cada lugar do mapa) ----
  const PEDRAS = []; let PED_FEITAS = false;
  function pedrasMonta() { if (PED_FEITAS) return; PED_FEITAS = true; let L = []; try { L = lugaresMapa(); } catch (e) { return; }
    L.forEach(l => { const px = l.x + 2.8, pz = l.z - 0.6; const g = fazPedra(world, px, pz); PEDRAS.push({ id: l.id, nome: l.nome, ic: l.ic, x: px, z: pz, g, zona: l.id === 'valdren' ? 'valdren' : 'vila' });
      if (l.id === 'valdren') COLV.push({ t: 'c', x: px, z: pz, r: 1.1 }); else COL.push({ t: 'c', x: px, z: pz, r: 1.1 }); });
    const g = fazPedra(world, HX + 4.5, HZ + 10); PEDRAS.push({ id: 'leilao', nome: 'Casa de Leilões', ic: '🔨', x: HX + 4.5, z: HZ + 10, g, zona: 'leilao' }); }
  function pedrasFrame(dt, p) { let perto = null, pd = 3.0; PEDRAS.forEach(P => { const U = P.g.userData, vis = P.zona === zona || (P.zona === 'vila' && zona === 'valdren') || (P.zona === 'valdren' && zona === 'vila'); P.g.visible = vis && !dentro; if (!P.g.visible) return;
      const d = Math.hypot(p.x - P.x, p.z - P.z); if (d > 60) return; U.cr.position.y = 3.35 + Math.sin(gT * 1.8 + U.f) * 0.12; U.cr.rotation.y += dt * 1.4; U.an.rotation.z += dt * 1.2; U.an2.rotation.x += dt * 1.6; U.an2.rotation.y += dt * 0.7; U.ch.rotation.z -= dt * 0.35;
      U.gl.material.opacity = 0.55 + Math.sin(gT * 3 + U.f) * 0.2; if (P.zona === zona && d < pd) { pd = d; perto = P; } });
    return perto ? { rot: 'TELEPORTE', x: perto.x, y: 1.6, z: perto.z, acao: () => pedraAbre(perto) } : null; }
  // ---- janela da pedra: lista dos outros pontos ----
  const pedP = document.createElement('div'); pedP.id = 'pedra-p'; pedP.hidden = true; pedP.innerHTML = '<div class="box"><div class="hd"><h3>✨ Pedra de Teleporte</h3><button id="pedra-x">Fechar</button></div><p class="pd-sub">Toque num destino. Em cada lugar tem uma pedra igual a esta, pra você voltar.</p><div id="pedra-l"></div></div>'; document.body.appendChild(pedP);
  tapBtn($('pedra-x'), () => { pedP.hidden = true; });
  function pedraAbre(P) { if (conversa || cenaQ) return; const lst = $('pedra-l'); lst.innerHTML = ''; let L = []; try { L = lugaresMapa(); } catch (e) {}
    PEDRAS.filter(o => o.id !== P.id).forEach(o => { const l = L.find(q => q.id === o.id) || {}; const b = document.createElement('button'); b.className = 'pd-dest' + (o.id === 'leilao' ? ' lei' : ''); b.disabled = !!l.trava;
      b.innerHTML = `<span class="pd-ic">${o.ic}</span><span><b>${o.nome}</b><small>${l.trava ? l.sub : o.id === 'leilao' ? 'Compre e venda itens com outros jogadores' : (l.sub || 'Teleportar')}</small></span>`; if (!l.trava) tapBtn(b, () => { pedP.hidden = true; pedraVai(o, l); }); lst.appendChild(b); });
    pedP.hidden = false; som('magia', 0.5, 1.3); }
  function pedraVai(o, l) { if (o.id === 'leilao') { leilaoEntra(); return; } if (o.id === 'valdren') { viajar('valdren'); return; } if (l && l.id) vaiPara(l); }
  // ===================== CASA DE LEILÕES (só o salão por dentro) =====================
  const LEI = (() => { const G = grp(world, HX, 0, HZ); G.visible = false; const W = 46, D = 36, H = 12;
    const tx = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; };
    const piso = tx(256, 256, (x) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? '#e9dfcb' : '#cbb994'; x.fillRect(i * 64, j * 64, 64, 64); } x.strokeStyle = 'rgba(120,90,50,.35)'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, 256); x.moveTo(0, i * 64); x.lineTo(256, i * 64); x.stroke(); } });
    piso.wrapS = piso.wrapT = T3.RepeatWrapping; piso.repeat.set(W / 4, D / 4);
    const parede = tx(256, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a1e3e'); g.addColorStop(1, '#5a2e52'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,210,120,.08)';
      for (let y = 30; y < h * 0.7; y += 60) for (let xx = (y / 60 % 2) * 32; xx < w; xx += 64) { x.beginPath(); x.moveTo(xx + 16, y); x.lineTo(xx + 26, y + 14); x.lineTo(xx + 16, y + 28); x.lineTo(xx + 6, y + 14); x.closePath(); x.fill(); }
      x.fillStyle = '#3a2214'; x.fillRect(0, h * 0.78, w, h * 0.22); x.fillStyle = '#c89a3a'; x.fillRect(0, h * 0.775, w, 6); x.fillRect(0, h * 0.96, w, 4); x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; for (let xx = 0; xx < w; xx += 64) x.strokeRect(xx + 6, h * 0.8, 52, h * 0.14); });
    parede.wrapS = T3.RepeatWrapping; const banner = tx(1024, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#8a1424'); g.addColorStop(1, '#5a0a18'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.strokeStyle = '#ffcf5a'; x.lineWidth = 14; x.strokeRect(18, 18, w - 36, h - 36); x.lineWidth = 3; x.strokeRect(40, 40, w - 80, h - 80); x.textAlign = 'center'; x.fillStyle = '#ffd86a'; x.shadowColor = '#000'; x.shadowBlur = 10;
      x.font = 'bold 130px serif'; x.fillText('🔨', w / 2, 200); x.font = 'bold 92px serif'; x.fillText('CASA DE LEILÕES', w / 2, 330); x.font = 'bold 40px serif'; x.fillStyle = '#ffe8b0'; x.fillText('✦ AETHERION ✦', w / 2, 420); });
    const M = (c, o) => new T3.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, o || {}));
    const ouro = M('#d8a840', { metalness: 0.6, roughness: 0.35 }), madeira = M('#5a3420'), creme = M('#efe2c8'), tapete = M('#9a1a2e', { roughness: 0.95 });
    const chao = new T3.Mesh(new T3.PlaneGeometry(W, D), new T3.MeshStandardMaterial({ map: piso, roughness: 0.45 })); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; G.add(chao);
    // paredes viradas pra dentro (de fora não aparecem, então a câmera nunca fica tapada)
    const pm = new T3.MeshStandardMaterial({ map: parede, roughness: 0.85 }); const pw = (w, x, z, ry) => { const t = parede.clone(); t.needsUpdate = true; t.repeat.set(w / 8, 1); const m = new T3.Mesh(new T3.PlaneGeometry(w, H), new T3.MeshStandardMaterial({ map: t, roughness: 0.85 })); m.position.set(x, H / 2, z); m.rotation.y = ry; G.add(m); };
    pw(W, 0, -D / 2, 0); pw(W, 0, D / 2, Math.PI); pw(D, -W / 2, 0, Math.PI / 2); pw(D, W / 2, 0, -Math.PI / 2);
    const teto = new T3.Mesh(new T3.PlaneGeometry(W, D), M('#24142c')); teto.rotation.x = Math.PI / 2; teto.position.y = H; G.add(teto);
    // vigas douradas no teto
    for (let i = -2; i <= 2; i++) { const v = new T3.Mesh(BOX, ouro); v.position.set(i * 9, H - 0.3, 0); v.scale.set(0.5, 0.5, D); G.add(v); }
    // colunas
    const COLG = new T3.CylinderGeometry(0.55, 0.65, H, 16); [-1, 1].forEach(s => { for (let i = 0; i < 5; i++) { const z = -14 + i * 7.2; const c = new T3.Mesh(COLG, creme); c.position.set(s * 19.5, H / 2, z); c.castShadow = true; G.add(c);
      [0.3, H - 0.4].forEach(y => { const a = new T3.Mesh(BOX, ouro); a.position.set(s * 19.5, y, z); a.scale.set(1.6, 0.5, 1.6); G.add(a); }); } });
    // tapete vermelho com borda dourada
    const tp = new T3.Mesh(new T3.PlaneGeometry(5, 28), tapete); tp.rotation.x = -Math.PI / 2; tp.position.set(0, 0.02, 4); tp.receiveShadow = true; G.add(tp);
    [-1, 1].forEach(s => { const b = new T3.Mesh(new T3.PlaneGeometry(0.3, 28), new T3.MeshBasicMaterial({ color: '#e8b84a' })); b.rotation.x = -Math.PI / 2; b.position.set(s * 2.55, 0.025, 4); G.add(b); });
    // palco + balcão do leiloeiro
    const palco = new T3.Mesh(BOX, madeira); palco.position.set(0, 0.25, -14.5); palco.scale.set(16, 0.5, 6); palco.receiveShadow = true; G.add(palco);
    const bal = new T3.Mesh(BOX, madeira); bal.position.set(0, 0.6, -11); bal.scale.set(9, 1.2, 1.4); bal.castShadow = true; G.add(bal);
    const tampo = new T3.Mesh(BOX, ouro); tampo.position.set(0, 1.25, -11); tampo.scale.set(9.4, 0.12, 1.7); G.add(tampo);
    [-3.5, 0, 3.5].forEach(x => { const f = new T3.Mesh(BOX, ouro); f.position.set(x, 0.6, -10.28); f.scale.set(1.2, 0.8, 0.05); G.add(f); });
    // martelo em cima do balcão
    { const m = grp(G, 1.6, 1.4, -11); const cabo = new T3.Mesh(new T3.CylinderGeometry(0.04, 0.04, 0.7, 8), madeira); cabo.rotation.z = Math.PI / 2; m.add(cabo); const cab = new T3.Mesh(new T3.CylinderGeometry(0.11, 0.11, 0.32, 12), M('#3a2014')); cab.position.x = 0.35; m.add(cab); m.rotation.y = 0.5; }
    // estandarte grande no fundo
    const bn = new T3.Mesh(new T3.PlaneGeometry(12, 6), new T3.MeshBasicMaterial({ map: banner, toneMapped: false })); bn.position.set(0, 7.5, -D / 2 + 0.05); G.add(bn);
    [-1, 1].forEach(s => { const f = new T3.Mesh(new T3.PlaneGeometry(2.6, 7), new T3.MeshStandardMaterial({ color: '#8a1424', side: T3.DoubleSide })); f.position.set(s * 9.5, 7, -D / 2 + 0.06); G.add(f); });
    // lustres
    const lus = []; [-8, 0, 8].forEach(z => { const l = grp(G, 0, H - 2.8, z); const a = new T3.Mesh(new T3.TorusGeometry(1.4, 0.08, 8, 32), ouro); a.rotation.x = Math.PI / 2; l.add(a);
      const c = new T3.Mesh(new T3.CylinderGeometry(0.03, 0.03, 2.4, 6), ouro); c.position.y = 1.3; l.add(c); for (let i = 0; i < 8; i++) { const q = i / 8 * Math.PI * 2; part(l, SPH, '#fff2c0', Math.cos(q) * 1.4, 0.18, Math.sin(q) * 1.4, 0.09, 0.14, 0.09, 0, true); glowSpr(l, Math.cos(q) * 1.4, 0.3, Math.sin(q) * 1.4, 0.8, '#ffcf70', 0.75); }
      glowSpr(l, 0, 0, 0, 5, '#ffd890', 0.35); lus.push(l); });
    // vitrines com itens girando dos dois lados
    const vit = []; const cores = ['#ff6a8a', '#5ae8ff', '#ffd86a', '#a07aff', '#7aff9a', '#ff9a3a'];
    [-1, 1].forEach(s => { for (let i = 0; i < 3; i++) { const z = -6 + i * 8, x = s * 15; const pe = new T3.Mesh(new T3.CylinderGeometry(0.55, 0.7, 1.2, 8), creme); pe.position.set(x, 0.6, z); pe.castShadow = true; G.add(pe);
      const tp2 = new T3.Mesh(new T3.CylinderGeometry(0.62, 0.62, 0.1, 8), ouro); tp2.position.set(x, 1.22, z); G.add(tp2); const cor = cores[(i + (s > 0 ? 3 : 0)) % 6];
      const it = new T3.Mesh(i % 2 ? new T3.OctahedronGeometry(0.35, 0) : new T3.IcosahedronGeometry(0.33, 0), new T3.MeshBasicMaterial({ color: cor, toneMapped: false })); it.position.set(x, 1.9, z); G.add(it); glowSpr(G, x, 1.9, z, 1.6, cor, 0.5);
      const cup = new T3.Mesh(new T3.SphereGeometry(0.75, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T3.MeshBasicMaterial({ color: '#cfefff', transparent: true, opacity: 0.18, depthWrite: false })); cup.position.set(x, 1.27, z); G.add(cup); vit.push(it); } });
    // bancos dos compradores
    [-1, 1].forEach(s => { for (let i = 0; i < 3; i++) { const b = new T3.Mesh(BOX, madeira); b.position.set(s * 6.5, 0.45, -4 + i * 4.5); b.scale.set(5, 0.25, 1.1); b.castShadow = true; G.add(b); const e = new T3.Mesh(BOX, madeira); e.position.set(s * 6.5, 1.0, -4 + i * 4.5 + 0.5); e.scale.set(5, 0.9, 0.15); G.add(e); } });
    // porta grande decorativa na entrada
    { const pt = new T3.Mesh(new T3.PlaneGeometry(5, 7), M('#4a2814')); pt.position.set(0, 3.5, D / 2 - 0.05); pt.rotation.y = Math.PI; G.add(pt); const ar = new T3.Mesh(new T3.TorusGeometry(2.6, 0.18, 8, 24, Math.PI), ouro); ar.position.set(0, 7, D / 2 - 0.1); ar.rotation.y = Math.PI; G.add(ar); }
    // luzes do salão
    const l1 = new T3.PointLight(0xffd8a0, 2.2, 40, 1); l1.position.set(0, 8, -6); G.add(l1); const l2 = new T3.PointLight(0xffd8a0, 2.0, 40, 1); l2.position.set(0, 8, 9); G.add(l2);
    // o leiloeiro
    const npc = makeChar({ skin: '#e8c0a0', hairStyle: 'short', hairC: '#c8c8d0', top: '#7a1424', top2: '#ffd86a', pants: '#2a1a24', shoe: '#1a1010', iris: '#5a3a1a', s: 1.08, ph: 4.4 }); npc.position.set(0, 0.5, -12.3); G.add(npc);
    { const P = npc.userData.P; part(P.head, CYL, '#1a1018', 0, 0.36, 0, 0.2, 0.28, 0.2, 0.03); part(P.head, CYL, '#1a1018', 0, 0.23, 0, 0.3, 0.03, 0.3, 0.03); part(P.head, CYL, '#c8202a', 0, 0.27, 0, 0.205, 0.05, 0.205); }
    return { G, lus, vit, npc, W, D }; })();
  function leilaoLimita(p) { p.x = clamp(p.x, HX - 21.6, HX + 21.6); p.z = clamp(p.z, HZ - 9.6, HZ + 16.8); [-1, 1].forEach(s => { for (let i = 0; i < 5; i++) { const cx = HX + s * 19.5, cz = HZ - 14 + i * 7.2, d = Math.hypot(p.x - cx, p.z - cz); if (d < 1.0) { p.x = cx + (p.x - cx) / d * 1.0; p.z = cz + (p.z - cz) / d * 1.0; } } }); }
  function leilaoEntra() { if (Q.naCarroca || conversa) return; if (CAL.on) { calLimpa(); CAL.on = false; CALG.visible = false; } if (montado) montar(false); if (voando) voa(false);
    cena([{ t: '✨ Teleportando para a Casa de Leilões...', v: null }], () => { dentro = false; zona = 'leilao'; heroi.position.set(HX, 0, HZ + 9); facing = Math.PI; camYaw = 0; cam.position.set(HX, 4, HZ + 15); fx('luz', [HX, 0, HZ + 9], 1); som('portal', 0.8, 1); mostrarLugar('Casa de Leilões'); }); }
  function leilaoFrame(dt, p) { if (!PED_FEITAS) pedrasMonta(); const naCasa = zona === 'leilao'; LEI.G.visible = naCasa; let al = pedrasFrame(dt, p); if (!naCasa) return al;
    LEI.vit.forEach((v, i) => { v.rotation.y += dt * 1.2; v.position.y = 1.9 + Math.sin(gT * 2 + i) * 0.1; });
    const n = LEI.npc, nx = HX, nz = HZ - 12.3, d = Math.hypot(p.x - nx, p.z - nz); n.rotation.y += ((d < 9 ? Math.atan2(p.x - nx, p.z - nz) : 0) - n.rotation.y) * clamp(dt * 4);
    pose(n, gT, { mood: d < 6 ? 'smile' : 'neutral', arms: { shR: [-0.5 + Math.sin(gT * 1.5) * 0.08, 0, 0.2], elR: [-0.9, 0, 0] } });
    if (d < 4.6 && !al) al = { rot: 'FALAR', c: n, acao: leilaoAbre }; return al; }
  // ===================== LEILÕES (Firestore: leiloes/{id}) =====================
  const LTAXA = 0.05, LDUR = [[1, '1 hora'], [6, '6 horas'], [24, '24 horas']], VDUR = [[24, '1 dia'], [72, '3 dias'], [168, '7 dias']];
  const LS = { aba: 'comprar', docs: {}, un: [], esc: null, filtro: 'todos', modo: 'leilao' };
  const lP = document.createElement('div'); lP.id = 'leilao-p'; lP.hidden = true; lP.innerHTML = '<div class="box"><div class="hd"><h3>🔨 Casa de Leilões</h3><span id="lei-moe"></span><button id="lei-x">Fechar</button></div><div class="lei-abas"><button data-a="comprar">🛒 Comprar</button><button data-a="vender">💰 Vender</button><button data-a="meus">📦 Meus leilões <b id="lei-n" hidden>0</b></button></div><div id="lei-msg"></div><div id="lei-c"></div></div>'; document.body.appendChild(lP);
  ['keydown', 'keyup'].forEach(t => lP.addEventListener(t, e => e.stopPropagation()));
  tapBtn($('lei-x'), () => leilaoFecha()); lP.querySelectorAll('.lei-abas button').forEach(b => tapBtn(b, () => { LS.aba = b.dataset.a; LS.esc = null; leiDesenha(); }));
  const lEsc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lMoe = n => Math.round(n).toLocaleString('pt-BR');
  function lMsg(t, erro) { const m = $('lei-msg'); m.textContent = t || ''; m.className = erro ? 'erro' : ''; }
  function lTempo(fim) { const s = Math.max(0, Math.floor((fim - Date.now()) / 1000)); if (!s) return 'Encerrado'; const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? h + 'h ' + m + 'min' : m ? m + 'min ' + (s % 60) + 's' : s + 's'; }
  function lMin(d) { return d.lider ? Math.max(d.lance + 1, Math.ceil(d.lance * 1.05)) : d.ini; }
  function lFeito(k, set) { let L = []; try { L = JSON.parse(localStorage.getItem('aetherion-leilao') || '[]'); } catch (e) {} if (set) { L.push(k); try { localStorage.setItem('aetherion-leilao', JSON.stringify(L.slice(-400))); } catch (e) {} } return L.includes(k); }
  function leilaoAbre() { if (conversa || cenaQ) return; const db = trDb(); lP.hidden = false; LS.aba = 'comprar'; LS.esc = null; lMsg('');
    if (!db) { $('lei-c').innerHTML = '<p class="lei-vazio">O leilão é entre jogadores, então você precisa <b>entrar com uma conta</b>.</p>'; return; }
    const me = trMeu(), col = db.collection('leiloes'); const junta = q => s => { s.docChanges().forEach(c => { if (c.type === 'removed') return; LS.docs[c.doc.id] = { id: c.doc.id, ...c.doc.data() }; }); leiDesenha(); };
    LS.un.forEach(u => u()); LS.un = [col.orderBy('criado', 'desc').limit(150).onSnapshot(junta(), e => lMsg('⚠️ Não deu pra carregar os leilões: ' + (e.code || e.message), true)),
      col.where('de', '==', me).onSnapshot(junta(), () => {}), col.where('lider', '==', me).onSnapshot(junta(), () => {})];
    leiDesenha(); clearInterval(LS.tm); LS.tm = setInterval(() => { if (lP.hidden) return; lP.querySelectorAll('[data-fim]').forEach(e => e.textContent = '⏳ ' + lTempo(+e.dataset.fim)); }, 1000); }
  function leilaoFecha() { lP.hidden = true; LS.un.forEach(u => u()); LS.un = []; clearInterval(LS.tm); }
  // o que tem pra resgatar
  function lPend(d, me) { const acabou = Date.now() >= d.fim, P = [];
    if (d.lances && d.lances[me] > 0 && d.lider !== me) P.push(['devol', '↩️ Pegar de volta ' + lMoe(d.lances[me]) + ' moedas (lance superado)']);
    if (acabou && !d.entregue && ((d.lider && d.lider === me) || (!d.lider && d.de === me))) P.push(['item', d.lider ? '🏆 Pegar o item que você ganhou' : '📦 Pegar seu item de volta (ninguém deu lance)']);
    if (acabou && d.lider && d.de === me && !d.recebeuVend) P.push(['moedas', '💰 Receber ' + lMoe(Math.floor(d.lance * (1 - LTAXA))) + ' moedas da venda']); return P; }
  function lCard(d, extra) { const I = trInfo(d.it), me = trMeu(), acabou = Date.now() >= d.fim;
    return `<div class="lei-it${d.lider === me && !acabou ? ' ganhando' : ''}"><div class="lei-ic">${I.ic}</div><div class="lei-tx"><span class="lei-modo ${d.tipo === 'venda' ? 'v' : 'l'}">${d.tipo === 'venda' ? '🏷️ VENDA' : '🔨 LEILÃO'}</span><b>${lEsc(I.nome)}</b><small>Vendedor: ${lEsc(d.nomeDe || '?')}${d.de === me ? ' (você)' : ''}</small>
      <small>${d.tipo === 'venda' ? (d.lider ? '✅ Vendido por <b>' + lMoe(d.lance) + '</b> pra ' + lEsc(d.liderNome || '?') + (d.lider === me ? ' (você)' : '') : '🏷️ Preço: <b>' + lMoe(d.ini) + '</b> moedas') : d.lider ? '🔝 Lance: <b>' + lMoe(d.lance) + '</b> · ' + lEsc(d.liderNome || '?') + (d.lider === me ? ' (você)' : '') : '🔨 Lance inicial: <b>' + lMoe(d.ini) + '</b> · sem lances'}</small><small class="lei-t" data-fim="${d.fim}">⏳ ${lTempo(d.fim)}</small></div>${extra || ''}</div>`; }
  function leiDesenha() { if (lP.hidden) return; const C = $('lei-c'), me = trDb() ? trMeu() : null; $('lei-moe').innerHTML = IC('item_moedas') + ' ' + lMoe(AR.inv.moedas || 0);
    lP.querySelectorAll('.lei-abas button').forEach(b => b.classList.toggle('on', b.dataset.a === LS.aba)); if (!me) return; const docs = Object.values(LS.docs), agora = Date.now();
    const pend = docs.filter(d => lPend(d, me).length); $('lei-n').hidden = !pend.length; $('lei-n').textContent = pend.length;
    if (LS.aba === 'comprar') { const L = docs.filter(d => d.fim > agora && !(d.tipo === 'venda' && d.lider) && (LS.filtro === 'todos' || (LS.filtro === 'venda') === (d.tipo === 'venda'))).sort((a, b) => a.fim - b.fim); C.innerHTML = '';
      const fl = document.createElement('div'); fl.className = 'lei-filtro'; [['todos', 'Todos'], ['leilao', '🔨 Leilões'], ['venda', '🏷️ Venda direta']].forEach(([k, t]) => { const b = document.createElement('button'); b.textContent = t; b.className = LS.filtro === k ? 'on' : ''; tapBtn(b, () => { LS.filtro = k; leiDesenha(); }); fl.appendChild(b); }); C.appendChild(fl);
      if (!L.length) C.insertAdjacentHTML('beforeend', '<p class="lei-vazio">Nada à venda agora. Que tal ser o primeiro? Vá em 💰 Vender.</p>');
      L.forEach(d => { const el = document.createElement('div'); const meu = d.de === me; el.innerHTML = lCard(d, meu ? '<span class="lei-tag">' + (d.tipo === 'venda' ? 'Sua venda' : 'Seu leilão') + '</span>' : d.tipo === 'venda' ? `<div class="lei-lance"><button class="pri comprar">🛒 Comprar por ${lMoe(d.ini)}</button></div>` : `<div class="lei-lance"><input type="number" inputmode="numeric" min="${lMin(d)}" value="${lMin(d)}"><button class="pri">Dar lance</button></div>`); const c = el.firstChild; C.appendChild(c);
        if (!meu) { const inp = c.querySelector('input'); tapBtn(c.querySelector('button'), () => d.tipo === 'venda' ? lCompra(d.id) : lLance(d.id, Math.floor(+inp.value || 0))); } }); }
    else if (LS.aba === 'vender') leiVender(C);
    else { C.innerHTML = ''; const sec = (t, L, f) => { if (!L.length) return; const h = document.createElement('h4'); h.textContent = t; C.appendChild(h); L.forEach(d => { const el = document.createElement('div'); el.innerHTML = lCard(d, f(d)); const c = el.firstChild; C.appendChild(c); c.querySelectorAll('[data-r]').forEach(b => tapBtn(b, () => lResgata(d.id, b.dataset.r))); c.querySelectorAll('[data-cancela]').forEach(b => tapBtn(b, () => lCancela(d.id))); }); };
      sec('🎁 Para resgatar', pend, d => '<div class="lei-bts">' + lPend(d, me).map(([k, t]) => `<button class="pri" data-r="${k}">${t}</button>`).join('') + '</div>');
      sec('📢 Meus leilões e vendas abertos', docs.filter(d => d.de === me && d.fim > agora), d => d.lider ? '<span class="lei-tag">Com lance</span>' : '<div class="lei-bts"><button data-cancela="1">Cancelar</button></div>');
      sec('🙋 Meus lances', docs.filter(d => d.fim > agora && d.lances && d.lances[me] > 0), d => '<span class="lei-tag">' + (d.lider === me ? '🔝 Ganhando' : '⚠️ Superado') + '</span>');
      if (!C.children.length) C.innerHTML = '<p class="lei-vazio">Você ainda não tem leilões nem lances.</p>'; } }
  function leiVender(C) { const L = trTrocaveis().filter(it => it.t !== 'moedas'); C.innerHTML = '';
    if (LS.esc) { const it = LS.esc, I = trInfo(Object.assign({}, it, { n: it.t === 'item' ? 1 : it.n })), max = it.t === 'item' ? (AR.inv[it.k] || 0) : 1; const f = document.createElement('div'); f.className = 'lei-form';
      const V = LS.modo === 'venda', DU = V ? VDUR : LDUR; f.innerHTML = `<div class="lei-it"><div class="lei-ic">${I.ic}</div><div class="lei-tx"><b>${lEsc(I.nome.replace(/^1x /, ''))}</b><small>${V ? 'Venda direta: quem pagar o preço leva na hora.' : 'Leilão: quem der o maior lance até acabar o tempo leva.'}</small></div></div>
        <div class="lei-filtro"><button data-modo="leilao" class="${V ? '' : 'on'}">🔨 Leiloar</button><button data-modo="venda" class="${V ? 'on' : ''}">🏷️ Vender por preço fixo</button></div>
        ${it.t === 'item' ? `<label>Quantidade (você tem ${max})<input id="lv-n" type="number" inputmode="numeric" min="1" max="${max}" value="1"></label>` : ''}
        <label>${V ? 'Preço (moedas)' : 'Lance inicial (moedas)'}<input id="lv-ini" type="number" inputmode="numeric" min="1" value="100"></label>
        <label>${V ? 'Fica à venda por' : 'Duração'}<select id="lv-dur">${DU.map(([h, t], i) => `<option value="${h}"${i === 1 ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
        <p class="lei-nota">Quando vender, a casa fica com ${LTAXA * 100}% de taxa. ${V ? 'Se ninguém comprar até acabar o prazo' : 'Se ninguém der lance'}, o item volta pra você.</p><div class="lei-bts"><button id="lv-volta">← Voltar</button><button id="lv-ok" class="pri">${V ? '🏷️ Colocar à venda' : '🔨 Leiloar'}</button></div>`;
      C.appendChild(f); f.querySelectorAll('[data-modo]').forEach(b => tapBtn(b, () => { const n0 = $('lv-ini').value; LS.modo = b.dataset.modo; leiDesenha(); if ($('lv-ini')) $('lv-ini').value = n0; })); tapBtn($('lv-volta'), () => { LS.esc = null; leiDesenha(); }); tapBtn($('lv-ok'), () => lCria(it, it.t === 'item' ? Math.floor(+$('lv-n').value || 0) : 0, Math.floor(+$('lv-ini').value || 0), +$('lv-dur').value, LS.modo)); return; }
    if (!L.length) { C.innerHTML = '<p class="lei-vazio">Você não tem itens que dá pra leiloar (armas, conjuntos, peças, asas ou materiais).</p>'; return; }
    const p = document.createElement('p'); p.className = 'lei-nota'; p.textContent = 'Escolha o item que você quer leiloar:'; C.appendChild(p); const g = document.createElement('div'); g.className = 'lei-grade'; C.appendChild(g);
    L.forEach(it => { const I = trInfo(Object.assign({}, it, { n: it.t === 'item' ? (AR.inv[it.k] || 0) : it.n })); const b = document.createElement('button'); b.className = 'lei-sel'; b.innerHTML = `<span class="lei-ic">${I.ic}</span><small>${lEsc(I.nome)}</small>`; tapBtn(b, () => { LS.esc = it; leiDesenha(); }); g.appendChild(b); }); }
  async function lCria(it0, n, ini, horas, modo) { const venda = modo === 'venda'; const db = trDb(); if (!db) return; const it = { t: it0.t, k: it0.k, n: it0.t === 'item' ? n : 1 };
    if (it.t === 'item' && (n < 1 || n > (AR.inv[it.k] || 0))) { lMsg('Quantidade inválida.', true); return; } if (!(ini >= 1 && ini <= 100000000)) { lMsg('Lance inicial inválido.', true); return; } if (!trTenho(it)) { lMsg('Você não tem mais esse item.', true); return; }
    lMsg(venda ? 'Colocando à venda...' : 'Criando o leilão...'); trTira(it); salvaAR(); try { await db.collection('leiloes').add({ tipo: venda ? 'venda' : 'leilao', de: trMeu(), nomeDe: trNome(), it, ini, lance: 0, lider: null, liderNome: '', lances: {}, fim: Date.now() + horas * 3600 * 1000, criado: Date.now(), entregue: false, recebeuVend: false });
      lMsg(venda ? '🏷️ Seu item está à venda!' : '🔨 Seu item está em leilão!'); som('missao_ok', 0.7, 1); LS.esc = null; LS.aba = 'meus'; leiDesenha(); } catch (e) { trPoe(it); salvaAR(); lMsg('⚠️ Não deu pra criar o leilão: ' + (e.code || e.message), true); } }
  async function lCompra(id) { const db = trDb(); if (!db) return; const me = trMeu(), ref = db.collection('leiloes').doc(id); lMsg('Comprando...');
    try { const pagar = await db.runTransaction(async tx => { const s = await tx.get(ref); const d = s.data(); if (!d || d.tipo !== 'venda') throw { m: 'Essa venda não existe mais.' }; if (d.lider) throw { m: 'Alguém já comprou esse item.' }; if (Date.now() >= d.fim) throw { m: 'Essa venda já acabou.' }; if (d.de === me) throw { m: 'Esse item é seu.' };
        if (d.ini > (AR.inv.moedas || 0)) throw { m: 'Moedas insuficientes (precisa de ' + lMoe(d.ini) + ').' }; tx.update(ref, { lance: d.ini, lider: me, liderNome: trNome(), ['lances.' + me]: d.ini, fim: 0 }); return d.ini; });
      AR.inv.moedas = Math.max(0, (AR.inv.moedas || 0) - pagar); salvaAR(); if (typeof atualizaInv === 'function') atualizaInv(); if (LS.docs[id]) { LS.docs[id].fim = 0; LS.docs[id].lider = me; } await lResgata(id, 'item'); lMsg('✅ Comprado! O item já está na sua bolsa.'); }
    catch (e) { lMsg('⚠️ ' + (e && e.m ? e.m : 'Não deu pra comprar: ' + (e.code || e.message)), true); } }
  async function lLance(id, valor) { const db = trDb(); if (!db) return; const me = trMeu(), ref = db.collection('leiloes').doc(id); lMsg('Dando lance...');
    try { const pagar = await db.runTransaction(async tx => { const s = await tx.get(ref); const d = s.data(); if (!d) throw { m: 'Esse leilão não existe mais.' }; if (d.tipo === 'venda') throw { m: 'Isso é venda direta: use Comprar.' }; if (Date.now() >= d.fim) throw { m: 'Esse leilão já acabou.' }; if (d.de === me) throw { m: 'Você não pode dar lance no seu próprio leilão.' };
        const min = lMin(d); if (valor < min) throw { m: 'O lance mínimo agora é ' + lMoe(min) + ' moedas.' }; const meu = (d.lances || {})[me] || 0, pg = valor - meu; if (pg > (AR.inv.moedas || 0)) throw { m: 'Moedas insuficientes (precisa de ' + lMoe(pg) + ').' };
        tx.update(ref, { lance: valor, lider: me, liderNome: trNome(), ['lances.' + me]: valor }); return pg; });
      AR.inv.moedas = Math.max(0, (AR.inv.moedas || 0) - pagar); salvaAR(); if (typeof atualizaInv === 'function') atualizaInv(); lMsg('✅ Lance de ' + lMoe(valor) + ' moedas! Se alguém cobrir, você pega suas moedas de volta em 📦 Meus leilões.'); som('moeda', 0.7, 1); leiDesenha(); }
    catch (e) { lMsg('⚠️ ' + (e && e.m ? e.m : 'Não deu pra dar o lance: ' + (e.code || e.message)), true); } }
  async function lResgata(id, tipo) { const db = trDb(); if (!db) return; const me = trMeu(), ref = db.collection('leiloes').doc(id), chave = id + ':' + tipo + ':' + me;
    try { const r = await db.runTransaction(async tx => { const s = await tx.get(ref); const d = s.data(); if (!d) throw { m: 'Leilão não encontrado.' }; const acabou = Date.now() >= d.fim;
        if (tipo === 'devol') { const v = (d.lances || {})[me] || 0; if (!v || d.lider === me) throw { m: 'Nada pra devolver.' }; tx.update(ref, { ['lances.' + me]: 0 }); return { moedas: v, k: chave + ':' + v }; }
        if (tipo === 'item') { if (!acabou || d.entregue || !((d.lider && d.lider === me) || (!d.lider && d.de === me))) throw { m: 'Ainda não dá pra pegar esse item.' }; tx.update(ref, { entregue: true }); return { it: d.it, k: chave }; }
        if (tipo === 'moedas') { if (!acabou || !d.lider || d.de !== me || d.recebeuVend) throw { m: 'Ainda não dá pra receber.' }; tx.update(ref, { recebeuVend: true }); return { moedas: Math.floor(d.lance * (1 - LTAXA)), k: chave }; } throw { m: '?' }; });
      if (lFeito(r.k)) return; lFeito(r.k, true); if (r.it) { trPoe(r.it); aviso('🎁 Você recebeu: ' + trInfo(r.it).nome, '#ffd86a'); } if (r.moedas) { AR.inv.moedas = (AR.inv.moedas || 0) + r.moedas; aviso('💰 +' + lMoe(r.moedas) + ' moedas', '#ffd86a'); }
      salvaAR(); if (typeof atualizaInv === 'function') atualizaInv(); som('missao_ok', 0.7, 1.1); lMsg(''); leiDesenha(); }
    catch (e) { lMsg('⚠️ ' + (e && e.m ? e.m : 'Não deu: ' + (e.code || e.message)), true); } }
  async function lCancela(id) { const db = trDb(); if (!db) return; try { await db.collection('leiloes').doc(id).update({ fim: 0 }); LS.docs[id] && (LS.docs[id].fim = 0); await lResgata(id, 'item'); lMsg('Leilão cancelado. O item voltou pra você.'); } catch (e) { lMsg('⚠️ Não deu pra cancelar: ' + (e.code || e.message), true); } }
