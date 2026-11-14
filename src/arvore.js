  // ===================== ÁRVORE DE HABILIDADES EM REDE (sem classe: qualquer um segue qualquer rota) =====================
  // Cada rota é uma sequência de etapas. Etapa = 'id' (um nó) ou ['id1','id2'] (dois caminhos lado a lado, que se juntam de novo).
  // 'P:atk' / 'P:crit' / 'P:vida' / 'P:mana' / 'P:def' são nós passivos (bônus de atributo).
  const ARV_PAS = { atk: { nome: 'Força', ic: '💪', txt: '+3% de ataque', v: 0.03 }, crit: { nome: 'Precisão', ic: '🎯', txt: '+2% de crítico', v: 0.02 }, vida: { nome: 'Vigor', ic: '❤️', txt: '+15 de vida máxima', v: 15 }, mana: { nome: 'Essência', ic: '🔷', txt: '+12 de mana máxima', v: 12 }, def: { nome: 'Couraça', ic: '🛡️', txt: '+3% de defesa', v: 3 } };
  const ROTAS = [
    { id: 'arcana', nome: 'Rota Arcana', sub: 'Magia, gelo, fogo e sombra', ic: '🔮', cor: '#b46aff', etapas: ['escudo', ['dardo', 'P:mana'], 'chama', ['gelo', 'raio'], 'P:atk', ['meteoro', 'nova'], ['orbe', 'teleporte'], 'P:mana', ['drenar', 'maldicao'], ['lanca', 'pacto'], 'P:crit', ['clarao', 'ima'], ['lg_trovao', 'lg_glacial'], 'P:atk', ['lg_eclipse', 'lg_meteoros'], 'P:mana', ['lg_dragao', 'lg_abismo']] },
    { id: 'lamina', nome: 'Rota da Lâmina', sub: 'Espadas, velocidade e crítico', ic: '⚔️', cor: '#ff7a3a', etapas: ['salto', ['vento', 'P:atk'], 'impulso', ['sismico', 'danca'], ['furia', 'passo'], 'P:crit', ['investida', 'veneno'], ['grito', 'tempestade'], 'P:atk', ['tufao', 'runa'], ['bumerangue', 'marca'], ['esmagar', 'espiral'], 'P:vida', ['pele', 'espelho'], 'planar'] },
    { id: 'guarda', nome: 'Rota do Guardião', sub: 'Escudo, flechas, tiros e cura', ic: '🛡️', cor: '#3ad87a', etapas: ['sabao', ['ferver', 'P:vida'], 'remedio', ['muralha', 'rajada'], ['provocar', 'chuva'], 'P:def', ['escudada', 'congelante'], ['fortaleza', 'floresta'], 'P:vida', ['carregado', 'polvora'], ['granada', 'tripla'], 'P:def', 'recuo'] }];
  const PONTES = [['arcana', 4, 'lamina', 5], ['lamina', 8, 'guarda', 8]]; // ligações entre rotas
  const ARV = { nos: {}, lig: {}, W: 0, H: 0 };
  AR.arvP = AR.arvP || [];
  (() => { const DX = 68, Y0 = 40, DY = 90, OFF = 23, X0 = 96; const no = (id, x, y, rota, col) => { ARV.nos[id] = { id, x, y, rota, col }; ARV.lig[id] = ARV.lig[id] || new Set(); return id; };
    const liga = (a, b) => { ARV.lig[a].add(b); ARV.lig[b].add(a); };
    no('raiz', 38, Y0 + DY, null, -1); ARV.nos.raiz.raiz = true;
    ROTAS.forEach((R, ri) => { let ant = ['raiz']; R.ids = [];
      R.etapas.forEach((et, ci) => { const lista = Array.isArray(et) ? et : [et]; const atual = [];
        lista.forEach((k, j) => { if (!k.startsWith('P:') && !PW[k]) { console.warn('árvore: habilidade não existe', k); return; } const id = k.startsWith('P:') ? 'P:' + R.id + ':' + ci + ':' + k.slice(2) : k; const y = Y0 + ri * DY + (lista.length > 1 ? (j ? OFF : -OFF) : 0); no(id, X0 + ci * DX, y, R.id, ci); atual.push(id); R.ids.push(id);
          if (!k.startsWith('P:')) { const pw = PW[k]; pw.preco = pw.lend ? 5 : ci < 3 ? 1 : ci < 6 ? 2 : ci < 9 ? 3 : 4; pw.arv = R.id; } });
        if (!atual.length) return; ant.forEach(a => atual.forEach(b => liga(a, b))); ant = atual; R.col = R.col || []; R.col[ci] = atual; });
      R.fimX = X0 + R.etapas.length * DX; });
    PONTES.forEach(([ra, ca, rb, cb]) => { const A = ROTAS.find(r => r.id === ra).col[ca], B = ROTAS.find(r => r.id === rb).col[cb]; if (A && B) liga(A[A.length - 1], B[0]); });
    ARV.W = Math.max(...ROTAS.map(r => r.fimX)) + 170; ARV.H = Y0 * 2 + DY * 2; })();
  function arvTem(id) { return !!ARV.nos[id] && !id.startsWith('P:'); }
  function arvPossui(id) { if (id === 'raiz') return true; if (id.startsWith('P:')) return (AR.arvP || []).includes(id); return AR.tem.includes(id); }
  function arvLiga(id) { const pw = PW[id]; if (pw && pw.nvMin && AR.nv < pw.nvMin && !souAdmin()) return false; return [...(ARV.lig[id] || [])].some(arvPossui); }
  function arvB(k) { let v = 0; (AR.arvP || []).forEach(id => { const s = id.split(':')[3]; if (s === k && ARV_PAS[s]) v += ARV_PAS[s].v; }); return v; }
  function arvDesenhaNo(id) { const N = ARV.nos[id]; if (N.raiz) return { ic: '🌟', nome: 'Despertar', cor: '#ffd23c' }; if (id.startsWith('P:')) { const P = ARV_PAS[id.split(':')[3]]; return { ic: P.ic, nome: P.nome, cor: ROTAS.find(r => r.id === N.rota).cor, pas: true }; } const pw = PW[id]; return { ic: pw.icone, nome: pw.nome, cor: ROTAS.find(r => r.id === N.rota).cor, lend: !!pw.lend }; }
  let arvScroll = null;
  function arvRede(col) { col.className = 'arv-rede-wrap' + (AR.arvNomes ? ' nomes' : ''); { let bt = $('arv-nomes'); if (!bt) { bt = document.createElement('button'); bt.id = 'arv-nomes'; $('arv-fecha').before(bt); tapBtn(bt, () => { AR.arvNomes = !AR.arvNomes; salvaAR(); desenhaArvore(); }); } bt.textContent = (AR.arvNomes ? '☑' : '☐') + ' Nomes'; } const sc = document.createElement('div'); sc.className = 'arv-rede-sc'; const R0 = document.createElement('div'); R0.className = 'arv-rede'; R0.style.width = ARV.W + 'px'; R0.style.height = ARV.H + 'px';
    // linhas
    let svg = `<svg width="${ARV.W}" height="${ARV.H}">`; const feitas = new Set();
    Object.keys(ARV.lig).forEach(a => ARV.lig[a].forEach(b => { const k = a < b ? a + '|' + b : b + '|' + a; if (feitas.has(k)) return; feitas.add(k); const A = ARV.nos[a], B = ARV.nos[b]; const on = arvPossui(a) && arvPossui(b); const cor = on ? (ROTAS.find(r => r.id === (B.rota || A.rota)) || {}).cor || '#ffd23c' : '#4a5068';
      svg += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" stroke="${cor}" stroke-width="${on ? 4 : 2.5}" stroke-linecap="round" opacity="${on ? 0.95 : 0.6}"/>`; }));
    svg += '</svg>'; R0.innerHTML = svg;
    // faixas das rotas (nome no fim de cada rota)
    ROTAS.forEach(R => { const y = ARV.nos[R.ids[0]].y; const f = document.createElement('div'); f.className = 'arv-faixa'; f.style.cssText = `left:${R.fimX - 14}px;top:${y - 38}px;--rc:${R.cor}`; const n = R.ids.filter(arvPossui).length; f.innerHTML = `<span class="fi">${R.ic}</span><b>${R.nome}</b><small>${R.sub}</small><em>${n} / ${R.ids.length}</em>`; R0.appendChild(f); });
    // nós
    Object.keys(ARV.nos).forEach(id => { const N = ARV.nos[id], D = arvDesenhaNo(id), tem = arvPossui(id), pode = !tem && arvLiga(id); const b = document.createElement('button');
      b.className = 'arv-no' + (N.raiz ? ' raiz' : '') + (D.pas ? ' pas' : '') + (D.lend ? ' lend' : '') + (tem ? ' tem' : pode ? ' pode' : ' trava') + (selArv === id ? ' sel' : '') + (AR.barra.includes(id) ? ' bar' : '');
      b.style.cssText = `left:${N.x}px;top:${N.y}px;--rc:${D.cor}`; b.innerHTML = `<span class="ic">${D.ic}</span>` + (tem && !N.raiz && !D.pas ? '' : '') + `<span class="nm">${D.nome}</span>`; if (!N.raiz) tapBtn(b, () => { arvScroll = sc.scrollLeft; selArv = id; desenhaArvore(); }); R0.appendChild(b); });
    sc.appendChild(R0); col.appendChild(sc); if (arvScroll !== null) requestAnimationFrame(() => { sc.scrollLeft = arvScroll; }); }
  // detalhe de um nó passivo (os de habilidade usam o painel normal)
  function arvDetalhe(det) { if (!selArv || !selArv.startsWith('P:')) return false; const P = ARV_PAS[selArv.split(':')[3]], tem = arvPossui(selArv), pode = !tem && arvLiga(selArv), R = ROTAS.find(r => r.id === ARV.nos[selArv].rota);
    det.innerHTML = `<button class="arv-x" id="arv-x">✕</button><div class="dt"><span class="ic">${P.ic}</span><div><b>${P.nome}</b><small>Passiva · ${R.nome}</small></div></div><p>${P.txt}. Fica ativa pra sempre depois de aprender.</p><div id="arv-acoes"></div>`;
    tapBtn($('arv-x'), () => { selArv = null; desenhaArvore(); }); const ac = $('arv-acoes'); if (tem) { ac.innerHTML = '<div class="qs">✅ Aprendida</div>'; return true; } const b = document.createElement('button'); b.className = 'ab'; b.disabled = !pode || AR.pts < 1; b.textContent = !pode ? '🔒 Aprenda um nó ligado a este primeiro' : AR.pts < 1 ? 'Falta 1 ponto' : 'Aprender (1 pt)';
    if (pode && AR.pts >= 1) tapBtn(b, () => { AR.pts -= 1; AR.arvP.push(selArv); salvaAR(); atualizaPts(); aplicaNivel(); aviso(P.ic + ' ' + P.nome + ': ' + P.txt + '!', '#7ad87a'); desenhaArvore(); }); ac.appendChild(b); return true; }
