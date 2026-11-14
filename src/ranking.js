  // ===================== RANKING DE PODER (top 10) + MONUMENTO DOS TOP 3 NA VILA =====================
  // Cada jogador grava o próprio poder (e o visual) no perfil público (perfis/{uid}); o ranking lê os 10 maiores.
  function meuPoder() { try { const A = ARMAS[AR.arma] || {}, dano = (A.dano || 10) * (1 + attrV('for') * 0.006);
    return Math.round(dano * 15 + VIDA_MAX * 3 + MANA_MAX * 1.5 + defesa() * 30 + (AR.nv || 1) * 45 + (AR.divino ? 900 : 0)); } catch (e) { return (AR.nv || 1) * 45; } }
  function rankCampos() { const o = { poder: meuPoder(), na: AR.nacao || '', st: typeof meuCargo === 'function' ? meuCargo() : '' }; try { const V = visAtual(); if (V.k) o.vis = { k: V.k, c: V.c }; } catch (e) {} return o; }
  function rankGrava() { try { if (window.CONTA && CONTA.db && CONTA.usuario) return CONTA.db.collection('perfis').doc(CONTA.usuario.uid).set(Object.assign({ nome: trNome(), nv: AR.nv || 1 }, rankCampos()), { merge: true }).catch(() => {}); } catch (e) {} }
  const RK = { lista: [], t: -1e9, meu: null, pos: 0, chave: '' };
  async function rankBusca() { if (!(window.CONTA && CONTA.db && CONTA.usuario)) return RK.lista; RK.t = performance.now();
    try { await rankGrava(); const q = await CONTA.db.collection('perfis').orderBy('poder', 'desc').limit(10).get(); RK.lista = q.docs.map(d => Object.assign({ uid: d.id }, d.data()));
      const eu = CONTA.usuario.uid, i = RK.lista.findIndex(x => x.uid === eu); RK.pos = i >= 0 ? i + 1 : 0;
      if (!RK.pos) { try { const c = await CONTA.db.collection('perfis').where('poder', '>', meuPoder()).count().get(); RK.pos = c.data().count + 1; } catch (e) { RK.pos = -1; } }
    } catch (e) { RK.erro = e.code || e.message; } monuAtualiza(); return RK.lista; }
  // ---------- painel ----------
  const rkP = document.createElement('div'); rkP.id = 'rank-p'; rkP.hidden = true; document.body.appendChild(rkP);
  const fmtN = n => (n | 0).toLocaleString('pt-BR');
  function rankDesenha() { const logado = window.CONTA && CONTA.db && CONTA.usuario, eu = logado ? CONTA.usuario.uid : '', med = ['👑', '🥈', '🥉'];
    const lin = RK.lista.map((x, i) => { const N = typeof NACOES !== 'undefined' && NACOES[x.na]; return `<div class="rk-l r${i + 1}${x.uid === eu ? ' eu' : ''}"><span class="ps">${med[i] || (i + 1) + 'º'}</span><span class="nm" style="color:${N ? N.cor : '#fff'}">${x.st === 'adm' || x.st === 'gm' ? stfBadge(x.st) : ''}${String(x.nome || 'Jogador').replace(/</g, '').slice(0, 20)}</span><span class="nv">Nv ${x.nv | 0}</span><span class="pd">⚡ ${fmtN(x.poder)}</span></div>`; }).join('');
    rkP.innerHTML = `<div class="box"><div class="hd"><b>🏆 Ranking de Poder · Top 10</b><button class="x">✕</button></div>
      <div class="meu"><span>Seu poder</span><b>⚡ ${fmtN(meuPoder())}</b><small>${logado ? (RK.pos > 0 ? 'Sua posição: ' + RK.pos + 'º' : RK.pos < 0 ? 'Você está fora do top 10' : 'Carregando posição...') : 'Entre com uma conta pra aparecer no ranking'}</small></div>
      <div class="ls">${logado ? (lin || (RK.erro ? '<p>Não deu pra carregar o ranking agora (' + RK.erro + ').</p>' : '<p>Carregando...</p>')) : '<p>O ranking é entre jogadores com conta.</p>'}</div>
      <small class="dc">O poder soma arma, força, vida, mana, defesa, nível e divino. Os 3 primeiros ganham estátua na praça de Brumafria.</small></div>`;
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
      const placa = new T3.Sprite(new T3.SpriteMaterial({ transparent: true, depthWrite: false, toneMapped: false })); placa.scale.set(3.4, 0.85, 1); g.add(placa);
      COL.push({ t: 'b', x: MX0 + c.x, z: MZ0, hw: 1.3, hd: 1.3, ry: 0 }); return { g, h: c.h, placa, est: null, chave: null }; });
    COL.push({ t: 'b', x: MX0, z: MZ0, hw: 4.7, hd: 1.8, ry: 0 });
    return { G, P, metal, X: MX0, Z: MZ0 }; })();
  function monuPlaca(sp, i, x) { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d'); const cor = ['#ffd34a', '#cfe6ff', '#f0a050'][i];
    g.fillStyle = 'rgba(10,8,18,.78)'; g.beginPath(); g.roundRect ? g.roundRect(6, 6, 500, 116, 26) : g.rect(6, 6, 500, 116); g.fill(); g.strokeStyle = cor; g.lineWidth = 5; g.stroke();
    g.textAlign = 'center'; g.fillStyle = cor; g.font = '900 30px Georgia,serif'; g.fillText((['👑 1º', '🥈 2º', '🥉 3º'][i]) + ' · ' + String(x ? x.nome || 'Jogador' : '???').slice(0, 18), 256, 54); g.fillStyle = '#fff'; g.font = '800 28px sans-serif'; g.fillText(x ? '⚡ ' + fmtN(x.poder) + ' de poder' : 'Lugar vago', 256, 98);
    if (sp.material.map) sp.material.map.dispose(); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; sp.material.map = t; sp.material.needsUpdate = true; }
  function monuEstatua(slot, i, x) { if (slot.est) { slot.g.remove(slot.est); slot.est = null; }
    let c = null; try { if (x && x.vis && x.vis.k) c = visMonta(x.vis); } catch (e) {} if (!c) { try { c = visMonta({ k: VIS.k || visAtual().k, c: '' }); } catch (e) {} } if (!c) return;
    const mt = MONU.metal[i]; c.traverse(o => { if (o.isMesh || o.isSprite) { if (o.isSprite) { o.visible = false; return; } o.material = mt; o.castShadow = true; } });
    c.scale.setScalar(heroi.scale.x * 2.1); c.position.set(0, slot.h + 0.07, 0); c.rotation.set(0, 0, 0); c.userData.mood = i; slot.g.add(c); slot.est = c;
    try { pose(c, 0, { mood: 'smile', arms: i === 0 ? { shR: [-2.8, 0, 0.25], shL: [-0.3, 0, -0.35], elR: [0, 0, 0], elL: [-0.6, 0, 0] } : i === 1 ? { shR: [-0.7, 0, 0.4], shL: [-0.7, 0, -0.4], elR: [-1.2, 0, 0], elL: [-1.2, 0, 0] } : { shR: [0, 0, 0.5], shL: [-1.4, 0, -0.2], elR: [0, 0, 0], elL: [-0.4, 0, 0] } }); } catch (e) {} }
  function monuAtualiza() { const L = RK.lista; MONU.P.forEach((slot, i) => { const x = L[i] || null, ch = x ? x.uid + '|' + (x.vis ? x.vis.k.length + x.vis.c : '') + '|' + x.poder + '|' + x.nome : 'vazio';
      if (slot.chave === ch) return; slot.chave = ch; monuPlaca(slot.placa, i, x); slot.placa.position.y = slot.h + 4.6; monuEstatua(slot, i, x); }); }
  let monuT = 3; function rankFrame(dt) { monuT -= dt; if (monuT > 0) return; monuT = 1; if (!MONU.P[0].chave) monuAtualiza();
    const p = heroi.position; if (zona === 'vila' && !dentro && Math.hypot(p.x - MONU.X, p.z - MONU.Z) < 60 && performance.now() - RK.t > 120000) rankBusca(); }
  setInterval(() => { try { rankFrame(1); } catch (e) {} }, 1000);
