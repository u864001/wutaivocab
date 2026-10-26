const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_ITEMS = [
  { word: 'metro', wordZh: '捷運列車', x: 302, y: 158, rx: 140, ry: 42, typeZh: '列車型態', descZh: '左圖為藍綠塗裝都會捷運，右圖依變異為高鐵紅/耀眼黃/翡翠綠' },
  { word: 'taxi', wordZh: '計程車', x: 650, y: 405, rx: 75, ry: 45, typeZh: '計程車塗裝', descZh: '左圖為亮黃色計程車，右圖依變異為海軍藍/英倫黑/珍珠白' },
  { word: 'car', wordZh: '汽車', x: 940, y: 455, rx: 75, ry: 48, typeZh: '汽車型態', descZh: '左圖為銀綠綠能休旅車，右圖依變異為亮紅跑車/水藍休旅/古銅跨界車' },
  { word: 'scooter', wordZh: '機車', x: 1205, y: 460, rx: 68, ry: 60, typeZh: '機車款式', descZh: '左圖為薄荷綠速克達，右圖依變異為火紅跑車機車/陽光黃/蔚藍復古車' },
  { word: 'bike', wordZh: '自行車', x: 560, y: 570, rx: 58, ry: 58, typeZh: '自行車款', descZh: '左圖為亮橘色共享單車，右圖依變異為青藍單車/青檸綠/艷紅公路車' },
  { word: 'ticket', wordZh: '車票', x: 350, y: 470, rx: 24, ry: 22, typeZh: '票卡型態', descZh: '左圖為彩虹磁條票卡，右圖依變異為黃金VIP卡/霓虹條碼/粉紅吉祥物卡' },
  { word: 'sandwich', wordZh: '三明治', x: 250, y: 655, rx: 48, ry: 32, typeZh: '三明治款式', descZh: '左圖為切片三明治，右圖依變異為法式可頌堡/芝麻貝果堡/總匯三明治' },
  { word: 'soda', wordZh: '蘇打汽水', x: 338, y: 590, rx: 20, ry: 50, typeZh: '飲料瓶型', descZh: '左圖為沁藍氣泡水瓶，右圖依變異為櫻桃紅蘇打/青檸氣泡罐/熱帶芒果蘇打' }
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
    const diffImg = sharp(v.diffFile);

    for (const item of TARGET_ITEMS) {
      // 1. Generate feathered patch
      const pad = 12;
      const x0 = Math.max(0, Math.floor(item.x - item.rx - pad));
      const y0 = Math.max(0, Math.floor(item.y - item.ry - pad));
      const x1 = Math.min(baseMeta.width, Math.ceil(item.x + item.rx + pad));
      const y1 = Math.min(baseMeta.height, Math.ceil(item.y + item.ry + pad));
      const w = x1 - x0;
      const h = y1 - y0;

      // Create SVG radial gradient feather mask
      const cx = item.x - x0;
      const cy = item.y - y0;
      const maskSvg = `
        <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="feather" cx="${cx}" cy="${cy}" r="${item.rx + pad}" fx="${cx}" fy="${cy}" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#fff" stop-opacity="1" />
              <stop offset="75%" stop-color="#fff" stop-opacity="1" />
              <stop offset="90%" stop-color="#fff" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#fff" stop-opacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="${cx}" cy="${cy}" rx="${item.rx + pad}" ry="${item.ry + pad}" fill="url(#feather)" />
        </svg>
      `;

      const patchName = `${item.word}_variant${v.key}.png`;
      const patchPath = path.join(patchDir, patchName);

      const diffCrop = await sharp(v.diffFile)
        .extract({ left: x0, top: y0, width: w, height: h })
        .ensureAlpha()
        .toBuffer();

      const maskBuffer = await sharp(Buffer.from(maskSvg))
        .resize(w, h)
        .toColourspace('b-w')
        .toBuffer();

      await sharp(diffCrop)
        .composite([{ input: maskBuffer, blend: 'dest-in' }])
        .png()
        .toFile(patchPath);

      // 2. Generate 650x276 comparison card
      const cropW = Math.max(160, Math.round(item.rx * 2 + 60));
      const cropH = Math.max(140, Math.round(item.ry * 2 + 50));
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
          <text x="162" y="260" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">BASE (基準圖素)</text>
          <text x="487" y="260" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f43f5e" text-anchor="middle">VARIANT ${v.key} (${item.word})</text>
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

      console.log(`  ✓ Generated patch & crop for ${item.word} (Var ${v.key})`);
    }

    // 3. Generate side-by-side verification image
    await generateSideBySide(v);
  }

  console.log('\nAll assets generated successfully!');
}

async function generateSideBySide(variant) {
  const baseImg = sharp('public/assets/spotter/book7_scene2_base.jpg');
  const baseMeta = await baseImg.metadata();
  const width = baseMeta.width;
  const height = baseMeta.height;

  let baseSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  let diffSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  TARGET_ITEMS.forEach(it => {
    baseSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#00ff66" stroke-width="3" stroke-dasharray="6,4" />`;
    baseSvg += `<text x="${it.x}" y="${it.y - it.ry - 8}" font-family="sans-serif" font-size="18" font-weight="bold" fill="#00ff66" text-anchor="middle">${it.word}</text>`;

    diffSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#f43f5e" stroke-width="3" />`;
    diffSvg += `<text x="${it.x}" y="${it.y - it.ry - 8}" font-family="sans-serif" font-size="18" font-weight="bold" fill="#f43f5e" text-anchor="middle">${it.word}</text>`;
  });

  baseSvg += `
    <rect x="20" y="20" width="220" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="130" y="46" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">BASE SCENE</text>
  </svg>`;

  diffSvg += `
    <rect x="20" y="20" width="220" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="130" y="46" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f43f5e" text-anchor="middle">VARIANT ${variant.key}</text>
  </svg>`;

  const baseLabeled = await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .composite([{ input: Buffer.from(baseSvg), top: 0, left: 0 }])
    .toBuffer();

  const diffLabeled = await sharp(variant.diffFile)
    .composite([{ input: Buffer.from(diffSvg), top: 0, left: 0 }])
    .toBuffer();

  const fileName = variant.key === 'A' ? 'book7_scene2_side_by_side_boxes.jpg' : `book7_scene2_side_by_side_boxes_var${variant.key.toLowerCase()}.jpg`;
  const outPublic = path.join('public/assets/spotter', fileName);
  const outArtifact = path.join('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3', fileName);

  await sharp({
    create: {
      width: width * 2 + 20,
      height: height,
      channels: 3,
      background: '#0a0f1d'
    }
  })
    .composite([
      { input: baseLabeled, left: 0, top: 0 },
      { input: diffLabeled, left: width + 20, top: 0 }
    ])
    .jpeg({ quality: 90 })
    .toFile(outPublic);

  fs.copyFileSync(outPublic, outArtifact);
  console.log(`  ✓ Side-by-side labeled image generated: ${outPublic}`);
}

generateAssets().catch(console.error);
