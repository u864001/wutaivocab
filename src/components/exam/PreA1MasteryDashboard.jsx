import React, { useState, useMemo } from 'react';
import {
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
  RotateCcw,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Layers,
  HelpCircle,
  Star
} from 'lucide-react';
import {
  loadStudentMastery,
  getMasteryLevel,
  getMorandiCoverageTier,
  MASTERY_STATES
} from '../../utils/masteryHelper';
import { formatStudentDisplayName } from '../../utils/studentIdHelper';

// 3D 立體金星列與 100% 滿分流光掃過特效組件 (無空星留白設計，靠左排列)
const MasteryStarsDisplay = ({ stars = 0, isPerfect = false, label = '' }) => {
  if (stars <= 0) {
    return (
      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 italic">
        {label || '未起評'}
      </span>
    );
  }

  return (
    <div className={`relative inline-flex items-center gap-1 ${isPerfect ? 'shimmer-stars-halo' : ''}`}>
      {/* 100% 滿分金屬流光斜掃背景層 */}
      {isPerfect && <span className="shimmer-sheen-sweep" />}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`transition-all ${
              isPerfect
                ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_1px_2px_rgba(245,158,11,0.6)]'
                : 'text-amber-400 fill-amber-400 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]'
            }`}
          />
        ))}
      </div>
      {isPerfect && (
        <span className="ml-1 px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-300/40 text-[10px] font-black flex items-center gap-0.5">
          <Sparkles size={10} className="animate-pulse" />
          <span>滿分</span>
        </span>
      )}
    </div>
  );
};

// Pre-A1 五大面向與 19 子題型官方規格對應表
export const PRE_A1_DASHBOARD_META = [
  {
    category: 'vocab',
    label: '字彙專項 (Vocabulary)',
    icon: Layers,
    color: 'emerald',
    total: 56,
    subTypes: [
      { key: 'vocab-word2pic', label: '看字選圖', total: 14, desc: '生活單字對照物品黑白線稿' },
      { key: 'vocab-pic2word', label: '看圖選字', total: 14, desc: '生活物品線稿選正確英文單字' },
      { key: 'vocab-audio2pic', label: '聽音選圖', total: 14, desc: '語音單字對應相符插圖' },
      { key: 'vocab-audio2word', label: '聽音選字', total: 14, desc: '語音單字辨別正確英文字母拼寫' }
    ]
  },
  {
    category: 'listening',
    label: '聽力專項 (Listening)',
    icon: Headphones,
    color: 'sky',
    total: 60,
    subTypes: [
      { key: 'listen-pic2sent', label: '看圖選句', total: 12, desc: '情境插圖對應真實日常英文句子' },
      { key: 'listen-dlg2pic', label: '聽對話選圖', total: 12, desc: '男女日常對話選出相符情境圖' },
      { key: 'listen-resp', label: '選正確回應', total: 18, desc: '聽日常交際問句，選出最適當回應' },
      { key: 'listen-conv-qa', label: '聽對話答題', total: 18, desc: '聽生活對話情境回答理解選擇題' }
    ]
  },
  {
    category: 'reading',
    label: '閱讀專項 (Reading)',
    icon: BookOpen,
    color: 'indigo',
    total: 88,
    subTypes: [
      { key: 'read-pic2word', label: '看圖選字', total: 14, desc: '生活場所與職業線稿選英文' },
      { key: 'read-pic2sent', label: '看圖選句', total: 14, desc: '生活情境線稿選相符敘述句子' },
      { key: 'read-truefalse', label: '是非判斷', total: 14, desc: '日常生活短文情境與敘述對照 True/False' },
      { key: 'read-cloze', label: '短文填空', total: 18, desc: '校園與在地生活短文空格填詞' },
      { key: 'read-passage', label: '篇章理解題組', total: 28, desc: '7 大在地與生活篇章 4 題題組' }
    ]
  },
  {
    category: 'writing',
    label: '寫作專項 (Writing)',
    icon: PenTool,
    color: 'amber',
    total: 60,
    subTypes: [
      { key: 'write-scramble-resp', label: '答句重組', total: 42, desc: '國小核心句型（Be動詞、助動詞、現在進行式等）' },
      { key: 'write-scramble-q', label: '問句重組', total: 18, desc: 'Wh- 疑問句型立體磁吸單字積木' }
    ]
  },
  {
    category: 'speaking',
    label: '口說專項 (Speaking)',
    icon: Mic,
    color: 'rose',
    total: 36,
    subTypes: [
      { key: 'speak-word', label: '單字片語朗讀', total: 12, desc: '生活單字與片語發音清晰度' },
      { key: 'speak-short', label: '短句朗讀', total: 14, desc: '日常問候與問句語調朗讀' },
      { key: 'speak-long', label: '長句朗讀', total: 10, desc: '生活情境連貫長句斷句與連音' }
    ]
  }
];

