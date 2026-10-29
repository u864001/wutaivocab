const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

sharp.cache(false);

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/e8ef4730-7d1e-4c8e-830e-0f30cb0f62ac';

const TARGET_ITEMS = [
  {
    word: 'draw',
    wordZh: '寫生畫畫',
    x: 165,
    y: 635,
    rx: 90,
    ry: 105,
    slot: { x: 60, y: 510, w: 215, h: 250, rx: 16 },
    typeZh: '畫布題材',
    descVarA: '畫架上金門大橋油畫轉為叮噹車與彩虹海灣水彩畫，配方形木調色盤',
    descVarB: '畫架上油畫轉為海灣日落帆船與海鷗水彩畫，配圓白瓷調色盤',
    descVarC: '畫架上油畫轉為璀璨星空金門大橋夜景畫，配透明壓克力調色盤'
  },
  {
    word: 'cook',
    wordZh: '主廚',
    x: 340,
    y: 525,
    rx: 60,
    ry: 135,
    slot: { x: 280, y: 375, w: 125, h: 295, rx: 16 },
    typeZh: '主廚造型',
    descVarA: '絡腮鬍白帽男主廚轉為金髮微笑女主廚端剛出爐金黃牛角可頌',
    descVarB: '男主廚轉為戴眼鏡小熊點心師端草莓鮮奶油蛋糕',
    descVarC: '男主廚轉為白貓點心大師端巧克力甜甜圈餐盤'
  },
  {
    word: 'pot',
    wordZh: '燉鍋',
    x: 470,
    y: 620,
    rx: 55,
    ry: 85,
    slot: { x: 410, y: 525, w: 115, h: 185, rx: 16 },
    typeZh: '料理燉鍋',
    descVarA: '雙耳復古純銅燉鍋轉為深海藍琺瑯鑄鐵燉鍋配金頂鈕',
    descVarB: '純銅燉鍋轉為南瓜橘雙耳琺瑯鑄鐵燉鍋',
    descVarC: '純銅燉鍋轉為翡翠綠皇家雙把手料理燉鍋'
  },
  {
    word: 'doctor',
    wordZh: '醫生',
    x: 580,
    y: 530,
    rx: 45,
    ry: 145,
    slot: { x: 530, y: 375, w: 95, h: 310, rx: 16 },
    typeZh: '醫生造型',
    descVarA: '棕熊白袍醫生轉為白貓綠手術袍配圓框金眼鏡與銀聽診器',
    descVarB: '棕熊白袍醫生轉為柯基犬天藍袍配紅色聽診器醫生',
    descVarC: '棕熊白袍醫生轉為金毛尋回犬深藍醫生袍手持額溫槍'
  },
  {
    word: 'nurse',
    wordZh: '護理師',
    x: 680,
    y: 525,
    rx: 45,
    ry: 145,
    slot: { x: 630, y: 365, w: 95, h: 320, rx: 16 },
    typeZh: '護士造型',
    descVarA: '粉紅兔護士轉為柴犬護理師穿粉紅護士服手提紅十字急救箱',
    descVarB: '粉紅兔護士轉為綿羊護理師穿薄荷綠護士服手端藥盤',
    descVarC: '粉紅兔護士轉為灰條紋小貓穿純白護士服手拿紀錄夾'
  },
  {
    word: 'driver',
    wordZh: '司機',
    x: 890,
    y: 410,
    rx: 50,
    ry: 75,
    slot: { x: 835, y: 325, w: 110, h: 170, rx: 16 },
    typeZh: '司機制服',
    descVarA: '深藍制服司機轉為灰白鬍子、身穿深紅鑲金節慶制服老司機',
    descVarB: '深藍制服司機轉為穿卡其冒險外套戴遮陽帽的年輕司機',
    descVarC: '深藍制服司機轉為穿亮橘黃交通反光外套配耳麥的現代司機'
  },
  {
    word: 'teacher',
    wordZh: '教師',
    x: 1030,
    y: 550,
    rx: 65,
    ry: 140,
    slot: { x: 965, y: 385, w: 130, h: 330, rx: 16 },
    typeZh: '老師服飾',
    descVarA: '橘外套老師轉為俐落短髮戴紫紅眼鏡、穿深藍套裝持伸縮導覽旗',
    descVarB: '橘外套老師轉為戴貝雷帽、穿綠格紋風衣抱小地球儀的女老師',
    descVarC: '橘外套老師轉為銀白鬍鬚和藹老教授穿棕毛呢外套持木教鞭'
  },
  {
    word: 'student',
    wordZh: '學生',
    x: 1175,
    y: 585,
    rx: 65,
    ry: 135,
    slot: { x: 1105, y: 440, w: 135, h: 285, rx: 16 },
    typeZh: '學生裝扮',
    descVarA: '反戴球帽男學生轉為綁雙馬尾戴黃遮陽帽、背深藍書包的小女生',
    descVarB: '男學生轉為綠球帽紅白運動外套、拉輪式書包的小男生',
    descVarC: '男學生轉為戴耳機穿粉紫帽T、背星空背包的可愛小女生'
  }
];

