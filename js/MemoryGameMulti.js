const { useState, useEffect, useCallback, useRef } = React;

function MemoryGameMulti({ onBack, settings, wordDatabase, dbRef, user }) {
    const [gameState, setGameState] = useState(null);
    const [myTeam, setMyTeam] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null); // 用於「手動指定」功能卡目標
    const [lang, setLang] = useState('zh-TW');

    // 字典檔
    const dict = {
        'zh-TW': { waiting: '等待對手...', turn: '輪到 %team% 回合', locked: '已鎖定', frozen: '冰凍中' },
        'en': { waiting: 'Waiting for players...', turn: '%team%\'s turn', locked: 'Locked', frozen: 'Frozen' }
    };
    const t = dict[lang];

    // 初始化/監聽遊戲狀態 (與隕石對戰同架構，共用同個房間)
    useEffect(() => {
        if (!dbRef || !settings.roomId) return;
        const unsubscribe = dbRef.collection('rooms').doc(settings.roomId).onSnapshot(doc => {
            if (doc.exists) setGameState(doc.data());
        });
        return () => unsubscribe();
    }, [dbRef, settings.roomId]);

    // 核心翻牌邏輯 (多人同步)
    const handleCardClick = async (cardIndex) => {
        if (!gameState || !isMyTurn()) return;
        
        const roomRef = dbRef.collection('rooms').doc(settings.roomId);
        // 只有執行配對/翻牌才寫入資料庫
        // 此處邏輯會由「當前操作者」計算後更新 gameState
        // 包含：檢查是否為連段中的第二次翻牌、檢查是否觸發特殊卡、更新 Firebase
    };

    const isMyTurn = () => {
        if (!gameState) return false;
        return gameState.currentTeam === gameState.players[user.uid].team;
    };

    // 介面渲染
    return (
        <div className="flex-1 bg-slate-900 p-4 text-white overflow-hidden">
            <header className="flex justify-between items-center mb-4">
                <button onClick={onBack} className="px-4 py-2 bg-slate-700 rounded-lg">Back</button>
                <h2 className="text-xl font-black">{t.turn.replace('%team%', gameState?.currentTeam || '...')}</h2>
            </header>

            {/* 盤面渲染區：預留 4x10 的彈性空間，目前視 settings 渲染 */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {/* 卡牌渲染 */}
            </div>
            
            {/* 特殊卡選擇器：當翻到冰凍/上鎖/雙贏卡時，覆蓋全螢幕讓玩家選擇目標 */}
            {selectedCard && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="bg-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">Select Target...</h3>
                        {/* 這裡會列出其他隊伍或卡牌供點選 */}
                    </div>
                </div>
            )}
        </div>
    );
}

// 輔助函式：發送 Firebase 更新 (減少讀取消耗)
async function syncGameState(ref, newState) {
    // 嚴格限制：只在關鍵操作發生時更新，避免無意義的讀寫
    await ref.update(newState);
}
