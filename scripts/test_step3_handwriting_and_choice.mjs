import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TEST: STEP 3 HANDWRITING & QUIZ-CHOICE FOLDING VERIFICATION  ');
console.log('  Testing: Tracing vs Challenge, Canvas Lock, Responsive Layout');
console.log('══════════════════════════════════════════════════════════════');

// ── Unit Tests for grimoireHelper and alphabetStrokes first ──
import { GRIMOIRE_GAME_MODES, getBookProgress, mapModeToGrimoireId } from '../src/utils/grimoireHelper.js';
import { ALL_STROKES, evaluateHandwriting } from '../src/services/alphabetStrokes.js';

console.log('1. Verifying Grimoire Modes:');
const grimoireIds = GRIMOIRE_GAME_MODES.map(m => m.id);
console.log('   Total modes in Grimoire:', GRIMOIRE_GAME_MODES.length, grimoireIds);
if (GRIMOIRE_GAME_MODES.length !== 12) throw new Error('Expected 12 modes in Grimoire!');
if (!grimoireIds.includes('quiz-choice')) throw new Error('quiz-choice missing from Grimoire!');
if (!grimoireIds.includes('handwriting')) throw new Error('handwriting missing from Grimoire!');

console.log('2. Verifying Mode Mapping:');
if (mapModeToGrimoireId('quiz-choice') !== 'quiz-choice') throw new Error('mapModeToGrimoireId quiz-choice failed');
if (mapModeToGrimoireId('quiz-zh-en') !== 'quiz-choice') throw new Error('mapModeToGrimoireId quiz-zh-en failed');
if (mapModeToGrimoireId('quiz-en-zh') !== 'quiz-choice') throw new Error('mapModeToGrimoireId quiz-en-zh failed');
if (mapModeToGrimoireId('handwriting') !== 'handwriting') throw new Error('mapModeToGrimoireId handwriting failed');
if (mapModeToGrimoireId('handwriting-abc') !== 'handwriting') throw new Error('mapModeToGrimoireId handwriting-abc failed');
console.log('   Mode mapping: 100% Correct!');

console.log('3. Verifying Alphabet Strokes:');
const strokeKeys = Object.keys(ALL_STROKES);
console.log('   Total stroke letters:', strokeKeys.length);
if (strokeKeys.length !== 52) throw new Error('Expected 52 letters (26 upper + 26 lower)');

const evalTest = evaluateHandwriting({
  targetChar: 'A',
  userStrokes: [
    [{ x: 50, y: 15 }, { x: 22, y: 75 }],
    [{ x: 50, y: 15 }, { x: 78, y: 75 }],
    [{ x: 32, y: 52 }, { x: 68, y: 52 }]
  ],
  isGuidedTracing: false
});
console.log('   Handwriting evaluation test (Letter A):', evalTest);
if (evalTest.score < 80) throw new Error('Expected score >= 80 for accurate letter A strokes!');

// ── Headless Chrome UI & Layout Verification ──
const PORT = 4177;
const BASE_URL = `http://localhost:${PORT}`;

console.log('\n4. Starting preview server on port', PORT);
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--host'], {
  stdio: 'pipe'
});

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        console.log('   Preview server ready!');
        return true;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Preview server failed to start');
}

const tempProfile = path.join(os.tmpdir(), `chrome_wutai_step3_${Date.now()}`);
fs.mkdirSync(tempProfile, { recursive: true });

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  `--user-data-dir=${tempProfile}`
]);

