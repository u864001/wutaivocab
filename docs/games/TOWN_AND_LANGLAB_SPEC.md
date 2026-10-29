# 霧臺雲端家園 (`WutaiTownGame`)、雙語聽說實驗室 (`LanguageLabHub`) 與教材專區規範

> **對應檔案**：`src/games/town/WutaiTownGame.jsx`、`src/games/town/CinemaTheaterModal.jsx`、`src/features/langlab/LanguageLabHub.jsx`、`src/services/hereWeGoQuestionBank.js`、`src/features/phonics/PhonicsBoard.jsx`、`src/components/TextbookViewer.jsx`

---

## 一、 霧臺雲端家園 (`WutaiTownGame.jsx`) 核心規範

1. **頂部 HUD 穿透與建築點擊熱區**：
   - 頂部橫幅容器必須保持 `pointer-events-none`（僅內部實體按鈕設為 `pointer-events-auto`），確保點擊頂部空隙能穿透至後方地圖建築（聚會所、雲豹書局、黑熊超市）。
2. **家園建材購買與雲端雙軌同步**：
   - 學生購買建材或植物時，透過 `StudentContext` 呼叫 `spendCoins` 與 `updateInventory`，自動同步至本機快取、`student_profiles` 與 `leaderboard (mode = 'profile-sync')`。
3. **山豬影城 (`CinemaTheaterModal.jsx`)**：
   - 採用 16:9 劇院模式串流 YouTube 英語教學影片，零伺服器流量負擔。

---

## 二、 雙語聽說實驗室 (`LanguageLabHub.jsx`) 與題庫規範

1. **口說跟讀評測雙擊流程**：
   - 第 1 次點擊麥克風按鈕：啟動錄音（Web Speech API）。
   - 第 2 次點擊麥克風按鈕（或語音結束）：立即結束錄音並計算匹配度評分，渲染評分回饋卡片（含 Perfect / Good job 等級與重測按鈕）。
2. **聽句子選英文「零漢字」嚴格過濾 (`hereWeGoQuestionBank.js`)**：
   - 所有英文句子題目與干擾選項皆通過 `isValidEnglishSentence` 過濾，確保英文選項中 **100% 不包含任何中文字元**。
