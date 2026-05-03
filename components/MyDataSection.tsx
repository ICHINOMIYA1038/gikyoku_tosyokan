import React, { useState } from "react";
import Link from "next/link";
import { SavedToolItem } from "@/lib/useToolData";

interface MyDataSectionProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  items: SavedToolItem[];
  fetching: boolean;
  saving: boolean;
  error: string | null;
  onSave: (name: string) => Promise<boolean>;
  onLoad: (item: SavedToolItem) => void;
  onDelete: (id: number) => Promise<boolean>;
  /** Label shown for each saved item, e.g. "メニュー" or "分析" */
  itemLabel?: string;
  /** Optional: render a custom description for each item */
  renderItemDetail?: (item: SavedToolItem) => React.ReactNode;
}

export default function MyDataSection({
  isLoggedIn,
  isLoading,
  items,
  fetching,
  saving,
  error,
  onSave,
  onLoad,
  onDelete,
  itemLabel = "データ",
  renderItemDetail,
}: MyDataSectionProps) {
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <div className="text-sm text-gray-400 mt-4">
        <Link href="/api/auth/signin" className="text-blue-500 hover:underline">
          ログイン
        </Link>
        すると{itemLabel}を保存できます
      </div>
    );
  }

  const handleSave = async () => {
    const name = saveName.trim();
    if (!name) return;
    const ok = await onSave(name);
    if (ok) setSaveName("");
  };

  const handleDelete = async (id: number) => {
    await onDelete(id);
    setConfirmDeleteId(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <span>マイデータ {items.length > 0 && `(${items.length})`}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          {/* Save form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder={`${itemLabel}の名前を入力`}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={saving || !saveName.trim()}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          {/* Saved items list */}
          {fetching ? (
            <p className="text-xs text-gray-400">読み込み中...</p>
          ) : items.length === 0 ? (
            <p className="text-xs text-gray-400">保存済み{itemLabel}はありません</p>
          ) : (
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded px-3 py-2 text-sm group"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <button
                      onClick={() => onLoad(item)}
                      className="text-blue-600 hover:underline font-medium truncate block text-left w-full"
                      title={`「${item.name}」を読み込む`}
                    >
                      {item.name}
                    </button>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {formatDate(item.updatedAt)}
                      {renderItemDetail && <> &middot; {renderItemDetail(item)}</>}
                    </div>
                  </div>
                  {confirmDeleteId === item.id ? (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                      >
                        削除する
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                      >
                        戻る
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 text-xs px-1"
                      aria-label="削除"
                    >
                      &times;
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
