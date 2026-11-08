import React, { useState, useMemo, useEffect } from 'react';
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
  Star,
  GraduationCap
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

// 📘 軌道 1：Pre-A1 五大面向與 19 子題型官方規格對應表 (300 題)
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

// 📗 軌道 2：教育部 SAA 臺灣學生學習成就評量 (180 題)
export const SAA_DASHBOARD_META = [
  {
    category: 'listening',
    label: '第一部分：聽力測驗 (Listening)',
    icon: Headphones,
    color: 'emerald',
    total: 80,
    subTypes: [
      { key: 'L-SENT', label: '辨識句意', total: 31, desc: '聽日常句子，選出相符情境動作插圖' },
      { key: 'L-CONV', label: '言談理解', total: 17, desc: '聽生活對話或日常短文廣播，回答所提出的問題' },
      { key: 'L-QA', label: '基本問答', total: 13, desc: '聽單一日常問句，選出合乎邏輯之社交應對答覆' },
      { key: 'L-WORD', label: '聽音辨字', total: 11, desc: '聽讀音選出正確拼寫之核心生活字彙' },
      { key: 'A-SOUND', label: '語音聽辨', total: 8, desc: '辨別母音、子音或角色對話音調' }
    ]
  },
  {
    category: 'reading',
    label: '第二部分：閱讀測驗 (Reading)',
    icon: BookOpen,
    color: 'teal',
    total: 100,
    subTypes: [
      { key: 'G-MC', label: '單題（文法與句構）', total: 36, desc: '檢測基本字彙辨析、動詞時態、主動受格與句型結構' },
      { key: 'R-COMP', label: '篇章理解題組', total: 35, desc: '素養導向閱讀海報、菜單、書信或短篇故事回答理解題' },
      { key: 'V-MEAN', label: '單題（字彙理解）', total: 24, desc: '檢測日常生活核心字彙語意與情境對應' },
      { key: 'G-CTX', label: '語境克漏字', total: 5, desc: '日常生活連貫語境空格填入最適當文法詞' }
    ]
  }
];

// 📙 軌道 3：翰林課本單元進度檢定 (1,289 題)
export const CURRICULUM_DASHBOARD_META = [
  {
    category: 'primary_lower',
    label: '低年級：字母與啟蒙專冊 (Books 1~2)',
    icon: Layers,
    color: 'amber',
    total: 260,
    subTypes: [
      { key: 'b1', label: '第一冊 (Book 1)', total: 110, desc: '問候、自我介紹、顏色、數字' },
      { key: 'b2', label: '第二冊 (Book 2)', total: 110, desc: '文具、家庭成員、動物、身體部位' },
      { key: 'alpha', label: '字母語音專冊', total: 40, desc: '26 個英文字母大小寫與自然發音啟蒙' }
    ]
  },
  {
    category: 'primary_mid',
    label: '中年級：基礎生活英語 (Books 3~4)',
    icon: BookOpen,
    color: 'orange',
    total: 340,
    subTypes: [
      { key: 'b3', label: '第三冊 (Book 3)', total: 170, desc: '喜好食物、日常物品、位置介系詞、服飾' },
      { key: 'b4', label: '第四冊 (Book 4)', total: 170, desc: '能力 Can、時間、日常作息、天氣與感受' }
    ]
  },
  {
    category: 'primary_high',
    label: '高年級：進階閱讀與語法 (Books 5~6)',
    icon: Headphones,
    color: 'rose',
    total: 350,
    subTypes: [
      { key: 'b5', label: '第五冊 (Book 5)', total: 175, desc: '現在進行式、場所問路、職業、日常休閒活動' },
      { key: 'b6', label: '第六冊 (Book 6)', total: 175, desc: '星期幾、日常頻率、過去式初探、生活問答' }
    ]
  },
  {
    category: 'advanced',
    label: '國一先修與素養統整 (Books 7~8 & 銜接)',
    icon: Award,
    color: 'indigo',
    total: 339,
    subTypes: [
      { key: 'b7', label: '第七冊 (Book 7)', total: 140, desc: '過去式時態、跨文化節慶、長篇閱讀素養' },
      { key: 'b8', label: '第八冊 (Book 8)', total: 140, desc: '未來式、比較級最高級、生活圖表統整' },
      { key: 'transition', label: '國中英語銜接專冊', total: 59, desc: '國一核心文法先行、素養長篇篇章閱讀' }
    ]
  }
];

