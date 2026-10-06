import { createClient } from '@supabase/supabase-js';
import { containsProfanity } from './profanityFilter';
import { getCurrentSemesterId, checkAndApplySemesterReset } from '../utils/semesterHelper';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fqkdkmcqjswufzbvkram.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_M9phUn6LH1yeVA9NbIXesg_tVABCW5z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── 本機離線備用題庫 (確保護航：斷網或資料庫初始化前仍能暢玩) ──
export const FALLBACK_WORDS = [
  // 第 1 冊
  { id: 'f-1', author: 'Official', book: '1', lesson: '1', en: 'apple', zh: '蘋果' },
  { id: 'f-2', author: 'Official', book: '1', lesson: '1', en: 'banana', zh: '香蕉' },
  { id: 'f-3', author: 'Official', book: '1', lesson: '1', en: 'cat', zh: '貓' },
  { id: 'f-4', author: 'Official', book: '1', lesson: '1', en: 'dog', zh: '狗' },
  { id: 'f-5', author: 'Official', book: '1', lesson: '2', en: 'elephant', zh: '大象' },
  { id: 'f-6', author: 'Official', book: '1', lesson: '2', en: 'fish', zh: '魚' },
  { id: 'f-7', author: 'Official', book: '1', lesson: '2', en: 'grape', zh: '葡萄' },
  { id: 'f-8', author: 'Official', book: '1', lesson: '2', en: 'hat', zh: '帽子' },
  // 第 2 冊
  { id: 'f-9', author: 'Official', book: '2', lesson: '1', en: 'ruler', zh: '尺' },
  { id: 'f-10', author: 'Official', book: '2', lesson: '1', en: 'pencil', zh: '鉛筆' },
  { id: 'f-11', author: 'Official', book: '2', lesson: '1', en: 'eraser', zh: '橡皮擦' },
  { id: 'f-12', author: 'Official', book: '2', lesson: '1', en: 'book', zh: '書本' },
  { id: 'f-13', author: 'Official', book: '2', lesson: '2', en: 'red', zh: '紅色' },
  { id: 'f-14', author: 'Official', book: '2', lesson: '2', en: 'blue', zh: '藍色' },
  { id: 'f-15', author: 'Official', book: '2', lesson: '2', en: 'yellow', zh: '黃色' },
  { id: 'f-16', author: 'Official', book: '2', lesson: '2', en: 'green', zh: '綠色' },
  // Mario 老師專區
  { id: 'f-m1', author: 'Mario', book: 'Mario專區', lesson: 'Unit 1 食物與甜點', en: 'pizza', zh: '披薩' },
  { id: 'f-m2', author: 'Mario', book: 'Mario專區', lesson: 'Unit 1 食物與甜點', en: 'hamburger', zh: '漢堡' },
  { id: 'f-m3', author: 'Mario', book: 'Mario專區', lesson: 'Unit 1 食物與甜點', en: 'ice cream', zh: '冰淇淋' },
  { id: 'f-m4', author: 'Mario', book: 'Mario專區', lesson: 'Unit 1 食物與甜點', en: 'sandwich', zh: '三明治' },
  // Ibu 老師專區
  { id: 'f-i1', author: 'Ibu', book: 'Ibu專區', lesson: 'Unit 1 自然與動物', en: 'mountain', zh: '山' },
  { id: 'f-i2', author: 'Ibu', book: 'Ibu專區', lesson: 'Unit 1 自然與動物', en: 'river', zh: '河流' },
  { id: 'f-i3', author: 'Ibu', book: 'Ibu專區', lesson: 'Unit 1 自然與動物', en: 'butterfly', zh: '蝴蝶' },
  { id: 'f-i4', author: 'Ibu', book: 'Ibu專區', lesson: 'Unit 1 自然與動物', en: 'flower', zh: '花朵' },
  // Vanessa 老師專區
  { id: 'f-v1', author: 'Vanessa', book: 'Vanessa專區', lesson: 'Unit 1 學校生活', en: 'classroom', zh: '教室' },
  { id: 'f-v2', author: 'Vanessa', book: 'Vanessa專區', lesson: 'Unit 1 學校生活', en: 'teacher', zh: '老師' },
  { id: 'f-v3', author: 'Vanessa', book: 'Vanessa專區', lesson: 'Unit 1 學校生活', en: 'student', zh: '學生' },
  { id: 'f-v4', author: 'Vanessa', book: 'Vanessa專區', lesson: 'Unit 1 學校生活', en: 'library', zh: '圖書館' },
  // Mark 老師專區
  { id: 'f-k1', author: 'Mark', book: 'Mark專區', lesson: 'Unit 1 運動休閒', en: 'basketball', zh: '籃球' },
  { id: 'f-k2', author: 'Mark', book: 'Mark專區', lesson: 'Unit 1 運動休閒', en: 'soccer', zh: '足球' },
  { id: 'f-k3', author: 'Mark', book: 'Mark專區', lesson: 'Unit 1 運動休閒', en: 'swimming', zh: '游泳' },
  { id: 'f-k4', author: 'Mark', book: 'Mark專區', lesson: 'Unit 1 運動休閒', en: 'running', zh: '跑步' }
];

