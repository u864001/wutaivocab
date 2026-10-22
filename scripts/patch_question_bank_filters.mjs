import fs from 'fs';

// 1. Patch src/services/hereWeGoQuestionBank.js
let hwg = fs.readFileSync('src/services/hereWeGoQuestionBank.js', 'utf8');

const filterFn = `
/**
 * 嚴格過濾合法英文句子：嚴禁任何中文穿插、必須包含實質英文字母
 */
export function isValidEnglishSentence(item) {
  if (!item || typeof item.en !== 'string') return false;
  const en = item.en.trim();
  if (en.length < 2) return false;
  if (/[\\u4e00-\\u9fa5]/.test(en)) return false; // 絕對不可包含漢字
  if (!/[a-zA-Z]{2,}/.test(en)) return false;
  return true;
}
`;

if (!hwg.includes('isValidEnglishSentence')) {
  hwg = hwg.replace(/function shuffle\(arr\) \{[\s\S]*?return result;\s*\}/, (match) => {
    return match + '\n' + filterFn;
  });

  // getUnitListeningQuestions
  hwg = hwg.replace(
    /let pool = \[\.\.\.\(targetUnit\.dialogues \|\| \[\]\)\];/,
    'let pool = [...(targetUnit.dialogues || []).filter(isValidEnglishSentence)];'
  );
  hwg = hwg.replace(
    /const otherBookSentences = book\.units\s*\.filter\(u => u\.unitId !== targetUnit\.unitId\)\s*\.flatMap\(u => u\.dialogues \|\| \[\]\);/,
    'const otherBookSentences = book.units.filter(u => u.unitId !== targetUnit.unitId).flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence));'
  );
  hwg = hwg.replace(
    /const allSentences = HERE_WE_GO_TEXTBOOKS\.flatMap\(b => b\.units\.flatMap\(u => u\.dialogues \|\| \[\]\)\);/,
    'const allSentences = HERE_WE_GO_TEXTBOOKS.flatMap(b => b.units.flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence)));'
  );

  // getUnitSpeakingQuestions
  hwg = hwg.replace(
    /let pool = \[\.\.\.\(targetUnit\.dialogues \|\| \[\]\)\];/,
    'let pool = [...(targetUnit.dialogues || []).filter(isValidEnglishSentence)];'
  );

  // getGradeListeningQuestions
  hwg = hwg.replace(
    /b\.units\.flatMap\(u =>\s*\(u\.dialogues \|\| \[\]\)\.map\(d => \(\{/,
    'b.units.flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence).map(d => ({'
  );

  // getGradeSpeakingQuestions
  hwg = hwg.replace(
    /b\.units\.flatMap\(u =>\s*\(u\.dialogues \|\| \[\]\)\.map\(d => \(\{/,
    'b.units.flatMap(u => (u.dialogues || []).filter(isValidEnglishSentence).map(d => ({'
  );

  fs.writeFileSync('src/services/hereWeGoQuestionBank.js', hwg, 'utf8');
  console.log('hereWeGoQuestionBank.js patched!');
}

// 2. Patch src/services/listeningQuestionBank.js
let lqb = fs.readFileSync('src/services/listeningQuestionBank.js', 'utf8');
if (!lqb.includes('![\\u4e00-\\u9fa5]')) {
  lqb = lqb.replace(
    /if \(node\.en && node\.zh && node\.en\.trim\(\)\.length >= 4\) \{/,
    'if (node.en && node.zh && node.en.trim().length >= 4 && !/[\\u4e00-\\u9fa5]/.test(node.en) && /[a-zA-Z]{2,}/.test(node.en)) {'
  );
  lqb = lqb.replace(
    /if \(\s*textEn &&\s*textZh &&\s*textEn\.length >= 4 &&\s*opt\.target_id !== 'END' &&\s*!opt\.action\?\.startsWith\('OPEN_'\)\s*\) \{/,
    "if (textEn && textZh && textEn.length >= 4 && !/[\\u4e00-\\u9fa5]/.test(textEn) && /[a-zA-Z]{2,}/.test(textEn) && opt.target_id !== 'END' && !opt.action?.startsWith('OPEN_')) {"
  );
  fs.writeFileSync('src/services/listeningQuestionBank.js', lqb, 'utf8');
  console.log('listeningQuestionBank.js patched!');
}
