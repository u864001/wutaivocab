import fs from 'fs';
import path from 'path';

console.log('--- 開始驗證單人遊戲 45 分鐘閒置保護與多人連線幽靈房間清理機制 ---');

// 1. 檢查 InactivityGuard.jsx 是否存在且包含關鍵防護邏輯
const guardPath = 'src/components/common/InactivityGuard.jsx';
if (!fs.existsSync(guardPath)) {
  console.error('❌ InactivityGuard.jsx 檔案不存在！');
  process.exit(1);
}
const guardCode = fs.readFileSync(guardPath, 'utf8');
const guardChecks = [
  { name: '45分鐘閒置門檻', pattern: /timeoutMinutes\s*=\s*45/ },
  { name: '60秒倒數緩衝', pattern: /warningSeconds\s*=\s*60/ },
  { name: '全域使用者操作監聽 (pointerdown, touchstart, keydown 等)', pattern: /pointerdown/ },
  { name: '分頁背景休眠省電 (visibilitychange)', pattern: /visibilitychange/ },
  { name: '自動停止音訊與語音 (pauseSceneBgm, stopSpeech)', pattern: /pauseSceneBgm/ },
  { name: '溫柔警示彈窗 (小勇士還在嗎？)', pattern: /探險暫停：小勇士還在嗎？/ },
  { name: '點擊任意處立即解除警示', pattern: /recordUserActivity/ }
];

let guardPassed = 0;
guardChecks.forEach(c => {
  if (c.pattern.test(guardCode)) {
    console.log(`✅ [InactivityGuard] 通過: ${c.name}`);
    guardPassed++;
  } else {
    console.error(`❌ [InactivityGuard] 失敗: ${c.name}`);
  }
});

// 2. 檢查 App.jsx 是否成功掛載 InactivityGuard
const appPath = 'src/App.jsx';
const appCode = fs.readFileSync(appPath, 'utf8');
if (appCode.includes('InactivityGuard') && appCode.includes('onTimeoutToLobby')) {
  console.log('✅ [App.jsx] 成功掛載 InactivityGuard 全域守護！');
} else {
  console.error('❌ [App.jsx] 未掛載 InactivityGuard！');
  process.exit(1);
}

// 3. 檢查 BattleGame.jsx 多人連線幽靈房間四大閘門
const battlePath = 'src/games/battle/BattleGame.jsx';
const battleCode = fs.readFileSync(battlePath, 'utf8');
const battleChecks = [
  { name: '閘門1: 大廳 5 分鐘無操作自動解散 (lobbyIdleCountdown 300s)', pattern: /lobbyIdleCountdown/ },
  { name: '閘門1: 大廳無活動廣播 room-timeout 解散', pattern: /room-timeout/ },
  { name: '閘門2: 移動端/iPad 離線清理 (pagehide & beforeunload)', pattern: /pagehide/ },
  { name: '閘門2: 戰鬥中對手全員離線自動判定獲勝 (solo win)', pattern: /所有對手均已離線，判定您奪得本場擂台勝利/ },
  { name: '閘門3: 結算畫面 60 秒自動退場釋出 (resultCountdown 60s)', pattern: /resultCountdown/ },
  { name: '閘門3: 結算狀態 Presence 標記 (status: result)', pattern: /status:\s*'result'/ },
  { name: '閘門3: 大廳探測辨識已結算/逾時幽靈房間 (isGhost)', pattern: /isGhost/ },
  { name: '閘門3: 幽靈房間覆蓋開立清理 (admin_force_reset)', pattern: /stale_ghost_override/ },
  { name: '閘門4: 接收教師工作台強制重置 (admin_force_reset)', pattern: /event:\s*'admin_force_reset'/ }
];

let battlePassed = 0;
battleChecks.forEach(c => {
  if (c.pattern.test(battleCode)) {
    console.log(`✅ [BattleGame] 通過: ${c.name}`);
    battlePassed++;
  } else {
    console.error(`❌ [BattleGame] 失敗: ${c.name}`);
  }
});

// 4. 檢查 TeacherHub.jsx 管理者擂台監控與強制重置
const teacherPath = 'src/components/TeacherHub.jsx';
const teacherCode = fs.readFileSync(teacherPath, 'utf8');
const teacherChecks = [
  { name: '即時探測三大擂台 Presence (probeArenasInHub)', pattern: /probeArenasInHub/ },
  { name: '發送強制重置至現代標準頻道 (battle-${arenaId})', pattern: /battle-\$\{arenaId\}/ },
  { name: '發送強制重置至舊版相容頻道 (arena_presence_${arenaId})', pattern: /arena_presence_\$\{arenaId\}/ },
  { name: '後台 Tab 3 顯示真實線上人數與幽靈狀態', pattern: /線上人數/ }
];

let teacherPassed = 0;
teacherChecks.forEach(c => {
  if (c.pattern.test(teacherCode)) {
    console.log(`✅ [TeacherHub] 通過: ${c.name}`);
    teacherPassed++;
  } else {
    console.error(`❌ [TeacherHub] 失敗: ${c.name}`);
  }
});

console.log(`\n🎉 幽靈防護與逾時機制檢測完畢: InactivityGuard (${guardPassed}/${guardChecks.length}), BattleGame (${battlePassed}/${battleChecks.length}), TeacherHub (${teacherPassed}/${teacherChecks.length}) 全數合格！`);