// ── 裝置專屬 UUID 生成與獲取 ──
export const getDeviceId = () => {
  const KEY = 'wutai_device_id_v2';
  let deviceId = localStorage.getItem(KEY);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(KEY, deviceId);
  }
  return deviceId;
};

// ── 取得當前年第幾週 (ISO Week) ──
export const getWeekNumber = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// ── 題庫快取機制 (輕量中繼探針：自動偵測題庫更新，杜絕跨裝置快取滯後) ──
const WORDS_CACHE_KEY = 'wutai_words_cache_v3';
const WORDS_CACHE_TIME_KEY = 'wutai_words_cache_time_v3';
const WORDS_CACHE_META_KEY = 'wutai_words_meta_v3';
const WORDS_CACHE_TTL = 30 * 60 * 1000; // 30 分鐘整體 TTL
const REMOTE_PROBE_INTERVAL = 60 * 1000; // 每 60 秒透過極輕量 HEAD 查詢探測遠端是否有異動

export const invalidateWordsCache = () => {
  try {
    localStorage.removeItem(WORDS_CACHE_KEY);
    localStorage.removeItem(WORDS_CACHE_TIME_KEY);
    localStorage.removeItem(WORDS_CACHE_META_KEY);
  } catch (e) {}
};

// ── 載入所有單字 (含跨裝置即時同步探針) ──
export const fetchWordsFromDb = async (force = false) => {
  try {
    const cached = localStorage.getItem(WORDS_CACHE_KEY);
    const cachedTime = localStorage.getItem(WORDS_CACHE_TIME_KEY);
    const cachedMeta = localStorage.getItem(WORDS_CACHE_META_KEY);

    if (!force && cached && cachedTime) {
      const timeElapsed = Date.now() - parseInt(cachedTime, 10);

      // 若在探測週期內 (小於 60 秒)，直接返回本機快取以節省頻寬
      if (timeElapsed < REMOTE_PROBE_INTERVAL) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      } else if (timeElapsed < WORDS_CACHE_TTL) {
        // 已過 60 秒：發起極輕量探針 (只查 count 與最新 created_at，不載入表格內容，消耗 <100 bytes)
        try {
          const [{ count }, { data: latestRow }] = await Promise.all([
            supabase.from('words').select('id', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('words').select('created_at').order('created_at', { ascending: false }).limit(1)
          ]);

          const remoteVersion = `${count || 0}_${latestRow?.[0]?.created_at || ''}`;
          if (cachedMeta === remoteVersion) {
            // 遠端資料完全未變更！刷新探測時間戳並繼續使用快取
            localStorage.setItem(WORDS_CACHE_TIME_KEY, Date.now().toString());
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          }
          // 若 remoteVersion 不同，說明老師在後台新增或異動了單字，自動穿透快取重新抓取！
        } catch (probeErr) {
          // 網路探測異常時，平滑使用既有快取護航
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          } catch (e) {}
        }
      }
    }

    // 重新自 Supabase 取得完整題庫
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('is_active', true)
      .order('book', { ascending: true })
      .order('lesson', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase 題庫讀取回退至備用題庫:', error?.message);
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
      return FALLBACK_WORDS;
    }

    // 成功取得資料，寫入本機快取與最新版本號
    try {
      const latestTime = data.reduce((max, w) => (w.created_at > max ? w.created_at : max), '');
      const metaVersion = `${data.length}_${latestTime}`;
      localStorage.setItem(WORDS_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(WORDS_CACHE_TIME_KEY, Date.now().toString());
      localStorage.setItem(WORDS_CACHE_META_KEY, metaVersion);
    } catch (e) {}

    return data;
  } catch (err) {
    console.warn('題庫連線異常，啟用備用題庫:', err);
    const cached = localStorage.getItem(WORDS_CACHE_KEY);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return FALLBACK_WORDS;
  }
};

