const fs = require('fs');

console.log('--- STARTING ALPHABET UNIVERSE IMPLEMENTATION ---');

// ══════════════════════════════════════════════════════════════
// 1. App.jsx: Allow 'abc' to directly qualify as qualifyingBook
// ══════════════════════════════════════════════════════════════
let app = fs.readFileSync('src/App.jsx', 'utf8');
if (!app.includes("settings.selectedUnits.includes('abc')")) {
  app = app.replace(
    '  // 榮譽榜資格判斷：僅能選同冊，且超過 20 字，或者包含兩個以上的正常單元 (unit1, 2, 3, 4 取至少二)\r\n  const qualifyingBook = useMemo(() => {\r\n    if (!settings.selectedUnits || settings.selectedUnits.length === 0) return null;',
    `  // 榮譽榜資格判斷：低年級 abc 模式直接合格；中高年級僅能選同冊且超過 20 字或 2 單元以上
  const qualifyingBook = useMemo(() => {
    if (!settings.selectedUnits || settings.selectedUnits.length === 0) return null;

    // 低年級 Aa 字母全套模式直接認可為合格冊別 'abc'
    if (settings.selectedUnits.includes('abc') || settings.alphaMode) {
      return 'abc';
    }`
  ).replace(
    '  // 榮譽榜資格判斷：僅能選同冊，且超過 20 字，或者包含兩個以上的正常單元 (unit1, 2, 3, 4 取至少二)\n  const qualifyingBook = useMemo(() => {\n    if (!settings.selectedUnits || settings.selectedUnits.length === 0) return null;',
    `  // 榮譽榜資格判斷：低年級 abc 模式直接合格；中高年級僅能選同冊且超過 20 字或 2 單元以上
  const qualifyingBook = useMemo(() => {
    if (!settings.selectedUnits || settings.selectedUnits.length === 0) return null;

    // 低年級 Aa 字母全套模式直接認可為合格冊別 'abc'
    if (settings.selectedUnits.includes('abc') || settings.alphaMode) {
      return 'abc';
    }`
  );
  fs.writeFileSync('src/App.jsx', app, 'utf8');
  console.log('App.jsx updated.');
} else {
  console.log('App.jsx already has abc qualification.');
}

