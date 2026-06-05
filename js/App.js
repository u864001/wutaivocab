// iOS Safari 專用防護
window.addEventListener('touchmove', function(e) { if(e.target.closest('[draggable]')) { e.preventDefault(); } }, {passive: false});
MobileDragDrop.polyfill({ holdToDrag: 0 });

const { useState, useEffect, useRef, useMemo } = React;

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHP_-ulCqptjhzeRMyfZ79zmCn6AtNZjBwphgXy--JOdEmkvTiV0_OX2kbq42w-HzGN7wDu35SDZ5h/pub?output=csv"; 

const DEFAULT_WORD_DATABASE = [
    { id: 1, book: 1, lesson: 1, en: 'apple', zh: '蘋果' },
    { id: 2, book: 1, lesson: 1, en: 'banana', zh: '香蕉' },
    { id: 3, book: 2, lesson: 2, en: 'school', zh: '學校' },
];

const BAD_WORDS = ['幹', '靠', '死', '媽的', '智障', '白痴', '賤', 'fuck', 'shit', 'bitch'];
const isValidName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (/^[\u4e00-\u9fa5]+$/.test(trimmed) && trimmed.length <= 3) return true;
    if (/^[a-zA-Z\s]+$/.test(trimmed) && trimmed.length <= 6) return true;
    return false;
};
const containsProfanity = (name) => BAD_WORDS.some(bw => name.toLowerCase().includes(bw));

const getWeekNumber = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const getLessonWeight = (lesson) => {
    if (typeof lesson === 'number') return lesson * 10; 
    const lStr = String(lesson).toLowerCase();
    if (lStr.includes('starter')) return 0;      
    if (lStr.includes('review')) return 1000;    
    if (lStr.includes('festival')) return 2000;  
    return 500; 
};

const parseCSV = (text) => {
    const result = [];
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return result;
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
    for (let i = 1; i < lines.length; i++) {
    const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
        let val = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '').replace(/""/g, '"') : "";
        if (headers[j] === 'id' || headers[j] === 'book') obj[headers[j]] = parseInt(val, 10) || 1;
        else if (headers[j] === 'lesson') obj[headers[j]] = isNaN(parseInt(val, 10)) ? val : parseInt(val, 10);
        else obj[headers[j]] = val;
    }
    if (obj.en && obj.zh) result.push(obj);
    }
    return result;
};

const soundEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    playTone(freq, type, duration, vol = 0.1) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    },
    correct() { this.playTone(800, 'sine', 0.15, 0.2); setTimeout(()=>this.playTone(1200, 'sine', 0.2, 0.2), 100); },
    wrong() { this.playTone(150, 'sawtooth', 0.3, 0.2); },
    laser() { this.playTone(600, 'square', 0.1, 0.05); setTimeout(()=>this.playTone(400, 'square', 0.1, 0.05), 50); },
    explosion() { this.playTone(100, 'sawtooth', 0.4, 0.3); },
    win() { [300, 400, 500, 600, 800].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.15, 0.1), i * 100)); }
};

const playAudio = (text) => {
    if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    }
};

