const fs = require('fs');

console.log('--- STARTING ALPHABET UNIVERSE PHASE 2 IMPLEMENTATION ---');

// ══════════════════════════════════════════════════════════════
// 1. src/utils/studentIdHelper.js: Expand isAlphabetGameMode
// ══════════════════════════════════════════════════════════════
let idHelper = fs.readFileSync('src/utils/studentIdHelper.js', 'utf8');
if (!idHelper.includes("m.endsWith('-abc')")) {
  idHelper = idHelper.replace(
    /m === 'swipe-abc'/g,
    "m.includes('abc') || m.endsWith('-abc') || m === 'swipe-abc'"
  );
  fs.writeFileSync('src/utils/studentIdHelper.js', idHelper, 'utf8');
  console.log('studentIdHelper.js updated with expanded isAlphabetGameMode.');
} else {
  console.log('studentIdHelper.js already expanded.');
}

// ══════════════════════════════════════════════════════════════
// 2. src/games/swipe/SwipeCardGame.jsx: Auto-select 'letters' on abc
// ══════════════════════════════════════════════════════════════
let swipe = fs.readFileSync('src/games/swipe/SwipeCardGame.jsx', 'utf8');
if (!swipe.includes('isAlphabetMode = Boolean(')) {
  swipe = swipe.replace(
    "  // 模式：'vocab' (中高年級單字釋義), 'letters' (低年級 Aa 大小寫配對)\r\n  const [gameMode, setGameMode] = useState('vocab');",
    `  // 低年級 Aa 字母模式判斷
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );
  // 模式：'vocab' (中高年級單字釋義), 'letters' (低年級 Aa 大小寫配對)
  const [gameMode, setGameMode] = useState(isAlphabetMode ? 'letters' : 'vocab');`
  ).replace(
    "  // 模式：'vocab' (中高年級單字釋義), 'letters' (低年級 Aa 大小寫配對)\n  const [gameMode, setGameMode] = useState('vocab');",
    `  // 低年級 Aa 字母模式判斷
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );
  // 模式：'vocab' (中高年級單字釋義), 'letters' (低年級 Aa 大小寫配對)
  const [gameMode, setGameMode] = useState(isAlphabetMode ? 'letters' : 'vocab');`
  );

  // Sync gameMode when isAlphabetMode changes
  swipe = swipe.replace(
    "  const [gameMode, setGameMode] = useState(isAlphabetMode ? 'letters' : 'vocab');",
    `  const [gameMode, setGameMode] = useState(isAlphabetMode ? 'letters' : 'vocab');
  useEffect(() => {
    if (isAlphabetMode) {
      setGameMode('letters');
    }
  }, [isAlphabetMode]);`
  );

  fs.writeFileSync('src/games/swipe/SwipeCardGame.jsx', swipe, 'utf8');
  console.log('SwipeCardGame.jsx updated with auto-letters.');
} else {
  console.log('SwipeCardGame.jsx already has isAlphabetMode.');
}

// ══════════════════════════════════════════════════════════════
// 3. src/games/mole/WhackAMoleGame.jsx: Include qualifyingBook in isAlphabetMode
// ══════════════════════════════════════════════════════════════
let mole = fs.readFileSync('src/games/mole/WhackAMoleGame.jsx', 'utf8');
if (!mole.includes("qualifyingBook === 'abc'")) {
  mole = mole.replace(
    "  const isAlphabetMode = useMemo(() => {\r\n    return settings?.alphaMode || (settings?.selectedUnits && settings.selectedUnits.includes('abc'));\r\n  }, [settings]);",
    `  const isAlphabetMode = useMemo(() => {
    return qualifyingBook === 'abc' || settings?.alphaMode || (settings?.selectedUnits && settings.selectedUnits.includes('abc'));
  }, [settings, qualifyingBook]);`
  ).replace(
    "  const isAlphabetMode = useMemo(() => {\n    return settings?.alphaMode || (settings?.selectedUnits && settings.selectedUnits.includes('abc'));\n  }, [settings]);",
    `  const isAlphabetMode = useMemo(() => {
    return qualifyingBook === 'abc' || settings?.alphaMode || (settings?.selectedUnits && settings.selectedUnits.includes('abc'));
  }, [settings, qualifyingBook]);`
  );
  fs.writeFileSync('src/games/mole/WhackAMoleGame.jsx', mole, 'utf8');
  console.log('WhackAMoleGame.jsx updated.');
} else {
  console.log('WhackAMoleGame.jsx already has qualifyingBook in check.');
}

