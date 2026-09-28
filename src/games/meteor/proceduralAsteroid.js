import * as THREE from 'three';

// ── 簡易 3D 偽噪波演算法 (生成自然岩石起伏與撞擊坑) ──
function pseudoNoise3D(x, y, z) {
  const p = Math.sin(x * 1.7 + y * 2.3 + z * 3.1) * 43758.5453;
  return p - Math.floor(p);
}

function smoothNoise3D(x, y, z) {
  // 多階諧波複合噪波 (Octave Harmonic Noise)
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxValue = 0;

  for (let i = 0; i < 4; i++) {
    const nx = x * frequency;
    const ny = y * frequency;
    const nz = z * frequency;
    const n = Math.sin(nx + Math.cos(ny * 1.3)) * Math.cos(nz + Math.sin(nx * 0.9));
    total += n * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return total / maxValue;
}

/**
 * 動態生成程序化熔岩裂紋與玄武岩紋理 (記憶體 Canvas，零外部檔案)
 */
function createProceduralTextures() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 1. 底層玄武岩石質感 (深炭灰與微小噪點)
  ctx.fillStyle = '#222226';
  ctx.fillRect(0, 0, size, size);

  // 斑駁岩石微紋
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 40;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain * 0.8));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain * 0.7));
  }
  ctx.putImageData(imgData, 0, 0);

  // 2. 繪製熾熱岩漿裂紋 (Magma Veins)
  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = size;
  emissiveCanvas.height = size;
  const eCtx = emissiveCanvas.getContext('2d');
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);

  // 隨機分支裂紋
  eCtx.strokeStyle = '#ff5500';
  eCtx.lineWidth = 4;
  eCtx.shadowColor = '#ff2200';
  eCtx.shadowBlur = 10;

  for (let c = 0; c < 8; c++) {
    let px = Math.random() * size;
    let py = Math.random() * size;
    eCtx.beginPath();
    eCtx.moveTo(px, py);
    const steps = 15 + Math.floor(Math.random() * 15);
    for (let s = 0; s < steps; s++) {
      px += (Math.random() - 0.5) * 50;
      py += (Math.random() - 0.5) * 50;
      eCtx.lineTo(px, py);
    }
    eCtx.stroke();
  }

  // 裂隙高亮內核 (白金色高溫)
  eCtx.strokeStyle = '#ffee88';
  eCtx.lineWidth = 1.5;
  eCtx.stroke();

  // 將裂紋繪製回漫反射貼圖
  ctx.globalAlpha = 0.8;
  ctx.drawImage(emissiveCanvas, 0, 0);
  ctx.globalAlpha = 1.0;

  const diffuseTexture = new THREE.CanvasTexture(canvas);
  const emissiveTexture = new THREE.CanvasTexture(emissiveCanvas);

  diffuseTexture.wrapS = THREE.RepeatWrapping;
  diffuseTexture.wrapT = THREE.RepeatWrapping;
  emissiveTexture.wrapS = THREE.RepeatWrapping;
  emissiveTexture.wrapT = THREE.RepeatWrapping;

  return { diffuseTexture, emissiveTexture };
}

/**
 * 建立一顆高細分度、流暢天然的 3D 星際隕石 Mesh
 * @param {number} radius - 隕石基準半徑
 * @returns {THREE.Group} - 包含隕石本體、岩漿材質與大氣電漿光暈的物件組
 */
export function createProceduralAsteroid(radius = 3.2) {
  const group = new THREE.Group();

  // 1. 高細分度幾何球體 (detail=3 約 642 頂點，兼具平滑曲面與極速效能)
  const geometry = new THREE.IcosahedronGeometry(radius, 3);
  const posAttr = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  // 2. 3D 多重噪波雕刻：生成撞擊坑 (Craters) 與自然岩脊
  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    // 局部橢圓不對稱形變
    vertex.x *= 1.0 + Math.sin(vertex.y * 0.3) * 0.15;
    vertex.z *= 0.95 + Math.cos(vertex.x * 0.3) * 0.12;

    // 噪波擾動：大坑窪 + 小岩石顆粒
    const n = smoothNoise3D(vertex.x * 0.45, vertex.y * 0.45, vertex.z * 0.45);
    const detailNoise = smoothNoise3D(vertex.x * 1.8, vertex.y * 1.8, vertex.z * 1.8) * 0.35;
    
    // 向法線方向凸出或凹陷
    const displacement = (n + detailNoise) * 0.9;
    vertex.addScaledVector(vertex.clone().normalize(), displacement);

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  // 關鍵：法線平滑計算，消除任何摺紙般的多邊形稜角，產生天然鵝卵石/星際巨石的平滑感
  geometry.computeVertexNormals();

  // 3. PBR 物理光照材質 (玄武岩 + 動態熾熱岩漿)
  const { diffuseTexture, emissiveTexture } = createProceduralTextures();

  const rockMaterial = new THREE.MeshStandardMaterial({
    map: diffuseTexture,
    emissive: new THREE.Color(0xff4400),
    emissiveMap: emissiveTexture,
    emissiveIntensity: 1.6,
    roughness: 0.85,
    metalness: 0.2,
    flatShading: false // 絕對不使用 flatShading！保證流暢圓滑
  });

  const rockMesh = new THREE.Mesh(geometry, rockMaterial);
  rockMesh.castShadow = true;
  rockMesh.receiveShadow = true;
  group.add(rockMesh);

  // 4. 大氣摩擦電漿外光暈 (Fresnel Atmospheric Glow)
  const glowGeo = new THREE.IcosahedronGeometry(radius * 1.18, 2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.28,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  group.add(glowMesh);

  // 5. 核心動態點光源 (讓燃燒的隕石在太空中散發暖橙色光暈照亮周遭)
  const pointLight = new THREE.PointLight(0xff7722, 2.8, 25);
  group.add(pointLight);

  return {
    group,
    rockMesh,
    glowMesh,
    pointLight,
    material: rockMaterial,
    geometry,
    update: (time, progress) => {
      // 複合多軸自轉
      rockMesh.rotation.x += 0.012;
      rockMesh.rotation.y += 0.018;
      rockMesh.rotation.z += 0.007;

      // 隨下墜進度劇烈燃燒 (接近地表時岩漿光更刺眼)
      const pulse = Math.sin(time * 6) * 0.35 + 1.65;
      rockMaterial.emissiveIntensity = pulse + progress * 0.8;
      glowMesh.scale.setScalar(1.0 + Math.sin(time * 8) * 0.05);
    },
    dispose: () => {
      geometry.dispose();
      glowGeo.dispose();
      rockMaterial.dispose();
      glowMat.dispose();
      if (diffuseTexture) diffuseTexture.dispose();
      if (emissiveTexture) emissiveTexture.dispose();
    }
  };
}
