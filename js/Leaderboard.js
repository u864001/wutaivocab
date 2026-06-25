function LeaderboardView({ onBack, leaderboards, groupedUnits, leaderboardCachedAt, onRefresh }) {
    const { useState, useRef, useEffect } = React; 

    const availableBooks = Object.keys(groupedUnits).sort((a,b)=>a-b);
    const [selectedBook, setSelectedBook] = useState('ABC'); 
    
    const getWeekSafe = typeof window.getWeekNumber === 'function' ? window.getWeekNumber() : 1;
    const [viewWeek, setViewWeek] = useState(getWeekSafe);

    // 🌟 新增：歷史快照狀態
    const [snapshotData, setSnapshotData] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // 🌟 核心修復：自動去倉庫找打包好的 JSON 快照並解壓縮
    useEffect(() => {
        let isMounted = true;
        const fetchHistory = async () => {
            setIsLoadingHistory(true);
            setSnapshotData(null); // 先清空，準備讀取
            try {
                const db = window.firebase.firestore();
                const doc = await db.collection('history').doc(`week_${viewWeek}`).get();
                if (doc.exists && isMounted) {
                    const parsed = JSON.parse(doc.data().data);
                    let flatData = [];
                    // 將打包的物件陣列全部攤平，恢復成排行榜看得懂的格式
                    Object.values(parsed).forEach(arr => { flatData = flatData.concat(arr); });
                    setSnapshotData(flatData);
                }
            } catch(e) {
                console.log("No snapshot found for week", viewWeek);
            }
            if (isMounted) setIsLoadingHistory(false);
        };
        fetchHistory();
        return () => { isMounted = false; };
    }, [viewWeek]);

    const clickCount = useRef(0);
    const clickTimer = useRef(null);
    const handleTitleClick = () => {
        clickCount.current += 1;
        if (clickCount.current >= 5) {
            if (window.navigateToAdmin) window.navigateToAdmin();
            clickCount.current = 0;
        }
        clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 1500);
    };

    const renderModeTable = (modeKey, modeName, icon, colorClass, bgClass) => {
        // 🌟 智慧判斷：如果該週有快照就用快照，沒有才用外面的實時資料
        const activeData = snapshotData ? snapshotData : (leaderboards || []);
        
        const ranks = activeData
            .filter(l => l?.book == selectedBook && l?.week === viewWeek && l?.mode === modeKey)
            .sort((a, b) => {
                if ((b?.score || 0) !== (a?.score || 0)) return (b?.score || 0) - (a?.score || 0);
                return (a?.time || 0) - (b?.time || 0);
            })
            .slice(0, 10);

        return (
            <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col h-full min-w-[280px]">
                <div className={`p-4 border-b flex items-center gap-3 ${bgClass}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/50 ${colorClass}`}>
                        <i className={`${icon} text-lg`}></i>
                    </div>
                    <h3 className={`font-black text-lg ${colorClass}`}>{modeName}</h3>
                </div>
                {ranks.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 flex-1 flex flex-col justify-center">
                        <i className="fa-solid fa-ghost text-4xl mb-2 opacity-30"></i>
                        <p className="text-sm">尚無挑戰者</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-left text-sm">
                            <tbody>
                                {ranks.map((r, idx) => (
                                    <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="py-2 pl-2 font-black">
                                            {idx === 0 ? <span className="text-yellow-500"><i className="fa-solid fa-trophy"></i> 1</span> : idx+1}
                                        </td>
                                        <td className="py-2 font-bold truncate max-w-[100px]">{r?.name || 'Player'}</td>
                                        <td className="py-2 text-emerald-600 font-bold text-center">{r?.score} 分</td>
                                        <td className="py-2 pr-2 text-right text-slate-400 font-mono text-xs">{r?.time ? (r.mode.includes('survival') ? `${Math.floor(r.time/60)}分${r.time%60}秒` : `${r.time}秒`) : ''}</td>
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
            <header className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <button onClick={onBack} className="text-slate-500 hover:text-blue-600 font-bold transition-colors">
                    <i className="fa-solid fa-chevron-left"></i> 返回大廳
                </button>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    {leaderboardCachedAt > 0 && !snapshotData && (
                        <span>上次更新：{Math.round((Date.now() - leaderboardCachedAt) / 60000)} 分鐘前</span>
                    )}
                    {snapshotData && <span className="text-indigo-500 font-bold"><i className="fa-solid fa-box-archive"></i> 讀取歷史快照中</span>}
                    <button onClick={onRefresh}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full font-bold transition-colors border border-slate-200">
                        <i className="fa-solid fa-rotate-right text-xs"></i> 重新整理
                    </button>
                </div>
            </header>
            
            <div className="w-full bg-slate-50 rounded-3xl shadow-lg p-6 border">
                <div className="text-center mb-6">
                    <h2 onClick={handleTitleClick} className="text-3xl font-black text-yellow-600 mb-2 cursor-pointer select-none transition-transform active:scale-95 inline-block">
                        <i className="fa-solid fa-crown"></i> 全校榮譽榜
                    </h2>
                </div>

                <div className="flex justify-center items-center gap-4 mb-8">
                    <button onClick={() => setViewWeek(w => w - 1)} className="p-2 rounded-full bg-white shadow hover:bg-slate-50 transition-colors">
                        <i className="fa-solid fa-caret-left"></i>
                    </button>
                    <div className="font-bold text-lg px-6 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                        第 {viewWeek} 週榜單
                    </div>
                    <button onClick={() => setViewWeek(w => w + 1)} disabled={viewWeek >= getWeekSafe} className="p-2 rounded-full bg-white shadow hover:bg-slate-50 disabled:opacity-30 transition-colors">
                        <i className="fa-solid fa-caret-right"></i>
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    <button onClick={()=>setSelectedBook('ABC')} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${selectedBook === 'ABC' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 hover:border-slate-400'}`}>ABC 大小寫</button>
                    {availableBooks.filter(b => b !== 'ABC').map(b => (
                        <button key={b} onClick={()=>setSelectedBook(b)} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${selectedBook == b ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 hover:border-slate-400'}`}>第 {b} 冊</button>
                    ))}
                </div>

                {isLoadingHistory ? (
                    <div className="flex flex-col items-center justify-center p-12 text-indigo-400">
                        <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i>
                        <p className="font-bold tracking-widest">解壓縮快照檔案中...</p>
                    </div>
                ) : selectedBook === 'ABC' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center max-w-md mx-auto">
                        {renderModeTable('meteor-abc', '大小寫防衛戰', 'fa-solid fa-font', 'text-amber-600', 'bg-amber-50')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {renderModeTable('meteor-zh-en', '隕石戰(中選英)', 'fa-solid fa-meteor', 'text-indigo-600', 'bg-indigo-50')}
                        {renderModeTable('meteor-en-zh', '隕石戰(英選中)', 'fa-solid fa-meteor', 'text-emerald-600', 'bg-emerald-50')}
                        {renderModeTable('memory_single', '記憶翻牌', 'fa-solid fa-clone', 'text-cyan-600', 'bg-cyan-50')}
                        
                        {/* 🌟 貪食蛇：一般與生存雙模式掛載 */}
                        {renderModeTable('snake_normal', '貪食蛇(一般)', 'fa-solid fa-staff-snake', 'text-green-600', 'bg-green-50')}
                        {renderModeTable('snake_survival', '貪食蛇(生存)', 'fa-solid fa-fire', 'text-red-600', 'bg-red-50')}
                        
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

window.LeaderboardView = LeaderboardView;
