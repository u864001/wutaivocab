import React, { useState, useEffect, useRef } from 'react';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { checkIfQualifiesForTop50, uploadScore } from '../services/supabase';
import { CertificateModal } from './CertificateModal';
import { getAccuracyLevel } from '../services/certificateGenerator';
import { getProfanityError } from '../services/profanityFilter';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Sparkles, Send, Loader2, Award, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';

export const HonorSubmissionCard = ({
  mode,
  book,
  score = 0,
  time = 0,
  totalCount = 20,
  rangeText = '',
  reviewWords = [],
  onSuccess
}) => {
  const { t } = useI18n();
  const [status, setStatus] = useState('checking'); // 'checking' | 'not_qualifying_book' | 'not_top50' | 'qualified' | 'submitting' | 'submitted'
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('wutai_player_name') || '';
  });
  const [validationError, setValidationError] = useState('');
  const [isCertOpen, setIsCertOpen] = useState(false);
  const hasSubmittedRef = useRef(false);

  // 答對率計算
  const accuracy = totalCount > 0 ? Math.min(100, Math.round((score / totalCount) * 100)) : 100;
  const level = getAccuracyLevel(accuracy);

  useEffect(() => {
    let isCancelled = false;

    // 1. 若未滿足單冊單元範圍門檻 (跨多冊或題數不足)
    if (!book) {
      setStatus('not_qualifying_book');
      return;
    }

    // 2. 得分必須大於 0 才有資格
    if (!score || score <= 0) {
      setStatus('not_top50');
      return;
    }

    // 3. 向 Supabase 檢查本週該冊別、該模式是否達到 Top 50 門檻
    setStatus('checking');
    checkIfQualifiesForTop50({ mode, book, score, time })
      .then((qualified) => {
        if (isCancelled) return;
        if (qualified) {
          setStatus('qualified');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          } catch (e) {}
        } else {
          setStatus('not_top50');
        }
      })
      .catch(() => {
        if (!isCancelled) setStatus('qualified'); // 網路異常時以鼓勵優先
      });

    return () => {
      isCancelled = true;
    };
  }, [mode, book, score, time]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmedName = playerName.trim();
    if (!trimmedName || status === 'submitting' || hasSubmittedRef.current) return;

    // ── 不雅文字檢驗攔截 ──
    const badWordError = getProfanityError(trimmedName);
    if (badWordError) {
      setValidationError(badWordError);
      return;
    }

    hasSubmittedRef.current = true;
    setStatus('submitting');
    localStorage.setItem('wutai_player_name', trimmedName);

    const success = await uploadScore({
      mode,
      book,
      name: trimmedName,
      score,
      time
    });

    if (success) {
      setStatus('submitted');
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      if (onSuccess) onSuccess();
    } else {
      hasSubmittedRef.current = false;
      setStatus('qualified'); // 上傳失敗重試
    }
  };

  // 一鍵換人玩 / 清除暫存暱稱
  const handleSwitchPlayer = () => {
    localStorage.removeItem('wutai_player_name');
    setPlayerName('');
    hasSubmittedRef.current = false;
  };

  const effectiveRangeText = rangeText || (book ? `第 ${book} 冊精選單元` : '全校英語星際挑戰');

  return (
    <div className="w-full mb-6 space-y-4">
      {/* ── 普及成就感：領取榮譽獎狀便當條 (所有學生皆可點擊領取！) ── */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-500/20 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/30 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                答對率 {accuracy}%
              </span>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                {level.badge} {level.title}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
              完成 {totalCount} 題，答對 {score} 題！可生成官方認證獎狀
            </p>
          </div>
        </div>

        <Button3D
          variant="amber"
          size="sm"
          onClick={() => setIsCertOpen(true)}
          icon={Award}
          className="shadow-md shrink-0 w-full sm:w-auto"
        >
          {t.viewCertificateBtn}
        </Button3D>
      </div>

      {/* 狀況 1：未選取符合排行榜門檻的範圍 */}
      {status === 'not_qualifying_book' && (
        <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <span className="text-base leading-none">💡</span>
            <span>
              <strong className="text-slate-700 dark:text-slate-200 block mb-0.5">{t.scopeHintTitle}</strong>
              {t.scopeHintText}
            </span>
          </p>
        </div>
      )}

      {/* 狀況 2：比對中 */}
      {status === 'checking' && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          <span className="text-xs font-black text-blue-700 dark:text-blue-300">
            {t.checkingTop50}
          </span>
        </div>
      )}

      {/* 狀況 3：未突破 Top 50 門檻 */}
      {status === 'not_top50' && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
          <p className="text-xs font-black text-amber-800 dark:text-amber-300 mb-1">
            {t.notTop50Title}
          </p>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {t.notTop50Encourage}
          </p>
        </div>
      )}

      {/* 狀況 4：成功上傳 */}
      {status === 'submitted' && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-black text-sm mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {t.submittedTitle}
          </div>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {t.submittedSubtitle}
          </p>
        </div>
      )}

      {/* 狀況 5：突破紀錄，符合 Top 50 留名資格 */}
      {(status === 'qualified' || status === 'submitting') && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-400 dark:border-amber-600 text-center shadow-lg animate-fadeIn">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
            <span className="text-sm font-black text-amber-900 dark:text-amber-200 font-heading">
              {t.qualifyTop50Title}
            </span>
          </div>
          <p className="text-xs font-bold text-amber-800/80 dark:text-amber-300/80 mb-3">
            {t.breakTop50Prompt}
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setValidationError('');
                }}
                placeholder={t.namePlaceholder}
                maxLength={15}
                className={`w-full p-3 rounded-xl border ${
                  validationError ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' : 'border-amber-300 dark:border-amber-700'
                } bg-white dark:bg-slate-800 text-center font-black text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-400 text-sm shadow-inner pr-20`}
              />
              {playerName && (
                <button
                  type="button"
                  onClick={handleSwitchPlayer}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  title="切換其他同學"
                >
                  {t.switchPlayer}
                </button>
              )}
            </div>

            {validationError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-black text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <Button3D
              variant="amber"
              size="md"
              type="submit"
              disabled={!playerName.trim() || status === 'submitting' || hasSubmittedRef.current}
              className="w-full"
              icon={Send}
            >
              {status === 'submitting' ? t.submittingBtn : t.submitHonorBtn}
            </Button3D>
          </form>
        </div>
      )}

      {/* ── 官方榮譽獎狀全頁彈窗 ── */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        studentName={playerName || '優秀學生'}
        rangeText={effectiveRangeText}
        totalCount={totalCount}
        correctCount={score}
        accuracy={accuracy}
        reviewWords={reviewWords}
      />
    </div>
  );
};
