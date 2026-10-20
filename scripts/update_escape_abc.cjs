const fs = require('fs');

console.log('--- UPDATING VOCAB ESCAPE FOR ALPHABET MODE ---');

// 1. Update escapeData.js
let escapeData = fs.readFileSync('src/games/escape/escapeData.js', 'utf8');

if (!escapeData.includes('generateEscapeAlphabetPuzzles')) {
  // Add import
  escapeData = "import { generateEscapeAlphabetPuzzles } from '../../services/alphabetEngine';\r\n" + escapeData;

  // Update generateEscapeRoomCampaign for alphabet mode
  const targetFnStart = `export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {
  const { grade = '03', selectedUnits = [], themeId = 'temple' } = options;`;

  const newFnStart = `export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {
  const { grade = '03', selectedUnits = [], themeId = 'temple' } = options;

  const isAlphabetMode = Boolean(
    options.isAlphabetMode ||
    (Array.isArray(selectedUnits) && selectedUnits.includes('abc')) ||
    grade === '01' ||
    grade === '02'
  );`;

  escapeData = escapeData.replace(targetFnStart, newFnStart)
    .replace(targetFnStart.replace(/\r\n/g, '\n'), newFnStart);

  // If isAlphabetMode, generate alphabet chapters
  const targetChapMap = `  // 生成三間房間
  const chapters = targetChapters.map((chapMeta, chapIdx) => {
    // 1. 每關隨機生成 5 個不重疊的點位
    const hotspots = generateNonOverlappingHotspots(5);

    // 2. 隨機抽選 3 個關鍵點索引 (例如 [1, 3, 4])，其餘 2 個為迷途干擾點
    const shuffledIndices = shuffle([0, 1, 2, 3, 4]);
    const keyIndices = new Set(shuffledIndices.slice(0, 3));`;

  const newChapMap = `  // 生成三間房間
  const chapters = targetChapters.map((chapMeta, chapIdx) => {
    // 1. 每關隨機生成 5 個不重疊的點位
    const hotspots = generateNonOverlappingHotspots(5);

    // 2. 隨機抽選 3 個關鍵點索引 (例如 [1, 3, 4])，其餘 2 個為迷途干擾點
    const shuffledIndices = shuffle([0, 1, 2, 3, 4]);
    const keyIndices = new Set(shuffledIndices.slice(0, 3));

    if (isAlphabetMode) {
      const alphaPuzzles = generateEscapeAlphabetPuzzles(grade);
      const puzzles = hotspots.map((spot, spotIdx) => {
        const isKeyRelic = keyIndices.has(spotIdx);
        const pGen = alphaPuzzles[spotIdx % alphaPuzzles.length];
        const correctOpt = pGen.options.find(o => o.isCorrect) || pGen.options[0];
        return {
          id: \`\${chapMeta.id}_spot_\${spotIdx}\`,
          top: spot.top,
          left: spot.left,
          animDelay: spot.animDelay,
          animDuration: spot.animDuration,
          isKeyRelic,
          haloType: isKeyRelic ? 'gold' : 'pale',
          type: 'cloze',
          stationName: \`神秘字母石碑 #\${spotIdx + 1}\`,
          targetWord: { en: correctOpt.text, zh: pGen.title },
          titleZh: pGen.title,
          englishPrompt: pGen.displayPrompt,
          chineseClue: pGen.desc,
          voiceText: pGen.audioText || correctOpt.text,
          targetText: correctOpt.text,
          options: pGen.options.map(o => o.text),
          rewardItemZh: isKeyRelic ? '關鍵逃脫印記' : '迷途古物',
          rewardItemIcon: isKeyRelic ? '🗝️' : '✨'
        };
      });

      return {
        ...chapMeta,
        puzzles,
        keyCountNeeded: 3
      };
    }`;

  escapeData = escapeData.replace(targetChapMap, newChapMap)
    .replace(targetChapMap.replace(/\r\n/g, '\n'), newChapMap);

  // In return: qualifyingBook should be 'abc' if isAlphabetMode
  escapeData = escapeData.replace(
    "    qualifyingBook,\r\n    totalPuzzlesCount",
    "    qualifyingBook: isAlphabetMode ? 'abc' : qualifyingBook,\r\n    totalPuzzlesCount"
  ).replace(
    "    qualifyingBook,\n    totalPuzzlesCount",
    "    qualifyingBook: isAlphabetMode ? 'abc' : qualifyingBook,\n    totalPuzzlesCount"
  );

  fs.writeFileSync('src/games/escape/escapeData.js', escapeData, 'utf8');
  console.log('escapeData.js updated for Alphabet Mode!');
} else {
  console.log('escapeData.js already updated.');
}

// 2. Update VocabEscapeGame.jsx
let vocabEscape = fs.readFileSync('src/games/escape/VocabEscapeGame.jsx', 'utf8');
vocabEscape = vocabEscape.replace(
  "rangeText={`第 ${qualifyingBook} 冊 - 三連環密室大脫逃`}",
  "rangeText={qualifyingBook === 'abc' ? 'Aa 字母神石密室大脫逃' : `第 ${qualifyingBook} 冊 - 三連環密室大脫逃`}"
);
vocabEscape = vocabEscape.replace(
  "目前出題：第 {qualifyingBook} 冊",
  "目前出題：{qualifyingBook === 'abc' ? 'Aa 字母神石密室' : `第 ${qualifyingBook} 冊`}"
);

fs.writeFileSync('src/games/escape/VocabEscapeGame.jsx', vocabEscape, 'utf8');
console.log('VocabEscapeGame.jsx updated for Alphabet Mode!');
