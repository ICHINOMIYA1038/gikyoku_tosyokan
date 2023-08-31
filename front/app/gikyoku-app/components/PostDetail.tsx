import * as React from "react";
import Image from "next/image";
import Badge from "@/components/Badge";
import ReactMarkdown from "react-markdown";

interface BlogPostProps {
  post: {
    badgeTexts: string[];
    title: string;
    image_url: string;
    content: string;
    catchphrase: string;
  };
}

const PostDetail: React.FC<BlogPostProps> = ({ post }) => {
  const { badgeTexts, title, image_url, content, catchphrase } = post;
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-2">
          {badgeTexts.map((badge, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 text-gray-800 px-2 py-1 text-xs mr-2 rounded"
            >
              {badge}
            </span>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{catchphrase}</p>
        <ReactMarkdown className="text-gray-700">{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PostDetail;
