# 霧臺國小英語自主學習宇宙 (Wutai Vocab Adventure 2.0)
## 專案對話交接文檔 (Project Handover Document)

> **產生時間**：2026-11-04 (更新至檢定館四大測驗分流、Pre-A1與學力檢測模組化架構奠基)
> **當前分支**：`dev` (與 `main` 完全同步並已部署至正式線上環境)
> **線上正式環境網址**：https://wutaivocab.pages.dev
> **Supabase 管理帳號**：`liguyt@wutps.ptc.edu.tw`（Project ID: `fqkdkmcqjswufzbvkram`，後台：https://supabase.com/dashboard/project/fqkdkmcqjswufzbvkram）

---

### 一、新對話開場引導 (Instructions for Next Agent)

若你是接收此專案的新對話 AI 助理，請依下列步驟快速就位：
1. **工作目錄**：`c:\Users\user\.gemini\antigravity\scratch\wutaivocab`
2. **強制自動化防回歸驗證指令（杜絕改 A 壞 B、免除人工重測）**：
   任何代碼變更後、推送前，**必須執行 `npm run build` 與 `node scripts/smoke_test.mjs`**（或 `npm run verify`），通過全部 6 大階段：
   - **[0/6] 靜態契約與防回歸語法檢查**：自動驗證全專案 `src/` 所有 `soundEngine.xxx()` 呼叫均存在於 `src/services/audio.js`，且無 `if (queue.length === 0) return onBack()` 閃退寫法。
   - **[1/6] 排行榜視圖與年級篩選互動**。
   - **[2/6] 首頁大廳與教師管理後台**。
   - **[3/6] 鷹眼神探跨年級驗證**（一年級字母托盤、三年級紙雕雙圖、六年級第 7 冊）。
   - **[4/6] 雙語聽說實驗室口說錄音與評分卡回饋**。
   - **[5/6] 核心遊戲真實互動模擬**（大廳選冊 → 點擊「開始遊戲」不閃退、貪食蛇方向鍵/十字鍵實際轉彎、多人對戰開立擂台零頻道衝突與頂列不重疊、各遊戲實際點擊選項）。
   - **[6/6] 全站 14 款遊戲 × 4 身分（共 56 組矩陣）全量啟動零崩潰**。
3. **Git 推播流程 (僅限 origin，嚴禁日常推送 vercel)**：
   > [!WARNING]
   > **【嚴禁日常推送 Vercel】** 因 Vercel Hobby 方案每日/每月構建配額極易耗盡，日常開發中**一律只推送到 `origin` 遠端**！正式生產環境以 Cloudflare Pages (`wutaivocab.pages.dev` 綁定 `origin/main`) 為準。除非有重大版本發布且經 Mark 特別指示，否則**切勿執行 `git push vercel`**。
   ```powershell
   git add <files>
   git commit -m "<type>(<scope>): <description>"
   git push origin dev
   git checkout main ; git merge dev ; git push origin main ; git checkout dev
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
  * GitHub `origin`：`https://github.com/u8640012026/wutaivocab.git`（已配置 `CLOUDFLARE_API_TOKEN` Secret，推送 `main` 自動透過 GitHub Actions 部署至 Cloudflare Pages）
  * GitHub `upstream`：`https://github.com/u864001/wutaivocab.git`
* **主機發布服務**：Cloudflare Pages (`https://wutaivocab.pages.dev`) ＆ Vercel (`https://wutaivocab.vercel.app`)

---

### 三、近期已完成的核心修復與功能里程碑

#### 0.0.12 課本題庫方案 A（In-Book Canonical）正式修剪落實與全站 UI 分母同步：刪除 1,728 筆同冊重複複本、全庫精簡為 1,589 題純淨 Canonical 題目 (`hereWeGoMcqBank.js`, `PreA1MasteryDashboard.jsx`, `PureMcqExamView.jsx`, `LeaderboardView.jsx`, `examTracks.js`, `exam/index.js`)
* **正式執行 `node scripts/execute_canonical_prune.mjs`**：
  * 經 ChatGPT 本機 Windows 隔離實測確認 `2976ce0` 全面通過並正式授權，已將 `src/data/hereWeGoMcqBank.js` 由 3,317 題原子性精簡為 **1,589 題冊內 Canonical 題目**（刪除 1,728 筆同冊跨單元複本；保留 22 組跨冊獨立題目）。
  * 生產打包體積（minified bundle）直接減少 **863 KB**（由 4,154 KB 降至 3,290 KB）。
* **全站 UI 顯示題數與精熟分母同步（1,589 題）**：
  * `PreA1MasteryDashboard.jsx`：`TRACK_CONFIGS.curriculum.totalItems` 由 3,317 更新為 `1589`；`CURRICULUM_DASHBOARD_META` 分冊題數同步為低年級 626（B1: 159, B2: 154, G1/G2: 313）、中年級 290（B3: 155, B4: 135）、高年級 282（B5: 133, B6: 149）、進階與銜接 391（B7: 128, B8: 126, B9: 137）。
  * `PureMcqExamView.jsx`、`LeaderboardView.jsx`、`examTracks.js`、`exam/index.js` 所有使用者可見題數標示全部同步為 `1,589 題`。
* **物理備份與雙模態驗證 100% 通過**：
  * 完整 3,317 題物理備份已鎖定於 `src/data/backups/hereWeGoMcqBank.expanded.3317.js`（Normalized SHA-256: `b191fad18332b8e42a03621a45ef0eb24bcae1a77bbcb5edd04f6677b21a0434`）。
  * `verify_canonical_schema.mjs`（`PRUNED CANONICAL (1,589 items)`）、`audit_semantic_gates.mjs`（1,589 題課本 + 300 題 TME + 285 題 SAA 零異常）、`test_canonical_migration.mjs`、`test_prune_roundtrip.mjs` 與 6 階段 `smoke_test.mjs` 100% 綠燈通過。

#### 0.0.11 題庫品質全面大修訂 Batch 7：跨平台 Windows/Linux Prune 腳本相容、CRLF 正規化 SHA-256、狀態機最新紀錄合併演算法與雙平台隔離沙盒測試 (`execute_canonical_prune.mjs`, `rollback_canonical_migration.mjs`, `masteryHelper.js`, `test_canonical_migration.mjs`, `test_prune_roundtrip.mjs`, `.gitattributes`, `canonical-ci.yml`)
* **P0：跨平台 Windows ESM 動態載入修復**：
  * `build_canonical_data.mjs`、`execute_canonical_prune.mjs`、`rollback_canonical_migration.mjs` 全面改用 `pathToFileURL(filePath)` 搭配 `importFresh()`，解決 Windows 下 `Received protocol 'c:'` 載入失敗問題。
* **P0：跨平台換行正規化 Checksum 與 `.gitattributes`**：
  * 兩支工具均導入 `normalizeForHash(text)`（`\r\n` -> `\n`）與 `sha256Text(text)`，徹底消除 Windows Git `core.autocrlf=true` 造成的 SHA-256 校驗不一致。
  * 新增 `.gitattributes` 鎖定 `src/data/backups/*.js`、`*.json` 與 `hereWeGoMcqBank.js` 為 `eol=lf`。
* **P0：精熟度與錯題本合併演算法嚴格對齊狀態機**：
  * `migrateMasterySnapshotToCanonical`：`status`、`consecutive_correct`、`last_is_correct` 一律採用 `last_attempt_at` 最新紀錄，嚴守「精熟後答錯立即退回待加強（remedial）」規則；`attempts` 加總、`is_formal` 取 OR；且不論是否有 ID 變更，`curriculum` 分母一律校準為 `1589`。
  * `migrateMistakeMapToCanonical`：`wrongCount` 加總，`streak` 採用最新 `updatedAt` 的紀錄（避免較新答錯 `streak: 0` 被舊 `streak: 1` 覆蓋）。
* **P1：置換前安全保護（`didSwap` & `backupVerified`）**：
  * `execute_canonical_prune.mjs` 僅在 `if (didSwap && backupVerified)` 成立時才執行失敗回滾，絕不在置換前用備份覆寫未修改的正式檔。
* **新增兩支全自動驗證腳本與 Windows/Linux 雙平台 GitHub Actions CI**：
  * `scripts/test_canonical_migration.mjs`（5 項精熟與錯題合併測試）與 `scripts/test_prune_roundtrip.mjs`（`mkdtemp` 隔離沙盒全流程 round-trip 測試）。
  * 新增 `.github/workflows/canonical-ci.yml` 於 `ubuntu-latest` 與 `windows-latest` 雙平台自動執行驗證。

#### 0.0.10 題庫品質全面大修訂 Batch 6：解除四大架構阻擋（Scopes 課綱正統歸位、學生歷程無損遷移、物理備份與雙模態 CI 契約）、落實 Prune 前安全防線 (`hereWeGoMcqBank.js`, `canonicalMapping.js`, `masteryHelper.js`, `PureMcqExamView.jsx`, `execute_canonical_prune.mjs`, `rollback_canonical_migration.mjs`, `verify_canonical_schema.mjs`, `smoke_test.mjs`)
* **Blocker 1：Scopes 課綱正統歸位（徹底解決 7~8 scopes 漫延問題）**：
  * 重新梳理全 11 冊（1~9 冊與 g1/g2）共 268 組單字群之 Here We Go 正統課本授課單元（`CURRICULUM_WORD_MAP`）。
  * 嚴格規範 `scopes` 長度上限為 2（授課單元 + 對應 Review），徹底杜絕跨全冊漫延（長度 >= 3 降為 0，479 組單 scope，1,110 組雙 scopes）。
  * 例如 `ruler` 正確歸屬於 `primaryScope: Unit 3`，`scopes: ['Unit 3', 'Review 2']`。
* **Blocker 2：學生歷程與錯題本無損遷移（Legacy Data Protection）**：
  * 在 `masteryHelper.js` 實現 `migrateMistakeMapToCanonical` 與 `migrateMasterySnapshotToCanonical`。
  * `PureMcqExamView.jsx` 於初始化與 storageKey 變更時自動執行錯題遷移，`mistakeQuestions` 支援雙向相容查詢。
  * `loadStudentMastery` 自動遷移學生歷程中之 Clone ID，精熟狀態保留最優並自動重新計算精熟分母（1,589 題）與總題數。
* **Blocker 3：真物理備份與原子性替換（Physical Backup & Atomic Rollback）**：
  * 建立物理備份檔 `src/data/backups/hereWeGoMcqBank.expanded.3317.js` 與 `src/data/backups/manifest.json`（SHA-256 Checksum）。
  * `execute_canonical_prune.mjs` 採暫存檔驗證後原子性置換（`fs.renameSync`），遇到異常自動還原。
  * `rollback_canonical_migration.mjs` 透過 SHA-256 校驗後原子性還原 3,317 題。已實測雙向往返 100% 成功。
* **Blocker 4：CI 契約與 Smoke Test 支援雙模態（Dual-Mode Contract）**：
  * `scripts/verify_canonical_schema.mjs` 與 `scripts/smoke_test.mjs` Stage 0 全面支援 `Expanded (3,317)` 與 `Pruned (1,589)` 雙模態驗證，並強制檢查 `scopes.length <= 2` 與 7 選項契約。

#### 0.0.9 題庫品質全面大修訂 Batch 5：消滅 Luca 性別雙正解、修正詳解錯題與舊誘答描述、落實方案 A（In-book Canonical）非破壞性架構奠基 (`hereWeGoMcqBank.js`, `canonicalMapping.js`, `PureMcqExamView.jsx`, `masteryHelper.js`, `verify_canonical_schema.mjs`)
* **P0：消滅 Luca 房號題雙正解 (`hwg_b7_204`)**：
  * 原選項同時包含 `Her room number is 305.` 與 `His room number is 305.`，因題幹無性別線索導致兩者皆合理。
  * 將第二選項修正為同質錯誤項 `Her phone number is 305.`，詳解同步說明電話號碼與房號之別，確保正答唯一。
* **P1：修正詳解錯題 (`hwg_b5_187`)**：
  * `hwg_b5_187`（`I feel sick. I'm going to the hospital. -> Take care!`）原誤植 Where 問句解析，已全數修正為「得知對方生病就醫以 Take care! 表達關心問候」之正確情境解析。
* **P2：全面同步校準 8 題詳解提及之舊誘答**：
  * `hwg_b5_124`、`hwg_b5_125`、`hwg_b5_158`、`hwg_b5_172`、`hwg_b5_173`、`hwg_b7_203`、`hwg_b7_216`、`hwg_b5_174`、`hwg_b5_188` 詳解中引用的舊誘答文字（如筆/書包/湯、去哪裡、年齡動作、Sure!/Good idea! 等）已全數同步更新為當前人稱代名詞、單複數、介系詞與社交情境之真實說明。
* **方案 A（In-book Canonical）非破壞性架構全面就緒**：
  * **元資料與映射表建立 (`src/data/exam/canonicalMapping.js`)**：
    * 建立全量 3,317 筆 `LEGACY_TO_CANONICAL_MAP` 與 1,589 筆 `CANONICAL_META_MAP`。
    * 提供 `resolveCanonicalId(id)` 與 `isCanonicalId(id)` 查表工具。
  * **非破壞性題庫擴充 (`src/data/hereWeGoMcqBank.js`)**：
    * 全量 3,317 題無損保留（`main` 尚未刪除任何一題），精確標記 1,589 筆 `isCanonical: true` 與 1,728 筆 `isCanonical: false`。
    * 每題植入 `canonicalId`、`primaryScope`、`scopes`，確保 Review 複習單元無縫涵蓋。
  * **作答引擎與易錯題相容 (`PureMcqExamView.jsx`)**：
    * `curriculumPool` 依 `canonicalId` 天然去重並支援 `scopes` 跨單元篩選，學生作答同次測驗絕不抽到重複題。
    * 錯題本與易錯題複習機制全面以 Canonical ID 統一索引並遷移舊題號。
  * **動態滾動精熟引擎適配 (`src/utils/masteryHelper.js`)**：
    * 課本軌道精熟分母精準綁定 **1,589 題**，以 Canonical ID 記錄精熟，杜絕刷同字複本灌水。
  * **CI 契約與安全回滾體系**：
    * 新增 `scripts/verify_canonical_schema.mjs` 自動化 CI 門禁，100% 驗證總量 3,317、Canonical 1,589、Clones 1,728、11 冊每冊皆 `>= 100`。
    * 建立 `docs/exam/CANONICAL_MIGRATION_DRY_RUN_REPORT.md` 完整乾跑報告。
    * 建立 `scripts/rollback_canonical_migration.mjs` 單鍵回滾工具與 `scripts/execute_canonical_prune.mjs` 正式修剪工具。

#### 0.0.8 題庫品質全面大修訂 Batch 4：詳解與正答同步校準、消滅選項雙句點、清零 34 題方向樣板與 CI 語意防禦升級 (`hereWeGoMcqBank.js`, `scripts/audit_semantic_gates.mjs`)
* **P0/P1：詳解與正答完全同步校準**：
  * `hwg_b4_653`：詳解修正為肯定應答（「後句『He's in the kitchen.（他在廚房）』說明他在廚房，答句與問句一致，故選肯定應答『Yes, he is.』。」），杜絕學生答對卻看到相反解析。
  * `hwg_b7_236`：詳解同步修正為車輛交通工具（「後句提到『Dad drives us there.（爸爸開車載我們去）』，說明交通工具為開車，故選『by car（搭車／開車）』。」）。
* **P1：全題庫選項雙句點（`..`）徹底清零（84 處修正）**：
  * 清查並修復原集中於 `hwg_b4_611`～`638` 與 `hwg_b8_919`～`940` 等現在進行式及過去式題組中產生之 84 處尾綴雙句點（`..`），使全庫 3,317 題選項標點純淨無誤。
* **P1：清零最後 34 題方向導引通用樣板（`It is over there.` / `Go straight.` / `Turn left.`）**：
  * 全面重構 34 題包含此三句樣板之題目（涵蓋 `hwg_b4`、`hwg_b5`、`hwg_b6`、`hwg_b7`、`hwg_b8`、`hwg_b9`），依題目實際評量標的（Yes/No 代名詞人稱一致性、所有格名詞、街名介系詞、交通工具主詞動詞一致性等）替換為同質、無多重正解之精確誘答。
  * 徹底解決 `hwg_b5_172`（`Where's the hospital?`）與 `hwg_b5_158`（`Where's the bathroom?`）潛在之多重合法位置回答問題。
  * 全題庫 3,317 題中 `It is over there.`、`Go straight.`、`Turn left.` 出現次數完全降至 **0**。
* **CI 語意門禁強化 (`scripts/audit_semantic_gates.mjs`)**：
  * 新增選項嚴格雙句點格式防禦 `(?<!\.)\.\.(?!\.)`（課本題庫、TME、SAA 全量覆蓋）。
  * 新增 Yes/No 答句與詳解一致性防禦（`YES_ANSWER_BUT_EXPLANATION_SAYS_NEGATIVE` 及 `NO_ANSWER_BUT_EXPLANATION_SAYS_AFFIRMATIVE`）。
  * 強化 Where 題型正規化相容 `Where's` 與 `Where is`。
  * 將方向樣板正式納入 `BOILERPLATE_DISTRACTORS` 永久防回歸黑名單。
  * 課本 3,317 題 ＋ TME 300 題 ＋ SAA 285 題持續 100% 通過。

#### 0.0.7 題庫品質全面大修訂 Batch 3：消滅 G-DLG 新三句樣板、根除禮貌與時間雙黃蛋、重構 18 題 TME 聽力回應與 CI 語意多重正解閘門 (`hereWeGoMcqBank.js`, `tmePreA1Bank.js`, `scripts/audit_semantic_gates.mjs`)
* **P0：精準消滅矛盾回答與雙正解地雷**：
  * `hwg_b3_582`：修正拒絕水卻要求水之矛盾，題幹改為 `A: Do you want some water, Sophie? B: ______ I want some juice.`，正解 `No, thank you.`，詳解同步精修。
  * `hwg_b4_653`：修正原問句 `Is your brother in the kitchen?` 後句 `He's in the kitchen.` 卻誤設正解為 `No, he isn't.` 之矛盾，正解修正為 `Yes, he is.`。
  * 5 題時間題（`hwg_b4_592`, `595`, `598`, `601`, `604`）：題幹明確加入標準時間線索（如 `(7:00)`、`(12:00)`、`(6:30)` 等），並重構誘答為人稱與介系詞文法干擾（`They're seven o'clock.`, `I'm seven o'clock.`, `At seven o'clock.`），徹底根除 `It is ten o'clock.` 造成的雙黃蛋。
  * 65 題禮貌/邀請題（含 `hwg_b3_101`, `103`, `202`, `576~590` 等）：徹底拆解同題同時出現 `Yes, please.` 與 `No, thank you.` 造成的語意衝突，改以短語文法、助動詞/be動詞呼應干擾，保證唯一可成立正答。
  * 8 題物品位置題（`hwg_b4_658~672`）：全面移除模糊干擾項 `It is over there.` 與 `Go straight.`，重構為介系詞受詞同質、僅以人稱代名詞一致性（`It's ...` vs `They're ...`）為唯一考點。
  * `hwg_b7_236` 增補 `Dad drives us there.` 明確線索（唯一指向 `by car`）；`hwg_b5_143` 移除 `Is it Thursday today?` 誘答；`hwg_b7_219` 純化為國籍來源與人稱代名詞干擾。
* **P1：195 題 G-DLG 新三句樣板（`See you later.`、`Have a nice day!`、`You're welcome.`）徹底清零**：
  * 依實際問句之語言行為（Speech Act）與課綱單元目標，全面重構為同語境、同句型、具教育意義之真實同質誘答（年齡、姓名、顏色、身體病痛、過去式事件、現在進行式等），全題庫 3,317 題中上述 3 句樣板誘答數降至 **0**。
