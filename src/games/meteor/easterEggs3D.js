import * as THREE from 'three';

/**
 * 3D 地球守衛戰：專屬 3D 彩蛋系統 (流星、人造衛星、UFO 飛碟)
 * 完美融入 Three.js 空間透視與深空光影，保留真實 3D 質感
 */

// ── 1. 3D 背景微光流星 (純背景氛圍，柔和不搶眼) ──
export const createShootingStarSystem = (scene) => {
  const lineGeo = new THREE.BufferGeometry();
  const maxPoints = 20;
  const positions = new Float32Array(maxPoints * 3);
  const colors = new Float32Array(maxPoints * 3);

  lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    linewidth: 2
  });

  const lineMesh = new THREE.Line(lineGeo, lineMat);
  lineMesh.visible = false;
  scene.add(lineMesh);

  let active = false;
  let progress = 0;
  let startX = 0, startY = 0, startZ = 0;
  let dirX = 0, dirY = 0, dirZ = 0;
  let speed = 0;
  let length = 0;
  let nextSpawnTime = performance.now() + 6000 + Math.random() * 8000;

  const spawn = (now) => {
    active = true;
    progress = 0;
    // 左上空域深處生成
    startX = -35 + (Math.random() - 0.5) * 15;
    startY = 20 + Math.random() * 10;
    startZ = -60 - Math.random() * 40;

    // 朝右下方劃過
    dirX = 0.85 + Math.random() * 0.2;
    dirY = -0.55 - Math.random() * 0.2;
    dirZ = 0.2 + Math.random() * 0.2;
    speed = 45 + Math.random() * 25;
    length = 7 + Math.random() * 6;

    lineMesh.visible = true;
    nextSpawnTime = now + 9000 + Math.random() * 12000;
  };

  const update = (delta, now) => {
    if (!active && now >= nextSpawnTime) {
      spawn(now);
    }

    if (active) {
      progress += delta * (speed / 30);
      const headX = startX + dirX * progress * 30;
      const headY = startY + dirY * progress * 30;
      const headZ = startZ + dirZ * progress * 30;

      // 柔和淡入與淡出
      const alpha = Math.sin(Math.min(progress, 1.0) * Math.PI) * 0.55;
      lineMat.opacity = alpha;

      for (let i = 0; i < maxPoints; i++) {
        const ratio = i / (maxPoints - 1);
        const px = headX - dirX * ratio * length;
        const py = headY - dirY * ratio * length;
        const pz = headZ - dirZ * ratio * length;

        positions[i * 3] = px;
        positions[i * 3 + 1] = py;
        positions[i * 3 + 2] = pz;

        // 白藍微光漸變
        colors[i * 3] = 0.85 * (1.0 - ratio);
        colors[i * 3 + 1] = 0.95 * (1.0 - ratio);
        colors[i * 3 + 2] = 1.0 * (1.0 - ratio);
      }

      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      if (progress >= 1.2) {
        active = false;
        lineMesh.visible = false;
      }
    }
  };

  const dispose = () => {
    scene.remove(lineMesh);
    lineGeo.dispose();
    lineMat.dispose();
  };

  return { update, dispose };
};

