const fs = require('fs');

console.log('--- IMPLEMENTING GUEST MODE (999999) ---');

// 1. Update StudentProfileModal.jsx
let modal = fs.readFileSync('src/components/StudentProfileModal.jsx', 'utf8');

// Update handleConfirmLogin for guest
const oldLoginFn = `    const res = await loginStudent({
      grade: selectedGrade,
      classNum: selectedClass,
      seat: selectedSeat,
      nickname: finalNick
    });`;

const newLoginFn = `    const isGuest = selectedGrade === '99';
    if (!finalNick) {
      finalNick = isGuest ? '部落訪客勇士' : getRandomFunNickname();
    }
    const res = await loginStudent({
      grade: selectedGrade,
      classNum: isGuest ? '99' : selectedClass,
      seat: isGuest ? '99' : selectedSeat,
      nickname: finalNick
    });`;

modal = modal.replace(oldLoginFn, newLoginFn)
  .replace(oldLoginFn.replace(/\r\n/g, '\n'), newLoginFn);

// Update Grade button click so selecting '99' automatically sets class and seat to '99'
const oldGradeClick = "onClick={() => setSelectedGrade(g.id)}";
const newGradeClick = `onClick={() => {
                          setSelectedGrade(g.id);
                          if (g.id === '99') {
                            setSelectedClass('99');
                            setSelectedSeat('99');
                          } else if (selectedGrade === '99') {
                            setSelectedClass('01');
                            setSelectedSeat('01');
                          }
                        }}`;

modal = modal.replace(oldGradeClick, newGradeClick);

// Wrap Step 2 (班級) and Step 3 (座號) in {selectedGrade !== '99' ? (...) : (...)}
const oldStep2And3 = `              {/* 步驟 2: 選擇班級 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{t.selectClassLabel}</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    2 碼：{selectedClass}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CLASS_OPTIONS.map((c) => {
                    const isSelected = selectedClass === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSelectedClass(c.id)}
                        className={\`py-2 px-2 rounded-xl text-xs font-black transition-all border \${
                          isSelected
                            ? 'bg-teal-500 text-white border-teal-600 shadow-md scale-102'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }\`}
                      >
                        {c.zh}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 步驟 3: 選擇座號 (1 ~ 35 號快捷宮格) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {t.selectSeatLabel}
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    座號：{parseInt(selectedSeat, 10)} 號 ({selectedSeat})
                  </span>
                </div>
                <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {Array.from({ length: 35 }, (_, i) => {
                      const seatStr = pad2(i + 1);
                      const isSelected = selectedSeat === seatStr;
                      return (
                        <button
                          type="button"
                          key={seatStr}
                          onClick={() => setSelectedSeat(seatStr)}
                          className={\`py-1.5 rounded-lg text-xs font-mono font-black transition-all \${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm scale-105'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                          }\`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>`;

const newStep2And3 = `              {selectedGrade === '99' ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-2 border-amber-400/50 text-center animate-fadeIn shadow-inner">
                  <div className="flex items-center justify-center gap-1.5 text-amber-500 dark:text-amber-400 font-black text-sm mb-1.5">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>✨ 訪客體驗模式（全校 1~8 冊與字母樂園全開放）</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                    免選班級與座號！代碼自動設定為 <strong className="font-mono text-amber-500 dark:text-amber-400">99-99-99</strong>，設定探險暱稱即可一秒出發暢玩！
                  </p>
                </div>
              ) : (
                <>
                  {/* 步驟 2: 選擇班級 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>{t.selectClassLabel}</span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        2 碼：{selectedClass}
                      </span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {CLASS_OPTIONS.map((c) => {
                        const isSelected = selectedClass === c.id;
                        return (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => setSelectedClass(c.id)}
                            className={\`py-2 px-2 rounded-xl text-xs font-black transition-all border \${
                              isSelected
                                ? 'bg-teal-500 text-white border-teal-600 shadow-md scale-102'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }\`}
                          >
                            {c.zh}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 步驟 3: 選擇座號 (1 ~ 35 號快捷宮格) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                        {t.selectSeatLabel}
                      </label>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        座號：{parseInt(selectedSeat, 10)} 號 ({selectedSeat})
                      </span>
                    </div>
                    <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                      <div className="grid grid-cols-7 gap-1.5 text-center">
                        {Array.from({ length: 35 }, (_, i) => {
                          const seatStr = pad2(i + 1);
                          const isSelected = selectedSeat === seatStr;
                          return (
                            <button
                              type="button"
                              key={seatStr}
                              onClick={() => setSelectedSeat(seatStr)}
                              className={\`py-1.5 rounded-lg text-xs font-mono font-black transition-all \${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-sm scale-105'
                                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                              }\`}
                            >
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}`;

