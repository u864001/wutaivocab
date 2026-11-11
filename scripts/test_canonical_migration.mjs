/**
 * 課本題庫 Canonical 遷移與精熟度狀態機合併自動化測試 (test_canonical_migration.mjs)
 *
 * 驗證五大核心契約：
 * 1. 舊 mastered ＋ 較新 remedial，合併後必須是 remedial（嚴守精熟後答錯退回待加強之狀態機）。
 * 2. last_is_correct、status、consecutive_correct 必須來自同一筆最新紀錄，attempts 加總、is_formal OR。
 * 3. 已全為 Canonical ID 的舊快照，分母仍須從 3,317 自動校準為 1,589。
 * 4. 舊 Clone 錯題 ID 在 Pruned bank（只剩 1,589 題）中能正確解析並取出對應 Canonical 題目。
 * 5. 兩個錯題紀錄合併時 wrongCount 加總，但 streak 採最新 updatedAt 紀錄（若較新答錯 streak 為 0，不可被舊 streak 1 覆蓋）。
 */
import assert from 'node:assert/strict';
import {
  MASTERY_STATES,
  migrateMistakeMapToCanonical,
  migrateMasterySnapshotToCanonical
} from '../src/utils/masteryHelper.js';
import {
  resolveCanonicalId,
  LEGACY_TO_CANONICAL_MAP
} from '../src/data/exam/canonicalMapping.js';
import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING CANONICAL MIGRATION & STATE MACHINE MERGE RULES     ');
console.log('══════════════════════════════════════════════════════════════');

// 找出一組有複本的題號：例如 hwg_b1_exp_5001 (Clone) -> hwg_b1_exp_5137 (Canonical)
const cloneId = 'hwg_b1_exp_5001';
const canonicalId = resolveCanonicalId(cloneId);
assert.notEqual(cloneId, canonicalId, 'Test precondition: cloneId must differ from canonicalId');

// ---------------------------------------------------------------------------
// Test 1 & 2: 舊 mastered + 較新 remedial -> 合併後必須是 remedial，且欄位來自最新紀錄
// ---------------------------------------------------------------------------
console.log('\n[1/5] Testing Older Mastered + Newer Remedial State Merge...');
{
  const snap = {
    student_id: 'test_student',
    tracks: {
      curriculum: {
        total_items: 3317,
        mastered_count: 1,
        attempted_count: 2,
        items: {
          [cloneId]: {
            status: MASTERY_STATES.MASTERED,
            consecutive_correct: 2,
            last_is_correct: true,
            last_attempt_at: '2026-11-01T10:00:00.000Z',
            attempts: 3,
            is_formal: true
          },
          [canonicalId]: {
            status: MASTERY_STATES.REMEDIAL,
            consecutive_correct: 0,
            last_is_correct: false,
            last_attempt_at: '2026-11-10T12:00:00.000Z',
            attempts: 1,
            is_formal: false
          }
        }
      }
    }
  };

  const migrated = migrateMasterySnapshotToCanonical(snap);
  const track = migrated.tracks.curriculum;
  const mergedItem = track.items[canonicalId];

  assert.equal(Object.keys(track.items).length, 1, 'Clone and Canonical should merge into 1 entry');
  assert.equal(mergedItem.status, MASTERY_STATES.REMEDIAL, 'Status must be REMEDIAL (from newer attempt)');
  assert.equal(mergedItem.consecutive_correct, 0, 'Consecutive correct must be 0 (from newer attempt)');
  assert.equal(mergedItem.last_is_correct, false, 'last_is_correct must be false (from newer attempt)');
  assert.equal(mergedItem.last_attempt_at, '2026-11-10T12:00:00.000Z', 'Timestamp must match newer attempt');
  assert.equal(mergedItem.attempts, 4, 'Attempts must sum (3 + 1 = 4)');
  assert.equal(mergedItem.is_formal, true, 'is_formal must be ORed (true || false = true)');
  assert.equal(track.mastered_count, 0, 'Mastered count must recount to 0');
  assert.equal(track.attempted_count, 1, 'Attempted count must recount to 1');
  console.log('  ✓ Older mastered + newer remedial -> accurately resolved to REMEDIAL with consistent latest fields!');
}

// ---------------------------------------------------------------------------
// Test 2b: 反向順序測試（Canonical 較早 mastered，Clone 較晚 remedial）確保與遍歷順序無關
// ---------------------------------------------------------------------------
console.log('\n[2/5] Testing Order Independence (Canonical Older Mastered + Clone Newer Remedial)...');
{
  const snap = {
    student_id: 'test_student_2',
    tracks: {
      curriculum: {
        total_items: 3317,
        mastered_count: 1,
        attempted_count: 2,
        items: {
          [canonicalId]: {
            status: MASTERY_STATES.MASTERED,
            consecutive_correct: 3,
            last_is_correct: true,
            last_attempt_at: '2026-11-01T08:00:00.000Z',
            attempts: 5,
            is_formal: false
          },
          [cloneId]: {
            status: MASTERY_STATES.REMEDIAL,
            consecutive_correct: 0,
            last_is_correct: false,
            last_attempt_at: '2026-11-09T15:30:00.000Z',
            attempts: 2,
            is_formal: true
          }
        }
      }
    }
  };

  const migrated = migrateMasterySnapshotToCanonical(snap);
  const mergedItem = migrated.tracks.curriculum.items[canonicalId];

  assert.equal(mergedItem.status, MASTERY_STATES.REMEDIAL, 'Status must be REMEDIAL regardless of key order');
  assert.equal(mergedItem.consecutive_correct, 0, 'Consecutive correct must be 0');
  assert.equal(mergedItem.last_is_correct, false, 'last_is_correct must be false');
  assert.equal(mergedItem.attempts, 7, 'Attempts must sum (5 + 2 = 7)');
  assert.equal(mergedItem.is_formal, true, 'is_formal must be true');
  console.log('  ✓ Key traversal order independence verified 100%!');
}

