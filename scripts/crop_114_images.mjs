import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outDir = path.resolve('public/assets/exam/saa/114');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function crop(srcPath, cropOptions, destName) {
  try {
    await sharp(srcPath)
      .extract(cropOptions)
      .webp({ quality: 85 })
      .toFile(path.join(outDir, destName));
    console.log(`  ✓ Cropped ${destName} (${cropOptions.width}x${cropOptions.height})`);
  } catch (err) {
    console.error(`  ✗ Failed ${destName}:`, err.message);
  }
}

async function main() {
  console.log('=== CROPPING 114 GRADE 4 IMAGES ===');
  // Grade 4
  await crop('/tmp/saa114/pages_g4/page-04.png', { left: 90, top: 450, width: 1060, height: 1150 }, 'g4_q8.webp');
  await crop('/tmp/saa114/pages_g4/page-05.png', { left: 90, top: 130, width: 1060, height: 720 }, 'g4_q9.webp');
  await crop('/tmp/saa114/pages_g4/page-05.png', { left: 90, top: 855, width: 1060, height: 750 }, 'g4_q10.webp');
  await crop('/tmp/saa114/pages_g4/page-06.png', { left: 90, top: 130, width: 1060, height: 740 }, 'g4_q11.webp');
  await crop('/tmp/saa114/pages_g4/page-06.png', { left: 90, top: 875, width: 1060, height: 730 }, 'g4_q12.webp');
  await crop('/tmp/saa114/pages_g4/page-07.png', { left: 90, top: 130, width: 1060, height: 670 }, 'g4_q13.webp');
  await crop('/tmp/saa114/pages_g4/page-07.png', { left: 90, top: 800, width: 1060, height: 805 }, 'g4_q14.webp');
  await crop('/tmp/saa114/pages_g4/page-08.png', { left: 90, top: 130, width: 1060, height: 1100 }, 'g4_q15.webp');
  await crop('/tmp/saa114/pages_g4/page-09.png', { left: 90, top: 440, width: 1060, height: 500 }, 'g4_q16.webp');
  await crop('/tmp/saa114/pages_g4/page-09.png', { left: 90, top: 945, width: 1060, height: 550 }, 'g4_q17.webp');
  await crop('/tmp/saa114/pages_g4/page-10.png', { left: 90, top: 250, width: 1060, height: 680 }, 'g4_q18.webp');
  await crop('/tmp/saa114/pages_g4/page-11.png', { left: 90, top: 140, width: 1060, height: 650 }, 'g4_q19.webp');
  await crop('/tmp/saa114/pages_g4/page-11.png', { left: 90, top: 800, width: 1060, height: 750 }, 'g4_q20.webp');
  await crop('/tmp/saa114/pages_g4/page-12.png', { left: 90, top: 140, width: 1060, height: 510 }, 'g4_q21.webp');
  await crop('/tmp/saa114/pages_g4/page-12.png', { left: 90, top: 655, width: 1060, height: 450 }, 'g4_q22.webp');
  await crop('/tmp/saa114/pages_g4/page-12.png', { left: 90, top: 1110, width: 1060, height: 480 }, 'g4_q23.webp');
  await crop('/tmp/saa114/pages_g4/page-13.png', { left: 90, top: 155, width: 1060, height: 755 }, 'g4_q24.webp');
  await crop('/tmp/saa114/pages_g4/page-13.png', { left: 90, top: 915, width: 1060, height: 670 }, 'g4_q25.webp');
  await crop('/tmp/saa114/pages_g4/page-14.png', { left: 90, top: 155, width: 1060, height: 710 }, 'g4_q26.webp');
  await crop('/tmp/saa114/pages_g4/page-16.png', { left: 90, top: 790, width: 1060, height: 780 }, 'g4_q31.webp');
  await crop('/tmp/saa114/pages_g4/page-17.png', { left: 90, top: 485, width: 1060, height: 800 }, 'g4_q33.webp');
  await crop('/tmp/saa114/pages_g4/page-19.png', { left: 90, top: 155, width: 1060, height: 1150 }, 'g4_q35.webp');

  console.log('\n=== CROPPING 114 GRADE 5 IMAGES ===');
  // Grade 5
  await crop('/tmp/saa114/pages_g5/page-03.png', { left: 90, top: 1000, width: 1060, height: 320 }, 'g5_q3.webp');
  await crop('/tmp/saa114/pages_g5/page-03.png', { left: 90, top: 1330, width: 1060, height: 300 }, 'g5_q4.webp');
  await crop('/tmp/saa114/pages_g5/page-04.png', { left: 90, top: 460, width: 1060, height: 370 }, 'g5_q6.webp');
  await crop('/tmp/saa114/pages_g5/page-04.png', { left: 90, top: 835, width: 1060, height: 780 }, 'g5_q7.webp');
  await crop('/tmp/saa114/pages_g5/page-05.png', { left: 90, top: 465, width: 1060, height: 1150 }, 'g5_q9.webp');
  await crop('/tmp/saa114/pages_g5/page-06.png', { left: 90, top: 140, width: 1060, height: 720 }, 'g5_q10.webp');
  await crop('/tmp/saa114/pages_g5/page-06.png', { left: 90, top: 855, width: 1060, height: 755 }, 'g5_q11.webp');
  await crop('/tmp/saa114/pages_g5/page-07.png', { left: 90, top: 520, width: 1060, height: 1100 }, 'g5_q13.webp');
  await crop('/tmp/saa114/pages_g5/page-08.png', { left: 90, top: 190, width: 1060, height: 820 }, 'g5_q14.webp');
  await crop('/tmp/saa114/pages_g5/page-08.png', { left: 90, top: 1020, width: 1060, height: 590 }, 'g5_q15.webp');
  await crop('/tmp/saa114/pages_g5/page-09.png', { left: 90, top: 240, width: 1060, height: 670 }, 'g5_q16.webp');
  await crop('/tmp/saa114/pages_g5/page-10.png', { left: 90, top: 825, width: 1060, height: 790 }, 'g5_q18.webp');
  await crop('/tmp/saa114/pages_g5/page-11.png', { left: 90, top: 155, width: 1060, height: 680 }, 'g5_q19.webp');
  await crop('/tmp/saa114/pages_g5/page-11.png', { left: 90, top: 835, width: 1060, height: 780 }, 'g5_q20.webp');
  await crop('/tmp/saa114/pages_g5/page-12.png', { left: 90, top: 150, width: 1060, height: 640 }, 'g5_q21.webp');
  await crop('/tmp/saa114/pages_g5/page-12.png', { left: 90, top: 790, width: 1060, height: 820 }, 'g5_q22.webp');
  await crop('/tmp/saa114/pages_g5/page-13.png', { left: 90, top: 140, width: 1060, height: 730 }, 'g5_q23.webp');
  await crop('/tmp/saa114/pages_g5/page-13.png', { left: 90, top: 870, width: 1060, height: 740 }, 'g5_q24.webp');
  await crop('/tmp/saa114/pages_g5/page-14.png', { left: 90, top: 160, width: 1060, height: 855 }, 'g5_q25.webp');
  await crop('/tmp/saa114/pages_g5/page-14.png', { left: 90, top: 1020, width: 1060, height: 600 }, 'g5_q26.webp');
  await crop('/tmp/saa114/pages_g5/page-15.png', { left: 90, top: 145, width: 1060, height: 755 }, 'g5_q27.webp');
  await crop('/tmp/saa114/pages_g5/page-15.png', { left: 90, top: 900, width: 1060, height: 715 }, 'g5_q28.webp');
  await crop('/tmp/saa114/pages_g5/page-16.png', { left: 90, top: 150, width: 1060, height: 1450 }, 'g5_q29.webp');
  await crop('/tmp/saa114/pages_g5/page-17.png', { left: 90, top: 155, width: 1060, height: 1450 }, 'g5_q30.webp');
  // Passage 31-33
  await crop('/tmp/saa114/pages_g5/page-18.png', { left: 90, top: 160, width: 1060, height: 785 }, 'g5_q31_passage.webp');
  await crop('/tmp/saa114/pages_g5/page-18.png', { left: 90, top: 945, width: 1060, height: 670 }, 'g5_q31.webp');
  await crop('/tmp/saa114/pages_g5/page-19.png', { left: 90, top: 145, width: 1060, height: 695 }, 'g5_q32.webp');
  await crop('/tmp/saa114/pages_g5/page-19.png', { left: 90, top: 840, width: 1060, height: 770 }, 'g5_q33.webp');
  // Passage 34-35
  await crop('/tmp/saa114/pages_g5/page-20.png', { left: 90, top: 150, width: 1060, height: 730 }, 'g5_q34_schedule.webp');
  await crop('/tmp/saa114/pages_g5/page-20.png', { left: 90, top: 880, width: 1060, height: 730 }, 'g5_q34_35.webp');

  console.log('\n=== CROPPING 114 GRADE 6 IMAGES ===');
  // Grade 6
  await crop('/tmp/saa114/pages_g6/page-03.png', { left: 90, top: 980, width: 1060, height: 640 }, 'g6_q3.webp');
  await crop('/tmp/saa114/pages_g6/page-04.png', { left: 90, top: 140, width: 1060, height: 660 }, 'g6_q4.webp');
  await crop('/tmp/saa114/pages_g6/page-04.png', { left: 90, top: 800, width: 1060, height: 810 }, 'g6_q5.webp');
  await crop('/tmp/saa114/pages_g6/page-05.png', { left: 90, top: 140, width: 1060, height: 820 }, 'g6_q6.webp');
  await crop('/tmp/saa114/pages_g6/page-05.png', { left: 90, top: 960, width: 1060, height: 650 }, 'g6_q7.webp');
  await crop('/tmp/saa114/pages_g6/page-06.png', { left: 90, top: 145, width: 1060, height: 735 }, 'g6_q8.webp');
  await crop('/tmp/saa114/pages_g6/page-06.png', { left: 90, top: 880, width: 1060, height: 730 }, 'g6_q9.webp');
  await crop('/tmp/saa114/pages_g6/page-07.png', { left: 90, top: 145, width: 1060, height: 1035 }, 'g6_q10.webp');
  await crop('/tmp/saa114/pages_g6/page-09.png', { left: 90, top: 880, width: 1060, height: 730 }, 'g6_q16.webp');
  await crop('/tmp/saa114/pages_g6/page-10.png', { left: 90, top: 155, width: 1060, height: 710 }, 'g6_q17.webp');
  await crop('/tmp/saa114/pages_g6/page-10.png', { left: 90, top: 865, width: 1060, height: 745 }, 'g6_q18.webp');
  await crop('/tmp/saa114/pages_g6/page-11.png', { left: 90, top: 145, width: 1060, height: 745 }, 'g6_q19.webp');
  await crop('/tmp/saa114/pages_g6/page-11.png', { left: 90, top: 890, width: 1060, height: 720 }, 'g6_q20.webp');
  await crop('/tmp/saa114/pages_g6/page-12.png', { left: 90, top: 925, width: 1060, height: 685 }, 'g6_q23.webp');
  await crop('/tmp/saa114/pages_g6/page-14.png', { left: 90, top: 145, width: 1060, height: 735 }, 'g6_q27.webp');
  await crop('/tmp/saa114/pages_g6/page-14.png', { left: 90, top: 880, width: 1060, height: 730 }, 'g6_q28.webp');
  await crop('/tmp/saa114/pages_g6/page-15.png', { left: 90, top: 145, width: 1060, height: 880 }, 'g6_q29.webp');
  await crop('/tmp/saa114/pages_g6/page-15.png', { left: 90, top: 1025, width: 1060, height: 585 }, 'g6_q30.webp');
  // Passage 31-33 (Online store sofa review)
  await crop('/tmp/saa114/pages_g6/page-16.png', { left: 90, top: 150, width: 1060, height: 1460 }, 'g6_q31_review.webp');
  // Passage 34-35 (Toby's Diary)
  await crop('/tmp/saa114/pages_g6/page-18.png', { left: 90, top: 150, width: 1060, height: 745 }, 'g6_q34_diary.webp');

  console.log('\n🎉 ALL 114 SAA IMAGES CROPPED SUCCESSFULLY!');
}

main();
