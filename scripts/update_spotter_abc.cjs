const fs = require('fs');

console.log('--- UPDATING VOCAB SPOTTER GAME FOR ALPHABET MODE ---');

let spotter = fs.readFileSync('src/games/spotter/VocabSpotterGame.jsx', 'utf8');

if (!spotter.includes('generateSpotterAlphabetRound')) {
  // 1. Add import
  spotter = spotter.replace(
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';",
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';\r\nimport { generateSpotterAlphabetRound } from '../../services/alphabetEngine';"
  ).replace(
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';",
    "import { HonorSubmissionCard } from '../../components/HonorSubmissionCard';\nimport { generateSpotterAlphabetRound } from '../../services/alphabetEngine';"
  );

  // 2. Add isAlphabetMode & alphaRoundData
  spotter = spotter.replace(
    "  const currentScene = SPOTTER_SCENES_BY_BOOK[selectedBook] || SPOTTER_SCENES_BY_BOOK['1'];",
    `  // 低年級 Aa 字母模式判斷
  const isAlphabetMode = useMemo(() => {
    return qualifyingBook === 'abc' ||
      (settings?.selectedUnits && settings.selectedUnits.includes('abc')) ||
      settings?.alphaMode;
  }, [qualifyingBook, settings]);

  const currentScene = SPOTTER_SCENES_BY_BOOK[selectedBook] || SPOTTER_SCENES_BY_BOOK['1'];`
  );

  spotter = spotter.replace(
    "  const { activeDifferences, itemStateMap, wordBankOptions, totalCount } = roundData;",
    `  const alphaRoundData = useMemo(() => {
    return isAlphabetMode ? generateSpotterAlphabetRound(6, 3, currentStudent?.grade || '01') : null;
  }, [isAlphabetMode, roundSeed, currentStudent?.grade]);

  const { activeDifferences, itemStateMap, wordBankOptions, totalCount } = isAlphabetMode
    ? { activeDifferences: alphaRoundData?.differences || [], itemStateMap: {}, wordBankOptions: [], totalCount: 3 }
    : roundData;`
  );

  // 3. Add handleAlphabetBlockClick
  const alphaClickHandler = `  // 點擊字母積木處理 (低年級找碴模式)
  const handleAlphabetBlockClick = (block) => {
    if (gameState !== 'playing' || !alphaRoundData) return;

    if (block.isDifference) {
      if (solvedDiffIds.has(block.diffId)) return;
      const newSolved = new Set(solvedDiffIds);
      newSolved.add(block.diffId);
      setSolvedDiffIds(newSolved);
      soundEngine.correct();

      const diffObj = alphaRoundData.differences.find(d => d.id === block.diffId);
      setMatchSuccessFeedback({
        word: block.char,
        wordZh: diffObj?.reason || '積木差異',
        solvedCount: newSolved.size,
        total: alphaRoundData.totalDiffs
      });
      setTimeout(() => setMatchSuccessFeedback(null), 2500);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}

      if (newSolved.size >= alphaRoundData.totalDiffs) {
        setGameState('victory');
        soundEngine.win();
        setTimeout(() => {
          try {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
          } catch (e) {}
        }, 300);
      }
    } else {
      deductLife('❌ 這裡兩邊積木完全一樣喔！請再仔細觀察其他字母～');
    }
  };
`;

  spotter = spotter.replace(
    "  // 點擊命中相異目標\r\n  const handleDifferenceClicked = (diffId, clickPos) => {",
    alphaClickHandler + "\r\n  // 點擊命中相異目標\r\n  const handleDifferenceClicked = (diffId, clickPos) => {"
  ).replace(
    "  // 點擊命中相異目標\n  const handleDifferenceClicked = (diffId, clickPos) => {",
    alphaClickHandler + "\n  // 點擊命中相異目標\n  const handleDifferenceClicked = (diffId, clickPos) => {"
  );

  // 4. Update the main gameplay display
  const oldMainScene = `      {/* ── 雙圖畫卷核心區域 (左圖與右圖對照) ── */}
      <div className={\`grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 transition-transform \${shakeScene ? 'animate-headShake' : ''}\`}>
        {/* 左圖 */}
        <SpotterScene
          scene={currentScene}
          itemStateMap={itemStateMap}
          activeDifferences={activeDifferences}
          isLeft={true}
          spotlightDiffId={spotlightDiffId}
          solvedDiffIds={solvedDiffIds}
          onDifferenceClicked={handleDifferenceClicked}
          onMissClicked={handleMissClicked}
          missRipples={missRipples}
          isInspectMode={isInspectMode}
          zoomLevel={2.2}
          pan={pan}
          onPanChange={setPan}
          hintDiffId={hintDiffId}
        />

        {/* 右圖 */}
        <SpotterScene
          scene={currentScene}
          itemStateMap={itemStateMap}
          activeDifferences={activeDifferences}
          isLeft={false}
          spotlightDiffId={spotlightDiffId}
          solvedDiffIds={solvedDiffIds}
          onDifferenceClicked={handleDifferenceClicked}
          onMissClicked={handleMissClicked}
          missRipples={missRipples}
          isInspectMode={isInspectMode}
          zoomLevel={2.2}
          pan={pan}
          onPanChange={setPan}
          hintDiffId={hintDiffId}
        />
      </div>

      {/* ── 下方單字庫 (Word Bank) ── */}
      <SpotterWordBank
        spotlightDiff={activeSpotlightDiff}
        wordOptions={wordBankOptions}
        activeDifferences={activeDifferences}
        solvedDiffIds={solvedDiffIds}
        onWordMatchSuccess={handleWordMatchSuccess}
        onWordMatchFail={handleWordMatchFail}
      />`;

  const newMainScene = `      {/* ── 核心比對遊戲區：字母散落積木模式 vs 中高年級畫卷模式 ── */}
      {isAlphabetMode && alphaRoundData ? (
        <div className={\`space-y-4 transition-transform \${shakeScene ? 'animate-headShake' : ''}\`}>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-center text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200">
            {alphaRoundData.promptZh}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
            {/* 左托盤 */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-black text-amber-500 mb-1.5 flex items-center gap-1.5">
                <span>🪵 左石板托盤 (基準)</span>
              </div>
              <div className="relative w-full aspect-[4/3] rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 p-4 overflow-hidden shadow-2xl backdrop-blur-md">
                {alphaRoundData.leftBlocks.map((block) => {
                  const isSolved = block.diffId && solvedDiffIds.has(block.diffId);
                  return (
                    <button
                      key={block.id}
                      onClick={() => handleAlphabetBlockClick(block)}
                      style={{
                        left: \`\${block.x}%\`,
                        top: \`\${block.y}%\`,
                        color: block.color,
                        fontFamily: block.font,
                        fontSize: \`\${block.fontSize}px\`,
                        transform: \`translate(-50%, -50%) rotate(\${block.rotation}deg)\`
                      }}
                      className={\`absolute font-black select-none transition-transform cursor-pointer hover:scale-110 active:scale-95 \${
                        isSolved ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 rounded-xl animate-pulse' : ''
                      }\`}
                    >
                      {block.char}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 右托盤 */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-black text-amber-500 mb-1.5 flex items-center gap-1.5">
                <span>🪵 右石板托盤 (比對)</span>
              </div>
              <div className="relative w-full aspect-[4/3] rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 p-4 overflow-hidden shadow-2xl backdrop-blur-md">
                {alphaRoundData.rightBlocks.map((block) => {
                  if (block.isVisible === false) return null;
                  const isSolved = block.diffId && solvedDiffIds.has(block.diffId);
                  return (
                    <button
                      key={block.id}
                      onClick={() => handleAlphabetBlockClick(block)}
                      style={{
                        left: \`\${block.x}%\`,
                        top: \`\${block.y}%\`,
                        color: block.color,
                        fontFamily: block.font,
                        fontSize: \`\${block.fontSize}px\`,
                        transform: \`translate(-50%, -50%) rotate(\${block.rotation}deg)\`
                      }}
                      className={\`absolute font-black select-none transition-transform cursor-pointer hover:scale-110 active:scale-95 \${
                        isSolved ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 rounded-xl animate-pulse' : ''
                      }\`}
                    >
                      {block.char}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={\`grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 transition-transform \${shakeScene ? 'animate-headShake' : ''}\`}>
            {/* 左圖 */}
            <SpotterScene
              scene={currentScene}
              itemStateMap={itemStateMap}
              activeDifferences={activeDifferences}
              isLeft={true}
              spotlightDiffId={spotlightDiffId}
              solvedDiffIds={solvedDiffIds}
              onDifferenceClicked={handleDifferenceClicked}
              onMissClicked={handleMissClicked}
              missRipples={missRipples}
              isInspectMode={isInspectMode}
              zoomLevel={2.2}
              pan={pan}
              onPanChange={setPan}
              hintDiffId={hintDiffId}
            />

            {/* 右圖 */}
            <SpotterScene
              scene={currentScene}
              itemStateMap={itemStateMap}
              activeDifferences={activeDifferences}
              isLeft={false}
              spotlightDiffId={spotlightDiffId}
              solvedDiffIds={solvedDiffIds}
              onDifferenceClicked={handleDifferenceClicked}
              onMissClicked={handleMissClicked}
              missRipples={missRipples}
              isInspectMode={isInspectMode}
              zoomLevel={2.2}
              pan={pan}
              onPanChange={setPan}
              hintDiffId={hintDiffId}
            />
          </div>

          {/* 下方單字庫 (Word Bank) */}
          <SpotterWordBank
            spotlightDiff={activeSpotlightDiff}
            wordOptions={wordBankOptions}
            activeDifferences={activeDifferences}
            solvedDiffIds={solvedDiffIds}
            onWordMatchSuccess={handleWordMatchSuccess}
            onWordMatchFail={handleWordMatchFail}
          />
        </>
      )}`;

  spotter = spotter.replace(oldMainScene, newMainScene)
    .replace(oldMainScene.replace(/\r\n/g, '\n'), newMainScene);

  // 5. Update settlement card
  const oldHonorCard = `              <HonorSubmissionCard
                mode="spotter"
                book={qualifyingBook || '3'}
                score={lives}
                time={Math.round(elapsedMs / 1000)}
                totalCount={totalCount}
                rangeText="第 3 冊 - 鷹眼神探單字找不同"
                reviewWords={activeDifferences.map(d => ({
                  id: d.id,
                  en: d.word,
                  zh: d.wordZh,
                  isMistake: false
                }))}
              />`;

  const newHonorCard = `              <HonorSubmissionCard
                mode={isAlphabetMode ? 'spotter-abc' : 'spotter'}
                book={isAlphabetMode ? 'abc' : (qualifyingBook || selectedBook || '3')}
                score={lives}
                time={Math.round(elapsedMs / 1000)}
                totalCount={isAlphabetMode ? 3 : totalCount}
                rangeText={isAlphabetMode ? 'Aa 字母積木神探找碴' : \`第 \${selectedBook} 冊 - 鷹眼神探單字找不同\`}
                reviewWords={activeDifferences.map(d => ({
                  id: d.id,
                  en: d.word || d.char,
                  zh: d.wordZh || d.reason,
                  isMistake: false
                }))}
              />`;

  spotter = spotter.replace(oldHonorCard, newHonorCard)
    .replace(oldHonorCard.replace(/\r\n/g, '\n'), newHonorCard);

  fs.writeFileSync('src/games/spotter/VocabSpotterGame.jsx', spotter, 'utf8');
  console.log('VocabSpotterGame.jsx successfully updated for Alphabet Mode!');
} else {
  console.log('VocabSpotterGame.jsx already updated.');
}
