  // ===================== BUFFS DE GM / ADM (mandados pelo Painel ADM) =====================
  // O painel grava em buffs/{uid}: { lista: [{ id, tipo, pct, ate (ms, 0 = permanente), imune, porNome }] }
  var GMB_INFO = { forca: ['Força Suprema', '#ff3a2a'], protecao: ['Proteção Divina', '#3aa8ff'], regen: ['Regeneração Suprema', '#3aff7a'], velocidade: ['Velocidade Suprema', '#b05aff'], xp: ['Experiência Divina', '#ffc83a'], divino: ['Poder Divino', '#ffe8a0'] };
  var GMB = [], gmbVistos = {}, gmbOuvindo = false, gmbAuras = {};
  function gmAtivos() { const ag = Date.now(); return (GMB || []).filter(b => GMB_INFO[b.tipo] && (!b.ate || b.ate > ag)); }
  function gmPct(tipo) { let v = 0; gmAtivos().forEach(b => { if (b.tipo === tipo) v = Math.max(v, b.pct || 0); if (b.tipo === 'divino' && tipo !== 'imune') v = Math.max(v, (b.pct || 0) / 2); }); return v / 100; }
  function gmImune() { return gmAtivos().some(b => b.tipo === 'divino' && b.imune); }
  function gmDur(b) { if (!b.ate) return '∞'; const s = Math.max(0, Math.round((b.ate - Date.now()) / 1000)); return s >= 3600 ? Math.floor(s / 3600) + 'h' + String(Math.floor(s % 3600 / 60)).padStart(2, '0') : s >= 60 ? Math.floor(s / 60) + ' min' : s + ' s'; }
  function gmOuve() { if (gmbOuvindo || !window.CONTA || !CONTA.db || !CONTA.usuario) return; gmbOuvindo = true;
    CONTA.db.collection('buffs').doc(CONTA.usuario.uid).onSnapshot(d => { const L = (d.exists && d.data().lista) || []; const primeira = !Object.keys(gmbVistos).length && !GMB.length;
      L.forEach(b => { if (!gmbVistos[b.id]) { gmbVistos[b.id] = 1; if (!primeira && GMB_INFO[b.tipo] && (!b.ate || b.ate > Date.now())) { aviso(IC('gm_' + b.tipo) + ' ' + (b.porNome || 'Um GM') + ' te deu <b>' + GMB_INFO[b.tipo][0] + '</b> (' + (b.ate ? gmDur(b) : 'permanente') + ')', GMB_INFO[b.tipo][1]); flash('rgba(255,240,180,.4)'); som('missao_ok', 0.8, 1); } } });
      if (GMB.length && !L.length) aviso('Os buffs de GM foram removidos.', '#8a9aba'); GMB = L; gmHud(); }, () => { gmbOuvindo = false; }); }
  function gmHud() { const el = $('gm-buffs'); const A = gmAtivos(); el.hidden = !A.length; el.innerHTML = A.map(b => `<span style="--c:${GMB_INFO[b.tipo][1]}">${IC('gm_' + b.tipo)}<small>${gmDur(b)}</small></span>`).join(''); }
  var gmT = 0;
  function gmFrame(dt) { gmT += dt; if (gmT > 1) { gmT = 0; gmOuve(); gmHud(); }
    const A = gmAtivos(), p = heroi.position; const r = gmPct('regen'); if (r > 0) { vida = Math.min(VIDA_MAX, vida + VIDA_MAX * r * 0.05 * dt); mana = Math.min(MANA_MAX, mana + MANA_MAX * r * 0.05 * dt); }
    Object.keys(GMB_INFO).forEach((k, i) => { const on = A.some(b => b.tipo === k); let a = gmbAuras[k]; if (on && !a) { a = gmbAuras[k] = { s: glowSpr(world, 0, 0, 0, 1.6, GMB_INFO[k][1], 0.5), q: glowSpr(world, 0, 0, 0, 0.5, GMB_INFO[k][1], 0.9) }; }
      if (!a) return; a.s.visible = a.q.visible = on && !dentro; if (!on) return; const t = gT * 2 + i * 1.05; a.s.position.set(p.x, p.y + 0.15, p.z); a.s.scale.setScalar(1.5 + Math.sin(gT * 3 + i) * 0.15); a.s.material.opacity = 0.16;
      a.q.position.set(p.x + Math.cos(t) * 0.75, p.y + 0.5 + ((gT * 0.6 + i * 0.3) % 1.6), p.z + Math.sin(t) * 0.75); }); }
  // perfil público com "visto por último", pro painel saber quem está online
  setInterval(() => { try { if (window.CONTA && CONTA.db && CONTA.usuario) CONTA.db.collection('perfis').doc(CONTA.usuario.uid).set({ nome: trNome(), codigo: trCodigo(CONTA.usuario.uid), nv: AR.nv || 1, classe: AR.classe || '', titulo: AR.titulo || '', visto: Date.now() }, { merge: true }).catch(() => {}); } catch (e) {} }, 60000);
  setTimeout(() => { try { if (window.CONTA && CONTA.db && CONTA.usuario) CONTA.db.collection('perfis').doc(CONTA.usuario.uid).set({ visto: Date.now(), classe: AR.classe || '' }, { merge: true }).catch(() => {}); } catch (e) {} }, 8000);
