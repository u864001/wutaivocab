import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const townDir = path.join(process.cwd(), 'public', 'assets', 'town');
const files = fs.readdirSync(townDir).filter(f => f.endsWith('.png'));

async function convertAll() {
  console.log('開始批次高品質 WebP 轉換...');
  let totalOrig = 0;
  let totalWebp = 0;

  for (const file of files) {
    const inputPath = path.join(townDir, file);
    const baseName = path.basename(file, '.png');
    const outputPath = path.join(townDir, baseName + '.webp');

    const origStat = fs.statSync(inputPath);
    totalOrig += origStat.size;

    const isNpc = file.startsWith('npc_') || file.startsWith('teacher_');
    const options = isNpc
      ? { quality: 88, alphaQuality: 95, effort: 6 }
      : { quality: 84, effort: 6 };

    await sharp(inputPath)
      .webp(options)
      .toFile(outputPath);

    const webpStat = fs.statSync(outputPath);
    totalWebp += webpStat.size;

    const origKb = (origStat.size / 1024).toFixed(0);
    const webpKb = (webpStat.size / 1024).toFixed(0);
    const ratio = ((1 - webpStat.size / origStat.size) * 100).toFixed(1);
    console.log(file + ': ' + origKb + ' KB -> ' + webpKb + ' KB (-' + ratio + '%)');
  }

  const origMb = (totalOrig / 1024 / 1024).toFixed(1);
  const webpMb = (totalWebp / 1024 / 1024).toFixed(1);
  const totalRatio = ((1 - totalWebp / totalOrig) * 100).toFixed(1);
  console.log('\n🎉 全部轉換完成！總容量由 ' + origMb + ' MB 劇降至 ' + webpMb + ' MB（大幅瘦身 -' + totalRatio + '%）！');
}

convertAll().catch(console.error);