// ══════════════════════════════════════════════════════════════
// 4. src/games/meteor/MeteorGame.jsx: Auto-select 'abc' subMode on abc
// ══════════════════════════════════════════════════════════════
let meteor = fs.readFileSync('src/games/meteor/MeteorGame.jsx', 'utf8');
if (!meteor.includes('isAlphabetMode = Boolean(')) {
  meteor = meteor.replace(
    "  const [subMode, setSubMode] = useState('zh-en'); // 'zh-en' | 'en-zh' | 'abc'",
    `  // 低年級 Aa 字母模式判斷
  const isAlphabetMode = Boolean(
    qualifyingBook === 'abc' ||
    (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
    settings?.alphaMode
  );
  const [subMode, setSubMode] = useState(isAlphabetMode ? 'abc' : 'zh-en'); // 'zh-en' | 'en-zh' | 'abc'
  useEffect(() => {
    if (isAlphabetMode) {
      setSubMode('abc');
    }
  }, [isAlphabetMode]);`
  );
  fs.writeFileSync('src/games/meteor/MeteorGame.jsx', meteor, 'utf8');
  console.log('MeteorGame.jsx updated.');
} else {
  console.log('MeteorGame.jsx already has isAlphabetMode.');
}

// ══════════════════════════════════════════════════════════════
// 5. src/games/battle/BattleGame.jsx: Pool support for 'abc'
// ══════════════════════════════════════════════════════════════
let battle = fs.readFileSync('src/games/battle/BattleGame.jsx', 'utf8');
if (!battle.includes("units.includes('abc')")) {
  battle = battle.replace(
    "    let pool = words.filter(w => units.includes(`${w.book}-${w.lesson}`));\r\n    if (pool.length === 0) pool = words;",
    `    const isAlpha = units.includes('abc');
    let pool = isAlpha
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
          id: \`abc-\${c}\`,
          en: c,
          zh: \`字母 \${c}\`,
          isAlphabet: true
        }))
      : words.filter(w => units.includes(\`\${w.book}-\${w.lesson}\`));
    if (pool.length === 0) pool = words;`
  ).replace(
    "    let pool = words.filter(w => units.includes(`${w.book}-${w.lesson}`));\n    if (pool.length === 0) pool = words;",
    `    const isAlpha = units.includes('abc');
    let pool = isAlpha
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
          id: \`abc-\${c}\`,
          en: c,
          zh: \`字母 \${c}\`,
          isAlphabet: true
        }))
      : words.filter(w => units.includes(\`\${w.book}-\${w.lesson}\`));
    if (pool.length === 0) pool = words;`
  );

  // In round 2 / next queue
  battle = battle.replace(
    "      let pool = words.filter(w => units.includes(`${w.book}-${w.lesson}`));\r\n      if (pool.length === 0) pool = words;",
    `      const isAlpha = units.includes('abc');
      let pool = isAlpha
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
            id: \`abc-\${c}\`,
            en: c,
            zh: \`字母 \${c}\`,
            isAlphabet: true
          }))
        : words.filter(w => units.includes(\`\${w.book}-\${w.lesson}\`));
      if (pool.length === 0) pool = words;`
  ).replace(
    "      let pool = words.filter(w => units.includes(`${w.book}-${w.lesson}`));\n      if (pool.length === 0) pool = words;",
    `      const isAlpha = units.includes('abc');
      let pool = isAlpha
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
            id: \`abc-\${c}\`,
            en: c,
            zh: \`字母 \${c}\`,
            isAlphabet: true
          }))
        : words.filter(w => units.includes(\`\${w.book}-\${w.lesson}\`));
      if (pool.length === 0) pool = words;`
  );

  fs.writeFileSync('src/games/battle/BattleGame.jsx', battle, 'utf8');
  console.log('BattleGame.jsx updated with abc pool support.');
} else {
  console.log('BattleGame.jsx already has abc pool support.');
}

console.log('--- PHASE 2 GENERAL UPDATES FINISHED ---');
