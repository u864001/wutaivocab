# 叢林貪食蛇 (`SnakeGame`)、單字打地鼠 (`WhackAMoleGame`) 與極速滑卡 (`SwipeCardGame`) 專屬規範

> **對應檔案**：`src/games/snake/SnakeGame.jsx`、`src/games/snake/SnakeCanvas2D.jsx`、`src/games/snake/snakeJungleTheme.js`、`src/games/mole/WhackAMoleGame.jsx`、`src/games/swipe/SwipeCardGame.jsx`

---

## 一、 叢林神山貪食蛇 (`SnakeGame.jsx`) 核心規範

1. **轉向指令緩衝隊列 (`inputQueueRef`) — 嚴禁漏接！**：
   - 玩家透過鍵盤（`ArrowUp/Down/Left/Right`、`WASD`）、虛擬十字鍵（`onPointerDown` + `onClick` 雙綁定 0ms 延遲）或畫面連續滑動（`touchmove` 閾值 16px）輸入方向時，統一呼叫 `queueDirection(newDir)` 推入 `inputQueueRef.current`（最多保留最新 2 個有效轉彎指令，並過濾同向與 180 度直接掉頭）。
   - **關鍵鐵律**：在 `advanceOneStep()` 每推進一格時，**必須執行 `if (inputQueueRef.current.length > 0) { dirRef.current = inputQueueRef.current.shift(); }`** 將隊列中的轉向指令取出並套用至 `dirRef.current`！若漏掉此行，所有上下左右按鍵與十字鍵都會失效。
2. **2D 正俯視日夜雙景生態與 4K 字母清晰度 (`SnakeCanvas2D.jsx`, `snakeJungleTheme.js`)**：
   - **四周邊框**：
     - 白天：魯凱特色頁岩片疊石砌牆 (Stacked Slate Wall) ＋ 蔓生翠綠青苔 ＋ 盛開純白高山百合花飾。
     - 夜間：月光黑曜石板矮牆（冷灰藍高光） ＋ 深色夜蘚 ＋ 月夜幽光百合（冰藍柔光）。
   - **日夜專屬生態彩蛋**：
     - 白天：右上角台灣黑熊探頭舉爪歡呼、左上角台灣雲豹、高山鳳蝶雙翼快速撲閃。
     - 夜間：右上角領角鴞/貓頭鷹 (Owl) 眨眼轉頭與拍翅、左上角神山大赤鼯鼠 (Flying Squirrel) 探頭、夜光螢火蟲 (Fireflies) 呼吸式脈衝發光並具備平緩有機浮游物理（非蝴蝶拍翅）。
   - **字母渲染鐵律**：場上字母繪製文字本體時**必須關閉 `ctx.shadowBlur = 0`**，改用 900 特粗純黑描邊（4.5px）＋純白/高純金填充，避免黃色光暈將字母模糊成光團。
3. **大廳直通開局**：
   - 難度（普通/進階/大師）於大廳整備室選擇並存於 `localStorage.getItem('wutai_snake_difficulty')`，進入遊戲後於 `useEffect` 直接呼叫 `handleStart(savedDiff)`，不設二次開始彈窗。
4. **神聖百步蛇與小青蛇 2D 俯視美術資產規範 (`snake_head_indigenous.webp`, `snake_tail_indigenous.webp`)**：
   - **蛇頭幾何與無縫頸圈銜接**：
     - 嚴禁使用方塊或生硬多邊形拼接！百步蛇頭部採用 2D 正俯視（UP 0°）經典水滴/心型三角頭型，具備前翹鼻尖 (pointed upturned snout)、深邃眉脊與琥珀金瞳。
     - 蛇頭底端採圓潤弧度頸圈（與身體半徑 14px 完美包覆對齊），樞紐點設於眼脊與顴骨間 (`pivotY = headH * 0.58`)，吐信分叉蛇舌必須由最前沿翹鼻尖探出。
     - 轉彎時蛇頭由樞紐旋轉，圓弧頸圈緊密覆蓋身體首節，杜絕方塊截斷或頸部外凸破綻。
   - **身軀立體圓柱光澤與祖靈菱紋**：
     - 蛇身全鏈帶具備真實地面柔和投影 (`shadowBlur: 8, shadowOffsetY: 4`)，背脊中央繪製立體圓柱背脊光澤條 (`lineWidth: 10`)。
     - 白天：深黑底框 + 純白外三角 + 暖金赤心內菱形 + 黑曜祖靈眼點。
     - 夜間：黑曜幾何外框 + 琉璃琥珀呼吸微光 (`shadowBlur: 6`)。
   - **蛇尾流暢收細與末梢 Sprite**：
     - 身軀自 65% 處平滑收細至 2.5px，末梢掛載高解析 `snake_tail_indigenous.webp`，呈現優雅收細尾針與響尾環飾。

---

## 二、 單字打地鼠 (`WhackAMoleGame.jsx`) 與極速滑卡 (`SwipeCardGame.jsx`) 規範

1. **空值防禦**：
   - 讀取 `settings?.selectedUnits` 時一律使用 `(settings?.selectedUnits || [])`，當未選單元或題庫為空時自動回退至預設單字池或字母模式（`isAlphabetMode`）。
2. **低年級字母模式 (`abc`) 支援**：
   - 當 `qualifyingBook === 'abc'` 或 `settings?.alphaMode` 為真時，自動切換為大小寫字母配對題庫。
3. **倒數計時與愛心扣除鐵律 (`WhackAMoleGame.jsx`)**：
   - **倒數計時器**：`useEffect` 依賴項必須包含 `[gameState, isPreloading, triggerGameOver]`，確保預載完成後立即啟動 60 秒倒數，倒數至 0 秒時觸發結算；倒數最後 10 秒啟動狂暴模式與警示音。
   - **生命值扣除與結算**：玩家誤擊干擾字（答錯）或蜂巢搗蛋鼠時，每次扣除 1 顆愛心（初始 3 顆，顯示 `-10 💔`），扣完至 0 顆立即觸發遊戲結束進入結算畫面；嚴禁在 `setState(prev => ...)` 內執行副作用。
   - **重開防呆**：點擊「再玩一次」時必須徹底重設 `isTransitioningRef.current = false`、`livesRef.current = 3`、`timeLeftRef.current = 60` 與計時器，杜絕操作被鎖死。
