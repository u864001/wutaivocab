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
