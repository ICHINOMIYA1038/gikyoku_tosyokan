import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import AmazonAffiliateLink from "@/components/Ad/AmazonAffiliateLink";
import ExternalLinkButton from "@/components/ExternalLinkButton";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string; group: string } };
};
const PostDetail: React.FC<PostPageProps> = ({ post }: PostPageProps) => {
  console.log(post);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-2"></div>
        <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
        <p className="text-gray-600 mb-4">
          {post.author.name}
          <span>({post.author.group})</span>
        </p>
        <div className="flex font-bold gap-5">
          <p>
            <span>男:</span>
            {post.man !== -1 ? `${post.man}人` : "不明"}
          </p>
          <p>
            <span>女:</span>
            {post.woman !== -1 ? `${post.woman}人` : "不明"}
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
        <div className="font-bold">
          <p>【あらすじ,概要】</p>
          <p className="text-gray-600 mb-4">{post.synopsis}</p>
        </div>
        <p className="text-gray-600 mb-4">{post.synopsis}</p>
        {post.content && (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
        {post.link_to_plot && (
          <>
            <div>この戯曲は無料で公開されています。</div>
            <div>下記のURLからご確認ください。</div>
            <div className="flex justify-end">(外部サイトに飛びます)</div>
            <ExternalLinkButton title={post.title} url={post.link_to_plot} />
          </>
        )}

        {post.amazon_text_url && (
          <>
            <div>この本はアマゾンや書店などで購入することができます。</div>
            <div className="flex justify-end">(外部サイトに飛びます)</div>
            <AmazonAffiliateLink
              title={post.title}
              amazonImgUrl={post.amazon_img_url}
              amazonTextUrl={post.amazon_text_url}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
