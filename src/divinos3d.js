  // ===================== MODELOS 3D DOS ITENS DIVINOS (feitos pelo Geanderson em HTML) =====================
  // Manto do Abismo Espectral
  function createSpectralCloak3D(THREE) {
            const rootGroup = new THREE.Group();
            rootGroup.name = 'SpectralCloak3D';

            // Uniforms compartilhados para animação em tempo real
            const uniforms = {
                uTime: { value: 0 },
                uWindSpeed: { value: 1.0 },
                uWindAmp: { value: 1.0 },
                uEnergyIntensity: { value: 1.0 }
            };

            // Rastreamento de malhas para alternar Wireframe facilmente
            const wireframeTargets = [];

            // ------------------------------------------------------------------------
            // 1. MATERIAIS PBR DA ARMADURA GÓTICA METÁLICA (Obsidiana / Chumbo / Prata)
            // ------------------------------------------------------------------------
            const armorDarkMat = new THREE.MeshStandardMaterial({
                color: 0x161b2e,
                metalness: 0.88,
                roughness: 0.26
            });
            const armorTrimMat = new THREE.MeshStandardMaterial({
                color: 0x7b88b8,
                metalness: 0.94,
                roughness: 0.18
            });
            const armorInnerGlowMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(0.15, 1.4, 3.2) // HDR para Bloom
            });

            // Função auxiliar para extrudar peças góticas pontiagudas com chanfro 3D
            function createGothicPiece(points, depth = 0.08, bevelSize = 0.025, mat = armorDarkMat) {
                const shape = new THREE.Shape();
                shape.moveTo(points[0][0], points[0][1]);
                for (let i = 1; i < points.length; i++) {
                    shape.lineTo(points[i][0], points[i][1]);
                }
                shape.closePath();

                const geo = new THREE.ExtrudeGeometry(shape, {
                    depth: depth,
                    bevelEnabled: true,
                    bevelSegments: 2,
                    steps: 1,
                    bevelSize: bevelSize,
                    bevelThickness: bevelSize
                });
                geo.center();
                const mesh = new THREE.Mesh(geo, mat);
                wireframeTargets.push(mesh);
                return mesh;
            }

            // ------------------------------------------------------------------------
            // 2. ARMADURA SUPERIOR, COLARINHO, ESPINHOS E OMBREIRAS ARTICULADAS
            // ------------------------------------------------------------------------
            const armorGroup = new THREE.Group();
            armorGroup.position.set(0, 1.15, 0.05);
            rootGroup.add(armorGroup);

            // Brasão Central / Escudo Gótico Pontiagudo
            const centerShield = createGothicPiece([
                [0, 0.62],
                [0.22, 0.25],
                [0.52, 0.18],
                [0.32, -0.05],
                [0.42, -0.45],
                [0.18, -0.28],
                [0, -0.78],
                [-0.18, -0.28],
                [-0.42, -0.45],
                [-0.32, -0.05],
                [-0.52, 0.18],
                [-0.22, 0.25]
            ], 0.12, 0.035, armorDarkMat);
            centerShield.position.set(0, 0.02, 0.12);
            armorGroup.add(centerShield);

            // Moldura metálica clara ao redor do brasão central
            const centerTrim = createGothicPiece([
                [0, 0.66],
                [0.24, 0.27],
                [0.55, 0.20],
                [0.34, -0.05],
                [0.45, -0.48],
                [0.19, -0.30],
                [0, -0.82],
                [-0.19, -0.30],
                [-0.45, -0.48],
                [-0.34, -0.05],
                [-0.55, 0.20],
                [-0.24, 0.27]
            ], 0.08, 0.02, armorTrimMat);
            centerTrim.position.set(0, 0.02, 0.09);
            armorGroup.add(centerTrim);

            // Cristal / Gema Central em Losango Facetado (Safira / Ciano HDR)
            const crystalGeo = new THREE.OctahedronGeometry(0.24, 0);
            crystalGeo.scale(0.68, 1.38, 0.55);
            const crystalMat = new THREE.MeshStandardMaterial({
                color: 0x38bdf8,
                emissive: new THREE.Color(0.2, 1.9, 3.8),
                emissiveIntensity: 1.4,
                metalness: 0.2,
                roughness: 0.08
            });
            const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
            crystalMesh.position.set(0, 0.08, 0.23);
            armorGroup.add(crystalMesh);
            wireframeTargets.push(crystalMesh);

            // Núcleo interno ultra-brilhante do cristal
            const coreGeo = new THREE.OctahedronGeometry(0.12, 0);
            coreGeo.scale(0.6, 1.3, 0.5);
            const coreMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({
                color: new THREE.Color(1.4, 2.8, 4.5)
            }));
            coreMesh.position.copy(crystalMesh.position);
            coreMesh.position.z += 0.03;
            armorGroup.add(coreMesh);

            // Construção Simétrica das Ombreiras em Camadas e Espinhos Curvados
            [-1, 1].forEach(side => {
                const shoulderPivot = new THREE.Group();
                shoulderPivot.scale.x = side;
                armorGroup.add(shoulderPivot);

                // Espinho Gótico Interno Curvado para Cima
                const innerSpike = createGothicPiece([
                    [0.24, 0.22],
                    [0.48, 0.65],
                    [0.62, 0.78],
                    [0.52, 0.42],
                    [0.45, 0.16]
                ], 0.07, 0.02, armorTrimMat);
                innerSpike.position.set(0.05, 0.05, 0.02);
                innerSpike.rotation.y = -0.18;
                shoulderPivot.add(innerSpike);

                // Espinho Gótico Externo Longo (Chifre Superior)
                const outerSpike = createGothicPiece([
                    [0.55, 0.18],
                    [0.95, 0.55],
                    [1.18, 0.75],
                    [1.02, 0.36],
                    [0.82, 0.12]
                ], 0.07, 0.02, armorTrimMat);
                outerSpike.position.set(0.05, 0.04, -0.04);
                outerSpike.rotation.y = -0.25;
                shoulderPivot.add(outerSpike);

                // Placa Principal da Ombreira (Curvada para envolver o ombro 3D)
                const mainPauldron = createGothicPiece([
                    [0.32, 0.24],
                    [1.02, 0.32],
                    [1.48, 0.10],
                    [1.15, -0.08],
                    [1.34, -0.32],
                    [0.88, -0.28],
                    [0.68, -0.62],
                    [0.54, -0.26],
                    [0.32, -0.06]
                ], 0.11, 0.03, armorDarkMat);
                mainPauldron.position.set(0.06, 0.02, 0.02);
                mainPauldron.rotation.y = -0.32;
                mainPauldron.rotation.x = 0.08;
                shoulderPivot.add(mainPauldron);

                // Placa Sobreposta Superior da Ombreira (Detalhe em relevo)
                const topPlate = createGothicPiece([
                    [0.42, 0.20],
                    [0.94, 0.24],
                    [1.24, 0.08],
                    [0.86, -0.04],
                    [0.44, 0.04]
                ], 0.08, 0.022, armorTrimMat);
                topPlate.position.set(0.08, 0.04, 0.09);
                topPlate.rotation.y = -0.32;
                shoulderPivot.add(topPlate);

                // Fenda de Energia Azul brilhando dentro da ombreira
                const slotGlow = createGothicPiece([
                    [0.58, 0.06],
                    [0.92, 0.06],
                    [0.78, -0.03]
                ], 0.04, 0.005, armorInnerGlowMat);
                slotGlow.position.set(0.09, 0.02, 0.11);
                slotGlow.rotation.y = -0.32;
                shoulderPivot.add(slotGlow);
            });

            // ------------------------------------------------------------------------
            // 3. ASAS / LÂMINAS DE ENERGIA ESPECTRAL (Shader GLSL Fresnel + Ondulação)
            // ------------------------------------------------------------------------
            const bladeVertexShader = `
                uniform float uTime;
                uniform float uWindSpeed;
                uniform float uWindAmp;
                varying vec2 vUv;
                varying vec3 vNormalView;
                varying vec3 vViewPosition;

                void main() {
                    vUv = uv;
                    vec3 pos = position;

                    // Quanto mais perto da ponta (uv.y -> 0), maior a ondulação energética
                    float tipFactor = pow(1.0 - uv.y, 1.6);
                    float t = uTime * (2.6 * uWindSpeed);

                    pos.z += sin(t + pos.y * 2.5 + pos.x * 2.0) * 0.14 * tipFactor * uWindAmp;
                    pos.x += cos(t * 0.85 + pos.y * 2.0) * 0.08 * tipFactor * uWindAmp;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    vNormalView = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;

            const bladeFragmentShader = `
                uniform float uTime;
                uniform float uWindSpeed;
                uniform float uEnergyIntensity;
                varying vec2 vUv;
                varying vec3 vNormalView;
                varying vec3 vViewPosition;

                // Ruído procedural leve para chamas espectrais
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(
                        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
                        f.y
                    );
                }

                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    // Efeito Fresnel 3D para bordas luminosas
                    float fresnel = pow(1.0 - abs(dot(normalize(vNormalView), viewDir)), 2.0);

                    float t = uTime * (1.8 * uWindSpeed);
                    float n1 = noise(vec2(vUv.x * 5.0, vUv.y * 6.0 + t));
                    float n2 = noise(vec2(vUv.x * 10.0 - t * 0.5, vUv.y * 12.0 + t * 1.4));
                    float energyPattern = n1 * 0.65 + n2 * 0.35;

                    // Faceta cristalina interna da lâmina (eixo central mais brilhante)
                    float centerSpine = 1.0 - smoothstep(0.0, 0.38, abs(vUv.x - 0.5));
                    float tipGlow = pow(1.0 - vUv.y, 1.2);

                    vec3 deepBlue = vec3(0.04, 0.22, 0.85);
                    vec3 electricCyan = vec3(0.15, 1.35, 2.85);
                    vec3 whiteCore = vec3(1.4, 2.4, 3.6);

                    vec3 col = mix(deepBlue, electricCyan, energyPattern * 0.7 + fresnel * 0.6 + tipGlow * 0.4);
                    col = mix(col, whiteCore, centerSpine * (0.45 + 0.35 * energyPattern) + tipGlow * 0.35);

                    // Dissipação flamejante nas bordas e na ponta
                    float edgeMask = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
                    float flameDissolve = smoothstep(0.05, 0.45, vUv.y + energyPattern * 0.28);
                    float alpha = clamp((edgeMask * 0.85 + fresnel * 0.4) * flameDissolve, 0.0, 0.96);

                    gl_FragColor = vec4(col * uEnergyIntensity, alpha);
                }
            `;

            const bladeShaderMat = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: bladeVertexShader,
                fragmentShader: bladeFragmentShader,
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });

            // Cria uma malha curva 3D para cada lâmina das asas
            function createEnergyBladeMesh(width, height, curveX, twistY) {
                const geo = new THREE.PlaneGeometry(width, height, 18, 36);
                const pos = geo.attributes.position;

                for (let i = 0; i < pos.count; i++) {
                    const x = pos.getX(i);
                    const y = pos.getY(i);
                    // v = 1 no topo (ombro), v = 0 na ponta inferior
                    const v = (y + height * 0.5) / height;
                    const u = (x + width * 0.5) / width;

                    // Afina na base do ombro e afia fortemente na ponta inferior
                    const taper = Math.sin(Math.pow(v, 0.72) * Math.PI);
                    const newX = x * taper + Math.pow(1.0 - v, 1.5) * curveX;

                    // Volume 3D em formato de quilha/cristal no eixo central
                    const ridgeZ = (1.0 - Math.abs(u - 0.5) * 2.0) * 0.14 * taper;
                    const archZ = Math.sin(v * Math.PI) * 0.18;

                    pos.setXYZ(i, newX, y - height * 0.5, ridgeZ + archZ);
                }
                geo.computeVertexNormals();
                const mesh = new THREE.Mesh(geo, bladeShaderMat);
                mesh.rotation.y = twistY;
                wireframeTargets.push(mesh);
                return mesh;
            }

            const wingsGroup = new THREE.Group();
            wingsGroup.position.set(0, 1.05, -0.08);
            rootGroup.add(wingsGroup);

            [-1, 1].forEach(side => {
                const wingSide = new THREE.Group();
                wingSide.scale.x = side;
                wingsGroup.add(wingSide);

                // Lâmina Externa Principal (Longa e curvada para fora)
                const outerBlade = createEnergyBladeMesh(0.75, 2.05, 0.58, -0.28);
                outerBlade.position.set(0.85, 0.05, -0.02);
                outerBlade.rotation.z = 0.22;
                wingSide.add(outerBlade);

                // Lâmina Interna Secundária (Mais vertical e afiada)
                const innerBlade = createEnergyBladeMesh(0.58, 1.95, 0.22, -0.15);
                innerBlade.position.set(0.65, -0.05, -0.12);
                innerBlade.rotation.z = 0.08;
                wingSide.add(innerBlade);
            });

            // ------------------------------------------------------------------------
            // 4. CAPA DE TECIDO ROXO RASGADO + FOGO ESPECTRAL NAS PONTAS (GLSL)
            // ------------------------------------------------------------------------
            const cloakVertexShader = `
                uniform float uTime;
                uniform float uWindSpeed;
                uniform float uWindAmp;
                varying vec2 vUv;
                varying vec3 vNormalView;
                varying vec3 vViewPosition;
                varying float vCrease;

                void main() {
                    vUv = uv;
                    vec3 pos = position;

                    // vUv.y: 1.0 no colarinho (fixo), 0.0 na barra esfarrapada (solto)
                    float looseness = pow(1.0 - uv.y, 1.45);
                    float t = uTime * (2.4 * uWindSpeed);

                    // Ondulação orgânica multi-frequência (vento 3D)
                    float wave1 = sin(t + pos.y * 2.6 + pos.x * 2.2) * 0.18;
                    float wave2 = cos(t * 1.35 + pos.x * 4.5 - pos.y * 1.8) * 0.07;
                    float flutter = sin(t * 2.8 + pos.x * 8.0) * 0.035;

                    pos.z += (wave1 + wave2 + flutter) * looseness * uWindAmp;
                    pos.x += sin(t * 0.9 + pos.y * 2.0) * 0.06 * looseness * uWindAmp;

                    // Passa o relevo das dobras para sombreamento rico
                    vCrease = pos.z;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    vNormalView = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;

            const cloakFragmentShader = `
                uniform float uTime;
                uniform float uWindSpeed;
                uniform float uEnergyIntensity;
                varying vec2 vUv;
                varying vec3 vNormalView;
                varying vec3 vViewPosition;
                varying float vCrease;

                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    return mix(
                        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
                        f.y
                    );
                }
                float fbm(vec2 p) {
                    float v = 0.0;
                    float a = 0.5;
                    for (int i = 0; i < 4; i++) {
                        v += a * noise(p);
                        p *= 2.05;
                        a *= 0.5;
                    }
                    return v;
                }

                void main() {
                    float t = uTime * (1.2 * uWindSpeed);

                    // 1. Silhueta inferior rasgada em pontas góticas assimétricas
                    float centerPeak = (1.0 - abs(vUv.x - 0.5) * 2.0) * 0.14;
                    float jags = abs(sin(vUv.x * 22.0 + 0.4)) * 0.09
                               + abs(cos(vUv.x * 37.0 - 1.1)) * 0.06
                               + fbm(vec2(vUv.x * 12.0, 2.0)) * 0.12;
                    float bottomCutoff = 0.28 - centerPeak - jags;

                    if (vUv.y < bottomCutoff) discard;

                    // 2. Furos de desgaste no tecido (como no close-up da referência)
                    float holeNoise = fbm(vec2(vUv.x * 14.0 + 1.3, vUv.y * 16.0));
                    float holeZone = smoothstep(0.42, 0.18, vUv.y); // Apenas na metade inferior
                    if (holeNoise * holeZone > 0.66) discard;

                    // Distância até a borda rasgada ou furo (para criar a aura de fogo azul)
                    float distToEdge = vUv.y - bottomCutoff;
                    float distToHole = 0.66 - (holeNoise * holeZone);

                    // 3. Textura de tecido nobre índigo / roxo profundo
                    float weave = noise(vUv * vec2(90.0, 110.0)) * 0.12;
                    float foldShade = clamp(0.5 + vCrease * 1.6, 0.15, 1.25);

                    vec3 deepIndigo = vec3(0.09, 0.04, 0.20);
                    vec3 royalPurple = vec3(0.32, 0.12, 0.62);
                    vec3 violetHighlight = vec3(0.52, 0.24, 0.88);

                    vec3 fabricCol = mix(deepIndigo, royalPurple, smoothstep(0.95, 0.35, vUv.y));
                    fabricCol = mix(fabricCol, violetHighlight, clamp(vCrease * 2.2, 0.0, 0.65));
                    fabricCol = fabricCol * foldShade + weave * 0.15;

                    // 4. Transição gradual para fogo espectral azul-ciano nas pontas e furos
                    float fireNoise = fbm(vec2(vUv.x * 9.0, vUv.y * 8.0 + t * 1.6));
                    float edgeFireMask = 1.0 - smoothstep(0.0, 0.24 + fireNoise * 0.12, distToEdge);
                    float holeFireMask = 1.0 - smoothstep(0.0, 0.09, distToHole);
                    float totalFire = clamp(max(edgeFireMask, holeFireMask * 0.85), 0.0, 1.0);

                    vec3 cyanFlame = vec3(0.08, 1.15, 2.65) * uEnergyIntensity;
                    vec3 whiteTip = vec3(1.1, 2.2, 3.4) * uEnergyIntensity;

                    vec3 fireCol = mix(cyanFlame, whiteTip, pow(totalFire, 2.4));
                    vec3 finalCol = mix(fabricCol, fireCol, pow(totalFire, 1.25));

                    // Fresnel sutil nas dobras do tecido
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = pow(1.0 - abs(dot(normalize(vNormalView), viewDir)), 2.5);
                    finalCol += vec3(0.12, 0.45, 0.95) * fresnel * 0.45;

                    gl_FragColor = vec4(finalCol, 1.0);
                }
            `;

            const cloakMat = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: cloakVertexShader,
                fragmentShader: cloakFragmentShader,
                side: THREE.DoubleSide
            });

            // Geometria 3D subdividida da capa com formato trapezoidal e dobras esculpidas
            const cloakWidthTop = 0.95;
            const cloakWidthBot = 2.45;
            const cloakHeight = 2.65;
            const cloakGeo = new THREE.PlaneGeometry(1, cloakHeight, 96, 110);
            const cPos = cloakGeo.attributes.position;

            for (let i = 0; i < cPos.count; i++) {
                const u = cPos.getX(i) + 0.5; // 0..1
                const v = (cPos.getY(i) + cloakHeight * 0.5) / cloakHeight; // 0 (base) .. 1 (topo)

                // Abertura em leque do colarinho para a barra
                const currentWidth = THREE.MathUtils.lerp(cloakWidthBot, cloakWidthTop, Math.pow(v, 0.85));
                const x = (u - 0.5) * currentWidth;
                const y = (v - 1.0) * cloakHeight;

                // Curvatura envolvente nos ombros + 5 dobras verticais profundas
                const archWrap = -Math.pow((u - 0.5) * 2.0, 2.0) * 0.22;
                const foldFrequency = (u - 0.5) * Math.PI * 7.0;
                const foldDepth = Math.cos(foldFrequency) * 0.11 * (1.0 - v * 0.55);

                cPos.setXYZ(i, x, y, archWrap + foldDepth);
            }
            cloakGeo.computeVertexNormals();

            const cloakMesh = new THREE.Mesh(cloakGeo, cloakMat);
            cloakMesh.position.set(0, 1.12, -0.12);
            rootGroup.add(cloakMesh);
            wireframeTargets.push(cloakMesh);

            // ------------------------------------------------------------------------
            // 5. SISTEMA DE PARTÍCULAS 3D ETÉREAS (Brasas e Faíscas Azuis)
            // ------------------------------------------------------------------------
            const particleCount = 140;
            const pGeo = new THREE.BufferGeometry();
            const pPositions = new Float32Array(particleCount * 3);
            const pPhases = new Float32Array(particleCount);
            const pSpeeds = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                pPositions[i * 3] = (Math.random() - 0.5) * 2.8;
                pPositions[i * 3 + 1] = -1.5 + Math.random() * 2.9;
                pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
                pPhases[i] = Math.random() * Math.PI * 2;
                pSpeeds[i] = 0.4 + Math.random() * 0.8;
            }

            pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
            pGeo.setAttribute('aPhase', new THREE.BufferAttribute(pPhases, 1));
            pGeo.setAttribute('aSpeed', new THREE.BufferAttribute(pSpeeds, 1));

            const particleMat = new THREE.ShaderMaterial({
                uniforms,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexShader: `
                    uniform float uTime;
                    uniform float uWindSpeed;
                    attribute float aPhase;
                    attribute float aSpeed;
                    varying float vAlpha;

                    void main() {
                        vec3 pos = position;
                        float cycle = fract(aPhase + uTime * aSpeed * 0.25 * max(0.2, uWindSpeed));
                        pos.y += cycle * 1.4;
                        pos.x += sin(uTime * 2.0 + aPhase * 6.28) * 0.15;
                        pos.z += cos(uTime * 1.7 + aPhase * 6.28) * 0.15;

                        vAlpha = sin(cycle * 3.14159);
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = (26.0 / -mvPosition.z) * (0.6 + 0.6 * sin(aPhase * 10.0));
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform float uEnergyIntensity;
                    varying float vAlpha;
                    void main() {
                        float d = length(gl_PointCoord - vec2(0.5));
                        if (d > 0.5) discard;
                        float glow = pow(1.0 - d * 2.0, 2.0);
                        gl_FragColor = vec4(vec3(0.25, 1.5, 3.2) * uEnergyIntensity, glow * vAlpha * 0.85);
                    }
                `
            });

            const particlesPoints = new THREE.Points(pGeo, particleMat);
            rootGroup.add(particlesPoints);

            // Método de atualização para o loop do jogo
            function update(elapsedTime, options = {}) {
                uniforms.uTime.value = elapsedTime;
                if (options.windSpeed !== undefined) uniforms.uWindSpeed.value = options.windSpeed;
                if (options.windAmp !== undefined) uniforms.uWindAmp.value = options.windAmp;
                if (options.energyIntensity !== undefined) uniforms.uEnergyIntensity.value = options.energyIntensity;

                // Pulso sutil no cristal central e respiração das asas
                const pulse = 1.0 + Math.sin(elapsedTime * 3.5) * 0.045;
                crystalMesh.scale.set(0.68 * pulse, 1.38 * pulse, 0.55 * pulse);
                coreMesh.scale.set(0.6 * pulse, 1.3 * pulse, 0.5 * pulse);

                const wingBreath = Math.sin(elapsedTime * 2.1 * uniforms.uWindSpeed.value) * 0.04;
                wingsGroup.children[0].rotation.z = wingBreath;
                wingsGroup.children[1].rotation.z = -wingBreath;
            }

            function setWireframe(enabled) {
                wireframeTargets.forEach(mesh => {
                    if (mesh.material) mesh.material.wireframe = enabled;
                });
            }

            return {
                group: rootGroup,
                uniforms,
                update,
                setWireframe
            };
        }
  // Emblema Ígneo com Sol Central
  function createFieryCrestItem(THREE) {
            const rootGroup = new THREE.Group();
            rootGroup.name = 'FieryDragonicCrestWithSun';

            // ------------------------------------------------------------------------
            // 1. GERADORES DE TEXTURAS PBR PROCEDURAIS (Obsidiana, Magma, Ouro, Sol)
            // ------------------------------------------------------------------------
            const obsDiff = document.createElement('canvas');
            const obsBump = document.createElement('canvas');
            const obsEmis = document.createElement('canvas');
            obsDiff.width = obsBump.width = obsEmis.width = 512;
            obsDiff.height = obsBump.height = obsEmis.height = 512;

            const odCtx = obsDiff.getContext('2d');
            const obCtx = obsBump.getContext('2d');
            const oeCtx = obsEmis.getContext('2d');

            odCtx.fillStyle = '#1b181f';
            odCtx.fillRect(0, 0, 512, 512);
            obCtx.fillStyle = '#808080';
            obCtx.fillRect(0, 0, 512, 512);
            oeCtx.fillStyle = '#000000';
            oeCtx.fillRect(0, 0, 512, 512);

            // Granulação vulcânica e relevo
            for (let i = 0; i < 1400; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const r = 2 + Math.random() * 7;
                odCtx.fillStyle = Math.random() > 0.5 ? 'rgba(60, 52, 68, 0.26)' : 'rgba(8, 6, 10, 0.40)';
                odCtx.beginPath();
                odCtx.arc(x, y, r, 0, Math.PI * 2);
                odCtx.fill();

                obCtx.fillStyle = Math.random() > 0.5 ? 'rgba(215, 215, 215, 0.22)' : 'rgba(35, 35, 35, 0.28)';
                obCtx.beginPath();
                obCtx.arc(x, y, r * 0.85, 0, Math.PI * 2);
                obCtx.fill();
            }

            // Veios emissivos de lava nas rachaduras da obsidiana
            for (let v = 0; v < 38; v++) {
                let vx = Math.random() * 512;
                let vy = Math.random() * 512;
                oeCtx.strokeStyle = v % 3 === 0 ? '#ffb700' : '#ff3d00';
                oeCtx.lineWidth = 1.3 + Math.random() * 1.5;
                obCtx.strokeStyle = '#141414';
                obCtx.lineWidth = 2.6;

                oeCtx.beginPath();
                obCtx.beginPath();
                oeCtx.moveTo(vx, vy);
                obCtx.moveTo(vx, vy);

                for (let s = 0; s < 7; s++) {
                    vx += (Math.random() - 0.5) * 58;
                    vy += (Math.random() - 0.35) * 58;
                    oeCtx.lineTo(vx, vy);
                    obCtx.lineTo(vx, vy);
                }
                oeCtx.stroke();
                obCtx.stroke();
            }

            // Textura procedural de magma fluido (garras e chifres)
            const magDiff = document.createElement('canvas');
            const magBump = document.createElement('canvas');
            magDiff.width = magBump.width = 512;
            magDiff.height = magBump.height = 512;
            const mdCtx = magDiff.getContext('2d');
            const mbCtx = magBump.getContext('2d');

            const mGrad = mdCtx.createLinearGradient(0, 0, 512, 512);
            mGrad.addColorStop(0.0, '#fff478');
            mGrad.addColorStop(0.28, '#ff8c00');
            mGrad.addColorStop(0.65, '#e61c00');
            mGrad.addColorStop(1.0, '#700505');
            mdCtx.fillStyle = mGrad;
            mdCtx.fillRect(0, 0, 512, 512);
            mbCtx.fillStyle = '#909090';
            mbCtx.fillRect(0, 0, 512, 512);

            for (let i = 0; i < 180; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                mdCtx.strokeStyle = i % 3 === 0 ? 'rgba(255, 253, 200, 0.68)' : 'rgba(95, 8, 0, 0.44)';
                mdCtx.lineWidth = 1.2 + Math.random() * 3.0;
                mdCtx.beginPath();
                mdCtx.moveTo(x, y);
                mdCtx.bezierCurveTo(x + 30, y - 25, x + 65, y + 35, x + 110, y - 10);
                mdCtx.stroke();
            }

            // Textura procedural de ouro antigo escovado e gravado
            const goldDiff = document.createElement('canvas');
            const goldBump = document.createElement('canvas');
            goldDiff.width = goldBump.width = 512;
            goldDiff.height = goldBump.height = 512;
            const gdCtx = goldDiff.getContext('2d');
            const gbCtx = goldBump.getContext('2d');

            gdCtx.fillStyle = '#d4a348';
            gdCtx.fillRect(0, 0, 512, 512);
            gbCtx.fillStyle = '#808080';
            gbCtx.fillRect(0, 0, 512, 512);

            for (let i = 0; i < 750; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                gdCtx.fillStyle = i % 2 === 0 ? 'rgba(255, 238, 168, 0.20)' : 'rgba(75, 42, 10, 0.22)';
                gdCtx.fillRect(x, y, 38, 1.5);
            }

            gbCtx.strokeStyle = '#dcdcdc';
            gbCtx.lineWidth = 2.2;
            for (let row = 32; row < 512; row += 64) {
                for (let col = 32; col < 512; col += 64) {
                    gbCtx.beginPath();
                    gbCtx.arc(col, row, 18, 0, Math.PI * 1.5);
                    gbCtx.stroke();
                }
            }

            const wrapTex = (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
            const obsidianMap = wrapTex(new THREE.CanvasTexture(obsDiff));
            const obsidianBump = wrapTex(new THREE.CanvasTexture(obsBump));
            const obsidianEmissive = wrapTex(new THREE.CanvasTexture(obsEmis));
            const magmaMap = wrapTex(new THREE.CanvasTexture(magDiff));
            const magmaBump = wrapTex(new THREE.CanvasTexture(magBump));
            const goldMap = wrapTex(new THREE.CanvasTexture(goldDiff));
            const goldBumpTex = wrapTex(new THREE.CanvasTexture(goldBump));

            // ------------------------------------------------------------------------
            // 2. MATERIAIS PBR
            // ------------------------------------------------------------------------
            const royalGoldMat = new THREE.MeshStandardMaterial({
                map: goldMap, bumpMap: goldBumpTex, bumpScale: 0.028,
                color: new THREE.Color('#ebb854'), metalness: 0.91, roughness: 0.22
            });

            const burnishedBronzeMat = new THREE.MeshStandardMaterial({
                map: goldMap, bumpMap: goldBumpTex, bumpScale: 0.02,
                color: new THREE.Color('#8c4f21'), metalness: 0.85, roughness: 0.34
            });

            const darkSteelRimMat = new THREE.MeshStandardMaterial({
                map: obsidianMap, bumpMap: obsidianBump, bumpScale: 0.018,
                color: new THREE.Color('#38323e'), metalness: 0.88, roughness: 0.28
            });

            const obsidianArmorMat = new THREE.MeshStandardMaterial({
                map: obsidianMap, bumpMap: obsidianBump, bumpScale: 0.032,
                emissiveMap: obsidianEmissive, emissive: new THREE.Color('#ff4800'), emissiveIntensity: 0.95,
                color: new THREE.Color('#231f26'), metalness: 0.80, roughness: 0.38
            });

            const backPlateSteelMat = new THREE.MeshStandardMaterial({
                map: obsidianMap, bumpMap: obsidianBump, bumpScale: 0.024,
                color: new THREE.Color('#19171d'), metalness: 0.86, roughness: 0.32
            });

            const magmaCoreMat = new THREE.MeshStandardMaterial({
                map: magmaMap, bumpMap: magmaBump, bumpScale: 0.022,
                emissiveMap: magmaMap, emissive: new THREE.Color('#ff5900'), emissiveIntensity: 1.85,
                color: new THREE.Color('#ff8800'), roughness: 0.20, metalness: 0.08
            });

            const crimsonCrystalFinMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#ff1808'), emissive: new THREE.Color('#d41100'), emissiveIntensity: 1.55,
                roughness: 0.12, metalness: 0.05, transparent: true, opacity: 0.94,
                clearcoat: 1.0, clearcoatRoughness: 0.08
            });

            const frontRubyMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#ff1420'), emissive: new THREE.Color('#ff0814'), emissiveIntensity: 1.75,
                roughness: 0.06, metalness: 0.1, clearcoat: 1.0, flatShading: true
            });

            const backAmberCrystalMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#ff9100'), emissive: new THREE.Color('#ff6200'), emissiveIntensity: 1.85,
                roughness: 0.08, metalness: 0.1, clearcoat: 1.0, flatShading: true
            });

            // ------------------------------------------------------------------------
            // 3. AUXILIARES ESCULTURAIS DE GEOMETRIA 3D
            // ------------------------------------------------------------------------
            function createBeveledPolygon(points, depth, bevelSize = 0.022, bevelThickness = 0.028) {
                const shape = new THREE.Shape();
                shape.moveTo(points[0][0], points[0][1]);
                for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
                shape.closePath();
                const geo = new THREE.ExtrudeGeometry(shape, {
                    depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize, bevelThickness
                });
                geo.center();
                return geo;
            }

            function createSculptedPlumeBlade(length = 0.85, width = 0.22, curveBend = 0.24, mainMat = royalGoldMat, ridgeMat = burnishedBronzeMat) {
                const plumeGroup = new THREE.Group();
                const bladeShape = new THREE.Shape();
                bladeShape.moveTo(0, 0);
                bladeShape.bezierCurveTo(width * 0.65, length * 0.25, width * 0.55, length * 0.68, curveBend, length);
                bladeShape.bezierCurveTo(-width * 0.35 + curveBend * 0.5, length * 0.65, -width * 0.55, length * 0.25, 0, 0);

                const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
                    depth: 0.032, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.014, bevelThickness: 0.018
                });
                const bladeMesh = new THREE.Mesh(bladeGeo, mainMat);
                bladeMesh.position.z = -0.016;
                plumeGroup.add(bladeMesh);

                const ribCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0, 0.04, 0.024),
                    new THREE.Vector3(curveBend * 0.28, length * 0.45, 0.032),
                    new THREE.Vector3(curveBend * 0.85, length * 0.88, 0.018)
                ]);
                plumeGroup.add(new THREE.Mesh(new THREE.TubeGeometry(ribCurve, 14, 0.018, 6, false), ridgeMat));
                return plumeGroup;
            }

            function createDetailedMagmaClaw(scale = 1.0, mirrorX = false) {
                const clawGroup = new THREE.Group();

                const magmaShape = new THREE.Shape();
                magmaShape.moveTo(0.04, 0.04);
                magmaShape.bezierCurveTo(0.38, 0.08, 0.76, 0.38, 0.92, 1.02);
                magmaShape.bezierCurveTo(0.60, 0.62, 0.34, 0.45, 0.08, 0.48);
                magmaShape.bezierCurveTo(-0.04, 0.34, -0.04, 0.16, 0.04, 0.04);

                const magmaMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(magmaShape, {
                    depth: 0.038, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.014, bevelThickness: 0.018
                }), magmaCoreMat);
                magmaMesh.position.z = -0.019;
                clawGroup.add(magmaMesh);

                const goldCollarShape = new THREE.Shape();
                goldCollarShape.moveTo(-0.05, -0.04);
                goldCollarShape.bezierCurveTo(0.26, -0.01, 0.48, 0.20, 0.56, 0.52);
                goldCollarShape.bezierCurveTo(0.34, 0.38, 0.16, 0.36, -0.02, 0.40);
                goldCollarShape.closePath();

                const goldCollarMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(goldCollarShape, {
                    depth: 0.072, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.015, bevelThickness: 0.02
                }), royalGoldMat);
                goldCollarMesh.position.z = -0.036;
                clawGroup.add(goldCollarMesh);

                const armorCapShape = new THREE.Shape();
                armorCapShape.moveTo(-0.08, -0.06);
                armorCapShape.bezierCurveTo(0.16, -0.04, 0.30, 0.12, 0.35, 0.32);
                armorCapShape.bezierCurveTo(0.20, 0.24, 0.08, 0.24, -0.06, 0.28);
                armorCapShape.closePath();

                const armorCapMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(armorCapShape, {
                    depth: 0.095, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.012, bevelThickness: 0.016
                }), obsidianArmorMat);
                armorCapMesh.position.z = -0.047;
                clawGroup.add(armorCapMesh);

                const rivetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), royalGoldMat);
                rivetMesh.position.set(0.11, 0.14, 0.0);
                rivetMesh.scale.set(1, 1, 1.8);
                clawGroup.add(rivetMesh);

                if (mirrorX) clawGroup.scale.set(-scale, scale, scale);
                else clawGroup.scale.setScalar(scale);
                return clawGroup;
            }

            function createTaperedOrganicHorn(points, baseRadius, flatZ = 0.58, mat = magmaCoreMat) {
                const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
                const tubularSegs = 28, radialSegs = 12;
                const geo = new THREE.TubeGeometry(curve, tubularSegs, baseRadius, radialSegs, false);
                const pos = geo.attributes.position, v = new THREE.Vector3(), center = new THREE.Vector3();

                for (let i = 0; i <= tubularSegs; i++) {
                    const t = i / tubularSegs;
                    curve.getPointAt(t, center);
                    const taper = Math.pow(1 - t, 0.75);
                    for (let j = 0; j <= radialSegs; j++) {
                        const idx = i * (radialSegs + 1) + j;
                        v.fromBufferAttribute(pos, idx).sub(center);
                        v.x *= taper; v.y *= taper; v.z *= taper * flatZ;
                        v.add(center);
                        pos.setXYZ(idx, v.x, v.y, v.z);
                    }
                }
                geo.computeVertexNormals();
                return new THREE.Mesh(geo, mat);
            }

            function createFiligreeScroll(points, radius = 0.026, mat = royalGoldMat) {
                const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
                const tubularSegs = 24, radialSegs = 8;
                const geo = new THREE.TubeGeometry(curve, tubularSegs, radius, radialSegs, false);
                const pos = geo.attributes.position, v = new THREE.Vector3(), center = new THREE.Vector3();

                for (let i = 0; i <= tubularSegs; i++) {
                    const t = i / tubularSegs;
                    curve.getPointAt(t, center);
                    const taper = Math.sin(t * Math.PI) * 0.75 + 0.35;
                    for (let j = 0; j <= radialSegs; j++) {
                        const idx = i * (radialSegs + 1) + j;
                        v.fromBufferAttribute(pos, idx).sub(center).multiplyScalar(taper).add(center);
                        pos.setXYZ(idx, v.x, v.y, v.z);
                    }
                }
                geo.computeVertexNormals();
                return new THREE.Mesh(geo, mat);
            }

            // ------------------------------------------------------------------------
            // 4. NÚCLEO INFERIOR DO EMBLEMA (FRENTE & VERSO)
            // ------------------------------------------------------------------------
            const centerHub = new THREE.Group();
            centerHub.position.set(0, -1.36, 0);
            rootGroup.add(centerHub);

            // FRENTE: Escudo em ouro antigo com filigranas e gema rubi octogonal
            const frontGroup = new THREE.Group();
            frontGroup.position.z = 0.055;
            centerHub.add(frontGroup);

            const baseEscutcheonPts = [
                [0, -0.68], [0.52, -0.36], [0.94, 0.06], [0.68, 0.38], [0.34, 0.26],
                [0, 0.48], [-0.34, 0.26], [-0.68, 0.38], [-0.94, 0.06], [-0.52, -0.36]
            ];
            frontGroup.add(new THREE.Mesh(createBeveledPolygon(baseEscutcheonPts, 0.13, 0.032, 0.038), burnishedBronzeMat));

            const goldOverlayMesh = new THREE.Mesh(createBeveledPolygon(baseEscutcheonPts, 0.08, 0.025, 0.03), royalGoldMat);
            goldOverlayMesh.scale.set(0.88, 0.88, 1.0);
            goldOverlayMesh.position.z = 0.055;
            frontGroup.add(goldOverlayMesh);

            const outerBezelPts = [
                [0, -0.34], [0.18, -0.18], [0.26, 0], [0.18, 0.18],
                [0, 0.34], [-0.18, 0.18], [-0.26, 0], [-0.18, -0.18]
            ];
            const outerBezelMesh = new THREE.Mesh(createBeveledPolygon(outerBezelPts, 0.14, 0.025, 0.03), royalGoldMat);
            outerBezelMesh.position.set(0, 0.02, 0.08);
            frontGroup.add(outerBezelMesh);

            const innerDarkRing = new THREE.Mesh(createBeveledPolygon(outerBezelPts, 0.15, 0.015, 0.02), darkSteelRimMat);
            innerDarkRing.scale.set(0.82, 0.82, 1.0);
            innerDarkRing.position.set(0, 0.02, 0.095);
            frontGroup.add(innerDarkRing);

            const rubyGeo = new THREE.OctahedronGeometry(1, 0);
            rubyGeo.scale(0.17, 0.24, 0.11);
            const rubyMesh = new THREE.Mesh(rubyGeo, frontRubyMat);
            rubyMesh.position.set(0, 0.02, 0.165);
            frontGroup.add(rubyMesh);

            // 4 Garras de ouro segurando o rubi central
            [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((ang) => {
                const prong = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.09, 5), royalGoldMat);
                prong.position.set(Math.sin(ang) * 0.17, 0.02 + Math.cos(ang) * 0.24, 0.18);
                prong.rotation.z = -ang;
                prong.rotation.x = 0.45;
                frontGroup.add(prong);
            });

            // Filigranas e 6 camadas de plumas metálicas por lado
            for (const side of [-1, 1]) {
                frontGroup.add(createFiligreeScroll([
                    [side * 0.22, 0.12, 0.12], [side * 0.36, 0.28, 0.14],
                    [side * 0.56, 0.22, 0.13], [side * 0.68, 0.38, 0.11]
                ], 0.032, royalGoldMat));

                frontGroup.add(createFiligreeScroll([
                    [side * 0.18, -0.14, 0.12], [side * 0.38, -0.26, 0.14],
                    [side * 0.58, -0.12, 0.12], [side * 0.78, -0.18, 0.09]
                ], 0.03, royalGoldMat));

                frontGroup.add(createTaperedOrganicHorn([
                    [side * 0.22, 0.22, 0.09], [side * 0.28, 0.46, 0.11], [side * 0.21, 0.72, 0.09]
                ], 0.055, 0.6, royalGoldMat));

                frontGroup.add(createTaperedOrganicHorn([
                    [side * 0.38, 0.24, 0.08], [side * 0.48, 0.52, 0.09], [side * 0.42, 0.80, 0.06]
                ], 0.062, 0.6, royalGoldMat));

                frontGroup.add(createTaperedOrganicHorn([
                    [side * 0.52, 0.26, 0.02], [side * 0.64, 0.62, 0.03], [side * 0.54, 0.96, 0.01]
                ], 0.068, 0.52, magmaCoreMat));

                for (let p = 0; p < 6; p++) {
                    const t = p / 5;
                    const plume = createSculptedPlumeBlade(
                        0.68 + t * 0.24, 0.19, side * (0.16 + t * 0.08),
                        p % 2 === 0 ? royalGoldMat : burnishedBronzeMat, royalGoldMat
                    );
                    plume.position.set(side * (0.42 + t * 0.36), -0.16 + t * 0.34, 0.085 - p * 0.008);
                    plume.rotation.z = -side * (0.72 - t * 0.42);
                    frontGroup.add(plume);
                }

                frontGroup.add(createTaperedOrganicHorn([
                    [side * 0.24, -0.32, 0.07], [side * 0.32, -0.54, 0.08], [side * 0.27, -0.76, 0.06]
                ], 0.052, 0.65, obsidianArmorMat));
            }

            // VERSO: Placas blindadas de aço escuro rebitadas + Cristal âmbar vertical
            const backGroup = new THREE.Group();
            backGroup.position.z = -0.065;
            centerHub.add(backGroup);

            const backArmorPts = [
                [0, -0.56], [0.54, -0.30], [0.92, 0.14], [0.52, 0.36],
                [0, 0.26], [-0.52, 0.36], [-0.92, 0.14], [-0.54, -0.30]
            ];
            backGroup.add(new THREE.Mesh(createBeveledPolygon(backArmorPts, 0.13, 0.028, 0.032), backPlateSteelMat));

            const backRecessMesh = new THREE.Mesh(createBeveledPolygon(backArmorPts, 0.06, 0.02, 0.025), burnishedBronzeMat);
            backRecessMesh.scale.set(0.90, 0.88, 1.0);
            backRecessMesh.position.z = -0.055;
            backGroup.add(backRecessMesh);

            const backHousingPts = [[0, -0.38], [0.22, 0], [0, 0.38], [-0.22, 0]];
            const backHousingMesh = new THREE.Mesh(createBeveledPolygon(backHousingPts, 0.14, 0.022, 0.028), royalGoldMat);
            backHousingMesh.position.set(0, -0.02, -0.07);
            backGroup.add(backHousingMesh);

            const amberGeo = new THREE.OctahedronGeometry(1, 0);
            amberGeo.scale(0.15, 0.28, 0.10);
            const amberMesh = new THREE.Mesh(amberGeo, backAmberCrystalMat);
            amberMesh.position.set(0, -0.02, -0.145);
            backGroup.add(amberMesh);

            for (const side of [-1, 1]) {
                backGroup.add(createFiligreeScroll([
                    [side * 0.32, -0.26, -0.09], [side * 0.42, 0.02, -0.11], [side * 0.34, 0.26, -0.09]
                ], 0.038, darkSteelRimMat));

                const sideSlitGeo = new THREE.OctahedronGeometry(1, 0);
                sideSlitGeo.scale(0.055, 0.14, 0.05);
                const sideSlitMesh = new THREE.Mesh(sideSlitGeo, backAmberCrystalMat);
                sideSlitMesh.position.set(side * 0.56, 0.02, -0.095);
                sideSlitMesh.rotation.z = side * 0.18;
                backGroup.add(sideSlitMesh);

                [[side * 0.24, 0.22], [side * 0.46, -0.20], [side * 0.72, 0.12]].forEach(([rx, ry]) => {
                    const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.04, 6), royalGoldMat);
                    rivet.rotation.x = Math.PI / 2;
                    rivet.position.set(rx, ry, -0.095);
                    backGroup.add(rivet);
                });
            }

            // ------------------------------------------------------------------------
            // 5. ASAS CURVAS DE OBSIDIANA, GARRAS DE LAVA, RUNAS E CHIFRES DUPLOS
            // ------------------------------------------------------------------------
            function buildDetailedWing(side) {
                const wingGroup = new THREE.Group();
                const spinePts = [
                    [side * 0.60, -1.26, 0.0], [side * 1.22, -0.78, 0.03],
                    [side * 1.56, -0.04, 0.04], [side * 1.50, 0.80, 0.02], [side * 1.18, 1.52, -0.01]
                ];
                const spineCurve = new THREE.CatmullRomCurve3(spinePts.map(p => new THREE.Vector3(p[0], p[1], p[2])));
                const tubularSegs = 44, radialSegs = 14;
                const spineGeo = new THREE.TubeGeometry(spineCurve, tubularSegs, 0.22, radialSegs, false);

                const sPos = spineGeo.attributes.position, sv = new THREE.Vector3(), sc = new THREE.Vector3();
                for (let i = 0; i <= tubularSegs; i++) {
                    const t = i / tubularSegs;
                    spineCurve.getPointAt(t, sc);
                    const profile = Math.sin(t * Math.PI * 0.84 + 0.26) * 0.88 + 0.34;
                    for (let j = 0; j <= radialSegs; j++) {
                        const idx = i * (radialSegs + 1) + j;
                        sv.fromBufferAttribute(sPos, idx).sub(sc);
                        sv.x *= profile; sv.y *= profile; sv.z *= profile * 0.62;
                        sv.add(sc);
                        sPos.setXYZ(idx, sv.x, sv.y, sv.z);
                    }
                }
                spineGeo.computeVertexNormals();
                wingGroup.add(new THREE.Mesh(spineGeo, obsidianArmorMat));

                // Vértebras metálicas segmentadas ao longo da espinha
                for (let s = 1; s < 9; s++) {
                    const t = s / 9;
                    const pt = spineCurve.getPointAt(t);
                    const tangent = spineCurve.getTangentAt(t);
                    const plateScale = Math.sin(t * Math.PI * 0.85 + 0.25) * 0.85 + 0.4;
                    const plateMesh = new THREE.Mesh(
                        new THREE.BoxGeometry(0.36 * plateScale, 0.14, 0.25 * plateScale),
                        s % 2 === 0 ? darkSteelRimMat : burnishedBronzeMat
                    );
                    plateMesh.position.copy(pt);
                    plateMesh.rotation.z = Math.atan2(tangent.y, tangent.x) - Math.PI / 2;
                    wingGroup.add(plateMesh);
                }

                // Nervuras douradas frontal e traseira
                wingGroup.add(createFiligreeScroll([
                    [side * 0.65, -1.16, 0.12], [side * 1.15, -0.66, 0.14],
                    [side * 1.43, 0.04, 0.14], [side * 1.39, 0.82, 0.11], [side * 1.14, 1.44, 0.06]
                ], 0.048, royalGoldMat));

                wingGroup.add(createFiligreeScroll([
                    [side * 0.65, -1.16, -0.11], [side * 1.15, -0.66, -0.13],
                    [side * 1.43, 0.04, -0.13], [side * 1.39, 0.82, -0.10], [side * 1.14, 1.44, -0.06]
                ], 0.048, burnishedBronzeMat));

                // 5 Garras crescentes externas de magma com engastes chanfrados
                [
                    { x: 1.14, y: -0.92, rotZ: -0.78, scale: 0.80 },
                    { x: 1.40, y: -0.44, rotZ: -0.46, scale: 0.98 },
                    { x: 1.55, y: 0.09,  rotZ: -0.20, scale: 1.08 },
                    { x: 1.52, y: 0.60,  rotZ: 0.08,  scale: 0.96 },
                    { x: 1.36, y: 1.06,  rotZ: 0.30,  scale: 0.80 }
                ].forEach((c) => {
                    const claw = createDetailedMagmaClaw(c.scale, side === -1);
                    claw.position.set(side * c.x, c.y, 0.015);
                    claw.rotation.z = side * c.rotZ;
                    wingGroup.add(claw);
                });

                // 3 Garras internas menores
                [
                    { x: 0.96, y: -0.40, rotZ: 0.36, scale: 0.56 },
                    { x: 1.18, y: 0.20,  rotZ: 0.18, scale: 0.62 },
                    { x: 1.22, y: 0.76,  rotZ: -0.04, scale: 0.58 }
                ].forEach((ic) => {
                    const innerClaw = createDetailedMagmaClaw(ic.scale, side === 1);
                    innerClaw.position.set(side * ic.x, ic.y, 0.025);
                    innerClaw.rotation.z = side * ic.rotZ;
                    wingGroup.add(innerClaw);
                });

                // 4 Runas losangulares brilhantes em engaste de obsidiana
                [
                    { x: 1.18, y: -0.34, rotZ: -0.32, s: 0.15 },
                    { x: 1.34, y: 0.24,  rotZ: -0.08, s: 0.17 },
                    { x: 1.31, y: 0.80,  rotZ: 0.14,  s: 0.16 },
                    { x: 1.16, y: 1.26,  rotZ: 0.28,  s: 0.13 }
                ].forEach((r) => {
                    const socketGeo = new THREE.OctahedronGeometry(1, 0);
                    socketGeo.scale(r.s * 0.78, r.s * 1.15, 0.11);
                    const socketMesh = new THREE.Mesh(socketGeo, obsidianArmorMat);
                    socketMesh.position.set(side * r.x, r.y, 0.05);
                    socketMesh.rotation.z = side * r.rotZ;
                    wingGroup.add(socketMesh);

                    const gemGeo = new THREE.OctahedronGeometry(1, 0);
                    gemGeo.scale(r.s * 0.54, r.s * 0.86, 0.145);
                    const gemMesh = new THREE.Mesh(gemGeo, backAmberCrystalMat);
                    gemMesh.position.set(side * r.x, r.y, 0.05);
                    gemMesh.rotation.z = side * r.rotZ;
                    wingGroup.add(gemMesh);
                });

                // Barbatana translúcida carmesim na base
                const finGroup = new THREE.Group();
                finGroup.position.set(side * 0.74, -1.20, -0.01);
                const mainFinPts = [
                    [0, 0], [side * 0.76, -0.16], [side * 0.46, -0.34],
                    [side * 0.62, -0.52], [side * 0.18, -0.48], [-side * 0.06, -0.24]
                ];
                const mainFinMesh = new THREE.Mesh(createBeveledPolygon(mainFinPts, 0.032, 0.012, 0.014), crimsonCrystalFinMat);
                mainFinMesh.position.set(side * 0.30, -0.24, 0);
                finGroup.add(mainFinMesh);

                finGroup.add(createTaperedOrganicHorn([
                    [0, 0.06, 0.05], [side * 0.38, -0.06, 0.06], [side * 0.74, -0.28, 0.03]
                ], 0.085, 0.58, royalGoldMat));
                wingGroup.add(finGroup);

                // Chifres duplos curvos no topo
                wingGroup.add(createTaperedOrganicHorn([
                    [side * 1.15, 1.40, 0.01], [side * 1.36, 1.84, 0.04],
                    [side * 1.18, 2.28, 0.02], [side * 0.86, 2.62, -0.02]
                ], 0.13, 0.56, magmaCoreMat));

                wingGroup.add(createTaperedOrganicHorn([
                    [side * 1.15, 1.36, 0.01], [side * 1.30, 1.68, 0.03], [side * 1.24, 1.98, 0.02]
                ], 0.155, 0.62, obsidianArmorMat));

                wingGroup.add(createTaperedOrganicHorn([
                    [side * 1.32, 1.20, -0.02], [side * 1.56, 1.54, -0.01], [side * 1.52, 1.96, -0.03]
                ], 0.095, 0.55, magmaCoreMat));

                wingGroup.add(createTaperedOrganicHorn([
                    [side * 1.02, 1.28, 0.03], [side * 0.94, 1.56, 0.04], [side * 0.82, 1.82, 0.02]
                ], 0.062, 0.6, royalGoldMat));

                return wingGroup;
            }

            rootGroup.add(buildDetailedWing(-1));
            rootGroup.add(buildDetailedWing(1));

            // ------------------------------------------------------------------------
            // 6. SOL CENTRALIZADO NO MEIO DO EMBLEMA (X=0, Y=0.35, Z=0)
            // ------------------------------------------------------------------------
            const centralSunGroup = new THREE.Group();
            centralSunGroup.name = 'CentralBlazingSun';
            centralSunGroup.position.set(0, 0.35, 0);
            rootGroup.add(centralSunGroup);

            // Textura de plasma fervente animado
            const sunCanvas = document.createElement('canvas');
            sunCanvas.width = sunCanvas.height = 512;
            const sCtx = sunCanvas.getContext('2d');
            sCtx.fillStyle = '#ff8c00';
            sCtx.fillRect(0, 0, 512, 512);

            for (let i = 0; i < 1500; i++) {
                const x = Math.random() * 512, y = Math.random() * 512, r = 3 + Math.random() * 14;
                const grad = sCtx.createRadialGradient(x, y, 0, x, y, r);
                if (Math.random() > 0.30) {
                    grad.addColorStop(0, 'rgba(255, 253, 215, 0.88)');
                    grad.addColorStop(0.55, 'rgba(255, 175, 20, 0.45)');
                    grad.addColorStop(1, 'rgba(235, 55, 0, 0)');
                } else {
                    grad.addColorStop(0, 'rgba(130, 18, 0, 0.72)');
                    grad.addColorStop(0.65, 'rgba(220, 65, 0, 0.35)');
                    grad.addColorStop(1, 'rgba(255, 120, 0, 0)');
                }
                sCtx.fillStyle = grad;
                sCtx.beginPath();
                sCtx.arc(x, y, r, 0, Math.PI * 2);
                sCtx.fill();
            }

            const solarMap = wrapTex(new THREE.CanvasTexture(sunCanvas));
            const sunCoreMat = new THREE.MeshStandardMaterial({
                map: solarMap, emissiveMap: solarMap,
                emissive: new THREE.Color('#ffae2b'), emissiveIntensity: 2.35,
                color: new THREE.Color('#fff1b8'), roughness: 0.15
            });
            const sunCoreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 48), sunCoreMat);
            centralSunGroup.add(sunCoreMesh);

            // Corona solar multi-camada aditiva
            const innerCoronaMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.51, 32, 32),
                new THREE.MeshBasicMaterial({ color: '#ffcf54', transparent: true, opacity: 0.36, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide })
            );
            centralSunGroup.add(innerCoronaMesh);

            const outerAuraMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.66, 32, 32),
                new THREE.MeshBasicMaterial({ color: '#ff5e00', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide })
            );
            centralSunGroup.add(outerAuraMesh);

            const glowCanvas = document.createElement('canvas');
            glowCanvas.width = glowCanvas.height = 256;
            const gCtx = glowCanvas.getContext('2d');
            const radialGlow = gCtx.createRadialGradient(128, 128, 12, 128, 128, 128);
            radialGlow.addColorStop(0.0, 'rgba(255, 250, 210, 0.95)');
            radialGlow.addColorStop(0.28, 'rgba(255, 185, 45, 0.62)');
            radialGlow.addColorStop(0.62, 'rgba(255, 78, 0, 0.24)');
            radialGlow.addColorStop(1.0, 'rgba(255, 30, 0, 0.0)');
            gCtx.fillStyle = radialGlow;
            gCtx.fillRect(0, 0, 256, 256);

            const sunGlowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: new THREE.CanvasTexture(glowCanvas), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
            }));
            sunGlowSprite.scale.set(2.15, 2.15, 1);
            centralSunGroup.add(sunGlowSprite);

            // Luz interna quente do Sol
            const sunInnerLight = { intensity: 0 };

            // 24 Raios Solares Esculpidos (12 principais + 12 secundários)
            const primaryRaysGroup = new THREE.Group();
            const secondaryRaysGroup = new THREE.Group();
            centralSunGroup.add(primaryRaysGroup);
            centralSunGroup.add(secondaryRaysGroup);

            const solarRayGoldMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#ffd369'), emissive: new THREE.Color('#ff7b00'),
                emissiveIntensity: 1.55, metalness: 0.78, roughness: 0.22
            });

            for (let i = 0; i < 12; i++) {
                const rayHolder = new THREE.Group();
                rayHolder.rotation.z = (i / 12) * Math.PI * 2;
                const rayBlade = createSculptedPlumeBlade(0.46, 0.10, i % 2 === 0 ? 0.045 : -0.045, solarRayGoldMat, magmaCoreMat);
                rayBlade.position.set(0, 0.40, 0);
                rayHolder.add(rayBlade);
                primaryRaysGroup.add(rayHolder);
            }

            for (let i = 0; i < 12; i++) {
                const secHolder = new THREE.Group();
                secHolder.rotation.z = ((i + 0.5) / 12) * Math.PI * 2;
                secHolder.add(createTaperedOrganicHorn([[0, 0.41, 0], [0.02, 0.56, 0.01], [0, 0.71, 0]], 0.036, 0.55, magmaCoreMat));
                secondaryRaysGroup.add(secHolder);
            }

            // 6 Arcos de Erupção Solar (Protuberâncias)
            const prominencesGroup = new THREE.Group();
            centralSunGroup.add(prominencesGroup);
            for (let p = 0; p < 6; p++) {
                const promHolder = new THREE.Group();
                promHolder.rotation.z = (p / 6) * Math.PI * 2 + 0.25;
                promHolder.rotation.y = (p % 2 === 0 ? 0.22 : -0.22);
                promHolder.add(createFiligreeScroll([
                    [-0.14, 0.39, 0.0], [-0.18, 0.53, 0.04], [0.0, 0.60, 0.05], [0.18, 0.53, 0.04], [0.14, 0.39, 0.0]
                ], 0.022, magmaCoreMat));
                prominencesGroup.add(promHolder);
            }

            // Anel Astrolábio Rúnico com 8 Runas Orbitais
            const astrolabeRingGroup = new THREE.Group();
            centralSunGroup.add(astrolabeRingGroup);
            astrolabeRingGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.014, 12, 64), royalGoldMat));
            astrolabeRingGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.006, 8, 64), solarRayGoldMat));

            for (let r = 0; r < 8; r++) {
                const rAngle = (r / 8) * Math.PI * 2;
                const runePin = new THREE.Mesh(new THREE.OctahedronGeometry(0.032, 0), backAmberCrystalMat);
                runePin.scale.set(0.75, 1.35, 0.55);
                runePin.position.set(Math.cos(rAngle) * 0.68, Math.sin(rAngle) * 0.68, 0);
                runePin.rotation.z = rAngle - Math.PI / 2;
                astrolabeRingGroup.add(runePin);
            }

            // Poeira Solar Cintilante Orbitando o Sol
            const dustCount = 48;
            const dustGeo = new THREE.BufferGeometry();
            const dustPositions = new Float32Array(dustCount * 3);
            for (let d = 0; d < dustCount; d++) {
                const ang = (d / dustCount) * Math.PI * 2;
                const rad = 0.52 + Math.random() * 0.34;
                dustPositions[d * 3] = Math.cos(ang) * rad;
                dustPositions[d * 3 + 1] = Math.sin(ang) * rad;
                dustPositions[d * 3 + 2] = (Math.random() - 0.5) * 0.24;
            }
            dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
            const solarDustPoints = new THREE.Points(dustGeo, new THREE.PointsMaterial({
                color: '#ffe484', size: 0.028, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending
            }));
            centralSunGroup.add(solarDustPoints);

            // ------------------------------------------------------------------------
            // 7. MÉTODO DE ANIMAÇÃO PARA CHAMAR NO LOOP DO JOGO: item.userData.update(t)
            // ------------------------------------------------------------------------
            rootGroup.userData.update = function (elapsedTime, speedMultiplier = 1.0) {
                const t = elapsedTime * speedMultiplier;
                magmaMap.offset.y = (t * 0.06) % 1;
                obsidianEmissive.offset.x = Math.sin(t * 0.4) * 0.03;

                magmaCoreMat.emissiveIntensity = 1.65 + Math.sin(t * 3.4) * 0.35;
                obsidianArmorMat.emissiveIntensity = 0.80 + Math.sin(t * 2.6 + 1.0) * 0.25;
                frontRubyMat.emissiveIntensity = 1.60 + Math.sin(t * 4.2) * 0.30;
                backAmberCrystalMat.emissiveIntensity = 1.70 + Math.cos(t * 4.2) * 0.30;

                solarMap.offset.x = (t * 0.035) % 1;
                solarMap.offset.y = (t * 0.022) % 1;
                sunCoreMesh.rotation.y = t * 0.28;
                sunCoreMesh.rotation.x = Math.sin(t * 0.35) * 0.14;

                const sunPulse = 1.0 + Math.sin(t * 3.2) * 0.035;
                sunCoreMesh.scale.setScalar(sunPulse);
                innerCoronaMesh.scale.setScalar(1.0 + Math.sin(t * 3.2 + 0.6) * 0.055);
                outerAuraMesh.scale.setScalar(1.0 + Math.cos(t * 2.6) * 0.07);
                sunGlowSprite.scale.setScalar(2.15 + Math.sin(t * 3.0) * 0.16);
                sunCoreMat.emissiveIntensity = 2.2 + Math.sin(t * 3.8) * 0.35;
                sunInnerLight.intensity = 10.5 + Math.sin(t * 3.8) * 2.2;

                primaryRaysGroup.rotation.z = t * 0.16;
                secondaryRaysGroup.rotation.z = -t * 0.24;
                prominencesGroup.rotation.z = t * 0.11;
                astrolabeRingGroup.rotation.z = -t * 0.19;
                astrolabeRingGroup.rotation.x = Math.sin(t * 0.6) * 0.16;
                solarDustPoints.rotation.z = t * 0.22;
            };

            return rootGroup;
        }
  // Astrolábio Arcano (feito pelo Geanderson em HTML)
  function createArcaneAstrolabe(THREE) {
        function createRunicRingTexture(repeatCount = 28, bgColor = '#071329', runeColor = '#00e5ff') {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');

            // Fundo azul-escuro metálico
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Bordas douradas finas
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(0, 0, canvas.width, 10);
            ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

            // Desenho procedural de runas místicas
            ctx.strokeStyle = runeColor;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = '#0088ff';
            ctx.shadowBlur = 8;

            const step = canvas.width / repeatCount;
            for (let i = 0; i < repeatCount; i++) {
                const cx = i * step + step * 0.5;
                const cy = canvas.height * 0.5;
                const r = 24; 

                ctx.save();
                ctx.translate(cx, cy);
                ctx.beginPath();

                const type = i % 6;
                if (type === 0) {
                    // Runa estilo Ansuz / Othala
                    ctx.moveTo(0, -r); ctx.lineTo(0, r);
                    ctx.moveTo(0, -r * 0.6); ctx.lineTo(r * 0.6, -r * 0.1);
                    ctx.moveTo(0, 0); ctx.lineTo(r * 0.6, r * 0.5);
                } else if (type === 1) {
                    // Runa estilo Algiz
                    ctx.moveTo(0, -r); ctx.lineTo(0, r);
                    ctx.moveTo(-r * 0.6, -r * 0.6); ctx.lineTo(0, 0); ctx.lineTo(r * 0.6, -r * 0.6);
                } else if (type === 2) {
                    // Runa estilo Dagaz / Ampulheta
                    ctx.moveTo(-r * 0.5, -r * 0.7); ctx.lineTo(r * 0.5, r * 0.7);
                    ctx.lineTo(r * 0.5, -r * 0.7); ctx.lineTo(-r * 0.5, r * 0.7);
                    ctx.closePath();
                } else if (type === 3) {
                    // Runa estilo Gebo + círculo
                    ctx.moveTo(-r * 0.5, -r * 0.6); ctx.lineTo(r * 0.5, r * 0.6);
                    ctx.moveTo(r * 0.5, -r * 0.6); ctx.lineTo(-r * 0.5, r * 0.6);
                    ctx.moveTo(r * 0.25, 0); ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
                } else if (type === 4) {
                    // Runa estilo Berkano
                    ctx.moveTo(-r * 0.3, -r); ctx.lineTo(-r * 0.3, r);
                    ctx.lineTo(r * 0.4, r * 0.45); ctx.lineTo(-r * 0.3, 0);
                    ctx.lineTo(r * 0.4, -r * 0.45); ctx.closePath();
                } else {
                    // Estrela arcana
                    ctx.moveTo(0, -r); ctx.lineTo(0, r);
                    ctx.moveTo(-r * 0.7, 0); ctx.lineTo(r * 0.7, 0);
                    ctx.moveTo(-r * 0.4, -r * 0.4); ctx.lineTo(r * 0.4, r * 0.4);
                }
                ctx.stroke();

                // Ponto divisor entre runas
                ctx.beginPath();
                ctx.arc(step * 0.5, 0, 3, 0, Math.PI * 2);
                ctx.fillStyle = runeColor;
                ctx.fill();

                ctx.restore();
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        // Gera textura de aura radial suave
        function createGlowTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
            grad.addColorStop(0, 'rgba(0, 210, 255, 0.85)');
            grad.addColorStop(0.35, 'rgba(0, 110, 255, 0.35)');
            grad.addColorStop(0.7, 'rgba(10, 40, 140, 0.1)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 512);
            return new THREE.CanvasTexture(canvas);
        }

        const runicTexture = createRunicRingTexture(32);
        const orbitalRunicTexture = createRunicRingTexture(40, '#091a3a', '#38bdf8');
        const glowTexture = createGlowTexture();

        // Materiais PBR
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4c44e,
            metalness: 0.88,
            roughness: 0.22,
        });

        const darkGoldMaterial = new THREE.MeshStandardMaterial({
            color: 0xb88628,
            metalness: 0.85,
            roughness: 0.32,
        });

        const crystalMaterial = new THREE.MeshStandardMaterial({
            color: 0x00bfff,
            emissive: 0x0088ff,
            emissiveIntensity: 2.2,
            roughness: 0.1,
            metalness: 0.1,
        });

        const coreCrystalMaterial = new THREE.MeshStandardMaterial({
            color: 0x80e5ff,
            emissive: 0x00aaff,
            emissiveIntensity: 2.8,
            roughness: 0.05,
            metalness: 0.1,
        });

        const runicBandMaterial = new THREE.MeshStandardMaterial({
            map: runicTexture,
            emissiveMap: runicTexture,
            emissive: new THREE.Color(0x00ccff),
            emissiveIntensity: 1.6,
            metalness: 0.5,
            roughness: 0.3,
            side: THREE.DoubleSide
        });

        const orbitalRunicMaterial = new THREE.MeshStandardMaterial({
            map: orbitalRunicTexture,
            emissiveMap: orbitalRunicTexture,
            emissive: new THREE.Color(0x38bdf8),
            emissiveIntensity: 1.5,
            metalness: 0.6,
            roughness: 0.25,
            side: THREE.DoubleSide
        });

        function createDiamondCrystal(width, height, depth, material = crystalMaterial) {
            const geom = new THREE.OctahedronGeometry(1, 0);
            geom.scale(width, height, depth);
            return new THREE.Mesh(geom, material);
        }

        // Cria um brasão pontiagudo dourado (estilo fleur-de-lis / ponta cardinal)
        function createCardinalCrest(scale = 1) {
            const group = new THREE.Group();

            // Base losangular dourada extrudada
            const shape = new THREE.Shape();
            shape.moveTo(0, 1.35);
            shape.quadraticCurveTo(0.22, 0.45, 0.65, 0);
            shape.quadraticCurveTo(0.22, -0.35, 0, -0.85);
            shape.quadraticCurveTo(-0.22, -0.35, -0.65, 0);
            shape.quadraticCurveTo(-0.22, 0.45, 0, 1.35);

            const extrudeSettings = {
                depth: 0.16,
                bevelEnabled: true,
                bevelSegments: 3,
                steps: 1,
                bevelSize: 0.05,
                bevelThickness: 0.05
            };

            const baseGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            baseGeom.center();
            const baseMesh = new THREE.Mesh(baseGeom, goldMaterial);
            group.add(baseMesh);

            // Moldura interna escura
            const innerCrystal = createDiamondCrystal(0.24, 0.42, 0.16, crystalMaterial);
            innerCrystal.position.z = 0.06;
            group.add(innerCrystal);

            // Asas laterais curvas
            const wingGeom = new THREE.ConeGeometry(0.14, 0.75, 4);
            const leftWing = new THREE.Mesh(wingGeom, darkGoldMaterial);
            leftWing.position.set(-0.48, 0.15, 0);
            leftWing.rotation.z = Math.PI * 0.32;
            group.add(leftWing);

            const rightWing = new THREE.Mesh(wingGeom, darkGoldMaterial);
            rightWing.position.set(0.48, 0.15, 0);
            rightWing.rotation.z = -Math.PI * 0.32;
            group.add(rightWing);

            group.scale.setScalar(scale);
            return group;
        }

        // Cria uma corrente com cristal pingente
        function createHangingPendant(chainLength = 1.0, crystalScale = 1.0) {
            const pendantGroup = new THREE.Group();

            // Elos da corrente dourada
            const links = Math.max(2, Math.floor(chainLength / 0.18));
            const linkGeom = new THREE.TorusGeometry(0.045, 0.014, 8, 16);
            for (let i = 0; i < links; i++) {
                const link = new THREE.Mesh(linkGeom, goldMaterial);
                link.position.y = -i * 0.14;
                link.rotation.y = (i % 2) * (Math.PI / 2);
                pendantGroup.add(link);
            }

            const endY = -links * 0.14 - 0.08;

            // Encaixe dourado do cristal
            const capGeom = new THREE.ConeGeometry(0.14 * crystalScale, 0.25 * crystalScale, 4);
            const cap = new THREE.Mesh(capGeom, goldMaterial);
            cap.position.y = endY;
            pendantGroup.add(cap);

            // Pingente de cristal azul alongado
            const dropGeom = new THREE.OctahedronGeometry(1, 0);
            dropGeom.scale(0.14 * crystalScale, 0.45 * crystalScale, 0.14 * crystalScale);
            const dropCrystal = new THREE.Mesh(dropGeom, crystalMaterial);
            dropCrystal.position.y = endY - 0.35 * crystalScale;
            pendantGroup.add(dropCrystal);

            return pendantGroup;
        }

        const artifactRoot = new THREE.Group();
        artifactRoot.position.y = 0.25;

        // --- AURA DE FUNDO ---
        const auraPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(10.5, 10.5),
            new THREE.MeshBasicMaterial({
                map: glowTexture,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                opacity: 0.85
            })
        );
        auraPlane.position.z = -0.8;
        artifactRoot.add(auraPlane);

        // --- CAMADA 1: COROA EXTERNA ORNAMENTADA (GIRA NO SENTIDO HORÁRIO) ---
        const outerCrownGroup = new THREE.Group();
        artifactRoot.add(outerCrownGroup);

        // Anéis estruturais dourados externos
        const outerTorus1 = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.09, 16, 100), goldMaterial);
        const outerTorus2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.06, 16, 100), darkGoldMaterial);
        const blueEnergyRing = new THREE.Mesh(
            new THREE.TorusGeometry(2.70, 0.035, 12, 100),
            new THREE.MeshStandardMaterial({ color: 0x00d9ff, emissive: 0x0088ff, emissiveIntensity: 2.4 })
        );
        outerCrownGroup.add(outerTorus1, outerTorus2, blueEnergyRing);

        // 4 Pontas Cardeais Principais (Norte, Sul, Leste, Oeste)
        const cardinalAngles = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
        cardinalAngles.forEach((angle, idx) => {
            const crest = createCardinalCrest(idx === 2 ? 1.15 : 1.0); // Ponta inferior ligeiramente maior
            const radius = 2.85;
            crest.position.set(Math.sin(angle) * radius, Math.cos(angle) * radius, 0.08);
            crest.rotation.z = -angle;
            outerCrownGroup.add(crest);
        });

        // 4 Ornamentos Diagonais com Cristais Azuis e Chifres Dourados
        const diagAngles = [Math.PI / 4, (3 * Math.PI) / 4, -(3 * Math.PI) / 4, -Math.PI / 4];
        diagAngles.forEach((angle) => {
            const holder = new THREE.Group();
            const r = 2.70;
            holder.position.set(Math.sin(angle) * r, Math.cos(angle) * r, 0.05);
            holder.rotation.z = -angle;

            // Engaste circular dourado
            const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.055, 12, 32), goldMaterial);
            const gem = createDiamondCrystal(0.16, 0.16, 0.12, crystalMaterial);
            holder.add(bezel, gem);

            // Espigões curvos laterais (chifres arcanos)
            const hornGeom = new THREE.ConeGeometry(0.11, 0.95, 6);
            const hornL = new THREE.Mesh(hornGeom, goldMaterial);
            hornL.position.set(-0.35, 0.45, 0);
            hornL.rotation.z = 0.35;

            const hornR = new THREE.Mesh(hornGeom, goldMaterial);
            hornR.position.set(0.35, 0.45, 0);
            hornR.rotation.z = -0.35;

            holder.add(hornL, hornR);
            outerCrownGroup.add(holder);
        });

        // Pequenos cristais flutuantes ao redor da coroa externa
        const floatingShards = [];
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + 0.2;
            const shard = createDiamondCrystal(0.09, 0.16, 0.09, darkGoldMaterial);
            const dist = 3.55;
            shard.position.set(Math.cos(a) * dist, Math.sin(a) * dist, (i % 2 === 0 ? 0.2 : -0.2));
            shard.rotation.z = a - Math.PI / 2;
            outerCrownGroup.add(shard);
            floatingShards.push({ mesh: shard, baseDist: dist, angle: a, phase: i });
        }

        // --- CAMADA 2: COROA DE RUNAS INTERNA (GIRA NO SENTIDO ANTI-HORÁRIO!) ---
        const innerRunicCrownGroup = new THREE.Group();
        artifactRoot.add(innerRunicCrownGroup);

        // Faixa cilíndrica/anelar com textura de runas brilhantes
        const runicRingGeom = new THREE.RingGeometry(1.92, 2.42, 96, 1);
        // Ajusta UVs para envolver o anel perfeitamente
        const posAttr = runicRingGeom.attributes.position;
        const uvAttr = runicRingGeom.attributes.uv;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const angle = Math.atan2(y, x); // -PI a PI
            const radius = Math.sqrt(x * x + y * y);
            const u = (angle + Math.PI) / (Math.PI * 2);
            const v = (radius - 1.92) / (2.42 - 1.92);
            uvAttr.setXY(i, u, v);
        }
        const runicRingMesh = new THREE.Mesh(runicRingGeom, runicBandMaterial);
        innerRunicCrownGroup.add(runicRingMesh);

        // Aro dourado interno da coroa de runas
        const innerGoldRim = new THREE.Mesh(new THREE.TorusGeometry(1.90, 0.065, 16, 96), goldMaterial);
        innerRunicCrownGroup.add(innerGoldRim);

        // 8 Pinos/Garras douradas internas apontando para o centro
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 4), goldMaterial);
            const r = 1.72;
            tooth.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.04);
            tooth.rotation.z = angle + Math.PI / 2;
            innerRunicCrownGroup.add(tooth);
        }

        // --- CAMADA 3: ANÉIS ORBITAIS 3D INCLINADOS (ESFERA ARMILAR) ---
        const orbitalGroup1 = new THREE.Group();
        const orbitalGroup2 = new THREE.Group();
        artifactRoot.add(orbitalGroup1, orbitalGroup2);

        function buildOrbitalBand(radius) {
            const group = new THREE.Group();
            // Faixa cilíndrica fina com runas
            const cylGeom = new THREE.CylinderGeometry(radius, radius, 0.24, 96, 1, true);
            const cylMesh = new THREE.Mesh(cylGeom, orbitalRunicMaterial);
            cylMesh.rotation.x = Math.PI / 2;
            group.add(cylMesh);

            // Bordas douradas superior e inferior da faixa
            const rimTop = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.035, 12, 96), goldMaterial);
            rimTop.position.z = 0.12;
            const rimBot = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.035, 12, 96), goldMaterial);
            rimBot.position.z = -0.12;
            group.add(rimTop, rimBot);

            return group;
        }

        const orbitBand1 = buildOrbitalBand(3.35);
        orbitalGroup1.add(orbitBand1);
        orbitalGroup1.rotation.set(1.18, 0.28, 0.15);

        const orbitBand2 = buildOrbitalBand(3.35);
        orbitalGroup2.add(orbitBand2);
        orbitalGroup2.rotation.set(1.18, -0.28, -0.15);

        // --- CAMADA 4: ESTRELA CENTRAL E NÚCLEO DE CRISTAL ---
        const centerStarGroup = new THREE.Group();
        centerStarGroup.position.z = 0.18;
        artifactRoot.add(centerStarGroup);

        // Anel fino ao redor da estrela central
        const coreRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.045, 16, 80), goldMaterial);
        const coreBlueHalo = new THREE.Mesh(
            new THREE.TorusGeometry(1.26, 0.025, 12, 80),
            new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x0099ff, emissiveIntensity: 2.2 })
        );
        centerStarGroup.add(coreRing, coreBlueHalo);

        // Estrela dourada de 4 pontas alongadas
        const starShape = new THREE.Shape();
        starShape.moveTo(0, 1.55);
        starShape.quadraticCurveTo(0.22, 0.35, 1.55, 0);
        starShape.quadraticCurveTo(0.22, -0.35, 0, -1.55);
        starShape.quadraticCurveTo(-0.22, -0.35, -1.55, 0);
        starShape.quadraticCurveTo(-0.22, 0.35, 0, 1.55);

        const starExtrude = new THREE.ExtrudeGeometry(starShape, {
            depth: 0.18,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 1,
            bevelSize: 0.05,
            bevelThickness: 0.06
        });
        starExtrude.center();
        const starMesh = new THREE.Mesh(starExtrude, goldMaterial);
        centerStarGroup.add(starMesh);

        // Pontas secundárias diagonais da estrela
        const subStar = starMesh.clone();
        subStar.scale.set(0.45, 0.45, 0.8);
        subStar.rotation.z = Math.PI / 4;
        subStar.material = darkGoldMaterial;
        centerStarGroup.add(subStar);

        // Grande Cristal Azul Central (Núcleo de Energia)
        const centralDiamond = createDiamondCrystal(0.42, 0.42, 0.28, coreCrystalMaterial);
        centralDiamond.position.z = 0.12;
        centerStarGroup.add(centralDiamond);

        // --- CAMADA 5: PINGENTES DE CRISTAL SUSPENSOS ---
        const pendantsData = [
            { x: -2.45, y: -1.65, len: 0.55, scale: 0.85 },
            { x: -1.85, y: -2.25, len: 0.95, scale: 1.15 },
            { x: -1.10, y: -2.65, len: 0.65, scale: 0.75 },
            { x: 1.10,  y: -2.65, len: 0.65, scale: 0.75 },
            { x: 1.85,  y: -2.25, len: 0.95, scale: 1.15 },
            { x: 2.45,  y: -1.65, len: 0.55, scale: 0.85 },
        ];

        const pendantMeshes = [];
        pendantsData.forEach((p, index) => {
            const pendant = createHangingPendant(p.len, p.scale);
            pendant.position.set(p.x, p.y, 0.05);
            artifactRoot.add(pendant);
            pendantMeshes.push({ mesh: pendant, phase: index * 1.1 });
        });

        // --- CAMADA 6: PARTÍCULAS DE ENERGIA MÁGICA ---
        const particleCount = 140;
        const particleGeom = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSpeeds = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.2 + Math.random() * 3.2;
            particlePositions[i * 3] = Math.cos(angle) * radius;
            particlePositions[i * 3 + 1] = Math.sin(angle) * radius - 0.5;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
            particleSpeeds[i] = 0.008 + Math.random() * 0.018;
        }

        particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.09,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const energyParticles = new THREE.Points(particleGeom, particleMat);
        artifactRoot.add(energyParticles);


        artifactRoot.userData.update = function (delta, elapsed) {
            const speed = delta;
            outerCrownGroup.rotation.z -= 0.35 * speed;
            innerRunicCrownGroup.rotation.z += 0.55 * speed;
            orbitBand1.rotation.z += 0.45 * speed;
            orbitBand2.rotation.z -= 0.45 * speed;
            const pulse = 1 + Math.sin(elapsed * 3.2) * 0.06;
            centralDiamond.scale.setScalar(pulse);
            coreCrystalMaterial.emissiveIntensity = 2.4 + Math.sin(elapsed * 3.2) * 0.7;
            pendantMeshes.forEach((item) => { item.mesh.rotation.z = Math.sin(elapsed * 2.0 + item.phase) * 0.08; item.mesh.rotation.x = Math.cos(elapsed * 1.5 + item.phase) * 0.04; });
            floatingShards.forEach((s) => { const r = s.baseDist + Math.sin(elapsed * 2.5 + s.phase) * 0.12; s.mesh.position.x = Math.cos(s.angle) * r; s.mesh.position.y = Math.sin(s.angle) * r; });
            const positions = energyParticles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) { positions[i * 3 + 1] += particleSpeeds[i] * 60 * delta; if (positions[i * 3 + 1] > 3.6) { const angle = Math.random() * Math.PI * 2; const radius = 1.0 + Math.random() * 2.8; positions[i * 3] = Math.cos(angle) * radius; positions[i * 3 + 1] = -3.2; } }
            energyParticles.geometry.attributes.position.needsUpdate = true;
        };
        return artifactRoot;
  }
  // Armadura do Arauto das Chamas (feita a partir do modelo do Geanderson)
  function fazArauto(T, P, S) { S = S || 1; const L = [];
  const mat = (c, m, r, e, i) => new T.MeshStandardMaterial({ color: c, metalness: m, roughness: r, emissive: e || 0, emissiveIntensity: i || 0 });
  const M = { obs: mat(0x30343f, .55, .38), black: mat(0x14171e, .45, .45), steel: mat(0xa4a2ac, .6, .3), gold: mat(0xd89a3a, .6, .3, 0x3a1a00, .3), bgold: mat(0xffc85a, .55, .25, 0x8b3b08, .6), red: mat(0x8e160b, .6, .3, 0x6b1004, .7), ember: mat(0xff5a10, .4, .2, 0xff2600, 2.2), ruby: mat(0xff341e, .4, .15, 0xff1700, 1.6), leather: mat(0x2e1a12, .15, .75) };
  const add = (par, g, m, x, y, z) => { const o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; par.add(o); L.push(o); return o; };
  const sph = (par, m, p, s) => { const o = add(par, new T.SphereGeometry(1, 20, 14), m, ...p); o.scale.set(...s); return o; };
  const cyl = (par, m, a, b, r1, r2) => { const d = new T.Vector3(...b).sub(new T.Vector3(...a)); const o = add(par, new T.CylinderGeometry(r2, r1, d.length(), 12), m, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); return o; };
  const plate = (par, m, pts, depth, z) => { const sh = new T.Shape(); sh.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => sh.lineTo(p[0], p[1])); sh.closePath(); const o = add(par, new T.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: depth * .3, bevelThickness: depth * .25 }), m, 0, 0, z || 0); return o; };
  const curve = (par, pts, r, m) => add(par, new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p => new T.Vector3(...p))), 32, r, 7, false), m);
  // ===== TRONCO (spine: origem na cintura, peito ~0.38, pescoço 0.6) =====
  const sp = P.spine;
  sph(sp, M.obs, [0, 0.38, 0], [0.235, 0.25, 0.165]); // couraça
  cyl(sp, M.obs, [0, .0, 0], [0, .26, 0], .205, .22).scale.z = .76; cyl(P.hips, M.obs, [0, .02, 0], [0, -.12, 0], .2, .215).scale.z = .78;
  plate(sp, M.steel, [[-.2, .55], [0, .6], [.2, .55], [.17, .3], [0, .22], [-.17, .3]], .03, .135);
  plate(sp, M.obs, [[-.15, .52], [0, .56], [.15, .52], [.12, .33], [0, .27], [-.12, .33]], .02, .16);
  curve(sp, [[-.15, .52, .19], [-.09, .42, .195], [0, .34, .2], [.09, .42, .195], [.15, .52, .19]], .011, M.gold);
  sph(sp, M.ruby, [0, .44, .2], [.04, .055, .02]);
  plate(sp, M.obs, [[-.19, .54], [0, .59], [.19, .54], [.15, .3], [0, .24], [-.15, .3]], .03, -.165);
  cyl(sp, M.gold, [0, .02, 0], [0, .07, 0], .2, .2).scale.z = .75; // cinto
  sph(sp, M.bgold, [0, .045, .155], [.035, .03, .015]);
  // mochila/arnês
  const pack = new T.Group(); sp.add(pack); pack.position.set(0, .4, -.19);
  add(pack, new T.BoxGeometry(.24, .3, .08), M.obs); add(pack, new T.BoxGeometry(.19, .25, .03), M.gold, 0, 0, -.05); add(pack, new T.BoxGeometry(.15, .21, .02), M.black, 0, 0, -.07);
  [-1, 1].forEach(s => { curve(pack, [[s * .09, .14, -.07], [s * .14, .06, -.08], [s * .14, -.09, -.07]], .014, M.bgold); sph(pack, M.red, [s * .13, -.02, -.085], [.025, .055, .02]);
    curve(sp, [[s * .07, .58, -.12], [s * .12, .48, -.18], [s * .15, .36, -.18]], .013, M.gold); });
  // BRASÃO ÍGNEO nas costas (escala do original)
  const crest = new T.Group(); sp.add(crest); crest.position.set(0, .44, -.32); crest.scale.setScalar(.36); L.crest = crest;
  { const ring = add(crest, new T.TorusGeometry(.78, .075, 12, 72), M.gold); ring.scale.set(1.15, 1.25, 1); add(crest, new T.TorusGeometry(.62, .025, 8, 64), M.bgold, 0, 0, .025);
    add(crest, new T.OctahedronGeometry(.23, 1), M.ruby, 0, -.02, .12).scale.set(.8, 1.2, .55); add(crest, new T.OctahedronGeometry(.11, 1), M.bgold, 0, -.02, .24);
    for (const s of [-1, 1]) {
      curve(crest, [[s * .58, -.42, 0], [s * .95, -.12, .02], [s * 1.08, .38, 0], [s * 1.02, .85, 0], [s * .78, 1.18, .02], [s * .72, 1.52, .04]], .105, M.obs);
      curve(crest, [[s * .63, -.38, .11], [s * .98, -.08, .12], [s * 1.12, .4, .1], [s * 1.05, .83, .1], [s * .82, 1.17, .1], [s * .76, 1.48, .1]], .045, M.bgold);
      curve(crest, [[s * .76, -.22, .16], [s * 1.0, .18, .17], [s * .96, .62, .16], [s * .79, .95, .16]], .035, M.ember);
      curve(crest, [[s * .35, -.55, .05], [s * .66, -.28, .07], [s * .72, .12, .08], [s * .52, .36, .09], [s * .39, .65, .1], [s * .48, .88, .12]], .09, M.steel);
      curve(crest, [[s * .4, -.5, .15], [s * .68, -.2, .16], [s * .7, .12, .17], [s * .5, .38, .17]], .035, M.gold);
      for (let j = 0; j < 2; j++) { const xx = s * (.72 + j * .18), yy = -.58 - j * .08; curve(crest, [[s * .45, yy, .08], [xx, yy - .08, .1], [s * (1.05 + j * .08), yy - .32, .1], [s * (1.12 + j * .12), yy - .53, .12]], .07, j === 0 ? M.red : M.obs); curve(crest, [[s * .55, yy - .03, .16], [xx, yy - .14, .17], [s * 1.0, yy - .36, .17]], .025, M.ember); }
      for (let j = 0; j < 3; j++) curve(crest, [[s * (.55 + j * .12), .15 + j * .2, .02], [s * (.78 + j * .13), .27 + j * .2, .03], [s * (.9 + j * .13), .52 + j * .18, .04]], .035, M.gold);
      add(crest, new T.OctahedronGeometry(.13, 1), M.ember, s * .48, .12, .16).scale.set(.7, 1.5, .5); }
    curve(crest, [[-.48, .62, 0], [0, .83, .02], [.48, .62, 0]], .07, M.steel); curve(crest, [[-.38, -.55, .02], [0, -.9, .02], [.38, -.55, .02]], .09, M.obs); curve(crest, [[0, -.58, .12], [0, -.98, .12]], .035, M.bgold);
    crest.rotation.y = Math.PI; }
  // ===== SAIA DE PLACAS (hips) =====
  for (let i = 0; i < 5; i++) { const x = (i - 2) * .072; plate(P.hips, M.obs, [[x - .05, .0], [x + .05, .0], [x + .068, -.2], [x, -.25], [x - .068, -.2]], .03, .12); curve(P.hips, [[x - .035, -.02, .165], [x, -.12, .17], [x, -.2, .165]], .007, M.gold); }
  for (let i = 0; i < 4; i++) { const x = (i - 1.5) * .08; plate(P.hips, M.obs, [[x - .05, .0], [x + .05, .0], [x + .06, -.18], [x, -.22], [x - .06, -.18]], .03, -.16); }
  // ===== OMBROS E BRAÇOS =====
  ['L', 'R'].forEach((sd, i) => { const s = i ? 1 : -1, sh = P['sh' + sd], el = P['el' + sd];
    sph(sh, M.obs, [s * .03, .03, 0], [.13, .115, .12]); sph(sh, M.steel, [s * .04, .05, .04], [.115, .088, .105]);
    for (let k = 0; k < 3; k++) curve(sh, [[s * .03, .1, .06], [s * (.08 + k * .03), .19 - k * .03, .03], [s * (.13 + k * .03), .1 - k * .035, .02]], .017, k === 0 ? M.gold : M.obs);
    sph(sh, M.bgold, [s * .06, .07, .13], [.03, .03, .014]);
    cyl(sh, M.obs, [0, -.05, 0], [0, -.25, 0], .07, .075);
    cyl(el, M.steel, [0, -.04, 0], [0, -.22, 0], .066, .06); for (let j = 0; j < 3; j++) add(el, new T.TorusGeometry(.067, .007, 6, 18), M.gold, 0, -.07 - j * .05, 0).rotation.x = Math.PI / 2;
    sph(el, M.black, [0, -.29, .01], [.062, .07, .056]);
    // pernas
    const th = P['th' + sd], kn = P['kn' + sd], ft = P['ft' + sd];
    if (th) cyl(th, M.leather, [0, -.04, 0], [0, -.38, 0], .085, .075);
    sph(kn, M.obs, [0, 0, .04], [.078, .088, .07]); sph(kn, M.gold, [0, 0, .1], [.04, .046, .018]);
    cyl(kn, M.steel, [0, -.06, 0], [0, -.38, 0], .07, .06); plate(kn, M.obs, [[-.06, -.06], [.06, -.06], [.045, -.34], [0, -.38], [-.045, -.34]], .03, .055);
    curve(kn, [[-.04, -.1, .095], [0, -.17, .1], [.04, -.1, .095]], .008, M.bgold);
    sph(ft, M.black, [0, .005, .05], [.085, .066, .15]); });
  // ===== ELMO =====
  const hd = P.head; const H = new T.Group(); hd.add(H); H.position.set(0, .14, 0);
  sph(H, M.obs, [0, 0, 0], [.235, .27, .245]);
  plate(H, M.steel, [[-.18, .1], [0, .22], [.18, .1], [.16, -.12], [0, -.2], [-.16, -.12]], .04, .17);
  plate(H, M.black, [[-.13, .07], [0, .14], [.13, .07], [.11, -.06], [0, -.12], [-.11, -.06]], .02, .215);
  curve(H, [[-.1, .02, .245], [0, .0, .255], [.1, .02, .245]], .012, M.ember);
  sph(H, M.ruby, [0, .11, .23], [.025, .04, .015]);
  for (const s of [-1, 1]) { curve(H, [[s * .12, .1, .15], [s * .2, .25, .08], [s * .27, .36, -.02]], .03, M.gold); curve(H, [[s * .05, .12, .22], [s * .06, .2, .2], [s * .1, .26, .17]], .01, M.ember); }
  // esconder cabelo/capuz do personagem (o elmo cobre)
  return L; }