// 三大測驗主題色票與視覺風格定位表 (Distinct Morandi & Modern Palettes)
export const TRACK_CONFIGS = {
  'tme-preA1': {
    id: 'tme-preA1',
    emoji: '📘',
    name: 'Pre-A1 官方模擬',
    shortName: 'Pre-A1 模擬',
    badge: '教育部認證規格',
    totalItems: 300,
    meta: PRE_A1_DASHBOARD_META,
    heroGradient: 'from-indigo-600 via-sky-600 to-indigo-700',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-700',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    accentBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    activeTabClass: 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/50'
  },
  'ministry-assessment': {
    id: 'ministry-assessment',
    emoji: '📗',
    name: '教育部 SAA 學力檢測實戰模考',
    shortName: 'SAA 學力檢測',
    badge: 'SAA 臺灣學生學習成就評量',
    totalItems: 180,
    meta: SAA_DASHBOARD_META,
    heroGradient: 'from-emerald-700 via-teal-600 to-emerald-800',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    activeTabClass: 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/50'
  },
  'curriculum': {
    id: 'curriculum',
    emoji: '📙',
    name: '翰林課本單元進度檢定',
    shortName: '課本單元進度',
    badge: 'Here We Go 全 8 冊',
    totalItems: 1289,
    meta: CURRICULUM_DASHBOARD_META,
    heroGradient: 'from-amber-600 via-orange-600 to-amber-700',
    primaryBtn: 'bg-amber-600 hover:bg-amber-700',
    accentText: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    activeTabClass: 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/50'
  }
};

