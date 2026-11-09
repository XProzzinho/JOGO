  // Personagens toon (mesmo motor dos vídeos: O Menino que Ninguém Quis Ajudar)
  // ===================== O ÚLTIMO CONHECIMENTO — PRÓLOGO EM 3D (toon/anime) =====================
  const OPT = []; const opt = (o) => { OPT.push(o); return o; };
  const world = grp(scene);
  function shade(hex, k) { const c = new T3.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); }
  cam.near = 0.03; cam.far = 1600; cam.updateProjectionMatrix(); renderer.shadowMap.enabled = true; renderer.shadowMap.type = T3.PCFSoftShadowMap;
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -18; sun.shadow.camera.right = 18; sun.shadow.camera.top = 18; sun.shadow.camera.bottom = -18; sun.shadow.camera.near = 1; sun.shadow.camera.far = 120; sun.shadow.bias = -0.0008; scene.add(sun.target);
  const GRAD = (() => { const d = new Uint8Array([95, 95, 95, 255, 175, 175, 175, 255, 255, 255, 255, 255]); const t = new T3.DataTexture(d, 3, 1); t.minFilter = t.magFilter = T3.NearestFilter; t.needsUpdate = true; return t; })();
  const TM = {}; function tm(c) { return TM[c] || (TM[c] = new T3.MeshToonMaterial({ color: c, gradientMap: GRAD })); }
  const GM = {}; function gm(c) { return GM[c] || (GM[c] = new T3.MeshBasicMaterial({ color: c, toneMapped: false })); }
  const OUTM = new T3.MeshBasicMaterial({ color: 0x15101c, side: T3.BackSide });
  const SPH = new T3.SphereGeometry(1, 28, 18), CAP = new T3.CapsuleGeometry(0.5, 1, 8, 16), CYL = new T3.CylinderGeometry(1, 1, 1, 18), CONE = new T3.ConeGeometry(1, 1, 12), ICO = new T3.IcosahedronGeometry(1, 1), TOR = new T3.TorusGeometry(1, 0.12, 10, 40);
  function part(p, geo, c, x, y, z, sx, sy, sz, ol, glow) { const m = new T3.Mesh(geo, glow ? gm(c) : tm(c)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; m.receiveShadow = true; p.add(m); if (ol) { const o = new T3.Mesh(geo, OUTM); o.scale.setScalar(1 + ol); m.add(o); } return m; }
  function tb(p, x, y, z, w, h, d, c, glow) { const m = new T3.Mesh(BOX, glow ? gm(c) : tm(c)); m.position.set(x, y, z); m.scale.set(w, h, d); m.castShadow = true; m.receiveShadow = true; p.add(m); return m; }
  function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; return t; }
  const glowTex = canvasTex(128, 128, (x, w, h) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
  function glowSpr(p, x, y, z, s, c, a) { const m = new T3.Sprite(new T3.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity: a == null ? 1 : a, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false })); m.position.set(x, y, z); m.scale.set(s, s, 1); p.add(m); return m; }
  const FONT_TEX = []; const SHOPG = []; const SIGNS = [];

  // ---------- personagem 3D estilo anime ----------
  const LEOC = { skin: '#f2b48e', hair: '#1c1a28', top: '#2c3e5e', top2: '#24324c', pants: '#3a4a6c', shoe: '#eeeef4', sole: '#9aa0b0', iris: '#6a3e1e' };
  function makeChar(o) {
    const g = grp(world); const P = { o };
    const hips = grp(g, 0, 0.9, 0); P.hips = hips; const k = o.kid ? 0.62 : 1;
    ['L', 'R'].forEach((s, i) => { const sx = i ? 1 : -1; const th = grp(hips, 0.095 * sx * k, 0, 0); part(th, CAP, o.pants, 0, -0.21, 0, 0.14, 0.215, 0.14, 0.06); const kn = grp(th, 0, -0.43, 0); part(kn, CAP, o.pants, 0, -0.2, 0, 0.12, 0.2, 0.12, 0.06); const ft = grp(kn, 0, -0.42, 0); part(ft, SPH, o.shoe, 0, 0.0, 0.05, 0.065, 0.055, 0.13, 0.08); part(ft, BOX, o.sole || '#5a5a64', 0, -0.045, 0.05, 0.12, 0.02, 0.26); P['th' + s] = th; P['kn' + s] = kn; P['ft' + s] = ft; });
    const spine = grp(hips, 0, 0.02, 0); P.spine = spine;
    part(spine, CAP, o.top, 0, 0.3, 0, 0.36, 0.3, 0.24, 0.05); part(spine, SPH, o.top, 0, 0.05, 0, 0.18, 0.08, 0.13);
    if (o.hoodie) { part(spine, BOX, o.top2, 0, 0.16, 0.115, 0.2, 0.09, 0.02); [-1, 1].forEach(s => part(spine, CYL, '#e8eaf2', s * 0.04, 0.42, 0.125, 0.006, 0.12, 0.006)); part(spine, TOR, o.top2, 0, 0.57, -0.06, 0.12, 0.12, 0.25).rotation.x = Math.PI / 2.4; }
    if (o.coat) part(spine, CYL, o.coat, 0, 0.0, 0, 0.2, 0.25, 0.15);
    const neck = grp(spine, 0, 0.6, 0); part(neck, CYL, o.skin, 0, 0.03, 0, 0.045, 0.08, 0.045);
    const head = grp(neck, 0, 0.08, 0); P.head = head; const hr = o.kid ? 0.15 : 0.14;
    part(head, SPH, o.skin, 0, 0.13, 0, hr, hr * 1.06, hr * 1.0, 0.04);
    [-1, 1].forEach(s => part(head, SPH, o.skin, s * hr * 0.98, 0.125, 0, 0.025, 0.04, 0.03));
    part(head, SPH, o.skin, 0, 0.115, hr * 0.98, 0.014, 0.012, 0.012);
    // olhos anime
    P.eyes = [];
    [-1, 1].forEach(s => { const e = grp(head, s * hr * 0.36, 0.14, hr * 0.9); e.rotation.y = s * 0.32; part(e, SPH, '#fbf8f2', 0, 0, 0, hr * 0.24, hr * 0.3, 0.012); const ir = grp(e, 0, 0, 0.008); part(ir, SPH, o.iris || '#5a3a1e', 0, -hr * 0.02, 0, hr * 0.17, hr * 0.23, 0.008); part(ir, SPH, '#0e0a10', 0, -hr * 0.02, 0.005, hr * 0.09, hr * 0.13, 0.006); part(ir, SPH, '#ffffff', -hr * 0.06, hr * 0.06, 0.009, hr * 0.05, hr * 0.06, 0.004, 0, true); const lid = part(e, BOX, '#1a1018', 0, hr * 0.28, 0.006, hr * 0.5, hr * 0.06, 0.01); const brow = part(head, BOX, o.hairC || o.hair, s * hr * 0.37, 0.14 + hr * 0.47, hr * 0.93, hr * 0.42, hr * 0.07, 0.02); brow.rotation.y = s * 0.3; P.eyes.push({ e, ir, lid, brow, s }); });
    [-1, 1].forEach(s => { const b = part(head, SPH, '#ff7a8a', s * hr * 0.6, 0.085, hr * 0.78, hr * 0.14, hr * 0.06, 0.01); b.material = new T3.MeshBasicMaterial({ color: '#ff8a9a', transparent: true, opacity: 0.35 }); b.rotation.y = s * 0.6; });
    P.mouth = part(head, SPH, '#5a1a24', 0, 0.06, hr * 0.94, hr * 0.17, hr * 0.03, 0.01); P.mouthLine = part(head, BOX, '#7a2a2a', 0, 0.062, hr * 0.955, hr * 0.26, hr * 0.03, 0.006);
    // cabelo
    const hc = o.hairC || '#1c1a28';
    if (o.hairStyle === 'leo' || !o.hairStyle) { part(head, SPH, hc, 0, 0.17, -0.02, hr * 1.06, hr * 1.0, hr * 1.04, 0.04);
      for (let i = 0; i < 7; i++) { const a = -0.9 + i * 0.3; const c = part(head, CONE, hc, Math.sin(a) * hr * 0.8, 0.2 + Math.cos(i) * 0.008, Math.cos(a) * hr * 0.82, hr * 0.17, hr * 0.5, hr * 0.12); c.rotation.set(2.5 + (i % 2) * 0.15, a, 0); }
      for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; const c = part(head, CONE, hc, Math.sin(a) * hr * 0.75, 0.27, Math.cos(a) * hr * 0.6 - 0.02, hr * 0.2, hr * 0.55, hr * 0.2); c.rotation.set(-Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9); } }
    else if (o.hairStyle === 'pig') { part(head, SPH, hc, 0, 0.17, -0.02, hr * 1.06, hr * 0.98, hr * 1.04, 0.04); [-1, 1].forEach(s => { part(head, SPH, hc, s * hr * 1.15, 0.1, -0.03, hr * 0.32, hr * 0.5, hr * 0.32, 0.05); part(head, SPH, '#ff5a7a', s * hr * 1.05, 0.2, -0.02, hr * 0.12, hr * 0.12, hr * 0.12); }); for (let i = 0; i < 5; i++) { const c = part(head, CONE, hc, -hr * 0.5 + i * hr * 0.25, 0.22, hr * 0.8, hr * 0.15, hr * 0.35, hr * 0.1); c.rotation.x = 2.6; } }
    else if (o.hairStyle === 'short') { part(head, SPH, hc, 0, 0.18, -0.025, hr * 1.05, hr * 0.92, hr * 1.04, 0.04); }
    else if (o.hairStyle === 'long') { part(head, SPH, hc, 0, 0.17, -0.02, hr * 1.07, hr * 1.0, hr * 1.05, 0.04); part(head, CAP, hc, 0, 0.0, -0.07, hr * 2.0, hr * 1.4, hr * 1.2, 0.04); }
    else if (o.hairStyle === 'bald') { part(head, SPH, '#b8b4c0', 0, 0.12, -0.04, hr * 1.02, hr * 0.7, hr * 1.0); }
    if (o.kid && o.raincoat) { part(head, SPH, o.top, 0, 0.18, -0.04, hr * 1.18, hr * 1.1, hr * 1.12, 0.04); }
    P.hood = part(head, SPH, o.top2 || o.top, 0, 0.15, -0.055, hr * 1.25, hr * 1.3, hr * 1.22, 0.04); P.hood.visible = false;
    // braços
    ['L', 'R'].forEach((s, i) => { const sx = i ? 1 : -1; const sh = grp(spine, 0.215 * sx * (o.kid ? 0.9 : 1), 0.52, 0); part(sh, CAP, o.top, 0, -0.15, 0, 0.11, 0.16, 0.11, 0.06); const el = grp(sh, 0, -0.3, 0); part(el, CAP, o.top, 0, -0.13, 0, 0.095, 0.14, 0.095, 0.06); part(el, SPH, o.skin, 0, -0.29, 0.01, 0.05, 0.06, 0.045, 0.06); P['sh' + s] = sh; P['el' + s] = el; });
    if (o.phone) P.phone = part(P.elR, BOX, '#121220', 0, -0.33, 0.04, 0.05, 0.1, 0.01);
    if (o.book) P.book = part(P.elR, BOX, '#c8402a', 0, -0.33, 0.07, 0.16, 0.2, 0.03);
    g.scale.setScalar(o.kid ? 0.68 : (o.s || 1)); g.userData.P = P; return g;
  }
  function setFace(c, m, talk, t, look) {
    const P = c.userData.P; const blink = ((t + (P.o.ph || 0)) % 3.3) < 0.11 ? 0.12 : 1; look = look || [0, 0];
    P.eyes.forEach(({ e, ir, lid, brow, s }) => { const open = (m === 'shock' || m === 'scream' ? 1.2 : m === 'determined' ? 0.75 : m === 'sad' ? 0.8 : 1) * blink; e.scale.y = open; ir.position.x = look[0] * 0.012; ir.position.y = look[1] * 0.012; lid.visible = m === 'determined' || m === 'sad'; brow.rotation.z = s * (m === 'sad' || m === 'worried' ? -0.35 : m === 'determined' || m === 'angry' ? 0.4 : m === 'shock' ? -0.1 : 0.05); brow.position.y = 0.14 + 0.14 * 0.47 + (m === 'shock' || m === 'scream' ? 0.018 : 0); });
    const op = m === 'scream' ? 1 : m === 'shock' ? 0.7 : talk ? Math.abs(Math.sin(t * 12)) * 0.8 : 0;
    P.mouth.visible = op > 0.05; P.mouth.scale.y = 0.004 + op * 0.022; P.mouthLine.visible = op <= 0.05; P.mouthLine.rotation.z = 0; P.mouthLine.scale.x = m === 'smile' ? 0.05 : 0.036; P.mouthLine.position.y = m === 'smile' ? 0.058 : 0.062;
    if (m === 'smile') { P.mouth.visible = true; P.mouth.scale.set(0.026, 0.008, 0.01); P.mouthLine.visible = false; } else P.mouth.scale.x = 0.024;
  }
  // poses: walk, run, idle, sit, custom
  function pose(c, t, o) {
    const P = c.userData.P; o = o || {}; t += P.o.ph || 0;
    ['thL', 'thR', 'knL', 'knR', 'ftL', 'ftR', 'shL', 'shR', 'elL', 'elR'].forEach(k => P[k].rotation.set(0, 0, 0)); P.spine.rotation.set(0, 0, 0); P.head.rotation.set(0, 0, 0);
    P.shL.rotation.z = -0.08; P.shR.rotation.z = 0.08; let hy = 0.9;
    if (o.walk || o.run) { const run = !!o.run; const ph = t * (run ? 11 : 5.8); const A = run ? 0.95 : 0.48;
      [['L', 0], ['R', Math.PI]].forEach(([s, off]) => { const p = ph + off; const th = -Math.sin(p) * A; const kn = (run ? 0.35 : 0.08) + Math.pow(Math.max(0, Math.cos(p)), 1.3) * (run ? 1.7 : 0.85); P['th' + s].rotation.x = th; P['kn' + s].rotation.x = kn; P['ft' + s].rotation.x = -(th + kn) * 0.55 + (run ? 0.2 : 0); P['sh' + s].rotation.x = Math.sin(p) * (run ? 1.0 : 0.42); P['el' + s].rotation.x = -(run ? 1.55 : 0.22 + Math.max(0, -Math.sin(p)) * 0.4); });
      hy = 0.9 + (run ? 0.06 : 0.025) * Math.cos(2 * ph) - (run ? 0.05 : 0.01); P.spine.rotation.y = Math.sin(ph) * (run ? 0.18 : 0.09); P.spine.rotation.x = run ? 0.28 : 0.03; P.spine.rotation.z = Math.cos(ph) * 0.025; P.head.rotation.y = -Math.sin(ph) * 0.06; P.head.rotation.x = run ? -0.2 : 0;
    } else if (o.sit) { ['L', 'R'].forEach(s => { P['th' + s].rotation.x = -1.5; P['kn' + s].rotation.x = 1.5; }); hy = 0.5; P.shL.rotation.x = -0.6; P.shR.rotation.x = -0.6; P.elL.rotation.x = -0.9; P.elR.rotation.x = -0.9; }
    else { const br = Math.sin(t * 2) * 0.012; hy = 0.9 + br * 0.3; P.spine.rotation.x = br; P.shL.rotation.x = br * 2; P.shR.rotation.x = -br * 2; P.elL.rotation.x = -0.12; P.elR.rotation.x = -0.12; P.head.rotation.y = Math.sin(t * 0.6) * 0.08; }
    P.hips.position.y = hy;
    if (o.arms) { const a = o.arms; if (a.shL) P.shL.rotation.set(...a.shL); if (a.shR) P.shR.rotation.set(...a.shR); if (a.elL) P.elL.rotation.set(...a.elL); if (a.elR) P.elR.rotation.set(...a.elR); }
    if (o.legs) { const l = o.legs; ['thL', 'thR', 'knL', 'knR'].forEach(k => { if (l[k] != null) P[k].rotation.x = l[k]; }); }
    if (o.lean) P.spine.rotation.x = o.lean; if (o.headX != null) P.head.rotation.x = o.headX; if (o.headY != null) P.head.rotation.y = o.headY; if (o.headZ != null) P.head.rotation.z = o.headZ; if (o.hipY != null) P.hips.position.y = o.hipY;
    P.hood.visible = !!o.hood; setFace(c, o.mood || 'neutral', o.talk, t, o.look);
  }