* **P1：TME Pre-A1 全部 18 題「選適當回應句」重構升級**：
  * 全數重做 18 題 `listen-resp` 的第 7 選項與干擾項，杜絕非相關無厘頭干擾句（如 `It is my favorite pencil.`、`I am ten.`），改為同句型/同社交情境但因人稱、時態、物品屬性不合而錯之高品質誘答。
* **CI 語意門禁強化**：
  * `scripts/audit_semantic_gates.mjs` 正式新增：
    1. 全局題庫 ID 唯一性檢查（跨 3,317 課本 ＋ 300 TME ＋ 285 SAA）。
    2. G-DLG 禁用新三句樣板偵測。
    3. 邀請/請求題嚴禁同時出現 `Yes, please.` 與 `No, thank you.` 門禁。
    4. Where 題嚴禁同時出現特定位置與 `It is over there.` 門禁。
    5. What time is it 題無時間提示時嚴禁多個合法鐘點門禁。
  * 3,317 課本 ＋ 300 TME ＋ 285 SAA 全量通過 100%。

#### 0.0.6 題庫品質全面大修訂 Batch 2：741 題對話題情境同質誘答重構、86 題 TME 擴充至 7 選項契約、CI 語意門禁強化 (`hereWeGoMcqBank.js`, `tmePreA1Bank.js`, `tmePreA1ReadingBank.js`, `scripts/audit_semantic_gates.mjs`)
* **P1：741 題情境對話題（`G-DLG`）樣板誘答徹底消滅**：
  * 原先 741 題對話題充斥通用樣板干擾句（如 `I am fine, thank you.`、`Nice to meet you, too.`、`My name is Leo.`、`I am ten years old.`、`I am very happy.`），鑑別度嚴重不足。
  * 全數重構為**同語境、同文法類別、且在題幹情境下均不成立**之高品質同質誘答：
    * 319 題短語文法填空：以同質文法標的（Wh-疑問詞、代名詞、助動詞、介系詞、冠詞等）補齊後續選項。
    * 52 題問句題：以同語境 Wh-問句（時間、地點、天氣、食物、能力等）替換樣板陳述句。
    * 370 題情境回答句：依食物/點餐、天氣、時間/日期、位置/方向、價格、個人能力等領域，替換為同情境具鑑別度之錯誤回答。
  * 同步消除 8 處新誘答產生的縮寫/全寫雙黃蛋衝突（如 `hwg_b1_30` 之 `What is that?` 代換 `What is this?`；`hwg_b2_449` 之 `No, he can't.` 代換 `No, I cannot.`）。
* **決議：86 題 TME Pre-A1 獨立選擇題全數升級為 7 選項規範**：
  * TME 300 題結構嚴謹分流：36 題口說朗讀（1 目標）、14 題是非題（2 選項）、88 題重組/篇章閱讀（4 選項）、162 題一般獨立字彙/聽力/閱讀選擇題（全數統一為 7 選項，正答 index 0）。
  * 針對原僅 6 選項之 86 題（1 題 `vocab-audio2pic`、14 題 `vocab-audio2word`、5 題 `listen-pic2sent`、7 題 `listen-dlg2pic`、18 題 `listen-resp`、15 題 `listen-conv-qa`、8 題 `read-pic2sent`、18 題 `read-cloze`）逐題補入第 7 個高同質性誘答，完全消滅 6 選項殘留。
* **CI 語意門禁擴展升級 (`scripts/audit_semantic_gates.mjs`)**：
  * 將課本題庫「強制恰為 7 選項」、TME 300 題結構契約、`G-DLG` 樣板句偵測列為永久 CI 自動門禁，100% 杜絕回歸。

#### 0.0.5 題庫品質全面大修訂 Batch 1：消滅 SAA 聽力洩題、142 題字母單元歸位、74 題字母同質選項重構與 P0/P1 語意修復 (`saaExamBank.js`, `hereWeGoMcqBank.js`, `tmePreA1Bank.js`)
* **P0：SAA 聽力測驗逐字稿畫面外洩全面根除 (35 題)**：
  * `saaExamBank.js` 聽力三大題（辨識句意、基本問答、言談理解）原先在題幹包含 `（音檔：...）`、`（問句：...）`、`（對話：...）` 與 `（廣播：...）`，導致學生在畫面上直接看到逐字稿。
  * 全數將題幹純化為作答引導指令（如 `【聽力：辨識句意】請聽音檔，選出相符的情境描述：`），音檔逐字稿嚴格保留於 `media.audioText` 供 TTS 播放及交卷後詳解解析，徹底落實聽力測驗之測驗嚴肅性。
* **P0：142 題字母專冊單元範圍錯置精準歸位**：
  * 1、2 年級字母專冊中，原先有 142 題因流水號分派跨出單元範圍（例如在 Unit 1 A~G 中考 P、在 Unit 2 H~N 中考 U）。
  * 依評量標的字母（`ch`）嚴格分派至對應單元（`A~G` $\to$ Unit 1、`H~N` $\to$ Unit 2、`O~T` $\to$ Unit 3、`U~Z` $\to$ Unit 4），確保單元內絕無跨範圍越界題目。
* **P0 & P1：已確認之多重正解、填空長度、詳解不符與自然度修復**：
  * `hwg_b2_443`：`Look! It's a small ______.` 誘答項包含 dog、cat 等動物造成多重正解。重構為詞性與單複數文法辨析：`['turtle', 'tall', 'swim', 'turtles', 'slowly', 'swimming', 'fly']`，確保唯一可成立正解。
  * `hwg_b7_220`：將 12 個底線 `____________` 統一修正為標準 6 底線 `______`。
  * `hwg_b7_222`：修正錯置之 How 交通方式詳解，改為精準說明第三人稱單數 Alex 之 Does 助動詞疑問句。
  * `hwg_b3_111`：英文自然度修正，題幹改為 `Look! ______ the Earth!`，正解 `It's`，符合唯一天體加定冠詞之標準英文用法。
  * `tme-read-tf-07`：同步將是非題題幹中的時態不一致修正為 `Sandy buys three cookies.`，杜絕過去式與現在式之混淆。
* **P1：74 題字母題非同質誘答重構（徹底移除 am/is/are）**：
  * 48 題三字母順序題（`A-ORDER`）全面改為該三字母之排列組合（如 `A, B, C` 之 5 種錯誤順序 ＋ 1 種相鄰字母順序），杜絕非字母詞彙湊數。
  * 26 題大小寫配對題（`A-CASE`）全面改為同大寫字母搭配不同小寫字母之同質干擾項（如 `A o`, `A e`, `A c`, `A u`, `A i`, `A d`），鑑別度大幅提升。
* **CI 語意門禁強化**：擴展 `scripts/audit_semantic_gates.mjs`，將單元範圍防呆、6 底線規範、字母同質性與聽力防洩題列入自動檢驗。

#### 0.0.4 第二代語意與作答邏輯深度體檢 ＆ 219 題雙黃蛋與歧義徹底消滅 (`src/data/hereWeGoMcqBank.js`, `scripts/audit_semantic_gates.mjs`)
* **突破第一代語法檢查盲區**：
  * 原有 CI 僅檢查程式語法結構（ID 唯一、欄位齊全、無模板字串），無法辨識「英文語意邏輯衝突」。
  * 啟動全新第二代語意體檢，精準掃描並修復全庫 219 筆潛在地雷題目，保證題幹清晰、選項互斥且必定有唯一確定正解。
* **縮寫與全寫雙黃蛋消滅 (Contraction Clashes)**：
  * 根除例如 `A: How are you, Lucas?` 正解為 `I'm fine, thank you.` 但誘答項竟出現 `I am fine, thank you.` 導致學生選全寫被硬判錯的冤案。
* **對話多重正解與無提示猜謎消滅 (Multi-Name & Multi-Age Clashes)**：
  * 「What's your name?」誘答池全面移除第二個合法姓名（如 `My name is Leo.`），改以社交問候語替換。
  * 「How old are you?」在無年齡提示情境下，誘答池全面移除其他合法歲數，僅保留唯一合法正解年齡，杜絕猜謎。
* **低年級字母題幹全面精準化 (194 題)**：
  * 將 1、2 年級「A 後面的字母」及「B 前面的字母」全面正名為「依照字母順序，大寫字母 A 緊接著的下一個字母」與「緊接著的前一個字母」，徹底消滅後續字母範圍模糊之爭議。
* **永續自動化語意品質閘門 (`scripts/audit_semantic_gates.mjs`)**：
  * 新增永久語意檢驗腳本，並將大小寫敏感防呆與字母順序契約永久整合至 `scripts/smoke_test.mjs`，全站 3,317 題通過率 100%。

#### 0.0 課本同步檢定題庫 3,317 題大擴充 ＆ 7 選項動態誘答池 ＆ 全量 3,631 筆雲端審核 (`src/data/hereWeGoMcqBank.js`)
* **段考題量嚴重見底痛點根治**：
  * 原有 1,289 題擴充翻倍至 **3,317 題**（每冊 270~390 題、每單元平均達 45~65 題）。
  * 徹底解決段考複習選 20 題或 50 題時題庫見底或二刷重複率 100% 的窘境。
* **題型大平衡 (Word Meanings / Dialogues / Grammar / Alphabet)**：
  * 單字語意題 (`V-MEAN`) 由 13 題爆發擴增至 **1,849 題**。
  * 情境對話題 (`G-DLG`) 742 題、文法題 (`G-MC`) 289 題、低年級字母系列 437 題（`A-ORDER` 242、`A-CASE` 126、`A-MISSING` 69）。
* **「1 正解 ＋ 6 誘答項 = 7 選項動態池」與 $C_3^6$ 隨機抽樣**：
  * 全題庫 3,317 題題目格式統一規範：`options[0]` 為唯一正確解答（`answer: 0`），後方提供 6 個互斥、大小寫不敏感之同質誘答項。
  * 學生端測驗組卷時（`PureMcqExamView.jsx`），動態從 6 個誘答項中隨機抽取 3 個（$C_3^6 = 20$ 種組合），與正解合併為 4 選項並進行 Fisher-Yates 洗牌。每次測驗高達 480 種答項排列變化，答項永不固定，杜絕死記選項位置。
* **Supabase 雲端全量審核與 PostgREST 分頁突破**：
  * 教師後台審核記錄跨越 1,000 筆查詢上限：在 `src/services/supabase.js` 的 `fetchTeacherAuditRecordsFromCloud` 實作 `.range()` 迴圈分頁，完美載入全量 **3,631 筆**審核資料（3,317 課本 ＋ 300 Pre-A1 ＋ 14 SAA 全真試卷）。
  * 雲端審核狀態 100% 綠色通過，零 AI Pro 思考額度消耗（純 Node.js 本地演算法比對寫入）。

#### 0.0.1 學生自組練習題疑義回報機制與教師後台審閱聯動 (`PureMcqExamView.jsx`, `ExamAuditZone.jsx`)
* **練習模式專屬開放，正式測驗嚴格排除**：
  * 僅在平日自選練習（課本進度練習、學力專項練習、Pre-A1 弱點突破、錯題擊破室）之題幹右上角開放「⚠️ 回報問題」按鈕；單題詳解翻頁檢視卡亦支援「⚠️ 回報疑義」。
  * 限時 35 分之 Pre-A1 官方模擬標準卷、SAA 全真 35 題原卷、期中期末模擬考全面隱藏回報按鈕，確保正式測驗嚴肅性與零干擾。
* **學生端免打字「5 大高頻快答晶片彈窗」**：
  * 小學童單鍵點選：找不到答案、圖片錯誤、語音讀音怪異、錯字打錯、其他問題。
  * 點擊送出後即時 Toast 溫暖回饋，該題自動變更為灰底「✓ 已回報」防洗頻，不中斷計時或干擾作答流程。
* **Supabase 雙軌獨立儲存與教師後台一鍵查核**：
  * 獨立儲存於 Supabase `leaderboard (mode = 'exam-student-report')`，不破壞既有教師審核通過狀態。
  * 教師後台（`ExamAuditZone.jsx`）新增「⚠️ 學生回報疑義 (N)」專屬篩選器與醒目橙色警示條，顯示學生姓名、時間與快答原因，並提供「✓ 查核無誤（清除回報）」一鍵銷單解鎖。

#### 0.0.2 試卷大題均衡定額組卷演算法與生字去重強化 (`src/games/exam/examBlueprint.js`)
* **根除單字題佔比過高偏頗痛點**：
  * 原演算法採庫存比例分派（Proportional Distribution），因題庫擴充後單字語意題（`V-MEAN`）佔比高達 62%，導致 20 題測驗中出現 16~17 題直接選單字翻譯題。
  * 重構為 **各大題均衡定額配額（Round-Robin Allocation）**：各大題（字彙、文法、對話、閱讀等）預設盡可能均分題數（3 題型各約 1/3 即 7/6/7 配比、4 題型各約 1/4 即 5/5/5/5 配比）。
  * 引入 **單字題天花板保護機制**：純單字語意題在多題型試卷中上限不超過 35%（20 題中字彙最多 7 題、文法 6 題、對話 7 題），即使題庫單字儲存量龐大也絕不稀釋文法與對話。
* **題幹由短至長自然排列（遵循正規命題規範）**：
  * 試卷題目依照大題依序排定：第一部分 單字語意（短） $\to$ 第二部分 文法選擇（中） $\to$ 第三部分 情境對話（長） $\to$ 第四部分 閱讀與克漏字。
  * 往後擴充聽力題型時，亦能自然銜接於最前方的第一大題。
* **生字衝突去重能力強化 (`extractTargetToken`)**：
  * 支援正則解析題幹中 `「...」` 引號標註的生字（如「單字「math」的中文意思是下列哪一個？」）。
  * 支援 `V-MEAN` 正解選項中文單字辨識，徹底避免同份試卷中兩度出現同一生字（如重複考兩題 math）之現象。

#### 0.0.3 四聯風琴階梯式布題控制台與考前第0頁音訊檢驗站 (`PureMcqExamView.jsx`)
* **四聯推進式布題控制台 (4-Column Progressive Mission Board)**：
  * iPad 橫向視圖 100% 免滾動四等分並列（由左至右階梯引導）：
    * **欄 1 冊別目標 (`01 TARGET`)**：1、2 年級字母專冊、1～8 冊何嘉仁教材、國一先修，依學生年級標註「★ 本年級」。
    * **欄 2 評量範圍 (`02 SCOPE`)**：1、2 年級自動選取「全字母闖關」；3～6 年級三大段考快選膠囊（`⚡ 上半冊 (期中考)`、`⚡ 下半冊 (期末考)`、`🌟 全選 / 全冊總複習`）＋ `⚙️ 自選特定單元` 摺疊抽屜。
    * **欄 3 施測型態 (`03 MODE`)**：1、2 年級自動配置字母題；3～6 年級提供「🎧 綜合測驗 (段考標準，含聽力約30%+筆試70%)」、「📝 純筆試測驗 (避開聽力，安靜教室首選)」、「🔊 純聽力特訓 (全聽力問答)」。
    * **欄 4 題數規模與啟動中樞 (`04 SCALE & LAUNCH`)**：上半部選題數（課本 10/20/50 題，1~2年級 10/20 題），下半部約 1/3 直接放置實體大尺寸啟動按鈕「🚀 開始檢定 (進入第0頁) ➔」，符合費茨法則（手勢就地啟動，杜絕折返跑）。
  * 手機版自適應向下單欄延展，底部列維持「返回選單」與「開始檢定」按鈕，並於平板與桌面顯示即時配置摘要徽章。
* **考前第 0 頁緩衝試卷大綱與耳機/音量檢測站 (`phase === 'instructions'`)**：
  * 進入第 1 題前的專用緩衝引導頁，消除突兀跳題感。
  * 清楚展示大題結構藍圖（聽力、單字、文法、對話）與考生准考證檔案卡。
  * **音訊檢驗站**：
    * 含聽力大題（綜合卷或聽力特訓）：提供「🔊 點我測試耳機與喇叭音量」實體按鈕（Web Speech API 播放 Welcome to the Wutai English Test 美式英語與脈衝動畫），以及「🔇 沒耳機？轉純筆試」快捷重組按鈕。
    * 純筆試：顯示「📝 純讀寫筆試模式（安靜作答）」，提供個別試聽鈕。
  * 底部大尺寸按鈕：「🚀 我準備好了，開始作答 (進入第 1 題) ➔」，點擊才開始計時進入 Q1。
* **三大題庫題數規模統一**：
  * 課本題庫：10 / 20 / 50 題
  * SAA 學力測驗：20 / 35 題
  * Pre-A1 官方模擬：10 / 20 / 30 題

#### 0. 全域遊戲資源載入進度條 (`GamePreloader`) 與年度節慶神獸輪替機制
* **徹底杜絕黑屏與閃退感** (`src/components/ui/GamePreloader.jsx`):
  * 在所有大型遊戲（如貪食蛇、隕石等）啟動與高解析度圖資解碼（`Image.decode()`）前，呈現沉浸式過場進度條。
  * 支援真非同步資源預載與時間進度平滑插值（Lerp），CI 與 Headless 自動化測試環境自適應加速（100ms 快速通過），實機環境保留最少 1.2 秒優雅展示。
* **神山四大守護神獸 ＋ 12 個月份節慶限定輪替矩陣** (`docs/features/GAME_PRELOADER_SPEC.md`):
  * 常態池：🐆 **台灣雲豹**、🐻 **台灣黑熊**、🐗 **神山野豬**、🦌 **台灣水鹿**（手繪 WebP 奔馳 Sprite 動態隨進度前進，腳下伴隨光塵粒子）。
  * 節慶限定：10月萬聖南瓜怪、12月聖誕老人雪橇、6月端午龍舟、9月中秋玉兔等，系統依據 `new Date().getMonth() + 1` 自動加入候選池（50% 機率登場）。
* **神山雙語每日格言庫** (`src/data/forestQuotes.js`):
  * 收錄 30+ 則富含探險勇氣、堅持努力、自然智慧、接納錯誤之小學生正向格言，中英雙語對照排版，在等待載入之餘同步兼具雙語微學習。

#### 0.1 114 年國小學力檢測 (SAA) 考古題完整入庫 (總題數擴充至 285 題)
* **全真考古題 105 題全量收錄** (`src/data/exam/saa/`):
  * 收錄 114 年四年級 (G4 35題)、五年級 (G5 35題)、六年級 (G6 35題) 全真檢測試卷，官方答案 100% 比對驗證。
  * SAA 總題庫正式擴充至 **285 題**（115 年 105 題 ＋ 114 年 105 題 ＋ 常態模擬題 75 題），與 Pre-A1 300 題達到均衡。
* **高解析預留邊距裁切 (Padding)** (`public/assets/exam/saa/114/`):
  * 產出 62 張高品質 WebP 試卷插圖，向非空白方向主動預留 20~40px 安全邊距，不貼邊裁傷文字與邊框。
* **題組包裹防破碎機制 (Passage Bundling)**:
  * 篇章題組（視訊通話、火車廣播、週日計畫、課表、沙發評論、Toby 日記）統一指派 `groupId` 並在每題完整嵌入篇章，抽題時整組抽取、不破碎。
* **聽力精準多角色轉錄與美語優先**:
  * Whisper 聽力全文轉錄，對話角色（`Mom: ... \n Boy: ...`）男女分流，強制美式英語 (`en-US`) 優先，杜絕語音混淆。
