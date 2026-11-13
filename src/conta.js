// CONTA — login com Firebase (e-mail e senha) e progresso salvo na nuvem
(function () {
  const $ = id => document.getElementById(id);
  const CHAVES = ['aetherion-arvore', 'aetherion-finais'];
  const C = window.CONTA = { usuario: null, online: false, salvar() {}, sair() {} };
  const tela = $('login'), msg = $('lg-msg');
  ['keydown', 'keyup'].forEach(t => tela.addEventListener(t, e => e.stopPropagation()));
  const tap = (el, fn) => { el.addEventListener('click', e => { e.preventDefault(); fn(); }); };
  function mostra(t, erro) { msg.textContent = t || ''; msg.className = erro ? 'erro' : ''; }
  function ocupado(on) { tela.querySelectorAll('button,input').forEach(b => b.disabled = on); tela.querySelectorAll('.lg-pri').forEach(b => { if (on) { b.dataset.h = b.dataset.h || b.innerHTML; b.innerHTML = '<span class="lg-gira"></span>'; } else if (b.dataset.h) { b.innerHTML = b.dataset.h; delete b.dataset.h; } }); }
  function fecha() { tela.hidden = true; window.__entrou = true; }
  function lerLocal() { const o = {}; CHAVES.forEach(k => { try { o[k] = localStorage.getItem(k); } catch (e) {} }); return o; }
  const ERROS = { 'auth/invalid-email': 'Esse e-mail não é válido.', 'auth/missing-password': 'Digite a senha.', 'auth/weak-password': 'A senha precisa ter pelo menos 6 letras ou números.',
    'auth/email-already-in-use': 'Já existe uma conta com esse e-mail. Toque em Entrar.', 'auth/invalid-credential': 'Usuário/e-mail ou senha errados.', 'auth/wrong-password': 'Senha errada.', 'auth/user-not-found': 'Não existe conta com esse e-mail.',
    'auth/too-many-requests': 'Muitas tentativas. Espera um pouquinho e tenta de novo.', 'auth/network-request-failed': 'Sem internet. Verifique a conexão.' };
  const erroTxt = e => ERROS[e && e.code] || 'Deu um erro: ' + ((e && (e.code || e.message)) || 'desconhecido');


  // ---- arte do topo: céu noturno, lua, estrelas, montanhas, castelo e círculos mágicos ----
  const ARTE = (() => { const cv = $('lg-arte'); if (!cv) return { liga() {} }; const x = cv.getContext('2d'); let W = 0, H = 0, est = [], raf = 0, t0 = performance.now();
    function mede() { const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); W = Math.max(1, r.width); H = Math.max(1, r.height); cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
      est = []; let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647; for (let i = 0; i < Math.round(W * H / 2600); i++) est.push([rnd() * W, rnd() * H * 0.72, rnd() * 1.4 + 0.3, rnd() * 6]); }
    function monte(base, alt, cor, sd) { x.beginPath(); x.moveTo(0, H); let px = 0; x.lineTo(0, base); const n = 9; for (let i = 0; i <= n; i++) { const xx = W * i / n, yy = base - alt * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7 + sd))); x.lineTo(xx, yy); } x.lineTo(W, H); x.closePath(); x.fillStyle = cor; x.fill(); }
    function circ(cx, cy, r, a, al) { x.save(); x.translate(cx, cy); x.rotate(a); x.globalAlpha = al; x.strokeStyle = '#c9b2ff'; x.shadowColor = '#8a5aff'; x.shadowBlur = 12; x.lineWidth = 1.6; x.beginPath(); x.arc(0, 0, r, 0, 7); x.stroke(); x.lineWidth = 1; x.beginPath(); x.arc(0, 0, r * 0.82, 0, 7); x.stroke();
      for (let k = 0; k < 2; k++) { x.beginPath(); for (let i = 0; i <= 3; i++) { const q = i / 3 * Math.PI * 2 + k * Math.PI / 3 - Math.PI / 2; i ? x.lineTo(Math.cos(q) * r * 0.8, Math.sin(q) * r * 0.8) : x.moveTo(Math.cos(q) * r * 0.8, Math.sin(q) * r * 0.8); } x.stroke(); }
      for (let i = 0; i < 12; i++) { const q = i / 12 * Math.PI * 2; x.fillStyle = '#e8dcff'; x.fillRect(Math.cos(q) * r * 0.91 - 1, Math.sin(q) * r * 0.91 - 1, 2, 2); } x.restore(); }
    function desenha(now) { const t = (now - t0) / 1000; const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0826'); g.addColorStop(0.55, '#2a1460'); g.addColorStop(0.85, '#5a2a7a'); g.addColorStop(1, '#8a3a6a'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      est.forEach(([sx, sy, r, f]) => { x.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 1.2 + f)); x.fillStyle = '#fff'; x.beginPath(); x.arc(sx, sy, r, 0, 7); x.fill(); }); x.globalAlpha = 1;
      // lua crescente com brilho
      const lx = W * 0.82, ly = H * 0.2, lr = Math.min(W, H) * 0.075; const gl = x.createRadialGradient(lx, ly, lr * 0.5, lx, ly, lr * 4); gl.addColorStop(0, 'rgba(255,230,170,.35)'); gl.addColorStop(1, 'rgba(255,230,170,0)'); x.fillStyle = gl; x.fillRect(lx - lr * 4, ly - lr * 4, lr * 8, lr * 8);
      x.fillStyle = '#ffe9b0'; x.beginPath(); x.arc(lx, ly, lr, 0, 7); x.fill(); x.fillStyle = '#1a0e44'; x.beginPath(); x.arc(lx + lr * 0.45, ly - lr * 0.2, lr * 0.9, 0, 7); x.fill();
      // círculos mágicos flutuando
      circ(W * 0.84, H * 0.5, Math.min(W, H) * 0.09, t * 0.25, 0.5); circ(W * 0.93, H * 0.66, Math.min(W, H) * 0.045, -t * 0.5, 0.4); circ(W * 0.12, H * 0.16, Math.min(W, H) * 0.05, t * 0.4, 0.35);
      // montanhas
      monte(H * 0.8, H * 0.22, '#2a1550', 1); monte(H * 0.88, H * 0.16, '#1c0e3a', 3);
      // castelo
      const cx = W * 0.88, cb = H * 0.9, u = Math.min(W, H) * 0.016; x.fillStyle = '#120828'; const tor = (tx, w, h) => { x.fillRect(tx, cb - h, w, h); for (let k = 0; k < 3; k++) x.fillRect(tx + k * w / 2.5, cb - h - u * 0.8, w / 5, u * 0.8); x.beginPath(); x.moveTo(tx - u * 0.3, cb - h - u * 0.8); x.lineTo(tx + w / 2, cb - h - u * 4); x.lineTo(tx + w + u * 0.3, cb - h - u * 0.8); x.fill(); };
      x.fillRect(cx - u * 6, cb - u * 7, u * 12, u * 7); tor(cx - u * 8, u * 3, u * 11); tor(cx + u * 5, u * 3, u * 11); tor(cx - u * 1.6, u * 3.2, u * 15);
      x.fillStyle = '#ffcf6a'; [[cx - u * 0.5, cb - u * 11], [cx - u * 7, cb - u * 8], [cx + u * 6, cb - u * 8], [cx - u * 3, cb - u * 4], [cx + u * 2.5, cb - u * 4]].forEach(([a, b]) => { x.globalAlpha = 0.7 + 0.3 * Math.sin(t * 2 + a); x.fillRect(a, b, u * 0.9, u * 1.4); }); x.globalAlpha = 1;
      x.fillStyle = '#0c0620'; x.fillRect(0, H * 0.93, W, H * 0.07);
      // névoa
      const nv = x.createLinearGradient(0, H * 0.75, 0, H); nv.addColorStop(0, 'rgba(140,90,200,0)'); nv.addColorStop(1, 'rgba(140,90,200,.25)'); x.fillStyle = nv; x.fillRect(0, H * 0.75, W, H * 0.25); }
    function loop(now) { if (tela.hidden) { raf = 0; return; } if (!W || Math.abs(cv.getBoundingClientRect().width - W) > 1) mede(); desenha(now); raf = requestAnimationFrame(loop); }
    return { liga() { if (!raf) raf = requestAnimationFrame(loop); } }; })();
  new MutationObserver(() => { if (!tela.hidden) ARTE.liga(); }).observe(tela, { attributes: true, attributeFilter: ['hidden'] }); if (!tela.hidden) ARTE.liga();
  // olho de mostrar senha
  tela.querySelectorAll('.lg-olho').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const i = $(b.dataset.alvo); i.type = i.type === 'password' ? 'text' : 'password'; b.style.color = i.type === 'text' ? '#6a3ae8' : ''; }));
  function modo(criar) { $('lg-entrarv').hidden = criar; $('lg-criarv').hidden = !criar; mostra(''); const f = $(criar ? 'lg-usuario' : 'lg-id'); if (f) setTimeout(() => f.focus(), 50); }
  tap($('lg-ircriar'), () => modo(true)); tap($('lg-irentrar'), () => modo(false)); tap($('lg-voltar'), () => modo(false));
  // o jogo só toca som depois de entrar
  window.__entrou = false;
  // jogar sem conta (fica salvo só no celular)
  tap($('lg-convidado'), () => { try { sessionStorage.setItem('aetherion-convidado', '1'); } catch (e) {} fecha(); });
  let convidado = false; try { convidado = sessionStorage.getItem('aetherion-convidado') === '1'; } catch (e) {}

  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !window.firebase) { $('lg-entrarv').hidden = true; $('lg-criarv').hidden = true; $('lg-convidado').hidden = false; mostra(!cfg ? 'O login ainda não foi ligado ao Firebase. Dá pra jogar sem conta (o progresso fica salvo no celular).' : 'Sem conexão com o servidor agora. Jogue sem conta e tente de novo depois.', !!cfg); if (convidado) fecha(); return; }

  let app, auth, db;
  try { app = firebase.initializeApp(cfg); auth = firebase.auth(); db = firebase.firestore(); C.db = db; } catch (e) { $('lg-entrarv').hidden = true; $('lg-criarv').hidden = true; $('lg-convidado').hidden = false; mostra('Não deu pra ligar o Firebase: ' + e.message, true); return; }
  try { auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
  const docDe = uid => db.collection('jogadores').doc(uid);

  // salvar na nuvem (espera uns segundos pra juntar várias mudanças)
  let tSalvar = null, pendente = false;
  async function enviar() { tSalvar = null; if (!C.usuario) return; pendente = false; const L = lerLocal(); let nv = 1; try { nv = JSON.parse(L['aetherion-arvore'] || '{}').nv || 1; } catch (e) {}
    try { await docDe(C.usuario.uid).set({ nome: C.usuario.displayName || '', email: C.usuario.email || '', arvore: L['aetherion-arvore'] || null, finais: L['aetherion-finais'] || null, nv, atualizado: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }); C.online = true; atualizaSelo(); }
    catch (e) { C.online = false; pendente = true; atualizaSelo(); } }
  C.salvar = function () { if (!C.usuario) return; pendente = true; clearTimeout(tSalvar); tSalvar = setTimeout(enviar, 3000); };
  document.addEventListener('visibilitychange', () => { if (document.hidden && pendente) { clearTimeout(tSalvar); enviar(); } });
  C.sair = async function () { if (pendente) await enviar(); await auth.signOut(); CHAVES.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} }); try { localStorage.removeItem('aetherion-dono'); sessionStorage.removeItem('aetherion-convidado'); sessionStorage.removeItem('aetherion-puxado'); } catch (e) {} location.reload(); };
  function atualizaSelo() { const s = $('conta-selo'); if (!s) return; s.textContent = C.usuario ? (C.online ? '☁️ Salvo na nuvem' : '⚠️ Sem internet: salva quando voltar') : '📱 Sem conta: salvo só neste celular'; }
  C.selo = atualizaSelo;

  // quando entra: puxa o progresso da nuvem; conta nova: sobe o progresso do celular
  // puxa o progresso da nuvem só UMA vez por sessão (senão o jogo ficava recarregando sem parar)
  async function aoEntrar(u) { C.usuario = u; registraUsuario(u, u.displayName); mostra('Carregando seu progresso...'); ocupado(true); let puxado = null; try { puxado = sessionStorage.getItem('aetherion-puxado'); } catch (e) {}
    try { const d = await docDe(u.uid).get();
      if (d.exists && d.data().arvore && puxado !== u.uid) { const dt = d.data(); try { sessionStorage.setItem('aetherion-puxado', u.uid); } catch (e) {}
        let nvLocal = 0, nvNuvem = 0; try { nvLocal = (JSON.parse(localStorage.getItem('aetherion-arvore') || '{}').nv || 0); nvNuvem = (JSON.parse(dt.arvore).nv || 0); } catch (e) {}
        let dono = null; try { dono = localStorage.getItem('aetherion-dono'); } catch (e) {}
        // usa o da nuvem se o celular está vazio, se o progresso daqui é de outra conta, ou se a nuvem está mais adiantada
        if (dono !== u.uid || nvNuvem >= nvLocal) { try { localStorage.setItem('aetherion-arvore', dt.arvore); if (dt.finais) localStorage.setItem('aetherion-finais', dt.finais); localStorage.setItem('aetherion-dono', u.uid); } catch (e) {} location.reload(); return; } }
      try { localStorage.setItem('aetherion-dono', u.uid); } catch (e) {}
      await enviar(); C.online = true; } catch (e) { C.online = false; }
    ocupado(false); mostra(''); fecha(); atualizaSelo(); }
  let primeira = true;
  auth.onAuthStateChanged(u => { const era = primeira; primeira = false; if (u) aoEntrar(u); else { C.usuario = null; if (convidado) fecha(); else { tela.hidden = false; if (era) mostra(''); } atualizaSelo(); } });

  // ---- usuário (login) → e-mail: coleção "usuarios/{nome em minúsculo}" ----
  const RX_USU = /^[A-Za-z0-9_.]{3,16}$/;
  const usuDoc = n => db.collection('usuarios').doc(n.toLowerCase());
  async function registraUsuario(u, nome) { if (!nome || !RX_USU.test(nome)) return; try { const d = await usuDoc(nome).get(); if (!d.exists) await usuDoc(nome).set({ uid: u.uid, email: (u.email || '').toLowerCase(), nome, criado: firebase.firestore.FieldValue.serverTimestamp() }); } catch (e) {} }
  async function emailDe(id) { if (id.includes('@')) return id; if (!RX_USU.test(id)) throw { msg: 'Usuário inválido. Use letras, números, _ ou ponto (ou entre com o e-mail).' };
    let d; try { d = await usuDoc(id).get(); } catch (e) { throw { msg: 'Não deu pra achar o usuário agora. Entre com o e-mail.' }; }
    if (!d.exists || !d.data().email) throw { msg: 'Não existe conta com esse usuário.' }; return d.data().email; }
  tap($('lg-entrar'), async () => { const id = $('lg-id').value.trim(), sen = $('lg-senha').value; if (!id) { mostra('Digite seu usuário ou e-mail.', true); return; } if (!sen) { mostra('Digite a senha.', true); return; }
    mostra('Entrando...'); ocupado(true); try { const em = await emailDe(id); await auth.signInWithEmailAndPassword(em, sen); } catch (e) { mostra(e && e.msg ? e.msg : erroTxt(e), true); } ocupado(false); });
  tap($('lg-criar'), async () => { const nome = $('lg-usuario').value.trim(), em = $('lg-email').value.trim(), s1 = $('lg-senha2').value, s2 = $('lg-senha3').value;
    if (!RX_USU.test(nome)) { mostra('Usuário: 3 a 16 letras, números, _ ou ponto. Sem espaço.', true); return; }
    if (!em || !em.includes('@')) { mostra('Digite um e-mail válido.', true); return; }
    if (s1.length < 6) { mostra('A senha precisa ter pelo menos 6 letras ou números.', true); return; }
    if (s1 !== s2) { mostra('As senhas não são iguais.', true); return; }
    mostra('Criando sua conta...'); ocupado(true);
    try { let livre = true; try { const d = await usuDoc(nome).get(); livre = !d.exists; } catch (e) {} if (!livre) { mostra('Esse usuário já existe. Escolha outro.', true); ocupado(false); return; }
      const r = await auth.createUserWithEmailAndPassword(em, s1); await r.user.updateProfile({ displayName: nome }); C.usuario = r.user; await registraUsuario(r.user, nome); await enviar(); } catch (e) { mostra(erroTxt(e), true); } ocupado(false); });
  tap($('lg-esqueci'), async () => { const id = $('lg-id').value.trim(); if (!id) { mostra('Digite seu usuário ou e-mail primeiro.', true); return; }
    try { const em = await emailDe(id); await auth.sendPasswordResetEmail(em); mostra('Mandamos um e-mail pra trocar a senha. Olhe a caixa de entrada (e o spam).'); } catch (e) { mostra(e && e.msg ? e.msg : erroTxt(e), true); } });
  ['lg-id', 'lg-senha'].forEach(k => $(k).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('lg-entrar').click(); } }));
  ['lg-usuario', 'lg-email', 'lg-senha2', 'lg-senha3'].forEach(k => $(k).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('lg-criar').click(); } }));
})();
