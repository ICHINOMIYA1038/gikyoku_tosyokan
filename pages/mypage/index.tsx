import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FaUser, FaCommentDots, FaTrash, FaExclamationTriangle, FaHeart, FaPen,
  FaTheaterMasks, FaCalendarAlt, FaClock, FaArrowRight, FaTools, FaBullhorn, FaUsers, FaCog,
} from 'react-icons/fa';
import { FEATURES } from '@/lib/feature-flags';

type AnnouncementRow = {
  id: number;
  title: string;
  status: string;
  rejectionReason: string | null;
  performanceDate: string | null;
  venue: string | null;
  views: number;
  createdAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
};

type RecruitmentRow = {
  id: string;
  title: string;
  status: string;
  theaterGroupName: string | null;
  prefecture: string | null;
  views: number;
  publishedAt: string;
};

interface Props {
  user: {
    name: string | null;
    displayName: string | null;
    email: string | null;
    image: string | null;
    avatarUrl: string | null;
    bio: string | null;
    groupName: string | null;
    createdAt: string;
  };
  stats: {
    parentCommentCount: number;
    childCommentCount: number;
  };
  recentComments: Array<{ id: number; content: string; date: string; postTitle: string; postId: number }>;
  favoriteCount: number;
  favoritePosts: Array<{ id: number; title: string; authorName: string }>;
  announcements: AnnouncementRow[];
  recruitments: RecruitmentRow[];
  pendingAnnouncementCount: number;
}

interface SavedToolDataItem {
  id: number;
  name: string;
  data: any;
  updatedAt: string;
}

type TabKey = 'overview' | 'announcements' | 'recruitments' | 'favorites' | 'comments' | 'tools' | 'settings';

const annStatusLabel = (a: AnnouncementRow) => {
  if (a.deletedAt && a.deletedBy === 'admin') return { text: '管理者により削除', cls: 'bg-gray-300 text-gray-800' };
  if (a.status === 'pending') return { text: '審査待ち', cls: 'bg-amber-100 text-amber-700' };
  if (a.status === 'rejected') return { text: '却下', cls: 'bg-rose-100 text-rose-700' };
  if (a.status === 'approved') return { text: '公開中', cls: 'bg-emerald-100 text-emerald-700' };
  return { text: a.status, cls: 'bg-gray-100 text-gray-600' };
};

const recStatusLabel = (s: string) => {
  if (s === 'CLOSED') return { text: '募集終了', cls: 'bg-gray-200 text-gray-600' };
  if (s === 'DRAFT') return { text: '下書き', cls: 'bg-amber-100 text-amber-700' };
  return { text: '募集中', cls: 'bg-emerald-100 text-emerald-700' };
};

