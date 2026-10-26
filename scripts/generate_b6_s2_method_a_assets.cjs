const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 8 TARGET VOCABULARY DEFINITIONS (Singapore Gardens by the Bay Waterfront Promenade)
const TARGETS = [
  {
    word: 'tree',
    wordZh: '熱帶樹花',
    x: 230,
    y: 220,
    rx: 150,
    ry: 115,
    typeZh: '枝頭樣態',
    descVarA: '雞蛋花樹盛開粉紅花朵轉為白瓣金黃花蕊的夏威夷白金雞蛋花',
    descVarB: '雞蛋花樹枝頭結滿熟透金黃的熱帶香甜芒果與青翠嫩葉',
    descVarC: '枝頭轉為盛開深紫色熱帶蘭花並棲息著一隻色彩繽紛的巨嘴鳥'
  },
  {
    word: 'statue',
    wordZh: '魚尾獅雕像',
    x: 460,
    y: 335,
    rx: 45,
    ry: 85,
    typeZh: '雕像裝飾',
    descVarA: '白色魚尾獅身披新加坡星月節慶紅絲帶與璀璨金色桂冠',
    descVarB: '白色石雕魚尾獅轉為金光閃閃的高雅拋光黃銅青銅雕像',
    descVarC: '魚尾獅融入夜間燈光秀，點亮霓虹電光紫藍色極光漸層光暈'
  },
  {
    word: 'boat',
    wordZh: '觀光渡輪',
    x: 880,
    y: 390,
    rx: 118,
    ry: 48,
    typeZh: '船隻款式',
    descVarA: '傳統黃褐木造駁船轉為流線型純白雙層現代豪華觀光遊艇',
    descVarB: '傳統駁船轉為翠綠與純白雙色的環保太陽能綠能觀光渡輪',
    descVarC: '傳統駁船轉為深海軍藍飾以黃銅欄杆與節慶燕尾旗的尊爵迎賓船'
  },
  {
    word: 'water',
    wordZh: '冰涼水瓶',
    x: 585,
    y: 515,
    rx: 25,
    ry: 48,
    typeZh: '飲品杯款',
    descVarA: '晶透檸檬冰水轉為粉紅漸層葡萄柚氣泡水果水佐清涼薄荷葉',
    descVarB: '晶透水杯轉為現榨金黃柳橙汁配紅白相間復古條紋環保吸管',
    descVarC: '冰水杯轉為夢幻藍色蝶豆花檸檬冰茶綻放清澈漸層色彩'
  },
  {
    word: 'noodles',
    wordZh: '南洋炒麵',
    x: 525,
    y: 600,
    rx: 66,
    ry: 50,
    typeZh: '麵食風味',
    descVarA: '金黃南洋炒麵轉為香濃椰奶紅油叻沙湯麵佐金黃油豆腐泡',
    descVarB: '炒麵轉為乾拌黑醬油撈麵佐鮮甜大蝦雲吞與青江菜',
    descVarC: '炒麵轉為石鍋韓風香菇時蔬炒冬粉撒上香脆熟白芝麻'
  },
  {
    word: 'salad',
    wordZh: '鮮蔬沙拉',
    x: 710,
    y: 550,
    rx: 65,
    ry: 50,
    typeZh: '沙拉配料',
    descVarA: '田園生菜沙拉滿鋪純白菲達起司塊、黑橄欖與初榨橄欖油',
    descVarB: '生菜沙拉轉為泰式青木瓜絲沙拉滿撒香脆花生碎與新鮮香菜',
    descVarC: '生菜沙拉轉為挪威煙燻鮭魚凱薩沙拉滿覆金黃蒜香脆麵包丁'
  },
  {
    word: 'soup',
    wordZh: '熱騰騰熱湯',
    x: 865,
    y: 550,
    rx: 65,
    ry: 52,
    typeZh: '熱湯風味',
    descVarA: '青花瓷清湯轉為砂鍋胡椒肉骨茶佐香酥油條與燉排骨',
    descVarB: '清湯轉為溫潤金黃奶油南瓜濃湯點綴純白鮮奶油花紋',
    descVarC: '清湯轉為紅豔酸辣泰式冬陰功海鮮湯浮現飽滿鮮蝦與香茅'
  },
  {
    word: 'fan',
    wordZh: '手持風扇',
    x: 670,
    y: 650,
    rx: 70,
    ry: 40,
    typeZh: '風扇外觀',
    descVarA: '柔和粉藍手持風扇轉為俏皮櫻花粉色貓耳造型隨身小風扇',
    descVarB: '粉藍風扇轉為復古奶油黃簡約工業風渦輪隨身手提電風扇',
    descVarC: '粉藍風扇轉為清新薄荷嫩綠色運動摺疊頸掛隨身多功能風扇'
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
  const baseImgPath = 'public/assets/spotter/book6_scene2_base.jpg';
  const diffImgPathA = 'public/assets/spotter/book6_scene2_diff.jpg';
  const diffImgPathB = 'public/assets/spotter/book6_scene2_diff_varb.jpg';
  const diffImgPathC = 'public/assets/spotter/book6_scene2_diff_varc.jpg';

  const outCropsDir = 'public/assets/spotter/crops/b6_s2';
  const outPatchesDir = 'public/assets/spotter/patches/b6_s2';
  const brainDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';

  if (!fs.existsSync(outCropsDir)) fs.mkdirSync(outCropsDir, { recursive: true });
  if (!fs.existsSync(outPatchesDir)) fs.mkdirSync(outPatchesDir, { recursive: true });

  const baseBuf = await sharp(baseImgPath).raw().toBuffer({ resolveWithObject: true });
  const diffBufA = await sharp(diffImgPathA).raw().toBuffer({ resolveWithObject: true });
  const diffBufB = await sharp(diffImgPathB).raw().toBuffer({ resolveWithObject: true });
  const diffBufC = await sharp(diffImgPathC).raw().toBuffer({ resolveWithObject: true });

  const { width, height } = baseBuf.info;
  console.log(`Canvas size: ${width}x${height}`);

  const variants = [
    { key: 'var_a', label: '變異型態 A', rawBuf: diffBufA, patchSuffix: 'variantA' },
    { key: 'var_b', label: '變異型態 B', rawBuf: diffBufB, patchSuffix: 'variantB' },
    { key: 'var_c', label: '變異型態 C', rawBuf: diffBufC, patchSuffix: 'variantC' }
  ];

  // 1. Generate 24 Feathered PNG Patches & 24 Comparison Cards
  console.log('\n--- Generating 24 Patches & 24 Comparison Cards ---');
  const targetSlots = [];

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

    targetSlots.push({
      word: t.word,
      slot: { x: cropLeft, y: cropTop, w: cropW, h: cropH, rx: 16 }
    });

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

      // Create 4-channel RGBA buffer
      const rgbaBuf = Buffer.alloc(cropW * cropH * 4);
      for (let i = 0; i < cropW * cropH; i++) {
        rgbaBuf[i * 4 + 0] = diffCropRaw[i * 3 + 0];
        rgbaBuf[i * 4 + 1] = diffCropRaw[i * 3 + 1];
        rgbaBuf[i * 4 + 2] = diffCropRaw[i * 3 + 2];
        rgbaBuf[i * 4 + 3] = alphaMask[i];
      }

      // Save patch PNG to crops and patches directories
      const patchFilenameCrop = `patch_${t.word}_${v.key}.png`;
      const patchPathCrop = path.join(outCropsDir, patchFilenameCrop);
      await sharp(rgbaBuf, { raw: { width: cropW, height: cropH, channels: 4 } })
        .png()
        .toFile(patchPathCrop);

      const patchFilenameDeploy = `${t.word}_${v.patchSuffix}.png`;
      const patchPathDeploy = path.join(outPatchesDir, patchFilenameDeploy);
      fs.copyFileSync(patchPathCrop, patchPathDeploy);

      // Save comparison card
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

  // 2. Generate Side-by-Side Labeled Verification Images (Base vs Var A, Base vs Var B, Base vs Var C)
  console.log('\n--- Generating Side-by-Side Labeled Verification Images ---');
  for (const v of variants) {
    const svgOverlay = `
      <svg width="${width * 2}" height="${height}" viewBox="0 0 ${width * 2} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .label { font-family: sans-serif; font-size: 14px; font-weight: bold; fill: #ffffff; }
          .bg-label { fill: rgba(15, 23, 42, 0.88); stroke: #38bdf8; stroke-width: 1.5; }
          .box-base { fill: none; stroke: #10b981; stroke-width: 3.5; }
          .box-diff { fill: none; stroke: #f43f5e; stroke-width: 3.5; }
          .banner { fill: rgba(15, 23, 42, 0.92); }
          .banner-text { font-family: sans-serif; font-size: 16px; font-weight: 800; fill: #38bdf8; }
        </style>

        <rect x="20" y="16" width="340" height="40" rx="8" class="banner" />
        <text x="35" y="42" class="banner-text">Left: 100% Base (原圖基準)</text>
        
        <rect x="${width + 20}" y="16" width="460" height="40" rx="8" class="banner" />
        <text x="${width + 35}" y="42" class="banner-text">Right: ${v.label} (成對變異全景)</text>

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
    const sideBySideName = v.key === 'var_a' ? 'book6_scene2_side_by_side_boxes.jpg' : `book6_scene2_side_by_side_boxes_${v.key.replace('var_', 'var')}.jpg`;
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
    { word: 'tree', varKey: 'var_a' },
    { word: 'statue', varKey: 'var_b' },
    { word: 'noodles', varKey: 'var_a' },
    { word: 'soup', varKey: 'var_c' },
    { word: 'fan', varKey: 'var_b' }
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
    <svg width="${width * 2}" height="${height}" viewBox="0 0 ${width * 2} ${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .banner { fill: rgba(15, 23, 42, 0.92); }
        .banner-text { font-family: sans-serif; font-size: 16px; font-weight: 800; fill: #38bdf8; }
        .diff-marker { fill: none; stroke: #10b981; stroke-width: 3.5; stroke-dasharray: 8,4; }
        .diff-tag { font-family: sans-serif; font-size: 13px; font-weight: bold; fill: #ffffff; }
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

  const dynamicPreviewPath = path.join(brainDir, 'b6_s2_dynamic_preview.jpg');
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
  console.log('\n=== Target Slot Definitions ===');
  console.log(JSON.stringify(targetSlots, null, 2));
  console.log('\n=== ALL B6S2 METHOD A ASSETS GENERATED CLEANLY ===');
}

main().catch(err => {
  console.error('Fatal error generating B6S2 assets:', err);
  process.exit(1);
});
