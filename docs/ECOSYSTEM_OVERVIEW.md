# 屏東縣霧臺國小 數位學習與校務系統生態圈 (Ecosystem Overview)

本文件記載霧臺國小三大關聯專案（`wutaivocab`、`classqna`、`wutpsdata`）的技術架構、本地路徑、GitHub 倉庫、Supabase 雲端帳號、Cloudflare Pages 發布配置與全自動防回歸工程規範。

---

## 1. 專案一：沉浸式英語單字村 (wutaivocab)

* **本地工作目錄**：`C:\Users\user\.gemini\antigravity\scratch\wutaivocab`
* **主工作 Git 分支**：`dev`（同步合併至 `main`）
* **雙 GitHub 遠端倉庫（雙重推送）**：
  * `origin`: `https://github.com/u864001/wutaivocab.git`
  * `vercel`: `https://github.com/u8640012026/wutaivocab.git`
* **正式發布網站（生產環境）**：
  * **主網址**：`https://wutaivocab.pages.dev` (Cloudflare Pages)
* **Supabase 雲端資料庫與帳號資訊（極重要備忘）**：
  * **所屬帳號信箱**：`liguyt@wutps.ptc.edu.tw`（注意：位於學校教育信箱下，非 u864001 或 u8640012026）
  * **Project ID**：`fqkdkmcqjswufzbvkram`
  * **API URL**：`https://fqkdkmcqjswufzbvkram.supabase.co`
  * **後台管理直達連結**：`https://supabase.com/dashboard/project/fqkdkmcqjswufzbvkram`
  * **SQL Editor 連結**：`https://supabase.com/dashboard/project/fqkdkmcqjswufzbvkram/sql/new`
  * **雙軌雲端漫遊與整學期資料保留機制（嚴禁覆蓋學生金幣與積分）**：
    1. `student_profiles` 表與 `leaderboard (mode = 'profile-sync')` 雙軌同步：讀取個人檔案與排行榜時，自動執行 **Union Merge（聯集取最高值 `Math.max`）**，兩邊資料自動互補、絕不打架。
    2. 學期制保留（`src/utils/semesterHelper.js`）：學生累積的金幣 (`coins`) 與探索積分 (`quest_points`) 保留一整個學期（2/1～7/31 為下學期、8/1～隔年1/31 為上學期），跨學期時自動將舊學期成就封存至 `semester_history`。**任何程式碼更新嚴禁覆蓋或清空學生的本機/雲端金幣與積分**。
* **Cloudflare Pages 建置與部署參數**：
  * **Account ID**：`4cd48161aad48dd1884b350e37ba7c75`
  * **CLI 部署指令**：
    ```powershell
    $env:CLOUDFLARE_API_TOKEN="<CLOUDFLARE_API_TOKEN>" # 老師之 Cloudflare 部署金鑰
    npm run build
    npx wrangler pages deploy dist --project-name=wutaivocab
    ```
* **防範「改 A 壞 B」的三大工程鐵律與 6 階段全自動防回歸守門員 (`scripts/smoke_test.mjs`)**：
  1. **每次修改後強制執行自動化測試**：在推送前必須執行 `npm run build` 與 `node scripts/smoke_test.mjs`，全數通過 6 大階段（0. 靜態契約掃描、1. 排行榜、2. 大廳與教師台、3. 鷹眼神探、4. 口說評測、5. 核心遊戲真實點擊/按鍵/開房互動模擬、6. 14 款遊戲 × 4 身分全量矩陣）才可推送，**免除人工逐一重測**。
  2. **靜態契約與副作用隔離**：所有 `soundEngine.<method>()` 呼叫必須存在於 `src/services/audio.js`（含 `powerUp` / `powerup`）；嚴禁在 React `setState` updater 函式內執行副作用（如音效、網路廣播、路由跳轉）。
  3. **生命週期與空值防護**：嚴禁在遊戲 `useEffect` 中寫 `if (queue.length === 0) return onBack()`（會導致從大廳按開始遊戲時因非同步時差瞬間閃退回大廳）；所有 `settings?.selectedUnits` 必須加上空值防禦 `(settings?.selectedUnits || [])`。
  4. **Supabase Realtime 頻道防撞**：多人連線對戰 (`BattleGame.jsx`) 必須先以 `syncEvictChannel` 同步清除同名探測頻道後再 `subscribe()`，避免 `cannot add 'presence' callbacks after 'subscribe()'` 崩潰。
