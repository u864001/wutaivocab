import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { Lock, KeyRound, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { soundEngine } from '../services/audio';

export const TEACHER_PASSWORD = 'wt7902230';

export const TeacherAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { lang } = useI18n();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMsg('');
      setShowPassword(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!password) {
      setErrorMsg(lang === 'zh-TW' ? '請輸入教師通行密碼' : 'Please enter password');
      soundEngine.wrong();
      return;
    }

    if (password === TEACHER_PASSWORD) {
      soundEngine.correct();
      sessionStorage.setItem('wutai_teacher_authed', 'true');
      onSuccess();
    } else {
      soundEngine.wrong();
      setErrorMsg(lang === 'zh-TW' ? '密碼錯誤，請重新輸入' : 'Incorrect password');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <GlassCard className="w-full max-w-sm p-6 relative overflow-hidden shadow-2xl border-2 border-indigo-300 dark:border-indigo-700/60 bg-white/95 dark:bg-slate-900/95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
              {lang === 'zh-TW' ? '教師工作台驗證' : 'Teacher Access'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {lang === 'zh-TW' ? '請輸入通行密碼以管理題庫與公告' : 'Enter passcode to access admin hub'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={lang === 'zh-TW' ? '請輸入通行密碼...' : 'Enter passcode...'}
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-white font-mono text-base font-bold outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-black animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button3D
              type="submit"
              variant="blue"
              size="md"
              icon={KeyRound}
              className="flex-1"
            >
              {lang === 'zh-TW' ? '確認登入' : 'Verify'}
            </Button3D>
            <Button3D
              type="button"
              variant="slate"
              size="md"
              onClick={onClose}
            >
              {lang === 'zh-TW' ? '取消' : 'Cancel'}
            </Button3D>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
