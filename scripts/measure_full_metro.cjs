const sharp = require('sharp');

async function measureMetro() {
  // Let's crop the entire upper viaduct area: x: 100 to 750, y: 100 to 300
  await sharp('public/assets/spotter/book7_scene2_base.jpg')
    .extract({ left: 100, top: 100, width: 620, height: 180 })
    .toFile('C:/Users/user/.gemini/antigravity/brain/95c0c83b-453d-4566-961c-af611538f9f3/metro_full_crop.jpg');
    
  console.log('Saved metro_full_crop.jpg');
}

measureMetro();
