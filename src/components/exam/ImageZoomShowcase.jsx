import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  CheckCircle2,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';

// 四道精選實測題目（涵蓋地圖、告示、季節四格、菜單點餐，最能檢驗放大需求）
const SAMPLE_QUESTIONS = [
  {
    id: 'sample-map',
    title: '樣題 1: 五年級 Q34 生活地圖路線題（圖面細節極多，需辨識街道與店家）',
    grade: 5,
    number: 34,
    question: 'Look at the map. Which building is next to the bookstore?',
    image: '/assets/exam/saa/115/g5_q34_map.webp',
    options: [
      'The bakery',
      'The post office',
      'The police station',
      'The supermarket'
    ],
    answer: 1,
    explanation: '看地圖可知，bookstore（書店）旁邊緊鄰著 post office（郵局）。'
  },
  {
    id: 'sample-seasons',
    title: '樣題 2: 五年級 Q3 季節天氣四格圖（需仔細比對人物穿著與溫度）',
    grade: 5,
    number: 3,
    question: 'Listen and choose the matching picture about the season and weather:',
    image: '/assets/exam/saa/115/g5_q3.webp',
    options: [
      'Picture ① (Winter is cold with snow)',
      'Picture ② (Autumn is cool and windy)',
      'Picture ③ (Spring is warm on the bench)',
      'Picture ④ (Summer is hot and sunny)'
    ],
    answer: 3,
    explanation: '語音為「It is hot and sunny in summer.」，圖片 ④ 男子揮汗遮陽，故選 ④。'
  },
  {
    id: 'sample-board',
    title: '樣題 3: 六年級 Q32 社區告示欄長文（字體密度高，需清晰辨識時間）',
    grade: 6,
    number: 32,
    question: 'Read the announcement board. When does the library open on Sundays?',
    image: '/assets/exam/saa/115/g6_q32_board.webp',
    options: [
      '8:00 AM - 12:00 PM',
      '9:00 AM - 5:00 PM',
      '10:00 AM - 6:00 PM',
      'Closed on Sundays'
    ],
    answer: 1,
    explanation: '告示牌上標註週日開放時間為 9:00 AM - 5:00 PM。'
  },
  {
    id: 'sample-menu',
    title: '樣題 4: 四年級 Q7 餐廳菜單點餐單（價目與食物插圖辨識）',
    grade: 4,
    number: 7,
    question: 'Look at the menu and select the correct lunch combo:',
    image: '/assets/exam/saa/115/g4_q7.webp',
    options: [
      'Combo 1 ($85)',
      'Combo 2 ($95)',
      'Combo 3 ($110)',
      'Combo 4 ($120)'
    ],
    answer: 2,
    explanation: '音檔點選 Combo 3，包含牛肉漢堡與檸檬紅茶。'
  },
  {
    id: 'sample-long-options',
    title: '樣題 5: 六年級 Q28 博物館規則（🔥 超長完整英文句子答項實測，每項 50~60 字元）',
    grade: 6,
    number: 28,
    question: 'Look at the museum notice. Which statement is TRUE about the rules?',
    image: '/assets/exam/saa/115/g6_q28.webp',
    options: [
      'Visitors can ride a bicycle freely inside the exhibition hall.',
      'You are allowed to take photos without using a camera flash.',
      'Students can bring their pet dogs and cats into the museum.',
      'People are welcome to enjoy hot meals and drinks in the gallery.'
    ],
    answer: 1,
    explanation: '告示牌上標明可以拍照但禁止使用閃光燈 (No Flash Photography)。'
  }
];

