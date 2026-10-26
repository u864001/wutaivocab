const items = [
  { word: 'metro', x: 423, y: 185, rx: 258, ry: 40, rotate: 4.8 },
  { word: 'taxi', x: 650, y: 405, rx: 75, ry: 45 },
  { word: 'car', x: 940, y: 455, rx: 75, ry: 48 },
  { word: 'scooter', x: 1205, y: 460, rx: 68, ry: 60 },
  { word: 'bike', x: 560, y: 570, rx: 58, ry: 58 },
  { word: 'ticket', x: 350, y: 470, rx: 24, ry: 22 },
  { word: 'sandwich', x: 250, y: 655, rx: 48, ry: 32 },
  { word: 'soda', x: 338, y: 590, rx: 20, ry: 50 }
];

let overlaps = 0;
let pairCount = 0;

console.log('=== BOOK 7 SCENE 2 ZERO OVERLAP CHECK (EXPANDED ROTATED METRO) ===');
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    pairCount++;
    const a = items[i];
    const b = items[j];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Effective radius with rotation
    const getRadiusAtAngle = (item, globalAngle) => {
      const localAngle = globalAngle - ((item.rotate || 0) * Math.PI / 180);
      return (item.rx * item.ry) / Math.sqrt((item.ry * Math.cos(localAngle))**2 + (item.rx * Math.sin(localAngle))**2);
    };

    const angle = Math.atan2(dy, dx);
    const ra = getRadiusAtAngle(a, angle);
    const rb = getRadiusAtAngle(b, angle + Math.PI);
    
    const margin = dist - (ra + rb);
    if (margin < 0) {
      console.log(`[OVERLAP DETECTED] ${a.word} <-> ${b.word}: margin = ${margin.toFixed(1)}px (dist=${dist.toFixed(1)}, ra+rb=${(ra+rb).toFixed(1)})`);
      overlaps++;
    } else {
      console.log(`[OK] ${a.word.padEnd(8)} <-> ${b.word.padEnd(8)}: margin = +${margin.toFixed(1)}px`);
    }
  }
}

console.log(`\nChecked ${pairCount} pairs. Total Overlaps: ${overlaps}`);
