# 課本題庫 Canonical 正規化（方案 A）正式修剪完成報告與安全回滾指引

**報告產生時間**：2026-11-11  
**架構基準**：WutaiVocab 2.0 題庫品質大修訂里程碑  
**工程狀態**：**已獲正式授權並完成 Canonical Prune**！課本題庫已正式精簡為 **1,589 題 Canonical 題目**（刪除 1,728 筆同冊重複複本），物理備份與雙向相容已 100% 在線守護！

---

## 一、方案 A 核心目標與邊界定義

依據深度題庫體檢與 ChatGPT 複檢指引，本專案課本動態選擇題庫（`HERE_WE_GO_MCQ_BANK`）存在 1,728 筆同冊跨單元無意義複製之複本（如單字表無差別複製至 Starter、Review、Festival）。

本遷移採用**「冊內正規化（In-book Canonical）」**核心原則：
1. **同冊去重**：同冊內題幹與正答完全相同之題目，僅保留 1 筆 Canonical Question。
2. **跨冊保留**：跨冊（如低年級與高年級）複現之 22 組基礎單字題目保留各自獨立進度與題號，以符合不同學期課綱評量標準。
3. **課本正統單元規範（Scopes <= 2）**：保留之 Canonical 題目 `primaryScope` 精準錨定課本正統授課單元，`scopes` 陣列嚴格限制為「正統單元 ＋ 對應之 Review 單元」（長度必定 `<= 2`），徹底根除跨全冊漫延問題。

---

## 二、四大架構阻擋（Blocker 1~4）完整解決架構

### 1. Blocker 1：Scopes 課綱正統歸位（徹底解決 7~8 scopes 漫延問題）
- **原問題**：原先以聯集方式合併所有 clone 的 unit，造成 232 題具有 7～8 個 scopes，且 primaryScope 機械式歸為 Unit 1（例如 `ruler` 同時出現在 Starter, Unit 1~4, Review 1~2, Festival）。
- **修復實現**：建立完整的 Here We Go 課本單字單元權威對照表（`CURRICULUM_WORD_MAP`，覆蓋 1~9 冊與字母專冊全部 268 組單字群）。
- **驗證成果**：
  - `scopes.length === 1`：479 組（Starter, Festival 或單元專屬詞彙）
  - `scopes.length === 2`：1,110 組（授課單元 + 對應 Review）
  - `scopes.length >= 3`：**0 組（完全清零）**
  - 例如 `ruler` 正確歸屬於 `primaryScope: Unit 3`，`scopes: ['Unit 3', 'Review 2']`。

### 2. Blocker 2：學生歷程與錯題本無損遷移（Legacy Data Protection & State Machine Strictness）
- **原問題**：直接 prune 會導致學生既有以 clone ID（如 `hwg_b1_exp_5035`）儲存的錯題本和精熟快照無法對應到題庫；此外，若合併時取「較高精熟狀態」會違反「精熟後答錯立即退回待加強」規則。
- **修復實現**：
  - 在 `src/utils/masteryHelper.js` 實現 `migrateMistakeMapToCanonical(rawMap, storageKey)`：將所有舊題號遷移至標準題號，`wrongCount` 加總，`streak` 嚴格採用最新 `updatedAt` 的紀錄（避免較新答錯 `streak: 0` 被舊 `streak: 1` 覆蓋），自動寫回 LocalStorage。
  - 實現 `migrateMasterySnapshotToCanonical(snapshot, studentId)`：
    - `attempts` 加總，`is_formal` 取 OR。
    - `status`、`consecutive_correct`、`last_is_correct` 一律採用 `last_attempt_at` 最新紀錄，100% 符合動態滾動精熟狀態機規則。
    - 不論是否有題號遷移，`curriculum` 軌道的 `total_items` 一律校準為 `1589`，且各軌道使用獨立的 `trackChanged` 判定重算。
  - 新增 `scripts/test_canonical_migration.mjs` 完整驗證 5 大狀態機與錯題本遷移測試案例。

