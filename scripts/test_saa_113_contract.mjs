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
    }
    if (q.image) {
      const filePath = path.resolve('public', q.image.replace(/^\//, '').replace(/^assets\//, 'assets/'));
      assert.ok(fs.existsSync(filePath), `${q.id} image is missing: ${filePath}`);
      assert.ok(fs.statSync(filePath).size > 1000, `${q.id} image is unexpectedly small`);
    }
  });
}

assert.equal(SAA_OFFICIAL_BANK.length, 315, 'official pool must contain 113–115 papers only');
assert.equal(SAA_ORIGINAL_BANK.length, 0, 'no original items are approved yet');
assert.equal(SAA_DRAFT_ORIGINAL_BANK.length, 75, 'legacy original drafts must remain quarantined for review');
assert.equal(SAA_EXAM_BANK.length, SAA_OFFICIAL_BANK.length, 'active student bank must exclude draft originals');
assert.ok(SAA_EXAM_BANK.every((q) => q.sourceType === 'official'));
assert.ok(SAA_DRAFT_ORIGINAL_BANK.every((q) => !SAA_EXAM_BANK.some((active) => active.id === q.id)));

console.log('✓ 113 G4/G5/G6: 35 questions each, official answers, 15+20 sections, hidden transcripts and image assets verified.');
console.log('✓ Source split: 315 official active, 0 approved original, 75 legacy drafts quarantined and never mixed into student exams.');