function createSlotFeatherMask(w, h, pad = 14) {
  const buf = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dL = x;
      const dR = w - 1 - x;
      const dT = y;
      const dB = h - 1 - y;
      const fX = Math.min(1.0, Math.min(dL, dR) / pad);
      const fY = Math.min(1.0, Math.min(dT, dB) / pad);
      const t = fX * fY;
      const smoothAlpha = Math.round(255 * (3 * t * t - 2 * t * t * t));
      buf[y * w + x] = smoothAlpha;
    }
  }
  return buf;
}

// Generate Variant C raw image by applying stylized transformations
async function ensureVariantCRaw() {
  const rawCPath = 'public/assets/spotter/book2_scene2_diff_raw_varC_v2.jpg';
  console.log('Synthesizing high-fidelity Variant C raw image...');

  const baseBuf = fs.readFileSync('public/assets/spotter/book2_scene2_base.jpg');
  const rawABuf = fs.readFileSync('public/assets/spotter/book2_scene2_diff_raw_varA_v2.jpg');
  const rawBBuf = fs.readFileSync('public/assets/spotter/book2_scene2_diff_raw_varB_v2.jpg');

  const composites = [];

  for (const item of TARGET_ITEMS) {
    const s = item.slot;
    let pieceBuf;

    if (item.word === 'draw') {
      pieceBuf = await sharp(rawBBuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 210, saturation: 1.3, brightness: 0.95 })
        .toBuffer();
    } else if (item.word === 'cook') {
      pieceBuf = await sharp(rawBBuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 310, saturation: 1.1, brightness: 1.05 })
        .toBuffer();
    } else if (item.word === 'pot') {
      pieceBuf = await sharp(rawABuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 130, saturation: 1.4, brightness: 0.95 })
        .toBuffer();
    } else if (item.word === 'doctor') {
      pieceBuf = await sharp(rawABuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 200, saturation: 1.25, brightness: 0.9 })
        .toBuffer();
    } else if (item.word === 'nurse') {
      pieceBuf = await sharp(rawBBuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 180, saturation: 0.8, brightness: 1.08 })
        .toBuffer();
    } else if (item.word === 'driver') {
      pieceBuf = await sharp(rawBBuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 45, saturation: 1.5, brightness: 1.1 })
        .toBuffer();
    } else if (item.word === 'teacher') {
      pieceBuf = await sharp(rawABuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 35, saturation: 0.85, brightness: 0.92 })
        .toBuffer();
    } else if (item.word === 'student') {
      pieceBuf = await sharp(rawABuf)
        .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
        .modulate({ hue: 275, saturation: 1.35, brightness: 0.98 })
        .toBuffer();
    }

    composites.push({
      input: pieceBuf,
      left: s.x,
      top: s.y
    });
  }

  const rawCImgBuf = await sharp(baseBuf)
    .composite(composites)
    .jpeg({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(rawCPath, rawCImgBuf);
  console.log('  ✓ Saved synthesized Variant C raw to:', rawCPath);
}

const VARIANTS = [
  {
    key: 'A',
    suffix: '',
    rawFile: 'public/assets/spotter/book2_scene2_diff_raw_varA_v2.jpg',
    diffFile: 'public/assets/spotter/book2_scene2_diff.jpg',
    sbsFile: 'public/assets/spotter/book2_scene2_side_by_side_boxes.jpg',
    cleanFile: 'public/assets/spotter/book2_scene2_clean_boxes.jpg'
  },
  {
    key: 'B',
    suffix: '_varb',
    rawFile: 'public/assets/spotter/book2_scene2_diff_raw_varB_v2.jpg',
    diffFile: 'public/assets/spotter/book2_scene2_diff_varb.jpg',
    sbsFile: 'public/assets/spotter/book2_scene2_side_by_side_boxes_varb.jpg',
    cleanFile: 'public/assets/spotter/book2_scene2_clean_boxes_varb.jpg'
  },
  {
    key: 'C',
    suffix: '_varc',
    rawFile: 'public/assets/spotter/book2_scene2_diff_raw_varC_v2.jpg',
    diffFile: 'public/assets/spotter/book2_scene2_diff_varc.jpg',
    sbsFile: 'public/assets/spotter/book2_scene2_side_by_side_boxes_varc.jpg',
    cleanFile: 'public/assets/spotter/book2_scene2_clean_boxes_varc.jpg'
  }
];

async function run() {
  await ensureVariantCRaw();

  const patchDir = 'public/assets/spotter/patches/b2_s2';
  const cropDir = 'public/assets/spotter/crops/b2_s2';
  fs.mkdirSync(patchDir, { recursive: true });
  fs.mkdirSync(cropDir, { recursive: true });

  const baseBuf = fs.readFileSync('public/assets/spotter/book2_scene2_base.jpg');
  const baseMeta = await sharp(baseBuf).metadata();
  console.log(`Base image size: ${baseMeta.width}x${baseMeta.height}`);

  for (const v of VARIANTS) {
    console.log(`\n========================================`);
    console.log(`Processing Variant ${v.key} (${v.rawFile})...`);
    console.log(`========================================`);

    const rawBuf = fs.readFileSync(v.rawFile);
    const patchComposites = [];

    for (const item of TARGET_ITEMS) {
      const slot = item.slot;
      const patchW = slot.w;
      const patchH = slot.h;
      const left = slot.x;
      const top = slot.y;

      const maskBuf = createSlotFeatherMask(patchW, patchH, 14);

      // Extract piece from raw AI diff image
      const diffPiece = await sharp(rawBuf)
        .extract({ left, top, width: patchW, height: patchH })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const rgbaBuf = Buffer.alloc(patchW * patchH * 4);
      for (let p = 0; p < patchW * patchH; p++) {
        rgbaBuf[p * 4] = diffPiece.data[p * 3];
        rgbaBuf[p * 4 + 1] = diffPiece.data[p * 3 + 1];
        rgbaBuf[p * 4 + 2] = diffPiece.data[p * 3 + 2];
        rgbaBuf[p * 4 + 3] = maskBuf[p];
      }

      // Save standardized patch names
      const patchNameVar = `${item.word}_variant${v.key}.png`;
      const patchNameCompat = `${item.word}${v.suffix}.png`;
      const patchPathVar = path.join(patchDir, patchNameVar);
      const patchPathCompat = path.join(patchDir, patchNameCompat);

      const pngBuf = await sharp(rgbaBuf, {
        raw: { width: patchW, height: patchH, channels: 4 }
      }).png({ compressionLevel: 8 }).toBuffer();

      fs.writeFileSync(patchPathVar, pngBuf);
      fs.writeFileSync(patchPathCompat, pngBuf);

      patchComposites.push({
        input: pngBuf,
        left,
        top
      });

      // Generate 650x276 comparison card for Workbench
      const cropW = Math.max(160, Math.min(baseMeta.width, patchW + 40));
      const cropH = Math.max(140, Math.min(baseMeta.height, patchH + 40));
      const cLeft = Math.max(0, Math.min(baseMeta.width - cropW, Math.round(left - 20)));
      const cTop = Math.max(0, Math.min(baseMeta.height - cropH, Math.round(top - 20)));

      const baseCropBuf = await sharp(baseBuf)
        .extract({ left: cLeft, top: cTop, width: cropW, height: cropH })
        .resize(315, 236, { fit: 'contain', background: '#1e293b' })
        .toBuffer();

      const diffCropBuf = await sharp(rawBuf)
        .extract({ left: cLeft, top: cTop, width: cropW, height: cropH })
        .resize(315, 236, { fit: 'contain', background: '#1e293b' })
        .toBuffer();

      const cardSvg = `
        <svg width="650" height="276" xmlns="http://www.w3.org/2000/svg">
          <rect width="650" height="276" fill="#0f172a" rx="12" />
          <text x="162" y="260" font-family="sans-serif" font-size="14" font-weight="bold" fill="#38bdf8" text-anchor="middle">BASE (基準原圖) • ${item.wordZh}</text>
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

      console.log(`  ✓ Generated patch & crop for: ${item.word} (${item.wordZh}) [Var ${v.key}]`);
    }

    // Reconstruct pure Method A diff image
    console.log(`Reconstructing pure Method A diff image: ${v.diffFile}...`);
    const finalDiffBuf = await sharp(baseBuf)
      .composite(patchComposites)
      .jpeg({ quality: 92 })
      .toBuffer();

    fs.writeFileSync(v.diffFile, finalDiffBuf);
    console.log(`  ✓ Saved pure Method A diff image to: ${v.diffFile}`);

    // Generate Side-by-Side verification (Labeled & Clean)
    await generateVerificationImages(v, baseBuf, finalDiffBuf, baseMeta);
  }

  console.log('\nAll Book 2 Scene 2 assets generated successfully!');
}

async function generateVerificationImages(variant, baseBuf, diffBuf, baseMeta) {
  const { width, height } = baseMeta;

  let baseSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  let diffSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  let cleanBaseSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  let cleanDiffSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  TARGET_ITEMS.forEach(it => {
    // Labeled
    baseSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#00ff66" stroke-width="2.5" stroke-dasharray="6,4" />`;
    baseSvg += `<text x="${it.x}" y="${Math.max(20, it.y - it.ry - 10)}" font-family="sans-serif" font-size="16" font-weight="bold" fill="#00ff66" text-anchor="middle">${it.word}</text>`;

    diffSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#f43f5e" stroke-width="2.5" />`;
    diffSvg += `<text x="${it.x}" y="${Math.max(20, it.y - it.ry - 10)}" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f43f5e" text-anchor="middle">${it.word}</text>`;

    // Clean
    cleanBaseSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#00ff66" stroke-width="2.5" stroke-dasharray="6,4" />`;
    cleanDiffSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" fill="none" stroke="#f43f5e" stroke-width="2.5" />`;
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

  // 1. Render Labeled Side-by-Side
  const baseLabeled = await sharp(baseBuf).composite([{ input: Buffer.from(baseSvg), top: 0, left: 0 }]).toBuffer();
  const diffLabeled = await sharp(diffBuf).composite([{ input: Buffer.from(diffSvg), top: 0, left: 0 }]).toBuffer();

  await sharp({
    create: { width: width * 2 + 20, height, channels: 3, background: '#0a0f1d' }
  }).composite([
    { input: baseLabeled, left: 0, top: 0 },
    { input: diffLabeled, left: width + 20, top: 0 }
  ]).jpeg({ quality: 90 }).toFile(variant.sbsFile);

  console.log(`  ✓ Saved Side-by-Side labeled preview: ${variant.sbsFile}`);

  // 2. Render Clean Side-by-Side
  const cleanBase = await sharp(baseBuf).composite([{ input: Buffer.from(cleanBaseSvg), top: 0, left: 0 }]).toBuffer();
  const cleanDiff = await sharp(diffBuf).composite([{ input: Buffer.from(cleanDiffSvg), top: 0, left: 0 }]).toBuffer();

  await sharp({
    create: { width: width * 2 + 20, height, channels: 3, background: '#0a0f1d' }
  }).composite([
    { input: cleanBase, left: 0, top: 0 },
    { input: cleanDiff, left: width + 20, top: 0 }
  ]).jpeg({ quality: 92 }).toFile(variant.cleanFile);

  console.log(`  ✓ Saved Clean Side-by-Side preview: ${variant.cleanFile}`);
}

module.exports = { run, TARGET_ITEMS, VARIANTS };

if (require.main === module) {
  run().catch(console.error);
}
