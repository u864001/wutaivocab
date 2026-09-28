import {
  Eye, Snowflake, Gem, Coins, Lock, Satellite, Zap, Handshake
} from 'lucide-react';

/**
 * 八大功能卡牌百科核心定義
 */
export const POWER_UP_DEFS = {
  peek: {
    id: 'peek',
    name: '偷看卡',
    enName: 'Peek Card',
    spirit: '透視神眸 (Eye of Clarity)',
    icon: Eye,
    color: '#818cf8',
    gradient: 'from-indigo-600 to-purple-600',
    border: 'border-indigo-400',
    bg: 'bg-indigo-950/40',
    shortDesc: '選取場上任 2 張牌透視 5 秒 (僅本隊可見，絕不洩漏給敵隊)。',
    enDesc: 'Reveal any 2 hidden cards for 5 seconds (Exclusive to your team only).',
    tactic: '趁對手不注意時探查關鍵單字，掌握先機後下回合直接連擊配對！',
    enTactic: 'Scout crucial words exclusively to set up an unstoppable combo next turn!'
  },
  freeze: {
    id: 'freeze',
    name: '冰凍卡',
    enName: 'Freeze Card',
    spirit: '極寒霜精 (Frost Spirit)',
    icon: Snowflake,
    color: '#38bdf8',
    gradient: 'from-cyan-600 to-blue-700',
    border: 'border-cyan-400',
    bg: 'bg-cyan-950/40',
    shortDesc: '指定一個敵方隊伍，強制跳過其下一個行動回合 (Skip Turn)。',
    enDesc: 'Select an opponent team and force them to skip their next entire turn.',
    tactic: '在領先隊伍正要連霸時精準凍結他們，為己方爭取逆轉戰局的黃金機會！',
    enTactic: 'Freeze the leading team right when they threaten to sweep the board!'
  },
  bonus: {
    id: 'bonus',
    name: '加分卡',
    enName: 'Bonus Card',
    spirit: '財富守護者 (Guardian of Fortune)',
    icon: Gem,
    color: '#34d399',
    gradient: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-400',
    bg: 'bg-emerald-950/40',
    shortDesc: '翻開即刻生效！直接獲得超額 +30 積分暴擊！',
    enDesc: 'Triggers immediately! Instantly grants +30 massive bonus points to your score.',
    tactic: '純粹的得分神器，若處於落後狀態能瞬間拉近甚至超越比分！',
    enTactic: 'Pure scoring burst that can instantly bridge a gap or secure the lead!'
  },
  coin: {
    id: 'coin',
    name: '金幣雨',
    enName: 'Coin Rain',
    spirit: '落幣精靈 (Coin Pixie)',
    icon: Coins,
    color: '#facc15',
    gradient: 'from-amber-500 to-yellow-600',
    border: 'border-amber-400',
    bg: 'bg-amber-950/40',
    shortDesc: '觸發 10 秒狂點金幣小遊戲，狂賺金幣積分，小心別點到炸彈！',
    enDesc: 'Starts a 10s coin-catching frenzy. Grab gold coins for points, avoid bombs!',
    tactic: '考驗手指反應速度，專注狂點金幣；看到紅色炸彈切勿貪刀！',
    enTactic: 'Tests finger speed and reflexes. Tap coins relentlessly, dodge bombs carefully!'
  },
  lock: {
    id: 'lock',
    name: '上鎖卡',
    enName: 'Lock Card',
    spirit: '封印石衛 (Runic Sentinel)',
    icon: Lock,
    color: '#94a3b8',
    gradient: 'from-slate-600 to-zinc-700',
    border: 'border-slate-300',
    bg: 'bg-slate-900/50',
    shortDesc: '上鎖場上一張卡片，僅限本隊能翻開，敵方點擊將被防護阻擋。',
    enDesc: 'Lock one card on the board. Only your team can flip it; opponents are blocked.',
    tactic: '當你已經確定某張卡的位置但暫時無法配對時，直接上鎖據為己有！',
    enTactic: 'Lock down a known card to prevent opponents from stealing the match!'
  },
  radar: {
    id: 'radar',
    name: '雷達卡',
    enName: 'Radar Card',
    spirit: '全域天眼 (All-Seeing Eye)',
    icon: Satellite,
    color: '#4ade80',
    gradient: 'from-green-600 to-emerald-700',
    border: 'border-green-400',
    bg: 'bg-green-950/40',
    shortDesc: '全場透視 5 秒 (僅本隊畫面顯示微光文字，敵隊毫無所悉)！',
    enDesc: 'Activates full-board translucent x-ray for 5s (Secret to your team only)!',
    tactic: '5 秒黃金記憶時間，全隊迅速分工記下場上多組單字坐標！',
    enTactic: 'Quickly scan and memorize multiple matching pairs during the 5s window!'
  },
  lightning: {
    id: 'lightning',
    name: '閃電卡',
    enName: 'Lightning Card',
    spirit: '萬鈞雷霆 (Thunder Lord)',
    icon: Zap,
    color: '#fde047',
    gradient: 'from-yellow-400 to-amber-600',
    border: 'border-yellow-300',
    bg: 'bg-yellow-950/40',
    shortDesc: '天雷保送配對！前兩張翻到開啟 Bonus 回合；第 3、4 張翻到配對後換隊。',
    enDesc: 'Instant auto-match! Opens Bonus Turn on 1st/2nd pick; ends turn on 3rd/4th pick.',
    tactic: '最具威力的超級王牌，前段翻到能賺分又賺額外回合，極限掌控節奏！',
    enTactic: 'The ultimate trump card: scores points and triggers a free Bonus turn early on!'
  },
  winwin: {
    id: 'winwin',
    name: '雙贏卡',
    enName: 'Win-Win Card',
    spirit: '契約雙子 (Alliance Twins)',
    icon: Handshake,
    color: '#f472b6',
    gradient: 'from-pink-600 to-rose-600',
    border: 'border-pink-400',
    bg: 'bg-pink-950/40',
    shortDesc: '與一隊結為雙贏契約！該隊下次成功配對得分時，我方同享等額加分！',
    enDesc: 'Form an alliance with another team. When they score next, you get equal points!',
    tactic: '暗中綁定場上的最強高手隊伍，藉其手為我方免費賺取大量勝分！',
    enTactic: 'Form a pact with the top scoring opponent to piggyback on their next match!'
  }
};
