const TRACK_ALIASES = {
  curriculum: 'curriculum',
  textbook: 'curriculum',
  'ministry-assessment': 'ministry-assessment',
  saa: 'ministry-assessment',
  'tme-preA1': 'tme-preA1',
  prea1: 'tme-preA1'
};

export const MISTAKE_SOURCE_OPTIONS = [
  { id: 'all', label: '全部' },
  { id: 'curriculum', label: '課本' },
  { id: 'ministry-assessment', label: 'SAA' },
  { id: 'tme-preA1', label: 'Pre-A1' }
];

export function normalizeMistakeTrack(question) {
  const raw = question?.sourceTrack || question?.track || 'curriculum';
  return TRACK_ALIASES[raw] || 'curriculum';
}

export function filterMistakesBySource(questions, source = 'all') {
  if (source === 'all') return [...questions];
  return questions.filter((question) => normalizeMistakeTrack(question) === source);
}

export function resolveMistakeRecord(mistakeMap, question) {
  const canonicalId = question?.canonicalId || question?.id;
  return mistakeMap?.[canonicalId] || mistakeMap?.[question?.id] || null;
}

export function getMistakeAttemptLimit(selectedLimit, availableCount) {
  if (selectedLimit === 'all') return Math.max(0, Number(availableCount) * 2);
  return Math.max(0, Number(selectedLimit) || 0);
}

// A review cohort is deliberately capped at half of the attempt budget. This
// gives every selected mistake a second encounter and leaves extra rounds when
// the source pool is smaller than the chosen maximum (for example 8 mistakes
// with a 20-attempt cap can finish after 16 correct attempts or keep retrying).
export function buildMistakeReviewSequence(questions, mistakeMap, maxAttempts) {
  const limit = Math.max(0, Number(maxAttempts) || 0);
  if (!limit || questions.length === 0) return [];

  const seen = new Set();
  const ranked = questions
    .filter((question) => {
      const id = question?.canonicalId || question?.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((a, b) => {
      const aRec = resolveMistakeRecord(mistakeMap, a) || {};
      const bRec = resolveMistakeRecord(mistakeMap, b) || {};
      const wrongDelta = (bRec.wrongCount || 0) - (aRec.wrongCount || 0);
      if (wrongDelta !== 0) return wrongDelta;
      return (aRec.updatedAt || 0) - (bRec.updatedAt || 0);
    });

  const cohortSize = Math.min(ranked.length, Math.max(1, Math.floor(limit / 2)));
  const cohort = ranked.slice(0, cohortSize);
  const sequence = [];

  while (sequence.length < limit && cohort.length > 0) {
    for (const question of cohort) {
      if (sequence.length >= limit) break;
      sequence.push(question);
    }
  }

  return sequence;
}

export function applyMistakeAttempt(mistakeMap, question, isCorrect, now = Date.now()) {
  const next = { ...(mistakeMap || {}) };
  const canonicalId = question?.canonicalId || question?.id;
  const legacyId = question?.id;
  const current = resolveMistakeRecord(next, question);

  if (!canonicalId || !current) return next;
  if (legacyId && legacyId !== canonicalId) delete next[legacyId];

  if (isCorrect) {
    const streak = (current.streak || 0) + 1;
    if (streak >= 2) {
      delete next[canonicalId];
    } else {
      next[canonicalId] = { ...current, streak, updatedAt: now };
    }
  } else {
    next[canonicalId] = {
      ...current,
      wrongCount: (current.wrongCount || 0) + 1,
      streak: 0,
      updatedAt: now
    };
  }

  return next;
}

export function simulateMistakeAttempts(initialMap, questions, answers, endIndex) {
  let next = { ...(initialMap || {}) };
  const finalIndex = Math.min(Number(endIndex), questions.length - 1);

  for (let index = 0; index <= finalIndex; index += 1) {
    if (answers[index] === undefined) continue;
    next = applyMistakeAttempt(next, questions[index], answers[index] === questions[index].answer, index + 1);
  }

  return next;
}

export function isMistakeSourceCleared(mistakeMap, sourceQuestions) {
  return sourceQuestions.every((question) => !resolveMistakeRecord(mistakeMap, question));
}
