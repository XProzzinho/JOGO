  // ===================== GELOSK ARCANO: 5 ataques do Astrolábio (módulo enviado pelo usuário, adaptado) =====================
    function createFrostArcaneSkills(THREE, scene, options = {}) {
      const onHitTarget = options.onHitTarget || (() => {});
      const onCameraShake = options.onCameraShake || (() => {});
      const onCasterAnim = options.onCasterAnim || (() => {});

      const activeEffects = [];

      // -----------------------------------------------------------------------
      // 1. GERADORES DE TEXTURAS PROCEDURAIS (CÍRCULOS RÚNICOS E PARTÍCULAS)
      // -----------------------------------------------------------------------
      function createFrostParticleTexture() {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(size / 2, size / 2, 1, size / 2, size / 2, size / 2);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
        grad.addColorStop(0.25, 'rgba(186, 230, 253, 0.95)');
        grad.addColorStop(0.55, 'rgba(0, 229, 255, 0.55)');
        grad.addColorStop(1.0, 'rgba(2, 132, 199, 0.0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        return new THREE.CanvasTexture(canvas);
      }

      function createMagicCircleTexture() {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        const cx = size / 2;
        const cy = size / 2;

        ctx.clearRect(0, 0, size, size);
        ctx.strokeStyle = '#00e5ff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;

        // Anéis concêntricos
        [235, 212, 165, 110, 58].forEach((r, idx) => {
          ctx.lineWidth = idx % 2 === 0 ? 4 : 2;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Estrela de 8 pontas / Octograma arcano
        ctx.lineWidth = 2.5;
        for (let s = 0; s < 2; s++) {
          ctx.beginPath();
          for (let i = 0; i <= 4; i++) {
            const ang = (i * Math.PI) / 2 + (s * Math.PI) / 4;
            const px = cx + Math.cos(ang) * 212;
            const py = cy + Math.sin(ang) * 212;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        // Glifos rúnicos entre os anéis externos
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.2;
        const glyphs = 24;
        for (let i = 0; i < glyphs; i++) {
          const ang = (i / glyphs) * Math.PI * 2;
          ctx.save();
          ctx.translate(cx + Math.cos(ang) * 188, cy + Math.sin(ang) * 188);
          ctx.rotate(ang + Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(-6, -8);
          ctx.lineTo(0, 8);
          ctx.lineTo(6, -8);
          ctx.moveTo(-5, 0);
          ctx.lineTo(5, 0);
          ctx.stroke();
          ctx.restore();
        }

        return new THREE.CanvasTexture(canvas);
      }

      function createRunicRingStripTexture() {
        const w = 512;
        const h = 64;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#00e5ff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(w, 8);
        ctx.moveTo(0, h - 8);
        ctx.lineTo(w, h - 8);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 16; i++) {
          const x = (i + 0.5) * (w / 16);
          ctx.beginPath();
          ctx.moveTo(x - 6, 18);
          ctx.lineTo(x + 6, h - 18);
          ctx.moveTo(x + 6, 18);
          ctx.lineTo(x - 6, h - 18);
          ctx.moveTo(x, 15);
          ctx.lineTo(x, h - 15);
          ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        return tex;
      }

      const frostParticleTex = createFrostParticleTexture();
      const magicCircleTex = createMagicCircleTexture();
      const ringStripTex = createRunicRingStripTexture();

      // -----------------------------------------------------------------------
      // 2. MATERIAIS & SHADERS GLSL CUSTOMIZADOS EM AZUL CLARO / GELOSK ARCANO
      // -----------------------------------------------------------------------
      const crescentSlashShader = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 1.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uOpacity;

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
            // vUv.x = 0..1 ao longo do arco da lua crescente
            // vUv.y = 0 (cauda traseira) -> 1 (gume cortante frontal)
            float arcTaper = sin(vUv.x * 3.14159265);
            float n = fbm(vec2(vUv.x * 10.0, vUv.y * 5.0 - uTime * 4.5));

            // Fio frontal intenso e cauda de névoa glacial
            float trailMask = smoothstep(0.05, 0.85, vUv.y + n * 0.25) * arcTaper;
            float razorEdge = smoothstep(0.76, 0.98, vUv.y) * arcTaper;

            vec3 colDeepCyan = vec3(0.01, 0.52, 0.78);
            vec3 colElectricCyan = vec3(0.0, 0.90, 1.0);
            vec3 colIceWhite = vec3(0.92, 0.98, 1.0);

            vec3 col = mix(colDeepCyan, colElectricCyan, trailMask);
            col = mix(col, colIceWhite, razorEdge);

            float alpha = clamp((trailMask * 0.85 + razorEdge * 0.65) * uOpacity, 0.0, 1.0);
            gl_FragColor = vec4(col * 1.45, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const beamShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAlpha: { value: 1.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uAlpha;

          void main() {
            float radial = sin(vUv.x * 3.14159265);
            float verticalFade = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.35, vUv.y);
            float pulse = 0.85 + 0.15 * sin(vUv.y * 24.0 - uTime * 18.0);

            vec3 colOuter = vec3(0.0, 0.85, 1.0);
            vec3 colCore = vec3(0.95, 0.99, 1.0);
            vec3 col = mix(colOuter, colCore, pow(radial, 2.2)) * pulse * 1.65;

            gl_FragColor = vec4(col, radial * verticalFade * uAlpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      // Helper para criar explosões rápidas de partículas de gelo
      function spawnFrostBurst(origin, count = 28, speedScale = 4.2, size = 0.22) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const vels = [];

        for (let i = 0; i < count; i++) {
          pos[i * 3] = origin.x;
          pos[i * 3 + 1] = origin.y;
          pos[i * 3 + 2] = origin.z;

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const spd = (0.4 + Math.random() * 0.8) * speedScale;
          vels.push(
            new THREE.Vector3(
              Math.sin(phi) * Math.cos(theta) * spd,
              Math.abs(Math.cos(phi)) * spd * 0.85 + 0.6,
              Math.sin(phi) * Math.sin(theta) * spd
            )
          );
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
          size,
          map: frostParticleTex,
          transparent: true,
          opacity: 1.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          color: 0x7dd3fc
        });

        const points = new THREE.Points(geo, mat);
        scene.add(points);

        activeEffects.push({
          age: 0,
          maxAge: 0.65,
          update(dt, progress) {
            const pAttr = points.geometry.attributes.position;
            for (let i = 0; i < count; i++) {
              vels[i].y -= 6.5 * dt;
              pAttr.setXYZ(
                i,
                pAttr.getX(i) + vels[i].x * dt,
                pAttr.getY(i) + vels[i].y * dt,
                pAttr.getZ(i) + vels[i].z * dt
              );
            }
            pAttr.needsUpdate = true;
            mat.opacity = 1.0 - progress;
          },
          dispose() {
            scene.remove(points);
            geo.dispose();
            mat.dispose();
          }
        });
      }

      // =======================================================================
      // ATAQUE 1: CORTE GLACIAL (3 ONDAS DE ENERGIA EM LUA CRESCENTE AZUL CLARO)
      // =======================================================================
      function castCrescentSlash(casterPos, targetPos) {
        onCasterAnim('slash', { duration: 0.65 });

        const dir = new THREE.Vector3().subVectors(targetPos, casterPos);
        dir.y = 0;
        if (dir.lengthSq() < 0.001) dir.set(0, 0, -1);
        dir.normalize();

        const slashAngles = [0.48, -0.48, 0.05];
        const delays = [0.0, 0.14, 0.28];

        slashAngles.forEach((rollAngle, idx) => {
          const isFinal = idx === 2;
          const radius = isFinal ? 1.55 : 1.25;
          const tubeWidth = isFinal ? 0.55 : 0.42;

          // Geometria em arco crescente
          const ringGeo = new THREE.RingGeometry(
            radius - tubeWidth,
            radius,
            32,
            1,
            -Math.PI * 0.42,
            Math.PI * 0.84
          );
          ringGeo.rotateX(-Math.PI / 2);

          const mat = crescentSlashShader.clone();
          const mesh = new THREE.Mesh(ringGeo, mat);
          mesh.visible = false;

          const startPos = casterPos.clone().add(new THREE.Vector3(0, 1.15, 0)).addScaledVector(dir, 0.7);
          mesh.position.copy(startPos);
          mesh.lookAt(startPos.clone().add(dir));
          mesh.rotateZ(rollAngle);

          scene.add(mesh);

          let hasHit = false;
          const speed = isFinal ? 21.0 : 18.5;

          activeEffects.push({
            age: -delays[idx],
            maxAge: 0.72,
            update(dt, progress, elapsed) {
              if (this.age < 0) return;
              mesh.visible = true;
              mat.uniforms.uTime.value = elapsed;

              mesh.position.addScaledVector(dir, speed * dt);
              const grow = 1.0 + progress * 0.45;
              mesh.scale.set(grow, 1, grow);
              mat.uniforms.uOpacity.value = Math.sin(Math.min(progress, 1.0) * Math.PI);

              if (!hasHit && mesh.position.distanceTo(targetPos) < 1.55) {
                hasHit = true;
                spawnFrostBurst(targetPos.clone().add(new THREE.Vector3(0, 1.1, 0)), isFinal ? 36 : 20, 4.5, 0.24);
                onHitTarget(isFinal ? 2450 : 1380, isFinal, targetPos);
                if (isFinal) onCameraShake(0.16, 0.22);
              }
            },
            dispose() {
              scene.remove(mesh);
              ringGeo.dispose();
              mat.dispose();
            }
          });
        });
      }

      // =======================================================================
      // ATAQUE 2: PRISÃO DOS PILARES GÉLIDOS (ERUPÇÃO EM CÍRCULO COM RUNAS)
      // =======================================================================
      function castFrostPillars(targetPos) {
        onCasterAnim('cast', { duration: 0.8 });

        const pillarCount = 5;
        const circleRadius = 2.15;
        const group = new THREE.Group();
        group.position.set(targetPos.x, 0, targetPos.z);
        scene.add(group);

        // Círculo mágico brilhante no chão
        const floorCircleGeo = new THREE.PlaneGeometry(5.6, 5.6);
        floorCircleGeo.rotateX(-Math.PI / 2);
        const floorCircleMat = new THREE.MeshBasicMaterial({
          map: magicCircleTex,
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const floorCircle = new THREE.Mesh(floorCircleGeo, floorCircleMat);
        floorCircle.position.y = 0.03;
        group.add(floorCircle);

        // Materiais dos pilares de gelo arcano
        const iceObsidianMat = new THREE.MeshStandardMaterial({
          color: 0x0b192c,
          emissive: 0x0284c7,
          emissiveIntensity: 0.55,
          roughness: 0.35,
          metalness: 0.45
        });
        const silverTrimMat = new THREE.MeshStandardMaterial({
          color: 0xbae6fd,
          metalness: 0.9,
          roughness: 0.2
        });
        const cyanCrystalMat = new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 1.9,
          roughness: 0.1,
          flatShading: true
        });
        const ringMat = new THREE.MeshBasicMaterial({
          map: ringStripTex,
          transparent: true,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const pillars = [];
        for (let i = 0; i < pillarCount; i++) {
          const ang = (i / pillarCount) * Math.PI * 2;
          const pGroup = new THREE.Group();
          pGroup.position.set(Math.cos(ang) * circleRadius, -3.6, Math.sin(ang) * circleRadius);
          pGroup.lookAt(targetPos.x, -3.6, targetPos.z);

          // Base octogonal
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.45, 8), iceObsidianMat);
          base.position.y = 0.22;
          pGroup.add(base);

          // Corpo do pilar
          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 2.35, 8), iceObsidianMat);
          shaft.position.y = 1.55;
          pGroup.add(shaft);

          // Frisos prateados verticais
          const trim = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.25, 0.78), silverTrimMat);
          trim.position.y = 1.55;
          pGroup.add(trim);

          // Cristal losango azul claro central
          const crystal = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.28, 0).scale(0.75, 1.35, 0.55),
            cyanCrystalMat
          );
          crystal.position.set(0, 1.65, 0.38);
          pGroup.add(crystal);

          // Capitel + Ponta cristalina no topo
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.38, 0.42, 8), iceObsidianMat);
          cap.position.y = 2.85;
          pGroup.add(cap);

          const spire = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.65, 6), cyanCrystalMat);
          spire.position.y = 3.35;
          pGroup.add(spire);

          // Anel rúnico giratório azul claro
          const halo = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.16, 24, 1, true), ringMat);
          halo.position.y = 2.55;
          pGroup.add(halo);

          group.add(pGroup);
          pillars.push({ pGroup, halo, spire });
        }

        const pointLight = new THREE.Object3D();
        pointLight.position.y = 1.8;
        group.add(pointLight);

        let erupted = false;
        let shattered = false;

        activeEffects.push({
          age: 0,
          maxAge: 2.35,
          update(dt, progress, elapsed) {
            floorCircle.rotation.y = elapsed * 1.4;

            if (progress < 0.16) {
              // Subida violenta dos pilares do chão
              const t = progress / 0.16;
              const easeOut = 1 - Math.pow(1 - t, 3);
              pillars.forEach((p, idx) => {
                p.pGroup.position.y = THREE.MathUtils.lerp(-3.6, 0, easeOut);
                p.halo.rotation.y = elapsed * 3.0 + idx;
              });
              floorCircleMat.opacity = easeOut * 0.9;
            } else if (progress < 0.82) {
              if (!erupted) {
                erupted = true;
                onCameraShake(0.24, 0.32);
                spawnFrostBurst(targetPos.clone().add(new THREE.Vector3(0, 1.0, 0)), 42, 5.2, 0.28);
                onHitTarget(2890, true, targetPos);
              }
              pillars.forEach((p, idx) => {
                p.pGroup.position.y = 0;
                p.halo.rotation.y = elapsed * 3.5 + idx;
                p.halo.position.y = 2.55 + Math.sin(elapsed * 6.0 + idx) * 0.08;
              });
              floorCircleMat.opacity = 0.9;
            } else {
              // Dissolução / Recuo final
              if (!shattered) {
                shattered = true;
                spawnFrostBurst(targetPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 35, 4.8, 0.25);
                onHitTarget(1950, false, targetPos);
              }
              const fade = 1.0 - (progress - 0.82) / 0.18;
              pillars.forEach((p) => {
                p.pGroup.position.y = -(1.0 - fade) * 3.5;
              });
              floorCircleMat.opacity = fade * 0.9;
              pointLight.intensity = fade * 3.0;
            }
          },
          dispose() {
            scene.remove(group);
            floorCircleGeo.dispose();
            floorCircleMat.dispose();
            iceObsidianMat.dispose();
            silverTrimMat.dispose();
            cyanCrystalMat.dispose();
            ringMat.dispose();
          }
        });
      }

      // =======================================================================
      // ATAQUE 3: TEMPESTADE DE PENAS DE GELOSK (28 PROJÉTEIS TELEGUIADOS)
      // =======================================================================
      function castWingBarrage(casterPos, targetPos) {
        onCasterAnim('wingsFlare', { duration: 1.1 });

        const count = 28;
        const featherGeo = new THREE.OctahedronGeometry(0.14, 0).scale(0.45, 0.32, 2.4);
        const featherMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
        const instMesh = new THREE.InstancedMesh(featherGeo, featherMat, count);
        scene.add(instMesh);

        const projectiles = [];
        const dummy = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
          const side = i % 2 === 0 ? -1 : 1;
          const spreadAngle = (Math.random() - 0.5) * 1.4;
          const start = casterPos.clone().add(
            new THREE.Vector3(
              side * (0.65 + Math.random() * 1.25),
              1.1 + Math.random() * 1.35,
              (Math.random() - 0.5) * 0.4
            )
          );

          // Ponto de controle aberto nas laterais para trajetória curva elegante
          const ctrl = start.clone().add(
            new THREE.Vector3(
              side * (1.8 + Math.random() * 2.2),
              1.2 + Math.sin(spreadAngle) * 1.5,
              -1.2
            )
          );

          const end = targetPos.clone().add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 0.9,
              0.5 + Math.random() * 1.3,
              (Math.random() - 0.5) * 0.9
            )
          );

          projectiles.push({
            curve: new THREE.QuadraticBezierCurve3(start, ctrl, end),
            delay: i * 0.024,
            duration: 0.48,
            hit: false
          });
        }

        let hitBatchCounter = 0;

        activeEffects.push({
          age: 0,
          maxAge: 1.25,
          update(dt) {
            for (let i = 0; i < count; i++) {
              const p = projectiles[i];
              const localT = (this.age - p.delay) / p.duration;

              if (localT < 0) {
                dummy.position.copy(p.curve.getPoint(0));
                dummy.scale.setScalar(0.001);
              } else if (localT <= 1.0) {
                const easeT = localT * localT * (3 - 2 * localT);
                const pos = p.curve.getPoint(easeT);
                const tan = p.curve.getTangent(easeT);
                dummy.position.copy(pos);
                dummy.lookAt(pos.clone().add(tan));
                dummy.scale.setScalar(1.0);
              } else {
                dummy.scale.setScalar(0.001);
                if (!p.hit) {
                  p.hit = true;
                  hitBatchCounter++;
                  if (hitBatchCounter % 5 === 1) {
                    spawnFrostBurst(p.curve.getPoint(1), 10, 3.4, 0.18);
                    onHitTarget(520, hitBatchCounter > 20, targetPos);
                    onCameraShake(0.08, 0.1);
                  }
                }
              }
              dummy.updateMatrix();
              instMesh.setMatrixAt(i, dummy.matrix);
            }
            instMesh.instanceMatrix.needsUpdate = true;
          },
          dispose() {
            scene.remove(instMesh);
            featherGeo.dispose();
            featherMat.dispose();
          }
        });
      }

      // =======================================================================
      // ATAQUE 4: PASSO DAS SOMBRAS GLACIAIS (TELEPORTE + AFTERIMAGES + CORTE X)
      // =======================================================================
      function castGlacialDash(casterPos, targetPos) {
        const dir = new THREE.Vector3().subVectors(targetPos, casterPos);
        dir.y = 0;
        if (dir.lengthSq() < 0.001) dir.set(0, 0, -1);
        dir.normalize();

        const dashEnd = targetPos.clone().addScaledVector(dir, 2.2);
        onCasterAnim('dash', { startPos: casterPos.clone(), endPos: dashEnd, duration: 0.95 });
        onCameraShake(0.14, 0.18);

        // Cria 4 silhuetas holográficas azul claro (afterimages) ao longo do trajeto
        const ghosts = [];
        const ghostGeo = new THREE.CylinderGeometry(0.28, 0.42, 1.75, 12);
        for (let i = 0; i < 4; i++) {
          const t = (i + 1) / 5;
          const gPos = new THREE.Vector3().lerpVectors(casterPos, dashEnd, t);
          gPos.y = 0.9;

          const gMat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const gMesh = new THREE.Mesh(ghostGeo, gMat);
          gMesh.position.copy(gPos);
          scene.add(gMesh);
          ghosts.push({ mesh: gMesh, mat: gMat });
        }

        // Ruptura em "X" gigante no alvo
        const crossGroup = new THREE.Group();
        crossGroup.position.copy(targetPos).add(new THREE.Vector3(0, 1.15, 0));
        crossGroup.lookAt(casterPos.x, 1.15, casterPos.z);

        const slashBarGeo = new THREE.PlaneGeometry(0.18, 2.85);
        const slashBarMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const bar1 = new THREE.Mesh(slashBarGeo, slashBarMat);
        bar1.rotation.z = Math.PI / 4;
        const bar2 = new THREE.Mesh(slashBarGeo, slashBarMat);
        bar2.rotation.z = -Math.PI / 4;
        crossGroup.add(bar1, bar2);
        scene.add(crossGroup);

        let exploded = false;

        activeEffects.push({
          age: 0,
          maxAge: 0.95,
          update(dt, progress) {
            // Desvanece as silhuetas fantasmas
            ghosts.forEach((g, idx) => {
              const fade = Math.max(0, 1.0 - progress * (1.4 + idx * 0.15));
              g.mat.opacity = fade * 0.6;
              g.mesh.scale.y = 1.0 + (1.0 - fade) * 0.25;
            });

            // Explosão do corte em "X" no meio da animação
            if (progress > 0.35) {
              const xProg = (progress - 0.35) / 0.65;
              if (!exploded) {
                exploded = true;
                spawnFrostBurst(crossGroup.position, 45, 6.0, 0.28);
                onHitTarget(3650, true, targetPos);
                onCameraShake(0.26, 0.28);
              }
              slashBarMat.opacity = Math.sin(xProg * Math.PI);
              const s = 0.7 + xProg * 0.85;
              crossGroup.scale.set(s, s, 1);
            }
          },
          dispose() {
            ghosts.forEach((g) => {
              scene.remove(g.mesh);
              g.mat.dispose();
            });
            ghostGeo.dispose();
            scene.remove(crossGroup);
            slashBarGeo.dispose();
            slashBarMat.dispose();
          }
        });
      }

      // =======================================================================
      // ATAQUE 5: JUÍZO DO ABISMO CONGELADO (ULTIMATE — DOMÍNIO E FEIXES DO CÉU)
      // =======================================================================
      function castFrozenDomain(casterPos, targetPos) {
        onCasterAnim('ultimate', { duration: 2.2 });
        onCameraShake(0.18, 0.3);

        const domainGroup = new THREE.Group();
        domainGroup.position.set(targetPos.x, 0.03, targetPos.z);
        scene.add(domainGroup);

        // Círculo rúnico gigante no chão
        const domainGeo = new THREE.PlaneGeometry(8.5, 8.5);
        domainGeo.rotateX(-Math.PI / 2);
        const domainMat = new THREE.MeshBasicMaterial({
          map: magicCircleTex,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const domainDisc = new THREE.Mesh(domainGeo, domainMat);
        domainGroup.add(domainDisc);

        // 16 feixes celestiais de luz azul claro caindo do céu
        const beamCount = 16;
        const beamGeo = new THREE.CylinderGeometry(0.18, 0.36, 12.0, 14, 1, true);
        const beams = [];

        for (let i = 0; i < beamCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = i === 0 ? 0 : 0.6 + Math.random() * 2.8;
          const bx = Math.cos(angle) * dist;
          const bz = Math.sin(angle) * dist;

          const bMat = beamShaderMaterial.clone();
          bMat.uniforms.uAlpha.value = 0;
          const bMesh = new THREE.Mesh(beamGeo, bMat);
          bMesh.position.set(bx, 6.0, bz);
          bMesh.visible = false;
          domainGroup.add(bMesh);

          beams.push({
            mesh: bMesh,
            mat: bMat,
            delay: 0.35 + i * 0.08,
            duration: 0.45,
            hit: false,
            worldPos: new THREE.Vector3(targetPos.x + bx, 0.8, targetPos.z + bz)
          });
        }

        const domainLight = new THREE.Object3D();
        domainLight.position.y = 2.5;
        domainGroup.add(domainLight);

        activeEffects.push({
          age: 0,
          maxAge: 2.3,
          update(dt, progress, elapsed) {
            // Expansão do domínio no solo
            const expand = Math.min(1.0, progress / 0.2);
            const easeExpand = 1 - Math.pow(1 - expand, 3);
            domainDisc.scale.setScalar(0.15 + easeExpand * 0.85);
            domainDisc.rotation.y = -elapsed * 1.1;

            const fadeOut = progress > 0.85 ? 1.0 - (progress - 0.85) / 0.15 : 1.0;
            domainMat.opacity = easeExpand * 0.95 * fadeOut;
            domainLight.intensity = 4.0 * fadeOut;

            // Queda sequencial dos 16 feixes celestiais
            beams.forEach((b, idx) => {
              const bProg = (this.age - b.delay) / b.duration;
              if (bProg >= 0 && bProg <= 1.0) {
                b.mesh.visible = true;
                b.mat.uniforms.uTime.value = elapsed;
                b.mat.uniforms.uAlpha.value = Math.sin(bProg * Math.PI);

                const widthScale = 1.35 - bProg * 0.65;
                b.mesh.scale.set(widthScale, 1.0, widthScale);

                if (!b.hit && bProg > 0.15) {
                  b.hit = true;
                  spawnFrostBurst(b.worldPos, 16, 4.4, 0.22);
                  onHitTarget(idx === beamCount - 1 ? 4999 : 890, idx % 3 === 0, targetPos);
                  onCameraShake(0.12, 0.14);
                }
              } else {
                b.mesh.visible = false;
              }
            });
          },
          dispose() {
            scene.remove(domainGroup);
            domainGeo.dispose();
            domainMat.dispose();
            beamGeo.dispose();
            beams.forEach((b) => b.mat.dispose());
          }
        });
      }

      // Loop de atualização dos efeitos ativos
      function update(elapsedTime, deltaTime = 0.016) {
        for (let i = activeEffects.length - 1; i >= 0; i--) {
          const fx = activeEffects[i];
          fx.age += deltaTime;
          const progress = Math.min(1.0, Math.max(0.0, fx.age / fx.maxAge));
          fx.update(deltaTime, progress, elapsedTime);

          if (fx.age >= fx.maxAge) {
            fx.dispose();
            activeEffects.splice(i, 1);
          }
        }
      }

      return {
        castCrescentSlash,
        castFrostPillars,
        castWingBarrage,
        castGlacialDash,
        castFrozenDomain,
        update
      };
    }


  const _hitV = new T3.Vector3();
  const GELOSK = createFrostArcaneSkills(T3, scene, {
    onHitTarget: (dmg, crit, hitPos) => { const W = ARMAS[AR.arma], base = ((W && W.dano) || 20) * atkMult(), n = base * dmg / 1000 * 0.55; const s = new Set(FERAS); if (typeof CAL !== 'undefined' && CAL.feras) CAL.feras.forEach(e => s.add(e));
      s.forEach(e => { if (!feraAtiva(e)) return; if (Math.hypot(e.g.position.x - hitPos.x, e.g.position.z - hitPos.z) < 2.6 + e.T.raio) { dano(e, n, 'gelo', crit || critico()); e.congela = Math.max(e.congela || 0, e.T.chefe ? 0.3 : 0.8); } }); },
    onCameraShake: (i) => { tremor = Math.max(tremor, i * 2.2); },
    onCasterAnim: (tipo, d) => { if (tipo === 'dash' && d.endPos) { heroi.position.x = d.endPos.x; heroi.position.z = d.endPos.z; fx('gelo', [d.endPos.x, 1, d.endPos.z], 0.5); } } });
  function geloCast(k) { if (AR.divino !== 'astrolabio' && AR.divino !== 'firmamento') { aviso('Equipe o Astrolábio do Firmamento Eterno.', '#9ae6ff'); return false; }
    const alvo = maisPerto(k === 'passo' ? 14 : 22); if (!alvo) { aviso('Nenhum inimigo perto.', '#c8b48a'); return false; }
    const p = heroi.position, c = new T3.Vector3(p.x, 0, p.z), t = new T3.Vector3(alvo.g.position.x, 0, alvo.g.position.z); facing = Math.atan2(t.x - c.x, t.z - c.z);
    som(k === 'juizo' ? 'raio' : 'gelo', 0.8, 1); atkT = 0;
    if (k === 'corte') GELOSK.castCrescentSlash(c, t); else if (k === 'pilares') GELOSK.castFrostPillars(t); else if (k === 'penas') GELOSK.castWingBarrage(c, t); else if (k === 'passo') GELOSK.castGlacialDash(c, t); else GELOSK.castFrozenDomain(c, t);
    if (k === 'juizo') flash('rgba(120,220,255,.35)'); return true; }
  function geloFrame(dt) { try { GELOSK.update(gT, dt); } catch (e) {} }
