import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  SAA_113_G4_QUESTIONS,
  SAA_113_G5_QUESTIONS,
  SAA_113_G6_QUESTIONS,
  SAA_113_ALL_QUESTIONS,
  SAA_ALL_EXAM_PAPERS,
} from '../src/data/exam/saa/index.js';
import {
  SAA_EXAM_BANK,
  SAA_OFFICIAL_BANK,
  SAA_ORIGINAL_BANK,
  SAA_DRAFT_ORIGINAL_BANK,
} from '../src/data/exam/saaExamBank.js';

const expectedAnswers = {
  4: [0, 2, 2, 2, 3, 3, 3, 1, 0, 0, 3, 2, 1, 0, 1, 3, 0, 1, 2, 1, 0, 1, 3, 2, 1, 0, 3, 3, 1, 3, 2, 1, 2, 2, 0],
  5: [1, 0, 2, 3, 2, 0, 2, 0, 0, 2, 0, 1, 2, 3, 2, 1, 3, 2, 2, 3, 0, 1, 1, 2, 3, 1, 0, 0, 3, 0, 1, 1, 1, 3, 3],
  6: [0, 1, 2, 0, 0, 0, 3, 1, 1, 3, 3, 0, 2, 2, 2, 1, 1, 3, 0, 1, 1, 0, 2, 3, 2, 3, 1, 3, 0, 0, 3, 2, 1, 3, 2],
};

const papers = {
  4: SAA_113_G4_QUESTIONS,
  5: SAA_113_G5_QUESTIONS,
  6: SAA_113_G6_QUESTIONS,
};

const publicFile = (publicUrl) => path.resolve('public', String(publicUrl).replace(/^\//, ''));

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING SAA 113 OFFICIAL PAPER & SOURCE SPLIT CONTRACT      ');
console.log('══════════════════════════════════════════════════════════════');

assert.equal(SAA_113_ALL_QUESTIONS.length, 105, '113 official bank must contain 105 questions');
assert.deepEqual(Object.keys(SAA_ALL_EXAM_PAPERS).sort(), ['113', '114', '115']);

for (const [gradeText, questions] of Object.entries(papers)) {
  const grade = Number(gradeText);
  assert.equal(questions.length, 35, `G${grade} must contain 35 questions`);
  assert.deepEqual(questions.map((q) => q.answer), expectedAnswers[grade], `G${grade} answers must match the official workbook`);
  assert.equal(questions.filter((q) => q.section === 'listening').length, 15, `G${grade} must contain 15 listening questions`);
  assert.equal(questions.filter((q) => q.section === 'reading').length, 20, `G${grade} must contain 20 reading questions`);

  questions.forEach((q, index) => {
    assert.equal(q.id, `saa-113-g${grade}-${String(index + 1).padStart(2, '0')}`);
    assert.equal(q.year, 113);
    assert.equal(q.targetGrade, grade);
    assert.equal(q.sourceType, 'official');
    assert.equal(q.sourceStatus, 'published');
    assert.equal(q.preserveOptionOrder, true);
    assert.equal(q.reviewed, true);
    assert.equal(q.options.length, 4);
    assert.ok(q.answer >= 0 && q.answer < 4);
    assert.ok(q.explanation?.trim());

    if (q.section === 'listening') {
      assert.ok(q.media?.audioText?.trim(), `${q.id} must contain hidden audioText`);
      assert.ok(!q.question.includes(q.media.audioText), `${q.id} must not leak the transcript in the student stem`);
      assert.equal(q.media.audioSourceType, 'official', `${q.id} must prefer official source audio`);
      assert.ok(q.media.audioSrc?.endsWith(`g${grade}-official.mp3`), `${q.id} official audio path mismatch`);
      assert.ok(Number.isFinite(q.media.clipStart) && Number.isFinite(q.media.clipEnd), `${q.id} must define an official clip range`);
      assert.ok(q.media.clipEnd > q.media.clipStart, `${q.id} official clip range is invalid`);
      const audioPath = publicFile(q.media.audioSrc);
      assert.ok(fs.existsSync(audioPath) && fs.statSync(audioPath).size > 1_000_000, `${q.id} official MP3 is missing`);
    }
    if (q.image) {
      const filePath = publicFile(q.image);
      assert.ok(fs.existsSync(filePath), `${q.id} image is missing: ${filePath}`);
      assert.ok(fs.statSync(filePath).size > 1000, `${q.id} image is unexpectedly small`);
    }
    if (q.optionImages) {
      assert.equal(q.optionImages.length, q.options.length, `${q.id} option image count mismatch`);
      q.optionImages.forEach((imagePath) => assert.ok(fs.existsSync(publicFile(imagePath)), `${q.id} option image missing: ${imagePath}`));
    }
    if (q.groupId && q.section === 'reading') {
      assert.equal(typeof q.passage, 'object', `${q.id} grouped reading item must use the passage object schema`);
      assert.ok(q.passage.title?.trim(), `${q.id} grouped reading material title missing`);
      assert.ok(q.passage.text?.trim(), `${q.id} grouped reading material text missing`);
      if (q.passage.image) assert.ok(fs.existsSync(publicFile(q.passage.image)), `${q.id} grouped material image missing`);
    }
  });

  const readingGroups = questions
    .filter((q) => q.groupId && q.section === 'reading')
    .reduce((groups, q) => groups.set(q.groupId, [...(groups.get(q.groupId) || []), q]), new Map());
  for (const [groupId, members] of readingGroups) {
    assert.ok(members.length >= 2, `${groupId} must contain at least two child questions`);
    const expectedPassage = JSON.stringify(members[0].passage);
    members.forEach((q) => assert.equal(JSON.stringify(q.passage), expectedPassage, `${q.id} must resolve the same shared material`));
  }
}

assert.equal(SAA_OFFICIAL_BANK.length, 315, 'official pool must contain 113–115 papers only');
assert.equal(SAA_ORIGINAL_BANK.length, 0, 'no original items are approved yet');
assert.equal(SAA_DRAFT_ORIGINAL_BANK.length, 75, 'legacy original drafts must remain quarantined for review');
assert.equal(SAA_EXAM_BANK.length, SAA_OFFICIAL_BANK.length, 'active student bank must exclude draft originals');
assert.ok(SAA_EXAM_BANK.every((q) => q.sourceType === 'official'));
assert.ok(SAA_DRAFT_ORIGINAL_BANK.every((q) => !SAA_EXAM_BANK.some((active) => active.id === q.id)));

console.log('✓ 113 G4/G5/G6: official answers, 15+20 sections, official MP3 clips, zoom assets and shared group materials verified.');
console.log('✓ Source split: 315 official active, 0 approved original, 75 legacy drafts quarantined and never mixed into student exams.');
