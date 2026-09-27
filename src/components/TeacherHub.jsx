import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button3D } from './ui/Button3D';
import { insertWordsBatch, deleteWordById } from '../services/supabase';
import { Lock, ArrowLeft, PlusCircle, Trash2, CheckCircle2, AlertCircle, FileSpreadsheet, Sparkles } from 'lucide-react';

const TEACHERS = ['Mario', 'Ibu', 'Vanessa', 'Mark', 'Official'];

export const TeacherHub = ({ onBack, words = [], onRefreshWords }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('Mario');
  const [lessonName, setLessonName] = useState('Unit 1 自訂生字');
  const [pasteContent, setPasteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'wt7902230' || password === 'wutai') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('密碼錯誤，請重新輸入 (預設 wt7902230)');
    }
  };

  const handleBulkImport = async () => {
    if (!pasteContent.trim()) {
      showToast('請先貼上單字內容！', 'error');
      return;
    }
    if (!lessonName.trim()) {
      showToast('請填寫單元名稱！', 'error');
      return;
    }

    const lines = pasteContent.split(/\r?\n/).filter(line => line.trim() !== '');
    const parsedWords = [];

    lines.forEach(line => {
      // 支援逗號、Tab (從 Excel 複製) 或空白分隔
      const parts = line.split(/[,\t]+/).map(s => s.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        parsedWords.push({
          author: selectedTeacher,
          book: selectedTeacher === 'Official' ? '1' : `${selectedTeacher}專區`,
          lesson: lessonName.trim(),
          en: parts[0].toLowerCase(),
          zh: parts[1],
          cloze: parts[2] || ''
        });
      }
    });

    if (parsedWords.length === 0) {
      showToast('解析失敗：每行請至少包含「英文, 中文」', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await insertWordsBatch(parsedWords);
      showToast(`成功匯入 ${parsedWords.length} 個單字至 ${selectedTeacher} 老師字庫！`, 'success');
      setPasteContent('');
      if (onRefreshWords) await onRefreshWords();
    } catch (err) {
      console.error(err);
      showToast('匯入失敗，請檢查資料庫連線', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWord = async (id, en) => {
    if (!window.confirm(`確定要刪除單字「${en}」嗎？`)) return;
    try {
      await deleteWordById(id);
      showToast(`已刪除「${en}」`, 'success');
      if (onRefreshWords) await onRefreshWords();
    } catch (err) {
      showToast('刪除失敗', 'error');
    }
  };

  const currentTeacherWords = words.filter(w => w.author === selectedTeacher);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 font-heading">
            教師專屬字庫工作台
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
            提供 Mario, Ibu, Vanessa, Mark 快速新增與維護自建字庫
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入教師管理授權密碼"
              className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-center font-bold text-lg text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
              autoFocus
            />
            {authError && <p className="text-rose-500 text-xs font-bold">{authError}</p>}
            
            <div className="flex gap-3">
              <Button3D variant="slate" onClick={onBack} className="flex-1">
                回遊戲大廳
              </Button3D>
              <Button3D type="submit" variant="emerald" className="flex-1">
                解鎖進入
              </Button3D>
            </div>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-fadeIn pb-16">
      {/* 頂部導覽列 */}
      <div className="flex items-center justify-between mb-6">
        <Button3D variant="slate" size="sm" onClick={onBack} icon={ArrowLeft}>
          回遊戲大廳
        </Button3D>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          教師字庫極速管理台
        </h2>
        <div className="w-20" />
      </div>

      {toast && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-md animate-fadeIn ${
          toast.type === 'success' 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
            : 'bg-rose-100 text-rose-800 border border-rose-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          {toast.message}
        </div>
      )}

      {/* 教師標籤選擇列 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TEACHERS.map(teacher => (
          <button
            key={teacher}
            onClick={() => setSelectedTeacher(teacher)}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-sm ${
              selectedTeacher === teacher
                ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-105'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {teacher === 'Official' ? '📚 官方教材' : `👨‍🏫 ${teacher} 老師字庫`}
            <span className="ml-2 text-xs opacity-75">
              ({words.filter(w => w.author === teacher).length})
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側：極速貼上匯入器 */}
        <div className="lg:col-span-5">
          <GlassCard>
            <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400 font-black">
              <FileSpreadsheet className="w-5 h-5" />
              <h3 className="text-lg font-heading">1 秒批次貼上匯入</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-bold">
              可直接從 Excel 或 Google 試算表複製整欄（英文、中文）並貼在此處！
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1 block">
                  單元或課別名稱：
                </label>
                <input
                  type="text"
                  value={lessonName}
                  onChange={(e) => setLessonName(e.target.value)}
                  placeholder="例如：Unit 3 食物篇、期中必背"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1 block">
                  貼上單字內容（每行一個，以逗號或 Tab 分隔）：
                </label>
                <textarea
                  rows={8}
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="apple, 蘋果&#10;banana, 香蕉&#10;orange, 柳橙"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <Button3D
                variant="emerald"
                size="md"
                onClick={handleBulkImport}
                disabled={isSubmitting}
                className="w-full"
                icon={PlusCircle}
              >
                {isSubmitting ? '匯入中...' : `一鍵匯入至 ${selectedTeacher} 專區`}
              </Button3D>
            </div>
          </GlassCard>
        </div>

        {/* 右側：目前單字清單與管理 */}
        <div className="lg:col-span-7">
          <GlassCard className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-heading">
                  {selectedTeacher === 'Official' ? '官方單字列表' : `${selectedTeacher} 老師自建列表`}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  共收錄 {currentTeacherWords.length} 個單字
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[480px] space-y-2 pr-1">
              {currentTeacherWords.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                  <p className="text-sm font-bold">目前此分區尚無單字，請使用左側批次匯入。</p>
                </div>
              ) : (
                currentTeacherWords.map((word) => (
                  <div
                    key={word.id}
                    className="p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {word.lesson}
                      </span>
                      <div>
                        <span className="text-base font-black text-slate-800 dark:text-slate-100 mr-2">
                          {word.en}
                        </span>
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                          {word.zh}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteWord(word.id, word.en)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="刪除單字"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
