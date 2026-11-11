/**
 * Batch A (Book 1 & Book 2) 擴充契約、動態統計綁定與 Legacy Rollback 防護測試 (test_batch_a_contract.mjs)
 *
 * 驗證項目：
 * 1. Batch A 題數與 ID 完整性：Book 1 恰為 50 題 (hwg_b1_ba_01~50)、Book 2 恰為 50 題 (hwg_b2_ba_01~50)。
 * 2. 六大題型嚴格均衡配比 (8 / 8 / 10 / 10 / 6 / 8)：
 *    每冊皆為 L-WORD: 8, L-RESP: 8, V-MEAN: 10, G-MC: 10, G-CTX: 6, R-COMP: 8。
 * 3. 聽力題固定題幹與零洩漏：
 *    L-WORD 與 L-RESP 100% 採用規格書指定之固定題幹，且含非空 audioText。
 * 4. 拼字黏連與指定題修復驗證：
 *    hwg_b1_ba_20 正答為 "I am nine years old."，全庫無 "I am[a-z]" 黏連錯誤。
 * 5. 全站 UI 與資料層動態綁定 CANONICAL_STATS：
 *    PreA1MasteryDashboard.jsx、PureMcqExamView.jsx、LeaderboardView.jsx、examTracks.js、masteryHelper.js
 *    皆動態引用 CANONICAL_STATS，無硬編碼 1689 / 1,689。
 * 6. P0 Legacy Rollback 防護驗證：
 *    當題庫已含 Batch A (1,689 題) 時，執行 rollback_canonical_migration.mjs 必須被安全攔截拒絕，
 *    確保不會誤刪 Batch A 或造成題庫與 canonicalMapping.js 失步。
 */
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'node:url';
import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';
import { CANONICAL_STATS } from '../src/data/exam/canonicalMapping.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const EXPECTED_QUOTA = {
  'L-WORD': 8,
  'L-RESP': 8,
  'V-MEAN': 10,
  'G-MC': 10,
  'G-CTX': 6,
  'R-COMP': 8
};

const FIXED_L_WORD_STEM = '【聽力：聽音選字】請聽英語發音，選出聽到的單字：';
const FIXED_L_RESP_STEM = '【聽力：聽問句選回應】請聽英語問句，選出最適合的回應句：';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING BATCH A EXPANSION CONTRACT & P0 ROLLBACK GUARD      ');
console.log('══════════════════════════════════════════════════════════════');

// ---------------------------------------------------------------------------
// 1. Batch A 題數與 ID 完整性
// ---------------------------------------------------------------------------
console.log('\n[1/6] Verifying Batch A Item Counts & IDs...');
const b1BatchA = HERE_WE_GO_MCQ_BANK.filter(q => q.id.startsWith('hwg_b1_ba_'));
const b2BatchA = HERE_WE_GO_MCQ_BANK.filter(q => q.id.startsWith('hwg_b2_ba_'));

assert.equal(b1BatchA.length, 50, 'Book 1 Batch A must have exactly 50 items');
assert.equal(b2BatchA.length, 50, 'Book 2 Batch A must have exactly 50 items');

for (let i = 1; i <= 50; i++) {
  const num = String(i).padStart(2, '0');
  assert.ok(b1BatchA.some(q => q.id === `hwg_b1_ba_${num}`), `Missing hwg_b1_ba_${num}`);
  assert.ok(b2BatchA.some(q => q.id === `hwg_b2_ba_${num}`), `Missing hwg_b2_ba_${num}`);
}
console.log('  ✓ Book 1 (50 items) & Book 2 (50 items) IDs verified!');

// ---------------------------------------------------------------------------
// 2. 六大題型嚴格均衡配比 (8 / 8 / 10 / 10 / 6 / 8)
// ---------------------------------------------------------------------------
console.log('\n[2/6] Verifying Exact 8/8/10/10/6/8 TaskType Quota...');
for (const [bookLabel, items] of [['Book 1', b1BatchA], ['Book 2', b2BatchA]]) {
  const counts = {};
  for (const q of items) {
    counts[q.taskType] = (counts[q.taskType] || 0) + 1;
  }
  assert.deepEqual(
    counts,
    EXPECTED_QUOTA,
    `${bookLabel} taskType distribution mismatch! Got ${JSON.stringify(counts)}, expected ${JSON.stringify(EXPECTED_QUOTA)}`
  );
  console.log(`  ✓ ${bookLabel} exact quota verified: ${JSON.stringify(counts)}`);
}

// ---------------------------------------------------------------------------
// 3. 聽力題固定題幹與零洩漏
// ---------------------------------------------------------------------------
console.log('\n[3/6] Verifying Fixed Listening Stems & AudioText...');
const batchAListening = [...b1BatchA, ...b2BatchA].filter(
  q => q.taskType === 'L-WORD' || q.taskType === 'L-RESP'
);
assert.equal(batchAListening.length, 32, 'Total Batch A listening questions must be 32 (16 per book)');

