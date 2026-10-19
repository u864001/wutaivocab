/**
 * 霧臺國小 學生背包道具自動摺疊與堆疊輔助函式
 * 避免學生購買多件同品（如買 10 顆蜜蘋果、5 枝石板鉛筆）導致介面無限往下生長
 * 同類道具自動摺疊堆疊，並在右下角以 xN 數量角標呈現
 */

export const groupInventoryItems = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const map = new Map();

  items.forEach((item) => {
    if (!item) return;

    // 若 item 是純字串 (相容舊版資料)
    if (typeof item === 'string') {
      const key = item;
      if (map.has(key)) {
        map.get(key).count += 1;
      } else {
        map.set(key, { id: key, nameZh: key, nameEn: key, icon: '📦', count: 1 });
      }
      return;
    }

    // 物件結構 { id, nameZh, nameEn, icon, category, ... }
    const key = item.id || item.nameZh || item.name || 'unknown_item';
    const existing = map.get(key);

    if (existing) {
      existing.count += (item.count || 1);
    } else {
      map.set(key, {
        ...item,
        count: item.count || 1
      });
    }
  });

  return Array.from(map.values());
};

/**
 * 取得特定道具在學生背包中的總持有數量
 */
export const getItemQuantity = (items = [], itemOrId) => {
  if (!Array.isArray(items) || items.length === 0 || !itemOrId) return 0;
  const targetId = typeof itemOrId === 'string' ? itemOrId : (itemOrId.id || itemOrId.nameZh);

  return items.reduce((total, it) => {
    if (!it) return total;
    const itId = typeof it === 'string' ? it : (it.id || it.nameZh);
    if (itId === targetId) {
      return total + (it.count || 1);
    }
    return total;
  }, 0);
};
