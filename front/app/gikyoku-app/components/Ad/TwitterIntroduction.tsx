import Link from "next/link";
import React from "react";

const TwitterIntroduction = ({ post }: any) => {
  return (
    <>
      <p>
        【新着作品】
        {post.author.name}さん 作『{post.title}
        』のあらすじと感想を公開しました！　読んだ！上演した！上演する！などご気軽にコメントください！
      </p>
      <p>{post.synopsis}</p>
      <Link href={`https://gikyokutosyokan.com/posts/${post.id}`}>
        https://gikyokutosyokan.com/posts/{post.id}
      </Link>
      <p>
        #{post.author.name} #{post.title} #{post.author.group}
      </p>
    </>
  );
};

export default TwitterIntroduction;
