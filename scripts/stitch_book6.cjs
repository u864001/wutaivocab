const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const baseImg = 'C:/Users/user/.gemini/antigravity/brain/43201898-606e-4f74-b656-ff17c10053b9/book6_museum_base_scene_1792107883138.jpg';
  const diffImg = 'C:/Users/user/.gemini/antigravity/brain/43201898-606e-4f74-b656-ff17c10053b9/book6_museum_diff_scene_1792107994184.jpg';
  const outSideBySide = 'C:/Users/user/.gemini/antigravity/brain/43201898-606e-4f74-b656-ff17c10053b9/book6_museum_side_by_side_v1.jpg';

  // Ensure public/assets/spotter directory exists
  const publicDir = path.resolve('public/assets/spotter');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy to public/assets/spotter
  const targetBase = path.join(publicDir, 'book6_base.jpg');
  const targetDiff = path.join(publicDir, 'book6_diff.jpg');
  fs.copyFileSync(baseImg, targetBase);
  fs.copyFileSync(diffImg, targetDiff);
  console.log('Copied to public assets:', targetBase, targetDiff);

  const targetHeight = 768;
  const leftBuf = await sharp(baseImg).resize({ height: targetHeight }).toBuffer();
  const rightBuf = await sharp(diffImg).resize({ height: targetHeight }).toBuffer();

  const leftMeta = await sharp(leftBuf).metadata();
  const rightMeta = await sharp(rightBuf).metadata();

  const dividerWidth = 16;
  const totalWidth = leftMeta.width + dividerWidth + rightMeta.width;

  const dividerSvg = `<svg width="${dividerWidth}" height="${targetHeight}">
    <rect width="${dividerWidth}" height="${targetHeight}" fill="#1e293b"/>
    <line x1="${dividerWidth/2}" y1="0" x2="${dividerWidth/2}" y2="${targetHeight}" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,6"/>
  </svg>`;
  const divider = Buffer.from(dividerSvg);

  await sharp({
    create: {
      width: totalWidth,
      height: targetHeight,
      channels: 3,
      background: { r: 30, g: 41, b: 59 }
    }
  })
  .composite([
    { input: leftBuf, top: 0, left: 0 },
    { input: divider, top: 0, left: leftMeta.width },
    { input: rightBuf, top: 0, left: leftMeta.width + dividerWidth }
  ])
  .jpeg({ quality: 92 })
  .toFile(outSideBySide);

  console.log('Successfully created side-by-side image at:', outSideBySide);
  const finalMeta = await sharp(outSideBySide).metadata();
  console.log('Dimensions:', finalMeta.width, 'x', finalMeta.height);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
