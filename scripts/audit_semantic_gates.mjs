import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';

console.log('══════════════════════════════════════════════════════════════');
console.log('  RUNNING DEEP MCQ SEMANTIC & PLAYABILITY QUALITY GATE       ');
console.log('══════════════════════════════════════════════════════════════');

const normalize = s => s.toLowerCase()
  .replace(/i'm/g, 'i am')
  .replace(/what's/g, 'what is')
  .replace(/how's/g, 'how is')
  .replace(/it's/g, 'it is')
  .replace(/they're/g, 'they are')
  .replace(/we're/g, 'we are')
  .replace(/he's/g, 'he is')
  .replace(/she's/g, 'she is')
  .replace(/that's/g, 'that is')
  .replace(/there's/g, 'there is')
  .replace(/who's/g, 'who is')
  .replace(/where's/g, 'where is')
  .replace(/can't/g, 'cannot')
  .replace(/don't/g, 'do not')
  .replace(/doesn't/g, 'does not')
  .replace(/isn't/g, 'is not')
  .replace(/aren't/g, 'are not')
  .replace(/[.,?!]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

let issues = [];

for (const q of HERE_WE_GO_MCQ_BANK) {
  // 1. Answer Index
  if (q.answer !== 0) {
    issues.push({ id: q.id, type: 'NON_ZERO_ANSWER', detail: q.answer });
  }

  // 2. Options Count & Uniqueness
  if (!Array.isArray(q.options) || q.options.length < 4) {
    issues.push({ id: q.id, type: 'INSUFFICIENT_OPTIONS', count: q.options?.length });
  } else {
    const trimmed = q.options.map(o => String(o || '').toLowerCase().trim());
    if (new Set(trimmed).size !== q.options.length) {
      issues.push({ id: q.id, type: 'DUPLICATE_OPTIONS', options: q.options });
    }
  }

  // 3. Contraction / Synonymous clash with answer
  const normAns = normalize(q.options[0]);
  if (normAns.length > 0) {
    for (let i = 1; i < q.options.length; i++) {
      if (normalize(q.options[i]) === normAns) {
        issues.push({ id: q.id, type: 'CONTRACTION_CLASH', answer: q.options[0], distractor: q.options[i] });
      }
    }
  }

  // 4. Letter ambiguity in G1/G2
  if ((q.book === 'g1' || q.book === 'g2') && (/後面的字母/.test(q.question) || /前面的字母/.test(q.question)) && !/緊接/.test(q.question)) {
    issues.push({ id: q.id, type: 'AMBIGUOUS_LETTER_ORDER', question: q.question });
  }
}

if (issues.length > 0) {
  console.error(`❌ Found ${issues.length} semantic issues!`);
  console.error(JSON.stringify(issues.slice(0, 10), null, 2));
  process.exit(1);
} else {
  console.log(`✓ All ${HERE_WE_GO_MCQ_BANK.length} MCQs passed semantic quality gate with ZERO issues!`);
}
