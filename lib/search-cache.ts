// シンプルなインメモリキャッシュ（検索結果用）
interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
}

class SearchCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize = 50; // 最大50件のキャッシュ
  private ttl = 60000; // 1分間のTTL

  // キャッシュキーを生成
  generateKey(params: any): string {
    // パラメータをソートして一貫性のあるキーを生成
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        if (params[key] !== undefined && params[key] !== '') {
          acc[key] = params[key];
        }
        return acc;
      }, {} as any);
    
    return JSON.stringify(sortedParams);
  }

  // キャッシュから取得
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // TTLチェック
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // ヒット数を増やす
    entry.hits++;
    
    return entry.data;
  }

  // キャッシュに保存
  set(key: string, data: any): void {
    // キャッシュサイズ制限
    if (this.cache.size >= this.maxSize) {
      // 最も使用頻度の低いエントリを削除
      let minHits = Infinity;
      let keyToDelete = '';
      
      for (const [k, v] of this.cache.entries()) {
        if (v.hits < minHits) {
          minHits = v.hits;
          keyToDelete = k;
        }
      }
      
      if (keyToDelete) {
        this.cache.delete(keyToDelete);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  // キャッシュをクリア
  clear(): void {
    this.cache.clear();
  }

  // 統計情報を取得
  getStats(): { size: number; hitRate: number } {
    let totalHits = 0;
    for (const entry of this.cache.values()) {
      totalHits += entry.hits;
    }
    
    return {
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0,
    };
  }
}

// シングルトンインスタンス
export const searchCache = new SearchCache();