import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Filter,
  Download,
  ExternalLink,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
  Layers,
  Award,
  Search,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  MessageSquare,
  BookmarkCheck,
  FileCheck2,
  GraduationCap,
  Calendar,
  Compass,
  Cloud,
  RefreshCw
} from 'lucide-react';
import {
  HERE_WE_GO_MCQ_BANK,
  HERE_WE_GO_BOOK_META,
  SAA_115_EXAM_PAPERS,
  SAA_EXAM_BANK,
  TME_PRE_A1_BANK,
  TME_PRE_A1_CATEGORIES
} from '../../data/exam';
import { TASK_TYPES, getTaskType, getTaskLabel } from '../../games/exam/examBlueprint';
import {
  saveTeacherAuditRecordToCloud,
  fetchTeacherAuditRecordsFromCloud
} from '../../services/supabase';

const AUDIT_STORAGE_KEY = 'wutai_exam_audit_records_v1';
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

export function ExamAuditZone({ onBack }) {
  // ── 檢核儲存狀態 ──
  // { [questionId]: { verified: boolean, notes: string, updatedAt: number, verifiedBy?: string } }
  const [auditRecords, setAuditRecords] = useState(() => {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [cloudSyncStatus, setCloudSyncStatus] = useState('synced'); // 'synced' | 'saving' | 'error'
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  // ── 開啟組件時自動自 Supabase 雲端載入並聯集融合 ──
  useEffect(() => {
    let isMounted = true;
    setIsCloudLoading(true);
    fetchTeacherAuditRecordsFromCloud()
      .then((cloudRecords) => {
        if (!isMounted || !cloudRecords || Object.keys(cloudRecords).length === 0) return;
        setAuditRecords((prev) => {
          const merged = { ...prev };
          for (const [k, v] of Object.entries(cloudRecords)) {
            if (!merged[k] || (v.updatedAt || 0) >= (merged[k].updatedAt || 0)) {
              merged[k] = v;
            }
          }
          try {
            localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          return merged;
        });
        setCloudSyncStatus('synced');
      })
      .catch((err) => {
        console.warn('Supabase fetch audit failed', err);
        setCloudSyncStatus('error');
      })
      .finally(() => {
        if (isMounted) setIsCloudLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const saveAuditRecords = useCallback((nextRecords) => {
    setAuditRecords(nextRecords);
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(nextRecords));
    } catch (e) {
      console.warn('Failed to save audit records to localStorage', e);
    }
  }, []);

  // ── 第一層：測驗體系 ('textbook' | 'ministry-assessment' | 'tme-preA1') ──
  const [activeTrack, setActiveTrack] = useState('ministry-assessment');

  // ── 預設勾選「排除已檢核通過題目」 ──
  const [excludeVerified, setExcludeVerified] = useState(true);

  // ── 課本題庫篩選：第二層 年級 ＆ 第三層 題型 ──
  const [selectedTextbookGrade, setSelectedTextbookGrade] = useState('3'); // 'all' | 'g1' | 'g2' | '3' | '4' | '5' | '6' | '9'
  const [selectedTextbookTaskType, setSelectedTextbookTaskType] = useState('all');

  // ── 學力檢測篩選：第二層 年度 ＆ 第三層 年級 ──
  const [selectedSaaYear, setSelectedSaaYear] = useState(115);
  const [selectedSaaGrade, setSelectedSaaGrade] = useState(4); // 4 | 5 | 6

  // ── Pre A1 檢測篩選：第二層 5大能力面向 ＆ 第三層 子題型 ──
  const [selectedPreA1Category, setSelectedPreA1Category] = useState('vocab'); // vocab | listening | reading | speaking | writing
  const [selectedPreA1SubType, setSelectedPreA1SubType] = useState('all');

  // ── 當前檢核索引與狀態 ──
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentNoteDraft, setCurrentNoteDraft] = useState('');
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // ── 語音試聽功能 (Web Speech) ──
  const speakText = useCallback((text) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = /[\u4e00-\u9fa5]/.test(text) ? 'zh-TW' : 'en-US';
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('TTS failed', e);
    }
  }, []);

  // ── 1. 課本題庫可用母池 ──
  const textbookRawPool = useMemo(() => {
    let list = HERE_WE_GO_MCQ_BANK;
    if (selectedTextbookGrade === 'g1') {
      list = list.filter((q) => q.book === 'g1');
    } else if (selectedTextbookGrade === 'g2') {
      list = list.filter((q) => q.book === 'g2');
    } else if (selectedTextbookGrade === '3') {
      list = list.filter((q) => q.book === 1 || q.book === 2);
    } else if (selectedTextbookGrade === '4') {
      list = list.filter((q) => q.book === 3 || q.book === 4);
    } else if (selectedTextbookGrade === '5') {
      list = list.filter((q) => q.book === 5 || q.book === 6);
    } else if (selectedTextbookGrade === '6') {
      list = list.filter((q) => q.book === 7 || q.book === 8);
    } else if (selectedTextbookGrade === '9') {
      list = list.filter((q) => q.book === 9);
    }
    return list;
  }, [selectedTextbookGrade]);

  // 課本題庫目前年級所包含的所有題型代碼與統計
  const textbookTaskTypeSummary = useMemo(() => {
    const counts = {};
    for (const q of textbookRawPool) {
      const tt = getTaskType(q);
      counts[tt] = (counts[tt] || 0) + 1;
    }
    return counts;
  }, [textbookRawPool]);

  // ── 2. 學力檢測可用母池 (115 完整的 35 題原卷) ──
  const saaRawPool = useMemo(() => {
    const paper = SAA_115_EXAM_PAPERS[selectedSaaGrade];
    if (paper && Array.isArray(paper.questions)) {
      return paper.questions;
    }
    return SAA_EXAM_BANK.filter((q) => q.targetGrade === selectedSaaGrade);
  }, [selectedSaaGrade]);

  // ── 3. Pre A1 可用母池 ──
  const preA1RawPool = useMemo(() => {
    let list = TME_PRE_A1_BANK.filter((q) => q.category === selectedPreA1Category);
    if (selectedPreA1SubType !== 'all') {
      list = list.filter((q) => q.subType === selectedPreA1SubType);
    }
    return list;
  }, [selectedPreA1Category, selectedPreA1SubType]);

  // ── 當前分類總池 (尚未過濾已通過) ──
  const currentCategoryFullPool = useMemo(() => {
    if (activeTrack === 'textbook') {
      if (selectedTextbookTaskType === 'all') return textbookRawPool;
      return textbookRawPool.filter((q) => getTaskType(q) === selectedTextbookTaskType);
    }
    if (activeTrack === 'ministry-assessment') {
      return saaRawPool;
    }
    return preA1RawPool;
  }, [
    activeTrack,
    textbookRawPool,
    selectedTextbookTaskType,
    saaRawPool,
    preA1RawPool
  ]);

  // ── 依「排除已檢核通過」篩選後的待檢核清單 ──
  const displayPool = useMemo(() => {
    if (!excludeVerified) return currentCategoryFullPool;
    return currentCategoryFullPool.filter((q) => !auditRecords[q.id]?.verified);
  }, [currentCategoryFullPool, excludeVerified, auditRecords]);

  // 換分類時重置頁碼
  useEffect(() => {
    setCurrentIdx(0);
  }, [
    activeTrack,
    selectedTextbookGrade,
    selectedTextbookTaskType,
    selectedSaaYear,
    selectedSaaGrade,
    selectedPreA1Category,
    selectedPreA1SubType,
    excludeVerified
  ]);

  // 當前正在檢核的題目
  const currentQ = displayPool[currentIdx] || null;

  // 當前題目的檢核紀錄與草稿同步
  useEffect(() => {
    if (currentQ) {
      setCurrentNoteDraft(auditRecords[currentQ.id]?.notes || '');
    } else {
      setCurrentNoteDraft('');
    }
  }, [currentQ?.id, auditRecords]);

  // ── 標記本題通過 / 取消通過 ──
  const handleToggleVerified = useCallback(
    (qId) => {
      if (!qId) return;
      const isCurrentlyVerified = !!auditRecords[qId]?.verified;
      const willBeVerified = !isCurrentlyVerified;
      const nextRecords = {
        ...auditRecords,
        [qId]: {
          ...auditRecords[qId],
          verified: willBeVerified,
          notes: currentNoteDraft,
          updatedAt: Date.now()
        }
      };
      saveAuditRecords(nextRecords);

      // 即時同步至 Supabase 雲端
      setCloudSyncStatus('saving');
      saveTeacherAuditRecordToCloud({
        questionId: qId,
        verified: willBeVerified,
        notes: currentNoteDraft,
        verifiedBy: 'Mark'
      }).then((ok) => {
        setCloudSyncStatus(ok ? 'synced' : 'error');
      });

      showToast(willBeVerified ? '✓ 本題已標記通過（已同步 Supabase）！' : '已取消通過標記（已同步 Supabase）');
    },
    [auditRecords, currentNoteDraft, saveAuditRecords]
  );

  // ── 儲存當前題目筆記 ──
  const handleSaveNotes = useCallback(
    (qId, noteText) => {
      if (!qId) return;
      const finalNote = noteText !== undefined ? noteText : currentNoteDraft;
      const nextRecords = {
        ...auditRecords,
        [qId]: {
          ...auditRecords[qId],
          verified: !!auditRecords[qId]?.verified,
          notes: finalNote,
          updatedAt: Date.now()
        }
      };
      saveAuditRecords(nextRecords);

      // 即時同步至 Supabase 雲端
      setCloudSyncStatus('saving');
      saveTeacherAuditRecordToCloud({
        questionId: qId,
        verified: !!auditRecords[qId]?.verified,
        notes: finalNote,
        verifiedBy: 'Mark'
      }).then((ok) => {
        setCloudSyncStatus(ok ? 'synced' : 'error');
      });

      showToast('已儲存試題修正意見至 Supabase 雲端！');
    },
    [auditRecords, currentNoteDraft, saveAuditRecords]
  );

  // ── 儲存並前進下一題 ──
  const handleSaveAndNext = useCallback(() => {
    if (!currentQ) return;
    handleSaveNotes(currentQ.id);
    if (currentIdx < displayPool.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  }, [currentQ, currentIdx, displayPool.length, handleSaveNotes]);

  // ── 鍵盤快捷鍵 (左右翻頁、V 鍵切換核可) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 避免在 textarea 打字時觸發翻頁
      if (['TEXTAREA', 'INPUT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        setCurrentIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIdx((i) => Math.min(displayPool.length - 1, i + 1));
      } else if (e.key.toLowerCase() === 'v' && currentQ) {
        handleToggleVerified(currentQ.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, displayPool.length, handleToggleVerified]);

  // ── 匯出檢核意見報告 (Markdown / JSON) ──
  const handleExportAuditReport = () => {
    const flaggedItems = [];
    const allRecords = Object.entries(auditRecords);
    for (const [qId, rec] of allRecords) {
      if (rec.notes || rec.verified) {
        flaggedItems.push({
          id: qId,
          verified: !!rec.verified,
          notes: rec.notes || '無筆記',
          updatedAt: new Date(rec.updatedAt || Date.now()).toLocaleString()
        });
      }
    }

    const mdLines = [
      '# 霧臺英語檢定館 • 試題檢核與修正紀錄報告',
      `產生時間: ${new Date().toLocaleString()}`,
      `累計檢核通過: ${allRecords.filter(([, r]) => r.verified).length} 題`,
      `有填寫修正筆記: ${flaggedItems.filter((i) => i.notes && i.notes !== '無筆記').length} 題\n`,
      '---',
      '## 待修正與檢核紀錄清單\n'
    ];

    flaggedItems.forEach((item, index) => {
      mdLines.push(`### ${index + 1}. [${item.verified ? '已核可' : '待修正'}] 題號: ${item.id}`);
      mdLines.push(`- **修正意見／筆記**：${item.notes}`);
      mdLines.push(`- **最後更新時間**：${item.updatedAt}\n`);
    });

    const blob = new Blob([mdLines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wutai_exam_audit_report_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('已成功匯出 Markdown 檢核意見報告！');
  };

  // 統計總數
  const totalInCategory = currentCategoryFullPool.length;
  const verifiedInCategory = currentCategoryFullPool.filter(
    (q) => auditRecords[q.id]?.verified
  ).length;
  const flaggedInCategory = currentCategoryFullPool.filter(
    (q) => auditRecords[q.id]?.notes?.trim()
  ).length;

  return (
    <div className="flex flex-col h-full max-h-[100dvh] bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 select-none">
      {/* ── 頂端精簡導覽與全域狀態列 ── */}
      <div className="shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft size={15} />
            回後台首頁
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <BookmarkCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
              霧臺英語檢定館 • 試題檢核區
            </h2>
          </div>
        </div>

        {/* 預設勾選「排除已檢核通過」＋ 匯出報告 ＋ 雲端同步狀態 */}
        <div className="flex items-center gap-2 text-xs">
          {/* Supabase 雲端同步狀態徽章 */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-black transition-all ${
              cloudSyncStatus === 'saving'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : cloudSyncStatus === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
            }`}
            title="本檢核區與 Supabase 雲端資料庫保持雙向即時同步，下次修正可直接由 AI 調取"
          >
            <Cloud size={13} className={cloudSyncStatus === 'saving' ? 'animate-bounce' : ''} />
            <span className="hidden sm:inline">
              {cloudSyncStatus === 'saving'
                ? '雲端儲存中...'
                : cloudSyncStatus === 'error'
                ? '雲端離線中'
                : isCloudLoading
                ? '雲端讀取中...'
                : 'Supabase 雲端已同步'}
            </span>
          </div>

          <label className="flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer hover:bg-indigo-50/60 dark:hover:bg-slate-700 transition">
            <input
              type="checkbox"
              checked={excludeVerified}
              onChange={(e) => setExcludeVerified(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-0 cursor-pointer"
            />
            <span className={excludeVerified ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-600 dark:text-slate-300'}>
              排除已通過題目
            </span>
          </label>

          <button
            type="button"
            onClick={handleExportAuditReport}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold flex items-center gap-1 transition cursor-pointer"
            title="匯出所有已記錄筆記與檢核通過狀態"
          >
            <Download size={14} />
            <span className="hidden sm:inline">匯出檢核報表</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg animate-fadeIn flex items-center gap-1.5">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 第一層：三大測驗體系切換 (課本題庫 / 學力檢測 / Pre A1 檢測) ── */}
      <div className="shrink-0 px-3 sm:px-6 pt-2 pb-1 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-3 gap-2 max-w-4xl">
          {[
            { id: 'textbook', label: '課本題庫練習', icon: BookOpen, count: HERE_WE_GO_MCQ_BANK.length, desc: '1,289 題分年級分題型' },
            { id: 'ministry-assessment', label: '學力檢測練習', icon: GraduationCap, count: 105, desc: '115 全真 35 題原卷' },
            { id: 'tme-preA1', label: 'Pre A1 檢測練習', icon: Award, count: TME_PRE_A1_BANK.length, desc: '五大面向專項題庫' }
          ].map((tab) => {
            const active = activeTrack === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTrack(tab.id)}
                className={`p-2 sm:p-2.5 rounded-xl border-2 text-left transition flex items-center gap-2 sm:gap-3 cursor-pointer ${
                  active
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/70 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    active ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs sm:text-sm font-black truncate ${active ? 'text-indigo-950 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    {tab.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {tab.desc} ({tab.count}題)
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 第二層 ＆ 第三層 篩選控制列 ── */}
      <div className="shrink-0 px-3 sm:px-6 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 space-y-2">
        {/* Case A: 課本題庫 (第二層 年級 ＆ 第三層 題型) */}
        {activeTrack === 'textbook' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-black text-slate-400 shrink-0 uppercase tracking-wide">
                年級：
              </span>
              {[
                { key: 'g1', label: '一年級 (g1 大寫)' },
                { key: 'g2', label: '二年級 (g2 大小寫)' },
                { key: '3', label: '三年級 (B1~2)' },
                { key: '4', label: '四年級 (B3~4)' },
                { key: '5', label: '五年級 (B5~6)' },
                { key: '6', label: '六年級 (B7~8)' },
                { key: '9', label: '國一先修 (B9)' },
                { key: 'all', label: '全部年級' }
              ].map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setSelectedTextbookGrade(g.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedTextbookGrade === g.key
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-black text-slate-400 shrink-0 uppercase tracking-wide">
                題型流水：
              </span>
              <button
                type="button"
                onClick={() => setSelectedTextbookTaskType('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                  selectedTextbookTaskType === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                }`}
              >
                全部題型 ({textbookRawPool.length})
              </button>
              {Object.entries(textbookTaskTypeSummary).map(([ttCode, cnt]) => {
                const label = TASK_TYPES[ttCode]?.label || ttCode;
                const isSelected = selectedTextbookTaskType === ttCode;
                return (
                  <button
                    key={ttCode}
                    type="button"
                    onClick={() => setSelectedTextbookTaskType(ttCode)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({cnt})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Case B: 學力檢測 (第二層 年度 ＆ 第三層 年級，一次就是完整 35 題) */}
        {activeTrack === 'ministry-assessment' && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  年度：
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black border border-indigo-200 dark:border-indigo-800">
                  115 年度
                </span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  年級：
                </span>
                {[
                  { grade: 4, label: '四年級 (35題全卷)' },
                  { grade: 5, label: '五年級 (35題全卷)' },
                  { grade: 6, label: '六年級 (35題全卷)' }
                ].map((g) => (
                  <button
                    key={g.grade}
                    type="button"
                    onClick={() => setSelectedSaaGrade(g.grade)}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                      selectedSaaGrade === g.grade
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-bold hidden sm:block">
              包含 1~15 題聽力 ＋ 16~35 題閱讀，全真逐題檢核
            </div>
          </div>
        )}

        {/* Case C: Pre A1 檢測 (第二層 5大面向 ＆ 第三層 子題型) */}
        {activeTrack === 'tme-preA1' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-black text-slate-400 shrink-0 uppercase tracking-wide">
                能力面向：
              </span>
              {Object.values(TME_PRE_A1_CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedPreA1Category(cat.id);
                    setSelectedPreA1SubType('all');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                    selectedPreA1Category === cat.id
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-black text-slate-400 shrink-0 uppercase tracking-wide">
                子題型：
              </span>
              <button
                type="button"
                onClick={() => setSelectedPreA1SubType('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                  selectedPreA1SubType === 'all'
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                }`}
              >
                全部子題型
              </button>
              {TME_PRE_A1_CATEGORIES[selectedPreA1Category]?.subTypes.map((st) => (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => setSelectedPreA1SubType(st.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1 ${
                    selectedPreA1SubType === st.code
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 主檢視視窗 (雙欄排版：左側為學生同款測驗題卡，右側為教師檢核與筆記專區) ── */}
      <div className="flex-1 min-h-0 p-3 sm:p-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 overflow-y-auto overscroll-contain">
        {displayPool.length === 0 ? (
          <div className="lg:col-span-12 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 my-auto">
            <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              本分類試題已全數檢核通過！
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 mb-4">
              目前已勾選「排除已檢核通過題目」，因此無待審核題目。若要複查，可隨時取消勾選。
            </p>
            <button
              type="button"
              onClick={() => setExcludeVerified(false)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition"
            >
              檢視本分類全部題目 ({currentCategoryFullPool.length} 題)
            </button>
          </div>
        ) : (
          <>
            {/* ── 左側：學生測驗視窗同款卡片 (呈現題目、題圖、選項與正解醒目標示) ── */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 overflow-y-auto">
              <div className="space-y-3">
                {/* 題號與分類標籤列 */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-xs">
                      #{currentIdx + 1} / {displayPool.length}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      ID: {currentQ.id}
                    </span>
                    {currentQ.dimension && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[11px] font-bold">
                        向度：{currentQ.dimension}
                      </span>
                    )}
                    {currentQ.taskType && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                        {getTaskLabel(currentQ)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => speakText(currentQ.media?.audioText || currentQ.question)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center gap-1 transition cursor-pointer"
                  >
                    <Volume2 size={14} />
                    <span>試聽發音</span>
                  </button>
                </div>

                {/* 閱讀篇章卡片 (Passage) */}
                {currentQ.passage && (
                  <div className="p-3 sm:p-4 rounded-xl bg-indigo-50/70 dark:bg-slate-800/90 border border-indigo-200/80 dark:border-slate-700 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                    <div className="font-black text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
                      <BookOpen size={16} />
                      <span>{currentQ.passage.title || '【生活閱讀篇章】'}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {currentQ.passage.text}
                    </div>
                  </div>
                )}

                {/* 題幹文字 */}
                <div className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed py-1">
                  {currentQ.question}
                </div>

                {/* 考卷圖檔 (支援點擊放大檢驗裁切邊界) */}
                {currentQ.image && (
                  <div className="space-y-1.5 my-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                      <span className="flex items-center gap-1">
                        <ImageIcon size={13} />
                        圖檔路徑: {currentQ.image}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewImageModal(currentQ.image)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Eye size={12} />
                        放大檢查裁切
                      </button>
                    </div>
                    <div
                      onClick={() => setPreviewImageModal(currentQ.image)}
                      className="flex justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 transition cursor-zoom-in group"
                    >
                      <img
                        src={currentQ.image}
                        alt="題目圖案"
                        className="max-h-56 sm:max-h-64 max-w-full w-auto object-contain rounded-lg group-hover:scale-[1.01] transition-transform"
                      />
                    </div>
                  </div>
                )}

                {/* 寫作重組單字預覽 (若為寫作重組題) */}
                {currentQ.scrambledWords && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
                    <span className="text-xs font-black text-amber-800 dark:text-amber-300">
                      打散單字塊（學生端提供拖曳／點擊排列）：
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentQ.scrambledWords.map((w, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xs"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                    {currentQ.targetSentence && (
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
                        標準目標句子：<span className="text-emerald-600 dark:text-emerald-400">{currentQ.targetSentence}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 口說朗讀文本預覽 (若為口說題) */}
                {currentQ.targetText && (
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-black text-purple-800 dark:text-purple-300 block">
                        口說評測標的文字：
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
                        "{currentQ.targetText}"
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakText(currentQ.targetText)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:bg-purple-700"
                    >
                      <Volume2 size={14} />
                      示範發音
                    </button>
                  </div>
                )}

                {/* (A)(B)(C)(D) 選項區（醒目標記正確答案） */}
                {currentQ.options && currentQ.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {currentQ.options.map((optText, oIdx) => {
                      const isCorrect = oIdx === currentQ.answer;
                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between gap-2.5 ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-black shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-bold opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {CHOICE_LABELS[oIdx] || oIdx + 1}
                            </span>
                            <span className="text-xs sm:text-sm break-words">{optText}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 shrink-0">
                              ✓ 正解
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 題目詳解卡片 */}
              {currentQ.explanation && (
                <div className="mt-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-100 leading-relaxed">
                  <span className="font-black text-blue-700 dark:text-blue-300">💡 題目解析與解題線索：</span>
                  {currentQ.explanation}
                </div>
              )}
            </div>

            {/* ── 右側：教師檢核操作區與筆記面板 ── */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3">
              <div className="space-y-4">
                {/* 檢核狀態標題 */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="text-indigo-600 dark:text-indigo-400" size={18} />
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      教師審核與檢驗意見
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      auditRecords[currentQ.id]?.verified
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        : auditRecords[currentQ.id]?.notes?.trim()
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {auditRecords[currentQ.id]?.verified
                      ? '✓ 檢核已通過'
                      : auditRecords[currentQ.id]?.notes?.trim()
                      ? '⚠️ 待修正筆記'
                      : '⏳ 待檢核'}
                  </span>
                </div>

                {/* 1. 「本題檢核通過」大核選框 */}
                <div
                  onClick={() => handleToggleVerified(currentQ.id)}
                  className={`p-3.5 rounded-2xl border-2 transition flex items-center justify-between gap-3 cursor-pointer ${
                    auditRecords[currentQ.id]?.verified
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black transition ${
                        auditRecords[currentQ.id]?.verified
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-transparent'
                      }`}
                    >
                      <Check size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        本題檢核通過 (Verified)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        題目內容、選項、答案與圖檔均無誤
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    [快速鍵: V]
                  </span>
                </div>

                {/* 2. 試題修正意見輸入框 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-amber-500" />
                      <span>試題修正意見／裁切問題備註：</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-bold">自動儲存</span>
                  </div>
                  <textarea
                    value={currentNoteDraft}
                    onChange={(e) => setCurrentNoteDraft(e.target.value)}
                    placeholder="請在此記錄需修正之處，例如：&#10;• 右側切到選項④，請往右包含選項&#10;• 圖檔上方不要題目中文字，只要下方漫畫圖&#10;• 正解標示有疑義，應為選項 B等..."
                    rows={4}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 leading-relaxed shadow-inner"
                  />

                  {/* 快捷自然語言裁切修正建議詞 (老師不用算 px，點擊自動帶入並存雲端) */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 self-center">快捷填入：</span>
                    {[
                      '右側切到選項④，請往右包含選項',
                      '上方題幹中文字不要，只要下方插圖',
                      '四周留白偏窄，請向外擴大留白',
                      '請包含整道題目（含題目與選項）',
                      '答案有疑義，需再次校對'
                    ].map((snippet) => (
                      <button
                        key={snippet}
                        type="button"
                        onClick={() => {
                          const updated = currentNoteDraft.trim()
                            ? `${currentNoteDraft.trim()}\n• ${snippet}`
                            : `• ${snippet}`;
                          setCurrentNoteDraft(updated);
                          handleSaveNotes(currentQ.id, updated);
                        }}
                        className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-[10px] font-bold hover:bg-amber-100 transition cursor-pointer"
                      >
                        + {snippet.slice(0, 10)}...
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveNotes(currentQ.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Cloud size={12} />
                      儲存筆記至雲端
                    </button>
                  </div>
                </div>

                {/* 3. 本分類進度看板 */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-600 dark:text-slate-300">
                    <span>當前分類檢核進度：</span>
                    <span>
                      {verifiedInCategory} / {totalInCategory} 題 (
                      {totalInCategory > 0
                        ? Math.round((verifiedInCategory / totalInCategory) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${
                          totalInCategory > 0
                            ? (verifiedInCategory / totalInCategory) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>待修正意見：{flaggedInCategory} 題</span>
                    <span>待審核剩餘：{totalInCategory - verifiedInCategory} 題</span>
                  </div>
                </div>

                {/* 4. 題目跳轉導覽抽屜 (圓點列表) */}
                <div className="space-y-1">
                  <span className="text-[11px] font-black text-slate-400 block uppercase">
                    題目索引跳轉：
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    {displayPool.map((q, idx) => {
                      const isCurrent = idx === currentIdx;
                      const isVerified = auditRecords[q.id]?.verified;
                      const hasNotes = auditRecords[q.id]?.notes?.trim();
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCurrentIdx(idx)}
                          className={`w-7 h-7 rounded-lg text-xs font-black transition flex items-center justify-center cursor-pointer ${
                            isCurrent
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-105'
                              : isVerified
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                              : hasNotes
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                          title={`#${idx + 1} (${q.id})`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 5. 底部導覽控制組 (上一題 / 下一題 / 儲存並前進) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  上一題 (←)
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>儲存並下一題</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  disabled={currentIdx >= displayPool.length - 1}
                  onClick={() => setCurrentIdx((i) => Math.min(displayPool.length - 1, i + 1))}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
                >
                  下一題 (→)
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 高解析考卷圖檔放大檢驗彈窗 (Image Inspector Modal) ── */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImageModal(null)}
        >
          <div
            className="max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between gap-3 border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white font-mono flex items-center gap-1.5">
                <ImageIcon size={16} className="text-indigo-600" />
                <span>試題插圖檢視: {previewImageModal.split('/').pop()}</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold"
              >
                關閉
              </button>
            </div>

            {/* 裁切指引提示條：免算 px，人話備註 */}
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-black flex items-center gap-1">
                <span>💡 裁切修正指南（老師無需計算像素 px）：</span>
              </div>
              <div className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                若圖檔有切到文字或選項，請直接在右側或下方點選常用字詞。所有意見會即刻同步至 Supabase 雲端，AI 將直接對照整頁 PDF 原卷自動重裁！
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl">
              <img
                src={previewImageModal}
                alt="高解析考卷裁切預覽"
                className="max-h-[60vh] w-auto object-contain border-2 border-dashed border-indigo-400 rounded-lg shadow-sm"
              />
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-2">
              <span>藍色虛線框為目前裁切邊界。</span>
              <a
                href={previewImageModal}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                <ExternalLink size={12} />
                另開原始圖檔分頁
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
