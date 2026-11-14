import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  SAA_114_G4_QUESTIONS,
  SAA_114_G5_QUESTIONS,
  SAA_114_G6_QUESTIONS,
  SAA_114_ALL_QUESTIONS,
  SAA_ALL_EXAM_PAPERS,
} from '../src/data/exam/saa/index.js';

// Verified 105/105 official Ministry of Education SAA 114 answer keys (A=0, B=1, C=2, D=3)
export const EXPECTED_OFFICIAL_ANSWERS_114 = {
  4: [1, 0, 1, 0, 0, 3, 2, 1, 2, 1, 3, 3, 1, 2, 0, 1, 2, 1, 0, 2, 3, 0, 2, 3, 0, 0, 1, 0, 3, 2, 1, 2, 3, 2, 3],
  5: [0, 2, 3, 0, 2, 2, 2, 1, 2, 0, 3, 0, 0, 1, 2, 3, 1, 2, 0, 0, 1, 2, 1, 3, 3, 3, 2, 0, 3, 3, 0, 1, 3, 1, 1],
  6: [1, 0, 2, 3, 2, 3, 0, 1, 1, 0, 1, 2, 2, 3, 2, 1, 2, 1, 3, 3, 1, 3, 0, 2, 2, 0, 1, 3, 0, 3, 2, 1, 3, 0, 0],
};

const PAPERS_BY_GRADE = {
  4: SAA_114_G4_QUESTIONS,
  5: SAA_114_G5_QUESTIONS,
  6: SAA_114_G6_QUESTIONS,
};

const MIN_NON_WHITE_PCT = 2.0;
const MIN_ENTROPY = 0.8;
const MIN_PAIRWISE_DIFF_PCT = 1.0;

