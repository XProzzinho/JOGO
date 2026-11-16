/* Módulo das armaduras (precisa do THREE global) */
const CelestialArmors=(()=>{
const T=THREE;
const mk=(c,m=.7,r=.3,e=0,i=0)=>new T.MeshStandardMaterial({color:c,metalness:m,roughness:r,emissive:e,emissiveIntensity:i});
const B=(w,h,d)=>new T.BoxGeometry(w,h,d), S=()=>new T.SphereGeometry(1,24,16),
      HS=()=>new T.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),
      C=(a,b,h,n=14)=>new T.CylinderGeometry(a,b,h,n), K=(r,h,n=8)=>new T.ConeGeometry(r,h,n),
      TO=(r,t)=>new T.TorusGeometry(r,t,8,40);
function add(p,geo,m,x=0,y=0,z=0,rx=0,ry=0,rz=0,sc){
  const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);
  if(sc)o.scale.set(sc[0],sc[1],sc[2]);o.castShadow=o.receiveShadow=true;p.add(o);return o;}

function build(o){
  const root=new T.Group(),g=new T.Group();root.add(g);
  const P=o.pal,glows=[],anim=[];
  const base=mk(P.base,.7,.35),armor=mk(P.armor,.78,.24),trim=mk(P.trim,.9,.2),
        dark=mk(0x0b1220,.5,.45),black=mk(0x03060c,.3,.5),cloth=mk(P.cloth,.2,.7),
        accent=mk(P.accent,.7,.22,P.accent,.6),glow=mk(P.glow,.4,.2,P.glow,2.2),
        skin=mk(o.skin||0xc58d69,.05,.65),hair=mk(o.hair,.2,.5),
        energy=new T.MeshStandardMaterial({color:P.glow,emissive:P.glow,emissiveIntensity:1.3,transparent:true,opacity:.72,roughness:.2,metalness:.2});
  base.side=T.DoubleSide;cloth.side=T.DoubleSide;glows.push(glow,accent,energy);
  const sp=(m,x,y,z,len,r,rx,ry,rz)=>add(g,K(r,len),m,x,y,z,rx,ry,rz); // espinho

  /* ---------- PERNAS ---------- */
  for(const s of[-1,1]){
    const x=s*.34;
    add(g,B(.5,.1,.86),dark,x,.05,.18);                       // sola
    add(g,B(.4,.2,.7),base,x,.2,.2);                           // pé
    add(g,S(),armor,x,.22,.55,0,0,0,[.2,.13,.22]);             // bico
    add(g,C(.2,.23,.14),trim,x,.4,0);                          // tornozelo
    add(g,C(.2,.26,.66,10),base,x,.78,0);                      // canela
    add(g,B(.3,.62,.1),armor,x,.8,.23,-.06);                   // placa da canela
    add(g,B(.05,.5,.05),glow,x,.82,.29,-.06);                  // veio brilhante
    add(g,B(.36,.46,.12),armor,x,.7,-.24);                     // protetor da panturrilha
    add(g,S(),armor,x,1.2,.16,0,0,0,[.26,.22,.2]);             // joelheira
    add(g,TO(.2,.025),trim,x,1.2,.17,Math.PI/2);               // aro
    sp(trim,x,1.2,.36,.34,.07,Math.PI/2,0,0);                   // espinho do joelho
    add(g,C(.25,.21,.5,10),base,x,1.5,0);                      // coxa
    add(g,B(.3,.44,.1),armor,x,1.5,.21,.05);                   // placa da coxa
    for(let i=0;i<3;i++)add(g,B(.36-i*.02,.05,.1),trim,x,1.3+i*.1,.21,.05+i*.02);
    sp(armor,x+s*.2,1.36,.08,.34,.09,0,0,-s*.9);
  }

  /* ---------- QUADRIL / SAIOTE ---------- */
  add(g,C(.56,.56,.15,26),dark,0,1.66,0,0,0,0,[1,1,.72]);
  add(g,TO(.5,.03),glow,0,1.74,0,Math.PI/2,0,0,[1,.72,1]);
  for(let i=-1;i<=1;i++){
    add(g,B(.22,.72,.07),i?base:armor,i*.27,1.3,.37,-.1,0,-i*.05);
    add(g,B(.04,.6,.03),accent,i*.27,1.3,.415,-.1,0,-i*.05);
    add(g,B(.22,.7,.06),base,i*.27,1.3,-.34,.1);
    sp(trim,i*.27,.9,.4,.2,.06,Math.PI,0,0);
  }
  for(const s of[-1,1])add(g,B(.12,.6,.4),armor,s*.52,1.38,0,0,0,-s*.12);
  add(g,S(),trim,0,1.66,.42,0,0,0,[.19,.2,.09]);add(g,S(),glow,0,1.68,.5,0,0,0,[.1,.1,.04]);
  if(o.skull){const wm=mk(0xf2f6fb,.3,.5);add(g,S(),wm,0,1.5,.5,0,0,0,[.13,.15,.09]);add(g,B(.12,.07,.07),wm,0,1.4,.5);
    for(const s of[-1,1])add(g,S(),black,s*.05,1.52,.58,0,0,0,[.03,.035,.02]);
    add(g,B(.3,.95,.05),dark,0,.95,.44,-.05);add(g,B(.06,.8,.03),accent,0,.95,.48,-.05);}
  if(o.coat)for(const s of[-1,1]){add(g,B(.3,1.5,.08),armor,s*.3,.85,.4,-.03,0,s*.03);add(g,B(.05,1.4,.03),accent,s*.44,.85,.44,-.03);
    add(g,B(.34,1.5,.08),armor,s*.3,.85,-.38,.05);add(g,B(.05,1.4,.03),glow,s*.45,.85,-.42);add(g,B(.1,1.2,.4),armor,s*.55,.95,0,0,0,-s*.05);}
  if(o.collar)for(const s of[-1,1]){add(g,B(.07,.6,.34),armor,s*.2,3.05,.02,0,0,-s*.3);add(g,B(.02,.5,.3),glow,s*.24,3.05,.02,0,0,-s*.3);}
  if(o.tabard){add(g,B(.5,1.5,.06),armor,0,.85,.43,-.03);add(g,B(.1,1.3,.03),glow,0,.85,.47,-.03);
    for(const s of[-1,1]){add(g,B(.08,1.3,.03),black,s*.17,.85,.47,-.03);add(g,B(.04,1.4,.03),accent,s*.24,.85,.47,-.03);}}

  /* ---------- TORSO ---------- */
  const prof=[[.3,1.75],[.4,1.85],[.46,2.05],[.54,2.3],[.58,2.52],[.5,2.75],[.3,2.88]].map(a=>new T.Vector2(a[0],a[1]));
  add(g,new T.LatheGeometry(prof,28),base,0,0,0,0,0,0,[1,1,.66]);
  for(let i=0;i<4;i++){add(g,C(.45,.45,.1,24),i%2?trim:armor,0,1.8+i*.105,.03,0,0,0,[1,1,.76]);
    add(g,TO(.45),glow,0,1.855+i*.105,.03,Math.PI/2,0,0,[1,.76,1]).scale.z=.02;}
  for(const s of[-1,1]){
    add(g,B(.5,.57,.18),armor,s*.27,2.46,.3,-.08,-s*.3,-s*.18);
    add(g,B(.05,.42,.03),accent,s*.28,2.46,.395,-.08,-s*.3,-s*.18);
    add(g,B(.46,.1,.16),trim,s*.27,2.2,.3,0,-s*.3,-s*.1);
    sp(trim,s*.5,2.74,.06,.6,.15,0,0,-s*.5);
  }
  add(g,B(.18,.42,.09),trim,0,2.48,.42);
  add(g,S(),glow,0,2.46,.5,0,0,0,[.1,.13,.05]);
  const core=add(g,TO(.15,.02),glow,0,2.46,.5);anim.push(t=>core.rotation.z=t*1.4);
  for(let r=0;r<5;r++){add(g,B(.5,.06,.04),r%2?accent:glow,0,1.95+r*.18,-.4); }  // runas nas costas
  add(g,B(.8,.85,.12),armor,0,2.4,-.33);add(g,B(.07,.8,.1),trim,0,2.4,-.4);
  for(let r=0;r<4;r++)for(const s of[-1,1])add(g,B(.18,.025,.03),glow,s*.17,2.1+r*.18,-.41);

  /* ---------- GORGET / PESCOÇO ---------- */
  add(g,C(.16,.18,.28,12),dark,0,2.95,0);
  add(g,TO(.26,.05),trim,0,2.88,0,Math.PI/2,0,0,[1,.85,1]);
  for(const s of[-1,1]){sp(armor,s*.24,2.95,.12,.5,.12,0,0,-s*.5);sp(trim,s*.2,2.93,-.1,.4,.1,-.4,0,-s*.4);}

  /* ---------- CABEÇA ---------- */
  add(g,S(),skin,0,3.25,.02,0,0,0,[.29,.37,.26]);
  if(o.helmet){
    add(g,HS(),base,0,3.28,0,0,0,0,[.35,.33,.33]);
    add(g,B(.44,.3,.12),armor,0,3.2,.23,.05);
    add(g,B(.42,.1,.08),black,0,3.3,.29);add(g,B(.3,.03,.03),glow,0,3.3,.335);
    add(g,B(.2,.07,.1),trim,0,3.02,.24,.3);
    for(const s of[-1,1]){
      add(g,B(.08,.28,.26),armor,s*.31,3.18,.03);add(g,B(.03,.14,.03),glow,s*.355,3.2,.1);
      sp(o.variant?accent:armor,s*.3,3.5,0,.58,.1,0,0,-s*.85);
      sp(trim,s*.22,3.62,-.05,.34,.07,-.3,0,-s*.5);
    }
    add(g,B(.06,.42,.52),trim,0,3.7,-.02,.25);
    add(g,B(.04,.3,.4),accent,0,3.78,-.12,.3);
  }else{
    add(g,HS(),hair,0,3.4,-.03,0,0,0,[.33,.28,.3]);
    for(const s of[-1,1]){sp(hair,s*.29,3.34,0,.5,.1,0,0,-s*.2);sp(hair,s*.2,3.55,.1,.34,.08,.4,0,-s*.5);}
    sp(hair,0,3.6,.2,.3,.08,1.2,0,0);
    if(o.goggles!==false){add(g,B(.5,.09,.06),accent,0,3.3,.25);add(g,B(.36,.04,.03),black,0,3.3,.29);add(g,B(.2,.02,.03),glow,0,3.3,.31);}
    if(o.crown){for(const s of[-1,1]){sp(trim,s*.2,3.66,.04,.5,.08,0,0,-s*.35);sp(armor,s*.33,3.5,0,.55,.1,0,0,-s*.8);}sp(trim,0,3.75,.08,.6,.1,.1,0,0);add(g,TO(.31,.03),trim,0,3.5,0,Math.PI/2,0,0);}
    if(o.long)add(g,B(.52,1.0,.14),hair,0,2.95,-.2,.05);
    for(const s of[-1,1]){add(g,C(.06,.06,.1,10),trim,s*.3,3.22,0,0,0,Math.PI/2);add(g,S(),glow,s*.36,3.22,0,0,0,0,[.03,.03,.03]);}
  }
  if(o.halo){const h=add(g,TO(.4,.02),glow,0,4.0,-.02,Math.PI/2);
    const h2=add(g,TO(.5,.01),accent,0,4.0,-.02,Math.PI/2);
    anim.push(t=>{h.rotation.z=t*.8;h2.rotation.z=-t*.5;h.position.y=h2.position.y=4+Math.sin(t*1.5)*.03;});}

  /* ---------- BRAÇOS ---------- */
  for(const s of[-1,1]){
    for(let i=0;i<4;i++){                                       // ombreira em lâminas
      add(g,HS(),i%2?armor:base,s*(.72+i*.03),2.7-i*.1,.02,0,0,-s*(.25+i*.1),[.44-i*.03,.2,.36-i*.02]);
      add(g,TO(.3),trim,s*(.72+i*.03),2.7-i*.1,.02,Math.PI/2,0,0,[.9,.8,1]).scale.z=.03;
    }
    add(g,B(.07,.24,.04),glow,s*.8,2.72,.35,0,0,s*.25);
    sp(trim,s*.84,2.96,-.02,.62,.15,0,0,-s*.6);sp(armor,s*1.04,2.7,-.02,.5,.13,0,0,-s*1.2);
    add(g,C(.18,.22,.62,12),base,s*.78,2.16,0,0,0,s*-.1);        // braço
    add(g,B(.32,.5,.14),armor,s*.78,2.15,.14,0,0,s*-.1);add(g,B(.05,.38,.03),accent,s*.78,2.14,.22,0,0,s*-.1);
    add(g,S(),trim,s*.8,1.8,.06,0,0,0,[.23,.24,.23]);            // cotovelo
    sp(trim,s*.9,1.82,-.12,.4,.1,-.5,0,-s*1.1);
    add(g,C(.19,.15,.4,12),base,s*.79,1.62,.04);                 // antebraço
    add(g,B(.32,.34,.3),armor,s*.79,1.62,.09);
    for(let i=0;i<3;i++)add(g,B(.34,.03,.32),i%2?glow:trim,s*.79,1.5+i*.1,.09);
    sp(armor,s*.97,1.64,-.05,.42,.08,0,0,-s*.4).rotation.x=-.3;   // lâmina do antebraço
    add(g,B(.22,.14,.2),skin,s*.79,1.38,.1);                      // mão
    for(let f=0;f<4;f++)add(g,B(.045,.045,.14),trim,s*.79+(f-1.5)*.052,1.35,.24);
    add(g,B(.05,.05,.12),trim,s*.79-s*.14,1.38,.2,0,s*.5,0);
  }

  /* ---------- CAPA ---------- */
  if(o.cape){
    const cg=new T.PlaneGeometry(1.5,2.5,16,12);cg.translate(0,-1.25,0);
    const pos=cg.attributes.position;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),ty=-pos.getY(i)/2.5;
      pos.setX(i,x*(1+ty*.3));pos.setZ(i,-ty*.28+Math.sin(x*9+ty*2)*.06*ty);}
    cg.computeVertexNormals();
    add(g,cg,cloth,0,2.78,-.4);
    for(const s of[-1,1]){add(g,B(.04,2.45,.03),accent,s*.72,1.55,-.55,.1,0,s*.1);add(g,S(),trim,s*.55,2.78,-.3,0,0,0,[.08,.08,.06]);}
    add(g,B(.7,.04,.03),glow,0,.15,-.7);
    if(o.spikeCape)for(let i=0;i<9;i++)sp(accent,(i-4)*.2,.22,-.7,.35,.07,Math.PI,0,0);
  }

  /* ---------- COSTAS ---------- */
  if(o.back==='wings'){
    for(const s of[-1,1]){
      const wing=new T.Group();wing.position.set(s*.2,2.55,-.45);g.add(wing);
      for(let i=0;i<7;i++){
        const len=2.2-i*.17,pv=new T.Group();pv.rotation.set(-.3,0,-s*(.15+i*.2));
        add(pv,K(.12,len,4),energy,0,len/2,0,0,Math.PI/4,0,[1,1,.14]);
        add(pv,B(.03,len*.9,.03),trim,0,len*.45,0);wing.add(pv);
        anim.push(t=>pv.rotation.z=-s*(.15+i*.2)-s*Math.sin(t*1.5+i*.15)*.04);
      }
      add(g,C(.04,.05,.8,8),trim,s*.4,2.7,-.45,0,0,-s*1.1);
    }
  }else if(o.back==='thrusters'){
    add(g,B(.6,.6,.2),dark,0,2.35,-.45);add(g,B(.5,.04,.04),glow,0,2.5,-.56);
    for(const s of[-1,1]){add(g,C(.1,.15,.55,12),trim,s*.24,2.1,-.58,.25);
      add(g,C(.08,.08,.03,12),glow,s*.24,1.84,-.65,.25);
      add(g,K(.09,.4,10),energy,s*.24,1.62,-.68,Math.PI+.25);
      add(g,C(.02,.02,.9,6),trim,s*.72,3.2,-.1);}
  }else if(o.back==='crystals'){
    for(const s of[-1,1])for(let i=0;i<5;i++){
      const len=1.3-i*.15;
      add(g,K(.1,len,6),energy,s*(.25+i*.2),2.6+i*.08,-.5,-.25,0,-s*(.35+i*.25),[1,1,.7]);}
    add(g,K(.14,1.5,6),energy,0,3.05,-.55,-.2);
  }

  root.userData.update=t=>{
    const p=1.8+Math.sin(t*2.2)*.7;glow.emissiveIntensity=p;accent.emissiveIntensity=.5+Math.sin(t*2.2)*.2;
    energy.emissiveIntensity=1+Math.sin(t*1.7)*.4;anim.forEach(f=>f(t));
  };
  return root;
}

