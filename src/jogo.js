  // ===================== JOGO — teste 1: o bonequinho na terra plana =====================
  cam.near = 0.1; cam.far = 800; cam.updateProjectionMatrix();
  scene.background = new T3.Color('#9fd3f5'); scene.fog = new T3.Fog('#9fd3f5', 40, 140);

  // ---------- chão plano ----------
  const groundTex = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#6fbf5a'; x.fillRect(0, 0, w, h); const R = rng(7);
    for (let i = 0; i < 900; i++) { x.fillStyle = ['#64b450', '#7acb63', '#5aa848'][i % 3]; const px = R() * w, py = R() * h; x.fillRect(px, py, 3 + R() * 6, 3 + R() * 6); }
    x.strokeStyle = 'rgba(40,90,30,0.18)'; x.lineWidth = 3; x.strokeRect(0, 0, w, h); });
  groundTex.wrapS = groundTex.wrapT = T3.RepeatWrapping; groundTex.repeat.set(40, 40); groundTex.anisotropy = 4;
  const ground = new T3.Mesh(new T3.PlaneGeometry(400, 400), new T3.MeshToonMaterial({ color: '#ffffff', map: groundTex, gradientMap: GRAD }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; world.add(ground);
  // marcas pra dar noção de movimento (pedrinhas e flores)
  { const R = rng(21); for (let i = 0; i < 260; i++) { const x = (R() - 0.5) * 180, z = (R() - 0.5) * 180; if (Math.hypot(x, z) < 4) continue;
      if (i % 3 === 0) part(world, SPH, ['#9a9aa4', '#8a8a94'][i % 2], x, 0.08, z, 0.25 + R() * 0.3, 0.14, 0.2 + R() * 0.3);
      else { const c = ['#ffffff', '#ffd23c', '#ff7aa0', '#b88aff'][i % 4]; part(world, CYL, '#3a8a3a', x, 0.12, z, 0.015, 0.24, 0.015); part(world, SPH, c, x, 0.26, z, 0.07, 0.05, 0.07, 0, true); } } }
  // nuvens
  const clouds = []; { const R = rng(5); for (let i = 0; i < 14; i++) { const c = grp(world, (R() - 0.5) * 300, 28 + R() * 14, (R() - 0.5) * 300); for (let k = 0; k < 4; k++) part(c, SPH, '#ffffff', k * 2.6 - 4, R(), 0, 2.6, 1.3, 1.8, 0, true); clouds.push(c); } }

  // ---------- o bonequinho (Rafael) ----------
  const RAFA = { skin: '#eab48e', hairStyle: 'short', hairC: '#1e1410', top: '#7a5030', top2: '#5a3820', pants: '#2a3048', shoe: '#3a2a20', sole: '#1a1410', iris: '#4a3018' };
  const hero = makeChar(Object.assign({}, RAFA, { s: 1.0, ph: 0 })); hero.position.set(0, 0, 0);
  hero.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const shadowBlob = new T3.Mesh(new T3.CircleGeometry(0.45, 24), new T3.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.22, depthWrite: false })); shadowBlob.rotation.x = -Math.PI / 2; shadowBlob.position.y = 0.01; world.add(shadowBlob);

  // ---------- controles ----------
  const input = { x: 0, y: 0, run: false, jump: false };
  const keys = {};
  window.addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'Space') input.jump = true; });
  window.addEventListener('keyup', e => { keys[e.code] = false; });
  const joy = document.getElementById('joy'), knob = document.getElementById('knob'), jumpBtn = document.getElementById('pular');
  let joyId = null, joyC = [0, 0], camId = null, camLast = [0, 0];
  let camYaw = Math.PI, camPitch = 0.32, camDist = 6.2;
  function joyMove(px, py) { const R = 60; let dx = px - joyC[0], dy = py - joyC[1]; const d = Math.hypot(dx, dy); if (d > R) { dx *= R / d; dy *= R / d; } knob.style.transform = `translate(${dx}px, ${dy}px)`; input.x = dx / R; input.y = dy / R; }
  function onDown(e) { for (const t of e.changedTouches || [e]) { const id = t.identifier ?? 'm'; if (t.target === jumpBtn) continue;
      if (t.clientX < window.innerWidth * 0.5 && joyId === null) { joyId = id; joyC = [t.clientX, t.clientY]; joy.style.left = (t.clientX - 70) + 'px'; joy.style.top = (t.clientY - 70) + 'px'; joy.classList.add('on'); joyMove(t.clientX, t.clientY); }
      else if (camId === null) { camId = id; camLast = [t.clientX, t.clientY]; } } }
  function onMove(e) { for (const t of e.changedTouches || [e]) { const id = t.identifier ?? 'm'; if (id === joyId) joyMove(t.clientX, t.clientY);
      else if (id === camId) { camYaw -= (t.clientX - camLast[0]) * 0.008; camPitch = clamp(camPitch + (t.clientY - camLast[1]) * 0.005, 0.05, 1.1); camLast = [t.clientX, t.clientY]; } } if (e.cancelable) e.preventDefault(); }
  function onUp(e) { for (const t of e.changedTouches || [e]) { const id = t.identifier ?? 'm'; if (id === joyId) { joyId = null; input.x = input.y = 0; knob.style.transform = ''; joy.classList.remove('on'); } if (id === camId) camId = null; } }
  cv.addEventListener('touchstart', onDown, { passive: false }); cv.addEventListener('touchmove', onMove, { passive: false }); cv.addEventListener('touchend', onUp); cv.addEventListener('touchcancel', onUp);
  cv.addEventListener('mousedown', onDown); window.addEventListener('mousemove', e => { if (joyId === 'm' || camId === 'm') onMove(e); }); window.addEventListener('mouseup', onUp);
  cv.addEventListener('wheel', e => { camDist = clamp(camDist + e.deltaY * 0.005, 3, 14); }, { passive: true });
  jumpBtn.addEventListener('touchstart', e => { input.jump = true; e.preventDefault(); }, { passive: false }); jumpBtn.addEventListener('mousedown', () => { input.jump = true; });
  const runBtn = document.getElementById('correr'); runBtn.addEventListener('click', () => { input.run = !input.run; runBtn.classList.toggle('on', input.run); });

  // ---------- física simples ----------
  let vy = 0, onGround = true, facing = 0, speedNow = 0, wave = 0;
  const WALK = 3.2, RUN = 7.0, GRAV = 22, JUMP = 8.2;
  const tmp = new T3.Vector3();
  let last = performance.now(), gT = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; gT += dt;
    // entrada do teclado soma com o joystick
    let ix = input.x, iy = input.y;
    if (keys.KeyA || keys.ArrowLeft) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1; if (keys.KeyW || keys.ArrowUp) iy -= 1; if (keys.KeyS || keys.ArrowDown) iy += 1;
    const mag = Math.min(1, Math.hypot(ix, iy)); const running = input.run || keys.ShiftLeft || mag > 0.92;
    // direção relativa à câmera
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw); const rx = -fz, rz = fx;
    let mx = fx * -iy + rx * ix, mz = fz * -iy + rz * ix;
    const ml = Math.hypot(mx, mz); const target = mag > 0.08 ? (running ? RUN : WALK) * mag : 0;
    speedNow = lerp(speedNow, target, clamp(dt * 8));
    if (ml > 0.001 && mag > 0.08) { mx /= ml; mz /= ml; const want = Math.atan2(mx, mz); let d = want - facing; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; facing += d * clamp(dt * 12); }
    hero.position.x = clamp(hero.position.x + Math.sin(facing) * speedNow * dt, -190, 190); hero.position.z = clamp(hero.position.z + Math.cos(facing) * speedNow * dt, -190, 190);
    if (input.jump && onGround) { vy = JUMP; onGround = false; } input.jump = false;
    if (!onGround) { vy -= GRAV * dt; hero.position.y += vy * dt; if (hero.position.y <= 0) { hero.position.y = 0; vy = 0; onGround = true; } }
    hero.rotation.y = facing;
    // animação
    if (!onGround) pose(hero, gT, { mood: 'smile', arms: { shL: [-2.6, 0, -0.3], shR: [-2.6, 0, 0.3], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] }, legs: { thL: -0.9, knL: 1.4, thR: -0.3, knR: 0.6 } });
    else if (speedNow > 0.4) pose(hero, gT * (speedNow > 4.5 ? 1 : 0.9 + speedNow * 0.1), speedNow > 4.5 ? { run: true, mood: 'smile' } : { walk: true, mood: 'neutral' });
    else { wave += dt; pose(hero, gT, { mood: 'smile', look: [0, 0] }); }
    shadowBlob.position.set(hero.position.x, 0.01, hero.position.z); shadowBlob.material.opacity = 0.22 * (1 - clamp(hero.position.y / 4)); shadowBlob.scale.setScalar(1 - clamp(hero.position.y / 6) * 0.5);
    // câmera em terceira pessoa
    if (camId === null && speedNow > 0.5) { let d = (facing + Math.PI) - camYaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; camYaw += d * clamp(dt * 0.9); }
    const ch = hero.position; const cx = ch.x + Math.sin(camYaw) * Math.cos(camPitch) * camDist, cz = ch.z + Math.cos(camYaw) * Math.cos(camPitch) * camDist, cy = ch.y + 1.2 + Math.sin(camPitch) * camDist;
    cam.position.lerp(tmp.set(cx, cy, cz), clamp(dt * 10)); cam.lookAt(ch.x, ch.y + 1.15, ch.z);
    sun.position.set(ch.x + 12, 30, ch.z + 10); sun.target.position.set(ch.x, 0, ch.z); sun.target.updateMatrixWorld();
    clouds.forEach((c, i) => { c.position.x += dt * (0.6 + (i % 3) * 0.2); if (c.position.x > 160) c.position.x = -160; });
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  cam.position.set(0, 3, -6);
  requestAnimationFrame(loop);
  setTimeout(() => document.getElementById('dica').classList.add('some'), 6000);
})();
