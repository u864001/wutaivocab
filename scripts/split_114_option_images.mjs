import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'public', 'assets', 'exam', 'saa', '114');
const OUTPUT_DIR = path.join(SOURCE_DIR, 'options');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Specific definitions for 36 option image sets
// 33 sets are 2x2 grid, 3 sets (g5_q3, g5_q4, g5_q6) are 1x4 horizontal strips
export const SLICE_SPECS = {
  // Grade 4 (13 sets)
  g4_q8:  { type: '2x2', col: 448, row: 556 },
  g4_q9:  { type: '2x2', col: 480, row: 328 },
  g4_q10: { type: '2x2', col: 472, row: 304 },
  g4_q11: { type: '2x2', col: 428, row: 336 },
  g4_q12: { type: '2x2', col: 456, row: 338 },
  g4_q13: { type: '2x2', col: 492, row: 304 },
  g4_q14: { type: '2x2', col: 432, row: 289 },
  g4_q15: { type: '2x2', col: 566, row: 432 },
  g4_q20: { type: '2x2', col: 486, row: 380 },
  g4_q26: { type: '2x2', col: 496, row: 352 },
  g4_q31: { type: '2x2', col: 512, row: 321 },
  g4_q33: { type: '2x2', col: 432, row: 396 },
  g4_q35: { type: '2x2', col: 448, row: 684 },

  // Grade 5 (12 sets)
  g5_q3:  { type: '1x4', cols: [280, 544, 728] },
  g5_q4:  { type: '1x4', cols: [304, 484, 748] },
  g5_q6:  { type: '1x4', cols: [272, 508, 732] },
  g5_q7:  { type: '2x2', col: 424, row: 328 },
  g5_q9:  { type: '2x2', col: 424, row: 402 },
  g5_q10: { type: '2x2', col: 424, row: 328 },
  g5_q11: { type: '2x2', col: 424, row: 320 },
  g5_q13: { type: '2x2', col: 428, row: 385 },
  g5_q14: { type: '2x2', col: 570, row: 338 },
  g5_q15: { type: '2x2', col: 564, row: 240 },
  g5_q18: { type: '2x2', col: 424, row: 371 },
  g5_q25: { type: '2x2', col: 452, row: 408 },

  // Grade 6 (11 sets)
  g6_q3:  { type: '2x2', col: 544, row: 272 },
  g6_q4:  { type: '2x2', col: 424, row: 348 },
  g6_q5:  { type: '2x2', col: 424, row: 396 },
  g6_q6:  { type: '2x2', col: 424, row: 368 },
  g6_q7:  { type: '2x2', col: 449, row: 322 },
  g6_q8:  { type: '2x2', col: 424, row: 328 },
  g6_q9:  { type: '2x2', col: 470, row: 352 },
  g6_q10: { type: '2x2', col: 481, row: 362 },
  g6_q16: { type: '2x2', col: 440, row: 370 },
  g6_q17: { type: '2x2', col: 481, row: 304 },
  g6_q27: { type: '2x2', col: 516, row: 384 },
};

async function main() {
  let totalSlices = 0;
  console.log(`Starting SAA 114 option image splitting for ${Object.keys(SLICE_SPECS).length} sets...`);

  for (const [name, spec] of Object.entries(SLICE_SPECS)) {
    const srcFile = path.join(SOURCE_DIR, `${name}.webp`);
    if (!fs.existsSync(srcFile)) {
      throw new Error(`Missing source composite image: ${srcFile}`);
    }

    const meta = await sharp(srcFile).metadata();
    const { width, height } = meta;

    let slices = [];
    if (spec.type === '2x2') {
      const { col, row } = spec;
      slices = [
        { label: 'a', left: 0, top: 0, width: col, height: row },
        { label: 'b', left: col, top: 0, width: width - col, height: row },
        { label: 'c', left: 0, top: row, width: col, height: height - row },
        { label: 'd', left: col, top: row, width: width - col, height: height - row },
      ];
    } else if (spec.type === '1x4') {
      const [c1, c2, c3] = spec.cols;
      slices = [
        { label: 'a', left: 0, top: 0, width: c1, height },
        { label: 'b', left: c1, top: 0, width: c2 - c1, height },
        { label: 'c', left: c2, top: 0, width: c3 - c2, height },
        { label: 'd', left: c3, top: 0, width: width - c3, height },
      ];
    }

    for (const s of slices) {
      const outPath = path.join(OUTPUT_DIR, `${name}_${s.label}.webp`);
      await sharp(srcFile)
        .extract({ left: s.left, top: s.top, width: s.width, height: s.height })
        .webp({ quality: 90, effort: 6 })
        .toFile(outPath);
      totalSlices++;
    }
    console.log(`  [OK] ${name} -> ${slices.map(s => `${name}_${s.label}.webp`).join(', ')}`);
  }

  console.log(`\nSuccessfully created ${totalSlices} option images in ${path.relative(ROOT, OUTPUT_DIR)}/`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
