import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getFavorites as getLocalFavorites } from '@/lib/favorites';

interface FavoritesContextValue {
  favoriteIds: Set<number>;
  isFav: (postId: number) => boolean;
  toggle: (postId: number) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favoriteIds: new Set(),
  isFav: () => false,
  toggle: async () => {},
  loading: true,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      // ログイン中: DBから取得
      fetch('/api/favorites')
        .then((r) => r.json())
        .then(async (data) => {
          let dbIds: number[] = data.postIds || [];

          // 初回のみ: localStorageのお気に入りをDBに同期
          if (!hasSynced.current) {
            hasSynced.current = true;
            const localIds = getLocalFavorites();
            const newIds = localIds.filter((id) => !dbIds.includes(id));
            if (newIds.length > 0) {
              try {
                const syncRes = await fetch('/api/favorites/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ postIds: newIds }),
                });
                if (syncRes.ok) {
                  const syncData = await syncRes.json();
                  dbIds = syncData.postIds || dbIds;
                }
              } catch {}
              // 同期後はlocalStorageをクリア
              try { localStorage.removeItem('gikyoku_favorites'); } catch {}
            }
          }

          setFavoriteIds(new Set(dbIds));
          setLoading(false);
        })
        .catch(() => {
          setFavoriteIds(new Set(getLocalFavorites()));
          setLoading(false);
        });
    } else {
      // 未ログイン: localStorageから読む
      setFavoriteIds(new Set(getLocalFavorites()));
      setLoading(false);
    }
  }, [session, status]);

  // 未ログイン時: localStorageの変更を監視
  useEffect(() => {
    if (session?.user) return;
    const handler = () => setFavoriteIds(new Set(getLocalFavorites()));
    window.addEventListener('favorites-changed', handler);
    return () => window.removeEventListener('favorites-changed', handler);
  }, [session]);

  const toggle = useCallback(async (postId: number) => {
    if (session?.user) {
      // DB: 楽観的更新 + API呼び出し
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(postId)) next.delete(postId);
        else next.add(postId);
        return next;
      });
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });
      } catch {
        // 失敗時にロールバック
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(postId)) next.delete(postId);
          else next.add(postId);
          return next;
        });
      }
    } else {
      // localStorage
      const { toggleFavorite } = await import('@/lib/favorites');
      toggleFavorite(postId);
      setFavoriteIds(new Set(getLocalFavorites()));
    }
  }, [session]);

  const isFav = useCallback((postId: number) => favoriteIds.has(postId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFav, toggle, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
