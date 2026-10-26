const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';

const TARGET_ITEMS = [
  { word: 'metro', wordZh: '捷運列車', x: 423, y: 185, rx: 258, ry: 40, rotate: 4.8, typeZh: '列車型態', descZh: '左圖高架軌道為整列藍綠塗裝都會捷運，右圖依變異為深紅高鐵/耀眼黃單軌/翡翠綠磁浮' },
  { word: 'taxi', wordZh: '計程車', x: 650, y: 405, rx: 75, ry: 45, typeZh: '計程車塗裝', descZh: '左圖為亮黃色計程車，右圖依變異為海軍藍/英倫黑/珍珠白' },
  { word: 'car', wordZh: '汽車', x: 940, y: 435, rx: 88, ry: 80, typeZh: '汽車型態', descZh: '左圖為銀綠綠能休旅車，右圖依變異為亮紅跑車/水藍休旅/古銅跨界車' },
  { word: 'scooter', wordZh: '機車', x: 1205, y: 460, rx: 68, ry: 60, typeZh: '機車款式', descZh: '左圖為薄荷綠速克達，右圖依變異為火紅跑車機車/陽光黃/蔚藍復古車' },
  { word: 'bike', wordZh: '自行車', x: 560, y: 550, rx: 72, ry: 82, typeZh: '自行車款', descZh: '左圖為亮橘色共享單車，右圖依變異為青藍單車/青檸綠/艷紅公路車' },
  { word: 'ticket', wordZh: '車票', x: 350, y: 470, rx: 24, ry: 22, typeZh: '票卡型態', descZh: '左圖為彩虹磁條票卡，右圖依變異為黃金VIP卡/霓虹條碼/粉紅吉祥物卡' },
  { word: 'sandwich', wordZh: '三明治', x: 250, y: 655, rx: 46, ry: 30, typeZh: '三明治款式', descZh: '左圖為切片三明治，右圖依變異為法式可頌堡/芝麻貝果堡/總匯三明治' },
  { word: 'soda', wordZh: '蘇打汽水', x: 340, y: 585, rx: 32, ry: 78, typeZh: '飲料瓶型', descZh: '左圖為沁藍氣泡水瓶，右圖依變異為櫻桃紅蘇打/青檸氣泡罐/熱帶芒果蘇打' }
];

const VARIANTS = [
  { key: 'A', suffix: '', diffFile: 'public/assets/spotter/book7_scene2_diff.jpg' },
  { key: 'B', suffix: '_varb', diffFile: 'public/assets/spotter/book7_scene2_diff_varb.jpg' },
  { key: 'C', suffix: '_varc', diffFile: 'public/assets/spotter/book7_scene2_diff_varc.jpg' }
];

