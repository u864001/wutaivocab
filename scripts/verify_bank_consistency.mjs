import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';

const mismatches = [];
for (const q of TME_PRE_A1_BANK) {
  const correctOpt = String(q.options?.[q.answer] || '').toLowerCase().trim();
  const exp = String(q.explanation || '').toLowerCase();
  
  // For True/False or long sentences, check differently
  if (correctOpt.includes('true') || correctOpt.includes('false')) continue;
  if (q.category === 'writing') continue;
  
  // For single words or short phrases, check if key words appear in explanation
  const words = correctOpt.split(/\s+/).filter(w => w.length > 2);
  const matched = words.some(w => exp.includes(w));
  if (!matched && correctOpt.length > 1) {
    mismatches.push({
      id: q.id,
      category: q.category,
      subType: q.subType,
      correctOpt,
      options: q.options,
      explanation: q.explanation
    });
  }
}

console.log(`Found ${mismatches.length} potential mismatches:`);
mismatches.forEach(m => {
  console.log(`- [${m.id}] (${m.subType}) CorrectOpt: "${m.correctOpt}" | Exp: "${m.explanation}"`);
});
