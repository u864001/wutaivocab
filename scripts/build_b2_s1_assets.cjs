const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

sharp.cache(false);

const TARGET_ITEMS = [
  {
    word: 'heart',
    wordZh: '愛心',
    x: 190,
    y: 243,
    rx: 110,
    ry: 142,
    rotate: 10,
    patchRect: { left: 45, top: 75, width: 275, height: 335, pad: 18 },
    typeZh: '愛心氣球',
    descZh: '左側紫藤花架上為粉紅愛心氣球，右圖變異依序為暖金愛心/深紅絲絨愛心/夢幻薰衣草紫愛心'
  },
  {
    word: 'cat',
    wordZh: '貓咪',
    x: 270,
    y: 615,
    rx: 105,
    ry: 60,
    typeZh: '貓咪毛色',
    descZh: '左側休閒椅上為熟睡三花貓，右圖變異依序為暖橘虎斑貓/黑白燕尾服貓/純白波斯貓'
  },
  {
    word: 'dog',
    wordZh: '小狗',
    x: 410,
    y: 480,
    rx: 78,
    ry: 92,
    typeZh: '狗狗品種',
    descZh: '草坪上為金毛幼犬，右圖變異依序為柯基幼犬/黑斑大麥町犬/純白比熊犬'
  },
  {
    word: 'fish',
    wordZh: '魚',
    x: 684,
    y: 508,
    rx: 150,
    ry: 52,
    typeZh: '魚類品種',
    descZh: '噴泉水池中為紅白錦鯉與金魚，右圖變異依序為湖水藍鬥魚/紅劍旗魚/藍色霓虹魚'
  },
  {
    word: 'card',
    wordZh: '卡片',
    x: 948,
    y: 612,
    rx: 65,
    ry: 95,
    typeZh: '立體卡片',
    descZh: '大理石圓桌上為花卉祝賀卡，右圖變異依序為生日蛋糕立體卡/蝴蝶花紋卡/玫瑰愛心立體卡'
  },
  {
    word: 'gift',
    wordZh: '禮物',
    x: 1150,
    y: 430,
    rx: 78,
    ry: 85,
    typeZh: '禮盒緞帶',
    descZh: '長凳上為水藍緞帶米色禮盒，右圖變異依序為酒紅金帶禮盒/粉紫淡粉帶禮盒/翡翠綠銀帶禮盒'
  },
  {
    word: 'flower',
    wordZh: '花朵',
    x: 1270,
    y: 630,
    rx: 105,
    ry: 125,
    typeZh: '花卉盆栽',
    descZh: '陶盆中為粉紅康乃馨與向日葵，右圖變異依序為薰衣草與小雛菊/橘萬壽菊與藍繡球/深紅玫瑰花束'
  },
  {
    word: 'bird',
    wordZh: '小鳥',
    x: 1265,
    y: 120,
    rx: 70,
    ry: 50,
    typeZh: '鳥類羽色',
    descZh: '橄欖枝頭上為黃腹藍翅鳴鳥，右圖變異依序為鮮紅北美紅雀/翠綠蜂鳥/金黃絲雀'
  }
];

