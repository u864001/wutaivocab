import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'tmp', 'pdfs', '113');
const OUTPUT = path.join(ROOT, 'public', 'assets', 'exam', 'saa', '113', 'materials');

const CROPS = [
  ['g4-16.jpg', 'g4_family_1_dialogue.webp', 95, 690, 745, 480],
  ['g4-17.jpg', 'g4_family_1_diagram.webp', 95, 405, 720, 380],
  ['g4-18.jpg', 'g4_family_2_story.webp', 125, 95, 700, 515],
  ['g4-18.jpg', 'g4_q33_a.webp', 130, 705, 305, 220],
  ['g4-18.jpg', 'g4_q33_b.webp', 455, 705, 315, 220],
  ['g4-18.jpg', 'g4_q33_c.webp', 130, 925, 305, 250],
  ['g4-18.jpg', 'g4_q33_d.webp', 455, 925, 315, 250],
  ['g4-19.jpg', 'g4_q34_police.webp', 120, 175, 250, 285],
  ['g5-17.jpg', 'g5_contact_card.webp', 85, 95, 755, 550],
  ['g5-18.jpg', 'g5_museum_board.webp', 85, 145, 710, 870],
  ['g6-15.jpg', 'g6_q30_story.webp', 445, 740, 250, 350],
  ['g6-16.jpg', 'g6_letter.webp', 95, 135, 730, 650],
  ['g6-17.jpg', 'g6_q32_map.webp', 90, 145, 735, 360],
  ['g6-17.jpg', 'g6_q33_a.webp', 125, 710, 300, 220],
  ['g6-17.jpg', 'g6_q33_b.webp', 465, 710, 315, 220],
  ['g6-17.jpg', 'g6_q33_c.webp', 125, 925, 300, 230],
  ['g6-17.jpg', 'g6_q33_d.webp', 465, 925, 315, 230],
  ['g6-18.jpg', 'g6_weekly_planner.webp', 120, 190, 470, 490],
];

fs.mkdirSync(OUTPUT, { recursive: true });

for (const [sourceName, outputName, left, top, width, height] of CROPS) {
  const sourcePath = path.join(SOURCE, sourceName);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing rendered official source page: ${sourcePath}`);
  }
  const targetPath = path.join(OUTPUT, outputName);
  console.log(`Cropping ${sourceName} -> ${outputName}`);
  await sharp(sourcePath)
    .extract({ left, top, width, height })
    .webp({ quality: 92, effort: 6 })
    .toFile(targetPath);
  const meta = await sharp(targetPath).metadata();
  console.log(`${path.relative(ROOT, targetPath)} (${meta.width}x${meta.height})`);
}
