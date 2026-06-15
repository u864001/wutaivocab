function MemoryLobby({ onNavigate, mode, settings, wordDatabase }) {
    const [lang, setLang] = useState('zh-TW');
    const [gridSize, setGridSize] = useState('4x5');
    const [team, setTeam] = useState('red');
    const [deviceRole, setDeviceRole] = useState('full');

    // 雙語字典檔
    const dict = {
        'zh-TW': {
            back: '返回外層大廳',
            title: '星際記憶翻牌 - 準備室',
            modeSingle: '單人訓練模式',
            modeMulti: '區網對戰模式',
            gridSize: '1. 選擇版面大小',
            grid4x5: '4x5 單機單平板 (20張卡)',
            grid4x10: '4x10 雙機連動 (40張卡) - 測試中',
            teamSelection: '2. 選擇陣營或身份',
            spectator: '老師機 / 觀戰投影',
            roleSelection: '3. 選擇裝置顯示區域 (雙機模式專用)',
            roleFull: '完整顯示 (測試)',
            roleLeft: '左平板 (僅顯示英文)',
            roleRight: '右平板 (僅顯示中文)',
            start: mode === 'single' ? '開始單機挑戰' : '建立 / 加入對戰',
            cardLibrary: '星際道具圖鑑 (8 大正增強卡牌)',
            cards: [
                { id: 'peek', icon: 'fa-eye', color: 'text-indigo-400', name: '偷看卡 (Peek)', desc: '任選 2 張未翻開的卡片透視 5 秒 (僅本隊可見)。' },
                { id: 'freeze', icon: 'fa-snowflake', color: 'text-cyan-400', name: '冰凍卡 (Freeze)', desc: '指定一隊，強制跳過他們下一個回合。' },
                { id: 'bonus', icon: 'fa-gem', color: 'text-emerald-400', name: '加分卡 (Bonus)', desc: '立刻獲得大量分數獎勵！' },
                { id: 'coin', icon: 'fa-coins', color: 'text-yellow-400', name: '金幣雨 (Coin Rain)', desc: '10 秒狂點掉落金幣賺分，點到炸彈提前結束。' },
                { id: 'lock', icon: 'fa-lock', color: 'text-slate-400', name: '上鎖卡 (Lock)', desc: '鎖定場上一張卡片，僅限本隊伍可以翻閱。' },
                { id: 'radar', icon: 'fa-satellite-dish', color: 'text-green-400', name: '雷達卡 (Radar)', desc: '場上未翻開卡片半透明顯示 2 秒 (全場皆可見)。' },
                { id: 'lightning', icon: 'fa-bolt', color: 'text-yellow-300', name: '閃電卡 (Lightning)', desc: '保送卡！系統自動用閃電劈開對應的另一半並得分。' },
                { id: 'winwin', icon: 'fa-handshake', color: 'text-pink-400', name: '雙贏卡 (Win-Win)', desc: '指定一隊結盟，該隊下次得分時，本隊也獲得相同分數。' }
            ]
        },
        'en': {
            back: 'Back to Lobby',
            title: 'Memory Game - Lobby',
            modeSingle: 'Single Player Mode',
            modeMulti: 'LAN Multiplayer Mode',
            gridSize: '1. Select Grid Size',
            grid4x5: '4x5 Single Tablet (20 Cards)',
            grid4x10: '4x10 Dual Tablet (40 Cards) - Beta',
            teamSelection: '2. Select Team / Role',
            spectator: 'Teacher Projector (Spectate)',
            roleSelection: '3. Select Device Role (For Dual Tablet)',
            roleFull: 'Full Screen (Beta)',
            roleLeft: 'Left Tablet (English Only)',
            roleRight: 'Right Tablet (Chinese Only)',
            start: mode === 'single' ? 'Start Single Game' : 'Create / Join Match',
            cardLibrary: 'Power-up Cards Library',
            cards: [
                { id: 'peek', icon: 'fa-eye', color: 'text-indigo-400', name: 'Peek Card', desc: 'Reveal 2 un-flipped cards for 5s (Team only).' },
                { id: 'freeze', icon: 'fa-snowflake', color: 'text-cyan-400', name: 'Freeze Card', desc: 'Force a selected team to skip their next turn.' },
                { id: 'bonus', icon: 'fa-gem', color: 'text-emerald-400', name: 'Bonus Card', desc: 'Instantly gain a large amount of bonus points.' },
                { id: 'coin', icon: 'fa-coins', color: 'text-yellow-400', name: 'Coin Rain', desc: '10s tapping mini-game. Catch coins, avoid bombs!' },
                { id: 'lock', icon: 'fa-lock', color: 'text-slate-400', name: 'Lock Card', desc: 'Lock one card on the field. Only your team can flip it.' },
                { id: 'radar', icon: 'fa-satellite-dish', color: 'text-green-400', name: 'Radar Card', desc: 'Un-flipped cards turn translucent for 2s (Global).' },
                { id: 'lightning', icon: 'fa-bolt', color: 'text-yellow-300', name: 'Lightning Card', desc: 'Auto-match! System finds the pair for you.' },
                { id: 'winwin', icon: 'fa-handshake', color: 'text-pink-400', name: 'Win-Win Card', desc: 'Form an alliance. When they score, you score too!' }
            ]
        }
    };

    const t = dict[lang];

    const handleStartGame = () => {
        // 將大廳的設定當作參數往後傳遞
        const gameConfig = { gridSize, team, deviceRole };
        const targetView = mode === 'single' ? 'memory_single' : 'memory_multi';
        onNavigate(targetView, gameConfig);
    };

    return (
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 animate-[fadeIn_0.5s_ease-out]">
            {/* 頂部導覽列：安全返回鍵與中英雙語切換 */}
            <header className="flex justify-between items-center mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button onClick={() => onNavigate('lobby')} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left"></i> {t.back}
                </button>
                
                <h1 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 hidden sm:block">
                    {t.title} <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2 align-middle">{mode === 'single' ? t.modeSingle : t.modeMulti}</span>
                </h1>

                <div className="flex items-center gap-2">
                    {/* 中英切換按鈕 */}
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-full p-1 flex">
                        <button onClick={() => setLang('zh-TW')} className={`px-3 py-1 text-sm font-bold rounded-full transition-all ${lang === 'zh-TW' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}>ZH</button>
                        <button onClick={() => setLang('en')} className={`px-3 py-1 text-sm font-bold rounded-full transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}>EN</button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 左半部：遊戲硬體設定 */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-3">{t.gridSize}</h2>
                        <div className="space-y-2">
                            <button onClick={() => setGridSize('4x5')} className={`w-full text-left p-3 rounded-xl border-2 transition-all font-bold ${gridSize === '4x5' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800'}`}>
                                <i className="fa-solid fa-tablet-screen-button mr-2"></i>{t.grid4x5}
                            </button>
                            <button onClick={() => setGridSize('4x10')} className={`w-full text-left p-3 rounded-xl border-2 transition-all font-bold ${gridSize === '4x10' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800'}`}>
                                <i className="fa-solid fa-display mr-2"></i>{t.grid4x10}
                            </button>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-3">{t.teamSelection}</h2>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <button onClick={() => setTeam('red')} className={`p-3 rounded-xl font-bold transition-all border-2 text-white ${team === 'red' ? 'border-white ring-4 ring-red-500 bg-red-500 shadow-lg scale-105' : 'border-transparent bg-red-400 opacity-70 hover:opacity-100'}`}>紅隊 (Red)</button>
                            <button onClick={() => setTeam('yellow')} className={`p-3 rounded-xl font-bold transition-all border-2 text-yellow-950 ${team === 'yellow' ? 'border-white ring-4 ring-yellow-400 bg-yellow-400 shadow-lg scale-105' : 'border-transparent bg-yellow-300 opacity-70 hover:opacity-100'}`}>黃隊 (Yellow)</button>
                            <button onClick={() => setTeam('blue')} className={`p-3 rounded-xl font-bold transition-all border-2 text-white ${team === 'blue' ? 'border-white ring-4 ring-blue-500 bg-blue-500 shadow-lg scale-105' : 'border-transparent bg-blue-400 opacity-70 hover:opacity-100'}`}>藍隊 (Blue)</button>
                            <button onClick={() => setTeam('green')} className={`p-3 rounded-xl font-bold transition-all border-2 text-white ${team === 'green' ? 'border-white ring-4 ring-green-500 bg-green-500 shadow-lg scale-105' : 'border-transparent bg-green-400 opacity-70 hover:opacity-100'}`}>綠隊 (Green)</button>
                        </div>
                        <button onClick={() => setTeam('spectator')} className={`w-full p-3 rounded-xl font-bold transition-all border-2 ${team === 'spectator' ? 'border-slate-400 ring-4 ring-slate-300 bg-slate-700 text-white shadow-lg' : 'border-transparent bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                            <i className="fa-solid fa-chalkboard-user mr-2"></i>{t.spectator}
                        </button>
                    </section>

                    {gridSize === '4x10' && (
                        <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 animate-[fadeIn_0.3s_ease-out]">
                            <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-3">{t.roleSelection}</h2>
                            <div className="space-y-2">
                                <button onClick={() => setDeviceRole('left')} className={`w-full p-2 rounded-lg font-bold border-2 ${deviceRole === 'left' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>{t.roleLeft}</button>
                                <button onClick={() => setDeviceRole('right')} className={`w-full p-2 rounded-lg font-bold border-2 ${deviceRole === 'right' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-500'}`}>{t.roleRight}</button>
                            </div>
                        </section>
                    )}

                    <button onClick={handleStartGame} className="w-full py-4 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/30 transition-transform hover:scale-105 flex items-center justify-center gap-3">
                        <i className="fa-solid fa-play"></i> {t.start}
                    </button>
                </div>

                {/* 右半部：道具圖鑑 */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg border border-slate-700">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-book-sparkles text-yellow-400"></i> {t.cardLibrary}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {t.cards.map(card => (
                            <div key={card.id} className="group bg-slate-800/50 hover:bg-slate-700/80 p-4 rounded-2xl border border-slate-600 hover:border-slate-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/50 flex items-start gap-4">
                                <div className={`w-12 h-12 shrink-0 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700 shadow-inner group-hover:scale-110 transition-transform ${card.color}`}>
                                    <i className={`fa-solid ${card.icon} text-xl`}></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-100 mb-1">{card.name}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