const VARIANTS = [
  { key: 'A', suffix: '', rawFile: 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/book2_diff_1793076542627.jpg', diffFile: 'public/assets/spotter/book2_diff.jpg', sbsFile: 'public/assets/spotter/book2_side_by_side_boxes.jpg' },
  { key: 'B', suffix: '_varb', rawFile: 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/book2_diff_varb_1793076560754.jpg', diffFile: 'public/assets/spotter/book2_diff_varb.jpg', sbsFile: 'public/assets/spotter/book2_side_by_side_boxes_varb.jpg' },
  { key: 'C', suffix: '_varc', rawFile: 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/book2_diff_varc_1793076584179.jpg', diffFile: 'public/assets/spotter/book2_diff_varc.jpg', sbsFile: 'public/assets/spotter/book2_side_by_side_boxes_varc.jpg' }
];

async function generateAssets() {
  const patchDir = 'public/assets/spotter/patches/b2_s1';
  const cropDir = 'public/assets/spotter/crops/b2_s1';
  fs.mkdirSync(patchDir, { recursive: true });
  fs.mkdirSync(cropDir, { recursive: true });

  const baseBuf = fs.readFileSync('public/assets/spotter/book2_base.jpg');
  const baseMeta = await sharp(baseBuf).metadata();
  console.log(`Base image size: ${baseMeta.width}x${baseMeta.height}`);

  for (const v of VARIANTS) {
    console.log(`\n========================================`);
    console.log(`Processing Variant ${v.key} (${v.rawFile})...`);
    console.log(`========================================`);

    const rawBuf = fs.readFileSync(v.rawFile);
    const diffMeta = await sharp(rawBuf).metadata();
    console.log(`Diff ${v.key} raw size: ${diffMeta.width}x${diffMeta.height}`);

    const patchComposites = [];

    for (const item of TARGET_ITEMS) {
      let patchW, patchH, left, top, maskBuf;

      if (item.patchRect) {
        // Custom wide rectangular feathered mask (e.g. for heart balloon to ensure 100% variant coverage)
        left = item.patchRect.left;
        top = item.patchRect.top;
        patchW = item.patchRect.width;
        patchH = item.patchRect.height;
        const pad = item.patchRect.pad || 16;

        maskBuf = Buffer.alloc(patchW * patchH);
        for (let y = 0; y < patchH; y++) {
          for (let x = 0; x < patchW; x++) {
            const dL = x;
            const dR = patchW - 1 - x;
            const dT = y;
            const dB = patchH - 1 - y;
            const fX = Math.min(1.0, Math.min(dL, dR) / pad);
            const fY = Math.min(1.0, Math.min(dT, dB) / pad);
            maskBuf[y * patchW + x] = Math.round(255 * fX * fY);
          }
        }
      } else {
        // Standard ellipse feathered mask
        const halfW = Math.ceil(item.rx) + 20;
        const halfH = Math.ceil(item.ry) + 20;
        patchW = halfW * 2;
        patchH = halfH * 2;

        left = Math.max(0, Math.min(baseMeta.width - patchW, Math.round(item.x - halfW)));
        top = Math.max(0, Math.min(baseMeta.height - patchH, Math.round(item.y - halfH)));

        maskBuf = Buffer.alloc(patchW * patchH);
        const cx = item.x - left;
        const cy = item.y - top;
        const innerRx = item.rx * 0.90;
        const innerRy = item.ry * 0.90;
        const outerRx = item.rx * 1.08;
        const outerRy = item.ry * 1.08;

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
      }

      // Extract piece from raw AI diff image buffer
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

      const patchPngName = `${item.word}${v.suffix}.png`;
      const patchPngPath = path.join(patchDir, patchPngName);
      await sharp(rgbaBuf, {
        raw: { width: patchW, height: patchH, channels: 4 }
      }).png().toFile(patchPngPath);

      patchComposites.push({
        input: patchPngPath,
        left,
        top
      });

      // Side-by-side comparison crop for UI hint
      const cropW = Math.min(320, patchW);
      const cropH = Math.min(320, patchH);
      const cropLeft = Math.max(0, Math.min(baseMeta.width - cropW, Math.round(item.x - cropW / 2)));
      const cropTop = Math.max(0, Math.min(baseMeta.height - cropH, Math.round(item.y - cropH / 2)));

      const baseCrop = await sharp(baseBuf)
        .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
        .jpeg({ quality: 90 })
        .toBuffer();

      const diffCrop = await sharp(rawBuf)
        .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
        .jpeg({ quality: 90 })
        .toBuffer();

      const sbsCropPath = path.join(cropDir, `${item.word}_compare${v.suffix}.jpg`);
      await sharp({
        create: {
          width: cropW * 2 + 10,
          height: cropH,
          channels: 3,
          background: { r: 30, g: 30, b: 35 }
        }
      })
      .composite([
        { input: baseCrop, left: 0, top: 0 },
        { input: diffCrop, left: cropW + 10, top: 0 }
      ])
      .jpeg({ quality: 90 })
      .toFile(sbsCropPath);

      console.log(`  ✓ Generated patch & crop for: ${item.word} (${item.wordZh})`);
    }

    // Reconstruct pure Method A diff image by applying feathered patches to pristine base
    console.log(`Reconstructing pure Method A diff image: ${v.diffFile}...`);
    const finalDiffBuf = await sharp(baseBuf)
      .composite(patchComposites)
      .jpeg({ quality: 92 })
      .toBuffer();

    fs.writeFileSync(v.diffFile, finalDiffBuf);
    console.log(`  ✓ Saved pure Method A diff image to: ${v.diffFile}`);

    // Generate Side-by-Side review image with boxes
    console.log(`Generating Side-by-Side boxes preview: ${v.sbsFile}...`);
    let svgBoxes = `<svg width="${baseMeta.width}" height="${baseMeta.height}" xmlns="http://www.w3.org/2000/svg">`;
    TARGET_ITEMS.forEach(it => {
      const transform = it.rotate ? `transform="rotate(${it.rotate} ${it.x} ${it.y})"` : '';
      svgBoxes += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}" ${transform} fill="none" stroke="#00ff66" stroke-width="3" stroke-dasharray="6,4"/>`;
      svgBoxes += `<rect x="${it.x - 55}" y="${Math.max(10, it.y - it.ry - 26)}" width="110" height="22" fill="rgba(0,0,0,0.85)" rx="5"/>`;
      svgBoxes += `<text x="${it.x}" y="${Math.max(10, it.y - it.ry - 26) + 16}" fill="#00ff66" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">${it.word} (${it.wordZh})</text>`;
    });
    svgBoxes += `</svg>`;

    const boxedBase = await sharp(baseBuf)
      .composite([{ input: Buffer.from(svgBoxes), left: 0, top: 0 }])
      .jpeg({ quality: 90 })
      .toBuffer();

    const boxedDiff = await sharp(finalDiffBuf)
      .composite([{ input: Buffer.from(svgBoxes), left: 0, top: 0 }])
      .jpeg({ quality: 90 })
      .toBuffer();

    const sbsFullBuf = await sharp({
      create: {
        width: baseMeta.width * 2 + 10,
        height: baseMeta.height,
        channels: 3,
        background: { r: 20, g: 20, b: 24 }
      }
    })
    .composite([
      { input: boxedBase, left: 0, top: 0 },
      { input: boxedDiff, left: baseMeta.width + 10, top: 0 }
    ])
    .jpeg({ quality: 88 })
    .toBuffer();

    fs.writeFileSync(v.sbsFile, sbsFullBuf);
    console.log(`  ✓ Saved Side-by-Side preview: ${v.sbsFile}`);

    // Also copy to brain artifact directory for Mark review
    const artSbsPath = path.join('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3', path.basename(v.sbsFile));
    fs.writeFileSync(artSbsPath, sbsFullBuf);
  }

  console.log('\nAll assets generated successfully!');
}

generateAssets().catch(console.error);
