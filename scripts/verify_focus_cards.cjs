const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';

const ITEMS = [
  { word: 'metro', wordZh: '捷運列車', x: 423, y: 185, rx: 258, ry: 40, rotate: 4.8 },
  { word: 'taxi', wordZh: '計程車', x: 650, y: 405, rx: 75, ry: 45 },
  { word: 'car', wordZh: '汽車', x: 940, y: 440, rx: 88, ry: 72 },
  { word: 'scooter', wordZh: '機車', x: 1205, y: 460, rx: 68, ry: 60 },
  { word: 'bike', wordZh: '自行車', x: 560, y: 550, rx: 70, ry: 78 },
  { word: 'ticket', wordZh: '車票', x: 350, y: 470, rx: 24, ry: 22 },
  { word: 'sandwich', wordZh: '三明治', x: 250, y: 655, rx: 46, ry: 30 },
  { word: 'soda', wordZh: '蘇打汽水', x: 340, y: 585, rx: 28, ry: 64 }
];

async function generateVisualVerifications() {
  const baseImg = sharp('public/assets/spotter/book7_scene2_base.jpg');
  const baseMeta = await baseImg.metadata();
  const width = baseMeta.width;
  const height = baseMeta.height;

  // 1. Clean side-by-side (boxes ONLY, NO TEXT labels obstructing the view!)
  let cleanBaseSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  let cleanDiffSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  ITEMS.forEach(it => {
    const rotAttr = it.rotate ? ` transform="rotate(${it.rotate} ${it.x} ${it.y})"` : '';
    cleanBaseSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}"${rotAttr} fill="none" stroke="#00ff66" stroke-width="2.5" stroke-dasharray="6,4" />`;
    cleanDiffSvg += `<ellipse cx="${it.x}" cy="${it.y}" rx="${it.rx}" ry="${it.ry}"${rotAttr} fill="none" stroke="#f43f5e" stroke-width="2.5" />`;
  });

  cleanBaseSvg += `
    <rect x="20" y="20" width="220" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="130" y="46" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">BASE (NO LABELS)</text>
  </svg>`;

  cleanDiffSvg += `
    <rect x="20" y="20" width="220" height="40" fill="rgba(0,0,0,0.7)" rx="8" />
    <text x="130" y="46" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f43f5e" text-anchor="middle">VARIANT A (NO LABELS)</text>
  </svg>`;

  const cleanBaseLabeled = await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .composite([{ input: Buffer.from(cleanBaseSvg), top: 0, left: 0 }])
    .toBuffer();

  const cleanDiffLabeled = await sharp('public/assets/spotter/book7_scene2_diff.jpg')
    .composite([{ input: Buffer.from(cleanDiffSvg), top: 0, left: 0 }])
    .toBuffer();

  const cleanOutPublic = 'public/assets/spotter/book7_scene2_clean_boxes.jpg';
  const cleanOutArtifact = path.join(ARTIFACT_DIR, 'book7_scene2_clean_boxes.jpg');

  await sharp({
    create: {
      width: width * 2 + 20,
      height: height,
      channels: 3,
      background: '#0a0f1d'
    }
  })
    .composite([
      { input: cleanBaseLabeled, left: 0, top: 0 },
      { input: cleanDiffLabeled, left: width + 20, top: 0 }
    ])
    .jpeg({ quality: 92 })
    .toFile(cleanOutPublic);

  fs.copyFileSync(cleanOutPublic, cleanOutArtifact);
  console.log('✓ Clean boxes side-by-side saved!');

  // 2. Focused 3-target verification card (Car, Soda+Sandwich, Bike)
  // Let's create a combined 3-panel comparison image
  // Panel 1: Car (left: 820, top: 340, w: 240, h: 200)
  // Panel 2: Soda + Sandwich (left: 180, top: 490, w: 220, h: 210)
  // Panel 3: Bike (left: 470, top: 450, w: 180, h: 200)

  async function makeFocusCard(name, title, left, top, w, h, boxItems) {
    const bCrop = await sharp('public/assets/spotter/book7_scene2_base.jpg')
      .extract({ left, top, width: w, height: h })
      .toBuffer();
    const dCrop = await sharp('public/assets/spotter/book7_scene2_diff.jpg')
      .extract({ left, top, width: w, height: h })
      .toBuffer();

    let svgB = `<svg width="${w}" height="${h}">`;
    let svgD = `<svg width="${w}" height="${h}">`;
    boxItems.forEach(bi => {
      const cx = bi.x - left;
      const cy = bi.y - top;
      svgB += `<ellipse cx="${cx}" cy="${cy}" rx="${bi.rx}" ry="${bi.ry}" fill="none" stroke="#00ff66" stroke-width="2.5" stroke-dasharray="5,3" />`;
      svgB += `<text x="${cx}" y="${Math.max(16, cy - bi.ry - 6)}" fill="#00ff66" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">${bi.word}</text>`;

      svgD += `<ellipse cx="${cx}" cy="${cy}" rx="${bi.rx}" ry="${bi.ry}" fill="none" stroke="#f43f5e" stroke-width="2.5" />`;
      svgD += `<text x="${cx}" y="${Math.max(16, cy - bi.ry - 6)}" fill="#f43f5e" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">${bi.word}</text>`;
    });
    svgB += '</svg>';
    svgD += '</svg>';

    const bWithBox = await sharp(bCrop).composite([{ input: Buffer.from(svgB) }]).toBuffer();
    const dWithBox = await sharp(dCrop).composite([{ input: Buffer.from(svgD) }]).toBuffer();

    const cardTotalW = w * 2 + 30;
    const cardTotalH = h + 50;

    const headerSvg = `
      <svg width="${cardTotalW}" height="${cardTotalH}">
        <rect width="${cardTotalW}" height="${cardTotalH}" fill="#0f172a" rx="10" />
        <text x="20" y="30" fill="#38bdf8" font-size="16" font-weight="bold" font-family="sans-serif">${title} • BASE</text>
        <text x="${w + 35}" y="30" fill="#f43f5e" font-size="16" font-weight="bold" font-family="sans-serif">${title} • VARIANT A</text>
      </svg>
    `;

    const outPath = path.join(ARTIFACT_DIR, `focus_${name}.jpg`);
    await sharp({
      create: { width: cardTotalW, height: cardTotalH, channels: 3, background: '#0f172a' }
    }).composite([
      { input: Buffer.from(headerSvg), left: 0, top: 0 },
      { input: bWithBox, left: 10, top: 40 },
      { input: dWithBox, left: w + 20, top: 40 }
    ]).jpeg({ quality: 92 }).toFile(outPath);

    console.log(`✓ Saved focus card: ${outPath}`);
  }

  // Car focus
  const carItem = ITEMS.find(x => x.word === 'car');
  await makeFocusCard('car', '汽車 (CAR) - 含括車頂', 830, 350, 220, 180, [carItem]);

  // Soda + Sandwich focus
  const sodaItem = ITEMS.find(x => x.word === 'soda');
  const swItem = ITEMS.find(x => x.word === 'sandwich');
  await makeFocusCard('soda_sandwich', '汽水 (SODA) 與 三明治 (SANDWICH) - 整瓶含括且零重疊', 190, 500, 210, 195, [sodaItem, swItem]);

  // Bike focus
  const bikeItem = ITEMS.find(x => x.word === 'bike');
  await makeFocusCard('bike', '自行車 (BIKE) - 含括手把與車籃', 470, 455, 180, 195, [bikeItem]);
}

generateVisualVerifications().catch(console.error);
