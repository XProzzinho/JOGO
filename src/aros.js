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
  const ARO = (() => { const G = new T3.Group(); G.visible = false; heroi.add(G); const plano = new T3.PlaneGeometry(1, 1), GEM = new T3.OctahedronGeometry(0.06, 0), PON = new T3.ConeGeometry(0.03, 0.12, 6);
    const ARCO = ['#ff5a8a', '#ffd23c', '#5aff9a', '#5ae8ff', '#a07aff', '#ff5ad8'];
    const L = AROS.map((A, i) => { const g = new T3.Group(); g.position.y = 0.3 + i * 0.29; G.add(g); const t = new T3.Group(); g.add(t); const r = 0.78 + (i % 2) * 0.08 + A.forca * 0.1, dir = i % 2 ? -1 : 1;
      t.rotation.set(0.12 * dir, 0, 0.1 * -dir);
      const metal = new T3.MeshStandardMaterial({ color: A.c2, emissive: A.c2, emissiveIntensity: 0.35 + A.forca * 0.5, metalness: 0.75, roughness: 0.3, transparent: true, opacity: 0 });
      const brilho = new T3.MeshBasicMaterial({ color: A.c1, transparent: true, opacity: 0, toneMapped: false });
      const aro = new T3.Mesh(new T3.TorusGeometry(r, 0.03 + A.forca * 0.025, 10, 72), metal); aro.rotation.x = Math.PI / 2; t.add(aro);
      const fio = new T3.Mesh(new T3.TorusGeometry(r * 0.9, 0.012, 6, 72), brilho); fio.rotation.x = Math.PI / 2; t.add(fio);
      const fio2 = new T3.Mesh(new T3.TorusGeometry(r * 1.07, 0.008, 6, 72), brilho); fio2.rotation.x = Math.PI / 2; t.add(fio2);
      // faixa de runas (a textura do aro) no plano do anel
      const fx = new T3.Mesh(plano, new T3.MeshBasicMaterial({ map: ARO_TEX[i], transparent: true, depthWrite: false, side: T3.DoubleSide, toneMapped: false, opacity: 0 })); fx.rotation.x = -Math.PI / 2; fx.scale.setScalar(r * 2.3); t.add(fx);
      const gl = new T3.Mesh(plano, new T3.MeshBasicMaterial({ map: ARO_TEX[i], transparent: true, depthWrite: false, side: T3.DoubleSide, toneMapped: false, opacity: 0, blending: T3.AdditiveBlending, color: A.glow })); gl.rotation.x = -Math.PI / 2; gl.scale.setScalar(r * 2.38); t.add(gl);
      // gemas em cima do aro
      const gemas = []; for (let k = 0; k < A.gemas; k++) { const q = k / A.gemas * Math.PI * 2; const m = new T3.Mesh(GEM, new T3.MeshBasicMaterial({ color: A.arco ? ARCO[k % 6] : A.c1, transparent: true, opacity: 0, toneMapped: false })); m.position.set(Math.cos(q) * r, 0, Math.sin(q) * r); m.scale.set(1, 1.5, 1).multiplyScalar(0.8 + A.forca * 0.6); t.add(m); gemas.push(m); }
      // pontas pra fora
      const pontas = []; for (let k = 0; k < A.pontas; k++) { const q = (k + 0.5) / A.pontas * Math.PI * 2; const m = new T3.Mesh(PON, metal); m.position.set(Math.cos(q) * (r + 0.07), 0, Math.sin(q) * (r + 0.07)); m.rotation.z = -Math.PI / 2; m.rotation.y = -q; m.scale.setScalar(k % 2 ? 0.7 : 1.1); t.add(m); pontas.push(m); }
      // faíscas e chamas girando no aro
      const fa = []; const nf = Math.round(3 + A.forca * 6 + A.chamas / 4); for (let k = 0; k < nf; k++) { const sp = glowSpr(t, 0, 0, 0, 0.16 + A.forca * 0.12, A.arco ? ARCO[k % 6] : A.glow, 0); fa.push({ sp, a: k / nf * Math.PI * 2, v: 0.6 + Math.random() * 0.8, y: Math.random() }); }
      return { g, t, r, A, dir, mats: [metal, brilho, fx.material, gl.material], gemas, fa, f: Math.random() * 6 }; });
    return { G, L, t: 0, ultLuta: -99, lutaAte: 0 }; })();
  function arosTem() { return AROS.map((A, i) => AR.nv >= A.nv ? i : -1).filter(i => i >= 0); }
  function aroMostra(seg) { const T = arosTem(); if (!T.length) return; ARO.lutaAte = Math.max(ARO.lutaAte, gT + (seg || 10)); if (!ARO.G.visible) { ARO.G.visible = true; ARO.t = 0; } }
  // entrar em luta: dano causado ou recebido depois de um tempo parado
  function aroLuta() { if (gT - ARO.ultLuta > 12 && ARO.lutaAte < gT) aroMostra(10); ARO.ultLuta = gT; }
  function aroNovo(nv) { const A = AROS.find(a => a.nv === nv); if (!A) return; aroMostra(10); aviso('💫 Novo aro conquistado: ' + A.nome + ' (Nv ' + nv + ')! Ele aparece nos seus pés quando você entra em luta.', A.glow); }
  function aroFrame(dt) { if (!ARO.G.visible) return; ARO.t += dt; const T = arosTem(), resta = ARO.lutaAte - gT;
    if (resta <= -0.8 || !T.length) { ARO.G.visible = false; return; } const sai = resta < 0 ? 1 + resta / 0.8 : 1;
    ARO.L.forEach((o, i) => { const tem = T.includes(i); o.g.visible = tem; if (!tem) return; const ord = T.indexOf(i), ent = clamp((ARO.t - ord * 0.14) / 0.6), e = 1 - Math.pow(1 - ent, 3), op = e * sai;
      // sobe um em cima do outro e fica flutuando em volta do corpo
      o.g.position.y = (0.3 + ord * 0.29) * (0.3 + 0.7 * e) + Math.sin(gT * 1.7 + o.f) * 0.05; const k = (0.3 + 0.7 * e) * (1 + Math.sin(gT * 2.2 + i) * 0.02); o.g.scale.setScalar(k);
      o.t.rotation.y += dt * o.dir * (0.7 + i * 0.1); o.t.rotation.x = 0.12 * o.dir + Math.sin(gT * 0.9 + o.f) * 0.08; o.t.rotation.z = -0.1 * o.dir + Math.cos(gT * 0.8 + o.f) * 0.08;
      o.mats[0].opacity = op; o.mats[1].opacity = op * 0.9; o.mats[2].opacity = op * (0.65 + o.A.forca * 0.3); o.mats[3].opacity = op * (0.15 + o.A.forca * 0.3) * (0.7 + Math.sin(gT * 4 + i) * 0.3);
      o.gemas.forEach((g, n) => { g.material.opacity = op; g.rotation.y += dt * 3; });
      o.fa.forEach(f => { f.a += dt * f.v * o.dir * 1.6; f.y += dt * 0.8; if (f.y > 1) f.y = 0; f.sp.position.set(Math.cos(f.a) * o.r, Math.sin(f.y * Math.PI * 2) * 0.05 + (o.A.chamas ? f.y * 0.25 : 0), Math.sin(f.a) * o.r); f.sp.material.opacity = op * (o.A.chamas ? (1 - f.y) : 0.8); }); }); }
