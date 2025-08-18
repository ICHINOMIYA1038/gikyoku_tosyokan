// メモリキャッシュの実装（簡易版）
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1分

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

export function setCached<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
  
  // メモリリークを防ぐため、古いエントリを削除
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

export function clearCache(): void {
  cache.clear();
}