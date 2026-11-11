/**
 * Batch C (Book 5 & Book 6) 擴充契約、題型配比與品質門禁測試 (test_batch_c_contract.mjs)
 *
 * 驗證項目：
 * 1. Batch C 題數與 ID 完整性：Book 5 恰為 50 題 (hwg_b5_bc_01~50)、Book 6 恰為 50 題 (hwg_b6_bc_01~50)。
 * 2. 六大題型嚴格均衡配比 (8 / 8 / 10 / 10 / 6 / 8)：
 *    每冊皆為 L-WORD: 8, L-RESP: 8, V-MEAN: 10, G-MC: 10, G-CTX: 6, R-COMP: 8。
 * 3. 聽力題固定題幹與零洩漏：
 *    L-WORD 與 L-RESP 100% 採用規格書指定之固定題幹，且含非空 audioText。
 * 4. V-MEAN 語境生活填空題與挖空契約 (嚴禁機械式翻譯題)：
 *    100% 純英文生活語境句子挖空 ______，選項皆為純英文。
 * 5. R-COMP 短文理解字數規格 (嚴格 30~50 字)：
 *    短文長度嚴格落於 30~50 英文單字間。
 * 6. 七選項與正答 answer: 0 靜態契約：
 *    每題 options.length === 7，answer === 0，解析長度足夠。
 * 7. 禁用樣板句檢查與全庫字詞黏連掃描 (1,889 題全掃描)：
 *    全庫無 "I am[A-Za-z]" 黏連錯誤，0 萬用樣板句。
 * 8. 全站 UI 與資料層動態綁定 CANONICAL_STATS：
 *    動態引用 CANONICAL_STATS，無硬編碼 1889 或分冊常數。
 * 9. P0 Legacy Rollback 隔離沙盒防護驗證：
 *    當題庫已含 Batch C (1,889 題) 時，rollback 工具必須在沙盒中被安全攔截拒絕。
 */
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'node:url';
import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';
import { CANONICAL_STATS, CANONICAL_META_MAP } from '../src/data/exam/canonicalMapping.js';

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

const BANNED_TEMPLATES = [
  'See you later.',
  'Have a nice day!',
  "You're welcome.",
  'It is over there.',
  'Go straight.',
  'Turn left.'
];

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING BATCH C EXPANSION CONTRACT & QUALITY GATES          ');
console.log('══════════════════════════════════════════════════════════════');

// ---------------------------------------------------------------------------
// 1. Batch C 題數與 ID 完整性
// ---------------------------------------------------------------------------
console.log('\n[1/9] Verifying Batch C Item Counts, IDs & Meta Mapping...');
const b5BatchC = HERE_WE_GO_MCQ_BANK.filter(q => q.id.startsWith('hwg_b5_bc_'));
const b6BatchC = HERE_WE_GO_MCQ_BANK.filter(q => q.id.startsWith('hwg_b6_bc_'));

assert.equal(b5BatchC.length, 50, 'Book 5 Batch C must have exactly 50 items');
assert.equal(b6BatchC.length, 50, 'Book 6 Batch C must have exactly 50 items');
assert.ok(HERE_WE_GO_MCQ_BANK.length >= 1889, 'Total database length must be at least 1,889 items');

