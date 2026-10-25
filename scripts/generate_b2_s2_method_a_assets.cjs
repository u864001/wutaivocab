const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TARGETS = [
  {
    word: 'cup',
    wordZh: '茶杯',
    x: 146,
    y: 595,
    rx: 58,
    ry: 48,
    typeZh: '茶具樣式',
    descZh: '茶屋木長凳托盤上是白瓷茶杯，右圖轉為綠釉抹茶陶杯'
  },
  {
    word: 'bed',
    wordZh: '榻榻米床鋪',
    x: 318,
    y: 230,
    rx: 115,
    ry: 52,
    typeZh: '被鋪花色',
    descZh: '二樓和室敞開紙門內是暖黃藺草蓆被鋪，右圖轉為青藍浪紋日式被鋪'
  },
  {
    word: 'umbrella',
    wordZh: '和傘',
    x: 468,
    y: 536,
    rx: 118,
    ry: 78,
    typeZh: '傘面圖案',
    descZh: '茶屋門口立著緋紅蛇目油紙傘，右圖轉為紫羅蘭碎花和傘'
  },
  {
    word: 'doll',
    wordZh: '木芥子人偶',
    x: 583,
    y: 422,
    rx: 48,
    ry: 72,
    typeZh: '人偶彩繪',
    descZh: '工藝陳列架上是紅色和服木芥子娃娃，右圖轉為藍條紋鳴子人偶'
  },
  {
    word: 'fish',
    wordZh: '錦鯉',
    x: 910,
    y: 694,
    rx: 72,
    ry: 38,
    typeZh: '錦鯉花紋',
    descZh: '庭園清澈石水盆中游動著紅金錦鯉，右圖轉為水墨黑白斑紋錦鯉'
  },
  {
    word: 'fan',
    wordZh: '摺扇',
    x: 1072,
    y: 432,
    rx: 88,
    ry: 48,
    typeZh: '扇面繪紋',
    descZh: '竹製陳列架上是櫻花金箔摺扇，右圖轉為富士山青藍摺扇'
  },
  {
    word: 'bird',
    wordZh: '小鳥',
    x: 1231,
    y: 141,
    rx: 78,
    ry: 68,
    typeZh: '羽色品種',
    descZh: '右上櫻花樹梢停著翠綠小雀鳥，右圖轉為雪白灰羽小鳥'
  },
  {
    word: 'box',
    wordZh: '點心盒',
    x: 1277,
    y: 531,
    rx: 78,
    ry: 58,
    typeZh: '禮盒包裝',
    descZh: '點心鋪桌上是黑漆描金點心盒，右圖轉為朱紅櫻花木質點心盒'
  }
];

