  // ===================== JOGO — Vila de Brumafria (do vídeo O Último Conhecimento) =====================
  cam.near = 0.1; cam.far = 800; cam.updateProjectionMatrix();
  const ROOF = new T3.ConeGeometry(1, 1, 4);
  const v3 = new T3.Vector3();
  function headOf(c) { c.updateMatrixWorld(true); c.userData.P.head.getWorldPosition(v3); return [v3.x, v3.y + 0.13 * c.scale.y, v3.z]; }

  // ---------- céu: dia e noite ----------
  const skyC = document.createElement('canvas'); skyC.width = 4; skyC.height = 256; const skyX = skyC.getContext('2d'); const skyT = new T3.CanvasTexture(skyC); skyT.colorSpace = T3.SRGBColorSpace;
  const MODES = {
    dia: { sky: ['#6a9ae0', '#eef3fa'], hemi: 1.25, sun: 2.0, sunC: '#fff4e4', fog: '#dde6f2', fogN: 30, fogF: 120, ground: '#c8d0e0', rim: '#ffd0a0' },
    noite: { sky: ['#04081c', '#1c2a52'], hemi: 0.6, sun: 0.9, sunC: '#8aa8ff', fog: '#121a36', fogN: 18, fogF: 90, ground: '#3a4a6a', rim: '#5a7aff' },
    casa: { sky: ['#140c08', '#140c08'], hemi: 0.75, sun: 0.25, sunC: '#ffb070', fog: '#140c08', fogN: 20, fogF: 60, ground: '#3a2418', rim: '#ff8a3a' } };
  scene.background = skyT; scene.fog = new T3.Fog('#ffffff', 30, 120);
  let modo = 'dia';
  function setMode(k) { const M = MODES[k]; const g = skyX.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, M.sky[0]); g.addColorStop(1, M.sky[1]); skyX.fillStyle = g; skyX.fillRect(0, 0, 4, 256); skyT.needsUpdate = true;
    hemi.color.set('#ffffff'); hemi.groundColor.set(M.ground); hemi.intensity = M.hemi; sun.color.set(M.sunC); sun.intensity = M.sun; rim.color.set(M.rim); rim.intensity = 0.5; scene.fog.color.set(M.fog); scene.fog.near = M.fogN; scene.fog.far = M.fogF; }

  // ---------- VILA DE BRUMAFRIA ----------
  const vil = grp(world, 0, 0, 0);
  const snowTex = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#e8eef8'; x.fillRect(0, 0, w, h); const R = rng(3); for (let i = 0; i < 500; i++) { x.fillStyle = ['#dfe6f2', '#f4f8ff', '#d6deec'][i % 3]; x.beginPath(); x.arc(R() * w, R() * h, 2 + R() * 6, 0, 7); x.fill(); } });
  snowTex.wrapS = snowTex.wrapT = T3.RepeatWrapping; snowTex.repeat.set(50, 50);
  const ground = new T3.Mesh(new T3.PlaneGeometry(400, 400), new T3.MeshToonMaterial({ color: '#ffffff', map: snowTex, gradientMap: GRAD })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; vil.add(ground);
  { const path = new T3.Mesh(new T3.RingGeometry(3.2, 5.2, 48), new T3.MeshToonMaterial({ color: '#cbbfae', gradientMap: GRAD })); path.rotation.x = -Math.PI / 2; path.position.y = 0.01; path.receiveShadow = true; vil.add(path); }
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
  { const R = rng(801); for (let i = 0; i < 70; i++) { const a = R() * Math.PI * 2, r = 22 + R() * 34; const x = Math.cos(a) * r, z = Math.sin(a) * r - 6; if (Math.hypot(x, z + 50) < 14 || Math.hypot(x + 14, z - 11) < 4) continue; const g = grp(vil, x, 0, z); const s = 0.8 + R() * 0.8; g.scale.setScalar(s);
      tb(g, 0, 0.5, 0, 0.35, 1, 0.35, '#5a3a24'); for (let j = 0; j < 3; j++) { part(g, CONE, '#2a5a3a', 0, 1.6 + j * 1.0, 0, 1.4 - j * 0.35, 1.6, 1.4 - j * 0.35); part(g, CONE, '#ffffff', 0, 2.1 + j * 1.0, 0, 0.6 - j * 0.15, 0.6, 0.6 - j * 0.15); } COL.push({ t: 'c', x, z, r: 0.45 * s }); } }
  // poço no meio da vila
  { const w = grp(vil, 0, 0, 0); part(w, CYL, '#8a8a94', 0, 0.45, 0, 0.9, 0.9, 0.9); part(w, CYL, '#1a2a4a', 0, 0.91, 0, 0.7, 0.02, 0.7); [-1, 1].forEach(s => tb(w, s * 0.8, 1.6, 0, 0.12, 1.6, 0.12, '#5a3a24')); part(w, ROOF, '#4a3a4a', 0, 2.7, 0, 1.2, 0.8, 1.2).rotation.y = Math.PI / 4; tb(w, 0, 2.2, 0, 1.7, 0.08, 0.08, '#5a3a24'); part(w, CYL, '#7a5a3a', 0.2, 1.7, 0, 0.12, 0.25, 0.12); COL.push({ t: 'c', x: 0, z: 0, r: 1.0 }); }
  // cerca, lenha e barris pra dar vida
  { for (let i = -6; i <= 6; i++) { tb(vil, i * 1.1, 0.45, 9, 0.12, 0.9, 0.12, '#6a4a2a'); } tb(vil, 0, 0.7, 9, 14.4, 0.08, 0.06, '#6a4a2a'); tb(vil, 0, 0.35, 9, 14.4, 0.08, 0.06, '#6a4a2a'); COL.push({ t: 'b', x: 0, z: 9, ry: 0, hw: 7.3, hd: 0.15 });
    [[3.2, -5.4], [-3.4, -5.6]].forEach(([x, z]) => { const g = grp(vil, x, 0, z); for (let k = 0; k < 5; k++) { const l = part(g, CYL, '#8a5a3a', 0, 0.12 + Math.floor(k / 3) * 0.22, (k % 3 - 1) * 0.22 + (k > 2 ? 0.11 : 0), 0.11, 0.9, 0.11); l.rotation.z = Math.PI / 2; } part(g, CYL, '#ffffff', 0, 0.48, 0, 0.5, 0.06, 0.4); COL.push({ t: 'c', x, z, r: 0.55 }); });
    [[8.5, -1.5], [-8.6, -1.2]].forEach(([x, z]) => { part(vil, CYL, '#7a4a2a', x, 0.45, z, 0.35, 0.9, 0.35); part(vil, TOR, '#4a4a54', x, 0.7, z, 0.36, 0.36, 0.3).rotation.x = Math.PI / 2; COL.push({ t: 'c', x, z, r: 0.45 }); }); }
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
  const tapBtn = (el, fn) => { el.addEventListener('touchstart', e => { fn(); e.preventDefault(); e.stopPropagation(); }, { passive: false }); el.addEventListener('mousedown', e => { fn(); e.stopPropagation(); }); };
  tapBtn($('pular'), () => { input.jump = true; });
  tapBtn($('correr'), () => { input.run = !input.run; $('correr').classList.toggle('on', input.run); });
  tapBtn($('acao'), () => acao());
  tapBtn($('ciclo'), () => { if (dentro || (zona === 'valdren' && Q.passo >= 4 && Q.passo < 5)) return; modo = modo === 'dia' ? 'noite' : 'dia'; $('ciclo').textContent = modo === 'dia' ? '☾' : '☀'; });
  tapBtn($('fala'), () => proximaFala()); tapBtn($('cena'), () => proximaCena());

  // ---------- conversa e portas ----------
  let dentro = false, alvo = null, conversa = null;
  function acao() { if (cenaQ) { proximaCena(); return; } if (conversa) { proximaFala(); return; } if (!alvo) return; if (alvo.acao) { alvo.acao(); return; }
    if (alvo.tipo === 'entrar') { dentro = true; heroi.position.set(IX - 1, 0, 3.6); facing = Math.PI; camYaw = 0; mostrarLugar('Casa da família'); return; }
    if (alvo.tipo === 'sair') { dentro = false; const d = casaFamilia.localToWorld(new T3.Vector3(casaFamilia.userData.door[0], 0, casaFamilia.userData.door[1] + 0.4)); heroi.position.set(d.x, 0, d.z); facing = 0; camYaw = Math.PI; mostrarLugar('Vila de Brumafria'); return; }
    falar(alvo); }
  let voz = null; function calaVoz() { if (voz) { voz.pause(); voz = null; } }
  function tocaVoz(id) { calaVoz(); if (!id) return; voz = new Audio('vozes/' + id + '.mp3'); voz.play().catch(() => {}); }
  function falaAtual() { const q = conversa.quem, f = q.falas[conversa.i]; return typeof f === 'string' ? { t: f, n: q.nome, v: q.vozes && q.vozes[conversa.i] } : { t: f.t, n: f.n || q.nome, v: f.v }; }
  function mostrarFala() { const q = conversa.quem, f = falaAtual(); tocaVoz(f.v); $('fala-nome').textContent = f.n; $('fala-txt').textContent = f.t; $('fala').hidden = false; const ult = conversa.i >= q.falas.length - 1; const esc = ult && q.escolhas && q.escolhas();
    const box = $('fala-esc'); box.innerHTML = ''; box.hidden = !esc; $('fala-mais').textContent = esc ? 'escolha:' : ult ? 'toque pra fechar ✕' : 'toque pra continuar ▸';
    if (esc) esc.forEach(e => { const b = document.createElement('button'); b.className = 'esc'; b.innerHTML = e.t; tapBtn(b, () => { conversa = null; $('fala').hidden = true; calaVoz(); if (e.fn) setTimeout(e.fn, 50); }); box.appendChild(b); }); }
  function proximaFala() { if (!conversa) return; const q = conversa.quem; if (conversa.i >= q.falas.length - 1 && q.escolhas && q.escolhas()) return; conversa.i++; if (conversa.i >= q.falas.length) { conversa = null; $('fala').hidden = true; calaVoz(); if (q.fim) q.fim(); } else mostrarFala(); }
  function falar(quem) { if (quem && quem.nome && typeof ganha === 'function') setTimeout(() => ganha('npc:' + quem.nome, 1, 'conheceu ' + quem.nome), 50); conversa = { quem, i: 0 }; mostrarFala(); }
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
  let mana = 100; const MANA_MAX = 100;
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
  let AR = { pts: 3, tem: ['sabao', 'salto'], barra: ['memoria', 'luz', 'sabao', 'salto', null, null, null, null], ganhos: [] };
  try { const g = JSON.parse(localStorage.getItem('aetherion-arvore') || 'null'); if (g && g.barra && g.barra.length === NSLOTS) AR = Object.assign(AR, g); } catch (e) {}
  AR.barra[0] = 'memoria'; AR.barra[1] = 'luz';
  function salvaAR() { try { localStorage.setItem('aetherion-arvore', JSON.stringify(AR)); } catch (e) {} }
  function ganha(chave, n, msg) { if (AR.ganhos.includes(chave)) return; AR.ganhos.push(chave); AR.pts += n; salvaAR(); atualizaPts(); aviso('🌳 +' + n + ' ponto' + (n > 1 ? 's' : '') + ' de habilidade' + (msg ? ' · ' + msg : '') + '!', '#7ad87a'); }
  function atualizaPts() { const b = $('arv-pts'); b.textContent = AR.pts; b.hidden = AR.pts <= 0; }
  const ativo = {}; let saltoPronto = false;
  const barra = $('poderes'); const SLOTS = [];
  for (let i = 0; i < NSLOTS; i++) { const b = document.createElement('button'); b.className = 'slot' + (i < 2 ? ' fixo' : ''); tapBtn(b, () => { const id = AR.barra[i]; if (id) usarPoder(PW[id]); else abrirArvore(); }); barra.appendChild(b); SLOTS.push(b); }
  function montaBarra() { PODERES.forEach(pw => pw.el = null);
    SLOTS.forEach((b, i) => { const pw = AR.barra[i] && PW[AR.barra[i]]; b.classList.toggle('vazio', !pw); b.classList.remove('on', 'falta');
      if (pw) { pw.el = b; b.innerHTML = `<span class="ic">${pw.icone}</span><span class="nm">${pw.nome}</span><span class="tc">${i + 1}</span>${i < 2 ? '<span class="cad">🔒</span>' : ''}`; b.classList.toggle('on', pw.tipo === 'liga' && !!ativo[pw.id]); }
      else b.innerHTML = `<span class="ic">＋</span><span class="tc">${i + 1}</span>`; }); }
  function marca(pw, cls, on) { if (pw.el) pw.el.classList.toggle(cls, on); }
  window.addEventListener('keydown', e => { const n = parseInt(e.key); if (n >= 1 && n <= NSLOTS) { const id = AR.barra[n - 1]; if (id) usarPoder(PW[id]); } if (e.code === 'KeyT') abrirArvore(); });
  let avisoT = null; function aviso(t, cor) { const el = $('aviso'); el.textContent = t; el.style.borderColor = cor || '#5ab8ff'; el.classList.add('on'); clearTimeout(avisoT); avisoT = setTimeout(() => el.classList.remove('on'), 3200); }
  // efeitos dos poderes novos
  let tremor = 0, dashT = 0;
  function frente(d) { const p = heroi.position; return [p.x + Math.sin(facing) * d, p.y, p.z + Math.cos(facing) * d]; }
  function usarPoder(pw) { if (conversa || cenaQ) return;
    if (pw.tipo === 'liga') { ativo[pw.id] = !ativo[pw.id]; if (ativo[pw.id] && pw.custo && mana < 5) { ativo[pw.id] = false; aviso('Sem mana! Espera ela voltar.', '#ff6a6a'); return; } marca(pw, 'on', !!ativo[pw.id]); if (ativo[pw.id]) aviso(pw.desc, pw.id === 'memoria' ? '#ffd23c' : '#5ab8ff'); else if (pw.id !== 'memoria') aviso(pw.nome + ' desligado.', '#8a9aba'); return; }
    if (mana < pw.custo) { aviso('Sem mana! Precisa de ' + pw.custo + '.', '#ff6a6a'); marca(pw, 'erro', true); setTimeout(() => marca(pw, 'erro', false), 400); return; }
    mana -= pw.custo; marca(pw, 'on', true); setTimeout(() => marca(pw, 'on', false), 500);
    const p = heroi.position;
    if (pw.id === 'sabao') { bolhasT = 0; aviso('Sabão: gordura + cinza (soda). Mãos limpas = menos doença na vila!', '#9ad8ff'); }
    if (pw.id === 'salto') { saltoPronto = true; if (noChao) input.jump = true; aviso(pw.desc, '#5ab8ff'); }
    if (pw.id === 'ferver') { fx('vapor', [p.x, p.y, p.z], 2.6); aviso('Água a 100 °C: o vapor sobe e as bactérias morrem. É assim que se vence a cólera.', '#ffb04a'); }
    if (pw.id === 'remedio') { fx('cura', [p.x, p.y, p.z], 2); let n = 0; if (vida < VIDA_MAX && zona !== 'valdren') { aviso('Soro caseiro: +40 de vida.', '#7ad87a'); }
      if (zona === 'valdren' && typeof doentes !== 'undefined') doentes.forEach(c => { if (c.visible && !c.userData.curado && Math.hypot(c.userData.pos[0] - p.x, c.userData.pos[1] - p.z) < 4.5) { c.userData.curado = true; n++; fx('cura', [c.userData.pos[0], 0, c.userData.pos[1]], 2); } });
      aviso(n ? (n === 1 ? 'Um doente se levantou! Soro: água fervida, sal e açúcar.' : n + ' doentes se levantaram!') : 'Soro pronto: água fervida + 1 colher de sal + 8 de açúcar. Chegue perto de um doente.', '#7ad87a'); }
    if (pw.id === 'polvora') { const f = frente(3.2); fx('fogo', f, 1.6); fx('fumo', f, 2.4); tremor = 0.6; flash('rgba(255,170,60,.55)'); aviso('BUM! Salitre + carvão + enxofre. Isso muda as guerras deste mundo...', '#ff8a3a'); }
    if (pw.id === 'dardo') { const d = glowSpr(world, p.x, p.y + 1.3, p.z, 0.9, '#bfe8ff', 1); dardos.push({ s: d, t: 0, dx: Math.sin(facing), dz: Math.cos(facing) }); }
    if (pw.id === 'clarao') { flash('rgba(255,255,255,.95)'); fx('luz', [p.x, p.y, p.z], 1.2); tremor = 0.25; aviso('CLARÃO! Quem estava olhando ficou vendo estrelas.', '#fff3a0'); }
    if (pw.id === 'impulso') { dashT = 0.28; fx('vento', [p.x, p.y, p.z], 0.8); }
    combatePoder(pw.id); }
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
  function dardosFrame(dt) { for (let i = dardos.length - 1; i >= 0; i--) { const d = dardos[i]; d.t += dt; d.s.position.x += d.dx * 24 * dt; d.s.position.z += d.dz * 24 * dt; d.s.material.opacity = 1 - d.t; const ef = acertaFera(d.s.position, 0.6); if (ef) { dano(ef, 25, 'luz'); d.t = 1; } if (d.t > 0.9) { fx('luz', [d.s.position.x, d.s.position.y - 0.8, d.s.position.z], 0.5); world.remove(d.s); dardos.splice(i, 1); } } }
  // escudo e vento
  const escudo = new T3.Mesh(new T3.SphereGeometry(1.15, 24, 16), new T3.MeshBasicMaterial({ color: '#7ac8ff', transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending })); escudo.visible = false; world.add(escudo);
  const rastro = particles(world, 30, '#e8f6ff', 0.04); rastro.visible = false;

  // ---------- ÁRVORE DE HABILIDADES ----------
  let selArv = null;
  function prereq(pw) { if (!pw.ramo || pw.nivel <= 1) return true; return PODERES.some(o => o.ramo === pw.ramo && o.nivel === pw.nivel - 1 && AR.tem.includes(o.id)); }
  function abrirArvore() { if (conversa || cenaQ) return; selArv = selArv || null; desenhaArvore(); $('arvore').hidden = false; }
  function desenhaArvore() { const col = $('arv-ramos'); col.innerHTML = ''; $('arv-pts-txt').textContent = AR.pts + (AR.pts === 1 ? ' ponto' : ' pontos');
    RAMOS.forEach(r => { const c = document.createElement('div'); c.className = 'ramo'; c.style.setProperty('--rc', r.cor); c.innerHTML = `<div class="rt">${r.icone} ${r.nome}</div>`;
      PODERES.filter(pw => pw.ramo === r.id).sort((a, b) => a.nivel - b.nivel).forEach((pw, j) => { if (j) { const l = document.createElement('div'); l.className = 'liga' + (AR.tem.includes(pw.id) ? ' ok' : ''); c.appendChild(l); }
        const tem = AR.tem.includes(pw.id), pode = !tem && prereq(pw) && AR.pts >= pw.preco, trava = !tem && !prereq(pw); const naBarra = AR.barra.indexOf(pw.id);
        const b = document.createElement('button'); b.className = 'no' + (tem ? ' tem' : pode ? ' pode' : trava ? ' trava' : ' caro') + (selArv === pw.id ? ' sel' : '');
        b.innerHTML = `<span class="ic">${trava ? '🔒' : pw.icone}</span><span class="nm">${pw.nome}</span><span class="pr">${tem ? (naBarra >= 0 ? 'Slot ' + (naBarra + 1) : '✔') : pw.preco + ' pt'}</span>`;
        tapBtn(b, () => { selArv = pw.id; desenhaArvore(); }); c.appendChild(b); });
      col.appendChild(c); });
    // painel do detalhe
    const det = $('arv-det'); const pw = selArv && PW[selArv]; if (!pw) { det.innerHTML = '<p class="vz">Toque numa habilidade pra ver o que ela faz. Ganhe pontos derrotando bichos, falando com as pessoas, lendo as dicas da 🧠 Memória e avançando nas missões.</p>'; return; }
    const tem = AR.tem.includes(pw.id); const custo = pw.tipo === 'liga' ? pw.custo + ' mana/s' : pw.custo + ' mana';
    det.innerHTML = `<div class="dt"><span class="ic">${pw.icone}</span><div><b>${pw.nome}</b><small>${pw.tipo === 'liga' ? 'Liga/desliga' : 'Uso rápido'} · ${custo}</small></div></div><p>${pw.desc}</p><div id="arv-acoes"></div>`;
    const ac = $('arv-acoes');
    if (!tem) { const b = document.createElement('button'); b.className = 'ab'; const ok = prereq(pw) && AR.pts >= pw.preco; b.disabled = !ok; b.textContent = !prereq(pw) ? '🔒 Aprenda a anterior primeiro' : AR.pts < pw.preco ? `Faltam ${pw.preco - AR.pts} ponto(s)` : `Aprender (${pw.preco} pt)`;
      if (ok) tapBtn(b, () => { AR.pts -= pw.preco; AR.tem.push(pw.id); const v = AR.barra.indexOf(null, 2); if (v >= 2) AR.barra[v] = pw.id; salvaAR(); atualizaPts(); montaBarra(); aviso('Nova habilidade: ' + pw.icone + ' ' + pw.nome + (v >= 2 ? ' (slot ' + (v + 1) + ')' : ''), '#7ad87a'); desenhaArvore(); });
      ac.appendChild(b); return; }
    const t = document.createElement('div'); t.className = 'qs'; t.textContent = 'Colocar no slot (troca o que estiver lá):'; ac.appendChild(t);
    const row = document.createElement('div'); row.className = 'slotsel';
    for (let i = 2; i < NSLOTS; i++) { const o = AR.barra[i] && PW[AR.barra[i]]; const b = document.createElement('button'); b.className = 'ss' + (AR.barra[i] === pw.id ? ' aqui' : ''); b.innerHTML = `<small>${i + 1}</small>${o ? o.icone : '＋'}`;
      tapBtn(b, () => { if (AR.barra[i] === pw.id) return; const j = AR.barra.indexOf(pw.id); const velho = AR.barra[i]; if (velho && ativo[velho]) ativo[velho] = false; if (j >= 2) AR.barra[j] = null; AR.barra[i] = pw.id; salvaAR(); montaBarra(); aviso(pw.icone + ' ' + pw.nome + ' no slot ' + (i + 1) + (velho && velho !== pw.id ? ' (saiu ' + PW[velho].nome + ')' : ''), '#7ad87a'); desenhaArvore(); }); row.appendChild(b); }
    ac.appendChild(row);
    if (AR.barra.indexOf(pw.id) >= 2) { const b = document.createElement('button'); b.className = 'ab tira'; b.textContent = 'Tirar da barra'; tapBtn(b, () => { const j = AR.barra.indexOf(pw.id); AR.barra[j] = null; ativo[pw.id] = false; salvaAR(); montaBarra(); desenhaArvore(); }); ac.appendChild(b); } }
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
    let gasto = 0; PODERES.forEach(pw => { if (pw.tipo === 'liga' && ativo[pw.id]) { if (!pw.el) ativo[pw.id] = false; else gasto += pw.custo; } });
    mana = clamp(mana + dt * 6 - dt * gasto, 0, MANA_MAX); if (mana <= 0 && gasto > 0) { PODERES.forEach(pw => { if (pw.tipo === 'liga' && pw.custo && ativo[pw.id]) { ativo[pw.id] = false; marca(pw, 'on', false); } }); aviso('A mana acabou. Os poderes desligaram.', '#ff6a6a'); }
    $('mana-fill').style.width = (mana / MANA_MAX * 100).toFixed(1) + '%'; $('mana-num').textContent = Math.round(mana);
    PODERES.forEach(pw => marca(pw, 'falta', pw.tipo === 'uso' && mana < pw.custo));
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
    { c: capitao, nome: 'Capitão da guarda', x: VX + 7, z: -10, ry: -0.4, falas: ['Valdren está fedendo mais que nunca, garoto. Vai fazer o quê, rezar?'] },
    { c: alunos[0], nome: 'Aluno', x: VX - 2.6, z: -9.6, ry: 0.4, falas: ['Bichinhos invisíveis? Ha! Essa é boa.'] },
    { c: alunos[1], nome: 'Aluna', x: VX - 1.4, z: -8.4, ry: 0.2, falas: ['O Arquimago diz que doença é castigo dos deuses.'] },
    { c: alunos[2], nome: 'Aluno', x: VX - 3.6, z: -8.2, ry: 0.6, falas: ['Você é mesmo de Brumafria? Lá ninguém fica doente, é verdade?'] },
    { c: multidao[0], nome: 'Vendedora', x: VX - 21, z: 9.8, ry: 0.4, falas: ['Que cheiro... é sempre assim aqui na capital.'] },
    { c: multidao[1], nome: 'Pescador', x: VX + 26, z: -4, ry: -1.2, falas: ['A água do poço do porto anda com um gosto estranho...'] },
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
      cena([NAR_F('Rota do Sábio · A Academia Real', null), NAR_F('A Academia ficava na capital, Valdren, uma cidade de cem mil pessoas e nenhum esgoto. O cheiro chegava antes das muralhas.', 'sab01')], () => {
        zona = 'valdren'; dentro = false; modo = 'dia'; heroi.position.set(VX, 0, 40); facing = Math.PI; camYaw = 0; cam.position.set(VX, 3, 46); Q.passo = 1; Q.rota = 'A';
        mostrarLugar('Valdren · a capital'); objetivo('Vá até a Academia Real e fale com o Arquimago Corvel', [VX + 3.2, -11]); }); } }); }
  NPCV[0].falas = [COR_F('Hm? Mais um aluno do interior...')]; 
  function passoCorvel() { if (Q.passo === 1) { falar({ nome: 'Arquimago Corvel', falas: [NAR_F('Nas aulas, Leonardo falou de coisas pequenas demais para ver, que causam doenças. Os professores riram.', 'sab02'), COR_F('Doença é castigo dos deuses, garoto. Ninguém precisa de bichinhos invisíveis pra explicar a vontade divina.', 'sab03'), LEO_F('Então vamos testar. Duas tigelas de caldo: uma eu fervo, a outra fica aberta.', 'sab04')],
        fim: () => { Q.passo = 2; objetivo('Faça o teste: ferva uma das tigelas na mesa', [VX, -12.5]); } }); return true; } return false; }
  function ferver() { Q.tigela = 1; aviso('A tigela da esquerda está fervendo. A outra fica aberta.', '#ffb04a'); setTimeout(() => cena([NAR_F('Uma semana depois...', null), NAR_F('Leonardo não discutiu. Ferveu uma tigela e deixou a outra aberta. Em uma semana, uma estava limpa... e a outra fedia. Metade da turma parou de rir.', 'sab05')], () => {
      Q.tigela = 2; falar({ nome: 'Arquimago Corvel', falas: [COR_F('Hmpf... coincidência.', 'sab06')], fim: () => cena([NAR_F('Foi aí que a peste chegou. Começou no bairro do porto: febre, diarreia, morte em três dias.', 'sab07')], () => { Q.passo = 3; objetivo('Investigue o poço do bairro do porto (use a Memória 🧠)', [VX + 20, 4]); }) }); }), 2200); }
  function pocoMemoria() { Q.passo = 3.5; cena([NAR_F('Leonardo sabia o que era. Cólera. Água suja.', 'sab08')], () => { Q.passo = 4; Q.noite = true; modo = 'noite'; objetivo('Já é noite. Volte pro seu quarto, do lado da Academia', [VX + 14, -14]); }); }
  function portaQuarto() { Q.passo = 4.5; cena([NAR_F('Naquela noite, uma garota encapuzada bateu na porta do quarto dele. Era a princesa Seraphine, a filha mais nova do rei.', 'sab09')], () => { Q.serOn = true;
      falar({ nome: 'Princesa Seraphine', falas: [SER_F('Dizem que você sabe parar isso. A Igreja diz que é castigo. O que você diz?', 'sab10')], escolhas: () => [{ t: '📢 <b>Contar tudo ao povo</b><small>Ensinar na praça a ferver a água, mesmo que chamem de heresia</small>', fn: rotaA1 }, { t: '🤫 <b>Agir em segredo com a princesa</b><small>Salvar a cidade sem aparecer, usando a autoridade dela</small>', fn: rotaA2 }] }); }); }
  function rotaA1() { Q.passo = 5; Q.sub = 'A1'; Q.noite = false; modo = 'dia'; Q.serOn = false; objetivo('De manhã: suba na carroça da praça do mercado e avise o povo', [VX - 16, 12]); aviso('O povo vai se juntar em volta da carroça.', '#ffd23c'); }
  function rotaA2() { Q.sub = 'A2'; falar({ nome: 'Princesa Seraphine', falas: [SER_F('Então escreva. Eu transformo em ordens do rei.', 'sab17')], fim: () => { Q.passo = 5; Q.noite = false; modo = 'dia'; Q.serOn = false; objetivo('Leve as ordens da princesa ao capitão da guarda', [VX + 7, -10]); } }); }
  function subirCarroca() { Q.passo = 6; Q.naCarroca = true; heroi.position.set(VX - 16, 1.05, 12); falar({ nome: 'Leonardo', falas: [LEO_F('Fervam a água! Lavem as mãos! Não bebam do rio perto do porto!', 'sab11')], fim: () => cena([
      NAR_F('Leonardo subiu numa carroça na praça do mercado e gritou até perder a voz. No terceiro dia, os inquisidores vieram buscá-lo. Ele foi preso por heresia.', 'sab12'), NAR_F('Mas quem tinha ouvido, tinha fervido a água. E nas ruas onde as pessoas fizeram isso, ninguém mais morreu. Em três semanas, cinco mil pessoas cercaram a prisão gritando o nome dele.', 'sab13'),
      NAR_F('O rei mandou soltá-lo. O Arquimago Corvel, que tinha perdido o próprio filho para a peste, foi o primeiro a se ajoelhar e pedir para aprender.', 'sab14'), NAR_F('Anos depois, Valdren tinha o primeiro hospital de Aetherion, com uma placa na porta: "Lave as mãos antes de entrar."', 'sab15'),
      { n: 'Elysia', t: 'Você não matou nenhum dragão. Mas salvou mais gente do que todos os heróis que eu já mandei, juntos.', v: 'sab16' }], () => { Q.naCarroca = false; heroi.position.y = 0; final('A1', 'O Pai da Medicina', 'Você escolheu a verdade, mesmo com risco. O mundo mudou porque o povo aprendeu.'); }) }); }
  function ordensCapitao() { Q.passo = 6; falar({ nome: 'Capitão da guarda', falas: [{ n: 'Capitão da guarda', t: 'Ordem da princesa? Então fechamos os poços do porto agora mesmo!', v: 'sab24' }], fim: () => cena([
      NAR_F('Leonardo escreveu as instruções. Seraphine as transformou em ordens reais. Os guardas fecharam os poços do porto, distribuíram lenha pra ferver a água e queimaram as roupas dos doentes.', 'sab18'), NAR_F('A peste parou. A Igreja disse que foi um milagre. Leonardo deixou que dissessem.', 'sab19'),
      NAR_F('Uma prensa de tipos móveis apareceu, por acaso, numa oficina da capital. Livros começaram a custar o preço de um pão. Gente comum aprendeu a ler.', 'sab20'), NAR_F('Vinte anos depois, quando Seraphine virou rainha, Valdren tinha escolas em todas as vilas, estradas de pedra e um cometa previsto com três anos de antecedência. Ninguém sabia o nome de Leonardo.', 'sab21'),
      { n: 'Rainha Seraphine', t: 'Você podia ser famoso.', v: 'sab22' }, LEO_F('Famoso morre na fogueira. Eu queria era ver o mundo andar.', 'sab23')], () => final('A2', 'A Revolução Silenciosa', 'Você escolheu mudar o mundo sem aparecer. Ninguém lembra de você, mas todos vivem melhor.')) }); }
  function final(k, nome, nota) { if (!finais.includes(k)) { finais.push(k); try { localStorage.setItem('aetherion-finais', JSON.stringify(finais)); } catch (e) {} } objetivo(null);
    $('fim-num').textContent = 'Final ' + (FINAIS.indexOf(k) + 1) + ' de 6'; $('fim-nome').textContent = nome; $('fim-nota').textContent = nota; $('fim-selos').innerHTML = FINAIS.map(f => `<span class="selo${finais.includes(f) ? ' on' : ''}"></span>`).join(''); $('fim-cont').textContent = `Finais descobertos: ${finais.length} de 6`; $('fim').hidden = false; }
  tapBtn($('fim-volta'), () => { $('fim').hidden = true; zona = 'vila'; dentro = false; modo = 'dia'; Q.passo = 0; Q.tigela = 0; Q.serOn = false; heroi.position.set(-5.2, 0, 4.4); facing = Math.PI; camYaw = 0; cam.position.set(-5, 3, 10); mostrarLugar('Vila de Brumafria'); });
  tapBtn($('fim-fica'), () => { $('fim').hidden = true; objetivo('Explore Valdren à vontade. Fale com o Professor em Brumafria pra jogar de novo.'); });
  function valdrenFrame(dt, p) {
    const on = zona === 'valdren'; val.visible = on; vil.visible = !on;
    const lista = [...NPCV, ...(Q.serOn ? [{ c: seraphine, nome: 'Princesa Seraphine', x: VX + 11.4, z: -14.6, ry: -Math.PI / 2, falas: [SER_F('Você vai me ajudar ou não?')], ser: true }] : [])];
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
  function desenhaMini(p) { const W = mini.width, H = mini.height, k = zona === 'valdren' ? 3.6 : dentro ? 9 : 4.8; mx.setTransform(1, 0, 0, 1, 0, 0); mx.clearRect(0, 0, W, H);
    mx.save(); mx.beginPath(); mx.arc(W / 2, H / 2, W / 2 - 2, 0, 7); mx.clip();
    mx.fillStyle = zona === 'valdren' ? '#b8ab98' : dentro ? '#7a5a3a' : '#eef3fa'; mx.fillRect(0, 0, W, H);
    mx.translate(W / 2, H / 2); mx.scale(k, k); mx.translate(-p.x, -p.z);
    if (zona === 'valdren') { mx.fillStyle = '#4a7a9a'; mx.fillRect(VX + 28, -45, 40, 90); mx.strokeStyle = '#7a7068'; mx.lineWidth = 1.6; mx.beginPath(); mx.arc(VX, 0, 46, 0, 7); mx.stroke(); }
    else if (!dentro) { mx.fillStyle = '#cbbfae'; mx.beginPath(); mx.arc(0, 0, 5.2, 0, 7); mx.arc(0, 0, 3.2, 0, 7, true); mx.fill(); }
    const lista = zona === 'valdren' ? COLV : dentro ? COLC : COL;
    lista.forEach(o => { if (o.t === 'c') { if (o.npc) return; mx.fillStyle = zona === 'vila' && !dentro ? '#3a7a4a' : '#7a7068'; mx.beginPath(); mx.arc(o.x, o.z, Math.max(o.r, 0.5), 0, 7); mx.fill(); }
      else { mx.save(); mx.translate(o.x, o.z); mx.rotate(-o.ry); mx.fillStyle = zona === 'valdren' ? '#8a6a5a' : '#8a7a8a'; mx.fillRect(-o.hw, -o.hd, o.hw * 2, o.hd * 2); mx.restore(); } });
    if (zona === 'vila' && !dentro) { const d = casaFamilia.position; mx.fillStyle = '#e8b030'; mx.fillRect(d.x - 2.4, d.z - 2.2, 4.8, 4.4); mx.fillStyle = '#4a2a10'; mx.font = 'bold 3.4px sans-serif'; mx.textAlign = 'center'; mx.fillText('🏠', d.x, d.z + 1.2); }
    const npcs = zona === 'valdren' ? NPCV : dentro ? [] : NPCS; mx.fillStyle = '#ffd23c'; mx.strokeStyle = '#3a2a10'; mx.lineWidth = 0.4; npcs.forEach(n => { mx.beginPath(); mx.arc(n.x, n.z, 0.9, 0, 7); mx.fill(); mx.stroke(); });
    if (!dentro) { FERAS.forEach(e => { if (e.morto || e.T.zona !== zona) return; mx.fillStyle = e.T.chefe ? '#3ab8ff' : '#e83a2a'; mx.beginPath(); mx.arc(e.g.position.x, e.g.position.z, e.T.chefe ? 2.2 : 0.8, 0, 7); mx.fill(); }); if (zona === 'vila') { mx.fillStyle = '#ff8a3a'; mx.fillRect(FX0 - 1.2, FZ0 - 1.2, 2.4, 2.4); } }
    if (Q.alvoQ && zona === 'valdren') { const [ax, az] = Q.alvoQ; const t = 1 + Math.sin(gT * 5) * 0.25; mx.fillStyle = '#ff4a3a'; mx.beginPath(); mx.arc(ax, az, 1.4 * t, 0, 7); mx.fill(); }
    mx.restore();
    mx.save(); mx.translate(W / 2, H / 2); mx.rotate(-facing + Math.PI); mx.fillStyle = '#2a7aff'; mx.strokeStyle = '#fff'; mx.lineWidth = 2; mx.beginPath(); mx.moveTo(0, -9); mx.lineTo(6, 6); mx.lineTo(0, 3); mx.lineTo(-6, 6); mx.closePath(); mx.fill(); mx.stroke(); mx.restore();
    mx.strokeStyle = 'rgba(255,255,255,.9)'; mx.lineWidth = 3; mx.beginPath(); mx.arc(W / 2, H / 2, W / 2 - 2, 0, 7); mx.stroke(); mx.fillStyle = '#fff'; mx.font = 'bold 12px sans-serif'; mx.textAlign = 'center'; mx.fillText('N', W / 2, 13); }
  function abrirMapa() { if (conversa || cenaQ) return; const lib = Q.passo >= 1 || finais.some(f => f[0] === 'A'); const L = [
      { id: 'vila', nome: 'Vila de Brumafria', sub: 'Sua cidade natal 🏠', on: true },
      { id: 'valdren', nome: 'Valdren', sub: lib ? 'A capital · Academia Real' : '🔒 Fale com o Professor pra ir', on: lib } ];
    $('mapa-lista').innerHTML = ''; L.forEach(l => { const b = document.createElement('button'); b.className = 'lugar' + (zona === l.id ? ' aqui' : ''); b.disabled = !l.on; b.innerHTML = `<b>${l.nome}</b><small>${zona === l.id ? '📍 Você está aqui' : l.sub}</small>`; if (l.on && zona !== l.id) tapBtn(b, () => viajar(l.id)); $('mapa-lista').appendChild(b); }); $('mapa').hidden = false; }
  function viajar(id) { $('mapa').hidden = true; if (Q.naCarroca) return; cena([{ t: id === 'vila' ? 'De volta pra casa... Brumafria' : 'A caminho de Valdren...', v: null }], () => {
      dentro = false; zona = id; if (id === 'vila') { heroi.position.set(0, 0, 4.2); facing = Math.PI; camYaw = 0; cam.position.set(0, 3, 10); mostrarLugar('Vila de Brumafria'); }
      else { heroi.position.set(VX, 0, 40); facing = Math.PI; camYaw = 0; cam.position.set(VX, 3, 46); modo = Q.noite ? 'noite' : 'dia'; mostrarLugar('Valdren · a capital'); } }); }
  tapBtn(mini, abrirMapa); tapBtn($('mapa-fecha'), () => { $('mapa').hidden = true; }); tapBtn($('casa'), () => { if (zona === 'vila' && !dentro) { aviso('Você já está em Brumafria, sua cidade natal.', '#ffd23c'); return; } if (dentro) { aviso('Você está dentro de casa. A porta fica atrás de você.', '#ffd23c'); return; } viajar('vila'); });

  // ===================== COMBATE: vida, armas, bichos e a forja =====================
  let vida = 100; const VIDA_MAX = 100; let semDanoT = 99, desmaiado = false;
  AR.inv = Object.assign({ moedas: 0, pele: 0, carne: 0, coracao: 0 }, AR.inv || {});
  AR.armas = AR.armas || ['bastao']; AR.arma = AR.armas.includes(AR.arma) ? AR.arma : 'bastao'; AR.abates = AR.abates || {};
  const ARMAS = {
    bastao: { nome: 'Bastão', icone: '🪵', dano: 10, alc: 1.9, cd: 0.4, desc: 'O bastão que o seu pai te deu. Bate fraco, mas já é alguma coisa.' },
    espada: { nome: 'Espada de ferro', icone: '🗡️', dano: 22, alc: 2.3, cd: 0.36, preco: 25, desc: 'Ferro com um pouco de carbono vira aço. A 🧠 Memória ensinou o ferreiro.' },
    besta: { nome: 'Besta', icone: '🏹', dano: 30, alc: 18, cd: 0.8, longe: true, preco: 40, desc: 'Alavanca + corda tensionada: atira virotes de longe.' },
    glacial: { nome: 'Espada Glacial', icone: '❄️', dano: 38, alc: 2.5, cd: 0.34, gelo: true, preco: 30, precisa: 'coracao', desc: 'Forjada com o Coração de Gelo do Golem. Às vezes congela o inimigo.' },
  };
  const ITENS = { moedas: '💰', pele: '🐺', carne: '🍖', coracao: '💎' };
  // ---- arma na mão do Leonardo ----
  const maoG = grp(heroi.userData.P.elR, 0, -0.33, 0.05); const ARMAG = {};
  { let g = ARMAG.bastao = grp(maoG); part(g, CYL, '#7a4a2a', 0, 0, 0.32, 0.03, 0.95, 0.03).rotation.x = Math.PI / 2;
    g = ARMAG.espada = grp(maoG); tb(g, 0, 0, 0.55, 0.07, 0.018, 0.78, '#dfe4ee'); part(g, CONE, '#dfe4ee', 0, 0, 0.98, 0.035, 0.1, 0.01).rotation.x = Math.PI / 2; tb(g, 0, 0, 0.14, 0.26, 0.04, 0.05, '#e2c27a'); part(g, CYL, '#4a2a14', 0, 0, 0.03, 0.025, 0.18, 0.025).rotation.x = Math.PI / 2;
    g = ARMAG.glacial = grp(maoG); tb(g, 0, 0, 0.6, 0.08, 0.02, 0.9, '#9ae6ff', true); part(g, CONE, '#9ae6ff', 0, 0, 1.08, 0.04, 0.12, 0.01, 0, true).rotation.x = Math.PI / 2; tb(g, 0, 0, 0.14, 0.3, 0.05, 0.05, '#5ab8ff'); part(g, CYL, '#2a3a5a', 0, 0, 0.03, 0.025, 0.18, 0.025).rotation.x = Math.PI / 2; glowSpr(g, 0, 0, 0.6, 1.1, '#7ad8ff', 0.5);
    g = ARMAG.besta = grp(maoG); tb(g, 0, 0.02, 0.2, 0.07, 0.07, 0.6, '#7a4a2a'); tb(g, 0, 0.04, 0.42, 0.62, 0.04, 0.05, '#5a3a24'); tb(g, 0, 0.05, 0.36, 0.6, 0.008, 0.008, '#e8e0d0'); }
  function mostraArma() { Object.keys(ARMAG).forEach(k => ARMAG[k].visible = k === AR.arma); const A = ARMAS[AR.arma]; $('atacar').innerHTML = `<span>${A.icone}</span><small>ATACAR</small>`; $('arma').hidden = AR.armas.length < 2; }
  function trocaArma() { if (AR.armas.length < 2) return; const i = AR.armas.indexOf(AR.arma); AR.arma = AR.armas[(i + 1) % AR.armas.length]; salvaAR(); mostraArma(); aviso(ARMAS[AR.arma].icone + ' ' + ARMAS[AR.arma].nome, '#ffd23c'); }
  function atualizaInv() { $('inv-m').textContent = AR.inv.moedas; $('inv-p').textContent = AR.inv.pele; $('inv-c').textContent = AR.inv.carne; $('inv-cw').hidden = !AR.inv.carne; $('inv-pw').hidden = !AR.inv.pele; $('inv-g').hidden = !AR.inv.coracao; }
  function comer() { if (!AR.inv.carne) return; if (vida >= VIDA_MAX) { aviso('Você já está com a vida cheia.', '#8a9aba'); return; } AR.inv.carne--; vida = Math.min(VIDA_MAX, vida + 35); salvaAR(); atualizaInv(); numero(heroi.position, '+35 ❤️', '#7ad87a'); fx('cura', [heroi.position.x, 0, heroi.position.z], 1.2); }

  // ---- números que sobem (dano, moedas) ----
  const vN = new T3.Vector3();
  function numero(pos, txt, cor, alt) { vN.set(pos.x, (pos.y || 0) + (alt || 2), pos.z); vN.project(cam); if (vN.z > 1) return; const d = document.createElement('div'); d.className = 'dn'; d.textContent = txt; d.style.color = cor || '#fff'; d.style.left = ((vN.x * 0.5 + 0.5) * window.innerWidth + (Math.random() - 0.5) * 30) + 'px'; d.style.top = ((-vN.y * 0.5 + 0.5) * window.innerHeight) + 'px'; $('nums').appendChild(d); setTimeout(() => d.remove(), 900); }

  // ---- os bichos ----
  const TIPOS = {
    lobo: { nome: 'Lobo da neve', vida: 40, dano: 8, vel: 4.4, aggro: 11, alc: 1.4, cd: 1.1, raio: 0.6, alt: 1.3, moedas: [2, 4], itens: [['pele', 1], ['carne', 0.3]], zona: 'vila' },
    javali: { nome: 'Javali', vida: 75, dano: 16, vel: 2.6, aggro: 12, alc: 1.5, cd: 2.2, raio: 0.7, alt: 1.5, moedas: [4, 7], itens: [['carne', 1], ['pele', 0.5]], zona: 'vila', investe: true },
    rato: { nome: 'Rato gigante', vida: 18, dano: 5, vel: 3.8, aggro: 8, alc: 1.0, cd: 0.9, raio: 0.4, alt: 0.9, moedas: [1, 3], itens: [], zona: 'valdren' },
    golem: { nome: 'Golem de Gelo', vida: 520, dano: 28, vel: 1.7, aggro: 14, alc: 3.8, cd: 2.6, raio: 1.5, alt: 4.6, moedas: [40, 40], itens: [['coracao', 1]], zona: 'vila', chefe: true, volta: 180 },
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
    else { const c = '#b0dcf2', c2 = '#7ab4dc';
      part(b, ICO, c, 0, 2.4, 0, 1.05, 1.1, 0.8, 0.03); part(b, ICO, c2, 0, 1.45, 0, 0.8, 0.5, 0.6, 0.03);
      head = grp(b, 0, 3.6, 0.18); part(head, ICO, c, 0, 0, 0, 0.5, 0.45, 0.45, 0.03); [-1, 1].forEach(s => part(head, SPH, '#5af0ff', s * 0.18, 0.03, 0.4, 0.08, 0.06, 0.04, 0, true)); glowSpr(head, 0, 0, 0.5, 1.3, '#5af0ff', 0.7);
      [-1, 1].forEach(s => { const a = grp(b, s * 1.2, 3.0, 0); part(a, ICO, c2, 0, -0.6, 0, 0.36, 0.7, 0.36, 0.03); part(a, ICO, c, 0, -1.45, 0.1, 0.56, 0.5, 0.56, 0.03); arms.push(a);
        for (let k = 0; k < 3; k++) { const cr = part(b, CONE, '#8af0ff', s * (0.6 + k * 0.25), 3.2 + k * 0.15, -0.4, 0.12, 0.6 + k * 0.2, 0.12, 0, true); cr.rotation.z = -s * (0.3 + k * 0.2); }
        const l = grp(b, s * 0.5, 1.2, 0); part(l, ICO, c2, 0, -0.6, 0, 0.4, 0.62, 0.4, 0.03); L.push(l); }); }
    const T = TIPOS[tipo]; const gelo = new T3.Mesh(BOX, geloMat); gelo.scale.set(T.raio * 2.2, T.alt * 1.05, T.raio * 2.4); gelo.position.y = T.alt * 0.5; gelo.visible = false; g.add(gelo);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const hp = document.createElement('div'); hp.className = 'hpb'; hp.innerHTML = '<i></i>'; $('hpbs').appendChild(hp);
    return { tipo, T, g, b, L, head, arms, gelo: gelo, hp };
  }
  const FERAS = [];
  function solta(tipo, x, z) { const e = fera(tipo); e.home = [x, z]; e.g.position.set(x, 0, z); e.ry = Math.random() * 6.28; reseta(e); FERAS.push(e); return e; }
  function reseta(e) { e.vida = e.max = e.T.vida; e.estado = 'anda'; e.t = 0; e.cd = 0; e.morto = false; e.mortoT = 0; e.stun = 0; e.congela = 0; e.vuln = 0; e.hitT = 9; e.alvoW = e.home.slice(); e.g.visible = true; e.g.position.set(e.home[0], 0, e.home[1]); e.b.rotation.set(0, 0, 0); e.b.position.set(0, 0, 0); }
  // Brumafria: lobos e javalis na floresta, o Golem na caverna do norte
  [[-32, -28], [-34, -24], [-29, -31], [34, 16], [37, 13], [-38, 12], [-35, 16]].forEach(([x, z]) => solta('lobo', x, z));
  [[30, -34], [-22, -42], [40, -6]].forEach(([x, z]) => solta('javali', x, z));
  const GX = 0, GZ = -50; const golem = solta('golem', GX, GZ);
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

  function abrirLoja() { if (conversa || cenaQ) return; const L = $('loja-lista'); L.innerHTML = ''; $('loja-m').textContent = AR.inv.moedas;
    Object.keys(ARMAS).forEach(k => { const A = ARMAS[k], tem = AR.armas.includes(k); const b = document.createElement('div'); b.className = 'item';
      const preco = A.preco ? `${A.preco} 💰${A.precisa ? ' + 💎 Coração de Gelo' : ''}` : 'Presente do seu pai';
      b.innerHTML = `<span class="ic">${A.icone}</span><div class="tx"><b>${A.nome}</b><small>${A.longe ? 'De longe' : 'Corpo a corpo'} · dano ${A.dano}</small><small>${A.desc}</small></div>`;
      const bt = document.createElement('button'); bt.className = 'cb';
      if (tem) { bt.textContent = AR.arma === k ? 'Na mão' : 'Usar'; bt.disabled = AR.arma === k; tapBtn(bt, () => { if (AR.arma === k) return; AR.arma = k; salvaAR(); mostraArma(); abrirLoja(); }); }
      else { const ok = AR.inv.moedas >= A.preco && (!A.precisa || AR.inv[A.precisa] > 0); bt.innerHTML = preco; bt.disabled = !ok; tapBtn(bt, () => { if (!ok) return; AR.inv.moedas -= A.preco; if (A.precisa) AR.inv[A.precisa]--; AR.armas.push(k); AR.arma = k; salvaAR(); mostraArma(); atualizaInv(); aviso('Nova arma: ' + A.icone + ' ' + A.nome + '!', '#ffd23c'); abrirLoja(); }); }
      b.appendChild(bt); L.appendChild(b); });
    const v = document.createElement('div'); v.className = 'item'; v.innerHTML = `<span class="ic">🐺</span><div class="tx"><b>Vender peles de lobo</b><small>3 💰 cada · você tem ${AR.inv.pele}</small></div>`; const bv = document.createElement('button'); bv.className = 'cb'; bv.textContent = 'Vender tudo'; bv.disabled = !AR.inv.pele;
    tapBtn(bv, () => { if (!AR.inv.pele) return; const g = AR.inv.pele * 3; AR.inv.moedas += g; AR.inv.pele = 0; salvaAR(); atualizaInv(); aviso('Vendeu as peles: +' + g + ' 💰', '#ffd23c'); abrirLoja(); }); v.appendChild(bv); L.appendChild(v);
    $('loja').hidden = false; }
  tapBtn($('loja-fecha'), () => { $('loja').hidden = true; });

  // ---- ataque do Leonardo ----
  let atkT = 9, atkN = 1, atkHit = true, atkCd = 0, comboT = 0;
  function feraAtiva(e) { return !e.morto && e.T.zona === zona && !dentro; }
  function maisPerto(r) { let m = null, md = r; FERAS.forEach(e => { if (!feraAtiva(e)) return; const d = Math.hypot(e.g.position.x - heroi.position.x, e.g.position.z - heroi.position.z) - e.T.raio; if (d < md) { md = d; m = e; } }); return m; }
  function atacar() { if (conversa || cenaQ || desmaiado || !$('fim').hidden) return; if (dentro) { aviso('Dentro de casa não! A mãe briga.', '#ffb04a'); return; } if (atkCd > 0) return; const A = ARMAS[AR.arma];
    const e = maisPerto(A.longe ? 18 : 4.5); if (e) facing = Math.atan2(e.g.position.x - heroi.position.x, e.g.position.z - heroi.position.z);
    atkN = A.longe ? 1 : comboT > 0 ? (atkN % 3) + 1 : 1; comboT = 0.8; atkT = 0; atkHit = false; atkCd = A.cd * (atkN === 3 ? 1.5 : 1); }
  const virotes = []; const viroteGeo = new T3.BoxGeometry(0.04, 0.04, 0.6);
  function golpe() { const A = ARMAS[AR.arma], p = heroi.position;
    if (A.longe) { const m = new T3.Mesh(viroteGeo, tm('#5a3a24')); m.position.set(p.x, p.y + 1.2, p.z); m.rotation.y = facing; world.add(m); virotes.push({ m, t: 0, dx: Math.sin(facing), dz: Math.cos(facing) }); return; }
    const mult = [1, 1, 1.15, 1.8][atkN]; let acertou = false;
    FERAS.forEach(e => { if (!feraAtiva(e)) return; const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz); if (d > A.alc + e.T.raio) return;
      let da = Math.atan2(dx, dz) - facing; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; if (atkN !== 3 && Math.abs(da) > 1.25 && d > e.T.raio + 0.4) return;
      acertou = true; dano(e, A.dano * mult, A.gelo ? 'gelo' : null); if (A.gelo && Math.random() < 0.25) congelar(e, 1.5); empurra(e, dx / (d || 1), dz / (d || 1), atkN === 3 ? 1.6 : 0.6); });
    if (acertou) tremor = Math.max(tremor, atkN === 3 ? 0.25 : 0.1); }
  function empurra(e, nx, nz, f) { if (e.T.chefe) return; e.g.position.x += nx * f; e.g.position.z += nz * f; }
  function armaPose() { const P = heroi.userData.P, A = ARMAS[AR.arma];
    if (atkT < 0.34) { const u = eOut(clamp(atkT / 0.3));
      if (A.longe) { P.shR.rotation.set(-1.55, 0, 0); P.elR.rotation.set(0, 0, 0); P.shL.rotation.set(-1.4, 0, 0.3); P.elL.rotation.set(-0.3, 0, 0); }
      else if (atkN === 1) { P.shR.rotation.set(lerp(-2.9, -0.4, u), 0, 0.15); P.elR.rotation.set(-0.15, 0, 0); P.spine.rotation.x = lerp(-0.1, 0.25, u); }
      else if (atkN === 2) { P.shR.rotation.set(-1.45, 0, 0); P.elR.rotation.set(-0.1, 0, 0); P.spine.rotation.y = lerp(1.0, -1.0, u); }
      else { P.shR.rotation.set(-1.5, 0, 1.0); P.elR.rotation.set(0, 0, 0); heroi.rotation.y = facing + u * Math.PI * 2; } }
    else if (A.longe) { P.shR.rotation.x = -0.7; P.elR.rotation.x = -0.9; } }

  // ---- dano nos bichos ----
  function dano(e, n, tipo) { if (e.morto) return; if (e.T.chefe && tipo === 'fogo') n *= 2; if (e.vuln > 0) n *= 1.5; n = Math.round(n); e.vida -= n; e.hitT = 0;
    numero(e.g.position, String(n), tipo === 'fogo' ? '#ff9a3a' : tipo === 'gelo' ? '#9ae6ff' : tipo === 'raio' ? '#fff27a' : '#ffffff', e.T.alt + 0.3);
    if (e.estado === 'anda' || e.estado === 'volta') { e.estado = 'caca'; }
    if (e.vida <= 0) morre(e); }
  function congelar(e, s) { if (e.morto) return; e.congela = Math.max(e.congela, e.T.chefe ? s * 0.35 : s); }
  function morre(e) { e.morto = true; e.mortoT = 0; e.hp.style.display = 'none'; const p = e.g.position; const [a, b] = e.T.moedas; solta_loot(p.x, p.z, 'moedas', a + Math.floor(Math.random() * (b - a + 1)));
    e.T.itens.forEach(([it, ch]) => { if (Math.random() < ch) solta_loot(p.x + (Math.random() - .5), p.z + (Math.random() - .5), it, 1); });
    AR.abates[e.tipo] = (AR.abates[e.tipo] || 0) + 1; const tot = Object.values(AR.abates).reduce((s, v) => s + v, 0); salvaAR();
    if (e.T.chefe) { ganha('golem1', 5, 'derrotou o Golem de Gelo'); aviso('🏆 O GOLEM DE GELO CAIU! Leve o 💎 Coração de Gelo pra Forja.', '#7ad8ff'); }
    else { ganha('abate1:' + e.tipo, 2, 'primeiro ' + e.T.nome); if (tot % 5 === 0) setTimeout(() => ganha('abates:' + tot, 1, tot + ' bichos derrotados'), 900); } }
  // ---- coisas que caem ----
  const LOOT = []; const EMO = {};
  function emoTex(t) { return EMO[t] || (EMO[t] = canvasTex(96, 96, (x, w, h) => { x.font = '72px system-ui,"Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, w / 2, h / 2 + 4); })); }
  function solta_loot(x, z, item, n) { const s = new T3.Sprite(new T3.SpriteMaterial({ map: emoTex(ITENS[item]), transparent: true, depthWrite: false, toneMapped: false })); s.scale.set(0.6, 0.6, 1); s.position.set(x, 0.5, z); world.add(s); LOOT.push({ s, item, n, t: 0, zona }); }
  // ---- dano no Leonardo ----
  function danoHeroi(n, de) { if (desmaiado) return; if (ativo.escudo) { n *= 0.3; fx('luz', [heroi.position.x, heroi.position.y, heroi.position.z], 0.3); } n = Math.round(n); vida -= n; semDanoT = 0; flash('rgba(255,40,40,.35)'); tremor = Math.max(tremor, 0.18);
    numero(heroi.position, '-' + n, '#ff5a5a', 2.1); if (vida <= 0) { vida = 0; desmaiar(); } }
  function desmaiar() { desmaiado = true; FERAS.forEach(e => { if (!e.morto) { e.estado = 'volta'; } }); ativo.vento = ativo.escudo = ativo.planar = false; montaBarra();
    setTimeout(() => cena([{ t: 'Tudo ficou escuro...', v: null }, { t: 'Leonardo acordou em casa, na cama. A mãe cuidou dele a noite toda.', n: 'Mãe', v: null }, { t: '"Meu filho, cuidado lá fora! Come alguma coisa antes de sair de novo."', n: 'Mãe', v: null }], () => {
      zona = 'vila'; dentro = true; heroi.position.set(IX + 2, 0, -1.8); facing = Math.PI; camYaw = 0; vida = VIDA_MAX; mana = MANA_MAX; desmaiado = false; mostrarLugar('Casa da família'); }), 400); }

  // ---- poderes de combate ----
  const RAIOS = [];
  function relampago(a, b) { const n = 10; for (let i = 0; i <= n; i++) { const u = i / n; const j = i === 0 || i === n ? 0 : 0.35; const s = glowSpr(world, lerp(a.x, b.x, u) + (Math.random() - .5) * j, lerp(a.y, b.y, u) + (Math.random() - .5) * j, lerp(a.z, b.z, u) + (Math.random() - .5) * j, 0.7, '#fff6a0', 1); RAIOS.push({ s, t: 0 }); } }
  function combatePoder(id) { const p = heroi.position;
    const naFrente = (alc, ang) => FERAS.filter(e => { if (!feraAtiva(e)) return false; const dx = e.g.position.x - p.x, dz = e.g.position.z - p.z, d = Math.hypot(dx, dz); if (d > alc + e.T.raio) return false; let da = Math.atan2(dx, dz) - facing; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; return Math.abs(da) < ang || d < e.T.raio + 0.5; });
    const perto = r => FERAS.filter(e => feraAtiva(e) && Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z) < r + e.T.raio);
    if (id === 'polvora') { const f = [p.x + Math.sin(facing) * 3.2, p.z + Math.cos(facing) * 3.2]; FERAS.forEach(e => { if (feraAtiva(e) && Math.hypot(e.g.position.x - f[0], e.g.position.z - f[1]) < 3.6 + e.T.raio) { dano(e, 60, 'fogo'); const dx = e.g.position.x - f[0], dz = e.g.position.z - f[1], d = Math.hypot(dx, dz) || 1; empurra(e, dx / d, dz / d, 2); } }); }
    if (id === 'clarao') perto(9).forEach(e => { e.stun = 3; dano(e, 10, 'luz'); });
    if (id === 'remedio') { if (vida < VIDA_MAX) { vida = Math.min(VIDA_MAX, vida + 40); numero(p, '+40 ❤️', '#7ad87a'); } }
    if (id === 'chama') { const e = maisPerto(5); if (e) facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); fx('chama', [p.x, p.y, p.z], 0.8, facing); setTimeout(() => naFrente(4.5, 0.7).forEach(e => { dano(e, 30, 'fogo'); e.queima = 3; }), 120); aviso('Chama: óleo + faísca. O fogo precisa de combustível, calor e oxigênio.', '#ff8a3a'); }
    if (id === 'gelo') { const e = maisPerto(10); if (!e) { fx('gelo', [p.x, p.y, p.z], 0.8); aviso('Nenhum bicho perto pra congelar.', '#9ae6ff'); return; } facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); fx('gelo', [e.g.position.x, 0, e.g.position.z], 0.9); congelar(e, 3); dano(e, 15, 'gelo'); aviso('Gelo: a mana tira o calor da água do corpo dele.', '#9ae6ff'); }
    if (id === 'raio') { let atual = { x: p.x, y: p.y + 1.3, z: p.z }; const ja = []; let r = 9;
      for (let k = 0; k < 4; k++) { let m = null, md = r; FERAS.forEach(e => { if (!feraAtiva(e) || ja.includes(e)) return; const d = Math.hypot(e.g.position.x - atual.x, e.g.position.z - atual.z); if (d < md) { md = d; m = e; } }); if (!m) break;
        const alvoP = { x: m.g.position.x, y: m.T.alt * 0.6, z: m.g.position.z }; relampago(atual, alvoP); ja.push(m); dano(m, 35, 'raio'); m.stun = Math.max(m.stun, 0.6); atual = alvoP; r = 6; }
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
      if (e.morto) { e.mortoT += dt; e.b.rotation.z = Math.min(Math.PI / 2, e.mortoT * 5); e.b.position.y = -Math.min(1, e.mortoT * 0.3) * (e.mortoT > 1 ? 0.5 : 0); e.gelo.visible = false; if (e.mortoT > (T.volta || 45) && Math.hypot(p.x - e.home[0], p.z - e.home[1]) > 18) reseta(e); return; }
      const g = e.g.position; const d = Math.hypot(p.x - g.x, p.z - g.z); let v = 0;
      e.cd -= dt; e.vuln -= dt; e.hitT += dt; if (e.queima > 0) { e.queima -= dt; e.qT = (e.qT || 0) + dt; if (e.qT > 1) { e.qT = 0; dano(e, 5, 'fogo'); if (e.morto) return; } }
      e.gelo.visible = e.congela > 0; if (e.congela > 0) { e.congela -= dt; }
      else if (e.stun > 0) { e.stun -= dt; e.b.rotation.z = Math.sin(gT * 18) * 0.12; }
      else { e.b.rotation.z = 0;
        if (e.estado === 'anda') { e.t -= dt; if (e.t <= 0) { e.t = 2 + Math.random() * 3; const a = Math.random() * 6.28, r = Math.random() * (T.chefe ? 3 : 5); e.alvoW = [e.home[0] + Math.cos(a) * r, e.home[1] + Math.sin(a) * r]; } v = anda(e, e.alvoW[0], e.alvoW[1], T.vel * 0.35, dt) ? T.vel * 0.35 : 0; if (d < T.aggro && livre) { e.estado = 'caca'; if (!T.chefe && Math.random() < 0.5) numero(g, '!', '#ff5a3a', T.alt + 0.4); } }
        else if (e.estado === 'caca') { if (!livre || Math.hypot(g.x - e.home[0], g.z - e.home[1]) > (T.chefe ? 14 : 24) || d > T.aggro * 2.2) e.estado = 'volta';
          else if (T.investe && d < 10 && d > 2.6 && e.cd <= 0) { e.estado = 'mira'; e.t = 0; }
          else if (d <= T.alc + 0.2 && e.cd <= 0) { e.estado = 'ataque'; e.t = 0; }
          else if (d > T.alc * 0.75) v = anda(e, p.x, p.z, T.vel, dt); else e.ry = viraPara(e.ry, Math.atan2(p.x - g.x, p.z - g.z), dt * 8); }
        else if (e.estado === 'mira') { e.t += dt; e.ry = viraPara(e.ry, Math.atan2(p.x - g.x, p.z - g.z), dt * 10); e.b.position.z = -Math.sin(e.t * 30) * 0.05; if (e.t > 0.6) { e.estado = 'investe'; e.t = 0; e.dir = [Math.sin(e.ry), Math.cos(e.ry)]; e.bateu = false; } }
        else if (e.estado === 'investe') { e.t += dt; const ox = g.x, oz = g.z; g.x += e.dir[0] * 12 * dt; g.z += e.dir[1] * 12 * dt; colide(g, COLZ()); v = 12; if (!e.bateu && d < 1.4) { e.bateu = true; danoHeroi(T.dano + 4); const nx = p.x - g.x, nz = p.z - g.z, nd = Math.hypot(nx, nz) || 1; p.x += nx / nd * 1.5; p.z += nz / nd * 1.5; }
          if (e.t > 0.75 || Math.hypot(g.x - ox, g.z - oz) < 12 * dt * 0.5) { e.estado = 'caca'; e.cd = T.cd; e.b.position.z = 0; } }
        else if (e.estado === 'ataque') { e.t += dt; const wind = T.chefe ? 0.9 : 0.35; e.ry = viraPara(e.ry, Math.atan2(p.x - g.x, p.z - g.z), dt * (T.chefe ? 2 : 6));
          if (T.chefe) { const u = clamp(e.t / wind); e.arms.forEach(a => a.rotation.x = -u * 2.6); anel.visible = true; anel.position.set(g.x, 0.05, g.z); anel.scale.setScalar(T.alc * (0.4 + u * 0.6)); anel.material.opacity = 0.3 + u * 0.4; }
          else { e.b.rotation.x = e.t < wind ? -0.25 * (e.t / wind) : 0.3; if (e.head) e.head.rotation.x = e.t < wind ? -0.3 : 0.4; }
          if (e.t >= wind && !e.bateu2) { e.bateu2 = true; if (T.chefe) { e.arms.forEach(a => a.rotation.x = 0.4); anel.visible = false; fx('gelo', [g.x, 0, g.z], 0.8); fx('fumo', [g.x, 0, g.z], 1.2); tremor = Math.max(tremor, 0.5); if (d < T.alc + 0.2 && p.y < 1.2) danoHeroi(T.dano); } else if (d < T.alc + 0.6) danoHeroi(T.dano); }
          if (e.t > wind + 0.3) { e.estado = 'caca'; e.cd = T.cd * (T.chefe && e.vida < e.max / 2 ? 0.6 : 1); e.bateu2 = false; e.b.rotation.x = 0; if (e.head) e.head.rotation.x = 0; e.arms.forEach(a => a.rotation.x = 0); } }
        else if (e.estado === 'volta') { v = anda(e, e.home[0], e.home[1], T.vel, dt) ? T.vel : 0; e.vida = Math.min(e.max, e.vida + dt * e.max * 0.15); if (Math.hypot(g.x - e.home[0], g.z - e.home[1]) < 1.5) { e.estado = 'anda'; e.vida = e.max; } if (d < T.aggro * 0.6 && livre) e.estado = 'caca'; }
        if (d < T.raio + 0.3) { const nx = g.x - p.x, nz = g.z - p.z, nd = Math.hypot(nx, nz) || 1; g.x = p.x + nx / nd * (T.raio + 0.3); g.z = p.z + nz / nd * (T.raio + 0.3); }
        if (zona === 'vila') { const r = Math.hypot(g.x, g.z + 6); if (r > 58) { g.x *= 58 / r; g.z = (g.z + 6) * 58 / r - 6; } } }
      e.g.rotation.y = e.ry; const sc = e.hitT < 0.15 ? 1 + (0.15 - e.hitT) : 1; e.b.scale.setScalar(sc);
      e.L.forEach((l, i) => { const ph = T.chefe ? i * Math.PI : (i === 0 || i === 3 ? 0 : Math.PI); l.rotation.x = v > 0.2 ? Math.sin(gT * (v * 2.2 + 4) + ph) * 0.6 : 0; });
      if (T.chefe && e.estado !== 'ataque') e.arms.forEach((a, i) => a.rotation.x = v > 0.2 ? Math.sin(gT * 4 + i * Math.PI) * 0.3 : 0);
      if (T.chefe) { if (d < 22) chefeV = e; e.hp.style.display = 'none'; return; }
      // barrinha de vida
      if (e.vida < e.max && d < 25) { vH.set(g.x, T.alt + 0.25, g.z); vH.project(cam); if (vH.z < 1 && Math.abs(vH.x) < 1.05 && Math.abs(vH.y) < 1.05) { e.hp.style.display = 'block'; e.hp.style.left = ((vH.x * 0.5 + 0.5) * window.innerWidth) + 'px'; e.hp.style.top = ((-vH.y * 0.5 + 0.5) * window.innerHeight) + 'px'; e.hp.firstChild.style.width = (e.vida / e.max * 100) + '%'; } else e.hp.style.display = 'none'; } else e.hp.style.display = 'none'; });
    if (!golem.estado || golem.estado !== 'ataque' || golem.morto || zona !== 'vila') anel.visible = false;
    const cb = $('chefe'); cb.hidden = !chefeV; if (chefeV) $('chefe-fill').style.width = (chefeV.vida / chefeV.max * 100) + '%'; }

  function combateFrame(dt, p) {
    if (!desmaiado) { semDanoT += dt; if (semDanoT > 5 && vida < VIDA_MAX) vida = Math.min(VIDA_MAX, vida + dt * 3); }
    $('vida-fill').style.width = (vida / VIDA_MAX * 100) + '%'; $('vida-num').textContent = Math.ceil(vida); $('vida').classList.toggle('baixa', vida < 30);
    atkT += dt; comboT -= dt; atkCd -= dt; if (!atkHit && atkT > 0.12) { atkHit = true; golpe(); }
    ferasFrame(dt, p);
    for (let i = virotes.length - 1; i >= 0; i--) { const v = virotes[i]; v.t += dt; v.m.position.x += v.dx * 30 * dt; v.m.position.z += v.dz * 30 * dt; const e = acertaFera(v.m.position, 0.5); if (e) { dano(e, ARMAS.besta.dano, null); v.t = 9; } if (v.t > 0.6) { world.remove(v.m); virotes.splice(i, 1); } }
    for (let i = RAIOS.length - 1; i >= 0; i--) { const r = RAIOS[i]; r.t += dt; r.s.material.opacity = 1 - r.t / 0.3; if (r.t > 0.3) { world.remove(r.s); r.s.material.dispose(); RAIOS.splice(i, 1); } }
    for (let i = LOOT.length - 1; i >= 0; i--) { const l = LOOT[i]; l.t += dt; l.s.visible = l.zona === zona && !dentro; if (!l.s.visible) continue; const s = l.s.position; s.y = 0.5 + Math.sin(gT * 3 + i) * 0.12;
      const d = Math.hypot(s.x - p.x, s.z - p.z); if (l.puxa || (d < 3 && l.t > 0.6)) { const k = clamp(dt * (l.puxa ? 6 : 4)); s.x += (p.x - s.x) * k; s.z += (p.z - s.z) * k; }
      if (d < 1.0 && l.t > 0.4) { AR.inv[l.item] = (AR.inv[l.item] || 0) + l.n; salvaAR(); atualizaInv(); numero(p, '+' + l.n + ' ' + ITENS[l.item], '#ffd23c', 2.4); if (l.item === 'coracao') aviso('💎 Coração de Gelo! O ferreiro da Forja faz uma Espada Glacial com ele.', '#7ad8ff'); world.remove(l.s); LOOT.splice(i, 1); }
      else if (l.t > 90) { world.remove(l.s); LOOT.splice(i, 1); } } }
  function combateAlvo(p) { if (zona === 'vila' && !dentro && Math.hypot(p.x - FX0, p.z - FZ0) < 2.4) return { acao: abrirLoja, rot: 'FORJA' }; return null; }
  tapBtn($('atacar'), atacar); tapBtn($('arma'), trocaArma); tapBtn($('inv-cw'), comer);
  window.addEventListener('keydown', e => { if (e.code === 'KeyF' || e.code === 'KeyJ') atacar(); if (e.code === 'KeyQ') trocaArma(); if (e.code === 'KeyC') comer(); });
  mostraArma(); atualizaInv();
  SABER.forEach(sb => { if (!sb.el) { const d = document.createElement('div'); d.className = 'tag'; d.textContent = sb.t; $('saber').appendChild(d); sb.el = d; } });

  window.__dbg = { irValdren, Q, heroi, ativo, AR, FERAS, golem, atacar, get vida() { return vida; }, set vida(v) { vida = v; }, abrirLoja, usarPoder: id => usarPoder(PW[id]), acao: () => acao(), get alvo() { return alvo; } };
  // ---------- laço do jogo ----------
  let vy = 0, noChao = true, facing = 0, vel = 0, gT = 0, last = performance.now();
  const ANDAR = 3.0, CORRER = 6.5, GRAV = 22, PULO = 7.6; const tmp = new T3.Vector3();
  heroi.position.set(0, 0, 4.2); heroi.rotation.y = Math.PI; facing = Math.PI;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; gT += dt;
    setMode(dentro ? 'casa' : modo); const noite = modo === 'noite';
    let ix = input.x, iy = input.y; if (keys.KeyA || keys.ArrowLeft) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1; if (keys.KeyW || keys.ArrowUp) iy -= 1; if (keys.KeyS || keys.ArrowDown) iy += 1;
    if (conversa || cenaQ || !$('fim').hidden || Q.naCarroca || desmaiado) { ix = 0; iy = 0; }
    const mag = Math.min(1, Math.hypot(ix, iy)); const correndo = input.run || keys.ShiftLeft || mag > 0.92;
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw); let mx = fx * -iy + -fz * ix, mz = fz * -iy + fx * ix; const ml = Math.hypot(mx, mz);
    vel = lerp(vel, mag > 0.08 ? (correndo ? CORRER : ANDAR) * (ativo.vento ? 1.6 : 1) * mag : 0, clamp(dt * 8));
    if (ml > 0.001 && mag > 0.08) { mx /= ml; mz /= ml; const want = Math.atan2(mx, mz); let d = want - facing; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; facing += d * clamp(dt * 12); }
    const p = heroi.position; const dash = dashT > 0 ? 22 : 0; dashT -= dt; p.x += Math.sin(facing) * (vel + dash) * dt; p.z += Math.cos(facing) * (vel + dash) * dt;
    if (zona === 'valdren') { colide(p, COLV); const rx = p.x - VX, r = Math.hypot(rx, p.z); if (r > 44) { p.x = VX + rx * 44 / r; p.z *= 44 / r; } } else if (dentro) { p.x = clamp(p.x, IX - 4.6, IX + 4.6); p.z = clamp(p.z, -4.6, 4.6); colide(p, COLC); } else { colide(p, COL); const r = Math.hypot(p.x, p.z + 6); if (r > 60) { p.x *= 60 / r; } }
    if (input.jump && noChao && !conversa) { vy = saltoPronto ? PULO * 1.75 : PULO; if (saltoPronto) { burstT = 0; burstP = [p.x, p.y, p.z]; } saltoPronto = false; noChao = false; } input.jump = false;
    if (!noChao) { vy -= GRAV * dt; if (ativo.planar && vy < -1.6) vy = -1.6; p.y += vy * dt; if (p.y <= 0) { p.y = 0; vy = 0; noChao = true; } }
    heroi.rotation.y = facing;
    if (!noChao) pose(heroi, gT, { mood: 'smile', arms: { shL: [-2.6, 0, -0.3], shR: [-2.6, 0, 0.3], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] }, legs: { thL: -0.9, knL: 1.4, thR: -0.3, knR: 0.6 } });
    else if (vel > 0.4) pose(heroi, gT, vel > 4.2 ? { run: true, mood: 'smile' } : { walk: true, mood: 'neutral' });
    else pose(heroi, gT, { mood: conversa ? 'smile' : 'neutral' });
    armaPose();
    sombra.position.set(p.x, 0.012, p.z); sombra.material.opacity = 0.2 * (1 - clamp(p.y / 4));
    // personagens: olham pro herói quando ele chega perto
    alvo = null; let melhor = 2.6;
    NPCS.forEach(n => { const c = n.c; c.visible = !dentro && zona === 'vila'; if (!c.visible) return; const dx = p.x - n.x, dz = p.z - n.z, d = Math.hypot(dx, dz);
      const want = d < 5 ? Math.atan2(dx, dz) : n.ry0; let a = want - c.rotation.y; while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; c.rotation.y += a * clamp(dt * 4);
      const falando = conversa && conversa.quem === n && voz && !voz.paused && !voz.ended; const o = { mood: falando ? (n.deusa ? 'smile' : 'smile') : 'neutral', talk: falando, look: [0, d < 5 ? -0.1 : 0] };
      if (n.deusa) { o.arms = { shL: [-0.35, 0, -0.15], elL: [-0.55, 0, 0] }; c.position.y = 0.25 + Math.sin(gT * 1.6) * 0.12; elyAura.position.set(n.x, 1.6 + c.position.y, n.z); elyAura.visible = true; const P = c.userData.P; P.staff.rotation.x = -(P.shL.rotation.x + P.elL.rotation.x); }
      pose(c, gT, o); if (n.deusa) { const P = c.userData.P; P.staff.rotation.x = -(P.shL.rotation.x + P.elL.rotation.x); P.staff.rotation.z = -(P.shL.rotation.z + P.elL.rotation.z); }
      if (d < melhor) { melhor = d; alvo = n; } });
    elyAura.visible = !dentro && zona === 'vila'; heroi.visible = true; const alV = valdrenFrame(dt, p); if (zona === 'valdren') alvo = alV; $('tit').textContent = zona === 'valdren' ? 'VALDREN' : 'BRUMAFRIA';
    if (dentro) { OBJS.forEach(o => { const d = Math.hypot(p.x - o.x, p.z - o.z); if (d < 1.9 && d < melhor) { melhor = d; alvo = o; } }); if (Math.hypot(p.x - (IX - 1), p.z - 4.4) < 1.3) alvo = { tipo: 'sair' }; }
    else if (zona === 'vila') { const dp = casaFamilia.localToWorld(new T3.Vector3(casaFamilia.userData.door[0], 0, casaFamilia.userData.door[1] - 0.6)); if (Math.hypot(p.x - dp.x, p.z - dp.z) < 1.3) alvo = { tipo: 'entrar' }; }
    if (!conversa) { const alC = combateAlvo(p); if (alC) alvo = alC; }
    const btn = $('acao'); btn.hidden = !alvo || !!conversa || !!cenaQ; if (alvo) btn.textContent = alvo.rot || (alvo.tipo === 'entrar' ? 'ENTRAR' : alvo.tipo === 'sair' ? 'SAIR' : alvo.falas && !alvo.c ? 'VER' : 'FALAR');
    // ambiente
    moon.visible = noite && !dentro; sunBall.visible = !noite && !dentro; WIN.forEach(w => w.material.opacity = noite ? 0.8 : 0.15); if (zona === 'valdren') { moon.position.set(VX - 30, 40, -90); sunBall.position.set(VX + 40, 50, -100); } else { moon.position.set(-30, 40, -90); sunBall.position.set(40, 50, -100); }
    nuvens.forEach((c, i) => { c.visible = !dentro; c.position.x += dt * (0.5 + (i % 3) * 0.2); if (c.position.x > 140) c.position.x = -140; });
    neve.visible = !dentro && zona === 'vila'; if (neve.visible) neve.userData.place((i, d) => { const R = rng(i + 91); const k = ((gT * (0.08 + R() * 0.06) + R()) % 1); d.position.set(p.x + (R() - .5) * 30 + Math.sin(gT + i) * 0.4, 12 - k * 12, p.z + (R() - .5) * 30); d.scale.setScalar(d.position.distanceTo(cam.position) < 2.5 ? 0.0001 : 0.03 + R() * 0.04); });
    fumaca.visible = !dentro && zona === 'vila'; if (fumaca.visible) fumaca.userData.place((i, d) => { const c = CHIM[i % CHIM.length]; const R = rng(i + 5); const k = ((gT * 0.12 + R()) % 1); c[0].updateMatrixWorld(); v3.set(c[1], c[2], c[3]); c[0].localToWorld(v3); d.position.set(v3.x + k * 1.6 + Math.sin(gT + i) * 0.2, v3.y + k * 4, v3.z); d.scale.setScalar(0.25 + k * 0.9); });
    fogoL.intensity = dentro ? 3.2 + Math.sin(gT * 13) * 0.4 : 0; chamas.forEach((f, i) => f.scale.y = 0.5 * (1 + Math.sin(gT * 15 + i * 2) * 0.2));
    poderesFrame(dt, p); combateFrame(dt, p); miniT += dt; if (miniT > 0.08) { miniT = 0; desenhaMini(p); }
    // câmera
    if (camId === null && vel > 0.5 && !dentro) { let d = (facing + Math.PI) - camYaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; camYaw += d * clamp(dt * 0.9); }
    const cd = dentro ? Math.min(camDist, 3.8) : camDist; const cp = dentro ? Math.max(camPitch, 0.45) : camPitch;
    let cx = p.x + Math.sin(camYaw) * Math.cos(cp) * cd, cz = p.z + Math.cos(camYaw) * Math.cos(cp) * cd; const cy = p.y + 1.0 + Math.sin(cp) * cd;
    if (dentro) { cx = clamp(cx, IX - 4.7, IX + 4.7); cz = clamp(cz, -4.7, 4.7); }
    if (cam.position.distanceTo(tmp.set(cx, cy, cz)) > 30) cam.position.copy(tmp); else cam.position.lerp(tmp, clamp(dt * 10));
    if (tremor > 0) { tremor -= dt; cam.position.x += (Math.random() - .5) * tremor; cam.position.y += (Math.random() - .5) * tremor; }
    cam.lookAt(p.x, p.y + 0.95, p.z);
    sun.position.set(p.x + 12, 30, p.z + 10); sun.target.position.set(p.x, 0, p.z); sun.target.updateMatrixWorld();
    renderer.render(scene, cam); requestAnimationFrame(loop);
  }
  cam.position.set(0, 2.6, 9.6); requestAnimationFrame(loop);
  mostrarLugar('Vila de Brumafria');
  setTimeout(() => $('dica').classList.add('some'), 7000);
})();
