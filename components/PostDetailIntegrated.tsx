import * as React from "react";
import Link from "next/link";
import Star from "./Widget/Star";
import CustomMarkdown from './CustomMarkdown';
import {
  FaClock, FaUsers, FaMale, FaFemale, FaTheaterMasks,
  FaTag, FaPen, FaBook, FaInfoCircle, FaQuoteLeft,
  FaExternalLinkAlt, FaHeart,
  FaEye, FaCalendar, FaGlobe
} from "react-icons/fa";
import AdSlot from "./Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
import AiImageBadge from "./AiImageBadge";
import Image from "next/image";
import { trackAffiliateClick } from "@/lib/gtag";

type PostPageProps = {
  post: any;
};

// --- ヒーロー: Filmarks/AniList型 ---
export const PostHero: React.FC<PostPageProps> = ({ post }) => {
  const initial = post.title.charAt(0);
  const man = (post.man != null && post.man > 0) ? post.man : 0;
  const woman = (post.woman != null && post.woman > 0) ? post.woman : 0;
  const others = (post.others != null && post.others > 0) ? post.others : 0;
  const castTotal = man + woman + others;

  return (
    <div className="flex flex-col sm:flex-row gap-5 md:gap-6">
      {/* ポスター */}
      <div className="flex-shrink-0 self-center sm:self-start">
        <div className="relative">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title}
              width={160} height={220}
              fetchPriority="high"
              decoding="async"
              className="w-36 h-[200px] md:w-40 md:h-[220px] object-cover rounded-lg shadow-md" />
          ) : (
            <div className="w-36 h-[200px] md:w-40 md:h-[220px] bg-gradient-to-br from-theater-primary-400 via-pink-400 to-purple-500 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-5xl font-serif font-bold text-white/90 drop-shadow">{initial}</span>
            </div>
          )}
          <AiImageBadge imageUrl={post.image_url} />
        </div>
        {/* 閲覧数・評価数 */}
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><FaEye />{post._count?.accesses || 0}</span>
          <span className="flex items-center gap-1"><FaHeart />{post._count?.ratings || 0}</span>
        </div>
      </div>

      {/* メイン情報 */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {/* 作者名 — テキストリンク */}
        <p className="mt-1">
          <Link href={`/authors/${post.author_id}`} className="text-theater-primary-600 hover:underline font-medium text-sm">
            {post.author.name}
          </Link>
          {post.author.group && <span className="text-gray-400 text-sm ml-1">({post.author.group})</span>}
        </p>

        {/* 評価 */}
        {post.averageRating > 0 && (
          <div className="mt-2">
            <Star star={post.averageRating} rateCount={post._count?.ratings || 0} />
          </div>
        )}

        {/* スペックテーブル — AniList型 */}
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {post.playtime != null && post.playtime > 0 && (
            <>
              <dt className="text-gray-400">上演時間</dt>
              <dd className="text-gray-800 font-medium">{post.playtime}分</dd>
            </>
          )}
          {post.totalNumber != null && post.totalNumber > 0 && (
            <>
              <dt className="text-gray-400">総人数</dt>
              <dd className="text-gray-800 font-medium">{post.totalNumber}人</dd>
            </>
          )}
          {post.categories && post.categories.length > 0 && (
            <>
              <dt className="text-gray-400">カテゴリ</dt>
              <dd className="flex flex-wrap gap-1">
                {post.categories.map((cat: any) => (
                  <Link key={cat.id} href={`/categories/${cat.id}`}
                    className="text-theater-primary-600 hover:underline text-sm font-medium">
                    {cat.name}
                  </Link>
                ))}
              </dd>
            </>
          )}
        </dl>

        {/* 男女比 — 目立つバー */}
        {castTotal > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-500 mb-1.5">キャスト男女比</p>
            <div className="flex h-6 rounded overflow-hidden text-xs font-bold text-white">
              {man > 0 && (
                <div className="bg-blue-500 flex items-center justify-center px-2 min-w-[2rem]"
                  style={{ width: `${(man / castTotal) * 100}%` }}>
                  ♂{man}
                </div>
              )}
              {woman > 0 && (
                <div className="bg-pink-500 flex items-center justify-center px-2 min-w-[2rem]"
                  style={{ width: `${(woman / castTotal) * 100}%` }}>
                  ♀{woman}
                </div>
              )}
              {others > 0 && (
                <div className="bg-gray-400 flex items-center justify-center px-2 min-w-[2rem]"
                  style={{ width: `${(others / castTotal) * 100}%` }}>
                  他{others}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTAボタン */}
        <PurchaseCTAs post={post} />
      </div>
    </div>
  );
};

// --- 購入CTA（販売確認済みの作品のみ表示） ---
const PurchaseCTAs: React.FC<{ post: any }> = ({ post }) => {
  const hasAnyPurchaseLink = !!(post.amazon_text_url || post.ISBN_13 || post.kangeki_url || post.link_to_plot);
  if (!hasAnyPurchaseLink) {
    return (
      <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-700 mb-1">📕 台本の入手情報</p>
        <p>
          現在この作品の台本販売情報は確認できていません。
          上演希望の場合は、作者または劇団へ直接お問い合わせください。
          {post.author?.twitter_url && (
            <>
              {" "}
              <a
                href={post.author.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theater-primary-600 hover:underline font-medium"
              >
                作者のTwitter
              </a>
              から連絡を取れる場合があります。
            </>
          )}
        </p>
      </div>
    );
  }

  // モバイルで44px以上のタップターゲットを確保（Apple HIG / WCAG基準）
  const btnBase = "inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-sm font-bold rounded transition-colors";

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {post.link_to_plot && (
        <a href={post.link_to_plot} target="_blank" rel="noopener noreferrer"
          className={`${btnBase} bg-theater-primary-600 hover:bg-theater-primary-700 text-white`}>
          <FaBook className="text-xs" /> 無料で読む
        </a>
      )}
      {post.amazon_text_url && (
        <a href={post.amazon_text_url} target="_blank" rel="noopener noreferrer sponsored"
          onClick={() => trackAffiliateClick("Amazon", post.title, post.id)}
          className={`${btnBase} bg-[#FF9900] hover:bg-[#e68a00] text-white`}>
          Amazonで購入
        </a>
      )}
      {post.ISBN_13 && (
        <a href={`https://af.moshimo.com/af/c/click?a_id=4249616&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent("https://books.rakuten.co.jp/search?sitem=" + post.ISBN_13)}`}
          target="_blank" rel="noopener noreferrer sponsored"
          onClick={() => trackAffiliateClick("Rakuten", post.title, post.id)}
          className={`${btnBase} bg-[#BF0000] hover:bg-[#a00000] text-white`}>
          楽天で購入
        </a>
      )}
      {post.ISBN_13 && (
        <a href={`https://af.moshimo.com/af/c/click?a_id=4294434&p_id=1225&pc_id=1925&pl_id=27061&url=${encodeURIComponent("https://shopping.yahoo.co.jp/search?p=" + post.ISBN_13)}`}
          target="_blank" rel="noopener noreferrer sponsored"
          onClick={() => trackAffiliateClick("Yahoo", post.title, post.id)}
          className={`${btnBase} bg-[#FF0033] hover:bg-[#cc0029] text-white`}>
          Yahoo!で購入
        </a>
      )}
      {post.kangeki_url && (
        <a href={post.kangeki_url} target="_blank" rel="noopener noreferrer sponsored"
          onClick={() => trackAffiliateClick("KangekiZanmai", post.title, post.id)}
          className={`${btnBase} bg-red-600 hover:bg-red-700 text-white`}>
          観劇三昧で観る
        </a>
      )}
    </div>
  );
};

// --- 作品詳細 ---
export const PostDetails: React.FC<PostPageProps> = ({ post }) => {
  const hasSynopsis = !!post.synopsis;
  const hasDetails = !!post.details;
  const hasAuthorProfile = !!post.author.profile;
  const hasAiDescription = !!post.aiDescription;
  const hasContent = hasSynopsis || hasDetails || hasAuthorProfile || hasAiDescription;

  // スペックから自然文を生成
  const specSentences: string[] = [];
  if (post.author?.name) {
    specSentences.push(`${post.author.name}${post.author.group ? `（${post.author.group}）` : ""}による作品です。`);
  }
  if (post.playtime != null && post.playtime > 0) {
    specSentences.push(`上演時間は約${post.playtime}分。`);
  }
  const man = (post.man != null && post.man > 0) ? post.man : 0;
  const woman = (post.woman != null && post.woman > 0) ? post.woman : 0;
  const others = (post.others != null && post.others > 0) ? post.others : 0;
  const total = post.totalNumber != null && post.totalNumber > 0 ? post.totalNumber : man + woman + others;
  if (total > 0) {
    const parts: string[] = [];
    if (man > 0) parts.push(`男性${man}人`);
    if (woman > 0) parts.push(`女性${woman}人`);
    if (others > 0) parts.push(`その他${others}人`);
    specSentences.push(`キャストは${parts.join("・")}の計${total}人で上演できます。`);
  }

  return (
    <div className="space-y-6">
      {hasSynopsis && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">あらすじ</h2>
          <p className="text-gray-700 leading-[1.9] text-sm mt-3 whitespace-pre-wrap">{post.synopsis}</p>
        </section>
      )}

      {hasDetails && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">詳細</h2>
          <div className="prose prose-sm max-w-none text-gray-700 mt-3">
            <CustomMarkdown content={post.details} />
          </div>
        </section>
      )}

      {hasAuthorProfile && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">作者について</h2>
          <div className="mt-3">
            <Link href={`/authors/${post.author_id}`}
              className="font-bold text-sm text-theater-primary-600 hover:underline">{post.author.name}</Link>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{post.author.profile}</p>
          </div>
        </section>
      )}

      {/* コンテンツが何もない場合のフォールバック */}
      {!hasContent && (
        <div className="space-y-6">
          {/* スペックから生成した自然文 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">作品情報</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {specSentences.join("")}
            </p>
            {post.categories && post.categories.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                カテゴリ：{post.categories.map((c: any) => c.name).join("、")}
              </p>
            )}
          </section>

          {/* 情報が少ない場合の補足 */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">
              この作品についての情報は現在限られています。
            </p>
          </div>
        </div>
      )}

      {/* 記事末の購入CTA再訴求 - 販売リンクが1つでもある場合のみ表示 */}
      {(post.amazon_text_url || post.ISBN_13 || post.kangeki_url) && (
        <section className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 font-bold mb-2">
            『{post.title}』を手に取って読んでみませんか？
          </p>
          <p className="text-xs text-gray-500 mb-3">
            下記の通販サイトで購入できます。
          </p>
          <PurchaseCTAs post={post} />
        </section>
      )}
    </div>
  );
};