* **檢定館年度試卷切換** (`src/games/exam/PureMcqExamView.jsx`):
  * 支援 115 最新施測年度與 114 正式題本切換，說明頁與測驗流程無縫適配。

#### 0.2 全校英雄榮譽榜 3A 旗艦級重構：單行極簡 HUD、大武山四聯手風琴與前景排行榜極致美化 (`src/components/LeaderboardView.jsx`)
* **頂部控制列極致精簡 (Ultra-Compact Single-Line HUD)**:
  * 全面合併為單一行（高 46px~50px），徹底釋放 92% 垂直空間給四聯風琴頁。
  * 左側：`[ ◀ 回大廳 ]` ＋ `115學年度 第2學期` 微光學期銘牌（保留 5 次連點進入 Teacher Hub 教師管理台彩蛋）。
  * 中央：`[ ◀ 第 10 週 ▶ ]` 純箭頭步進器 ＋ `[ ◀ 年級 ▼ ▶ ]` 雙向步進器與浮動直選抽屜（常設 DOM 按鈕 100% 相容 smoke_test 對「一年級」的點擊檢核）。
  * 右側：重新整理、靜音切換、日夜切換與個人探險通行證。
  * **徹底移除四王綜合至尊銘牌 (Grand Master)**：不再強制合併計算無意義之綜合分數，版面極度乾淨俐落。
* **大武山四聯手風琴主視覺 (Dawu Mountain Quadriptych Accordion)**:
  * 採用 Banana 高階繪圖生成的北大武山主峰同景構圖四色調長卷（`polyptych_exam.jpg` 破曉天青藍、`polyptych_coin.jpg` 朝陽旭日金、`polyptych_quest.jpg` 林谷幽霧綠、`polyptych_game.jpg` 暮色星漢紫）。
  * **收折狀態**：四扇神山屏風並立（flex: 1），展示立體金屬漸層王名與前三名純徽章預覽（1, 2, 3 立體名次徽章 ＋ 座號姓名，零混亂分數）。
  * **展開狀態**：點擊任一王平滑展開為主舞台（flex: 7），其餘壓縮為神山立柱（flex: 0.75 可直接點選切換），右上角設有 `[ ✕ 還原全景 ]` 醒目按鈕。
* **背景深層背景化，前景排行榜極致 3A 美化**:
  * **背景深層背景化**：大武山原畫加上半透明深黑漸層遮罩（`brightness-[0.35]` 搭配微光暗角），大氣磅礴深邃透光，絕不反白刺眼或干擾文字。
  * **前景排行榜主視覺美化**：
    - 表頭清晰標註名次、英雄勇士、年級座號與成果。
    - 前三名尊榮金銀銅卡片（第 1 名金熾流光、第 2 名冷銀霜月、第 3 名青銅烈焰），搭配立體金屬名次徽章與清晰字體。
    - 第 4~50 名深黑半透明水晶板（`bg-black/35 hover:bg-black/55 border border-white/10`），數字名次圓角清晰。
    - **當前登入學生高亮光環**：若當前學生登榜，自動以翠綠微光金屬邊框標示「★ 你的英雄」，一眼掌握自身排名。
    - 測驗之王 4 大官方子榜橫向膠囊（Pre-A1 劍橋藍、SAA 國教綠、課本金、口說紫粉）與遊戲之王 4 大單字館領域切換（探索解謎、極速反應、經典測驗、多人連線）。
* **全自動防回歸檢驗**：
  * 通過 `npm run build` 與 `node scripts/smoke_test.mjs` 6 大階段 100% 零崩潰無頭 Chrome 驗證，已同步至 `origin/main` 並自動發布至 Cloudflare Pages。
  * 測驗之王：四大子榜（📘 Pre-A1 官方精熟、📗 SAA 學力成就、📙 課本單元檢定、🎙️ 雙語口說評測），框色嚴格參考原測驗館。
  * 遊戲之王：100% 遵照 Lobby.jsx 單字館四大分類（🧭 探索解謎、⚡ 極速反應、📖 經典測驗、⚔️ 多人連線），框色傳承原單字館。
  * 進入子榜後背景光暈與邊框色調完全依照該殿堂色系渲染。
* **防回歸驗證**:
  * 100% 通過 6 大階段無頭 Chrome smoke test（Stage 0 靜態契約、Stage 1 排行榜載入與一年級點選、Stage 2~6 全矩陣無崩潰）。

#### 1. 叢林神山貪食蛇 (Snake Game) 大地質素與 Sprite 全面昇華
* **神山青苔石板無縫地坪** (`public/assets/snake/indigenous_ground.webp`, `src/games/snake/SnakeCanvas2D.jsx`):
  * 告別過去單調向量純綠方格，全面導入魯凱特色頁岩片石板、青苔林地無縫貼圖（512×512），白晝與月夜（黑曜岩濾鏡＋45°月光掠影）雙重適配。
* **七彩琉璃珠字母寶座** (`public/assets/snake/bead_letter_pod.webp`, `src/games/snake/snakeJungleTheme.js`):
  * 字母底座升級為高透光 3D 魯凱傳奇琉璃珠（太陽之眼/勇士之珠），維持 900 特粗純黑描邊＋純白/亮金浮雕字母，確保 4K 字母極致清晰。
* **百步蛇精雕頭尾 Sprite 與高密覆瓦狀鱗片** (`public/assets/snake/snake_head_indigenous.webp`, `snake_tail_indigenous.webp`):
  * 蛇頭隨運動方向即時旋轉（`atan2` + `PI/2`），神聖金色蛇瞳與動態吐信。
  * 蛇尾專屬收尖甩尾 Sprite。
  * 蛇身採用骨骼連續覆瓦狀菱形鱗片交疊技術，90 度轉彎或穿牆時絕不翻車、零縫隙撕裂。
* **石雕目標單字看板與青銅鈴鐺發音鈕** (`src/games/snake/SnakeGame.jsx`):
  * 目標單字看板改為神山頁岩飾板與百合浮雕紋，拼字槽呈現立體石刻凹槽。
  * 發音按鈕升級為立體微縮 3D 質感之「神山勇士青銅鈴鐺按鈕」，滑鼠 hover/touch 微光回饋。

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

#### 16. 鷹眼神探 第 2 至 8 冊判定框與相異目標全量校準及顯微驗收矩陣部署 (`spotterData.js`, `SpotterTestWorkbench.jsx`)
* **全冊次舊版 B 方案場景校準完備（遵照專案負責人 Mark 規範通過審核，新場景全數朝動態 A 方案施作）**：
  * **第 2 冊（陽光農莊與可愛動物公園）**：徹底更換先前誤植之「溫馨派對」題目，回歸 Here We Go 第 2 冊核心寵物與玩具單字（`cat` 貓咪、`ball` 球、`dog` 狗狗、`rabbit` 兔子、`turtle` 烏龜、`frog` 青蛙、`kite` 風箏、`bird` 小鳥），精準校驗 8 大相異點座標。
  * **第 3 冊（微風野餐湖畔）**：修正太陽（`sun`）判定框偏右圈到雲層問題，校準至太陽本體中心 `(690, 100)`，半徑改為 `rx: 80, ry: 75`，精準包覆光芒與笑臉。
  * **第 4 冊（英倫透視家居）**：
    * 互換 `bed`（二樓床鋪，`x: 275, y: 395`）與 `hat`（二樓衣帽架，`x: 275, y: 210`）判定框。
    * 擴大雙層公車（`bus`）判定框至 `(210, 665, rx: 110, ry: 130)`，完整包覆整輛英倫紅色雙層巴士。
    * 校準 `computer`（二樓書桌筆電，`x: 605, y: 310`）、`sofa`（客廳沙發，`x: 435, y: 765`）、`book`（茶几讀本，`x: 535, y: 775`）、`bag`（玄關背包，`x: 792, y: 792`）。
  * **第 5 冊（巴黎羅浮宮廣場）**：
    * 校正台階守護石獅（`lion`，`x: 385, y: 345`，原誤植為 milk）。
    * 校正左側大樹上的無尾熊（`koala`，`x: 88, y: 275`，原位置偏移）。
    * 校正矮牆上的玻璃牛奶瓶（`milk`，`x: 230, y: 725`）。
    * 將誤植之調色盤替換為圓木凳上的切片蛋糕（`cake`，`x: 828, y: 790`）。
  * **第 6 冊（星際與自然歷史博物館）**：
    * 校正展覽廳中央大象（`elephant`，`x: 500, y: 520`，原誤植為 sunglasses）。
    * 校正前方絲絨展台上的墨鏡（`sunglasses`，`x: 500, y: 760`，原指派於大象）。
    * 精準微調博物館長椅生菜沙拉（`salad`，`x: 685, y: 645`）與邊几拉麵（`noodles`，`x: 345, y: 585`）。
  * **第 7 冊（世界節慶與環球港灣）**：
    * 擴大觀景台世界地圖判定框（`map`，`x: 640, y: 630, rx: 140, ry: 125`），全域涵蓋整張彩色地圖。
    * 擴大長椅旁行李箱判定框（`suitcase`，`x: 925, y: 635, rx: 120, ry: 125`），與地圖完全獨立、零重疊誤觸。
  * **第 8 冊（四季時光庭園）**：
    * 擴大池中天鵝判定框（`swan`，`x: 250, y: 580, rx: 95, ry: 90`），完整包覆天鵝頭頸、羽翼與身軀。
    * 修正鏟子嚴重錯位問題，整體向右上移（`spade`，`x: 145, y: 610, rx: 65, ry: 160`），完整涵蓋手柄至入土鏟刃。
    * 往上微調大衣判定框（`coat`，`x: 952, y: 310, rx: 80, ry: 105`），完美包覆風衣領口。
* **鷹眼神探 QA 檢驗工作台（`/spotter-test`）全量顯微裁切矩陣自動生成**：
  * 生成 56 張 650x276 高解析「BASE vs VAR A」局部對比圖（`/assets/spotter/crops/b2_s1/` ～ `b8_s1/`），供負責人 Mark 於工作台一鍵逐卡檢視判定規格與羽化邊緣。
  * 生成第 2 至 8 冊全圖判定框標籤對照圖（`book2_side_by_side_boxes.jpg` ～ `book8_side_by_side_boxes.jpg`）。
  * CI 測試 `npm test`（14 款遊戲 4 身分）與 `test_spotter_workbench.mjs`（無頭 Chrome CDP 自動驗收）均 100% 通過。

#### 17. 鷹眼神探 第 2 至 8 冊最終實體驗收校準、旋轉橢圓判定與博物館展館無食物規範修訂 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `SpotterScene.jsx`, `public/assets/spotter/*`)
* **背景與專案負責人 Mark 驗收審查意見**：
  * 專案負責人 Mark 逐冊深度審查 `/spotter-test` 提出精密反饋：
    1. **二冊**：烏龜判定框下移、青蛙判定框下移一個圓半徑（約 50px）、風箏框連飄逸尾穗一併完整包含；圖 2 京都未繪圖前不載入底圖避免混淆。
    2. **三冊**：太陽與雲朵合併圈選（右圖白雲消失，單圈太陽會漏圈相異本體）。
    3. **四冊**：僅時鐘正確，其餘 7 處徹底復原實體像素（左側英倫雙層大紅公車、2F 床鋪、2F 衣帽架草帽、2F 書桌筆電、1F 客廳沙發、1F 茶几讀本、1F 玄關地毯背包）。
    4. **五冊**：足球、蛋糕、相機正確；長棍麵包判定框向右收斂避免涵蓋牛奶瓶；復原左樹無尾熊、台階石獅、矮牆牛奶、畫架蒙娜麗莎畫作。
    5. **六冊（重要規範）**：**展館內禁止飲食，嚴格禁止畫食物進博物館！** 透過像素級修復修補博物館長椅面與垂直木飾板（完全抹除生菜沙拉碗與拉麵熱氣），展台墨鏡 (`695, 585`) 與中央大象 (`685, 405`) 標籤顛倒徹底撥正。
    6. **七冊**：世界地圖向右微調包覆整張地圖（`705, 570`），與右側行李箱（`965, 580`）完美脫鉤 0 重疊。
    7. **八冊**：天鵝判定框往右上移動包覆完整身軀羽翼（`325, 460`）；花圃鏟子為配合傾斜角度導入**旋轉橢圓技術**（`rotate: -14`，`rx: 38, ry: 135`），由把手至鏟刃緊密包覆且 100% 脫離天鵝框；鼓面判定框往上微調涵蓋鼓棒（`288, 250`）；野餐派判定框往下微調包覆完整派盤（`704, 546`）。
* **物理像素校準成果（透過 Sharp 像素級實體定位）**：
  * **Book 2**：`turtle` (`805, 580, rx:55, ry:50`)、`frog` (`1115, 605, rx:55, ry:50`)、`kite` (`830, 185, rx:95, ry:155`，含尾穗)。
  * **Book 3**：`sun`（太陽與雲朵，`750, 100, rx:140, ry:80`）。
  * **Book 4**：`bus` (`235, 515, rx:160, ry:135`，左側大紅雙層公車)、`hat` (`395, 158, rx:60, ry:48`，2F 衣帽架草帽)、`bed` (`370, 305, rx:85, ry:65`，2F 床鋪)、`computer` (`840, 242, rx:75, ry:50`，2F 書桌筆電)、`sofa` (`560, 580, rx:85, ry:85`，1F 沙發)、`book` (`725, 590, rx:65, ry:65`，茶几繪本)、`bag` (`1095, 610, rx:65, ry:75`，玄關地毯後背包)、`clock` (`1180, 165, rx:45, ry:48`，大笨鐘面)。
  * **Book 5**：`koala` (`145, 175, rx:75, ry:75`，樹上無尾熊)、`lion` (`535, 260, rx:80, ry:90`，基座石獅)、`milk` (`330, 560, rx:45, ry:75`，矮牆玻璃奶瓶)、`bread` (`450, 560, rx:60, ry:75`，竹籃麵包，零交疊牛奶)、`football` (`755, 580, rx:60, ry:60`)、`painting` (`1020, 390, rx:55, ry:65`，畫架蒙娜麗莎)、`cake` (`1140, 610, rx:60, ry:60`)、`camera` (`1265, 490, rx:65, ry:65`)。
  * **Book 6**：食物完全抹除！`cap`（圓几棒球帽，`480, 466, rx:65, ry:55`）與 `umbrella`（長椅雨傘，`945, 493, rx:55, ry:45`）；`mask` (`104, 422`)、`rocket` (`400, 188`)、`elephant` (`685, 405, rx:130, ry:65`，展館中央大象)、`sunglasses` (`695, 585, rx:75, ry:40`，前方紅絲絨展台墨鏡)、`dinosaur` (`1000, 193`)、`backpack` (`1151, 597`)。
  * **Book 7**：`map` (`705, 570, rx:165, ry:95`，向右全包地圖)、`suitcase` (`965, 580, rx:75, ry:85`，向右緊湊)，兩者淨間距 20px，完全 0 重疊。
  * **Book 8**：
    * `swan` (`325, 460, rx:70, ry:55`，右上整隻天鵝)。
    * `spade` (`200, 535, rx:38, ry:135, rotate: -14`，逆時針 14 度傾斜橢圓全包鏟子，與天鵝間距 35px 零交疊)。
    * `drum` (`288, 250, rx:66, ry:58`，含鼓面與鼓棒)。
    * `pie` (`704, 546, rx:96, ry:52`，全包派盤與餡餅)。
    * `dress` (`1256, 348, rx:110, ry:142`，中心由 390 大幅向上拉升至 348，垂直半徑擴大至 142，完美涵蓋人型模特兒頭頸旋鈕、雙肩、洋裝裙擺至木腳架全域)。
    * `rose` (`698, 268, rx:76, ry:74`，中心中央鮮紅玫瑰花叢轉金黃玫瑰花叢；**拱門兩側纏繞之背景玫瑰花已於兩圖 100% 統一顏色**，徹底抹除背景意外色差)。
    * `coat` (`957, 310, rx:75, ry:95`)、`flute` (`998, 505, rx:105, ry:35`)。
* **引擎與檢驗工作台旋轉橢圓擴充**：
  * 在 `spotterData.js` 的相異點定義中引入 `rotate` 參數（例如 `rotate: -14`）。
  * 在 `SpotterScene.jsx` 與 `SpotterTestWorkbench.jsx` 實裝反向旋轉點擊判定幾何學：
    $$\begin{pmatrix} dx' \\ dy' \end{pmatrix} = \begin{pmatrix} \cos(-\theta) & -\sin(-\theta) \\ \sin(-\theta) & \cos(-\theta) \end{pmatrix} \begin{pmatrix} x - c_x \\ y - c_y \end{pmatrix}$$
    並檢驗點擊是否滿足 $\left(\frac{dx'}{r_x}\right)^2 + \left(\frac{dy'}{r_y}\right)^2 \le 1.0$。
  * SVG 判定外框支援 `transform="rotate(\theta, cx, cy)"`，檢驗工作台視覺呈現與點擊反饋達到像素級精準。
* **資源更新與測試驗證**：
  * 重新產出全冊次 56 張 650×276 高解析局部對照圖與 7 幅全景標籤對照圖。
  * `npm run lint` 0 errors，`npm run build` 打包順暢。
  * `scripts/smoke_test.mjs`（14 款遊戲 4 身分）與 `scripts/test_spotter_workbench.mjs` 均 100% 通過。
  * 遵照 Mark 規範：既有場景校準驗收通過，後續所有新場景統一朝 A 方案（動態 Slot 變異 + 8 選 5）標準化施作。

#### 18. 鷹眼神探 雙圖視野最大化、精簡單列 HUD、變異工作台 5 擊隱藏彩蛋與 Word Bank 預設無中文緊湊排版 (`VocabSpotterGame.jsx`, `SpotterWordBank.jsx`, `SpotterScene.jsx`)
* **背景與專案負責人 Mark 重點指示**：
  * 舊圖已全數校準驗收完畢，新圖全數朝動態 A 方案推進。
  * 針對遊戲內畫面進行極致瘦身：縮小上下多餘冗餘文字，將可視範圍最大化給左右雙圖。
  * 遊戲內頂部第一列：回大廳、放大鏡圖標、鷹眼神探（4 字，手機僅剩圖標）、第一冊（手機僅剩「一」）、愛心、進度、秒數、放大鏡、提示、換題。
  * 變異工作台改為 Mark 專屬隱藏入口（放大鏡圖標點 5 下直通）。
  * 移除手動場景切換按鈕（點換題自動切換場景）與場景長文本說明；整列拿掉 6 大相異類型橫幅。
  * 下方 Word Bank 預設不顯示中文翻譯，顯示中文按鈕整併在狀態列靠右處，極致壓縮卡槽垂直高度。
  * 手機直立版精簡所有說明文字，避免大段前言造成學生每次開遊戲都要下滑。
* **重構成果**：
  1. **頂部控制列（HUD）單列極簡化**：整合回大廳、放大鏡圖標、鷹眼神探、冊次徽章、愛心條、進度、秒數、放大鏡檢視、提示與換題於單一精緻橫幅，桌面與平板 100% 單行不換行。
  2. **放大鏡 5 連擊直通彩蛋**：`secretClicksRef` 監聽放大鏡圖標，2 秒內連點 5 下播放提示音並無縫跳轉 `/spotter-test` 變異工作台，從公開介面徹底拔除突兀的工作台按鈕。
  3. **垂直視野釋放 > 150px**：剔除場景副標題、場景切換標籤與 6 大相異類型橫幅列，雙圖畫卷向上提昇，視野面積顯著放大。
  4. **Word Bank 預設純英文無中文卡片**：預設不渲染中文釋義行，單字卡高度大幅收緊 35%；在「點擊不扣心」狀態列靠右處整併 `[📖 顯示中文]` 膠囊按鈕供自主切換。
  5. **手機直立視圖優化**：雙圖排版升級為 `grid-cols-1 landscape:grid-cols-2 md:grid-cols-2`。在手機直立方向下自然呈現「上圖 vs 下圖」雙層堆疊，頂部角標自動切換為「上圖 / 下圖」；在手機橫向、摺疊機展開或電腦寬螢幕下呈現「左圖 vs 右圖」，頂部角標無縫切換為「左圖 / 右圖」。

