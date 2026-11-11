import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';
import { SAA_EXAM_BANK } from '../src/data/exam/saaExamBank.js';

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

const getUnitForChar = (ch, book) => {
  const code = ch.toUpperCase().charCodeAt(0);
  if (code >= 65 && code <= 71) return book === 'g1' ? 'Unit 1 (A~G)' : 'Unit 1 (Aa~Gg)';
  if (code >= 72 && code <= 78) return book === 'g1' ? 'Unit 2 (H~N)' : 'Unit 2 (Hh~Nn)';
  if (code >= 79 && code <= 84) return book === 'g1' ? 'Unit 3 (O~T)' : 'Unit 3 (Oo~Tt)';
  if (code >= 85 && code <= 90) return book === 'g1' ? 'Unit 4 (U~Z)' : 'Unit 4 (Uu~Zz)';
  return null;
};

const getTargetChar = (q) => {
  const m = q.question.match(/「([A-Za-z])」/);
  if (m) return m[1];
  if (q.options && typeof q.options[0] === 'string' && q.options[0].length === 1 && /[A-Za-z]/.test(q.options[0])) {
    return q.options[0];
  }
  return null;
};

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

  // 5. Unit bounds for G1/G2 alphabet questions
  if (q.book === 'g1' || q.book === 'g2') {
    const ch = getTargetChar(q);
    if (ch) {
      const expectedUnit = getUnitForChar(ch, q.book);
      if (expectedUnit && q.unit !== expectedUnit) {
        issues.push({ id: q.id, type: 'ALPHABET_UNIT_MISMATCH', target: ch, currentUnit: q.unit, expectedUnit });
      }
    }
  }

  // 6. Blank format: all underscores must be exactly 6 underscores
  const underMatches = q.question.match(/_{2,}/g);
  if (underMatches) {
    for (const m of underMatches) {
      if (m.length !== 6) {
        issues.push({ id: q.id, type: 'INVALID_UNDERSCORE_LENGTH', length: m.length, question: q.question });
      }
    }
  }

  // 7. No be verbs in alphabet questions
  if ((q.book === 'g1' || q.book === 'g2' || q.taskType?.startsWith('A-')) && q.options?.some(o => /^(am|is|are|was|were)$/i.test(o.trim()))) {
    issues.push({ id: q.id, type: 'NON_HOMOGENEOUS_BE_IN_ALPHABET', options: q.options });
  }
}

// 8. SAA Listening questions must not leak audio text in question prompt
for (const q of SAA_EXAM_BANK) {
  if (q.section === 'listening' && q.question && /[\n\s(（](音檔|問句|對話|廣播)[：:]/i.test(q.question)) {
    issues.push({ id: q.id, type: 'SAA_LISTENING_TRANSCRIPT_LEAK', question: q.question });
  }
}

if (issues.length > 0) {
  console.error(`❌ Found ${issues.length} semantic issues!`);
  console.error(JSON.stringify(issues.slice(0, 10), null, 2));
  process.exit(1);
} else {
  console.log(`✓ All ${HERE_WE_GO_MCQ_BANK.length} MCQs & ${SAA_EXAM_BANK.length} SAA items passed extended semantic quality gate with ZERO issues!`);
}
