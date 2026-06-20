const { useState, useEffect, useMemo, useCallback } = React;

function App() {
    const [currentView, setCurrentView] = useState('lobby');
    const [gameMode, setGameMode] = useState(null); 
    const [settings, setSettings] = useState({ selectedUnits: [], count: 20 });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [wordDatabase, setWordDatabase] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lang, setLang] = useState('zh-TW');

    const [leaderboards, setLeaderboards] = useState([]);
    const [user, setUser] = useState(null);
    const [dbRef, setDbRef] = useState(null);
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    useEffect(() => {
        try {
            const config = { apiKey: "AIzaSyCJorCKM0-YKFamjixDVjcRSeOdtgJ3zyM", authDomain: "wutaivocab.firebaseapp.com", projectId: "wutaivocab" };
            if (!firebase.apps.length) firebase.initializeApp(config);
            const auth = firebase.auth();
            setDbRef(firebase.firestore());
            auth.signInAnonymously().catch(()=>{});
            auth.onAuthStateChanged((currentUser) => { setUser(currentUser); setFirebaseInitialized(true); });
        } catch(e) { setFirebaseInitialized(true); }
    }, []);

    // 排行榜快取設定：只在「進入排行榜頁面」或「手動重新整理」時才讀 Firestore
    // 5 分鐘快取：同一裝置在快取期間重新整理不會消耗任何讀取次數
    const [leaderboardCachedAt, setLeaderboardCachedAt] = React.useState(0);
    const LB_CACHE_KEY = 'lb_cache_v3';
    const LB_CACHE_TTL = 5 * 60 * 1000; // 5 分鐘

    const loadLeaderboard = React.useCallback(async (force = false) => {
        if (!dbRef) return;
        const now = Date.now();
        // 快取有效：直接用本機資料，不碰 Firestore
        if (!force) {
            try {
                const cached = JSON.parse(localStorage.getItem(LB_CACHE_KEY) || 'null');
                if (cached && (now - cached.t) < LB_CACHE_TTL) {
                    setLeaderboards(cached.d);
                    setLeaderboardCachedAt(cached.t);
                    return;
                }
            } catch(e) {}
        }
        // 快取失效：只讀「本週」與「上週」資料（2 次讀取，各 1 份 Firestore 查詢）
        // 加了 .where() 之後，只讀到符合條件的文件，不會讀整個 collection
        try {
            const cw = getWeekNumber();
            const [s1, s2] = await Promise.all([
                dbRef.collection('leaderboard').where('week', '==', cw).get(),
                dbRef.collection('leaderboard').where('week', '==', cw - 1).get()
            ]);
            const data = [
                ...s1.docs.map(d => ({ id: d.id, ...d.data() })),
                ...s2.docs.map(d => ({ id: d.id, ...d.data() }))
            ];
            setLeaderboards(data);
            setLeaderboardCachedAt(now);
            localStorage.setItem(LB_CACHE_KEY, JSON.stringify({ d: data, t: now }));
        } catch(e) {
            console.error('排行榜載入失敗', e);
            // 網路失敗時退回過期快取，確保畫面不空白
            try {
                const cached = JSON.parse(localStorage.getItem(LB_CACHE_KEY) || 'null');
                if (cached) { setLeaderboards(cached.d); setLeaderboardCachedAt(cached.t); }
            } catch(e2) {}
        }
    }, [dbRef]);

    useEffect(() => {
        const fetchWordData = async () => {
            try {
                let officialData = [];
                try {
                    const res1 = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`);
                    if (res1.ok) officialData = parseCSV(await res1.text());
                } catch (e) { console.warn("官方題庫讀取失敗", e); }

                let customData = [];
                const CUSTOM_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRMfkieB3uqgN4_yq7gAuamhO-fSAqBcH5qMbhq0ouiFgWqeizxLRKsW7mg-wJlL1TZ0sohpLz5zuA1/pub?gid=0&single=true&output=csv";
                try {
                    const res2 = await fetch(`${CUSTOM_SHEET_CSV_URL}&t=${new Date().getTime()}`);
                    if (res2.ok) {
                        const csvText = await res2.text();
                        // 🌟 Custom 題庫專屬「純文字」解析引擎，完全避開 parseInt 的破壞
                        const lines = csvText.split(/\r?\n/);
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;
                            const result = [];
                            let current = '', inQuotes = false;
                            for (let j = 0; j < lines[i].length; j++) {
                                const char = lines[i][j];
                                if (char === '"' && lines[i][j+1] === '"') { current += '"'; j++; }
                                else if (char === '"') { inQuotes = !inQuotes; }
                                else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
                                else { current += char; }
                            }
                            result.push(current);
                            const cols = result.map(s => s.trim());
                            
                            // 只要有英文或中文，就強制收錄，沒有填冊別預設為 'Custom'
                            if (cols.length >= 4 && (cols[2] || cols[3])) {
                                customData.push({
                                    book: cols[0] ? cols[0] : 'Custom',
                                    lesson: cols[1] ? cols[1] : '單字補充',
                                    en: cols[2] || '',
                                    zh: cols[3] || '',
                                    cloze: cols[4] || ''
                                });
                            }
                        }
                    }
                } catch (e) { console.warn("客製化題庫網路錯誤", e); }

                const combinedData = [...officialData, ...customData];
                
                // 濾除無效空行
                const finalData = combinedData.filter(w => w.en || w.zh || w.english || w.chinese);
                setWordDatabase(finalData.length > 0 ? finalData : DEFAULT_WORD_DATABASE);
            } catch (error) {
                setWordDatabase(DEFAULT_WORD_DATABASE);
            } finally { setIsLoading(false); }
        };
        fetchWordData();
    }, []);

    const navigateTo = (view, mode = null) => {
        soundEngine.init(); 
        setGameMode(mode);
        setCurrentView(view);
        // 進入排行榜時才讀 Firestore（快取有效就不讀）
        if (view === 'leaderboard') loadLeaderboard();
    };
    // 🌟 註冊全域方法供 Leaderboard.js 呼叫
    window.navigateToAdmin = () => navigateTo('admin');

    const handleSaveScore = async (scoreData) => {
        // 先更新本機畫面（不等 Firestore 回應，體感更流暢）
        setLeaderboards(prev => [...prev, { ...scoreData, userId: user?.uid }]);

        if (dbRef && user) {
            try {
                // Upsert：同一使用者在相同「週×模式×冊」下只保留最佳分數
                // 這樣排行榜 collection 大小長期可控，不會無限成長
                const existing = leaderboards.find(l =>
                    l.userId === user.uid &&
                    l.mode === scoreData.mode &&
                    String(l.book) === String(scoreData.book) &&
                    l.week === scoreData.week
                );
                if (existing) {
                    const isBetter = scoreData.score > (existing.score || 0) ||
                        (scoreData.score === existing.score && (scoreData.time || 9999) < (existing.time || 9999));
                    if (isBetter) {
                        await dbRef.collection('leaderboard').doc(existing.id).update({ ...scoreData, userId: user.uid });
                    }
                } else {
                    await dbRef.collection('leaderboard').add({ ...scoreData, userId: user.uid });
                }
                // 寫入後使本機快取失效，下次進排行榜頁會取得最新資料
                localStorage.removeItem(LB_CACHE_KEY);
            } catch(e) { console.error('分數儲存失敗', e); }
        }
    };

    const groupedUnits = useMemo(() => {
        const groups = {};
        wordDatabase.forEach(w => {
            if (!groups[w.book]) groups[w.book] = new Set();
            groups[w.book].add(w.lesson);
        });
        return groups;
    }, [wordDatabase]);

    const qualifyingBook = useMemo(() => {
        const selectedBooks = [...new Set(settings.selectedUnits.map(u => u.split('-')[0]))];
        if (selectedBooks.length !== 1) return null; 
        const book = selectedBooks[0];
        const selectedUnitsCount = settings.selectedUnits.length;
        const selectedWordsCount = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)).length;
        if (selectedWordsCount < 20 && selectedUnitsCount < 2) return null;
        const playCount = settings.count === 'all' ? selectedWordsCount : parseInt(settings.count, 10);
        if (playCount < 20 && settings.count !== 'all') return null;
        return book;
    }, [settings.selectedUnits, settings.count, wordDatabase]);

    if (isLoading || !firebaseInitialized) return <div className="min-h-screen flex flex-col items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-blue-600 mb-4 text-5xl"></i></div>;

    return (
        <div className="min-h-screen flex flex-col pb-10">
            <div className="max-w-4xl mx-auto w-full p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xl tracking-wider text-slate-800 dark:text-slate-100">霧臺國小</span>
                    {user && dbRef ? <div className="ml-2 flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full hidden sm:flex"><i className="fa-solid fa-wifi text-[10px] animate-pulse"></i> 已連線</div> : <div className="ml-2 flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full hidden sm:flex"><i className="fa-solid fa-globe text-[10px]"></i> 單機版</div>}
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full p-1 flex">
                        <button onClick={() => setLang('zh-TW')} className={`px-3 py-1 text-xs sm:text-sm font-bold rounded-full transition-all ${lang === 'zh-TW' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>ZH</button>
                        <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs sm:text-sm font-bold rounded-full transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>EN</button>
                    </div>
                    <button onClick={() => { setIsDarkMode(!isDarkMode); document.documentElement.classList.toggle('dark'); }} className="p-2 w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors">
                        {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
                    </button>
                </div>
            </div>

            {currentView === 'lobby' && <Lobby onNavigate={navigateTo} settings={settings} setSettings={setSettings} wordDatabase={wordDatabase} groupedUnits={groupedUnits} qualifyingBook={qualifyingBook} lang={lang} />}
            {['zh-en', 'en-zh', 'listening', 'hard'].includes(currentView) && <StandardQuiz mode={currentView} onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} qualifyingBook={qualifyingBook} onSaveScore={handleSaveScore} />}
            {currentView === 'spelling' && <SpellingGame onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} qualifyingBook={qualifyingBook} onSaveScore={handleSaveScore} />}
            {currentView === 'meteor' && <MeteorGame subMode={gameMode} onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} qualifyingBook={qualifyingBook} onSaveScore={handleSaveScore} />}
            {currentView === 'leaderboard' && <LeaderboardView onBack={() => navigateTo('lobby')} leaderboards={leaderboards} groupedUnits={groupedUnits} leaderboardCachedAt={leaderboardCachedAt} onRefresh={() => loadLeaderboard(true)} />}
            {currentView === 'battle' && <BattleGame onBack={() => navigateTo('lobby')} wordDatabase={wordDatabase} dbRef={dbRef} user={user} settings={settings} />}
            {currentView === 'memory_lobby' && <MemoryLobby onNavigate={navigateTo} mode={gameMode} settings={settings} wordDatabase={wordDatabase} />}
            {currentView === 'memory_single' && <MemoryGameSingle onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} onSaveScore={handleSaveScore} />}
            {currentView === 'memory_multi' && <MemoryGameMulti onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} dbRef={dbRef} user={user} />}
            {currentView === 'admin' && <AdminDashboard onBack={() => navigateTo('lobby')} dbRef={dbRef} lang={lang} setLang={setLang} />}
        </div>
    );
}

