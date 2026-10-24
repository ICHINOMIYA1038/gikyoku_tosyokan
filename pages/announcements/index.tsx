import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import BoardHeader, { BoardEmpty, BOARD_ROW_TITLE } from '@/components/BoardHeader';
import { performanceDateParts, timeAgo } from '@/lib/date-format';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';

type Announcement = {
  id: number;
  title: string;
  content: string;
  performanceDate?: string;
  venue?: string;
  ticketPrice?: string;
  contactInfo?: string;
  authorName: string;
  createdAt: string;
  views: number;
  theaterGroupName?: string;
  scriptTitle?: string;
  postId?: number;
  post?: { id: number; title: string } | null;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/announcements?page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data = await response.json();
      setAnnouncements(data.announcements || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const scriptLabel = (a: Announcement) => {
    const title = a.post?.title || a.scriptTitle;
    if (!title) return null;
    return /^[『「]/.test(title) ? title : `『${title}』`;
  };

  return (
    <>
      <Seo
        pageTitle="公演告知掲示板 | 戯曲図書館"
        pageDescription="演劇・舞台の公演告知を自由に投稿・閲覧できる掲示板です。公演情報を広く発信しましょう。"
        pagePath="/announcements"
        pageType="website"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "上演告知", url: "https://gikyokutosyokan.com/announcements" },
        ]}
      />
      <Layout>
        <div className="max-w-5xl mx-auto pb-12">
          <BoardHeader
            current="announcements"
            title="上演告知"
            description="これからの公演のお知らせ。劇団・個人のどなたでも投稿できます。"
            postHref="/announcements/new"
            postLabel="告知を投稿する"
          />

          <div className="mt-8">
            {loading ? (
              <p className="py-12 text-center text-gray-500">読み込み中…</p>
            ) : announcements.length === 0 ? (
              <BoardEmpty message="まだ告知はありません。" postHref="/announcements/new" postLabel="最初の告知を投稿する" />
            ) : (
              <ul className="border-t border-[#D9D5CF]">
                {announcements.map((a) => {
                  const date = a.performanceDate ? performanceDateParts(a.performanceDate) : null;
                  const meta = [a.venue, a.theaterGroupName, scriptLabel(a)].filter(Boolean).join("　/　");
                  return (
                    <li key={a.id} className="border-b border-[#D9D5CF]">
                      <Link
                        href={`/announcements/${a.id}`}
                        className="group grid grid-cols-[3.75rem_minmax(0,1fr)] md:grid-cols-[6.5rem_minmax(0,1fr)_9rem] gap-x-4 py-4 px-2 hover:bg-[#F4F2EE] transition-colors"
                      >
                        <div className="tabular-nums leading-tight">
                          {date ? (
                            <>
                              {date.year && <span className="block text-xs text-gray-500">{date.year}</span>}
                              <span className="block font-bold text-gray-900">{date.monthDay}</span>
                              <span className="block text-sm text-gray-600">（{date.weekday}）</span>
                            </>
                          ) : (
                            <span className="block text-sm text-gray-500">日程未定</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h2 className={BOARD_ROW_TITLE}>
                            {a.title}
                          </h2>
                          {meta && <p className="mt-1 text-sm text-gray-700 truncate">{meta}</p>}
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{a.content}</p>
                          <p className="md:hidden mt-2 text-xs text-gray-500">
                            {a.authorName}・{timeAgo(a.createdAt)}
                          </p>
                        </div>
                        <div className="hidden md:block text-right text-xs text-gray-500 leading-relaxed">
                          <p className="truncate">{a.authorName}</p>
                          <p>{timeAgo(a.createdAt)}</p>
                          <p>{a.views.toLocaleString()}回表示</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 text-sm">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="h-10 px-4 rounded border border-[#D9D5CF] disabled:opacity-40 hover:bg-[#F4F2EE]"
                >
                  前へ
                </button>
                <span className="tabular-nums text-gray-700">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="h-10 px-4 rounded border border-[#D9D5CF] disabled:opacity-40 hover:bg-[#F4F2EE]"
                >
                  次へ
                </button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
