# 經典/聽力選擇題 (`StandardQuiz`)、單字拼寫王 (`SpellingGame`) 與手寫塗鴉 (`HandwritingGame`) 專屬規範

> **對應檔案**：`src/games/quiz/StandardQuiz.jsx`、`src/games/spelling/SpellingGame.jsx`、`src/games/handwriting/HandwritingGame.jsx`

---

## 一、 大廳「開始遊戲」過渡防閃退鐵律 (`StandardQuiz.jsx` & `SpellingGame.jsx`)

1. **嚴禁在 `queue` 空陣列時呼叫 `onBack()`**：
   - 當學生在大廳選好冊別、點擊「🚀 開始遊戲 START」進入 `StandardQuiz` 或 `SpellingGame` 時，第一個 render 週期 `queue` 陣列可能尚未由 `useEffect([settings, words])` 計算完成（此時 `queue.length === 0`）。
   - **絕對禁止**在自動開局的 `useEffect` 中寫 `if (queue.length === 0) return onBack();`！否則學生一按開始遊戲就會立刻被踢回大廳。
   - **正確寫法**：
     ```javascript
     useEffect(() => {
       if (queue.length > 0 && !hasStarted) {
         handleStart();
       }
     }, [queue.length]);
     ```
2. **題數設定空值防護**：
   - 篩選題數時必須檢查 `if (settings?.count && settings.count !== 'all')`，防止 `settings.count` 為 `undefined` 時 `slice(0, NaN)` 產生空題庫。

---

## 二、 單字拼寫王 (`SpellingGame.jsx`) 多詞膠囊與平板友善規範

1. **複合詞分組 (`parsePhrase`)**：
   - 遇到含空格的片語或複合詞（如 `ice cream`, `social studies`）時，自動依空格拆分為獨立詞塊群組 (`wordGroups`)，標點符號自動預填不計入空格。
2. **點擊即填與退格重排**：
   - 支援點擊下方字母磚自動填入第一個空格（平板免拖曳），並提供退格與重排容錯。

---

## 三、 手寫塗鴉檢定 (`HandwritingGame.jsx`) 規範

1. **判定彈窗獨立浮層**：
   - 手寫評測結果彈窗必須脫離四線三格 `aspect-ratio` 畫布容器，作為獨立浮層渲染，確保在任何螢幕比例下「下一題」按鈕皆 100% 完整露出且可點擊。

---

## 四、 課本題庫檢定館 (`PureMcqExamView.jsx` & `hereWeGoMcqBank.js`)

1. **核心定位与 A/B 雙入口架構**：
   - **路由**：`/?view=mcq-exam`
   - **A 入口（首頁獨立第 4 大館）**：首頁 7 大館依序為：`霧臺小鎮生活冒險 RPG` (`town`) ➔ `英語單字冒險館` (`lobby`) ➔ `雙語聽說探險館` (`langlab`) ➔ `課本題庫檢定館` (`mcq-exam`) ➔ `自然發音探索館` (`phonics`) ➔ `ClassQnA` ➔ `自編英語電子教科書` (`textbook`)。
   - **B 入口（雙語聽說探險館內卡片）**：`LanguageLabHub.jsx` 主選單第 3 張卡片「📝 課本題庫檢定」直通 `mcq-exam`。
   - **單字館純淨化**：`Lobby.jsx` 移除 `mcq-exam`，維持 100% 純單字遊戲館。
2. **全冊百題原創類題庫 (`src/data/hereWeGoMcqBank.js`) 與 7 道品質閘門契約**：
   - 涵蓋 **Here We Go 第 1～8 冊 + 國一先修 (Book 9)**，**每冊均達 100 題以上（全站共 1,044 題）**，包含「文法與依題意選答 (`grammar`)」與「情境對話選答 (`dialogue`)」。
   - 每題具備唯一固定編號 `id` (`hwg_b{book}_{seq}`)、3~4 個不重複選項、唯一正解索引 `answer` 與完整中文解析 `explanation`。
   - `scripts/smoke_test.mjs` Phase 0 內建靜態契約檢查，強制驗證每冊題數 `>= 100`、ID 唯一、選項無重複；後續若由輕量模型（如 Flash）擴充題庫，必須使用規則鎖定產生器並通過 `smoke_test.mjs` 驗證，嚴禁混入無解析或重複選項之劣質題目。
3. **專業語言測驗零捲動 (`100dvh`) 5 步流程規範**：
   - **全域頂欄隱藏**：當 `currentView === 'mcq-exam'` 時隱藏全域 `<Header />`，杜絕測驗中切換雙語與外部干擾。
   - **零遊戲元素**：不呼叫任何 `soundEngine` 遊戲音效、不播放彩帶動畫，採用魯凱日/夜柔焦背景＋中央高對比固定高度檢定容器（`h-[100dvh] overflow-hidden`），自適應手機、摺疊機、iPad 與電腦免上下捲動。
   - **Step 1（選範圍）**：支援切換「📚 課本範圍檢定」與「📓 個人易錯題複習 (`wutai_mcq_mistakes_${studentId}`)」。易錯題不足目標題數時，自動從學生本年級題庫隨機抽題補滿；在易錯題複習中對同一題**連續答對 2 次 (`streak >= 2`)** 自動從易錯池移除。
   - **Step 2（選題數）**：提供 `10 題`、`20 題`、`50 題` 三種規格。
   - **Step 3（一頁一題作答）**：頂端三欄極簡列（左：`← 離開`、中：`第 X 冊檢定 / 國一先修檢定 / 個人易錯題複習`、右：`題號進度 + 🚩 標記`），步驟與題目間採 `150ms` 原地平滑淡入淡出。
   - **Step 4（金幣核發公式）**：選本年級冊別（或個人易錯題複習）且**答對率達 60% 以上**，核發 `Math.min(20, Math.round(題數 * 答對率 * 0.4))` 枚學習金幣（10 題全對 = 4 金幣、20 題全對 = 8 金幣、50 題全對 = 20 金幣，單次上限 20 金幣）。
   - **Step 5（單題翻頁式檢定報告）**：左欄顯示總分、答對率、金幣與易錯池變動；右欄採「單題翻頁卡（`◀ 上一題 / 下一題 ▶`）」檢視錯題或全部題目詳解，確保報告頁同樣零垂直捲動。
