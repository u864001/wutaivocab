import * as THREE from 'three';

/**
 * 3D 地球守衛戰：專屬 3D 彩蛋系統 (飛機雲流星、人造衛星、UFO 飛碟)
 * 完美融入 Three.js 空間透視與深空光影，保留真實 3D 質感
 */

// ── 1. 3D 背景飛機雲微光流星 (純背景氛圍，定點拖曳消散，柔和不搶眼) ──
export const createShootingStarSystem = (scene) => {
  const maxTrail = 40;
  const trailGeo = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(maxTrail * 3);
  const trailColors = new Float32Array(maxTrail * 3);
  const trailSizes = new Float32Array(maxTrail);

  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
  trailGeo.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

  const trailMat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const trailPoints = new THREE.Points(trailGeo, trailMat);
  trailPoints.visible = false;
  scene.add(trailPoints);

  // 流星頭部亮白光核
  const headGeo = new THREE.SphereGeometry(0.25, 8, 8);
  const headMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  });
  const headMesh = new THREE.Mesh(headGeo, headMat);
  headMesh.visible = false;
  scene.add(headMesh);

  let active = false;
  let history = []; // [{x, y, z, alpha, size}]
  let startX = 0, startY = 0, startZ = 0;
  let dirX = 0, dirY = 0, dirZ = 0;
  let speed = 0;
  let elapsed = 0;
  let duration = 0;
  let nextSpawnTime = performance.now() + 5000 + Math.random() * 6000;

  const spawn = (now) => {
    active = true;
    elapsed = 0;
    duration = 0.9 + Math.random() * 0.45;
    startX = -35 + (Math.random() - 0.5) * 12;
    startY = 20 + Math.random() * 8;
    startZ = -60 - Math.random() * 30;

    dirX = 0.88 + Math.random() * 0.15;
    dirY = -0.52 - Math.random() * 0.15;
    dirZ = 0.18 + Math.random() * 0.15;
    speed = 42 + Math.random() * 20;

    history = [];
    trailPoints.visible = true;
    headMesh.visible = true;
    nextSpawnTime = now + 9000 + Math.random() * 10000;
  };

  const update = (delta, now) => {
    if (!active && now >= nextSpawnTime) {
      spawn(now);
    }

    if (active) {
      elapsed += delta;

      if (elapsed < duration) {
        const headX = startX + dirX * speed * elapsed;
        const headY = startY + dirY * speed * elapsed;
        const headZ = startZ + dirZ * speed * elapsed;
        headMesh.position.set(headX, headY, headZ);

        // 頭部光亮：前 15% 迅速變明，後 85% 逐漸轉暗
        let headAlpha = 0;
        const p = elapsed / duration;
        if (p < 0.15) {
          headAlpha = p / 0.15;
        } else {
          headAlpha = Math.max(0, 1.0 - (p - 0.15) / 0.85);
        }
        headMat.opacity = headAlpha;

        // 在走過位置留下定點發光痕跡 (像飛機雲一樣留在原地不隨流星位移)
        if (headAlpha > 0.05) {
          history.push({
            x: headX,
            y: headY,
            z: headZ,
            alpha: headAlpha * 0.65,
            size: 2.2 * headAlpha
          });
          if (history.length > maxTrail) history.shift();
        }
      } else {
        headMesh.visible = false;
      }

      // 留在空中的飛機雲痕跡在原地衰減變淡消散
      let count = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        const pt = history[i];
        pt.alpha *= Math.pow(0.5, delta * 1.5);
        if (pt.alpha <= 0.02) {
          history.splice(i, 1);
          continue;
        }
        trailPositions[count * 3] = pt.x;
        trailPositions[count * 3 + 1] = pt.y;
        trailPositions[count * 3 + 2] = pt.z;

        trailColors[count * 3] = 0.8 * pt.alpha;
        trailColors[count * 3 + 1] = 0.95 * pt.alpha;
        trailColors[count * 3 + 2] = 1.0 * pt.alpha;
        trailSizes[count] = pt.size * (pt.alpha / 0.65);
        count++;
      }

      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;
      trailGeo.attributes.size.needsUpdate = true;
      trailGeo.setDrawRange(0, count);

      if (elapsed >= duration && history.length === 0) {
        active = false;
        trailPoints.visible = false;
      }
    }
  };

  const dispose = () => {
    scene.remove(trailPoints);
    scene.remove(headMesh);
    trailGeo.dispose();
    trailMat.dispose();
    headGeo.dispose();
    headMat.dispose();
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
    badgeCtx.fillText(clicks >= 5 ? '🛸 攔截成功！' : `🛸 ${clicks}/5 (${remainingSec.toFixed(1)}s)`, 128, 50);
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

    domeMat.emissive.setHex(0x0891b2);
  };

  // 觸控 / 點擊事件監聽 (原處急煞自轉)
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
        // 第一次點擊：原地急煞定格！開啟 3 秒倒數計時
        state = 'CLICKED';
        clickStartTime = now;
        clickCount = 1;
      } else if (state === 'CLICKED') {
        clickCount++;
      }

      const remaining = Math.max(0, 3.0 - (now - clickStartTime) / 1000);
      updateBadgeText(clickCount, remaining);

      // 檢查是否達成 5 次點擊加分條件
      if (clickCount >= 5) {
        state = 'WARP_OUT';
        domeMat.emissive.setHex(0x10b981);
        updateBadgeText(5, 0);

        if (onUfoSuccess) {
          onUfoSuccess(5); // 觸發成功回調
        }

        setTimeout(() => {
          escapeDir.set((Math.random() - 0.5) * 10, 15, -60).normalize();
        }, 300);
      }
    }
  };

  domElement.addEventListener('pointerdown', handlePointerDown);

  const update = (delta, now) => {
    rimLights.forEach((rl) => {
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
      const elapsed = (now - cruiseStartTime) / 1000;
      const speed = 3.6 + Math.sin(elapsed * 1.5) * 1.8;
      const dir = spawnFromLeft ? 1 : -1;
      
      ufoGroup.position.x += dir * speed * delta;
      ufoGroup.position.y += Math.sin(elapsed * 2.2) * delta * 1.5;
      ufoGroup.rotation.z = -dir * 0.15 + Math.sin(elapsed * 3) * 0.05;
      ufoGroup.rotation.y += delta * 1.2;

      if ((spawnFromLeft && ufoGroup.position.x > 24) || (!spawnFromLeft && ufoGroup.position.x < -24)) {
        state = 'IDLE';
        ufoGroup.visible = false;
        nextUfoSpawn = now + 20000 + Math.random() * 15000;
      }
    } else if (state === 'CLICKED') {
      // 原地急煞定格旋轉 (鎖死原本位置，僅自身自轉)
      ufoGroup.rotation.y += delta * 14.0;
      ufoGroup.rotation.z = Math.sin(now * 0.02) * 0.25;

      const elapsed = (now - clickStartTime) / 1000;
      const remaining = Math.max(0, 3.0 - elapsed);
      updateBadgeText(clickCount, remaining);

      if (remaining <= 0) {
        state = 'ESCAPE';
        domeMat.emissive.setHex(0xef4444);
        const escapeX = ufoGroup.position.x >= 0 ? 40 : -40;
        escapeDir.set(escapeX, 10, -10).normalize();
      }
    } else if (state === 'ESCAPE') {
      ufoGroup.position.addScaledVector(escapeDir, delta * 35);
      ufoGroup.rotation.y += delta * 20;

      if (Math.abs(ufoGroup.position.x) > 35 || Math.abs(ufoGroup.position.y) > 30) {
        state = 'IDLE';
        ufoGroup.visible = false;
        badgeSprite.visible = false;
        nextUfoSpawn = now + 18000 + Math.random() * 15000;
      }
    } else if (state === 'WARP_OUT') {
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
