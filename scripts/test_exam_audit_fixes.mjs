import assert from 'node:assert';
import {
  assemblePreA1ExamForm,
  assembleExamForm,
  TASK_TYPES
} from '../src/games/exam/examBlueprint.js';
import {
  recordExamMasterySession,
  getTrackTotalItems,
  PRE_A1_TOTAL_ITEMS,
  SAA_TOTAL_ITEMS,
  CURRICULUM_TOTAL_ITEMS,
  loadStudentMastery
} from '../src/utils/masteryHelper.js';
import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';
import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';
import { CANONICAL_STATS } from '../src/data/exam/canonicalMapping.js';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING EXAM AUDIT FIXES & BLUEPRINT CONTRACTS             ');
console.log('══════════════════════════════════════════════════════════════\n');

// ── Test 1: Pre-A1 30-Question Standard Blueprint (15 Listening + 15 Reading/Vocab) ──
console.log('[1/4] Validating Pre-A1 Standard 30-Question Blueprint Across 100 Runs...');
for (let i = 0; i < 100; i++) {
  const form = assemblePreA1ExamForm(TME_PRE_A1_BANK, 30);
  assert.strictEqual(form.length, 30, `Expected 30 questions, got ${form.length}`);

  const listeningItems = form.filter(
    (q) =>
      q.category === 'listening' ||
      String(q.taskType).startsWith('L-') ||
      String(q.subType).startsWith('vocab-audio') ||
      Boolean(q.media?.audioText)
  );

  const readingItems = form.filter(
    (q) =>
      !listeningItems.includes(q) &&
      (q.category === 'reading' ||
        q.category === 'vocab' ||
        String(q.taskType).startsWith('R-') ||
        String(q.taskType).startsWith('V-') ||
        String(q.taskType).startsWith('G-'))
  );

  const writingItems = form.filter((q) => q.category === 'writing' || q.taskType === 'W-SCRAMBLE');
  const speakingItems = form.filter((q) => q.category === 'speaking' || String(q.taskType).startsWith('S-'));

  assert.strictEqual(listeningItems.length, 15, `Expected exactly 15 listening items, got ${listeningItems.length}`);
  assert.strictEqual(readingItems.length, 15, `Expected exactly 15 reading/vocab items, got ${readingItems.length}`);
  assert.strictEqual(writingItems.length, 0, `Expected 0 writing scramble items in standard paper, got ${writingItems.length}`);
  assert.strictEqual(speakingItems.length, 0, `Expected 0 speaking read items in standard paper, got ${speakingItems.length}`);

  // 驗證順序：前 15 題全為聽力，後 15 題全為閱讀/字彙
  for (let idx = 0; idx < 15; idx++) {
    assert.ok(listeningItems.includes(form[idx]), `Question index ${idx} must be a listening item`);
  }
  for (let idx = 15; idx < 30; idx++) {
    assert.ok(readingItems.includes(form[idx]), `Question index ${idx} must be a reading/vocab item`);
  }
}
console.log('  ✓ Pre-A1 Standard 30-question exam is strictly 15 Listening + 15 Reading/Vocab across 100 runs.');
console.log('  ✓ Writing scrambles and speaking read items are 100% excluded from standard paper.');
console.log('  ✓ Order is strictly Listening first (1-15), followed by Reading/Vocab (16-30).');

// ── Test 2: Textbook 10-Question Blueprint Listening Cap (~30% Listening) ──
console.log('\n[2/4] Validating Textbook 10-Question Blueprint (3 Listening + 7 Written)...');
const b1Pool = HERE_WE_GO_MCQ_BANK.filter((q) => q.book === 1);
let test2Runs = 50;
for (let i = 0; i < test2Runs; i++) {
  const form10 = assembleExamForm(b1Pool, 10);
  assert.strictEqual(form10.length, 10, `Expected 10 questions, got ${form10.length}`);

  const listeningCount = form10.filter((q) => TASK_TYPES[q.taskType]?.section === 'listening').length;
  const writtenCount = form10.filter((q) => TASK_TYPES[q.taskType]?.section !== 'listening').length;

  assert.strictEqual(listeningCount, 3, `Expected exactly 3 listening items, got ${listeningCount}`);
  assert.strictEqual(writtenCount, 7, `Expected exactly 7 written items, got ${writtenCount}`);
}
console.log('  ✓ Textbook 10-question mixed exam produces exactly 3 listening + 7 written items across 50 runs.');

