const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 8 個目標幾何規格 (經過精密校準與零交疊驗證)
const TARGETS = [
  {
    word: 'cloud',
    wordZh: '白雲',
    x: 410,
    y: 100,
    rx: 110,
    ry: 65,
    typeZh: '天候景觀',
    descVarA: '藍天山巔白雲轉為前後兩層立體疊加白雲',
    descVarB: '藍天山巔白雲轉為夕陽暖金鑲邊彩霞白雲',
    descVarC: '藍天山巔白雲轉為愛心形狀綿密夢幻白雲'
  },
  {
    word: 'milk',
    wordZh: '牛奶',
    x: 124,
    y: 493,
    rx: 50,
    ry: 75,
    typeZh: '乳品包裝',
    descVarA: '左側木欄托盤玻璃牛奶瓶轉為瑞士高山藍白紙盒牛奶',
    descVarB: '左側木欄托盤轉為暖心馬克杯熱牛奶佐肉桂',
    descVarC: '左側木欄托盤轉為帶吸管玻璃隨行杯牛奶'
  },
  {
    word: 'tea',
    wordZh: '茶',
    x: 440,
    y: 584,
    rx: 75,
    ry: 58,
    typeZh: '茶品品項',
    descVarA: '野餐桌上琥珀紅茶壺組轉為翠綠高山薄荷綠茶杯',
    descVarB: '野餐桌上轉為鮮黃檸檬片冰紅茶杯',
    descVarC: '野餐桌上轉為陶瓷馬克杯佐茶包吊牌'
  },
  {
    word: 'sandwich',
    wordZh: '三明治',
    x: 648,
    y: 553,
    rx: 72,
    ry: 52,
    typeZh: '麵包餐點',
    descVarA: '木切板上雙層三明治轉為長棍法式潛艇三明治',
    descVarB: '木切板上轉為香酥金黃可頌三明治',
    descVarC: '木切板上轉為香烤芝麻貝果三明治'
  },
  {
    word: 'rice',
    wordZh: '飯糰',
    x: 820,
    y: 553,
    rx: 58,
    ry: 52,
    typeZh: '米飯主食',
    descVarA: '竹蓆上海苔三角飯糰轉為櫻花粉櫻花醃漬飯糰',
    descVarB: '竹蓆上轉為青花瓷碗裝熱騰騰白米飯',
    descVarC: '竹蓆上轉為烤香黃金醬油燒飯糰'
  },
  {
    word: 'watermelon',
    wordZh: '西瓜',
    x: 980,
    y: 625,
    rx: 90,
    ry: 80,
    typeZh: '當令水果',
    descVarA: '長凳白瓷盤上鮮紅切片西瓜轉為金黃小玉切片西瓜',
    descVarB: '長凳白瓷盤上轉為翠綠條紋完整小西瓜',
    descVarC: '長凳白瓷盤上轉為白瓷碗裝西瓜方塊佐薄荷葉'
  },
  {
    word: 'water',
    wordZh: '水壺',
    x: 1228,
    y: 468,
    rx: 48,
    ry: 80,
    typeZh: '飲水器皿',
    descVarA: '右側木欄玻璃冷水壺轉為亮銀高山金屬運動水壺',
    descVarB: '右側木欄轉為澄澈高腳氣泡水杯佐青檸',
    descVarC: '右側木欄轉為戶外透明刻度運動水瓶'
  },
  {
    word: 'orange',
    wordZh: '柳橙',
    x: 1240,
    y: 680,
    rx: 90,
    ry: 60,
    typeZh: '柑橘水果',
    descVarA: '露台木碗鮮橙轉為玻璃盤晶透柳橙切片輪盤',
    descVarB: '露台木碗轉為盛裝剝開飽滿橙肉果瓣',
    descVarC: '露台轉為竹編籃盛裝金黃大甜橙'
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
          <stop offset="95%" stop-color="#fff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#feather)" />
    </svg>
  `;
}

async function processVariant(variantKey, diffImagePath, labelText, strokeColor) {
  console.log(`\n=== Processing Variant ${variantKey.toUpperCase()} from ${diffImagePath} ===`);
  const patchDir = 'public/assets/spotter/patches/b3_s2';
  const cropDir = 'public/assets/spotter/crops/b3_s2';
  fs.mkdirSync(patchDir, { recursive: true });
  fs.mkdirSync(cropDir, { recursive: true });

  const baseBuf = fs.readFileSync('public/assets/spotter/book3_scene2_base.jpg');
  const diffBuf = fs.readFileSync(diffImagePath);

  for (const t of TARGETS) {
    const patchW = Math.round(t.rx * 2 + 30);
    const patchH = Math.round(t.ry * 2 + 30);
    const left = Math.max(0, Math.min(1376 - patchW, Math.round(t.x - patchW / 2)));
    const top = Math.max(0, Math.min(768 - patchH, Math.round(t.y - patchH / 2)));

    // 擷取局部圖像並轉為 RGBA raw 像素
    const patchCrop = await sharp(diffBuf)
      .extract({ left, top, width: patchW, height: patchH })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 羽化遮罩
    const maskSvg = Buffer.from(createFeatherMaskSvg(patchW, patchH, patchW / 2, patchH / 2));
    const maskRaw = await sharp(maskSvg).resize(patchW, patchH).toColourspace('b-w').raw().toBuffer();

    const pixels = patchCrop.data;
    for (let i = 0; i < maskRaw.length; i++) {
      pixels[i * 4 + 3] = Math.round((pixels[i * 4 + 3] * maskRaw[i]) / 255);
    }

    const patchFileName = `${t.word}_variant${variantKey.toUpperCase()}.png`;
    await sharp(pixels, { raw: { width: patchW, height: patchH, channels: 4 } })
      .png()
      .toFile(path.join(patchDir, patchFileName));

    // 高解析局部比對卡片
    const cardHalfW = 320;
    const cardH = 276;
    const cropLeft = Math.max(0, Math.min(1376 - cardHalfW, Math.round(t.x - cardHalfW / 2)));
    const cropTop = Math.max(0, Math.min(768 - cardH, Math.round(t.y - cardH / 2)));

    const baseCrop = await sharp(baseBuf).extract({ left: cropLeft, top: cropTop, width: cardHalfW, height: cardH }).toBuffer();
    const diffCrop = await sharp(diffBuf).extract({ left: cropLeft, top: cropTop, width: cardHalfW, height: cardH }).toBuffer();

    const labelSvg = `
      <svg width="650" height="276" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="320" height="276" fill="none" stroke="#38bdf8" stroke-width="4" />
        <rect x="330" y="0" width="320" height="276" fill="none" stroke="${strokeColor}" stroke-width="4" />
        <rect x="10" y="10" width="130" height="30" rx="8" fill="rgba(15,23,42,0.85)" />
        <text x="75" y="30" fill="#38bdf8" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle">左圖 BASE (型態A)</text>
        <rect x="340" y="10" width="140" height="30" rx="8" fill="rgba(15,23,42,0.85)" />
        <text x="410" y="30" fill="${strokeColor}" font-family="sans-serif" font-weight="900" font-size="13" text-anchor="middle">${labelText}</text>
      </svg>
    `;

    const compareFileName = variantKey === 'a' ? `${t.word}_compare.jpg` : `${t.word}_compare_var${variantKey.toUpperCase()}.jpg`;
    await sharp({ create: { width: 650, height: 276, channels: 3, background: { r: 15, g: 23, b: 42 } } })
      .composite([
        { input: baseCrop, left: 0, top: 0 },
        { input: diffCrop, left: 330, top: 0 },
        { input: Buffer.from(labelSvg), left: 0, top: 0 }
      ])
      .jpeg({ quality: 90 })
      .toFile(path.join(cropDir, compareFileName));
    console.log(`  ✓ Generated patch & card: ${t.word} (${variantKey.toUpperCase()})`);
  }

  // 生成全幅判定框驗證圖
  let ellipsesSvg = '<svg width="2752" height="768">';
  for (const t of TARGETS) {
    ellipsesSvg += `
      <g>
        <ellipse cx="${t.x}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" fill="none" stroke="#22c55e" stroke-width="3" stroke-dasharray="6,4" />
        <text x="${t.x}" y="${Math.max(20, t.y - t.ry - 8)}" text-anchor="middle" fill="#22c55e" font-size="16" font-weight="bold" font-family="sans-serif">${t.word.toUpperCase()} (${t.wordZh})</text>
        <ellipse cx="${t.x + 1376}" cy="${t.y}" rx="${t.rx}" ry="${t.ry}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-dasharray="6,4" />
        <text x="${t.x + 1376}" y="${Math.max(20, t.y - t.ry - 8)}" text-anchor="middle" fill="${strokeColor}" font-size="16" font-weight="bold" font-family="sans-serif">${t.word.toUpperCase()} (${t.wordZh})</text>
      </g>
    `;
  }
  ellipsesSvg += '</svg>';

  const boxesFileName = variantKey === 'a' ? 'book3_scene2_side_by_side_boxes.jpg' : `book3_scene2_side_by_side_boxes_var${variantKey.toLowerCase()}.jpg`;
  await sharp({ create: { width: 2752, height: 768, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite([
      { input: baseBuf, left: 0, top: 0 },
      { input: diffBuf, left: 1376, top: 0 },
      { input: Buffer.from(ellipsesSvg), left: 0, top: 0 }
    ])
    .jpeg({ quality: 88 })
    .toFile(path.join('public/assets/spotter', boxesFileName));
  console.log(`  ✓ Saved ${boxesFileName}`);
}

async function main() {
  await processVariant('a', 'public/assets/spotter/book3_scene2_diff.jpg', '右圖 VAR A (型態B)', '#4ade80');
  await processVariant('b', 'public/assets/spotter/book3_scene2_diff_varb.jpg', '右圖 VAR B (型態C)', '#fbbf24');
  await processVariant('c', 'public/assets/spotter/book3_scene2_diff_varc.jpg', '右圖 VAR C (型態D)', '#2dd4bf');

  // 動態 8 選 5 抽題模擬測試預覽圖
  console.log('\n=== Generating Dynamic 8-choose-5 Test Preview ===');
  const baseBuf = fs.readFileSync('public/assets/spotter/book3_scene2_base.jpg');
  const patchDir = 'public/assets/spotter/patches/b3_s2';
  const chosen5 = ['cloud', 'sandwich', 'milk', 'watermelon', 'orange'];
  const testCompLayers = [];
  for (const word of chosen5) {
    const t = TARGETS.find(x => x.word === word);
    const patchPath = path.join(patchDir, `${word}_variantA.png`);
    const patchW = Math.round(t.rx * 2 + 30);
    const patchH = Math.round(t.ry * 2 + 30);
    const left = Math.max(0, Math.min(1376 - patchW, Math.round(t.x - patchW / 2)));
    const top = Math.max(0, Math.min(768 - patchH, Math.round(t.y - patchH / 2)));
    testCompLayers.push({ input: fs.readFileSync(patchPath), left, top });
  }

  const dynamicDiffRight = await sharp(baseBuf).composite(testCompLayers).jpeg({ quality: 92 }).toBuffer();
  await sharp({ create: { width: 2752, height: 768, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite([
      { input: baseBuf, left: 0, top: 0 },
      { input: dynamicDiffRight, left: 1376, top: 0 }
    ])
    .jpeg({ quality: 88 })
    .toFile('public/assets/spotter/crops/b3_s2/dynamic_test_preview.jpg');
  console.log('  ✓ Saved dynamic 8-choose-5 test preview');
}

main().catch(console.error);
