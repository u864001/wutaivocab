const sharp = require('sharp');

async function createGridOverlay() {
  const w = 1376, h = 768;
  
  let svg = `<svg width="${w}" height="${h}">`;
  // 100px grid
  for (let x = 0; x < w; x += 100) {
    svg += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="cyan" stroke-width="1" stroke-opacity="0.5"/>`;
    svg += `<text x="${x+3}" y="20" fill="cyan" font-size="14" font-weight="bold">${x}</text>`;
  }
  for (let y = 0; y < h; y += 100) {
    svg += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="cyan" stroke-width="1" stroke-opacity="0.5"/>`;
    svg += `<text x="5" y="${y+18}" fill="cyan" font-size="14" font-weight="bold">${y}</text>`;
  }
  // 50px subtle grid
  for (let x = 50; x < w; x += 100) {
    svg += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="yellow" stroke-width="0.5" stroke-opacity="0.3"/>`;
  }
  for (let y = 50; y < h; y += 100) {
    svg += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="yellow" stroke-width="0.5" stroke-opacity="0.3"/>`;
  }
  svg += `</svg>`;

  await sharp('public/assets/spotter/book4_scene2_base.jpg')
    .composite([{ input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg()
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/b4_s2_grid.jpg');

  console.log('b4_s2_grid.jpg created');
}

createGridOverlay().catch(console.error);