export default function MyPage({
  user, stats, recentComments, favoriteCount, favoritePosts,
  announcements: initialAnnouncements, recruitments: initialRecruitments, pendingAnnouncementCount,
}: Props) {
  const router = useRouter();
  const queryTab = typeof router.query.tab === 'string' ? router.query.tab : 'overview';
  const [activeTab, setActiveTab] = useState<TabKey>(queryTab as TabKey);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [recruitments, setRecruitments] = useState(initialRecruitments);

  useEffect(() => {
    if (typeof router.query.tab === 'string' && router.query.tab !== activeTab) {
      setActiveTab(router.query.tab as TabKey);
    }
  }, [router.query.tab]);

  const switchTab = (t: TabKey) => {
    setActiveTab(t);
    router.replace({ pathname: '/mypage', query: t === 'overview' ? {} : { tab: t } }, undefined, { shallow: true });
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [savedSchedules, setSavedSchedules] = useState<SavedToolDataItem[]>([]);
  const [savedTimers, setSavedTimers] = useState<SavedToolDataItem[]>([]);
  const [toolDataLoading, setToolDataLoading] = useState(true);

  useEffect(() => {
    const safeParse = (raw: any): any => {
      if (typeof raw !== 'string') return raw;
      try {
        const first = JSON.parse(raw);
        if (typeof first === 'string') {
          try { return JSON.parse(first); } catch { return first; }
        }
        return first;
      } catch { return raw; }
    };
    Promise.all([
      fetch('/api/tool-data?toolType=schedule').then(r => r.json()).catch(() => ({ items: [] })),
      fetch('/api/tool-data?toolType=timer').then(r => r.json()).catch(() => ({ items: [] })),
    ]).then(([scheduleData, timerData]) => {
      setSavedSchedules((scheduleData.items || []).map((i: any) => ({ ...i, data: safeParse(i.data) })));
      setSavedTimers((timerData.items || []).map((i: any) => ({ ...i, data: safeParse(i.data) })));
      setToolDataLoading(false);
    });
  }, []);

  const handleDeleteToolData = useCallback(async (id: number, type: 'schedule' | 'timer') => {
    const res = await fetch(`/api/tool-data?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (type === 'schedule') setSavedSchedules(prev => prev.filter(s => s.id !== id));
      else setSavedTimers(prev => prev.filter(s => s.id !== id));
    }
  }, []);

  const handleDeleteAnnouncement = async (id: number, silent = false) => {
    if (!silent && !confirm('この上演告知を削除しますか？（取り消せません）')) return;
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    if (res.ok) setAnnouncements(prev => prev.filter(a => a.id !== id));
    else if (!silent) alert('削除に失敗しました');
  };

  const handleDeleteRecruitment = async (id: string) => {
    if (!confirm('この劇団員募集を削除しますか？（取り消せません）')) return;
    const res = await fetch(`/api/recruitments/${id}`, { method: 'DELETE' });
    if (res.ok) setRecruitments(prev => prev.filter(r => r.id !== id));
    else alert('削除に失敗しました');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '削除する') return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (res.ok) window.location.href = '/api/tomoshibi/logout?callbackUrl=/';
      else {
        const data = await res.json();
        setDeleteError(data.error || 'アカウント削除に失敗しました');
      }
    } catch { setDeleteError('通信エラーが発生しました'); }
    setIsDeleting(false);
  };

  const tabs = useMemo(() => {
    const list: { key: TabKey; label: string; icon: JSX.Element; badge?: number }[] = [
      { key: 'overview', label: '概要', icon: <FaUser /> },
      { key: 'announcements', label: '上演告知', icon: <FaBullhorn />, badge: pendingAnnouncementCount || undefined },
    ];
    if (FEATURES.recruit) list.push({ key: 'recruitments', label: '劇団員募集', icon: <FaUsers /> });
    list.push(
      { key: 'favorites', label: 'お気に入り', icon: <FaHeart /> },
      { key: 'comments', label: 'コメント', icon: <FaCommentDots /> },
      { key: 'tools', label: 'マイツール', icon: <FaTools /> },
      { key: 'settings', label: '設定', icon: <FaCog /> },
    );
    return list;
  }, [pendingAnnouncementCount]);

  return (
    <Layout>
      <Seo pageTitle="マイページ" pageDescription="戯曲図書館マイページ" pagePath="/mypage" />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* プロフィールヘッダー */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-4">
          <div className="flex items-center gap-4">
            {(user.avatarUrl || user.image) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl || user.image || ''} alt={user.displayName || user.name || 'user'}
                className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-2xl text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 truncate">{user.displayName || user.name || 'ユーザー'}</h1>
                <Link href="/mypage/edit" className="text-gray-400 hover:text-theater-primary-600">
                  <FaPen className="text-xs" />
                </Link>
              </div>
              {user.groupName && (
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                  <FaTheaterMasks className="text-[10px] text-gray-400" />{user.groupName}
                </p>
              )}
              {user.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{user.bio}</p>}
            </div>
          </div>
        </div>

        {/* タブバー */}
        <div className="sticky top-0 z-10 bg-theater-neutral-50 -mx-4 px-4 mb-4 border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button key={t.key} onClick={() => switchTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive ? 'border-theater-primary-500 text-theater-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  <span className="text-xs">{t.icon}</span>
                  {t.label}
                  {t.badge ? (
                    <span className="ml-1 inline-flex items-center justify-center bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{t.badge}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* 概要 */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => switchTab('favorites')} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:border-theater-primary-300 transition">
                <div className="flex items-center gap-2"><FaHeart className="text-theater-primary-500" />
                  <div><p className="text-[11px] text-gray-500">お気に入り</p><p className="text-xl font-bold">{favoriteCount}</p></div></div>
              </button>
              <button onClick={() => switchTab('announcements')} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:border-theater-primary-300 transition">
                <div className="flex items-center gap-2"><FaBullhorn className="text-theater-primary-600" />
                  <div><p className="text-[11px] text-gray-500">上演告知</p><p className="text-xl font-bold">{announcements.length}</p></div></div>
              </button>
              <button onClick={() => switchTab('comments')} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:border-theater-primary-300 transition">
                <div className="flex items-center gap-2"><FaCommentDots className="text-blue-500" />
                  <div><p className="text-[11px] text-gray-500">コメント</p><p className="text-xl font-bold">{stats.parentCommentCount + stats.childCommentCount}</p></div></div>
              </button>
            </div>

            {pendingAnnouncementCount > 0 && (
              <button onClick={() => switchTab('announcements')} className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-center gap-2 hover:bg-amber-100">
                <FaExclamationTriangle />
                審査待ちの上演告知が <strong>{pendingAnnouncementCount}</strong> 件あります（承認後に公開されます）
                <FaArrowRight className="ml-auto text-xs" />
              </button>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <p className="text-xs text-gray-400">登録日: {user.createdAt}</p>
            </div>
          </div>
        )}

        {/* 上演告知 */}
        {activeTab === 'announcements' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">自分の上演告知</h2>
              <Link href="/announcements/new" className="text-sm bg-theater-primary-500 hover:bg-theater-primary-600 text-white px-3 py-1.5 rounded-md">
                + 新規投稿
              </Link>
            </div>
            <p className="text-xs text-gray-500">投稿は管理者の承認後に一般公開されます。</p>
            {announcements.length === 0 ? (
              <div className="bg-white rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                まだ上演告知を投稿していません。
              </div>
            ) : (
              <ul className="space-y-2">
                {announcements.map((a) => {
                  const badge = annStatusLabel(a);
                  const isInactive = !!a.deletedAt || a.status === 'rejected';
                  return (
                    <li key={a.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${isInactive ? 'opacity-75' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-medium rounded px-1.5 py-0.5 ${badge.cls}`}>{badge.text}</span>
                            <p className={`text-sm font-medium truncate ${isInactive ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{a.title}</p>
                          </div>
                          <p className="text-[11px] text-gray-500">
                            {a.performanceDate && `公演日: ${new Date(a.performanceDate).toLocaleDateString('ja-JP')} / `}
                            {a.venue && `${a.venue} / `}
                            閲覧 {a.views} / {new Date(a.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                          {a.status === 'rejected' && (
                            <p className="mt-1.5 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded px-2 py-1">
                              管理者により却下されました{a.rejectionReason ? `（理由: ${a.rejectionReason}）` : ''}
                            </p>
                          )}
                          {a.deletedAt && a.deletedBy === 'admin' && (
                            <p className="mt-1.5 text-[11px] text-gray-700 bg-gray-100 border border-gray-300 rounded px-2 py-1">
                              管理者により削除されました（{new Date(a.deletedAt).toLocaleDateString('ja-JP')}）
                            </p>
                          )}
                        </div>
                        <div className="flex flex-shrink-0 gap-2">
                          {a.status === 'approved' && !a.deletedAt && (
                            <Link href={`/announcements/${a.id}`} className="text-xs text-blue-600 hover:underline self-center">表示</Link>
                          )}
                          {isInactive ? (
                            <button onClick={() => handleDeleteAnnouncement(a.id, true)}
                              className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded">確認して非表示</button>
                          ) : (
                            <button onClick={() => handleDeleteAnnouncement(a.id)}
                              className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded">削除</button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* 劇団員募集 */}
        {activeTab === 'recruitments' && FEATURES.recruit && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">自分の劇団員募集</h2>
              <Link href="/recruit/new" className="text-sm bg-theater-primary-500 hover:bg-theater-primary-600 text-white px-3 py-1.5 rounded-md">
                + 新規募集
              </Link>
            </div>
            {recruitments.length === 0 ? (
              <div className="bg-white rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                まだ劇団員募集を投稿していません。
              </div>
            ) : (
              <ul className="space-y-2">
                {recruitments.map((r) => {
                  const badge = recStatusLabel(r.status);
                  return (
                    <li key={r.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-medium rounded px-1.5 py-0.5 ${badge.cls}`}>{badge.text}</span>
                            <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                          </div>
                          <p className="text-[11px] text-gray-500">
                            {r.theaterGroupName && `${r.theaterGroupName} / `}
                            {r.prefecture && `${r.prefecture} / `}
                            閲覧 {r.views} / {new Date(r.publishedAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 gap-2">
                          <Link href={`/recruit/${r.id}`} className="text-xs text-blue-600 hover:underline self-center">表示</Link>
                          <button onClick={() => handleDeleteRecruitment(r.id)}
                            className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded">削除</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* お気に入り */}
        {activeTab === 'favorites' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">お気に入り作品</h2>
              {favoriteCount > 0 && <Link href="/favorites" className="text-xs text-theater-primary-600 hover:underline">すべて見る ({favoriteCount})</Link>}
            </div>
            {favoritePosts.length === 0 ? (
              <p className="text-sm text-gray-500">まだお気に入り登録がありません。</p>
            ) : (
              <ul className="space-y-3">
                {favoritePosts.map((p) => (
                  <li key={p.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <Link href={`/posts/${p.id}`} className="text-sm text-theater-primary-600 hover:underline font-medium">{p.title}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">{p.authorName}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* コメント */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h2 className="text-base font-bold mb-4">最近のコメント</h2>
            {recentComments.length === 0 ? (
              <p className="text-sm text-gray-500">まだコメントがありません。</p>
            ) : (
              <ul className="space-y-3">
                {recentComments.map((c) => (
                  <li key={c.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <Link href={`/posts/${c.postId}`} className="text-sm text-theater-primary-600 hover:underline font-medium">{c.postTitle}</Link>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">{c.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.date}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* マイツール */}
        {activeTab === 'tools' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2"><FaTools className="text-gray-400" />マイツール</h2>
              <Link href="/tools" className="text-xs text-theater-primary-600 hover:underline">ツール一覧 →</Link>
            </div>
            {toolDataLoading ? <p className="text-sm text-gray-400">読み込み中...</p>
              : savedSchedules.length === 0 && savedTimers.length === 0 ? (
                <p className="text-sm text-gray-500">保存したスケジュール・タイマーがここに表示されます。</p>
              ) : (
                <div className="space-y-3">
                  {savedSchedules.map((item) => (
                    <div key={`s-${item.id}`} className="border-l-4 border-blue-400 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm flex items-center gap-2"><FaCalendarAlt className="text-blue-500" />{item.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/tools/schedule-generator?load=${item.id}`} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">開く</Link>
                        <button onClick={() => handleDeleteToolData(item.id, 'schedule')} className="text-xs text-gray-400 hover:text-red-500"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                  {savedTimers.map((item) => (
                    <div key={`t-${item.id}`} className="border-l-4 border-orange-400 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm flex items-center gap-2"><FaClock className="text-orange-500" />{item.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/tools/rehearsal-timer?load=${item.id}`} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">開く</Link>
                        <button onClick={() => handleDeleteToolData(item.id, 'timer')} className="text-xs text-gray-400 hover:text-red-500"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* 設定 */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h2 className="text-base font-bold mb-4">アカウント設定</h2>
            <div className="space-y-3">
              <Link href="/mypage/edit" className="block text-sm text-theater-primary-600 hover:underline">プロフィールを編集</Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">アカウントの削除</p>
                    <p className="text-xs text-gray-400 mt-0.5">投稿済みコメントは匿名として残ります。</p>
                  </div>
                  <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                    <FaTrash className="text-xs" />削除
                  </button>
                </div>
              ) : (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start gap-3 mb-4">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-800">本当に削除しますか？</p>
                      <p className="text-xs text-red-600 mt-1">この操作は取り消せません。</p>
                    </div>
                  </div>
                  <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="「削除する」と入力" className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm mb-3" />
                  {deleteError && <p className="text-sm text-red-600 mb-3">{deleteError}</p>}
                  <div className="flex gap-3">
                    <button onClick={handleDeleteAccount} disabled={deleteConfirmText !== '削除する' || isDeleting}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${
                        deleteConfirmText === '削除する' && !isDeleting ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}>
                      {isDeleting ? '削除中...' : '完全に削除'}
                    </button>
                    <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeleteError(''); }}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">キャンセル</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin?callbackUrl=/mypage', permanent: false } };
  }
  const userId = session.user.id;

  const [user, parentCount, childCount, parents, favoriteCount, favorites, announcements, recruitments, pendingAnnouncementCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, displayName: true, email: true, image: true, avatarUrl: true, bio: true, groupName: true, createdAt: true },
    }),
    prisma.parentComment.count({ where: { userId, deleted: false } }),
    prisma.childComment.count({ where: { userId, deleted: false } }),
    prisma.parentComment.findMany({
      where: { userId, deleted: false }, orderBy: { date: 'desc' }, take: 10,
      include: { post: { select: { id: true, title: true } } },
    }),
    prisma.favorite.count({ where: { userId } }),
    prisma.favorite.findMany({
      where: { userId }, orderBy: { createdAt: 'desc' }, take: 8,
      include: { post: { select: { id: true, title: true, author: { select: { name: true } } } } },
    }),
    prisma.announcement.findMany({
      where: {
        userId,
        // 本人が削除したものだけ非表示。管理者削除・却下は表示して通知する。
        NOT: { AND: [{ deletedAt: { not: null } }, { deletedBy: 'self' }] },
      },
      orderBy: { createdAt: 'desc' }, take: 50,
      select: { id: true, title: true, status: true, rejectionReason: true, performanceDate: true, venue: true, views: true, createdAt: true, deletedAt: true, deletedBy: true },
    }),
    prisma.recruitment.findMany({
      where: { postedBy: userId, deletedAt: null }, orderBy: { publishedAt: 'desc' }, take: 50,
      select: { id: true, title: true, status: true, theaterGroupName: true, prefecture: true, views: true, publishedAt: true },
    }),
    prisma.announcement.count({ where: { userId, status: 'pending', deletedAt: null } }),
  ]);

  if (!user) return { notFound: true };

  return {
    props: {
      user: {
        name: user.name, displayName: user.displayName, email: user.email, image: user.image,
        avatarUrl: user.avatarUrl, bio: user.bio, groupName: user.groupName,
        createdAt: user.createdAt.toISOString().split('T')[0],
      },
      stats: { parentCommentCount: parentCount, childCommentCount: childCount },
      recentComments: parents.map((c) => ({
        id: c.id, content: c.content, date: c.date.toISOString().split('T')[0],
        postTitle: c.post.title, postId: c.post.id,
      })),
      favoriteCount,
      favoritePosts: favorites.map((f) => ({ id: f.post.id, title: f.post.title, authorName: f.post.author.name })),
      announcements: announcements.map((a) => ({
        id: a.id, title: a.title, status: a.status, rejectionReason: a.rejectionReason,
        performanceDate: a.performanceDate?.toISOString() ?? null, venue: a.venue,
        views: a.views, createdAt: a.createdAt.toISOString(),
        deletedAt: a.deletedAt?.toISOString() ?? null, deletedBy: a.deletedBy,
      })),
      recruitments: recruitments.map((r) => ({
        id: r.id, title: r.title, status: r.status,
        theaterGroupName: r.theaterGroupName, prefecture: r.prefecture,
        views: r.views, publishedAt: r.publishedAt.toISOString(),
      })),
      pendingAnnouncementCount,
    },
  };
};