export function ImageZoomShowcase({ onBack }) {
  // ── 當前體驗方案 ──
  // 'plan-1': 方案一 彈出式大圖 (需關閉才能選答)
  // 'plan-2': 方案二 原地框內放大 + 拖曳平移 (In-Place Pan & Zoom)
  // 'plan-3a': 方案 3A 大圖模式 + 底部即時懸浮作答條 (推薦)
  // 'plan-3b': 方案 3B 左右雙欄對照 (左大圖 + 右題項)
  const [activePlan, setActivePlan] = useState('plan-3a');

  // ── 方案 3A 底部作答條呈現模式 ('auto' 自適應 | 'compact-keypad' 極簡代號 | 'full-text' 完整文字) ──
  const [bottomBarMode, setBottomBarMode] = useState('auto');

  // ── 模擬裝置視角 ──
  // 'desktop' (100%), 'tablet' (768px), 'mobile' (375px)
  const [deviceMode, setDeviceMode] = useState('desktop');

  // ── 當前示範題目 ──
  const [selectedQIdx, setSelectedQIdx] = useState(0);
  const currentQ = SAMPLE_QUESTIONS[selectedQIdx];

  // ── 學生作答選項 ──
  const [chosenAnswer, setChosenAnswer] = useState(null);

  // ── 方案一 & 3A 彈窗狀態 ──
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── 方案二 原地框內縮放與拖曳狀態 ──
  const [plan2Zoom, setPlan2Zoom] = useState(1);
  const [plan2Pan, setPlan2Pan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panBoxRef = useRef(null);

  // 切換題目或方案時重置狀態
  useEffect(() => {
    setChosenAnswer(null);
    setIsModalOpen(false);
    setPlan2Zoom(1);
    setPlan2Pan({ x: 0, y: 0 });
  }, [selectedQIdx, activePlan]);

  // 方案二 拖曳處理
  const handleMouseDown = (e) => {
    if (plan2Zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - plan2Pan.x, y: e.clientY - plan2Pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPlan2Pan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 觸控拖曳
  const handleTouchStart = (e) => {
    if (plan2Zoom <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    const t = e.touches[0];
    dragStartRef.current = { x: t.clientX - plan2Pan.x, y: t.clientY - plan2Pan.y };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    setPlan2Pan({
      x: t.clientX - dragStartRef.current.x,
      y: t.clientY - dragStartRef.current.y
    });
  };

  // 容器寬度限制樣式（模擬手機/平板）
  const containerWidthClass =
    deviceMode === 'mobile'
      ? 'max-w-[375px]'
      : deviceMode === 'tablet'
      ? 'max-w-[768px]'
      : 'max-w-5xl';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-3 sm:p-6 select-none font-sans">
      {/* ── 頂端主控台 ── */}
      <div className="w-full max-w-6xl mb-4 bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-black flex items-center gap-1.5 transition"
              >
                <ArrowLeft size={14} />
                返回教師後台
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xl">🔍</span>
              <h1 className="text-base sm:text-lg font-black text-white">
                試題附圖放大機制 • 四大方案實測體驗台
              </h1>
            </div>
          </div>

          {/* 裝置模擬切換 */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <span className="px-2 text-slate-400 text-[11px] font-black">模擬裝置：</span>
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={13} />
              電腦寬螢幕
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('tablet')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                deviceMode === 'tablet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet size={13} />
              平板 (768px)
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                deviceMode === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={13} />
              手機 (375px)
            </button>
          </div>
        </div>

        {/* ── 四大方案切換分頁 ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1 border-t border-slate-700/60">
          {[
            {
              id: 'plan-1',
              num: '方案 1',
              title: '標準彈出大圖',
              badge: '純單純',
              desc: '點放大彈窗，需關閉才可作答'
            },
            {
              id: 'plan-2',
              num: '方案 2',
              title: '原地框內縮放拖曳',
              badge: '局部平移',
              desc: '在固定上半框內拖拉圖面'
            },
            {
              id: 'plan-3a',
              num: '方案 3A',
              title: '大圖＋懸浮作答條',
              badge: '推薦首選',
              desc: '彈出超大圖，底部常駐作答按鈕'
            },
            {
              id: 'plan-3b',
              num: '方案 3B',
              title: '左右雙欄對照',
              badge: '免彈窗',
              desc: '左半部大圖，右半部題項'
            }
          ].map((plan) => {
            const active = activePlan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setActivePlan(plan.id)}
                className={`p-2.5 rounded-xl text-left transition-all border ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20 scale-[1.01]'
                    : 'bg-slate-900/50 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${active ? 'bg-white/20' : 'bg-slate-700 text-slate-300'}`}>
                    {plan.num}
                  </span>
                  <span className={`text-[10px] font-bold ${active ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {plan.badge}
                  </span>
                </div>
                <div className="text-xs font-black truncate">{plan.title}</div>
                <div className={`text-[11px] truncate ${active ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {plan.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── 題目切換選項 ── */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-bold mr-1">選擇測試題目：</span>
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setSelectedQIdx(idx)}
              className={`px-2.5 py-1 rounded-lg font-black transition ${
                selectedQIdx === idx
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              樣題 {idx + 1}: {q.title.split(':')[1]?.split('（')[0]?.trim()}
            </button>
          ))}
        </div>
      </div>

      {/* ── 題目實境體驗卡（支援寬度模擬） ── */}
      <div className={`w-full ${containerWidthClass} transition-all duration-300 mb-6`}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-slate-700 text-slate-800 dark:text-slate-100">
          {/* 題目頂欄：題號、向度標記與作答狀態 */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs">
                Question #{currentQ.number}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentQ.title}
              </span>
            </div>
            {chosenAnswer !== null && (
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} />
                已選: 選項 {chosenAnswer + 1}
              </span>
            )}
          </div>

          {/* 題幹敘述 */}
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
            {currentQ.question}
          </div>

          {/* ========================================================= */}
          {/* 方案 1: 標準彈出式大圖 (Classic Lightbox) */}
          {/* ========================================================= */}
          {activePlan === 'plan-1' && (
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>【方案一特點】圖片點擊可跳出大圖。<b>痛點：必須關閉大圖，才能回到下方點選答案。</b></span>
              </div>

              {/* 圖片展示區 */}
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-2">
                <img
                  src={currentQ.image}
                  alt="題目插圖"
                  className="max-h-56 sm:max-h-64 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <Maximize2 size={14} />
                  點擊放大看大圖 (方案 1)
                </button>
              </div>

              {/* 選項區 */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = chosenAnswer === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChosenAnswer(idx)}
                      className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left font-bold text-sm flex items-center gap-3 transition ${
                        isChosen
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-white font-black'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isChosen ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 方案 2: 原地框內放大 + 拖曳平移 (In-Place Pan & Zoom) */}
          {/* ========================================================= */}
          {activePlan === 'plan-2' && (
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <span>【方案二特點】在題目上半框內縮放與平移。<b>請點擊右上角「+」放大後，用滑鼠/手指在框內拖移地圖！</b></span>
              </div>

              {/* 原地縮放檢視器 */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                {/* 縮放控制器按鈕群 */}
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-1 rounded-xl text-white text-xs">
                  <button
                    type="button"
                    onClick={() => setPlan2Zoom(z => Math.max(1, +(z - 0.3).toFixed(1)))}
                    className="p-1 hover:bg-white/20 rounded-lg"
                    title="縮小"
                  >
                    <ZoomOut size={15} />
                  </button>
                  <span className="font-mono font-bold px-1">{Math.round(plan2Zoom * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setPlan2Zoom(z => Math.min(3, +(z + 0.3).toFixed(1)))}
                    className="p-1 hover:bg-white/20 rounded-lg"
                    title="放大"
                  >
                    <ZoomIn size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPlan2Zoom(1); setPlan2Pan({ x: 0, y: 0 }); }}
                    className="p-1 hover:bg-white/20 rounded-lg ml-1 text-slate-300"
                    title="重設"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>

                {/* 框內可拖曳視窗 */}
                <div
                  ref={panBoxRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                  className={`h-60 sm:h-72 w-full flex items-center justify-center overflow-hidden ${
                    plan2Zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                  }`}
                >
                  <div
                    style={{
                      transform: `translate(${plan2Pan.x}px, ${plan2Pan.y}px) scale(${plan2Zoom})`,
                      transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                      transformOrigin: 'center center'
                    }}
                    className="select-none pointer-events-none"
                  >
                    <img
                      src={currentQ.image}
                      alt="題目插圖"
                      className="max-h-56 sm:max-h-64 max-w-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>

                {plan2Zoom > 1 && (
                  <div className="absolute bottom-1 left-2 text-[10px] text-amber-500 font-bold bg-black/60 px-2 py-0.5 rounded-full">
                    🖐️ 已放大，請在方框內拖移視角
                  </div>
                )}
              </div>

              {/* 選項區 */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = chosenAnswer === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChosenAnswer(idx)}
                      className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left font-bold text-sm flex items-center gap-3 transition ${
                        isChosen
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-white font-black'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isChosen ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 方案 3A: 大圖彈窗 ＋ 底部即時懸浮作答條 (推薦首選) */}
          {/* ========================================================= */}
          {activePlan === 'plan-3a' && (
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <span>
                  🌟 <b>【方案 3A 推薦】</b> 點擊放大後，大圖彈窗底部附帶即時作答列，<b>邊看超大圖邊選答案，完全免切換！</b>
                </span>
              </div>

              {/* 一般標準圖 */}
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-2">
                <img
                  src={currentQ.image}
                  alt="題目插圖"
                  className="max-h-56 sm:max-h-64 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <Maximize2 size={14} />
                  點此進入大圖模式（附懸浮作答條）
                </button>
              </div>

              {/* 主畫面選項區 */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = chosenAnswer === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChosenAnswer(idx)}
                      className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left font-bold text-sm flex items-center gap-3 transition ${
                        isChosen
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-white font-black'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isChosen ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 方案 3B: 左右雙欄對照 (左大圖 + 右題項) */}
          {/* ========================================================= */}
          {activePlan === 'plan-3b' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <span>【方案 3B 特點】左側整欄大圖，右側題幹與選項。<b>優點是不需彈窗；Mark 的顧慮：無圖題目與有圖題目切換時，排版會從上下跳成左右。</b></span>
              </div>

              {/* 雙欄切換容器 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* 左欄：超大圖面 */}
                <div className="rounded-2xl border-2 border-indigo-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 flex items-center justify-center min-h-[300px]">
                  <img
                    src={currentQ.image}
                    alt="題目插圖"
                    className="max-h-[380px] w-auto max-w-full object-contain rounded-xl shadow-sm"
                  />
                </div>

                {/* 右欄：選項列表 */}
                <div className="space-y-2.5">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                    請選出正確答案：
                  </div>
                  {currentQ.options.map((opt, idx) => {
                    const isChosen = chosenAnswer === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setChosenAnswer(idx)}
                        className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 text-left font-bold text-sm flex items-center gap-3 transition ${
                          isChosen
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-white font-black'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          isChosen ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 方案 1 之 Lightbox Modal (純看大圖，需關閉才可選答) */}
      {/* ========================================================= */}
      {activePlan === 'plan-1' && isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-700 flex flex-col justify-between gap-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-black text-white">
                🔍 方案一：純大圖模式（無法看見選項）
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                關閉回題作答 ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-950 rounded-2xl">
              <img
                src={currentQ.image}
                alt="大圖預覽"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="text-xs text-amber-400 text-center font-bold">
              ⚠️ 體驗感受：您現在看到大圖了，但如果想選答案，必須先按右上角「關閉回題作答」！
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 方案 3A 之 Lightbox Modal (大圖 ＋ 底部即時作答條) */}
      {/* ========================================================= */}
      {activePlan === 'plan-3a' && isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal 頂欄 */}
          <div
            className="w-full max-w-5xl mx-auto flex items-center justify-between pb-2 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                方案 3A 體驗
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                {currentQ.question}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <X size={14} />
              關閉
            </button>
          </div>

          {/* 大圖中央展示區 */}
          <div
            className="flex-1 w-full max-w-5xl mx-auto overflow-auto flex items-center justify-center p-2 my-2 bg-slate-950/70 rounded-3xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentQ.image}
              alt="超大考卷插圖"
              className="max-h-[62vh] sm:max-h-[66vh] w-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* 🌟 核心創新：底部常駐即時作答條 🌟 */}
          <div
            className="w-full max-w-5xl mx-auto bg-slate-900/95 border border-slate-700 p-3 sm:p-4 rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const isLongOptions = currentQ.options.some((o) => o.length > 25);
              const actualMode =
                bottomBarMode === 'compact-keypad'
                  ? 'keypad'
                  : isLongOptions
                  ? 'two-column'
                  : 'four-column';

              return (
                <>
                  <div className="flex flex-wrap items-center justify-between text-xs mb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-300 flex items-center gap-1">
                        <Sparkles size={14} />
                        邊看大圖直接選答：
                      </span>
                      {chosenAnswer !== null && (
                        <span className="text-emerald-400 font-bold">
                          ✓ 已選定: 選項 {chosenAnswer + 1}
                        </span>
                      )}
                    </div>

                    {/* 答項過長展示模式切換鈕（針對 Mark 的答項過長顧慮） */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-700 text-[11px] font-bold">
                      <span className="text-slate-400 px-1">答項呈現：</span>
                      <button
                        type="button"
                        onClick={() => setBottomBarMode('auto')}
                        className={`px-2 py-0.5 rounded-lg transition ${
                          bottomBarMode === 'auto' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                        title="依文字長度自動排版：長句子轉為雙欄完整換行、短詞四欄"
                      >
                        ⚡ 智能自適應 {isLongOptions ? '(長句雙欄)' : '(短詞四欄)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBottomBarMode('compact-keypad')}
                        className={`px-2 py-0.5 rounded-lg transition ${
                          bottomBarMode === 'compact-keypad' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                        title="極簡代號大按鈕，大圖視野最大化"
                      >
                        🔢 純代號大鍵盤
                      </button>
                    </div>
                  </div>

                  {/* 1. 純代號大鍵盤模式 (極致省空間，大圖佔滿螢幕) */}
                  {actualMode === 'keypad' && (
                    <div className="grid grid-cols-4 gap-2.5 py-1">
                      {currentQ.options.map((opt, idx) => {
                        const isChosen = chosenAnswer === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setChosenAnswer(idx)}
                            className={`py-2.5 px-2 rounded-2xl border-2 font-black text-center transition-all flex flex-col items-center justify-center gap-1 ${
                              isChosen
                                ? 'border-emerald-400 bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                                : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500'
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                              isChosen ? 'bg-white text-emerald-800' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-[11px] text-slate-300 truncate max-w-full">
                              選項 {idx + 1}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. 長句子雙欄自適應完整文字模式 (絕不截斷，自然換行) */}
                  {actualMode === 'two-column' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-0.5">
                      {currentQ.options.map((opt, idx) => {
                        const isChosen = chosenAnswer === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setChosenAnswer(idx)}
                            className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left font-bold transition-all flex items-start gap-2.5 ${
                              isChosen
                                ? 'border-emerald-400 bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-[1.01]'
                                : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                              isChosen ? 'bg-white text-emerald-800' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-[13px] leading-snug whitespace-normal break-words">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 3. 短詞四欄模式 */}
                  {actualMode === 'four-column' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {currentQ.options.map((opt, idx) => {
                        const isChosen = chosenAnswer === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setChosenAnswer(idx)}
                            className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-2.5 ${
                              isChosen
                                ? 'border-emerald-400 bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]'
                                : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                              isChosen ? 'bg-white text-emerald-800' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-[13px] truncate">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition"
              >
                選好了，確定並返回題卡 ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 底部評比指南 ── */}
      <div className="w-full max-w-5xl bg-slate-800/60 rounded-2xl p-4 border border-slate-700 text-xs space-y-2 text-slate-300">
        <div className="font-black text-amber-400 flex items-center gap-1.5 text-sm">
          <Info size={16} />
          四大方案特點與體驗對照：
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700">
            <span className="font-bold text-white block mb-1">1️⃣ 方案一（彈出式大圖）：</span>
            視野最乾淨，但確實有您提到的「關掉彈窗才看得到選項」的問題，看選項時容易忘記剛才圖裡的細節。
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700">
            <span className="font-bold text-white block mb-1">2️⃣ 方案二（原地框內縮放拖曳）：</span>
            能在原地操作，但如您所見，在有限的小框框裡手指拖拉比較侷促，且手機上下滑動容易打架。
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40">
            <span className="font-bold text-emerald-300 block mb-1">🌟 方案 3A（大圖＋懸浮作答條，強烈推薦）：</span>
            既擁有方案一的「超大清楚視野」，又在彈窗底部常駐選項按鈕，邊看大圖邊點答，手感最順暢！
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700">
            <span className="font-bold text-white block mb-1">4️⃣ 方案 3B（左右雙欄模式）：</span>
            寬螢幕排版漂亮，但如您精闢指出的：「若上一題沒圖、這題突然變左右雙欄」，視覺排版跳動會讓學生分心。
          </div>
        </div>
      </div>
    </div>
  );
}
