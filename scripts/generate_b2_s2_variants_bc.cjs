const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 8 個目標幾何規格 (與 spotterData.js 嚴格一致)
const TARGETS = [
  {
    word: 'cup',
    wordZh: '茶杯',
    x: 146,
    y: 595,
    rx: 58,
    ry: 48,
    hasVarC: true,
    descVarB: '茶屋木長凳托盤上轉為朱紅漆器茶托杯',
    descVarC: '茶屋木長凳托盤上轉為紫砂陶茶杯'
  },
  {
    word: 'bed',
    wordZh: '榻榻米床鋪',
    x: 318,
    y: 230,
    rx: 115,
    ry: 52,
    hasVarC: false, // 依 Mark 指示：和室空間換至粉色櫻花被鋪已最自然，不勉強出第 4 種
    descVarB: '二樓和室敞開紙門內轉為櫻粉櫻花棉褥和室被鋪',
    descVarC: null
  },
  {
    word: 'umbrella',
    wordZh: '和傘',
    x: 468,
    y: 536,
    rx: 118,
    ry: 78,
    hasVarC: true,
    descVarB: '茶屋門口立著陽光金黃節慶和傘',
    descVarC: '茶屋門口立著青竹翠綠和傘'
  },
  {
    word: 'doll',
    wordZh: '人偶',
    x: 583,
    y: 422,
    rx: 48,
    ry: 72,
    hasVarC: true,
    descVarB: '工藝陳列架上轉為招財貓木雕人偶',
    descVarC: '工藝陳列架上轉為金黃達摩吉祥木偶'
  },
  {
    word: 'fish',
    wordZh: '錦鯉',
    x: 910,
    y: 694,
    rx: 72,
    ry: 38,
    hasVarC: true,
    descVarB: '庭園清澈石水盆中游動著金黃招財黃金錦鯉',
    descVarC: '庭園清澈石水盆中轉為碧藍錦鯉與翠綠荷葉'
  },
  {
    word: 'fan',
    wordZh: '摺扇',
    x: 1072,
    y: 432,
    rx: 88,
    ry: 48,
    hasVarC: true,
    descVarB: '竹製陳列架上轉為秋季金黃銀杏圓團扇',
    descVarC: '竹製陳列架上轉為素雅紫藤水墨摺扇'
  },
  {
    word: 'bird',
    wordZh: '小鳥',
    x: 1231,
    y: 141,
    rx: 78,
    ry: 68,
    hasVarC: true,
    descVarB: '右上櫻花樹梢停著暖橘紅喉知更鳥',
    descVarC: '右上櫻花樹梢停著靛藍琉璃鳥'
  },
  {
    word: 'box',
    wordZh: '點心盒',
    x: 1277,
    y: 531,
    rx: 78,
    ry: 58,
    hasVarC: true,
    descVarB: '點心鋪桌上轉為朱紅櫻花禮品盒',
    descVarC: '點心鋪桌上轉為雙層竹編精緻點心籠'
  }
];

// 羽化遮罩生成 (SVG 橢圓徑向漸層，外圍 20px 羽化為透明)
function createFeatherMaskSvg(w, h, rx, ry) {
  const cx = w / 2;
  const cy = h / 2;
  const rMin = Math.min(rx, ry);
  const stop1 = Math.max(0.65, ((rMin - 20) / rMin)).toFixed(3);
  return `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="feather" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="1" />
          <stop offset="${stop1}" stop-color="#fff" stop-opacity="1" />
          <stop offset="95%" stop-color="#fff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#feather)" />
    </svg>
  `;
}

