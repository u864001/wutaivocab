# 叢林貪食蛇 (`SnakeGame`)、單字打地鼠 (`WhackAMoleGame`) 與極速滑卡 (`SwipeCardGame`) 專屬規範

> **對應檔案**：`src/games/snake/SnakeGame.jsx`、`src/games/snake/SnakeCanvas2D.jsx`、`src/games/snake/snakeJungleTheme.js`、`src/games/mole/WhackAMoleGame.jsx`、`src/games/swipe/SwipeCardGame.jsx`

---

## 一、 叢林神山貪食蛇 (`SnakeGame.jsx`) 核心規範

1. **轉向指令緩衝隊列 (`inputQueueRef`) — 嚴禁漏接！**：
   - 玩家透過鍵盤（`ArrowUp/Down/Left/Right`、`WASD`）、虛擬十字鍵（`onPointerDown` + `onClick` 雙綁定 0ms 延遲）或畫面連續滑動（`touchmove` 閾值 16px）輸入方向時，統一呼叫 `queueDirection(newDir)` 推入 `inputQueueRef.current`（最多保留最新 2 個有效轉彎指令，並過濾同向與 180 度直接掉頭）。
   - **關鍵鐵律**：在 `advanceOneStep()` 每推進一格時，**必須執行 `if (inputQueueRef.current.length > 0) { dirRef.current = inputQueueRef.current.shift(); }`** 將隊列中的轉向指令取出並套用至 `dirRef.current`！若漏掉此行，所有上下左右按鍵與十字鍵都會失效。
2. **2D 正俯視日夜雙景生態與 4K 字母清晰度 (`SnakeCanvas2D.jsx`, `snakeJungleTheme.js`)**：
   - **四周邊框與環境遮蔽 (Ambient Occlusion)**：
     - 白天：魯凱特色頁岩片疊石砌牆 (Stacked Slate Wall) ＋ 蔓生翠綠青苔 ＋ 盛開純白高山百合花飾。邊界四周具備 32px 向內漸層環境陰影（AO Gradient），與 slate 頁岩地面完美融合。
     - 夜間：月光黑曜石板矮牆（冷灰藍高光） ＋ 深色夜蘚 ＋ 月夜幽光百合（冰藍柔光）。
   - **日夜專屬生態彩蛋**：
     - 白天：右上角台灣黑熊探頭舉爪歡呼、左上角台灣雲豹、高山鳳蝶雙翼快速撲閃。
     - 夜間：右上角領角鴞/貓頭鷹 (Owl) 眨眼轉頭與拍翅、左上角神山大赤鼯鼠 (Flying Squirrel) 探頭、夜光螢火蟲 (Fireflies) 呼吸式脈衝發光並具備平緩有機浮游物理（非蝴蝶拍翅）。
   - **字母渲染與安全生成區域鐵律**：
     - 場上字母繪製文字本體時**必須關閉 `ctx.shadowBlur = 0`**，改用 900 特粗純黑描邊（4.5px）＋純白/高純金填充，避免黃色光暈將字母模糊成光團。
     - **蛇頭前進安全空域 (`dangerTiles`)**：生成新單字字母時，必須計算蛇頭當前行進方向前方 1~3 格及側方安全錐形區，嚴禁將字母直接生成於前進路徑上，避免玩家措手不及連鎖撞擊扣心。
3. **初始身軀完整性與大廳直通開局**：
   - **初始長度 5 節完整身軀**：開局蛇長預設為 5 節（頭、頸、中段、後段、尾），進入遊戲第 0 秒即具備頭中尾完整的蛇形輪廓，杜絕僅有 2 節宛如球體的怪異現象。
   - 難度（普通/進階/大師）於大廳整備室選擇並存於 `localStorage.getItem('wutai_snake_difficulty')`，進入遊戲後於 `useEffect` 直接呼叫 `handleStart(savedDiff)`，不設二次開始彈窗。
4. **神聖百步蛇一體化母圖與流暢樣條骨骼規範 (`snake_head_indigenous.webp`, `snake_tail_indigenous.webp`, `snake_body_indigenous.webp`)**：
   - **一體化母圖同源設計 (Master Character Sheet Source)**：
     - 嚴禁分開零散生成！全套資產源自同一張 2D 正俯視神山神話繪本母圖（`hundred_pace_snake_master_v2_1793708176210.jpg`），確保頭、頸、身、尾同一次繪製、同一個調色盤、同一種手繪礦物顏料質地與同一種 2.5D 微立體厚塗光影。
     - **蛇頭幾何與翹鼻神格**：翹鼻尖（upturned snout horn）、深邃古老琥珀靈眸、頭頂祖靈之冠，底端具備 25px 圓弧羽化頸圈，向下自然覆蓋身軀首節，徹底消除接縫。
     - **勻稱粗實身軀**：頸項微收 (`r = 13.5px`)，中段身軀肌肉厚實勻稱 (`r = 15.5px`，全寬 31px，與 34px 頭部完美銜接)，後段平滑過渡（15.5px -> 12px）。
     - **短尾特性**：最後 12% 平順收細至 3.8px 並無縫銜接短錐尾針。
   - **樣條骨骼平滑化與高密度重採樣 (`buildDenseFilletSpine`) — 徹底消除「一節一節」積木感**：
     - 網格轉彎時，嚴禁在直角處硬折！透過二次貝茲曲線（Quadratic Bézier Fillet）在轉角自動生成半徑 14px 的圓潤拋物線弧道，並以 5px 細緻間距進行高密度採樣（每微步僅偏轉 2°~6°）。
     - 蛇身輪廓依高密度樣條法線連續生成，外輪廓為單一封閉流線型緞帶，轉彎時如水流般蜿蜒流動，絕無生硬香腸串或折角破綻。
   - **弧長連續排布之向心側三角斑與祖靈之眼**：
     - 依連續骨骼弧長（每 25px 一個單元）均勻分佈百步蛇天然標誌特徵：
       - 白天：深沉赭石/黑曜底色（`#6e3920` / `#26140d` 向心側三角） + 純白象牙外菱（`#fcfaf6`） + 暖金赤心內菱（`#df8f38`） + 黑曜祖靈眼點。
       - 夜間：黑曜板岩底色（`#141d24`） + 琉璃琥珀幽微呼吸微光 (`shadowBlur: 6`)。

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
4. **極速滑卡卡牌防抖與干擾字隔離 (`SwipeCardGame.jsx`)**：
   - **180ms 換牌防抖（Re-entrancy Guard）**：引入 `isSwipingRef` 旗標，在滑卡或點擊觸發 180ms 離場動畫期間鎖定操作，待 `setTimeout` 補牌完成後解鎖，杜絕快速連點造成舊牌被重複判定或跳題扣分。
   - **干擾字語義隔離**：非配對干擾卡片抽取時，嚴格排除中文語義完全相同之詞彙（`w.meaning.trim() !== targetWord.meaning.trim()`），確保「向右正確、向左錯誤」邏輯絕對無歧義。
