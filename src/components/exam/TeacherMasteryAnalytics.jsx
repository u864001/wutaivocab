import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  Search,
  Download,
  ChevronDown,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Filter,
  RotateCw,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Layers,
  ArrowRight,
  X
} from 'lucide-react';
import { PRE_A1_DASHBOARD_META } from './PreA1MasteryDashboard';
import { loadStudentMastery, getMasteryLevel, MASTERY_STATES } from '../../utils/masteryHelper';
import { supabase } from '../../services/supabase';
import { formatStudentBadge, formatStudentDisplayName, parseStudentId } from '../../utils/studentIdHelper';

const GRADE_TABS = [
  { id: 'all', label: '全校總覽' },
  { id: '01', label: '一年級' },
  { id: '02', label: '二年級' },
  { id: '03', label: '三年級' },
  { id: '04', label: '四年級' },
  { id: '05', label: '五年級' },
  { id: '06', label: '六年級' }
];

export const TeacherMasteryAnalytics = ({ onStartDrillForStudent }) => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all'); // 'all' | 'remedial' (<60) | 'basic' (60-79) | 'mastered' (80+)
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [studentRecords, setStudentRecords] = useState([]);
  const [inspectingStudent, setInspectingStudent] = useState(null);

  // 讀取全校/各年級學生資料與精熟快照
  const loadMasteryData = async () => {
    setIsLoading(true);
    const results = [];

    // 1. 讀取本機學生 Profile 與精熟數據 (離線護航)
    const localProfilesMap = new Map();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('wutai_student_profile_')) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const p = JSON.parse(raw);
              if (p?.student_id) {
                localProfilesMap.set(String(p.student_id), p);
              }
            } catch {}
          }
        }
      }
    } catch {}

    // 2. 從 Supabase 讀取雲端學生輪廓
    try {
      const { data: cloudProfiles } = await supabase
        .from('student_profiles')
        .select('student_id, grade, class, seat, nickname, coins, quest_points, updated_at');

      if (Array.isArray(cloudProfiles)) {
        cloudProfiles.forEach((cp) => {
          if (cp?.student_id) {
            localProfilesMap.set(String(cp.student_id), {
              ...localProfilesMap.get(String(cp.student_id)),
              ...cp
            });
          }
        });
      }
    } catch {}

    // 3. 從 Supabase 讀取雲端 Pre-A1 精熟排行榜數據 (mode = 'prea1-mastery')
    const cloudMasteryScores = new Map();
    try {
      const { data: lbRows } = await supabase
        .from('leaderboard')
        .select('name, book, score, time, created_at')
        .eq('mode', 'prea1-mastery');

      if (Array.isArray(lbRows)) {
        lbRows.forEach((r) => {
          if (r?.name) {
            cloudMasteryScores.set(r.name, {
              masteredCount: Number(r.score) || 0,
              masteryRate: Number(r.time) || 0,
              updatedAt: r.created_at
            });
          }
        });
      }
    } catch {}

    // 4. 合併所有學生紀錄
    for (const [sid, prof] of localProfilesMap.entries()) {
      const p = parseStudentId(sid);
      const studentGrade = prof.grade || p.grade || '04';

      // 讀取該學生的完整精熟快照（若本機有快照則解析五大面向與19子題型）
      const snap = loadStudentMastery(sid);
      const tmeTrack = snap?.tracks?.['tme-preA1'];
      const rawItems = tmeTrack?.items || {};

      // 若本機快照尚無，嘗試讀取雲端分數
      const cloudRecord = cloudMasteryScores.get(prof.nickname || prof.name);
      let masteredCount = tmeTrack?.mastered_count || (cloudRecord?.masteredCount || 0);
      let attemptedCount = tmeTrack?.attempted_count || (masteredCount > 0 ? masteredCount : 0);
      const totalBank = 250;
      let masteryRate = Math.round((masteredCount / totalBank) * 100);

      // 五大面向分項統計
      const categoryStats = {};
      PRE_A1_DASHBOARD_META.forEach((cat) => {
        let catMastered = 0;
        let catAttempted = 0;
        cat.subTypes.forEach((sub) => {
          const it = rawItems[sub.key] || Object.values(rawItems).find(q => q.subType === sub.key);
          if (it?.status === MASTERY_STATES.MASTERED) catMastered++;
          if (it) catAttempted++;
        });
        const catRate = Math.round((catMastered / cat.total) * 100);
        categoryStats[cat.category] = {
          mastered: catMastered,
          total: cat.total,
          rate: catRate,
          level: getMasteryLevel(catRate, catAttempted)
        };
      });

      const overallLevel = getMasteryLevel(masteryRate, attemptedCount);

      results.push({
        student_id: sid,
        grade: String(studentGrade).padStart(2, '0'),
        classNum: prof.class || p.classNum || '1',
        seat: prof.seat || p.seat || '1',
        displayName: formatStudentDisplayName(prof) || `座號 ${sid}`,
        badge: formatStudentBadge(prof),
        masteredCount,
        attemptedCount,
        totalBank,
        masteryRate,
        overallLevel,
        categoryStats,
        rawItems,
        updatedAt: prof.updated_at || snap?.updated_at || new Date().toISOString()
      });
    }

    // 依年級、班級、座號自然排序
    results.sort((a, b) => {
      if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
      if (a.classNum !== b.classNum) return a.classNum.localeCompare(b.classNum);
      return Number(a.seat) - Number(b.seat);
    });

    setStudentRecords(results);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMasteryData();
  }, []);

  // 篩選學生清單
  const filteredStudents = useMemo(() => {
    return studentRecords.filter((stu) => {
      if (selectedGrade !== 'all' && stu.grade !== selectedGrade) return false;
      if (filterLevel === 'mastered' && stu.masteryRate < 80) return false;
      if (filterLevel === 'basic' && (stu.masteryRate < 60 || stu.masteryRate >= 80)) return false;
      if (filterLevel === 'remedial' && stu.masteryRate >= 60) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = stu.displayName.toLowerCase().includes(q);
        const matchId = String(stu.student_id).includes(q);
        if (!matchName && !matchId) return false;
      }
      return true;
    });
  }, [studentRecords, selectedGrade, filterLevel, searchQuery]);

  // 全班/全年級總體分析統計 (KPI Dossier)
  const classSummary = useMemo(() => {
    const list = filteredStudents;
    const totalCount = list.length;
    if (totalCount === 0) {
      return {
        totalStudents: 0,
        avgMasteryRate: 0,
        passedRate: 0,
        weakestCategory: '尚無資料',
        weakestCategoryRate: 0,
        catAvgs: {}
      };
    }

    const sumRate = list.reduce((acc, cur) => acc + cur.masteryRate, 0);
    const avgMasteryRate = Math.round(sumRate / totalCount);

    // 達 Pre-A1 通過標準人數 (答對/精熟 ≥ 70%)
    const passedCount = list.filter((stu) => stu.masteryRate >= 70).length;
    const passedRate = Math.round((passedCount / totalCount) * 100);

    // 計算五大面向平均精熟率
    const catAvgs = {};
    let minCat = null;
    let minCatRate = 999;

    PRE_A1_DASHBOARD_META.forEach((cat) => {
      const catSum = list.reduce((acc, stu) => acc + (stu.categoryStats[cat.category]?.rate || 0), 0);
      const catAvg = Math.round(catSum / totalCount);
      catAvgs[cat.category] = catAvg;
      if (catAvg < minCatRate) {
        minCatRate = catAvg;
        minCat = cat.label;
      }
    });

    return {
      totalStudents: totalCount,
      avgMasteryRate,
      passedRate,
      weakestCategory: minCat || '無',
      weakestCategoryRate: minCatRate === 999 ? 0 : minCatRate,
      catAvgs
    };
  }, [filteredStudents]);

  // 匯出 CSV 試算表
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;
    try {
      const headers = ['年級', '座號', '學生姓名', 'Pre-A1精熟題數', '總題數', '精熟率(%)', '等第', '字彙(%)', '聽力(%)', '閱讀(%)', '寫作(%)', '口說(%)'];
      const rows = filteredStudents.map((stu) => [
        stu.grade,
        stu.seat,
        `"${stu.displayName}"`,
        stu.masteredCount,
        stu.totalBank,
        stu.masteryRate,
        stu.overallLevel.label,
        stu.categoryStats.vocab?.rate || 0,
        stu.categoryStats.listening?.rate || 0,
        stu.categoryStats.reading?.rate || 0,
        stu.categoryStats.writing?.rate || 0,
        stu.categoryStats.speaking?.rate || 0
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wutai_preA1_mastery_grade_${selectedGrade}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.warn('匯出 CSV 失敗:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* 頂部標題與數據摘要列 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Test My English Pre-A1 官方精熟評量分析</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 font-bold">
                全卷 250 題五大面向
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              動態滾動精熟體系（連對 2 次翻盤解鎖為完全精熟），支援全班/全年級熱力矩陣與個人 19 子題型診斷
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadMasteryData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>重新整理</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredStudents.length === 0}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download size={14} />
            <span>匯出班級 CSV</span>
          </button>
        </div>
      </div>

      {/* KPI 診斷四便當卡 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. 應試學生人數 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>應試學生數</span>
            <Users size={16} className="text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {classSummary.totalStudents} <span className="text-xs font-normal text-slate-400">位同學</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {selectedGrade === 'all' ? '全校 1~6 年級' : `${Number(selectedGrade)} 年級全班`}
          </div>
        </div>

        {/* 2. 全卷平均精熟率 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>全卷平均精熟率</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <span>{classSummary.avgMasteryRate}%</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              classSummary.avgMasteryRate >= 80
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : classSummary.avgMasteryRate >= 60
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {classSummary.avgMasteryRate >= 80 ? '★★★ 精熟' : classSummary.avgMasteryRate >= 60 ? '★★☆ 掌握' : '★☆☆ 加強'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            固定分母 250 題真實覆蓋率
          </div>
        </div>

        {/* 3. 達標合格率 (≥ 70%) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Pre-A1 官方合格率</span>
            <CheckCircle2 size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {classSummary.passedRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            達 21 題 / 70% 合格門檻比例
          </div>
        </div>

        {/* 4. 最弱面向預警 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
            <span>全班最脆弱面向</span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300 truncate">
            {classSummary.weakestCategory}
          </div>
          <div className="text-[11px] text-slate-400">
            平均僅 {classSummary.weakestCategoryRate}% · 建議安排重點補救
          </div>
        </div>
      </div>

      {/* 班級五大面向熱力長條列 */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 size={16} className="text-indigo-600" />
          <span>全班五大面向平均精熟熱力條 (Class Mastery Barometer)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
          {PRE_A1_DASHBOARD_META.map((cat) => {
            const Icon = cat.icon;
            const rate = classSummary.catAvgs[cat.category] || 0;
            return (
              <div
                key={cat.category}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Icon size={14} className={`text-${cat.color}-500`} />
                    <span className="truncate">{cat.label.split(' ')[0]}</span>
                  </div>
                  <span className="font-mono font-black text-slate-900 dark:text-white">{rate}%</span>
                </div>
                {/* 進度條 */}
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      rate >= 80 ? 'bg-emerald-500' : rate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, rate)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  全卷 {cat.total} 題
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 篩選與搜尋工具列 */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* 年級選擇膠囊 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {GRADE_TABS.map((tab) => {
            const active = selectedGrade === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedGrade(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                  active
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 等第過濾與姓名搜尋 */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="all">全部精熟等第</option>
            <option value="mastered">★★★ 精熟 (≥80%)</option>
            <option value="basic">★★☆ 基礎 (60-79%)</option>
            <option value="remedial">★☆☆ 待加強 (&lt;60%)</option>
          </select>

          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋學生座號或姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none w-44 sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* 學生精熟熱力矩陣表格 */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">年級/座號</th>
                <th className="py-3 px-4">學生姓名</th>
                <th className="py-3 px-4 text-center">總精熟題數</th>
                <th className="py-3 px-4 text-center">精熟百分比</th>
                <th className="py-3 px-4 text-center">字彙 (50)</th>
                <th className="py-3 px-4 text-center">聽力 (44)</th>
                <th className="py-3 px-4 text-center">閱讀 (80)</th>
                <th className="py-3 px-4 text-center">寫作 (60)</th>
                <th className="py-3 px-4 text-center">口說 (16)</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <span>尚無符合條件的學生作答紀錄</span>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const level = stu.overallLevel;
                  return (
                    <tr
                      key={stu.student_id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {stu.grade} 年 {stu.classNum} 班 {stu.seat} 號
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{stu.displayName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {stu.masteredCount} / {stu.totalBank}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${level.bgClass} ${level.textClass}`}>
                          <span>{stu.masteryRate}%</span>
                          <span className="text-[10px]">{level.badge}</span>
                        </span>
                      </td>

                      {/* 5 大面向小膠囊 */}
                      {['vocab', 'listening', 'reading', 'writing', 'speaking'].map((catKey) => {
                        const st = stu.categoryStats[catKey];
                        const r = st?.rate || 0;
                        const bgBadge =
                          r >= 80
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : r >= 60
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                        return (
                          <td key={catKey} className="py-3 px-4 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${bgBadge}`}>
                              {r}%
                            </span>
                          </td>
                        );
                      })}

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectingStudent(stu)}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>19子項診斷</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 個人 19 子題型完整履歷彈窗 (Modal Inspector) ── */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
            {/* Modal 頂部標題 */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner font-black">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                    <span>{inspectingStudent.displayName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold">
                      {inspectingStudent.grade} 年 {inspectingStudent.seat} 號
                    </span>
                  </h3>
                  <div className="text-xs text-sky-100 mt-0.5">
                    Pre-A1 全卷 250 題 · 19 子題型動態滾動精熟履歷
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal 內容（可捲動） */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* 整體表現速覽 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500">總體精熟度</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                    {inspectingStudent.masteredCount} / {inspectingStudent.totalBank} 題 ({inspectingStudent.masteryRate}%)
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${inspectingStudent.overallLevel.bgClass} ${inspectingStudent.overallLevel.textClass}`}>
                  {inspectingStudent.overallLevel.label} {inspectingStudent.overallLevel.badge}
                </span>
              </div>

              {/* 19 子題型分項清單 */}
              <div className="space-y-4">
                {PRE_A1_DASHBOARD_META.map((cat) => {
                  const Icon = cat.icon;
                  const catStat = inspectingStudent.categoryStats[cat.category];
                  return (
                    <div
                      key={cat.category}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5"
                    >
                      <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                        <div className="flex items-center gap-2 font-black text-sm text-slate-900 dark:text-white">
                          <Icon size={16} className={`text-${cat.color}-500`} />
                          <span>{cat.label}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                          精熟率 {catStat?.rate || 0}% ({catStat?.mastered || 0} / {cat.total} 題)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.subTypes.map((sub) => {
                          const it = inspectingStudent.rawItems[sub.key] || Object.values(inspectingStudent.rawItems).find(q => q.subType === sub.key);
                          const isMastered = it?.status === MASTERY_STATES.MASTERED;
                          const isProbation = it?.status === MASTERY_STATES.PROBATION;
                          const isRemedial = it?.status === MASTERY_STATES.REMEDIAL;

                          return (
                            <div
                              key={sub.key}
                              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                            >
                              <div className="min-w-0 pr-2">
                                <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {sub.label}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {sub.desc}
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                {isMastered ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    🟢 精熟
                                  </span>
                                ) : isProbation ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                    🟡 考驗中 (再對1次解鎖)
                                  </span>
                                ) : isRemedial ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                    🔴 待加強
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    ⚪ 未挑戰
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal 底部按鈕 */}
            <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                關閉診斷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
