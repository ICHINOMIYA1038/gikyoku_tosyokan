import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaCalendarAlt, FaMapMarkerAlt, FaEye, FaPlus, FaClock, FaTheaterMasks } from 'react-icons/fa';
import Seo from '@/components/seo';

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
};

export default function AnnouncementsPage() {
  const router = useRouter();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPerformanceDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) return `${minutes}分前`;
    return 'たった今';
  };

  return (
    <>
      <Seo
        pageTitle="公演告知掲示板 | 戯曲図書館"
        pageDescription="演劇・舞台の公演告知を自由に投稿・閲覧できる掲示板です。公演情報を広く発信しましょう。"
        pagePath="/announcements"
        pageType="website"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white">
          {/* ヘッダーセクション */}
          <div className="bg-gradient-to-r from-theater-primary-100 via-theater-secondary-50 to-theater-primary-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-theater-neutral-900 flex items-center gap-3">
                  <FaTheaterMasks className="text-theater-primary-500" />
                  公演告知掲示板
                </h1>
                <Link
                  href="/announcements/new"
                  className="bg-theater-primary-500 hover:bg-theater-primary-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg"
                >
                  <FaPlus />
                  告知を投稿
                </Link>
              </div>
              <p className="text-theater-neutral-700 text-lg">
                演劇・舞台の公演情報を自由に投稿できます。どなたでも無料でご利用いただけます。
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theater-primary-500"></div>
              </div>
            ) : !announcements || announcements.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaTheaterMasks className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">まだ告知がありません</p>
                <Link
                  href="/announcements/new"
                  className="inline-flex items-center gap-2 bg-theater-primary-500 hover:bg-theater-primary-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  <FaPlus />
                  最初の告知を投稿する
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {announcements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.id}`}
                    className="block"
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-theater-primary-200">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-bold text-theater-neutral-900 hover:text-theater-primary-600 transition-colors">
                          {announcement.title}
                        </h2>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FaClock />
                          {getTimeAgo(announcement.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-3 text-sm">
                        {announcement.performanceDate && (
                          <div className="flex items-center gap-1 text-theater-secondary-600">
                            <FaCalendarAlt />
                            <span>{formatPerformanceDate(announcement.performanceDate)}</span>
                          </div>
                        )}
                        {announcement.venue && (
                          <div className="flex items-center gap-1 text-theater-accent-blue">
                            <FaMapMarkerAlt />
                            <span>{announcement.venue}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-500">
                          <FaEye />
                          <span>{announcement.views}回閲覧</span>
                        </div>
                      </div>
                      
                      <p className="text-theater-neutral-700 line-clamp-2 mb-3">
                        {announcement.content}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          投稿者: {announcement.authorName}
                        </span>
                        <span className="text-theater-primary-600 font-medium text-sm">
                          詳細を見る →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  前へ
                </button>
                <span className="px-4 py-2 bg-theater-primary-100 rounded-lg font-medium">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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