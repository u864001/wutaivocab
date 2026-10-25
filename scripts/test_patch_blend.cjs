const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testPatchBlend() {
  const basePath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_base_v2_1792829379631.jpg';
  const diffPath = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_canal_market_diff_v1_1792829455967.jpg';
  const outDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/scratch';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Let's test cutting out the Dalmatian dog (center: 464, 602, rx: 95, ry: 85)
  // Left: 360, Top: 500, W: 210, H: 200
  const cropX = 360;
  const cropY = 500;
  const cropW = 210;
  const cropH = 200;

  // Extract from diff
  const diffCrop = await sharp(diffPath).extract({ left: cropX, top: cropY, width: cropW, height: cropH }).toBuffer();

  // Create an elliptical feathered alpha mask
  // Inside the ellipse: 255 (opaque), smooth fade at edge
  const maskSvg = `<svg width="${cropW}" height="${cropH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="feather" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="70%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="98%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="${cropW/2}" cy="${cropH/2}" rx="${cropW/2 - 4}" ry="${cropH/2 - 4}" fill="url(#feather)"/>
  </svg>`;

  const maskBuf = await sharp(Buffer.from(maskSvg)).toBuffer();

  // Apply mask to diff crop to create a feathered PNG patch
  const patchPng = await sharp(diffCrop)
    .ensureAlpha()
    .composite([{ input: maskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(patchPng).toFile(path.join(outDir, 'test_dog_patch.png'));
  console.log('Saved test_dog_patch.png');

  // Now stamp this patch back onto the BASE image at cropX, cropY!
  const stampedBase = await sharp(basePath)
    .composite([{ input: patchPng, left: cropX, top: cropY }])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, 'test_stamped_base.jpg'));

  console.log('Saved test_stamped_base.jpg');
}

testPatchBlend().catch(console.error);