async function extractVariants(variantKey, diffImagePath) {
  console.log(`\n=== Processing Variant ${variantKey.toUpperCase()} from ${diffImagePath} ===`);
  if (!fs.existsSync(diffImagePath)) {
    console.error(`Diff image not found: ${diffImagePath}`);
    return;
  }

  const patchDir = 'public/assets/spotter/patches/b2_s2';
  const cropDir = 'public/assets/spotter/crops/b2_s2';
  fs.mkdirSync(patchDir, { recursive: true });
  fs.mkdirSync(cropDir, { recursive: true });

  const baseBuf = fs.readFileSync('public/assets/spotter/book2_scene2_base.jpg');
  const diffBuf = fs.readFileSync(diffImagePath);

  for (const t of TARGETS) {
    if (variantKey === 'c' && !t.hasVarC) {
      console.log(`  - Skipping ${t.word} for VarC (intentionally natural)`);
      continue;
    }

    const patchW = Math.round(t.rx * 2 + 30);
    const patchH = Math.round(t.ry * 2 + 30);
    const left = Math.max(0, Math.min(1376 - patchW, Math.round(t.x - patchW / 2)));
    const top = Math.max(0, Math.min(768 - patchH, Math.round(t.y - patchH / 2)));

    // 1. 擷取局部圖像並轉為 RGBA raw 像素
    const patchCrop = await sharp(diffBuf)
      .extract({ left, top, width: patchW, height: patchH })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 2. 生成對應尺寸之羽化遮罩
    const maskSvg = Buffer.from(createFeatherMaskSvg(patchW, patchH, patchW / 2, patchH / 2));
    const maskRaw = await sharp(maskSvg)
      .resize(patchW, patchH)
      .toColourspace('b-w')
      .raw()
      .toBuffer();

    // 3. 套用羽化透明度至 Alpha 通道
    const pixels = patchCrop.data;
    for (let i = 0; i < maskRaw.length; i++) {
      const alphaVal = maskRaw[i];
      pixels[i * 4 + 3] = Math.round((pixels[i * 4 + 3] * alphaVal) / 255);
    }

    // 4. 存檔羽化 PNG 補丁
    const patchFileName = `${t.word}_variant${variantKey.toUpperCase()}.png`;
    const patchOutPath = path.join(patchDir, patchFileName);
    await sharp(pixels, {
      raw: { width: patchW, height: patchH, channels: 4 }
    }).png().toFile(patchOutPath);
    console.log(`  ✓ Generated patch: ${patchFileName} (${patchW}x${patchH})`);

    // 5. 製作高解析局部比對卡片 (Base vs Variant)
    const cardHalfW = 320;
    const cardH = 276;
    const cropLeft = Math.max(0, Math.min(1376 - cardHalfW, Math.round(t.x - cardHalfW / 2)));
    const cropTop = Math.max(0, Math.min(768 - cardH, Math.round(t.y - cardH / 2)));

    const baseCrop = await sharp(baseBuf)
      .extract({ left: cropLeft, top: cropTop, width: cardHalfW, height: cardH })
      .toBuffer();

    const diffCrop = await sharp(diffBuf)
      .extract({ left: cropLeft, top: cropTop, width: cardHalfW, height: cardH })
      .toBuffer();

    const labelSvg = `
      <svg width="650" height="276" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="320" height="276" fill="none" stroke="#38bdf8" stroke-width="4" />
        <rect x="330" y="0" width="320" height="276" fill="none" stroke="#a855f7" stroke-width="4" />
        <rect x="10" y="10" width="130" height="30" rx="8" fill="rgba(15,23,42,0.85)" />
        <text x="75" y="30" fill="#38bdf8" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle">左圖 BASE (型態A)</text>
        <rect x="340" y="10" width="140" height="30" rx="8" fill="rgba(15,23,42,0.85)" />
        <text x="410" y="30" fill="#c084fc" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle">右圖 VAR ${variantKey.toUpperCase()}</text>
      </svg>
    `;

    const compareCardPath = path.join(cropDir, `${t.word}_compare_var${variantKey.toUpperCase()}.jpg`);
    await sharp({
      create: {
        width: 650,
        height: 276,
        channels: 3,
        background: { r: 15, g: 23, b: 42 }
      }
    })
      .composite([
        { input: baseCrop, left: 0, top: 0 },
        { input: diffCrop, left: 330, top: 0 },
        { input: Buffer.from(labelSvg), left: 0, top: 0 }
      ])
      .jpeg({ quality: 90 })
      .toFile(compareCardPath);
    console.log(`  ✓ Generated compare card: ${t.word}_compare_var${variantKey.toUpperCase()}.jpg`);
  }

  // Generate full side-by-side with bounding boxes
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

  const boxesOutPath = `public/assets/spotter/book2_scene2_side_by_side_boxes_var${variantKey.toLowerCase()}.jpg`;
  await sharp({
    create: { width: 2752, height: 768, channels: 3, background: { r: 0, g: 0, b: 0 } }
  }).composite([
    { input: baseBuf, left: 0, top: 0 },
    { input: diffBuf, left: 1376, top: 0 },
    { input: Buffer.from(ellipsesSvg), left: 0, top: 0 }
  ]).jpeg({ quality: 88 }).toFile(boxesOutPath);
  console.log(`  ✓ Saved full side-by-side with boxes: ${boxesOutPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const variant = args[0] || 'b';
  const imgPath = args[1] || `public/assets/spotter/book2_scene2_diff_var${variant}.jpg`;
  await extractVariants(variant, imgPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
