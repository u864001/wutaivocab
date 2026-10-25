import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TESTING SPOTTER QA WORKBENCH (HEADLESS CHROME CDP) ');
console.log('══════════════════════════════════════════════════════════════');

const PORT = 4199;
const BASE_URL = `http://localhost:${PORT}/?view=spotter-test`;

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--host'], {
  stdio: 'pipe'
});

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}`);
      if (res.ok) {
        console.log('✓ Preview server active on port', PORT);
        return true;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Preview server failed to start');
}

const tempProfile = path.join(os.tmpdir(), `chrome_spotter_test_${Date.now()}`);
fs.mkdirSync(tempProfile, { recursive: true });

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9264',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  `--user-data-dir=${tempProfile}`
]);

async function waitForChrome(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9264/json/list');
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
      if (pageTab) return pageTab;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error('Chrome failed to start');
}

async function run() {
  try {
    await waitForServer();
    const pageTab = await waitForChrome();
    const wsUrl = pageTab.webSocketDebuggerUrl;

    const { WebSocket } = await import('ws');
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();
    const errors = [];

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'assert')) {
        errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params.exceptionDetails?.text || 'Uncaught exception');
      }
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    });

    await new Promise(r => ws.on('open', r));

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    console.log(`Navigating to ${BASE_URL}...`);
    await send('Page.navigate', { url: BASE_URL });
    
    // Wait for word database sync / timeout to finish
    console.log('Waiting for initial data load...');
    for (let i = 0; i < 30; i++) {
      const evalRes = await send('Runtime.evaluate', { expression: 'document.body ? document.body.innerText : ""' });
      const txt = evalRes.result?.result?.value || '';
      if (txt.includes('變異檢驗工作台') || txt.includes('鷹眼神探')) {
        break;
      }
      await new Promise(r => setTimeout(r, 400));
    }

    // Verify page content
    const titleRes = await send('Runtime.evaluate', {
      expression: 'document.body.innerText'
    });
    const bodyText = titleRes.result?.result?.value || '';

    if (bodyText.includes('變異檢驗工作台') && bodyText.includes('荷蘭贊斯風車')) {
      console.log('✓ Spotter QA Workbench loaded successfully with Book 1 Scene 2 (Amsterdam Market)!');
    } else {
      console.error('✗ Expected text not found in body text:', bodyText.slice(0, 300));
      process.exitCode = 1;
    }

    // Switch to Zoom Matrix tab
    console.log('Testing Zoom Matrix Tab click...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('顯微矩陣'));
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 500));
    const matrixRes = await send('Runtime.evaluate', { expression: 'document.body.innerText' });
    if (matrixRes.result?.result?.value.includes('8 大相異目標顯微局部驗收矩陣')) {
      console.log('✓ Zoom Matrix Tab switched and verified!');
    }

    // Switch to Dynamic Simulator tab
    console.log('Testing Dynamic 8-choose-5 Simulator Tab click...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('動態 8 選 5 模擬'));
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 500));
    const simRes = await send('Runtime.evaluate', { expression: 'document.body.innerText' });
    if (simRes.result?.result?.value.includes('雙圖槽位動態 8 選 5 變異引擎')) {
      console.log('✓ Dynamic 8-choose-5 Simulator Tab switched and verified!');
    }

    // Check for JavaScript console errors
    const fatalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
    if (fatalErrors.length > 0) {
      console.error('✗ Console errors found:', fatalErrors);
      process.exitCode = 1;
    } else {
      console.log('✓ Zero console errors detected during inspection!');
    }

    ws.close();
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
    chrome.kill();
    setTimeout(() => {
      try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (e) {}
      process.exit(process.exitCode || 0);
    }, 500);
  }
}

run();
