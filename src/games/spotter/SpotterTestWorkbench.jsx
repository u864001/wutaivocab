import React, { useState, useMemo } from 'react';
import {
  ALL_SCENES_BY_BOOK,
  SPOTTER_SCENES_BY_BOOK,
  getScenesForBook
} from './spotterData';
import {
  ArrowLeft, Eye, Layers, Sparkles, RefreshCw,
  CheckCircle2, ShieldCheck, Crosshair, Grid,
  AlertCircle
} from 'lucide-react';

// 8 個冊次的標籤與名稱
const BOOKS_CONFIG = [
  { id: '1', grade: '三上', title: '第 1 冊', sub: '彩虹文具 / 阿姆斯特丹果園集市' },
  { id: '2', grade: '三下', title: '第 2 冊', sub: '陽光農莊公園 / 京都職人小鎮' },
  { id: '3', grade: '四上', title: '第 3 冊', sub: '微風氣象湖畔 / 阿爾卑斯野餐台' },
  { id: '4', grade: '四下', title: '第 4 冊', sub: '英倫時鐘家居 / 泰晤士皇家地標廣場' },
  { id: '5', grade: '五上', title: '第 5 冊', sub: '巴黎羅浮宮藝文廣場 / 蒙馬特畫家村' },
  { id: '6', grade: '五下', title: '第 6 冊', sub: '自然歷史博物館 / 新加坡濱海灣花園' },
  { id: '7', grade: '六上', title: '第 7 冊', sub: '世界節慶環球港灣 / 都會捷運轉運站' },
  { id: '8', grade: '六下', title: '第 8 冊', sub: '四季時光庭園 / 紐約第五大道名店街' }
];

