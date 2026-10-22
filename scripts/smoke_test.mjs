import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('══════════════════════════════════════════════════════════════');
console.log('  AUTOMATED CI SMOKE TEST GATE (HEADLESS CHROME + CDP)         ');
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

  const failures = [];

  // ── 檢查點 1: 排行榜視圖與互動 ──
  console.log('\n[1/3] Testing Leaderboard View & Interactions...');
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

  // 測試排行榜切換一年級與四年級標籤
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
  console.log('\n[2/3] Testing Lobby & Teacher Hub...');
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=lobby` });
  await new Promise(r => setTimeout(r, 800));
  hasError = await client.evaluate(`document.body.innerText.includes('畫面載入遇到小插曲')`);
  if (hasError) failures.push({ target: 'Lobby', error: 'Crashed' });
  else console.log('  ✓ Lobby loaded smoothly');

  client.exceptions = [];
  client.consoleErrors = [];
  await client.send('Page.navigate', { url: `${BASE_URL}/?view=teacher-hub` });
  await new Promise(r => setTimeout(r, 1000));
  hasError = await client.evaluate(`document.body.innerText.includes('畫面載入遇到小插曲')`);
  if (hasError || client.exceptions.length > 0) {
    console.log('  ❌ TeacherHub Exceptions:', JSON.stringify(client.exceptions, null, 2));
    console.log('  ❌ TeacherHub Console Errors:', client.consoleErrors);
    failures.push({ target: 'TeacherHub', error: 'Crashed', details: client.exceptions });
  } else {
    console.log('  ✓ TeacherHub loaded smoothly');
  }

  // ── 檢查點 3: 全部 14 款遊戲跨角色矩陣全量啟動 ──
  console.log('\n[3/3] Testing All 14 Games Across 4 Profiles...');
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
      await new Promise(r => setTimeout(r, 650));

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
    console.log(`\n❌ SMOKE TEST FAILED! Total Crashed Targets: ${failures.length}`);
    console.log(JSON.stringify(failures, null, 2));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 14 GAMES & ALL VIEWS PASSED 100% WITH ZERO CRASHES!');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Smoke test runner fatal error:', err);
  try { chrome.kill(); } catch (e) {}
  try { server.kill(); } catch (e) {}
  process.exit(1);
});