export const PreA1MasteryDashboard = ({
  student,
  onBack,
  onStartDrill
}) => {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'formal'
  const [onlyRecentHalfYear, setOnlyRecentHalfYear] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({ vocab: true }); // 預設展開第 1 個

  const studentId = student?.student_id || student?.id || 'guest';
  const displayName = formatStudentDisplayName(student) || '勇敢冒險家';

  // 讀取學生本機精熟快照
  const masterySnapshot = useMemo(() => {
    return loadStudentMastery(studentId);
  }, [studentId]);

  const rawItems = masterySnapshot.tracks?.['tme-preA1']?.items || {};

  // 依篩選條件過濾 items
  const filteredItems = useMemo(() => {
    const halfYearAgoMs = Date.now() - 180 * 24 * 60 * 60 * 1000;
    const res = {};
    for (const [id, item] of Object.entries(rawItems)) {
      if (filterMode === 'formal' && !item.is_formal) continue;
      if (onlyRecentHalfYear && item.last_attempt_at) {
        const itemTime = new Date(item.last_attempt_at).getTime();
        if (itemTime < halfYearAgoMs) continue;
      }
      res[id] = item;
    }
    return res;
  }, [rawItems, filterMode, onlyRecentHalfYear]);

  // 計算全卷 300 題總精熟與涵蓋數據
  const overallStats = useMemo(() => {
    const itemsList = Object.values(filteredItems);
    const masteredCount = itemsList.filter((it) => it.status === MASTERY_STATES.MASTERED).length;
    const attemptedCount = itemsList.length;
    const totalBank = 300;
    // 品質指標：以已挑戰題目計算實質精熟率 (做錯可翻盤，加題不掉星)
    const masteryRate = attemptedCount > 0 ? Math.round((masteredCount / attemptedCount) * 100) : 0;
    const level = getMasteryLevel(masteryRate, attemptedCount);
    // 開拓指標：以全題庫 300 題計算涵蓋深度 (莫蘭迪五階底色)
    const coverage = getMorandiCoverageTier(attemptedCount, totalBank);
    return {
      masteredCount,
      attemptedCount,
      totalBank,
      masteryRate,
      level,
      coverage
    };
  }, [filteredItems]);

  // 切換面向展開狀態
  const toggleCategory = (catKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  // 一鍵展開/收合全部
  const areAllExpanded = useMemo(() => {
    return PRE_A1_DASHBOARD_META.every((c) => expandedCategories[c.category]);
  }, [expandedCategories]);

  const toggleAll = () => {
    const nextVal = !areAllExpanded;
    const nextObj = {};
    PRE_A1_DASHBOARD_META.forEach((c) => {
      nextObj[c.category] = nextVal;
    });
    setExpandedCategories(nextObj);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 p-3 sm:p-5 select-none animate-fadeIn">
      {/* 頂部導航與標題列 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              title="返回測驗設置"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center shadow-md">
            <Award size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Pre-A1 官方模擬：個人精熟診斷卡
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                動態滾動精熟制
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {displayName} ｜ 錯題連對 2 次翻盤解鎖 ｜ 拒絕歷史懲罰
            </p>
          </div>
        </div>

        {/* 頂部篩選工具列：膠囊切換 + 半年過濾 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 膠囊切換：全部 vs 僅正式 */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg font-black transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              全部紀錄
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('formal')}
              className={`px-3 py-1 rounded-lg font-black transition cursor-pointer ${
                filterMode === 'formal'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              僅正式測驗
            </button>
          </div>

          {/* 半年過濾勾選框 */}
          <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyRecentHalfYear}
              onChange={(e) => setOnlyRecentHalfYear(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <span>僅限近半年</span>
          </label>

          {/* 一鍵展開/收合全部 */}
          <button
            type="button"
            onClick={toggleAll}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer"
          >
            {areAllExpanded ? '全部收合' : '全部展開'}
          </button>
        </div>
      </div>

      {/* 嵌入 100% 滿分金屬流光與呼吸金光動畫樣式 */}
      <style>{`
        @keyframes shimmerSheen {
          0% { transform: translateX(-120%) rotate(35deg); opacity: 0; }
          20% { opacity: 0.9; }
          60% { opacity: 0.9; }
          100% { transform: translateX(220%) rotate(35deg); opacity: 0; }
        }
        .shimmer-stars-halo {
          position: relative;
          overflow: hidden;
          padding: 2px 6px;
          border-radius: 8px;
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.4);
          filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.55));
        }
        .shimmer-sheen-sweep {
          position: absolute;
          top: -60%;
          left: -60%;
          width: 220%;
          height: 220%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.85) 50%,
            transparent 100%
          );
          pointer-events: none;
          animation: shimmerSheen 3.5s infinite ease-in-out;
        }
      `}</style>

      {/* 總體概覽卡片 (Overview Hero Banner) */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                全卷 300 題開拓進度：{overallStats.attemptedCount}/300 題 ({overallStats.coverage.rate}% {overallStats.coverage.label})
              </span>
              <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-lg">
                <MasteryStarsDisplay
                  stars={overallStats.level.stars}
                  isPerfect={overallStats.level.isPerfect}
                  label={overallStats.level.label}
                />
                <span className="text-xs font-extrabold text-amber-200">
                  {overallStats.level.label}
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight">
                {overallStats.masteredCount}
              </span>
              <span className="text-sm text-indigo-100 font-bold">
                / {overallStats.attemptedCount} 題精熟
              </span>
              <span className="text-lg font-black text-amber-300 ml-2">
                (精熟率 {overallStats.masteryRate}%)
              </span>
            </div>
            <p className="text-xs text-indigo-100 max-w-xl">
              以已挑戰題目計算實質精熟率（做錯可翻盤，加題不掉星）。題庫開拓覆蓋率透過莫蘭迪五階底色（灰棕綠藍金）溫和提醒！
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 sm:flex-col sm:items-end">
            <div className="w-full sm:w-48 bg-black/20 rounded-full h-3.5 p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(100, Math.max(overallStats.coverage.rate, 3))}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-indigo-100">
              全卷開拓涵蓋率：{overallStats.coverage.rate}% ({overallStats.coverage.label})
            </span>
          </div>
        </div>
      </div>

      {/* 五大面向風琴折清單 (The 5 Accordion Categories) */}
      <div className="space-y-2.5">
        {PRE_A1_DASHBOARD_META.map((cat) => {
          const isExpanded = !!expandedCategories[cat.category];
          const Icon = cat.icon;

          // 計算此面向之總體精熟數據
          const catSubTypes = cat.subTypes || [];
          let catMastered = 0;
          let catAttempted = 0;
          const subTypeStats = catSubTypes.map((sub) => {
            const subItems = Object.values(filteredItems).filter(
              (it) => it.subType === sub.key
            );
            const mCount = subItems.filter((it) => it.status === MASTERY_STATES.MASTERED).length;
            const aCount = subItems.length;

            // 品質指標：以已做題數 aCount 計算精熟率
            const masteryRate = aCount > 0 ? Math.round((mCount / aCount) * 100) : 0;
            const level = getMasteryLevel(masteryRate, aCount);

            // 開拓指標：以該題型總數 sub.total 計算莫蘭迪底色
            const coverage = getMorandiCoverageTier(aCount, sub.total);

            catMastered += mCount;
            catAttempted += aCount;
            return {
              ...sub,
              masteredCount: mCount,
              attemptedCount: aCount,
              masteryRate,
              level,
              coverage
            };
          });

          const catMasteryRate = catAttempted > 0 ? Math.round((catMastered / catAttempted) * 100) : 0;
          const catLevel = getMasteryLevel(catMasteryRate, catAttempted);
          const catCoverage = getMorandiCoverageTier(catAttempted, cat.total);

          return (
            <div
              key={cat.category}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition"
            >
              {/* 風琴折主卡片標題列 (點擊切換展開/收合) */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.category)}
                className="w-full p-3 sm:p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${catCoverage.pillBg}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {cat.label}
                      </span>
                      {/* 莫蘭迪開拓標籤 */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${catCoverage.pillBg}`}
                      >
                        開拓 {catAttempted}/{cat.total} 題 ({catCoverage.rate}%)
                      </span>
                      {/* 品質立體金星 */}
                      <MasteryStarsDisplay
                        stars={catLevel.stars}
                        isPerfect={catLevel.isPerfect}
                        label={catLevel.label}
                      />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      精熟 {catMastered} / {catAttempted} 題 ({catMasteryRate}%) ｜ 涵蓋 {catSubTypes.length} 種官方子題型
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* 開拓進度條 */}
                  <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${catCoverage.barColor}`}
                        style={{ width: `${Math.min(100, Math.max(catCoverage.rate, 4))}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">
                      開拓 {catCoverage.rate}% ({catCoverage.label})
                    </span>
                  </div>

                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </button>

              {/* 展開之子題型細項清單 (套用莫蘭迪五階柔和底色) */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 p-2 sm:p-3 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 animate-fadeIn">
                  {subTypeStats.map((sub) => {
                    const isRed = sub.masteryRate < 50 && sub.attemptedCount > 0;
                    return (
                      <div
                        key={sub.key}
                        className={`${sub.coverage.bgCard} rounded-xl p-2.5 sm:p-3 border ${sub.coverage.borderCard} flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition hover:shadow-xs`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                              {sub.label}
                            </span>

                            {/* 莫蘭迪開拓標籤 */}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${sub.coverage.pillBg}`}
                            >
                              開拓 {sub.attemptedCount}/{sub.total} 題 ({sub.coverage.rate}%)
                            </span>

                            {/* 品質立體金星 (靠左對齊，無空星留白設計) */}
                            <MasteryStarsDisplay
                              stars={sub.level.stars}
                              isPerfect={sub.level.isPerfect}
                              label={sub.level.label}
                            />

                            {/* 精熟率數據 */}
                            {sub.attemptedCount > 0 ? (
                              <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                                精熟 {sub.masteredCount}/{sub.attemptedCount} 題 ({sub.masteryRate}%)
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-400">
                                尚未挑戰 (0/{sub.total})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {sub.desc}
                          </p>
                        </div>

                        {/* 一鍵專項特訓按鈕 */}
                        <div className="shrink-0 flex items-center justify-end gap-2">
                          {onStartDrill && (
                            <button
                              type="button"
                              onClick={() => onStartDrill(sub.key, 5)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                                isRed
                                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              {isRed ? <Flame size={14} /> : <Target size={14} />}
                              <span>{isRed ? '弱點突擊 5 題' : '專項特訓 5 題'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
