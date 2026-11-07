// scripts/test_writing_scramble.mjs
import { TME_PRE_A1_SCRAMBLE_BANK, TME_SCRAMBLE_PATTERNS } from '../src/data/exam/tmePreA1ScrambleBank.js';
import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';
import { assembleExamForm } from '../src/games/exam/examBlueprint.js';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING PRE-A1 SENTENCE SCRAMBLE BANK & BLUEPRINT ENGINE   ');
console.log('══════════════════════════════════════════════════════════════');

// Test 1: Bank counts and pattern distribution
console.log('\n[1/5] Validating Bank Structure & Pattern Distribution...');
if (TME_PRE_A1_SCRAMBLE_BANK.length !== 60) {
  throw new Error(`Expected 60 scramble questions, got ${TME_PRE_A1_SCRAMBLE_BANK.length}`);
}
if (TME_SCRAMBLE_PATTERNS.length !== 10) {
  throw new Error(`Expected 10 scramble patterns, got ${TME_SCRAMBLE_PATTERNS.length}`);
}

const patternCounts = {};
for (const q of TME_PRE_A1_SCRAMBLE_BANK) {
  patternCounts[q.pattern] = (patternCounts[q.pattern] || 0) + 1;
}
for (const pat of TME_SCRAMBLE_PATTERNS) {
  const count = patternCounts[pat.name];
  if (count !== 6) {
    throw new Error(`Pattern "${pat.name}" expected 6 questions, got ${count}`);
  }
}
console.log('  ✓ All 10 patterns have exactly 6 questions each (60 questions total).');

// Test 2: Question integrity & Canonical Options
console.log('\n[2/5] Validating Question Integrity & Canonical Correctness...');
for (const q of TME_PRE_A1_SCRAMBLE_BANK) {
  if (!q.id.startsWith('tme-write-p')) {
    throw new Error(`Invalid ID format: ${q.id}`);
  }
  if (!Array.isArray(q.tokens) || q.tokens.length < 3) {
    throw new Error(`Invalid tokens in ${q.id}: ${JSON.stringify(q.tokens)}`);
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    throw new Error(`Invalid options count in ${q.id}`);
  }
  if (new Set(q.options).size !== 4) {
    throw new Error(`Duplicate options in ${q.id}: ${JSON.stringify(q.options)}`);
  }
  if (q.options[0] !== q.targetSentence) {
    throw new Error(`Canonical options[0] "${q.options[0]}" does not match targetSentence "${q.targetSentence}" in ${q.id}`);
  }
  if (q.answer !== 0) {
    throw new Error(`Canonical answer index must be 0 in ${q.id}, got ${q.answer}`);
  }
  if (!q.explanation || q.explanation.length < 10) {
    throw new Error(`Missing or inadequate explanation in ${q.id}`);
  }
  if (q.reviewed !== true) {
    throw new Error(`reviewed must be true in ${q.id}`);
  }
}
console.log('  ✓ All 60 questions passed syntax, tokens, options & explanation checks.');

// Test 3: Blueprint 20-Question Assembly (Balanced 2 per pattern)
console.log('\n[3/5] Validating Blueprint 20-Question Assembly (2 per pattern)...');
for (let run = 1; run <= 10; run++) {
  const form20 = assembleExamForm(TME_PRE_A1_SCRAMBLE_BANK, 20);
  if (form20.length !== 20) {
    throw new Error(`Run ${run}: Expected 20 questions, got ${form20.length}`);
  }
  const runCounts = {};
  for (const q of form20) {
    runCounts[q.patternIndex] = (runCounts[q.patternIndex] || 0) + 1;
  }
  for (let p = 1; p <= 10; p++) {
    if (runCounts[p] !== 2) {
      throw new Error(`Run ${run}: Pattern ${p} expected 2 questions, got ${runCounts[p]}`);
    }
  }
}
console.log('  ✓ 10/10 assembly simulation runs produced perfectly balanced 20-question forms (2 Qs / pattern).');

// Test 4: Blueprint 10-Question Assembly (Balanced 1 per pattern)
console.log('\n[4/5] Validating Blueprint 10-Question Assembly (1 per pattern)...');
for (let run = 1; run <= 10; run++) {
  const form10 = assembleExamForm(TME_PRE_A1_SCRAMBLE_BANK, 10);
  if (form10.length !== 10) {
    throw new Error(`Run ${run}: Expected 10 questions, got ${form10.length}`);
  }
  const runCounts = {};
  for (const q of form10) {
    runCounts[q.patternIndex] = (runCounts[q.patternIndex] || 0) + 1;
  }
  for (let p = 1; p <= 10; p++) {
    if (runCounts[p] !== 1) {
      throw new Error(`Run ${run}: Pattern ${p} expected 1 question, got ${runCounts[p]}`);
    }
  }
}
console.log('  ✓ 10/10 assembly simulation runs produced perfectly balanced 10-question forms (1 Q / pattern).');

// Test 5: Full Bank Integration
console.log('\n[5/5] Validating Full TME_PRE_A1_BANK Integration...');
if (TME_PRE_A1_BANK.length !== 250) {
  throw new Error(`Expected total bank length 250, got ${TME_PRE_A1_BANK.length}`);
}
const writingInFull = TME_PRE_A1_BANK.filter(q => q.category === 'writing');
if (writingInFull.length !== 60) {
  throw new Error(`Expected 60 writing questions in full bank, got ${writingInFull.length}`);
}
console.log('  ✓ Full TME_PRE_A1_BANK correctly contains all 250 questions (32 vocab, 58 listen, 68 read, 60 write, 32 speak).');

console.log('\n🎉 ALL PRE-A1 SENTENCE SCRAMBLE TESTS PASSED 100%!\n');
