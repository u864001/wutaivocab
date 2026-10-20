const fs = require('fs');

let code = fs.readFileSync('src/games/spotter/VocabSpotterGame.jsx', 'utf8');

if (!code.includes("from '../../context/StudentContext'")) {
  code = "import { useStudent } from '../../context/StudentContext';\r\n" + code;
}

if (!code.includes("const { currentStudent } = useStudent();")) {
  code = code.replace(
    /export const VocabSpotterGame = \(\{[\s\S]*?onBack\r?\n\}\) => \{/,
    (match) => match + "\r\n  const { currentStudent } = useStudent();"
  );
}

fs.writeFileSync('src/games/spotter/VocabSpotterGame.jsx', code, 'utf8');
console.log('VocabSpotterGame.jsx updated with useStudent hook.');