// ══════════════════════════════════════════════════════════════
// 2. SnakeGame.jsx: Alphabet Cruise Mode (A to Z cycle)
// ══════════════════════════════════════════════════════════════
let snake = fs.readFileSync('src/games/snake/SnakeGame.jsx', 'utf8');
if (!snake.includes('alphabetEngine')) {
  snake = snake.replace(
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';",
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';\r\nimport { getSnakeNextLetter, UPPERCASE_ALPHABET } from '../../services/alphabetEngine';"
  );

  // Add isAlphabetMode and alphaIndex
  snake = snake.replace(
    "  const [currentWord, setCurrentWord] = useState(null);",
    `  // 低年級 Aa 字母巡航模式判斷
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );
  const alphaIndexRef = useRef(0);
  const [currentWord, setCurrentWord] = useState(null);`
  );

  // Update handleStart check to allow alphabet mode without regular vocab
  snake = snake.replace(
    "    const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));\r\n    if (filtered.length === 0) {\r\n      alert('請先在主畫面勾選複習範圍！');\r\n      return onBack();\r\n    }",
    `    const isAlpha = qualifyingBook === 'abc' || (settings?.selectedUnits && settings.selectedUnits.includes('abc')) || settings?.alphaMode;
    const filtered = isAlpha ? [{ id: 'alpha_start', en: 'ALPHABET', zh: '26 字母巡航' }] : words.filter(w => settings.selectedUnits.includes(\`\${w.book}-\${w.lesson}\`));
    if (!isAlpha && filtered.length === 0) {
      alert('請先在主畫面勾選複習範圍！');
      return onBack();
    }`
  ).replace(
    "    const filtered = words.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));\n    if (filtered.length === 0) {\n      alert('請先在主畫面勾選複習範圍！');\n      return onBack();\n    }",
    `    const isAlpha = qualifyingBook === 'abc' || (settings?.selectedUnits && settings.selectedUnits.includes('abc')) || settings?.alphaMode;
    const filtered = isAlpha ? [{ id: 'alpha_start', en: 'ALPHABET', zh: '26 字母巡航' }] : words.filter(w => settings.selectedUnits.includes(\`\${w.book}-\${w.lesson}\`));
    if (!isAlpha && filtered.length === 0) {
      alert('請先在主畫面勾選複習範圍！');
      return onBack();
    }`
  );

  // Update loadNextWord for alphabet mode
  const newLoadNextWord = `  const loadNextWord = () => {
    if (isAlphabetMode) {
      const letterData = getSnakeNextLetter(alphaIndexRef.current, false);
      const targetChar = letterData.char;
      setCurrentWord({
        id: \`alpha_\${targetChar}\`,
        en: targetChar,
        zh: \`吃掉字母 【 \${targetChar} 】\`,
        isAlphabet: true
      });
      setSpelledChars('');
      spelledCharsRef.current = '';
      speakEnglish(targetChar);

      // 產生目標字母與 3 個隨機干擾字母
      const otherLetters = UPPERCASE_ALPHABET.filter(c => c !== targetChar);
      const distractors = [...otherLetters].sort(() => 0.5 - Math.random()).slice(0, 3);
      const allChars = [targetChar, ...distractors].sort(() => 0.5 - Math.random());

      const placed = [];
      allChars.forEach((ch, idx) => {
        let x, y;
        let tries = 0;
        do {
          x = Math.floor(Math.random() * (GRID_W - 2)) + 1;
          y = Math.floor(Math.random() * (GRID_H - 2)) + 1;
          tries++;
        } while (
          tries < 50 &&
          (placed.some(p => p.x === x && p.y === y) ||
            snakeRef.current.some(s => s.x === x && s.y === y) ||
            (nextHeadRef.current.x === x && nextHeadRef.current.y === y))
        );
        placed.push({ char: ch, x, y, id: \`\${ch}-\${idx}-\${Date.now()}\`, isTarget: ch === targetChar });
      });

      lettersRef.current = placed;
      setRenderLetters([...placed]);
      return;
    }

    if (wordQueueRef.current.length === 0) {`;

  snake = snake.replace(
    '  const loadNextWord = () => {\r\n    if (wordQueueRef.current.length === 0) {',
    newLoadNextWord
  ).replace(
    '  const loadNextWord = () => {\n    if (wordQueueRef.current.length === 0) {',
    newLoadNextWord
  );

  // Update HonorSubmissionCard props
  snake = snake.replace(
    'book={qualifyingBook}\r\n            score={score}\r\n            time={gameMode === \'survival\' ? survivalTime : 60 - timeLeft}\r\n            totalCount={Math.max(10, score / 10)}\r\n            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(\', \')}',
    `mode={isAlphabetMode ? 'snake-abc' : 'snake'}
            book={isAlphabetMode ? 'abc' : qualifyingBook}
            score={score}
            time={gameMode === 'survival' ? survivalTime : 60 - timeLeft}
            totalCount={isAlphabetMode ? 26 : Math.max(10, score / 10)}
            rangeText={isAlphabetMode ? '26 英文字母全套巡航' : (qualifyingBook ? \`第 \${qualifyingBook} 冊\` : settings.selectedUnits.slice(0, 3).join(', '))}`
  );

  fs.writeFileSync('src/games/snake/SnakeGame.jsx', snake, 'utf8');
  console.log('SnakeGame.jsx updated for Alphabet mode.');
} else {
  console.log('SnakeGame.jsx already updated.');
}

// ══════════════════════════════════════════════════════════════
// 3. MemoryGameSingle.jsx: Letter Uppercase & Lowercase Match
// ══════════════════════════════════════════════════════════════
let memory = fs.readFileSync('src/games/memory/MemoryGameSingle.jsx', 'utf8');
if (!memory.includes('alphabetEngine')) {
  memory = memory.replace(
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';",
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';\r\nimport { UPPERCASE_ALPHABET, SHUFFLE } from '../../services/alphabetEngine';"
  );

  // Detect isAlphabetMode in MemoryGameSingle
  memory = memory.replace(
    "  const { t } = useI18n();",
    `  const { t } = useI18n();
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );`
  );

  // Replace cardList generation to support alphabet
  const memoryGenCode = `    const cardList = [];
    if (isAlphabetMode) {
      // 字母模式：抽 8 組英文字母大小寫配對 (A ↔ a)
      const selectedRoots = SHUFFLE(UPPERCASE_ALPHABET).slice(0, 8);
      selectedRoots.forEach((upper) => {
        const matchKey = \`pair_\${upper}\`;
        cardList.push({
          id: \`upper-\${matchKey}\`,
          matchId: matchKey,
          text: upper,
          subText: '大寫',
          type: 'en',
          speak: upper,
          isPowerUp: false
        });
        cardList.push({
          id: \`lower-\${matchKey}\`,
          matchId: matchKey,
          text: upper.toLowerCase(),
          subText: '小寫',
          type: 'zh',
          speak: upper,
          isPowerUp: false
        });
      });
    } else {
      // 16 張單字卡
      selected.forEach((w, idx) => {
        const matchKey = \`pair_\${idx}\`;
        cardList.push({
          id: \`en-\${matchKey}\`,
          matchId: matchKey,
          text: w.en,
          type: 'en',
          speak: w.en,
          isPowerUp: false
        });
        cardList.push({
          id: \`zh-\${matchKey}\`,
          matchId: matchKey,
          text: w.zh,
          type: 'zh',
          speak: w.en,
          isPowerUp: false
        });
      });
    }`;

  memory = memory.replace(
    /(\s+const cardList = \[\];\r?\n\s+\/\/\s+16 張字卡\r?\n\s+selected\.forEach[\s\S]*?\}\);\r?\n)/,
    '\r\n' + memoryGenCode + '\r\n'
  );

  // HonorSubmissionCard props
  memory = memory.replace(
    "mode=\"memory-single\"\r\n            book={qualifyingBook}\r\n            score={score}\r\n            time={timeElapsed}\r\n            totalCount={20}\r\n            rangeText={qualifyingBook ? `第 ${qualifyingBook} 冊` : settings.selectedUnits.slice(0, 3).join(', ')}",
    `mode={isAlphabetMode ? 'memory-abc' : 'memory-single'}
            book={isAlphabetMode ? 'abc' : qualifyingBook}
            score={score}
            time={timeElapsed}
            totalCount={isAlphabetMode ? 16 : 20}
            rangeText={isAlphabetMode ? 'Aa 字母大小寫配對翻牌' : (qualifyingBook ? \`第 \${qualifyingBook} 冊\` : settings.selectedUnits.slice(0, 3).join(', '))}`
  );

  fs.writeFileSync('src/games/memory/MemoryGameSingle.jsx', memory, 'utf8');
  console.log('MemoryGameSingle.jsx updated for Alphabet mode.');
} else {
  console.log('MemoryGameSingle.jsx already updated.');
}

