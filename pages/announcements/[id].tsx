import { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuthSSP } from '@/lib/auth';
import { PUBLIC_ANNOUNCEMENT_SELECT } from '@/lib/announcement-public';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import LinkifiedText from '@/components/LinkifiedText';
import { InfoTable, ShareLinks, DETAIL_SECTION_TITLE } from '@/components/BoardDetail';
import { formatJstDateTime } from '@/lib/date-format';
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
  userId?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  theaterGroupName?: string;
  scriptTitle?: string;
  postId?: number;
  post?: { id: number; title: string } | null;
};

export default function AnnouncementDetailPage({ announcement }: { announcement: Announcement }) {
  const router = useRouter();
  const { data: session } = useSession();
  const id = announcement.id;

  const canDelete = !!(
    session?.user?.id &&
    announcement.userId &&
    session.user.id === announcement.userId
  );

  // 表示回数はブラウザで開いたときだけ数える（クローラーでは増やさない）
  useEffect(() => {
    fetch(`/api/announcements/${id}`).catch(() => {});
  }, [id]);

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

  const shareUrl = `https://gikyokutosyokan.com/announcements/${announcement.id}`;
  const shareTitle = `【公演告知】${announcement.title}`;

  const displayScriptTitle = announcement.post?.title || announcement.scriptTitle;

  return (
    <>
      <Seo
        pageTitle={`${announcement.title} | 公演告知掲示板`}
        pageDescription={announcement.content.replace(/\s+/g, ' ').substring(0, 160)}
        pageImg={announcement.images?.[0]}
        pagePath={`/announcements/${announcement.id}`}
        pageType="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "ホーム", url: "https://gikyokutosyokan.com" },
          { name: "上演告知", url: "https://gikyokutosyokan.com/announcements" },
          { name: announcement.title, url: `https://gikyokutosyokan.com/announcements/${announcement.id}` },
        ]}
      />
      <Layout>
        <article className="max-w-3xl mx-auto pt-6 md:pt-8 pb-12">
          <Breadcrumb items={[{ name: 'ホーム', href: '/' }, { name: '上演告知', href: '/announcements' }, { name: announcement.title }]} />

          <header>
            <p className="text-sm text-gray-600">上演告知</p>
            <h1 className="mt-1 text-[24px] md:text-[32px] font-serif font-bold text-gray-900 leading-snug">{announcement.title}</h1>
            <p className="mt-3 text-sm text-gray-600">
              {announcement.authorName}
              <span className="mx-2">・</span>
              {formatJstDateTime(announcement.createdAt)}に投稿
              <span className="mx-2">・</span>
              {announcement.views.toLocaleString()}回表示
            </p>
          </header>

          <div className="mt-6">
            <InfoTable
              rows={[
                { label: '公演日時', value: announcement.performanceDate ? formatJstDateTime(announcement.performanceDate) : null },
                { label: '会場', value: announcement.venue },
                {
                  label: '上演作品',
                  value: announcement.post ? (
                    <Link href={`/posts/${announcement.post.id}`} className="text-theater-primary-700 underline underline-offset-4">
                      {announcement.post.title}
                    </Link>
                  ) : displayScriptTitle,
                },
                { label: '劇団・団体', value: announcement.theaterGroupName },
                { label: 'チケット', value: announcement.ticketPrice },
              ]}
            />
          </div>

          <section className="mt-8">
            <h2 className="sr-only">詳細</h2>
            <LinkifiedText text={announcement.content} className="text-base leading-[1.9] text-gray-900" />
          </section>

          {announcement.contactInfo && (
            <section className="mt-8 pt-6 border-t border-[#D9D5CF]">
              <h2 className={DETAIL_SECTION_TITLE}>連絡先・予約方法</h2>
              <LinkifiedText text={announcement.contactInfo} className="mt-3 text-base leading-relaxed text-gray-900" />
            </section>
          )}

          <div className="mt-8 pt-6 border-t border-[#D9D5CF] flex flex-wrap items-center justify-between gap-4">
            <ShareLinks url={shareUrl} text={shareTitle} />
            {canDelete && (
              <button onClick={handleDelete} className="h-10 px-3 text-sm text-gray-700 underline underline-offset-4 hover:text-theater-primary-700">
                この告知を削除する
              </button>
            )}
          </div>

          {announcement.updatedAt !== announcement.createdAt && (
            <p className="mt-4 text-xs text-gray-500">最終更新：{formatJstDateTime(announcement.updatedAt)}</p>
          )}

          <p className="mt-6 text-xs text-gray-500">
            <span className="mr-1 px-1 border border-[#D9D5CF] rounded">PR</span>
            公演チラシ・パンフレットの印刷なら
            <a
              href="https://px.a8.net/svt/ejp?a8mat=4BA6D7+G3AUP6+4JZ2+5YJRM"
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="ml-1 text-gray-700 underline underline-offset-2"
            >
              いろぷり（ネット印刷）
            </a>
            <img src="https://www17.a8.net/0.gif?a8mat=4BA6D7+G3AUP6+4JZ2+5YJRM" width="1" height="1" alt="" style={{ border: 0, display: 'inline' }} />
          </p>

          <aside className="mt-10 border border-[#D9D5CF] rounded p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-800">あなたの公演も、ここで告知できます。投稿は無料です。</p>
            <div className="flex gap-2 shrink-0">
              <Link href="/announcements" className="inline-flex items-center h-11 px-4 rounded border border-[#D9D5CF] text-sm text-gray-800 hover:bg-[#F4F2EE]">
                一覧に戻る
              </Link>
              <Link href="/announcements/new" className="inline-flex items-center h-11 px-5 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold">
                告知を投稿する
              </Link>
            </div>
          </aside>
        </article>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.params?.id as string);
  if (isNaN(id)) return { notFound: true };

  const found = await prisma.announcement.findUnique({ where: { id }, select: PUBLIC_ANNOUNCEMENT_SELECT });
  if (!found || found.deletedAt) return { notFound: true };

  // 未承認の告知は投稿した本人だけが見られる
  if (found.status !== 'approved') {
    const session = await getAuthSSP(context);
    if (!session || session.user.id !== found.userId) return { notFound: true };
  }

  const { deletedAt: _deletedAt, ...announcement } = found;
  return { props: { announcement: JSON.parse(JSON.stringify(announcement)) } };
};
