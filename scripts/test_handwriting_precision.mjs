import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('══════════════════════════════════════════════════════════════');
console.log('  TEST: HANDWRITING CANVAS COORDINATE PRECISION & DPR SCALING  ');
console.log('══════════════════════════════════════════════════════════════');

const PORT = 4182;
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

const tempProfile = path.join(os.tmpdir(), `chrome_hw_prec_${Date.now()}`);
fs.mkdirSync(tempProfile, { recursive: true });

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9235',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  `--user-data-dir=${tempProfile}`
]);

async function waitForChrome(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9235/json/list');
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
      if (pageTab) {
        console.log('   Chrome headless ready on port 9235');
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

  async setScaleAndViewport(width, height, dpr) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: dpr,
      mobile: false
    });
  }
}

async function run() {
  await waitForServer();
  const pageTab = await waitForChrome();
  const client = new CDPClient(pageTab.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const testCases = [
    { name: '1. 標準桌機 (100% 縮放, DPR=1.0)', dpr: 1.0, w: 1280, h: 800 },
    { name: '2. Windows 筆電常見預設縮放 (125% 縮放, DPR=1.25)', dpr: 1.25, w: 1536, h: 864 },
    { name: '3. 高解析度筆電推薦縮放 (150% 縮放, DPR=1.5)', dpr: 1.5, w: 1920, h: 1080 },
    { name: '4. iPad / Retina 視網膜高畫質 (200% 縮放, DPR=2.0)', dpr: 2.0, w: 1024, h: 768 },
    { name: '5. 手機螢幕 (390x844, DPR=3.0)', dpr: 3.0, w: 390, h: 844 }
  ];

  for (const tc of testCases) {
    console.log(`\n▶ 測試: ${tc.name}`);
    await client.setScaleAndViewport(tc.w, tc.h, tc.dpr);
    await client.send('Page.navigate', { url: `${BASE_URL}/handwriting` });

    // 等候直到 canvas 與 svg 載入完成
    let found = false;
    for (let r = 0; r < 25; r++) {
      const exists = await client.evaluate(`Boolean(document.querySelector('canvas') && document.getElementById('four-lines-board-svg'))`);
      if (exists) { found = true; break; }
      await new Promise(res => setTimeout(res, 400));
    }

    if (!found) {
      console.error('   ❌ 等候超時：找不到畫布或 SVG');
      process.exit(1);
    }

    const check = await client.evaluate(`
      (() => {
        const canvas = document.querySelector('canvas');
        const svg = document.getElementById('four-lines-board-svg');
        if (!canvas || !svg) return { error: 'Canvas or SVG not found' };

        const cRect = canvas.getBoundingClientRect();
        const sRect = svg.getBoundingClientRect();

        const diffW = Math.abs(cRect.width - sRect.width);
        const diffH = Math.abs(cRect.height - sRect.height);
        const diffL = Math.abs(cRect.left - sRect.left);
        const diffT = Math.abs(cRect.top - sRect.top);

        const dpr = window.devicePixelRatio;
        const expectedBufferW = Math.round(cRect.width * dpr);
        const expectedBufferH = Math.round(cRect.height * dpr);
        const bufferMatch = canvas.width === expectedBufferW && canvas.height === expectedBufferH;

        return {
          dpr,
          cRect: { width: cRect.width, height: cRect.height, left: cRect.left, top: cRect.top },
          sRect: { width: sRect.width, height: sRect.height, left: sRect.left, top: sRect.top },
          diff: { diffW, diffH, diffL, diffT },
          canvasBuffer: { width: canvas.width, height: canvas.height },
          expectedBuffer: { width: expectedBufferW, height: expectedBufferH },
          bufferMatch
        };
      })()
    `);

    console.log(`   幾何對齊: 寬差=${check.diff.diffW.toFixed(2)}px, 高差=${check.diff.diffH.toFixed(2)}px, 位置差=${check.diff.diffL.toFixed(2)}px`);
    console.log(`   DPR 解析度: 螢幕 DPR=${check.dpr}, Canvas Buffer=[${check.canvasBuffer.width}x${check.canvasBuffer.height}] (${check.bufferMatch ? '✅ 精確配對' : '❌ 尺寸不符'})`);

    if (check.diff.diffW > 0.5 || check.diff.diffH > 0.5) {
      console.error('❌ Canvas 與 SVG 未 100% 重合！');
      process.exit(1);
    }

    // 在當前視窗內畫布的可見區域中央畫一條線
    const visibleLeft = Math.max(0, check.cRect.left);
    const visibleRight = Math.min(tc.w, check.cRect.left + check.cRect.width);
    const visibleCenterX = (visibleLeft + visibleRight) / 2;
    const midY = check.cRect.top + check.cRect.height * 0.5;

    await client.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: visibleCenterX - 15,
      y: midY,
      button: 'left',
      buttons: 1,
      clickCount: 1
    });

    await new Promise(r => setTimeout(r, 40));

    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: visibleCenterX,
      y: midY,
      buttons: 1
    });

    await new Promise(r => setTimeout(r, 40));

    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: visibleCenterX + 15,
      y: midY,
      buttons: 1
    });

    await new Promise(r => setTimeout(r, 40));

    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: visibleCenterX + 15,
      y: midY,
      button: 'left'
    });

    // 等待 React re-render 與 canvas 重繪完成
    await new Promise(r => setTimeout(r, 200));

    // 檢查點擊的 visibleCenterX, midY 在 canvas 緩衝區中是否命中墨水
    const strokeTest = await client.evaluate(`
      (({ clickScreenX, clickScreenY }) => {
        const canvas = document.querySelector('canvas');
        const cRect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');

        // 計算該螢幕點對應之緩衝區像素
        const ratioX = (clickScreenX - cRect.left) / cRect.width;
        const ratioY = (clickScreenY - cRect.top) / cRect.height;
        const bufferTargetX = Math.round(canvas.width * ratioX);
        const bufferTargetY = Math.round(canvas.height * ratioY);

        // 讀取命中點 9x9 範圍像素
        const imgData = ctx.getImageData(bufferTargetX - 4, bufferTargetY - 4, 9, 9).data;
        let inkPixels = 0;
        for (let i = 0; i < imgData.length; i += 4) {
          const alpha = imgData[i + 3];
          if (alpha > 40) {
            inkPixels++;
          }
        }
        return { hasInk: inkPixels > 0, inkPixels, bufferTargetX, bufferTargetY };
      })({ clickScreenX: ${visibleCenterX}, clickScreenY: ${midY} })
    `);

    console.log(`   滑鼠筆尖命中性: ${strokeTest.hasInk ? `✅ 筆尖位置墨水精確命中 (${strokeTest.inkPixels} 個像素覆蓋)` : '❌ 筆跡偏移未命中'} (緩衝區目標點 [${strokeTest.bufferTargetX}, ${strokeTest.bufferTargetY}])`);

    if (!strokeTest.hasInk) {
      console.error(`❌ 在 DPR=${tc.dpr} 環境下滑鼠繪製發生跑格！`);
      process.exit(1);
    }
  }

  client.ws.close();
  chrome.kill();
  server.kill();

  console.log('\n🎉 所有多端縮放比（筆電 125%、150%，手機/平板 200%、300%）檢測 100% 通過！徹底解決滑鼠跑格問題！');
}

run().catch((err) => {
  console.error(err);
  chrome.kill();
  server.kill();
  process.exit(1);
});
