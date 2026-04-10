import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FaUser, FaCommentDots } from 'react-icons/fa';

interface Props {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
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
}

export default function MyPage({ user, stats, recentComments }: Props) {
  return (
    <Layout>
      <Seo pageTitle="マイページ" pageDescription="戯曲図書館マイページ" pagePath="/mypage" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">マイページ</h1>

        {/* プロフィールカード */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? 'user'}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-3xl text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name ?? 'ユーザー'}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">登録日: {user.createdAt}</p>
            </div>
          </div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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

        {/* 最近のコメント */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

  const [user, parentCount, childCount, parents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true, createdAt: true },
    }),
    prisma.parentComment.count({ where: { userId, deleted: false } }),
    prisma.childComment.count({ where: { userId, deleted: false } }),
    prisma.parentComment.findMany({
      where: { userId, deleted: false },
      orderBy: { date: 'desc' },
      take: 5,
      include: { post: { select: { id: true, title: true } } },
    }),
  ]);

  if (!user) {
    return { notFound: true };
  }

  return {
    props: {
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
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
    },
  };
};
