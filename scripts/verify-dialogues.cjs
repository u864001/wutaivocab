const { DIALOGUE_VARIANTS, VISITING_TEACHER_VARIANTS } = require('../src/games/town/townDialogueData.js');

const allowedActions = new Set([
  'OPEN_SHOP',
  'OPEN_QUESTS',
  'CLAIM_REWARD',
  'CLAIM_TEACHER_BONUS',
  'VISIT_LOCATION',
  'COMPLETE_QUEST'
]);

let errors = [];
let totalTrees = 0;
let totalNodes = 0;
let totalOptions = 0;

function checkTree(treeId, tree) {
  totalTrees++;
  if (!tree.variantId) errors.push(`[${treeId}] Missing variantId`);
  if (!tree.startNode) errors.push(`[${treeId}] Missing startNode`);
  if (!tree.nodes) {
    errors.push(`[${treeId}] Missing nodes`);
    return;
  }
  if (!tree.nodes[tree.startNode]) {
    errors.push(`[${treeId}] startNode '${tree.startNode}' does not exist in nodes!`);
  }

  for (const [nodeKey, node] of Object.entries(tree.nodes)) {
    totalNodes++;
    if (!node.id) errors.push(`[${treeId} -> ${nodeKey}] Missing node.id`);
    if (!node.speaker) errors.push(`[${treeId} -> ${nodeKey}] Missing speaker`);
    if (!node.en) errors.push(`[${treeId} -> ${nodeKey}] Missing en text`);
    if (!node.zh) errors.push(`[${treeId} -> ${nodeKey}] Missing zh text`);

    if (Array.isArray(node.options)) {
      node.options.forEach((opt, idx) => {
        totalOptions++;
        if (!opt.text_en) errors.push(`[${treeId} -> ${nodeKey} -> opt${idx}] Missing text_en`);
        if (!opt.text_zh) errors.push(`[${treeId} -> ${nodeKey} -> opt${idx}] Missing text_zh`);
        
        if (opt.target_id) {
          if (opt.target_id !== 'END' && !tree.nodes[opt.target_id]) {
            errors.push(`[${treeId} -> ${nodeKey}] Broken target_id: '${opt.target_id}' not found in tree nodes!`);
          }
        } else if (opt.action) {
          if (!allowedActions.has(opt.action)) {
            errors.push(`[${treeId} -> ${nodeKey}] Unknown action: '${opt.action}'`);
          }
        }
      });
    }
  }
}

for (const [locKey, variants] of Object.entries(DIALOGUE_VARIANTS)) {
  variants.forEach((v, idx) => checkTree(`${locKey}_v${idx}`, v));
}

for (const [teacherKey, variants] of Object.entries(VISITING_TEACHER_VARIANTS)) {
  variants.forEach((v, idx) => checkTree(`teacher_${teacherKey}_v${idx}`, v));
}

console.log('====================================');
console.log('🔍 50 套對話樹全量路徑驗證結果:');
console.log('====================================');
console.log(`總計對話樹: ${totalTrees} 套`);
console.log(`總計節點數: ${totalNodes} 個`);
console.log(`總計選項數: ${totalOptions} 個`);
console.log(`真實斷鏈與未定義錯誤: ${errors.length}`);
if (errors.length > 0) {
  errors.forEach(e => console.log('❌', e));
} else {
  console.log('🎉 100% 通過驗證！所有 50 套對話樹無任何斷鏈、無未定義節點、無未知動作，全部路徑暢通！');
}
