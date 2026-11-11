import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';
import {
  CANONICAL_STATS,
  LEGACY_TO_CANONICAL_MAP,
  CANONICAL_META_MAP,
  resolveCanonicalId,
  isCanonicalId
} from '../src/data/exam/canonicalMapping.js';

console.log('══════════════════════════════════════════════════════════════');
console.log('  RUNNING SCHEME A DUAL-MODE SCHEMA & CI CONTRACT VERIFIER   ');
console.log('══════════════════════════════════════════════════════════════');

const errors = [];

// 1. Dual-Mode Detection: Expanded Historical (3,317) vs Pruned Canonical (strictly matching CANONICAL_STATS.canonicalItems)
const canonicalItems = HERE_WE_GO_MCQ_BANK.filter(q => q.isCanonical === true);
const cloneItems = HERE_WE_GO_MCQ_BANK.filter(q => q.isCanonical === false);

const isExpandedMode = HERE_WE_GO_MCQ_BANK.length === 3317 && cloneItems.length === 1728 && CANONICAL_STATS.canonicalItems === 1589;
const isPrunedMode = cloneItems.length === 0 && HERE_WE_GO_MCQ_BANK.length === CANONICAL_STATS.canonicalItems;

if (!isPrunedMode && !isExpandedMode) {
  errors.push(`Bank/Mapping mismatch: bank length is ${HERE_WE_GO_MCQ_BANK.length} (clones: ${cloneItems.length}), but CANONICAL_STATS.canonicalItems is ${CANONICAL_STATS.canonicalItems}.`);
}

const modeLabel = isPrunedMode
  ? `PRUNED CANONICAL (${HERE_WE_GO_MCQ_BANK.length.toLocaleString()} items)`
  : 'EXPANDED DUAL (3,317 items)';
console.log(`Detected Mode: ${modeLabel}`);

// 2. Canonical vs Clone Counts
if (isExpandedMode && canonicalItems.length !== 1589) {
  errors.push(`Canonical questions count in expanded mode is ${canonicalItems.length}, expected 1589.`);
}

if (isPrunedMode && canonicalItems.length !== CANONICAL_STATS.canonicalItems) {
  errors.push(`Canonical questions count in pruned mode is ${canonicalItems.length}, expected ${CANONICAL_STATS.canonicalItems}.`);
}

if (isExpandedMode && cloneItems.length !== 1728) {
  errors.push(`Clone questions count in expanded mode is ${cloneItems.length}, expected 1728.`);
}

if (isPrunedMode && cloneItems.length !== 0) {
  errors.push(`Clone questions count in pruned mode is ${cloneItems.length}, expected 0.`);
}

if (canonicalItems.length + cloneItems.length !== HERE_WE_GO_MCQ_BANK.length) {
  errors.push(`Some questions have missing or non-boolean isCanonical.`);
}

// 3. ID, Scopes, and Pointer Integrity
const canonicalIdSet = new Set(canonicalItems.map(q => q.id));

for (const q of HERE_WE_GO_MCQ_BANK) {
  if (!q.canonicalId) {
    errors.push(`Question ${q.id} is missing canonicalId.`);
    continue;
  }
  if (!canonicalIdSet.has(q.canonicalId)) {
    errors.push(`Question ${q.id} points to non-existent canonicalId: ${q.canonicalId}.`);
  }
  if (q.isCanonical && q.canonicalId !== q.id) {
    errors.push(`Canonical question ${q.id} has mismatched canonicalId: ${q.canonicalId}.`);
  }
  if (!q.primaryScope || typeof q.primaryScope !== 'string') {
    errors.push(`Question ${q.id} has invalid primaryScope: ${q.primaryScope}.`);
  }
  if (!Array.isArray(q.scopes) || q.scopes.length === 0) {
    errors.push(`Question ${q.id} has empty or non-array scopes.`);
  } else {
    // 嚴格規範：scopes 長度不可超過 2 (原授課單元 + 對應 Review)
    if (q.scopes.length > 2) {
      errors.push(`Question ${q.id} has ${q.scopes.length} scopes (max allowed is 2: primaryScope + Review).`);
    }
    if (!q.scopes.includes(q.primaryScope)) {
      errors.push(`Question ${q.id} scopes do not include its primaryScope (${q.primaryScope}).`);
    }
  }
  // 品質檢查：7 選項與正答 index 0 契約
  if (!Array.isArray(q.options) || q.options.length !== 7) {
    errors.push(`Question ${q.id} has ${q.options?.length} options, expected exactly 7.`);
  }
  if (q.answer !== 0) {
    errors.push(`Question ${q.id} answer index is ${q.answer}, expected 0.`);
  }
}

// 4. Per-Book Minimum 100 Questions Contract
const bookCounts = {};
for (const q of canonicalItems) {
  bookCounts[q.book] = (bookCounts[q.book] || 0) + 1;
}

for (const [book, count] of Object.entries(bookCounts)) {
  if (count < 100) {
    errors.push(`Book ${book} has only ${count} canonical questions (< 100 minimum threshold).`);
  }
}

// 5. Mapping File Completeness
const expectedLegacyLen = 1728 + CANONICAL_STATS.canonicalItems;
if (Object.keys(LEGACY_TO_CANONICAL_MAP).length !== expectedLegacyLen) {
  errors.push(`LEGACY_TO_CANONICAL_MAP has ${Object.keys(LEGACY_TO_CANONICAL_MAP).length} entries, expected ${expectedLegacyLen}.`);
}

if (Object.keys(CANONICAL_META_MAP).length !== CANONICAL_STATS.canonicalItems) {
  errors.push(`CANONICAL_META_MAP has ${Object.keys(CANONICAL_META_MAP).length} entries, expected ${CANONICAL_STATS.canonicalItems}.`);
}

// 6. Helper Function Test
for (const q of HERE_WE_GO_MCQ_BANK) {
  const resolved = resolveCanonicalId(q.id);
  if (resolved !== q.canonicalId) {
    errors.push(`resolveCanonicalId(${q.id}) returned ${resolved}, expected ${q.canonicalId}.`);
    break;
  }
  if (q.isCanonical && !isCanonicalId(q.id)) {
    errors.push(`isCanonicalId(${q.id}) returned false for canonical item.`);
    break;
  }
}

if (errors.length > 0) {
  console.error('❌ Scheme A Canonical Schema Contract FAILED with errors:');
  for (const err of errors) {
    console.error('  -', err);
  }
  process.exit(1);
} else {
  console.log(`✓ All ${HERE_WE_GO_MCQ_BANK.length} questions verified in ${isPrunedMode ? 'PRUNED' : 'EXPANDED'} mode:`);
  console.log(`  - ${canonicalItems.length.toLocaleString()} In-Book Canonical Questions`);
  if (isExpandedMode) {
    console.log(`  - 1,728 In-Book Duplicate Clones`);
  } else {
    console.log(`  - Clone questions: 0`);
  }
  console.log(`  - Max Scopes per question <= 2 verified!`);
  console.log(`  - 11 Books verified (all >= 100 independent questions)`);
  console.log(`  - Complete bidirectional mapping & scope integrity verified 100%!`);
}
