  // ===== Pilares do Vazio Arcano (modelo 3D enviado pelo usuário, adaptado) =====
  const PILAR_MOD = (function (THREE) {
const ArcanePillarAssets = (function () {
  // Cache interno de texturas e materiais compartilhados para otimização de GPU
  let sharedResources = null;

  /**
   * Gera textura procedural de obsidiana escura com veios/rachaduras arcanas roxas brilhantes
   */
  function createCrackedStoneTextures() {
    const size = 512;
    const diffCanvas = document.createElement('canvas');
    const emCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    diffCanvas.width = emCanvas.width = bumpCanvas.width = size;
    diffCanvas.height = emCanvas.height = bumpCanvas.height = size;

    const dCtx = diffCanvas.getContext('2d');
    const eCtx = emCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    // Base obsidiana escura
    dCtx.fillStyle = '#120d1d';
    dCtx.fillRect(0, 0, size, size);

    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Ruído granular de pedra
    for (let i = 0; i < 4500; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 3 + 0.5;
      const shade = Math.floor(14 + Math.random() * 24);
      dCtx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.7)}, ${Math.floor(shade * 1.35)})`;
      dCtx.fillRect(x, y, r, r);

      const bVal = 110 + Math.floor(Math.random() * 45);
      bCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
      bCtx.fillRect(x, y, r, r);
    }

    // Desenha fissuras arcanas ramificadas (raios de energia na pedra)
    function drawCrack(ctx, startX, startY, angle, length, width, color, blur) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;

      ctx.beginPath();
      let x = startX;
      let y = startY;
      ctx.moveTo(x, y);

      const steps = Math.floor(length / 12);
      let currAngle = angle;
      for (let s = 0; s < steps; s++) {
        currAngle += (Math.random() - 0.5) * 0.85;
        x += Math.cos(currAngle) * 12;
        y += Math.sin(currAngle) * 12;
        ctx.lineTo(x, y);

        if (Math.random() < 0.22 && width > 1.2) {
          drawCrack(ctx, x, y, currAngle + (Math.random() > 0.5 ? 0.7 : -0.7), length * 0.45, width * 0.6, color, blur * 0.7);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // 14 fissuras principais com brilho duplo (halo roxo + núcleo magenta claro)
    for (let c = 0; c < 14; c++) {
      const sx = Math.random() * size;
      const sy = Math.random() * size;
      const ang = Math.random() * Math.PI * 2;
      const len = 90 + Math.random() * 140;

      // Emissive halo
      drawCrack(eCtx, sx, sy, ang, len, 3.2, '#9333ea', 12);
      drawCrack(eCtx, sx, sy, ang, len, 1.3, '#f0abfc', 4);

      // Diffuse & Bump
      drawCrack(dCtx, sx, sy, ang, len, 2.5, '#7e22ce', 6);
      drawCrack(bCtx, sx, sy, ang, len, 3.0, '#181818', 2);
    }

    const map = new THREE.CanvasTexture(diffCanvas);
    const emissiveMap = new THREE.CanvasTexture(emCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);

    [map, emissiveMap, bumpMap].forEach((t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
    });

    return { map, emissiveMap, bumpMap };
  }

  /**
   * Gera textura transparente com runas arcanas brilhantes para o anel flutuante
   */
  function createRunicRingTexture() {
    const width = 1024;
    const height = 128;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    // Linhas de borda neon superior e inferior do anel
    ctx.strokeStyle = '#d946ef';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#c026d3';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(width, 14);
    ctx.moveTo(0, height - 14);
    ctx.lineTo(width, height - 14);
    ctx.stroke();

    // Linha fina interna branca/lilás
    ctx.strokeStyle = '#fae8ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(width, 14);
    ctx.moveTo(0, height - 14);
    ctx.lineTo(width, height - 14);
    ctx.stroke();

    // Desenha 24 glifos rúnicos estilizados ao longo da circunferência
    const glyphCount = 24;
    const step = width / glyphCount;

    for (let i = 0; i < glyphCount; i++) {
      const cx = i * step + step * 0.5;
      const cy = height * 0.5;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = '#e879f9';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 16;

      drawArcaneGlyph(ctx, i % 8, 22);

      // Núcleo incandescente branco-rosado
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 4;
      drawArcaneGlyph(ctx, i % 8, 22);

      // Pequeno ponto separador entre runas
      ctx.fillStyle = '#f0abfc';
      ctx.beginPath();
      ctx.arc(step * 0.5, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  /**
   * Gera textura vertical de coluna rúnica para o Pilar II (Direita)
   */
  function createVerticalRuneStripTexture() {
    const width = 256;
    const height = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fundo pedra escura
    ctx.fillStyle = '#110b1c';
    ctx.fillRect(0, 0, width, height);

    // Canais laterais de energia roxa neon
    const drawChannel = (x) => {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 10;
      ctx.shadowColor = '#9333ea';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();

      ctx.strokeStyle = '#f5d0fe';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    };

    drawChannel(26);
    drawChannel(width - 26);

    // 6 runas verticais empilhadas no centro
    const runeCount = 6;
    const spacing = (height - 180) / runeCount;
    for (let i = 0; i < runeCount; i++) {
      const cy = 130 + i * spacing;
      ctx.save();
      ctx.translate(width * 0.5, cy);

      ctx.strokeStyle = '#c026d3';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 22;
      drawArcaneGlyph(ctx, (i + 2) % 8, 34);

      ctx.strokeStyle = '#fdf4ff';
      ctx.lineWidth = 2.5;
      drawArcaneGlyph(ctx, (i + 2) % 8, 34);
      ctx.restore();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Desenha símbolos geométricos estilo runa arcana
   */
  function drawArcaneGlyph(ctx, type, r) {
    ctx.beginPath();
    switch (type) {
      case 0: // Chevron duplo
        ctx.moveTo(-r * 0.6, -r * 0.2);
        ctx.lineTo(0, -r * 0.9);
        ctx.lineTo(r * 0.6, -r * 0.2);
        ctx.moveTo(-r * 0.5, r * 0.5);
        ctx.lineTo(0, -r * 0.15);
        ctx.lineTo(r * 0.5, r * 0.5);
        ctx.moveTo(0, -r * 0.9);
        ctx.lineTo(0, r * 0.9);
        break;
      case 1: // Losango partido
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.65, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r * 0.65, 0);
        ctx.closePath();
        ctx.moveTo(-r * 0.65, 0);
        ctx.lineTo(r * 0.65, 0);
        break;
      case 2: // Tridente rúnico
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);
        ctx.moveTo(-r * 0.6, -r * 0.5);
        ctx.lineTo(0, 0);
        ctx.lineTo(r * 0.6, -r * 0.5);
        break;
      case 3: // Ampulheta arcana
        ctx.moveTo(-r * 0.6, -r * 0.8);
        ctx.lineTo(r * 0.6, r * 0.8);
        ctx.moveTo(r * 0.6, -r * 0.8);
        ctx.lineTo(-r * 0.6, r * 0.8);
        ctx.moveTo(-r * 0.6, -r * 0.8);
        ctx.lineTo(r * 0.6, -r * 0.8);
        break;
      case 4: // Espiral angular
        ctx.moveTo(-r * 0.5, r * 0.8);
        ctx.lineTo(-r * 0.5, -r * 0.8);
        ctx.lineTo(r * 0.5, -r * 0.2);
        ctx.lineTo(-r * 0.1, r * 0.3);
        ctx.lineTo(r * 0.6, r * 0.8);
        break;
      case 5: // Runa Othala / Laço
        ctx.moveTo(-r * 0.6, r * 0.9);
        ctx.lineTo(r * 0.5, -r * 0.2);
        ctx.lineTo(0, -r * 0.9);
        ctx.lineTo(-r * 0.5, -r * 0.2);
        ctx.lineTo(r * 0.6, r * 0.9);
        break;
      case 6: // Cruz solar inclinada
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);
        ctx.moveTo(-r * 0.7, -r * 0.3);
        ctx.lineTo(r * 0.7, r * 0.3);
        ctx.moveTo(-r * 0.7, r * 0.3);
        ctx.lineTo(r * 0.7, -r * 0.3);
        break;
      default: // Seta ascendente
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);
        ctx.moveTo(-r * 0.65, -r * 0.2);
        ctx.lineTo(0, -r);
        ctx.lineTo(r * 0.65, -r * 0.2);
        ctx.moveTo(-r * 0.4, r * 0.5);
        ctx.lineTo(r * 0.4, r * 0.5);
        break;
    }
    ctx.stroke();
  }

  /**
   * Gera textura suave de chama/brasa para partículas
   */
  function createFlameParticleTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 240, 255, 1)');
    grad.addColorStop(0.25, 'rgba(217, 70, 239, 0.9)');
    grad.addColorStop(0.6, 'rgba(126, 34, 206, 0.4)');
    grad.addColorStop(1, 'rgba(88, 28, 135, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Inicializa e retorna os materiais compartilhados
   */
  function getMaterials() {
    if (sharedResources) return sharedResources;

    const stoneTex = createCrackedStoneTextures();
    const ringTex = createRunicRingTexture();
    const verticalRuneTex = createVerticalRuneStripTexture();
    const flameTex = createFlameParticleTexture();

    const obsidianStone = new THREE.MeshStandardMaterial({
      color: 0x1e1530,
      map: stoneTex.map,
      emissive: 0x9333ea,
      emissiveMap: stoneTex.emissiveMap,
      emissiveIntensity: 1.45,
      bumpMap: stoneTex.bumpMap,
      bumpScale: 0.04,
      roughness: 0.62,
      metalness: 0.22
    });

    const darkBasalt = new THREE.MeshStandardMaterial({
      color: 0x130d21,
      roughness: 0.55,
      metalness: 0.35
    });

    const antiqueGold = new THREE.MeshStandardMaterial({
      color: 0xc99649,
      emissive: 0x3b2307,
      emissiveIntensity: 0.25,
      roughness: 0.34,
      metalness: 0.86
    });

    const crystalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      emissive: 0x9333ea,
      emissiveIntensity: 1.75,
      roughness: 0.12,
      metalness: 0.15,
      flatShading: true
    });

    const neonVeinMaterial = new THREE.MeshBasicMaterial({
      color: 0xd946ef
    });

    const neonCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5d0fe
    });

    const runicRingMaterial = new THREE.MeshBasicMaterial({
      map: ringTex,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const verticalRunePanelMaterial = new THREE.MeshStandardMaterial({
      map: verticalRuneTex,
      emissive: 0xc026d3,
      emissiveMap: verticalRuneTex,
      emissiveIntensity: 1.6,
      roughness: 0.4,
      metalness: 0.2
    });

    sharedResources = {
      obsidianStone,
      darkBasalt,
      antiqueGold,
      crystalMaterial,
      neonVeinMaterial,
      neonCoreMaterial,
      runicRingMaterial,
      verticalRunePanelMaterial,
      flameTex
    };

    return sharedResources;
  }

  /**
   * Cria um cristal em formato de losango facetado com moldura dourada ornamentada
   */
  function createFramedDiamondCrystal(scale = 1) {
    const mats = getMaterials();
    const group = new THREE.Group();

    // Cristal losango facetado (octaedro alongado e achatado)
    const crystalGeo = new THREE.OctahedronGeometry(0.42 * scale, 0);
    crystalGeo.scale(0.78, 1.32, 0.45);
    const crystalMesh = new THREE.Mesh(crystalGeo, mats.crystalMaterial.clone());
    crystalMesh.position.z = 0.06 * scale;
    group.add(crystalMesh);

    // Núcleo interno brilhante
    const coreGeo = new THREE.OctahedronGeometry(0.22 * scale, 0);
    coreGeo.scale(0.75, 1.3, 0.5);
    const coreMesh = new THREE.Mesh(coreGeo, mats.neonCoreMaterial);
    coreMesh.position.z = 0.08 * scale;
    group.add(coreMesh);

    // Moldura dourada em formato de losango usando 4 barras chanfradas + pontas
    const frameGroup = new THREE.Group();
    const barLen = 0.62 * scale;
    const barThick = 0.085 * scale;
    const barDepth = 0.14 * scale;

    const angles = [Math.PI * 0.28, -Math.PI * 0.28, Math.PI * 0.72, -Math.PI * 0.72];
    const offsets = [
      [0.19 * scale, 0.29 * scale],
      [-0.19 * scale, 0.29 * scale],
      [0.19 * scale, -0.29 * scale],
      [-0.19 * scale, -0.29 * scale]
    ];

    for (let i = 0; i < 4; i++) {
      const barGeo = new THREE.BoxGeometry(barThick, barLen, barDepth);
      const bar = new THREE.Mesh(barGeo, mats.antiqueGold);
      bar.position.set(offsets[i][0], offsets[i][1], 0.04 * scale);
      bar.rotation.z = angles[i];
      frameGroup.add(bar);
    }

    // Ornamentos pontiagudos superior e inferior da moldura
    const tipGeo = new THREE.ConeGeometry(0.11 * scale, 0.28 * scale, 4);
    const topTip = new THREE.Mesh(tipGeo, mats.antiqueGold);
    topTip.position.set(0, 0.62 * scale, 0.05 * scale);
    topTip.rotation.y = Math.PI / 4;
    frameGroup.add(topTip);

    const botTip = new THREE.Mesh(tipGeo, mats.antiqueGold);
    botTip.position.set(0, -0.62 * scale, 0.05 * scale);
    botTip.rotation.z = Math.PI;
    botTip.rotation.y = Math.PI / 4;
    frameGroup.add(botTip);

    // Garras laterais douradas
    const sideClawGeo = new THREE.ConeGeometry(0.08 * scale, 0.2 * scale, 4);
    const leftClaw = new THREE.Mesh(sideClawGeo, mats.antiqueGold);
    leftClaw.position.set(-0.41 * scale, 0, 0.05 * scale);
    leftClaw.rotation.z = Math.PI / 2;
    frameGroup.add(leftClaw);

    const rightClaw = new THREE.Mesh(sideClawGeo, mats.antiqueGold);
    rightClaw.position.set(0.41 * scale, 0, 0.05 * scale);
    rightClaw.rotation.z = -Math.PI / 2;
    frameGroup.add(rightClaw);

    group.add(frameGroup);
    group.userData.crystalMesh = crystalMesh;
    return group;
  }

  /**
   * Cria o anel rúnico flutuante com aura de energia
   */
  function createFloatingRunicHalo(radius = 1.48, height = 0.28) {
    const mats = getMaterials();
    const haloGroup = new THREE.Group();

    // Cilindro aberto com textura rúnica aditiva
    const ringGeo = new THREE.CylinderGeometry(radius, radius, height, 48, 1, true);
    const ringMesh = new THREE.Mesh(ringGeo, mats.runicRingMaterial);
    haloGroup.add(ringMesh);

    // Anel fino interno de energia contínua (Torus)
    const torusGeo = new THREE.TorusGeometry(radius * 0.96, 0.018, 8, 64);
    torusGeo.rotateX(Math.PI / 2);
    const torusTop = new THREE.Mesh(torusGeo, mats.neonVeinMaterial);
    torusTop.position.y = height * 0.45;
    haloGroup.add(torusTop);

    const torusBot = new THREE.Mesh(torusGeo, mats.neonVeinMaterial);
    torusBot.position.y = -height * 0.45;
    haloGroup.add(torusBot);

    return haloGroup;
  }

  /**
   * Cria sistema de partículas de chamas e brasas arcanas subindo ao redor do pilar
   */
  function createArcaneFlamesSystem(pillarHeight = 5.6, baseRadius = 1.35) {
    const mats = getMaterials();
    const particleCount = 110;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = baseRadius * (0.65 + Math.random() * 0.55);
      const y = Math.random() * pillarHeight;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities.push({
        angle,
        radius,
        speedY: 0.45 + Math.random() * 0.75,
        swirlSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.8),
        maxY: pillarHeight + 0.5
      });
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.38,
      map: mats.flameTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xd946ef
    });

    const points = new THREE.Points(geometry, material);
    points.userData.velocities = velocities;
    points.userData.phases = phases;
    points.userData.baseRadius = baseRadius;
    return points;
  }

  /**
   * Atualiza partículas de chama a cada frame
   */
  function updateParticles(points, time, delta) {
    if (!points || !points.visible) return;
    const posAttr = points.geometry.attributes.position;
    const vels = points.userData.velocities;
    const phases = points.userData.phases;

    for (let i = 0; i < vels.length; i++) {
      const v = vels[i];
      let y = posAttr.getY(i) + v.speedY * delta;
      v.angle += v.swirlSpeed * delta;

      if (y > v.maxY) {
        y = 0.05;
      }

      // Afunila levemente perto do topo
      const heightFactor = 1.0 - (y / v.maxY) * 0.22;
      const wobble = Math.sin(time * 2.5 + phases[i]) * 0.08;
      const r = v.radius * heightFactor + wobble;

      posAttr.setXYZ(i, Math.cos(v.angle) * r, y, Math.sin(v.angle) * r);
    }
    posAttr.needsUpdate = true;
  }

  /**
   * =========================================================================
   * PILAR I (ESQUERDA): Pilar Estriado com Cristal Diamante Central e Coroa
   * =========================================================================
   */
  function buildLeftPillar() {
    const mats = getMaterials();
    const pillar = new THREE.Group();
    pillar.name = 'ArcanePillarLeft';

    const crystals = [];

    // 1. BASE OCTOGONAL ESCALONADA
    const basePlinth1 = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.72, 0.26, 8), mats.obsidianStone);
    basePlinth1.position.y = 0.13;
    basePlinth1.rotation.y = Math.PI / 8;
    pillar.add(basePlinth1);

    // Anel neon na base
    const baseGlowRing = new THREE.Mesh(new THREE.CylinderGeometry(1.57, 1.57, 0.04, 8), mats.neonVeinMaterial);
    baseGlowRing.position.y = 0.27;
    baseGlowRing.rotation.y = Math.PI / 8;
    pillar.add(baseGlowRing);

    const basePlinth2 = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.48, 0.34, 8), mats.obsidianStone);
    basePlinth2.position.y = 0.44;
    basePlinth2.rotation.y = Math.PI / 8;
    pillar.add(basePlinth2);

    const baseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.18, 0.32, 8), mats.darkBasalt);
    baseCollar.position.y = 0.77;
    baseCollar.rotation.y = Math.PI / 8;
    pillar.add(baseCollar);

    // Moldura dourada da base com pequeno cristal
    const goldBaseRing = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.06, 0.12, 8), mats.antiqueGold);
    goldBaseRing.position.y = 0.94;
    goldBaseRing.rotation.y = Math.PI / 8;
    pillar.add(goldBaseRing);

    // Pequenos losangos dourados nos 4 lados da base
    for (let i = 0; i < 4; i++) {
      const sideGroup = new THREE.Group();
      sideGroup.rotation.y = (i * Math.PI) / 2;

      const miniGem = createFramedDiamondCrystal(0.36);
      miniGem.position.set(0, 0.85, 1.04);
      miniGem.rotation.x = -0.18;
      sideGroup.add(miniGem);
      crystals.push(miniGem.userData.crystalMesh);

      pillar.add(sideGroup);
    }

    // 2. CORPO / FUSTE ESTRIADO (SHAFT)
    const shaftHeight = 2.95;
    const shaftY = 0.95 + shaftHeight * 0.5;
    const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.82, shaftHeight, 8), mats.obsidianStone);
    mainShaft.position.y = shaftY;
    mainShaft.rotation.y = Math.PI / 8;
    pillar.add(mainShaft);

    // Nervuras verticais em relevo + canais brilhantes roxos ao redor do fuste
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      const ribGroup = new THREE.Group();
      ribGroup.rotation.y = angle;

      // Nervura de pedra escura
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.16, shaftHeight - 0.1, 0.14), mats.darkBasalt);
      rib.position.set(0, shaftY, 0.78);
      ribGroup.add(rib);

      // Filete dourado fino na nervura
      const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, shaftHeight - 0.15, 0.16), mats.antiqueGold);
      goldTrim.position.set(0, shaftY, 0.78);
      ribGroup.add(goldTrim);

      // Canal de energia roxa entre nervuras
      const veinAngle = angle + Math.PI / 8;
      const veinGroup = new THREE.Group();
      veinGroup.rotation.y = veinAngle;
      const vein = new THREE.Mesh(new THREE.BoxGeometry(0.045, shaftHeight - 0.2, 0.04), mats.neonVeinMaterial);
      vein.position.set(0, shaftY, 0.75);
      veinGroup.add(vein);
      pillar.add(veinGroup);

      pillar.add(ribGroup);
    }

    // 3. CRISTAIS DIAMANTE CENTRAIS NO MEIO DO FUSTE (FRENTE E VERSO)
    for (let i = 0; i < 2; i++) {
      const centerHolder = new THREE.Group();
      centerHolder.rotation.y = i * Math.PI;

      const centerCrystal = createFramedDiamondCrystal(0.92);
      centerCrystal.position.set(0, shaftY + 0.05, 0.86);
      centerHolder.add(centerCrystal);
      crystals.push(centerCrystal.userData.crystalMesh);

      pillar.add(centerHolder);
    }

    // 4. PESCOÇO E CAPITEL SUPERIOR
    const neckY = 3.98;
    const neckGold = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.84, 0.24, 8), mats.antiqueGold);
    neckGold.position.y = neckY;
    neckGold.rotation.y = Math.PI / 8;
    pillar.add(neckGold);

    const neckStone = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.42, 8), mats.obsidianStone);
    neckStone.position.y = neckY + 0.32;
    neckStone.rotation.y = Math.PI / 8;
    pillar.add(neckStone);

    // Capitel alargado
    const capFlare = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 0.95, 0.56, 8), mats.obsidianStone);
    capFlare.position.y = neckY + 0.8;
    capFlare.rotation.y = Math.PI / 8;
    pillar.add(capFlare);

    // Borda superior dourada do capitel
    const capRim = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.38, 0.1, 8), mats.antiqueGold);
    capRim.position.y = neckY + 1.1;
    capRim.rotation.y = Math.PI / 8;
    pillar.add(capRim);

    // Coroa cristalina no topo absoluto
    const crownSpire = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.65, 6), mats.crystalMaterial);
    crownSpire.position.y = neckY + 1.42;
    pillar.add(crownSpire);
    crystals.push(crownSpire);

    // Cristais diamante grandes no capitel superior (Frente e Verso)
    for (let i = 0; i < 2; i++) {
      const topHolder = new THREE.Group();
      topHolder.rotation.y = i * Math.PI;

      const topCrystal = createFramedDiamondCrystal(1.05);
      topCrystal.position.set(0, neckY + 0.85, 1.24);
      topCrystal.rotation.x = -0.15;
      topHolder.add(topCrystal);
      crystals.push(topCrystal.userData.crystalMesh);

      pillar.add(topHolder);
    }

    // 5. ANEL RÚNICO FLUTUANTE AO REDOR DO PESCOÇO
    const runicHalo = createFloatingRunicHalo(1.52, 0.28);
    runicHalo.position.y = neckY + 0.35;
    pillar.add(runicHalo);

    // 6. CHAMAS E PARTÍCULAS ARCANAS
    const flames = createArcaneFlamesSystem(5.6, 1.32);
    pillar.add(flames);

    // Luz pontual arcana local (opcional/integrada)
    const glowLight = { position: { set() {} }, intensity: 0 };
    glowLight.position.set(0, 3.0, 1.2);
    

    // Dados expostos para animação no jogo
    pillar.userData = {
      runicHalo,
      crystals,
      flames,
      glowLight,
      baseHaloY: runicHalo.position.y,
      update: function (elapsedTime, deltaTime = 0.016) {
        runicHalo.rotation.y = elapsedTime * 0.55;
        runicHalo.position.y = this.baseHaloY + Math.sin(elapsedTime * 2.2) * 0.06;

        const pulse = 1.45 + Math.sin(elapsedTime * 3.2) * 0.45;
        for (let i = 0; i < crystals.length; i++) {
          crystals[i].material.emissiveIntensity = pulse;
        }
        glowLight.intensity = 1.5 + Math.sin(elapsedTime * 3.2) * 0.4;

        updateParticles(flames, elapsedTime, deltaTime);
      }
    };

    return pillar;
  }

  /**
   * =========================================================================
   * PILAR II (DIREITA): Pilar com Painel de Runas Verticais e Cristal na Base
   * =========================================================================
   */
  function buildRightPillar() {
    const mats = getMaterials();
    const pillar = new THREE.Group();
    pillar.name = 'ArcanePillarRight';

    const crystals = [];

    // 1. BASE OCTOGONAL ROBUSTA
    const baseStep1 = new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.68, 0.25, 8), mats.obsidianStone);
    baseStep1.position.y = 0.125;
    baseStep1.rotation.y = Math.PI / 8;
    pillar.add(baseStep1);

    const baseNeonRim = new THREE.Mesh(new THREE.CylinderGeometry(1.54, 1.54, 0.045, 8), mats.neonVeinMaterial);
    baseNeonRim.position.y = 0.26;
    baseNeonRim.rotation.y = Math.PI / 8;
    pillar.add(baseNeonRim);

    const baseStep2 = new THREE.Mesh(new THREE.CylinderGeometry(1.24, 1.46, 0.36, 8), mats.obsidianStone);
    baseStep2.position.y = 0.45;
    baseStep2.rotation.y = Math.PI / 8;
    pillar.add(baseStep2);

    const baseStep3 = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.22, 0.45, 8), mats.darkBasalt);
    baseStep3.position.y = 0.85;
    baseStep3.rotation.y = Math.PI / 8;
    pillar.add(baseStep3);

    // Moldura dourada esculpida na transição da base
    const baseGoldCollar = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.12, 0.14, 8), mats.antiqueGold);
    baseGoldCollar.position.y = 1.1;
    baseGoldCollar.rotation.y = Math.PI / 8;
    pillar.add(baseGoldCollar);

    // Cristal diamante grande na parte inferior/base (Frente e Verso, fiel à imagem)
    for (let i = 0; i < 2; i++) {
      const lowerHolder = new THREE.Group();
      lowerHolder.rotation.y = i * Math.PI;

      const lowerCrystal = createFramedDiamondCrystal(0.95);
      lowerCrystal.position.set(0, 1.05, 1.05);
      lowerCrystal.rotation.x = -0.14;
      lowerHolder.add(lowerCrystal);
      crystals.push(lowerCrystal.userData.crystalMesh);

      // Garras laterais douradas envolventes
      const clawGeo = new THREE.BoxGeometry(0.14, 0.72, 0.22);
      const leftWing = new THREE.Mesh(clawGeo, mats.antiqueGold);
      leftWing.position.set(-0.56, 1.12, 0.92);
      leftWing.rotation.z = 0.24;
      lowerHolder.add(leftWing);

      const rightWing = new THREE.Mesh(clawGeo, mats.antiqueGold);
      rightWing.position.set(0.56, 1.12, 0.92);
      rightWing.rotation.z = -0.24;
      lowerHolder.add(rightWing);

      pillar.add(lowerHolder);
    }

    // 2. FUSTE CENTRAL COM PAINÉIS DE RUNAS VERTICAIS
    const shaftHeight = 2.65;
    const shaftY = 1.25 + shaftHeight * 0.5;
    const coreShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.84, shaftHeight, 8), mats.darkBasalt);
    coreShaft.position.y = shaftY;
    coreShaft.rotation.y = Math.PI / 8;
    pillar.add(coreShaft);

    // 4 painéis verticais com coluna de runas brilhantes + moldura dourada
    for (let i = 0; i < 4; i++) {
      const panelGroup = new THREE.Group();
      panelGroup.rotation.y = (i * Math.PI) / 2;

      // Placa rúnica central
      const runePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.56, shaftHeight - 0.35),
        mats.verticalRunePanelMaterial
      );
      runePlane.position.set(0, shaftY + 0.05, 0.76);
      panelGroup.add(runePlane);

      // Pilastras laterais de bronze/ouro enquadrando o painel rúnico
      const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.11, shaftHeight - 0.25, 0.14), mats.antiqueGold);
      frameLeft.position.set(-0.33, shaftY + 0.05, 0.75);
      panelGroup.add(frameLeft);

      const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.11, shaftHeight - 0.25, 0.14), mats.antiqueGold);
      frameRight.position.set(0.33, shaftY + 0.05, 0.75);
      panelGroup.add(frameRight);

      // Detalhe chevron dourado no topo do painel rúnico
      const topBracket = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.26, 4), mats.antiqueGold);
      topBracket.position.set(0, shaftY + shaftHeight * 0.46, 0.76);
      topBracket.rotation.z = Math.PI;
      topBracket.rotation.y = Math.PI / 4;
      panelGroup.add(topBracket);

      pillar.add(panelGroup);
    }

    // 3. PESCOÇO E CAPITEL COROADO MAIS LARGO
    const neckY = 3.95;
    const upperCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.86, 0.35, 8), mats.obsidianStone);
    upperCollar.position.y = neckY + 0.15;
    upperCollar.rotation.y = Math.PI / 8;
    pillar.add(upperCollar);

    const upperGoldTrim = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 0.96, 0.12, 8), mats.antiqueGold);
    upperGoldTrim.position.y = neckY + 0.36;
    upperGoldTrim.rotation.y = Math.PI / 8;
    pillar.add(upperGoldTrim);

    // Capitel em formato de cálice / coroa
    const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(1.44, 0.96, 0.65, 8), mats.obsidianStone);
    crownBase.position.y = neckY + 0.74;
    crownBase.rotation.y = Math.PI / 8;
    pillar.add(crownBase);

    // Abas/ameias douradas no topo do capitel
    const crownRim = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.44, 0.12, 8), mats.antiqueGold);
    crownRim.position.y = neckY + 1.08;
    crownRim.rotation.y = Math.PI / 8;
    pillar.add(crownRim);

    // Núcleo de energia roxa no topo do cálice
    const crownAura = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.8, 0.25, 8), mats.crystalMaterial);
    crownAura.position.y = neckY + 1.15;
    pillar.add(crownAura);
    crystals.push(crownAura);

    // Grande cristal diamante no topo frontal e traseiro
    for (let i = 0; i < 2; i++) {
      const crownHolder = new THREE.Group();
      crownHolder.rotation.y = i * Math.PI;

      const crownCrystal = createFramedDiamondCrystal(1.12);
      crownCrystal.position.set(0, neckY + 0.86, 1.28);
      crownCrystal.rotation.x = -0.16;
      crownHolder.add(crownCrystal);
      crystals.push(crownCrystal.userData.crystalMesh);

      pillar.add(crownHolder);
    }

    // 4. ANEL RÚNICO FLUTUANTE ABAIXO DO CAPITEL
    const runicHalo = createFloatingRunicHalo(1.52, 0.28);
    runicHalo.position.y = neckY + 0.22;
    pillar.add(runicHalo);

    // 5. CHAMAS E PARTÍCULAS ARCANAS
    const flames = createArcaneFlamesSystem(5.6, 1.32);
    pillar.add(flames);

    const glowLight = { position: { set() {} }, intensity: 0 };
    glowLight.position.set(0, 2.8, 1.2);
    

    pillar.userData = {
      runicHalo,
      crystals,
      flames,
      glowLight,
      baseHaloY: runicHalo.position.y,
      update: function (elapsedTime, deltaTime = 0.016) {
        // Gira no sentido oposto ao pilar da esquerda para contraste visual
        runicHalo.rotation.y = -elapsedTime * 0.55;
        runicHalo.position.y = this.baseHaloY + Math.cos(elapsedTime * 2.2) * 0.06;

        const pulse = 1.45 + Math.cos(elapsedTime * 3.2) * 0.45;
        for (let i = 0; i < crystals.length; i++) {
          crystals[i].material.emissiveIntensity = pulse;
        }
        glowLight.intensity = 1.5 + Math.cos(elapsedTime * 3.2) * 0.4;

        updateParticles(flames, elapsedTime, deltaTime);
      }
    };

    return pillar;
  }

  return {
    createLeft: buildLeftPillar,
    createRight: buildRightPillar
  };
})();


  return ArcanePillarAssets; })(T3);
  // ---- habilidade: PILARES DO VAZIO (debuff) ----
  const PIL = { L: null, R: null, on: false, t: 0, dur: 10, x: 0, z: 0, ang: 0, tick: 0, feixe: null, chao: null };
  function pilMonta() { if (PIL.L) return; const S = 0.55; PIL.L = PILAR_MOD.createLeft(); PIL.R = PILAR_MOD.createRight(); [PIL.L, PIL.R].forEach(p => { p.scale.setScalar(S); p.visible = false; world.add(p); p.traverse(o => { if (o.isMesh) o.castShadow = true; }); });
    PIL.feixe = new T3.Mesh(new T3.CylinderGeometry(0.07, 0.07, 1, 10, 1, true), new T3.MeshBasicMaterial({ color: '#e879f9', transparent: true, opacity: 0.8, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false })); PIL.feixe.visible = false; world.add(PIL.feixe);
    PIL.feixe2 = new T3.Mesh(new T3.CylinderGeometry(0.2, 0.2, 1, 10, 1, true), new T3.MeshBasicMaterial({ color: '#9333ea', transparent: true, opacity: 0.3, blending: T3.AdditiveBlending, depthWrite: false, toneMapped: false })); PIL.feixe.add(PIL.feixe2);
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.translate(128, 128); x.strokeStyle = '#e879f9'; x.shadowColor = '#a855f7'; x.shadowBlur = 14; x.lineWidth = 5; x.beginPath(); x.arc(0, 0, 118, 0, 7); x.stroke(); x.lineWidth = 2; x.beginPath(); x.arc(0, 0, 96, 0, 7); x.stroke();
    for (let k = 0; k < 2; k++) { x.beginPath(); for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI * 2 + k * Math.PI / 4; i ? x.lineTo(Math.cos(a) * 96, Math.sin(a) * 96) : x.moveTo(Math.cos(a) * 96, Math.sin(a) * 96); } x.stroke(); } x.beginPath(); x.arc(0, 0, 40, 0, 7); x.stroke();
    const tx = new T3.CanvasTexture(c); tx.colorSpace = T3.SRGBColorSpace; PIL.chao = new T3.Mesh(new T3.PlaneGeometry(1, 1), new T3.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, toneMapped: false })); PIL.chao.rotation.x = -Math.PI / 2; PIL.chao.visible = false; world.add(PIL.chao); }
  function pilaresAtiva() { if (AR.divino !== 'arcano') { aviso('Equipe o Grimório dos Círculos Arcanos.', '#c8a8ff'); return false; } if (PIL.on) return false; if (ARC.st || ARC.lam || ARC.surf) { aviso('Termine a outra habilidade do Grimório primeiro.', '#c8a8ff'); return false; }
    const alvo = maisPerto(20); if (!alvo) { aviso('Nenhum inimigo perto pros Pilares do Vazio.', '#c8b48a'); return false; } pilMonta();
    const p = heroi.position, g = alvo.g.position; PIL.x = g.x; PIL.z = g.z; PIL.ang = Math.atan2(g.x - p.x, g.z - p.z); PIL.on = true; PIL.t = 0; PIL.tick = 0;
    const px = Math.cos(PIL.ang) * 2.6, pz = -Math.sin(PIL.ang) * 2.6; PIL.L.position.set(PIL.x - px, -4, PIL.z - pz); PIL.R.position.set(PIL.x + px, -4, PIL.z + pz); PIL.L.rotation.y = PIL.R.rotation.y = PIL.ang + Math.PI;
    [PIL.L, PIL.R].forEach(o => o.visible = true); PIL.chao.position.set(PIL.x, 0.05, PIL.z); PIL.chao.visible = true; tremor = Math.max(tremor, 0.5); som('golem_soco', 0.9, 0.7); som('magia', 0.8, 0.6); fx('fumo', [PIL.x - px, 0.2, PIL.z - pz], 1); fx('fumo', [PIL.x + px, 0.2, PIL.z + pz], 1);
    aviso('🏛️ Pilares do Vazio! Inimigos entre eles ficam lentos, fracos e queimando.', '#d8a8ff'); return true; }
  function pilAlvos() { const s = new Set(FERAS); if (typeof CAL !== 'undefined' && CAL.feras) CAL.feras.forEach(e => s.add(e)); return [...s].filter(e => feraAtiva(e) && Math.hypot(e.g.position.x - PIL.x, e.g.position.z - PIL.z) < 3.4 + e.T.raio); }
  function pilaresFrame(dt) { if (!PIL.on) return; PIL.t += dt; const t = PIL.t, D = PIL.dur, sobe = Math.min(1, t / 0.8), e1 = 1 - Math.pow(1 - sobe, 3), desce = t > D ? Math.min(1, (t - D) / 0.8) : 0;
    const y = -4 * (1 - e1) - 4 * desce * desce, tr = sobe < 1 ? (Math.random() - 0.5) * 0.08 : 0; [PIL.L, PIL.R].forEach(o => { o.position.y = y + tr; try { o.userData.update(gT, dt); } catch (er) {} });
    const k = Math.min(1, t / 1) * (1 - desce); PIL.chao.scale.setScalar(7 * (0.4 + 0.6 * k)); PIL.chao.material.opacity = k * (0.65 + Math.sin(gT * 4) * 0.15); PIL.chao.rotation.z += dt * 0.8;
    // feixe de energia ligando os cristais do topo
    const a = PIL.L.position, b = PIL.R.position, h = 2.35 + y * 0.55; PIL.feixe.visible = t > 0.8 && desce < 0.5; if (PIL.feixe.visible) { PIL.feixe.position.set((a.x + b.x) / 2, h, (a.z + b.z) / 2); const len = Math.hypot(b.x - a.x, b.z - a.z); PIL.feixe.scale.set(1 + Math.sin(gT * 18) * 0.15, len, 1 + Math.sin(gT * 18) * 0.15); PIL.feixe.rotation.set(0, 0, 0); PIL.feixe.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), new T3.Vector3(b.x - a.x, 0, b.z - a.z).normalize()); PIL.feixe.material.opacity = 0.6 + Math.sin(gT * 12) * 0.25; }
    if (t > 0.8 && t < D) { PIL.tick -= dt; const L = pilAlvos(); L.forEach(e => { if (!(e.pilar > 0)) numero(e.g.position, '🔻 Lento e fraco', '#e879f9', e.T.alt + 0.7); e.pilar = 0.6; });
      if (PIL.tick <= 0) { PIL.tick = 1; const W = ARMAS[AR.arma]; L.forEach(e => { dano(e, ((W && W.dano) || 20) * 0.3 * atkMult(), 'magia'); fx('luz', [e.g.position.x, (e.T.alt || 1.2) * 0.6, e.g.position.z], 0.3); }); if (L.length) som('magia', 0.35, 1.5, 0.05); } }
    if (t > D + 0.8) { PIL.on = false; [PIL.L, PIL.R, PIL.chao, PIL.feixe].forEach(o => o.visible = false); } }
  setInterval(() => { try { const s = new Set(FERAS); if (typeof CAL !== 'undefined' && CAL.feras) CAL.feras.forEach(e => s.add(e)); s.forEach(e => { if (e.pilar > 0) e.pilar -= 0.1; }); } catch (er) {} }, 100);
  // ---- habilidade: ADAGAS GUARDIÃS (2 adagas saem das costas, rondam o herói e atacam quem chegar a 6 m) ----
  const GUA = { on: false, t: 0, dur: 10, ad: [] };
  const _gv = new T3.Vector3(), _gd = new T3.Vector3(), _gu = new T3.Vector3(0, 1, 0);
  function guardiasAtiva() { if (AR.divino !== 'arcano') { aviso('Equipe o Grimório dos Círculos Arcanos.', '#c8a8ff'); return false; } if (GUA.on) return false;
    GUA.on = true; GUA.t = 0; const p = heroi.position;
    GUA.ad = [0, 1].map(i => { const m = ARC.fazAdaga(); m.scale.setScalar(1.25); world.add(m); const s = i ? 1 : -1; const f = facing; m.position.set(p.x - Math.sin(f) * 0.45 + Math.cos(f) * 0.3 * s, p.y + 1.45, p.z - Math.cos(f) * 0.45 - Math.sin(f) * 0.3 * s);
      return { m, i, fase: 'sai', t: 0, a: i * Math.PI + facing, va: (0.9 + Math.random() * 0.6) * (i ? -1 : 1), r: 1.3, h: 1.4, cd: 0.3 + i * 0.35, alvo: null, prev: m.position.clone(), p0: null, p1: null }; });
    som('magia', 0.8, 1.2); fx('luz', [p.x, 1.4, p.z], 0.5); aviso('🗡️ Adagas Guardiãs! Elas atacam quem chegar perto (6 m) por 10 s.', '#d8a8ff'); return true; }
  function guaAlvo(p) { let m = null, md = 6; const s = new Set(FERAS); if (typeof CAL !== 'undefined' && CAL.feras) CAL.feras.forEach(e => s.add(e)); s.forEach(e => { if (!feraAtiva(e)) return; const d = Math.hypot(e.g.position.x - p.x, e.g.position.z - p.z) - e.T.raio; if (d < md) { md = d; m = e; } }); return m; }
  function guardiasFrame(dt) { if (!GUA.on) return; GUA.t += dt; const p = heroi.position, acabou = GUA.t >= GUA.dur || AR.divino !== 'arcano';
    GUA.ad.forEach(d => { const m = d.m; d.cd -= dt; d.t += dt;
      // ponto de ronda: gira em volta do herói com velocidade, raio e altura variando
      d.a += dt * d.va; if (Math.random() < dt * 0.6) d.va = (0.8 + Math.random() * 1.4) * Math.sign(d.va || 1) * (Math.random() < 0.15 ? -1 : 1);
      d.r += ((1.1 + Math.sin(gT * 0.7 + d.i * 2) * 0.45) - d.r) * Math.min(1, dt * 2); d.h = 1.25 + Math.sin(gT * 1.3 + d.i * 3) * 0.4;
      const ox = p.x + Math.sin(d.a) * d.r, oy = p.y + d.h, oz = p.z + Math.cos(d.a) * d.r;
      if (acabou && d.fase !== 'fim') { d.fase = 'fim'; d.t = 0; }
      if (d.fase === 'sai') { _gv.set(ox, oy, oz); m.position.lerp(_gv, Math.min(1, dt * 5)); if (d.t > 0.5) d.fase = 'ronda'; }
      else if (d.fase === 'ronda') { _gv.set(ox, oy, oz); m.position.lerp(_gv, Math.min(1, dt * 7));
        if (d.cd <= 0) { const e = guaAlvo(p); if (e) { d.fase = 'ataca'; d.t = 0; d.alvo = e; d.p0 = m.position.clone(); const lado = Math.random() < 0.5 ? -1 : 1; d.p1 = d.p0.clone().add(new T3.Vector3(Math.cos(facing) * lado * 1.6, 1 + Math.random(), -Math.sin(facing) * lado * 1.6)); som('tiro', 0.4, 1.5, 0.05); } } }
      else if (d.fase === 'ataca') { const e = d.alvo, vivo = e && !e.morto, u = Math.min(1, d.t / 0.32);
        if (vivo) d.p2 = (d.p2 || new T3.Vector3()).set(e.g.position.x, e.g.position.y + (e.T.alt || 1.2) * 0.6, e.g.position.z); else if (!d.p2) d.p2 = d.p0.clone();
        const a = 1 - u; m.position.set(0, 0, 0).addScaledVector(d.p0, a * a).addScaledVector(d.p1, 2 * a * u).addScaledVector(d.p2, u * u);
        if (u >= 1) { if (vivo) { const W = ARMAS[AR.arma]; dano(e, ((W && W.dano) || 20) * 0.6 * atkMult(), 'magia', critico()); fx('gelo', [m.position.x, m.position.y, m.position.z], 0.3); } d.fase = 'volta'; d.t = 0; d.p2 = null; d.cd = 0.55; } }
      else if (d.fase === 'volta') { _gv.set(ox, oy, oz); m.position.lerp(_gv, Math.min(1, dt * 9)); if (m.position.distanceTo(_gv) < 0.25 || d.t > 0.6) d.fase = 'ronda'; }
      else if (d.fase === 'fim') { _gv.set(p.x - Math.sin(facing) * 0.4, p.y + 1.45, p.z - Math.cos(facing) * 0.4); m.position.lerp(_gv, Math.min(1, dt * 6)); m.scale.setScalar(Math.max(0.01, 1.25 * (1 - d.t / 0.5))); }
      // aponta a ponta pra direção do movimento (na ronda, aponta pra frente da órbita)
      _gd.subVectors(m.position, d.prev); if (d.fase === 'ronda' || _gd.lengthSq() < 1e-6) _gd.set(Math.cos(d.a) * d.va, 0.15, -Math.sin(d.a) * d.va);
      if (_gd.lengthSq() > 1e-8) { _gd.normalize(); m.quaternion.slerp(new T3.Quaternion().setFromUnitVectors(_gu, _gd), Math.min(1, dt * 12)); } d.prev.copy(m.position);
      if (m.userData.h) m.userData.h.material.opacity = 0.45 + Math.sin(gT * 6 + d.i) * 0.2; });
    if (acabou && GUA.ad.every(d => d.fase === 'fim' && d.t > 0.5)) { GUA.ad.forEach(d => world.remove(d.m)); GUA.ad = []; GUA.on = false; } }
