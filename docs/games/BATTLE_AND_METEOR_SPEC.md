# 多人連線對戰 (`BattleGame`) 與 3D 隕石防衛戰 (`MeteorGame`) 專屬規範

> **對應檔案**：`src/games/battle/BattleGame.jsx`、`src/games/battle/EmergencyRaidMeteor.jsx`、`src/games/meteor/MeteorGame.jsx`、`src/games/meteor/MeteorCanvas3D.jsx`

---

## 一、 多人連線對戰 (`BattleGame.jsx`) 核心架構與防呆鐵律

1. **三間固定連線擂台 (`FIXED_ARENAS`)**：
   - PIN `1001`（百合花一號館）、`1002`（雲豹二號館）、`1003`（百步蛇三號館）。
   - 每間上限 4 人；開立新擂台之房主必須已選取單元題庫（或於對戰選單內開啟單元選擇彈窗 `isScopeModalOpen`）。
   - 一般成員加入擂台無須自選題庫，自動同步房主廣播之題庫範圍。
2. **Supabase Realtime 頻道防撞鐵律 (`syncEvictChannel`)**：
   - 選單畫面 (`view === 'menu'`) 會建立探測頻道監聽三間擂台人數。
   - 當學生點擊「開立此擂台」或「加入此擂台」呼叫 `connectToArenaChannel(arena, ...)` 時，**必須先呼叫 `syncEvictChannel(topicName)`** 同步從 `supabase.getChannels()` 移除並卸載同名探測頻道，再建立正式遊戲頻道並註冊 `.on('presence', ...)`。
   - **嚴禁**對已經 `subscribe()` 的同名未清理頻道再次註冊 `.on('presence')`，否則 Supabase SDK 會拋出 `cannot add 'presence' callbacks for realtime:battle-arena-X after 'subscribe()'` 導致白屏崩潰！
3. **備戰室 (`view === 'lobby'`) 頂部排版規範**：
   - 備戰室外部容器必須使用 `relative min-h-[calc(100vh-64px)]`（不可使用 `fixed inset-0 z-10` 蓋到全域 `<Header>`）。
   - **禁止**在備戰室頂部重複渲染「備戰中 / PIN 碼直接加入」頂列，因為主卡片區已有大字體 PIN 碼與 QR Code，重複渲染會與全域頂列文字重疊。

---

## 二、 地球能量防護罩與 3D 隕石防衛規範 (`MeteorGame` & `BattleGame`)

1. **每滿 50 分自動獲得一層地球能量防護罩**：
   - 玩家分數每跨越 50 分整數倍（`Math.floor(newScore / 50) > Math.floor(prevScore / 50)`），自動增加 1 層地球護盾（邏輯層數無上限，3D 視覺光圈最多顯示 5 層）。
   - 觸發護盾時呼叫 `soundEngine.powerUp()`（定義於 `src/services/audio.js`，同時保留 `powerup()` 別名相容）。
   - **嚴禁**在 `setMyScore(prev => ...)` 等 React state updater 內部直接呼叫 `soundEngine.powerUp()`、`broadcastMyStats()` 或 `handlePlayerDead()`，所有副作用必須放在 state updater 外部！
2. **傷害抵擋與 Combo 歸零規則**：
   - 題目隕石墜地或遭受對手突襲時，若有護盾則優先扣除 1 層護盾（免扣愛心生命值）；但若為自身題目隕石墜地或答錯，Combo 必須嚴格歸零。
3. **多人突襲隕石防塞車機制 (`EmergencyRaidMeteor.jsx`)**：
   - 畫面上同時最多僅允許 **1 顆**同學突襲隕石正在下墜，等待隊列最多暫存 **1 顆**，超量直接拋棄（Drop），每顆結束後保留 1.5 秒冷卻緩衝。
   - 突襲隕石落點限制於左翼安全空域（18%~30%），避開中央題目區（35%~65%）與右上角 Combo 氣球區（74%~96%）。
4. **3D 視野參數與 GPU GLSL 著色器架構 (`MeteorCanvas3D.jsx`, `proceduralAsteroid.js`)**：
   - 攝影機深度 `z: 27`，隕石生成起點 `-75`，給予學生充足判讀時間。
   - **隕石本體 (`proceduralAsteroid.js`)**：採用 `IcosahedronGeometry(radius, 4)` 搭配自訂 **GLSL Per-Pixel 3D FBM 熔岩裂谷著色器** 與 **BackSide Fresnel 電漿日冕著色器**，徹底消除多邊形稜角感，並拖曳柔和圓形發光火焰粒子尾跡。
   - **深空與地球 (`MeteorCanvas3D.jsx`)**：背景採用 GPU 星雲著色器（紫藍與琥珀星塵雲），下方地球採用 **瑞利大氣散射（Atmospheric Limb Glow）＋ 大陸雲帶 ＋ 夜間黃金城市燈火 GLSL 著色器**。
