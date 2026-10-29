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

## 四、 課本選擇題庫檢定專區 (`PureMcqExamView.jsx` & `hereWeGoMcqBank.js`)

1. **核心定位（無干擾一頁一題檢定）**：
   - 路由：`/?view=mcq-exam`（大廳頂部快捷鈕「選擇題庫檢定」與經典測驗分欄第一項）。
   - 題庫：`src/data/hereWeGoMcqBank.js`（涵蓋 Here We Go 第 1～9 冊 `Starter`、`Unit 1~4`、`Review 1~2`、`Festival` 共 484 題 100% 原創無版權爭議之文法選擇與情境對話類題，每題附中文詳解 `explanation`）。
   - 本機廠商參考題庫存放於 `.gitignore` 保護之 `reference_questions_local/`，嚴禁將廠商原檔上傳至 Git。
2. **雙模式與操作規範**：
   - **📝 正式考卷模式**：作答時不顯示對錯、不倒數計時、一頁一題（支援上一題／下一題、題號跳轉列、`🚩 標記待檢查`），全部答完交卷後計算 100 分制成績、發放金幣與榮譽榜紀錄，並支援「錯題重練」。
   - **💡 即時詳解練習模式**：點選答案後立即顯示正確選項與中文文法解析。
