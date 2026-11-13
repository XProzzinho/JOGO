
  // ===================== LIVROS DE HABILIDADE (vendidos pela deusa Elysia) =====================
  // Por enquanto: Guerreiro. Cada classe só aprende/usa as habilidades da própria classe.
  // As habilidades de classe vão entrar uma por uma. Por enquanto a Elysia vende as asas e as habilidades delas.
  var CB_LISTA = [{ id: 'cb_voar', nome: 'Voar', r: 1, t: 'voo', e: 'vento', req: '*' }, { id: 'cb_impulso_eletrico', nome: 'Impulso Elétrico', r: 1, t: 'impulso', e: 'raio', req: 'asa_thunder' }, { id: 'cb_teleporte_galactico', nome: 'Teleporte Galáctico', r: 1, t: 'teleg', e: 'magia', req: 'asa_galaxy' }, { id: 'cb_mandala', nome: 'Juízo Solar', r: 10, t: 'mandala', e: 'luz', lendaria: true, divino: 'mandala' }, { id: 'cb_mandala_def', nome: 'Égide Solar', r: 10, t: 'mandef', e: 'luz', lendaria: true, divino: 'mandala' }, { id: 'cb_mandala_sete', nome: 'Sete Sóis', r: 10, t: 'sete', e: 'fogo', lendaria: true, divino: 'mandala' }, { id: 'cb_arauto', nome: 'Arauto das Chamas', r: 10, t: 'arauto', e: 'fogo', lendaria: true }, { id: 'cb_mandala_selo', nome: 'Selo do Juízo', r: 10, t: 'selo', e: 'luz', lendaria: true, divino: 'mandala' }];
  var CB_COR = { magia: '#b46aff', terra: '#d8a24a', agua: '#4ab0ff', vento: '#7affc8', fogo: '#ff6a2a', gelo: '#bff2ff', raio: '#ffe85a', veneno: '#8aff4a', luz: '#fff2a8', sombra: '#a05aff', sangue: '#ff3a4a', cura: '#7aff9a', aco: '#dfe4ee' };
  var CB_ELN = { magia: 'magia', terra: 'terra', agua: 'água', vento: 'vento', fogo: 'fogo', gelo: 'gelo', raio: 'raio', veneno: 'veneno', luz: 'luz', sombra: 'sombra', sangue: 'sangue', cura: 'cura', aco: 'aço' };
  var CB_PRECO = [0, 0, 40, 70, 100, 150, 200, 260, 330, 420, 500];
  var CB_INFO = { // custo de mana, recarga (s), descrição
    estocada: [10, 2, 'Estocada rápida na frente: atravessa quem estiver na linha.'], corte: [12, 3, 'Corte largo na sua frente.'], giro: [16, 5, 'Gira a espada e acerta todo mundo em volta.'],
    investida: [14, 5, 'Avança com tudo e atordoa quem estiver no caminho.'], recuo: [6, 4, 'Salta pra trás e foge do perigo.'], projetil: [10, 2, 'Dispara um projétil de {el}.'],
    rajada: [14, 3, 'Três projéteis de {el} em leque.'], lanca: [18, 4, 'Lança de {el} que atravessa todos em linha reta.'], canhao: [24, 6, 'Bola gigante de {el} que explode em área.'],
    arremesso: [10, 3, 'Arremessa a arma no bicho mais perto.'], combo: [18, 6, 'Sequência de 4 golpes seguidos.'], onda: [26, 8, 'Onda de choque em volta: dano e atordoa.'],
    terremoto: [32, 12, 'Três ondas de terremoto, cada uma maior que a outra.'], tornado: [30, 12, 'Um tornado na sua frente puxa e machuca tudo por 2 segundos.'], meteoros: [40, 16, 'Chuva de meteoros em cima dos inimigos.'],
    nevasca: [36, 14, 'Nevasca: gelo cai do céu e congela os bichos.'], raios: [38, 14, 'Raios caem do céu em até 6 inimigos.'], sopro: [16, 5, 'Sopro de fogo do dragão: queima quem estiver na frente.'],
    salto: [20, 7, 'Pula alto e cai esmagando o chão.'], grito: [18, 10, 'Grito que atordoa e deixa os bichos fracos.'], voo: [0, 2, 'Abre as asas e voa (precisa estar com asas). Voar gasta mana.'], impulso: [15, 5, 'Só voando com a Asa Thunder: dispara pra frente num raio elétrico que atordoa.'], teleg: [15, 6, 'Só voando com a Asa Galaxy: teleporta 9 metros pra frente.'],
    revive: [50, 90, 'Volta com a vida e a mana cheias.'], cura: [24, 20, 'Recupera 40% da vida.'],
    b_atk: [15, 30, 'Por {d} s: +25% de ataque.'], b_def: [15, 30, 'Por {d} s: +20% de defesa.'], b_crit: [15, 30, 'Por {d} s: +15% de chance de crítico.'], b_res: [15, 30, 'Por {d} s: recebe 20% menos dano.'],
    b_regen: [15, 30, 'Por {d} s: a vida volta sozinha.'], b_mana: [10, 30, 'Por {d} s: a mana volta mais rápido.'], b_inv: [40, 60, 'Por 4 s: não leva dano nenhum.'], b_esq: [15, 30, 'Por {d} s: +25% de esquiva.'],
    b_abs: [25, 40, 'Por {d} s: uma barreira absorve 40% do dano.'], b_tudo: [25, 45, 'Por {d} s: +15% ataque, +10% defesa e +5% crítico.'], b_aura: [20, 30, 'Por {d} s: aura de {el} que machuca quem chegar perto.'],
    mandala: [40, 45, 'DIVINA · Ataque: por 30 s, a cada ataque os dois elos dourados da Mandala se soltam, voam girando, cortam os inimigos várias vezes e voltam pras costas.'], arauto: [50, 75, 'LENDÁRIA · Invoca a Armadura do Arauto das Chamas no seu corpo por 30 s: elmo de chifres, ombreiras flamejantes, peitoral com rubi e o Brasão Ígneo nas costas. +30% de ataque, ataques 30% mais rápidos e +20% de defesa.'], selo: [30, 35, 'DIVINA · Prende o inimigo mais perto (e até 4 em volta dele) no Selo do Juízo: o elo grande gira embaixo dos pés e o pequeno em cima da cabeça. Por 15 s eles perdem 25% de defesa (tomam +25% de dano de tudo).'], sete: [45, 50, 'DIVINA · A Mandala se divide em 7 sóis pequenos que giram deitados em volta de você como serras por 30 s, cortando qualquer bicho ou chefe que chegar perto.'], mandef: [35, 60, 'DIVINA · Defesa: a Mandala vem pra frente, se expande e gira rápido, um anel pra cada lado. Bloqueia TODO o dano por 30 s.'], gm: [0, 30, 'Só o Administrador: tudo no máximo por 60 s e vida cheia.'], gm_mal: [0, 20, 'Só o Administrador: amaldiçoa todos os bichos em volta.'],
    p_atk: [0, 0, 'Passiva: +4% de ataque pra sempre.'], p_def: [0, 0, 'Passiva: +3% de defesa pra sempre.'], p_crit: [0, 0, 'Passiva: +2% de crítico pra sempre.'], p_vida: [0, 0, 'Passiva: +15 de vida máxima.'], p_mana: [0, 0, 'Passiva: +10 de mana máxima.'], p_tudo: [0, 0, 'Passiva: +5% ataque, +4% defesa, +3% crítico e +20 de vida.'] };
  var CB_PW = {}, CB_CD = {}, cbAuraEl = null, cbAuraT = 0;
  CB_LISTA.forEach(s => { const I = CB_INFO[s.t]; s.icone = IC(s.id); s.passiva = s.t.indexOf('p_') === 0; s.custo = Math.round(I[0] * (1 + (s.r - 1) * 0.12)); s.cdS = I[1]; s.dur = 15 + s.r * 2;
    s.desc = I[2].replace('{el}', CB_ELN[s.e] || 'energia').replace('{d}', s.dur); s.tipo = 'uso'; s.ramo = 'livro'; s.cabal = true; s.preco = s.lendaria ? 15000 : CB_PRECO[s.r]; s.nvMin = 1; if (s.lendaria) s.dur = 30; CB_PW[s.id] = s; PW[s.id] = s; PODERES.push(s); });
  AR.cbt = (AR.cbt || []).filter(id => CB_PW[id]); for (let i = 3; i < NSLOTS; i++) if (/^cb_/.test(AR.barra[i] || '') && !CB_PW[AR.barra[i]]) AR.barra[i] = null;
  (AR.pags || []).forEach(pg => pg && pg.forEach((id, i) => { if (/^cb_/.test(id || '') && !CB_PW[id]) pg[i] = null; }));
  function cbTem(id) { const s = CB_PW && CB_PW[id]; if (s && s.divino) return AR.divino === s.divino; return (AR.cbt || []).includes(id); }
  function cbPas(k) { let v = 0; if (!CB_PW || AR.classe !== 'guerreiro') return v; (AR.cbt || []).forEach(id => { const s = CB_PW[id]; if (!s || !s.passiva) return; const t = s.t;
      if (k === 'atk') v += t === 'p_atk' ? 0.04 : t === 'p_tudo' ? 0.05 : 0; if (k === 'def') v += t === 'p_def' ? 3 : t === 'p_tudo' ? 4 : 0; if (k === 'crit') v += t === 'p_crit' ? 0.02 : t === 'p_tudo' ? 0.03 : 0;
      if (k === 'vida') v += t === 'p_vida' ? 15 : t === 'p_tudo' ? 20 : 0; if (k === 'mana') v += t === 'p_mana' ? 10 : 0; }); return v; }
  function cbB(k) { return typeof BUFF !== 'undefined' && BUFF[k] > 0; }
  function cbPode(s) { if (s.req && (s.req === '*' ? !(AR.cosm && ASAT[AR.cosm]) : AR.cosm !== s.req)) { aviso(s.nome + ': precisa vestir ' + (s.req === '*' ? 'umas asas' : 'a ' + COSM[s.req].nome) + '.', '#ff6a6a'); return false; }
    if ((s.t === 'impulso' || s.t === 'teleg') && !voando) { aviso(s.nome + ': só funciona voando.', '#ff6a6a'); return false; }
    if (s.cls && AR.classe !== s.cls) { aviso(s.icone + ' ' + s.nome + ': só ' + CLASSES[s.cls].nome + ' pode usar.', '#ff6a6a'); return false; }
    if (s.passiva) { aviso(s.icone + ' ' + s.nome + ' é passiva: já está sempre ativa.', '#ffd23c'); return false; }
    if (s.divino) { const at = divAtiva(); if (at && at[0] !== s.id) { aviso('⛔ ' + CB_PW[at[0]].nome + ' está ativa (' + Math.ceil(at[1]) + ' s). Só uma habilidade divina por vez!', '#ffb040'); return false; } }
    if ((s.t === 'gm' || s.t === 'gm_mal') && !souAdmin()) { aviso('Só o Administrador pode usar ' + s.nome + '.', '#ff6a6a'); return false; }
    const f = (CB_CD[s.id] || 0) - performance.now(); if (f > 0) { aviso(s.nome + ': recarregando (' + Math.ceil(f / 1000) + ' s)', '#8a9aba'); return false; } return true; }
  function cbEl(e, el) { if (el === 'gelo') congelar(e, 1.5); else if (el === 'raio' || el === 'terra') e.stun = Math.max(e.stun, el === 'raio' ? 0.6 : 0.8); else if (el === 'fogo') e.queima = 3;
    else if (el === 'veneno') { e.queima = 5; e.vuln = Math.max(e.vuln, 3); } else if (el === 'agua' || el === 'sombra') e.vuln = Math.max(e.vuln, 4);
    else if (el === 'vento') { const dx = e.g.position.x - heroi.position.x, dz = e.g.position.z - heroi.position.z, d = Math.hypot(dx, dz) || 1; empurra(e, dx / d, dz / d, 1.2); }
    else if (el === 'sangue') vida = Math.min(VIDA_MAX, vida + 2); }
  // qual habilidade divina está ativa agora (só uma por vez)
  function divAtiva() { if (BUFF.mandala > 0) return ['cb_mandala', BUFF.mandala]; if (BUFF.mandef > 0) return ['cb_mandala_def', BUFF.mandef]; if (BUFF.sete > 0) return ['cb_mandala_sete', BUFF.sete];
    const sl = typeof SELOS !== 'undefined' && SELOS.find(x => x.principal && x.f.selo > 0); if (sl) return ['cb_mandala_selo', sl.f.selo]; return null; }
  function cabalPoder(pw) { if (!pw || !pw.cabal) return; const s = pw, p = heroi.position, M = atkMult() * (1 + (s.r - 1) * 0.22), c = CB_COR[s.e] || '#ffffff', tp = s.e === 'gelo' || s.e === 'fogo' ? s.e : null;
    CB_CD[s.id] = performance.now() + s.cdS * 1000;
    const mira = r => { const e = maisPerto(r); if (e) facing = Math.atan2(e.g.position.x - p.x, e.g.position.z - p.z); return e; };
    const hit = (e, b) => { const cr = critico(); dano(e, b * M * (cr ? 2 : 1), tp, cr); cbEl(e, s.e); };
    const golpe = n => { atkT = 0; atkN = n || 1; atkHit = true; som('espada', 0.7, n === 3 ? 0.85 : null); };
    const opEl = () => s.e === 'gelo' ? { gelo: 1.5 } : s.e === 'raio' || s.e === 'terra' ? { stun: 0.6 } : s.e === 'fogo' || s.e === 'veneno' ? { veneno: true } : s.e === 'agua' || s.e === 'sombra' ? { marca: true } : {};
    const alvoC = (r, d) => { const e = mira(r); return e ? [e.g.position.x, e.g.position.z] : [p.x + Math.sin(facing) * d, p.z + Math.cos(facing) * d]; };
    const buffA = (k, d, txt) => { BUFF[k] = Math.max(BUFF[k] || 0, d); fx('luz', [p.x, 0, p.z], 0.6); fx('cura', [p.x, 0, p.z], 0.8); aviso(s.icone + ' ' + s.nome + (txt ? ': ' + txt : ''), c); };
    switch (s.t) {
      case 'estocada': mira(5); golpe(1); caminho(p.x, p.z, facing, 4, 0.9, e => hit(e, 30)); fx('vento', frente(1.5), 0.4); break;
      case 'corte': mira(4); golpe(3); caminho(p.x, p.z, facing, 3.2, 1.7, e => hit(e, 34)); tremor = Math.max(tremor, 0.15); fx('luz', frente(1.8), 0.3); break;
      case 'giro': golpe(3); area(p.x, p.z, 3.6, e => hit(e, 30)); fx('vento', [p.x, 0, p.z], 0.8); break;
      case 'investida': mira(10); caminho(p.x, p.z, facing, 7, 0.9, e => { hit(e, 28); e.stun = Math.max(e.stun, 1); }); arranca(facing, 7, 0.28); golpe(1); fx('vento', [p.x, 0, p.z], 0.6); break;
      case 'recuo': arranca(facing + Math.PI, 6, 0.25); fx('vento', [p.x, 0, p.z], 0.5); if (s.e === 'vento') BUFF.cb_esq = Math.max(BUFF.cb_esq || 0, 3); break;
      case 'projetil': mira(20); proj(p.x, p.y + 1.25, p.z, facing, c, 22 * M, 28, 20, opEl()); break;
      case 'rajada': mira(18); [-0.22, 0, 0.22].forEach(da => proj(p.x, p.y + 1.25, p.z, facing + da, c, 15 * M, 26, 16, opEl())); break;
      case 'lanca': mira(22); proj(p.x, p.y + 1.25, p.z, facing, c, 34 * M, 34, 22, Object.assign({ fura: true, tam: 1.2 }, opEl())); break;
      case 'canhao': mira(20); proj(p.x, p.y + 1.25, p.z, facing, c, 0, 16, 18, { tam: 1.9, explode: { r: 3.4, dano: 48 * M, tipo: tp } }); break;
      case 'arremesso': { const a = alvoC(14, 8); lanca(a, 0.55, c, () => { fx('luz', [a[0], 0, a[1]], 0.5); area(a[0], a[1], 2.4, e => hit(e, 30)); }); break; }
      case 'combo': mira(5); [0, 160, 320, 480].forEach((t, i) => setTimeout(() => { golpe((i % 3) + 1); caminho(heroi.position.x, heroi.position.z, facing, 3.2, 1.4, e => hit(e, 14)); }, t)); break;
      case 'onda': golpe(3); area(p.x, p.z, 6, e => { hit(e, 38); e.stun = Math.max(e.stun, 1); }); fx('luz', [p.x, 0, p.z], 0.7); fx('fumo', [p.x, 0, p.z], 1); tremor = 0.45; flash('rgba(255,255,255,.25)'); break;
      case 'terremoto': [0, 350, 700].forEach((t, i) => setTimeout(() => { const q = heroi.position; area(q.x, q.z, 3 + i * 2.5, e => { hit(e, 26); e.stun = Math.max(e.stun, 0.8); }); fx('fumo', [q.x, 0, q.z], 0.9); tremor = Math.max(tremor, 0.5); som('tremor', 0.6); }, t)); break;
      case 'tornado': { const a = alvoC(10, 4); for (let k = 0; k < 8; k++) setTimeout(() => { fx('vento', [a[0], 0, a[1]], 0.4); area(a[0], a[1], 3, e => { hit(e, 11); const dx = a[0] - e.g.position.x, dz = a[1] - e.g.position.z, d = Math.hypot(dx, dz) || 1; empurra(e, dx / d, dz / d, 0.3); }); }, k * 250); break; }
      case 'meteoros': case 'nevasca': { const a = alvoC(16, 7); for (let k = 0; k < 9; k++) { const an = Math.random() * 6.28, rr = Math.random() * 3.2, x = a[0] + Math.cos(an) * rr, z = a[1] + Math.sin(an) * rr;
          setTimeout(() => lanca([x, z], 0.45, c, () => { fx(s.t === 'nevasca' ? 'gelo' : 'fogo', [x, 0, z], 0.5); tremor = Math.max(tremor, 0.15); area(x, z, 2.2, e => hit(e, 24)); }), k * 110); } break; }
      case 'raios': { const L = FERAS.filter(e => feraAtiva(e) && Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z) < 12).slice(0, 6); if (!L.length) { aviso('Nenhum bicho perto.', '#8a9aba'); break; }
        L.forEach((e, k) => setTimeout(() => { if (e.morto) return; linhaLuz({ x: e.g.position.x, y: 12, z: e.g.position.z }, { x: e.g.position.x, y: 0, z: e.g.position.z }, c, 10); hit(e, 42); flash('rgba(255,240,150,.25)'); }, k * 140)); break; }
      case 'sopro': mira(6); fx('chama', [p.x, p.y, p.z], 0.8, facing); setTimeout(() => caminho(heroi.position.x, heroi.position.z, facing, 5, 1.3, e => { hit(e, 30); e.queima = 4; }), 120); break;
      case 'salto': if (!noChao) { CB_CD[s.id] = 0; break; } vy = PULO * 1.7; noChao = false; esmaga = true; break;
      case 'grito': area(p.x, p.z, 7, e => { e.stun = Math.max(e.stun, 2); e.vuln = 6; hit(e, 15); }); fx('vento', [p.x, 0, p.z], 0.9); flash('rgba(255,120,80,.2)'); som('grito', 0.7); break;
      case 'mandala': buffA('mandala', s.dur, 'os elos dourados te protegem por ' + s.dur + ' s!'); flash('rgba(255,200,80,.45)'); som('missao_ok', 0.8, 0.8); setTimeout(() => haloAtk(true), 350); break;
      case 'arauto': buffA('arauto', 30, 'a Armadura do Arauto das Chamas te envolve por 30 s!'); break;
      case 'selo': if (!seloAplica()) { mana += s.custo; CB_CD[s.id] = 0; } break;
      case 'sete': buffA('sete', 30, 'os Sete Sóis giram em volta de você por 30 s!'); flash('rgba(255,170,60,.4)'); break;
      case 'mandef': buffA('mandef', 30, 'defesa total por 30 s!'); flash('rgba(255,220,120,.5)'); som('portal', 0.9, 1.2); tremor = Math.max(tremor, 0.25); break;
      case 'voo': voa(!voando); break;
      case 'impulso': { const a0 = facing; caminho(p.x, p.z, a0, 9, 1.1, e => { hit(e, 36); e.stun = Math.max(e.stun, 1.2); }); linhaLuz({ x: p.x, y: p.y + 1, z: p.z }, { x: p.x + Math.sin(a0) * 9, y: p.y + 1, z: p.z + Math.cos(a0) * 9 }, c, 12); arranca(a0, 9, 0.22); flash('rgba(120,220,255,.3)'); som('raio', 0.7); break; }
      case 'teleg': fx('luz', [p.x, p.y, p.z], 0.5); p.x += Math.sin(facing) * 9; p.z += Math.cos(facing) * 9; fx('luz', [p.x, p.y, p.z], 0.5); flash('rgba(160,90,255,.3)'); break;
      case 'revive': vida = VIDA_MAX; mana = MANA_MAX; fx('cura', [p.x, 0, p.z], 2); flash('rgba(255,255,220,.6)'); aviso(s.icone + ' Vida e mana cheias!', '#fff2a0'); break;
      case 'cura': { const v = Math.round(VIDA_MAX * 0.4); vida = Math.min(VIDA_MAX, vida + v); numero(p, '+' + v, '#7ad87a'); fx('cura', [p.x, 0, p.z], 1.5); break; }
      case 'b_atk': buffA('cb_atk', s.dur, '+25% de ataque'); break; case 'b_def': buffA('cb_def', s.dur, '+20% de defesa'); break; case 'b_crit': buffA('cb_crit', s.dur, '+15% de crítico'); break;
      case 'b_res': buffA('cb_res', s.dur, '-20% de dano recebido'); break; case 'b_regen': buffA('cb_regen', s.dur, 'vida voltando'); break; case 'b_mana': buffA('cb_mana', s.dur, 'mana voltando'); break;
      case 'b_inv': buffA('cb_inv', 4, 'invencível por 4 s!'); break; case 'b_esq': buffA('cb_esq', s.dur, '+25% de esquiva'); break; case 'b_abs': buffA('cb_abs', s.dur, 'barreira ativa'); break;
      case 'b_tudo': buffA('cb_tudo', s.dur, 'tudo melhorado'); break; case 'b_aura': cbAuraEl = s.e; buffA('cb_aura', s.dur, 'aura de ' + CB_ELN[s.e]); break;
      case 'gm': ['cb_atk', 'cb_def', 'cb_crit', 'cb_tudo', 'cb_regen', 'cb_mana'].forEach(k => BUFF[k] = Math.max(BUFF[k] || 0, 60)); vida = VIDA_MAX; mana = MANA_MAX; flash('rgba(255,90,170,.35)'); fx('luz', [p.x, 0, p.z], 1); aviso(s.icone + ' ' + s.nome + ': poder do Administrador!', '#ff5aa8'); break;
      case 'gm_mal': area(p.x, p.z, 12, e => { e.vuln = 10; e.queima = 8; e.stun = Math.max(e.stun, 3); numero(e.g.position, '💀', '#c890ff', e.T.alt + 0.6); }); flash('rgba(120,40,180,.4)'); break;
    } }
  var asaRastro = [], asaRT = 0;
  function cbFrame(dt) { const p = heroi.position; const AF = AR.cosm && COSM[AR.cosm];
    if (voando && AF && AF.cor) { asaRT -= dt; if (asaRT <= 0) { asaRT = 0.05; const bx = p.x - Math.sin(facing) * 0.4, bz = p.z - Math.cos(facing) * 0.4; [1, -1].forEach(sd => { const ox = Math.cos(facing) * 0.9 * sd, oz = -Math.sin(facing) * 0.9 * sd; asaRastro.push({ s: glowSpr(world, bx + ox, p.y + 1.4 + Math.random() * 0.2, bz + oz, 0.35, Math.random() < 0.5 ? AF.cor : AF.cor2, 0.8), t: 0 }); }); } }
    for (let i = asaRastro.length - 1; i >= 0; i--) { const r = asaRastro[i]; r.t += dt; r.s.material.opacity = 0.8 * (1 - r.t / 0.6); r.s.position.y -= dt * 0.4; r.s.scale.multiplyScalar(1 - dt * 1.2); if (r.t > 0.6) { world.remove(r.s); r.s.material.dispose(); asaRastro.splice(i, 1); } } if (cbB('cb_regen')) vida = Math.min(VIDA_MAX, vida + 6 * dt); if (cbB('cb_mana')) mana = Math.min(MANA_MAX, mana + 6 * dt);
    if (cbB('cb_aura')) { cbAuraT -= dt; if (cbAuraT <= 0) { cbAuraT = 1; const M = atkMult(); area(p.x, p.z, 3, e => { dano(e, 8 * M, cbAuraEl === 'gelo' || cbAuraEl === 'fogo' ? cbAuraEl : null); cbEl(e, cbAuraEl); }); fx('vento', [p.x, 0, p.z], 0.4); } }
    const now = performance.now(); SLOTS.forEach((b, i) => { const s = CB_PW[AR.barra[i]]; let o = b.querySelector('.cdv'); const f = s ? (CB_CD[s.id] || 0) - now : 0;
      if (f > 0) { if (!o) { o = document.createElement('span'); o.className = 'cdv'; b.appendChild(o); } const t = Math.ceil(f / 1000) + ''; if (o.textContent !== t) o.textContent = t; } else if (o) o.remove(); }); }
  // ---- páginas da barra (3 páginas de 5 slots livres) ----
  function trocaPag() { AR.pags = AR.pags || [null, null, null]; AR.pag = AR.pag || 0; AR.pags[AR.pag] = AR.barra.slice(3); AR.pag = (AR.pag + 1) % 3; const nv = AR.pags[AR.pag] || [null, null, null, null, null];
    for (let i = 3; i < NSLOTS; i++) { const v = AR.barra[i]; if (v && ativo[v] && !nv.includes(v)) ativo[v] = false; AR.barra[i] = nv[i - 3] || null; } salvaAR(); montaBarra(); pagBtn.innerHTML = '⇅<small>' + (AR.pag + 1) + '/3</small>'; som('clique', 0.5, 1); }
  var pagBtn = document.createElement('button'); pagBtn.id = 'pag-btn'; pagBtn.innerHTML = '⇅<small>' + ((AR.pag || 0) + 1) + '/3</small>'; barra.appendChild(pagBtn); tapBtn(pagBtn, trocaPag);
  // ---- loja da deusa ----
  var livAba = 'div';
  function abrirLivros() { if (conversa || cenaQ) return; som('magia', 0.6); desenhaLivros(); $('livp').hidden = false; }
  function livBtn(txt, cls, fn, off) { const b = document.createElement('button'); b.className = cls; b.innerHTML = txt; b.disabled = !!off; if (!off && fn) tapBtn(b, fn); return b; }
  function desenhaLivros() { const L = $('liv-lista'); L.innerHTML = ''; $('liv-m').textContent = (AR.inv.moedas || 0).toLocaleString('pt-BR'); const adm = souAdmin();
    $('liv-cls').innerHTML = livAba === 'asas' ? 'Asas tecnológicas: vista em <b>Costas</b> e ganhe o bônus. <b>Voar</b> só com permissão do Administrador.' : livAba === 'mont' ? 'Montarias: equipe em <b>🎒 › Montaria</b> e toque em <b>MONTAR</b>.' : livAba === 'pet' ? 'Pets: ficam do seu lado e ajudam na luta.' : 'Habilidades: as de cada classe vão chegar aos poucos.<span>Página da barra: ' + ((AR.pag || 0) + 1) + '/3 (⇅ troca)</span>';
    const R = $('liv-ranks'); R.innerHTML = ''; [['div', '✦ Divinos'], ['asas', 'Asas'], ['mont', 'Montarias'], ['pet', 'Pets'], ['hab', 'Habilidades']].forEach(([k, t]) => R.appendChild(livBtn(t, 'lr' + (livAba === k ? ' on' : ''), () => { livAba = k; desenhaLivros(); })));
    if (livAba === 'mont' || livAba === 'pet') { const pet = livAba === 'pet', LST = pet ? PETS : MONT, tenho = pet ? AR.pets : AR.monts;
      Object.keys(LST).forEach(k => { const F = LST[k], tem = tenho.includes(k), on = pet ? AR.pet === k : AR.mont === k; const d = document.createElement('div'); d.className = 'li asa' + (tem ? ' tem' : '');
        d.innerHTML = `<span class="ic">${F.icone}</span><div class="tx"><b>${F.nome}</b><small>${F.desc}</small></div><div class="ac"></div>`; const ac = d.querySelector('.ac');
        if (tem) ac.appendChild(livBtn(pet ? (on ? 'Guardar' : 'Chamar') : (on ? '✔ Equipada' : 'Equipar'), 'cp', () => { if (pet) petChama(k); else montaVeste(on ? null : k); desenhaLivros(); }));
        else { const caro = !adm && (AR.inv.moedas || 0) < F.preco; ac.appendChild(livBtn(adm ? 'Pegar (ADM)' : 'Comprar · ' + F.preco + ' <img class="ico" src="icones/item_moedas.svg" alt="">', 'cp', () => { if (!adm) AR.inv.moedas -= F.preco; tenho.push(k); if (pet) petChama(k); else montaVeste(k); atualizaInv(); som('compra', 0.8, 1); flash('rgba(255,255,255,.3)'); desenhaLivros(); }, caro)); }
        L.appendChild(d); }); return; }
    if (livAba === 'div') { Object.keys(DIVINOS).forEach(k => { const F = DIVINOS[k], tem = AR.divinos.includes(k), on = AR.divino === k; const d = document.createElement('div'); d.className = 'li lend' + (tem ? ' tem' : '');
        d.innerHTML = `<span class="ic">${F.icone}</span><div class="tx"><b><i class="lendtag">✦ DIVINO</i> ${F.nome}</b><small>${F.desc}</small>${F.habs.length ? `<small>Habilidades: ${F.habs.map(id => CB_PW[id].icone.replace('class="ico"', 'class="ico mini"') + ' ' + CB_PW[id].nome).join(' · ')}</small>` : '<small>✨ Item visual divino</small>'}</div><div class="ac"></div>`; const ac = d.querySelector('.ac');
        if (tem) ac.appendChild(livBtn(on ? '✔ Equipado' : 'Equipar', 'cp', () => { divVeste(on ? null : k); desenhaLivros(); }));
        else { const caro = !adm && (AR.inv.moedas || 0) < F.preco; ac.appendChild(livBtn(adm ? 'Pegar (ADM)' : 'Comprar · ' + F.preco.toLocaleString('pt-BR') + ' <img class="ico" src="icones/item_moedas.svg" alt="">', 'cp', () => { if (!adm) AR.inv.moedas -= F.preco; AR.divinos.push(k); divVeste(k); atualizaInv(); som('compra', 0.8, 1); flash('rgba(255,220,120,.45)'); desenhaLivros(); }, caro)); }
        L.appendChild(d); }); $('liv-cls').innerHTML = 'Itens divinos: equipe no espaço <b>✦ Divino</b> do seu equipamento. Eles liberam habilidades próprias na barra.'; return; }
    if (livAba === 'asas') { Object.keys(COSM).filter(k => COSM[k].loja).forEach(k => { const F = COSM[k], tem = AR.cosms.includes(k), on = AR.cosm === k; const d = document.createElement('div'); d.className = 'li asa' + (tem ? ' tem' : '');
        d.innerHTML = `<span class="ic">${F.icone}</span><div class="tx"><b style="color:${F.cor}">${F.nome}</b><small>${F.desc}</small></div><div class="ac"></div>`; const ac = d.querySelector('.ac');
        if (tem) ac.appendChild(livBtn(on ? '✔ Vestida' : 'Vestir', 'cp', () => { vesteCosm(on ? null : k); desenhaLivros(); }));
        else { const caro = !adm && (AR.inv.moedas || 0) < F.preco; ac.appendChild(livBtn(adm ? 'Pegar (ADM)' : 'Comprar · ' + F.preco + ' <img class="ico" src="icones/item_moedas.svg" alt="">', 'cp', () => { if (!adm) AR.inv.moedas -= F.preco; AR.cosms.push(k); vesteCosm(k); atualizaInv(); som('compra', 0.8, 1); flash('rgba(255,255,255,.3)'); aviso('Comprou: ' + F.icone + ' ' + F.nome + '! Já está vestida.', F.cor); desenhaLivros(); }, caro)); }
        L.appendChild(d); }); return; }
    CB_LISTA.filter(s => !s.divino).forEach(s => { const tem = cbTem(s.id); const d = document.createElement('div'); d.className = 'li' + (tem ? ' tem' : '') + (s.lendaria ? ' lend' : '');
      const req = s.req === '*' ? 'Precisa de asas' : s.req ? 'Precisa da ' + COSM[s.req].nome : '';
      d.innerHTML = `<span class="ic">${s.icone}</span><div class="tx"><b>${s.lendaria ? '<i class="lendtag">✦ LENDÁRIA</i> ' : ''}${s.nome}</b><small>${s.passiva ? 'Passiva' : 'Mana ' + s.custo + ' · recarga ' + s.cdS + ' s'}${req ? ' · ' + req : ''}</small><small>${s.desc}</small></div><div class="ac"></div>`; const ac = d.querySelector('.ac');
      if (s.cls && AR.classe !== s.cls) ac.innerHTML = '<span class="trava">🔒 Só ' + CLASSES[s.cls].nome + '</span>';
      else if (tem) { for (let i = 3; i < NSLOTS; i++) ac.appendChild(livBtn(String(i + 1), 'sl' + (AR.barra[i] === s.id ? ' aqui' : ''), (i => () => { const j = AR.barra.indexOf(s.id); if (j >= 3) AR.barra[j] = null; if (j !== i) AR.barra[i] = s.id; salvaAR(); montaBarra(); desenhaLivros(); })(i))); }
      else { const caro = !adm && (AR.inv.moedas || 0) < s.preco; ac.appendChild(livBtn(adm ? 'Aprender (ADM)' : s.preco ? 'Aprender · ' + s.preco + ' 💰' : 'Aprender · grátis', 'cp', () => { if (!adm) AR.inv.moedas -= s.preco; AR.cbt = AR.cbt || []; AR.cbt.push(s.id); const v = AR.barra.indexOf(null, 3); if (v >= 3) AR.barra[v] = s.id;
          salvaAR(); montaBarra(); atualizaInv(); som('compra', 0.8, 1); aviso('Aprendeu: ' + s.icone + ' ' + s.nome + '!', '#ffd23c'); desenhaLivros(); }, caro)); }
      L.appendChild(d); }); }
  tapBtn($('liv-fecha'), () => { $('livp').hidden = true; });
  { const ely = NPCS.find(n => n.deusa); if (ely) ely.escolhas = () => [{ t: '🪽 <b>Loja da Deusa</b><small>Asas tecnológicas e habilidades</small>', fn: abrirLivros }, { t: 'Agora não', fn: null }]; }
  aplicaNivel(); montaBarra();
