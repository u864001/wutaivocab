const fs = require('fs');

console.log('--- UPDATING SPELLING GAME FOR ALPHABET MODE ---');

let spelling = fs.readFileSync('src/games/spelling/SpellingGame.jsx', 'utf8');

if (!spelling.includes('generateSpellingAlphabetQuestion')) {
  // 1. Add import
  spelling = spelling.replace(
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';",
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';\r\nimport { generateSpellingAlphabetQuestion } from '../../services/alphabetEngine';"
  ).replace(
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';",
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';\nimport { generateSpellingAlphabetQuestion } from '../../services/alphabetEngine';"
  );

  // 2. Add isAlphabetMode
  spelling = spelling.replace(
    "  const { t } = useI18n();",
    `  const { t } = useI18n();
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );`
  );

  // 3. Update useEffect for queue generation
  const oldUseEffect = `  useEffect(() => {
    let filtered = words.filter(w => (settings?.selectedUnits || []).includes(\`\${w.book}-\${w.lesson}\`));
    if (filtered.length === 0 && words.length > 0) {
      filtered = words;
    }
    let shuffled = [...filtered].sort(() => 0.5 - Math.random());
    if (settings.count !== 'all') {
      shuffled = shuffled.slice(0, parseInt(settings.count, 10));
    }
    setQueue(shuffled);
    queueRef.current = shuffled;
    initialCountRef.current = shuffled.length;
    historyWordsRef.current.clear();
    mistakeIdsRef.current.clear();
    shuffled.forEach(w => historyWordsRef.current.set(w.id, { id: w.id, en: w.en, zh: w.zh }));
  }, [settings, words]);`;

  const newUseEffect = `  useEffect(() => {
    if (isAlphabetMode) {
      const qCount = settings?.count !== 'all' ? (parseInt(settings.count, 10) || 10) : 10;
      const alphaQuestions = Array.from({ length: qCount }, (_, i) => {
        const q = generateSpellingAlphabetQuestion(i);
        return {
          id: q.id,
          isAlphabet: true,
          isUpper: q.isUpper,
          en: q.targetWord,
          zh: q.meaningZh,
          promptZh: q.promptZh,
          slots: q.slots,
          candidateTiles: q.candidateTiles
        };
      });
      setQueue(alphaQuestions);
      queueRef.current = alphaQuestions;
      initialCountRef.current = alphaQuestions.length;
      historyWordsRef.current.clear();
      mistakeIdsRef.current.clear();
      alphaQuestions.forEach(w => historyWordsRef.current.set(w.id, { id: w.id, en: w.en, zh: w.zh }));
      return;
    }

    let filtered = words.filter(w => (settings?.selectedUnits || []).includes(\`\${w.book}-\${w.lesson}\`));
    if (filtered.length === 0 && words.length > 0) {
      filtered = words;
    }
    let shuffled = [...filtered].sort(() => 0.5 - Math.random());
    if (settings.count !== 'all') {
      shuffled = shuffled.slice(0, parseInt(settings.count, 10));
    }
    setQueue(shuffled);
    queueRef.current = shuffled;
    initialCountRef.current = shuffled.length;
    historyWordsRef.current.clear();
    mistakeIdsRef.current.clear();
    shuffled.forEach(w => historyWordsRef.current.set(w.id, { id: w.id, en: w.en, zh: w.zh }));
  }, [settings, words, isAlphabetMode]);`;

  spelling = spelling.replace(oldUseEffect, newUseEffect)
    .replace(oldUseEffect.replace(/\r\n/g, '\n'), newUseEffect);

  // 4. Update loadWord for alphabet mode
  const oldLoadWordStart = `  const loadWord = (wordObj) => {
    if (!wordObj || !wordObj.en) return;
    setCurrentWord(wordObj);
    currentWordRef.current = wordObj;`;

  const newLoadWordStart = `  const loadWord = (wordObj) => {
    if (!wordObj || !wordObj.en) return;

    if (wordObj.isAlphabet) {
      setCurrentWord(wordObj);
      currentWordRef.current = wordObj;
      setWordGroups([{
        word: wordObj.en,
        slots: wordObj.slots.map(s => ({
          char: s.expectedChar,
          slotIndex: s.slotIndex,
          isGiven: s.isGiven
        }))
      }]);
      setCleanTarget(wordObj.en);
      cleanTargetRef.current = wordObj.en;

      const initSlots = wordObj.slots.map(s => s.isGiven ? { char: s.initialChar, isGiven: true } : null);
      setSlots(initSlots);
      slotsRef.current = initSlots;

      const tileLetters = wordObj.candidateTiles.map(t => ({
        id: t.id,
        char: t.char,
        isPlaced: false
      }));
      setLetters(tileLetters);
      lettersRef.current = tileLetters;

      setLives(5);
      setFeedback(null);
      feedbackRef.current = null;
      setTimeout(() => speakEnglish(wordObj.en.split('').join(' ')), 250);
      return;
    }

    setCurrentWord(wordObj);
    currentWordRef.current = wordObj;`;

  spelling = spelling.replace(oldLoadWordStart, newLoadWordStart)
    .replace(oldLoadWordStart.replace(/\r\n/g, '\n'), newLoadWordStart);

  // 5. Update letter clicks and drag-drop for case sensitivity in alphabet mode
  spelling = spelling.replace(
    "    if (letter.char === targetChar) {",
    `    const isMatch = isAlphabetMode ? letter.char === targetChar : letter.char.toLowerCase() === targetChar.toLowerCase();\r\n    if (isMatch) {`
  ).replace(
    "    if (letter.char === targetChar) {",
    `    const isMatch = isAlphabetMode ? letter.char === targetChar : letter.char.toLowerCase() === targetChar.toLowerCase();\n    if (isMatch) {`
  );

  spelling = spelling.replace(
    "    if (letterObj.char === expectedChar) {",
    `    const isMatch = isAlphabetMode ? letterObj.char === expectedChar : letterObj.char.toLowerCase() === expectedChar.toLowerCase();\r\n    if (isMatch) {`
  ).replace(
    "    if (letterObj.char === expectedChar) {",
    `    const isMatch = isAlphabetMode ? letterObj.char === expectedChar : letterObj.char.toLowerCase() === expectedChar.toLowerCase();\n    if (isMatch) {`
  );

  // 6. Update keyboard typing
  spelling = spelling.replace(
    "      const pressedKey = e.key.toLowerCase();\r\n      if (!/[a-z]/.test(pressedKey)) return;\r\n\r\n      const currentSlots = slotsRef.current;\r\n      const nextEmptyIndex = currentSlots.findIndex(s => s === null);\r\n      if (nextEmptyIndex === -1) return;\r\n\r\n      const targetChar = cleanTargetRef.current[nextEmptyIndex];\r\n\r\n      if (pressedKey === targetChar) {",
    `      const pressedKey = isAlphabetMode ? (currentWordRef.current?.isUpper ? e.key.toUpperCase() : e.key.toLowerCase()) : e.key.toLowerCase();
      if (!/[a-zA-Z]/.test(e.key)) return;

      const currentSlots = slotsRef.current;
      const nextEmptyIndex = currentSlots.findIndex(s => s === null);
      if (nextEmptyIndex === -1) return;

      const targetChar = cleanTargetRef.current[nextEmptyIndex];
      const isMatch = isAlphabetMode ? pressedKey === targetChar : pressedKey === targetChar.toLowerCase();

      if (isMatch) {`
  ).replace(
    "      const pressedKey = e.key.toLowerCase();\n      if (!/[a-z]/.test(pressedKey)) return;\n\n      const currentSlots = slotsRef.current;\n      const nextEmptyIndex = currentSlots.findIndex(s => s === null);\n      if (nextEmptyIndex === -1) return;\n\n      const targetChar = cleanTargetRef.current[nextEmptyIndex];\n\n      if (pressedKey === targetChar) {",
    `      const pressedKey = isAlphabetMode ? (currentWordRef.current?.isUpper ? e.key.toUpperCase() : e.key.toLowerCase()) : e.key.toLowerCase();
      if (!/[a-zA-Z]/.test(e.key)) return;

      const currentSlots = slotsRef.current;
      const nextEmptyIndex = currentSlots.findIndex(s => s === null);
      if (nextEmptyIndex === -1) return;

      const targetChar = cleanTargetRef.current[nextEmptyIndex];
      const isMatch = isAlphabetMode ? pressedKey === targetChar : pressedKey === targetChar.toLowerCase();

      if (isMatch) {`
  );

  // 7. Update HonorSubmissionCard
  spelling = spelling.replace(
    "mode=\"spelling\"\r\n            book={qualifyingBook}\r\n            score={firstAttemptPerfect}\r\n            time={elapsedTime}\r\n            totalCount={totalWords}\r\n            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(', ')}",
    `mode={isAlphabetMode ? 'spelling-abc' : 'spelling'}
            book={isAlphabetMode ? 'abc' : qualifyingBook}
            score={firstAttemptPerfect}
            time={elapsedTime}
            totalCount={totalWords}
            rangeText={isAlphabetMode ? 'Aa 字母連續序列拼裝' : (qualifyingBook ? \`第 \${qualifyingBook} 冊\` : settings.selectedUnits.slice(0, 3).join(', '))}`
  ).replace(
    "mode=\"spelling\"\n            book={qualifyingBook}\n            score={firstAttemptPerfect}\n            time={elapsedTime}\n            totalCount={totalWords}\n            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(', ')}",
    `mode={isAlphabetMode ? 'spelling-abc' : 'spelling'}
            book={isAlphabetMode ? 'abc' : qualifyingBook}
            score={firstAttemptPerfect}
            time={elapsedTime}
            totalCount={totalWords}
            rangeText={isAlphabetMode ? 'Aa 字母連續序列拼裝' : (qualifyingBook ? \`第 \${qualifyingBook} 冊\` : settings.selectedUnits.slice(0, 3).join(', '))}`
  );

  fs.writeFileSync('src/games/spelling/SpellingGame.jsx', spelling, 'utf8');
  console.log('SpellingGame.jsx successfully updated for Alphabet Mode!');
} else {
  console.log('SpellingGame.jsx already updated.');
}
