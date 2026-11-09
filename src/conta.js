// CONTA — login com Firebase (e-mail e senha) e progresso salvo na nuvem
(function () {
  const $ = id => document.getElementById(id);
  const CHAVES = ['aetherion-arvore', 'aetherion-finais'];
  const C = window.CONTA = { usuario: null, online: false, salvar() {}, sair() {} };
  const tela = $('login'), msg = $('lg-msg');
  ['keydown', 'keyup'].forEach(t => tela.addEventListener(t, e => e.stopPropagation()));
  const tap = (el, fn) => { el.addEventListener('click', e => { e.preventDefault(); fn(); }); };
  function mostra(t, erro) { msg.textContent = t || ''; msg.className = erro ? 'erro' : ''; }
  function ocupado(on) { tela.querySelectorAll('button,input').forEach(b => b.disabled = on); }
  function fecha() { tela.hidden = true; }
  function lerLocal() { const o = {}; CHAVES.forEach(k => { try { o[k] = localStorage.getItem(k); } catch (e) {} }); return o; }
  const ERROS = { 'auth/invalid-email': 'Esse e-mail não é válido.', 'auth/missing-password': 'Digite a senha.', 'auth/weak-password': 'A senha precisa ter pelo menos 6 letras ou números.',
    'auth/email-already-in-use': 'Já existe uma conta com esse e-mail. Toque em Entrar.', 'auth/invalid-credential': 'E-mail ou senha errados.', 'auth/wrong-password': 'Senha errada.', 'auth/user-not-found': 'Não existe conta com esse e-mail.',
    'auth/too-many-requests': 'Muitas tentativas. Espera um pouquinho e tenta de novo.', 'auth/network-request-failed': 'Sem internet. Verifique a conexão.' };
  const erroTxt = e => ERROS[e && e.code] || 'Deu um erro: ' + ((e && (e.code || e.message)) || 'desconhecido');

  // jogar sem conta (fica salvo só no celular)
  tap($('lg-convidado'), () => { try { sessionStorage.setItem('aetherion-convidado', '1'); } catch (e) {} fecha(); });
  let convidado = false; try { convidado = sessionStorage.getItem('aetherion-convidado') === '1'; } catch (e) {}

  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !window.firebase) { $('lg-form').hidden = true; mostra(!cfg ? 'O login ainda não foi ligado ao Firebase. Dá pra jogar sem conta (o progresso fica salvo no celular).' : 'Sem conexão com o servidor agora. Jogue sem conta e tente de novo depois.', !!cfg); if (convidado) fecha(); return; }

  let app, auth, db;
  try { app = firebase.initializeApp(cfg); auth = firebase.auth(); db = firebase.firestore(); } catch (e) { $('lg-form').hidden = true; mostra('Não deu pra ligar o Firebase: ' + e.message, true); return; }
  try { auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
  const docDe = uid => db.collection('jogadores').doc(uid);

  // salvar na nuvem (espera uns segundos pra juntar várias mudanças)
  let tSalvar = null, pendente = false;
  async function enviar() { tSalvar = null; if (!C.usuario) return; pendente = false; const L = lerLocal(); let nv = 1; try { nv = JSON.parse(L['aetherion-arvore'] || '{}').nv || 1; } catch (e) {}
    try { await docDe(C.usuario.uid).set({ nome: C.usuario.displayName || '', email: C.usuario.email || '', arvore: L['aetherion-arvore'] || null, finais: L['aetherion-finais'] || null, nv, atualizado: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }); C.online = true; atualizaSelo(); }
    catch (e) { C.online = false; pendente = true; atualizaSelo(); } }
  C.salvar = function () { if (!C.usuario) return; pendente = true; clearTimeout(tSalvar); tSalvar = setTimeout(enviar, 3000); };
  document.addEventListener('visibilitychange', () => { if (document.hidden && pendente) { clearTimeout(tSalvar); enviar(); } });
  C.sair = async function () { if (pendente) await enviar(); await auth.signOut(); CHAVES.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} }); try { sessionStorage.removeItem('aetherion-convidado'); } catch (e) {} location.reload(); };
  function atualizaSelo() { const s = $('conta-selo'); if (!s) return; s.textContent = C.usuario ? (C.online ? '☁️ Salvo na nuvem' : '⚠️ Sem internet: salva quando voltar') : '📱 Sem conta: salvo só neste celular'; }
  C.selo = atualizaSelo;

  // quando entra: puxa o progresso da nuvem; conta nova: sobe o progresso do celular
  async function aoEntrar(u) { C.usuario = u; mostra('Carregando seu progresso...'); ocupado(true);
    try { const d = await docDe(u.uid).get();
      if (d.exists && d.data().arvore) { const dt = d.data(); const L = lerLocal();
        if (L['aetherion-arvore'] !== dt.arvore || L['aetherion-finais'] !== dt.finais) { try { localStorage.setItem('aetherion-arvore', dt.arvore); if (dt.finais) localStorage.setItem('aetherion-finais', dt.finais); } catch (e) {} location.reload(); return; } }
      else await enviar();
      C.online = true; } catch (e) { C.online = false; }
    ocupado(false); mostra(''); fecha(); atualizaSelo(); }
  let primeira = true;
  auth.onAuthStateChanged(u => { const era = primeira; primeira = false; if (u) aoEntrar(u); else { C.usuario = null; if (convidado) fecha(); else { tela.hidden = false; if (era) mostra(''); } atualizaSelo(); } });

  const email = () => $('lg-email').value.trim(), senha = () => $('lg-senha').value;
  tap($('lg-entrar'), async () => { mostra('Entrando...'); ocupado(true); try { await auth.signInWithEmailAndPassword(email(), senha()); } catch (e) { mostra(erroTxt(e), true); } ocupado(false); });
  tap($('lg-criar'), async () => { const nome = $('lg-nome'); if ($('lg-nomewrap').hidden) { $('lg-nomewrap').hidden = false; nome.focus(); mostra('Escolha seu nome de jogador e toque em Criar conta de novo.'); return; }
    if (!nome.value.trim()) { mostra('Escolha um nome de jogador.', true); return; } mostra('Criando sua conta...'); ocupado(true);
    try { const r = await auth.createUserWithEmailAndPassword(email(), senha()); await r.user.updateProfile({ displayName: nome.value.trim() }); C.usuario = r.user; await enviar(); } catch (e) { mostra(erroTxt(e), true); } ocupado(false); });
  tap($('lg-esqueci'), async () => { if (!email()) { mostra('Digite seu e-mail primeiro.', true); return; } try { await auth.sendPasswordResetEmail(email()); mostra('Mandamos um e-mail pra trocar a senha. Olhe a caixa de entrada (e o spam).'); } catch (e) { mostra(erroTxt(e), true); } });
})();
