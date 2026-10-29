# WutaiVocab 專案全域核心守則與模組化交接索引 (Always-On Agent Rules)

本檔案由 Antigravity 於每次新對話啟動時**自動載入**。進行任何開發前，請嚴格遵守以下全域鐵律，並依本次任務涉及的遊戲模組**按需讀取（On-Demand Read）**對應的子規格書，切勿一次載入所有歷史文件以節省 Token。

---

## 一、 全域不可妥協之工程鐵律 (Global Guardrails)

1. **學生雲端資料永久保護（嚴禁覆蓋金幣與積分）**：
   - **Supabase 帳號**：`liguyt@wutps.ptc.edu.tw`｜**Project ID**：`fqkdkmcqjswufzbvkram`｜**後台**：https://supabase.com/dashboard/project/fqkdkmcqjswufzbvkram
   - **雙軌聯集融合（Union Merge）**：`src/services/supabase.js` 同時讀寫 `student_profiles` 與 `leaderboard (mode = 'profile-sync')`，永遠以 `Math.max` 取最高金幣 (`coins`) 與探索積分 (`quest_points`)。
   - **學期制保留**：由 `src/utils/semesterHelper.js` 判定學期（2/1～7/31 下學期、8/1～隔年1/31 上學期），整學期保留資料，跨學期自動封存至 `semester_history`。**任何更新嚴禁清空或覆蓋學生資料**。
2. **強制 6 階段全自動防回歸測試（杜絕改 A 壞 B、免除人工重測）**：
   - 任何程式碼變更後、推送前，**必須執行**：
     ```powershell
     npm run build ; if ($?) { node scripts/smoke_test.mjs }
     ```
   - 必須 100% 通過 6 大階段：(0) 靜態契約檢查（所有 `soundEngine.xxx()` 必須存在於 `src/services/audio.js`，嚴禁 `if (queue.length === 0) return onBack()` 閃退寫法）、(1) 排行榜、(2) 大廳與教師台、(3) 鷹眼神探、(4) 口說評測、(5) 核心遊戲真實互動點擊/按鍵/開房模擬、(6) 14 款遊戲 × 4 身分全量矩陣。
3. **React 與狀態安全規範**：
   - 嚴禁在 `setState(prev => ...)` updater 函式內執行副作用（如 `soundEngine`、Supabase 廣播、`onBack()`）。
   - 所有遊戲讀取 `settings?.selectedUnits` 必須加空值防禦 `(settings?.selectedUnits || [])`。
4. **Git 推送規範**：
   - 正式生產環境為 Cloudflare Pages (`https://wutaivocab.pages.dev`，綁定 `origin/main`)。
   - 日常更新推送至 `origin`（`dev` 與 `main`）；除非 Mark 特別指示，避免日常頻繁推送 `vercel` 以免耗盡免費建置配額。

---

## 二、 14 款遊戲與學習專區「按需讀取」規格書路由表 (Modular Spec Router)

> **重要原則**：為避免單一交接檔過長耗盡 Context Window，各遊戲的專屬玩法與防呆規範採**分館獨立存放**。當 Mark 指示修改某款遊戲時，**請先讀取對應的子規格檔**：

| 任務領域 / 遊戲名稱 | 對應原始碼目錄 | 必讀專屬規格書路徑 (按需讀取) |
| :--- | :--- | :--- |
| **鷹眼神探 • 找不同** (`spotter`) | `src/games/spotter/` | [`docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md`](docs/SPOTTER_DESIGN_AND_HANDOVER_MANUAL.md) |
| **多人連線對戰 & 3D 隕石防衛戰** (`battle`, `meteor`) | `src/games/battle/`, `src/games/meteor/` | [`docs/games/BATTLE_AND_METEOR_SPEC.md`](docs/games/BATTLE_AND_METEOR_SPEC.md) |
| **叢林貪食蛇、打地鼠、極速滑卡** (`snake`, `mole`, `swipe`) | `src/games/snake/`, `mole/`, `swipe/` | [`docs/games/SNAKE_AND_ARCADE_SPEC.md`](docs/games/SNAKE_AND_ARCADE_SPEC.md) |
| **經典/聽力選擇題、拼字、手寫檢定** (`quiz`, `spelling`, `handwriting`) | `src/games/quiz/`, `spelling/`, `handwriting/` | [`docs/games/QUIZ_SPELLING_HANDWRITING_SPEC.md`](docs/games/QUIZ_SPELLING_HANDWRITING_SPEC.md) |
| **密室逃脫、字母迷宮、星際記憶翻牌** (`escape`, `maze`, `memory`) | `src/games/escape/`, `maze/`, `memory/` | [`docs/games/ESCAPE_MAZE_MEMORY_SPEC.md`](docs/games/ESCAPE_MAZE_MEMORY_SPEC.md) |
| **霧臺家園、聽說實驗室、自然發音、電子書** (`town`, `langlab`, `phonics`) | `src/games/town/`, `src/features/` | [`docs/games/TOWN_AND_LANGLAB_SPEC.md`](docs/games/TOWN_AND_LANGLAB_SPEC.md) |
| **霧臺三大專案生態與雲端架構總覽** | `src/services/` | [`docs/ECOSYSTEM_OVERVIEW.md`](docs/ECOSYSTEM_OVERVIEW.md) |
| **歷史完整里程碑紀錄備查** | 全專案 | [`HANDOVER.md`](HANDOVER.md) |
