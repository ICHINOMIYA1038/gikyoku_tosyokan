import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface SavedToolItem {
  id: number;
  name: string;
  data: any;
  updatedAt: string;
}

export function useToolData(toolType: string) {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;
  const isLoading = status === "loading";

  const [items, setItems] = useState<SavedToolItem[]>([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved items
  const fetchItems = useCallback(async () => {
    if (!isLoggedIn) return;
    setFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/tool-data?toolType=${toolType}`);
      if (!res.ok) throw new Error("データの取得に失敗しました");
      const json = await res.json();
      setItems(
        json.items.map((item: any) => ({
          ...item,
          data: typeof item.data === "string" ? JSON.parse(item.data) : item.data,
        }))
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setFetching(false);
    }
  }, [isLoggedIn, toolType]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchItems();
    }
  }, [isLoggedIn, fetchItems]);

  // Save an item
  const saveItem = useCallback(
    async (name: string, data: any): Promise<boolean> => {
      if (!isLoggedIn) return false;
      setSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/tool-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolType, name, data }),
        });
        if (!res.ok) throw new Error("保存に失敗しました");
        await fetchItems();
        return true;
      } catch (e: any) {
        setError(e.message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [isLoggedIn, toolType, fetchItems]
  );

  // Delete an item
  const deleteItem = useCallback(
    async (id: number): Promise<boolean> => {
      if (!isLoggedIn) return false;
      setError(null);
      try {
        const res = await fetch(`/api/tool-data?id=${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("削除に失敗しました");
        setItems((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (e: any) {
        setError(e.message);
        return false;
      }
    },
    [isLoggedIn]
  );

  return {
    isLoggedIn,
    isLoading,
    items,
    fetching,
    saving,
    error,
    saveItem,
    deleteItem,
    fetchItems,
  };
}
