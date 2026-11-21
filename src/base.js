// JOGO — base: renderizador em tela cheia, luzes e utilidades
(function () {
  const T3 = THREE;
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  const cv = document.getElementById('jogo-cv');
  const renderer = new T3.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  /* MODO JOGO do celular (Desempenho / Equilibrado / Economia de bateria): o app avisa e o jogo ajusta a qualidade */
  window.modoJogoMuda = n => { const d = window.devicePixelRatio || 1, ant = window.__modoJogo; window.__modoJogo = n;
    renderer.setPixelRatio(n === 3 ? Math.min(d, 1) : n === 2 ? Math.min(d, 2) : Math.min(d, 1.75)); try { renderer.domElement.style.width = ''; renderer.domElement.style.height = ''; resize(); } catch (e) {}
    if (ant !== undefined && ant !== n && typeof aviso === 'function') aviso({ 1: '🎮 Modo jogo: Equilibrado', 2: '🎮 Modo jogo: Desempenho', 3: '🔋 Modo jogo: Economia de bateria', 4: '🎮 Modo jogo: Personalizado' }[n] || '🎮 Modo jogo', '#8a9aff'); };
  try { if (window.AndroidTela && AndroidTela.modoJogo) { const n = AndroidTela.modoJogo(); if (n > 0) setTimeout(() => window.modoJogoMuda(n), 0); } } catch (e) {}
  /* POWER DELIVERY: com o celular na tomada mostra se está carregando ou se o Game Booster pausou a carga (⚡ direto da tomada).
     tocar abre o Game Booster da Samsung pra ligar o "Pausar USB Power Delivery" */
  try { if (window.AndroidTela && AndroidTela.bateria) { const pd = document.createElement('button'); pd.id = 'pd-pill';
    pd.style.cssText = 'position:fixed;left:8px;top:8px;z-index:9000;height:30px;padding:0 11px;border-radius:15px;border:1.5px solid #fff8;color:#fff;font:700 12px system-ui;text-shadow:0 1px 2px #000a;box-shadow:0 2px 8px #0006;display:none;opacity:.92;transition:all .4s';
    let curto = 0, ult = '';
    pd.onclick = () => { curto = 0; try { const r = AndroidTela.gameBooster(); if (typeof aviso === 'function') aviso(r === 'booster' ? '⚡ Ligue "Pausar USB Power Delivery" e volte pro jogo' : r === 'launcher' ? '⚡ No Game Launcher: Game Booster → Pausar USB Power Delivery' : 'Não achei o Game Booster neste celular'); } catch (e) {} };
    document.body.appendChild(pd);
    const olha = () => { try { const [nv, tom, carr, ma] = String(AndroidTela.bateria()).split(',').map(Number);
      if (!tom) { pd.style.display = 'none'; curto = 0; ult = ''; return; }
      const direto = !carr && Math.abs(ma) < 150; // na tomada, sem entrar carga na bateria = Power Delivery funcionando
      const est = direto ? 'pd' : 'carga'; if (est !== ult) { curto = 0; ult = est; }
      curto++;
      pd.style.display = 'block';
      pd.style.background = direto ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#d97706,#f59e0b)';
      pd.textContent = curto > 4 ? (direto ? '⚡' : '🔋 ' + nv + '%') : direto ? '⚡ Power Delivery ligado — direto da tomada' : '🔋 Carregando ' + nv + '% — toque pra ligar o Power Delivery';
    } catch (e) {} };
    setInterval(olha, 4000); setTimeout(olha, 1500); } } catch (e) {}
  renderer.outputColorSpace = T3.SRGBColorSpace;
  const scene = new T3.Scene();
  const cam = new T3.PerspectiveCamera(55, 1, 0.1, 800);
  const hemi = new T3.HemisphereLight(0xdfefff, 0x5a7a4a, 1.3); scene.add(hemi);
  const sun = new T3.DirectionalLight(0xfff2dc, 1.8); sun.position.set(12, 30, 10); scene.add(sun);
  const rim = new T3.DirectionalLight(0x9ac8ff, 0.5); rim.position.set(-20, 12, -20); scene.add(rim);
  const BOX = new T3.BoxGeometry(1, 1, 1);
  function grp(p, x = 0, y = 0, z = 0) { const g = new T3.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; }
  function resize() { const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  window.addEventListener('resize', resize); resize();
  const eOut = x => 1 - Math.pow(1 - x, 3);
  const BMATS = {}; function bmat(c) { return BMATS[c] || (BMATS[c] = new T3.MeshBasicMaterial({ color: c, toneMapped: false })); }
  function particles(p, n, color, size) { const im = new T3.InstancedMesh(BOX, bmat(color), n); im.frustumCulled = false; p.add(im); const d = new T3.Object3D();
    im.userData.place = function (fn) { for (let i = 0; i < n; i++) { d.scale.setScalar(size); d.rotation.set(0, 0, 0); const r = fn(i, d); if (r === false) d.scale.setScalar(0.0001); d.updateMatrix(); im.setMatrixAt(i, d.matrix); } im.instanceMatrix.needsUpdate = true; }; return im; }
