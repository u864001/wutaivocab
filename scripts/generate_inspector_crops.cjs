const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateCrops() {
  // 1. Book 1 Scene 2 (Amsterdam Revision 2)
  const b1s2Base = path.resolve('public/assets/spotter/book1_scene2_base.jpg');
  const b1s2Diff = path.resolve('public/assets/spotter/book1_scene2_diff.jpg');
  const outDirB1S2 = path.resolve('public/assets/spotter/crops/b1_s2');
  if (!fs.existsSync(outDirB1S2)) fs.mkdirSync(outDirB1S2, { recursive: true });

  const b1s2Items = [
    { word: 'grape', wordZh: '葡萄', x: 250, y: 190, rx: 185, ry: 125, crop: { left: 40, top: 40, width: 450, height: 310 } },
    { word: 'banana', wordZh: '香蕉', x: 160, y: 430, rx: 65, ry: 60, crop: { left: 80, top: 350, width: 170, height: 160 } },
    { word: 'apple', wordZh: '蘋果', x: 185, y: 650, rx: 110, ry: 70, crop: { left: 40, top: 560, width: 260, height: 190 } },
    { word: 'cat', wordZh: '貓咪', x: 774, y: 423, rx: 55, ry: 45, crop: { left: 690, top: 360, width: 170, height: 130 } },
    { word: 'dog', wordZh: '狗狗', x: 464, y: 602, rx: 95, ry: 85, crop: { left: 340, top: 480, width: 250, height: 230 } },
    { word: 'fish', wordZh: '魚兒', x: 712, y: 662, rx: 52, ry: 42, crop: { left: 630, top: 600, width: 170, height: 130 } },
    { word: 'elephant', wordZh: '大象', x: 1117, y: 573, rx: 58, ry: 52, crop: { left: 1030, top: 500, width: 180, height: 150 } },
    { word: 'pumpkin', wordZh: '南瓜', x: 1263, y: 500, rx: 42, ry: 36, crop: { left: 1190, top: 440, width: 150, height: 130 } }
  ];

  for (const item of b1s2Items) {
    const c = item.crop;
    // ensure within image bounds 1376 x 768
    const left = Math.max(0, Math.min(1376 - c.width, c.left));
    const top = Math.max(0, Math.min(768 - c.height, c.top));
    const width = Math.min(1376 - left, c.width);
    const height = Math.min(768 - top, c.height);

    const baseCrop = await sharp(b1s2Base).extract({ left, top, width, height }).resize({ width: 320, height: 240, fit: 'cover' }).toBuffer();
    const diffCrop = await sharp(b1s2Diff).extract({ left, top, width, height }).resize({ width: 320, height: 240, fit: 'cover' }).toBuffer();

    const bannerH = 36;
    const totalW = 650;
    const totalH = 240 + bannerH;

    const bannerSvg = `<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${totalW}" height="${totalH}" fill="#0f172a"/>
      <rect x="0" y="0" width="${totalW}" height="${bannerH}" fill="#1e293b"/>
      <text x="160" y="24" fill="#38bdf8" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">原圖基準 (Base)</text>
      <text x="490" y="24" fill="#f43f5e" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">變異 A (Variant A)</text>
      <line x1="325" y1="0" x2="325" y2="${totalH}" stroke="#334155" stroke-width="2"/>
    </svg>`;

    const stitched = await sharp(Buffer.from(bannerSvg))
      .composite([
        { input: baseCrop, left: 3, top: bannerH },
        { input: diffCrop, left: 327, top: bannerH }
      ])
      .jpeg({ quality: 92 })
      .toBuffer();

    const outFile = path.join(outDirB1S2, `${item.word}_compare.jpg`);
    fs.writeFileSync(outFile, stitched);
    console.log(`Generated crop compare for B1S2: ${item.word}`);
  }

  // 2. Book 1 Scene 1 (Classroom)
  const b1s1Base = path.resolve('public/assets/spotter/book1_base.jpg');
  const b1s1Diff = path.resolve('public/assets/spotter/book1_diff.jpg');
  const outDirB1S1 = path.resolve('public/assets/spotter/crops/b1_s1');
  if (!fs.existsSync(outDirB1S1)) fs.mkdirSync(outDirB1S1, { recursive: true });

  const b1s1Items = [
    { word: 'bag', wordZh: '書包', crop: { left: 140, top: 150, width: 180, height: 180 } },
    { word: 'pencil', wordZh: '鉛筆', crop: { left: 110, top: 520, width: 230, height: 150 } },
    { word: 'eraser', wordZh: '橡皮擦', crop: { left: 240, top: 360, width: 140, height: 120 } },
    { word: 'book', wordZh: '書本', crop: { left: 480, top: 160, width: 230, height: 160 } },
    { word: 'ruler', wordZh: '直尺', crop: { left: 520, top: 480, width: 290, height: 120 } },
    { word: 'pen', wordZh: '原子筆', crop: { left: 880, top: 400, width: 200, height: 110 } },
    { word: 'pencil case', wordZh: '鉛筆盒', crop: { left: 1070, top: 540, width: 210, height: 130 } },
    { word: 'marker', wordZh: '彩色筆', crop: { left: 1130, top: 350, width: 170, height: 120 } }
  ];

  for (const item of b1s1Items) {
    const c = item.crop;
    const left = Math.max(0, Math.min(1376 - c.width, c.left));
    const top = Math.max(0, Math.min(768 - c.height, c.top));
    const width = Math.min(1376 - left, c.width);
    const height = Math.min(768 - top, c.height);

    const baseCrop = await sharp(b1s1Base).extract({ left, top, width, height }).resize({ width: 320, height: 240, fit: 'cover' }).toBuffer();
    const diffCrop = await sharp(b1s1Diff).extract({ left, top, width, height }).resize({ width: 320, height: 240, fit: 'cover' }).toBuffer();

    const bannerH = 36;
    const totalW = 650;
    const totalH = 240 + bannerH;

    const bannerSvg = `<svg width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${totalW}" height="${totalH}" fill="#0f172a"/>
      <rect x="0" y="0" width="${totalW}" height="${bannerH}" fill="#1e293b"/>
      <text x="160" y="24" fill="#38bdf8" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">原圖基準 (Base)</text>
      <text x="490" y="24" fill="#f43f5e" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">變異圖 (Diff)</text>
      <line x1="325" y1="0" x2="325" y2="${totalH}" stroke="#334155" stroke-width="2"/>
    </svg>`;

    const stitched = await sharp(Buffer.from(bannerSvg))
      .composite([
        { input: baseCrop, left: 3, top: bannerH },
        { input: diffCrop, left: 327, top: bannerH }
      ])
      .jpeg({ quality: 92 })
      .toBuffer();

    const safeName = item.word.replace(/\s+/g, '_');
    const outFile = path.join(outDirB1S1, `${safeName}_compare.jpg`);
    fs.writeFileSync(outFile, stitched);
    console.log(`Generated crop compare for B1S1: ${item.word}`);
  }

  console.log('All crops generated successfully!');
}

generateCrops().catch(console.error);