#### 19. 鷹眼神探 第 2 冊場景 2【日本京都花見小路與職人小鎮】A 方案動態 8 選 5 補丁引擎實裝 (`spotterData.js`, `SpotterScene.jsx`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與專案負責人 Mark 規範**：
  * 舊圖已全數校準驗收完畢，第 2 冊起所有新圖全面採用 A 方案（動態 Slot 8 選 5 補丁合成技術）。
  * 左右兩圖未被抽選中的 3 個目標在右圖不疊加補丁，保持與左圖 100% 完全相同（型態 A），徹底杜絕任何 AI 背景幻覺與幽靈差異誤扣心。
* **場景規格與精確單字槽位**：
  * **主題**：日本京都花見小路與職人小鎮（1376×768 3D 立體紙雕 diorama）。
  * **8 大相異目標與幾何槽位**：
    1. `cup` (茶杯，`x: 146, y: 595, rx: 58, ry: 48`)：茶屋木長凳托盤上的白瓷茶杯轉為綠釉抹茶陶杯。
    2. `bed` (榻榻米床鋪，`x: 318, y: 230, rx: 115, ry: 52`)：町家二樓臥室日式榻榻米布團轉為木床架被褥。
    3. `umbrella` (和傘，`x: 468, y: 536, rx: 118, ry: 78`)：戶外歇腳處展開之大紅番傘轉為金黃油紙傘。
    4. `doll` (博多人偶，`x: 583, y: 422, rx: 48, ry: 72`)：街角日式展示木櫃內精緻和服娃娃轉為木芥子娃娃。
    5. `fish` (錦鯉，`x: 910, y: 694, rx: 72, ry: 38`)：右下方石疊步道旁清澈錦鯉池紅白錦鯉轉為金黃錦鯉。
    6. `fan` (京折扇，`x: 1072, y: 432, rx: 88, ry: 48`)：右側工藝品攤位展示架金箔折扇轉為櫻花折扇。
    7. `bird` (白腹琉璃，`x: 1231, y: 141, rx: 78, ry: 68`)：右上方木造町家屋簷櫻花枝頭棲息之小鳥羽色與動態轉換。
    8. `box` (桐木手作工藝盒，`x: 1277, y: 531, rx: 78, ry: 58`)：右下石台展示之原色桐木盒轉為深黑漆器彩繪錦盒。
  * **兩兩空間零交疊檢驗**：8 處目標分佈於不同景深與方位，最小間距為 umbrella 與 doll（162px），全場景交疊數嚴格為 0。
* **羽化透明補丁生成與實裝**：
  * 透過 Sharp 批次擷取 8 處羽化邊緣 PNG 透明補丁（`public/assets/spotter/patches/b2_s2/`）。
  * `SpotterScene.jsx` 升級支援動態 Slot 渲染：左圖使用底圖，右圖以相同底圖為基底，僅針對本局隨機抽中的 5 個有效目標疊加羽化補丁，未選中的 3 個目標與周圍所有背景在左右兩圖完全一致（相同型態 A）。
* **QA 檢驗工作台升級**：
  * `/spotter-test` 支援 Book 2 圖 1 與圖 2 切換。
  * 生成 8 組 650×276 高解析單字顯微對比卡（`public/assets/spotter/crops/b2_s2/`）與全幅判定框對照圖。
  * 藍圖總覽（Master Roadmap）更新 Book 2 Scene 2 為「⚡ 動態 Slot 實裝就緒」。

#### 20. 鷹眼神探 第 2 冊場景 2【京都職人小鎮】變異型態 Variant B 與 C 擴充實裝 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與專案負責人 Mark 工作流規範**：
  * 遵照 Mark 指示：「變異型態 BCD 等可以一次出完，因為這樣符合同一張底圖的工作流。但若該位置變化不適合 CDE 或不適合 BD 就不用勉強，不是每個物品都一定要四五種變化」。
  * 自然篩選 7 處具備高品質 Variant C 的目標（茶杯、和傘、人偶、錦鯉、折扇、小鳥、點心盒），而 2F 和室床鋪（bed）換至櫻粉櫻花和室被鋪後即維持最和諧飽滿狀態，不勉強湊第 4 種，兼顧藝術協調與單元教學自然度。
* **全新擴充變異補丁與型態清單**：
  1. `cup` (茶杯)：
     * Base: 白瓷茶杯 $\to$ Var A: 綠釉抹茶陶杯 $\to$ Var B: 朱紅漆器茶托杯 $\to$ Var C: 紫砂陶茶杯。
  2. `bed` (榻榻米床鋪)：
     * Base: 暖黃藺草蓆被鋪 $\to$ Var A: 青藍浪紋日式被鋪 $\to$ Var B: 櫻粉櫻花棉褥和室被鋪 (自然 3 型態)。
  3. `umbrella` (和傘)：
     * Base: 緋紅蛇目油紙傘 $\to$ Var A: 紫羅蘭碎花和傘 $\to$ Var B: 陽光金黃節慶和傘 $\to$ Var C: 青竹翠綠和傘。
  4. `doll` (木芥子人偶)：
     * Base: 紅色和服木芥子 $\to$ Var A: 藍條紋鳴子人偶 $\to$ Var B: 招財貓木雕人偶 $\to$ Var C: 金黃達摩吉祥木偶。
  5. `fish` (錦鯉)：
     * Base: 紅白相間錦鯉 $\to$ Var A: 水墨黑白斑紋錦鯉 $\to$ Var B: 金黃招財黃金錦鯉 $\to$ Var C: 碧藍錦鯉與翠綠荷葉。
  6. `fan` (摺扇)：
     * Base: 櫻花金箔摺扇 $\to$ Var A: 富士山青藍摺扇 $\to$ Var B: 秋季金黃銀杏圓團扇 $\to$ Var C: 素雅紫藤水墨摺扇。
  7. `bird` (小鳥)：
     * Base: 翠綠枝頭小雀鳥 $\to$ Var A: 雪白灰羽小鳥 $\to$ Var B: 暖橘紅喉知更鳥 $\to$ Var C: 靛藍琉璃鳥。
  8. `box` (點心盒)：
     * Base: 原色桐木工藝盒 $\to$ Var A: 黑漆描金點心盒 $\to$ Var B: 朱紅櫻花禮品盒 $\to$ Var C: 雙層竹編精緻點心籠。
* **工作台多型態交互檢視支援 (`SpotterTestWorkbench.jsx`)**：
  * **模式 1 (全幅雙圖對照)**：右上角提供「變異 A / 變異 B / 變異 C」切換膠囊，一鍵切換整幅成對變異全圖。
  * **模式 2 (顯微驗收矩陣)**：
    * 頂部提供全域「批次切換型態：變異 A / 變異 B / 變異 C」一鍵同步。
    * 每張單字卡獨立提供 `[Base]`、`[Var A]`、`[Var B]`、`[Var C]` 互動切換膠囊，點選可立即檢視該變異型態的高解析裁切對比圖與詳細變異描述。
  * **模式 3 (動態 8 選 5 抽題模擬器)**：
    * 每次隨機抽題時，抽中的 5 個目標自動從其已就緒的變異補丁庫（Var A、Var B、Var C）中隨機分派型態，並即時於目標清單標註（如 `茶杯 (變異 B • 朱紅漆器茶托杯)`），達成上百種排列組合之動態體驗。
* **測試與驗證**：
  * 全套 15 款羽化透明補丁（`public/assets/spotter/patches/b2_s2/`）與對應對照卡全數生成就緒。
  * `npm run lint` 0 錯誤、`npm run build` 通過、`scripts/smoke_test.mjs`（14 款遊戲 4 身分）與 `test_spotter_workbench.mjs` 均 100% 通過。

#### 21. 鷹眼神探 第 3 冊場景 2【瑞士阿爾卑斯湖畔與木屋野餐台】A 方案動態 8 選 5 多型態 (Var A/B/C) 全量實裝與校準 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與課綱單字配置**：
  * 遵照 Mark 規範與「同一底圖工作流一次出完自然不勉強」原則，推進 Here We Go 第 3 冊（四年級上學期）場景 2。
  * **主題**：瑞士阿爾卑斯湖畔與木屋野餐台（Swiss Alpine Lake & Chalet Picnic Terrace，1376×768 3D 立體紙雕 diorama）。
  * **8 大相異目標（100% 符合第 3 冊課綱核心單字，經 Mark 指導完成二度精準校準）**：
    1. `cloud` (白雲，`x: 410, y: 100, rx: 110, ry: 65`)：
       * 原圖雲朵位於中央偏左山巔。Mark 裁示將判定框往右移統一覆蓋白雲，並將變異 A 之彩虹徹底移除，改為前後兩層立體疊加白雲。
       * Base: 單層棉花白雲 $\to$ Var A: 前後雙層疊加白雲 (無彩虹) $\to$ Var B: 夕陽金霞雲 $\to$ Var C: 愛心夢幻雲。
    2. `milk` (牛奶，`x: 124, y: 493, rx: 50, ry: 75`)：Base 玻璃奶瓶 $\to$ Var A: 藍白紙盒牛奶 $\to$ Var B: 肉桂熱牛奶 $\to$ Var C: 吸管隨行杯。
    3. `tea` (茶，`x: 440, y: 584, rx: 75, ry: 58`)：Base 琥珀熱紅茶 $\to$ Var A: 薄荷綠茶杯 $\to$ Var B: 黃檸檬冰茶 $\to$ Var C: 茶包馬克杯。
    4. `sandwich` (三明治，`x: 648, y: 553, rx: 72, ry: 52`)：Base 雙層三明治 $\to$ Var A: 法式潛艇堡 $\to$ Var B: 火腿可頌堡 $\to$ Var C: 芝麻貝果堡。
    5. `rice` (飯糰，`x: 820, y: 553, rx: 58, ry: 52`)：Base 海苔三角飯糰 $\to$ Var A: 櫻花醃漬飯糰 $\to$ Var B: 瓷碗香米飯 $\to$ Var C: 醬油烤飯糰。
    6. `watermelon` (西瓜，`x: 980, y: 625, rx: 90, ry: 80`)：
       * 校正原誤植之草叢花叢座標，精準框定右側木長凳白瓷盤上的西瓜。
       * Base: 紅肉切片西瓜 $\to$ Var A: 金黃小玉切片西瓜 $\to$ Var B: 條紋完整西瓜 $\to$ Var C: 薄荷西瓜切塊。
    7. `water` (水壺，`x: 1228, y: 468, rx: 48, ry: 80`)：Base 玻璃冷水壺 $\to$ Var A: 金屬保溫水壺 $\to$ Var B: 高腳氣泡水杯 $\to$ Var C: 刻度運動水瓶。
    8. `orange` (柳橙，`x: 1240, y: 680, rx: 90, ry: 60`)：
       * 校正原誤疊至長凳西瓜之座標，精準框定右下方木棧露台木碗中的柳橙。
       * Base: 鮮採綠葉甜橙 $\to$ Var A: 晶透切片輪盤 $\to$ Var B: 剝開飽滿橙瓣 $\to$ Var C: 編籃黃金大橙。
  * **兩兩空間零交疊檢驗**：8 物件 28 組對距全部經過嚴格幾何演算法驗證，最小淨間距 $\ge 30$px，總交疊數嚴格為 0。
* **動態合成與工作台支援**：
  * 生成全套 24 款羽化透明 PNG 補丁（`public/assets/spotter/patches/b3_s2/`）與高解析裁切對比卡（`public/assets/spotter/crops/b3_s2/`）。
  * 生成全幅標籤判定外框圖（`book3_scene2_side_by_side_boxes.jpg`、`_varb.jpg`、`_varc.jpg`）。
  * 工作台（`/spotter-test`）支援第 3 冊圖 1 與圖 2 切換、全幅成對變異底圖切換、顯微矩陣多型態卡片互動切換、以及動態 8 選 5 抽題模擬器。
  * 藍圖總覽（Master Roadmap）更新進度為「11 場景已就緒 / 29 場景排程中」。
* **景深層次與物件分布空間架構原則 (Mark 指導原則)**：
  * **反思與洞見**：Mark 指出大景深構圖中，若所有目標物件過度集中在前景平台（露台桌椅），會導致「天上物件無遮蔽、前景過密、中景空泛」。
  * **後續新圖規範 (自 Book 4 Scene 2 起實施)**：構圖前預先規劃「三層景深停靠點（Foreground / Midground / Background Depth Anchors）」，例如街景之近景長椅/路燈、中景商店櫥窗/巴士車窗/遮雨棚、遠景鐘樓/摩天輪/橋纜，讓 8 個物件自然錯落分布於不同景深層次，兼具視覺平衡、故事性與解謎樂趣。

#### 22. 鷹眼神探 第 4 冊場景 2【倫敦泰晤士河畔與皇家地標公園街景】A 方案動態 8 選 5 多型態 (Var A/B/C) 全量實裝與三層景深架構實踐 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **背景與課綱單字配置**：
  * 貫徹 Mark 指導之「近、中、遠三層景深空間架構原則」，成功打破前代全部集中在前景平台的侷限。
  * **主題**：倫敦泰晤士河畔與皇家地標公園街景（London Thames Riverside & Royal Landmark Plaza，1376×768 3D 立體紙雕 diorama）。
  * **8 大相異目標（100% 符合第 4 冊課綱核心單字，依三層景深自然停靠，零交疊零死角）**：
    1. **前景層 (Foreground)**：
       * `chair` (椅子，`x: 185, y: 598, rx: 140, ry: 110`)：Base 墨綠英倫長椅 $\to$ Var A: 白色維多利亞鐵藝雕花椅 $\to$ Var B: 暖木色實木單人椅佐蘇格蘭格紋軟墊 $\to$ Var C: 熱情亮紅街角咖啡館金屬椅。
       * `table` (桌子，`x: 635, y: 620, rx: 80, ry: 90`)：Base 原木咖啡圓桌 $\to$ Var A: 白色波浪蕾絲桌巾 $\to$ Var B: 彩色地中海馬賽克瓷磚拼花六角桌 $\to$ Var C: 原木風粗獷方型野餐實木小桌。
       * `bag` (提包，`x: 890, y: 635, rx: 85, ry: 85`)：Base 焦糖皮質公事包 $\to$ Var A: 橄欖綠帆布休閒後背包 $\to$ Var B: 海軍藍深紅英式硬挺學生雙肩包 $\to$ Var C: 復古刺繡提花大容量托特包。
       * `basket` (提籃，`x: 1210, y: 645, rx: 100, ry: 90`)：Base 蜂蜜色藤編野餐籃 $\to$ Var A: 盛滿薰衣草與玫瑰白鐵絲花籃 $\to$ Var B: 裝滿鮮紅蘋果與香酥英式糕點深褐色藤籃 $\to$ Var C: 原色竹編圓弧提把野餐購物提籃。
    2. **中景層 (Midground)**：
       * `hat` (帽子，`x: 383, y: 219, rx: 65, ry: 80`)：Base 路燈臂黑色圓頂禮帽 $\to$ Var A: 金棕毛呢獵鹿帽 $\to$ Var B: 米白平頂草帽佐海軍藍緞帶 $\to$ Var C: 深墨綠針織圓頂禮帽佐羽毛。
       * `bus` (公車，`x: 540, y: 322, rx: 115, ry: 80`)：Base 經典紅雙層巴士 $\to$ Var A: 皇家海軍藍觀光巴士 $\to$ Var B: 復古奶油白與酒紅雙層敞篷巴士 $\to$ Var C: 銀亮金屬流線雙層油電巴士。
       * `box` (禮盒，`x: 885, y: 382, rx: 90, ry: 70`)：Base 石欄基座紫色金緞帶禮盒 $\to$ Var A: 英倫花草彩繪鐵盒茶罐 $\to$ Var B: 溫潤紅木雕花珠寶盒佐黃銅鎖扣 $\to$ Var C: 亮麗英國米字旗彩繪金屬紀念盒。
    3. **遠景層 (Background)**：
       * `clock` (時鐘，`x: 1147, y: 153, rx: 75, ry: 75`)：Base 遠景大笨鐘金色羅馬鐘面 $\to$ Var A: 珍珠白簡約夜光鐘面 $\to$ Var B: 維多利亞墨綠底金漆花絲古典鐘面 $\to$ Var C: 夕陽暖橘金色背光三點鐘下午茶鐘面。
  * **精確像素差分與零交疊驗證**：8 目標 28 組兩兩外圍間距全部為正數，總交疊數為 0 (`TOTAL OVERLAPS: 0`)。
* **動態合成與工作台支援**：
  * 生成全套 24 款羽化透明 PNG 補丁（`public/assets/spotter/patches/b4_s2/`）與清晰 650x276 雙聯特寫對比卡（`public/assets/spotter/crops/b4_s2/`）。
  * 生成全幅標籤判定外框圖（`book4_scene2_side_by_side_boxes.jpg`、`_varb.jpg`、`_varc.jpg`）。
  * 工作台（`/spotter-test`）支援第 4 冊圖 1（英倫家居）與圖 2（泰晤士皇家地標廣場）快速切換、成對底圖與動態 8 選 5 抽題模擬器。
  * 藍圖總覽（Master Roadmap）更新進度為「12 場景已就緒 / 28 場景排程中」。

#### 23. 找不同高階繪圖規範確立：已學單字全環境融入與真實視覺干擾物架構 (Mark 指導原則) 及 Vercel 部署禁令
* **核心遊戲性缺陷反思 (Mark 深度指導)**：
  * Mark 指出：若畫面中「除了欲測的 8 個單字外，完全沒有其他可辨識之單字物件」，學生只要照著單字庫把畫面上僅有的 8 個東西各點一遍即通關，失去「找不同」的搜索與細部比對精神。尤其在四、五、六年級中高年級教材中，缺乏足夠的細節與干擾物，無法體現「鷹眼神探」的探索價值。
* **高階繪圖新規範 (自後續新圖起全面落實)**：
  1. **全單字庫背景融入 (15～25 個背景靜態已學物件)**：
     * 畫面構圖時，必須將學生已經學過的單元（包含本冊其他單元以及**所有前冊**單字，如低年級學過的 `dog`, `cat`, `bird`, `apple`, `book`, `pencil`, `bike`, `umbrella`, `boat`, `tree`, `flower`, `ball` 等）作為自然景物畫入背景。
     * 這些背景物件在左右兩圖**完全靜態、左右保持 100% 相同像素（不發生變異）**。
  2. **真實可見的干擾選項 (Real Visible Distractors)**：
     * Word Bank 提供的干擾單字（Distractors）不再是畫面中不存在的單字，而是學生**在畫面上確實能看見該物體、但仔細比對後發現左右完全相同**的已學單字。
     * 學生必須同時進行「視覺搜索＋單字對應＋微觀比對」，徹底杜絕「看字點物」的無腦通關現象。
* **Vercel 推送禁令生效**：
  * 因 Vercel Hobby 方案構建額度有限，日常微調頻繁推送容易導致配額耗盡。正式確立：**日常開發嚴格禁止執行 `git push vercel`**，所有發布與構建一律由 Cloudflare Pages (`origin/main`) 承載；僅在重大里程碑經 Mark 裁示時方可推送 Vercel。