// --- サイドバー ---
export const PostSidebar: React.FC<PostPageProps> = ({ post }) => {
  return (
    <aside className="hidden xl:block xl:w-72 2xl:w-80 flex-shrink-0">
      <div className="sticky top-4 space-y-5">
        <AdSlot slot={AD_SLOTS.POST_SIDEBAR} format="rectangle" className="my-0" />

        {/* 関連作品 */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">関連作品</h3>
          <ul className="space-y-1 text-sm">
            {post.categories && post.categories.length > 0 && (
              <li>
                <Link href={`/categories/${post.categories[0].id}`}
                  className="text-theater-primary-600 hover:underline">{post.categories[0].name}の作品 →</Link>
              </li>
            )}
            <li>
              <Link href={`/authors/${post.author_id}`}
                className="text-theater-primary-600 hover:underline">{post.author.name}の作品 →</Link>
            </li>
            {post.playtime && post.playtime > 0 && (
              <li>
                <Link href={`/?minPlaytime=${Math.max(0, post.playtime - 10)}&maxPlaytime=${post.playtime + 10}`}
                  className="text-theater-primary-600 hover:underline">{post.playtime}分前後の作品 →</Link>
              </li>
            )}
          </ul>
        </div>

        {/* 作者リンク */}
        {(post.author.twitter || post.author.website) && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">作者のリンク</h3>
            <ul className="space-y-1 text-sm">
              {post.author.twitter && (
                <li><a href={`https://twitter.com/${post.author.twitter}`} target="_blank" rel="noopener noreferrer"
                  className="text-theater-primary-600 hover:underline">Twitter ↗</a></li>
              )}
              {post.author.website && (
                <li><a href={post.author.website} target="_blank" rel="noopener noreferrer"
                  className="text-theater-primary-600 hover:underline">ウェブサイト ↗</a></li>
              )}
            </ul>
          </div>
        )}

        {/* 戯曲パレット バナー */}
        <a
          href="https://palette.gikyokutosyokan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Image
            src="https://gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com/assets/banners/palette-rect.png"
            alt="戯曲パレット - 戯曲の投稿・公開・上演許可プラットフォーム"
            width={300}
            height={250}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </a>

        {/* CTA */}
        <div className="bg-theater-primary-50 rounded-lg p-4">
          <p className="text-sm font-bold text-gray-800 mb-2">他の作品を探す</p>
          <Link href="/" className="block text-center bg-theater-primary-600 text-white py-2 rounded text-sm font-bold hover:bg-theater-primary-700 transition-colors">
            検索ページへ
          </Link>
        </div>
      </div>
    </aside>
  );
};

const PostDetailIntegrated: React.FC<PostPageProps> = ({ post }) => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <PostHero post={post} />
            <div className="mt-6">
              <PostDetails post={post} />
            </div>
          </main>
          <PostSidebar post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailIntegrated;
