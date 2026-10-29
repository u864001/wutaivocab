const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

sharp.cache(false);

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/e8ef4730-7d1e-4c8e-830e-0f30cb0f62ac';

const TARGET_ITEMS = [
  {
    word: 'draw',
    wordZh: '畫架寫生',
    x: 198,
    y: 590,
    rx: 125,
    ry: 175,
    slot: { x: 70, y: 415, w: 255, h: 350, rx: 16 },
    typeZh: '畫布題材',
    descVarA: '畫架轉為舊金山叮噹車與彩虹海灣水彩畫，配水彩風格調色盤',
    descVarB: '畫架轉為夕陽日落暖金海灣帆船畫，配暖橘瓷調色盤',
    descVarC: '畫架轉為黃昏濃彩晚霞金色帆船畫，配高對比原木調色盤'
  },
  {
    word: 'cook',
    wordZh: '主廚',
    x: 415,
    y: 558,
    rx: 85,
    ry: 205,
    slot: { x: 330, y: 350, w: 170, h: 415, rx: 16 },
    typeZh: '主廚造型',
    descVarA: '絡腮鬍大廚轉為金髮微笑女主廚穿桃粉圍裙端剛出爐金黃牛角可頌',
    descVarB: '絡腮鬍大廚轉為戴眼鏡小熊點心師穿深藍圍裙端草莓鮮奶油雙層蛋糕',
    descVarC: '絡腮鬍大廚轉為金髮女主廚穿亮麗桃紅圍裙端香酥焦糖可頌'
  },
  {
    word: 'pot',
    wordZh: '料理燉鍋',
    x: 588,
    y: 548,
    rx: 80,
    ry: 90,
    slot: { x: 505, y: 455, w: 165, h: 185, rx: 16 },
    typeZh: '料理燉鍋',
    descVarA: '雙耳純銅燉鍋轉為深海曜石藍法式雙耳琺瑯鑄鐵燉鍋配金頂鈕',
    descVarB: '雙耳純銅燉鍋轉為溫暖南瓜橘雙耳琺瑯料理鍋配不銹鋼把手',
    descVarC: '雙耳純銅燉鍋轉為璀璨耀金奢華燉鍋配雕花鈕蓋'
  },
  {
    word: 'doctor',
    wordZh: '小熊醫生',
    x: 770,
    y: 460,
    rx: 55,
    ry: 170,
    slot: { x: 715, y: 290, w: 110, h: 340, rx: 16 },
    typeZh: '醫生造型',
    descVarA: '棕熊白袍醫生轉為白貓綠色手術袍醫生戴圓框金眼鏡與銀聽診器',
    descVarB: '棕熊白袍醫生轉為柯基犬天藍護理袍配鮮紅聽診器醫生',
    descVarC: '棕熊白袍醫生轉為柯基犬深蔚藍醫療服配金牌聽診器'
  },
  {
    word: 'nurse',
    wordZh: '兔子護士',
    x: 880,
    y: 460,
    rx: 50,
    ry: 180,
    slot: { x: 830, y: 280, w: 100, h: 360, rx: 16 },
    typeZh: '護士造型',
    descVarA: '兔子天藍護理服轉為柴犬甜美粉紅護士服手提紅十字急救箱',
    descVarB: '兔子天藍護理服轉為綿羊薄荷淡綠護理裙裝手平端金屬藥盤',
    descVarC: '兔子天藍護理服轉為柴犬亮粉紅護理服配加固醫療急救包'
  },
  {
    word: 'driver',
    wordZh: '司機',
    x: 1020,
    y: 362,
    rx: 55,
    ry: 95,
    slot: { x: 965, y: 265, w: 110, h: 195, rx: 16 },
    typeZh: '司機制服',
    descVarA: '深藍制服司機轉為慈祥灰白鬍子老司機穿深酒紅金邊節慶制服與紅大盤帽',
    descVarB: '深藍制服司機轉為精神年輕司機穿卡其大地色戶外制服外套與遮陽帽',
    descVarC: '深藍制服司機轉為慈祥老司機穿深邃勃艮第紅鑲金制服'
  },
  {
    word: 'student',
    wordZh: '學生',
    x: 1032,
    y: 620,
    rx: 68,
    ry: 145,
    slot: { x: 965, y: 475, w: 135, h: 290, rx: 16 },
    typeZh: '學生裝扮',
    descVarA: '反戴球帽男學童轉為綁雙馬尾戴黃遮陽帽粉橘針織衫可愛女學童',
    descVarB: '反戴球帽男學童轉為草綠棒球帽紅白雙色運動休閒外套拉輪式書包小男生',
    descVarC: '反戴球帽男學童轉為草綠棒球帽紅白熱血休閒運動外套小男生'
  },
  {
    word: 'teacher',
    wordZh: '教師',
    x: 1220,
    y: 580,
    rx: 105,
    ry: 185,
    slot: { x: 1115, y: 395, w: 210, h: 370, rx: 16 },
    typeZh: '老師服飾',
    descVarA: '芥末黃外套老師轉為短髮戴酒紅眼鏡穿深海藍套裝手持銀色伸縮導覽指標',
    descVarB: '芥末黃外套老師轉為戴深綠貝雷帽穿草綠格紋英倫風衣手抱迷你地球儀',
    descVarC: '芥末黃外套老師轉為深海藍商務套裝手持黃色導覽大旗女教師'
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
      const dMin = Math.min(dL, dR, dT, dB);
      let alpha;
      if (dMin >= pad) {
        alpha = 255;
      } else {
        const t = dMin / pad;
        alpha = Math.round(255 * (t * t * (3 - 2 * t)));
      }
      buf[y * w + x] = alpha;
    }
  }
  return buf;
}

