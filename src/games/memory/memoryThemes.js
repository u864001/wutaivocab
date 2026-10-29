/**
 * 星際記憶翻牌 - 收藏級 TCG 主題配置（魯凱百合日之章、霧臺石板夜之章、奧林帕斯聖殿、神山翡翠）
 */
export const CARD_THEMES = {
  cyber_blue: {
    id: 'cyber_blue',
    name: '魯凱百合（日之章）',
    enName: 'Rukai Lily (Day)',
    icon: '☀️',
    motif: 'rukai_day',
    cardBackClass: 'bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 border-amber-400/80 text-amber-200 shadow-amber-500/25',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.22) 0%, transparent 72%)',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    cardFrontClass: 'bg-gradient-to-b from-amber-50 via-orange-50/95 to-amber-100 border-amber-500 text-stone-900 shadow-xl',
    tagBadgeClass: 'bg-amber-500/20 text-amber-800 border-amber-500/40'
  },
  noble_gold: {
    id: 'noble_gold',
    name: '古老石板（夜之章）',
    enName: 'Ancient Slate (Night)',
    icon: '🌙',
    motif: 'slate_night',
    cardBackClass: 'bg-gradient-to-br from-slate-950 via-stone-900 to-indigo-950 border-cyan-400/70 text-cyan-200 shadow-cyan-500/25',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.2) 0%, transparent 72%)',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    cardFrontClass: 'bg-gradient-to-b from-stone-100 via-slate-50 to-stone-200 border-amber-500/90 text-slate-900 shadow-xl',
    tagBadgeClass: 'bg-slate-800 text-amber-300 border-amber-400/40'
  },
  morandi_rose: {
    id: 'morandi_rose',
    name: '奧林帕斯聖殿',
    enName: 'Mount Olympus',
    icon: '🏛️',
    motif: 'olympus_gold',
    cardBackClass: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-amber-300/80 text-amber-200 shadow-purple-500/25',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.22) 0%, transparent 72%)',
    accentColor: '#fde047',
    glowColor: 'rgba(253, 224, 71, 0.45)',
    cardFrontClass: 'bg-gradient-to-b from-amber-50 via-stone-50 to-amber-100 border-amber-400 text-slate-900 shadow-xl',
    tagBadgeClass: 'bg-purple-500/20 text-purple-900 border-purple-500/40'
  },
  sacred_emerald: {
    id: 'sacred_emerald',
    name: '神山百步蛇秘紋',
    enName: 'Sacred Emerald',
    icon: '⛰️',
    motif: 'emerald_totem',
    cardBackClass: 'bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 border-emerald-400/70 text-emerald-200 shadow-emerald-500/25',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.2) 0%, transparent 72%)',
    accentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    cardFrontClass: 'bg-gradient-to-b from-emerald-50 via-stone-50 to-amber-50 border-emerald-500 text-slate-900 shadow-xl',
    tagBadgeClass: 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
  }
};
