// Test script for Dynamic Distractor Sampling in Exam Runner
import assert from 'node:assert';

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function prepareExamQuestions(sourceList) {
  return sourceList.map((q) => {
    const isTrueFalse = q.subType === 'read-truefalse' || (q.options?.length === 2 && (q.options[0]?.includes('True') || q.options[0]?.includes('相符')));
    if (q.preserveOptionOrder || isTrueFalse) {
      return {
        ...q,
        options: [...q.options],
        optionImages: q.optionImages ? [...q.optionImages] : undefined,
        answer: q.answer
      };
    }

    const hasOptionImages = Array.isArray(q.optionImages) && q.optionImages.length === q.options.length;
    const combined = q.options.map((text, idx) => ({
      text,
      img: hasOptionImages ? q.optionImages[idx] : null,
      isCorrect: idx === q.answer
    }));

    const targetCount = Math.max(2, Math.min(combined.length, q.targetOptionCount || (combined.length <= 4 ? combined.length : 4)));

    let workingSet = combined;
    if (combined.length > targetCount) {
      const correctItem = combined.find((c) => c.isCorrect) || combined[0];
      const distractorPool = combined.filter((c) => !c.isCorrect);

      for (let i = distractorPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [distractorPool[i], distractorPool[j]] = [distractorPool[j], distractorPool[i]];
      }
      const sampledDistractors = distractorPool.slice(0, targetCount - 1);
      workingSet = [correctItem, ...sampledDistractors];
    }

    for (let i = workingSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [workingSet[i], workingSet[j]] = [workingSet[j], workingSet[i]];
    }

    return {
      ...q,
      options: workingSet.map((c, idx) => {
        if (hasOptionImages && (/^圖片\s*\([A-Z0-9]\)$/.test(c.text) || /^選項\s*\([A-Z0-9]\)$/.test(c.text))) {
          return `圖片 (${CHOICE_LABELS[idx] || idx + 1})`;
        }
        return c.text;
      }),
      optionImages: hasOptionImages ? workingSet.map((c) => c.img) : q.optionImages,
      answer: workingSet.findIndex((c) => c.isCorrect)
    };
  });
}

// 1. Test 7 options sampling to 4 options (C(6, 3))
const q7 = {
  id: 'test-7',
  options: ['cat', 'dog', 'pig', 'bird', 'rabbit', 'elephant', 'monkey'],
  answer: 0
};
const results7 = [];
for (let iter = 0; iter < 100; iter++) {
  const [prep] = prepareExamQuestions([q7]);
  assert.strictEqual(prep.options.length, 4, 'Should have exactly 4 options');
  assert.ok(prep.options.includes('cat'), 'Should always include correct answer cat');
  assert.strictEqual(prep.options[prep.answer], 'cat', 'Answer index must point to cat');
  assert.ok(prep.answer >= 0 && prep.answer <= 3, 'Answer index within 0-3');
  results7.push(prep.options.join(','));
}
const uniquePerms7 = new Set(results7);
console.log(`[PASS] 7-option question: 100 runs generated ${uniquePerms7.size} distinct combinations!`);
assert.ok(uniquePerms7.size >= 10, 'Should generate high variation of options');

// 2. Test 7 options with images sampling to 4 options
const qImg = {
  id: 'test-img',
  options: ['圖片 (A)', '圖片 (B)', '圖片 (C)', '圖片 (D)', '圖片 (E)', '圖片 (F)', '圖片 (G)'],
  optionImages: [
    '/assets/apple.svg',
    '/assets/banana.svg',
    '/assets/orange.svg',
    '/assets/grape.svg',
    '/assets/cake.svg',
    '/assets/bread.svg',
    '/assets/cookie.svg'
  ],
  answer: 0
};
for (let iter = 0; iter < 50; iter++) {
  const [prep] = prepareExamQuestions([qImg]);
  assert.strictEqual(prep.options.length, 4);
  assert.strictEqual(prep.optionImages.length, 4);
  assert.ok(prep.optionImages.includes('/assets/apple.svg'));
  assert.strictEqual(prep.optionImages[prep.answer], '/assets/apple.svg');
  // Check label matches slot index
  prep.options.forEach((optText, idx) => {
    assert.strictEqual(optText, `圖片 (${CHOICE_LABELS[idx]})`);
  });
}
console.log('[PASS] Image coupled sampling test passed!');

// 3. Test 4 options (standard backward compatibility)
const q4 = {
  id: 'test-4',
  options: ['A', 'B', 'C', 'D'],
  answer: 0
};
const [prep4] = prepareExamQuestions([q4]);
assert.strictEqual(prep4.options.length, 4);
assert.strictEqual(prep4.options[prep4.answer], 'A');
console.log('[PASS] 4-option backward compatibility test passed!');

// 4. Test True/False (2 options)
const qTf = {
  id: 'test-tf',
  subType: 'read-truefalse',
  options: ['True (相符)', 'False (不相符)'],
  answer: 0
};
const [prepTf] = prepareExamQuestions([qTf]);
assert.strictEqual(prepTf.options.length, 2);
assert.strictEqual(prepTf.options[0], 'True (相符)');
assert.strictEqual(prepTf.answer, 0);
console.log('[PASS] True/False preservation test passed!');

// 5. Test targetOptionCount = 3 with 6 options (C(5, 2))
const q3 = {
  id: 'test-3',
  targetOptionCount: 3,
  options: ['red', 'blue', 'green', 'yellow', 'purple', 'black'],
  answer: 0
};
for (let iter = 0; iter < 30; iter++) {
  const [prep] = prepareExamQuestions([q3]);
  assert.strictEqual(prep.options.length, 3);
  assert.ok(prep.options.includes('red'));
  assert.strictEqual(prep.options[prep.answer], 'red');
}
console.log('[PASS] targetOptionCount: 3 test passed!');

console.log('\n=== ALL SAMPLER UNIT TESTS PASSED 100% ===');
