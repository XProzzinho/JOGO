  // ===================== ESPADAS NOVAS + ESPADAS DE ADM/GM (atacam e mandam buff) =====================
  function fazEspadas(T){
 const ext=(sh,d,bv)=>{const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelThickness:bv||.02,bevelSize:bv||.02,bevelSegments:2});g.translate(0,0,-d/2);return g};
 const mt=(c,m,r,e)=>new T.MeshStandardMaterial({envMap:ENV,envMapIntensity:1.2,color:c,metalness:(m==null?.85:m)*.55,roughness:Math.max(.3,r==null?.25:r),emissive:e||'#000',emissiveIntensity:e?1:0});
 const neon=c=>new T.MeshBasicMaterial({color:c,toneMapped:false});
 const spr=(c,s)=>{const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);const m=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));m.scale.set(s,s,1);return m};
 const txt=(t,cor,fundo)=>{const cv=document.createElement('canvas');cv.width=256;cv.height=64;const x=cv.getContext('2d');if(fundo){x.fillStyle=fundo;x.fillRect(0,0,256,64)}x.font='900 46px Arial Black,Arial';x.textAlign='center';x.textBaseline='middle';x.shadowColor=cor;x.shadowBlur=14;x.fillStyle=cor;x.fillText(t,128,34);x.fillText(t,128,34);const m=new T.Mesh(new T.PlaneGeometry(.5,.125),new T.MeshBasicMaterial({map:new T.CanvasTexture(cv),transparent:true,toneMapped:false,side:T.DoubleSide}));return m};
 const lamina=(L,W,ponta)=>{const s=new T.Shape();s.moveTo(-W/2,0);s.lineTo(W/2,0);s.lineTo(W/2*.9,L*.8);s.lineTo(0,L+ponta);s.lineTo(-W/2*.9,L*.8);s.lineTo(-W/2,0);return s};
 const add=(p,geo,mat,x,y,z,rx,ry,rz,sx,sy,sz)=>{const m=new T.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,rz||0);if(sx)m.scale.set(sx,sy,sz);p.add(m);return m};
 const SPH=new T.SphereGeometry(1,24,16),CYL=new T.CylinderGeometry(1,1,1,20),TOR=new T.TorusGeometry(1,.12,10,48),OCT=new T.OctahedronGeometry(1,0),CON=new T.ConeGeometry(1,1,16);
 const cabo=(g,cor,ouro,gema)=>{add(g,CYL,mt(cor,.2,.7),0,-.32,0,0,0,0,.045,.5,.045);for(let i=0;i<6;i++)add(g,TOR,mt(ouro),0,-.12-i*.08,0,Math.PI/2,0,0,.05,.05,.05);add(g,OCT,mt(ouro),0,-.62,0,0,0,0,.07,.1,.07);add(g,OCT,neon(gema),0,-.62,0,0,0,0,.045,.065,.075)};
 const E={};
 // 1) LÂMINA SUPREMA: espadão vermelho e dourado com coroa na guarda
 E[1]=(sig,cor,c2)=>{const g=new T.Group();add(g,ext(lamina(1.7,.26,.25),.04),mt('#e8ecf4',.95,.12),0,0,0);add(g,ext(lamina(1.5,.07,.2),.12,.01),neon(cor),0,.08,0);
  add(g,ext((()=>{const s=new T.Shape();s.moveTo(-.42,-.02);s.quadraticCurveTo(-.3,.14,-.12,.06);s.lineTo(0,.16);s.lineTo(.12,.06);s.quadraticCurveTo(.3,.14,.42,-.02);s.lineTo(0,-.08);s.lineTo(-.42,-.02);return s})(),.08),mt('#ffc83a',.95,.2),0,0,0);
  [-1,0,1].forEach(i=>add(g,CON,mt('#ffc83a'),i*.09,.22+(i?0:.04),0,0,0,0,.035,.12,.035));add(g,OCT,neon(cor),0,.03,.05,0,0,0,.06,.08,.03);
  cabo(g,'#3a0a0a','#ffc83a',cor);const t=txt(sig,'#fff');t.position.set(0,.85,.075);t.rotation.z=Math.PI/2;g.add(t);(()=>{const q=spr(c2,1.6);q.position.set(0,.9,0);g.add(q)})();return g};
 // 2) CORROMPIDA DIGITAL: lâmina preta com circuitos neon
 E[2]=(sig,cor,c2)=>{const g=new T.Group();const s=new T.Shape();s.moveTo(-.12,0);s.lineTo(.14,0);s.lineTo(.16,.6);s.lineTo(.1,.7);s.lineTo(.13,1.3);s.lineTo(0,1.75);s.lineTo(-.1,1.25);s.lineTo(-.14,.9);s.lineTo(-.1,.8);s.lineTo(-.12,0);add(g,ext(s,.05),mt('#2a2a36',.6,.35),0,0,0);
  for(let i=0;i<9;i++){const y=.12+i*.16;add(g,new T.BoxGeometry(1,1,1),neon(cor),(i%2?.04:-.04),y,.05,0,0,0,.12-(i%3)*.02,.012,.005);add(g,new T.BoxGeometry(1,1,1),neon(cor),(i%2?.09:-.09),y+.05,.05,0,0,0,.012,.1,.005)}
  add(g,new T.BoxGeometry(1,1,1),mt('#22222a',.7,.3),0,0,0,0,0,0,.6,.07,.12);[-1,1].forEach(s=>{add(g,new T.BoxGeometry(1,1,1),neon(cor),s*.31,0,0,0,0,0,.06,.1,.14);add(g,new T.BoxGeometry(1,1,1),mt('#22222a'),s*.36,.08,0,0,0,s*.6,.05,.2,.08)});
  cabo(g,'#101014','#5a5a6a',cor);const t=txt(sig,cor);t.position.set(0,1.0,.075);t.rotation.z=Math.PI/2;g.add(t);(()=>{const q=spr(c2,1.4);q.position.set(0,.9,0);g.add(q)})();
  for(let i=0;i<5;i++)add(g,new T.BoxGeometry(1,1,1),neon(cor),(Math.random()-.5)*.6,.3+Math.random()*1.4,0,0,0,0,.04,.04,.04);return g};
 // 3) CELESTIAL: lâmina de cristal com asas na guarda e auréola
 E[3]=(sig,cor,c2)=>{const g=new T.Group();add(g,ext(lamina(1.6,.2,.3),.05),new T.MeshPhysicalMaterial({color:c2,metalness:0,roughness:.05,transmission:.6,thickness:.2,emissive:cor,emissiveIntensity:.35,transparent:true,opacity:.9}),0,0,0);add(g,ext(lamina(1.4,.05,.25),.12,.01),neon('#ffffff'),0,.1,0);
  [-1,1].forEach(s=>{const w=new T.Shape();w.moveTo(0,0);w.quadraticCurveTo(.25,.05,.45,.28);w.lineTo(.38,.16);w.lineTo(.42,.12);w.lineTo(.3,.06);w.lineTo(.32,.0);w.lineTo(.18,-.02);w.lineTo(0,-.06);const m=add(g,ext(w,.03,.01),mt('#f4f0ff',.9,.2),s*.05,.02,0);m.scale.x=s});
  add(g,TOR,neon(cor),0,1.95,0,Math.PI/2.4,0,0,.18,.18,.18);cabo(g,'#e8e8f4','#ffd86a',cor);const t=txt(sig,cor);t.position.set(0,.8,.075);t.rotation.z=Math.PI/2;g.add(t);(()=>{const q=spr(c2,1.8);q.position.set(0,.95,0);g.add(q)})();return g};
 // 4) DRAGÃO REAL: lâmina serrilhada com chamas e boca de dragão na guarda
 E[4]=(sig,cor,c2)=>{const g=new T.Group();const s=new T.Shape();s.moveTo(-.13,0);for(let i=0;i<7;i++){s.lineTo(-.14,i*.22+.11);s.lineTo(-.19,i*.22+.18)}s.lineTo(0,1.85);for(let i=6;i>=0;i--){s.lineTo(.19,i*.22+.18);s.lineTo(.14,i*.22+.11)}s.lineTo(.13,0);add(g,ext(s,.05),mt('#5a5a66',.9,.25),0,0,0);
  add(g,ext(lamina(1.5,.08,.2),.12,.01),neon(cor),0,.1,0);add(g,SPH,mt('#8a1a1a',.6,.3),0,0,.0,0,0,0,.2,.12,.12);[-1,1].forEach(s2=>{add(g,CON,mt('#f4ecd8',.2,.4),s2*.14,.1,-.05,-.4,0,s2*-.5,.04,.25,.04);add(g,SPH,neon('#ffe24a'),s2*.08,.06,.1,0,0,0,.03,.025,.02)});
  cabo(g,'#2a0a0a','#c8902a',cor);const t=txt(sig,'#fff2c0');t.position.set(0,.85,.075);t.rotation.z=Math.PI/2;g.add(t);for(let i=0;i<4;i++){const q=spr(c2,.6+i*.25);q.position.set((i%2-.5)*.2,.4+i*.4,0);g.add(q)}return g};
 // 5) EXECUTORA DUPLA: lâmina dupla paralela com núcleo de energia
 E[5]=(sig,cor,c2)=>{const g=new T.Group();[-1,1].forEach(s=>{const b=add(g,ext(lamina(1.55,.12,.3),.04),mt('#dfe4ee',.95,.15),s*.11,.05,0);b.rotation.z=-s*.02});
  for(let i=0;i<10;i++)(()=>{const q=spr(cor,.16);q.position.set(0,.15+i*.15,0);g.add(q)})();add(g,CYL,neon(cor),0,.8,0,0,0,0,.025,1.4,.025);
  add(g,TOR,mt('#ffc83a'),0,.0,0,0,0,0,.24,.24,.6);add(g,SPH,neon(cor),0,0,0,0,0,0,.09,.09,.09);(()=>{const q=spr(c2,.9);q.position.set(0,0,0);g.add(q)})();
  cabo(g,'#1a1a2a','#ffc83a',cor);const t=txt(sig,cor,'rgba(10,10,20,.85)');t.scale.set(.5,.5,.5);t.position.set(0,1.3,.075);t.rotation.z=Math.PI/2;g.add(t);(()=>{const q=spr(c2,1.5);q.position.set(0,.9,0);g.add(q)})();return g};
 return E;}
  const ESP_MOD = fazEspadas(T3);
  const ESP_DEF = { esp_suprema: [1, '#ff3a2a', 'rgba(255,90,60,.45)', ''], esp_corrompida: [2, '#3aff7a', 'rgba(60,255,120,.45)', ''], esp_celestial: [3, '#ffe08a', 'rgba(255,230,150,.5)', ''], esp_dragao_real: [4, '#ff8a1a', 'rgba(255,140,40,.5)', ''], esp_executora: [5, '#b45aff', 'rgba(180,90,255,.5)', ''],
    esp_adm: [1, '#ff2a3a', 'rgba(255,60,60,.55)', 'ADM'], esp_gm: [5, '#2ad8ff', 'rgba(60,200,255,.55)', 'GM'] };
  Object.keys(ESP_DEF).forEach(k => { const [n, c, c2, sig] = ESP_DEF[k]; const G = grp(maoG); const inner = ESP_MOD[n](sig, c, c2); inner.position.y = 0.32; G.add(inner); G.rotation.x = Math.PI / 2; G.scale.setScalar(0.55); G.visible = false; G.traverse(o => { if (o.isMesh) o.castShadow = true; }); ARMAG[k] = G; });
  // ---- PLACAS DE ADM / GM (arma grande; o Painel ADM manda pros ADM/GM) ----
  function fazPlaca(k, cor, brilho) { const T = T3, g = new T.Group(), env = { envMap: ENV, envMapIntensity: 1.2 };
    const ouro = new T.MeshStandardMaterial(Object.assign({ color: '#ffc83a', metalness: 0.5, roughness: 0.3, emissive: '#3a2400' }, env)), esc = new T.MeshStandardMaterial({ color: '#2b2340', metalness: 0.4, roughness: 0.45 }), cm = new T.MeshStandardMaterial({ color: cor, metalness: 0.3, roughness: 0.3, emissive: cor, emissiveIntensity: 0.35 });
    const m = (geo, mat, x, y, z) => { const o = new T.Mesh(geo, mat); o.position.set(x || 0, y || 0, z || 0); g.add(o); return o; };
    m(new T.CylinderGeometry(0.045, 0.05, 1.25, 12), esc, 0, 0.25, 0); for (let i = 0; i < 6; i++) m(new T.TorusGeometry(0.052, 0.012, 6, 16), ouro, 0, -0.2 + i * 0.09, 0).rotation.x = Math.PI / 2;
    m(new T.OctahedronGeometry(0.1), cm, 0, -0.42, 0).scale.y = 1.4; m(new T.BoxGeometry(0.42, 0.08, 0.12), ouro, 0, 0.36, 0); [-1, 1].forEach(s => m(new T.SphereGeometry(0.06, 12, 10), cm, s * 0.23, 0.36, 0));
    const W = 2.7, H = W * 300 / 520, pl = new T.Group(); pl.position.y = 0.86 + H * 0.35; g.add(pl); const sh = new T.Shape(), hx = x => (x - 260) / 520 * W, hy = y => -(y - 150) / 300 * H;
    [[110, 92], [410, 92], [428, 150], [410, 208], [110, 208], [92, 150]].forEach(([x, y], i) => i ? sh.lineTo(hx(x), hy(y)) : sh.moveTo(hx(x), hy(y)));
    const core = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2 }), ouro); core.position.z = -0.06; pl.add(core);
    const tx = new T.TextureLoader().load('icones/placa_' + k + '.png'); tx.colorSpace = T.SRGBColorSpace; tx.anisotropy = 4;
    [1, -1].forEach(s => { const f = new T.Mesh(new T.PlaneGeometry(W, H), new T.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: 0.05, metalness: 0.2, roughness: 0.4, emissive: '#ffffff', emissiveMap: tx, emissiveIntensity: 0.35 })); f.position.z = s * 0.096; if (s < 0) f.rotation.y = Math.PI; pl.add(f); });
    [-1, 1].forEach(s => { const c = new T.Mesh(new T.ConeGeometry(0.06, 0.32, 4), ouro); c.position.set(s * (W / 2 + 0.02), 0, 0); c.rotation.z = -s * Math.PI / 2; pl.add(c); });
    const tp = new T.Mesh(new T.ConeGeometry(0.07, 0.4, 6), cm); tp.position.y = H / 2 + 0.2; pl.add(tp); glowSpr(pl, 0, 0, 0, 4.2, brilho, 0.45); return g; }
  [['placa_adm', '#c81e1e', '#ff3a2a'], ['placa_gm', '#1e6ad8', '#3aa8ff']].forEach(([k, c, b]) => { const G = grp(maoG); G.rotation.x = Math.PI / 2; G.rotateZ(Math.PI); G.add(fazPlaca(k.slice(6), c, b)); G.scale.setScalar(0.63); G.visible = false; G.traverse(o => { if (o.isMesh) o.castShadow = true; }); ARMAG[k] = G; ESP_DEF[k] = [0, b, '', '']; });
  // ---- efeitos especiais das espadas ----
  function espHit(A, e) { const p = heroi.position;
    if (A.esp === 'corr') { e.vuln = Math.max(e.vuln, 4); if (Math.random() < 0.2) { e.stun = Math.max(e.stun, 0.8); numero(e.g.position, 'GLITCH', '#3aff7a', e.T.alt + 0.4); } }
    if (A.esp === 'cel') { const v = Math.max(1, Math.round(VIDA_MAX * 0.03)); vida = Math.min(VIDA_MAX, vida + v); }
    if (A.esp === 'drag') e.queima = 4;
    if (A.esp === 'staff') { e.queima = 4; e.vuln = 6; } }
  function espGolpe(A) { if (atkN !== 3) return; const p = heroi.position, M = atkMult(), c = (ESP_DEF[AR.arma] || [])[1] || '#fff';
    if (A.esp === 'sup' || A.esp === 'staff') { area(p.x, p.z, 4, e => dano(e, A.dano * 0.6 * M)); fx('luz', [p.x, 0, p.z], 0.7); tremor = Math.max(tremor, 0.35); flash('rgba(255,220,160,.2)'); }
    if (A.esp === 'drag') { const x = p.x + Math.sin(facing) * 2.2, z = p.z + Math.cos(facing) * 2.2; area(x, z, 2.8, e => { dano(e, A.dano * 0.8 * M, 'fogo'); e.queima = 4; }); fx('chama', [x, 0.5, z], 1, facing); fx('fumo', [x, 0, z], 0.8); }
    if (A.esp === 'cel') { fx('cura', [p.x, 0, p.z], 0.8); }
    if (A.esp === 'exec') { proj(p.x, p.y + 1.2, p.z, facing, c, A.dano * 0.7 * M, 28, 16, { fura: true, tam: 1.1 }); } }
  // ---- ADM / GM ----
  var souGM = false, souADMc = false, staffPronto = false;
  function staffArmas() { const adm = souAdmin(); const quer = { esp_adm: adm, esp_gm: adm || souGM };
    if (staffPronto) ['placa_adm', 'placa_gm'].forEach(k => { if (AR.armas.includes(k) && !podeArma(k)) { AR.armas = AR.armas.filter(x => x !== k); if (AR.arma === k) equipaArma(null); } });
    Object.keys(quer).forEach(k => { const tem = AR.armas.includes(k); if (quer[k] && !tem) { AR.armas.push(k); aviso('Você recebeu: ' + ARMAS[k].icone + ' ' + ARMAS[k].nome + '!', '#ff5aa8'); } if (!quer[k] && tem) { AR.armas = AR.armas.filter(x => x !== k); if (AR.arma === k) equipaArma(null); } }); }
  setTimeout(() => { try { if (window.CONTA && CONTA.db && CONTA.usuario) CONTA.db.collection('staff').doc(CONTA.usuario.uid).get().then(d => { souGM = d.exists && (d.data().cargo === 'gm' || d.data().cargo === 'adm'); souADMc = d.exists && d.data().cargo === 'adm'; staffPronto = true; staffArmas(); salvaAR(); }).catch(() => staffArmas()); else { staffPronto = true; staffArmas(); } } catch (e) { staffArmas(); } }, 7000);
  // botão BUFF (aparece com a espada de ADM/GM) e janela pra mandar buff pros jogadores perto
  var buffBtn = document.createElement('button'); buffBtn.className = 'btn'; buffBtn.id = 'buff-btn'; buffBtn.hidden = true; buffBtn.innerHTML = '<img class="ico" src="icones/gm_divino.svg" alt=""> BUFF'; document.body.appendChild(buffBtn);
  var buffP = document.createElement('div'); buffP.id = 'buffp'; buffP.hidden = true; document.body.appendChild(buffP);
  var bfTipo = 'forca', bfMin = 30, bfPct = 50;
  function bfDesenha() { const p = heroi.position, perto = [{ uid: CONTA.usuario && CONTA.usuario.uid, n: trNome() + ' (você)', d: 0 }];
    Object.values(MP.outros || {}).forEach(o => { if (!o.d || !o.d.u) return; const d = Math.hypot(o.x - p.x, o.z - p.z); if (d < 25) perto.push({ uid: o.d.u, n: String(o.d.n || 'Jogador').replace(/</g, ''), d }); });
    perto.sort((a, b) => a.d - b.d);
    buffP.innerHTML = `<div class="box"><div class="hd"><b>${ARMAS[AR.arma].icone} Mandar buff</b><button class="x">✕</button></div><div class="tp">${Object.keys(GMB_INFO).map(k => `<button data-t="${k}" class="${k === bfTipo ? 'on' : ''}" style="--c:${GMB_INFO[k][1]}">${IC('gm_' + k)}<small>${GMB_INFO[k][0]}</small></button>`).join('')}</div>
      <div class="op">${[[5, '5 min'], [30, '30 min'], [60, '1 h'], [1440, '24 h'], [0, '∞']].map(([m, t]) => `<button data-m="${m}" class="${m === bfMin ? 'on' : ''}">${t}</button>`).join('')}</div><div class="op">${[25, 50, 75, 100].map(v => `<button data-p="${v}" class="${v === bfPct ? 'on' : ''}">${v}%</button>`).join('')}</div>
      <div class="ls">${perto.map(j => `<div class="jg"><span>${j.n}${j.d ? ` <i>${j.d.toFixed(0)} m</i>` : ''}</span><button data-u="${j.uid}">Dar</button></div>`).join('')}${perto.length < 2 ? '<p>Nenhum jogador perto (até 25 m). Dá pra mandar pra você mesmo.</p>' : ''}</div></div>`;
    buffP.querySelector('.x').onclick = () => { buffP.hidden = true; };
    buffP.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { bfTipo = b.dataset.t; bfDesenha(); }); buffP.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { bfMin = +b.dataset.m; bfDesenha(); }); buffP.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { bfPct = +b.dataset.p; bfDesenha(); });
    buffP.querySelectorAll('[data-u]').forEach(b => b.onclick = async () => { const uid = b.dataset.u, nome = b.parentNode.querySelector('span').textContent.replace(/\s\d+ m$/, ''); if (!uid || !CONTA.db) { aviso('Precisa estar logado.', '#ff6a6a'); return; } b.disabled = true;
      const item = { id: Math.random().toString(36).slice(2, 10), tipo: bfTipo, pct: bfPct, ate: bfMin ? Date.now() + bfMin * 60000 : 0, imune: false, por: CONTA.usuario.uid, porNome: trNome(), criado: Date.now() };
      try { const ref = CONTA.db.collection('buffs').doc(uid); await CONTA.db.runTransaction(async t => { const d = await t.get(ref); const L = ((d.exists && d.data().lista) || []).filter(x => x.tipo !== item.tipo && (!x.ate || x.ate > Date.now())); L.push(item); t.set(ref, { lista: L, nome, mudou: Date.now() }, { merge: true }); });
        CONTA.db.collection('buffLog').add({ acao: 'aplicar', alvo: uid, alvoNome: nome, por: CONTA.usuario.uid, porNome: trNome(), cargo: souAdmin() ? 'adm' : 'gm', tipo: item.tipo, pct: bfPct, min: bfMin, criado: Date.now() }).catch(() => {});
        aviso(IC('gm_' + bfTipo) + ' ' + GMB_INFO[bfTipo][0] + ' enviado pra ' + nome + '!', GMB_INFO[bfTipo][1]); fx('luz', [heroi.position.x, 0, heroi.position.z], 0.6); som('magia', 0.7); } catch (e) { aviso('Não deu: ' + (e.code || e.message), '#ff6a6a'); } b.disabled = false; }); }
  tapBtn(buffBtn, () => { if (buffP.hidden) { bfDesenha(); buffP.hidden = false; } else buffP.hidden = true; });
  // ---- BRILHO das armas aprimoradas: +6 azul, +10 roxo intenso, +15 dourado fortíssimo ----
  const BR_TEX = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T3.CanvasTexture(c); })();
  const BR_EST = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(32, 0); x.lineTo(37, 27); x.lineTo(64, 32); x.lineTo(37, 37); x.lineTo(32, 64); x.lineTo(27, 37); x.lineTo(0, 32); x.lineTo(27, 27); x.closePath(); x.fill(); return new T3.CanvasTexture(c); })();
  function brTier(n) { return n >= 15 ? 3 : n >= 10 ? 2 : n >= 6 ? 1 : 0; }
  function brMonta(obj, tier) { const old = obj.userData.br; if (old) { obj.remove(old); obj.userData.br = null; } if (!tier) return;
    const C = [null, ['#5ab8ff', '#bfe6ff'], ['#b45aff', '#ffb0ff'], ['#ffb020', '#fff2a0']][tier], g = new T3.Group(); g.userData.tier = tier; g.userData.sp = []; g.userData.st = []; g.userData.an = [];
    const vis = obj.visible; obj.visible = true; obj.updateMatrixWorld(true); const inv = new T3.Matrix4().copy(obj.matrixWorld).invert(), bx = new T3.Box3();
    obj.traverse(o => { if (o.isMesh && o.geometry && o.material && o.material.blending !== T3.AdditiveBlending) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bx.union(o.geometry.boundingBox.clone().applyMatrix4(new T3.Matrix4().multiplyMatrices(inv, o.matrixWorld))); } }); obj.visible = vis;
    if (bx.isEmpty()) return; obj.add(g); obj.userData.br = g; const sz = bx.getSize(new T3.Vector3()), c = bx.getCenter(new T3.Vector3()), ax = sz.x >= sz.y && sz.x >= sz.z ? 'x' : sz.y >= sz.z ? 'y' : 'z', L = sz[ax], N = [0, 6, 10, 14][tier];
    const sp = (map, cor, op, sc, pos) => { const m = new T3.Sprite(new T3.SpriteMaterial({ map, color: cor, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: op })); m.position.copy(pos); m.scale.set(sc, sc, 1); m.userData.op = op; m.userData.sc = sc; g.add(m); return m; };
    for (let i = 0; i < N; i++) { const pos = c.clone(); pos[ax] = bx.min[ax] + L * (0.15 + i / (N - 1) * 0.85); g.userData.sp.push(sp(BR_TEX, i % 2 ? C[1] : C[0], [0, 0.5, 0.6, 0.8][tier], L * [0, 0.28, 0.42, 0.6][tier], pos)); }
    g.userData.sp.push(sp(BR_TEX, C[0], [0, 0.35, 0.45, 0.7][tier], L * [0, 1, 1.5, 2.2][tier], c));
    if (tier >= 2) { const o2 = ['x', 'y', 'z'].filter(a => a !== ax); for (let i = 0; i < (tier === 3 ? 16 : 7); i++) { const pos = c.clone(); pos[ax] = bx.min[ax] + L * Math.random(); pos[o2[0]] += (Math.random() - 0.5) * L * 0.35; pos[o2[1]] += (Math.random() - 0.5) * L * 0.35; const m = sp(BR_EST, i % 3 ? C[1] : '#ffffff', 1, L * (0.06 + Math.random() * 0.1) * (tier === 3 ? 1.6 : 1), pos); m.userData.ph = Math.random() * 6; g.userData.st.push(m); } }
    if (tier === 3) [1, 1.35].forEach((k, i) => { const an = new T3.Mesh(new T3.TorusGeometry(L * 0.18 * k, L * 0.012, 8, 40), new T3.MeshBasicMaterial({ color: '#fff2a0', transparent: true, opacity: 0.85, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false })); an.position.copy(c); const eixo = new T3.Vector3(); eixo[ax] = 1; an.quaternion.setFromUnitVectors(new T3.Vector3(0, 0, 1), eixo); an.userData.ax = eixo; an.userData.v = i ? -2.2 : 3; g.add(an); g.userData.an.push(an); }); }
  function brAtualiza() { const k = AR.arma, t = brTier((AR.aprim && AR.aprim[k]) || 0); [ARMAG[k], typeof ARMAE !== 'undefined' ? ARMAE[k] : null].forEach(o => { if (!o) return; const cur = o.userData.br ? o.userData.br.userData.tier : 0; if (cur !== t) brMonta(o, t); }); }
  function brFrame() { brAtualiza(); [ARMAG[AR.arma], typeof ARMAE !== 'undefined' ? ARMAE[AR.arma] : null].forEach(o => { const g = o && o.userData.br; if (!g) return; const ti = g.userData.tier, pu = 0.75 + Math.sin(gT * (2 + ti)) * 0.25;
      g.userData.sp.forEach(m => { m.material.opacity = m.userData.op * pu; }); g.userData.st.forEach(m => { const v = Math.max(0, Math.sin(gT * 4 + m.userData.ph)); m.material.opacity = v; m.scale.setScalar(m.userData.sc * (0.5 + v * 0.7)); m.scale.z = 1; });
      g.userData.an.forEach(a => a.rotateOnAxis(new T3.Vector3(0, 0, 1), a.userData.v * 0.016)); }); }
  // ===================== ANEL LENDÁRIO (costas do ADM): gira, e no ataque os 2 elos voam girando, atacam e voltam =====================
  const HALO = (() => { const T = T3, cv = (n, f) => { const c = document.createElement('canvas'); c.width = c.height = n; f(c.getContext('2d'), n); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; };
    const ouro = (x, r0, r1) => { const g = x.createRadialGradient(0, 0, r0, 0, 0, r1); g.addColorStop(0, '#ffe9a0'); g.addColorStop(0.35, '#e8a830'); g.addColorStop(0.7, '#a8600a'); g.addColorStop(1, '#5a2a04'); return g; };
    const texA = cv(512, (x, n) => { const c = n / 2; x.translate(c, c); const N = 22; x.lineWidth = 1.6; x.strokeStyle = '#5a2a04';
      for (let i = 0; i < N; i++) { x.save(); x.rotate(i / N * Math.PI * 2); const L = (i % 2 ? 0.86 : 0.98) * c, w = c * 0.07; x.beginPath(); x.moveTo(-w, c * 0.5); x.bezierCurveTo(-w * 1.6, c * 0.7, w * 0.6, c * 0.78, -w * 0.3, L); x.bezierCurveTo(w * 1.8, c * 0.8, w * 1.5, c * 0.65, w, c * 0.5); x.closePath();
        const g = x.createLinearGradient(0, c * 0.5, 0, L); g.addColorStop(0, '#7a3a04'); g.addColorStop(0.45, '#d8901a'); g.addColorStop(0.8, '#ffd86a'); g.addColorStop(1, '#fff2c0'); x.fillStyle = g; x.fill(); x.stroke();
        x.beginPath(); x.moveTo(w * 0.6, c * 0.62); x.quadraticCurveTo(w * 3, c * 0.66, w * 2.6, c * 0.74); x.quadraticCurveTo(w * 1.8, c * 0.68, w * 0.8, c * 0.68); x.closePath(); x.fillStyle = '#c8801a'; x.fill(); x.stroke(); x.restore(); }
      x.beginPath(); x.arc(0, 0, c * 0.54, 0, Math.PI * 2); x.moveTo(c * 0.46, 0); x.arc(0, 0, c * 0.46, 0, Math.PI * 2, true); x.fillStyle = ouro(x, c * 0.46, c * 0.54); x.fill('evenodd'); x.lineWidth = 2; x.beginPath(); x.arc(0, 0, c * 0.54, 0, 7); x.stroke(); x.beginPath(); x.arc(0, 0, c * 0.46, 0, 7); x.stroke();
      for (let i = 0; i < 44; i++) { x.save(); x.rotate(i / 44 * Math.PI * 2); x.fillStyle = '#5a2a04'; x.fillRect(-1.5, c * 0.47, 3, c * 0.06); x.restore(); } });
    const texB = cv(512, (x, n) => { const c = n / 2; x.translate(c, c); x.beginPath(); x.arc(0, 0, c * 0.78, 0, Math.PI * 2); x.moveTo(c * 0.6, 0); x.arc(0, 0, c * 0.6, 0, Math.PI * 2, true); x.fillStyle = ouro(x, c * 0.6, c * 0.78); x.fill('evenodd'); x.lineWidth = 2.5; x.strokeStyle = '#5a2a04'; x.beginPath(); x.arc(0, 0, c * 0.78, 0, 7); x.stroke(); x.beginPath(); x.arc(0, 0, c * 0.6, 0, 7); x.stroke();
      x.strokeStyle = '#6a1a04'; x.lineWidth = 2.5; x.lineCap = 'round'; let sd = 7; const rnd = () => { sd = (sd * 9301 + 49297) % 233280; return sd / 233280; };
      for (let i = 0; i < 28; i++) { x.save(); x.rotate(i / 28 * Math.PI * 2); x.beginPath(); const r = c * 0.69; for (let k = 0; k < 3; k++) { const a = (rnd() - 0.5) * c * 0.05, b = (rnd() - 0.5) * c * 0.07; k ? x.lineTo(a, r + b) : x.moveTo(a, r + b); } x.stroke(); x.restore(); }
      for (let i = 0; i < 8; i++) { x.save(); x.rotate(i / 8 * Math.PI * 2 + 0.2); x.beginPath(); x.moveTo(-c * 0.05, c * 0.78); x.quadraticCurveTo(c * 0.02, c * 0.98, c * 0.14, c * 0.95); x.quadraticCurveTo(c * 0.05, c * 0.9, c * 0.06, c * 0.78); x.closePath(); x.fillStyle = '#ffd86a'; x.fill(); x.lineWidth = 2; x.strokeStyle = '#5a2a04'; x.stroke();
        x.beginPath(); x.moveTo(-c * 0.04, c * 0.6); x.quadraticCurveTo(0, c * 0.42, c * 0.1, c * 0.4); x.quadraticCurveTo(c * 0.03, c * 0.48, c * 0.05, c * 0.6); x.closePath(); x.fill(); x.stroke(); x.restore(); }
      x.beginPath(); x.arc(0, 0, c * 0.22, 0, 7); x.lineWidth = 5; x.strokeStyle = '#ffd86a'; x.stroke(); x.lineWidth = 1.5; x.strokeStyle = '#5a2a04'; x.stroke(); });
    const texF = cv(256, (x, n) => { const c = n / 2; x.translate(c, c); for (let i = 0; i < 9; i++) { x.save(); x.rotate(i / 9 * Math.PI * 2); const g = x.createLinearGradient(0, 0, c, 0); g.addColorStop(0, 'rgba(255,40,20,0)'); g.addColorStop(0.5, 'rgba(230,20,10,.95)'); g.addColorStop(0.8, 'rgba(255,160,40,.95)'); g.addColorStop(1, 'rgba(255,240,180,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(c * 0.35, 0); x.bezierCurveTo(c * 0.6, -c * 0.25, c * 0.85, -c * 0.05, c * 0.98, -c * 0.22); x.bezierCurveTo(c * 0.8, c * 0.02, c * 0.6, c * 0.06, c * 0.35, 0); x.fill(); x.restore(); } });
    const glow = cv(128, (x) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,220,120,.9)'); g.addColorStop(0.5, 'rgba(255,150,40,.35)'); g.addColorStop(1, 'rgba(255,100,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
    const pl = (t, sz) => new T.Mesh(new T.PlaneGeometry(sz, sz), new T.MeshBasicMaterial({ map: t, transparent: true, side: T.DoubleSide, depthWrite: false, toneMapped: false }));
    const H = new T.Group(); heroi.userData.P.spine.add(H); H.position.set(0, 0.62, -0.62); H.visible = false;
    const G = new T.Sprite(new T.SpriteMaterial({ map: glow, transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false, opacity: 0.4 })); G.scale.set(2.8, 2.8, 1); G.position.z = -0.06; H.add(G);
    const A = pl(texA, 2.3); A.position.z = -0.03; H.add(A); const B = pl(texB, 1.55); H.add(B); const F = pl(texF, 1.9); F.position.z = 0.02; H.add(F);
    const brilhoDe = (m, s, cor) => { const b = new T.Mesh(m.geometry, new T.MeshBasicMaterial({ map: m.material.map, color: cor, transparent: true, depthWrite: false, toneMapped: false, blending: T.AdditiveBlending, opacity: 0.55, side: T.DoubleSide })); b.scale.setScalar(s); b.position.z = 0.005; m.add(b); return b; };
    const brA = brilhoDe(A, 1.0, '#ffd070'), brB = brilhoDe(B, 1.0, '#ffe8a0'), brA2 = brilhoDe(A, 1.06, '#ff9a30'); brA2.material.opacity = 0.25;
    G.material.opacity = 0.6; G.scale.set(3.4, 3.4, 1);
    const anc = m => ({ p: m.position.clone(), q: m.quaternion.clone(), s: m.scale.clone() });
    return { H, A, B, F, G, brA, brB, brA2, ancA: anc(A), ancB: anc(B), elos: [], cd: 0 }; })();
  function haloOn() { const W = ARMAS[AR.arma]; return (!!(W && W.halo) || BUFF.mandala > 0) && !(BUFF.mandef > 0); }
  function haloVis() { if (BUFF.sete > 0) return false; const W = ARMAS[AR.arma]; return !!(W && W.halo) || AR.divino === 'mandala' || BUFF.mandala > 0 || BUFF.mandef > 0; }
  function haloAtk(forca) { if (!haloOn() || HALO.elos.length || (HALO.cd > 0 && !forca)) return; HALO.H.visible = true; const alvo = maisPerto(24); if (!alvo) return;
    HALO.cd = 3.2; som('magia', 0.8, 0.8); fx('luz', [heroi.position.x, 1.5, heroi.position.z], 0.6);
    [[HALO.A, 1, HALO.ancA], [HALO.B, -1, HALO.ancB]].forEach(([m, sd, anc]) => { world.attach(m); HALO.elos.push({ m, sd, anc, alvo, fase: 'ida', t: 0, hit: 0, ang: sd > 0 ? 0 : Math.PI, spin: 0, s0: m.scale.x }); }); }
  // ---- MODO DEFESA (Égide Solar): a Mandala vem pra frente, expande e bloqueia tudo ----
  const BOLHA = new T3.Mesh(new T3.SphereGeometry(1.55, 32, 20), new T3.MeshBasicMaterial({ color: '#ffcc55', transparent: true, opacity: 0.12, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false })); BOLHA.position.y = 1.0; BOLHA.visible = false; heroi.add(BOLHA);
  const DEF_ANEL = new T3.Mesh(new T3.TorusGeometry(1.25, 0.03, 8, 60), new T3.MeshBasicMaterial({ color: '#fff2b0', transparent: true, opacity: 0.9, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false })); DEF_ANEL.position.z = 0.03; DEF_ANEL.visible = false; HALO.H.add(DEF_ANEL);
  const DEF_FL = new T3.Sprite(new T3.SpriteMaterial({ map: HALO.G.material.map, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false })); DEF_FL.position.z = 0.12; DEF_FL.scale.set(0.01, 0.01, 1); HALO.H.add(DEF_FL);
  function haloBloqueia() { if (!HALO.def) return; DEF_FL.userData.t = 0.22; DEF_FL.position.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, 0.12); som('espada', 0.45, 0.6 + Math.random() * 0.2, 0.05); }
  function haloDefFrame(dt) { const quer = BUFF.mandef > 0 && !dentro;
    if (quer && !HALO.def) { HALO.elos.slice().forEach(o => { HALO.H.add(o.m); o.m.position.copy(o.anc.p); o.m.quaternion.copy(o.anc.q); o.m.scale.copy(o.anc.s); }); HALO.elos.length = 0;
      heroi.add(HALO.H); HALO.H.position.set(0, 1.25, 1.15); HALO.H.rotation.set(0, 0, 0); HALO.def = { t: 0 }; BOLHA.visible = DEF_ANEL.visible = true; }
    if (!quer && HALO.def) { heroi.userData.P.spine.add(HALO.H); HALO.H.position.set(0, 0.62, -0.62); HALO.H.rotation.set(0, 0, 0); HALO.H.scale.setScalar(1); HALO.def = null; BOLHA.visible = DEF_ANEL.visible = false; DEF_FL.scale.set(0.01, 0.01, 1); if (!(BUFF.mandef > 0)) aviso('🛡️ Égide Solar acabou.', '#c8b48a'); }
    if (!HALO.def) return; const D = HALO.def; D.t += dt; const ex = Math.min(1, D.t / 0.45), k = 0.15 + ex * 1.05 + (D.t < 0.6 ? Math.sin(ex * Math.PI) * 0.18 : 0); HALO.H.scale.setScalar(k);
    BOLHA.material.opacity = ex * (0.12 + Math.sin(gT * 6) * 0.04); BOLHA.scale.setScalar(0.3 + ex * 0.7); DEF_ANEL.material.opacity = 0.6 + Math.sin(gT * 9) * 0.3; HALO.G.material.opacity = 0.45 + Math.sin(gT * 7) * 0.15;
    if (DEF_FL.userData.t > 0) { DEF_FL.userData.t -= dt; const s = 2.3 * Math.max(0, DEF_FL.userData.t / 0.22); DEF_FL.scale.set(s, s, 1); } else DEF_FL.scale.set(0.01, 0.01, 1); }
  // ---- COROA DOS SETE SÓIS: 7 mini-halos deitados girando como serra em volta do personagem ----
  const SETE = { g: new T3.Group(), h: [], t: 0, hitT: 0 }; SETE.g.visible = false; world.add(SETE.g);
  { const pl = (m, s) => new T3.Mesh(new T3.PlaneGeometry(s, s), new T3.MeshBasicMaterial({ map: m, transparent: true, side: T3.DoubleSide, depthWrite: false, toneMapped: false }));
    for (let i = 0; i < 7; i++) { const h = new T3.Group(); const gl = new T3.Sprite(new T3.SpriteMaterial({ map: HALO.G.material.map, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0.45 })); gl.scale.set(1.15, 1.15, 1); h.add(gl);
      const d = new T3.Group(); d.rotation.x = -Math.PI / 2; h.add(d); const A = pl(HALO.A.material.map, 0.62), B = pl(HALO.B.material.map, 0.42), F = pl(HALO.F.material.map, 0.5); A.position.z = -0.01; F.position.z = 0.01; d.add(A, B, F); const bl = (m, cor) => { const b = new T3.Mesh(m.geometry, new T3.MeshBasicMaterial({ map: m.material.map, color: cor, transparent: true, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending, opacity: 0.6, side: T3.DoubleSide })); b.position.z = 0.004; m.add(b); return b; }; const bA = bl(A, '#ffd070'), bB = bl(B, '#ffe8a0'); SETE.g.add(h); SETE.h.push({ h, A, B, F, gl, bA, bB }); } }
  function seteFrame(dt) { const on = BUFF.sete > 0 && !dentro; if (on && !SETE.g.visible) { SETE.t = 0; fx('luz', [heroi.position.x, 1, heroi.position.z], 1); som('magia', 0.8, 1.2); }
    if (!on && SETE.g.visible) { fx('luz', [heroi.position.x, 1.4, heroi.position.z], 0.7); }
    SETE.g.visible = on; if (!on) return; SETE.t += dt; const t = SETE.t, hp = heroi.position, ry = heroi.rotation.y, fx_ = Math.sin(ry), fz = Math.cos(ry);
    const T1 = 1.0, T2 = 1.6, T3_ = 2.9, ease = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, R = 1.45, BIG = 3.7;
    const ex = t < T2 ? 0 : Math.min(1, (t - T2) / (T3_ - T2)), ee = ease(ex);
    const frente = [hp.x + fx_ * 1.4, hp.y + 0.95, hp.z + fz * 1.4];
    SETE.h.forEach((o, i) => { const a = (t - T3_) * 2.6 + i / 7 * Math.PI * 2; const d = o.A.parent;
      if (t < T2) { // 1) o disco grande sai das costas, vai pra frente e deita
        const k = ease(Math.min(1, t / T1)); o.h.visible = i === 0; o.h.position.set(hp.x - fx_ * 0.55 + (frente[0] - (hp.x - fx_ * 0.55)) * k, hp.y + 1.7 + (frente[1] - hp.y - 1.7) * k, hp.z - fz * 0.55 + (frente[2] - (hp.z - fz * 0.55)) * k);
        o.h.rotation.set(0, ry, 0); d.rotation.x = -Math.PI / 2 * k; o.h.scale.setScalar(BIG); }
      else { // 2) diminui e se divide em 7, abrindo em volta do personagem
        o.h.visible = true; const ox = hp.x + Math.cos(a) * R, oy = hp.y + 0.95 + Math.sin(t * 3 + i) * 0.04 * ee, oz = hp.z + Math.sin(a) * R;
        o.h.position.set(frente[0] + (ox - frente[0]) * ee, frente[1] + (oy - frente[1]) * ee, frente[2] + (oz - frente[2]) * ee); o.h.rotation.set(0, 0, 0); d.rotation.x = -Math.PI / 2; o.h.scale.setScalar(BIG + (1 - BIG) * ee); }
      const sp = t < T2 ? 1.6 : 1; o.A.rotation.z += dt * 9 * sp; o.B.rotation.z -= dt * 12 * sp; o.F.rotation.z += dt * 10 * sp; const jm = t < T2 ? 1 : 0.15 + 0.85 * ee; const pu = (0.5 + Math.sin(gT * 5 + i) * 0.3) * jm; o.bA.material.opacity = pu; o.bB.material.opacity = (0.4 + Math.sin(gT * 6 + i * 2) * 0.3) * jm; o.gl.material.opacity = ((t < T2 ? 0.7 : 0.45) + Math.sin(gT * 4 + i) * 0.2) * jm; });
    if (t > T2 && t - dt <= T2) { som('magia', 0.7, 1.6); fx('luz', frente, 0.8); }
    SETE.hitT -= dt; if (SETE.hitT <= 0 && t >= T3_) { SETE.hitT = 0.25; const W0 = ARMAS[AR.arma] || ARMAS.punho, dn = Math.max(W0.dano || 10, 30) * 0.22 * atkMult(); let bateu = false;
      SETE.h.forEach(o => area(o.h.position.x, o.h.position.z, 0.75, f => { dano(f, dn, null, critico()); bateu = true; })); if (bateu) { som('espada', 0.3, 1.5 + Math.random() * 0.3, 0.05); fx('luz', [hp.x + (Math.random() - 0.5) * 2, 0.9, hp.z + (Math.random() - 0.5) * 2], 0.3); } } }
  function haloFrame(dt) { seteFrame(dt); const quer = haloVis() && !dentro; haloDefFrame(dt); HALO.H.visible = quer || HALO.elos.length > 0; if (HALO.cd > 0) HALO.cd -= dt;
    if (!HALO.H.visible) return; HALO.F.rotation.z += dt * 2.1; HALO.G.material.opacity = 0.5 + Math.sin(gT * 3) * 0.15; { const pu = 0.5 + Math.sin(gT * 3.4) * 0.25; HALO.brA.material.opacity = pu; HALO.brB.material.opacity = 0.45 + Math.sin(gT * 4.1 + 1) * 0.25; HALO.brA2.material.opacity = 0.15 + Math.sin(gT * 2.2) * 0.12; }
    if (HALO.def) { HALO.A.rotation.z += dt * 6; HALO.B.rotation.z -= dt * 9; HALO.F.rotation.z += dt * 4; return; }
    if (!HALO.elos.length) { HALO.A.rotation.z += dt * 0.55; HALO.B.rotation.z -= dt * 1.5; return; }
    const W0 = ARMAS[AR.arma] || ARMAS.punho, W = { dano: Math.max(W0.dano || 10, 30) }, tmpV = new T3.Vector3();
    for (let i = HALO.elos.length - 1; i >= 0; i--) { const o = HALO.elos[i], m = o.m; o.t += dt; o.spin += dt * (o.sd > 0 ? 14 : -18);
      if (o.fase === 'ida' || o.fase === 'gira') { const e0 = o.alvo; if (!e0 || !feraAtiva(e0)) { const n = maisPerto(16); if (n && o.hit < 11) { o.alvo = n; } else { o.fase = 'volta'; } } }
      const e = o.alvo;
      if (o.fase === 'ida') { const tx = e.g.position.x, tz = e.g.position.z, ty = e.T.alt * 0.55; tmpV.set(tx, ty, tz).sub(m.position); const d = tmpV.length(); m.position.addScaledVector(tmpV.normalize(), Math.min(d, dt * 22)); if (d < (e.T.raio + 1.3)) { o.fase = 'gira'; o.t = 0; } }
      else if (o.fase === 'gira') { o.ang += dt * 7 * o.sd; const r = e.T.raio + 1.1; m.position.set(e.g.position.x + Math.sin(o.ang) * r, e.T.alt * 0.55 + Math.sin(o.ang * 2) * 0.3, e.g.position.z + Math.cos(o.ang) * r);
        o.hitT = (o.hitT || 0) - dt; if (o.hitT <= 0) { o.hitT = 0.22; o.hit++; area(m.position.x, m.position.z, 1.6, f => dano(f, W.dano * 0.35 * atkMult(), null, critico())); fx('luz', [m.position.x, m.position.y - 0.4, m.position.z], 0.35); som('espada', 0.35, 1.4 + Math.random() * 0.3, 0.05); }
        if (o.t > 2.4 || o.hit >= 11) { o.fase = 'volta'; } }
      else { HALO.H.updateMatrixWorld(true); const alvoW = new T3.Vector3(); HALO.H.localToWorld(alvoW.copy(o.anc.p)); tmpV.copy(alvoW).sub(m.position); const d = tmpV.length(); m.position.addScaledVector(tmpV.normalize(), Math.min(d, dt * 20));
        if (d < 0.25) { HALO.H.add(m); m.position.copy(o.anc.p); m.quaternion.copy(o.anc.q); m.scale.copy(o.anc.s); HALO.elos.splice(i, 1); fx('luz', [heroi.position.x, 1.6, heroi.position.z], 0.4); continue; } }
      m.lookAt(cam.position); m.rotateZ(o.spin); const k = o.fase === 'volta' ? 1 : 1.15; m.scale.setScalar(o.s0 * k); } }
  function espFrame(dt) { brFrame(); if (typeof div3dFrame === 'function') div3dFrame(); haloFrame(dt || 1 / 60); if (!podeArma(AR.arma)) equipaArma(null); const A = ARMAS[AR.arma]; buffBtn.hidden = !(A && A.staff) || !!conversa; if (buffBtn.hidden) buffP.hidden = true; }
  // ---- lâminas GL do Gladiador (manopla + meia-lua em cada braço) ----
  function fazGarras(T){
 const mt=(c,m,r,e,ei)=>new T.MeshStandardMaterial({envMap:ENV,envMapIntensity:1.1,color:c,metalness:m==null?.6:m,roughness:r==null?.32:r,emissive:e||'#000',emissiveIntensity:e?(ei||.6):0,side:T.DoubleSide});
 const neon=c=>new T.MeshBasicMaterial({color:c,toneMapped:false,side:T.DoubleSide});
 const spr=(c,s)=>{const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);const m=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}));m.scale.set(s,s,1);return m};
 const ext=(sh,d,b)=>{const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelThickness:b||.01,bevelSize:b||.01,bevelSegments:2,curveSegments:24});g.translate(0,0,-d/2);return g};
 const add=(p,g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x||0,y||0,z||0);p.add(o);return o};
 const SPH=new T.SphereGeometry(1,20,14),CYL=new T.CylinderGeometry(1,1,1,16),CON=new T.ConeGeometry(1,1,10),TOR=new T.TorusGeometry(1,.14,10,40);
 // lâmina crescente grande: arco de A0 a A1, com 2 ganchos no lado de dentro e ponta afiada
 const crescente=(R,W,A0,A1,serra)=>{const s=new T.Shape(),N=70,a0=A0*Math.PI/180,a1=A1*Math.PI/180;const fora=[],dentro=[];
   for(let i=0;i<=N;i++){const t=i/N,a=a0+(a1-a0)*t;let r=R;if(serra&&i%7===3&&t>.15&&t<.85)r+=serra;fora.push([Math.cos(a)*r,Math.sin(a)*r]);
     let w=W*Math.pow(Math.sin(Math.PI*t),.7);const gan=[.3,.7].some(g=>Math.abs(t-g)<.05);if(gan)w*=1.6;else if([.3,.7].some(g=>Math.abs(t-g)<.08))w*=.75;const ri=R-w;dentro.push([Math.cos(a)*ri,Math.sin(a)*ri]);}
   s.moveTo(...fora[0]);fora.forEach(p=>s.lineTo(...p));dentro.reverse().forEach(p=>s.lineTo(...p));s.closePath();return s};
 const filete=(g,R,A0,A1,mat,z)=>{const pts=[];for(let i=0;i<=40;i++){const a=(A0+(A1-A0)*i/40)*Math.PI/180;pts.push(new T.Vector3(Math.cos(a)*R-.66,Math.sin(a)*R,z));}const c=new T.CatmullRomCurve3(pts);add(g,new T.TubeGeometry(c,60,.008,6,false),mat);};
 const espiral=(g,cx,cy,r,mat,z,v)=>{const pts=[];for(let i=0;i<=30;i++){const t=i/30,a=t*Math.PI*2.2*v;pts.push(new T.Vector3(cx+Math.cos(a)*r*(1-t*.8),cy+Math.sin(a)*r*(1-t*.8),z));}add(g,new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.006,6,false),mat);};
 const fazer=(cor)=>{const g=new T.Group();const C1=mt(cor.base,.75,.32),C2=mt(cor.ouro,.95,.22),BL=cor.vidro?new T.MeshPhysicalMaterial({color:cor.lam,emissive:cor.brilho,emissiveIntensity:.9,transparent:true,opacity:.88,roughness:.1,side:T.DoubleSide}):mt(cor.lam,.7,.3,cor.lamE,.4);
  // manopla no antebraço
  const m=add(g,CYL,C1,0,-.16,0);m.scale.set(.09,.3,.09);for(let i=0;i<3;i++){const r=add(g,TOR,C2,0,-.05-i*.1,0);r.rotation.x=Math.PI/2;r.scale.set(.092,.092,.12);}
  // placas com espinhos em cima do braço
  for(let i=0;i<3;i++){const e=add(g,CON,C2,.06,-.04-i*.09,0);e.scale.set(.025,.11,.025);e.rotation.z=-1.1;}
  // emblema-engrenagem com gema
  const em=new T.Group();em.position.set(.12,-.24,0);em.rotation.y=Math.PI/2;g.add(em);const st=new T.Shape();for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,r=i%2?.06:.085;i?st.lineTo(Math.cos(a)*r,Math.sin(a)*r):st.moveTo(Math.cos(a)*r,Math.sin(a)*r);}
  add(em,ext(st,.02),C2);add(em,new T.CylinderGeometry(.05,.05,.03,20),C1,0,0,.015).rotation.x=Math.PI/2;const gm=add(em,SPH,neon(cor.gema),0,0,.03);gm.scale.set(.03,.03,.02);const gl=spr(cor.gemaG,.4);gl.position.set(0,0,.05);em.add(gl);
  if(cor.cranio){const k=add(g,SPH,mt('#d8ccb0',.3,.5),.11,-.11,0);k.scale.set(.05,.055,.055);[-1,1].forEach(s=>{const o=add(g,SPH,neon(cor.gema),.155,-.1,s*.02);o.scale.set(.012,.012,.012);const h=add(g,CON,C2,.12,-.06,s*.045);h.scale.set(.012,.06,.012);h.rotation.x=s*.7;});}
  // lâmina crescente presa do lado de fora do braço, plano (y,z) = virada pra frente
  const L=new T.Group();L.position.set(.13,-.2,0);L.rotation.y=-Math.PI/2;g.add(L);const sh=crescente(.72,.16,-80,100,cor.serra||0);
  const lam=add(L,ext(sh,.03),BL,-.66,0,0);const borda=add(L,ext(crescente(.735,.03,-80,100,0),.035,.004),neon(cor.fio),-.66,0,0);
  [.66,.6].forEach((r,i)=>filete(L,r,-62,82,C2,.03+i*.001));[-1,1].forEach(z=>{filete(L,.62,-50,70,C2,z*.022);});
  for(let k=0;k<4;k++){const a=(-40+k*36)*Math.PI/180;espiral(L,-.66+Math.cos(a)*.62,Math.sin(a)*.62,.04,C2,.024,k%2?1:-1);}
  // lâmina menor do outro lado (pra baixo/atrás)
  const L2=new T.Group();L2.position.set(.1,-.3,0);L2.rotation.set(0,-Math.PI/2,Math.PI*0.95);g.add(L2);add(L2,ext(crescente(.32,.07,-70,80,0),.025),BL,-.29,0,0);add(L2,ext(crescente(.335,.018,-70,80,0),.03,.004),neon(cor.fio),-.29,0,0);
  const aura=spr(cor.auraC,1.6);aura.position.set(.2,0,0);g.add(aura);return g};
 const P=[
  {base:'#232022',ouro:'#c8a050',lam:'#141315',fio:'#e8c878',gema:'#ff7a1a',gemaG:'rgba(255,140,40,.9)',auraC:'rgba(255,170,90,.18)',cranio:true},
  {base:'#14102a',ouro:'#5a6ad8',lam:'#1a4aff',brilho:'#1a6aff',vidro:true,fio:'#9af0ff',gema:'#c45aff',gemaG:'rgba(200,100,255,.9)',auraC:'rgba(80,160,255,.45)',cranio:true},
  {base:'#1a0e26',ouro:'#b46aff',lam:'#2a1240',lamE:'#5a1a8a',fio:'#e08aff',gema:'#ff5ad8',gemaG:'rgba(255,90,220,.9)',auraC:'rgba(180,90,255,.35)',cranio:true,serra:.03},
  {base:'#2a0c0c',ouro:'#e8a040',lam:'#7a0e0e',lamE:'#5a0000',fio:'#ff8a3a',gema:'#ffd23c',gemaG:'rgba(255,200,60,.9)',auraC:'rgba(255,90,40,.35)',cranio:false,serra:.04},
  {base:'#b8bccc',ouro:'#ffd86a',lam:'#e8ecf6',lamE:'#2a3a5a',fio:'#5ae8ff',gema:'#5ae8ff',gemaG:'rgba(90,230,255,.9)',auraC:'rgba(140,220,255,.3)',cranio:false}];
 const G={};P.forEach((c,i)=>G[i+1]=()=>fazer(c));return G;}
  const GAR_MOD = fazGarras(T3); const GL_K = ['gl_eclipse', 'gl_abismo', 'gl_ceifador', 'gl_sangrenta', 'gl_prata'];
  GL_K.forEach((k, i) => { [[maoG, ARMAG, 1], [maoE, ARMAE, -1]].forEach(([mao, LST, sx]) => { const G = grp(mao); const m = GAR_MOD[i + 1](); m.position.set(0, 0.33, -0.05); m.scale.setScalar(0.8); m.scale.x *= sx; G.add(m); G.visible = false; G.traverse(o => { if (o.isMesh) o.castShadow = true; }); LST[k] = G; }); });
  function podeArma(k) { const A = ARMAS[k]; if (!A) return true; if (A.placa && staffPronto && !(souAdmin() || (A.staff === 'adm' ? souADMc : souGM))) return false; return !A.soClasse || AR.classe === A.soClasse; }
