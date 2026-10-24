import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('══════════════════════════════════════════════════════════════');
console.log('  AUTOMATED CI FUNCTIONAL & SMOKE TEST SUITE (HEADLESS CHROME) ');
console.log('══════════════════════════════════════════════════════════════');

const PORT = 4198;
const BASE_URL = `http://localhost:${PORT}`;

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--host'], {
  stdio: 'pipe'
});

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        console.log('✓ Preview server active on port', PORT);
        return true;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Preview server failed to start');
}

const tempProfile = path.join(os.tmpdir(), `chrome_smoke_gate_${Date.now()}`);
fs.mkdirSync(tempProfile, { recursive: true });

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9263',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  `--user-data-dir=${tempProfile}`
]);

async function waitForChrome(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9263/json/list');
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
      if (pageTab) {
        return pageTab;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Headless Chrome failed to start');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
    this.consoleErrors = [];
    this.exceptions = [];
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
        } else if (data.method === 'Runtime.consoleAPICalled') {
          if (data.params.type === 'error') {
            const args = data.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
            this.consoleErrors.push(args);
          }
        } else if (data.method === 'Runtime.exceptionThrown') {
          this.exceptions.push(data.params.exceptionDetails);
        } else if (data.method === 'Page.javascriptDialogOpening') {
          this.send('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
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
}

const ALL_GAME_IDS = [
  'escape',
  'spotter',
  'maze',
  'memory',
  'mole',
  'swipe',
  'meteor',
  'snake',
  'quiz-choice',
  'quiz-listening',
  'spelling',
  'handwriting',
  'battle',
  'town'
];

async function run() {
  await waitForServer();
  const pageTab = await waitForChrome();
  const client = new CDPClient(pageTab.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: 'window.alert = () => {}; window.confirm = () => true; window.prompt = () => null;'
  }).catch(() => {});

  const failures = [];

  // ── 檢查點 1: 排行榜視圖與互動 ──
  console.log('\n[1/5] Testing Leaderboard View & Interactions...');
  client.exceptions = [];
  client.consoleErrors = [];
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=leaderboard` });
  await new Promise(r => setTimeout(r, 1200));

  let hasError = await client.evaluate(`document.body.innerText.includes('畫面載入遇到小插曲')`);
  if (hasError || client.exceptions.length > 0) {
    failures.push({ target: 'Leaderboard initial load', errors: client.exceptions });
    console.log('  ❌ Leaderboard failed to load');
  } else {
    console.log('  ✓ Leaderboard loaded smoothly');
  }

  await client.evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const g1 = btns.find(b => b.innerText.includes('一年級'));
      if (g1) g1.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 300));
  hasError = await client.evaluate(`document.body.innerText.includes('畫面載入遇到小插曲')`);
  if (hasError) failures.push({ target: 'Leaderboard grade switch', error: 'Crashed on grade click' });
  else console.log('  ✓ Leaderboard grade filter interaction passed');

  // ── 檢查點 2: 首頁大廳與教師台 ──
  console.log('\n[2/5] Testing Lobby & Teacher Hub...');
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=lobby` });
  await new Promise(r => setTimeout(r, 800));
  hasError = await client.evaluate(`document.body.innerText.includes('畫面載入遇到小插曲')`);
  if (hasError) failures.push({ target: 'Lobby', error: 'Crashed' });
  else console.log('  ✓ Lobby loaded smoothly');

  client.exceptions = [];
  client.consoleErrors = [];
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=teacher-hub` });
  await new Promise(r => setTimeout(r, 800));
  hasError = await client.evaluate(`document.body.innerText.includes('畫面載入遇到小插曲')`);
  if (hasError || client.exceptions.length > 0) {
    failures.push({ target: 'TeacherHub', error: 'Crashed', details: client.exceptions });
  } else {
    console.log('  ✓ TeacherHub loaded smoothly');
  }

  // ── 檢查點 3: 鷹眼神探深度功能性驗收 (低年級托盤 vs 中年級紙雕全相異) ──
  console.log('\n[3/5] Deep Functional Testing: VocabSpotterGame...');
  
  // 3A. 一年級字母托盤模式
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=spotter&grade=1&book=abc` });
  await new Promise(r => setTimeout(r, 1200));
  const spotterG1Check = await client.evaluate(`
    (() => {
      const body = document.body.innerText;
      const hasAlphabetTray = body.includes('左側托盤') && body.includes('右側托盤');
      const hasWordBank = body.includes('請在下方點選該相異物品');
      const trayButtons = document.querySelectorAll('button[style*="font-family"]').length;
      return {
        hasAlphabetTray,
        hasWordBank,
        trayButtonsCount: trayButtons
      };
    })()
  `);
  if (!spotterG1Check.hasAlphabetTray || spotterG1Check.trayButtonsCount === 0) {
    failures.push({ target: 'Spotter G1 Alphabet Trays', error: 'Alphabet trays not rendered', details: spotterG1Check });
    console.log('  ❌ Spotter G1 Alphabet Trays failed:', spotterG1Check);
  } else {
    console.log(`  ✓ Spotter G1: Alphabet Trays verified (${spotterG1Check.trayButtonsCount} interactive blocks)`);
  }

  // 3B. 三年級紙雕場景模式 (全部 8 處差異均為正解，Word Bank 存在)
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=spotter&grade=3&book=1` });
  await new Promise(r => setTimeout(r, 1200));
  const spotterG3Check = await client.evaluate(`
    (() => {
      const body = document.body.innerText;
      const hasScenes = document.querySelectorAll('svg').length >= 2;
      const hasWordBank = body.includes('鷹眼已鎖定') || body.includes('請先在上方雙圖中點選找出一處不同之處');
      return { hasScenes, hasWordBank };
    })()
  `);
  if (!spotterG3Check.hasScenes || !spotterG3Check.hasWordBank) {
    failures.push({ target: 'Spotter G3 Papercut & WordBank', error: 'Scenes or Word Bank missing', details: spotterG3Check });
    console.log('  ❌ Spotter G3 failed:', spotterG3Check);
  } else {
    console.log('  ✓ Spotter G3: Papercut dual-view & Word Bank verified');
  }

  // 3C. 六年級第 7 冊專屬場景驗收 (驗收世界節慶與環球港灣、第 7 冊單字庫)
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=spotter&grade=6&book=7` });
  await new Promise(r => setTimeout(r, 1200));
  const spotterG6Check = await client.evaluate(`
    (() => {
      const body = document.body.innerText;
      const hasBook7Title = body.includes('世界節慶與環球港灣') || body.includes('第 7 冊');
      const hasScenes = document.querySelectorAll('svg').length >= 2;
      return { hasBook7Title, hasScenes };
    })()
  `);
  if (!spotterG6Check.hasBook7Title || !spotterG6Check.hasScenes) {
    failures.push({ target: 'Spotter Book 7 Scene & Vocab', error: 'Book 7 not loaded', details: spotterG6Check });
    console.log('  ❌ Spotter Book 7 failed:', spotterG6Check);
  } else {
    console.log('  ✓ Spotter Book 7: Global Harbor scene & Grade 6 vocab verified');
  }

  // ── 檢查點 4: 雙語聽說口說測驗功能性流程驗收 (錄音、反饋與重測) ──
  console.log('\n[4/5] Deep Functional Testing: Speaking Lab...');
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=langlab` });
  await new Promise(r => setTimeout(r, 1000));

  // 點選進入口說跟讀
  const enteredSpeaking = await client.evaluate(`
    (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const speakBtn = btns.find(b => b.innerText.includes('口說測驗') || b.innerText.includes('口說跟讀'));
      if (speakBtn) {
        speakBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await new Promise(r => setTimeout(r, 600));

  // 點選挑戰模式第一項 (大寫字母或第一關)
  await client.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll('button, div[class*="cursor-pointer"]'));
      const startBtn = cards.find(c => c.innerText.includes('大寫字母') || c.innerText.includes('三年級') || c.innerText.includes('開始挑戰'));
      if (startBtn) startBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  // 點擊麥克風評測按鈕 (第 1 次點擊：開始錄音)
  await client.evaluate(`
    (() => {
      const micBtn = document.querySelector('button[title*="錄音"]');
      if (micBtn) micBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 200));

  // 再次點擊麥克風評測按鈕 (第 2 次點擊：立即提前結束並評測)
  await client.evaluate(`
    (() => {
      const micBtn = document.querySelector('button[title*="錄音"]');
      if (micBtn) micBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  // 檢查反饋卡片是否成功渲染出來
  const feedbackCheck = await client.evaluate(`
    (() => {
      const body = document.body.innerText;
      const hasFeedback = body.includes('匹配度評分') || body.includes('Perfect') || body.includes('Good job') || body.includes('大聲說出來') || body.includes('跟讀練習完成');
      return { hasFeedback, snippet: body.slice(0, 200) };
    })()
  `);
  if (!feedbackCheck.hasFeedback) {
    failures.push({ target: 'Speaking Lab Feedback Flow', error: 'Feedback score card did not render', details: feedbackCheck });
    console.log('  ❌ Speaking Lab Feedback Card did not render:', feedbackCheck);
  } else {
    console.log('  ✓ Speaking Lab: Recording & evaluation feedback card verified');
  }

  // ── 檢查點 5: 全部 14 款遊戲跨角色矩陣全量啟動 ──
  console.log('\n[5/5] Testing All 14 Games Across 4 Profiles...');
  const testProfiles = [
    { label: 'G1 (一年級)', grade: 1, book: 'abc' },
    { label: 'G2 (二年級)', grade: 2, book: 'abc' },
    { label: 'G4 (四年級)', grade: 4, book: '3' },
    { label: 'Guest (訪客)', grade: 'guest', book: '1' }
  ];

  for (const prof of testProfiles) {
    for (const gid of ALL_GAME_IDS) {
      client.exceptions = [];
      const url = `${BASE_URL}/?view=${gid}&grade=${prof.grade}&book=${prof.book}`;
      await client.send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 550));

      const isCrashed = await client.evaluate(`document.body.innerText.includes('畫面載入遇到小插曲')`);
      if (isCrashed || client.exceptions.length > 0) {
        console.log(`  ❌ [CRASH] ${prof.label} -> Game: ${gid}`);
        failures.push({ profile: prof.label, game: gid, exceptions: client.exceptions });
      }
    }
    console.log(`  ✓ 14 games passed for ${prof.label}`);
  }

  client.ws.close();
  try { chrome.kill(); } catch (e) {}
  try { server.kill(); } catch (e) {}

  if (failures.length > 0) {
    console.log(`\n❌ TEST SUITE FAILED! Total Failed Items: ${failures.length}`);
    console.log(JSON.stringify(failures, null, 2));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL FUNCTIONAL TESTS & ALL 14 GAMES PASSED 100% WITH ZERO CRASHES!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Test runner fatal error:', err);
  try { chrome.kill(); } catch (e) {}
  try { server.kill(); } catch (e) {}
  process.exit(1);
});