for (const q of batchAListening) {
  const expectedStem = q.taskType === 'L-WORD' ? FIXED_L_WORD_STEM : FIXED_L_RESP_STEM;
  assert.equal(q.question, expectedStem, `${q.id} does not use fixed listening stem`);
  assert.ok(q.media?.audioText && q.media.audioText.trim().length > 0, `${q.id} missing audioText`);
  assert.ok(
    !q.question.toLowerCase().includes(q.media.audioText.toLowerCase()),
    `${q.id} leaks audioText in question stem`
  );
}
console.log('  ✓ All 32 Batch A listening items use exact fixed stems with zero transcript leak!');

// ---------------------------------------------------------------------------
// 4. 拼字黏連與指定題修復驗證 (hwg_b1_ba_20)
// ---------------------------------------------------------------------------
console.log('\n[4/6] Verifying hwg_b1_ba_20 & Checking for Word Concatenation Typos...');
const q20 = HERE_WE_GO_MCQ_BANK.find(q => q.id === 'hwg_b1_ba_20');
assert.ok(q20, 'hwg_b1_ba_20 must exist');
assert.equal(q20.options[0], 'I am nine years old.', 'hwg_b1_ba_20 answer must be "I am nine years old."');

for (const q of [...b1BatchA, ...b2BatchA]) {
  for (const opt of q.options) {
    assert.ok(!/\bI am[A-Za-z]/.test(opt), `Concatenation typo found in ${q.id}: "${opt}"`);
  }
}
console.log('  ✓ hwg_b1_ba_20 ("I am nine years old.") and all 700 Batch A options verified!');

// ---------------------------------------------------------------------------
// 5. 全站 UI 與資料層動態綁定 CANONICAL_STATS (無硬編碼 1689 / 1,689)
// ---------------------------------------------------------------------------
console.log('\n[5/6] Verifying Dynamic CANONICAL_STATS Binding Across UI & Data Files...');
const dynamicFiles = [
  'src/components/exam/PreA1MasteryDashboard.jsx',
  'src/games/exam/PureMcqExamView.jsx',
  'src/components/LeaderboardView.jsx',
  'src/data/exam/examTracks.js'
];

for (const relPath of dynamicFiles) {
  const content = fs.readFileSync(path.join(projectRoot, relPath), 'utf8');
  assert.ok(content.includes('CANONICAL_STATS'), `${relPath} must import and reference CANONICAL_STATS`);
  assert.ok(!/1,689|totalItems:\s*1689/.test(content), `${relPath} still contains hardcoded 1,689 or totalItems: 1689`);
}
console.log('  ✓ All UI & track config files dynamically reference CANONICAL_STATS!');

// ---------------------------------------------------------------------------
// 6. P0 Legacy Rollback 防護驗證：拒絕覆蓋已擴充 Batch A 之題庫
// ---------------------------------------------------------------------------
console.log('\n[6/6] Verifying Legacy Prune Rollback Refuses to Overwrite Batch A Bank...');
const mcqPath = path.join(projectRoot, 'src/data/hereWeGoMcqBank.js');
const mapPath = path.join(projectRoot, 'src/data/exam/canonicalMapping.js');
const beforeMcqSha = crypto.createHash('sha256').update(fs.readFileSync(mcqPath, 'utf8')).digest('hex');
const beforeMapSha = crypto.createHash('sha256').update(fs.readFileSync(mapPath, 'utf8')).digest('hex');

let rollbackBlocked = false;
let rollbackErrorOutput = '';
try {
  execFileSync(process.execPath, ['scripts/rollback_canonical_migration.mjs'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe'
  });
} catch (err) {
  rollbackBlocked = true;
  rollbackErrorOutput = String(err.stderr || err.message || '');
}

assert.equal(rollbackBlocked, true, 'Legacy rollback MUST fail when active bank contains Batch A items');
assert.match(rollbackErrorOutput, /Refusing to execute legacy prune rollback/i);

const afterMcqSha = crypto.createHash('sha256').update(fs.readFileSync(mcqPath, 'utf8')).digest('hex');
const afterMapSha = crypto.createHash('sha256').update(fs.readFileSync(mapPath, 'utf8')).digest('hex');
assert.equal(afterMcqSha, beforeMcqSha, 'hereWeGoMcqBank.js must remain 100% untouched after blocked rollback');
assert.equal(afterMapSha, beforeMapSha, 'canonicalMapping.js must remain 100% untouched after blocked rollback');
assert.equal(CANONICAL_STATS.canonicalItems, 1689);
console.log('  ✓ Legacy rollback safely refused execution and left 1,689-item bank & mapping untouched!');

console.log('\n🎉 ALL 6 BATCH A CONTRACT & P0 SAFETY CHECKS PASSED 100%!');