// ── 2. 3D 圓弧漫遊人造衛星 (不可點選、安靜優雅、低調背景) ──
export const createSatelliteSystem = (scene) => {
  const satGroup = new THREE.Group();

  // 衛星金屬主體 (Miniature Satellite Bus)
  const busGeo = new THREE.BoxGeometry(0.7, 0.5, 0.5);
  const busMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.8,
    roughness: 0.3
  });
  const bus = new THREE.Mesh(busGeo, busMat);
  satGroup.add(bus);

  // 雙側深藍太陽能翼板
  const wingGeo = new THREE.BoxGeometry(1.6, 0.35, 0.05);
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    emissive: 0x0f172a,
    metalness: 0.7,
    roughness: 0.2
  });
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-1.25, 0, 0);
  satGroup.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.set(1.25, 0, 0);
  satGroup.add(rightWing);

  // 通訊信標指示燈 (脈衝微光)
  const beaconGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.set(0, 0.3, 0.25);
  satGroup.add(beacon);

  satGroup.scale.set(0.75, 0.75, 0.75);
  satGroup.visible = false;
  scene.add(satGroup);

  let active = false;
  let angle = -0.9;
  let nextLaunch = performance.now() + 8000;

  const update = (delta, now) => {
    if (!active && now >= nextLaunch) {
      active = true;
      angle = -0.9;
      satGroup.visible = true;
    }

    if (active) {
      angle += delta * 0.045; // 緩慢圓弧推進

      // 沿著地球大氣層上方的深空拋物線軌道
      const rX = 30;
      const rY = 14;
      const x = Math.sin(angle) * rX;
      const y = -12 + Math.cos(angle) * rY;
      const z = -26;

      satGroup.position.set(x, y, z);
      satGroup.rotation.y = angle * 0.8;
      satGroup.rotation.z = Math.sin(now * 0.001) * 0.1;

      // 閃爍藍綠信標燈
      const blink = Math.sin(now * 0.006) > 0.3;
      beaconMat.color.setHex(blink ? 0x00f5ff : 0x0369a1);

      if (angle >= 0.9) {
        active = false;
        satGroup.visible = false;
        nextLaunch = now + 18000 + Math.random() * 15000;
      }
    }
  };

  const dispose = () => {
    scene.remove(satGroup);
    busGeo.dispose();
    busMat.dispose();
    wingGeo.dispose();
    wingMat.dispose();
    beaconGeo.dispose();
    beaconMat.dispose();
  };

  return { update, dispose };
};

