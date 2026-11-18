  // ===================== ARENA DA LIVE (só ADM): quem entra na live do TikTok vira lutador, batalha sozinho, sobe no ranking; presente = artefato divino =====================
  const ARENA = { on: false, X: -1400, Z: 0, R: 25, lut: {}, plat: {}, maxPlat: 44, max: 24, feed: [], fila: [], cam: { modo: 'orbita', alvo: null, t: 0, a: 0, look: new T3.Vector3() }, volta: null, uiT: 0 };
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
  /* ----- mural dos presentes: o que cada presente da live dá na arena ----- */
  const MURAL = (() => { const c = document.createElement('canvas'); c.width = 2048; c.height = 1152; const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 1152); gr.addColorStop(0, '#3a0a24'); gr.addColorStop(1, '#14081e'); g.fillStyle = gr; g.fillRect(0, 0, 2048, 1152);
    g.strokeStyle = '#ffcf5a'; g.lineWidth = 18; g.strokeRect(14, 14, 2020, 1124); g.lineWidth = 4; g.strokeRect(40, 40, 1968, 1072);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffd86a'; g.font = 'bold 92px system-ui, sans-serif'; g.fillText('🎁 PRESENTES DA LIVE = PODER NA ARENA', 1024, 120);
    g.fillStyle = '#e8d0ff'; g.font = '500 40px system-ui, sans-serif'; g.fillText('Quem só assiste fica na arquibancada · mande QUALQUER presente e ENTRE NA LUTA! · mais caro = mais forte', 1024, 205, 1900);
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
  function arenaBoneco(id) { const h = mpHash(id), R = MP_ROUPAS[h % MP_ROUPAS.length];
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
  function arenaNovo(id, nome, foto) { const h = mpHash(id);
    const c = arenaBoneco(id);
    // espada simples na mão direita (cor pela pessoa)
    const esp = grp(c.userData.P.elR, 0, -0.34, 0.06); esp.rotation.x = -1.35; const cor = ['#d8dde8', '#ffd86a', '#ff8a6a', '#8ad8ff', '#c89aff'][(h >> 9) % 5];
    const lam = part(esp, BOX, cor, 0, 0.42, 0, 0.07, 0.8, 0.02, 0, true); part(esp, BOX, '#5a3a20', 0, 0, 0, 0.26, 0.05, 0.07); part(esp, CYL, '#3a2414', 0, -0.1, 0, 0.035, 0.18, 0.035);
    const tag = document.createElement('div'); tag.className = 'mp-tag ar-tag'; mpTags.appendChild(tag);
    const a = Math.random() * Math.PI * 2, r = ARENA.R * (0.4 + Math.random() * 0.5);
    const L = { id, nome: arenaEsc(nome) || 'Visitante', foto: foto || '', y: 0, c, tag, x: ARENA.X + Math.sin(a) * r, z: ARENA.Z + Math.cos(a) * r, rot: a + Math.PI, hp: 100, max: 100, kills: 0, mortes: 0, alvo: null, cd: 1 + Math.random(), atkT: -9, morto: 0, lam, div: null, divT: '', itens: {}, dano: 1, vel: 1, regen: 0, escudo: null, aura: null, fala: '', falaT: 0, t: performance.now(), h: '' };
    c.position.set(L.x, 0, L.z); return L; }
  function arenaLut(id, nome, foto) { let L = ARENA.lut[id]; if (L) { L.t = performance.now(); if (nome && L.nome === 'Visitante') L.nome = arenaEsc(nome); if (foto && !L.foto) { L.foto = foto; L.h = ''; } return L; }
    const ks = Object.keys(ARENA.lut); if (ks.length >= ARENA.max) { const fora = ks.map(k => ARENA.lut[k]).sort((p, q) => (p.kills - q.kills) || (p.t - q.t))[0]; arenaTira(fora.id); }
    L = ARENA.lut[id] = arenaNovo(id, nome, foto); fx('luz', [L.x, 0, L.z], 1); try { som('portal', 0.5, 1.2); } catch (e) {} return L; }
  function arenaTira(id) { const L = ARENA.lut[id]; if (!L) return; world.remove(L.c); L.tag.remove(); delete ARENA.lut[id]; }
  function arenaDivVisual(L, tipo) { const k = ARENA_DIV.find(x => x[0] === tipo) || ARENA_DIV[0]; if (L.div) { L.c.userData.P.spine.remove(L.div.g); L.div = null; }
    let o = null; try { const sp = L.c.userData.P.spine;
      if (k[0] === 'emblema') { const e = createFieryCrestItem(T3); const g = new T3.Group(); g.add(e); e.scale.setScalar(0.33); e.rotation.y = Math.PI; g.position.set(0, 0.55, -0.45); sp.add(g); o = { g, up: t => e.userData.update(t) }; }
      else if (k[0] === 'astrolabio') { const a = createArcaneAstrolabe(T3); const g = new T3.Group(); g.add(a); a.scale.setScalar(0.2); a.rotation.y = Math.PI; g.position.set(0, 0.5, -0.62); a.traverse(x => { if (x.isPoints) x.material.size = 0.025; }); sp.add(g); let tl = 0; o = { g, up: t => { const dt = Math.min(0.1, Math.max(0, t - tl)); tl = t; a.userData.update(dt, t); } }; }
      else { const m = createSpectralCloak3D(T3); const g = new T3.Group(); g.add(m.group); m.group.scale.setScalar(0.42); m.group.position.set(0, -0.22, 0); const [arm, asas, capa] = m.group.children; arm.position.z = 0.42; arm.scale.setScalar(0.8); arm.position.y = 1.2; asas.position.z = -0.55; capa.position.z = -0.5; m.group.children[3].position.z = -0.6; sp.add(g); o = { g, up: t => m.update(t, { windSpeed: 1, windAmp: 1, energyIntensity: 0.38 }) }; }
      o.g.traverse(x => { if (x.isMesh) x.frustumCulled = false; }); } catch (e) { console.warn('arena divino', e); o = null; }
    L.div = o; }
  function arenaStats(L) { let dano = 1, vida = 0, vel = 1, regen = 0; Object.values(L.itens).forEach(P => { dano *= P.dano || 1; vida += P.vida || 0; vel = Math.max(vel, P.vel || 1); regen += P.regen || 0; }); L.dano = dano; L.max = 100 + vida; L.vel = vel; L.regen = regen; }
  function arenaPresente(L, nome, dia) { const P = arenaPresenteDe(nome, dia), novo = !L.itens[P.k]; L.itens[P.k] = P;
    if (P.div) { const top = Object.values(L.itens).filter(x => x.div).sort((a, b) => b.nv - a.nv)[0]; if (top === P && L.divT !== P.div) { arenaDivVisual(L, P.div); L.divT = P.div; } }
    if (P.k === 'rosa' && L.lam) { L.lam.material = L.lam.material.clone(); L.lam.material.color.set('#ff7aa8'); if (L.lam.material.emissive) L.lam.material.emissive.set('#ff2a6a'); }
    if (P.k === 'sorvete' && !L.escudo) { L.escudo = part(L.c.userData.P.elL, BOX, '#bfeaff', 0, -0.3, 0.12, 0.42, 0.5, 0.06, 0.04, true); }
    if (!L.aura) { L.aura = glowSpr(L.c, 0, 0.15, 0, 1.6, P.cor, 0.5); } else if (L.aura.material) L.aura.material.color.set(P.cor);
    arenaStats(L); L.hp = L.max; fx('luz', [L.x, 0, L.z], 1.2); fx('cura', [L.x, 0, L.z], 1); try { som('magia', 0.5, 1.1); } catch (e) {}
    if (novo || P.nv >= 2) { arenaFeed('🎁 <b>' + L.nome + '</b> mandou ' + P.ic + ' ' + arenaEsc(nome || 'presente') + ' → <i style="color:' + P.cor + '">' + P.item + '</i> (' + P.fx + ')'); aviso(P.ic + ' ' + L.nome + ' ganhou ' + P.item + '! ' + P.fx, P.cor); arenaFoca(L, P.nv >= 2 ? 4.5 : 3); } }
  function arenaFeed(t) { ARENA.feed.unshift({ t, em: performance.now() }); ARENA.feed.length = Math.min(ARENA.feed.length, 5); ARENA.uiT = 0; }
  // ----- eventos da live -----
  function arenaEvento(m) { const id = String(m.id), foto = arenaFotoUrl(m.foto); let L = ARENA.lut[id];
    if (m.type === 'gift') { const S = ARENA.plat[id]; if (!L) { const nome = (S && S.nome) || m.name; if (S) arenaPlatTira(id); L = arenaLut(id, nome, foto || (S && S.foto)); arenaFeed(arenaFoto(L, 'mi') + ' <b>' + L.nome + '</b> ' + (S ? 'desceu da arquibancada e' : '') + ' entrou na LUTA!'); } else arenaLut(id, m.name, foto); arenaPresente(L, m.gift, m.diamonds); return; }
    if (L) { arenaLut(id, m.name, foto); if (m.type === 'join') { arenaFoca(L, 3); }
      else if (m.type === 'chat' && m.text) { L.fala = arenaEsc(m.text); L.falaT = performance.now() + 5000; }
      else if (m.type === 'like') { L.hp = Math.min(L.max, L.hp + 6); }
      else if (m.type === 'follow') { L.hp = L.max; arenaFeed('❤️ <b>' + L.nome + '</b> seguiu a live!'); } return; }
    const novo = !ARENA.plat[id], S = arenaPlat(id, m.name, foto);
    if (novo) { arenaFeed(arenaFoto(S, 'mi') + ' <b>' + S.nome + '</b> chegou na arquibancada'); arenaFoca(S, 3.2); }
    if (m.type === 'chat' && m.text) { S.fala = arenaEsc(m.text); S.falaT = performance.now() + 5000; }
    else if (m.type === 'follow') arenaFeed('❤️ <b>' + S.nome + '</b> seguiu a live!'); }
  { const _le = liveEvento; liveEvento = function (m) { if (ARENA.on && m && souAdmin()) { try { arenaEvento(m); } catch (e) { console.warn('arena', e); } return; } return _le(m); }; }
  // ----- câmera de transmissão: foca quem entrou, sobe igual drone e fica rodeando -----
  function arenaFoca(L, seg) { const C = ARENA.cam; if (C.modo === 'foco' && C.alvo && performance.now() - C.ini < 2200) { if (!ARENA.fila.includes(L)) ARENA.fila.push(L); ARENA.fila.length = Math.min(ARENA.fila.length, 2); return; } C.modo = 'foco'; C.alvo = L; C.t = seg || 3.5; C.ini = performance.now(); }
  const _cv = new T3.Vector3(), _lv = new T3.Vector3();
  function arenaCam(dt) { if (zona !== 'arena') return; const C = ARENA.cam, k = 1 - Math.exp(-dt * 2.6);
    if (C.modo === 'foco') { const L = C.alvo; if (!L || (ARENA.lut[L.id] !== L && ARENA.plat[L.id] !== L)) { C.modo = 'sobe'; C.t = 2.4; } else { C.t -= dt;
        if (L.plat) { _cv.set(L.x + Math.sin(L.rot) * 3.6, L.y + 1.9, L.z + Math.cos(L.rot) * 3.6); _lv.set(L.x, L.y + 1.2, L.z); } else { _cv.set(L.x - Math.sin(L.rot) * 4.2, 2.3, L.z - Math.cos(L.rot) * 4.2); _lv.set(L.x, 1.3, L.z); } cam.position.lerp(_cv, 1 - Math.exp(-dt * 4)); C.look.lerp(_lv, 1 - Math.exp(-dt * 6));
        if (C.t <= 0) { const prox = ARENA.fila.shift(); if (prox && (ARENA.lut[prox.id] === prox || ARENA.plat[prox.id] === prox)) { C.alvo = prox; C.t = 2.5; C.ini = performance.now(); } else { C.modo = 'sobe'; C.t = 2.6; C.a = Math.atan2(cam.position.x - ARENA.X, cam.position.z - ARENA.Z); } } } }
    else if (C.modo === 'mural') { C.t -= dt; _cv.set(MURAL.x, MURAL.y - 1.5, MURAL.z - 13); _lv.set(MURAL.x, MURAL.y - 0.3, MURAL.z); cam.position.lerp(_cv, 1 - Math.exp(-dt * 2.2)); C.look.lerp(_lv, 1 - Math.exp(-dt * 3)); if (C.t <= 0) { C.modo = 'sobe'; C.t = 2.6; C.ot = 0; C.a = Math.atan2(cam.position.x - ARENA.X, cam.position.z - ARENA.Z); } }
    else { if (C.modo === 'sobe') { C.t -= dt; if (C.t <= 0) { C.modo = 'orbita'; C.ot = 0; } } else { C.ot = (C.ot || 0) + dt; if (C.ot > 12) { C.modo = 'mural'; C.t = 6.5; } } C.a += dt * 0.12; const r = ARENA.R + 9, y = C.modo === 'sobe' ? 12 + (2.6 - C.t) * 5 : 24 + Math.sin(gT * 0.3) * 2;
      _cv.set(ARENA.X + Math.sin(C.a) * r, y, ARENA.Z + Math.cos(C.a) * r); _lv.set(ARENA.X, 0.5, ARENA.Z); cam.position.lerp(_cv, C.modo === 'sobe' ? 1 - Math.exp(-dt * 1.8) : k); C.look.lerp(_lv, 1 - Math.exp(-dt * 2.2)); }
    cam.lookAt(C.look); cam.updateMatrixWorld();
    // nomes e vida em cima de cada lutador (depois da câmera, pra não tremer)
    const agora = performance.now(); Object.values(ARENA.lut).forEach(L => { const d = cam.position.distanceTo(L.c.position); if (L.morto || d > 60) { L.tag.hidden = true; return; } L.tag.hidden = false;
      const falando = L.fala && agora < L.falaT, h = arenaFoto(L) + '<b>' + Object.values(L.itens).map(P => P.ic).join('') + (L.div || L.itens.rosa ? ' ' : '') + L.nome + '</b><span class="ar-hp"><i style="width:' + Math.round(L.hp / L.max * 100) + '%"></i></span><small>⚔️ ' + L.kills + (falando ? ' · 💬 ' + L.fala : '') + '</small>';
      if (L.h !== h) { L.h = h; L.tag.innerHTML = h; } guildPosition(L.tag, L.c, 2.0); L.tag.style.transform = 'translate(-50%,-100%) scale(' + clamp(1.3 - d / 40, 0.55, 1.2).toFixed(2) + ')'; L.tag.style.zIndex = String(200 - Math.round(d)); });
    Object.values(ARENA.plat).forEach(S => { const d = cam.position.distanceTo(S.c.position), falando = S.fala && agora < S.falaT; if (d > (falando ? 70 : 26)) { S.tag.hidden = true; return; } S.tag.hidden = false;
      const h = arenaFoto(S) + '<b>' + S.nome + '</b>' + (falando ? '<small>💬 ' + S.fala + '</small>' : ''); if (S.h !== h) { S.h = h; S.tag.innerHTML = h; } guildPosition(S.tag, S.c, 1.9); S.tag.style.transform = 'translate(-50%,-100%) scale(' + clamp(1.15 - d / 30, 0.45, 1.1).toFixed(2) + ')'; S.tag.style.zIndex = String(150 - Math.round(d)); }); }
  // ----- luta automática -----
  function arenaFrame(dt) { const on = zona === 'arena'; ARG.G.visible = on; arenaUi(); if (!on) { Object.values(ARENA.lut).concat(Object.values(ARENA.plat)).forEach(L => { L.c.visible = false; L.tag.hidden = true; }); return; }
    Object.values(ARENA.plat).forEach(S => { S.c.visible = true; const u = Math.sin(gT * 3 + S.ph), vibra = u > 0.55; pose(S.c, gT, { mood: 'happy', arms: vibra ? { shL: [-2.7, 0, -0.3], shR: [-2.7, 0, 0.3], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] } : { shL: [-0.2, 0, -0.1], shR: [-0.2, 0, 0.1] } }); S.c.position.y = S.y + (vibra ? Math.abs(Math.sin(gT * 9 + S.ph)) * 0.18 : 0); });
    ARG.tochas.forEach((f, i) => { const s = 0.85 + Math.sin(gT * 13 + i * 2) * 0.15; f.scale.set(s, 0.9 + Math.cos(gT * 17 + i) * 0.2, s); });
    const Ls = Object.values(ARENA.lut), vivos = Ls.filter(L => !L.morto);
    Ls.forEach(L => { L.c.visible = true; if (L.div) L.div.up(gT); if (L.regen && !L.morto) L.hp = Math.min(L.max, L.hp + L.regen * dt);
      if (L.morto) { L.morto -= dt; pose(L.c, gT, { mood: 'sad', lean: 1.2, hipY: 0.35, legs: { thL: -1.4, knL: 1.6, thR: -1.4, knR: 1.6 } }); L.c.position.y = -0.2;
        if (L.morto <= 0) { L.morto = 0; L.hp = L.max; const a = Math.random() * Math.PI * 2, r = ARENA.R * 0.85; L.x = ARENA.X + Math.sin(a) * r; L.z = ARENA.Z + Math.cos(a) * r; L.c.position.y = 0; fx('luz', [L.x, 0, L.z], 0.8); } L.c.position.x = L.x; L.c.position.z = L.z; return; }
      // escolhe alvo: o mais perto, às vezes troca
      if (!L.alvo || L.alvo.morto || !ARENA.lut[L.alvo.id] || Math.random() < dt * 0.15) { let best = null, bd = 1e9; vivos.forEach(o => { if (o === L) return; const d = Math.hypot(o.x - L.x, o.z - L.z) + Math.random() * 6; if (d < bd) { bd = d; best = o; } }); L.alvo = best; }
      const A = L.alvo; let anda = false, atk = gT - L.atkT < 0.35;
      if (A) { const dx = A.x - L.x, dz = A.z - L.z, d = Math.hypot(dx, dz); let dr = Math.atan2(dx, dz) - L.rot; while (dr > Math.PI) dr -= Math.PI * 2; while (dr < -Math.PI) dr += Math.PI * 2; L.rot += dr * clamp(dt * 8);
        if (d > 1.5) { const v = 3.2 * L.vel * dt; L.x += dx / d * v; L.z += dz / d * v; anda = true; }
        else { L.cd -= dt; if (L.cd <= 0) { L.cd = 0.8 + Math.random() * 0.6; L.atkT = gT; const dano = Math.round((7 + Math.random() * 7) * L.dano); A.hp -= dano; try { numero(A.c.position, String(dano), L.dano > 1.2 ? '#ffd86a' : '#ffffff', 2.2); } catch (e) {} try { som('espada', 0.25, 1); } catch (e) {} fx('vento', [A.x, 1, A.z], 0.3);
            if (A.hp <= 0) { A.hp = 0; A.morto = 3; A.mortes++; L.kills++; L.alvo = null; arenaFeed('⚔️ <b>' + L.nome + '</b> derrotou <b>' + A.nome + '</b>' + (L.kills % 5 === 0 ? ' · 🔥 ' + L.kills + ' abates!' : '')); } } } }
      // não sai da areia e não fica um em cima do outro
      vivos.forEach(o => { if (o === L) return; const dx = L.x - o.x, dz = L.z - o.z, d = Math.hypot(dx, dz); if (d < 0.8 && d > 1e-3) { L.x += dx / d * (0.8 - d) * 0.5; L.z += dz / d * (0.8 - d) * 0.5; } });
      { const dx = L.x - ARENA.X, dz = L.z - ARENA.Z, d = Math.hypot(dx, dz), m = ARENA.R - 1.2; if (d > m) { L.x = ARENA.X + dx / d * m; L.z = ARENA.Z + dz / d * m; } }
      L.c.position.set(L.x, 0, L.z); L.c.rotation.y = L.rot;
      if (atk) { const u = (gT - L.atkT) / 0.35; pose(L.c, gT, { mood: 'angry', arms: { shR: [-2.4 + u * 2.6, 0, 0.3], elR: [-0.4, 0, 0], shL: [-0.4, 0, -0.2] }, lean: 0.15 }); }
      else pose(L.c, gT, anda ? { run: true, mood: 'angry' } : { mood: 'neutral' }); }); }
  // ----- painel: ranking ao lado, mural de lutas, botões do ADM -----
  const arUi = document.createElement('div'); arUi.id = 'arena-ui'; arUi.hidden = true; document.body.appendChild(arUi);
  function arenaUi() { const on = zona === 'arena'; arUi.hidden = !on; if (!on) return; arUi.classList.toggle('mural', ARENA.cam.modo === 'mural'); ARENA.uiT -= 1 / 60; if (ARENA.uiT > 0) return; ARENA.uiT = 0.5;
    const L = Object.values(ARENA.lut).sort((p, q) => q.kills - p.kills || p.mortes - q.mortes).slice(0, 8), med = ['👑', '🥈', '🥉'];
    arUi.innerHTML = `<div class="ar-rk"><b class="tt">🏆 RANKING DA ARENA</b>${L.length ? L.map((x, i) => `<div class="ln${i < 3 ? ' t' + (i + 1) : ''}"><span>${med[i] || (i + 1) + 'º'}</span>${arenaFoto(x, 'mi')}<em>${Object.values(x.itens).map(P => P.ic).join('')}${x.nome}</em><i>⚔️ ${x.kills}</i></div>`).join('') : '<p>Ninguém lutando ainda. Mande um presente pra entrar na luta! 🎁</p>'}
      <small class="dc">👀 Assistindo = arquibancada (${Object.keys(ARENA.plat).length}) · 🎁 Presente = entra na luta</small></div>
      <div class="ar-feed">${ARENA.feed.filter(f => performance.now() - f.em < 9000).map(f => `<div>${f.t}</div>`).join('')}</div>
      <div class="ar-bt"><button data-a="bot">➕ Espectador de teste</button><button data-a="pres">🎁 Presente de teste</button><button data-a="sai">🚪 Sair</button></div>`;
    arUi.querySelectorAll('[data-a]').forEach(b => tapBtn(b, () => { const a = b.dataset.a;
      if (a === 'sai') arenaSai(); else if (a === 'bot') { const id = 'teste' + Math.random().toString(36).slice(2, 7); arenaEvento({ type: 'join', id, name: 'Teste ' + id.slice(-3).toUpperCase() }); }
      else { const Ps = Object.values(ARENA.plat), Ls = Ps.length ? Ps : Object.values(ARENA.lut); if (!Ls.length) return; const L = Ls[Math.floor(Math.random() * Ls.length)]; const G = ARENA_PRES[Math.floor(Math.random() * ARENA_PRES.length)]; arenaEvento({ type: 'gift', id: L.id, name: L.nome, gift: G.nomes[0], diamonds: G.nv >= 4 ? 500 : G.nv === 3 ? 100 : G.nv === 2 ? 10 : 1 }); } ARENA.uiT = 0; })); }
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
