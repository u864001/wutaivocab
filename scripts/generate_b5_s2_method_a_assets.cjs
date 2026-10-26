const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 8 TARGET VOCABULARY DEFINITIONS (Paris Montmartre Place du Tertre) - EXACT PINPOINT
const TARGETS = [
  {
    word: 'bread',
    wordZh: '法式麵包',
    x: 65,
    y: 615,
    rx: 55,
    ry: 120,
    typeZh: '麵包品項',
    descVarA: '烘焙坊前藤籃中的金黃法式長棍轉為滿籃香脆牛角可頌與巧克力麵包',
    descVarB: '烘焙坊前長棍麵包轉為剛出爐的圓形鄉村天然酵母麵包 (Boules)',
    descVarC: '烘焙坊前長棍麵包轉為帶有金黃蛋液光澤的法式編織布里歐麵包 (Brioche)'
  },
  {
    word: 'guitar',
    wordZh: '木吉他',
    x: 445,
    y: 530,
    rx: 40,
    ry: 90,
    typeZh: '吉他琴款',
    descVarA: '倚靠在復古街燈旁的雲杉民謠木吉他轉為日落漸層色雙 f 孔爵士吉他',
    descVarB: '街燈旁民謠吉他轉為櫻桃紅西班牙佛朗明哥古典吉他',
    descVarC: '街燈旁民謠吉他轉為收納於天鵝絨琴盒中的日落色半空心電吉他'
  },
  {
    word: 'brush',
    wordZh: '畫筆',
    x: 560,
    y: 620,
    rx: 65,
    ry: 42,
    typeZh: '畫筆樣式',
    descVarA: '木凳調色盤上的古典木質油畫筆轉為現代透明水彩畫筆組',
    descVarB: '木凳上的畫筆轉為陶瓷花瓣調色盤上的細緻水彩毛筆',
    descVarC: '木凳上的畫筆轉為開啟的古典黃銅手提箱內各色長桿油畫筆'
  },
  {
    word: 'painting',
    wordZh: '畫作',
    x: 765,
    y: 415,
    rx: 78,
    ry: 115,
    typeZh: '畫布題材',
    descVarA: '畫架上的藍天聖心堂油畫轉為點亮街燈與星空的巴黎夜景艾菲爾鐵塔',
    descVarB: '畫架上的聖心堂風景油畫轉為立體派鮮黃向日葵花瓶靜物畫',
    descVarC: '畫架上的油畫轉為戴著紅色畫家貝雷帽的俏皮黑貓水彩插畫'
  },
  {
    word: 'cake',
    wordZh: '法式蛋糕',
    x: 755,
    y: 625,
    rx: 60,
    ry: 45,
    typeZh: '法式甜點',
    descVarA: '大理石咖啡桌上的草莓水果千層塔轉為頂級黑巧克力歐培拉 (Opera) 蛋糕',
    descVarB: '咖啡桌上的草莓蛋糕轉為多層彩色法式馬卡龍塔 (Macarons)',
    descVarC: '咖啡桌上的蛋糕轉為鋪滿新鮮藍莓的重乳酪起司蛋糕切片'
  },
  {
    word: 'flag',
    wordZh: '旗幟',
    x: 995,
    y: 60,
    rx: 55,
    ry: 35,
    typeZh: '屋頂旗幟',
    descVarA: '屋頂旗桿飄揚的法國藍白紅三色旗轉為歐盟十二金星深藍底旗',
    descVarB: '屋頂法國三色旗轉為巴黎市徽紅藍雙色風帆船旗幟',
    descVarC: '屋頂三色旗轉為海軍藍飾金邊的藝術節燕尾三角錦旗'
  },
  {
    word: 'bell',
    wordZh: '歷史銅鐘',
    x: 1125,
    y: 290,
    rx: 55,
    ry: 85,
    typeZh: '拱門鐘款',
    descVarA: '建築外牆拱門吊掛的古樸青銅鐘轉為拋光亮金黃銅鐘綴飾紅流蘇',
    descVarB: '外牆拱門青銅鐘旁增設成對的雙聯排音雙銅鐘',
    descVarC: '外牆青銅鐘轉為帶有浮雕十字紋章的中世紀重型鐵質教堂鐘'
  },
  {
    word: 'camera',
    wordZh: '相機',
    x: 1120,
    y: 695,
    rx: 60,
    ry: 50,
    typeZh: '相機機型',
    descVarA: '編織藤椅上的黑銀復古旁軸相機轉為亮紅色拍立得相機吐出小相片',
    descVarB: '藤椅上的旁軸相機轉為復古雙鏡頭反光 (TLR) 相機',
    descVarC: '藤椅上的旁軸相機轉為金象牙配色奢華相機佐銀色鏡頭蓋'
  }
];

