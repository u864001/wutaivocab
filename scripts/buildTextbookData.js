import fs from 'fs';
import path from 'path';

const dir = './textbook_txt';
const outFile = './src/data/hereWeGoTextbookData.js';

function parseBook(fileName) {
  let content = fs.readFileSync(path.join(dir, fileName), 'utf8');
  content = content.replace(/\r\u0007/g, '\n').replace(/[\r\f\u0007\t]/g, '\n');
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

  const bMatch = fileName.match(/Here We Go (\d+)/i);
  const bookNum = bMatch ? parseInt(bMatch[1], 10) : 1;

  // Find unit boundaries
  const unitHeaders = [];
  lines.forEach((l, idx) => {
    if (/^(Starter|Unit\s+\d+|Festivals:|Review\s+\d+)/i.test(l)) {
      unitHeaders.push({ idx, rawTitle: l });
    }
  });

  const units = [];
  for (let i = 0; i < unitHeaders.length; i++) {
    const start = unitHeaders[i].idx;
    const end = (i + 1 < unitHeaders.length) ? unitHeaders[i + 1].idx : lines.length;
    const uLines = lines.slice(start, end);
    const rawTitle = unitHeaders[i].rawTitle;

    // Clean unit title
    const title = rawTitle.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();

    // Find vocabulary
    const vocabList = [];
    const dialogPairs = [];

    const kwIdx = uLines.findIndex(l => l.includes('課文內容'));
    if (kwIdx !== -1) {
      // Vocab lines before kwIdx
      const vocabLines = uLines.slice(0, kwIdx);
      vocabLines.forEach(l => {
        const vMatch = l.match(/^([a-zA-Z\s/’'\-+]+?)\s+([\u4e00-\u9fa5（）()……/、]+.*)$/);
        if (vMatch && !l.includes('應用字彙') && !l.includes('認識字彙') && !l.includes('音韻字彙') && !l.includes('Unit')) {
          vocabList.push({ en: vMatch[1].trim(), zh: vMatch[2].trim() });
        }
      });

      // Dialog lines after kwIdx
      const afterKw = uLines.slice(kwIdx + 1).filter(l => !l.includes('課文中譯'));
      const enLines = [];
      const zhLines = [];
      afterKw.forEach(l => {
        const clean = l.replace(/^\d+\.\s*/, '').trim();
        const zhCount = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
        const enCount = (clean.match(/[a-zA-Z]/g) || []).length;
        if (zhCount > 0 && zhCount >= enCount) {
          zhLines.push(clean);
        } else if (enCount > 0) {
          enLines.push(clean);
        }
      });

      const count = Math.min(enLines.length, zhLines.length);
      for (let j = 0; j < count; j++) {
        const enRaw = enLines[j];
        const zhRaw = zhLines[j];
        let speaker = 'Character';
        let enText = enRaw;
        let zhText = zhRaw;

        const spMatch = enRaw.match(/^([A-Za-z0-9\s＋+]+)[:：]\s*(.*)$/);
        if (spMatch) {
          speaker = spMatch[1].trim();
          enText = spMatch[2].trim();
        }

        const spZhMatch = zhRaw.match(/^([A-Za-z0-9\s＋+]+)[：:]\s*(.*)$/);
        if (spZhMatch) {
          zhText = spZhMatch[2].trim();
        }

        dialogPairs.push({
          id: `b${bookNum}_u${i}_s${j}`,
          speaker,
          en: enText || enRaw,
          zh: zhText || zhRaw,
          fullEn: enRaw,
          fullZh: zhRaw
        });
      }
    }

    units.push({
      unitId: `b${bookNum}_u${i}`,
      title,
      dialogues: dialogPairs,
      vocab: vocabList.slice(0, 25)
    });
  }

  return {
    book: bookNum,
    title: `Here We Go 第 ${bookNum} 冊`,
    units
  };
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt')).sort();
const allBooks = files.map(parseBook);

const fileContent = `/**
 * 翰林 Here We Go 1～9 冊 完整課文題庫資料庫
 * 自動由官方中譯表 Word 文本剖析生成
 * 涵蓋全冊單元、情境課文對話、中文對譯與核心單字
 */

export const HERE_WE_GO_TEXTBOOKS = ${JSON.stringify(allBooks, null, 2)};
`;

fs.writeFileSync(outFile, fileContent, 'utf8');
console.log('Successfully written to', outFile);
console.log('Total books:', allBooks.length);
let totalDialogues = 0;
allBooks.forEach(b => {
  const dCount = b.units.reduce((acc, u) => acc + u.dialogues.length, 0);
  totalDialogues += dCount;
  console.log(`Book ${b.book}: ${b.units.length} units, ${dCount} dialogues`);
});
console.log('Grand total dialogues:', totalDialogues);
