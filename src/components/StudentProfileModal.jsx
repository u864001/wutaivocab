import React, { useState, useEffect } from 'react';
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
import { getProfanityError } from '../services/profanityFilter';
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
  ShieldCheck
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
    isLoading
  } = useStudent();
  const { t, lang } = useI18n();

  // 內部狀態：是否正在切換/編輯身分
  const [isSwitching, setIsSwitching] = useState(false);

  // 表單狀態
  const [selectedGrade, setSelectedGrade] = useState('04'); // 預設 4 年級
  const [selectedClass, setSelectedClass] = useState('01'); // 預設 甲班
  const [selectedSeat, setSelectedSeat] = useState('01');   // 預設 1 號
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      {/* 浮動式無邊框高質感【霧臺勇士探險執照】卡片主體 */}
      <div className="w-full max-w-xl relative my-auto animate-scaleUp">
        
        {/* 模式 A：已登入且未點選切換 ── 顯示精美【霧臺勇士探險執照】原畫質證件 */}
        {isLoggedIn && !isSwitching ? (
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.45)] text-white p-5 sm:p-7 space-y-4">
            {/* 執照實景原畫背景 (已最佳化 WebP) */}
            <img
              src="/assets/pass/warrior_pass_bg.webp"
              alt="Warrior Adventure Pass"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.15] pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/35 backdrop-blur-[0.5px] pointer-events-none" />

            {/* 浮動頂部：執照徽章、6 碼 ID、關閉按鈕 */}
            <div className="relative z-10 flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 flex items-center gap-1.5 shadow-lg border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  <span>霧臺勇士探險執照</span>
                </span>
                <span className="hidden sm:inline text-[10px] text-amber-200/90 font-mono tracking-widest uppercase">
                  ADVENTURER PASS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-amber-300 bg-slate-950/90 px-3 py-1 rounded-xl border border-amber-400/60 shadow">
                  ID: {currentStudent.student_id}
                </span>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-95"
                  title="關閉"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 學生核心身份無框線資訊區 */}
            <div className="relative z-10 flex items-center gap-4 pt-1 sm:pt-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-stone-950 flex items-center justify-center font-heading font-black text-2xl sm:text-3xl shadow-2xl ring-4 ring-amber-400/80 shrink-0">
                {formatStudentBadge(currentStudent, lang).substring(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-white truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {currentStudent.nickname}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 text-[10px] font-bold">
                    {currentStudent.grade} 年級勇士
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-200/90 mt-0.5">
                  {formatStudentDisplayName(currentStudent, lang)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>大武山守護者認證勇士</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 經濟與進度數據列 (無粗黑框線、純透水晶浮動版型) */}
            <div className="relative z-10 grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950/75 border border-amber-400/40 text-center backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-center gap-1 text-amber-300 text-xs font-black">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.coins}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-0.5">
                  {currentStudent.coins ?? 0}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/75 border border-indigo-400/40 text-center backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-center gap-1 text-indigo-300 text-xs font-black">
                  <Trophy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.questPoints}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-300 font-mono mt-0.5">
                  {currentStudent.quest_points ?? 0}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/75 border border-teal-400/40 text-center backdrop-blur-md shadow-lg">
                <div className="flex items-center justify-center gap-1 text-teal-300 text-xs font-black">
                  <Package className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t.backpackItems}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-teal-300 font-mono mt-0.5">
                  {currentStudent.inventory?.length ?? 0}
                </div>
              </div>
            </div>

            {/* 操作按鈕群 */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-2.5 pt-3">
              <Button3D
                variant="slate"
                size="md"
                onClick={() => setIsSwitching(true)}
                icon={RefreshCw}
                className="flex-1"
              >
                {t.switchSeatBtn}
              </Button3D>

              <Button3D
                variant="emerald"
                size="md"
                onClick={closeModal}
                icon={Check}
                className="flex-1"
              >
                {t.enterUniverseBtn}
              </Button3D>
            </div>

            <div className="relative z-10 text-center pt-1">
              <button
                onClick={logoutStudent}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold inline-flex items-center gap-1 py-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t.signOutBtn}
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
