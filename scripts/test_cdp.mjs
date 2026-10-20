import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('Testing Chrome launch and CDP connection...');

const tempDir = path.resolve('chrome_tmp_test');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=' + tempDir
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9225/json/list');
    const tabs = await res.json();
    console.log('Chrome tabs found:', tabs.length);
    chrome.kill();
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('CDP connection test PASSED!');
    process.exit(0);
  } catch (e) {
    console.error('CDP test error:', e);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
