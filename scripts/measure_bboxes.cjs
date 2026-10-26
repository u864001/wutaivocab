const sharp = require('sharp');

async function measureBBoxes() {
  const base = sharp('public/assets/spotter/book4_scene2_base.jpg');

  // Let's crop:
  // 1. clock: x: 740..930, y: 60..320
  await base.clone().extract({ left: 740, top: 60, width: 190, height: 260 }).toFile('scripts/crop_clock.jpg');
  // 2. hat: x: 210..320, y: 170..370
  await base.clone().extract({ left: 210, top: 170, width: 110, height: 200 }).toFile('scripts/crop_hat.jpg');
  // 3. bus: x: 300..500, y: 310..540
  await base.clone().extract({ left: 300, top: 310, width: 200, height: 230 }).toFile('scripts/crop_bus.jpg');
  // 4. box: x: 575..710, y: 380..590
  await base.clone().extract({ left: 575, top: 380, width: 135, height: 210 }).toFile('scripts/crop_box.jpg');
  // 5. table: x: 370..590, y: 590..768
  await base.clone().extract({ left: 370, top: 590, width: 220, height: 178 }).toFile('scripts/crop_table.jpg');
  // 6. bag: x: 560..760, y: 700..768? wait, let's crop x: 550..760, y: 550..768
  await base.clone().extract({ left: 550, top: 550, width: 210, height: 218 }).toFile('scripts/crop_bag.jpg');
  // 7. basket: x: 750..990, y: 650..768
  await base.clone().extract({ left: 750, top: 650, width: 240, height: 118 }).toFile('scripts/crop_basket.jpg');
  // 8. chair: x: 0..300, y: 560..768
  await base.clone().extract({ left: 0, top: 560, width: 300, height: 208 }).toFile('scripts/crop_chair.jpg');

  console.log('All crops created');
}

measureBBoxes().catch(console.error);
