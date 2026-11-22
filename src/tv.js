
  /* =====================================================================
     JOGAR COM CONTROLE (Fire Stick, Android TV, controle Bluetooth)
     O app Android manda os botões (tvTecla) e os analógicos (tvEixo).
       Analógico esquerdo / setas = andar     Analógico direito = câmera
       A = atacar   B = pular   X = falar/agir   Y = trocar arma
       LB/RB/LT/RT = poderes 1-4   L3 = correr
       START / MENU (≡) = CURSOR (mão na tela pra clicar nos menus)
       Controle remoto do Fire: setas andam, OK ataca, ▶❚❚ fala, ≡ cursor
     No modo cursor: setas/analógico mexem a mão, A/OK clica, B/voltar sai.
     ===================================================================== */
  const TVC = { tv: false, cursor: false, cx: innerWidth / 2, cy: innerHeight / 2, ax: [0, 0, 0, 0, 0, 0, 0, 0], seta: {}, usado: false, dica: 0, lt: 0, rt: 0, hx: 0, hy: 0, ult: performance.now(), parado: 0 };
  try { TVC.tv = !!(window.AndroidTela && AndroidTela.ehTv && AndroidTela.ehTv()); } catch (e) {}
  window.TVC = TVC;

  const tvMao = document.createElement('div'); tvMao.id = 'tv-mao'; tvMao.className = 'arena-keep';
  tvMao.style.cssText = 'position:fixed;left:0;top:0;width:44px;height:44px;margin:-6px 0 0 -10px;z-index:2147483000;pointer-events:none;display:none;font-size:38px;filter:drop-shadow(0 0 6px #000) drop-shadow(0 0 12px #8a6bff);transition:transform .08s';
  tvMao.textContent = '👆'; document.body.appendChild(tvMao);
  const tvAjuda = document.createElement('div'); tvAjuda.className = 'arena-keep';
  tvAjuda.style.cssText = 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:2147482999;background:#000c;color:#fff;font:700 15px system-ui;padding:9px 16px;border-radius:14px;border:2px solid #8a6bff;display:none;pointer-events:none;text-align:center;max-width:92vw';
  document.body.appendChild(tvAjuda);
  function tvDica(t, seg) { tvAjuda.innerHTML = t; tvAjuda.style.display = 'block'; clearTimeout(tvAjuda._t); tvAjuda._t = setTimeout(() => { tvAjuda.style.display = 'none'; }, (seg || 4) * 1000); }

  function tvCursor(on) { TVC.cursor = on; tvMao.style.display = on ? 'block' : 'none'; tvPos();
    // solta o boneco quando vai mexer nos menus
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(k => keys[k] = false); input.x = 0; input.y = 0;
    if (on) tvDica('👆 <b>Modo cursor</b> · setas/analógico mexem · <b>A / OK</b> clica · <b>B / voltar</b> sai', 4); }
  function tvPos() { TVC.cx = Math.max(2, Math.min(innerWidth - 2, TVC.cx)); TVC.cy = Math.max(2, Math.min(innerHeight - 2, TVC.cy)); tvMao.style.left = TVC.cx + 'px'; tvMao.style.top = TVC.cy + 'px'; }

  /* clica onde a mão está (mouse + ponteiro: os botões do jogo já entendem) */
  function tvClica() { tvMao.style.transform = 'scale(.8)'; setTimeout(() => tvMao.style.transform = '', 120);
    const x = TVC.cx, y = TVC.cy; const el = document.elementFromPoint(x, y); if (!el) return;
    const o = { bubbles: true, cancelable: true, clientX: x, clientY: y, screenX: x, screenY: y, button: 0, buttons: 1, view: window };
    try { el.dispatchEvent(new PointerEvent('pointerdown', { ...o, pointerId: 77, pointerType: 'mouse', isPrimary: true })); } catch (e) {}
    el.dispatchEvent(new MouseEvent('mousedown', o));
    try { el.dispatchEvent(new PointerEvent('pointerup', { ...o, buttons: 0, pointerId: 77, pointerType: 'mouse', isPrimary: true })); } catch (e) {}
    el.dispatchEvent(new MouseEvent('mouseup', { ...o, buttons: 0 }));
    el.dispatchEvent(new MouseEvent('click', { ...o, buttons: 0 }));
    const campo = el.closest && el.closest('input,textarea,select,[contenteditable="true"]');
    if (campo) { try { campo.focus(); } catch (e) {} if (/^(INPUT|TEXTAREA)$/.test(campo.tagName) && !/^(checkbox|radio|button|submit|range|color)$/i.test(campo.type || '')) { try { AndroidTela.digitando(true); AndroidTela.teclado(); } catch (e) {} tvDica('⌨️ Digite no teclado da TV · <b>voltar</b> fecha o teclado', 4); } }
    else if (el.focus) { try { el.focus(); } catch (e) {} } }
  document.addEventListener('focusout', () => { setTimeout(() => { const a = document.activeElement; if (!a || !/^(INPUT|TEXTAREA)$/.test(a.tagName)) { try { AndroidTela.digitando(false); } catch (e) {} } }, 50); }, true);

  /* aperta uma tecla "de verdade" no jogo (o jogo já sabe jogar no teclado) */
  const TV_TECLA = { A: ['KeyF', 'f'], B: ['Space', ' '], X: ['KeyE', 'e'], Y: ['KeyQ', 'q'], LB: ['Digit1', '1'], RB: ['Digit2', '2'], LT: ['Digit3', '3'], RT: ['Digit4', '4'], ok: ['KeyF', 'f'], play: ['KeyE', 'e'], select: ['KeyC', 'c'], volta: ['Digit1', '1'], avanca: ['Digit2', '2'] };
  function tvTeclaJogo(code, key, d) { window.dispatchEvent(new KeyboardEvent(d ? 'keydown' : 'keyup', { code, key, bubbles: true })); }

  /* algum painel/janela aberta na frente do jogo? (aí o voltar fecha ele) */
  function tvFechaAlgo() { const esc = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
    const a = document.activeElement; if (a && a !== document.body) { a.dispatchEvent(esc); try { a.blur(); } catch (e) {} } else document.dispatchEvent(esc);
    // botões de fechar visíveis (✕ / Fechar / Voltar)
    const cands = [...document.querySelectorAll('button,.fechar,.x,[data-a="sair"],[id$="-x"],[id$="fecha"],[id$="-fechar"]')].filter(b => { const r = b.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return false; const t = (b.textContent || '').trim(); return /^(✕|✖|×|x|X|Fechar|Voltar|← Voltar|❌)$/.test(t) && getComputedStyle(b).visibility !== 'hidden'; });
    const b = cands[cands.length - 1]; if (b) { const r = b.getBoundingClientRect(); const ox = TVC.cx, oy = TVC.cy; TVC.cx = r.left + r.width / 2; TVC.cy = r.top + r.height / 2; tvClica(); TVC.cx = ox; TVC.cy = oy; tvPos(); return true; } return false; }

  function tvPrimeiraVez() { if (TVC.usado) return; TVC.usado = true;
    tvDica('🎮 Controle conectado! <b>Analógico</b> anda · <b>A</b> ataca · <b>B</b> pula · <b>X</b> fala · <b>Y</b> troca arma · <b>LB RB LT RT</b> poderes · <b>START/≡</b> cursor pros menus', 9); }

  window.tvTecla = (n, d, rep) => { tvPrimeiraVez();
    if (n === 'start' || n === 'menu') { if (d) tvCursor(!TVC.cursor); return; }
    if (n === 'voltar') { if (!d) return; if (TVC.cursor && !tvFechaAlgo()) tvCursor(false); else if (!TVC.cursor) tvFechaAlgo(); return; }
    const seta = { cima: [0, -1], baixo: [0, 1], esq: [-1, 0], dir: [1, 0] }[n];
    if (TVC.cursor) {
      if (seta) { TVC.seta[n] = d; if (d && !rep) { TVC.cx += seta[0] * 22; TVC.cy += seta[1] * 22; tvPos(); } return; }
      if ((n === 'A' || n === 'ok') && d) return tvClica();
      if (n === 'B' && d) { if (!tvFechaAlgo()) tvCursor(false); return; }
      return; }
    if (seta) { keys[{ cima: 'ArrowUp', baixo: 'ArrowDown', esq: 'ArrowLeft', dir: 'ArrowRight' }[n]] = d; return; }
    if (n === 'L3') { input.run = d; return; }
    if (n === 'R3' && d) { camYaw = 0; return; }
    const k = TV_TECLA[n]; if (k) tvTeclaJogo(k[0], k[1], d); };

  window.tvEixo = (lx, ly, rx, ry, lt, rt, hx, hy) => { tvPrimeiraVez(); TVC.ax = [lx, ly, rx, ry]; TVC.parado = 0;
    // gatilhos analógicos viram botão
    if (lt > 0.5 !== TVC.lt > 0.5) window.tvTecla('LT', lt > 0.5); if (rt > 0.5 !== TVC.rt > 0.5) window.tvTecla('RT', rt > 0.5); TVC.lt = lt; TVC.rt = rt;
    // direcional que chega como "chapéu"
    const hxN = Math.round(hx), hyN = Math.round(hy);
    if (hxN !== TVC.hx) { if (TVC.hx) window.tvTecla(TVC.hx < 0 ? 'esq' : 'dir', false); if (hxN) window.tvTecla(hxN < 0 ? 'esq' : 'dir', true); TVC.hx = hxN; }
    if (hyN !== TVC.hy) { if (TVC.hy) window.tvTecla(TVC.hy < 0 ? 'cima' : 'baixo', false); if (hyN) window.tvTecla(hyN < 0 ? 'cima' : 'baixo', true); TVC.hy = hyN; }
    if (!TVC.cursor) { input.x = lx; input.y = ly; } };

  /* quadro a quadro: câmera no analógico direito, mão do cursor andando */
  (function tvLoop(agora) { requestAnimationFrame(tvLoop); const dt = Math.min(0.05, (agora - TVC.ult) / 1000); TVC.ult = agora; if (!TVC.usado) return;
    const [lx, ly, rx, ry] = TVC.ax;
    if (TVC.cursor) { const v = 1100 * dt; let mx = lx + rx * 0.6, my = ly + ry * 0.6;
      if (TVC.seta.esq) mx -= 1; if (TVC.seta.dir) mx += 1; if (TVC.seta.cima) my -= 1; if (TVC.seta.baixo) my += 1;
      if (mx || my) { const m = Math.hypot(mx, my); const acel = Math.min(1.6, 0.45 + m * m); TVC.cx += mx * v * acel / Math.max(1, m); TVC.cy += my * v * acel / Math.max(1, m); tvPos(); }
      // analógico direito também rola listas
      if (Math.abs(ry) > 0.3) { const el = document.elementFromPoint(TVC.cx, TVC.cy); let p = el; while (p && p !== document.body) { if (p.scrollHeight > p.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(p).overflowY)) { p.scrollTop += ry * 900 * dt; break; } p = p.parentElement; } } }
    else if (rx || ry) { camYaw -= rx * 2.4 * dt; camPitch = clamp(camPitch + ry * 1.4 * dt, CAM_P0, CAM_P1); } })(performance.now());

  /* na TV: imagem mais leve (Fire Stick é mais fraco que celular) e cursor ligado na tela de entrar */
  if (TVC.tv) {
    document.body.classList.add('na-tv');
    setTimeout(() => { try { renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 0.85)); resize(); } catch (e) {} }, 500);
    setTimeout(() => { const vis = id => { const e = document.getElementById(id); return e && !e.hidden && e.getBoundingClientRect().width > 0; }; if (['login', 'criar', 'nacao-p', 'srv-p', 'intro'].some(vis)) { tvCursor(true); TVC.usado = true; } }, 2500);
    setTimeout(() => tvDica('📺 <b>Aetherion na TV</b> · aperte <b>≡ (menu)</b> ou <b>START</b> pra usar o cursor nos menus', 7), 3000);
  }
