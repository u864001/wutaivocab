const sharp = require('sharp');

async function testMetroEllipses() {
  const width = 1376;
  const height = 768;
  
  // Option 1: Standard horizontal wide-flat ellipse
  // x: 423, y: 185, rx: 260, ry: 50
  
  // Option 2: Slight rotation (rotate: 5 deg clockwise matching viaduct slope)
  // center: 423, 185, rx: 255, ry: 40, rotate: 4.8 deg
  
  let svg1 = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg1 += `<ellipse cx="423" cy="185" rx="260" ry="50" fill="rgba(0, 255, 100, 0.25)" stroke="#00ff66" stroke-width="3"/>`;
  svg1 += `<text x="423" y="125" fill="#ffff00" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle">Horizontal (rx:260, ry:50)</text>`;
  svg1 += `</svg>`;

  let svg2 = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg2 += `<g transform="rotate(4.8, 423, 185)">`;
  svg2 += `<ellipse cx="423" cy="185" rx="258" ry="40" fill="rgba(255, 0, 100, 0.25)" stroke="#ff0066" stroke-width="3"/>`;
  svg2 += `</g>`;
  svg2 += `<text x="423" y="125" fill="#ffff00" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle">Rotated 4.8 deg (rx:258, ry:40)</text>`;
  svg2 += `</svg>`;

  await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .composite([{ input: Buffer.from(svg1), top: 0, left: 0 }])
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/metro_opt1_horizontal.jpg');

  await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .composite([{ input: Buffer.from(svg2), top: 0, left: 0 }])
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/metro_opt2_rotated.jpg');

  console.log('Saved both metro comparison options!');
}

testMetroEllipses();
