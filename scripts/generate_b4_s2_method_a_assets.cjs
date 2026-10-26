const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 8 個目標幾何規格 (經過精密像素差分校準與零交疊驗證，涵蓋近中遠 3 層景深及 13+ 靜態背景已學單字環境物件)
const TARGETS = [
  {
    word: 'chair',
    wordZh: '椅子',
    x: 175,
    y: 590,
    rx: 140,
    ry: 110,
    typeZh: '椅款樣式',
    descVarA: '前景墨綠英倫長椅轉為白色維多利亞鐵藝雕花椅',
    descVarB: '前景長椅轉為暖木色實木單人椅佐蘇格蘭格紋軟墊',
    descVarC: '前景長椅轉為熱情亮紅街角露天咖啡館金屬椅'
  },
  {
    word: 'hat',
    wordZh: '帽子',
    x: 430,
    y: 235,
    rx: 50,
    ry: 60,
    typeZh: '紳士帽款',
    descVarA: '路燈臂掛著的紳士黑圓頂帽轉為金棕毛呢獵鹿帽',
    descVarB: '路燈臂禮帽轉為米白平頂草帽佐海軍藍緞帶',
    descVarC: '路燈臂禮帽轉為深墨綠針織圓頂禮帽佐羽毛'
  },
  {
    word: 'bus',
    wordZh: '公車',
    x: 510,
    y: 380,
    rx: 110,
    ry: 75,
    typeZh: '公車外觀',
    descVarA: '河畔街道行駛經典紅雙層巴士轉為皇家海軍藍觀光巴士',
    descVarB: '街道紅雙層巴士轉為復古奶油白與酒紅雙層敞篷巴士',
    descVarC: '街道紅雙層巴士轉為銀亮金屬流線雙層油電巴士'
  },
  {
    word: 'table',
    wordZh: '桌子',
    x: 630,
    y: 675,
    rx: 85,
    ry: 75,
    typeZh: '咖啡桌款',
    descVarA: '露天原木咖啡圓桌披覆典雅白色波浪蕾絲桌巾',
    descVarB: '咖啡圓桌轉為彩色地中海馬賽克瓷磚拼花六角桌',
    descVarC: '咖啡圓桌轉為原木風粗獷方型野餐實木小桌'
  },
  {
    word: 'box',
    wordZh: '禮盒',
    x: 850,
    y: 365,
    rx: 75,
    ry: 65,
    typeZh: '禮品盒裝',
    descVarA: '石欄基座紫色金緞帶禮盒轉為英倫花草彩繪鐵盒茶罐',
    descVarB: '石欄基座禮盒轉為溫潤紅木雕花珠寶盒佐黃銅鎖扣',
    descVarC: '石欄基座禮盒轉為亮麗英國米字旗彩繪金屬紀念盒'
  },
  {
    word: 'bag',
    wordZh: '提包',
    x: 935,
    y: 655,
    rx: 80,
    ry: 80,
    typeZh: '提包種類',
    descVarA: '石板路上焦糖皮質公事包轉為橄欖綠帆布休閒後背包',
    descVarB: '石板路皮質公事包轉為海軍藍深紅英式硬挺學生雙肩包',
    descVarC: '石板路皮質公事包轉為復古刺繡提花大容量托特包'
  },
  {
    word: 'clock',
    wordZh: '時鐘',
    x: 912,
    y: 175,
    rx: 55,
    ry: 55,
    typeZh: '鐘樓時鐘',
    descVarA: '遠景大笨鐘金色羅馬鐘面轉為珍珠白簡約夜光鐘面',
    descVarB: '遠景大笨鐘鐘面轉為維多利亞墨綠底金漆花絲古典鐘面',
    descVarC: '遠景大笨鐘鐘面轉為夕陽暖橘金色背光三點鐘下午茶鐘面'
  },
  {
    word: 'basket',
    wordZh: '提籃',
    x: 1215,
    y: 615,
    rx: 95,
    ry: 85,
    typeZh: '編織野餐籃',
    descVarA: '右側蜂蜜色藤編野餐籃轉為盛滿薰衣草與玫瑰白鐵絲花籃',
    descVarB: '右側野餐籃轉為裝滿鮮紅蘋果與香酥英式糕點深褐色藤籃',
    descVarC: '右側野餐籃轉為原色竹編圓弧提把野餐購物提籃'
  }
];