export const SpotterTestWorkbench = ({ onBack }) => {
  // 選取冊次 (預設第 1 冊)
  const [selectedBookId, setSelectedBookId] = useState('1');

  // 取得該冊次的所有場景清單
  const availableScenes = useMemo(() => {
    return getScenesForBook(selectedBookId);
  }, [selectedBookId]);

  // 選取場景索引 (預設第 2 場景如果有的話，方便檢視阿姆斯特丹；否則第 1 場景)
  const [selectedSceneIdx, setSelectedSceneIdx] = useState(
    selectedBookId === '1' && availableScenes.length > 1 ? 1 : 0
  );

  // 當切換冊次時，重設場景索引
  // 變異版本檢視狀態
  const [selectedSideBySideVariant, setSelectedSideBySideVariant] = useState('varA');
  const [globalMatrixVariant, setGlobalMatrixVariant] = useState('varA');
  const [cardVariantMap, setCardVariantMap] = useState({});

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
    const scenes = getScenesForBook(bookId);
    setSelectedSceneIdx((bookId === '1' || bookId === '2' || bookId === '3' || bookId === '4') && scenes.length > 1 ? 1 : 0);
    setSelectedWord(null);
    setSelectedSideBySideVariant('varA');
    setGlobalMatrixVariant('varA');
    setCardVariantMap({});
  };

  const currentScene = availableScenes[selectedSceneIdx] || availableScenes[0] || SPOTTER_SCENES_BY_BOOK['1'];

  // 檢驗模式: 'sideBySide' (全幅雙圖對照) | 'zoomMatrix' (單字顯微矩陣) | 'dynamicSim' (8選5抽題模擬) | 'roadmap' (全書藍圖)
  const [inspectMode, setInspectMode] = useState('sideBySide');

  // 視圖圖層開關
  const [showHitboxes, setShowHitboxes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showSlotBounds, setShowSlotBounds] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // ── 動態 8 選 5 模擬器狀態 ──
  const [simSeed, setSimSeed] = useState(() => Date.now());
  const [solvedWords, setSolvedWords] = useState(new Set());
  const [lastClickLog, setLastClickLog] = useState(null);

  // 隨機抽 5 個目標，並為每個目標隨機分派已就緒之變異型態 (Var A, Var B, Var C)
  const dynamicSimData = useMemo(() => {
    void simSeed; // 依賴 simSeed 每次觸發重新抽題
    const items = currentScene.targetItems || [];
    if (items.length <= 5) {
      return {
        chosen: items,
        unchosen: [],
        chosenWords: new Set(items.map(i => i.word))
      };
    }
    // 打亂抽取 5 個
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 5).map(item => {
      const availableVars = item.variants ? item.variants.filter(v => v.id !== 'base' && v.patchFile) : [];
      const pickedVar = availableVars.length > 0 ? availableVars[Math.floor(Math.random() * availableVars.length)] : null;
      return {
        ...item,
        patchFile: pickedVar?.patchFile || item.patchFile,
        variantName: pickedVar?.name || '變異 A',
        variantLabel: pickedVar?.label || ''
      };
    });
    const unchosen = shuffled.slice(5);
    return {
      chosen,
      unchosen,
      chosenWords: new Set(chosen.map(i => i.word))
    };
  }, [currentScene, simSeed]);

  // 重新隨機抽取 5 個目標
  const handleRerollSim = () => {
    setSimSeed(Date.now());
    setSolvedWords(new Set());
    setLastClickLog({ type: 'info', text: '已重新隨機抽取 5 個變異單字！' });
  };

  // 模擬點擊處理
  const handleSimSvgClick = (e, isRight) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return;
    const svgPt = pt.matrixTransform(screenCTM.inverse());
    const cx = svgPt.x;
    const cy = svgPt.y;

    const items = currentScene.targetItems || [];
    let hitItem = null;

    for (const item of items) {
      const rx = (item.radiusX || item.radius || 50) + 10;
      const ry = (item.radiusY || item.radius || 50) + 10;
      let dx = cx - item.x;
      let dy = cy - item.y;
      if (item.rotate) {
        const rad = (-item.rotate * Math.PI) / 180;
        const nx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ny = dx * Math.sin(rad) + dy * Math.cos(rad);
        dx = nx;
        dy = ny;
      }
      if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1) {
        hitItem = item;
        break;
      }
    }

    if (hitItem) {
      const isChosen = dynamicSimData.chosenWords.has(hitItem.word);
      if (isChosen) {
        setSolvedWords(prev => new Set([...prev, hitItem.word]));
        setLastClickLog({
          type: 'success',
          text: `🎯 命中本局相異點！【${hitItem.word} (${hitItem.wordZh})】判定精準覆蓋，已破解！`
        });
      } else {
        setLastClickLog({
          type: 'shield',
          text: `🛡️ 完美防禦！【${hitItem.word} (${hitItem.wordZh})】本局未抽中，左右兩圖完全相同，不會誤扣心！`
        });
      }
    } else {
      setLastClickLog({
        type: 'miss',
        text: `📍 點擊位置 (${Math.round(cx)}, ${Math.round(cy)}) 為背景無相異區，正常無判定。`
      });
    }
  };

  // 顏色分配器
  const targetColors = [
    '#f43f5e', '#10b981', '#0ea5e9', '#f59e0b',
    '#8b5cf6', '#eab308', '#06b6d4', '#ec4899'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none font-sans">
      {/* ── 1. 頂部導覽列 ── */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700"
            title="返回鷹眼神探遊戲"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>返回遊戲</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-amber-400 flex items-center gap-1.5">
                🔬 鷹眼神探 • 變異檢驗工作台
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                專案負責人 Mark 專屬審核
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              支援 1～8 冊場景 1～5 判定圈、羽化無縫裁切、以及 A 方案「動態 8 選 5 槽位變異」全矩陣檢定
            </p>
          </div>
        </div>

        {/* 檢驗模式切換籤 */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setInspectMode('sideBySide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              inspectMode === 'sideBySide'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>全幅雙圖對照</span>
          </button>
          <button
            onClick={() => setInspectMode('zoomMatrix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              inspectMode === 'zoomMatrix'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>8 大目標顯微矩陣</span>
          </button>
          <button
            onClick={() => setInspectMode('dynamicSim')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              inspectMode === 'dynamicSim'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🎲 動態 8 選 5 模擬</span>
          </button>
          <button
            onClick={() => setInspectMode('roadmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              inspectMode === 'roadmap'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>40 場景藍圖</span>
          </button>
        </div>
      </header>

      {/* ── 2. 冊次 (Book 1~8) 與場景 (Scene 1~5) 快速切換器 ── */}
      <section className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* 冊次按鈕組 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-black text-slate-400 shrink-0 mr-1">教材冊次:</span>
            {BOOKS_CONFIG.map((b) => {
              const isActive = selectedBookId === b.id;
              const hasScene2 = true; // Book 1 到 Book 8 全系列皆已實裝 Scene 2
              return (
                <button
                  key={b.id}
                  onClick={() => handleSelectBook(b.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-600 text-white ring-2 ring-sky-400/50 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 font-mono">{b.grade}</span>
                  <span>{b.title}</span>
                  {hasScene2 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="包含多場景" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 場景按鈕組 (Scene 1 ~ 5) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-black text-slate-400">場景選定:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[1, 2, 3, 4, 5].map((sNum, idx) => {
                const sceneObj = availableScenes[idx];
                const isReady = sceneObj && sceneObj.status !== 'roadmap';
                const isRoadmap = sceneObj && sceneObj.status === 'roadmap';
                const isSelected = selectedSceneIdx === idx;

                return (
                  <button
                    key={sNum}
                    onClick={() => {
                      setSelectedSceneIdx(idx);
                      setSelectedWord(null);
                    }}
                    disabled={!sceneObj}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : isReady
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        : isRoadmap
                        ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                        : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>圖 {sNum}</span>
                    {isReady && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    {isRoadmap && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    {!sceneObj && <span className="text-[9px] text-slate-600">待繪</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 當前選定場景簡介 Bar */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-emerald-400">{currentScene.titleZh}</span>
            <span className="text-slate-400 font-mono text-[11px]">({currentScene.width} × {currentScene.height})</span>
            {currentScene.isDynamicReady && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-[10px]">
                ⚡ A 方案動態 Slot 變異已實裝
              </span>
            )}
            {currentScene.status === 'roadmap' && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[10px]">
                ⏳ 藍圖規劃中（即將排程生成成對底圖與相異圖）
              </span>
            )}
          </div>

          {/* 視圖輔助開關 (僅在全幅對照時顯示) */}
          {inspectMode === 'sideBySide' && (
            <div className="flex items-center gap-3 text-[11px]">
              <label className="flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showHitboxes}
                  onChange={(e) => setShowHitboxes(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-0"
                />
                <span>判定圈 (Hitboxes)</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-0"
                />
                <span>單字標籤</span>
              </label>
              {currentScene.isDynamicReady && (
                <label className="flex items-center gap-1 cursor-pointer text-purple-300 hover:text-purple-100">
                  <input
                    type="checkbox"
                    checked={showSlotBounds}
                    onChange={(e) => setShowSlotBounds(e.target.checked)}
                    className="rounded text-purple-500 focus:ring-0"
                  />
                  <span>羽化裁切槽位 (Slot Box)</span>
                </label>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. 主要工作台內容區 ── */}
      <main className="flex-1 p-4 overflow-y-auto">
        {/* ──────── 模式 1: 全幅雙圖對照 ──────── */}
        {inspectMode === 'sideBySide' && (
          <div className="flex flex-col gap-4 max-w-7xl mx-auto">
            {/* 左右對照雙圖容器 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 左圖: 原圖基準 */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl">
                <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-sky-300 font-bold text-xs border border-sky-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>左圖：原圖基準 (Base Image)</span>
                </div>

                <div className="relative w-full aspect-[1376/768]">
                  <img
                    src={currentScene.baseImage}
                    alt="Base"
                    className="w-full h-full object-cover block"
                  />

                  {/* SVG 判定圈與膠囊覆蓋層 */}
                  <svg
                    viewBox={`0 0 ${currentScene.width} ${currentScene.height}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {currentScene.targetItems?.map((item, idx) => {
                      const isHighlighted = selectedWord === item.word;
                      const color = targetColors[idx % targetColors.length];
                      const rx = item.radiusX || item.radius || 50;
                      const ry = item.radiusY || item.radius || 50;

                      return (
                        <g key={`left-${item.word}`}>
                          {/* 判定圈 */}
                          {showHitboxes && (
                            <ellipse
                              cx={item.x}
                              cy={item.y}
                              rx={rx}
                              ry={ry}
                              transform={item.rotate ? `rotate(${item.rotate} ${item.x} ${item.y})` : undefined}
                              fill={isHighlighted ? `${color}40` : `${color}15`}
                              stroke={color}
                              strokeWidth={isHighlighted ? 4 : 2}
                              strokeDasharray={isHighlighted ? 'none' : '6 4'}
                              className="transition-all duration-300"
                            />
                          )}

                          {/* 槽位裁切框 */}
                          {showSlotBounds && item.slot && (
                            <rect
                              x={item.slot.x}
                              y={item.slot.y}
                              width={item.slot.w}
                              height={item.slot.h}
                              fill="none"
                              stroke="#c084fc"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                            />
                          )}

                          {/* 核心點 */}
                          {showHitboxes && (
                            <circle cx={item.x} cy={item.y} r={isHighlighted ? 6 : 4} fill={color} />
                          )}

                          {/* 單字標籤膠囊 */}
                          {showLabels && (
                            <g transform={`translate(${item.x}, ${Math.max(20, item.y - ry - 14)})`}>
                              <rect
                                x="-55"
                                y="-12"
                                width="110"
                                height="22"
                                rx="6"
                                fill="#0f172a"
                                stroke={color}
                                strokeWidth="1.5"
                                opacity="0.9"
                              />
                              <text
                                x="0"
                                y="3"
                                fill="#ffffff"
                                fontSize="11"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {item.word} ({item.wordZh})
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* 右圖: 全變異圖 */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl">
                <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none">
                  <div className="px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-rose-300 font-bold text-xs border border-rose-500/30 flex items-center gap-1.5 pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    <span>右圖：成對變異圖 ({selectedSideBySideVariant === 'varB' ? '變異 B' : selectedSideBySideVariant === 'varC' ? '變異 C' : '變異 A'})</span>
                  </div>

                  {(currentScene.diffImageVarB || currentScene.diffImageVarC) && (
                    <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
                      <span className="text-[10px] text-slate-400 font-bold px-1">切換全圖變異:</span>
                      <button
                        onClick={() => setSelectedSideBySideVariant('varA')}
                        className={`px-2 py-0.5 rounded text-[11px] font-black transition-all ${
                          selectedSideBySideVariant === 'varA'
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        變異 A
                      </button>
                      {currentScene.diffImageVarB && (
                        <button
                          onClick={() => setSelectedSideBySideVariant('varB')}
                          className={`px-2 py-0.5 rounded text-[11px] font-black transition-all ${
                            selectedSideBySideVariant === 'varB'
                              ? 'bg-amber-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          變異 B
                        </button>
                      )}
                      {currentScene.diffImageVarC && (
                        <button
                          onClick={() => setSelectedSideBySideVariant('varC')}
                          className={`px-2 py-0.5 rounded text-[11px] font-black transition-all ${
                            selectedSideBySideVariant === 'varC'
                              ? 'bg-teal-600 text-white shadow'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          變異 C
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative w-full aspect-[1376/768]">
                  <img
                    src={
                      selectedSideBySideVariant === 'varB'
                        ? (currentScene.diffImageVarB || currentScene.diffImage)
                        : selectedSideBySideVariant === 'varC'
                        ? (currentScene.diffImageVarC || currentScene.diffImage)
                        : currentScene.diffImage
                    }
                    alt="Diff"
                    className="w-full h-full object-cover block"
                  />

                  {/* SVG 判定圈與膠囊覆蓋層 */}
                  <svg
                    viewBox={`0 0 ${currentScene.width} ${currentScene.height}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {currentScene.targetItems?.map((item, idx) => {
                      const isHighlighted = selectedWord === item.word;
                      const color = targetColors[idx % targetColors.length];
                      const rx = item.radiusX || item.radius || 50;
                      const ry = item.radiusY || item.radius || 50;

                      return (
                        <g key={`right-${item.word}`}>
                          {/* 判定圈 */}
                          {showHitboxes && (
                            <ellipse
                              cx={item.x}
                              cy={item.y}
                              rx={rx}
                              ry={ry}
                              transform={item.rotate ? `rotate(${item.rotate} ${item.x} ${item.y})` : undefined}
                              fill={isHighlighted ? `${color}40` : `${color}15`}
                              stroke={color}
                              strokeWidth={isHighlighted ? 4 : 2}
                              strokeDasharray={isHighlighted ? 'none' : '6 4'}
                              className="transition-all duration-300"
                            />
                          )}

                          {/* 槽位裁切框 */}
                          {showSlotBounds && item.slot && (
                            <rect
                              x={item.slot.x}
                              y={item.slot.y}
                              width={item.slot.w}
                              height={item.slot.h}
                              fill="none"
                              stroke="#c084fc"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                            />
                          )}

                          {/* 核心點 */}
                          {showHitboxes && (
                            <circle cx={item.x} cy={item.y} r={isHighlighted ? 6 : 4} fill={color} />
                          )}

                          {/* 單字標籤膠囊 */}
                          {showLabels && (
                            <g transform={`translate(${item.x}, ${Math.max(20, item.y - ry - 14)})`}>
                              <rect
                                x="-55"
                                y="-12"
                                width="110"
                                height="22"
                                rx="6"
                                fill="#0f172a"
                                stroke={color}
                                strokeWidth="1.5"
                                opacity="0.9"
                              />
                              <text
                                x="0"
                                y="3"
                                fill="#ffffff"
                                fontSize="11"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {item.word} ({item.wordZh})
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* 底部單字點選聚光條 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  點選單字聚焦高亮判定圈：
                </span>
                {selectedWord && (
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                  >
                    取消聚焦
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {currentScene.targetItems?.map((item, idx) => {
                  const isSelected = selectedWord === item.word;
                  const color = targetColors[idx % targetColors.length];
                  return (
                    <button
                      key={item.word}
                      onClick={() => setSelectedWord(isSelected ? null : item.word)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>{item.word}</span>
                      <span className="text-[11px] opacity-75">({item.wordZh})</span>
                    </button>
                  );
                })}
              </div>

              {/* 聚焦單字詳細說明 */}
              {selectedWord && (() => {
                const item = currentScene.targetItems?.find(i => i.word === selectedWord);
                if (!item) return null;
                return (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-amber-300">{item.word} ({item.wordZh})</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {item.typeZh}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        座標: ({item.x}, {item.y}) • 半徑: rx={item.radiusX || item.radius}, ry={item.radiusY || item.radius}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] max-w-xl">
                      {item.descZh}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ──────── 模式 2: 8 大目標顯微驗收矩陣 ──────── */}
        {inspectMode === 'zoomMatrix' && (
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  8 大相異目標顯微局部驗收矩陣（Base vs 多型態 Variant 高解析對照）
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  可全域切換或在個別單字卡點擊切換 Variant A、B、C 等不同變異型態進行裁切與羽化邊緣比對
                </p>
              </div>

              {/* 全域變異切換器 */}
              {(currentScene.diffImageVarB || currentScene.diffImageVarC) ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold shrink-0">批次切換型態:</span>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => { setGlobalMatrixVariant('varA'); setCardVariantMap({}); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        globalMatrixVariant === 'varA' && Object.keys(cardVariantMap).length === 0
                          ? 'bg-emerald-500 text-slate-950 font-black shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      變異 A (全部)
                    </button>
                    {currentScene.diffImageVarB && (
                      <button
                        onClick={() => { setGlobalMatrixVariant('varB'); setCardVariantMap({}); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          globalMatrixVariant === 'varB' && Object.keys(cardVariantMap).length === 0
                            ? 'bg-amber-500 text-slate-950 font-black shadow'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        變異 B (全部)
                      </button>
                    )}
                    {currentScene.diffImageVarC && (
                      <button
                        onClick={() => { setGlobalMatrixVariant('varC'); setCardVariantMap({}); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          globalMatrixVariant === 'varC' && Object.keys(cardVariantMap).length === 0
                            ? 'bg-teal-500 text-slate-950 font-black shadow'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        變異 C (全部)
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  8 / 8 目標已建立獨立對照組
                </span>
              )}
            </div>

            {/* 8 目標卡片網格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentScene.targetItems?.map((item, idx) => {
                const color = targetColors[idx % targetColors.length];
                const rx = item.radiusX || item.radius || 50;
                const ry = item.radiusY || item.radius || 50;

                const activeVarId = cardVariantMap[item.word] || globalMatrixVariant;
                const activeVarObj = item.variants?.find(v => v.id === activeVarId) || item.variants?.find(v => v.id === 'varA') || item;
                const activeCrop = activeVarObj.cropCompare || item.cropCompare;
                const activeDesc = activeVarObj.descZh || item.descZh;

                return (
                  <div
                    key={item.word}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 flex flex-col gap-2.5 shadow-lg transition-all"
                  >
                    {/* 卡片標題 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-black text-sm text-slate-100">{item.word}</span>
                        <span className="text-xs text-slate-400 font-bold">{item.wordZh}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-bold border border-slate-700">
                        {activeVarObj.name || item.typeZh}
                      </span>
                    </div>

                    {/* 局部對比圖片 */}
                    <div className="w-full aspect-[650/276] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                      {activeCrop ? (
                        <img
                          src={activeCrop}
                          alt={`${item.word} compare`}
                          className="w-full h-full object-cover block"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                          局部裁切圖生成中
                        </div>
                      )}
                    </div>

                    {/* 座標與半徑標記 */}
                    <div className="bg-slate-950/70 p-2 rounded-xl text-[11px] font-mono text-slate-400 flex items-center justify-between border border-slate-800/80">
                      <span>中心: ({item.x}, {item.y})</span>
                      <span>rx: {rx} / ry: {ry}</span>
                    </div>

                    {/* 相異變化說明 */}
                    <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-800/40 p-2 rounded-xl flex-1">
                      {activeDesc}
                    </p>

                    {/* 變異切換按鈕組 (Base ➔ Var A ➔ Var B ➔ Var C) */}
                    {item.variants && (
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1 text-[10px]">
                        {item.variants.map((v) => {
                          const isSelected = (activeVarObj.id === v.id);
                          const isReady = Boolean(v.cropCompare || v.id === 'base');
                          return (
                            <button
                              key={v.id}
                              disabled={!isReady}
                              onClick={() => setCardVariantMap(prev => ({ ...prev, [item.word]: v.id }))}
                              className={`px-2 py-0.5 rounded font-mono transition-all flex items-center gap-1 ${
                                isSelected
                                  ? v.id === 'base'
                                    ? 'bg-sky-500 text-slate-950 font-black shadow'
                                    : v.id === 'varA'
                                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                                    : v.id === 'varB'
                                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                                    : 'bg-teal-500 text-slate-950 font-black shadow'
                                  : isReady
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                  : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
                              }`}
                              title={v.descZh || v.label}
                            >
                              <span>{v.tag}</span>
                              <span className="opacity-75 text-[9px]">{v.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 驗證狀態徽章 */}
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{activeVarObj.name || '變異'} 判定圈與羽化補丁已就緒</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ──────── 模式 3: A 方案動態 8 選 5 抽題模擬器 ──────── */}
        {inspectMode === 'dynamicSim' && (
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            {/* 說明與控制欄 */}
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    A 方案「雙圖槽位動態 8 選 5 變異引擎」實機模擬
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    已破除靜態圖死背限制
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  每局由系統從 8 大單字隨機抽選 5 個變異；其餘 3 個單字左右兩圖完全維持原圖（無縫融合），絕無幽靈差異！
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRerollSim}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-once" />
                  <span>🎲 隨機重新抽題 (8 取 5)</span>
                </button>
              </div>
            </div>

            {/* 即時反饋訊息條 */}
            {lastClickLog && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border animate-fadeIn ${
                  lastClickLog.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : lastClickLog.type === 'shield'
                    ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                    : lastClickLog.type === 'miss'
                    ? 'bg-slate-900 border-slate-700 text-slate-400'
                    : 'bg-purple-950/80 border-purple-500 text-purple-300'
                }`}
              >
                {lastClickLog.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                {lastClickLog.type === 'shield' && <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />}
                {lastClickLog.type === 'miss' && <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />}
                <span>{lastClickLog.text}</span>
              </div>
            )}

            {/* 雙圖即時動態模擬畫布 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 左圖: 永遠是底圖 (或統一未抽中狀態) */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl">
                <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-sky-300 font-bold text-xs border border-sky-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>左圖：基準圖 (點擊檢驗判定)</span>
                </div>

                <div className="relative w-full aspect-[1376/768]">
                  <img
                    src={currentScene.baseImage}
                    alt="Sim Left"
                    className="w-full h-full object-cover block"
                  />

                  {/* SVG 互動與標記層 */}
                  <svg
                    viewBox={`0 0 ${currentScene.width} ${currentScene.height}`}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    onClick={(e) => handleSimSvgClick(e, false)}
                  >
                    {currentScene.targetItems?.map((item) => {
                      const isChosen = dynamicSimData.chosenWords.has(item.word);
                      const isSolved = solvedWords.has(item.word);
                      const rx = item.radiusX || item.radius || 50;
                      const ry = item.radiusY || item.radius || 50;

                      return (
                        <g key={`sim-l-${item.word}`}>
                          {/* 只有抽中的目標，在點中破解後顯示勾選綠圈 */}
                          {isSolved && (
                            <g>
                              <ellipse
                                cx={item.x}
                                cy={item.y}
                                rx={rx}
                                ry={ry}
                                transform={item.rotate ? `rotate(${item.rotate} ${item.x} ${item.y})` : undefined}
                                fill="rgba(16, 185, 129, 0.2)"
                                stroke="#10b981"
                                strokeWidth="3"
                              />
                              <circle cx={item.x} cy={item.y} r="14" fill="#10b981" />
                              <text x={item.x} y={item.y + 4} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* 右圖: 底圖 + 僅為抽中的 5 個單字貼上羽化補丁 */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-slate-900 shadow-2xl">
                <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>右圖：動態貼圖變異 (僅抽中 5 處覆蓋補丁)</span>
                </div>

                <div className="relative w-full aspect-[1376/768]">
                  {/* 底層圖片: 依然是 baseImage! */}
                  <img
                    src={currentScene.baseImage}
                    alt="Sim Right Base"
                    className="w-full h-full object-cover block"
                  />

                  {/* SVG 補丁貼圖與互動層 */}
                  <svg
                    viewBox={`0 0 ${currentScene.width} ${currentScene.height}`}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    onClick={(e) => handleSimSvgClick(e, true)}
                  >
                    {/* 為 5 個被抽中的目標貼上 PNG 羽化補丁 */}
                    {dynamicSimData.chosen.map((item) => {
                      if (!item.slot || !item.patchFile) return null;
                      const patchSrc = `${currentScene.patchDir || '/assets/spotter/patches/b1_s2'}/${item.patchFile}`;
                      return (
                        <image
                          key={`patch-${item.word}`}
                          href={patchSrc}
                          x={item.slot.x}
                          y={item.slot.y}
                          width={item.slot.w}
                          height={item.slot.h}
                          preserveAspectRatio="none"
                        />
                      );
                    })}

                    {/* 已破解綠圈標記 */}
                    {currentScene.targetItems?.map((item) => {
                      const isSolved = solvedWords.has(item.word);
                      const rx = item.radiusX || item.radius || 50;
                      const ry = item.radiusY || item.radius || 50;
                      if (!isSolved) return null;

                      return (
                        <g key={`sim-r-solved-${item.word}`}>
                          <ellipse
                            cx={item.x}
                            cy={item.y}
                            rx={rx}
                            ry={ry}
                            transform={item.rotate ? `rotate(${item.rotate} ${item.x} ${item.y})` : undefined}
                            fill="rgba(16, 185, 129, 0.2)"
                            stroke="#10b981"
                            strokeWidth="3"
                          />
                          <circle cx={item.x} cy={item.y} r="14" fill="#10b981" />
                          <text x={item.x} y={item.y + 4} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">✓</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* 本局抽中 vs 未抽中清單核對板 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 抽中 5 個單字 */}
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-black text-emerald-300">
                      本局有效相異目標 (5 選題 • 點擊可得分破解)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    已破解: {solvedWords.size} / 5
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {dynamicSimData.chosen.map((item) => {
                    const isSolved = solvedWords.has(item.word);
                    return (
                      <div
                        key={item.word}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          isSolved
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isSolved ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            {isSolved ? '✓' : '•'}
                          </span>
                          <span className="font-black text-sm">{item.word}</span>
                          <span className="text-slate-400">({item.wordZh})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                            {item.variantName || '變異 A'}{item.variantLabel ? ` • ${item.variantLabel}` : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 未抽中 3 個單字 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <span className="text-xs font-black text-slate-300">
                      本局未抽中之目標 (左右兩圖完全維持原圖 • 絕不誤扣心)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    3 個中立單字
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {dynamicSimData.unchosen.map((item) => (
                    <div
                      key={item.word}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between text-slate-400 opacity-80"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-slate-300">{item.word}</span>
                        <span>({item.wordZh})</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        兩側像素 100% 相同
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── 模式 4: 40 場景變異全矩陣藍圖 ──────── */}
        {inspectMode === 'roadmap' && (
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  霧臺國小《鷹眼神探》8 冊 × 5 場景 = 40 全景立體紙雕藍圖矩陣
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  依據專案負責人 Mark 之規劃，每冊將陸續擴充至 5 張成對相異圖，並具備 Variant A~G 變異全集
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <span>目前進度：12 場景已就緒 / 28 場景排程中</span>
              </div>
            </div>

            {/* 冊次與場景排程表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BOOKS_CONFIG.map((b) => {
                const scenes = getScenesForBook(b.id);
                return (
                  <div
                    key={b.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
                          {b.grade}
                        </span>
                        <h4 className="font-black text-sm text-slate-100">{b.title}</h4>
                      </div>
                      <span className="text-xs text-slate-400">{b.sub}</span>
                    </div>

                    {/* 場景狀態列 */}
                    <div className="flex flex-col gap-1.5 text-xs">
                      {/* 場景 1 */}
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200 font-bold">圖 1: {scenes[0]?.titleZh.split('（')[0] || '核心主題'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          🟢 實裝就緒 (8 目標)
                        </span>
                      </div>

                      {/* 場景 2 */}
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-200 font-bold">
                          圖 2: {scenes[1] ? scenes[1].titleZh.split('（')[0] : (b.id === '2' ? '京都花見小路與職人小鎮' : `${b.title} 場景 2`)}
                        </span>
                        {scenes[1] && scenes[1].status !== 'roadmap' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                            ⚡ 動態 Slot 實裝就緒
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            ⏳ 下一階段排程繪製
                          </span>
                        )}
                      </div>

                      {/* 場景 3 */}
                      <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between text-slate-500">
                        <span>圖 3: 異國特色地標探索（場景 3）</span>
                        <span className="text-[10px]">排程規劃中</span>
                      </div>

                      {/* 場景 4 */}
                      <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between text-slate-500">
                        <span>圖 4: 自然奇景與自然生態（場景 4）</span>
                        <span className="text-[10px]">排程規劃中</span>
                      </div>

                      {/* 場景 5 */}
                      <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between text-slate-500">
                        <span>圖 5: 季節慶典與文化體驗（場景 5）</span>
                        <span className="text-[10px]">排程規劃中</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