export const PreA1MasteryDashboard = ({
  student,
  onBack,
  onStartDrill,
  initialTrack = 'tme-preA1'
}) => {
  const [activeTrack, setActiveTrack] = useState(initialTrack);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'formal'
  const [onlyRecentHalfYear, setOnlyRecentHalfYear] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const studentId = student?.student_id || student?.id || 'guest';
  const displayName = formatStudentDisplayName(student) || '勇敢冒險家';

  const currentTrackConfig = TRACK_CONFIGS[activeTrack] || TRACK_CONFIGS['tme-preA1'];
  const activeCategories = currentTrackConfig.meta;

  // 讀取學生本機精熟快照
  const masterySnapshot = useMemo(() => {
    return loadStudentMastery(studentId);
  }, [studentId]);

  // 切換軌道時，預設展開第一個面向
  useEffect(() => {
    const firstCat = activeCategories[0]?.category;
    if (firstCat) {
      setExpandedCategories({ [firstCat]: true });
    }
  }, [activeTrack, activeCategories]);

  const rawItems = masterySnapshot.tracks?.[activeTrack]?.items || {};

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

  // 計算全卷總精熟與涵蓋數據
  const overallStats = useMemo(() => {
    const itemsList = Object.values(filteredItems);
    const masteredCount = itemsList.filter((it) => it.status === MASTERY_STATES.MASTERED).length;
    const attemptedCount = itemsList.length;
    const totalBank = currentTrackConfig.totalItems || 300;
    // 品質指標：以已挑戰題目計算實質精熟率 (做錯可翻盤，加題不掉星)
    const masteryRate = attemptedCount > 0 ? Math.round((masteredCount / attemptedCount) * 100) : 0;
    const level = getMasteryLevel(masteryRate, attemptedCount);
    // 開拓指標：以全題庫總題數計算涵蓋深度 (莫蘭迪五階底色)
    const coverage = getMorandiCoverageTier(attemptedCount, totalBank);
    return {
      masteredCount,
      attemptedCount,
      totalBank,
      masteryRate,
      level,
      coverage
    };
  }, [filteredItems, currentTrackConfig.totalItems]);

  // 切換面向展開狀態
  const toggleCategory = (catKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  // 一鍵展開/收合全部
  const areAllExpanded = useMemo(() => {
    return activeCategories.every((c) => expandedCategories[c.category]);
  }, [activeCategories, expandedCategories]);

  const toggleAll = () => {
    const nextVal = !areAllExpanded;
    const nextObj = {};
    activeCategories.forEach((c) => {
      nextObj[c.category] = nextVal;
    });
    setExpandedCategories(nextObj);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 p-3 sm:p-5 select-none animate-fadeIn">
      {/* 滿分金屬流光 CSS 動畫樣式注入 */}
      <style>{`
        @keyframes shimmerSheen {
          0% { transform: translateX(-150%) rotate(35deg); opacity: 0; }
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
                個人英語精熟學習診斷一覽表
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${currentTrackConfig.accentBg}`}>
                {currentTrackConfig.badge}
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

      {/* 三大測驗軌道切換標籤 (3-Track Tabs with Distinct Visual Palettes) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
        {Object.values(TRACK_CONFIGS).map((track) => {
          const isActive = activeTrack === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveTrack(track.id)}
              className={`py-2 px-2 sm:px-3 rounded-xl font-black transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                isActive
                  ? `${track.activeTabClass} shadow-xs`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
              }`}
            >
              <span className="text-sm">{track.emoji}</span>
              <span className="truncate">{track.shortName}</span>
              <span className="hidden md:inline text-[10px] opacity-75 font-bold">
                ({track.totalItems}題)
              </span>
            </button>
          );
        })}
      </div>

      {/* 總體概覽卡片 (Overview Hero Banner - 隨軌道切換專屬漸層) */}
      <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r ${currentTrackConfig.heroGradient} text-white shadow-lg transition-all duration-300`}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                {currentTrackConfig.shortName} 開拓進度：{overallStats.attemptedCount}/{currentTrackConfig.totalItems} 題 ({overallStats.coverage.rate}% {overallStats.coverage.label})
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
              <span className="text-sm text-white/80 font-bold">
                / {overallStats.attemptedCount} 題精熟
              </span>
              <span className="text-lg font-black text-amber-300 ml-2">
                (精熟率 {overallStats.masteryRate}%)
              </span>
            </div>
            <p className="text-xs text-white/80 max-w-xl">
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
            <span className="text-[11px] font-bold text-white/90">
              全卷開拓涵蓋率：{overallStats.coverage.rate}% ({overallStats.coverage.label})
            </span>
          </div>
        </div>
      </div>

      {/* 面向風琴折清單 (The Accordion Categories) */}
      <div className="space-y-2.5">
        {activeCategories.map((cat) => {
          const isExpanded = !!expandedCategories[cat.category];
          const Icon = cat.icon;

          // 計算此面向之總體精熟數據
          const catSubTypes = cat.subTypes || [];
          let catMastered = 0;
          let catAttempted = 0;
          const subTypeStats = catSubTypes.map((sub) => {
            const subItems = Object.values(filteredItems).filter((it) => {
              if (activeTrack === 'curriculum') {
                return it.subType === sub.key || it.bookGroup === sub.key || it.book === Number(sub.key.replace('b', ''));
              }
              return it.subType === sub.key || it.taskType === sub.key;
            });
            const mCount = subItems.filter((it) => it.status === MASTERY_STATES.MASTERED).length;
            const aCount = subItems.length;

            // 品質指標：以已做題數 aCount 計算精熟率
            const masteryRate = aCount > 0 ? Math.round((mCount / aCount) * 100) : 0;
            const level = getMasteryLevel(masteryRate, aCount);

            // 開拓指標：以該題型總數 sub.total 計算莫蘭迪底色
            const coverage = getMorandiCoverageTier(aCount, sub.total);

            // 錯題數 (已做過但尚未達到完全精熟)
            const mistakeCount = Math.max(0, aCount - mCount);
            // 新題數 (該題型尚未挑戰之題數)
            const newCount = Math.max(0, sub.total - aCount);
            // 是否有待加強錯題 (若已 100% 滿分流光則無錯題)
            const hasMistakes = mistakeCount > 0 && !level.isPerfect;
            const hasNewQuestions = newCount > 0;

            catMastered += mCount;
            catAttempted += aCount;
            return {
              ...sub,
              masteredCount: mCount,
              attemptedCount: aCount,
              masteryRate,
              level,
              coverage,
              mistakeCount,
              newCount,
              hasMistakes,
              hasNewQuestions
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
                      精熟 {catMastered} / {catAttempted} 題 ({catMasteryRate}%) ｜ 涵蓋 {catSubTypes.length} 種子題型
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

              {/* 展開之子題型細項清單 (套用莫蘭迪五階柔和底色 + 精準三欄柵格排版) */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 p-2 sm:p-3 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 animate-fadeIn">
                  {subTypeStats.map((sub) => {
                    return (
                      <div
                        key={sub.key}
                        className={`${sub.coverage.bgCard} rounded-xl p-2.5 sm:p-3 border ${sub.coverage.borderCard} transition hover:shadow-xs`}
                      >
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* 🖥️ 桌機 / 平板 視圖 (sm 以上：清晰三欄精準柵格化，零位移對齊)     */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <div className="hidden sm:flex items-center justify-between gap-3">
                          {/* 欄 1：子題型標題 + 莫蘭迪開拓標籤 + 說明 */}
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 truncate">
                                {sub.label}
                              </span>
                              {/* 莫蘭迪開拓標籤 */}
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${sub.coverage.pillBg}`}
                              >
                                開拓 {sub.attemptedCount}/{sub.total} 題 ({sub.coverage.rate}%)
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {sub.desc}
                            </p>
                          </div>

                          {/* 欄 2：固定三星欄位 (3-Star Slot) 與精熟度 (寬度 125px，上下行嚴格對齊) */}
                          <div className="w-[125px] shrink-0 flex flex-col justify-center">
                            <div className="h-6 flex items-center">
                              <MasteryStarsDisplay
                                stars={sub.level.stars}
                                isPerfect={sub.level.isPerfect}
                                label={sub.level.label}
                              />
                            </div>
                            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">
                              {sub.attemptedCount > 0 ? (
                                <span>精熟 {sub.masteryRate}% ({sub.masteredCount}/{sub.attemptedCount})</span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500">尚未挑戰</span>
                              )}
                            </div>
                          </div>

                          {/* 欄 3：固定雙圖案寬度行動槽 (Dual Action Slots: 寬度 184px，無按鈕時留白佔位) */}
                          <div className="w-[184px] shrink-0 flex items-center justify-end gap-1.5">
                            {/* 左槽 (Slot 1)：錯題速測 (若有錯題且未達滿分流光) */}
                            {sub.hasMistakes ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onStartDrill &&
                                  onStartDrill(sub.key, Math.min(5, sub.mistakeCount), 'mistakes', activeTrack)
                                }
                                title={`及時自我訓練！複習此題型 ${sub.mistakeCount} 題待精熟錯題`}
                                className="w-[88px] h-8 rounded-lg bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
                              >
                                <Flame size={13} className="shrink-0" />
                                <span>錯題 ({sub.mistakeCount})</span>
                              </button>
                            ) : (
                              /* 無錯題時留白佔位，維持左右精確對齊 */
                              <div className="w-[88px] h-8 invisible pointer-events-none" aria-hidden="true" />
                            )}

                            {/* 右槽 (Slot 2)：新題速測 (若有未挑戰之新題) */}
                            {sub.hasNewQuestions ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onStartDrill &&
                                  onStartDrill(sub.key, Math.min(5, sub.newCount), 'new', activeTrack)
                                }
                                title={`開拓此題型 ${sub.newCount} 題未挑戰新題`}
                                className={`w-[88px] h-8 rounded-lg ${currentTrackConfig.primaryBtn} active:scale-95 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition cursor-pointer`}
                              >
                                <Sparkles size={13} className="shrink-0" />
                                <span>新題 ({sub.newCount})</span>
                              </button>
                            ) : (
                              /* 無新題時留白佔位 */
                              <div className="w-[88px] h-8 invisible pointer-events-none" aria-hidden="true" />
                            )}
                          </div>
                        </div>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* 📱 手機端極簡緊湊視圖 (sm 以下：高自適應，零多餘空槽，不浪費螢幕) */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <div className="sm:hidden flex flex-col gap-1.5">
                          {/* 第一列：標題 + 莫蘭迪開拓標籤 + 靠右三星列 */}
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                                {sub.label}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-bold border shrink-0 ${sub.coverage.pillBg}`}
                              >
                                開拓 {sub.coverage.rate}%
                              </span>
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                              <MasteryStarsDisplay
                                stars={sub.level.stars}
                                isPerfect={sub.level.isPerfect}
                                label={sub.level.label}
                              />
                              {sub.attemptedCount > 0 && (
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                  {sub.masteryRate}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 第二列：子題型說明 ＋ 行動按鈕 (僅渲染實際存在的按鈕，極簡精巧) */}
                          <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-slate-100/70 dark:border-slate-800/70">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate flex-1 min-w-0">
                              {sub.desc}
                            </span>

                            <div className="shrink-0 flex items-center gap-1.5">
                              {sub.hasMistakes && onStartDrill && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onStartDrill(sub.key, Math.min(5, sub.mistakeCount), 'mistakes', activeTrack)
                                  }
                                  className="px-2 py-1 rounded-md bg-rose-500 active:scale-95 text-white text-[10px] font-black flex items-center gap-0.5 shadow-xs transition cursor-pointer"
                                >
                                  <Flame size={11} />
                                  <span>錯題 {sub.mistakeCount}</span>
                                </button>
                              )}

                              {sub.hasNewQuestions && onStartDrill && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onStartDrill(sub.key, Math.min(5, sub.newCount), 'new', activeTrack)
                                  }
                                  className={`px-2 py-1 rounded-md ${currentTrackConfig.primaryBtn} active:scale-95 text-white text-[10px] font-black flex items-center gap-0.5 shadow-xs transition cursor-pointer`}
                                >
                                  <Sparkles size={11} />
                                  <span>新題 {sub.newCount}</span>
                                </button>
                              )}

                              {!sub.hasMistakes && !sub.hasNewQuestions && sub.attemptedCount > 0 && (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle2 size={11} />
                                  <span>全數精熟</span>
                                </span>
                              )}
                            </div>
                          </div>
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

export const ExamMasteryDashboard = PreA1MasteryDashboard;
