  // ===================== ROTA DO GLADIADOR: Dança do Chakram + 6 habilidades (adaptado do Gladiador 3D) =====================
  const GPAL = { negra: '#0f0817', aura: '#231136', dourada: '#ffc83d', luz: '#ffe885', roxa: '#9b20ff', roxaB: '#c86bff', rocha: '#3a3236' };
  const GLAD = [
    { id: 'gl_danca', nome: 'Dança Chakram', titulo: 'Dança do Chakram', custo: 40, cd: 8, cor: GPAL.dourada, desc: 'Combo completo: arremessa o chakram, 5 cortes seguidos, arremesso em órbita, mortal com o chakram no céu e um giro final que explode tudo em volta.' },
    { id: 'gl_devastador', nome: 'Devastador', titulo: 'Golpe Devastador', custo: 45, cd: 9, cor: GPAL.dourada, desc: 'Salta alto pra frente e cai com o chakram abrindo uma cratera: dano forte em área e atordoa.' },
    { id: 'gl_investida', nome: 'Investida', titulo: 'Investida Abissal', custo: 40, cd: 8, cor: GPAL.roxa, desc: 'Corre em disparada com o chakram na frente e atropela todo mundo no caminho.' },
    { id: 'gl_furia', nome: 'Fúria', titulo: 'Fúria do Coliseu', custo: 55, cd: 10, cor: GPAL.roxaB, desc: 'Gira 4 vezes com os braços abertos, cortando tudo em volta 3 vezes, a última mais forte.' },
    { id: 'gl_sismo', nome: 'Sísmico', titulo: 'Impacto Sísmico', custo: 60, cd: 12, cor: GPAL.dourada, desc: 'Pula e soca o chão: terremoto com pedras voando, dano enorme em área e atordoa por 2 segundos.' },
    { id: 'gl_egide', nome: 'Égide', titulo: 'Égide das Sombras', custo: 50, cd: 16, cor: GPAL.roxa, desc: 'Cúpula sombria com runas: empurra os inimigos e reduz 60% do dano que você recebe por 4 segundos.' },
    { id: 'gl_julgamento', nome: 'Julgamento', titulo: 'Julgamento do Campeão', custo: 90, cd: 22, cor: GPAL.luz, desc: 'O chakram cresce, você salta e crava no chão: 4 crateras em linha reta na frente com dano gigante.' }];
  const GL = { ativo: null, t: 0, f: {}, vfx: [], egide: 0, spin: 0, flip: 0, pose: null };
  GLAD.forEach(L => { L.glad = true; const h = { id: L.id, nome: L.nome, icone: IC('p_' + L.id), tipo: 'uso', custo: L.custo, lend: L, glad: true, nvMin: 5, desc: '⚔️ GLADIADOR · ' + L.desc + ' (recarga ' + L.cd + ' s) · 🌀 Precisa de chakram na mão.' }; PODERES.push(h); PW[L.id] = h; });
  // ---------- texturas (do coliseu) ----------
  const GTEX = { cratera: canvasTex(256, 256, (g) => { const cx = 128, cy = 128; const gr = g.createRadialGradient(cx, cy, 8, cx, cy, 120); gr.addColorStop(0, 'rgba(255,200,61,.95)'); gr.addColorStop(0.28, 'rgba(155,32,255,.72)'); gr.addColorStop(0.62, 'rgba(15,8,23,.92)'); gr.addColorStop(1, 'rgba(15,8,23,0)'); g.clearRect(0, 0, 256, 256); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
      g.lineWidth = 3; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + (Math.random() - 0.5) * 0.2, len = 55 + Math.random() * 58; g.strokeStyle = i % 2 ? 'rgba(185,85,255,.85)' : 'rgba(255,215,90,.9)'; g.beginPath(); g.moveTo(cx, cy); let r = 18; while (r < len) { r += 14; const j = (Math.random() - 0.5) * 0.25; g.lineTo(cx + Math.cos(a + j) * r, cy + Math.sin(a + j) * r); } g.stroke(); } }),
    runas: canvasTex(256, 256, (g) => { const cx = 128, cy = 128; g.clearRect(0, 0, 256, 256); g.strokeStyle = '#c86bff'; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 114, 0, Math.PI * 2); g.stroke(); g.strokeStyle = '#ffc83d'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 94, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#ffe885'; g.font = 'bold 16px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; const r = ['✦', '◈', '❖', '⚔', '✧', '❂', '✹', '❖', '✦', '◈', '✧', '❂']; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(r[i], cx + Math.cos(a) * 104, cy + Math.sin(a) * 104); } }) };
  // ---------- chakram ornamental (lâminas negras, filigrana dourada, núcleo roxo) ----------
  const GCHK = (() => { const g = new T3.Group(); const negro = new T3.MeshStandardMaterial({ color: '#0b0a0f', metalness: 0.9, roughness: 0.2, side: T3.DoubleSide }), ouro = new T3.MeshStandardMaterial({ color: '#f4b936', metalness: 0.9, roughness: 0.22, emissive: '#5c3a04', emissiveIntensity: 0.45, side: T3.DoubleSide }), bronze = new T3.MeshStandardMaterial({ color: '#9c8974', metalness: 0.85, roughness: 0.3 });
    const arco = (r1, a1, ox, r2, a2, d, b) => { const s = new T3.Shape(); s.absarc(ox[0], 0, r1, -Math.PI * a1, Math.PI * a1, false); s.absarc(ox[1], 0, r2, Math.PI * a2, -Math.PI * a2, true); s.closePath(); const geo = new T3.ExtrudeGeometry(s, { depth: d, bevelEnabled: !!b, bevelThickness: 0.018, bevelSize: 0.025, bevelSegments: 2, curveSegments: 22 }); geo.center(); return geo; };
    const gMain = arco(1.48, 0.56, [0, -0.24], 1.06, 0.52, 0.045, 1); g.add(new T3.Mesh(gMain, negro)); g.add(new T3.Mesh(arco(1.38, 0.52, [-0.05, -0.2], 1.15, 0.48, 0.055, 0), ouro));
    const gOut = arco(1.72, 0.32, [0.18, 0.04], 1.44, 0.30, 0.036, 1); g.add(new T3.Mesh(gOut, negro)); const ot = new T3.Mesh(gOut, ouro); ot.scale.set(0.97, 0.97, 1.18); g.add(ot);
    [-1, 1].forEach(d => { const h = new T3.Mesh(new T3.ConeGeometry(0.11, 0.46, 5), ouro); h.position.set(1.12, d * 1.18, 0); h.rotation.z = d * -0.75; g.add(h); });
    const base = new T3.Mesh(new T3.BoxGeometry(0.32, 0.62, 0.44), bronze); base.position.x = 0.32; const cav = new T3.Mesh(new T3.DodecahedronGeometry(0.17, 1), bronze); cav.scale.set(1.15, 1.25, 0.9); cav.position.set(0.45, -0.06, 0); g.add(base, cav);
    const nuc = new T3.Mesh(new T3.OctahedronGeometry(0.11, 1), new T3.MeshBasicMaterial({ color: GPAL.luz, toneMapped: false })); nuc.position.set(0.51, 0.04, 0); g.add(nuc);
    const auraM = new T3.MeshBasicMaterial({ color: GPAL.roxaB, transparent: true, opacity: 0, depthWrite: false, side: T3.DoubleSide, toneMapped: false }); const aura = new T3.Mesh(gMain, auraM); aura.scale.set(1.08, 1.08, 1.6); g.add(aura);
    g.userData = { nuc, auraM, aura }; g.visible = false; return g; })();
  const gMao = grp(heroi.userData.P.elR, 0, -0.36, 0.06); const GCHK_ESC = 0.42;
  // a arma usada é a SUA arma equipada (chakram da mão); o modelo ornamental fica só de reserva
  function gArma() { if (AR.arma === 'chakram') return GCHK; const A = typeof ARMAG !== 'undefined' && ARMAG[AR.arma]; return A || GCHK; }
  function chkNaMao() { const W = GL.W || gArma(); if (W === GCHK) { gPoe(GCHK, gMao, BAINHA.mao.R); return; }
    const H = W.userData.casa; if (!H) return; if (W.parent !== H.pai) H.pai.add(W); W.position.copy(H.pos); W.rotation.copy(H.rot); W.scale.copy(H.esc); }
  function chkSolto() { const W = GL.W; if (!W) return; if (W.parent === world) return; if (W !== GCHK && !W.userData.casa) W.userData.casa = { pai: W.parent, pos: W.position.clone(), rot: W.rotation.clone(), esc: W.scale.clone() };
    const ws = new T3.Vector3(); W.getWorldScale(ws); world.add(W); W.scale.copy(ws).multiplyScalar(1.35); }

  function chkMundo(v) { gMao.updateMatrixWorld(true); return gMao.localToWorld(v.set(0, 0, 0.1)); }
  // ===== BAINHA DO GLADIADOR: 2 chakrams (mesmas malhas, sem duplicar geometria) — nas costas como asas quando guardados, nos antebraços em combate =====
  const GCHK_E = GCHK.clone(); // clone do Three reaproveita as mesmas geometrias e materiais
  const HP = heroi.userData.P, LADO_R = Math.sign(HP.shR.position.x) || -1;
  const gMaoE = grp(HP.elL, 0, -0.36, 0.06), costasR = grp(HP.spine, 0, 0, 0), costasL = grp(HP.spine, 0, 0, 0);
  const BAINHA = {
    costas: { R: { pos: [0.3 * LADO_R, 0.5, -0.2], rot: [0.18, LADO_R > 0 ? Math.PI : 0, -0.55], esc: 0.27 }, L: { pos: [-0.3 * LADO_R, 0.5, -0.2], rot: [0.18, LADO_R > 0 ? 0 : Math.PI, -0.55], esc: 0.27 } },
    mao: { R: { pos: [0, -0.04, 0.1], rot: [0.25, Math.PI / 2, 0], esc: GCHK_ESC }, L: { pos: [0, -0.04, 0.1], rot: [0.25, -Math.PI / 2, 0], esc: GCHK_ESC } } };
  function gPoe(m, pai, t) { if (m.parent !== pai) pai.add(m); m.position.set(...t.pos); m.rotation.set(...t.rot); m.scale.setScalar(t.esc); }
  GL.combate = 0; GL.bainha = null;
  function gBainha(estado) { GL.bainha = estado; if (estado === 'mao') { if (GL.W !== GCHK || GCHK.parent !== world) gPoe(GCHK, gMao, BAINHA.mao.R); gPoe(GCHK_E, gMaoE, BAINHA.mao.L); } else { gPoe(GCHK, costasR, BAINHA.costas.R); gPoe(GCHK_E, costasL, BAINHA.costas.L); } }
  (() => { if (ARMAG.chakram) [...ARMAG.chakram.children].forEach(c => ARMAG.chakram.remove(c)); if (ARMAE.chakram) [...ARMAE.chakram.children].forEach(c => ARMAE.chakram.remove(c)); [GCHK, GCHK_E].forEach(m => m.traverse(o => { if (o.isMesh) o.castShadow = true; })); gBainha('costas'); })();
  function gBainhaFrame(dt) { const tem = AR.arma === 'chakram'; GCHK.visible = GCHK_E.visible = tem; if (!tem) return; GL.combate -= dt; const quer = GL.ativo || GL.combate > 0 ? 'mao' : 'costas';
    if (quer !== GL.bainha && !(GL.W === GCHK && GCHK.parent === world)) { gBainha(quer); if (quer === 'mao') som('espada', 0.35, 1.4); } }
  // ---------- efeitos ----------
  const gmat = (c, op, add) => new T3.MeshBasicMaterial({ color: c, transparent: true, opacity: op, side: T3.DoubleSide, depthWrite: false, toneMapped: false, blending: add ? T3.AdditiveBlending : T3.NormalBlending });
  const GGEO = { onda: new T3.RingGeometry(0.25, 0.55, 40), part: new T3.OctahedronGeometry(0.11, 0), pedra: new T3.DodecahedronGeometry(0.18, 0) }; const GPEDRA = new T3.MeshStandardMaterial({ color: GPAL.rocha, roughness: 0.9 });
  function gOnda(x, z, c, max, vel, y) { const m = new T3.Mesh(GGEO.onda, gmat(c, 0.95)); m.rotation.x = -Math.PI / 2; m.position.set(x, y || 0.08, z); world.add(m); GL.vfx.push({ k: 'onda', m, r: 0.5, max, vel: vel || 15 }); }
  function gCorte(x, y, z, r, c, tz) { const m = new T3.Mesh(new T3.TorusGeometry(r, 0.11, 6, 40, Math.PI * 1.45), gmat(c, 0.95)); m.position.set(x, y, z); m.rotation.x = Math.PI / 2; m.rotation.z = tz || 0; world.add(m); GL.vfx.push({ k: 'corte', m, v: 0.34, max: 0.34, geo: true }); }
  function gCratera(x, z, esc, dur) { const m = new T3.Mesh(new T3.PlaneGeometry(3.4 * esc, 3.4 * esc), new T3.MeshBasicMaterial({ map: GTEX.cratera, transparent: true, depthWrite: false, toneMapped: false })); m.rotation.x = -Math.PI / 2; m.rotation.z = Math.random() * 6.28; m.position.set(x, 0.04, z); world.add(m); GL.vfx.push({ k: 'cratera', m, v: dur || 3.5, max: dur || 3.5, geo: true }); }
  function gPedras(x, z, n, f) { for (let i = 0; i < n; i++) { const m = new T3.Mesh(GGEO.pedra, GPEDRA); const s = 0.6 + Math.random() * 1.1; m.scale.set(s, s * 0.8, s); m.position.set(x + (Math.random() - 0.5) * 0.8, 0.25, z + (Math.random() - 0.5) * 0.8); world.add(m); const a = Math.random() * 6.28, sp = (0.35 + Math.random() * 0.65) * f; GL.vfx.push({ k: 'pedra', m, vel: new T3.Vector3(Math.cos(a) * sp, 3.8 + Math.random() * f * 0.75, Math.sin(a) * sp), rv: Math.random() * 10, v: 1.5 + Math.random() * 0.6 }); } }
  function gParts(o, n, c, sp, up, esc, vida) { const mt = gmat(c, 0.95); for (let i = 0; i < n; i++) { const m = new T3.Mesh(GGEO.part, mt.clone()); m.position.copy(o); m.scale.setScalar(esc || 1); world.add(m); const th = Math.random() * 6.28, ph = Math.random() * Math.PI, s = (0.25 + Math.random() * 0.75) * sp; GL.vfx.push({ k: 'part', m, e0: esc || 1, vel: new T3.Vector3(Math.sin(ph) * Math.cos(th) * s, Math.abs(Math.cos(ph)) * s * 0.7 + up * (0.3 + Math.random() * 0.7), Math.sin(ph) * Math.sin(th) * s), v: vida || 0.55, max: vida || 0.55 }); } }
  function gRastro(pos, forte) { if (Math.random() < 0.5) gParts(pos, 1, GPAL.negra, 1.4, 0.5, forte ? 1.4 : 1.1, 0.36); gParts(pos, 1, GPAL.luz, 2.2, 0.8, forte ? 1.1 : 0.85, 0.3); if (forte && Math.random() < 0.6) gParts(pos, 1, GPAL.roxaB, 1.8, 0.6, 1.2, 0.34); }
  function gVfxFrame(dt) { for (let i = GL.vfx.length - 1; i >= 0; i--) { const o = GL.vfx[i]; let fim = false;
      if (o.k === 'onda') { o.r += o.vel * dt; const k = o.r / o.max; o.m.scale.setScalar(o.r); o.m.material.opacity = Math.max(0, 1 - k); fim = k >= 1; }
      else if (o.k === 'corte') { o.v -= dt; const r = Math.max(0, o.v / o.max); o.m.rotation.z += dt * 14; o.m.scale.setScalar(1 + (1 - r) * 0.35); o.m.material.opacity = r; fim = o.v <= 0; }
      else if (o.k === 'cratera') { o.v -= dt; o.m.material.opacity = Math.min(1, o.v / (o.max * 0.4)); fim = o.v <= 0; }
      else if (o.k === 'pedra') { o.v -= dt; o.vel.y -= 19.6 * dt; o.m.position.addScaledVector(o.vel, dt); o.m.rotation.x += o.rv * dt; o.m.rotation.y += o.rv * dt; if (o.m.position.y < 0.14) { o.m.position.y = 0.14; o.vel.y *= -0.38; o.vel.x *= 0.65; o.vel.z *= 0.65; } fim = o.v <= 0; }
      else if (o.k === 'part') { o.v -= dt; o.m.position.addScaledVector(o.vel, dt); o.vel.multiplyScalar(0.95); const r = Math.max(0, o.v / o.max); o.m.material.opacity = r; o.m.scale.setScalar(o.e0 * r); fim = o.v <= 0; }
      if (fim) { world.remove(o.m); if (o.geo) o.m.geometry.dispose(); if (o.k !== 'pedra') o.m.material.dispose(); GL.vfx.splice(i, 1); } } }
  // ---------- cúpula da Égide ----------
  const EGIDE = (() => { const g = grp(world); g.visible = false; const esf = new T3.Mesh(new T3.SphereGeometry(1.75, 22, 16), gmat(GPAL.aura, 0.42)); esf.position.y = 1.2; g.add(esf); const an = [1.55, 1.95].map((r, i) => { const m = new T3.Mesh(new T3.PlaneGeometry(r * 2, r * 2), new T3.MeshBasicMaterial({ map: GTEX.runas, transparent: true, opacity: 0.9, side: T3.DoubleSide, depthWrite: false, toneMapped: false })); m.rotation.x = Math.PI / 2; m.position.y = i ? 1.3 : 0.08; g.add(m); return m; }); return { g, esf, an }; })();
  // ---------- ajudantes de combate ----------
  const gv = new T3.Vector3();
  function gFrente(d) { const p = heroi.position; return [p.x + Math.sin(facing) * d, p.z + Math.cos(facing) * d]; }
  function gAlvo() { const p = heroi.position; let best = null, bd = 14; FERAS.forEach(e => { if (!feraAtiva(e)) return; const d = Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z); if (d < bd) { bd = d; best = e; } }); return best; }
  function gPos(e) { return e ? [e.g.position.x, e.g.position.z] : gFrente(3.2); }
  function gBate(x, z, r, k, efeito) { const l = lendArea(x, z, r); lendHit(l, k, null); l.forEach(e => { if (efeito) efeito(e); }); return l.length; }
  function gEmpurra(x, z, e, f) { const dx = e.g.position.x - x, dz = e.g.position.z - z, d = Math.hypot(dx, dz) || 1; try { empurra(e, dx / d, dz / d, f); } catch (er) {} }
  function gAnda(dx, dz) { const p = heroi.position; p.x += dx; p.z += dz; }
  function gTerm() { if (GL.ativo === 'gl_base') GL.baseFim = gT; if (GL.W && GL.W !== GCHK && GL.W.userData.casa) chkNaMao(); GL.ativo = null; GL.spin = 0; GL.flip = 0; GL.pose = null; const eraG = GL.W === GCHK; GL.W = null; GL.combate = 5; if (eraG) gPoe(GCHK, gMao, BAINHA.mao.R); GCHK.userData.auraM.opacity = 0; }
  function gladInicia(id) { if (GL.ativo) return false; GL.ativo = id; GL.t = 0; GL.f = {}; GL.y0 = heroi.position.y; GL.W = gArma(); GL.combate = 5; if (GL.W === GCHK) { gBainha('mao'); GCHK.visible = GCHK_E.visible = true; GCHK.userData.auraM.opacity = 0.5; } else { GL.W.visible = true; if (!GL.W.userData.casa) GL.W.userData.casa = { pai: GL.W.parent, pos: GL.W.position.clone(), rot: GL.W.rotation.clone(), esc: GL.W.scale.clone() }; }
    const e = gAlvo(); GL.alvo = e; if (e) facing = Math.atan2(e.g.position.x - heroi.position.x, e.g.position.z - heroi.position.z); return true; }
  function gAltura(h) { heroi.position.y = GL.y0 + Math.max(0, h); vy = 0; }
  // poses do herói durante as habilidades
  const GPOSE = {
    guarda: { mood: 'smile', arms: { shL: [-0.45, 0, -0.35], shR: [-0.65, 0, 0.35], elL: [-0.5, 0, 0], elR: [-0.5, 0, 0] } },
    preparo: { mood: 'smile', arms: { shL: [-0.7, 0, -0.5], shR: [-1.3, 0, 0.85], elL: [-0.5, 0, 0], elR: [-0.6, 0, 0] }, legs: { thL: -0.3, knL: 0.4, thR: 0.25, knR: 0.2 } },
    arremesso: { mood: 'smile', arms: { shL: [-0.5, 0, -0.5], shR: [-1.6, 0, -0.2], elL: [-0.4, 0, 0], elR: [-0.1, 0, 0] }, legs: { thL: -0.4, knL: 0.3, thR: 0.3, knR: 0.2 } },
    corteD: { mood: 'smile', arms: { shL: [-0.5, 0, -0.6], shR: [-1.45, 0, 1.2], elL: [-0.4, 0, 0], elR: [-0.2, 0, 0] }, legs: { thL: -0.35, knL: 0.35, thR: 0.4, knR: 0.2 } },
    corteE: { mood: 'smile', arms: { shL: [-0.6, 0, -0.5], shR: [-1.45, 0, -1.2], elL: [-0.4, 0, 0], elR: [-0.2, 0, 0] }, legs: { thL: 0.38, knL: 0.2, thR: -0.38, knR: 0.35 } },
    alto: { mood: 'smile', arms: { shL: [-2.8, 0, -0.25], shR: [-2.9, 0, 0.2], elL: [-0.2, 0, 0], elR: [-0.2, 0, 0] }, legs: { thL: -0.55, knL: 0.8, thR: 0.45, knR: 0.5 } },
    baixo: { mood: 'smile', arms: { shL: [-0.4, 0, -0.25], shR: [-0.35, 0, 0.2], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] }, legs: { thL: -0.6, knL: 1.0, thR: 0.5, knR: 0.6 } },
    giro: { mood: 'smile', arms: { shL: [-1.5, 0, -1.35], shR: [-1.55, 0, 1.4], elL: [0, 0, 0], elR: [0, 0, 0] }, legs: { thL: -0.2, knL: 0.2, thR: 0.2, knR: 0.2 } },
    investida: { mood: 'smile', lean: 0.42, arms: { shL: [0.65, 0, -0.3], shR: [-1.55, 0, 0], elL: [-0.3, 0, 0], elR: [0, 0, 0] } },
    mortal: { mood: 'smile', arms: { shL: [-1.4, 0, -0.4], shR: [-1.4, 0, 0.4], elL: [-0.8, 0, 0], elR: [-0.8, 0, 0] }, legs: { thL: -1.1, knL: 1.8, thR: -1.1, knR: 1.8 } },
    pega: { mood: 'smile', arms: { shL: [-0.5, 0, -0.4], shR: [-2.5, 0, 0.25], elL: [-0.4, 0, 0], elR: [-0.1, 0, 0] } },
    escudo: { mood: 'smile', arms: { shL: [-1.3, 0, -0.9], shR: [-1.3, 0, 0.9], elL: [-0.6, 0, 0], elR: [-0.6, 0, 0] } } };
  function gladPose() { if (!GL.ativo || !GL.pose) return false; const P = GPOSE[GL.pose] || GPOSE.preparo; pose(heroi, gT, GL.pose === 'investida' ? Object.assign({ run: true }, P) : P); heroi.rotation.y = facing + GL.spin; heroi.rotation.x = GL.flip; return true; }
  // ---------- alvo: o inimigo mais perto (ou 4 m na frente) ----------
  function gAlvoPos() { const p = heroi.position, A = GL.alvo && feraAtiva(GL.alvo) ? GL.alvo : null; if (A) { facing = Math.atan2(A.g.position.x - p.x, A.g.position.z - p.z); return [A.g.position.x, A.g.position.z]; } if (!GL.f.alvoFixo) GL.f.alvoFixo = gFrente(4); return GL.f.alvoFixo; }
  function gVaiAte(x, z, falta, vel, dt) { const p = heroi.position, dx = x - p.x, dz = z - p.z, d = Math.hypot(dx, dz); if (d <= falta) return; const s = Math.min(d - falta, vel * dt); p.x += dx / d * s; p.z += dz / d * s; }
  // ---------- arma voando: arremesso em curva (o lado é relativo a quem olha) ----------
  function gVoo(ini, ax, az, u, lado, alt, giro) { const W = GL.W, arc = Math.sin(u * Math.PI), cv = Math.sin(u * Math.PI * 2) * lado, sx = Math.sin(facing), sz = Math.cos(facing);
    W.position.set(ini.x + (ax - ini.x) * arc + sz * cv, alt, ini.z + (az - ini.z) * arc - sx * cv); W.rotation.set(Math.PI / 2, giro, 0); gRastro(W.position, true); }
  // ---------- COMBO BÁSICO: 10 etapas (Dança do Chakram) ----------
  const GFASES = [['arr1', 0.72], ['c1', 0.28], ['c2', 0.28], ['c3', 0.32], ['c4', 0.42], ['c5', 0.45], ['arr2', 0.85], ['ceu', 1.05], ['fim', 0.58], ['guarda', 0.35]];
  function gDanca(dt, fase, pt, dur, KM) { const u = Math.min(1, pt / dur), p = heroi.position, [ax, az] = gAlvoPos();
    const once = (k, fn) => { if (!GL.f[fase + k]) { GL.f[fase + k] = 1; fn(); } }; const bate = (x, z, r, k, ef) => gBate(x, z, r, k * KM, ef);
    if (fase === 'arr1' || fase === 'arr2') { GL.pose = 'arremesso'; once('solta', () => { chkSolto(); chkMundo(gv); GL.f.ini = gv.clone(); });
      if (fase === 'arr1') { gVoo(GL.f.ini, ax, az, u, 1.45, 1.35, u * Math.PI * 16); if (u > 0.48) once('h', () => { tremor = 0.15; gCorte(ax, 1.35, az, 2.2, GPAL.roxaB, 0.25); gParts(gv.set(ax, 1.3, az), 8, GPAL.luz, 3.6, 2.6, 1); bate(ax, az, 2.3, 1.2); }); }
      else { gVoo(GL.f.ini, ax, az, u, 2.6, 1.45, -u * Math.PI * 20); if (u > 0.48) once('h', () => { tremor = 0.2; gCorte(ax, 1.4, az, 2.8, GPAL.dourada, 0.4); gParts(gv.set(ax, 1.4, az), 10, GPAL.roxaB, 4, 2.8, 1.05); bate(ax, az, 3, 1.65, null); }); }
      if (u >= 1) chkNaMao(); }
    else if (fase === 'c1') { chkNaMao(); GL.pose = 'corteD'; gVaiAte(ax, az, 1.6, 9, dt); chkMundo(gv); gRastro(gv, false); if (u > 0.5) once('h', () => { const [fx, fz] = gFrente(0.9); tremor = 0.14; gCorte(fx, 1.32, fz, 2.7, GPAL.roxaB, 0.2); gParts(gv.set(ax, 1.3, az), 8, GPAL.dourada, 3.8, 2.5, 0.95); bate(ax, az, 2.4, 0.95); }); }
    else if (fase === 'c2') { GL.pose = 'corteE'; chkMundo(gv); gRastro(gv, false); if (u > 0.5) once('h', () => { const [fx, fz] = gFrente(0.9); tremor = 0.15; gCorte(fx, 1.38, fz, 2.8, GPAL.dourada, -0.3); gParts(gv.set(ax, 1.3, az), 8, GPAL.luz, 4, 2.8, 1); bate(ax, az, 2.4, 1.05); }); }
    else if (fase === 'c3') { GL.pose = u < 0.4 ? 'alto' : 'baixo'; chkMundo(gv); gRastro(gv, false); if (u > 0.52) once('h', () => { tremor = 0.2; gOnda(ax, az, GPAL.dourada, 3.6, 14); gParts(gv.set(ax, 1.3, az), 10, GPAL.dourada, 4.2, 3.4, 1.05); bate(ax, az, 2.4, 1.3); }); }
    else if (fase === 'c4') { GL.pose = 'giro'; GL.spin = u * Math.PI * 2; chkMundo(gv); gRastro(gv, true); if (u > 0.5) once('h', () => { tremor = 0.22; gCorte(p.x, 1.3, p.z, 3.2, GPAL.roxaB, 0); gOnda(p.x, p.z, GPAL.roxa, 4.4, 14); gParts(gv.set(ax, 1.3, az), 10, GPAL.roxaB, 4.6, 3.2, 1.1); bate(ax, az, 2.6, 1.5); }); }
    else if (fase === 'c5') { GL.spin = 0; GL.pose = u < 0.45 ? 'alto' : 'baixo'; gAltura(Math.sin(u * Math.PI) * 0.65); chkMundo(gv); gRastro(gv, true); if (u > 0.55) once('h', () => { tremor = 0.34; gCratera(ax, az, 0.85, 3.2); gPedras(ax, az, 6, 6.2); gOnda(ax, az, GPAL.dourada, 5.2, 16); gOnda(ax, az, GPAL.roxaB, 4, 14, 0.14); gParts(gv.set(ax, 1.3, az), 14, GPAL.luz, 5.2, 4.6, 1.2); bate(ax, az, 2.6, 2.1); }); }
    else if (fase === 'ceu') { const R = GL.f.raiz || (GL.f.raiz = p.clone()); once('solta', () => { chkSolto(); gOnda(p.x, p.z, GPAL.roxaB, 3.4, 12); gParts(gv.set(p.x, 0.2, p.z), 10, GPAL.luz, 3.5, 3.5, 1.1); });
      const W = GL.W, sx = Math.sin(facing), sz = Math.cos(facing);
      if (u < 0.72) { const up = Math.sin(u / 0.72 * Math.PI / 2); W.position.set(R.x - sx * 0.5, GL.y0 + 1.8 + up * 4.8, R.z - sz * 0.5); } else { const m = new T3.Vector3(); chkMundo(m); W.position.lerpVectors(gv.set(R.x - sx * 0.5, GL.y0 + 6.6, R.z - sz * 0.5), m, (u - 0.72) / 0.28); }
      W.rotation.set(Math.PI / 2, u * Math.PI * 26, 0); gRastro(W.position, true);
      if (u >= 0.15 && u <= 0.78) { const f = (u - 0.15) / 0.63; GL.pose = 'mortal'; gAltura(Math.sin(f * Math.PI) * 2.4); GL.flip = f * Math.PI * 2; const v = -2.6 * dt; gAnda(sx * v, sz * v); }
      else if (u > 0.78) { GL.flip = 0; gAltura(0); GL.pose = 'pega'; once('aterra', () => { tremor = 0.22; gOnda(p.x, p.z, GPAL.dourada, 3.8, 14); gParts(gv.set(p.x, 0.2, p.z), 10, GPAL.aura, 3.2, 2.2, 1.6, 0.5); }); } else GL.pose = 'alto';
      if (u >= 1) chkNaMao(); }
    else if (fase === 'fim') { chkNaMao(); GL.flip = 0; GL.pose = 'giro'; GL.spin = u * Math.PI * 2; chkMundo(gv); gRastro(gv, true);
      if (u > 0.5) once('b', () => { tremor = 0.4; flash('rgba(255,210,90,.3)'); gCorte(p.x, 1.25, p.z, 4.2, GPAL.dourada, 0); gCorte(p.x, 1.32, p.z, 3.6, GPAL.roxaB, 1.2); gOnda(p.x, p.z, GPAL.dourada, 8.2, 17); gOnda(p.x, p.z, GPAL.roxa, 6.8, 15, 0.15); gParts(gv.set(p.x, 0.5, p.z), 14, GPAL.negra, 6.5, 3.2, 2.1, 0.75); gParts(gv.set(p.x, 0.8, p.z), 14, GPAL.luz, 7, 4.5, 1.2); gPedras(p.x, p.z, 8, 7); bate(p.x, p.z, 4.5, 2.8, e => gEmpurra(p.x, p.z, e, 1.6)); }); }
    else if (fase === 'guarda') { GL.spin = 0; GL.pose = 'guarda'; } }
  // ---------- as 6 habilidades + a dança completa ----------
  const GSKILL = {
    gl_danca(dt, t) { let acc = 0; for (const [n, d] of GFASES) { if (t < acc + d) { gDanca(dt, n, t - acc, d, 1); return false; } acc += d; } return true; },
    gl_base(dt, t) { const [fase, dur] = GFASES[GL.baseI]; if (t >= dur) return true; gDanca(dt, fase, t, dur, 0.55); return false; },
    gl_devastador(dt, t) { const D = 0.85, u = Math.min(1, t / D), [ax, az] = gAlvoPos(); GL.pose = u < 0.55 ? 'alto' : 'baixo'; gAltura(Math.sin(u * Math.PI) * 2.2); gVaiAte(ax, az, 1.5, 12, dt); chkMundo(gv); if (u > 0.4) gRastro(gv, true);
      if (u >= 0.65) once2('imp', () => { const x = ax, z = az; tremor = 0.55; gCratera(x, z, 1.15, 3.6); gPedras(x, z, 10, 7.5); gOnda(x, z, GPAL.dourada, 6.8, 18); gOnda(x, z, GPAL.roxa, 5.2, 14, 0.12); gCorte(x, 1.3, z, 2.9, GPAL.roxaB, 0); gParts(gv.set(x, 0.3, z), 18, GPAL.luz, 6.5, 5.5, 1.25); gParts(gv.set(x, 0.4, z), 12, GPAL.negra, 4.5, 2.8, 1.8, 0.7); gBate(x, z, 3.4, 4.2, e => { e.stun = Math.max(e.stun || 0, 1.5); gEmpurra(x, z, e, 1.5); }); });
      return t >= D; },
    gl_investida(dt, t) { const D = 0.75, u = Math.min(1, t / D), [ax, az] = gAlvoPos(), p = heroi.position; GL.pose = u < 0.7 ? 'investida' : 'guarda'; if (u < 0.7) { gVaiAte(ax, az, 1.4, 16, dt); chkMundo(gv); gRastro(gv, true); once2('o1', () => gOnda(p.x, p.z, GPAL.roxa, 3.6, 14));
        lendArea(p.x, p.z, 1.6).forEach(e => { GL.f.hit = GL.f.hit || new Set(); if (GL.f.hit.has(e)) return; GL.f.hit.add(e); lendHit([e], 1.2, null); gEmpurra(p.x, p.z, e, 1.5); }); }
      if (u >= 0.7) once2('fim', () => { const [x, z] = gFrente(1.1); tremor = 0.38; gCorte(x, 1.35, z, 2.8, GPAL.roxaB, 0.35); gOnda(x, z, GPAL.dourada, 5.5, 16, 0.12); gParts(gv.set(x, 1.3, z), 16, GPAL.luz, 6.2, 4, 1.15); gParts(gv.set(x, 0.8, z), 10, GPAL.negra, 4.8, 2.5, 1.7, 0.65); gBate(x, z, 2.6, 3.8, e => gEmpurra(x, z, e, 2.2)); });
      return t >= D; },
    gl_furia(dt, t) { const D = 1.25, u = Math.min(1, t / D), p = heroi.position; GL.pose = 'giro'; GL.spin += dt * 24; GL.W.rotation.z += dt * 32; chkMundo(gv); gRastro(gv, true); if (Math.random() < 0.2) gPedras(p.x, p.z, 1, 4.5);
      if (u > 0.22) once2('a', () => { gCorte(p.x, 1.25, p.z, 3.6, GPAL.roxaB, 0); gOnda(p.x, p.z, GPAL.roxa, 5.2, 16); });
      if (u >= 0.5) once2('h', () => { tremor = 0.34; gCorte(p.x, 1.2, p.z, 4.1, GPAL.dourada, -0.15); gOnda(p.x, p.z, GPAL.dourada, 6.8, 18, 0.12); gParts(gv.set(p.x, 1.2, p.z), 18, GPAL.luz, 6, 4.2, 1.2); gBate(p.x, p.z, 4, 4.9, e => gEmpurra(p.x, p.z, e, 1.6)); });
      return t >= D; },
    gl_sismo(dt, t) { const D = 0.9, u = Math.min(1, t / D); GL.pose = u > 0.45 ? 'baixo' : 'alto';
      if (u >= 0.5) once2('q', () => { const p = heroi.position, [x, z] = gFrente(1.25); tremor = 0.7; flash('rgba(255,200,60,.3)'); gCratera(x, z, 1.45, 4.2); gPedras(x, z, 14, 9.2); gOnda(x, z, GPAL.dourada, 8.8, 18, 0.12); gOnda(x, z, GPAL.roxa, 7.2, 15, 0.16); gOnda(x, z, GPAL.negra, 6, 12, 0.25); gParts(gv.set(x, 0.2, z), 20, GPAL.luz, 7.5, 6.5, 1.3, 0.6); gParts(gv.set(x, 0.3, z), 14, GPAL.roxaB, 6.5, 4.5, 1.4); gBate(p.x, p.z, 4.6, 4.4, e => { e.stun = Math.max(e.stun || 0, 2); gEmpurra(p.x, p.z, e, 1.8); }); });
      return t >= D; },
    gl_egide(dt, t) { const D = 0.95, u = Math.min(1, t / D), p = heroi.position; GL.pose = 'escudo'; once2('on', () => { GL.egide = 4; });
      if (u >= 0.35) once2('b', () => { tremor = 0.3; gOnda(p.x, p.z, GPAL.roxaB, 6.5, 16, 0.14); gOnda(p.x, p.z, GPAL.dourada, 5, 14, 0.12); gParts(gv.set(p.x, 1.1, p.z), 18, GPAL.negra, 5.5, 3.8, 2, 0.75); gParts(gv.set(p.x, 1.2, p.z), 14, GPAL.roxaB, 5, 4.2, 1.2); gBate(p.x, p.z, 3.6, 2.2, e => gEmpurra(p.x, p.z, e, 3)); });
      return t >= D; },
    gl_julgamento(dt, t) { const D = 1.35, u = Math.min(1, t / D), [ax, az] = gAlvoPos(); GL.pose = u < 0.5 ? 'alto' : 'baixo'; gAltura(u < 0.4 ? u / 0.4 * 1.4 : Math.max(0, (1 - u) * 2.3)); const H = GL.W.userData.casa, sc = u < 0.58 ? 1 + u / 0.58 * 0.95 : 1.95 - (u - 0.58) / 0.42 * 0.95; if (H) GL.W.scale.copy(H.esc).multiplyScalar(sc); chkMundo(gv); if (u < 0.6) gRastro(gv, true);
      if (u >= 0.58) once2('ult', () => { tremor = 0.8; flash('rgba(255,230,140,.4)'); const p = heroi.position, sx = Math.sin(facing), sz = Math.cos(facing); for (let k = 1; k <= 4; k++) { const x = p.x + sx * k * 1.45, z = p.z + sz * k * 1.45; gCratera(x, z, 0.95 + k * 0.12, 3.8); gPedras(x, z, 5, 8.2); gOnda(x, z, k % 2 ? GPAL.dourada : GPAL.roxaB, 6.2, 16, 0.12); gParts(gv.set(x, 0.4, z), 12, GPAL.luz, 6.5, 6, 1.35, 0.6); }
        const [cx, cz] = gFrente(2.2); gCorte(cx, 1.5, cz, 4.4, GPAL.dourada, Math.PI / 2);
        const l = FERAS.filter(e => { if (!feraAtiva(e)) return false; const ex = e.g.position.x - p.x, ez = e.g.position.z - p.z, ao = ex * sx + ez * sz, lat = Math.abs(ex * sz - ez * sx); return ao > -0.5 && ao < 7 && lat < 2 + e.T.raio; }); lendHit(l, 8.9, null); l.forEach(e => { e.stun = Math.max(e.stun || 0, 1.5); }); });
      if (u >= 1 && H) GL.W.scale.copy(H.esc); return t >= D; } };
  function once2(k, fn) { if (!GL.f[k]) { GL.f[k] = 1; fn(); } }
  GLAD.forEach(L => { LEND_CRIA[L.id] = () => { gladInicia(L.id); }; });
  function gladFrame(dt) { gVfxFrame(dt); gBainhaFrame(dt); GCHK.userData.nuc.scale.setScalar(1 + Math.sin(gT * 10) * 0.18);
    if (GL.egide > 0) { GL.egide -= dt; const p = heroi.position; EGIDE.g.visible = true; EGIDE.g.position.set(p.x, p.y, p.z); EGIDE.an[0].rotation.z += dt * 2.2; EGIDE.an[1].rotation.z -= dt * 3.1; EGIDE.esf.scale.setScalar(1 + Math.sin(gT * 8) * 0.04); if (GL.egide <= 0) EGIDE.g.visible = false; }
    if (!GL.ativo) return; if (desmaiado || zona === 'leilao') { gTerm(); return; } if (GL.W === GCHK) {}  GL.t += dt; let acabou = false; try { acabou = GSKILL[GL.ativo](dt, GL.t); } catch (e) { console.warn(e); acabou = true; } if (acabou) gTerm(); }
  // botão ATACAR com chakram na mão: cada toque faz a próxima etapa da dança (volta pro começo se ficar parado)
  GL.baseI = -1; GL.baseFim = 0;
  function gladBase() { if (!ARMA_ROTA.glad.ok(AR.arma)) return false; if (GL.ativo) return true; const agora = gT; GL.baseI = agora - GL.baseFim > 2.2 ? 0 : (GL.baseI + 1) % GFASES.length;
    if (!gladInicia('gl_base')) return true; const n = GL.baseI; if (n !== 9) som(n === 0 || n === 6 ? 'tiro' : 'espada', 0.6, n === 8 ? 0.8 : null); return true; }
  function gladReduz(n) { return GL.egide > 0 ? n * 0.4 : n; }
  window.__glad = { GL, R: GCHK, L: GCHK_E, BAINHA, equipa: k => equipaArma(k), cast: id => { LEND_CD[id] = 0; GL.ativo = null; usarPoder(PW[id]); } };

  // efeitos do gladiador também aparecem pros outros jogadores
  gOnda = mpEnvolve('gOnda', gOnda); gCorte = mpEnvolve('gCorte', gCorte); gCratera = mpEnvolve('gCratera', gCratera); gPedras = mpEnvolve('gPedras', gPedras); gParts = mpEnvolve('gParts', gParts, 0.35);
