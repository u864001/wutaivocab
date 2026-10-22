import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TEST: ADAPTIVE FOUR-LINE HANDWRITING BOARD (SINGLE vs WORD)  ');
console.log('  Verifying: Low-Grade Big Single Letter vs High-Grade Word Ruled Strip');
console.log('══════════════════════════════════════════════════════════════');

const PORT = 4178;
const BASE_URL = `http://localhost:${PORT}`;

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--host'], {
  stdio: 'pipe'
});

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        console.log('   Preview server ready on port', PORT);
        return true;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Preview server failed to start');
}

const tempProfile = path.join(os.tmpdir(), `chrome_wutai_hw_${Date.now()}`);
fs.mkdirSync(tempProfile, { recursive: true });

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  `--user-data-dir=${tempProfile}`
]);

async function waitForChrome(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9231/json/list');
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

    console.log('\n1. Testing Grade 1 (Single Big Alphabet Block):');
    await cdp.navigate(`${BASE_URL}/`);
    await cdp.evaluate(`
      (() => {
        localStorage.setItem('wutai_guest_student', 'true');
        localStorage.setItem('wutai_last_student_id', '010101');
        localStorage.setItem('wutai_current_student', JSON.stringify({
          student_id: '010101',
          nickname: '一年級小勇士',
          grade: '01',
          classNum: '01',
          seat: '01'
        }));
      })()
    `);

    await cdp.setViewport(1280, 800);
    await cdp.navigate(`${BASE_URL}/?view=handwriting`);
    await new Promise(r => setTimeout(r, 800));

    const g1Check = await cdp.evaluate(`
      (() => {
        const svg = document.querySelector('#four-lines-board-svg') || Array.from(document.querySelectorAll('svg')).find(s => s.getAttribute('viewBox')?.includes('120'));
        const viewBox = svg ? svg.getAttribute('viewBox') : null;
        const canvas = document.querySelector('canvas');
        return {
          viewBox,
          isSingleBlock: viewBox === '0 0 100 120',
          hasCanvas: !!canvas
        };
      })()
    `);
    console.log('   Grade 1 Check (Squarish 100x120 viewBox):', g1Check);
    if (!g1Check.isSingleBlock) throw new Error('Expected 100x120 squarish viewBox for Grade 1 single alphabet!');

    console.log('\n2. Testing Grade 4 (Word Mode - Adaptive Continuous 4-Line Strip):');
    await cdp.evaluate(`
      (() => {
        localStorage.setItem('wutai_last_student_id', '040105');
        localStorage.setItem('wutai_current_student', JSON.stringify({
          student_id: '040105',
          nickname: '四年級神筆勇士',
          grade: '04',
          classNum: '01',
          seat: '05'
        }));
      })()
    `);

    await cdp.navigate(`${BASE_URL}/?view=handwriting`);
    await new Promise(r => setTimeout(r, 800));

    const g4Check = await cdp.evaluate(`
      (() => {
        const svg = document.querySelector('#four-lines-board-svg') || Array.from(document.querySelectorAll('svg')).find(s => s.getAttribute('viewBox')?.includes('120'));
        const viewBox = svg ? svg.getAttribute('viewBox') : null;
        const text = document.body.innerText;
        const vbWidth = viewBox ? parseFloat(viewBox.split(' ')[2]) : 0;
        return {
          viewBox,
          vbWidth,
          isSlenderStrip: vbWidth > 150, // Word strip is elongated
          textLength: text.length
        };
      })()
    `);
    console.log('   Grade 4 Check (Elongated Word Strip):', g4Check);
    if (!g4Check.isSlenderStrip) throw new Error('Expected slender/elongated continuous 4-line strip for words in Grade 4!');

    console.log('\n3. Testing Tracing Mode vs Challenge Mode dimensions consistency:');
    const chalCheck = await cdp.evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const chalBtn = buttons.find(b => b.innerText.includes('實戰默寫版'));
        if (chalBtn) chalBtn.click();
        
        const svg = document.querySelector('#four-lines-board-svg') || Array.from(document.querySelectorAll('svg')).find(s => s.getAttribute('viewBox')?.includes('120'));
        const chalViewBox = svg ? svg.getAttribute('viewBox') : null;
        return {
          clickedChal: !!chalBtn,
          chalViewBox
        };
      })()
    `);
    console.log('   Challenge Mode Check (Same exact dimension as tracing):', chalCheck);
    if (chalCheck.chalViewBox !== g4Check.viewBox) {
      throw new Error('Challenge Mode must match Tracing Mode dimensions exactly!');
    }

    console.log('\n4. Testing Mobile Responsiveness (390px):');
    await cdp.setViewport(390, 844);
    await new Promise(r => setTimeout(r, 500));
    const mobileCheck = await cdp.evaluate(`
      (() => {
        const overflowX = document.documentElement.scrollWidth > window.innerWidth;
        const canvas = document.querySelector('canvas');
        return {
          overflowX,
          canvasExists: !!canvas,
          canvasTouchAction: canvas ? window.getComputedStyle(canvas).touchAction : null
        };
      })()
    `);
    console.log('   Mobile Check (390px):', mobileCheck);
    if (mobileCheck.overflowX) throw new Error('Page-level horizontal overflow on mobile!');
    if (mobileCheck.canvasTouchAction !== 'none') throw new Error('Touch action lock missing!');

    console.log('\n5. Checking Console Errors:');
    console.log('   Total Errors:', cdp.errors.length);
    if (cdp.errors.length > 0) {
      console.error('Errors encountered:', cdp.errors);
      throw new Error('Uncaught browser exceptions detected!');
    }

    console.log('\n🎉 ADAPTIVE 4-LINE HANDWRITING TESTS 100% PASSED!');
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
