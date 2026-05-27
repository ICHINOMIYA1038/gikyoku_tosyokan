import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { FaUser, FaCommentDots, FaTrash, FaExclamationTriangle, FaHeart, FaPen, FaTheaterMasks, FaCalendarAlt, FaClock, FaArrowRight, FaTools } from 'react-icons/fa';

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
  recentComments: Array<{
    id: number;
    content: string;
    date: string;
    postTitle: string;
    postId: number;
  }>;
  favoriteCount: number;
  favoritePosts: Array<{
    id: number;
    title: string;
    authorName: string;
  }>;
}

interface SavedToolDataItem {
  id: number;
  name: string;
  data: any;
  updatedAt: string;
}

export default function MyPage({ user, stats, recentComments, favoriteCount, favoritePosts }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Saved tool data
  const [savedSchedules, setSavedSchedules] = useState<SavedToolDataItem[]>([]);
  const [savedTimers, setSavedTimers] = useState<SavedToolDataItem[]>([]);
  const [toolDataLoading, setToolDataLoading] = useState(true);

  useEffect(() => {
    const safeParse = (raw: any): any => {
      // Handle double-stringified JSON: if after parsing we still have a string, parse again
      if (typeof raw !== 'string') return raw;
      try {
        const first = JSON.parse(raw);
        if (typeof first === 'string') {
          try { return JSON.parse(first); } catch { return first; }
        }
        return first;
      } catch {
        return raw;
      }
    };

    Promise.all([
      fetch('/api/tool-data?toolType=schedule').then(r => r.json()).catch((e) => { console.log('[MyPage] schedule fetch error:', e); return { items: [] }; }),
      fetch('/api/tool-data?toolType=timer').then(r => r.json()).catch((e) => { console.log('[MyPage] timer fetch error:', e); return { items: [] }; }),
    ]).then(([scheduleData, timerData]) => {
      console.log('[MyPage] Raw schedule data:', JSON.stringify(scheduleData).slice(0, 500));
      console.log('[MyPage] Raw timer data:', JSON.stringify(timerData).slice(0, 500));

      const parsedSchedules = (scheduleData.items || []).map((item: any) => {
        const parsed = safeParse(item.data);
        console.log('[MyPage] Schedule item:', item.id, item.name, 'dataType:', typeof item.data, 'parsed:', parsed);
        return { ...item, data: parsed };
      });
      const parsedTimers = (timerData.items || []).map((item: any) => {
        const parsed = safeParse(item.data);
        console.log('[MyPage] Timer item:', item.id, item.name, 'dataType:', typeof item.data, 'parsed:', parsed);
        return { ...item, data: parsed };
      });

      setSavedSchedules(parsedSchedules);
      setSavedTimers(parsedTimers);
      setToolDataLoading(false);
    });
  }, []);

  const handleDeleteToolData = useCallback(async (id: number, type: 'schedule' | 'timer') => {
    try {
      const res = await fetch(`/api/tool-data?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (type === 'schedule') {
          setSavedSchedules(prev => prev.filter(s => s.id !== id));
        } else {
          setSavedTimers(prev => prev.filter(s => s.id !== id));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '削除する') return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/api/tomoshibi/logout?callbackUrl=/';
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'アカウント削除に失敗しました');
      }
    } catch {
      setDeleteError('通信エラーが発生しました');
    }
    setIsDeleting(false);
  };

  return (
    <Layout>
      <Seo pageTitle="マイページ" pageDescription="戯曲図書館マイページ" pagePath="/mypage" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">マイページ</h1>

        {/* プロフィールカード */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            {(user.avatarUrl || user.image) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl || user.image || ''}
                alt={user.displayName || user.name || 'user'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-3xl text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{user.displayName || user.name || 'ユーザー'}</h2>
                <Link href="/mypage/edit" className="text-gray-400 hover:text-theater-primary-600 transition-colors">
                  <FaPen className="text-xs" />
                </Link>
              </div>
              {user.groupName && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                  <FaTheaterMasks className="text-xs text-gray-400" />
                  {user.groupName}
                </p>
              )}
              {user.bio && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{user.bio}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">登録日: {user.createdAt}</p>
            </div>
          </div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <FaHeart className="text-2xl text-theater-primary-500" />
              <div>
                <p className="text-xs text-gray-500">お気に入り</p>
                <p className="text-2xl font-bold">{favoriteCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <FaCommentDots className="text-2xl text-theater-primary-600" />
              <div>
                <p className="text-xs text-gray-500">コメント数</p>
                <p className="text-2xl font-bold">
                  {stats.parentCommentCount + stats.childCommentCount}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <FaCommentDots className="text-2xl text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">返信数</p>
                <p className="text-2xl font-bold">{stats.childCommentCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* お気に入り */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">お気に入り作品</h3>
            {favoriteCount > 0 && (
              <Link href="/favorites" className="text-sm text-theater-primary-600 hover:underline">
                すべて見る
              </Link>
            )}
          </div>
          {favoritePosts.length === 0 ? (
            <p className="text-sm text-gray-500">まだお気に入り登録がありません。</p>
          ) : (
            <ul className="space-y-3">
              {favoritePosts.map((p) => (
                <li key={p.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <Link
                    href={`/posts/${p.id}`}
                    className="text-sm text-theater-primary-600 hover:underline font-medium"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{p.authorName}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 最近のコメント */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">最近のコメント</h3>
          {recentComments.length === 0 ? (
            <p className="text-sm text-gray-500">まだコメントがありません。</p>
          ) : (
            <ul className="space-y-3">
              {recentComments.map((c) => (
                <li key={c.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <Link
                    href={`/posts/${c.postId}`}
                    className="text-sm text-theater-primary-600 hover:underline font-medium"
                  >
                    {c.postTitle}
                  </Link>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{c.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* マイツール */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FaTools className="text-gray-400" />
              マイツール
            </h3>
            <Link href="/tools" className="text-sm text-theater-primary-600 hover:underline flex items-center gap-1">
              ツール一覧を見る <FaArrowRight className="text-xs" />
            </Link>
          </div>
          {toolDataLoading ? (
            <p className="text-sm text-gray-400">読み込み中...</p>
          ) : savedSchedules.length === 0 && savedTimers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-3">
                まだ保存したデータはありません。<br />
                ツールページで作成したスケジュールやタイマーメニューを保存できます。
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-4 py-2 bg-theater-primary-50 text-theater-primary-700 rounded-lg text-sm font-medium hover:bg-theater-primary-100 transition-colors"
              >
                <FaTools className="text-xs" />
                ツールページへ
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Schedule cards */}
              {savedSchedules.map((item) => {
                const perfDate = item.data?.performanceDate;
                const weeks = item.data?.weeksBefore || item.data?.weeks;
                const updatedStr = new Date(item.updatedAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
                return (
                  <div key={`schedule-${item.id}`} className="border border-gray-200 rounded-lg pl-0 overflow-hidden group">
                    <div className="flex border-l-4 border-blue-400">
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                            <span className="font-semibold text-gray-900 truncate">{item.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteToolData(item.id, 'schedule')}
                            className="text-gray-300 hover:text-red-500 transition-colors ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-100"
                            aria-label="削除"
                            title="削除"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                        <div className="mt-1.5 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-0.5">
                          {perfDate && <span>本番日: {perfDate}</span>}
                          {weeks && <span>期間: {weeks}週間</span>}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400">最終更新: {updatedStr}</span>
                          <Link
                            href={`/tools/schedule-generator?load=${item.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                          >
                            スケジュールを開く <FaArrowRight className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Timer cards */}
              {savedTimers.map((item) => {
                const segments = item.data?.segments || item.data?.menus || [];
                const totalMin = segments.reduce((s: number, seg: any) => s + (seg.durationMin || seg.duration || 0), 0);
                const segmentPreview = segments.slice(0, 4).map((seg: any) => {
                  const dur = seg.durationMin || seg.duration || 0;
                  return `${seg.name || seg.label || '?'}(${dur}分)`;
                });
                const updatedStr = new Date(item.updatedAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
                return (
                  <div key={`timer-${item.id}`} className="border border-gray-200 rounded-lg pl-0 overflow-hidden group">
                    <div className="flex border-l-4 border-orange-400">
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <FaClock className="text-orange-500 flex-shrink-0" />
                            <span className="font-semibold text-gray-900 truncate">{item.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteToolData(item.id, 'timer')}
                            className="text-gray-300 hover:text-red-500 transition-colors ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-100"
                            aria-label="削除"
                            title="削除"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                        {segmentPreview.length > 0 && (
                          <p className="mt-1.5 text-sm text-gray-600">
                            {segmentPreview.join(' → ')}{segments.length > 4 ? ' …' : ''}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {totalMin > 0 && <span className="mr-3">合計: {totalMin}分</span>}
                            最終更新: {updatedStr}
                          </span>
                          <Link
                            href={`/tools/rehearsal-timer?load=${item.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-100 transition-colors"
                          >
                            タイマーを開く <FaArrowRight className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* アカウント削除 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-2 text-gray-900">アカウント設定</h3>
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">アカウントの削除</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  アカウントとログイン情報が削除されます。投稿済みコメントは匿名として残ります。
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash className="text-xs" />
                削除
              </button>
            </div>
          ) : (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start gap-3 mb-4">
                <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-800">本当に削除しますか？</p>
                  <p className="text-xs text-red-600 mt-1">
                    この操作は取り消せません。アカウント、ログイン情報、プロフィールが完全に削除されます。
                    投稿済みのコメントは匿名（「退会済みユーザー」）として残ります。
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs text-red-700 mb-1">
                  確認のため「削除する」と入力してください
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="削除する"
                  className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              {deleteError && (
                <p className="text-sm text-red-600 mb-3">{deleteError}</p>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== '削除する' || isDeleting}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    deleteConfirmText === '削除する' && !isDeleting
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaTrash className="text-xs" />
                  {isDeleting ? '削除中...' : 'アカウントを完全に削除'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                    setDeleteError('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin?callbackUrl=/mypage',
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const [user, parentCount, childCount, parents, favoriteCount, favorites] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, displayName: true, email: true, image: true, avatarUrl: true, bio: true, groupName: true, createdAt: true },
    }),
    prisma.parentComment.count({ where: { userId, deleted: false } }),
    prisma.childComment.count({ where: { userId, deleted: false } }),
    prisma.parentComment.findMany({
      where: { userId, deleted: false },
      orderBy: { date: 'desc' },
      take: 5,
      include: { post: { select: { id: true, title: true } } },
    }),
    prisma.favorite.count({ where: { userId } }),
    prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { post: { select: { id: true, title: true, author: { select: { name: true } } } } },
    }),
  ]);

  if (!user) {
    return { notFound: true };
  }

  return {
    props: {
      user: {
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        image: user.image,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        groupName: user.groupName,
        createdAt: user.createdAt.toISOString().split('T')[0],
      },
      stats: {
        parentCommentCount: parentCount,
        childCommentCount: childCount,
      },
      recentComments: parents.map((c) => ({
        id: c.id,
        content: c.content,
        date: c.date.toISOString().split('T')[0],
        postTitle: c.post.title,
        postId: c.post.id,
      })),
      favoriteCount,
      favoritePosts: favorites.map((f) => ({
        id: f.post.id,
        title: f.post.title,
        authorName: f.post.author.name,
      })),
    },
  };
};