const pal={
 imperial:{base:0x0f1a2e,armor:0xeef4fb,trim:0xc4d0de,accent:0x0a63e8,glow:0x45d0ff,cloth:0x0a1c44},
 celestial:{base:0x0758dc,armor:0xcbd7e5,trim:0xf0f5fb,accent:0x0a63e8,glow:0x45d0ff,cloth:0x071b48},
 glacial:{base:0x101827,armor:0xe6f2ff,trim:0xb9cde3,accent:0x5cc8ff,glow:0x9eeaff,cloth:0x07162e}};
const presets={
 imperial1:{name:'Imperial I',pal:pal.imperial,helmet:false,coat:1,collar:1,hair:0x1764db,back:'thrusters'},
 imperial2:{name:'Imperial II',pal:pal.imperial,helmet:false,coat:1,collar:1,hair:0x9c5a4a,back:'thrusters'},
 celestial1:{name:'Celestial I',pal:pal.celestial,helmet:false,crown:1,goggles:false,long:1,skull:1,spikeCape:1,cape:true,halo:true,back:'wings',hair:0x1a2a8c},
 celestial2:{name:'Celestial II',pal:pal.celestial,helmet:false,crown:1,goggles:false,skull:1,spikeCape:1,cape:true,halo:true,back:'wings',hair:0x3a2418},
 glacial1:{name:'Glacial I',pal:pal.glacial,helmet:false,goggles:false,long:1,collar:1,tabard:1,crown:1,cape:true,halo:true,back:'crystals',hair:0xb8906a},
 glacial2:{name:'Glacial II',pal:pal.glacial,helmet:false,goggles:false,collar:1,tabard:1,crown:1,cape:true,halo:true,back:'crystals',hair:0xdfe9f5}};
return{build,presets};
})();
