# 叢林貪食蛇 (`SnakeGame`)、單字打地鼠 (`WhackAMoleGame`) 與極速滑卡 (`SwipeCardGame`) 專屬規範

> **對應檔案**：`src/games/snake/SnakeGame.jsx`、`src/games/snake/SnakeCanvas2D.jsx`、`src/games/snake/snakeJungleTheme.js`、`src/games/mole/WhackAMoleGame.jsx`、`src/games/swipe/SwipeCardGame.jsx`

---

## 一、 叢林神山貪食蛇 (`SnakeGame.jsx`) 核心規範

1. **轉向指令緩衝隊列 (`inputQueueRef`) — 嚴禁漏接！**：
   - 玩家透過鍵盤（`ArrowUp/Down/Left/Right`、`WASD`）、虛擬十字鍵（`onPointerDown` + `onClick` 雙綁定 0ms 延遲）或畫面連續滑動（`touchmove` 閾值 16px）輸入方向時，統一呼叫 `queueDirection(newDir)` 推入 `inputQueueRef.current`（最多保留最新 2 個有效轉彎指令，並過濾同向與 180 度直接掉頭）。
   - **關鍵鐵律**：在 `advanceOneStep()` 每推進一格時，**必須執行 `if (inputQueueRef.current.length > 0) { dirRef.current = inputQueueRef.current.shift(); }`** 將隊列中的轉向指令取出並套用至 `dirRef.current`！若漏掉此行，所有上下左右按鍵與十字鍵都會失效。
2. **2D 正俯視日夜雙模式與 4K 字母清晰度 (`SnakeCanvas2D.jsx`, `snakeJungleTheme.js`)**：
   - 支援白晝晨曦 ☀️（翠綠棋盤草地、3 隻翠鳳蝶）與星月夜景 🌙（深色草坪、45° 月光掃光、6 隻呼吸光螢火蟲、黑曜岩蛇身琥珀菱紋）。
   - **字母渲染鐵律**：場上字母繪製文字本體時**必須關閉 `ctx.shadowBlur = 0`**，改用 900 特粗純黑描邊（4.5px）＋純白/高純金填充，避免黃色光暈將字母模糊成光團。
3. **大廳直通開局**：
   - 難度（普通/進階/大師）於大廳整備室選擇並存於 `localStorage.getItem('wutai_snake_difficulty')`，進入遊戲後於 `useEffect` 直接呼叫 `handleStart(savedDiff)`，不設二次開始彈窗。

---

## 二、 單字打地鼠 (`WhackAMoleGame.jsx`) 與極速滑卡 (`SwipeCardGame.jsx`) 規範

1. **空值防禦**：
   - 讀取 `settings?.selectedUnits` 時一律使用 `(settings?.selectedUnits || [])`，當未選單元或題庫為空時自動回退至預設單字池或字母模式（`isAlphabetMode`）。
2. **低年級字母模式 (`abc`) 支援**：
   - 當 `qualifyingBook === 'abc'` 或 `settings?.alphaMode` 為真時，自動切換為大小寫字母配對題庫。
