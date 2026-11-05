import { createClient } from '@supabase/supabase-js';

const url = 'https://fqkdkmcqjswufzbvkram.supabase.co';
const key = 'sb_publishable_M9phUn6LH1yeVA9NbIXesg_tVABCW5z';
const supabase = createClient(url, key);

const updates = [
  {
    id: 'tme-vocab-a2w-01',
    note: '【已依意見修正，待複核】\n已強化聽力防洩題設計：學生端與預覽端徹底隱藏單字字稿，僅保留播放鈕供學生反覆聆聽。\n\n原檢核意見：\n"yellow" 引號內的字會呈顯出來嗎?應該不能呈現出來 ，本題只能有播放語音紐'
  },
  {
    id: 'tme-listen-qa-04',
    note: '【已依意見修正，待複核】\n已重構對話發音引擎：設定 Dad（低沉穩重大男聲 pitch:0.74）與 Andy（清亮活潑少年男聲 pitch:1.18），優先採用純美語 (en-US)，兩角色音色與音調對比鮮明。\n\n原檢核意見：\n這兩個男聲沒有區別，請做出區別，而且男聲女聲請盡量使用美語腔調。'
  },
  {
    id: 'tme-read-p2w-01',
    note: '【已依意見修正，待複核】\n已重新布題：替換為 library.svg 生活場所線稿題（選項：library, restaurant, zoo, playground），圖上不再有任何英文字洩題。\n\n原檢核意見：\n這題的答案就直接寫在題目上了，應該換個方式，若不行本題就要重布。'
  },
  {
    id: 'tme-read-cloze-01',
    note: '【已依意見修正，待複核】\n已將干擾選項 sleep 替換為 write / sing，語意更精確且無爭議。\n\n原檢核意見：\n把sleep換掉，換成write或者sing。'
  },
  {
    id: 'tme-read-cloze-03',
    note: '【已依意見修正，待複核】\n題幹已加註中文「refrigerator (冰箱)」，符合國小檢測註釋規範。\n\n原檢核意見：\nrefrigerator要註明是冰箱'
  },
  {
    id: 'tme-read-cloze-04',
    note: '【已依意見修正，待複核】\n已拿掉 school，並於題幹加註「interesting (有趣的)」與「shelf (書架)」。\n\n原檢核意見：\nschool拿掉。interesting要註明有趣的；shelf要註明是書架。'
  },
  {
    id: 'tme-read-cloze-05',
    note: '【已依意見修正，待複核】\n短文已精簡為「It\'s cold and rainy today. Don\'t forget to take an _______ with you.」，語意簡潔俐落。\n\n原檢核意見：\nIt\'s cold and rainy today. Dont\' forget to take an __ with you.就可以了。'
  }
];

async function run() {
  const now = Date.now();
  for (const item of updates) {
    const payload = {
      verified: false,
      notes: item.note,
      cropAdjust: null,
      verifiedBy: 'Mark',
      updatedAt: now
    };
    
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('id')
      .eq('mode', 'exam-audit-note')
      .eq('name', item.id);
      
    if (existing && existing.length > 0) {
      const { error } = await supabase
        .from('leaderboard')
        .update({
          book: JSON.stringify(payload),
          score: 0,
          time: Math.floor(now / 1000)
        })
        .eq('id', existing[0].id);
      console.log('Updated', item.id, error ? error.message : 'SUCCESS');
    } else {
      const { error } = await supabase
        .from('leaderboard')
        .insert({
          device_id: 'teacher-audit',
          name: item.id,
          mode: 'exam-audit-note',
          book: JSON.stringify(payload),
          score: 0,
          time: Math.floor(now / 1000),
          week: 0
        });
      console.log('Inserted', item.id, error ? error.message : 'SUCCESS');
    }
  }
  console.log('--- All 7 items synced to Supabase! ---');
}

run();
