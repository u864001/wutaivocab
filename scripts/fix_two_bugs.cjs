const fs = require('fs');

console.log('--- FIXING THE TWO BUGS FOUND BY AUTOMATION TEST ---');

// 1. Fix escapeData.js
let escapeData = fs.readFileSync('src/games/escape/escapeData.js', 'utf8');

// Declare isAlphabetMode inside generateEscapeRoomCampaign
const fnDecl = "export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {\r\n  const { grade = '03', selectedUnits = [], themeId = 'temple' } = options;";
const fnDeclLF = "export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {\n  const { grade = '03', selectedUnits = [], themeId = 'temple' } = options;";

const replacement = `export const generateEscapeRoomCampaign = (allWords = [], options = {}) => {
  const { grade = '03', selectedUnits = [], themeId = 'temple' } = options;
  const isAlphabetMode = Boolean(
    options.isAlphabetMode ||
    (Array.isArray(selectedUnits) && selectedUnits.includes('abc')) ||
    grade === '01' ||
    grade === '02'
  );`;

if (escapeData.includes(fnDecl)) {
  escapeData = escapeData.replace(fnDecl, replacement);
} else if (escapeData.includes(fnDeclLF)) {
  escapeData = escapeData.replace(fnDeclLF, replacement);
} else {
  // regex fallback
  escapeData = escapeData.replace(
    /export const generateEscapeRoomCampaign = \(allWords = \[\], options = \{\}\) => \{\r?\n\s+const \{ grade = '03', selectedUnits = \[\], themeId = 'temple' \} = options;/,
    replacement
  );
}

// Ensure alphaPuzzles are generated inside chapters.map if isAlphabetMode
const oldChapHeader = `  // 生成三間房間
  const chapters = targetChapters.map((chapMeta, chapIdx) => {
    // 1. 每關隨機生成 5 個不重疊的點位
    const hotspots = generateNonOverlappingHotspots(5);

    // 2. 隨機抽選 3 個關鍵點索引 (例如 [1, 3, 4])，其餘 2 個為迷途干擾點
    const shuffledIndices = shuffle([0, 1, 2, 3, 4]);
    const keyIndices = new Set(shuffledIndices.slice(0, 3));`;

const newChapHeader = `  // 生成三間房間
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

if (escapeData.includes(oldChapHeader)) {
  escapeData = escapeData.replace(oldChapHeader, newChapHeader);
} else if (escapeData.includes(oldChapHeader.replace(/\r\n/g, '\n'))) {
  escapeData = escapeData.replace(oldChapHeader.replace(/\r\n/g, '\n'), newChapHeader);
}

fs.writeFileSync('src/games/escape/escapeData.js', escapeData, 'utf8');
console.log('Fixed escapeData.js!');

// 2. Fix VocabSpotterGame.jsx: Add useStudent import and hook
let spotter = fs.readFileSync('src/games/spotter/VocabSpotterGame.jsx', 'utf8');
if (!spotter.includes('useStudent')) {
  spotter = spotter.replace(
    "import { useI18n } from '../../context/I18nContext';",
    "import { useI18n } from '../../context/I18nContext';\r\nimport { useStudent } from '../../context/StudentContext';"
  ).replace(
    "import { useI18n } from '../../context/I18nContext';",
    "import { useI18n } from '../../context/I18nContext';\nimport { useStudent } from '../../context/StudentContext';"
  );

  spotter = spotter.replace(
    "  const { lang, t } = useI18n();",
    "  const { lang, t } = useI18n();\r\n  const { currentStudent } = useStudent();"
  ).replace(
    "  const { lang, t } = useI18n();",
    "  const { lang, t } = useI18n();\n  const { currentStudent } = useStudent();"
  );

  fs.writeFileSync('src/games/spotter/VocabSpotterGame.jsx', spotter, 'utf8');
  console.log('Fixed VocabSpotterGame.jsx with useStudent!');
} else {
  console.log('VocabSpotterGame.jsx already has useStudent.');
}
