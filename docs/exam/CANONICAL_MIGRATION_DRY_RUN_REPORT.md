# 課本題庫 Canonical 正規化（方案 A）Dry-Run 遷移報告與安全回滾指引

**報告產生時間**：2026-11-11  
**架構基準**：WutaiVocab 2.0 題庫品質大修訂里程碑  
**工程狀態**：非破壞性程式準備已全部就緒（Non-destructive Ready），正式刪除程序處於安全待命狀態（Pending Final Approval）

---

## 一、方案 A 核心目標與邊界定義

依據深度題庫體檢與 ChatGPT 複檢指引，本專案課本動態選擇題庫（`HERE_WE_GO_MCQ_BANK`）存在 1,728 筆同冊跨單元無意義複製之複本（如單字表無差別複製至 Starter、Review、Festival）。

本遷移採用**「冊內正規化（In-book Canonical）」**核心原則：
1. **同冊去重**：同冊內題幹與正答完全相同之題目，僅保留 1 筆 Canonical Question。
2. **跨冊保留**：跨冊（如低年級與高年級）複現之 22 組基礎單字題目保留各自獨立進度與題號，以符合不同學期課綱評量標準。
3. **無損覆蓋（Scopes）**：保留之 Canonical 題目新增 `scopes` 陣列（如 `['Unit 1', 'Review 1']`），學生在任何相關單元練習時均能無縫抽到該題，絕不遺漏評量範疇。

---

## 二、題庫總量與各冊題量安全邊際確認

全庫經 Dry-Run 嚴密排查統計結果如下：

| 指標項目 | 統計數據 | 說明 |
| :--- | :--- | :--- |
| **目前全庫總題數** | **3,317 題** | 包含 1,589 題 Canonical ＋ 1,728 筆複本 |
| **冊內 Canonical 題數** | **1,589 題** | 去重後最終保留之純淨題量 |
| **同冊待修剪複本數** | **1,728 題** | 待正式核可後安全刪除之複本 |
| **跨冊獨立保留題數** | **22 組** | 跨年級課綱詞彙，維持獨立進度 |

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

**全冊 11 本書籍之獨立 Canonical 題數皆穩定落在 126～170 題之間，絕對滿足任何大考組卷契約！**

---

## 三、非破壞性程式準備清單（本次已實裝完成）

為確保學生作答與雲端資料 100% 安全，本階段**未在 `main` 刪除任何一題**，而是以「元資料擴充 ＋ 系統無縫相容」完成以下工程架構：

1. **建立映射與元資料模組 (`src/data/exam/canonicalMapping.js`)**：
   - 導出 `LEGACY_TO_CANONICAL_MAP`（3,317 筆全量映射）。
   - 導出 `CANONICAL_META_MAP`（1,589 筆標準題元資料）。
   - 導出 `resolveCanonicalId(id)` 與 `isCanonicalId(id)` 查表工具。
2. **擴充資料模型 (`src/data/hereWeGoMcqBank.js`)**：
   - 全量 3,317 題已植入 `canonicalId`、`primaryScope`、`scopes`、`isCanonical`。
   - 1,589 題標記 `isCanonical: true`，1,728 題標記 `isCanonical: false`。
3. **組卷與易錯題去重優化 (`src/games/exam/PureMcqExamView.jsx`)**：
   - `curriculumPool` 導入 `scopes` 判定與 `canonicalId` 天然去重：即便在同測驗選中多個單元，同題絕不重複出現。
   - `mistakeQuestions` 支援雙向相容：學生既有錯題本若含有舊題號，自動對齊至 Canonical 題目。
   - `finalizeExam` 結算時以 Canonical ID 統一記錄錯題連續答對次數，達 2 次連對順利畢業。
4. **滾動精熟引擎適配 (`src/utils/masteryHelper.js`)**：
   - `recordExamMasterySession` 支援 `curriculum` 軌道以 Canonical ID 記錄精熟。
   - 課本精熟分母精準設定為 **1,589 題**，徹底杜絕學生藉由刷同字複本虛增精熟率。
5. **CI 契約測試守護 (`scripts/verify_canonical_schema.mjs`)**：
   - 納入全域 CI 驗證，自動檢查：總題數恰為 3,317、Canonical 恰為 1,589、Clones 恰為 1,728、映射表完整度 100%、各冊題數皆 `>= 100`。
6. **緊急安全回滾工具 (`scripts/rollback_canonical_migration.mjs`)**：
   - 若有任何非預期需要，可單鍵執行 `node scripts/rollback_canonical_migration.mjs`，即時將題庫還原至純淨舊版綱要。

---

## 四、正式刪除 1,728 筆複本之啟動條件

待 ChatGPT 與 Mark 複核本報告與 Batch 5 修復後，正式執行刪除只需執行單一指令：
```bash
node scripts/execute_canonical_prune.mjs
```
屆時 `hereWeGoMcqBank.js` 將無痛精簡為 1,589 題，所有組卷、篩選與精熟引擎已事先就緒，完全零破壞！
