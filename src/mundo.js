  // ===================== MUNDO: rio com ponte, Pousada do Meio, perigos da estrada, montarias e pet dragão =====================
  // ---- ajuda: ponto da estrada mais perto de um x ----
  function estradaEm(x) { let m = ESTRADA[0], md = 1e9; ESTRADA.forEach(p => { const d = Math.abs(p[0] - x); if (d < md) { md = d; m = p; } }); return m; }
  function ladoEstrada(i) { const a = ESTRADA[Math.max(0, i - 2)], b = ESTRADA[Math.min(ESTRADA.length - 1, i + 2)]; const tx = b[0] - a[0], tz = b[1] - a[1], l = Math.hypot(tx, tz) || 1; return [-tz / l, tx / l, tx / l, tz / l]; }
  const idxEm = x => { let mi = 0, md = 1e9; ESTRADA.forEach((p, i) => { const d = Math.abs(p[0] - x); if (d < md) { md = d; mi = i; } }); return mi; };
  // ---------- RIO COM PONTE ----------
  var RIO = []; { const RX = 138; const ci = idxEm(RX), cp = ESTRADA[ci];
    const P = [[RX - 30, -150], [RX - 8, -100], [RX + 12, -55], [cp[0] - 4, cp[1] - 18], [cp[0], cp[1]], [cp[0] + 6, cp[1] + 22], [RX + 24, 70], [RX + 4, 120], [RX + 22, 185]].map(([x, z]) => new T3.Vector3(x, 0, z));
    const curva = new T3.CatmullRomCurve3(P); const N = 260, pts = curva.getSpacedPoints(N), LG = 10; const pos = [], uv = [], idx = [], mpos = [], midx = []; let d = 0;
    pts.forEach((a, i) => { const b = pts[Math.min(N, i + 1)], c0 = pts[Math.max(0, i - 1)]; const tx = b.x - c0.x, tz = b.z - c0.z, tl = Math.hypot(tx, tz) || 1, lx = -tz / tl, lz = tx / tl; if (i) d += a.distanceTo(pts[i - 1]);
      pos.push(a.x + lx * LG / 2, 0.02, a.z + lz * LG / 2, a.x - lx * LG / 2, 0.02, a.z - lz * LG / 2); uv.push(0, d / 8, 1.2, d / 8); RIO.push([a.x, a.z]);
      [1, -1].forEach(s => { const ex = a.x + lx * s * (LG / 2 + 0.6), ez = a.z + lz * s * (LG / 2 + 0.6); mpos.push(ex + lx * s * 0.9, 0.025, ez + lz * s * 0.9, ex - lx * s * 0.9, 0.025, ez - lz * s * 0.9); }); });
    for (let i = 0; i < N; i++) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); const q = i * 4; [0, 2].forEach(o => midx.push(q + o, q + o + 1, q + o + 4, q + o + 1, q + o + 5, q + o + 4)); }
    const aguaTex = canvasTex(128, 128, (x, w, h) => { x.fillStyle = '#3a9ad8'; x.fillRect(0, 0, w, h); const Rr = rng(77); for (let i = 0; i < 40; i++) { x.strokeStyle = Rr() < 0.5 ? 'rgba(255,255,255,.35)' : 'rgba(30,90,160,.5)'; x.lineWidth = 2; x.beginPath(); const y = Rr() * h, xx = Rr() * w; x.moveTo(xx, y); x.quadraticCurveTo(xx + 10, y - 4, xx + 22, y); x.stroke(); } });
    aguaTex.wrapS = aguaTex.wrapT = T3.RepeatWrapping; RIO.tex = aguaTex;
    const G = new T3.BufferGeometry(); G.setAttribute('position', new T3.Float32BufferAttribute(pos, 3)); G.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2)); G.setIndex(idx); G.computeVertexNormals();
    const agua = new T3.Mesh(G, new T3.MeshBasicMaterial({ map: aguaTex, transparent: true, opacity: 0.92, side: T3.DoubleSide })); agua.renderOrder = 1; world.add(agua);
    const GM = new T3.BufferGeometry(); GM.setAttribute('position', new T3.Float32BufferAttribute(mpos, 3)); GM.setIndex(midx); GM.computeVertexNormals(); world.add(new T3.Mesh(GM, new T3.MeshToonMaterial({ color: '#c8b080', gradientMap: GRAD, side: T3.DoubleSide })));
    // não dá pra atravessar nadando (só pela ponte ou voando)
    pts.forEach((a, i) => { if (i % 2 || Math.hypot(a.x - cp[0], a.z - cp[1]) < 7.5) return; COL.push({ t: 'c', x: a.x, z: a.z, r: LG / 2 - 0.5, cor: '#4aa8e8' }); });
    // ponte de pedra
    const [lx, lz, tx, tz] = ladoEstrada(ci); const ang = Math.atan2(tx, tz); const PT = grp(world, cp[0], 0, cp[1]); PT.rotation.y = ang;
    tb(PT, 0, 0.12, 0, 6.6, 0.24, 15, '#a09888'); for (let k = -7; k <= 7; k++) tb(PT, 0, 0.25, k, 6.4, 0.04, 0.06, '#7a7264');
    [-1, 1].forEach(s => { tb(PT, s * 3.35, 0.7, 0, 0.35, 0.9, 15, '#8a8274'); for (let k = -7; k <= 7; k += 2) tb(PT, s * 3.35, 1.25, k, 0.5, 0.25, 0.5, '#b0a898'); [-7.3, 7.3].forEach(z => { part(PT, CYL, '#8a8274', s * 3.35, 0.9, z, 0.45, 1.8, 0.45); tb(PT, s * 3.35, 2.0, z, 0.5, 0.5, 0.5, '#ffe6a0', true); }); });
    [-4, 0, 4].forEach(z => tb(PT, 0, -0.3, z, 5.6, 0.6, 1.2, '#7a7264')); funde(PT);
    [-1, 1].forEach(s => [-7.3, 7.3].forEach(z => { const v = new T3.Vector3(s * 3.35, 2.0, z).applyAxisAngle(new T3.Vector3(0, 1, 0), ang); WIN.push(glowSpr(world, cp[0] + v.x, 2.0, cp[1] + v.z, 2, '#ffc870', 0.7)); }));
    [-1, 1].forEach(s => { const v = new T3.Vector3(s * 3.35, 0, 0).applyAxisAngle(new T3.Vector3(0, 1, 0), ang); for (let k = -7; k <= 7; k += 1.5) { const w = new T3.Vector3(0, 0, k).applyAxisAngle(new T3.Vector3(0, 1, 0), ang); COL.push({ t: 'c', x: cp[0] + v.x + w.x, z: cp[1] + v.z + w.z, r: 0.3 }); } });
    RIO.ponte = cp; }
  // ---------- POUSADA DO MEIO (vilarejo na estrada) ----------
  var POUSADA; { const i0 = idxEm(232), c = ESTRADA[i0]; const [lx, lz] = ladoEstrada(i0); const cx = c[0] + lx * 16, cz = c[1] + lz * 16; POUSADA = [cx, cz];
    const VL = grp(world); const chao = new T3.Mesh(new T3.CircleGeometry(17, 40), new T3.MeshToonMaterial({ color: '#e0c890', gradientMap: GRAD })); chao.rotation.x = -Math.PI / 2; chao.position.set(cx, 0.012, cz); chao.receiveShadow = true; world.add(chao);
    function casinha(x, z, ry, w, d, cor, telha, alt) { const g = grp(VL, x, 0, z); g.rotation.y = ry; const H = alt || 2.6; tb(g, 0, H / 2, 0, w, H, d, cor); tb(g, 0, 0.15, 0, w + 0.1, 0.3, d + 0.1, '#7a7480'); [-1, 1].forEach(s => tb(g, s * w / 2, H / 2, d / 2 + 0.01, 0.18, H, 0.06, '#4a3424'));
      const rf = part(g, ROOF, telha, 0, H + 1.0, 0, w * 0.82, 2.1, d * 0.82); rf.rotation.y = Math.PI / 4; tb(g, -w * 0.2, 0.75, d / 2 + 0.03, 0.8, 1.5, 0.06, '#7a4a2a'); tb(g, w * 0.22, 1.5, d / 2 + 0.035, 0.7, 0.6, 0.04, '#ffd48a'); COL.push({ t: 'b', x, z, ry, hw: w / 2 + 0.05, hd: d / 2 + 0.05 }); return g; }
    const viraP = (x, z) => Math.atan2(cx - x, cz - z);
    // pousada grande (2 andares) com placa
    { const x = cx + lx * 9, z = cz + lz * 9; const g = casinha(x, z, viraP(x, z), 9, 6, '#d8c09a', '#8a3a2a', 5.2); tb(g, 0, 2.6, 3.01, 9, 0.16, 0.06, '#4a3424'); [-2.6, 2.6].forEach(o => tb(g, o, 4.0, 3.03, 0.8, 0.7, 0.04, '#ffd48a'));
      const tx = canvasTex(320, 96, (q, w, h) => { q.fillStyle = '#6a4424'; q.fillRect(0, 0, w, h); q.strokeStyle = '#3a2410'; q.lineWidth = 8; q.strokeRect(4, 4, w - 8, h - 8); q.fillStyle = '#ffe8b0'; q.font = 'bold 44px sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('POUSADA', w / 2, h / 2 + 2); });
      const pl = new T3.Mesh(new T3.PlaneGeometry(3, 0.9), new T3.MeshBasicMaterial({ map: tx, toneMapped: false })); pl.position.set(x + Math.sin(viraP(x, z)) * 3.1, 3.3, z + Math.cos(viraP(x, z)) * 3.1); pl.rotation.y = viraP(x, z); world.add(pl); }
    [[-10, 2], [-6, -9], [7, -10], [11, 3], [-2, 10]].forEach(([a, b], k) => { const x = cx + lx * a + lz * b * 1, z = cz + lz * a - lx * b; if (Math.hypot(x - c[0], z - c[1]) < 6) return; casinha(x, z, viraP(x, z), 4.2, 3.6, ['#c8b8a0', '#d8c8a8', '#b8a890', '#e0d0b8', '#c0a888'][k], ['#c8503a', '#4a3a4a', '#8a4a2a', '#3a5a7a', '#d0603a'][k]); });
    { const g = grp(VL, cx, 0, cz); part(g, CYL, '#8a8a94', 0, 0.45, 0, 0.9, 0.9, 0.9); part(g, CYL, '#1a2a4a', 0, 0.91, 0, 0.7, 0.02, 0.7); [-1, 1].forEach(s => tb(g, s * 0.8, 1.6, 0, 0.12, 1.6, 0.12, '#5a3a24')); part(g, ROOF, '#4a3a4a', 0, 2.7, 0, 1.2, 0.8, 1.2).rotation.y = Math.PI / 4; COL.push({ t: 'c', x: cx, z: cz, r: 1 }); }
    { const g = grp(VL, cx - lz * 6, 0, cz + lx * 6); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; part(g, CYL, '#6a6a74', Math.cos(a) * 0.9, 0.12, Math.sin(a) * 0.9, 0.3, 0.24, 0.3); } part(g, CONE, '#ff7a1a', 0, 0.45, 0, 0.35, 0.8, 0.35, 0, true); glowSpr(world, cx - lz * 6, 0.8, cz + lx * 6, 3, '#ff9a3a', 0.8); COL.push({ t: 'c', x: cx - lz * 6, z: cz + lx * 6, r: 1.1 }); }
    funde(VL); }
  // ---------- MISSÕES DA ESTRADA ----------
  var MQ = {
    bandidos: { npc: 'Dona Marta', tipo: 'bandido', meta: 15, moedas: 450, xp: 700, icone: '🗡️', titulo: 'BANDIDOS DA ESTRADA', dica: 'Eles só aparecem de NOITE, na beira da estrada.',
      falas: ['Ah, viajante! Bem-vindo à Pousada do Meio.', 'Toda noite uns bandidos encapuzados atacam quem passa pela estrada de Valdren.', 'Se você derrotar 15 deles, eu te pago bem. Eles só aparecem de noite!'],
      fim: ['Quinze bandidos?! A estrada vai ficar tranquila de novo.', 'Toma, é tudo que a pousada juntou: 450 moedas. Obrigada!'] },
    lobos: { npc: 'Bento, o caçador', tipo: 'lobo', noite: true, meta: 10, moedas: 300, xp: 450, icone: '🐺', titulo: 'LOBOS DA NOITE', dica: 'Os lobos da noite rondam a estrada e o rio.',
      falas: ['Psiu! Fala baixo... os lobos da noite estão perto.', 'Depois que o sol cai, a matilha desce pra estrada e pega quem passa.', 'Derrota 10 lobos da noite pra mim? Só aparecem depois que escurece.'],
      fim: ['Dez lobos! Você é melhor que eu com o arco, hein.', 'Aqui sua parte: 300 moedas. Volta quando quiser caçar de novo.'] } };
  AR.mq = AR.mq || {}; Object.keys(MQ).forEach(k => { AR.mq[k] = AR.mq[k] || { estado: 0, n: 0, vezes: 0 }; });
  var mqHud = document.createElement('div'); mqHud.id = 'missao-e'; mqHud.hidden = true; document.body.appendChild(mqHud);
  function mqAtualiza() { const at = Object.keys(MQ).filter(k => AR.mq[k].estado === 1 || AR.mq[k].estado === 2); mqHud.hidden = !at.length;
    mqHud.innerHTML = at.map(k => { const q = MQ[k], s = AR.mq[k]; return s.estado === 2 ? `<b>${q.titulo}</b>✅ Volte pra ${q.npc} na Pousada do Meio` : `<b>${q.titulo}</b>${q.icone} ${s.n} / ${q.meta}`; }).join('<hr>');
    MQ_NPC.forEach(n => { const s = AR.mq[n.q]; n.marca.material.map = marcaT(s.estado === 2 ? '?' : '!', '#ffd23c'); n.marca.userData.on = s.estado !== 1; }); }
  function mqMorte(e) { if (typeof MQ === 'undefined' || !MQ) return; Object.keys(MQ).forEach(k => { const q = MQ[k], s = AR.mq[k]; if (!s || s.estado !== 1 || e.tipo !== q.tipo || (q.noite && !e.noite)) return; s.n++;
      if (s.n >= q.meta) { s.n = q.meta; s.estado = 2; setTimeout(() => aviso('✅ ' + q.titulo + ': completo! Volte pra ' + q.npc + '.', '#7ad87a'), 900); } else if (s.n % 5 === 0) aviso(q.icone + ' ' + s.n + ' / ' + q.meta, '#ffd23c'); salvaAR(); mqAtualiza(); }); }
  function mqFala(k) { const q = MQ[k], s = AR.mq[k], N = q.npc;
    if (s.estado === 1) { falar({ nome: N, falas: [`Ainda faltam ${q.meta - s.n}. ${q.dica}`] }); return; }
    if (s.estado === 2) { falar({ nome: N, falas: q.fim, fim: () => { AR.inv.moedas += q.moedas; s.vezes++; s.estado = 0; s.n = 0; salvaAR(); atualizaInv(); mqAtualiza(); ganhaXp(q.xp, true); numero(heroi.position, '+' + q.moedas + ' 💰', '#ffd23c', 2.4); som('missao_ok', 1, 1); aviso('🏆 Missão completa! +' + q.moedas + ' moedas e +' + q.xp + ' XP', '#ffd23c'); } }); return; }
    falar({ nome: N, falas: q.falas, escolhas: () => [{ t: q.icone + ' <b>Aceitar missão</b><small>' + q.titulo.toLowerCase() + ': ' + q.meta + '</small>', fn: () => { s.estado = 1; s.n = 0; salvaAR(); mqAtualiza(); som('missao', 1, 1); aviso(q.icone + ' Missão aceita! ' + q.dica, '#ffd23c'); } }, { t: 'Agora não', fn: null }] }); }
  var MQ_NPC = []; { const [cx, cz] = POUSADA;
    const marta = makeChar({ skin: '#e8b090', hairStyle: 'long', hairC: '#7a5a3a', top: '#8a3a3a', top2: '#f0e0c0', pants: '#5a3a2a', shoe: '#3a2a1a', iris: '#4a3020', ph: 8.1 }); part(marta.userData.P.hips, CONE, '#8a3a3a', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03); tb(marta.userData.P.spine, 0, 0.05, 0.13, 0.3, 0.5, 0.02, '#f0e0c0');
    const bento = makeChar({ skin: '#c88a5e', hairStyle: 'short', hairC: '#2a1a10', top: '#4a5a3a', top2: '#3a4a2a', pants: '#4a3a2a', shoe: '#3a2a1a', iris: '#2a4a2a', s: 1.05, ph: 9.2 }); { const P = bento.userData.P; part(P.head, CYL, '#5a4a2a', 0, 0.2, 0, 0.3, 0.05, 0.3); part(P.head, CYL, '#5a4a2a', 0, 0.28, 0, 0.17, 0.14, 0.17); const arc = grp(P.spine, 0.05, 0.25, -0.16); arc.rotation.z = 0.5; part(arc, TOR, '#7a5232', 0, 0, 0, 0.4, 0.4, 0.3).rotation.y = Math.PI / 2; }
    [[marta, 'bandidos', 3, 3], [bento, 'lobos', -4, 2]].forEach(([c, q, ox, oz]) => { c.traverse(o => { if (o.isMesh) o.castShadow = true; }); const x = cx + ox, z = cz + oz; const n = { c, nome: MQ[q].npc, x, z, ry: 0, ry0: 0, q, acao: () => mqFala(q) }; c.position.set(x, 0, z); world.add(c); NPCS.push(n); COL.push({ t: 'c', x, z, r: 0.45, npc: n });
      n.marca = new T3.Sprite(new T3.SpriteMaterial({ map: marcaT('!', '#ffd23c'), transparent: true, depthWrite: false, toneMapped: false })); n.marca.scale.set(0.45, 0.6, 1); world.add(n.marca); MQ_NPC.push(n); }); }
  // bandidos e lobos que só aparecem de noite, na beira da estrada
  { const Rr = rng(5150); for (let i = 0; i < 18; i++) { const k = 40 + Math.floor(Rr() * (ESTRADA.length - 80)), c = ESTRADA[k]; if (Math.hypot(c[0] - VX, c[1]) < 70 || Math.hypot(c[0] - POUSADA[0], c[1] - POUSADA[1]) < 26) continue;
      const [lx, lz] = ladoEstrada(k), s = Rr() < 0.5 ? 1 : -1, d = 9 + Rr() * 14; const e = solta(i % 3 === 2 ? 'lobo' : 'bandido', c[0] + lx * s * d, c[1] + lz * s * d); e.noite = true; } }
  // ---------- MONTARIAS (slot próprio) ----------
  var MONT = { lobo_neve: { nome: 'Lobo Gigante das Neves', base: 'lobo', esc: 1.9, vel: 1.9, preco: 1500, topo: 0.92, desc: 'Montaria: +90% de velocidade.' },
    javali_guerra: { nome: 'Javali de Guerra', base: 'javali', esc: 1.6, vel: 1.6, def: 15, preco: 2000, topo: 1.08, desc: 'Montaria: +60% de velocidade e +15% de defesa.', armadura: true },
    moto_astral: { nome: 'Moto Astral Azul', moto: 'astral', vel: 2.3, preco: 3000, desc: 'Montaria: +130% de velocidade. Flutua com energia azul.', sela: 0.3, c1: '#1c2c8a', c2: '#3a5ad8', neon: '#3ad8ff', metal: '#c8d4ec' },
    moto_sombra: { nome: 'Moto Astral Sombra', moto: 'astral', vel: 2.4, preco: 3500, desc: 'Montaria: +140% de velocidade. Preta com energia dourada.', sela: 0.3, c1: '#121218', c2: '#2a2a34', neon: '#ffc23a', metal: '#3a3a48' },
    moto_rubra: { nome: 'Chopper Rubra', moto: 'chopper', vel: 2.2, def: 10, preco: 4000, desc: 'Montaria: +120% de velocidade e +10% de defesa. Escapamento solta fogo.', sela: 0.16, c1: '#b81a1a', c2: '#1a1a1e', neon: '#ff6a2a', metal: '#dfe4ee' },
    tigre_dourado: { nome: 'Tigre Dourado', base: 'lobo', esc: 2.0, vel: 2.1, preco: 2500, topo: 0.92, desc: 'Montaria: +110% de velocidade.', cores: { '#a8b0c0': '#e8902a', '#eef2f8': '#fff0d8', '#ffd23c': '#3aff8a' } } };
  AR.monts = AR.monts || []; var montado = false, montT = 0, MONT3D = {};
  function motoModelo(M) { const g = grp(world), b = grp(g), al = [], rodas = [], fogo = []; const C = M.c1, C2 = M.c2, N = M.neon, MT = M.metal;
    if (M.moto === 'astral') { b.position.y = 0.42;
      part(b, SPH, C, 0, 0.18, 0.1, 0.42, 0.28, 1.25, 0.03); part(b, SPH, C2, 0, 0.3, -0.25, 0.3, 0.22, 0.7, 0.03); part(b, SPH, '#141420', 0, 0.36, 0.55, 0.22, 0.12, 0.38);
      const nz = part(b, CONE, C, 0, 0.16, 1.45, 0.3, 0.9, 0.18, 0.03); nz.rotation.x = Math.PI / 2;
      [-1, 1].forEach(sd => { // lâminas da frente
        const l = part(b, CONE, C2, sd * 0.42, 0.05, 1.25, 0.08, 1.6, 0.03, 0.03); l.rotation.x = Math.PI / 2; l.rotation.y = -sd * 0.08; const l2 = part(b, CONE, MT, sd * 0.5, 0.32, 1.0, 0.05, 1.3, 0.025); l2.rotation.x = Math.PI / 2 + 0.12; l2.rotation.y = -sd * 0.12;
        tb(b, sd * 0.43, 0.06, 0.9, 0.02, 0.03, 1.3, N, true); tb(b, sd * 0.3, 0.26, 0.2, 0.02, 0.03, 1.4, N, true); part(b, SPH, N, sd * 0.22, 0.22, 1.25, 0.06, 0.04, 0.06, 0, true); glowSpr(b, sd * 0.22, 0.22, 1.3, 0.5, N, 0.9);
        tb(b, sd * 0.36, -0.12, -0.1, 0.12, 0.08, 1.4, MT); tb(b, sd * 0.36, -0.17, -0.1, 0.03, 0.02, 1.3, N, true); // esquis
        // ALETAS de trás (abrem parada, fecham acelerando)
        for (let i = 0; i < 2; i++) { const pv = grp(b, sd * (0.18 + i * 0.12), 0.3 + i * 0.08, -0.8); const a = part(pv, CONE, i ? MT : C2, 0, 0.55, 0, 0.07, 1.1, 0.025, 0.03); tb(pv, 0, 0.55, 0.015, 0.012, 0.9, 0.012, N, true); part(pv, SPH, N, 0, 1.08, 0, 0.03, 0.03, 0.03, 0, true); al.push({ pv, sd, i }); } });
      const mot = part(b, CYL, MT, 0, 0.18, -1.05, 0.22, 0.25, 0.22); mot.rotation.x = Math.PI / 2; part(b, CYL, N, 0, 0.18, -1.18, 0.16, 0.02, 0.16, 0, true).rotation.x = Math.PI / 2;
      fogo.push(glowSpr(b, 0, 0.18, -1.3, 0.8, N, 0.9)); const sob = glowSpr(g, 0, 0.08, 0, 2.6, N, 0.45); fogo.push(sob);
      part(b, CYL, '#1a1a22', 0, 0.55, 0.78, 0.015, 0.25, 0.015).rotation.z = Math.PI / 2; [-1, 1].forEach(sd => part(b, SPH, '#1a1a22', sd * 0.14, 0.55, 0.78, 0.035, 0.035, 0.06)); }
    else { // chopper
      const roda = (z, r) => { const w = grp(b, 0, r, z); part(w, TOR, '#1a1a1e', 0, 0, 0, r, r, r * 1.2).rotation.y = Math.PI / 2; const ar = part(w, TOR, MT, 0, 0, 0, r * 0.72, r * 0.72, r * 0.5); ar.rotation.y = Math.PI / 2;
        for (let k = 0; k < 8; k++) { const ra = tb(w, 0, 0, 0, 0.015, r * 1.4, 0.015, MT); ra.rotation.x = k * Math.PI / 8; } part(w, CYL, MT, 0, 0, 0, 0.08, 0.16, 0.08).rotation.z = Math.PI / 2; rodas.push(w); };
      roda(1.05, 0.36); roda(-0.85, 0.38);
      const fork = tb(b, 0, 0.75, 0.85, 0.05, 0.9, 0.05, MT); fork.rotation.x = -0.45; [-1, 1].forEach(sd => { const f = part(b, CYL, MT, sd * 0.1, 0.72, 0.86, 0.03, 0.85, 0.03); f.rotation.x = -0.45; });
      part(b, CYL, MT, 0, 1.12, 0.66, 0.02, 0.8, 0.02).rotation.z = Math.PI / 2; [-1, 1].forEach(sd => { part(b, SPH, '#1a1a1e', sd * 0.38, 1.14, 0.62, 0.035, 0.035, 0.09); });
      part(b, SPH, C, 0, 0.82, 0.38, 0.22, 0.16, 0.38, 0.03); tb(b, 0, 0.88, 0.38, 0.03, 0.02, 0.5, '#ffe08a', true); // tanque com faixa
      part(b, SPH, '#ffe8a0', 0, 0.98, 0.98, 0.1, 0.1, 0.06, 0, true); glowSpr(b, 0, 0.98, 1.05, 0.9, '#fff0b0', 0.8);
      tb(b, 0, 0.55, 0.05, 0.36, 0.34, 0.6, '#3a3a44'); part(b, CYL, MT, 0, 0.5, 0.05, 0.16, 0.36, 0.16).rotation.z = Math.PI / 2; [-1, 1].forEach(sd => part(b, CYL, MT, sd * 0.2, 0.62, 0.1, 0.1, 0.22, 0.1).rotation.x = 0.4);
      tb(b, 0, 0.72, -0.35, 0.34, 0.1, 0.7, C2); part(b, SPH, C, 0, 0.62, -0.85, 0.24, 0.12, 0.45, 0.03); tb(b, 0, 0.92, -0.62, 0.3, 0.32, 0.06, C2);
      [-1, 1].forEach(sd => { const ex = part(b, CYL, MT, sd * 0.24, 0.32, -0.55, 0.05, 1.1, 0.05); ex.rotation.x = Math.PI / 2 - 0.12; fogo.push(glowSpr(b, sd * 0.24, 0.38, -1.15, 0.5, N, 0)); part(b, SPH, '#ff3a2a', sd * 0.16, 0.62, -1.24, 0.04, 0.03, 0.02, 0, true); }); }
    g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; return { g, b, L: [], head: null, al, rodas, fogo, moto: M.moto }; }
  Object.keys(MONT).forEach(k => { const M = MONT[k]; if (M.moto) { MONT3D[k] = motoModelo(M); M.icone = IC('mont_' + k, 'png'); return; } const e = fera(M.base); e.hp.remove(); const g = e.g; g.scale.setScalar(M.esc); g.visible = false;
    if (M.cores) g.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.material.isMeshBasicMaterial) { const h = '#' + o.material.color.getHexString(); if (M.cores[h]) o.material = tm(M.cores[h]); } });
    const sela = grp(e.b, 0, M.topo, 0.02); tb(sela, 0, 0.02, 0, 0.42, 0.08, 0.5, '#8a2a2a'); tb(sela, 0, 0.07, -0.2, 0.36, 0.12, 0.08, '#6a1a1a'); [-1, 1].forEach(s => { tb(sela, s * 0.22, -0.15, 0, 0.03, 0.3, 0.12, '#e2c27a'); tb(sela, s * 0.24, -0.32, 0.02, 0.06, 0.03, 0.1, '#e2c27a'); });
    if (M.armadura) { tb(e.b, 0, 0.7, 0.62, 0.5, 0.25, 0.1, '#9aa4b8'); [-1, 1].forEach(s => tb(e.b, s * 0.42, 0.66, 0, 0.06, 0.4, 0.9, '#9aa4b8')); }
    MONT3D[k] = e; M.icone = IC('mont_' + k, 'png'); });
  function montaria() { return AR.mont && MONT[AR.mont] && AR.monts.includes(AR.mont) ? MONT[AR.mont] : null; }
  function montaVeste(k) { AR.mont = k && AR.monts.includes(k) ? k : null; if (!AR.mont) montar(false); salvaAR(); if (k && MONT[k]) aviso('Montaria: ' + MONT[k].nome + '. Toque em MONTAR!', '#ffc85a'); }
  function montar(on) { if (on && !montaria()) { aviso('Equipe uma montaria (🎒 › Montaria). Tem na loja da Elysia!', '#ffc85a'); return; } if (on && (voando || dentro || zona === 'masmorra')) { aviso('Aqui não dá pra montar.', '#ff8a6a'); return; }
    montado = !!on; som(on ? 'magia' : 'clique', 0.6); if (on) { fx('luz', [heroi.position.x, 0, heroi.position.z], 0.5); } else { heroi.position.y = 0; } }
  var montBtn = document.createElement('button'); montBtn.className = 'btn'; montBtn.id = 'montar'; montBtn.hidden = true; document.body.appendChild(montBtn); tapBtn(montBtn, () => montar(!montado));
  function montFrame(dt) { const M = montaria(), p = heroi.position; if (montado && (!M || voando || dentro || zona === 'masmorra' || desmaiado)) { montado = false; p.y = 0; }
    montBtn.hidden = !M || dentro || zona === 'masmorra' || voando || !!conversa; if (!montBtn.hidden) { const t = montado ? '⤓ DESCER' : '🐾 MONTAR'; if (montBtn.textContent !== t) montBtn.textContent = t; }
    Object.keys(MONT3D).forEach(k => { const e = MONT3D[k], on = montado && AR.mont === k; e.g.visible = on; if (!on) return; montT += dt * (2 + vel * 1.6);
      e.g.position.set(p.x, Math.max(0, p.y - MONT[k].sela), p.z); e.g.rotation.y = facing; if (e.moto) { motoAnima(e, dt); return; } const a = vel > 0.4 ? Math.min(0.75, vel * 0.09) : 0; e.L.forEach((l, i) => { l.rotation.x = Math.sin(montT + (i % 2 ? Math.PI : 0) + (i > 1 ? 0.6 : 0)) * a; }); e.b.position.y = vel > 0.4 ? Math.abs(Math.sin(montT)) * 0.06 : Math.sin(gT * 2) * 0.01; if (e.head) e.head.rotation.x = Math.sin(montT) * a * 0.15; }); }
  Object.keys(MONT).forEach(k => { if (!MONT[k].moto) MONT[k].sela = MONT[k].topo * MONT[k].esc - 0.62; });
  function motoAnima(e, dt) { const rapido = vel > 1.2, k = clamp(vel / 9); e.abre = (e.abre == null ? 1 : e.abre) + ((rapido ? 0 : 1) - (e.abre == null ? 1 : e.abre)) * Math.min(1, dt * 5);
    e.al.forEach(a => { const ab = e.abre; a.pv.rotation.x = -1.25 + ab * 1.0 + a.i * 0.12; a.pv.rotation.z = -a.sd * (0.15 + ab * (0.55 + a.i * 0.3)); });
    if (e.moto === 'astral') { e.b.position.y = 0.42 + Math.sin(gT * 3) * 0.05; e.b.rotation.x = -k * 0.08; e.fogo[0].scale.setScalar(0.6 + k * 1.6 + Math.random() * 0.15); e.fogo[1].material.opacity = 0.3 + Math.sin(gT * 5) * 0.1 + k * 0.15; }
    else { e.rodas.forEach(w => { w.rotation.x += vel * dt / 0.37; }); e.b.position.y = rapido ? Math.sin(gT * 30) * 0.008 : 0; e.fogo.forEach(f => { f.material.opacity = rapido ? 0.6 + Math.random() * 0.4 : 0; f.scale.setScalar(0.3 + k * 0.6 + Math.random() * 0.2); }); } }
  function montPose() { if (montado && MONT[AR.mont] && MONT[AR.mont].moto) { pose(heroi, gT, { mood: 'smile', arms: { shL: [-1.25, 0, -0.22], shR: [-1.25, 0, 0.22], elL: [-0.25, 0, 0], elR: [-0.25, 0, 0] }, legs: { thL: -1.25, knL: 1.0, thR: -1.25, knR: 1.0 } }); const P = heroi.userData.P; P.thL.rotation.z = -0.28; P.thR.rotation.z = 0.28; P.spine.rotation.x = 0.35; return true; } if (!montado) return false; const b = Math.sin(montT) * 0.04; pose(heroi, gT, { mood: 'smile', arms: { shL: [-0.7, 0, -0.25], shR: [-0.7, 0, 0.25], elL: [-0.9, 0, 0], elR: [-0.9, 0, 0] }, legs: { thL: -1.45 + b, knL: 1.5, thR: -1.45 - b, knR: 1.5 } }); const P = heroi.userData.P; P.thL.rotation.z = -0.35; P.thR.rotation.z = 0.35; return true; }
  // ---------- PET DRAGÃO ----------
  var PETS = { dragao: { nome: 'Dragãozinho de Fogo', preco: 3000, desc: 'Pet: voa do seu lado e cospe bolas de fogo nos bichos.' } }; AR.pets = AR.pets || [];
  var PET3D = grp(world); PET3D.visible = false; var petAsas = []; { const c = '#d83a2a', c2 = '#ffb03a', B = grp(PET3D);
    part(B, SPH, c, 0, 0, 0, 0.22, 0.2, 0.32, 0.04); part(B, SPH, c2, 0, -0.06, 0.06, 0.15, 0.13, 0.24); const h = grp(B, 0, 0.16, 0.3); part(h, SPH, c, 0, 0, 0, 0.17, 0.15, 0.19, 0.04); part(h, SPH, c, 0, -0.04, 0.16, 0.1, 0.08, 0.12, 0.03);
    [-1, 1].forEach(s => { const o = part(h, CONE, '#f4ecd8', s * 0.08, 0.15, -0.06, 0.035, 0.16, 0.035); o.rotation.x = -0.6; part(h, SPH, '#ffe24a', s * 0.075, 0.04, 0.13, 0.035, 0.04, 0.02, 0, true); });
    for (let i = 0; i < 4; i++) part(B, CONE, c2, 0, 0.17, 0.15 - i * 0.12, 0.04, 0.1, 0.04);
    const cauda = part(B, CONE, c, 0, 0, -0.5, 0.09, 0.45, 0.09, 0.03); cauda.rotation.x = -Math.PI / 2 - 0.2; part(B, CONE, c2, 0, 0.06, -0.74, 0.07, 0.12, 0.03).rotation.x = -Math.PI / 2;
    const memb = new T3.MeshToonMaterial({ color: '#ff7a3a', gradientMap: GRAD, side: T3.DoubleSide }); const sh = new T3.Shape(); sh.moveTo(0, 0); sh.lineTo(0.5, 0.25); sh.lineTo(0.62, -0.05); sh.lineTo(0.42, -0.02); sh.lineTo(0.38, -0.18); sh.lineTo(0.2, -0.08); sh.lineTo(0, -0.12); const wg = new T3.ShapeGeometry(sh);
    [-1, 1].forEach(s => { const pv = grp(B, s * 0.12, 0.1, 0); const w = grp(pv); w.scale.x = s; w.rotation.x = Math.PI / 2; w.add(new T3.Mesh(wg, memb)); petAsas.push(pv); });
    [[-1, 0.12], [1, 0.12], [-1, -0.12], [1, -0.12]].forEach(([s, z]) => part(B, CYL, c, s * 0.1, -0.17, z, 0.04, 0.12, 0.04));
    glowSpr(PET3D, 0, 0, 0, 1.0, '#ff8a3a', 0.35); PET3D.traverse(o => { if (o.isMesh) o.castShadow = true; }); PETS.dragao.icone = IC('pet_dragao', 'png'); }
  var petT = 0, petCd = 1;
  function petFrame(dt) { const on = AR.pet === 'dragao' && AR.pets.includes('dragao') && !dentro; PET3D.visible = on; if (!on) return; const p = heroi.position; petT += dt;
    const ox = Math.cos(facing) * -0.9 - Math.sin(facing) * 0.7, oz = -Math.sin(facing) * -0.9 - Math.cos(facing) * 0.7; const tx = p.x + ox, tz = p.z + oz, ty = p.y + 2.0 + Math.sin(petT * 2.4) * 0.15;
    PET3D.position.x += (tx - PET3D.position.x) * Math.min(1, dt * 4); PET3D.position.z += (tz - PET3D.position.z) * Math.min(1, dt * 4); PET3D.position.y += (ty - PET3D.position.y) * Math.min(1, dt * 4);
    let alvo = null; petCd -= dt; if (petCd <= 0) { alvo = maisPerto(11); petCd = alvo ? 2.2 : 0.5; }
    const ry = alvo ? Math.atan2(alvo.g.position.x - PET3D.position.x, alvo.g.position.z - PET3D.position.z) : facing; PET3D.rotation.y += Math.atan2(Math.sin(ry - PET3D.rotation.y), Math.cos(ry - PET3D.rotation.y)) * Math.min(1, dt * 6);
    petAsas.forEach((w, i) => { w.rotation.z = (i ? -1 : 1) * (0.2 + Math.sin(petT * 14) * 0.6); });
    if (alvo) { const q = PET3D.position; proj(q.x, q.y, q.z, ry, '#ff7a2a', 14 * atkMult(), 22, 14, { veneno: true, tam: 0.8 }); som('chama', 0.35, 1.4); } }
  function petChama(k) { AR.pet = AR.pet === k ? null : k; salvaAR(); if (AR.pet) { PET3D.position.set(heroi.position.x, heroi.position.y + 2, heroi.position.z); aviso('🐉 ' + PETS[k].nome + ' está com você!', '#ff8a3a'); } }
  function mundoFrame(dt) { montFrame(dt); petFrame(dt); if (RIO.tex) RIO.tex.offset.y -= dt * 0.25; MQ_NPC.forEach(n => { n.marca.visible = !!n.marca.userData.on && zona === 'vila' && !dentro; n.marca.position.set(n.x, 2.75 + Math.sin(gT * 3) * 0.1, n.z); }); }
  SLOTS_EQ.push(['montaria', IC('slot_montaria'), 'Montaria']);
  mqAtualiza();
