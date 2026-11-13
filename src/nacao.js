  // ===================== BATALHA DE NAÇÃO (Vermelha x Azul) — PvP no Labirinto =====================
  const NACOES = { vermelha: { nome: 'Reino Carmesim', curto: 'Carmesim', cor: '#ff3a4a', cor2: '#7a0a14', ic: '🔴' }, azul: { nome: 'Reino Safira', curto: 'Safira', cor: '#3a8aff', cor2: '#0a2a7a', ic: '🔵' } };
  const NX = 0, NZ = -1400, NCEL = 9, NTAM = 15; // labirinto 15x15 células de 9 m (135 m de lado)
  const NAC = { bid: null, ate: 0, placar: { vermelha: 0, azul: 0 }, cfg: null, aberta: false, convidou: null, ult: null, mortes: 0, abates: 0 };
  // ---------- escolher nação ----------
  const nacP = document.createElement('div'); nacP.id = 'nacao-p'; nacP.hidden = true;
  nacP.innerHTML = '<div class="box"><h2>⚔️ Escolha sua Nação</h2><p>Duas vezes por dia (12h e 20h, horário de Brasília) as nações se enfrentam na <b>Batalha de Nação</b>, num labirinto gigante. Escolha bem: a escolha é pra sempre!</p><div class="nac-cards">' +
    Object.keys(NACOES).map(k => `<button class="nac-card ${k}" data-n="${k}"><span class="nac-esc">${k === 'vermelha' ? '🦁' : '🐉'}</span><b>${NACOES[k].nome}</b><small>${k === 'vermelha' ? 'Fogo, coragem e força. Os guerreiros do sol poente.' : 'Gelo, estratégia e honra. Os guardiões do céu azul.'}</small></button>`).join('') + '</div></div>';
  document.body.appendChild(nacP);
  nacP.querySelectorAll('.nac-card').forEach(b => tapBtn(b, () => { const k = b.dataset.n; AR.nacao = k; salvaAR(); nacP.hidden = true; som('missao_ok', 0.9, 1); flash(k === 'vermelha' ? 'rgba(255,60,70,.35)' : 'rgba(60,140,255,.35)'); aviso(NACOES[k].ic + ' Você agora pertence ao ' + NACOES[k].nome + '!', NACOES[k].cor); }));
  function nacaoPergunta() { if (AR.nacao || !nacP.hidden) return; const ok = (!$('login') || $('login').hidden) && (!$('criar') || $('criar').hidden) && !cenaQ && !conversa; if (ok) nacP.hidden = false; }
  setInterval(nacaoPergunta, 2500);
  // ---------- horário (Brasília = UTC-3) ----------
  function brHora(ms) { const d = new Date(ms - 3 * 3600 * 1000); return { h: d.getUTCHours(), m: d.getUTCMinutes(), dia: d.toISOString().slice(0, 10) }; }
  function nacaoJanela(agora) { if (NAC.cfg && NAC.cfg.ate > agora) return { id: 'm' + NAC.cfg.ini, ate: NAC.cfg.ate };
    if (NAC.cfg && NAC.cfg.parou && agora - NAC.cfg.parou < 25 * 60 * 1000) return null;
    const b = brHora(agora); if ((b.h === 12 || b.h === 20) && b.m < 20) { const ini = agora - (b.m * 60 + new Date(agora).getUTCSeconds()) * 1000 - new Date(agora).getUTCMilliseconds(); return { id: b.dia + '-' + b.h, ate: ini + 20 * 60 * 1000 }; } return null; }
  // ADM: liga/desliga na hora (Firestore config/batalha)
  function nacaoCfgOuve() { if (NAC.cfgOuv || !window.CONTA || !CONTA.db || !CONTA.usuario) return; NAC.cfgOuv = true; CONTA.db.collection('config').doc('batalha').onSnapshot(d => { NAC.cfg = d.exists ? d.data() : null; }, () => {}); }
  function nacaoAdm(liga) { if (!souAdmin() || !window.CONTA || !CONTA.db) return; const now = Date.now(); CONTA.db.collection('config').doc('batalha').set(liga ? { ini: now, ate: now + 20 * 60 * 1000, por: trNome() } : { ate: 0, parou: now }, { merge: false }).then(() => aviso(liga ? '⚔️ Batalha de Nação iniciada por 20 minutos!' : '🛑 Batalha de Nação encerrada.', '#ffd86a')).catch(e => aviso('⚠️ ' + (e.code || e.message), '#ff6a6a')); }
  // ---------- rede (mesmo canal do multiplayer) ----------
  function nacEnvia(ev, payload) { try { if (MP.ok && MP.ch) MP.ch.send({ type: 'broadcast', event: ev, payload }); } catch (e) {} }
  window.__mpOn = ch => {
    ch.on('broadcast', { event: 'nh' }, m => { const d = m.payload; if (!d || d.para !== MP.id || zona !== 'nacao' || desmaiado) return; NAC.ult = d; const n = Math.max(1, Math.min(d.dano, VIDA_MAX * 0.22)); danoHeroi(n, null); fx('fogo', [heroi.position.x, 1.2, heroi.position.z], 0.25); })
      .on('broadcast', { event: 'nm' }, m => nacaoMorteRecebe(m.payload))
      .on('broadcast', { event: 'npq' }, m => { if (m.payload && m.payload.b === NAC.bid) nacEnvia('npr', { b: NAC.bid, p: NAC.placar }); })
      .on('broadcast', { event: 'npr' }, m => { const d = m.payload; if (!d || d.b !== NAC.bid || !d.p) return; ['vermelha', 'azul'].forEach(k => NAC.placar[k] = Math.max(NAC.placar[k], d.p[k] | 0)); }); };
  function nacaoMorteRecebe(d) { if (!d || d.b !== NAC.bid) return; const ganhou = d.na === 'vermelha' ? 'azul' : 'vermelha'; NAC.placar[ganhou]++;
    if (d.porId === MP.id) { NAC.abates++; ganhaXp(60, true); AR.inv.moedas = (AR.inv.moedas || 0) + 150; if (typeof atualizaInv === 'function') atualizaInv(); salvaAR(); aviso('⚔️ Você derrotou ' + String(d.nome || '?').slice(0, 20) + '! +150 moedas · +60 XP', NACOES[AR.nacao] ? NACOES[AR.nacao].cor : '#ffd86a'); som('missao_ok', 0.7, 1.2); }
    else if (zona === 'nacao') aviso((NACOES[ganhou] ? NACOES[ganhou].ic : '') + ' ' + String(d.por || '?').slice(0, 20) + ' derrotou ' + String(d.nome || '?').slice(0, 20), NACOES[ganhou] ? NACOES[ganhou].cor : '#fff'); }
  // ---------- labirinto (igual pra todo mundo: semente fixa) ----------
  const LAB = (() => { let sd = 20261113; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const V = []; for (let i = 0; i < NTAM; i++) { V.push([]); for (let j = 0; j < NTAM; j++) V[i].push({ n: 1, s: 1, l: 1, o: 1, vis: 0 }); }
    const pilha = [[0, 0]]; V[0][0].vis = 1; while (pilha.length) { const [i, j] = pilha[pilha.length - 1]; const viz = [[i - 1, j, 'n', 's'], [i + 1, j, 's', 'n'], [i, j - 1, 'o', 'l'], [i, j + 1, 'l', 'o']].filter(([a, b]) => a >= 0 && b >= 0 && a < NTAM && b < NTAM && !V[a][b].vis);
      if (!viz.length) { pilha.pop(); continue; } const [a, b, p1, p2] = viz[Math.floor(rnd() * viz.length)]; V[i][j][p1] = 0; V[a][b][p2] = 0; V[a][b].vis = 1; pilha.push([a, b]); }
    // abre atalhos e salões pra ter vários caminhos e lugares de duelo
    for (let k = 0; k < 70; k++) { const i = 1 + Math.floor(rnd() * (NTAM - 2)), j = 1 + Math.floor(rnd() * (NTAM - 2)); if (rnd() < 0.5) { V[i][j].l = 0; V[i][j + 1].o = 0; } else { V[i][j].s = 0; V[i + 1][j].n = 0; } }
    [[7, 7], [3, 11], [11, 3], [0, 0], [NTAM - 1, NTAM - 1]].forEach(([ci, cj]) => { for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) { if (i < 0 || j < 0 || i >= NTAM || j >= NTAM) continue; if (i < ci + 1 && i + 1 < NTAM && i + 1 <= ci + 1) { V[i][j].s = 0; V[i + 1][j].n = 0; } if (j < cj + 1 && j + 1 < NTAM) { V[i][j].l = 0; V[i][j + 1].o = 0; } } });
    const L = NTAM * NCEL, x0 = NX - L / 2, z0 = NZ - L / 2, ALT = 4.2, ESP = 0.8; const W = [];
    const add = (x, z, w, d) => W.push({ x, z, hw: w / 2, hd: d / 2 });
    for (let i = 0; i < NTAM; i++) for (let j = 0; j < NTAM; j++) { const c = V[i][j], cx = x0 + j * NCEL, cz = z0 + i * NCEL;
      if (c.n && i === 0) add(cx + NCEL / 2, cz, NCEL + ESP, ESP); if (c.o && j === 0) add(cx, cz + NCEL / 2, ESP, NCEL + ESP);
      if (c.s) add(cx + NCEL / 2, cz + NCEL, NCEL + ESP, ESP); if (c.l) add(cx + NCEL, cz + NCEL / 2, ESP, NCEL + ESP); }
    const G = grp(world, 0, 0, 0); G.visible = false;
    const pisoT = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#4a4650'; x.fillRect(0, 0, 128, 128); for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) { x.fillStyle = (a + b) % 2 ? '#56525c' : '#423e48'; x.fillRect(a * 64 + 2, b * 64 + 2, 60, 60); } const t = new T3.CanvasTexture(c); t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set((L + 300) / 6, (L + 300) / 6); t.colorSpace = T3.SRGBColorSpace; return t; })();
    const piso = new T3.Mesh(new T3.PlaneGeometry(L + 300, L + 300), new T3.MeshStandardMaterial({ map: pisoT, roughness: 0.95 })); piso.rotation.x = -Math.PI / 2; piso.position.set(NX, 0.01, NZ); piso.receiveShadow = true; G.add(piso);
    const muroM = new T3.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }); const im = new T3.InstancedMesh(BOX, muroM, W.length); const dm = new T3.Object3D(); const cor = new T3.Color();
    W.forEach((w, k) => { dm.position.set(w.x, ALT / 2, w.z); dm.scale.set(w.hw * 2, ALT, w.hd * 2); dm.updateMatrix(); im.setMatrixAt(k, dm.matrix);
      const dr = Math.hypot(w.x - (x0 + NCEL / 2), w.z - (z0 + NCEL / 2)), da = Math.hypot(w.x - (x0 + L - NCEL / 2), w.z - (z0 + L - NCEL / 2)); const t = Math.max(0, 1 - Math.min(dr, da) / 45);
      cor.set('#8a8290').lerp(new T3.Color(dr < da ? '#b83a44' : '#3a6ab8'), t * 0.8); im.setColorAt(k, cor); });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.castShadow = true; im.receiveShadow = true; G.add(im);
    // tochas nas paredes e bandeiras nas bases
    for (let k = 0; k < W.length; k += 6) { const w = W[k]; const s = glowSpr(G, w.x, ALT + 0.4, w.z, 2.2, '#ffb050', 0.55); part(G, SPH, '#ffd890', w.x, ALT + 0.25, w.z, 0.14, 0.2, 0.14, 0, true); }
    const bases = { vermelha: [x0 + NCEL, z0 + NCEL], azul: [x0 + L - NCEL, z0 + L - NCEL] };
    Object.keys(bases).forEach(k => { const [bx, bz] = bases[k], N = NACOES[k]; const anel = new T3.Mesh(new T3.RingGeometry(3, 3.6, 40), new T3.MeshBasicMaterial({ color: N.cor, transparent: true, opacity: 0.7, side: T3.DoubleSide, toneMapped: false })); anel.rotation.x = -Math.PI / 2; anel.position.set(bx, 0.03, bz); G.add(anel);
      [[-2.6, -2.6], [2.6, 2.6], [-2.6, 2.6], [2.6, -2.6]].forEach(([ox, oz]) => { part(G, CYL, '#3a3040', bx + ox, 2, bz + oz, 0.08, 4, 0.08); const b = new T3.Mesh(new T3.PlaneGeometry(1.2, 1.6), new T3.MeshStandardMaterial({ color: N.cor, side: T3.DoubleSide, emissive: N.cor2, emissiveIntensity: 0.5 })); b.position.set(bx + ox + 0.62, 3.2, bz + oz); G.add(b); });
      glowSpr(G, bx, 1.2, bz, 7, N.cor, 0.35); });
    // centro: arena com cristal
    const cc = [x0 + 7.5 * NCEL, z0 + 7.5 * NCEL]; const cri = new T3.Mesh(new T3.OctahedronGeometry(1.2, 0), new T3.MeshStandardMaterial({ color: '#ffd86a', emissive: '#ffb020', emissiveIntensity: 0.9, flatShading: true })); cri.position.set(cc[0], 3.2, cc[1]); G.add(cri); glowSpr(G, cc[0], 3.2, cc[1], 6, '#ffd86a', 0.45);
    return { G, W, bases, x0, z0, L, cri }; })();
  function nacaoLimita(p) { const r = 0.4; if (p.y < 4.1) LAB.W.forEach(w => { const dx = p.x - w.x, dz = p.z - w.z; if (Math.abs(dx) > w.hw + r || Math.abs(dz) > w.hd + r) return; const px = w.hw + r - Math.abs(dx), pz = w.hd + r - Math.abs(dz); if (px < pz) p.x += Math.sign(dx || 1) * px; else p.z += Math.sign(dz || 1) * pz; });
    p.x = clamp(p.x, LAB.x0 - 140, LAB.x0 + LAB.L + 140); p.z = clamp(p.z, LAB.z0 - 140, LAB.z0 + LAB.L + 140); }
  // ---------- entrar / sair ----------
  function nacaoBase() { const [bx, bz] = LAB.bases[AR.nacao] || LAB.bases.vermelha; return [bx + (Math.random() - 0.5) * 3, bz + (Math.random() - 0.5) * 3]; }
  function nacaoEntra() { nacConv.hidden = true; if (!AR.nacao) { nacP.hidden = false; return; } if (!NAC.aberta) { aviso('⚔️ A Batalha de Nação acontece às 12h e às 20h (horário de Brasília).', '#ffd86a'); return; } if (Q.naCarroca || conversa) return;
    if (typeof CAL !== 'undefined' && CAL.on) { calLimpa(); CAL.on = false; CALG.visible = false; } if (montado) montar(false); if (voando) voa(false);
    cena([{ t: '⚔️ Indo para o Labirinto da Batalha de Nação...', v: null }], () => { dentro = false; zona = 'nacao'; const [x, z] = nacaoBase(); heroi.position.set(x, 0, z); facing = AR.nacao === 'azul' ? Math.PI * 1.25 : Math.PI * 0.25; camYaw = 0; cam.position.set(x + Math.sin(facing) * -4, 4, z + Math.cos(facing) * -4); vida = VIDA_MAX; mana = MANA_MAX; som('portal', 0.9, 0.9); mostrarLugar('Labirinto da Batalha de Nação'); nacEnvia('npq', { b: NAC.bid }); aviso(NACOES[AR.nacao].ic + ' Derrote os jogadores da outra nação! Cada abate vale 1 ponto.', NACOES[AR.nacao].cor); }); }
  function nacaoSai(fim) { if (zona !== 'nacao') return; zona = 'vila'; dentro = false; heroi.position.set(PRACA.x, 0, PRACA.z + 8); facing = Math.PI; camYaw = 0; vida = VIDA_MAX; if (fim) { const p = NAC.placar, v = p.vermelha === p.azul ? null : p.vermelha > p.azul ? 'vermelha' : 'azul';
      cena([{ t: '🏁 Fim da Batalha de Nação!  🔴 ' + p.vermelha + ' x ' + p.azul + ' 🔵', v: null }, { t: v ? NACOES[v].ic + ' Vitória do ' + NACOES[v].nome + '!' + (v === AR.nacao ? ' Sua nação venceu! +500 moedas' : '') : 'Empate! As duas nações lutaram com honra.', v: null }], () => { if (v && v === AR.nacao) { AR.inv.moedas = (AR.inv.moedas || 0) + 500; salvaAR(); if (typeof atualizaInv === 'function') atualizaInv(); } mostrarLugar('Praça dos Aventureiros'); }); } }
  function nacaoMorre() { const u = NAC.ult; NAC.mortes++; nacEnvia('nm', { b: NAC.bid, na: AR.nacao, nome: trNome(), por: u ? u.nome : '', porId: u ? u.de : '' }); nacaoMorteRecebe({ b: NAC.bid, na: AR.nacao, nome: trNome(), por: u ? u.nome : '?', porId: u ? u.de : '' });
    NAC.ult = null; flash('rgba(0,0,0,.6)'); som('desmaio', 0.8, 1); const [x, z] = nacaoBase(); heroi.position.set(x, 0, z); vida = VIDA_MAX; mana = MANA_MAX; aviso('💀 Você caiu! Voltou pra base da sua nação.', '#ff8a8a'); }
  // ataque em outro jogador (quando você ataca no labirinto)
  function nacaoAtk() { if (zona !== 'nacao' || !AR.nacao) return; const A = ARMAS[AR.arma] || ARMAS.punho, p = heroi.position, alc = A.longe ? 16 : 3.2; let alvo = null, md = alc;
    Object.keys(MP.outros).forEach(id => { const o = MP.outros[id]; if (!o.d || o.d.z !== 'nacao' || !o.d.na || o.d.na === AR.nacao) return; const d = Math.hypot(o.x - p.x, o.z - p.z); if (d < md) { md = d; alvo = { id, o }; } });
    if (!alvo) return; facing = Math.atan2(alvo.o.x - p.x, alvo.o.z - p.z); const cr = critico(); const n = Math.round(((A.dano || 10) * atkMult() * (cr ? 1.8 : 1)) * 0.5);
    setTimeout(() => { nacEnvia('nh', { de: MP.id, para: alvo.id, dano: n, nome: trNome() }); numero(alvo.o.c.position, (cr ? '💥' : '') + n, cr ? '#ffd23c' : '#ffffff', 2); fx('luz', [alvo.o.x, 1.2, alvo.o.z], 0.25); }, A.longe ? 250 : 120); }
  // ---------- HUD ----------
  const nacHud = document.createElement('div'); nacHud.id = 'nacao-hud'; nacHud.hidden = true; document.body.appendChild(nacHud);
  const nacConv = document.createElement('div'); nacConv.id = 'nacao-conv'; nacConv.hidden = true; nacConv.innerHTML = '<b>⚔️ A Batalha de Nação começou!</b><small>Labirinto gigante: Reino Carmesim 🔴 x 🔵 Reino Safira</small><div><button class="sim">Entrar</button><button class="nao">Agora não</button></div>'; document.body.appendChild(nacConv);
  tapBtn(nacConv.querySelector('.sim'), () => { nacConv.hidden = true; nacaoEntra(); }); tapBtn(nacConv.querySelector('.nao'), () => { nacConv.hidden = true; });
  let nacT = 0;
  function nacaoFrame(dt, p) { LAB.G.visible = zona === 'nacao'; if (zona === 'nacao') { LAB.cri.rotation.y += dt; } nacT -= dt; if (nacT > 0) return; nacT = 0.5; nacaoCfgOuve();
    const agora = Date.now(), J = nacaoJanela(agora), antes = NAC.aberta; NAC.aberta = !!J;
    if (J && J.id !== NAC.bid) { NAC.bid = J.id; NAC.placar = { vermelha: 0, azul: 0 }; NAC.abates = 0; NAC.mortes = 0; }
    if (J) NAC.ate = J.ate;
    if (NAC.aberta && !antes && zona !== 'nacao' && AR.nacao && NAC.convidou !== NAC.bid) { NAC.convidou = NAC.bid; nacConv.hidden = false; som('missao', 0.9, 1); }
    if (!NAC.aberta && antes) { nacConv.hidden = true; if (zona === 'nacao') nacaoSai(true); }
    if (!NAC.aberta && zona === 'nacao') nacaoSai(false);
    nacHud.hidden = zona !== 'nacao'; if (!nacHud.hidden) { const s = Math.max(0, Math.floor((NAC.ate - agora) / 1000)); nacHud.innerHTML = `<span class="v">🔴 ${NAC.placar.vermelha}</span><span class="t">⏳ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</span><span class="a">${NAC.placar.azul} 🔵</span><small>Seus abates: ${NAC.abates}</small>`; } }
  // ---------- Mestre Kaelen: Batalha de Nação ----------
  function falaKaelenNacao() { const N = 'Mestre Kaelen'; const na = NACOES[AR.nacao]; const prox = (() => { const b = brHora(Date.now()); return b.h < 12 ? '12h' : b.h < 20 ? '20h' : '12h de amanhã'; })();
    falar({ nome: N, falas: [{ n: N, t: NAC.aberta ? '⚔️ A Batalha de Nação está acontecendo agora! O labirinto espera por você.' : 'A Batalha de Nação acontece às 12h e às 20h (Brasília). A próxima é às ' + prox + '.' }],
      escolhas: () => [NAC.aberta ? { t: '⚔️ <b>Entrar na Batalha</b><small>' + (na ? na.ic + ' ' + na.nome : 'Escolha sua nação') + '</small>', fn: nacaoEntra } : null, { t: '⚡ <b>Modos de Batalha</b><small>Liberar os modos II e III</small>', fn: falaKaelen },
        !AR.nacao ? { t: '🏳️ <b>Escolher minha nação</b>', fn: () => { nacP.hidden = false; } } : null,
        souAdmin() ? (NAC.aberta ? { t: '🛑 <b>Encerrar a batalha agora</b><small>Só administrador</small>', fn: () => nacaoAdm(false) } : { t: '🟢 <b>Iniciar batalha agora</b><small>Só administrador · 20 minutos</small>', fn: () => nacaoAdm(true) }) : null, { t: 'Agora não', fn: null }].filter(Boolean) }); }