// ---------------------------------------------------------------------------
// Test 3: 已全為 Canonical ID 的舊快照，分母仍須從 3,317 校準為 1,589
// ---------------------------------------------------------------------------
console.log('\n[3/5] Testing Denominator Calibration When All Keys Are Already Canonical...');
{
  const snap = {
    student_id: 'test_student_3',
    tracks: {
      curriculum: {
        total_items: 3317,
        mastered_count: 1,
        attempted_count: 1,
        items: {
          hwg_b1_1: {
            canonicalId: 'hwg_b1_1',
            status: MASTERY_STATES.MASTERED,
            consecutive_correct: 1,
            last_is_correct: true,
            last_attempt_at: '2026-11-05T10:00:00.000Z',
            attempts: 1,
            is_formal: false
          }
        }
      }
    }
  };

  const migrated = migrateMasterySnapshotToCanonical(snap);
  assert.equal(
    migrated.tracks.curriculum.total_items,
    1589,
    'total_items must be calibrated from 3317 to 1589 even when no item IDs needed migration'
  );
  assert.equal(migrated.tracks.curriculum.mastered_count, 1);
  console.log('  ✓ Denominator calibrated from 3,317 to 1,589 even when all item keys are already Canonical!');
}

// ---------------------------------------------------------------------------
// Test 4: 舊 Clone 錯題 ID 在 Pruned bank 中能解析出 Canonical 題目
// ---------------------------------------------------------------------------
console.log('\n[4/5] Testing Legacy Clone Mistake ID Resolution Against Pruned Bank (1,589 items)...');
{
  const prunedBank = HERE_WE_GO_MCQ_BANK.filter(q => q.isCanonical === true);
  assert.equal(prunedBank.length, 1589, 'Pruned bank must have 1,589 canonical items');

  // 模擬學生舊錯題本含有兩個屬於同一題的 Clone IDs 與另一個獨立 Clone ID
  const rawMistakes = {
    hwg_b1_exp_5001: { wrongCount: 2, streak: 1, updatedAt: 1000 },
    hwg_b1_exp_5035: { wrongCount: 1, streak: 0, updatedAt: 2000 },
    hwg_b2_exp_5275: { wrongCount: 3, streak: 1, updatedAt: 1500 }
  };

  const migratedMistakes = migrateMistakeMapToCanonical(rawMistakes);
  const mistakeKeys = Object.keys(migratedMistakes);
  const ids = new Set(mistakeKeys.flatMap((k) => [k, resolveCanonicalId(k)]));
  const resolvedQuestions = prunedBank.filter(q => ids.has(q.id) || ids.has(q.canonicalId));

  assert.equal(resolvedQuestions.length, 2, 'Should resolve exactly 2 distinct Canonical questions in Pruned bank');
  console.log(`  ✓ Legacy clone IDs resolved to ${resolvedQuestions.length} Canonical questions in Pruned bank without loss!`);
}

// ---------------------------------------------------------------------------
// Test 5: 兩個錯題紀錄合併時 wrongCount 加總，但 streak 採最新紀錄
// ---------------------------------------------------------------------------
console.log('\n[5/5] Testing Mistake Merge: wrongCount Sum & Latest Streak Resolution...');
{
  // Case A: 較舊紀錄 streak = 1，較新紀錄再次答錯 streak = 0 -> 合併後 streak 必須為 0
  const rawMistakesA = {
    hwg_b1_exp_5001: { wrongCount: 2, streak: 1, updatedAt: 1000 },
    hwg_b1_exp_5035: { wrongCount: 1, streak: 0, updatedAt: 2500 }
  };
  const mergedA = migrateMistakeMapToCanonical(rawMistakesA);
  const targetRecA = mergedA[canonicalId];

  assert.equal(targetRecA.wrongCount, 3, 'wrongCount must sum (2 + 1 = 3)');
  assert.equal(targetRecA.streak, 0, 'streak must be 0 from latest record (updatedAt 2500), not max(1, 0)');
  assert.equal(targetRecA.updatedAt, 2500, 'updatedAt must be 2500');

  // Case B: 較舊紀錄 streak = 0，較新紀錄答對一次 streak = 1 -> 合併後 streak 必須為 1
  const rawMistakesB = {
    hwg_b1_exp_5001: { wrongCount: 2, streak: 0, updatedAt: 1000 },
    hwg_b1_exp_5035: { wrongCount: 1, streak: 1, updatedAt: 3000 }
  };
  const mergedB = migrateMistakeMapToCanonical(rawMistakesB);
  const targetRecB = mergedB[canonicalId];

  assert.equal(targetRecB.wrongCount, 3, 'wrongCount must sum (2 + 1 = 3)');
  assert.equal(targetRecB.streak, 1, 'streak must be 1 from latest record (updatedAt 3000)');
  assert.equal(targetRecB.updatedAt, 3000, 'updatedAt must be 3000');
  console.log('  ✓ Mistake merge accurately sums wrongCount and uses latest streak (0 when latest is wrong, 1 when latest is right)!');
}

console.log('\n🎉 ALL 5 CANONICAL MIGRATION & STATE MACHINE TESTS PASSED 100%!');
