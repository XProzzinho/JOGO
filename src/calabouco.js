  // ===================== CALABOUÇOS (DGs), TORRE DOS MONSTROS, CHEFE DE MUNDO, RAROS, MURAL DE MISSÕES (GRAUS) E MESTRE DAS BATALHAS =====================
  // Tipos de inimigo: trash (fraco, em bando), agro (agressivo), elite (mais forte e brilhando), minion (lacaio invocado pelo chefe),
  // raro (nomeado, aparece às vezes), mini (subchefe), boss (chefe da DG), super (chefe secreto). Tudo escala com o nível da DG.
  const CAL_X = -4000, CAL_Z = 0, CAL_R = 54;
  const CAL_K = { trash: [0.45, 0.6, 0.85, 1], agro: [1, 1, 1, 2], elite: [2.6, 1.45, 1.3, 6], minion: [0.35, 0.6, 0.75, 1], raro: [5, 1.7, 1.45, 25], mini: [9, 1.9, 1.7, 40], boss: [18, 2.4, 2.3, 120], super: [26, 3, 2.6, 400] };
  const CAL_SZ = { golem: 0.5, dragao: 0.45, troll: 0.7, morcego: 0.55, aranha: 0.85 };
  const CAL_COR = { elite: '#ffb030', raro: '#ff3aff', mini: '#ff6a3a', boss: '#ff2a2a', super: '#b030ff' };
  const DGS = [
    { id: 'ratos', nome: 'Toca dos Ratos', nv: 1, cor: '#4a3a24', fog: '#1a140c', luz: '#ffb070', pool: ['rato', 'goblin'], elite: 'goblin', mini: ['goblin', 'Narigão, o Chefe Goblin'], boss: ['rato', 'Rei Rato Pestilento'], raro: ['rato', 'Rato Dourado'] },
    { id: 'cripta', nome: 'Cripta dos Ossos', nv: 10, cor: '#3a3a44', fog: '#0e0e16', luz: '#8aa8ff', pool: ['esqueleto', 'espectro'], elite: 'esqueleto', mini: ['espectro', 'Viúva Lamentosa'], boss: ['esqueleto', 'Lich Morrighan'], raro: ['esqueleto', 'Cavaleiro Sem Cabeça'] },
    { id: 'aranhas', nome: 'Ninho das Aranhas', nv: 20, cor: '#2a3020', fog: '#0c120a', luz: '#9aff6a', pool: ['aranha', 'cogumelo'], elite: 'aranha', mini: ['cogumelo', 'Fungo Rei'], boss: ['aranha', 'Rainha Aracna'], raro: ['aranha', 'Aranha de Cristal'] },
    { id: 'bandidos', nome: 'Forte dos Bandidos', nv: 30, cor: '#5a4a34', fog: '#1a120a', luz: '#ff9a4a', pool: ['bandido', 'lobo'], elite: 'bandido', mini: ['lobo', 'Lobo de Guerra'], boss: ['bandido', 'Barão Sangrento'], raro: ['bandido', 'Assassino Fantasma'] },
    { id: 'cristal', nome: 'Caverna de Cristal', nv: 45, cor: '#2a3a5a', fog: '#0a1428', luz: '#6ae8ff', pool: ['gosma', 'aranha'], elite: 'gosma', mini: ['golem', 'Guardião de Cristal'], boss: ['golem', 'Golem Ancião'], raro: ['gosma', 'Gosma Prismática'] },
    { id: 'trolls', nome: 'Fortaleza dos Trolls', nv: 60, cor: '#4a4034', fog: '#140e08', luz: '#ffc86a', pool: ['javali', 'troll'], elite: 'troll', mini: ['javali', 'Javali Couraçado'], boss: ['troll', 'Grommash, o Rei Troll'], raro: ['troll', 'Troll Albino'] },
    { id: 'sombras', nome: 'Abismo das Sombras', nv: 75, cor: '#241a34', fog: '#08040e', luz: '#c46aff', pool: ['espectro', 'esqueleto', 'lobo'], elite: 'espectro', mini: ['esqueleto', 'Carrasco do Abismo'], boss: ['espectro', 'O Ceifador'], raro: ['espectro', 'Sombra Faminta'] },
    { id: 'trono', nome: 'Trono do Dragão', nv: 90, cor: '#4a1a10', fog: '#1a0602', luz: '#ff6a2a', pool: ['troll', 'esqueleto', 'gosma'], elite: 'troll', mini: ['dragao', 'Dragonete Vermelho'], boss: ['dragao', 'Ignarok, Dragão Ancestral'], raro: ['dragao', 'Dragão Albino'] },
    { id: 'vazio', nome: 'Vazio Eterno (secreto)', nv: 100, secreto: 'trono', cor: '#100818', fog: '#000000', luz: '#ff3aff', pool: ['espectro', 'troll', 'aranha', 'esqueleto'], elite: 'troll', mini: ['dragao', 'Arauto do Vazio'], boss: ['golem', 'O Devorador de Mundos'], raro: ['espectro', 'Eco do Rei'], superboss: true }];
  const TORRE_POOL = [['rato', 'goblin', 'lobo'], ['goblin', 'lobo', 'javali'], ['esqueleto', 'bandido', 'lobo'], ['aranha', 'cogumelo', 'esqueleto'], ['bandido', 'gosma', 'espectro'], ['gosma', 'troll', 'aranha'], ['espectro', 'troll', 'esqueleto'], ['troll', 'espectro', 'gosma'], ['troll', 'aranha', 'espectro']];
  AR.dg = AR.dg || {}; AR.torre = AR.torre || 0; AR.bmLib = AR.bmLib || (AR.nv >= 12 ? [1, 1, 1] : AR.nv >= 5 ? [1, 1, 0] : [1, 0, 0]);
  var CAL = { on: false, d: null, feras: [], onda: 0, ondas: [], fim: false, torre: 0, espera: 0, boss: null };
  // ---------- a arena (uma só, muda de cor por DG) ----------
  const CALG = grp(world, CAL_X, 0, CAL_Z); CALG.visible = false; const CALCOL = [];
  const calChaoM = new T3.MeshToonMaterial({ color: '#4a3a24', gradientMap: GRAD }); const calPedraM = new T3.MeshToonMaterial({ color: '#5a5060', gradientMap: GRAD });
  { const ch = new T3.Mesh(new T3.CircleGeometry(CAL_R + 6, 64), calChaoM); ch.rotation.x = -Math.PI / 2; ch.receiveShadow = true; CALG.add(ch);
    for (let i = 0; i < 4; i++) { const r = new T3.Mesh(new T3.RingGeometry(10 + i * 11, 10.6 + i * 11, 64), new T3.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.08 })); r.rotation.x = -Math.PI / 2; r.position.y = 0.02; CALG.add(r); }
    for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, x = Math.sin(a) * (CAL_R + 2), z = Math.cos(a) * (CAL_R + 2); const m = new T3.Mesh(CYL, calPedraM); m.position.set(x, 4, z); m.scale.set(1.6, 8, 1.6); m.castShadow = true; CALG.add(m); const t = new T3.Mesh(BOX, calPedraM); t.position.set(x, 8.3, z); t.scale.set(2.2, 0.6, 2.2); CALG.add(t); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2, x = Math.sin(a) * 30, z = Math.cos(a) * 30; const m = new T3.Mesh(CYL, calPedraM); m.position.set(x, 3, z); m.scale.set(1.3, 6, 1.3); m.castShadow = true; CALG.add(m); CALCOL.push({ t: 'c', x: CAL_X + x, z: CAL_Z + z, r: 1.5 }); glowSpr(CALG, x, 6.6, z, 3, '#ffb060', 0.8); const f = new T3.Mesh(CONE, new T3.MeshBasicMaterial({ color: '#ffa040', toneMapped: false })); f.position.set(x, 6.4, z); f.scale.set(0.3, 0.7, 0.3); CALG.add(f); }
    for (let i = 0; i < 18; i++) { const a = Math.random() * 6.28, r = 12 + Math.random() * 38; const m = new T3.Mesh(ICO, calPedraM); m.position.set(Math.sin(a) * r, 0.3, Math.cos(a) * r); m.scale.set(0.6 + Math.random(), 0.4 + Math.random() * 0.5, 0.6 + Math.random()); CALG.add(m); } }
  const calPortal = grp(CALG, 0, 0, -(CAL_R - 3)); { part(calPortal, TOR, '#e2c27a', 0, 2.2, 0, 1.9, 1.9, 1.9, 0, true); const d = new T3.Mesh(new T3.CircleGeometry(1.8, 40), new T3.MeshBasicMaterial({ color: '#7ad8ff', transparent: true, opacity: 0.6, side: T3.DoubleSide, toneMapped: false })); d.position.y = 2.2; calPortal.add(d); calPortal.userData.d = d; glowSpr(calPortal, 0, 2.2, 0, 5, '#7ad8ff', 0.6); }
  const calLuz = new T3.PointLight('#ffb070', 3, 90, 1.2); calLuz.position.set(0, 14, 0); CALG.add(calLuz);
  function calModo(d) { return { sky: [d.fog, d.cor], hemi: 1.15, sun: 1.0, sunC: d.luz, fog: d.fog, fogN: 22, fogF: 95, ground: d.cor, rim: d.luz }; }
  // ---------- monstros ----------
  function calMob(base, nv, cls, x, z, nome) { const B = TIPOS[base]; if (!B) return null; const K = CAL_K[cls], e = fera(base); const sz = K[2] * (CAL_SZ[base] && cls !== 'trash' && cls !== 'minion' ? CAL_SZ[base] * 1.4 : CAL_SZ[base] || 1);
    const fv = 1 + nv * 0.14, fd = 1 + nv * 0.07, chefe = ['raro', 'mini', 'boss', 'super'].includes(cls);
    e.T = Object.assign({}, B, { nome: nome || (cls === 'elite' ? B.nome + ' Elite' : cls === 'minion' ? 'Lacaio' : B.nome), vida: Math.round(B.vida * 0.6 * fv * K[0]), dano: Math.round(B.dano * 0.7 * fd * K[1]), zona: 'calab', volta: 99999, aggro: 70, perto: 0,
      raio: B.raio * sz, alt: B.alt * sz, alc: B.alc * Math.max(1, sz * 0.85), vel: B.vel * (cls === 'trash' ? 1.1 : cls === 'boss' || cls === 'super' ? 0.85 : 1), moedas: [Math.round(K[3] * (1 + nv * 0.3)), Math.round(K[3] * (1 + nv * 0.4))], itens: [], chefe, voa: false,
      barra: chefe ? (cls === 'super' ? '☠️ ' : cls === 'boss' ? '👑 ' : cls === 'raro' ? '✨ ' : '⚔️ ') + (nome || B.nome).toUpperCase() + ' · NV ' + nv : null });
    e.g.scale.setScalar(sz); e.cls = cls; e.nv = nv; e.cal = true; e.home = [x, z]; e.ry = Math.random() * 6.28; reseta(e); e.estado = 'caca'; FERAS.push(e); CAL.feras.push(e);
    if (CAL_COR[cls]) { glowSpr(e.g, 0, B.alt * 0.5, 0, B.alt * 1.7, CAL_COR[cls], cls === 'elite' ? 0.35 : 0.55); }
    if (cls === 'super' || cls === 'boss') e.g.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.material.isMeshBasicMaterial && Math.random() < 0.5) { o.material = o.material.clone(); o.material.color.lerp(new T3.Color(cls === 'super' ? '#3a0a5a' : '#5a0a0a'), 0.45); } });
    return e; }
  function calLimpa() { CAL.feras.forEach(e => { if (e.g.parent) e.g.parent.remove(e.g); e.hp.remove(); const i = FERAS.indexOf(e); if (i >= 0) FERAS.splice(i, 1); }); CAL.feras = []; CAL.boss = null; }
  const calPos = (r0, r1) => { const a = Math.random() * 6.28, r = r0 + Math.random() * (r1 - r0); return [CAL_X + Math.sin(a) * r, CAL_Z + Math.cos(a) * r - 6]; };
  function calOndasDG(d) { const nv = d.nv, P = d.pool, rr = () => P[Math.floor(Math.random() * P.length)];
    return [{ txt: 'Onda 1: um bando de inimigos fracos!', m: Array.from({ length: 8 }, () => [rr(), 'trash']) },
      { txt: 'Onda 2: inimigos agressivos e uma Elite!', m: [...Array.from({ length: 5 }, () => [rr(), 'agro']), [d.elite, 'elite']], raro: d.raro },
      { txt: 'Subchefe: ' + d.mini[1] + '!', m: [[d.mini[0], 'mini', d.mini[1]], [rr(), 'agro'], [rr(), 'agro']] },
      { txt: 'Onda 4: Elites!', m: [[d.elite, 'elite'], [d.elite, 'elite'], ...Array.from({ length: 4 }, () => [rr(), 'agro'])] },
      { txt: (d.superboss ? '☠️ CHEFE SECRETO: ' : '👑 CHEFE: ') + d.boss[1] + '!', m: [[d.boss[0], d.superboss ? 'super' : 'boss', d.boss[1]]], boss: true }]; }
  function calOndasTorre(n) { const P = TORRE_POOL[Math.min(TORRE_POOL.length - 1, Math.floor((n - 1) / 12))], rr = () => P[Math.floor(Math.random() * P.length)]; const q = 4 + Math.floor(n / 8);
    const m = Array.from({ length: q }, () => [rr(), n < 3 ? 'trash' : 'agro']); if (n % 5 === 0) m.push([rr(), 'elite']); if (n % 10 === 0) m.push([rr(), n % 50 === 0 ? 'super' : n % 20 === 0 ? 'boss' : 'mini', (n % 50 === 0 ? 'Senhor do Andar ' : 'Guardião do Andar ') + n]);
    return [{ txt: 'Andar ' + n + (n % 10 === 0 ? ': GUARDIÃO!' : ''), m, boss: n % 10 === 0 }]; }
  function calSolta(o) { CAL.onda++; aviso(o.txt, o.boss ? '#ff5a3a' : '#ffd23c'); som(o.boss ? 'portal' : 'missao', 0.8, 1); const nv = CAL.nv;
    o.m.forEach(([b, c, n]) => { const [x, z] = c === 'boss' || c === 'super' || c === 'mini' ? [CAL_X, CAL_Z - 4] : calPos(14, 40); const e = calMob(b, nv, c, x, z, n); if (e && (c === 'boss' || c === 'super')) { CAL.boss = e; e.fase = 0; } });
    if (o.raro && Math.random() < 0.35) { const [x, z] = calPos(20, 40); calMob(o.raro[0], nv, 'raro', x, z, o.raro[1]); aviso('✨ Um inimigo RARO apareceu: ' + o.raro[1] + '!', '#ff5aff'); } }
  // ---------- entrar e sair ----------
  function calEntra(d, andar) { if (!andar && d.secreto && !(AR.dg[d.secreto] > 0) && !souAdmin()) { aviso('🔒 Esse calabouço é secreto. Vença o ' + DGS.find(x => x.id === d.secreto).nome + ' primeiro.', '#ff6a6a'); return; }
    if (montado) montar(false); if (voando) voa(false);
    cena([{ t: andar ? 'Você entra na Torre dos Monstros... Andar ' + andar : 'Você atravessa o portal para ' + d.nome + '...', v: null }], () => { calLimpa(); CAL.on = true; CAL.d = d; CAL.torre = andar || 0; CAL.nv = andar ? andar : d.nv; CAL.onda = 0; CAL.fim = false; CAL.espera = 2.5; CAL.t0 = performance.now();
      CAL.ondas = andar ? calOndasTorre(andar) : calOndasDG(d); CAL.modo = calModo(d); calChaoM.color.set(d.cor); calPedraM.color.set(new T3.Color(d.cor).lerp(new T3.Color('#8a8a9a'), 0.4)); calLuz.color.set(d.luz);
      zona = 'calab'; dentro = false; MM.grupo.visible = false; CALG.visible = true; heroi.position.set(CAL_X, 0, CAL_Z + CAL_R - 14); facing = Math.PI; camYaw = 0; cam.position.set(CAL_X, 4, CAL_Z + CAL_R - 9); setMode(CAL.modo);
      som('portal', 1, 1); mostrarLugar(andar ? 'Torre dos Monstros · Andar ' + andar : d.nome + ' · Nv ' + d.nv); calHud(); }); }
  function calSai(msg) { cena([{ t: msg || 'De volta à Praça dos Aventureiros...', v: null }], () => { calLimpa(); CAL.on = false; CALG.visible = false; zona = 'vila'; dentro = false; heroi.position.set(PRACA.x, 0, PRACA.z + 6); facing = 0; camYaw = Math.PI; cam.position.set(PRACA.x, 4, PRACA.z + 10); calHud(); }); }
  function calVence() { CAL.fim = true; const d = CAL.d, nv = CAL.nv, seg = Math.round((performance.now() - CAL.t0) / 1000);
    const moed = Math.round(40 * (1 + nv * (CAL.torre ? 0.35 : 0.9))), xp = Math.round(90 * (1 + nv * (CAL.torre ? 0.6 : 1.4)));
    AR.inv.moedas += moed; ganhaXp(xp, true); atualizaInv();
    if (CAL.torre) { if (CAL.torre > AR.torre) AR.torre = CAL.torre; misEvento('torre', CAL.torre); aviso('🗼 Andar ' + CAL.torre + ' vencido! +' + moed + ' moedas, +' + xp + ' XP. Portal: próximo andar ou sair.', '#7ad87a'); }
    else { const pri = !(AR.dg[d.id] > 0); AR.dg[d.id] = (AR.dg[d.id] || 0) + 1; misEvento('dg', d.id, nv); aviso('🏆 ' + d.nome + ' conquistado em ' + seg + 's! +' + moed + ' moedas, +' + xp + ' XP' + (pri ? ' · primeira vez!' : ''), '#ffd23c');
      if (pri) { const t = 'dg_' + d.id; if (TITULOS[t]) setTimeout(() => ganhaTitulo(t), 1500); }
      const sem = ['esp_suprema', 'esp_corrompida', 'esp_celestial', 'esp_dragao_real', 'esp_executora'].filter(k => !AR.armas.includes(k)); if (sem.length && Math.random() < 0.08 + nv / 400) { const k = sem[Math.floor(Math.random() * sem.length)]; AR.armas.push(k); setTimeout(() => aviso('🎁 O chefe deixou cair: ' + ARMAS[k].icone + ' ' + ARMAS[k].nome + '!', '#ff8aff'), 2600); } }
    salvaAR(); flash('rgba(255,230,140,.4)'); som('missao_ok', 1, 1); fx('luz', [heroi.position.x, 0, heroi.position.z], 1.2); calHud(); }
  // ---------- quadro de cada frame ----------
  function calFrame(dt, p) { if (!CAL.on) return null; if (zona !== 'calab') { calLimpa(); CAL.on = false; CALG.visible = false; return null; }
    colide(p, CALCOL); const rx = p.x - CAL_X, rz = p.z - CAL_Z, r = Math.hypot(rx, rz); if (r > CAL_R - 1) { p.x = CAL_X + rx * (CAL_R - 1) / r; p.z = CAL_Z + rz * (CAL_R - 1) / r; }
    CAL.feras.forEach(e => { const g = e.g.position, q = Math.hypot(g.x - CAL_X, g.z - CAL_Z); if (q > CAL_R - 1.5) { g.x = CAL_X + (g.x - CAL_X) * (CAL_R - 1.5) / q; g.z = CAL_Z + (g.z - CAL_Z) * (CAL_R - 1.5) / q; } });
    calPortal.userData.d.material.opacity = CAL.fim ? 0.75 + Math.sin(gT * 4) * 0.15 : 0.15; calPortal.rotation.y += dt * 0.3;
    // chefe: fases
    const B = CAL.boss; if (B && !B.morto) { const f = B.vida / B.max; if (B.fase === 0 && f < 0.6) { B.fase = 1; aviso('👑 ' + B.T.nome + ' chama reforços!', '#ff6a3a'); for (let i = 0; i < 4; i++) { const [x, z] = calPos(8, 20); calMob(CAL.d.pool[i % CAL.d.pool.length], CAL.nv, 'minion', x, z); } }
      if (B.fase === 1 && f < 0.3) { B.fase = 2; B.T.dano = Math.round(B.T.dano * 1.35); B.T.vel *= 1.25; B.T.cd *= 0.8; aviso('🔥 ' + B.T.nome + ' ficou FURIOSO!', '#ff3a3a'); flash('rgba(255,40,40,.35)'); tremor = 0.6; if (B.cls === 'super') for (let i = 0; i < 3; i++) { const [x, z] = calPos(10, 22); calMob(CAL.d.elite, CAL.nv, 'elite', x, z); } } }
    const vivos = CAL.feras.filter(e => !e.morto).length;
    if (!CAL.fim && !vivos) { CAL.espera -= dt; if (CAL.espera <= 0) { if (CAL.onda < CAL.ondas.length) { calSolta(CAL.ondas[CAL.onda]); CAL.espera = 2.5; } else calVence(); calHud(); } }
    if (Math.hypot(p.x - CAL_X, p.z - (CAL_Z - CAL_R + 3)) < 3.4) { if (CAL.fim && CAL.torre && CAL.torre < 100) return { rot: 'ANDAR ' + (CAL.torre + 1), acao: () => calEntra(CAL.d, CAL.torre + 1) }; return { rot: 'SAIR', acao: () => { if (!CAL.fim && !confirm('Sair agora? Você perde o progresso deste calabouço.')) return; calSai(); } }; }
    return null; }
  function calHud() { const el = $('cal-hud'); el.hidden = !CAL.on; if (!CAL.on) return; const vivos = CAL.feras.filter(e => !e.morto).length;
    el.innerHTML = `<b>${CAL.torre ? '🗼 TORRE · ANDAR ' + CAL.torre : '🏰 ' + CAL.d.nome.toUpperCase() + ' · NV ' + CAL.d.nv}</b>${CAL.fim ? '✅ Vencido! Vá até o portal.' : 'Onda ' + Math.max(1, CAL.onda) + '/' + CAL.ondas.length + ' · inimigos: ' + vivos}`; }
  setInterval(() => { if (CAL.on) calHud(); }, 700);
  // ---------- títulos novos ----------
  DGS.forEach(d => { TITULOS['dg_' + d.id] = { nome: 'Conquistador: ' + d.nome.replace(' (secreto)', ''), r: d.nv >= 90 ? 'lendario' : d.nv >= 45 ? 'epico' : 'raro', como: 'Vencer o calabouço ' + d.nome }; });
  Object.assign(TITULOS, { torre50: { nome: 'Escalador da Torre', r: 'epico', como: 'Chegar ao andar 50 da Torre dos Monstros' }, torre100: { nome: 'Senhor da Torre', r: 'lendario', como: 'Vencer o andar 100 da Torre' }, colosso: { nome: 'Matador de Colossos', r: 'lendario', como: 'Derrotar o Colosso, chefe de mundo' }, grau_s: { nome: 'Aventureiro Grau S', r: 'lendario', como: 'Chegar ao Grau S no Mural de Missões' } });
  // ---------- PRAÇA DOS AVENTUREIROS (fora do portão leste) ----------
  var PRACA = { x: MW.r + 16, z: MW.z - 26 };
  { const g = grp(world, PRACA.x, 0, PRACA.z); const ch = new T3.Mesh(new T3.CircleGeometry(15, 48), new T3.MeshToonMaterial({ color: '#d8ccb4', gradientMap: GRAD })); ch.rotation.x = -Math.PI / 2; ch.position.y = 0.015; ch.receiveShadow = true; g.add(ch);
    // portais das DGs em arco
    DGS.forEach((d, i) => { const a = -1.25 + i / (DGS.length - 1) * 2.5, x = Math.sin(a) * 11, z = -Math.cos(a) * 11; const pg = grp(g, x, 0, z); pg.rotation.y = -a;
      part(pg, BOX, '#6a6070', -1.2, 1.4, 0, 0.4, 2.8, 0.4); part(pg, BOX, '#6a6070', 1.2, 1.4, 0, 0.4, 2.8, 0.4); part(pg, BOX, '#6a6070', 0, 2.95, 0, 2.9, 0.4, 0.5);
      const pl = new T3.Mesh(new T3.PlaneGeometry(2, 2.6), new T3.MeshBasicMaterial({ color: d.luz, transparent: true, opacity: 0.55, side: T3.DoubleSide, toneMapped: false })); pl.position.y = 1.4; pg.add(pl); glowSpr(pg, 0, 1.5, 0, 3.2, d.luz, 0.45);
      const tx = canvasTex(256, 64, (c, w, h) => { c.fillStyle = '#1a1420'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffe8a0'; c.font = 'bold 26px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(d.nome.replace(' (secreto)', '') + ' · ' + d.nv, w / 2, h / 2); });
      const pc = new T3.Mesh(new T3.PlaneGeometry(2.8, 0.7), new T3.MeshBasicMaterial({ map: tx, toneMapped: false, side: T3.DoubleSide })); pc.position.set(0, 3.55, 0.05); pg.add(pc);
      const wx = PRACA.x + x, wz = PRACA.z + z; COL.push({ t: 'c', x: wx + Math.cos(a) * 1.2, z: wz + Math.sin(a) * 1.2, r: 0.35 }, { t: 'c', x: wx - Math.cos(a) * 1.2, z: wz - Math.sin(a) * 1.2, r: 0.35 }); d.portal = [wx, wz]; });
    // Torre dos Monstros
    { const tx0 = PRACA.x + 18, tz0 = PRACA.z - 6, t = grp(world, tx0, 0, tz0); for (let k = 0; k < 6; k++) { part(t, CYL, k % 2 ? '#5a5068' : '#6a6078', 0, 3 + k * 5.6, 0, 4 - k * 0.35, 5.6, 4 - k * 0.35); part(t, CYL, '#3a3044', 0, 5.8 + k * 5.6, 0, 4.3 - k * 0.35, 0.4, 4.3 - k * 0.35); for (let j = 0; j < 4; j++) { const a = j / 4 * 6.28 + k; tb(t, Math.sin(a) * (4 - k * 0.35), 3.4 + k * 5.6, Math.cos(a) * (4 - k * 0.35), 0.6, 1, 0.1, '#ff5a3a', true); } }
      part(t, CONE, '#3a2a4a', 0, 36.5, 0, 2.8, 5, 2.8); glowSpr(t, 0, 39.5, 0, 6, '#ff3a5a', 0.8); tb(t, 0, 1.4, 4.02, 2.2, 2.8, 0.2, '#2a1a10'); COL.push({ t: 'c', x: tx0, z: tz0, r: 4.1 }); PRACA.torre = [tx0, tz0 + 4.8]; funde(t); } }
  // ---------- NPCs da praça ----------
  function npcPraca(c, nome, dx, dz, acao) { c.traverse(o => { if (o.isMesh) o.castShadow = true; }); const x = PRACA.x + dx, z = PRACA.z + dz; const n = { c, nome, x, z, ry: Math.PI, ry0: Math.PI, acao }; c.position.set(x, 0, z); c.rotation.y = Math.PI; world.add(c); NPCS.push(n); COL.push({ t: 'c', x, z, r: 0.45, npc: n }); return n; }
  const selene = makeChar({ skin: '#e8c8b0', hairStyle: 'long', hairC: '#e8e8f8', top: '#3a2a6a', top2: '#e2c27a', pants: '#2a1a4a', shoe: '#1a1028', iris: '#8a6aff', ph: 3.3 }); part(selene.userData.P.hips, CONE, '#3a2a6a', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03); glowSpr(selene, 0, 1.2, 0, 2.2, '#8a6aff', 0.35);
  const kaelen = makeChar({ skin: '#a86a42', hairStyle: 'bald', hairC: '#1a1a1a', top: '#8a2a1a', top2: '#e2c27a', pants: '#3a2a20', shoe: '#2a1a10', iris: '#ff8a2a', s: 1.15, ph: 5.1 }); { const P = kaelen.userData.P; [P.shL, P.shR].forEach(sh => part(sh, SPH, '#c8a050', 0, -0.02, 0, 0.15, 0.11, 0.15, 0.04)); }
  const lyra = makeChar({ skin: '#f2c8a8', hairStyle: 'long', hairC: '#c83a2a', top: '#2a5a8a', top2: '#e8e0c8', pants: '#3a3a4a', shoe: '#2a2a30', iris: '#2a6a8a', ph: 6.6 });
  npcPraca(selene, 'Selene · Guardiã dos Portais', 0, -3, () => falaSelene()); npcPraca(kaelen, 'Mestre Kaelen · Modos de Batalha', -6, 4, () => falaKaelen()); npcPraca(lyra, 'Capitã Lyra · Mural de Missões', 6, 4, () => abreMural());
  { const m = grp(world, PRACA.x + 8.5, 0, PRACA.z + 4); tb(m, 0, 1.3, 0, 2.6, 1.8, 0.15, '#8a5a34'); tb(m, -1.2, 0.7, 0, 0.15, 1.4, 0.15, '#5a3a24'); tb(m, 1.2, 0.7, 0, 0.15, 1.4, 0.15, '#5a3a24'); for (let i = 0; i < 6; i++) tb(m, -0.8 + (i % 3) * 0.8, 1.6 - Math.floor(i / 3) * 0.6, 0.09, 0.5, 0.4, 0.02, ['#f4ecd8', '#ffe8a0', '#e8f0ff'][i % 3]); COL.push({ t: 'c', x: PRACA.x + 8.5, z: PRACA.z + 4, r: 1.3 }); }
  function falaSelene() { const N = 'Selene'; falar({ nome: N, falas: [{ n: N, t: 'Viajante... estes portais levam aos calabouços mais perigosos do reino. Cada um tem ondas, elites, um subchefe e um chefe no fim.' }, { n: N, t: 'Os do nível 1 já são duros pra quem começa. Os do nível 100 são duros até pra lendas. Escolha com cuidado.' }],
    escolhas: () => [...DGS.map(d => ({ t: `🏰 <b>${d.nome}</b><small>Nível ${d.nv}${AR.dg[d.id] ? ' · vencido ' + AR.dg[d.id] + 'x' : ''}${d.secreto && !(AR.dg[d.secreto] > 0) ? ' · 🔒 secreto' : ''}</small>`, fn: () => calEntra(d) })), { t: '🗼 <b>Torre dos Monstros</b><small>Recorde: andar ' + AR.torre + ' · entrar no andar ' + Math.min(100, AR.torre + 1) + '</small>', fn: () => calEntra(TORRE_DG, Math.min(100, AR.torre + 1)) }, { t: 'Agora não', fn: null }] }); }
  var TORRE_DG = { id: 'torre', nome: 'Torre dos Monstros', nv: 1, cor: '#2a2434', fog: '#0a0812', luz: '#ff5a6a', pool: TORRE_POOL[0], elite: 'troll' };
  // ---------- MESTRE KAELEN: liberar os modos de batalha ----------
  function bmLib(n) { return souAdmin() || !!(AR.bmLib && AR.bmLib[n - 1]); }
  const BM_REQ = [null, { dg: 'ratos', nv: 5 }, { dg: 'cripta', nv: 12 }];
  function falaKaelen() { const N = 'Mestre Kaelen'; const prox = [2, 3].find(n => !bmLib(n));
    if (!prox) { falar({ nome: N, falas: [{ n: N, t: 'Você já domina os três Modos de Batalha. Agora vá provar isso nos calabouços mais fundos!' }] }); return; }
    const R = BM_REQ[prox - 1], d = DGS.find(x => x.id === R.dg), ok = AR.nv >= R.nv && AR.dg[R.dg] > 0;
    if (ok) { falar({ nome: N, falas: [{ n: N, t: 'Eu vi você vencer ' + d.nome + '. Seu espírito de luta está pronto.' }, { n: N, t: 'Receba o Modo de Batalha ' + ['', 'II', 'III'][prox - 1] + '!' }], fim: () => { AR.bmLib[prox - 1] = 1; salvaAR(); flash('rgba(255,180,60,.5)'); som('missao_ok', 1, 1); fx('luz', [heroi.position.x, 0, heroi.position.z], 1); aviso('⚡ Modo de Batalha ' + ['', 'II', 'III'][prox - 1] + ' liberado!', '#ffc83a'); } }); return; }
    falar({ nome: N, falas: [{ n: N, t: 'Sou Kaelen, mestre da arena. O Modo de Batalha é a fúria que dorme dentro de você.' }, { n: N, t: `Pra despertar o Modo ${['', 'II', 'III'][prox - 1]}: chegue ao nível ${R.nv} e vença o calabouço ${d.nome}. ${AR.nv >= R.nv ? 'Nível você já tem!' : 'Você está no nível ' + AR.nv + '.'} ${AR.dg[R.dg] ? '' : 'Fale com a Selene pra entrar.'}` }] }); }
  // ---------- MURAL DE MISSÕES com GRAUS ----------
  const GRAUS = ['F', 'E', 'D', 'C', 'B', 'A', 'S'], GRAU_PTS = [0, 40, 120, 280, 560, 1000, 1700], GRAU_COR = ['#9a9aa8', '#7ad87a', '#5ab8ff', '#b46aff', '#ffb030', '#ff5a3a', '#ffd23c'];
  AR.mis = AR.mis || { at: {}, feitas: [], pts: 0 };
  function grau() { let g = 0; GRAU_PTS.forEach((v, i) => { if (AR.mis.pts >= v) g = i; }); return g; }
  const MIS = []; { const caca = [['rato', 0], ['lobo', 0], ['goblin', 0], ['javali', 1], ['bandido', 1], ['esqueleto', 2], ['aranha', 2], ['cogumelo', 3], ['gosma', 3], ['espectro', 4], ['troll', 4], ['golem', 5], ['dragao', 6]];
    caca.forEach(([t, g]) => { const N = TIPOS[t].nome; [[g, 10], [Math.min(6, g + 1), 30]].forEach(([gg, n], i) => MIS.push({ id: 'caca_' + t + i, g: gg, tipo: 'mata', alvo: t, n, nome: (i ? 'Extermínio: ' : 'Caçada: ') + N, desc: 'Derrote ' + n + 'x ' + N + ' (vale nos campos e nos calabouços).' })); });
    [[0, 'elite', 3, 'Primeiras Elites'], [2, 'elite', 15, 'Caçador de Elites'], [4, 'elite', 50, 'Pesadelo das Elites'], [1, 'raro', 1, 'Algo Raro'], [3, 'raro', 5, 'Colecionador de Raros'], [1, 'chefe', 3, 'Derrubador de Chefes'], [4, 'chefe', 20, 'Terror dos Chefes']].forEach(([g, a, n, nm], i) => MIS.push({ id: 'cls_' + i, g, tipo: 'mata', alvo: '@' + a, n, nome: nm, desc: 'Derrote ' + n + ' inimigo(s) ' + (a === 'chefe' ? 'chefes (subchefe, chefe ou raro)' : a === 'elite' ? 'Elite' : 'RAROS') + '.' }));
    DGS.forEach(d => MIS.push({ id: 'dg_' + d.id, g: Math.min(6, Math.floor(d.nv / 15)), tipo: 'dg', alvo: d.id, n: 1, nome: 'Conquista: ' + d.nome.replace(' (secreto)', ''), desc: 'Vença o calabouço ' + d.nome + ' (Nv ' + d.nv + ').' }));
    [5, 10, 20, 30, 50, 75, 100].forEach((n, i) => MIS.push({ id: 'torre_' + n, g: Math.min(6, Math.floor(i * 1.0)), tipo: 'torre', n, nome: 'Torre: andar ' + n, desc: 'Vença o andar ' + n + ' da Torre dos Monstros.' }));
    [[0, 500], [1, 2000], [2, 6000], [3, 15000], [4, 35000], [5, 70000], [6, 120000]].forEach(([g, n]) => MIS.push({ id: 'xp_' + n, g, tipo: 'xp', n, nome: 'Treino: ' + n.toLocaleString('pt-BR') + ' XP', desc: 'Ganhe ' + n.toLocaleString('pt-BR') + ' de XP depois de aceitar.' }));
    Object.keys(CLASSES).forEach(c => { const C = CLASSES[c]; MIS.push({ id: 'classe_' + c + '1', g: 0, tipo: 'mata', alvo: '*', n: 40, classe: c, nome: 'Prova do ' + C.nome, desc: 'Sendo ' + C.nome + ', derrote 40 inimigos.' });
      MIS.push({ id: 'classe_' + c + '2', g: 2, tipo: 'dgnv', n: 30, classe: c, nome: 'Honra do ' + C.nome, desc: 'Sendo ' + C.nome + ', vença qualquer calabouço de nível 30 ou mais.' });
      MIS.push({ id: 'classe_' + c + '3', g: 5, tipo: 'dgnv', n: 75, classe: c, nome: 'Lenda do ' + C.nome, desc: 'Sendo ' + C.nome + ', vença um calabouço de nível 75 ou mais. Prêmio: título de mestre.' });
      TITULOS['mestre_' + c] = { nome: 'Mestre ' + C.nome, r: 'epico', como: 'Missão Lenda do ' + C.nome }; }); }
  MIS.forEach(m => { m.xp = Math.round(150 * Math.pow(2.1, m.g)); m.moedas = Math.round(60 * Math.pow(2, m.g)); m.pts = [10, 18, 30, 45, 70, 100, 150][m.g]; });
  function misEvento(tipo, a, b) { let mudou = false; Object.keys(AR.mis.at).forEach(id => { const m = MIS.find(x => x.id === id), s = AR.mis.at[id]; if (!m || s.ok) return; if (m.classe && AR.classe !== m.classe) return;
      if (tipo === 'mata' && m.tipo === 'mata') { const e = a; const bate = m.alvo === '*' || m.alvo === e.tipo || (m.alvo === '@elite' && e.cls === 'elite') || (m.alvo === '@raro' && e.cls === 'raro') || (m.alvo === '@chefe' && e.T.chefe); if (bate) { s.n++; mudou = true; } }
      if (tipo === 'xp' && m.tipo === 'xp') { s.n += a; mudou = true; } if (tipo === 'dg' && m.tipo === 'dg' && m.alvo === a) { s.n = 1; mudou = true; } if (tipo === 'dg' && m.tipo === 'dgnv' && b >= m.n) { s.n = m.n; mudou = true; } if (tipo === 'torre' && m.tipo === 'torre' && a >= m.n) { s.n = m.n; mudou = true; }
      if (s.n >= m.n && !s.ok) { s.ok = 1; s.n = m.n; aviso('📜 Missão completa: ' + m.nome + '! Volte à Capitã Lyra.', '#7ad87a'); som('missao_ok', 0.8, 1); } });
    if (mudou) { salvaAR(); misHud(); } }
  { const gx = ganhaXp; ganhaXp = function (n, m) { gx(n, m); if (n > 0 && AR.mis) misEvento('xp', n); }; }
  function calMorte(e) { misEvento('mata', e); if (e.cal) { ganhaXp(Math.round((XP_TIPO[e.tipo] || 10) * (0.5 + e.nv * 0.15) * (CAL_K[e.cls] ? CAL_K[e.cls][3] / 2 : 1)), true); if (e.cls === 'raro' && Math.random() < 0.5) { AR.inv.coracao = (AR.inv.coracao || 0) + 1; aviso('✨ O raro deixou um Coração de Gelo!', '#ff8aff'); } } if (e.colosso) { ganhaTitulo('colosso'); AR.inv.moedas += 3000; atualizaInv(); aviso('🌋 COLOSSO DERROTADO! +3000 moedas', '#ffd23c'); } }
  const misHudEl = document.createElement('div'); misHudEl.id = 'mis-hud'; misHudEl.hidden = true; document.body.appendChild(misHudEl);
  function misHud() { const at = Object.keys(AR.mis.at); misHudEl.hidden = !at.length || CAL.on; misHudEl.innerHTML = at.slice(0, 3).map(id => { const m = MIS.find(x => x.id === id), s = AR.mis.at[id]; return m ? `<p class="${s.ok ? 'ok' : ''}"><i style="background:${GRAU_COR[m.g]}">${GRAUS[m.g]}</i>${m.nome} <b>${s.ok ? '✅' : s.n.toLocaleString('pt-BR') + '/' + m.n.toLocaleString('pt-BR')}</b></p>` : ''; }).join(''); }
  const muralP = document.createElement('div'); muralP.id = 'muralp'; muralP.hidden = true; document.body.appendChild(muralP); let muralG = -1;
  function abreMural() { som('clique', 0.6); muralDesenha(); muralP.hidden = false; }
  function muralDesenha() { const g = grau(), prox = GRAU_PTS[g + 1]; const L = MIS.filter(m => !AR.mis.feitas.includes(m.id) && (muralG < 0 ? m.g <= g : m.g === muralG)).sort((a, b) => (!!AR.mis.at[b.id] - !!AR.mis.at[a.id]) || a.g - b.g);
    muralP.innerHTML = `<div class="box"><div class="hd"><b>📜 Mural de Missões · Capitã Lyra</b><button class="x">Fechar</button></div>
      <div class="gr"><span class="gb" style="background:${GRAU_COR[g]}">GRAU ${GRAUS[g]}</span><div class="gbar"><i style="width:${prox ? Math.min(100, (AR.mis.pts - GRAU_PTS[g]) / (prox - GRAU_PTS[g]) * 100) : 100}%"></i></div><small>${AR.mis.pts} pts${prox ? ' · próximo grau em ' + prox : ' · grau máximo!'} · ${AR.mis.feitas.length}/${MIS.length} feitas · ativas ${Object.keys(AR.mis.at).length}/5</small></div>
      <div class="fl"><button data-g="-1" class="${muralG < 0 ? 'on' : ''}">Disponíveis</button>${GRAUS.map((x, i) => `<button data-g="${i}" class="${muralG === i ? 'on' : ''}" style="--c:${GRAU_COR[i]}">${x}</button>`).join('')}</div>
      <div class="ls">${L.map(m => { const s = AR.mis.at[m.id], trava = m.g > g, cls = m.classe && AR.classe !== m.classe;
        return `<div class="ms ${s ? 'at' : ''}"><i class="gb" style="background:${GRAU_COR[m.g]}">${GRAUS[m.g]}</i><div class="tx"><b>${m.nome}</b><small>${m.desc}</small><small>Prêmio: ${m.xp.toLocaleString('pt-BR')} XP · ${m.moedas.toLocaleString('pt-BR')} moedas · +${m.pts} pts de grau</small>${s ? `<small class="pg">Progresso: ${s.n.toLocaleString('pt-BR')}/${m.n.toLocaleString('pt-BR')}</small>` : ''}</div>
          <button data-m="${m.id}" ${trava || (cls && !s) ? 'disabled' : ''}>${s ? (s.ok ? 'Entregar' : 'Desistir') : trava ? '🔒 Grau ' + GRAUS[m.g] : cls ? '🔒 ' + CLASSES[m.classe].nome : 'Aceitar'}</button></div>`; }).join('') || '<p class="vz">Nada aqui. Suba de grau completando missões!</p>'}</div></div>`;
    muralP.querySelector('.x').onclick = () => { muralP.hidden = true; }; muralP.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { muralG = +b.dataset.g; muralDesenha(); });
    muralP.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { const m = MIS.find(x => x.id === b.dataset.m), s = AR.mis.at[m.id];
      if (s && s.ok) { delete AR.mis.at[m.id]; AR.mis.feitas.push(m.id); const g0 = grau(); AR.mis.pts += m.pts; AR.inv.moedas += m.moedas; ganhaXp(m.xp, true); atualizaInv(); som('missao_ok', 1, 1); aviso('🏆 ' + m.nome + ': +' + m.xp + ' XP, +' + m.moedas + ' moedas', '#ffd23c');
        if (m.id.startsWith('classe_') && m.id.endsWith('3')) ganhaTitulo('mestre_' + m.classe); const g1 = grau(); if (g1 > g0) { setTimeout(() => { aviso('🎖️ Você subiu para o GRAU ' + GRAUS[g1] + '!', GRAU_COR[g1]); flash('rgba(255,220,120,.45)'); }, 1200); if (g1 === 6) ganhaTitulo('grau_s'); } }
      else if (s) { if (confirm('Desistir de ' + m.nome + '?')) delete AR.mis.at[m.id]; }
      else { if (Object.keys(AR.mis.at).length >= 5) { aviso('Máximo de 5 missões ativas.', '#ff6a6a'); return; } AR.mis.at[m.id] = { n: 0 }; if (m.tipo === 'torre' && AR.torre >= m.n) AR.mis.at[m.id] = { n: m.n, ok: 1 }; if (m.tipo === 'dg' && 0) {} som('missao', 0.8, 1); aviso('📜 Missão aceita: ' + m.nome, '#ffd23c'); }
      salvaAR(); misHud(); muralDesenha(); }); }
  // ---------- CHEFE DE MUNDO e RAROS NOTURNOS (campo aberto) ----------
  { const e = fera('golem'); const B = TIPOS.golem; e.T = Object.assign({}, B, { nome: 'Colosso de Pedra Viva', vida: 40000, dano: 70, vel: 1.4, aggro: 18, alc: 6, raio: 3.2, alt: 11, volta: 900, moedas: [600, 900], itens: [['coracao', 1]], chefe: true, barra: '🌋 COLOSSO DE PEDRA VIVA · CHEFE DE MUNDO' });
    e.g.scale.setScalar(2.4); e.home = [215, -70]; e.colosso = true; reseta(e); FERAS.push(e); glowSpr(e.g, 0, 3, 0, 12, '#ff6a2a', 0.35); }
  [['lobo', 'Lobo Alfa Sombrio', 255, 120, 1.7], ['bandido', 'Capitão Corvo', 175, 95, 1.4], ['javali', 'Javali Ancestral', 300, -40, 1.8], ['troll', 'Troll da Ponte', 132, 60, 1.0]].forEach(([b, n, x, z, s]) => { const e = fera(b), B = TIPOS[b];
    e.T = Object.assign({}, B, { nome: n, vida: B.vida * 8, dano: Math.round(B.dano * 2.2), raio: B.raio * s, alt: B.alt * s, alc: B.alc * s, volta: 600, moedas: [80, 140], chefe: true, barra: '✨ ' + n.toUpperCase() + ' · RARO', zona: 'vila' });
    e.g.scale.setScalar(s); e.home = [x, z]; e.noite = true; e.cls = 'raro'; reseta(e); FERAS.push(e); glowSpr(e.g, 0, B.alt * 0.5, 0, B.alt * 1.8, '#ff3aff', 0.5); });
  misHud();
  // ===================== PRESENTES DO ADMINISTRADOR (o Painel ADM dá itens pros jogadores) =====================
  // presentes/{uid}: { lista: [{ id, t: 'arma'|'fant'|'sob'|'cosm'|'mont'|'pet'|'item'|'moedas'|'xp'|'titulo', k, n, porNome }] }
  var presOuv = false; AR.presVistos = AR.presVistos || [];
  function presAplica(x) { const n = Math.max(1, x.n | 0 || 1); let nome = x.k;
    if (x.t === 'arma' && ARMAS[x.k]) { if (!AR.armas.includes(x.k)) AR.armas.push(x.k); nome = ARMAS[x.k].nome; }
    else if (x.t === 'fant' && FANT[x.k]) { if (!AR.fantasias.includes(x.k)) AR.fantasias.push(x.k); nome = FANT[x.k].nome; }
    else if (x.t === 'sob') { if (!AR.sobs.includes(x.k)) AR.sobs.push(x.k); const [st, pc] = x.k.split(':'); const I = sobInfo(st, pc); nome = I ? I.nome : x.k; }
    else if (x.t === 'cosm' && COSM[x.k]) { if (!AR.cosms.includes(x.k)) AR.cosms.push(x.k); nome = COSM[x.k].nome; }
    else if (x.t === 'mont' && MONT[x.k]) { if (!AR.monts.includes(x.k)) AR.monts.push(x.k); nome = MONT[x.k].nome; }
    else if (x.t === 'pet' && PETS[x.k]) { if (!AR.pets.includes(x.k)) AR.pets.push(x.k); nome = PETS[x.k].nome; }
    else if (x.t === 'item') { AR.inv[x.k] = (AR.inv[x.k] || 0) + n; nome = (ITEM_INFO[x.k] || [0, x.k])[1] + ' x' + n; }
    else if (x.t === 'moedas') { AR.inv.moedas += n; nome = n.toLocaleString('pt-BR') + ' moedas'; }
    else if (x.t === 'xp') { ganhaXp(n, true); nome = n.toLocaleString('pt-BR') + ' de XP'; }
    else if (x.t === 'titulo' && TITULOS[x.k]) { ganhaTitulo(x.k, true); nome = 'título ' + TITULOS[x.k].nome; }
    else return;
    aviso('🎁 ' + (x.porNome || 'O Administrador') + ' te deu: <b>' + nome + '</b>', '#ff8aff'); flash('rgba(255,140,255,.3)'); som('missao_ok', 0.8, 1); }
  function presOuve() { if (presOuv || !window.CONTA || !CONTA.db || !CONTA.usuario) return; presOuv = true;
    CONTA.db.collection('presentes').doc(CONTA.usuario.uid).onSnapshot(d => { const L = (d.exists && d.data().lista) || []; const novos = L.filter(x => x && x.id && !AR.presVistos.includes(x.id)); if (!novos.length) return;
      novos.forEach((x, i) => setTimeout(() => presAplica(x), i * 900)); AR.presVistos = AR.presVistos.concat(novos.map(x => x.id)).slice(-300);
      setTimeout(() => { salvaAR(); atualizaInv(); if (typeof montaBarra === 'function') montaBarra(); }, novos.length * 900 + 100); d.ref.set({ lista: [] }).catch(() => {}); }, () => { presOuv = false; }); }
  setInterval(presOuve, 5000);
  window.__catalogo = () => { const src = h => { const m = /src="([^"]+)"/.exec(h || ''); return m ? m[1] : ''; }; const C = {};
    C.arma = Object.keys(ARMAS).filter(k => k !== 'punho').map(k => [k, ARMAS[k].nome, src(ARMAS[k].icone), ARMAS[k].staff ? 'Só ' + ARMAS[k].staff.toUpperCase() : ARMAS[k].soClasse ? 'Só ' + CLASSES[ARMAS[k].soClasse].nome : ARMAS[k].classe ? 'Classe ' + CLASSES[ARMAS[k].classe].nome : 'Dano ' + ARMAS[k].dano]);
    C.fant = Object.keys(FANT).filter(k => k !== 'comum').map(k => [k, FANT[k].nome, src(FANT[k].icone), 'Conjunto']);
    C.sob = []; Object.keys(CASACOS).forEach(st => ['peito', 'ombro', 'maos', 'calca', 'pe'].forEach(pc => { const I = sobInfo(st, pc); if (I) C.sob.push([st + ':' + pc, I.nome, src(I.icone), CASACOS[st].nome || st]); }));
    C.cosm = Object.keys(COSM).map(k => [k, COSM[k].nome, src(COSM[k].icone), 'Asas']); C.mont = Object.keys(MONT).map(k => [k, MONT[k].nome, src(MONT[k].icone), 'Montaria']); C.pet = Object.keys(PETS).map(k => [k, PETS[k].nome, src(PETS[k].icone), 'Pet']);
    C.item = Object.keys(ITEM_INFO).map(k => [k, ITEM_INFO[k][1], src(ITEM_INFO[k][0]), 'Item']); C.titulo = Object.keys(TITULOS).filter(k => k !== 'admin').map(k => [k, TITULOS[k].nome, '', TITULOS[k].r]); return C; };
