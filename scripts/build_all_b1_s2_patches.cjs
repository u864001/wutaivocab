const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildPatches() {
  const diffPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_diff_v1_1792829455967.jpg';
  const outDir = path.resolve('public/assets/spotter/patches/b1_s2');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const items = [
    { word: 'grape', slot: { x: 50, y: 50, w: 450, h: 320, rx: 20 } },
    { word: 'banana', slot: { x: 95, y: 370, w: 130, h: 140, rx: 16 } },
    { word: 'apple', slot: { x: 40, y: 580, w: 240, h: 170, rx: 16 } },
    { word: 'cat', slot: { x: 710, y: 380, w: 130, h: 100, rx: 14 } },
    { word: 'dog', slot: { x: 345, y: 475, w: 245, h: 235, rx: 20 } },
    { word: 'fish', slot: { x: 620, y: 640, w: 150, h: 90, rx: 16 } },
    { word: 'elephant', slot: { x: 1040, y: 525, w: 160, h: 130, rx: 16 } },
    { word: 'pumpkin', slot: { x: 1210, y: 455, w: 110, h: 95, rx: 14 } }
  ];

  for (const it of items) {
    const s = it.slot;
    const diffCrop = await sharp(diffPath).extract({ left: s.x, top: s.y, width: s.w, height: s.h }).toBuffer();
    const maskSvg = `<svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="feather" cx="50%" cy="50%" r="50%">
          <stop offset="80%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="98%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${s.w}" height="${s.h}" rx="${s.rx || 14}" fill="url(#feather)"/>
    </svg>`;

    const patchOut = path.join(outDir, `${it.word}_variantA.png`);
    await sharp(diffCrop)
      .ensureAlpha()
      .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
      .png()
      .toFile(patchOut);

    console.log(`Saved patch: ${patchOut}`);
  }

  console.log('All Book 1 Scene 2 Variant A patches built successfully!');
}

buildPatches().catch(console.error);
