  // ===================== ASAS DO ABISMO ETÉREO (modelo 3D enviado pelo usuário, adaptado) =====================
  const ASAS_ABISMO_MOD = (function (THREE) {
const ArcaneWingSystem = (function () {
  let sharedCache = null;

  /**
   * Gera textura de rugosidade/normal procedural para o metal forjado escuro
   */
  function createForgedMetalTextures() {
    const size = 256;
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = size;
    bumpCanvas.height = size;
    const ctx = bumpCanvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    // Ranhuras de forja e micro-marteladas
    for (let i = 0; i < 2400; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const v = 105 + Math.floor(Math.random() * 50);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, y, 2, 2);
    }

    ctx.strokeStyle = 'rgba(40, 40, 40, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 90; i++) {
      ctx.beginPath();
      const y = Math.random() * size;
      ctx.moveTo(0, y);
      ctx.lineTo(size, y + (Math.random() - 0.5) * 18);
      ctx.stroke();
    }

    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;
    return bumpMap;
  }

  /**
   * Gera textura de partícula suave (brasa brilhante e fumaça etérea)
   */
  function createParticleTexture(isSmoke = false) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(size / 2, size / 2, 1, size / 2, size / 2, size / 2);
    if (isSmoke) {
      grad.addColorStop(0, 'rgba(126, 34, 206, 0.48)');
      grad.addColorStop(0.45, 'rgba(59, 7, 100, 0.25)');
      grad.addColorStop(1, 'rgba(15, 5, 28, 0)');
    } else {
      grad.addColorStop(0, 'rgba(255, 250, 255, 1)');
      grad.addColorStop(0.22, 'rgba(232, 121, 249, 0.95)');
      grad.addColorStop(0.55, 'rgba(147, 51, 234, 0.45)');
      grad.addColorStop(1, 'rgba(59, 7, 100, 0)');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Shader GLSL customizado para as membranas rasgadas com veios arcanos animados,
   * furos orgânicos e bordas de fogo violeta.
   */
  function createArcaneMembraneShaderMaterial() {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vLocalPos;
      varying vec3 vNormal;
      uniform float uTime;
      uniform float uFlapSpeed;

      void main() {
        vUv = uv;
        vLocalPos = position;
        vNormal = normal;

        // Ondulação aerodinâmica sutil na membrana durante o movimento
        vec3 pos = position;
        float distFromRoot = clamp(length(pos.xy) * 0.35, 0.0, 1.0);
        float ripple = sin(pos.x * 3.5 - uTime * (3.0 + uFlapSpeed * 2.5) + pos.y * 2.0) * 0.045 * distFromRoot;
        pos.z += ripple;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vLocalPos;
      uniform float uTime;
      uniform float uEnergy;

      // Hash & Ruído 2D suave
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      // Fractional Brownian Motion (FBM) para chamas e filamentos
      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amp * noise(p);
          p *= 2.05;
          amp *= 0.5;
        }
        return value;
      }

      // Filamentos estilo relâmpago/veios arcanos (Ridged FBM)
      float ridgedFbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
          v += a * n * n;
          p *= 2.15;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;

        // Distorção de chama ascendente
        float flowTime = uTime * 1.15;
        vec2 warp = vec2(
          fbm(uv * 4.5 + vec2(0.0, -flowTime * 0.4)),
          fbm(uv * 4.5 + vec2(4.2, -flowTime * 0.6))
        );

        // Rede densa de veios de energia e relâmpagos
        float veinsPrimary = ridgedFbm(uv * 5.2 + warp * 1.35 + vec2(0.0, -flowTime * 0.25));
        float veinsFine = ridgedFbm(uv * 11.5 - warp * 1.8 + vec2(flowTime * 0.15, -flowTime * 0.4));

        float boltMask = smoothstep(0.68, 0.96, veinsPrimary) + smoothstep(0.76, 0.98, veinsFine) * 0.65;

        // Gradiente estrutural da raiz (escura) até as pontas inferiores (violeta/magenta)
        float edgeFactor = clamp(1.0 - uv.y * 0.85 + uv.x * 0.35, 0.0, 1.0);
        float rimFlame = fbm(uv * 9.0 + vec2(0.0, -flowTime * 1.3));

        // Furos orgânicos perfurados na membrana inferior (como na arte de referência)
        float hole1 = length((uv - vec2(0.42, 0.24)) * vec2(1.0, 1.25));
        float hole2 = length((uv - vec2(0.48, 0.20)) * vec2(1.1, 1.1));
        float hole3 = length((uv - vec2(0.64, 0.29)) * vec2(1.0, 1.2));
        float holeDist = min(min(hole1, hole2), hole3);
        float holeNoise = fbm(uv * 14.0) * 0.025;

        if (holeDist + holeNoise < 0.042) {
          discard;
        }

        // Borda brilhante ao redor dos furos
        float holeRim = smoothstep(0.085, 0.042, holeDist + holeNoise) * 1.35;

        // Paleta Dark Fantasy Arcana
        vec3 colObsidian = vec3(0.04, 0.015, 0.09);
        vec3 colDeepPurple = vec3(0.32, 0.06, 0.58);
        vec3 colNeonViolet = vec3(0.68, 0.18, 0.96);
        vec3 colHotMagenta = vec3(0.96, 0.65, 1.0);

        vec3 baseColor = mix(colObsidian, colDeepPurple, smoothstep(0.1, 0.85, edgeFactor + rimFlame * 0.25));
        baseColor = mix(baseColor, colNeonViolet, boltMask * 0.85);
        baseColor += colHotMagenta * pow(boltMask, 2.4) * 0.95;
        baseColor += colNeonViolet * holeRim;

        // Borda inferior flamejante e translúcida
        float bottomEdgeGlow = smoothstep(0.38, 0.02, uv.y) * smoothstep(0.25, 0.78, rimFlame);
        baseColor += mix(colNeonViolet, colHotMagenta, bottomEdgeGlow) * bottomEdgeGlow * 1.2;

        // Transparência nas bordas dissolvidas por fogo
        float alpha = mix(0.95, 0.62, smoothstep(0.35, 0.0, uv.y));
        alpha *= smoothstep(0.12, 0.42, rimFlame + uv.y * 0.85);
        alpha = clamp(alpha + boltMask * 0.35 + holeRim * 0.4, 0.0, 0.98);

        gl_FragColor = vec4(baseColor * uEnergy, alpha);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uFlapSpeed: { value: 1.0 },
        uEnergy: { value: 1.0 }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }

  /**
   * Inicializa e compartilha todos os materiais PBR e Shaders
   */
  function getMaterials() {
    if (sharedCache) return sharedCache;

    const metalBump = createForgedMetalTextures();
    const emberTex = createParticleTexture(false);
    const smokeTex = createParticleTexture(true);
    const membraneShaderMat = createArcaneMembraneShaderMaterial();

    // Metal escuro forjado de alta precisão (#1a1423)
    const darkForgedArmor = new THREE.MeshStandardMaterial({
      color: 0x1a1423,
      emissive: 0x16072b,
      emissiveIntensity: 0.3,
      bumpMap: metalBump,
      bumpScale: 0.015,
      metalness: 0.92,
      roughness: 0.25
    });

    // Bordas, garras e filigranas em bronze/prata envelhecida (#b89f82)
    const antiqueTrimMetal = new THREE.MeshStandardMaterial({
      color: 0xb89f82,
      emissive: 0x26190d,
      emissiveIntensity: 0.2,
      bumpMap: metalBump,
      bumpScale: 0.01,
      metalness: 0.94,
      roughness: 0.24
    });

    // Correntes metálicas escuras polidas
    const chainLinkMetal = new THREE.MeshStandardMaterial({
      color: 0x9b8ca6,
      metalness: 0.95,
      roughness: 0.22
    });

    // Cristal físico translúcido com iridescência e emissão interna
    const arcaneCrystalPhysical = new THREE.MeshStandardMaterial({
      color: 0xd946ef, emissive: 0x7e22ce, emissiveIntensity: 1.85, metalness: 0.08, roughness: 0.1, flatShading: true
    });

    // Sulcos rúnicos e núcleos incandescentes (disparam o Bloom)
    const runeEmissiveMat = new THREE.MeshBasicMaterial({
      color: 0xe879f9
    });

    const hotCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfdf4ff
    });

    sharedCache = {
      darkForgedArmor,
      antiqueTrimMetal,
      chainLinkMetal,
      arcaneCrystalPhysical,
      runeEmissiveMat,
      hotCoreMat,
      membraneShaderMat,
      emberTex,
      smokeTex
    };

    return sharedCache;
  }

  /**
   * Cria uma placa de armadura chanfrada extrudada (ExtrudeGeometry com bevel)
   */
  function createBeveledArmorPlate(width, height, depth, material) {
    const hw = width * 0.5;
    const hh = height * 0.5;

    const shape = new THREE.Shape();
    shape.moveTo(0, hh);
    shape.lineTo(hw, hh * 0.35);
    shape.lineTo(hw * 0.72, -hh);
    shape.lineTo(0, -hh * 0.75);
    shape.lineTo(-hw * 0.72, -hh);
    shape.lineTo(-hw, hh * 0.35);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: width * 0.08,
      bevelThickness: depth * 0.45
    });
    geo.center();

    return new THREE.Mesh(geo, material);
  }

  /**
   * Cria o engaste metálico multi-nível e o cristal losango facetado da ombreira
   */
  function createOrnateShoulderCrest() {
    const mats = getMaterials();
    const crestGroup = new THREE.Group();

    // Camada 1: Placa base de obsidiana chanfrada
    const basePlate = createBeveledArmorPlate(0.95, 1.18, 0.14, mats.darkForgedArmor);
    crestGroup.add(basePlate);

    // Camada 2: Moldura dourada/prateada envelhecida em losango com pontas salientes
    const frameBars = [
      { x: 0.21, y: 0.27, rz: 0.66 },
      { x: -0.21, y: 0.27, rz: -0.66 },
      { x: 0.21, y: -0.27, rz: -0.66 },
      { x: -0.21, y: -0.27, rz: 0.66 }
    ];
    frameBars.forEach((b) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.54, 0.18), mats.antiqueTrimMetal);
      bar.position.set(b.x, b.y, 0.07);
      bar.rotation.z = b.rz;
      crestGroup.add(bar);

      // Rebite metálico no centro de cada barra
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), mats.antiqueTrimMetal);
      rivet.position.set(b.x * 1.05, b.y * 1.05, 0.16);
      crestGroup.add(rivet);
    });

    // Garras superiores e inferiores segurando o cristal
    const clawGeo = new THREE.ConeGeometry(0.085, 0.34, 4);
    const topClaw = new THREE.Mesh(clawGeo, mats.antiqueTrimMetal);
    topClaw.position.set(0, 0.58, 0.11);
    topClaw.rotation.x = 0.25;
    topClaw.rotation.y = Math.PI / 4;
    crestGroup.add(topClaw);

    const botClaw = new THREE.Mesh(clawGeo, mats.antiqueTrimMetal);
    botClaw.position.set(0, -0.58, 0.11);
    botClaw.rotation.z = Math.PI;
    botClaw.rotation.x = -0.25;
    botClaw.rotation.y = Math.PI / 4;
    crestGroup.add(botClaw);

    // Chifres/esporas curvas saindo do topo da ombreira (como na imagem)
    const hornOuterCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0.38, 0.04),
      new THREE.Vector3(-0.34, 0.72, 0.02),
      new THREE.Vector3(-0.18, 1.06, -0.05)
    ]);
    const hornOuter = new THREE.Mesh(
      new THREE.TubeGeometry(hornOuterCurve, 14, 0.06, 6, false),
      mats.darkForgedArmor
    );
    crestGroup.add(hornOuter);

    const hornInnerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.16, 0.38, 0.04),
      new THREE.Vector3(0.32, 0.74, 0.02),
      new THREE.Vector3(0.52, 0.98, -0.04)
    ]);
    const hornInner = new THREE.Mesh(
      new THREE.TubeGeometry(hornInnerCurve, 14, 0.055, 6, false),
      mats.antiqueTrimMetal
    );
    crestGroup.add(hornInner);

    // Cristal losango facetado translúcido
    const gemGeo = new THREE.OctahedronGeometry(0.32, 0);
    gemGeo.scale(0.76, 1.18, 0.48);
    const gemMesh = new THREE.Mesh(gemGeo, mats.arcaneCrystalPhysical.clone());
    gemMesh.position.z = 0.12;
    crestGroup.add(gemMesh);

    // Estrela de luz interna (núcleo incandescente)
    const coreGeo = new THREE.OctahedronGeometry(0.14, 0);
    coreGeo.scale(0.75, 1.18, 0.52);
    const coreMesh = new THREE.Mesh(coreGeo, mats.hotCoreMat);
    coreMesh.position.z = 0.15;
    crestGroup.add(coreMesh);

    crestGroup.userData.gemMesh = gemMesh;
    return crestGroup;
  }

  /**
   * Cria uma corrente catenária metálica elo por elo (alternados em 90 graus)
   */
  function createChainCatenary(p0, p1, p2, numLinks = 14) {
    const mats = getMaterials();
    const chain = new THREE.Group();
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    const linkGeo = new THREE.TorusGeometry(0.038, 0.011, 7, 14);

    for (let i = 0; i <= numLinks; i++) {
      const t = i / numLinks;
      const pos = curve.getPoint(t);
      const tan = curve.getTangent(t);

      const link = new THREE.Mesh(linkGeo, mats.chainLinkMetal);
      link.position.copy(pos);
      link.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
      link.rotateY((i % 2) * (Math.PI / 2));
      chain.add(link);
    }

    return chain;
  }

  /**
   * Cria um pingente vertical articulado com corrente e ponta de estaca/cristal
   */
  function createChainPendant(chainLength = 0.72, links = 9) {
    const mats = getMaterials();
    const pivot = new THREE.Group();
    const linkGeo = new THREE.TorusGeometry(0.034, 0.01, 7, 14);
    const step = chainLength / links;

    for (let i = 0; i < links; i++) {
      const link = new THREE.Mesh(linkGeo, mats.chainLinkMetal);
      link.position.y = -i * step;
      link.rotation.y = (i % 2) * (Math.PI / 2);
      pivot.add(link);
    }

    // Pingente metálico pontiagudo com núcleo cristalino roxo
    const tipHolder = new THREE.Group();
    tipHolder.position.y = -chainLength - 0.15;

    const metalStake = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.15, 0).scale(0.6, 1.65, 0.42),
      mats.antiqueTrimMetal
    );
    tipHolder.add(metalStake);

    const gemCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.085, 0).scale(0.58, 1.5, 0.52),
      mats.runeEmissiveMat
    );
    tipHolder.add(gemCore);

    pivot.add(tipHolder);
    return pivot;
  }

  /**
   * Constrói UMA asa completa ultra-detalhada
   */
  function buildSingleWing(isLeft = false) {
    const mats = getMaterials();
    const wingRoot = new THREE.Group();
    wingRoot.name = isLeft ? 'ArcaneWingLeft' : 'ArcaneWingRight';

    const sideSign = isLeft ? -1 : 1;
    const wingBody = new THREE.Group();
    wingBody.scale.x = sideSign;
    wingRoot.add(wingBody);

    // 1. OMBREIRA COM CRISTAL CENTRAL E ENGASTE
    const crest = createOrnateShoulderCrest();
    crest.position.set(0.56, 0.74, 0.16);
    wingBody.add(crest);

    // 2. ARCO ÓSSEO/METÁLICO PRINCIPAL (ESPINHA EXTERNA EM FOICE)
    const primaryArchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, 0.34, 0.06),
      new THREE.Vector3(0.62, 0.82, 0.08),
      new THREE.Vector3(1.62, 0.96, 0.02),
      new THREE.Vector3(2.54, 0.34, -0.08),
      new THREE.Vector3(3.02, -0.72, -0.16),
      new THREE.Vector3(2.94, -1.88, -0.22),
      new THREE.Vector3(2.42, -2.76, -0.26)
    ]);

    // Núcleo estrutural contínuo com sulco rúnico brilhante
    const coreTube = new THREE.Mesh(
      new THREE.TubeGeometry(primaryArchCurve, 32, 0.055, 8, false),
      mats.darkForgedArmor
    );
    wingBody.add(coreTube);

    const runeVeinTube = new THREE.Mesh(
      new THREE.TubeGeometry(primaryArchCurve, 32, 0.022, 6, false),
      mats.runeEmissiveMat
    );
    runeVeinTube.position.z += 0.042;
    wingBody.add(runeVeinTube);

    // Placas de armadura sobrepostas, chanfradas e rebitadas ao longo do arco
    const numArmorPlates = 24;
    for (let i = 0; i < numArmorPlates; i++) {
      const t = i / (numArmorPlates - 1);
      const pt = primaryArchCurve.getPoint(t);
      const tan = primaryArchCurve.getTangent(t);

      const scaleFactor = (1.0 - t * 0.76) * 0.44 + 0.08;
      const plate = createBeveledArmorPlate(
        scaleFactor,
        scaleFactor * 1.25,
        scaleFactor * 0.32,
        i % 4 === 0 ? mats.antiqueTrimMetal : mats.darkForgedArmor
      );
      plate.position.copy(pt);
      plate.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
      wingBody.add(plate);

      // Rebite metálico na placa
      if (i < numArmorPlates - 3 && i % 2 === 0) {
        const rivet = new THREE.Mesh(
          new THREE.SphereGeometry(scaleFactor * 0.09, 6, 6),
          mats.antiqueTrimMetal
        );
        rivet.position.copy(pt);
        rivet.position.z += scaleFactor * 0.24;
        wingBody.add(rivet);
      }

      // Espinhos curvos salientes na borda externa da asa
      if (i > 2 && i < numArmorPlates - 2 && i % 3 === 0) {
        const claw = new THREE.Mesh(
          new THREE.ConeGeometry(scaleFactor * 0.24, scaleFactor * 1.35, 4),
          mats.antiqueTrimMetal
        );
        claw.position.copy(pt);
        claw.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
        claw.rotateZ(-0.62);
        claw.translateY(scaleFactor * 0.65);
        wingBody.add(claw);
      }
    }

    // 3. ARCO SECUNDÁRIO SUPERIOR E GARRAS INTERNAS DA BASE
    const secondaryUpperCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.65, 0.88, 0.06),
      new THREE.Vector3(1.25, 1.15, 0.04),
      new THREE.Vector3(1.98, 0.88, -0.02)
    ]);
    const upperBlade = new THREE.Mesh(
      new THREE.TubeGeometry(secondaryUpperCurve, 16, 0.045, 5, false),
      mats.antiqueTrimMetal
    );
    wingBody.add(upperBlade);

    // 4. FALANGES ÓSSEAS RADIAIS QUE DIVIDEM A MEMBRANA
    const phalanxCurves = [
      // Falange Interna 1
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.45, 0.64, 0.05),
        new THREE.Vector3(0.28, 0.14, 0.02),
        new THREE.Vector3(0.36, -0.62, -0.03),
        new THREE.Vector3(0.64, -1.32, -0.07)
      ]),
      // Falange Central Longa
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.76, 0.74, 0.05),
        new THREE.Vector3(0.98, 0.04, 0.0),
        new THREE.Vector3(1.16, -0.98, -0.06),
        new THREE.Vector3(1.26, -2.06, -0.13)
      ]),
      // Falange Média-Externa
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.28, 0.86, 0.02),
        new THREE.Vector3(1.74, 0.04, -0.03),
        new THREE.Vector3(1.98, -0.92, -0.09),
        new THREE.Vector3(2.12, -1.84, -0.16)
      ])
    ];

    phalanxCurves.forEach((curve) => {
      const boneMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 20, 0.044, 6, false),
        mats.darkForgedArmor
      );
      wingBody.add(boneMesh);

      const glowRidge = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 20, 0.017, 5, false),
        mats.runeEmissiveMat
      );
      glowRidge.position.z += 0.028;
      wingBody.add(glowRidge);

      // Garra pontiaguda na extremidade inferior de cada falange
      const endPt = curve.getPoint(1.0);
      const endTan = curve.getTangent(1.0);
      const tipSpike = new THREE.Mesh(
        new THREE.ConeGeometry(0.055, 0.24, 4),
        mats.antiqueTrimMetal
      );
      tipSpike.position.copy(endPt);
      tipSpike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), endTan);
      wingBody.add(tipSpike);
    });

    // 5. MEMBRANAS ETÉREAS RASGADAS COM SHADER GLSL (DUPLA CAMADA PARA VOLUME 3D)
    const membraneShape = new THREE.Shape();
    membraneShape.moveTo(0.2, 0.42);
    membraneShape.bezierCurveTo(0.78, 0.86, 1.72, 0.96, 2.48, 0.32);
    membraneShape.bezierCurveTo(2.94, -0.38, 3.02, -1.62, 2.42, -2.72);

    // Recortes profundos em arco na base da asa
    membraneShape.quadraticCurveTo(2.38, -1.92, 2.12, -1.82);
    membraneShape.quadraticCurveTo(1.82, -1.36, 1.62, -1.62);
    membraneShape.quadraticCurveTo(1.42, -1.46, 1.26, -2.04);
    membraneShape.quadraticCurveTo(0.98, -1.38, 0.78, -1.52);
    membraneShape.quadraticCurveTo(0.68, -1.18, 0.64, -1.3);
    membraneShape.quadraticCurveTo(0.34, -0.88, 0.22, -0.34);
    membraneShape.closePath();

    const membraneGeo = new THREE.ShapeGeometry(membraneShape, 28);
    const posAttr = membraneGeo.attributes.position;
    const uvAttr = membraneGeo.attributes.uv;

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);

      // Normaliza UVs para o shader procedural
      const u = THREE.MathUtils.clamp((vx - 0.15) / 2.9, 0, 1);
      const v = THREE.MathUtils.clamp((0.98 - vy) / 3.75, 0, 1);
      uvAttr.setXY(i, u, 1.0 - v);

      // Curvatura 3D côncava natural de asa
      const curveZ = -Math.pow(vx * 0.27, 2) * 0.4 + Math.sin(vx * 2.5) * 0.045 - Math.abs(vy) * 0.04;
      posAttr.setZ(i, curveZ);
    }
    membraneGeo.computeVertexNormals();

    // Camada principal da membrana GLSL
    const mainMembrane = new THREE.Mesh(membraneGeo, mats.membraneShaderMat);
    wingBody.add(mainMembrane);

    // Camada secundária de aura/profundidade deslocada levemente para trás
    const auraMembrane = new THREE.Mesh(membraneGeo, mats.membraneShaderMat);
    auraMembrane.position.set(0.03, -0.03, -0.035);
    auraMembrane.scale.set(1.015, 1.015, 1.0);
    wingBody.add(auraMembrane);

    // 6. CORRENTES METÁLICAS ELO POR ELO + PINGENTES COM FÍSICA DE PÊNDULO
    const chainInner = createChainCatenary(
      new THREE.Vector3(0.45, 0.56, 0.16),
      new THREE.Vector3(0.26, 0.2, 0.2),
      new THREE.Vector3(0.14, 0.34, 0.14),
      11
    );
    wingBody.add(chainInner);

    const chainOuter = createChainCatenary(
      new THREE.Vector3(0.66, 0.58, 0.17),
      new THREE.Vector3(1.22, 0.24, 0.18),
      new THREE.Vector3(1.74, 0.6, 0.1),
      16
    );
    wingBody.add(chainOuter);

    const pendantLong = createChainPendant(0.72, 9);
    pendantLong.position.set(0.42, 0.52, 0.17);
    wingBody.add(pendantLong);

    const pendantShort = createChainPendant(0.5, 6);
    pendantShort.position.set(0.73, 0.54, 0.17);
    wingBody.add(pendantShort);

    // 7. SISTEMA DUPLO DE PARTÍCULAS 3D (BRASAS NEON + FUMAÇA ETÉREA SOMBRIA)
    const emberCount = 85;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    const emberData = [];

    for (let i = 0; i < emberCount; i++) {
      const t = Math.random();
      const basePt = primaryArchCurve.getPoint(t);
      emberPos[i * 3] = basePt.x + (Math.random() - 0.5) * 0.35;
      emberPos[i * 3 + 1] = basePt.y + (Math.random() - 0.5) * 0.35;
      emberPos[i * 3 + 2] = basePt.z + (Math.random() - 0.5) * 0.2;

      emberData.push({
        basePt: basePt.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.55 + Math.random() * 0.95,
        life: Math.random()
      });
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));

    const emberMat = new THREE.PointsMaterial({
      size: 0.32,
      map: mats.emberTex,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xe879f9
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    emberPoints.userData.pData = emberData;
    wingBody.add(emberPoints);

    // Volutas de fumaça sombria ao redor da asa
    const smokeCount = 45;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    const smokeData = [];

    for (let i = 0; i < smokeCount; i++) {
      const t = Math.random();
      const basePt = primaryArchCurve.getPoint(t);
      smokePos[i * 3] = basePt.x;
      smokePos[i * 3 + 1] = basePt.y;
      smokePos[i * 3 + 2] = basePt.z - 0.05;

      smokeData.push({
        basePt: basePt.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.45,
        life: Math.random()
      });
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));

    const smokeMat = new THREE.PointsMaterial({
      size: 0.85,
      map: mats.smokeTex,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending,
      depthWrite: false,
      color: 0x6b21a8
    });
    const smokePoints = new THREE.Points(smokeGeo, smokeMat);
    smokePoints.userData.pData = smokeData;
    wingBody.add(smokePoints);

    wingRoot.userData = {
      crestGem: crest.userData.gemMesh,
      chainInner,
      chainOuter,
      pendantLong,
      pendantShort,
      emberPoints,
      smokePoints
    };

    return wingRoot;
  }

  /**
   * Cria o par completo de Asas Arcanas pronto para acoplar ao personagem
   */
  function createWingsPair(options = {}) {
    const scale = options.scale || 1.0;
    const initialEnergy = options.energyIntensity || 1.0;
    const mats = getMaterials();

    const wingsContainer = new THREE.Group();
    wingsContainer.name = 'ArcaneWingsPair';
    wingsContainer.scale.setScalar(scale);

    // Pivôs nos ombros para articulação realista
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-0.18, 0.1, 0);
    const leftWing = buildSingleWing(true);
    leftPivot.add(leftWing);
    wingsContainer.add(leftPivot);

    const rightPivot = new THREE.Group();
    rightPivot.position.set(0.18, 0.1, 0);
    const rightWing = buildSingleWing(false);
    rightPivot.add(rightWing);
    wingsContainer.add(rightPivot);

    // Luzes pontuais roxas acopladas a cada asa
    let leftLight = null;
    let rightLight = null;
    if (options.withLight !== false) {
      leftLight = new THREE.PointLight(0xa855f7, 1.4, 5.5);
      leftLight.position.set(-1.1, 0.2, 0.35);
      wingsContainer.add(leftLight);

      rightLight = new THREE.PointLight(0xa855f7, 1.4, 5.5);
      rightLight.position.set(1.1, 0.2, 0.35);
      wingsContainer.add(rightLight);
    }

    let currentEnergy = initialEnergy;

    // Método para ajustar intensidade da energia/chamas em tempo real
    wingsContainer.userData.setEnergyIntensity = function (val) {
      currentEnergy = val;
      mats.membraneShaderMat.uniforms.uEnergy.value = val;
      leftWing.userData.emberPoints.material.opacity = Math.min(1.0, 0.85 * val);
      rightWing.userData.emberPoints.material.opacity = Math.min(1.0, 0.85 * val);
    };
    wingsContainer.userData.setEnergyIntensity(initialEnergy);

    // Loop de animação e física de pêndulo
    wingsContainer.userData.update = function (elapsedTime, deltaTime = 0.016, state = 'idle') {
      let flapFreq = 1.85;
      let flapAmpY = 0.19;
      let flapAmpZ = 0.06;
      let sweepBack = 0.24;

      if (state === 'fly') {
        flapFreq = 4.8;
        flapAmpY = 0.52;
        flapAmpZ = 0.15;
        sweepBack = 0.32;
      } else if (state === 'sprint') {
        flapFreq = 7.5;
        flapAmpY = 0.38;
        flapAmpZ = 0.2;
        sweepBack = 0.65;
      } else if (state === 'static') {
        flapFreq = 0.0;
        flapAmpY = 0.0;
        flapAmpZ = 0.0;
        sweepBack = 0.2;
      }

      // Atualiza uniforms do Shader GLSL
      mats.membraneShaderMat.uniforms.uTime.value = elapsedTime;
      mats.membraneShaderMat.uniforms.uFlapSpeed.value = flapFreq * 0.25;

      const wave = flapFreq > 0 ? Math.sin(elapsedTime * flapFreq) : 0;
      const secondaryWave = flapFreq > 0 ? Math.cos(elapsedTime * flapFreq - 0.55) : 0;

      // Rotação nos pivôs dos ombros
      rightPivot.rotation.y = -sweepBack - wave * flapAmpY;
      rightPivot.rotation.z = secondaryWave * flapAmpZ;

      leftPivot.rotation.y = sweepBack + wave * flapAmpY;
      leftPivot.rotation.z = -secondaryWave * flapAmpZ;

      // Física de pêndulo para correntes e pingentes
      const pendulumZ = Math.sin(elapsedTime * (flapFreq || 1.6) - 0.85) * ((flapAmpY || 0.12) * 0.52);
      const pendulumX = Math.cos(elapsedTime * 2.4) * 0.07 + (state === 'sprint' ? -0.25 : 0);

      [leftWing.userData, rightWing.userData].forEach((wData) => {
        wData.pendantLong.rotation.z = pendulumZ;
        wData.pendantLong.rotation.x = pendulumX;

        wData.pendantShort.rotation.z = pendulumZ * 1.18;
        wData.pendantShort.rotation.x = pendulumX * 0.85;

        // Oscilação sutil das correntes catenárias
        wData.chainOuter.rotation.x = pendulumX * 0.65;
        wData.chainInner.rotation.x = pendulumX * 0.5;

        // Pulso nos cristais das ombreiras
        const pulse = (1.55 + Math.sin(elapsedTime * 3.6) * 0.55) * currentEnergy;
        wData.crestGem.material.emissiveIntensity = pulse;

        // Atualiza brasas
        const ePts = wData.emberPoints;
        const ePos = ePts.geometry.attributes.position;
        const eList = ePts.userData.pData;
        for (let i = 0; i < eList.length; i++) {
          const d = eList[i];
          d.life += deltaTime * d.speed;
          if (d.life > 1.0) d.life -= 1.0;

          ePos.setXYZ(
            i,
            d.basePt.x + Math.sin(elapsedTime * 3.2 + d.phase) * 0.11,
            d.basePt.y + d.life * 0.58,
            d.basePt.z + Math.cos(elapsedTime * 2.6 + d.phase) * 0.08
          );
        }
        ePos.needsUpdate = true;

        // Atualiza fumaça sombria
        const sPts = wData.smokePoints;
        const sPos = sPts.geometry.attributes.position;
        const sList = sPts.userData.pData;
        for (let i = 0; i < sList.length; i++) {
          const d = sList[i];
          d.life += deltaTime * d.speed;
          if (d.life > 1.0) d.life -= 1.0;

          sPos.setXYZ(
            i,
            d.basePt.x + Math.cos(elapsedTime * 1.8 + d.phase) * 0.16,
            d.basePt.y + d.life * 0.72,
            d.basePt.z - 0.05 + Math.sin(elapsedTime * 1.5 + d.phase) * 0.1
          );
        }
        sPos.needsUpdate = true;
      });

      if (leftLight && rightLight) {
        const lInt = (1.35 + Math.sin(elapsedTime * 3.6) * 0.4) * currentEnergy;
        leftLight.intensity = lInt;
        rightLight.intensity = lInt;
      }
    };

    return wingsContainer;
  }

  return {
    create: createWingsPair
  };
})();


  return ArcaneWingSystem; })(T3);
  COSM.asa_abismo = { nome: 'Asas do Abismo Etéreo', icone: IC('cosm_abismo'), loja: 1, preco: 6500, desc: '+50% de velocidade de voo e +20% de dano. Armadura demoníaca com cristais, correntes, membranas de energia viva, brasas e fumaça.', b: { voo: 1.5, dano: 1.2 }, cor: '#d946ef', cor2: '#7e22ce' };
  const ABISMO = (() => { const G = grp(ASAS, 0, 0.06, -0.06); G.visible = false; const S = 0.36; const W = ASAS_ABISMO_MOD.create({ scale: S, energyIntensity: 1.0, withLight: false }); G.add(W);
    W.traverse(o => { if (o.isPoints) o.material.size *= S * 0.9; if (o.isMesh) o.castShadow = true; });
    const A = { R: new T3.Group(), L: new T3.Group() }; ASAT.asa_abismo = { g: G, A }; return { G, W }; })();
  mostraAsas();
  function abismoFrame(dt) { if (!ABISMO.G.visible) return; const st = voando ? (vel > 8 ? 'sprint' : 'fly') : (vel > 4.2 ? 'sprint' : 'idle'); try { ABISMO.W.userData.update(gT, dt, st); } catch (e) {} }