// ── 批次新增單字 (教師專區) ──
export const insertWordsBatch = async (wordsList) => {
  const { data, error } = await supabase.from('words').insert(wordsList).select();
  if (error) throw error;
  invalidateWordsCache(); // 清除本機快取
  return data;
};

// ── 刪除單字 ──
export const deleteWordById = async (id) => {
  const { error } = await supabase.from('words').delete().eq('id', id);
  if (error) throw error;
  invalidateWordsCache(); // 清除本機快取
};

// ── 上傳遊戲成績 (共用 iPad 防覆蓋：以 device_id + name 雙鍵隔離不同學生) ──
export const uploadScore = async ({ mode, book, name, score, time }) => {
  const deviceId = getDeviceId();
  const currentWeek = getWeekNumber();
  let cleanName = (name || '').trim();
  if (!cleanName) return false;

  // 拒絕不雅名稱寫入資料庫
  if (containsProfanity(cleanName)) {
    cleanName = '文明好學生';
  }

  const actualBook = (book && book !== 'null' && book !== 'undefined') ? String(book) : 'abc';

  try {
    // 檢查本週同裝置且同姓名的紀錄 (同台 iPad 不同學生戰績完全獨立)
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('id, score, time')
      .eq('device_id', deviceId)
      .eq('name', cleanName)
      .eq('week', currentWeek)
      .eq('mode', mode)
      .eq('book', actualBook)
      .maybeSingle();

    if (existing) {
      const isBetter = score > existing.score || (score === existing.score && time < existing.time);
      if (isBetter) {
        await supabase
          .from('leaderboard')
          .update({ score, time, created_at: new Date().toISOString() })
          .eq('id', existing.id);
      }
    } else {
      await supabase.from('leaderboard').insert([{
        device_id: deviceId,
        name: cleanName,
        mode,
        book: actualBook,
        score,
        time,
        week: currentWeek
      }]);
    }
    return true;
  } catch (err) {
    console.error('成績上傳失敗:', err);
    return false;
  }
};

// ── 檢查是否達到進入前 50 名的門檻 ──
export const checkIfQualifiesForTop50 = async ({ mode, book, score, time }) => {
  if (!score || score <= 0) return false;
  const currentWeek = getWeekNumber();
  const actualBook = (book && book !== 'null' && book !== 'undefined') ? String(book) : 'abc';

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('score, time')
      .eq('week', currentWeek)
      .eq('mode', mode)
      .eq('book', actualBook)
      .order('score', { ascending: false })
      .order('time', { ascending: true })
      .limit(50);

    if (error) return true; // 若連線異常，直接允許留名鼓勵學生
    if (!data || data.length < 50) return true; // 未滿 50 人，任何正分皆可上榜！

    // 已滿 50 人：分數必須超越第 50 名，或同分但時間更短
    const last50th = data[data.length - 1];
    return score > last50th.score || (score === last50th.score && time < last50th.time);
  } catch (e) {
    return true;
  }
};