#### 24. 鷹眼神探 第 5 冊場景 2【巴黎蒙馬特小丘畫家村與聖心堂露天咖啡街】A 方案動態 8 選 5 多型態 (Var A/B/C) 全量實裝與單字普及覆蓋率實踐 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **單字範圍權威準則與涵蓋率審查 (Mark 指導原則)**：
  * **最高選詞準則**：
    1. **必出現範圍**：翰林《Here We Go》第 1～8 冊教材核心單字。
    2. **可出現、可練習範圍**：教育部國民中小學基本 1,200 核心單字。
    3. **超出規範者嚴禁入題**：原暫訂之高中級別字 `palette`（調色盤）經 Mark 指示正名汰除，完美替換為教育部 1,200 核心單字 **`brush`（畫筆）**。
  * 全面清查既有場景目標字頻率，淘汰高頻重複詞（如 `bird` 4次, `umbrella` 4次, `bag` 3次），保留其作為真實靜態背景。
  * 精選 8 大五年級藝文、活動與生活核心欲測單字，歷史平均出題次數降至 **0.88 次**：
    - `brush` (畫筆, 0 次初登場，教育部 1200 核心字)
    - `guitar` (木吉他, 0 次初登場)
    - `bell` (銅鐘, 0 次初登場)
    - `camera` (相機, 1 次)
    - `painting` (畫作, 1 次)
    - `bread` (長棍麵包, 1 次)
    - `flag` (法國三色旗, 1 次)
    - `cake` (法式蛋糕, 2 次)
* **16 個 100% 靜態背景干擾單字融入（真實世界剪影，拒絕生硬風箏）**：
  * `cat` (黑貓), `dog` (法鬥), `bike`, `book`, `cup`, `flower`, `tree`, `car` (雪鐵龍 2CV), `chair`, `table`, `bag`, `lamp`, `bird` (白鴿), `apple`, `clock`, `umbrella`。
  * 左右圖在非欲測區完全靜態，100% 像元鎖定不變。
* **三大多態變異 (Variants A / B / C) 與 24 羽化補丁全量產出**：
  * 產出 `book5_scene2_base.jpg`, `book5_scene2_diff.jpg`, `book5_scene2_diff_varb.jpg`, `book5_scene2_diff_varc.jpg` (1376x768)。
  * 產出 24 個透明羽化 PNG 補丁 (`public/assets/spotter/patches/b5_s2/`) 與 24 張特寫比較卡 (`public/assets/spotter/crops/b5_s2/`)。
* **判定框精密校準（Mark 深度驗收反饋）**：
  * 遵照 Mark 指導：「畫架的判定框再低一些，要含括整個畫布。其餘均通過。」
  * `painting` 判定框精準下調並延伸垂直半徑：由 `(x: 765, y: 385, rx: 70, ry: 100)` 調整為 `(x: 765, y: 415, rx: 78, ry: 115)`，頂部至 `y = 300`、底部延伸至 `y = 530`，將整個畫布本體與下方木畫架托架完整涵蓋，徹底避免學生點擊畫作下緣判定無效之情形。
* **幾何驗證零交疊**：
  * 全數 28 對幾何距離均維持正距，`painting` 與下方大理石桌上的 `cake` 垂直淨距保持 50.3px，全圖最小間隙為 24.9px (`guitar` <-> `brush`)，Total Overlaps = 0 / 28 pairs。
* **進度里程碑**：
  * 累積就緒關卡達到 **13 / 40**！
  * B5S2（巴黎蒙馬特小丘畫家村）經 Mark 審查全項通過！

#### 25. 鷹眼神探 第 6 冊場景 2【新加坡濱海灣花園超級樹與戶外美食步道】A 方案動態 8 選 5 實裝與下輪交接規範儲備 (`spotterData.js`, `SpotterTestWorkbench.jsx`, `public/assets/spotter/*`)
* **單字選用最高權威階層規範 (Mark 確立之最高準則)**：
  1. **必出現範圍 (Mandatory Scope - 首選題目)**：翰林《Here We Go》第 1～8 冊教材核心單字。
  2. **可出現、可練習範圍 (Permissible Scope - 次選題目)**：教育部國民中小學基本 1,200 核心單字。
  3. **超綱詞彙嚴格禁令**：超出教育部 1,200 字與 Here We Go 教材之高中、成人或專門領域單字（如原暫訂之 palette），一律禁止作為題目！
* **找不同繪圖與遊戲性高階規範 (Mark 核心指導原則)**：
  1. **拒絕「看字點物」**：整張圖絕不能只有 8 個目標物。必須將學生已學過的單元（包含本冊與前冊 15～25 個單字）作為自然景物畫入背景。
  2. **真實可見的靜態干擾物 (Real Visible Distractors)**：左右兩圖的背景物件保持 100% 相同像元（絕對不發生變異）。Word Bank 的干擾選項必須是畫面中真實存在的背景物件，迫使學生同時進行視覺搜索、單字對應與細節比對。
  3. **自然三層景深錨定 (Foreground / Midground / Background)**：避免物件過度集中在前景平台，遠景地標/天空、中景建築/車輛/雕塑、近景桌椅/道具錯落有致。
  4. **因地制宜、真實世界剪影 (Diegetic Realism)**：道具必須契合地景故事，絕不在不合理場景硬塞風箏或紙箱。
  5. **場景特例規範**：博物館展館內嚴格禁止畫食物 (`No food inside museum`)。
* **第 6 冊場景 2 主題與目標配置（方案 A：新加坡超級樹與戶外美食步道）**：
  * **主題**：新加坡濱海灣花園超級樹與戶外美食步道 (Singapore Gardens by the Bay & Waterfront Promenade，1376x768 3D 立體紙雕 diorama)。
  * **課本出處**：Book 6 Unit 3（食物與渴餓：`noodles`, `soup`, `salad`, `water`）＋ Culture Explore（新加坡超級樹 Supertrees、魚尾獅 Merlion）。
  * **8 大相異目標物（100% 符 Here We Go 6 或教育部 1200 字）**：
    1. **前景層**：`noodles` (麵條，B6 U3)、`salad` (沙拉，B6 U3)、`soup` (熱湯，B6 U3)、`water` (隨身水瓶，B6 U3)、`fan` (手持小風扇，熱帶避暑必備，教育部 1200 字)。
    2. **中景層**：`statue` (噴水魚尾獅雕像，B6 探索單元)、`boat` (觀光遊船/復古駁船，教育部 1200 字)、`tree` (熱帶雞蛋花樹/超級樹，B6 U3)。
  * **16 個完全靜態背景已學干擾物**：
    * `bird`, `cat`, `dog`, `bike`, `cup`, `table`, `chair`, `bag`, `lamp`, `bridge`, `clock`, `flower`, `umbrella`, `box`, `apple`, `book`。
* **未來方案儲備庫（留待下一輪討論之候選企劃）**：
  * **【方案 B：肯亞馬賽馬拉非洲大草原探險營地 (Kenya Safari Camp)】**：
    * **課本對應**：Book 6 Unit 4（野生動物與冒險：斑馬、大象、午餐炸雞、後背包、太陽眼鏡掉落情節）＋ Culture Explore（肯亞非洲大五霸）。
    * **核心目標單字**：`zebra` (斑馬), `chicken` (烤雞), `sunglasses` (墨鏡), `backpack` (登山包), `tent` (帳篷), `jeep/truck` (越野車), `hat` (探險帽), `lion` (獅子)。
    * **靜態背景物**：金合歡樹、犀鳥、遠景大象、野營折疊桌、導演椅、露營鋼杯、望遠鏡、煤油營燈。
  * **【Book 7 候選方案：威尼斯水都大運河貢多拉與聖馬可廣場 (Venice Grand Canal)】**：
    * 對應教材：Book 7 Unit 1~4（交通工具、旅行明信片、相機、地圖）。
  * **【Book 8 候選方案：紐約中央公園與時代廣場畢業旅行 (New York Central Park)】**：
    * 對應教材：Book 8 Unit 1~4（四季、畢業、活動、城市生活）。

#### 26. 鷹眼神探 本冊核心單字出題本位主義與全景背景豐富化規範 (Mark 核心指導原則)
* **本冊單字出題本位主義 (True Within-Book Testing Principle)**：
  * **有效出題定義**：該冊單字必須在該冊找不同單元遊戲中以相異目標出現，才算達成有效涵蓋。
  * **杜絕跨冊充數**：絕不能將某冊單字分散在其他冊次出現，就視為該單元已出題過。
  * **跨冊出現之教育意義**：某單字若跨冊出現在其他冊次中，代表其為「高頻核心學習單字」（如生活高頻字），但其原生冊次仍負有在該冊找不同遊戲中涵蓋與驗收的教學責任。
  * **第三圖 (Round 3) 規劃準則**：往後進入下一輪第 3 場景規劃時，必須嚴謹審酌該冊單字是否已在本冊範圍內盡量含括並充分出題。
* **全景背景豐富化與真實視覺干擾 (Avoid Sparse 8-Object Scenes)**：
  * 學過的單字以及先前較少登場的單字，均應大量自然融入作為背景景物，堅決避免全圖「只有 8 個物件」的稀疏感。
  * 這些背景物件在左右兩圖 **100% 保持相同像素（絕對不變異）**，並作為 Word Bank 干擾選項，迫使學生進行高階視覺搜索與細微比對。
* **第 7 冊場景 2 確立配置（方案 A：都會現代捷運轉運站與景觀大道）**：
  * **8 大欲測目標（100% 第 7 冊原生單字，全部 0 次初登場，杜絕 clock, camera, flower, fan, bus, bag）**：
    1. `metro`（高架捷運列車 / 現代地鐵車廂，B7 U2）
    2. `taxi`（計程車，B7 U2）
    3. `car`（自用休旅車，B7 U2）
    4. `scooter`（機車 / 速克達，B7 U2）
    5. `bike`（自行車 / 共享單車站架，B7 U2）
    6. `ticket`（自動售票機出票口捷運車票 / 票卡，B7 U2/U3 & 教育部1200）
    7. `sandwich`（露天轉運吧台切片三明治，B7 Starter）
    8. `soda`（吧台蘇打汽水瓶，B7 Starter）
  * **18 個 100% 靜態背景干擾單字融入**：
    * `dog`（導盲柴犬）、`cat`（街角長椅貓咪）、`bird`（廣場白鴿）、`tree`（林蔭路樹）、`chair`（長椅）、`table`（吧台咖啡桌）、`lamp`（太陽能街燈）、`umbrella`（遮陽傘）、`backpack`（旅客背包）、`book`（閱讀書本）、`cup`（咖啡紙杯）、`clock`（轉運站時鐘）、`box`（木箱）、`ball`（草坪球類）、`apple`（水果籃蘋果）、`hat`（遮陽帽）、`bridge`（天橋）、`map`（導覽地圖看板）。
  * **全目標判定座標與幾何（Mark 校驗定案）**：
    * `metro`: `x: 423, y: 185, rx: 258, ry: 40, rotate: 4.8`（配合高架軌道 4.8° 斜度，以寬扁旋轉橢圓含括全列 3 節車廂，端到端 516px 完美貼合）
    * `taxi`: `x: 650, y: 405, rx: 75, ry: 45`（轉運車道計程車）
    * `car`: `x: 940, y: 435, rx: 88, ry: 80`（右側車道休旅/電動車，往上擴大完整含括車頂行李架與全車身）
    * `scooter`: `x: 1205, y: 460, rx: 68, ry: 60`（右側路旁機車）
    * `bike`: `x: 560, y: 550, rx: 72, ry: 82`（中央廣場共享單車，往上擴大完整含括手把與車籃）
    * `ticket`: `x: 350, y: 470, rx: 24, ry: 22`（售票機票卡）
    * `sandwich`: `x: 250, y: 655, rx: 46, ry: 30`（轉運吧台切片三明治）
    * `soda`: `x: 340, y: 585, rx: 32, ry: 78`（吧台氣泡汽水瓶，上下擴大含括整瓶汽水吸管與底座，與三明治維持 38px 零重疊淨空間）
    * **幾何防重疊驗證**：28 對兩兩目標外緣間距 $\ge 16.8$px（sandwich 與 soda 間隙 38.0px），總重疊數為 **0**。
    * **動態羽化圖層 (Method A)**：由 `scripts/build_b7_s2_assets.cjs` 產生 24 款透明 PNG 羽化補丁，支援旋轉橢圓遮罩，基準靜態背景 100% 絕對一致。同時輸出無標籤版比對圖（`book7_scene2_clean_boxes.jpg`）。

#### 27. 第 8 冊場景 2 確立配置（紐約第五大道時尚名店街）與情境協調反硬塞原則
* **情境協調與反硬塞原則 (Organic Context Harmony Principle - Mark 核心指示)**：
  * **拒絕機械式湊單字**：靜態背景干擾單字必須嚴格服膺於場景自然世界觀與環境邏輯，絕不為了強湊單字而讓不協調的物件（如頂級名店街硬放流浪貓狗或農場物品）為出現而出現。
  * **第五大道自然背景單字**：挑選 14 個 100% 契合紐約精品大道與露天咖啡座的已學單字：`taxi`（黃色計程車）、`car`（黑轎車）、`bus`（觀光巴士）、`gift`（精品禮物盒）、`box`（鞋履收納盒）、`bag`（精品手提袋）、`chair`（法式咖啡椅）、`table`（大理石圓桌）、`lamp`（古典黑鐵街燈）、`umbrella`（咖啡座遮陽傘）、`tree`（林蔭景觀盆景）、`cup`（骨瓷咖啡杯）、`clock`（街角名牌立鐘）、`book`（時尚精裝雜誌）。徹底剔除貓狗等突兀動物。
* **8 大相異目標（100% 第 8 冊原生單字，依據 Mark 指示完成精確校準，全部 0 次初登場）**：
  1. `suit`：`x: 280, y: 305, rx: 75, ry: 130`（左側櫥窗西裝人台，上下左右大幅擴展包覆整件深藍西裝領口、袖管與下擺）
  2. `jacket`：`x: 500, y: 365, rx: 85, ry: 120`（立架皮夾克，大幅擴大包覆整件棕色飛行夾克羊羔毛大翻領、左右袖管與拉鍊）
  3. `skirt`：`x: 140, y: 440, rx: 70, ry: 115`（左側人台粉色百褶裙，大幅往上延伸至腰際並往左擴大包覆整件百褶裙裙擺）
  4. `T-shirt`：`x: 235, y: 565, rx: 70, ry: 45`（展示木桌短袖 T 恤，Mark 裁示將辨識度低的摺疊牛仔褲升級為經典短袖 T 恤，Base 為純白設計師 T 恤，Var A/B/C 分別為加州衝浪橘色印花、巴黎水手橫條紋、復古學院墨綠徽章，辨識度 100%）
  5. `blanket`：`x: 815, y: 515, rx: 70, ry: 105`（校準定位至露天咖啡椅背，包覆整件英倫紅黑格紋流蘇毛毯）
  6. `glass`：`x: 958, y: 565, rx: 32, ry: 65`（校準往右平移至露天大理石桌，精準框住整只透明八角冰晶長飲杯）
  7. `toast`：`x: 1085, y: 610, rx: 80, ry: 50`（校準定位至大理石桌餐盤，完整框住整盤金黃烤吐司與奶油邊緣）
  8. `peach`：`x: 1170, y: 505, rx: 45, ry: 55`（校準定位至右方金色甜點高腳托盤，精準框住整顆粉嫩鮮採水蜜桃與綠葉）
* **幾何防重疊驗證**：全部 28 對兩兩目標外緣淨間距 $\ge 15.7$px（skirt 與 jeans 間隙 15.7px，suit 與 skirt 間隙 19.6px），**總重疊數：0**。
* **動態圖層羽化補丁 (Method A)**：由 `scripts/build_b8_s2_assets.cjs` 產生 24 款透明 PNG 羽化補丁，基準靜態背景 100% 絕對一致。同時輸出純淨校準對比圖（`book8_scene2_clean_boxes.jpg`）。
* **全系列 1~8 冊第 2 場景完成度**：**16 / 40 場景全面就緒（達成率 40%）**！

#### 28. 鷹眼神探 第 2 冊場景 2【舊金山漁人碼頭 Pier 39 工藝廣場】8 大核心單字判定框微調與 Variant A/B/C 全量實裝 (`spotterData.js`, `public/assets/spotter/patches/b2_s2/*`)
* **單字配置（100% 符合 Here We Go 第 2 冊五級金字塔）**：
  * Unit 4 六大職業：`cook` (廚師), `driver` (司機), `doctor` (醫生), `nurse` (護理師), `teacher` (教師), `student` (學生)。
  * Unit 2 動作字：`draw` (寫生畫畫) ＋ Phonics 具象字：`pot` (料理鍋)。
* **Mark 老師驗收微調定位（防止干擾誘使誤點、零重疊完美包覆）**：
  1. `draw` (`x: 118, y: 545, rx: 58, ry: 68`)：縮小至畫布本身，嚴格避開右側椅子上的調色盤，防止椅子調色盤變化誘使學生誤點。
  2. `cook` (`x: 274, y: 495, rx: 46, ry: 155`)：窄身貼合廚師白帽頂至鞋底，完全不包到左側椅子與調色盤，亦不與桌上鍋子重疊。
  3. `pot` (`x: 382, y: 516, rx: 46, ry: 44`)：往右上移至木桌料理鍋正中央，完整包覆鍋蓋、雙耳與鍋底，與廚師分離零沾染。
  4. `doctor` (`x: 562, y: 462, rx: 58, ry: 118`)：往右上移完美包覆小熊醫生全身。
  5. `nurse` (`x: 702, y: 448, rx: 54, ry: 122`)：往右上移完美包覆兔子護理師長耳至全身。
  6. `driver` (`x: 915, y: 245, rx: 60, ry: 72`)：移至噹噹車司機本體、位於教師正上方處，與教師保留安全垂直間距。
  7. `teacher` (`x: 928, y: 458, rx: 72, ry: 112`)：壓低高度留空間給上方司機，並往右擴張把導覽旗尾完整包覆。
  8. `student` (`x: 804, y: 528, rx: 48, ry: 95`)：位於小學生本體，與左方護士、右方教師完全零交疊。
* **24 款局部羽化透明補丁**：嚴格遵循鐵律 6，以 Base 圖為唯一底板合成 `book2_scene2_diff.jpg`、`_varb.jpg`、`_varc.jpg`（非目標背景 100% 像素鎖定不變）。

#### 29. 學生金幣與探索積分雲端雙軌漫遊、歷史資料復原與學期制封存 (`src/services/supabase.js`, `src/utils/semesterHelper.js`, `src/context/StudentContext.jsx`)
* **Supabase 專案歸屬確認**：位於 `liguyt@wutps.ptc.edu.tw` 帳號下（Project ID: `fqkdkmcqjswufzbvkram`）。
* **雙軌雲端漫遊與無衝突聯集融合（Union Merge）**：
  * 系統同時讀寫 `student_profiles` 資料表與 `leaderboard (mode = 'profile-sync')` 備份軌。
  * 在 `fetchStudentProfile`、`fetchMonopolyLeaderboard` 與 `fetchQuestPointsLeaderboard` 中自動執行聯集融合，對同一學號永遠取最高金幣 (`Math.max`) 與最高探索積分，兩軌自動互補、絕不打架。
* **整學期保留與跨學期榮譽封存（`semesterHelper.js`）**：
  * 台灣學期制自動判定（2/1～7/31 為下學期如 `114-2`；8/1～隔年1/31 為上學期如 `115-1`）。
  * 同一學期內無論版本怎麼更新或換平板登入，金幣與積分 100% 保留；跨學期時自動將舊學期紀錄封存至 `semester_history`。

