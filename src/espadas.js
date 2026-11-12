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
  var souGM = false;
  function staffArmas() { const adm = souAdmin(); const quer = { esp_adm: adm, esp_gm: adm || souGM };
    Object.keys(quer).forEach(k => { const tem = AR.armas.includes(k); if (quer[k] && !tem) { AR.armas.push(k); aviso('Você recebeu: ' + ARMAS[k].icone + ' ' + ARMAS[k].nome + '!', '#ff5aa8'); } if (!quer[k] && tem) { AR.armas = AR.armas.filter(x => x !== k); if (AR.arma === k) equipaArma(null); } }); }
  setTimeout(() => { try { if (window.CONTA && CONTA.db && CONTA.usuario) CONTA.db.collection('staff').doc(CONTA.usuario.uid).get().then(d => { souGM = d.exists && (d.data().cargo === 'gm' || d.data().cargo === 'adm'); staffArmas(); salvaAR(); }).catch(() => staffArmas()); else staffArmas(); } catch (e) { staffArmas(); } }, 7000);
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
  function espFrame() { if (!podeArma(AR.arma)) equipaArma(null); const A = ARMAS[AR.arma]; buffBtn.hidden = !(A && A.staff) || !!conversa; if (buffBtn.hidden) buffP.hidden = true; }
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
  function podeArma(k) { const A = ARMAS[k]; return !A || !A.soClasse || AR.classe === A.soClasse; }
