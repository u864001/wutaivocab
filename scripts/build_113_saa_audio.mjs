import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SOURCE_DIR = process.env.SAA_113_SOURCE_DIR
  ? path.resolve(process.env.SAA_113_SOURCE_DIR)
  : path.resolve(ROOT, '..', 'SAA', '113');
const OUTPUT_DIR = path.join(ROOT, 'public', 'audio', 'saa', '113');

// Each range is taken from the official 113-year recording. The generated files
// contain the original narrator/actors and avoid depending on fragile browser
// seeking inside a 10-30 MB source file.
export const OFFICIAL_AUDIO_CLIPS = {
  4: [[125.0, 135.5], [146.0, 159.5], [164.7, 175.5], [184.1, 193.5], [203.4, 214.0], [223.1, 233.0], [244.6, 263.0], [274.1, 294.0], [304.9, 318.0], [330.0, 358.0], [369.9, 388.0], [400.4, 422.5], [422.7, 447.5], [460.5, 486.5], [499.9, 546.5]],
  5: [[133.2, 142.5], [152.2, 161.5], [171.5, 176.5], [191.2, 213.0], [213.2, 228.5], [239.0, 263.8], [264.0, 280.5], [292.2, 315.5], [350.2, 370.5], [384.9, 406.0], [420.3, 494.5], [509.2, 535.5], [549.4, 602.5], [617.0, 705.5], [617.0, 705.5]],
  6: [[133.8, 154.5], [154.5, 178.5], [178.5, 199.0], [199.0, 219.2], [219.2, 242.5], [242.5, 260.2], [260.2, 306.0], [306.0, 342.5], [342.5, 387.4], [401.8, 429.0], [429.0, 464.0], [464.0, 490.0], [490.0, 513.5], [513.5, 642.0], [513.5, 642.0]],
};

const SOURCE_NAMES = {
  4: '113年縣市學生學習能力檢測四年級英語科＿英聽檔.mp3',
  5: '113年縣市學生學習能力檢測五年級英語科＿英聽檔.mp3',
  6: '113年縣市學生學習能力檢測六年級英語科＿英聽檔.mp3',
};

let ffmpegPath = process.env.FFMPEG_PATH || '';
if (!ffmpegPath) {
  try {
    ffmpegPath = (await import('ffmpeg-static')).default;
  } catch {
    ffmpegPath = 'ffmpeg';
  }
}

const ffmpegCheck = spawnSync(ffmpegPath, ['-version'], { encoding: 'utf8' });
if (ffmpegCheck.status !== 0) {
  throw new Error(
    'FFmpeg is required to rebuild SAA 113 clips. Install ffmpeg, set FFMPEG_PATH, '
      + 'or run "npm install --no-save ffmpeg-static" before this script.',
  );
}

for (const [gradeText, clips] of Object.entries(OFFICIAL_AUDIO_CLIPS)) {
  const grade = Number(gradeText);
  const sourcePath = path.join(SOURCE_DIR, SOURCE_NAMES[grade]);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing official SAA 113 audio: ${sourcePath}`);
  }

  const gradeDir = path.join(OUTPUT_DIR, `g${grade}`);
  fs.mkdirSync(gradeDir, { recursive: true });

  for (const [index, [start, end]] of clips.entries()) {
    const questionNumber = index + 1;
    const outputPath = path.join(gradeDir, `q${String(questionNumber).padStart(2, '0')}.mp3`);
    const result = spawnSync(ffmpegPath, [
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-ss', String(start),
      '-i', sourcePath,
      '-t', String(end - start),
      '-vn',
      '-map_metadata', '-1',
      '-codec:a', 'libmp3lame',
      '-b:a', '128k',
      outputPath,
    ], { encoding: 'utf8' });

    if (result.status !== 0 || !fs.existsSync(outputPath)) {
      throw new Error(`Failed to create G${grade} Q${questionNumber} official clip:\n${result.stderr || result.stdout}`);
    }
    console.log(`${path.relative(ROOT, outputPath)} (${fs.statSync(outputPath).size} bytes)`);
  }
}

console.log('Created 45 per-question clips from the three official SAA 113 recordings.');
