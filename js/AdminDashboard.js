const { useState, useEffect, useRef } = React;

function AdminDashboard({ onBack, dbRef, lang = 'zh-TW', setLang }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [activeTab, setActiveTab] = useState('rooms'); // 可切換分頁: 'rooms', 'scores', 'snapshot'
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 資料儲存狀態
    const [rooms, setRooms] = useState([]);
    const [scores, setScores] = useState([]);
    const [targetWeek, setTargetWeek] = useState(() => {
        const getWeekSafe = typeof window.getWeekNumber === 'function' ? window.getWeekNumber() : 0;
        return getWeekSafe > 1 ? getWeekSafe - 1 : 1; // 預設帶入上一週的週次
    });

    const dict = {
        'zh-TW': {
            adminLogin: '管理員登入',
            pwdPlaceholder: '請輸入授權密碼',
            login: '登入',
            wrongPwd: '密碼錯誤，存取被拒。',
            tabRooms: '幽靈房間管理',
            tabScores: '異常分數管理',
            tabSnapshot: '歷史快照封存',
            refresh: '重新整理',
            delete: '刪除',
            confirmDelete: '確定要刪除嗎？此操作無法復原。',
            noData: '目前沒有資料',
            roomCode: '房號',
            host: '房主',
            status: '狀態',
            player: '玩家',
            score: '分數',
            mode: '模式',
            packSnapshot: '打包並封存當週快照',
            snapshotWarning: '這將會把該週所有成績打包成 1 個 JSON 檔案，並清除原始資料以節省空間。確定執行？',
            packSuccess: '快照封存成功！原始資料已清理。'
        },
        'en': {
            adminLogin: 'Admin Login',
            pwdPlaceholder: 'Enter authorization code',
            login: 'Login',
            wrongPwd: 'Password incorrect, access denied.',
            tabRooms: 'Ghost Rooms',
            tabScores: 'Manage Scores',
            tabSnapshot: 'History Snapshots',
            refresh: 'Refresh',
            delete: 'Delete',
            confirmDelete: 'Are you sure? This cannot be undone.',
            noData: 'No data available',
            roomCode: 'Code',
            host: 'Host',
            status: 'Status',
            player: 'Player',
            score: 'Score',
            mode: 'Mode',
            packSnapshot: 'Pack & Archive Snapshot',
            snapshotWarning: 'This will pack all scores of the selected week into a single JSON file and delete the raw data. Proceed?',
            packSuccess: 'Snapshot packed successfully! Raw data cleared.'
        }
    };
    const t = dict[lang] || dict['zh-TW'];

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === 'wt7902230') setIsAuthenticated(true);
        else showMessage(t.wrongPwd, 'error');
    };

    // ── 1. 幽靈房間管理與統計 ──
    const fetchRooms = async () => {
        if (!dbRef) return;
        setLoading(true);
        try {
            const snap = await dbRef.collection('rooms').get();
            setRooms(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const deleteRoom = async (id) => {
        if (!window.confirm(t.confirmDelete)) return;
        await dbRef.collection('rooms').doc(id).delete();
        setRooms(prev => prev.filter(r => r.id !== id));
        showMessage('房間已刪除');
    };

    const clearGhostRooms = async () => {
        if (!window.confirm('確定要一鍵清除所有「已結束 (finished)」與「等待中 (waiting)」的房間嗎？')) return;
        setLoading(true);
        try {
            const batch = dbRef.batch();
            const ghosts = rooms.filter(r => r.status === 'finished' || r.status === 'waiting');
            ghosts.forEach(room => {
                batch.delete(dbRef.collection('rooms').doc(room.id));
            });
            await batch.commit();
            setRooms(prev => prev.filter(r => r.status === 'playing'));
            showMessage(`大掃除完成！共清除了 ${ghosts.length} 個幽靈房間。`);
        } catch (e) {
            console.error(e);
            showMessage('清除失敗', 'error');
        }
        setLoading(false);
    };

    // ── 2. 異常分數管理 ──
    const fetchScores = async () => {
        if (!dbRef) return;
        setLoading(true);
        try {
            const snap = await dbRef.collection('leaderboard').orderBy('score', 'desc').limit(50).get();
            setScores(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const deleteScore = async (id) => {
        if (!window.confirm(t.confirmDelete)) return;
        await dbRef.collection('leaderboard').doc(id).delete();
        setScores(prev => prev.filter(s => s.id !== id));
        showMessage('成績已刪除');
    };

    // ── 3. 歷史快照打包 (核心省流機制，多文件縮減至單一文件) ──
    const createSnapshot = async () => {
        if (!window.confirm(t.snapshotWarning)) return;
        setLoading(true);
        try {
            const snap = await dbRef.collection('leaderboard').where('week', '==', parseInt(targetWeek)).get();
            if (snap.empty) {
                showMessage('該週沒有任何成績資料可以打包', 'error');
                setLoading(false);
                return;
            }

            // 分組並依最高分進行排序
            const grouped = {};
            snap.docs.forEach(doc => {
                const d = doc.data();
                const key = `${d.book}_${d.mode}`;
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push({ id: doc.id, ...d });
            });

            // 進行 Top 10 篩選
            const snapshotData = {};
            Object.keys(grouped).forEach(key => {
                snapshotData[key] = grouped[key]
                    .sort((a, b) => b.score - a.score || a.time - b.time)
                    .slice(0, 10);
            });

            // 以單一 JSON 字串寫入封存節點
            await dbRef.collection('history').doc(`week_${targetWeek}`).set({
                week: parseInt(targetWeek),
                data: JSON.stringify(snapshotData),
                createdAt: Date.now()
            });

            // 執行批次原子刪除，徹底釋放主集合空間
            const batch = dbRef.batch();
            snap.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();

            showMessage(t.packSuccess);
        } catch (e) {
            console.error('快照打包失敗', e);
            showMessage('快照打包發生錯誤', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'rooms') fetchRooms();
            if (activeTab === 'scores') fetchScores();
        }
    }, [activeTab, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm text-center">
                    <i className="fa-solid fa-user-secret text-6xl text-purple-500 mb-6"></i>
                    <h2 className="text-2xl font-black text-white mb-6">{t.adminLogin}</h2>
                    <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder={t.pwdPlaceholder} className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-600 text-white mb-4 text-center tracking-[0.5em]" autoFocus />
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-colors">{t.login}</button>
                    {message.text && <p className="text-red-400 mt-4 font-bold">{message.text}</p>}
                    <button type="button" onClick={onBack} className="text-slate-500 mt-6 text-sm underline underline-offset-4">返回大廳</button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-8 flex flex-col">
            <header className="flex justify-between items-center mb-8 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-600"><i className="fa-solid fa-arrow-left"></i></button>
                    <h1 className="text-2xl font-black text-purple-400"><i className="fa-solid fa-server mr-2"></i>霧臺國小 管理後台</h1>
                </div>
                {message.text && <span className={`font-bold px-4 py-2 rounded-full text-sm animate-pulse ${message.type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-emerald-900/50 text-emerald-400'}`}>{message.text}</span>}
            </header>

            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                <button onClick={() => setActiveTab('rooms')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'rooms' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}><i className="fa-solid fa-ghost mr-2"></i>{t.tabRooms}</button>
                <button onClick={() => setActiveTab('scores')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'scores' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}><i className="fa-solid fa-list-ol mr-2"></i>{t.tabScores}</button>
                <button onClick={() => setActiveTab('snapshot')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'snapshot' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}><i className="fa-solid fa-box-archive mr-2"></i>{t.tabSnapshot}</button>
            </div>

            <main className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 overflow-hidden flex flex-col">
                {/* 幽靈房間分頁 */}
                {activeTab === 'rooms' && (
                    <div className="flex flex-col h-full">
                        <div className="flex flex-wrap justify-between items-end mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">伺服器房間狀態</h2>
                                <div className="flex gap-3 text-sm font-bold">
                                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg">總數: {rooms.length}</span>
                                    <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-lg">進行中: {rooms.filter(r => r.status === 'playing').length}</span>
                                    <span className="bg-slate-700 text-slate-400 px-3 py-1 rounded-lg">幽靈 (等待/結束): {rooms.filter(r => r.status !== 'playing').length}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={fetchRooms} disabled={loading} className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition-colors">
                                    <i className={`fa-solid fa-rotate-right mr-2 ${loading ? 'fa-spin' : ''}`}></i>{t.refresh}
                                </button>
                                <button onClick={clearGhostRooms} disabled={loading || rooms.filter(r => r.status !== 'playing').length === 0} 
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all disabled:opacity-50 disabled:shadow-none">
                                    <i className="fa-solid fa-broom mr-2"></i>一鍵清除幽靈房間
                                </button>
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar bg-slate-950/50 rounded-xl border border-slate-800">
                            <table className="w-full text-left">
                                <thead className="bg-slate-800 text-slate-400 sticky top-0"><tr><th className="p-3 rounded-tl-lg">ID</th><th className="p-3">{t.roomCode}</th><th className="p-3">{t.status}</th><th className="p-3 rounded-tr-lg">操作</th></tr></thead>
                                <tbody>
                                    {rooms.length === 0 ? <tr><td colSpan="4" className="text-center p-8 text-slate-500">{t.noData}</td></tr> : rooms.map(r => (
                                        <tr key={r.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="p-3 font-mono text-xs text-slate-500">{r.id}</td><td className="p-3 font-bold text-yellow-400">{r.code}</td>
                                            <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'playing' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>{r.status}</span></td>
                                            <td className="p-3"><button onClick={() => deleteRoom(r.id)} className="px-3 py-1 bg-red-900/50 hover:bg-red-600 text-red-200 rounded font-bold transition-colors">{t.delete}</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 異常分數分頁 */}
                {activeTab === 'scores' && (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">最新 50 筆成績</h2>
                            <button onClick={fetchScores} disabled={loading} className="text-slate-400 hover:text-white"><i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i> {t.refresh}</button>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar bg-slate-950/50 rounded-xl border border-slate-800">
                            <table className="w-full text-left">
                                <thead className="bg-slate-800 text-slate-400 sticky top-0"><tr><th className="p-3 rounded-tl-lg">{t.player}</th><th className="p-3">{t.score}</th><th className="p-3">{t.mode}</th><th className="p-3 rounded-tr-lg">操作</th></tr></thead>
                                <tbody>
                                    {scores.length === 0 ? <tr><td colSpan="4" className="text-center p-8 text-slate-500">{t.noData}</td></tr> : scores.map(s => (
                                        <tr key={s.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="p-3 font-bold text-white">{s.name}</td><td className="p-3 font-bold text-emerald-400">{s.score}</td>
                                            <td className="p-3 text-xs text-slate-400">{s.mode} (W{s.week})</td>
                                            <td className="p-3"><button onClick={() => deleteScore(s.id)} className="px-3 py-1 bg-red-900/50 hover:bg-red-600 text-red-200 rounded font-bold transition-colors">{t.delete}</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 快照打包分頁 */}
                {activeTab === 'snapshot' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-lg w-full text-center shadow-2xl">
                            <i className="fa-solid fa-box-archive text-7xl text-indigo-500 mb-6 drop-shadow-lg"></i>
                            <h2 className="text-2xl font-black text-white mb-2">每週歷史快照打包</h2>
                            <p className="text-slate-400 mb-8 text-sm leading-relaxed">將分散的排行榜紀錄壓縮成單一 JSON 檔案，徹底釋放 Firebase 資料庫空間與讀取次數。</p>
                            
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className="font-bold text-slate-300">打包第</span>
                                <input type="number" value={targetWeek} onChange={e => setTargetWeek(e.target.value)} className="w-24 text-center bg-slate-900 border-2 border-indigo-500 text-white font-black text-2xl py-2 rounded-xl outline-none" />
                                <span className="font-bold text-slate-300">週</span>
                            </div>

                            <button onClick={createSnapshot} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-50">
                                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-compress mr-2"></i>{t.packSnapshot}</>}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

window.AdminDashboard = AdminDashboard;
