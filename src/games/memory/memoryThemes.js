/**
 * 星際記憶翻牌 - 四大高質感卡牌主題色系配置
 */
export const CARD_THEMES = {
  cyber_blue: {
    id: 'cyber_blue',
    name: '星際科幻藍',
    enName: 'Cyber Blue',
    icon: '🌌',
    // 卡背樣式
    cardBackClass: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 border-blue-500/50 text-blue-300 shadow-blue-500/20',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
    // 卡背圖騰色
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    // 卡面樣式 (翻開後)
    cardFrontClass: 'bg-slate-900/95 border-blue-400/60 text-slate-100 shadow-lg',
    // 標籤徽章色
    tagBadgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  morandi_rose: {
    id: 'morandi_rose',
    name: '莫蘭迪粉紫',
    enName: 'Morandi Rose',
    icon: '🌸',
    cardBackClass: 'bg-gradient-to-br from-rose-950 via-stone-900 to-purple-950 border-rose-400/50 text-rose-300 shadow-rose-500/20',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.15) 0%, transparent 70%)',
    accentColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    cardFrontClass: 'bg-stone-900/95 border-rose-400/60 text-stone-100 shadow-lg',
    tagBadgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  noble_gold: {
    id: 'noble_gold',
    name: '尊爵黑金',
    enName: 'Noble Gold',
    icon: '👑',
    cardBackClass: 'bg-gradient-to-br from-stone-950 via-neutral-900 to-amber-950 border-amber-400/60 text-amber-300 shadow-amber-500/25',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.18) 0%, transparent 70%)',
    accentColor: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.45)',
    cardFrontClass: 'bg-stone-900/95 border-amber-400/70 text-amber-100 shadow-xl',
    tagBadgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  sacred_emerald: {
    id: 'sacred_emerald',
    name: '神山翡翠綠',
    enName: 'Sacred Emerald',
    icon: '⛰️',
    cardBackClass: 'bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 border-emerald-400/50 text-emerald-300 shadow-emerald-500/20',
    cardBackPattern: 'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
    accentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    cardFrontClass: 'bg-stone-900/95 border-emerald-400/60 text-emerald-100 shadow-lg',
    tagBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
};
