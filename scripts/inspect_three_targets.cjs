const sharp = require('sharp');
const fs = require('fs');

async function testBoxes() {
  // Test Car: base left: 830, top: 350, width: 230, height: 180
  let carSvg = '<svg width="230" height="180" xmlns="http://www.w3.org/2000/svg">';
  for (let x = 840; x <= 1060; x += 20) {
    const rx = x - 830;
    carSvg += `<line x1="${rx}" y1="0" x2="${rx}" y2="180" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    carSvg += `<text x="${rx}" y="12" fill="yellow" font-size="10">${x}</text>`;
  }
  for (let y = 360; y <= 520; y += 20) {
    const ry = y - 350;
    carSvg += `<line x1="0" y1="${ry}" x2="230" y2="${ry}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    carSvg += `<text x="2" y="${ry + 10}" fill="yellow" font-size="10">${y}</text>`;
  }
  // Current car box: cx = 940 - 830 = 110, cy = 455 - 350 = 105, rx = 75, ry = 48
  carSvg += `<ellipse cx="110" cy="105" rx="75" ry="48" fill="none" stroke="red" stroke-width="2" />`;
  carSvg += '</svg>';

  await sharp('public/assets/spotter/crops/b7_s2/car_inspect.jpg')
    .composite([{ input: Buffer.from(carSvg), left: 0, top: 0 }])
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/car_grid.jpg');

  // Test Soda & Sandwich: base left: 190, top: 490, width: 220, height: 220
  let sodaSvg = '<svg width="220" height="220" xmlns="http://www.w3.org/2000/svg">';
  for (let x = 200; x <= 400; x += 20) {
    const rx = x - 190;
    sodaSvg += `<line x1="${rx}" y1="0" x2="${rx}" y2="220" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    sodaSvg += `<text x="${rx}" y="12" fill="yellow" font-size="10">${x}</text>`;
  }
  for (let y = 500; y <= 700; y += 20) {
    const ry = y - 490;
    sodaSvg += `<line x1="0" y1="${ry}" x2="220" y2="${ry}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    sodaSvg += `<text x="2" y="${ry + 10}" fill="yellow" font-size="10">${y}</text>`;
  }
  // Current soda: x: 338, y: 590, rx: 20, ry: 50 -> cx = 338-190 = 148, cy = 590-490 = 100
  sodaSvg += `<ellipse cx="148" cy="100" rx="20" ry="50" fill="none" stroke="red" stroke-width="2" />`;
  // Current sandwich: x: 250, y: 655, rx: 48, ry: 32 -> cx = 250-190 = 60, cy = 655-490 = 165
  sodaSvg += `<ellipse cx="60" cy="165" rx="48" ry="32" fill="none" stroke="orange" stroke-width="2" />`;
  sodaSvg += '</svg>';

  await sharp('public/assets/spotter/crops/b7_s2/soda_inspect.jpg')
    .composite([{ input: Buffer.from(sodaSvg), left: 0, top: 0 }])
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/soda_grid.jpg');

  // Test Bike: base left: 470, top: 460, width: 180, height: 200
  let bikeSvg = '<svg width="180" height="200" xmlns="http://www.w3.org/2000/svg">';
  for (let x = 480; x <= 640; x += 20) {
    const rx = x - 470;
    bikeSvg += `<line x1="${rx}" y1="0" x2="${rx}" y2="200" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    bikeSvg += `<text x="${rx}" y="12" fill="yellow" font-size="10">${x}</text>`;
  }
  for (let y = 470; y <= 650; y += 20) {
    const ry = y - 460;
    bikeSvg += `<line x1="0" y1="${ry}" x2="180" y2="${ry}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    bikeSvg += `<text x="2" y="${ry + 10}" fill="yellow" font-size="10">${y}</text>`;
  }
  // Current bike: x: 560, y: 570, rx: 58, ry: 58 -> cx = 560-470 = 90, cy = 570-460 = 110
  bikeSvg += `<ellipse cx="90" cy="110" rx="58" ry="58" fill="none" stroke="red" stroke-width="2" />`;
  bikeSvg += '</svg>';

  await sharp('public/assets/spotter/crops/b7_s2/bike_inspect.jpg')
    .composite([{ input: Buffer.from(bikeSvg), left: 0, top: 0 }])
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/bike_grid.jpg');

  console.log('Grid crops generated!');
}
testBoxes().catch(console.error);
