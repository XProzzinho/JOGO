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
  { const R = rng(801); for (let i = 0; i < 70; i++) { const a = R() * Math.PI * 2, r = 22 + R() * 34; const x = Math.cos(a) * r, z = Math.sin(a) * r - 6; const g = grp(vil, x, 0, z); const s = 0.8 + R() * 0.8; g.scale.setScalar(s);
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
    { c: pai, nome: 'Pai', x: 1.6, z: -4.9, ry: 0.3, falas: ['Bem-vindo de volta, Leonardo!', 'Você nasceu aqui em Brumafria, numa noite de inverno. Fui eu que te dei esse nome.'] },
    { c: mae, nome: 'Mãe', x: -1.8, z: -5.0, ry: -0.2, falas: ['Meu filho! Você chorou uma vez só quando nasceu...', 'E parecia que olhava pras minhas mãos. Até hoje eu lavo elas antes de te abraçar!'] },
    { c: prof, nome: 'Professor', x: -6.5, z: 3.0, ry: 0.8, falas: ['A Academia Real quer você, garoto.', 'Com tudo que tem na sua cabeça, você pode mudar o reino inteiro.'] },
    { c: kaela, nome: 'Kaela', x: 6.4, z: 3.2, ry: -0.8, falas: ['Esquece os livros. A Guilda dos Aventureiros precisa de você!', 'Lá fora tem dragão, ouro e aventura. Bora?'] },
    { c: mens, nome: 'Mensageiro do Duque', x: 3.4, z: 6.2, ry: Math.PI - 0.4, falas: ['Por ordem do Duque Aldric, você está convocado!', 'Academia, Guilda ou Duque... qual caminho você vai seguir?'] },
    { c: ely, nome: 'Elysia', x: -10, z: -13, ry: 0.6, deusa: true, falas: ['Vamos ver o que você faz com o meu mundo, humano.', 'Bênção concedida: Memória do Mundo Antigo.', 'E um pouco de mana. Porque sem isso você morre na primeira semana.'] },
  ];
  NPCS.forEach(n => { n.c.position.set(n.x, 0, n.z); n.c.rotation.y = n.ry; n.ry0 = n.ry; COL.push({ t: 'c', x: n.x, z: n.z, r: 0.45, npc: n }); });
  const OBJS = [{ nome: 'Pão da avó', x: IX - 2.4, z: -1.2, dentro: true, falas: ['O pão da avó...', 'Desde que nasceu, você lembra da receita inteirinha. Fórmulas, mapas, máquinas... e esse pão.'] },
    { nome: 'Berço', x: IX - 2.6, z: -3.8, dentro: true, falas: ['O seu berço. Foi aqui que tudo começou, numa noite de inverno.'] }];
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
  tapBtn($('ciclo'), () => { if (dentro) return; modo = modo === 'dia' ? 'noite' : 'dia'; $('ciclo').textContent = modo === 'dia' ? '☾' : '☀'; });
  tapBtn($('fala'), () => proximaFala());

  // ---------- conversa e portas ----------
  let dentro = false, alvo = null, conversa = null;
  function acao() { if (conversa) { proximaFala(); return; } if (!alvo) return;
    if (alvo.tipo === 'entrar') { dentro = true; heroi.position.set(IX - 1, 0, 3.6); facing = Math.PI; camYaw = 0; mostrarLugar('Casa da família'); return; }
    if (alvo.tipo === 'sair') { dentro = false; const d = casaFamilia.localToWorld(new T3.Vector3(casaFamilia.userData.door[0], 0, casaFamilia.userData.door[1] + 0.4)); heroi.position.set(d.x, 0, d.z); facing = 0; camYaw = Math.PI; mostrarLugar('Vila de Brumafria'); return; }
    conversa = { quem: alvo, i: 0 }; mostrarFala(); }
  function mostrarFala() { const q = conversa.quem; $('fala-nome').textContent = q.nome; $('fala-txt').textContent = q.falas[conversa.i]; $('fala').hidden = false; $('fala-mais').textContent = conversa.i < q.falas.length - 1 ? 'toque pra continuar ▸' : 'toque pra fechar ✕'; }
  function proximaFala() { if (!conversa) return; conversa.i++; if (conversa.i >= conversa.quem.falas.length) { conversa = null; $('fala').hidden = true; } else mostrarFala(); }
  let lugarT = null; function mostrarLugar(s) { const el = $('lugar'); el.textContent = s; el.classList.add('on'); clearTimeout(lugarT); lugarT = setTimeout(() => el.classList.remove('on'), 2600); }

  // ---------- colisão ----------
  function colide(p, lista) { const r = 0.32; for (const o of lista) {
      if (o.t === 'c') { const dx = p.x - o.x, dz = p.z - o.z, d = Math.hypot(dx, dz), m = o.r + r; if (d < m && d > 1e-4) { p.x = o.x + dx / d * m; p.z = o.z + dz / d * m; } }
      else { const c = Math.cos(-o.ry), s = Math.sin(-o.ry); let lx = (p.x - o.x) * c + (p.z - o.z) * s, lz = -(p.x - o.x) * s + (p.z - o.z) * c; const px = o.hw + r - Math.abs(lx), pz = o.hd + r - Math.abs(lz);
        if (px > 0 && pz > 0) { if (px < pz) lx += Math.sign(lx) * px; else lz += Math.sign(lz) * pz; p.x = o.x + lx * c - lz * s; p.z = o.z + lx * s + lz * c; } } } }

  // ---------- laço do jogo ----------
  let vy = 0, noChao = true, facing = 0, vel = 0, gT = 0, last = performance.now();
  const ANDAR = 3.0, CORRER = 6.5, GRAV = 22, PULO = 7.6; const tmp = new T3.Vector3();
  heroi.position.set(0, 0, 4.2); heroi.rotation.y = Math.PI; facing = Math.PI;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; gT += dt;
    setMode(dentro ? 'casa' : modo); const noite = modo === 'noite';
    let ix = input.x, iy = input.y; if (keys.KeyA || keys.ArrowLeft) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1; if (keys.KeyW || keys.ArrowUp) iy -= 1; if (keys.KeyS || keys.ArrowDown) iy += 1;
    if (conversa) { ix = 0; iy = 0; }
    const mag = Math.min(1, Math.hypot(ix, iy)); const correndo = input.run || keys.ShiftLeft || mag > 0.92;
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw); let mx = fx * -iy + -fz * ix, mz = fz * -iy + fx * ix; const ml = Math.hypot(mx, mz);
    vel = lerp(vel, mag > 0.08 ? (correndo ? CORRER : ANDAR) * mag : 0, clamp(dt * 8));
    if (ml > 0.001 && mag > 0.08) { mx /= ml; mz /= ml; const want = Math.atan2(mx, mz); let d = want - facing; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; facing += d * clamp(dt * 12); }
    const p = heroi.position; p.x += Math.sin(facing) * vel * dt; p.z += Math.cos(facing) * vel * dt;
    if (dentro) { p.x = clamp(p.x, IX - 4.6, IX + 4.6); p.z = clamp(p.z, -4.6, 4.6); colide(p, COLC); } else { colide(p, COL); const r = Math.hypot(p.x, p.z + 6); if (r > 60) { p.x *= 60 / r; } }
    if (input.jump && noChao && !conversa) { vy = PULO; noChao = false; } input.jump = false;
    if (!noChao) { vy -= GRAV * dt; p.y += vy * dt; if (p.y <= 0) { p.y = 0; vy = 0; noChao = true; } }
    heroi.rotation.y = facing;
    if (!noChao) pose(heroi, gT, { mood: 'smile', arms: { shL: [-2.6, 0, -0.3], shR: [-2.6, 0, 0.3], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] }, legs: { thL: -0.9, knL: 1.4, thR: -0.3, knR: 0.6 } });
    else if (vel > 0.4) pose(heroi, gT, vel > 4.2 ? { run: true, mood: 'smile' } : { walk: true, mood: 'neutral' });
    else pose(heroi, gT, { mood: conversa ? 'smile' : 'neutral' });
    sombra.position.set(p.x, 0.012, p.z); sombra.material.opacity = 0.2 * (1 - clamp(p.y / 4));
    // personagens: olham pro herói quando ele chega perto
    alvo = null; let melhor = 2.6;
    NPCS.forEach(n => { const c = n.c; c.visible = !dentro; if (dentro) return; const dx = p.x - n.x, dz = p.z - n.z, d = Math.hypot(dx, dz);
      const want = d < 5 ? Math.atan2(dx, dz) : n.ry0; let a = want - c.rotation.y; while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; c.rotation.y += a * clamp(dt * 4);
      const falando = conversa && conversa.quem === n; const o = { mood: falando ? (n.deusa ? 'smile' : 'smile') : 'neutral', talk: falando, look: [0, d < 5 ? -0.1 : 0] };
      if (n.deusa) { o.arms = { shL: [-0.35, 0, -0.15], elL: [-0.55, 0, 0] }; c.position.y = 0.25 + Math.sin(gT * 1.6) * 0.12; elyAura.position.set(n.x, 1.6 + c.position.y, n.z); elyAura.visible = true; const P = c.userData.P; P.staff.rotation.x = -(P.shL.rotation.x + P.elL.rotation.x); }
      pose(c, gT, o); if (n.deusa) { const P = c.userData.P; P.staff.rotation.x = -(P.shL.rotation.x + P.elL.rotation.x); P.staff.rotation.z = -(P.shL.rotation.z + P.elL.rotation.z); }
      if (d < melhor) { melhor = d; alvo = n; } });
    elyAura.visible = !dentro; heroi.visible = true;
    if (dentro) { OBJS.forEach(o => { const d = Math.hypot(p.x - o.x, p.z - o.z); if (d < 1.9 && d < melhor) { melhor = d; alvo = o; } }); if (Math.hypot(p.x - (IX - 1), p.z - 4.4) < 1.3) alvo = { tipo: 'sair' }; }
    else { const dp = casaFamilia.localToWorld(new T3.Vector3(casaFamilia.userData.door[0], 0, casaFamilia.userData.door[1] - 0.6)); if (Math.hypot(p.x - dp.x, p.z - dp.z) < 1.3) alvo = { tipo: 'entrar' }; }
    const btn = $('acao'); btn.hidden = !alvo || !!conversa; if (alvo) btn.textContent = alvo.tipo === 'entrar' ? 'ENTRAR' : alvo.tipo === 'sair' ? 'SAIR' : alvo.falas && !alvo.c ? 'VER' : 'FALAR';
    // ambiente
    moon.visible = noite && !dentro; sunBall.visible = !noite && !dentro; WIN.forEach(w => w.material.opacity = noite ? 0.8 : 0.15);
    nuvens.forEach((c, i) => { c.visible = !dentro; c.position.x += dt * (0.5 + (i % 3) * 0.2); if (c.position.x > 140) c.position.x = -140; });
    neve.visible = !dentro; if (!dentro) neve.userData.place((i, d) => { const R = rng(i + 91); const k = ((gT * (0.08 + R() * 0.06) + R()) % 1); d.position.set(p.x + (R() - .5) * 30 + Math.sin(gT + i) * 0.4, 12 - k * 12, p.z + (R() - .5) * 30); d.scale.setScalar(d.position.distanceTo(cam.position) < 2.5 ? 0.0001 : 0.03 + R() * 0.04); });
    fumaca.visible = !dentro; if (!dentro) fumaca.userData.place((i, d) => { const c = CHIM[i % CHIM.length]; const R = rng(i + 5); const k = ((gT * 0.12 + R()) % 1); c[0].updateMatrixWorld(); v3.set(c[1], c[2], c[3]); c[0].localToWorld(v3); d.position.set(v3.x + k * 1.6 + Math.sin(gT + i) * 0.2, v3.y + k * 4, v3.z); d.scale.setScalar(0.25 + k * 0.9); });
    fogoL.intensity = dentro ? 3.2 + Math.sin(gT * 13) * 0.4 : 0; chamas.forEach((f, i) => f.scale.y = 0.5 * (1 + Math.sin(gT * 15 + i * 2) * 0.2));
    // câmera
    if (camId === null && vel > 0.5 && !dentro) { let d = (facing + Math.PI) - camYaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; camYaw += d * clamp(dt * 0.9); }
    const cd = dentro ? Math.min(camDist, 3.8) : camDist; const cp = dentro ? Math.max(camPitch, 0.45) : camPitch;
    let cx = p.x + Math.sin(camYaw) * Math.cos(cp) * cd, cz = p.z + Math.cos(camYaw) * Math.cos(cp) * cd; const cy = p.y + 1.0 + Math.sin(cp) * cd;
    if (dentro) { cx = clamp(cx, IX - 4.7, IX + 4.7); cz = clamp(cz, -4.7, 4.7); }
    if (cam.position.distanceTo(tmp.set(cx, cy, cz)) > 30) cam.position.copy(tmp); else cam.position.lerp(tmp, clamp(dt * 10));
    cam.lookAt(p.x, p.y + 0.95, p.z);
    sun.position.set(p.x + 12, 30, p.z + 10); sun.target.position.set(p.x, 0, p.z); sun.target.updateMatrixWorld();
    renderer.render(scene, cam); requestAnimationFrame(loop);
  }
  cam.position.set(0, 2.6, 9.6); requestAnimationFrame(loop);
  mostrarLugar('Vila de Brumafria');
  setTimeout(() => $('dica').classList.add('some'), 7000);
})();
