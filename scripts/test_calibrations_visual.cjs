const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3';

async function testAllThree() {
  // 1. CAR TEST
  // User feedback: "汽車的判定框還要往上更大一些連車頂都包起來"
  // Old car: x: 940, y: 455, rx: 75, ry: 48 (top=407, bottom=503, left=865, right=1015)
  // Let's test two candidates:
  // Candidate A: x: 940, y: 440, rx: 82, ry: 64 (top=376, bottom=504, left=858, right=1022)
  // Candidate B: x: 940, y: 435, rx: 84, ry: 68 (top=367, bottom=503, left=856, right=1024)

  const carLeft = 820, carTop = 330, carW = 240, carH = 200;
  const carBaseCrop = await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .extract({ left: carLeft, top: carTop, width: carW, height: carH })
    .toBuffer();
  const carDiffCrop = await sharp('public/assets/spotter/book7_scene2_diff.jpg')
    .extract({ left: carLeft, top: carTop, width: carW, height: carH })
    .toBuffer();

  const carSvg = `
    <svg width="${carW}" height="${carH}" xmlns="http://www.w3.org/2000/svg">
      <!-- Old: 940, 455, rx: 75, ry: 48 -->
      <ellipse cx="${940 - carLeft}" cy="${455 - carTop}" rx="75" ry="48" fill="none" stroke="red" stroke-width="2" stroke-dasharray="4,3" />
      <text x="${940 - carLeft}" y="${455 - carTop - 52}" fill="red" font-size="11" text-anchor="middle">Old (top y=407)</text>
      <!-- Cand A: 940, 440, rx: 82, ry: 64 -->
      <ellipse cx="${940 - carLeft}" cy="${440 - carTop}" rx="82" ry="64" fill="none" stroke="#38bdf8" stroke-width="2" />
      <text x="${940 - carLeft - 50}" y="${440 - carTop - 68}" fill="#38bdf8" font-size="11" text-anchor="middle">Cand A (ry=64, top y=376)</text>
      <!-- Cand B: 940, 435, rx: 85, ry: 70 -->
      <ellipse cx="${940 - carLeft}" cy="${435 - carTop}" rx="85" ry="70" fill="none" stroke="#22c55e" stroke-width="2.5" />
      <text x="${940 - carLeft + 50}" y="${435 - carTop - 74}" fill="#22c55e" font-size="11" text-anchor="middle">Cand B (ry=70, top y=365)</text>
    </svg>
  `;

  await sharp(carBaseCrop).composite([{ input: Buffer.from(carSvg) }]).toFile(path.join(ARTIFACT_DIR, 'test_car_base.jpg'));
  await sharp(carDiffCrop).composite([{ input: Buffer.from(carSvg) }]).toFile(path.join(ARTIFACT_DIR, 'test_car_diff.jpg'));

  // 2. SODA & SANDWICH TEST
  // User feedback: "汽水的判定框也要再放大一些把整瓶汽水都包起來然後不要重疊到旁邊的食物"
  // Old soda: x: 338, y: 590, rx: 20, ry: 50 (top=540, bottom=640, left=318, right=358)
  // Old sandwich: x: 250, y: 655, rx: 48, ry: 32 (top=623, bottom=687, left=202, right=298)
  // Distance between soda (338, 590) and sandwich (250, 655): dx = 88, dy = -65, center dist = 109.4 px.
  // Note: soda is a tall bottle / can. In base it's a blue drink bottle with a straw/cap or glass bottle.
  // Let's test soda:
  // Soda Cand A: x: 338, y: 588, rx: 26, ry: 58 (top=530, bottom=646, left=312, right=364)
  // Soda Cand B: x: 338, y: 585, rx: 30, ry: 64 (top=521, bottom=649, left=308, right=368)
  // Check overlap with sandwich (250, 655, rx: 48, ry: 32):
  // Soda Cand B left = 308, Sandwich right = 298 -> horizontal gap is 10px! No overlap!
  // And Sandwich is at y=655 (lower), soda is at y=585 (upper right).
  const sodaLeft = 180, sodaTop = 490, sodaW = 220, sodaH = 220;
  const sodaBaseCrop = await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .extract({ left: sodaLeft, top: sodaTop, width: sodaW, height: sodaH })
    .toBuffer();
  const sodaDiffCrop = await sharp('public/assets/spotter/book7_scene2_diff.jpg')
    .extract({ left: sodaLeft, top: sodaTop, width: sodaW, height: sodaH })
    .toBuffer();

  const sodaSvg = `
    <svg width="${sodaW}" height="${sodaH}" xmlns="http://www.w3.org/2000/svg">
      <!-- Sandwich (current): 250, 655, rx: 48, ry: 32 -->
      <ellipse cx="${250 - sodaLeft}" cy="${655 - sodaTop}" rx="48" ry="32" fill="none" stroke="#f59e0b" stroke-width="2" />
      <text x="${250 - sodaLeft}" y="${655 - sodaTop + 5}" fill="#f59e0b" font-size="11" text-anchor="middle">Sandwich</text>
      <!-- Old Soda: 338, 590, rx: 20, ry: 50 -->
      <ellipse cx="${338 - sodaLeft}" cy="${590 - sodaTop}" rx="20" ry="50" fill="none" stroke="red" stroke-width="2" stroke-dasharray="4,3" />
      <text x="${338 - sodaLeft}" y="${590 - sodaTop - 54}" fill="red" font-size="10" text-anchor="middle">Old Soda</text>
      <!-- Cand A Soda: 338, 586, rx: 26, ry: 60 -->
      <ellipse cx="${338 - sodaLeft}" cy="${586 - sodaTop}" rx="26" ry="60" fill="none" stroke="#38bdf8" stroke-width="2" />
      <!-- Cand B Soda: 338, 584, rx: 30, ry: 65 -->
      <ellipse cx="${338 - sodaLeft}" cy="${584 - sodaTop}" rx="30" ry="65" fill="none" stroke="#22c55e" stroke-width="2.5" />
      <text x="${338 - sodaLeft}" y="${584 - sodaTop - 68}" fill="#22c55e" font-size="11" text-anchor="middle">Cand B (rx=30, ry=65)</text>
    </svg>
  `;

  await sharp(sodaBaseCrop).composite([{ input: Buffer.from(sodaSvg) }]).toFile(path.join(ARTIFACT_DIR, 'test_soda_base.jpg'));
  await sharp(sodaDiffCrop).composite([{ input: Buffer.from(sodaSvg) }]).toFile(path.join(ARTIFACT_DIR, 'test_soda_diff.jpg'));

  // 3. BIKE TEST
  // User feedback: "自行車的判定框也要往上便大一些，把手把跟車籃都包起來"
  // Old bike: x: 560, y: 570, rx: 58, ry: 58 (top=512, bottom=628, left=502, right=618)
  // Let's see: handlebars and front basket are around y: 480..520, x: 530..600.
  // Old top was y=512, so handlebars/basket at y=485..500 were outside the top!
  // Moving up and expanding:
  // Cand A: x: 560, y: 555, rx: 65, ry: 72 (top=483, bottom=627, left=495, right=625)
  // Cand B: x: 562, y: 550, rx: 68, ry: 78 (top=472, bottom=628, left=494, right=630)
  const bikeLeft = 460, bikeTop = 440, bikeW = 200, bikeH = 210;
  const bikeBaseCrop = await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .extract({ left: bikeLeft, top: bikeTop, width: bikeW, height: bikeH })
    .toBuffer();
  const bikeDiffCrop = await sharp('public/assets/spotter/book7_scene2_diff.jpg')
    .extract({ left: bikeLeft, top: bikeTop, width: bikeW, height: bikeH })
    .toBuffer();

  const bikeSvg = `
    <svg width="${bikeW}" height="${bikeH}" xmlns="http://www.w3.org/2000/svg">
      <!-- Old: 560, 570, rx: 58, ry: 58 -->
      <ellipse cx="${560 - bikeLeft}" cy="${570 - bikeTop}" rx="58" ry="58" fill="none" stroke="red" stroke-width="2" stroke-dasharray="4,3" />
      <text x="${560 - bikeLeft}" y="${570 - bikeTop - 62}" fill="red" font-size="11" text-anchor="middle">Old (top y=512)</text>
      <!-- Cand A: 560, 555, rx: 65, ry: 72 -->
      <ellipse cx="${560 - bikeLeft}" cy="${555 - bikeTop}" rx="65" ry="72" fill="none" stroke="#38bdf8" stroke-width="2" />
      <text x="${560 - bikeLeft - 40}" y="${555 - bikeTop - 76}" fill="#38bdf8" font-size="11" text-anchor="middle">Cand A (ry=72)</text>
      <!-- Cand B: 562, 550, rx: 68, ry: 78 -->
      <ellipse cx="${562 - bikeLeft}" cy="${550 - bikeTop}" rx="68" ry="78" fill="none" stroke="#22c55e" stroke-width="2.5" />
      <text x="${562 - bikeLeft + 40}" y="${550 - bikeTop - 82}" fill="#22c55e" font-size="11" text-anchor="middle">Cand B (ry=78, top y=472)</text>
    </svg>
  `;

  await sharp(bikeBaseCrop).composite([{ input: Buffer.from(bikeSvg) }]).toFile(path.join(ARTIFACT_DIR, 'test_bike_base.jpg'));
  await sharp(bikeDiffCrop).composite([{ input: Buffer.from(bikeSvg) }]).toFile(path.join(ARTIFACT_DIR, 'test_bike_diff.jpg'));

  console.log('Test visual crops saved successfully!');
}

testAllThree().catch(console.error);