// ── 連線對戰勝場紀錄 (共用 iPad 身分隔離：以 device_id + name 獨立累加，不繼承他人勝場) ──
export const recordBattleWin = async ({ book, name }) => {
  const deviceId = getDeviceId();
  const currentWeek = getWeekNumber();
  const mode = 'battle-wins';
  let cleanName = (name || '').trim();
  if (!cleanName) return false;

  if (containsProfanity(cleanName)) {
    cleanName = '文明好學生';
  }

  try {
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('id, score')
      .eq('device_id', deviceId)
      .eq('name', cleanName)
      .eq('week', currentWeek)
      .eq('mode', mode)
      .eq('book', String(book))
      .maybeSingle();

    if (existing) {
      await supabase
        .from('leaderboard')
        .update({
          score: (existing.score || 0) + 1,
          created_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('leaderboard')
        .insert([{
          device_id: deviceId,
          name: cleanName,
          mode,
          book: String(book),
          score: 1,
          time: 0,
          week: currentWeek
        }]);
    }
    return true;
  } catch (err) {
    console.error('連線勝場紀錄失敗:', err);
    return false;
  }
};

// ── 讀取排行榜 (支援單冊/多冊與單模式/多模式合併，每位同學取最高成績) ──
export const fetchLeaderboard = async (week, mode, bookOrBooks, limit = 50) => {
  try {
    let query = supabase
      .from('leaderboard')
      .select('id, name, score, time, mode, book, created_at')
      .eq('week', week);

    if (Array.isArray(mode)) {
      query = query.in('mode', mode);
    } else if (mode && mode !== 'all') {
      query = query.eq('mode', mode);
    }

    if (Array.isArray(bookOrBooks)) {
      query = query.in('book', bookOrBooks.map(String));
    } else if (bookOrBooks && bookOrBooks !== 'all') {
      query = query.eq('book', String(bookOrBooks));
    }

    const { data, error } = await query
      .order('score', { ascending: false })
      .order('time', { ascending: true })
      .limit(limit * 2); // 取稍多以利學生最佳紀錄去重

    if (error) throw error;
    if (!data || data.length === 0) return [];

    // 每位學生僅保留其最佳單筆成績
    const seenNames = new Set();
    const uniqueList = [];
    for (const entry of data) {
      const cleanName = (entry.name || '').trim();
      if (!seenNames.has(cleanName)) {
        seenNames.add(cleanName);
        uniqueList.push(entry);
      }
      if (uniqueList.length >= limit) break;
    }

    return uniqueList;
  } catch (err) {
    console.error('排行榜讀取失敗:', err);
    return [];
  }
};

// ============================================================
// ── 最高系統管理者 (Super Admin) 專屬服務函式 ──
// ============================================================

/**
 * 管理者查詢歷史成績列表 (支援多維度篩選)
 */
export const adminFetchLeaderboard = async ({ week, mode, limit = 100 } = {}) => {
  try {
    let query = supabase.from('leaderboard').select('*');
    if (week !== undefined && week !== 'all') {
      query = query.eq('week', parseInt(week, 10));
    }
    if (mode && mode !== 'all') {
      query = query.eq('mode', mode);
    }
    query = query.order('created_at', { ascending: false }).limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('後台讀取成績失敗:', err);
    return [];
  }
};

/**
 * 管理者個別刪除指定成績
 */
export const adminDeleteLeaderboardEntry = async (id) => {
  const { error } = await supabase.from('leaderboard').delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * 管理者一鍵清理異常成績 (分數極端破表者)
 */
export const adminClearAbnormalScores = async () => {
  try {
    const { error } = await supabase
      .from('leaderboard')
      .delete()
      .or('score.gt.100000,score.lt.0');
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('清理異常分數失敗:', err);
    throw err;
  }
};

/**
 * 管理者清空指定週次成績
 */
export const adminResetWeekScores = async (week) => {
  const { error } = await supabase
    .from('leaderboard')
    .delete()
    .eq('week', parseInt(week, 10));
  if (error) throw error;
  return true;
};

/**
 * 管理者取得全系統即時診斷資訊 (Latency, 筆數, 容量佔比)
 */
export const adminGetSystemStats = async () => {
  const tStart = performance.now();
  try {
    const [wordsRes, leaderboardRes] = await Promise.all([
      supabase.from('words').select('id', { count: 'exact', head: true }),
      supabase.from('leaderboard').select('id', { count: 'exact', head: true })
    ]);
    const latency = Math.round(performance.now() - tStart);
    const wordsCount = wordsRes.count || 0;
    const leaderboardCount = leaderboardRes.count || 0;
    // 預估 Postgres 資料庫空間 (單字~200B + 排行榜~150B + 基礎系統表約 1.5MB)
    const estimatedBytes = (wordsCount * 200) + (leaderboardCount * 150) + 1500000;
    const estimatedMB = (estimatedBytes / (1024 * 1024)).toFixed(2);
    return {
      isOnline: true,
      latencyMs: latency,
      wordsCount,
      leaderboardCount,
      estimatedMB,
      quotaPercent: ((parseFloat(estimatedMB) / 500) * 100).toFixed(2)
    };
  } catch (err) {
    return {
      isOnline: false,
      latencyMs: -1,
      wordsCount: 0,
      leaderboardCount: 0,
      estimatedMB: '0.00',
      quotaPercent: '0.00'
    };
  }
};

// ============================================================
// ── 學生 6 碼雲端漫遊身分 (Student Roaming Profiles) ──
// ============================================================

export const STUDENT_PROFILES_TABLE_SQL = `
-- 霧臺英語宇宙 2.0: 學生身分與漫遊資料表
create table if not exists student_profiles (
  student_id text primary key, -- e.g. '040209'
  grade text not null,
  class text not null,
  seat text not null,
  nickname text not null,
  coins integer default 0,
  quest_points integer default 0,
  semester_id text default '115-1',
  semester_history jsonb default '[]'::jsonb,
  inventory jsonb default '[]'::jsonb,
  daily_quest jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 啟用 RLS 與開放讀寫策略 (供全校學童免登入直接暢玩)
alter table student_profiles enable row level security;
create policy "Allow all read on student_profiles" on student_profiles for select using (true);
create policy "Allow all insert on student_profiles" on student_profiles for insert with check (true);
create policy "Allow all update on student_profiles" on student_profiles for update using (true);
`;

const getLocalStudentProfile = (studentId) => {
  try {
    const raw = localStorage.getItem(`wutai_student_profile_${studentId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const checked = checkAndApplySemesterReset(parsed);
    if (checked?.has_just_reset_semester) {
      setLocalStudentProfile(studentId, checked);
    }
    return checked;
  } catch (e) {
    return null;
  }
};

const setLocalStudentProfile = (studentId, profile) => {
  try {
    localStorage.setItem(`wutai_student_profile_${studentId}`, JSON.stringify(profile));
  } catch (e) {}
};

/**
 * 讀取學生雲端漫遊檔案 (含本機快取與無損離線回退)
 */
export const fetchStudentProfile = async (studentId) => {
  if (!studentId) return null;
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) {
      // 若資料表尚未於 Supabase 建立或網路中斷，平滑回退本機快取
      console.warn('雲端讀取學生檔案提示 (回退本機快取):', error.message);
      return getLocalStudentProfile(studentId);
    }

    if (data) {
      // 成功讀取遠端檔案，同步檢查學期換日並更新本機快取
      const rawNormalized = {
        student_id: data.student_id,
        grade: data.grade,
        class: data.class,
        seat: data.seat,
        nickname: data.nickname,
        coins: Number(data.coins) || 0,
        quest_points: Number(data.quest_points) || 0,
        semester_id: data.semester_id || null,
        semester_history: Array.isArray(data.semester_history) ? data.semester_history : [],
        inventory: Array.isArray(data.inventory) ? data.inventory : [],
        daily_quest: (typeof data.daily_quest === 'object' && data.daily_quest) ? data.daily_quest : {},
        updated_at: data.updated_at
      };
      const normalized = checkAndApplySemesterReset(rawNormalized);
      setLocalStudentProfile(studentId, normalized);
      if (normalized?.has_just_reset_semester) {
        upsertStudentProfile(normalized).catch(() => {});
      }
      return normalized;
    }

    // 遠端尚無紀錄，查看本機是否有快取
    return getLocalStudentProfile(studentId);
  } catch (err) {
    console.warn('讀取學生檔案連線異常，回退本機快取:', err);
    return getLocalStudentProfile(studentId);
  }
};

/**
 * 建立或更新學生雲端檔案 (Upsert)
 */
export const upsertStudentProfile = async (profileData) => {
  if (!profileData?.student_id) return null;

  const currentSem = getCurrentSemesterId();
  const sanitized = {
    student_id: String(profileData.student_id),
    grade: String(profileData.grade || '00'),
    class: String(profileData.class || profileData.classNum || '00'),
    seat: String(profileData.seat || '00'),
    nickname: String(profileData.nickname || '好學生').trim(),
    coins: Math.max(0, Number(profileData.coins) || 0),
    quest_points: Math.max(0, Number(profileData.quest_points) || 0),
    semester_id: String(profileData.semester_id || currentSem),
    semester_history: Array.isArray(profileData.semester_history) ? profileData.semester_history : [],
    inventory: Array.isArray(profileData.inventory) ? profileData.inventory : [],
    daily_quest: (typeof profileData.daily_quest === 'object' && profileData.daily_quest) ? profileData.daily_quest : {},
    updated_at: new Date().toISOString()
  };

  // 1. 立即寫入本機快取保證即時響應
  setLocalStudentProfile(sanitized.student_id, sanitized);

  // 2. 嘗試非同步同步至 Supabase
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .upsert(sanitized, { onConflict: 'student_id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase upsert 學生檔案提示 (資料已安全暫存本機):', error.message);
      return sanitized;
    }
    return data || sanitized;
  } catch (err) {
    console.warn('學生檔案雲端同步暫緩，本機安全保留:', err);
    return sanitized;
  }
};

/**
 * 安全增減金幣 (支援正負數，最低不小於 0)
 */
export const updateStudentCoins = async (studentId, deltaCoins) => {
  if (!studentId || typeof deltaCoins !== 'number') return null;

  const current = (await fetchStudentProfile(studentId)) || {
    student_id: studentId,
    grade: studentId.substring(0, 2),
    class: studentId.substring(2, 4),
    seat: studentId.substring(4, 6),
    nickname: '好學生',
    coins: 0,
    quest_points: 0,
    inventory: [],
    daily_quest: {}
  };

  const newCoins = Math.max(0, (current.coins || 0) + deltaCoins);
  const updated = {
    ...current,
    coins: newCoins,
    updated_at: new Date().toISOString()
  };

  return await upsertStudentProfile(updated);
};

/**
 * 累加探索積分
 */
export const updateStudentQuestPoints = async (studentId, deltaPoints) => {
  if (!studentId || typeof deltaPoints !== 'number') return null;

  const current = (await fetchStudentProfile(studentId)) || {
    student_id: studentId,
    grade: studentId.substring(0, 2),
    class: studentId.substring(2, 4),
    seat: studentId.substring(4, 6),
    nickname: '好學生',
    coins: 0,
    quest_points: 0,
    inventory: [],
    daily_quest: {}
  };

  const newPoints = Math.max(0, (current.quest_points || 0) + deltaPoints);
  const updated = {
    ...current,
    quest_points: newPoints,
    updated_at: new Date().toISOString()
  };

  return await upsertStudentProfile(updated);
};

/**
 * 更新學生背包物品庫 (Inventory)
 */
export const updateStudentInventory = async (studentId, newInventory) => {
  if (!studentId || !Array.isArray(newInventory)) return null;

  const current = (await fetchStudentProfile(studentId)) || {
    student_id: studentId,
    grade: studentId.substring(0, 2),
    class: studentId.substring(2, 4),
    seat: studentId.substring(4, 6),
    nickname: '好學生',
    coins: 0,
    quest_points: 0,
    inventory: [],
    daily_quest: {}
  };

  const updated = {
    ...current,
    inventory: newInventory,
    updated_at: new Date().toISOString()
  };

  return await upsertStudentProfile(updated);
};

/**
 * 更新每日任務狀態 (Daily Quest)
 */
export const updateStudentDailyQuest = async (studentId, dailyQuestData) => {
  if (!studentId || typeof dailyQuestData !== 'object') return null;

  const current = (await fetchStudentProfile(studentId)) || {
    student_id: studentId,
    grade: studentId.substring(0, 2),
    class: studentId.substring(2, 4),
    seat: studentId.substring(4, 6),
    nickname: '好學生',
    coins: 0,
    quest_points: 0,
    inventory: [],
    daily_quest: {}
  };

  const updated = {
    ...current,
    daily_quest: dailyQuestData,
    updated_at: new Date().toISOString()
  };

  return await upsertStudentProfile(updated);
};

const getLocalLeaderboardProfiles = (metric = 'coins', grade = null, limit = 50) => {
  try {
    const profiles = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wutai_student_profile_')) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const raw = JSON.parse(item);
            if (raw && raw.student_id) {
              const parsed = checkAndApplySemesterReset(raw);
              if (!grade || grade === '00' || grade === 'all' || parsed.grade === String(grade).padStart(2, '0')) {
                profiles.push(parsed);
              }
            }
          } catch (e) {}
        }
      }
    }
    profiles.sort((a, b) => (Number(b[metric] || 0) - Number(a[metric] || 0)));
    return profiles.slice(0, limit);
  } catch (e) {
    return [];
  }
};

/**
 * 讀取大富翁財富榜 (Monopoly Wealth Board: 依金幣降序，可選年級)
 */
export const fetchMonopolyLeaderboard = async (grade = null, limit = 50) => {
  try {
    let query = supabase
      .from('student_profiles')
      .select('student_id, grade, class, seat, nickname, coins, updated_at');

    if (grade && grade !== '00' && grade !== 'all') {
      query = query.eq('grade', String(grade).padStart(2, '0'));
    }

    const { data, error } = await query
      .order('coins', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return getLocalLeaderboardProfiles('coins', grade, limit);
    }
    return data;
  } catch (err) {
    return getLocalLeaderboardProfiles('coins', grade, limit);
  }
};

/**
 * 讀取小鎮探索榮譽榜 (Town Quest Points Board: 依積分降序，可選年級)
 */
export const fetchQuestPointsLeaderboard = async (grade = null, limit = 50) => {
  try {
    let query = supabase
      .from('student_profiles')
      .select('student_id, grade, class, seat, nickname, quest_points, updated_at');

    if (grade && grade !== '00' && grade !== 'all') {
      query = query.eq('grade', String(grade).padStart(2, '0'));
    }

    const { data, error } = await query
      .order('quest_points', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return getLocalLeaderboardProfiles('quest_points', grade, limit);
    }
    return data;
  } catch (err) {
    return getLocalLeaderboardProfiles('quest_points', grade, limit);
  }
};


