const fs = require('fs');

let lines = fs.readFileSync('src/games/spelling/SpellingGame.jsx', 'utf8').split('\n');
let seen = false;
let newLines = [];
for (let l of lines) {
  if (l.includes("import { generateSpellingAlphabetQuestion }")) {
    if (seen) continue;
    seen = true;
  }
  newLines.push(l);
}
fs.writeFileSync('src/games/spelling/SpellingGame.jsx', newLines.join('\n'), 'utf8');
console.log('SpellingGame duplicate import removed.');
