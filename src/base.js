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
