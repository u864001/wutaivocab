import React, { useState, useEffect, useMemo } from 'react';
import { useStudent } from '../context/StudentContext';
import { useI18n } from '../context/I18nContext';
import { Button3D } from './ui/Button3D';
import { GlassCard } from './ui/GlassCard';
import {
  GRADE_OPTIONS,
  CLASS_OPTIONS,
  formatStudentId,
  formatStudentDisplayName,
  formatStudentBadge,
  getRandomFunNickname,
  pad2
} from '../utils/studentIdHelper';
import { AVATAR_LIST, AVATAR_FRAMES, getAvatarById, getAvatarFrameById } from '../data/avatars';
import { getProfanityError } from '../services/profanityFilter';
import { fetchLeaderboard, getWeekNumber } from '../services/supabase';
import {
  User,
  Sparkles,
  Coins,
  Trophy,
  Package,
  X,
  LogOut,
  RefreshCw,
  Check,
  Dices,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Medal,
  Crown,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentProfileModal = () => {
  const {
    currentStudent,
    isLoggedIn,
    isModalOpen,
    closeModal,
    loginStudent,
    logoutStudent,
    updateAvatar,
    avatarId,
    avatarFrame,
    isLoading
  } = useStudent();
  const { t, lang } = useI18n();

  // 內部狀態：是否正在切換/編輯身分
  const [isSwitching, setIsSwitching] = useState(false);

  // 勇士頭像立繪與外框更換選單狀態
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [avatarSubTab, setAvatarSubTab] = useState('avatars'); // 'avatars' | 'frames'
  const [avatarGenderFilter, setAvatarGenderFilter] = useState('all'); // 'all' | 'boy' | 'girl'

  const currentAvatar = useMemo(() => {
    return getAvatarById(currentStudent?.avatar_id || avatarId);
  }, [currentStudent?.avatar_id, avatarId]);

  const currentFrame = useMemo(() => {
    return getAvatarFrameById(currentStudent?.avatar_frame || avatarFrame);
  }, [currentStudent?.avatar_frame, avatarFrame]);

  // 表單狀態
  const [selectedGrade, setSelectedGrade] = useState('04'); // 預設 4 年級
  const [selectedClass, setSelectedClass] = useState('01'); // 預設 甲班
  const [selectedSeat, setSelectedSeat] = useState('01');   // 預設 1 號
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  // 學生榜單榮譽 Top 3 資料 (查核該學生在哪些模式名列前 3)
  const [studentTopHonors, setStudentTopHonors] = useState([]);
  const [isLoadingHonors, setIsLoadingHonors] = useState(false);

  // 執照主題樣式：'dark' (深邃墨岩冷光) | 'parchment' (羊皮紙石雕)
  const [cardTheme, setCardTheme] = useState('dark');

  // 當彈窗開啟或學生變更時同步表單
  useEffect(() => {
    if (currentStudent) {
      setSelectedGrade(pad2(currentStudent.grade));
      setSelectedClass(pad2(currentStudent.class));
      setSelectedSeat(pad2(currentStudent.seat));
      setNickname(currentStudent.nickname || '');
      setIsSwitching(false);
    } else {
      setIsSwitching(true);
      if (!nickname) {
        setNickname(getRandomFunNickname());
      }
    }
    setNicknameError('');
  }, [currentStudent, isModalOpen]);

  // 讀取學生本週與榮譽榜 Top 3 榮耀成就
  useEffect(() => {
    let isMounted = true;
    const loadTopHonors = async () => {
      if (!currentStudent?.student_id || !isModalOpen) return;
      setIsLoadingHonors(true);
      try {
        const curWeek = getWeekNumber();
        const studentBadge = formatStudentBadge(currentStudent, 'zh');
        const studentNick = currentStudent.nickname;
        const studentId = currentStudent.student_id;

        // 查驗核心各大主要模式排行榜
        const modesToCheck = [
          { mode: 'all', title: '全校冒險總積分榜', icon: '🏆' },
          { mode: 'mole', title: '單字打地鼠手速榜', icon: '⚡' },
          { mode: 'meteor', title: '3D 隕石防衛戰射手榜', icon: '🚀' },
          { mode: 'snake', title: '神山百步蛇獵人榜', icon: '🐍' },
          { mode: 'spotter', title: '鷹眼神探尋寶榜', icon: '👁️' },
          { mode: 'escape', title: '密室逃脫解謎先鋒榜', icon: '🗝️' }
        ];

        const honors = [];
        for (const item of modesToCheck) {
          const res = await fetchLeaderboard(curWeek, item.mode, 'all', 10);
          if (res && res.length > 0) {
            const rankIdx = res.findIndex(r => 
              r.name?.includes(studentId) || 
              r.name?.includes(studentNick) ||
              (studentBadge && r.name?.includes(studentBadge))
            );
            if (rankIdx !== -1 && rankIdx < 3) {
              honors.push({
                rank: rankIdx + 1,
                title: item.title,
                icon: item.icon,
                score: res[rankIdx].score,
                time: res[rankIdx].time
              });
            }
          }
        }
        if (isMounted) {
          setStudentTopHonors(honors);
        }
      } catch (err) {
        console.warn('查驗榮譽榜 Top 3 失敗:', err);
      } finally {
        if (isMounted) setIsLoadingHonors(false);
      }
    };

    loadTopHonors();
    return () => {
      isMounted = false;
    };
  }, [currentStudent, isModalOpen]);

  if (!isModalOpen) return null;

  // 即時計算 6 碼 ID
  const currentComputedId = formatStudentId(selectedGrade, selectedClass, selectedSeat);

  // 驗證並抽取趣味暱稱
  const handleRandomNickname = () => {
    const randomNick = getRandomFunNickname();
    setNickname(randomNick);
    setNicknameError('');
  };

  const handleNicknameChange = (e) => {
    const val = e.target.value.slice(0, 12);
    setNickname(val);
    const err = getProfanityError(val);
    setNicknameError(err || '');
  };

  const handleConfirmLogin = async (e) => {
    e?.preventDefault();
    if (nicknameError) return;

    let finalNick = nickname.trim();
    if (!finalNick) {
      finalNick = getRandomFunNickname();
    }

    const res = await loginStudent({
      grade: selectedGrade,
      classNum: selectedClass,
      seat: selectedSeat,
      nickname: finalNick
    });

    if (res.success) {
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
      setIsSwitching(false);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* 浮動式無邊框高質感【大武山神廟古代石板通行證】 */}
      <div className="w-full max-w-md sm:max-w-lg relative my-auto animate-scaleUp">
        
        {/* 模式 A：已登入且未點選切換 ── 顯示精美【大武山石板勇士執照】原畫質證件 */}
        {isLoggedIn && !isSwitching ? (
          <div className="flex flex-col items-center gap-3">
            
            {/* 卡片本體：嚴格 3:4 比例石板原畫，內嵌凹槽與發光符文 */}
            <div className="relative w-full aspect-[3/4] max-h-[82vh] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.35)] select-none">
              
              {/* 高解析精美神廟石板原畫背景 (已最佳化 WebP) */}
              <img
                src={cardTheme === 'dark' ? '/assets/pass/slate_pass_dark.webp' : '/assets/pass/slate_pass_parchment.webp'}
                alt="Ancient Slate Warrior Pass"
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] pointer-events-none"
              />

              {/* 浮動頂部微操作鈕 (關閉與風格切換) */}
              <div className="absolute top-3 right-4 z-30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCardTheme(prev => prev === 'dark' ? 'parchment' : 'dark')}
                  className="px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-black text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                  title="切換石板風格 (深邃墨岩 / 象牙羊皮)"
                >
                  <Layers className="w-3 h-3" />
                  <span>{cardTheme === 'dark' ? '墨岩青玉' : '羊皮石雕'}</span>
                </button>

                <button
                  onClick={closeModal}
                  className="w-7 h-7 rounded-full bg-slate-950/80 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                  title="關閉"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ═══ 槽位 1：左上學生頭像槽 (Left: 9.5%, Top: 12.8%, W: 30%, H: 22.5%) ═══ */}
              <div className="absolute left-[9.5%] top-[12.8%] w-[30%] h-[22.5%] flex flex-col items-center justify-center p-1 z-20">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      confetti({ particleCount: 20, spread: 40, origin: { y: 0.3 } });
                    } catch (e) {}
                    setIsAvatarSelectorOpen(true);
                  }}
                  className="group relative flex flex-col items-center justify-center focus:outline-none cursor-pointer active:scale-95 transition-transform"
                  title="點擊更換勇士立繪與石板神槽外框"
                >
                  {/* 槽位靈氣呼吸光暈 (Aura pulse) */}
                  <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-tr ${currentFrame.auraClass} blur-md animate-aura-pulse pointer-events-none`} />

                  {/* 頭像實體圓角容器 + 鑲嵌外框 */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden relative ${currentFrame.ringClass} bg-slate-950 shadow-2xl transition-all duration-300`}>
                    {/* 2.5D 頭像立繪 + 輕柔呼吸微動效 */}
                    <img
                      src={currentAvatar.image}
                      alt={currentAvatar.name}
                      className="w-full h-full object-cover object-center animate-avatar-breathe select-none"
                    />

                    {/* 鏡面微光掠過 (Shimmer sweep) */}
                    <div className="absolute inset-0 w-[50%] h-[200%] -top-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-shimmer-sweep" />

                    {/* Hover 浮動提示「換造型」 */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold backdrop-blur-[2px]">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                      <span>換造型</span>
                    </div>
                  </div>

                  {/* 槽位下方等級/座號標籤 */}
                  <div className={`absolute -bottom-2 px-2 py-0.5 rounded-full border text-[9px] font-black shadow-md flex items-center gap-1 ${currentFrame.badgeColor} z-10`}>
                    <span>LV.{currentStudent.grade || 4}</span>
                    <span className="text-[8px] opacity-80 hidden sm:inline">({pad2(currentStudent.seat)}號)</span>
                  </div>
                </button>
              </div>

              {/* ═══ 槽位 2：右上姓名與 6 碼 ID 槽 (Left: 42.5%, Top: 12.8%, W: 48%, H: 10%) ═══ */}
              <div className="absolute left-[42.5%] top-[12.8%] w-[48%] h-[10%] flex flex-col justify-center px-2.5 z-20">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-base sm:text-lg font-heading font-black text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {currentStudent.nickname}
                  </h4>
                  <span className="font-mono text-[10px] font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded-lg border border-amber-400/50 shrink-0">
                    ID: {currentStudent.student_id}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-emerald-200/90 truncate mt-0.5">
                  {formatStudentDisplayName(currentStudent, lang)}
                </p>
              </div>

              {/* ═══ 槽位 3：右上勇士稱號與階級槽 (Left: 42.5%, Top: 24.5%, W: 48%, H: 10.5%) ═══ */}
              <div className="absolute left-[42.5%] top-[24.5%] w-[48%] h-[10.5%] flex items-center justify-between px-2.5 z-20">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    TITLED WARRIOR
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-300 truncate flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>大武山守護者</span>
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                  {currentStudent.grade} 年級勇士
                </span>
              </div>

              {/* ═══ 槽位 4：左中金幣資產槽 (Left: 9.5%, Top: 37%, W: 38.5%, H: 11%) ═══ */}
              <div className="absolute left-[9.5%] top-[37%] w-[38.5%] h-[11%] flex items-center justify-between px-3 z-20">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black">
                  <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.coins}</span>
                </div>
                <div className="text-base sm:text-xl font-black text-amber-300 font-mono">
                  {currentStudent.coins ?? 0}
                </div>
              </div>

              {/* ═══ 槽位 5：右中冒險積分槽 (Left: 52%, Top: 37%, W: 38.5%, H: 11%) ═══ */}
              <div className="absolute left-[52%] top-[37%] w-[38.5%] h-[11%] flex items-center justify-between px-3 z-20">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-black">
                  <Trophy className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{t.questPoints}</span>
                </div>
                <div className="text-base sm:text-xl font-black text-indigo-300 font-mono">
                  {currentStudent.quest_points ?? 0}
                </div>
              </div>

              {/* ═══ 槽位 6：中層道具收藏槽 (Left: 9.5%, Top: 50%, W: 81%, H: 10.5%) ═══ */}
              <div className="absolute left-[9.5%] top-[50%] w-[81%] h-[10.5%] flex items-center justify-between px-3.5 z-20">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-xs font-black text-teal-300">
                    {t.backpackItems} ({(currentStudent.inventory || []).length} 件)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[55%] py-1">
                  {(currentStudent.inventory || []).length > 0 ? (
                    currentStudent.inventory.slice(0, 4).map((it, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-teal-950/80 border border-teal-400/40 text-[10px] text-teal-200 font-bold whitespace-nowrap">
                        {it.name || it}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">
                      前往小鎮商店收集徽章
                    </span>
                  )}
                </div>
              </div>

              {/* ═══ 槽位 7：底層榮譽榜 TOP 3 成就槽 (Left: 9.5%, Top: 62.5%, W: 81%, H: 26.5%) ═══ */}
              <div className="absolute left-[9.5%] top-[62.5%] w-[81%] h-[26.5%] flex flex-col justify-between p-3 z-20">
                <div className="flex items-center justify-between border-b border-white/10 pb-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-black text-amber-300 tracking-wide">
                      殿堂戰績 • 目前榮譽榜 TOP 3
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-300/80">
                    TOP 3 HONORS
                  </span>
                </div>

                <div className="flex-1 my-1 overflow-y-auto space-y-1.5 pr-1">
                  {isLoadingHonors ? (
                    <div className="flex items-center justify-center h-full text-xs text-slate-400 font-bold animate-pulse">
                      正在查核全校榮譽榜殿堂...
                    </div>
                  ) : studentTopHonors.length > 0 ? (
                    studentTopHonors.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 rounded-xl bg-black/40 border border-amber-400/30">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shadow ${
                            h.rank === 1 ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300' :
                            h.rank === 2 ? 'bg-slate-300 text-stone-950' : 'bg-amber-700 text-white'
                          }`}>
                            {h.rank}
                          </span>
                          <span className="text-xs text-white font-bold">{h.icon} {h.title}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-300">{h.score}分</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-2">
                      <Medal className="w-5 h-5 text-slate-500 mb-1" />
                      <p className="text-[11px] text-slate-300 font-bold">
                        尚未進入全校 TOP 3 榜單
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        挑戰單人極速或密室逃脫，為年級爭光即可入榜！
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-slate-400 font-mono shrink-0">
                  <span>WUTAI TRIBAL ADVENTURER GUILD</span>
                  <span className="text-emerald-400 font-bold">● ONLINE ACTIVE</span>
                </div>
              </div>

              {/* ═══ 🪞 勇士神殿立繪鏡像 (Avatar & Frame Mirror Overlay) ═══ */}
              {isAvatarSelectorOpen && (
                <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 flex flex-col justify-between animate-fadeIn select-none border-2 border-emerald-400/40 shadow-2xl">
                  {/* 頂部 Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 shrink-0">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h3 className="text-sm sm:text-base font-heading font-black text-white">
                        勇士立繪與神槽更換
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAvatarSelectorOpen(false)}
                      className="w-7 h-7 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 子分頁切換：👤 探險者頭像 (8款) vs 🛡️ 神槽雕紋外框 (4款) */}
                  <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-xl border border-white/10 my-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAvatarSubTab('avatars')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        avatarSubTab === 'avatars'
                          ? 'bg-emerald-500 text-stone-950 shadow-md font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>👤 勇士立繪</span>
                      <span className="text-[10px] opacity-80">(8款)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAvatarSubTab('frames')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        avatarSubTab === 'frames'
                          ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>🛡️ 神槽外框</span>
                      <span className="text-[10px] opacity-80">(4款)</span>
                    </button>
                  </div>

                  {/* 分頁內容 */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                    {avatarSubTab === 'avatars' ? (
                      <>
                        {/* 性別/類型微篩選 */}
                        <div className="flex items-center justify-between text-[11px] px-1 font-bold">
                          <span className="text-emerald-300/80">選擇專屬神山探險立繪：</span>
                          <div className="flex gap-1">
                            {['all', 'boy', 'girl'].map((filterKey) => (
                              <button
                                key={filterKey}
                                type="button"
                                onClick={() => setAvatarGenderFilter(filterKey)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono cursor-pointer transition-all ${
                                  avatarGenderFilter === filterKey
                                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {filterKey === 'all' ? '全部' : filterKey === 'boy' ? '👦 男孩' : '👧 女孩'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 8 款頭像網格 */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {AVATAR_LIST
                            .filter(a => avatarGenderFilter === 'all' || a.gender === avatarGenderFilter)
                            .map((item) => {
                              const isSelected = (currentStudent?.avatar_id || avatarId) === item.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    updateAvatar(item.id, null);
                                    try {
                                      confetti({ particleCount: 25, spread: 45, origin: { y: 0.5 } });
                                    } catch (e) {}
                                  }}
                                  className={`group relative p-1.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer border ${
                                    isSelected
                                      ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-300/60 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02]'
                                      : 'bg-slate-900/60 hover:bg-slate-900 border-white/10 hover:border-white/25'
                                  }`}
                                >
                                  {/* 頭像圓角 */}
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden relative bg-slate-950 shadow-inner">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                    {isSelected && (
                                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-400 text-stone-950 flex items-center justify-center shadow">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="w-full">
                                    <h4 className="text-[11px] font-black text-white truncate">
                                      {item.name}
                                    </h4>
                                    <p className="text-[9px] text-emerald-300/80 truncate">
                                      {item.title}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-[11px] text-amber-300/90 px-1 font-bold">
                          石板頭像槽外框（自然鑲嵌於神石、絕無浮動貼紙感）：
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {AVATAR_FRAMES.map((f) => {
                            const isSelected = (currentStudent?.avatar_frame || avatarFrame) === f.id;
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => {
                                  updateAvatar(null, f.id);
                                  try {
                                    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
                                  } catch (e) {}
                                }}
                                className={`p-2.5 rounded-2xl flex items-center gap-3 transition-all text-left cursor-pointer border ${
                                  isSelected
                                    ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-300/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                                    : 'bg-slate-900/60 hover:bg-slate-900 border-white/10 hover:border-white/25'
                                }`}
                              >
                                {/* 外框即時預覽小頭像 */}
                                <div className="relative shrink-0 flex items-center justify-center p-1">
                                  <div className={`w-12 h-12 rounded-xl overflow-hidden relative ${f.ringClass} bg-slate-950 shadow`}>
                                    <img
                                      src={currentAvatar.image}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4 className="text-xs font-black text-white truncate">
                                      {f.name}
                                    </h4>
                                    {isSelected ? (
                                      <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[9px] font-black flex items-center gap-0.5">
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        已鑲嵌
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono font-bold text-amber-400">
                                        {f.price === 0 ? '預設解鎖' : `🪙 ${f.price}`}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                    {f.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* 底部確認按鈕 */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">
                      已即時銘刻至您的神石通行證
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAvatarSelectorOpen(false)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-stone-950 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      完成更換
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* 卡片下方操作按鈕群 (切換身分、進入宇宙、登出) */}
            <div className="w-full flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsSwitching(true)}
                className="px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/20 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.switchSeatBtn}</span>
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-teal-200 text-stone-950 text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 cursor-pointer border-2 border-emerald-200"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.enterUniverseBtn}</span>
              </button>

              <button
                type="button"
                onClick={logoutStudent}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 py-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOutBtn}</span>
              </button>
            </div>

          </div>
        ) : (
          /* 模式 B：選擇身分與 6 碼漫遊綁定表單 (無框線高透水晶原畫風格) */
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.35)] text-white p-5 sm:p-7 space-y-4">
            <img
              src="/assets/pass/warrior_pass_bg.webp"
              alt="Warrior Adventure Pass"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] contrast-[1.2] pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm pointer-events-none" />

            {/* 頂部標題與關閉按鈕 */}
            <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">
                    {t.studentPassportTitle}
                  </h3>
                  <p className="text-[11px] text-emerald-300 font-bold">
                    {t.studentPassportSubtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-95"
                title="關閉"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 模式 B 選擇身分與 6 碼漫遊綁定表單 */}
            <form onSubmit={handleConfirmLogin} className="relative z-10 space-y-4 animate-fadeIn">
              {/* 步驟 1: 選擇年級 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{t.selectGradeLabel}</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    2 碼：{selectedGrade}
                  </span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {GRADE_OPTIONS.map((g) => {
                    const isSelected = selectedGrade === g.id;
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setSelectedGrade(g.id)}
                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all border ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {g.shortZh}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 步驟 2: 選擇班級 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{t.selectClassLabel}</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    2 碼：{selectedClass}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CLASS_OPTIONS.map((c) => {
                    const isSelected = selectedClass === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSelectedClass(c.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-black transition-all border ${
                          isSelected
                            ? 'bg-teal-500 text-white border-teal-600 shadow-md scale-102'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {c.zh}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 步驟 3: 選擇座號 (1 ~ 35 號快捷宮格) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {t.selectSeatLabel}
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    座號：{parseInt(selectedSeat, 10)} 號 ({selectedSeat})
                  </span>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {Array.from({ length: 35 }, (_, i) => {
                      const seatStr = pad2(i + 1);
                      const isSelected = selectedSeat === seatStr;
                      return (
                        <button
                          type="button"
                          key={seatStr}
                          onClick={() => setSelectedSeat(seatStr)}
                          className={`py-1.5 rounded-lg text-xs font-mono font-black transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm scale-105'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 6 碼動態身分識別預覽 */}
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border-2 border-dashed border-emerald-400 dark:border-emerald-600 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    {t.studentIdCodeLabel}
                  </span>
                  <div className="flex items-center gap-1 font-mono font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-400 tracking-widest mt-0.5">
                    <span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">{selectedGrade}</span>
                    <span className="text-slate-400">-</span>
                    <span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">{selectedClass}</span>
                    <span className="text-slate-400">-</span>
                    <span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">{selectedSeat}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {formatStudentBadge({ grade: selectedGrade, class: selectedClass, seat: selectedSeat }, lang)}
                  </span>
                </div>
              </div>

              {/* 步驟 4: 學生暱稱與趣味抽取 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {t.nicknameLabel}
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomNickname}
                    className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    {t.randomNicknameBtn}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={nickname}
                    onChange={handleNicknameChange}
                    placeholder={t.nicknamePlaceholder}
                    maxLength={12}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100 font-black text-sm"
                  />
                  {nickname && (
                    <span className="absolute right-3 top-3 text-[10px] text-slate-400 font-bold">
                      {nickname.length}/12
                    </span>
                  )}
                </div>
                {nicknameError && (
                  <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {nicknameError}
                  </p>
                )}
              </div>

              {/* 送出登入 3D 按鈕 */}
              <div className="pt-2">
                <Button3D
                  type="submit"
                  variant="emerald"
                  size="lg"
                  disabled={isLoading || Boolean(nicknameError)}
                  icon={Sparkles}
                  className="w-full shadow-lg"
                >
                  {isLoading ? '正在連結雲端漫遊檔案...' : t.roamingLaunchBtn}
                </Button3D>
              </div>

              {/* 學校共用平板貼心說明 */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300/60 dark:border-amber-700/60 text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t.sharedIpadTip}
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
