import * as THREE from 'three';

// ── 3D 複合諧波噪波（供頂點自然有機雕塑，消除正多面體對稱感） ──
function smoothNoise3D(x, y, z) {
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

// ── GPU 原生 GLSL 3D 熔岩裂谷與電漿日冕著色器 (零多邊形感、60FPS 電影級畫質) ──
const ASTEROID_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vObjectPos;
  varying vec3 vWorldNormal;

  void main() {
    vObjectPos = position;
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ASTEROID_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uHeat;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vObjectPos;
  varying vec3 vWorldNormal;

  // 3D 偽隨機雜湊與平滑梯度噪波 (GPU Per-Pixel FBM)
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
      mix(
        mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = p * 2.03 + shift;
      a *= 0.5;
    }
    return v;
  }

  // 模擬玄武岩板塊裂谷 (Voronoi / Ridge Cracks)
  float ridgeNoise(vec3 p) {
    float n = fbm(p);
    return 1.0 - abs(n * 2.0 - 1.0);
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // 多尺度岩石與動態岩漿流座標
    vec3 pos = vObjectPos * 0.78;
    float rockGrain = fbm(pos * 2.6);
    float crater = fbm(pos * 0.95);

    // 熔岩裂隙網路 (隨時間緩慢湧動)
    float ridge1 = ridgeNoise(pos * 1.35 + vec3(uTime * 0.12, -uTime * 0.08, uTime * 0.1));
    float ridge2 = ridgeNoise(pos * 2.7 - vec3(uTime * 0.18));
    float crackMask = smoothstep(0.62, 0.92, ridge1 * 0.75 + ridge2 * 0.35);

    // 法線微擾動，產生高細節玄武岩凹凸立體光影
    vec3 perturbedNormal = normalize(normal + vec3(rockGrain - 0.5) * 0.35);
    vec3 lightDir = normalize(vec3(0.6, 0.7, 0.5));
    float diff = max(dot(perturbedNormal, lightDir), 0.0);

    // 玄武岩深邃礦物色澤
    vec3 coldRock = vec3(0.09, 0.08, 0.11);
    vec3 litRock = vec3(0.26, 0.22, 0.24);
    vec3 rockColor = mix(coldRock, litRock, diff * 0.85 + crater * 0.25);

    // 內部沸騰岩漿色階：深紅 ➔ 烈焰橙 ➔ 熾白金核
    float magmaCore = smoothstep(0.75, 0.98, ridge1 * 0.8 + ridge2 * 0.3);
    vec3 magmaDark = vec3(0.85, 0.12, 0.02);
    vec3 magmaOrange = vec3(1.0, 0.48, 0.04);
    vec3 magmaWhiteGold = vec3(1.0, 0.95, 0.65);

    vec3 magmaColor = mix(magmaDark, magmaOrange, crackMask);
    magmaColor = mix(magmaColor, magmaWhiteGold, magmaCore) * uHeat;

    // 進入大氣層的高溫摩擦電漿邊緣光 (Fresnel Rim Heating)
    float fresnel = pow(1.0 - max(dot(viewDir, perturbedNormal), 0.0), 2.4);
    vec3 rimPlasma = mix(vec3(1.0, 0.32, 0.02), vec3(1.0, 0.78, 0.25), fresnel) * fresnel * (1.1 + uHeat * 0.45);

    vec3 finalColor = mix(rockColor, magmaColor, crackMask * 0.92) + rimPlasma;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ── 外圍無稜角柔和電漿日冕著色器 (消除多邊形外殼邊界) ──
const CORONA_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const CORONA_FRAGMENT_SHADER = `
  uniform float uPulse;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    // BackSide 渲染時，中心向邊緣自然衰減為 0，絕無多邊形硬邊！
    float intensity = pow(max(dot(-viewDir, normal), 0.0), 2.6);
    vec3 glowColor = mix(vec3(1.0, 0.25, 0.0), vec3(1.0, 0.72, 0.2), intensity);
    gl_FragColor = vec4(glowColor, intensity * 0.52 * uPulse);
  }
`;

/**
 * 建立一顆 GPU GLSL 著色器驅動的高精細 3D 熔岩隕石 Mesh
 * @param {number} radius - 隕石基準半徑
 */
export function createProceduralAsteroid(radius = 3.2) {
  const group = new THREE.Group();

  // 1. 提高細分度至 detail=4 (約 2562 頂點，輪廓圓潤無折角，GPU 瞬間渲染)
  const geometry = new THREE.IcosahedronGeometry(radius, 4);
  const posAttr = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  // 2. 3D 有機岩體雕塑
  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    vertex.x *= 1.0 + Math.sin(vertex.y * 0.32) * 0.14;
    vertex.z *= 0.94 + Math.cos(vertex.x * 0.28) * 0.12;

    const n = smoothNoise3D(vertex.x * 0.42, vertex.y * 0.42, vertex.z * 0.42);
    const detailNoise = smoothNoise3D(vertex.x * 1.65, vertex.y * 1.65, vertex.z * 1.65) * 0.28;

    const displacement = (n + detailNoise) * 0.78;
    vertex.addScaledVector(vertex.clone().normalize(), displacement);

    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();

  // 3. GLSL 熔岩裂谷著色器材質
  const rockMaterial = new THREE.ShaderMaterial({
    vertexShader: ASTEROID_VERTEX_SHADER,
    fragmentShader: ASTEROID_FRAGMENT_SHADER,
    uniforms: {
      uTime: { value: Math.random() * 100.0 },
      uHeat: { value: 1.35 }
    }
  });

  const rockMesh = new THREE.Mesh(geometry, rockMaterial);
  group.add(rockMesh);

  // 4. 無縫漸層大氣摩擦電漿日冕 (Smooth Fresnel Corona)
  const glowGeo = new THREE.SphereGeometry(radius * 1.38, 32, 32);
  const glowMat = new THREE.ShaderMaterial({
    vertexShader: CORONA_VERTEX_SHADER,
    fragmentShader: CORONA_FRAGMENT_SHADER,
    uniforms: {
      uPulse: { value: 1.0 }
    },
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  group.add(glowMesh);

  // 5. 核心動態點光源
  const pointLight = new THREE.PointLight(0xff7722, 3.0, 28);
  group.add(pointLight);

  return {
    group,
    rockMesh,
    glowMesh,
    pointLight,
    material: rockMaterial,
    geometry,
    update: (time, progress = 0.5) => {
      rockMesh.rotation.x += 0.011;
      rockMesh.rotation.y += 0.016;
      rockMesh.rotation.z += 0.006;

      const pulse = Math.sin(time * 5.5) * 0.22 + 1.35;
      rockMaterial.uniforms.uTime.value = time;
      rockMaterial.uniforms.uHeat.value = pulse + progress * 0.65;
      glowMat.uniforms.uPulse.value = 0.92 + Math.sin(time * 7.0) * 0.15 + progress * 0.25;
      glowMesh.scale.setScalar(1.0 + Math.sin(time * 6.5) * 0.04);
    },
    dispose: () => {
      geometry.dispose();
      glowGeo.dispose();
      rockMaterial.dispose();
      glowMat.dispose();
    }
  };
}
