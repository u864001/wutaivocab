const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function deployRev2() {
  const basePath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_base_v2_1792829379631.jpg';
  const diffPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_diff_v1_1792829455967.jpg';
  const brainDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';
  const publicDir = path.resolve('public/assets/spotter');

  const items = [
    { word: 'grape', wordZh: '葡萄', x: 250, y: 190, radiusX: 185, radiusY: 125, descZh: '左圖木藤架垂掛整排深紫巨峰葡萄，右圖轉為翠綠無籽葡萄串（已全域擴大包覆）' },
    { word: 'banana', wordZh: '香蕉', x: 160, y: 430, radiusX: 65, radiusY: 60, descZh: '左圖藤編吊籃放有一串熟黃香蕉，右圖吊籃空無一物' },
    { word: 'apple', wordZh: '蘋果', x: 185, y: 650, radiusX: 110, radiusY: 70, descZh: '左圖木箱與箱外掉落的青蘋果，右圖全數轉為鮮紅富士蘋果（已擴大包覆木箱與地面的蘋果）' },
    { word: 'cat', wordZh: '貓咪', x: 774, y: 423, radiusX: 55, radiusY: 45, descZh: '左圖石橋自行車旁趴著橘白花貓，右圖替換成純黑長尾貓咪' },
    { word: 'dog', wordZh: '狗狗', x: 464, y: 602, radiusX: 95, radiusY: 85, descZh: '左圖石板路坐著金黃柴犬，右圖轉為趴臥的斑點大麥町犬（已擴大判定圈，包覆柴犬與大麥町完整身軀）' },
    { word: 'fish', wordZh: '魚兒', x: 712, y: 662, radiusX: 52, radiusY: 42, descZh: '左圖運河游動金紅錦鯉，右圖替換成青藍色小魚' },
    { word: 'elephant', wordZh: '大象', x: 1117, y: 573, radiusX: 58, radiusY: 52, descZh: '左圖地面花園廣場水池為小象石雕噴泉，右圖替換為海豚石雕噴泉' },
    { word: 'pumpkin', wordZh: '南瓜', x: 1263, y: 500, radiusX: 42, radiusY: 36, descZh: '左圖農舍窗台放金黃大南瓜，右圖替換為笑臉萬聖南瓜燈' }
  ];

  const targetHeight = 768;
  const leftBuf = await sharp(basePath).resize({ height: targetHeight }).toBuffer();
  const rightBuf = await sharp(diffPath).resize({ height: targetHeight }).toBuffer();
  const meta = await sharp(leftBuf).metadata();

  const dividerWidth = 16;
  const totalWidth = meta.width * 2 + dividerWidth;
  const dividerSvg = `<svg width="${dividerWidth}" height="${targetHeight}">
    <rect width="${dividerWidth}" height="${targetHeight}" fill="#0f172a"/>
    <line x1="${dividerWidth/2}" y1="0" x2="${dividerWidth/2}" y2="${targetHeight}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>`;

  // Generate SVG overlays
  let svgElements = '';
  const colors = ['#f43f5e', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#eab308', '#14b8a6', '#ec4899'];
  items.forEach((item, idx) => {
    const rx = item.radiusX;
    const ry = item.radiusY;
    const color = colors[idx % colors.length];

    const labelY = Math.max(25, item.y - ry - 14);
    const rectY = Math.max(10, item.y - ry - 30);

    svgElements += `
      <!-- Target ${idx + 1}: ${item.word} -->
      <ellipse cx="${item.x}" cy="${item.y}" rx="${rx}" ry="${ry}" fill="${color}20" stroke="${color}" stroke-width="4" stroke-dasharray="8 4" />
      <circle cx="${item.x}" cy="${item.y}" r="6" fill="${color}" stroke="#ffffff" stroke-width="2" />
      <rect x="${item.x - 70}" y="${rectY}" width="140" height="24" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="2" />
      <text x="${item.x}" y="${labelY}" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">${item.word} (${item.wordZh})</text>
    `;
  });

  const svgOverlay = Buffer.from(`<svg width="${meta.width}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`);

  const overlayLeft = await sharp(leftBuf).composite([{ input: svgOverlay }]).toBuffer();
  const overlayRight = await sharp(rightBuf).composite([{ input: svgOverlay }]).toBuffer();

  const combinedBoxesPath = path.join(brainDir, 'book1_scene2_side_by_side_boxes_v2.jpg');
  await sharp({
    create: { width: totalWidth, height: targetHeight, channels: 3, background: { r: 15, g: 23, b: 42 } }
  })
  .composite([
    { input: overlayLeft, top: 0, left: 0 },
    { input: Buffer.from(dividerSvg), top: 0, left: meta.width },
    { input: overlayRight, top: 0, left: meta.width + dividerWidth }
  ])
  .jpeg({ quality: 92 })
  .toFile(combinedBoxesPath);

  console.log('Saved combined boxes at:', combinedBoxesPath);

  // Deploy to public
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(basePath, path.join(publicDir, 'book1_scene2_base.jpg'));
  fs.copyFileSync(diffPath, path.join(publicDir, 'book1_scene2_diff.jpg'));
  fs.copyFileSync(combinedBoxesPath, path.join(publicDir, 'book1_scene2_side_by_side_boxes.jpg'));

  console.log('Successfully re-deployed enlarged dog and apple boxes!');
}

deployRev2().catch(console.error);
