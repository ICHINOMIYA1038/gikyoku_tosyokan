import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FaUser, FaCommentDots, FaTheaterMasks, FaHeart } from 'react-icons/fa';

interface Props {
  profile: {
    id: string;
    name: string;
    displayName: string | null;
    image: string | null;
    avatarUrl: string | null;
    bio: string | null;
    groupName: string | null;
    createdAt: string;
  };
  stats: {
    commentCount: number;
    favoriteCount: number;
  };
  recentComments: Array<{
    id: number;
    content: string;
    date: string;
    commentType: string | null;
    postTitle: string;
    postId: number;
  }>;
}

export default function UserProfile({ profile, stats, recentComments }: Props) {
  const displayName = profile.displayName || profile.name || 'ユーザー';
  const avatar = profile.avatarUrl || profile.image;

  return (
    <Layout>
      <Seo
        pageTitle={`${displayName}のプロフィール`}
        pageDescription={`${displayName}さんの戯曲図書館でのプロフィール`}
        pagePath={`/users/${profile.id}`}
      />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* プロフィールカード */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={displayName} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-3xl text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
              {profile.groupName && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <FaTheaterMasks className="text-xs text-gray-400" />
                  {profile.groupName}
                </p>
              )}
              {profile.bio && (
                <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{profile.bio}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {profile.createdAt} から利用
              </p>
            </div>
          </div>

          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <FaCommentDots className="text-theater-primary-500" />
              <span className="font-medium">{stats.commentCount}</span>
              <span className="text-gray-400">コメント</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <FaHeart className="text-theater-primary-500" />
              <span className="font-medium">{stats.favoriteCount}</span>
              <span className="text-gray-400">お気に入り</span>
            </div>
          </div>
        </div>

        {/* 最近のコメント */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4">最近のコメント</h2>
          {recentComments.length === 0 ? (
            <p className="text-sm text-gray-500">まだコメントがありません。</p>
          ) : (
            <ul className="space-y-4">
              {recentComments.map((c) => (
                <li key={c.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <Link
                    href={`/posts/${c.postId}`}
                    className="text-sm text-theater-primary-600 hover:underline font-medium"
                  >
                    {c.postTitle}
                  </Link>
                  {c.commentType && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {c.commentType}
                    </span>
                  )}
                  <p className="text-sm text-gray-700 mt-1 line-clamp-3">{c.content}</p>
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = params?.id as string;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      displayName: true,
      image: true,
      avatarUrl: true,
      bio: true,
      groupName: true,
      createdAt: true,
    },
  });

  if (!user) return { notFound: true };

  const [commentCount, favoriteCount, comments] = await Promise.all([
    prisma.parentComment.count({
      where: { userId: id, deleted: false, commentType: { not: 'リアクション' } },
    }),
    prisma.favorite.count({ where: { userId: id } }),
    prisma.parentComment.findMany({
      where: { userId: id, deleted: false, commentType: { not: 'リアクション' } },
      orderBy: { date: 'desc' },
      take: 10,
      include: { post: { select: { id: true, title: true } } },
    }),
  ]);

  return {
    props: {
      profile: {
        id: user.id,
        name: user.name || '',
        displayName: user.displayName,
        image: user.image,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        groupName: user.groupName,
        createdAt: user.createdAt.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' }),
      },
      stats: { commentCount, favoriteCount },
      recentComments: comments.map((c) => ({
        id: c.id,
        content: c.content,
        date: c.date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }),
        commentType: c.commentType,
        postTitle: c.post.title,
        postId: c.post.id,
      })),
    },
  };
};
