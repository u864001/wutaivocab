import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';

const subTypes = {};
for (const q of TME_PRE_A1_BANK) {
  if (!subTypes[q.subType]) subTypes[q.subType] = [];
  subTypes[q.subType].push(q);
}

for (const [st, list] of Object.entries(subTypes)) {
  console.log(`\n=== SubType: ${st} (${list.length} items) ===`);
  for (const q of list.slice(0, 3)) {
    console.log(`- [${q.id}] Q: "${(q.question || '').replace(/\n/g, ' ')}" | Ans[${q.answer}]: "${q.options?.[q.answer]}" | Exp: "${q.explanation}"`);
  }
}