async function waitForChrome(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9230/json/list');
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
      if (pageTab) {
        console.log('   Chrome headless page tab ready:', pageTab.url);
        return pageTab;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Chrome failed to start');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
    this.errors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.pending.has(data.id)) {
          const { resolve, reject } = this.pending.get(data.id);
          this.pending.delete(data.id);
          if (data.error) reject(new Error(data.error.message));
          else resolve(data.result);
        } else if (data.method === 'Runtime.exceptionThrown') {
          this.errors.push(data.params.exceptionDetails);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: width < 600
    });
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1000));
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  try {
    await waitForServer();
    const pageTab = await waitForChrome();
    const cdp = new CDPClient(pageTab.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    console.log('\n5. Setting Up Student Session & Testing Lobby:');
    await cdp.navigate(`${BASE_URL}/`);
    await cdp.evaluate(`
      (() => {
        localStorage.setItem('wutai_guest_student', 'true');
        localStorage.setItem('wutai_last_student_id', '999999');
        localStorage.setItem('wutai_current_student', JSON.stringify({
          student_id: '999999',
          nickname: '霧臺勇士',
          grade: '03',
          classNum: '01',
          seat: '01'
        }));
      })()
    `);

    await cdp.setViewport(1280, 800);
    await cdp.navigate(`${BASE_URL}/?view=lobby`);
    await new Promise(r => setTimeout(r, 800));

    // Expand the 經典測驗 column
    const expandQuizCol = await cdp.evaluate(`
      (() => {
        const headings = Array.from(document.querySelectorAll('h3'));
        const quizH3 = headings.find(h => h.innerText.includes('經典測驗'));
        if (quizH3) {
          const card = quizH3.closest('.group') || quizH3.parentElement;
          if (card) {
            card.click();
            return true;
          }
        }
        return false;
      })()
    `);
    console.log('   Expanded 經典測驗 accordion column:', expandQuizCol);
    await new Promise(r => setTimeout(r, 600));

    const lobbyCheck = await cdp.evaluate(`
      (() => {
        const text = document.body.innerText;
        return {
          hasQuizChoice: text.includes('中英字義速辨') || text.includes('雙向速測'),
          hasListening: text.includes('英語聽力'),
          hasSpelling: text.includes('單字積木拼裝'),
          hasHandwriting: text.includes('神筆筆順書寫')
        };
      })()
    `);
    console.log('   Lobby Check Result (Classical Quiz 4 games):', lobbyCheck);
    if (!lobbyCheck.hasHandwriting) throw new Error('Handwriting card missing from Lobby!');
    if (!lobbyCheck.hasQuizChoice) throw new Error('Quiz-choice card missing from Lobby!');
    if (!lobbyCheck.hasListening) throw new Error('Listening card missing from Lobby!');
    if (!lobbyCheck.hasSpelling) throw new Error('Spelling card missing from Lobby!');

    console.log('\n6. Testing Quiz-Choice View (中英字義速辨):');
    await cdp.navigate(`${BASE_URL}/?view=quiz-choice`);
    const quizChoiceCheck = await cdp.evaluate(`
      (() => {
        const text = document.body.innerText;
        return {
          hasZhEn: text.includes('看中選英') || text.includes('🇨🇳➔🇬🇧'),
          hasEnZh: text.includes('看英選中') || text.includes('🇬🇧➔🇨🇳'),
          hasMixed: text.includes('雙向速測') || text.includes('🔀')
        };
      })()
    `);
    console.log('   Quiz-Choice 3-Tab Check:', quizChoiceCheck);
    if (!quizChoiceCheck.hasZhEn || !quizChoiceCheck.hasEnZh || !quizChoiceCheck.hasMixed) {
      throw new Error('Quiz-choice missing 3-mode selector tabs!');
    }

    console.log('\n7. Testing Handwriting View (神筆筆順書寫) in 3 Form Factors:');
    const viewports = [
      { name: 'Mobile', w: 390, h: 844 },
      { name: 'Tablet', w: 820, h: 1180 },
      { name: 'Desktop', w: 1280, h: 800 }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.w, vp.h);
      await cdp.navigate(`${BASE_URL}/?view=handwriting`);
      const hwCheck = await cdp.evaluate(`
        (() => {
          const canvas = document.querySelector('canvas');
          const text = document.body.innerText;
          const overflowX = document.documentElement.scrollWidth > window.innerWidth;
          return {
            hasCanvas: !!canvas,
            canvasTouchAction: canvas ? window.getComputedStyle(canvas).touchAction : null,
            hasTracingTab: text.includes('描寫自學版'),
            hasChallengeTab: text.includes('實戰默寫版'),
            overflowX
          };
        })()
      `);
      console.log(`   [${vp.name} ${vp.w}px] Check:`, hwCheck);
      if (!hwCheck.hasCanvas) throw new Error(`Canvas missing on ${vp.name}!`);
      if (hwCheck.canvasTouchAction !== 'none') throw new Error(`Canvas touchAction not none on ${vp.name}!`);
      if (hwCheck.overflowX) throw new Error(`Horizontal overflow detected on ${vp.name}!`);
    }

    console.log('\n8. Testing Tracing Mode vs Challenge Mode:');
    const modeTabsCheck = await cdp.evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const traceBtn = buttons.find(b => b.innerText.includes('描寫自學版'));
        const chalBtn = buttons.find(b => b.innerText.includes('實戰默寫版'));
        if (chalBtn) chalBtn.click();
        return { clickedChal: !!chalBtn };
      })()
    `);
    console.log('   Switched to Challenge Mode:', modeTabsCheck);
    await new Promise(r => setTimeout(r, 500));

    const chalState = await cdp.evaluate(`
      (() => {
        const text = document.body.innerText;
        return {
          hasSubmitCheck: text.includes('提交判定'),
          hasClear: text.includes('清空重寫')
        };
      })()
    `);
    console.log('   Challenge Mode Buttons:', chalState);
    if (!chalState.hasSubmitCheck) throw new Error('Challenge mode missing 提交判定 button!');

    console.log('\n9. Testing Leaderboard View Categories:');
    await cdp.navigate(`${BASE_URL}/?view=leaderboard`);
    const lbCheck = await cdp.evaluate(`
      (() => {
        const text = document.body.innerText;
        return {
          hasQuizCat: text.includes('經典測驗') || text.includes('Quiz')
        };
      })()
    `);
    console.log('   Leaderboard Check Result:', lbCheck);

    console.log('\n10. Checking Console Exceptions:');
    console.log('   Total Errors:', cdp.errors.length);
    if (cdp.errors.length > 0) {
      console.error('Errors encountered:', cdp.errors);
      throw new Error('Uncaught browser exceptions detected!');
    }

    console.log('\n🎉 ALL STEP 3 TESTS PASSED PERFECTLY (100% SUCCESS)!');
    cdp.close();
  } finally {
    server.kill();
    chrome.kill();
  }
}

run().catch(err => {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
});