function Lobby({ onNavigate, settings, setSettings, wordDatabase, groupedUnits, qualifyingBook, lang }) {
    const dict = {
        'zh-TW': {
            title: '霧臺國小 英文學習平台',
            dbLoaded: `雲端題庫已載入：共 ${wordDatabase.length} 個單字`,
            leaderboard: '看全校英雄榜',
            sec1Title: '1. 設定複習範圍',
            selectAll: '全選',
            clearAll: '清空',
            selectedCount: `已選 ${wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)).length} 字`,
            bookPrefix: '第 ',
            bookSuffix: ' 冊',
            cancelBook: '取消全選',
            selectBook: '全選此範圍',
            unitPrefix: '第 ',
            unitSuffix: ' 課',
            qCount: '每次出題數量',
            q5: '隨機 5 題', q10: '隨機 10 題', q20: '隨機 20 題', qAll: '範圍內全部題目',
            reqMet: '🎯 範圍達標！選擇「20題」或「全部」即可上榜',
            reqFail: '須單冊選滿 2 個單元 (或 20 字) 才能挑戰榮譽榜。',
            sec2Title: '2. 多人連線對戰',
            battleTitle: '星際地平線死鬥',
            battleDesc: '2~4 人區網對戰，支援陷害與防線拔河，活到最後即是贏家！',
            memMultiTitle: '星際記憶翻牌',
            memMultiDesc: '2~4 隊區網連線回合制，支援正增強道具卡對戰！',
            sec3Title: '3. 單人挑戰模式',
            metZhEn: '看中文選英文',
            metEnZh: '看英文選中文',
            metDesc: '單機生存挑戰',
            memSingle: '記憶翻牌',
            memSingleDesc: '單機配對練習',
            abcGame: 'ABC 防衛戰',
            abcDesc: '一二年級專屬',
            sec4Title: '4. 傳統測驗與遊戲',
            spelling: '拖曳拼字',
            typeZhEn: '中翻英打字',
            typeEnZh: '英翻中打字',
            listening: '聽力測驗'
        },
        'en': {
            title: 'Wutai English Platform',
            dbLoaded: `Database loaded: ${wordDatabase.length} words`,
            leaderboard: 'View Leaderboard',
            sec1Title: '1. Select Review Range',
            selectAll: 'Select All',
            clearAll: 'Clear',
            selectedCount: `${wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)).length} Selected`,
            bookPrefix: 'Book ',
            bookSuffix: '',
            cancelBook: 'Deselect All',
            selectBook: 'Select This Range',
            unitPrefix: 'Unit ',
            unitSuffix: '',
            qCount: 'Questions per round',
            q5: 'Random 5', q10: 'Random 10', q20: 'Random 20', qAll: 'All in range',
            reqMet: '🎯 Range met! Select "20" or "All" to qualify for ranking.',
            reqFail: 'Select at least 2 units (or 20 words) from a single book to qualify.',
            sec2Title: '2. Multiplayer',
            battleTitle: 'Horizon Deathmatch',
            battleDesc: '2-4 players LAN battle. Survive to the end!',
            memMultiTitle: 'Memory Match',
            memMultiDesc: '2-4 teams turn-based match with power-up cards!',
            sec3Title: '3. Solo Challenges',
            metZhEn: 'ZH to EN',
            metEnZh: 'EN to ZH',
            metDesc: 'Survival Mode',
            memSingle: 'Memory Match',
            memSingleDesc: 'Solo Practice',
            abcGame: 'ABC Defense',
            abcDesc: 'Grade 1-2 only',
            sec4Title: '4. Classic Games',
            spelling: 'Spelling',
            typeZhEn: 'Type: ZH to EN',
            typeEnZh: 'Type: EN to ZH',
            listening: 'Listening Quiz'
        }
    };
    const t = dict[lang];

    const isQuizDisabled = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)).length === 0;
    const [expandedBooks, setExpandedBooks] = useState([]); 

    const toggleBookExpand = (book) => setExpandedBooks(prev => prev.includes(book) ? prev.filter(b => b !== book) : [...prev, book]);
    const toggleUnit = (book, lesson) => setSettings(prev => ({ ...prev, selectedUnits: prev.selectedUnits.includes(`${book}-${lesson}`) ? prev.selectedUnits.filter(u => u !== `${book}-${lesson}`) : [...prev.selectedUnits, `${book}-${lesson}`] }));
    const selectAllInBook = (book) => {
        const allUnits = Array.from(groupedUnits[book]).map(l => `${book}-${l}`);
        setSettings(prev => ({ ...prev, selectedUnits: allUnits.every(u => prev.selectedUnits.includes(u)) ? prev.selectedUnits.filter(u => !u.startsWith(`${book}-`)) : [...new Set([...prev.selectedUnits, ...allUnits])] }));
    };

    const getLessonWeight = (lesson) => {
        const str = String(lesson).toLowerCase();
        if (str.includes('starter')) return -1;
        if (str.includes('festival')) return 100;
        const num = parseInt(str.replace(/\D/g, ''));
        return isNaN(num) ? 50 : num;
    };

    const sortedBooks = Object.keys(groupedUnits).sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        const isNumA = !isNaN(numA);
        const isNumB = !isNaN(numB);
        if (isNumA && isNumB) return numA - numB;
        if (isNumA && !isNumB) return -1;
        if (!isNumA && isNumB) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 animate-[fadeIn_0.5s_ease-out]">
            <header className="mb-6 sm:mb-8 text-center relative">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{t.title}</h1>
                <p className="text-sm text-slate-500">{t.dbLoaded}</p>
                <div className="mt-6 flex justify-center">
                    <button onClick={() => onNavigate('leaderboard')} className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 font-black rounded-full shadow-lg transition-transform hover:scale-105">
                        <i className="fa-solid fa-trophy text-xl text-yellow-100"></i> <span className="text-lg">{t.leaderboard}</span>
                    </button>
                </div>
            </header>

            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                    <h2 className="flex items-center gap-2 text-blue-600 font-bold text-lg"><i className="fa-solid fa-gear text-xl"></i> {t.sec1Title}</h2>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSettings(s => ({ ...s, selectedUnits: wordDatabase.map(w => `${w.book}-${w.lesson}`) }))} className="text-sm font-bold text-slate-500 hover:text-blue-600">{t.selectAll}</button>
                        <button onClick={() => setSettings(s => ({ ...s, selectedUnits: [] }))} className="text-sm font-bold text-slate-500 hover:text-red-500">{t.clearAll}</button>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${isQuizDisabled ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>{t.selectedCount}</div>
                    </div>
                </div>

                <div className="space-y-3">
                    {sortedBooks.map(book => {
                        const allUnits = Array.from(groupedUnits[book]).map(l => `${book}-${l}`);
                        const isFull = allUnits.every(u => settings.selectedUnits.includes(u));
                        const isPart = allUnits.some(u => settings.selectedUnits.includes(u)) && !isFull;
                        const isExp = expandedBooks.includes(book);
                        return (
                            <div key={book} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => toggleBookExpand(book)}>
                                    <div className="flex items-center gap-3">
                                        <i className={`fa-solid fa-chevron-${isExp ? 'up' : 'down'} text-slate-400 w-4`}></i>
                                        {/* 🌟 完美的呈現邏輯：若是文字就直接印出文字，若是數字就加上「第X冊」 */}
                                        <h3 className="font-bold text-lg">{isNaN(book) ? book : `${t.bookPrefix}${book}${t.bookSuffix}`}</h3>
                                        {(isFull || isPart) && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); selectAllInBook(book); }} className={`text-xs font-bold px-3 py-1.5 rounded-full ${isFull ? 'bg-indigo-100 text-indigo-700' : isPart ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{isFull ? t.cancelBook : t.selectBook}</button>
                                </div>
                                {isExp && (
                                    <div className="p-3 pt-0 border-t border-slate-100 flex flex-wrap gap-2">
                                        {Array.from(groupedUnits[book]).sort((a,b) => getLessonWeight(a) - getLessonWeight(b)).map(lesson => {
                                            const isLessonNum = !isNaN(parseInt(lesson.toString().replace(/\D/g, '')));
                                            const displayStr = (!isLessonNum || String(lesson).toLowerCase().includes('starter') || String(lesson).toLowerCase().includes('festival')) 
                                                ? lesson 
                                                : `${t.unitPrefix}${lesson}${t.unitSuffix}`;
                                            return (
                                                <button key={`${book}-${lesson}`} onClick={() => toggleUnit(book, lesson)} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${settings.selectedUnits.includes(`${book}-${lesson}`) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800'}`}>
                                                    {displayStr}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div className="pt-4 flex flex-col lg:flex-row justify-between gap-4">
                        <div className="shrink-0">
                            <label className="text-sm font-semibold text-slate-500 mb-2 block">{t.qCount}</label>
                            <select className="p-3 w-full sm:w-64 border rounded-xl bg-slate-50 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200" value={settings.count} onChange={(e) => setSettings({...settings, count: e.target.value})}>
                                <option value="5">{t.q5}</option><option value="10">{t.q10}</option><option value="20">{t.q20}</option><option value="all">{t.qAll}</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-end justify-end">
                            {qualifyingBook !== null ? 
                                <div className="text-sm font-bold px-4 py-3 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center gap-2"><i className="fa-solid fa-star"></i> {t.reqMet}</div> : 
                                <div className="text-xs sm:text-sm font-medium px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex items-center gap-2"><i className="fa-solid fa-circle-info"></i> {t.reqFail}</div>
                            }
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <i className="fa-solid fa-fire text-red-500 text-xl"></i>
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t.sec2Title}</h2>
                </div>
                <div className="mb-4">
                    <button onClick={() => onNavigate('battle')} disabled={isQuizDisabled} className={`w-full rounded-3xl p-6 sm:p-8 flex items-center justify-between transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:shadow-2xl hover:shadow-red-500/20 border border-slate-700 group'}`}>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all"><i className="fa-solid fa-swords text-3xl"></i></div>
                            <div className="text-left">
                                <h3 className="font-black text-2xl text-slate-800 dark:text-white sm:text-white mb-1 tracking-wide">{t.battleTitle} <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full ml-2 align-middle">BETA</span></h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{t.battleDesc}</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-slate-500 text-2xl group-hover:text-red-400 group-hover:translate-x-2 transition-transform hidden sm:block"></i>
                    </button>

                    <button onClick={() => onNavigate('memory_lobby', 'multi')} disabled={isQuizDisabled} className={`w-full mt-4 rounded-3xl p-6 sm:p-8 flex items-center justify-between transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 hover:shadow-2xl hover:shadow-blue-500/20 border border-slate-700 group'}`}>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all"><i className="fa-solid fa-clone text-3xl"></i></div>
                            <div className="text-left">
                                <h3 className="font-black text-2xl text-slate-800 dark:text-white sm:text-white mb-1 tracking-wide">{t.memMultiTitle} <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full ml-2 align-middle">NEW</span></h3>
                                <p className="text-slate-500 dark:text-slate-300 font-medium text-sm">{t.memMultiDesc}</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-slate-500 text-2xl group-hover:text-blue-400 group-hover:translate-x-2 transition-transform hidden sm:block"></i>
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-4 px-2 mt-8">
                    <i className="fa-solid fa-rocket text-indigo-500 text-xl"></i>
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t.sec3Title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button onClick={() => onNavigate('meteor', 'zh-en')} disabled={isQuizDisabled} className={`rounded-2xl p-5 border-2 flex flex-col items-center text-center gap-3 transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-slate-800 border-slate-700 hover:border-indigo-400 hover:shadow-lg text-white'}`}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-500 text-white"><i className="fa-solid fa-meteor text-2xl"></i></div>
                        <div><h3 className="font-bold">{t.metZhEn}</h3><p className="text-xs text-slate-300 mt-1">{t.metDesc}</p></div>
                    </button>
                    <button onClick={() => onNavigate('meteor', 'en-zh')} disabled={isQuizDisabled} className={`rounded-2xl p-5 border-2 flex flex-col items-center text-center gap-3 transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-slate-800 border-slate-700 hover:border-emerald-400 hover:shadow-lg text-white'}`}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-500 text-white"><i className="fa-solid fa-meteor text-2xl"></i></div>
                        <div><h3 className="font-bold">{t.metEnZh}</h3><p className="text-xs text-slate-300 mt-1">{t.metDesc}</p></div>
                    </button>
                    
                    <button onClick={() => onNavigate('memory_lobby', 'single')} disabled={isQuizDisabled} className={`rounded-2xl p-5 border-2 flex flex-col items-center text-center gap-3 transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-slate-800 border-slate-700 hover:border-cyan-400 hover:shadow-lg text-white'}`}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-cyan-500 text-white"><i className="fa-solid fa-clone text-2xl"></i></div>
                        <div><h3 className="font-bold">{t.memSingle}</h3><p className="text-xs text-slate-300 mt-1">{t.memSingleDesc}</p></div>
                    </button>

                    <button onClick={() => onNavigate('meteor', 'abc')} className="rounded-2xl p-5 border-2 flex flex-col items-center text-center gap-3 transition-all bg-gradient-to-br from-yellow-400 to-orange-500 hover:scale-105 hover:shadow-lg text-white border-transparent">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 text-white"><i className="fa-solid fa-font text-2xl"></i></div>
                        <div><h3 className="font-bold">{t.abcGame}</h3><p className="text-xs text-orange-100 mt-1">{t.abcDesc}</p></div>
                    </button>
                </div>

                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 px-2">{t.sec4Title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => onNavigate('spelling')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-white dark:bg-slate-800 hover:border-pink-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-pink-100 text-pink-600'}`}><i className="fa-solid fa-puzzle-piece"></i></div>
                        <div><h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{t.spelling}</h3></div>
                    </button>
                    <button onClick={() => onNavigate('zh-en')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-white dark:bg-slate-800 hover:border-blue-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-blue-100 text-blue-600'}`}><i className="fa-solid fa-keyboard"></i></div>
                        <div><h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{t.typeZhEn}</h3></div>
                    </button>
                    <button onClick={() => onNavigate('en-zh')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-white dark:bg-slate-800 hover:border-emerald-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-emerald-100 text-emerald-600'}`}><i className="fa-solid fa-language"></i></div>
                        <div><h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{t.typeEnZh}</h3></div>
                    </button>
                    <button onClick={() => onNavigate('listening')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50' : 'bg-white dark:bg-slate-800 hover:border-purple-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-purple-100 text-purple-600'}`}><i className="fa-solid fa-volume-high"></i></div>
                        <div><h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{t.listening}</h3></div>
                 </button>
             </div>
         </section>

         <footer className="mt-4 flex flex-col items-center justify-center text-slate-400 pb-8">
             <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-2 transition-transform hover:scale-110">
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://u864001.github.io/wutaivocab/" alt="Game QR Code" className="w-20 h-20 opacity-80 dark:invert" />
             </div>
             <p className="text-xs font-bold"><i className="fa-solid fa-qrcode"></i> 掃描 QR Code 快速加入遊戲</p>
         </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
