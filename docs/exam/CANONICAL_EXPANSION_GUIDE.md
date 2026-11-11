# 翰林 Here We Go 課本題庫高品質擴充規範與交接手冊 (Canonical Bank Expansion Guide)

本手冊為「課本題庫擴充專案 (Batches A~D)」之標準作業規範（SOP），供後續對話與所有 AI 模型（包含 Gemini Flash 3.8）遵循，杜絕題庫浮濫生成、跨單元複製、誘答樣板化、雙正解等歷史問題。

---

## 一、 擴充架構與里程碑規劃 (Roadmap)

| 擴充批次 | 目標年級與冊別 | 擴增題數 | 累計總題數 | 目前進度 |
| :--- | :--- | :--- | :--- | :--- |
| **Pruned Baseline** | 歷史清理基準點 (`cc7c275`) | 0 | 1,589 題 | ✅ 已鎖定基準 |
| **Batch A** | 低年級：Book 1 & Book 2 | +100 題 (各 50 題) | **1,689 題** | ✅ **已完成且通過深度驗收** |
| **Batch B** | 中年級：Book 3 & Book 4 | +100 題 (各 50 題) | 1,789 題 | ⏳ 待啟動 |
| **Batch C** | 高年級：Book 5 & Book 6 | +100 題 (各 50 題) | 1,889 題 | ⏳ 待啟動 |
| **Batch D** | 進階銜接：Book 7 & Book 8 | +100 題 (各 50 題) | 1,989 題 | ⏳ 待啟動 |

---

## 二、 七大命題鐵律 (Seven Item-Authoring Guardrails)

所有擴充題目均必須通過全自動靜態契約驗證（`test_batch_a_contract.mjs` 等），違反任何一條將直接阻擋建置：

1. **Canonical 唯一性**：
   - 每道題目皆為原創題目，`isCanonical: true`。
   - `scopes` 長度必須 $\le 2$（僅允許原始授課單元與 Review 單元），**嚴禁跨單元複製**。
2. **單一正解絕對防呆**：
   - 題幹情境必須充足，保證**有且僅有一個**合理答案。
   - 開放式問句必帶明確情境線索（例如指令動詞「The students leave their chairs. "______ up, please."」鎖定唯一正答 `Stand`）。
3. **性別與人稱中立防呆**：
   - 若題幹無指定人稱或無性別線索，選項**嚴禁**同時出現 `He / She` 或 `His / Her`。
4. **零樣板句、高同質性誘答**：
   - 嚴格禁用六大萬用樣板句：
     - `See you later.`
     - `Have a nice day!`
     - `You're welcome.`
     - `It is over there.`
     - `Go straight.`
     - `Turn left.`
   - 6 個誘答必須與正答處於相同詞性、主題或語意範疇（例如：代名詞對代名詞、介系詞對介系詞、時間對時間）。
5. **聽力題固定題幹與零洩漏**：
   - `L-WORD` 統一題幹：`【聽力：聽音選字】請聽英語發音，選出聽到的單字：`
   - `L-RESP` 統一題幹：`【聽力：聽問句選回應】請聽英語問句，選出最適合的回應句：`
   - 英語逐字稿**僅能存於** `media.audioText`，`question` 欄位不得出現任何英文單字或句子。
6. **詳解 100% 同步**：
   - 詳解必須具體說明「正答理由」與「誘答排除原因」，不得引用已替換的舊題目或舊選項。
7. **全域結構契約**：
   - 選項固定為 7 項 (`options.length === 7`)。
   - 題庫陣列內正答索引統一為 `answer: 0`（出題引擎運行時自動打散隨機排列）。
   - 挖空處統一為 6 個底線 `______`。
   - 題幹與選項結尾不得殘留雙句點 `..`。

---

## 三、 每冊 50 題精準題型配比 (Quota)

每冊新增 50 題，必須嚴格按照以下黃金比例配置：

| 題型代碼 | 題型名稱 | 每冊配額 | 測驗能力與命題要點 |
| :--- | :--- | :--- | :--- |
| **`L-WORD`** | 聽音選字 | **8 題** | 單字自然發音、易混淆子音/母音辨析（純中文引導） |
| **`L-RESP`** | 聽問句選回應 | **8 題** | 日常問答、社交禮儀對話回應（純中文引導） |
| **`V-MEAN`** | 單字字義理解 | **10 題** | 課本核心單字中英對應、分類題、詞彙替換 |
| **`G-MC`** | 文法選擇題 | **10 題** | 主詞動詞一致性 (be動詞/助動詞)、介系詞搭配、單複數名詞 |
| **`G-CTX`** | 情境語用克漏字 | **6 題** | 教室情境、真實生活語境溝通應用 |
| **`R-COMP`** | 閱讀短文理解 | **8 題** | 30~50 字生活短文、對話小品閱讀理解 |
| **合計** | **全題型均衡覆蓋** | **50 題 / 冊** | **100 題 / 批次 (2 冊)** |

---

## 四、 全站動態數據綁定規範 (Zero Hardcoding)

為確保往後 Batch B、C、D 擴充時無需逐一手動修改全站 UI 數字：
1. **單一數據源**：所有題數分母、各冊進度總題數，統一從 `src/data/exam/canonicalMapping.js` 之 `CANONICAL_STATS` 匯出：
   ```js
   import { CANONICAL_STATS } from '../data/exam/canonicalMapping.js';
   const CURRICULUM_TOTAL = CANONICAL_STATS.canonicalItems; // 自動隨題庫動態更新
   const BOOK_COUNTS = CANONICAL_STATS.bookCounts;
   ```
2. **嚴禁後備硬編碼數字**：
   - 嚴禁寫出 `|| 1589`、`|| 1689`、`|| 209`、`|| 204` 等固定常數。
3. **契約自動掃描防護**：
   - `scripts/test_batch_a_contract.mjs` 會自動掃描 UI 與數據模組，若偵測到任何殘留寫死的總數或冊數，測試將立即中斷。

---

## 五、 Rollback 工具安全邊界 (Safety Rollback Policy)

1. `scripts/rollback_canonical_migration.mjs` 為「歷史 Prune 應急回滾工具」，其設計僅能在題庫為基準 1,589 題（commit `cc7c275`）時使用。
2. 當題庫已包含擴充批次（如 Batch A `_ba_` 或題數 !== 1589）時，回滾腳本具有強固前置阻擋，嚴禁覆蓋現有題庫。
3. 回滾腳本具備**交易式原子置換機制（Transactional Swap）**：預先檢查所有備份檔案存在性、比對 SHA-256、建立 `.active.bak` 快照，若有任何模組載入錯誤立即自動還原。

---

## 六、 驗收與回歸測試標準指令 (Quality Gates)

任何新批次加入或程式碼修改後，必須 100% 通過以下 5 大驗證與 6 階段煙霧測試：

```bash
# 1. 執行 5 大契約與語意驗證關卡
node scripts/verify_canonical_schema.mjs
node scripts/audit_semantic_gates.mjs
node scripts/test_canonical_migration.mjs
node scripts/test_prune_roundtrip.mjs
node scripts/test_batch_a_contract.mjs

# 2. 執行生產打包與 6 階段全自動無頭 Chrome 防回歸測試
npm run build && node scripts/smoke_test.mjs
```
