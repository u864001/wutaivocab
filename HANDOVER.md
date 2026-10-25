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

#### 7. 手機頂部導航精簡化 (`src/components/Lobby.jsx`, `src/components/LeaderboardView.jsx`, `src/components/TextbookViewer.jsx`)
* **標題超載折行全面根除**：大廳、排行榜、課本電子書之頂部橫幅在小螢幕（`< 640px`）將「返回主大廳」、「英雄榜」、「電子書聽讀」等長文字隱藏，統一以大圖標解決；學生身份資料在手機直立版精簡為大頭貼與宇宙金幣，確保 360px 極限螢幕下頂部永遠維持單行，騰出寶貴垂直視野。

#### 8. 密室逃脫「0 秒通關」漏洞根治與排行榜修復 (`src/services/supabase.js`, `src/games/escape/VocabEscapeGame.jsx`, `src/components/LeaderboardView.jsx`)
* **排位依據校準**：密室逃脫與找不同統一確立為「秒數低優先（time ASC），相同秒數再比剩餘愛心（score DESC）」。通關上傳分數 `score` 修正為上傳「剩餘愛心數（1~3）」，而非原本錯誤的謎題總數。
* **資料庫多重防護**：
  * `uploadScore` 與 `checkIfQualifiesForTop50`：針對耗時類型遊戲加入強硬防禦 `time > 0`，小於等於 0 秒直接拒絕入榜；若歷史紀錄為 0 秒則允許被正常有效秒數覆蓋更新。
  * `fetchLeaderboard`：資料庫查詢加上 `.gt('time', 0)`，前端抓取時亦雙重過濾跳過 `time <= 0`，歷史異常的 0 秒資料全面隱形消失。
  * 通關秒數計算以 `Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000))` 強制確保秒數 $\ge 1$。

#### 9. 結算畫面智慧自動上榜與零捲動壓縮 (`src/components/HonorSubmissionCard.jsx`, `src/components/CertificateModal.jsx`)
* **已登入學生自動非同步登錄**：登入學生遊戲結束進入結算時，系統自動於背景調用 `uploadScore`，杜絕學生誤按列印或返回導致辛苦成績未送出的問題，畫面直接展示「🏆 成績已成功登錄全校英雄榜！」。
* **iPad / 手機零捲動排版**：將原本冗長的結算內容壓縮至精巧的成就彩帶（整合答對率、金幣、圖鑑星數），並內嵌與本作設計風格一致的 `Printer` 按鈕，點擊一鍵叫出 A4 大武山/百合花風格獎狀列印預覽。

#### 10. 子遊戲次級選單整併與直通開始 (`src/components/Lobby.jsx`, `src/games/*`)
* **全面拔除二次開始彈窗**：針對 6 款早期遊戲（貪食蛇、3D 隕石、記憶翻牌、極速滑牌、標準測驗、單字積木），移除掛載時阻斷流程的開始遊戲全螢幕彈窗或黑底次級選單，點選遊戲後 0 延遲直接進入遊戲畫面。
* **大廳整備室（分流 B）子模式一站式收納**：所有遊戲難度與呈現維度（如貪食蛇普通/進階/大師、記憶對對碰圖文/英中、標準測驗聽力子模式等）統一收納於大廳進入遊戲前的設定膠囊，並於 `localStorage` 自動記住學生偏好與提供推薦預設，達成 iPad 螢幕零捲動一站式點選。

#### 11. 叢林神山貪食蛇：2D 正俯視視野與日夜雙視覺升級 (`src/games/snake/SnakeCanvas2D.jsx`, `src/games/snake/snakeJungleTheme.js`)
* **真 2D 俯視視角**：告別早期山脈天空側視違和感，轉為正俯視鬱鬱蔥蔥的叢林地景。
* **白晝晨曦版**：翠綠草地磁磚棋盤網格、晨光漫射、邊緣矮灌木裝飾、以及 3 隻靈動翩躚的翠鳳蝶。
* **星月夜景版 (`isDark`)**：深邃月夜草坪、每 7 秒一次自左上至右下的 45° 金屬月光微亮掃光；空中點綴 6 隻發出 2.5s 柔和呼吸冷色光暈的夜光螢火蟲；蛇身採用黑曜岩深色底紋，菱形幾何紋理隨移動節奏散發琥珀金呼吸光，徹底避免「整條螢光棒」的刺眼感；字母改以高純度晶體水晶顯示，維持黑夜高對比度。

