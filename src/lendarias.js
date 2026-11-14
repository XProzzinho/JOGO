  // ===================== 6 MAGIAS LENDÁRIAS (rota Arcana da árvore) — visual adaptado do Grimório Arcano 3D =====================
  const LEND = [
    { id: 'lg_eclipse', nome: 'Eclipse', titulo: 'Eclipse Arcano', custo: 70, cd: 14, cor: '#9b20ff', desc: 'Eclipse Arcano: um sol roxo nasce em cima do inimigo, queima tudo em volta por 3 segundos e colapsa numa explosão final.' },
    { id: 'lg_meteoros', nome: 'Meteoros', titulo: 'Chuva de Meteoros', custo: 75, cd: 16, cor: '#ff650c', desc: 'Chuva de Meteoros: dezenas de pedras de fogo caem do céu numa área grande, cada uma explode no chão.' },
    { id: 'lg_trovao', nome: 'Trovão', titulo: 'Lança do Trovão', custo: 60, cd: 10, cor: '#20caff', desc: 'Lança do Trovão: uma lança de raio atravessa tudo em linha reta e deixa os inimigos tontos.' },
    { id: 'lg_glacial', nome: 'Glacial', titulo: 'Prisão Glacial', custo: 65, cd: 15, cor: '#79eaff', desc: 'Prisão Glacial: cristais de gelo brotam em círculo, congelam todos dentro por 4 segundos e estilhaçam no fim.' },
    { id: 'lg_dragao', nome: 'Dragão', titulo: 'Dragão Infernal', custo: 90, cd: 20, cor: '#ff2600', desc: 'Dragão Infernal: um dragão de fogo voa em espiral em cima dos inimigos por 6 segundos, cuspindo chamas.' },
    { id: 'lg_abismo', nome: 'Abismo', titulo: 'Vórtice do Abismo', custo: 85, cd: 18, cor: '#7a2aff', desc: 'Vórtice do Abismo: um buraco negro puxa os inimigos pro centro, machuca sem parar e implode no final.' }];
  const LEND_NV = 20, LEND_CD = {};
  LEND.forEach(L => { const h = { id: L.id, nome: L.nome, icone: IC('p_' + L.id), tipo: 'uso', custo: L.custo, lend: L, nvMin: LEND_NV, desc: '✨ LENDÁRIA · ' + L.desc + ' (recarga ' + L.cd + ' s)' }; PODERES.push(h); PW[L.id] = h; });
  function lendPode(pw) { const L = pw.lend; if (!L) return true; const r = (LEND_CD[L.id] || 0) - Date.now(); if (r > 0) { aviso(pw.nome + ': recarregando, ' + Math.ceil(r / 1000) + ' s.', '#8a9aba'); return false; } if (AR.nv < LEND_NV && !souAdmin()) { aviso('Magia lendária: precisa do nível ' + LEND_NV + '.', '#ff6a6a'); return false; } return true; }
  // textura do selo rúnico (do grimório)
  const LEND_SELO = canvasTex(512, 512, (g, w, h) => { const cx = 256, cy = 256; g.clearRect(0, 0, w, h); g.strokeStyle = '#ffffff'; g.shadowColor = '#ffffff'; g.shadowBlur = 10;
    [238, 214, 150, 92].forEach((r, i) => { g.lineWidth = i === 0 ? 5 : 2.5; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke(); });
    g.lineWidth = 3; for (let rot = 0; rot < 2; rot++) { g.beginPath(); for (let i = 0; i <= 4; i++) { const a = i * Math.PI / 2 + rot * Math.PI / 4; const px = cx + Math.cos(a) * 212, py = cy + Math.sin(a) * 212; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
    g.fillStyle = '#ffffff'; g.font = 'bold 20px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; const sb = ['✦', '◈', '❖', '⚔', '✧', '❂', '✹', '❖', '✦', '◈', '✧', '❂']; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(sb[i], cx + Math.cos(a) * 182, cy + Math.sin(a) * 182); } });
  const LEND_FX = [];
  const lmat = (c, op) => new T3.MeshBasicMaterial({ color: c, transparent: true, opacity: (op === undefined ? 1 : op) * 0.85, blending: T3.NormalBlending, side: T3.DoubleSide, depthWrite: false, toneMapped: false });
  const LG = { ico: new T3.IcosahedronGeometry(1, 1), cone: new T3.ConeGeometry(1, 1, 7), cone4: new T3.ConeGeometry(1, 1, 4), esf: new T3.SphereGeometry(1, 10, 8), part: new T3.SphereGeometry(0.06, 5, 4) };
  function lendAlvo(alc) { const p = heroi.position; let best = null, bd = alc; FERAS.forEach(e => { if (!feraAtiva(e)) return; const d = Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z); if (d < bd) { bd = d; best = e; } }); if (best) { facing = Math.atan2(best.g.position.x - p.x, best.g.position.z - p.z); return [best.g.position.x, best.g.position.z]; } return [p.x + Math.sin(facing) * 6, p.z + Math.cos(facing) * 6]; }
  function lendArea(x, z, r) { return FERAS.filter(e => feraAtiva(e) && Math.hypot(e.g.position.x - x, e.g.position.z - z) < r + e.T.raio); }
  function lendBase() { const A = ARMAS[AR.arma] || {}; return Math.max(18, (A.dano || 12)) * atkMult() * (1 + Math.min(AR.nv, 200) * 0.02); }
  function lendHit(lista, k, tipo) { const b = lendBase(); lista.forEach(e => { const cr = critico(); dano(e, b * k * (cr ? 1.8 : 1), tipo || 'magia', cr); }); }
  // base comum: selo no chão + anéis + onda de choque + partículas subindo
  function lendNovo(L, x, z, dur, cor) { const g = grp(world, x, 0, z); const fx = { L, g, t: 0, dur, cor, anim: [], parts: [], tick: 0, x, z };
    const selo = new T3.Mesh(new T3.PlaneGeometry(8.8, 8.8), new T3.MeshBasicMaterial({ map: LEND_SELO, color: cor, transparent: true, opacity: 0.95, blending: T3.NormalBlending, depthWrite: false, toneMapped: false })); selo.rotation.x = -Math.PI / 2; selo.position.y = 0.06; g.add(selo); fx.anim.push(() => { selo.rotation.z -= 0.012; });
    [[2.0, '#ffffff', 0.025], [3.3, cor, -0.025], [4.3, cor, 0.018]].forEach(([r, c, v], i) => { const m = new T3.Mesh(new T3.TorusGeometry(r, 0.055, 8, 72), lmat(c)); m.rotation.x = Math.PI / 2; m.position.y = 0.12 + i * 0.02; g.add(m); fx.anim.push(() => { m.rotation.z += v; }); });
    const onda = new T3.Mesh(new T3.RingGeometry(0.2, 0.55, 64), lmat('#ffffff', 0.9)); onda.rotation.x = -Math.PI / 2; onda.position.y = 0.1; g.add(onda); fx.anim.push(() => { const k = Math.min(fx.t / 1.0, 1); onda.scale.setScalar(1 + k * 14); onda.material.opacity = Math.max(0, 0.9 * (1 - k)); });
    glowSpr(g, 0, 1.2, 0, 7, cor, 0.55); LEND_FX.push(fx); tremor = Math.max(tremor, 0.36); return fx; }
  function lendParts(fx, n, cor, alc) { const m = lmat(cor, 0.9); for (let i = 0; i < n; i++) { const s = new T3.Mesh(LG.part, m); s.scale.setScalar(0.6 + Math.random() * 1.5); s.position.set((Math.random() - 0.5) * alc, Math.random() * 10, (Math.random() - 0.5) * alc); s.userData.v = 1.2 + Math.random() * 3.2; fx.g.add(s); fx.parts.push(s); } }
  function lendEsfera(fx, r, c, x, y, z, op) { const m = new T3.Mesh(LG.ico, lmat(c, op)); m.scale.setScalar(r); m.position.set(x, y, z); fx.g.add(m); fx.anim.push(() => { m.rotation.x += 0.025; m.rotation.y += 0.035; }); return m; }
  function lendAnel(fx, r, c, y, v) { const m = new T3.Mesh(new T3.TorusGeometry(r, 0.055, 8, 72), lmat(c)); m.rotation.x = Math.PI / 2; m.position.y = y; fx.g.add(m); fx.anim.push(() => { m.rotation.z += v; }); return m; }
  // ---------- as 6 magias ----------
  const LEND_CRIA = {
    lg_eclipse(L, x, z) { const fx = lendNovo(L, x, z, 3.6, L.cor); for (let i = 0; i < 6; i++) lendAnel(fx, 1.2 + i * 0.65, i % 2 ? '#d34aff' : '#ffcf48', 0.2 + i * 0.08, i % 2 ? -0.025 : 0.025);
      const sol = lendEsfera(fx, 1.3, '#9b00ff', 0, 5, 0, 0.8); lendEsfera(fx, 0.65, '#ffffff', 0, 5, 0, 1);
      const col = new T3.Mesh(new T3.CylinderGeometry(0.5, 1.7, 11, 24, 1, true), lmat('#a020ff', 0.35)); col.position.y = 5.5; fx.g.add(col);
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; lendEsfera(fx, 0.23, '#ffcf48', Math.cos(a) * 3.5, 0.5, Math.sin(a) * 3.5); }
      lendParts(fx, 90, '#b52aff', 13);
      fx.passo = dt => { fx.tick -= dt; if (fx.tick <= 0 && fx.t < 3.2) { fx.tick = 0.6; lendHit(lendArea(x, z, 4.5), 0.9); } sol.scale.setScalar(1.3 * (1 + Math.sin(fx.t * 6) * 0.12) * (fx.t > 3.2 ? Math.max(0.05, 1 - (fx.t - 3.2) * 3) : 1)); };
      fx.fim = () => { lendHit(lendArea(x, z, 5), 2.6); flash('rgba(160,60,255,.35)'); fx_luz(x, z, 1.4); }; },
    lg_meteoros(L, x, z) { const fx = lendNovo(L, x, z, 4.2, L.cor); const pedras = [];
      for (let i = 0; i < 22; i++) { const m = new T3.Mesh(LG.ico, lmat('#ff5500')); m.scale.setScalar(0.25 + Math.random() * 0.45); m.position.set((Math.random() - 0.5) * 13, 12 + Math.random() * 14, (Math.random() - 0.5) * 13); m.userData.v = 9 + Math.random() * 7; fx.g.add(m); pedras.push(m); }
      lendParts(fx, 70, '#ff8b19', 15);
      fx.passo = dt => { pedras.forEach(m => { if (!m.visible) return; m.position.y -= m.userData.v * dt; m.rotation.x += 0.08; m.rotation.z += 0.07; if (m.position.y <= 0) { const wx = x + m.position.x, wz = z + m.position.z; lendHit(lendArea(wx, wz, 1.9), 1.1, 'fogo'); fx_luz(wx, wz, 0.35); if (fx.t < 3.3) { m.position.set((Math.random() - 0.5) * 13, 12 + Math.random() * 6, (Math.random() - 0.5) * 13); } else m.visible = false; } }); }; },
    lg_trovao(L, x, z) { const p = heroi.position, ang = Math.atan2(x - p.x, z - p.z); const fx = lendNovo(L, p.x, p.z, 1.8, L.cor); fx.g.rotation.y = ang;
      lendEsfera(fx, 0.8, '#00aaff', 0, 2, 0); const ponta = new T3.Mesh(LG.cone, lmat('#22cfff')); ponta.scale.set(0.65, 7, 0.65); ponta.rotation.x = Math.PI / 2; ponta.position.set(0, 2, 2); fx.g.add(ponta);
      const raios = []; for (let j = 0; j < 9; j++) { const pts = []; let rx = 0, ry = 2, rz = 0; for (let i = 0; i < 12; i++) { pts.push(new T3.Vector3(rx, ry, rz)); rx += (Math.random() - 0.5) * 1.5; ry = clamp(ry + (Math.random() - 0.5) * 1.5, 0.4, 4); rz += 1.25; } const l = new T3.Line(new T3.BufferGeometry().setFromPoints(pts), lmat('#9cfaff')); fx.g.add(l); raios.push(l); }
      lendParts(fx, 50, '#22cfff', 10); let bateu = false;
      fx.passo = dt => { raios.forEach(l => l.visible = Math.random() > 0.3); ponta.position.z = Math.min(15, 2 + fx.t * 24); if (!bateu && fx.t > 0.25) { bateu = true; const dx = Math.sin(ang), dz = Math.cos(ang); const lista = FERAS.filter(e => { if (!feraAtiva(e)) return false; const ex = e.g.position.x - p.x, ez = e.g.position.z - p.z, ao = ex * dx + ez * dz, lat = Math.abs(ex * dz - ez * dx); return ao > -0.5 && ao < 15 && lat < 1.6 + e.T.raio; }); lendHit(lista, 3.2, 'raio'); lista.forEach(e => { e.stun = Math.max(e.stun || 0, 1.5); }); flash('rgba(120,220,255,.35)'); } }; },
    lg_glacial(L, x, z) { const fx = lendNovo(L, x, z, 4.2, L.cor); const cris = [];
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; const m = new T3.Mesh(new T3.ConeGeometry(0.48 + Math.random() * 0.25, 3 + Math.random() * 3, 6), lmat('#72eaff', 0.8)); m.position.set(Math.cos(a) * 3.3, -3, Math.sin(a) * 3.3); m.rotation.z = Math.PI / 10; fx.g.add(m); cris.push(m); }
      lendEsfera(fx, 1.1, '#b9f7ff', 0, 2, 0); lendAnel(fx, 4.8, '#c9faff', 0.15, 0.02); lendParts(fx, 70, '#9ceeff', 12);
      const presos = lendArea(x, z, 4.2); lendHit(presos, 2.0, 'gelo'); presos.forEach(e => congelar(e, 4));
      fx.passo = dt => { cris.forEach(m => { m.position.y = Math.min(1.5, m.position.y + dt * 14); m.rotation.y += 0.008; }); };
      fx.fim = () => { lendHit(lendArea(x, z, 4.4), 1.5, 'gelo'); fx_luz(x, z, 0.9); }; },
    lg_dragao(L, x, z) { const fx = lendNovo(L, x, z, 6.2, L.cor); const piv = grp(fx.g); const segs = [];
      for (let i = 0; i < 18; i++) { const t = i / 17, r = (1 - Math.pow(t, 1.35)) * 0.85 + 0.12; const sg = grp(piv); const go = new T3.Mesh(LG.ico, lmat(i % 3 === 0 ? '#ffb703' : i % 2 === 0 ? '#ff4500' : '#dc2626', 0.92)); go.scale.set(r * 0.95, r * 0.88, r * 1.35); sg.add(go);
        if (i < 16) { const es = new T3.Mesh(LG.cone4, lmat('#ffea00', 0.95)); es.scale.set(r * 0.35, r * 1.45, r * 0.35); es.position.set(0, r * 0.95, -0.1); es.rotation.x = -0.35; sg.add(es); } segs.push(sg); }
      const cab = grp(piv); { const cr = new T3.Mesh(new T3.BoxGeometry(1.15, 0.75, 1.2), lmat('#e11d48', 0.96)); cr.position.y = 0.15; const fo = new T3.Mesh(new T3.ConeGeometry(0.62, 1.55, 5), lmat('#ff4500', 0.96)); fo.rotation.x = Math.PI / 2; fo.scale.set(1.05, 1, 0.65); fo.position.set(0, 0.12, 1.15); cab.add(cr, fo);
        [-0.45, 0.45].forEach(ox => { const o = new T3.Mesh(LG.esf, lmat('#ffff00')); o.scale.set(0.11, 0.14, 0.2); o.position.set(ox, 0.34, 0.48); cab.add(o); });
        [-1, 1].forEach(s => { const c1 = new T3.Mesh(LG.cone, lmat('#ffd000', 0.98)); c1.scale.set(0.16, 2.1, 0.16); c1.position.set(s * 0.42, 0.75, -0.85); c1.rotation.set(-1.05, s * 0.18, -s * 0.22); cab.add(c1); }); }
      const sopro = new T3.Mesh(new T3.ConeGeometry(1.15, 4.4, 12, 1, true), lmat('#ff6a00', 0.58)); sopro.rotation.x = -Math.PI / 2; sopro.position.set(0, -0.08, 3.1); cab.add(sopro);
      const asas = [-1, 1].map(s => { const a = grp(piv); const os = new T3.Mesh(new T3.CylinderGeometry(0.08, 0.12, 2.1, 6), lmat('#ffaa00', 0.98)); os.rotation.z = -s * Math.PI / 2; os.position.x = s * 1.05; const m1 = new T3.Mesh(new T3.ConeGeometry(1.35, 2.4, 3), lmat('#ff3b00', 0.68)); m1.rotation.x = Math.PI / 2; m1.rotation.z = s * 0.4; m1.scale.set(1.2, 1, 0.08); m1.position.set(s * 1.2, -0.05, -0.95);
        const m2 = new T3.Mesh(new T3.ConeGeometry(1.65, 3.0, 3), lmat('#ff6b00', 0.62)); m2.rotation.x = Math.PI / 2; m2.rotation.z = -s * 0.35; m2.scale.set(1.3, 1, 0.08); m2.position.set(s * 2.75, -0.2, -1.15); a.add(os, m1, m2); return { a, s }; });
      const traj = f => new T3.Vector3(Math.cos(f) * (3.1 + Math.sin(f * 0.7) * 0.6), 3.6 + Math.sin(f * 2) * 1.15, Math.sin(f) * (3.1 + Math.sin(f * 0.7) * 0.6));
      const chamas = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = 2.6 + (i % 3) * 0.75; const c = new T3.Mesh(LG.cone, lmat(i % 2 ? '#ffaa00' : '#ff5500', 0.82)); c.scale.set(0.45, 2.4, 0.45); c.position.set(Math.cos(a) * r, 1, Math.sin(a) * r); fx.g.add(c); chamas.push(c); }
      lendParts(fx, 70, '#ff6b00', 13); const tmp = new T3.Vector3();
      fx.passo = dt => { const v = fx.t * 2.1 * 1.4; cab.position.copy(traj(v)); tmp.copy(traj(v + 0.12)); cab.lookAt(tmp.x + fx.x, tmp.y, tmp.z + fx.z);
        const boca = Math.max(0, Math.sin(fx.t * 3.5 * 1.4)); sopro.visible = boca > 0.15; if (sopro.visible) sopro.scale.set(0.7 + boca * 0.65, 0.7 + boca * 0.65, 0.8 + boca * 0.5);
        segs.forEach((sg, i) => { sg.position.copy(traj(v - (i + 1) * 0.13)); tmp.copy(traj(v - (i + 1) * 0.13 + 0.1)); sg.lookAt(tmp.x + fx.x, tmp.y, tmp.z + fx.z); });
        const pe = traj(v - 0.35); tmp.copy(traj(v - 0.25)); const bat = Math.sin(fx.t * 7.5 * 1.4) * 0.58; asas.forEach(o => { o.a.position.copy(pe); o.a.lookAt(tmp.x + fx.x, tmp.y, tmp.z + fx.z); o.a.rotateZ(o.s * bat); });
        chamas.forEach((c, i) => { c.position.y = 1 + Math.abs(Math.sin(fx.t * 3.5 * 1.4 + i)) * 2.2; });
        fx.tick -= dt; if (fx.tick <= 0 && fx.t < 6) { fx.tick = 0.5; const l = lendArea(x, z, 4.6); lendHit(l, 0.7, 'fogo'); l.forEach(e => { e.queima = Math.max(e.queima || 0, 2); }); } }; },
    lg_abismo(L, x, z) { const fx = lendNovo(L, x, z, 5.2, L.cor);
      for (let i = 0; i < 9; i++) lendAnel(fx, 1.2 + i * 0.42, i % 2 ? '#9b20ff' : '#4c1d95', 0.25 + i * 0.42, i % 2 ? 0.065 : -0.065);
      const disco = new T3.Mesh(new T3.RingGeometry(1.6, 4.4, 56), new T3.MeshBasicMaterial({ map: LEND_SELO, color: '#a855f7', transparent: true, opacity: 0.85, side: T3.DoubleSide, blending: T3.NormalBlending, depthWrite: false, toneMapped: false })); disco.position.y = 2.6; disco.rotation.x = Math.PI / 2.6; fx.g.add(disco); fx.anim.push(() => { disco.rotation.z -= 0.07; });
      for (let t = 0; t < 8; t++) { const b = t / 8 * Math.PI * 2, pts = []; for (let s = 0; s <= 16; s++) { const f = s / 16, r = 4.6 * (1 - f), a = b + f * 2.2; pts.push(new T3.Vector3(Math.cos(a) * r, 0.3 + f * 2.3, Math.sin(a) * r)); } const fi = new T3.Mesh(new T3.TubeGeometry(new T3.CatmullRomCurve3(pts), 20, 0.055, 5, false), lmat(t % 2 ? '#6b21a8' : '#c084fc', 0.85)); fx.g.add(fi); fx.anim.push(() => { fi.rotation.y += 0.05; }); }
      const nuc = new T3.Mesh(LG.esf, new T3.MeshBasicMaterial({ color: '#04000a' })); nuc.scale.setScalar(1.38); nuc.position.y = 2.6; fx.g.add(nuc);
      const aura = lendEsfera(fx, 1.72, '#b000ff', 0, 2.6, 0, 0.68); lendParts(fx, 80, '#9b00ff', 14);
      fx.passo = dt => { aura.scale.setScalar(1.72 * (1 + Math.sin(fx.t * 5.5 * 1.4) * 0.15)); fx.parts.forEach(s => { const a = fx.t * 2.8 + s.position.y; s.position.x += Math.sin(a) * 0.045; s.position.z += Math.cos(a) * 0.045; });
        lendArea(x, z, 6.5).forEach(e => { if (e.T.chefe) return; const ex = x - e.g.position.x, ez = z - e.g.position.z, d = Math.hypot(ex, ez); if (d > 0.8) { e.g.position.x += ex / d * dt * 3.2; e.g.position.z += ez / d * dt * 3.2; } });
        fx.tick -= dt; if (fx.tick <= 0 && fx.t < 4.8) { fx.tick = 0.5; lendHit(lendArea(x, z, 4.5), 0.6, 'magia'); } };
      fx.fim = () => { lendHit(lendArea(x, z, 5), 2.2); flash('rgba(90,0,160,.4)'); fx_luz(x, z, 1.2); }; } };
  function fx_luz(x, z, k) { try { fx('luz', [x, 0, z], k); } catch (e) {} }
  function lendPoder(pw) { const L = pw && pw.lend; if (!L) return; LEND_CD[L.id] = Date.now() + L.cd * 1000; const [x, z] = lendAlvo(16); LEND_CRIA[L.id](L, x, z); aviso('✨ ' + L.titulo + '!', L.cor); }
  function lendFrame(dt) { for (let i = LEND_FX.length - 1; i >= 0; i--) { const f = LEND_FX[i]; f.t += dt; f.g.visible = zona !== 'leilao'; f.anim.forEach(fn => fn()); f.parts.forEach(s => { s.position.y += s.userData.v * dt; if (s.position.y > 11) s.position.y = 0; }); if (f.passo) f.passo(dt);
      const fade = f.t > f.dur - 0.5 ? Math.max(0, (f.dur - f.t) / 0.5) : 1; f.g.scale.setScalar(f.t < 0.25 ? 0.4 + f.t / 0.25 * 0.6 : 1); if (fade < 1) f.g.traverse(o => { if (o.material && o.material.transparent) { o.material.userData.op0 = o.material.userData.op0 ?? o.material.opacity; o.material.opacity = o.material.userData.op0 * fade; } });
      if (f.t >= f.dur) { if (f.fim) f.fim(); world.remove(f.g); f.g.traverse(o => { if (o.geometry && !Object.values(LG).includes(o.geometry)) o.geometry.dispose(); if (o.material) o.material.dispose(); }); LEND_FX.splice(i, 1); } } }
  window.__lend = { cast: id => { LEND_CD[id] = 0; usarPoder(PW[id]); }, FX: LEND_FX, F: FERAS, ativa: e => feraAtiva(e) };
