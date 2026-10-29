# 新對話視窗接手備忘錄 (Handover to New Session)

當開啟新的 AI 對話視窗時，可直接複製本文中的「新視窗接手提示詞 (Prompt)」，貼入新視窗即可 100% 無縫銜接所有專案進度、Supabase 雲端雙軌漫遊架構與 6 階段全自動防回歸工程規範。

---

## 完整新視窗接手 Prompt（請全選複製下方引號內文字）

```markdown
我是屏東縣霧臺國小數位學習平台（WutaiVocab）的開發負責人 Mark。
請先詳細閱讀本地專案最新交接指南：
1. `HANDOVER.md`（全專案最新里程碑、架構與 6 階段全自動防回歸測試規範）
2. `docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md`（找不同全冊改版心法、鐵律 0~6、動態出題架構與設計規範）
3. `docs/ECOSYSTEM_OVERVIEW.md`（三大專案架構、Supabase 帳號 `liguyt@wutps.ptc.edu.tw` 與安全規則）

【目前專案核心進度（截至 2026-10-29）】：
1. **鷹眼神探 • 找不同**：
   - 第 2 冊圖 1（南法普羅旺斯莊園）與 **第 2 冊圖 2（舊金山漁人碼頭 Pier 39 工藝廣場）** 的 Base 圖、8 個目標判定框（`draw`, `cook`, `pot`, `doctor`, `nurse`, `driver`, `teacher`, `student`）及 **Variant A / B / C 共 24 張透明羽化 PNG 補丁** 均已 100% 完成並驗收上線！
   - **Mark 專屬後門入口**：遊戲中在「**放大鏡圖標 (Magnifier)**」連續快速點擊 5 下（或網址帶 `?view=spotter-test`），可直達 `SpotterTestWorkbench` 檢視 Base 與 ABC 變異、切片對比與判定框。
2. **學生雲端獨立漫遊與整學期資料保留（永不遺失金幣與積分）**：
   - Supabase 專案位於帳號 **`liguyt@wutps.ptc.edu.tw`** 下（Project ID: `fqkdkmcqjswufzbvkram`，後台：`https://supabase.com/dashboard/project/fqkdkmcqjswufzbvkram`）。
   - `student_profiles` 資料表已正式建立並與 `leaderboard (mode = 'profile-sync')` 實施雙軌同步與 **Union Merge（聯集取最高值 `Math.max`）**，學生金幣 (`coins`) 與探索積分 (`quest_points`) 保留一整個學期（`semesterHelper.js`），**嚴禁任何更新覆蓋或清空學生資料**。
3. **全站 14 款遊戲穩定運行與「防改 A 壞 B」6 階段全自動守門員（`scripts/smoke_test.mjs`）**：
   - 貪食蛇方向隊列 (`inputQueueRef.current.shift()`)、經典選擇題/拼字從大廳按「開始遊戲」過渡、多人連線對戰三間擂台開房頻道防撞 (`syncEvictChannel`) 與頂列精簡、滿 50 分地球護盾音效 (`soundEngine.powerUp()`) 均已修復並上線。

【最高工程與出圖鐵律（接手 AI 必須 100% 遵守）】：
1. **強制自動化防回歸驗證（杜絕改東壞西、免除人工重測）**：
   - 任何程式碼修改後、推送前，**必須執行 `npm run build` 與 `node scripts/smoke_test.mjs`**！
   - 該腳本會自動執行 **6 階段深度檢測**：(0) 靜態契約檢查（確認所有 `soundEngine.xxx()` 存在於 `audio.js`、無閃退 `return onBack()`）、(1) 排行榜互動、(2) 大廳與教師後台、(3) 鷹眼神探跨年級驗證、(4) 口說錄音評測、(5) **核心遊戲真實互動模擬**（大廳選冊按開始遊戲不閃退、貪食蛇方向鍵/十字鍵轉彎、多人對戰開立擂台零衝突、各遊戲實際點擊選項）、(6) **14 款遊戲 × 4 身分（共 56 組）全量啟動無崩潰**。
2. **找不同出圖鐵律（鐵律 5 & 6）**：
   - 先文字討論拍板，後調用生圖工具，絕不未溝通就擅自出圖消耗 Token。
   - 變異圖（Variant A/B/C）採用「8 取 5」動態插槽引擎，**嚴禁全景重新畫變異圖**！必須以 Base 圖為唯一底板，針對 8 個目標槽位產製透明羽化 PNG 補丁，再由 Sharp 合成 Diff 圖，確保未選中的 3 個單字與背景左右兩圖 100% 像素完全相同。

請確認你已閱讀上述手冊並完整理解所有架構與防回歸鐵律，準備好後請告訴我！
```

---

## 專案歷史文檔與核心手冊清單
- `HANDOVER.md`：專案主交接文檔（含歷次里程碑、Supabase 架構與 6 階段 E2E 守門員規範）。
- `docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md`：找不同黃金設計規範、三層景深、變異 ABC 合成秘技、8取5動態引擎架構、各冊涵蓋率總結。
- `docs/ECOSYSTEM_OVERVIEW.md`：霧台三大專案生態總覽（wutaivocab / class / wutpsdata）與 Supabase 帳號資訊。
- `docs/CINEMA_AND_LANGUAGE_LAB_ROADMAP.md`：雙語聽說探險館與山豬影城架構。
