import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createProceduralAsteroid } from './proceduralAsteroid';

/**
 * 隕石地球守衛戰 3D 核心渲染畫布 (Three.js WebGL Engine)
 */
export const MeteorCanvas3D = ({
  currentMeteor,
  subMode,
  isExploding,
  onImpactComplete,
  laserTrigger,
  onExplosionFinish
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const asteroidObjRef = useRef(null);
  const animIdRef = useRef(null);
  const laserBeamRef = useRef(null);
  const particlesRef = useRef([]);
  const debrisRef = useRef([]);
  const shockwavesRef = useRef([]);
  const wordSpriteRef = useRef(null);
  const shakeRef = useRef({ time: 0, intensity: 0 });

  // ── 建立單字 3D 全息名牌 (CanvasTexture Sprite，隨 3D 透視縮放) ──
  const createWordSprite = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    // 圓角深色發光膠囊底板
    ctx.fillStyle = 'rgba(10, 15, 35, 0.85)';
    ctx.strokeStyle = '#38bdf8'; // Sky blue border
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 18;

    const r = 30;
    const w = 480;
    const h = 130;
    const x = 16;
    const y = 15;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 雙層高對比文字 (避免背景干擾，極佳辨識度)
    ctx.shadowBlur = 0;
    ctx.font = '900 64px "Nunito", "Fredoka", "Microsoft JhengHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#000000';
    ctx.fillText(text, 256 + 2, 80 + 2);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 256, 80);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(7.5, 2.3, 1);
    return { sprite, texture, spriteMat };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. 場景 (Scene)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x060919, 0.008);

    // 2. 相機 (Camera)
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 800);
    camera.position.set(0, 1.5, 24);
    cameraRef.current = camera;

    // 3. 渲染器 (WebGLRenderer)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. 深邃星空背景 (1,200 顆彩色星點)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorChoices = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa5f3fc),
      new THREE.Color(0xfef08a),
      new THREE.Color(0xc084fc)
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPos[idx] = (Math.random() - 0.5) * 400;
      starPos[idx + 1] = (Math.random() - 0.5) * 260;
      starPos[idx + 2] = -50 - Math.random() * 300;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      starColors[idx] = c.r;
      starColors[idx + 1] = c.g;
      starColors[idx + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. 地球大氣防衛圈 (地平線弧形大氣發光層)
    const earthGeo = new THREE.SphereGeometry(75, 48, 24);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0c2554,
      emissive: 0x003366,
      emissiveIntensity: 0.6,
      roughness: 0.9,
      metalness: 0.1
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(0, -78, 5);
    scene.add(earthMesh);

    // 地球大氣發光環
    const atmoGeo = new THREE.RingGeometry(74.5, 76.5, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmoMesh.rotation.x = Math.PI / 2.2;
    atmoMesh.position.set(0, -74, 5);
    scene.add(atmoMesh);

    // 6. 光源系統 (Directional Sun + Ambient + Defense Beam Light)
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.5);
    sunLight.position.set(25, 30, 20);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x182442, 1.4);
    scene.add(ambientLight);

    // 7. 火焰尾跡粒子系統 (Trail Particles)
    const maxTrail = 80;
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
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const trailPoints = new THREE.Points(trailGeo, trailMat);
    scene.add(trailPoints);

    const trailData = [];
    for (let i = 0; i < maxTrail; i++) {
      trailData.push({ active: false, life: 0, maxLife: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
    }

    // 8. 視窗尺寸監聽
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. 動畫主循環
    let lastTime = performance.now();
    const animate = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 緩慢自轉星空
      starField.rotation.y += 0.0003;

      // 鏡頭微震效果 (Camera Shake)
      if (shakeRef.current.time > 0) {
        shakeRef.current.time -= delta;
        const mag = shakeRef.current.intensity;
        camera.position.x = (Math.random() - 0.5) * mag;
        camera.position.y = 1.5 + (Math.random() - 0.5) * mag;
      } else {
        camera.position.x = 0;
        camera.position.y = 1.5;
      }

      // 更新隕石本體動畫
      if (asteroidObjRef.current && asteroidObjRef.current.group.visible) {
        asteroidObjRef.current.update(now * 0.001, 0.5);

        // 噴發尾跡火焰粒子
        const mPos = asteroidObjRef.current.group.position;
        for (let k = 0; k < 2; k++) {
          const p = trailData.find(d => !d.active);
          if (p) {
            p.active = true;
            p.life = 0;
            p.maxLife = 0.4 + Math.random() * 0.3;
            p.x = mPos.x + (Math.random() - 0.5) * 1.5;
            p.y = mPos.y + 0.8 + Math.random() * 0.8;
            p.z = mPos.z - 1.2 - Math.random() * 1.5;
            p.vx = (Math.random() - 0.5) * 1.8;
            p.vy = 1.2 + Math.random() * 2.0;
            p.vz = -2.5 - Math.random() * 2.5;
          }
        }
      }

      // 更新尾跡粒子
      let pIdx = 0;
      for (let i = 0; i < maxTrail; i++) {
        const p = trailData[i];
        if (p.active) {
          p.life += delta;
          if (p.life >= p.maxLife) {
            p.active = false;
          } else {
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.z += p.vz * delta;

            const progress = p.life / p.maxLife;
            trailPositions[pIdx * 3] = p.x;
            trailPositions[pIdx * 3 + 1] = p.y;
            trailPositions[pIdx * 3 + 2] = p.z;

            // 火焰顏色過渡：金色 ➔ 熾橙 ➔ 深紅
            trailColors[pIdx * 3] = 1.0;
            trailColors[pIdx * 3 + 1] = Math.max(0, 0.9 - progress * 0.8);
            trailColors[pIdx * 3 + 2] = Math.max(0, 0.2 - progress * 0.2);
            trailSizes[pIdx] = (1.0 - progress) * 3.5;
            pIdx++;
          }
        }
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;
      trailGeo.setDrawRange(0, pIdx);

      // 更新爆炸碎屑 (Debris)
      for (let i = debrisRef.current.length - 1; i >= 0; i--) {
        const d = debrisRef.current[i];
        d.mesh.position.addScaledVector(d.velocity, delta * 30);
        d.mesh.rotation.x += d.rotSpeed.x;
        d.mesh.rotation.y += d.rotSpeed.y;
        d.life -= delta;
        d.mesh.scale.multiplyScalar(0.96);

        if (d.life <= 0) {
          scene.remove(d.mesh);
          d.mesh.geometry.dispose();
          d.mesh.material.dispose();
          debrisRef.current.splice(i, 1);
        }
      }

      // 更新衝擊波 (Shockwave)
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += delta * 35;
        sw.mesh.scale.set(sw.radius, sw.radius, sw.radius);
        sw.mesh.material.opacity = Math.max(0, sw.mesh.material.opacity - delta * 2.2);

        if (sw.mesh.material.opacity <= 0.02) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          shockwavesRef.current.splice(i, 1);
        }
      }

      // 更新發射中的雷射光束 (Laser Beam)
      if (laserBeamRef.current && laserBeamRef.current.active) {
        const lb = laserBeamRef.current;
        lb.progress += delta / lb.duration;
        const currentBeamPos = new THREE.Vector3().lerpVectors(lb.start, lb.target, Math.min(lb.progress, 1));
        lb.mesh.position.copy(currentBeamPos);

        if (lb.progress >= 1.0) {
          lb.active = false;
          scene.remove(lb.mesh);
          if (lb.onHit) lb.onHit();
        }
      }

      renderer.render(scene, camera);
      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      if (asteroidObjRef.current) {
        asteroidObjRef.current.dispose();
      }
    };
  }, []);

  // ── 生成或更新 3D 隕石 ──
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (!currentMeteor || isExploding) {
      if (asteroidObjRef.current) {
        asteroidObjRef.current.group.visible = false;
      }
      if (wordSpriteRef.current) {
        wordSpriteRef.current.sprite.visible = false;
      }
      return;
    }

    // 若尚未建立 3D 隕石物件，進行程序化建構
    if (!asteroidObjRef.current) {
      const asteroid = createProceduralAsteroid(2.8);
      scene.add(asteroid.group);
      asteroidObjRef.current = asteroid;
    }

    const asteroid = asteroidObjRef.current;
    asteroid.group.visible = true;

    // 更新 3D 全息單字名牌
    if (wordSpriteRef.current) {
      scene.remove(wordSpriteRef.current.sprite);
      wordSpriteRef.current.texture.dispose();
      wordSpriteRef.current.spriteMat.dispose();
      wordSpriteRef.current = null;
    }

    const displayText = subMode === 'zh-en' ? currentMeteor.word.zh : currentMeteor.word.en;
    const { sprite, texture, spriteMat } = createWordSprite(displayText);
    scene.add(sprite);
    wordSpriteRef.current = { sprite, texture, spriteMat };

  }, [currentMeteor, subMode, isExploding]);

  // ── 隕石 3D 下墜即時軌跡計算 ──
  useEffect(() => {
    if (!currentMeteor || isExploding) return;

    // 將 x: 15%~85% 映射至 3D 空間 X 座標 (-14 ~ +14)
    const targetX = ((currentMeteor.x - 50) / 35) * 11;
    const spawnZ = -55;
    const targetZ = 12;
    const spawnY = 16;
    const targetY = -4;

    const startPos = new THREE.Vector3(targetX * 0.7, spawnY, spawnZ);
    const endPos = new THREE.Vector3(targetX, targetY, targetZ);

    let frameId;
    const updateMotion = (now) => {
      const elapsed = (now - currentMeteor.startTime) / 1000;
      const progress = Math.min(elapsed / currentMeteor.duration, 1);

      // 非線性下墜插值 (前段緩衝、後段加速逼近)
      const easeProgress = Math.pow(progress, 1.4);

      if (asteroidObjRef.current && asteroidObjRef.current.group.visible) {
        const curPos = new THREE.Vector3().lerpVectors(startPos, endPos, easeProgress);
        asteroidObjRef.current.group.position.copy(curPos);

        // 讓全息單字牌浮在隕石上方
        if (wordSpriteRef.current && wordSpriteRef.current.sprite) {
          wordSpriteRef.current.sprite.position.set(curPos.x, curPos.y + 3.8, curPos.z);
          wordSpriteRef.current.sprite.visible = true;
        }
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(updateMotion);
      }
    };

    frameId = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(frameId);
  }, [currentMeteor, isExploding]);

  // ── 雷射射擊與攔截動畫 ──
  useEffect(() => {
    if (!laserTrigger || !sceneRef.current || !asteroidObjRef.current) return;

    const scene = sceneRef.current;
    const meteorPos = asteroidObjRef.current.group.position.clone();
    const cannonPos = new THREE.Vector3(0, -6, 18);

    // 建立高能雷射光柱 (Cyber Cyan Core + Glowing Aura)
    const beamGeo = new THREE.CylinderGeometry(0.35, 0.35, 6, 8);
    beamGeo.rotateX(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({
      color: laserTrigger.isCorrect ? 0x00f5ff : 0xff3344,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.copy(cannonPos);
    beamMesh.lookAt(meteorPos);
    scene.add(beamMesh);

    laserBeamRef.current = {
      mesh: beamMesh,
      start: cannonPos,
      target: meteorPos,
      progress: 0,
      duration: 0.15, // 0.15秒極速直擊
      active: true,
      onHit: () => {
        if (laserTrigger.isCorrect) {
          triggerExplosion(meteorPos);
        } else {
          // 答錯輕微震動
          shakeRef.current = { time: 0.25, intensity: 0.6 };
        }
      }
    };

  }, [laserTrigger]);

  // ── 3D 碎石爆裂與衝擊波特效 ──
  const triggerExplosion = (hitPos) => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 1. 鏡頭震顫
    shakeRef.current = { time: 0.45, intensity: 1.2 };

    // 2. 隱藏名牌與隕石
    if (asteroidObjRef.current) asteroidObjRef.current.group.visible = false;
    if (wordSpriteRef.current) wordSpriteRef.current.sprite.visible = false;

    // 3. 生成 30 塊拋射燃燒岩石碎片 (Debris)
    for (let i = 0; i < 28; i++) {
      const sz = 0.4 + Math.random() * 0.9;
      const debGeo = new THREE.DodecahedronGeometry(sz, 0);
      const debMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        emissive: 0xff4400,
        emissiveIntensity: 2.0,
        roughness: 0.7
      });
      const debMesh = new THREE.Mesh(debGeo, debMat);
      debMesh.position.copy(hitPos);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 1.6
      ).normalize().multiplyScalar(0.4 + Math.random() * 0.8);

      scene.add(debMesh);
      debrisRef.current.push({
        mesh: debMesh,
        velocity: vel,
        rotSpeed: { x: Math.random() * 0.3, y: Math.random() * 0.3 },
        life: 0.6 + Math.random() * 0.4
      });
    }

    // 4. 產生環形高光衝擊波 (Shockwave Ring)
    const ringGeo = new THREE.RingGeometry(0.5, 1.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.copy(hitPos);
    ringMesh.lookAt(cameraRef.current.position);
    scene.add(ringMesh);

    shockwavesRef.current.push({
      mesh: ringMesh,
      radius: 1,
      maxRadius: 18
    });

    if (onExplosionFinish) onExplosionFinish();
  };

  return (
    <div
      ref={mountRef}
      className="w-full h-[360px] sm:h-[460px] rounded-3xl overflow-hidden relative shadow-2xl border-2 border-cyan-500/40"
      style={{ background: 'radial-gradient(circle at 50% 40%, #0c142b 0%, #04060d 90%)' }}
    />
  );
};
