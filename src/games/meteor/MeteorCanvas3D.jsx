import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createProceduralAsteroid } from './proceduralAsteroid';
import { calculateMeteorMotionProgress } from './meteorPhysics';
import { createShootingStarSystem, createSatelliteSystem, createUfoSystem } from './easterEggs3D';

/**
 * 隕石地球守衛戰 3D 核心渲染畫布 (Three.js WebGL Engine)
 * 包含：平滑有機隕石、深空星系、大氣防禦層、賽博雷射砲、3D 衝擊波與 3D 彩蛋系統 (流星、衛星、UFO)
 */
export const MeteorCanvas3D = ({
  currentMeteor,
  subMode,
  isExploding,
  laserTrigger,
  onExplosionFinish,
  questionIndex = 0,
  onUfoSuccess,
  horizonOffset = 0,
  shields = 0
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const asteroidObjRef = useRef(null);
  const earthMeshRef = useRef(null);
  const atmoMeshRef = useRef(null);
  const shieldGroupRef = useRef(null);
  const shieldMeshesRef = useRef([]);
  const shieldsRef = useRef(shields);
  const animIdRef = useRef(null);
  const laserBeamRef = useRef(null);
  const debrisRef = useRef([]);
  const shockwavesRef = useRef([]);
  const wordSpriteRef = useRef(null);
  const shakeRef = useRef({ time: 0, intensity: 0 });

  // 彩蛋系統參照
  const shootingStarRef = useRef(null);
  const satelliteRef = useRef(null);
  const ufoRef = useRef(null);

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

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. 場景 (Scene)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x060919, 0.008);

    // 2. 相機 (Camera) - 適度後拉相機至 z: 27，拓展深空視野
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 800);
    camera.position.set(0, 1.8, 27);
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

    // 4. 深空星雲天球 (GPU GLSL Nebula Backdrop) + 1,400 顆多色溫閃爍星海
    const nebulaGeo = new THREE.PlaneGeometry(520, 320);
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
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
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = p * 2.02 + vec2(17.3, 29.1);
            a *= 0.5;
          }
          return v;
        }
        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          float n1 = fbm(uv * 1.8 + vec2(uTime * 0.008, -uTime * 0.005));
          float n2 = fbm(uv * 3.4 - vec2(uTime * 0.012, uTime * 0.006) + n1);
          vec3 deepSpace = vec3(0.015, 0.025, 0.075);
          vec3 violetNebula = vec3(0.22, 0.07, 0.42) * smoothstep(0.35, 0.85, n1);
          vec3 cyanNebula = vec3(0.04, 0.32, 0.55) * smoothstep(0.42, 0.88, n2);
          vec3 goldCore = vec3(0.55, 0.25, 0.12) * smoothstep(0.62, 0.95, n1 * n2 * 1.6);
          vec3 col = deepSpace + violetNebula * 0.65 + cyanNebula * 0.55 + goldCore * 0.45;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebulaMesh.position.set(0, 10, -240);
    scene.add(nebulaMesh);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 1400;
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
      starPos[idx + 2] = -50 - Math.random() * 180;

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
      opacity: 0.9
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. 地球大氣防衛圈 (GLSL 大氣瑞利散射 + 大陸海洋雲層 + 夜間黃金城市燈火)
    const earthGeo = new THREE.SphereGeometry(75, 64, 48);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying vec3 vObjPos;
        void main() {
          vObjPos = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying vec3 vObjPos;
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + 0.1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float noise(vec3 x) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }
        float fbm(vec3 p) {
          float v = 0.0; float a = 0.5;
          for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.05; a *= 0.5; }
          return v;
        }
        void main() {
          vec3 n = normalize(vNormal);
          vec3 v = normalize(vViewPos);
          vec3 p = vObjPos * 0.055 + vec3(uTime * 0.015, 0.0, 0.0);
          float continent = smoothstep(0.47, 0.56, fbm(p));
          float clouds = smoothstep(0.52, 0.78, fbm(p * 1.8 + vec3(uTime * 0.025, 0.0, 0.0)));
          float cityCluster = smoothstep(0.62, 0.76, noise(p * 9.5)) * continent;

          vec3 oceanCol = vec3(0.02, 0.14, 0.38);
          vec3 landCol = vec3(0.04, 0.28, 0.24);
          vec3 baseCol = mix(oceanCol, landCol, continent);
          // 夜間黃金城市燈火網絡
          baseCol += vec3(1.0, 0.78, 0.32) * cityCluster * 0.65;
          // 柔和白雲帶
          baseCol = mix(baseCol, vec3(0.82, 0.92, 1.0), clouds * 0.42);

          // 瑞利大氣層邊緣散射藍青輝光 (Atmospheric Limb Glow)
          float fresnel = pow(1.0 - max(dot(v, n), 0.0), 2.2);
          vec3 atmoGlow = mix(vec3(0.12, 0.55, 1.0), vec3(0.45, 0.92, 1.0), fresnel) * fresnel * 1.45;

          gl_FragColor = vec4(baseCol + atmoGlow, 1.0);
        }
      `
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(0, -78, 5);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 地球高空電離層柔和光環
    const atmoGeo = new THREE.RingGeometry(74.2, 77.2, 96);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float dist = length(vUv - vec2(0.5)) * 2.0;
          float alpha = smoothstep(0.92, 0.965, dist) * (1.0 - smoothstep(0.965, 1.0, dist));
          gl_FragColor = vec4(0.25, 0.78, 1.0, alpha * 0.65);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmoMesh.rotation.x = Math.PI / 2.2;
    atmoMesh.position.set(0, -74, 5);
    scene.add(atmoMesh);
    atmoMeshRef.current = atmoMesh;

    // 5.5 地球白色呼吸防護罩 (每50分加一層，最多顯示5層向太空外擴的呼吸光暈)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(0, -74, 5);
    shieldGroup.rotation.x = Math.PI / 2.2;
    scene.add(shieldGroup);
    shieldGroupRef.current = shieldGroup;

    const layerConfigs = [
      { inner: 76.6, outer: 79.0, color: 0xffffff, opacity: 0.40 },
      { inner: 79.0, outer: 81.6, color: 0xf8fafc, opacity: 0.50 },
      { inner: 81.6, outer: 84.4, color: 0xf1f5f9, opacity: 0.60 },
      { inner: 84.4, outer: 87.5, color: 0xe2e8f0, opacity: 0.70 },
      { inner: 87.5, outer: 91.0, color: 0xffffff, opacity: 0.85 }
    ];

    const shieldMeshes = layerConfigs.map((cfg) => {
      const geo = new THREE.RingGeometry(cfg.inner, cfg.outer, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      mesh.userData = { baseOpacity: cfg.opacity };
      shieldGroup.add(mesh);
      return mesh;
    });
    shieldMeshesRef.current = shieldMeshes;

    // 6. 光源系統
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.5);
    sunLight.position.set(25, 30, 20);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x182442, 1.4);
    scene.add(ambientLight);

    // 7. 3D 彩蛋系統實例化 (流星、人造衛星、UFO)
    const shootingStar = createShootingStarSystem(scene);
    shootingStarRef.current = shootingStar;

    const satellite = createSatelliteSystem(scene);
    satelliteRef.current = satellite;

    const ufo = createUfoSystem(scene, camera, renderer.domElement, onUfoSuccess);
    ufoRef.current = ufo;

    // 8. 柔和圓形光暈火焰尾跡粒子系統 (Volumetric Fireball Trail Particles)
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pCtx = particleCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    pGrad.addColorStop(0.35, 'rgba(255, 200, 80, 0.85)');
    pGrad.addColorStop(0.7, 'rgba(255, 80, 10, 0.35)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const particleTex = new THREE.CanvasTexture(particleCanvas);

    const maxTrail = 110;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(maxTrail * 3);
    const trailColors = new Float32Array(maxTrail * 3);
    const trailSizes = new Float32Array(maxTrail);

    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    trailGeo.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

    const trailMat = new THREE.PointsMaterial({
      size: 4.2,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const trailPoints = new THREE.Points(trailGeo, trailMat);
    scene.add(trailPoints);

    const trailData = [];
    for (let i = 0; i < maxTrail; i++) {
      trailData.push({ active: false, life: 0, maxLife: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
    }

    // 9. 視窗尺寸監聽 (支援 iPad 旋轉與全螢幕變更)
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 10. 動畫主循環
    let lastTime = performance.now();
    const animate = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 緩慢自轉星空與推進星雲/地球時間軸
      starField.rotation.y += 0.0003;
      const elapsedSec = now * 0.001;
      nebulaMat.uniforms.uTime.value = elapsedSec;
      earthMat.uniforms.uTime.value = elapsedSec;

      // 更新 3D 彩蛋 (流星、衛星、UFO)
      if (shootingStarRef.current) shootingStarRef.current.update(delta, now);
      if (satelliteRef.current) satelliteRef.current.update(delta, now);
      if (ufoRef.current) ufoRef.current.update(delta, now);

      // 鏡頭微震效果 (Camera Shake)
      if (shakeRef.current.time > 0) {
        shakeRef.current.time -= delta;
        const mag = shakeRef.current.intensity;
        camera.position.x = (Math.random() - 0.5) * mag;
        camera.position.y = 1.8 + (Math.random() - 0.5) * mag;
      } else {
        camera.position.x = 0;
        camera.position.y = 1.8;
      }

      // 更新隕石本體動畫與尾跡
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
          lb.mesh.geometry?.dispose();
          if (Array.isArray(lb.mesh.material)) {
            lb.mesh.material.forEach(m => m.dispose());
          } else if (lb.mesh.material) {
            lb.mesh.material.dispose();
          }
          if (lb.onHit) lb.onHit();
        }
      }

      // 5.6 更新地球白色呼吸防護罩 (每50分加一層，向外太空傳導的漣漪呼吸光波)
      const currentShields = shieldsRef.current || 0;
      const displayLayers = Math.min(5, Math.max(0, currentShields));
      const t = (now || performance.now()) * 0.001;
      shieldMeshesRef.current.forEach((mesh, idx) => {
        if (idx < displayLayers) {
          mesh.visible = true;
          // 向太空傳播的外擴光波：相位依 idx 由內向外延遲 (- idx * 0.72)
          const wave = Math.sin(t * 2.4 - idx * 0.72);
          const breath = Math.max(0.18, (wave * 0.35 + 0.65) * mesh.userData.baseOpacity);
          mesh.material.opacity = breath;
          // 顯著且優雅的向外呼吸微幅擴展：由內向外產生 2.2%~4.5% 的層次漣漪擴散
          const outwardExpansion = 1.0 + (wave * 0.5 + 0.5) * (0.022 + idx * 0.006);
          mesh.scale.set(outwardExpansion, outwardExpansion, 1.0);
        } else {
          mesh.visible = false;
        }
      });

      renderer.render(scene, camera);
      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (shootingStarRef.current) shootingStarRef.current.dispose();
      if (satelliteRef.current) satelliteRef.current.dispose();
      if (ufoRef.current) ufoRef.current.dispose();
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      if (asteroidObjRef.current) {
        asteroidObjRef.current.dispose();
      }

      // 深度遍歷釋放場景中所有網格、幾何體與材質 (徹底杜絕 GPU 顯存洩漏)
      if (sceneRef.current) {
        sceneRef.current.traverse((obj) => {
          if (obj.isMesh || obj.isPoints) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => {
                m.map?.dispose();
                m.dispose();
              });
            } else if (obj.material) {
              obj.material.map?.dispose();
              obj.material.dispose();
            }
          }
        });
      }

      // 清理未消散的碎屑、衝擊波與名牌 Texture
      if (debrisRef.current) {
        debrisRef.current.forEach(d => {
          d.mesh?.geometry?.dispose();
          d.mesh?.material?.dispose();
        });
        debrisRef.current = [];
      }
      if (shockwavesRef.current) {
        shockwavesRef.current.forEach(sw => {
          sw.mesh?.geometry?.dispose();
          sw.mesh?.material?.dispose();
        });
        shockwavesRef.current = [];
      }
      if (wordSpriteRef.current) {
        wordSpriteRef.current.texture?.dispose();
        wordSpriteRef.current.spriteMat?.dispose();
        wordSpriteRef.current = null;
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

  // ── 同步地球防護罩層數 ──
  useEffect(() => {
    shieldsRef.current = shields;
  }, [shields]);

  // ── 響應重力壓制：平滑升降地球大氣防衛圈與防護罩 ──
  useEffect(() => {
    if (earthMeshRef.current && atmoMeshRef.current) {
      const shift = (horizonOffset || 0) * 0.28;
      earthMeshRef.current.position.y = -78 + shift;
      atmoMeshRef.current.position.y = -74 + shift;
      if (shieldGroupRef.current) {
        shieldGroupRef.current.position.y = -74 + shift;
      }
    }
  }, [horizonOffset]);

  // ── 隕石 3D 下墜即時軌跡計算 (套用兩段式與動態重力加速度物理引擎) ──
  useEffect(() => {
    if (!currentMeteor || isExploding) return;

    const targetX = ((currentMeteor.x - 50) / 35) * 11;
    const spawnZ = -75; // 大幅拉深起始空域，讓學生有更充裕的辨字反應時間
    const targetZ = 6;  // 地平線墜落終點推遠，避免在靠近鏡頭時過大遮蓋畫面
    const spawnY = 17;
    const targetY = -4;

    const startPos = new THREE.Vector3(targetX * 0.7, spawnY, spawnZ);
    const endPos = new THREE.Vector3(targetX, targetY, targetZ);

    let frameId;
    const updateMotion = (now) => {
      const elapsed = (now - currentMeteor.startTime) / 1000;
      // 使用統一物理運動進度計算
      const motionProgress = calculateMeteorMotionProgress(elapsed, currentMeteor.duration, questionIndex);

      if (asteroidObjRef.current && asteroidObjRef.current.group.visible) {
        const curPos = new THREE.Vector3().lerpVectors(startPos, endPos, motionProgress);
        asteroidObjRef.current.group.position.copy(curPos);

        // 全息單字名牌浮在隕石上方
        if (wordSpriteRef.current && wordSpriteRef.current.sprite) {
          wordSpriteRef.current.sprite.position.set(curPos.x, curPos.y + 3.8, curPos.z);
          wordSpriteRef.current.sprite.visible = true;
        }
      }

      if (elapsed < currentMeteor.duration) {
        frameId = requestAnimationFrame(updateMotion);
      }
    };

    frameId = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(frameId);
  }, [currentMeteor, isExploding, questionIndex]);

  // ── 雷射射擊與攔截動畫 ──
  useEffect(() => {
    if (!laserTrigger || !sceneRef.current || !asteroidObjRef.current) return;

    const scene = sceneRef.current;
    const meteorPos = asteroidObjRef.current.group.position.clone();
    const cannonPos = new THREE.Vector3(0, -6, 18);

    // 建立高能雷射光柱 (Cyber Cyan Core)
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
      duration: 0.15,
      active: true,
      onHit: () => {
        if (laserTrigger.isCorrect) {
          triggerExplosion(meteorPos);
        } else {
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

    // 3. 生成 28 塊拋射燃燒岩石碎片
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
      className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl border-2 border-cyan-500/40"
      style={{ background: 'radial-gradient(circle at 50% 40%, #0c142b 0%, #04060d 90%)' }}
    />
  );
};