async function main() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  SAA 114 OFFICIAL CONTRACT & INTEGRITY AUDIT SUITE           ');
  console.log('══════════════════════════════════════════════════════════════');

  const errors = [];

  // 1. Question Count & Structure
  console.log('\n[1/9] Auditing Question Count & Grade Distribution...');
  const gradeCounts = {
    4: SAA_114_G4_QUESTIONS.length,
    5: SAA_114_G5_QUESTIONS.length,
    6: SAA_114_G6_QUESTIONS.length,
  };
  console.log(`  • Grade 4: ${gradeCounts[4]} / 35 questions`);
  console.log(`  • Grade 5: ${gradeCounts[5]} / 35 questions`);
  console.log(`  • Grade 6: ${gradeCounts[6]} / 35 questions`);
  console.log(`  • Total 114 Questions: ${SAA_114_ALL_QUESTIONS.length} / 105`);

  for (const [grade, count] of Object.entries(gradeCounts)) {
    if (count !== 35) {
      errors.push(`Grade ${grade} count must be exactly 35, got ${count}`);
    }
  }
  if (SAA_114_ALL_QUESTIONS.length !== 105) {
    errors.push(`Total 114 question count must be exactly 105, got ${SAA_114_ALL_QUESTIONS.length}`);
  }

  // 2. Sections (Q1~15 listening, Q16~35 reading)
  console.log('\n[2/9] Auditing Question Sections (Q1-15 Listening / Q16-35 Reading)...');
  for (const q of SAA_114_ALL_QUESTIONS) {
    if (q.number <= 15 && q.section !== 'listening') {
      errors.push(`[${q.id}] Q${q.number} must have section 'listening', got '${q.section}'`);
    }
    if (q.number > 15 && q.section !== 'reading') {
      errors.push(`[${q.id}] Q${q.number} must have section 'reading', got '${q.section}'`);
    }
  }

  // 3. Official Metadata Contract (SSOT)
  console.log('\n[3/9] Auditing Official Metadata (sourceType, track, preserveOptionOrder)...');
  for (const q of SAA_114_ALL_QUESTIONS) {
    if (q.year !== 114) errors.push(`[${q.id}] year must be 114, got ${q.year}`);
    if (![4, 5, 6].includes(q.grade)) errors.push(`[${q.id}] grade must be 4, 5, or 6, got ${q.grade}`);
    if (q.track !== 'ministry-assessment') errors.push(`[${q.id}] track must be 'ministry-assessment', got '${q.track}'`);
    if (q.sourceType !== 'official') errors.push(`[${q.id}] sourceType must be 'official', got '${q.sourceType}'`);
    if (q.sourceStatus !== 'published') errors.push(`[${q.id}] sourceStatus must be 'published', got '${q.sourceStatus}'`);
    if (q.preserveOptionOrder !== true) errors.push(`[${q.id}] preserveOptionOrder must be true`);
    if (q.reviewed !== true) errors.push(`[${q.id}] reviewed must be true`);
  }

  // 4. Options and Hardcoded 105 Official Answer Key Lock
  console.log('\n[4/9] Auditing Options & 105 Official Answer Keys...');
  for (const [gradeText, questions] of Object.entries(PAPERS_BY_GRADE)) {
    const grade = Number(gradeText);
    const expected = EXPECTED_OFFICIAL_ANSWERS_114[grade];
    if (!expected || expected.length !== 35) {
      errors.push(`Expected official answer array for G${grade} must have 35 entries`);
      continue;
    }
    questions.forEach((q, idx) => {
      if (q.id !== `saa-114-g${grade}-${String(idx + 1).padStart(2, '0')}`) {
        errors.push(`[${q.id}] unexpected id at G${grade} index ${idx}`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`[${q.id}] options must have exactly 4 items, got ${q.options?.length}`);
      }
      if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) {
        errors.push(`[${q.id}] answer must be an integer 0..3, got ${q.answer}`);
      } else if (q.answer !== expected[idx]) {
        errors.push(`[${q.id}] answer mismatch vs official key: got ${q.answer}, expected ${expected[idx]}`);
      }
      if (!q.question || q.question.trim().length === 0) {
        errors.push(`[${q.id}] question text cannot be empty`);
      }
      if (!q.explanation || q.explanation.trim().length === 0) {
        errors.push(`[${q.id}] explanation cannot be empty`);
      }
    });
  }

  // 5. Listening Non-Leakage & Audio Integrity
  console.log('\n[5/9] Auditing Listening Non-Leakage & Audio Config...');
  const listeningQs = SAA_114_ALL_QUESTIONS.filter((q) => q.section === 'listening');
  const publicDir = path.resolve('public');
  const audioSrcCount = listeningQs.filter((q) => Boolean(q.media?.audioSrc)).length;
  for (const q of listeningQs) {
    if (!q.media?.audioText || q.media.audioText.trim().length === 0) {
      errors.push(`[${q.id}] listening question missing media.audioText`);
    }
    if (q.question.includes(q.media?.audioText) && q.media?.audioText.length > 20) {
      errors.push(`[${q.id}] audio text leaked in question body!`);
    }
    if (q.media?.audioSrc) {
      const audioPath = path.join(publicDir, q.media.audioSrc.replace(/^\//, ''));
      if (!fs.existsSync(audioPath)) {
        errors.push(`[${q.id}] Missing official audio clip: ${q.media.audioSrc}`);
      } else {
        const size = fs.statSync(audioPath).size;
        if (size < 10_000) errors.push(`[${q.id}] Audio clip too small (${size} bytes): ${q.media.audioSrc}`);
        if (size >= 25 * 1024 * 1024) errors.push(`[${q.id}] Audio clip exceeds 25 MiB limit: ${q.media.audioSrc}`);
      }
    }
  }
  if (audioSrcCount > 0 && audioSrcCount !== 45) {
    errors.push(`Partial official audio rollout detected: ${audioSrcCount}/45 listening questions have media.audioSrc`);
  }

  // 6. Passage SSOT & Group Integrity
  console.log('\n[6/9] Auditing Passage Groups & SSOT Shared Material...');
  const groupMap = new Map();
  for (const q of SAA_114_ALL_QUESTIONS) {
    if (q.groupId) {
      if (!groupMap.has(q.groupId)) groupMap.set(q.groupId, []);
      groupMap.get(q.groupId).push(q);
    }
  }
  console.log(`  • Found ${groupMap.size} shared passage groups (${Array.from(groupMap.values()).flat().length} questions total)`);

  for (const [gid, questions] of groupMap.entries()) {
    const firstPassageStr = JSON.stringify(questions[0].passage);
    for (const q of questions) {
      if (!q.passage) {
        errors.push(`[${q.id}] in group '${gid}' must have passage object`);
      } else if (JSON.stringify(q.passage) !== firstPassageStr) {
        errors.push(`[${q.id}] passage object does not match other questions in group '${gid}'`);
      }
    }
  }

  // 7. Visual Assets & Exam Paper Registration
  console.log('\n[7/9] Auditing Visual Assets & Wizard Paper Registration...');
  let verifiedAssets = 0;

  for (const q of SAA_114_ALL_QUESTIONS) {
    const images = [];
    if (q.image) images.push(q.image);
    if (q.media?.image) images.push(q.media.image);
    if (q.passage?.image) images.push(q.passage.image);
    if (Array.isArray(q.optionImages)) images.push(...q.optionImages);

    for (const imgPath of images) {
      const fullPath = path.join(publicDir, imgPath.replace(/^\//, ''));
      if (!fs.existsSync(fullPath)) {
        errors.push(`[${q.id}] Image not found: ${imgPath}`);
      } else {
        verifiedAssets++;
      }
    }
  }
  if (!SAA_ALL_EXAM_PAPERS[114]) {
    errors.push('SAA_ALL_EXAM_PAPERS[114] is missing!');
  } else {
    for (const g of [4, 5, 6]) {
      if (!SAA_ALL_EXAM_PAPERS[114][g] || SAA_ALL_EXAM_PAPERS[114][g].questions?.length !== 35) {
        errors.push(`SAA_ALL_EXAM_PAPERS[114][${g}] missing or does not have 35 questions`);
      }
    }
  }
  console.log(`  • Verified ${verifiedAssets} referenced image files exist on disk`);

  // 8. Option Images Decoupling, Clean (A)-(D) Labels & optionAltTexts
  console.log('\n[8/9] Auditing Option Images Decoupling, Clean Labels & optionAltTexts...');
  const optionImageQs = SAA_114_ALL_QUESTIONS.filter((q) => Array.isArray(q.optionImages));
  console.log(`  • Found ${optionImageQs.length} questions with sliced optionImages (expected 36)`);
  if (optionImageQs.length !== 36) {
    errors.push(`Expected exactly 36 questions with optionImages, found ${optionImageQs.length}`);
  }
  for (const q of optionImageQs) {
    if (q.optionImages.length !== 4) {
      errors.push(`[${q.id}] optionImages must have exactly 4 items, got ${q.optionImages.length}`);
    }
    if (q.image) {
      errors.push(`[${q.id}] question has both optionImages and q.image (causes duplicate 4-in-1 image render)`);
    }
    if (JSON.stringify(q.options) !== JSON.stringify(['(A)', '(B)', '(C)', '(D)'])) {
      errors.push(`[${q.id}] image-option question options must be ['(A)', '(B)', '(C)', '(D)'], got ${JSON.stringify(q.options)}`);
    }
    if (!Array.isArray(q.optionAltTexts) || q.optionAltTexts.length !== 4 || q.optionAltTexts.some((t) => !t || !String(t).trim())) {
      errors.push(`[${q.id}] must define 4 non-empty optionAltTexts`);
    }
  }
  const g4q20 = SAA_114_G4_QUESTIONS.find((q) => q.id === 'saa-114-g4-20');
  if (!g4q20?.optionAltTexts || !['50', '25', '15', '5'].every((num, idx) => g4q20.optionAltTexts[idx].includes(num))) {
    errors.push(`[saa-114-g4-20] optionAltTexts must reflect 50/25/15/5 coins, got ${JSON.stringify(g4q20?.optionAltTexts)}`);
  }

  // 9. Sharp Pixel Quality Gate (Anti-Blank, Entropy Floor & Anti-Collision)
  console.log('\n[9/9] Auditing 144 Option Images via Sharp Pixel Gate...');
  let minNonWhite = 100;
  let minEntropy = 100;
  let minPairDiff = 100;

  for (const q of optionImageQs) {
    const thumbs = [];
    const hashes = new Set();

    for (let i = 0; i < q.optionImages.length; i++) {
      const imgRel = q.optionImages[i];
      const fullPath = path.join(publicDir, imgRel.replace(/^\//, ''));
      if (!fs.existsSync(fullPath)) continue;

      const rawFile = fs.readFileSync(fullPath);
      hashes.add(crypto.createHash('sha256').update(rawFile).digest('hex'));

      const meta = await sharp(fullPath).metadata();
      if ((meta.width || 0) < 80 || (meta.height || 0) < 80) {
        errors.push(`[${q.id}] Option ${i} (${imgRel}) dimensions too small: ${meta.width}x${meta.height}`);
      }

      const { data } = await sharp(fullPath).grayscale().raw().toBuffer({ resolveWithObject: true });
      let nonWhite = 0;
      for (let p = 0; p < data.length; p++) {
        if (data[p] < 245) nonWhite++;
      }
      const nonWhitePct = (nonWhite * 100) / data.length;
      const stats = await sharp(fullPath).stats();
      if (nonWhitePct < minNonWhite) minNonWhite = nonWhitePct;
      if (stats.entropy < minEntropy) minEntropy = stats.entropy;

      if (nonWhitePct < MIN_NON_WHITE_PCT) {
        errors.push(`[${q.id}] Option ${i} (${imgRel}) looks blank/sparse: nonWhite=${nonWhitePct.toFixed(2)}% (< ${MIN_NON_WHITE_PCT}%)`);
      }
      if (stats.entropy < MIN_ENTROPY) {
        errors.push(`[${q.id}] Option ${i} (${imgRel}) entropy too low: ${stats.entropy.toFixed(3)} (< ${MIN_ENTROPY})`);
      }

      const thumb = await sharp(fullPath).resize(64, 64, { fit: 'fill' }).grayscale().raw().toBuffer();
      thumbs.push(thumb);
    }

    if (hashes.size !== 4) {
      errors.push(`[${q.id}] Duplicate option image bytes detected (${hashes.size}/4 unique)`);
    }
    if (thumbs.length === 4) {
      for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
          let diffCount = 0;
          for (let k = 0; k < thumbs[i].length; k++) {
            if (Math.abs(thumbs[i][k] - thumbs[j][k]) > 20) diffCount++;
          }
          const diffPct = (diffCount * 100) / thumbs[i].length;
          if (diffPct < minPairDiff) minPairDiff = diffPct;
          if (diffPct < MIN_PAIRWISE_DIFF_PCT) {
            errors.push(`[${q.id}] Option ${i} vs ${j} pixel collision (${diffPct.toFixed(2)}% diff < ${MIN_PAIRWISE_DIFF_PCT}%)`);
          }
        }
      }
    }
  }
  console.log(`  • Pixel gate telemetry: minNonWhite=${minNonWhite.toFixed(2)}%, minEntropy=${minEntropy.toFixed(3)}, minPairwiseDiff=${minPairDiff.toFixed(2)}%`);

  // Final Verdict
  console.log('\n══════════════════════════════════════════════════════════════');
  if (errors.length > 0) {
    console.error(`❌ SAA 114 CONTRACT FAILED WITH ${errors.length} ERRORS:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('🎉 SAA 114 CONTRACT AUDIT PASSED 100% WITH ZERO ERRORS!');
    console.log('   All 105 official questions, answers, alt texts & 144 Sharp-verified option cards conform to Gold Standard.');
    console.log('══════════════════════════════════════════════════════════════\n');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
