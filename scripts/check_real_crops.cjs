const sharp = require('sharp');

async function checkActualXs() {
  const base = sharp('public/assets/spotter/book4_scene2_base.jpg');

  // Let's crop:
  // 1. clock: x: 1000..1280, y: 50..350
  await base.clone().extract({ left: 1020, top: 60, width: 230, height: 260 }).toFile('scripts/crop_real_clock.jpg');
  // 2. bag: x: 600..900, y: 550..768
  await base.clone().extract({ left: 600, top: 550, width: 250, height: 218 }).toFile('scripts/crop_real_bag.jpg');
  // 3. basket: x: 950..1300, y: 550..768
  await base.clone().extract({ left: 950, top: 550, width: 320, height: 218 }).toFile('scripts/crop_real_basket.jpg');
}

checkActualXs().catch(console.error);
