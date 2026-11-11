  // ===================== JOGO — Vila de Brumafria (do vídeo O Último Conhecimento) =====================
  cam.near = 0.1; cam.far = 800; cam.updateProjectionMatrix();
  const ROOF = new T3.ConeGeometry(1, 1, 4);
  const VISUAL_BLOCOS = (() => { try { const q = new URLSearchParams(location.search).get('blocos'); return q !== null ? q !== '0' : localStorage.getItem('aetherion-blocos') === '1'; } catch (e) { return false; } })();
  // árvore de folhas redondinha (estilo dos vídeos)
  function arvoreFolhas(g, R) { part(g, CYL, '#7a5232', 0, 1.1, 0, 0.17, 2.2, 0.17); const ga = part(g, CYL, '#7a5232', 0.28, 2.0, 0, 0.07, 0.9, 0.07); ga.rotation.z = -0.7;
    const V = ['#5aa83a', '#6cbc44', '#4a9632', '#82d052']; for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2 + R(); const r = k ? 0.8 + R() * 0.35 : 0; const sc = 0.85 + R() * 0.45; part(g, ICO, V[k % 4], Math.cos(a) * r, k ? 2.8 + (R() - 0.3) * 0.9 : 3.4, Math.sin(a) * r, sc, sc * 0.9, sc); } }
  function vivo(hex) { const c = new T3.Color(hex); const h = {}; c.getHSL(h, T3.SRGBColorSpace); const l = h.l < 0.85 ? Math.min(0.85, h.l * 1.12 + 0.05) : h.l; c.setHSL(h.h, Math.min(1, h.s * 1.35 + 0.06), l, T3.SRGBColorSpace); return '#' + c.getHexString(); }
  const v3 = new T3.Vector3();
  function headOf(c) { c.updateMatrixWorld(true); c.userData.P.head.getWorldPosition(v3); return [v3.x, v3.y + 0.13 * c.scale.y, v3.z]; }

  // ---------- céu: dia e noite ----------
  const skyC = document.createElement('canvas'); skyC.width = 4; skyC.height = 256; const skyX = skyC.getContext('2d'); const skyT = new T3.CanvasTexture(skyC); skyT.colorSpace = T3.SRGBColorSpace;
  const MODES = {
    dia: { sky: ['#4f9fe0', '#dcefff'], hemi: 1.15, sun: 2.6, sunC: '#ffefd2', fog: '#e2eef6', fogN: 50, fogF: 190, ground: '#b8a078', rim: '#ffd8a8' },
    noite: { sky: ['#14205a', '#3a5aa8'], hemi: 0.8, sun: 1.0, sunC: '#9ab8ff', fog: '#26386e', fogN: 24, fogF: 110, ground: '#3a6a5a', rim: '#7a9aff' },
    caverna: { sky: ['#0a0812', '#1a1426'], hemi: 1.0, sun: 0.9, sunC: '#c8b8f0', fog: '#120e1c', fogN: 14, fogF: 60, ground: '#2a2030', rim: '#8a5aff' },
    casa: { sky: ['#140c08', '#140c08'], hemi: 0.75, sun: 0.25, sunC: '#ffb070', fog: '#140c08', fogN: 20, fogF: 60, ground: '#3a2418', rim: '#ff8a3a' } };
  scene.background = skyT; scene.fog = new T3.Fog('#ffffff', 30, 120);
  let modo = 'dia', hora = 8, noiteF = 0;
  function mixC(a, b, u) { const c = new T3.Color(a); c.lerp(new T3.Color(b), clamp(u)); return '#' + c.getHexString(); }
  function fatorNoite(h) { if (h >= 7 && h < 17.5) return 0; if (h >= 19.5 || h < 5) return 1; if (h < 7) return 1 - (h - 5) / 2; return (h - 17.5) / 2; }
  function ceu(dt) { hora += dt * 24 / 600; if (hora >= 24) hora -= 24; if (typeof Q !== 'undefined' && Q.noite) hora = clamp(hora < 12 ? 23.9 : hora, 20.5, 23.9);
    const n = noiteF = fatorNoite(hora); modo = n > 0.5 ? 'noite' : 'dia'; if (dentro) { setMode('casa'); return; } if (zona === 'masmorra') { setMode('caverna'); return; } const D = MODES.dia, N = MODES.noite; const por = n > 0 && n < 1 ? Math.sin(n * Math.PI) : 0;
    setMode({ sky: [mixC(D.sky[0], N.sky[0], n), mixC(mixC(D.sky[1], N.sky[1], n), '#ff9a5a', por * 0.75)], hemi: lerp(D.hemi, N.hemi, n), sun: lerp(D.sun, N.sun, n), sunC: mixC(mixC(D.sunC, N.sunC, n), '#ffa060', por * 0.8), fog: mixC(mixC(D.fog, N.fog, n), '#e8a080', por * 0.5), fogN: lerp(D.fogN, N.fogN, n), fogF: lerp(D.fogF, N.fogF, n), ground: mixC(D.ground, N.ground, n), rim: mixC(D.rim, N.rim, n) }); }
  function setMode(k) { const M = typeof k === 'string' ? MODES[k] : k; const g = skyX.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, M.sky[0]); g.addColorStop(1, M.sky[1]); skyX.fillStyle = g; skyX.fillRect(0, 0, 4, 256); skyT.needsUpdate = true;
    hemi.color.set('#ffffff'); hemi.groundColor.set(M.ground); hemi.intensity = M.hemi; sun.color.set(M.sunC); sun.intensity = M.sun; rim.color.set(M.rim); rim.intensity = 0.5; scene.fog.color.set(M.fog); scene.fog.near = M.fogN; scene.fog.far = M.fogF; }

  // ---------- VILA DE BRUMAFRIA ----------
  const vil = grp(world, 0, 0, 0);
  const snowTex = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#5bbf5b'; x.fillRect(0, 0, w, h); const R = rng(3); for (let i = 0; i < 500; i++) { x.fillStyle = ['#4fae4f', '#6fd06a', '#52b452'][i % 3]; x.beginPath(); x.arc(R() * w, R() * h, 2 + R() * 6, 0, 7); x.fill(); } });
  snowTex.wrapS = snowTex.wrapT = T3.RepeatWrapping; snowTex.repeat.set(50, 50);
  const ground = new T3.Mesh(new T3.PlaneGeometry(400, 400), new T3.MeshToonMaterial({ color: '#ffffff', map: snowTex, gradientMap: GRAD })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; vil.add(ground);
  { const path = new T3.Mesh(new T3.RingGeometry(3.2, 5.2, 48), new T3.MeshToonMaterial({ color: '#f2d48a', gradientMap: GRAD })); path.rotation.x = -Math.PI / 2; path.position.y = 0.01; path.receiveShadow = true; vil.add(path); }
  const COL = []; // colisões: {t:'c', x, z, r} ou {t:'b', x, z, ry, hw, hd}
  const WIN = [], CHIM = [];
  function house(x, z, ry, w, d, col, door) { const g = grp(vil, x, 0, z); g.rotation.y = ry; tb(g, 0, 1.3, 0, w, 2.6, d, col); tb(g, 0, 0.15, 0, w + 0.1, 0.3, d + 0.1, '#7a7480'); [-1, 1].forEach(s => tb(g, s * w / 2, 1.3, d / 2 + 0.01, 0.18, 2.6, 0.06, '#4a3424')); tb(g, 0, 2.55, d / 2 + 0.01, w, 0.16, 0.06, '#4a3424');
    const r = part(g, ROOF, '#4a3a4a', 0, 3.6, 0, w * 0.82, 2.1, d * 0.82); r.rotation.y = Math.PI / 4; const sn = part(g, ROOF, '#ffffff', 0, 3.9, 0, w * 0.6, 1.5, d * 0.6); sn.rotation.y = Math.PI / 4;
    tb(g, w * 0.25, 4.0, -d * 0.1, 0.5, 1.6, 0.5, '#6a5a5a'); CHIM.push([g, w * 0.25, 4.9, -d * 0.1]);
    tb(g, -w * 0.2, 0.75, d / 2 + 0.03, 0.8, 1.5, 0.06, door ? '#7a4a2a' : '#5a3a24'); if (door) part(g, SPH, '#e2c27a', -w * 0.2 + 0.28, 0.8, d / 2 + 0.07, 0.04, 0.04, 0.03, 0, true);
    tb(g, w * 0.22, 1.5, d / 2 + 0.035, 0.7, 0.6, 0.04, '#ffc468', true); tb(g, w * 0.22, 1.5, d / 2 + 0.04, 0.05, 0.6, 0.03, '#4a3424'); tb(g, w * 0.22, 1.5, d / 2 + 0.04, 0.7, 0.05, 0.03, '#4a3424');
    WIN.push(glowSpr(g, w * 0.22, 1.5, d / 2 + 0.3, 2.2, '#ffb050', 0.7)); COL.push({ t: 'b', x, z, ry, hw: w / 2 + 0.05, hd: d / 2 + 0.05 }); g.userData.door = [-w * 0.2, d / 2 + 0.9]; return g; }
  const HOUSES = [[0, -8, 0, 4.5, 4, '#c8b8a0', true], [-7, -5, 0.4, 4, 3.6, '#b8a890'], [7, -5, -0.4, 4, 3.6, '#c8b090'], [-12, 2, 0.9, 3.6, 3.4, '#a89880'], [12, 2, -0.9, 3.6, 3.4, '#c0b8a8'], [-5, -16, 0.2, 4, 3.6, '#b0a088'], [6, -17, -0.2, 4.2, 3.6, '#c8b8a0'], [-16, -10, 0.7, 3.6, 3.4, '#b8a890'], [17, -11, -0.7, 3.6, 3.4, '#a89880']];
  const casas = HOUSES.map(h => house(...h)); const casaFamilia = casas[0];
  // pinheiros nevados
  { const R = rng(801); for (let i = 0; i < 90; i++) { const a = R() * Math.PI * 2, r = 31 + R() * 52; const x = Math.cos(a) * r, z = Math.sin(a) * r - 6; if (Math.hypot(x, z + 62) < 14 || Math.hypot(x + 14, z - 11) < 4 || Math.hypot(x - 48, z + 50) < 23) continue; const g = grp(vil, x, 0, z); const s = 0.8 + R() * 0.8; g.scale.setScalar(s);
      if (!VISUAL_BLOCOS) arvoreFolhas(g, R); else { tb(g, 0, 0.5, 0, 0.35, 1, 0.35, '#5a3a24'); for (let j = 0; j < 3; j++) { part(g, CONE, '#2a5a3a', 0, 1.6 + j * 1.0, 0, 1.4 - j * 0.35, 1.6, 1.4 - j * 0.35); part(g, CONE, '#ffffff', 0, 2.1 + j * 1.0, 0, 0.6 - j * 0.15, 0.6, 0.6 - j * 0.15); } } COL.push({ t: 'c', x, z, r: 0.45 * s }); } }
  // poço no meio da vila
  { const w = grp(vil, 0, 0, 0); part(w, CYL, '#8a8a94', 0, 0.45, 0, 0.9, 0.9, 0.9); part(w, CYL, '#1a2a4a', 0, 0.91, 0, 0.7, 0.02, 0.7); [-1, 1].forEach(s => tb(w, s * 0.8, 1.6, 0, 0.12, 1.6, 0.12, '#5a3a24')); part(w, ROOF, '#4a3a4a', 0, 2.7, 0, 1.2, 0.8, 1.2).rotation.y = Math.PI / 4; tb(w, 0, 2.2, 0, 1.7, 0.08, 0.08, '#5a3a24'); part(w, CYL, '#7a5a3a', 0.2, 1.7, 0, 0.12, 0.25, 0.12); COL.push({ t: 'c', x: 0, z: 0, r: 1.0 }); }
  // cerca, lenha e barris pra dar vida
  { for (let i = -6; i <= 6; i++) { tb(vil, i * 1.1, 0.45, 9, 0.12, 0.9, 0.12, '#6a4a2a'); } tb(vil, 0, 0.7, 9, 14.4, 0.08, 0.06, '#6a4a2a'); tb(vil, 0, 0.35, 9, 14.4, 0.08, 0.06, '#6a4a2a'); COL.push({ t: 'b', x: 0, z: 9, ry: 0, hw: 7.3, hd: 0.15 });
    [[3.2, -5.4], [-3.4, -5.6]].forEach(([x, z]) => { const g = grp(vil, x, 0, z); for (let k = 0; k < 5; k++) { const l = part(g, CYL, '#8a5a3a', 0, 0.12 + Math.floor(k / 3) * 0.22, (k % 3 - 1) * 0.22 + (k > 2 ? 0.11 : 0), 0.11, 0.9, 0.11); l.rotation.z = Math.PI / 2; } part(g, CYL, '#ffffff', 0, 0.48, 0, 0.5, 0.06, 0.4); COL.push({ t: 'c', x, z, r: 0.55 }); });
    [[8.5, -1.5], [-8.6, -1.2]].forEach(([x, z]) => { part(vil, CYL, '#7a4a2a', x, 0.45, z, 0.35, 0.9, 0.35); part(vil, TOR, '#4a4a54', x, 0.7, z, 0.36, 0.36, 0.3).rotation.x = Math.PI / 2; COL.push({ t: 'c', x, z, r: 0.45 }); }); }
  // ---------- cidade maior: anel de casas novas, feira e caminhos de terra ----------
  const HOUSES2 = [[-14, -18, 0.5, 4, 3.6, '#c0a888'], [14, -19, -0.5, 4.2, 3.8, '#b8a890'], [-20, -4, 1.1, 3.8, 3.4, '#c8b8a0'], [20, 2, -1.2, 4, 3.6, '#a89880'], [-9, 14, 2.6, 3.6, 3.4, '#c8b090'], [10, 15, 3.4, 4, 3.6, '#b0a088'], [-19, -14, 0.8, 3.8, 3.4, '#b8a890'], [19, -13, -0.8, 3.8, 3.4, '#c0b8a8']];
  HOUSES2.forEach(h => house(...h));
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => { const caminho = new T3.Mesh(new T3.PlaneGeometry(3, 40), new T3.MeshToonMaterial({ color: '#e8c88a', gradientMap: GRAD })); caminho.rotation.x = -Math.PI / 2; caminho.rotation.z = -a; caminho.position.set(Math.sin(a) * 24, 0.012, -5 + Math.cos(a) * 24); caminho.receiveShadow = true; vil.add(caminho); });
  // barracas de feira perto do portão leste
  [[17, -1, 0.4], [19, -8, -0.3], [14, -6, 1.2]].forEach(([x, z, ry]) => { const g = grp(vil, x, 0, z); g.rotation.y = ry; tb(g, 0, 0.45, 0, 1.6, 0.9, 1, '#8a5a34'); tb(g, 0, 1.9, 0, 2, 0.12, 1.4, '#c84a4a'); [-0.8, 0.8].forEach(s => tb(g, s, 1.2, -0.5, 0.1, 1.6, 0.1, '#6a4024')); part(g, SPH, '#e8a030', -0.4, 1.0, 0, 0.16, 0.14, 0.16); part(g, SPH, '#7ab84a', 0.1, 1.0, 0.1, 0.15, 0.13, 0.15); part(g, SPH, '#c84a3a', 0.5, 1.0, -0.1, 0.15, 0.13, 0.15); COL.push({ t: 'c', x, z, r: 1.0 }); });
  // ---------- muralha de pedra com neve, 4 portões e torres ----------
  const MW = { x: 0, z: -5, r: 26 };
  { const N = 44, seg = 2 * Math.PI * MW.r / N + 0.15; const gates = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2; if (gates.some(g0 => Math.abs(Math.atan2(Math.sin(a - g0), Math.cos(a - g0))) < 0.14)) continue; const x = MW.x + Math.sin(a) * MW.r, z = MW.z + Math.cos(a) * MW.r; const g = grp(vil, x, 0, z); g.rotation.y = a; tb(g, 0, 1.5, 0, seg, 3, 1.2, '#8a8a94'); tb(g, 0, 3.1, 0, seg, 0.35, 1.4, '#ffffff'); for (let k = -1; k <= 1; k++) tb(g, k * seg * 0.33, 3.45, 0, seg * 0.2, 0.5, 1.1, '#8a8a94'); COL.push({ t: 'b', x, z, ry: a, hw: seg / 2, hd: 0.7 }); }
    gates.forEach(g0 => { [-1, 1].forEach(s => { const a = g0 + s * 0.17; const x = MW.x + Math.sin(a) * MW.r, z = MW.z + Math.cos(a) * MW.r; const g = grp(vil, x, 0, z); part(g, CYL, '#7a7a88', 0, 2.2, 0, 1.1, 4.4, 1.1); part(g, CYL, '#ffffff', 0, 4.5, 0, 1.25, 0.3, 1.25); part(g, CONE, '#4a3a4a', 0, 5.3, 0, 1.3, 1.4, 1.3); part(g, CYL, '#3a2a1a', 0, 3.2, 0, 0.12, 0.5, 0.12); glowSpr(g, 0, 3.6, 0, 2.6, '#ffa040', 0.8); tb(g, 0, 6.3, 0, 0.08, 1.2, 0.08, '#5a3a24'); tb(g, 0.45, 6.6, 0, 0.9, 0.5, 0.04, '#c84a4a'); COL.push({ t: 'c', x, z, r: 1.2 }); }); }); }
  const moon = grp(world, -30, 40, -90); part(moon, SPH, '#fff6dc', 0, 0, 0, 6, 6, 6, 0, true); glowSpr(moon, 0, 0, -1, 40, '#c8d8ff', 0.6);
  const sunBall = grp(world, 40, 50, -100); part(sunBall, SPH, '#fff2c0', 0, 0, 0, 5, 5, 5, 0, true); glowSpr(sunBall, 0, 0, -1, 30, '#ffe0a0', 0.7);
  const nuvens = []; { const R = rng(5); for (let i = 0; i < 12; i++) { const c = grp(world, (R() - 0.5) * 240, 30 + R() * 12, -40 - R() * 120); for (let k = 0; k < 4; k++) part(c, SPH, '#ffffff', k * 2.6 - 4, R(), 0, 2.6, 1.3, 1.8, 0, true); nuvens.push(c); } }
  const neve = particles(world, 520, '#ffffff', 0.05), fumaca = particles(world, 90, '#c8c8d4', 0.35);

  // ---------- DENTRO DA CASA (x=500) ----------
  const IX = 500; const casa = grp(world, IX, 0, 0);
  { tb(casa, 0, -0.05, 0, 10, 0.1, 10, '#7a5a3a'); for (let i = 0; i < 10; i++) tb(casa, -4.5 + i, 0.005, 0, 0.04, 0.02, 10, '#5a3a24');
    tb(casa, 0, 2, -5, 10, 4, 0.2, '#b89a78'); tb(casa, 0, 2, 5, 10, 4, 0.2, '#b89a78'); tb(casa, -5, 2, 0, 0.2, 4, 10, '#a88a68'); tb(casa, 5, 2, 0, 0.2, 4, 10, '#a88a68'); tb(casa, 0, 4.05, 0, 10.4, 0.1, 10.4, '#6a4a2a');
    for (let i = 0; i < 5; i++) tb(casa, -4 + i * 2, 3.6, 0, 0.25, 0.25, 10, '#5a3a24');
    tb(casa, -1, 0.9, 4.88, 1.2, 1.8, 0.06, '#5a3a24'); part(casa, SPH, '#e2c27a', -0.55, 0.95, 4.82, 0.05, 0.05, 0.03, 0, true);
    tb(casa, 2.5, 2.2, 4.88, 1.2, 0.9, 0.05, '#2a3a6a', true); tb(casa, -4.88, 2.2, -1.5, 0.05, 0.9, 1.2, '#2a3a6a', true);
    // mesa com pão
    tb(casa, -2.4, 0.75, -1.2, 1.8, 0.1, 1.1, '#8a5a34'); [[-0.8, -0.45], [0.8, -0.45], [-0.8, 0.45], [0.8, 0.45]].forEach(([a, b]) => tb(casa, -2.4 + a, 0.37, -1.2 + b, 0.1, 0.74, 0.1, '#6a4024'));
    part(casa, SPH, '#d8a050', -2.4, 0.9, -1.2, 0.28, 0.14, 0.18); [-0.12, 0, 0.12].forEach(o => tb(casa, -2.4 + o, 1.02, -1.2, 0.03, 0.02, 0.2, '#b8803a')); part(casa, CYL, '#f4f0e8', -1.8, 0.82, -1.0, 0.16, 0.04, 0.16);
    [[-3.6, -1.2], [-1.2, -1.2]].forEach(([x, z]) => { tb(casa, x, 0.45, z, 0.45, 0.06, 0.45, '#7a4a2a'); tb(casa, x, 0.22, z, 0.06, 0.45, 0.06, '#6a4024'); });
    // berço
    const crib = grp(casa, -2.6, 0, -3.8); tb(crib, 0, 0.55, 0, 1.2, 0.5, 0.7, '#8a5a3a'); tb(crib, 0, 0.8, 0, 1.1, 0.06, 0.6, '#f4f0ff'); for (let i = 0; i < 6; i++) tb(crib, -0.5 + i * 0.2, 1.0, 0.33, 0.04, 0.4, 0.04, '#8a5a3a'); part(crib, SPH, '#c8905a', 0.3, 0.95, 0, 0.12, 0.12, 0.12);
    // cama e tapete
    tb(casa, 3.4, 0.35, -3.6, 1.8, 0.5, 2.4, '#7a4a2a'); tb(casa, 3.4, 0.65, -3.6, 1.7, 0.12, 2.3, '#c84a4a'); tb(casa, 3.4, 0.75, -4.4, 1.2, 0.12, 0.5, '#f4f0e8');
    const tap = new T3.Mesh(new T3.CircleGeometry(1.4, 32), new T3.MeshToonMaterial({ color: '#8a3a3a', gradientMap: GRAD })); tap.rotation.x = -Math.PI / 2; tap.position.set(0.6, 0.02, 0.8); casa.add(tap); }
  const lareira = grp(casa, 2.2, 0, -4.6); tb(lareira, 0, 1.2, 0, 2.2, 2.4, 0.6, '#8a8a94'); tb(lareira, 0, 0.6, 0.2, 1.2, 0.9, 0.4, '#1a1010'); tb(lareira, 0, 2.45, 0.1, 2.5, 0.12, 0.8, '#5a3a24');
  const chamas = [0, 1, 2].map(i => part(lareira, CONE, ['#ffb030', '#ff7a1a', '#ffe070'][i], -0.3 + i * 0.3, 0.45, 0.25, 0.16, 0.5, 0.16, 0, true)); glowSpr(lareira, 0, 0.6, 0.6, 3, '#ff9a3a', 0.9);
  const fogoL = new T3.PointLight(0xff9a4a, 0, 14, 1.2); fogoL.position.set(IX + 2.2, 1.2, -3.6); world.add(fogoL);
  const COLC = [{ t: 'b', x: IX - 2.4, z: -1.2, ry: 0, hw: 1.0, hd: 0.65 }, { t: 'b', x: IX - 2.6, z: -3.8, ry: 0, hw: 0.7, hd: 0.45 }, { t: 'b', x: IX + 3.4, z: -3.6, ry: 0, hw: 1.0, hd: 1.3 }, { t: 'b', x: IX + 2.2, z: -4.6, ry: 0, hw: 1.2, hd: 0.5 }];

  // ---------- PERSONAGENS DO VÍDEO ----------
  const heroi = makeChar({ skin: LEOC.skin, hair: LEOC.hair, hairC: '#1c1a28', hairStyle: 'leo', top: '#8a6a40', top2: '#6a4a2a', pants: '#4a3a2a', shoe: '#3a2a1a', sole: '#2a1a10', iris: LEOC.iris, s: 0.82, ph: 0.6 });
  part(heroi.userData.P.spine, CYL, '#3a2414', 0, 0.06, 0, 0.19, 0.05, 0.14);
  const HMAT = {}; heroi.traverse(o => { if (o.isMesh && o.material && o.material.isMeshToonMaterial) { const k = '#' + o.material.color.getHexString(); if (!HMAT[k]) HMAT[k] = o.material.clone(); o.material = HMAT[k]; } });
  var CLASSES;
  const pai = makeChar({ skin: '#e8a880', hairStyle: 'short', hairC: '#3a2214', top: '#6a4a34', top2: '#4a3424', pants: '#3a3030', shoe: '#2a1a10', iris: '#3a2a1a', s: 1.12, ph: 6.1 });
  { const P = pai.userData.P; part(P.head, SPH, '#3a2214', 0, 0.03, 0.06, 0.13, 0.11, 0.1, 0.04); part(P.spine, BOX, '#3a2a20', 0, 0.25, 0.13, 0.3, 0.4, 0.02); }
  const mae = makeChar({ skin: '#f2b48e', hairStyle: 'long', hairC: '#6a3a1a', top: '#5a7a4a', top2: '#4a6a3a', pants: '#5a7a4a', shoe: '#3a2a1a', iris: '#4a3020', ph: 5.2 });
  part(mae.userData.P.hips, CONE, '#5a7a4a', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03);
  const prof = makeChar({ skin: '#ecc0a0', hairStyle: 'bald', top: '#34348a', top2: '#24246a', pants: '#34348a', shoe: '#22223a', iris: '#4a4a5a', book: true, ph: 2.1 });
  { const P = prof.userData.P; part(P.hips, CONE, '#34348a', 0, -0.42, 0, 0.34, 0.98, 0.34, 0.03); const b = part(P.head, CONE, '#f0f0f0', 0, 0.0, 0.12, 0.09, 0.2, 0.05, 0.04); b.rotation.x = Math.PI; part(P.head, BOX, '#f0f0f0', 0, 0.07, 0.135, 0.12, 0.025, 0.02); tb(P.head, 0, 0.29, 0, 0.32, 0.03, 0.32, '#1a1a3a'); part(P.head, CYL, '#1a1a3a', 0, 0.26, 0, 0.12, 0.06, 0.12); [-1, 1].forEach(s => part(P.head, SPH, '#f0f0f0', s * 0.135, 0.12, -0.02, 0.03, 0.06, 0.05)); }
  const kaela = makeChar({ skin: '#f2c0a0', hairStyle: 'long', hairC: '#c8402a', top: '#8a90a2', top2: '#5a6072', pants: '#4a3030', shoe: '#4a3020', iris: '#2a8a4a', ph: 3.3 });
  { const P = kaela.userData.P; [-1, 1].forEach(s => part(P.spine, SPH, '#6a7082', s * 0.22, 0.52, 0, 0.13, 0.08, 0.13, 0.05)); const sw = grp(P.spine, 0, 0.35, -0.16); sw.rotation.z = 0.7; tb(sw, 0, 0.1, 0, 0.06, 0.9, 0.02, '#d8dce8'); tb(sw, 0, -0.38, 0, 0.22, 0.04, 0.04, '#e2c27a'); tb(sw, 0, -0.48, 0, 0.04, 0.16, 0.04, '#3a2414'); part(P.head, BOX, '#c03a3a', 0.05, 0.05, 0.13, 0.05, 0.008, 0.005); part(P.spine, CYL, '#3a2414', 0, 0.06, 0, 0.19, 0.05, 0.14); }
  const mens = makeChar({ skin: '#c88a5e', hairStyle: 'short', hairC: '#2a1a14', top: '#a82a2a', top2: '#e2c27a', pants: '#2a2a3a', shoe: '#2a2026', iris: '#3a2a1a', ph: 4.4 });
  { const P = mens.userData.P; part(P.head, CYL, '#a82a2a', 0, 0.27, 0, 0.17, 0.03, 0.17); const f = part(P.head, CONE, '#f4f0e0', -0.1, 0.36, -0.05, 0.02, 0.2, 0.02); f.rotation.z = 0.5; part(P.spine, BOX, '#e2c27a', 0, 0.3, 0.125, 0.3, 0.04, 0.02); const sc = grp(P.elR, 0, -0.32, 0.06); const roll = part(sc, CYL, '#f4ead0', 0, 0, 0, 0.035, 0.24, 0.035); roll.rotation.z = Math.PI / 2; part(sc, CYL, '#c02020', 0, 0, 0.03, 0.035, 0.012, 0.035, 0, true).rotation.x = Math.PI / 2; }
  const ely = makeChar({ skin: '#f8dcc8', hairStyle: 'long', hairC: '#f0f0fa', top: '#f6f4fc', top2: '#e2c27a', pants: '#f6f4fc', shoe: '#e2c27a', sole: '#c8a860', iris: '#e8a018', ph: 1.1 });
  { const P = ely.userData.P; const hr = 0.14, hc = '#f0f0fa', gold = '#e2c27a';
    part(P.hips, CONE, '#f6f4fc', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03); const hem = part(P.hips, TOR, gold, 0, -0.9, 0, 0.36, 0.36, 0.5); hem.rotation.x = Math.PI / 2;
    part(P.spine, BOX, gold, 0, 0.3, 0.12, 0.05, 0.42, 0.02); part(P.spine, SPH, '#4ab0ff', 0, 0.48, 0.13, 0.03, 0.03, 0.02, 0, true);
    part(P.head, CAP, hc, 0, -0.16, -0.09, hr * 2.2, hr * 3.0, hr * 1.3, 0.03); [-1, 1].forEach(s => part(P.head, CAP, hc, s * hr * 0.97, -0.02, 0.03, hr * 0.42, hr * 1.9, hr * 0.42, 0.03));
    for (let i = 0; i < 7; i++) { const a = -0.75 + i * 0.25; const c = part(P.head, CONE, gold, Math.sin(a) * hr * 0.95, 0.27 + (i === 3 ? 0.03 : 0), Math.cos(a) * hr * 0.55, 0.014, i === 3 ? 0.09 : 0.05, 0.014, 0, true); c.rotation.z = -a * 0.6; }
    const staff = grp(P.elL, 0, -0.29, 0.03); part(staff, CYL, '#ece0b8', 0, 0.2, 0, 0.018, 1.75, 0.018, 0.05); const ring = part(staff, TOR, gold, 0, 1.08, 0, 0.09, 0.09, 0.09); ring.rotation.x = Math.PI / 2; part(staff, SPH, '#4ab0ff', 0, 1.1, 0, 0.07, 0.095, 0.07, 0, true); P.gemGlow = glowSpr(staff, 0, 1.1, 0, 0.9, '#5ab8ff', 0.9); P.staff = staff; }
  const elyAura = glowSpr(world, 0, 0, 0, 5, '#ffe8a0', 0.45);
  const NPCS = [
    { c: pai, nome: 'Pai', x: 1.6, z: -4.9, ry: 0.3, vozes: ['pai1', 'pai2'], falas: ['Bem-vindo de volta, Leonardo!', 'Você nasceu aqui em Brumafria, numa noite de inverno. Fui eu que te dei esse nome.'] },
    { c: mae, nome: 'Mãe', x: -1.8, z: -5.0, ry: -0.2, vozes: ['mae1', 'mae2'], falas: ['Meu filho! Você chorou uma vez só quando nasceu...', 'E parecia que olhava pras minhas mãos. Até hoje eu lavo elas antes de te abraçar!'] },
    { c: prof, nome: 'Professor', x: -6.5, z: 3.0, ry: 0.8, vozes: ['prof1', 'prof2'], falas: ['A Academia Real quer você, garoto.', 'Com tudo que tem na sua cabeça, você pode mudar o reino inteiro.'], escolhas: () => [{ t: '📚 <b>Rota do Sábio</b><small>Ir pra Academia Real de Valdren</small>', fn: () => irValdren() }, { t: 'Agora não', fn: null }] },
    { c: kaela, nome: 'Kaela', x: 6.4, z: 3.2, ry: -0.8, vozes: ['kae1', 'kae2'], falas: ['Esquece os livros. A Guilda dos Aventureiros precisa de você!', 'Lá fora tem dragão, ouro e aventura. Bora?'] },
    { c: mens, nome: 'Mensageiro do Duque', x: 3.4, z: 6.2, ry: Math.PI - 0.4, vozes: ['mes1', 'mes2'], falas: ['Por ordem do Duque Aldric, você está convocado!', 'Academia, Guilda ou Duque... qual caminho você vai seguir?'] },
    { c: ely, nome: 'Elysia', x: -10, z: -13, ry: 0.6, deusa: true, vozes: ['ely1', 'ely2', 'ely3'], falas: ['Vamos ver o que você faz com o meu mundo, humano.', 'Bênção concedida: Memória do Mundo Antigo.', 'E um pouco de mana. Porque sem isso você morre na primeira semana.'] },
  ];
  NPCS.forEach(n => { n.c.position.set(n.x, 0, n.z); n.c.rotation.y = n.ry; n.ry0 = n.ry; COL.push({ t: 'c', x: n.x, z: n.z, r: 0.45, npc: n }); });
  const OBJS = [{ nome: 'Pão da avó', x: IX - 2.4, z: -1.2, dentro: true, vozes: ['pao1', 'pao2'], falas: ['O pão da avó...', 'Desde que nasceu, você lembra da receita inteirinha. Fórmulas, mapas, máquinas... e esse pão.'] },
    { nome: 'Berço', x: IX - 2.6, z: -3.8, dentro: true, vozes: ['berco'], falas: ['O seu berço. Foi aqui que tudo começou, numa noite de inverno.'] }];
  [heroi, ...NPCS.map(n => n.c)].forEach(c => c.traverse(o => { if (o.isMesh) o.castShadow = true; }));
  const sombra = new T3.Mesh(new T3.CircleGeometry(0.4, 24), new T3.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.2, depthWrite: false })); sombra.rotation.x = -Math.PI / 2; world.add(sombra);

  // ---------- interface ----------
  const $ = id => document.getElementById(id);
  const input = { x: 0, y: 0, run: false, jump: false }; const keys = {};
  window.addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'Space') input.jump = true; if (e.code === 'KeyE') acao(); });
  window.addEventListener('keyup', e => { keys[e.code] = false; });
  const joy = $('joy'), knob = $('knob');
  let joyId = null, joyC = [0, 0], camId = null, camLast = [0, 0];
  let camYaw = 0, camPitch = 0.3, camDist = 5.6;
  function joyMove(px, py) { const R = 60; let dx = px - joyC[0], dy = py - joyC[1]; const d = Math.hypot(dx, dy); if (d > R) { dx *= R / d; dy *= R / d; } knob.style.transform = `translate(${dx}px, ${dy}px)`; input.x = dx / R; input.y = dy / R; }
  function onDown(e) { for (const t of e.changedTouches || [e]) { const id = t.identifier ?? 'm';
      if (t.clientX < window.innerWidth * 0.5 && joyId === null) { joyId = id; joyC = [t.clientX, t.clientY]; joy.style.left = (t.clientX - 70) + 'px'; joy.style.top = (t.clientY - 70) + 'px'; joy.style.bottom = 'auto'; joy.classList.add('on'); joyMove(t.clientX, t.clientY); }
      else if (camId === null) { camId = id; camLast = [t.clientX, t.clientY]; } } }
  function onMove(e) { for (const t of e.changedTouches || [e]) { const id = t.identifier ?? 'm'; if (id === joyId) joyMove(t.clientX, t.clientY);
      else if (id === camId) { camYaw -= (t.clientX - camLast[0]) * 0.008; camPitch = clamp(camPitch + (t.clientY - camLast[1]) * 0.005, 0.05, 1.1); camLast = [t.clientX, t.clientY]; } } if (e.cancelable) e.preventDefault(); }
  function onUp(e) { for (const t of e.changedTouches || [e]) { const id = t.identifier ?? 'm'; if (id === joyId) { joyId = null; input.x = input.y = 0; knob.style.transform = ''; joy.classList.remove('on'); } if (id === camId) camId = null; } }
  cv.addEventListener('touchstart', onDown, { passive: false }); cv.addEventListener('touchmove', onMove, { passive: false }); cv.addEventListener('touchend', onUp); cv.addEventListener('touchcancel', onUp);
  cv.addEventListener('mousedown', onDown); window.addEventListener('mousemove', e => { if (joyId === 'm' || camId === 'm') onMove(e); }); window.addEventListener('mouseup', onUp);
  cv.addEventListener('wheel', e => { camDist = clamp(camDist + e.deltaY * 0.005, 3, 14); }, { passive: true });
  const SEM_CLIQUE = ['atacar', 'pular', 'correr', 'acao', 'fala', 'cena', 'arma'];
  const tapBtn = (el, fn) => { const f0 = fn; fn = () => { if (!el.classList.contains('slot') && !SEM_CLIQUE.includes(el.id)) som('clique', 0.4, 1); f0(); }; el.addEventListener('touchstart', e => { fn(); e.preventDefault(); e.stopPropagation(); }, { passive: false }); el.addEventListener('mousedown', e => { fn(); e.stopPropagation(); }); };
  tapBtn($('pular'), () => { input.jump = true; });
  tapBtn($('correr'), () => { input.run = !input.run; $('correr').classList.toggle('on', input.run); });
  tapBtn($('acao'), () => acao());
  tapBtn($('ciclo'), () => { if (dentro || Q.noite) return; hora = modo === 'dia' ? 18.6 : 5.4; aviso(modo === 'dia' ? 'O sol está se pondo...' : 'Amanhecendo...', '#ffd23c'); });
  tapBtn($('fala'), () => proximaFala()); tapBtn($('cena'), () => proximaCena());

  // ---------- conversa e portas ----------
  let dentro = false, alvo = null, conversa = null;
  function acao() { if (cenaQ) { proximaCena(); return; } if (conversa) { proximaFala(); return; } if (!alvo) return; if (alvo.acao) { alvo.acao(); return; }
    if (alvo.tipo === 'entrar') { som('porta', 0.8); dentro = true; heroi.position.set(IX - 1, 0, 3.6); facing = Math.PI; camYaw = 0; mostrarLugar('Casa da família'); return; }
    if (alvo.tipo === 'sair') { som('porta', 0.8); dentro = false; const d = casaFamilia.localToWorld(new T3.Vector3(casaFamilia.userData.door[0], 0, casaFamilia.userData.door[1] + 0.4)); heroi.position.set(d.x, 0, d.z); facing = 0; camYaw = Math.PI; mostrarLugar('Vila de Brumafria'); return; }
    falar(alvo); }

  // ---------- SONS: efeitos e ambiente (ElevenLabs) ----------
  let AC = null; const SFX = {}, SFX_T = {}; const SFX_VOL = 0.75;
  function acAudio() { if (AC === null) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = false; } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function carregaSom(n) { if (!SFX[n]) { const a = acAudio(); SFX[n] = !a ? Promise.resolve(null) : fetch('sons/' + n + '.mp3').then(r => r.ok ? r.arrayBuffer() : null).then(b => b ? new Promise((ok, no) => a.decodeAudioData(b, ok, no)) : null).catch(() => null); } return SFX[n]; }
  function som(n, vol, tom, gap) { if (!n) return; const a = acAudio(); if (!a) return; const t = a.currentTime; if (SFX_T[n] != null && t - SFX_T[n] < (gap == null ? 0.06 : gap)) return; SFX_T[n] = t;
    carregaSom(n).then(buf => { if (!buf) return; const s = a.createBufferSource(); s.buffer = buf; s.playbackRate.value = tom || (0.94 + Math.random() * 0.12); const g = a.createGain(); g.gain.value = (vol == null ? 1 : vol) * SFX_VOL; s.connect(g); g.connect(a.destination); s.start(); }); }
  function somEm(n, pos, vol, gap) { const d = Math.hypot(pos.x - heroi.position.x, pos.z - heroi.position.z); if (d > 30) return; som(n, (vol == null ? 1 : vol) * Math.max(0.15, 1 - d / 30), null, gap); }
  const AMB = { amb_caverna: null, amb_vila: null, amb_floresta: null, amb_cidade: null, amb_noite: null, amb_fogo: null }; let ambOk = false;
  function ambienteLiga() { const a = acAudio(); if (!a || ambOk) return; ambOk = true; Object.keys(AMB).forEach(n => carregaSom(n).then(buf => { if (!buf) return; const s = a.createBufferSource(); s.buffer = buf; s.loop = true; const g = a.createGain(); g.gain.value = 0; s.connect(g); g.connect(a.destination); s.start(); AMB[n] = g; })); }
  ['touchstart', 'mousedown', 'keydown'].forEach(ev => window.addEventListener(ev, () => { acAudio(); ambienteLiga(); }, { passive: true }));
  function ambienteFrame(dt, p) { const fora = !dentro, vila = zona === 'vila' && fora, df = typeof GBX !== 'undefined' ? Math.hypot(p.x - GBX, p.z - GBZ) : 99, nt = typeof noiteF !== 'undefined' ? noiteF : 0;
    const alvoV = { amb_caverna: zona === 'masmorra' ? 0.6 : 0, amb_vila: vila ? 0.35 * clamp((df - 20) / 10) * (1 - nt * 0.7) : 0, amb_floresta: vila ? 0.5 * clamp((32 - df) / 12) : 0, amb_cidade: zona === 'valdren' && fora ? 0.4 * (1 - nt * 0.6) : 0, amb_noite: fora && zona !== 'masmorra' ? 0.4 * nt : 0, amb_fogo: dentro ? 0.5 : vila ? 0.6 * clamp((9 - df) / 6) : 0 };
    Object.keys(AMB).forEach(n => { const g = AMB[n]; if (!g) return; g.gain.value += (alvoV[n] * SFX_VOL - g.gain.value) * clamp(dt * 1.5); }); }
  const SOM_PODER = { sabao: 'bolhas', salto: 'impulso', ferver: 'vapor', remedio: 'cura', polvora: 'explosao', dardo: 'dardo', clarao: 'luz', impulso: 'impulso', chama: 'chama', gelo: 'gelo', ima: 'ima', raio: 'raio',
    sismico: 'tremor', danca: 'espada', meteoro: 'explosao', rajada: 'dardo', muralha: 'escudo', runa: 'espada', tufao: 'vento', carregado: 'raio', drenar: 'magia', furia: 'modo', investida: 'impulso', grito: 'tremor', passo: 'impulso', veneno: 'bolhas', tempestade: 'raio', nova: 'luz', orbe: 'magia', teleporte: 'magia', chuva: 'dardo', congelante: 'gelo', floresta: 'cura', provocar: 'tremor', escudada: 'acerto', fortaleza: 'escudo', marca: 'magia', espiral: 'vento', espelho: 'escudo', bumerangue: 'golpe', esmagar: 'tremor', pele: 'escudo', granada: 'explosao', tripla: 'tiro', recuo: 'impulso', maldicao: 'magia', lanca: 'dardo', pacto: 'magia',
    escudo: 'escudo', vento: 'vento', planar: 'vento', luz: 'luz', memoria: 'magia' };
  const SOM_GRITO = { aranha: 'aranha', esqueleto: 'esqueleto', cogumelo: 'gosma', gosma: 'gosma', troll: 'troll', espectro: 'espectro', dragao: 'dragao', lobo: 'lobo', javali: 'javali', goblin: 'goblin', rato: 'rato', golem: 'golem', morcego: 'morcego' };
  const SOM_ATQ = { aranha: 'aranha', esqueleto: 'espada', cogumelo: 'bolhas', gosma: 'gosma', troll: 'golem_soco', espectro: 'espectro', dragao: 'chama', lobo: 'lobo', javali: 'javali', goblin: 'goblin_ataque', rato: 'rato', golem: 'golem_soco', morcego: 'morcego' };
  const SOM_MORTE = { aranha: 'aranha', esqueleto: 'esqueleto', cogumelo: 'gosma', gosma: 'gosma', troll: 'troll', espectro: 'espectro', dragao: 'dragao_morte', lobo: 'lobo_morte', javali: 'javali_morte', goblin: 'goblin_morte', rato: 'rato', golem: 'golem_morte', morcego: 'morcego_morte' };
  let voz = null; function calaVoz() { if (voz) { voz.pause(); voz = null; } }
  function tocaVoz(id) { calaVoz(); if (!id) return; voz = new Audio('vozes/' + id + '.mp3'); voz.play().catch(() => {}); }
  function falaAtual() { const q = conversa.quem, f = q.falas[conversa.i]; return typeof f === 'string' ? { t: f, n: q.nome, v: q.vozes && q.vozes[conversa.i] } : { t: f.t, n: f.n || q.nome, v: f.v }; }
  function mostrarFala() { const q = conversa.quem, f = falaAtual(); tocaVoz(f.v); $('fala-nome').textContent = f.n; $('fala-txt').textContent = f.t; $('fala').hidden = false; const ult = conversa.i >= q.falas.length - 1; const esc = ult && q.escolhas && q.escolhas();
    const box = $('fala-esc'); box.innerHTML = ''; box.hidden = !esc; $('fala-mais').textContent = esc ? 'escolha:' : ult ? 'toque pra fechar ✕' : 'toque pra continuar ▸';
    if (esc) esc.forEach(e => { const b = document.createElement('button'); b.className = 'esc'; b.innerHTML = e.t; tapBtn(b, () => { conversa = null; $('fala').hidden = true; calaVoz(); if (e.fn) setTimeout(e.fn, 50); }); box.appendChild(b); }); }
  function proximaFala() { if (!conversa) return; const q = conversa.quem; if (conversa.i >= q.falas.length - 1 && q.escolhas && q.escolhas()) return; conversa.i++; if (conversa.i >= q.falas.length) { conversa = null; $('fala').hidden = true; calaVoz(); if (q.fim) q.fim(); } else mostrarFala(); }
  function falar(quem) { if (quem && quem.nome && typeof ganha === 'function') setTimeout(() => ganha('npc:' + quem.nome, 1, 'conheceu ' + quem.nome), 50); conversa = { quem, i: 0 }; som('fala', 0.5, 1); mostrarFala(); }
  // cena: tela escura com o narrador
  let cenaQ = null; function cena(lista, fim) { cenaQ = { lista, i: 0, fim }; $('cena').hidden = false; mostrarCena(); }
  function mostrarCena() { const c = cenaQ.lista[cenaQ.i]; $('cena-quem').textContent = c.n || ''; $('cena-quem').hidden = !c.n; $('cena-txt').textContent = c.t; tocaVoz(c.v); $('cena-txt').classList.remove('in'); void $('cena-txt').offsetWidth; $('cena-txt').classList.add('in'); }
  function proximaCena() { if (!cenaQ) return; cenaQ.i++; if (cenaQ.i >= cenaQ.lista.length) { const f = cenaQ.fim; cenaQ = null; $('cena').hidden = true; calaVoz(); if (f) f(); } else mostrarCena(); }
  let lugarT = null; function mostrarLugar(s) { const el = $('lugar'); el.textContent = s; el.classList.add('on'); clearTimeout(lugarT); lugarT = setTimeout(() => el.classList.remove('on'), 2600); }

  // ---------- colisão ----------
  function colide(p, lista) { const r = 0.32; for (const o of lista) {
      if (o.t === 'c') { const dx = p.x - o.x, dz = p.z - o.z, d = Math.hypot(dx, dz), m = o.r + r; if (d < m && d > 1e-4) { p.x = o.x + dx / d * m; p.z = o.z + dz / d * m; } }
      else { const c = Math.cos(-o.ry), s = Math.sin(-o.ry); let lx = (p.x - o.x) * c + (p.z - o.z) * s, lz = -(p.x - o.x) * s + (p.z - o.z) * c; const px = o.hw + r - Math.abs(lx), pz = o.hd + r - Math.abs(lz);
        if (px > 0 && pz > 0) { if (px < pz) lx += Math.sign(lx) * px; else lz += Math.sign(lz) * pz; p.x = o.x + lx * c - lz * s; p.z = o.z + lx * s + lz * c; } } } }

  // ---------- PODERES (a bênção da Elysia no vídeo) ----------
  // Memória do Mundo Antigo: ele lembra de tudo (fórmulas, máquinas, receitas) + "um pouco de mana"
  let mana = 100; let MANA_MAX = 100;
  // tipo 'liga' = liga/desliga (custo por segundo) · 'uso' = gasta uma vez
  const PODERES = [
    { id: 'memoria', nome: 'Memória', icone: '🧠', tipo: 'liga', custo: 0, fixo: true, desc: 'Memória do Mundo Antigo: você enxerga o que a ciência sabe sobre tudo em volta.' },
    { id: 'luz', nome: 'Luz', icone: '✨', tipo: 'liga', custo: 7, fixo: true, desc: 'Um pouco de mana vira uma bola de luz que te segue. Gasta mana enquanto está ligada.' },
    // ramo Ciência
    { id: 'sabao', ramo: 'ciencia', nivel: 0, preco: 0, nome: 'Sabão', icone: '🫧', tipo: 'uso', custo: 20, desc: '"Num mundo sem sabão, quem sabe fazer sabão vale mais que um dragão."' },
    { id: 'ferver', ramo: 'ciencia', nivel: 1, preco: 1, nome: 'Ferver', icone: '♨️', tipo: 'uso', custo: 15, desc: 'Esquenta a água com mana até 100 °C. Vapor sobe e os germes morrem.' },
    { id: 'remedio', ramo: 'ciencia', nivel: 2, preco: 2, nome: 'Remédio', icone: '🌿', tipo: 'uso', custo: 25, desc: 'Soro caseiro: água fervida, sal e açúcar. Cura quem está doente perto de você.' },
    { id: 'polvora', ramo: 'ciencia', nivel: 3, preco: 3, nome: 'Pólvora', icone: '💥', tipo: 'uso', custo: 35, desc: 'Salitre + carvão + enxofre. Uma explosão na sua frente. Cuidado!' },
    // ramo Mana
    { id: 'escudo', ramo: 'mana', nivel: 1, preco: 1, nome: 'Escudo', icone: '🛡️', tipo: 'liga', custo: 5, desc: 'Uma bolha de mana em volta do corpo. Gasta mana enquanto está ligada.' },
    { id: 'dardo', ramo: 'mana', nivel: 2, preco: 2, nome: 'Dardo', icone: '🔆', tipo: 'uso', custo: 12, desc: 'Um dardo de luz disparado pra frente.' },
    { id: 'clarao', ramo: 'mana', nivel: 3, preco: 3, nome: 'Clarão', icone: '⚡', tipo: 'uso', custo: 40, desc: 'Toda a mana sai de uma vez num clarão que cega quem está perto.' },
    // ramo Corpo
    { id: 'salto', ramo: 'corpo', nivel: 0, preco: 0, nome: 'Salto', icone: '⬆️', tipo: 'uso', custo: 25, desc: 'A mana empurra seus pés: um pulo bem mais alto.' },
    { id: 'vento', ramo: 'corpo', nivel: 1, preco: 1, nome: 'Vento', icone: '💨', tipo: 'liga', custo: 4, desc: 'Vento nas costas: você corre bem mais rápido. Gasta mana enquanto está ligado.' },
    { id: 'planar', ramo: 'corpo', nivel: 2, preco: 2, nome: 'Planar', icone: '🪶', tipo: 'liga', custo: 3, desc: 'Ligado, você cai devagar depois de pular. Combina com o Salto!' },
    { id: 'impulso', ramo: 'corpo', nivel: 3, preco: 3, nome: 'Impulso', icone: '➡️', tipo: 'uso', custo: 18, desc: 'Um empurrão de mana que te joga uns metros pra frente.' },
    // ramo Física
    { id: 'chama', ramo: 'fisica', nivel: 1, preco: 1, nome: 'Chama', icone: '🔥', tipo: 'uso', custo: 15, desc: 'Óleo + faísca: um jato de fogo curto na sua frente. Queima por 3 segundos.' },
    { id: 'gelo', ramo: 'fisica', nivel: 2, preco: 2, nome: 'Gelo', icone: '❄️', tipo: 'uso', custo: 20, desc: 'Tira o calor do bicho mais perto e congela ele por 3 segundos.' },
    { id: 'ima', ramo: 'fisica', nivel: 3, preco: 2, nome: 'Ímã', icone: '🧲', tipo: 'uso', custo: 15, desc: 'Magnetismo: puxa moedas e itens de longe e deixa os bichos perto desprotegidos (+50% de dano).' },
    { id: 'raio', ramo: 'fisica', nivel: 4, preco: 3, nome: 'Raio', icone: '🌩️', tipo: 'uso', custo: 30, desc: 'Eletricidade de verdade: o raio pula de um inimigo pro outro (até 4).' },
  ];
  const PW = {}; PODERES.forEach(pw => PW[pw.id] = pw);
  const RAMOS = [{ id: 'ciencia', nome: 'Ciência', icone: '🧪', cor: '#4ab870' }, { id: 'mana', nome: 'Mana', icone: '✨', cor: '#3a8ae8' }, { id: 'corpo', nome: 'Corpo', icone: '🏃', cor: '#e88a2a' }, { id: 'fisica', nome: 'Física', icone: '⚛️', cor: '#b84ad8' }];
  const NSLOTS = 8;
  // progresso da árvore (salvo no aparelho)
  let AR = { pts: 3, tem: ['sabao', 'salto'], barra: ['memoria', 'luz', null, 'sabao', 'salto', null, null, null], ganhos: [] };
  try { const g = JSON.parse(localStorage.getItem('aetherion-arvore') || 'null'); if (g && g.barra && g.barra.length === NSLOTS) AR = Object.assign(AR, g); } catch (e) {}
  AR.barra[0] = 'memoria'; AR.barra[1] = 'luz';
  function salvaAR() { try { localStorage.setItem('aetherion-arvore', JSON.stringify(AR)); } catch (e) {} if (window.CONTA) CONTA.salvar(); }
  function ganha(chave, n, msg) { if (AR.ganhos.includes(chave)) return; AR.ganhos.push(chave); const tp = chave.split(':')[0]; const xx = { npc: 10, saber: 5, passo: 40, final: 150 }[tp]; if (xx) setTimeout(() => ganhaXp(xx, true), 0); AR.pts += n; salvaAR(); atualizaPts(); som('ponto', 0.6, 1); aviso('🌳 +' + n + ' ponto' + (n > 1 ? 's' : '') + ' de habilidade' + (msg ? ' · ' + msg : '') + '!', '#7ad87a'); }
  function atualizaPts() { const b = $('arv-pts'); b.textContent = AR.pts; b.hidden = AR.pts <= 0; }
  const ativo = {}; let saltoPronto = false;
  const barra = $('poderes'); const SLOTS = [];
  for (let i = 0; i < NSLOTS; i++) { const b = document.createElement('button'); b.className = 'slot' + (i < 3 ? ' fixo' : ''); tapBtn(b, () => { const id = AR.barra[i]; if (id) usarPoder(PW[id]); else abrirArvore(); }); barra.appendChild(b); SLOTS.push(b); }
  function montaBarra() { PODERES.forEach(pw => pw.el = null);
    SLOTS.forEach((b, i) => { const pw = AR.barra[i] && PW[AR.barra[i]]; b.classList.toggle('vazio', !pw); b.classList.remove('on', 'falta');
      if (pw) { pw.el = b; b.innerHTML = `<span class="ic">${pw.icone}</span><span class="nm">${pw.nome}</span><span class="tc">${i + 1}</span>${i < 3 ? '<span class="cad">🔒</span>' : ''}${nivelHab(pw.id) > 1 ? '<span class="lv">' + nivelHab(pw.id) + '</span>' : ''}`; b.classList.toggle('on', pw.tipo === 'liga' && !!ativo[pw.id]); }
      else b.innerHTML = `<span class="ic">＋</span><span class="tc">${i + 1}</span>`; }); }
  function marca(pw, cls, on) { if (pw.el) pw.el.classList.toggle(cls, on); }
  window.addEventListener('keydown', e => { const n = parseInt(e.key); if (n >= 1 && n <= NSLOTS) { const id = AR.barra[n - 1]; if (id) usarPoder(PW[id]); } if (e.code === 'KeyT') abrirArvore(); });
  let avisoT = null; function aviso(t, cor) { const el = $('aviso'); el.textContent = t; el.style.borderColor = cor || '#5ab8ff'; el.classList.add('on'); clearTimeout(avisoT); avisoT = setTimeout(() => el.classList.remove('on'), 3200); }
  // efeitos dos poderes novos
  let tremor = 0, dashT = 0, dashVel = 22, dashAng = 0;
  function frente(d) { const p = heroi.position; return [p.x + Math.sin(facing) * d, p.y, p.z + Math.cos(facing) * d]; }
  const HAB_MAX = 5; AR.nivHab = AR.nivHab || {}; let potAtual = 1;
  function nivelHab(id) { return AR.nivHab[id] || 1; }
  function potHab(id) { return 1 + (nivelHab(id) - 1) * 0.2; }
  function custoDe(pw) { return Math.max(1, Math.round(pw.custo * (1 - (nivelHab(pw.id) - 1) * 0.06))); }
  function usarPoder(pw) { if (conversa || cenaQ) return; potAtual = potHab(pw.id); try { usarPoder0(pw); } finally { potAtual = 1; } }
  function usarPoder0(pw) {
    if (pw.tipo === 'liga') { ativo[pw.id] = !ativo[pw.id]; if (ativo[pw.id]) som(SOM_PODER[pw.id] || 'magia', 0.7); else som('clique', 0.5, 1); if (ativo[pw.id] && pw.custo && mana < 5) { ativo[pw.id] = false; aviso('Sem mana! Espera ela voltar.', '#ff6a6a'); return; } marca(pw, 'on', !!ativo[pw.id]); if (ativo[pw.id]) aviso(pw.desc, pw.id === 'memoria' ? '#ffd23c' : '#5ab8ff'); else if (pw.id !== 'memoria') aviso(pw.nome + ' desligado.', '#8a9aba'); return; }
    if (mana < custoDe(pw)) { aviso('Sem mana! Precisa de ' + custoDe(pw) + '.', '#ff6a6a'); marca(pw, 'erro', true); setTimeout(() => marca(pw, 'erro', false), 400); return; }
    mana -= custoDe(pw); som(SOM_PODER[pw.id] || 'magia', 0.85); marca(pw, 'on', true); setTimeout(() => marca(pw, 'on', false), 500);
    const p = heroi.position;
    if (pw.id === 'sabao') { bolhasT = 0; aviso('Sabão: gordura + cinza (soda). Mãos limpas = menos doença na vila!', '#9ad8ff'); }
    if (pw.id === 'salto') { saltoPronto = true; if (noChao) input.jump = true; aviso(pw.desc, '#5ab8ff'); }
    if (pw.id === 'ferver') { fx('vapor', [p.x, p.y, p.z], 2.6); aviso('Água a 100 °C: o vapor sobe e as bactérias morrem. É assim que se vence a cólera.', '#ffb04a'); }
    if (pw.id === 'remedio') { fx('cura', [p.x, p.y, p.z], 2); let n = 0; if (vida < VIDA_MAX && zona !== 'valdren') { aviso('Soro caseiro: +40 de vida.', '#7ad87a'); }
      if (zona === 'valdren' && typeof doentes !== 'undefined') doentes.forEach(c => { if (c.visible && !c.userData.curado && Math.hypot(c.userData.pos[0] - p.x, c.userData.pos[1] - p.z) < 4.5) { c.userData.curado = true; n++; fx('cura', [c.userData.pos[0], 0, c.userData.pos[1]], 2); } });
      aviso(n ? (n === 1 ? 'Um doente se levantou! Soro: água fervida, sal e açúcar.' : n + ' doentes se levantaram!') : 'Soro pronto: água fervida + 1 colher de sal + 8 de açúcar. Chegue perto de um doente.', '#7ad87a'); }
    if (pw.id === 'polvora') { const f = frente(3.2); fx('fogo', f, 1.6); fx('fumo', f, 2.4); tremor = 0.6; flash('rgba(255,170,60,.55)'); aviso('BUM! Salitre + carvão + enxofre. Isso muda as guerras deste mundo...', '#ff8a3a'); }
    if (pw.id === 'dardo') { const d = glowSpr(world, p.x, p.y + 1.3, p.z, 0.9, '#bfe8ff', 1); dardos.push({ s: d, t: 0, dx: Math.sin(facing), dz: Math.cos(facing), dano: 25 * atkMult() }); }
    if (pw.id === 'clarao') { flash('rgba(255,255,255,.95)'); fx('luz', [p.x, p.y, p.z], 1.2); tremor = 0.25; aviso('CLARÃO! Quem estava olhando ficou vendo estrelas.', '#fff3a0'); }
    if (pw.id === 'impulso') { dashT = 0.28; dashVel = 22; dashAng = facing; fx('vento', [p.x, p.y, p.z], 0.8); }
    combatePoder(pw.id); classePoder(pw.id); classePoder2(pw.id); }
  function flash(cor) { const f = $('flash'); f.style.transition = 'none'; f.style.background = cor; f.style.opacity = 1; requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transition = 'opacity .9s'; f.style.opacity = 0; })); }
  // partículas de efeito (vapor, cura, fogo, fumaça, luz, vento)
  const FXC = { vapor: ['#ffffff', 0.14, 'sobe'], cura: ['#7aff9a', 0.07, 'espiral'], fogo: ['#ff8a2a', 0.16, 'explode'], fumo: ['#6a625a', 0.3, 'nuvem'], luz: ['#fff6c0', 0.12, 'explode'], vento: ['#dff2ff', 0.06, 'anel'], chama: ['#ff8a2a', 0.14, 'jato'], gelo: ['#bff2ff', 0.1, 'explode'] };
  const FX = {}; Object.keys(FXC).forEach(k => { const im = particles(world, 60, FXC[k][0], FXC[k][1]); im.visible = false; FX[k] = { im, t: 99, dur: 1, pos: [0, 0, 0] }; });
  function fx(k, pos, dur, dir) { const f = FX[k]; f.t = 0; f.dur = dur; f.pos = pos.slice(); f.dir = dir || 0; }
  function fxFrame(dt) { Object.keys(FX).forEach(k => { const f = FX[k]; f.t += dt; f.im.visible = f.t < f.dur; if (!f.im.visible) return; const u = f.t / f.dur, tipo = FXC[k][2], sz = FXC[k][1];
    f.im.userData.place((i, d) => { const R = rng(i * 7 + k.length * 31); const a = R() * 6.28, rr = R(); const [x, y, z] = f.pos; let s = sz;
      if (tipo === 'sobe') { const kk = clamp(u * 1.4 - rr * 0.4); if (kk <= 0) return false; d.position.set(x + Math.cos(a) * (0.4 + rr * 1.2), y + 0.3 + kk * 3, z + Math.sin(a) * (0.4 + rr * 1.2)); s = sz * (0.6 + kk * 2) * (1 - kk); }
      else if (tipo === 'espiral') { const aa = a + u * 8; d.position.set(x + Math.cos(aa) * (0.8 + rr * 0.4), y + u * 2.4 + rr * 0.6, z + Math.sin(aa) * (0.8 + rr * 0.4)); s = sz * (1 - u); }
      else if (tipo === 'explode') { const e = eOut(u), el = (R() - 0.3) * 1.6; d.position.set(x + Math.cos(a) * e * (1.5 + rr * 2.5), y + 0.8 + el * e * 2, z + Math.sin(a) * e * (1.5 + rr * 2.5)); s = sz * (1.6 - u * 1.4); }
      else if (tipo === 'nuvem') { d.position.set(x + Math.cos(a) * (0.5 + rr * 2) * eOut(u), y + 0.8 + u * 2.5 * rr, z + Math.sin(a) * (0.5 + rr * 2) * eOut(u)); s = sz * (0.5 + u * 1.5) * (1 - u * 0.8); }
      else if (tipo === 'jato') { const kk = clamp(u * 1.6 - rr * 0.5); if (kk <= 0) return false; const ab = f.dir + (R() - 0.5) * 0.9 * kk; const dd = 0.6 + kk * 4.2; d.position.set(x + Math.sin(ab) * dd, y + 1.1 + (R() - 0.5) * kk * 1.2 + kk * 0.4, z + Math.cos(ab) * dd); s = sz * (0.6 + kk * 2.2) * (1 - kk * 0.7); }
      else { d.position.set(x + Math.cos(a) * u * 2.2, y + 0.3 + rr * 1.4, z + Math.sin(a) * u * 2.2); s = sz * (1 - u); }
      d.scale.setScalar(Math.max(s, 0.0001)); }); }); }
  const dardos = [];
  function dardosFrame(dt) { for (let i = dardos.length - 1; i >= 0; i--) { const d = dardos[i]; d.t += dt; d.s.position.x += d.dx * 24 * dt; d.s.position.z += d.dz * 24 * dt; d.s.material.opacity = 1 - d.t; const ef = acertaFera(d.s.position, 0.6); if (ef) { dano(ef, d.dano || 25, 'luz'); d.t = 1; } if (d.t > 0.9) { fx('luz', [d.s.position.x, d.s.position.y - 0.8, d.s.position.z], 0.5); world.remove(d.s); dardos.splice(i, 1); } } }
  // escudo e vento
  const escudo = new T3.Mesh(new T3.SphereGeometry(1.15, 24, 16), new T3.MeshBasicMaterial({ color: '#7ac8ff', transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending })); escudo.visible = false; world.add(escudo);
  const rastro = particles(world, 30, '#e8f6ff', 0.04); rastro.visible = false;

  // ---------- ÁRVORE DE HABILIDADES ----------
  let selArv = null;
  function prereq(pw) { if (!pw.ramo || pw.nivel <= 1) return true; return PODERES.some(o => o.ramo === pw.ramo && o.cls === pw.cls && o.nivel === pw.nivel - 1 && AR.tem.includes(o.id)); }
  function abrirArvore() { if (conversa || cenaQ) return; selArv = selArv || null; desenhaArvore(); $('arvore').hidden = false; }
  function desenhaArvore() { const col = $('arv-ramos'); col.innerHTML = ''; $('arv-pts-txt').textContent = AR.pts + (AR.pts === 1 ? ' ponto' : ' pontos');
    const cl0 = CLASSES && CLASSES[AR.classe]; (cl0 ? [{ id: 'classe', nome: cl0.nome.replace(' Arcano', ''), icone: cl0.icone, cor: cl0.cor }, ...RAMOS] : RAMOS).forEach(r => { const c = document.createElement('div'); c.className = 'ramo'; c.style.setProperty('--rc', r.cor); c.innerHTML = `<div class="rt">${r.icone} ${r.nome}</div>`;
      PODERES.filter(pw => pw.ramo === r.id && (!pw.cls || pw.cls === AR.classe)).sort((a, b) => a.nivel - b.nivel).forEach((pw, j) => { if (j) { const l = document.createElement('div'); l.className = 'liga' + (AR.tem.includes(pw.id) ? ' ok' : ''); c.appendChild(l); }
        const tem = AR.tem.includes(pw.id), pode = !tem && prereq(pw) && AR.pts >= pw.preco, trava = !tem && !prereq(pw); const naBarra = AR.barra.indexOf(pw.id);
        const b = document.createElement('button'); b.className = 'no' + (tem ? ' tem' : pode ? ' pode' : trava ? ' trava' : ' caro') + (selArv === pw.id ? ' sel' : '');
        b.innerHTML = `<span class="ic">${trava ? '🔒' : pw.icone}</span><span class="nm">${pw.nome}</span><span class="pr">${tem ? '★'.repeat(nivelHab(pw.id)) + (naBarra >= 0 ? ' · ' + (naBarra + 1) : '') : pw.preco + ' pt'}</span>`;
        tapBtn(b, () => { selArv = pw.id; desenhaArvore(); }); c.appendChild(b); });
      col.appendChild(c); });
    // painel do detalhe
    const det = $('arv-det'); const pw = selArv && PW[selArv]; if (!pw) { det.innerHTML = '<p class="vz">Toque numa habilidade pra ver o que ela faz. Ganhe pontos derrotando bichos, falando com as pessoas, lendo as dicas da 🧠 Memória e avançando nas missões.</p>'; return; }
    const tem = AR.tem.includes(pw.id); const custo = pw.tipo === 'liga' ? custoDe(pw) + ' mana/s' : custoDe(pw) + ' mana'; const nh = nivelHab(pw.id);
    det.innerHTML = `<div class="dt"><span class="ic">${pw.icone}</span><div><b>${pw.nome}${tem ? ' <em class="nvh">Nv ' + nh + '/' + HAB_MAX + '</em>' : ''}</b><small>${pw.tipo === 'liga' ? 'Liga/desliga' : 'Uso rápido'} · ${custo}${tem && nh > 1 ? ' · força ' + Math.round(potHab(pw.id) * 100) + '%' : ''}</small></div></div><p>${pw.desc}</p><div id="arv-evo"></div><div id="arv-acoes"></div>`;
    if (tem) { const ev = $('arv-evo'); if (nh >= HAB_MAX) ev.innerHTML = '<div class="evo max">★★★★★ Nível máximo!</div>'; else { const pr = nh; const b = document.createElement('button'); b.className = 'ab evo'; b.disabled = AR.pts < pr; b.innerHTML = `⬆️ Evoluir pro Nv ${nh + 1} (${pr} pt)<small>+20% de força${pw.tipo === 'liga' ? '' : ', mais duração'} e -6% de mana</small>`; if (AR.pts >= pr) tapBtn(b, () => { AR.pts -= pr; AR.nivHab[pw.id] = nh + 1; salvaAR(); atualizaPts(); montaBarra(); aviso(pw.icone + ' ' + pw.nome + ' evoluiu pro nível ' + (nh + 1) + '!', '#ffd23c'); fx('luz', [heroi.position.x, 0, heroi.position.z], 0.6); desenhaArvore(); }); ev.appendChild(b); } }
    const ac = $('arv-acoes');
    if (!tem) { const b = document.createElement('button'); b.className = 'ab'; const ok = prereq(pw) && AR.pts >= pw.preco; b.disabled = !ok; b.textContent = !prereq(pw) ? '🔒 Aprenda a anterior primeiro' : AR.pts < pw.preco ? `Faltam ${pw.preco - AR.pts} ponto(s)` : `Aprender (${pw.preco} pt)`;
      if (ok) tapBtn(b, () => { AR.pts -= pw.preco; AR.tem.push(pw.id); const v = AR.barra.indexOf(null, 3); if (v >= 3) AR.barra[v] = pw.id; salvaAR(); atualizaPts(); montaBarra(); aviso('Nova habilidade: ' + pw.icone + ' ' + pw.nome + (v >= 3 ? ' (slot ' + (v + 1) + ')' : ''), '#7ad87a'); desenhaArvore(); });
      ac.appendChild(b); return; }
    { const fx0 = AR.barra.indexOf(pw.id); if (fx0 >= 0 && fx0 < 3) { const t = document.createElement('div'); t.className = 'qs'; t.textContent = '🔒 Habilidade fixa da classe (slot ' + (fx0 + 1) + ').'; ac.appendChild(t); return; } }
    const t = document.createElement('div'); t.className = 'qs'; t.textContent = 'Colocar no slot (troca o que estiver lá):'; ac.appendChild(t);
    const row = document.createElement('div'); row.className = 'slotsel';
    for (let i = 3; i < NSLOTS; i++) { const o = AR.barra[i] && PW[AR.barra[i]]; const b = document.createElement('button'); b.className = 'ss' + (AR.barra[i] === pw.id ? ' aqui' : ''); b.innerHTML = `<small>${i + 1}</small>${o ? o.icone : '＋'}`;
      tapBtn(b, () => { if (AR.barra[i] === pw.id) return; const j = AR.barra.indexOf(pw.id); const velho = AR.barra[i]; if (velho && ativo[velho]) ativo[velho] = false; if (j >= 3) AR.barra[j] = null; AR.barra[i] = pw.id; salvaAR(); montaBarra(); aviso(pw.icone + ' ' + pw.nome + ' no slot ' + (i + 1) + (velho && velho !== pw.id ? ' (saiu ' + PW[velho].nome + ')' : ''), '#7ad87a'); desenhaArvore(); }); row.appendChild(b); }
    ac.appendChild(row);
    if (AR.barra.indexOf(pw.id) >= 3) { const b = document.createElement('button'); b.className = 'ab tira'; b.textContent = 'Tirar da barra'; tapBtn(b, () => { const j = AR.barra.indexOf(pw.id); AR.barra[j] = null; ativo[pw.id] = false; salvaAR(); montaBarra(); desenhaArvore(); }); ac.appendChild(b); } }
  tapBtn($('arv-btn'), abrirArvore); tapBtn($('arv-fecha'), () => { $('arvore').hidden = true; });
  montaBarra(); atualizaPts();
  // fórmulas girando em volta da cabeça
  const FORM = ['E=mc²', 'H₂O', 'F=m·a', 'NaOH', 'π', 'Fe', 'CO₂', 'V=R·I', '∫dx', 'PÃO'].map((t, i) => { const tx = canvasTex(256, 96, (x, w, h) => { x.font = '800 60px system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#e8f8ff'; x.shadowColor = i % 2 ? '#ffc83a' : '#5ad0ff'; x.shadowBlur = 18; x.fillText(t, w / 2, h / 2); });
    const m = new T3.Sprite(new T3.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending })); m.scale.set(0.5, 0.19, 1); m.visible = false; world.add(m); return m; });
  const memAura = glowSpr(world, 0, 0, 0, 1.6, '#ffd890', 0); 
  // dicas da Memória espalhadas pela vila (aparecem só com o poder ligado)
  const SABER = [
    { x: 0, y: 3.2, z: 0, t: 'Poço: ferva a água a 100 °C e os germes morrem.' },
    { x: 3.2, y: 1.4, z: -5.4, t: 'Lenha seca queima melhor e solta menos fumaça.' },
    { x: -3.4, y: 1.4, z: -5.6, t: 'Madeira guarda energia do Sol (fotossíntese).' },
    { x: 8.5, y: 1.5, z: -1.5, t: 'Barril de sal: o sal conserva a carne tirando a água.' },
    { x: -8.6, y: 1.5, z: -1.2, t: 'Ferro enferruja com água e ar: óleo protege.' },
    { x: 0, y: 5.6, z: -8, t: 'Telhado inclinado: a neve escorrega e não quebra a casa.' },
    { x: 7, y: 5.2, z: -5, t: 'Chaminé: o ar quente sobe e puxa a fumaça pra fora.' },
    { x: -12, y: 4.6, z: 2, t: 'Neve derretida não é água limpa. Só depois de ferver.' },
    { x: 0, y: 2.4, z: 9, t: 'Cerca de madeira: madeira tratada com piche dura anos.' },
    { x: IX - 2.4, y: 1.5, z: -1.2, t: 'Pão: farinha + água + fermento. O fermento solta CO₂ e a massa cresce.', dentro: true },
    { x: IX + 2.2, y: 2.9, z: -4.6, t: 'Fogo precisa de 3 coisas: combustível, calor e oxigênio.', dentro: true },
    { x: IX - 2.6, y: 1.5, z: -3.8, t: 'Bebês precisam de mãos lavadas. Sabão salva vidas.', dentro: true },
  ];
  const camadaSaber = $('saber'); SABER.forEach(sb => { const d = document.createElement('div'); d.className = 'tag'; d.textContent = sb.t; camadaSaber.appendChild(d); sb.el = d; });
  // bola de luz de mana
  const orbe = grp(world); part(orbe, SPH, '#bfe6ff', 0, 0, 0, 0.12, 0.12, 0.12, 0, true); const orbeG = glowSpr(orbe, 0, 0, 0, 2.2, '#7ac8ff', 0.9); const orbeL = new T3.PointLight(0x9ad0ff, 0, 16, 1.4); orbe.add(orbeL); orbe.visible = false;
  // bolhas de sabão e explosão do salto
  const bolhas = particles(world, 70, '#cfefff', 0.08); let bolhasT = 99; const burst = particles(world, 40, '#7ac8ff', 0.06); let burstT = 99, burstP = [0, 0, 0];
  const vtmp = new T3.Vector3();
  function poderesFrame(dt, p) {
    let gasto = 0; PODERES.forEach(pw => { if (pw.tipo === 'liga' && ativo[pw.id]) { if (!pw.el) ativo[pw.id] = false; else gasto += custoDe(pw); } });
    mana = clamp(mana + dt * 6 - dt * gasto, 0, MANA_MAX); if (mana <= 0 && gasto > 0) { PODERES.forEach(pw => { if (pw.tipo === 'liga' && pw.custo && ativo[pw.id]) { ativo[pw.id] = false; marca(pw, 'on', false); } }); aviso('A mana acabou. Os poderes desligaram.', '#ff6a6a'); }
    $('mana-fill').style.width = (mana / MANA_MAX * 100).toFixed(1) + '%'; $('mana-num').textContent = Math.round(mana);
    PODERES.forEach(pw => marca(pw, 'falta', pw.tipo === 'uso' && mana < custoDe(pw)));
    fxFrame(dt); dardosFrame(dt);
    escudo.visible = !!ativo.escudo; if (escudo.visible) { escudo.position.set(p.x, p.y + 0.95, p.z); escudo.scale.setScalar(1 + Math.sin(gT * 5) * 0.04); escudo.material.opacity = 0.18 + Math.sin(gT * 3) * 0.05; }
    rastro.visible = !!ativo.vento && vel > 1; if (rastro.visible) rastro.userData.place((i, d) => { const R = rng(i + 777); const k = ((gT * 2.2 + R()) % 1); d.position.set(p.x - Math.sin(facing) * k * 2 + (R() - .5) * 0.8, p.y + 0.2 + R() * 1.4, p.z - Math.cos(facing) * k * 2 + (R() - .5) * 0.8); d.scale.set(0.03, 0.03, 0.35 * (1 - k)); d.rotation.y = facing; });
    // pontos: dicas da Memória lidas, passos da missão, finais
    SABER.forEach((sb, i) => { if (sb.el.style.display === 'block' && !sb.lido) { sb.lido = true; ganha('saber:' + sb.t.slice(0, 24), 1, 'aprendeu algo'); } });
    if (Q.passo >= 1) ganha('passo:' + Math.floor(Q.passo), 2, 'missão avançou'); finais.forEach(f => ganha('final:' + f, 3, 'final ' + f));
    // memória
    const h = headOf(heroi); FORM.forEach((m, i) => { m.visible = !!ativo.memoria; if (!m.visible) return; const a = i / FORM.length * Math.PI * 2 + gT * 0.6; m.position.set(h[0] + Math.cos(a) * 0.75, h[1] + 0.15 + Math.sin(a * 2 + i) * 0.18, h[2] + Math.sin(a) * 0.75); });
    memAura.position.set(h[0], h[1], h[2]); memAura.material.opacity = ativo.memoria ? 0.35 + Math.sin(gT * 3) * 0.1 : 0;
    const vis = []; SABER.forEach(sb => { sb.el.style.display = 'none'; if (!ativo.memoria || !!sb.dentro !== dentro) return; vtmp.set(sb.x, sb.y, sb.z); const dist = vtmp.distanceTo(p); vtmp.project(cam);
      if (vtmp.z > 1 || dist > 11 || Math.abs(vtmp.x) > 0.95 || Math.abs(vtmp.y) > 0.95) return; vis.push({ sb, dist, x: vtmp.x, y: vtmp.y }); });
    vis.sort((a, b) => a.dist - b.dist).slice(0, 2).forEach(v => { const el = v.sb.el; el.style.display = 'block'; el.style.left = ((v.x * 0.5 + 0.5) * window.innerWidth) + 'px'; el.style.top = ((-v.y * 0.5 + 0.5) * window.innerHeight) + 'px'; el.style.opacity = clamp(1.5 - v.dist / 10).toFixed(2); });
    // luz
    orbe.visible = !!ativo.luz; if (orbe.visible) { orbe.position.set(p.x + Math.sin(gT * 1.3) * 0.7, p.y + 2.1 + Math.sin(gT * 2.1) * 0.15, p.z + Math.cos(gT * 1.3) * 0.7); orbeL.intensity = modo === 'noite' || dentro ? 6 : 2.5; orbeG.material.opacity = 0.8 + Math.sin(gT * 6) * 0.15; }
    // sabão
    bolhasT += dt; bolhas.visible = bolhasT < 4; if (bolhas.visible) bolhas.userData.place((i, d) => { const R = rng(i + 400); const k = clamp((bolhasT - R() * 0.8) / 3.2); if (k <= 0 || k >= 1) return false; const a = R() * 6.28; d.position.set(p.x + Math.cos(a) * (0.3 + k * 1.6), p.y + 0.6 + k * 2.6 + R(), p.z + Math.sin(a) * (0.3 + k * 1.6)); d.scale.setScalar((0.05 + R() * 0.08) * (1 - k * 0.3)); });
    // salto
    burstT += dt; burst.visible = burstT < 0.8; if (burst.visible) burst.userData.place((i, d) => { const a = i / 40 * 6.28; const k = burstT / 0.8; d.position.set(burstP[0] + Math.cos(a) * k * 1.6, burstP[1] + 0.1 + k * 0.3, burstP[2] + Math.sin(a) * k * 1.6); d.scale.setScalar(0.07 * (1 - k)); });
  }

  // ===================== ROTA DO SÁBIO — VALDREN (x=1000) =====================
  const VX = 1000; const val = grp(world, VX, 0, 0); const COLV = []; let zona = 'vila';
  const pedraTex = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#8a7e70'; x.fillRect(0, 0, w, h); const R = rng(11); for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { x.fillStyle = ['#968a7a', '#7e7264', '#a09484', '#887c6e'][(r * 3 + c * 5) % 4]; x.beginPath(); x.roundRect(c * 32 + 2 + (r % 2) * 16 - 8, r * 32 + 2, 28, 28, 6); x.fill(); } });
  pedraTex.wrapS = pedraTex.wrapT = T3.RepeatWrapping; pedraTex.repeat.set(30, 30);
  { const g = new T3.Mesh(new T3.PlaneGeometry(160, 160), new T3.MeshToonMaterial({ color: '#ffffff', map: pedraTex, gradientMap: GRAD })); g.rotation.x = -Math.PI / 2; g.receiveShadow = true; val.add(g); }
  const vb = (x, z, ry, hw, hd) => COLV.push({ t: 'b', x: VX + x, z, ry, hw, hd }), vc = (x, z, r) => COLV.push({ t: 'c', x: VX + x, z, r });
  // muralha
  for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; const x = Math.sin(a) * 46, z = Math.cos(a) * 46; if (Math.abs(x) < 4 && z > 0) continue; const m = tb(val, x, 3, z, 7.6, 6, 1.6, '#9a9088'); m.rotation.y = a; for (let k = -1; k <= 1; k++) { const mm = tb(val, x + Math.cos(a) * k * 2.4, 6.4, z - Math.sin(a) * k * 2.4, 1.2, 0.8, 1.7, '#8a8078'); mm.rotation.y = a; } vb(x, z, a, 3.8, 0.9); if (i % 5 === 0) { part(val, CYL, '#8a8078', x, 4.5, z, 2.2, 9, 2.2); part(val, CONE, '#3a4a7a', x, 10.2, z, 2.8, 2.6, 2.8); } }
  [-4.4, 4.4].forEach(x => { part(val, CYL, '#8a8078', x, 5, 46, 2.2, 10, 2.2); part(val, CONE, '#3a4a7a', x, 11.2, 46, 2.8, 2.6, 2.8); vc(x, 46, 2.3); tb(val, x * 1.6, 4, 47, 1, 0.6, 0.1, '#c83a3a'); });
  tb(val, 0, 7.6, 46, 9, 1.4, 1.6, '#9a9088');
  // Academia Real
  const acad = grp(val, 0, 0, -22); { tb(acad, 0, 5, 0, 20, 10, 9, '#a8a4b4'); tb(acad, 0, 0.3, 4.9, 8, 0.6, 1.2, '#8a8698'); tb(acad, 0, 0.6, 5.6, 6, 0.3, 0.8, '#8a8698');
    const tel = part(acad, ROOF, '#2a3a6a', 0, 12, 0, 13, 4, 6.6); tel.rotation.y = Math.PI / 4; tel.scale.set(14.5, 4, 6.4);
    [[-10, 4.5], [10, 4.5], [-10, -4.5], [10, -4.5]].forEach(([x, z]) => { part(acad, CYL, '#b4b0c0', x, 7, z, 2, 14, 2); part(acad, CONE, '#2a3a6a', x, 15.6, z, 2.6, 3.4, 2.6); tb(acad, x, 18, z, 0.08, 1.2, 0.06, '#e2c27a'); tb(acad, x + 0.4, 18.3, z, 0.8, 0.5, 0.05, '#2a5ad8'); });
    part(acad, CYL, '#b4b0c0', 0, 12, 0, 2.4, 6, 2.4); part(acad, CONE, '#2a3a6a', 0, 17.5, 0, 3, 4, 3);
    tb(acad, 0, 2.2, 4.55, 3, 4.4, 0.2, '#5a3a24'); part(acad, CYL, '#5a3a24', 0, 4.4, 4.55, 1.5, 0.2, 1.5).rotation.x = Math.PI / 2;
    for (let i = 0; i < 6; i++) { const x = -8.5 + i * 3.4; if (Math.abs(x) < 2) continue; tb(acad, x, 3, 4.55, 1.2, 2, 0.1, '#3a4a8a', true); tb(acad, x, 7.2, 4.55, 1.2, 2, 0.1, '#3a4a8a', true); }
    const ban = tb(acad, 0, 7.6, 4.62, 2.4, 3, 0.05, '#2a3a8a'); part(acad, BOX, '#e2c27a', 0, 7.8, 4.66, 1.2, 0.9, 0.04); tb(acad, 0, 7.8, 4.68, 0.05, 0.9, 0.04, '#2a3a8a');
    vb(0, -22, 0, 11.2, 5.6); }
  // casas de dois andares (enxaimel)
  const VCASAS = [];
  function casa2(x, z, ry, w, d, cor, teto) { const g = grp(val, x, 0, z); g.rotation.y = ry; tb(g, 0, 1.6, 0, w, 3.2, d, '#7a6a5a'); tb(g, 0, 4.6, 0, w + 0.4, 2.8, d + 0.4, cor); [-1, 0, 1].forEach(k => tb(g, k * w / 2.2, 4.6, d / 2 + 0.21, 0.18, 2.8, 0.06, '#4a3424')); tb(g, 0, 3.3, d / 2 + 0.21, w + 0.4, 0.2, 0.06, '#4a3424'); tb(g, 0, 5.9, d / 2 + 0.21, w + 0.4, 0.2, 0.06, '#4a3424');
    const r = part(g, ROOF, teto, 0, 7.4, 0, (w + 0.6) * 0.75, 2.4, (d + 0.6) * 0.75); r.rotation.y = Math.PI / 4; tb(g, -w * 0.2, 1.0, d / 2 + 0.03, 1, 2, 0.06, '#4a2a18'); tb(g, w * 0.25, 4.6, d / 2 + 0.23, 0.8, 0.8, 0.04, '#ffd88a', true); tb(g, w * 0.25, 1.6, d / 2 + 0.03, 0.8, 0.7, 0.04, '#3a4a6a', true);
    vb(x, z, ry, w / 2 + 0.25, d / 2 + 0.25); VCASAS.push(g); return g; }
  const CORES = ['#e8dcc0', '#d8c8a8', '#e0d0b8', '#c8b898'], TETOS = ['#8a3a2a', '#6a2a24', '#7a4a2a'];
  for (let i = 0; i < 7; i++) { casa2(-30 + i * 9.5, -4, Math.PI, 6, 5, CORES[i % 4], TETOS[i % 3]); }
  for (let i = 0; i < 3; i++) { casa2(-30 + i * 9.5, 18, 0, 6, 5, CORES[(i + 1) % 4], TETOS[(i + 1) % 3]); }
  casa2(-30, 30, 0, 6, 5, CORES[2], TETOS[0]); casa2(-20, 32, 0, 6, 5, CORES[1], TETOS[1]);
  const quarto = casa2(14, -14, -Math.PI / 2, 5, 5, '#d8d0e0', '#2a3a6a'); // o quarto do Leonardo, do lado da Academia
  // esgoto a céu aberto (sem esgoto!)
  const POCAS = []; { const R = rng(41); for (let i = 0; i < 26; i++) { const x = -34 + R() * 64, z = -10 + R() * 40; const m = new T3.Mesh(new T3.CircleGeometry(0.6 + R() * 1.1, 18), new T3.MeshToonMaterial({ color: ['#5a5a2a', '#4a4a24', '#6a5a2a'][i % 3], gradientMap: GRAD })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.015, z); m.scale.y = 0.6 + R() * 0.6; val.add(m); POCAS.push([VX + x, z]); }
    for (let i = 0; i < 14; i++) tb(val, -32 + i * 4.6, 0.02, 9.6, 3.6, 0.04, 0.5, '#4a4a24'); }
  const moscas = particles(world, 160, '#14141a', 0.03), fedor = particles(world, 60, '#9aaa5a', 0.25);
  // praça do mercado e a carroça
  [[-22, 8, '#c83a3a'], [-16, 6, '#3a7ac8'], [-10, 8, '#e8b030'], [-24, 12, '#3a9a5a']].forEach(([x, z, c]) => { tb(val, x, 0.5, z, 2.4, 1, 1.4, '#7a5a3a'); [-1, 1].forEach(s => tb(val, x + s * 1.1, 1.4, z, 0.1, 2.8, 0.1, '#5a3a24')); const t = tb(val, x, 2.9, z, 2.8, 0.1, 1.8, c); t.rotation.x = 0.15; for (let k = 0; k < 4; k++) part(val, SPH, ['#e83a2a', '#ffb030', '#7ac83a', '#f4e0a0'][k], x - 0.8 + k * 0.5, 1.1, z, 0.18, 0.18, 0.18); vb(x, z, 0, 1.3, 0.8); });
  const carroca = grp(val, -16, 0, 12); { tb(carroca, 0, 0.9, 0, 3, 0.25, 1.8, '#8a5a34'); [-1, 1].forEach(s => tb(carroca, 0, 1.25, s * 0.88, 3, 0.5, 0.08, '#7a4a2a')); tb(carroca, 1.48, 1.25, 0, 0.08, 0.5, 1.8, '#7a4a2a'); [[-0.9, 1], [0.9, 1], [-0.9, -1], [0.9, -1]].forEach(([x, z]) => { const r = part(carroca, CYL, '#5a3a24', x, 0.55, z, 0.55, 0.12, 0.55); r.rotation.x = Math.PI / 2; }); tb(carroca, -2.6, 0.7, 0, 2.4, 0.1, 0.1, '#6a4a2a'); vb(-16, 12, 0, 1.6, 1.0); }
  // porto
  { const agua = new T3.Mesh(new T3.PlaneGeometry(40, 90), new T3.MeshToonMaterial({ color: '#3a6a7a', gradientMap: GRAD, transparent: true, opacity: 0.9 })); agua.rotation.x = -Math.PI / 2; agua.position.set(48, 0.03, 0); val.add(agua); vb(48, 0, 0, 19, 45);
    for (let i = 0; i < 4; i++) { tb(val, 30, 0.3, -12 + i * 8, 6, 0.2, 1.6, '#7a5a3a'); for (let k = 0; k < 3; k++) part(val, CYL, '#5a3a24', 27.5 + k * 2.4, 0.1, -11.2 + i * 8, 0.12, 1.2, 0.12); }
    [[36, -8], [37, 6]].forEach(([x, z], i) => { const b = grp(val, x, 0.1, z); tb(b, 0, 0.4, 0, 2, 0.8, 5, '#6a4a2a'); tb(b, 0, 3, 0, 0.12, 5, 0.12, '#5a3a24'); tb(b, 0, 3.2, 0.3, 0.06, 3, 2.4, '#f0e8d8'); });
    [[24, -14], [24, 0], [24, 14]].forEach(([x, z]) => { tb(val, x, 0.6, z, 1.2, 1.2, 1.2, '#8a6a4a'); vb(x, z, 0, 0.6, 0.6); }); }
  const pocoPorto = grp(val, 20, 0, 4); { part(pocoPorto, CYL, '#7a7a84', 0, 0.45, 0, 0.9, 0.9, 0.9); part(pocoPorto, CYL, '#4a5a2a', 0, 0.91, 0, 0.7, 0.02, 0.7); [-1, 1].forEach(s => tb(pocoPorto, s * 0.8, 1.6, 0, 0.12, 1.6, 0.12, '#5a3a24')); part(pocoPorto, ROOF, '#4a3a4a', 0, 2.7, 0, 1.2, 0.8, 1.2).rotation.y = Math.PI / 4; vc(20, 4, 1.0); }
  // gente de Valdren
  const pessoa = (o) => makeChar(Object.assign({ skin: '#e8b090', hairStyle: 'short', hairC: '#3a2a1a', top: '#7a6a5a', top2: '#5a4a3a', pants: '#4a4048', shoe: '#2a2020', iris: '#3a2a1a' }, o));
  const corvel = pessoa({ skin: '#e8c4a8', hairStyle: 'bald', top: '#4a2a6a', top2: '#2a1a4a', pants: '#4a2a6a', iris: '#5a5a7a', s: 1.05, ph: 7.1 });
  { const P = corvel.userData.P; part(P.hips, CONE, '#4a2a6a', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03); const b = part(P.head, CONE, '#f4f4f4', 0, -0.06, 0.12, 0.11, 0.34, 0.06, 0.04); b.rotation.x = Math.PI; part(P.head, CONE, '#3a1a5a', 0, 0.42, -0.02, 0.17, 0.42, 0.17, 0.03).rotation.x = -0.2; part(P.head, CYL, '#3a1a5a', 0, 0.24, 0, 0.24, 0.03, 0.24); const st = grp(P.elR, 0, -0.3, 0.03); part(st, CYL, '#5a3a24', 0, 0.3, 0, 0.022, 1.7, 0.022); part(st, SPH, '#c83aff', 0, 1.18, 0, 0.07, 0.07, 0.07, 0, true); }
  const seraphine = pessoa({ skin: '#f6d6c0', hairStyle: 'long', hairC: '#f0d070', top: '#2a3a7a', top2: '#1a2a5a', pants: '#2a3a7a', shoe: '#3a2a1a', iris: '#3a7ac8', s: 0.92, ph: 8.3 });
  { const P = seraphine.userData.P; part(P.hips, CONE, '#2a3a7a', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03); P.capuz = part(P.head, SPH, '#1a2a5a', 0, 0.06, -0.03, 0.2, 0.22, 0.2, 0.03); part(P.spine, CONE, '#1a2a5a', 0, 0.2, -0.1, 0.32, 1.1, 0.2, 0.03).rotation.x = Math.PI; part(P.head, TOR, '#e2c27a', 0, 0.24, 0, 0.11, 0.11, 0.05, 0, true).rotation.x = Math.PI / 2; }
  const capitao = pessoa({ skin: '#c88a5e', hairStyle: 'short', hairC: '#1a1414', top: '#8a909a', top2: '#5a6070', pants: '#3a3a44', iris: '#2a2a2a', s: 1.1, ph: 9.2 });
  { const P = capitao.userData.P; [-1, 1].forEach(s => part(P.spine, SPH, '#7a808a', s * 0.22, 0.52, 0, 0.13, 0.08, 0.13, 0.05)); part(P.head, SPH, '#8a909a', 0, 0.16, 0, 0.16, 0.11, 0.16, 0.03); tb(P.spine, 0, 0.3, 0.13, 0.22, 0.26, 0.02, '#2a3a8a'); const lan = grp(P.elR, 0, -0.3, 0.03); part(lan, CYL, '#6a4a2a', 0, 0.4, 0, 0.02, 2.2, 0.02); part(lan, CONE, '#c8c8d0', 0, 1.6, 0, 0.06, 0.25, 0.06); }
  const alunos = [0, 1, 2].map(i => { const a = pessoa({ top: '#2a3a8a', top2: '#1a2a6a', pants: '#2a3a8a', hairC: ['#3a2a1a', '#c8802a', '#1a1414'][i], hairStyle: i === 1 ? 'long' : 'short', s: 0.8, ph: 10 + i }); part(a.userData.P.hips, CONE, '#2a3a8a', 0, -0.36, 0, 0.3, 0.85, 0.3, 0.03); return a; });
  const doentes = [[16, 6, 0.4], [18, 9, -0.6], [23, 7, 1.2], [21, 11, 2.0], [15, 2, -1.4]].map(([x, z, r], i) => { const d = pessoa({ skin: '#b8c0a0', top: ['#6a5a4a', '#5a6a7a', '#7a5a5a'][i % 3], ph: 12 + i }); d.userData.pos = [VX + x, z, r]; return d; });
  const multidao = [0, 1, 2, 3, 4, 5, 6, 7].map(i => pessoa({ top: ['#8a4a3a', '#4a6a8a', '#6a7a4a', '#8a7a4a', '#5a4a7a'][i % 5], hairC: ['#3a2a1a', '#1a1414', '#8a5a2a'][i % 3], hairStyle: i % 3 === 1 ? 'long' : 'short', s: 0.95 + (i % 3) * 0.05, ph: 20 + i }));
  const NPCV = [
    { c: corvel, nome: 'Arquimago Corvel', x: VX + 3.2, z: -11, ry: -0.6 },
    { c: capitao, nome: 'Capitão da guarda', x: VX + 7, z: -10, ry: -0.4, vozes: ['cap01'], falas: ['Valdren está fedendo mais que nunca, garoto. Vai fazer o quê, rezar?'] },
    { c: alunos[0], nome: 'Aluno', x: VX - 2.6, z: -9.6, ry: 0.4, vozes: ['alu01'], falas: ['Bichinhos invisíveis? Ha! Essa é boa.'] },
    { c: alunos[1], nome: 'Aluna', x: VX - 1.4, z: -8.4, ry: 0.2, vozes: ['alu02'], falas: ['O Arquimago diz que doença é castigo dos deuses.'] },
    { c: alunos[2], nome: 'Aluno', x: VX - 3.6, z: -8.2, ry: 0.6, vozes: ['alu03'], falas: ['Você é mesmo de Brumafria? Lá ninguém fica doente, é verdade?'] },
    { c: multidao[0], nome: 'Vendedora', x: VX - 21, z: 9.8, ry: 0.4, vozes: ['ven01'], falas: ['Que cheiro... é sempre assim aqui na capital.'] },
    { c: multidao[1], nome: 'Pescador', x: VX + 26, z: -4, ry: -1.2, vozes: ['pes01'], falas: ['A água do poço do porto anda com um gosto estranho...'] },
  ];
  const mesa = grp(val, 0, 0, -12.5); let tigelas;
  { tb(mesa, 0, 0.8, 0, 2, 0.1, 1, '#7a4a2a'); [[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].forEach(([a, b]) => tb(mesa, a, 0.4, b, 0.1, 0.8, 0.1, '#5a3a24')); const fog = grp(mesa, 0.6, 0.85, 0); tb(fog, 0, 0.08, 0, 0.4, 0.16, 0.4, '#3a3a40'); mesa.userData.chama = part(fog, CONE, '#ff8a2a', 0, 0.26, 0, 0.1, 0.22, 0.1, 0, true);
    tigelas = [-0.5, 0.6].map((x, i) => { const g = grp(mesa, x, 0.86, 0); part(g, SPH, '#e8e0d0', 0, 0.06, 0, 0.22, 0.12, 0.22); g.userData.caldo = part(g, CYL, '#d8a050', 0, 0.12, 0, 0.18, 0.01, 0.18, 0, true); return g; }); vb(0, -12.5, 0, 1.1, 0.6); }
  const vapor = particles(world, 30, '#ffffff', 0.06);
  // seta de objetivo
  const seta = grp(world); { const m = part(seta, CONE, '#ffd23c', 0, 0, 0, 0.25, 0.5, 0.25, 0.02, true); m.rotation.x = Math.PI; glowSpr(seta, 0, 0.1, 0, 1.2, '#ffd23c', 0.6); } seta.visible = false;
  [corvel, seraphine, capitao, ...alunos, ...doentes, ...multidao].forEach(c => { c.visible = false; c.traverse(o => { if (o.isMesh) o.castShadow = true; }); });

  // ---------- a missão ----------
  const FINAIS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']; let finais = []; try { finais = JSON.parse(localStorage.getItem('aetherion-finais') || '[]'); } catch (e) { finais = []; }
  const Q = { passo: 0, rota: null, alvoQ: null, noite: false, tigela: 0 };
  function objetivo(t, alvoXZ) { $('obj').hidden = !t; $('obj-txt').textContent = t || ''; Q.alvoQ = alvoXZ || null; }
  const COR_F = (t, v) => ({ n: 'Arquimago Corvel', t, v }), LEO_F = (t, v) => ({ n: 'Leonardo', t, v }), SER_F = (t, v) => ({ n: 'Princesa Seraphine', t, v }), NAR_F = (t, v) => ({ t, v });
  function irValdren() { falar({ nome: 'Professor', falas: [{ t: 'Então venha comigo pra Academia Real, garoto. Valdren espera por você.', v: 'sab25' }], fim: () => {
      cena([NAR_F('Rota do Sábio · A Academia Real', 'nar01'), NAR_F('A Academia ficava na capital, Valdren, uma cidade de cem mil pessoas e nenhum esgoto. O cheiro chegava antes das muralhas.', 'sab01')], () => {
        zona = 'valdren'; dentro = false; modo = 'dia'; heroi.position.set(VX, 0, 40); facing = Math.PI; camYaw = 0; cam.position.set(VX, 3, 46); Q.passo = 1; Q.rota = 'A';
        mostrarLugar('Valdren · a capital'); objetivo('Vá até a Academia Real e fale com o Arquimago Corvel', [VX + 3.2, -11]); }); } }); }
  NPCV[0].falas = [COR_F('Hm? Mais um aluno do interior...', 'cor01')]; 
  function passoCorvel() { if (Q.passo === 1) { falar({ nome: 'Arquimago Corvel', falas: [NAR_F('Nas aulas, Leonardo falou de coisas pequenas demais para ver, que causam doenças. Os professores riram.', 'sab02'), COR_F('Doença é castigo dos deuses, garoto. Ninguém precisa de bichinhos invisíveis pra explicar a vontade divina.', 'sab03'), LEO_F('Então vamos testar. Duas tigelas de caldo: uma eu fervo, a outra fica aberta.', 'sab04')],
        fim: () => { Q.passo = 2; objetivo('Faça o teste: ferva uma das tigelas na mesa', [VX, -12.5]); } }); return true; } return false; }
  function ferver() { Q.tigela = 1; aviso('A tigela da esquerda está fervendo. A outra fica aberta.', '#ffb04a'); setTimeout(() => cena([NAR_F('Uma semana depois...', 'nar02'), NAR_F('Leonardo não discutiu. Ferveu uma tigela e deixou a outra aberta. Em uma semana, uma estava limpa... e a outra fedia. Metade da turma parou de rir.', 'sab05')], () => {
      Q.tigela = 2; falar({ nome: 'Arquimago Corvel', falas: [COR_F('Hmpf... coincidência.', 'sab06')], fim: () => cena([NAR_F('Foi aí que a peste chegou. Começou no bairro do porto: febre, diarreia, morte em três dias.', 'sab07')], () => { Q.passo = 3; objetivo('Investigue o poço do bairro do porto (use a Memória 🧠)', [VX + 20, 4]); }) }); }), 2200); }
  function pocoMemoria() { Q.passo = 3.5; cena([NAR_F('Leonardo sabia o que era. Cólera. Água suja.', 'sab08')], () => { Q.passo = 4; Q.noite = true; hora = 20.5; objetivo('Já é noite. Volte pro seu quarto, do lado da Academia', [VX + 14, -14]); }); }
  function portaQuarto() { Q.passo = 4.5; cena([NAR_F('Naquela noite, uma garota encapuzada bateu na porta do quarto dele. Era a princesa Seraphine, a filha mais nova do rei.', 'sab09')], () => { Q.serOn = true;
      falar({ nome: 'Princesa Seraphine', falas: [SER_F('Dizem que você sabe parar isso. A Igreja diz que é castigo. O que você diz?', 'sab10')], escolhas: () => [{ t: '📢 <b>Contar tudo ao povo</b><small>Ensinar na praça a ferver a água, mesmo que chamem de heresia</small>', fn: rotaA1 }, { t: '🤫 <b>Agir em segredo com a princesa</b><small>Salvar a cidade sem aparecer, usando a autoridade dela</small>', fn: rotaA2 }] }); }); }
  function rotaA1() { Q.passo = 5; Q.sub = 'A1'; Q.noite = false; hora = 7.5; Q.serOn = false; objetivo('De manhã: suba na carroça da praça do mercado e avise o povo', [VX - 16, 12]); aviso('O povo vai se juntar em volta da carroça.', '#ffd23c'); }
  function rotaA2() { Q.sub = 'A2'; falar({ nome: 'Princesa Seraphine', falas: [SER_F('Então escreva. Eu transformo em ordens do rei.', 'sab17')], fim: () => { Q.passo = 5; Q.noite = false; hora = 7.5; Q.serOn = false; objetivo('Leve as ordens da princesa ao capitão da guarda', [VX + 7, -10]); } }); }
  function subirCarroca() { Q.passo = 6; Q.naCarroca = true; heroi.position.set(VX - 16, 1.05, 12); falar({ nome: 'Leonardo', falas: [LEO_F('Fervam a água! Lavem as mãos! Não bebam do rio perto do porto!', 'sab11')], fim: () => cena([
      NAR_F('Leonardo subiu numa carroça na praça do mercado e gritou até perder a voz. No terceiro dia, os inquisidores vieram buscá-lo. Ele foi preso por heresia.', 'sab12'), NAR_F('Mas quem tinha ouvido, tinha fervido a água. E nas ruas onde as pessoas fizeram isso, ninguém mais morreu. Em três semanas, cinco mil pessoas cercaram a prisão gritando o nome dele.', 'sab13'),
      NAR_F('O rei mandou soltá-lo. O Arquimago Corvel, que tinha perdido o próprio filho para a peste, foi o primeiro a se ajoelhar e pedir para aprender.', 'sab14'), NAR_F('Anos depois, Valdren tinha o primeiro hospital de Aetherion, com uma placa na porta: "Lave as mãos antes de entrar."', 'sab15'),
      { n: 'Elysia', t: 'Você não matou nenhum dragão. Mas salvou mais gente do que todos os heróis que eu já mandei, juntos.', v: 'sab16' }], () => { Q.naCarroca = false; heroi.position.y = 0; final('A1', 'O Pai da Medicina', 'Você escolheu a verdade, mesmo com risco. O mundo mudou porque o povo aprendeu.'); }) }); }
  function ordensCapitao() { Q.passo = 6; falar({ nome: 'Capitão da guarda', falas: [{ n: 'Capitão da guarda', t: 'Ordem da princesa? Então fechamos os poços do porto agora mesmo!', v: 'sab24' }], fim: () => cena([
      NAR_F('Leonardo escreveu as instruções. Seraphine as transformou em ordens reais. Os guardas fecharam os poços do porto, distribuíram lenha pra ferver a água e queimaram as roupas dos doentes.', 'sab18'), NAR_F('A peste parou. A Igreja disse que foi um milagre. Leonardo deixou que dissessem.', 'sab19'),
      NAR_F('Uma prensa de tipos móveis apareceu, por acaso, numa oficina da capital. Livros começaram a custar o preço de um pão. Gente comum aprendeu a ler.', 'sab20'), NAR_F('Vinte anos depois, quando Seraphine virou rainha, Valdren tinha escolas em todas as vilas, estradas de pedra e um cometa previsto com três anos de antecedência. Ninguém sabia o nome de Leonardo.', 'sab21'),
      { n: 'Rainha Seraphine', t: 'Você podia ser famoso.', v: 'sab22' }, LEO_F('Famoso morre na fogueira. Eu queria era ver o mundo andar.', 'sab23')], () => final('A2', 'A Revolução Silenciosa', 'Você escolheu mudar o mundo sem aparecer. Ninguém lembra de você, mas todos vivem melhor.')) }); }
  function final(k, nome, nota) { if (!finais.includes(k)) { finais.push(k); try { localStorage.setItem('aetherion-finais', JSON.stringify(finais)); } catch (e) {} if (window.CONTA) CONTA.salvar(); } objetivo(null);
    $('fim-num').textContent = 'Final ' + (FINAIS.indexOf(k) + 1) + ' de 6'; $('fim-nome').textContent = nome; $('fim-nota').textContent = nota; $('fim-selos').innerHTML = FINAIS.map(f => `<span class="selo${finais.includes(f) ? ' on' : ''}"></span>`).join(''); $('fim-cont').textContent = `Finais descobertos: ${finais.length} de 6`; $('fim').hidden = false; }
  tapBtn($('fim-volta'), () => { $('fim').hidden = true; zona = 'vila'; dentro = false; hora = 8; Q.passo = 0; Q.tigela = 0; Q.serOn = false; heroi.position.set(-5.2, 0, 4.4); facing = Math.PI; camYaw = 0; cam.position.set(-5, 3, 10); mostrarLugar('Vila de Brumafria'); });
  tapBtn($('fim-fica'), () => { $('fim').hidden = true; objetivo('Explore Valdren à vontade. Fale com o Professor em Brumafria pra jogar de novo.'); });
  function valdrenFrame(dt, p) {
    const on = zona === 'valdren'; val.visible = on; vil.visible = !on;
    const lista = [...NPCV, ...(Q.serOn ? [{ c: seraphine, nome: 'Princesa Seraphine', x: VX + 11.4, z: -14.6, ry: -Math.PI / 2, falas: [SER_F('Você vai me ajudar ou não?', 'ser01')], ser: true }] : [])];
    [corvel, seraphine, capitao, ...alunos, ...doentes, ...multidao].forEach(c => c.visible = false);
    if (!on) { seta.visible = false; moscas.visible = fedor.visible = vapor.visible = false; return null; }
    let melhor = 2.6, al = null;
    lista.forEach(n => { const c = n.c; c.visible = true; c.position.set(n.x, 0, n.z); if (c.userData.ry == null) c.userData.ry = n.ry; const dx = p.x - n.x, dz = p.z - n.z, d = Math.hypot(dx, dz); const want = d < 5 ? Math.atan2(dx, dz) : n.ry; let a = want - c.userData.ry; while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; c.userData.ry += a * clamp(dt * 4); c.rotation.y = c.userData.ry;
      const fal = conversa && voz && !voz.paused && !voz.ended && falaAtual().n && n.nome && falaAtual().n.split(' ').pop() === n.nome.split(' ').pop();
      pose(c, gT, { mood: n.c === corvel && Q.tigela < 2 ? 'angry' : fal ? 'smile' : 'neutral', talk: fal, look: [0, -0.1], arms: n.c === corvel ? { shR: [-0.3, 0, 0.15], elR: [-0.5, 0, 0] } : undefined });
      if (n.c === corvel) { const st = c.userData.P.elR.children.find(o => o.isGroup); if (st) st.rotation.x = -(c.userData.P.shR.rotation.x + c.userData.P.elR.rotation.x); }
      if (d < melhor) { melhor = d; al = n; } });
    // doentes deitados no porto (depois que a peste chega)
    if (Q.passo >= 3 && !(Q.sub === 'A2' && Q.passo >= 6)) doentes.forEach((c, i) => { const [x, z, r] = c.userData.pos; c.visible = true; if (c.userData.curado) { c.position.set(x, 0, z); c.rotation.set(0, r, 0); pose(c, gT, { mood: 'smile' }); return; } c.position.set(x, 0.15, z); c.rotation.set(-Math.PI / 2, 0, r, 'YXZ'); c.rotation.order = 'YXZ'; c.rotation.y = r; c.rotation.x = -Math.PI / 2; pose(c, gT * 0.3, { mood: 'sad', look: [0, 0] }); });
    // multidão em volta da carroça
    if (Q.sub === 'A1' && Q.passo >= 5) multidao.forEach((c, i) => { if (i < 1) return; const a = i / 8 * Math.PI * 1.6 + 0.4; const x = VX - 16 + Math.cos(a) * 3.6, z = 12 + Math.sin(a) * 3.6 - 0.5; c.visible = true; c.position.set(x, 0, z); c.rotation.set(0, Math.atan2(VX - 16 - x, 12 - z), 0); pose(c, gT, { mood: Q.passo >= 6 ? 'shock' : 'neutral', look: [0, -0.3], arms: Q.passo >= 6 && i % 2 ? { shL: [-2.6, 0, -0.3], elL: [-0.3, 0, 0] } : undefined }); });
    // tigelas
    tigelas[0].userData.caldo.material = gm(Q.tigela === 2 ? '#e8b860' : '#d8a050'); tigelas[1].userData.caldo.material = gm(Q.tigela === 2 ? '#6a7a2a' : '#d8a050'); mesa.userData.chama.visible = Q.tigela === 1; mesa.userData.chama.scale.y = 0.22 * (1 + Math.sin(gT * 18) * 0.2);
    vapor.visible = Q.tigela === 1; if (vapor.visible) vapor.userData.place((i, d) => { const k = (gT * 0.5 + i / 30) % 1; d.position.set(VX - 0.5 + Math.sin(i + gT) * 0.1, 1.05 + k * 0.8, -12.5 + Math.cos(i) * 0.1); d.scale.setScalar(0.05 + k * 0.08); });
    moscas.visible = true; moscas.userData.place((i, d) => { const pc = i < 24 && Q.tigela === 2 ? [VX + 0.6, -12.5, 1.0] : [...POCAS[i % POCAS.length], 0.25]; const a = gT * (3 + (i % 5)) + i; d.position.set(pc[0] + Math.cos(a) * 0.35, pc[2] + 0.2 + Math.sin(a * 1.7) * 0.15, pc[1] + Math.sin(a) * 0.35); });
    fedor.visible = true; fedor.material.opacity = 0.3; fedor.userData.place((i, d) => { const pc = POCAS[i % POCAS.length]; const k = (gT * 0.15 + i * 0.37) % 1; d.position.set(pc[0] + Math.sin(i + k * 3) * 0.4, 0.2 + k * 2.2, pc[1]); d.scale.setScalar(0.04 + k * 0.1); d.rotation.set(k, i, 0); return k < 0.9 && Math.hypot(pc[0] - p.x, pc[1] - p.z) < 18; });
    // gatilhos da missão
    const perto = (x, z, r) => Math.hypot(p.x - x, p.z - z) < (r || 1.8);
    if (al && al.c === corvel && Q.passo === 1) al = { nome: 'Arquimago Corvel', acao: passoCorvel, rot: 'FALAR' };
    if (al && al.ser) al = null;
    if (al && al.c === capitao && Q.passo === 5 && Q.sub === 'A2') al = { acao: ordensCapitao, rot: 'ENTREGAR' };
    if (Q.passo === 2 && Q.tigela === 0 && perto(VX, -11.6, 1.9)) al = { acao: ferver, rot: 'FERVER' };
    if (Q.passo === 3 && perto(VX + 20, 4, 4.2)) { if (ativo.memoria) pocoMemoria(); else if (!Q.dicaPoco) { Q.dicaPoco = true; aviso('Ligue a Memória 🧠 pra entender o que tem nessa água.', '#ffd23c'); } }
    if (Q.passo === 4 && perto(VX + 11.9, -14.6, 1.8)) al = { acao: portaQuarto, rot: 'ENTRAR' };
    if (Q.passo === 5 && Q.sub === 'A1' && perto(VX - 16, 12, 2.6)) al = { acao: subirCarroca, rot: 'SUBIR' };
    if (Q.passo === 3.5 || Q.passo === 4) { /* plaquinha da cólera */ }
    // seta
    seta.visible = !!Q.alvoQ && !conversa && !cenaQ; if (seta.visible) seta.position.set(Q.alvoQ[0], 3.2 + Math.sin(gT * 4) * 0.25, Q.alvoQ[1]);
    if (Q.naCarroca) { p.set(VX - 16, 1.05, 12); }
    return al;
  }
  SABER.push({ x: VX + 20, y: 3.2, z: 4, t: 'Cólera! A água do poço está suja de esgoto. Ferver mata a bactéria.' }, { x: VX, y: 2.2, z: -12.5, t: 'Ferver a 100 °C mata os micróbios. Por isso o caldo fervido não estraga.' }, { x: VX - 10, y: 1.4, z: 9.6, t: 'Esgoto a céu aberto: é assim que a doença chega na água.' }, { x: VX, y: 9, z: -17, t: 'Academia Real: aqui ainda acham que doença é castigo.' });
  SABER.forEach(sb => { if (!sb.el) { const d = document.createElement('div'); d.className = 'tag'; d.textContent = sb.t; $('saber').appendChild(d); sb.el = d; } });

  // ---------- MAPA: minimapa e viagem rápida ----------
  const mini = $('mini'), mx = mini.getContext('2d'); let miniT = 0;
  function desenhaMini(p) { const W = mini.width, H = mini.height, k = zona === 'valdren' ? 3.6 : dentro ? 9 : 3.4; mx.setTransform(1, 0, 0, 1, 0, 0); mx.clearRect(0, 0, W, H);
    mx.save(); mx.beginPath(); mx.arc(W / 2, H / 2, W / 2 - 2, 0, 7); mx.clip();
    mx.fillStyle = zona === 'valdren' ? '#e8d8b8' : dentro ? '#c8925a' : '#9ed88a'; mx.fillRect(0, 0, W, H);
    mx.translate(W / 2, H / 2); mx.scale(k, k); mx.translate(-p.x, -p.z);
    if (zona === 'valdren') { mx.fillStyle = '#4a7a9a'; mx.fillRect(VX + 28, -45, 40, 90); mx.strokeStyle = '#7a7068'; mx.lineWidth = 1.6; mx.beginPath(); mx.arc(VX, 0, 46, 0, 7); mx.stroke(); }
    else if (!dentro) { mx.fillStyle = '#f2d48a'; mx.beginPath(); mx.arc(0, 0, 5.2, 0, 7); mx.arc(0, 0, 3.2, 0, 7, true); mx.fill(); mx.strokeStyle = '#7a7068'; mx.lineWidth = 1.6; mx.beginPath(); mx.arc(MW.x, MW.z, MW.r, 0, 7); mx.stroke(); }
    const lista = zona === 'valdren' ? COLV : dentro ? COLC : COL;
    lista.forEach(o => { if (o.t === 'c') { if (o.npc) return; mx.fillStyle = zona === 'vila' && !dentro ? '#3f9a3f' : '#8a84a0'; mx.beginPath(); mx.arc(o.x, o.z, Math.max(o.r, 0.5), 0, 7); mx.fill(); }
      else { mx.save(); mx.translate(o.x, o.z); mx.rotate(-o.ry); mx.fillStyle = zona === 'valdren' ? '#ff9a7a' : '#ff7a59'; mx.fillRect(-o.hw, -o.hd, o.hw * 2, o.hd * 2); mx.restore(); } });
    if (zona === 'vila' && !dentro) { const d = casaFamilia.position; mx.fillStyle = '#e8b030'; mx.fillRect(d.x - 2.4, d.z - 2.2, 4.8, 4.4); mx.fillStyle = '#4a2a10'; mx.font = 'bold 3.4px sans-serif'; mx.textAlign = 'center'; mx.fillText('🏠', d.x, d.z + 1.2); }
    const npcs = zona === 'valdren' ? NPCV : dentro ? [] : NPCS; mx.fillStyle = '#ffd23c'; mx.strokeStyle = '#3a2a10'; mx.lineWidth = 0.4; npcs.forEach(n => { mx.beginPath(); mx.arc(n.x, n.z, 0.9, 0, 7); mx.fill(); mx.stroke(); });
    if (!dentro) { FERAS.forEach(e => { if (e.morto || e.T.zona !== zona) return; mx.fillStyle = e.T.chefe ? '#3ab8ff' : '#e83a2a'; mx.beginPath(); mx.arc(e.g.position.x, e.g.position.z, e.T.chefe ? 2.2 : 0.8, 0, 7); mx.fill(); }); if (zona === 'vila') { mx.fillStyle = '#ff8a3a'; mx.fillRect(FX0 - 1.2, FZ0 - 1.2, 2.4, 2.4); } }
    if (Q.alvoQ && zona === 'valdren') { const [ax, az] = Q.alvoQ; const t = 1 + Math.sin(gT * 5) * 0.25; mx.fillStyle = '#ff4a3a'; mx.beginPath(); mx.arc(ax, az, 1.4 * t, 0, 7); mx.fill(); }
    mx.restore();
    mx.save(); mx.translate(W / 2, H / 2); mx.rotate(-facing + Math.PI); mx.fillStyle = '#2a7aff'; mx.strokeStyle = '#fff'; mx.lineWidth = 2; mx.beginPath(); mx.moveTo(0, -9); mx.lineTo(6, 6); mx.lineTo(0, 3); mx.lineTo(-6, 6); mx.closePath(); mx.fill(); mx.stroke(); mx.restore();
    mx.strokeStyle = 'rgba(255,255,255,.9)'; mx.lineWidth = 2; mx.beginPath(); mx.arc(W / 2, H / 2, W / 2 - 2, 0, 7); mx.stroke(); mx.fillStyle = '#fff'; mx.font = 'bold 12px sans-serif'; mx.textAlign = 'center'; mx.fillText('N', W / 2, 13); }
  function abrirMapa() { if (conversa || cenaQ) return; const lib = Q.passo >= 1 || finais.some(f => f[0] === 'A'); const L = [
      { id: 'vila', nome: 'Vila de Brumafria', sub: 'Sua cidade natal 🏠', on: true },
      { id: 'valdren', nome: 'Valdren', sub: lib ? 'A capital · Academia Real' : '🔒 Fale com o Professor pra ir', on: lib } ];
    $('mapa-lista').innerHTML = ''; L.forEach(l => { const b = document.createElement('button'); b.className = 'lugar' + (zona === l.id ? ' aqui' : ''); b.disabled = !l.on; b.innerHTML = `<b>${l.nome}</b><small>${zona === l.id ? '📍 Você está aqui' : l.sub}</small>`; if (l.on && zona !== l.id) tapBtn(b, () => viajar(l.id)); $('mapa-lista').appendChild(b); }); $('mapa').hidden = false; }
  function viajar(id) { $('mapa').hidden = true; if (Q.naCarroca) return; cena([{ t: id === 'vila' ? 'De volta pra casa... Brumafria' : 'A caminho de Valdren...', v: id === 'vila' ? 'nar05' : 'nar06' }], () => {
      dentro = false; zona = id; if (id === 'vila') { heroi.position.set(0, 0, 4.2); facing = Math.PI; camYaw = 0; cam.position.set(0, 3, 10); mostrarLugar('Vila de Brumafria'); }
      else { heroi.position.set(VX, 0, 40); facing = Math.PI; camYaw = 0; cam.position.set(VX, 3, 46); mostrarLugar('Valdren · a capital'); } }); }
  tapBtn(mini, abrirMapa); tapBtn($('mapa-fecha'), () => { $('mapa').hidden = true; }); tapBtn($('casa'), () => { if (zona === 'vila' && !dentro) { aviso('Você já está em Brumafria, sua cidade natal.', '#ffd23c'); return; } if (dentro) { aviso('Você está dentro de casa. A porta fica atrás de você.', '#ffd23c'); return; } viajar('vila'); });

  // ===================== COMBATE: vida, armas, bichos e a forja =====================
  let vida = 100; let VIDA_MAX = 100; let semDanoT = 99, desmaiado = false;
  AR.inv = Object.assign({ moedas: 0, pele: 0, carne: 0, coracao: 0 }, AR.inv || {});
  AR.armas = AR.armas || ['bastao']; AR.arma = AR.arma === 'punho' || AR.armas.includes(AR.arma) ? AR.arma : 'bastao'; AR.abates = AR.abates || {};
  const ARMAS = {
    bastao: { nome: 'Bastão', icone: '🪵', dano: 10, alc: 1.9, cd: 0.4, desc: 'O bastão que o seu pai te deu. Bate fraco, mas já é alguma coisa.' },
    espada: { nome: 'Espada de ferro', icone: '🗡️', dano: 22, alc: 2.3, cd: 0.36, preco: 25, desc: 'Ferro com um pouco de carbono vira aço. A 🧠 Memória ensinou o ferreiro.' },
    besta: { nome: 'Besta', icone: '🏹', dano: 30, alc: 18, cd: 0.8, longe: true, preco: 40, desc: 'Alavanca + corda tensionada: atira virotes de longe.' },
    glacial: { nome: 'Espada Glacial', icone: '❄️', dano: 38, alc: 2.5, cd: 0.34, gelo: true, preco: 30, precisa: 'coracao', desc: 'Forjada com o Coração de Gelo do Golem. Às vezes congela o inimigo.' },
    dragao: { nome: 'Espada do Dragão de Fogo', icone: '🐉', dano: 72, alc: 2.6, cd: 0.32, fogo: true, drop: true, desc: 'Caiu do Dragão das Profundezas. Cada golpe queima o inimigo.' },
    punho: { nome: 'Mãos vazias', icone: '👊', dano: 6, alc: 1.6, cd: 0.38, oculta: true, desc: 'Sem arma equipada: soco.' },
  };
  const ITENS = { moedas: '💰', pele: '🐺', carne: '🍖', coracao: '💎', asas: '🦇', espdragao: '🐉' };
  // ---- arma na mão do Leonardo ----
  const maoG = grp(heroi.userData.P.elR, 0, -0.33, 0.05); const ARMAG = {};
  { let g = ARMAG.bastao = grp(maoG); part(g, CYL, '#7a4a2a', 0, 0, 0.32, 0.03, 0.95, 0.03).rotation.x = Math.PI / 2;
    g = ARMAG.espada = grp(maoG); tb(g, 0, 0, 0.55, 0.07, 0.018, 0.78, '#dfe4ee'); part(g, CONE, '#dfe4ee', 0, 0, 0.98, 0.035, 0.1, 0.01).rotation.x = Math.PI / 2; tb(g, 0, 0, 0.14, 0.26, 0.04, 0.05, '#e2c27a'); part(g, CYL, '#4a2a14', 0, 0, 0.03, 0.025, 0.18, 0.025).rotation.x = Math.PI / 2;
    g = ARMAG.glacial = grp(maoG); tb(g, 0, 0, 0.6, 0.08, 0.02, 0.9, '#9ae6ff', true); part(g, CONE, '#9ae6ff', 0, 0, 1.08, 0.04, 0.12, 0.01, 0, true).rotation.x = Math.PI / 2; tb(g, 0, 0, 0.14, 0.3, 0.05, 0.05, '#5ab8ff'); part(g, CYL, '#2a3a5a', 0, 0, 0.03, 0.025, 0.18, 0.025).rotation.x = Math.PI / 2; glowSpr(g, 0, 0, 0.6, 1.1, '#7ad8ff', 0.5);
    g = ARMAG.besta = grp(maoG); tb(g, 0, 0.02, 0.2, 0.07, 0.07, 0.6, '#7a4a2a'); tb(g, 0, 0.04, 0.42, 0.62, 0.04, 0.05, '#5a3a24'); tb(g, 0, 0.05, 0.36, 0.6, 0.008, 0.008, '#e8e0d0'); }
  function mostraArma() { Object.keys(ARMAG).forEach(k => ARMAG[k].visible = k === AR.arma); const A = ARMAS[AR.arma] || ARMAS.bastao; $('atacar').innerHTML = `<span>${A.icone}</span><small>ATACAR</small>`; $('arma').hidden = AR.armas.length < 2 && AR.arma !== 'punho'; }
  function trocaArma() { if (AR.armas.length < 2 && AR.arma !== 'punho') return; const i = AR.armas.indexOf(AR.arma); AR.arma = AR.armas[(i + 1) % AR.armas.length]; som('troca', 0.7); salvaAR(); mostraArma(); aviso(ARMAS[AR.arma].icone + ' ' + ARMAS[AR.arma].nome, '#ffd23c'); }
  function atualizaInv() { if (typeof desenhaBolsa === 'function') try { desenhaBolsa(); } catch (e) {} $('inv-m').textContent = AR.inv.moedas; $('inv-p').textContent = AR.inv.pele; $('inv-c').textContent = AR.inv.carne; $('inv-cw').hidden = !AR.inv.carne; $('inv-pw').hidden = !AR.inv.pele; $('inv-g').hidden = !AR.inv.coracao; }
  function comer() { if (!AR.inv.carne) return; if (vida >= VIDA_MAX) { aviso('Você já está com a vida cheia.', '#8a9aba'); return; } AR.inv.carne--; som('comer'); vida = Math.min(VIDA_MAX, vida + 35); salvaAR(); atualizaInv(); numero(heroi.position, '+35 ❤️', '#7ad87a'); fx('cura', [heroi.position.x, 0, heroi.position.z], 1.2); }

  // ---- números que sobem (dano, moedas) ----
  const vN = new T3.Vector3();
  function numero(pos, txt, cor, alt) { vN.set(pos.x, (pos.y || 0) + (alt || 2), pos.z); vN.project(cam); if (vN.z > 1) return; const d = document.createElement('div'); d.className = 'dn'; d.textContent = txt; d.style.color = cor || '#fff'; d.style.left = ((vN.x * 0.5 + 0.5) * window.innerWidth + (Math.random() - 0.5) * 30) + 'px'; d.style.top = ((-vN.y * 0.5 + 0.5) * window.innerHeight) + 'px'; $('nums').appendChild(d); setTimeout(() => d.remove(), 900); }

  // ---- os bichos ----
  const TIPOS = {
    lobo: { nome: 'Lobo da neve', vida: 40, dano: 8, vel: 4.4, aggro: 11, alc: 1.4, cd: 1.1, raio: 0.6, alt: 1.3, moedas: [2, 4], itens: [['pele', 1], ['carne', 0.3]], zona: 'vila' },
    javali: { nome: 'Javali', vida: 75, dano: 16, vel: 2.6, aggro: 12, alc: 1.5, cd: 2.2, raio: 0.7, alt: 1.5, moedas: [4, 7], itens: [['carne', 1], ['pele', 0.5]], zona: 'vila', investe: true },
    rato: { nome: 'Rato gigante', vida: 18, dano: 5, vel: 3.8, aggro: 8, alc: 1.0, cd: 0.9, raio: 0.4, alt: 0.9, moedas: [1, 3], itens: [], zona: 'valdren' },
    golem: { nome: 'Golem de Gelo', vida: 520, dano: 28, vel: 1.7, aggro: 14, alc: 3.8, cd: 2.6, raio: 1.5, alt: 4.6, moedas: [40, 40], itens: [['coracao', 1]], zona: 'vila', chefe: true, volta: 180, barra: '❄️ GOLEM DE GELO' },
    goblin: { nome: 'Goblin', vida: 55, dano: 9, vel: 3.7, aggro: 10, alc: 1.3, cd: 1.2, raio: 0.5, alt: 1.35, moedas: [2, 5], itens: [['carne', 0.2]], zona: 'vila', volta: 25, perto: 9 },
    aranha: { nome: 'Aranha da Caverna', vida: 160, dano: 22, vel: 4.6, aggro: 11, alc: 1.5, cd: 1.0, raio: 0.75, alt: 1.0, moedas: [8, 14], itens: [], zona: 'masmorra', volta: 99999 },
    esqueleto: { nome: 'Esqueleto Guerreiro', vida: 230, dano: 28, vel: 3.3, aggro: 12, alc: 1.6, cd: 1.3, raio: 0.5, alt: 1.9, moedas: [10, 16], itens: [], zona: 'masmorra', volta: 99999 },
    cogumelo: { nome: 'Fungo Venenoso', vida: 280, dano: 26, vel: 2.5, aggro: 10, alc: 1.6, cd: 1.4, raio: 0.7, alt: 1.6, moedas: [12, 18], itens: [], zona: 'masmorra', volta: 99999 },
    gosma: { nome: 'Gosma de Cristal', vida: 220, dano: 24, vel: 3.0, aggro: 11, alc: 1.4, cd: 1.2, raio: 0.7, alt: 1.0, moedas: [12, 18], itens: [], zona: 'masmorra', volta: 99999, investe: true },
    troll: { nome: 'Troll de Pedra', vida: 650, dano: 42, vel: 2.3, aggro: 12, alc: 2.4, cd: 2.0, raio: 1.0, alt: 2.9, moedas: [30, 45], itens: [['carne', 1]], zona: 'masmorra', volta: 99999 },
    espectro: { nome: 'Espectro', vida: 300, dano: 32, vel: 3.7, aggro: 13, alc: 1.7, cd: 1.3, raio: 0.6, alt: 2.0, moedas: [20, 28], itens: [], zona: 'masmorra', volta: 99999 },
    dragao: { nome: 'Dragão das Profundezas', vida: 2600, dano: 55, vel: 2.5, aggro: 18, alc: 4.2, cd: 2.4, raio: 2.2, alt: 4.6, moedas: [300, 300], itens: [['coracao', 1]], zona: 'masmorra', chefe: true, volta: 99999, barra: '🐉 DRAGÃO DAS PROFUNDEZAS' },
    morcego: { nome: 'Morcego Gigante', vida: 300, dano: 18, vel: 3.2, aggro: 12, alc: 2.8, cd: 2.0, raio: 1.2, alt: 3.6, moedas: [25, 30], itens: [['asas', 1]], zona: 'vila', chefe: true, voa: true, volta: 60, barra: '🦇 MORCEGO GIGANTE' },
  };
  const geloMat = new T3.MeshBasicMaterial({ color: '#bfefff', transparent: true, opacity: 0.45, depthWrite: false, toneMapped: false });
  function fera(tipo) { const g = grp(world); const b = grp(g); const L = []; let head = null, arms = [];
    const leg = (x, z, h, w, c) => { const l = grp(b, x, h, z); part(l, CYL, c, 0, -h / 2, 0, w, h, w); L.push(l); };
    if (tipo === 'lobo') { const c = '#a8b0c0', c2 = '#eef2f8';
      part(b, SPH, c, 0, 0.62, 0, 0.3, 0.29, 0.6, 0.04); part(b, SPH, c2, 0, 0.52, 0.18, 0.24, 0.22, 0.38);
      head = grp(b, 0, 0.86, 0.6); part(head, SPH, c, 0, 0, 0, 0.22, 0.2, 0.24, 0.04); part(head, CONE, c2, 0, -0.05, 0.27, 0.1, 0.26, 0.09).rotation.x = Math.PI / 2; part(head, SPH, '#1a1a22', 0, -0.03, 0.4, 0.04, 0.035, 0.035);
      [-1, 1].forEach(s => { part(head, CONE, c, s * 0.12, 0.21, -0.03, 0.07, 0.17, 0.05); part(head, SPH, '#ffd23c', s * 0.1, 0.05, 0.19, 0.035, 0.035, 0.02, 0, true); });
      part(b, CONE, c, 0, 0.78, -0.75, 0.1, 0.55, 0.1).rotation.x = -Math.PI / 2 + 0.6;
      [[-0.15, 0.32], [0.15, 0.32], [-0.15, -0.36], [0.15, -0.36]].forEach(([x, z]) => leg(x, z, 0.46, 0.065, c)); }
    else if (tipo === 'javali') { const c = '#5a3a2a', c2 = '#3a2418';
      part(b, SPH, c, 0, 0.66, 0, 0.44, 0.42, 0.7, 0.04); for (let i = 0; i < 5; i++) part(b, CONE, c2, 0, 1.08, 0.4 - i * 0.2, 0.07, 0.22, 0.07);
      head = grp(b, 0, 0.66, 0.68); part(head, SPH, c, 0, 0, 0, 0.3, 0.28, 0.3, 0.04); part(head, CYL, '#d89a8a', 0, -0.06, 0.32, 0.12, 0.12, 0.12).rotation.x = Math.PI / 2;
      [-1, 1].forEach(s => { const t = part(head, CONE, '#f4ecd8', s * 0.13, -0.08, 0.3, 0.035, 0.22, 0.035); t.rotation.x = -0.4; t.rotation.z = -s * 0.3; part(head, SPH, '#ff3a2a', s * 0.13, 0.1, 0.24, 0.035, 0.035, 0.02, 0, true); part(head, CONE, c2, s * 0.17, 0.27, 0, 0.07, 0.14, 0.04); });
      [[-0.22, 0.38], [0.22, 0.38], [-0.22, -0.4], [0.22, -0.4]].forEach(([x, z]) => leg(x, z, 0.38, 0.08, c2)); }
    else if (tipo === 'rato') { const c = '#6a5a52';
      part(b, SPH, c, 0, 0.32, 0, 0.24, 0.22, 0.42, 0.04);
      head = grp(b, 0, 0.36, 0.42); part(head, CONE, c, 0, 0, 0.1, 0.16, 0.36, 0.16).rotation.x = Math.PI / 2; part(head, SPH, '#e89aa8', 0, 0, 0.29, 0.035, 0.035, 0.035);
      [-1, 1].forEach(s => { part(head, SPH, '#e89aa8', s * 0.12, 0.13, -0.04, 0.08, 0.08, 0.025); part(head, SPH, '#ff2a2a', s * 0.07, 0.06, 0.08, 0.03, 0.03, 0.02, 0, true); });
      const t = part(b, CYL, '#d89aa0', 0, 0.22, -0.72, 0.025, 0.7, 0.025); t.rotation.x = Math.PI / 2 - 0.25;
      [[-0.12, 0.2], [0.12, 0.2], [-0.12, -0.22], [0.12, -0.22]].forEach(([x, z]) => leg(x, z, 0.2, 0.04, '#4a3a34')); }
    else if (tipo === 'morcego') { const c = '#3a2840', c2 = '#5a4060', memb = new T3.MeshToonMaterial({ color: '#4a2a5a', gradientMap: GRAD, side: T3.DoubleSide }); const asas = [];
      part(b, SPH, c, 0, 2.6, 0, 0.6, 0.7, 0.55, 0.04); part(b, SPH, c2, 0, 2.5, 0.22, 0.4, 0.5, 0.35);
      head = grp(b, 0, 3.35, 0.2); part(head, SPH, c, 0, 0, 0, 0.42, 0.38, 0.4, 0.04); part(head, SPH, c2, 0, -0.08, 0.32, 0.16, 0.12, 0.12);
      [-1, 1].forEach(s => { const o = part(head, CONE, c, s * 0.22, 0.42, -0.04, 0.13, 0.5, 0.08, 0.04); o.rotation.z = -s * 0.3; part(head, SPH, '#ff2a3a', s * 0.15, 0.08, 0.33, 0.07, 0.06, 0.04, 0, true); const f = part(head, CONE, '#f4ecd8', s * 0.07, -0.2, 0.36, 0.025, 0.11, 0.025); f.rotation.x = Math.PI; });
      glowSpr(head, 0, 0.08, 0.36, 0.9, '#ff3a4a', 0.5);
      const sh = new T3.Shape(); sh.moveTo(0, 0.04); sh.lineTo(0.34, 0.3); sh.lineTo(0.8, 0.36); sh.quadraticCurveTo(0.62, 0.2, 0.88, 0.02); sh.quadraticCurveTo(0.62, -0.04, 0.74, -0.3); sh.quadraticCurveTo(0.5, -0.18, 0.44, -0.44); sh.quadraticCurveTo(0.26, -0.22, 0.03, -0.26); sh.lineTo(0, 0.04); const wg = new T3.ShapeGeometry(sh, 10);
      [-1, 1].forEach(s => { const piv = grp(b, s * 0.45, 2.85, 0); const w = grp(piv); w.scale.set(s * 3, 3, 3); w.rotation.x = Math.PI / 2 - 0.35; const m = new T3.Mesh(wg, memb); m.castShadow = true; w.add(m); part(w, CYL, c, 0.17, 0.17, 0.01, 0.02, 0.45, 0.02).rotation.z = -0.9; asas.push(piv); });
      [-1, 1].forEach(s => { const l = grp(b, s * 0.2, 2.0, -0.05); part(l, CYL, c, 0, -0.18, 0, 0.04, 0.36, 0.04); part(l, CONE, '#f4ecd8', 0, -0.4, 0.04, 0.05, 0.1, 0.05).rotation.x = Math.PI; });
      b.userData.asas = asas; }
    else if (tipo === 'goblin') { const c = '#6ab04a', c2 = '#4a8a34', roupa = '#6a4a2a';
      part(b, SPH, c, 0, 0.66, 0, 0.25, 0.3, 0.21, 0.04); part(b, CYL, roupa, 0, 0.44, 0, 0.27, 0.18, 0.23); part(b, BOX, '#4a3020', 0, 0.54, 0, 0.56, 0.05, 0.47);
      head = grp(b, 0, 1.06, 0.02); part(head, SPH, c, 0, 0, 0, 0.26, 0.23, 0.24, 0.04); part(head, CONE, c2, 0, -0.03, 0.27, 0.05, 0.16, 0.05).rotation.x = Math.PI / 2;
      [-1, 1].forEach(s => { const o = part(head, CONE, c, s * 0.32, 0.05, -0.02, 0.07, 0.36, 0.05, 0.04); o.rotation.z = -s * 1.3; part(head, SPH, '#ff3a2a', s * 0.1, 0.05, 0.2, 0.045, 0.04, 0.02, 0, true); part(head, CONE, '#f4ecd8', s * 0.07, -0.12, 0.2, 0.02, 0.07, 0.02).rotation.x = Math.PI; });
      [-1, 1].forEach(s => { const a = grp(b, s * 0.27, 0.86, 0); part(a, CYL, c, 0, -0.18, 0, 0.06, 0.36, 0.06); part(a, SPH, c2, 0, -0.38, 0, 0.07, 0.07, 0.07); arms.push(a);
        if (s > 0) { const cl = grp(a, 0, -0.38, 0.02); cl.rotation.x = 1.2; part(cl, CYL, '#7a5232', 0, 0.25, 0, 0.035, 0.5, 0.035); part(cl, SPH, '#5a3a22', 0, 0.5, 0, 0.1, 0.13, 0.1, 0.04); } });
      [-0.11, 0.11].forEach(x => leg(x, 0, 0.36, 0.075, c2)); }
    else if (tipo === 'aranha') { const c = '#2a2230', c2 = '#4a2a5a';
      part(b, SPH, c, 0, 0.55, -0.35, 0.48, 0.4, 0.55, 0.04); part(b, SPH, c2, 0, 0.72, -0.4, 0.22, 0.06, 0.38); part(b, SPH, c, 0, 0.5, 0.25, 0.3, 0.25, 0.3, 0.04);
      head = grp(b, 0, 0.5, 0.48); part(head, SPH, c, 0, 0, 0, 0.2, 0.17, 0.18, 0.04); [[-0.07, 0.06], [0.07, 0.06], [-0.12, 0.0], [0.12, 0.0], [-0.04, -0.02], [0.04, -0.02]].forEach(([x, y]) => part(head, SPH, '#ff2a3a', x, y, 0.16, 0.03, 0.03, 0.02, 0, true));
      [-1, 1].forEach(s => { const f = part(head, CONE, '#c8c0a8', s * 0.06, -0.12, 0.14, 0.025, 0.13, 0.025); f.rotation.x = Math.PI - 0.4; });
      [-1, 1].forEach(s => { for (let k = 0; k < 4; k++) { const l = grp(b, s * 0.22, 0.52, 0.42 - k * 0.2); l.rotation.y = s * (0.3 - k * 0.25); const up = grp(l); up.rotation.z = -s * 1.0; part(up, CYL, c, 0, 0.28, 0, 0.045, 0.56, 0.045); const lo = grp(up, 0, 0.56, 0); lo.rotation.z = s * 2.3; part(lo, CYL, c2, 0, 0.32, 0, 0.035, 0.64, 0.035); L.push(l); } }); }
    else if (tipo === 'esqueleto') { const c = '#e8e2cc', c2 = '#b8b098';
      part(b, CYL, c, 0, 1.05, 0, 0.05, 0.6, 0.05); for (let k = 0; k < 4; k++) part(b, TOR, c, 0, 1.25 - k * 0.09, 0, 0.17 - k * 0.012, 0.15 - k * 0.01, 0.17, 0.02).rotation.x = Math.PI / 2; part(b, BOX, c2, 0, 0.78, 0, 0.32, 0.1, 0.16, 0.02);
      head = grp(b, 0, 1.62, 0); part(head, SPH, c, 0, 0, 0, 0.17, 0.18, 0.18, 0.04); part(head, BOX, c2, 0, -0.14, 0.05, 0.16, 0.06, 0.12); [-1, 1].forEach(s => { part(head, SPH, '#120a0a', s * 0.06, 0.01, 0.14, 0.045, 0.05, 0.03); part(head, SPH, '#5af0ff', s * 0.06, 0.01, 0.16, 0.02, 0.02, 0.01, 0, true); });
      part(head, SPH, '#5a5a62', 0, 0.06, 0, 0.19, 0.12, 0.19, 0.03);
      [-1, 1].forEach(s => { const a = grp(b, s * 0.24, 1.38, 0); part(a, CYL, c, 0, -0.22, 0, 0.035, 0.44, 0.035); part(a, CYL, c, 0, -0.62, 0.03, 0.03, 0.38, 0.03); arms.push(a);
        if (s > 0) { const sw = grp(a, 0, -0.82, 0.05); sw.rotation.x = 1.3; part(sw, BOX, '#8a8a92', 0, 0.4, 0, 0.06, 0.8, 0.015); part(sw, BOX, '#5a4a3a', 0, -0.02, 0, 0.18, 0.04, 0.04); } else { const sh = part(a, CYL, '#5a4a3a', -0.06, -0.6, 0.05, 0.25, 0.04, 0.25, 0.03); sh.rotation.z = Math.PI / 2; } });
      [-0.1, 0.1].forEach(x => leg(x, 0, 0.75, 0.04, c)); }
    else if (tipo === 'cogumelo') { const c = '#e8dcc0', cap = '#a83a5a';
      part(b, CYL, c, 0, 0.55, 0, 0.3, 0.8, 0.3, 0.04); const ch = part(b, SPH, cap, 0, 1.0, 0, 0.62, 0.36, 0.62, 0.04);
      for (let k = 0; k < 9; k++) { const a = k * 0.7; part(b, SPH, '#f4f0e0', Math.cos(a) * (0.25 + (k % 3) * 0.1), 1.2 - (k % 3) * 0.06, Math.sin(a) * (0.25 + (k % 3) * 0.1), 0.06, 0.03, 0.06); }
      head = grp(b, 0, 0.62, 0.27); [-1, 1].forEach(s => part(head, SPH, '#9aff5a', s * 0.09, 0.05, 0.02, 0.05, 0.06, 0.02, 0, true)); part(head, BOX, '#3a1a20', 0, -0.08, 0.02, 0.14, 0.04, 0.01);
      glowSpr(b, 0, 1.0, 0, 1.6, '#9aff5a', 0.25);
      [-1, 1].forEach(s => { const a = grp(b, s * 0.3, 0.7, 0); part(a, CYL, c, 0, -0.18, 0, 0.06, 0.36, 0.06); arms.push(a); });
      [-0.13, 0.13].forEach(x => leg(x, 0, 0.18, 0.09, '#c8bca0')); }
    else if (tipo === 'gosma') { const gm2 = new T3.MeshPhysicalMaterial({ color: '#5ad8ff', transparent: true, opacity: 0.72, roughness: 0.1, clearcoat: 1, emissive: '#1a6a9a', emissiveIntensity: 0.4 });
      const corpo = new T3.Mesh(SPH, gm2); corpo.position.set(0, 0.42, 0); corpo.scale.set(0.62, 0.45, 0.62); b.add(corpo); b.userData.gosma = corpo;
      for (let k = 0; k < 5; k++) { const cr = part(b, CONE, '#bff4ff', (Math.random() - 0.5) * 0.5, 0.35 + Math.random() * 0.2, (Math.random() - 0.5) * 0.5, 0.06, 0.22, 0.06, 0, true); cr.rotation.set(Math.random(), Math.random(), Math.random()); }
      head = grp(b, 0, 0.55, 0.45); [-1, 1].forEach(s => { part(head, SPH, '#ffffff', s * 0.13, 0, 0, 0.07, 0.08, 0.04); part(head, SPH, '#102030', s * 0.13, 0, 0.03, 0.035, 0.04, 0.02); }); glowSpr(b, 0, 0.45, 0, 1.6, '#5ad8ff', 0.35); }
    else if (tipo === 'troll') { const c = '#6a7a6a', c2 = '#4a5a4a';
      part(b, SPH, c, 0, 1.75, 0, 0.75, 0.8, 0.6, 0.04); part(b, SPH, c2, 0, 1.2, 0.05, 0.62, 0.45, 0.5, 0.04); part(b, CYL, '#5a3a22', 0, 0.98, 0, 0.6, 0.25, 0.5);
      for (let k = 0; k < 5; k++) part(b, SPH, '#8a8a8a', (Math.random() - 0.5) * 0.8, 2.1 + Math.random() * 0.3, -0.35, 0.16, 0.12, 0.16, 0.03);
      head = grp(b, 0, 2.55, 0.25); part(head, SPH, c, 0, 0, 0, 0.32, 0.3, 0.32, 0.04); part(head, SPH, c2, 0, -0.08, 0.26, 0.14, 0.11, 0.1); [-1, 1].forEach(s => { part(head, SPH, '#ffb020', s * 0.12, 0.06, 0.26, 0.045, 0.035, 0.02, 0, true); const t = part(head, CONE, '#f4ecd8', s * 0.12, -0.17, 0.25, 0.035, 0.12, 0.035); });
      [-1, 1].forEach(s => { const a = grp(b, s * 0.8, 2.1, 0); part(a, SPH, c, 0, -0.45, 0, 0.22, 0.55, 0.22, 0.04); part(a, SPH, c2, 0, -1.05, 0.05, 0.22, 0.25, 0.22, 0.04); arms.push(a);
        if (s > 0) { const cl = grp(a, 0, -1.1, 0.1); cl.rotation.x = 1.3; part(cl, CYL, '#6a4a2a', 0, 0.4, 0, 0.07, 0.9, 0.07); part(cl, SPH, '#5a3a22', 0, 0.9, 0, 0.22, 0.3, 0.22, 0.04); for (let k = 0; k < 4; k++) part(cl, CONE, '#8a8a92', Math.cos(k * 1.57) * 0.2, 0.9, Math.sin(k * 1.57) * 0.2, 0.04, 0.14, 0.04).rotation.z = -Math.cos(k * 1.57) * 1.4; } });
      [-0.3, 0.3].forEach(x => leg(x, 0, 0.95, 0.2, c2)); }
    else if (tipo === 'espectro') { const vel2 = new T3.MeshStandardMaterial({ color: '#2a3048', transparent: true, opacity: 0.85, roughness: 0.6, side: T3.DoubleSide });
      const capa = new T3.Mesh(new T3.ConeGeometry(0.55, 1.7, 18, 1, true), vel2); capa.position.y = 1.25; b.add(capa); const fim = new T3.Mesh(new T3.CylinderGeometry(0.55, 0.62, 0.25, 18, 1, true), vel2); fim.position.y = 0.32; b.add(fim);
      head = grp(b, 0, 2.0, 0.05); part(head, SPH, '#1a1e2c', 0, 0, 0, 0.26, 0.3, 0.26, 0.03); part(head, SPH, '#020206', 0, -0.03, 0.12, 0.17, 0.2, 0.15); [-1, 1].forEach(s => part(head, SPH, '#7af0ff', s * 0.06, 0.0, 0.25, 0.03, 0.022, 0.01, 0, true));
      glowSpr(head, 0, 0, 0.2, 0.9, '#7af0ff', 0.5); glowSpr(b, 0, 1.2, 0, 2.4, '#5a8aff', 0.25);
      [-1, 1].forEach(s => { const a = grp(b, s * 0.36, 1.65, 0.1); part(a, CYL, '#2a3048', 0, -0.3, 0, 0.07, 0.6, 0.07); for (let k = 0; k < 3; k++) part(a, CONE, '#c8f4ff', (k - 1) * 0.04, -0.68, 0.02, 0.015, 0.14, 0.015, 0, true).rotation.x = Math.PI; arms.push(a); }); }
    else if (tipo === 'dragao') { const c = '#3a1418', c2 = '#5a1e22', bel = '#a8502a', memb = new T3.MeshToonMaterial({ color: '#5a1a22', gradientMap: GRAD, side: T3.DoubleSide }); const asas = [];
      part(b, SPH, c, 0, 2.2, 0, 1.2, 1.0, 2.0, 0.04); part(b, SPH, bel, 0, 1.9, 0.2, 0.9, 0.7, 1.6); for (let k = 0; k < 4; k++) part(b, BOX, '#ff6a1a', 0, 1.35 + k * 0.05, 0.9 - k * 0.5, 0.5, 0.03, 0.06, 0, true);
      for (let k = 0; k < 6; k++) part(b, CONE, '#1a0a0c', 0, 3.15 - k * 0.05, 1.2 - k * 0.55, 0.12, 0.45, 0.12);
      let px = 0, py = 2.7, pz = 1.6; for (let k = 0; k < 4; k++) { part(b, SPH, k % 2 ? c2 : c, px, py, pz, 0.48 - k * 0.04, 0.48 - k * 0.04, 0.5, 0.03); py += 0.45; pz += 0.32; }
      head = grp(b, 0, py + 0.1, pz + 0.3); part(head, SPH, c, 0, 0, 0, 0.55, 0.42, 0.75, 0.04); part(head, BOX, c2, 0, -0.18, 0.55, 0.55, 0.22, 0.7); part(head, BOX, c, 0, -0.42, 0.45, 0.48, 0.12, 0.65);
      for (let k = 0; k < 6; k++) [-1, 1].forEach(s => part(head, CONE, '#f4ecd8', s * 0.2, -0.33, 0.25 + k * 0.12, 0.03, 0.12, 0.03).rotation.x = Math.PI);
      [-1, 1].forEach(s => { const h = part(head, CONE, '#1a0a0c', s * 0.3, 0.38, -0.35, 0.1, 0.8, 0.1); h.rotation.set(-1.0, 0, -s * 0.35); part(head, SPH, '#ffb020', s * 0.32, 0.12, 0.35, 0.09, 0.06, 0.07, 0, true); });
      glowSpr(head, 0, -0.3, 1.0, 1.4, '#ff6a1a', 0.5);
      [-1, 1].forEach(s => { const w = grp(b, s * 0.8, 3.0, 0.3); const sh = new T3.Shape(); sh.moveTo(0, 0); sh.lineTo(s * 3.2, 1.5); sh.lineTo(s * 3.6, -0.3); sh.lineTo(s * 2.6, -0.6); sh.lineTo(s * 1.8, -0.4); sh.lineTo(s * 1.0, -0.8); sh.closePath();
        const m = new T3.Mesh(new T3.ShapeGeometry(sh), memb); m.rotation.x = -Math.PI / 2 + 0.5; w.add(m); part(w, CYL, c, s * 1.6, 0.35, -0.55, 0.08, 3.6, 0.08).rotation.set(0.5, 0, -s * 1.15); asas.push(w); });
      b.userData.asas = asas;
      let tz = -1.8, ty = 2.0; for (let k = 0; k < 7; k++) { part(b, SPH, k % 2 ? c2 : c, 0, ty, tz, 0.45 - k * 0.055, 0.42 - k * 0.05, 0.5, 0.03); tz -= 0.55; ty -= 0.18; } part(b, CONE, '#1a0a0c', 0, ty + 0.1, tz, 0.25, 0.6, 0.08).rotation.x = -Math.PI / 2;
      [[-0.85, 1.1], [0.85, 1.1], [-0.85, -1.1], [0.85, -1.1]].forEach(([x, z]) => leg(x, z, 1.45, 0.24, c2)); }
    else { const c = '#b0dcf2', c2 = '#7ab4dc';
      part(b, ICO, c, 0, 2.4, 0, 1.05, 1.1, 0.8, 0.03); part(b, ICO, c2, 0, 1.45, 0, 0.8, 0.5, 0.6, 0.03);
      head = grp(b, 0, 3.6, 0.18); part(head, ICO, c, 0, 0, 0, 0.5, 0.45, 0.45, 0.03); [-1, 1].forEach(s => part(head, SPH, '#5af0ff', s * 0.18, 0.03, 0.4, 0.08, 0.06, 0.04, 0, true)); glowSpr(head, 0, 0, 0.5, 1.3, '#5af0ff', 0.7);
      [-1, 1].forEach(s => { const a = grp(b, s * 1.2, 3.0, 0); part(a, ICO, c2, 0, -0.6, 0, 0.36, 0.7, 0.36, 0.03); part(a, ICO, c, 0, -1.45, 0.1, 0.56, 0.5, 0.56, 0.03); arms.push(a);
        for (let k = 0; k < 3; k++) { const cr = part(b, CONE, '#8af0ff', s * (0.6 + k * 0.25), 3.2 + k * 0.15, -0.4, 0.12, 0.6 + k * 0.2, 0.12, 0, true); cr.rotation.z = -s * (0.3 + k * 0.2); }
        const l = grp(b, s * 0.5, 1.2, 0); part(l, ICO, c2, 0, -0.6, 0, 0.4, 0.62, 0.4, 0.03); L.push(l); }); }
    const T = TIPOS[tipo]; const gelo = new T3.Mesh(BOX, geloMat); gelo.scale.set(T.raio * 2.2, T.alt * 1.05, T.raio * 2.4); gelo.position.y = T.alt * 0.5; gelo.visible = false; g.add(gelo);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const hp = document.createElement('div'); hp.className = 'hpb'; hp.innerHTML = '<i></i>'; $('hpbs').appendChild(hp);
    return { tipo, T, g, b, L, head, arms, gelo: gelo, hp, asas: b.userData.asas || null };
  }
  const FERAS = [];
  function solta(tipo, x, z) { const e = fera(tipo); e.home = [x, z]; e.g.position.set(x, 0, z); e.ry = Math.random() * 6.28; reseta(e); FERAS.push(e); return e; }
  function reseta(e) { e.vida = e.max = e.T.vida; e.estado = 'anda'; e.t = 0; e.cd = 0; e.morto = false; e.mortoT = 0; e.stun = 0; e.congela = 0; e.vuln = 0; e.hitT = 9; e.alvoW = e.home.slice(); e.g.visible = true; e.g.position.set(e.home[0], 0, e.home[1]); e.b.rotation.set(0, 0, 0); e.b.position.set(0, 0, 0); }
  // Brumafria: lobos e javalis na floresta, o Golem na caverna do norte — todos FORA da muralha
  [[-44, -36], [-47, -30], [-40, -42], [46, 22], [50, 17], [-50, 16], [-46, 22]].forEach(([x, z]) => solta('lobo', x, z));
  [[30, -72], [-30, -55], [52, -8]].forEach(([x, z]) => solta('javali', x, z));
  const GX = 0, GZ = -62; const golem = solta('golem', GX, GZ);
  const morcegao = solta('morcego', 0, 34); // voa em volta da cidade, por fora da muralha
  // Valdren: ratos gigantes no esgoto
  POCAS.slice(0, 7).forEach(([x, z]) => solta('rato', x, z));

  // caverna do Golem
  { const cv2 = grp(world, GX, 0, GZ); const R = rng(77);
    for (let i = 0; i < 22; i++) { const a = Math.PI * 0.15 + i / 21 * Math.PI * 0.7 + Math.PI; const r = 11 + R() * 2; const s = 1.5 + R() * 2.2; part(cv2, ICO, ['#c8e4f4', '#a8d0e8', '#dceef8'][i % 3], Math.cos(a) * r, s * 0.5, -Math.abs(Math.sin(a) * r), s, s * 1.2, s, 0.03); }
    part(cv2, ICO, '#5a6a7a', 0, 3, -13, 6, 5, 3); part(cv2, SPH, '#0a0e18', 0, 1.6, -10.6, 2.2, 2.6, 0.6);
    for (let i = 0; i < 9; i++) { const a = R() * 6.28, r = 3 + R() * 7; const c = part(cv2, CONE, '#9af0ff', Math.cos(a) * r, 0.6, Math.sin(a) * r - 2, 0.25, 1.2 + R(), 0.25, 0, true); c.rotation.z = (R() - 0.5) * 0.6; }
    glowSpr(cv2, 0, 2, -9, 9, '#7ad8ff', 0.35);
    const chao = new T3.Mesh(new T3.CircleGeometry(11, 40), new T3.MeshToonMaterial({ color: '#cfe8f6', gradientMap: GRAD })); chao.rotation.x = -Math.PI / 2; chao.position.y = 0.02; cv2.add(chao);
    for (let i = 0; i < 22; i++) { const a = Math.PI * 0.15 + i / 21 * Math.PI * 0.7 + Math.PI; COL.push({ t: 'c', x: GX + Math.cos(a) * 12, z: GZ - Math.abs(Math.sin(a) * 12), r: 1.6 }); } }
  // ---------- FLORESTA DOS GOBLINS (a leste do portão norte) ----------
  const GBX = 48, GBZ = -50, GTX = 3.2, GTZ = -34.5; const ENTRA = Math.atan2(GTZ - GBZ, GTX - GBX);
  { const fl = grp(world, GBX, 0, GBZ); const R = rng(4242);
    const chao = new T3.Mesh(new T3.CircleGeometry(20, 48), new T3.MeshToonMaterial({ color: '#3d7a32', gradientMap: GRAD })); chao.rotation.x = -Math.PI / 2; chao.position.y = 0.015; chao.receiveShadow = true; fl.add(chao);
    const fora = (a) => Math.abs(Math.atan2(Math.sin(a - ENTRA), Math.cos(a - ENTRA))) < 0.3;
    for (let i = 0; i < 84; i++) { const borda = i < 66; const a = R() * 6.28, r = borda ? 14 + R() * 9 : 5 + R() * 7; if (borda && fora(a)) continue; const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const g = grp(fl, x, 0, z); const s = 0.9 + R() * 0.9; g.scale.setScalar(s); g.rotation.y = R() * 6.28;
      part(g, CYL, '#4a3220', 0, 1.2, 0, 0.22, 2.4, 0.22); [0, 1, 2].forEach(j => part(g, CONE, ['#1c4426', '#225430', '#286236'][j], 0, 2.3 + j * 0.95, 0, 1.55 - j * 0.42, 1.9, 1.55 - j * 0.42, 0.03));
      if (R() < 0.4) { part(g, CYL, '#f0e8d8', 0.45, 0.1, 0.2, 0.04, 0.2, 0.04); part(g, SPH, '#c83a3a', 0.45, 0.22, 0.2, 0.13, 0.07, 0.13); }
      COL.push({ t: 'c', x: GBX + x, z: GBZ + z, r: 0.35 * s }); }
    // cabanas de goblin
    [0.9, 2.4, 4.1, 5.4].forEach((a, i) => { const x = Math.cos(a) * 8.5, z = Math.sin(a) * 8.5; if (fora(a)) return; const g = grp(fl, x, 0, z); g.rotation.y = -a - Math.PI / 2;
      part(g, CONE, ['#7a5a3a', '#6a4a2a', '#8a6a42', '#5a4a30'][i], 0, 1.3, 0, 1.9, 2.6, 1.9, 0.03); part(g, SPH, '#1a1008', 0, 0.55, 1.45, 0.5, 0.6, 0.3);
      [-0.3, 0, 0.3].forEach(o => { const v = part(g, CYL, '#5a3a22', o, 2.8, 0, 0.04, 0.9, 0.04); v.rotation.z = o * 1.2; }); tb(g, 0.8, 1.2, 1.0, 0.5, 0.4, 0.04, '#a8884a');
      COL.push({ t: 'c', x: GBX + x, z: GBZ + z, r: 1.7 }); });
    // fogueira do acampamento
    { const f = grp(fl, 0, 0, 0); for (let k = 0; k < 6; k++) { const l = part(f, CYL, '#6a4a2a', 0, 0.12, 0, 0.09, 1.0, 0.09); l.rotation.set(Math.PI / 2, 0, k / 6 * Math.PI); } for (let k = 0; k < 8; k++) part(f, SPH, '#7a7a84', Math.cos(k * 0.785) * 0.7, 0.1, Math.sin(k * 0.785) * 0.7, 0.18, 0.13, 0.18);
      [0, 1, 2].forEach(i => part(f, CONE, ['#ffb030', '#ff7a1a', '#ffe070'][i], -0.15 + i * 0.15, 0.5, (i - 1) * 0.1, 0.22, 0.75 - i * 0.12, 0.22, 0, true)); glowSpr(f, 0, 0.8, 0, 4, '#ff8a3a', 0.8);
      COL.push({ t: 'c', x: GBX, z: GBZ, r: 0.9 }); }
    // totem e estacas na entrada
    [-1, 1].forEach(s => { const a = ENTRA + s * 0.22; const x = Math.cos(a) * 15.5, z = Math.sin(a) * 15.5; const t = grp(fl, x, 0, z);
      part(t, CYL, '#5a3a22', 0, 1.3, 0, 0.12, 2.6, 0.12); part(t, SPH, '#6ab04a', 0, 2.7, 0, 0.32, 0.28, 0.3, 0.04); [-1, 1].forEach(k => { const o = part(t, CONE, '#6ab04a', k * 0.38, 2.72, 0, 0.08, 0.4, 0.06, 0.04); o.rotation.z = -k * 1.3; });
      t.rotation.y = Math.atan2(Math.cos(ENTRA), Math.sin(ENTRA)); [-1, 1].forEach(k => part(t, SPH, '#ff3a2a', k * 0.12, 2.75, 0.26, 0.05, 0.05, 0.03, 0, true)); glowSpr(t, 0, 2.75, 0.3, 0.9, '#ff3a2a', 0.5);
      for (let k = 1; k <= 4; k++) { const b = a + s * k * 0.12; const e = part(fl, CONE, '#7a5232', Math.cos(b) * 15.5, 0.6, Math.sin(b) * 15.5, 0.1, 1.2, 0.1); e.rotation.z = (R() - 0.5) * 0.3; COL.push({ t: 'c', x: GBX + Math.cos(b) * 15.5, z: GBZ + Math.sin(b) * 15.5, r: 0.2 }); }
      COL.push({ t: 'c', x: GBX + x, z: GBZ + z, r: 0.35 }); });
    // placa
    { const x = Math.cos(ENTRA) * 18, z = Math.sin(ENTRA) * 18; const g = grp(fl, x, 0, z); g.rotation.y = Math.atan2(Math.cos(ENTRA), Math.sin(ENTRA));
      const tx = canvasTex(320, 128, (c, w, h) => { c.fillStyle = '#5a3a1e'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a1a0a'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); c.fillStyle = '#ffe8b0'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 34px system-ui,sans-serif'; c.fillText('👺 FLORESTA', w / 2, 44); c.fillText('DOS GOBLINS', w / 2, 88); });
      const pl = new T3.Mesh(new T3.PlaneGeometry(2.2, 0.88), new T3.MeshBasicMaterial({ map: tx, toneMapped: false, side: T3.DoubleSide })); pl.position.set(0, 1.9, 0); g.add(pl); [-0.8, 0.8].forEach(o => tb(g, o, 0.9, -0.03, 0.1, 1.8, 0.1, '#5a3a22')); COL.push({ t: 'c', x: GBX + x, z: GBZ + z, r: 0.5 }); } }
  // trilha do guarda até a floresta
  { const ex = GBX + Math.cos(ENTRA) * 19, ez = GBZ + Math.sin(ENTRA) * 19, dx = ex - GTX, dz = ez - GTZ, L = Math.hypot(dx, dz); const g = grp(world, (ex + GTX) / 2, 0, (ez + GTZ) / 2); g.rotation.y = Math.atan2(dx, dz);
    const t = new T3.Mesh(new T3.PlaneGeometry(2.4, L + 2), new T3.MeshToonMaterial({ color: '#e0c080', gradientMap: GRAD })); t.rotation.x = -Math.PI / 2; t.position.y = 0.011; t.receiveShadow = true; g.add(t); }
  { const R = rng(55); for (let i = 0; i < 16; i++) { const a = R() * 6.28, r = 3 + R() * 9; solta('goblin', GBX + Math.cos(a) * r, GBZ + Math.sin(a) * r); } }
  SABER.push({ x: GBX + Math.cos(ENTRA) * 12, y: 1.8, z: GBZ + Math.sin(ENTRA) * 12, t: 'Goblins andam em bando: golpes em área (Pólvora, Raio) acertam vários.' });
  // ---------- MASMORRA DAS PROFUNDEZAS (caverna com 7 fases) ----------
  const MX = -2000, MM_R = 11, MM_DZ = 32, MM_N = 7, MM_ENT = { x: -60, z: -6 };
  const MM_FASES = [['aranha', 6], ['esqueleto', 5], ['cogumelo', 5], ['gosma', 6], ['troll', 2], ['espectro', 4], ['dragao', 1]];
  const MM_NOMES = ['Ninho das Aranhas', 'Cripta dos Esqueletos', 'Jardim de Fungos', 'Lago de Cristal', 'Toca dos Trolls', 'Salão dos Espectros', 'Covil do Dragão'];
  const MM_COR = ['#a05aff', '#5af0ff', '#9aff5a', '#5ad8ff', '#ffb020', '#7a9aff', '#ff5a2a'];
  const mmCentro = k => ({ x: MX, z: -k * MM_DZ });
  const MM = { feras: [], portoes: [], aberto: [], saidaFim: null };
  // entrada da caverna, a oeste da vila
  { const g = grp(world, MM_ENT.x, 0, MM_ENT.z); g.rotation.y = Math.PI / 2; const R = rng(77);
    for (let i = 0; i < 26; i++) { const a = Math.PI * (0.05 + 0.9 * i / 25), r = 3.2 + R() * 0.6; const s = 1.2 + R() * 1.4; const m = part(g, ICO, ['#6a6470', '#5a5460', '#7a7480'][i % 3], Math.cos(a) * r, Math.sin(a) * r * 1.05, -0.6 - R() * 1.5, s, s * 0.9, s, 0.03); m.rotation.set(R() * 3, R() * 3, R() * 3); }
    for (let i = 0; i < 10; i++) { const s = 1.5 + R() * 1.6; part(g, ICO, '#5a5460', (R() - 0.5) * 9, s * 0.5, -2.5 - R() * 3, s, s * 0.8, s, 0.03); }
    const boca = new T3.Mesh(new T3.CircleGeometry(3.1, 32, 0, Math.PI), new T3.MeshBasicMaterial({ color: '#05030a' })); boca.position.set(0, 0.02, -0.4); g.add(boca);
    glowSpr(g, 0, 1.4, -0.3, 4.5, '#a05aff', 0.35);
    [-1, 1].forEach(s => { const t = grp(g, s * 3.6, 0, 0.9); part(t, CYL, '#4a3020', 0, 0.9, 0, 0.08, 1.8, 0.08); part(t, CONE, '#ffb030', 0, 1.95, 0, 0.12, 0.35, 0.12, 0, true); glowSpr(t, 0, 2.0, 0, 1.8, '#ff9a3a', 0.8); COL.push({ t: 'c', x: MM_ENT.x + 0.9, z: MM_ENT.z - s * 3.6, r: 0.25 }); });
    const tx = canvasTex(360, 120, (c, w, h) => { c.fillStyle = '#3a2a1a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a0e06'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); c.fillStyle = '#ffd8a0'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 30px system-ui,sans-serif'; c.fillText('⚠️ MASMORRA DAS', w / 2, 42); c.fillText('PROFUNDEZAS', w / 2, 84); });
    const pg = grp(g, 4.6, 0, 2.2); pg.rotation.y = -0.4; const pl = new T3.Mesh(new T3.PlaneGeometry(2.2, 0.74), new T3.MeshBasicMaterial({ map: tx, toneMapped: false, side: T3.DoubleSide })); pl.position.y = 1.8; pg.add(pl); [-0.8, 0.8].forEach(o => tb(pg, o, 0.9, -0.03, 0.1, 1.8, 0.1, '#4a3020'));
    for (let i = 0; i < 12; i++) { const a = Math.PI * i / 11; COL.push({ t: 'c', x: MM_ENT.x - 1.2 - Math.sin(a) * 0.4, z: MM_ENT.z - Math.cos(a) * 3.8, r: 1.0 }); } }
  // trilha do portão oeste até a caverna
  { const ax = -27, az = -5, dx = MM_ENT.x + 3 - ax, dz = MM_ENT.z - az, L = Math.hypot(dx, dz); const g = grp(world, (ax + MM_ENT.x + 3) / 2, 0, (az + MM_ENT.z) / 2); g.rotation.y = Math.atan2(dx, dz); const t = new T3.Mesh(new T3.PlaneGeometry(2.2, L), new T3.MeshToonMaterial({ color: '#c8b080', gradientMap: GRAD })); t.rotation.x = -Math.PI / 2; t.position.y = 0.011; t.receiveShadow = true; g.add(t); }
  // salões e corredores
  { const M = grp(world, 0, 0, 0); const R = rng(303);
    const pedra = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#2a2630'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { const v = 30 + R() * 40 | 0; x.fillStyle = `rgb(${v},${v - 4},${v + 6})`; x.beginPath(); x.arc(R() * w, R() * h, 1 + R() * 6, 0, 7); x.fill(); } }); pedra.wrapS = pedra.wrapT = T3.RepeatWrapping;
    const chaoM = new T3.MeshStandardMaterial({ map: pedra, roughness: 0.95, color: '#c8c0d8' }); pedra.repeat.set(6, 6);
    const rochaM = ['#3a3440', '#2e2a34', '#46404e'].map(c => new T3.MeshStandardMaterial({ color: c, roughness: 0.9, flatShading: true }));
    const ICOF = new T3.IcosahedronGeometry(1, 0);
    const rocha = (x, z, s, h) => { const m = new T3.Mesh(ICOF, rochaM[(R() * 3) | 0]); m.position.set(x, s * 0.4, z); m.scale.set(s, (h || s) * 1.3, s); m.rotation.set(R() * 3, R() * 3, R() * 3); m.castShadow = m.receiveShadow = true; M.add(m); };
    const base = new T3.Mesh(new T3.PlaneGeometry(80, MM_N * MM_DZ + 60), new T3.MeshBasicMaterial({ color: '#06040a' })); base.rotation.x = -Math.PI / 2; base.position.set(MX, -0.02, -(MM_N - 1) * MM_DZ / 2); M.add(base);
    for (let k = 0; k < MM_N; k++) { const C = mmCentro(k); const ch = new T3.Mesh(new T3.CircleGeometry(MM_R + 0.6, 40), chaoM); ch.rotation.x = -Math.PI / 2; ch.position.set(C.x, 0.0, C.z); ch.receiveShadow = true; M.add(ch);
      for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; const fr = Math.abs(Math.atan2(Math.sin(a - Math.PI / 2), Math.cos(a - Math.PI / 2))) < 0.24, tr = Math.abs(Math.atan2(Math.sin(a + Math.PI / 2), Math.cos(a + Math.PI / 2))) < 0.24; if ((fr && k > 0) || (tr && k < MM_N - 1) || (fr && k === 0)) continue; rocha(C.x + Math.cos(a) * (MM_R + 1.3), C.z - Math.sin(a) * (MM_R + 1.3), 1.4 + R() * 1.2, 2 + R() * 1.6); }
      for (let i = 0; i < 6; i++) { const a = R() * 6.28, r = 4 + R() * 5; const st = part(M, CONE, '#3a3440', C.x + Math.cos(a) * r, 0.6, C.z + Math.sin(a) * r, 0.25 + R() * 0.2, 1.2 + R() * 1.4, 0.25, 0.03); st.position.y = st.scale.y / 2; }
      for (let i = 0; i < 8; i++) { const a = R() * 6.28, r = MM_R - 0.5 - R() * 1.5; const cg = grp(M, C.x + Math.cos(a) * r, 0, C.z + Math.sin(a) * r); for (let j = 0; j < 3; j++) { const cr = part(cg, CONE, MM_COR[k], (R() - 0.5) * 0.5, 0.35, (R() - 0.5) * 0.5, 0.1 + R() * 0.08, 0.6 + R() * 0.6, 0.1, 0, true); cr.rotation.set((R() - 0.5) * 0.8, 0, (R() - 0.5) * 0.8); } glowSpr(cg, 0, 0.5, 0, 2.2, MM_COR[k], 0.55); }
      // corredor até o próximo salão, com portão
      if (k < MM_N - 1) { const z0 = C.z - MM_R + 0.5, z1 = C.z - MM_DZ + MM_R - 0.5; const cor = new T3.Mesh(new T3.PlaneGeometry(4.6, z0 - z1 + 1), chaoM); cor.rotation.x = -Math.PI / 2; cor.position.set(MX, 0.005, (z0 + z1) / 2); M.add(cor);
        for (let z = z0; z > z1; z -= 1.6) [-1, 1].forEach(s => rocha(MX + s * (3.2 + R() * 0.4), z, 1.1 + R() * 0.7, 2 + R()));
        const pz = (z0 + z1) / 2; const pg = grp(M, MX, 0, pz); for (let i = -4; i <= 4; i++) part(pg, CYL, '#3a3a44', i * 0.27, 1.6, 0, 0.05, 3.2, 0.05, 0.02); [0.6, 1.6, 2.6].forEach(y => tb(pg, 0, y, 0, 2.5, 0.1, 0.08, '#2a2a32'));
        [-1, 1].forEach(s => { part(pg, BOX, '#2e2a34', s * 1.75, 1.8, 0, 0.9, 3.6, 0.9, 0.03); const r2 = part(pg, SPH, '#ff3a2a', s * 1.75, 2.6, 0.48, 0.09, 0.09, 0.03, 0, true); r2.userData.runa = true; }); const gl = glowSpr(pg, 0, 1.6, 0.3, 3.2, '#ff3a2a', 0.25);
        MM.portoes.push({ g: pg, z: pz, glow: gl }); }
      // inimigos da fase
      const [tp, n] = MM_FASES[k]; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + 0.5, r = n === 1 ? 0 : 4.5 + (i % 2) * 2; const e = solta(tp, C.x + Math.cos(a) * r, C.z - 2 + Math.sin(a) * r); e.fase = k; MM.feras.push(e); } }
    // saída (perto da entrada) e portal de saída no último salão
    { const s0 = grp(M, MX, 0, MM_R - 0.9); s0.scale.setScalar(0.75); part(s0, TOR, '#a05aff', 0, 1.3, 0, 1.0, 1.25, 1, 0.02, true); glowSpr(s0, 0, 1.3, 0, 3.5, '#a05aff', 0.5); MM.saida = { x: MX, z: MM_R - 0.9 }; }
    { const C = mmCentro(MM_N - 1); const s1 = grp(M, C.x, 0, C.z - MM_R + 2); part(s1, TOR, '#ffd23c', 0, 1.3, 0, 1.0, 1.25, 1, 0.02, true); glowSpr(s1, 0, 1.3, 0, 3.5, '#ffd23c', 0.6); s1.visible = false; MM.saidaFim = { g: s1, x: C.x, z: C.z - MM_R + 2 }; }
    MM.grupo = M; M.visible = false; }
  const tocha = new T3.PointLight('#ffb070', 0, 20, 1.2); world.add(tocha);
  function mmNaArea(x, z) { for (let k = 0; k < MM_N; k++) { const C = mmCentro(k); if (Math.hypot(x - C.x, z - C.z) < MM_R - 0.3) return true; } for (let k = 0; k < MM_N - 1; k++) { const C = mmCentro(k), z0 = C.z - MM_R + 1.5, z1 = C.z - MM_DZ + MM_R - 1.5; if (Math.abs(x - MX) < 1.9 && z <= z0 && z >= z1 && (MM.aberto[k] || z > MM.portoes[k].z + 0.5)) return true; } return false; }
  function mmLimita(p) { if (mmNaArea(p.x, p.z)) return; let best = null, bd = 1e9; const tenta = (x, z) => { const d = Math.hypot(p.x - x, p.z - z); if (d < bd && mmNaArea(x, z)) { bd = d; best = [x, z]; } };
    for (let k = 0; k < MM_N; k++) { const C = mmCentro(k); const a = Math.atan2(p.z - C.z, p.x - C.x); tenta(C.x + Math.cos(a) * (MM_R - 0.4), C.z + Math.sin(a) * (MM_R - 0.4)); }
    for (let k = 0; k < MM_N - 1; k++) { const C = mmCentro(k); const z0 = C.z - MM_R + 1, z1 = C.z - MM_DZ + MM_R - 1; const z = clamp(p.z, z1 - 1, z0 + 1); tenta(clamp(p.x, MX - 1.9, MX + 1.9), z); if (!MM.aberto[k]) tenta(clamp(p.x, MX - 1.9, MX + 1.9), MM.portoes[k].z + 0.6); }
    if (best) { p.x = best[0]; p.z = best[1]; } }
  function mmFaseAtual() { for (let k = 0; k < MM_N; k++) if (MM.feras.some(e => e.fase === k && !e.morto)) return k; return MM_N; }
  function mmReinicia() { MM.feras.forEach(e => { reseta(e); if (e.tipo === 'dragao') e.vida = e.max = Math.round(VIDA_MAX * 2); }); MM.aberto = MM.portoes.map(() => false); MM.portoes.forEach(P => { P.g.position.y = 0; P.glow.visible = true; }); MM.saidaFim.g.visible = false; }
  function mmMorte(e) { if (e.fase == null) return; const k = e.fase; if (MM.feras.some(x => x.fase === k && !x.morto)) { atualizaMM(); return; }
    if (k < MM_N - 1) { MM.aberto[k] = true; MM.portoes[k].glow.visible = false; som('portao', 1, 1); som('fase', 0.9, 1); aviso('✅ Fase ' + (k + 1) + ' concluída! O portão abriu: ' + MM_NOMES[k + 1] + '.', '#7ad87a'); }
    else { som('fase', 1, 1); MM.saidaFim.g.visible = true; if (!AR.armas.includes('dragao')) solta_loot(e.g.position.x, e.g.position.z + 1.5, 'espdragao', 1); aviso('🐉 O Dragão das Profundezas caiu! Pegue o portal dourado pra sair.', '#ffd23c'); if (AR.mm && AR.mm.estado === 1) { AR.mm.estado = 2; salvaAR(); } }
    atualizaMM(); }
  function entraMasmorra() { cena([{ t: 'Você desce para as profundezas...', v: null }], () => { mmReinicia(); zona = 'masmorra'; dentro = false; MM.grupo.visible = true; heroi.position.set(MX, 0, MM_R - 5.2); facing = Math.PI; camYaw = 0; cam.position.set(MX, 4, MM_R + 4); som('portal', 1, 1); mostrarLugar('Masmorra das Profundezas'); aviso('Fase 1: ' + MM_NOMES[0], '#c8a8ff'); atualizaMM(); }); }
  function saiMasmorra() { cena([{ t: 'De volta à superfície...', v: null }], () => { zona = 'vila'; dentro = false; MM.grupo.visible = false; heroi.position.set(MM_ENT.x + 4, 0, MM_ENT.z); facing = Math.PI / 2; camYaw = -Math.PI / 2; cam.position.set(MM_ENT.x - 2, 4, MM_ENT.z); tocha.intensity = 0; som('portal', 1, 1); mostrarLugar('Vila de Brumafria'); atualizaMM(); }); }
  function mmFrame(dt, p) { if (zona !== 'masmorra') { tocha.intensity = 0; return null; } tocha.position.set(p.x, 3, p.z + 0.5); tocha.intensity = 16;
    MM.portoes.forEach((P, k) => { if (MM.aberto[k] && P.g.position.y > -3.4) P.g.position.y -= dt * 2.2; });
    let al = null; if (Math.hypot(p.x - MM.saida.x, p.z - MM.saida.z) < 1.7) al = { rot: 'SAIR', acao: saiMasmorra }; if (MM.saidaFim.g.visible && Math.hypot(p.x - MM.saidaFim.x, p.z - MM.saidaFim.z) < 2.2) al = { rot: 'SAIR', acao: saiMasmorra }; return al; }
  const anel = new T3.Mesh(new T3.RingGeometry(0.82, 1, 48), new T3.MeshBasicMaterial({ color: '#ff3a2a', transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false, side: T3.DoubleSide })); anel.rotation.x = -Math.PI / 2; anel.visible = false; world.add(anel);
  SABER.push({ x: GX, y: 3, z: GZ + 8, t: 'Gelo derrete com calor: fogo e pólvora dão dano DOBRADO no Golem.' }, { x: -32, y: 1.6, z: -27, t: 'Lobos caçam em grupo. Ataque um de cada vez.' });

  // forja em Brumafria
  const FX0 = -14, FZ0 = 11;
  { const f = grp(world, FX0, 0, FZ0); f.rotation.y = 0.6; tb(f, 0, 0.35, 0, 0.5, 0.7, 0.4, '#3a3a44'); tb(f, 0, 0.78, 0, 0.9, 0.18, 0.35, '#4a4a54'); part(f, CONE, '#4a4a54', 0.55, 0.78, 0, 0.12, 0.3, 0.1).rotation.z = -Math.PI / 2;
    tb(f, -1.6, 0.5, -0.4, 1.4, 1, 1.2, '#7a7a84'); tb(f, -1.6, 1.05, -0.4, 1.0, 0.1, 0.8, '#1a1010'); [0, 1, 2].forEach(i => part(f, CONE, ['#ffb030', '#ff7a1a', '#ffe070'][i], -1.9 + i * 0.3, 1.3, -0.4, 0.14, 0.45, 0.14, 0, true)); glowSpr(f, -1.6, 1.4, -0.4, 3, '#ff8a3a', 0.8);
    tb(f, 1.6, 1, -0.8, 1.6, 0.08, 0.08, '#5a3a24'); [-0.5, 0, 0.5].forEach(o => { tb(f, 1.6 + o, 0.62, -0.78, 0.06, 0.7, 0.012, '#dfe4ee'); tb(f, 1.6 + o, 0.98, -0.78, 0.16, 0.04, 0.04, '#e2c27a'); }); [-1, 1].forEach(s => tb(f, 1.6 + s * 0.8, 0.5, -0.8, 0.1, 1, 0.1, '#5a3a24'));
    const placa = canvasTex(256, 96, (x, w, h) => { x.fillStyle = '#6a4a2a'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffe8b0'; x.font = '900 46px system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('⚒ FORJA', w / 2, h / 2); });
    const pl = new T3.Mesh(new T3.PlaneGeometry(1.6, 0.6), new T3.MeshBasicMaterial({ map: placa, toneMapped: false, side: T3.DoubleSide })); pl.position.set(0, 2.1, 0.3); f.add(pl); [-0.7, 0.7].forEach(x => tb(f, x, 1.05, 0.3, 0.08, 2.1, 0.08, '#5a3a24'));
    COL.push({ t: 'c', x: FX0, z: FZ0, r: 0.6 }, { t: 'c', x: FX0 - 1.6 * Math.cos(0.6) - 0.4 * Math.sin(0.6), z: FZ0 + 1.6 * Math.sin(0.6) - 0.4 * Math.cos(0.6), r: 0.9 }); }
  SABER.push({ x: FX0, y: 2.6, z: FZ0, t: 'Aço = ferro + um pouco de carbono. Mais duro que ferro puro.' });

  function abrirLoja() { if (conversa || cenaQ) return; som('forja', 0.8); const L = $('loja-lista'); L.innerHTML = ''; $('loja-m').textContent = AR.inv.moedas;
    Object.keys(ARMAS).forEach(k => { const A = ARMAS[k], tem = AR.armas.includes(k); if (A.classe || A.oculta || (A.drop && !AR.armas.includes(k))) return; const b = document.createElement('div'); b.className = 'item';
      const preco = A.preco ? `${A.preco} 💰${A.precisa ? ' + 💎 Coração de Gelo' : ''}` : 'Presente do seu pai';
      b.innerHTML = `<span class="ic">${A.icone}</span><div class="tx"><b>${A.nome}</b><small>${A.longe ? 'De longe' : 'Corpo a corpo'} · dano ${A.dano}</small><small>${A.desc}</small></div>`;
      const bt = document.createElement('button'); bt.className = 'cb';
      if (tem) { bt.textContent = AR.arma === k ? 'Equipada' : 'Equipar'; bt.disabled = AR.arma === k; tapBtn(bt, () => { if (AR.arma === k) return; AR.arma = k; salvaAR(); mostraArma(); abrirLoja(); }); }
      else { const ok = AR.inv.moedas >= A.preco && (!A.precisa || AR.inv[A.precisa] > 0); bt.innerHTML = preco; bt.disabled = !ok; tapBtn(bt, () => { if (!ok) return; AR.inv.moedas -= A.preco; som('compra', 0.8, 1); if (A.precisa) AR.inv[A.precisa]--; AR.armas.push(k); AR.arma = k; salvaAR(); mostraArma(); atualizaInv(); aviso('Nova arma: ' + A.icone + ' ' + A.nome + '!', '#ffd23c'); abrirLoja(); }); }
      b.appendChild(bt); L.appendChild(b); });
    const sec = t => { const h = document.createElement('div'); h.className = 'loja-sec'; h.textContent = t; L.appendChild(h); };
    const linha = (ic, nome, sub, tem, vestido, compra, veste, cor) => { const b = document.createElement('div'); b.className = 'item'; b.innerHTML = `<span class="ic"${cor ? ` style="text-shadow:0 0 8px ${cor}"` : ''}>${ic}</span><div class="tx"><b>${nome}</b><small>${sub}</small></div>`;
      const bt = document.createElement('button'); bt.className = 'cb'; if (tem) { bt.textContent = vestido ? 'Vestido' : 'Vestir'; bt.disabled = vestido; tapBtn(bt, () => { if (vestido) return; veste(); abrirLoja(); }); } else { bt.innerHTML = 'Grátis · 0 💰'; tapBtn(bt, () => { som('compra', 0.8, 1); compra(); salvaAR(); abrirLoja(); }); } b.appendChild(bt); L.appendChild(b); };
    Object.keys(CASACOS).forEach(c => { const C = CASACOS[c]; sec(C.icone + ' ' + C.nome + ' · 5 peças (+' + SOB_DEF + '% cada, conjunto +' + SOB_BONUS + '%)');
      const todas = SOB_PECAS.every(([k]) => AR.sobs.includes(c + ':' + k)), vest = SOB_PECAS.every(([k]) => AR.pecas[k] === c);
      linha('✨', 'Conjunto completo', C.desc, todas, vest, () => { SOB_PECAS.forEach(([k]) => { if (!AR.sobs.includes(c + ':' + k)) AR.sobs.push(c + ':' + k); }); aviso('Comprou: ' + C.icone + ' ' + C.nome + ' completo!', '#ffd23c'); }, () => { if (AR.fantasia !== 'comum') { AR.fantasia = 'comum'; escondeTrajes(); } SOB_PECAS.forEach(([k]) => AR.pecas[k] = c); salvaAR(); atualizaPecas(); aplicaNivel(); setTimeout(fazRetrato, 60); }, C.gem);
      SOB_PECAS.forEach(([k, ic, nm]) => { const id = c + ':' + k; linha(ic, nm + ' · ' + C.nome, 'Defesa +' + SOB_DEF + '%', AR.sobs.includes(id), AR.pecas[k] === c, () => { AR.sobs.push(id); aviso('Comprou: ' + ic + ' ' + nm + ' · ' + C.nome, '#ffd23c'); }, () => vestePeca(k, true, c), C.gem); }); });
    sec('🧙 Armaduras de Mago · conjunto inteiro');
    Object.keys(MAGOS).forEach(m => { const f = 'mago_' + m, F = FANT[f]; linha(F.icone, F.nome, 'Defesa +' + F.def + '% · mana +' + F.mana + ' · ' + F.desc, AR.fantasias.includes(f), AR.fantasia === f, () => { AR.fantasias.push(f); aviso('Comprou: ' + F.icone + ' ' + F.nome, '#ffd23c'); }, () => vesteFantasia(f)); });
    const v = document.createElement('div'); v.className = 'item'; v.innerHTML = `<span class="ic">🐺</span><div class="tx"><b>Vender peles de lobo</b><small>3 💰 cada · você tem ${AR.inv.pele}</small></div>`; const bv = document.createElement('button'); bv.className = 'cb'; bv.textContent = 'Vender tudo'; bv.disabled = !AR.inv.pele;
    tapBtn(bv, () => { if (!AR.inv.pele) return; const g = AR.inv.pele * 3; AR.inv.moedas += g; AR.inv.pele = 0; salvaAR(); atualizaInv(); aviso('Vendeu as peles: +' + g + ' 💰', '#ffd23c'); abrirLoja(); }); v.appendChild(bv); L.appendChild(v);
    $('loja').hidden = false; }
  tapBtn($('loja-fecha'), () => { $('loja').hidden = true; });

  // ---- ataque do Leonardo ----
  let atkT = 9, atkN = 1, atkHit = true, atkCd = 0, comboT = 0;
  function feraAtiva(e) { return !e.morto && e.T.zona === zona && !dentro; }
  function maisPerto(r) { let m = null, md = r; FERAS.forEach(e => { if (!feraAtiva(e)) return; const d = Math.hypot(e.g.position.x - heroi.position.x, e.g.position.z - heroi.position.z) - e.T.raio; if (d < md) { md = d; m = e; } }); return m; }
  function atacar() { if (!guildPanel.hidden || conversa || cenaQ || desmaiado || !$('fim').hidden) return; if (dentro) { aviso('Dentro de casa não! A mãe briga.', '#ffb04a'); return; } if (atkCd > 0) return; const A = ARMAS[AR.arma];
    const e = maisPerto(A.longe ? 18 : 4.5); if (e) facing = Math.atan2(e.g.position.x - heroi.position.x, e.g.position.z - heroi.position.z);
    atkN = A.longe ? 1 : comboT > 0 ? (atkN % 3) + 1 : 1; comboT = 0.8; atkT = 0; atkHit = false; som(A.longe ? 'tiro' : AR.arma === 'bastao' || AR.arma === 'punho' ? 'golpe' : 'espada', 0.6, atkN === 3 ? 0.85 : null); atkCd = A.cd * (atkN === 3 ? 1.5 : 1) * (BM && BM.atkVel ? BM.atkVel : 1) * (BUFF.furia > 0 ? 0.8 : 1); }
  const virotes = []; const viroteGeo = new T3.BoxGeometry(0.04, 0.04, 0.6);
  function golpe() { const A = ARMAS[AR.arma], p = heroi.position;
    if (A.longe && A.proj) { (BUFF.tripla > 0 || (BM && BM.ataque === 'tripla') ? [-0.18, 0, 0.18] : [0]).forEach(o => proj(p.x, p.y + 1.25, p.z, facing + o, A.proj, A.dano * atkMult(), 26, A.alc, { veneno: BUFF.veneno > 0, fura: BM && BM.ataque === 'fura', explode: BM && BM.ataque === 'explode' ? { r: 2.2, dano: A.dano * atkMult() * 0.8, tipo: 'luz' } : null, marca: BM && BM.ataque === 'marca' })); return; }
    if (A.longe && BM && BM.ataque === 'tripla') { [-0.18, 0, 0.18].forEach(o => proj(p.x, p.y + 1.25, p.z, facing + o, '#d8c8a0', A.dano * atkMult(), 30, A.alc)); return; }
    if (A.longe) { const m = new T3.Mesh(viroteGeo, tm('#5a3a24')); m.position.set(p.x, p.y + 1.2, p.z); m.rotation.y = facing; world.add(m); virotes.push({ m, t: 0, dx: Math.sin(facing), dz: Math.cos(facing), dano: A.dano * atkMult() }); return; }
    const mult = [1, 1, 1.15, 1.8][atkN]; let acertou = false; const alcX = BM && BM.ataque === 'area' ? 1.2 : 0; if (BM && BM.ataque === 'proj') proj(p.x, p.y + 1.2, p.z, facing, BM.cor, A.dano * atkMult() * 0.8, 26, 14, { fura: true });
    FERAS.forEach(e => { if (!feraAtiva(e)) return; const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz); if (d > A.alc + e.T.raio + alcX) return;
      let da = Math.atan2(dx, dz) - facing; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; if (atkN !== 3 && !A.giro && !(BM && BM.ataque === 'area') && Math.abs(da) > 1.25 && d > e.T.raio + 0.4) return;
      acertou = true; const cr = critico(); dano(e, A.dano * mult * atkMult() * (cr ? 2 : 1), A.gelo ? 'gelo' : null, cr); if (BUFF.veneno > 0 || A.fogo) e.queima = 3; if (A.fogo) fx('chama', [e.g.position.x, 0.6, e.g.position.z], 0.5, facing); if (BM && BM.ataque === 'marca') e.vuln = Math.max(e.vuln, 4); if (BM && BM.ataque === 'empurra') { e.stun = Math.max(e.stun, 0.5); empurra(e, dx / (d || 1), dz / (d || 1), 1.5); } if (A.gelo && Math.random() < 0.25) congelar(e, 1.5); empurra(e, dx / (d || 1), dz / (d || 1), atkN === 3 ? 1.6 : 0.6); });
    if (acertou) tremor = Math.max(tremor, atkN === 3 ? 0.25 : 0.1); }
  function empurra(e, nx, nz, f) { if (e.T.chefe) return; e.g.position.x += nx * f; e.g.position.z += nz * f; }
  function armaPose() { const P = heroi.userData.P, A = ARMAS[AR.arma] || ARMAS.bastao;
    if (atkT < 0.34) { const u = eOut(clamp(atkT / 0.3));
      if (A.longe) { P.shR.rotation.set(-1.55, 0, 0); P.elR.rotation.set(0, 0, 0); P.shL.rotation.set(-1.4, 0, 0.3); P.elL.rotation.set(-0.3, 0, 0); }
      else if (atkN === 1) { P.shR.rotation.set(lerp(-2.9, -0.4, u), 0, 0.15); P.elR.rotation.set(-0.15, 0, 0); P.spine.rotation.x = lerp(-0.1, 0.25, u); }
      else if (atkN === 2) { P.shR.rotation.set(-1.45, 0, 0); P.elR.rotation.set(-0.1, 0, 0); P.spine.rotation.y = lerp(1.0, -1.0, u); }
      else { P.shR.rotation.set(-1.5, 0, 1.0); P.elR.rotation.set(0, 0, 0); heroi.rotation.y = facing + u * Math.PI * 2; } }
    else if (A.longe && naMao) { P.shR.rotation.x = -0.7; P.elR.rotation.x = -0.9; } }

  // ---- dano nos bichos ----
  function dano(e, n, tipo, crit) { if (e.morto) return; if (e.T.chefe && tipo === 'fogo') n *= 2; if (e.vuln > 0) n *= 1.5; n = Math.round(n); e.vida -= n; e.hitT = 0; som(crit ? 'critico' : 'acerto', crit ? 0.8 : 0.55, null, 0.05); enche(crit ? 5 : 3); if (BM && BM.roubo && n > 0) { const rb = Math.max(1, Math.round(n * BM.roubo)); if (vida < VIDA_MAX) { vida = Math.min(VIDA_MAX, vida + rb); if (Math.random() < 0.4) numero(heroi.position, '+' + rb + ' ❤️', '#c890ff', 2.3); } }
    numero(e.g.position, crit ? '💥' + n : String(n), crit ? '#ffd23c' : tipo === 'fogo' ? '#ff9a3a' : tipo === 'gelo' ? '#9ae6ff' : tipo === 'raio' ? '#fff27a' : '#ffffff', e.T.alt + 0.3);
    if (e.estado === 'anda' || e.estado === 'volta') { e.estado = 'caca'; }
    if (e.vida <= 0) morre(e); }
  function congelar(e, s) { if (e.morto) return; e.congela = Math.max(e.congela, e.T.chefe ? s * 0.35 : s); }
  function morre(e) { somEm(SOM_MORTE[e.tipo], e.g.position, 1, 0.02); e.morto = true; e.mortoT = 0; e.hp.style.display = 'none'; const p = e.g.position; const [a, b] = e.T.moedas; solta_loot(p.x, p.z, 'moedas', a + Math.floor(Math.random() * (b - a + 1)));
    e.T.itens.forEach(([it, ch]) => { if (Math.random() < ch) solta_loot(p.x + (Math.random() - .5), p.z + (Math.random() - .5), it, 1); });
    AR.abates[e.tipo] = (AR.abates[e.tipo] || 0) + 1; if (e.tipo === 'goblin') goblinMorto(); if (e.T.zona === 'masmorra') mmMorte(e); enche(e.T.chefe ? 60 : 12); ganhaXp(XP_TIPO[e.tipo] || 10, true); const tot = Object.values(AR.abates).reduce((s, v) => s + v, 0); salvaAR();
    if (e.tipo === 'morcego') { ganha('morcego1', 3, 'derrotou o Morcego Gigante'); aviso('🏆 O MORCEGO GIGANTE CAIU! Pegue as 🦇 Asas de Morcego no chão.', '#c8a8ff'); }
    else if (e.T.chefe) { ganha('golem1', 5, 'derrotou o Golem de Gelo'); aviso('🏆 O GOLEM DE GELO CAIU! Leve o 💎 Coração de Gelo pra Forja.', '#7ad8ff'); }
    else { ganha('abate1:' + e.tipo, 2, 'primeiro ' + e.T.nome); if (tot % 5 === 0) setTimeout(() => ganha('abates:' + tot, 1, tot + ' bichos derrotados'), 900); } }
  // ---- coisas que caem ----
  const LOOT = []; const EMO = {};
  function emoTex(t) { return EMO[t] || (EMO[t] = canvasTex(96, 96, (x, w, h) => { x.font = '72px system-ui,"Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, w / 2, h / 2 + 4); })); }
  function solta_loot(x, z, item, n) { const s = new T3.Sprite(new T3.SpriteMaterial({ map: emoTex(ITENS[item]), transparent: true, depthWrite: false, toneMapped: false })); s.scale.set(0.6, 0.6, 1); s.position.set(x, 0.5, z); world.add(s); LOOT.push({ s, item, n, t: 0, zona }); }
  // ---- dano no Leonardo ----
  function danoHeroi(n, de) { if (desmaiado) return; const cl = CLA(); if (cl && Math.random() < (cl.esq || 0) + (BM && BM.esq ? BM.esq : 0)) { numero(heroi.position, 'Desviou!', '#9ae6ff', 2.1); return; } n *= 1 - defesa() / 100; if (muralhaT > 0) n *= 0.2; if (BUFF.espelho > 0) { n *= 0.5; if (de && !de.morto) dano(de, n, 'luz'); } if (BM && BM.espelho && de && !de.morto) dano(de, n * BM.espelho, 'luz'); enche(4); if (ativo.escudo) { n *= Math.max(0.1, 0.3 - (nivelHab('escudo') - 1) * 0.05); fx('luz', [heroi.position.x, heroi.position.y, heroi.position.z], 0.3); } n = Math.round(n); vida -= n; som('dano', 0.7, null, 0.3); semDanoT = 0; flash('rgba(255,40,40,.35)'); tremor = Math.max(tremor, 0.18);
    numero(heroi.position, '-' + n, '#ff5a5a', 2.1); if (vida <= 0) { vida = 0; desmaiar(); } }
  function desmaiar() { som('desmaio', 1, 1); desmaiado = true; if (typeof bmDesliga === 'function') bmDesliga(); FERAS.forEach(e => { if (!e.morto) { e.estado = 'volta'; } }); ativo.vento = ativo.escudo = ativo.planar = false; montaBarra();
    setTimeout(() => cena([{ t: 'Tudo ficou escuro...', v: 'nar03' }, { t: 'Leonardo acordou em casa, na cama. A mãe cuidou dele a noite toda.', v: 'nar04' }, { t: '"Meu filho, cuidado lá fora! Come alguma coisa antes de sair de novo."', n: 'Mãe', v: 'mae03' }], () => {
      zona = 'vila'; MM.grupo.visible = false; dentro = true; heroi.position.set(IX + 2, 0, -1.8); facing = Math.PI; camYaw = 0; vida = VIDA_MAX; mana = MANA_MAX; desmaiado = false; mostrarLugar('Casa da família'); }), 400); }

  // ---- poderes de combate ----
  const RAIOS = [];
  function relampago(a, b) { const n = 10; for (let i = 0; i <= n; i++) { const u = i / n; const j = i === 0 || i === n ? 0 : 0.35; const s = glowSpr(world, lerp(a.x, b.x, u) + (Math.random() - .5) * j, lerp(a.y, b.y, u) + (Math.random() - .5) * j, lerp(a.z, b.z, u) + (Math.random() - .5) * j, 0.7, '#fff6a0', 1); RAIOS.push({ s, t: 0 }); } }
  function combatePoder(id) { const p = heroi.position;
    const naFrente = (alc, ang) => FERAS.filter(e => { if (!feraAtiva(e)) return false; const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz); if (d > alc + e.T.raio) return false; let da = Math.atan2(dx, dz) - facing; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; return Math.abs(da) < ang || d < e.T.raio + 0.5; });
    const perto = r => FERAS.filter(e => feraAtiva(e) && Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z) < r + e.T.raio);
    if (id === 'polvora') { const f = [p.x + Math.sin(facing) * 3.2, p.z + Math.cos(facing) * 3.2]; FERAS.forEach(e => { if (feraAtiva(e) && Math.hypot(e.g.position.x - f[0], e.g.position.z - f[1]) < 3.6 + e.T.raio) { dano(e, 60 * atkMult(), 'fogo'); const dx = e.g.position.x - f[0], dz = e.g.position.z - f[1], d = Math.hypot(dx, dz) || 1; empurra(e, dx / d, dz / d, 2); } }); }
    if (id === 'clarao') perto(9).forEach(e => { e.stun = 3 * (1 + (potAtual - 1) / 2); dano(e, 10 * atkMult(), 'luz'); });
    if (id === 'remedio') { if (vida < VIDA_MAX) { const cu = Math.round(40 * potAtual); vida = Math.min(VIDA_MAX, vida + cu); numero(p, '+' + cu + ' ❤️', '#7ad87a'); } }
    if (id === 'chama') { const e = maisPerto(5); if (e) facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); fx('chama', [p.x, p.y, p.z], 0.8, facing); const Mc = atkMult(); setTimeout(() => naFrente(4.5, 0.7).forEach(e => { dano(e, 30 * Mc, 'fogo'); e.queima = 3; }), 120); aviso('Chama: óleo + faísca. O fogo precisa de combustível, calor e oxigênio.', '#ff8a3a'); }
    if (id === 'gelo') { const e = maisPerto(10); if (!e) { fx('gelo', [p.x, p.y, p.z], 0.8); aviso('Nenhum bicho perto pra congelar.', '#9ae6ff'); return; } facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); fx('gelo', [e.g.position.x, 0, e.g.position.z], 0.9); congelar(e, 3 * (1 + (potAtual - 1) / 2)); dano(e, 15 * atkMult(), 'gelo'); aviso('Gelo: a mana tira o calor da água do corpo dele.', '#9ae6ff'); }
    if (id === 'raio') { let atual = { x: p.x, y: p.y + 1.3, z: p.z }; const ja = []; let r = 9;
      for (let k = 0; k < 4; k++) { let m = null, md = r; FERAS.forEach(e => { if (!feraAtiva(e) || ja.includes(e)) return; const d = Math.hypot(e.g.position.x - atual.x, e.g.position.z - atual.z); if (d < md) { md = d; m = e; } }); if (!m) break;
        const alvoP = { x: m.g.position.x, y: m.T.alt * 0.6, z: m.g.position.z }; relampago(atual, alvoP); ja.push(m); dano(m, 35 * atkMult(), 'raio'); m.stun = Math.max(m.stun, 0.6); atual = alvoP; r = 6; }
      if (!ja.length) { relampago({ x: p.x, y: 6, z: p.z }, { x: p.x + Math.sin(facing) * 3, y: 0, z: p.z + Math.cos(facing) * 3 }); aviso('Raio! Eletricidade pula de um corpo pro outro.', '#fff27a'); }
      flash('rgba(255,250,200,.4)'); tremor = Math.max(tremor, 0.2); }
    if (id === 'ima') { fx('vento', [p.x, p.y, p.z], 0.8); LOOT.forEach(l => { if (l.zona === zona && Math.hypot(l.s.position.x - p.x, l.s.position.z - p.z) < 18) l.puxa = true; });
      perto(8).forEach(e => { if (!e.T.chefe) { const dx = p.x - e.g.position.x, dz = p.z - e.g.position.z, d = Math.hypot(dx, dz) || 1; const k = Math.max(0, d - 1.4) / d; e.g.position.x += dx * k * 0.7; e.g.position.z += dz * k * 0.7; } e.stun = Math.max(e.stun, 1); e.vuln = 5; });
      aviso('Ímã: puxa o ferro e as moedas. Os bichos ficam desprotegidos (+50% de dano).', '#d88aff'); } }
  function acertaFera(pos, r) { return FERAS.find(e => feraAtiva(e) && Math.hypot(e.g.position.x - pos.x, e.g.position.z - pos.z) < r + e.T.raio && pos.y < e.T.alt + 0.6); }

  // ---- inteligência dos bichos ----
  const COLZ = () => zona === 'valdren' ? COLV : COL;
  function anda(e, tx, tz, v, dt) { const g = e.g.position, dx = tx - g.x, dz = tz - g.z, d = Math.hypot(dx, dz); if (d < 0.05) return 0; const s = Math.min(d, v * dt); g.x += dx / d * s; g.z += dz / d * s; e.ry = viraPara(e.ry, Math.atan2(dx, dz), dt * 8); colide(g, COLZ()); return v; }
  function viraPara(a, b, k) { let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return a + d * clamp(k); }
  const vH = new T3.Vector3();
  function ferasFrame(dt, p) { const livre = !conversa && !cenaQ && !desmaiado && $('fim').hidden && !Q.naCarroca; let chefeV = null;
    FERAS.forEach(e => { const T = e.T; const on = T.zona === zona && !dentro; e.g.visible = on && !(e.morto && e.mortoT > 1.8); if (!on) { e.hp.style.display = 'none'; if (e.morto) e.mortoT += dt; if (e.morto && e.mortoT > (T.volta || 45)) reseta(e); return; }
      if (e.morto) { e.mortoT += dt; e.b.rotation.z = Math.min(Math.PI / 2, e.mortoT * 5); e.b.position.y = T.voa ? -Math.min(2.1, e.mortoT * 5) : -Math.min(1, e.mortoT * 0.3) * (e.mortoT > 1 ? 0.5 : 0); e.gelo.visible = false; if (e.mortoT > (T.volta || 45) && Math.hypot(p.x - e.home[0], p.z - e.home[1]) > (T.perto || 18)) reseta(e); return; }
      const g = e.g.position; const d = Math.hypot(p.x - g.x, p.z - g.z); let v = 0;
      e.cd -= dt; e.vuln -= dt; e.hitT += dt; if (e.queima > 0) { e.queima -= dt; e.qT = (e.qT || 0) + dt; if (e.qT > 1) { e.qT = 0; dano(e, 5, 'fogo'); if (e.morto) return; } }
      e.gelo.visible = e.congela > 0; if (e.congela > 0) { e.congela -= dt; }
      else if (e.stun > 0) { e.stun -= dt; e.b.rotation.z = Math.sin(gT * 18) * 0.12; }
      else { e.b.rotation.z = 0;
        if (e.estado === 'anda') { e.t -= dt; if (e.tipo === 'morcego') { e.orbA = (e.orbA == null ? Math.random() * 6.28 : e.orbA) + dt * 0.35; e.alvoW = [Math.sin(e.orbA) * 34, -5 + Math.cos(e.orbA) * 34]; } else if (e.t <= 0) { e.t = 2 + Math.random() * 3; const a = Math.random() * 6.28, r = Math.random() * (T.chefe ? 3 : 5); e.alvoW = [e.home[0] + Math.cos(a) * r, e.home[1] + Math.sin(a) * r]; } v = anda(e, e.alvoW[0], e.alvoW[1], T.vel * 0.35, dt) ? T.vel * 0.35 : 0; if (d < T.aggro && livre) { somEm(SOM_GRITO[e.tipo], g, 0.8, 0.4); e.estado = 'caca'; if (!T.chefe && Math.random() < 0.5) numero(g, '!', '#ff5a3a', T.alt + 0.4); } }
        else if (e.estado === 'caca') { if (!livre || Math.hypot(g.x - e.home[0], g.z - e.home[1]) > (T.chefe ? 14 : 24) || d > T.aggro * 2.2 || (zona === 'vila' && Math.hypot(p.x - MW.x, p.z - MW.z) < MW.r - 1.5 && Math.hypot(g.x - MW.x, g.z - MW.z) > MW.r)) e.estado = 'volta';
          else if (T.investe && d < 10 && d > 2.6 && e.cd <= 0) { e.estado = 'mira'; e.t = 0; }
          else if (d <= T.alc + 0.2 && e.cd <= 0) { e.estado = 'ataque'; e.t = 0; }
          else if (d > T.alc * 0.75) v = anda(e, p.x, p.z, T.vel, dt); else e.ry = viraPara(e.ry, Math.atan2(p.x - g.x, p.z - g.z), dt * 8); }
        else if (e.estado === 'mira') { e.t += dt; e.ry = viraPara(e.ry, Math.atan2(p.x - g.x, p.z - g.z), dt * 10); e.b.position.z = -Math.sin(e.t * 30) * 0.05; if (e.t > 0.6) { e.estado = 'investe'; e.t = 0; e.dir = [Math.sin(e.ry), Math.cos(e.ry)]; e.bateu = false; } }
        else if (e.estado === 'investe') { e.t += dt; const ox = g.x, oz = g.z; g.x += e.dir[0] * 12 * dt; g.z += e.dir[1] * 12 * dt; colide(g, COLZ()); v = 12; if (!e.bateu && d < 1.4) { e.bateu = true; somEm('javali', g, 0.8); danoHeroi(T.dano + 4, e); const nx = p.x - g.x, nz = p.z - g.z, nd = Math.hypot(nx, nz) || 1; p.x += nx / nd * 1.5; p.z += nz / nd * 1.5; }
          if (e.t > 0.75 || Math.hypot(g.x - ox, g.z - oz) < 12 * dt * 0.5) { e.estado = 'caca'; e.cd = T.cd; e.b.position.z = 0; } }
        else if (e.estado === 'ataque') { e.t += dt; const wind = T.chefe ? 0.9 : 0.35; e.ry = viraPara(e.ry, Math.atan2(p.x - g.x, p.z - g.z), dt * (T.chefe ? 2 : 6));
          if (T.chefe) { const u = clamp(e.t / wind); e.arms.forEach(a => a.rotation.x = -u * 2.6); if (T.voa) e.b.position.y = u * 0.8; anel.visible = true; anel.position.set(g.x, 0.05, g.z); anel.scale.setScalar(T.alc * (0.4 + u * 0.6)); anel.material.opacity = 0.3 + u * 0.4; }
          else { e.b.rotation.x = e.t < wind ? -0.25 * (e.t / wind) : 0.3; if (e.head) e.head.rotation.x = e.t < wind ? -0.3 : 0.4; if (e.tipo === 'goblin') e.arms[1].rotation.x = e.t < wind ? -2.4 * (e.t / wind) : 0.7; }
          if (e.t >= wind && !e.bateu2) { e.bateu2 = true; somEm(SOM_ATQ[e.tipo], g, T.chefe ? 1 : 0.6, 0.15); if (T.chefe) { e.arms.forEach(a => a.rotation.x = 0.4); anel.visible = false; if (T.voa) e.b.position.y = -1.3; fx(T.voa ? 'vento' : 'gelo', [g.x, 0, g.z], 0.8); fx('fumo', [g.x, 0, g.z], 1.2); tremor = Math.max(tremor, 0.5); if (d < T.alc + 0.2 && p.y < 1.2) danoHeroi(T.dano, e); } else if (d < T.alc + 0.6) danoHeroi(T.dano, e); }
          if (e.t > wind + 0.3) { e.estado = 'caca'; e.cd = T.cd * (T.chefe && e.vida < e.max / 2 ? 0.6 : 1); e.bateu2 = false; e.b.rotation.x = 0; if (T.voa) e.b.position.y = 0; if (e.head) e.head.rotation.x = 0; e.arms.forEach(a => a.rotation.x = 0); } }
        else if (e.estado === 'volta') { v = anda(e, e.home[0], e.home[1], T.vel, dt) ? T.vel : 0; e.vida = Math.min(e.max, e.vida + dt * e.max * 0.15); if (Math.hypot(g.x - e.home[0], g.z - e.home[1]) < 1.5) { e.estado = 'anda'; e.vida = e.max; } if (d < T.aggro * 0.6 && livre) e.estado = 'caca'; }
        if (d < T.raio + 0.3) { const nx = g.x - p.x, nz = g.z - p.z, nd = Math.hypot(nx, nz) || 1; g.x = p.x + nx / nd * (T.raio + 0.3); g.z = p.z + nz / nd * (T.raio + 0.3); }
        if (zona === 'masmorra') mmLimita(g);
        if (zona === 'vila') { const r = Math.hypot(g.x, g.z + 6); if (r > 88) { g.x *= 88 / r; g.z = (g.z + 6) * 88 / r - 6; } const rw = Math.hypot(g.x - MW.x, g.z - MW.z); if (rw < MW.r + 0.9 && rw > 1e-3) { g.x = MW.x + (g.x - MW.x) * (MW.r + 0.9) / rw; g.z = MW.z + (g.z - MW.z) * (MW.r + 0.9) / rw; } } }
      e.g.rotation.y = e.ry; const sc = e.hitT < 0.15 ? 1 + (0.15 - e.hitT) : 1; e.b.scale.setScalar(sc);
      e.L.forEach((l, i) => { const ph = T.chefe ? i * Math.PI : (i === 0 || i === 3 ? 0 : Math.PI); l.rotation.x = v > 0.2 ? Math.sin(gT * (v * 2.2 + 4) + ph) * 0.6 : 0; });
      if (e.asas) { const f = e.estado === 'ataque' ? 14 : 7; e.asas.forEach((a, i) => a.rotation.z = (i ? 1 : -1) * Math.sin(gT * f) * 0.6); if (e.estado !== 'ataque') e.b.position.y = Math.sin(gT * f) * 0.12; }
      if (T.chefe && e.estado !== 'ataque') e.arms.forEach((a, i) => a.rotation.x = v > 0.2 ? Math.sin(gT * 4 + i * Math.PI) * 0.3 : 0);
      if (T.chefe) { if (d < 22) chefeV = e; e.hp.style.display = 'none'; return; }
      // barrinha de vida
      if (e.vida < e.max && d < 25) { vH.set(g.x, T.alt + 0.25, g.z); vH.project(cam); if (vH.z < 1 && Math.abs(vH.x) < 1.05 && Math.abs(vH.y) < 1.05) { e.hp.style.display = 'block'; e.hp.style.left = ((vH.x * 0.5 + 0.5) * window.innerWidth) + 'px'; e.hp.style.top = ((-vH.y * 0.5 + 0.5) * window.innerHeight) + 'px'; e.hp.firstChild.style.width = (e.vida / e.max * 100) + '%'; } else e.hp.style.display = 'none'; } else e.hp.style.display = 'none'; });
    if (!FERAS.some(e => e.T.chefe && e.estado === 'ataque' && !e.morto && e.T.zona === zona && !dentro)) anel.visible = false;
    const cb = $('chefe'); cb.hidden = !chefeV; if (chefeV && chefeV.T.barra) cb.firstChild.textContent = chefeV.T.barra; if (chefeV) $('chefe-fill').style.width = (chefeV.vida / chefeV.max * 100) + '%'; }

  function combateFrame(dt, p) {
    if (!desmaiado) { semDanoT += dt; if (semDanoT > 5 && vida < VIDA_MAX) vida = Math.min(VIDA_MAX, vida + dt * 3); }
    $('vida-fill').style.width = (vida / VIDA_MAX * 100) + '%'; $('vida-num').textContent = Math.ceil(vida); $('vida').classList.toggle('baixa', vida < 30);
    atkT += dt; comboT -= dt; atkCd -= dt; if (!atkHit && atkT > 0.12) { atkHit = true; golpe(); }
    ferasFrame(dt, p);
    for (let i = virotes.length - 1; i >= 0; i--) { const v = virotes[i]; v.t += dt; v.m.position.x += v.dx * 30 * dt; v.m.position.z += v.dz * 30 * dt; const e = acertaFera(v.m.position, 0.5); if (e) { const cr = critico(); dano(e, v.dano * (cr ? 2 : 1), null, cr); v.t = 9; } if (v.t > 0.6) { world.remove(v.m); virotes.splice(i, 1); } }
    for (let i = RAIOS.length - 1; i >= 0; i--) { const r = RAIOS[i]; r.t += dt; r.s.material.opacity = 1 - r.t / 0.3; if (r.t > 0.3) { world.remove(r.s); r.s.material.dispose(); RAIOS.splice(i, 1); } }
    for (let i = LOOT.length - 1; i >= 0; i--) { const l = LOOT[i]; l.t += dt; l.s.visible = l.zona === zona && !dentro; if (!l.s.visible) continue; const s = l.s.position; s.y = 0.5 + Math.sin(gT * 3 + i) * 0.12;
      const d = Math.hypot(s.x - p.x, s.z - p.z); if (l.puxa || (d < 3 && l.t > 0.6)) { const k = clamp(dt * (l.puxa ? 6 : 4)); s.x += (p.x - s.x) * k; s.z += (p.z - s.z) * k; }
      if (d < 1.0 && l.t > 0.4) { som(l.item === 'moedas' ? 'moeda' : 'item', 0.6, null, 0.08); if (l.item === 'espdragao') { if (!AR.armas.includes('dragao')) { AR.armas.push('dragao'); som('missao_ok', 1, 1); flash('rgba(255,140,40,.5)'); aviso('🐉 Você pegou a ESPADA DO DRAGÃO DE FOGO! Equipe no inventário 🎒.', '#ff9a3a'); } } else if (l.item === 'asas') { if (!AR.cosms.includes('morcego')) { AR.cosms.push('morcego'); aviso('🦇 Você ganhou as Asas de Morcego! Equipe no perfil, no espaço Costas.', '#c8a8ff'); } else aviso('🦇 Você já tem as Asas de Morcego.', '#8a9aba'); } else AR.inv[l.item] = (AR.inv[l.item] || 0) + l.n; salvaAR(); atualizaInv(); numero(p, '+' + l.n + ' ' + ITENS[l.item], '#ffd23c', 2.4); if (l.item === 'coracao') aviso('💎 Coração de Gelo! O ferreiro da Forja faz uma Espada Glacial com ele.', '#7ad8ff'); world.remove(l.s); LOOT.splice(i, 1); }
      else if (l.t > 90) { world.remove(l.s); LOOT.splice(i, 1); } } }
  function combateAlvo(p) { if (zona === 'vila' && !dentro && Math.hypot(p.x - FX0, p.z - FZ0) < 2.4) return { acao: abrirLoja, rot: 'FORJA' }; return null; }
  tapBtn($('atacar'), atacar); tapBtn($('arma'), trocaArma); tapBtn($('inv-cw'), comer);
  window.addEventListener('keydown', e => { if (e.code === 'KeyF' || e.code === 'KeyJ') atacar(); if (e.code === 'KeyQ') trocaArma(); if (e.code === 'KeyC') comer(); });
  mostraArma(); atualizaInv();
  SABER.forEach(sb => { if (!sb.el) { const d = document.createElement('div'); d.className = 'tag'; d.textContent = sb.t; $('saber').appendChild(d); sb.el = d; } });

  // ===================== NÍVEL, PERFIL, INVENTÁRIO E FANTASIAS =====================
  AR.nv = AR.nv || 1; AR.xp = AR.xp || 0; AR.fantasias = AR.fantasias || ['comum', 'celeste']; AR.fantasia = AR.fantasia || 'comum'; AR.pecas = AR.pecas || {};
  const NV_MAX = 100; const xpPara = n => 60 + n * 30;
  function aplicaNivel() { const c = CLASSES && CLASSES[AR.classe]; VIDA_MAX = (c ? c.vida : 100) + (AR.nv - 1) * 5; MANA_MAX = (c ? c.mana : 100) + (AR.nv - 1) * 3 + ((FANT[AR.fantasia] && FANT[AR.fantasia].mana) || 0); }
  function ganhaXp(n, motivo) { if (AR.nv >= NV_MAX) return; AR.xp += n; let subiu = false; while (AR.nv < NV_MAX && AR.xp >= xpPara(AR.nv)) { AR.xp -= xpPara(AR.nv); AR.nv++; subiu = true; AR.pts++; }
    if (AR.nv >= NV_MAX) AR.xp = 0; salvaAR(); atualizaNivel();
    if (subiu) { som('nivel', 1, 1); aplicaNivel(); vida = VIDA_MAX; mana = MANA_MAX; atualizaPts(); fx('luz', [heroi.position.x, 0, heroi.position.z], 1.2); fx('cura', [heroi.position.x, 0, heroi.position.z], 1.6); flash('rgba(255,230,120,.45)');
      const el = $('lvup'); el.innerHTML = `<small>SUBIU DE NÍVEL!</small>Nível ${AR.nv}<em>+5 vida · +3 mana · +1 ponto de habilidade</em>`; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); setTimeout(fazRetrato, 300); }
    else if (motivo) numero(heroi.position, '+' + n + ' XP', '#c8a8ff', 2.6); }
  function atualizaNivel() { $('nv').textContent = 'Nv ' + AR.nv; $('xp-fill').style.width = (AR.nv >= NV_MAX ? 100 : AR.xp / xpPara(AR.nv) * 100) + '%'; }
  const XP_TIPO = { aranha: 40, esqueleto: 55, cogumelo: 60, gosma: 55, troll: 160, espectro: 90, dragao: 1200, goblin: 18, lobo: 15, javali: 25, rato: 8, golem: 300, morcego: 150 };

  // ---- reflexo do ambiente pro metal parecer metal ----
  const envTex = canvasTex(512, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5a7ab8'); g.addColorStop(0.35, '#cfe2ff'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(0.53, '#8a8a90'); g.addColorStop(1, '#2a2a30'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    const s = x.createRadialGradient(w * 0.3, h * 0.22, 0, w * 0.3, h * 0.22, 40); s.addColorStop(0, '#ffffff'); s.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = s; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,.7)'; x.fillRect(w * 0.6, h * 0.3, w * 0.25, 6); });
  envTex.mapping = T3.EquirectangularReflectionMapping; const pmrem = new T3.PMREMGenerator(renderer); const ENV = pmrem.fromEquirectangular(envTex).texture;
  const MET = {}; function met(c, r, m) { const k = c + r + m; return MET[k] || (MET[k] = new T3.MeshStandardMaterial({ color: c, roughness: r, metalness: m, envMap: ENV, envMapIntensity: 1.25 })); }
  const AZ = met('#2a5cc4', 0.28, 0.8), AZ2 = met('#1d3f96', 0.32, 0.82), BR = met('#cdd6e4', 0.22, 0.95), PR = met('#a8b4c4', 0.3, 0.95), TEC = met('#16203a', 0.85, 0.05), COU = met('#2a1c14', 0.7, 0.1);
  const GEMA = new T3.MeshBasicMaterial({ color: '#7ae8ff', toneMapped: false });
  const SPH2 = new T3.SphereGeometry(1, 32, 22), CYL2 = new T3.CylinderGeometry(1, 1, 1, 28), CONE2 = new T3.ConeGeometry(1, 1, 20), TOR2 = new T3.TorusGeometry(1, 0.1, 12, 40), TORF = new T3.TorusGeometry(1, 0.028, 8, 56);
  const HSPH = new T3.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const BEV = (() => { const s = new T3.Shape(); s.moveTo(-0.5, -0.5); s.lineTo(0.5, -0.5); s.lineTo(0.5, 0.42); s.quadraticCurveTo(0, 0.62, -0.5, 0.42); s.lineTo(-0.5, -0.5); return new T3.ExtrudeGeometry(s, { depth: 1, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 3 }); })();
  function pc(p, geo, mat, x, y, z, sx, sy, sz, rx, ry, rz) { const m = new T3.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.set(rx || 0, ry || 0, rz || 0); m.castShadow = true; p.add(m); return m; }
  // ---- Armadura Celeste ----
  const FANT = {
    comum: { nome: 'Roupa de Brumafria', icone: '🧥', def: 0, desc: 'A roupa de lã que sua mãe costurou. Quentinha, mas não segura mordida de lobo.' },
    celeste: { nome: 'Armadura Celeste', icone: '🛡️', def: 25, desc: 'Placas de aço azul-celeste com bordas de prata polida. Reduz 25% do dano recebido.' } };
  const armadura = []; let tabardo = null; const MALHA = met('#5a6274', 0.45, 0.85); const roupaBase = [];
  { const P = heroi.userData.P; const A = (p, ...a) => { const m = pc(p, ...a); armadura.push(m); return m; };
    // a roupa de baixo vira cota de malha quando veste a armadura
    heroi.traverse(o => { if (o.isMesh && o.material && o.material.color && ['#8a6a40', '#6a4a2a', '#4a3a2a', '#3a2a1a', '#3a2414'].some(c => o.material.color.getHexString() === c.slice(1))) roupaBase.push([o, o.material]); });
    const rebite = (p, x, y, z) => A(p, SPH2, PR, x, y, z, 0.009, 0.009, 0.006);
    // peitoral (uma peça só, com quilha no meio) e costas
    A(P.spine, SPH2, AZ, 0, 0.385, 0.0, 0.205, 0.235, 0.15);
    A(P.spine, BOX, BR, 0, 0.4, 0.143, 0.018, 0.3, 0.02, -0.18);
    
    [-1, 1].forEach(s => {
      for (let k = 0; k < 4; k++) rebite(P.spine, s * (0.07 + k * 0.03), 0.52 - k * 0.035, 0.12 - k * 0.012);
      A(P.spine, CONE2, BR, s * 0.15, 0.54, 0.05, 0.018, 0.08, 0.018, 0.3, 0, -s * 0.9); });
    // faixas do abdômen com borda de prata
    for (let i = 0; i < 3; i++) { A(P.spine, CYL2, AZ, 0, 0.2 - i * 0.048, 0, 0.19 - i * 0.004, 0.044, 0.137); A(P.spine, TORF, BR, 0, 0.178 - i * 0.048, 0, 0.19 - i * 0.004, 0.137, 0.19 - i * 0.004, Math.PI / 2, 0, 0); }
    // gorjal
    A(P.spine, CYL2, AZ2, 0, 0.6, -0.01, 0.1, 0.07, 0.085); A(P.spine, TORF, BR, 0, 0.635, -0.01, 0.1, 0.085, 0.1, Math.PI / 2, 0, 0);
    // cinto e fivela
    A(P.spine, CYL2, COU, 0, 0.05, 0, 0.193, 0.05, 0.139); A(P.spine, BEV, BR, 0, 0.026, 0.132, 0.07, 0.07, 0.016); A(P.spine, SPH2, GEMA, 0, 0.05, 0.155, 0.017, 0.021, 0.01);
    // saia de malha
    A(P.hips, CYL2, MALHA, 0, -0.07, 0, 0.17, 0.14, 0.125);
    // tabardo azul-escuro com a estrela celeste
    tabardo = grp(P.hips, 0, -0.03, 0.14); A(tabardo, BOX, BR, 0, -0.2, 0, 0.16, 0.4, 0.01); A(tabardo, BOX, TEC, 0, -0.2, 0.004, 0.13, 0.38, 0.01); A(tabardo, CONE2, BR, 0, -0.415, 0.0, 0.08, 0.06, 0.005, Math.PI, 0, 0);
    { const st = grp(tabardo, 0, -0.13, 0.011); A(st, TOR2, PR, 0, 0, 0, 0.042, 0.042, 0.3); for (let k = 0; k < 4; k++) A(st, CONE2, BR, Math.sin(k * Math.PI / 2) * 0.05, Math.cos(k * Math.PI / 2) * 0.05, 0, 0.011, 0.05, 0.004, 0, 0, -k * Math.PI / 2); A(st, SPH2, GEMA, 0, 0, 0.004, 0.015, 0.015, 0.006); }
    const costas = grp(P.hips, 0, -0.03, -0.13); A(costas, BOX, TEC, 0, -0.17, 0, 0.17, 0.34, 0.01); tabardo.userData.costas = costas;
    ['L', 'R'].forEach((s, i) => { const sx = i ? 1 : -1;
      // ombreira de 3 lâminas, cada uma com borda de prata
      const sh = P['sh' + s];
      [[0.02, 0.16, 0.14], [-0.075, 0.145, 0.09]].forEach(([y, r, h], k) => { const z = -sx * (0.2 + k * 0.15); A(sh, SPH2, k ? AZ2 : AZ, sx * (0.035 + k * 0.012), y, 0, r, h, r * 1.02, 0, 0, z); A(sh, TORF, BR, sx * (0.035 + k * 0.012) + sx * Math.sin(-z) * 0, y - h * 0.18, 0, r * 0.99, r * 1.01, r, Math.PI / 2, 0, z); });
      [[0.0, 0.13, 0.04, 0.3], [0.06, 0.1, -0.05, 0.24], [0.11, 0.06, 0.0, 0.17]].forEach(([dx, y, z, h]) => A(sh, CONE2, BR, sx * (0.02 + dx), y, z, 0.024, h, 0.024, z * 2, 0, -sx * (0.35 + dx * 6)));
      for (let k = 0; k < 5; k++) { const a = -0.9 + k * 0.45; rebite(sh, sx * (0.05 + Math.cos(a) * 0.0) + sx * 0.12, 0.0, Math.sin(a) * 0.13); }
      A(sh, SPH2, GEMA, sx * 0.165, 0.0, 0.0, 0.012, 0.016, 0.016);
      A(sh, CYL2, AZ, 0, -0.19, 0, 0.064, 0.15, 0.064); A(sh, TORF, BR, 0, -0.265, 0, 0.064, 0.064, 0.064, Math.PI / 2, 0, 0);
      // cotovelo, braçadeira e manopla
      const el = P['el' + s]; A(el, SPH2, BR, 0, 0, 0.005, 0.062, 0.06, 0.062); A(el, HSPH, BR, sx * 0.03, 0, -0.02, 0.05, 0.07, 0.05, 0, 0, -sx * Math.PI / 2); A(el, CONE2, BR, 0, 0.0, -0.075, 0.018, 0.08, 0.018, -Math.PI / 2, 0, 0);
      A(el, CYL2, AZ, 0, -0.14, 0, 0.061, 0.16, 0.059); A(el, TORF, BR, 0, -0.065, 0, 0.061, 0.059, 0.061, Math.PI / 2, 0, 0); A(el, CYL2, AZ2, 0, -0.225, 0, 0.073, 0.05, 0.069); A(el, TORF, BR, 0, -0.25, 0, 0.073, 0.069, 0.073, Math.PI / 2, 0, 0);
      A(el, SPH2, MALHA, 0, -0.29, 0.01, 0.057, 0.065, 0.051); A(el, HSPH, PR, 0, -0.275, 0.012, 0.06, 0.05, 0.055, -0.3, 0, 0);
      // coxa, saiote lateral, joelho, canela e pé
      const th = P['th' + s]; A(th, SPH2, AZ, sx * 0.05, -0.06, 0.0, 0.1, 0.14, 0.115, 0, 0, sx * 0.12); A(th, TORF, BR, sx * 0.055, -0.15, 0, 0.1, 0.115, 0.1, Math.PI / 2, 0, sx * 0.12);
      A(th, CYL2, AZ, 0, -0.25, 0, 0.078, 0.26, 0.078); A(th, BOX, BR, 0, -0.24, 0.076, 0.016, 0.24, 0.012);
      const kn = P['kn' + s]; A(kn, SPH2, BR, 0, 0, 0.03, 0.072, 0.072, 0.065); A(kn, SPH2, AZ2, sx * 0.052, 0, 0.015, 0.025, 0.06, 0.05); A(kn, CONE2, BR, 0, 0.0, 0.1, 0.018, 0.06, 0.018, Math.PI / 2, 0, 0);
      A(kn, CYL2, AZ, 0, -0.21, 0, 0.069, 0.3, 0.069); A(kn, BOX, BR, 0, -0.2, 0.068, 0.018, 0.28, 0.012); A(kn, TORF, BR, 0, -0.06, 0, 0.069, 0.069, 0.069, Math.PI / 2, 0, 0); A(kn, TORF, BR, 0, -0.36, 0, 0.074, 0.074, 0.074, Math.PI / 2, 0, 0);
      const ft = P['ft' + s]; A(ft, SPH2, MALHA, 0, 0.005, 0.05, 0.075, 0.062, 0.142); for (let k = 0; k < 3; k++) A(ft, SPH2, k % 2 ? AZ2 : PR, 0, 0.02 - k * 0.004, 0.1 + k * 0.04, 0.072 - k * 0.006, 0.05, 0.05); A(ft, BOX, COU, 0, -0.048, 0.05, 0.125, 0.02, 0.27); });
    armadura.forEach(m => m.visible = false); }
  function vesteFantasia(k) { if (!FANT[k]) k = 'comum'; AR.fantasia = k; if (k !== 'comum') AR.pecas = {}; salvaAR(); escondeTrajes(); if (k === 'celeste') armadura.forEach(m => m.visible = true); if (CAS[k]) CAS[k].m.forEach(m => m.visible = true); aplicaNivel(); mana = Math.min(mana, MANA_MAX); atualizaPecas(); setTimeout(fazRetrato, 60); }
  function defesa() { const c = CLASSES && CLASSES[AR.classe]; return Math.min(85, (FANT[AR.fantasia].def || 0) + pecaDef() + (c ? c.def : 0) + (BM && BM.def ? BM.def : 0) + (typeof BUFF !== 'undefined' ? (BUFF.provocar > 0 ? 20 : 0) + (BUFF.fortaleza > 0 ? 30 : 0) + (BUFF.pele > 0 ? 40 : 0) : 0)); }
  function armaduraFrame() { casacoFrame(); if (!tabardo || AR.fantasia !== 'celeste') return; const P = heroi.userData.P; const f = Math.min(P.thL.rotation.x, P.thR.rotation.x), b = Math.max(P.thL.rotation.x, P.thR.rotation.x); tabardo.rotation.x = Math.min(0, f) * 0.95; tabardo.userData.costas.rotation.x = Math.max(0, b) * 0.95; }


  // ---- Sobretudos (5 armaduras de casaco longo com filigrana e gemas que brilham) ----
  const CASACOS = {
    rubro: { nome: 'Sobretudo Rubro', icone: '🩸', def: 30, desc: 'Casaco negro-azulado com filigrana de ouro e gemas vermelhas.', base: '#1f2836', base2: '#2c3648', trim: '#c9a55a', plate: '#d8dce4', gem: '#ff2a2a', inner: '#8a1a1a', calca: '#1a1a20' },
    geada: { nome: 'Manto da Geada', icone: '🌨️', def: 30, desc: 'Branco como a neve de Brumafria, bordas de prata e gemas de gelo.', base: '#e4e8f0', base2: '#b8c2d4', trim: '#9aa8c0', plate: '#f6f8fc', gem: '#5ad8ff', inner: '#2a4a7a', calca: '#3a4458' },
    esmeralda: { nome: 'Casaca Esmeralda', icone: '🍃', def: 30, desc: 'Verde-floresta com bronze trabalhado e gemas esmeralda.', base: '#173a2a', base2: '#22503a', trim: '#b8834a', plate: '#d6c8a0', gem: '#3aff8a', inner: '#c8a85a', calca: '#1a2a20' },
    eclipse: { nome: 'Traje do Eclipse', icone: '🌑', def: 30, desc: 'Roxo da meia-noite, prata escura e gemas violeta.', base: '#22183a', base2: '#33245a', trim: '#b8bccc', plate: '#8a8ea0', gem: '#c45aff', inner: '#4a2a7a', calca: '#16121e' },
    solar: { nome: 'Sobretudo Solar', icone: '☀️', def: 30, desc: 'Carmesim real com ouro polido e gemas âmbar.', base: '#6a1418', base2: '#8a2026', trim: '#e8c060', plate: '#f2e2b0', gem: '#ffb020', inner: '#f2e2b0', calca: '#2a1416' } };
  const SOB_PECAS = [['peito', '🧥', 'Casaco'], ['ombro', '🛡️', 'Ombreiras'], ['maos', '🧤', 'Braçadeiras'], ['calca', '👘', 'Manto'], ['pe', '🥾', 'Botas']];
  const SOB_DEF = 6, SOB_BONUS = 5;
  AR.sobs = AR.sobs || []; if (AR.fantasias) AR.fantasias = AR.fantasias.filter(f => !CASACOS[f]); if (CASACOS[AR.fantasia]) AR.fantasia = 'comum';
  const sobInfo = (set, k) => { const C = CASACOS[set], S = SOB_PECAS.find(x => x[0] === k); return C && S ? { icone: S[1], nome: S[2] + ' · ' + C.nome, sub: 'Defesa +' + SOB_DEF + '%', cor: C.gem, set, k } : null; };
  const CAS = {};
  function entre(p, mat, a, b, w, d) { const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dy, dz); const m = new T3.Mesh(BOX, mat); m.scale.set(w, L, d || w); m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), new T3.Vector3(dx / L, dy / L, dz / L)); m.castShadow = true; p.add(m); return m; }
  Object.keys(CASACOS).forEach(k => { const C = CASACOS[k], P = heroi.userData.P, L = [], PCs = { peito: [], ombro: [], maos: [], calca: [], pe: [] }; let cur = 'peito'; const PU = m => { L.push(m); PCs[cur].push(m); };
    const M = { base: met(C.base, 0.75, 0.1), base2: met(C.base2, 0.6, 0.25), trim: met(C.trim, 0.25, 0.95), plate: met(C.plate, 0.22, 0.9), inner: met(C.inner, 0.8, 0.05), luva: met('#1a1414', 0.55, 0.15), sola: met('#120e0c', 0.7, 0.1),
      gem: new T3.MeshStandardMaterial({ color: C.gem, emissive: C.gem, emissiveIntensity: 2.2, roughness: 0.2, toneMapped: false }) };
    const capa = new T3.MeshStandardMaterial({ color: C.base, roughness: 0.75, metalness: 0.1, side: T3.DoubleSide, envMap: ENV, envMapIntensity: 0.6 });
    M.calca = met(C.calca, 0.7, 0.1);
    const A = (p, ...a) => { const m = pc(p, ...a); PU(m); return m; }; const E = (...a) => { const m = entre(...a); PU(m); return m; };
    const gema = (p, x, y, z, r, rx) => { A(p, SPH2, M.gem, x, y, z, r, r * 1.25, r * 0.6, rx || 0); A(p, TORF, M.trim, x, y, z - 0.002, r * 1.25, r * 1.5, r * 1.2, rx || 0); };
    // tronco: casaco, peitoral, camisa e gola alta
    A(P.spine, SPH2, M.base, 0, 0.38, -0.005, 0.212, 0.245, 0.155);
    for (let i = 0; i < 3; i++) A(P.spine, CYL2, M.base, 0, 0.2 - i * 0.05, 0, 0.196 - i * 0.004, 0.05, 0.142);
    A(P.spine, SPH2, M.plate, 0, 0.38, 0.07, 0.12, 0.19, 0.095); A(P.spine, CONE2, M.plate, 0, 0.17, 0.12, 0.05, 0.14, 0.02, Math.PI);
    A(P.spine, BOX, M.trim, 0, 0.36, 0.163, 0.012, 0.32, 0.012, -0.12);
    [-1, 1].forEach(s => { E(P.spine, M.trim, [s * 0.03, 0.52, 0.145], [s * 0.1, 0.4, 0.14], 0.012, 0.01); E(P.spine, M.trim, [s * 0.1, 0.4, 0.14], [s * 0.05, 0.26, 0.15], 0.012, 0.01); });
    [-1, 1].forEach(s => { E(P.spine, M.trim, [s * 0.12, 0.52, 0.1], [s * 0.035, 0.13, 0.14], 0.016, 0.012); E(P.spine, M.base2, [s * 0.15, 0.53, 0.07], [s * 0.06, 0.12, 0.125], 0.05, 0.02);
      for (let k2 = 0; k2 < 3; k2++) A(P.spine, CONE2, M.plate, s * (0.04 + k2 * 0.03), 0.42 - k2 * 0.07, 0.15, 0.012, 0.07, 0.008, 0, 0, s * (1.2 + k2 * 0.2)); });
    gema(P.spine, 0, 0.43, 0.168, 0.032);
    A(P.spine, CYL2, M.inner, 0, 0.6, 0, 0.085, 0.09, 0.08);
    { const gola = grp(P.spine, 0, 0.56, -0.07); PU(gola); [-1, 1].forEach(s => { const g = grp(gola, s * 0.1, 0, 0); g.rotation.set(-0.15, s * 0.5, s * 0.55); A(g, BOX, M.base2, 0, 0.15, 0, 0.2, 0.31, 0.018); A(g, BOX, M.trim, s * 0.1, 0.15, 0.004, 0.016, 0.32, 0.024); A(g, BOX, M.trim, 0, 0.305, 0.004, 0.2, 0.016, 0.024); A(g, CONE2, M.trim, s * 0.1, 0.34, 0, 0.014, 0.08, 0.01, 0, 0, -s * 0.4); }); A(gola, BOX, M.base2, 0, 0.07, -0.03, 0.12, 0.15, 0.015, -0.25); }
    // emblema nas costas
    { const e = grp(P.spine, 0, 0.44, -0.15); PU(e); gema(e, 0, 0, -0.004, 0.04, Math.PI); [-1, 1].forEach(s => { A(e, TOR2, M.trim, s * 0.07, 0.0, 0, 0.08, 0.1, 0.5, 0, 0, s > 0 ? -0.5 : Math.PI + 0.5); A(e, CONE2, M.trim, s * 0.1, -0.09, 0, 0.012, 0.12, 0.006, 0, 0, s * 0.5); }); A(e, CONE2, M.trim, 0, -0.14, 0, 0.018, 0.16, 0.006, Math.PI); A(e, CONE2, M.trim, 0, 0.08, 0, 0.014, 0.08, 0.006); }
    // cinto
    A(P.spine, CYL2, M.luva, 0, 0.05, 0, 0.2, 0.045, 0.146); A(P.spine, BEV, M.trim, 0, 0.028, 0.14, 0.06, 0.06, 0.014);
    // abas longas do casaco (frente esquerda, frente direita, costas) — balançam com as pernas
    cur = 'calca'; const abas = {}; const H = 0.66, R0 = 0.2, R1 = 0.33, ZS = 0.78;
    [['R', 0.4, 1.35], ['L', -1.75, 1.35], ['B', 1.75, Math.PI * 2 - 3.5]].forEach(([n, t0, tl]) => { const g = grp(P.hips, 0, 0.0, 0); PU(g); abas[n] = g; g.scale.z = ZS;
      const geo = new T3.CylinderGeometry(R0, R1, H, 20, 1, true, t0, tl); A(g, geo, capa, 0, -H / 2, 0, 1, 1, 1);
      const hem = grp(g, 0, -H, 0); hem.rotation.y = -(Math.PI / 2 - t0 - tl); const tor = new T3.TorusGeometry(R1, 0.012, 6, 24, tl); A(hem, tor, M.trim, 0, 0, 0, 1, 1, 1, Math.PI / 2);
      [t0, t0 + tl].forEach(t => { if (n === 'B') return; E(g, M.trim, [R0 * Math.sin(t), 0, R0 * Math.cos(t)], [R1 * Math.sin(t), -H, R1 * Math.cos(t)], 0.016, 0.016); });
      // filigrana perto da barra
      const tm = t0 + tl / 2, rr = R0 + (R1 - R0) * 0.75, px = (rr + 0.006) * Math.sin(tm), pz = (rr + 0.006) * Math.cos(tm); const f = grp(g, px, -H * 0.75, pz); f.rotation.y = tm;
      A(f, CONE2, M.trim, 0, 0.02, 0, 0.018, 0.2, 0.006); [-1, 1].forEach(s => { A(f, CONE2, M.trim, s * 0.04, -0.03, 0, 0.012, 0.14, 0.005, 0, 0, s * 0.5); A(f, CONE2, M.trim, s * 0.07, -0.08, 0, 0.009, 0.09, 0.004, 0, 0, s * 0.9); }); if (n === 'B') gema(f, 0, 0.13, 0.004, 0.014); });
    // ombreiras em camadas com espinhos e gema
    ['L', 'R'].forEach((sd, i) => { const sx = i ? 1 : -1, sh = P['sh' + sd]; cur = 'ombro';
      [[0.03, 0.135, 0.075, M.trim], [-0.025, 0.13, 0.065, M.base2], [-0.075, 0.12, 0.055, M.trim], [-0.12, 0.105, 0.05, M.base2]].forEach(([y, r, h, mt], k2) => { const z = -sx * (0.3 + k2 * 0.2); A(sh, SPH2, mt, sx * (0.045 + k2 * 0.014), y, 0, r, h, r * 1.05, 0, 0, z); });
      [[0.0, 0.09, 0.05, 0.14], [0.05, 0.08, -0.04, 0.13], [0.1, 0.05, 0.0, 0.11]].forEach(([dx, y, z, h]) => A(sh, CONE2, M.plate, sx * (0.04 + dx), y, z, 0.016, h, 0.01, z * 2 - 0.4, 0, -sx * (0.9 + dx * 5)));
      gema(sh, sx * 0.17, -0.01, 0, 0.026); sh.children[sh.children.length - 2].rotation.y = sx * Math.PI / 2; sh.children[sh.children.length - 1].rotation.y = sx * Math.PI / 2;
      cur = 'peito'; A(sh, CYL2, M.base, 0, -0.19, 0, 0.066, 0.17, 0.066); cur = 'maos';
      // braçadeira com fivelas e gemas
      const el = P['el' + sd]; A(el, SPH2, M.base, 0, 0, 0, 0.062, 0.06, 0.062); A(el, CYL2, M.base2, 0, -0.15, 0, 0.068, 0.2, 0.066); A(el, CYL2, M.trim, 0, -0.045, 0, 0.074, 0.025, 0.072);
      [-0.08, -0.2].forEach(y => { A(el, TORF, M.trim, 0, y, 0, 0.07, 0.068, 0.07, Math.PI / 2); const gg = grp(el, sx * 0.075, y + 0.03, 0); gg.rotation.y = sx * Math.PI / 2; PU(gg); gema(gg, 0, 0, 0, 0.02); });
      A(el, SPH2, M.luva, 0, -0.29, 0.01, 0.058, 0.066, 0.052);
      // botas altas com joelheira
      cur = 'pe';
      const kn = P['kn' + sd]; A(kn, CYL2, M.base2, 0, -0.2, 0, 0.074, 0.32, 0.074); A(kn, TORF, M.trim, 0, -0.04, 0, 0.076, 0.076, 0.076, Math.PI / 2); A(kn, BOX, M.trim, 0, -0.2, 0.072, 0.014, 0.3, 0.01);
      A(kn, SPH2, M.plate, 0, 0, 0.04, 0.06, 0.08, 0.04); A(kn, CONE2, M.plate, 0, 0.08, 0.05, 0.02, 0.1, 0.012, 0.25);
      const ft = P['ft' + sd]; A(ft, SPH2, M.luva, 0, 0.005, 0.05, 0.078, 0.064, 0.145); A(ft, BOX, M.trim, 0, -0.044, 0.05, 0.128, 0.012, 0.28); A(ft, BOX, M.sola, 0, -0.055, 0.05, 0.126, 0.018, 0.27); });
    L.forEach(m => m.visible = false); CAS[k] = { m: L, pc: PCs, abas, calca: M.calca }; });

  // ---- 5 armaduras de Mago (capuz, manto, capa e detalhes de elemento) ----
  const MAGOS = {
    gelo: { nome: 'Gelo Eterno', icone: '🧊', def: 32, mana: 30, desc: 'Manto de mago com cristais de gelo que nunca derretem.', cor: '#167bff', escuro: '#102b60', brilho: '#80eaff', cristal: '#b8f7ff' },
    fogo: { nome: 'Dragão Flamejante', icone: '🔥', def: 34, mana: 25, desc: 'Escamas de dragão e chamas vivas atrás da gola.', cor: '#e52b16', escuro: '#58151a', brilho: '#ff7a19', cristal: '#ffd04a' },
    arcano: { nome: 'Armadura Arcana', icone: '🔮', def: 30, mana: 45, desc: 'Um anel de magia pura flutua atrás da cabeça.', cor: '#842bff', escuro: '#301052', brilho: '#d58aff', cristal: '#edbaff' },
    natureza: { nome: 'Guardião da Natureza', icone: '🌿', def: 38, mana: 33, desc: 'Folhas brilhantes nascem dos ombros do guardião.', cor: '#26943d', escuro: '#173d27', brilho: '#8bdf42', cristal: '#c8ff70' },
    divino: { nome: 'Deus Celestial', icone: '👼', def: 45, mana: 50, desc: 'Ouro celestial e uma auréola de luz sobre a cabeça.', cor: '#e8c35b', escuro: '#806020', brilho: '#fff0a0', cristal: '#ffffff' } };
  Object.keys(MAGOS).forEach(k => FANT['mago_' + k] = MAGOS[k]);
  const OCT1 = new T3.OctahedronGeometry(1, 0);
  // Mago: versão detalhada (capuz com rosto à mostra, placas com filete dourado, runas que brilham, capa rasgada)
  const MAGO_TX = {}; let magoSeed = 9; const mr = () => { magoSeed = (magoSeed * 16807) % 2147483647; return magoSeed / 2147483647; };
  function magoCv(n, draw) { const c = document.createElement('canvas'); c.width = c.height = n; draw(c.getContext('2d'), n); return c; }
  function magoTx(c, rx, ry, srgb) { const t = new T3.CanvasTexture(c); t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(rx, ry || rx); if (srgb !== false) t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4; return t; }
  function tecidoTx(cor) { return MAGO_TX['t' + cor] || (MAGO_TX['t' + cor] = magoCv(256, (x, n) => { x.fillStyle = cor; x.fillRect(0, 0, n, n); for (let y = 0; y < n; y += 2) { x.fillStyle = `rgba(0,0,0,${0.05 + mr() * 0.06})`; x.fillRect(0, y, n, 1); } for (let i = 0; i < n; i += 2) { x.fillStyle = `rgba(255,255,255,${mr() * 0.03})`; x.fillRect(i, 0, 1, n); }
    for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(0,0,0,${mr() * 0.14})`; x.beginPath(); x.ellipse(mr() * n, mr() * n, 10 + mr() * 30, 2 + mr() * 6, mr() * 3, 0, 7); x.fill(); } })); }
  const RUNA_CV = magoCv(256, (x, n) => { x.fillStyle = '#000'; x.fillRect(0, 0, n, n); x.strokeStyle = '#fff'; x.lineCap = 'round'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(n / 2, 30); x.lineTo(n / 2 + 30, 85); x.lineTo(n / 2, 140); x.lineTo(n / 2 - 30, 85); x.closePath(); x.stroke(); x.beginPath(); x.arc(n / 2, 85, 14, 0, 7); x.stroke();
    x.lineWidth = 2; for (let i = 0; i < 5; i++) { const cx = 48 + i * 40, cy = 200; x.beginPath(); x.moveTo(cx - 8, cy + 9); x.lineTo(cx, cy - 9); x.lineTo(cx + 8, cy + 9); if (i % 2) { x.moveTo(cx - 6, cy); x.lineTo(cx + 6, cy); } else x.arc(cx, cy + 1, 4, 0, 4.4); x.stroke(); } });
  const OURO_CV = magoCv(128, (x, n) => { x.fillStyle = '#c8a050'; x.fillRect(0, 0, n, n); for (let i = 0; i < 200; i++) { x.strokeStyle = `rgba(${mr() < 0.5 ? '255,240,200' : '80,50,10'},${mr() * 0.3})`; x.lineWidth = 0.5 + mr(); x.beginPath(); const px = mr() * n, py = mr() * n; x.moveTo(px, py); x.lineTo(px + (mr() - 0.5) * 20, py + (mr() - 0.5) * 20); x.stroke(); } });
  Object.keys(MAGOS).forEach(k => { const D = MAGOS[k], P = heroi.userData.P, L = [];
    const escura = '#' + new T3.Color(D.escuro).multiplyScalar(0.55).getHexString(), media = '#' + new T3.Color(D.cor).lerp(new T3.Color(D.escuro), 0.45).getHexString();
    const OURO = new T3.MeshPhysicalMaterial({ color: k === 'gelo' ? '#dfe8f4' : '#e6c070', map: magoTx(OURO_CV, 1), metalness: 1, roughness: 0.3, clearcoat: 0.3, envMap: ENV, envMapIntensity: 1.3 });
    const PLACA = new T3.MeshPhysicalMaterial({ color: D.cor, metalness: 0.7, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2, envMap: ENV, envMapIntensity: 1.1 });
    const PRETO = new T3.MeshPhysicalMaterial({ color: '#18141e', metalness: 0.6, roughness: 0.45, clearcoat: 0.4, envMap: ENV, envMapIntensity: 0.8 });
    const COURO = new T3.MeshStandardMaterial({ color: '#1c1620', roughness: 0.7, metalness: 0.1 });
    const GEMA = new T3.MeshPhysicalMaterial({ color: D.cristal, emissive: D.brilho, emissiveIntensity: 2.6, roughness: 0.05, clearcoat: 1, toneMapped: false });
    const pano = (c, rx, ry) => new T3.MeshStandardMaterial({ map: magoTx(tecidoC(c), rx || 2, ry), roughness: 0.85, side: T3.DoubleSide, envMap: ENV, envMapIntensity: 0.4 });
    function tecidoC(c) { return tecidoTx(c); }
    const TAB = new T3.MeshStandardMaterial({ map: magoTx(tecidoTx(media), 1), emissiveMap: magoTx(RUNA_CV, 1), emissive: D.brilho, emissiveIntensity: 1.3, roughness: 0.85, side: T3.DoubleSide });
    const A = (pa, ...a) => { const m = pc(pa, ...a); L.push(m); return m; }; const G = (pa, x, y, z) => { const g = grp(pa, x, y, z); L.push(g); return g; };
    const MG = (pa, geo, mat, x, y, z) => { const m = new T3.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; pa.add(m); L.push(m); return m; };
    const tubo = (pa, pts, r, fechado) => MG(pa, new T3.TubeGeometry(new T3.CatmullRomCurve3(pts.map(v => new T3.Vector3(v[0], v[1], v[2])), !!fechado), Math.max(12, pts.length * 6), r, 6, !!fechado), OURO);
    const gema = (pa, x, y, z, e, rx) => { const g = A(pa, OCT1, GEMA, x, y, z, e * 0.8, e * 1.25, e * 0.5, rx || 0); tubo(pa, [[x, y + e * 1.5, z - 0.003], [x + e * 1.05, y, z - 0.003], [x, y - e * 1.5, z - 0.003], [x - e * 1.05, y, z - 0.003]], 0.0045, true); return g; };
    // capuz (rosto à mostra) com ponta e filete dourado
    A(P.head, new T3.SphereGeometry(1, 32, 20, Math.PI / 2 + 0.75, Math.PI * 2 - 1.5, 0, Math.PI * 0.8), pano(D.escuro, 2), 0, 0.07, -0.01, 0.235, 0.255, 0.235);
    { const pt = A(P.head, CONE2, pano(D.escuro, 1), 0, 0.2, -0.22, 0.13, 0.24, 0.13); pt.rotation.x = -1.0; }
    tubo(P.head, [[-0.17, -0.12, 0.1], [-0.2, 0.07, 0.13], [-0.12, 0.25, 0.13], [0, 0.29, 0.12], [0.12, 0.25, 0.13], [0.2, 0.07, 0.13], [0.17, -0.12, 0.1]], 0.008);
    // tronco
    A(P.spine, SPH2, pano(escura, 2), 0, 0.37, 0, 0.205, 0.24, 0.15);
    for (let i = 0; i < 3; i++) A(P.spine, CYL2, pano(escura, 2), 0, 0.2 - i * 0.05, 0, 0.195 - i * 0.004, 0.05, 0.142);
    { const pl = A(P.spine, new T3.SphereGeometry(1, 32, 18, 0.3, Math.PI - 0.6, 0, Math.PI * 0.6), PLACA, 0, 0.36, 0.0, 0.215, 0.24, 0.165); pl.rotation.x = -0.15; }
    tubo(P.spine, [[-0.16, 0.54, 0.09], [-0.07, 0.42, 0.155], [0, 0.31, 0.168], [0.07, 0.42, 0.155], [0.16, 0.54, 0.09]], 0.009);
    tubo(P.spine, [[-0.2, 0.43, 0.05], [-0.1, 0.27, 0.14], [0, 0.21, 0.16], [0.1, 0.27, 0.14], [0.2, 0.43, 0.05]], 0.008);
    gema(P.spine, 0, 0.4, 0.175, 0.035);
    // gola alta
    [-1, 1].forEach(s => { const g = G(P.spine, s * 0.08, 0.57, -0.05); g.rotation.set(-0.25, s * 0.4, s * 0.35); A(g, BOX, PLACA, 0, 0.1, 0, 0.15, 0.2, 0.014); tubo(g, [[-0.075, 0, 0.009], [-0.075, 0.19, 0.009], [0.075, 0.22, 0.009], [0.075, 0, 0.009]], 0.0045); });
    // cinto com losango dourado
    A(P.spine, CYL2, PRETO, 0, 0.05, 0, 0.2, 0.07, 0.148); A(P.spine, TORF, OURO, 0, 0.085, 0, 0.2, 0.148, 0.2, Math.PI / 2); A(P.spine, TORF, OURO, 0, 0.015, 0, 0.2, 0.148, 0.2, Math.PI / 2);
    A(P.spine, OCT1, OURO, 0, 0.05, 0.15, 0.06, 0.07, 0.02); A(P.spine, OCT1, GEMA, 0, 0.05, 0.162, 0.035, 0.045, 0.015);
    // tabardo da frente com runas (balança com as pernas)
    const tab = G(P.hips, 0, 0.0, 0.17); { const s = new T3.Shape(); s.moveTo(-0.11, 0); s.lineTo(0.11, 0); s.lineTo(0.14, -0.55); s.lineTo(0, -0.67); s.lineTo(-0.14, -0.55); s.closePath();
      const geo = new T3.ShapeGeometry(s, 10); const uv = geo.attributes.uv, p = geo.attributes.position; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + 0.15) / 0.3, (p.getY(i) + 0.68) / 0.68);
      MG(tab, geo, TAB, 0, 0, 0); tubo(tab, [[-0.11, 0, 0.004], [-0.14, -0.55, 0.004], [0, -0.67, 0.004], [0.14, -0.55, 0.004], [0.11, 0, 0.004]], 0.007); gema(tab, 0, -0.52, 0.01, 0.022); }
    // casaco: abas com barra rasgada
    const abas = {}; const H = 0.7, R0 = 0.2, R1 = 0.37, ZS = 0.8;
    [['R', 0.55, 1.6], ['L', -2.15, 1.6], ['B', 2.15, Math.PI * 2 - 4.3]].forEach(([n, t0, tl]) => { const g = G(P.hips, 0, 0, 0); abas[n] = g; g.scale.z = ZS;
      const geo = new T3.CylinderGeometry(R0, R1, H, 28, 8, true, t0, tl); const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const y = p.getY(i), ang = Math.atan2(p.getX(i), p.getZ(i)); if (y < -H / 2 + 1e-4) p.setY(i, y + 0.06 * (0.5 + 0.5 * Math.sin(ang * 23 + Math.cos(ang * 7) * 2)) + 0.03 * mr()); const f = (H / 2 - p.getY(i)) / H; p.setX(i, p.getX(i) * (1 + Math.sin(ang * 9) * 0.04 * f)); }
      geo.computeVertexNormals(); MG(g, geo, pano(n === 'B' ? D.escuro : media, 2), 0, -H / 2, 0);
      if (n !== 'B') { const t = n === 'R' ? t0 : t0 + tl; tubo(g, [[R0 * Math.sin(t), 0, R0 * Math.cos(t)], [0.29 * Math.sin(t), -H * 0.55, 0.29 * Math.cos(t)], [R1 * Math.sin(t), -H + 0.02, R1 * Math.cos(t)]], 0.008); } });
    // capa rasgada
    let capa; { capa = G(P.spine, 0, 0.56, -0.15); const geo = new T3.PlaneGeometry(0.52, 1.0, 14, 14); const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); const f = (0.5 - y) / 1.0; p.setZ(i, -Math.pow(x / 0.26, 2) * 0.06 - f * 0.12 + Math.sin(x * 14 + y * 3) * 0.015 * f); p.setX(i, x * (1 + f * 0.5)); if (y < -0.45) p.setY(i, y + (0.03 + 0.05 * Math.abs(Math.sin(x * 41))) * (mr() < 0.6 ? 1 : 0.3)); }
      geo.computeVertexNormals(); MG(capa, geo, pano(D.escuro, 1.5), 0, -0.5, 0); A(capa, CYL2, OURO, 0, 0, 0, 0.17, 0.02, 0.02, 0, 0, Math.PI / 2); }
    // ombreiras, braçadeiras, luvas e botas
    ['L', 'R'].forEach((sd, i) => { const sx = i ? 1 : -1, sh = P['sh' + sd];
      const o = G(sh, sx * 0.03, 0.03, 0); o.rotation.z = -sx * 0.3;
      [[0.0, 0.13, 0.08], [-0.045, 0.12, 0.07], [-0.09, 0.105, 0.06]].forEach(([y, r, h], k2) => { A(o, HSPH, PLACA, sx * k2 * 0.012, y, 0, r * 1.1, h * 1.5, r * 1.05); A(o, TORF, OURO, sx * k2 * 0.012, y + 0.004, 0, r * 1.1, r * 1.05, r * 1.1, Math.PI / 2); });
      for (let k2 = 0; k2 < 3; k2++) { const sp = A(o, CONE2, OURO, sx * (0.03 + k2 * 0.04), 0.07, -0.02 + k2 * 0.025, 0.018, 0.13 - k2 * 0.025, 0.012); sp.rotation.z = -sx * (0.35 + k2 * 0.25); sp.rotation.x = -0.2; }
      A(o, OCT1, GEMA, sx * 0.02, 0.04, 0.11, 0.022, 0.032, 0.012);
      A(sh, CYL2, pano(media, 1), 0, -0.19, 0, 0.068, 0.17, 0.068);
      const el = P['el' + sd]; A(el, SPH2, pano(media, 1), 0, 0, 0, 0.062, 0.06, 0.062); A(el, CYL2, PLACA, 0, -0.15, 0, 0.07, 0.19, 0.068);
      A(el, TORF, OURO, 0, -0.06, 0, 0.071, 0.069, 0.071, Math.PI / 2); A(el, TORF, OURO, 0, -0.24, 0, 0.066, 0.064, 0.066, Math.PI / 2); A(el, OCT1, GEMA, sx * 0.068, -0.15, 0.01, 0.016, 0.024, 0.01, 0, sx * Math.PI / 2);
      for (let k2 = 0; k2 < 2; k2++) { const sp = A(el, CONE2, OURO, sx * 0.062, -0.1 - k2 * 0.07, -0.03, 0.013, 0.06, 0.013); sp.rotation.z = -sx * 1.3; }
      A(el, SPH2, PRETO, 0, -0.29, 0.01, 0.058, 0.066, 0.052); for (let f = 0; f < 4; f++) { const d = A(el, CONE2, PRETO, (f - 1.5) * 0.022, -0.36, 0.03, 0.011, 0.07, 0.011); d.rotation.x = Math.PI - 0.2; }
      const kn = P['kn' + sd]; A(kn, SPH2, PLACA, 0, 0, 0.04, 0.07, 0.08, 0.05); A(kn, CONE2, OURO, 0, 0.08, 0.05, 0.02, 0.09, 0.012, 0.25);
      A(kn, CYL2, PRETO, 0, -0.21, 0, 0.074, 0.3, 0.074); for (let k2 = 0; k2 < 3; k2++) A(kn, TORF, OURO, 0, -0.08 - k2 * 0.11, 0, 0.076, 0.076, 0.076, Math.PI / 2);
      const ft = P['ft' + sd]; A(ft, SPH2, PRETO, 0, 0.005, 0.05, 0.078, 0.064, 0.145); A(ft, BOX, OURO, 0, -0.05, 0.05, 0.13, 0.016, 0.28); });
    // detalhes de cada elemento
    if (k === 'gelo') for (let i = 0; i < 5; i++) { const a = -0.7 + i * 0.35; A(P.spine, OCT1, GEMA, Math.sin(a) * 0.18, 0.64 + (i === 2 ? 0.03 : 0), -0.06 - Math.abs(a) * 0.03, 0.022, 0.08, 0.022); }
    if (k === 'fogo') { ['L', 'R'].forEach((sd, i) => { const sx = i ? 1 : -1; for (let j = 0; j < 3; j++) { const c = A(P['sh' + sd], CONE2, GEMA, sx * (0.04 + j * 0.04), 0.12 + (j === 1 ? 0.03 : 0), -0.02, 0.03, 0.15 - j * 0.02, 0.025); c.rotation.z = -sx * (0.2 + j * 0.3); } L.push(glowSpr(P['sh' + sd], sx * 0.08, 0.14, 0, 0.35, D.brilho, 0.45)); }); }
    if (k === 'arcano') { const r = G(P.head, 0, 0.1, -0.22); A(r, TOR2, GEMA, 0, 0, 0, 0.27, 0.27, 0.35); for (let i = 0; i < 4; i++) A(r, OCT1, GEMA, Math.cos(i * Math.PI / 2) * 0.27, Math.sin(i * Math.PI / 2) * 0.27, 0, 0.02, 0.03, 0.012); }
    if (k === 'natureza') ['L', 'R'].forEach((sd, i) => { const sx = i ? 1 : -1; for (let j = 0; j < 4; j++) { const f = A(P['sh' + sd], CONE2, GEMA, sx * (0.05 + j * 0.03), 0.09 + j * 0.015, -0.03 - j * 0.02, 0.032, 0.16, 0.01); f.rotation.z = -sx * (0.25 + j * 0.35); f.rotation.x = -0.3; } });
    if (k === 'divino') { A(P.head, TOR2, GEMA, 0, 0.42, -0.04, 0.14, 0.14, 0.3, Math.PI / 2 - 0.45); [-1, 1].forEach(s => { const w = A(P.spine, CONE2, GEMA, s * 0.13, 0.5, -0.19, 0.045, 0.3, 0.012); w.rotation.z = -s * 1.0; w.rotation.x = 0.3; }); }
    L.push(glowSpr(P.spine, 0, 0.4, 0.2, 0.18, D.brilho, 0.35));
    L.forEach(m => m.visible = false); CAS['mago_' + k] = { m: L, abas, calca: COURO, capa, tab }; });
  function escondeTrajes() { armadura.forEach(m => m.visible = false); Object.values(CAS).forEach(c => c.m.forEach(m => m.visible = false)); }
  function casacoFrame() { const c = CAS[AR.fantasia] || (CASACOS[AR.pecas.calca] && CAS[AR.pecas.calca]); if (!c) return; const P = heroi.userData.P, a = c.abas;
    a.R.rotation.x = Math.min(0, P.thR.rotation.x) * 0.9; a.L.rotation.x = Math.min(0, P.thL.rotation.x) * 0.9; a.B.rotation.x = Math.max(0, Math.max(P.thL.rotation.x, P.thR.rotation.x)) * 0.7; if (c.tab) c.tab.rotation.x = Math.min(0, P.thL.rotation.x, P.thR.rotation.x) * 0.85; if (c.capa) { const v = typeof vel !== 'undefined' ? vel : 0; c.capa.rotation.x += (Math.min(0.6, v * 0.06) + Math.sin(gT * 2.2) * 0.03 - c.capa.rotation.x) * 0.15; } }

  // ---- Armadura Glacial (conjunto em peças separadas: elmo, peitoral, manoplas, calça, gregas, botas) ----
  const GA = met('#3f7ae8', 0.35, 0.45), GA2 = met('#2c58b8', 0.38, 0.45), GB = met('#e8eff6', 0.3, 0.4), GD = met('#2e3350', 0.6, 0.15);
  const GELO = new T3.MeshStandardMaterial({ color: '#a6e6fa', roughness: 0.25, metalness: 0.1, emissive: '#2a7fa8', emissiveIntensity: 0.5, envMap: ENV, envMapIntensity: 1.1 });
  const FUMO = new T3.MeshBasicMaterial({ color: '#cfeefc', transparent: true, opacity: 0.85, toneMapped: false });
  const OCT = new T3.OctahedronGeometry(1);
  const PECAS = [['cabeca', '⛑️', 'Elmo Glacial'], ['peito', '🦺', 'Peitoral Glacial'], ['maos', '🧤', 'Manoplas de Gelo'], ['calca', '🩳', 'Calça Glacial'], ['greva', '🦵', 'Gregas Glaciais'], ['pe', '🥾', 'Botas Glaciais']];
  const PEC = {}; PECAS.forEach(([k]) => PEC[k] = []); let HV = null;
  function pecaDef() { const n = PECAS.filter(([k]) => AR.pecas[k] === 'glacial').length; let d = n * 5 + (n === PECAS.length ? 10 : 0); Object.keys(CASACOS).forEach(c => { const m = SOB_PECAS.filter(([k]) => AR.pecas[k] === c).length; d += m * SOB_DEF + (m === SOB_PECAS.length ? SOB_BONUS : 0); }); return d; }
  { const P = heroi.userData.P; const Q = (slot, par, ...a) => { const m = pc(par, ...a); m.visible = false; PEC[slot].push(m); return m; };
    // cabeça: elmo branco com coroa de cristais, viseira escura e chama de gelo
    { const h = P.head, S = 'cabeca';
      Q(S, h, SPH2, GB, 0, 0.14, -0.005, 0.152, 0.158, 0.158); Q(S, h, BOX, GD, 0, 0.125, 0.158, 0.16, 0.05, 0.02); Q(S, h, BOX, GD, 0, 0.045, 0.14, 0.085, 0.07, 0.06);
      Q(S, h, OCT, GB, 0, 0.335, 0.03, 0.035, 0.15, 0.03); Q(S, h, OCT, GEMA, 0, 0.235, 0.158, 0.02, 0.04, 0.01);
      [-1, 1].forEach(sx => { Q(S, h, OCT, GB, sx * 0.1, 0.3, 0.02, 0.03, 0.11, 0.026, 0, 0, -sx * 0.55); Q(S, h, OCT, GB, sx * 0.062, 0.3, -0.1, 0.026, 0.09, 0.024, -0.5, 0, -sx * 0.2); Q(S, h, OCT, GELO, sx * 0.172, 0.12, 0, 0.02, 0.07, 0.03, 0, 0, -sx * 0.9); });
      for (let k = 0; k < 5; k++) Q(S, h, SPH2, FUMO, 0, 0.22 + k * 0.035, -0.15 - k * 0.085, 0.06 - k * 0.009, 0.06 - k * 0.009, 0.06 - k * 0.009); }
    // peitoral: placa azul, estrela branca, costelas, cristais e ombreiras
    { const sp = P.spine, S = 'peito';
      Q(S, sp, SPH2, GA, 0, 0.385, 0, 0.215, 0.24, 0.155); Q(S, sp, CYL2, GD, 0, 0.15, 0, 0.17, 0.12, 0.12);
      for (let i = 0; i < 3; i++) Q(S, sp, CYL2, i % 2 ? GA2 : GA, 0, 0.22 - i * 0.045, 0, 0.192 - i * 0.004, 0.036, 0.137);
      Q(S, sp, OCT, GB, 0, 0.45, 0.15, 0.075, 0.11, 0.02); Q(S, sp, OCT, GEMA, 0, 0.51, 0.165, 0.022, 0.035, 0.01);
      Q(S, sp, CYL2, GA2, 0, 0.6, -0.01, 0.1, 0.07, 0.085);
      [-1, 1].forEach(sx => { Q(S, sp, OCT, GELO, sx * 0.13, 0.5, 0.08, 0.03, 0.11, 0.03, 0, 0, -sx * 0.6); Q(S, sp, OCT, GELO, sx * 0.17, 0.4, 0.0, 0.026, 0.09, 0.026, 0, 0, -sx * 0.9);
        const sh = P['sh' + (sx < 0 ? 'L' : 'R')];
        Q(S, sh, SPH2, GA, sx * 0.04, 0.02, 0, 0.17, 0.14, 0.16, 0, 0, -sx * 0.2); Q(S, sh, TORF, GB, sx * 0.04, -0.02, 0, 0.165, 0.16, 0.17, Math.PI / 2, 0, -sx * 0.2);
        [[0.05, 0.17, 0, 0.17, 0.3], [0.12, 0.12, 0.05, 0.12, 0.7], [0.1, 0.14, -0.06, 0.13, 0.5]].forEach(([dx, y, z, h, r]) => Q(S, sh, OCT, GELO, sx * dx, y + 0.04, z, 0.05, h * 1.6, 0.05, z * 2, 0, -sx * r));
        Q(S, sh, CYL2, GA, 0, -0.19, 0, 0.068, 0.15, 0.068); Q(S, sh, TORF, GB, 0, -0.265, 0, 0.068, 0.068, 0.068, Math.PI / 2, 0, 0); }); }
    // manoplas: braçadeira azul, cristais no cotovelo e garras de gelo
    { const S = 'maos'; ['L', 'R'].forEach((s, i) => { const sx = i ? 1 : -1, el = P['el' + s];
      Q(S, el, SPH2, GA2, 0, 0, 0.005, 0.066, 0.064, 0.066); Q(S, el, OCT, GELO, sx * 0.07, -0.02, -0.04, 0.03, 0.12, 0.03, 0, 0, -sx * 0.5);
      Q(S, el, CYL2, GA, 0, -0.14, 0, 0.065, 0.16, 0.063); Q(S, el, CYL2, GA2, 0, -0.225, 0, 0.076, 0.05, 0.072); Q(S, el, SPH2, GD, 0, -0.29, 0.01, 0.058, 0.066, 0.052);
      [-0.022, 0, 0.022].forEach(dx => Q(S, el, OCT, GELO, dx, -0.35, 0.04, 0.009, 0.06, 0.009, -0.5, 0, 0)); }); }
    // calça: short escuro, saiote azul com gema e placas nas coxas
    { const S = 'calca';
      Q(S, P.hips, CYL2, GD, 0, -0.07, 0, 0.172, 0.14, 0.128); Q(S, P.hips, CYL2, GELO, 0, 0.0, 0, 0.18, 0.03, 0.132); Q(S, P.hips, BOX, GA, 0, -0.1, 0.126, 0.12, 0.16, 0.02); Q(S, P.hips, OCT, GA, 0, -0.205, 0.128, 0.06, 0.075, 0.012); Q(S, P.hips, OCT, GEMA, 0, -0.07, 0.14, 0.02, 0.03, 0.01);
      ['L', 'R'].forEach((s, i) => { const sx = i ? 1 : -1, th = P['th' + s];
        Q(S, th, SPH2, GA, sx * 0.05, -0.06, 0, 0.1, 0.14, 0.115, 0, 0, sx * 0.12); Q(S, th, CYL2, GA, 0, -0.25, 0, 0.082, 0.26, 0.082); Q(S, th, BOX, GELO, 0, -0.24, 0.08, 0.016, 0.24, 0.012);
        Q(S, th, OCT, GELO, sx * 0.105, -0.04, 0, 0.045, 0.2, 0.045, 0, 0, -sx * 0.3); Q(S, th, OCT, GELO, sx * 0.1, -0.13, 0.04, 0.024, 0.09, 0.024, 0, 0, -sx * 0.45); }); }
    // gregas: joelheira, canela azul e cristais
    { const S = 'greva'; ['L', 'R'].forEach((s, i) => { const sx = i ? 1 : -1, kn = P['kn' + s];
      Q(S, kn, SPH2, GA2, 0, 0, 0.03, 0.076, 0.076, 0.068); Q(S, kn, OCT, GELO, 0, 0, 0.1, 0.022, 0.07, 0.022, Math.PI / 2, 0, 0);
      Q(S, kn, CYL2, GA, 0, -0.21, 0, 0.074, 0.3, 0.074); Q(S, kn, BOX, GELO, 0, -0.2, 0.074, 0.02, 0.26, 0.012); Q(S, kn, TORF, GB, 0, -0.06, 0, 0.074, 0.074, 0.074, Math.PI / 2, 0, 0);
      Q(S, kn, OCT, GELO, sx * 0.075, -0.04, 0, 0.045, 0.16, 0.045, 0, 0, -sx * 0.4); Q(S, kn, OCT, GELO, sx * 0.07, -0.2, -0.02, 0.024, 0.09, 0.024, 0, 0, -sx * 0.3); }); }
    // botas
    { const S = 'pe'; ['L', 'R'].forEach((s, i) => { const sx = i ? 1 : -1, ft = P['ft' + s];
      Q(S, ft, SPH2, GA, 0, 0.005, 0.05, 0.08, 0.065, 0.148); Q(S, ft, OCT, GELO, 0, 0.0, 0.2, 0.03, 0.06, 0.026, Math.PI / 2, 0, 0); Q(S, ft, BOX, GD, 0, -0.048, 0.05, 0.125, 0.02, 0.27);
      Q(S, ft, CYL2, GA2, 0, 0.065, 0, 0.076, 0.04, 0.076); Q(S, ft, OCT, GELO, sx * 0.07, 0.08, 0, 0.022, 0.08, 0.022, 0, 0, -sx * 0.5); }); } }
  function atualizaPecas() { const P = heroi.userData.P; Object.keys(PEC).forEach(s => { const on = AR.pecas[s] === 'glacial'; PEC[s].forEach(m => m.visible = on); });
    Object.keys(CASACOS).forEach(c => Object.keys(CAS[c].pc).forEach(s => { const on = AR.pecas[s] === c; CAS[c].pc[s].forEach(m => m.visible = on); }));
    const sob = ['calca', 'peito', 'pe', 'maos', 'ombro'].map(s => AR.pecas[s]).find(x => CASACOS[x]);
    const elmo = AR.pecas.cabeca === 'glacial';
    if (elmo && !HV) { HV = []; P.head.children.forEach(c => { if (!PEC.cabeca.includes(c) && c.visible) { HV.push(c); c.visible = false; } }); } else if (!elmo && HV) { HV.forEach(c => c.visible = true); HV = null; }
    const alg = PECAS.some(([k]) => AR.pecas[k] === 'glacial'); roupaBase.forEach(([o, mt]) => o.material = AR.fantasia === 'celeste' ? MALHA : CAS[AR.fantasia] ? CAS[AR.fantasia].calca : sob ? CAS[sob].calca : alg ? GD : mt); }
  function vestePeca(k, on, set) { AR.pecas[k] = on ? (set || 'glacial') : null; if (on && AR.fantasia !== 'comum') { AR.fantasia = 'comum'; escondeTrajes(); } salvaAR(); atualizaPecas(); setTimeout(fazRetrato, 60); }

  // ---- retrato e prévia (render do próprio Leonardo) ----
  const rtR = new T3.WebGLRenderTarget(128, 128); rtR.texture.colorSpace = T3.SRGBColorSpace; const rtV = new T3.WebGLRenderTarget(240, 320); rtV.texture.colorSpace = T3.SRGBColorSpace;
  const camR = new T3.PerspectiveCamera(28, 1, 0.05, 60), camV = new T3.PerspectiveCamera(26, 240 / 320, 0.05, 60); const bufR = new Uint8Array(128 * 128 * 4), bufV = new Uint8Array(240 * 320 * 4);
  function renderPara(rt, c, buf, canvas, w, h) { const esc = []; world.children.forEach(o => { if (o !== heroi && o.visible) { esc.push(o); o.visible = false; } }); const bg = scene.background, fg = scene.fog; scene.background = null; scene.fog = null;
    renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, c); renderer.readRenderTargetPixels(rt, 0, 0, w, h, buf); renderer.setRenderTarget(null);
    scene.background = bg; scene.fog = fg; esc.forEach(o => o.visible = true);
    const x = canvas.getContext('2d'); const img = x.createImageData(w, h); for (let y = 0; y < h; y++) img.data.set(buf.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4); x.clearRect(0, 0, w, h); x.putImageData(img, 0, 0); }
  const vR = new T3.Vector3();
  function fazRetrato() { const P = heroi.userData.P; heroi.updateMatrixWorld(true); P.head.getWorldPosition(vR); const a = heroi.rotation.y + 0.35; camR.position.set(vR.x + Math.sin(a) * 0.95, vR.y + 0.14, vR.z + Math.cos(a) * 0.95); camR.lookAt(vR.x, vR.y + 0.06, vR.z); renderPara(rtR, camR, bufR, $('retrato'), 128, 128); }
  let girar = 0;
  function fazPrevia(dt, alvoCv) { girar += dt * 0.6; const p = heroi.position; const a = heroi.rotation.y + Math.sin(girar) * 0.9; camV.position.set(p.x + Math.sin(a) * 3.6, p.y + 1.0, p.z + Math.cos(a) * 3.6); camV.lookAt(p.x, p.y + 0.78, p.z); renderPara(rtV, camV, bufV, alvoCv || $('previa'), 240, 320); }

  // ---- janela do perfil ----
  let abaPerfil = 'status';
  function abrirPerfil() { if (conversa || cenaQ) return; $('perfil').hidden = false; $('pf-escolha').hidden = true; desenhaPerfil(); }
  function desenhaPerfil() { desenhaSlots(); document.querySelectorAll('#perfil .aba').forEach(b => b.classList.toggle('on', b.dataset.a === abaPerfil)); const C = $('pf-cont'); const A = ARMAS[AR.arma] || ARMAS.bastao;
    const CLp = CLA(); $('pf-nome').innerHTML = `${(AR.visual.nome || 'Leonardo').replace(/</g, '')} <b>Nv ${AR.nv}</b><small>${CLp ? CLp.icone + ' ' + CLp.nome : ''}</small>`; const CU = window.CONTA && CONTA.usuario; $('pf-conta').innerHTML = CU ? `<span>👤 ${(CU.displayName || CU.email || '').replace(/</g, '')}</span><button id="pf-sair">Sair da conta</button>` : `<button id="pf-sair">Entrar / criar conta</button>`;
    tapBtn($('pf-sair'), () => { if (CU) CONTA.sair(); else { try { sessionStorage.removeItem('aetherion-convidado'); } catch (e) {} $('perfil').hidden = true; $('login').hidden = false; } }); if (window.CONTA && CONTA.selo) CONTA.selo(); const ev = document.createElement('button'); ev.textContent = '✏️ Editar visual'; $('pf-conta').prepend(ev); tapBtn(ev, () => { $('perfil').hidden = true; abrirCriar(2, true); }); $('pf-xp').style.width = (AR.nv >= NV_MAX ? 100 : AR.xp / xpPara(AR.nv) * 100) + '%'; $('pf-xpt').textContent = AR.nv >= NV_MAX ? 'NÍVEL MÁXIMO' : `XP ${AR.xp} / ${xpPara(AR.nv)}`;
    if (abaPerfil === 'status') { const ab = AR.abates; const tot = Object.values(ab).reduce((s, v) => s + v, 0);
      const L = [['❤️', 'Vida', `${Math.ceil(vida)} / ${VIDA_MAX}`], ['🔷', 'Mana', `${Math.round(mana)} / ${MANA_MAX}`], ['⚔️', 'Ataque', `${Math.round(A.dano * atkMult())} (${A.icone} ${A.nome})`], ['🎯', 'Crítico / Esquiva', `${Math.round(((CLA() || {}).crit || 0.05) * 100)}% / ${Math.round(((CLA() || {}).esq || 0) * 100)}%`], ['🛡️', 'Defesa', `${defesa()}% (${FANT[AR.fantasia].nome})`],
        ['⚡', 'Modos de batalha', `I${AR.nv >= BM_NV[1] ? ' · II' : ''}${AR.nv >= BM_NV[2] ? ' · III' : ''}${AR.nv < BM_NV[2] ? ' (III no nv ' + BM_NV[2] + ')' : ''}`], ['🌳', 'Pontos de habilidade', AR.pts], ['🐺', 'Bichos derrotados', `${tot}${ab.golem ? ' · Golem ✔' : ''}`], ['🏆', 'Finais', `${finais.length} / 6`], ['💰', 'Moedas', AR.inv.moedas]];
      C.innerHTML = '<div class="stats">' + L.map(([i, n, v]) => `<div class="st"><span>${i}</span><small>${n}</small><b>${v}</b></div>`).join('') + '</div><p class="dica">Cada nível dá +5 de vida, +3 de mana, +2% de ataque e 1 ponto de habilidade. Ganhe XP derrotando bichos, falando com as pessoas e fazendo as missões.</p>'; return; }
    C.innerHTML = '';
    const sec = (t) => { const h = document.createElement('div'); h.className = 'sec'; h.textContent = t; C.appendChild(h); const g = document.createElement('div'); g.className = 'grade'; C.appendChild(g); return g; };
    const cel = (g, ic, nome, sub, on, fn, tag) => { const b = document.createElement('button'); b.className = 'cel' + (on ? ' on' : '') + (fn ? '' : ' fixa'); b.innerHTML = `<span class="ic">${ic}</span><b>${nome}</b><small>${sub}</small>${tag ? `<em>${tag}</em>` : ''}`; if (fn) tapBtn(b, fn); g.appendChild(b); };
    let g = sec('⚔️ Armas · toque pra equipar ou desequipar');
    Object.keys(ARMAS).forEach(k => { const W = ARMAS[k], tem = AR.armas.includes(k); if (W.oculta || (W.classe && !tem)) return; const on = AR.arma === k; cel(g, tem ? W.icone : '🔒', W.nome, tem ? (on ? 'Toque pra desequipar' : 'Dano ' + W.dano) : 'Na Forja', on, tem ? () => { equipaArma(on ? null : k); desenhaPerfil(); } : null, on ? 'EQUIPADA' : ''); });
    g = sec('🎭 Fantasias · só visual');
    Object.keys(COSM).forEach(k => { const F = COSM[k], tem = AR.cosms.includes(k), on = AR.cosm === k; cel(g, tem ? F.icone : '🔒', F.nome, tem ? (on ? 'Toque pra tirar' : F.desc) : '🔒', on, tem ? () => { vesteCosm(on ? null : k); desenhaPerfil(); } : null, on ? 'VESTIDA' : ''); });
    g = sec('👕 Armaduras');
    Object.keys(FANT).forEach(k => { const F = FANT[k], tem = AR.fantasias.includes(k); cel(g, F.icone, F.nome, tem ? (F.def ? 'Defesa +' + F.def + '%' : 'Sem defesa') : '🔒', AR.fantasia === k, tem && AR.fantasia !== k ? () => { vesteFantasia(k); aviso('Vestiu: ' + F.icone + ' ' + F.nome, '#7ac8ff'); desenhaPerfil(); } : null, AR.fantasia === k ? 'VESTIDO' : ''); });
    g = sec('🧊 Armadura Glacial · peças (+5% cada, conjunto completo +10%)');
    PECAS.forEach(([k, ic, nm]) => { const on = AR.pecas[k] === 'glacial'; cel(g, ic, nm, 'Defesa +5%', on, () => { vestePeca(k, !on); desenhaPerfil(); }, on ? 'VESTIDA' : ''); });
    { const todas = PECAS.every(([k]) => AR.pecas[k] === 'glacial'); cel(g, '❄️', 'Conjunto completo', todas ? 'Tirar tudo' : 'Vestir tudo', todas, () => { PECAS.forEach(([k]) => { AR.pecas[k] = todas ? null : 'glacial'; }); if (!todas && AR.fantasia !== 'comum') { AR.fantasia = 'comum'; escondeTrajes(); } salvaAR(); atualizaPecas(); setTimeout(fazRetrato, 60); desenhaPerfil(); }, todas ? 'VESTIDO' : ''); }
    g = sec('🎒 Itens');
    cel(g, '💰', 'Moedas', AR.inv.moedas + 'x', false, null); cel(g, '🐺', 'Pele de lobo', AR.inv.pele + 'x · vende na Forja', false, null);
    cel(g, '🍖', 'Carne', AR.inv.carne + 'x · toque pra comer', false, AR.inv.carne ? () => { comer(); desenhaPerfil(); } : null); if (AR.inv.coracao) cel(g, '💎', 'Coração de Gelo', AR.inv.coracao + 'x · Espada Glacial', false, null); }
  document.querySelectorAll('#perfil .aba').forEach(b => tapBtn(b, () => { abaPerfil = b.dataset.a; desenhaPerfil(); }));
  tapBtn($('perfil-btn'), abrirPerfil); tapBtn($('pf-fecha'), () => { $('perfil').hidden = true; });
  let previaT = 0; function perfilFrame(dt) { if ($('perfil').hidden || !$('previa')) return; previaT += dt; if (previaT > 0.06) { fazPrevia(previaT); previaT = 0; } }
  aplicaNivel(); atualizaNivel(); vesteFantasia(AR.fantasia); setTimeout(fazRetrato, 700);
  // ===================== CLASSES E CRIAÇÃO DO PERSONAGEM =====================
  CLASSES = {
    guerreiro: { nome: 'Guerreiro', icone: '⚔️', papel: 'Força bruta', cor: '#e04a32', roupa: '#7a2a22', vida: 140, mana: 80, atk: 1.25, def: 15, vel: 1.0, crit: 0.05, esq: 0, arma: 'espadao', hab: 'sismico', desc: 'Muita vida, defesa alta e o maior ataque do jogo. Usa um espadão de duas mãos. Ótimo pra começar.' },
    duelista: { nome: 'Duelista', icone: '🗡️', papel: 'Velocidade e crítico', cor: '#e8b030', roupa: '#2a2a3a', vida: 100, mana: 90, atk: 1.05, def: 5, vel: 1.15, crit: 0.25, esq: 0.18, arma: 'laminas', hab: 'danca', desc: 'Duas lâminas, ataque muito rápido, desvia dos golpes e acerta muito crítico. Excelente pra jogar sozinho.' },
    mago: { nome: 'Mago', icone: '🔮', papel: 'Magia em área', cor: '#4a8aff', roupa: '#2a3a8a', vida: 80, mana: 150, atk: 1.2, def: 0, vel: 0.95, crit: 0.1, esq: 0, arma: 'cajado', hab: 'meteoro', desc: 'O dano em área mais forte do jogo, de longe. Mas tem pouca defesa: mantenha distância!' },
    arqueiro: { nome: 'Arqueiro Arcano', icone: '🏹', papel: 'Distância e cura', cor: '#3ac86a', roupa: '#2a5a3a', vida: 95, mana: 120, atk: 1.05, def: 5, vel: 1.1, crit: 0.12, esq: 0.1, arma: 'arco', hab: 'rajada', desc: 'Arco mágico, ótima mobilidade e cura forte. Um dos melhores pra caçar sozinho.' },
    guardiao: { nome: 'Guardião Arcano', icone: '🛡️', papel: 'Tanque', cor: '#9aaccc', roupa: '#4a5a7a', vida: 160, mana: 90, atk: 0.9, def: 30, vel: 0.95, crit: 0.05, esq: 0, arma: 'escudo', hab: 'muralha', desc: 'O tanque: defesa máxima e escudo grande. Segura qualquer pancada e protege o grupo.' },
    espadachim: { nome: 'Espadachim Arcano', icone: '✴️', papel: 'Espada e magia', cor: '#b46aff', roupa: '#4a2a6a', vida: 105, mana: 120, atk: 1.1, def: 10, vel: 1.05, crit: 0.12, esq: 0.05, arma: 'runica', hab: 'runa', desc: 'Híbrido de espada e magia. Enfraquece os inimigos pra eles tomarem mais dano.' },
    gladiador: { nome: 'Gladiador', icone: '🌀', papel: 'Área de perto', cor: '#ff8a3a', roupa: '#8a4a1a', vida: 125, mana: 85, atk: 1.1, def: 15, vel: 1.0, crit: 0.08, esq: 0.03, arma: 'chakram', hab: 'tufao', desc: 'Chakrams que acertam tudo em volta. Muito resistente e fácil de jogar.' },
    atirador: { nome: 'Atirador Arcano', icone: '🔫', papel: 'Tiro de longe', cor: '#ffe04a', roupa: '#3a3a2a', vida: 90, mana: 110, atk: 1.15, def: 5, vel: 1.05, crit: 0.15, esq: 0.05, arma: 'arcana', hab: 'carregado', desc: 'Arma de fogo arcana: alcance enorme e tiros rápidos sem parar.' },
    magonegro: { nome: 'Mago Negro', icone: '🌑', papel: 'Magia sombria', cor: '#a050ff', roupa: '#1a1424', vida: 95, mana: 140, atk: 1.3, def: 10, vel: 1.0, crit: 0.1, esq: 0, arma: 'sombrio', hab: 'drenar', desc: 'Uma das classes mais fortes no fim do jogo. Rouba a vida dos inimigos pra se curar.' },
  };
  const HABS = [
    { id: 'sismico', nome: 'Sísmico', icone: '💢', custo: 25, desc: 'Golpe Sísmico: bate o espadão no chão. Dano em volta e deixa os bichos tontos.' },
    { id: 'danca', nome: 'Dança', icone: '🌪️', custo: 20, desc: 'Dança das Lâminas: pula no bicho mais perto e corta 4 vezes. O último corte é sempre crítico.' },
    { id: 'meteoro', nome: 'Meteoro', icone: '☄️', custo: 35, desc: 'Chuva de Meteoros: pedras de fogo caem em cima do bicho mais perto, em área.' },
    { id: 'rajada', nome: 'Rajada', icone: '🍃', custo: 22, desc: 'Rajada Arcana: 3 flechas de luz em leque e cura 25 de vida.' },
    { id: 'muralha', nome: 'Muralha', icone: '🧱', custo: 25, desc: 'Muralha: por 6 segundos você recebe 80% menos dano e empurra os bichos pra longe.' },
    { id: 'runa', nome: 'Runa', icone: '✴️', custo: 22, desc: 'Lâmina Rúnica: corte mágico na frente que deixa os bichos fracos (+50% de dano) por 6 segundos.' },
    { id: 'tufao', nome: 'Tufão', icone: '🌀', custo: 28, desc: 'Tufão de Chakrams: chakrams giram em volta de você por 4 segundos acertando tudo.' },
    { id: 'carregado', nome: 'Carregado', icone: '💥', custo: 28, desc: 'Tiro Carregado: um raio que atravessa todos os bichos em linha reta.' },
    { id: 'drenar', nome: 'Drenar', icone: '🩸', custo: 25, desc: 'Drenar Alma: rouba a vida do bicho mais perto e cura você.' },
  ];
  HABS.forEach(h => { h.tipo = 'uso'; h.classe = true; PODERES.push(h); PW[h.id] = h; });
  Object.assign(ARMAS, {
    espadao: { nome: 'Espadão', icone: '🗡️', dano: 26, alc: 2.7, cd: 0.55, classe: 'guerreiro', desc: 'Espada enorme de duas mãos.' },
    laminas: { nome: 'Lâminas Gêmeas', icone: '⚔️', dano: 13, alc: 2.0, cd: 0.22, classe: 'duelista', desc: 'Uma lâmina em cada mão. Muito rápida.' },
    cajado: { nome: 'Cajado Arcano', icone: '🪄', dano: 22, alc: 18, cd: 0.55, longe: true, proj: '#7ac8ff', classe: 'mago', desc: 'Dispara bolas de mana.' },
    arco: { nome: 'Arco Mágico', icone: '🏹', dano: 18, alc: 20, cd: 0.42, longe: true, proj: '#8aff9a', classe: 'arqueiro', desc: 'Flechas de luz.' },
    escudo: { nome: 'Espada e Escudo', icone: '🛡️', dano: 14, alc: 2.0, cd: 0.4, classe: 'guardiao', desc: 'Espada curta e escudo grande.' },
    runica: { nome: 'Espada Rúnica', icone: '✴️', dano: 18, alc: 2.3, cd: 0.34, classe: 'espadachim', desc: 'Lâmina com runas que brilham.' },
    chakram: { nome: 'Chakrams', icone: '🌀', dano: 15, alc: 2.6, cd: 0.34, giro: true, classe: 'gladiador', desc: 'Acertam tudo em volta.' },
    arcana: { nome: 'Arma Arcana', icone: '🔫', dano: 16, alc: 22, cd: 0.3, longe: true, proj: '#ffe24a', classe: 'atirador', desc: 'Tiros de mana em sequência.' },
    sombrio: { nome: 'Cajado Sombrio', icone: '🌑', dano: 25, alc: 16, cd: 0.6, longe: true, proj: '#b05aff', classe: 'magonegro', desc: 'Magia das sombras.' },
  });
  // ---- modelos das armas de classe ----
  const maoE = grp(heroi.userData.P.elL, 0, -0.33, 0.05); const ARMAE = {};
  { const AÇO = met('#d4dbe6', 0.25, 0.95), ESC = met('#3a3440', 0.5, 0.6), OURO = met('#e2c27a', 0.3, 0.9), MAD = met('#6a4426', 0.75, 0.05), MADN = met('#241a2e', 0.6, 0.2);
    const G = (cor) => new T3.MeshBasicMaterial({ color: cor, toneMapped: false });
    let g = ARMAG.espadao = grp(maoG); pc(g, BOX, AÇO, 0, 0, 0.82, 0.13, 0.025, 1.25); pc(g, CONE2, AÇO, 0, 0, 1.5, 0.065, 0.16, 0.012, Math.PI / 2, 0, 0); pc(g, BOX, met('#7a2a22', 0.4, 0.6), 0, 0, 0.16, 0.44, 0.06, 0.07); pc(g, CYL2, COU, 0, 0, 0.0, 0.03, 0.26, 0.03, Math.PI / 2, 0, 0); pc(g, SPH2, OURO, 0, 0, -0.14, 0.045, 0.045, 0.045); pc(g, BOX, met('#7a2a22', 0.4, 0.6), 0, 0.014, 0.6, 0.03, 0.006, 0.7);
    const lam = p => { pc(p, BOX, AÇO, 0, 0, 0.42, 0.05, 0.014, 0.66); pc(p, CONE2, AÇO, 0, 0, 0.79, 0.025, 0.1, 0.007, Math.PI / 2, 0, 0); pc(p, CYL2, OURO, 0, 0, 0.08, 0.05, 0.02, 0.05, Math.PI / 2, 0, 0); pc(p, CYL2, ESC, 0, 0, -0.02, 0.022, 0.16, 0.022, Math.PI / 2, 0, 0); };
    g = ARMAG.laminas = grp(maoG); lam(g); ARMAE.laminas = grp(maoE); lam(ARMAE.laminas);
    g = ARMAG.cajado = grp(maoG); pc(g, CYL2, MAD, 0, 0.25, 0.04, 0.026, 1.55, 0.026); pc(g, TORF, OURO, 0, 1.0, 0.04, 0.09, 0.09, 0.09); pc(g, SPH2, G('#9ad8ff'), 0, 1.06, 0.04, 0.07, 0.07, 0.07); glowSpr(g, 0, 1.06, 0.04, 0.8, '#5ab8ff', 0.8);
    g = ARMAG.arco = grp(maoG); { const arc = new T3.Mesh(new T3.TorusGeometry(0.5, 0.022, 8, 40, Math.PI), met('#2a5a3a', 0.4, 0.5)); arc.rotation.set(0, -Math.PI / 2, -Math.PI / 2); arc.position.set(0, 0.05, 0.02); g.add(arc); pc(g, BOX, G('#bfffc8'), 0, 0.05, 0.02, 0.004, 1.0, 0.004); glowSpr(g, 0, 0.05, 0.5, 0.6, '#8aff9a', 0.6); }
    g = ARMAG.escudo = grp(maoG); pc(g, BOX, AÇO, 0, 0, 0.36, 0.06, 0.016, 0.52); pc(g, BOX, OURO, 0, 0, 0.08, 0.2, 0.04, 0.04); pc(g, CYL2, COU, 0, 0, -0.02, 0.022, 0.14, 0.022, Math.PI / 2, 0, 0);
    ARMAE.escudo = grp(maoE); { const e = ARMAE.escudo; const s = pc(e, BEV, BR, -0.06, 0.12, 0.05, 0.48, 0.66, 0.04, 0, Math.PI / 2, Math.PI); pc(e, SPH2, GEMA, -0.12, 0.08, 0.05, 0.012, 0.05, 0.05); pc(e, TORF, OURO, -0.115, 0.08, 0.05, 0.1, 0.1, 0.1, 0, Math.PI / 2, 0); }
    g = ARMAG.runica = grp(maoG); pc(g, BOX, met('#3a3050', 0.3, 0.9), 0, 0, 0.5, 0.08, 0.02, 0.82); pc(g, BOX, G('#d8a8ff'), 0, 0.012, 0.5, 0.016, 0.004, 0.7); pc(g, CONE2, met('#3a3050', 0.3, 0.9), 0, 0, 0.95, 0.04, 0.12, 0.01, Math.PI / 2, 0, 0); pc(g, BOX, OURO, 0, 0, 0.1, 0.24, 0.04, 0.04); glowSpr(g, 0, 0, 0.55, 0.9, '#b46aff', 0.35);
    ARMAE.runica = grp(maoE); pc(ARMAE.runica, SPH2, G('#e0c0ff'), 0, -0.02, 0.1, 0.05, 0.05, 0.05); glowSpr(ARMAE.runica, 0, -0.02, 0.1, 0.55, '#b46aff', 0.9);
    const chak = p => { const r = pc(p, TOR2, AÇO, 0, -0.02, 0.12, 0.17, 0.17, 0.4, 0, Math.PI / 2, 0); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; pc(p, CONE2, OURO, 0, -0.02 + Math.sin(a) * 0.2, 0.12 + Math.cos(a) * 0.2, 0.018, 0.08, 0.008, a, 0, 0); } return r; };
    g = ARMAG.chakram = grp(maoG); chak(g); ARMAE.chakram = grp(maoE); chak(ARMAE.chakram);
    g = ARMAG.arcana = grp(maoG); pc(g, BOX, ESC, 0, 0.03, 0.18, 0.08, 0.11, 0.42); pc(g, CYL2, AÇO, 0, 0.05, 0.45, 0.03, 0.2, 0.03, Math.PI / 2, 0, 0); pc(g, TORF, G('#ffe24a'), 0, 0.05, 0.52, 0.035, 0.035, 0.035); pc(g, BOX, COU, 0, -0.06, 0.04, 0.06, 0.14, 0.07, 0.3, 0, 0); pc(g, BOX, G('#ffe24a'), 0, 0.09, 0.2, 0.012, 0.012, 0.3); glowSpr(g, 0, 0.05, 0.56, 0.4, '#ffe24a', 0.7);
    g = ARMAG.sombrio = grp(maoG); pc(g, CYL2, MADN, 0, 0.25, 0.04, 0.026, 1.55, 0.026); { const lua = new T3.Mesh(new T3.TorusGeometry(0.16, 0.022, 8, 30, Math.PI * 1.3), met('#c8c0d8', 0.3, 0.9)); lua.position.set(0, 1.05, 0.04); lua.rotation.set(0, Math.PI / 2, 0.6); g.add(lua); } pc(g, CONE2, G('#c890ff'), 0, 1.06, 0.04, 0.05, 0.18, 0.05); glowSpr(g, 0, 1.06, 0.04, 0.9, '#a050ff', 0.85);
    // Espada do Dragão de Fogo (só cai do Dragão das Profundezas)
    { const D3 = ARMAG.dragao = grp(maoG); const T = T3;
      const ACO = new T.MeshPhysicalMaterial({ color: '#f2f4fa', metalness: 1, roughness: 0.15, clearcoat: 1, envMap: ENV, envMapIntensity: 1.6 });
      const OU = new T.MeshPhysicalMaterial({ color: '#f0b840', metalness: 1, roughness: 0.25, clearcoat: 0.6, emissive: '#5a2a00', emissiveIntensity: 0.4, envMap: ENV });
      const RUB = new T.MeshPhysicalMaterial({ color: '#ff2030', emissive: '#ff1020', emissiveIntensity: 2.5, roughness: 0.05, clearcoat: 1, toneMapped: false });
      const VM = new T.MeshPhysicalMaterial({ color: '#9a1010', metalness: 0.6, roughness: 0.35, clearcoat: 0.8, emissive: '#5a0000', emissiveIntensity: 0.6, envMap: ENV });
      const FOGO = new T.MeshBasicMaterial({ color: '#ff7a10', transparent: true, opacity: 0.7, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
      const mm = (geo, mat, x, y, z, p) => { const o = new T.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = true; (p || D3).add(o); return o; };
      const Lm = 1.05, bl = grp(D3, 0, 0, 0.12); bl.rotation.x = Math.PI / 2; const sh = new T.Shape(); sh.moveTo(-0.04, 0);
      for (let i = 0; i <= 20; i++) { const t = i / 20; sh.lineTo(-0.04 - Math.sin(t * Math.PI * 0.9) * 0.05 + t * t * 0.12, t * Lm); }
      for (let i = 20; i >= 0; i--) { const t = i / 20; const w = 0.075 + Math.sin(t * Math.PI) * 0.06 - (t > 0.85 ? (t - 0.85) * 0.9 : 0); sh.lineTo(-0.04 - Math.sin(t * Math.PI * 0.9) * 0.05 + t * t * 0.12 + w * (t < 0.97 ? 1 : 0.2), t * Lm - (t > 0.9 ? (t - 0.9) * 0.6 : 0)); }
      sh.closePath(); const bg = new T.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.012, bevelSegments: 2, curveSegments: 24 }); bg.translate(0, 0, -0.006); mm(bg, ACO, 0, 0, 0, bl);
      const s2 = new T.Shape(); s2.moveTo(-0.025, 0.06); for (let i = 1; i <= 14; i++) { const t = i / 14 * 0.72; s2.lineTo(-0.025 - Math.sin(t * Math.PI * 0.9) * 0.05 + t * t * 0.12 + 0.012, 0.06 + t * Lm); } for (let i = 14; i >= 0; i--) { const t = i / 14 * 0.72; s2.lineTo(-0.025 - Math.sin(t * Math.PI * 0.9) * 0.05 + t * t * 0.12 + 0.04, 0.06 + t * Lm); } s2.closePath();
      [-1, 1].forEach(s => { const f = mm(new T.ShapeGeometry(s2), VM, 0, 0, s * 0.0125, bl); if (s < 0) { f.rotation.y = Math.PI; f.scale.x = -1; } });
      const gd = grp(D3); mm(new T.TorusGeometry(0.085, 0.016, 10, 32), OU, 0, 0, 0.1, gd).rotation.y = Math.PI / 2; mm(new T.SphereGeometry(0.05, 24, 16), RUB, 0, 0, 0.1, gd);
      [-1, 1].forEach(s => { const c = mm(new T.ConeGeometry(0.03, 0.2, 8), OU, s * 0.11, 0, 0.12, gd); c.rotation.z = -s * 1.2; c.rotation.x = 0.4; const c2 = mm(new T.ConeGeometry(0.02, 0.12, 6), OU, s * 0.17, 0, 0.2, gd); c2.rotation.z = -s * 0.6; c2.rotation.x = -0.8; });
      mm(new T.SphereGeometry(0.035, 16, 12), OU, 0.06, 0, 0.17, gd).scale.set(1, 0.8, 1.5);
      mm(new T.CylinderGeometry(0.026, 0.026, 0.26, 16), VM, 0, 0, -0.05).rotation.x = Math.PI / 2; for (let k = 0; k < 7; k++) mm(new T.TorusGeometry(0.028, 0.006, 6, 16), OU, 0, 0, -0.16 + k * 0.035);
      mm(new T.SphereGeometry(0.035, 16, 12), OU, 0, 0, -0.2); mm(new T.ConeGeometry(0.02, 0.12, 6), OU, 0, 0, -0.27).rotation.x = -Math.PI / 2;
      const crv = []; for (let i = 0; i <= 50; i++) { const t = i / 50, a = t * Math.PI * 4.2; crv.push(new T.Vector3(Math.cos(a) * (0.16 - t * 0.05) + t * 0.05, Math.sin(a) * (0.12 - t * 0.04), 0.1 + t * 1.05)); }
      const cv = new T.CatmullRomCurve3(crv); mm(new T.TubeGeometry(cv, 100, 0.022, 6, false), FOGO, 0, 0, 0); const f2 = FOGO.clone(); f2.opacity = 0.18; f2.color.set('#ff4a00'); mm(new T.TubeGeometry(cv, 100, 0.045, 6, false), f2, 0, 0, 0);
      const e1 = crv[crv.length - 1]; mm(new T.ConeGeometry(0.045, 0.14, 8), FOGO, e1.x, e1.y, e1.z + 0.05).rotation.x = Math.PI / 2;
      for (let i = 0; i < 10; i++) { const p = cv.getPoint(i / 9); glowSpr(D3, p.x, p.y, p.z, 0.16 + (i % 3) * 0.04, '#ff8a2a', 0.35); } glowSpr(D3, 0, 0, 0.1, 0.35, '#ffb040', 0.8);
      D3.userData.fogo = cv; }
    Object.values(ARMAE).forEach(x => x.visible = false); Object.values(ARMAG).forEach(x => x.traverse(o => { if (o.isMesh) o.castShadow = true; })); }
  const mostraArma0 = mostraArma; mostraArma = function () { mostraArma0(); Object.keys(ARMAE).forEach(k => ARMAE[k].visible = k === AR.arma && !(typeof duploG !== 'undefined' && duploG)); };

  // ===================== EQUIPAMENTO: uma arma só e slot de fantasia =====================
  // A arma equipada fica nas costas; vai pra mão quando ele ataca e volta pras costas uns segundos depois.
  const P0 = heroi.userData.P; const costasG = grp(P0.spine, 0, 0, 0); let naMao = true, armaNasCostas = null;
  const ARMA_EIXO_Y = { cajado: 1, sombrio: 1, arco: 1 }; const SEGURA_MAO = 3;
  const mBase = (x, y, z) => new T3.Matrix4().makeBasis(new T3.Vector3(...x).normalize(), new T3.Vector3(...y).normalize(), new T3.Vector3(...z).normalize());
  const POSE_COSTAS = {
    lamina: { pos: [0.16, 0.8, -0.2], m: mBase([0.89, -0.45, 0], [0, 0, 1], [-0.45, -0.89, 0]) },     // cabo no ombro, lâmina descendo cruzada
    vara: { pos: [0.0, 0.28, -0.19], m: mBase([0.894, -0.447, 0], [0.447, 0.894, 0], [0, 0, 1]) }, // cajado/arco em diagonal
    lamina2: { pos: [-0.16, 0.8, -0.21], m: mBase([0.89, 0.45, 0], [0, 0, 1], [0.45, -0.89, 0]) },      // segunda lâmina cruzando a outra
    escudo: { pos: [0.0, 0.3, -0.16], m: mBase([0, 0, 1], [0, 1, 0], [-1, 0, 0]) } };
  function poeNaMao() { P0.elR.add(maoG); maoG.position.set(0, -0.33, 0.05); maoG.quaternion.identity(); P0.elL.add(maoE); maoE.position.set(0, -0.33, 0.05); maoE.quaternion.identity(); }
  function poeNasCostas(k) { const ps = (g, cfg) => { costasG.add(g); g.position.set(...cfg.pos); g.quaternion.setFromRotationMatrix(cfg.m); };
    ps(maoG, ARMA_EIXO_Y[k] ? POSE_COSTAS.vara : POSE_COSTAS.lamina);
    if (k === 'escudo') ps(maoE, POSE_COSTAS.escudo); else ps(maoE, POSE_COSTAS.lamina2);
    if (ARMAE.runica) ARMAE.runica.visible = false; }
  function armaVisivel() { return Object.keys(ARMAG).find(k => ARMAG[k].visible) || null; }
  function equipaArma(k) { AR.arma = k && AR.armas.includes(k) ? k : 'punho'; salvaAR(); mostraArma(); armaNasCostas = null; setTimeout(fazRetrato, 60);
    const A = ARMAS[AR.arma]; aviso(AR.arma === 'punho' ? '👊 Arma guardada na mochila' : 'Equipou: ' + A.icone + ' ' + A.nome, '#ffd23c'); }

  // ---- fantasias de enfeite (só visual) ----
  const COSM = { morcego: { nome: 'Asas de Morcego', icone: '🦇', desc: 'Só de enfeite. Batem quando você corre e pula.' } };
  AR.cosms = AR.cosms || []; if (!AR.cosmV2) { AR.cosms = AR.cosms.filter(c => c !== 'morcego'); AR.cosmV2 = 1; } if (!AR.cosms.includes(AR.cosm)) AR.cosm = null; // asas agora caem do Morcego Gigante
  const ASAS = grp(P0.spine, 0, 0.44, -0.13); const ASA = {};
  { const MEMB = new T3.MeshToonMaterial({ color: '#3a1f4a', gradientMap: GRAD, side: T3.DoubleSide }); const OSSO = tm('#1a0e24'); const GARRA = tm('#e8e0d0');
    const s = new T3.Shape(); s.moveTo(0, 0.04); s.lineTo(0.34, 0.3); s.lineTo(0.8, 0.36); s.quadraticCurveTo(0.62, 0.2, 0.88, 0.02); s.quadraticCurveTo(0.62, -0.04, 0.74, -0.3); s.quadraticCurveTo(0.5, -0.18, 0.44, -0.44); s.quadraticCurveTo(0.26, -0.22, 0.03, -0.26); s.lineTo(0, 0.04);
    const memGeo = new T3.ShapeGeometry(s, 10); const up = new T3.Vector3(0, 1, 0);
    const osso = (p, a, b, r) => { const A = new T3.Vector3(...a), B = new T3.Vector3(...b), d = B.clone().sub(A); const m = new T3.Mesh(CYL, OSSO); m.position.copy(A).add(B).multiplyScalar(0.5); m.scale.set(r, d.length(), r); m.quaternion.setFromUnitVectors(up, d.normalize()); m.castShadow = true; p.add(m); };
    [['R', 1], ['L', -1]].forEach(([n, sx]) => { const w = grp(ASAS, 0.05 * sx, 0, 0); const g = grp(w); g.scale.x = sx; const mem = new T3.Mesh(memGeo, MEMB); mem.castShadow = true; g.add(mem);
      osso(g, [0, 0.04, 0.004], [0.34, 0.3, 0.004], 0.018); [[0.8, 0.36], [0.88, 0.02], [0.74, -0.3], [0.44, -0.44]].forEach(([x, y]) => osso(g, [0.34, 0.3, 0.004], [x, y, 0.004], 0.009));
      const c = new T3.Mesh(CONE, GARRA); c.position.set(0.36, 0.35, 0.004); c.scale.set(0.018, 0.07, 0.018); c.rotation.z = -0.5; g.add(c); ASA[n] = w; }); }
  function vesteCosm(k) { AR.cosm = k && AR.cosms.includes(k) ? k : null; salvaAR(); ASAS.visible = AR.cosm === 'morcego'; setTimeout(fazRetrato, 60); if (k && COSM[k]) aviso('Vestiu: ' + COSM[k].icone + ' ' + COSM[k].nome, '#c8a8ff'); }
  ASAS.visible = AR.cosm === 'morcego';

  // ---- espaços de equipamento na janela do perfil (no lugar da prévia do personagem) ----
  const SLOTS_EQ = [['cabeca', '⛑️', 'Elmo'], ['peito', '🦺', 'Peitoral'], ['maos', '🧤', 'Luvas'], ['calca', '🩳', 'Calça'], ['costas', '🦇', 'Costas'], ['arma', '⚔️', 'Arma'], ['greva', '🦵', 'Grevas'], ['pe', '🥾', 'Botas'], ['ombro', '🛡️', 'Ombreiras']];
  const pecaInfo = k => { const p = PECAS.find(x => x[0] === k); return p ? { icone: p[1], nome: p[2], sub: 'Defesa +5%' } : null; };
  function slotItem(k) {
    if (k === 'arma') { const W = ARMAS[AR.arma]; return AR.arma !== 'punho' && W ? W : null; }
    if (k === 'costas') return COSM[AR.cosm] || null;
    if (k === 'peito' && AR.fantasia !== 'comum' && FANT[AR.fantasia]) return FANT[AR.fantasia];
    if (CASACOS[AR.pecas[k]]) return sobInfo(AR.pecas[k], k);
    return AR.pecas[k] === 'glacial' ? pecaInfo(k) : null; }
  function opcoesSlot(k) {
    if (k === 'arma') return AR.armas.filter(w => ARMAS[w] && !ARMAS[w].oculta).map(w => ({ icone: ARMAS[w].icone, nome: ARMAS[w].nome, sub: 'Dano ' + ARMAS[w].dano, on: AR.arma === w, fn: () => equipaArma(w) }));
    if (k === 'costas') return AR.cosms.filter(c => COSM[c]).map(c => ({ icone: COSM[c].icone, nome: COSM[c].nome, sub: 'Só visual', on: AR.cosm === c, fn: () => vesteCosm(c) }));
    const P = pecaInfo(k); const ops = P ? [{ ...P, on: AR.pecas[k] === 'glacial', fn: () => vestePeca(k, true) }] : [];
    AR.sobs.filter(x => x.endsWith(':' + k)).forEach(x => { const I = sobInfo(x.split(':')[0], k); if (I) ops.push({ ...I, on: AR.pecas[k] === I.set, fn: () => vestePeca(k, true, I.set) }); });
    if (k === 'peito') AR.fantasias.filter(f => f !== 'comum' && FANT[f]).forEach(f => ops.push({ icone: FANT[f].icone, nome: FANT[f].nome, sub: 'Conjunto · defesa +' + FANT[f].def + '%' + (FANT[f].mana ? ' · mana +' + FANT[f].mana : ''), on: AR.fantasia === f, fn: () => vesteFantasia(f) }));
    return ops; }
  function tiraSlot(k) {
    if (k === 'arma') return equipaArma(null);
    if (k === 'costas') return vesteCosm(null);
    if (k === 'peito' && AR.fantasia !== 'comum') return vesteFantasia('comum');
    vestePeca(k, false); }
  function abreSlot(k) { const S = SLOTS_EQ.find(s => s[0] === k), box = $('pf-escolha');
    box.innerHTML = `<div class="pe-hd"><span>${S[1]} ${S[2]}</span><button class="pe-x">Voltar</button></div><div class="grade"></div>`; const g = box.querySelector('.grade'); const ops = opcoesSlot(k);
    if (!ops.length) g.innerHTML = '<p class="dica">Você ainda não tem nada pra esse espaço.</p>';
    ops.forEach(o => { const b = document.createElement('button'); b.className = 'cel' + (o.on ? ' on' : ''); b.innerHTML = `<span class="ic">${o.icone}</span><b>${o.nome}</b><small>${o.on ? 'Toque pra tirar' : o.sub}</small>${o.on ? '<em>EQUIPADO</em>' : ''}`;
      tapBtn(b, () => { if (o.on) tiraSlot(k); else o.fn(); box.hidden = true; desenhaPerfil(); }); g.appendChild(b); });
    tapBtn(box.querySelector('.pe-x'), () => { box.hidden = true; }); box.hidden = false; }
  function desenhaSlots() { const el = $('pf-slots'); if (!el) return; el.innerHTML = '';
    SLOTS_EQ.forEach(([k, ic, nm]) => { const it = slotItem(k); const b = document.createElement('button'); b.className = 'eqs' + (it ? ' on' : ''); b.innerHTML = `<span>${it ? it.icone : ic}</span><small>${nm}</small>`; b.title = it ? it.nome : nm + ' (vazio)'; tapBtn(b, () => abreSlot(k)); el.appendChild(b); }); }


  // ---------- MENU DE INVENTÁRIO (estilo MMO: equipamentos em cima, bolsa embaixo) ----------
  const IP_AREA = { cabeca: 'elmo', peito: 'peito', costas: 'costas', arma: 'arma', greva: 'greva', maos: 'luvas', calca: 'calca', pe: 'pe', ombro: 'ombro' }; const IP_BIG = ['peito', 'arma'];
  const ITEM_INFO = { carne: ['🍖', 'Carne', 'Recupera 35 de vida.', 'Comer'], pele: ['🐺', 'Pele de lobo', 'Venda na Forja: 3 moedas cada.'], coracao: ['💎', 'Coração de gelo', 'Material raro do Golem de Gelo. Usado na Forja.'] };
  let ipTab = 'eq', ipPag = 0, ipSel = null;
  function itensBolsa() { const L = [];
    AR.armas.filter(w => ARMAS[w] && !ARMAS[w].oculta && AR.arma !== w).forEach(w => L.push({ ic: ARMAS[w].icone, nome: ARMAS[w].nome, sub: 'Arma · dano ' + ARMAS[w].dano, acao: 'Equipar', fn: () => equipaArma(w) }));
    AR.fantasias.filter(f => f !== 'comum' && FANT[f] && AR.fantasia !== f).forEach(f => L.push({ ic: FANT[f].icone, nome: FANT[f].nome, sub: 'Armadura · defesa +' + FANT[f].def + '%' + (FANT[f].mana ? ' · mana +' + FANT[f].mana : ''), acao: 'Vestir', fn: () => vesteFantasia(f) }));
    AR.sobs.forEach(x => { const [set, k] = x.split(':'); if (AR.pecas[k] === set) return; const I = sobInfo(set, k); if (I) L.push({ ic: I.icone, cor: I.cor, nome: I.nome, sub: 'Peça de armadura · defesa +' + SOB_DEF + '%', acao: 'Vestir', fn: () => vestePeca(k, true, set) }); });
    AR.cosms.filter(c => COSM[c] && AR.cosm !== c).forEach(c => L.push({ ic: COSM[c].icone, nome: COSM[c].nome, sub: 'Costas · só visual', acao: 'Vestir', fn: () => vesteCosm(c) }));
    Object.keys(ITEM_INFO).forEach(k => { if (AR.inv[k] > 0) { const I = ITEM_INFO[k]; L.push({ ic: I[0], nome: I[1], sub: I[2], n: AR.inv[k], acao: I[3], fn: k === 'carne' ? comer : null }); } });
    return L; }
  function desenhaBolsa() { if ($('invp').hidden) return; document.querySelectorAll('.ip-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === ipTab)); document.querySelectorAll('.ip-bt button[data-b]').forEach(b => b.classList.toggle('on', +b.dataset.b === ipPag));
    const E = $('ip-eq'); E.innerHTML = '';
    if (ipTab === 'pet') E.innerHTML = '<div class="ip-pet"><span>🐾</span>Nenhum pet ainda<small>Em breve você vai poder ter um companheiro.</small></div>';
    else SLOTS_EQ.forEach(([k, ic, nm]) => { const it = slotItem(k); const b = document.createElement('button'); b.className = 'ip-s' + (it ? ' on' : '') + (IP_BIG.includes(k) ? ' big' : ''); b.style.gridArea = IP_AREA[k];
      b.innerHTML = `<small>${nm.toUpperCase()}</small><span>${it ? it.icone : ic}</span>` + (it && it.cor ? `<i style="background:${it.cor};color:${it.cor}"></i>` : ''); tapBtn(b, () => ipSlot(k)); E.appendChild(b); });
    const G = $('ip-grade'); G.innerHTML = ''; const L = itensBolsa(); const pg = L.slice(ipPag * 40, ipPag * 40 + 40);
    for (let i = 0; i < 40; i++) { const it = pg[i]; const c = document.createElement('button'); c.className = 'ip-c' + (it && ipSel === ipPag * 40 + i ? ' sel' : ''); if (it) { c.innerHTML = it.ic + (it.n > 1 ? `<b>${it.n}</b>` : '') + (it.cor ? `<i style="background:${it.cor};color:${it.cor}"></i>` : ''); tapBtn(c, () => { ipSel = ipPag * 40 + i; ipInfo(it); desenhaBolsa(); }); } G.appendChild(c); }
    $('ip-moedas').textContent = (AR.inv.moedas || 0).toLocaleString('pt-BR'); }
  function ipInfo(it) { const el = $('ip-info'); el.hidden = false; el.innerHTML = (it.fn ? `<button>${it.acao}</button>` : '') + `<b>${it.ic} ${it.nome}</b><br>${it.sub}`; if (it.fn) tapBtn(el.querySelector('button'), () => { it.fn(); ipSel = null; el.hidden = true; desenhaBolsa(); }); }
  function ipSlot(k) { const S = SLOTS_EQ.find(s => s[0] === k), box = $('ip-esc'), it = slotItem(k); const ops = opcoesSlot(k);
    box.innerHTML = `<div class="hd"><span>${S[1]} ${S[2]}</span><button>Voltar</button></div>`;
    if (it) { const b = document.createElement('button'); b.className = 'op on'; b.innerHTML = `<span>${it.icone}</span><div>${it.nome}<small>Toque pra tirar</small></div>`; tapBtn(b, () => { tiraSlot(k); box.hidden = true; desenhaBolsa(); }); box.appendChild(b); }
    ops.filter(o => !o.on).forEach(o => { const b = document.createElement('button'); b.className = 'op'; b.innerHTML = `<span>${o.icone}</span><div>${o.nome}<small>${o.sub || ''}</small></div>`; tapBtn(b, () => { o.fn(); box.hidden = true; desenhaBolsa(); }); box.appendChild(b); });
    if (!it && !ops.length) box.insertAdjacentHTML('beforeend', '<p style="color:#7a7262;margin:8px 2px">Você ainda não tem nada pra esse espaço.</p>');
    tapBtn(box.querySelector('.hd button'), () => { box.hidden = true; }); box.hidden = false; }
  function liberaAdm() { }
  function abrirBolsa() { if (conversa || cenaQ) return; liberaAdm(); const el = $('invp'); if (!el.hidden) { el.hidden = true; return; } el.hidden = false; $('ip-esc').hidden = true; ipSel = null; $('ip-info').hidden = true; desenhaBolsa(); }
  tapBtn($('bolsa-btn'), abrirBolsa); tapBtn($('ip-x'), () => { $('invp').hidden = true; });
  document.querySelectorAll('.ip-tabs button').forEach(b => tapBtn(b, () => { ipTab = b.dataset.t; $('ip-esc').hidden = true; desenhaBolsa(); }));
  document.querySelectorAll('.ip-bt button[data-b]').forEach(b => tapBtn(b, () => { ipPag = +b.dataset.b; ipSel = null; $('ip-info').hidden = true; desenhaBolsa(); }));
  tapBtn($('ip-ord'), () => { ipPag = 0; ipSel = null; $('ip-info').hidden = true; desenhaBolsa(); aviso('🎒 Bolsa organizada', '#c8b890'); });
  // ---------- TROCA ENTRE JOGADORES (pelo Firestore) ----------
  const TR = { id: null, doc: null, un: null, unConv: null, convites: [], escolhendo: false };
  const trDb = () => window.CONTA && CONTA.db && CONTA.usuario ? CONTA.db : null;
  const trMeu = () => CONTA.usuario.uid;
  const trCodigo = uid => uid.slice(0, 6).toUpperCase();
  const trNome = () => ((AR.visual && AR.visual.nome) || (CONTA.usuario && CONTA.usuario.displayName) || 'Jogador').slice(0, 20);
  function trPerfil() { const db = trDb(); if (!db) return; db.collection('perfis').doc(trMeu()).set({ nome: trNome(), codigo: trCodigo(trMeu()), nv: AR.nv || 1 }, { merge: true }).catch(() => {}); }
  // o que dá pra trocar
  function trInfo(it) { if (it.t === 'moedas') return { ic: '💰', nome: it.n + ' moedas' }; if (it.t === 'item') return { ic: ITENS[it.k] || '❔', nome: it.n + 'x ' + ({ carne: 'Carne', pele: 'Pele de lobo', coracao: 'Coração de gelo' }[it.k] || it.k) };
    if (it.t === 'arma') { const A = ARMAS[it.k]; return { ic: A ? A.icone : '❔', nome: A ? A.nome : it.k }; } if (it.t === 'fant') { const F = FANT[it.k]; return { ic: F ? F.icone : '❔', nome: F ? F.nome : it.k }; }
    if (it.t === 'cosm') { const F = COSM[it.k]; return { ic: F ? F.icone : '❔', nome: F ? F.nome : it.k }; } if (it.t === 'sob') { const [s, k] = it.k.split(':'); const I = sobInfo(s, k); return I ? { ic: I.icone, nome: I.nome, cor: I.cor } : { ic: '❔', nome: it.k }; } return { ic: '❔', nome: '?' }; }
  function trTenho(it) { if (it.t === 'moedas') return (AR.inv.moedas || 0) >= it.n; if (it.t === 'item') return (AR.inv[it.k] || 0) >= it.n; if (it.t === 'arma') return AR.armas.includes(it.k); if (it.t === 'fant') return AR.fantasias.includes(it.k); if (it.t === 'cosm') return AR.cosms.includes(it.k); if (it.t === 'sob') return AR.sobs.includes(it.k); return false; }
  function trTrocaveis() { const L = []; if (AR.inv.moedas > 0) L.push({ t: 'moedas', n: 0 }); ['carne', 'pele', 'coracao'].forEach(k => { if (AR.inv[k] > 0) L.push({ t: 'item', k, n: 0 }); });
    AR.armas.filter(w => ARMAS[w] && !ARMAS[w].oculta && !ARMAS[w].classe && w !== 'bastao').forEach(k => L.push({ t: 'arma', k })); AR.fantasias.filter(f => FANT[f] && f !== 'comum' && f !== 'celeste').forEach(k => L.push({ t: 'fant', k }));
    AR.cosms.filter(c => COSM[c]).forEach(k => L.push({ t: 'cosm', k })); AR.sobs.forEach(k => L.push({ t: 'sob', k })); return L; }
  function trTira(it) { if (it.t === 'moedas') AR.inv.moedas = Math.max(0, AR.inv.moedas - it.n); else if (it.t === 'item') AR.inv[it.k] = Math.max(0, (AR.inv[it.k] || 0) - it.n);
    else if (it.t === 'arma') { AR.armas = AR.armas.filter(x => x !== it.k); if (AR.arma === it.k) { AR.arma = 'punho'; mostraArma(); } } else if (it.t === 'fant') { AR.fantasias = AR.fantasias.filter(x => x !== it.k); if (AR.fantasia === it.k) vesteFantasia('comum'); }
    else if (it.t === 'cosm') { AR.cosms = AR.cosms.filter(x => x !== it.k); if (AR.cosm === it.k) vesteCosm(null); } else if (it.t === 'sob') { AR.sobs = AR.sobs.filter(x => x !== it.k); const [s, k] = it.k.split(':'); if (AR.pecas[k] === s) { AR.pecas[k] = null; atualizaPecas(); } } }
  function trPoe(it) { if (it.t === 'moedas') AR.inv.moedas = (AR.inv.moedas || 0) + it.n; else if (it.t === 'item') AR.inv[it.k] = (AR.inv[it.k] || 0) + it.n;
    else if (it.t === 'arma' && ARMAS[it.k]) { if (!AR.armas.includes(it.k)) AR.armas.push(it.k); } else if (it.t === 'fant' && FANT[it.k]) { if (!AR.fantasias.includes(it.k)) AR.fantasias.push(it.k); }
    else if (it.t === 'cosm' && COSM[it.k]) { if (!AR.cosms.includes(it.k)) AR.cosms.push(it.k); } else if (it.t === 'sob') { if (!AR.sobs.includes(it.k)) AR.sobs.push(it.k); } }
  const trSou = d => d.de === trMeu() ? 'De' : 'Para';
  const trOutro = s => s === 'De' ? 'Para' : 'De';
  // tela
  function trAbre() { $('trocap').hidden = false; trDesenha(); trOuveConvites(); }
  function trFecha() { $('trocap').hidden = true; }
  function trDesenha() { const B = $('tr-corpo'); if (!B) return; const db = trDb();
    if (!db) { B.innerHTML = '<p class="tr-dica">Pra trocar itens com outros jogadores você precisa <b>entrar com uma conta</b>. Toque no seu retrato e entre com e-mail e senha.</p>'; return; }
    if (!TR.id || !TR.doc) { B.innerHTML = `<div class="tr-cod">Seu código de troca<b>${trCodigo(trMeu())}</b><small>Passe esse código pro seu amigo</small></div>
      <div class="tr-linha"><input id="tr-in" maxlength="6" placeholder="Código do amigo" autocapitalize="characters"><button id="tr-chama">Chamar</button></div><div id="tr-conv"></div><p class="tr-dica" id="tr-msg"></p>`;
      tapBtn($('tr-chama'), trChama); trDesenhaConvites(); return; }
    const d = TR.doc, eu = trSou(d), ele = trOutro(eu), meus = d['itens' + eu] || [], dele = d['itens' + ele] || [], okEu = d['ok' + eu] === d.v, okEle = d['ok' + ele] === d.v;
    const lista = (L, meu) => L.length ? L.map((it, i) => { const I = trInfo(it); return `<div class="tr-it">${I.ic} <span>${I.nome}</span>${meu && d.estado === 'aberta' ? `<button data-i="${i}" class="tr-x">✕</button>` : ''}</div>`; }).join('') : '<div class="tr-vazio">nada ainda</div>';
    if (d.estado === 'fechada') { B.innerHTML = `<div class="tr-fim">✅ Troca feita com <b>${d['nome' + ele]}</b>!</div><button id="tr-ok" class="tr-bt">OK</button>`; tapBtn($('tr-ok'), trSai); return; }
    if (d.estado === 'cancelada') { B.innerHTML = `<div class="tr-fim">❌ A troca foi cancelada.</div><button id="tr-ok" class="tr-bt">OK</button>`; tapBtn($('tr-ok'), trSai); return; }
    B.innerHTML = `<div class="tr-lados"><div class="tr-lado"><h4>Você oferece ${okEu ? '✔️' : ''}</h4>${lista(meus, true)}<button id="tr-add" class="tr-add">＋ Adicionar</button></div>
      <div class="tr-lado"><h4>${d['nome' + ele]} oferece ${okEle ? '✔️' : ''}</h4>${lista(dele, false)}</div></div>
      <div class="tr-acoes"><button id="tr-cancela" class="tr-bt tr-c">Cancelar</button><button id="tr-aceita" class="tr-bt" ${okEu ? 'disabled' : ''}>${okEu ? 'Esperando...' : 'Aceitar troca'}</button></div><p class="tr-dica">Se alguém mudar a oferta, os dois precisam aceitar de novo.</p><div id="tr-esc" hidden></div>`;
    B.querySelectorAll('.tr-x').forEach(b => tapBtn(b, () => trMuda(meus.filter((_, j) => j !== +b.dataset.i))));
    tapBtn($('tr-add'), trEscolhe); tapBtn($('tr-cancela'), () => trUpd({ estado: 'cancelada' })); tapBtn($('tr-aceita'), trAceita); }
  function trEscolhe() { const E = $('tr-esc'); const d = TR.doc, eu = trSou(d), meus = d['itens' + eu] || []; const L = trTrocaveis().filter(it => (it.t === 'moedas' || it.t === 'item') ? !meus.some(m => m.t === it.t && m.k === it.k) : !meus.some(m => m.t === it.t && m.k === it.k));
    E.innerHTML = '<div class="tr-esch"><span>Escolha o que oferecer</span><button id="tr-escx">Voltar</button></div>' + (L.length ? '' : '<p class="tr-dica">Você não tem nada pra trocar.</p>');
    L.forEach(it => { const qtd = it.t === 'moedas' || it.t === 'item'; const max = it.t === 'moedas' ? AR.inv.moedas : qtd ? AR.inv[it.k] : 1; const I = trInfo({ ...it, n: max });
      const b = document.createElement('div'); b.className = 'tr-op'; b.innerHTML = `<span>${I.ic}</span><b>${qtd ? (it.t === 'moedas' ? 'Moedas' : I.nome.replace(/^\d+x /, '')) : I.nome}</b>${qtd ? `<input type="number" min="1" max="${max}" value="${Math.min(max, it.t === 'moedas' ? 100 : 1)}"><small>de ${max}</small>` : ''}<button>Pôr</button>`;
      tapBtn(b.querySelector('button'), () => { E.hidden = true; const n = qtd ? Math.max(1, Math.min(max, Math.floor(+b.querySelector('input').value || 1))) : 1; trMuda(meus.concat([qtd ? { t: it.t, k: it.k || null, n } : { t: it.t, k: it.k }])); }); E.appendChild(b); });
    tapBtn($('tr-escx'), () => { E.hidden = true; }); E.hidden = false; }
  function trUpd(o) { if (!TR.id) return Promise.resolve(); return trDb().collection('trocas').doc(TR.id).update(o).catch(e => aviso('⚠️ Não deu pra atualizar a troca: ' + (e.code || e.message), '#ff6a6a')); }
  function trMuda(novos) { const d = TR.doc, eu = trSou(d); trUpd({ ['itens' + eu]: novos, v: (d.v || 0) + 1 }); }
  function trAceita() { const d = TR.doc, eu = trSou(d), ele = trOutro(eu); const falta = (d['itens' + eu] || []).find(it => !trTenho(it)); if (falta) { aviso('Você não tem mais: ' + trInfo(falta).nome, '#ff6a6a'); return; }
    const o = { ['ok' + eu]: d.v }; if (d['ok' + ele] === d.v) o.estado = 'fechada'; trUpd(o); }
  function trAplica(d) { const eu = trSou(d), ele = trOutro(eu); if (d['aplicado' + eu]) return; let feitas = []; try { feitas = JSON.parse(localStorage.getItem('aetherion-trocas') || '[]'); } catch (e) {} if (feitas.includes(TR.id)) return;
    (d['itens' + eu] || []).forEach(trTira); (d['itens' + ele] || []).forEach(trPoe); feitas.push(TR.id); try { localStorage.setItem('aetherion-trocas', JSON.stringify(feitas.slice(-50))); } catch (e) {}
    salvaAR(); atualizaInv(); setTimeout(fazRetrato, 80); som('missao_ok', 1, 1); aviso('🤝 Troca concluída com ' + d['nome' + ele] + '!', '#7ad87a'); trUpd({ ['aplicado' + eu]: true }); }
  function trEntra(id) { if (TR.un) TR.un(); TR.id = id; TR.doc = null; TR.un = trDb().collection('trocas').doc(id).onSnapshot(s => { if (!s.exists) return; TR.doc = s.data(); if (TR.doc.estado === 'fechada') trAplica(TR.doc); if (!$('tr-esc') || $('tr-esc').hidden) trDesenha(); }, () => {}); trDesenha(); }
  function trSai() { if (TR.un) TR.un(); TR.un = null; TR.id = null; TR.doc = null; trDesenha(); }
  async function trChama() { const db = trDb(); const cod = ($('tr-in').value || '').trim().toUpperCase(); const msg = $('tr-msg'); if (cod.length !== 6) { msg.textContent = 'O código tem 6 letras/números.'; return; } if (cod === trCodigo(trMeu())) { msg.textContent = 'Esse é o seu próprio código.'; return; }
    msg.textContent = 'Procurando...'; try { const q = await db.collection('perfis').where('codigo', '==', cod).limit(1).get(); if (q.empty) { msg.textContent = 'Nenhum jogador com esse código. Ele precisa ter entrado no jogo com conta.'; return; }
      const outro = q.docs[0]; const r = await db.collection('trocas').add({ de: trMeu(), para: outro.id, nomeDe: trNome(), nomePara: outro.data().nome || 'Jogador', itensDe: [], itensPara: [], v: 0, okDe: -1, okPara: -1, aplicadoDe: false, aplicadoPara: false, estado: 'aberta', criado: Date.now() });
      aviso('🤝 Convite de troca enviado pra ' + (outro.data().nome || 'Jogador'), '#ffd23c'); trEntra(r.id); } catch (e) { msg.textContent = 'Não deu: ' + (e.code || e.message) + '. Confira as regras do Firestore.'; } }
  function trOuveConvites() { const db = trDb(); if (!db || TR.unConv) return; TR.unConv = db.collection('trocas').where('para', '==', trMeu()).where('estado', '==', 'aberta').onSnapshot(q => { const novos = q.docs.map(x => ({ id: x.id, ...x.data() })).filter(x => Date.now() - (x.criado || 0) < 3600e3);
      if (novos.some(n => !TR.convites.some(c => c.id === n.id))) { som('fala', 0.7, 1); const n = novos.find(n => !TR.convites.some(c => c.id === n.id)); aviso('🤝 ' + n.nomeDe + ' quer trocar com você! Abra 🎒 › Trocar.', '#ffd23c'); } TR.convites = novos; trDesenhaConvites(); }, () => {}); }
  function trDesenhaConvites() { const C = $('tr-conv'); if (!C) return; C.innerHTML = TR.convites.length ? '<h4>Convites recebidos</h4>' : ''; TR.convites.forEach(c => { const b = document.createElement('div'); b.className = 'tr-op'; b.innerHTML = `<span>🤝</span><b>${(c.nomeDe || 'Jogador').replace(/</g, '')}</b><button>Abrir</button>`; tapBtn(b.querySelector('button'), () => trEntra(c.id)); C.appendChild(b); }); }
  tapBtn($('tr-fecha'), trFecha); tapBtn($('ip-troca'), () => { $('invp').hidden = true; trAbre(); });
  setInterval(() => { if (trDb()) { trOuveConvites(); if (!TR.perfilOk) { TR.perfilOk = true; trPerfil(); } } }, 5000);
  let asaT = 0;
  function equipFrame(dt) { const k = armaVisivel(); const temArma = !!k;
    const quer = !temArma || atkT < SEGURA_MAO || !!BM; // sem arma, lutando ou em modo de batalha: mão
    if (quer !== naMao || (!quer && armaNasCostas !== k)) { naMao = quer; if (quer) { poeNaMao(); armaNasCostas = null; mostraArma(); } else { poeNasCostas(k); armaNasCostas = k; } }
    if (ASAS.visible) { const voa = typeof noChao !== 'undefined' && !noChao, corre = typeof vel !== 'undefined' ? vel : 0;
      const f = voa ? 13 : corre > 4.2 ? 9 : corre > 0.4 ? 4 : 2, a = voa ? 0.7 : corre > 4.2 ? 0.45 : corre > 0.4 ? 0.25 : 0.12; asaT += dt * f;
      const ang = 0.45 + Math.sin(asaT) * a; ASA.R.rotation.y = ang; ASA.L.rotation.y = -ang; ASA.R.rotation.z = Math.sin(asaT) * a * 0.3; ASA.L.rotation.z = -ASA.R.rotation.z; } }

  // ---- aparência ----
  const PELES = ['#f2b48e', '#f8d0b8', '#e8a878', '#c88a5e', '#9a6440', '#6a4430'];
  const COR_CAB = ['#1c1a28', '#5a3a1e', '#a8742e', '#e8d27a', '#f0f0fa', '#c83a2a', '#3a6ae8', '#9a4ad8'];
  const OLHOS = ['#6a3e1e', '#2a8a4a', '#2a6ac8', '#8a8a9a', '#c83a3a', '#e8a018'];
  const ROUPAS = ['classe', '#3a7ae8', '#e8503a', '#3faa4a', '#9a5ae0', '#ffb03c', '#f4f0e6', '#c8925a'];
  const ESTILOS = [['espetado', 'Espetado'], ['curto', 'Curto'], ['longo', 'Longo'], ['rabo', 'Rabo de cavalo'], ['moicano', 'Moicano'], ['careca', 'Careca']];
  AR.visual = Object.assign({ nome: 'Leonardo', pele: PELES[0], cabelo: 'espetado', corCab: COR_CAB[0], olhos: OLHOS[0], roupa: 'classe' }, AR.visual || {});
  const HM = k => HMAT[k]; const MH = { pele: HM('#f2b48e'), cab: HM('#1c1a28'), olho: HM('#6a3e1e'), top: HM('#8a6a40'), top2: HM('#6a4a2a'), calca: HM('#4a3a2a') };
  const cabOrig = []; heroi.userData.P.head.children.forEach(o => { if (o.isMesh && o.material === MH.cab && o.geometry !== BOX) cabOrig.push(o); });
  const CABG = {}; { const H = heroi.userData.P.head, hr = 0.14; const C = (g, geo, ...a) => { const m = part(g, geo, '#1c1a28', ...a); m.material = MH.cab; m.traverse(o => { if (o.isMesh && o !== m) {} }); return m; };
    let g = CABG.curto = grp(H); C(g, SPH, 0, 0.18, -0.025, hr * 1.05, hr * 0.92, hr * 1.04, 0.04); for (let i = 0; i < 5; i++) { const c = C(g, CONE, -hr * 0.5 + i * hr * 0.25, 0.235, hr * 0.78, hr * 0.13, hr * 0.28, hr * 0.1); c.rotation.x = 2.5; }
    g = CABG.longo = grp(H); C(g, SPH, 0, 0.17, -0.02, hr * 1.07, hr * 1.0, hr * 1.05, 0.04); C(g, CAP, 0, -0.02, -0.08, hr * 2.0, hr * 1.5, hr * 1.1, 0.04); for (let i = 0; i < 6; i++) { const c = C(g, CONE, -hr * 0.6 + i * hr * 0.24, 0.24, hr * 0.8, hr * 0.14, hr * 0.32, hr * 0.1); c.rotation.x = 2.6; }
    g = CABG.rabo = grp(H); C(g, SPH, 0, 0.18, -0.025, hr * 1.06, hr * 0.95, hr * 1.04, 0.04); C(g, SPH, 0, 0.2, -0.16, hr * 0.38, hr * 0.38, hr * 0.38, 0.04); const rb = C(g, CAP, 0, 0.03, -0.24, hr * 0.5, hr * 0.9, hr * 0.5, 0.04); rb.rotation.x = 0.5;
    g = CABG.moicano = grp(H); C(g, SPH, 0, 0.15, -0.02, hr * 1.02, hr * 0.85, hr * 1.02); for (let i = 0; i < 6; i++) { const a = -0.6 + i * 0.32; const c = C(g, CONE, 0, 0.13 + Math.cos(a) * hr * 1.0, Math.sin(a) * hr * 1.0, hr * 0.13, hr * 0.7, hr * 0.3); c.rotation.x = a; }
    Object.values(CABG).forEach(x => x.visible = false); }
  function tom(c, k) { const x = new T3.Color(c); x.multiplyScalar(k); return '#' + x.getHexString(); }
  function aplicaVisual(cls) { const V = AR.visual; const CLx = CLASSES[cls || AR.classe];
    MH.pele.color.set(V.pele); MH.cab.color.set(V.corCab); MH.olho.color.set(V.olhos);
    const r = V.roupa === 'classe' ? (CLx ? CLx.roupa : '#8a6a40') : V.roupa; const rv = vivo(r); MH.top.color.set(rv); MH.top2.color.set(tom(rv, 0.78)); MH.calca.color.set(tom(rv, 0.62));
    cabOrig.forEach(o => o.visible = V.cabelo === 'espetado'); Object.keys(CABG).forEach(k => CABG[k].visible = V.cabelo === k);
    const n = (V.nome || 'Leonardo').slice(0, 16); $('pn-nome').textContent = n; }

  // ---- aplicar classe ----
  function CLA() { return CLASSES[AR.classe] || null; }
  function atkMult() { const c = CLA(); return (1 + (AR.nv - 1) * 0.02) * (c ? c.atk : 1) * potAtual * (BM && BM.atk ? BM.atk : 1) * (BUFF.furia > 0 ? 1.4 : 1) * (BUFF.pacto > 0 ? 1.5 : 1); }
  function critico() { const c = CLA(); return Math.random() < (c ? c.crit : 0.05) + (BM && BM.crit ? BM.crit : 0); }
  function aplicaClasse(id) { if (typeof bmDesliga === 'function') bmDesliga(); const c = CLASSES[id]; AR.classe = id; if (!AR.armas.includes(c.arma)) AR.armas.push(c.arma); AR.arma = c.arma;
    const v = AR.barra[2]; if (v && !(PW[v] && PW[v].classe)) { const k = AR.barra.indexOf(null, 3); if (k >= 3 && !AR.barra.slice(3).includes(v)) AR.barra[k] = v; }
    AR.barra[2] = c.hab; if (!AR.tem.includes(c.hab)) AR.tem.push(c.hab); HABS.forEach(h => { const i = AR.barra.indexOf(h.id); if (i > 2) AR.barra[i] = null; });
    aplicaNivel(); vida = VIDA_MAX; mana = MANA_MAX; salvaAR(); montaBarra(); mostraArma(); aplicaVisual(); setTimeout(fazRetrato, 100); }

  // ---- habilidades das classes ----
  let tufaoM = 1, muralhaT = 0, tufaoT = 0, tufaoH = 0, despT = 0, desp = 0; const METEOROS = [], PROJ = [];
  const muralha = new T3.Mesh(new T3.SphereGeometry(1.3, 24, 16), new T3.MeshBasicMaterial({ color: '#ffc85a', transparent: true, opacity: 0.25, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending })); muralha.visible = false; world.add(muralha);
  const chakG = grp(world); for (let k = 0; k < 3; k++) { const c = grp(chakG); pc(c, TOR2, met('#d4dbe6', 0.25, 0.95), 0, 0, 0, 0.22, 0.22, 0.5, Math.PI / 2, 0, 0); glowSpr(c, 0, 0, 0, 0.7, '#ff9a3a', 0.6); } chakG.visible = false;
  const despAura = glowSpr(world, 0, 0, 0, 3.4, '#ffffff', 0);
  function proj(x, y, z, ang, cor, dano, vel, alc, op) { op = op || {}; const s = glowSpr(world, x, y, z, 0.7 * (op.tam || 1), cor, 1); PROJ.push({ s, t: 0, dx: Math.sin(ang), dz: Math.cos(ang), dano, vel: vel || 26, vida: (alc || 18) / (vel || 26), cor, op, hit: new Set(), volt: false }); }
  function linhaLuz(a, b, cor, n) { n = n || 14; for (let i = 0; i <= n; i++) { const u = i / n; const s = glowSpr(world, lerp(a.x, b.x, u), lerp(a.y, b.y, u), lerp(a.z, b.z, u), 0.8, cor, 1); RAIOS.push({ s, t: 0 }); } }
  function classePoder(id) { const p = heroi.position, M = atkMult(); const perto = r => FERAS.filter(e => feraAtiva(e) && Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z) < r + e.T.raio);
    if (id === 'sismico') { atkT = 0; atkN = 1; atkHit = true; fx('fumo', [p.x, 0, p.z], 1.2); fx('luz', [p.x, 0, p.z], 0.6); tremor = 0.5; flash('rgba(255,120,60,.3)'); perto(3.8).forEach(e => { dano(e, 45 * M, null, critico()); e.stun = Math.max(e.stun, 1.5); const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz) || 1; empurra(e, dx / d, dz / d, 1.8); }); }
    if (id === 'danca') { const e = maisPerto(8); if (!e) { dashT = 0.2; fx('vento', [p.x, 0, p.z], 0.6); return; } const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz) || 1; facing = Math.atan2(dx, dz); p.x = e.g.position.x - dx / d * (e.T.raio + 0.9); p.z = e.g.position.z - dz / d * (e.T.raio + 0.9); fx('vento', [p.x, 0, p.z], 0.7);
      [0, 130, 260, 390].forEach((t, i) => setTimeout(() => { if (e.morto) return; atkT = 0; atkN = (i % 3) + 1; atkHit = true; dano(e, 16 * M * (i === 3 ? 2 : 1), null, i === 3); fx('luz', [e.g.position.x, 0.4, e.g.position.z], 0.3); }, t)); }
    if (id === 'meteoro') { const e = maisPerto(14); const c = e ? [e.g.position.x, e.g.position.z] : [p.x + Math.sin(facing) * 6, p.z + Math.cos(facing) * 6]; if (e) facing = Math.atan2(c[0] - p.x, c[1] - p.z);
      for (let k = 0; k < 6; k++) { const a = Math.random() * 6.28, r = Math.random() * 2.4; METEOROS.push({ x: c[0] + Math.cos(a) * r, z: c[1] + Math.sin(a) * r, t: -k * 0.14, s: glowSpr(world, 0, -50, 0, 1.4, '#ff8a2a', 1), M }); } aviso('Chuva de Meteoros!', '#ff8a3a'); }
    if (id === 'rajada') { const e = maisPerto(20); if (e) facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); [-0.25, 0, 0.25].forEach(o => proj(p.x, p.y + 1.25, p.z, facing + o, '#8aff9a', 22 * M, 28, 20)); const cr25 = Math.round(25 * potAtual); vida = Math.min(VIDA_MAX, vida + cr25); numero(p, '+' + cr25 + ' ❤️', '#7ad87a'); fx('cura', [p.x, 0, p.z], 1); }
    if (id === 'muralha') { muralhaT = 6; perto(3.2).forEach(e => { const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz) || 1; empurra(e, dx / d, dz / d, 2.5); e.stun = Math.max(e.stun, 0.8); }); aviso('Muralha: 80% menos dano por 6 segundos.', '#ffc85a'); }
    if (id === 'runa') { atkT = 0; atkN = 2; atkHit = true; const f = [p.x + Math.sin(facing) * 2, p.y, p.z + Math.cos(facing) * 2]; fx('luz', f, 0.6); FERAS.forEach(e => { if (!feraAtiva(e)) return; const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz); if (d > 4.5 + e.T.raio) return; let da = Math.atan2(dx, dz) - facing; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; if (Math.abs(da) > 0.9 && d > 1.2) return; dano(e, 35 * M, null, critico()); e.vuln = 6; numero(e.g.position, 'FRACO', '#d8a8ff', e.T.alt + 0.9); }); }
    if (id === 'tufao') { tufaoT = 4; tufaoH = 0; tufaoM = M; }
    if (id === 'carregado') { const e = maisPerto(22); if (e) facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); const dx = Math.sin(facing), dz = Math.cos(facing); const a = { x: p.x + dx * 0.6, y: p.y + 1.2, z: p.z + dz * 0.6 }, b = { x: p.x + dx * 22, y: p.y + 1.2, z: p.z + dz * 22 }; linhaLuz(a, b, '#ffe24a', 26); flash('rgba(255,240,150,.3)'); tremor = 0.2;
      FERAS.forEach(e => { if (!feraAtiva(e)) return; const ex = e.g.position.x - p.x, ez = e.g.position.z - p.z; const along = ex * dx + ez * dz; if (along < 0 || along > 22) return; const perp = Math.abs(ex * dz - ez * dx); if (perp < e.T.raio + 0.7) dano(e, 55 * M, 'raio', critico()); }); }
    if (id === 'drenar') { const e = maisPerto(10); if (!e) { aviso('Nenhum bicho perto pra drenar.', '#b05aff'); return; } facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); linhaLuz({ x: e.g.position.x, y: e.T.alt * 0.6, z: e.g.position.z }, { x: p.x, y: p.y + 1.2, z: p.z }, '#b05aff', 14); const n = Math.round(40 * M); dano(e, n, null, false); vida = Math.min(VIDA_MAX, vida + n); numero(p, '+' + n + ' ❤️', '#c890ff'); } }

  // ---- DESPERTAR: a barra enche lutando; cheia, deixa você muito mais forte por 15 s ----
  function enche(n) { if (BM) return; desp = Math.min(100, desp + n); }
  function despertar_antigo() { if (desp < 100 || despT > 0 || conversa || cenaQ || desmaiado) { if (desp < 100 && !despT) aviso('Despertar: lute pra encher a barra (' + Math.floor(desp) + '%).', '#ffd23c'); return; } const c = CLA(); despT = 15; desp = 0; despAura.material.color.set(c ? c.cor : '#ffd23c'); flash('rgba(255,255,255,.6)'); tremor = 0.35; fx('luz', [heroi.position.x, 0, heroi.position.z], 1.2); fx('cura', [heroi.position.x, 0, heroi.position.z], 1.4);
    som('modo', 1, 0.9); const el = $('lvup'); el.innerHTML = `<small>${c ? c.nome.toUpperCase() : ''}</small>DESPERTAR!<em>+50% ataque · ataque mais rápido · +15% defesa · 15 s</em>`; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); }


  function classeFrame(dt, p) {
    if (muralhaT > 0) muralhaT -= dt; muralha.visible = muralhaT > 0; if (muralha.visible) { muralha.position.set(p.x, p.y + 0.95, p.z); muralha.material.opacity = 0.18 + Math.sin(gT * 6) * 0.06; }
    if (tufaoT > 0) { tufaoT -= dt; tufaoH -= dt; chakG.visible = true; chakG.position.set(p.x, p.y + 0.9, p.z); chakG.children.forEach((c, k) => { const a = gT * 7 + k * 2.094; c.position.set(Math.cos(a) * 1.7, 0, Math.sin(a) * 1.7); c.rotation.y = -a; });
      if (tufaoH <= 0) { tufaoH = 0.35; FERAS.forEach(e => { if (feraAtiva(e) && Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z) < 2.3 + e.T.raio) dano(e, 14 * tufaoM, null, critico()); }); } } else chakG.visible = false;
    for (let i = METEOROS.length - 1; i >= 0; i--) { const m = METEOROS[i]; m.t += dt; if (m.t < 0) continue; const u = m.t / 0.5; m.s.position.set(m.x - 3 + u * 3, 12 * (1 - u), m.z - 1.5 + u * 1.5); if (u >= 1) { tremor = Math.max(tremor, m.cor ? 0.05 : 0.2); fx(m.cor || 'fogo', [m.x, 0, m.z], 0.5); FERAS.forEach(e => { if (feraAtiva(e) && Math.hypot(e.g.position.x - m.x, e.g.position.z - m.z) < (m.raio || 2.2) + e.T.raio) dano(e, (m.dano || 30) * m.M, m.cor ? null : 'fogo', critico()); }); world.remove(m.s); METEOROS.splice(i, 1); } }
    for (let i = PROJ.length - 1; i >= 0; i--) { const v = PROJ[i], o = v.op, sp = v.s.position; v.t += dt;
      if (o.volta && !v.volt && v.t > v.vida / 2) { v.volt = true; v.hit.clear(); }
      if (v.volt) { const dx = p.x - sp.x, dz = p.z - sp.z, d = Math.hypot(dx, dz) || 1; v.dx = dx / d; v.dz = dz / d; if (d < 0.8 || v.t > v.vida * 2.5) v.t = 99; }
      sp.x += v.dx * v.vel * dt; sp.z += v.dz * v.vel * dt; if (o.tam > 1.05) v.s.material.rotation += dt * 10;
      const e = v.t < 99 && FERAS.find(f => feraAtiva(f) && !v.hit.has(f) && Math.hypot(f.g.position.x - sp.x, f.g.position.z - sp.z) < 0.5 + f.T.raio + (o.tam ? 0.3 : 0) && sp.y < f.T.alt + 0.6);
      if (e) { v.hit.add(e); if (o.explode) v.t = 99; else { const cr = critico(); if (v.dano) dano(e, v.dano * (cr ? 2 : 1), null, cr); if (o.gelo) congelar(e, o.gelo); if (o.vuln) { e.vuln = o.vuln; numero(e.g.position, 'MARCADO', '#d8a8ff', e.T.alt + 0.9); } if (o.stun) e.stun = Math.max(e.stun, o.stun); if (o.veneno) e.queima = 3; if (o.marca) e.vuln = Math.max(e.vuln, 4); fx('luz', [sp.x, sp.y - 0.8, sp.z], 0.3); if (!o.fura) v.t = 99; } }
      if (v.t >= 99 || (v.t > v.vida && !v.volt)) { if (o.explode) { fx('luz', [sp.x, 0, sp.z], 0.7); fx('gelo', [sp.x, 0, sp.z], 0.6); tremor = Math.max(tremor, 0.3); area(sp.x, sp.z, o.explode.r, f => dano(f, o.explode.dano, o.explode.tipo, critico())); } world.remove(v.s); PROJ.splice(i, 1); } }
  }

  // ---- tela de criação: classe + aparência ----
  let crSel = null, crTrava = false;
  function abrirCriar(passo, trava) { crTrava = !!trava; crSel = AR.classe || crSel || 'guerreiro'; $('criar').hidden = false; desenhaCriar(passo || 1); }
  function previewClasse(id) { crSel = id; const c = CLASSES[id]; Object.keys(ARMAG).forEach(k => ARMAG[k].visible = k === c.arma); Object.keys(ARMAE).forEach(k => ARMAE[k].visible = k === c.arma); aplicaVisual(id); }
  function barraStat(n, v, max) { return `<div class="cst"><small>${n}</small><i><b style="width:${Math.min(100, v / max * 100)}%"></b></i></div>`; }
  function desenhaCriar(passo) { $('cr-p1').hidden = passo !== 1; $('cr-p2').hidden = passo !== 2; $('cr-volta').hidden = crTrava; previewClasse(crSel); const c = CLASSES[crSel]; $('cr-cls-nome').innerHTML = `${c.icone} ${c.nome}<small>${c.papel}</small>`;
    if (passo === 1) { const G = $('cr-grade'); G.innerHTML = ''; Object.keys(CLASSES).forEach(k => { const C = CLASSES[k]; const b = document.createElement('button'); b.className = 'ccl' + (k === crSel ? ' on' : ''); b.style.setProperty('--c', C.cor); b.innerHTML = `<span>${C.icone}</span><b>${C.nome}</b>`; tapBtn(b, () => { crSel = k; desenhaCriar(1); }); G.appendChild(b); });
      const A = ARMAS[c.arma], H = PW[c.hab]; $('cr-det').innerHTML = `<p>${c.desc}</p><div class="csts">${barraStat('Vida', c.vida, 160)}${barraStat('Mana', c.mana, 150)}${barraStat('Ataque', c.atk, 1.3)}${barraStat('Defesa', c.def + 5, 35)}${barraStat('Velocidade', c.vel - 0.8, 0.35)}${barraStat('Crítico', c.crit, 0.25)}</div><div class="cinfo"><span>${A.icone} <b>${A.nome}</b></span><span>${H.icone} <b>${H.nome}</b>: ${H.desc}</span></div>`; return; }
    const V = AR.visual; $('cr-nome').value = V.nome || 'Leonardo';
    const linha = (id, lista, campo, rot) => { const el = $(id); el.innerHTML = ''; lista.forEach(v => { const val = Array.isArray(v) ? v[0] : v; const b = document.createElement('button'); b.className = 'sw' + (V[campo] === val ? ' on' : '') + (rot ? ' tx' : ''); if (rot) b.textContent = v[1]; else if (val === 'classe') { b.textContent = 'Classe'; b.classList.add('tx'); } else b.style.background = val; tapBtn(b, () => { V[campo] = val; aplicaVisual(crSel); desenhaCriar(2); }); el.appendChild(b); }); };
    linha('cr-pele', PELES, 'pele'); linha('cr-cab', ESTILOS, 'cabelo', true); linha('cr-corcab', COR_CAB, 'corCab'); linha('cr-olhos', OLHOS, 'olhos'); linha('cr-roupa', ROUPAS, 'roupa'); }
  $('cr-nome').addEventListener('input', () => { AR.visual.nome = $('cr-nome').value.slice(0, 16); aplicaVisual(crSel); });
  ['keydown', 'keyup'].forEach(t => $('criar').addEventListener(t, e => e.stopPropagation()));
  tapBtn($('cr-prox'), () => desenhaCriar(2)); tapBtn($('cr-volta'), () => desenhaCriar(1));
  tapBtn($('cr-fim'), () => { if (!crSel || !CLASSES[crSel]) return; AR.visual.nome = ($('cr-nome').value.trim() || 'Leonardo').slice(0, 16); const nova = AR.classe !== crSel; if (nova) aplicaClasse(crSel); else { mostraArma(); aplicaVisual(); salvaAR(); setTimeout(fazRetrato, 100); } $('criar').hidden = true;
    if (nova) { const c = CLASSES[crSel]; aviso(c.icone + ' Você agora é ' + c.nome + '! Habilidade no slot 3 e os Modos de Batalha I, II e III ao lado da vida.', c.cor); } });
  let criarT = 0; function criarFrame(dt) { if ($('criar').hidden) return; criarT += dt; if (criarT > 0.06) { fazPrevia(criarT, $('cr-previa')); criarT = 0; } }
  // ===================== HABILIDADES PRÓPRIAS DE CADA CLASSE (ramo da classe na árvore) =====================
  const HABS2 = {
    guerreiro: [['furia', 'Fúria', '😤', 25, 'Fúria: por 8 segundos você bate 40% mais forte e mais rápido.'], ['investida', 'Investida', '🐂', 22, 'Investida: corre 7 metros pra frente atropelando os bichos (dano e tontura).'], ['grito', 'Grito', '📣', 30, 'Grito de Guerra: os bichos em volta ficam tontos e fracos, e você cura 20.']],
    duelista: [['passo', 'Passo', '👤', 18, 'Passo Sombrio: aparece nas costas do bicho mais perto e dá um golpe crítico.'], ['veneno', 'Veneno', '🧪', 22, 'Lâminas Venenosas: por 10 segundos cada golpe envenena o bicho.'], ['tempestade', 'Tempestade', '⚙️', 30, 'Tempestade de Aço: gira 5 vezes cortando tudo em volta.']],
    mago: [['nova', 'Nova', '❄️', 28, 'Nova de Gelo: congela todos os bichos em volta por 2,5 segundos.'], ['orbe', 'Orbe', '🔵', 30, 'Orbe Arcano: uma bola lenta e enorme que explode em área.'], ['teleporte', 'Teleporte', '✨', 20, 'Teleporte: some e aparece 8 metros pra frente.']],
    arqueiro: [['chuva', 'Chuva', '🌧️', 30, 'Chuva de Flechas: flechas caem em área em cima do bicho mais perto.'], ['congelante', 'Congelante', '🧊', 20, 'Flecha Congelante: acerta e congela o bicho por 3 segundos.'], ['floresta', 'Floresta', '🌿', 32, 'Bênção da Floresta: cura 50 e mais um pouco a cada segundo por 8 segundos.']],
    guardiao: [['provocar', 'Provocar', '😠', 15, 'Provocar: todos os bichos perto vêm atrás de você, e você ganha +20% de defesa por 6 s.'], ['escudada', 'Escudada', '🛡️', 22, 'Escudada: pancada com o escudo na frente. Dano, tontura de 2 s e empurrão.'], ['fortaleza', 'Fortaleza', '🏰', 35, 'Fortaleza: por 10 segundos +30% de defesa e a vida volta sozinha.']],
    espadachim: [['marca', 'Marca', '🎯', 18, 'Marca Arcana: dispara uma marca que deixa o bicho fraco por 8 segundos.'], ['espiral', 'Espiral', '💫', 25, 'Corte Espiral: avança 6 metros girando a espada.'], ['espelho', 'Espelho', '🪞', 30, 'Espelho de Mana: por 6 s você toma metade do dano e devolve pro bicho.']],
    gladiador: [['bumerangue', 'Bumerangue', '🪃', 20, 'Chakram Bumerangue: vai longe e volta, acertando tudo no caminho duas vezes.'], ['esmagar', 'Esmagar', '🦶', 28, 'Salto Esmagador: pula alto e cai fazendo um tremor em área.'], ['pele', 'Pele de Ferro', '🗿', 30, 'Pele de Ferro: por 8 segundos +40% de defesa.']],
    atirador: [['granada', 'Granada', '💣', 28, 'Granada Arcana: lança uma granada que explode em área.'], ['tripla', 'Tripla', '🔱', 25, 'Rajada Tripla: por 8 segundos cada tiro sai triplo.'], ['recuo', 'Recuo', '↩️', 18, 'Recuo: pula pra trás e dá um tiro que deixa o bicho tonto.']],
    magonegro: [['maldicao', 'Maldição', '💀', 20, 'Maldição: o bicho fica fraco e queimando em chamas sombrias por 6 segundos.'], ['lanca', 'Lança', '🗡️', 28, 'Lança Sombria: atravessa todos os bichos em linha reta.'], ['pacto', 'Pacto', '🩸', 10, 'Pacto Sombrio: troca 20% da sua vida por 60 de mana e +50% de dano por 8 s.']],
  };
  Object.keys(HABS2).forEach(cls => { const base = PW[CLASSES[cls].hab]; base.ramo = 'classe'; base.nivel = 0; base.preco = 0; base.cls = cls;
    HABS2[cls].forEach(([id, nome, icone, custo, desc], i) => { const h = { id, nome, icone, custo, desc, tipo: 'uso', ramo: 'classe', cls, nivel: i + 1, preco: i + 1 }; PODERES.push(h); PW[id] = h; }); });
  const BUFF = {}; let esmaga = false;
  function buff(k, s) { s *= 1 + (potAtual - 1) / 2; BUFF[k] = Math.max(BUFF[k] || 0, s); }
  const LOB = [];
  function lanca(alvo, dur, cor, fn) { const p = heroi.position; LOB.push({ a: [p.x, p.y + 1.3, p.z], b: alvo, t: 0, dur, fn, s: glowSpr(world, p.x, p.y + 1.3, p.z, 0.9, cor, 1) }); }
  function area(x, z, r, fn) { FERAS.forEach(e => { if (feraAtiva(e) && Math.hypot(e.g.position.x - x, e.g.position.z - z) < r + e.T.raio) fn(e); }); }
  function caminho(x0, z0, ang, len, larg, fn) { const dx = Math.sin(ang), dz = Math.cos(ang); FERAS.forEach(e => { if (!feraAtiva(e)) return; const ex = e.g.position.x - x0, ez = e.g.position.z - z0; const al = ex * dx + ez * dz; if (al < -0.5 || al > len + 0.5) return; if (Math.abs(ex * dz - ez * dx) < larg + e.T.raio) fn(e); }); }
  function arranca(ang, dist, tempo) { dashAng = ang; dashT = tempo; dashVel = dist / tempo; }
  function classePoder2(id) { const p = heroi.position, M = atkMult(); const mp = r => maisPerto(r); const mira = e => { if (e) facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); };
    switch (id) {
      case 'furia': buff('furia', 8); flash('rgba(255,60,40,.3)'); aviso('FÚRIA! +40% de dano por 8 segundos.', '#ff5a3a'); break;
      case 'investida': { const e = mp(8); mira(e); caminho(p.x, p.z, facing, 7, 0.8, e => { dano(e, 30 * M, null, critico()); e.stun = Math.max(e.stun, 1.2); }); arranca(facing, 7, 0.28); fx('vento', [p.x, 0, p.z], 0.6); tremor = 0.2; break; }
      case 'grito': area(p.x, p.z, 6.5, e => { e.stun = Math.max(e.stun, 2); e.vuln = 6; numero(e.g.position, '😵', '#fff', e.T.alt + 0.6); }); const c20 = Math.round(20 * potAtual); vida = Math.min(VIDA_MAX, vida + c20); numero(p, '+' + c20 + ' ❤️', '#7ad87a'); fx('vento', [p.x, 0, p.z], 0.9); fx('luz', [p.x, 0, p.z], 0.5); tremor = 0.35; break;
      case 'passo': { const e = mp(10); if (!e) { aviso('Nenhum bicho perto.', '#8a9aba'); break; } const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz) || 1; fx('fumo', [p.x, 0, p.z], 0.6); p.x = e.g.position.x + dx / d * (e.T.raio + 0.8); p.z = e.g.position.z + dz / d * (e.T.raio + 0.8); facing = Math.atan2(-dx, -dz); fx('fumo', [p.x, 0, p.z], 0.6); atkT = 0; atkN = 1; atkHit = true; dano(e, 30 * M * 2, null, true); break; }
      case 'veneno': buff('veneno', 10); aviso('Lâminas envenenadas por 10 segundos.', '#7aff5a'); break;
      case 'tempestade': [0, 120, 240, 360, 480].forEach(t => setTimeout(() => { atkT = 0; atkN = 3; atkHit = true; area(heroi.position.x, heroi.position.z, 2.9, e => dano(e, 12 * M, null, critico())); fx('vento', [heroi.position.x, 0, heroi.position.z], 0.3); }, t)); break;
      case 'nova': fx('gelo', [p.x, 0, p.z], 1); fx('vento', [p.x, 0, p.z], 0.8); area(p.x, p.z, 6, e => { congelar(e, 2.5); dano(e, 20 * M, 'gelo'); }); flash('rgba(160,230,255,.35)'); break;
      case 'orbe': { const e = mp(18); mira(e); proj(p.x, p.y + 1.3, p.z, facing, '#5a8aff', 0, 11, 16, { tam: 1.8, explode: { r: 3.2, dano: 50 * M, tipo: 'luz' } }); break; }
      case 'teleporte': fx('luz', [p.x, 0, p.z], 0.5); p.x += Math.sin(facing) * 8; p.z += Math.cos(facing) * 8; fx('luz', [p.x, 0, p.z], 0.5); flash('rgba(180,200,255,.25)'); break;
      case 'chuva': { const e = mp(16); mira(e); const c = e ? [e.g.position.x, e.g.position.z] : [p.x + Math.sin(facing) * 7, p.z + Math.cos(facing) * 7]; for (let k = 0; k < 10; k++) { const a = Math.random() * 6.28, r = Math.random() * 3; METEOROS.push({ x: c[0] + Math.cos(a) * r, z: c[1] + Math.sin(a) * r, t: -k * 0.12, s: glowSpr(world, 0, -50, 0, 0.6, '#8aff9a', 1), M, dano: 13, raio: 1.4, cor: 'cura' }); } break; }
      case 'congelante': { const e = mp(20); mira(e); proj(p.x, p.y + 1.25, p.z, facing, '#bff2ff', 18 * M, 30, 20, { gelo: 3 }); break; }
      case 'floresta': { const c50 = Math.round(50 * potAtual); vida = Math.min(VIDA_MAX, vida + c50); numero(p, '+' + c50 + ' ❤️', '#7ad87a'); } buff('regen', 8); fx('cura', [p.x, 0, p.z], 2); break;
      case 'provocar': area(p.x, p.z, 12, e => { e.estado = 'caca'; e.cd = Math.min(e.cd, 0.5); numero(e.g.position, '❗', '#ff5a3a', e.T.alt + 0.6); }); buff('provocar', 6); fx('vento', [p.x, 0, p.z], 0.8); break;
      case 'escudada': atkT = 0; atkN = 1; atkHit = true; caminho(p.x, p.z, facing, 3.2, 1.2, e => { dano(e, 30 * M, null, critico()); e.stun = Math.max(e.stun, 2); const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz) || 1; empurra(e, dx / d, dz / d, 2.2); }); tremor = 0.25; fx('luz', [p.x + Math.sin(facing) * 1.5, 0, p.z + Math.cos(facing) * 1.5], 0.4); break;
      case 'fortaleza': buff('fortaleza', 10); aviso('Fortaleza: +30% de defesa e vida voltando por 10 s.', '#ffc85a'); break;
      case 'marca': { const e = mp(20); mira(e); proj(p.x, p.y + 1.25, p.z, facing, '#d8a8ff', 25 * M, 28, 20, { vuln: 8 }); break; }
      case 'espiral': caminho(p.x, p.z, facing, 6, 1, e => dano(e, 35 * M, null, critico())); arranca(facing, 6, 0.3); atkT = 0; atkN = 3; atkHit = true; fx('vento', [p.x, 0, p.z], 0.6); break;
      case 'espelho': buff('espelho', 6); aviso('Espelho de Mana: metade do dano volta pro bicho.', '#d8a8ff'); break;
      case 'bumerangue': { const e = mp(14); mira(e); proj(p.x, p.y + 1.1, p.z, facing, '#ff9a3a', 30 * M, 18, 12, { fura: true, volta: true, tam: 1.1 }); break; }
      case 'esmagar': if (!noChao) break; vy = PULO * 1.7; noChao = false; esmaga = true; break;
      case 'pele': buff('pele', 8); aviso('Pele de Ferro: +40% de defesa por 8 s.', '#c8c8d4'); break;
      case 'granada': { const e = mp(14); mira(e); const c = e ? [e.g.position.x, e.g.position.z] : [p.x + Math.sin(facing) * 8, p.z + Math.cos(facing) * 8]; lanca(c, 0.6, '#ffe24a', () => { fx('fogo', [c[0], 0, c[1]], 0.9); fx('fumo', [c[0], 0, c[1]], 1.2); tremor = Math.max(tremor, 0.35); area(c[0], c[1], 3.5, e => dano(e, 45 * M, 'fogo', critico())); }); break; }
      case 'tripla': buff('tripla', 8); aviso('Rajada Tripla por 8 segundos!', '#ffe24a'); break;
      case 'recuo': arranca(facing + Math.PI, 6, 0.25); setTimeout(() => { const e = mp(20); mira(e); proj(heroi.position.x, heroi.position.y + 1.25, heroi.position.z, facing, '#ffe24a', 20 * M, 30, 20, { stun: 2 }); }, 280); break;
      case 'maldicao': { const e = mp(12); if (!e) { aviso('Nenhum bicho perto.', '#8a9aba'); break; } mira(e); linhaLuz({ x: p.x, y: p.y + 1.3, z: p.z }, { x: e.g.position.x, y: e.T.alt * 0.6, z: e.g.position.z }, '#a050ff', 10); e.vuln = 8; e.queima = 6; numero(e.g.position, '💀', '#c890ff', e.T.alt + 0.6); break; }
      case 'lanca': { const e = mp(20); mira(e); proj(p.x, p.y + 1.25, p.z, facing, '#a050ff', 50 * M, 34, 20, { fura: true, tam: 1.2 }); break; }
      case 'pacto': { const custo = Math.round(VIDA_MAX * 0.2); vida = Math.max(1, vida - custo); mana = Math.min(MANA_MAX, mana + 60); buff('pacto', 8); numero(p, '-' + custo + ' ❤️  +60 🔷', '#c890ff'); flash('rgba(120,40,180,.35)'); break; }
    } }
  function aterrissa() { const p = heroi.position; som('tremor'); fx('fumo', [p.x, 0, p.z], 1.1); fx('luz', [p.x, 0, p.z], 0.5); tremor = 0.5; area(p.x, p.z, 3.8, e => { dano(e, 40 * atkMult(), null, critico()); e.stun = Math.max(e.stun, 1.5); }); }
  function habsFrame(dt) { Object.keys(BUFF).forEach(k => { if (BUFF[k] > 0) BUFF[k] -= dt; }); if (BUFF.regen > 0) vida = Math.min(VIDA_MAX, vida + 8 * dt); if (BUFF.fortaleza > 0) vida = Math.min(VIDA_MAX, vida + 5 * dt);
    for (let i = LOB.length - 1; i >= 0; i--) { const l = LOB[i]; l.t += dt; const u = Math.min(1, l.t / l.dur); l.s.position.set(lerp(l.a[0], l.b[0], u), lerp(l.a[1], 0.3, u) + Math.sin(u * Math.PI) * 3.5, lerp(l.a[2], l.b[1], u)); if (u >= 1) { world.remove(l.s); LOB.splice(i, 1); l.fn(); } } }
  // ===================== MODOS DE BATALHA (3 por classe, mudam o corpo e a arma) =====================
  // atk/def/vel/atkVel/crit/esq/roubo = bônus · escala = tamanho do corpo · flutua = levita · armaEsc = tamanho da arma
  // extras: asas, chifres, coroa, espinhos, duplo (arma na outra mão) · orbes: coisas girando em volta que atacam · ataque: efeito nos golpes
  const BM_CUSTO = [35, 65, 100], BM_NV = [1, 5, 12], BM_DUR = [20, 18, 16];
  const BMS = {
    guerreiro: [
      { nome: 'Fúria Rubra', cor: '#ff3a2a', atk: 1.3, atkVel: 0.85, armaEsc: 1.3, armaGlow: '#ff6a3a', extras: ['espinhos'] },
      { nome: 'Colosso', cor: '#ff6a2a', atk: 1.45, def: 30, escala: 1.3, armaEsc: 1.4, armaGlow: '#ffb04a', extras: ['espinhos', 'chifres'], ataque: 'empurra' },
      { nome: 'Titã de Guerra', cor: '#ffd23c', atk: 1.9, def: 40, escala: 1.5, armaEsc: 1.7, armaGlow: '#ffe680', extras: ['chifres', 'espinhos', 'coroa'], ataque: 'area' }],
    duelista: [
      { nome: 'Sombra Veloz', cor: '#5a4a8a', atkVel: 0.6, vel: 1.3, esq: 0.2, armaGlow: '#a08aff' },
      { nome: 'Lâminas Fantasma', cor: '#8a6aff', atk: 1.25, atkVel: 0.6, crit: 0.2, armaGlow: '#c8b8ff', orbes: { tipo: 'lamina', n: 4, dano: 8, raio: 2.4 } },
      { nome: 'Dança da Morte', cor: '#e8b030', atk: 1.5, atkVel: 0.45, crit: 1, vel: 1.5, esq: 0.35, extras: ['asas'], armaGlow: '#ffe28a', orbes: { tipo: 'lamina', n: 6, dano: 12, raio: 2.8 } }],
    mago: [
      { nome: 'Fluxo Arcano', cor: '#4a8aff', atk: 1.3, manaX: 3, armaGlow: '#8ac8ff', orbes: { tipo: 'arcano', n: 3, dano: 0, raio: 1.6 } },
      { nome: 'Elementalista', cor: '#7ad8ff', atk: 1.5, flutua: 0.25, armaEsc: 1.2, armaGlow: '#bfefff', ataque: 'explode', orbes: { tipo: 'arcano', n: 4, dano: 10, raio: 2.2 } },
      { nome: 'Arquimago', cor: '#c8a8ff', atk: 2.0, escala: 1.15, flutua: 0.5, armaEsc: 1.4, armaGlow: '#e8d8ff', extras: ['asas', 'coroa'], ataque: 'tripla', orbes: { tipo: 'arcano', n: 6, dano: 14, raio: 2.6 } }],
    arqueiro: [
      { nome: 'Olho de Falcão', cor: '#3ac86a', crit: 0.3, atkVel: 0.8, armaGlow: '#8aff9a' },
      { nome: 'Espírito da Floresta', cor: '#6aff8a', atk: 1.3, roubo: 0.2, regen: 4, armaEsc: 1.2, armaGlow: '#bfffc8', extras: ['chifres'], orbes: { tipo: 'folha', n: 4, dano: 6, raio: 2.2 } },
      { nome: 'Caçador Celestial', cor: '#bfffd8', atk: 1.6, atkVel: 0.5, crit: 0.4, vel: 1.3, flutua: 0.3, extras: ['asas'], armaEsc: 1.3, armaGlow: '#ffffff', ataque: 'tripla' }],
    guardiao: [
      { nome: 'Bastião', cor: '#9aaccc', def: 30, atk: 1.15, armaEsc: 1.35, armaGlow: '#cfe0ff' },
      { nome: 'Muralha Viva', cor: '#cfe0ff', def: 50, atk: 1.3, escala: 1.3, armaEsc: 1.5, espelho: 0.5, extras: ['espinhos'], ataque: 'empurra' },
      { nome: 'Colosso Sagrado', cor: '#ffd890', def: 70, atk: 1.6, escala: 1.5, armaEsc: 1.7, espelho: 1, extras: ['asas', 'coroa'], armaGlow: '#fff2c0', ataque: 'area' }],
    espadachim: [
      { nome: 'Lâmina Rúnica', cor: '#b46aff', atk: 1.3, armaGlow: '#d8a8ff', ataque: 'marca', orbes: { tipo: 'runa', n: 3, dano: 0, raio: 1.5 } },
      { nome: 'Mestre Arcano', cor: '#d8a8ff', atk: 1.5, atkVel: 0.7, extras: ['duplo'], armaGlow: '#e8ccff', ataque: 'marca', orbes: { tipo: 'runa', n: 4, dano: 10, raio: 2.2 } },
      { nome: 'Avatar Rúnico', cor: '#f0d8ff', atk: 1.9, atkVel: 0.6, escala: 1.2, flutua: 0.3, extras: ['duplo', 'asas'], armaEsc: 1.3, armaGlow: '#ffffff', ataque: 'proj', orbes: { tipo: 'runa', n: 6, dano: 14, raio: 2.6 } }],
    gladiador: [
      { nome: 'Fúria da Arena', cor: '#ff8a3a', atk: 1.3, armaEsc: 1.4, armaGlow: '#ffb070' },
      { nome: 'Tempestade de Aço', cor: '#ffb04a', atk: 1.4, def: 20, armaEsc: 1.5, armaGlow: '#ffd890', orbes: { tipo: 'chakram', n: 3, dano: 12, raio: 2.6 } },
      { nome: 'Campeão', cor: '#ffe680', atk: 1.8, def: 35, escala: 1.4, armaEsc: 1.7, extras: ['chifres', 'espinhos'], armaGlow: '#fff2c0', ataque: 'area', orbes: { tipo: 'chakram', n: 5, dano: 16, raio: 3 } }],
    atirador: [
      { nome: 'Mira Precisa', cor: '#ffe04a', crit: 0.35, atk: 1.2, armaGlow: '#fff2a0' },
      { nome: 'Rajada', cor: '#ffc83a', atk: 1.3, atkVel: 0.5, armaEsc: 1.25, armaGlow: '#ffe680', ataque: 'tripla' },
      { nome: 'Arsenal Arcano', cor: '#fff2c0', atk: 1.7, atkVel: 0.45, extras: ['duplo'], armaEsc: 1.3, armaGlow: '#ffffff', ataque: 'tripla', orbes: { tipo: 'torre', n: 3, dano: 14, raio: 2 } }],
    magonegro: [
      { nome: 'Pacto de Sangue', cor: '#a050ff', atk: 1.3, roubo: 0.3, armaGlow: '#c890ff' },
      { nome: 'Forma Sombria', cor: '#6a2ab8', atk: 1.5, roubo: 0.3, escala: 1.15, def: 15, armaEsc: 1.2, armaGlow: '#d8a8ff', extras: ['chifres'], ataque: 'marca', orbes: { tipo: 'sombra', n: 4, dano: 10, raio: 2.2 } },
      { nome: 'Senhor das Trevas', cor: '#3a1060', atk: 2.0, roubo: 0.5, escala: 1.3, flutua: 0.5, def: 25, armaEsc: 1.5, extras: ['asas', 'chifres', 'coroa'], armaGlow: '#e0c0ff', ataque: 'fura', orbes: { tipo: 'sombra', n: 6, dano: 16, raio: 2.8 } }],
  };
  // ---- Armadura do Modo de Batalha (preta com vermelho; I, II e III vão ficando mais pesadas) ----
  const BMA = { 1: [], 2: [], 3: [] }; let bmaChifre = null, bmaGarras = []; let bmaTab = null, bmaTras = null, bmaCapa = null, bmaHV = null; const BMA_CAB = [];
  const BMA_GLOW = new T3.MeshStandardMaterial({ color: '#ff2a2a', emissive: '#ff2a2a', emissiveIntensity: 2.4, toneMapped: false });
  { const P = heroi.userData.P;
    const NEG = new T3.MeshPhysicalMaterial({ color: '#16131c', metalness: 0.85, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.15, envMap: ENV, envMapIntensity: 1.2 });
    const NEG2 = new T3.MeshPhysicalMaterial({ color: '#2a2430', metalness: 0.8, roughness: 0.35, clearcoat: 0.5, envMap: ENV, envMapIntensity: 1.0 });
    const VERM = new T3.MeshPhysicalMaterial({ color: '#8a1018', metalness: 0.8, roughness: 0.3, clearcoat: 0.6, envMap: ENV, envMapIntensity: 1.1 });
    const PANO = new T3.MeshStandardMaterial({ map: magoTx(tecidoTx('#7a0a14'), 2), roughness: 0.8, side: T3.DoubleSide, envMap: ENV, envMapIntensity: 0.4 });
    const PANO2 = new T3.MeshStandardMaterial({ map: magoTx(tecidoTx('#1a1418'), 2), roughness: 0.85, side: T3.DoubleSide });
    let tier = 1; const A = (pa, ...a) => { const m = pc(pa, ...a); BMA[tier].push(m); return m; }; const G = (pa, x, y, z) => { const g = grp(pa, x, y, z); BMA[tier].push(g); return g; };
    const MG = (pa, geo, mat, x, y, z) => { const m = new T3.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; pa.add(m); BMA[tier].push(m); return m; };
    const linha = (pa, pts, r, mat) => MG(pa, new T3.TubeGeometry(new T3.CatmullRomCurve3(pts.map(v => new T3.Vector3(v[0], v[1], v[2]))), Math.max(10, pts.length * 6), r, 6, false), mat || BMA_GLOW);
    const espinho = (pa, x, y, z, w, h, rz, rx) => { const e = A(pa, CONE2, NEG, x, y, z, w, h, w * 0.6); e.rotation.set(rx || 0, 0, rz || 0); return e; };
    // ===== Modo I =====
    tier = 1;
    { const pl = A(P.spine, new T3.SphereGeometry(1, 32, 18, 0.25, Math.PI - 0.5, 0, Math.PI * 0.62), NEG, 0, 0.36, 0, 0.222, 0.25, 0.17); pl.rotation.x = -0.12; }
    A(P.spine, new T3.SphereGeometry(1, 28, 16, Math.PI + 0.3, Math.PI - 0.6, 0, Math.PI * 0.6), NEG2, 0, 0.36, 0, 0.215, 0.245, 0.16);
    linha(P.spine, [[-0.17, 0.52, 0.1], [-0.07, 0.4, 0.162], [0, 0.3, 0.175], [0.07, 0.4, 0.162], [0.17, 0.52, 0.1]], 0.007);
    A(P.spine, OCT1, BMA_GLOW, 0, 0.42, 0.18, 0.03, 0.05, 0.015);
    for (let i = 0; i < 3; i++) { A(P.spine, CYL2, i % 2 ? NEG2 : NEG, 0, 0.2 - i * 0.05, 0, 0.2 - i * 0.004, 0.048, 0.148); A(P.spine, TORF, VERM, 0, 0.176 - i * 0.05, 0, 0.2 - i * 0.004, 0.148, 0.2, Math.PI / 2); }
    A(P.spine, CYL2, NEG, 0, 0.05, 0, 0.205, 0.06, 0.15); A(P.spine, BOX, VERM, 0, 0.05, 0.15, 0.08, 0.07, 0.02); A(P.spine, OCT1, BMA_GLOW, 0, 0.05, 0.163, 0.022, 0.03, 0.01);
    A(P.spine, CYL2, NEG, 0, 0.6, 0, 0.11, 0.08, 0.1);
    // faixas de pano vermelho (frente e trás)
    bmaTab = G(P.hips, 0, 0, 0.16); { const s = new T3.Shape(); s.moveTo(-0.1, 0); s.lineTo(0.1, 0); s.lineTo(0.12, -0.5); s.lineTo(0.04, -0.58); s.lineTo(0, -0.52); s.lineTo(-0.04, -0.6); s.lineTo(-0.12, -0.5); s.closePath(); MG(bmaTab, new T3.ShapeGeometry(s), PANO, 0, 0, 0); linha(bmaTab, [[-0.1, 0, 0.004], [-0.12, -0.5, 0.004]], 0.005, VERM); linha(bmaTab, [[0.1, 0, 0.004], [0.12, -0.5, 0.004]], 0.005, VERM); }
    bmaTras = G(P.hips, 0, 0, -0.15); { const s = new T3.Shape(); s.moveTo(-0.14, 0); s.lineTo(0.14, 0); s.lineTo(0.17, -0.58); s.lineTo(0.05, -0.66); s.lineTo(0, -0.6); s.lineTo(-0.06, -0.68); s.lineTo(-0.17, -0.58); s.closePath(); MG(bmaTras, new T3.ShapeGeometry(s), PANO, 0, 0, 0); }
    // saiote de placas nas laterais
    [-1, 1].forEach(s => { const g = G(P.hips, s * 0.15, -0.02, 0); g.rotation.z = s * 0.25; for (let k = 0; k < 3; k++) A(g, BOX, k % 2 ? NEG2 : NEG, 0, -0.05 - k * 0.07, 0, 0.07, 0.09, 0.2, 0.15); });
    ['L', 'R'].forEach((sd, i) => { const sx = i ? 1 : -1, sh = P['sh' + sd];
      const o = G(sh, sx * 0.03, 0.03, 0); o.rotation.z = -sx * 0.3;
      [[0.0, 0.135, 0.085], [-0.05, 0.125, 0.075]].forEach(([y, r, h], k) => { A(o, HSPH, k ? NEG2 : NEG, sx * k * 0.014, y, 0, r * 1.1, h * 1.5, r * 1.05); A(o, TORF, VERM, sx * k * 0.014, y + 0.004, 0, r * 1.1, r * 1.05, r * 1.1, Math.PI / 2); });
      espinho(o, sx * 0.06, 0.12, -0.02, 0.03, 0.2, -sx * 0.45, -0.25); espinho(o, sx * 0.11, 0.08, 0.03, 0.025, 0.15, -sx * 0.8, -0.1);
      A(sh, CYL2, NEG2, 0, -0.19, 0, 0.068, 0.17, 0.068);
      const el = P['el' + sd]; A(el, SPH2, NEG, 0, 0, 0, 0.066, 0.064, 0.066); espinho(el, 0, 0, -0.07, 0.02, 0.1, 0, -Math.PI / 2 - 0.3);
      A(el, CYL2, NEG, 0, -0.15, 0, 0.074, 0.2, 0.072); A(el, TORF, VERM, 0, -0.06, 0, 0.075, 0.073, 0.075, Math.PI / 2); linha(el, [[sx * 0.074, -0.08, 0.0], [sx * 0.076, -0.22, 0.0]], 0.006);
      for (let k = 0; k < 3; k++) espinho(el, sx * 0.07, -0.09 - k * 0.055, -0.035, 0.014, 0.08 - k * 0.012, -sx * 1.35, 0);
      A(el, SPH2, NEG, 0, -0.29, 0.01, 0.06, 0.068, 0.054); for (let f = 0; f < 4; f++) { const d = A(el, CONE2, NEG2, (f - 1.5) * 0.022, -0.36, 0.035, 0.012, 0.08, 0.012); d.rotation.x = Math.PI - 0.25; }
      const th = P['th' + sd]; A(th, SPH2, NEG, sx * 0.04, -0.08, 0.02, 0.1, 0.16, 0.11, 0, 0, sx * 0.1); A(th, CYL2, NEG2, 0, -0.25, 0, 0.08, 0.26, 0.08);
      const kn = P['kn' + sd]; A(kn, SPH2, NEG, 0, 0, 0.04, 0.075, 0.085, 0.06); espinho(kn, 0, 0.09, 0.06, 0.024, 0.12, 0, 0.3); A(kn, OCT1, BMA_GLOW, 0, 0, 0.1, 0.014, 0.02, 0.008);
      A(kn, CYL2, NEG, 0, -0.21, 0, 0.076, 0.3, 0.076); A(kn, BOX, VERM, 0, -0.2, 0.074, 0.018, 0.28, 0.01); for (let k = 0; k < 2; k++) A(kn, TORF, VERM, 0, -0.08 - k * 0.2, 0, 0.078, 0.078, 0.078, Math.PI / 2);
      espinho(kn, sx * 0.07, -0.15, -0.02, 0.016, 0.09, -sx * 1.4, 0);
      const ft = P['ft' + sd]; A(ft, SPH2, NEG, 0, 0.005, 0.06, 0.08, 0.066, 0.16); const bico = A(ft, CONE2, NEG, 0, 0.0, 0.22, 0.045, 0.1, 0.03); bico.rotation.x = Math.PI / 2; A(ft, BOX, VERM, 0, -0.052, 0.06, 0.13, 0.016, 0.3); });
    // chifre único na testa e garras saindo dos ombros (crescem no II e no III)
    const seg = (pa, a, b, r0, r1, mat) => { const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], len = Math.hypot(dx, dy, dz); const m = MG(pa, new T3.CylinderGeometry(r1, r0, len * 1.08, 12), mat, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), new T3.Vector3(dx / len, dy / len, dz / len)); return m; };
    const curva = (pa, pts, r0, cor) => { const n = pts.length - 1; for (let k = 0; k < n; k++) { const ra = r0 * (1 - k / n), rb = r0 * (1 - (k + 1) / n) + 0.002; seg(pa, pts[k], pts[k + 1], ra, rb, k === n - 1 ? BMA_GLOW : NEG); } };
    bmaChifre = G(P.head, 0, 0.2, 0.12); A(bmaChifre, TORF, VERM, 0, 0, 0, 0.05, 0.05, 0.05, Math.PI / 2 - 0.3); A(bmaChifre, OCT1, BMA_GLOW, 0, -0.05, 0.035, 0.014, 0.02, 0.008);
    curva(bmaChifre, [[0, 0, 0], [0, 0.07, 0.025], [0, 0.15, 0.02], [0, 0.22, -0.02], [0, 0.27, -0.09], [0, 0.29, -0.16]], 0.05);
    bmaGarras = ['L', 'R'].map((sd, i) => { const sx = i ? 1 : -1; const g = G(P['sh' + sd], sx * 0.09, 0.08, 0);
      [-0.06, 0, 0.06].forEach((z, k) => { const up = k === 1 ? 0.04 : 0; curva(g, [[0, 0, z], [sx * 0.07, 0.07 + up, z * 1.2], [sx * 0.16, 0.12 + up, z * 1.5], [sx * 0.25, 0.11 + up, z * 1.6], [sx * 0.31, 0.04 + up, z * 1.5]], 0.028); });
      return g; });
    // ===== Modo II: elmo aberto e capa vermelha =====
    tier = 2;
    { const h = P.head; const e = A(h, new T3.SphereGeometry(1, 32, 20, Math.PI / 2 + 0.8, Math.PI * 2 - 1.6, 0, Math.PI * 0.62), NEG, 0, 0.07, -0.01, 0.245, 0.26, 0.245); BMA_CAB.push(e);
      A(h, new T3.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.35), NEG2, 0, 0.12, 0.0, 0.25, 0.22, 0.25);
      [-1, 1].forEach(s => { const b = A(h, BOX, NEG, s * 0.2, -0.02, 0.07, 0.05, 0.2, 0.14); b.rotation.y = -s * 0.5; A(h, BOX, VERM, s * 0.215, 0.06, 0.1, 0.012, 0.05, 0.08).rotation.y = -s * 0.5; });
      linha(h, [[-0.19, 0.08, 0.14], [-0.1, 0.25, 0.16], [0, 0.28, 0.17], [0.1, 0.25, 0.16], [0.19, 0.08, 0.14]], 0.008, VERM);
    }
    bmaCapa = G(P.spine, 0, 0.58, -0.17); { const geo = new T3.PlaneGeometry(0.4, 0.68, 12, 12); const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); const f = (0.34 - y) / 0.68; p.setZ(i, -Math.pow(x / 0.2, 2) * 0.05 - f * 0.08 + Math.sin(x * 14 + y * 3) * 0.012 * f); p.setX(i, x * (1 + f * 0.35)); if (y < -0.28) p.setY(i, y + (0.03 + 0.07 * Math.abs(Math.sin(x * 37))) * (Math.sin(x * 91) > 0 ? 1 : 0.3)); }
      geo.computeVertexNormals(); MG(bmaCapa, geo, PANO, 0, -0.34, 0); A(bmaCapa, CYL2, VERM, 0, 0, 0, 0.14, 0.022, 0.022, 0, 0, Math.PI / 2); [-1, 1].forEach(s => A(bmaCapa, SPH2, BMA_GLOW, s * 0.12, 0, 0.01, 0.022, 0.022, 0.014)); }
    ['L', 'R'].forEach((sd, i) => { const sx = i ? 1 : -1; const o = G(P['sh' + sd], sx * 0.05, 0.03, 0); o.rotation.z = -sx * 0.3; espinho(o, sx * 0.02, 0.15, -0.06, 0.035, 0.26, -sx * 0.2, -0.45); espinho(o, sx * 0.13, 0.04, -0.05, 0.03, 0.2, -sx * 1.05, -0.2); });
    // ===== Modo III: chifres grandes, ombreiras gigantes, lâminas nas costas e capa dupla rasgada =====
    tier = 3;
    ['L', 'R'].forEach((sd, i) => { const sx = i ? 1 : -1; const o = G(P['sh' + sd], sx * 0.06, 0.07, 0); o.rotation.z = -sx * 0.25; A(o, HSPH, NEG, 0, 0.03, 0, 0.17, 0.1, 0.16); A(o, TORF, BMA_GLOW, 0, 0.034, 0, 0.17, 0.16, 0.17, Math.PI / 2);
      for (let k = 0; k < 4; k++) espinho(o, sx * (0.02 + k * 0.045), 0.1 - k * 0.012, -0.08 + k * 0.05, 0.03, 0.3 - k * 0.05, -sx * (0.3 + k * 0.25), -0.35); });
    { const g = G(P.spine, 0, 0.45, -0.17); [-1, 0, 1].forEach(s => { const b = A(g, CONE2, NEG, s * 0.09, 0.12 - Math.abs(s) * 0.04, -0.03, 0.03, 0.45 - Math.abs(s) * 0.1, 0.012); b.rotation.set(-0.5, 0, -s * 0.5); A(g, CONE2, BMA_GLOW, s * 0.09, 0.12 - Math.abs(s) * 0.04, -0.02, 0.008, 0.38 - Math.abs(s) * 0.1, 0.004).rotation.set(-0.5, 0, -s * 0.5); }); }
    { const g = G(bmaCapa, 0, 0, -0.01); const geo = new T3.PlaneGeometry(0.46, 0.8, 12, 12); const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); const f = (0.4 - y) / 0.8; p.setZ(i, -Math.pow(x / 0.23, 2) * 0.06 - f * 0.1 - 0.015); p.setX(i, x * (1 + f * 0.4)); if (y < -0.32) p.setY(i, y + (0.05 + 0.1 * Math.abs(Math.sin(x * 29))) * (Math.sin(x * 77) > 0 ? 1 : 0.2)); }
      geo.computeVertexNormals(); MG(g, geo, PANO2, 0, -0.4, 0); }
    [1, 2, 3].forEach(t => BMA[t].forEach(m => m.visible = false)); }
  function bmaVeste(n) { const P = heroi.userData.P;
    [1, 2, 3].forEach(t => BMA[t].forEach(m => m.visible = !!n && t <= n));
    if (n) { bmaChifre.scale.setScalar([0, 0.6, 1, 1.5][n]); bmaChifre.position.y = n >= 2 ? 0.26 : 0.21; bmaChifre.position.z = n >= 2 ? 0.15 : 0.12; bmaGarras.forEach(g => g.scale.setScalar([0, 0.7, 1, 1.4][n])); }
    if (n) { escondeTrajes(); Object.values(PEC).forEach(l => l.forEach(m => m.visible = false)); Object.values(CAS).forEach(c => c.m.forEach(m => m.visible = false)); roupaBase.forEach(([o]) => o.material = MALHA);
      if (n >= 2 && !bmaHV) { bmaHV = []; P.head.traverse(c => { if (c.isMesh && c.visible && typeof MH !== 'undefined' && (c.material === MH.cab || (MH.cab && c.material && c.material.color && c.material.color.equals && MH.cab.color && c.material === MH.cab))) { bmaHV.push(c); c.visible = false; } }); } }
    else { if (bmaHV) { bmaHV.forEach(c => c.visible = true); bmaHV = null; } escondeTrajes(); if (AR.fantasia === 'celeste') armadura.forEach(m => m.visible = true); if (CAS[AR.fantasia]) CAS[AR.fantasia].m.forEach(m => m.visible = true); atualizaPecas(); }
    setTimeout(fazRetrato, 80); }
  function bmaFrame() { if (!BM || !bmaTab) return; const P = heroi.userData.P; bmaTab.rotation.x = Math.min(0, P.thL.rotation.x, P.thR.rotation.x) * 0.85; bmaTras.rotation.x = Math.max(0, P.thL.rotation.x, P.thR.rotation.x) * 0.7;
    const v = typeof vel !== 'undefined' ? vel : 0; bmaCapa.rotation.x += (Math.min(0.7, v * 0.07) + Math.sin(gT * 2.4) * 0.04 - bmaCapa.rotation.x) * 0.15; }
  let BM = null, bmN = 0, bmMat = null; const ESCALA0 = heroi.scale.x;
  function bmMatCor(cor) { return new T3.MeshBasicMaterial({ color: cor, toneMapped: false, transparent: true, opacity: 0.9 }); }
  // peças extras presas no corpo
  const EXTRA = {}; { const P = heroi.userData.P; const B = (p, geo, x, y, z, sx, sy, sz, rx, ry, rz) => { const m = new T3.Mesh(geo, bmMat || bmMatCor('#fff')); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.set(rx || 0, ry || 0, rz || 0); p.add(m); return m; };
    let g = EXTRA.asas = grp(P.spine, 0, 0.42, -0.14); [-1, 1].forEach(s => { for (let k = 0; k < 4; k++) { const m = B(g, CONE2, s * (0.12 + k * 0.17), 0.05 + k * 0.12 - k * k * 0.03, -0.05 - k * 0.04, 0.05, 0.75 - k * 0.1, 0.012, 0, 0, -s * (1.1 + k * 0.28)); m.userData.asa = s; } });
    g = EXTRA.chifres = grp(P.head, 0, 0.2, 0); [-1, 1].forEach(s => { B(g, CONE2, s * 0.1, 0.08, 0.02, 0.035, 0.26, 0.035, -0.3, 0, -s * 0.6); });
    g = EXTRA.coroa = grp(P.head, 0, 0.27, 0); B(g, TOR2, 0, 0, 0, 0.13, 0.13, 0.4, Math.PI / 2, 0, 0); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; B(g, CONE2, Math.cos(a) * 0.12, 0.06, Math.sin(a) * 0.12, 0.022, 0.1, 0.022); }
    g = EXTRA.espinhos = grp(heroi); ['shL', 'shR'].forEach((k, i) => { const s = i ? 1 : -1; const gg = grp(P[k]); for (let j = 0; j < 3; j++) B(gg, CONE2, s * (0.08 + j * 0.05), 0.12 + j * 0.02, -0.05 + j * 0.05, 0.03, 0.22 + j * 0.06, 0.03, 0.2, 0, -s * (0.5 + j * 0.25)); EXTRA['esp' + k] = gg; });
    Object.keys(EXTRA).forEach(k => { EXTRA[k].visible = false; }); }
  const armaGlowS = glowSpr(maoG, 0, 0, 0.6, 1.6, '#ffffff', 0); let duploG = null;
  const ORB = grp(world); ORB.visible = false; let orbT = 0;
  function montaOrbes(o, cor) { while (ORB.children.length) ORB.remove(ORB.children[0]); if (!o) return; for (let k = 0; k < o.n; k++) { const g = grp(ORB); const M = bmMatCor(cor);
      if (o.tipo === 'lamina') { const m = new T3.Mesh(BOX, M); m.scale.set(0.05, 0.02, 0.7); g.add(m); }
      else if (o.tipo === 'chakram') { const m = new T3.Mesh(TOR2, M); m.scale.set(0.22, 0.22, 0.4); m.rotation.x = Math.PI / 2; g.add(m); }
      else if (o.tipo === 'torre') { const m = new T3.Mesh(BOX, M); m.scale.set(0.18, 0.18, 0.18); g.add(m); glowSpr(g, 0, 0, 0, 0.6, cor, 0.7); }
      else if (o.tipo === 'folha') { const m = new T3.Mesh(CONE2, M); m.scale.set(0.12, 0.3, 0.03); m.rotation.z = 1; g.add(m); }
      else { const m = new T3.Mesh(SPH2, M); m.scale.setScalar(0.1); g.add(m); glowSpr(g, 0, 0, 0, 0.8, cor, 0.8); } } }
  function bmDesliga() { if (!BM) return; BM = null; bmN = 0; heroi.scale.setScalar(ESCALA0); maoG.scale.setScalar(1); maoE.scale.setScalar(1); armaGlowS.material.opacity = 0; Object.keys(EXTRA).forEach(k => EXTRA[k].visible = false); if (duploG) { maoE.remove(duploG); duploG = null; } ORB.visible = false; despAura.material.opacity = 0; mostraArma(); bmaVeste(0); }
  function bmLiga(n) { const c = CLA(); if (!c) return; const M = BMS[AR.classe][n - 1]; BM = M; bmN = n; despT = BM_DUR[n - 1]; desp = 0;
    bmMat = bmMatCor(M.cor); Object.keys(EXTRA).forEach(k => { EXTRA[k].traverse(o => { if (o.isMesh) o.material = bmMat; }); EXTRA[k].visible = false; });
    (M.extras || []).forEach(k => { if (k === 'espinhos') { EXTRA.espshL.visible = EXTRA.espshR.visible = true; } else if (k === 'duplo' && ARMAG[AR.arma]) { duploG = ARMAG[AR.arma].clone(); duploG.visible = true; duploG.scale.x = -1; maoE.add(duploG); Object.values(ARMAE).forEach(x => x.visible = false); } else if (EXTRA[k]) EXTRA[k].visible = true; });
    heroi.scale.setScalar(ESCALA0 * (M.escala || 1)); maoG.scale.setScalar(M.armaEsc || 1); maoE.scale.setScalar(M.armaEsc || 1); armaGlowS.material.color.set(M.armaGlow || M.cor); armaGlowS.material.opacity = M.armaGlow ? 0.7 : 0;
    montaOrbes(M.orbes, M.cor); ORB.visible = !!M.orbes; despAura.material.color.set(M.cor);
    ['chifres', 'coroa'].forEach(x => { if (n >= 2) EXTRA[x].visible = false; }); EXTRA.espshL.visible = EXTRA.espshR.visible = false; BMA_GLOW.color.set(M.cor === '#ffd23c' || M.cor === '#ffe680' ? '#ff2a2a' : '#ff2a2a'); bmaVeste(n);
    som('modo', 1, 1); flash('rgba(255,255,255,.6)'); tremor = 0.35; fx('luz', [heroi.position.x, 0, heroi.position.z], 1.2); fx('cura', [heroi.position.x, 0, heroi.position.z], 1.4);
    const el = $('lvup'); el.innerHTML = `<small>MODO DE BATALHA ${['I', 'II', 'III'][n - 1]}</small>${M.nome}<em>${bmTexto(M)} · ${BM_DUR[n - 1]} s</em>`; el.style.color = M.cor; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); }
  function bmTexto(M) { const t = []; if (M.atk) t.push('+' + Math.round((M.atk - 1) * 100) + '% ataque'); if (M.def) t.push('+' + M.def + '% defesa'); if (M.atkVel) t.push('ataque ' + Math.round((1 / M.atkVel - 1) * 100) + '% mais rápido'); if (M.vel) t.push('+' + Math.round((M.vel - 1) * 100) + '% velocidade'); if (M.crit) t.push('+' + Math.round(M.crit * 100) + '% crítico'); if (M.esq) t.push('+' + Math.round(M.esq * 100) + '% esquiva'); if (M.roubo) t.push('rouba ' + Math.round(M.roubo * 100) + '% de vida'); if (M.espelho) t.push('devolve ' + Math.round(M.espelho * 100) + '% do dano'); if (M.regen) t.push('vida volta sozinha');
    const A = { area: 'golpes acertam tudo em volta', tripla: 'tiros triplos', proj: 'golpes disparam runas', explode: 'tiros explodem', marca: 'golpes enfraquecem', empurra: 'golpes empurram', fura: 'tiros atravessam' }[M.ataque]; if (A) t.push(A); if (M.orbes && M.orbes.dano) t.push((M.orbes.n) + ' ' + { lamina: 'lâminas', chakram: 'chakrams', torre: 'torretas', folha: 'folhas', arcano: 'orbes', runa: 'runas', sombra: 'sombras' }[M.orbes.tipo] + ' girando'); return t.join(' · '); }
  function modoBatalha(n) { if (conversa || cenaQ || desmaiado) return; const c = CLA(); if (!c) return; if (AR.nv < BM_NV[n - 1]) { aviso('Modo de Batalha ' + ['I', 'II', 'III'][n - 1] + ' libera no nível ' + BM_NV[n - 1] + '.', '#ff6a6a'); return; }
    if (BM) { aviso('Já está no modo ' + BM.nome + ' (' + Math.ceil(despT) + ' s).', '#8a9aba'); return; } if (desp < BM_CUSTO[n - 1]) { aviso('Lute pra encher a barra: ' + Math.floor(desp) + '% de ' + BM_CUSTO[n - 1] + '%.', '#ffd23c'); return; } bmLiga(n); }
  [1, 2, 3].forEach(n => tapBtn($('bm' + n), () => modoBatalha(n))); window.addEventListener('keydown', e => { if (e.code === 'KeyR') modoBatalha(1); if (e.code === 'KeyT' && !e.repeat && false) {} if (e.code === 'KeyG') modoBatalha(2); if (e.code === 'KeyH') modoBatalha(3); });
  function bmFrame(dt, p) { bmaFrame();
    if (BM) { despT -= dt; if (despT <= 0) { bmDesliga(); aviso('O modo de batalha acabou.', '#8a9aba'); } }
    if (BM) { const M = BM; despAura.position.set(p.x, p.y + 1.0 * (M.escala || 1), p.z); despAura.scale.setScalar(3.4 * (M.escala || 1)); despAura.material.opacity = 0.35 + Math.sin(gT * 8) * 0.1; if (Math.random() < dt * 3) fx('luz', [p.x, 0, p.z], 0.6);
      if (M.flutua) heroi.userData.P.hips.position.y += M.flutua / ESCALA0 + Math.sin(gT * 3) * 0.04;
      if (M.regen) vida = Math.min(VIDA_MAX, vida + M.regen * dt); if (M.manaX) mana = Math.min(MANA_MAX, mana + M.manaX * dt);
      EXTRA.asas.children.forEach(m => { m.rotation.z = -m.userData.asa * (1.1 + (m.position.x * m.userData.asa - 0.12) / 0.17 * 0.28) + Math.sin(gT * 4) * 0.25 * m.userData.asa; });
      if (M.orbes) { const o = M.orbes; ORB.position.set(p.x, p.y + 1.1 * (M.escala || 1), p.z); ORB.children.forEach((g, k) => { const a = gT * 2.5 + k / o.n * Math.PI * 2; g.position.set(Math.cos(a) * o.raio, Math.sin(gT * 3 + k) * 0.25, Math.sin(a) * o.raio); g.rotation.y = -a; g.rotation.z = gT * 6; });
        orbT += dt; if (o.dano && orbT > (o.tipo === 'torre' ? 0.55 : 0.4)) { orbT = 0; if (o.tipo === 'torre') { const e = maisPerto(16); if (e) { const g = ORB.children[Math.floor(Math.random() * o.n)]; const wp = new T3.Vector3(); g.getWorldPosition(wp); proj(wp.x, wp.y, wp.z, Math.atan2(e.g.position.x - wp.x, e.g.position.z - wp.z), M.cor, o.dano * atkMult(), 30, 16); } }
          else area(p.x, p.z, o.raio + 0.4, e => { dano(e, o.dano * atkMult(), null, critico()); }); } } }
    [1, 2, 3].forEach(n => { const d = $('bm' + n); const c = CLA(); const cu = BM_CUSTO[n - 1]; d.style.setProperty('--c', c ? c.cor : '#ffd23c'); d.classList.toggle('trava', !c || AR.nv < BM_NV[n - 1]); d.classList.toggle('ativo', bmN === n); d.classList.toggle('pronto', !BM && desp >= cu && !!c && AR.nv >= BM_NV[n - 1]);
      d.style.setProperty('--p', bmN === n ? despT / BM_DUR[n - 1] * 100 : BM ? 0 : Math.min(100, desp / cu * 100)); d.querySelector('span').textContent = bmN === n ? Math.ceil(despT) : ['I', 'II', 'III'][n - 1]; }); }
  if (AR.classe && !CLASSES[AR.classe]) AR.classe = null;
  aplicaNivel(); aplicaVisual(); if (AR.classe) { const v = AR.barra[2]; if (v !== CLASSES[AR.classe].hab) aplicaClasse(AR.classe); else { montaBarra(); mostraArma(); } } else setTimeout(() => abrirCriar(1), 300);
  setTimeout(fazRetrato, 900);
  // ===================== MODO BLOCOS (visual estilo Pixel Piece: cubos + texturas pixel art) =====================
  let BLOCOS = VISUAL_BLOCOS;
  function pixTex(pal, rows, rep) { const h = rows.length, w = rows[0].length; const t = canvasTex(w, h, (x) => { for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) { const k = rows[r][c]; if (pal[k]) { x.fillStyle = pal[k]; x.fillRect(c, r, 1, 1); } } }); t.magFilter = t.minFilter = T3.NearestFilter; t.generateMipmaps = false; t.wrapS = t.wrapT = T3.RepeatWrapping; if (rep) t.repeat.set(rep, rep); return t; }
  function ruido(w, h, cores, seed) { const R = rng(seed); const rows = []; for (let r = 0; r < h; r++) { let s = ''; for (let c = 0; c < w; c++) { const u = R(); s += u < 0.7 ? '0' : u < 0.9 ? '1' : '2'; } rows.push(s); } return pixTex({ 0: cores[0], 1: cores[1], 2: cores[2] }, rows); }
  const PT = {
    neve: ruido(16, 16, ['#eef2fa', '#dfe6f2', '#f8fbff'], 21),
    grama: ruido(16, 16, ['#5bbf5b', '#4fae4f', '#72d468'], 22),
    pedra: pixTex({ 0: '#ffffff', 1: '#e2dccf', 2: '#f6f2ea', 3: '#bdb3a2' }, ['0000300000030000', '0220300022203000', '0220300022203000', '0000300000030000', '3333333333333333', '0003000020003002', '0003022020003022', '0003000020003000', '3333333333333333', '0220300000030220', '0220300022030220', '0000300022030000', '3333333333333333', '0003000020003000', '0003022020003022', '0003000000003000']),
    tabua: pixTex({ 0: '#d89a5a', 1: '#c0834a', 2: '#eab070', 3: '#8a5a32' }, ['0000000000000000', '0200020000200200', '0000000000000000', '3333333333333333', '0000000000000000', '0002000020000020', '0000000000000000', '3333333333333333', '0000000000000000', '0200000200002000', '0000000000000000', '3333333333333333', '0000000000000000', '0000200000200000', '0000000000000000', '3333333333333333']),
    telha: pixTex({ 0: '#ffffff', 1: '#cfc6d2', 2: '#ebe6ee' }, ['0000200000002000', '0000100000001000', '1111111111111111', '0000000000000000', '2000000020000000', '1000000010000000', '1111111111111111', '0000000000000000', '0000200000002000', '0000100000001000', '1111111111111111', '0000000000000000', '2000000020000000', '1000000010000000', '1111111111111111', '0000000000000000']),
    folha: ruido(8, 8, ['#4cb84a', '#3a9e3e', '#72d062'], 23),
    casca: pixTex({ 0: '#9a6238', 1: '#7e4e2a', 2: '#b07444' }, ['0100001000010000', '0100001000010000', '0100201000010020', '0100001000010000', '0100001002010000', '0100001000010000', '2100001000010000', '0100001000010000']),
    janela: pixTex({ 0: '#cfeaf6', 1: '#2a2230', 2: '#ffe9a8', 3: '#9fd3ea' }, ['1111111111111111', '1000000000000001', '1033000000003301', '1030000000000301', '1000000000000001', '1000000000000001', '1111111111111111', '1000000000000001', '1000000000000001', '1003000000003001', '1000000000000001', '1000000000000001', '1000000000000001', '1000000000000001', '1000000000000001', '1111111111111111']),
  };
  // rosto pixel art (10x10) na frente da cabeça cúbica
  function rostoTex(pele, olho, cab) { const P = { s: pele, o: olho, b: '#2b2340', w: '#ffffff', m: '#c8404a', c: cab, r: '#ff9aa8' }; const rows = ['ssssssssss', 'ssssssssss', 'ssbbssbbss', 'sswbsswbss', 'ssbbssbbss', 'srrssssrrs', 'ssmssssmss', 'sssmmmmsss', 'ssssssssss', 'ssssssssss'];
    const t = canvasTex(10, 10, (x) => { for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) { x.fillStyle = P[rows[r][c]]; x.fillRect(c, r, 1, 1); } }); t.magFilter = t.minFilter = T3.NearestFilter; t.generateMipmaps = false; return t; }
  const BLOCAVEL = /Sphere|Capsule|Cylinder|Cone|Icosahedron|Dodecahedron|Extrude/;
  const _bb = new T3.Box3(), _sz = new T3.Vector3();
  function cubifica(o) { if (!o.isMesh || o.isInstancedMesh || o.isSprite || !o.geometry || o.userData.naoBloco) return; const t = o.geometry.type; if (!BLOCAVEL.test(t)) return; if (o.geometry === ROOF) return;
    o.geometry.computeBoundingBox(); _bb.copy(o.geometry.boundingBox); _bb.getSize(_sz); o.geometry = BOX; o.scale.multiply(_sz); o.children.forEach(c => { if (c.isMesh && c.material === OUTM) c.visible = false; }); }
  function texturiza(m, tex, rx, ry) { if (!m.isMesh || !m.material || !m.material.isMeshToonMaterial) return; const mat = m.material.clone(); const t = tex.clone(); t.needsUpdate = true; t.repeat.set(Math.max(1, Math.round(rx || 1)), Math.max(1, Math.round(ry || 1))); mat.map = t; mat.color.set('#ffffff'); m.material = mat; }
  // paleta "bloquinhos coloridos": cada casa ganha uma cor de parede e de telhado
  const PAREDES_ALEGRES = ['#ffd9a0', '#ffc2ae', '#c4e6ff', '#d2f2b8', '#fff0a0', '#ffd0e4'];
  const TELHADOS_ALEGRES = ['#ff7a59', '#3a9ee0', '#5bbf5b', '#ffb03c', '#e8607a', '#8a6ae0'];
  const _cdc = new Map(); function corDaCasa(m, lista) { const g = m.parent || m; if (!_cdc.has(g)) _cdc.set(g, _cdc.size); return lista[_cdc.get(g) % lista.length]; }
  const CORES_PAREDE = ['#c8b8a0', '#b8a890', '#c8b090', '#a89880', '#c0b8a8', '#b0a088', '#ffd8b0', '#e8d8c0', '#d8d0c0', '#c8c0b0', '#b8a898', '#d0c8b8'];
  function modoBlocos() { if (!BLOCOS) return;
    // 0) sem neve na vila: telhados, pinheiros e lenha ficam coloridos
    { const NV = TM['#ffffff']; if (NV) vil.traverse(m => { if (m.isMesh && m.material === NV) m.visible = false; }); }
    // 1) tudo que é redondo vira cubo
    world.traverse(cubifica);
    // 2) texturas pixel art pelo mundo (pela cor original da peça)
    world.traverse(m => { if (!m.isMesh || !m.material || !m.material.isMeshToonMaterial || !m.material.color) return; const c = '#' + m.material.color.getHexString(); const s = m.scale;
      if (m === ground) { const mat = m.material.clone(); mat.map = PT.grama.clone(); mat.map.needsUpdate = true; mat.map.repeat.set(200, 200); m.material = mat; return; }
      if (CORES_PAREDE.includes(c) && s.y > 1.5) { texturiza(m, PT.pedra, s.x / 1.2, s.y / 1.2); m.material.color.set(corDaCasa(m, PAREDES_ALEGRES)); }
      else if (c === '#4a3a4a' && m.geometry === ROOF) { texturiza(m, PT.telha, s.x / 1.2, s.y / 1.2); m.material.color.set(corDaCasa(m, TELHADOS_ALEGRES)); }
      else if (c === '#5a3a24' || c === '#6a4a2a' || c === '#7a4a2a' || c === '#8a5a3a') { if (s.y > s.x * 1.5) texturiza(m, PT.casca, 1, Math.max(1, s.y / 0.8)); else texturiza(m, PT.tabua, Math.max(1, s.x / 0.8), Math.max(1, s.y / 0.8)); }
      else if (c === '#2a5a3a') texturiza(m, PT.folha, 2, 2);
      else if (c === '#ffc468' && s.x < 1 && s.y < 1) { texturiza(m, PT.janela, 1, 1); m.material.map.repeat.set(1, 1); } });
    // 3) personagens: cabeça cúbica com rosto pixel art no lugar dos olhos anime
    CHARS.forEach(ch => { const P = ch.userData.P, o = P.o; const hr = o.kid ? 0.15 : 0.14; P.eyes.forEach(E => { E.e.visible = false; }); if (P.mouth) P.mouth.visible = false; if (P.mouthLine) P.mouthLine.visible = false;
      P.head.children.forEach(m => { if (m.isMesh && m.material && m.material.transparent && m.material.opacity < 0.5) m.visible = false; });
      // proporção baixinha e atarracada (cabeça grande, tronco largo, pernas curtas)
      const K = { cab: 1.6, tronco: [1.35, 0.8, 1.3], braco: 1.5, perna: 0.6 }; o.hipK = K.perna;
      P.spine.children.forEach(m => { if (m.isMesh) { m.scale.x *= K.tronco[0]; m.scale.y *= K.tronco[1]; m.scale.z *= K.tronco[2]; m.position.y *= K.tronco[1]; } });
      ['shL', 'shR'].forEach(k => { const sh = P[k]; sh.position.x *= 1.4; sh.position.y *= K.tronco[1]; sh.children.forEach(m => { if (m.isMesh) { m.scale.x *= K.braco; m.scale.z *= K.braco; } }); P[k.replace('sh', 'el')].children.forEach(m => { if (m.isMesh) { m.scale.x *= K.braco; m.scale.z *= K.braco; } }); });
      P.head.parent.position.y *= K.tronco[1]; P.head.scale.setScalar(K.cab);
      ['thL', 'thR'].forEach(k => { const th = P[k]; th.scale.y = K.perna; th.position.x *= 1.3; th.children.forEach(m => { if (m.isMesh) { m.scale.x *= 1.5; m.scale.z *= 1.5; } }); P[k.replace('th', 'kn')].children.forEach(m => { if (m.isMesh) { m.scale.x *= 1.5; m.scale.z *= 1.5; } }); });
      const f = new T3.Mesh(BOX, new T3.MeshBasicMaterial({ map: rostoTex(o.skin, o.iris || '#5a3a1e', o.hairC || '#1c1a28'), toneMapped: false })); f.position.set(0, 0.125, hr * 1.0 + 0.004); f.scale.set(hr * 1.9, hr * 2.0, 0.006); f.userData.naoBloco = true; P.head.add(f); P.rosto = f; });
    // 4) todas as texturas em pixel (sem borrar)
    scene.traverse(m => { if (m.isMesh && m.material && m.material.map && !m.isSprite) { m.material.map.magFilter = T3.NearestFilter; m.material.map.needsUpdate = true; } });
    // 5) cores mais vivas em tudo (cenário, bichos e pessoas)
    { const feito = new Set(Object.values(MH)); world.traverse(m => { if (!m.isMesh || !m.material) return; (Array.isArray(m.material) ? m.material : [m.material]).forEach(mt => { if (!mt.isMeshToonMaterial || mt.map || feito.has(mt)) return; feito.add(mt); mt.color.set(vivo('#' + mt.color.getHexString())); }); }); }
    hemi.intensity *= 1.15; }
  modoBlocos();
  // ===================== MODO VÍDEO (padrão: visual liso dos vídeos — tijolo, telha de barro, ladrilho, sol quente) =====================
  function modoVideo() { if (BLOCOS) return;
    { const NV = TM['#ffffff']; if (NV) vil.traverse(m => { if (m.isMesh && m.material === NV) m.visible = false; }); }
    OUTM.visible = false; GRAD.minFilter = GRAD.magFilter = T3.LinearFilter; GRAD.needsUpdate = true;
    const TX = {
      tijolo: canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#b8946a'; x.fillRect(0, 0, w, h); const R = rng(41); for (let r = 0; r < 8; r++) { const off = (r % 2) * 32; for (let c = -1; c < 5; c++) { const v = R(); x.fillStyle = `hsl(${30 + v * 9},${40 + v * 14}%,${66 + R() * 10}%)`; x.fillRect(c * 64 + off + 2, r * 32 + 2, 60, 28); x.fillStyle = 'rgba(255,255,255,.10)'; x.fillRect(c * 64 + off + 2, r * 32 + 2, 60, 5); } } }),
      base: canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#7a746c'; x.fillRect(0, 0, w, h); const R = rng(45); for (let r = 0; r < 4; r++) { const off = (r % 2) * 48; for (let c = -1; c < 4; c++) { x.fillStyle = `hsl(30,${6 + R() * 8}%,${58 + R() * 12}%)`; x.fillRect(c * 96 + off + 3, r * 64 + 3, 90, 58); } } }),
      telha: canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#8a3418'; x.fillRect(0, 0, w, h); const R = rng(42); for (let r = 0; r < 8; r++) for (let c = -1; c < 9; c++) { const X = c * 32 + (r % 2) * 16, Y = r * 32; const l = 46 + R() * 8; const g = x.createLinearGradient(X, 0, X + 32, 0); g.addColorStop(0, `hsl(14,62%,${l - 14}%)`); g.addColorStop(0.5, `hsl(17,72%,${l + 6}%)`); g.addColorStop(1, `hsl(13,62%,${l - 16}%)`); x.fillStyle = g; x.fillRect(X + 1, Y, 30, 29); } }),
      piso: canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#a2866a'; x.fillRect(0, 0, w, h); const R = rng(43); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { x.fillStyle = `hsl(${32 + R() * 6},${40 + R() * 10}%,${76 + R() * 8}%)`; x.fillRect(c * 64 + 2, r * 64 + 2, 60, 60); x.fillStyle = 'rgba(255,255,255,.14)'; x.fillRect(c * 64 + 2, r * 64 + 2, 60, 7); x.fillStyle = 'rgba(90,60,30,.08)'; x.fillRect(c * 64 + 2, r * 64 + 52, 60, 10); } }),
      grama: canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#6cb84a'; x.fillRect(0, 0, w, h); const R = rng(44); for (let i = 0; i < 1600; i++) { x.fillStyle = `hsla(${92 + R() * 22},${42 + R() * 22}%,${36 + R() * 24}%,.55)`; x.fillRect(R() * w, R() * h, 2, 3 + R() * 5); } }),
    };
    Object.values(TX).forEach(t => { t.wrapS = t.wrapT = T3.RepeatWrapping; });
    const veste = (m, t, rx, ry, cor) => { const mat = m.material.clone(); const tt = t.clone(); tt.needsUpdate = true; tt.repeat.set(rx, ry); mat.map = tt; mat.color.set(cor || '#ffffff'); m.material = mat; };
    world.traverse(m => { if (!m.isMesh || !m.visible || !m.material || !m.material.isMeshToonMaterial || m.material.map) return; const c = '#' + m.material.color.getHexString(); const sc = m.scale;
      if (m.geometry === BOX && CORES_PAREDE.includes(c) && sc.y > 1.5) veste(m, TX.tijolo, Math.max(1, Math.round(sc.x / 1.3)), Math.max(1, Math.round(sc.y / 0.85)));
      else if (m.geometry === BOX && c === '#7a7480') veste(m, TX.base, Math.max(1, Math.round(sc.x / 1.5)), 1);
      else if (m.geometry === ROOF && c === '#4a3a4a') veste(m, TX.telha, 8, 5); });
    { const gm2 = ground.material.clone(); gm2.map = TX.grama.clone(); gm2.map.needsUpdate = true; gm2.map.repeat.set(80, 80); ground.material = gm2; }
    vil.children.forEach(m => { if (m.isMesh && m.geometry && m.geometry.type === 'RingGeometry') m.visible = false; });
    { const t = TX.piso.clone(); t.needsUpdate = true; t.repeat.set(9, 9); const pz = new T3.Mesh(new T3.CircleGeometry(14, 64), new T3.MeshToonMaterial({ color: '#ffffff', map: t, gradientMap: GRAD })); pz.rotation.x = -Math.PI / 2; pz.position.set(0, 0.006, -3); pz.receiveShadow = true; vil.add(pz); }
    neve.material = new T3.MeshBasicMaterial({ color: '#d9822b' }); }
  modoVideo();
    // Guildas online: o servidor valida todas as mudanças e permissões.
  const EMBLEMAS = [['shield','🛡️','Escudo'],['wolf','🐺','Lobo'],['dragon','🐉','Dragão'],['sword','⚔️','Espadas'],['crown','👑','Coroa'],['ice','❄️','Gelo']];
  const guildClient = window.GUILD_SDK.createClient('https://dhqdikdhhxohoyfuaqpm.supabase.co','sb_publishable_NJ3_ude0cMuanBfrkkSvsQ_ZJC8CHTQ',{auth:{storageKey:'aetherion-guild-online'}});
  const guildPanel = document.createElement('section'); guildPanel.id='guilda'; guildPanel.hidden=true; guildPanel.setAttribute('role','dialog'); guildPanel.setAttribute('aria-label','Arthur · Gerente de guilda');
  guildPanel.innerHTML='<div class="guild-box"><header><div><small>BRUMAFRIA</small><h2>Arthur · Gerente de guilda</h2></div><button class="cb" id="guild-close" aria-label="Fechar guilda">✕</button></header><div id="guild-content"></div><p id="guild-message" role="status"></p></div>';
  document.body.appendChild(guildPanel);
  const guildLabel = document.createElement('div'); guildLabel.id='guild-label'; guildLabel.innerHTML='<small></small><b></b>'; document.body.appendChild(guildLabel);
  const guildHud = document.createElement('div'); guildHud.id='guild-hud'; $('pn-nome').closest('.pi').prepend(guildHud);
  const guildArthurLabel = document.createElement('div'); guildArthurLabel.className='guild-npc-label'; guildArthurLabel.textContent='🛡️ Arthur · Gerente de guilda'; document.body.appendChild(guildArthurLabel);
  let guildUser=null, guildState=null, guildBusy=false, guildRecovery=false, guildChannel=null, guildRefreshTimer=null;
  const emblemIcon = id => (EMBLEMAS.find(e=>e[0]===id)||EMBLEMAS[0])[1];
  const guildMessage = (text,error=false)=>{ $('guild-message').textContent=text; $('guild-message').classList.toggle('error',error); };
  function guildNode(tag,text,parent,cls){ const el=document.createElement(tag); if(text!==null) el.textContent=text; if(cls) el.className=cls; if(parent) parent.appendChild(el); return el; }
  function guildButton(parent,text,fn){ const el=guildNode('button',text,parent,'cb'); el.type='button'; el.addEventListener('click',e=>{e.preventDefault();fn();}); return el; }
  function guildInput(parent,label,type,max){const wrap=guildNode('label',label,parent);const el=guildNode('input',null,wrap);el.type=type||'text';if(max)el.maxLength=max;el.required=true;return el;}
  function guildPicker(parent,selected,fn){const row=guildNode('div',null,parent,'guild-emblems');EMBLEMAS.forEach(([id,ic,nm])=>{const b=guildButton(row,ic,()=>fn(id));b.title=nm;b.setAttribute('aria-label',nm);b.setAttribute('aria-pressed',String(id===selected));});return row;}
  async function guildChecked(result){if(result.error)throw result.error;return result.data;}
  async function guildRun(fn,success){if(guildBusy)return;guildBusy=true;guildPanel.querySelectorAll('button,input').forEach(e=>e.disabled=true);guildMessage('Aguarde…');try{await fn();await guildLoad();if(success)guildMessage(success);}catch(e){guildMessage(e.message||'Não foi possível conectar. Tente novamente.',true);}finally{guildBusy=false;guildPanel.querySelectorAll('button,input').forEach(e=>e.disabled=false);}}
  async function guildMutation(action,args,success){await guildRun(async()=>guildChecked(await guildClient.rpc('guild_action',{action,args:args||{}})),success);}
  async function guildLoad(){
    if(!guildUser){guildState=null;guildRender();return;}
    const me=await guildChecked(await guildClient.from('profiles').select('id,name,code').eq('id',guildUser.id).single());
    const membership=await guildChecked(await guildClient.from('guild_members').select('*').eq('user_id',guildUser.id).maybeSingle());
    const invites=await guildChecked(await guildClient.from('guild_invites').select('*,guilds(name,emblem),profiles!guild_invites_target_id_fkey(name)').order('created_at',{ascending:false}));
    let guild=null,members=[];
    if(membership){guild=await guildChecked(await guildClient.from('guilds').select('*').eq('id',membership.guild_id).single());members=await guildChecked(await guildClient.from('guild_members').select('*,profiles(name,code)').eq('guild_id',membership.guild_id).order('joined_at'));}
    guildState={me,membership,guild,members,invites};guildRender();
  }
  function guildRender(){
    const C=$('guild-content');C.replaceChildren();guildHud.textContent=guildState?.guild?emblemIcon(guildState.guild.emblem)+' '+guildState.guild.name:'';
    const name=AR.visual?.nome||'Leonardo';guildLabel.querySelector('b').textContent=name;guildLabel.querySelector('small').textContent=guildHud.textContent;
    if(guildRecovery){guildNode('h3','Nova senha',C);const form=guildNode('form',null,C,'guild-form');const password=guildInput(form,'Nova senha','password');password.minLength=6;guildButton(form,'Salvar senha',()=>guildRun(async()=>{await guildChecked(await guildClient.auth.updateUser({password:password.value}));guildRecovery=false;},'Senha atualizada.'));form.addEventListener('submit',e=>e.preventDefault());return;}
    if(!guildUser){
      guildNode('h3','Conta da guilda',C);guildNode('p','Entre para encontrar seus amigos e receber convites.',C);
      const form=guildNode('form',null,C,'guild-form');const nm=guildInput(form,'Nome do personagem','text',24);nm.value=name;nm.minLength=2;
      const email=guildInput(form,'E-mail','email');email.autocomplete='email';const pass=guildInput(form,'Senha','password');pass.minLength=6;pass.autocomplete='current-password';
      const row=guildNode('div',null,form,'guild-row');
      guildButton(row,'Entrar',()=>{if(!email.validity.valid||!pass.value){guildMessage('Digite e-mail e senha.',true);return;}guildRun(async()=>{const d=await guildChecked(await guildClient.auth.signInWithPassword({email:email.value.trim(),password:pass.value}));guildUser=d.user;},'Bem-vindo!');});
      guildButton(row,'Criar conta',()=>{if(!form.reportValidity())return;guildRun(async()=>{const d=await guildChecked(await guildClient.auth.signUp({email:email.value.trim(),password:pass.value,options:{data:{name:nm.value.trim()},emailRedirectTo:'https://id-preview--03faee9d-b18a-41ee-84af-375cfa1f18fd.lovable.app/jogo/index.html'}}));if(d.session)guildUser=d.user;},'Confira seu e-mail para confirmar a conta; depois entre aqui.');});
      guildButton(form,'Esqueci a senha',()=>{if(!email.value||!email.validity.valid){guildMessage('Digite seu e-mail.',true);return;}guildRun(async()=>guildChecked(await guildClient.auth.resetPasswordForEmail(email.value.trim(),{redirectTo:'https://id-preview--03faee9d-b18a-41ee-84af-375cfa1f18fd.lovable.app/reset-password'})),'Confira seu e-mail para definir uma nova senha.');});form.addEventListener('submit',e=>e.preventDefault());return;
    }
    if(!guildState){guildNode('p','Carregando sua guilda…',C);return;}
    const S=guildState;guildNode('p',S.me.name+' · Código: '+S.me.code,C,'guild-code');
    const profile=guildNode('div',null,C,'guild-row');guildButton(profile,'Copiar código',async()=>{try{await navigator.clipboard.writeText(S.me.code);guildMessage('Código copiado.');}catch{guildMessage('Seu código: '+S.me.code);}});
    guildButton(profile,'Usar nome do personagem',()=>guildRun(async()=>guildChecked(await guildClient.from('profiles').update({name:(AR.visual?.nome||'Leonardo').slice(0,24)}).eq('id',guildUser.id)),'Nome atualizado.'));
    if(!S.guild){
      guildNode('h3','Criar guilda',C);const form=guildNode('form',null,C,'guild-form');const nm=guildInput(form,'Nome da guilda','text',24);nm.minLength=3;let emblem='shield';let picker;picker=guildPicker(form,emblem,id=>{emblem=id;picker.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(EMBLEMAS[i][0]===id)));});
      guildButton(form,'Fundar guilda',()=>{if(form.reportValidity())guildMutation('create',{name:nm.value.trim(),emblem},'Guilda criada!');});form.addEventListener('submit',e=>e.preventDefault());
    }else{
      guildNode('h3',emblemIcon(S.guild.emblem)+' '+S.guild.name,C);guildNode('p',S.members.length+' membro'+(S.members.length===1?'':'s')+' · '+(S.membership.role==='leader'?'Você é o líder':'Você é membro'),C);
      if(S.membership.role==='leader'){
        guildPicker(C,S.guild.emblem,emblem=>guildMutation('emblem',{emblem},'Emblema atualizado.'));
        const form=guildNode('form',null,C,'guild-form');const code=guildInput(form,'Código do jogador','text',10);guildButton(form,'Convidar / adicionar membro',()=>{if(form.reportValidity())guildMutation('invite',{code:code.value.trim()},'Convite enviado. O jogador precisa aceitar.');});form.addEventListener('submit',e=>e.preventDefault());
      }
      guildNode('h3','Membros',C);S.members.forEach(m=>{const row=guildNode('div',null,C,'guild-member');guildNode('span',emblemIcon(S.guild.emblem)+' '+m.profiles.name+' · '+(m.role==='leader'?'Líder':'Membro'),row);if(S.membership.role==='leader'&&m.user_id!==guildUser.id)guildButton(row,'Remover',()=>{if(confirm('Remover '+m.profiles.name+' da guilda?'))guildMutation('remove',{user_id:m.user_id},'Membro removido.');});});
      guildButton(C,'Sair da guilda',()=>{if(confirm(S.membership.role==='leader'?'Sair? A liderança passa para o membro mais antigo; uma guilda vazia é encerrada.':'Sair desta guilda?'))guildMutation('leave',{},'Você saiu da guilda.');});
    }
    guildNode('h3','Convites',C);if(!S.invites.length)guildNode('p','Nenhum convite pendente.',C);
    S.invites.forEach(inv=>{const received=inv.target_id===guildUser.id;const row=guildNode('div',null,C,'guild-member');guildNode('span',received?emblemIcon(inv.guilds.emblem)+' '+inv.guilds.name:'Para '+inv.profiles.name,row);if(received){const accept=guildButton(row,'Aceitar',()=>guildMutation('accept',{id:inv.id},'Você entrou na guilda!'));accept.disabled=!!S.guild;guildButton(row,'Recusar',()=>guildMutation('decline',{id:inv.id},'Convite recusado.'));}else guildButton(row,'Cancelar',()=>guildMutation('cancel',{id:inv.id},'Convite cancelado.'));});
    const footer=guildNode('div',null,C,'guild-row');guildButton(footer,'Atualizar',()=>guildRun(async()=>{},'Guilda atualizada.'));guildButton(footer,'Sair da conta da guilda',()=>guildRun(async()=>{await guildClient.auth.signOut();guildUser=null;guildState=null;},'Conta desconectada.'));
  }
  async function abrirGuilda(){guildPanel.hidden=false;input.x=input.y=0;Object.keys(keys).forEach(k=>delete keys[k]);guildMessage('');await guildRun(async()=>{},'');}
  $('guild-close').addEventListener('click',()=>guildPanel.hidden=true);
  ['keydown','keyup','touchstart','touchmove'].forEach(ev=>guildPanel.addEventListener(ev,e=>e.stopPropagation()));
  guildPanel.addEventListener('keydown',e=>{if(e.key==='Escape')guildPanel.hidden=true;});
  const arthur=makeChar({skin:'#c88a5e',hairStyle:'short',hairC:'#3a2214',top:'#3a7a64',top2:'#e2c27a',pants:'#3a3030',shoe:'#2a1a10',iris:'#2a8a4a',book:true,ph:2.7});
  const arthurNPC={c:arthur,nome:'Arthur · Gerente de guilda',x:-3.5,z:5.7,ry:0,ry0:0,acao:()=>{tocaVoz('art01');abrirGuilda();}};arthur.position.set(arthurNPC.x,0,arthurNPC.z);NPCS.push(arthurNPC);COL.push({t:'c',x:arthurNPC.x,z:arthurNPC.z,r:.45,npc:arthurNPC});
  function guildPosition(el,obj,height){const pos=obj.position.clone();pos.y+=height;pos.project(cam);const visible=pos.z<1&&pos.z>-1&&Math.abs(pos.x)<1&&Math.abs(pos.y)<1&&obj.visible;el.hidden=!visible;if(visible){el.style.left=((pos.x+1)*innerWidth/2)+'px';el.style.top=((1-pos.y)*innerHeight/2)+'px';}}
  function guildFrame(){guildPosition(guildLabel,heroi,2.05);guildLabel.querySelector('b').textContent=AR.visual?.nome||'Leonardo';guildPosition(guildArthurLabel,arthur,2.25);}
  guildClient.auth.onAuthStateChange((event,session)=>{guildUser=session?.user||null;if(event==='PASSWORD_RECOVERY'){guildRecovery=true;guildPanel.hidden=false;}if(event==='SIGNED_OUT')guildState=null;setTimeout(async()=>{try{await guildLoad();}catch(e){guildMessage(e.message,true);}if(guildChannel){guildClient.removeChannel(guildChannel);guildChannel=null;}if(guildUser){guildChannel=guildClient.channel('guild-'+guildUser.id+'-'+Math.random().toString(36).slice(2)).on('postgres_changes',{event:'*',schema:'public',table:'guild_members'},()=>scheduleGuildRefresh()).on('postgres_changes',{event:'*',schema:'public',table:'guild_invites'},()=>scheduleGuildRefresh()).on('postgres_changes',{event:'*',schema:'public',table:'guilds'},()=>scheduleGuildRefresh()).subscribe();}},0);});
  function scheduleGuildRefresh(){clearTimeout(guildRefreshTimer);guildRefreshTimer=setTimeout(()=>guildLoad().catch(e=>guildMessage(e.message,true)),150);}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&guildUser)scheduleGuildRefresh();});
  window.__guild={client:guildClient,open:abrirGuilda,get state(){return guildState;},arthur:arthurNPC};

  // ---------- GUARDA RODRIK: missão dos 50 goblins ----------
  const MG_META = 50; AR.mg = AR.mg || { estado: 0, n: 0, vezes: 0 };
  const guarda = makeChar({ skin: '#d8a07a', hairStyle: 'short', hairC: '#3a2214', top: '#9aa2b2', top2: '#6a7282', pants: '#5a6272', shoe: '#3a3a44', sole: '#2a2a30', iris: '#3a5a8a', s: 1.12, ph: 7.7 });
  { const P = guarda.userData.P, aco = '#b8c0cc', aco2 = '#7a8292', ouro = '#e2c27a';
    part(P.head, SPH, aco, 0, 0.17, -0.01, 0.165, 0.15, 0.165, 0.04); tb(P.head, 0, 0.13, 0.15, 0.035, 0.14, 0.03, aco2); part(P.head, TOR, aco2, 0, 0.13, 0, 0.16, 0.16, 0.3).rotation.x = Math.PI / 2;
    part(P.head, CONE, '#c83a3a', 0, 0.36, -0.03, 0.04, 0.16, 0.1); part(P.head, SPH, '#c83a3a', 0, 0.33, -0.12, 0.035, 0.08, 0.1);
    part(P.spine, CAP, aco, 0, 0.32, 0, 0.39, 0.28, 0.27, 0.04); tb(P.spine, 0, 0.1, 0.125, 0.26, 0.42, 0.03, '#a82a2a'); part(P.spine, SPH, ouro, 0, 0.26, 0.145, 0.05, 0.05, 0.015, 0, true); tb(P.spine, 0, -0.02, 0, 0.4, 0.06, 0.29, '#4a3020'); tb(P.spine, 0, -0.02, 0.15, 0.07, 0.07, 0.02, ouro);
    [P.shL, P.shR].forEach(sh => { part(sh, SPH, aco, 0, -0.02, 0, 0.15, 0.11, 0.15, 0.04); part(sh, SPH, aco2, 0, 0.01, 0, 0.1, 0.06, 0.1); });
    [P.elL, P.elR].forEach(el => part(el, CYL, aco2, 0, -0.18, 0, 0.1, 0.16, 0.1)); [P.knL, P.knR].forEach(kn => part(kn, CYL, aco, 0, -0.22, 0.01, 0.12, 0.26, 0.12));
    const lanca = grp(P.elR, 0, -0.29, 0.04); part(lanca, CYL, '#6a4a2a', 0, 0.45, 0, 0.022, 2.1, 0.022); part(lanca, CONE, aco, 0, 1.6, 0, 0.05, 0.22, 0.02); part(lanca, CYL, ouro, 0, 1.47, 0, 0.035, 0.05, 0.035);
    const esc = grp(P.elL, -0.09, -0.2, 0.02); esc.rotation.z = Math.PI / 2; part(esc, CYL, '#a82a2a', 0, 0, 0, 0.28, 0.04, 0.34, 0.04); part(esc, CYL, aco, 0, -0.025, 0, 0.29, 0.02, 0.35); part(esc, SPH, ouro, 0, -0.04, 0, 0.07, 0.04, 0.07, 0, true); }
  guarda.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const guardaNPC = { c: guarda, nome: 'Guarda Rodrik', x: GTX, z: GTZ, ry: 0, ry0: 0, acao: falaGuarda }; guarda.position.set(GTX, 0, GTZ); guarda.rotation.y = 0; NPCS.push(guardaNPC); COL.push({ t: 'c', x: GTX, z: GTZ, r: 0.45, npc: guardaNPC });
  const marcaTex = {}; function marcaT(t, cor) { return marcaTex[t] || (marcaTex[t] = canvasTex(96, 128, (x, w, h) => { x.font = '900 104px system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 10; x.strokeStyle = '#3a2a10'; x.strokeText(t, w / 2, h / 2 + 6); x.fillStyle = cor; x.fillText(t, w / 2, h / 2 + 6); })); }
  const marcaG = new T3.Sprite(new T3.SpriteMaterial({ map: marcaT('!', '#ffd23c'), transparent: true, depthWrite: false, toneMapped: false })); marcaG.scale.set(0.45, 0.6, 1); world.add(marcaG);
  function atualizaMG() { const el = $('missao-g'); const at = AR.mg.estado === 1 || AR.mg.estado === 2; el.hidden = !at; if (at) el.innerHTML = AR.mg.estado === 2 ? '<b>MISSÃO DO GUARDA</b>✅ Volte ao Guarda Rodrik (portão norte)' : `<b>MISSÃO DO GUARDA</b>👺 Goblins derrotados: ${AR.mg.n} / ${MG_META}`;
    const tem = AR.mg.estado === 0 || AR.mg.estado === 2; marcaG.material.map = marcaT(AR.mg.estado === 2 ? '?' : '!', '#ffd23c'); marcaG.userData.on = tem; }
  function goblinMorto() { if (!AR.mg || AR.mg.estado !== 1) return; AR.mg.n++; if (AR.mg.n >= MG_META) { AR.mg.n = MG_META; AR.mg.estado = 2; setTimeout(() => aviso('✅ 50 goblins derrotados! Volte ao Guarda Rodrik no portão norte.', '#7ad87a'), 1200); } else if (AR.mg.n % 10 === 0) aviso('👺 ' + AR.mg.n + ' / ' + MG_META + ' goblins derrotados', '#ffd23c'); salvaAR(); atualizaMG(); }
  function falaGuarda() { const N = 'Guarda Rodrik', m = AR.mg;
    if (m.estado === 1) { falar({ nome: N, falas: [{ n: N, t: `Ainda tem goblin demais naquela floresta! (faltam ${MG_META - m.n}) Siga a trilha pro leste e volte quando acabar.`, v: 'rod05' }] }); return; }
    if (m.estado === 2) { falar({ nome: N, falas: [{ n: N, t: 'Você derrotou 50 goblins?! Brumafria está bem mais segura agora.', v: 'rod06' }, { n: N, t: 'Aqui está sua recompensa: 300 moedas. O reino agradece, aventureiro!', v: 'rod07' }], fim: () => {
      AR.inv.moedas += 300; m.vezes = (m.vezes || 0) + 1; m.estado = 0; m.n = 0; salvaAR(); atualizaInv(); atualizaMG(); ganhaXp(500, true); numero(heroi.position, '+300 💰', '#ffd23c', 2.4); fx('luz', [heroi.position.x, 0, heroi.position.z], 0.8);
      som('missao_ok', 1, 1); aviso('🏆 Missão completa! +300 moedas e +500 XP', '#ffd23c'); if (m.vezes === 1) setTimeout(() => ganha('missao:goblins', 3, 'missão dos goblins'), 1500); } }); return; }
    falar({ nome: N, falas: [m.vezes ? { n: N, t: 'Os goblins voltaram, aventureiro! Uma floresta inteira virou ninho deles aqui a leste.', v: 'rod02' } : { n: N, t: 'Alto aí! Sou o Rodrik, guarda do portão norte. Uma floresta inteira virou ninho de goblins aqui a leste.', v: 'rod01' }, { n: N, t: 'Eles roubam as galinhas, quebram as cercas e assustam as crianças da vila.', v: 'rod03' }, { n: N, t: 'Derrote 50 goblins na Floresta dos Goblins e eu te pago 300 moedas.', v: 'rod04' }],
      escolhas: () => [{ t: '⚔️ <b>Aceitar missão</b><small>Derrotar 50 goblins na floresta a leste</small>', fn: () => { m.estado = 1; m.n = 0; salvaAR(); atualizaMG(); som('missao', 1, 1); aviso('⚔️ Missão aceita! Siga a trilha pro leste até a Floresta dos Goblins.', '#ffd23c'); } }, { t: 'Agora não', fn: null }] }); }
  function guardaFrame() { marcaG.visible = !!marcaG.userData.on && zona === 'vila' && !dentro; marcaG.position.set(GTX, 2.75 + Math.sin(gT * 3) * 0.1, GTZ); }
  atualizaMG();
  // ---------- TOBIAS, o caçador: missão da Masmorra ----------
  AR.mm = AR.mm || { estado: 0, vezes: 0 };
  const TBX = 4.6, TBZ = 7.2;
  const tobias = makeChar({ skin: '#e0a882', hairStyle: 'short', hairC: '#6a3a1a', top: '#5a6a3a', top2: '#4a3a24', pants: '#4a3a2a', shoe: '#3a2414', sole: '#2a1a10', iris: '#3a5a2a', s: 1.05, ph: 8.8 });
  { const P = tobias.userData.P; part(P.head, CYL, '#5a4024', 0, 0.21, 0, 0.24, 0.03, 0.24); part(P.head, CYL, '#6a4a2a', 0, 0.27, 0, 0.14, 0.12, 0.14); part(P.head, CONE, '#c8402a', 0.1, 0.32, -0.06, 0.02, 0.18, 0.01).rotation.z = -0.6;
    const arco = grp(P.spine, 0.05, 0.35, -0.16); arco.rotation.z = 0.5; part(arco, TOR, '#6a4a2a', 0, 0, 0, 0.36, 0.36, 0.25).scale.set(0.36, 0.36, 0.3); part(arco, CYL, '#e8e0c8', 0.0, 0, 0, 0.006, 0.68, 0.006);
    tb(P.spine, 0, 0.35, 0.13, 0.08, 0.5, 0.02, '#4a3020'); const al = grp(P.spine, -0.12, 0.3, -0.15); part(al, CYL, '#5a4024', 0, 0, 0, 0.07, 0.4, 0.07); for (let i = 0; i < 3; i++) part(al, CONE, '#e8e0c8', (i - 1) * 0.03, 0.25, 0, 0.02, 0.08, 0.005);
    const tch = grp(P.elL, 0, -0.3, 0.05); part(tch, CYL, '#4a3020', 0, 0.1, 0, 0.025, 0.35, 0.025); part(tch, CONE, '#ffb030', 0, 0.33, 0, 0.05, 0.14, 0.05, 0, true); glowSpr(tch, 0, 0.34, 0, 0.7, '#ff9a3a', 0.8); }
  tobias.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const tobiasNPC = { c: tobias, nome: 'Tobias, o Caçador', x: TBX, z: TBZ, ry: Math.PI, ry0: Math.PI, acao: falaTobias }; tobias.position.set(TBX, 0, TBZ); tobias.rotation.y = Math.PI; NPCS.push(tobiasNPC); COL.push({ t: 'c', x: TBX, z: TBZ, r: 0.45, npc: tobiasNPC });
  const marcaMM = new T3.Sprite(new T3.SpriteMaterial({ map: marcaT('!', '#ffd23c'), transparent: true, depthWrite: false, toneMapped: false })); marcaMM.scale.set(0.45, 0.6, 1); world.add(marcaMM);
  function falaTobias() { const N = 'Tobias, o Caçador', m = AR.mm;
    if (m.estado === 1) { falar({ nome: N, falas: [{ n: N, t: 'A caverna fica a oeste. Saia pelo portão oeste e siga a seta!', v: 'tob04' }] }); return; }
    if (m.estado === 2) { falar({ nome: N, falas: [{ n: N, t: 'Você voltou vivo?! E derrotou o dragão? Você é uma lenda, aventureiro!', v: 'tob05' }, { n: N, t: 'Aqui estão suas 500 moedas. A caverna continua lá, se quiser voltar.', v: 'tob06' }], fim: () => {
      AR.inv.moedas += 500; m.vezes = (m.vezes || 0) + 1; m.estado = 0; salvaAR(); atualizaInv(); atualizaMM(); ganhaXp(1500, true); som('missao_ok', 1, 1); numero(heroi.position, '+500 💰', '#ffd23c', 2.4); aviso('🏆 Masmorra completa! +500 moedas e +1500 XP', '#ffd23c'); if (m.vezes === 1) setTimeout(() => ganha('missao:masmorra', 5, 'masmorra'), 1500); } }); return; }
    falar({ nome: N, falas: [{ n: N, t: 'Ei, aventureiro! Sou o Tobias, caçador de Brumafria. Achei uma caverna a oeste da vila... e ela não tem fundo.', v: 'tob01' }, { n: N, t: 'Lá embaixo tem sete salões, e cada um tem um monstro diferente. Aranhas, esqueletos... e coisa pior.', v: 'tob02' }, { n: N, t: 'No último salão mora o Dragão das Profundezas. Derrote ele e eu te pago 500 moedas.', v: 'tob03' }],
      escolhas: () => [{ t: '🗡️ <b>Aceitar missão</b><small>Vencer as 7 fases da Masmorra das Profundezas</small>', fn: () => { m.estado = 1; salvaAR(); atualizaMM(); som('missao', 1, 1); aviso('🗡️ Missão aceita! Siga a seta até a caverna a oeste.', '#ffd23c'); } }, { t: 'Agora não', fn: null }] }); }
  function atualizaMM() { const el = $('mm-hud'); if (!el) return; const m = AR.mm; let txt = '';
    if (zona === 'masmorra') { const k = mmFaseAtual(); txt = k >= MM_N ? '<b>MASMORRA</b>🐉 Todas as fases vencidas! Pegue o portal dourado.' : `<b>MASMORRA · FASE ${k + 1}/7</b>${MM_NOMES[k]} · faltam ${MM.feras.filter(e => e.fase === k && !e.morto).length}`; }
    else if (m.estado === 1) txt = '<b>MISSÃO DO CAÇADOR</b>🗡️ Vença a Masmorra das Profundezas (oeste)'; else if (m.estado === 2) txt = '<b>MISSÃO DO CAÇADOR</b>✅ Volte ao Tobias na praça';
    el.hidden = !txt; el.innerHTML = txt; marcaMM.material.map = marcaT(m.estado === 2 ? '?' : '!', '#ffd23c'); marcaMM.userData.on = m.estado === 0 || m.estado === 2; }
  // seta que guia o jogador
  const SETA = grp(world); { const sh = new T3.Shape(); sh.moveTo(0, 0.55); sh.lineTo(0.32, 0.12); sh.lineTo(0.12, 0.12); sh.lineTo(0.12, -0.35); sh.lineTo(-0.12, -0.35); sh.lineTo(-0.12, 0.12); sh.lineTo(-0.32, 0.12); sh.closePath();
    const m = new T3.Mesh(new T3.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: false }), new T3.MeshBasicMaterial({ color: '#ffd23c', toneMapped: false, transparent: true, opacity: 0.92 })); m.rotation.x = -Math.PI / 2; m.position.y = 0.06; SETA.add(m); glowSpr(SETA, 0, 0.1, 0, 1.4, '#ffd23c', 0.4); SETA.visible = false; }
  function setaAlvo() { const m = AR.mm; if (zona === 'masmorra') { const k = mmFaseAtual(); if (k >= MM_N) return MM.saidaFim; const C = mmCentro(k); return { x: C.x, z: C.z }; }
    if (zona !== 'vila' || dentro) return null; if (m.estado === 1) return { x: MM_ENT.x + 2, z: MM_ENT.z }; if (m.estado === 2) return { x: TBX, z: TBZ }; return null; }
  function setaFrame(p) { const a = setaAlvo(); marcaMM.visible = !!marcaMM.userData.on && zona === 'vila' && !dentro; marcaMM.position.set(TBX, 2.75 + Math.sin(gT * 3) * 0.1, TBZ);
    if (!a || conversa || cenaQ) { SETA.visible = false; return null; } const dx = a.x - p.x, dz = a.z - p.z, d = Math.hypot(dx, dz); if (d < 3.5) { SETA.visible = false; return null; }
    const ang = Math.atan2(dx, dz); SETA.visible = true; SETA.position.set(p.x + Math.sin(ang) * 1.5, p.y, p.z + Math.cos(ang) * 1.5); SETA.rotation.y = ang + Math.PI; SETA.children[0].position.y = 0.06 + Math.abs(Math.sin(gT * 4)) * 0.08; return d; }
  atualizaMM();
  window.__dbg = { entraMasmorra, saiMasmorra, MM, mmFaseAtual, mmMorte, setaFrame, equipaArma, abrirGuilda, arthurNPC, vestePeca, atualizaPecas, PECAS, BLOCOS, modoBatalha, bmLiga, bmDesliga, BMS, ORB, get BM() { return BM; }, get hora() { return hora; }, set hora(v) { hora = v; }, usarHab2: id => classePoder2(id), BUFF, abrirCriar, aplicaClasse, CLASSES, get desp() { return desp; }, set desp(v) { desp = v; }, usarHab: id => classePoder(id), renderer, scene, world, ganhaXp, vesteFantasia, abrirPerfil, fazRetrato, irValdren, Q, heroi, ativo, AR, FERAS, golem, atacar, get vida() { return vida; }, set vida(v) { vida = v; }, abrirLoja, usarPoder: id => usarPoder(PW[id]), acao: () => acao(), get alvo() { return alvo; } };
  // ---------- laço do jogo ----------
  let vy = 0, noChao = true, facing = 0, vel = 0, gT = 0, last = performance.now();
  const ANDAR = 3.0, CORRER = 6.5, GRAV = 22, PULO = 7.6; const tmp = new T3.Vector3();
  heroi.position.set(0, 0, 4.2); heroi.rotation.y = Math.PI; facing = Math.PI;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; gT += dt;
    ceu(dt); const noite = modo === 'noite';
    let ix = input.x, iy = input.y; if (keys.KeyA || keys.ArrowLeft) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1; if (keys.KeyW || keys.ArrowUp) iy -= 1; if (keys.KeyS || keys.ArrowDown) iy += 1;
    if (!guildPanel.hidden || conversa || cenaQ || !$('fim').hidden || Q.naCarroca || desmaiado) { ix = 0; iy = 0; }
    const mag = Math.min(1, Math.hypot(ix, iy)); const correndo = input.run || keys.ShiftLeft || mag > 0.92;
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw); let mx = fx * -iy + -fz * ix, mz = fz * -iy + fx * ix; const ml = Math.hypot(mx, mz);
    vel = lerp(vel, mag > 0.08 ? (correndo ? CORRER : ANDAR) * (ativo.vento ? 1.5 + nivelHab('vento') * 0.1 : 1) * ((CLASSES && CLASSES[AR.classe]) ? CLASSES[AR.classe].vel : 1) * (BM && BM.vel ? BM.vel : 1) * mag : 0, clamp(dt * 8));
    if (ml > 0.001 && mag > 0.08) { mx /= ml; mz /= ml; const want = Math.atan2(mx, mz); let d = want - facing; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; facing += d * clamp(dt * 12); }
    const p = heroi.position; const dash = dashT > 0 ? dashVel : 0; dashT -= dt; p.x += Math.sin(facing) * vel * dt + Math.sin(dashAng) * dash * dt; p.z += Math.cos(facing) * vel * dt + Math.cos(dashAng) * dash * dt;
    if (zona === 'valdren') { colide(p, COLV); const rx = p.x - VX, r = Math.hypot(rx, p.z); if (r > 44) { p.x = VX + rx * 44 / r; p.z *= 44 / r; } } else if (zona === 'masmorra') { mmLimita(p); } else if (dentro) { p.x = clamp(p.x, IX - 4.6, IX + 4.6); p.z = clamp(p.z, -4.6, 4.6); colide(p, COLC); } else { colide(p, COL); const r = Math.hypot(p.x, p.z + 6); if (r > 95) { p.x *= 95 / r; p.z = (p.z + 6) * 95 / r - 6; } }
    if (input.jump && noChao && !conversa) { vy = saltoPronto ? PULO * 1.75 : PULO; som('pulo', 0.55); if (saltoPronto) { burstT = 0; burstP = [p.x, p.y, p.z]; } saltoPronto = false; noChao = false; } input.jump = false;
    if (!noChao) { vy -= GRAV * dt; if (ativo.planar && vy < -1.6) vy = -1.6; p.y += vy * dt; if (p.y <= 0) { p.y = 0; if (vy < -6) som('aterrissa', 0.45); vy = 0; noChao = true; if (esmaga) { esmaga = false; aterrissa(); } } }
    heroi.rotation.y = facing;
    if (!noChao) pose(heroi, gT, { mood: 'smile', arms: { shL: [-2.6, 0, -0.3], shR: [-2.6, 0, 0.3], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] }, legs: { thL: -0.9, knL: 1.4, thR: -0.3, knR: 0.6 } });
    else if (vel > 0.4) pose(heroi, gT, vel > 4.2 ? { run: true, mood: 'smile' } : { walk: true, mood: 'neutral' });
    else pose(heroi, gT, { mood: conversa ? 'smile' : 'neutral' });
    armaPose(); armaduraFrame(); equipFrame(dt);
    sombra.position.set(p.x, 0.012, p.z); sombra.material.opacity = 0.2 * (1 - clamp(p.y / 4));
    // personagens: olham pro herói quando ele chega perto
    alvo = null; let melhor = 2.6;
    NPCS.forEach(n => { const c = n.c; c.visible = !dentro && zona === 'vila'; if (!c.visible) return; const dx = p.x - n.x, dz = p.z - n.z, d = Math.hypot(dx, dz);
      const want = d < 5 ? Math.atan2(dx, dz) : n.ry0; let a = want - c.rotation.y; while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; c.rotation.y += a * clamp(dt * 4);
      const falando = conversa && conversa.quem === n && voz && !voz.paused && !voz.ended; const o = { mood: falando ? (n.deusa ? 'smile' : 'smile') : 'neutral', talk: falando, look: [0, d < 5 ? -0.1 : 0] };
      if (n.deusa) { o.arms = { shL: [-0.35, 0, -0.15], elL: [-0.55, 0, 0] }; c.position.y = 0.25 + Math.sin(gT * 1.6) * 0.12; elyAura.position.set(n.x, 1.6 + c.position.y, n.z); elyAura.visible = true; const P = c.userData.P; P.staff.rotation.x = -(P.shL.rotation.x + P.elL.rotation.x); }
      pose(c, gT, o); if (n.deusa) { const P = c.userData.P; P.staff.rotation.x = -(P.shL.rotation.x + P.elL.rotation.x); P.staff.rotation.z = -(P.shL.rotation.z + P.elL.rotation.z); }
      if (d < melhor) { melhor = d; alvo = n; } });
    elyAura.visible = !dentro && zona === 'vila'; heroi.visible = true; const alV = valdrenFrame(dt, p); if (zona === 'valdren') alvo = alV; $('tit').textContent = (zona === 'valdren' ? 'VALDREN' : zona === 'masmorra' ? 'MASMORRA' : 'BRUMAFRIA') + ' · ' + (modo === 'noite' ? '🌙 ' : '☀️ ') + String(Math.floor(hora)).padStart(2, '0') + ':' + String(Math.floor((hora % 1) * 6) * 10).padStart(2, '0');
    if (dentro) { OBJS.forEach(o => { const d = Math.hypot(p.x - o.x, p.z - o.z); if (d < 1.9 && d < melhor) { melhor = d; alvo = o; } }); if (Math.hypot(p.x - (IX - 1), p.z - 4.4) < 1.3) alvo = { tipo: 'sair' }; }
    else if (zona === 'vila') { const dp = casaFamilia.localToWorld(new T3.Vector3(casaFamilia.userData.door[0], 0, casaFamilia.userData.door[1] - 0.6)); if (Math.hypot(p.x - dp.x, p.z - dp.z) < 1.3) alvo = { tipo: 'entrar' }; }
    { const alM = mmFrame(dt, p); if (alM) alvo = alM; if (zona === 'vila' && !dentro && Math.hypot(p.x - (MM_ENT.x + 1.5), p.z - MM_ENT.z) < 3.2) alvo = { rot: 'ENTRAR', acao: entraMasmorra }; setaFrame(p); }
    if (!conversa) { const alC = combateAlvo(p); if (alC) alvo = alC; }
    const btn = $('acao'); btn.hidden = !alvo || !!conversa || !!cenaQ; if (alvo) btn.textContent = alvo.rot || (alvo.tipo === 'entrar' ? 'ENTRAR' : alvo.tipo === 'sair' ? 'SAIR' : alvo.falas && !alvo.c ? 'VER' : 'FALAR');
    // ambiente
    { const cx = zona === 'valdren' ? VX : 0, an = (hora - 6) / 12 * Math.PI; sunBall.position.set(cx + Math.cos(an) * 110, Math.sin(an) * 70 + 4, -100); moon.position.set(cx - Math.cos(an) * 110, -Math.sin(an) * 70 + 4, -100); sunBall.visible = !dentro && zona !== 'masmorra' && sunBall.position.y > -4; moon.visible = !dentro && zona !== 'masmorra' && moon.position.y > -4; WIN.forEach(w => w.material.opacity = 0.15 + noiteF * 0.65); $('ciclo').textContent = modo === 'dia' ? '☾' : '☀'; }
    nuvens.forEach((c, i) => { c.visible = !dentro && zona !== 'masmorra'; c.position.x += dt * (0.5 + (i % 3) * 0.2); if (c.position.x > 140) c.position.x = -140; });
    neve.visible = !BLOCOS && !dentro && zona === 'vila'; if (neve.visible) neve.userData.place((i, d) => { if (i % 3) return false; const R = rng(i + 91); const k = ((gT * (0.08 + R() * 0.06) + R()) % 1); d.position.set(p.x + (R() - .5) * 30 + Math.sin(gT + i) * 0.4, 12 - k * 12, p.z + (R() - .5) * 30); d.scale.setScalar(d.position.distanceTo(cam.position) < 2.5 ? 0.0001 : 0.03 + R() * 0.04); });
    fumaca.visible = !dentro && zona === 'vila'; if (fumaca.visible) fumaca.userData.place((i, d) => { const c = CHIM[i % CHIM.length]; const R = rng(i + 5); const k = ((gT * 0.12 + R()) % 1); c[0].updateMatrixWorld(); v3.set(c[1], c[2], c[3]); c[0].localToWorld(v3); d.position.set(v3.x + k * 1.6 + Math.sin(gT + i) * 0.2, v3.y + k * 4, v3.z); d.scale.setScalar(0.25 + k * 0.9); });
    fogoL.intensity = dentro ? 3.2 + Math.sin(gT * 13) * 0.4 : 0; chamas.forEach((f, i) => f.scale.y = 0.5 * (1 + Math.sin(gT * 15 + i * 2) * 0.2));
    poderesFrame(dt, p); combateFrame(dt, p); classeFrame(dt, p); habsFrame(dt); bmFrame(dt, p); perfilFrame(dt); criarFrame(dt); miniT += dt; if (miniT > 0.08) { miniT = 0; desenhaMini(p); }
    // câmera
    if (camId === null && vel > 0.5 && !dentro) { let d = (facing + Math.PI) - camYaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; camYaw += d * clamp(dt * 0.9); }
    const cd = dentro ? Math.min(camDist, 3.8) : camDist; const cp = dentro ? Math.max(camPitch, 0.45) : camPitch;
    let cx = p.x + Math.sin(camYaw) * Math.cos(cp) * cd, cz = p.z + Math.cos(camYaw) * Math.cos(cp) * cd; const cy = p.y + 1.0 + Math.sin(cp) * cd;
    if (dentro) { cx = clamp(cx, IX - 4.7, IX + 4.7); cz = clamp(cz, -4.7, 4.7); }
    if (cam.position.distanceTo(tmp.set(cx, cy, cz)) > 30) cam.position.copy(tmp); else cam.position.lerp(tmp, clamp(dt * 10));
    if (tremor > 0) { tremor -= dt; cam.position.x += (Math.random() - .5) * tremor; cam.position.y += (Math.random() - .5) * tremor; }
    cam.lookAt(p.x, p.y + 0.95, p.z);
    sun.position.set(p.x + 12, 30, p.z + 10); sun.target.position.set(p.x, 0, p.z); sun.target.updateMatrixWorld();
    guildFrame(); guardaFrame(); ambienteFrame(dt, p); renderer.render(scene, cam); requestAnimationFrame(loop);
  }
  cam.position.set(0, 2.6, 9.6); requestAnimationFrame(loop);
  mostrarLugar('Vila de Brumafria');
  setTimeout(() => $('dica').classList.add('some'), 7000);
})();