function App() {
    const [currentView, setCurrentView] = useState('lobby');
    const [gameMode, setGameMode] = useState(null); 
    const [settings, setSettings] = useState({ selectedUnits: [], count: 20 });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [wordDatabase, setWordDatabase] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        if (!user || !dbRef) return; 
        const unsubscribe = dbRef.collection('leaderboard').onSnapshot((snapshot) => {
            setLeaderboards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user, dbRef]);

    useEffect(() => {
        const fetchWordData = async () => {
            try {
                const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`);
                if (!response.ok) throw new Error("Fetch failed");
                const parsedData = parseCSV(await response.text());
                setWordDatabase(parsedData.length > 0 ? parsedData : DEFAULT_WORD_DATABASE);
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
    };

    const handleSaveScore = async (scoreData) => {
        if (dbRef && user) {
            try { await dbRef.collection('leaderboard').add({...scoreData, userId: user.uid}); } 
            catch(e) { setLeaderboards(prev => [...prev, scoreData]); }
        } else setLeaderboards(prev => [...prev, scoreData]); 
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
        const selectedBooks = [...new Set(settings.selectedUnits.map(u => parseInt(u.split('-')[0], 10)))];
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
                    {user && dbRef ? <div className="ml-2 flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full"><i className="fa-solid fa-wifi text-[10px] animate-pulse"></i> 已連線</div> : <div className="ml-2 flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full"><i className="fa-solid fa-globe text-[10px]"></i> 單機版</div>}
                </div>
                <button onClick={() => { setIsDarkMode(!isDarkMode); document.documentElement.classList.toggle('dark'); }} className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}</button>
            </div>

            {currentView === 'lobby' && <Lobby onNavigate={navigateTo} settings={settings} setSettings={setSettings} wordDatabase={wordDatabase} groupedUnits={groupedUnits} qualifyingBook={qualifyingBook} />}
            {['zh-en', 'en-zh', 'listening', 'hard'].includes(currentView) && <StandardQuiz mode={currentView} onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} qualifyingBook={qualifyingBook} onSaveScore={handleSaveScore} />}
            {currentView === 'spelling' && <SpellingGame onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} qualifyingBook={qualifyingBook} onSaveScore={handleSaveScore} />}
            {currentView === 'meteor' && <MeteorGame subMode={gameMode} onBack={() => navigateTo('lobby')} settings={settings} wordDatabase={wordDatabase} qualifyingBook={qualifyingBook} onSaveScore={handleSaveScore} />}
            {currentView === 'leaderboard' && <LeaderboardView onBack={() => navigateTo('lobby')} leaderboards={leaderboards} groupedUnits={groupedUnits} />}
        </div>
    );
}

function Lobby({ onNavigate, settings, setSettings, wordDatabase, groupedUnits, qualifyingBook }) {
    const selectedWordCount = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)).length;
    const isQuizDisabled = selectedWordCount === 0;
    const [expandedBooks, setExpandedBooks] = useState([]); 

    const toggleBookExpand = (book) => setExpandedBooks(prev => prev.includes(book) ? prev.filter(b => b !== book) : [...prev, book]);
    const toggleUnit = (book, lesson) => setSettings(prev => ({ ...prev, selectedUnits: prev.selectedUnits.includes(`${book}-${lesson}`) ? prev.selectedUnits.filter(u => u !== `${book}-${lesson}`) : [...prev.selectedUnits, `${book}-${lesson}`] }));
    const selectAllInBook = (book) => {
        const allUnits = Array.from(groupedUnits[book]).map(l => `${book}-${l}`);
        setSettings(prev => ({ ...prev, selectedUnits: allUnits.every(u => prev.selectedUnits.includes(u)) ? prev.selectedUnits.filter(u => !u.startsWith(`${book}-`)) : [...new Set([...prev.selectedUnits, ...allUnits])] }));
    };

    return (
        <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 animate-[fadeIn_0.5s_ease-out]">
            <header className="mb-6 sm:mb-8 text-center relative">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">霧臺國小 英文學習平台</h1>
                <p className="text-sm text-slate-500">雲端題庫已載入：共 {wordDatabase.length} 個單字</p>
                <div className="mt-6 flex justify-center">
                    <button onClick={() => onNavigate('leaderboard')} className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 font-black rounded-full shadow-lg transition-transform hover:scale-105">
                        <i className="fa-solid fa-trophy text-xl text-yellow-100"></i> <span className="text-lg">看全校英雄榜</span>
                    </button>
                </div>
            </header>

            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                    <h2 className="flex items-center gap-2 text-blue-600 font-bold text-lg"><i className="fa-solid fa-gear text-xl"></i> 1. 設定複習範圍</h2>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSettings(s => ({ ...s, selectedUnits: wordDatabase.map(w => `${w.book}-${w.lesson}`) }))} className="text-sm font-bold text-slate-500 hover:text-blue-600">全選</button>
                        <button onClick={() => setSettings(s => ({ ...s, selectedUnits: [] }))} className="text-sm font-bold text-slate-500 hover:text-red-500">清空</button>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${isQuizDisabled ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>已選 {selectedWordCount} 字</div>
                    </div>
                </div>

                <div className="space-y-3">
                    {Object.keys(groupedUnits).sort((a,b)=>a-b).map(book => {
                        const allUnits = Array.from(groupedUnits[book]).map(l => `${book}-${l}`);
                        const isFull = allUnits.every(u => settings.selectedUnits.includes(u));
                        const isPart = allUnits.some(u => settings.selectedUnits.includes(u)) && !isFull;
                        const isExp = expandedBooks.includes(book);
                        return (
                            <div key={book} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => toggleBookExpand(book)}>
                                    <div className="flex items-center gap-3"><i className={`fa-solid fa-chevron-${isExp ? 'up' : 'down'} text-slate-400 w-4`}></i><h3 className="font-bold text-lg">第 {book} 冊</h3>{(isFull || isPart) && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}</div>
                                    <button onClick={(e) => { e.stopPropagation(); selectAllInBook(book); }} className={`text-xs font-bold px-3 py-1.5 rounded-full ${isFull ? 'bg-indigo-100 text-indigo-700' : isPart ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{isFull ? '取消全冊' : '全選此冊'}</button>
                                </div>
                                {isExp && (
                                    <div className="p-3 pt-0 border-t border-slate-100 flex flex-wrap gap-2">
                                        {Array.from(groupedUnits[book]).sort((a,b) => getLessonWeight(a) - getLessonWeight(b)).map(lesson => (
                                            <button key={`${book}-${lesson}`} onClick={() => toggleUnit(book, lesson)} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${settings.selectedUnits.includes(`${book}-${lesson}`) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>{typeof lesson === 'number' ? `第 ${lesson} 課` : lesson}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div className="pt-4 flex flex-col lg:flex-row justify-between gap-4">
                        <div className="shrink-0">
                            <label className="text-sm font-semibold text-slate-500 mb-2 block">每次出題數量</label>
                            <select className="p-3 w-full sm:w-64 border rounded-xl bg-slate-50 font-semibold" value={settings.count} onChange={(e) => setSettings({...settings, count: e.target.value})}>
                                <option value="5">隨機 5 題</option><option value="10">隨機 10 題</option><option value="20">隨機 20 題</option><option value="all">範圍內全部題目</option>
                            </select>
                        </div>
                        <div className="flex-1 flex items-end justify-end">
                            {qualifyingBook !== null ? 
                                <div className="text-sm font-bold px-4 py-3 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center gap-2"><i className="fa-solid fa-star"></i> 🎯 範圍達標！選擇「20題」或「全部」即可上榜</div> : 
                                <div className="text-xs sm:text-sm font-medium px-4 py-3 rounded-xl bg-slate-100 text-slate-500 border flex items-center gap-2"><i className="fa-solid fa-circle-info"></i> 須單冊選滿 2 個單元 (或 20 字) 才能挑戰榮譽榜。</div>
                            }
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <i className="fa-solid fa-rocket text-indigo-500 text-xl"></i>
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">2. 太空隕石防衛戰</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <button onClick={() => onNavigate('meteor', 'zh-en')} disabled={isQuizDisabled} className={`rounded-2xl p-5 border-2 flex flex-col items-center text-center gap-3 transition-all ${isQuizDisabled ? 'bg-slate-100 opacity-50' : 'bg-slate-800 border-slate-700 hover:border-indigo-400 hover:shadow-lg text-white'}`}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-500 text-white"><i className="fa-solid fa-meteor text-2xl"></i></div>
                        <div><h3 className="font-bold">看中文選英文</h3><p className="text-xs text-slate-300 mt-1">掉落中文，選擇英文砲台</p></div>
                    </button>
                    <button onClick={() => onNavigate('meteor', 'en-zh')} disabled={isQuizDisabled} className={`rounded-2xl p-5 border-2 flex flex-col items-center text-center gap-3 transition-all ${isQuizDisabled ? 'bg-slate-100 opacity-50' : 'bg-slate-800 border-slate-700 hover:border-emerald-400 hover:shadow-lg text-white'}`}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-500 text-white"><i className="fa-solid fa-meteor text-2xl"></i></div>
                        <div><h3 className="font-bold">看英文選中文</h3><p className="text-xs text-slate-300 mt-1">掉落英文，選擇中文砲台</p></div>
                    </button>
                    <button onClick={() => onNavigate('meteor', 'abc')} className="rounded-2xl p-5 border-2 flex flex-col items-center text-center gap-3 transition-all bg-gradient-to-br from-yellow-400 to-orange-500 hover:scale-105 hover:shadow-lg text-white border-transparent">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20 text-white"><i className="fa-solid fa-font text-2xl"></i></div>
                        <div><h3 className="font-bold">ABC 大小寫防衛戰</h3><p className="text-xs text-orange-100 mt-1">一二年級專屬，免選範圍直接玩</p></div>
                    </button>
                </div>

                <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">3. 傳統測驗與遊戲</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => onNavigate('spelling')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 opacity-50' : 'bg-white hover:border-pink-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200' : 'bg-pink-100 text-pink-600'}`}><i className="fa-solid fa-puzzle-piece"></i></div>
                        <div><h3 className="font-bold text-sm">拖曳拼字</h3></div>
                    </button>
                    <button onClick={() => onNavigate('zh-en')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 opacity-50' : 'bg-white hover:border-blue-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200' : 'bg-blue-100 text-blue-600'}`}><i className="fa-solid fa-keyboard"></i></div>
                        <div><h3 className="font-bold text-sm">中翻英打字</h3></div>
                    </button>
                    <button onClick={() => onNavigate('en-zh')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 opacity-50' : 'bg-white hover:border-emerald-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200' : 'bg-emerald-100 text-emerald-600'}`}><i className="fa-solid fa-language"></i></div>
                        <div><h3 className="font-bold text-sm">英翻中打字</h3></div>
                    </button>
                    <button onClick={() => onNavigate('listening')} disabled={isQuizDisabled} className={`rounded-2xl p-4 border-2 flex flex-col items-center text-center gap-2 transition-all ${isQuizDisabled ? 'bg-slate-100 opacity-50' : 'bg-white hover:border-purple-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isQuizDisabled ? 'bg-slate-200' : 'bg-purple-100 text-purple-600'}`}><i className="fa-solid fa-volume-high"></i></div>
                        <div><h3 className="font-bold text-sm">聽力測驗</h3></div>
                    </button>
                </div>
            </section>
        </div>
    );
}

function MeteorGame({ subMode, onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const [queue, setQueue] = useState([]);
    const [currentMeteor, setCurrentMeteor] = useState(null); 
    const [options, setOptions] = useState([]);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    
    const [playerName, setPlayerName] = useState('');
    const [nameError, setNameError] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);
    
    const containerRef = useRef(null);
    const meteorRef = useRef(null); 
    
    const gameStartTimeRef = useRef(null);
    const finalSurvivalTimeRef = useRef(0);

    useEffect(() => {
        let db = [];
        if (subMode === 'abc') {
            const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
            db = ALPHABET.map((letter, i) => ({
                id: `abc-${i}`, book: 'ABC', lesson: 0,
                en: letter, zh: letter.toLowerCase() 
            }));
        } else {
            db = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`));
        }

        let shuffled = [...db].sort(() => 0.5 - Math.random());
        if (settings.count !== 'all' && subMode !== 'abc') {
            shuffled = shuffled.slice(0, parseInt(settings.count, 10));
        }
        setQueue(shuffled);
    }, [settings, wordDatabase, subMode]);

    const generateOptions = (correctWord, fullDb) => {
        const ansKey = subMode === 'en-zh' ? 'zh' : (subMode === 'abc' ? 'zh' : 'en');
        const correctAns = correctWord[ansKey];
        
        let pool = fullDb.map(w => w[ansKey]).filter(a => a !== correctAns);
        pool = [...new Set(pool)].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        const finalOptions = [...pool, correctAns].map(opt => ({
            text: opt,
            isCorrect: opt === correctAns,
            id: Math.random().toString()
        })).sort(() => 0.5 - Math.random());
        
        setOptions(finalOptions);
    };

    const spawnMeteor = (wordObj) => {
        const dropDuration = Math.max(1.5, 5 - (score * 0.15)); 
        const xPos = 10 + Math.random() * 80; 

        setCurrentMeteor({
            wordObj,
            x: xPos,
            duration: dropDuration,
            isExploding: false,
            id: Date.now()
        });
        
        if (subMode !== 'zh-en' && subMode !== 'abc') playAudio(wordObj.en);
    };

    const handleStart = () => {
        if (queue.length === 0) return onBack();
        setHasStarted(true);
        setLives(3);
        setScore(0);
        gameStartTimeRef.current = performance.now(); 
        
        const firstWord = queue[0];
        generateOptions(firstWord, subMode === 'abc' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({zh: l.toLowerCase()})) : wordDatabase);
        spawnMeteor(firstWord);
    };

    useEffect(() => {
        if (!hasStarted || isFinished || !currentMeteor || currentMeteor.isExploding) return;

        let start = performance.now();
        let animationFrameId;

        const drop = (now) => {
            const elapsed = (now - start) / 1000; 
            const progress = Math.min(elapsed / currentMeteor.duration, 1);
            
            const easeInProgress = progress * progress;
            const currentY = -15 + (easeInProgress * 100); 

            if (meteorRef.current) {
                meteorRef.current.style.top = `${currentY}%`;
            }

            if (progress >= 1) {
                handleMiss();
            } else {
                animationFrameId = requestAnimationFrame(drop);
            }
        };

        animationFrameId = requestAnimationFrame(drop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentMeteor, hasStarted, isFinished]);

    const handleMiss = () => {
        soundEngine.wrong();
        if(containerRef.current) {
            containerRef.current.classList.add('animate-[shake_0.5s_ease-in-out]');
            setTimeout(() => containerRef.current?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500);
        }
        
        setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
        
        setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
                finalSurvivalTimeRef.current = Math.floor((performance.now() - gameStartTimeRef.current) / 1000);
                setTimeout(() => setIsFinished(true), 1000);
            } else {
                setTimeout(() => nextTurn(), 1000);
            }
            return newLives;
        });
    };

    const handleShoot = (opt, e) => {
        if (!currentMeteor || currentMeteor.isExploding) return;

        soundEngine.laser(); 

        if (opt.isCorrect) {
            soundEngine.explosion(); 
            setScore(s => s + 1);
            setCurrentMeteor(prev => ({ ...prev, isExploding: true }));
            
            if(meteorRef.current && containerRef.current) {
                const rect = meteorRef.current.getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;
                confetti({ particleCount: 40, spread: 60, origin: { x, y }, colors: ['#f87171', '#fbbf24', '#facc15'] });
            }

            setTimeout(() => nextTurn(), 800);
        } else {
            handleMiss();
        }
    };

    const nextTurn = () => {
        const newQueue = [...queue];
        newQueue.shift();
        if (newQueue.length > 0) {
            setQueue(newQueue);
            const nextWord = newQueue[0];
            generateOptions(nextWord, subMode === 'abc' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({zh: l.toLowerCase()})) : wordDatabase);
            spawnMeteor(nextWord);
        } else {
            finalSurvivalTimeRef.current = Math.floor((performance.now() - gameStartTimeRef.current) / 1000);
            setIsFinished(true);
            soundEngine.win();
        }
    };

    const submitToLeaderboard = () => {
        if (!isValidName(playerName)) { setNameError('請輸入正確的姓名格式'); return; }
        if (containsProfanity(playerName)) { setNameError('請勿使用不雅字眼'); return; }
        const realBook = subMode === 'abc' ? 'ABC' : qualifyingBook;
        onSaveScore({ book: realBook, mode: `meteor-${subMode}`, name: playerName.trim(), score: score, time: finalSurvivalTimeRef.current, week: getWeekNumber(), timestamp: Date.now() });
        setScoreSaved(true);
    };

    if (!hasStarted) return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900"><div className="bg-slate-800 rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-700"><div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6"><i className="fa-solid fa-meteor text-4xl"></i></div><h2 className="text-3xl font-bold mb-4 text-white">太空隕石防衛戰</h2><p className="text-slate-400 mb-8 font-medium">看準掉落的隕石單字，<br/>在下方炮台選擇正確翻譯擊碎它！<br/><br/><span className="text-orange-400 font-bold text-sm block"><i className="fa-solid fa-volume-high"></i> 請開啟聲音體驗最佳效果！</span></p><button onClick={handleStart} className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-transform hover:scale-105">發射升空</button><button onClick={onBack} className="w-full mt-4 py-3 text-slate-500 hover:text-slate-300 font-semibold">返回基地</button></div></div>
    );

    if (isFinished) {
        const canRank = subMode === 'abc' || qualifyingBook !== null;
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900"><div className="bg-slate-800 rounded-3xl shadow-xl p-10 max-w-md w-full text-center relative overflow-hidden border border-slate-700"><i className="fa-solid fa-trophy text-yellow-400 mb-6 text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"></i><h2 className="text-3xl font-bold mb-2 text-white">防衛結束！</h2><p className="text-slate-400 mb-4">成功擊毀：<span className="font-bold text-indigo-400 text-xl">{score} 顆隕石</span></p><p className="text-slate-500 text-sm mb-6">總生存時間：{finalSurvivalTimeRef.current} 秒</p>{canRank && !scoreSaved ? (<div className="mt-4 mb-8 p-5 bg-slate-900/50 rounded-2xl border border-yellow-500/30"><h3 className="font-black text-yellow-500 mb-3"><i className="fa-solid fa-crown"></i> 獲得銀河榜單資格！</h3><input type="text" value={playerName} onChange={e => {setPlayerName(e.target.value); setNameError('');}} placeholder="輸入指揮官姓名" className="w-full p-3 rounded-xl border-2 border-slate-600 bg-slate-800 text-white outline-none focus:border-yellow-500 text-center mb-2 font-bold" onKeyDown={e => e.key === 'Enter' && submitToLeaderboard()} />{nameError && <p className="text-red-400 text-sm mb-3 font-bold">{nameError}</p>}<button onClick={submitToLeaderboard} className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-yellow-950 font-black rounded-xl shadow-md hover:scale-105">登錄戰績</button></div>) : scoreSaved ? (<div className="mb-8 p-4 bg-emerald-900/30 text-emerald-400 rounded-2xl font-bold border border-emerald-800"><i className="fa-solid fa-circle-check text-xl"></i> 戰績已同步！</div>) : null}<button onClick={onBack} className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">返回大廳</button></div></div>
        );
    }

    return (
        <div className="flex-1 flex flex-col w-full h-[100dvh] bg-slate-900 overflow-hidden no-select">
            <header className="flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur z-20 text-white border-b border-slate-800 shrink-0">
                <button onClick={onBack} className="text-slate-400 hover:text-white"><i className="fa-solid fa-chevron-left"></i> 撤退</button>
                <div className="font-black text-xl text-indigo-400 tracking-wider">SCORE: {score}</div>
                <div className="flex gap-1 text-red-500">
                    {[...Array(3)].map((_, i) => <i key={i} className={`fa-solid fa-heart ${i < lives ? '' : 'text-slate-700'}`}></i>)}
                </div>
            </header>
            <main ref={containerRef} className="flex-1 relative w-full stars-bg">
                {currentMeteor && (
                    <div 
                        ref={meteorRef}
                        className="absolute transform -translate-x-1/2 flex flex-col items-center justify-center" 
                        style={{ left: `${currentMeteor.x}%`, top: '-15%' }} 
                    >
                        {currentMeteor.isExploding ? (
                            <div className="text-5xl animate-[ping_0.3s_ease-out_forwards] text-orange-500"><i className="fa-solid fa-explosion"></i></div>
                        ) : (
                            <div className="relative group cursor-pointer" onClick={() => playAudio(currentMeteor.wordObj.en)}>
                                <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                                <div className="relative bg-slate-800 border-2 border-slate-600 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col items-center">
                                    <i className="fa-solid fa-meteor text-orange-400 text-2xl sm:text-3xl mb-2 absolute -top-4"></i>
                                    <span className="text-2xl sm:text-4xl font-black text-white whitespace-nowrap">
                                        {subMode === 'zh-en' ? currentMeteor.wordObj.zh : currentMeteor.wordObj.en}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-indigo-500/20 to-transparent border-t border-indigo-500/30"></div>
            </main>
            <footer className="w-full bg-slate-950 p-4 pb-8 sm:p-6 shrink-0 z-20 border-t border-slate-800">
                <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3 sm:gap-4">
                    {options.map((opt) => (
                        <button key={opt.id} onClick={(e) => handleShoot(opt, e)} className="relative overflow-hidden group bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 rounded-xl p-4 sm:p-6 active:scale-95 transition-all">
                            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative text-xl sm:text-2xl font-bold text-white block truncate">{opt.text}</span>
                        </button>
                    ))}
                </div>
            </footer>
            <style dangerouslySetInnerHTML={{__html: `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px) rotate(-2deg); } 50% { transform: translateX(10px) rotate(2deg); } 75% { transform: translateX(-10px) rotate(-2deg); } }`}} />
        </div>
    );
}

function SpellingGame({ onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const [queue, setQueue] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [slots, setSlots] = useState([]);      
    const [letters, setLetters] = useState([]);  
    const [hasStarted, setHasStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [stats, setStats] = useState({ correct: 0, wrong: 0 }); 
    const [questionLives, setQuestionLives] = useState(5);        
    const [feedback, setFeedback] = useState(null);               
    const [dragState, setDragState] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [nameError, setNameError] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);

    useEffect(() => { let filtered = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)); let shuffled = [...filtered].sort(() => 0.5 - Math.random()); if (settings.count !== 'all') shuffled = shuffled.slice(0, parseInt(settings.count, 10)); setQueue(shuffled); }, [settings, wordDatabase]);
    const loadWord = (wordObj) => { setCurrentWord(wordObj); const wordStr = wordObj.en.toLowerCase(); setSlots(new Array(wordStr.length).fill(null)); const chars = wordStr.split('').map((char, index) => ({ id: `letter-${index}-${Date.now()}`, char, isPlaced: false })); setLetters(chars.sort(() => 0.5 - Math.random())); setQuestionLives(5); setFeedback(null); setTimeout(() => playAudio(wordObj.en), 300); };
    const handleStart = () => { if (queue.length === 0) return onBack(); setHasStarted(true); setStartTime(Date.now()); loadWord(queue[0]); };
    const moveToNext = (wasCorrect) => { setFeedback(null); const newQueue = [...queue]; const curr = newQueue.shift(); if (!wasCorrect) newQueue.push(curr); if (newQueue.length > 0) { setQueue(newQueue); loadWord(newQueue[0]); } else { setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); setIsFinished(true); soundEngine.win(); } };

    const handleTouchStart = (e, letter) => { if (feedback || letter.isPlaced) return; const touch = e.touches ? e.touches[0] : e; setDragState({ item: letter, startX: touch.clientX, startY: touch.clientY, x: touch.clientX, y: touch.clientY, isDragging: false }); };
    const handleTouchMove = (e) => { if (!dragState) return; if (e.cancelable) e.preventDefault(); const touch = e.touches ? e.touches[0] : e; const dx = touch.clientX - dragState.startX; const dy = touch.clientY - dragState.startY; if (!dragState.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) { setDragState(prev => ({ ...prev, isDragging: true, x: touch.clientX, y: touch.clientY })); } else if (dragState.isDragging) { setDragState(prev => ({ ...prev, x: touch.clientX, y: touch.clientY })); } };
    const handleTouchEnd = (e) => { 
        if (!dragState) return; 
        if (!dragState.isDragging) { 
            if (e.cancelable) e.preventDefault(); 
            handleLetterClick(dragState.item); 
            setDragState(null); 
            return; 
        } 
        if (e.cancelable) e.preventDefault(); 
        const touch = e.changedTouches ? e.changedTouches[0] : e; 
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY); 
        const slotEl = targetElement?.closest('[data-slot-index]'); 
        if (slotEl) { 
            const slotIndex = parseInt(slotEl.getAttribute('data-slot-index'), 10); 
            const targetChar = currentWord.en.toLowerCase()[slotIndex]; 
            if (slots[slotIndex] !== null) { 
                processWrongPlacement(slotEl); 
            } else if (dragState.item.char === targetChar) { 
                processCorrectPlacement(dragState.item, slotIndex, slotEl); 
            } else { 
                processWrongPlacement(slotEl); 
            } 
        } else { 
            processWrongPlacement(null); 
        } 
        setDragState(null); 
    };
    const handleHtmlDragStart = (e, letter) => { if (feedback || letter.isPlaced) return; e.dataTransfer.setData('application/json', JSON.stringify(letter)); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => e.target.classList.add('invisible'), 0); };
    const handleHtmlDragEnd = (e) => e.target.classList.remove('invisible');
    const handleHtmlDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
    const handleHtmlDrop = (e, slotIndex) => { e.preventDefault(); const data = e.dataTransfer.getData('application/json'); if (!data) return; const droppedLetter = JSON.parse(data); const targetChar = currentWord.en.toLowerCase()[slotIndex]; if (slots[slotIndex] !== null) return processWrongPlacement(e.target); if (droppedLetter.char === targetChar) processCorrectPlacement(droppedLetter, slotIndex, e.target); else processWrongPlacement(e.target); };
    const handleLetterClick = (letter) => { if (feedback || letter.isPlaced) return; const nextEmptyIndex = slots.findIndex(s => s === null); if (nextEmptyIndex === -1) return; const targetChar = currentWord.en.toLowerCase()[nextEmptyIndex]; if (letter.char === targetChar) { processCorrectPlacement(letter, nextEmptyIndex, document.querySelector(`[data-slot-index="${nextEmptyIndex}"]`)); } else { const el = document.getElementById(letter.id); if (el) processWrongPlacement(el); } };

    const processCorrectPlacement = (letterObj, slotIndex, dropTargetElement) => { soundEngine.correct(); if (dropTargetElement) { const rect = dropTargetElement.getBoundingClientRect(); const x = (rect.left + rect.width / 2) / window.innerWidth; const y = (rect.top + rect.height / 2) / window.innerHeight; confetti({ particleCount: 30, spread: 50, origin: { x, y }, colors: ['#4ade80', '#3b82f6'] }); } const newSlots = [...slots]; newSlots[slotIndex] = letterObj; setSlots(newSlots); setLetters(prev => prev.map(l => l.id === letterObj.id ? { ...l, isPlaced: true } : l)); if (newSlots.every(slot => slot !== null)) { setFeedback('correct'); setStats(s => ({ ...s, correct: s.correct + 1 })); setTimeout(() => moveToNext(true), 1500); } };
    const processWrongPlacement = (element) => { soundEngine.wrong(); element?.classList.add('animate-[shake_0.5s_ease-in-out]'); setTimeout(() => element?.classList.remove('animate-[shake_0.5s_ease-in-out]'), 500); setQuestionLives(prev => { const next = prev - 1; if (next <= 0) { setFeedback('incorrect'); setStats(s => ({ ...s, wrong: s.wrong + 1 })); setTimeout(() => moveToNext(false), 2500); } return next; }); };
    const submitToLeaderboard = () => { if (!isValidName(playerName)) { setNameError('請輸入正確的姓名格式'); return; } if (containsProfanity(playerName)) { setNameError('請勿使用不雅字眼'); return; } onSaveScore({ book: qualifyingBook, mode: 'spelling', name: playerName.trim(), score: stats.correct, time: elapsedTime, week: getWeekNumber(), timestamp: Date.now() }); setScoreSaved(true); };

    if (!hasStarted) return <div className="flex-1 flex flex-col items-center justify-center p-6 animate-[fadeIn_0.5s_ease-out]"><div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 max-w-md w-full text-center"><div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6"><i className="fa-solid fa-puzzle-piece text-4xl"></i></div><h2 className="text-3xl font-bold mb-4">拖曳拼字遊戲</h2><p className="text-slate-500 mb-8 font-medium">聽語音，組合出正確單字！<br/><span className="text-red-500 font-bold block mt-2"><i className="fa-solid fa-heart"></i> 注意！每題有 5 次猜錯機會</span></p><button onClick={handleStart} className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform">開始闖關</button><button onClick={onBack} className="w-full mt-4 py-3 text-slate-500 hover:text-slate-700 font-semibold">返回大廳</button></div></div>;
    if (isFinished) return <div className="flex-1 flex flex-col items-center justify-center p-6 animate-[fadeIn_0.5s_ease-out]"><div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center relative overflow-hidden"><i className="fa-solid fa-trophy text-yellow-400 mb-6 text-6xl"></i><h2 className="text-3xl font-bold mb-2">闖關完成！</h2><p className="text-slate-500 mb-6">總花費時間：<span className="font-bold text-pink-500">{elapsedTime} 秒</span></p><div className="flex justify-center gap-8 mb-8"><div><div className="text-4xl font-black text-emerald-500">{stats.correct}</div><div className="text-sm font-bold text-slate-400 mt-1">完美答對</div></div><div><div className="text-4xl font-black text-red-400">{stats.wrong}</div><div className="text-sm font-bold text-slate-400 mt-1">耗盡重答</div></div></div>{qualifyingBook !== null && !scoreSaved ? (<div className="mt-4 mb-8 p-5 bg-yellow-50 rounded-2xl border border-yellow-300"><h3 className="font-black text-yellow-600 mb-3"><i className="fa-solid fa-crown"></i> 獲得榜單登錄資格！</h3><input type="text" value={playerName} onChange={e => {setPlayerName(e.target.value); setNameError('');}} placeholder="輸入英雄姓名" className="w-full p-3 rounded-xl border-2 border-yellow-300 outline-none focus:border-yellow-500 text-center mb-2 font-bold" onKeyDown={e => e.key === 'Enter' && submitToLeaderboard()} />{nameError && <p className="text-red-500 text-sm mb-3 font-bold">{nameError}</p>}<button onClick={submitToLeaderboard} className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 font-black rounded-xl shadow-md hover:scale-105">留名榮譽榜</button></div>) : scoreSaved ? (<div className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold border border-emerald-200"><i className="fa-solid fa-circle-check text-xl"></i> 成績已上傳！</div>) : null}<button onClick={onBack} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">返回大廳</button></div></div>;
    return (
        <div className="flex-1 flex flex-col w-full no-select"><header className="flex items-center p-4 bg-white shadow-sm z-10 w-full border-b"><button onClick={onBack} className="flex items-center text-slate-500 hover:text-pink-500"><i className="fa-solid fa-chevron-left text-xl"></i><span className="font-semibold ml-1">退出遊戲</span></button><h1 className="flex-1 text-center font-bold text-lg text-slate-800">拖曳拼字</h1><div className="w-24 text-right text-sm font-semibold text-slate-400">剩餘 {queue.length} 字</div></header>
        <main className="flex-1 flex flex-col items-center justify-center p-4 w-full bg-slate-50/50"><div className="w-full max-w-3xl flex flex-col items-center"><div className="text-center mb-6"><h2 className="text-3xl sm:text-4xl font-bold text-slate-700 mb-2">{currentWord?.zh}</h2><div className="flex justify-center gap-1 text-red-500 mb-4 text-xl">{[...Array(5)].map((_, i) => <i key={i} className={`fa-solid fa-heart ${i < questionLives ? 'animate-pulse' : 'text-slate-200'}`}></i>)}</div><button onClick={() => playAudio(currentWord?.en)} className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl shadow-md hover:bg-blue-200 hover:scale-105 transition-all"><i className="fa-solid fa-volume-high"></i></button></div><div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 min-h-[80px]">{slots.map((slot, index) => (<div key={`slot-${index}`} data-slot-index={index} onDragOver={handleHtmlDragOver} onDrop={(e) => handleHtmlDrop(e, index)} className={`w-14 h-16 sm:w-20 sm:h-24 rounded-xl sm:rounded-2xl border-4 flex items-center justify-center text-3xl sm:text-5xl font-black uppercase transition-colors ${slot ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 border-slate-300 border-dashed text-transparent'}`}>{slot ? slot.char : '?'}</div>))}</div><div className="w-full bg-white p-6 rounded-3xl shadow-lg border border-slate-100 min-h-[160px] relative overflow-hidden">{feedback && (<div className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm ${feedback === 'correct' ? 'bg-emerald-50/90' : 'bg-red-50/90'}`}>{feedback === 'correct' ? <div className="text-emerald-600 font-bold text-3xl text-center"><i className="fa-solid fa-check text-5xl mb-2"></i><br/>答對了！</div> : <div className="text-center"><p className="text-red-600 font-bold text-2xl mb-2"><i className="fa-solid fa-heart-crack mb-2 text-4xl"></i><br/>愛心耗盡！</p><p className="text-lg text-slate-800">正確答案：<span className="font-bold text-2xl ml-2 text-red-600 border-b-2 border-red-400">{currentWord?.en}</span></p></div>}</div>)}<div className="flex flex-wrap justify-center gap-3 sm:gap-5">{letters.map((letter) => (<div key={letter.id} id={letter.id} draggable={!letter.isPlaced && !feedback} onClick={() => handleLetterClick(letter)} onTouchStart={(e) => handleTouchStart(e, letter)} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onDragStart={(e) => handleHtmlDragStart(e, letter)} onDragEnd={handleHtmlDragEnd} className={`w-14 h-16 sm:w-20 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-5xl font-black uppercase shadow-md transition-all touch-none select-none ${letter.isPlaced ? 'opacity-0 scale-50 pointer-events-none' : 'bg-gradient-to-b from-pink-400 to-pink-600 text-white cursor-pointer hover:-translate-y-1 hover:shadow-xl'}${dragState?.item.id === letter.id ? ' opacity-50' : ''}`}>{letter.char}</div>))}</div></div></div></main>{dragState && dragState.isDragging && (<div className="fixed w-14 h-16 sm:w-20 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-5xl font-black uppercase shadow-2xl bg-gradient-to-b from-pink-400 to-pink-600 text-white z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 opacity-90 scale-110" style={{ left: dragState.x, top: dragState.y }}>{dragState.item.char}</div>)}<style dangerouslySetInnerHTML={{__html: `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px) rotate(-3deg); } 50% { transform: translateX(8px) rotate(3deg); } 75% { transform: translateX(-8px) rotate(-3deg); } }`}} /></div>
    );
}

function LeaderboardView({ onBack, leaderboards, groupedUnits }) {
    const availableBooks = Object.keys(groupedUnits).sort((a,b)=>a-b);
    const [selectedBook, setSelectedBook] = useState('ABC'); 
    const [viewWeek, setViewWeek] = useState(getWeekNumber());

    const renderModeTable = (modeKey, modeName, icon, colorClass, bgClass) => {
        const ranks = (leaderboards || [])
            .filter(l => l?.book == selectedBook && l?.week === viewWeek && l?.mode === modeKey)
            .sort((a, b) => {
                if ((b?.score || 0) !== (a?.score || 0)) return (b?.score || 0) - (a?.score || 0);
                return (a?.time || 0) - (b?.time || 0);
            })
            .slice(0, 10);

        return (
            <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col h-full min-w-[280px]">
                <div className={`p-4 border-b flex items-center gap-3 ${bgClass}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/50 ${colorClass}`}><i className={`${icon} text-lg`}></i></div>
                    <h3 className={`font-black text-lg ${colorClass}`}>{modeName}</h3>
                </div>
                {ranks.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 flex-1 flex flex-col justify-center"><i className="fa-solid fa-ghost text-4xl mb-2 opacity-30"></i><p className="text-sm">尚無挑戰者</p></div>
                ) : (
                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-left text-sm">
                            <tbody>
                                {ranks.map((r, idx) => (
                                    <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="py-2 pl-2 font-black">{idx === 0 ? <span className="text-yellow-500"><i className="fa-solid fa-trophy"></i> 1</span> : idx+1}</td>
                                        <td className="py-2 font-bold truncate max-w-[100px]">{r?.name}</td>
                                        <td className="py-2 text-emerald-600 font-bold text-center">{r?.score} 題</td>
                                        <td className="py-2 pr-2 text-right text-slate-400 font-mono text-xs">{r?.time ? `${r.time}秒` : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )
    };

    return (
        <div className="flex-1 flex flex-col p-4 sm:p-6 w-full max-w-7xl mx-auto">
            <header className="mb-6"><button onClick={onBack} className="text-slate-500 hover:text-blue-600 font-bold"><i className="fa-solid fa-chevron-left"></i> 返回大廳</button></header>
            <div className="w-full bg-slate-50 rounded-3xl shadow-lg p-6 border">
                <div className="text-center mb-6"><h2 className="text-3xl font-black text-yellow-600 mb-2"><i className="fa-solid fa-crown"></i> 全校榮譽榜</h2></div>
                <div className="flex justify-center items-center gap-4 mb-8">
                    <button onClick={() => setViewWeek(w => w - 1)} className="p-2 rounded-full bg-white shadow"><i className="fa-solid fa-caret-left"></i></button>
                    <div className="font-bold text-lg px-6 py-2 bg-white rounded-xl shadow-sm">第 {viewWeek} 週榜單</div>
                    <button onClick={() => setViewWeek(w => w + 1)} disabled={viewWeek >= getWeekNumber()} className="p-2 rounded-full bg-white shadow disabled:opacity-30"><i className="fa-solid fa-caret-right"></i></button>
                </div>
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    <button onClick={()=>setSelectedBook('ABC')} className={`px-6 py-2 rounded-full font-bold border-2 ${selectedBook === 'ABC' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 hover:border-slate-400'}`}>ABC 大小寫</button>
                    {availableBooks.filter(b => b !== 'ABC').map(b => (
                        <button key={b} onClick={()=>setSelectedBook(b)} className={`px-6 py-2 rounded-full font-bold border-2 ${selectedBook == b ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 hover:border-slate-400'}`}>第 {b} 冊</button>
                    ))}
                </div>
                {selectedBook === 'ABC' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center max-w-md mx-auto">
                        {renderModeTable('meteor-abc', '大小寫防衛戰', 'fa-solid fa-font', 'text-amber-600', 'bg-amber-50')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderModeTable('meteor-zh-en', '隕石戰(中選英)', 'fa-solid fa-meteor', 'text-indigo-600', 'bg-indigo-50')}
                        {renderModeTable('meteor-en-zh', '隕石戰(英選中)', 'fa-solid fa-meteor', 'text-emerald-600', 'bg-emerald-50')}
                        {renderModeTable('spelling', '拖曳拼字', 'fa-solid fa-puzzle-piece', 'text-pink-600', 'bg-pink-50')}
                        {renderModeTable('zh-en', '中翻英打字', 'fa-solid fa-keyboard', 'text-blue-600', 'bg-blue-50')}
                        {renderModeTable('en-zh', '英翻中打字', 'fa-solid fa-language', 'text-teal-600', 'bg-teal-50')}
                        {renderModeTable('listening', '聽力測驗', 'fa-solid fa-volume-high', 'text-purple-600', 'bg-purple-50')}
                    </div>
                )}
            </div>
        </div>
    );
}

function StandardQuiz({ mode, onBack, settings, wordDatabase, qualifyingBook, onSaveScore }) {
    const [queue, setQueue] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [inputVal, setInputVal] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [hasStarted, setHasStarted] = useState(false); 
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });
    const inputRef = useRef(null);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [nameError, setNameError] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);

    useEffect(() => { let filtered = wordDatabase.filter(w => settings.selectedUnits.includes(`${w.book}-${w.lesson}`)); let shuffled = [...filtered].sort(() => 0.5 - Math.random()); if (settings.count !== 'all') shuffled = shuffled.slice(0, parseInt(settings.count, 10)); setQueue(shuffled); setCurrentQuestion(shuffled[0]); }, [settings, wordDatabase, mode]);
    useEffect(() => { if (hasStarted && mode === 'listening' && currentQuestion && !isFinished) setTimeout(() => playAudio(currentQuestion.en), 300); }, [currentQuestion, hasStarted, mode, isFinished]);
    const handleStart = () => { if (queue.length === 0) { alert("此範圍無題目！"); return onBack(); } if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setHasStarted(true); setStartTime(Date.now()); };
    const handleSubmit = (e) => { e?.preventDefault(); if (!inputVal.trim() || feedback) return; let isCorrect = false; const ans = inputVal.trim().toLowerCase(); if (mode === 'zh-en' || mode === 'listening' || mode === 'hard') isCorrect = (ans === currentQuestion.en.toLowerCase()); else if (mode === 'en-zh') isCorrect = ans.split(/[、,，/]/).map(w=>w.trim()).some(u => currentQuestion.zh.split(/[、,，/]/).map(w=>w.trim()).includes(u)); if (isCorrect) { setFeedback('correct'); setStats(s => ({ ...s, correct: s.correct + 1 })); soundEngine.correct(); setTimeout(() => moveToNext(true), 1000); } else { setFeedback('incorrect'); setStats(s => ({ ...s, wrong: s.wrong + 1 })); soundEngine.wrong(); setTimeout(() => moveToNext(false), 2000); } };
    const moveToNext = (wasCorrect) => { setFeedback(null); setInputVal(''); inputRef.current?.focus(); const newQ = [...queue]; const curr = newQ.shift(); if (!wasCorrect) newQ.push(curr); if (newQ.length > 0) { setQueue(newQ); setCurrentQuestion(newQ[0]); } else { setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); setIsFinished(true); soundEngine.win(); } };
    const submitToLeaderboard = () => { if (!isValidName(playerName)) { setNameError('請輸入正確的姓名格式'); return; } if (containsProfanity(playerName)) { setNameError('請勿使用不雅字眼'); return; } onSaveScore({ book: qualifyingBook, mode: mode, name: playerName.trim(), score: stats.correct, time: elapsedTime, week: getWeekNumber(), timestamp: Date.now() }); setScoreSaved(true); };

    if (!hasStarted) return <div className="flex-1 flex flex-col items-center justify-center p-6"><div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"><button onClick={handleStart} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105">開始測驗</button><button onClick={onBack} className="w-full mt-4 text-slate-500 font-semibold">取消</button></div></div>;
    if (isFinished) return <div className="flex-1 flex flex-col items-center justify-center p-6"><div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center relative"><i className="fa-solid fa-trophy text-yellow-400 mb-6 text-6xl"></i><h2 className="text-3xl font-bold mb-2">測驗完成！</h2><p className="mb-6">花費了 <span className="font-bold text-blue-600">{elapsedTime} 秒</span></p><div className="flex justify-center gap-8 mb-8"><div><div className="text-4xl font-black text-emerald-500">{stats.correct}</div><div className="text-sm font-bold text-slate-400 mt-1">答對</div></div><div><div className="text-4xl font-black text-red-400">{stats.wrong}</div><div className="text-sm font-bold text-slate-400 mt-1">重答</div></div></div>{qualifyingBook !== null && !scoreSaved ? (<div className="mt-4 mb-8 p-5 bg-yellow-50 rounded-2xl border border-yellow-300"><input type="text" value={playerName} onChange={e => {setPlayerName(e.target.value); setNameError('');}} placeholder="輸入英雄姓名" className="w-full p-3 rounded-xl border-2 border-yellow-300 text-center mb-2 font-bold" onKeyDown={e => e.key === 'Enter' && submitToLeaderboard()} /><button onClick={submitToLeaderboard} className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 font-black rounded-xl shadow-md">留名榮譽榜</button></div>) : scoreSaved ? (<div className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold border"><i className="fa-solid fa-circle-check"></i> 成績已上傳！</div>) : null}<button onClick={onBack} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold">返回大廳</button></div></div>;
    return <div className="flex-1 flex flex-col relative w-full"><header className="flex items-center p-4 bg-white shadow-sm z-10 w-full"><button onClick={onBack} className="text-slate-500 hover:text-blue-600"><i className="fa-solid fa-chevron-left"></i> 返回</button><h1 className="flex-1 text-center font-bold text-lg">{mode==='zh-en'?'中翻英':mode==='en-zh'?'英翻中':mode==='listening'?'聽力':'測驗'}</h1><div className="w-16"></div></header><main className="flex-1 flex flex-col items-center justify-center p-4 w-full">{currentQuestion && (<div className="w-full max-w-2xl"><div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[400px] border"><div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-b">{mode === 'zh-en' || mode === 'hard' ? <h2 className="text-5xl font-bold text-center">{currentQuestion.zh}</h2> : mode === 'en-zh' ? <h2 className="text-5xl font-bold text-center">{currentQuestion.en}</h2> : mode === 'listening' ? <button onClick={() => playAudio(currentQuestion.en)} className="p-8 bg-blue-100 text-blue-600 rounded-full shadow-sm hover:scale-105"><i className="fa-solid fa-volume-high text-6xl"></i></button> : null}</div><div className="p-8 relative">{feedback && (<div className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm ${feedback === 'correct' ? 'bg-emerald-50/90' : 'bg-red-50/90'}`}>{feedback === 'correct' ? <div className="text-emerald-600 font-bold text-3xl text-center"><i className="fa-solid fa-check text-5xl mb-2"></i><br/>答對了！</div> : <div className="text-center"><p className="text-red-600 font-bold text-2xl mb-2">再試一次！</p><p className="text-lg">開牌正確答案：<span className="font-bold text-2xl ml-2 text-red-600 border-b-2 border-red-400">{mode === 'en-zh' ? currentQuestion.zh : currentQuestion.en}</span></p></div>}</div>)}<form onSubmit={handleSubmit} className="flex gap-4"><input ref={inputRef} type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="請輸入答案..." className="flex-1 text-2xl p-4 bg-slate-100 border-2 focus:border-blue-400 rounded-xl outline-none text-center font-medium" autoFocus disabled={feedback !== null} autoComplete="off" /><button type="submit" disabled={!inputVal.trim() || feedback !== null} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold disabled:bg-slate-300"><i className="fa-solid fa-paper-plane text-2xl"></i></button></form></div></div></div>)}</main></div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