* **核心技術棧**：React 18 / 19, Vite, Tailwind CSS, Lucide React, Canvas Confetti, Web Speech API (語音跟讀辨識), Supabase Realtime (多人連線對戰), YouTube IFrame API (山豬影城 & 聽說探險館).
* **核心功能模組**：
  1. `src/games/town/WutaiTownGame.jsx`：霧臺生活小鎮主地圖、NPC 任務日常英語對話、商店、建築探索。
  2. `src/games/town/CinemaTheaterModal.jsx`：小鎮「山豬影城」16:9 天鵝絨影院放映廳，零伺服器流量 YouTube 串流。
  3. `src/features/langlab/LanguageLabHub.jsx`：雙語聽說探險館（視聽教室），含單元聽力特訓（三選一）、口說跟讀挑戰（Web Speech API）、影片微電影聽力。
  4. `src/data/hereWeGoTextbookData.js`：翰林 Here We Go 1～9 冊完整題庫（763 則情境對話，Google Translate 官方繁中精準校正）。
  5. `src/data/unitVideoQuestionData.js`：影片微電影題庫資料集（YouTube ID + 秒數裁剪 + 三選一測驗）。
  6. `src/games/spotter/VocabSpotterGame.jsx`：鷹眼神探 • 單字找不同。
  7. `src/games/escape/VocabEscapeGame.jsx`：密室逃脫大冒險。
  8. `src/games/battle/BattleGame.jsx`：多人即時對戰競技場（QR Code 動態生成為 `pages.dev`）。

---

## 2. 專案二：課堂即時互動抽籤與問答系統 (classqna)

* **本地工作目錄**：`C:\Users\user\.gemini\antigravity\scratch\class` (資料夾名為 `class`)
* **Git 遠端倉庫**：`https://github.com/u8640012026/classqna.git`
* **正式發布網站（生產環境）**：`https://classqna.pages.dev`
* **Cloudflare Pages 建置與部署參數**：
  * Framework: Vite
  * Build command: `npm run build`
  * Output directory: `dist`
  * CLI 部署指令：`npx wrangler pages deploy dist --project-name=classqna`
* **核心功能**：班級學生即時點名抽籤、輪盤轉盤、小組競賽計分板、題庫匯入 (`xlsx`, `jszip`)、Supabase 課堂狀態同步。

---

## 3. 專案三：霧臺國小校務管理系統 (wutpsdata)

* **本地工作目錄**：`C:\Users\user\.gemini\antigravity\scratch\wutpsdata`
* **Git 遠端倉庫**：`https://github.com/u8640012026/wutpsdata.git`
* **正式發布網站（前端靜態管理介面）**：`https://wutpsdata.pages.dev`
* **後端 API 與 LINE LIFF 運作架構（極重要安全規範）**：
  * **前端靜態頁面**：部署於 Cloudflare Pages (`wutpsdata.pages.dev`)。
  * **LINE LIFF Webhook 與日曆 API**：**保持在 Vercel Serverless Function 運行** (`api/line_webhook.js`, `api/calendar.js`)。
  * **LINE Developers Console 中的 Webhook Endpoint URL 保持指向 Vercel API**，絕不可更改或刪除，確保教職員 LINE 群組通知與活動建立 100% 正常運作。
  * **資料庫**：Supabase PostgreSQL + Google Apps Script (GAS) 雙向日曆同步。

---

## 4. 歷史設計規格書存檔索引 (Artifacts Archive)

前一交談階段所產出的深度架構設計 Markdown 文件，留存於：
`C:\Users\user\.gemini\antigravity\brain\c812a7e5-408e-41e0-824b-0b526e5d8465\`

1. `language_lab_and_textbook_roadmap.md`：雙語聽說探險館總體架構、吉卜力x魯凱石板屋美術、貓頭鷹助教與黑熊學伴、Here We Go 1~9 冊設計規範。
2. `spotter_art_direction_and_workflow_proposal.md`：鷹眼神探視覺重構提案（立體紙雕風與成對全景圖）。
3. `escape_room_meta_progression_proposal.md`：密室逃脫三信物收集與終極脫逃動畫交接待辦。
4. `escape_room_art_and_prompts_guide.md`：密室逃脫美術生成 Prompt 提示詞指引。