async function generateAll() {
  console.log('=== Step 1: Ensure Target Directories Exist ===');
  const patchDir = 'public/assets/spotter/patches/b2_s2';
  const cropDir = 'public/assets/spotter/crops/b2_s2';
  fs.mkdirSync(patchDir, { recursive: true });
  fs.mkdirSync(cropDir, { recursive: true });

  const baseBuf = fs.readFileSync('public/assets/spotter/book2_scene2_base.jpg');
  const diffBuf = fs.readFileSync('public/assets/spotter/book2_scene2_diff.jpg');

  console.log('=== Step 2: Generate 8 Feathered PNG Transparent Patches (Method A) ===');
  for (const t of TARGETS) {
    const patchW = Math.round(t.rx * 2 + 30);
    const patchH = Math.round(t.ry * 2 + 30);
    const left = Math.max(0, Math.min(1376 - patchW, Math.round(t.x - patchW / 2)));
    const top = Math.max(0, Math.min(768 - patchH, Math.round(t.y - patchH / 2)));

    // Extract diff piece
    const diffPiece = await sharp(diffBuf)
      .extract({ left, top, width: patchW, height: patchH })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Generate feather alpha mask
    const maskBuf = Buffer.alloc(patchW * patchH);
    const cx = t.x - left;
    const cy = t.y - top;
    const innerRx = t.rx * 0.88;
    const innerRy = t.ry * 0.88;
    const outerRx = t.rx * 1.08;
    const outerRy = t.ry * 1.08;

    for (let py = 0; py < patchH; py++) {
      for (let px = 0; px < patchW; px++) {
        const dx = px - cx;
        const dy = py - cy;
        const dInner = (dx * dx) / (innerRx * innerRx) + (dy * dy) / (innerRy * innerRy);
        const dOuter = (dx * dx) / (outerRx * outerRx) + (dy * dy) / (outerRy * outerRy);

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

    // Combine diff RGB with mask into RGBA PNG
    const rgbaBuf = Buffer.alloc(patchW * patchH * 4);
    for (let p = 0; p < patchW * patchH; p++) {
      rgbaBuf[p * 4] = diffPiece.data[p * 3];
      rgbaBuf[p * 4 + 1] = diffPiece.data[p * 3 + 1];
      rgbaBuf[p * 4 + 2] = diffPiece.data[p * 3 + 2];
      rgbaBuf[p * 4 + 3] = maskBuf[p];
    }

    const patchPath = path.join(patchDir, `${t.word}_variantA.png`);
    await sharp(rgbaBuf, { raw: { width: patchW, height: patchH, channels: 4 } })
      .png({ compressionLevel: 8 })
      .toFile(patchPath);

    console.log(`  ✓ Generated patch: ${patchPath} (${patchW}x${patchH})`);
  }

  console.log('=== Step 3: Generate 8 Comparison Zoom Cards (650x276) ===');
  const cardW = 650, cardH = 276;
  const halfW = 320, innerH = 250;

  for (const t of TARGETS) {
    const cropW = Math.max(140, Math.min(halfW, Math.round(t.rx * 2.4)));
    const cropH = Math.max(120, Math.min(innerH, Math.round(t.ry * 2.4)));
    const left = Math.max(0, Math.min(1376 - cropW, Math.round(t.x - cropW / 2)));
    const top = Math.max(0, Math.min(768 - cropH, Math.round(t.y - cropH / 2)));

    const bCrop = await sharp(baseBuf)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(halfW, innerH, { fit: 'contain', background: { r: 15, g: 23, b: 42 } })
      .jpeg()
      .toBuffer();

    const dCrop = await sharp(diffBuf)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(halfW, innerH, { fit: 'contain', background: { r: 15, g: 23, b: 42 } })
      .jpeg()
      .toBuffer();

    const svgHeader = Buffer.from(
      `<svg width="${cardW}" height="${cardH}">
        <rect width="${cardW}" height="${cardH}" fill="#0f172a" rx="12" />
        <rect x="5" y="5" width="${halfW}" height="${innerH}" fill="none" stroke="#38bdf8" stroke-width="2" rx="8" />
        <rect x="${halfW + 10}" y="5" width="${halfW}" height="${innerH}" fill="none" stroke="#a855f7" stroke-width="2" rx="8" />
        <text x="20" y="270" fill="#38bdf8" font-size="14" font-weight="bold" font-family="sans-serif">BASE (基準左圖) • ${t.wordZh}</text>
        <text x="${halfW + 25}" y="270" fill="#c084fc" font-size="14" font-weight="bold" font-family="sans-serif">VAR A (變異右圖) • ${t.word.toUpperCase()}</text>
      </svg>`
    );

    const outCardPath = path.join(cropDir, `${t.word}_compare.jpg`);
    await sharp({
      create: { width: cardW, height: cardH, channels: 3, background: { r: 15, g: 23, b: 42 } }
    }).composite([
      { input: svgHeader, left: 0, top: 0 },
      { input: bCrop, left: 5, top: 5 },
      { input: dCrop, left: halfW + 10, top: 5 }
    ]).jpeg({ quality: 90 }).toFile(outCardPath);

    console.log(`  ✓ Generated card: ${outCardPath}`);
  }

  console.log('=== Step 4: Generate Full Side-by-Side Verification Image (2752x768) ===');
  let ellipsesSvg = '<svg width="2752" height="768">';
  for (const t of TARGETS) {
    ellipsesSvg += `
      <g>
        <ellipse cx="${t.x}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" fill="none" stroke="#22c55e" stroke-width="3" stroke-dasharray="6,4" />
        <text x="${t.x}" y="${Math.max(20, t.y - t.ry - 8)}" text-anchor="middle" fill="#22c55e" font-size="16" font-weight="bold" font-family="sans-serif">${t.word.toUpperCase()} (${t.wordZh})</text>
        <ellipse cx="${t.x + 1376}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6,4" />
        <text x="${t.x + 1376}" y="${Math.max(20, t.y - t.ry - 8)}" text-anchor="middle" fill="#f43f5e" font-size="16" font-weight="bold" font-family="sans-serif">${t.word.toUpperCase()} (${t.wordZh})</text>
      </g>
    `;
  }
  ellipsesSvg += '</svg>';

  const boxesOutPath = 'public/assets/spotter/book2_scene2_side_by_side_boxes.jpg';
  await sharp({
    create: { width: 2752, height: 768, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite([
    { input: baseBuf, left: 0, top: 0 },
    { input: diffBuf, left: 1376, top: 0 },
    { input: Buffer.from(ellipsesSvg), left: 0, top: 0 }
  ]).jpeg({ quality: 88 }).toFile(boxesOutPath);
  console.log(`  ✓ Saved full side-by-side with boxes: ${boxesOutPath}`);

  console.log('=== Step 5: Test Dynamic 8-choose-5 Composite Engine ===');
  // Randomly pick 5 items (e.g. cup, doll, fan, box, bird), leave bed, umbrella, fish as base!
  const chosen5 = ['cup', 'doll', 'fan', 'box', 'bird'];
  const testCompLayers = [];
  for (const word of chosen5) {
    const t = TARGETS.find(x => x.word === word);
    const patchPath = path.join(patchDir, `${word}_variantA.png`);
    const patchBuf = fs.readFileSync(patchPath);
    const patchMeta = await sharp(patchBuf).metadata();
    const left = Math.max(0, Math.min(1376 - patchMeta.width, Math.round(t.x - patchMeta.width / 2)));
    const top = Math.max(0, Math.min(768 - patchMeta.height, Math.round(t.y - patchMeta.height / 2)));
    testCompLayers.push({ input: patchBuf, left, top });
  }

  const dynamicDiffRight = await sharp(baseBuf).composite(testCompLayers).jpeg({ quality: 92 }).toBuffer();

  const previewPath = 'public/assets/spotter/crops/b2_s2/dynamic_test_preview.jpg';
  await sharp({
    create: { width: 2752, height: 768, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite([
    { input: baseBuf, left: 0, top: 0 },
    { input: dynamicDiffRight, left: 1376, top: 0 }
  ]).jpeg({ quality: 88 }).toFile(previewPath);
  console.log(`  ✓ Saved dynamic 8-choose-5 test preview: ${previewPath}`);

  console.log('\nAll Book 2 Scene 2 assets created with 100% success!');
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
