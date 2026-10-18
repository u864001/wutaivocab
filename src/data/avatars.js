/**
 * 霧臺神山探險者 2.5D 頭像立繪與石板神槽外框資料庫
 * 保證 100% 畫風一致，徹底杜絕外貼飾品的「貼紙感」
 */

export const AVATAR_LIST = [
  {
    id: 'boy_scout',
    name: '見習巡山少年',
    title: '大武山巡山者',
    gender: 'boy',
    image: '/assets/avatars/boy_scout.webp',
    desc: '活潑開朗的巡山小勇士，頭戴傳統編織頭帶，對山林充滿無比熱情。',
    price: 0
  },
  {
    id: 'girl_lily',
    name: '百合聖花少女',
    title: '聖花守護使者',
    gender: 'girl',
    image: '/assets/avatars/girl_lily.webp',
    desc: '髮梢別著潔白盛開的霧臺高山百合，神態溫柔堅毅，象徵純潔與勇氣。',
    price: 0
  },
  {
    id: 'boy_hunter',
    name: '神山百步蛇獵人',
    title: '百步蛇傳承者',
    gender: 'boy',
    image: '/assets/avatars/boy_hunter.webp',
    desc: '目光深邃英勇，佩戴雄鷹羽飾，誓言守護部落聖石與山林生靈。',
    price: 0
  },
  {
    id: 'girl_falcon',
    name: '穿雲獵鷹少女',
    title: '天空疾速箭手',
    gender: 'girl',
    image: '/assets/avatars/girl_falcon.webp',
    desc: '靈動俐落的高馬尾與敏銳雙眸，以疾速如風的敏捷身手馳騁山林。',
    price: 0
  },
  {
    id: 'boy_scholar',
    name: '石板古卷智者',
    title: '神山秘卷學者',
    gender: 'boy',
    image: '/assets/avatars/boy_scholar.webp',
    desc: '專注鑽研古老石板刻文與自然奧秘，博學多聞的探險隊智囊。',
    price: 0
  },
  {
    id: 'girl_healer',
    name: '山林草藥使者',
    title: '甘霖翡翠醫者',
    gender: 'girl',
    image: '/assets/avatars/girl_healer.webp',
    desc: '佩戴幸運蕨類葉飾，親切溫暖的笑容總能安撫受傷的小生靈。',
    price: 0
  },
  {
    id: 'boy_star',
    name: '星空星軌領航員',
    title: '璀璨星盤先鋒',
    gender: 'boy',
    image: '/assets/avatars/boy_star.webp',
    desc: '深藍星辰頭巾映襯著清澈雙瞳，在黑夜中能辨認大武山上的每一顆星辰。',
    price: 0
  },
  {
    id: 'girl_dawn',
    name: '晨曦破曉少女',
    title: '朝陽第一縷光',
    gender: 'girl',
    image: '/assets/avatars/girl_dawn.webp',
    desc: '沐浴在霧臺清晨的第一抹金色曙光中，充滿無限希望與前進的朝氣。',
    price: 0
  }
];

export const AVATAR_FRAMES = [
  {
    id: 'frame_slate',
    name: '青石初階框',
    desc: '堅毅沉穩的霧臺青石板打磨而成，樸實內斂。',
    ringClass: 'ring-2 ring-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    badgeColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/60',
    auraClass: 'from-emerald-500/25 via-teal-500/10 to-transparent',
    price: 0
  },
  {
    id: 'frame_lily',
    name: '百合銀紋框',
    desc: '純銀手工雕琢的高山百合花紋，散發聖潔銀光。',
    ringClass: 'ring-2 ring-cyan-200/90 shadow-[0_0_20px_rgba(103,232,249,0.5)]',
    badgeColor: 'bg-cyan-950/90 text-cyan-200 border-cyan-300/60',
    auraClass: 'from-cyan-400/30 via-blue-400/15 to-transparent',
    price: 100
  },
  {
    id: 'frame_serpent',
    name: '百步蛇金雕框',
    desc: '尊貴百步蛇幾何菱形幾何金雕，榮耀象徵。',
    ringClass: 'ring-2 ring-amber-400/95 shadow-[0_0_22px_rgba(245,158,11,0.6)]',
    badgeColor: 'bg-amber-950/90 text-amber-300 border-amber-400/70',
    auraClass: 'from-amber-500/35 via-orange-500/20 to-transparent',
    price: 200
  },
  {
    id: 'frame_celestial',
    name: '星空琉璃浮光框',
    desc: '採擷大武山巔夜空星屑淬鍊的琉璃環，帶有神秘流動光暈。',
    ringClass: 'ring-2 ring-purple-400/95 shadow-[0_0_25px_rgba(168,85,247,0.65)]',
    badgeColor: 'bg-purple-950/90 text-purple-200 border-purple-400/70',
    auraClass: 'from-purple-500/35 via-indigo-500/20 to-transparent',
    price: 300
  }
];

export const getAvatarById = (id) => {
  return AVATAR_LIST.find(a => a.id === id) || AVATAR_LIST[0];
};

export const getAvatarFrameById = (id) => {
  return AVATAR_FRAMES.find(f => f.id === id) || AVATAR_FRAMES[0];
};
