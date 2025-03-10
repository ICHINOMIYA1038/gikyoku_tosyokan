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
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <div>
          {post.ratings ? (
            <Star
              star={post.averageRating}
              rateCount={post.ratings.length | 0}
            />
          ) : (
            <Star star={post.averageRating} />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{post.title}</h2>
        <Link
          className=" text-gray-600 mb-4 flex justify-end cursor-pointer hover:underline"
          href={`/authors/${post.author_id}`}
        >
          <span>作者: </span>
          {post.author.name}
          {post.author.group && <span>({post.author.group})</span>}
        </Link>
        {post.categories &&
          post.categories.length !== 0 &&
          post.categories.map((category: any) => (
            <Link
              className="cursor-pointer inline-block"
              href={`/categories/${category.id}`}
            >
              <Badge key={post.id} text={category.name} />
            </Link>
          ))}
        <div className="my-10">
          <h3 className="text-xl font-bold ">
            『{post.title}』の上演時間と人数
          </h3>
          <div className="flex font-bold gap-2 flex-wrap">
            <p>
              <span>男:</span>
              {post.man !== -1 ? `${post.man}人` : "不明"}
            </p>
            <p>
              <span>女:</span>
              {post.woman !== -1 ? `${post.woman}人` : "不明"}
            </p>
            <p>
              <span>その他:</span>
              {post.others !== 0 && post.others !== -1 ? (
                `${post.others}人`
              ) : (
                <></>
              )}
            </p>
            <p>
              <span>総人数:</span>
              {post.totalNumber !== -1 ? `${post.totalNumber}人` : "不明"}
            </p>
            <p>
              <span>上演時間:</span>
              {post.playtime !== -1 ? `${post.playtime}分` : "不明"}
            </p>
          </div>
        </div>
        <div className="font-bold my-10">
          <h3 className="text-xl  font-bold">あらすじ,概要</h3>
          <p className="text-gray-600 mb-4">{post.synopsis}</p>
        </div>

        {post.content && (
          <div className="my-10">
            <h3 className="text-xl font-bold">{post.title}を読んだ感想</h3>
            <CustomMarkdown content={post.content} />
          </div>
        )}

        <div className="my-10">
          <h3 className="text-xl font-bold">
            {post.author.name}さんのプロフィール
          </h3>
          {!post.author.profile ? (
            <div>
              {post.title}の作者、{post.author.name}
              さんの情報はまだありません。ぜひ情報をご提供いただけますと幸いです。
            </div>
          ) : (
            <>
              <div>{post.author.name}</div>
              <div>所属劇団等:{post.author.group}</div>
              <div>ウェブサイト:{post.author.website}</div>
              <CustomMarkdown content={post.author.profile} />
            </>
          )}
        </div>

        <div className="my-10">
          <h3 className="text-xl font-bold">『{post.title}』の台本入手方法</h3>
          {!post.link_to_plot && !post.amazon_text_url && !post.buy_link ? (
            <>
              <div>この台本の入手方法の情報はまだありません。</div>
              <div>ご存じの方がいらっしゃいましたらぜひ報告ください。</div>
            </>
          ) : (
            <></>
          )}
          {post.link_to_plot && (
            <div className="">
              <div>
                この戯曲、{post.author.name}『{post.title}
                』はwebサイト上で無料で公開されています。
              </div>
              <div>下記のURLからぜひ一度ご確認ください。</div>

              <LinkCard href={post.link_to_plot} />
              <div className="flex justify-end">(外部サイトに飛びます)</div>
            </div>
          )}

          {post.buy_link && (
            <div>
              {post.author.name}「{post.title}」
              はこちらのサイトからご購入いただけます。
              <LinkCard href={post.buy_link} />
            </div>
          )}

          {post.amazon_text_url && (
            <>
              <div>
                {post.link_to_plot && <span>また、</span>}
                {post.author.name}『{post.title}
                』はアマゾンや書店などで購入することができます。
              </div>

              <AmazonAffiliateLink
                title={post.title}
                amazonImgUrl={post.amazon_img_url}
                amazonTextUrl={post.amazon_text_url}
              />
              <div className="flex justify-end">(外部サイトに飛びます)</div>
              {post.link_to_plot && (
                <div>
                  本で購入して読んでいただけますとより一層楽しめると思います。ぜひ一度お手にとってみてはいかがでしょうか？
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div >
  );
};

export default PostDetail;
