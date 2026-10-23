# 霧臺國小英語自主學習宇宙 (Wutai Vocab Adventure 2.0)
## 專案對話交接文檔 (Project Handover Document)

> **產生時間**：2026-10-24
> **當前分支**：`dev` (已同步至 `main` 並已部署至正式線上環境)
> **線上正式環境網址**：https://wutaivocab.pages.dev

---

### 一、新對話開場引導 (Instructions for Next Agent)

若你是接收此專案的新對話 AI 助理，請依下列步驟快速就位：
1. **工作目錄**：`c:\Users\user\.gemini\antigravity\scratch\wutaivocab`
2. **驗證指令**：任何代碼變更後，請一律執行 `npm run verify`（包含 ESLint 靜態語法檢查、Vite 生產級打包構建、以及無頭 Chrome 深度自動化測試 14 款遊戲全冊各身分）。
3. **雙遠端推播**：
   ```powershell
   git add <files>
   git commit -m "<type>(<scope>): <description>"
   git push origin dev ; git push vercel dev
   git checkout main ; git merge dev ; git push origin main ; git push vercel main ; git checkout dev
   ```
4. **Cloudflare 生產部署**：
   ```powershell
   $env:CLOUDFLARE_API_TOKEN="<YOUR_CLOUDFLARE_API_TOKEN>" ; npx wrangler pages deploy dist --project-name=wutaivocab --branch=main
   ```

---

### 二、專案技術架構與環境設定

* **前端框架**：React 18.3.1 + Vite 6.1.0 + Tailwind CSS 3.4.17
* **圖形與遊戲引擎**：HTML5 Canvas 2D / 3D (Three.js 0.186.1)
* **狀態與音訊**：
  * Web Audio API 自研音效合成器 (`src/services/audio.js`)，支援音效快取、合成器備援與多音軌 BGM。
  * Web Speech API + edge-tts 語音發音與口說辨識評測。
* **資料庫與後端**：Supabase (`src/services/supabase.js`)，支援離線模式與遊客訪客本地降級機制。
* **主要遠端倉庫**：
  * GitHub `origin`：`https://github.com/u864001/wutaivocab.git`
  * GitHub `vercel`：`https://github.com/u8640012026/wutaivocab.git`
* **主機發布服務**：Cloudflare Pages (`wutaivocab.pages.dev`)

---

### 三、近期已完成的核心修復與功能里程碑

#### 1. 貪食蛇 (Snake Game)
* **發光字母極致辨識度** (`src/games/snake/snakeJungleTheme.js`):
  * 解決過去因全域開啟 `ctx.shadowBlur` 導致字母文字被黃色光團吞沒模糊的問題。
  * 光暈限制在外圍呼吸環，文字本體清空 `shadowBlur = 0`，以 900 特粗純黑描邊（4.5px）+ 亮純白/高純金雙層填充，達成 4K 極致字體銳利度。
* **操作靈敏度全面重構** (`src/games/snake/SnakeGame.jsx`):
  * **轉向指令隊列（Input Queue）**：引入 `inputQueueRef`，防止連續快速按鍵覆蓋或掉指令。
  * **平滑連續滑動（Continuous Swipe）**：在 `touchmove` 實時判定轉向（閾值 16px），無需抬起手指即可連續多向引導。
  * **虛擬十字鍵零延遲**：升級為 `onPointerDown`（0ms 延遲），徹底移除行動瀏覽器 300ms 點擊延遲。
* **日夜版視覺升級** (`src/games/snake/SnakeCanvas2D.jsx`):
  * 支援白晝晨曦 ☀️ 與星月夜景 🌙 切換，夜景模式加入黑曜板岩、月夜星華冷色漸層，以及 6 隻帶著呼吸光暈漫舞的夜光山林螢火蟲。

#### 2. 聽說館：聽句子選英文 (`src/services/hereWeGoQuestionBank.js`, `src/data/hereWeGoTextbookData.js`)
* **清除課文數據中的中文殘留**：校準了 14 筆中英顛倒之課文句子（如 Book 4 Unit 4 `看！帽子舞！` 修正為 `Look! The hat dance!`）。
* **嚴格防禦過濾器**：加入 `isValidEnglishSentence`，保證目標句與所有干擾選項中**絕對不包含任何漢字**（自動化 100 次題庫抽查，中文選項出現率 0%）。

#### 3. 密室逃脫：長單字排版自適應與多詞膠囊 (`src/games/escape/puzzles/SpellingPuzzle.jsx`)
* **複合詞智慧分組膠囊**：遇到像 `social studies` 等長單字時，自動依空格切分為獨立詞塊膠囊（如 `[S,O,C,I,A,L]` 與 `[S,T,U,D,I,E,S]`）。
* **響應式卡槽縮放與折行**：$\ge 10$ 字母的單字動態縮小為緊湊尺寸，並支援 `flex-wrap` 自適應換行，解決衝出版面導致末端字母被截斷的問題。
* **常駐快捷控制列**：中央提供「⌫ 刪除上一格」退格鍵與「🔄 全部重排」重設鍵，任何螢幕都不會被推到螢幕外。

