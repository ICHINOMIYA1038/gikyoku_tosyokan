import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaYenSign, FaPhone, FaUser, FaEye, FaClock, FaTheaterMasks, FaArrowLeft, FaTrash, FaShareAlt } from 'react-icons/fa';
import {
  TwitterShareButton,
  FacebookShareButton,
  LineShareButton,
  TwitterIcon,
  FacebookIcon,
  LineIcon,
} from 'react-share';
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
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
};

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [showShareButtons, setShowShareButtons] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch(`/api/announcements/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAnnouncement(data);
        
        // 削除権限のチェック（簡易的にローカルストレージで管理）
        const userIp = localStorage.getItem('userIpAddress');
        if (userIp && data.ipAddress === userIp) {
          setCanDelete(true);
        }
      } else if (response.status === 404) {
        router.push('/announcements');
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この告知を削除してもよろしいですか？')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('告知を削除しました');
        router.push('/announcements');
      } else {
        alert('削除に失敗しました。投稿者のみが削除できます。');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('削除に失敗しました');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPerformanceDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theater-primary-500"></div>
        </div>
      </Layout>
    );
  }

  if (!announcement) {
    return null;
  }

  const shareUrl = `https://gikyokutosyokan.com/announcements/${announcement.id}`;
  const shareTitle = `【公演告知】${announcement.title}`;

  return (
    <>
      <Seo
        pageTitle={`${announcement.title} | 公演告知掲示板`}
        pageDescription={announcement.content.substring(0, 160)}
        pagePath={`/announcements/${announcement.id}`}
        pageType="article"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white">
          {/* ヘッダーセクション */}
          <div className="bg-gradient-to-r from-theater-primary-100 via-theater-secondary-50 to-theater-primary-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 text-theater-primary-600 hover:text-theater-primary-700 mb-4 transition-colors"
              >
                <FaArrowLeft />
                <span>告知一覧に戻る</span>
              </Link>
              
              <h1 className="text-2xl md:text-3xl font-bold text-theater-neutral-900 mb-4">
                {announcement.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-theater-neutral-700">
                <div className="flex items-center gap-1">
                  <FaUser />
                  <span>{announcement.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock />
                  <span>投稿日: {formatDate(announcement.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEye />
                  <span>{announcement.views}回閲覧</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* 公演情報カード */}
            {(announcement.performanceDate || announcement.venue || announcement.ticketPrice) && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaTheaterMasks className="text-theater-primary-500" />
                  公演情報
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {announcement.performanceDate && (
                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="text-theater-secondary-500 mt-1" />
                      <div>
                        <p className="font-medium">公演日時</p>
                        <p className="text-theater-neutral-700">
                          {formatPerformanceDate(announcement.performanceDate)}
                        </p>
                      </div>
                    </div>
                  )}
                  {announcement.venue && (
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-theater-accent-blue mt-1" />
                      <div>
                        <p className="font-medium">会場</p>
                        <p className="text-theater-neutral-700">{announcement.venue}</p>
                      </div>
                    </div>
                  )}
                  {announcement.ticketPrice && (
                    <div className="flex items-start gap-3">
                      <FaYenSign className="text-theater-accent-yellow mt-1" />
                      <div>
                        <p className="font-medium">チケット料金</p>
                        <p className="text-theater-neutral-700">{announcement.ticketPrice}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 内容 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">詳細</h2>
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap text-theater-neutral-700">
                  {announcement.content}
                </p>
              </div>
            </div>

            {/* 連絡先 */}
            {announcement.contactInfo && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaPhone className="text-theater-primary-500" />
                  連絡先・予約方法
                </h2>
                <p className="whitespace-pre-wrap text-theater-neutral-700">
                  {announcement.contactInfo}
                </p>
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex gap-4">
              {/* シェアボタン */}
              <div className="relative">
                <button
                  onClick={() => setShowShareButtons(!showShareButtons)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                  <FaShareAlt />
                  共有
                </button>
                
                {showShareButtons && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg p-3 flex gap-2">
                    <TwitterShareButton url={shareUrl} title={shareTitle}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <FacebookShareButton url={shareUrl} quote={shareTitle}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <LineShareButton url={shareUrl} title={shareTitle}>
                      <LineIcon size={32} round />
                    </LineShareButton>
                  </div>
                )}
              </div>

              {/* 削除ボタン（投稿者のみ表示） */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                >
                  <FaTrash />
                  削除
                </button>
              )}
            </div>

            {/* 最終更新日時 */}
            {announcement.updatedAt !== announcement.createdAt && (
              <p className="text-sm text-gray-500 mt-6">
                最終更新: {formatDate(announcement.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}