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
  function haloVis() { if (BUFF.sete > 0 || seloVoando()) return false; const W = ARMAS[AR.arma]; return !!(W && W.halo) || AR.divino === 'mandala' || AR.divino === 'rubra' || BUFF.mandala > 0 || BUFF.mandef > 0; }
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
  // ---- SELO DO JUÍZO: elo grande embaixo do pé do inimigo, elo pequeno em cima da cabeça, -25% de defesa ----
  const SELOS = [];
  function seloCria(f) { const pl = (m, s, cor, add) => { const o = new T3.Mesh(new T3.PlaneGeometry(s, s), new T3.MeshBasicMaterial({ map: m, color: cor || '#ffffff', transparent: true, side: T3.DoubleSide, depthWrite: false, toneMapped: false, blending: add ? T3.AdditiveBlending : T3.NormalBlending })); o.rotation.x = -Math.PI / 2; return o; };
    const r = Math.max(0.9, f.T.raio || 0.8), alt = f.T.alt || 1.4, g = new T3.Group(); world.add(g);
    const chao = new T3.Group(); g.add(chao); const big = r * 3.2; const gl = pl(HALO.G.material.map, big * 1.5, '#ffb040', true); gl.position.y = 0.02; chao.add(gl); const A = pl(HALO.A.material.map, big); A.position.y = 0.04; chao.add(A); const Ab = pl(HALO.A.material.map, big, '#ffd070', true); Ab.position.y = 0.045; chao.add(Ab);
    const cima = new T3.Group(); g.add(cima); cima.position.y = alt + 0.55; const sm = Math.max(0.9, r * 1.4); const B = pl(HALO.B.material.map, sm); cima.add(B); const Bb = pl(HALO.B.material.map, sm, '#ffe8a0', true); Bb.position.y = 0.005; cima.add(Bb); const gs = new T3.Sprite(new T3.SpriteMaterial({ map: HALO.G.material.map, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0.5 })); gs.scale.set(sm * 1.6, sm * 1.6, 1); cima.add(gs);
    const raio = new T3.Mesh(new T3.CylinderGeometry(r * 0.35, r * 0.6, alt + 0.55, 16, 1, true), new T3.MeshBasicMaterial({ color: '#ffc050', transparent: true, opacity: 0.12, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false, side: T3.DoubleSide })); raio.position.y = (alt + 0.55) / 2; g.add(raio);
    return { f, g, A, Ab, B, Bb, gl, gs, raio, t: 0, big, sm }; }
  function seloAplica() { const alvo = maisPerto(22); if (!alvo) { aviso('Nenhum inimigo perto pra selar.', '#c8b48a'); return false; }
    const lista = [alvo]; FERAS.concat(typeof CAL !== 'undefined' && CAL.feras ? CAL.feras : []).forEach(f => { if (lista.length < 5 && f !== alvo && feraAtiva(f) && Math.hypot(f.g.position.x - alvo.g.position.x, f.g.position.z - alvo.g.position.z) < 5) lista.push(f); });
    // a Mandala sai das costas girando e voa até o inimigo principal; quando chega, se abre no selo
    const hp = heroi.position, ry = heroi.rotation.y; const ini = [hp.x - Math.sin(ry) * 0.55, hp.y + 1.7, hp.z - Math.cos(ry) * 0.55];
    lista.forEach((f, i) => { f.selo = 15 + (i === 0 ? 1.2 : 0); let s = SELOS.find(x => x.f === f); if (!s) { s = seloCria(f); SELOS.push(s); } s.t = 0; s.voo = i === 0 ? { t: 0, ini } : null; s.aplicado = i !== 0; f.seloOk = i !== 0; s.principal = i === 0;
      if (i !== 0) numero(f.g.position, '🔻 -25% DEF', '#ffb040', (f.T.alt || 1.4) + 1.2); });
    som('magia', 0.8, 1.1); fx('luz', ini, 0.7); return true; }
  function seloVoando() { return SELOS.some(s => s.principal && s.f.selo > 0); }
  function ry0(V, q) { return Math.atan2(cam.position.x - (V.ini[0]), cam.position.z - (V.ini[2])) * (1 - q); }
  function seloFrame(dt) { for (let i = SELOS.length - 1; i >= 0; i--) { const s = SELOS[i], f = s.f; s.t += dt; if (f.selo > 0) f.selo -= dt;
      if (!feraAtiva(f) || !(f.selo > 0)) { world.remove(s.g); SELOS.splice(i, 1); if (s.principal) { fx('luz', [heroi.position.x, 1.6, heroi.position.z], 0.6); } continue; }
      s.g.position.set(f.g.position.x, 0, f.g.position.z); const ch = s.g.children[0], cm = s.g.children[1], alt = (f.T.alt || 1.4);
      if (s.voo) { const V = s.voo; V.t += dt; const TV = 0.85, TS = 0.45; const ease = q => q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
        const topo = [0, alt + 1.3, 0], ini = [V.ini[0] - f.g.position.x, V.ini[1], V.ini[2] - f.g.position.z];
        s.A.rotation.z += dt * 10; s.Ab.rotation.z = s.A.rotation.z; s.B.rotation.z -= dt * 14; s.Bb.rotation.z = s.B.rotation.z; s.raio.material.opacity = 0;
        if (V.t < TV) { const q = ease(V.t / TV), arco = Math.sin(q * Math.PI) * 1.4; const px = ini[0] + (topo[0] - ini[0]) * q, py = ini[1] + (topo[1] - ini[1]) * q + arco, pz = ini[2] + (topo[2] - ini[2]) * q;
          [ch, cm].forEach(g => { g.position.set(px, py, pz); g.rotation.x = Math.PI / 2 * (1 - q); g.rotation.y = ry0(V, q); }); const sc = s.sm / s.big; ch.scale.setScalar(0.75); cm.scale.setScalar(0.75 / sc * 0.42);
          s.A.material.opacity = s.B.material.opacity = 1; s.Ab.material.opacity = s.Bb.material.opacity = 0.6; s.gl.material.opacity = 0.4; s.gs.material.opacity = 0; continue; }
        const q = ease(Math.min(1, (V.t - TV) / TS)); [ch, cm].forEach(g => { g.rotation.set(0, 0, 0); g.position.x = g.position.z = 0; });
        ch.position.y = topo[1] * (1 - q); cm.position.y = topo[1] + (alt + 0.55 - topo[1]) * q; ch.scale.setScalar(0.75 + q * 0.25); cm.scale.setScalar((0.75 / (s.sm / s.big) * 0.42) * (1 - q) + q);
        if (V.t >= TV + TS) { s.voo = null; s.aplicado = true; f.seloOk = true; s.t = 1; numero(f.g.position, '🔻 -25% DEF', '#ffb040', alt + 1.2); fx('luz', [f.g.position.x, 0.5, f.g.position.z], 1.2); som('portal', 0.8, 0.7); flash('rgba(255,180,60,.3)'); tremor = Math.max(tremor, 0.2); }
        continue; }
      const ex = Math.min(1, s.t / 0.4), fim = Math.min(1, f.selo / 0.5), k = (s.principal ? 1 : ex) * fim; ch.scale.setScalar(0.2 + k * 0.8); cm.scale.setScalar(0.2 + k * 0.8);
      s.A.rotation.z += dt * 1.6; s.Ab.rotation.z = s.A.rotation.z; s.B.rotation.z -= dt * 3.2; s.Bb.rotation.z = s.B.rotation.z; cm.position.y = alt + 0.55 + Math.sin(gT * 2.5) * 0.08;
      const pu = 0.45 + Math.sin(gT * 4) * 0.25; s.Ab.material.opacity = pu * k; s.Bb.material.opacity = pu * k; s.gl.material.opacity = (0.35 + Math.sin(gT * 3) * 0.15) * k; s.gs.material.opacity = 0.45 * k; s.raio.material.opacity = (0.1 + Math.sin(gT * 6) * 0.05) * k; s.A.material.opacity = k; s.B.material.opacity = k; } }
  // ---- ARAUTO DAS CHAMAS: a armadura lendária se forma no corpo por 30 s ----
  const ARAUTO = { M: null, on: false, t: 0, brasas: [], esc: [], ult: null };
  function arautoDentro(o, raiz) { for (let n = o; n; n = n.parent) if (n === raiz) return true; return false; }
  function arautoFrame(dt) { const quer = BUFF.arauto > 0 && !dentro; if (!quer && !ARAUTO.on) return;
    if (quer && !ARAUTO.M) { try { ARAUTO.M = createArautoDasChamas(T3); } catch (err) { console.warn('arauto', err); BUFF.arauto = 0; return; }
      ARAUTO.M.scale.setScalar(0.95); ARAUTO.M.visible = false; heroi.add(ARAUTO.M); ARAUTO.M.traverse(o => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
      for (let i = 0; i < 16; i++) { const s = new T3.Sprite(new T3.SpriteMaterial({ map: HALO.G.material.map, color: i % 3 ? '#ff6a1a' : '#ffd060', transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false })); s.visible = false; world.add(s); ARAUTO.brasas.push({ s, f: Math.random() * 6, r: 0.3 + Math.random() * 0.5, a: Math.random() * 6.3 }); } }
    if (quer !== ARAUTO.on) { ARAUTO.on = quer; ARAUTO.t = 0; const hp = heroi.position;
      if (quer) { // o corpo normal some e o Arauto aparece no lugar (a arma, o halo e os itens divinos continuam)
        ARAUTO.esc = []; heroi.traverse(o => { if (o.isMesh && o.visible && !arautoDentro(o, ARAUTO.M) && !arautoDentro(o, maoG) && !arautoDentro(o, HALO.H)) { o.visible = false; ARAUTO.esc.push(o); } });
        ARAUTO.M.visible = true; flash('rgba(255,110,30,.45)'); som('portal', 0.9, 0.7); tremor = Math.max(tremor, 0.25); }
      else { ARAUTO.esc.forEach(o => o.visible = true); ARAUTO.esc = []; ARAUTO.M.visible = false; aviso('🔥 A Armadura do Arauto se desfez em brasas.', '#ff9a50'); }
      ARAUTO.brasas.forEach(b => b.s.visible = quer); fx('luz', [hp.x, 1, hp.z], quer ? 1.4 : 0.7); }
    if (!ARAUTO.on) return; ARAUTO.t += dt; const hp = heroi.position;
    const k = Math.min(1, ARAUTO.t / 0.5); ARAUTO.M.scale.setScalar(0.95 * (0.6 + 0.4 * k));
    let anda = 0; if (ARAUTO.ult) anda = Math.hypot(hp.x - ARAUTO.ult[0], hp.z - ARAUTO.ult[1]) / Math.max(dt, 0.001); ARAUTO.ult = [hp.x, hp.z];
    const est = atkT < 0.35 ? 'attack' : anda > 0.8 ? 'walk' : 'idle'; try { ARAUTO.M.userData.update(dt, est); } catch (err) {}
    ARAUTO.brasas.forEach(b => { b.f += dt * (0.8 + b.r); const y = (b.f % 2.4); b.s.position.set(hp.x + Math.cos(b.a + gT * 0.6) * b.r, hp.y + 0.2 + y, hp.z + Math.sin(b.a + gT * 0.6) * b.r); const sc = 0.12 * (1 - y / 2.4); b.s.scale.set(sc, sc, 1); b.s.material.opacity = 1 - y / 2.4; }); }
  // ===================== MANDALA RUBRA DA LENDA: mesmo poder da Mandala, visual carmesim e ouro =====================
  const RUBRA = (() => {
const cv = (n, f, h) => { const c = document.createElement('canvas'); c.width = n; c.height = h || n; f(c.getContext('2d'), n, h || n); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; };
const ouroG = (x, a, b, c, d) => { const g = x.createLinearGradient(a, b, c, d); g.addColorStop(0, '#fff2b0'); g.addColorStop(0.35, '#ffc23a'); g.addColorStop(0.7, '#c87814'); g.addColorStop(1, '#6a3404'); return g; };
const brilho = (x, cor, blur) => { x.shadowColor = cor; x.shadowBlur = blur; };
function chama(x, L, w, curva) { x.beginPath(); x.moveTo(-w, 0); x.bezierCurveTo(-w * 1.6, L * 0.35, curva - w * 0.4, L * 0.7, curva, L); x.bezierCurveTo(curva + w * 0.5, L * 0.72, w * 1.5, L * 0.35, w, 0); x.closePath(); }
// HALO EXTERNO: coroa de chamas carmesim com contorno de ouro e pétalas de cristal no topo
const texCoroa = cv(1024, (x, n) => { const c = n / 2; x.translate(c, c); x.lineJoin = 'round';
  // pétalas de cristal (atrás)
  for (let i = 0; i < 14; i++) { x.save(); x.rotate(i / 14 * Math.PI * 2); const L = c * 0.78; x.beginPath(); x.moveTo(-c * 0.09, c * 0.42); x.lineTo(0, L); x.lineTo(c * 0.09, c * 0.42); x.closePath();
    const g = x.createLinearGradient(0, c * 0.42, 0, L); g.addColorStop(0, 'rgba(255,140,190,.7)'); g.addColorStop(1, 'rgba(255,235,245,.85)'); x.fillStyle = g; x.fill(); x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 2; x.stroke(); x.beginPath(); x.moveTo(0, c * 0.44); x.lineTo(0, L * 0.97); x.stroke(); x.restore(); }
  // chamas carmesim com borda dourada
  const N = 22; for (let i = 0; i < N; i++) { x.save(); x.rotate(i / N * Math.PI * 2); x.translate(0, c * 0.6); const L = c * (i % 2 ? 0.3 : 0.39), w = c * 0.055;
    brilho(x, '#ff2a6a', 25); chama(x, L, w * 1.35, (i % 2 ? 1 : -1) * w * 1.6); x.fillStyle = ouroG(x, 0, 0, 0, L); x.fill(); x.shadowBlur = 0;
    chama(x, L * 0.86, w * 0.95, (i % 2 ? 1 : -1) * w * 1.3); const g = x.createLinearGradient(0, 0, 0, L); g.addColorStop(0, '#6a0a1e'); g.addColorStop(0.45, '#e01848'); g.addColorStop(1, '#ff8ab0'); x.fillStyle = g; x.fill();
    chama(x, L * 0.55, w * 0.4, (i % 2 ? 1 : -1) * w * 0.7); x.fillStyle = '#ffd0e0'; x.fill();
    // gancho dourado lateral
    x.beginPath(); x.moveTo(w, L * 0.25); x.quadraticCurveTo(w * 3.4, L * 0.28, w * 3, L * 0.55); x.quadraticCurveTo(w * 2.6, L * 0.38, w * 1.1, L * 0.38); x.closePath(); x.fillStyle = ouroG(x, 0, 0, w * 3, 0); x.fill(); x.strokeStyle = '#4a1a04'; x.lineWidth = 1.5; x.stroke(); x.restore(); }
  // aro dourado filigranado
  brilho(x, '#ff3a7a', 20); x.lineWidth = c * 0.05; x.strokeStyle = '#c87814'; x.beginPath(); x.arc(0, 0, c * 0.6, 0, Math.PI * 2); x.stroke(); x.shadowBlur = 0;
  x.lineWidth = c * 0.025; x.strokeStyle = '#ffd86a'; x.beginPath(); x.arc(0, 0, c * 0.6, 0, Math.PI * 2); x.stroke();
  for (let i = 0; i < 44; i++) { x.save(); x.rotate(i / 44 * Math.PI * 2); x.beginPath(); x.arc(0, c * 0.6, c * 0.012, 0, 7); x.fillStyle = i % 4 ? '#7a3a04' : '#ff3a7a'; x.fill(); x.restore(); }
  x.lineWidth = 3; x.strokeStyle = '#ffd86a'; x.beginPath(); x.arc(0, 0, c * 0.545, 0, 7); x.stroke(); });
// HALO INTERNO: anel de ouro ornamentado com pétalas, gemas rosa e brilho no centro (gira ao contrário)
const texInterno = cv(1024, (x, n) => { const c = n / 2; x.translate(c, c); x.lineJoin = 'round';
  const g0 = x.createRadialGradient(0, 0, 0, 0, 0, c * 0.5); g0.addColorStop(0, 'rgba(255,90,150,.0)'); g0.addColorStop(0.55, 'rgba(255,60,130,.15)'); g0.addColorStop(0.85, 'rgba(255,40,110,.55)'); g0.addColorStop(1, 'rgba(255,40,110,0)'); x.fillStyle = g0; x.beginPath(); x.arc(0, 0, c * 0.52, 0, 7); x.fill();
  for (let k = 0; k < 2; k++) { const N = 24, R0 = c * (k ? 0.62 : 0.5), R1 = c * (k ? 0.86 : 0.7); for (let i = 0; i < N; i++) { x.save(); x.rotate(i / N * Math.PI * 2 + k * Math.PI / N);
    x.beginPath(); x.moveTo(-c * 0.045, R0); x.bezierCurveTo(-c * 0.08, (R0 + R1) / 2, -c * 0.02, R1 * 0.95, 0, R1); x.bezierCurveTo(c * 0.02, R1 * 0.95, c * 0.08, (R0 + R1) / 2, c * 0.045, R0); x.closePath();
    brilho(x, '#ff3a7a', 12); x.fillStyle = ouroG(x, 0, R0, 0, R1); x.fill(); x.shadowBlur = 0; x.lineWidth = 2; x.strokeStyle = '#4a1a04'; x.stroke();
    x.beginPath(); x.moveTo(0, R0 + c * 0.02); x.lineTo(0, R1 - c * 0.04); x.strokeStyle = '#8a3a08'; x.lineWidth = 2; x.stroke();
    if (!k || i % 2 === 0) { x.beginPath(); x.ellipse(0, R0 + (R1 - R0) * 0.5, c * 0.016, c * 0.026, 0, 0, 7); x.fillStyle = '#ff2a6a'; brilho(x, '#ff2a6a', 10); x.fill(); x.shadowBlur = 0; } x.restore(); } }
  [0.5, 0.62].forEach(r => { x.lineWidth = c * 0.022; x.strokeStyle = '#ffc23a'; x.beginPath(); x.arc(0, 0, c * r, 0, 7); x.stroke(); x.lineWidth = 2; x.strokeStyle = '#6a3404'; x.stroke(); });
  for (let i = 0; i < 32; i++) { x.save(); x.rotate(i / 32 * Math.PI * 2); x.font = `bold ${c * 0.04}px serif`; x.fillStyle = '#ff7ab0'; x.textAlign = 'center'; brilho(x, '#ff2a6a', 8); x.fillText('✦', 0, -c * 0.56); x.restore(); } });
// ASAS DE CHAMA (cantinhos) ao lado dos ombros — lado direito; o esquerdo espelha
const texAsa = cv(512, (x, w, h) => { x.lineJoin = 'round'; x.translate(30, h * 0.55);
  const lingua = (ang, L, larg, curva, k) => { x.save(); x.rotate(ang); brilho(x, '#ff2a6a', 20); chama(x, L, larg * 1.4, curva); x.fillStyle = ouroG(x, 0, 0, 0, L); x.fill(); x.shadowBlur = 0;
    chama(x, L * 0.88, larg, curva * 0.9); const g = x.createLinearGradient(0, 0, 0, L); g.addColorStop(0, '#7a0a20'); g.addColorStop(0.5, '#e81848'); g.addColorStop(1, '#ffa0c0'); x.fillStyle = g; x.fill();
    chama(x, L * 0.5, larg * 0.4, curva * 0.5); x.fillStyle = '#ffe0ea'; x.fill();
    x.beginPath(); x.moveTo(larg, L * 0.3); x.quadraticCurveTo(larg * 3, L * 0.32, larg * 2.6, L * 0.55); x.quadraticCurveTo(larg * 2.2, L * 0.4, larg * 1.1, L * 0.42); x.closePath(); x.fillStyle = '#ffc23a'; x.fill(); x.strokeStyle = '#4a1a04'; x.lineWidth = 1.5; x.stroke(); x.restore(); };
  // leque de chamas pra fora e pra cima/baixo
  [[-2.3, 300, 26, 40], [-1.95, 360, 30, -50], [-1.6, 400, 32, 60], [-1.25, 360, 28, -40], [-0.9, 300, 26, 50], [-0.55, 240, 22, -30]].forEach(([a, L, lw, cu]) => lingua(a, L, lw, cu));
  // espiral dourada com gema na base
  brilho(x, '#ff2a6a', 14); x.strokeStyle = '#ffc23a'; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); for (let a = 0; a < 10; a += 0.15) { const r = 70 * (1 - a / 11); const X = 60 + Math.cos(a) * r, Y = -10 + Math.sin(a) * r; a ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.stroke(); x.shadowBlur = 0;
  x.beginPath(); x.arc(60, -10, 18, 0, 7); const gg = x.createRadialGradient(56, -14, 2, 60, -10, 18); gg.addColorStop(0, '#fff'); gg.addColorStop(0.4, '#ff6aa0'); gg.addColorStop(1, '#a00a3a'); x.fillStyle = gg; brilho(x, '#ff2a6a', 20); x.fill(); x.shadowBlur = 0; x.strokeStyle = '#ffd86a'; x.lineWidth = 4; x.stroke(); }, 640);
// ELO DA CINTURA: anel dourado de fogo
const texElo = cv(1024, (x, n) => { const c = n / 2; x.translate(c, c);
  brilho(x, '#ff3a7a', 30); x.lineWidth = c * 0.07; x.strokeStyle = '#ff5a8a'; x.beginPath(); x.arc(0, 0, c * 0.86, 0, 7); x.stroke();
  x.lineWidth = c * 0.04; x.strokeStyle = '#ffc23a'; x.beginPath(); x.arc(0, 0, c * 0.86, 0, 7); x.stroke(); x.lineWidth = c * 0.012; x.strokeStyle = '#fff2b0'; x.beginPath(); x.arc(0, 0, c * 0.86, 0, 7); x.stroke(); x.shadowBlur = 0;
  x.lineWidth = 4; x.strokeStyle = '#ffd86a'; x.beginPath(); x.arc(0, 0, c * 0.78, 0, 7); x.stroke(); x.beginPath(); x.arc(0, 0, c * 0.94, 0, 7); x.stroke();
  for (let i = 0; i < 40; i++) { x.save(); x.rotate(i / 40 * Math.PI * 2); x.beginPath(); x.moveTo(0, c * 0.78); x.quadraticCurveTo(c * 0.03, c * 0.86, 0, c * 0.95); x.strokeStyle = '#ff8ab0'; x.lineWidth = 3; brilho(x, '#ff2a6a', 10); x.stroke(); x.restore(); } x.shadowBlur = 0; });
// broche estrela da cintura
const texBroche = cv(256, (x, n) => { const c = n / 2; x.translate(c, c); brilho(x, '#ff2a6a', 20); x.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 - Math.PI / 2, r = i % 4 === 0 ? c * 0.95 : i % 2 ? c * 0.32 : c * 0.6; i ? x.lineTo(Math.cos(a) * r, Math.sin(a) * r) : x.moveTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fillStyle = ouroG(x, -c, -c, c, c); x.fill(); x.shadowBlur = 0; x.strokeStyle = '#4a1a04'; x.lineWidth = 3; x.stroke();
  x.beginPath(); x.arc(0, 0, c * 0.22, 0, 7); const g = x.createRadialGradient(-6, -6, 2, 0, 0, c * 0.22); g.addColorStop(0, '#fff'); g.addColorStop(0.4, '#ff6aa0'); g.addColorStop(1, '#a00a3a'); x.fillStyle = g; brilho(x, '#ff2a6a', 16); x.fill(); x.shadowBlur = 0; x.strokeStyle = '#ffd86a'; x.lineWidth = 4; x.stroke(); });
const glowR = cv(128, (x) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,170,205,.9)'); g.addColorStop(0.45, 'rgba(255,50,120,.4)'); g.addColorStop(1, 'rgba(255,20,90,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });

    return { texCoroa, texInterno, texAsa, texElo, texBroche, glowR }; })();
  const TEMA = { atual: 'mandala', orig: null };
  function haloTema() { const k = AR.divino === 'rubra' ? 'rubra' : 'mandala'; if (k === TEMA.atual) return; TEMA.atual = k;
    if (!TEMA.orig) TEMA.orig = { A: HALO.A.material.map, B: HALO.B.material.map, G: HALO.G.material.map };
    const A = k === 'rubra' ? RUBRA.texCoroa : TEMA.orig.A, B = k === 'rubra' ? RUBRA.texInterno : TEMA.orig.B, G = k === 'rubra' ? RUBRA.glowR : TEMA.orig.G, fogo = k !== 'rubra';
    const sA = k === 'rubra' ? 2.7 / 2.3 : 1, sB = k === 'rubra' ? 1.7 / 1.55 : 1;
    const troca = (m, t) => { if (m && m.material) { m.material.map = t; m.material.needsUpdate = true; } };
    troca(HALO.A, A); troca(HALO.brA, A); troca(HALO.brA2, A); troca(HALO.B, B); troca(HALO.brB, B); troca(HALO.G, G); HALO.F.visible = fogo; HALO.A.scale.setScalar(sA); HALO.B.scale.setScalar(sB);
    if (HALO.ancA) HALO.ancA.s.setScalar(sA); if (HALO.ancB) HALO.ancB.s.setScalar(sB);
    [HALO.brA, HALO.brA2, HALO.brB].forEach(b => b && b.material.color.set(k === 'rubra' ? '#ff9ac0' : (b === HALO.brB ? '#ffe8a0' : b === HALO.brA2 ? '#ff9a30' : '#ffd070')));
    SETE.h.forEach(o => { troca(o.A, A); troca(o.bA, A); troca(o.B, B); troca(o.bB, B); troca(o.gl, G); o.F.visible = fogo; }); }
  // asas de chama nos ombros + elo na cintura + broche (só da Rubra)
  const RUB = (() => { const P = heroi.userData.P, pl = (t, w, h, add) => new T3.Mesh(new T3.PlaneGeometry(w, h || w), new T3.MeshBasicMaterial({ map: t, transparent: true, side: T3.DoubleSide, depthWrite: false, toneMapped: false, blending: add ? T3.AdditiveBlending : T3.NormalBlending }));
    const W = grp(P.spine, 0, 0.42, 0.02), asas = []; [-1, 1].forEach(s => { const g = grp(W, s * 0.2, 0, 0); const m = pl(RUBRA.texAsa, 1.2, 1.5); m.position.set(s * 0.55, 0.12, 0); m.scale.x = s; g.add(m); const mb = pl(RUBRA.texAsa, 1.2, 1.5, true); mb.material.opacity = 0.35; mb.position.set(s * 0.55, 0.12, 0.004); mb.scale.x = s; g.add(mb); g.rotation.y = -s * 0.15; asas.push({ g, mb, s }); });
    const E = grp(P.hips, 0, 0.05, 0); E.rotation.x = 0.18; const el = pl(RUBRA.texElo, 1.4); el.rotation.x = -Math.PI / 2; E.add(el); const elb = pl(RUBRA.texElo, 1.4, 1.4, true); elb.rotation.x = -Math.PI / 2; elb.material.opacity = 0.4; elb.position.y = 0.002; E.add(elb);
    const br = pl(RUBRA.texBroche, 0.24); P.spine.add(br); br.position.set(0, 0.06, 0.175); const tudo = [W, E, br]; tudo.forEach(o => o.visible = false); return { W, E, br, asas, el, elb, tudo }; })();
  function rubraFrame(dt) { haloTema(); const on = AR.divino === 'rubra' && !dentro; RUB.tudo.forEach(o => o.visible = on); if (!on) return;
    RUB.el.rotation.z += dt * 1.6; RUB.elb.rotation.z = RUB.el.rotation.z; RUB.elb.material.opacity = 0.35 + Math.sin(gT * 4) * 0.15;
    RUB.asas.forEach(a => { a.g.rotation.z = a.s * Math.sin(gT * 1.8) * 0.06; a.mb.material.opacity = 0.3 + Math.sin(gT * 3.5 + a.s) * 0.2; }); }
  // ===================== GRIMÓRIO DOS CÍRCULOS ARCANOS: círculos roxos nas costas (fixos) e no chão + Adagas Astrais =====================
  const ARC = (() => {
    const T3x = T3;
    // ---- texturas dos círculos (linhas brancas com neon violeta) ----
    const TX = (new Function('T3', `const cv = (n, f) => { const c = document.createElement('canvas'); c.width = c.height = n; f(c.getContext('2d'), n); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t; };
const RUN = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
const neon = (x, cor, b) => { x.shadowColor = cor; x.shadowBlur = b; };
function circulo(x, c, tipo) { x.lineCap = 'round'; x.strokeStyle = '#ffffff'; neon(x, '#7a3aff', 26);
  const anel = (r, lw) => { x.lineWidth = lw; x.beginPath(); x.arc(0, 0, c * r, 0, Math.PI * 2); x.stroke(); };
  anel(0.96, 12); anel(0.9, 5); anel(0.62, 7); anel(0.56, 3);
  // runas entre anéis
  x.font = \`bold \${c * 0.1}px serif\`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#efe6ff';
  const N = tipo ? 18 : 24; for (let i = 0; i < N; i++) { x.save(); x.rotate(i / N * Math.PI * 2); x.fillText(RUN[(i * 7 + tipo * 3) % RUN.length], 0, -c * 0.76); x.restore(); }
  // pontas cardeais (estrela de 8 pontas por fora)
  for (let i = 0; i < 8; i++) { x.save(); x.rotate(i / 8 * Math.PI * 2); const L = i % 2 ? 1.0 : 1.12; x.beginPath(); x.moveTo(-c * 0.035, -c * 0.95); x.lineTo(0, -c * L * 0.98); x.lineTo(c * 0.035, -c * 0.95); x.closePath(); x.fillStyle = '#ffffff'; x.fill(); x.restore(); }
  // estrela/hexagrama interno
  x.lineWidth = 5; const k = tipo === 1 ? 5 : 6; for (let s = 0; s < 2; s++) { x.beginPath(); for (let i = 0; i <= k; i++) { const a = i / k * Math.PI * 2 + s * Math.PI / k - Math.PI / 2; const px = Math.cos(a) * c * 0.56, py = Math.sin(a) * c * 0.56; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
  if (tipo === 1) { x.beginPath(); for (let i = 0; i <= 5; i++) { const a = (i * 2) / 5 * Math.PI * 2 - Math.PI / 2; const px = Math.cos(a) * c * 0.56, py = Math.sin(a) * c * 0.56; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
  anel(0.3, 6); anel(0.24, 3);
  for (let i = 0; i < 12; i++) { x.save(); x.rotate(i / 12 * Math.PI * 2); x.beginPath(); x.moveTo(0, -c * 0.3); x.lineTo(0, -c * 0.56); x.lineWidth = 3; x.stroke(); x.beginPath(); x.arc(0, -c * 0.43, c * 0.018, 0, 7); x.fillStyle = '#fff'; x.fill(); x.restore(); }
  // núcleo
  const g = x.createRadialGradient(0, 0, 0, 0, 0, c * 0.2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(200,170,255,.9)'); g.addColorStop(1, 'rgba(120,70,255,0)'); x.fillStyle = g; x.beginPath(); x.arc(0, 0, c * 0.2, 0, 7); x.fill();
  x.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = i % 2 ? c * 0.05 : c * 0.16; i ? x.lineTo(Math.cos(a) * r, Math.sin(a) * r) : x.moveTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fillStyle = '#fff'; x.fill(); }
const fundo = (x, c) => { const g = x.createRadialGradient(0, 0, c * 0.2, 0, 0, c); g.addColorStop(0, 'rgba(70,20,200,.55)'); g.addColorStop(0.8, 'rgba(50,10,170,.4)'); g.addColorStop(1, 'rgba(40,10,150,0)'); x.fillStyle = g; x.beginPath(); x.arc(0, 0, c, 0, 7); x.fill(); };
const texGrande = cv(1024, (x, n) => { const c = n / 2; x.translate(c, c); fundo(x, c); circulo(x, c * 0.94, 0); });
const texMedio = cv(512, (x, n) => { const c = n / 2; x.translate(c, c); fundo(x, c); circulo(x, c * 0.92, 1); });
const texPeq = cv(256, (x, n) => { const c = n / 2; x.translate(c, c); fundo(x, c); x.strokeStyle = '#ffffff'; neon(x, '#7a3aff', 16); x.lineWidth = 7; x.beginPath(); x.arc(0, 0, c * 0.85, 0, 7); x.stroke(); x.lineWidth = 2; x.beginPath(); x.arc(0, 0, c * 0.62, 0, 7); x.stroke();
  for (let i = 0; i < 8; i++) { x.save(); x.rotate(i / 8 * Math.PI * 2); x.beginPath(); x.moveTo(-c * 0.06, -c * 0.85); x.lineTo(0, -c * (i % 2 ? 0.98 : 1.0)); x.lineTo(c * 0.06, -c * 0.85); x.fillStyle = '#fff'; x.fill(); x.restore(); }
  x.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = i % 2 ? c * 0.15 : c * 0.55; i ? x.lineTo(Math.cos(a) * r, Math.sin(a) * r) : x.moveTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.lineWidth = 2; x.stroke(); const g = x.createRadialGradient(0, 0, 0, 0, 0, c * 0.3); g.addColorStop(0, '#fff'); g.addColorStop(1, 'rgba(140,90,255,0)'); x.fillStyle = g; x.beginPath(); x.arc(0, 0, c * 0.3, 0, 7); x.fill(); });
// chão: anel externo de runas e anel interno com estrela
const texChaoFora = cv(1024, (x, n) => { const c = n / 2; x.translate(c, c); x.strokeStyle = '#ffffff'; neon(x, '#7a3aff', 26); [0.97, 0.93, 0.72].forEach((r, i) => { x.lineWidth = i ? 6 : 12; x.beginPath(); x.arc(0, 0, c * r, 0, 7); x.stroke(); });
  x.font = \`bold \${c * 0.11}px serif\`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#ffffff'; for (let i = 0; i < 28; i++) { x.save(); x.rotate(i / 28 * Math.PI * 2); x.fillText(RUN[i % RUN.length], 0, -c * 0.83); x.restore(); }
  for (let i = 0; i < 4; i++) { x.save(); x.rotate(i / 4 * Math.PI * 2 + Math.PI / 4); x.beginPath(); x.moveTo(-c * 0.05, -c * 0.97); x.lineTo(0, -c * 1.0); x.lineTo(c * 0.05, -c * 0.97); x.fillStyle = '#fff'; x.fill(); x.restore(); } });
const texChaoDentro = cv(1024, (x, n) => { const c = n / 2; x.translate(c, c); circulo(x, c * 0.7, 2); });
const glowA = cv(128, (x) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(200,180,255,.9)'); g.addColorStop(0.45, 'rgba(110,60,255,.4)'); g.addColorStop(1, 'rgba(60,20,220,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
;return {texGrande,texMedio,texPeq,texChaoFora,texChaoDentro,glowA};`))(T3x);
    // ---- textura da adaga: lâmina roxa estrelada, guarda crescente de prata, gema de ametista, pomo crescente ----
    const texAdaga = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 512; const x = c.getContext('2d');
      const prata = (a, b) => { const g = x.createLinearGradient(a, 0, b, 0); g.addColorStop(0, '#6a6a86'); g.addColorStop(0.45, '#ffffff'); g.addColorStop(0.6, '#d8d8ec'); g.addColorStop(1, '#5a5a76'); return g; };
      // lâmina (ponta pra cima)
      x.save(); x.shadowColor = '#b06aff'; x.shadowBlur = 18; x.beginPath(); x.moveTo(64, 8); x.bezierCurveTo(84, 90, 88, 200, 80, 300); x.lineTo(48, 300); x.bezierCurveTo(40, 200, 44, 90, 64, 8); x.closePath();
      const gl = x.createLinearGradient(40, 0, 88, 0); gl.addColorStop(0, '#2a0a5a'); gl.addColorStop(0.5, '#6a2ad8'); gl.addColorStop(1, '#22084a'); x.fillStyle = gl; x.fill(); x.restore();
      x.save(); x.beginPath(); x.moveTo(64, 8); x.bezierCurveTo(84, 90, 88, 200, 80, 300); x.lineTo(48, 300); x.bezierCurveTo(40, 200, 44, 90, 64, 8); x.closePath(); x.clip();
      for (let i = 0; i < 70; i++) { const px = 44 + Math.random() * 40, py = 20 + Math.random() * 280, r = Math.random() < 0.15 ? 2.2 : 0.9; x.fillStyle = `rgba(255,255,255,${0.5 + Math.random() * 0.5})`; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }
      const nb = x.createRadialGradient(64, 170, 2, 64, 170, 60); nb.addColorStop(0, 'rgba(255,120,240,.45)'); nb.addColorStop(1, 'rgba(255,120,240,0)'); x.fillStyle = nb; x.fillRect(0, 0, 128, 320);
      x.strokeStyle = 'rgba(230,200,255,.9)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(64, 14); x.lineTo(64, 296); x.stroke(); x.restore();
      x.strokeStyle = '#e8d8ff'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(64, 8); x.bezierCurveTo(84, 90, 88, 200, 80, 300); x.moveTo(64, 8); x.bezierCurveTo(44, 90, 40, 200, 48, 300); x.stroke();
      // guarda crescente (asas de lua pra cima)
      x.fillStyle = prata(4, 124); x.beginPath(); x.moveTo(64, 318); x.quadraticCurveTo(20, 320, 6, 270); x.quadraticCurveTo(26, 300, 64, 298); x.quadraticCurveTo(102, 300, 122, 270); x.quadraticCurveTo(108, 320, 64, 318); x.closePath(); x.fill(); x.strokeStyle = '#3a3a52'; x.lineWidth = 1.5; x.stroke();
      // gema de ametista
      x.save(); x.shadowColor = '#d07aff'; x.shadowBlur = 16; const gm = x.createRadialGradient(58, 302, 2, 64, 308, 16); gm.addColorStop(0, '#ffe0ff'); gm.addColorStop(0.35, '#c05aff'); gm.addColorStop(1, '#3a0a6a'); x.fillStyle = gm; x.beginPath(); x.arc(64, 308, 15, 0, 7); x.fill(); x.restore(); x.strokeStyle = prata(48, 80); x.lineWidth = 3; x.beginPath(); x.arc(64, 308, 15, 0, 7); x.stroke();
      // cabo
      x.fillStyle = '#1e1430'; x.fillRect(56, 322, 16, 120); x.strokeStyle = '#8a7ab0'; x.lineWidth = 2; for (let y = 326; y < 440; y += 10) { x.beginPath(); x.moveTo(56, y); x.lineTo(72, y + 6); x.stroke(); }
      // pomo crescente
      x.fillStyle = prata(30, 98); x.beginPath(); x.arc(64, 470, 26, Math.PI * 0.1, Math.PI * 0.9, false); x.arc(64, 452, 22, Math.PI * 0.82, Math.PI * 0.18, true); x.closePath(); x.fill();
      x.save(); x.shadowColor = '#d07aff'; x.shadowBlur = 10; x.fillStyle = '#c87aff'; x.beginPath(); x.arc(64, 446, 6, 0, 7); x.fill(); x.restore();
      const t = new T3x.CanvasTexture(c); t.colorSpace = T3x.SRGBColorSpace; return t; })();
    const mat = (t, add, op) => new T3x.MeshBasicMaterial({ map: t, transparent: true, side: T3x.DoubleSide, depthWrite: false, toneMapped: false, opacity: op == null ? 1 : op, blending: add ? T3x.AdditiveBlending : T3x.NormalBlending });
    const gira = [];
    function circ(par, t, s, x, y, z, v, glow) { const g = new T3x.Group(); g.position.set(x, y, z); par.add(g); const m = new T3x.Mesh(new T3x.PlaneGeometry(s, s), mat(t)); g.add(m);
      const m2 = new T3x.Mesh(m.geometry, mat(t, true, 0.5)); m2.material.color.set('#9a7aff'); m2.position.z = 0.003; g.add(m2); let gl = null;
      if (glow !== false) { gl = new T3x.Sprite(new T3x.SpriteMaterial({ map: TX.glowA, transparent: true, depthWrite: false, blending: T3x.AdditiveBlending, toneMapped: false, opacity: 0.25 })); gl.scale.set(s * 1.2, s * 1.2, 1); gl.position.z = -0.02; g.add(gl); }
      const o = { g, m, m2, v, gl, f: Math.random() * 6, a: Math.random() * 6 }; gira.push(o); return o; }
    // COSTAS: preso na raiz do herói (não balança com o corpo)
    const C = new T3x.Group(); C.position.set(0, 1.55, -0.62); heroi.add(C);
    circ(C, TX.texGrande, 1.25, 0, 0.62, 0, 0.6);
    const lados = [circ(C, TX.texGrande, 1.0, -0.95, 0.05, 0.05, -0.7), circ(C, TX.texGrande, 1.0, 0.95, 0.05, 0.05, 0.7)];
    lados.forEach((o, i) => { o.base = o.g.position.clone(); o.sobe = new T3x.Vector3(i ? 1.25 : -1.25, 0.75, 0.35); o.side = i ? 1 : -1; });
    [[-0.55, 0.75, 0.4, 1.3], [0.55, 0.75, 0.4, -1.3], [-0.45, -0.42, 0.42, -1.1], [0.45, -0.42, 0.42, 1.1]].forEach(([x, y, s, v]) => circ(C, TX.texMedio, s, x, y, 0.08, v));
    [[-1.45, 0.55, 0.28, -1.8], [1.45, 0.55, 0.28, 1.8], [-1.35, -0.55, 0.24, 1.6], [1.35, -0.55, 0.24, -1.6], [0, 1.35, 0.26, 2]].forEach(([x, y, s, v]) => circ(C, TX.texPeq, s, x, y, 0.1, v));
    // CHÃO: segue o personagem, dois anéis girando ao contrário
    const F = new T3x.Group(); F.position.y = 0.03; heroi.add(F);
    const fo = circ(F, TX.texChaoFora, 2.6, 0, 0, 0, 0.4, false); fo.g.rotation.x = -Math.PI / 2;
    const fd = circ(F, TX.texChaoDentro, 2.6, 0, 0.012, 0, -0.8, false); fd.g.rotation.x = -Math.PI / 2;
    C.visible = F.visible = false;
    // ---- ADAGAS ----
    const geoA = new T3x.PlaneGeometry(0.16, 0.64); geoA.translate(0, 0.07, 0);
    function fazAdaga() { const g = new T3x.Group(); const a = new T3x.Mesh(geoA, mat(texAdaga)); const b = a.clone(); b.rotation.y = Math.PI / 2; g.add(a, b);
      const h = new T3x.Sprite(new T3x.SpriteMaterial({ map: TX.glowA, transparent: true, depthWrite: false, blending: T3x.AdditiveBlending, toneMapped: false, opacity: 0.55 })); h.scale.set(0.5, 0.5, 1); h.position.y = 0.2; g.add(h); g.userData.h = h; return g; }
    const HUD = document.createElement('div'); HUD.id = 'adagasHud'; HUD.style.cssText = 'position:fixed;left:50%;bottom:172px;transform:translateX(-50%);z-index:30;padding:5px 14px;border-radius:14px;background:linear-gradient(180deg,rgba(40,14,80,.85),rgba(18,6,40,.85));border:1.5px solid #b48aff;color:#f0e6ff;font:700 15px system-ui;text-shadow:0 0 8px #a06aff;box-shadow:0 0 14px rgba(150,90,255,.6);pointer-events:none;display:none';
    document.body.appendChild(HUD);
    return { TX, C, F, gira, lados, fazAdaga, HUD, st: null, voo: [] };
  })();
  function arcanoOn() { return AR.divino === 'arcano' && !dentro; }
  function adagasN() { return ARC.st ? ARC.st.lista.length + ARC.voo.length : 0; }
  function adagasHud() { const n = adagasN(); ARC.HUD.style.display = ARC.st ? 'block' : 'none'; ARC.HUD.textContent = '🗡️ Adagas Astrais: ' + n; }
  function adagasAtiva() { if (AR.divino !== 'arcano') { aviso('Equipe o Grimório dos Círculos Arcanos.', '#c8a8ff'); return false; }
    if (ARC.st) { aviso('🗡️ Ainda restam ' + adagasN() + ' adagas. Ataque pra lançar!', '#c8a8ff'); return false; }
    ARC.st = { t: 0, lista: [], fase: 'sobe' }; som('magia', 0.9, 0.7); fx('luz', [heroi.position.x, 2, heroi.position.z], 0.6); aviso('🗡️ Adagas Astrais! Cada ataque lança uma adaga.', '#d0a8ff'); adagasHud(); return true; }
  function adagaAtk() { const S = ARC.st; if (!S || !S.lista.length || S.fase === 'sobe') return; const alvo = maisPerto(22); if (!alvo) return;
    // escolhe um alvo aleatório entre os próximos (às vezes o mais perto)
    let al = alvo; const vz = FERAS.concat(typeof CAL !== 'undefined' && CAL.feras ? CAL.feras : []).filter(e => feraAtiva(e) && Math.hypot(e.g.position.x - heroi.position.x, e.g.position.z - heroi.position.z) < 18); if (vz.length > 1 && Math.random() < 0.5) al = vz[Math.floor(Math.random() * vz.length)];
    const d = S.lista.pop(); d.m.updateMatrixWorld(); world.attach(d.m); const p0 = d.m.position.clone();
    const lado = Math.random() < 0.5 ? -1 : 1, f = facing + lado * (0.9 + Math.random() * 0.9);
    const p1 = p0.clone().add(new T3.Vector3(Math.sin(f) * (2 + Math.random() * 2.5), 1 + Math.random() * 2.2, Math.cos(f) * (2 + Math.random() * 2.5)));
    ARC.voo.push({ m: d.m, alvo: al, p0, p1, t: 0, dur: 0.5 + Math.random() * 0.2, prev: p0.clone() }); som('tiro', 0.5, 1.4, 0.05); adagasHud(); }
  function adagasFim() { const S = ARC.st; if (!S) return; S.lista.forEach(d => d.m.parent && d.m.parent.remove(d.m)); ARC.voo.forEach(v => v.m.parent && v.m.parent.remove(v.m)); ARC.voo.length = 0; ARC.st = null; adagasHud(); }
  const _v = new T3.Vector3(), _q = new T3.Vector3();
  function arcanoFrame(dt) { laminaFrame(dt); const on = arcanoOn() || !!ARC.lam; ARC.C.visible = ARC.F.visible = on; surfFrame(dt); if (ARC.surf) ARC.F.visible = on && ARC.surf.fase === 'forma' && ARC.surf.t < 0.9;
    if (AR.divino !== 'arcano' && ARC.st) adagasFim();
    if (on) { ARC.C.rotation.y = 0; ARC.gira.forEach(o => { o.a += dt * o.v * (ARC.velX || 1); o.m.rotation.z = o.m2.rotation.z = o.a; o.m2.material.opacity = 0.4 + Math.sin(gT * 3 + o.f) * 0.2; if (o.gl) o.gl.material.opacity = 0.2 + Math.sin(gT * 2 + o.f) * 0.08; }); }
    const S = ARC.st; let alvoK = S && S.fase !== 'desce' ? 1 : 0;
    ARC.lados.forEach(o => { o.k = o.k || 0; o.k += (alvoK - o.k) * Math.min(1, dt * 5); o.g.position.lerpVectors(o.base, o.sobe, o.k); const s = 1 + o.k * 0.15; o.g.scale.setScalar(s); });
    if (S) { S.t += dt;
      if (S.fase === 'sobe' && S.t > 0.55) { S.fase = 'invoca'; S.ti = 0; }
      if (S.fase === 'invoca') { S.ti += dt; while (S.lista.length < 10 && S.ti > S.lista.length * 0.08) { const i = S.lista.length, lado = ARC.lados[i % 2], k = Math.floor(i / 2); const m = ARC.fazAdaga(); lado.g.add(m);
          const ang = (-0.7 + k * 0.35); m.userData.alvo = new T3.Vector3(Math.sin(ang) * 0.7 * lado.side * -1 + lado.side * 0.05, 0.25 + Math.cos(ang) * 0.55, 0.12); m.position.set(0, 0, 0.05); m.scale.setScalar(0.01); S.lista.push({ m, ang, i }); som('magia', 0.25, 1.6, 0.05); }
        if (S.lista.length >= 10) S.fase = 'pronto'; adagasHud(); }
      S.lista.forEach(d => { const a = d.m.userData.alvo; d.m.position.lerp(a, Math.min(1, dt * 8)); const sc = Math.min(1, d.m.scale.x + dt * 3); d.m.scale.setScalar(sc); d.m.position.y = a.y + Math.sin(gT * 2.5 + d.i) * 0.04 + (d.m.position.y - a.y) * 0.9;
        d.m.rotation.set(0, gT * 1.5 + d.i, (a.x > 0 ? -1 : 1) * 0.12); if (d.m.userData.h) d.m.userData.h.material.opacity = 0.4 + Math.sin(gT * 5 + d.i) * 0.2; });
      if (S.fase === 'pronto' && !S.lista.length && !ARC.voo.length) { S.fase = 'desce'; S.td = 0; aviso('🗡️ Adagas esgotadas — habilidade liberada!', '#c8a8ff'); }
      if (S.fase === 'desce') { S.td += dt; if (S.td > 0.5) { ARC.st = null; adagasHud(); } } }
    for (let i = ARC.voo.length - 1; i >= 0; i--) { const v = ARC.voo[i]; v.t += dt / v.dur; const u = Math.min(1, v.t);
      const e = v.alvo, vivo = e && !e.morto; if (vivo) v.p2 = (v.p2 || new T3.Vector3()).set(e.g.position.x, e.g.position.y + (e.T.alt || 1.2) * 0.6, e.g.position.z); else if (!v.p2) v.p2 = v.p1.clone();
      const a = 1 - u; _v.set(0, 0, 0).addScaledVector(v.p0, a * a).addScaledVector(v.p1, 2 * a * u).addScaledVector(v.p2, u * u);
      v.m.position.copy(_v); _q.subVectors(_v, v.prev); if (_q.lengthSq() > 1e-6) { _q.normalize(); v.m.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), _q); } v.prev.copy(_v);
      if (u >= 1) { if (vivo) { const W = ARMAS[AR.arma]; dano(e, ((W && W.dano) || 20) * 1.2 * atkMult(), 'magia', critico()); } fx('gelo', [_v.x, _v.y, _v.z], 0.35); v.m.parent && v.m.parent.remove(v.m); ARC.voo.splice(i, 1); adagasHud(); } } }
  // ---- LÂMINA DO FIRMAMENTO: os círculos vão pra frente, encolhem, sobem pro céu e de lá cai uma espada gigante ----
  const ESPG = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 1024; const x = c.getContext('2d');
    const prata = (a, b) => { const g = x.createLinearGradient(a, 0, b, 0); g.addColorStop(0, '#5a5a76'); g.addColorStop(0.45, '#ffffff'); g.addColorStop(0.6, '#d8d8ec'); g.addColorStop(1, '#4a4a66'); return g; };
    const lam = () => { x.beginPath(); x.moveTo(128, 6); x.lineTo(170, 90); x.lineTo(166, 700); x.lineTo(90, 700); x.lineTo(86, 90); x.closePath(); };
    x.save(); x.shadowColor = '#b06aff'; x.shadowBlur = 30; lam(); const gl = x.createLinearGradient(86, 0, 170, 0); gl.addColorStop(0, '#1e0848'); gl.addColorStop(0.5, '#7a3ae8'); gl.addColorStop(1, '#1a063e'); x.fillStyle = gl; x.fill(); x.restore();
    x.save(); lam(); x.clip(); for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`; x.beginPath(); x.arc(88 + Math.random() * 80, 20 + Math.random() * 680, Math.random() < 0.12 ? 3 : 1.2, 0, 7); x.fill(); }
      const nb = x.createRadialGradient(128, 380, 4, 128, 380, 120); nb.addColorStop(0, 'rgba(255,120,240,.5)'); nb.addColorStop(1, 'rgba(255,120,240,0)'); x.fillStyle = nb; x.fillRect(0, 0, 256, 720);
      x.font = 'bold 30px serif'; x.textAlign = 'center'; x.fillStyle = 'rgba(240,220,255,.9)'; x.shadowColor = '#c08aff'; x.shadowBlur = 10; 'ᚠᚱᚲᛉᛟᛞᚨᛊᛏᛗ'.split('').forEach((r, i) => x.fillText(r, 128, 150 + i * 52)); x.restore();
    x.strokeStyle = '#efe0ff'; x.lineWidth = 4; lam(); x.stroke();
    // guarda: lua crescente grande
    x.fillStyle = prata(0, 256); x.beginPath(); x.moveTo(128, 744); x.quadraticCurveTo(30, 748, 4, 640); x.quadraticCurveTo(50, 712, 128, 704); x.quadraticCurveTo(206, 712, 252, 640); x.quadraticCurveTo(226, 748, 128, 744); x.closePath(); x.fill(); x.strokeStyle = '#2a2a42'; x.lineWidth = 2; x.stroke();
    x.save(); x.shadowColor = '#d07aff'; x.shadowBlur = 24; const gm = x.createRadialGradient(118, 712, 3, 128, 724, 30); gm.addColorStop(0, '#ffe0ff'); gm.addColorStop(0.35, '#c05aff'); gm.addColorStop(1, '#3a0a6a'); x.fillStyle = gm; x.beginPath(); x.arc(128, 724, 28, 0, 7); x.fill(); x.restore(); x.strokeStyle = prata(96, 160); x.lineWidth = 5; x.beginPath(); x.arc(128, 724, 28, 0, 7); x.stroke();
    x.fillStyle = '#1e1430'; x.fillRect(114, 752, 28, 200); x.strokeStyle = '#8a7ab0'; x.lineWidth = 3; for (let y = 758; y < 948; y += 16) { x.beginPath(); x.moveTo(114, y); x.lineTo(142, y + 9); x.stroke(); }
    x.fillStyle = prata(70, 186); x.beginPath(); x.arc(128, 990, 46, Math.PI * 0.1, Math.PI * 0.9, false); x.arc(128, 958, 40, Math.PI * 0.82, Math.PI * 0.18, true); x.closePath(); x.fill();
    x.save(); x.shadowColor = '#d07aff'; x.shadowBlur = 14; x.fillStyle = '#c87aff'; x.beginPath(); x.arc(128, 950, 10, 0, 7); x.fill(); x.restore();
    const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace;
    const g = new T3.Group(), geo = new T3.PlaneGeometry(1.6, 6.4); geo.translate(0, -3.2 + 0.05, 0); // ponta pra baixo, origem no pomo
    const mt = new T3.MeshBasicMaterial({ map: t, transparent: true, side: T3.DoubleSide, depthWrite: false, toneMapped: false });
    const a = new T3.Mesh(geo, mt); a.rotation.z = Math.PI; a.position.y = 0; const b = a.clone(); b.rotation.y = Math.PI / 2; g.add(a, b);
    const ab = new T3.Mesh(geo, new T3.MeshBasicMaterial({ map: t, transparent: true, side: T3.DoubleSide, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending, opacity: 0.45, color: '#b08aff' })); ab.rotation.z = Math.PI; g.add(ab);
    const h = new T3.Sprite(new T3.SpriteMaterial({ map: ARC.TX.glowA, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0.6 })); h.scale.set(4, 4, 1); h.position.y = 3; g.add(h);
    const imp = new T3.Mesh(new T3.PlaneGeometry(1, 1), new T3.MeshBasicMaterial({ map: ARC.TX.texChaoFora, transparent: true, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending, color: '#c8a8ff' })); imp.rotation.x = -Math.PI / 2; imp.visible = false; world.add(imp);
    g.visible = false; world.add(g); return { g, ab, h, imp, mats: [mt, ab.material, h.material] }; })();
  // geo invertida: a lâmina aponta pra baixo e o pomo fica em cima (origem do grupo = ponta)
  function ferasTodas() { const s = new Set(FERAS); if (typeof CAL !== 'undefined' && CAL.feras) CAL.feras.forEach(e => s.add(e)); return [...s].filter(e => feraAtiva(e)); }
  function laminaAtiva() { if (AR.divino !== 'arcano') { aviso('Equipe o Grimório dos Círculos Arcanos.', '#c8a8ff'); return false; }
    if (ARC.lam) return false; if (ARC.st) { aviso('🗡️ Lance as adagas primeiro (' + adagasN() + ' restantes).', '#c8a8ff'); return false; }
    const alvo = maisPerto(26); if (!alvo) { aviso('Nenhum inimigo perto pra Lâmina do Firmamento.', '#c8b48a'); return false; }
    ARC.lam = { t: 0, alvo, fase: 0, P: new T3.Vector3(alvo.g.position.x, 0, alvo.g.position.z) }; som('magia', 1, 0.6); flash('rgba(150,90,255,.35)'); aviso('⚔️ Lâmina do Firmamento!', '#d0a8ff'); return true; }
  const _lp = new T3.Vector3(), _lw = new T3.Vector3();
  function laminaFrame(dt) { const L = ARC.lam, C = ARC.C; if (!L) return; L.t += dt; const t = L.t;
    if (L.alvo && !L.alvo.morto) L.P.set(L.alvo.g.position.x, 0, L.alvo.g.position.z);
    const casa = new T3.Vector3(0, 1.55, -0.62), frente = new T3.Vector3(0, 1.9, 1.8);
    _lw.set(L.P.x, 6.8, L.P.z); heroi.updateMatrixWorld(); const ceu = heroi.worldToLocal(_lw.clone());
    const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    let rx = 0, sc = 1, vel = 1;
    if (t < 0.6) { const u = ease(t / 0.6); C.position.lerpVectors(casa, frente, u); sc = 1 - u * 0.3; vel = 1 + u * 2; }
    else if (t < 1.4) { const u = ease((t - 0.6) / 0.8); C.position.lerpVectors(frente, ceu, u); sc = 0.7 - u * 0.1; rx = -u * 0.9; vel = 3 + u * 3; }
    else if (t < 3.0) { C.position.copy(ceu); sc = 0.6; rx = -0.9; vel = 6; }
    else if (t < 3.9) { const u = ease((t - 3.0) / 0.9); C.position.lerpVectors(ceu, casa, u); sc = 0.6 + u * 0.4; rx = -0.9 * (1 - u); vel = 6 - u * 5; }
    else { C.position.copy(casa); C.rotation.x = 0; C.scale.setScalar(1); ESPG.g.visible = ESPG.imp.visible = false; ARC.lam = null; ARC.velX = 1; return; }
    C.scale.setScalar(sc); C.rotation.x = rx; ARC.velX = vel;
    // espada: surge do portal (1.4–1.9), cai (1.9–2.15), crava e some (2.15–3.4)
    const G = ESPG.g; const topo = 6.8, SS = 1.25;
    if (t >= 1.4 && t < 1.9) { const u = (t - 1.4) / 0.5; G.visible = true; G.position.set(L.P.x, topo - u * 1.6, L.P.z); G.scale.setScalar((0.3 + u * 0.7) * SS); G.rotation.y += dt * 3; ESPG.mats.forEach(m => m.opacity = m === ESPG.mats[1] ? 0.45 : 1); }
    else if (t >= 1.9 && t < 2.15) { const u = (t - 1.9) / 0.25; G.visible = true; G.scale.setScalar(SS); G.position.set(L.P.x, (topo - 1.6) * (1 - u * u) - 0.8 * u * u, L.P.z); }
    else if (t >= 2.15) { if (!L.bateu) { L.bateu = true; G.position.set(L.P.x, -0.8, L.P.z);
        const W = ARMAS[AR.arma], base = ((W && W.dano) || 20) * 6 * atkMult(); ferasTodas().forEach(e => { const d = Math.hypot(e.g.position.x - L.P.x, e.g.position.z - L.P.z) - e.T.raio; if (d < 4) { dano(e, d < 1.5 ? base : base * 0.6, 'magia', critico()); e.stun = Math.max(e.stun || 0, 1.2); } });
        fx('luz', [L.P.x, 0.6, L.P.z], 0.8); fx('gelo', [L.P.x, 1, L.P.z], 0.6); fx('fumo', [L.P.x, 0.3, L.P.z], 0.9); som('explosao', 1, 0.7); flash('rgba(190,140,255,.5)'); ESPG.imp.visible = true; ESPG.imp.position.set(L.P.x, 0.05, L.P.z); }
      const u = Math.min(1, (t - 2.15) / 1.25); ESPG.imp.scale.setScalar(1 + u * 8); ESPG.imp.material.opacity = 1 - u; ESPG.imp.rotation.z += dt * 2;
      const f = t > 2.9 ? Math.max(0, 1 - (t - 2.9) / 0.5) : 1; ESPG.mats[0].opacity = f; ESPG.mats[1].opacity = 0.45 * f + Math.sin(t * 20) * 0.1 * f; ESPG.mats[2].opacity = 0.6 * f; G.visible = f > 0; } }
  // ---- TRAVESSIA ASTRAL: os círculos descem pros pés, se fundem e viram uma espada voadora (montaria) ----
  const SURF = (() => { const g = new T3.Group(); const tex = ESPG.mats[0].map;
    const geo = new T3.PlaneGeometry(0.62, 2.5); const mk = (add, op) => new T3.MeshBasicMaterial({ map: tex, transparent: true, side: T3.DoubleSide, depthWrite: false, toneMapped: false, opacity: op || 1, blending: add ? T3.AdditiveBlending : T3.NormalBlending, color: add ? '#b08aff' : '#ffffff' });
    const a = new T3.Mesh(geo, mk()); a.rotation.x = Math.PI / 2; const ab = new T3.Mesh(geo, mk(true, 0.5)); ab.rotation.x = Math.PI / 2; ab.position.y = 0.004; const v = new T3.Mesh(geo, mk(false, 0.9)); v.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    g.add(a, ab, v); g.position.set(0, -0.06, 0.15);
    const aura = new T3.Sprite(new T3.SpriteMaterial({ map: ARC.TX.glowA, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0.55 })); aura.scale.set(3, 1.4, 1); aura.position.y = -0.1; g.add(aura);
    const anel = new T3.Mesh(new T3.PlaneGeometry(1.5, 1.5), new T3.MeshBasicMaterial({ map: ARC.TX.texMedio, transparent: true, side: T3.DoubleSide, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending, opacity: 0.7 })); anel.rotation.x = -Math.PI / 2; anel.position.y = -0.08; g.add(anel);
    g.visible = false; heroi.add(g);
    const rastro = []; for (let i = 0; i < 14; i++) { const s = new T3.Sprite(new T3.SpriteMaterial({ map: ARC.TX.glowA, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0 })); s.visible = false; world.add(s); rastro.push({ s, t: 9 }); }
    const flashS = new T3.Sprite(new T3.SpriteMaterial({ map: ARC.TX.glowA, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false, opacity: 0 })); flashS.position.y = 0.2; heroi.add(flashS);
    return { g, ab, aura, anel, rastro, flashS, mats: [a.material, ab.material, v.material], ri: 0, rt: 0 }; })();
  const SURF_H = 1.15;
  function surfAtiva() { if (AR.divino !== 'arcano') { aviso('Equipe o Grimório dos Círculos Arcanos.', '#c8a8ff'); return false; }
    const S = ARC.surf; if (S) { if (S.fase === 'on') { S.fase = 'desfaz'; S.t = 0; som('magia', 0.6, 1.2); aviso('🌌 Travessia Astral desfeita.', '#c8a8ff'); } return true; }
    if (ARC.lam || ARC.st) return false; if (typeof montado !== 'undefined' && montado) montar(false); if (voando) voa(false);
    ARC.surf = { fase: 'forma', t: 0 }; som('magia', 0.9, 0.8); aviso('🌌 Travessia Astral! Os círculos viram sua espada voadora.', '#d0a8ff'); return true; }
  function surfOn() { return !!(ARC.surf && ARC.surf.fase === 'on'); }
  function surfVel() { return surfOn() ? 2.1 : 1; }
  function surfY() { const S = ARC.surf; if (!S) return null; if (S.fase === 'forma') return S.t < 0.9 ? 0 : SURF_H * Math.min(1, (S.t - 0.9) / 0.5); if (S.fase === 'on') return SURF_H + Math.sin(gT * 2.2) * 0.08; return SURF_H * Math.max(0, 1 - S.t / 0.6); }
  function surfPose() { const S = ARC.surf; if (!S || (S.fase === 'forma' && S.t < 0.9)) return false; const b = Math.sin(gT * 2.2) * 0.05, ad = Math.min(1, vel / 8);
    pose(heroi, gT, { mood: 'smile', lean: 0.08 + ad * 0.22, arms: { shL: [0.1 + ad * 0.5, 0, -0.75 - b], shR: [0.1 + ad * 0.5, 0, 0.75 + b], elL: [-0.25, 0, 0], elR: [-0.25, 0, 0] }, legs: { thL: -0.35, knL: 0.45, thR: 0.25, knR: 0.2 } }); return true; }
  const _sw = new T3.Vector3();
  function surfFrame(dt) { const S = ARC.surf, C = ARC.C, G = SURF.g; if (!S) { G.visible = false; return; }
    if (AR.divino !== 'arcano') { ARC.surf = null; G.visible = false; C.position.set(0, 1.55, -0.62); C.rotation.x = 0; C.scale.setScalar(1); return; }
    if ((voando || montado) && S.fase !== 'desfaz') { S.fase = 'desfaz'; S.t = 0; }
    S.t += dt; const casa = new T3.Vector3(0, 1.55, -0.62), pe = new T3.Vector3(0, 0.08, 0.1), ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    if (S.fase === 'forma') { const u = ease(Math.min(1, S.t / 0.7)); C.visible = true; C.position.lerpVectors(casa, pe, u); C.rotation.x = -Math.PI / 2 * u; C.scale.setScalar(1 - u * 0.55 - Math.max(0, (S.t - 0.7) / 0.25) * 0.4); ARC.velX = 1 + u * 6;
      if (S.t > 0.85 && !S.fl) { S.fl = true; som('explosao', 0.5, 1.6); fx('luz', [heroi.position.x, 0.4, heroi.position.z], 0.5); }
      if (S.t >= 0.9) { G.visible = true; const k = Math.min(1, (S.t - 0.9) / 0.4); G.scale.set(k, 1, 0.2 + k * 0.8); }
      if (S.t >= 1.4) { S.fase = 'on'; ARC.velX = 1; G.scale.set(1, 1, 1); } }
    const ff = S.flt = S.fase === 'forma' ? Math.max(0, 1 - Math.abs(S.t - 0.9) / 0.2) : S.fase === 'desfaz' ? Math.max(0, 1 - Math.abs(S.t - 0.25) / 0.2) : 0; SURF.flashS.material.opacity = ff; SURF.flashS.scale.setScalar(0.5 + ff * 3);
    if (S.fase === 'on') { C.visible = false; G.visible = true; }
    if (S.fase === 'desfaz') { const u = ease(Math.min(1, S.t / 0.8)); G.visible = S.t < 0.3; C.visible = S.t >= 0.25; C.position.lerpVectors(pe, casa, u); C.rotation.x = -Math.PI / 2 * (1 - u); C.scale.setScalar(0.3 + u * 0.7);
      if (S.t >= 0.85) { ARC.surf = null; C.position.copy(casa); C.rotation.x = 0; C.scale.setScalar(1); G.visible = false; return; } }
    if (G.visible) { SURF.anel.rotation.z += dt * 2.5; SURF.ab.material.opacity = 0.4 + Math.sin(gT * 5) * 0.15; SURF.aura.material.opacity = 0.45 + Math.sin(gT * 3) * 0.12; G.rotation.z = Math.sin(gT * 1.6) * 0.05 - (input.x || 0) * 0.12; G.rotation.x = Math.sin(gT * 2.2 + 1) * 0.03; }
    // rastro de estrelas atrás da espada
    SURF.rt -= dt; if (G.visible && vel > 1 && SURF.rt <= 0) { SURF.rt = 0.04; const r = SURF.rastro[SURF.ri++ % SURF.rastro.length]; G.getWorldPosition(_sw); r.s.position.set(_sw.x - Math.sin(facing) * 1.1 + (Math.random() - 0.5) * 0.3, _sw.y + (Math.random() - 0.5) * 0.15, _sw.z - Math.cos(facing) * 1.1 + (Math.random() - 0.5) * 0.3); r.t = 0; r.s.visible = true; }
    SURF.rastro.forEach(r => { if (r.t > 0.6) { r.s.visible = false; return; } r.t += dt; const k = r.t / 0.6; r.s.material.opacity = 0.7 * (1 - k); const sc = 0.35 * (1 - k * 0.6); r.s.scale.set(sc, sc, 1); }); }
  function haloFrame(dt) { arcanoFrame(dt); rubraFrame(dt); seteFrame(dt); seloFrame(dt); arautoFrame(dt); const quer = haloVis() && !dentro; haloDefFrame(dt); HALO.H.visible = quer || HALO.elos.length > 0; if (HALO.cd > 0) HALO.cd -= dt;
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
  function espFrame(dt) { brFrame(); if (typeof div3dFrame === 'function') div3dFrame(dt); haloFrame(dt || 1 / 60); if (!podeArma(AR.arma)) equipaArma(null); const A = ARMAS[AR.arma]; buffBtn.hidden = !(A && A.staff) || !!conversa; if (buffBtn.hidden) buffP.hidden = true; }
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