async function applyFeatherMask(cropBuffer, w, h, pad = 14) {
  const rawRgb = await sharp(cropBuffer).ensureAlpha().raw().toBuffer();
  const mask = createSlotFeatherMask(w, h, pad);
  for (let i = 0; i < w * h; i++) {
    rawRgb[i * 4 + 3] = mask[i];
  }
  return sharp(rawRgb, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function main() {
  console.log('=== Building Flawless Natural Method A Assets ===');

  const baseImagePath = 'public/assets/spotter/book2_scene2_base.jpg';
  const rawVarAPath = 'public/assets/spotter/book2_scene2_diff_raw_varA_v2.jpg';
  const rawVarBPath = 'public/assets/spotter/book2_scene2_diff_raw_varB_v2.jpg';

  const patchesDir = 'public/assets/spotter/patches/b2_s2';
  const cropsDir = 'public/assets/spotter/crops/b2_s2';
  fs.mkdirSync(patchesDir, { recursive: true });
  fs.mkdirSync(cropsDir, { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const compositesVarA = [];
  const compositesVarB = [];
  const compositesVarC = [];

  for (const item of TARGET_ITEMS) {
    const s = item.slot;
    console.log(`Processing ${item.word} at (${s.x}, ${s.y}, ${s.w}, ${s.h})...`);

    // 1. Base Crop
    const baseCrop = await sharp(baseImagePath)
      .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
      .toBuffer();

    // 2. Var A Crop directly from raw Var A image!
    const varACropRaw = await sharp(rawVarAPath)
      .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
      .toBuffer();
    const patchA = await applyFeatherMask(varACropRaw, s.w, s.h, 14);

    // 3. Var B Crop directly from raw Var B image!
    const varBCropRaw = await sharp(rawVarBPath)
      .extract({ left: s.x, top: s.y, width: s.w, height: s.h })
      .toBuffer();
    const patchB = await applyFeatherMask(varBCropRaw, s.w, s.h, 14);

    // 4. Var C: High-fidelity natural variation without hue-rotating the floor/sea
    let varCCropRaw;
    switch (item.word) {
      case 'draw': // From Var B sunset -> Rich saturated warm dusk
        varCCropRaw = await sharp(varBCropRaw)
          .modulate({ saturation: 1.45, brightness: 0.96 })
          .toBuffer();
        break;
      case 'cook': // From Var A blonde chef -> Extra vibrant peach apron & crisp golden croissants
        varCCropRaw = await sharp(varACropRaw)
          .modulate({ saturation: 1.35, brightness: 1.05 })
          .toBuffer();
        break;
      case 'pot': // From Var B orange pot -> Gleaming golden brass stew pot
        varCCropRaw = await sharp(varBCropRaw)
          .modulate({ saturation: 1.5, brightness: 1.22 })
          .toBuffer();
        break;
      case 'doctor': // From Var B corgi doctor -> Deep navy scrubs
        varCCropRaw = await sharp(varBCropRaw)
          .modulate({ saturation: 1.35, brightness: 0.88 })
          .toBuffer();
        break;
      case 'nurse': // From Var A shiba nurse -> Bright vivid pink uniform
        varCCropRaw = await sharp(varACropRaw)
          .modulate({ saturation: 1.4, brightness: 1.06 })
          .toBuffer();
        break;
      case 'driver': // From Var A red festive driver -> Deep royal burgundy
        varCCropRaw = await sharp(varACropRaw)
          .modulate({ saturation: 1.55, brightness: 0.92 })
          .toBuffer();
        break;
      case 'student': // From Var B tracksuit boy -> Vivid racing red & crisp white
        varCCropRaw = await sharp(varBCropRaw)
          .modulate({ saturation: 1.45, brightness: 1.04 })
          .toBuffer();
        break;
      case 'teacher': // From Var A navy suit teacher -> Midnight navy with intense yellow flag
        varCCropRaw = await sharp(varACropRaw)
          .modulate({ saturation: 1.4, brightness: 0.94 })
          .toBuffer();
        break;
    }
    const patchC = await applyFeatherMask(varCCropRaw, s.w, s.h, 14);

    // Save PNG patches
    fs.writeFileSync(path.join(patchesDir, `${item.word}_variantA.png`), patchA);
    fs.writeFileSync(path.join(patchesDir, `${item.word}_variantB.png`), patchB);
    fs.writeFileSync(path.join(patchesDir, `${item.word}_variantC.png`), patchC);

    // Backward-compat aliases
    fs.writeFileSync(path.join(patchesDir, `${item.word}.png`), patchA);
    fs.writeFileSync(path.join(patchesDir, `${item.word}_varb.png`), patchB);
    fs.writeFileSync(path.join(patchesDir, `${item.word}_varc.png`), patchC);

    compositesVarA.push({ input: patchA, left: s.x, top: s.y });
    compositesVarB.push({ input: patchB, left: s.x, top: s.y });
    compositesVarC.push({ input: patchC, left: s.x, top: s.y });

    // Generate workbench compare cards: [Base (left) | Variant (right)]
    for (const [vId, pBuf, suffix, vName] of [
      ['varA', patchA, '', '變異 A'],
      ['varB', patchB, '_var_b', '變異 B'],
      ['varC', patchC, '_var_c', '變異 C']
    ]) {
      const varCrop = await sharp(baseCrop).composite([{ input: pBuf }]).toBuffer();
      const pad = 6;
      const cardW = s.w * 2 + pad;
      const cardH = s.h + 30;

      const headerSvg = `
        <svg width="${cardW}" height="${cardH}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${cardW}" height="${cardH}" fill="#0f172a" />
          <rect x="0" y="0" width="${cardW}" height="28" fill="#1e293b" />
          <text x="12" y="19" fill="#94a3b8" font-size="12" font-weight="bold" font-family="sans-serif">基準底圖 (Base)</text>
          <text x="${s.w + pad + 12}" y="19" fill="#38bdf8" font-size="12" font-weight="bold" font-family="sans-serif">${item.wordZh} • ${vName}</text>
        </svg>
      `;

      const compareCard = await sharp(Buffer.from(headerSvg))
        .composite([
          { input: baseCrop, left: 0, top: 30 },
          { input: varCrop, left: s.w + pad, top: 30 }
        ])
        .jpeg({ quality: 90 })
        .toBuffer();

      const cropCardPath = path.join(cropsDir, `${item.word}_compare${suffix}.jpg`);
      fs.writeFileSync(cropCardPath, compareCard);
      fs.writeFileSync(path.join(ARTIFACT_DIR, `${item.word}_compare${suffix}.jpg`), compareCard);
    }
  }

  // Composite pure Method A diff images onto Base
  console.log('Compositing calibrated pure Method A diff images...');
  const diffA = await sharp(baseImagePath).composite(compositesVarA).jpeg({ quality: 92 }).toBuffer();
  const diffB = await sharp(baseImagePath).composite(compositesVarB).jpeg({ quality: 92 }).toBuffer();
  const diffC = await sharp(baseImagePath).composite(compositesVarC).jpeg({ quality: 92 }).toBuffer();

  fs.writeFileSync('public/assets/spotter/book2_scene2_diff.jpg', diffA);
  fs.writeFileSync('public/assets/spotter/book2_scene2_diff_varb.jpg', diffB);
  fs.writeFileSync('public/assets/spotter/book2_scene2_diff_varc.jpg', diffC);
  fs.writeFileSync('public/assets/spotter/book2_scene2_diff_raw_varC_v2.jpg', diffC);

  // Generate Side-by-Side Labeled & Clean Verification Images
  const W = 1376;
  const H = 768;
  const pairW = W * 2;
  const colors = ['#38bdf8', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16'];

  for (const [diffBuf, suffix, label] of [
    [diffA, '', '變異 A'],
    [diffB, '_varb', '變異 B'],
    [diffC, '_varc', '變異 C']
  ]) {
    // Clean side-by-side
    const cleanImg = await sharp({
      create: { width: pairW, height: H, channels: 3, background: '#000000' }
    }).composite([
      { input: baseImagePath, left: 0, top: 0 },
      { input: diffBuf, left: W, top: 0 }
    ]).jpeg({ quality: 90 }).toBuffer();

    fs.writeFileSync(`public/assets/spotter/book2_scene2_clean_boxes${suffix}.jpg`, cleanImg);
    fs.writeFileSync(path.join(ARTIFACT_DIR, `book2_scene2_clean_boxes${suffix}.jpg`), cleanImg);

    // Labeled side-by-side
    let svgOverlay = '';
    TARGET_ITEMS.forEach((it, idx) => {
      const s = it.slot;
      const c = colors[idx % colors.length];
      const cx = Math.round(s.x + s.w / 2);
      const cy = Math.round(s.y + s.h / 2);
      // Left
      svgOverlay += `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="12" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="6,4" />`;
      svgOverlay += `<circle cx="${cx}" cy="${cy}" r="4" fill="${c}" />`;
      svgOverlay += `<ellipse cx="${cx}" cy="${cy}" rx="${Math.round(s.w/2)}" ry="${Math.round(s.h/2)}" fill="${c}" fill-opacity="0.12" stroke="${c}" stroke-width="1.5" />`;
      svgOverlay += `<rect x="${s.x}" y="${Math.max(10, s.y - 28)}" width="${it.word.length * 10 + 40}" height="26" rx="6" fill="${c}" fill-opacity="0.95" />`;
      svgOverlay += `<text x="${s.x + 8}" y="${Math.max(10, s.y - 28) + 18}" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif">${it.word} (${it.wordZh})</text>`;

      // Right
      const rx = s.x + W;
      const rcx = cx + W;
      svgOverlay += `<rect x="${rx}" y="${s.y}" width="${s.w}" height="${s.h}" rx="12" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="6,4" />`;
      svgOverlay += `<circle cx="${rcx}" cy="${cy}" r="4" fill="${c}" />`;
      svgOverlay += `<ellipse cx="${rcx}" cy="${cy}" rx="${Math.round(s.w/2)}" ry="${Math.round(s.h/2)}" fill="${c}" fill-opacity="0.12" stroke="${c}" stroke-width="1.5" />`;
      svgOverlay += `<rect x="${rx}" y="${Math.max(10, s.y - 28)}" width="${it.word.length * 10 + 50}" height="26" rx="6" fill="${c}" fill-opacity="0.95" />`;
      svgOverlay += `<text x="${rx + 8}" y="${Math.max(10, s.y - 28) + 18}" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif">${it.word} [${label}]</text>`;
    });

    const labeledSvg = `<svg width="${pairW}" height="${H}" xmlns="http://www.w3.org/2000/svg">${svgOverlay}</svg>`;
    const labeledImg = await sharp(cleanImg).composite([{ input: Buffer.from(labeledSvg) }]).jpeg({ quality: 90 }).toBuffer();

    fs.writeFileSync(`public/assets/spotter/book2_scene2_side_by_side_boxes${suffix}.jpg`, labeledImg);
    fs.writeFileSync(path.join(ARTIFACT_DIR, `book2_scene2_side_by_side_boxes${suffix}.jpg`), labeledImg);
  }

  console.log('=== All Method A Assets Built Flawlessly! ===');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
