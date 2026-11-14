  // ===================== RANKING DE PODER (top 10) + MONUMENTO DOS TOP 3 NA VILA =====================
  // Cada jogador grava o próprio poder (e o visual) no perfil público (perfis/{uid}); o ranking lê os 10 maiores.
  // poder calculado só com o que fica salvo (arma, atributos, roupa, nível, divino): assim o painel do ADM calcula igual pra quem está offline
  function poderDe(A) { A = A || {}; const at = A.attr || {}, W = ARMAS[A.arma] || {}, F = FANT[A.fantasia] || {};
    const dano = (W.dano || 10) * (1 + (at.for || 0) * 0.006), vida = 115 + (at.vit || 0) * 2, mana = 115 + (at.int || 0) * 2, def = Math.min(85, (F.def || 0) + (at.def || 0) * 0.08);
    return Math.round(dano * 15 + vida * 3 + mana * 1.5 + def * 30 + (A.nv || 1) * 45 + (A.divino ? 900 : 0)); }
  function meuPoder() { try { return poderDe(AR); } catch (e) { return (AR.nv || 1) * 45; } }
  function rankDia() { return new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10); } // dia em Brasília: o ranking vira à meia-noite
  const rkChave = () => 'aetherion-rank-dia-' + (window.CONTA && CONTA.usuario ? CONTA.usuario.uid : '');
  function rankCampos() { const o = { poder: meuPoder(), na: AR.nacao || '', st: typeof meuCargo === 'function' ? meuCargo() : '' }; const d = rankDia();
    // a foto do dia (poder + visual) só é tirada uma vez por dia, na 1ª vez depois da meia-noite: roupa nova aparece no ranking no dia seguinte
    let ja = '', jaF = 0; try { ja = localStorage.getItem(rkChave()) || ''; jaF = +localStorage.getItem(rkChave() + '-f') || 0; } catch (e) {} const forca = RK.forcar && RK.forcar > jaF; if (ja !== d || forca) { try { const V = visAtual(); if (V.k) { o.dia = d; o.poderDia = o.poder; o.nomeDia = trNome(); o.nvDia = AR.nv || 1; o.naDia = o.na; o.stDia = o.st; o.visDia = { k: V.k, c: V.c }; try { localStorage.setItem(rkChave(), d); if (RK.forcar) localStorage.setItem(rkChave() + '-f', RK.forcar); } catch (e) {} } } catch (e) {} }
    return o; }
  function rankGrava() { try { if (window.CONTA && CONTA.db && CONTA.usuario) return CONTA.db.collection('perfis').doc(CONTA.usuario.uid).set(Object.assign({ nome: trNome(), nv: AR.nv || 1 }, rankCampos()), { merge: true }).catch(() => {}); } catch (e) {} }
  const RK = { lista: [], t: -1e9, meu: null, pos: 0, chave: '' };
  async function rankBusca() { if (!(window.CONTA && CONTA.db && CONTA.usuario)) return RK.lista; RK.t = performance.now();
    try { const g0 = rankCampos(); RK.meuDia = g0.poderDia || RK.meuDia; await rankGrava(); const q = await CONTA.db.collection('perfis').orderBy('poderDia', 'desc').limit(10).get(); RK.lista = q.docs.map(d => { const x = d.data(); return { uid: d.id, nome: x.nomeDia || x.nome, nv: x.nvDia || x.nv, poder: x.poderDia || 0, na: x.naDia || x.na, st: x.stDia || x.st, vis: x.visDia || null }; }); RK.dia = rankDia();
      const eu = CONTA.usuario.uid, i = RK.lista.findIndex(x => x.uid === eu); RK.pos = i >= 0 ? i + 1 : 0;
      if (!RK.pos) { try { const c = await CONTA.db.collection('perfis').where('poderDia', '>', RK.meuDia || meuPoder()).count().get(); RK.pos = c.data().count + 1; } catch (e) { RK.pos = -1; } }
    } catch (e) { RK.erro = e.code || e.message; } monuAtualiza(); return RK.lista; }
  // atualização manual pelo painel do ADM (config/ranking.forcar): quem está online tira a foto do dia de novo e o pódio troca
  let rkOuv = false; function rankOuve() { if (rkOuv || !(window.CONTA && CONTA.db && CONTA.usuario)) return; rkOuv = true;
    CONTA.db.collection('config').doc('ranking').onSnapshot(d => { const cf = d.exists ? d.data() : {}; if (souAdmin() && (cf.todosDia !== rankDia() || (cf.forcar || 0) > (cf.todosEm || 0))) setTimeout(() => rankTodos(), 2000 + Math.random() * 3000); const f = cf.forcar || 0; if (f && f !== RK.forcar) { const novo = RK.forcar !== undefined; RK.forcar = f; if (novo || Date.now() - f < 10 * 60 * 1000) { setTimeout(() => { rankBusca(); }, 400 + Math.random() * 1500); setTimeout(() => { RK.t = -1e9; }, 8000); } } else if (!f) RK.forcar = 0; }, () => { rkOuv = false; }); }
  // ---------- ranking de TODOS (inclusive offline): quem é ADM lê os saves de todo mundo e grava o poder no perfil público ----------
  async function rankTodos(motivo) { if (!(window.CONTA && CONTA.db && CONTA.usuario) || !souAdmin() || RK.todosRodando) return; RK.todosRodando = true; const db = CONTA.db, hoje = rankDia();
    try { const q = await db.collection('jogadores').get(); let b = db.batch(), n = 0, tot = 0;
      for (const d of q.docs) { const x = d.data(); let A = null; try { A = typeof x.arvore === 'string' ? JSON.parse(x.arvore) : x.arvore; } catch (e) {} if (!A || !A.nv) continue;
        const nome = String((A.visual && A.visual.nome) || x.nome || 'Jogador').slice(0, 20), pd = poderDe(A);
        b.set(db.collection('perfis').doc(d.id), { poder: pd, poderDia: pd, nomeDia: nome, nvDia: A.nv | 0, naDia: A.nacao || '', dia: hoje }, { merge: true }); n++; tot++; if (n >= 400) { await b.commit(); b = db.batch(); n = 0; } }
      if (n) await b.commit(); await db.collection('config').doc('ranking').set({ todosDia: hoje, todosEm: Date.now(), todosN: tot }, { merge: true }); RK.t = -1e9; if (motivo) aviso('🏆 Ranking recalculado com ' + tot + ' jogadores.', '#ffd86a');
    } catch (e) { if (motivo) aviso('⚠️ Ranking: ' + (e.code || e.message) + (e.code === 'permission-denied' ? ' (atualize as regras do Firebase)' : ''), '#ff6a6a'); } RK.todosRodando = false; }
  // ---------- painel ----------
  const rkP = document.createElement('div'); rkP.id = 'rank-p'; rkP.hidden = true; document.body.appendChild(rkP);
  const fmtN = n => (n | 0).toLocaleString('pt-BR');
  function rankDesenha() { const logado = window.CONTA && CONTA.db && CONTA.usuario, eu = logado ? CONTA.usuario.uid : '', med = ['👑', '🥈', '🥉'];
    const lin = RK.lista.map((x, i) => { const N = typeof NACOES !== 'undefined' && NACOES[x.na]; return `<div class="rk-l r${i + 1}${x.uid === eu ? ' eu' : ''}"><span class="ps">${med[i] || (i + 1) + 'º'}</span><span class="nm" style="color:${N ? N.cor : '#fff'}">${x.st === 'adm' || x.st === 'gm' ? stfBadge(x.st) : ''}${String(x.nome || 'Jogador').replace(/</g, '').slice(0, 20)}</span><span class="nv">Nv ${x.nv | 0}</span><span class="pd">⚡ ${fmtN(x.poder)}</span></div>`; }).join('');
    rkP.innerHTML = `<div class="box"><div class="hd"><b>🏆 Ranking de Poder · Top 10</b><button class="x">✕</button></div>
      <div class="meu"><span>Seu poder</span><b>⚡ ${fmtN(meuPoder())}</b><small>${logado ? (RK.pos > 0 ? 'Sua posição: ' + RK.pos + 'º' : RK.pos < 0 ? 'Você está fora do top 10' : 'Carregando posição...') : 'Entre com uma conta pra aparecer no ranking'}</small></div>
      <div class="ls">${logado ? (lin || (RK.erro ? '<p>Não deu pra carregar o ranking agora (' + RK.erro + ').</p>' : '<p>Carregando...</p>')) : '<p>O ranking é entre jogadores com conta.</p>'}</div>
      <small class="dc">🕛 O ranking e as estátuas atualizam todo dia à meia-noite e entram todos os jogadores, até quem está offline. O poder soma arma, força, vida, mana, defesa, nível e divino.</small></div>`;
    tapBtn(rkP.querySelector('.x'), () => { rkP.hidden = true; }); }
  function rankAbre() { rkP.hidden = false; rankDesenha(); rankBusca().then(() => { if (!rkP.hidden) rankDesenha(); }); }
  // ---------- monumento: 3 pedestais com estátuas dos 3 mais fortes, no centro da vila ----------
  const MONU = (() => { const MX0 = -0.1, MZ0 = 2.7; const G = grp(vil, MX0, 0, MZ0);
    const M = (c, o) => new T3.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.5, metalness: 0.2 }, o || {}));
    const marm = M('#e9e4da', { roughness: 0.6 }), escuro = M('#3a3448', { roughness: 0.45, metalness: 0.35 });
    const metal = [M('#ffd34a', { metalness: 0.85, roughness: 0.28, emissive: '#5a3c00', emissiveIntensity: 0.35 }), M('#d8e4f2', { metalness: 0.85, roughness: 0.25, emissive: '#1c2c44', emissiveIntensity: 0.3 }), M('#d08a42', { metalness: 0.8, roughness: 0.32, emissive: '#3a1a04', emissiveIntensity: 0.3 })];
    const caixa = (m, x, y, z, sx, sy, sz) => { const b = new T3.Mesh(BOX, m); b.position.set(x, y, z); b.scale.set(sx, sy, sz); b.castShadow = true; b.receiveShadow = true; G.add(b); return b; };
    caixa(marm, 0, 0.15, 0, 9.4, 0.3, 3.6); caixa(metal[0], 0, 0.31, 0, 9.5, 0.04, 3.7);
    const CFG = [{ x: 0, h: 1.9 }, { x: -3.1, h: 1.35 }, { x: 3.1, h: 1.0 }];
    const crest = (txt, cor) => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.strokeStyle = cor; x.lineWidth = 10; x.beginPath(); x.arc(128, 128, 112, 0, 7); x.stroke(); x.lineWidth = 3; x.beginPath(); x.arc(128, 128, 94, 0, 7); x.stroke();
      x.fillStyle = '#fff'; x.shadowColor = cor; x.shadowBlur = 16; x.font = '900 96px Georgia,serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 128, 124); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; };
    const cores = ['#ffd34a', '#bfe0ff', '#f0a050'];
    const P = CFG.map((c, i) => { const g = grp(G, c.x, 0.3, 0); const b = new T3.Mesh(BOX, escuro); b.position.y = c.h / 2; b.scale.set(2.3, c.h, 2.3); b.castShadow = b.receiveShadow = true; g.add(b);
      const tp = new T3.Mesh(BOX, metal[i]); tp.position.y = c.h; tp.scale.set(2.5, 0.14, 2.5); g.add(tp); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, z]) => { const p = new T3.Mesh(new T3.CylinderGeometry(0.09, 0.1, c.h, 8), metal[i]); p.position.set(a * 1.15, c.h / 2, z * 1.15); g.add(p); });
      const cr = new T3.Mesh(new T3.PlaneGeometry(1.1, 1.1), new T3.MeshBasicMaterial({ map: crest(['I', 'II', 'III'][i], cores[i]), transparent: true, toneMapped: false })); cr.position.set(0, c.h * 0.52, 1.16); g.add(cr);
      const aura = new T3.Mesh(new T3.RingGeometry(0.75, 1.1, 40), new T3.MeshBasicMaterial({ color: cores[i], transparent: true, opacity: 0.75, side: T3.DoubleSide, depthWrite: false, toneMapped: false })); aura.rotation.x = -Math.PI / 2; aura.position.y = c.h + 0.09; g.add(aura); glowSpr(g, 0, c.h + 1.6, 0, 4.5, cores[i], 0.28);
      const feixe = new T3.Mesh(new T3.CylinderGeometry(0.9, 1.3, 9, 24, 1, true), new T3.MeshBasicMaterial({ color: cores[i], transparent: true, opacity: i ? 0.07 : 0.11, side: T3.DoubleSide, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false })); feixe.position.y = c.h + 4.5; g.add(feixe);
      const placa = new T3.Sprite(new T3.SpriteMaterial({ transparent: true, depthWrite: false, toneMapped: false })); placa.scale.set(3.4, 0.85, 1); g.add(placa);
      COL.push({ t: 'b', x: MX0 + c.x, z: MZ0, hw: 1.3, hd: 1.3, ry: 0 }); return { g, h: c.h, placa, est: null, chave: null, aura }; });
    COL.push({ t: 'b', x: MX0, z: MZ0, hw: 4.7, hd: 1.8, ry: 0 });
    return { G, P, metal, X: MX0, Z: MZ0 }; })();
  function monuPlaca(sp, i, x) { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d'); const cor = ['#ffd34a', '#cfe6ff', '#f0a050'][i];
    g.fillStyle = 'rgba(10,8,18,.78)'; g.beginPath(); g.roundRect ? g.roundRect(6, 6, 500, 116, 26) : g.rect(6, 6, 500, 116); g.fill(); g.strokeStyle = cor; g.lineWidth = 5; g.stroke();
    g.textAlign = 'center'; g.fillStyle = cor; g.font = '900 30px Georgia,serif'; g.fillText((['👑 1º', '🥈 2º', '🥉 3º'][i]) + ' · ' + String(x ? x.nome || 'Jogador' : '???').slice(0, 18), 256, 54); g.fillStyle = '#fff'; g.font = '800 28px sans-serif'; g.fillText(x ? '⚡ ' + fmtN(x.poder) + ' de poder' : 'Lugar vago', 256, 98);
    if (sp.material.map) sp.material.map.dispose(); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; sp.material.map = t; sp.material.needsUpdate = true; }
  function monuEstatua(slot, i, x) { if (slot.est) { slot.g.remove(slot.est); slot.est = null; }
    let c = null; try { if (x && x.vis && x.vis.k) c = visMonta(x.vis); } catch (e) {} if (!c) { try { c = visMonta({ k: VIS.k || visAtual().k, c: '' }); } catch (e) {} } if (!c) return;
    c.traverse(o => { if (o.isMesh) o.castShadow = true; }); if (!(x && x.vis && x.vis.k)) { const mt = MONU.metal[i]; c.traverse(o => { if (o.isMesh) o.material = mt; }); }
    c.scale.setScalar(heroi.scale.x * 2.1); c.position.set(0, slot.h + 0.07, 0); c.rotation.set(0, 0, 0); c.userData.mood = i; slot.g.add(c); slot.est = c;
    try { pose(c, 0, { mood: 'smile', arms: i === 0 ? { shR: [-2.8, 0, 0.25], shL: [-0.3, 0, -0.35], elR: [0, 0, 0], elL: [-0.6, 0, 0] } : i === 1 ? { shR: [-0.7, 0, 0.4], shL: [-0.7, 0, -0.4], elR: [-1.2, 0, 0], elL: [-1.2, 0, 0] } : { shR: [0, 0, 0.5], shL: [-1.4, 0, -0.2], elR: [0, 0, 0], elL: [-0.4, 0, 0] } }); } catch (e) {} }
  function monuAtualiza() { const L = RK.lista; MONU.P.forEach((slot, i) => { const x = L[i] || null, ch = x ? x.uid + '|' + (x.vis ? x.vis.k.length + x.vis.c : '') + '|' + x.poder + '|' + x.nome : 'vazio';
      if (slot.chave === ch) return; slot.chave = ch; monuPlaca(slot.placa, i, x); slot.placa.position.y = slot.h + 4.6; monuEstatua(slot, i, x); }); }
  let monuT = 3; function rankFrame(dt) { rankOuve(); MONU.P.forEach(s => { s.aura.rotation.z += dt * 0.6; }); try { pracaVFrame(dt); } catch (e) {} monuT -= dt; if (monuT > 0) return; monuT = 1; if (!MONU.P[0].chave) monuAtualiza();
    if (RK.dia && RK.dia !== rankDia()) { RK.t = -1e9; RK.dia = rankDia(); if (souAdmin()) setTimeout(() => rankTodos(), 3000 + Math.random() * 5000); }
    const p = heroi.position; if (zona === 'vila' && !dentro && Math.hypot(p.x - MONU.X, p.z - MONU.Z) < 60 && performance.now() - RK.t > 120000) rankBusca(); }
  // ===================== PRAÇA DOS CAMPEÕES (centro da vila, em volta do pódio) =====================
  const PRV = (() => { const CX = -0.1, CZ = 5.5, R = 17; const G = grp(vil, CX, 0, CZ); const anim = { fontes: [], chamas: [], brilhos: [], bandeiras: [] };
    const tx = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; };
    const M = (c, o) => new T3.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.7 }, o || {}));
    const ouro = M('#e0b040', { metalness: 0.7, roughness: 0.3 }), pedraC = M('#d8d2c4'), pedraE = M('#8e8778'), ferro = M('#2a2a34', { metalness: 0.5, roughness: 0.5 }), madeira = M('#6a4426'), verde = M('#3f8a3a', { roughness: 0.9 }), agua = new T3.MeshStandardMaterial({ color: '#5ac8ff', roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.85 });
    const col = (x, z, r) => COL.push({ t: 'c', x: CX + x, z: CZ + z, r }); const add = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; G.add(m); return m; };
    // chão: mosaico radial de pedra com anéis dourados e estrela
    const chaoT = tx(1024, 1024, (g, w) => { const c = w / 2; g.fillStyle = '#cfc7b6'; g.fillRect(0, 0, w, w);
      for (let r = 40; r < c; r += 34) { const n = Math.round(r * 0.32); for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2; g.beginPath(); g.arc(c, c, r + 32, a0, a1); g.arc(c, c, r, a1, a0, true); g.closePath(); g.fillStyle = ['#d9d1c0', '#c4bba8', '#e2dbcc', '#bdb39f'][(i + Math.round(r)) % 4]; g.fill(); g.strokeStyle = 'rgba(90,80,60,.35)'; g.lineWidth = 2; g.stroke(); } }
      [[c - 6, 10, '#d8a840'], [c * 0.62, 8, '#c8202a'], [c * 0.6, 4, '#d8a840'], [150, 7, '#d8a840']].forEach(([r, lw, cor]) => { g.strokeStyle = cor; g.lineWidth = lw; g.beginPath(); g.arc(c, c, r, 0, 7); g.stroke(); });
      g.fillStyle = 'rgba(216,168,64,.55)'; for (let k = 0; k < 2; k++) { g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + k * Math.PI / 8, rr = i % 2 ? 60 : 140; i ? g.lineTo(c + Math.cos(a) * rr, c + Math.sin(a) * rr) : g.moveTo(c + Math.cos(a) * rr, c + Math.sin(a) * rr); } g.closePath(); g.fill(); } });
    const chao = new T3.Mesh(new T3.CircleGeometry(R, 72), new T3.MeshStandardMaterial({ map: chaoT, roughness: 0.85 })); chao.rotation.x = -Math.PI / 2; chao.position.y = 0.028; chao.receiveShadow = true; G.add(chao);
    const meio = new T3.Mesh(new T3.TorusGeometry(R, 0.4, 6, 96), pedraE); meio.rotation.x = Math.PI / 2; meio.position.y = 0.1; G.add(meio);
    // tapete vermelho da entrada sul até o pódio
    const tp = new T3.Mesh(new T3.PlaneGeometry(3, 12.5), M('#9a1a2e', { roughness: 0.95 })); tp.rotation.x = -Math.PI / 2; tp.position.set(0, 0.035, 9.6); tp.receiveShadow = true; G.add(tp);
    [-1, 1].forEach(s => { const b = new T3.Mesh(new T3.PlaneGeometry(0.2, 12.5), new T3.MeshBasicMaterial({ color: '#e8b84a' })); b.rotation.x = -Math.PI / 2; b.position.set(s * 1.6, 0.038, 9.6); G.add(b); });
    // postes de luz em volta + bandeirolas entre eles
    const postes = []; const NP = 12; for (let i = 0; i < NP; i++) { const a = (i + 0.5) / NP * Math.PI * 2, x = Math.sin(a) * (R - 1.2), z = Math.cos(a) * (R - 1.2); if (Math.abs(x) < 3 && z > 0) continue;
      add(new T3.Mesh(new T3.CylinderGeometry(0.1, 0.14, 4.4, 8), ferro), x, 2.2, z); add(new T3.Mesh(new T3.CylinderGeometry(0.28, 0.32, 0.25, 8), ferro), x, 0.12, z);
      const l = grp(G, x, 4.55, z); part(l, SPH, '#fff2c0', 0, 0, 0, 0.3, 0.36, 0.3, 0, true); part(l, CONE, '#2a2a34', 0, 0.38, 0, 0.36, 0.25, 0.36); glowSpr(l, 0, 0, 0, 2.8, '#ffd890', 0.5); postes.push([x, z]); col(x, z, 0.3); }
    const corB = ['#c8202a', '#ffd86a', '#3a8aff', '#3fbf5a', '#ff7ab8', '#ffffff']; const tri = new T3.ConeGeometry(0.22, 0.5, 3);
    for (let i = 0; i < postes.length; i++) { const [ax, az] = postes[i], [bx, bz] = postes[(i + 1) % postes.length]; if (Math.hypot(bx - ax, bz - az) > 12) continue; const n = 9;
      for (let k = 1; k < n; k++) { const u = k / n, y = 4.15 - Math.sin(u * Math.PI) * 0.9; const f = new T3.Mesh(tri, new T3.MeshBasicMaterial({ color: corB[(i + k) % corB.length], toneMapped: false, side: T3.DoubleSide })); f.position.set(ax + (bx - ax) * u, y, az + (bz - az) * u); f.rotation.x = Math.PI; f.rotation.y = Math.atan2(bx - ax, bz - az); G.add(f); anim.bandeiras.push(f); } }
    // fontes dos dois lados do pódio
    [-1, 1].forEach(s => { const x = s * 9.5, z = 3; add(new T3.Mesh(new T3.CylinderGeometry(2.2, 2.4, 0.7, 24), pedraC), x, 0.35, z); const ag = new T3.Mesh(new T3.CylinderGeometry(1.95, 1.95, 0.05, 24), agua); ag.position.set(x, 0.62, z); G.add(ag);
      add(new T3.Mesh(new T3.CylinderGeometry(0.3, 0.45, 1.6, 10), pedraC), x, 1.1, z); add(new T3.Mesh(new T3.CylinderGeometry(0.9, 0.6, 0.3, 16), pedraC), x, 1.95, z); const ag2 = new T3.Mesh(new T3.CylinderGeometry(0.78, 0.78, 0.04, 16), agua); ag2.position.set(x, 2.08, z); G.add(ag2);
      add(new T3.Mesh(new T3.SphereGeometry(0.22, 12, 10), ouro), x, 2.4, z); const gotas = []; for (let k = 0; k < 14; k++) { const g = new T3.Mesh(new T3.SphereGeometry(0.07, 6, 5), new T3.MeshBasicMaterial({ color: '#c8f0ff', transparent: true, opacity: 0.85 })); G.add(g); gotas.push({ g, f: k / 14, a: k / 14 * Math.PI * 2 }); }
      anim.fontes.push({ x, z, gotas }); col(x, z, 2.4); });
    // canteiros de flores
    const FL = ['#ff5a7a', '#ffd23c', '#ff8a3a', '#c86aff', '#ffffff', '#5ab8ff']; const flG = new T3.SphereGeometry(0.12, 6, 5);
    [[-13, 10], [13, 10], [-7, 13], [7, 13], [-12.5, -2], [12.5, -2]].forEach(([x, z], j) => { add(new T3.Mesh(new T3.CylinderGeometry(1.25, 1.35, 0.45, 16), pedraE), x, 0.22, z); const t = new T3.Mesh(new T3.CylinderGeometry(1.15, 1.15, 0.06, 16), M('#5a3a20')); t.position.set(x, 0.46, z); G.add(t);
      for (let k = 0; k < 26; k++) { const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * 1.0; const st = new T3.Mesh(BOX, verde); st.position.set(x + Math.cos(a) * r, 0.62, z + Math.sin(a) * r); st.scale.set(0.05, 0.3, 0.05); G.add(st); const f = new T3.Mesh(flG, new T3.MeshBasicMaterial({ color: FL[(k + j) % FL.length], toneMapped: false })); f.position.set(st.position.x, 0.8, st.position.z); G.add(f); }
      if (j < 2) { const tr = grp(G, x, 0.45, z); part(tr, CYL, '#6a4426', 0, 0.9, 0, 0.12, 0.9, 0.12); part(tr, SPH, '#4aa84a', 0, 2.1, 0, 0.9, 0.8, 0.9); part(tr, SPH, '#5ac85a', 0.3, 2.5, 0.2, 0.6, 0.55, 0.6); } col(x, z, 1.4); });
    // cerca viva atrás do pódio
    for (let i = -4; i <= 4; i++) { const h = new T3.Mesh(BOX, verde); h.position.set(i * 1.25, 0.6, -6.3 + Math.abs(i) * 0.25); h.scale.set(1.2, 1.2, 0.9); h.castShadow = true; G.add(h); }
    // mastros com bandeiras das nações
    [[-6.5, -4.5, '#ff3a4a'], [6.5, -4.5, '#3a8aff'], [-11.5, -6.5, '#ffd23c'], [11.5, -6.5, '#ffd23c']].forEach(([x, z, c]) => { add(new T3.Mesh(new T3.CylinderGeometry(0.07, 0.09, 6, 8), ouro), x, 3, z); add(new T3.Mesh(new T3.SphereGeometry(0.16, 10, 8), ouro), x, 6.05, z);
      const b = new T3.Mesh(new T3.PlaneGeometry(1.6, 1.0, 6, 2), new T3.MeshStandardMaterial({ color: c, side: T3.DoubleSide, roughness: 0.8 })); b.position.set(x + 0.82, 5.4, z); G.add(b); anim.bandeiras.push(b); b.userData.mastro = true; col(x, z, 0.2); });
    // braseiros com fogo na frente do pódio
    [[-5.2, -0.6], [5.2, -0.6]].forEach(([x, z]) => { add(new T3.Mesh(new T3.CylinderGeometry(0.12, 0.18, 1.2, 8), ferro), x, 0.6, z); add(new T3.Mesh(new T3.CylinderGeometry(0.5, 0.25, 0.4, 12), ouro), x, 1.35, z);
      const f1 = new T3.Mesh(new T3.ConeGeometry(0.35, 0.9, 10), new T3.MeshBasicMaterial({ color: '#ff6a1a', transparent: true, opacity: 0.85, blending: T3.AdditiveBlending, toneMapped: false })); f1.position.set(x, 1.95, z); G.add(f1); glowSpr(G, x, 1.9, z, 2.4, '#ff9a3a', 0.6); anim.chamas.push(f1); col(x, z, 0.4); });
    // bancos virados pro pódio
    [[-6, 9, 0.5], [6, 9, -0.5], [-10, 6, 1.0], [10, 6, -1.0]].forEach(([x, z, ry]) => { const b = grp(G, x, 0, z); b.rotation.y = ry; [[0, 0.45, 0, 2.6, 0.14, 0.7], [0, 0.85, -0.32, 2.6, 0.6, 0.1]].forEach(([a, y, c, sx, sy, sz]) => { const m = new T3.Mesh(BOX, madeira); m.position.set(a, y, c); m.scale.set(sx, sy, sz); m.castShadow = true; b.add(m); }); [-1.1, 1.1].forEach(a => { const m = new T3.Mesh(BOX, ferro); m.position.set(a, 0.22, 0); m.scale.set(0.1, 0.44, 0.6); b.add(m); }); col(x, z, 1.1); });
    // brilhos flutuando em volta do pódio
    for (let i = 0; i < 18; i++) { const s = new T3.Sprite(new T3.SpriteMaterial({ map: glowTex, color: ['#ffe08a', '#ff8ab8', '#8ad8ff'][i % 3], transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0.8 })); s.scale.setScalar(0.25); G.add(s); anim.brilhos.push({ s, a: Math.random() * 6.28, r: 4 + Math.random() * 3, y: 1 + Math.random() * 6, v: 0.2 + Math.random() * 0.4 }); }
    return { G, anim, CX, CZ, R }; })();
  function pracaVFrame(dt) { if (!vil.visible) return; const A = PRV.anim, t = gT;
    A.fontes.forEach(F => F.gotas.forEach(d => { d.f = (d.f + dt * 0.7) % 1; const r = 0.15 + d.f * 1.1, y = 2.45 + Math.sin(d.f * Math.PI) * 0.9 - d.f * 0.6; d.g.position.set(F.x + Math.cos(d.a) * r, y, F.z + Math.sin(d.a) * r); }));
    A.chamas.forEach((f, i) => { const k = 0.85 + Math.sin(t * 14 + i * 2) * 0.15; f.scale.set(k, 0.9 + Math.cos(t * 17 + i) * 0.2, k); });
    A.bandeiras.forEach((b, i) => { if (b.userData.mastro) b.rotation.y = Math.sin(t * 2.2 + i) * 0.25; else b.rotation.z = Math.sin(t * 3 + i * 0.7) * 0.25; });
    A.brilhos.forEach(b => { b.a += dt * b.v; b.y += dt * 0.35; if (b.y > 8) b.y = 1; b.s.position.set(Math.cos(b.a) * b.r, b.y, -2.8 + Math.sin(b.a) * b.r * 0.5); b.s.material.opacity = 0.4 + Math.sin(t * 3 + b.a) * 0.35; }); }
