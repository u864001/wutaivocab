const sharp = require('sharp');
const path = require('path');

async function makeSideBySide() {
  const basePath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_base_v2_1792829379631.jpg';
  const dynamicPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/scratch/test_dynamic_5_of_8.jpg';
  const outPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/dynamic_prototype_side_by_side.jpg';

  const w = 1376;
  const h = 768;
  const divW = 16;
  const dividerSvg = `<svg width="${divW}" height="${h}"><rect width="${divW}" height="${h}" fill="#0f172a"/><line x1="${divW/2}" y1="0" x2="${divW/2}" y2="${h}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,6"/></svg>`;

  const leftBuf = await sharp(basePath).resize({ height: h }).toBuffer();
  const rightBuf = await sharp(dynamicPath).resize({ height: h }).toBuffer();

  await sharp({
    create: { width: w * 2 + divW, height: h, channels: 3, background: { r: 15, g: 23, b: 42 } }
  })
  .composite([
    { input: leftBuf, top: 0, left: 0 },
    { input: Buffer.from(dividerSvg), top: 0, left: w },
    { input: rightBuf, top: 0, left: w + divW }
  ])
  .jpeg({ quality: 92 })
  .toFile(outPath);

  console.log('Created dynamic prototype side-by-side at:', outPath);
}
makeSideBySide().catch(console.error);
