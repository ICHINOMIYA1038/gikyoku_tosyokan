import * as React from "react";
import Link from "next/link";
import { PrismaClient, Author as AuthorType } from "@prisma/client";
import Layout from "@/components/Layout";
import PostCardSmall from "@/components/PostCardSmall";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import LinkCard from "@/components/LinkCard";
import CustomMarkdown from "@/components/CustomMarkdown";
import { FaUser, FaUsers, FaGlobe, FaBook, FaTheaterMasks, FaExternalLinkAlt } from "react-icons/fa";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
const prisma = new PrismaClient();

function AuthorPage({ author }: any) {
  const postCount = author.posts?.length || 0;

  // 代表作（評価順×レビュー数で上位を抽出。最大5件）
  const topPosts = React.useMemo(() => {
    if (!author.posts || author.posts.length === 0) return [];
    const scored = author.posts
      .filter((p: any) => (p.averageRating || 0) > 0 || (p._count?.comments || 0) > 0)
      .map((p: any) => ({
        post: p,
        score: (p.averageRating || 0) * 2 + (p._count?.comments || 0),
      }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 5)
      .map((x: any) => x.post);
    return scored;
  }, [author.posts]);

  return (
    <Layout>
      <Seo
        pageTitle={`${author.name}の戯曲一覧 - 戯曲図書館`}
        pageDescription={`${author.name}${author.group ? `（${author.group}）` : ''}の演劇脚本・戯曲を${postCount}作品掲載。${author.profile ? author.profile.substring(0, 100) : '文化祭・学園祭・部活動に最適な脚本をお探しの方へ。'}`}
        pagePath={`/authors/${author.id}`}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: 'https://gikyokutosyokan.com' },
          { name: '作者一覧', url: 'https://gikyokutosyokan.com/authors' },
          { name: author.name, url: `https://gikyokutosyokan.com/authors/${author.id}` },
        ]}
      />
      <StructuredData
        type="Person"
        personInfo={{
          name: author.name,
          url: `https://gikyokutosyokan.com/authors/${author.id}`,
          description: author.profile || `${author.name}${author.group ? `（${author.group}）` : ''}の戯曲・脚本作品を${postCount}件掲載。`,
          worksCount: postCount,
          sameAs: author.website ? [author.website] : undefined,
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white">
        {/* ヒーローセクション */}
        <div className="bg-gradient-to-r from-theater-primary-100 to-theater-primary-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start gap-6">
              {/* アバター部分 */}
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-4xl text-theater-primary-500" />
                </div>
              </div>
              
              {/* 作者情報 */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-theater-neutral-900 mb-2">
                  {author.name}
                </h1>
                
                {author.group && (
                  <div className="flex items-center gap-2 text-theater-neutral-700 mb-4">
                    <FaUsers className="text-theater-primary-400" />
                    <span className="text-lg">{author.group}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 text-theater-neutral-700">
                  <div className="flex items-center gap-2">
                    <FaBook className="text-theater-primary-400" />
                    <span>{postCount}作品</span>
                  </div>
                  {author.website && (
                    <a 
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-theater-primary-600 hover:text-theater-primary-700 transition-colors"
                    >
                      <FaGlobe />
                      <span>公式サイト</span>
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* プロフィール */}
          {(author.profile || author.website) && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUser className="text-theater-primary-500" />
                プロフィール
              </h2>
              
              {author.profile && (
                <div className="prose prose-lg max-w-none mb-6">
                  <CustomMarkdown content={author.profile} />
                </div>
              )}
              
              {author.website && (
                <div className="border-t pt-4">
                  <LinkCard href={author.website} />
                </div>
              )}
            </div>
          )}

          {/* 代表作セクション（評価×レビュー数で抽出） */}
          {topPosts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-theater-neutral-900 flex items-center gap-2">
                  ⭐ {author.name}の代表作
                </h2>
                <span className="text-sm text-theater-neutral-600">評価の高い作品</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                {topPosts.map((post: any) => (
                  <PostCardSmall post={post} key={post.id} />
                ))}
              </div>
            </div>
          )}

          {/* 作品一覧セクション */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-theater-neutral-900 flex items-center gap-2">
                <FaTheaterMasks className="text-theater-primary-500" />
                作品一覧
              </h2>
              <span className="text-sm text-theater-neutral-600">
                全{postCount}作品
              </span>
            </div>

            {author.posts && author.posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                {author.posts.map((post: any) => (
                  <PostCardSmall post={post} key={post.id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaTheaterMasks className="text-6xl text-theater-neutral-300 mx-auto mb-4" />
                <p className="text-theater-neutral-600">
                  現在この作者の作品は登録されていません
                </p>
              </div>
            )}
          </div>

          {/* 広告: 作品一覧の後ろに配置（読者の回遊を遮らない） */}
          <div className="mt-6">
            <AdSlot slot={AD_SLOTS.AUTHOR_AFTER_PROFILE} format="horizontal" />
          </div>

          {/* 関連情報セクション */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-theater-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-theater-neutral-900">
                📚 作品について
              </h3>
              <div className="space-y-2 text-theater-neutral-700 text-sm">
                <p>• 各作品の詳細ページで台本の入手方法をご確認ください</p>
                <p>• 著作権や上演料については各作品ページをご参照ください</p>
                <p>• 上演時間や必要人数で絞り込み検索も可能です</p>
              </div>
            </div>
            
            <div className="bg-theater-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-theater-neutral-900">
                💡 お探しの作品が見つからない場合
              </h3>
              <div className="space-y-2 text-theater-neutral-700 text-sm">
                <p>• トップページの検索機能をご利用ください</p>
                <p>• カテゴリー別の作品一覧もご覧ください</p>
                <p>• 掲載依頼フォームから新規掲載もお申し込みいただけます</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AuthorPage;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context: any) {
  const authorId = parseInt(context.params.id);
  if (isNaN(authorId)) {
    return {
      notFound: true,
    };
  }
  
  try {
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
        group: true,
        profile: true,
        website: true,
        posts: {
          select: {
            id: true,
            title: true,
            synopsis: true,
            image_url: true,
            man: true,
            woman: true,
            totalNumber: true,
            playtime: true,
            averageRating: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
        },
      },
    });

    if (!author) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        author,
      },
      revalidate: 604800,
    };
  } catch {
    return {
      notFound: true,
    };
  }
}