// ── 3. 3D UFO 飛碟互動彩蛋 (相對清楚但不搶鏡、可點擊 5 次加 5 分) ──
export const createUfoSystem = (scene, camera, domElement, onUfoSuccess) => {
  const ufoGroup = new THREE.Group();

  // 1. 碟形上下金屬外殼
  const upperGeo = new THREE.CylinderGeometry(0.3, 1.7, 0.35, 20);
  const lowerGeo = new THREE.CylinderGeometry(1.7, 0.6, 0.3, 20);
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.85,
    roughness: 0.25
  });
  const upper = new THREE.Mesh(upperGeo, hullMat);
  upper.position.y = 0.15;
  const lower = new THREE.Mesh(lowerGeo, hullMat);
  lower.position.y = -0.15;
  ufoGroup.add(upper);
  ufoGroup.add(lower);

  // 2. 螢光半球駕駛艙罩 (Translucent Cyan Dome)
  const domeGeo = new THREE.SphereGeometry(0.7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x0891b2,
    emissiveIntensity: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.y = 0.3;
  ufoGroup.add(dome);

  // 3. 邊緣環狀彩燈 (Rim Lights)
  const rimLights = [];
  const rimCount = 6;
  const rimGeo = new THREE.SphereGeometry(0.12, 8, 8);
  for (let i = 0; i < rimCount; i++) {
    const ang = (i / rimCount) * Math.PI * 2;
    const rMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const rMesh = new THREE.Mesh(rimGeo, rMat);
    rMesh.position.set(Math.cos(ang) * 1.5, 0, Math.sin(ang) * 1.5);
    ufoGroup.add(rMesh);
    rimLights.push({ mesh: rMesh, mat: rMat, baseAng: ang });
  }

  // 4. 平板/觸控專用隱形擴大碰撞球 (Invisible Hitbox, 避免小孩平板點不到)
  const hitGeo = new THREE.SphereGeometry(2.4, 8, 8);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(hitGeo, hitMat);
  ufoGroup.add(hitbox);

  // 5. 3D 全息點擊次數名牌 Sprite (1/5, 2/5 ...)
  const badgeCanvas = document.createElement('canvas');
  badgeCanvas.width = 256;
  badgeCanvas.height = 100;
  const badgeCtx = badgeCanvas.getContext('2d');
  const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
  const badgeMat = new THREE.SpriteMaterial({ map: badgeTexture, transparent: true, depthTest: false });
  const badgeSprite = new THREE.Sprite(badgeMat);
  badgeSprite.scale.set(3.2, 1.25, 1);
  badgeSprite.position.set(0, 1.8, 0);
  badgeSprite.visible = false;
  ufoGroup.add(badgeSprite);

  const updateBadgeText = (clicks, remainingSec) => {
    badgeCtx.clearRect(0, 0, 256, 100);
    // 圓角半透明膠囊背景
    badgeCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    badgeCtx.strokeStyle = clicks >= 5 ? '#10b981' : '#38bdf8';
    badgeCtx.lineWidth = 4;
    badgeCtx.beginPath();
    badgeCtx.roundRect(12, 10, 232, 80, 24);
    badgeCtx.fill();
    badgeCtx.stroke();

    badgeCtx.font = '900 36px "Nunito", sans-serif';
    badgeCtx.textAlign = 'center';
    badgeCtx.textBaseline = 'middle';
    badgeCtx.fillStyle = clicks >= 5 ? '#34d399' : '#ffffff';
    badgeCtx.fillText(clicks >= 5 ? '🛸 +5 分！' : `🛸 ${clicks}/5 (${remainingSec.toFixed(1)}s)`, 128, 50);
    badgeTexture.needsUpdate = true;
    badgeSprite.visible = true;
  };

  ufoGroup.scale.set(0.9, 0.9, 0.9);
  ufoGroup.visible = false;
  scene.add(ufoGroup);

  // 狀態管理：'IDLE' | 'CRUISING' | 'CLICKED' | 'WARP_OUT' | 'ESCAPE'
  let state = 'IDLE';
  let clickCount = 0;
  let clickStartTime = 0;
  let cruiseStartTime = 0;
  let spawnFromLeft = true;
  let nextUfoSpawn = performance.now() + 15000 + Math.random() * 12000;
  let spinAngle = 0;
  let escapeDir = new THREE.Vector3();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const spawn = (now) => {
    state = 'CRUISING';
    clickCount = 0;
    badgeSprite.visible = false;
    cruiseStartTime = now;
    spawnFromLeft = Math.random() > 0.5;

    const startX = spawnFromLeft ? -22 : 22;
    const startY = 5 + Math.random() * 4;
    const startZ = 2 + Math.random() * 4;

    ufoGroup.position.set(startX, startY, startZ);
    ufoGroup.rotation.set(0.1, 0, 0);
    ufoGroup.visible = true;

    // 重新調整外觀顏色
    domeMat.emissive.setHex(0x0891b2);
  };

  // 觸控 / 點擊事件監聽
  const handlePointerDown = (e) => {
    if (state !== 'CRUISING' && state !== 'CLICKED') return;

    const rect = domElement.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (clientX === undefined || clientY === undefined) return;

    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(ufoGroup.children, true);

    if (intersects.length > 0) {
      const now = performance.now();

      if (state === 'CRUISING') {
        // 第一次點擊：進入急煞定格狀態並開啟 3 秒倒數計時
        state = 'CLICKED';
        clickStartTime = now;
        clickCount = 1;
      } else if (state === 'CLICKED') {
        clickCount++;
      }

      // 順逆時針交替急煞轉動特效
      spinAngle += clickCount % 2 === 0 ? 1.8 : -1.8;

      const remaining = Math.max(0, 3.0 - (now - clickStartTime) / 1000);
      updateBadgeText(clickCount, remaining);

      // 檢查是否達成 5 次點擊加分條件
      if (clickCount >= 5) {
        state = 'WARP_OUT';
        domeMat.emissive.setHex(0x10b981); // 成功綠光
        updateBadgeText(5, 0);

        if (onUfoSuccess) {
          onUfoSuccess(5); // 折半分數：5 分
        }

        // 0.4 秒後超光速跳躍逃逸
        setTimeout(() => {
          escapeDir.set((Math.random() - 0.5) * 10, 15, -60).normalize();
        }, 300);
      }
    }
  };

  domElement.addEventListener('pointerdown', handlePointerDown);

  const update = (delta, now) => {
    // 閃爍邊緣彩燈
    rimLights.forEach((rl, i) => {
      const on = Math.sin(now * 0.008 + rl.baseAng * 2) > 0;
      rl.mat.color.setHex(on ? 0x00f5ff : 0xf43f5e);
    });

    if (state === 'IDLE') {
      if (now >= nextUfoSpawn) {
        spawn(now);
      }
      return;
    }

    if (state === 'CRUISING') {
      // 忽快忽慢的 S 型航線橫越空域
      const elapsed = (now - cruiseStartTime) / 1000;
      const speed = 3.6 + Math.sin(elapsed * 1.5) * 1.8; // 忽快忽慢
      const dir = spawnFromLeft ? 1 : -1;
      
      ufoGroup.position.x += dir * speed * delta;
      ufoGroup.position.y += Math.sin(elapsed * 2.2) * delta * 1.5;
      ufoGroup.rotation.z = -dir * 0.15 + Math.sin(elapsed * 3) * 0.05;
      ufoGroup.rotation.y += delta * 1.2;

      // 飛出螢幕外且未被點擊
      if ((spawnFromLeft && ufoGroup.position.x > 24) || (!spawnFromLeft && ufoGroup.position.x < -24)) {
        state = 'IDLE';
        ufoGroup.visible = false;
        nextUfoSpawn = now + 20000 + Math.random() * 15000;
      }
    } else if (state === 'CLICKED') {
      // 原地急煞定格旋轉
      ufoGroup.rotation.y += delta * 14.0;
      ufoGroup.rotation.z = Math.sin(now * 0.02) * 0.25;

      const elapsed = (now - clickStartTime) / 1000;
      const remaining = Math.max(0, 3.0 - elapsed);
      updateBadgeText(clickCount, remaining);

      // 3 秒倒數超時判定
      if (remaining <= 0) {
        state = 'ESCAPE';
        domeMat.emissive.setHex(0xef4444); // 警示紅光
        // 朝最近的螢幕邊界加速逃跑
        const escapeX = ufoGroup.position.x > 0 ? 40 : -40;
        escapeDir.set(escapeX, 10, -10).normalize();
      }
    } else if (state === 'ESCAPE') {
      // 未集滿 5 次：急遽加速逃離
      ufoGroup.position.addScaledVector(escapeDir, delta * 35);
      ufoGroup.rotation.y += delta * 20;

      if (Math.abs(ufoGroup.position.x) > 35 || Math.abs(ufoGroup.position.y) > 30) {
        state = 'IDLE';
        ufoGroup.visible = false;
        badgeSprite.visible = false;
        nextUfoSpawn = now + 18000 + Math.random() * 15000;
      }
    } else if (state === 'WARP_OUT') {
      // 集滿 5 次：超光速跳躍逃逸
      ufoGroup.position.addScaledVector(escapeDir, delta * 50);
      ufoGroup.scale.multiplyScalar(0.94);
      ufoGroup.rotation.y += delta * 25;

      if (ufoGroup.position.z < -40 || Math.abs(ufoGroup.position.x) > 35) {
        state = 'IDLE';
        ufoGroup.visible = false;
        badgeSprite.visible = false;
        ufoGroup.scale.set(0.9, 0.9, 0.9);
        nextUfoSpawn = now + 25000 + Math.random() * 15000;
      }
    }
  };

  const dispose = () => {
    domElement.removeEventListener('pointerdown', handlePointerDown);
    scene.remove(ufoGroup);
    upperGeo.dispose();
    lowerGeo.dispose();
    hullMat.dispose();
    domeGeo.dispose();
    domeMat.dispose();
    rimGeo.dispose();
    rimLights.forEach(rl => rl.mat.dispose());
    hitGeo.dispose();
    hitMat.dispose();
    badgeTexture.dispose();
    badgeMat.dispose();
  };

  return { update, dispose };
};