async function generateAssets() {
  const patchDir = 'public/assets/spotter/patches/b7_s2';
  const cropDir = 'public/assets/spotter/crops/b7_s2';
  fs.mkdirSync(patchDir, { recursive: true });
  fs.mkdirSync(cropDir, { recursive: true });

  const baseImg = sharp('public/assets/spotter/book7_scene2_base.jpg');
  const baseMeta = await baseImg.metadata();

  console.log(`Base image size: ${baseMeta.width}x${baseMeta.height}`);

  for (const v of VARIANTS) {
    if (!fs.existsSync(v.diffFile)) {
      console.warn(`File ${v.diffFile} does not exist yet. Skipping Variant ${v.key}`);
      continue;
    }

    console.log(`\nProcessing Variant ${v.key} (${v.diffFile})...`);

    for (const item of TARGET_ITEMS) {
      // 1. Generate feathered patch with exact rotated ellipse geometry
      const rot = item.rotate || 0;
      const rotRad = (rot * Math.PI) / 180;
      const cos = Math.cos(rotRad);
      const sin = Math.sin(rotRad);

      const halfW = Math.ceil(Math.sqrt((item.rx * cos) ** 2 + (item.ry * sin) ** 2)) + 15;
      const halfH = Math.ceil(Math.sqrt((item.rx * sin) ** 2 + (item.ry * cos) ** 2)) + 15;
      const patchW = halfW * 2;
      const patchH = halfH * 2;

      const left = Math.max(0, Math.min(baseMeta.width - patchW, Math.round(item.x - halfW)));
      const top = Math.max(0, Math.min(baseMeta.height - patchH, Math.round(item.y - halfH)));

      const diffPiece = await sharp(v.diffFile)
        .extract({ left, top, width: patchW, height: patchH })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const maskBuf = Buffer.alloc(patchW * patchH);
      const cx = item.x - left;
      const cy = item.y - top;
      const innerRx = item.rx * 0.90;
      const innerRy = item.ry * 0.90;
      const outerRx = item.rx * 1.05;
      const outerRy = item.ry * 1.05;

      for (let py = 0; py < patchH; py++) {
        for (let px = 0; px < patchW; px++) {
          const dx = px - cx;
          const dy = py - cy;
          const rxRot = dx * cos + dy * sin;
          const ryRot = -dx * sin + dy * cos;
          const dInner = (rxRot * rxRot) / (innerRx * innerRx) + (ryRot * ryRot) / (innerRy * innerRy);
          const dOuter = (rxRot * rxRot) / (outerRx * outerRx) + (ryRot * ryRot) / (outerRy * outerRy);

          let alpha = 0;
          if (dInner <= 1.0) {
            alpha = 255;
          } else if (dOuter >= 1.0) {
            alpha = 0;
          } else {
            const tFactor = (Math.sqrt(dOuter) - 1.0) / (Math.sqrt(outerRx / innerRx) - 1.0);
            alpha = Math.round(255 * (1 - Math.max(0, Math.min(1, tFactor))));
          }
          maskBuf[py * patchW + px] = alpha;
        }
      }

      const rgbaBuf = Buffer.alloc(patchW * patchH * 4);
      for (let p = 0; p < patchW * patchH; p++) {
        rgbaBuf[p * 4] = diffPiece.data[p * 3];
        rgbaBuf[p * 4 + 1] = diffPiece.data[p * 3 + 1];
        rgbaBuf[p * 4 + 2] = diffPiece.data[p * 3 + 2];
        rgbaBuf[p * 4 + 3] = maskBuf[p];
      }

      const patchName = `${item.word}_variant${v.key}.png`;
      const patchPath = path.join(patchDir, patchName);

      await sharp(rgbaBuf, { raw: { width: patchW, height: patchH, channels: 4 } })
        .png({ compressionLevel: 8 })
        .toFile(patchPath);

      // 2. Generate 650x276 comparison card
      const cropW = Math.max(160, Math.min(baseMeta.width, Math.round(halfW * 2 + 40)));
      const cropH = Math.max(140, Math.min(baseMeta.height, Math.round(halfH * 2 + 40)));
      const cLeft = Math.max(0, Math.min(baseMeta.width - cropW, Math.round(item.x - cropW / 2)));
      const cTop = Math.max(0, Math.min(baseMeta.height - cropH, Math.round(item.y - cropH / 2)));

      const baseCropBuf = await sharp('public/assets/spotter/book7_scene2_base.jpg')
        .extract({ left: cLeft, top: cTop, width: cropW, height: cropH })
        .resize(315, 236, { fit: 'contain', background: '#1e293b' })
        .toBuffer();

      const diffCropBuf = await sharp(v.diffFile)
        .extract({ left: cLeft, top: cTop, width: cropW, height: cropH })
        .resize(315, 236, { fit: 'contain', background: '#1e293b' })
        .toBuffer();

      const cardSvg = `
        <svg width="650" height="276" xmlns="http://www.w3.org/2000/svg">
          <rect width="650" height="276" fill="#0f172a" rx="12" />
          <text x="162" y="260" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">BASE (基準圖素) • ${item.wordZh}</text>
          <text x="487" y="260" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f43f5e" text-anchor="middle">VAR ${v.key} (${item.word.toUpperCase()})</text>
        </svg>
      `;

      const cardName = v.key === 'A' ? `${item.word}_compare.jpg` : `${item.word}_compare_var_${v.key.toLowerCase()}.jpg`;
      const cardPath = path.join(cropDir, cardName);

      await sharp(Buffer.from(cardSvg))
        .composite([
          { input: baseCropBuf, top: 12, left: 10 },
          { input: diffCropBuf, top: 12, left: 325 }
        ])
        .jpeg({ quality: 92 })
        .toFile(cardPath);

      if (fs.existsSync(ARTIFACT_DIR)) {
        fs.copyFileSync(cardPath, path.join(ARTIFACT_DIR, cardName));
      }

      console.log(`  ✓ Generated patch & crop for ${item.word} (Var ${v.key})`);
    }

    // 3. Generate side-by-side verification images (Both labeled and clean!)
    await generateSideBySide(v);
  }

  console.log('\nAll assets generated successfully!');
}