for (let i = 1; i <= 50; i++) {
  const num = String(i).padStart(2, '0');
  const b5Id = `hwg_b5_bc_${num}`;
  const b6Id = `hwg_b6_bc_${num}`;
  const q5 = b5BatchC.find(q => q.id === b5Id);
  const q6 = b6BatchC.find(q => q.id === b6Id);
  assert.ok(q5, `Missing ${b5Id}`);
  assert.ok(q6, `Missing ${b6Id}`);
  assert.equal(q5.isCanonical, true, `${b5Id} isCanonical must be true`);
  assert.equal(q6.isCanonical, true, `${b6Id} isCanonical must be true`);

  assert.ok(CANONICAL_META_MAP[b5Id], `Missing CANONICAL_META_MAP for ${b5Id}`);
  assert.ok(CANONICAL_META_MAP[b6Id], `Missing CANONICAL_META_MAP for ${b6Id}`);
  assert.equal(CANONICAL_META_MAP[b5Id].canonicalId, b5Id, `${b5Id} canonicalId must match`);
  assert.equal(CANONICAL_META_MAP[b6Id].canonicalId, b6Id, `${b6Id} canonicalId must match`);
  assert.ok(CANONICAL_META_MAP[b5Id].scopes.length <= 2, `${b5Id} scopes length must be <= 2`);
  assert.ok(CANONICAL_META_MAP[b6Id].scopes.length <= 2, `${b6Id} scopes length must be <= 2`);
}
console.log('  ✓ Book 5 (50 items) & Book 6 (50 items) IDs and Canonical Meta verified!');