// ── Test 3: Standardized Mastery Track Denominators ──
console.log('\n[3/4] Validating Standardized Mastery Track Denominators...');
assert.strictEqual(PRE_A1_TOTAL_ITEMS, 300, 'Pre-A1 total items must be 300');
assert.strictEqual(SAA_TOTAL_ITEMS, 285, 'SAA total items must be 285');
assert.strictEqual(CURRICULUM_TOTAL_ITEMS, CANONICAL_STATS.canonicalItems, 'Curriculum total items must match CANONICAL_STATS');

assert.strictEqual(getTrackTotalItems('tme-preA1'), 300);
assert.strictEqual(getTrackTotalItems('ministry-assessment'), 285);
assert.strictEqual(getTrackTotalItems('curriculum'), CANONICAL_STATS.canonicalItems);

// 模擬學生在各軌道首次作答後的 snapshot total_items
const dummySid = 'test_student_denom_' + Date.now();
const dummyQuestions = [{ id: 'dummy_q_01', answer: 0 }];
const dummyAnswers = [0];

// SAA 軌道測試（原本漏洞會把 total_items 設為 questions.length 即 1）
const saaSnap = recordExamMasterySession(dummySid, 'ministry-assessment', dummyQuestions, dummyAnswers, false);
assert.strictEqual(saaSnap.tracks['ministry-assessment'].total_items, 285, 'SAA snapshot total_items must be 285');

// Pre-A1 軌道測試
const preA1Snap = recordExamMasterySession(dummySid, 'tme-preA1', dummyQuestions, dummyAnswers, false);
assert.strictEqual(preA1Snap.tracks['tme-preA1'].total_items, 300, 'Pre-A1 snapshot total_items must be 300');

// 課本軌道測試
const currSnap = recordExamMasterySession(dummySid, 'curriculum', dummyQuestions, dummyAnswers, false);
assert.strictEqual(currSnap.tracks['curriculum'].total_items, CANONICAL_STATS.canonicalItems, 'Curriculum snapshot total_items must match CANONICAL_STATS');

console.log('  ✓ All track denominators are strictly fixed: SAA = 285, Pre-A1 = 300, Curriculum = dynamic CANONICAL_STATS.');

// ── Test 4: Cross-Track Mistake Recovery Simulation ──
console.log('\n[4/4] Validating Multi-Bank Mistake Pool Retrieval...');
const { SAA_EXAM_BANK } = await import('../src/data/exam/saaExamBank.js');
const allBanks = [...HERE_WE_GO_MCQ_BANK, ...SAA_EXAM_BANK, ...TME_PRE_A1_BANK];

// 挑選一個 SAA 題目的 ID 與一個 Pre-A1 題目的 ID
const sampleSaa = SAA_EXAM_BANK[0];
const sampleTme = TME_PRE_A1_BANK[0];
const sampleHwg = HERE_WE_GO_MCQ_BANK[0];

assert.ok(sampleSaa?.id, 'SAA item must have ID');
assert.ok(sampleTme?.id, 'TME item must have ID');
assert.ok(sampleHwg?.id, 'HWG item must have ID');

const testMistakeMap = {
  [sampleSaa.id]: { wrongCount: 1, streak: 0 },
  [sampleTme.id]: { wrongCount: 2, streak: 1 },
  [sampleHwg.id]: { wrongCount: 1, streak: 0 }
};

const mistakeKeys = Object.keys(testMistakeMap);
const ids = new Set(mistakeKeys);
const retrieved = [];
const seen = new Set();
for (const q of allBanks) {
  const cId = q.canonicalId || q.id;
  if (ids.has(q.id) || ids.has(cId)) {
    if (!seen.has(cId)) {
      seen.add(cId);
      retrieved.push(q);
    }
  }
}

assert.strictEqual(retrieved.length, 3, 'Must retrieve all 3 mistakes from SAA, Pre-A1, and Textbook banks');
console.log('  ✓ Multi-bank mistake pool successfully resolves mistakes from Textbook, SAA, and Pre-A1!');

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  ALL EXAM AUDIT FIXES & BLUEPRINT TESTS PASSED!             ');
console.log('══════════════════════════════════════════════════════════════');