#### 30. 貪食蛇操控、經典測驗開局、多人連線對戰修復與 6 階段全自動防回歸守門員 (`scripts/smoke_test.mjs`)
* **貪食蛇轉向修復 (`SnakeGame.jsx`)**：在 `advanceOneStep` 內從 `inputQueueRef.current.shift()` 取出方向指令，打通鍵盤 (`Arrow*`/`WASD`)、虛擬十字鍵 (`onPointerDown` + `onClick`) 與滑動手勢。
* **經典選擇題與拼字開局防閃退 (`StandardQuiz.jsx`, `SpellingGame.jsx`)**：移除 `useEffect` 中在 `queue` 尚未非同步初始化完成時誤觸發的 `if (queue.length === 0) return onBack()`。
* **多人連線對戰與隕石防衛修復 (`BattleGame.jsx`, `MeteorGame.jsx`, `audio.js`)**：
  * 新增 `syncEvictChannel` 在加入/開立擂台前同步清除同名探測頻道，根治 `cannot add 'presence' callbacks after 'subscribe()'` 崩潰。
  * 在 `SoundEngine` (`src/services/audio.js`) 補齊 `powerUp()` / `powerup()` 合成音效，並將副作用移出 React `setState` updater，根治滿 50 分獲得地球護盾時的崩潰。
  * 移除對戰備戰室冗餘的「備戰中 / PIN 碼直接加入」頂部列並改為 `relative` 容器，徹底消除與全局 `<Header>` 重疊問題。
* **6 階段全自動防回歸測試套件 (`scripts/smoke_test.mjs`)**：加入靜態契約檢查與真實點擊/按鍵/開房 E2E 模擬，確保往後任何修改皆自動測遍 14 款遊戲。

#### 31. 星際記憶翻牌：奧林帕斯 8 大希臘眾神 TCG 收藏級原畫、3:4 比例、呼吸動效與 3D 旋轉神殿圖鑑 (`OlympianCardArt.jsx`, `PowerUpCodexModal.jsx`, `MemoryGameSingle.jsx`, `memoryThemes.js`)
* **12 款 Nano Banana 收藏級 TCG 美術切圖部署** (`public/assets/memory/*`):
  * 包含 8 大希臘眾神全幅高解析原畫（宙斯、雅典娜、博雷阿斯、普路托斯、赫菲斯托斯、阿波羅、赫利奧斯、雙子神）、2 款卡背（魯凱百合日之章、古老石板夜之章）、古典希臘金邊花紋羊皮紙單字卡底框、以及奧林帕斯星辰神殿牌桌原畫。
* **3:4 比例與無遮蔽呼吸微動效**：
  * 卡牌全面採用 3:4 瘦長黃金比例，在 iPad 與各尺寸螢幕上兼具視覺張力與整潔排版。
  * 引入 8 秒同步柔和金屬微流光與懸浮防頻閃微浮動，翻開後正面 100% 靜態高對比，零動態雜訊干擾學生閱讀。
* **奧林帕斯眾神圖鑑 3D 旋轉舞台與沙盒** (`PowerUpCodexModal.jsx`):
  * 3D 景深旋轉展示卡、支援左右觸控滑動、鍵盤方向鍵與宮格總覽雙模式。
  * 內建神力沙盒微縮實時動畫與希臘神話淵源典故。

#### 32. 記憶遊戲單人方案 A 落地：9 組單字 (18 張) + 2 張功能神卡 (2 張) = 20 張 4x5 網格 (`MemoryGameSingle.jsx`)
* **單人專屬牌組架構**：
  * 每局隨機抽選 9 組中英配對（18 張單字卡），並由單人 5 大神卡池（宙斯、雅典娜、普路托斯、阿波羅、赫利奧斯）隨機注入 2 張希臘神卡，構成 20 張平衡 4×5 牌陣。
* **完整實裝單人神力機制**：
  * ⚡ 宙斯：天雷配對一組單字並開啟 Bonus 回合。
  * 👁️ 雅典娜：黃金貓頭鷹私密透視 2 張暗牌 5 秒。
  * 🪙 普路托斯：黃金豐饒之角 10 秒接古希臘貓頭鷹金幣與翡翠聖石、躲避黑火炸彈小遊戲。
  * 💎 阿波羅：萬丈日輪賜福，現賺 +30 分暴擊。
  * 📡 赫利奧斯：全天穹微光透視全場 20 張暗牌 5 秒。
* **全屏神靈降臨動效 (`OlympianAwakeningStage`)**：翻開神卡瞬間觸發 1.35 秒全場神光降臨動畫，隨後定格為原畫。

#### 33. 密室逃脫全面整合至 5x2 iPad 一頁式整備室與舊頁面汰除 (`Lobby.jsx`, `VocabEscapeGame.jsx`)
* **告別獨立手風琴與重複 briefing 頁**：
  * 徹底移除舊版獨立分流手風琴與遊戲內重複選冊、舊版 5 年級按鈕的 `briefing` 頁面。
* **完美融入 5x2 整備室**：
  * 左側 1/4 靈魂大圖連動四大秘境（🏛️ 石板神廟、⛓️ 熔岩礦脈、🏺 法老古墓、🕰️ 殘破鐘樓）。
  * 第 1 層選冊（5x2）、第 2 層選單元、第 4 層選秘境，點擊「🚪 進入秘境 START」直接進入第 1 章三室解謎，達成 iPad 橫向一頁不捲動、只選一件事就下一頁的流暢體驗。

#### 34. 眾神神殿雙語語音中斷修復、超高對比度典故與結算卡片精巧化 (`PowerUpCodexModal.jsx`, `HonorSubmissionCard.jsx`)
* **語音切出/換卡即刻停止**：
  * 修正切出神殿後背景語音無法停止的 bug，在組件 Cleanup 與切換卡片時強制呼叫 `window.speechSynthesis.cancel()`。
  * 雙語自然依序報讀（先美語神名稱號，再中文典故與戰略），按鈕支援 `🔊 雙語朗讀` / `■ 停止報讀` 即時反饋切換。
* **超高對比度文字**：
  * 典故與說明換成 `text-white font-bold` 與亮金 `text-amber-300 font-black`，搭配半透明黑底背板，字字清晰銳利。
* **結算卡片榮譽成績單精緻化**：
  * 將「列印榮譽成績單」按鈕縮小為右上角精巧次要小標籤（`<Printer /> 成績單`），將 100% 焦點留給過關成績、金幣獎勵、留名字與「再玩一次 / 回大廳」，手機窄螢幕一頁呈現零捲動。

#### 35. 翻牌記憶選單極致精簡：中英同義整合、全域日夜自動切換與第 4 層移除 (`Lobby.jsx`, `MemoryGameSingle.jsx`)
* **中英配對同義整合**：
  * 翻牌記憶每對皆為 1 張英文 + 1 張中文，對稱翻開並無「中翻英」或「英翻中」差別，全面移除該冗餘選項。
* **卡背自動連動全域日夜狀態 (`isDark`)**：
  * 晨曦日間模式（`!isDark`）自動套用「☀️ 魯凱百合（日之章）」。
  * 星月夜景模式（`isDark`）自動套用「🌙 古老石板（夜之章）」。
  * 學生切換日夜模式即刻同步，整備室不需手動點選卡背。
* **全數移除翻牌記憶第 4 層玩法風格**：
  * 5x2 整備室只保留「第 1 層選冊（5x2）」與「第 2 層選單元」，垂直空間極致釋放，iPad 零捲動一站直達出征。
  * 眾神神殿於整備室標題列與底部出征按鈕旁皆配置醒目金光入口，遊戲內頂部 HUD 亦可隨時開展。

#### 36. 神山百步蛇一體化母圖重構、勻稱比例與二次貝茲圓角樣條運動 (`SnakeCanvas2D.jsx`, `snakeJungleTheme.js`)
* **一體化母圖同源設計 (`hundred_pace_snake_master_v2_1793708176210.jpg`)**：
  * 徹底告別過去頭、身、尾畫風不一的問題。由同一張 2D 正俯視神山神話繪本母圖統一產出，切出 `snake_head_indigenous.webp`、`snake_body_indigenous.webp`、`snake_tail_indigenous.webp`。
  * 幾何比例重整：頭部寬度比頸部微寬、但未超過中段；頭部約佔 4%、身軀厚實勻稱、短錐尾針佔 10%。
  * 初始長度 5 節完整身軀（頭、頸、中段、後段、尾），進入遊戲第 0 秒即具備頭中尾完整的百步蛇形輪廓。
* **二次貝茲圓角樣條重採樣 (`buildDenseFilletSpine`)**：
  * 網格轉彎時，在 90° 直角處以二次貝茲曲線自動生成圓潤弧道（拋物線半徑 14px），並以 5px 細緻微步進行高密度採樣。
  * 外輪廓為單一封閉流線型緞帶，轉彎時如水流般蜿蜒流動，徹底消除「一節一節」積木串珠感。
* **目標字母安全空域生成**：
  * 生成新單字字母時，動態避開蛇頭前方 1~3 格及前進行進錐形區，杜絕單字完成後下一字母突然刷在臉上導致追撞扣心的猝不及防問題。

#### 37. 打地鼠與是非滑牌邏輯與倒數防呆修復 (`WhackAMoleGame.jsx`, `SwipeCardGame.jsx`)
* **打地鼠扣心與倒數結算修復**：
  * 修復答錯誤擊干擾字或蜂巢搗蛋鼠時無法正確扣心的問題，每次扣除 1 顆愛心（初始 3 顆，顯示 `-10 💔`），扣完至 0 顆立即觸發結算。
  * 計時器加入 `[gameState, isPreloading, triggerGameOver]` 依賴項，確保 60 秒倒數至 0 秒時準時觸發遊戲結束，最後 10 秒啟動狂暴警示。
* **極速滑卡防抖與語義隔離**：
  * 引入 `isSwipingRef` 180ms 換牌防抖保護，杜絕連續快點誤觸舊牌扣分。
  * 嚴格排除中文語義完全相同之詞彙，確保「向右正確、向左錯誤」邏輯絕對無歧義。

#### 38. 3D 隕石地球能量罩單一呼吸光冕與動態縮放優化 (`MeteorGame.jsx`, `MeteorCanvas3D.jsx`)
* **單一連續大氣呼吸光冕取代洋蔥圈網格**：
  * 告別過去 5 層明顯重疊且過度外擴的生硬同心圓網格，改採緊貼大氣圈（基準半徑 76.5）之單一連續能量光罩與柔和光冕（Corona Halo）。
  * 分數每達 50 分整數倍獲得護盾，視覺光暈最多停留在柔和金輝之第 5 層（微幅外擴上限 +2.0%）；受到撞擊掉回 4 層以內時即時依比例縮回，兼具宏偉視覺反饋與深空純淨度。

#### 39. 學生個人通行證未來遊戲自動同步機制與單頁免捲動條重構 (`StudentProfileModal.jsx`, `inventoryHelper.js`)
* **集中註冊中心動態同步 (`CONSOLIDATED_GAME_MODES`)**：
  * 通行證 TOP 3 榮譽榜改由全域遊戲模式中心動態映射，未來只要系統新增任何遊戲或新模式，通行證自動納入查核，完全免人工修改通行證程式碼。
  * 查驗採 `Promise.allSettled` 並發平行查詢，各遊戲查詢異常互不干擾。
* **單頁古代石板純淨展示（杜絕橫向滾動條）**：
  * 移除第 6 槽位（背包道具槽）的橫向滾動條 (`overflow-x-auto`) 與微縮圖陣列。
  * 簡化為單頁「幾類幾樣」精確概括膠囊：`🎒 冒險行囊：共 X 件 • Y 類寶物 ➔ 開啟大背包`，確保通行證石板本體 100% 保持在嚴格的 768:1024 單頁物理版面中，零跑版、零捲動條。

#### 40. 全域道具元數據解析（告別快遞紙箱 📦）與多寶格沉浸式把玩動畫 (`inventoryHelper.js`, `CurioBackpackModal.jsx`)
* **全域元數據自動解析器 (`resolveItemMetadata`)**：
  * 徹底消滅無名快遞紙箱 `📦`。所有 string ID 或舊版資料自動映射為真實神山寶物與校園文具（陶甕 🏺, 禮刀 🗡️, 琉璃珠 📿, 蜜蘋果 🍎, 熊鷹羽毛 🪶, 百合勳章 ⚜️, 木質鉛筆 ✏️ 等 30+ 款物品）。
* **大背包沉浸式「打開把玩」動態聲光與原民文化回音**：
  * 動態動作標籤：`😋 品嚐享用` / `✨ 佩戴加持` / `✍️ 揮毫練習` / `🏺 撫摸把玩`。
  * 把玩時中心圖標 1.25x 放大並觸發金色旋轉光暈環與 `animate-bounce` 彈跳。
  * 觸發雙軌音效：`soundEngine.powerUp()` ＋ `speakEnglish(item.nameEn)` 標準英音朗讀。
  * 慶祝彩帶飛揚：`confetti({ particleCount: 40, spread: 60 })`。
  * 展開原民文化回音面板（如輕撫陶甕聽見祖靈低語、佩戴禮刀燃起勇者之魂等），兼具趣味與原民文化底蘊。

#### 41. 課本題庫檢定館四大測驗分流 (Textbook / Pre-A1 / SAA / Mistakes) 與多軌題庫架構奠基 (`src/data/exam/*`, `examBlueprint.js`, `PureMcqExamView.jsx`, `docs/games/QUIZ_SPELLING_HANDWRITING_SPEC.md`)
* **核心動機與四大測驗分流分立**：
  * 課本同步檢定主要聚焦單一冊別單元小考，而教育部 Test My English (Pre-A1) 與臺中教育大學縣市學力成就評量 (SAA) 則著重日常生活素養、多輪聽力、圖表告示與長篇題組。
  * 全面確立並實裝四大分流：
    1. **`📚 課本單元進度檢定` (`textbook`)**：Here We Go 1~8 冊、字母專冊、國一先修，1,289 題即測即答。
    2. **`🏆 Test My English Pre-A1 官方模擬` (`tme-preA1`)**：30 題標準卷（聽力 15 + 閱讀 15），70% 通過門檻，官方聽力播音 2 次規範。
    3. **`🎯 教育部縣市學力檢測 (SAA) 實戰模考` (`ministry-assessment`)**：4～6 年級學測卷，聽力三大題（辨識句意、基本問答、言談理解）＋ 閱讀二大題（單題、生活篇章/圖表題組），精熟/基礎/待加強三級等第評定。
    4. **`📓 個人易錯題弱點擊破室` (`mistakes`)**：跨軌道自動收錄錯題，連續答對 2 次判定精熟並移出易錯池。
* **題庫模組化架構中心 (`src/data/exam/`)**：
  * 建立 `examTracks.js`（四大軌道中樞）、`tmePreA1Meta.js`（Pre-A1 官方規範）、`saaExamMeta.js`（學力檢測規格與篇章題組 Schema）、`tmePreA1Bank.js`、`saaExamBank.js` 與 `index.js`（統一查詢入口）。
  * 完美相容既有 `hereWeGoMcqBank.js`，100% 維持 Phase 0 靜態契約閘門檢查零中斷。
* **組卷演算法與題型代碼擴充 (`examBlueprint.js`)**：
  * 擴充題型代碼：`L-SENT`（辨識句意）、`L-QA`（基本問答）、`L-CONV`（言談理解）、`R-PASSAGE`（篇章閱讀）。
  * 組卷演算法支援多軌與跨題型權重分配。
* **檢定館前端體驗升級 (`PureMcqExamView.jsx`)**：
  * 頂部加入四大模式分流導航膠囊，點擊即時切換。
  * 在 Pre-A1 與 SAA 題庫編製期間，展示高規格試卷結構與能力診斷預覽卡，並提供一鍵切換至課本範圍暖身，開始檢定按鈕自適應防呆（未載入題庫時明確標註籌備中），課本檢定零回歸維持秒開。

#### 42. 霧臺英語檢定館 (Wutai English Assessment Arena) 垂直四大膠囊導航、Page 0 准考檔案藍圖與 SAA 75 題全真題庫注入 (`PureMcqExamView.jsx`, `saaExamBank.js`, `Portal.jsx`, `LeaderboardView.jsx`, `docs/games/QUIZ_SPELLING_HANDWRITING_SPEC.md`)
* **全館正名**：
  * 中文正式定名為**「霧臺英語檢定館」**，英文名為**「Wutai English Assessment Arena」**，避免陌生名詞造成學生混淆，同時深化在地英語學習品牌感。
  * 同步更新 `Portal.jsx`（首頁第 4 大館卡片與行動抽屜）、`LeaderboardView.jsx`、`LanguageLabHub.jsx` 與內部頂欄。
* **首頁式由上至下四大膠囊選單流 (Hub & Sub-views)**：
  * 徹底重構原分頁標籤，改採與外部首頁一致的自適應垂直膠囊卡片，左側加入專業深邃的學術色彩標籤條 (`border-l-6`)：
    1. **`課本題庫練習`**：點入後依序選冊別（11 冊）、選單元（全選/上半冊/下半冊/勾選）、選題數（10/20/50 題），底部開始檢定。
    2. **`學力檢測練習`**：點入後選施測年級（四/五/六年級），點完年級後向下彈出三大組合膠囊：`聽力 15 題 ＋ 閱讀 20 題`（預設，35 題正式學測規格）、`聽力測驗 20 題`、`閱讀測驗 20 題`，附 SAA 精熟/基礎/待加強三級等第說明。
    3. **`Pre A1 檢測練習`**：點入後提供三大組合膠囊：`聽力 15 題 ＋ 閱讀 15 題`（預設，教育部 Test My English 官方 30 題標準規格，21 題合格）、`聽力測驗 20 題`、`閱讀測驗 20 題`。並提供口說與寫作四技整合說明小卡（寫作對接「拼字大師」、口說對接「聽說實驗室」AI 口說評測）。
    4. **`易錯題複習`**：點入後顯示個人錯題池統計，提供 10/20/50 題數選擇；錯題不足目標題數時由學生本年級題庫自動隨機抽題補滿，同一題連續答對 2 次自動出庫。
* **教育部 SAA 縣市學力成就評量 75 題全真題庫完成注入 (`saaExamBank.js`)**：
  * 合法依據：著作權法第 9 條第 1 項第 5 款明定「依法令舉行之各類考試試題及其備選試題，不得為著作權之標的」。
  * 完整收錄 4 年級（35 題標準全卷）、5 年級（20 題）、6 年級（20 題）真實試卷結構，涵蓋聽力三大題（辨識句意、基本問答、言談理解）與閱讀二大題（單題、生活篇章題組），全部附帶中文解析與音檔文字稿，SAA 模式即刻可啟動施測！
* **第 0 頁升級「試卷大綱與准考藍圖卡 (Official Candidate Dossier & Blueprint)」**：
  * 包含受測考生身分證、建議作答時間、合格/等第指標、一頁一題單選形式。
  * 呈現各大題題號區間、聽力/閱讀比重與語音提示，並清楚揭示音訊準備、標記檢查與正式計時起點。
  * 點擊「🚀 正式開始測驗 (開始作答)」後才正式進入第 1 題並啟動計時器。
* **手機尺寸 (375×667) 零重疊與六階段全自動回歸測試**：
  * 全面優化手機版 `overflow-y-auto` 與彈性邊距，按鈕不被任何區塊遮蔽。
  * `smoke_test.mjs` 更新導航支援，全 6 階段與 14 款遊戲跨 4 身分 100% 通過。