#### 4. 霧臺小鎮：頂部場所點擊判定優化 (`src/games/town/WutaiTownGame.jsx`, `src/games/town/townData.js`)
* **解除頂部 HUD 遮蔽**：橫幅容器改為 `pointer-events-none`，僅保留實體按鈕為 `pointer-events-auto`，空隙不攔截點擊，直接穿透至地圖。
* **擴大頂部場所熱區**：聚會所、雲豹書局、黑熊超市熱區垂直向下延伸，點擊建築屋頂、門窗或前階梯均能 100% 進入。

#### 5. 8 大冊「找不同」精確校準與零交疊 (`src/games/spotter/SpotterScene.jsx`, `src/games/spotter/spotterData.js`)
* **橢圓幾何判定升級**：支援長條形物件（火車、客機、直尺等）完整包覆。
* **Book 7 像素級校準**：火車頭全包覆 (rx:175, ry:45)、地圖精確脫離河水面、明信片對準紅色郵筒。
* **全冊 64 個相異目標兩兩距離檢驗**：交疊數為 0 (`TOTAL OVERLAPS: 0`)。

#### 6. 手寫字母判定彈窗修正 (`src/games/handwriting/HandwritingGame.jsx`)
* 判定彈窗脫離四線三格 aspect-ratio 容器，做成全螢幕獨立浮層，下方的「下一題」操作按鈕在任何裝置螢幕上皆完整露出且可點擊。

---

### 四、核心目錄與關鍵模組結構

```
src/
├── App.jsx                       # 主路由狀態機、全局 ErrorBoundary、各功能路由
├── components/
│   ├── Lobby.jsx                 # 大廳、年級切換、14 款遊戲入口、單元範圍選擇
│   ├── Header.jsx                # 頂部導航、音量、全螢幕、教師管理後台開關
│   ├── TeacherHub.jsx            # 教師管理後台、診斷中心、學生成績管理
│   ├── LeaderboardView.jsx       # 跨年級榮譽榜、各項遊戲積分排行榜
│   ├── StudentProfileModal.jsx   # 學生個人檔案、勇士探險執照
│   └── TextbookViewer.jsx        # 電子教科書翻頁瀏覽器
├── features/
│   ├── langlab/LanguageLabHub.jsx # 聽說語言學習館 (聽力測驗、口說跟讀、影音教室)
│   └── phonics/PhonicsBoard.jsx  # 自然發音 Phonics 互動音標盤
├── games/
│   ├── battle/                   # 多人即時對戰 (Battle Arena)
│   ├── escape/                   # 單字密室逃脫 (Vocab Escape Room)
│   ├── handwriting/              # 字母與單字手寫實驗室 (四線三格、手寫評測)
│   ├── maze/                     # 字母迷宮神山巡航 (Alphabet Maze)
│   ├── memory/                   # 翻牌記憶對對碰 (Memory Flip)
│   ├── meteor/                   # 3D 隕石防衛戰 (Three.js 3D Typing Defense)
│   ├── mole/                     # 單字打地鼠 (Whack-a-Mole Arcade)
│   ├── quiz/                     # 標準單字測驗 (Standard Quiz)
│   ├── snake/                    # 叢林神山貪食蛇 (Snake Game - 日夜版)
│   ├── spelling/                 # 單字積木拼裝 (Word Block Assembly)
│   ├── spotter/                  # 8 大冊視覺找不同 (Spot the Differences)
│   ├── swipe/                    # 極速是非滑牌 (Speed Swipe)
│   └── town/                     # 霧臺生活小鎮 (RPG Town, 9 大建築, 對話樹)
├── services/
│   ├── audio.js                  # 自研 Web Audio 合成器與音效引擎
│   ├── hereWeGoQuestionBank.js   # 翰林 Here We Go 1~9 冊題庫生成與安全過濾
│   ├── listeningQuestionBank.js  # 生活對話情境聽力題庫
│   ├── alphabetEngine.js         # 字母演算法與階梯生成
│   └── supabase.js               # Supabase 雲端資料庫串接與離線快取
└── scripts/
    └── smoke_test.mjs            # 無頭 Chrome 14 款遊戲自動化煙霧測試腳本
```

---

### 五、重要指令備忘錄 (Cheatsheet)

| 操作 | 指令 |
| :--- | :--- |
| **啟動本地開發伺服器** | `npm run dev` |
| **執行完整驗證流水線 (必跑)** | `npm run verify` |
| **僅執行自動化端對端測試** | `npm test` |
| **生產環境打包** | `npm run build` |
| **部署至 Cloudflare Pages** | `$env:CLOUDFLARE_API_TOKEN="<YOUR_CLOUDFLARE_API_TOKEN>" ; npx wrangler pages deploy dist --project-name=wutaivocab --branch=main` |
