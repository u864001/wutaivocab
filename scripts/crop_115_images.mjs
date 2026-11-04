import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
const sharp = require('sharp');

const outDir = path.resolve('public/assets/exam/saa/115');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function renderAndCropAll() {
  const cropPage = async (shot, pageIdx, cropOptions, filename) => {
    const pageBuf = shot.pages[pageIdx].data;
    await sharp(pageBuf)
      .extract(cropOptions)
      .webp({ quality: 85 })
      .toFile(path.join(outDir, filename));
    console.log(`  ✓ Cropped ${filename}`);
  };

  // --------------------------------------------------------------------------
  // G5 (Grade 5)
  // --------------------------------------------------------------------------
  console.log('\n--- Rendering & Cropping G5 ---');
  const bufG5 = fs.readFileSync('reference_questions_local/saa/115/115年縣市學習能力檢測題本五年級英語科題本.pdf');
  const parserG5 = new PDFParse({ data: bufG5 });
  await parserG5.load();
  const shotG5 = await parserG5.getScreenshot({ scale: 2 });
  console.log(`Rendered ${shotG5.pages.length} pages for G5.`);

  await cropPage(shotG5, 2, { left: 140, top: 800, width: 910, height: 350 }, 'g5_q3.webp');
  await cropPage(shotG5, 2, { left: 140, top: 1150, width: 910, height: 250 }, 'g5_q4.webp');
  await cropPage(shotG5, 3, { left: 140, top: 120, width: 910, height: 550 }, 'g5_q6.webp');
  await cropPage(shotG5, 3, { left: 140, top: 800, width: 910, height: 600 }, 'g5_q7.webp');
  await cropPage(shotG5, 4, { left: 140, top: 120, width: 910, height: 650 }, 'g5_q8.webp');
  await cropPage(shotG5, 4, { left: 140, top: 820, width: 910, height: 450 }, 'g5_q9.webp');
  await cropPage(shotG5, 5, { left: 140, top: 400, width: 910, height: 600 }, 'g5_q12.webp');
  await cropPage(shotG5, 5, { left: 140, top: 1050, width: 910, height: 550 }, 'g5_q13.webp');
  await cropPage(shotG5, 6, { left: 140, top: 200, width: 910, height: 500 }, 'g5_q14.webp');
  await cropPage(shotG5, 7, { left: 180, top: 1000, width: 830, height: 400 }, 'g5_q16.webp');
  await cropPage(shotG5, 8, { left: 140, top: 200, width: 910, height: 300 }, 'g5_q17.webp');
  await cropPage(shotG5, 8, { left: 140, top: 580, width: 910, height: 350 }, 'g5_q18.webp');
  await cropPage(shotG5, 8, { left: 140, top: 1200, width: 910, height: 300 }, 'g5_q19.webp');
  await cropPage(shotG5, 9, { left: 140, top: 150, width: 910, height: 320 }, 'g5_q20.webp');
  await cropPage(shotG5, 9, { left: 180, top: 800, width: 830, height: 400 }, 'g5_q21.webp');
  await cropPage(shotG5, 10, { left: 180, top: 250, width: 830, height: 450 }, 'g5_q22.webp');
  await cropPage(shotG5, 10, { left: 140, top: 900, width: 910, height: 500 }, 'g5_q23.webp');
  await cropPage(shotG5, 11, { left: 180, top: 180, width: 830, height: 450 }, 'g5_q24.webp');
  await cropPage(shotG5, 12, { left: 140, top: 200, width: 910, height: 1000 }, 'g5_q26.webp');
  await cropPage(shotG5, 13, { left: 140, top: 200, width: 910, height: 1100 }, 'g5_q27.webp');
  await cropPage(shotG5, 14, { left: 140, top: 180, width: 910, height: 500 }, 'g5_q28.webp');
  await cropPage(shotG5, 14, { left: 140, top: 1150, width: 910, height: 450 }, 'g5_q29.webp');
  await cropPage(shotG5, 15, { left: 120, top: 220, width: 950, height: 800 }, 'g5_q30_board.webp');
  await cropPage(shotG5, 16, { left: 140, top: 200, width: 910, height: 350 }, 'g5_q30_chart.webp');
  await cropPage(shotG5, 17, { left: 500, top: 1100, width: 550, height: 480 }, 'g5_q34_map.webp');
  await cropPage(shotG5, 18, { left: 140, top: 500, width: 910, height: 750 }, 'g5_q35.webp');

  // --------------------------------------------------------------------------
  // G6 (Grade 6)
  // --------------------------------------------------------------------------
  console.log('\n--- Rendering & Cropping G6 ---');
  const bufG6 = fs.readFileSync('reference_questions_local/saa/115/115年縣市學習能力檢測題本六年級英語科題本.pdf');
  const parserG6 = new PDFParse({ data: bufG6 });
  await parserG6.load();
  const shotG6 = await parserG6.getScreenshot({ scale: 2 });
  console.log(`Rendered ${shotG6.pages.length} pages for G6.`);

  await cropPage(shotG6, 2, { left: 140, top: 900, width: 910, height: 600 }, 'g6_q3.webp');
  await cropPage(shotG6, 3, { left: 140, top: 180, width: 910, height: 350 }, 'g6_q4.webp');
  await cropPage(shotG6, 3, { left: 140, top: 600, width: 910, height: 350 }, 'g6_q5.webp');
  await cropPage(shotG6, 4, { left: 140, top: 180, width: 910, height: 650 }, 'g6_q7.webp');
  await cropPage(shotG6, 4, { left: 140, top: 900, width: 910, height: 650 }, 'g6_q8.webp');
  await cropPage(shotG6, 5, { left: 140, top: 850, width: 910, height: 650 }, 'g6_q11.webp');
  await cropPage(shotG6, 6, { left: 140, top: 500, width: 910, height: 650 }, 'g6_q13.webp');
  await cropPage(shotG6, 8, { left: 160, top: 850, width: 850, height: 400 }, 'g6_q16.webp');
  await cropPage(shotG6, 9, { left: 140, top: 220, width: 910, height: 500 }, 'g6_q17.webp');
  await cropPage(shotG6, 10, { left: 140, top: 200, width: 910, height: 550 }, 'g6_q18.webp');
  await cropPage(shotG6, 11, { left: 140, top: 280, width: 910, height: 450 }, 'g6_q19.webp');
  await cropPage(shotG6, 12, { left: 450, top: 100, width: 600, height: 380 }, 'g6_q21.webp');
  await cropPage(shotG6, 12, { left: 140, top: 600, width: 910, height: 700 }, 'g6_q22.webp');
  await cropPage(shotG6, 13, { left: 140, top: 180, width: 910, height: 600 }, 'g6_q23.webp');
  await cropPage(shotG6, 13, { left: 400, top: 1050, width: 650, height: 520 }, 'g6_q24.webp');
  await cropPage(shotG6, 14, { left: 140, top: 200, width: 910, height: 450 }, 'g6_q25.webp');
  await cropPage(shotG6, 14, { left: 450, top: 950, width: 600, height: 580 }, 'g6_q26.webp');
  await cropPage(shotG6, 15, { left: 140, top: 200, width: 910, height: 400 }, 'g6_q27.webp');
  await cropPage(shotG6, 15, { left: 140, top: 900, width: 910, height: 450 }, 'g6_q28.webp');
  await cropPage(shotG6, 16, { left: 140, top: 500, width: 910, height: 500 }, 'g6_q30.webp');
  await cropPage(shotG6, 17, { left: 120, top: 160, width: 950, height: 1250 }, 'g6_q32_board.webp');
  await cropPage(shotG6, 19, { left: 120, top: 160, width: 950, height: 850 }, 'g6_q34_police.webp');

  console.log('\n🎉 ALL G4, G5, G6 IMAGES CROPPED SUCCESSFULLY!');
}

await renderAndCropAll();
