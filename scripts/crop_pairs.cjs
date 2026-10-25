const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function cropVisualVerification() {
  const baseFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_base_1792828395305.jpg';
  const diffFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_difference_1792828472957.jpg';
  const outDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/item_crops';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const items = [
    { name: 'grape', x: 0, y: 0, w: 260, h: 320 },
    { name: 'banana', x: 120, y: 340, w: 200, h: 260 },
    { name: 'apple', x: 0, y: 550, w: 280, h: 218 },
    { name: 'cat', x: 300, y: 350, w: 220, h: 160 },
    { name: 'dog', x: 800, y: 440, w: 220, h: 280 },
    { name: 'fish', x: 600, y: 580, w: 220, h: 188 },
    { name: 'elephant', x: 1100, y: 50, w: 276, h: 280 },
    { name: 'pumpkin', x: 1080, y: 420, w: 240, h: 220 }
  ];

  for (const it of items) {
    const leftCrop = await sharp(baseFile).extract({ left: it.x, top: it.y, width: it.w, height: it.h }).toBuffer();
    const rightCrop = await sharp(diffFile).extract({ left: it.x, top: it.y, width: it.w, height: it.h }).toBuffer();

    const pair = await sharp({
      create: {
        width: it.w * 2 + 10,
        height: it.h,
        channels: 3,
        background: { r: 15, g: 23, b: 42 }
      }
    })
    .composite([
      { input: leftCrop, top: 0, left: 0 },
      { input: rightCrop, top: 0, left: it.w + 10 }
    ])
    .jpeg()
    .toFile(path.join(outDir, `${it.name}_compare.jpg`));

    console.log(`Saved ${it.name}_compare.jpg`);
  }
}

cropVisualVerification().catch(console.error);