function createFeatherMaskSvg(w, h, rx, ry) {
  const rMin = Math.min(rx, ry);
  const stop1 = Math.max(0.65, ((rMin - 20) / rMin)).toFixed(3);
  return `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="feather" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="1" />
          <stop offset="${stop1}" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#feather)" />
    </svg>
  `;
}

async function processVariant(variantKey, diffImagePath, patchSubdir, outBoxImagePath) {
  console.log(`\n=== Processing Variant ${variantKey} from ${diffImagePath} ===`);
  const diffImg = sharp(diffImagePath);
  const baseImg = sharp('public/assets/spotter/book4_scene2_base.jpg');
  const baseMeta = await baseImg.metadata();
  const W = baseMeta.width;
  const H = baseMeta.height;

  // 確保輸出目錄存在
  const patchDir = path.join('public', 'assets', 'spotter', 'patches', patchSubdir);
  const cropDir = path.join('public', 'assets', 'spotter', 'crops', patchSubdir);
  fs.mkdirSync(patchDir, { recursive: true });
  fs.mkdirSync(cropDir, { recursive: true });

  const baseBuf = await baseImg.toBuffer();
  const diffBuf = await diffImg.toBuffer();

  for (const t of TARGETS) {
    const margin = 20;
    const cropW = Math.round((t.rx + margin) * 2);
    const cropH = Math.round((t.ry + margin) * 2);
    const left = Math.max(0, Math.min(W - cropW, Math.round(t.x - t.rx - margin)));
    const top = Math.max(0, Math.min(H - cropH, Math.round(t.y - t.ry - margin)));

    // 1. 產生羽化 PNG 貼片
    const diffCropBuf = await diffImg.clone().extract({ left, top, width: cropW, height: cropH }).toBuffer();
    const maskSvg = createFeatherMaskSvg(cropW, cropH, t.rx + margin, t.ry + margin);
    const maskBuf = await sharp(Buffer.from(maskSvg)).toFormat('png').toBuffer();

    const patchFileName = `${t.word}_variant${variantKey}.png`;
    const patchOutPath = path.join(patchDir, patchFileName);

    await sharp(diffCropBuf)
      .composite([{ input: maskBuf, blend: 'dest-in' }])
      .png()
      .toFile(patchOutPath);

    // 2. 產生 650x276 雙聯特寫比對卡 (Base vs Variant)
    const CARD_W = 650;
    const CARD_H = 276;
    const cardHalfW = 320;
    const strokeColor = variantKey === 'A' ? '#22c55e' : (variantKey === 'B' ? '#eab308' : '#06b6d4');
    const labelText = variantKey === 'A' ? '右圖 VAR A (型態B)' : (variantKey === 'B' ? '右圖 VAR B (型態C)' : '右圖 VAR C (型態D)');

    const cropLeft = Math.max(0, Math.min(W - cardHalfW, Math.round(t.x - cardHalfW / 2)));
    const cropTop = Math.max(0, Math.min(H - CARD_H, Math.round(t.y - CARD_H / 2)));

    const baseCrop = await sharp(baseBuf).extract({ left: cropLeft, top: cropTop, width: cardHalfW, height: CARD_H }).toBuffer();
    const diffCrop = await sharp(diffBuf).extract({ left: cropLeft, top: cropTop, width: cardHalfW, height: CARD_H }).toBuffer();

    const labelSvg = `
      <svg width="${CARD_W}" height="${CARD_H}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${cardHalfW}" height="${CARD_H}" fill="none" stroke="#38bdf8" stroke-width="4" />
        <rect x="330" y="0" width="${cardHalfW}" height="${CARD_H}" fill="none" stroke="${strokeColor}" stroke-width="4" />
        <rect x="10" y="10" width="130" height="30" rx="8" fill="rgba(15,23,42,0.85)" />
        <text x="75" y="30" fill="#38bdf8" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle">左圖 BASE (型態A)</text>
        <rect x="340" y="10" width="140" height="30" rx="8" fill="rgba(15,23,42,0.85)" />
        <text x="410" y="30" fill="${strokeColor}" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle">${labelText}</text>
      </svg>
    `;

    const cardFileName = variantKey === 'A' ? `${t.word}_compare.jpg` : `${t.word}_compare_var${variantKey}.jpg`;
    const cardOutPath = path.join(cropDir, cardFileName);

    await sharp({
      create: { width: CARD_W, height: CARD_H, channels: 3, background: { r: 15, g: 23, b: 42 } }
    })
      .composite([
        { input: baseCrop, left: 0, top: 0 },
        { input: diffCrop, left: 330, top: 0 },
        { input: Buffer.from(labelSvg), left: 0, top: 0 }
      ])
      .jpeg({ quality: 90 })
      .toFile(cardOutPath);

    console.log(`  ✓ Generated patch & card: ${t.word} (${variantKey})`);
  }

  // 3. 產生全幅對照標籤框圖 (Left: Base, Right: Diff)
  const boxColor = variantKey === 'A' ? '#22c55e' : (variantKey === 'B' ? '#eab308' : '#06b6d4');
  let overlaySvg = `<svg width="${W * 2}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;

  TARGETS.forEach(t => {
    // 左邊 base 框
    overlaySvg += `
      <ellipse cx="${t.x}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" fill="none" stroke="${boxColor}" stroke-width="3" stroke-dasharray="6,4" />
      <text x="${t.x}" y="${Math.max(18, t.y - t.ry - 8)}" fill="${boxColor}" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">${t.word.toUpperCase()} (${t.wordZh})</text>
    `;
    // 右邊 diff 框
    const rx = t.x + W;
    overlaySvg += `
      <ellipse cx="${rx}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" fill="none" stroke="${boxColor}" stroke-width="3" stroke-dasharray="6,4" />
      <text x="${rx}" y="${Math.max(18, t.y - t.ry - 8)}" fill="${boxColor}" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">${t.word.toUpperCase()} (${t.wordZh})</text>
    `;
  });
  overlaySvg += `</svg>`;

  const sideBySide = await sharp({
    create: { width: W * 2, height: H, channels: 3, background: '#000000' }
  })
    .composite([
      { input: baseBuf, left: 0, top: 0 },
      { input: diffBuf, left: W, top: 0 },
      { input: Buffer.from(overlaySvg), left: 0, top: 0 }
    ])
    .jpeg({ quality: 90 })
    .toFile(outBoxImagePath);

  console.log(`  ✓ Saved ${outBoxImagePath}`);
}

async function generateDynamicSimulatorPreview() {
  console.log(`\n=== Generating Dynamic 8-choose-5 Test Preview ===`);
  const baseImg = sharp('public/assets/spotter/book4_scene2_base.jpg');
  const meta = await baseImg.metadata();
  const W = meta.width;
  const H = meta.height;

  // 隨機選取 5 個目標
  const chosenIndices = [0, 2, 3, 5, 7]; // chair, bus, table, bag, basket
  const composites = [];

  for (const idx of chosenIndices) {
    const t = TARGETS[idx];
    const margin = 20;
    const cropW = Math.round((t.rx + margin) * 2);
    const cropH = Math.round((t.ry + margin) * 2);
    const left = Math.max(0, Math.min(W - cropW, Math.round(t.x - t.rx - margin)));
    const top = Math.max(0, Math.min(H - cropH, Math.round(t.y - t.ry - margin)));

    const patchPath = path.join('public', 'assets', 'spotter', 'patches', 'b4_s2', `${t.word}_variantA.png`);
    if (fs.existsSync(patchPath)) {
      composites.push({
        input: patchPath,
        left,
        top
      });
    }
  }

  const dynamicRight = await sharp('public/assets/spotter/book4_scene2_base.jpg')
    .composite(composites)
    .toBuffer();

  const previewOut = 'public/assets/spotter/crops/b4_s2/dynamic_test_preview.jpg';
  await sharp({
    create: { width: W * 2, height: H, channels: 3, background: '#000' }
  })
    .composite([
      { input: 'public/assets/spotter/book4_scene2_base.jpg', left: 0, top: 0 },
      { input: dynamicRight, left: W, top: 0 }
    ])
    .jpeg({ quality: 90 })
    .toFile(previewOut);

  console.log(`  ✓ Saved dynamic 8-choose-5 test preview`);
}

async function run() {
  await processVariant('A', 'public/assets/spotter/book4_scene2_diff.jpg', 'b4_s2', 'public/assets/spotter/book4_scene2_side_by_side_boxes.jpg');
  await processVariant('B', 'public/assets/spotter/book4_scene2_diff_varb.jpg', 'b4_s2', 'public/assets/spotter/book4_scene2_side_by_side_boxes_varb.jpg');
  await processVariant('C', 'public/assets/spotter/book4_scene2_diff_varc.jpg', 'b4_s2', 'public/assets/spotter/book4_scene2_side_by_side_boxes_varc.jpg');
  await generateDynamicSimulatorPreview();
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { TARGETS, run };
