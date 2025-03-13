import * as React from "react";
import Badge from "@/components/Badge";
import AmazonAffiliateLink from "@/components/Ad/AmazonAffiliateLink";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import LinkCard from "./LinkCard";
import Star from "./Widget/Star";
import CustomMarkdown from './CustomMarkdown';

const queryClient = new QueryClient();

type PostPageProps = {
  post: any;
};

const PostDetail: React.FC<PostPageProps> = ({ post }: PostPageProps) => {
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
      {/* ヘッダーセクション */}
      <div className="mb-6">
        <div className="mb-3">
          {post.ratings ? (
            <Star
              star={post.averageRating}
              rateCount={post.ratings.length | 0}
            />
          ) : (
            <Star star={post.averageRating} />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>

        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="mb-2 md:mb-0">
            {post.categories &&
              post.categories.length !== 0 &&
              post.categories.map((category: any) => (
                <Link
                  key={category.id}
                  className="category-badge cursor-pointer inline-block mr-2 mb-2"
                  href={`/categories/${category.id}`}
                >
                  <Badge text={category.name} />
                </Link>
              ))}
          </div>

          <Link
            className="author-link"
            href={`/authors/${post.author_id}`}
          >
            <span className="text-gray-600">作者: </span>
            <span className="font-medium">{post.author.name}</span>
            {post.author.group && <span className="text-gray-500 ml-1">({post.author.group})</span>}
          </Link>
        </div>
      </div>

      {/* 上演時間と人数セクション */}
      <div className="my-8">
        <h3 className="section-title">
          『{post.title}』の上演時間と人数
        </h3>
        <div className="flex flex-wrap gap-3">
          <div className="info-badge">
            <span className="info-badge-label">男:</span>
            <span className="info-badge-value">{post.man !== -1 ? `${post.man}人` : "不明"}</span>
          </div>
          <div className="info-badge">
            <span className="info-badge-label">女:</span>
            <span className="info-badge-value">{post.woman !== -1 ? `${post.woman}人` : "不明"}</span>
          </div>
          {post.others !== 0 && post.others !== -1 && (
            <div className="info-badge">
              <span className="info-badge-label">その他:</span>
              <span className="info-badge-value">{`${post.others}人`}</span>
            </div>
          )}
          <div className="info-badge">
            <span className="info-badge-label">総人数:</span>
            <span className="info-badge-value">{post.totalNumber !== -1 ? `${post.totalNumber}人` : "不明"}</span>
          </div>
          <div className="info-badge">
            <span className="info-badge-label">上演時間:</span>
            <span className="info-badge-value">{post.playtime !== -1 ? `${post.playtime}分` : "不明"}</span>
          </div>
        </div>
      </div>

      {/* あらすじセクション */}
      <div className="my-8">
        <h3 className="section-title">あらすじ(概要)</h3>
        <p className="text-gray-700 leading-relaxed">{post.synopsis}</p>
      </div>

      {/* 感想セクション */}
      {post.content && (
        <div className="my-8">
          <h3 className="section-title">{post.title}を読んだ感想</h3>
          <div className="prose max-w-none">
            <CustomMarkdown content={post.content} />
          </div>
        </div>
      )}

      {/* 作者プロフィールセクション */}
      <div className="my-8">
        <h3 className="section-title">
          {post.author.name}さんのプロフィール
        </h3>
        {!post.author.profile ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            {post.title}の作者、{post.author.name}
            さんの情報はまだありません。ぜひ情報をご提供いただけますと幸いです。
          </div>
        ) : (
          <div className="space-y-3">
            <div className="font-semibold text-lg">{post.author.name}</div>
            {post.author.group && (
              <div className="text-gray-700">
                <span className="font-medium">所属劇団等:</span> {post.author.group}
              </div>
            )}
            {post.author.website && (
              <div className="text-gray-700">
                <span className="font-medium">ウェブサイト:</span>{" "}
                <a href={post.author.website} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                  {post.author.website}
                </a>
              </div>
            )}
            <div className="prose max-w-none mt-4 p-4 bg-gray-50 rounded-lg">
              <CustomMarkdown content={post.author.profile} />
            </div>
          </div>
        )}
      </div>

      {/* 台本入手方法セクション */}
      <div className="my-8">
        <h3 className="section-title">『{post.title}』の台本入手方法</h3>
        {!post.link_to_plot && !post.amazon_text_url && !post.buy_link ? (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div>この台本の入手方法の情報はまだありません。</div>
            <div className="mt-1">ご存じの方がいらっしゃいましたらぜひ報告ください。</div>
          </div>
        ) : (
          <div className="space-y-6">
            {post.link_to_plot && (
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="mb-2 font-medium text-lg">
                  この戯曲、{post.author.name}『{post.title}
                  』はwebサイト上で無料で公開されています。
                </div>
                <div className="mb-4 text-gray-600">下記のURLからぜひ一度ご確認ください。</div>

                <LinkCard href={post.link_to_plot} />
                <div className="flex justify-end text-sm text-gray-500 mt-2">(外部サイトに飛びます)</div>
              </div>
            )}

            {post.buy_link && (
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="mb-3 font-medium text-lg">
                  {post.author.name}「{post.title}」
                  はこちらのサイトからご購入いただけます。
                </div>
                <LinkCard href={post.buy_link} />
              </div>
            )}

            {post.amazon_text_url && (
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="mb-4 font-medium text-lg">
                  {post.link_to_plot && <span>また、</span>}
                  {post.author.name}『{post.title}
                  』はアマゾンや書店などで購入することができます。
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <AmazonAffiliateLink
                    title={post.title}
                    amazonImgUrl={post.amazon_img_url}
                    amazonTextUrl={post.amazon_text_url}
                  />
                </div>
                <div className="flex justify-end text-sm text-gray-500 mt-2">(外部サイトに飛びます)</div>
                {post.link_to_plot && (
                  <div className="mt-4 text-gray-700 italic p-3 bg-white rounded-lg">
                    本で購入して読んでいただけますとより一層楽しめると思います。ぜひ一度お手にとってみてはいかがでしょうか？
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
