import fs from 'fs';

// 1. Update src/games/town/WutaiTownGame.jsx
let game = fs.readFileSync('src/games/town/WutaiTownGame.jsx', 'utf8');

// Change HUD outer container to pointer-events-none
game = game.replace(
  'shadow-lg pointer-events-auto">',
  'shadow-lg pointer-events-none">'
);

// Ensure left container has pointer-events-auto
game = game.replace(
  '<div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">',
  '<div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 pointer-events-auto">'
);

// Ensure right container has pointer-events-auto
game = game.replace(
  '<div className="flex items-center gap-1 sm:gap-2 shrink-0">',
  '<div className="flex items-center gap-1 sm:gap-2 shrink-0 pointer-events-auto">'
);

fs.writeFileSync('src/games/town/WutaiTownGame.jsx', game, 'utf8');
console.log('WutaiTownGame.jsx patched!');

// 2. Update src/games/town/townData.js
let town = fs.readFileSync('src/games/town/townData.js', 'utf8');

// bookstore: mapArea: { left: 31, top: 7, width: 18, height: 23 },
town = town.replace(
  "mapArea: { left: 31, top: 7, width: 18, height: 23 },",
  "mapArea: { left: 30, top: 7, width: 20, height: 27 },"
);

// supermarket: mapArea: { left: 53, top: 15, width: 22, height: 21 },
town = town.replace(
  "mapArea: { left: 53, top: 15, width: 22, height: 21 },",
  "mapArea: { left: 52, top: 13, width: 23, height: 26 },"
);

// plaza: mapArea: { left: 2, top: 6, width: 23, height: 28 },
town = town.replace(
  "mapArea: { left: 2, top: 6, width: 23, height: 28 },",
  "mapArea: { left: 2, top: 6, width: 24, height: 32 },"
);

fs.writeFileSync('src/games/town/townData.js', town, 'utf8');
console.log('townData.js patched!');