async function generateSideBySide(variant) {
  const baseImg = sharp('public/assets/spotter/book7_scene2_base.jpg');
  const baseMeta = await baseImg.metadata();
  const width = baseMeta.width;
  const height = baseMeta.height;

  // Labeled SVGs
  let baseSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  let diffSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Clean SVGs (boxes only, NO text labels)
  let cleanBaseSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  let cleanDiffSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  TARGET_ITEMS.forEach(it => {
    const rotAttr = it.rotate ? ` transform="rotate(${it.rotate} ${it.x} ${it.y})"` : '';
    
    // Labeled
    baseSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}"${rotAttr} fill="none" stroke="#00ff66" stroke-width="2.5" stroke-dasharray="6,4" />`;
    baseSvg += `<text x="${it.x}" y="${Math.max(20, it.y - it.ry - 10)}" font-family="sans-serif" font-size="16" font-weight="bold" fill="#00ff66" text-anchor="middle">${it.word}</text>`;

    diffSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}"${rotAttr} fill="none" stroke="#f43f5e" stroke-width="2.5" />`;
    diffSvg += `<text x="${it.x}" y="${Math.max(20, it.y - it.ry - 10)}" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f43f5e" text-anchor="middle">${it.word}</text>`;

    // Clean
    cleanBaseSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}"${rotAttr} fill="none" stroke="#00ff66" stroke-width="2.5" stroke-dasharray="6,4" />`;
    cleanDiffSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}"${rotAttr} fill="none" stroke="#f43f5e" stroke-width="2.5" />`;
  });

  baseSvg += `
    <rect x="20" y="20" width="220" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="130" y="46" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">BASE SCENE</text>
  </svg>`;

  diffSvg += `
    <rect x="20" y="20" width="220" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="130" y="46" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f43f5e" text-anchor="middle">VARIANT ${variant.key}</text>
  </svg>`;

  cleanBaseSvg += `
    <rect x="20" y="20" width="240" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="140" y="46" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">BASE (NO LABELS)</text>
  </svg>`;

  cleanDiffSvg += `
    <rect x="20" y="20" width="260" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="150" y="46" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f43f5e" text-anchor="middle">VARIANT ${variant.key} (NO LABELS)</text>
  </svg>`;

  // Render Labeled
  const baseLabeled = await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .composite([{ input: Buffer.from(baseSvg), top: 0, left: 0 }])
    .toBuffer();
  const diffLabeled = await sharp(variant.diffFile)
    .composite([{ input: Buffer.from(diffSvg), top: 0, left: 0 }])
    .toBuffer();

  const fileName = variant.key === 'A' ? 'book7_scene2_side_by_side_boxes.jpg' : `book7_scene2_side_by_side_boxes_var${variant.key.toLowerCase()}.jpg`;
  const outPublic = path.join('public/assets/spotter', fileName);
  const outArtifact = path.join(ARTIFACT_DIR, fileName);

  await sharp({
    create: { width: width * 2 + 20, height: height, channels: 3, background: '#0a0f1d' }
  }).composite([
    { input: baseLabeled, left: 0, top: 0 },
    { input: diffLabeled, left: width + 20, top: 0 }
  ]).jpeg({ quality: 90 }).toFile(outPublic);

  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(outPublic, outArtifact);
  }

  // Render Clean (No labels)
  const cleanBaseBuf = await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .composite([{ input: Buffer.from(cleanBaseSvg), top: 0, left: 0 }])
    .toBuffer();
  const cleanDiffBuf = await sharp(variant.diffFile)
    .composite([{ input: Buffer.from(cleanDiffSvg), top: 0, left: 0 }])
    .toBuffer();

  const cleanFileName = variant.key === 'A' ? 'book7_scene2_clean_boxes.jpg' : `book7_scene2_clean_boxes_var${variant.key.toLowerCase()}.jpg`;
  const cleanOutPublic = path.join('public/assets/spotter', cleanFileName);
  const cleanOutArtifact = path.join(ARTIFACT_DIR, cleanFileName);

  await sharp({
    create: { width: width * 2 + 20, height: height, channels: 3, background: '#0a0f1d' }
  }).composite([
    { input: cleanBaseBuf, left: 0, top: 0 },
    { input: cleanDiffBuf, left: width + 20, top: 0 }
  ]).jpeg({ quality: 92 }).toFile(cleanOutPublic);

  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(cleanOutPublic, cleanOutArtifact);
  }

  console.log(`  ✓ Side-by-side labeled & clean images generated for Var ${variant.key}`);
}

generateAssets().catch(console.error);
