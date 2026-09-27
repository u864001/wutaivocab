import React, { useState, useEffect } from 'react';
import { Button3D } from './ui/Button3D';
import { useI18n } from '../context/I18nContext';
import { checkIfQualifiesForTop50, uploadScore } from '../services/supabase';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Sparkles, Send, Loader2 } from 'lucide-react';

export const HonorSubmissionCard = ({
  mode,
  book,
  score,
  time,
  onSuccess
}) => {
  const { t } = useI18n();
  const [status, setStatus] = useState('checking'); // 'checking' | 'not_qualifying_book' | 'not_top50' | 'qualified' | 'submitting' | 'submitted'
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('wutai_player_name') || '';
  });

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
    if (!playerName.trim() || status === 'submitting') return;

    setStatus('submitting');
    const trimmedName = playerName.trim();
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
      setStatus('qualified'); // 上傳失敗重試
    }
  };

  // 狀況 1：未選取符合排行榜門檻的範圍
  if (status === 'not_qualifying_book') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <span className="text-base leading-none">💡</span>
          <span>
            <strong className="text-slate-700 dark:text-slate-200 block mb-0.5">{t.scopeHintTitle}</strong>
            {t.scopeHintText}
          </span>
        </p>
      </div>
    );
  }

  // 狀況 2：比對中
  if (status === 'checking') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        <span className="text-xs font-black text-blue-700 dark:text-blue-300">
          {t.checkingTop50}
        </span>
      </div>
    );
  }

  // 狀況 3：未突破 Top 50 門檻
  if (status === 'not_top50') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
        <p className="text-xs font-black text-amber-800 dark:text-amber-300 mb-1">
          {t.notTop50Title}
        </p>
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {t.notTop50Encourage}
        </p>
      </div>
    );
  }

  // 狀況 4：成功上傳
  if (status === 'submitted') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center animate-fadeIn">
        <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-black text-sm mb-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          {t.submittedTitle}
        </div>
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
          {t.submittedSubtitle}
        </p>
      </div>
    );
  }

  // 狀況 5：突破紀錄，符合 Top 50 留名資格
  return (
    <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-400 dark:border-amber-600 text-center shadow-lg animate-fadeIn">
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
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder={t.namePlaceholder}
          maxLength={15}
          className="w-full p-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-center font-black text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-400 text-sm shadow-inner"
        />
        <Button3D
          variant="amber"
          size="md"
          type="submit"
          disabled={!playerName.trim() || status === 'submitting'}
          className="w-full"
          icon={Send}
        >
          {status === 'submitting' ? t.submittingBtn : t.submitHonorBtn}
        </Button3D>
      </form>
    </div>
  );
};