#### 12. 3D 隕石防衛戰視野拉伸與多人突襲防塞車調校 (`src/games/meteor/MeteorCanvas3D.jsx`, `src/games/battle/BattleGame.jsx`, `src/games/battle/EmergencyRaidMeteor.jsx`)
* **相機視野與生成深度拉長**：攝影機由 `z: 18` 後拉至 `z: 27`，隕石生成起點由 `-40` 深化至 `-75`，大幅延長學生反應判讀時間，抵達時比例亦不再臃腫遮蔽。
* **螢幕上限 1 顆突襲隕石與隊列嚴格防塞車**：學生畫面上同時最多僅允許 1 顆同學突襲隕石正在下墜，等待隊列嚴格限制最多暫存 1 顆，超量突襲直接拋棄（Drop），並在每顆突襲結束後保留 1.5 秒冷卻緩衝，徹底杜絕多位同學同時空襲造成學生手忙腳亂、排隊無窮無盡的挫折感。
* **精準空域動態落點**：同學突襲隕石起始位置隨機分佈於左翼安全空域（18%~30%），完全避開中央題目隕石區（35%~65%）與右上角 Combo 氣球灌氣區（74%~96%），且不緊貼螢幕左壁。
* **科技折線引導 HUD 框**：突襲隕石上方加入 Cyber 科技風格動態引導折線與半透明戰術卡，清楚標示突襲來源同學、倒數進度與點擊防衛次數。

#### 13. 地球能量防護罩機制與 Cloudflare GitHub Actions 自動部署 (`.github/workflows/deploy-cloudflare.yml`, `src/games/meteor/*`, `src/games/battle/*`)
* **每 50 分自動生成地球防護罩**：單人模式與多人對戰中，學生成績累計每達 50 分整數倍，自動生成一層「地球能量防護罩」。累計層數邏輯無上限，3D WebGL 場景與外太空同心白色呼吸光圈最多顯示 5 層（隨層數外擴至半徑 91，越多層呼吸光芒越耀眼），避免畫面死白。
* **傷害抵擋與連擊歸零規則**：當題目隕石墜地或受到毀滅級烈焰空襲時，優先扣除一層防護罩抵禦傷害（免扣愛心生命值）；但若是自身題目隕石墜地或未答對，因為題目未能成功解出，該題 Combo 必須嚴格歸零重算。
* **Cloudflare 自動部署流水線**：建立 `.github/workflows/deploy-cloudflare.yml`，在 GitHub 倉庫設定 `CLOUDFLARE_API_TOKEN` 後，只要推送 `main` 分支，GitHub Actions 將全自動執行語法檢查、生產打包與 Cloudflare Pages 部署，達成與 Vercel 相同的 100% 免手動自動發布！

#### 14. 鷹眼神探找不同：低年級隱形熱區、第 8 冊判斷框精準校準與 Word Bank iPad 零捲動 (`src/games/spotter/*`, `scripts/debug_overlay.js`)
* **低年級 ABC 缺漏自然探索**：拔除原本右托盤缺漏字母處過於直白的紅色虛線方框與「❓ 缺漏」提示，改為純隱形熱區（`opacity-0`），由小學生自主觀察探索，點擊破解後才亮起翠綠光環與已找齊勾選徽章。
* **第 8 冊（四季時光庭園）像素級判斷框校準**：
  * 天鵝 (`swan`) 修正為 `(295, 485)`，精準鎖定白/黑天鵝本體。
  * 園藝鏟 (`spade`) 修正為 `(138, 635)`，完整涵蓋花圃金黃鏟柄至鏟刃。
  * 徹底撥正長笛 (`flute`, `(980, 515)`) 與大衣 (`coat`, `(952, 340)`) 顛倒之座標與標籤。
  * 派 (`pie`) 微調為 `(704, 528)`，所有 8 處相異點皆經圖像質心演算法校正，100% 貼合無交疊。