function createFeatheredEllipseMask(w, h, cx, cy, rx, ry, feather = 14) {
  const buf = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const d = Math.sqrt(dx * dx + dy * dy);
      let alpha = 0;
      if (d <= 1.0) {
        alpha = 255;
      } else if (d <= 1.0 + feather / Math.min(rx, ry)) {
        const t = (d - 1.0) / (feather / Math.min(rx, ry));
        alpha = Math.round(255 * (1 - (3 * t * t - 2 * t * t * t)));
      }
      buf[y * w + x] = alpha;
    }
  }
  return buf;
}

async function main() {
  const baseImgPath = 'public/assets/spotter/book5_scene2_base.jpg';
  const diffImgPathA = 'public/assets/spotter/book5_scene2_diff.jpg';
  const diffImgPathB = 'public/assets/spotter/book5_scene2_diff_varb.jpg';
  const diffImgPathC = 'public/assets/spotter/book5_scene2_diff_varc.jpg';

  const outCropsDir = 'public/assets/spotter/crops/b5_s2';
  const brainDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';

  if (!fs.existsSync(outCropsDir)) fs.mkdirSync(outCropsDir, { recursive: true });

  const baseBuf = await sharp(baseImgPath).raw().toBuffer({ resolveWithObject: true });
  const diffBufA = await sharp(diffImgPathA).raw().toBuffer({ resolveWithObject: true });
  const diffBufB = await sharp(diffImgPathB).raw().toBuffer({ resolveWithObject: true });
  const diffBufC = await sharp(diffImgPathC).raw().toBuffer({ resolveWithObject: true });

  const { width, height } = baseBuf.info;

  console.log(`Canvas size: ${width}x${height}`);

  const variants = [
    { key: 'var_a', label: '變異型態 A', rawBuf: diffBufA },
    { key: 'var_b', label: '變異型態 B', rawBuf: diffBufB },
    { key: 'var_c', label: '變異型態 C', rawBuf: diffBufC }
  ];

  // 1. Generate 24 Feathered PNG Patches & 24 Comparison Cards
  console.log('\n--- Generating 24 Patches & 24 Comparison Cards ---');
  for (const t of TARGETS) {
    const padX = Math.round(t.rx * 0.4) + 16;
    const padY = Math.round(t.ry * 0.4) + 16;
    const cropLeft = Math.max(0, t.x - t.rx - padX);
    const cropTop = Math.max(0, t.y - t.ry - padY);
    const cropRight = Math.min(width, t.x + t.rx + padX);
    const cropBottom = Math.min(height, t.y + t.ry + padY);
    const cropW = cropRight - cropLeft;
    const cropH = cropBottom - cropTop;
    const localCx = t.x - cropLeft;
    const localCy = t.y - cropTop;

    const baseCropBuf = await sharp(baseImgPath)
      .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
      .toBuffer();

    for (const v of variants) {
      const diffCropRaw = await sharp(v.rawBuf.data, {
        raw: { width, height, channels: 3 }
      })
      .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
      .raw()
      .toBuffer();

      const alphaMask = createFeatheredEllipseMask(cropW, cropH, localCx, localCy, t.rx, t.ry, 14);

      const rgbaBuf = Buffer.alloc(cropW * cropH * 4);
      for (let i = 0; i < cropW * cropH; i++) {
        rgbaBuf[i * 4] = diffCropRaw[i * 3];
        rgbaBuf[i * 4 + 1] = diffCropRaw[i * 3 + 1];
        rgbaBuf[i * 4 + 2] = diffCropRaw[i * 3 + 2];
        rgbaBuf[i * 4 + 3] = alphaMask[i];
      }

      const patchFileName = `patch_${t.word}_${v.key}.png`;
      const patchPath = path.join(outCropsDir, patchFileName);
      await sharp(rgbaBuf, { raw: { width: cropW, height: cropH, channels: 4 } })
        .png()
        .toFile(patchPath);

      const diffCropJpg = await sharp(diffCropRaw, { raw: { width: cropW, height: cropH, channels: 3 } }).jpeg().toBuffer();

      const cardW = cropW * 2 + 10;
      const cardH = cropH;
      const cardFileName = `${t.word}_compare_${v.key}.jpg`;
      const cardPath = path.join(outCropsDir, cardFileName);
      const brainCardPath = path.join(brainDir, cardFileName);

      await sharp({
        create: {
          width: cardW,
          height: cardH,
          channels: 3,
          background: { r: 30, g: 30, b: 35 }
        }
      }).composite([
        { input: baseCropBuf, left: 0, top: 0 },
        { input: diffCropJpg, left: cropW + 10, top: 0 }
      ]).jpeg({ quality: 90 }).toFile(cardPath);

      fs.copyFileSync(cardPath, brainCardPath);
      console.log(`  ✓ Generated patch & card: ${t.word} (${v.key})`);
    }
  }

  // 2. Generate Side-by-Side Labeled Verification Images (Base vs Var A, B, C)
  console.log('\n--- Generating Side-by-Side Labeled Verification Images ---');
  for (const v of variants) {
    const svgOverlay = `
      <svg width="${width * 2}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .box-base { fill: none; stroke: #38bdf8; stroke-width: 4; stroke-dasharray: 8,4; }
          .box-diff { fill: none; stroke: #f43f5e; stroke-width: 4; }
          .label { font-family: sans-serif; font-size: 15px; font-weight: bold; fill: #ffffff; }
          .bg-label { fill: rgba(15, 23, 42, 0.85); stroke: rgba(255, 255, 255, 0.3); stroke-width: 1; }
        </style>
        ${TARGETS.map(t => `
          <!-- Left (Base) -->
          <ellipse cx="${t.x}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" class="box-base" />
          <rect x="${t.x - 45}" y="${t.y - t.ry - 24}" width="90" height="22" rx="4" class="bg-label" />
          <text x="${t.x}" y="${t.y - t.ry - 8}" text-anchor="middle" class="label">${t.word}</text>

          <!-- Right (${v.label}) -->
          <ellipse cx="${t.x + width}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" class="box-diff" />
          <rect x="${t.x + width - 45}" y="${t.y - t.ry - 24}" width="90" height="22" rx="4" class="bg-label" />
          <text x="${t.x + width}" y="${t.y - t.ry - 8}" text-anchor="middle" class="label">${t.word}</text>
        `).join('\n')}
      </svg>
    `;

    const diffJpgBuf = await sharp(v.rawBuf.data, { raw: { width, height, channels: 3 } }).jpeg().toBuffer();
    const sideBySideName = v.key === 'var_a' ? 'book5_scene2_side_by_side_boxes.jpg' : `book5_scene2_side_by_side_boxes_${v.key.replace('var_', 'var')}.jpg`;
    const sideBySidePath = path.join(brainDir, sideBySideName);

    await sharp({
      create: {
        width: width * 2,
        height: height,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    }).composite([
      { input: baseImgPath, left: 0, top: 0 },
      { input: diffJpgBuf, left: width, top: 0 },
      { input: Buffer.from(svgOverlay), left: 0, top: 0 }
    ]).jpeg({ quality: 88 }).toFile(sideBySidePath);

    console.log(`  ✓ Generated side-by-side verification: ${sideBySideName}`);
  }

  // 3. Generate Dynamic 8-choose-5 Game Turn Simulation Preview Image
  console.log('\n--- Generating Dynamic 8-choose-5 Game Turn Preview ---');
  const chosenSim = [
    { word: 'bread', varKey: 'var_a' },
    { word: 'guitar', varKey: 'var_b' },
    { word: 'painting', varKey: 'var_a' },
    { word: 'cake', varKey: 'var_c' },
    { word: 'camera', varKey: 'var_b' }
  ];

  const patchComposites = [];
  for (const c of chosenSim) {
    const t = TARGETS.find(item => item.word === c.word);
    const padX = Math.round(t.rx * 0.4) + 16;
    const padY = Math.round(t.ry * 0.4) + 16;
    const cropLeft = Math.max(0, t.x - t.rx - padX);
    const cropTop = Math.max(0, t.y - t.ry - padY);
    const patchPath = path.join(outCropsDir, `patch_${t.word}_${c.varKey}.png`);
    patchComposites.push({
      input: patchPath,
      left: cropLeft,
      top: cropTop
    });
  }

  const rightSideRendered = await sharp(baseImgPath)
    .composite(patchComposites)
    .jpeg()
    .toBuffer();

  const previewSvg = `
    <svg width="${width * 2}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .banner { fill: rgba(15, 23, 42, 0.88); stroke: rgba(56, 189, 248, 0.4); stroke-width: 1.5; }
        .banner-text { font-family: sans-serif; font-size: 19px; font-weight: bold; fill: #38bdf8; }
        .diff-marker { fill: none; stroke: #10b981; stroke-width: 4; }
        .diff-tag { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: #ffffff; }
      </style>
      <rect x="20" y="16" width="360" height="42" rx="8" class="banner" />
      <text x="35" y="44" class="banner-text">Left: 100% Base (原圖基準)</text>
      
      <rect x="${width + 20}" y="16" width="600" height="42" rx="8" class="banner" />
      <text x="${width + 35}" y="44" class="banner-text">Right: Dynamic 8-choose-5 Slot Engine (Method A)</text>

      ${chosenSim.map(c => {
        const t = TARGETS.find(item => item.word === c.word);
        return `
          <ellipse cx="${t.x + width}" cy="${t.y}" rx="${t.rx + 6}" ry="${t.ry + 6}" class="diff-marker" />
          <rect x="${t.x + width - 55}" y="${t.y + t.ry + 8}" width="110" height="22" rx="4" fill="rgba(16, 185, 129, 0.9)" />
          <text x="${t.x + width}" y="${t.y + t.ry + 24}" text-anchor="middle" class="diff-tag">${t.word} (${c.varKey.replace('var_', 'Var ')})</text>
        `;
      }).join('\n')}
    </svg>
  `;

  const dynamicPreviewPath = path.join(brainDir, 'b5_s2_dynamic_preview.jpg');
  await sharp({
    create: {
      width: width * 2,
      height: height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  }).composite([
    { input: baseImgPath, left: 0, top: 0 },
    { input: rightSideRendered, left: width, top: 0 },
    { input: Buffer.from(previewSvg), left: 0, top: 0 }
  ]).jpeg({ quality: 88 }).toFile(dynamicPreviewPath);

  console.log(`  ✓ Generated dynamic preview: ${dynamicPreviewPath}`);
  console.log('\n=== ALL B5S2 METHOD A ASSETS RE-GENERATED WITH PINPOINT ACCURACY ===');
}

main().catch(err => {
  console.error('Fatal error generating B5S2 assets:', err);
  process.exit(1);
});
