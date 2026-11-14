  // ===================== CAPITAL VALDREN: a cidade velha no meio + bairros novos dentro de uma muralha grande =====================
  // Bairros: Praça dos Aventureiros (oeste), Praça do Leilão (leste), Praça dos Portais (norte), Praça dos Campeões com o pódio (sul).
  const CAPT = { R: 112, X: VX, Z: VZ, portais: [], anim: [] };
  { const C = CAPT, G = CAPG, Rr = rng(777);
    const M = (c, o) => new T3.MeshToonMaterial(Object.assign({ color: c, gradientMap: GRAD }, o || {}));
    const ang = (x, z) => Math.atan2(x - C.X, z - C.Z), pol = (a, r) => [C.X + Math.sin(a) * r, C.Z + Math.cos(a) * r];
    const dAng = (a, b) => { let d = a - b; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return Math.abs(d); };
    // portão onde a estrada de Brumafria chega
    let aEstr = Math.PI * -0.75; { let best = 1e9; ESTRADA.forEach(([x, z]) => { const d = Math.abs(Math.hypot(x - C.X, z - C.Z) - C.R); if (d < best) { best = d; aEstr = ang(x, z); } }); }
    const PORTOES = [aEstr, 0, Math.PI, -Math.PI / 2]; // (o leste é o porto, não tem portão) C.portoes = PORTOES;
    const agua = (x, z) => { const lx = x - CAPT.X, lz = z - CAPT.Z; return lx > 22 && lx < 74 && Math.abs(lz) < 52; };
    const ehPortao = (a, r, larg) => PORTOES.some(g => dAng(a, g) * r < larg);
    // ----- muralha grande com torres -----
    { const N = 150, seg = 2 * Math.PI * C.R / N + 0.2; const muro = [], torre = [];
      for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2; if (ehPortao(a, C.R, 7)) continue; { const [wx, wz] = pol(a, C.R); if (Math.hypot(wx - POUSADA[0], wz - POUSADA[1]) < 21) continue; } /* a Pousada fica encostada na muralha: ali vira passagem */ muro.push(a); if (i % 10 === 0) torre.push(a); COL.push({ t: 'c', x: pol(a, C.R)[0], z: pol(a, C.R)[1], r: 2.4 }); }
      PORTOES.forEach(g => [-1, 1].forEach(s => torre.push(g + s * 8.5 / C.R)));
      const m4 = new T3.Matrix4(), q = new T3.Quaternion(), sc = new T3.Vector3(), ps = new T3.Vector3(), up = new T3.Vector3(0, 1, 0);
      const pedra = M('#b9b0a0'), pedra2 = M('#8e8676'), telha = M('#7a2a2a');
      const im = new T3.InstancedMesh(BOX, pedra, muro.length), ameia = new T3.InstancedMesh(BOX, pedra2, muro.length * 2);
      muro.forEach((a, i) => { const [x, z] = pol(a, C.R); q.setFromAxisAngle(up, a + Math.PI / 2); im.setMatrixAt(i, m4.compose(ps.set(x, 3.5, z), q, sc.set(seg, 7, 1.6)));
        [-1, 1].forEach((s, k) => ameia.setMatrixAt(i * 2 + k, m4.compose(ps.set(x + Math.sin(a + Math.PI / 2) * s * seg * 0.25, 7.45, z + Math.cos(a + Math.PI / 2) * s * seg * 0.25), q, sc.set(seg * 0.3, 0.9, 1.7)))); });
      const tc = new T3.InstancedMesh(new T3.CylinderGeometry(2.4, 2.7, 10, 10), pedra, torre.length), tt = new T3.InstancedMesh(new T3.ConeGeometry(3, 3.6, 10), telha, torre.length);
      torre.forEach((a, i) => { const [x, z] = pol(a, C.R); q.identity(); tc.setMatrixAt(i, m4.compose(ps.set(x, 5, z), q, sc.set(1, 1, 1))); tt.setMatrixAt(i, m4.compose(ps.set(x, 11.8, z), q, sc.set(1, 1, 1))); COL.push({ t: 'c', x, z, r: 2.7 }); });
      [im, ameia, tc, tt].forEach(m => { m.instanceMatrix.needsUpdate = true; m.castShadow = true; m.receiveShadow = true; G.add(m); });
      // arcos dos portões com estandarte
      PORTOES.forEach(g => { const [x, z] = pol(g, C.R); const pg = grp(G, x, 0, z); pg.rotation.y = g; const arco = new T3.Mesh(BOX, pedra2); arco.position.y = 8.6; arco.scale.set(17, 2.2, 2.2); arco.castShadow = true; pg.add(arco);
        const b = new T3.Mesh(new T3.PlaneGeometry(3.4, 4.2), new T3.MeshStandardMaterial({ color: '#8a1424', side: T3.DoubleSide })); b.position.set(0, 6.2, 1.2); pg.add(b); const e = new T3.Mesh(new T3.PlaneGeometry(1.6, 1.6), new T3.MeshBasicMaterial({ color: '#ffd23c', side: T3.DoubleSide, toneMapped: false, transparent: true, opacity: 0.9 })); e.position.set(0, 6.6, 1.25); e.rotation.z = Math.PI / 4; e.scale.setScalar(0.6); pg.add(e); }); }
    const PP = pol(Math.PI, 80); C.portaisXZ = PP;
    const ZONAS = [[PRACA.x, PRACA.z, 25], [HX, HZ, 31], [PP[0], PP[1], 21], [MONU.X, MONU.Z + 2.8, 23]];
    const livre = (x, z, m) => !agua(x, z) && !ZONAS.some(([zx, zz, zr]) => Math.hypot(x - zx, z - zz) < zr + m) && !naEstrada(x, z, 7) && !COL.some(o => Math.hypot(o.x - x, o.z - z) < (o.r || Math.max(o.hw || 0, o.hd || 0)) + m) && Math.hypot(x - POUSADA[0], z - POUSADA[1]) > 26;
    const naZona = (x, z, m) => ZONAS.some(([zx, zz, zr]) => Math.hypot(x - zx, z - zz) < zr + m) || Math.hypot(x - POUSADA[0], z - POUSADA[1]) < 22 + m;
    // ----- ruas: avenida em anel + avenidas que saem dos portões até a cidade velha -----
    const ruaM = new T3.MeshToonMaterial({ color: '#cbbf9f', gradientMap: GRAD });
    { const NS = 120; for (let k = 0; k < NS; k++) { const a0 = k / NS * Math.PI * 2, am = a0 + Math.PI / NS; const [mx, mz] = pol(am, 65.5); if (naZona(mx, mz, 3) || agua(mx, mz)) continue; const seg = new T3.Mesh(new T3.RingGeometry(63, 68, 3, 1, a0 - Math.PI / 2, Math.PI * 2 / NS), ruaM); seg.rotation.x = -Math.PI / 2; seg.position.set(C.X, 0.022, C.Z); seg.receiveShadow = true; G.add(seg); }
      PORTOES.forEach(g => { const L = C.R - 46, [x, z] = pol(g, 46 + L / 2); const r = new T3.Mesh(new T3.PlaneGeometry(6, L), ruaM); r.rotation.x = -Math.PI / 2; r.rotation.z = g; r.position.set(x, 0.021, z); r.receiveShadow = true; G.add(r); });
      for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; if (ehPortao(a, 67, 5)) continue; [62.2, 68.8].forEach((rr, k) => { if ((i + k) % 2) return; const [x, z] = pol(a, rr); if (agua(x, z) || !livre(x, z, 0.6)) return; const g = grp(G, x, 0, z); part(g, CYL, '#2a2a34', 0, 1.9, 0, 0.09, 3.8, 0.09); part(g, SPH, '#fff2c0', 0, 3.95, 0, 0.26, 0.3, 0.26, 0, true); glowSpr(g, 0, 3.95, 0, 2.4, '#ffd890', 0.45); COL.push({ t: 'c', x, z, r: 0.25 }); }); } }
    // ----- praça dos portais (norte) -----
    { const g = grp(G, PP[0], 0, PP[1]); const ch = new T3.Mesh(new T3.CircleGeometry(15, 48), M('#d6cdbb')); ch.rotation.x = -Math.PI / 2; ch.position.y = 0.03; ch.receiveShadow = true; g.add(ch);
      const an = new T3.Mesh(new T3.RingGeometry(13.6, 14.3, 64), new T3.MeshBasicMaterial({ color: '#5ae8ff', transparent: true, opacity: 0.6, toneMapped: false })); an.rotation.x = -Math.PI / 2; an.position.y = 0.04; g.add(an);
      const cristal = new T3.Mesh(new T3.OctahedronGeometry(1.1, 0), new T3.MeshBasicMaterial({ color: '#7af0ff', toneMapped: false })); cristal.position.y = 3.2; g.add(cristal); glowSpr(g, 0, 3.2, 0, 6, '#5ae8ff', 0.5); part(g, CYL, '#8a8296', 0, 0.8, 0, 1.2, 1.6, 1.2); COL.push({ t: 'c', x: PP[0], z: PP[1], r: 1.4 }); C.anim.push(() => { cristal.rotation.y += 0.02; cristal.position.y = 3.2 + Math.sin(gT * 2) * 0.25; });
      const DEST = [['vila', '🏠 Brumafria', '#ffd23c'], ['masmorra', '💀 Masmorra', '#a07aff'], ['goblin', '👺 Floresta Goblin', '#4ab84a'], ['colosso', '🌋 Colosso', '#ff6a2a'], ['guilda', '🛡️ Salão das Guildas', '#5ab8ff'], ['pousada', '🏡 Pousada do Meio', '#e8a040'], ['ponte', '🌉 Ponte do Rio', '#4aa8e8']];
      DEST.forEach(([id, nome, cor], i) => { const a = Math.PI * 0.18 + i / (DEST.length - 1) * Math.PI * 1.64, x = Math.sin(a) * 10.5, z = Math.cos(a) * 10.5; const pg = grp(g, x, 0, z); pg.rotation.y = a + Math.PI;
        part(pg, BOX, '#6a6070', -1.3, 1.6, 0, 0.45, 3.2, 0.45); part(pg, BOX, '#6a6070', 1.3, 1.6, 0, 0.45, 3.2, 0.45); part(pg, BOX, '#6a6070', 0, 3.35, 0, 3.1, 0.45, 0.55);
        const pl = new T3.Mesh(new T3.PlaneGeometry(2.15, 2.9), new T3.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.55, side: T3.DoubleSide, toneMapped: false })); pl.position.y = 1.55; pg.add(pl); glowSpr(pg, 0, 1.6, 0, 3.4, cor, 0.45);
        const tx = canvasTex(320, 72, (c, w, h) => { c.fillStyle = '#1a1420'; c.fillRect(0, 0, w, h); c.strokeStyle = cor; c.lineWidth = 5; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#ffe8a0'; c.font = 'bold 30px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(nome, w / 2, h / 2 + 1); });
        [0, Math.PI].forEach(ry => { const pla = new T3.Mesh(new T3.PlaneGeometry(2.9, 0.65), new T3.MeshBasicMaterial({ map: tx, toneMapped: false })); pla.position.set(0, 4.05, ry ? -0.3 : 0.3); pla.rotation.y = ry; pg.add(pla); });
        const wx = PP[0] + x, wz = PP[1] + z; COL.push({ t: 'c', x: wx + Math.cos(a) * 1.3, z: wz - Math.sin(a) * 1.3, r: 0.35 }, { t: 'c', x: wx - Math.cos(a) * 1.3, z: wz + Math.sin(a) * 1.3, r: 0.35 });
        C.portais.push({ id, nome, x: wx, z: wz, g: pg, pl }); }); }
    // ----- casas pra encher a capital -----
    const casas = []; [[54, 9], [74, 10], [90, 10.5], [104, 11]].forEach(([r, passo]) => { const n = Math.floor(2 * Math.PI * r / passo); for (let i = 0; i < n; i++) { const a = (i + (r % 2) * 0.5) / n * Math.PI * 2; if (ehPortao(a, r, 7)) continue; const [x, z] = pol(a, r); const w = 5.2 + Rr() * 2.2, d = 4.6 + Rr() * 1.8, h = 3.4 + Rr() * 2.2;
      if (!livre(x, z, Math.max(w, d) * 0.6)) continue; casas.push({ x, z, a, w, d, h, c: Rr() }); COL.push({ t: 'b', x, z, hw: w / 2 + 0.1, hd: d / 2 + 0.1, ry: a }); } });
    { const corP = ['#e8dcc4', '#d8c8a8', '#efe6d2', '#c9b89a', '#e2d2b8', '#d4c4b0'], corT = ['#8a2a2a', '#3a4a7a', '#6a3a2a', '#2f5a3a', '#7a5a2a'];
      const m4 = new T3.Matrix4(), q = new T3.Quaternion(), q2 = new T3.Quaternion(), sc = new T3.Vector3(), ps = new T3.Vector3(), up = new T3.Vector3(0, 1, 0), cor = new T3.Color();
      const corpo = new T3.InstancedMesh(BOX, new T3.MeshToonMaterial({ color: '#ffffff', gradientMap: GRAD }), casas.length), teto = new T3.InstancedMesh(new T3.ConeGeometry(0.75, 1, 4), new T3.MeshToonMaterial({ color: '#ffffff', gradientMap: GRAD }), casas.length);
      const porta = new T3.InstancedMesh(BOX, M('#4a2c18'), casas.length), jan = new T3.InstancedMesh(BOX, new T3.MeshBasicMaterial({ color: '#ffd890', toneMapped: false }), casas.length * 2), cham = new T3.InstancedMesh(BOX, M('#6a5a50'), casas.length);
      casas.forEach((k, i) => { q.setFromAxisAngle(up, k.a); corpo.setMatrixAt(i, m4.compose(ps.set(k.x, k.h / 2, k.z), q, sc.set(k.w, k.h, k.d))); corpo.setColorAt(i, cor.set(corP[Math.floor(k.c * 6)]));
        q2.setFromAxisAngle(up, k.a + Math.PI / 4); teto.setMatrixAt(i, m4.compose(ps.set(k.x, k.h + 1.2, k.z), q2, sc.set(k.w * 0.98, 2.4, k.d * 0.98).multiplyScalar(1))); teto.setColorAt(i, cor.set(corT[Math.floor(k.c * 37) % 5]));
        const fx0 = -Math.sin(k.a), fz0 = -Math.cos(k.a); // frente da casa virada pro centro
        porta.setMatrixAt(i, m4.compose(ps.set(k.x + fx0 * (k.d / 2 + 0.03), 1.0, k.z + fz0 * (k.d / 2 + 0.03)), q, sc.set(1.1, 2.0, 0.08)));
        [-1, 1].forEach((s, j) => { const ox = Math.cos(k.a) * s * k.w * 0.3, oz = -Math.sin(k.a) * s * k.w * 0.3; jan.setMatrixAt(i * 2 + j, m4.compose(ps.set(k.x + fx0 * (k.d / 2 + 0.04) + ox, k.h * 0.62, k.z + fz0 * (k.d / 2 + 0.04) + oz), q, sc.set(0.8, 0.8, 0.06))); });
        cham.setMatrixAt(i, m4.compose(ps.set(k.x + Math.cos(k.a) * k.w * 0.28, k.h + 1.8, k.z - Math.sin(k.a) * k.w * 0.28), q, sc.set(0.5, 1.4, 0.5))); });
      [corpo, teto, porta, jan, cham].forEach(m => { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.castShadow = m !== jan; m.receiveShadow = true; G.add(m); });
      teto.geometry.rotateY(0); }
    // ----- barracas de feira na avenida -----
    { const listras = canvasTex(64, 64, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#ffffff' : ['#c8202a', '#2a6ac8', '#2a9a4a'][0]; c.fillRect(i * 8, 0, 8, h); } });
      for (let i = 0; i < 24; i++) { const a = (i + 0.5) / 24 * Math.PI * 2; if (ehPortao(a, 60, 9)) continue; const [x, z] = pol(a, 59.6); if (!livre(x, z, 2.2)) continue; const g = grp(G, x, 0, z); g.rotation.y = a;
        part(g, BOX, '#7a4a2a', 0, 0.55, 0, 2.6, 1.1, 1.3); [-1.2, 1.2].forEach(s => part(g, BOX, '#5a3a20', s, 1.5, -0.5, 0.12, 3, 0.12)); const t = new T3.Mesh(new T3.BoxGeometry(3, 0.12, 1.9), new T3.MeshToonMaterial({ map: listras, gradientMap: GRAD })); t.position.set(0, 2.9, -0.2); t.rotation.x = -0.25; g.add(t);
        ['#ff6a3a', '#ffd23c', '#7ad84a', '#c86aff'].forEach((c2, j) => part(g, SPH, c2, -0.9 + j * 0.6, 1.2, 0.2, 0.22, 0.2, 0.22)); COL.push({ t: 'c', x, z, r: 1.4 }); } }
  }
  // ----- monstros que caíram dentro da muralha vão pra fora -----
  FERAS.forEach(e => { if (!e.home || (e.T && e.T.zona && e.T.zona !== 'vila') || e.cal) return; const dx = e.home[0] - CAPT.X, dz = e.home[1] - CAPT.Z, d = Math.hypot(dx, dz); if (d > CAPT.R + 6) return;
    const k = (CAPT.R + 12 + Math.random() * 18) / (d || 1); e.home = [CAPT.X + dx * k, CAPT.Z + dz * k]; e.g.position.set(e.home[0], 0, e.home[1]); });
  // ----- frame: visibilidade, animação e portais -----
  function capitalFrame(dt, p) { const perto = (zona === 'vila' || zona === 'valdren') && !dentro && p.x > 110; CAPG.visible = perto; if (!perto) return null; CAPT.anim.forEach(f => f());
    let al = null; CAPT.portais.forEach(P => { P.pl.material.opacity = 0.45 + Math.sin(gT * 3 + P.x) * 0.15; if (!al && zona === 'vila' && Math.hypot(p.x - P.x, p.z - P.z) < 2.6) al = { rot: 'PORTAL', c: P.g, acao: () => capitalPortal(P) }; });
    // fora da muralha não entra nos monstros: eles não atravessam o muro
    return al; }
  function capitalPortal(P) { if (conversa || cenaQ) return; let L = null; try { L = lugaresMapa().find(l => l.id === P.id); } catch (e) {} if (!L) return; som('portal', 0.8, 1); vaiPara(L); }
  // monstros não entram na capital
  function capitalLimitaFera(g) { const dx = g.x - CAPT.X, dz = g.z - CAPT.Z, d = Math.hypot(dx, dz); if (d < CAPT.R + 3 && d > 1e-3) { g.x = CAPT.X + dx / d * (CAPT.R + 3); g.z = CAPT.Z + dz / d * (CAPT.R + 3); } }
