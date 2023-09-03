import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import { Post as PostType } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import AmazonAffiliateLink from "@/components/Ad/AmazonAffiliateLink";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};
const PostDetail: React.FC<PostPageProps> = ({ post }: PostPageProps) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-2"></div>
        <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.synopsis}</p>
        {post.content && (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
        <AmazonAffiliateLink
          title={post.title}
          amazonImgUrl={post.amazon_img_url}
          amazonTextUrl={post.amazon_text_url}
        />
      </div>
    </div>
  );
};

export default PostDetail;