* **Word Bank 超長單字自適應與 iPad 零捲動**：長度大於 14 字母之長單字自動調降字級至 `text-[10px]`，收緊選項網格與內距，確保 iPad 橫向視圖絕不產生縱向捲動條。
* **可視化檢驗工具腳本**：新增 `scripts/debug_overlay.js`，可隨時將指定冊次之判定框與文字標籤無失真疊加至底圖產出檢驗圖。

#### 15. 鷹眼神探 Round 2：阿姆斯特丹新場景、動態 8 選 5 變異引擎與專屬檢驗工作台 (`src/games/spotter/*`, `public/assets/spotter/*`)
* **Book 1 Scene 2（阿姆斯特丹贊斯風車運河果園集市）**：
  * 完成成對 1376×768 3D 立體紙雕底圖與變異圖。
  * 經專案負責人 Mark 審查校準：大象噴泉下移至地面花園廣場、葡萄判定圈全域擴大包覆木藤架 (rx:185, ry:125)、狗狗判定圈擴大同時覆蓋柴犬與趴臥大麥町 (rx:95, ry:85)、蘋果判定圈擴大涵蓋箱外落果 (rx:110, ry:70)；背景豐富融合 bicycle, lamppost, bench, bread, Gouda cheese, backpack, trees, boat 等複習元素。
* **A 方案升級版 • 雙圖槽位動態 8 選 5 變異引擎**：
  * 每局由系統隨機抽選 5 個單字覆蓋羽化透明補丁 (`patches/b1_s2/{word}_variantA.png`)。
  * 未被抽選之 3 個單字，左右兩圖 100% 呈現完全相同之基準圖素（物理像素完全相同），徹底杜絕幽靈差異與誤觸扣心，破除學生背死圖之限制。
* **專案負責人 Mark 專屬審核平台：變異檢驗工作台 (`SpotterTestWorkbench.jsx`)**：
  * 支援直接路由 `/spotter-test`（或 `?view=spotter-test`），並在神探遊戲中提供「🔬 變異工作台」一鍵直達按鈕。
  * 具備 4 大檢驗模式：
    1. **全幅雙圖對照 (Side-by-Side Canvas)**：底圖 vs 變異圖左右並列，支援判定圈、單字膠囊、羽化槽位框開關與單字點選聚焦。
    2. **8 大目標顯微驗收矩陣 (Zoom Matrix)**：提供每個單字之高解析局部比對卡片 (`crops/b1_s2/{word}_compare.jpg` 與 `crops/b1_s1/`)、座標、半徑、變化描述與 Variant A~G 演進進程。
    3. **A 方案動態 8 選 5 即時抽題模擬 (Dynamic Engine Simulator)**：可隨機抽題，實機驗證 5 個變異點與 3 個未選中立點的點擊防禦。
    4. **全套教材 8 冊 40 場景藍圖 (Master Roadmap)**：統整 1~8 冊各 5 個場景之進度狀態與核心單字池規劃。

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
| **部署至 Cloudflare Pages** | 推送至 `main` 分支自動透過 GitHub Actions 觸發部署，亦可手動執行：`npx wrangler pages deploy dist --project-name=wutaivocab --branch=main` |

---

### 六、自動化部署管線 (CI/CD Pipeline)

* **GitHub Actions Workflow**: `.github/workflows/deploy-cloudflare.yml`
* **觸發條件**: 推送至 `main` 分支或手動 `workflow_dispatch`
* **部署標的**: Cloudflare Pages (`wutaivocab` 專案)
* **憑證依賴**: GitHub Secret `CLOUDFLARE_API_TOKEN` (具備 `Account > Cloudflare Pages > Edit` 權限) 與 Account ID `4cd48161aad48dd1884b350e37ba7c75`