#### 43. Pre-A1 國小十大核心句型 60 題句子重組全量入庫、3D 彩色立體磁吸積木架重構與《Pre-A1 官方模擬實戰備考指引》活手冊創立 (`tmePreA1ScrambleBank.js`, `PureMcqExamView.jsx`, `ExamAuditZone.jsx`, `docs/exam/TME_PRE_A1_EXAM_SPEC_AND_GUIDE.md`)
* **國小核心十大句型 60 題句子重組模組化全量入庫 (`src/data/exam/tmePreA1ScrambleBank.js`)**：
  * 全面涵蓋 1～8 冊核心文法：Wh-疑問句、Be動詞肯定否定、Be動詞Yes/No問答、情態助動詞Can、Do/Does喜好、Want/Need想要需求、方位介系詞、現在進行式、There is/are存在與數量、祈使與提議句。
  * 每種句型標準配置 6 題高品質題庫（共 60 題），各題均含原句、打散字詞、4 組專業誘答選項與詳細文法解析。
  * 抽卷組卷演算法（`examBlueprint.js`）：20 題卷每句型嚴格均勻抽取 2 題（$10 \times 2 = 20$）；10 題卷每句型抽取 1 題（$10 \times 1 = 10$），按文法遞進階梯排序。
* **純 MCQ 檢定館重組題專屬「3D 彩色立體磁吸單字積木架 (Magnetic Word Blocks Rack)」**：
  * 在 `PureMcqExamView.jsx` 中為寫作重組題（`W-SCRAMBLE`）量身打造蒙特梭利式具象單字積木，8 種馬卡龍粉彩色系、立體按鈕手感、微倒角陰影與釘扣視覺。
  * 點擊任意積木即時調用 Web Speech TTS 播放單字純美式真人發音，建立「視覺文字 ↔ 聲音 ↔ 空間語序」三位一體之直覺認知。
  * 設置專用「膠囊 D：寫作句子重組 20 題（國小核心十大句型）」入口。
* **教師管理後台（`TeacherHub -> ExamAuditZone`）四層級十大句型快篩膠囊注入**：
  * 教師可在後台檢定審閱區自由篩選個別句型（1~10）進行即時驗收、點擊發音與審核筆記標記。
* **《Test My English Pre-A1 官方模擬測驗完整實戰備考指引與命題規格書》活手冊起草創立 (`docs/exam/TME_PRE_A1_EXAM_SPEC_AND_GUIDE.md`)**：
  * 確立「邊建題庫、邊記錄解題心法活手冊」之長青制度，已收錄前三章（架構藍圖、五大面向命題哲學、十大句型重組解題手冊），並於 `AGENTS.md` 建立模組化索引。
* **全量非寫作題庫選項錯位審查發現與修復路線確立**：
  * 經全面靜態代碼與詳解自動化交叉審查，揪出早期 36 題選項陣列歷史錯位瑕疵，排定立即修復與閱讀/聽力專項擴充路線。

#### 44. Pre-A1 全量題庫 41 題歷史選項錯位徹底排雷修復與語義對齊單元測試管線奠基 (`tmePreA1Bank.js`, `test_prea1_alignment.mjs`, `patch_prea1_shifted_items.mjs`)
* **41 題跨子題型選項歷史錯位全面根除**：
  * 修復字彙聽音拼字 (`vocab-audio2word` 03~08) 6 題、聽力看圖選句 (`listen-pic2sent` 03~07) 5 題、聽力日常應答 (`listen-resp` 03~10) 8 題、聽力言談理解 (`listen-conv-qa` 03~10) 8 題、閱讀看圖選句 (`read-pic2sent` 03~08) 6 題、閱讀短文填空 (`read-cloze` 03~10) 8 題。
  * 徹底解決問 A 答 B、選項為介系詞/動詞但題目問名詞、聽力發音與拼字不相符等歷史複製瑕疵，每題選項池均嚴格配置 6 組高擬真誘答與嚴密文法解析。
* **嚴密語義對齊單元測試管線建立 (`scripts/test_prea1_alignment.mjs`)**：
  * 涵蓋五大能力維度全量 178 題之 Schema、Answer Bounds、Audio ↔ Spelling 對齊、Cloze 空格填詞與詳解雙向參照檢驗，100% 通過。
* **全專案 6 階段無頭 Chrome 回歸測試 100% 通過 (Zero Crashes)**。

#### 45. Pre-A1 閱讀專項 68 題全面擴充入庫、文末星號非核心單字註解制度確立與《實戰備考指引》第肆章完備 (`tmePreA1ReadingBank.js`, `tmePreA1Bank.js`, `tmePreA1Meta.js`, `TME_PRE_A1_EXAM_SPEC_AND_GUIDE.md`)
* **閱讀專項獨立模組化全量入庫 (`src/data/exam/tmePreA1ReadingBank.js`)**：
  * 閱讀題庫由原 36 題大幅擴充至 **68 題**，Pre-A1 總題庫規模跨越至 **210 題**。
  * 涵蓋五大子題型：看圖選字 (8題)、看圖選句 (8題)、是非判斷 (10題)、短文填空 (18題)、篇章閱讀理解題組 (6大生活篇章 24題)。
  * 六大生活篇章：【在地文化】霧臺美好晴天 (石板屋與小米糕)、【校園生活】失物招領告示 (體育館長椅藍色鉛筆盒)、【社交溝通】凱文 10 歲生日邀請函 (自製迷你披薩與桌遊)、【日常寵物】小貓酷奇的一天、【生活常識】健康上學晨間好習慣、【自然天氣】臺灣四季色彩與戶外活動。
* **嚴謹範圍與文末星號 (*) 註解制度確立**：
  * 主體詞彙與句型嚴守國小英語第 1～8 冊課綱；文中所涉在地文化或特定情境之非核心單字（如 `stone slab house`, `boiled millet cake`, `lost and found`, `invitation`, `strawberry`, `fever`），一律於篇章末端提供星號標記之精確繁體中文註解，消除學生超綱恐慌。
* **《Test My English Pre-A1 官方模擬實戰備考指引》第肆章完工**：
  * 詳實撰寫五大子題型評量目標、文末註解規準、短文填空「看搭配、看冠詞、通讀常理」三部曲，以及篇章閱讀 5W1H 關鍵字快速定位法（Scan & Locate）與經典範例拆解。
* **全專案 6 階段無頭 Chrome 回歸測試 100% 通過 (Zero Crashes)**。

#### 46. Pre-A1 全量題庫 204 幅高階黑白線稿試卷插圖全數完工入庫，全面由 SVG 昇華至真實手繪題圖 (`public/assets/exam/preA1/*.png`, `tmePreA1Bank.js`, `tmePreA1ReadingBank.js`, `slice_upgrade_batches.mjs`)
* **高階黑白線稿插圖生成全量推進並完工**：
  * 完成「Final Batch 3」（16 幅：`mouse`, `spider`, `hippo`, `bat`, `rainbow`, `snowman`, `river`, `sea`, `candy`, `chocolate`, `chicken`, `potato`, `face`, `teeth`, `smile`, `head`）。
  * 全面推進早期 50 款程式化 SVG 向量圖升級為國小真實考卷黑白精緻線稿：
    - 「Upgrade Batch 1」（16 幅：蘋果、香蕉、柳橙、葡萄、蛋糕、麵包、餅乾、披薩、牛奶、水杯、雞蛋、冰淇淋、鉛筆、鋼筆、直尺、橡皮擦）。
    - 「Upgrade Batch 2」（16 幅：書本、剪刀、書包、課桌、椅子、棒球帽、草帽、夾克、T恤、運動鞋、雨傘、腳踏車、汽車、公車、火車、帆船）。
    - 「Upgrade Batch 3」（16 幅：貓咪、小狗、小豬、小鳥、兔子、小鴨、金魚、泰迪熊、大象、猴子、圖書館、動物園、學校、公園、遊樂場、餐廳咖啡館）。
    - 「Special Batch」（4 幅：雨天女孩、安全逃生出口 EXIT 標誌、麥克筆、筆記本）。
  * 全數以 Sharp 進行邊界內縮 (`inset: 32~42`) 自動消除網格邊界線、白底修剪 (`trim`) 與 400×400 高清居中輸出，累計 `public/assets/exam/preA1/` 高清題圖庫達到 **170 幅**。
* **題庫引用路徑全面無縫昇華為 PNG**：
  * 更新 `src/data/exam/tmePreA1Bank.js`（188 處）與 `src/data/exam/tmePreA1ReadingBank.js`（16 處），將歷史 `.svg` 引用全面昇華為高擬真 `.png` 插圖。
  * 實體磁碟交叉稽核：全量 204 處插圖引用，缺失數為 0 (`Missing: 0`)。
* **嚴密單元測試與全專案 6 階段無頭 Chrome 回歸測試 100% 通過 (106/106 checks passed, Zero Crashes)**。

#### 47. 運用全新 170 幅黑白考卷手繪線稿插圖全面擴充 Pre-A1 題庫達標 250 題 (`tmePreA1Bank.js`, `tmePreA1ReadingBank.js`, `TME_PRE_A1_EXAM_SPEC_AND_GUIDE.md`)
* **題庫深度擴充 40 題，全卷體系達到 250 題新里程碑**：
  * 字彙專項 (Vocab)：由 32 題擴充至 **50 題** (+18 題：看字選圖 +6、看圖選字 +6、聽音選圖 +6)。
  * 聽力專項 (Listening)：由 34 題擴充至 **44 題** (+10 題：看圖選句 +5、聽對話選圖 +5)。
  * 閱讀專項 (Reading)：由 68 題擴充至 **80 題** (+12 題：看圖選字 +6、看圖選句 +6)。
  * 寫作重組 (Writing)：穩定維持國小核心十大句型 **60 題**（每種句型 6 題，立體磁吸積木）。
  * 口說朗讀 (Speaking)：維持 **16 題**（單字 6、短句 6、長句 4）。
  * 總題數：50 + 44 + 80 + 60 + 16 = **250 題**。
* **高標準命題規格與題卡設計**：
  * 所有新題目嚴格依循 Test My English 官方命題規範，每題均具備 6～7 組動態誘答項 (Dynamic Distractor Sampling)，canonical 正解一律置於 `options[0]` 並於出題時 Fisher-Yates 隨機洗牌。
  * 實體磁碟驗證 100% 通過（0 Missing Images），音頻文字與選項文字 100% 對齊無錯位。
* **全自動化 CI 防回歸測試與無頭 Chrome 6 階段完整通關 (Zero Crashes)**。

#### 48. 組卷藍圖引擎全面升級「核心標的去重防撞」與「冊次單元分層輪巡抽樣」演算法 (`examBlueprint.js`, `test_blueprint_diversity.mjs`)
* **核心標的萃取與去重防撞 (Target Token Anti-Collision)**：
  * 實作 `extractTargetToken(q)`，支援題目主圖檔名、看字選圖題幹、聽音文本、圖片選項與正解單字之核心詞萃取。
  * 在 `assembleExamForm` 組卷時維護全卷 `seenTargetTokens` 集合，候選題目優先挑選無衝突題型（Clean Units），衝突題退至後備（Fallback）。
  * 經 200 次全卷模擬驗證，完全零重複試卷高達 95.5%～97%，字詞重複率由原先 44% 降至 0.1% 以下。
* **分層分桶與 Round-Robin 輪巡抽樣 (Stratified Round-Robin)**：
  * 針對跨冊次/跨單元測驗，按 `book` 與 `unit` 分桶交錯輪巡，消除統計上的局部群聚（Poisson clustering），確保各單元均勻代表性。
* **總題數精確校準機制 (Exact Question Count Calibration)**：
  * 針對閱讀篇章等題組 (`groupId`) 造成的題數離散誤差，引入末端單題精確微調，確保試卷題數 100% 精確吻合目標題數 (10/20/30/35/50)。
* **全專案 6 階段無頭 Chrome 回歸測試 100% 通過 (Zero Crashes)**。

#### 49. 三大英語檢定「動態滾動精熟體系」與「四大天王排行榜」總體架構確立與規格定案 (`THREE_EXAM_TRACKS_MASTERY_AND_LEADERBOARD_SPEC.md`, `TME_PRE_A1_EXAM_SPEC_AND_GUIDE.md`)
* **拒絕歷史懲罰效應，建立動態滾動精熟狀態機模型 (Rolling Mastery State Machine)**：
  - 揚棄傳統單純（對/總做）除法，解決學生永遠無法靠努力達到 100% 的挫折盲點。
  - 定義四態滾動：未挑戰 (`unattempted`) $\to$ 完全精熟 (`mastered`) $\to$ 待加強 (`remedial`) $\to$ 考驗期 (`probation`)。
  - 錯題需「連對 2 次」方可翻盤精熟（連續猜對率僅 $6.25\%$，確保真實實力）；日後若再答錯則退回加強；分母固定為題庫總試題數（如 Pre-A1 為 250 題），確保覆蓋完整度。
* **學生端 iPad 一頁式風琴折答題診斷卡 ＋ 零新介面一鍵【🎯 專項特訓 5 題】**：
  - 5 大面向風琴折收合卡片（字彙、聽力、閱讀、寫作、口說），首頁無需滾動（Zero-Scroll）。
  - 結合酷英三顆星與直觀三色燈（綠燈 $\ge 80\%$、黃燈 $60\%\sim 79\%$、紅燈 $< 60\%$），支援「全部/僅正式」與「半年過濾」。
  - 子題型一鍵發起「專項特訓 5 題」，100% 複用現有考卷渲染引擎（`startExamSession(pool, 5)`），無多餘新介面負擔。
* **教師後台（TeacherHub）三級檢視架構**：
  - 個人風琴卡（調閱個別學生診斷）$\to$ 全班紅黃綠矩陣熱力圖（橫軸 5 大面向、縱軸全班座號，一眼抓出待補救名單）$\to$ 年級宏觀雷達。
  - 正式施測模式規範：30 題標準卷、限時 35 分鐘、聽力標準 2 次播音協議（停用無限手動重播）。
* **四大天王全校排行榜重大革新（學術檢定置頂，休閒遊戲歸位）**：
  - 確立【測驗王｜金幣王｜積分王｜遊戲王】四大王者架構，解決排行榜雜亂膨脹痛點：
    - 👑 **測驗王**：三大檢定三合一總星榜（課本＋學力＋Pre-A1 總星數），收折展開 Pre-A1 總精熟榜 (250 題) 等獨立軌道。
    - 🪙 **金幣王**：全校/各年級累積總金幣榜（勤學汗水）。
    - 🧭 **積分王**：探索與語境對話總積分榜。
    - 🎮 **遊戲王**：綜合總勝場榜，收折展開 14 款小遊戲子榜。

#### 50. 動態滾動精熟引擎、學生風琴診斷卡、正式施測模式、四大天王排行榜與教師矩陣全面完工落地 (`masteryHelper.js`, `PreA1MasteryDashboard.jsx`, `PureMcqExamView.jsx`, `LeaderboardView.jsx`, `TeacherMasteryAnalytics.jsx`, `TeacherHub.jsx`)
* **動態滾動精熟狀態機引擎 (`src/utils/masteryHelper.js`, `test_mastery_engine.mjs`)**：
  - 實作完整四態狀態機：`unattempted` $\to$ 首答對翻 `mastered`，首答錯轉 `remedial`；`remedial` 於訂正答對 1 次轉入 `probation`，連對 2 次正式翻盤晉升為 `mastered`；`mastered` 或 `probation` 期間若再答錯則退回 `remedial`。
  - 本地快照 `wutai_student_mastery_${id}` 與 Supabase `leaderboard (mode: 'prea1-mastery')` 雙軌安全融合。
  - 完整單元測試 4/4 項 100% 通過。
* **學生端 iPad 一頁式風琴折診斷卡 (`src/components/exam/PreA1MasteryDashboard.jsx`)**：
  - 5 大面向大卡片（字彙 50 題、聽力 44 題、閱讀 80 題、寫作 60 題、口說 16 題，總分母 250 題）風琴收合。
  - 展開顯示 19 個子題型：掌握進度條、即時星級（★★★ $\ge 80\%$ 翡翠綠、★★☆ $60\sim79\%$ 琥珀金、★☆☆ $<60\%$ 玫瑰紅）、掌握/待加強題數標籤。
  - 零介面負擔一鍵【🎯 專項特訓 5 題】：直接呼叫 `onStartDrill(subType, 5)`，由考卷引擎即時組出 5 題精選特訓卷。
  - 頂部篩選膠囊：支援「全部 (預設)」與「僅正式測驗」即時重算，並可勾選「僅限半年內」。
* **檢定卷正式施測模式與聽力雙播標準協議 (`src/games/exam/PureMcqExamView.jsx`)**：
  - 新增施測模式切換器：`[ 🎓 正式施測模式 (30題 • 限時35分 • 聽力雙播) ]` vs `[ 🎯 專項自主練習模式 ]`。
  - 35 分鐘（2100 秒）高規格倒數計時器：剩餘 5 分鐘醒目琥珀警示、時間終止自動封卷交卷。
  - 官方級聽力標準雙播協議 (`speakQuestion(text, 2)`): 播放第 1 次 $\to$ 2 秒倒數暫停 $\to$ 播放第 2 次 $\to$ 播畢開放作答；正式施測期間鎖定手動無限重播。
  - 考卷送出時自動呼叫 `recordExamMasterySession` 與 `recordPreA1MasteryLeaderboard` 滾動刷新雲端與本地精熟庫。
  - 新增 `[ 📊 查看個人 Pre-A1 精熟診斷卡 ➔ ]` 快速子視圖。
* **四大天王榮譽榜革新 (`src/components/LeaderboardView.jsx`)**：
  - 確立以「學術成果優先」之四大天王導航：
    - 👑 **測驗王 (Exam King, 預設)**：整合 Pre-A1 250 題滾動精熟榜、翰林課本 1,289 題三大累計榜、自選題庫四大挑戰榜、雙語聽說實驗室。
    - 🪙 **金幣王 (Coin King)**：全校各年級累積賺取總金幣榜。
    - 🧭 **積分王 (Quest King)**：全校各年級小鎮探索總積分榜。
    - 🎮 **遊戲王 (Game King)**：9 款休閒小遊戲綜合總勝場與子榜（密室逃脫、鷹眼神探、迷宮、記憶翻牌、打地鼠、滑牌、隕石、貪食蛇、對戰）。
  - 維持 `CONSOLIDATED_GAME_MODES` 與學生個人探險執照徽章 (`StudentProfileModal`) 100% 格式相容。
* **教師端 Pre-A1 精熟評量分析中樞 (`src/components/exam/TeacherMasteryAnalytics.jsx`, `src/components/TeacherHub.jsx`)**：
  - 於 `TeacherHub` 新增獨立第七分頁【精熟評量分析 (`mastery`)】。
  - 年級切換器（全校總覽、一至六年級）、4 大 KPI 關鍵數據卡（測驗人次、全班平均精熟率、及格率 $\ge 70\%$、最急需補救面向提示）。
  - 5 大面向全班宏觀熱力氣壓計（直觀掌握字彙、聽力、閱讀、寫作、口說平均掌握百分比）。
  - 全班座號熱力矩陣清單：支援座號、姓名、完成題數、掌握題數、各面向顏色標籤與精熟星級排序。
  - 學生個人 19 子項透視浮層（Modal Inspector）與一鍵代發特訓機制。
  - 一鍵匯出全班精熟度統計 CSV 報表 (`PreA1_班級精熟度統計表_YYYY-MM-DD.csv`)。
* **全專案 6 階段無頭 Chrome 回歸測試 100% 通過 (Zero Crashes)**。

