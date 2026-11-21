  // ===================== ARENA DA LIVE (só ADM): quem entra na live do TikTok vira lutador, batalha sozinho, sobe no ranking; presente = artefato divino =====================
  const ARENA = { on: false, X: -1400, Z: 0, R: 25, lut: {}, plat: {}, maxPlat: 44, max: 30, feed: [], fila: [], cam: { modo: 'orbita', alvo: null, t: 0, a: 0, look: new T3.Vector3() }, volta: null, uiT: 0 };
  /* presentes da live -> poder na arena. nv maior = item mais forte (presente mais caro) */
  const ARENA_PRES = [
    { k: 'rosa', ic: '🌹', nomes: ['rosa', 'rose', 'rosa branca', 'white rose'], preco: '1 moeda', item: 'Espada de Rosa', fx: '+30% de dano', cor: '#ff5a8a', nv: 1, dano: 1.3 },
    { k: 'sorvete', ic: '🍦', nomes: ['casquinha', 'ice cream', 'sorvete'], preco: '1 moeda', item: 'Escudo Gelado', fx: '+60 de vida', cor: '#9ae0ff', nv: 1, vida: 60 },
    { k: 'gg', ic: '🏆', nomes: ['bom jogo', 'gg'], preco: '1 moeda', item: 'Botas GG', fx: '+40% de velocidade', cor: '#ffd84a', nv: 1, vel: 1.4 },
    { k: 'coracao', ic: '❤️', nomes: ['heart me', 'heart', 'coração', 'incrível', 'tiktok', 'finger heart'], preco: '1 moeda', item: 'Coração Vital', fx: 'cura sozinho', cor: '#ff4a5a', nv: 1, regen: 5 },
    { k: 'dino', ic: '🦖', nomes: ['mini dino', 'dino'], preco: 'presente médio', item: 'Emblema Flamejante', fx: 'DIVINO · dano x1,5 · vida 170', cor: '#ff7a2a', nv: 2, div: 'emblema', dano: 1.5, vida: 70 },
    { k: 'controle', ic: '🎮', nomes: ['controle', 'game controller', 'controle de videogame'], preco: '100 moedas', item: 'Astrolábio Arcano', fx: 'DIVINO · dano x1,8 · vida 220', cor: '#7ad8ff', nv: 3, div: 'astrolabio', dano: 1.8, vida: 120 },
    { k: 'bau', ic: '💎', nomes: ['baú', 'bau', 'treasure', 'baú do tesouro'], preco: 'presentes grandes', item: 'Manto do Abismo', fx: 'LENDÁRIO · dano x2,3 · vida 300', cor: '#b07aff', nv: 4, div: 'manto', dano: 2.3, vida: 200, vel: 1.2 }];
  function arenaPresenteDe(nome, dia) { const n = String(nome || '').toLowerCase().trim(); let P = ARENA_PRES.find(p => p.nomes.some(x => n === x)) || ARENA_PRES.find(p => p.nomes.some(x => n.includes(x)));
    const d = +dia || 0; if (d >= 300) P = ARENA_PRES[6]; else if (d >= 100 && (!P || P.nv < 3)) P = ARENA_PRES[5]; else if (d >= 5 && (!P || P.nv < 2)) P = ARENA_PRES[4];
    return P || ARENA_PRES[3]; }
  const ARENA_DIV = [['emblema', 'Emblema Flamejante', '#ff6a2a'], ['astrolabio', 'Astrolábio Arcano', '#7ad8ff'], ['manto', 'Manto do Abismo', '#a07aff']];
  // ----- o lugar: chão de areia, muro, arquibancada, pilares com tochas e estandartes -----
  /* ----- visuais da arena (5 temas). O lugar é sempre o mesmo formato (areia, muro, arquibancada, portão); muda o material e os enfeites ----- */
  const ARENA_TEMAS = [
    { id: 'coliseu', nome: 'Coliseu Clássico', chao: ['#e8c890', '#c49a5a'], grao: [120, 90, 50], aneis: ['#7a1424', '#d8a840', '#7a1424'], sim: '⚔', simC: 'rgba(122,20,36,.75)', pedra: '#a89c8a', pedra2: '#7d7264', faixa: '#8a1424', metal: '#e0b040', fogo: '#ff7a2a', fogoG: '#ff9a3a', fora: '#2a2230', placa: ['#5a0a18', '#ffcf5a', '#ffd86a'],
      ceu: { sky: ['#140a1e', '#3a1a3a'], hemi: 1.1, sun: 1.25, sunC: '#ffd8a0', fog: '#1e1024', fogN: 70, fogF: 200, ground: '#2a2230', rim: '#ff8a5a' } },
    { id: 'gelo', nome: 'Arena Glacial', chao: ['#e8f6ff', '#9ccfe8'], grao: [160, 200, 230], aneis: ['#2a6aa8', '#bfeaff', '#2a6aa8'], sim: '❄', simC: 'rgba(40,110,170,.7)', pedra: '#cfe4f2', pedra2: '#8fb4cc', faixa: '#1e4a8a', metal: '#bfeaff', fogo: '#6adfff', fogoG: '#8af0ff', fora: '#c8dcea', placa: ['#0e2a4a', '#bfeaff', '#e8f8ff'],
      ceu: { sky: ['#06142e', '#1e5a7a'], hemi: 1.15, sun: 1.1, sunC: '#cfeaff', fog: '#10304a', fogN: 70, fogF: 210, ground: '#c8dcea', rim: '#7af0ff' },
      extra(G, R, cx) { const cr = new T3.MeshStandardMaterial({ color: '#9ae4ff', emissive: '#2a9ad8', emissiveIntensity: 0.45, transparent: true, opacity: 0.85, roughness: 0.15, metalness: 0.2 });
        for (let i = 0; i < 46; i++) { const a = Math.random() * Math.PI * 2, r = R + 19 + Math.random() * 22, h = 3 + Math.random() * 9; const m = new T3.Mesh(new T3.ConeGeometry(0.6 + Math.random() * 1.2, h, 5), cr); m.position.set(Math.sin(a) * r, h / 2 - 0.3, Math.cos(a) * r); m.rotation.z = (Math.random() - 0.5) * 0.4; G.add(m); }
        const neve = particles(G, 300, '#ffffff', 0.12); const P = []; for (let i = 0; i < 300; i++) P.push([(Math.random() - 0.5) * 90, Math.random() * 30, (Math.random() - 0.5) * 90, 0.6 + Math.random()]); const m4 = new T3.Matrix4();
        return t => { P.forEach((q, i) => { q[1] -= 0.03 * q[3]; if (q[1] < 0) q[1] = 30; m4.makeScale(0.14, 0.14, 0.14).setPosition(q[0] + Math.sin(t + i) * 0.6, q[1], q[2]); neve.setMatrixAt(i, m4); }); neve.instanceMatrix.needsUpdate = true; }; } },
    { id: 'vulcao', nome: 'Arena Vulcânica', chao: ['#3a2a26', '#1e1614'], grao: [60, 40, 30], aneis: ['#ff5a1a', '#ffb02a', '#ff5a1a'], sim: '🔥', simC: 'rgba(255,90,20,.6)', lava: true, pedra: '#4a3e3a', pedra2: '#2e2624', faixa: '#1a0a08', metal: '#ff6a1a', fogo: '#ff4a0a', fogoG: '#ff6a1a', fora: '#140c0a', placa: ['#1a0604', '#ff6a1a', '#ffb02a'],
      ceu: { sky: ['#1a0402', '#5a1a0a'], hemi: 0.95, sun: 1.15, sunC: '#ffb080', fog: '#2a0a04', fogN: 60, fogF: 190, ground: '#140c0a', rim: '#ff5a1a' },
      extra(G, R) { const lv = new T3.Mesh(new T3.RingGeometry(R - 0.7, R + 0.05, 64), new T3.MeshBasicMaterial({ color: '#ff5a10', toneMapped: false })); lv.rotation.x = -Math.PI / 2; lv.position.y = 0.04; G.add(lv);
        const roc = new T3.MeshToonMaterial({ color: '#2a1e1a', gradientMap: GRAD }); for (let i = 0; i < 26; i++) { const a = Math.random() * Math.PI * 2, r = R + 20 + Math.random() * 20, h = 6 + Math.random() * 14; const m = new T3.Mesh(new T3.ConeGeometry(3 + Math.random() * 3, h, 6), roc); m.position.set(Math.sin(a) * r, h / 2 - 0.5, Math.cos(a) * r); G.add(m); const f = glowSpr(G, m.position.x, h - 0.3, m.position.z, 5, '#ff5a1a', 0.7); }
        const br = particles(G, 160, '#ffa040', 0.1); const P = []; for (let i = 0; i < 160; i++) P.push([(Math.random() - 0.5) * 70, Math.random() * 20, (Math.random() - 0.5) * 70, 0.5 + Math.random()]); const m4 = new T3.Matrix4();
        return t => { lv.material.color.setHSL(0.04 + Math.sin(t * 2) * 0.012, 1, 0.5 + Math.sin(t * 3) * 0.06); P.forEach((q, i) => { q[1] += 0.04 * q[3]; if (q[1] > 22) q[1] = 0; m4.makeScale(0.1, 0.1, 0.1).setPosition(q[0] + Math.sin(t * 0.7 + i) * 0.8, q[1], q[2]); br.setMatrixAt(i, m4); }); br.instanceMatrix.needsUpdate = true; }; } },
    { id: 'celeste', nome: 'Arena Celestial', chao: ['#fffaf0', '#e8dcc0'], grao: [230, 210, 160], aneis: ['#d8a840', '#ffe8a0', '#d8a840'], sim: '☀', simC: 'rgba(216,168,64,.8)', pedra: '#f4efe4', pedra2: '#d8cfbe', faixa: '#e8c050', metal: '#ffd860', fogo: '#fff2b0', fogoG: '#ffe890', fora: '#bfe0ff', placa: ['#fff6e0', '#d8a840', '#a87a20'],
      ceu: { sky: ['#5aa8ff', '#e8f4ff'], hemi: 1.4, sun: 1.5, sunC: '#fff4d0', fog: '#cfe6ff', fogN: 80, fogF: 240, ground: '#bfe0ff', rim: '#fff0b0' },
      extra(G, R) { const ou = new T3.MeshStandardMaterial({ color: '#ffd860', emissive: '#a87a10', emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.25 }); const an = [];
        [[R + 6, 26, 0.35], [R - 4, 30, 0.25], [R + 14, 22, 0.3]].forEach(([r, y, e]) => { const m = new T3.Mesh(new T3.TorusGeometry(r, e, 8, 96), ou); m.rotation.x = Math.PI / 2; m.position.y = y; G.add(m); an.push(m); });
        const nv = new T3.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85 }); for (let i = 0; i < 40; i++) { const a = Math.random() * Math.PI * 2, r = R + 22 + Math.random() * 30; const c = grp(G, Math.sin(a) * r, -1 + Math.random() * 3, Math.cos(a) * r); for (let k = 0; k < 4; k++) { const b = new T3.Mesh(SPH, nv); b.scale.set(3 + Math.random() * 3, 1.4 + Math.random(), 3 + Math.random() * 3); b.position.set((Math.random() - 0.5) * 6, Math.random(), (Math.random() - 0.5) * 6); c.add(b); } }
        return t => { an.forEach((m, i) => { m.rotation.z = t * (0.05 + i * 0.03) * (i % 2 ? -1 : 1); m.position.y += Math.sin(t + i) * 0.004; }); }; } },
    { id: 'neon', nome: 'Arena Neon', chao: ['#14102a', '#06040e'], grao: [60, 40, 120], grade: true, aneis: ['#ff2ad8', '#2af0ff', '#ff2ad8'], sim: '⚡', simC: 'rgba(42,240,255,.8)', pedra: '#1e1a3a', pedra2: '#120e26', faixa: '#ff2ad8', faixaE: true, metal: '#2af0ff', fogo: '#ff2ad8', fogoG: '#ff5ae8', fora: '#06040e', placa: ['#0a0618', '#2af0ff', '#ff5ae8'],
      ceu: { sky: ['#04020c', '#2a0a4a'], hemi: 0.9, sun: 0.9, sunC: '#c8a8ff', fog: '#0a0420', fogN: 60, fogF: 190, ground: '#06040e', rim: '#ff2ad8' },
      extra(G, R) { const led = new T3.Mesh(new T3.TorusGeometry(R + 0.8, 0.12, 6, 96), new T3.MeshBasicMaterial({ color: '#2af0ff', toneMapped: false })); led.rotation.x = Math.PI / 2; led.position.y = 2.45; G.add(led);
        const led2 = new T3.Mesh(new T3.TorusGeometry(R + 15.5, 0.18, 6, 96), new T3.MeshBasicMaterial({ color: '#ff2ad8', toneMapped: false })); led2.rotation.x = Math.PI / 2; led2.position.y = 11; G.add(led2);
        const tor = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2, r = R + 26; const m = new T3.Mesh(new T3.BoxGeometry(1.2, 22, 1.2), new T3.MeshStandardMaterial({ color: '#120e26' })); m.position.set(Math.sin(a) * r, 11, Math.cos(a) * r); G.add(m); const f = new T3.Mesh(new T3.BoxGeometry(1.3, 0.3, 1.3), new T3.MeshBasicMaterial({ color: i % 2 ? '#2af0ff' : '#ff2ad8', toneMapped: false })); f.position.set(m.position.x, 22, m.position.z); G.add(f); tor.push(f); }
        return t => { led.material.color.setHSL((t * 0.08) % 1, 1, 0.55); led2.material.color.setHSL((t * 0.08 + 0.5) % 1, 1, 0.55); tor.forEach((f, i) => { f.position.y = 4 + ((t * 4 + i * 2.5) % 18); }); }; } }];
  let ARENA_TEMA = 4; try { const v = localStorage.getItem('arenaTema2') == null ? 4 : +localStorage.getItem('arenaTema2'); if (v >= 0 && v < ARENA_TEMAS.length) ARENA_TEMA = v; } catch (e) {}
  function arenaCeu() { return ARENA_TEMAS[ARENA_TEMA].ceu; }
  const ARG = { G: grp(world, ARENA.X, 0, ARENA.Z), T: null, tochas: [], up: null }; ARG.G.visible = false;
  function arenaMonta(n) { const TM = ARENA_TEMAS[n] || ARENA_TEMAS[0]; ARENA_TEMA = ARENA_TEMAS.indexOf(TM); if (ARG.T) { ARG.G.remove(ARG.T); ARG.T.traverse(o => { if (o.geometry && o.geometry !== SPH) o.geometry.dispose(); }); }
    const G = grp(ARG.G); ARG.T = G; const R = ARENA.R;
    const tx = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; };
    const areia = tx(1024, 1024, (g, w) => { const c = w / 2; const gr = g.createRadialGradient(c, c, 40, c, c, c); gr.addColorStop(0, TM.chao[0]); gr.addColorStop(1, TM.chao[1]); g.fillStyle = gr; g.fillRect(0, 0, w, w); const [r0, g0, b0] = TM.grao;
      for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${r0 + Math.random() * 60},${g0 + Math.random() * 40},${b0 + Math.random() * 30},.18)`; g.fillRect(Math.random() * w, Math.random() * w, 3, 3); }
      if (TM.grade) { g.strokeStyle = 'rgba(42,240,255,.35)'; g.lineWidth = 2; for (let k = 0; k <= w; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, w); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(w, k); g.stroke(); } }
      if (TM.lava) { g.strokeStyle = '#ff6a1a'; g.shadowColor = '#ff4a00'; g.shadowBlur = 14; for (let k = 0; k < 26; k++) { g.lineWidth = 2 + Math.random() * 4; g.beginPath(); let x = c + (Math.random() - 0.5) * w * 0.9, y = c + (Math.random() - 0.5) * w * 0.9; g.moveTo(x, y); for (let q = 0; q < 6; q++) { x += (Math.random() - 0.5) * 120; y += (Math.random() - 0.5) * 120; g.lineTo(x, y); } g.stroke(); } g.shadowBlur = 0; }
      [[c - 10, 14, TM.aneis[0]], [c * 0.55, 8, TM.aneis[1]], [120, 10, TM.aneis[2]]].forEach(([r, l, cor]) => { g.strokeStyle = cor; g.lineWidth = l; g.beginPath(); g.arc(c, c, r, 0, 7); g.stroke(); });
      g.fillStyle = TM.simC; g.font = 'bold 120px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(TM.sim, c, c); });
    const chao = new T3.Mesh(new T3.CircleGeometry(R, 64), new T3.MeshStandardMaterial({ map: areia, roughness: TM.id === 'gelo' ? 0.35 : 0.95, metalness: TM.id === 'gelo' ? 0.15 : 0 })); chao.rotation.x = -Math.PI / 2; chao.position.y = 0.02; chao.receiveShadow = true; G.add(chao);
    const fora = new T3.Mesh(new T3.CircleGeometry(90, 48), new T3.MeshStandardMaterial({ color: TM.fora, roughness: 1 })); fora.rotation.x = -Math.PI / 2; fora.position.y = 0.005; fora.visible = TM.id !== 'celeste'; G.add(fora);
    const pedra = new T3.MeshToonMaterial({ color: TM.pedra, gradientMap: GRAD }), pedra2 = new T3.MeshToonMaterial({ color: TM.pedra2, gradientMap: GRAD }), verm = TM.faixaE ? new T3.MeshBasicMaterial({ color: TM.faixa, side: T3.DoubleSide, toneMapped: false }) : new T3.MeshStandardMaterial({ color: TM.faixa, roughness: 0.8, side: T3.DoubleSide }), ouro = new T3.MeshStandardMaterial({ color: TM.metal, metalness: 0.7, roughness: 0.3, emissive: TM.id === 'neon' ? TM.metal : '#000', emissiveIntensity: TM.id === 'neon' ? 0.6 : 0 });
    const muro = new T3.Mesh(new T3.CylinderGeometry(R + 0.8, R + 0.8, 2.2, 64, 1, true), pedra.clone()); muro.position.y = 1.1; muro.material.side = T3.DoubleSide; G.add(muro);
    const tampa = new T3.Mesh(new T3.TorusGeometry(R + 0.8, 0.35, 6, 64), ouro); tampa.rotation.x = Math.PI / 2; tampa.position.y = 2.2; G.add(tampa);
    for (let k = 0; k < 6; k++) { const r0 = R + 1.2 + k * 2.2, h = 2.6 + k * 1.3, mt = k % 2 ? pedra : pedra2; const fr = new T3.Mesh(new T3.CylinderGeometry(r0, r0, h, 64, 1, true), mt.clone()); fr.material.side = T3.BackSide; fr.position.y = h / 2; G.add(fr); const tp = new T3.Mesh(new T3.RingGeometry(r0, r0 + 2.2, 64), mt.clone()); tp.material.side = T3.DoubleSide; tp.rotation.x = -Math.PI / 2; tp.position.y = h; G.add(tp); }
    const topo = new T3.Mesh(new T3.CylinderGeometry(R + 16, R + 16, 11, 64, 1, true), pedra2.clone()); topo.position.y = 5.5; topo.material.side = T3.DoubleSide; G.add(topo);
    { const n = 260, im = new T3.InstancedMesh(new T3.CapsuleGeometry(0.28, 0.5, 3, 6), new T3.MeshToonMaterial({ color: '#ffffff', gradientMap: GRAD }), n), m4 = new T3.Matrix4(), c = new T3.Color();
      for (let i = 0; i < n; i++) { const k = i % 5, a = Math.random() * Math.PI * 2, r = R + 2.3 + k * 2.2, y = 2.6 + k * 1.3 + 0.55; m4.makeTranslation(Math.sin(a) * r, y, Math.cos(a) * r); im.setMatrixAt(i, m4); im.setColorAt(i, c.setHSL(Math.random(), 0.55, 0.55)); }
      im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; G.add(im); ARENA.plateia = im; }
    const tochas = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, x = Math.sin(a) * (R + 0.9), z = Math.cos(a) * (R + 0.9);
      const p = new T3.Mesh(new T3.CylinderGeometry(0.55, 0.65, 6.5, 10), pedra); p.position.set(x, 3.25, z); p.castShadow = true; G.add(p); const cap = new T3.Mesh(new T3.CylinderGeometry(0.85, 0.6, 0.5, 10), ouro); cap.position.set(x, 6.7, z); G.add(cap);
      const f = new T3.Mesh(new T3.ConeGeometry(0.42, 1.1, 10), new T3.MeshBasicMaterial({ color: TM.fogo, transparent: true, opacity: 0.9, blending: T3.AdditiveBlending, toneMapped: false })); f.position.set(x, 7.5, z); G.add(f); glowSpr(G, x, 7.4, z, 3.2, TM.fogoG, 0.6); tochas.push(f);
      const b = new T3.Mesh(new T3.PlaneGeometry(1.4, 3.2), verm); b.position.set(x * 0.985, 4.2, z * 0.985); b.rotation.y = a + Math.PI; G.add(b); }
    { const pg = grp(G, 0, 0, -R - 1.2); [-3, 3].forEach(s => { const t = new T3.Mesh(new T3.BoxGeometry(1.6, 9, 1.6), pedra2); t.position.set(s, 4.5, 0); pg.add(t); }); const v = new T3.Mesh(new T3.BoxGeometry(7.6, 1.6, 1.8), pedra2); v.position.y = 9; pg.add(v);
      const [pf, pb, pt] = TM.placa; const pl = new T3.Mesh(new T3.PlaneGeometry(6, 1.2), new T3.MeshBasicMaterial({ map: tx(512, 100, (g, w, h) => { g.fillStyle = pf; g.fillRect(0, 0, w, h); g.strokeStyle = pb; g.lineWidth = 6; g.strokeRect(4, 4, w - 8, h - 8); g.fillStyle = pt; g.font = 'bold 54px serif'; g.textAlign = 'center'; g.fillText('⚔ ARENA DA LIVE ⚔', w / 2, 70); }), toneMapped: false })); pl.position.set(0, 9, 0.95); pg.add(pl); }
    ARG.tochas = tochas; ARG.up = TM.extra ? TM.extra(G, R) : null; G.traverse(o => { if (o.isMesh && o !== chao) o.frustumCulled = true; }); }
  arenaMonta(ARENA_TEMA);
  /* ----- mural dos presentes: o que cada presente da live dá na arena ----- */
  const MURAL = (() => { const c = document.createElement('canvas'); c.width = 2048; c.height = 1152; const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 1152); gr.addColorStop(0, '#3a0a24'); gr.addColorStop(1, '#14081e'); g.fillStyle = gr; g.fillRect(0, 0, 2048, 1152);
    g.strokeStyle = '#ffcf5a'; g.lineWidth = 18; g.strokeRect(14, 14, 2020, 1124); g.lineWidth = 4; g.strokeRect(40, 40, 1968, 1072);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffd86a'; g.font = 'bold 92px system-ui, sans-serif'; g.fillText('🎁 PRESENTES DA LIVE = PODER NA ARENA', 1024, 120);
    g.fillStyle = '#e8d0ff'; g.font = '500 40px system-ui, sans-serif'; g.fillText('Comente LUTAR pra entrar na luta · presente = item de poder · mais caro = mais forte', 1024, 205, 1900);
    const pos = (i) => i < 4 ? [80 + i * 480, 260, 440, 400] : [320 + (i - 4) * 480, 690, 440, 400];
    ARENA_PRES.forEach((P, i) => { const [x, y, w, h] = pos(i); g.fillStyle = P.nv >= 4 ? 'rgba(120,60,200,.45)' : P.nv >= 2 ? 'rgba(200,90,40,.35)' : 'rgba(255,255,255,.08)'; g.beginPath(); g.roundRect(x, y, w, h, 30); g.fill(); g.strokeStyle = P.cor; g.lineWidth = 7; g.stroke();
      g.font = '120px system-ui, sans-serif'; g.fillStyle = '#fff'; g.fillText(P.ic, x + w / 2, y + 85);
      g.fillStyle = P.cor; g.font = 'bold 44px system-ui, sans-serif'; g.fillText(P.item, x + w / 2, y + 185, w - 30);
      g.fillStyle = '#fff'; g.font = '600 34px system-ui, sans-serif'; g.fillText(P.nomes[0].replace(/^./, m => m.toUpperCase()) + ' · ' + P.preco, x + w / 2, y + 235, w - 30);
      g.fillStyle = '#ffe0b0'; g.font = '600 32px system-ui, sans-serif'; const fxs = P.fx.split(' · '); fxs.forEach((t, k) => g.fillText(t, x + w / 2, y + 285 + k * 36, w - 30));
      g.fillStyle = P.cor; g.font = 'bold 30px system-ui, sans-serif'; g.textAlign = 'right'; g.fillText('★'.repeat(P.nv), x + w - 22, y + 32); g.textAlign = 'center'; });
    const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4;
    const R = ARENA.R, mz = R + 12, G = grp(ARG.G, 0, 0, mz); G.rotation.y = Math.PI;
    const tela = new T3.Mesh(new T3.PlaneGeometry(18, 10.1), new T3.MeshBasicMaterial({ map: t, toneMapped: false })); tela.position.y = 15; G.add(tela);
    const mold = new T3.Mesh(new T3.BoxGeometry(19, 11.1, 0.5), new T3.MeshStandardMaterial({ color: '#5a3a1a', metalness: 0.4, roughness: 0.5 })); mold.position.set(0, 15, -0.3); G.add(mold);
    [-8.5, 8.5].forEach(x => { const p = new T3.Mesh(new T3.BoxGeometry(0.8, 11, 0.8), new T3.MeshStandardMaterial({ color: '#4a3020' })); p.position.set(x, 5.5, -0.5); G.add(p); });
    glowSpr(G, -9.6, 20.6, 0.3, 3, '#ffcf5a', 0.6); glowSpr(G, 9.6, 20.6, 0.3, 3, '#ffcf5a', 0.6);
    return { G, x: ARENA.X, z: ARENA.Z + mz, y: 15 }; })();
  // ----- lutadores -----
  function arenaEsc(s) { return String(s == null ? '' : s).replace(/[<>&]/g, '').slice(0, 24); }
  function arenaFotoUrl(u) { u = String(u || ''); return /^https:\/\/[^\s"'<>]+$/.test(u) ? u : ''; }
  function arenaFoto(o, cls) { const h = mpHash(o.id) % 360, ini = (o.nome || '?').replace(/[^\p{L}\p{N}]/gu, '').charAt(0).toUpperCase() || '?';
    return '<span class="ar-fo ' + (cls || '') + '" style="background:hsl(' + h + ',55%,42%)">' + ini + (o.foto ? '<img src="' + o.foto + '" referrerpolicy="no-referrer" loading="lazy" onerror="this.remove()">' : '') + '</span>'; }
  function arenaBoneco(id, esq) { const h = mpHash(id), R = MP_ROUPAS[h % MP_ROUPAS.length];
    if (esq) { const cores = [['#ff3a5a', '#ffd23c', '#3a8aff'], ['#3ad86a', '#ff8a2a', '#c86aff'], ['#ffd23c', '#3a8aff', '#ff3a5a'], ['#c86aff', '#3ad86a', '#ffd23c']][(h >> 4) % 4], cab = ['#ff6a1a', '#3ad8ff', '#ff3ab8', '#7aff3a'][(h >> 6) % 4];
      const c = makeChar({ skin: '#fff4ec', hairStyle: 'bald', hairC: cab, top: cores[0], top2: cores[1], pants: cores[2], shoe: '#e82a2a', iris: '#2a6aff', s: 0.82, ph: (h % 100) / 10 }); const P = c.userData.P;
      try { // nariz, boca, cabelo de palhaço, gola de babado, bolinhas, sapatão
        part(P.head, SPH, '#ff1a2a', 0, 0.075, 0.14, 0.035, 0.035, 0.035, 0, true); part(P.head, SPH, '#e8203a', 0, 0.025, 0.12, 0.06, 0.022, 0.02); part(P.head, SPH, '#ffffff', 0, 0.028, 0.128, 0.042, 0.01, 0.012);
        [-1, 1].forEach(k => { part(P.head, SPH, cab, k * 0.13, 0.12, -0.01, 0.085, 0.085, 0.09, 0.02); part(P.head, SPH, cab, k * 0.1, 0.2, -0.04, 0.07, 0.07, 0.07, 0.02); part(P.head, SPH, '#3a6aff', k * 0.05, 0.16, 0.12, 0.012, 0.03, 0.008); part(P.head, SPH, '#ff8aa8', k * 0.07, 0.07, 0.11, 0.025, 0.018, 0.01); });
        const ch = part(P.head, CONE, cores[1], 0, 0.28, -0.01, 0.06, 0.14, 0.06, 0.02); ch.rotation.z = 0.25; part(P.head, SPH, '#ffffff', -0.035, 0.35, -0.01, 0.025, 0.025, 0.025);
        for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; part(P.spine, SPH, '#ffffff', Math.sin(a) * 0.13, 0.47, Math.cos(a) * 0.11, 0.06, 0.035, 0.06, 0.015); }
        [[0.06, 0.34], [-0.07, 0.24], [0.05, 0.14]].forEach(([x, y], i) => part(P.spine, SPH, ['#ffffff', cores[1], '#ffffff'][i], x, y, 0.135, 0.03, 0.03, 0.015));
        ['ftL', 'ftR'].forEach(k => { if (P[k]) part(P[k], SPH, '#e82a2a', 0, -0.05, 0.1, 0.09, 0.06, 0.17, 0.02); });
        ['elL', 'elR'].forEach(k => { if (P[k]) part(P[k], SPH, '#ffffff', 0, -0.36, 0, 0.065, 0.065, 0.065, 0.015); }); } catch (e) {}
      c.traverse(o => { if (o.isMesh) o.castShadow = true; }); world.add(c); { const ix = CHARS.indexOf(c); if (ix >= 0) CHARS.splice(ix, 1); } return c; }
    const c = makeChar({ skin: MP_PELE[(h >> 3) % MP_PELE.length], hairStyle: ['short', 'long', 'short', 'bald'][(h >> 5) % 4], hairC: MP_CAB[(h >> 7) % MP_CAB.length], top: R[0], top2: R[1], pants: '#3a3040', shoe: '#2a2020', iris: '#3a2a1a', s: 0.9, ph: (h % 100) / 10 });
    c.traverse(o => { if (o.isMesh) o.castShadow = true; }); world.add(c); { const ix = CHARS.indexOf(c); if (ix >= 0) CHARS.splice(ix, 1); } return c; }
  /* ----- arquibancada: quem só assiste fica sentado torcendo ----- */
  const ASSENTOS = (() => { const L = []; for (let k = 1; k <= 4; k++) { const n = 16 + k * 2, r0 = ARENA.R + 1.2 + k * 2.2; for (let i = 0; i < n; i++) { const a = (i + (k % 2) * 0.5) / n * Math.PI * 2; let d1 = Math.abs(((a - Math.PI) + Math.PI * 3) % (Math.PI * 2) - Math.PI), d0 = Math.abs(((a) + Math.PI * 3) % (Math.PI * 2) - Math.PI); if (d0 < 0.32 || d1 < 0.3) continue; L.push({ x: ARENA.X + Math.sin(a) * (r0 + 1.1), z: ARENA.Z + Math.cos(a) * (r0 + 1.1), y: 2.6 + k * 1.3, rot: a + Math.PI, livre: true }); } } return L; })();
  function arenaPlatTira(id) { const S = ARENA.plat[id]; if (!S) return; world.remove(S.c); S.tag.remove(); S.assento.livre = true; delete ARENA.plat[id]; }
  function arenaPlat(id, nome, foto) { let S = ARENA.plat[id]; if (S) { S.t = performance.now(); if (foto && !S.foto) { S.foto = foto; S.h = ''; } return S; }
    const ks = Object.keys(ARENA.plat); if (ks.length >= ARENA.maxPlat) arenaPlatTira(ks.map(k => ARENA.plat[k]).sort((p, q) => p.t - q.t)[0].id);
    const livres = ASSENTOS.filter(a => a.livre); const as = livres[Math.floor(Math.random() * livres.length)]; as.livre = false;
    const c = arenaBoneco(id); c.position.set(as.x, as.y, as.z); c.rotation.y = as.rot;
    const tag = document.createElement('div'); tag.className = 'mp-tag ar-tag sp'; mpTags.appendChild(tag);
    S = ARENA.plat[id] = { id, nome: arenaEsc(nome) || 'Visitante', foto, c, tag, assento: as, x: as.x, y: as.y, z: as.z, rot: as.rot, plat: true, fala: '', falaT: 0, t: performance.now(), h: '', ph: Math.random() * 6 }; return S; }
  const ARENA_ESP = {};
  function arenaNovo(id, nome, foto, esq) { const h = mpHash(id);
    const c = arenaBoneco(id, esq);
    // espada simples na mão direita (cor pela pessoa)
    const esp = grp(c.userData.P.elR, 0, -0.34, 0.06); esp.rotation.x = -1.35; const cor = ['#d8dde8', '#ffd86a', '#ff8a6a', '#8ad8ff', '#c89aff'][(h >> 9) % 5];
    /* espada de verdade do jogo (as 5 espadas que nós fizemos), uma pra cada pessoa */ const lam = null; if (esq) { /* palhaço: sem arma, luta no tapa */ } else { const ks = ['esp_suprema', 'esp_corrompida', 'esp_celestial', 'esp_dragao_real', 'esp_executora'], k = ks[(h >> 9) % ks.length]; let T = ARENA_ESP[k];
      if (!T) { try { const [n, c1, c2] = ESP_DEF[k]; T = ESP_MOD[n]('', c1, c2); T.traverse(o => { if (o.isMesh) o.castShadow = true; }); ARENA_ESP[k] = T; } catch (e) { T = null; } }
      if (T) { const inner = T.clone(true); inner.position.y = 0.42; inner.scale.setScalar(0.75); esp.add(inner); } else { part(esp, BOX, cor, 0, 0.42, 0, 0.07, 0.8, 0.02, 0, true); part(esp, CYL, '#3a2414', 0, -0.1, 0, 0.035, 0.18, 0.035); } }
    const tag = document.createElement('div'); tag.className = 'mp-tag ar-tag'; mpTags.appendChild(tag);
    const a = Math.random() * Math.PI * 2, r = ARENA.R * (0.4 + Math.random() * 0.5);
    const L = { id, nome: arenaEsc(nome) || 'Visitante', foto: foto || '', y: 0, c, tag, x: ARENA.X + Math.sin(a) * r, z: ARENA.Z + Math.cos(a) * r, rot: a + Math.PI, hp: 100, max: 100, kills: 0, mortes: 0, esq: !!esq, alvo: null, cd: 1 + Math.random(), atkT: -9, morto: 0, lam, div: null, divT: '', itens: {}, dano: 1, vel: 1, regen: 0, escudo: null, aura: null, fala: '', falaT: 0, t: performance.now(), h: '' };
    if (esq) { L.hp = L.max = 45; L.dano = 0.85; L.vel = 0.8; tag.classList.add('esq'); }
    c.position.set(L.x, 0, L.z); return L; }
  function arenaLut(id, nome, foto, esq) { let L = ARENA.lut[id]; if (L) { L.t = performance.now(); if (nome && L.nome === 'Visitante') L.nome = arenaEsc(nome); if (foto && !L.foto) { L.foto = foto; L.h = ''; } return L; }
    const ks = Object.keys(ARENA.lut); if (ks.length >= ARENA.max) { const todos = ks.map(k => ARENA.lut[k]), esqs = todos.filter(x => x.esq); if (esq && !esqs.length) return null; const fora = (esqs.length ? esqs : todos).sort((p, q) => (p.kills - q.kills) || (p.t - q.t))[0]; if (esq && fora.kills > 0) return null; arenaTira(fora.id); }
    L = ARENA.lut[id] = arenaNovo(id, nome, foto, esq); fx('luz', [L.x, 0, L.z], 1); try { som('portal', 0.5, 1.2); } catch (e) {} return L; }
  // esqueleto vira guerreiro de verdade (comentou LUTAR ou mandou presente); mantém os pontos
  function arenaVira(L) { const x = L.x, z = L.z, pts = L.kills, mortes = L.mortes, time = L.time; arenaTira(L.id); const N = ARENA.lut[L.id] = arenaNovo(L.id, L.nome, L.foto, false); N.x = x; N.z = z; N.c.position.set(x, 0, z); N.kills = pts; N.mortes = mortes; N.time = time;
    fx('luz', [x, 0, z], 1); fx('fogo', [x, 1, z], 0.6); try { som('magia', 0.6, 1.2); } catch (e) {} arenaFeed('⚔️ ' + arenaFoto(N, 'mi') + ' <b>' + N.nome + '</b> deixou de ser palhaço e virou <b>GUERREIRO</b>!'); arenaFala(N.nome + ' deixou de ser palhaço e virou guerreiro de verdade!', true); arenaFoca(N, 7); return N; }
  function arenaTira(id) { const L = ARENA.lut[id]; if (!L) return; world.remove(L.c); L.tag.remove(); delete ARENA.lut[id]; }
  function arenaDivVisual(L, tipo) { const k = ARENA_DIV.find(x => x[0] === tipo) || ARENA_DIV[0]; if (L.div) { L.c.userData.P.spine.remove(L.div.g); L.div = null; }
    let o = null; try { const sp = L.c.userData.P.spine;
      if (k[0] === 'emblema') { const e = createFieryCrestItem(T3); const g = new T3.Group(); g.add(e); e.scale.setScalar(0.33); e.rotation.y = Math.PI; g.position.set(0, 0.55, -0.45); sp.add(g); o = { g, up: t => e.userData.update(t) }; }
      else if (k[0] === 'astrolabio') { const a = createArcaneAstrolabe(T3); const g = new T3.Group(); g.add(a); a.scale.setScalar(0.2); a.rotation.y = Math.PI; g.position.set(0, 0.5, -0.62); a.traverse(x => { if (x.isPoints) x.material.size = 0.025; }); sp.add(g); let tl = 0; o = { g, up: t => { const dt = Math.min(0.1, Math.max(0, t - tl)); tl = t; a.userData.update(dt, t); } }; }
      else { const m = createSpectralCloak3D(T3); const g = new T3.Group(); g.add(m.group); m.group.scale.setScalar(0.42); m.group.position.set(0, -0.22, 0); const [arm, asas, capa] = m.group.children; arm.position.z = 0.42; arm.scale.setScalar(0.8); arm.position.y = 1.2; asas.position.z = -0.55; capa.position.z = -0.5; m.group.children[3].position.z = -0.6; sp.add(g); o = { g, up: t => m.update(t, { windSpeed: 1, windAmp: 1, energyIntensity: 0.38 }) }; }
      o.g.traverse(x => { if (x.isMesh) x.frustumCulled = false; }); } catch (e) { console.warn('arena divino', e); o = null; }
    L.div = o; }
  function arenaStats(L) { let dano = 1, vida = 0, vel = 1, regen = 0; Object.values(L.itens).forEach(P => { dano *= P.dano || 1; vida += P.vida || 0; vel = Math.max(vel, P.vel || 1); regen += P.regen || 0; }); L.dano = dano; L.max = 100 + vida; L.vel = vel; L.regen = regen; if (L.esq) { L.dano *= 0.85; L.max = Math.round(45 + vida * 0.5); L.vel *= 0.8; } }
  function arenaPresente(L, nome, dia, premio) { const P = arenaPresenteDe(nome, dia), novo = !L.itens[P.k]; L.itens[P.k] = P;
    if (P.div) { const top = Object.values(L.itens).filter(x => x.div).sort((a, b) => b.nv - a.nv)[0]; if (top === P && L.divT !== P.div) { arenaDivVisual(L, P.div); L.divT = P.div; } }
    if (P.k === 'rosa' && L.lam) { L.lam.material = L.lam.material.clone(); L.lam.material.color.set('#ff7aa8'); if (L.lam.material.emissive) L.lam.material.emissive.set('#ff2a6a'); }
    if (P.k === 'sorvete' && !L.escudo) { L.escudo = part(L.c.userData.P.elL, BOX, '#bfeaff', 0, -0.3, 0.12, 0.42, 0.5, 0.06, 0.04, true); }
    if (!L.aura) { L.aura = glowSpr(L.c, 0, 0.15, 0, 1.6, P.cor, 0.5); } else if (L.aura.material) L.aura.material.color.set(P.cor);
    arenaStats(L); L.hp = L.max; L.up = (L.up || 0) + 1; arenaElo(L, P); try { som('magia', 0.5, 1.1); } catch (e) {}
    if (premio) { try { numero(L.c.position, P.ic + ' ' + P.item, P.cor, 3.2); } catch (e) {} } else if (novo || P.nv >= 2) { arenaFeed('🎁 <b>' + L.nome + '</b> mandou ' + P.ic + ' ' + arenaEsc(nome || 'presente') + ' → <i style="color:' + P.cor + '">' + P.item + '</i> (' + P.fx + ')'); aviso(P.ic + ' ' + L.nome + ' ganhou ' + P.item + '! ' + P.fx, P.cor); arenaFoca(L, P.nv >= 2 ? 4.5 : 3); } if (!premio) arenaFala(L.nome + ' mandou ' + (nome || 'um presente') + ' e subiu para o nível ' + (1 + L.up) + '! Ganhou ' + P.item + ', que dá ' + P.fx + '. Agora ' + L.nome + ' tem ' + L.max + ' de vida, ' + Math.round(L.dano * 100) + ' por cento de força' + (L.vel > 1 ? ', está mais rápido' : '') + (L.regen ? ' e se cura sozinho' : '') + ', e está com ' + L.kills + ' pontos no ranking.', true); }
  // pontos altos: abate 100 (esqueleto ganha só 15%), golpe final no monstro 500, mais dano 300, duelo 300
  function arenaPts(L, base) { if (!L) return 0; const v = Math.round(base * (L.esq ? 0.15 : 1) * (0.9 + Math.random() * 0.2) / 5) * 5; L.kills += v; try { numero(L.c.position, '+' + v, L.esq ? '#cfc6b0' : '#ffd23c', 2.8); } catch (e) {} return v; }
  const arenaFmt = n => n >= 10000 ? (n / 1000).toFixed(0) + 'k' : n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n);
  function arenaFeed(t) { ARENA.feed.unshift({ t, em: performance.now() }); ARENA.feed.length = Math.min(ARENA.feed.length, 4); ARENA.uiT = 0; }
  // ----- eventos da live -----
  function arenaQuerLutar(t) { const n = String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return /\blutar\b|\bluta\b|⚔/.test(n); }
  function arenaPalhaco(m, id, foto) { const S0 = ARENA.plat[id]; if (S0 && Object.keys(ARENA.lut).length >= ARENA.max) return false;
    const nome = (S0 && S0.nome) || m.name, f0 = foto || (S0 && S0.foto); if (S0) arenaPlatTira(id);
    const E = arenaLut(id, nome, f0, true); if (!E) return false;
    if (!BO.vivo && !BO.queda) BO.espera = Math.min(BO.espera, 1.5); E.alvo = BO.vivo ? BO : null; // vai direto pro monstro
    arenaFeed('🤡 ' + arenaFoto(E, 'mi') + ' <b>' + E.nome + '</b> entrou como <b>palhaço</b> e foi direto pro monstro!'); arenaFoca(E, 7);
    arenaFala(E.nome + ' acabou de entrar na live e já caiu na arena como palhaço! O palhaço luta sem arma e ganha poucos pontos no ranking. Pra virar guerreiro com espada de verdade, é só mandar um presente. Seja bem-vindo, ' + E.nome + '! ' + (Object.keys(ARENA.lut).length > 1 ? 'Agora são ' + Object.keys(ARENA.lut).length + ' lutadores na arena.' : 'Por enquanto é o único lutador na arena.'), true);
    if (m.type === 'chat' && m.text) { E.fala = arenaEsc(m.text); E.falaT = performance.now() + 5000; } return true; }
  function arenaEvento(m) { const id = String(m.id), foto = arenaFotoUrl(m.foto); let L = ARENA.lut[id];
    if (m.type === 'like') arenaCurtida(+m.count || 1);
    if (L && L.esq && (m.type === 'gift' || (m.type === 'chat' && arenaQuerLutar(m.text)))) { L = arenaVira(L); if (m.type === 'chat') { L.fala = '⚔️ LUTAR!'; L.falaT = performance.now() + 4000; return; } }
    if (m.type === 'chat' && arenaComando(m, id, foto)) return;
    if (m.type === 'gift') { const S = ARENA.plat[id]; if (!L) { const nome = (S && S.nome) || m.name; if (S) arenaPlatTira(id); L = arenaLut(id, nome, foto || (S && S.foto)); arenaFeed(arenaFoto(L, 'mi') + ' <b>' + L.nome + '</b> ' + (S ? 'desceu da arquibancada e' : '') + ' entrou na LUTA!'); } else arenaLut(id, m.name, foto); arenaPresente(L, m.gift, m.diamonds); arenaMeta(Math.max(1, Math.min(50, +m.count || 1)), L); return; }
    if (L) { arenaLut(id, m.name, foto); if (m.type === 'join') { arenaFoca(L, 7); }
      else if (m.type === 'chat' && m.text) { L.fala = arenaEsc(m.text); L.falaT = performance.now() + 5000; arenaFala(L.nome + ' disse: ' + m.text); }
      else if (m.type === 'like') { L.hp = Math.min(L.max, L.hp + 6); }
      else if (m.type === 'follow') { L.hp = L.max; arenaFeed('❤️ <b>' + L.nome + '</b> seguiu a live!'); } return; }
    if (m.type === 'chat' && arenaQuerLutar(m.text)) { const S0 = ARENA.plat[id], nome = (S0 && S0.nome) || m.name, f0 = foto || (S0 && S0.foto); if (S0) arenaPlatTira(id); L = arenaLut(id, nome, f0); L.fala = '⚔️ LUTAR!'; L.falaT = performance.now() + 4000; arenaFala(L.nome + ' entrou na luta!', true); arenaFeed(arenaFoto(L, 'mi') + ' <b>' + L.nome + '</b> comentou LUTAR e ' + (S0 ? 'desceu da arquibancada pra luta!' : 'entrou na luta!')); arenaFoca(L, 3.2); return; }
    // quem entra na live já entra lutando como PALHAÇO (fraco); se a arena lotar, vai pra arquibancada (e desce assim que abrir vaga)
    if (arenaPalhaco(m, id, foto)) return;
    const novo = !ARENA.plat[id], S = arenaPlat(id, m.name, foto);
    if (novo) { arenaFeed(arenaFoto(S, 'mi') + ' <b>' + S.nome + '</b> chegou na arquibancada'); arenaFoca(S, 7); arenaFala(S.nome + ' acabou de entrar na live! A arena está lotada com ' + Object.keys(ARENA.lut).length + ' lutadores, então ' + S.nome + ' ficou na arquibancada torcendo. Mandando um presente, desce direto pra luta como guerreiro!', true); }
    if (m.type === 'chat' && m.text) { S.fala = arenaEsc(m.text); S.falaT = performance.now() + 5000; arenaFala(S.nome + ' disse: ' + m.text); }
    else if (m.type === 'follow') arenaFeed('❤️ <b>' + S.nome + '</b> seguiu a live!'); }
  { const _le = liveEvento; liveEvento = function (m) { if (ARENA.on && m && souAdmin()) { try { arenaEvento(m); } catch (e) { console.warn('arena', e); } return; } return _le(m); }; }
  /* ----- PAINEL TIKTOK (só ADM): lista de quem está na live; escolhe a pessoa e aperta o botão (arena, guerreiro, poder, vida, tirar) ----- */
  const PTK = { gente: {}, sel: null, aberto: false, t: 0 };
  { const _le2 = liveEvento; liveEvento = function (m) { if (!m || !/^(join|chat|gift|like|follow|tirar)$/.test(m.type) || m.id == null) return; // painel da TV
    if (m.painel && souAdmin() && zona !== 'arena') { try { arenaEntra(); } catch (e) {} }
    if (m.type === 'tirar') { if (souAdmin()) { arenaTira(String(m.id)); arenaPlatTira(String(m.id)); } return; }
    try { if (m && m.id != null && m.type !== 'like_total') { const id = String(m.id), g = PTK.gente[id] || (PTK.gente[id] = { id, nome: arenaEsc(m.name) || 'Visitante', foto: '' }); if (m.name) g.nome = arenaEsc(m.name); const f = arenaFotoUrl(m.foto); if (f) g.foto = f; g.t = performance.now(); if (PTK.aberto) PTK.t = 0; } } catch (e) {} return _le2(m); }; }
  const ptBtn = document.createElement('button'); ptBtn.className = 'arena-keep'; ptBtn.innerHTML = '🎵 TikTok'; ptBtn.hidden = true;
  ptBtn.style.cssText = 'position:fixed;left:8px;bottom:60px;z-index:270;height:38px;padding:0 12px;border-radius:19px;border:2px solid #fff;background:linear-gradient(90deg,#25f4ee,#fe2c55);color:#fff;font:800 14px system-ui;text-shadow:0 1px 2px #000a;box-shadow:0 2px 8px #0008';
  document.body.appendChild(ptBtn);
  const ptPn = document.createElement('div'); ptPn.className = 'arena-keep'; ptPn.hidden = true;
  ptPn.style.cssText = 'position:fixed;left:6px;right:6px;bottom:104px;max-height:62vh;z-index:270;display:flex;flex-direction:column;background:rgba(14,8,24,.94);border:2px solid #fe2c55;border-radius:16px;color:#fff;font:600 13px system-ui;overflow:hidden;max-width:460px';
  ptPn.innerHTML = '<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(90deg,#25f4ee33,#fe2c5533)"><b style="flex:1">🎵 Quem está na live <span class="pt-n"></span></b><button class="pt-x" style="border:0;background:#fff2;color:#fff;border-radius:10px;width:32px;height:30px;font-size:16px">✕</button></div>'
    + '<div class="pt-l" style="overflow:auto;flex:1;min-height:60px;padding:4px 6px"></div>'
    + '<div class="pt-s" style="padding:6px 10px;border-top:1px solid #fff2;font-size:12px;color:#ffd86a">Toque numa pessoa pra escolher</div>'
    + '<div class="pt-b" style="display:flex;flex-wrap:wrap;gap:5px;padding:0 8px 8px"></div>';
  document.body.appendChild(ptPn);
  const ptBotoes = [['arena', '🏟️ Arena', '#2a8aff'], ['lutar', '⚔️ Guerreiro', '#ff8a2a'], ['vida', '❤️ Vida cheia', '#ff4a6a'], ['tirar', '🚪 Tirar', '#555']].concat(ARENA_PRES.map(P => ['p:' + P.k, P.ic + ' ' + P.item, P.cor]));
  ptPn.querySelector('.pt-b').innerHTML = ptBotoes.map(([k, t, c]) => '<button data-a="' + k + '" style="flex:1 1 30%;min-height:36px;border:0;border-radius:10px;background:' + c + ';color:#fff;font:700 12px system-ui;text-shadow:0 1px 2px #000a;padding:4px">' + t + '</button>').join('');
  function ptOnde(id) { const L = ARENA.lut[id]; if (L) return L.esq ? '🤡 palhaço' : '⚔️ guerreiro'; if (ARENA.plat[id]) return '🪑 arquibancada'; return '— fora da arena'; }
  function ptLista() { const ls = Object.values(PTK.gente).sort((a, b) => b.t - a.t).slice(0, 80); ptPn.querySelector('.pt-n').textContent = '(' + ls.length + ')';
    const html = ls.length ? ls.map(g => '<div data-id="' + g.id + '" style="display:flex;align-items:center;gap:8px;padding:5px 6px;margin:2px 0;border-radius:10px;' + (PTK.sel === g.id ? 'background:#fe2c5566;outline:2px solid #fe2c55' : 'background:#ffffff10') + '">' + arenaFoto(g) + '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + g.nome + '</span><small style="color:#cfc6e0">' + ptOnde(g.id) + '</small></div>').join('')
      : '<div style="padding:14px;text-align:center;color:#cfc6e0">Ninguém ainda. Ligue a live no 📡 — quem entrar, comentar ou curtir aparece aqui.</div>'; if (PTK.html !== html) { PTK.html = html; ptPn.querySelector('.pt-l').innerHTML = html; }
    const g = PTK.gente[PTK.sel]; ptPn.querySelector('.pt-s').innerHTML = g ? 'Escolhido: <b>' + g.nome + '</b> · ' + ptOnde(g.id) : 'Toque numa pessoa pra escolher'; }
  ptBtn.onclick = () => { PTK.aberto = !PTK.aberto; ptPn.hidden = !PTK.aberto; if (PTK.aberto) ptLista(); };
  ptPn.querySelector('.pt-x').onclick = () => { PTK.aberto = false; ptPn.hidden = true; };
  ptPn.querySelector('.pt-l').onclick = e => { const r = e.target.closest('[data-id]'); if (!r) return; PTK.sel = r.dataset.id; ptLista(); };
  ptPn.querySelector('.pt-b').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; const g = PTK.gente[PTK.sel]; if (!g) { aviso('Escolha uma pessoa da lista primeiro', '#ffb84a'); return; }
    if (zona !== 'arena') { arenaEntra(); if (zona !== 'arena') return; }
    const a = b.dataset.a, base = { id: g.id, name: g.nome, foto: g.foto };
    try { if (a === 'arena') { if (ARENA.lut[g.id]) arenaFoca(ARENA.lut[g.id], 5); else if (!arenaPalhaco(base, g.id, g.foto)) aviso('Arena lotada', '#ffb84a'); }
      else if (a === 'lutar') arenaEvento({ type: 'chat', ...base, text: 'LUTAR' });
      else if (a === 'vida') { if (!ARENA.lut[g.id]) arenaPalhaco(base, g.id, g.foto); arenaEvento({ type: 'follow', ...base }); }
      else if (a === 'tirar') { arenaTira(g.id); arenaPlatTira(g.id); }
      else if (a.startsWith('p:')) { const P = ARENA_PRES.find(x => 'p:' + x.k === a); arenaEvento({ type: 'gift', ...base, gift: P.nomes[0], count: 1, diamonds: 0 }); } } catch (er) { console.warn('painel', er); }
    ptLista(); };
  function ptEstado() { const w = LIVE.ws; if (!w || w.readyState !== 1 || !souAdmin()) return;
    const um = L => ({ id: L.id, nome: L.nome, foto: L.foto || '', esq: !!L.esq, pts: L.kills || 0 });
    try { w.send(JSON.stringify({ type: 'estado', arena: zona === 'arena', lut: Object.values(ARENA.lut).map(um), plat: Object.values(ARENA.plat).map(um) })); } catch (e) {} }
  setInterval(ptEstado, 2000);
  /* TELINHA DA TV: manda a imagem da arena (pequena, ~5 por segundo) pro painel do Lumi TV, só quando alguém está olhando */
  const TELA = { cv: null, g: null, t: 0, ocup: false };
  function arenaTelaCaptura() { const w = LIVE.ws; if (zona !== 'arena' || !w || w.readyState !== 1 || !LIVE.telaN || !souAdmin()) return; const now = performance.now(); if (now - TELA.t < 200 || TELA.ocup || w.bufferedAmount > 150000) return; TELA.t = now;
    try { const src = renderer.domElement, H = 512, W = Math.round(H * src.width / src.height) || 288; if (!TELA.cv) { TELA.cv = document.createElement('canvas'); TELA.g = TELA.cv.getContext('2d'); } if (TELA.cv.width !== W) { TELA.cv.width = W; TELA.cv.height = H; }
      TELA.g.drawImage(src, 0, 0, W, H); TELA.ocup = true; TELA.cv.toBlob(b => { TELA.ocup = false; if (b && w.readyState === 1) try { w.send(b); } catch (e) {} }, 'image/jpeg', 0.62); } catch (e) { TELA.ocup = false; } }
  function ptFrame(dt) { const ok = souAdmin(); ptBtn.hidden = !ok; if (!ok && PTK.aberto) { PTK.aberto = false; ptPn.hidden = true; } if (PTK.aberto) { PTK.t -= dt; if (PTK.t <= 0) { PTK.t = 1.5; ptLista(); } } }
  // ----- câmera de transmissão: foca quem entrou, sobe igual drone e fica rodeando -----
  // próximo guerreiro (quem não é palhaço) pra câmera mostrar, um de cada vez
  function arenaProxGuerreiro() { const C = ARENA.cam, W = Object.values(ARENA.lut).filter(L => !L.esq && !L.morto).sort((a, b) => a.id < b.id ? -1 : 1); if (!W.length) return null; const i = W.indexOf(C.alvo); return W[(i + 1) % W.length]; }
  // DRONE: sai do personagem, sobe alto sobrevoando a arena em curva e desce suave no próximo (sem corte)
  function arenaVoa(L, seg) { const C = ARENA.cam; if (!C.pos) C.pos = cam.position.clone(); C.modo = 'voo'; C.vt = 0; C.prox = L; C.proxT = seg || 7; C.ini = performance.now();
    C.v0 = C.pos.clone(); C.l0 = C.look.clone(); C.a0 = Math.atan2(C.v0.x - ARENA.X, C.v0.z - ARENA.Z); C.r0 = Math.hypot(C.v0.x - ARENA.X, C.v0.z - ARENA.Z);
    const dd = Math.hypot(L.x - C.v0.x, L.z - C.v0.z); C.vdur = clamp(3.2 + dd * 0.06, 3.4, 5.5); C.sentido = C.sentido || 1; }
  const _vp = new T3.Vector3(), _vl = new T3.Vector3();
  function arenaVooFrame(dt) { const C = ARENA.cam, L = C.prox; if (!L || (ARENA.lut[L.id] !== L && ARENA.plat[L.id] !== L)) { C.modo = 'sobe'; C.t = 2.6; C.a = Math.atan2(C.pos.x - ARENA.X, C.pos.z - ARENA.Z); return; }
    C.vt += dt; const u = Math.min(1, C.vt / C.vdur), e = u * u * u * (u * (u * 6 - 15) + 10), arco = Math.sin(Math.PI * u);
    // ponto final: atrás do personagem (igual ao foco)
    const dd = innerHeight > innerWidth ? 3.9 : 3.1; let ex = L.x - Math.sin(L.rot || 0) * dd, ez = L.z - Math.cos(L.rot || 0) * dd, ey = L.plat ? L.y + 1.9 : 1.9;
    if (Math.hypot(ex - ARENA.X, ez - ARENA.Z) > ARENA.R - 2) { const lx = L.x - ARENA.X, lz = L.z - ARENA.Z, ld = Math.hypot(lx, lz) || 1; ex = L.x - lx / ld * dd; ez = L.z - lz / ld * dd; }
    const a1 = Math.atan2(ex - ARENA.X, ez - ARENA.Z), r1 = Math.hypot(ex - ARENA.X, ez - ARENA.Z); let da = a1 - C.a0; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
    if (Math.abs(da) < 1.2) da += C.sentido * 1.4;   // sempre dá uma volta sobrevoando
    const a = C.a0 + da * e, rr = C.r0 + (r1 - C.r0) * e, r = rr + Math.max(0, ARENA.R * 0.7 - rr) * arco, y = C.v0.y + (ey - C.v0.y) * e + arco * (innerHeight > innerWidth ? 17 : 13);
    _vp.set(ARENA.X + Math.sin(a) * r, y, ARENA.Z + Math.cos(a) * r); C.pos.lerp(_vp, 1 - Math.exp(-dt * 10));
    // olhar: do personagem antigo, passa pelo centro da arena lá do alto, e chega no novo
    _vl.set(L.x, L.plat ? L.y + 1.2 : 1.3, L.z); const lk = C.l0.clone().lerp(_vl, e); lk.lerp(new T3.Vector3(ARENA.X, 0.5, ARENA.Z), arco * 0.65); C.look.lerp(lk, 1 - Math.exp(-dt * 8));
    if (u >= 1) { C.modo = 'foco'; C.alvo = L; C.t = C.proxT; C.ini = performance.now(); C.sentido = -C.sentido; } }
  function arenaFoca(L, seg) { const C = ARENA.cam; if (C.modo === 'foco' && C.alvo && performance.now() - C.ini < 2200) { L._fq = performance.now(); if (!ARENA.fila.includes(L)) ARENA.fila.push(L); ARENA.fila.length = Math.min(ARENA.fila.length, 2); return; } if (C.modo === 'voo') { C.prox = L; C.proxT = Math.max(seg || 7, 5); return; } if (C.modo === 'foco' && C.alvo === L) { C.t = Math.max(C.t, seg || 3.5); return; } arenaVoa(L, Math.max(seg || 7, 5)); }
  const _cv = new T3.Vector3(), _lv = new T3.Vector3();
  function arenaCam(dt) { if (zona !== 'arena') return; const C = ARENA.cam, k = 1 - Math.exp(-dt * 2.6); if (!C.pos) C.pos = cam.position.clone();
    if (C.modo === 'fixa') { /* câmera parada (pra gravar vídeo/prints) */ } else if (C.modo === 'voo') arenaVooFrame(dt); else if (C.modo === 'foco') { const L = C.alvo; if (!L || (ARENA.lut[L.id] !== L && ARENA.plat[L.id] !== L)) { C.modo = 'sobe'; C.t = 2.4; } else { C.t -= dt;
        if (L.plat) { _cv.set(L.x + Math.sin(L.rot) * 3.6, L.y + 1.9, L.z + Math.cos(L.rot) * 3.6); _lv.set(L.x, L.y + 1.2, L.z); } else { { const dd = innerHeight > innerWidth ? 3.9 : 3.1; _cv.set(L.x - Math.sin(L.rot) * dd, 1.9, L.z - Math.cos(L.rot) * dd); { const ox = _cv.x - ARENA.X, oz = _cv.z - ARENA.Z, od = Math.hypot(ox, oz), lim = ARENA.R - 2; if (od > lim) { const lx = L.x - ARENA.X, lz = L.z - ARENA.Z, ld = Math.hypot(lx, lz) || 1; _cv.set(L.x - lx / ld * dd, 1.9, L.z - lz / ld * dd); } } } _lv.set(L.x, 1.3, L.z); } C.pos.lerp(_cv, 1 - Math.exp(-dt * 4)); C.look.lerp(_lv, 1 - Math.exp(-dt * 6));
        if (C.t <= 0) { let prox = ARENA.fila.shift(); while (prox && performance.now() - (prox._fq || 0) > 9000) prox = ARENA.fila.shift(); if (prox && (ARENA.lut[prox.id] === prox || ARENA.plat[prox.id] === prox)) { arenaVoa(prox, 7); } else { const g = arenaProxGuerreiro(); if (g && g !== L) { arenaVoa(g, 7); } else if (g) { C.t = 7; } else { C.modo = 'sobe'; C.t = 2.6; C.a = Math.atan2(C.pos.x - ARENA.X, C.pos.z - ARENA.Z); } } } } }
    else if (C.modo === 'boss') { C.t -= dt; const r = (innerHeight > innerWidth ? 17 : 13) * (BO.M && BO.M.id === 'tita' ? 1.7 : 1); C.a += (BO.rot + 0.35 - C.a) * Math.min(1, dt * 1.5); _cv.set(BO.x + Math.sin(C.a) * r, BO.M && BO.M.id === 'tita' ? 9 : 6.5, BO.z + Math.cos(C.a) * r); _lv.set(BO.x, 3.6, BO.z); if (Math.hypot(C.pos.x - BO.x, C.pos.z - BO.z) < r * 0.6) C.pos.copy(_cv); C.pos.lerp(_cv, 1 - Math.exp(-dt * 2.4)); C.look.lerp(_lv, 1 - Math.exp(-dt * 3)); if (C.t <= 0) { C.modo = 'sobe'; C.t = 2.6; C.ot = 0; } }
    else if (C.modo === 'mural') { C.t -= dt; _cv.set(MURAL.x, MURAL.y - 1.5, MURAL.z - (innerHeight > innerWidth ? 24 : 13)); _lv.set(MURAL.x, MURAL.y - 0.3, MURAL.z); C.pos.lerp(_cv, 1 - Math.exp(-dt * 2.2)); C.look.lerp(_lv, 1 - Math.exp(-dt * 3)); if (C.t <= 0) { C.modo = 'sobe'; C.t = 2.6; C.ot = 0; C.a = Math.atan2(C.pos.x - ARENA.X, C.pos.z - ARENA.Z); } }
    else { if (C.modo === 'sobe') { C.t -= dt; if (C.t <= 0) { C.modo = 'orbita'; C.ot = 0; } } else { C.ot = (C.ot || 0) + dt; { const g = C.ot > 1.5 && C.modo === 'orbita' ? arenaProxGuerreiro() : null; if (g) { arenaVoa(g, 7); ARENA.fila = []; } } if (C.modo === 'orbita' && C.ot > 6) { C.ciclo = (C.ciclo || 0) + 1; const Ls = Object.values(ARENA.lut).filter(L => !L.morto); if (C.ciclo % 4 && Ls.length) { Ls.sort((p, q) => q.kills - p.kills); const a1 = Ls[0], a2 = Ls[1 + Math.floor(Math.random() * Math.max(0, Ls.length - 1))]; arenaVoa(C.ciclo % 2 ? a1 : (a2 || a1), 7); ARENA.fila = a2 && a2 !== a1 ? [a2] : []; } else { C.modo = 'mural'; C.t = 6.5; } } } C.a += dt * 0.12; const pe = innerHeight > innerWidth, Lv = Object.values(ARENA.lut).filter(L => !L.morto); let cx = ARENA.X, cz = ARENA.Z, sp = 6; if (BO.vivo) { cx = BO.x; cz = BO.z; sp = 9; } else if (Lv.length) { cx = 0; cz = 0; Lv.forEach(L => { cx += L.x; cz += L.z; }); cx /= Lv.length; cz /= Lv.length; sp = Math.max(4, ...Lv.map(L => Math.hypot(L.x - cx, L.z - cz))); }
      C.cx = C.cx == null ? cx : C.cx + (cx - C.cx) * Math.min(1, dt * 0.8); C.cz = C.cz == null ? cz : C.cz + (cz - C.cz) * Math.min(1, dt * 0.8); C.sp = C.sp == null ? sp : C.sp + (sp - C.sp) * Math.min(1, dt * 0.5);
      const r = clamp(C.sp * 1.1 + 4, 7, ARENA.R * 0.95) + (pe ? 4 : 0), y = (C.modo === 'sobe' ? 4 + (2.6 - C.t) * 1.5 : 3.5 + r * 0.35 + Math.sin(gT * 0.3) * 0.8);
      _cv.set(C.cx + Math.sin(C.a) * r, y, C.cz + Math.cos(C.a) * r); _lv.set(C.cx, BO.vivo ? 3 : 1, C.cz); C.pos.lerp(_cv, C.modo === 'sobe' ? 1 - Math.exp(-dt * 1.8) : k); C.look.lerp(_lv, 1 - Math.exp(-dt * 2.2)); }
    cam.position.copy(C.pos);
    cam.lookAt(C.look); cam.updateMatrixWorld();
    // nomes e vida em cima de cada lutador (depois da câmera, pra não tremer)
    const agora = performance.now(); Object.values(ARENA.lut).forEach(L => { const d = cam.position.distanceTo(L.c.position); if (L.morto || d > 60) { L.tag.hidden = true; return; } L.tag.hidden = false;
      const falando = L.fala && agora < L.falaT, h = arenaFoto(L) + (L.time ? '<em class="ar-tm ' + L.time + '">' + (L.time === 'r' ? 'VERMELHO' : 'AZUL') + '</em>' : '') + (DU.on && (L === DU.a || L === DU.b) ? '<em class="ar-du">⚔️ DUELO</em>' : '') + (L.up ? '<em class="ar-lv">⭐ NÍVEL ' + (1 + L.up) + '</em>' : '') + (L.coroa ? '<em class="ar-cr">👑 CAMPEÃO</em>' : '') + '<b>' + (L.esq ? '🤡 ' : '') + Object.values(L.itens).map(P => P.ic).join('') + (L.div || L.itens.rosa ? ' ' : '') + L.nome + '</b><span class="ar-hp"><i style="width:' + Math.round(L.hp / L.max * 100) + '%"></i></span><small>⭐ ' + arenaFmt(L.kills) + (falando ? ' · 💬 ' + L.fala : '') + '</small>';
      if (L.h !== h) { L.h = h; L.tag.innerHTML = h; } guildPosition(L.tag, L.c, 2.0); L.tag.style.transform = 'translate(-50%,-100%) scale(' + (clamp(1.15 - d / 40, 0.5, 0.95) * (L.esq ? 0.75 : 1)).toFixed(2) + ')'; L.tag.style.zIndex = String(200 - Math.round(d)); });
    Object.values(ARENA.plat).forEach(S => { const d = cam.position.distanceTo(S.c.position), falando = S.fala && agora < S.falaT; if (d > (falando ? 70 : 26)) { S.tag.hidden = true; return; } S.tag.hidden = false;
      const h = arenaFoto(S) + '<b>' + S.nome + '</b>' + (falando ? '<small>💬 ' + S.fala + '</small>' : ''); if (S.h !== h) { S.h = h; S.tag.innerHTML = h; } guildPosition(S.tag, S.c, 1.9); S.tag.style.transform = 'translate(-50%,-100%) scale(' + clamp(1.15 - d / 30, 0.45, 1.1).toFixed(2) + ')'; S.tag.style.zIndex = String(150 - Math.round(d)); }); }
  /* ----- TITÃ DA ARENA: chefe gigante no meio enquanto ninguém luta; a galera derruba ele e depois duela ----- */
  const BO = { boss: true, id: '__boss', nome: 'Titã da Arena', x: ARENA.X, z: ARENA.Z, r: 3.4, hp: 0, max: 3000, vivo: false, morto: 0, e: null, pos: new T3.Vector3(), cd: 3, golpe: -1, ult: null, espera: 1.5, rot: 0, queda: 0, idx: -1, M: null, cache: {} };
  const boBar = document.createElement('div'); boBar.id = 'arena-boss'; boBar.className = 'arena-keep'; boBar.hidden = true; boBar.innerHTML = '<b>👹 TITÃ DA ARENA</b><span><i></i></span><small></small>'; document.body.appendChild(boBar);
  /* ----- MONSTROS PERSONALIZADOS da arena: cada um com visual, ataque e falas próprias; revezam a cada aparição ----- */
  const bv = (g, geo, c, x, y, z, sx, sy, sz, glow) => part(g, geo, c, x, y, z, sx, sy, sz == null ? sx : sz, 0.03, glow);
  const MONSTROS = [
    { id: 'tita', nome: 'Titã da Arena', ic: '👹', cor: '#a060ff', r: 3.4, ataque: 'soco', dica: 'soco no chão que empurra todo mundo',
      monta() { const e = fera('golem'); try { e.hp.remove(); } catch (x) {} world.remove(e.g); e.g.scale.setScalar(2.7);
        e.g.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.material.transparent) { o.material = o.material.clone(); o.material.color.lerp(new T3.Color('#7a3aff'), 0.35); } });
        for (let i = 0; i < 5; i++) { const k = part(e.b, CONE, '#ffd23c', (i - 2) * 0.32, 4.75 + (i % 2 ? 0 : 0.12), 0.15, 0.13, 0.5, 0.13, 0.02, true); k.rotation.z = (i - 2) * -0.12; } return { g: e.g, b: e.b, arms: e.arms }; } },
    { id: 'dragao', nome: 'Ignarok, o Dragão Rubro', ic: '🐉', cor: '#ff5a2a', r: 3.6, ataque: 'fogo', dica: 'cospe fogo em leque na direção do alvo',
      monta() { const g = new T3.Group(), b = grp(g), c = '#b8222a', c2 = '#ffb84a', ch = '#3a1a1a';
        bv(b, SPH, c, 0, 2.6, 0, 1.6, 1.3, 2.2); bv(b, SPH, c2, 0, 2.2, 0.5, 1.15, 0.9, 1.6);
        for (let i = 0; i < 5; i++) bv(b, CONE, ch, 0, 3.8 - i * 0.05, 1.2 - i * 0.65, 0.18, 0.6, 0.18).rotation.x = -0.3;
        const pes = grp(b, 0, 3.2, 1.8); for (let i = 0; i < 4; i++) bv(pes, SPH, c, 0, i * 0.55, i * 0.35, 0.62 - i * 0.05, 0.62 - i * 0.05, 0.62 - i * 0.05);
        const cab = grp(pes, 0, 2.3, 1.5); bv(cab, SPH, c, 0, 0, 0, 0.8, 0.65, 1.0); bv(cab, BOX, c, 0, -0.15, 0.85, 0.75, 0.38, 0.9); const maxi = grp(cab, 0, -0.38, 0.4); bv(maxi, BOX, c2, 0, -0.08, 0.5, 0.65, 0.18, 0.85);
        [-1, 1].forEach(s => { bv(cab, CONE, '#f4e4c0', s * 0.45, 0.6, -0.3, 0.16, 0.95, 0.16).rotation.set(-0.7, 0, s * -0.35); bv(cab, SPH, '#ffe24a', s * 0.42, 0.18, 0.55, 0.13, 0.1, 0.08, true); });
        const fogoB = glowSpr(cab, 0, -0.2, 1.4, 0.1, '#ff8a2a', 0);
        const asas = [-1, 1].map(s => { const a = grp(b, s * 1.1, 3.4, 0.2); const m = grp(a); m.rotation.z = s * 0.25; bv(m, CYL, ch, s * 1.7, 0.6, 0, 0.12, 3.6, 0.12).rotation.z = s * -1.1;
          for (let k = 0; k < 3; k++) { const p = bv(m, BOX, '#7a1a22', s * (1.2 + k * 0.7), 0.1 - k * 0.35, 0, 1.2, 0.05, 1.8 - k * 0.3); p.rotation.set(0, 0, s * (-0.4 + k * 0.25)); } return a; });
        const cauda = grp(b, 0, 2.4, -2); for (let i = 0; i < 6; i++) bv(cauda, SPH, c, 0, -i * 0.25, -i * 0.65, 0.55 - i * 0.07, 0.5 - i * 0.07, 0.6); bv(cauda, CONE, ch, 0, -1.6, -4.1, 0.35, 0.9, 0.12).rotation.x = -1.8;
        const pernas = [[-0.9, 1.0], [0.9, 1.0], [-0.9, -1.0], [0.9, -1.0]].map(([x, z]) => { const l = grp(b, x, 1.9, z); bv(l, CYL, c, 0, -0.9, 0, 0.4, 1.8, 0.4); bv(l, SPH, ch, 0, -1.85, 0.2, 0.45, 0.25, 0.6); return l; });
        return { g, b, arms: asas, pes, cab, maxi, fogoB, cauda, pernas }; },
      idle(m, t) { m.arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * Math.sin(t * 2.4) * 0.35); m.cauda.rotation.y = Math.sin(t * 1.3) * 0.4; m.pes.rotation.x = Math.sin(t * 1.1) * 0.08; m.maxi.rotation.x = 0; } },
    { id: 'aranha', nome: 'Aracnys, a Rainha Tecelã', ic: '🕷️', cor: '#b04aff', r: 3.4, ataque: 'teia', dica: 'lança teia que prende e deixa lento',
      monta() { const g = new T3.Group(), b = grp(g), c = '#2a1a3a', c2 = '#6a2a9a';
        bv(b, SPH, c, 0, 2.6, -1.6, 2.0, 1.7, 2.3); for (let i = 0; i < 3; i++) bv(b, SPH, '#c86aff', 0, 3.3 + i * 0.3 - 0.4, -1.0 - i * 0.9, 0.5 - i * 0.1, 0.12, 0.35, true);
        bv(b, SPH, c2, 0, 2.3, 0.8, 1.1, 0.9, 1.2); const cab = grp(b, 0, 2.5, 1.8); bv(cab, SPH, c, 0, 0, 0, 0.75, 0.65, 0.7);
        [[-0.25, 0.25, 0.12], [0.25, 0.25, 0.12], [-0.45, 0.05, 0.08], [0.45, 0.05, 0.08], [-0.15, -0.1, 0.07], [0.15, -0.1, 0.07]].forEach(([x, y, s]) => bv(cab, SPH, '#ff2a4a', x, y, 0.62, s, s, s * 0.6, true));
        [-1, 1].forEach(s => bv(cab, CONE, '#e8e0f0', s * 0.25, -0.5, 0.5, 0.12, 0.6, 0.12).rotation.x = 2.6);
        bv(b, ICO, '#ffd23c', 0, 3.3, 0.8, 0.25, 0.25, 0.25, true);
        const pernas = []; for (let s of [-1, 1]) for (let k = 0; k < 4; k++) { const l = grp(b, s * 0.9, 2.4, 1.3 - k * 0.6); l.rotation.y = s * (0.6 - k * 0.4); const a = grp(l); a.rotation.z = s * 0.8; bv(a, CYL, c, s * 1.2, 0, 0, 0.16, 2.6, 0.16).rotation.z = s * Math.PI / 2;
          const j = grp(a, s * 2.4, 0, 0); j.rotation.z = s * -1.6; bv(j, CYL, c2, s * 1.2, 0, 0, 0.13, 2.6, 0.13).rotation.z = s * Math.PI / 2; bv(j, CONE, '#e8e0f0', s * 2.6, 0, 0, 0.12, 0.4, 0.12).rotation.z = s * -Math.PI / 2; l.userData.k = k + (s > 0 ? 4 : 0); pernas.push(l); }
        return { g, b, arms: [], cab, pernas }; },
      idle(m, t) { m.pernas.forEach((l, i) => l.children[0].rotation.x = Math.sin(t * 5 + i * 1.3) * 0.12); m.cab.rotation.x = Math.sin(t * 1.7) * 0.1; } },
    { id: 'gelo', nome: 'Glacius, o Colosso de Gelo', ic: '🧊', cor: '#6ad8ff', r: 3.2, ataque: 'gelo', dica: 'pisa no chão e congela quem estiver perto',
      monta() { const g = new T3.Group(), b = grp(g), c = '#9ad8ff', c2 = '#e8f8ff', esc = '#3a6a9a';
        bv(b, ICO, c, 0, 3.6, 0, 1.7, 1.9, 1.3); bv(b, ICO, '#2af0ff', 0, 3.7, 0.9, 0.5, 0.5, 0.4, true); glowSpr(b, 0, 3.7, 1.1, 2.5, '#6ae8ff', 0.6);
        const cab = grp(b, 0, 5.8, 0.2); bv(cab, ICO, c2, 0, 0, 0, 0.75, 0.7, 0.7); [-1, 1].forEach(s => bv(cab, BOX, '#2af0ff', s * 0.28, 0.05, 0.6, 0.22, 0.08, 0.05, true));
        for (let i = 0; i < 5; i++) bv(cab, CONE, c2, (i - 2) * 0.3, 0.7 + (i % 2 ? 0 : 0.25), -0.1, 0.13, 0.8, 0.13).rotation.z = (i - 2) * -0.18;
        const arms = [-1, 1].map(s => { const a = grp(b, s * 2.0, 4.8, 0); bv(a, ICO, c, 0, 0, 0, 0.9, 0.9, 0.9); for (let k = 0; k < 3; k++) bv(a, CONE, c2, s * 0.2, 0.7, -0.3 + k * 0.3, 0.2, 1.2, 0.2).rotation.z = s * -0.4;
          bv(a, CYL, c, 0, -1.4, 0, 0.55, 2.4, 0.55); bv(a, ICO, c2, 0, -3.0, 0.1, 0.9, 1.0, 0.9); return a; });
        [-0.8, 0.8].forEach(x => { bv(b, CYL, esc, x, 1.2, 0, 0.6, 2.4, 0.6); bv(b, ICO, c, x, 0.3, 0.2, 0.8, 0.5, 1.0); });
        return { g, b, arms, cab }; },
      idle(m, t) { m.arms.forEach((a, i) => a.rotation.x = Math.sin(t * 1.2 + i * Math.PI) * 0.2); m.b.children[1].rotation.y = t; } },
    { id: 'hidra', nome: 'Hidra do Pântano Sombrio', ic: '🐍', cor: '#5aff6a', r: 3.6, ataque: 'cuspe', dica: 'três cabeças cospem veneno',
      monta() { const g = new T3.Group(), b = grp(g), c = '#2a6a3a', c2 = '#a8d86a';
        bv(b, SPH, c, 0, 2.0, -0.4, 2.2, 1.6, 2.4); bv(b, SPH, c2, 0, 1.6, 0.6, 1.6, 1.1, 1.5); for (let i = 0; i < 6; i++) bv(b, CONE, '#1a3a2a', 0, 3.5 - i * 0.1, 0.9 - i * 0.7, 0.2, 0.6, 0.2);
        const pes = [-1.1, 0, 1.1].map((x, i) => { const n = grp(b, x, 2.8, 1.0); n.rotation.z = -x * 0.25; for (let k = 0; k < 6; k++) bv(n, SPH, c, 0, k * 0.5, k * 0.15, 0.42 - k * 0.03, 0.42, 0.42 - k * 0.03);
          const cab = grp(n, 0, 3.1, 1.0); bv(cab, SPH, c, 0, 0, 0, 0.55, 0.45, 0.75); bv(cab, BOX, c2, 0, -0.2, 0.55, 0.45, 0.15, 0.55); [-1, 1].forEach(s => { bv(cab, SPH, '#ffe24a', s * 0.28, 0.15, 0.45, 0.1, 0.1, 0.07, true); bv(cab, CONE, '#1a3a2a', s * 0.25, 0.4, -0.3, 0.1, 0.5, 0.1).rotation.x = -0.8; });
          bv(cab, CONE, '#f4f0d0', 0.12, -0.3, 0.8, 0.05, 0.22, 0.05).rotation.x = Math.PI; bv(cab, CONE, '#f4f0d0', -0.12, -0.3, 0.8, 0.05, 0.22, 0.05).rotation.x = Math.PI; n.userData.cab = cab; return n; });
        bv(b, SPH, c, 0, 1.4, -2.6, 0.8, 0.6, 1.4); [[-1.2, 1], [1.2, 1], [-1.2, -1.2], [1.2, -1.2]].forEach(([x, z]) => bv(b, CYL, c, x, 0.6, z, 0.45, 1.2, 0.45));
        return { g, b, arms: [], pes }; },
      idle(m, t) { m.pes.forEach((n, i) => { n.rotation.x = Math.sin(t * 1.4 + i * 2) * 0.18; n.rotation.y = Math.sin(t * 0.9 + i) * 0.2; }); } },
    { id: 'raio', nome: 'Voltarion, Senhor da Tempestade', ic: '⚡', cor: '#2ae8ff', r: 3.0, ataque: 'raios', dica: 'marca o chão e solta raios do céu',
      monta() { const g = new T3.Group(), b = grp(g); bv(b, SPH, '#bff8ff', 0, 4.2, 0, 1.1, 1.1, 1.1, true); glowSpr(b, 0, 4.2, 0, 6, '#2ae8ff', 0.8);
        const an = [0, 1, 2].map(i => { const a = grp(b, 0, 4.2, 0); bv(a, TOR, i === 1 ? '#ffe24a' : '#2ae8ff', 0, 0, 0, 1.8 + i * 0.5, 1.8 + i * 0.5, 1.8 + i * 0.5, true); a.rotation.set(i * 0.9, i * 0.5, 0); return a; });
        const coroa = grp(b, 0, 5.4, 0); for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; bv(coroa, CONE, '#ffe24a', Math.cos(a) * 0.7, 0.4, Math.sin(a) * 0.7, 0.15, 0.9, 0.15, true); }
        const orb = [0, 1, 2, 3].map(i => { const o = grp(b, 0, 4.2, 0); bv(o, ICO, '#e8fbff', 3.2, 0, 0, 0.3, 0.3, 0.3, true); glowSpr(o, 3.2, 0, 0, 1.2, '#2ae8ff', 0.8); o.rotation.y = i * Math.PI / 2; return o; });
        [-1, 1].forEach(s => bv(b, SPH, '#0a2a3a', s * 0.4, 4.4, 1.0, 0.18, 0.12, 0.05));
        const nuv = grp(b, 0, 1.0, 0); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; bv(nuv, SPH, '#4a5a7a', Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4, 0.9, 0.5, 0.9); }
        return { g, b, arms: [], an, orb, nuv }; },
      idle(m, t) { m.an.forEach((a, i) => { a.rotation.x += 0.02 * (i + 1); a.rotation.y += 0.015; }); m.orb.forEach(o => o.rotation.y += 0.03); m.b.position.y = 0.6 + Math.sin(t * 1.5) * 0.3; m.nuv.rotation.y = t * 0.6; } },
    { id: 'ossos', nome: 'Ossário, o Rei Esqueleto', ic: '💀', cor: '#ff3a3a', r: 3.0, ataque: 'giro', dica: 'gira a espada gigante e acerta tudo em volta',
      monta() { const g = new T3.Group(), b = grp(g), o = '#ece4d0', o2 = '#b8ac90';
        bv(b, CYL, o2, 0, 4.2, 0, 0.25, 3.0, 0.25); for (let i = 0; i < 5; i++) { const r = bv(b, TOR, o, 0, 4.9 - i * 0.38, 0.2, 1.0 - i * 0.09, 0.9 - i * 0.08, 1.0 - i * 0.09); r.rotation.x = Math.PI / 2; }
        bv(b, SPH, o2, 0, 2.7, 0, 1.0, 0.45, 0.7); const cab = grp(b, 0, 6.3, 0.1); bv(cab, SPH, o, 0, 0, 0, 0.75, 0.8, 0.8); bv(cab, BOX, o, 0, -0.55, 0.25, 0.6, 0.3, 0.55);
        [-1, 1].forEach(s => { bv(cab, SPH, '#120a0a', s * 0.28, 0.05, 0.62, 0.2, 0.22, 0.12); bv(cab, SPH, '#ff3a3a', s * 0.28, 0.05, 0.7, 0.08, 0.08, 0.05, true); }); glowSpr(cab, 0, 0.05, 0.7, 1.6, '#ff3a3a', 0.5);
        const cor = grp(cab, 0, 0.75, 0); bv(cor, CYL, '#d8a83a', 0, 0, 0, 0.6, 0.25, 0.6); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; bv(cor, CONE, '#d8a83a', Math.cos(a) * 0.55, 0.3, Math.sin(a) * 0.55, 0.1, 0.45, 0.1); }
        bv(b, BOX, '#3a1a2a', 0, 5.6, -0.6, 2.4, 3.4, 0.1).rotation.x = 0.15;
        const arms = [-1, 1].map(s => { const a = grp(b, s * 1.35, 5.4, 0); bv(a, CYL, o, 0, -1.0, 0, 0.18, 2.0, 0.18); bv(a, SPH, o2, 0, -2.0, 0, 0.25, 0.25, 0.25); bv(a, CYL, o, 0, -2.9, 0.2, 0.15, 1.8, 0.15); bv(a, SPH, o, 0, -3.9, 0.3, 0.3, 0.3, 0.3); return a; });
        const esp = grp(arms[1], 0, -3.9, 0.3); bv(esp, BOX, '#3a3a4a', 0, 0, 0, 0.18, 0.18, 0.9); bv(esp, BOX, '#d8a83a', 0, 0, 0.5, 1.0, 0.18, 0.15); bv(esp, BOX, '#ffb8b8', 0, 0, 2.8, 0.35, 0.08, 4.2, true); glowSpr(esp, 0, 0, 2.8, 3, '#ff3a3a', 0.35);
        [-0.6, 0.6].forEach(x => { bv(b, CYL, o, x, 1.4, 0, 0.18, 2.6, 0.18); bv(b, BOX, o, x, 0.1, 0.25, 0.4, 0.2, 0.8); });
        return { g, b, arms, cab, esp }; },
      idle(m, t) { m.arms.forEach((a, i) => a.rotation.x = Math.sin(t * 1.4 + i * Math.PI) * 0.15 - (i ? 0.6 : 0)); m.cab.rotation.z = Math.sin(t * 2) * 0.06; } },
    { id: 'gosma', nome: 'Gelatão, o Rei Gosma', ic: '🟢', cor: '#7aff4a', r: 3.4, ataque: 'pulo', dica: 'pula em cima de quem estiver longe',
      monta() { const g = new T3.Group(), b = grp(g); const corpo = new T3.Mesh(SPH, new T3.MeshToonMaterial({ color: '#5ae84a', gradientMap: GRAD, transparent: true, opacity: 0.78 })); corpo.position.y = 2.4; corpo.scale.set(3, 2.4, 3); b.add(corpo);
        bv(b, SPH, '#2a8a2a', 0, 1.9, 0, 1.6, 1.1, 1.6); for (let i = 0; i < 7; i++) bv(b, SPH, '#c8ffb0', Math.sin(i * 2.3) * 1.6, 1.4 + (i % 3) * 0.9, Math.cos(i * 2.3) * 1.4, 0.2 + (i % 2) * 0.1, 0.2 + (i % 2) * 0.1, 0.2 + (i % 2) * 0.1);
        [-1, 1].forEach(s => { bv(b, SPH, '#ffffff', s * 0.9, 3.4, 2.5, 0.55, 0.65, 0.3); bv(b, SPH, '#101010', s * 0.9, 3.35, 2.75, 0.25, 0.3, 0.12); });
        bv(b, TOR, '#1a3a1a', 0, 2.4, 2.75, 0.6, 0.35, 0.6).rotation.z = Math.PI; const cor = grp(b, 0, 4.7, 0); bv(cor, CYL, '#ffd23c', 0, 0, 0, 0.9, 0.35, 0.9); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; bv(cor, CONE, '#ffd23c', Math.cos(a) * 0.8, 0.45, Math.sin(a) * 0.8, 0.14, 0.6, 0.14); bv(cor, SPH, ['#ff4a6a', '#4ad8ff', '#ffe24a'][i % 3], Math.cos(a) * 0.9, 0.05, Math.sin(a) * 0.9, 0.12, 0.12, 0.1, true); }
        return { g, b, arms: [], corpo, cor }; },
      idle(m, t) { const s = Math.sin(t * 3); m.b.scale.set(1 + s * 0.05, 1 - s * 0.06, 1 + s * 0.05); } }];
  const MONSTRO = id => MONSTROS.find(m => m.id === id);
  const aLoc = (x, z) => [x - ARENA.X, z - ARENA.Z];
  const BFX = [];   // efeitos do monstro (marcas no chão, raios, cuspes)
  function bfxMarca(x, z, r, cor, dur) { const m = new T3.Mesh(new T3.RingGeometry(r * 0.85, r, 40), new T3.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.85, side: T3.DoubleSide, depthWrite: false, toneMapped: false })); m.rotation.x = -Math.PI / 2; const [lx, lz] = aLoc(x, z); m.position.set(lx, 0.08, lz); ARG.G.add(m);
    const d = new T3.Mesh(new T3.CircleGeometry(r * 0.85, 40), new T3.MeshBasicMaterial({ color: cor, transparent: true, opacity: 0.18, depthWrite: false, toneMapped: false })); d.rotation.x = -Math.PI / 2; d.position.copy(m.position); ARG.G.add(d); BFX.push({ obs: [m, d], t: 0, dur, pulsa: true }); }
  function bfxRaio(x, z, cor) { const [lx, lz] = aLoc(x, z); const m = new T3.Mesh(new T3.CylinderGeometry(0.25, 0.5, 30, 8, 1, true), new T3.MeshBasicMaterial({ color: cor, transparent: true, opacity: 1, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false })); m.position.set(lx, 15, lz); ARG.G.add(m);
    const s = glowSpr(ARG.G, lx, 1, lz, 6, cor, 1); BFX.push({ obs: [m, s], t: 0, dur: 0.45, some: true }); }
  function bfxLimpa(o) { o.obs.forEach(m => { ARG.G.remove(m); if (m.geometry) m.geometry.dispose(); if (m.material) m.material.dispose(); }); }
  function bfxFrame(dt) { for (let i = BFX.length - 1; i >= 0; i--) { const o = BFX[i]; o.t += dt; const u = o.t / o.dur; if (o.pulsa) o.obs[0].material.opacity = 0.5 + 0.4 * Math.sin(o.t * 18); if (o.some) o.obs.forEach(m => m.material.opacity = Math.max(0, 1 - u));
      if (o.passo) o.passo(dt, o); if (u >= 1 || o.fim) { bfxLimpa(o); BFX.splice(i, 1); } } }
  // dano do monstro num lutador
  function boAcerta(o, dano, cor, empurra) { if (o.morto) return; o.hp -= dano; try { numero(o.c.position, String(dano), cor || '#ff5a5a', 2.2); } catch (x) {} if (empurra) { const dx = o.x - BO.x, dz = o.z - BO.z, d = Math.hypot(dx, dz); if (d > 1e-3) { o.x += dx / d * empurra; o.z += dz / d * empurra; } }
    if (o.hp <= 0) { o.hp = 0; o.morto = 3; o.mortes++; o.seq = 0; arenaFeed(BO.M.ic + ' ' + BO.M.nome.split(',')[0] + ' derrubou <b>' + o.nome + '</b>!'); } }
  // ataques: cada um tem preparo (t < w) e acerto
  const ATQ = {
    soco: { w: 1.0, fim: 1.6, prepara(m, u) { m.arms.forEach(a => a.rotation.x = -u * 2.7); },
      acerta(m, vivos) { m.arms.forEach(a => a.rotation.x = 0.5); fx('fumo', [BO.x, 0.3, BO.z], 0.8); fx('vento', [BO.x, 0.3, BO.z], 0.6); tremor = Math.max(tremor, 0.25); try { som('golem_soco', 0.7, 0.8); } catch (x) {}
        vivos.forEach(o => { if (Math.hypot(o.x - BO.x, o.z - BO.z) < 8.5) boAcerta(o, Math.round(18 + Math.random() * 14), '#ff5a5a', 2.2); }); } },
    fogo: { w: 0.9, fim: 2.4, prepara(m, u) { m.pes.rotation.x = -u * 0.5; m.maxi.rotation.x = u * 0.5; },
      acerta(m, vivos, alvo) { BO.dirF = BO.rot; try { som('fogo', 0.8, 0.7); } catch (x) {} },
      dura(m, vivos, dt, u) { m.pes.rotation.x = 0.25; m.maxi.rotation.x = 0.6; m.fogoB.material.opacity = 0.9; m.fogoB.scale.setScalar(2.5 + Math.random()); const a = BO.dirF + Math.sin(u * 6) * 0.35; BO.rot = a;
        const L = 3 + Math.random() * 7; fx('chama', [BO.x + Math.sin(a) * L, 1.2, BO.z + Math.cos(a) * L], 0.3, a); if (Math.random() < 0.5) fx('fogo', [BO.x + Math.sin(a) * L, 0.8, BO.z + Math.cos(a) * L], 0.4);
        BO.tick = (BO.tick || 0) + dt; if (BO.tick > 0.3) { BO.tick = 0; vivos.forEach(o => { const dx = o.x - BO.x, dz = o.z - BO.z, d = Math.hypot(dx, dz); let da = Math.atan2(dx, dz) - a; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2; if (d < 11 && Math.abs(da) < 0.55) { boAcerta(o, Math.round(8 + Math.random() * 6), '#ff8a2a'); o.queima = 3; } }); } },
      solta(m) { m.fogoB.material.opacity = 0; m.fogoB.scale.setScalar(0.1); } },
    teia: { w: 0.8, fim: 1.4, prepara(m, u) { m.cab.rotation.x = -u * 0.4; },
      acerta(m, vivos) { m.cab.rotation.x = 0.2; try { som('magia', 0.5, 1.3); } catch (x) {} boLanca(vivos, 3, '#e8e0ff', (o) => { boAcerta(o, 12, '#c86aff'); o.lento = 4; o.congela = Math.max(o.congela || 0, 0.8); arenaFeed('🕸️ <b>' + o.nome + '</b> ficou preso na teia!'); }); } },
    cuspe: { w: 0.8, fim: 1.5, prepara(m, u) { m.pes.forEach(n => n.rotation.x = -u * 0.5); },
      acerta(m, vivos) { m.pes.forEach(n => n.rotation.x = 0.35); try { som('magia', 0.5, 0.8); } catch (x) {} boLanca(vivos, 3, '#7aff4a', (o) => { boAcerta(o, 14, '#7aff4a'); o.queima = 4; fx('cura', [o.x, 1, o.z], 0.5); }); } },
    gelo: { w: 1.1, fim: 1.8, prepara(m, u) { m.b.position.y = u * 1.2; m.arms.forEach(a => a.rotation.x = -u * 2.2); if (u < 0.05) bfxMarca(BO.x, BO.z, 7.5, '#6ad8ff', 1.1); },
      acerta(m, vivos) { m.b.position.y = 0; m.arms.forEach(a => a.rotation.x = 0.4); fx('gelo', [BO.x, 0.6, BO.z], 1.2); fx('vento', [BO.x, 0.3, BO.z], 0.8); tremor = Math.max(tremor, 0.3); try { som('gelo', 0.8, 0.7); } catch (x) {}
        vivos.forEach(o => { if (Math.hypot(o.x - BO.x, o.z - BO.z) < 7.5) { boAcerta(o, Math.round(12 + Math.random() * 8), '#9ae8ff', 1); o.congela = 2.2; } }); } },
    raios: { w: 1.3, fim: 1.8, prepara(m, u) { if (!BO.marcas) { BO.marcas = BO.vivosR.slice().sort(() => Math.random() - 0.5).slice(0, 4).map(o => [o.x, o.z]); for (let i = 0; i < 2; i++) { const a = Math.random() * 6.28, r = Math.random() * (ARENA.R - 3); BO.marcas.push([ARENA.X + Math.cos(a) * r, ARENA.Z + Math.sin(a) * r]); } BO.marcas.forEach(([x, z]) => bfxMarca(x, z, 2.6, '#2ae8ff', 1.3)); } },
      acerta(m, vivos) { tremor = Math.max(tremor, 0.3); try { som('magia', 1, 1.5); } catch (x) {} (BO.marcas || []).forEach(([x, z]) => { bfxRaio(x, z, '#bff8ff'); fx('luz', [x, 0.5, z], 0.6); vivos.forEach(o => { if (Math.hypot(o.x - x, o.z - z) < 2.6) boAcerta(o, Math.round(26 + Math.random() * 10), '#2ae8ff', 1.5); }); }); BO.marcas = null; } },
    giro: { w: 0.6, fim: 2.4, prepara(m, u) { m.arms[1].rotation.x = -0.6 - u * 1.0; m.arms[1].rotation.z = u * 1.2; },
      acerta() { try { som('espada', 0.8, 0.6); } catch (x) {} },
      dura(m, vivos, dt) { BO.rot += dt * 9; m.arms[1].rotation.set(-1.57, 0, 1.3); if (Math.random() < 0.4) fx('vento', [BO.x, 1, BO.z], 0.3); BO.tick = (BO.tick || 0) + dt;
        if (BO.tick > 0.3) { BO.tick = 0; vivos.forEach(o => { if (Math.hypot(o.x - BO.x, o.z - BO.z) < 7) boAcerta(o, Math.round(9 + Math.random() * 6), '#ff3a3a', 1.2); }); } },
      solta(m) { m.arms[1].rotation.set(-0.6, 0, 0); } },
    pulo: { w: 1.4, fim: 2.0, prepara(m, u, alvo) { if (!BO.salto) { const A = alvo || { x: ARENA.X, z: ARENA.Z }; BO.salto = { x0: BO.x, z0: BO.z, x1: A.x, z1: A.z }; bfxMarca(A.x, A.z, 6, '#7aff4a', 1.4); }
        const S = BO.salto; if (u < 0.25) { m.b.scale.set(1.2, 0.7, 1.2); } else { const k = (u - 0.25) / 0.75; BO.x = S.x0 + (S.x1 - S.x0) * k; BO.z = S.z0 + (S.z1 - S.z0) * k; m.g.position.y = Math.sin(k * Math.PI) * 9; m.b.scale.set(0.85, 1.25, 0.85); } },
      acerta(m, vivos) { m.g.position.y = 0; m.b.scale.set(1.35, 0.6, 1.35); fx('fumo', [BO.x, 0.3, BO.z], 1); fx('cura', [BO.x, 0.5, BO.z], 0.8); tremor = Math.max(tremor, 0.45); try { som('golem_soco', 0.9, 0.6); } catch (x) {}
        vivos.forEach(o => { if (Math.hypot(o.x - BO.x, o.z - BO.z) < 6) boAcerta(o, Math.round(22 + Math.random() * 12), '#7aff4a', 3); }); BO.salto = null; } } };
  // projéteis (teia / veneno): vão até o alvo
  function boLanca(vivos, n, cor, hit) { vivos.slice().sort((a, b) => Math.hypot(a.x - BO.x, a.z - BO.z) - Math.hypot(b.x - BO.x, b.z - BO.z)).slice(0, n).forEach((A, i) => {
    const s = glowSpr(ARG.G, BO.x - ARENA.X, 3, BO.z - ARENA.Z, 1.6, cor, 1), m = new T3.Mesh(SPH, new T3.MeshBasicMaterial({ color: cor, toneMapped: false })); m.scale.setScalar(0.35); s.add(m);
    BFX.push({ obs: [s], t: -i * 0.12, dur: 3, passo(dt, o) { if (o.t < 0) return; const tx = A.x - ARENA.X, tz = A.z - ARENA.Z, dx = tx - s.position.x, dz = tz - s.position.z, d = Math.hypot(dx, dz), v = 16 * dt; s.position.y = 1.2 + Math.max(0, d / 6);
      if (d < 0.8 || A.morto) { o.fim = true; if (!A.morto) hit(A); fx('luz', [A.x, 1, A.z], 0.3); } else { s.position.x += dx / d * Math.min(v, d); s.position.z += dz / d * Math.min(v, d); } } }); }); }
  function arenaBossNasce(dourado, forca) { const ant = BO.M; if (BO.e) BO.e.g.visible = false;
    if (forca && MONSTRO(forca)) BO.idx = MONSTROS.indexOf(MONSTRO(forca)); else if (!dourado || !ant) BO.idx = (BO.idx + 1) % MONSTROS.length;
    const M = MONSTROS[BO.idx]; BO.M = M; BO.nome = M.nome; BO.r = M.r;
    if (!BO.cache[M.id]) { const e = M.monta(); ARG.G.add(e.g); e.g.position.set(0, 0, 0); e.aura = glowSpr(e.g, 0, 2.2, 0, 9, M.cor, 0.35); BO.cache[M.id] = e; }
    const e = BO.cache[M.id]; BO.e = e; BO.aura = e.aura; BO.aura.material.color.set(M.cor); BO.x = ARENA.X; BO.z = ARENA.Z; BO.salto = null; BO.marcas = null; BO.fase = 0;
    e.g.visible = true; e.g.rotation.set(0, 0, 0); e.g.position.set(0, 0, 0); e.b.scale.set(1, 1, 1); BO.max = 2000 + 300 * Object.keys(ARENA.lut).length; BO.hp = BO.max; BO.vivo = true; BO.queda = 0; BO.cd = 3; BO.golpe = -1; BO.ult = null; Object.values(ARENA.lut).forEach(L => { L.danoBoss = 0; });
    boBar.querySelector('b').textContent = M.ic + ' ' + M.nome.toUpperCase(); boBar.style.setProperty('--bo', M.cor);
    fx('luz', [BO.x, 0, BO.z], 1.5); fx('fumo', [BO.x, 0, BO.z], 1.5); try { som('portal', 0.8, 0.6); } catch (x) {}
    { const C = ARENA.cam; if (C.modo !== 'fixa') { C.modo = 'boss'; C.t = 4.5; C.a = BO.rot + 0.35; } }
    if (!dourado) { arenaFeed(M.ic + ' <b>' + M.nome.toUpperCase() + '</b> apareceu! Ele ' + M.dica + '. Comente LUTAR pra derrubar!'); arenaFala(M.nome + ' apareceu na arena! Cuidado, ele ' + M.dica + '! Todo mundo pra cima dele!', true); }
    else arenaFeed('👑 <b>' + M.nome.split(',')[0].toUpperCase() + ' DOURADO</b> apareceu! Vale o dobro de pontos!'); }
  function arenaBossMorre(L) { BO.vivo = false; BO.hp = 0; BO.queda = 0.001; BO.espera = 8; const ptF = arenaPts(L, BO.dourado ? 1000 : 500); const M = BO.M, nm = M.nome.split(',')[0]; if (BO.dourado) { BO.dourado = false; if (BO.aura) BO.aura.material.color.set(M.cor); }
    if (BO.e.fogoB) { BO.e.fogoB.material.opacity = 0; } BO.e.g.position.y = 0; BO.salto = null; BO.marcas = null; const top = Object.values(ARENA.lut).sort((p, q) => (q.danoBoss || 0) - (p.danoBoss || 0))[0];
    const ptT = top && top !== L ? arenaPts(top, 300) : 0; fx('fogo', [BO.x, 2, BO.z], 1.5); fx('luz', [BO.x, 0, BO.z], 1.5); try { som('magia', 1, 0.6); } catch (x) {} tremor = 0.6;
    arenaFeed('💥 <b>' + L.nome + '</b> deu o golpe final em ' + M.ic + ' ' + nm.toUpperCase() + '! (+' + ptF + ')' + (ptT ? ' · <b>' + top.nome + '</b> causou mais dano (+' + ptT + ')' : '')); aviso('💥 ' + nm.toUpperCase() + ' DERROTADO por ' + L.nome + '! O próximo monstro vem aí...', '#ffd23c'); arenaFala(nm + ' foi derrotado por ' + L.nome + '! Agora é todo mundo contra todo mundo, e o próximo monstro já está vindo!', true); arenaFoca(L, 4); }
  function arenaBossFrame(dt, vivos) { const on = zona === 'arena'; bfxFrame(dt);
    if (!on) { boBar.hidden = true; return; }
    if (!BO.vivo && !BO.queda) { BO.espera -= dt; if (BO.espera <= 0) arenaBossNasce(); }
    const e = BO.e; boBar.hidden = !(BO.vivo || BO.queda); if (!e) return; const M = BO.M;
    if (BO.queda) { BO.queda += dt; e.g.rotation.x = -Math.min(1.45, BO.queda * 1.1); e.g.position.y = -Math.max(0, BO.queda - 1.5) * 2; if (BO.queda > 4) { BO.queda = 0; e.g.visible = false; } }
    if (!BO.vivo) { boBar.querySelector('i').style.width = '0%'; return; }
    const t = gT; BO.vivosR = vivos;
    // volta devagar pro centro (depois de um pulo)
    if (!BO.salto) { const dx = ARENA.X - BO.x, dz = ARENA.Z - BO.z, d = Math.hypot(dx, dz); if (d > 0.2) { const v = Math.min(d, dt * 2.2); BO.x += dx / d * v; BO.z += dz / d * v; } }
    e.g.position.x = BO.x - ARENA.X; e.g.position.z = BO.z - ARENA.Z; BO.pos.set(BO.x, 9, BO.z);
    let alvo = null, bd = 1e9; vivos.forEach(o => { const d = Math.hypot(o.x - BO.x, o.z - BO.z); if (d < bd) { bd = d; alvo = o; } });
    if (M.ataque === 'pulo' && vivos.length) alvo = vivos.slice().sort((a, b) => Math.hypot(b.x - BO.x, b.z - BO.z) - Math.hypot(a.x - BO.x, a.z - BO.z))[0];
    const A = ATQ[M.ataque];
    if (BO.golpe < 0 || BO.golpe >= A.w) { if (alvo) { let dr = Math.atan2(alvo.x - BO.x, alvo.z - BO.z) - BO.rot; while (dr > Math.PI) dr -= Math.PI * 2; while (dr < -Math.PI) dr += Math.PI * 2; if (!(BO.golpe >= 0 && A.dura)) BO.rot += dr * clamp(dt * 1.5); } else BO.rot += dt * 0.2; }
    e.g.rotation.y = BO.rot;
    if (BO.golpe < 0) { if (M.idle) M.idle(e, t); else { e.arms.forEach((a, i) => a.rotation.x = Math.sin(t * 1.4 + i * Math.PI) * 0.25); e.b.position.y = Math.sin(t * 1.6) * 0.06; }
      if (M.ataque !== 'pulo' && M.id !== 'raio') e.b.scale.set(1, 1, 1); if (M.ataque === 'pulo') M.idle(e, t);
      BO.cd -= dt; const alc = { soco: 9, gelo: 9, giro: 9, fogo: 12, teia: 20, cuspe: 20, raios: 40, pulo: 40 }[M.ataque]; if (BO.cd <= 0 && alvo && bd < alc) { BO.golpe = 0; BO.bateu = false; BO.tick = 0; } }
    else { BO.golpe += dt; if (BO.golpe < A.w) A.prepara(e, BO.golpe / A.w, alvo);
      else { if (!BO.bateu) { BO.bateu = true; A.acerta(e, vivos, alvo); } else if (A.dura) A.dura(e, vivos, dt, (BO.golpe - A.w) / (A.fim - A.w));
        if (BO.golpe > A.fim) { if (A.solta) A.solta(e); BO.golpe = -1; BO.bateu = false; BO.cd = 2.2 + Math.random() * 1.2 - (BO.hp < BO.max / 2 ? 0.8 : 0); } } }
    boBar.querySelector('i').style.width = (BO.hp / BO.max * 100).toFixed(1) + '%'; boBar.querySelector('small').textContent = Math.ceil(BO.hp) + ' / ' + BO.max + (vivos.length ? ' · ' + vivos.length + ' lutando' : ' · esperando lutadores'); }
  window.__arenaMonstro = id => { if (zona !== 'arena') return 'entre na arena'; if (BO.vivo) { BO.vivo = false; BO.e.g.visible = false; } arenaBossNasce(false, id); return BO.nome; };
  /* ----- VOZ da arena (ElevenLabs pelo servidor da live; sem chave usa a voz do aparelho) ----- */
  const VOZ = { on: true, fila: [], tocando: false, base: '', falhou: 0, cta: 0 };
  try { VOZ.on = localStorage.getItem('arenaVoz') !== '0'; } catch (e) {}
  function vozLimpa(t) { return String(t || '').replace(/<[^>]+>/g, ' ').replace(/\s=\s/g, ' e ganhe ').replace(/·/g, ',').replace(/\bx(\d)/g, 'vezes $1').replace(/\+(\d)/g, 'mais $1').replace(/[()]/g, ' ').replace(/\bGG\b/g, 'gê gê').replace(/\p{Lu}{3,}/gu, w => w.toLowerCase()).replace(/\s+,/g, ',').replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, ' ').replace(/https?:\S+/g, '').replace(/\s+/g, ' ').trim().slice(0, 420); }
  function arenaFala(t, prio) { if (!VOZ.on || zona !== 'arena') return; t = vozLimpa(t); if (t.length < 2) return; if (prio) { VOZ.fila = VOZ.fila.filter(x => x.prio); VOZ.fila.push({ t, prio }); if (VOZ.fila.length > 4) VOZ.fila.splice(0, VOZ.fila.length - 4); } else if (VOZ.fila.length < 2) VOZ.fila.push({ t }); vozProx(); }
  function vozDispositivo(t, fim) { try { const s = window.speechSynthesis; if (!s) return fim(); const u = new SpeechSynthesisUtterance(t); u.lang = 'pt-BR'; u.rate = 1.05; u.onend = fim; u.onerror = fim; s.speak(u); setTimeout(fim, 32000); } catch (e) { fim(); } }
  function vozProx() { if (VOZ.tocando || !VOZ.fila.length) return; const { t } = VOZ.fila.shift(); VOZ.tocando = true; let feito = false; const fim = () => { if (feito) return; feito = true; VOZ.tocando = false; setTimeout(vozProx, 250); };
    let pin = ''; try { pin = localStorage.getItem('liveKey') || ''; } catch (e) {} const base = LIVE.url.replace(/^ws/, 'http').replace(/\/$/, '');
    if (VOZ.falhou >= 3) return vozDispositivo(t, fim);
    const a = new Audio(base + '/tts?t=' + encodeURIComponent(t) + (pin ? '&key=' + encodeURIComponent(pin) : '')); a.volume = 1;
    a.onended = fim; a.onerror = () => { VOZ.falhou++; vozDispositivo(t, fim); }; a.play().catch(() => { VOZ.falhou++; vozDispositivo(t, fim); }); setTimeout(() => { if (!feito && a.paused) { try { a.pause(); } catch (e) {} fim(); } }, 15000); }
  /* ----- chamadas na tela: explicam como entrar e o que cada presente faz, repetindo durante a live ----- */
  const ctaEl = document.createElement('div'); ctaEl.id = 'arena-cta'; ctaEl.className = 'arena-keep'; ctaEl.hidden = true; document.body.appendChild(ctaEl);
  const CTA = { i: 0, t: 2, on: false };
  function arenaCtaLista() { const L = ['💬 Comente <b>LUTAR</b> e deixe de ser palhaço!', '⭐ Abate = <b>100 pts</b> · Monstro = <b>500 pts</b> · Duelo = <b>300 pts</b>', '🤡 Entrou na live = entrou como <b>palhaço</b>! Comente <b>LUTAR</b> pra virar guerreiro'];
    ARENA_PRES.forEach(P => L.push(P.ic + ' Mande <b>' + P.nomes[0].replace(/^./, c => c.toUpperCase()) + '</b> = ' + P.item + ' <span style="color:' + P.cor + '">(' + P.fx + ')</span>'));
    L.push('⚔️ Comente <b>DUELO</b> e o nome de alguém pra desafiar!', '🔴🔵 Comente <b>VERMELHO</b> ou <b>AZUL</b> e entre num time!', '🎯 Meta: faltam <b>' + (MT.alvo - MT.n) + '</b> presentes pra chuva de itens!', '⏱ Rodada acaba em <b>' + arenaRelogio() + '</b>: o campeão ganha a coroa 👑', '👍 Muitas curtidas = <b>CHUVA DE CORAÇÕES</b> e cura pra todos!', '🎁 Qualquer presente também te coloca na luta na hora!', '🏆 Quem mais derrotar fica no <b>TOPO</b> do ranking!', '❤️ Seguiu a live? Seu lutador recupera a vida toda!', '👍 Curtidas curam seu lutador durante a luta!');
    if (BO.vivo) L.push(BO.M.ic + ' <b>' + BO.M.nome.split(',')[0].toUpperCase() + '</b> está no meio da arena! Comente LUTAR e ajude a derrubar!', '💥 Golpe final no monstro vale <b>+500</b> pontos!', '⚠️ Cuidado: ' + BO.M.nome.split(',')[0] + ' ' + BO.M.dica + '!');
    const top = Object.values(ARENA.lut).sort((p, q) => q.kills - p.kills)[0]; if (top && top.kills > 0) L.push('👑 <b>' + top.nome + '</b> está no topo com ' + arenaFmt(top.kills) + ' pontos. Quem derruba?');
    return L; }
  function arenaCtaFrame(dt) { if (zona !== 'arena') { ctaEl.hidden = true; return; } CTA.t -= dt; if (CTA.t > 0) return;
    if (CTA.on) { ctaEl.classList.remove('on'); CTA.on = false; CTA.t = 1.2; return; }
    const L = arenaCtaLista(); /* a cada 2 mensagens, volta pra chamada principal */ let msg; if (CTA.i % 3 === 0) msg = CTA.i % 6 === 0 ? L[0] : L[2]; else { const R = [L[1]].concat(L.slice(3)); msg = R[(CTA.j || 0) % R.length]; CTA.j = (CTA.j || 0) + 1; } CTA.i++;
    ctaEl.innerHTML = msg; if (!/lutar/i.test(msg) && (CTA.i % 3 === 1 || !VOZ.fila.length && !VOZ.tocando && Math.random() < 0.5)) arenaFala(msg); ctaEl.hidden = false; void ctaEl.offsetWidth; ctaEl.classList.add('on'); CTA.on = true; CTA.t = 6; }
  /* ----- ELO DE LUZ: presente = sai uma luz do meio da arena e vai pro personagem, que sobe de nível ----- */
  const ELOS = [], ELO_GEO = { col: new T3.CylinderGeometry(0.7, 1.1, 1, 16, 1, true), elo: new T3.TorusGeometry(0.5, 0.1, 8, 18), raio: new T3.CylinderGeometry(0.12, 0.12, 1, 8, 1, true), anel: new T3.RingGeometry(0.6, 0.85, 40) };
  const eloMat = c => new T3.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false, side: T3.DoubleSide });
  function arenaElo(L, P) { const nv = ARENA_TEMAS[ARENA_TEMA].id === 'neon', c1 = nv ? (P.nv >= 3 ? '#ff2ad8' : '#2af0ff') : P.cor, c2 = nv ? '#ff5ae8' : '#ffffff';
    const G = grp(world, ARENA.X, 0, ARENA.Z); const col = new T3.Mesh(ELO_GEO.col, eloMat(c1)); col.scale.set(1, 16, 1); col.position.y = 8; G.add(col);
    const base = new T3.Mesh(ELO_GEO.anel, eloMat(c1)); base.rotation.x = -Math.PI / 2; base.position.y = 0.06; base.scale.setScalar(3); G.add(base);
    const raio = new T3.Mesh(ELO_GEO.raio, eloMat(c2)); world.add(raio); const elos = []; for (let i = 0; i < 13; i++) { const e = new T3.Mesh(ELO_GEO.elo, eloMat(i % 2 ? c2 : c1)); world.add(e); elos.push(e); }
    const orbe = glowSpr(world, ARENA.X, 6, ARENA.Z, 2.6, c1, 1), anel = new T3.Mesh(ELO_GEO.anel, eloMat(c1)); anel.rotation.x = -Math.PI / 2; anel.visible = false; world.add(anel);
    ELOS.push({ L, G, col, base, raio, elos, orbe, anel, t: 0, nv: P.nv, c1 }); fx('luz', [ARENA.X, 0, ARENA.Z], 1); }
  const _ea = new T3.Vector3(), _eb = new T3.Vector3(), _ec = new T3.Vector3(), _eu = new T3.Vector3(0, 1, 0), _eq = new T3.Quaternion();
  function arenaElosFrame(dt) { for (let k = ELOS.length - 1; k >= 0; k--) { const E = ELOS[k], L = E.L; E.t += dt; const t = E.t, T = 2.6 + E.nv * 0.3;
      const sobe = Math.min(1, t / 0.5), some = t > T - 0.6 ? Math.max(0, (T - t) / 0.6) : 1;
      E.col.scale.set(1 + Math.sin(t * 12) * 0.08, 16 * sobe, 1 + Math.sin(t * 12) * 0.08); E.col.position.y = 8 * sobe; E.col.material.opacity = 0.75 * some; E.base.scale.setScalar(3 + Math.sin(t * 6) * 0.4); E.base.material.opacity = some;
      // curva do meio da arena (alto) até o peito do personagem
      _ea.set(ARENA.X, 9, ARENA.Z); _eb.set(L.x, (L.y || 0) + 1.25, L.z); const vai = clamp((t - 0.35) / 0.55);
      const pt = (u, out) => { const m = 1 - u; out.set(m * m * _ea.x + 2 * m * u * (_ea.x + _eb.x) / 2 + u * u * _eb.x, m * m * _ea.y + 2 * m * u * 13 + u * u * _eb.y, m * m * _ea.z + 2 * m * u * (_ea.z + _eb.z) / 2 + u * u * _eb.z); return out; };
      E.elos.forEach((e, i) => { const u = (i + 0.5) / E.elos.length; e.visible = u <= vai && some > 0; pt(u, e.position); pt(Math.min(1, u + 0.02), _ec); e.lookAt(_ec); e.rotateZ(i % 2 ? Math.PI / 2 : 0); e.rotation.z += t * 2; e.scale.setScalar(1 + Math.sin(t * 10 + i) * 0.15); e.material.opacity = 0.95 * some; });
      pt(0, _ea); pt(vai, _ec); const d = _ea.distanceTo(_ec); E.raio.visible = d > 0.1 && some > 0; E.raio.position.copy(_ea).add(_ec).multiplyScalar(0.5); E.raio.scale.set(1, d, 1); E.raio.quaternion.setFromUnitVectors(_eu, _ec.clone().sub(_ea).normalize()); E.raio.material.opacity = 0.8 * some;
      pt(vai, _ec); E.orbe.position.copy(_ec); E.orbe.material.opacity = vai < 1 ? 1 : some;
      if (vai >= 1 && !E.chegou) { E.chegou = true; E.anel.visible = true; fx('luz', [L.x, 0, L.z], 1.2); fx('cura', [L.x, 0, L.z], 1); try { numero(L.c.position, 'LEVEL UP! Nv ' + (1 + L.up), E.c1, 2.8); } catch (e) {} try { som('portal', 0.6, 1.4); } catch (e) {} L.pulso = 1; }
      if (E.chegou) { const a = Math.min(1, (t - 0.9) / 0.9); E.anel.position.set(L.x, (L.y || 0) + 0.08, L.z); E.anel.scale.setScalar(1 + a * 3.5); E.anel.material.opacity = (1 - a) * 0.9; }
      if (t > T) { world.remove(E.G); world.remove(E.raio); world.remove(E.orbe); world.remove(E.anel); E.elos.forEach(e => world.remove(e)); [E.col, E.base, E.raio, E.anel, ...E.elos].forEach(m => m.material.dispose()); ELOS.splice(k, 1); } } }
  /* ===================== SHOW DA LIVE: meta de presentes, rodadas com campeão, duelo, times, chuva de corações e narrador ===================== */
  const MT = { n: 0, alvo: 30, ev: 0 }, RD = { t: 300, n: 1, camp: null, campeoes: [] }, DU = { on: false, a: null, b: null, t: 0 }, TIM = { r: 0, b: 0 }, CR = { lista: [], t: 0, cd: 0, n: 0, sprs: [] }, NR = { t: 25 };
  const showEl = document.createElement('div'); showEl.id = 'arena-show'; showEl.className = 'arena-keep'; showEl.hidden = true; document.body.appendChild(showEl);
  function arenaRelogio() { const t = Math.max(0, Math.ceil(RD.t)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }
  function arenaPlacarTimes() { const ls = Object.values(ARENA.lut); if (!ls.some(L => L.time)) return ''; return `<div class="ar-times"><span class="r">🔴 ${TIM.r}</span><small>TIMES</small><span class="b">${TIM.b} 🔵</span></div>`; }
  function arenaAmigo(L, o) { if (!o || o.boss) return false; if (L.time && L.time === o.time) return true; if (DU.on) { const dl = L === DU.a || L === DU.b, dob = o === DU.a || o === DU.b; if (dl !== dob) return true; } return false; }
  function arenaNorm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function arenaParaLuta(id, nome, foto) { let L = ARENA.lut[id]; if (L) return L; const S0 = ARENA.plat[id]; if (S0) arenaPlatTira(id); L = arenaLut(id, (S0 && S0.nome) || nome, foto || (S0 && S0.foto)); arenaFoca(L, 3); return L; }
  /* comentários especiais: VERMELHO / AZUL (times) e DUELO nome */
  function arenaComando(m, id, foto) { const n = arenaNorm(m.text); const perg = arenaPergunta(n); if (perg) { arenaExplica(perg); if (perg !== 'lutar') { if (!ARENA.lut[id] && !arenaPalhaco(m, id, foto)) arenaPlat(id, m.name, foto); return true; } }
    const du = n.match(/\bduelo\b\s*@?\s*([^\s].{0,30})?/);
    if (du) { const L = arenaParaLuta(id, m.name, foto); const alvoTxt = (du[1] || '').trim(); arenaDuelo(L, alvoTxt); return true; }
    const tm = /\bvermelho\b/.test(n) ? 'r' : /\bazul\b/.test(n) ? 'b' : '';
    if (tm) { const L = arenaParaLuta(id, m.name, foto); if (L.time !== tm) { L.time = tm; L.h = ''; L.alvo = null; const nm = tm === 'r' ? 'VERMELHO' : 'AZUL'; arenaFeed((tm === 'r' ? '🔴' : '🔵') + ' <b>' + L.nome + '</b> entrou pro time <b>' + nm + '</b>!'); arenaFala(L.nome + ' entrou pro time ' + nm.toLowerCase() + '!'); } return true; }
    return false; }
  /* ---- duelo ---- */
  const duAnel = new T3.Mesh(new T3.TorusGeometry(3.2, 0.12, 6, 64), new T3.MeshBasicMaterial({ color: '#ffd23c', transparent: true, opacity: 0.9, toneMapped: false })); duAnel.rotation.x = Math.PI / 2; duAnel.visible = false; world.add(duAnel);
  function arenaDuelo(L, txt) { if (DU.on) { arenaFeed('⏳ Já tem um duelo rolando, <b>' + L.nome + '</b>. Espera acabar!'); return; }
    const t = arenaNorm(txt).replace(/^@/, '').trim(); const todos = Object.values(ARENA.lut).filter(o => o !== L).concat(Object.values(ARENA.plat));
    let o = t ? todos.find(x => arenaNorm(x.nome) === t) || todos.find(x => t.length >= 3 && arenaNorm(x.nome).includes(t)) || todos.find(x => t.length >= 3 && t.includes(arenaNorm(x.nome))) : null;
    if (!o) { const ls = Object.values(ARENA.lut).filter(x => x !== L && !x.morto); o = ls.sort((p, q) => q.kills - p.kills)[0]; if (!o) { arenaFeed('⚔️ <b>' + L.nome + '</b> quer duelo, mas não tem ninguém na arena!'); return; } }
    if (o.plat) o = arenaParaLuta(o.id, o.nome, o.foto);
    DU.on = true; DU.a = L; DU.b = o; DU.t = 60; [L, o].forEach(x => { x.hp = x.max; x.morto = 0; x.h = ''; });
    arenaFeed('⚔️ <b>DUELO!</b> ' + arenaFoto(L, 'mi') + ' <b>' + L.nome + '</b> desafiou ' + arenaFoto(o, 'mi') + ' <b>' + o.nome + '</b>!'); aviso('⚔️ DUELO: ' + L.nome + ' x ' + o.nome + '!', '#ffd23c');
    arenaFala('Duelo! ' + L.nome + ' desafiou ' + o.nome + '! Valendo três pontos!', true); arenaFoca(L, 3.5); ARENA.fila = [o]; }
  function arenaDueloFim(venc, perd) { if (!DU.on) return; DU.on = false; duAnel.visible = false; [DU.a, DU.b].forEach(x => { if (x) x.h = ''; });
    if (venc) { const pv = arenaPts(venc, 300); venc.hp = venc.max; arenaFeed('🏆 <b>' + venc.nome + '</b> venceu o duelo contra <b>' + perd.nome + '</b>! (+' + pv + ')'); aviso('🏆 ' + venc.nome + ' venceu o duelo!', '#ffd23c'); arenaFala(venc.nome + ' venceu o duelo contra ' + perd.nome + '!', true); arenaFoca(venc, 3.5); }
    else { arenaFeed('⏱️ O duelo deu empate por tempo!'); arenaFala('O duelo terminou empatado!', true); } DU.a = DU.b = null; }
  function arenaAbate(L, A) { arenaLocAbate(L, A); if (L.time && A.time && L.time !== A.time) { TIM[L.time]++; } else if (L.time && !A.time) TIM[L.time]++;
    if (DU.on && ((L === DU.a && A === DU.b) || (L === DU.b && A === DU.a))) arenaDueloFim(L, A); }
  /* ---- meta de presentes ---- */
  function arenaMeta(n, L) { MT.n += n; if (MT.n >= MT.alvo) { MT.n = 0; MT.ev++; arenaMetaCompleta(L); MT.alvo += 10; } }
  function arenaMetaCompleta(L) { aviso('🎯 META BATIDA! Chuva de itens pra todo mundo!', '#2af0ff'); arenaFeed('🎯 <b>META DE PRESENTES BATIDA!</b> Chuva de itens + Monstro Dourado!'); arenaFala('Meta de presentes batida! Chuva de itens pra todo mundo, e um monstro dourado vai aparecer!', true);
    const baratos = ARENA_PRES.filter(P => P.nv === 1); Object.values(ARENA.lut).forEach((x, i) => setTimeout(() => { if (ARENA.lut[x.id]) { const P = baratos[Math.floor(Math.random() * baratos.length)]; arenaPresente(x, P.nomes[0], 1, true); } }, 400 + i * 350));
    setTimeout(() => { if (!BO.vivo && zona === 'arena') { arenaBossNasce(true); BO.max *= 2; BO.hp = BO.max; BO.dourado = true; if (BO.aura) BO.aura.material.color.set('#ffd23c'); boBar.querySelector('b').textContent = '👑 ' + BO.M.nome.split(',')[0].toUpperCase() + ' DOURADO'; arenaFala(BO.M.nome.split(',')[0] + ' Dourado apareceu! Ele vale o dobro de pontos!', true); } }, 2500); }
  /* ---- rodadas com campeão ---- */
  function arenaCoroa(L) { Object.values(ARENA.lut).forEach(x => { if (x.coroa) { x.c.userData.P.head.remove(x.coroa); x.coroa = null; x.h = ''; } }); if (!L) return;
    const g = grp(L.c.userData.P.head, 0, 0.36, 0); part(g, CYL, '#ffd23c', 0, 0, 0, 0.2, 0.08, 0.2, 0.02, true); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; part(g, CONE, '#ffd23c', Math.sin(a) * 0.17, 0.1, Math.cos(a) * 0.17, 0.05, 0.14, 0.05, 0.02, true); } glowSpr(g, 0, 0.1, 0, 0.8, '#ffd23c', 0.6); L.coroa = g; L.h = ''; }
  function arenaRodadaFim() { const ls = Object.values(ARENA.lut).sort((p, q) => q.kills - p.kills || p.mortes - q.mortes), c = ls[0] && ls[0].kills > 0 ? ls[0] : null;
    if (c) { RD.camp = { nome: c.nome, id: c.id, kills: c.kills }; RD.campeoes.unshift(RD.camp); RD.campeoes.length = Math.min(3, RD.campeoes.length); arenaCoroa(c); fx('luz', [c.x, 0, c.z], 1.5); aviso('👑 ' + c.nome + ' é o CAMPEÃO da rodada ' + RD.n + ' com ' + c.kills + ' abates!', '#ffd23c');
      arenaFeed('👑 <b>' + c.nome + '</b> é o <b>CAMPEÃO</b> da rodada ' + RD.n + '!'); arenaFala(c.nome + ' é o campeão da rodada ' + RD.n + ', com ' + c.kills + ' pontos! Ganhou a coroa! Nova rodada começando!', true); arenaFoca(c, 5); }
    else arenaFala('Nova rodada começando! Placar zerado, todo mundo tem chance!', true);
    Object.values(ARENA.lut).forEach(x => { x.kills = 0; x.mortes = 0; x.abates = 0; x.danoBoss = 0; }); LOC.pos = {}; TIM.r = TIM.b = 0; RD.n++; RD.t = 300; }
  /* ---- curtidas: corações caindo e chuva de corações ---- */
  const corTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(24, 22, 4, 32, 34, 30); gr.addColorStop(0, '#ff9ab8'); gr.addColorStop(1, '#ff1a4a'); g.fillStyle = gr; g.beginPath(); g.moveTo(32, 56); g.bezierCurveTo(4, 36, 6, 10, 20, 10); g.bezierCurveTo(27, 10, 31, 15, 32, 20); g.bezierCurveTo(33, 15, 37, 10, 44, 10); g.bezierCurveTo(58, 10, 60, 36, 32, 56); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.ellipse(21, 20, 5, 3, -0.6, 0, 7); g.fill(); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; })();
  const corMat = new T3.SpriteMaterial({ map: corTex, transparent: true, depthWrite: false });
  function arenaCoracoes(n) { for (let i = 0; i < n; i++) { if (CR.sprs.length > 120) break; const s = new T3.Sprite(corMat); const a = Math.random() * Math.PI * 2, r = Math.random() * ARENA.R; s.position.set(ARENA.X + Math.sin(a) * r, 14 + Math.random() * 10, ARENA.Z + Math.cos(a) * r); s.scale.setScalar(0.9 + Math.random() * 0.9); s.userData.v = 3 + Math.random() * 3; s.userData.f = Math.random() * 6; world.add(s); CR.sprs.push(s); } }
  function arenaCurtida(n) { if (zona !== 'arena') return; n = Math.min(30, n); CR.lista.push([performance.now(), n]); arenaCoracoes(Math.min(6, n));
    const agora = performance.now(); CR.lista = CR.lista.filter(x => agora - x[0] < 10000); const tot = CR.lista.reduce((a, x) => a + x[1], 0);
    if (tot >= 40 && CR.cd <= 0) { CR.cd = 30; CR.lista = []; arenaCoracoes(90); Object.values(ARENA.lut).forEach(x => { if (!x.morto) { x.hp = x.max; } }); aviso('❤️ CHUVA DE CORAÇÕES! Todo mundo curado!', '#ff5a8a'); arenaFeed('❤️ <b>CHUVA DE CORAÇÕES!</b> As curtidas curaram todo mundo!'); arenaFala('Chuva de corações! As curtidas curaram todos os lutadores!', true); } }
  /* ---- narrador: explica como funciona de tempos em tempos ---- */
  const EXPLICA = {
    lutar: ['⚔️ <b>COMO ENTRAR:</b> comente <b>LUTAR</b> no chat', 'Como funciona a luta: quem entra na live já cai na arena como palhaço, sem arma, com pouca vida e pouco dano, e ganha quase nenhum ponto. Mande um presente e você vira guerreiro: mais forte, com espada de verdade. Cada adversário derrubado vale cem pontos, golpe final no monstro vale quinhentos!'],
    duelo: ['🤺 <b>DUELO:</b> comente <b>DUELO</b> + nome da pessoa · vencedor +300 pontos', 'Como funciona o duelo: comente duelo e o nome de quem você quer desafiar, por exemplo, duelo Maria. Os dois lutam sozinhos dentro de um anel dourado, e ninguém mais pode atacar vocês. Quem vencer ganha três pontos. Se ninguém cair em um minuto, dá empate. Se escrever só duelo, você desafia o primeiro do ranking.'],
    times: ['🔴🔵 <b>TIMES:</b> comente <b>VERMELHO</b> ou <b>AZUL</b> · time não se ataca', 'Como funcionam os times: comente vermelho ou azul pra escolher seu lado. Quem é do mesmo time não se ataca, então vocês lutam juntos contra o outro time. Cada abate soma um ponto pro seu time no placar. Qual time escolher? Entra no time que está perdendo pra ajudar a virar, ou no time do seu amigo pra lutar junto com ele!'],
    presentes: ['🎁 <b>PRESENTES:</b> entra na luta + item de poder + sobe de nível', 'Como funcionam os presentes: qualquer presente coloca você direto na luta e dá um item de poder. Rosa dá uma espada com mais dano, casquinha dá um escudo com mais vida, bom jogo dá botas de velocidade, e o coração faz você se curar sozinho. Cada presente também sobe seu nível, e seu lutador fica maior.'],
    divinos: ['✨ <b>ARTEFATOS DIVINOS</b> têm poderes: sol de fogo, gelo e fogo espectral', 'Os artefatos divinos têm poderes de verdade! O Emblema Flamejante joga um sol de fogo que explode e queima os inimigos. O Astrolábio Arcano solta o corte glacial, pilares de gelo que congelam e o juízo congelado que cai do céu. E o Manto do Abismo queima quem chega perto com fogo espectral e avança com as asas roubando vida. Mini dino dá o Emblema, o controle dá o Astrolábio, e os presentes grandes dão o Manto.'],
    meta: ['🎯 <b>META:</b> completou = chuva de itens + Monstro Dourado', 'Como funciona a meta de presentes: a barra na tela enche com cada presente. Quando completar, cai uma chuva de itens pra todo mundo que está lutando, e aparece o Titã Dourado, que vale o dobro de pontos.'],
    tita: ['👹 <b>MONSTROS:</b> 8 chefes diferentes revezam · golpe final +500 · mais dano +300', 'Como funcionam os monstros: um chefe gigante aparece no meio da arena e todo mundo ataca ele junto. São oito monstros diferentes que revezam: o Titã, o Dragão Ignarok que cospe fogo, a Aranha Aracnys que prende na teia, o Colosso de Gelo que congela, a Hidra que cospe veneno, o Voltarion que solta raios, o Rei Esqueleto que gira a espada e o Rei Gosma que pula em cima de quem está longe. Quem der o golpe final ganha quinhentos pontos, e quem causar mais dano ganha trezentos!'],
    rodada: ['👑 <b>RODADA:</b> 5 minutos · mais abates = campeão com coroa', 'Como funcionam as rodadas: cada rodada dura cinco minutos. No fim, quem tiver mais abates vira o campeão e ganha uma coroa dourada na cabeça. Depois os pontos zeram e começa tudo de novo, então sempre dá tempo de ganhar!'],
    curtidas: ['👍 <b>CURTIDAS</b> curam · muitas juntas = chuva de corações', 'Curtidas também ajudam! Cada curtida cura um pouco o seu lutador, e quando a galera curte muito junto, cai uma chuva de corações que cura todo mundo. E se você seguir a live, seu lutador volta com a vida cheia!'] };
  const NARRA = ['Bem-vindos à Arena da Live! Quem entra na live já cai na arena como palhaço, sem arma e fraquinho. Mande um presente e você vira guerreiro de verdade! Comente duelo pra desafiar alguém, ou vermelho e azul pra entrar num time!'].concat(Object.values(EXPLICA).map(x => x[1]));
  const EXP_T = {};
  function arenaExplica(k) { const E = EXPLICA[k]; if (!E) return; const agora = performance.now(); if (EXP_T[k] && agora - EXP_T[k] < 20000) return; EXP_T[k] = agora; arenaFala(E[1], true);
    ctaEl.innerHTML = '📖 ' + E[0]; ctaEl.hidden = false; void ctaEl.offsetWidth; ctaEl.classList.add('on'); CTA.on = true; CTA.t = 10; }
  /* pergunta no chat ("como funciona o duelo?") -> o locutor explica */
  function arenaPergunta(n) { if (!/\bcomo\b|\?|\bqual\b|\bo que\b|\bexplica|\bajuda|\bnao entendi/.test(n)) return null;
    const M = [['duelo', /duelo|desafi/], ['times', /time|vermelho|azul|lado/], ['divinos', /divin|artefat|poder|emblema|astrolabio|manto/], ['presentes', /presente|rosa|item|nivel/], ['meta', /meta|barra/], ['tita', /tita|boss|chefe|gigante|monstro|chefe|boss|drag|aranha|hidra|gelo|raio|esquelet|gosma/], ['rodada', /rodada|coroa|campeao/], ['curtidas', /curti|coracao|like/], ['lutar', /lut|entr|jog|particip|funciona|faz/]];
    const m = M.find(x => x[1].test(n)); return m ? m[0] : null; }
  /* ===================== LOCUTOR: comenta a luta o tempo todo, sem repetir ===================== */
  const LOC_HYPE = ['Que batalha, galera! A arena está pegando fogo!', 'Olha a pancadaria! Ninguém quer perder aqui!', 'Isso aqui é a Arena da Live, onde só os fortes sobrevivem!', 'Que golpe! Vocês viram isso?', 'A arquibancada está agitada hoje!',
    'Tá muito disputado! Qualquer um pode virar o jogo!', 'Espadas pra todo lado! Que confusão boa!', 'Quem vai ser o próximo campeão? Ainda dá tempo!', 'Essa live está demais! Chama os amigos pra assistir!', 'Tá vindo gente nova aí! Sejam bem-vindos à arena!',
    'Olha a velocidade desses lutadores!', 'Ninguém está seguro nessa arena!', 'Segura que vem mais luta por aí!', 'Que energia! Continua comentando que a arena fica cada vez melhor!', 'A arena está lotada de guerreiros!',
    'Isso que é batalha de verdade!', 'Ataque, defesa, e muita coragem! Assim que se faz!', 'O clima está quente na arena!', 'Tem lutador apanhando muito aí, hein!', 'Bora, bora! Mais guerreiros na arena!'];
  const LOC_CHAMA = ['Manda um presente e seu personagem fica muito mais forte!', 'Quem mandar presente agora fica mais forte na hora!', 'Manda um presente e veja seu lutador ficar gigante com a corrente de luz!', 'Uma rosinha já te dá uma espada nova! Bora!',
    'Quer ver seu nome no topo do ranking? Derruba o monstro!', 'Chama o seu amigo pro duelo! Escreve duelo e o nome dele!', 'Time vermelho ou time azul? Comenta aí e escolhe seu lado!', 'Segue a live que seu lutador volta com a vida cheia!',
    'Curtiu? Toca na tela! Muita curtida vira chuva de corações!', 'Compartilha a live! Quanto mais gente, mais louca fica a arena!', 'O monstro da arena está esperando alguém corajoso!', 'Cada presente conta pra meta! Falta pouco pra chuva de itens!'];
  const LOC = { saco: {}, lider: null, m50: false, m20: false, ult60: false, ult10: false, pBlood: false, rd: 0, vazio: 0 };
  function locPega(nome, lista) { let b = LOC.saco[nome]; if (!b || !b.length) { b = LOC.saco[nome] = lista.map((_, i) => i).sort(() => Math.random() - 0.5); } return lista[b.pop()]; }
  function locDinamico() { const ls = Object.values(ARENA.lut), vivos = ls.filter(L => !L.morto), top = ls.slice().sort((p, q) => q.kills - p.kills)[0], ops = [];
    if (top && top.kills > 0) ops.push(top.nome + ' lidera a rodada com ' + top.kills + ' pontos! Quem vai parar esse guerreiro?', 'De olho no ' + top.nome + '! Está no topo do ranking!');
    if (ls.length) ops.push('Temos ' + ls.length + ' lutadores na arena agora!');
    const pl = Object.keys(ARENA.plat).length; if (pl > 0) ops.push(pl + ' pessoas na arquibancada torcendo!');
    if (RD.t < 280 && ls.length >= 2) ops.push('Faltam ' + Math.ceil(RD.t / 60) + ' minutos pro fim da rodada ' + RD.n + '!');
    if (TIM.r || TIM.b) ops.push(TIM.r === TIM.b ? 'Os times estão empatados, ' + TIM.r + ' a ' + TIM.b + '!' : 'Time ' + (TIM.r > TIM.b ? 'vermelho' : 'azul') + ' na frente, ' + Math.max(TIM.r, TIM.b) + ' a ' + Math.min(TIM.r, TIM.b) + '!');
    if (BO.vivo) ops.push(BO.M.nome.split(',')[0] + ' ainda tem ' + Math.round(BO.hp / BO.max * 100) + ' por cento da vida! Ataquem!');
    const forte = ls.slice().sort((p, q) => Object.keys(q.itens).length - Object.keys(p.itens).length)[0]; if (forte && Object.keys(forte.itens).length >= 2) ops.push(forte.nome + ' está todo equipado com ' + Object.keys(forte.itens).length + ' itens! Cuidado com ele!');
    const nv = ls.slice().sort((p, q) => (q.up || 0) - (p.up || 0))[0]; if (nv && nv.up >= 2) ops.push(nv.nome + ' já está no nível ' + (1 + nv.up) + '! Ficou enorme!');
    if (RD.camp) ops.push('O campeão da última rodada foi ' + RD.camp.nome + '! Será que ele defende a coroa?');
    if (DU.on && DU.a && DU.b) ops.push('O duelo entre ' + DU.a.nome + ' e ' + DU.b.nome + ' está pegando fogo!');
    const fraco = vivos.filter(L => L.hp < L.max * 0.25)[0]; if (fraco) ops.push(fraco.nome + ' está quase sem vida! Alguém salva ele!');
    return ops.length ? ops[Math.floor(Math.random() * ops.length)] : null; }
  function arenaLocutor() { if (VOZ.tocando || VOZ.fila.length) { NR.t = 6; return; } LOC.vez = ((LOC.vez || 0) + 1) % 5; const ls = Object.keys(ARENA.lut).length;
    let f = null; if (LOC.vez % 2 === 0 && (LOC.exp = (LOC.exp || 0) + 1) % 2) { arenaExplica(locPega('exp', Object.keys(EXPLICA))); return; } if (LOC.vez === 0) f = locPega('narra', NARRA); else if (LOC.vez === 2 || !ls) f = locPega('chama', LOC_CHAMA); else if (LOC.vez === 4) f = locPega('hype', LOC_HYPE); else f = locDinamico() || locPega('hype', LOC_HYPE);
    if (f) arenaFala(f); }
  function arenaLocAbate(L, A) { L.seq = (L.seq || 0) + 1; const vinga = A.matouMe === L.id; A.ultSeq = A.seq || 0; A.seq = 0; A.matouMe = L.id;
    let f = null; if (!LOC.pBlood) { LOC.pBlood = true; f = 'Primeiro sangue da rodada! ' + L.nome + ' derrubou ' + A.nome + '!'; }
    else if (vinga) f = 'Vingança! ' + L.nome + ' devolveu pra cima do ' + A.nome + '!';
    else if (L.seq === 3) f = L.nome + ' está pegando fogo! Três abates seguidos!';
    else if (L.seq === 5) f = 'Imparável! ' + L.nome + ' com cinco abates sem morrer!';
    else if (L.seq === 8 || L.seq === 12) f = 'Ninguém segura o ' + L.nome + '! ' + L.seq + ' abates seguidos! É um monstro!';
    else if ((A.ultSeq || 0) >= 4) f = 'Acabou a sequência do ' + A.nome + '! ' + L.nome + ' parou ele!';
    else if (Math.random() < 0.25) f = locPega('abate', [L.nome + ' derrubou ' + A.nome + '!', 'Que golpe do ' + L.nome + '!', A.nome + ' foi pro chão! Ponto pro ' + L.nome + '!', L.nome + ' não perdoou o ' + A.nome + '!', 'Mais um pro ' + L.nome + '!']);
    A.ultSeq = 0; if (f) arenaFala(f, L.seq >= 3 || vinga); }
  // narrador conta em detalhe quem subiu no ranking (passou quem, quantos pontos, quanto falta)
  const ORD = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto', 'sétimo', 'oitavo', 'nono', 'décimo'];
  function arenaRankFala(ls) { const R = ls.filter(L => L.kills > 0).sort((p, q) => q.kills - p.kills).slice(0, 10), ant = LOC.pos || {}, nov = {}; R.forEach((L, i) => nov[L.id] = i);
    let best = null; R.forEach((L, i) => { const a = ant[L.id]; if (a === undefined || i < a) { if (!best || i < best.i) best = { L, i, a }; } }); LOC.pos = nov; if (!best || (LOC.rkFalaT && performance.now() - LOC.rkFalaT < 3500 && best.i > 2)) return; LOC.rkFalaT = performance.now();
    const { L, i, a } = best, pts = L.kills, passou = (a !== undefined ? R.slice(i + 1, a + 1) : R.slice(i + 1, i + 2)).map(x => x.nome).slice(0, 3), tipo = L.esq ? ' Ainda é palhaço, então os pontos vêm devagar!' : '';
    let t; if (i === 0) { const seg = R[1]; t = L.nome + ' assumiu o primeiro lugar do ranking com ' + pts + ' pontos' + (passou.length ? ', passando ' + passou.join(' e ') : '') + '!' + (seg ? ' ' + seg.nome + ' está em segundo, ' + (pts - seg.kills) + ' pontos atrás.' : ' É o único que pontuou até agora!') + ' ' + L.nome + ' já derrubou ' + (L.abates || 0) + ' adversários e morreu ' + L.mortes + ' vezes nessa rodada.'; }
    else { const cima = R[i - 1]; t = L.nome + ' subiu para o ' + ORD[i] + ' lugar no ranking com ' + pts + ' pontos' + (passou.length ? ', passando ' + passou.join(' e ') : '') + '! Faltam ' + (cima.kills - pts + 5) + ' pontos pra alcançar ' + cima.nome + ', que está em ' + ORD[i - 1] + '.'; }
    arenaFala(t + tipo, i <= 2); }
  function arenaLocutorEventos(dt) { const ls = Object.values(ARENA.lut);
    // troca de líder
    LOC.rkT = (LOC.rkT || 0) - dt; if (LOC.rkT <= 0) { LOC.rkT = 1; arenaRankFala(ls); }
    // Titã
    if (BO.vivo) { const p = BO.hp / BO.max; if (p > 0.95) { LOC.m50 = LOC.m20 = false; } if (!LOC.m50 && p < 0.5) { LOC.m50 = true; arenaFala(BO.M.nome.split(',')[0] + ' está na metade da vida! Não para agora!', true); } if (!LOC.m20 && p < 0.2) { LOC.m20 = true; arenaFala(BO.M.nome.split(',')[0] + ' está quase caindo! Quem vai dar o golpe final?', true); } }
    // rodada
    if (LOC.rd !== RD.n) { LOC.rd = RD.n; LOC.ult60 = LOC.ult10 = LOC.pBlood = false; LOC.lider = null; ls.forEach(L => { L.seq = 0; }); }
    if (ls.length >= 2) { if (!LOC.ult60 && RD.t < 60) { LOC.ult60 = true; arenaFala('Último minuto da rodada! Tudo pode mudar!', true); } if (!LOC.ult10 && RD.t < 10) { LOC.ult10 = true; arenaFala('Dez segundos! Dez segundos pro fim da rodada!', true); } }
    // arena vazia há muito tempo
    if (!ls.length) { LOC.vazio += dt; if (LOC.vazio > 40) { LOC.vazio = 0; arenaFala(locPega('vazia', ['A arena está esperando! Quem vai ser o primeiro a brilhar?', 'Quem vai ter coragem de enfrentar o monstro?', 'Bora galera! Entra na live que você já cai direto na arena!'])); } } else LOC.vazio = 0; }
  function arenaShowFrame(dt) { if (zona !== 'arena') { showEl.hidden = true; return; }
    const ls = Object.values(ARENA.lut);
    if (ls.length >= 2) { RD.t -= dt; if (RD.t <= 0) arenaRodadaFim(); }
    if (DU.on) { DU.t -= dt; const a = DU.a, b = DU.b; if (!a || !b || !ARENA.lut[a.id] || !ARENA.lut[b.id]) arenaDueloFim(null); else if (DU.t <= 0) arenaDueloFim(null); else { duAnel.visible = true; duAnel.position.set((a.x + b.x) / 2, 0.1, (a.z + b.z) / 2); duAnel.scale.setScalar(Math.max(1, Math.hypot(a.x - b.x, a.z - b.z) / 4 + 0.6)); duAnel.material.color.setHSL(0.13 + Math.sin(gT * 4) * 0.03, 1, 0.55); } }
    if (CR.cd > 0) CR.cd -= dt;
    for (let i = CR.sprs.length - 1; i >= 0; i--) { const s = CR.sprs[i]; s.position.y -= s.userData.v * dt; s.position.x += Math.sin(gT * 2 + s.userData.f) * dt * 0.8; if (s.position.y < 0.3) { world.remove(s); CR.sprs.splice(i, 1); } }
    NR.t -= dt; if (NR.t <= 0) { NR.t = 16 + Math.random() * 10; arenaLocutor(); } arenaLocutorEventos(dt);
    const pct = Math.min(100, MT.n / MT.alvo * 100);
    const h = `<div class="mt"><b>🎯 META DE PRESENTES</b><span><i style="width:${pct.toFixed(1)}%"></i></span><small>${MT.n} / ${MT.alvo} · completou = chuva de itens + Monstro Dourado</small></div>`;
    if (showEl._h !== h) { showEl._h = h; showEl.innerHTML = h; } showEl.hidden = false; }
  function arenaTesteShow(a) { const ls = Object.values(ARENA.lut), ps = Object.values(ARENA.plat), rnd = v => v[Math.floor(Math.random() * v.length)];
    if (a === 'duelo') { const x = rnd(ls.length ? ls : ps); if (x) arenaEvento({ type: 'chat', id: x.id, name: x.nome, text: 'duelo' }); }
    else if (a === 'time') { const x = rnd(ls.concat(ps)); if (x) arenaEvento({ type: 'chat', id: x.id, name: x.nome, text: Math.random() < 0.5 ? 'vermelho' : 'azul' }); }
    else if (a === 'like') { const x = rnd(ls.concat(ps)); arenaEvento({ type: 'like', id: x ? x.id : 'like', name: x ? x.nome : 'Fã', count: 15 }); }
    else if (a === 'meta') { MT.n = MT.alvo - 1; const x = rnd(ls.concat(ps)); if (x) arenaEvento({ type: 'gift', id: x.id, name: x.nome, gift: 'Rosa', diamonds: 1 }); } }
  /* ===================== APODERES DOS ARTEFATOS DIVINOS (funcionam de verdade na arena) ===================== */
  const APROJ = [], APGEO = { orbe: new T3.SphereGeometry(0.45, 14, 10), onda: new T3.RingGeometry(1.2, 1.9, 24, 1, -0.9, 1.8), cone: new T3.ConeGeometry(0.45, 2.4, 6), pilar: new T3.CylinderGeometry(1.6, 1.6, 26, 18, 1, true), anel: new T3.RingGeometry(2.2, 2.6, 40) };
  const apMat = (c, o) => new T3.MeshBasicMaterial({ color: c, transparent: true, opacity: o == null ? 0.9 : o, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false, side: T3.DoubleSide });
  const APODERES = {
    emblema: [{ k: 'sol', nome: '☀️ Sol Ígneo', cd: 6, alc: 11, fn: arenaSolIgneo }],
    astrolabio: [{ k: 'corte', nome: '❄️ Corte Glacial', cd: 5, alc: 7, fn: arenaCorteGlacial }, { k: 'pilares', nome: '🧊 Pilares Gélidos', cd: 8, alc: 10, fn: arenaPilaresGelidos }, { k: 'juizo', nome: '💠 Juízo Congelado', cd: 15, alc: 12, fn: arenaJuizoCongelado }],
    manto: [{ k: 'asas', nome: '🦇 Asas do Abismo', cd: 7, alc: 9, fn: arenaAsasAbismo }, { k: 'aura', nome: '👻 Fogo Espectral', cd: 0, alc: 2.8, aura: true }] };
  function arenaInimigos(L, r, x, z) { x = x == null ? L.x : x; z = z == null ? L.z : z; const v = Object.values(ARENA.lut).filter(o => o !== L && !o.morto && !arenaAmigo(L, o) && Math.hypot(o.x - x, o.z - z) < r); if (BO.vivo && Math.hypot(BO.x - x, BO.z - z) < r + BO.r) v.push(BO); return v; }
  function arenaFere(L, A, dano, cor) { if (A.boss) { if (!BO.vivo) return; dano = Math.round(dano * L.dano); BO.hp -= dano; L.danoBoss = (L.danoBoss || 0) + dano; try { numero(BO.pos, String(dano), cor, 0); } catch (e) {} if (BO.hp <= 0) arenaBossMorre(L); return; }
    if (A.morto) return; dano = Math.round(dano * L.dano); A.hp -= dano; try { numero(A.c.position, String(dano), cor, 2.2); } catch (e) {}
    if (A.hp <= 0) { A.hp = 0; A.morto = 3; A.mortes++; L.abates = (L.abates || 0) + 1; arenaPts(L, A.esq ? 40 : 100); if (L.alvo === A) L.alvo = null; arenaAbate(L, A); arenaFeed('✨ <b>' + L.nome + '</b> derrotou <b>' + A.nome + '</b> com poder divino!'); } }
  function arenaGrita(L, P) { try { numero(L.c.position, P.nome, '#ffe08a', 3.4); } catch (e) {} if (Math.random() < 0.3) arenaFala(locPega('pod_' + P.k, [L.nome + ' usou ' + P.nome.replace(/^\S+\s/, '') + '!', 'Olha o ' + P.nome.replace(/^\S+\s/, '') + ' do ' + L.nome + '!', 'Poder divino! ' + P.nome.replace(/^\S+\s/, '') + '!'])); }
  function arenaSolIgneo(L, A) { const m = new T3.Mesh(APGEO.orbe, apMat('#ffb030', 1)); const g = grp(world, L.x, 2.6, L.z); g.add(m); glowSpr(g, 0, 0, 0, 3.2, '#ff7a1a', 0.9);
    APROJ.push({ g, alvo: A, v: 13, t: 0, max: 3, hit(x, z) { fx('fogo', [x, 0.8, z], 1); fx('chama', [x, 0.5, z], 0.6); try { som('fogo', 0.5, 1); } catch (e) {} arenaInimigos(L, 3.4, x, z).forEach(o => { arenaFere(L, o, 30, '#ff8a2a'); if (!o.boss) o.queima = 3; }); } }); }
  function arenaCorteGlacial(L, A) { const m = new T3.Mesh(APGEO.onda, apMat('#8af0ff', 0.95)); m.rotation.x = -Math.PI / 2; const g = grp(world, L.x, 1, L.z); g.add(m); const ang = Math.atan2(A.x - L.x, A.z - L.z); g.rotation.y = ang;
    const dx = Math.sin(ang), dz = Math.cos(ang), ja = new Set(); fx('gelo', [L.x, 1, L.z], 0.5);
    APROJ.push({ g, t: 0, max: 0.75, fixo: true, passo(dt, P) { g.position.x += dx * 13 * dt; g.position.z += dz * 13 * dt; m.scale.setScalar(1 + P.t * 1.4); m.material.opacity = 0.95 * (1 - P.t / P.max);
      arenaInimigos(L, 1.8, g.position.x, g.position.z).forEach(o => { if (ja.has(o)) return; ja.add(o); arenaFere(L, o, 24, '#8af0ff'); if (!o.boss) o.lento = 2.5; fx('gelo', [o.x, 1, o.z], 0.4); }); } }); }
  function arenaPilaresGelidos(L, A) { const x0 = A.x, z0 = A.z, g = grp(world, x0, 0, z0), cs = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, r = i ? 1.3 : 0; const c = new T3.Mesh(APGEO.cone, new T3.MeshStandardMaterial({ color: '#bfefff', emissive: '#3ab8ff', emissiveIntensity: 0.6, transparent: true, opacity: 0.9, roughness: 0.2 })); c.position.set(Math.sin(a) * r, -1.3, Math.cos(a) * r); c.rotation.z = (Math.random() - 0.5) * 0.4; g.add(c); cs.push(c); }
    let bateu = false; APROJ.push({ g, t: 0, max: 2.2, fixo: true, passo(dt, P) { const u = Math.min(1, P.t / 0.25); cs.forEach((c, i) => { c.position.y = -1.3 + u * (2.2 + (i ? 0 : 0.6)) - (P.t > 1.7 ? (P.t - 1.7) * 6 : 0); });
      if (!bateu && P.t > 0.2) { bateu = true; fx('gelo', [x0, 0.6, z0], 1); try { som('gelo', 0.5, 1); } catch (e) {} arenaInimigos(L, 2.4, x0, z0).forEach(o => { arenaFere(L, o, 28, '#bff2ff'); if (!o.boss) o.congela = 1.6; }); } },
      fim() { cs.forEach(c => c.material.dispose()); } }); }
  function arenaJuizoCongelado(L, A) { const x0 = A.x, z0 = A.z, g = grp(world, x0, 0, z0); const col = new T3.Mesh(APGEO.pilar, apMat('#9ae8ff', 0)); col.position.y = 13; g.add(col); const an = new T3.Mesh(APGEO.anel, apMat('#9ae8ff', 0.9)); an.rotation.x = -Math.PI / 2; an.position.y = 0.08; g.add(an);
    let bateu = false; APROJ.push({ g, t: 0, max: 2.4, fixo: true, passo(dt, P) { an.scale.setScalar(Math.max(0.2, 1.2 - P.t * 0.6)); an.rotation.z += dt * 3;
      if (P.t > 0.8 && !bateu) { bateu = true; fx('gelo', [x0, 1, z0], 1.5); fx('luz', [x0, 0, z0], 1); tremor = Math.max(tremor, 0.2); try { som('gelo', 0.8, 0.7); } catch (e) {} arenaInimigos(L, 4.2, x0, z0).forEach(o => { arenaFere(L, o, 45, '#9ae8ff'); if (!o.boss) o.congela = 2.2; }); }
      col.material.opacity = P.t < 0.8 ? 0 : Math.max(0, 0.85 - (P.t - 0.8) * 0.6); col.scale.set(1 + (P.t - 0.8) * 0.3, 1, 1 + (P.t - 0.8) * 0.3); } }); }
  function arenaAsasAbismo(L, A) { const ang = Math.atan2(A.x - L.x, A.z - L.z), d = Math.max(0, Math.hypot(A.x - L.x, A.z - L.z) - 1.2), x0 = L.x, z0 = L.z; L.dash = { t: 0, max: 0.35, x0, z0, x1: x0 + Math.sin(ang) * d, z1: z0 + Math.cos(ang) * d, alvo: A };
    for (let i = 0; i < 5; i++) setTimeout(() => fx('fumo', [L.x, 1, L.z], 0.5), i * 70); try { som('vento', 0.5, 0.8); } catch (e) {} }
  function arenaEstado(L, dt) { if (L.queima > 0) { L.queima -= dt; L.hp -= 5 * dt; if (Math.random() < dt * 3) fx('chama', [L.x, 1, L.z], 0.3); if (L.hp <= 0 && !L.morto) { L.hp = 1; } }
    if (L.lento > 0) L.lento -= dt;
    if (L.dash) { const D = L.dash; D.t += dt; const u = Math.min(1, D.t / D.max); L.x = D.x0 + (D.x1 - D.x0) * u; L.z = D.z0 + (D.z1 - D.z0) * u; L.c.position.set(L.x, 0.4 * Math.sin(u * Math.PI), L.z); pose(L.c, gT, { run: true, lean: 0.6, arms: { shL: [0.6, 0, -1.2], shR: [0.6, 0, 1.2] } });
      if (u >= 1) { L.dash = null; const A = D.alvo; fx('fumo', [L.x, 1, L.z], 0.8); if (A && (A.boss ? BO.vivo : !A.morto)) { arenaFere(L, A, 26, '#c88aff'); L.hp = Math.min(L.max, L.hp + 18); } } return true; }
    if (L.congela > 0) { L.congela -= dt; L.c.position.set(L.x, 0, L.z); if (!L.gelo) { L.gelo = new T3.Mesh(new T3.BoxGeometry(1.1, 2.1, 1.1), new T3.MeshStandardMaterial({ color: '#bfefff', emissive: '#3ab8ff', emissiveIntensity: 0.4, transparent: true, opacity: 0.55, roughness: 0.1 })); L.gelo.position.y = 1; L.c.add(L.gelo); } return true; }
    if (L.gelo) { L.c.remove(L.gelo); L.gelo.geometry.dispose(); L.gelo.material.dispose(); L.gelo = null; fx('gelo', [L.x, 1, L.z], 0.4); }
    return false; }
  function arenaPoderes(dt, vivos) { vivos.forEach(L => { if (L.morto || L.dash || L.congela > 0) return; const divs = Object.values(L.itens).filter(P => P.div); if (!divs.length) return; L.cds = L.cds || {};
      divs.forEach(P => (APODERES[P.div] || []).forEach(H => { if (H.aura) { L.auraT = (L.auraT || 0) - dt; const ini = arenaInimigos(L, H.alc); if (ini.length && L.auraT <= 0) { L.auraT = 0.5; ini.forEach(o => arenaFere(L, o, 4, '#c88aff')); fx('fumo', [L.x, 0.6, L.z], 0.4); } return; }
        L.cds[H.k] = (L.cds[H.k] == null ? Math.random() * H.cd : L.cds[H.k]) - dt; if (L.cds[H.k] > 0) return;
        const A = (L.alvo && (L.alvo.boss ? BO.vivo : !L.alvo.morto) && Math.hypot(L.alvo.x - L.x, L.alvo.z - L.z) < H.alc + (L.alvo.boss ? BO.r : 0)) ? L.alvo : arenaInimigos(L, H.alc)[0]; if (!A) return;
        L.cds[H.k] = H.cd * (0.85 + Math.random() * 0.3); L.atkT = gT; H.fn(L, A); arenaGrita(L, H); })); });
    for (let i = APROJ.length - 1; i >= 0; i--) { const P = APROJ[i]; P.t += dt; if (P.passo) P.passo(dt, P);
      if (!P.fixo) { const A = P.alvo, ok = A && (A.boss ? BO.vivo : !A.morto); const tx = ok ? A.x : P.tx, tz = ok ? A.z : P.tz, ty = A && A.boss ? 4 : 1.2; P.tx = tx; P.tz = tz; const dx = tx - P.g.position.x, dy = ty - P.g.position.y, dz = tz - P.g.position.z, d = Math.hypot(dx, dy, dz);
        if (d < 0.8 || P.t > P.max) { P.hit(P.g.position.x, P.g.position.z); P.t = 99; } else { const k = Math.min(1, P.v * dt / d); P.g.position.x += dx * k; P.g.position.y += dy * k; P.g.position.z += dz * k; P.g.rotation.y += dt * 6; } }
      if (P.t > P.max) { world.remove(P.g); P.g.traverse(o => { if (o.material && o.material !== corMat && o.isMesh) o.material.dispose(); }); if (P.fim) P.fim(); APROJ.splice(i, 1); } } }
  // ----- luta automática -----
  function arenaFrame(dt) { const on = zona === 'arena'; ARG.G.visible = on; arenaUi(); if (!on) { Object.values(ARENA.lut).concat(Object.values(ARENA.plat)).forEach(L => { L.c.visible = false; L.tag.hidden = true; }); return; }
    Object.values(ARENA.plat).forEach(S => { S.c.visible = true; const u = Math.sin(gT * 3 + S.ph), vibra = u > 0.55; pose(S.c, gT, { mood: 'happy', arms: vibra ? { shL: [-2.7, 0, -0.3], shR: [-2.7, 0, 0.3], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] } : { shL: [-0.2, 0, -0.1], shR: [-0.2, 0, 0.1] } }); S.c.position.y = S.y + (vibra ? Math.abs(Math.sin(gT * 9 + S.ph)) * 0.18 : 0); });
    if (ARG.up) ARG.up(gT); arenaElosFrame(dt); try { arenaShowFrame(dt); } catch (e) { console.warn('show', e); } ARG.tochas.forEach((f, i) => { const s = 0.85 + Math.sin(gT * 13 + i * 2) * 0.15; f.scale.set(s, 0.9 + Math.cos(gT * 17 + i) * 0.2, s); });
    const Ls = Object.values(ARENA.lut), vivos = Ls.filter(L => !L.morto); arenaBossFrame(dt, vivos); arenaCtaFrame(dt); try { arenaPoderes(dt, vivos); } catch (e) { console.warn('poder', e); }
    Ls.forEach(L => { L.c.visible = true; if (L.div) L.div.up(gT); { const esc = 0.9 * (1 + Math.min(0.3, (L.up || 0) * 0.05) + (L.pulso || 0) * 0.25); L.c.scale.setScalar(esc); if (L.pulso) L.pulso = Math.max(0, L.pulso - dt * 1.5); } if (L.regen && !L.morto) L.hp = Math.min(L.max, L.hp + L.regen * dt);
      if (L.morto) { L.morto -= dt; pose(L.c, gT, { mood: 'sad', lean: 1.2, hipY: 0.35, legs: { thL: -1.4, knL: 1.6, thR: -1.4, knR: 1.6 } }); L.c.position.y = -0.2;
        if (L.morto <= 0) { L.morto = 0; L.hp = L.max; const a = Math.random() * Math.PI * 2, r = ARENA.R * 0.85; L.x = ARENA.X + Math.sin(a) * r; L.z = ARENA.Z + Math.cos(a) * r; L.c.position.y = 0; fx('luz', [L.x, 0, L.z], 0.8); } L.c.position.x = L.x; L.c.position.z = L.z; return; }
      if (arenaEstado(L, dt)) return;
      // escolhe alvo: o mais perto, às vezes troca
      if (DU.on && (L === DU.a || L === DU.b)) L.alvo = L === DU.a ? DU.b : DU.a; else if (BO.vivo) L.alvo = BO; else if (!L.alvo || L.alvo.boss || L.alvo.morto || !ARENA.lut[L.alvo.id] || arenaAmigo(L, L.alvo) || Math.random() < dt * 0.15) { let best = null, bd = 1e9; vivos.forEach(o => { if (o === L || arenaAmigo(L, o)) return; const d = Math.hypot(o.x - L.x, o.z - L.z) + Math.random() * 6; if (d < bd) { bd = d; best = o; } }); L.alvo = best; }
      const A = L.alvo; let anda = false, atk = gT - L.atkT < 0.35;
      if (A) { const dx = A.x - L.x, dz = A.z - L.z, d = Math.hypot(dx, dz); let dr = Math.atan2(dx, dz) - L.rot; while (dr > Math.PI) dr -= Math.PI * 2; while (dr < -Math.PI) dr += Math.PI * 2; L.rot += dr * clamp(dt * 8);
        if (d > (A.boss ? A.r + 0.9 : 1.5)) { const v = 3.2 * L.vel * (L.lento > 0 ? 0.45 : 1) * dt; L.x += dx / d * v; L.z += dz / d * v; anda = true; }
        else { L.cd -= dt; if (L.cd <= 0) { L.cd = 0.8 + Math.random() * 0.6; L.atkT = gT; const dano = Math.round((7 + Math.random() * 7) * L.dano); A.hp -= dano; if (A.boss) { L.danoBoss = (L.danoBoss || 0) + dano; A.ult = L; } try { numero(A.boss ? A.pos : A.c.position, String(dano), L.dano > 1.2 ? '#ffd86a' : '#ffffff', A.boss ? 0 : 2.2); } catch (e) {} try { som('espada', 0.25, 1); } catch (e) {} fx('vento', [A.boss ? L.x + (A.x - L.x) * 0.4 : A.x, 1, A.boss ? L.z + (A.z - L.z) * 0.4 : A.z], 0.3);
            if (A.boss) { if (A.hp <= 0) arenaBossMorre(L); } else if (A.hp <= 0) { A.hp = 0; A.morto = 3; A.mortes++; L.abates = (L.abates || 0) + 1; arenaPts(L, A.esq ? 40 : 100); L.alvo = null; arenaAbate(L, A); arenaFeed('⚔️ <b>' + L.nome + '</b> derrotou <b>' + A.nome + '</b>' + (L.kills % 5 === 0 ? ' · 🔥 ' + L.kills + ' abates!' : '')); } } } }
      // não sai da areia e não fica um em cima do outro
      if (BO.vivo) { const dx = L.x - BO.x, dz = L.z - BO.z, d = Math.hypot(dx, dz), m = BO.r + 0.5; if (d < m && d > 1e-3) { L.x = BO.x + dx / d * m; L.z = BO.z + dz / d * m; } }
      vivos.forEach(o => { if (o === L) return; const dx = L.x - o.x, dz = L.z - o.z, d = Math.hypot(dx, dz); if (d < 0.8 && d > 1e-3) { L.x += dx / d * (0.8 - d) * 0.5; L.z += dz / d * (0.8 - d) * 0.5; } });
      { const dx = L.x - ARENA.X, dz = L.z - ARENA.Z, d = Math.hypot(dx, dz), m = ARENA.R - 1.2; if (d > m) { L.x = ARENA.X + dx / d * m; L.z = ARENA.Z + dz / d * m; } }
      L.c.position.set(L.x, 0, L.z); L.c.rotation.y = L.rot;
      if (atk) { const u = (gT - L.atkT) / 0.35; pose(L.c, gT, { mood: 'angry', arms: { shR: [-2.4 + u * 2.6, 0, 0.3], elR: [-0.4, 0, 0], shL: [-0.4, 0, -0.2] }, lean: 0.15 }); }
      else pose(L.c, gT, anda ? { run: true, mood: 'angry' } : { mood: 'neutral' }); }); }
  // ----- painel: ranking ao lado, mural de lutas, botões do ADM -----
  const arUi = document.createElement('div'); arUi.id = 'arena-ui'; arUi.hidden = true; document.body.appendChild(arUi);
  function arenaUi() { const on = zona === 'arena'; arUi.hidden = !on; if (!on) return; arUi.classList.toggle('mural', ARENA.cam.modo === 'mural'); ARENA.uiT -= 1 / 60; if (ARENA.uiT > 0) return; ARENA.uiT = 0.5;
    const L = Object.values(ARENA.lut).sort((p, q) => q.kills - p.kills || p.mortes - q.mortes).slice(0, 5), med = ['👑', '🥈', '🥉'];
    arUi.innerHTML = `<div class="ar-rk"><b class="tt">🏆 RODADA ${RD.n} · ⏱ ${arenaRelogio()}</b>${RD.camp ? `<div class="ar-camp">👑 Campeão: <b>${RD.camp.nome}</b></div>` : ''}${arenaPlacarTimes()}${L.length ? L.map((x, i) => `<div class="ln${i < 3 ? ' t' + (i + 1) : ''}"><span>${med[i] || (i + 1) + 'º'}</span>${arenaFoto(x, 'mi')}<em>${x.time ? (x.time === 'r' ? '🔴' : '🔵') : ''}${Object.values(x.itens).map(P => P.ic).join('')}${x.esq ? '🤡 ' : ''}${x.nome}</em><i>⭐ ${arenaFmt(x.kills)}</i></div>`).join('') : '<p>Ninguém lutando ainda. Comente LUTAR pra entrar! ⚔️</p>'}
      <small class="dc">👀 ${Object.keys(ARENA.plat).length} na arquibancada · 💬 comente LUTAR</small></div>
      <div class="ar-feed">${ARENA.feed.filter(f => performance.now() - f.em < 9000).map(f => `<div>${f.t}</div>`).join('')}</div>
      <div class="ar-bt"><button data-a="bot">➕ Espectador de teste</button><button data-a="lutar">💬 LUTAR de teste</button><button data-a="pres">🎁 Presente de teste</button><button data-a="duelo">⚔️ Duelo teste</button><button data-a="monstro">👹 Próximo monstro</button><button data-a="time">🔴🔵 Time teste</button><button data-a="like">👍 Curtidas teste</button><button data-a="meta">🎯 Meta teste</button><button data-a="tema">🎨 ${ARENA_TEMAS[ARENA_TEMA].nome}</button><button data-a="voz">${VOZ.on ? '🔊 Voz ligada' : '🔇 Voz desligada'}</button><button data-a="sai">🚪 Sair</button></div>`;
    arUi.querySelectorAll('[data-a]').forEach(b => tapBtn(b, () => { const a = b.dataset.a;
      if (a === 'monstro') { const M = MONSTROS[(BO.idx + 1) % MONSTROS.length]; window.__arenaMonstro(M.id); } else if (a === 'duelo' || a === 'time' || a === 'like' || a === 'meta') arenaTesteShow(a); else if (a === 'tema') { arenaMonta((ARENA_TEMA + 1) % ARENA_TEMAS.length); try { localStorage.setItem('arenaTema2', String(ARENA_TEMA)); } catch (e) {} } else if (a === 'voz') { VOZ.on = !VOZ.on; VOZ.fila = []; try { localStorage.setItem('arenaVoz', VOZ.on ? '1' : '0'); } catch (e) {} if (VOZ.on) arenaFala('Voz da arena ligada!', true); } else if (a === 'sai') arenaSai(); else if (a === 'lutar') { const Ps = Object.values(ARENA.plat); const S = Ps[Math.floor(Math.random() * Ps.length)]; if (S) arenaEvento({ type: 'chat', id: S.id, name: S.nome, text: 'bora LUTAR!' }); } else if (a === 'bot') { const id = 'teste' + Math.random().toString(36).slice(2, 7); arenaEvento({ type: 'join', id, name: 'Teste ' + id.slice(-3).toUpperCase() }); }
      else { const Ps = Object.values(ARENA.plat), Ls = Ps.length ? Ps : Object.values(ARENA.lut); if (!Ls.length) return; const L = Ls[Math.floor(Math.random() * Ls.length)]; const G = ARENA_PRES[Math.floor(Math.random() * ARENA_PRES.length)]; arenaEvento({ type: 'gift', id: L.id, name: L.nome, gift: G.nomes[0], diamonds: G.nv >= 4 ? 500 : G.nv === 3 ? 100 : G.nv === 2 ? 10 : 1 }); } ARENA.uiT = 0; })); }
  // ----- entrar / sair (só ADM) -----
  function arenaEntra() { if (!souAdmin()) { aviso('🔒 A Arena da Live é só do Administrador.', '#ff6a6a'); return; } if (zona === 'arena') return; if (montado) montar(false); if (voando) voa(false);
    ARENA.volta = { zona, x: heroi.position.x, z: heroi.position.z, dentro }; ARENA.on = true; zona = 'arena'; dentro = false; heroi.position.set(ARENA.X, 0, ARENA.Z); heroi.visible = false;
    ARENA.cam.modo = 'sobe'; ARENA.cam.t = 2.6; ARENA.cam.a = Math.PI; cam.position.set(ARENA.X, 6, ARENA.Z - ARENA.R - 6); ARENA.cam.pos = cam.position.clone(); ARENA.cam.look.set(ARENA.X, 1, ARENA.Z); document.body.classList.add('arena-on'); arenaRetrato(true); NR.t = 14; setTimeout(() => arenaFala(NARRA[0], true), 2500);
    aviso('🏟️ Arena da Live aberta! Quem entrar na live vai aparecer lutando.' + (LIVE.ws ? '' : ' (Ligue a live no 📡 ou use o Lutador de teste.)'), '#ffd86a'); }
  function arenaSai() { if (zona !== 'arena' || arenaTravada()) return; const V = ARENA.volta || { zona: 'vila', x: 0, z: 4.2 }; ARENA.on = false; zona = V.zona === 'arena' ? 'vila' : V.zona; dentro = !!V.dentro; heroi.position.set(V.x, 0, V.z); heroi.visible = true; document.body.classList.remove('arena-on'); arenaRetrato(false); }
  /* tela sempre acesa enquanto o jogo estiver aberto (no app o Android já faz isso) */
  { let wl = null; const pede = () => { try { if (navigator.wakeLock && document.visibilityState === 'visible' && !wl) navigator.wakeLock.request('screen').then(w => { wl = w; w.addEventListener('release', () => { wl = null; }); }).catch(() => {}); } catch (e) {} };
    document.addEventListener('visibilitychange', pede); document.addEventListener('fullscreenchange', pede); ['click', 'touchstart'].forEach(ev => document.addEventListener(ev, pede, { passive: true })); pede(); }
  /* modo retrato (celular em pé) enquanto estiver na arena, pra live do TikTok */
  function arenaRetrato(on) { try { if (window.AndroidTela) { AndroidTela.retrato(!!on); return; } } catch (e) {} try { if (on) { const el = document.documentElement; const f = document.fullscreenElement ? Promise.resolve() : (el.requestFullscreen ? el.requestFullscreen() : Promise.resolve()); f.then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('portrait')).catch(() => {}); } else if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => { try { screen.orientation.unlock(); } catch (e) {} }); } catch (e) {} }
  /* na arena o celular tem que ficar em pé (TikTok mostra a tela inteira): se virou deitado ou saiu da tela cheia (ex.: depois do PIN do 📡), força em pé de novo */
  { let ult = 0; const reforca = () => { if (zona !== 'arena') return; const agora = performance.now(); if (agora - ult < 800) return; const deitado = innerWidth > innerHeight, semTC = !document.fullscreenElement && !document.webkitFullscreenElement && !window.AndroidTela; if (!deitado && !semTC) return; ult = agora; arenaRetrato(true); };
    ['resize', 'orientationchange'].forEach(ev => addEventListener(ev, () => setTimeout(reforca, 300)));
    ['pointerdown', 'touchend', 'click'].forEach(ev => document.addEventListener(ev, reforca, { capture: true, passive: true })); setInterval(reforca, 3000); }
  function arenaLimita(p) { p.x = ARENA.X; p.z = ARENA.Z; p.y = 0; }
  const arBtn = document.createElement('button'); arBtn.textContent = '🏟️'; arBtn.hidden = true; arBtn.title = 'Arena da Live';
  arBtn.style.cssText = 'position:fixed;left:60px;bottom:8px;z-index:250;width:44px;height:44px;border-radius:50%;border:3px solid #2b2340;background:#ffe08a;font-size:20px;opacity:.95;padding:0'; document.body.appendChild(arBtn);
  arBtn.className = 'arena-keep'; arBtn.onclick = () => { if (zona === 'arena') arenaSai(); else arenaEntra(); };
  let arChk = 0; function arenaTravada() { return zona === 'arena' && LIVE.quer; }
  function arenaLoop(dt) { arChk -= dt; if (arChk <= 0) { arChk = 0.5; const trava = arenaTravada(); arBtn.hidden = !souAdmin() || trava; if (LIVE.btn) LIVE.btn.style.display = trava ? 'none' : ''; document.body.classList.toggle('arena-travada', trava); if (LIVE.btn) LIVE.btn.classList.add('arena-keep'); if (zona === 'arena' && !souAdmin()) arenaSai(); } try { arenaFrame(dt); } catch (e) { console.warn('arena', e); } try { ptFrame(dt); } catch (e) {} }