modal = modal.replace(oldStep2And3, newStep2And3)
  .replace(oldStep2And3.replace(/\r\n/g, '\n'), newStep2And3);

// Update Submit Button Text for guest
modal = modal.replace(
  "{isLoading ? '正在連結雲端漫遊檔案...' : t.roamingLaunchBtn}",
  "{isLoading ? '正在連結雲端漫遊檔案...' : (selectedGrade === '99' ? '開始訪客體驗 🚀 (免選班級座號)' : t.roamingLaunchBtn)}"
);

// Update Level badge in Card Mode A (if guest)
modal = modal.replace(
  "<span>LV.{currentStudent.grade || 4}</span>\r\n                    <span className=\"opacity-80\">({pad2(currentStudent.seat)}號)</span>",
  "<span>{currentStudent.student_id === '999999' || String(currentStudent.grade) === '99' ? 'LV.訪客' : `LV.\${currentStudent.grade || 4}`}</span>\r\n                    <span className=\"opacity-80\">{currentStudent.student_id === '999999' || String(currentStudent.grade) === '99' ? '全校暢玩' : `(\${pad2(currentStudent.seat)}號)`}</span>"
).replace(
  "<span>LV.{currentStudent.grade || 4}</span>\n                    <span className=\"opacity-80\">({pad2(currentStudent.seat)}號)</span>",
  "<span>{currentStudent.student_id === '999999' || String(currentStudent.grade) === '99' ? 'LV.訪客' : `LV.\${currentStudent.grade || 4}`}</span>\n                    <span className=\"opacity-80\">{currentStudent.student_id === '999999' || String(currentStudent.grade) === '99' ? '全校暢玩' : `(\${pad2(currentStudent.seat)}號)`}</span>"
);

fs.writeFileSync('src/components/StudentProfileModal.jsx', modal, 'utf8');
console.log('StudentProfileModal.jsx updated for Guest mode!');

// 2. Update LeaderboardView.jsx: Filter out guest records on past weeks
let lb = fs.readFileSync('src/components/LeaderboardView.jsx', 'utf8');

// Filter guest on loadGradeBoards when isPastWeek
const oldFetchAssign = "fetchedList = await fetchLeaderboard(selectedWeek, m.modeKeys, queryBooks, 50);";
const newFetchAssign = `fetchedList = await fetchLeaderboard(selectedWeek, m.modeKeys, queryBooks, 50);
            if (isPastWeek && Array.isArray(fetchedList)) {
              fetchedList = fetchedList.filter(row => {
                const sId = String(row.student_id || '');
                const name = String(row.name || '');
                return sId !== '999999' && !sId.startsWith('99') && !name.includes('訪客') && !name.includes('Guest');
              });
            }`;

lb = lb.replace(oldFetchAssign, newFetchAssign);

// Filter guest on activeModalRanks
const oldModalRanks = "const activeModalRanks = modalModeId ? (boardData[modalModeId] || []) : [];";
const newModalRanks = `const activeModalRanks = useMemo(() => {
    let list = modalModeId ? (boardData[modalModeId] || []) : [];
    if (isPastWeek && Array.isArray(list)) {
      list = list.filter(row => {
        const sId = String(row.student_id || '');
        const name = String(row.name || '');
        return sId !== '999999' && !sId.startsWith('99') && !name.includes('訪客') && !name.includes('Guest');
      });
    }
    return list;
  }, [modalModeId, boardData, isPastWeek]);`;

lb = lb.replace(oldModalRanks, newModalRanks);

// Highlight guest in active week with [訪客] badge in ranks
const oldStudentName = "const studentName = entry.nickname || entry.name || '同學';";
const newStudentName = `const isEntryGuest = String(entry.student_id || '') === '999999' || String(entry.name || '').includes('訪客') || String(entry.name || '').includes('Guest');
                        const studentName = isEntryGuest
                          ? \`[訪客] \${(entry.nickname || entry.name || '探險者').replace(/^\\[訪客\\]\\s*/, '')}\`
                          : (entry.nickname || entry.name || '同學');`;

lb = lb.replace(oldStudentName, newStudentName);

fs.writeFileSync('src/components/LeaderboardView.jsx', lb, 'utf8');
console.log('LeaderboardView.jsx updated to filter guests on past weeks and mark [訪客] on active week!');
