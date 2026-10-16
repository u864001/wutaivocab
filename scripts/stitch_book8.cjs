const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const brainDir = 'C:/Users/user/.gemini/antigravity/brain/43201898-606e-4f74-b656-ff17c10053b9';
  const files = fs.readdirSync(brainDir);

  const baseFiles = files.filter(f => f.startsWith('book8_') && f.includes('base') && f.endsWith('.jpg'));
  const diffFiles = files.filter(f => f.startsWith('book8_') && (f.includes('diff') || f.includes('difference')) && f.endsWith('.jpg'));

  if (baseFiles.length === 0) {
    console.error('No Book 8 base image found yet.');
    process.exit(1);
  }
  if (diffFiles.length === 0) {
    console.error('No Book 8 diff image found yet.');
    process.exit(1);
  }

  baseFiles.sort((a, b) => fs.statSync(path.join(brainDir, b)).mtimeMs - fs.statSync(path.join(brainDir, a)).mtimeMs);
  diffFiles.sort((a, b) => fs.statSync(path.join(brainDir, b)).mtimeMs - fs.statSync(path.join(brainDir, a)).mtimeMs);

  const baseImg = path.join(brainDir, baseFiles[0]);
  const diffImg = path.join(brainDir, diffFiles[0]);
  console.log('Using Base:', baseImg);
  console.log('Using Diff:', diffImg);

  const outSideBySide = path.join(brainDir, 'book8_garden_side_by_side_v1.jpg');

  // Copy to public/assets/spotter
  const publicDir = path.resolve('public/assets/spotter');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const targetBase = path.join(publicDir, 'book8_base.jpg');
  const targetDiff = path.join(publicDir, 'book8_diff.jpg');
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
