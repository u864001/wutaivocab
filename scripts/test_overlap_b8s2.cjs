const items = [
  { word: 'suit', x: 265, y: 300, rx: 60, ry: 75 },
  { word: 'jacket', x: 475, y: 370, rx: 60, ry: 68 },
  { word: 'skirt', x: 170, y: 515, rx: 50, ry: 62 },
  { word: 'jeans', x: 305, y: 585, rx: 55, ry: 42 },
  { word: 'blanket', x: 695, y: 485, rx: 55, ry: 62 },
  { word: 'toast', x: 805, y: 605, rx: 45, ry: 38 },
  { word: 'glass', x: 905, y: 545, rx: 25, ry: 50 },
  { word: 'peach', x: 1075, y: 605, rx: 38, ry: 40 }
];

let overlaps = 0;
let pairCount = 0;

console.log('=== BOOK 8 SCENE 2 ZERO OVERLAP CHECK ===');
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    pairCount++;
    const a = items[i];
    const b = items[j];
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

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