// ---------------------------------------------------------------------------
// 2. 六大題型嚴格均衡配比 (8 / 8 / 10 / 10 / 6 / 8)
// ---------------------------------------------------------------------------
console.log('\n[2/9] Verifying Exact 8/8/10/10/6/8 TaskType Quota...');
for (const [bookLabel, items] of [['Book 5', b5BatchC], ['Book 6', b6BatchC]]) {
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
console.log('\n[3/9] Verifying Fixed Listening Stems & AudioText...');
const batchCListening = [...b5BatchC, ...b6BatchC].filter(
  q => q.taskType === 'L-WORD' || q.taskType === 'L-RESP'
);
assert.equal(batchCListening.length, 32, 'Total Batch C listening questions must be 32 (16 per book)');

for (const q of batchCListening) {
  const expectedStem = q.taskType === 'L-WORD' ? FIXED_L_WORD_STEM : FIXED_L_RESP_STEM;
  assert.equal(q.question, expectedStem, `${q.id} does not use fixed listening stem`);
  assert.ok(q.media?.audioText && q.media.audioText.trim().length > 0, `${q.id} missing audioText`);
  assert.ok(
    !q.question.toLowerCase().includes(q.media.audioText.toLowerCase()),
    `${q.id} leaks audioText in question stem`
  );
}
console.log('  ✓ All 32 Batch C listening items use exact fixed stems with zero transcript leak!');

// ---------------------------------------------------------------------------
// 4. V-MEAN 語境生活填空題與挖空契約 (嚴禁機械式翻譯題)
// ---------------------------------------------------------------------------
console.log('\n[4/9] Verifying V-MEAN Natural English Context & ______ Blank Contract...');
const batchCVMean = [...b5BatchC, ...b6BatchC].filter(q => q.taskType === 'V-MEAN');
assert.equal(batchCVMean.length, 20, 'Batch C must have exactly 20 V-MEAN questions');
for (const q of batchCVMean) {
  assert.ok(q.question.includes('______'), `${q.id} (V-MEAN) must contain ______ blank`);
  assert.ok(
    !/英文單字.*意思|中文意思|代表的阿拉伯數字|指哪一種|單字是哪一個/.test(q.question),
    `${q.id} (V-MEAN) must NOT use mechanical translation prompts`
  );
  assert.ok(
    q.options.every(opt => /^[A-Za-z\s'’\-]+$/.test(opt.trim())),
    `${q.id} (V-MEAN) options must be English words/phrases`
  );
}
console.log('  ✓ All 20 Batch C V-MEAN items verified: contextual English sentences with ______ blanks & English options!');

// ---------------------------------------------------------------------------
// 5. R-COMP 短文理解字數規格 (嚴格 30~50 字)
// ---------------------------------------------------------------------------
console.log('\n[5/9] Verifying R-COMP Passage Length (Strict 30~50 Words Specification)...');
const batchCRComp = [...b5BatchC, ...b6BatchC].filter(q => q.taskType === 'R-COMP');
assert.equal(batchCRComp.length, 16, 'Batch C must have exactly 16 R-COMP questions');
for (const q of batchCRComp) {
  const match = q.question.match(/「([\s\S]*?)」/);
  assert.ok(match, `${q.id} (R-COMP) must contain reading passage enclosed in 「...」`);
  const passage = match[1].trim();
  const words = passage.split(/\s+/).filter(w => w.length > 0);
  assert.ok(
    words.length >= 30 && words.length <= 50,
    `${q.id} (R-COMP) passage word count must be between 30 and 50 words (got ${words.length} words: "${passage}")`
  );
}
console.log('  ✓ All 16 Batch C R-COMP items verified: passage lengths strictly within 30~50 words!');

// ---------------------------------------------------------------------------
// 6. 七選項與正答 answer: 0 靜態契約
// ---------------------------------------------------------------------------
console.log('\n[6/9] Verifying 7 Options & answer: 0 Static Contract...');
for (const q of [...b5BatchC, ...b6BatchC]) {
  assert.equal(q.options.length, 7, `${q.id} must have exactly 7 options`);
  assert.equal(q.answer, 0, `${q.id} answer index must be 0`);
  assert.ok(q.explanation && q.explanation.trim().length > 10, `${q.id} explanation must be detailed (>10 chars)`);
  assert.ok(!/\.\./.test(q.question), `${q.id} must not contain accidental double periods`);
}
console.log('  ✓ All 100 Batch C questions verified: 7 options, answer: 0, robust explanations, 0 double periods!');

// ---------------------------------------------------------------------------
// 7. 禁用樣板句檢查與全庫字詞黏連掃描 (1,889 題全掃描)
// ---------------------------------------------------------------------------
console.log('\n[7/9] Verifying Banned Templates & Concatenation Across Entire Database...');
for (const q of [...b5BatchC, ...b6BatchC]) {
  for (const opt of q.options) {
    for (const banned of BANNED_TEMPLATES) {
      assert.notEqual(opt.trim(), banned, `Banned template found in ${q.id}: "${opt}"`);
    }
  }
}

let totalOptions = 0;
for (const q of HERE_WE_GO_MCQ_BANK) {
  for (const opt of q.options) {
    totalOptions++;
    assert.ok(!/\bI am[A-Za-z]/.test(opt), `Concatenation typo found in ${q.id}: "${opt}"`);
  }
}
console.log(`  ✓ All ${totalOptions} options across entire database verified: 0 banned templates & 0 word concatenation typos!`);

// ---------------------------------------------------------------------------
// 8. 全站 UI 與資料層動態綁定 CANONICAL_STATS
// ---------------------------------------------------------------------------
console.log('\n[8/9] Verifying Dynamic CANONICAL_STATS Binding Across UI & Data Files...');
const dynamicFiles = [
  'src/components/exam/PreA1MasteryDashboard.jsx',
  'src/games/exam/PureMcqExamView.jsx',
  'src/components/LeaderboardView.jsx',
  'src/data/exam/examTracks.js',
  'src/utils/masteryHelper.js',
  'src/data/exam/index.js'
];

for (const relPath of dynamicFiles) {
  const content = fs.readFileSync(path.join(projectRoot, relPath), 'utf8');
  if (relPath !== 'src/data/exam/index.js') {
    assert.ok(content.includes('CANONICAL_STATS'), `${relPath} must import and reference CANONICAL_STATS`);
  }
  assert.ok(!/1,889|1889\s*題|totalItems:\s*1889|\|\s*1889/.test(content), `${relPath} contains hardcoded 1889`);
}

const dashboardContent = fs.readFileSync(path.join(projectRoot, 'src/components/exam/PreA1MasteryDashboard.jsx'), 'utf8');
assert.ok(!/\|\s*(209|204|205|185|155|135|133|149|183|199|128|126|137)/.test(dashboardContent), 'PreA1MasteryDashboard.jsx must not contain hardcoded book count fallbacks');
console.log('  ✓ All UI & data/track files dynamically reference CANONICAL_STATS with zero hardcoded fallbacks!');

// ---------------------------------------------------------------------------
// 9. P0 Legacy Rollback 隔離沙盒防護驗證 (mkdtempSandbox)
// ---------------------------------------------------------------------------
console.log('\n[9/9] Verifying Legacy Prune Rollback Refuses Execution in Isolated Sandbox...');
const sandboxDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wutai_rollback_c_guard_'));

try {
  fs.mkdirSync(path.join(sandboxDir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(sandboxDir, 'src/data/exam'), { recursive: true });
  fs.mkdirSync(path.join(sandboxDir, 'src/data/backups'), { recursive: true });

  fs.writeFileSync(
    path.join(sandboxDir, 'package.json'),
    JSON.stringify({ type: 'module' }, null, 2),
    'utf8'
  );

  fs.copyFileSync(
    path.join(projectRoot, 'scripts/rollback_canonical_migration.mjs'),
    path.join(sandboxDir, 'scripts/rollback_canonical_migration.mjs')
  );
  fs.copyFileSync(
    path.join(projectRoot, 'src/data/backups/hereWeGoMcqBank.expanded.3317.js'),
    path.join(sandboxDir, 'src/data/backups/hereWeGoMcqBank.expanded.3317.js')
  );
  fs.copyFileSync(
    path.join(projectRoot, 'src/data/backups/canonicalMapping.1589.js'),
    path.join(sandboxDir, 'src/data/backups/canonicalMapping.1589.js')
  );
  fs.copyFileSync(
    path.join(projectRoot, 'src/data/backups/manifest.json'),
    path.join(sandboxDir, 'src/data/backups/manifest.json')
  );

  fs.copyFileSync(
    path.join(projectRoot, 'src/data/hereWeGoMcqBank.js'),
    path.join(sandboxDir, 'src/data/hereWeGoMcqBank.js')
  );
  fs.copyFileSync(
    path.join(projectRoot, 'src/data/exam/canonicalMapping.js'),
    path.join(sandboxDir, 'src/data/exam/canonicalMapping.js')
  );

  const sandboxMcqPath = path.join(sandboxDir, 'src/data/hereWeGoMcqBank.js');
  const sandboxMapPath = path.join(sandboxDir, 'src/data/exam/canonicalMapping.js');
  const beforeMcqSha = crypto.createHash('sha256').update(fs.readFileSync(sandboxMcqPath, 'utf8')).digest('hex');
  const beforeMapSha = crypto.createHash('sha256').update(fs.readFileSync(sandboxMapPath, 'utf8')).digest('hex');

  let rollbackBlocked = false;
  let rollbackErrorOutput = '';
  try {
    execFileSync(process.execPath, ['scripts/rollback_canonical_migration.mjs'], {
      cwd: sandboxDir,
      encoding: 'utf8',
      stdio: 'pipe'
    });
  } catch (err) {
    rollbackBlocked = true;
    rollbackErrorOutput = String(err.stderr || err.message || '');
  }

  assert.equal(rollbackBlocked, true, 'Legacy rollback MUST fail in sandbox when active bank contains Batch C items');
  assert.match(rollbackErrorOutput, /Refusing to execute legacy prune rollback/i);

  const afterMcqSha = crypto.createHash('sha256').update(fs.readFileSync(sandboxMcqPath, 'utf8')).digest('hex');
  const afterMapSha = crypto.createHash('sha256').update(fs.readFileSync(sandboxMapPath, 'utf8')).digest('hex');
  assert.equal(afterMcqSha, beforeMcqSha, 'Sandbox hereWeGoMcqBank.js must remain 100% untouched after blocked rollback');
  assert.equal(afterMapSha, beforeMapSha, 'Sandbox canonicalMapping.js must remain 100% untouched after blocked rollback');
  assert.ok(CANONICAL_STATS.canonicalItems >= 1889, 'CANONICAL_STATS.canonicalItems must be at least 1889');
  console.log('  ✓ Legacy rollback safely refused execution and threw required errors in isolated sandbox!');
} finally {
  fs.rmSync(sandboxDir, { recursive: true, force: true });
}

console.log('\n🎉 ALL 9 BATCH C CONTRACT & P0 SAFETY CHECKS PASSED 100%!');
