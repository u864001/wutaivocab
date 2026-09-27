import { createClient } from '@supabase/supabase-js';

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

// ── 裝置專屬 UUID 生成與獲取 (防止同名學生覆蓋成績) ──
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

// ── 載入所有單字 ──
export const fetchWordsFromDb = async () => {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('is_active', true)
      .order('book', { ascending: true })
      .order('lesson', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase 題庫讀取回退至備用題庫:', error?.message);
      return FALLBACK_WORDS;
    }
    return data;
  } catch (err) {
    console.warn('題庫連線異常，啟用備用題庫:', err);
    return FALLBACK_WORDS;
  }
};

// ── 批次新增單字 (教師專區) ──
export const insertWordsBatch = async (wordsList) => {
  const { data, error } = await supabase.from('words').insert(wordsList).select();
  if (error) throw error;
  return data;
};

// ── 刪除單字 ──
export const deleteWordById = async (id) => {
  const { error } = await supabase.from('words').delete().eq('id', id);
  if (error) throw error;
};

// ── 上傳遊戲成績 (Upsert 最佳紀錄) ──
export const uploadScore = async ({ mode, book, name, score, time }) => {
  const deviceId = getDeviceId();
  const currentWeek = getWeekNumber();

  try {
    // 檢查本週同裝置、同模式、同冊別是否已有紀錄
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('id, score, time')
      .eq('device_id', deviceId)
      .eq('week', currentWeek)
      .eq('mode', mode)
      .eq('book', String(book))
      .maybeSingle();

    if (existing) {
      const isBetter = score > existing.score || (score === existing.score && time < existing.time);
      if (isBetter) {
        await supabase
          .from('leaderboard')
          .update({ name: name.trim(), score, time, created_at: new Date().toISOString() })
          .eq('id', existing.id);
      }
    } else {
      await supabase.from('leaderboard').insert([{
        device_id: deviceId,
        name: name.trim(),
        mode,
        book: String(book),
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
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('score, time')
      .eq('week', currentWeek)
      .eq('mode', mode)
      .eq('book', String(book))
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

// ── 連線對戰勝場紀錄 (累計該 iPad 本週勝場，並更新為最新暱稱) ──
export const recordBattleWin = async ({ book, name }) => {
  const deviceId = getDeviceId();
  const currentWeek = getWeekNumber();
  const mode = 'battle-wins';

  try {
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('id, score')
      .eq('device_id', deviceId)
      .eq('week', currentWeek)
      .eq('mode', mode)
      .eq('book', String(book))
      .maybeSingle();

    if (existing) {
      await supabase
        .from('leaderboard')
        .update({
          name: name.trim(),
          score: (existing.score || 0) + 1,
          created_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('leaderboard')
        .insert([{
          device_id: deviceId,
          name: name.trim(),
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

// ── 讀取排行榜 (支援至前 50 名) ──
export const fetchLeaderboard = async (week, mode, book, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('id, name, score, time, created_at')
      .eq('week', week)
      .eq('mode', mode)
      .eq('book', String(book))
      .order('score', { ascending: false })
      .order('time', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('排行榜讀取失敗:', err);
    return [];
  }
};
