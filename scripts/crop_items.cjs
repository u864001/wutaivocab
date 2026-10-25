const sharp = require('sharp');
const path = require('path');

async function inspectCrops() {
  const baseFile = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/amsterdam_market_base_1792828395305.jpg';
  const outDir = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/crops';
  const fs = require('fs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Let's inspect candidate bounding boxes on base
  // 1. Grapes (top left): x: 0-250, y: 0-300
  await sharp(baseFile).extract({ left: 0, top: 0, width: 250, height: 300 }).toFile(path.join(outDir, 'crop_grapes.jpg'));

  // 2. Bananas (mid left): x: 50-250, y: 350-300
  await sharp(baseFile).extract({ left: 50, top: 350, width: 200, height: 250 }).toFile(path.join(outDir, 'crop_bananas.jpg'));

  // 3. Apples (bottom left): x: 0-250, y: 550-218
  await sharp(baseFile).extract({ left: 0, top: 550, width: 250, height: 218 }).toFile(path.join(outDir, 'crop_apples.jpg'));

  // 4. Cat & Bridge: x: 250-200, y: 380-180
  await sharp(baseFile).extract({ left: 250, top: 380, width: 200, height: 180 }).toFile(path.join(outDir, 'crop_cat.jpg'));

  // 5. Fish (canal bottom): x: 250-200, y: 600-168
  await sharp(baseFile).extract({ left: 250, top: 600, width: 200, height: 168 }).toFile(path.join(outDir, 'crop_fish.jpg'));

  // 6. Dog (cobblestone): x: 380-180, y: 500-240
  await sharp(baseFile).extract({ left: 380, top: 500, width: 180, height: 240 }).toFile(path.join(outDir, 'crop_dog.jpg'));

  // 7. Elephant / Fountain: let's find where the fountain is:
  // Is it around x: 500-750, y: 50-350?
  await sharp(baseFile).extract({ left: 500, top: 50, width: 250, height: 300 }).toFile(path.join(outDir, 'crop_fountain.jpg'));

  // 8. Pumpkin: let's find where the pumpkin is:
  // Is it around x: 500-750, y: 450-300?
  await sharp(baseFile).extract({ left: 500, top: 450, width: 250, height: 300 }).toFile(path.join(outDir, 'crop_pumpkin.jpg'));

  console.log('Saved crops to:', outDir);
}

inspectCrops().catch(console.error);
