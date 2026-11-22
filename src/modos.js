
  /* =====================================================================
     MODOS DA LIVE INTERATIVA (só ADM): 5 jogos que o chat controla,
     com narrador falando e um apresentador animado no cantinho.
       1 Cofre impossível · 2 O chat cria o monstro · 3 Sobreviva 7 dias
       4 Não deixe o cristal quebrar · 5 Zoom extremo
     Eventos da live (chat, curtida, presente) vão pro modo ligado.
     ===================================================================== */
  const MODO = { on: false, k: '', st: null, t: 0, ultFala: 0 };
  window.MODO = MODO;
  const MD_W = 1280, MD_H = 720;
  const mdEsc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mdNorm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const mdRnd = a => a[Math.floor(Math.random() * a.length)];
  const mdFmt = n => Math.round(n).toLocaleString('pt-BR');

  /* ---------- estilos ---------- */
  const mdCss = document.createElement('style');
  mdCss.textContent = `
  #md-ov{position:fixed;inset:0;z-index:600;background:#05060c;display:none;overflow:hidden;font-family:'Trebuchet MS',system-ui,sans-serif;color:#fff;user-select:none}
  #md-ov.on{display:block}
  #md-st{position:absolute;left:0;top:0;width:${MD_W}px;height:${MD_H}px;transform-origin:0 0;overflow:hidden}
  #md-st .topo{position:absolute;left:0;right:0;top:0;height:62px;display:flex;align-items:center;justify-content:center;gap:12px;font-weight:900;font-size:30px;letter-spacing:1px;text-shadow:0 3px 0 #0008;z-index:3}
  #md-st .tag{font-size:13px;padding:5px 10px;border-radius:9px;background:#e5243b;letter-spacing:1px}
  #md-st .pn{position:absolute;background:linear-gradient(#141a33ee,#0b0f20ee);border:2px solid #ffffff22;border-radius:18px;padding:13px;box-shadow:0 12px 30px #0008;z-index:3}
  #md-st .br{height:16px;border-radius:9px;background:#ffffff1c;overflow:hidden}#md-st .br i{display:block;height:100%;border-radius:9px;transition:width .4s}
  #md-st .pq{font-size:13px;color:#c8cfe8}
  #md-st .it{background:#ffffff10;border-radius:10px;padding:7px 9px}
  #md-chat{position:absolute;left:14px;bottom:14px;width:300px;display:flex;flex-direction:column;gap:6px;z-index:4}
  #md-chat .m{background:#000a;border-radius:12px;padding:7px 10px;font-size:15px;animation:mdIn .35s ease-out;display:flex;gap:8px;align-items:center}
  #md-chat .m b{color:#ffd56a}
  .md-av{width:28px;height:28px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:14px;font-weight:900;overflow:hidden;background-size:cover;background-position:center}
  @keyframes mdIn{from{transform:translateX(-30px);opacity:0}to{transform:none;opacity:1}}
  @keyframes mdPop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:scale(1)}}
  #md-nar{position:absolute;right:6px;bottom:0;width:210px;height:250px;z-index:5;pointer-events:none}
  #md-bal{position:absolute;right:200px;bottom:150px;max-width:330px;background:#fff;color:#151a2e;border-radius:18px;padding:10px 14px;font-size:16px;font-weight:700;box-shadow:0 8px 24px #0007;z-index:5;opacity:0;transition:opacity .3s;pointer-events:none}
  #md-bal:after{content:'';position:absolute;right:-12px;bottom:18px;border:12px solid transparent;border-left-color:#fff;border-right:0}
  #md-bal.on{opacity:1}
  #md-big{position:absolute;left:0;right:0;top:40%;text-align:center;font-weight:900;font-size:64px;text-shadow:0 6px 0 #0009,0 0 30px #000;z-index:6;pointer-events:none;display:none}
  #md-big.on{display:block;animation:mdPop .6s ease-out}
  #md-bar{position:fixed;right:8px;top:8px;z-index:610;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:70vw}
  #md-bar button{font:700 12px system-ui;padding:7px 10px;border-radius:12px;border:0;background:#1c2340dd;color:#fff}
  #md-bar .x{background:#e5243b}
  #md-bar:not(.ab) button:not(.tg){display:none}
  #md-bar .tg{opacity:.55;background:#0008}
  #md-esc{position:fixed;inset:0;z-index:620;background:#05060cf2;display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px;font-family:system-ui;color:#fff}
  #md-esc.on{display:flex}
  #md-esc .cs{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;max-width:94vw}
  #md-esc .c{width:min(30vw,210px);padding:14px 10px;border-radius:18px;background:linear-gradient(#1d2547,#10142a);border:2px solid #ffffff22;text-align:center;font-weight:800}
  #md-esc .c div{font-size:40px}#md-esc .c small{display:block;font-weight:500;color:#c8cfe8;margin-top:4px;font-size:12px}
  #md-btn{position:fixed;left:112px;bottom:8px;z-index:250;width:44px;height:44px;border-radius:50%;border:3px solid #2b2340;background:#b48cff;font-size:20px;padding:0;opacity:.95}
  `;
  document.head.appendChild(mdCss);

  /* ---------- tela ---------- */
  const mdOv = document.createElement('div'); mdOv.id = 'md-ov'; mdOv.className = 'arena-keep';
  mdOv.innerHTML = '<div id="md-st"><div id="md-fundo" style="position:absolute;inset:0"></div><div id="md-cena" style="position:absolute;inset:0"></div><div id="md-chat"></div><div id="md-bal"></div><svg id="md-nar" viewBox="0 0 210 250"></svg><div id="md-big"></div></div>';
  document.body.appendChild(mdOv);
  const mdSt = mdOv.querySelector('#md-st'), mdCena = mdOv.querySelector('#md-cena'), mdFundo = mdOv.querySelector('#md-fundo');
  const mdBar = document.createElement('div'); mdBar.id = 'md-bar'; mdBar.className = 'arena-keep'; mdBar.hidden = true; document.body.appendChild(mdBar);
  const mdEscEl = document.createElement('div'); mdEscEl.id = 'md-esc'; mdEscEl.className = 'arena-keep'; document.body.appendChild(mdEscEl);
  const mdBtn = document.createElement('button'); mdBtn.id = 'md-btn'; mdBtn.className = 'arena-keep'; mdBtn.textContent = '🎮'; mdBtn.title = 'Modos da Live'; mdBtn.hidden = true; document.body.appendChild(mdBtn);
  function mdAjusta() { const s = Math.min(innerWidth / MD_W, innerHeight / MD_H); mdSt.style.transform = 'translate(' + ((innerWidth - MD_W * s) / 2) + 'px,' + ((innerHeight - MD_H * s) / 2) + 'px) scale(' + s + ')'; }
  addEventListener('resize', mdAjusta); mdAjusta();
  const mdQ = s => mdOv.querySelector(s);

  /* ---------- chat na tela ---------- */
  const MD_CORES = ['#ff5c7a', '#4ad6ff', '#ffcf4a', '#7ad35b', '#b48cff', '#ff9a3d'];
  function mdAv(nome, foto, tam) { const f = typeof arenaFotoUrl === 'function' ? arenaFotoUrl(foto) : ''; const n = String(nome || '?');
    return '<div class="md-av" style="' + (tam ? 'width:' + tam + 'px;height:' + tam + 'px;' : '') + 'background-color:' + MD_CORES[n.length % 6] + (f ? ';background-image:url(' + f + ')' : '') + '">' + (f ? '' : mdEsc(n.replace(/[^\p{L}\p{N}]/gu, '').charAt(0).toUpperCase() || '?')) + '</div>'; }
  function mdChat(nome, txt, foto) { const c = mdQ('#md-chat'); const d = document.createElement('div'); d.className = 'm'; d.innerHTML = mdAv(nome, foto) + '<div><b>' + mdEsc(nome) + '</b> ' + txt + '</div>'; c.appendChild(d); while (c.children.length > 5) c.firstChild.remove(); }

  /* ---------- APRESENTADOR animado (fala junto com o narrador) ---------- */
  const NAR = { fala: 0, piscar: 3, balT: 0 };
  function narDesenha(t) { const falando = (typeof VOZ !== 'undefined' && VOZ.tocando) || NAR.balT > 0;
    const boca = falando ? 4 + Math.abs(Math.sin(t * 17)) * 9 + Math.abs(Math.sin(t * 7)) * 3 : 2.5;
    NAR.piscar -= 1 / 30; const olho = NAR.piscar < 0.12 ? 1 : 9; if (NAR.piscar < 0) NAR.piscar = 2 + Math.random() * 3;
    const b = Math.sin(t * 2) * 3, mao = falando ? Math.sin(t * 5) * 14 : 0;
    mdQ('#md-nar').innerHTML = `<defs><linearGradient id="mdCapa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3fd1"/><stop offset="1" stop-color="#2c1670"/></linearGradient>
      <radialGradient id="mdPele" cx="45%" cy="40%"><stop offset="0" stop-color="#ffd9b0"/><stop offset="1" stop-color="#e9a877"/></radialGradient></defs>
     <g transform="translate(0,${b})">
      <path d="M40 250 Q45 150 105 140 Q165 150 170 250 Z" fill="url(#mdCapa)"/>
      <path d="M85 150 L105 205 L125 150 Z" fill="#ffcf4a"/>
      <g transform="rotate(${-20 + mao} 150 175)"><rect x="140" y="160" width="18" height="60" rx="9" fill="#4a2aa0"/><circle cx="149" cy="222" r="11" fill="url(#mdPele)"/>
       <rect x="143" y="196" width="14" height="30" rx="6" fill="#222"/><circle cx="150" cy="192" r="11" fill="#555"/><circle cx="150" cy="192" r="8" fill="#888"/></g>
      <circle cx="105" cy="100" r="50" fill="url(#mdPele)"/>
      <path d="M52 92 Q50 40 105 38 Q160 40 158 92 Q150 66 105 64 Q60 66 52 92Z" fill="#3a2414"/>
      <path d="M58 60 L105 -8 L152 60 Z" fill="#7a4be6" stroke="#2c1670" stroke-width="3"/><circle cx="105" cy="-6" r="8" fill="#ffcf4a"/>
      <text x="92" y="44" font-size="16" fill="#ffcf4a">★</text><text x="118" y="30" font-size="11" fill="#ffcf4a">★</text>
      <rect x="50" y="56" width="110" height="10" rx="5" fill="#2c1670"/>
      <ellipse cx="86" cy="98" rx="8" ry="${olho}" fill="#1b1030"/><ellipse cx="124" cy="98" rx="8" ry="${olho}" fill="#1b1030"/>
      <circle cx="89" cy="${96 - olho * 0.3}" r="2.5" fill="#fff"/><circle cx="127" cy="${96 - olho * 0.3}" r="2.5" fill="#fff"/>
      <path d="M76 82 q10 -6 20 0 M114 82 q10 -6 20 0" stroke="#3a2414" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="74" cy="116" r="8" fill="#ff8a8a" opacity=".45"/><circle cx="136" cy="116" r="8" fill="#ff8a8a" opacity=".45"/>
      <ellipse cx="105" cy="124" rx="13" ry="${boca}" fill="#5a1020"/><ellipse cx="105" cy="${124 + boca * 0.5}" rx="7" ry="${Math.min(boca, 4)}" fill="#ff6b81"/>
      <path d="M58 104 Q48 128 68 140" stroke="#222" stroke-width="5" fill="none"/><circle cx="70" cy="140" r="5" fill="#222"/>
      <text x="105" y="244" text-anchor="middle" font-size="15" font-weight="900" fill="#ffcf4a" stroke="#000" stroke-width="3" paint-order="stroke">BESSEKAI</text>
     </g>`; }
  /** O narrador fala e o balão aparece. prio = passa na frente. */
  function mdFala(t, prio) { const agora = performance.now(); if (!prio && agora - MODO.ultFala < 4500) return; MODO.ultFala = agora;
    const b = mdQ('#md-bal'); b.innerHTML = t; b.classList.add('on'); NAR.balT = Math.min(9, 2 + String(t).length / 16);
    try { arenaFala(t, prio); } catch (e) {} }
  function mdGrande(t, cor, seg) { const g = mdQ('#md-big'); g.innerHTML = t; g.style.color = cor || '#ffcf4a'; g.classList.remove('on'); void g.offsetWidth; g.classList.add('on'); clearTimeout(g._t); g._t = setTimeout(() => g.classList.remove('on'), (seg || 3) * 1000); }

  /* ======================= 1 · COFRE ======================= */
  const COFRE = {
    nome: '🔐 O Cofre Impossível', ic: '🔐', desc: 'Adivinhe a senha de 4 números',
    fundo: 'radial-gradient(circle at 50% 45%,#2a3350,#0a0d18 70%)',
    PREMIOS: ['Espada lendária + destaque na live', 'Coroa de ouro no ranking', 'Título de GÊNIO DO COFRE', 'Grito do narrador com seu nome'],
    novo(S) { S.senha = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)); S.rev = [false, false, false, false]; S.dicas = []; S.tent = 0; S.likes = 0; S.meta = 300; S.flash = -1; S.flashT = 0; S.aberto = 0; S.premio = mdRnd(this.PREMIOS); S.ang = 0; S.auto = 70;
      this.monta(S); mdFala('Novo cofre trancado! A senha tem 4 números. Comente no chat o seu palpite. Curtidas liberam dicas, e cada rosa mostra um número escondido por 10 segundos!', true); },
    monta(S) { mdCena.innerHTML = `<div class="topo">🔐 O COFRE IMPOSSÍVEL <span class="tag">AO VIVO</span></div>
      <svg id="cf-s" style="position:absolute;left:420px;top:76px" width="440" height="440" viewBox="0 0 500 500"></svg>
      <div id="cf-d" style="position:absolute;left:0;right:0;top:530px;display:flex;gap:14px;justify-content:center"></div>
      <div class="pn" style="right:16px;top:76px;width:300px"><div style="font-weight:900;font-size:18px;margin-bottom:8px">🧩 DICAS</div><div id="cf-dc" style="display:flex;flex-direction:column;gap:7px;font-size:15px"></div>
       <div class="pq" style="margin-top:12px">❤️ Próxima dica: <b id="cf-lk">0</b> / <b id="cf-mt">300</b> curtidas</div><div class="br" style="margin-top:6px"><i id="cf-bl" style="width:0;background:linear-gradient(90deg,#ff3d7f,#ff9a3d)"></i></div>
       <div class="pq" style="margin-top:10px">🎁 Presente = mostra 1 número por 10 s</div></div>
      <div class="pn" style="left:16px;top:76px;width:300px;text-align:center"><div class="pq">DENTRO DO COFRE</div><div id="cf-pr" style="font-size:48px;margin:4px 0">❓</div><div style="font-weight:900">${mdEsc(S.premio)}</div>
       <div class="pq" style="margin-top:8px">Palpites: <b id="cf-t">0</b></div><div id="cf-ul" class="pq" style="margin-top:6px"></div></div>
      <div style="position:absolute;left:0;right:0;top:640px;text-align:center;font-weight:900;font-size:18px;text-shadow:0 2px 0 #000">💬 Digite <b style="color:#ffcf4a">4 números</b> no chat</div>`; this.dig(S); this.dicas(S); },
    dig(S) { const d = mdCena.querySelector('#cf-d'); if (!d) return; d.innerHTML = S.senha.map((n, i) => { const v = S.rev[i] || S.aberto, f = S.flash === i;
      const cor = v ? '#3dff8a' : f ? '#ffcf4a' : '#ffffff55'; return `<div style="width:78px;height:94px;border-radius:14px;background:#0b1020;border:3px solid ${v ? '#3dff8a' : f ? '#ffcf4a' : '#ffffff33'};display:grid;place-items:center;font:900 56px monospace;color:${cor};text-shadow:0 0 14px ${v || f ? cor : '#0000'};${f && !v ? 'filter:blur(2.5px)' : ''}">${v || f ? n : '?'}</div>`; }).join(''); },
    dicas(S) { const e = mdCena.querySelector('#cf-dc'); if (e) e.innerHTML = S.dicas.length ? S.dicas.slice(-4).map(x => '<div class="it">' + x + '</div>').join('') : '<div class="it pq">Nenhuma dica ainda… curtam!</div>'; },
    novaDica(S, quem) { const esc = S.rev.map((v, i) => v ? -1 : i).filter(i => i >= 0); let txt;
      if (esc.length > 1 && Math.random() < 0.55) { const i = mdRnd(esc); S.rev[i] = true; txt = '🔢 O ' + (i + 1) + 'º número é ' + S.senha[i]; }
      else { const i = esc.length ? mdRnd(esc) : 0, tipo = Math.floor(Math.random() * 3);
        txt = tipo === 0 ? '🔍 O ' + (i + 1) + 'º número é ' + (S.senha[i] % 2 ? 'ÍMPAR' : 'PAR') : tipo === 1 ? '➕ A soma dos 4 números é ' + S.senha.reduce((a, b) => a + b, 0) : '📏 O ' + (i + 1) + 'º número é ' + (S.senha[i] >= 5 ? 'MAIOR ou igual a 5' : 'MENOR que 5'); }
      S.dicas.push(txt); this.dicas(S); this.dig(S); mdGrande('🧩 NOVA DICA!', '#ffcf4a', 2); mdFala((quem ? 'Valeu ' + quem + '! ' : 'As curtidas liberaram! ') + 'Nova dica: ' + txt.replace(/^\S+\s/, '') + '.', true); },
    evento(S, m) {
      if (S.aberto) return;
      if (m.type === 'like') { S.likes += m.n; if (S.likes >= S.meta) { S.likes -= S.meta; S.meta = Math.round(S.meta * 1.25); this.novaDica(S); } return; }
      if (m.type === 'gift') { const esc = S.rev.map((v, i) => v ? -1 : i).filter(i => i >= 0); if (!esc.length) return; S.flash = mdRnd(esc); S.flashT = 10; this.dig(S); mdChat(m.name, 'enviou 🎁 → número revelado!', m.foto);
        mdFala(m.name + ' mandou um presente e revelou o ' + (S.flash + 1) + 'º número por 10 segundos! Rápido, anotem!', true); return; }
      if (m.type === 'chat') { const g = String(m.text || '').replace(/\D/g, ''); if (g.length !== 4) { mdChat(m.name, mdEsc(String(m.text).slice(0, 40)), m.foto); return; }
        S.tent++; const certos = g.split('').filter((c, i) => +c === S.senha[i]).length; const el = mdCena.querySelector('#cf-t'); if (el) el.textContent = S.tent;
        if (g === S.senha.join('')) return this.abre(S, m);
        mdChat(m.name, g + ' ' + (certos ? '🟡'.repeat(certos) : '❌'), m.foto); const ul = mdCena.querySelector('#cf-ul'); if (ul) ul.innerHTML = 'Último: <b>' + mdEsc(m.name) + '</b> → ' + g + ' (' + certos + ' certo' + (certos === 1 ? '' : 's') + ')';
        if (certos === 3) mdFala('Uau! ' + m.name + ' acertou 3 números no lugar certo! Falta só um!'); else if (certos === 2 && Math.random() < 0.4) mdFala(m.name + ' está esquentando, dois números no lugar certo!'); } },
    abre(S, m) { S.aberto = 1; S.venc = m; this.dig(S); const pr = mdCena.querySelector('#cf-pr'); if (pr) { pr.textContent = '🏆'; pr.style.animation = 'mdPop .6s'; }
      mdChat(m.name, '<b style="color:#3dff8a">' + S.senha.join('') + ' ✔ ABRIU O COFRE!</b>', m.foto);
      mdGrande('🔓 ' + mdEsc(m.name) + '<br><span style="font-size:34px">ABRIU O COFRE!</span>', '#3dff8a', 6);
      mdFala('INACREDITÁVEL! ' + m.name + ' acertou a senha ' + S.senha.join(' ') + ' e abriu o cofre! O prêmio é: ' + S.premio + '. Parabéns! Em instantes um novo cofre vai ser trancado!', true);
      setTimeout(() => { if (MODO.k === 'cofre') this.novo(S); }, 16000); },
    frame(S, dt, t) { S.ang += dt * (S.aberto ? 200 : 0); if (S.flashT > 0) { S.flashT -= dt; if (S.flashT <= 0) { S.flash = -1; this.dig(S); } }
      S.auto -= dt; if (S.auto <= 0 && !S.aberto) { S.auto = 75; this.novaDica(S); }
      const lk = mdCena.querySelector('#cf-lk'); if (lk) { lk.textContent = mdFmt(S.likes); mdCena.querySelector('#cf-mt').textContent = mdFmt(S.meta); mdCena.querySelector('#cf-bl').style.width = Math.min(100, S.likes / S.meta * 100) + '%'; }
      const sv = mdCena.querySelector('#cf-s'); if (!sv) return; const rot = S.aberto ? S.ang : Math.sin(t * 0.8) * 25; const porta = S.aberto ? Math.min(1, (S.aberto += dt * 0.5) - 1) : 0;
      sv.innerHTML = `<defs><radialGradient id="cfA" cx="40%" cy="35%"><stop offset="0" stop-color="#9aa6bd"/><stop offset="1" stop-color="#3b4459"/></radialGradient><radialGradient id="cfB" cx="40%" cy="35%"><stop offset="0" stop-color="#c4ccdb"/><stop offset="1" stop-color="#58627a"/></radialGradient>
        <radialGradient id="cfL"><stop offset="0" stop-color="#fff6c0"/><stop offset="1" stop-color="#ffb800" stop-opacity="0"/></radialGradient></defs>
       <rect x="20" y="20" width="460" height="460" rx="40" fill="#20283b" stroke="#596482" stroke-width="6"/>
       ${porta > 0 ? `<circle cx="250" cy="250" r="200" fill="#0b0d14"/><circle cx="250" cy="250" r="${150 + Math.sin(t * 6) * 12}" fill="url(#cfL)"/><text x="250" y="285" font-size="110" text-anchor="middle">🏆</text>` : ''}
       <g transform="translate(${porta * -380},0) scale(${1 - porta * 0.3},1)">
       <circle cx="250" cy="250" r="205" fill="url(#cfA)" stroke="#2b3245" stroke-width="10"/>
       <g transform="rotate(${rot} 250 250)"><circle cx="250" cy="250" r="120" fill="url(#cfB)" stroke="#2b3245" stroke-width="8"/>
        <g stroke="#2b3245" stroke-width="16" stroke-linecap="round"><line x1="250" y1="140" x2="250" y2="360"/><line x1="140" y1="250" x2="360" y2="250"/><line x1="172" y1="172" x2="328" y2="328"/><line x1="328" y1="172" x2="172" y2="328"/></g><circle cx="250" cy="250" r="34" fill="#2b3245"/></g></g>
       <circle cx="60" cy="60" r="10" fill="#7d88a3"/><circle cx="440" cy="60" r="10" fill="#7d88a3"/><circle cx="60" cy="440" r="10" fill="#7d88a3"/><circle cx="440" cy="440" r="10" fill="#7d88a3"/>`; },
    teste(S, a) { const n = mdRnd(['lucas_br', 'ana.games', 'Rafa77', 'Bia', 'gamer_mg']);
      if (a === 'chat') return { type: 'chat', id: n, name: n, text: Math.random() < 0.15 ? S.senha.join('') : String(Math.floor(Math.random() * 10000)).padStart(4, '0') }; }
  };

  /* ======================= 2 · MD_MONSTRO ======================= */
  const PARTES = [
    { k: 'corpo', nome: 'CORPO', op: [['🦴', 'Esqueleto'], ['🟢', 'Gosma'], ['🤖', 'Robô']] },
    { k: 'cabeca', nome: 'CABEÇA', op: [['🎃', 'Abóbora'], ['💀', 'Caveira'], ['🐙', 'Polvo']] },
    { k: 'olhos', nome: 'OLHOS', op: [['👁️', 'Um olho gigante'], ['👀', 'Três olhos'], ['🔥', 'Olhos de fogo']] },
    { k: 'boca', nome: 'BOCA', op: [['🦷', 'Dentões'], ['👅', 'Língua enorme'], ['🐤', 'Bico']] },
    { k: 'poder', nome: 'PODER', op: [['🔥', 'Fogo'], ['⚡', 'Raio'], ['❄️', 'Gelo']] },
  ];
  const MN_NOMES = ['Gorgomelo', 'Zuruburu', 'Pirapolvo', 'Esquelétron', 'Bafafá', 'Craniogoma', 'Trovoleta', 'Mordidão', 'Abobrinho', 'Sustolino'];
  function monstroSvg(E, t, w, h) {
    const b = Math.sin(t * 2) * 6, cor = { esqueleto: '#e9e3d2', gosma: '#5fd35b', robo: '#9aa6bd' }[['esqueleto', 'gosma', 'robo'][E.corpo ?? 0]];
    const pod = E.poder == null ? null : ['#ff7a1a', '#ffe04a', '#9be8ff'][E.poder];
    let corpo = '';
    if (E.corpo === 0 || E.corpo == null) corpo = `<g stroke="${E.corpo == null ? '#ffffff22' : cor}" stroke-width="16" stroke-linecap="round" fill="none"><line x1="210" y1="230" x2="210" y2="380"/>${[0, 1, 2, 3].map(i => `<path d="M210 ${250 + i * 30} q-60 10 -70 40 M210 ${250 + i * 30} q60 10 70 40"/>`).join('')}<line x1="210" y1="380" x2="160" y2="490"/><line x1="210" y1="380" x2="260" y2="490"/><line x1="210" y1="250" x2="120" y2="${330 + Math.sin(t * 3) * 20}"/><line x1="210" y1="250" x2="300" y2="${330 - Math.sin(t * 3) * 20}"/></g>`;
    else if (E.corpo === 1) corpo = `<path d="M110 490 Q100 300 210 230 Q320 300 310 490 Q285 470 260 490 Q235 465 210 490 Q185 465 160 490 Q135 468 110 490Z" fill="#5fd35b" stroke="#2f8a2c" stroke-width="5"/><circle cx="170" cy="380" r="14" fill="#9cf596" opacity=".6"/><circle cx="250" cy="420" r="9" fill="#9cf596" opacity=".6"/><path d="M120 320 q-40 ${20 + Math.sin(t * 3) * 15} -50 60 M300 320 q40 ${20 - Math.sin(t * 3) * 15} 50 60" stroke="#5fd35b" stroke-width="22" stroke-linecap="round" fill="none"/>`;
    else corpo = `<rect x="140" y="235" width="140" height="160" rx="18" fill="#9aa6bd" stroke="#3b4459" stroke-width="6"/><rect x="165" y="265" width="90" height="50" rx="8" fill="#2b3245"/><circle cx="185" cy="290" r="8" fill="#ff3d3d" opacity="${0.5 + 0.5 * Math.sin(t * 6)}"/><circle cx="235" cy="290" r="8" fill="#3dff8a"/><rect x="155" y="395" width="30" height="95" rx="10" fill="#5c6680"/><rect x="235" y="395" width="30" height="95" rx="10" fill="#5c6680"/><rect x="92" y="${250 + Math.sin(t * 3) * 10}" width="48" height="26" rx="10" fill="#5c6680"/><rect x="280" y="${250 - Math.sin(t * 3) * 10}" width="48" height="26" rx="10" fill="#5c6680"/>`;
    let cab = '';
    if (E.cabeca == null) cab = `<ellipse cx="210" cy="150" rx="105" ry="90" fill="#ffffff10" stroke="#ffffff33" stroke-width="4" stroke-dasharray="10 10"/><text x="210" y="175" font-size="80" text-anchor="middle" fill="#ffffff44">?</text>`;
    else if (E.cabeca === 0) cab = `<ellipse cx="210" cy="150" rx="110" ry="92" fill="#f08a2a" stroke="#8a3a0c" stroke-width="5"/>${[-60, -25, 25, 60].map(x => `<path d="M${210 + x} 64 q${x * 0.2} 80 0 172" stroke="#b8501a" stroke-width="4" fill="none"/>`).join('')}<rect x="200" y="42" width="20" height="30" rx="6" fill="#5a7a2a"/>`;
    else if (E.cabeca === 1) cab = `<path d="M110 150 Q110 58 210 58 Q310 58 310 150 Q310 200 270 215 L270 245 L150 245 L150 215 Q110 200 110 150Z" fill="#f1ece0" stroke="#8d8676" stroke-width="5"/><path d="M200 175 l10 -18 l10 18z" fill="#3a332a"/>`;
    else cab = `<ellipse cx="210" cy="140" rx="105" ry="88" fill="#c64fd1" stroke="#7a2287" stroke-width="5"/>${[-80, -45, -10, 25, 60].map((x, i) => `<path d="M${210 + x} 210 q${Math.sin(t * 3 + i) * 18} 40 ${Math.sin(t * 2 + i) * 10} 80" stroke="#c64fd1" stroke-width="18" stroke-linecap="round" fill="none"/>`).join('')}<circle cx="170" cy="100" r="9" fill="#e9a0ef"/><circle cx="250" cy="90" r="7" fill="#e9a0ef"/>`;
    let olhos = '';
    if (E.olhos === 0) olhos = `<ellipse cx="210" cy="138" rx="46" ry="${Math.sin(t * 1.3) > 0.93 ? 4 : 40}" fill="#fff" stroke="#000" stroke-width="4"/><circle cx="${210 + Math.sin(t) * 14}" cy="138" r="16" fill="#e5243b"/>`;
    else if (E.olhos === 1) olhos = [170, 210, 250].map((x, i) => `<circle cx="${x}" cy="${130 + (i === 1 ? -14 : 0)}" r="17" fill="#fff" stroke="#000" stroke-width="3"/><circle cx="${x + Math.sin(t * 1.5 + i) * 5}" cy="${130 + (i === 1 ? -14 : 0)}" r="7" fill="#111"/>`).join('');
    else if (E.olhos === 2) olhos = [175, 245].map(x => `<path d="M${x - 20} 145 Q${x} ${95 - Math.abs(Math.sin(t * 8)) * 18} ${x + 20} 145 Z" fill="#ff7a1a"/><path d="M${x - 10} 145 Q${x} ${115 - Math.abs(Math.sin(t * 9)) * 10} ${x + 10} 145 Z" fill="#ffe04a"/>`).join('');
    let boca = '';
    if (E.boca === 0) boca = `<path d="M155 190 Q210 230 265 190 Z" fill="#2a0d02"/>${[170, 192, 214, 236].map(x => `<path d="M${x} 192 l9 16 l9 -16z" fill="#fff"/>`).join('')}`;
    else if (E.boca === 1) boca = `<path d="M165 188 Q210 215 255 188" stroke="#2a0d02" stroke-width="8" fill="none"/><path d="M200 200 q10 ${40 + Math.sin(t * 4) * 20} 20 0" fill="#ff5c7a" stroke="#c0304a" stroke-width="3"/>`;
    else if (E.boca === 2) boca = `<path d="M180 180 L240 180 L210 ${215 + Math.abs(Math.sin(t * 5)) * 8} Z" fill="#ffb400" stroke="#a36a00" stroke-width="3"/>`;
    const aura = pod ? `<ellipse cx="210" cy="280" rx="${180 + Math.sin(t * 4) * 10}" ry="${240 + Math.sin(t * 4) * 10}" fill="${pod}" opacity=".16"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${210 + Math.cos(t * 2 + i) * 170}" cy="${280 + Math.sin(t * 2 + i) * 220}" r="${8 + i % 3 * 3}" fill="${pod}" opacity=".8"/>`).join('')}` : '';
    return `<svg width="${w}" height="${h}" viewBox="0 0 420 520">${aura}<ellipse cx="210" cy="500" rx="130" ry="16" fill="#0006"/><g transform="translate(0,${b})">${corpo}${cab}${olhos}${boca}</g></svg>`; }
  const MD_MONSTRO = {
    nome: '🧪 O chat cria o monstro', ic: '🧪', desc: 'Votação parte por parte', fundo: 'radial-gradient(circle at 50% 60%,#3b1d4d,#0c0716 70%)',
    novo(S) { S.E = {}; S.p = 0; S.v = [0, 0, 0]; S.quem = {}; S.tempo = 25; S.fim = 0; this.monta(S); mdFala('Vamos criar um monstro juntos! Cada parte é escolhida por votação. Comente 1, 2 ou 3. Presente vale 10 votos! Primeiro: o CORPO!', true); },
    monta(S) { mdCena.innerHTML = `<div class="topo">🧪 O CHAT CRIA O MONSTRO <span class="tag">AO VIVO</span></div>
      <div id="mn-ps" style="position:absolute;left:0;right:0;top:64px;display:flex;justify-content:center;gap:8px;z-index:3"></div>
      <div id="mn-b" style="position:absolute;left:440px;top:105px"></div>
      <div class="pn" id="mn-v" style="right:16px;top:110px;width:330px"></div>
      <div class="pn" style="left:16px;top:110px;width:250px"><div style="font-weight:900;margin-bottom:8px">🧬 Já escolhido</div><div id="mn-f" style="display:flex;flex-direction:column;gap:6px;font-size:15px"></div></div>`; this.atual(S); },
    atual(S) { const ps = mdCena.querySelector('#mn-ps'); if (!ps) return;
      ps.innerHTML = PARTES.map((P, i) => `<div style="padding:5px 12px;border-radius:12px;font-weight:900;font-size:13px;background:${i < S.p ? '#7ad35b' : i === S.p && !S.fim ? '#ffcf4a' : '#ffffff18'};color:${i <= S.p && !S.fim || i < S.p ? '#111' : '#fff'}">${i < S.p ? '✔ ' : ''}${P.nome}</div>`).join('');
      mdCena.querySelector('#mn-f').innerHTML = PARTES.slice(0, S.p).map(P => `<div class="it">${P.op[S.E[P.k]][0]} ${P.nome.charAt(0) + P.nome.slice(1).toLowerCase()}: ${P.op[S.E[P.k]][1]}</div>`).join('') || '<div class="it pq">nada ainda</div>'; this.votos(S); },
    votos(S) { const v = mdCena.querySelector('#mn-v'); if (!v) return; if (S.fim) { v.innerHTML = `<div style="font-weight:900;font-size:20px;text-align:center">👹 ${mdEsc(S.nomeM)}</div><div class="pq" style="text-align:center;margin-top:6px">Criado pelo chat! Novo monstro em <b id="mn-c">${Math.ceil(S.tempo)}</b> s</div>`; return; }
      const P = PARTES[S.p], tot = S.v.reduce((a, b) => a + b, 0) || 1, CR = ['#ff5c7a', '#4ad6ff', '#ffcf4a'];
      v.innerHTML = `<div style="font-weight:900;font-size:19px">🗳️ VOTAÇÃO: ${P.nome}</div><div class="pq" style="margin:3px 0 10px">Comente 1, 2 ou 3 · termina em <b id="mn-c">${Math.ceil(S.tempo)}</b> s</div>` +
        P.op.map((o, i) => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-weight:800"><span>${i + 1} · ${o[0]} ${o[1]}</span><span>${Math.round(S.v[i] / tot * 100)}%</span></div><div class="br" style="margin-top:4px"><i style="width:${S.v[i] / tot * 100}%;background:${CR[i]}"></i></div></div>`).join('') + '<div class="pq">🎁 Presente = voto vale 10×</div>'; },
    fecha(S) { const P = PARTES[S.p]; let w = S.v.indexOf(Math.max(...S.v)); if (S.v.every(x => x === 0)) w = Math.floor(Math.random() * 3);
      S.E[P.k] = w; mdGrande(P.op[w][0] + ' ' + P.op[w][1].toUpperCase(), '#ffcf4a', 2.5);
      S.p++; S.v = [0, 0, 0]; S.quem = {}; S.tempo = 25;
      if (S.p >= PARTES.length) { S.fim = 1; S.tempo = 40; S.nomeM = mdRnd(MN_NOMES); this.atual(S);
        mdFala('O monstro está pronto! Corpo de ' + PARTES[0].op[S.E.corpo][1] + ', cabeça de ' + PARTES[1].op[S.E.cabeca][1] + ', ' + PARTES[2].op[S.E.olhos][1] + ', ' + PARTES[3].op[S.E.boca][1] + ' e poder de ' + PARTES[4].op[S.E.poder][1] + '! O nome dele é ' + S.nomeM + '! Que criatura horrível... eu amei!', true); return; }
      this.atual(S); mdFala('O chat escolheu ' + P.op[w][1] + '! Agora vamos votar: ' + PARTES[S.p].nome.toLowerCase() + '. Opção 1: ' + PARTES[S.p].op[0][1] + '. Opção 2: ' + PARTES[S.p].op[1][1] + '. Opção 3: ' + PARTES[S.p].op[2][1] + '.', true); },
    evento(S, m) { if (S.fim) { if (m.type === 'chat') mdChat(m.name, mdEsc(String(m.text).slice(0, 40)), m.foto); return; }
      if (m.type === 'chat') { const g = String(m.text || '').match(/[123]/); mdChat(m.name, mdEsc(String(m.text).slice(0, 40)), m.foto); if (!g || S.quem[m.id]) return; S.quem[m.id] = 1; S.v[+g[0] - 1]++; this.votos(S); return; }
      if (m.type === 'gift') { const i = S.quem['g' + m.id] ?? (S.v.indexOf(Math.max(...S.v))); S.v[i] += 10; mdChat(m.name, 'enviou 🎁 → +10 votos na ' + (i + 1), m.foto); this.votos(S); mdFala(m.name + ' mandou presente: dez votos na opção ' + (i + 1) + '!'); } },
    frame(S, dt, t) { S.tempo -= dt; const c = mdCena.querySelector('#mn-c'); if (c) c.textContent = Math.max(0, Math.ceil(S.tempo));
      if (S.tempo <= 0) { if (S.fim) return this.novo(S); this.fecha(S); }
      if (!S.fim && Math.abs(S.tempo - 8) < dt) mdFala('Faltam 8 segundos! Votem!');
      const b = mdCena.querySelector('#mn-b'); if (b) b.innerHTML = monstroSvg(S.E, t, 400, 495); },
    teste(S, a) { const n = mdRnd(['lucas_br', 'ana.games', 'Rafa77', 'Bia', 'gamer_mg', 'Nanda', 'Kauã']) + Math.floor(Math.random() * 99); if (a === 'chat') return { type: 'chat', id: n, name: n, text: String(1 + Math.floor(Math.random() * 3)) }; }
  };

  /* ======================= 3 · ILHA ======================= */
  const ILHA_EV = [
    ['⛈️ UMA TEMPESTADE ESTÁ CHEGANDO!', ['🛖', 'Reforçar o abrigo', { abrigo: 25, energia: -10 }], ['🎣', 'Pescar antes da chuva', { fome: 25, vida: -15 }]],
    ['🦀 Caranguejos gigantes na praia!', ['🪓', 'Enfrentar e comer', { fome: 30, vida: -20 }], ['🏃', 'Fugir pro mato', { energia: -15 }]],
    ['🌊 A maré está subindo!', ['🧗', 'Subir no coqueiro', { energia: -20 }], ['🛶', 'Fazer uma jangada', { abrigo: -10, energia: -10, sorte: 1 }]],
    ['🥥 Achou um coqueiro carregado', ['🥥', 'Comer tudo agora', { fome: 35 }], ['📦', 'Guardar pra depois', { fome: 15, abrigo: 5 }]],
    ['🔥 A fogueira apagou!', ['🪵', 'Buscar lenha no escuro', { energia: -15, vida: 10 }], ['😴', 'Dormir no frio', { vida: -15, energia: 15 }]],
    ['🐍 Uma cobra entrou no abrigo!', ['🪓', 'Expulsar com o machado', { vida: -10, abrigo: 5 }], ['🚪', 'Dormir do lado de fora', { energia: -20 }]],
    ['🍄 Cogumelos estranhos', ['😋', 'Arriscar e comer', { fome: 30, vida: -20, sorte: 1 }], ['🙅', 'Melhor não', { fome: -10 }]],
    ['🚢 Um navio passou longe!', ['🔥', 'Fazer fumaça pra chamar', { energia: -20, sorte: 2 }], ['🙋', 'Gritar e acenar', { energia: -5 }]],
    ['🐒 Macacos roubaram comida!', ['🏃', 'Correr atrás', { energia: -20, fome: 15 }], ['🤷', 'Deixar pra lá', { fome: -15 }]],
  ];
  const ILHA_GIFT = [['🍎', 'maçã', { fome: 18 }], ['🪓', 'machado', { abrigo: 18 }], ['🔥', 'fogueira', { energia: 18, vida: 6 }], ['🩹', 'curativo', { vida: 22 }]];
  const ILHA = {
    nome: '🏝️ Sobreviva 7 dias', ic: '🏝️', desc: 'O chat decide o destino do Kael', fundo: '#24506e',
    novo(S) { S.dia = 1; S.s = { fome: 70, energia: 70, abrigo: 30, vida: 100 }; S.ev = null; S.prox = 8; S.v = [0, 0]; S.quem = {}; S.noite = 0; S.fim = 0; S.chuva = 0; S.sorte = 0; this.monta(S);
      mdFala('O Kael naufragou numa ilha deserta! Ele precisa sobreviver 7 dias, e quem decide tudo é o chat. Presentes viram suprimentos: comida, machado, fogueira e curativo!', true); },
    monta(S) { mdCena.innerHTML = `<canvas id="il-c" width="1280" height="720" style="position:absolute;inset:0"></canvas>
      <div class="topo">🏝️ SOBREVIVA 7 DIAS <span class="tag" id="il-d">DIA 1/7</span></div>
      <div class="pn" style="left:16px;top:76px;width:250px"><div style="font-weight:900;margin-bottom:8px">🧍 Kael</div>${['🍖 Fome:fome:#f39a2b', '⚡ Energia:energia:#3dd6ff', '🛖 Abrigo:abrigo:#7ad35b', '❤️ Vida:vida:#ff4d6d'].map(x => { const [a, k, c] = x.split(':'); return `<div class="pq" style="margin-top:6px">${a} <b id="il-n-${k}"></b></div><div class="br"><i id="il-b-${k}" style="background:${c}"></i></div>`; }).join('')}</div>
      <div class="pn" id="il-e" style="left:50%;transform:translateX(-50%);top:80px;width:540px;text-align:center;border-color:#ffcf4a88;display:none"></div>
      <div style="position:absolute;right:14px;top:76px;display:flex;flex-direction:column;gap:6px;align-items:flex-end;z-index:3">${ILHA_GIFT.map((g, i) => `<div class="it" style="background:#000a;font-weight:700;font-size:14px">🎁 Presente ${i + 1} = ${g[0]} ${g[1]}</div>`).join('')}</div>`; this.barras(S); },
    barras(S) { for (const k in S.s) { const b = mdCena.querySelector('#il-b-' + k); if (b) { b.style.width = Math.max(0, S.s[k]) + '%'; mdCena.querySelector('#il-n-' + k).textContent = Math.round(Math.max(0, S.s[k])) + '%'; } } const d = mdCena.querySelector('#il-d'); if (d) d.textContent = 'DIA ' + Math.min(7, S.dia) + '/7'; },
    aplica(S, ef) { for (const k in ef) { if (k === 'sorte') S.sorte += ef[k]; else S.s[k] = Math.max(0, Math.min(100, S.s[k] + ef[k])); } this.barras(S); },
    abreEvento(S) { S.ev = mdRnd(ILHA_EV); S.v = [0, 0]; S.quem = {}; S.tempo = 40; S.chuva = /TEMPESTADE/.test(S.ev[0]) ? 1 : 0; this.evPn(S);
      mdFala(S.ev[0].replace(/^\S+\s/, '') + ' O que o Kael faz? Comente 1 para ' + S.ev[1][1] + ', ou 2 para ' + S.ev[2][1] + '!', true); },
    evPn(S) { const e = mdCena.querySelector('#il-e'); if (!e) return; if (!S.ev) { e.style.display = 'none'; return; } e.style.display = 'block'; const tot = S.v[0] + S.v[1] || 1;
      e.innerHTML = `<div style="font-size:22px;font-weight:900">${S.ev[0]}</div><div class="pq" style="margin:4px 0 12px">O chat decide · <b>${Math.ceil(S.tempo)}</b> s</div><div style="display:flex;gap:12px">` +
        [1, 2].map(i => `<div style="flex:1;background:#ffffff12;border-radius:14px;padding:10px"><div style="font-size:26px">${i}️⃣ ${S.ev[i][0]}</div><b>${S.ev[i][1]}</b><div class="br" style="margin-top:8px"><i style="width:${S.v[i - 1] / tot * 100}%;background:${i === 1 ? '#7ad35b' : '#f39a2b'}"></i></div><div class="pq">${Math.round(S.v[i - 1] / tot * 100)}%</div></div>`).join('') + '</div>'; },
    fechaEvento(S) { let w = S.v[0] >= S.v[1] ? 1 : 2; if (S.v[0] === S.v[1]) w = 1 + Math.floor(Math.random() * 2); const op = S.ev[w];
      this.aplica(S, op[2]); mdGrande(op[0] + ' ' + op[1], '#ffcf4a', 2.5);
      let txt = 'O chat decidiu: ' + op[1] + '! ';
      if (S.sorte >= 3) { mdFala(txt + 'E OLHA ISSO! Um barco viu o sinal e veio resgatar o Kael! O chat salvou o Kael!', true); S.ev = null; this.evPn(S); return this.fim(S, true); }
      S.ev = null; this.evPn(S); S.dia++; S.noite = 1;
      if (S.dia > 7) { mdFala(txt + 'Sete dias se passaram, e o Kael SOBREVIVEU! Parabéns, chat!', true); return this.fim(S, true); }
      mdFala(txt + 'A noite chegou. Começa o dia ' + S.dia + '. ' + (S.s.fome < 30 ? 'Atenção: o Kael está com muita fome! Mandem maçãs!' : S.s.vida < 40 ? 'Cuidado: a vida do Kael está baixa!' : 'Ele está aguentando firme!'), true); S.prox = 12; },
    fim(S, vivo) { S.fim = 1; S.prox = 20; mdGrande(vivo ? '🎉 KAEL SOBREVIVEU!' : '💀 KAEL NÃO AGUENTOU…', vivo ? '#3dff8a' : '#ff4d6d', 6); if (!vivo) mdFala('Ah não... o Kael não aguentou. A ilha venceu dessa vez. Daqui a pouco começa uma nova tentativa!', true); },
    evento(S, m) { if (m.type === 'chat') { mdChat(m.name, mdEsc(String(m.text).slice(0, 40)), m.foto); if (!S.ev) return; const g = String(m.text || '').match(/[12]/); if (!g || S.quem[m.id]) return; S.quem[m.id] = 1; S.v[+g[0] - 1]++; this.evPn(S); return; }
      if (m.type === 'gift' && !S.fim) { const G = ILHA_GIFT[Math.min(ILHA_GIFT.length - 1, Math.floor(Math.max(0, Math.log10(Math.max(1, +m.diamonds || 1)))))] || mdRnd(ILHA_GIFT); const g = ILHA_GIFT[(m.name || '').length % 4] && Math.random() < 0.5 ? ILHA_GIFT[(m.name || '').length % 4] : G;
        this.aplica(S, g[2]); mdChat(m.name, 'enviou 🎁 → ' + g[0] + ' ' + g[1], m.foto); mdFala(m.name + ' mandou ' + g[1] + ' pro Kael! Valeu!'); }
      if (m.type === 'like' && !S.fim) { S.s.energia = Math.min(100, S.s.energia + m.n * 0.02); } },
    frame(S, dt, t) { if (!S.fim) { S.s.fome -= dt * 0.35; S.s.energia -= dt * 0.2; S.s.abrigo -= dt * 0.06; if (S.s.fome <= 0 || S.s.energia <= 0) S.s.vida -= dt * 1.2; if (S.chuva && S.s.abrigo < 40) S.s.vida -= dt * 0.5;
        if (S.s.vida <= 0) return this.fim(S, false);
        if (S.ev) { S.tempo -= dt; if (Math.abs(S.tempo - 10) < dt) mdFala('Dez segundos pra decidir!'); if (S.tempo <= 0) this.fechaEvento(S); else if (Math.floor(S.tempo * 2) !== Math.floor((S.tempo + dt) * 2)) this.evPn(S); }
        else { S.prox -= dt; if (S.prox <= 0) { S.noite = 0; this.abreEvento(S); } } this.barras(S); }
      else { S.prox -= dt; if (S.prox <= 0) this.novo(S); }
      if (S.noite) S.noite = Math.max(0.0001, S.noite);
      this.desenha(S, t); },
    desenha(S, t) { const cv = mdCena.querySelector('#il-c'); if (!cv) return; const c = cv.getContext('2d'), W = 1280, H = 720, noite = S.noite ? 1 : 0, chuva = S.chuva && S.ev;
      let g = c.createLinearGradient(0, 0, 0, H); if (noite) { g.addColorStop(0, '#060b1e'); g.addColorStop(0.55, '#16264a'); g.addColorStop(1, '#0b1626'); } else if (chuva) { g.addColorStop(0, '#2b3d55'); g.addColorStop(0.55, '#6c7f93'); g.addColorStop(1, '#1d2c3b'); } else { g.addColorStop(0, '#3d8fe0'); g.addColorStop(0.55, '#a7d8ff'); g.addColorStop(1, '#2a6a8f'); }
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      if (noite) { for (let i = 0; i < 70; i++) { c.fillStyle = 'rgba(255,255,240,' + (0.3 + 0.5 * Math.abs(Math.sin(t + i))) + ')'; c.fillRect((i * 173) % W, (i * 97) % 380, 2, 2); } c.fillStyle = '#f4f1e0'; c.beginPath(); c.arc(1040, 140, 34, 0, 7); c.fill(); }
      else if (!chuva) { c.fillStyle = 'rgba(255,240,170,.9)'; c.beginPath(); c.arc(1050, 130, 46, 0, 7); c.fill(); }
      for (let i = 0; i < 7; i++) { const x = ((i * 210 + t * (chuva ? 30 : 12)) % (W + 300)) - 150, y = 90 + (i % 3) * 45; c.fillStyle = chuva ? 'rgba(30,38,52,.8)' : noite ? 'rgba(40,50,80,.5)' : 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(x, y, 120, 36, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(x + 60, y - 16, 80, 34, 0, 0, 7); c.fill(); }
      g = c.createLinearGradient(0, 430, 0, H); g.addColorStop(0, noite ? '#13304a' : '#24709e'); g.addColorStop(1, noite ? '#061420' : '#0e3550'); c.fillStyle = g; c.fillRect(0, 430, W, H);
      c.strokeStyle = 'rgba(200,230,255,.22)'; c.lineWidth = 2; for (let k = 0; k < 9; k++) { c.beginPath(); for (let x = 0; x <= W; x += 20) { const y = 450 + k * 30 + Math.sin(x * 0.02 + t * 2 + k) * 5; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      c.fillStyle = noite ? '#8a7448' : '#e0bd72'; c.beginPath(); c.ellipse(640, 520, 330, 60, 0, Math.PI, 0); c.fill();
      c.strokeStyle = '#6b4423'; c.lineWidth = 16; c.beginPath(); c.moveTo(500, 500); c.quadraticCurveTo(480 + Math.sin(t) * 6, 400, 520 + Math.sin(t) * 10, 320); c.stroke();
      c.fillStyle = noite ? '#1f4a28' : '#2f7a3a'; for (let i = 0; i < 6; i++) { c.save(); c.translate(520 + Math.sin(t) * 10, 320); c.rotate(i * 1.05 + Math.sin(t * 1.5) * 0.12); c.beginPath(); c.ellipse(60, 0, 70, 14, 0.2, 0, 7); c.fill(); c.restore(); }
      const ab = Math.max(0.15, S.s.abrigo / 100); c.fillStyle = '#8a5a2b'; c.beginPath(); c.moveTo(770 - 70 * ab, 505); c.lineTo(770, 505 - 75 * ab); c.lineTo(770 + 70 * ab, 505); c.fill();
      const px = 630, py = 495 - Math.abs(Math.sin(t * 3)) * 3; c.fillStyle = '#2a2f45'; c.fillRect(px - 9, py - 40, 18, 30); c.fillStyle = '#f1c27d'; c.beginPath(); c.arc(px, py - 52, 12, 0, 7); c.fill(); c.fillStyle = '#5b3a1e'; c.beginPath(); c.arc(px, py - 56, 12, Math.PI, 0); c.fill(); c.fillStyle = '#384c7a'; c.fillRect(px - 8, py - 10, 7, 14); c.fillRect(px + 1, py - 10, 7, 14);
      if (S.s.energia > 25) { c.fillStyle = 'rgba(255,150,40,' + (0.6 + 0.3 * Math.sin(t * 12)) + ')'; c.beginPath(); c.ellipse(580, 500, 10, 18 + Math.sin(t * 9) * 4, 0, 0, 7); c.fill(); }
      if (chuva) { c.strokeStyle = 'rgba(210,225,245,.35)'; c.lineWidth = 1.5; for (let i = 0; i < 140; i++) { const x = (i * 97 + t * 300) % W, y = (i * 53 + t * 900) % H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y - 22); c.stroke(); } if (Math.sin(t * 0.9) > 0.985) { c.fillStyle = 'rgba(230,240,255,.35)'; c.fillRect(0, 0, W, H); } } },
    teste(S, a) { const n = mdRnd(['lucas_br', 'ana.games', 'Rafa77', 'Bia', 'gamer_mg', 'Nanda']) + Math.floor(Math.random() * 99); if (a === 'chat') return { type: 'chat', id: n, name: n, text: String(1 + Math.floor(Math.random() * 2)) }; }
  };

  /* ======================= 4 · CRISTAL ======================= */
  const CRISTAL = {
    nome: '💎 Não deixe o cristal quebrar', ic: '💎', desc: 'Curtidas seguram, presentes balançam', fundo: 'radial-gradient(circle at 50% 50%,#3a1212,#0b0505 70%)',
    novo(S) { S.res = 100; S.vivo = 0; S.top = {}; S.trem = 0; S.quebrou = 0; S.aviso = 0; try { S.rec = +localStorage.getItem('mdCristalRec') || 0; } catch (e) { S.rec = 0; } this.monta(S);
      mdFala('O cristal sagrado está rachando sozinho! Curtidas consertam o cristal. Mas cuidado: cada presente causa um terremoto! Vamos ver quanto tempo o chat aguenta!', true); },
    monta(S) { mdCena.innerHTML = `<div class="topo">💎 NÃO DEIXE O CRISTAL QUEBRAR <span class="tag">AO VIVO</span></div>
      <div id="cr-s" style="position:absolute;left:465px;top:90px"></div>
      <div style="position:absolute;left:340px;right:340px;top:580px;z-index:3"><div style="display:flex;justify-content:space-between;font-weight:900"><span>RESISTÊNCIA</span><span id="cr-p"></span></div>
       <div class="br" style="height:26px;margin-top:6px;border:2px solid #fff3"><i id="cr-b" style="background:linear-gradient(90deg,#ff2a2a,#ffb02a)"></i></div>
       <div class="pq" style="text-align:center;margin-top:8px">Cai sozinho · <b>❤️ curtidas consertam</b> · <b>🎁 presentes = terremoto</b></div></div>
      <div class="pn" style="right:16px;top:84px;width:280px"><div style="font-weight:900;margin-bottom:8px">🛡️ Quem mais segurou</div><div id="cr-t" style="display:flex;flex-direction:column;gap:7px;font-size:15px"></div></div>
      <div class="pn" style="left:16px;top:84px;width:240px;text-align:center"><div class="pq">AGUENTOU</div><div style="font-size:44px;font-weight:900" id="cr-v">00:00</div><div class="pq">recorde: <b id="cr-r"></b></div></div>
      <div id="cr-f" style="position:absolute;inset:0;background:#ff2a2a;opacity:0;pointer-events:none;z-index:2"></div>`; this.topo(S); },
    mmss(s) { s = Math.floor(s); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); },
    topo(S) { const e = mdCena.querySelector('#cr-t'); if (!e) return; const L = Object.values(S.top).sort((a, b) => b.n - a.n).slice(0, 5);
      e.innerHTML = L.length ? L.map((x, i) => `<div class="it" style="display:flex;gap:8px;align-items:center">${i + 1}º ${mdAv(x.nome, x.foto, 24)}<span style="flex:1">${mdEsc(x.nome)}</span><b>${mdFmt(x.n)} ❤️</b></div>`).join('') : '<div class="it pq">Curtam pra aparecer aqui!</div>'; },
    evento(S, m) { if (S.quebrou) { if (m.type === 'chat') mdChat(m.name, mdEsc(String(m.text).slice(0, 40)), m.foto); return; }
      if (m.type === 'like') { S.res = Math.min(100, S.res + m.n * 0.35); const T = S.top[m.id] || (S.top[m.id] = { nome: m.name, foto: m.foto, n: 0 }); T.n += m.n; this.topo(S); if (m.n >= 15) mdChat(m.name, 'curtiu ' + m.n + '× ❤️ SEGURA!', m.foto); return; }
      if (m.type === 'gift') { const f = Math.min(30, 6 + Math.log10(Math.max(1, +m.diamonds || 1)) * 6); S.res -= f; S.trem = 1.4; mdChat(m.name, 'enviou 🎁 → TERREMOTO 💥', m.foto); mdGrande('💥 TERREMOTO!', '#ff6a3d', 1.6); mdFala(m.name + ' mandou um presente e causou um TERREMOTO! Curtam rápido pra segurar o cristal!', true); return; }
      if (m.type === 'chat') mdChat(m.name, mdEsc(String(m.text).slice(0, 40)), m.foto); },
    frame(S, dt, t) { if (!S.quebrou) { S.vivo += dt; S.res -= dt * (1.1 + S.vivo / 240); S.trem = Math.max(0, S.trem - dt);
        if (S.res < 25 && !S.aviso) { S.aviso = 1; mdFala('Atenção! O cristal está quase quebrando! Curtam, curtam, curtam!', true); } if (S.res > 45) S.aviso = 0;
        if (S.res <= 0) { S.res = 0; S.quebrou = 1; S.prox = 14; const rec = S.vivo > S.rec; if (rec) { S.rec = S.vivo; try { localStorage.setItem('mdCristalRec', String(S.vivo)); } catch (e) {} }
          const L = Object.values(S.top).sort((a, b) => b.n - a.n)[0];
          mdGrande('💔 O CRISTAL QUEBROU!<br><span style="font-size:32px">aguentou ' + this.mmss(S.vivo) + (rec ? ' · NOVO RECORDE!' : '') + '</span>', '#ff4d6d', 6);
          mdFala('O cristal quebrou! Vocês aguentaram ' + Math.floor(S.vivo / 60) + ' minutos e ' + Math.floor(S.vivo % 60) + ' segundos. ' + (rec ? 'É um NOVO RECORDE! ' : '') + (L ? 'Quem mais segurou foi ' + L.nome + '! ' : '') + 'Um novo cristal vai aparecer!', true); } }
      else { S.prox -= dt; if (S.prox <= 0) return this.novo(S); }
      const p = mdCena.querySelector('#cr-p'); if (p) { p.textContent = Math.round(S.res) + '%'; mdCena.querySelector('#cr-b').style.width = S.res + '%'; mdCena.querySelector('#cr-v').textContent = this.mmss(S.vivo); mdCena.querySelector('#cr-r').textContent = this.mmss(S.rec); mdCena.querySelector('#cr-f').style.opacity = S.res < 15 && !S.quebrou ? 0.12 + 0.1 * Math.sin(t * 10) : 0; }
      const k = S.trem * Math.sin(t * 60) * 8, ra = (100 - S.res) / 100, q = S.quebrou;
      const sv = mdCena.querySelector('#cr-s'); if (!sv) return;
      sv.innerHTML = `<svg width="350" height="470" viewBox="0 0 350 470"><defs><linearGradient id="crg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfefff"/><stop offset=".5" stop-color="#4ac0ff"/><stop offset="1" stop-color="#1b5fd1"/></linearGradient></defs>
       <ellipse cx="175" cy="440" rx="120" ry="18" fill="#0008"/><rect x="85" y="360" width="180" height="70" rx="12" fill="#3a2a22" stroke="#6b4c3a" stroke-width="5"/>
       ${q ? [0, 1, 2, 3, 4, 5, 6].map(i => `<polygon points="${120 + i * 18},${340 - i % 3 * 10} ${140 + i * 18},${300 - i * 6} ${150 + i * 18},${345}" fill="url(#crg)" opacity=".85" transform="rotate(${i * 25 - 60} ${140 + i * 18} 340)"/>`).join('') :
        `<g transform="translate(${k},0) rotate(${k * 0.6} 175 360)"><polygon points="175,40 260,170 220,360 130,360 90,170" fill="url(#crg)" stroke="#e8fbff" stroke-width="4" opacity=".95"/><polygon points="175,40 200,170 175,360 150,170" fill="#ffffff33"/>
        <g stroke="#fff" stroke-width="3" fill="none" opacity="${Math.min(1, ra * 1.3)}"><path d="M175 160 l-30 40 l20 25 l-35 50"/>${ra > 0.35 ? '<path d="M175 160 l40 30 l-15 35 l30 45"/>' : ''}${ra > 0.55 ? '<path d="M165 225 l-45 -10"/><path d="M200 225 l35 -40"/>' : ''}${ra > 0.75 ? '<path d="M140 280 l-20 40 M190 300 l25 45 M150 120 l-25 25"/>' : ''}</g>
        <circle cx="175" cy="200" r="${30 + Math.sin(t * 5) * 6}" fill="#bfefff" opacity="${0.25 + 0.15 * Math.sin(t * 5)}"/></g>`}</svg>`; },
    teste(S, a) { const n = mdRnd(['lucas_br', 'ana.games', 'Rafa77', 'Bia', 'gamer_mg']); if (a === 'chat') return { type: 'chat', id: n, name: n, text: mdRnd(['SEGURA', 'não quebra!!', 'kkkk', 'bora galera']) }; }
  };

  /* ======================= 5 · ZOOM ======================= */
  const ZOOM_OBJ = [['🍕', 'pizza'], ['🐶', 'cachorro|cao|dog|cachorrinho'], ['🚗', 'carro'], ['🍌', 'banana'], ['⚽', 'bola|futebol'], ['🎸', 'violao|guitarra'], ['🐘', 'elefante'], ['🍉', 'melancia'], ['🦁', 'leao'], ['🍦', 'sorvete'], ['✈️', 'aviao'], ['🐸', 'sapo|ra'],
    ['🍔', 'hamburguer|lanche|x-burguer|xburguer'], ['🌵', 'cacto'], ['🦒', 'girafa'], ['🍓', 'morango'], ['🐢', 'tartaruga|jabuti'], ['🎂', 'bolo'], ['🚀', 'foguete'], ['🐙', 'polvo'], ['🌽', 'milho'], ['🦜', 'papagaio|arara'], ['🍍', 'abacaxi'], ['🐄', 'vaca|boi'], ['🥑', 'abacate'], ['🦋', 'borboleta'], ['🐔', 'galinha|frango'], ['🍩', 'rosquinha|donut|rosca'], ['🦈', 'tubarao'], ['🐝', 'abelha']];
  const ZOOM = {
    nome: '🔎 Zoom extremo', ic: '🔎', desc: 'Adivinhe o que é antes de todo mundo', fundo: '#090b14',
    novo(S) { if (!S.hall) { S.hall = []; S.rodada = 0; } S.rodada++; let o; do { o = mdRnd(ZOOM_OBJ); } while (S.obj && o[0] === S.obj[0]); S.obj = o; S.z = 14; S.ox = 0.3 + Math.random() * 0.4; S.oy = 0.3 + Math.random() * 0.4; S.t0 = performance.now(); S.ok = 0; S.dica = 0;
      this.monta(S); mdFala('Rodada ' + S.rodada + '! O que é essa imagem? Ela está com zoom gigante. Curtidas tiram o zoom. O primeiro que acertar no chat entra no Hall da Fama!', true); },
    monta(S) { mdCena.innerHTML = `<div class="topo">🔎 O QUE É ISSO? <span class="tag" id="zo-tg">ZOOM</span></div>
      <div id="zo-q" style="position:absolute;left:340px;top:76px;width:600px;height:460px;border-radius:24px;overflow:hidden;border:4px solid #ffffff33;box-shadow:0 0 40px #4aa3ff44;background:radial-gradient(circle,#ffffff,#d9e2f2)">
       <div id="zo-i" style="position:absolute;left:50%;top:50%;font-size:300px;line-height:1;transform-origin:center"></div><div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,#0000 0 3px,#0001 3px 4px)"></div></div>
      <div style="position:absolute;left:340px;width:600px;top:550px;z-index:3"><div style="display:flex;justify-content:space-between;font-weight:900"><span>🔍 Zoom: <span id="zo-v"></span></span><span class="pq">❤️ curtidas tiram o zoom</span></div><div class="br" style="margin-top:6px"><i id="zo-b" style="background:linear-gradient(90deg,#4aa3ff,#a46bff)"></i></div></div>
      <div class="pn" style="right:16px;top:76px;width:300px"><div style="font-weight:900;font-size:18px;margin-bottom:10px">🏆 HALL DA FAMA</div><div id="zo-h" style="display:flex;flex-direction:column;gap:8px"></div></div>
      <div class="pn" style="left:16px;top:76px;width:300px"><div class="pq">RODADA ${S.rodada}</div><div id="zo-d" style="font-weight:900;font-size:18px;margin-top:4px">💬 Escreva o nome no chat</div><div class="pq" style="margin-top:10px">Quem acertar primeiro aparece no Hall da Fama</div></div>`;
      mdCena.querySelector('#zo-i').textContent = S.obj[0]; this.hall(S); },
    hall(S) { const e = mdCena.querySelector('#zo-h'); if (!e) return; const M = ['🥇', '🥈', '🥉'];
      e.innerHTML = S.hall.length ? S.hall.slice(0, 5).map((x, i) => `<div class="it" style="display:flex;gap:10px;align-items:center"><span style="font-size:20px">${M[i] || (i + 1) + 'º'}</span>${mdAv(x.nome, x.foto, 34)}<b style="flex:1">${mdEsc(x.nome)}</b><span class="pq">${x.pts} 🏆</span></div>`).join('') : '<div class="it pq">Ninguém ainda… seja o primeiro!</div>'; },
    evento(S, m) { if (m.type === 'like' && !S.ok) { S.z = Math.max(1, S.z - m.n * 0.04); return; }
      if (m.type === 'gift' && !S.ok) { S.z = Math.max(1, S.z - 3); mdChat(m.name, 'enviou 🎁 → zoom diminuiu!', m.foto); mdFala(m.name + ' mandou presente e o zoom diminuiu bastante!'); return; }
      if (m.type !== 'chat') return; const tx = mdNorm(m.text); mdChat(m.name, mdEsc(String(m.text).slice(0, 40)), m.foto); if (S.ok) return;
      const certo = S.obj[1].split('|').some(w => new RegExp('(^|\\s)' + w + 's?(\\s|$|!|\\?|\\.)').test(tx));
      if (!certo) return; S.ok = 1; S.z = 1; const seg = ((performance.now() - S.t0) / 1000).toFixed(1);
      let H = S.hall.find(x => x.id === m.id); if (!H) { H = { id: m.id, nome: m.name, foto: m.foto, pts: 0 }; S.hall.push(H); } H.pts++; S.hall.sort((a, b) => b.pts - a.pts); this.hall(S);
      mdGrande('✅ ' + mdEsc(m.name) + '<br><span style="font-size:34px">acertou: ' + S.obj[1].split('|')[0].toUpperCase() + ' em ' + seg + ' s!</span>', '#3dff8a', 5);
      mdFala('ACERTOU! ' + m.name + ' descobriu que era ' + S.obj[1].split('|')[0] + ' em ' + seg.replace('.', ',') + ' segundos! ' + (H.pts > 1 ? 'Já são ' + H.pts + ' acertos! ' : '') + 'Próxima rodada vindo aí!', true);
      S.prox = 9; },
    frame(S, dt, t) { if (S.ok) { S.prox -= dt; if (S.prox <= 0) return this.novo(S); }
      else { S.z = Math.max(1, S.z - dt * 0.09); const seg = (performance.now() - S.t0) / 1000;
        if (seg > 45 && !S.dica) { S.dica = 1; const d = mdCena.querySelector('#zo-d'); const w = S.obj[1].split('|')[0]; if (d) d.textContent = '💡 Começa com "' + w.charAt(0).toUpperCase() + '" e tem ' + w.length + ' letras'; mdFala('Dica: começa com a letra ' + w.charAt(0).toUpperCase() + ' e tem ' + w.length + ' letras!', true); }
        if (S.z <= 1.02 && seg > 20) { S.ok = 1; S.prox = 8; mdGrande('Era: ' + S.obj[0] + ' ' + S.obj[1].split('|')[0].toUpperCase(), '#ffcf4a', 4); mdFala('Ninguém acertou! Era ' + S.obj[1].split('|')[0] + '! Vamos pra próxima!', true); } }
      const i = mdCena.querySelector('#zo-i'); if (!i) return; const z = S.z, ox = (S.ox - 0.5) * 300 * (z - 1) / 13, oy = (S.oy - 0.5) * 300 * (z - 1) / 13;
      i.style.transform = `translate(-50%,-50%) translate(${-ox * z * 0.4}px,${-oy * z * 0.4}px) scale(${z})`; i.style.filter = 'blur(' + Math.max(0, (z - 2.5) * 0.35) + 'px)';
      mdCena.querySelector('#zo-v').textContent = Math.round(z * 100) + '%'; mdCena.querySelector('#zo-b').style.width = (100 - (z - 1) / 13 * 100) + '%'; mdCena.querySelector('#zo-tg').textContent = 'ZOOM ' + Math.round(z * 100) + '%'; },
    teste(S, a) { const n = mdRnd(['lucas_br', 'ana.games', 'Rafa77', 'Bia', 'gamer_mg']); if (a === 'chat') return { type: 'chat', id: n, name: n, text: Math.random() < 0.25 ? S.obj[1].split('|')[0] : mdRnd(['pizza?', 'é um carro', 'banana', 'sei la kkk', 'bola']) }; }
  };

  const MODOS = { cofre: COFRE, monstro: MD_MONSTRO, ilha: ILHA, cristal: CRISTAL, zoom: ZOOM };

  /* ---------- ligar / desligar ---------- */
  function mdLiga(k) { if (!souAdmin()) return; if (zona !== 'arena') { try { arenaEntra(); } catch (e) {} }
    MODO.on = true; MODO.k = k; MODO.st = {}; mdOv.classList.add('on'); mdEscEl.classList.remove('on'); mdFundo.style.background = MODOS[k].fundo; mdQ('#md-chat').innerHTML = ''; mdBarra(); mdAjusta();
    MODOS[k].novo(MODO.st); }
  function mdDesliga() { MODO.on = false; MODO.k = ''; mdOv.classList.remove('on'); mdBar.hidden = true; mdCena.innerHTML = ''; try { VOZ.fila = []; } catch (e) {} }
  function mdBarra() { mdBar.hidden = false; mdBar.classList.remove('ab'); mdBar.innerHTML = '<button data-a="abre" class="tg">⚙️</button><button data-a="chat">💬 Chat teste</button><button data-a="like">❤️ Curtidas</button><button data-a="gift">🎁 Presente</button><button data-a="menu">🎮 Modos</button><button class="x" data-a="sair">✕ Arena</button>';
    mdBar.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); const a = b.dataset.a; const n = mdRnd(['lucas_br', 'ana.games', 'Rafa77', 'Bia', 'gamer_mg', 'Nanda']);
      if (a === 'abre') return mdBar.classList.toggle('ab');
      if (a === 'sair') return mdDesliga(); if (a === 'menu') return mdMenu();
      if (a === 'like') return mdEvento({ type: 'like', id: n, name: n, count: 25 + Math.floor(Math.random() * 60) });
      if (a === 'gift') return mdEvento({ type: 'gift', id: n, name: n, gift: 'Rosa', diamonds: 1 });
      const M = MODOS[MODO.k]; const m = M.teste && M.teste(MODO.st, 'chat'); if (m) mdEvento(m); }); }
  function mdMenu() { mdEscEl.innerHTML = '<div style="font-weight:900;font-size:22px">🎮 Modos da Live interativa</div><div class="cs">' + Object.entries(MODOS).map(([k, M]) => `<button class="c" data-k="${k}"><div>${M.ic}</div>${M.nome.replace(/^\S+\s/, '')}<small>${M.desc}</small></button>`).join('') + '</div><button data-k="" style="padding:10px 18px;border-radius:14px;border:0;background:#e5243b;color:#fff;font-weight:800">⚔️ Voltar pra Arena normal</button>';
    mdEscEl.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { mdEscEl.classList.remove('on'); if (b.dataset.k) mdLiga(b.dataset.k); else mdDesliga(); }); mdEscEl.classList.add('on'); }
  mdBtn.onclick = () => mdMenu();

  /* ---------- eventos da live → modo ligado ---------- */
  function mdEvento(m) { const M = MODOS[MODO.k]; if (!M) return; const e = { type: m.type, id: String(m.id), name: String(m.name || m.id || 'alguém').slice(0, 24), foto: m.foto, text: m.text, gift: m.gift, diamonds: m.diamonds, n: Math.max(1, Math.min(500, +m.count || 1)) };
    if (e.type === 'join') { if (Math.random() < 0.35) mdFala('Bem-vindo, ' + e.name + '! Chegou na hora certa: ' + M.desc.toLowerCase() + '!'); return; }
    if (e.type === 'follow') { mdChat(e.name, 'seguiu a live ❤️', e.foto); return; }
    try { M.evento(MODO.st, e); } catch (er) { console.warn('modo', er); } }
  { const _le4 = liveEvento; liveEvento = function (m) { if (MODO.on && m && m.type !== 'tirar' && souAdmin()) { try { mdEvento(m); } catch (e) {} return; } return _le4(m); }; }

  /* ---------- quadro a quadro ---------- */
  let mdT0 = performance.now(), mdUlt = mdT0;
  (function mdLoop(agora) { requestAnimationFrame(mdLoop);
    mdBtn.hidden = !(zona === 'arena' && souAdmin()) || MODO.on; if (!MODO.on) return;
    const dt = Math.min(0.1, (agora - mdUlt) / 1000); mdUlt = agora; const t = (agora - mdT0) / 1000;
    if (NAR.balT > 0) { NAR.balT -= dt; if (NAR.balT <= 0 && !(typeof VOZ !== 'undefined' && VOZ.tocando)) mdQ('#md-bal').classList.remove('on'); else if (NAR.balT <= 0) NAR.balT = 0.2; }
    narDesenha(t);
    try { MODOS[MODO.k].frame(MODO.st, dt, t); } catch (e) { console.warn('modo', e); }
    if (zona !== 'arena' && MODO.on) mdDesliga(); })(performance.now());
  window.__modo = k => { mdLiga(k); return MODO.k; };
