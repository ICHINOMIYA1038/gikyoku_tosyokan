const FAVORITES_KEY = "gikyoku_favorites";
const COMPARE_KEY = "gikyoku_compare";
const COMPARE_LIMIT = 3;

function getList(key: string): number[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return [];
}

function setList(key: string, list: number[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

// お気に入り
export function getFavorites(): number[] {
  return getList(FAVORITES_KEY);
}

export function toggleFavorite(postId: number): number[] {
  const favorites = getFavorites();
  const index = favorites.indexOf(postId);
  if (index === -1) {
    favorites.push(postId);
  } else {
    favorites.splice(index, 1);
  }
  setList(FAVORITES_KEY, favorites);
  window.dispatchEvent(new CustomEvent("favorites-changed"));
  return favorites;
}

export function isFavorite(postId: number): boolean {
  return getFavorites().includes(postId);
}

// 比較
export function getCompareList(): number[] {
  return getList(COMPARE_KEY);
}

export function toggleCompare(postId: number): { list: number[]; error?: string } {
  const list = getCompareList();
  const index = list.indexOf(postId);
  if (index === -1) {
    if (list.length >= COMPARE_LIMIT) {
      return { list, error: `比較は${COMPARE_LIMIT}作品までです` };
    }
    list.push(postId);
  } else {
    list.splice(index, 1);
  }
  setList(COMPARE_KEY, list);
  window.dispatchEvent(new CustomEvent("compare-changed"));
  return { list };
}

export function isInCompare(postId: number): boolean {
  return getCompareList().includes(postId);
}

export function clearCompare(): void {
  setList(COMPARE_KEY, []);
  window.dispatchEvent(new CustomEvent("compare-changed"));
}
