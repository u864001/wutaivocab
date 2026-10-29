# 單字密室逃脫 (`VocabEscapeGame`)、字母迷宮 (`AlphabetMazeGame`) 與星際記憶翻牌 (`MemoryGameSingle`) 專屬規範

> **對應檔案**：`src/games/escape/VocabEscapeGame.jsx`、`src/games/escape/puzzles/SpellingPuzzle.jsx`、`src/games/maze/AlphabetMazeGame.jsx`、`src/games/memory/MemoryGameSingle.jsx`

---

## 一、 單字密室逃脫 (`VocabEscapeGame.jsx`) 核心規範

1. **過關秒數鎖定與防止 `addQuestPoints` 觸發重置鐵律**：
   - 當學生解完最後一道謎題通關時，會呼叫 `addQuestPoints` 更新 `StudentContext` 的 `currentStudent`。
   - **絕對禁止**將 `currentStudent` 放入 `initCampaign` 的 `useCallback` 依賴陣列，且 `initCampaign` 開頭必須檢查 `if (gameStateRef.current === 'playing' || gameStateRef.current === 'victory') return;`，否則發放積分當下會觸發 `initCampaign` 將 `timeElapsed` 歸零，造成排行榜出現「1 秒通關」異常！
   - 通關瞬間將秒數鎖定於 `finalTime` 與 `finalTimeRef.current`（最小合法秒數 `>= 2` 秒）。
2. **排行榜排位規則（秒數低優先）**：
   - 密室逃脫與找不同在 `supabase.js` 的排行榜排序為 `time ASC`（秒數越短名次越高），同秒數再比 `score DESC`（剩餘愛心數 1~3）。
   - 資料庫與前端皆嚴格過濾 `time <= 1` 的歷史異常秒數。
3. **長單字拼字謎題 (`SpellingPuzzle.jsx`)**：
   - 複合詞依空格自動切分為獨立膠囊群組；`>= 10` 字母動態縮小卡槽並支援 `flex-wrap`，中央常駐「⌫ 刪除上一格」與「🔄 全部重排」按鈕。

---

## 二、 星際記憶翻牌 (`MemoryGameSingle.jsx`) 規範

1. **20 張複合牌組架構**：
   - 每局由 8 組中英單字配對（16 張）＋ 4 張精選功能卡（偷看卡 `peek`、加分卡 `bonus`、金幣雨 `coin`、雷達卡 `radar`、閃電卡 `lightning` 5 選 4）組成共 20 張牌。
2. **連擊防呆與空值保護**：
   - 在已翻開 2 張比對中、已配對或偷看狀態時鎖定重複點擊。
   - 讀取 `settings?.selectedUnits` 必須加 `(settings?.selectedUnits || [])` 防護。

---

## 三、 字母迷宮探險 (`AlphabetMazeGame.jsx`) 規範

1. **大廳直通與方向控制**：
   - 支援鍵盤方向鍵與畫面觸控按鈕巡航收集字母，完成時自動觸發榮譽榜結算卡。
