  // ===================== SIMULAÇÃO 10 x 10 da Batalha de Nação (só ADM, roda só no seu aparelho) =====================
  const SIM = { on: false, bots: [], cfg: null, guerra: false, feed: [], entrou: false, alvoT: 0 };
  const SIM_NOMES = { vermelha: ['Brasa', 'Ignis', 'Rubi', 'Fênix', 'Labareda', 'Pyro', 'Escarlate', 'Vulcano', 'Chama', 'Magma'], azul: ['Cristal', 'Neve', 'Safiro', 'Aurora', 'Glacius', 'Brisa', 'Frost', 'Iceberg', 'Celeste', 'Geada'] };
  const SIM_ROUPA = { vermelha: ['#b8232e', '#7a1018'], azul: ['#2456b8', '#143a7a'] };
  const simFeedEl = document.createElement('div'); simFeedEl.id = 'sim-feed'; simFeedEl.hidden = true; document.body.appendChild(simFeedEl);
  const simRes = document.createElement('div'); simRes.id = 'sim-res'; simRes.hidden = true; document.body.appendChild(simRes);
  function simCelula(x, z) { return [clamp(Math.floor((z - LAB.z0) / NCEL), 0, NTAM - 1), clamp(Math.floor((x - LAB.x0) / NCEL), 0, NTAM - 1)]; }
  function simCentro(k) { const i = (k / NTAM) | 0, j = k % NTAM; return [LAB.x0 + j * NCEL + NCEL / 2, LAB.z0 + i * NCEL + NCEL / 2]; }
  function simBfs(a, b) { const V = LAB.V, N = NTAM, ka = a[0] * N + a[1], kb = b[0] * N + b[1]; if (ka === kb) return []; const prev = new Int16Array(N * N).fill(-1); const q = [ka]; prev[ka] = ka; let h = 0;
    while (h < q.length) { const k = q[h++]; if (k === kb) break; const i = (k / N) | 0, j = k % N, c = V[i][j]; const nb = []; if (!c.n && i > 0) nb.push(k - N); if (!c.s && i < N - 1) nb.push(k + N); if (!c.o && j > 0) nb.push(k - 1); if (!c.l && j < N - 1) nb.push(k + 1); for (const m of nb) if (prev[m] < 0) { prev[m] = k; q.push(m); } }
    if (prev[kb] < 0) return []; const path = []; let k = kb; while (k !== ka) { path.push(k); k = prev[k]; } return path.reverse(); }
  function simBase(na) { const [bx, bz] = LAB.bases[na]; return [bx + (Math.random() - 0.5) * 4, bz + (Math.random() - 0.5) * 4]; }
  function simCasa(i) { const a = (i / 20) * Math.PI * 2 + Math.random() * 0.2, r = 6 + (i % 3) * 2.5; const c = SIM.centro || [PRACA.x, PRACA.z + 8]; return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]; }
  function simCria() { simLimpa(); SIM.on = true; SIM.centro = zona === 'vila' && !dentro ? [heroi.position.x, heroi.position.z] : [PRACA.x, PRACA.z + 8]; SIM.feed = []; let n = 0;
    ['vermelha', 'azul'].forEach(na => { const qt = AR.nacao === na ? 9 : 10; for (let k = 0; k < qt; k++) { const id = 'bot' + na[0] + k, h = mpHash(id), R = SIM_ROUPA[na];
      const c = makeChar({ skin: MP_PELE[(h >> 3) % MP_PELE.length], hairStyle: ['short', 'long', 'short', 'bald'][(h >> 5) % 4], hairC: MP_CAB[(h >> 7) % MP_CAB.length], top: R[0], top2: R[1], pants: '#2a2630', shoe: '#1a1414', iris: '#3a2a1a', s: 0.82, ph: (h % 100) / 10 });
      c.traverse(o => { if (o.isMesh) o.castShadow = true; }); const sw = grp(c.userData.P.elR, 0, -0.33, 0.05); tb(sw, 0, 0, 0.5, 0.06, 0.02, 0.75, na === 'azul' ? '#9ae6ff' : '#ffb070'); tb(sw, 0, 0, 0.1, 0.22, 0.04, 0.04, '#e2c27a');
      world.add(c); const tag = document.createElement('div'); tag.className = 'mp-tag sim-tag'; mpTags.appendChild(tag);
      const [x, z] = simCasa(n++); const lv = 20 + (h % 60); SIM.bots.push({ id, nome: SIM_NOMES[na][k], na, lv, c, tag, x, z, y: 0, r: Math.random() * 6, home: [x, z], tx: x, tz: z, loc: 'vila', hpMax: 110 + lv, hp: 110 + lv, dano: 8 + (h % 7), vel: 4 + (h % 9) / 10, cd: 0, morto: 0, abates: 0, mortes: 0, a: 'parado', aT: 0, path: [], pT: 0, alvo: null, obj: null, indo: 0, voa: false, cora: (h % 3) === 0, ph: (h % 100) / 10 }); } });
    aviso('🧪 Simulação criada: 10 🔴 x 10 🔵 na praça! Fale com o Mestre Kaelen pra abrir a guerra de teste.', '#ffd86a'); }
  function simLimpa() { SIM.bots.forEach(b => { world.remove(b.c); b.tag.remove(); }); SIM.bots = []; SIM.on = false; SIM.guerra = false; simFeedEl.hidden = true; }
  function simGuerra(min, premio) { if (!SIM.on) simCria(); const now = Date.now(); SIM.cfg = { ini: now, ate: now + min * 60000 }; SIM.premio = premio || { tipo: 'voo' }; SIM.entrou = false; aviso('⚔️ Guerra de teste aberta por ' + min + ' minutos! Prêmio: ' + premioTxt(SIM.premio), '#ffd86a'); }
  function simPara() { if (SIM.cfg) SIM.cfg.ate = Date.now() - 1; try { if (NAC.cfg && NAC.cfg.sim && NAC.cfg.ate > Date.now() && window.CONTA && CONTA.db) CONTA.db.collection('config').doc('batalha').set({ ate: 0, parou: Date.now() }, { merge: true }); } catch (e) {} }
  function simFeed(txt) { SIM.feed.unshift(txt); SIM.feed.length = Math.min(SIM.feed.length, 4); simFeedEl.innerHTML = SIM.feed.map(t => '<div>' + t + '</div>').join(''); }
  function simNome(o) { return o === 'hero' ? trNome() : o.nome; }
  function simNa(o) { return o === 'hero' ? AR.nacao : o.na; }
  // dano num bot
  function simDano(b, n, de) { if (b.morto > 0 || b.loc !== 'nacao') return; b.hp -= n; b.hitT = 0.25; if (zona === 'nacao' && b.c.visible && Math.hypot(b.x - heroi.position.x, b.z - heroi.position.z) < 25) numero(b.c.position, String(Math.round(n)), de === 'hero' ? '#ffffff' : (NACOES[simNa(de)] || {}).cor || '#fff', 2);
    if (b.hp > 0) return; b.morto = 4; b.mortes++; b.c.visible = false; b.tag.hidden = true; const dn = simNa(de);
    if (de === 'hero') nacaoMorteRecebe({ b: NAC.bid, na: b.na, nome: b.nome, por: trNome(), porId: MP.id }); else { de.abates++; NAC.placar[dn]++; }
    simFeed(`<b style="color:${NACOES[dn].cor}">${simNome(de)}</b> ⚔️ <b style="color:${NACOES[b.na].cor}">${b.nome}</b>`); }
  function simAbateBot(porId, vitima) { const b = SIM.bots.find(x => x.id === porId); if (!b) return; b.abates++; simFeed(`<b style="color:${NACOES[b.na].cor}">${b.nome}</b> ⚔️ <b style="color:${NACOES[AR.nacao].cor}">${vitima}</b>`); }
  // o herói procura o bot inimigo mais perto pra atacar
  function simAlvoHeroi(p, alc) { let r = null, md = alc; if (!SIM.on) return null; SIM.bots.forEach(b => { if (b.loc !== 'nacao' || b.morto > 0 || b.na === AR.nacao) return; const d = Math.hypot(b.x - p.x, b.z - p.z); if (d < md) { md = d; r = { b, d }; } }); return r; }
  function simTag(b) { const N = NACOES[b.na], hp = b.loc === 'nacao' ? `<span class="sim-hp"><i style="width:${Math.max(0, b.hp / b.hpMax * 100).toFixed(0)}%;background:${N.cor}"></i></span>` : '';
    const em = b.indo > 0 ? '<em class="sim-ok">✅ Aceitou a batalha!</em>' : b.voa ? '<em class="sim-ok">' + premioTxt(NAC.premio) + '</em>' : '';
    const k = em + b.nome + b.lv + hp; if (b.tag.dataset.k === k) return; b.tag.dataset.k = k; b.tag.innerHTML = `${em}<b style="color:${N.cor}">${b.nome} <i>Nv ${b.lv}</i></b>${hp}`; }
  function simAnda(b, tx, tz, vel, dt) { const dx = tx - b.x, dz = tz - b.z, d = Math.hypot(dx, dz); if (d < 0.05) return d; const s = Math.min(d, vel * dt); b.x += dx / d * s; b.z += dz / d * s; b.r = Math.atan2(dx, dz); return d; }
  function simFrame(dt, p) { if (!SIM.on) return; const guerra = NAC.aberta;
    if (guerra && !SIM.guerra) { SIM.guerra = true; NAC.placar = NAC.placar || { vermelha: 0, azul: 0 }; SIM.bots.forEach((b, i) => { b.voa = b.flutua = false; b.indo = 0.8 + i * 0.22 + Math.random() * 1.6; }); simFeedEl.hidden = false; SIM.feed = []; simFeedEl.innerHTML = ''; }
    if (!guerra && SIM.guerra) simFim();
    if (zona === 'nacao' && SIM.guerra) SIM.entrou = true;
    const inimigosDe = na => { const L = SIM.bots.filter(o => o.loc === 'nacao' && o.morto <= 0 && o.na !== na); return L; };
    SIM.bots.forEach(b => { b.aT -= dt; b.hitT = (b.hitT || 0) - dt;
      if (b.loc === 'vila') {
        if (b.indo > 0) { b.indo -= dt; b.a = 'parado'; if (b.indo <= 0) { if (zona === 'vila' && b.c.visible) fx('luz', [b.x, 0, b.z], 0.5); const [x, z] = simBase(b.na); b.x = x; b.z = z; b.loc = 'nacao'; b.hp = b.hpMax; b.morto = 0; b.path = []; b.alvo = null; b.obj = null; } }
        else if (b.flutua) { b.a = 'paira'; b.y = 1.3 + Math.sin(gT * 1.5 + b.ph) * 0.25; b.r += dt * 0.3; }
        else { if (Math.hypot(b.tx - b.x, b.tz - b.z) < 0.3) { if (Math.random() < dt * 0.4) { b.tx = b.home[0] + (Math.random() - 0.5) * 6; b.tz = b.home[1] + (Math.random() - 0.5) * 6; } b.a = 'parado'; } else { simAnda(b, b.tx, b.tz, 1.4, dt); b.a = 'anda'; } b.y = 0; }
      } else if (b.loc === 'nacao') {
        if (b.morto > 0) { b.morto -= dt; if (b.morto <= 0) { const [x, z] = simBase(b.na); b.x = x; b.z = z; b.hp = b.hpMax; b.path = []; b.alvo = null; } }
        else {
          const [bx, bz] = LAB.bases[b.na]; if (Math.hypot(b.x - bx, b.z - bz) < 4) b.hp = Math.min(b.hpMax, b.hp + 25 * dt);
          b.pT -= dt; b.cd -= dt;
          if (b.pT <= 0) { b.pT = 0.5 + Math.random() * 0.3; let md = 45, al = null; inimigosDe(b.na).forEach(o => { const d = Math.hypot(o.x - b.x, o.z - b.z); if (d < md) { md = d; al = o; } });
            if (zona === 'nacao' && AR.nacao && AR.nacao !== b.na && !desmaiado) { const d = Math.hypot(p.x - b.x, p.z - b.z); if (d < md) { md = d; al = 'hero'; } }
            b.fuga = b.cora && b.hp < b.hpMax * 0.3; b.alvo = b.fuga ? null : al;
            const ax = b.alvo === 'hero' ? p.x : b.alvo ? b.alvo.x : 0, az = b.alvo === 'hero' ? p.z : b.alvo ? b.alvo.z : 0;
            let destino; if (b.fuga) destino = simCelula(bx, bz); else if (b.alvo) destino = simCelula(ax, az); else { if (!b.obj || simCelula(b.x, b.z).join() === b.obj.join()) { const r = Math.random(); const [ox, oz] = r < 0.4 ? [LAB.x0 + LAB.L / 2, LAB.z0 + LAB.L / 2] : r < 0.75 ? LAB.bases[b.na === 'azul' ? 'vermelha' : 'azul'] : [LAB.x0 + Math.random() * LAB.L, LAB.z0 + Math.random() * LAB.L]; b.obj = simCelula(ox, oz); } destino = b.obj; }
            b.path = simBfs(simCelula(b.x, b.z), destino); }
          const ax = b.alvo === 'hero' ? p.x : b.alvo ? b.alvo.x : null, az = b.alvo === 'hero' ? p.z : b.alvo ? b.alvo.z : null;
          if (b.alvo && b.alvo !== 'hero' && (b.alvo.morto > 0 || b.alvo.loc !== 'nacao')) b.alvo = null;
          if (b.alvo === 'hero' && (zona !== 'nacao' || desmaiado)) b.alvo = null;
          const dAl = b.alvo ? Math.hypot(ax - b.x, az - b.z) : 99;
          if (b.alvo && dAl < 1.9) { b.r = Math.atan2(ax - b.x, az - b.z); if (b.cd <= 0) { b.cd = 0.85 + Math.random() * 0.45; b.aT = 0.35; const cr = Math.random() < 0.1; const n = b.dano * (0.8 + Math.random() * 0.4) * (cr ? 1.8 : 1);
              if (b.alvo === 'hero') { NAC.ult = { nome: b.nome, de: b.id }; danoHeroi(Math.max(1, Math.min(Math.round(n), VIDA_MAX * 0.22)), null); } else simDano(b.alvo, n, b); }
            b.a = b.aT > 0 ? 'atk' : 'parado'; }
          else { let tx, tz; if (b.alvo && (dAl < NCEL * 0.9 || !b.path.length)) { tx = ax; tz = az; } else if (b.path.length) { [tx, tz] = simCentro(b.path[0]); if (Math.hypot(tx - b.x, tz - b.z) < 1.2) { b.path.shift(); if (b.path.length) [tx, tz] = simCentro(b.path[0]); } } else { tx = b.x; tz = b.z; }
            const d = simAnda(b, tx, tz, b.vel * (b.fuga ? 1.15 : 1), dt); const q = { x: b.x, z: b.z, y: 0 }; nacaoLimita(q); b.x = q.x; b.z = q.z; b.a = d > 0.1 ? 'corre' : 'parado'; }
          b.y = 0; } }
      // desenho
      const vis = b.morto <= 0 && ((b.loc === 'vila' && zona === 'vila' && !dentro) || (b.loc === 'nacao' && zona === 'nacao')); b.c.visible = vis;
      if (!vis) { b.tag.hidden = true; return; }
      b.c.position.set(b.x, b.y, b.z); b.c.rotation.y = b.r; const P = b.c.userData.P;
      if (b.a === 'paira') pose(b.c, gT, { mood: 'smile', arms: { shL: [-0.35, 0, -0.55], shR: [-0.35, 0, 0.55], elL: [-0.5, 0, 0], elR: [-0.5, 0, 0] }, legs: { thL: -0.25, knL: 0.5, thR: 0.1, knR: 0.35 } });
      else if (b.a === 'corre' || b.a === 'anda') pose(b.c, gT + b.ph, b.a === 'corre' ? { run: true, mood: 'smile' } : { walk: true, mood: 'neutral' }); else pose(b.c, gT, { mood: b.a === 'atk' ? 'smile' : 'neutral' });
      if (b.a === 'atk') P.shR.rotation.x = -1.6 + Math.sin(gT * 18) * 0.9;
      const dd = Math.hypot(b.x - p.x, b.z - p.z); if (dd > 26) { b.tag.hidden = true; return; } simTag(b); guildPosition(b.tag, b.c, 1.75); b.tag.style.transform = 'translate(-50%,-100%) scale(' + clamp(1.15 - dd / 26, 0.5, 1).toFixed(2) + ')'; b.tag.style.zIndex = String(100 - Math.round(dd)); });
    simFeedEl.hidden = !SIM.guerra || !SIM.feed.length; }
  function simFim() { SIM.guerra = false; const pl = NAC.placar, v = pl.vermelha === pl.azul ? null : pl.vermelha > pl.azul ? 'vermelha' : 'azul';
    SIM.bots.forEach((b, i) => { b.loc = 'vila'; b.indo = 0; b.morto = 0; b.hp = b.hpMax; const [x, z] = simCasa(i); b.x = b.tx = x; b.z = b.tz = z; b.home = [x, z]; b.voa = !!v && b.na === v; b.flutua = b.voa && (!NAC.premio || NAC.premio.tipo === 'voo'); });
    const lista = SIM.bots.map(b => ({ n: b.nome, na: b.na, a: b.abates, m: b.mortes })); if (SIM.entrou && AR.nacao) lista.push({ n: trNome() + ' (você)', na: AR.nacao, a: NAC.abates, m: NAC.mortes });
    lista.sort((a, b) => b.a - a.a || a.m - b.m); const ganhei = v && v === AR.nacao && SIM.entrou; if (ganhei) nacaoDaPremio(NAC.premio);
    setTimeout(() => { simRes.innerHTML = `<div class="box"><h2>🏁 Resultado da Batalha de Nação</h2><div class="sim-pl"><span style="color:${NACOES.vermelha.cor}">🔴 ${pl.vermelha}</span> x <span style="color:${NACOES.azul.cor}">${pl.azul} 🔵</span></div>
      <p class="sim-v">${v ? `<img src="icones/nac_${v}_br.png" alt=""> Vitória do <b style="color:${NACOES[v].cor}">${NACOES[v].nome}</b>!<br>🏆 Prêmio: <b>${premioTxt(NAC.premio)}</b> para os guerreiros do ${NACOES[v].curto}${ganhei ? ' — inclusive você!' : ''}` : 'Empate! Ninguém levou o prêmio desta vez: ' + premioTxt(NAC.premio) + '.'}</p>
      <table><tr><th>#</th><th>Guerreiro</th><th>⚔️</th><th>💀</th></tr>${lista.slice(0, 8).map((l, i) => `<tr><td>${i === 0 ? '👑' : i + 1}</td><td style="color:${NACOES[l.na].cor}">${l.n}</td><td>${l.a}</td><td>${l.m}</td></tr>`).join('')}</table>
      <button class="cb" id="sim-ok">Fechar</button></div>`; simRes.hidden = false; tapBtn($('sim-ok'), () => { simRes.hidden = true; }); }, zona === 'nacao' ? 4500 : 600); }
  function nacaoPremioVoo() { if (AR.vooNacao) { aviso('🪽 Sua nação venceu! Você continua com o direito de voar.', '#c8f0ff'); return; } AR.vooNacao = true; salvaAR(); flash('rgba(160,220,255,.4)'); som('missao_ok', 1, 1.1); aviso('🪽 Sua nação venceu! Você ganhou o DIREITO DE VOAR! Equipe umas asas e toque 2x em PULAR.', '#c8f0ff'); }
