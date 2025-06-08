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

      <p>
        男:{post.man} 女:{post.woman} 総人数:{post.totalNumber} 上演時間:約
        {post.playtime}分
      </p>
      <Link href={`https://gikyokutosyokan.com/posts/${post.id}`}>
        https://gikyokutosyokan.com/posts/{post.id}
      </Link>
      <p>{post.content}</p>
      <p>
        #{post.author.name} #{post.title} #{post.author.group} #戯デジ
        #戯曲デジタルアーカイブ #演劇 #戯曲 #戯曲図書館 #戯曲 #脚本{" "}
        {post.categories.map((category: any) => `#${category.name}`).join(" ")}
      </p>
    </>
  );
};

export default TwitterIntroduction;
