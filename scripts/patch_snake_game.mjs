import fs from 'fs';

let game = fs.readFileSync('src/games/snake/SnakeGame.jsx', 'utf8');

// 1. Add useTheme import
game = game.replace(
  "import { useI18n } from '../../context/I18nContext';",
  "import { useI18n } from '../../context/I18nContext';\nimport { useTheme } from '../../context/ThemeContext';"
);

// 2. Add Sun, Moon to lucide-react import
game = game.replace(
  "Mountain, Trees, Award",
  "Mountain, Trees, Award, Sun, Moon"
);

// 3. Inside SnakeGame component, get isDark and toggleTheme
game = game.replace(
  "  const { t } = useI18n();",
  "  const { t } = useI18n();\n  const { isDark, toggleTheme } = useTheme();\n  const inputQueueRef = useRef([]);"
);

// 4. Implement queueDirection
const queueDirectionCode = `  // ── 方向輸入緩衝隊列 (徹底杜絕轉彎延遲、掉幀與指令覆蓋) ──
  const queueDirection = (newDir) => {
    const queue = inputQueueRef.current;
    const lastDir = queue.length > 0 ? queue[queue.length - 1] : dirRef.current;

    // 防止同方向重複
    if (newDir === lastDir) return;

    // 防止 180 度直接掉頭撞擊自己
    const isOpposite =
      (newDir === 'UP' && lastDir === 'DOWN') ||
      (newDir === 'DOWN' && lastDir === 'UP') ||
      (newDir === 'LEFT' && lastDir === 'RIGHT') ||
      (newDir === 'RIGHT' && lastDir === 'LEFT');

    if (isOpposite) return;

    // 最多保留最新 2 個有效轉彎指令，依序執行！
    if (queue.length < 2) {
      queue.push(newDir);
    } else {
      queue[1] = newDir;
    }
  };`;

game = game.replace(
  "  // 鍵盤操作監聽 (防反向撞自己)",
  queueDirectionCode + "\n\n  // 鍵盤操作監聽 (防反向撞自己)"
);

// 5. Update handleKeyDown to use queueDirection
const oldKeyDown = `    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const cur = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && cur !== 'DOWN') dirRef.current = 'UP';
      else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && cur !== 'UP') dirRef.current = 'DOWN';
      else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && cur !== 'RIGHT') dirRef.current = 'LEFT';
      else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && cur !== 'LEFT') dirRef.current = 'RIGHT';
    };`;

const newKeyDown = `    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        queueDirection('UP');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        queueDirection('DOWN');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        queueDirection('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        queueDirection('RIGHT');
      }
    };`;

game = game.replace(oldKeyDown, newKeyDown);

// 6. In advanceOneStep, dequeue from inputQueueRef
const oldAdvanceDir = `      // 4. 計算下一個目標蛇頭 (nextHead)
      const curDir = dirRef.current;`;

const newAdvanceDir = `      // 4. 計算下一個目標蛇頭 (nextHead) - 從輸入緩衝隊列取出下一個方向
      if (inputQueueRef.current.length > 0) {
        dirRef.current = inputQueueRef.current.shift();
      }
      const curDir = dirRef.current;`;

game = game.replace(oldAdvanceDir, newAdvanceDir);

// 7. Update touch gestures for instant continuous swiping without lifting finger
const oldTouch = `  // 觸控手勢
  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        handleDpad(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        handleDpad(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  const handleDpad = (newDir) => {
    const cur = dirRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') dirRef.current = 'UP';
    if (newDir === 'DOWN' && cur !== 'UP') dirRef.current = 'DOWN';
    if (newDir === 'LEFT' && cur !== 'RIGHT') dirRef.current = 'LEFT';
    if (newDir === 'RIGHT' && cur !== 'LEFT') dirRef.current = 'RIGHT';
  };`;

