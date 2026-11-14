  // ===================== MODO HISTÓRIA (missões principais em ordem; cada uma no formato do criador) =====================
  const HISTORIA = [
    {
      id: "mq_05",
      levelReq: 5,
      title: "Despertar da Postura Rúnica",
      npc: "Mestre Ryuken",
      location: "Santuário da Praça",
      description: "Seu corpo já suporta a energia do Obelisco. Concentre sua mana no círculo rúnico e prove seu domínio em combate.",
      objectives: [
        { type: "INTERACT", target: "circulo_runico_praca", count: 1 },
        { type: "KILL", target: "guardiao_treino", count: 1 }
      ],
      rewards: {
        xp: 900,
        gold: 600,
        unlockFeature: "MODO_BATALHA_1"
      },
      // falas do mestre (opcional)
      falas: ['Então você é o aventureiro de quem o Obelisco fala... Sinto sua mana pulsando daqui.', 'Seu corpo já suporta a energia do Obelisco. Agora precisa aprender a domá-la.', 'Vá até o círculo rúnico do santuário e concentre sua mana nele. Ele vai despertar um guardião de treino.', 'Derrote o guardião e prove seu domínio em combate. Só então a Postura Rúnica vai despertar em você.'],
      fim: ['Eu senti o círculo tremer daqui! Você domou a energia e venceu o guardião.', 'A partir de hoje, a fúria rúnica responde ao seu chamado. Esse é o Modo de Batalha I.', 'Use com sabedoria: encha a barra lutando e toque no I ao lado da sua vida.']
    }
  ];
  // nomes que aparecem pro jogador para cada alvo das missões
  const HIST_ALVOS = { circulo_runico_praca: { INTERACT: 'Concentrar mana no Círculo Rúnico', ic: '🔵' }, guardiao_treino: { KILL: 'Derrotar o Guardião de Treino', ic: '🗿' } };
  // o que cada "unlockFeature" libera
  const HIST_LIBERA = {
    MODO_BATALHA_1: { nome: '⚡ Modo de Batalha I', fn: () => { AR.bmLib = AR.bmLib || [0, 0, 0]; AR.bmLib[0] = 1; } }
  };
  AR.hist = AR.hist || { feitas: [], at: null, libs: {} }; AR.hist.libs = AR.hist.libs || {};
  // quem já tinha o Modo I antes do Modo História continua com ele
  if (AR.bmLib && AR.bmLib[0]) AR.hist.libs.MODO_BATALHA_1 = 1;
  function histQ(id) { return HISTORIA.find(q => q.id === id); }
  function histFeita(id) { return AR.hist.feitas.includes(id); }
  function histProxima() { return HISTORIA.find(q => !histFeita(q.id)); }
  function histObjTxt(o) { const A = HIST_ALVOS[o.target] || {}; return (A[o.type] || (o.type === 'KILL' ? 'Derrotar ' : 'Interagir com ') + o.target) + (o.count > 1 ? ' (' + o.count + ')' : ''); }
  function histAtual() { const a = AR.hist.at; return a ? histQ(a.id) : null; }
  function histObjAtual() { const q = histAtual(); if (!q) return -1; const p = AR.hist.at.prog; return q.objectives.findIndex((o, i) => (p[i] || 0) < o.count); }
  function histCompleta() { return !!histAtual() && histObjAtual() < 0; }
  function histProgresso(tipo, alvo) { const q = histAtual(); if (!q) return false; const i = histObjAtual(); if (i < 0) return false; const o = q.objectives[i]; if (o.type !== tipo || o.target !== alvo) return false;
    AR.hist.at.prog[i] = (AR.hist.at.prog[i] || 0) + 1; salvaAR(); som('missao_ok', 0.8, 1.2);
    if (histObjAtual() < 0) setTimeout(() => aviso('📖 ' + q.title + ': objetivos completos! Volte para o ' + q.npc + '.', '#7ad87a'), 700); else aviso('✅ ' + histObjTxt(o) + ' · próximo: ' + histObjTxt(q.objectives[histObjAtual()]), '#7ad87a');
    histHud(); return true; }
  // ---------- SANTUÁRIO DA PRAÇA: plataforma, círculo rúnico e o Mestre Ryuken ----------
  function santLugar() { // procura um lugar livre perto da praça: longe da estrada, da muralha e de outras coisas
    for (const r of [26, 30, 34, 38]) for (let k = 0; k < 24; k++) { const a = Math.PI / 2 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (Math.PI / 12); const x = PRACA.x + Math.cos(a) * r, z = PRACA.z + Math.sin(a) * r;
      if (naEstrada(x, z, 10)) continue; if (Math.hypot(x - MW.x, z - MW.z) < MW.r + 12) continue; if (COL.some(c => c.x !== undefined && Math.hypot(c.x - x, c.z - z) < (c.r || Math.max(c.hw || 1, c.hd || 1) * 1.2) + 7)) continue; return [x, z]; }
    return [PRACA.x - 2, PRACA.z + 25]; }
  const SANT = (() => { const [x, z] = santLugar(), g = grp(world, x, 0, z);
    const pedra = new T3.Mesh(new T3.CylinderGeometry(5.2, 5.6, 0.3, 40), new T3.MeshToonMaterial({ color: '#8f8a9a', gradientMap: GRAD })); pedra.position.y = 0.15; pedra.receiveShadow = true; g.add(pedra);
    const borda = new T3.Mesh(new T3.TorusGeometry(5.25, 0.12, 8, 48), new T3.MeshToonMaterial({ color: '#e2c27a', gradientMap: GRAD })); borda.rotation.x = Math.PI / 2; borda.position.y = 0.31; g.add(borda);
    // textura do círculo rúnico (desenhada aqui, original)
    const runas = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
    const tx = canvasTex(512, 512, (c, w, h) => { c.clearRect(0, 0, w, h); c.translate(w / 2, h / 2); c.strokeStyle = '#7ae8ff'; c.fillStyle = '#7ae8ff'; c.shadowColor = '#3ad8ff'; c.shadowBlur = 14;
      [236, 214, 150, 70].forEach((r, i) => { c.lineWidth = i === 0 ? 8 : 4; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke(); });
      c.font = 'bold 26px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; c.save(); c.rotate(a); c.fillText(runas[i], 0, -225); c.restore(); }
      c.lineWidth = 4; c.beginPath(); for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI * 2 * 2 - Math.PI / 2; const px = Math.cos(a) * 150, py = Math.sin(a) * 150; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
      c.beginPath(); for (let i = 0; i <= 3; i++) { const a = i / 3 * Math.PI * 2 + Math.PI / 2; c.lineTo(Math.cos(a) * 150, Math.sin(a) * 150); } c.stroke(); c.beginPath(); for (let i = 0; i <= 3; i++) { const a = i / 3 * Math.PI * 2 - Math.PI / 2; c.lineTo(Math.cos(a) * 150, Math.sin(a) * 150); } c.stroke();
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; c.beginPath(); c.arc(Math.cos(a) * 182, Math.sin(a) * 182, 14, 0, Math.PI * 2); c.stroke(); }
      c.beginPath(); c.arc(0, 0, 28, 0, Math.PI * 2); c.fill(); });
    const cm = new T3.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, toneMapped: false, opacity: 0.75, blending: T3.AdditiveBlending });
    const circ = new T3.Mesh(new T3.PlaneGeometry(6.4, 6.4), cm); circ.rotation.x = -Math.PI / 2; circ.position.y = 0.33; g.add(circ);
    const luz = glowSpr(g, 0, 0.6, 0, 6, '#3ad8ff', 0.35);
    // coluna de luz (aparece ao concentrar)
    const colM = new T3.MeshBasicMaterial({ color: '#7ae8ff', transparent: true, opacity: 0, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending, side: T3.DoubleSide });
    const col = new T3.Mesh(new T3.CylinderGeometry(2.6, 3.1, 16, 32, 1, true), colM); col.position.y = 8.3; g.add(col);
    // 4 pilares com braseiros azuis
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + Math.PI / 4, px = Math.cos(a) * 4.5, pz = Math.sin(a) * 4.5; part(g, BOX, '#6a6478', px, 1.3, pz, 0.55, 2.3, 0.55); part(g, BOX, '#e2c27a', px, 2.5, pz, 0.75, 0.18, 0.75); part(g, CONE, '#5ae8ff', px, 2.95, pz, 0.22, 0.6, 0.22, 0, true); glowSpr(g, px, 3, pz, 1.6, '#3ad8ff', 0.7); COL.push({ t: 'c', x: x + px, z: z + pz, r: 0.42 }); }
    // placa
    const pl = canvasTex(512, 96, (c, w, h) => { c.fillStyle = '#1a1628'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e2c27a'; c.lineWidth = 6; c.strokeRect(4, 4, w - 8, h - 8); c.fillStyle = '#ffe8a0'; c.font = 'bold 42px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Santuário da Praça', w / 2, h / 2); });
    const pg = grp(g, 0, 0, -5.9); tb(pg, -1.3, 0.9, 0, 0.14, 1.8, 0.14, '#5a3a24'); tb(pg, 1.3, 0.9, 0, 0.14, 1.8, 0.14, '#5a3a24'); const pc = new T3.Mesh(new T3.PlaneGeometry(2.9, 0.55), new T3.MeshBasicMaterial({ map: pl, toneMapped: false, side: T3.DoubleSide })); pc.position.y = 1.65; pg.add(pc);
    // partículas que sobem
    const parts = []; for (let i = 0; i < 26; i++) { const s = new T3.Sprite(new T3.SpriteMaterial({ color: '#9af0ff', transparent: true, opacity: 0, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending })); s.scale.setScalar(0.18); g.add(s); parts.push({ s, a: Math.random() * 6.28, r: 0.5 + Math.random() * 2.6, k: Math.random() }); }
    return { x, z, g, circ, cm, luz, col, colM, parts, canal: 0, pulso: 0 }; })();
  const ryuken = makeChar({ skin: '#e2b48c', hairStyle: 'bald', hairC: '#d8d8e0', top: '#e8e4dc', top2: '#2a3a6a', pants: '#2a3a6a', shoe: '#1a1a24', iris: '#3ad8ff', s: 1.05, ph: 7.7 });
  { const P = ryuken.userData.P; part(P.hips, CONE, '#e8e4dc', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03); part(P.head, SPH, '#d8d8e0', 0, -0.2, 0.12, 0.14, 0.2, 0.08); tb(P.spine, 0, 0.12, 0.14, 0.42, 0.06, 0.02, '#3ad8ff'); }
  const RYU = npcPraca(ryuken, 'Mestre Ryuken · Modo História', SANT.x - PRACA.x + 4.6, SANT.z - PRACA.z - 3.2, () => histFala());
  RYU.marca = new T3.Sprite(new T3.SpriteMaterial({ map: marcaT('!', '#ffd23c'), transparent: true, depthWrite: false, toneMapped: false })); RYU.marca.scale.set(0.45, 0.6, 1); world.add(RYU.marca);
  const RYU_M = { '!': RYU.marca.material.map };
  // ---------- GUARDIÃO DE TREINO ----------
  const GUARD = (() => { const e = fera('troll'); const B = TIPOS.troll; e.T = Object.assign({}, B, { nome: 'Guardião de Treino', vida: 900, dano: 12, vel: 2.0, aggro: 16, alc: 2.2, cd: 2.4, raio: 0.9, alt: 2.6, moedas: [0, 0], itens: [], zona: 'vila', chefe: false, volta: 1e12 });
    e.g.scale.setScalar(0.9); e.g.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.toneMapped !== false) { o.material = o.material.clone(); o.material.color.lerp(new T3.Color('#7a8aa8'), 0.45); } }); e.hist = 'guardiao_treino'; e.home = [SANT.x, SANT.z + 0.5]; e.ry = 0;
    glowSpr(e.g, 0, 2.6, 0, 5, '#3ad8ff', 0.35); reseta(e); e.morto = true; e.mortoT = 99; e.g.visible = false; e.hp.style.display = 'none'; FERAS.push(e); return e; })();
  function guardiaoInvoca() { const e = GUARD; if (!e.morto) return; reseta(e); e.estado = 'caca'; e.g.position.y = -3; e.surge = 1.6; fx('luz', [SANT.x, 0, SANT.z], 1); tremor = 0.5; som('magia', 1, 0.6); aviso('🗿 O Guardião de Treino despertou! Derrote-o!', '#7ae8ff'); }
  function histMorte(e) { if (e !== GUARD) return false; e.morto = true; e.mortoT = 0; e.hp.style.display = 'none'; fx('luz', [e.g.position.x, 0, e.g.position.z], 0.8); histProgresso('KILL', 'guardiao_treino'); return true; }
  // ---------- fala do mestre ----------
  function histFala() { const N = 'Mestre Ryuken', q = histAtual();
    if (q && q.npc === N) { if (histCompleta()) { falar({ nome: N, falas: q.fim || ['Muito bem! Você completou: ' + q.title + '.'], fim: () => histConclui(q) }); return; }
      const o = q.objectives[histObjAtual()]; falar({ nome: N, falas: ['Ainda não terminou. Agora: ' + histObjTxt(o).toLowerCase() + '.' + (o.target === 'guardiao_treino' && GUARD.morto ? ' Concentre sua mana no círculo de novo para chamar o guardião.' : '')] }); return; }
    const p = histProxima(); if (!p) { falar({ nome: N, falas: ['Você já percorreu todo o caminho que os pergaminhos revelam por enquanto. Volte quando o Obelisco mostrar o próximo capítulo.'] }); return; }
    if (p.npc !== N) { falar({ nome: N, falas: ['Seu próximo passo está com ' + p.npc + ', em ' + p.location + '.'] }); return; }
    if (AR.nv < p.levelReq) { falar({ nome: N, falas: ['Sinto potencial em você... mas seu corpo ainda não aguenta a energia do Obelisco.', 'Volte quando chegar ao nível ' + p.levelReq + '. Você está no nível ' + AR.nv + '.'] }); return; }
    falar({ nome: N, falas: p.falas || [p.description], escolhas: () => [{ t: '📖 <b>Aceitar: ' + p.title + '</b><small>Recompensa: ' + histRecTxt(p) + '</small>', fn: () => histAceita(p) }, { t: 'Agora não', fn: null }] }); }
  function histRecTxt(q) { const r = q.rewards || {}; return [r.xp ? '+' + r.xp + ' XP' : '', r.gold ? '+' + r.gold + ' 💰' : '', r.unlockFeature ? (HIST_LIBERA[r.unlockFeature] ? HIST_LIBERA[r.unlockFeature].nome : r.unlockFeature) : ''].filter(Boolean).join(' · '); }
  function histAceita(q) { AR.hist.at = { id: q.id, prog: q.objectives.map(() => 0) }; salvaAR(); som('missao', 1, 1); aviso('📖 Missão da história aceita: ' + q.title, '#ffd23c'); histHud(); }
  function histConclui(q) { const r = q.rewards || {}; AR.hist.feitas.push(q.id); AR.hist.at = null;
    if (r.gold) { AR.inv.moedas = (AR.inv.moedas || 0) + r.gold; atualizaInv(); numero(heroi.position, '+' + r.gold + ' 💰', '#ffd23c', 2.4); }
    if (r.unlockFeature) { AR.hist.libs[r.unlockFeature] = 1; const L = HIST_LIBERA[r.unlockFeature]; if (L) L.fn(); }
    salvaAR(); if (r.xp) ganhaXp(r.xp, true); flash('rgba(120,230,255,.45)'); som('missao_ok', 1, 1); fx('luz', [heroi.position.x, 0, heroi.position.z], 1);
    aviso('🏆 ' + q.title + ' concluída! ' + histRecTxt(q), '#ffd23c'); histHud(); }
  // ---------- HUD da missão ----------
  const histHudEl = document.createElement('div'); histHudEl.id = 'hist-hud'; histHudEl.hidden = true; document.body.appendChild(histHudEl);
  tapBtn(histHudEl, () => histAbre());
  function histHud() { const q = histAtual(); histHudEl.hidden = !q; if (!q) return; const done = histCompleta(), cur = histObjAtual();
    histHudEl.innerHTML = `<b>📖 ${q.title}</b>` + (done ? `<div class="ok">✅ Volte para o ${q.npc}</div>` : q.objectives.map((o, i) => { const n = AR.hist.at.prog[i] || 0, ok = n >= o.count; return `<div class="${ok ? 'ok' : i === cur ? 'cur' : 'nx'}">${ok ? '✅' : i === cur ? '▸' : '◻️'} ${histObjTxt(o)}${o.count > 1 ? ' ' + Math.min(n, o.count) + '/' + o.count : ''}</div>`; }).join('')); }
  // ---------- painel do Modo História (menu da foto) ----------
  const histP = document.createElement('div'); histP.id = 'hist-p'; histP.hidden = true; document.body.appendChild(histP);
  function histAbre() { const at = histAtual(), prox = histProxima();
    histP.innerHTML = `<div class="box"><div class="hd"><b>📖 Modo História</b><button class="x" id="hist-x">✕</button></div><div class="lst">` + HISTORIA.map((q, i) => { const feita = histFeita(q.id), ativa = at && at.id === q.id, trava = !feita && !ativa && (q !== prox || AR.nv < q.levelReq);
      const st = feita ? '<span class="st ok">✅ Concluída</span>' : ativa ? '<span class="st at">▸ Em andamento</span>' : trava ? `<span class="st tr">🔒 ${AR.nv < q.levelReq ? 'Nível ' + q.levelReq : 'Complete a anterior'}</span>` : '<span class="st nv">❗ Disponível</span>';
      return `<div class="cap ${feita ? 'feita' : ''} ${ativa ? 'ativa' : ''}"><div class="t"><small>Capítulo ${i + 1} · Nível ${q.levelReq}</small><b>${q.title}</b>${st}</div><p>${q.description}</p><div class="meta">👤 ${q.npc} · 📍 ${q.location}</div><ul>${q.objectives.map((o, k) => { const ok = feita || (ativa && (at.prog[k] || 0) >= o.count); return `<li class="${ok ? 'ok' : ''}">${ok ? '✅' : '◻️'} ${histObjTxt(o)}</li>`; }).join('')}</ul><div class="rec">🎁 ${histRecTxt(q)}</div></div>`; }).join('') + `</div></div>`;
    histP.hidden = false; tapBtn($('hist-x'), () => { histP.hidden = true; }); }
  // ---------- quadro a quadro: círculo, marcador do mestre, guardião surgindo ----------
  function historiaFrame(dt, p) { const naVila = zona === 'vila' && !dentro;
    // marcador acima do mestre
    const q = histAtual(), prox = histProxima(); let m = null; if (q && q.npc === 'Mestre Ryuken' && histCompleta()) m = '?'; else if (!q && prox && prox.npc === 'Mestre Ryuken' && AR.nv >= prox.levelReq) m = '!';
    RYU.marca.visible = !!m && naVila; if (m) { RYU.marca.material.map = marcaT(m, '#ffd23c'); RYU.marca.position.set(RYU.x, 2.85 + Math.sin(gT * 3) * 0.1, RYU.z); }
    // guardião subindo do chão
    if (GUARD.surge > 0) { GUARD.surge -= dt; GUARD.g.position.y = -Math.max(0, GUARD.surge) * 1.9; }
    // círculo: brilho e canalização
    const obj = q && histObjAtual() >= 0 ? q.objectives[histObjAtual()] : null, quer = !!obj && obj.type === 'INTERACT' && obj.target === 'circulo_runico_praca';
    const precisaGuarda = !!obj && obj.type === 'KILL' && obj.target === 'guardiao_treino' && GUARD.morto;
    SANT.circ.rotation.z += dt * (SANT.canal > 0 ? 2.2 : 0.25); const alvoOp = SANT.canal > 0 ? 1 : (quer || precisaGuarda) ? 0.75 + Math.sin(gT * 3) * 0.2 : 0.4; SANT.cm.opacity += (alvoOp - SANT.cm.opacity) * clamp(dt * 4);
    SANT.colM.opacity += ((SANT.canal > 0 ? 0.22 : SANT.pulso > 0 ? 0.35 : 0) - SANT.colM.opacity) * clamp(dt * 5); SANT.pulso -= dt;
    SANT.parts.forEach(o => { o.k = (o.k + dt * (SANT.canal > 0 ? 0.9 : 0.25)) % 1; o.a += dt * 0.8; o.s.position.set(Math.cos(o.a) * o.r, 0.4 + o.k * (SANT.canal > 0 ? 7 : 2.5), Math.sin(o.a) * o.r); o.s.material.opacity = (quer || precisaGuarda || SANT.canal > 0 ? 0.9 : 0.25) * Math.sin(o.k * Math.PI); });
    const d = Math.hypot(p.x - SANT.x, p.z - SANT.z);
    if (SANT.canal > 0) { if (d > 3.4) { SANT.canal = 0; aviso('A concentração foi quebrada. Fique dentro do círculo.', '#ff9a6a'); return null; } SANT.canal -= dt; mana = Math.max(0, mana - dt * 8); if (Math.random() < dt * 6) numero(heroi.position, '✦', '#7ae8ff', 1.6);
      if (SANT.canal <= 0) { SANT.pulso = 1.2; flash('rgba(120,230,255,.35)'); tremor = 0.35; som('magia', 1, 1.2); if (quer) histProgresso('INTERACT', 'circulo_runico_praca'); const o2 = histAtual() && histObjAtual() >= 0 ? histAtual().objectives[histObjAtual()] : null; if (o2 && o2.type === 'KILL' && o2.target === 'guardiao_treino') setTimeout(guardiaoInvoca, 900); } return null; }
    if (!naVila || d > 3) return null;
    return { rot: quer || precisaGuarda ? 'CONCENTRAR' : 'VER', x: SANT.x, y: 1.4, z: SANT.z, acao: () => {
      if (!(quer || precisaGuarda)) { falar({ nome: 'Círculo Rúnico', falas: [{ n: 'Círculo Rúnico', t: histFeita('mq_05') ? 'As runas brilham calmas. A energia daqui já despertou em você.' : 'Runas antigas brilham no chão. Talvez o Mestre Ryuken saiba o que fazer com elas.' }] }); return; }
      if (mana < 20) { aviso('Você precisa de pelo menos 20 de mana pra concentrar no círculo.', '#ff9a6a'); return; }
      SANT.canal = 2.6; som('magia', 0.8, 0.8); aviso('🔵 Concentrando mana... fique no círculo!', '#7ae8ff'); } }; }
  setTimeout(histHud, 300);
  window.__hist = { GUARD, SANT, RYU, histFala, histAbre, get at() { return AR.hist; } };