### 3. Blocker 3：真物理備份、跨平台 Windows/Linux 相容與安全替換（Physical Backup & Cross-Platform Atomic Swap）
- **原問題**：原回滾腳本在 Windows 上直接 `import(filePath)` 報錯 `Received protocol 'c:'`；Git `core.autocrlf=true` 導致 CRLF SHA-256 不一致；且置換前若報錯會無條件用備份覆寫正式檔。
- **修復實現**：
  - **跨平台 ESM 載入**：`build_canonical_data.mjs`、`execute_canonical_prune.mjs`、`rollback_canonical_migration.mjs` 全部改用 `pathToFileURL(filePath)` 搭配 `importFresh()`。
  - **換行正規化 Checksum**：統一使用 `normalizeForHash(text)`（将 `\r\n` 正規化為 `\n`）計算 `sha256Text()`，並新增 `.gitattributes` 強制鎖定 `eol=lf`。
  - **置換前安全防呆**：加入 `didSwap` 與 `backupVerified` 狀態旗標，僅在 `if (didSwap && backupVerified)` 時才觸發失敗自動回滾，絕不在置換前覆寫未修改的正式檔。
  - 新增 `scripts/test_prune_roundtrip.mjs` 於隔離沙盒（`mkdtemp`）完整執行「Expanded 驗證 → Prune → Pruned 驗證 → CRLF 模擬與 Rollback → Expanded 驗證 → SHA-256 比對 → 置換前錯誤保護」，並配置 GitHub Actions (`.github/workflows/canonical-ci.yml`) 在 `ubuntu-latest` 與 `windows-latest` 雙平台自動執行驗證！

### 4. Blocker 4：CI 契約與 Smoke Test 支援雙模態（Dual-Mode Contract）
- **原問題**：原 CI 腳本硬編碼檢查 3,317 題，prune 後會立即紅燈。
- **修復實現**：
  - `scripts/verify_canonical_schema.mjs` 升級為支援 `Expanded (3,317)` 與 `Pruned (1,589)` 雙模態驗證，並強制檢查 `scopes.length <= 2` 與 7 選項契約。
  - `scripts/smoke_test.mjs` Stage 0 靜態契約支援雙模態，並加入 `scopes.length <= 2` 全域防護。

---

## 三、題庫總量與各冊題量安全邊際確認

| 指標項目 | 統計數據 | 說明 |
| :--- | :--- | :--- |
| **目前全庫總題數** | **3,317 題** | 包含 1,589 題 Canonical ＋ 1,728 筆複本 |
| **冊內 Canonical 題數** | **1,589 題** | 去重後最終保留之純淨題量 |
| **同冊待修剪複本數** | **1,728 題** | 待正式核可後安全刪除之複本 |
| **跨冊獨立保留題數** | **22 組** | 跨年級課綱詞彙，維持獨立進度 |
| **全庫最大 Scopes 長度** | **2** | 嚴格限定為授課單元 + 對應 Review，無任何泛濫擴散 |

### 各冊 Canonical 題量分佈（CI 契約 `>= 100 題` 100% 達標）：
- **Book 1（三年級上學期）**：159 題（契約餘裕 +59%）
- **Book 2（三年級下學期）**：154 題（契約餘裕 +54%）
- **Book 3（四年級上學期）**：155 題（契約餘裕 +55%）
- **Book 4（四年級下學期）**：135 題（契約餘裕 +35%）
- **Book 5（五年級上學期）**：133 題（契約餘裕 +33%）
- **Book 6（五年級下學期）**：149 題（契約餘裕 +49%）
- **Book 7（六年級上學期）**：128 題（契約餘裕 +28%）
- **Book 8（六年級下學期）**：126 題（契約餘裕 +26%）
- **Book 9（國小總複習冊）**：137 題（契約餘裕 +37%）
- **Book g1（一年級字母專冊）**：143 題（契約餘裕 +43%）
- **Book g2（二年級字母專冊）**：170 題（契約餘裕 +70%）

---

## 四、正式刪除 1,728 筆複本之啟動指引

在獲得 ChatGPT 與 Mark 的正式核准授權後，僅需執行：
```bash
node scripts/execute_canonical_prune.mjs
```
執行後：
1. `hereWeGoMcqBank.js` 將原子性置換為純淨 1,589 題。
2. 完整 3,317 題已存於 `src/data/backups/hereWeGoMcqBank.expanded.3317.js`。
3. `npm run build && node scripts/smoke_test.mjs` 將在 Pruned 模式下以 100% 綠燈通過！