const newTouch = `  // ── 觸控手勢 (支援平滑連續滑動轉向，不需抬手即可連續轉彎！) ──
  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // 只要滑動超過 16px 即刻觸發轉向，無需等待 touchend！
    if (Math.max(absX, absY) >= 16) {
      if (absX > absY) {
        queueDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        queueDirection(dy > 0 ? 'DOWN' : 'UP');
      }
      // 重置起點，支援不抬手連續多向轉彎！
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) >= 12) {
      if (absX > absY) {
        queueDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        queueDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  const handleDpad = (newDir) => {
    queueDirection(newDir);
  };`;

game = game.replace(oldTouch, newTouch);

// 8. Add isDark prop to SnakeCanvas2D
game = game.replace(
  "          theme={theme}",
  "          theme={theme}\n          isDark={isDark}"
);

// 9. Add Day/Night toggle button next to theme switcher in HUD
const themeToggleBlock = `        {/* 雙主題快速切換微型開關 */}`;
const newThemeToggleBlock = `        {/* 雙主題與日夜模式快速切換微型開關 */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => handleToggleTheme('indigenous')}
              title="切換為霧台百步蛇主題"
              className={\`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 \${
                theme === 'indigenous'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }\`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">百步蛇</span>
            </button>
            <button
              onClick={() => handleToggleTheme('jungle')}
              title="切換為熱帶雨林主題"
              className={\`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 \${
                theme === 'jungle'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }\`}
            >
              <Trees className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">青蛇雨林</span>
            </button>
          </div>

          {/* ☀️/🌙 晨曦與星月夜景切換 */}
          <button
            onClick={() => {
              soundEngine.click();
              toggleTheme();
            }}
            title={isDark ? '切換為晨曦白晝' : '切換為星月夜景 (附螢火蟲)'}
            className="p-1.5 sm:px-2 sm:py-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-amber-500 dark:text-cyan-300 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-xs font-black shadow-sm"
          >
            {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />}
            <span className="hidden md:inline">{isDark ? '星月夜景' : '晨曦白晝'}</span>
          </button>
        </div>`;

// Replace the original theme toggle block
const oldThemeHtmlRegex = /\{\/\* 雙主題快速切換微型開關 \*\/\}[\s\S]*?<\/div>/;
game = game.replace(oldThemeHtmlRegex, newThemeToggleBlock);

// 10. Upgrade Virtual Dpad to onPointerDown for 0ms latency and high-tactile feel
const oldDpadRegex = /\{\/\* 虛擬十字鍵 \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);/;

const newDpadHtml = `{/* 虛擬十字鍵 (極速 0ms 延遲 onPointerDown + 防誤觸) */}
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mb-1 select-none touch-none">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            soundEngine.click();
            queueDirection('UP');
          }}
          className="w-16 h-11 sm:h-12 rounded-2xl bg-slate-800/90 active:bg-amber-500 border-2 border-slate-600 active:border-amber-300 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
          title="向上 (W / ↑)"
        >
          <ArrowUp className="w-6 h-6 text-amber-300" />
        </button>
        <div className="flex gap-4">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              soundEngine.click();
              queueDirection('LEFT');
            }}
            className="w-16 h-11 sm:h-12 rounded-2xl bg-slate-800/90 active:bg-amber-500 border-2 border-slate-600 active:border-amber-300 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
            title="向左 (A / ←)"
          >
            <DpadLeft className="w-6 h-6 text-amber-300" />
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              soundEngine.click();
              queueDirection('DOWN');
            }}
            className="w-16 h-11 sm:h-12 rounded-2xl bg-slate-800/90 active:bg-amber-500 border-2 border-slate-600 active:border-amber-300 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
            title="向下 (S / ↓)"
          >
            <ArrowDown className="w-6 h-6 text-amber-300" />
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              soundEngine.click();
              queueDirection('RIGHT');
            }}
            className="w-16 h-11 sm:h-12 rounded-2xl bg-slate-800/90 active:bg-amber-500 border-2 border-slate-600 active:border-amber-300 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
            title="向右 (D / →)"
          >
            <DpadRight className="w-6 h-6 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  </div>
  );`;

game = game.replace(oldDpadRegex, newDpadHtml);

fs.writeFileSync('src/games/snake/SnakeGame.jsx', game, 'utf8');
console.log('SnakeGame.jsx updated with input queue, continuous swipes, Day/Night toggle, and 0ms D-pad!');
