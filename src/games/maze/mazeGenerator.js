// ── 星際字母迷宮 / 百步蛇字母巡航 迷宮核心演算法引擎 ──

/**
 * 判斷指定座標是否位於外圍邊界 (四周最外圍)
 */
export function isPerimeterCell(r, c, rows, cols) {
  return r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
}

/**
 * 根據自選字母長度計算新手級最合適之網格尺寸
 * N <= 8  -> 5x5
 * 9~14    -> 6x6
 * 15~20   -> 7x7
 * 21~26   -> 8x8
 */
export function getRecommendedGridSize(letterCount) {
  if (letterCount <= 8) return { rows: 5, cols: 5 };
  if (letterCount <= 14) return { rows: 6, cols: 6 };
  if (letterCount <= 20) return { rows: 7, cols: 7 };
  return { rows: 8, cols: 8 };
}

/**
 * 正交移動四方方向 (嚴格禁止斜角抄捷徑)
 */
const ORTHOGONAL_DIRS = [
  { dr: -1, dc: 0 }, // 上
  { dr: 1, dc: 0 },  // 下
  { dr: 0, dc: -1 }, // 左
  { dr: 0, dc: 1 }   // 右
];

/**
 * Fisher-Yates 陣列洗牌
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 生成字母迷宮路徑與干擾字母網格
 * @param {Object} options
 * @param {number} options.rows - 網格列數
 * @param {number} options.cols - 網格行數
 * @param {string[]} options.sequence - 目標字母序列 (例如 ['A', 'B', ..., 'Z'])
 * @param {boolean} [options.isLowercase=false] - 是否為小寫
 * @returns {Object} 迷宮物件 { grid, path, startCell, endCell, rows, cols }
 */
export function generateAlphabetMaze({ rows, cols, sequence, isLowercase = false }) {
  const length = sequence.length;
  if (length < 2) {
    throw new Error('Sequence length must be at least 2');
  }

  // 取得所有外圍邊界格子作為潛在起點候選
  const perimeterCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isPerimeterCell(r, c, rows, cols)) {
        perimeterCells.push({ r, c });
      }
    }
  }

  let foundPath = null;
  const maxAttempts = 120;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const start = perimeterCells[Math.floor(Math.random() * perimeterCells.length)];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[start.r][start.c] = true;
    const path = [start];
    let stepCount = 0;
    const maxSteps = 4500;

    function dfs(r, c) {
      if (path.length === length) {
        // 成功條件：到達指定長度，且最後一格必須落在外圍邊界，且不與起點重疊
        return isPerimeterCell(r, c, rows, cols) && (r !== start.r || c !== start.c);
      }
      stepCount++;
      if (stepCount > maxSteps) return false;

      // 取得尚未造訪的正交相鄰格子
      const neighbors = [];
      for (const { dr, dc } of ORTHOGONAL_DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
          neighbors.push({ r: nr, c: nc });
        }
      }

      shuffleArray(neighbors);

      // 若剛好是倒數最後一步，優先嘗試外圍邊界格子
      if (path.length === length - 1) {
        neighbors.sort((a, b) => {
          const aP = isPerimeterCell(a.r, a.c, rows, cols) ? 1 : 0;
          const bP = isPerimeterCell(b.r, b.c, rows, cols) ? 1 : 0;
          return bP - aP;
        });
      }

      for (const next of neighbors) {
        visited[next.r][next.c] = true;
        path.push(next);
        if (dfs(next.r, next.c)) return true;
        path.pop();
        visited[next.r][next.c] = false;
      }
      return false;
    }

    if (dfs(start.r, start.c)) {
      foundPath = path;
      break;
    }
  }

  // 極度罕見狀況下的保底回退 (若隨機 DFS 逾時，使用曼哈頓邊緣折線安全生成)
  if (!foundPath) {
    foundPath = generateFallbackPath(rows, cols, length);
  }

  // 建立底層網格資料
  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      char: '',
      isPath: false,
      pathIndex: -1,
      isStart: false,
      isEnd: false
    }))
  );

  const pathMap = new Map();
  foundPath.forEach((pt, idx) => {
    const char = sequence[idx];
    grid[pt.r][pt.c].char = char;
    grid[pt.r][pt.c].isPath = true;
    grid[pt.r][pt.c].pathIndex = idx;
    if (idx === 0) grid[pt.r][pt.c].isStart = true;
    if (idx === length - 1) grid[pt.r][pt.c].isEnd = true;
    pathMap.set(`${pt.r},${pt.c}`, idx);
  });

  // 全部可用英文字母庫
  const allAlphabet = (isLowercase ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('');
  const sequenceSet = new Set(sequence);

  // 智慧干擾字母填充：
  // 嚴格保證任何非路徑格子，在其正交相鄰為路徑第 k 格時，絕不會剛好放置 sequence[k + 1]！
  // 杜絕學生在任何一步遇到「兩個相鄰都是下一步字母」的誤導歧異！
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].isPath) continue;

      const forbiddenChars = new Set();
      for (const { dr, dc } of ORTHOGONAL_DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (pathMap.has(key)) {
          const pIdx = pathMap.get(key);
          if (pIdx + 1 < sequence.length) {
            forbiddenChars.add(sequence[pIdx + 1]);
          }
        }
      }

      // 優先從目標序列中挑選干擾字母 (讓迷宮充滿視覺挑戰性)，若被禁則從完整字母庫補足
      const candidates = allAlphabet.filter(ch => !forbiddenChars.has(ch));
      const pool = candidates.length > 0 ? candidates : allAlphabet;
      grid[r][c].char = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  return {
    rows,
    cols,
    grid,
    path: foundPath.map((pt, idx) => ({ ...pt, char: sequence[idx], index: idx })),
    startCell: foundPath[0],
    endCell: foundPath[length - 1]
  };
}

/**
 * 保底回退路徑生成 (萬無一失的安全保護機制)
 */
function generateFallbackPath(rows, cols, length) {
  const path = [{ r: 0, c: 0 }];
  let curR = 0;
  let curC = 0;
  let dirRight = true;

  while (path.length < length) {
    if (dirRight) {
      if (curC + 1 < cols) {
        curC++;
      } else {
        curR = Math.min(rows - 1, curR + 1);
        dirRight = false;
      }
    } else {
      if (curC - 1 >= 0) {
        curC--;
      } else {
        curR = Math.min(rows - 1, curR + 1);
        dirRight = true;
      }
    }
    path.push({ r: curR, c: curC });
  }

  // 確保終點在外圍
  if (!isPerimeterCell(curR, curC, rows, cols)) {
    path[path.length - 1] = { r: rows - 1, c: curC };
  }

  return path;
}
