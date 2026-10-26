const sharp = require('sharp');

async function measureExactObjects() {
  const base = sharp('public/assets/spotter/book4_scene2_base.jpg');
  
  // Let's crop and check:
  // 1. clock: x: 1040..1230, y: 70..260 -> cx: 1135, cy: 165
  // 2. hat: x: 220..310, y: 190..365 -> cx: 265, cy: 275
  // 3. bus: x: 305..490, y: 325..530 -> cx: 398, cy: 428
  // 4. box: x: 585..705, y: 385..585 -> cx: 645, cy: 485
  // 5. chair (park bench): x: 0..300, y: 565..768 -> cx: 135, cy: 665
  // 6. table: x: 380..585, y: 600..768 -> cx: 482, cy: 685
  // 7. bag: x: 770..1020, y: 550..768? Let's check bag!
  await base.clone().extract({ left: 770, top: 550, width: 260, height: 218 }).toFile('scripts/exact_bag.jpg');
  // 8. basket: x: 1080..1360, y: 510..768
  await base.clone().extract({ left: 1080, top: 510, width: 270, height: 258 }).toFile('scripts/exact_basket.jpg');
  console.log('exact_bag and exact_basket generated');
}

measureExactObjects().catch(console.error);