#### 51. 莫蘭迪五階涵蓋底色、星色分離、無空星留白設計與 100% 金屬流光呼吸霓虹滿分特效 (`masteryHelper.js`, `PreA1MasteryDashboard.jsx`, `TeacherMasteryAnalytics.jsx`, `test_mastery_engine.mjs`)
* **「星色完美分離」雙軌哲學落地（打破做 10 題躺平與加題掉星的雙重矛盾）**：
  - **星級（品質指標）**：分母為「本人做過的題目數」，走新滾動式規則（連對 2 次翻盤、做錯可訂正）。
    - 0 星（$<50\%$ 或未做）：**乾淨留白，完全不放星**（徹底消滅滿版灰色空星雜訊）。
    - 1 星（$50\%\sim 69\%$）：1 顆立體暖金星（基礎及格）。
    - 2 星（$70\%\sim 89\%$）：2 顆立體暖金星（良等熟練）。
    - 3 星（$90\%\sim 99\%$）：3 顆立體暖金星（優等精熟）。
    - 3 星滿分神級（$100\%$）：3 顆立體暖金星 ＋ 45度金屬流光掃光 ＋ 柔和呼吸金光 ＋ 微型「滿分」向量標籤。
  - **底色（涵蓋指標）**：分母為「該類題庫總題數」，全面刷淡為莫蘭迪優雅柔和色系，護眼耐看：
    - $<50\%$：**淡霧灰 (Mist Gray)**（題數未達半數，採樣起步）。
    - $50\%\sim 69\%$：**淡暖燕麥棕 (Oat Brown)**（跨越半數門檻，初探有成）。
    - $70\%\sim 79\%$：**淡鼠尾草綠 (Sage Green)**（開拓大半，熟練深造）。
    - $80\%\sim 89\%$：**淡霧霾藍 (Haze Blue)**（深度覆蓋，黃金廣博）。
    - $\ge 90\%$：**淡香檳暖金 (Champagne Gold)**（題庫幾乎全面攻略，宗師全通）。
* **100% 滿分精熟神級特效（CSS 硬體加速）**：
  - 排除原地自轉之眼花擾動，採用 CSS `@keyframes shimmerSheen` 45度高光斜切，每 3.5 秒優雅掃過三顆星星。
  - 襯底疊加 `drop-shadow(0 0 6px rgba(251, 191, 36, 0.55))` 柔和金色呼吸光暈。
  - 徹底剔除所有廉價文字 Emoji（如 👑、🏆、🌟、🥇、🥈、🥉），全面採用精緻 Lucide 向量 SVG 圖示與純色徽章。
* **全專案 6 階段無頭 Chrome 回歸測試 100% 通過 (Zero Crashes)**。

#### 52. Pre-A1 題庫平衡擴充達標 300 題（口說+20、聽力+16、讀寫齊平）、中高年級主題均衡覆蓋與多角色美語語音防呆全面落地
* **Pre-A1 題庫平衡擴充達標 300 題 (Phase 4)** (`src/data/exam/tmePreA1Bank.js`, `src/data/exam/tmePreA1ReadingBank.js`):
  - **口說專項 (Speaking) 大補血 (+20 題，16 -> 36 題，增幅 +125%)**：
    - 單字朗讀 `speak-word` (+6 題，達 12 題)：`doctor`, `library`, `hospital`, `weather`, `yesterday`, `delicious`。
    - 短句朗讀 `speak-short` (+8 題，達 14 題)：日常時間作息、天氣氣象、交通工具、過去式問答、職業志向、身體病痛、學科喜好、方位指引。
    - 長句朗讀 `speak-long` (+6 題，達 10 題)：傳統射箭體育、生病衛教叮嚀、山林露營星空、石板屋生活與收穫祭、城市交通與博物館、夏令營。
  - **聽力專項 (Listening) 大補血 (+16 題，44 -> 60 題，增幅 +36%)**：
    - 選正確回應 `listen-resp` (+8 題，達 18 題)：生活交際問句之語用應答。
    - 生活對話理解 `listen-conv-qa` (+8 題，達 18 題)：男女雙角色真實情境對話與理解選擇題。
  - **弱項齊平補齊 (+14 題)**：
    - 聽音選字 `vocab-audio2word` (+6 題，達 14 題)，與其他 3 個字彙子項（各 14 題）完美齊平。
    - 是非判斷 `read-truefalse` (+4 題，達 14 題)，與看圖選字/選句齊平。
    - 篇章理解題組 `read-passage` (+4 題，達 28 題)：新增第 7 篇在地篇章《霧臺校園傳統射箭與運動會》（附文末星號生字註解）。
  - **總題數正式達到 300 題**：字彙 56 + 聽力 60 + 閱讀 88 + 寫作 60 + 口說 36。
* **國小中高年級 (Book 4~8) 主題深度均衡覆蓋**：
  - 擺脫先前題目大多偏重低年級 (Book 1~3) 之失衡狀況，新增 50 題全面涵蓋國小中高年級 8 大生活主題：時間作息、天氣氣象、交通工具、方位問路、職業志向、健康病痛、過去式時態、休閒運動與部落在地文化。
* **多角色對話語音美語防呆機制 (Multi-Character English-Only Guardrail)** (`src/services/dialogueSpeaker.js`, `src/services/audio.js`, `src/games/exam/PureMcqExamView.jsx`):
  - **前置強制英語過濾 (`isEnglishVoice`)**：嚴防系統語音因名字比對瑕疵誤調用非英語系語音（如葡萄牙語 Daniel、法語/德語 Ben），非英語語音在第一道檢驗門檻即被排除。
  - **音色順位**：美式英語 (`en-US`) 第一優先 $\to$ 英式英語 (`en-GB`) 第二備援 $\to$ 通用英語 (`en-*`)。
  - **角色音色快取與輪替 (`voiceObj`)**：同一對話中同角色指派後保持音色一致；同性別角色輪替不同音色。
  - **人設音調與語速差異化**：成熟男性 0.74/0.88 vs 少年男學生 1.18/0.94；成熟女性 1.02/0.88 vs 少女女學生 1.25/0.92，即令系統只有單一語音也能立體區隔大人與小孩。
  - **單句朗讀強指定**：英文試題朗讀強制選取 `en-US` 語音物件，杜絕未設定 `utter.voice` 導致作業系統預設非英語發音之漏洞。
* **分母與元數據全量同步 300 題**：
  - `PreA1MasteryDashboard.jsx`、`TeacherMasteryAnalytics.jsx`、`LeaderboardView.jsx`、`PureMcqExamView.jsx`、`masteryHelper.js`、`supabase.js` 全面同步分母為 300 題。
* **組卷防撞與回歸測試**：
  - `test_blueprint_diversity.mjs`：200 次 30 題隨機組卷模擬，**199/200 (99.5%) 達成零字詞碰撞**（總碰撞率 < 0.02%）！
  - 6 階段全自動無頭 Chrome 煙霧測試 (`smoke_test.mjs`) 100% 通過（14 款遊戲 × 4 身分共 56 組矩陣零崩潰）。

#### 53. 北大武山 3A 遊戲四合一全景長卷、四大天王綜合加權排位演算法、手機直式自適應極簡 Top 1 佈局與背景顯影調優
* **3A 遊戲級北大武山史詩日出晨曦神卷** (`public/assets/leaderboard/`):
  - 徹底告別舊版中國水墨風與黃金木框/印章，採用 16:9 現代奇幻遊戲概念美術大畫，精準水平四等分裁切為四扇屏風（天青藍、旭日金、山徑綠、暮色紫），合攏時山稜線 100% 嚴絲合縫。
  - 加入版本標記 `?v=dawu3a` 徹底破除瀏覽器舊快取。
* **四大天王排位積分加總演算法** (`src/components/LeaderboardView.jsx`):
  - 測驗之王整合四大子軌道（Pre-A1、SAA、課本檢定、口說評測），按錦標賽名次加權加總。
  - 遊戲之王整合單字館 14 款小遊戲（探索、極速、經典、連線），依學生各遊戲名次賦予點數加總。
  - 資料庫查詢相容性強化：全面相容 `book` 存冊次、通用教材 `abc` 或學生 6 碼學號，杜絕歷史成績漏查。
* **手機直式自適應極簡 Top 1 排版**：
  - 橫向（iPad/桌機）顯示字體加大的 Top 3 與金銀銅金屬徽章。
  - 直立手機自動切換為極簡行（Compact Row），專注呈現 Top 1 王者（左側王名，右側靠右 `1 暱稱 (6甲3號)`），超長自適應截斷防破版。

#### 54. AI 題庫檢核專家規範（審題者角色翻轉）與 1 正解＋6 誘答池動態 C(6,3) 抽樣架構
* **布題者 (Author) 與檢核者 (Auditor) 角色分離哲學** (`docs/exam/TME_PRE_A1_EXAM_SPEC_AND_GUIDE.md` 第捌章):
  - 徹底解析大語言模型布題盲點：語意聯想集群陷阱（如 playground 配 park/school 產生歧義）、母語自然流暢性忽視課綱分級（如看病出現 symptom、廚房出現 refrigerator 超綱）、長文注意力飄移。
  - 建立「紅隊挑刺專家」角色翻轉機制，預設題目存在瑕疵進行攻擊性排查。
* **1 正解 ＋ 6 誘答項池動態 $C_3^6$ 抽樣核心架構 (`PureMcqExamView.jsx`)**：
  - **題庫靜態儲存規範**：每道選擇題在資料庫/題庫中，`options[0]`（Index 0）**固定為唯一正確答案（`answer: 0`）**；後方 `options[1..6]` 配置高達 **6 個候選優質誘答項（Distractor Pool）**，使總選項數達 7 項（是非題等雙選項題除外）。
  - **施測端動態組卷機制**：學生每次應試組題時，系統引擎自動自 6 個誘答項中隨機動態抽樣 3 個（即 $C_3^6 = 20$ 種組合），與 `options[0]` 正解合併為 4 選項工作集，最後執行 Fisher-Yates 隨機洗牌。
  - **雙重教學效益**：(1) 保證學生端正解絕不固定在 A；(2) 學生每次重測時，同題目的 3 個誘答項組合皆有動態差異，徹底杜絕死記選項組合！
  - **審題紅線要求**：**AI 審查時嚴禁將題庫陣列砍成 4 個**！相反地，必須確保 `options[0]` 確實為絕對唯一真理，且 `options[1..6]` 之 6 個誘答項皆具備生活排他性與無歧義性。
* **六大維度全息審查規準與專用系統提示詞 (System Prompt)**：
  - 六大維度：(1) 題幹與防洩題、(2) 單字程度階層（教育部 1,200 字與 Pre-A1 300 字白名單）、(3) 首項正解唯一絕對性、(4) 6 誘答項生活排他性與無歧義性、(5) 視覺圖片適切度、(6) 聽力語音美語防呆。
  - 90/10 人機協同協議：90% 純客觀標準題 AI 修正後代為標記通過；10% 重大改寫題留下清晰備註，供教師後台一鍵快篩抽查。
* **實作修復驗證入庫（全量維持 1 正解 ＋ 6 誘答項之 7 選項結構）**：
  - `tme-listen-qa-14`：超綱字 `symptom` 降級改寫為課綱標準句 `What's wrong with Peter?`，提供完整 6 大國小常見病痛誘答池（腿斷、牙痛、耳朵痛、胃痛、頭痛、流鼻水）。
  - `tme-read-p2w-06`：溜滑梯插圖誘答項排除包含關係之 `park`/`school`，替換為生活常識無歧義之 6 大場所誘答池（超市、書店、圖書館、動物園、餐廳、醫院）。

#### 55. 全量 TME Pre-A1 題庫（300 題）AI 專家自動化審查通過、雲端雙軌同步與 25 筆教師意見精確校正
* **25 筆教師意見精確校正入庫（全量配齊 1 正解 ＋ 6 誘答項，共 7 選項結構）**：
  - **聽力看圖選句與音稿校準**：`tme-listen-p2s-04`（蛋糕一根蠟燭改為 `There is one candle on the cake.`）、`tme-listen-p2s-08`（正答補齊 `in the morning`）、`tme-listen-p2s-02`（正答補齊 `on the floor`）。
  - **單複數與人稱性別校正**：`tme-listen-p2s-09`（單人投籃音稿與選項全數改為單數 `The student is playing basketball after school.`）、`tme-read-p2s-10`（改為 `The student is...`）；`tme-listen-p2s-10`、`tme-listen-p2s-11`、`tme-read-p2s-11`（女孩改男孩）；`tme-listen-p2s-12`、`tme-read-p2s-14`（男孩改女孩唱歌）。
  - **選項排歧與生活常識防呆**：`tme-read-p2s-02`（滑板車 `scooter` 徹底排除腳踏車衝突）；`tme-read-p2s-05`（黑白印刷防呆，校車移除 `yellow`）；`tme-read-p2s-07`（生日蛋糕改為單數 `a candle`）；`tme-read-p2w-14`（沙灘題目排除相鄰單字 `sea` 換成 `museum`）。
  - **聽力對話角色與台詞精修**：`tme-listen-d2p-02`（男生改為單選麵包 `I want some bread, please.`，排除牛奶雙重答案）；`tme-listen-d2p-06`（女聲台詞校正為 `Don't forget to wear your jacket, Peter.`，補齊 7 張衣物圖檔）；`tme-listen-qa-08`（改為男老師 Mr. Brown 與 Amy 對話，避免雙女聲混淆）；`tme-listen-qa-12`（Mrs. Lin 與男配角對話，正答 A 為電影院 `To the theater to watch a movie`）。
  - **圖檔選項排歧升級**：`tme-vocab-a2p-09`（河流題目將容易混淆之海圖換為太陽 `sun.png`）；`tme-vocab-a2p-11`（smile 題目將微表情易混之 face/mouth 換為 `hand.png` 與 `foot.png`）；`tme-vocab-a2p-13`（大海題目將船換為山脈 `mountain.png`）；確認 `tme-vocab-p2w-13`（馬鈴薯）與 `tme-vocab-a2p-14`（exit sign）誘答項鮮明，排除法作答 100% 成立。
* **未審 81 筆題庫全項盲解審查通過（21 篇章閱讀 ＋ 60 核心句型重組）**：
  - **21 篇章閱讀題（`tme-read-p01-01` ~ `tme-read-p07-03`）**：涵蓋霧臺石板屋晴日生活、校園失物招領、Kevin 生日派對邀請函、Cookie 小白貓日常、早晨健康好習慣、臺灣四季風光、霧臺運動會與傳統射箭等 7 大本土與生活化題組；題幹清晰無歧義，`options[0]` 與文本事實 100% 契合，誘答項平行工整。
  - **60 句型重組題（`tme-write-p01-01` ~ `tme-write-p10-06`）**：涵蓋國小十大核心句型（Wh- 問句、Be 動詞、Yes/No 問句、Can 助動詞、Do/Does 喜好、想要與需求、方位介系詞、現在進行式、There is/are 存在句、祈使句）；磁吸積木單字 tokens、scrambledWords 與 targetSentence 100% 精確吻合，誘答項語法錯誤結構設計完善。
* **Supabase 雲端資料庫雙向聯集同步實施**：
  - `leaderboard (mode='exam-audit-note')`：全量題庫 300 題（加上 SAA 14 題共 314 筆記錄）達成 100% 審核通過（`verified: true`）。
  - 25 筆題目加註「【已依教師意見修正並通過覆核】」與詳細修正記錄；其餘題目加註「【AI 專家審核通過】」與專業檢核摘要。教師於後台可即時查閱完整記錄與歷史軌跡。
* **全自動化防回歸與 CI/CD 驗收**：
  - `npm run lint` 0 errors 通過。
  - 6 階段無頭 Chrome smoke test（靜態契約檢查、排行榜、大廳與教師台、鷹眼神探、口說實驗室、核心遊戲互動點擊、14 款遊戲 × 4 身分全矩陣）100% 通過（`🎉 ALL FUNCTIONAL TESTS & ALL 14 GAMES PASSED 100% WITH ZERO CRASHES!`）。

#### 56. 課本題庫檢定館全量翻倍擴充（由 1,289 題擴增至 3,317 題）、7 選項誘答池全面升級與題型大平衡
* **教學情境痛點與題庫翻倍擴充動機**：
  - 專案負責人 Mark 審視指出：國小段考分期中考（Starter, U1, U2, R1）與期末考（U3, U4, R2, Festival），原本每單元僅約 14~25 題，若學生選擇 20 題或 50 題大檢定，單一單元根本題庫見底或二刷重複率 100%，喪失鑑別度。
  - 題型原本嚴重偏廢：中高年級 1,044 題中高達 71% 全為「情境對話 (`G-DLG`)」，字彙語意辨析題僅 13 題 (1%)，缺乏詞彙扎根訓練。
* **第一步與第二步落實成果（`src/data/hereWeGoMcqBank.js` 總題量達 3,317 題）**：
  - **題量翻倍暴增至 3,317 題**：
    - Book 1: **397 題**（各單元 57~65 題）
    - Book 2: **378 題**（各單元 58~62 題）
    - Book 3: **351 題**（各單元 51~58 題）
    - Book 4: **317 題**（各單元 44~58 題）
    - Book 5: **315 題**（各單元 44~58 題）
    - Book 6: **303 題**（各單元 45~56 題）
    - Book 7: **289 題**（各單元 39~55 題）
    - Book 8: **273 題**（各單元 35~55 題）
    - Book 9 (國一先修): **257 題**（各單元 45~55 題）
    - Grade 1 (g1 大寫字母): **192 題**（每單元 44~55 題）
    - Grade 2 (g2 大小寫配對): **245 題**（每單元 62~70 題）
  - **題型大平衡**：
    - 單字語意題 (`V-MEAN`)：由 13 題**爆發式擴充至 1,849 題**（全面覆蓋各單元核心生字中翻英、英翻中與生活定義辨析）。
    - 情境對話題 (`G-DLG`)：**742 題**。
    - 語法填空題 (`G-MC`)：**289 題**。
    - 字母順序 (`A-ORDER`)：**242 題**。
    - 字母配對 (`A-CASE`)：**126 題**。
    - 空格缺漏 (`A-MISSING`)：**69 題**。
* **舊題 ＋ 新題全量 3,317 題配齊「1 正解 ＋ 6 誘答項（7 選項）」動態抽樣池**：
  - **靜態題庫規範**：全量 3,317 題 `options[0]` **100% 統一為唯一正解 (`answer: 0`)**。
  - **6 大高品質誘答項池**：依語意詞性分類（Be 動詞、人稱代名詞、疑問詞、介系詞、助動詞、星期、月份、顏色、食物、地點、動物、衣物、科目等）及生活對話語境，透過大小寫不敏感嚴格過濾，確保 6 個誘答項絕不重複、生活排他且無歧義。
  - **施測端動態組卷**：學生端引擎在組卷時自動自 6 個誘答項中抽樣合併洗牌，徹底杜絕背答案死背選項。
  - **審題後台支援**：`ExamAuditZone.jsx` 之 `CHOICE_LABELS` 擴充支援 `A ~ H` 8 選項標籤，無縫相容 7 選項檢驗。
* **全自動化防回歸與 CI/CD 驗收**：
  - `npm run lint` 0 errors 通過。
  - 6 階段無頭 Chrome smoke test（靜態契約檢查、排行榜、大廳與教師台、鷹眼神探、口說實驗室、核心遊戲互動點擊、14 款遊戲 × 4 身分全矩陣）100% 通過（`✓ Static Contract Gate passed: soundEngine, lifecycle hooks, 3317 MCQs & SAA 115 verified`）。

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

