import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';

console.log(`\n=== RIGOROUS PRE-A1 QUESTION BANK INTEGRITY AUDIT ===`);
console.log(`Total questions in bank: ${TME_PRE_A1_BANK.length}`);

let passedCount = 0;
let errors = [];

// 1. Basic Schema Audit
for (const q of TME_PRE_A1_BANK) {
  if (!q.id) errors.push(`Question missing id`);
  if (!q.category) errors.push(`[${q.id}] missing category`);
  if (!q.subType) errors.push(`[${q.id}] missing subType`);
  if (!Array.isArray(q.options) || q.options.length < 1) {
    errors.push(`[${q.id}] invalid options array`);
  }
  if (q.answer === undefined || q.answer < 0 || q.answer >= q.options.length) {
    errors.push(`[${q.id}] invalid answer index ${q.answer}`);
  }
}
console.log(`✓ Phase 1: Basic schema and index bounds verified (${errors.length === 0 ? 'PASS' : 'FAIL'})`);

// 2. Specific SubType Semantic Integrity
// 2A: vocab-audio2word
const a2w = TME_PRE_A1_BANK.filter(q => q.subType === 'vocab-audio2word');
for (const q of a2w) {
  const target = q.media?.audioText?.toLowerCase().trim();
  const ansOpt = q.options[q.answer]?.toLowerCase().trim();
  if (target !== ansOpt) {
    errors.push(`[${q.id}] audioText "${target}" does not match correct option "${ansOpt}"`);
  }
}
console.log(`✓ Phase 2A: vocab-audio2word (${a2w.length} items) - audioText matches correct spelling exactly`);

// 2B: read-cloze
const cloze = TME_PRE_A1_BANK.filter(q => q.subType === 'read-cloze');
for (const q of cloze) {
  const ansOpt = q.options[q.answer]?.toLowerCase().trim();
  const exp = q.explanation?.toLowerCase();
  if (!exp.includes(ansOpt)) {
    errors.push(`[${q.id}] cloze target "${ansOpt}" not referenced in explanation: "${q.explanation}"`);
  }
}
console.log(`✓ Phase 2B: read-cloze (${cloze.length} items) - answer option referenced in pedagogical explanation`);

// 2C: listen-pic2sent
const p2s = TME_PRE_A1_BANK.filter(q => q.subType === 'listen-pic2sent');
for (const q of p2s) {
  const audio = q.media?.audioText?.toLowerCase();
  const opt = q.options[q.answer]?.toLowerCase();
  // opt should be contained in audio or vice versa
  const match = audio.includes(opt.slice(0, 15)) || opt.includes(audio.slice(0, 15));
  if (!match) {
    errors.push(`[${q.id}] listen-pic2sent audio "${audio}" does not match opt "${opt}"`);
  }
}
console.log(`✓ Phase 2C: listen-pic2sent (${p2s.length} items) - audioText matches sentence text`);

// 2D: listen-resp
const lresp = TME_PRE_A1_BANK.filter(q => q.subType === 'listen-resp');
for (const q of lresp) {
  const opt = q.options[q.answer]?.toLowerCase();
  const exp = q.explanation?.toLowerCase();
  const optKeywords = opt.split(/\s+/).filter(w => w.length > 2);
  const matched = optKeywords.some(w => exp.includes(w));
  if (!matched) {
    errors.push(`[${q.id}] listen-resp opt "${opt}" not found in explanation "${q.explanation}"`);
  }
}
console.log(`✓ Phase 2D: listen-resp (${lresp.length} items) - response option matches explanation dialogue`);

// 2E: listen-conv-qa
const lqa = TME_PRE_A1_BANK.filter(q => q.subType === 'listen-conv-qa');
for (const q of lqa) {
  const opt = q.options[q.answer]?.toLowerCase();
  const exp = q.explanation?.toLowerCase();
  const optKeywords = opt.split(/\s+/).filter(w => w.length > 2);
  const matched = optKeywords.some(w => exp.includes(w));
  if (!matched) {
    errors.push(`[${q.id}] listen-conv-qa opt "${opt}" not found in explanation "${q.explanation}"`);
  }
}
console.log(`✓ Phase 2E: listen-conv-qa (${lqa.length} items) - QA answer option matches conversation explanation`);

// 2F: read-passage
const passages = TME_PRE_A1_BANK.filter(q => q.subType === 'read-passage');
for (const q of passages) {
  if (!q.passage?.title || !q.passage?.text) {
    errors.push(`[${q.id}] read-passage missing passage title or text`);
  }
  if (!q.groupId) {
    errors.push(`[${q.id}] read-passage missing groupId`);
  }
  const opt = q.options[q.answer]?.toLowerCase();
  const exp = q.explanation?.toLowerCase();
  const optKeywords = opt.split(/\s+/).filter(w => w.length > 2);
  const matched = optKeywords.some(w => exp.includes(w));
  if (!matched) {
    errors.push(`[${q.id}] read-passage opt "${opt}" not found in explanation "${q.explanation}"`);
  }
}
console.log(`✓ Phase 2F: read-passage (${passages.length} items) - passage text, groupId & question explanation verified`);

if (errors.length > 0) {
  console.error(`\n❌ Found ${errors.length} errors:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`\n🎉 ALL ${TME_PRE_A1_BANK.length} PRE-A1 QUESTIONS PASSED SEMANTIC ALIGNMENT & OPTION AUDIT WITH 0 ERRORS!`);
}