// ══════════════════════════════════════════════════════════════
// 4. StandardQuiz.jsx: Quiz Choices for Alphabet
// ══════════════════════════════════════════════════════════════
let quiz = fs.readFileSync('src/games/quiz/StandardQuiz.jsx', 'utf8');
if (!quiz.includes('alphabetEngine')) {
  quiz = quiz.replace(
    "import { getSentenceListeningQuestions, getDialogueQAQuestions } from '../../services/listeningQuestionBank.js';",
    "import { getSentenceListeningQuestions, getDialogueQAQuestions } from '../../services/listeningQuestionBank.js';\r\nimport { generateQuizAlphabetQuestions } from '../../services/alphabetEngine';"
  );

  quiz = quiz.replace(
    "  const { t } = useI18n();",
    `  const { t } = useI18n();
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );`
  );

  // In useEffect: load questions based on alphabet mode
  const quizAlphaInit = `    if (isAlphabetMode) {
      const qCount = settings?.count === 'all' ? 26 : (parseInt(settings?.count, 10) || 20);
      let qType = 'upper_to_lower';
      if (mode === 'quiz-en-zh') qType = 'lower_to_upper';
      if (mode === 'quiz-listening') qType = 'listening';
      list = generateQuizAlphabetQuestions(qType, qCount);
    } else if (mode === 'quiz-listening') {`;

  quiz = quiz.replace(
    "    if (mode === 'quiz-listening') {",
    quizAlphaInit
  );

  // Start screen title adjustment for alphabet
  quiz = quiz.replace(
    "{mode === 'quiz-zh-en'\r\n              ? t.quizZhEn\r\n              : mode === 'quiz-en-zh'\r\n              ? t.quizEnZh\r\n              : mode === 'quiz-listening'\r\n              ? t.quizListening\r\n              : t.quizHard}",
    `{isAlphabetMode
              ? (mode === 'quiz-zh-en' ? '看大寫選小寫' : mode === 'quiz-en-zh' ? '看小寫選大寫' : '聽音選字母')
              : (mode === 'quiz-zh-en' ? t.quizZhEn : mode === 'quiz-en-zh' ? t.quizEnZh : mode === 'quiz-listening' ? t.quizListening : t.quizHard)}`
  );

  // Settlement HonorSubmissionCard
  quiz = quiz.replace(
    "book={isTownListeningMode ? null : qualifyingBook}\r\n            score={score}\r\n            time={elapsedTime}\r\n            totalCount={initialCountRef.current || 20}",
    `mode={isAlphabetMode ? (mode === 'quiz-zh-en' ? 'quiz-zh-en' : mode === 'quiz-en-zh' ? 'quiz-en-zh' : 'quiz-listening') : mode}
            book={isAlphabetMode ? 'abc' : (isTownListeningMode ? null : qualifyingBook)}
            score={score}
            time={elapsedTime}
            totalCount={initialCountRef.current || 20}`
  );

  fs.writeFileSync('src/games/quiz/StandardQuiz.jsx', quiz, 'utf8');
  console.log('StandardQuiz.jsx updated for Alphabet mode.');
} else {
  console.log('StandardQuiz.jsx already updated.');
}

console.log('--- PHASE 1 FINISHED SUCCESSFULLY ---');
