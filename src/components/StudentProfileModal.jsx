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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-emerald-400/80 dark:border-emerald-600/80 overflow-hidden relative my-auto animate-scaleUp">
        {/* 頂部裝飾條與關閉按鈕 */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 p-4 sm:p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-heading font-black tracking-wide">
                {t.studentPassportTitle}
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-bold">
                {t.studentPassportSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 模式 A：已登入且未點選切換 ── 顯示當前通行證名片 */}
          {isLoggedIn && !isSwitching ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-indigo-500/10 dark:from-emerald-950/40 dark:to-slate-800/80 border-2 border-emerald-300 dark:border-emerald-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.currentIdentity}
                  </span>
                  <span className="font-mono text-xs font-black text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    ID: {currentStudent.student_id}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 pt-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 text-amber-950 flex items-center justify-center font-heading font-black text-xl shadow-md">
                    {formatStudentBadge(currentStudent, lang).substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-heading font-black text-slate-800 dark:text-white">
                      {currentStudent.nickname}
                    </h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {formatStudentDisplayName(currentStudent, lang)}
                    </p>
                  </div>
                </div>

                {/* 經濟與進度數據列 */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-300 dark:border-amber-700/60 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-black">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{t.coins}</span>
                    </div>
                    <div className="text-lg font-black text-amber-700 dark:text-amber-300 font-mono mt-0.5">
                      {currentStudent.coins ?? 0}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-300 dark:border-indigo-700/60 text-center">
                    <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-black">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{t.questPoints}</span>
                    </div>
                    <div className="text-lg font-black text-indigo-700 dark:text-indigo-300 font-mono mt-0.5">
                      {currentStudent.quest_points ?? 0}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-300 dark:border-teal-700/60 text-center">
                    <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-black">
                      <Package className="w-3.5 h-3.5" />
                      <span>{t.backpackItems}</span>
                    </div>
                    <div className="text-lg font-black text-teal-700 dark:text-teal-300 font-mono mt-0.5">
                      {currentStudent.inventory?.length ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按鈕群 */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
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

              <div className="text-center pt-1">
                <button
                  onClick={logoutStudent}
                  className="text-xs text-rose-500 hover:text-rose-600 font-bold inline-flex items-center gap-1 py-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t.signOutBtn}
                </button>
              </div>
            </div>
          ) : (
            /* 模式 B：選擇身分與 6 碼漫遊綁定表單 */
            <form onSubmit={handleConfirmLogin} className="space-y-4 animate-fadeIn">
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
          )}
        </div>
      </div>
    </div>
  );
};
