const fs = require('fs');

const content = fs.readFileSync('src/services/hereWeGoQuestionBank.js', 'utf8');
const lines = content.split('\n');

console.log('Searching for Book 4 in hereWeGoQuestionBank.js...');
lines.forEach((line, idx) => {
  if (line.includes('book: 4') || line.includes("book: '4'") || line.includes('Book 4') || line.includes('第 4 冊') || line.includes('grade: 4')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
