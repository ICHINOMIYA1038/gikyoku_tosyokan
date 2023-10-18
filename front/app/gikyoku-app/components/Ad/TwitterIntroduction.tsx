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
        #{post.author.name} #{post.title} #{post.author.group} #戯デジ
        #戯曲デジタルアーカイブ #ヒューマンドラマ #コメディ #演劇 #戯曲
        #銀河鉄道の夜 #戯曲図書館 #戯曲 #脚本{" "}
        {post.categories.map((category: any) => `#${category}`).join(" ")}
      </p>
    </>
  );
};

export default TwitterIntroduction;
