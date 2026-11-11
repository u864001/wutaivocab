import { HERE_WE_GO_MCQ_BANK } from '../src/data/hereWeGoMcqBank.js';
import { SAA_EXAM_BANK } from '../src/data/exam/saaExamBank.js';
import { TME_PRE_A1_BANK } from '../src/data/exam/tmePreA1Bank.js';

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

const BOILERPLATE_DISTRACTORS = new Set([
  'i am fine thank you',
  'nice to meet you too',
  'my name is leo',
  'i am ten years old',
  'i am very happy',
  'see you later',
  'have a nice day',
  "you're welcome",
  'you are welcome',
  'it is over there',
  'go straight',
  'turn left'
]);

let issues = [];
const seenGlobalIds = new Set();

// 1. Textbook MCQ Bank (3,317 questions)
for (const q of HERE_WE_GO_MCQ_BANK) {
  // 0. Unique ID check
  if (!q.id || seenGlobalIds.has(q.id)) {
    issues.push({ id: q.id, type: 'DUPLICATE_OR_MISSING_ID' });
  }
  seenGlobalIds.add(q.id);

  // 1. Answer Index must be 0
  if (q.answer !== 0) {
    issues.push({ id: q.id, type: 'NON_ZERO_ANSWER', detail: q.answer });
  }

  // 2. Options Count must be exactly 7
  if (!Array.isArray(q.options) || q.options.length !== 7) {
    issues.push({ id: q.id, type: 'NON_7_OPTIONS', count: q.options?.length });
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

  // 8. No generic boilerplate distractors in G-DLG
  if (q.taskType === 'G-DLG') {
    const normOpts = q.options.map(o => o.toLowerCase().replace(/[.,!]/g, '').trim());

    for (let i = 1; i < q.options.length; i++) {
      const clean = normOpts[i];
      if (BOILERPLATE_DISTRACTORS.has(clean)) {
        issues.push({ id: q.id, type: 'BOILERPLATE_DISTRACTOR_IN_GDLG', distractor: q.options[i] });
      }
    }

    // 8a. No simultaneous Yes, please. and No, thank you.
    if (normOpts.includes('yes please') && normOpts.includes('no thank you')) {
      issues.push({ id: q.id, type: 'MULTI_POLITE_OFFER_ANSWERS', question: q.question });
    }

    // 8b. No simultaneous specific preposition location and general "over there"
    if (/(?:where's|where\s+(?:is|are))/i.test(q.question)) {
      const hasSpecific = normOpts.some(o => /^(?:it'?s|they'?re)\s+(?:in|on|under|next to|at)\s+/i.test(o));
      const hasOverThere = normOpts.some(o => /over there/i.test(o));
      if (hasSpecific && hasOverThere) {
        issues.push({ id: q.id, type: 'WHERE_MULTI_LOCATION_ANSWERS', question: q.question });
      }
    }

    // 8c. No multiple valid times without explicit clue in question
    if (/What time is it/i.test(q.question) && !/\(\d+:\d+\)/.test(q.question)) {
      const oclockTimes = normOpts.filter(o => /o'clock|thirty/.test(o) && /^(?:it'?s|it is)\s+/i.test(o));
      if (oclockTimes.length > 1) {
        issues.push({ id: q.id, type: 'TIME_MULTI_VALID_ANSWERS', question: q.question, oclockTimes });
      }
    }

    // 8d. Yes/No answer vs explanation consistency
    const ans = (q.options[0] || '').trim();
    const exp = q.explanation || '';
    if (/^yes\b/i.test(ans) && /(否定|選\s*「?no\b)/i.test(exp) && !/(肯定|選\s*「?yes\b)/i.test(exp)) {
      issues.push({ id: q.id, type: 'YES_ANSWER_BUT_EXPLANATION_SAYS_NEGATIVE', answer: ans, explanation: exp });
    }
    if (/^no\b/i.test(ans) && /(肯定|選\s*「?yes\b)/i.test(exp) && !/(否定|選\s*「?no\b)/i.test(exp)) {
      issues.push({ id: q.id, type: 'NO_ANSWER_BUT_EXPLANATION_SAYS_AFFIRMATIVE', answer: ans, explanation: exp });
    }
  }

  // 9. Option formatting: no double dots
  if (Array.isArray(q.options)) {
    for (const o of q.options) {
      if (typeof o === 'string' && /(?<!\.)\.\.(?!\.)/.test(o)) {
        issues.push({ id: q.id, type: 'DOUBLE_PERIOD_IN_OPTION', option: o });
      }
    }
  }

  // 10. Listening tasks (L-WORD / L-RESP) must have media.audioText, use fixed stems, and never leak transcript in question stem
  if (q.taskType === 'L-WORD' || q.taskType === 'L-RESP') {
    const expectedStem = q.taskType === 'L-WORD'
      ? '【聽力：聽音選字】請聽英語發音，選出聽到的單字：'
      : '【聽力：聽問句選回應】請聽英語問句，選出最適合的回應句：';
    const audioText = q.media?.audioText?.trim();
    if (!audioText) {
      issues.push({ id: q.id, type: 'MISSING_LISTENING_AUDIO_TEXT', taskType: q.taskType });
    } else if (q.question && q.question.toLowerCase().includes(audioText.toLowerCase())) {
      issues.push({ id: q.id, type: 'LISTENING_TRANSCRIPT_LEAK_IN_STEM', question: q.question, audioText });
    }
    if (q.question !== expectedStem) {
      issues.push({ id: q.id, type: 'NON_STANDARD_LISTENING_STEM', question: q.question, expectedStem });
    }
  }
}

// 2. TME Pre-A1 Exam Bank (300 questions)
for (const q of TME_PRE_A1_BANK) {
  if (['S-WORD', 'S-SENT', 'S-READ'].includes(q.taskType)) {
    if (!q.options || q.options.length !== 1) {
      issues.push({ id: q.id, type: 'TME_SPEAKING_INVALID_OPTIONS', count: q.options?.length });
    }
  } else if (q.taskType === 'R-TF') {
    if (!q.options || q.options.length !== 2) {
      issues.push({ id: q.id, type: 'TME_TF_INVALID_OPTIONS', count: q.options?.length });
    }
  } else if (['W-SCRAMBLE', 'R-COMP'].includes(q.taskType)) {
    if (!q.options || q.options.length !== 4) {
      issues.push({ id: q.id, type: 'TME_PASSAGE_OR_SCRAMBLE_INVALID_OPTIONS', count: q.options?.length });
    }
  } else {
    // Standard TME MCQs must have exactly 7 options and answer 0
    if (!q.options || q.options.length !== 7) {
      issues.push({ id: q.id, type: 'TME_MCQ_NON_7_OPTIONS', count: q.options?.length });
    }
    if (q.answer !== 0) {
      issues.push({ id: q.id, type: 'TME_MCQ_NON_ZERO_ANSWER', answer: q.answer });
    }
  }

  if (Array.isArray(q.options) && q.options.length > 1) {
    const trimmed = q.options.map(o => String(o || '').toLowerCase().trim());
    if (new Set(trimmed).size !== q.options.length) {
      issues.push({ id: q.id, type: 'TME_DUPLICATE_OPTIONS', options: q.options });
    }
  }

  // Option formatting: no double dots
  if (Array.isArray(q.options)) {
    for (const o of q.options) {
      if (typeof o === 'string' && /(?<!\.)\.\.(?!\.)/.test(o)) {
        issues.push({ id: q.id, type: 'DOUBLE_PERIOD_IN_OPTION', option: o });
      }
    }
  }

  // ID check
  if (!q.id || seenGlobalIds.has(q.id)) {
    issues.push({ id: q.id, type: 'DUPLICATE_OR_MISSING_ID' });
  }
  seenGlobalIds.add(q.id);
}

// 3. SAA Exam Bank (285 questions)
for (const q of SAA_EXAM_BANK) {
  if (q.section === 'listening' && q.question && /[\n\s(（](音檔|問句|對話|廣播)[：:]/i.test(q.question)) {
    issues.push({ id: q.id, type: 'SAA_LISTENING_TRANSCRIPT_LEAK', question: q.question });
  }

  // Option formatting: no double dots
  if (Array.isArray(q.options)) {
    for (const o of q.options) {
      if (typeof o === 'string' && /(?<!\.)\.\.(?!\.)/.test(o)) {
        issues.push({ id: q.id, type: 'DOUBLE_PERIOD_IN_OPTION', option: o });
      }
    }
  }

  // ID check
  if (!q.id || seenGlobalIds.has(q.id)) {
    issues.push({ id: q.id, type: 'DUPLICATE_OR_MISSING_ID' });
  }
  seenGlobalIds.add(q.id);
}

if (issues.length > 0) {
  console.error(`❌ Found ${issues.length} semantic issues!`);
  console.error(JSON.stringify(issues.slice(0, 10), null, 2));
  process.exit(1);
} else {
  console.log(`✓ All ${HERE_WE_GO_MCQ_BANK.length} MCQs, ${TME_PRE_A1_BANK.length} TME items, & ${SAA_EXAM_BANK.length} SAA items passed extended semantic quality gate with ZERO issues!`);
}

