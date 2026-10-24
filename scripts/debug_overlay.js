import sharp from 'sharp';
import fs from 'fs';

async function overlayBoxes(bookNum) {
  const code = fs.readFileSync('src/games/spotter/spotterData.js', 'utf8');
  const sceneRegex = new RegExp(`export const BOOK${bookNum}_[A-Z0-9_]+ = {([\\s\\S]*?)};`, 'm');
  const match = code.match(sceneRegex);
  if (!match) {
    console.log('Scene not found for book', bookNum);
    return;
  }

  const targetsMatch = match[1].match(/targetItems:\s*\[([\s\S]*?)\]\s*,/);
  if (!targetsMatch) return;
  const itemsStr = '[' + targetsMatch[1] + ']';
  const items = eval(itemsStr);
  console.log(`Book ${bookNum} items count:`, items.length);

  let svgElements = '';
  items.forEach((item, idx) => {
    const rx = item.radiusX || item.radius || 50;
    const ry = item.radiusY || item.radius || 50;
    const colors = ['#ff0055', '#00ff88', '#00ccff', '#ffaa00', '#aa00ff', '#ffdd00', '#00ffcc', '#ff00aa'];
    const color = colors[idx % colors.length];
    svgElements += `
      <ellipse cx="${item.x}" cy="${item.y}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="6 3" />
      <circle cx="${item.x}" cy="${item.y}" r="6" fill="${color}" />
      <rect x="${item.x - 70}" y="${item.y - ry - 28}" width="140" height="24" rx="6" fill="rgba(0,0,0,0.85)" stroke="${color}" stroke-width="2" />
      <text x="${item.x}" y="${item.y - ry - 12}" fill="#ffffff" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">${item.word} (${item.wordZh})</text>
    `;
  });

  const svgOverlay = Buffer.from(`<svg width="1376" height="768" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`);

  const baseImg = `public/assets/spotter/book${bookNum}_base.jpg`;
  const outBase = `public/assets/spotter/debug_book${bookNum}_base_boxes.jpg`;
  await sharp(baseImg).composite([{ input: svgOverlay }]).toFile(outBase);
  console.log('Generated:', outBase);

  const diffImg = `public/assets/spotter/book${bookNum}_diff.jpg`;
  const outDiff = `public/assets/spotter/debug_book${bookNum}_diff_boxes.jpg`;
  await sharp(diffImg).composite([{ input: svgOverlay }]).toFile(outDiff);
  console.log('Generated:', outDiff);
}

for (let b = 1; b <= 8; b++) {
  await overlayBoxes(b);
}
