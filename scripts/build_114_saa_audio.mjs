import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const CANDIDATE_SOURCE_DIRS = [
  process.env.SAA_114_SOURCE_DIR ? path.resolve(process.env.SAA_114_SOURCE_DIR) : null,
  path.resolve(ROOT, '..', 'SAA', '114'),
  path.resolve('/home/antigravity/upload'),
  path.resolve(ROOT, 'tmp', 'audio', '114'),
].filter(Boolean);

const OUTPUT_DIR = path.join(ROOT, 'public', 'audio', 'saa', '114');

// Default estimated timestamps for SAA 114 official recordings (Q1-15 per grade).
// These can be fine-tuned once the raw recordings are placed in the source directory.
export const OFFICIAL_AUDIO_CLIPS_114 = {
  4: [
    [120.0, 132.0], [140.0, 155.0], [160.0, 172.0], [180.0, 192.0], [200.0, 212.0],
    [220.0, 232.0], [240.0, 260.0], [270.0, 290.0], [300.0, 315.0], [325.0, 350.0],
    [360.0, 380.0], [395.0, 415.0], [420.0, 442.0], [455.0, 480.0], [495.0, 530.0]
  ],
  5: [
    [125.0, 138.0], [145.0, 158.0], [165.0, 175.0], [185.0, 205.0], [210.0, 225.0],
    [235.0, 258.0], [260.0, 278.0], [288.0, 310.0], [345.0, 365.0], [380.0, 400.0],
    [415.0, 480.0], [500.0, 525.0], [540.0, 595.0], [610.0, 690.0], [610.0, 690.0]
  ],
  6: [
    [128.0, 148.0], [150.0, 172.0], [175.0, 195.0], [195.0, 215.0], [215.0, 238.0],
    [240.0, 258.0], [258.0, 300.0], [300.0, 338.0], [340.0, 380.0], [395.0, 422.0],
    [425.0, 458.0], [460.0, 485.0], [485.0, 508.0], [510.0, 630.0], [510.0, 630.0]
  ],
};

const SOURCE_FILENAMES = {
  4: [
    '114年縣市學生學習能力檢測四年級英語科＿英聽檔.mp3',
    '114年國小四年級英語科英聽檔.mp3',
    '114_G4_audio.mp3',
    'g4.mp3'
  ],
  5: [
    '114年縣市學生學習能力檢測五年級英語科＿英聽檔.mp3',
    '114年國小五年級英語科英聽檔.mp3',
    '114_G5_audio.mp3',
    'g5.mp3'
  ],
  6: [
    '114年縣市學生學習能力檢測六年級英語科＿英聽檔.mp3',
    '114年國小六年級英語科英聽檔.mp3',
    '114_G6_audio.mp3',
    'g6.mp3'
  ],
};

function findSourceFile(grade) {
  const candidates = SOURCE_FILENAMES[grade];
  for (const dir of CANDIDATE_SOURCE_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of candidates) {
      const full = path.join(dir, name);
      if (fs.existsSync(full)) return full;
    }
  }
  return null;
}

let ffmpegPath = process.env.FFMPEG_PATH || '';
if (!ffmpegPath) {
  try {
    ffmpegPath = (await import('ffmpeg-static')).default;
  } catch {
    ffmpegPath = 'ffmpeg';
  }
}

async function main() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  SAA 114 OFFICIAL AUDIO CLIPPING PIPELINE (STAGE 3)          ');
  console.log('══════════════════════════════════════════════════════════════');

  const ffmpegCheck = spawnSync(ffmpegPath, ['-version'], { encoding: 'utf8' });
  if (ffmpegCheck.status !== 0) {
    console.warn('⚠️ FFmpeg is not installed or not in PATH. Skipping audio clipping.');
    return;
  }

  let totalClipped = 0;
  let missingSources = [];

  for (const [gradeText, clips] of Object.entries(OFFICIAL_AUDIO_CLIPS_114)) {
    const grade = Number(gradeText);
    const sourcePath = findSourceFile(grade);

    if (!sourcePath) {
      missingSources.push(grade);
      console.log(`  [INFO] Raw recording for Grade ${grade} not yet found. Expected one of:\n         ${SOURCE_FILENAMES[grade].join(' / ')}`);
      continue;
    }

    console.log(`\n  Found Grade ${grade} source: ${sourcePath}`);
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
        throw new Error(`Failed to create G${grade} Q${questionNumber} clip:\n${result.stderr || result.stdout}`);
      }
      totalClipped++;
      console.log(`    ✓ ${path.relative(ROOT, outputPath)} (${fs.statSync(outputPath).size} bytes)`);
    }
  }

  console.log('\n──────────────────────────────────────────────────────────────');
  if (totalClipped > 0) {
    console.log(`🎉 Successfully created ${totalClipped} official audio clips in public/audio/saa/114/`);
  } else {
    console.log('ℹ️  No raw SAA 114 recordings found yet. SAA 114 will gracefully fall back');
    console.log('    to browser Web Speech TTS (media.audioText) until official MP3s are provided.');
  }
  console.log('══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
