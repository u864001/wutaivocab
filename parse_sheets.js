import fs from 'fs';

const url1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHP_-ulCqptjhzeRMyfZ79zmCn6AtNZjBwphgXy--JOdEmkvTiV0_OX2kbq42w-HzGN7wDu35SDZ5h/pub?output=csv";
const url2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRMfkieB3uqgN4_yq7gAuamhO-fSAqBcH5qMbhq0ouiFgWqeizxLRKsW7mg-wJlL1TZ0sohpLz5zuA1/pub?gid=0&single=true&output=csv";

async function run() {
  const res1 = await fetch(url1);
  const text1 = await res1.text();
  const lines1 = text1.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim());
  const headers = lines1[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  
  const officialWords = [];
  const books = new Set();
  
  for (let i = 1; i < lines1.length; i++) {
    const cols = lines1[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = cols[j] ? cols[j].trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';
      obj[headers[j]] = val;
    }
    if (obj.en && obj.zh) {
      officialWords.push({
        author: 'Official',
        book: obj.book ? String(obj.book) : '1',
        lesson: obj.lesson ? String(obj.lesson) : '1',
        en: obj.en,
        zh: obj.zh,
        cloze: obj.cloze || ''
      });
      books.add(obj.book);
    }
  }

  console.log('Total Official Words parsed:', officialWords.length);
  console.log('Books in Official:', Array.from(books).sort());

  // Also fetch custom sheet
  let customWords = [];
  try {
    const res2 = await fetch(url2);
    const text2 = await res2.text();
    const lines2 = text2.split(/\r?\n/);
    for (let i = 1; i < lines2.length; i++) {
      if (!lines2[i].trim()) continue;
      const cols = lines2[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (cols.length >= 4 && (cols[2] || cols[3])) {
        customWords.push({
          author: 'Custom',
          book: cols[0] || 'Custom',
          lesson: cols[1] || '單字補充',
          en: cols[2] || '',
          zh: cols[3] || '',
          cloze: cols[4] || ''
        });
      }
    }
  } catch(e) {}
  console.log('Total Custom Words parsed:', customWords.length);

  // Generate full SQL statements
  const allWords = [...officialWords, ...customWords];
  let sql = `-- ============================================================
-- 完整匯入 8 冊官方題庫 (共 ${allWords.length} 個單字)
-- 請在 Supabase 後台「SQL Editor」中貼上並執行「Run」
-- ============================================================

INSERT INTO public.words (author, book, lesson, en, zh, cloze) VALUES\n`;

  const values = allWords.map(w => {
    const en = w.en.replace(/'/g, "''");
    const zh = w.zh.replace(/'/g, "''");
    const cloze = (w.cloze || '').replace(/'/g, "''");
    const author = (w.author || 'Official').replace(/'/g, "''");
    const book = String(w.book).replace(/'/g, "''");
    const lesson = String(w.lesson).replace(/'/g, "''");
    return `('${author}', '${book}', '${lesson}', '${en}', '${zh}', '${cloze}')`;
  });

  sql += values.join(',\n') + ';\n';
  fs.writeFileSync('import_all_8_books.sql', sql, 'utf8');
  console.log('Successfully written import_all_8_books.sql!');
}

run();
