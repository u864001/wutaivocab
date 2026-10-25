const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testSlotPatches() {
  const basePath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_base_v2_1792829379631.jpg';
  const diffPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_diff_v1_1792829455967.jpg';
  const outDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/scratch';

  // Let's test 4 distinct slot cutouts from diff:
  // 1. Apple crate (covers the whole crate + loose apple): left: 40, top: 580, w: 230, h: 170
  // 2. Banana basket (covers the hanging basket): left: 95, top: 380, w: 130, h: 140
  // 3. Cat on railing: left: 720, top: 400, w: 120, h: 90
  // 4. Pumpkin on windowsill: left: 1210, top: 460, w: 110, h: 90
  // 5. Fountain pool: left: 1050, top: 540, w: 140, h: 110
  // 6. Fish in canal: left: 660, top: 640, w: 100, h: 70

  const slots = [
    { name: 'apple_crate', x: 40, y: 580, w: 230, h: 170 },
    { name: 'banana_basket', x: 95, y: 380, w: 130, h: 140 },
    { name: 'cat_railing', x: 720, y: 400, w: 120, h: 90 },
    { name: 'pumpkin_window', x: 1210, y: 460, w: 110, h: 90 },
    { name: 'fountain_pool', x: 1050, y: 540, w: 140, h: 110 },
    { name: 'fish_canal', x: 660, y: 640, w: 100, h: 70 }
  ];

  const composites = [];

  for (const s of slots) {
    // Cut exact slot from diff
    const diffCrop = await sharp(diffPath).extract({ left: s.x, top: s.y, width: s.w, height: s.h }).toBuffer();

    // Create feathered mask for this slot
    const maskSvg = `<svg width="${s.w}" height="${s.h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="feather" cx="50%" cy="50%" r="50%">
          <stop offset="80%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="98%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${s.w}" height="${s.h}" rx="12" fill="url(#feather)"/>
    </svg>`;

    const patchBuf = await sharp(diffCrop)
      .ensureAlpha()
      .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
      .png()
      .toBuffer();

    await sharp(patchBuf).toFile(path.join(outDir, `patch_${s.name}.png`));
    composites.push({ input: patchBuf, left: s.x, top: s.y });
  }

  // Stamp these 6 patches onto the Base image!
  await sharp(basePath)
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, 'test_dynamic_5_of_8.jpg'));

  console.log('Successfully stamped slots onto base!');
}

testSlotPatches().catch(console.error);
