import fs from 'fs';
import path from 'path';
import {
  SAA_114_G4_QUESTIONS,
  SAA_114_G5_QUESTIONS,
  SAA_114_G6_QUESTIONS,
  SAA_114_ALL_QUESTIONS,
  SAA_114_EXAM_PAPERS,
  SAA_ALL_EXAM_PAPERS
} from '../src/data/exam/saa/index.js';

console.log('══════════════════════════════════════════════════════════════');
console.log('  SAA 114 OFFICIAL CONTRACT & INTEGRITY AUDIT SUITE           ');
console.log('══════════════════════════════════════════════════════════════');

const errors = [];

// 1. Question Count & Structure
console.log('\n[1/7] Auditing Question Count & Grade Distribution...');
const gradeCounts = {
  4: SAA_114_G4_QUESTIONS.length,
  5: SAA_114_G5_QUESTIONS.length,
  6: SAA_114_G6_QUESTIONS.length
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
console.log('\n[2/7] Auditing Question Sections (Q1-15 Listening / Q16-35 Reading)...');
for (const q of SAA_114_ALL_QUESTIONS) {
  if (q.number <= 15 && q.section !== 'listening') {
    errors.push(`[${q.id}] Q${q.number} must have section 'listening', got '${q.section}'`);
  }
  if (q.number > 15 && q.section !== 'reading') {
    errors.push(`[${q.id}] Q${q.number} must have section 'reading', got '${q.section}'`);
  }
}

// 3. Official Metadata Contract (SSOT)
console.log('\n[3/7] Auditing Official Metadata (sourceType, track, preserveOptionOrder)...');
for (const q of SAA_114_ALL_QUESTIONS) {
  if (q.year !== 114) {
    errors.push(`[${q.id}] year must be 114, got ${q.year}`);
  }
  if (![4, 5, 6].includes(q.grade)) {
    errors.push(`[${q.id}] grade must be 4, 5, or 6, got ${q.grade}`);
  }
  if (q.track !== 'ministry-assessment') {
    errors.push(`[${q.id}] track must be 'ministry-assessment', got '${q.track}'`);
  }
  if (q.sourceType !== 'official') {
    errors.push(`[${q.id}] sourceType must be 'official', got '${q.sourceType}'`);
  }
  if (q.sourceStatus !== 'published') {
    errors.push(`[${q.id}] sourceStatus must be 'published', got '${q.sourceStatus}'`);
  }
  if (q.preserveOptionOrder !== true) {
    errors.push(`[${q.id}] preserveOptionOrder must be true`);
  }
  if (q.reviewed !== true) {
    errors.push(`[${q.id}] reviewed must be true`);
  }
}

// 4. Options and Answer Integrity
console.log('\n[4/7] Auditing Options & Answers...');
for (const q of SAA_114_ALL_QUESTIONS) {
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`[${q.id}] options must have exactly 4 items, got ${q.options?.length}`);
  }
  if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) {
    errors.push(`[${q.id}] answer must be an integer 0..3, got ${q.answer}`);
  }
  if (!q.question || q.question.trim().length === 0) {
    errors.push(`[${q.id}] question text cannot be empty`);
  }
  if (!q.explanation || q.explanation.trim().length === 0) {
    errors.push(`[${q.id}] explanation cannot be empty`);
  }
}

// 5. Listening Non-Leakage Contract
console.log('\n[5/7] Auditing Listening Non-Leakage & Audio Texts...');
for (const q of SAA_114_ALL_QUESTIONS.filter(q => q.section === 'listening')) {
  if (!q.media?.audioText || q.media.audioText.trim().length === 0) {
    errors.push(`[${q.id}] listening question missing media.audioText`);
  }
  // Ensure the audio dialogue is not duplicated inside the question prompt
  if (q.question.includes(q.media?.audioText) && q.media?.audioText.length > 20) {
    errors.push(`[${q.id}] audio text leaked in question body!`);
  }
}

// 6. Passage SSOT & Group Integrity
console.log('\n[6/7] Auditing Passage Groups & SSOT Shared Material...');
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
console.log('\n[7/7] Auditing Visual Assets & Wizard Paper Registration...');
const publicDir = path.resolve('public');
let verifiedAssets = 0;

for (const q of SAA_114_ALL_QUESTIONS) {
  const images = [];
  if (q.image) images.push(q.image);
  if (q.media?.image) images.push(q.media.image);
  if (q.passage?.image) images.push(q.passage.image);
  if (Array.isArray(q.optionImages)) images.push(...q.optionImages);

  for (const imgPath of images) {
    const fullPath = path.join(publicDir, imgPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`[${q.id}] Image not found: ${imgPath}`);
    } else {
      verifiedAssets++;
    }
  }
}
console.log(`  • Verified ${verifiedAssets} image references across all 105 questions`);

// Check SAA_ALL_EXAM_PAPERS has 114
if (!SAA_ALL_EXAM_PAPERS[114]) {
  errors.push(`SAA_ALL_EXAM_PAPERS[114] is missing!`);
} else {
  for (const g of [4, 5, 6]) {
    if (!SAA_ALL_EXAM_PAPERS[114][g] || SAA_ALL_EXAM_PAPERS[114][g].questions?.length !== 35) {
      errors.push(`SAA_ALL_EXAM_PAPERS[114][${g}] missing or does not have 35 questions`);
    }
  }
}

// Final Verdict
console.log('\n══════════════════════════════════════════════════════════════');
if (errors.length > 0) {
  console.error(`❌ SAA 114 CONTRACT FAILED WITH ${errors.length} ERRORS:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('🎉 SAA 114 CONTRACT AUDIT PASSED 100% WITH ZERO ERRORS!');
  console.log('   All 105 official questions conform to the Gold Standard specification.');
  console.log('══════════════════════════════════════════════════════════════\n');
}
