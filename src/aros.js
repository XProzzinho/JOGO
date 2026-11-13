  // ===================== AROS DE NÍVEL: aparecem nos pés quando entra em luta (10 s) e se acumulam =====================
  const AROS = [
    { nv: 10, nome: 'Aro de Prata', c1: '#dfe6f0', c2: '#8a9ab8', glow: '#b8c8e8', forca: 0.35, pontas: 0, gemas: 4, chamas: 0 },
    { nv: 30, nome: 'Aro de Jade', c1: '#b8ffd0', c2: '#2aa86a', glow: '#5aff9a', forca: 0.45, pontas: 8, gemas: 6, chamas: 0 },
    { nv: 50, nome: 'Aro de Safira', c1: '#bfe8ff', c2: '#1a6aff', glow: '#3a9aff', forca: 0.55, pontas: 12, gemas: 8, chamas: 0 },
    { nv: 100, nome: 'Aro de Ametista', c1: '#efd0ff', c2: '#8a2ae8', glow: '#b45aff', forca: 0.7, pontas: 16, gemas: 8, chamas: 12 },
    { nv: 130, nome: 'Aro Carmesim', c1: '#ffd0d8', c2: '#e81a3a', glow: '#ff3a5a', forca: 0.8, pontas: 16, gemas: 10, chamas: 18 },
    { nv: 150, nome: 'Aro Solar', c1: '#fff6c0', c2: '#ffa010', glow: '#ffc23a', forca: 0.92, pontas: 20, gemas: 12, chamas: 24 },
    { nv: 200, nome: 'Aro do Firmamento', c1: '#ffffff', c2: '#ff5ad8', glow: '#ffe8ff', forca: 1, pontas: 24, gemas: 12, chamas: 30, arco: true }];
  const ARO_TEX = AROS.map((A, ti) => { const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.translate(256, 256); const R = 226;
    const arco = () => { const g = x.createConicGradient(0, 0, 0); ['#ff5a8a', '#ffd23c', '#5aff9a', '#5ae8ff', '#a07aff', '#ff5ad8', '#ff5a8a'].forEach((h, i) => g.addColorStop(i / 6, h)); return g; };
    const c1 = A.arco && x.createConicGradient ? arco() : A.c1, c2 = A.c2; x.lineCap = 'round'; x.lineJoin = 'round';
    // fundo da faixa (escuro e translúcido, pra o aro ler bem no chão claro)
    x.beginPath(); x.arc(0, 0, R * 0.99, 0, 7); x.arc(0, 0, R * 0.72, 0, 7, true); x.fillStyle = 'rgba(10,6,24,.35)'; x.fill('evenodd');
    x.shadowColor = A.glow; x.shadowBlur = 8 + A.forca * 18;
    // chamas pra fora
    for (let i = 0; i < A.chamas; i++) { x.save(); x.rotate(i / A.chamas * Math.PI * 2); const L = 12 + (i % 3) * 6; x.beginPath(); x.moveTo(-6, -R * 0.94); x.quadraticCurveTo(-8, -R * 0.94 - L * 0.6, 2, -R * 0.94 - L); x.quadraticCurveTo(6, -R * 0.94 - L * 0.4, 6, -R * 0.94); x.closePath(); x.fillStyle = c2; x.globalAlpha = 0.8; x.fill(); x.restore(); } x.globalAlpha = 1;
    // pontas
    for (let i = 0; i < A.pontas; i++) { x.save(); x.rotate(i / A.pontas * Math.PI * 2 + 0.13); const L = i % 2 ? 10 : 18; x.beginPath(); x.moveTo(-5, -R * 0.95); x.lineTo(0, -R * 0.95 - L); x.lineTo(5, -R * 0.95); x.closePath(); x.fillStyle = c1; x.fill(); x.restore(); }
    // anéis
    x.strokeStyle = c1; x.lineWidth = 6 + A.forca * 6; x.beginPath(); x.arc(0, 0, R * 0.93, 0, 7); x.stroke();
    x.strokeStyle = c2; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, R * 0.75, 0, 7); x.stroke();
    x.setLineDash([6, 7]); x.lineWidth = 1.6; x.strokeStyle = c1; x.beginPath(); x.arc(0, 0, R * 0.885, 0, 7); x.stroke(); x.setLineDash([]);
    // runas + o número do nível
    x.font = 'bold 22px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; const RU = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'; const N = 24;
    for (let i = 0; i < N; i++) { x.save(); x.rotate(i / N * Math.PI * 2); if (i % 6 === 0) { x.font = 'bold 21px sans-serif'; x.fillStyle = '#ffffff'; x.fillText(String(A.nv), 0, -R * 0.815); x.font = 'bold 22px serif'; } else { x.fillStyle = c1; x.fillText(RU[(i * 5 + ti * 3) % RU.length], 0, -R * 0.815); } x.restore(); }
    // gemas
    for (let i = 0; i < A.gemas; i++) { x.save(); x.rotate((i + 0.5) / A.gemas * Math.PI * 2); x.translate(0, -R * 0.93); x.rotate(Math.PI / 4); const s = 7 + A.forca * 5; x.fillStyle = '#ffffff'; x.fillRect(-s, -s, s * 2, s * 2); x.fillStyle = c2; x.fillRect(-s * 0.6, -s * 0.6, s * 1.2, s * 1.2); x.restore(); }
    const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; });
  const ARO = (() => { const G = new T3.Group(); G.visible = false; heroi.add(G); const geo = new T3.PlaneGeometry(1, 1);
    const L = AROS.map((A, i) => { const g = new T3.Group(); g.position.y = 0.05 + i * 0.3; G.add(g); const s = 1.75 + i * 0.1;
      const m = new T3.Mesh(geo, new T3.MeshBasicMaterial({ map: ARO_TEX[i], transparent: true, depthWrite: false, side: T3.DoubleSide, toneMapped: false, opacity: 0 })); m.rotation.x = -Math.PI / 2; m.scale.setScalar(s); g.add(m);
      const m2 = new T3.Mesh(geo, m.material.clone()); m2.material.blending = T3.AdditiveBlending; m2.material.color.set(A.glow); m2.rotation.x = -Math.PI / 2; m2.scale.setScalar(s * 1.04); m2.position.y = 0.005; g.add(m2);
      const fa = []; const nf = Math.round(4 + A.forca * 10); for (let k = 0; k < nf; k++) { const sp = glowSpr(g, 0, 0, 0, 0.18, A.glow, 0); fa.push({ sp, a: Math.random() * 6, h: Math.random(), v: 0.5 + Math.random() }); }
      return { g, m, m2, s, A, fa, dir: i % 2 ? -1 : 1 }; });
    return { G, L, t: 0, ultLuta: -99, lutaAte: 0 }; })();
  function arosTem() { return AROS.map((A, i) => AR.nv >= A.nv ? i : -1).filter(i => i >= 0); }
  function aroMostra(seg) { const T = arosTem(); if (!T.length) return; ARO.lutaAte = Math.max(ARO.lutaAte, gT + (seg || 10)); if (!ARO.G.visible) { ARO.G.visible = true; ARO.t = 0; } }
  // entrar em luta: dano causado ou recebido depois de um tempo parado
  // antes aparecia sozinho ao entrar em luta; agora é só pelo botão (fica 5 s)
  function aroLuta() {}
  const aroBtn = document.createElement('button'); aroBtn.id = 'aro-btn'; aroBtn.className = 'btn'; aroBtn.innerHTML = '💫 AROS'; aroBtn.hidden = true; document.body.appendChild(aroBtn);
  tapBtn(aroBtn, () => { if (!arosTem().length) { aviso('💫 Você ganha o primeiro aro no nível 10.', '#c8a8ff'); return; } if (ARO.G.visible && ARO.lutaAte > gT) { ARO.lutaAte = gT; return; } ARO.G.visible = false; aroMostra(5); som('magia', 0.5, 1.4); });
  setInterval(() => { aroBtn.hidden = !arosTem().length || typeof cenaQ === 'undefined' || !!cenaQ; aroBtn.classList.toggle('on', ARO.G.visible && ARO.lutaAte > gT); }, 500);
  function aroNovo(nv) { const A = AROS.find(a => a.nv === nv); if (!A) return; aroMostra(5); aviso('💫 Novo aro conquistado: ' + A.nome + ' (Nv ' + nv + ')! Toque em 💫 AROS pra mostrar.', A.glow); }
  function aroFrame(dt) { if (!ARO.G.visible) return; ARO.t += dt; const T = arosTem(), resta = ARO.lutaAte - gT;
    if (resta <= -0.8 || !T.length) { ARO.G.visible = false; return; } const sai = resta < 0 ? 1 + resta / 0.8 : 1;
    ARO.L.forEach((o, i) => { const tem = T.includes(i); o.g.visible = tem; if (!tem) return; const ord = T.indexOf(i), ent = clamp((ARO.t - ord * 0.12) / 0.5), e = 1 - Math.pow(1 - ent, 3);
      o.g.position.y = (0.05 + ord * 0.3) * e + Math.sin(gT * 1.6 + i) * 0.03 * e; const k = e * (1 + Math.sin(gT * 2.4 + i) * 0.025) * (0.4 + 0.6 * sai); o.m.scale.setScalar(o.s * k); o.m2.scale.setScalar(o.s * 1.04 * k);
      o.m.rotation.z += dt * o.dir * (0.6 + i * 0.12); o.m2.rotation.z = o.m.rotation.z; const op = e * sai; o.m.material.opacity = op * (0.75 + o.A.forca * 0.25); o.m2.material.opacity = op * (0.12 + o.A.forca * 0.28) * (0.7 + Math.sin(gT * 4 + i) * 0.3);
      o.fa.forEach(f => { f.h += dt * f.v * 0.5; if (f.h > 1) { f.h = 0; f.a = Math.random() * 6; } const r = o.s * 0.45 * k; f.sp.position.set(Math.cos(f.a) * r, f.h * (0.6 + o.A.forca * 1.4), Math.sin(f.a) * r); f.sp.material.opacity = op * (1 - f.h) * 0.9; }); }); }
