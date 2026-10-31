import * as React from "react";
import TypeCover from "./TypeCover";
import Link from "next/link";
import Star from "./Widget/Star";
import CustomMarkdown from './CustomMarkdown';
import OptimizedImage from './OptimizedImage';
import {
  FaClock, FaUsers, FaMale, FaFemale, FaTheaterMasks,
  FaTag, FaPen, FaBook, FaInfoCircle, FaQuoteLeft,
  FaExternalLinkAlt, FaHeart,
  FaEye, FaCalendar, FaGlobe
} from "react-icons/fa";
import AdSlot from "./Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";
import AiImageBadge from "./AiImageBadge";
import { trackAffiliateClick } from "@/lib/gtag";
import { amazonBookUrl } from "@/lib/amazonBookLink";

type PostPageProps = {
  post: any;
};

// --- ヒーロー: Filmarks/AniList型 ---
export const PostHero: React.FC<PostPageProps> = ({ post }) => {
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
            <OptimizedImage src={post.image_url} alt={post.title}
              width={160} height={220}
              priority
              sizes="(max-width: 768px) 144px, 160px"
              className="w-36 h-[200px] md:w-40 md:h-[220px] object-cover rounded-lg shadow-md" />
          ) : (
            <TypeCover title={post.title} author={post.author?.name} className="w-36 h-[200px] md:w-40 md:h-[220px] rounded" />
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
        <h1 className="text-[28px] md:text-[40px] font-serif font-bold text-gray-900 leading-tight">
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

        {/* 仕様表。項目名と値を点線でつなぎ、値を右にそろえる */}
        <dl className="mt-4 max-w-md text-[15px]">
          {castTotal > 0 && (
            <SpecRow label="人数">
              {castTotal}人{(man > 0 || woman > 0) && `（${[man > 0 ? `男${man}` : "", woman > 0 ? `女${woman}` : "", others > 0 ? `他${others}` : ""].filter(Boolean).join("・")}）`}
            </SpecRow>
          )}
          {post.playtime != null && post.playtime > 0 && <SpecRow label="上演時間">{post.playtime}分</SpecRow>}
          {post.categories && post.categories.length > 0 && (
            <SpecRow label="ジャンル">
              {post.categories.map((cat: any, i: number) => (
                <React.Fragment key={cat.id}>
                  {i > 0 && "、"}
                  <Link href={`/categories/${cat.id}`} className="text-theater-primary-700 hover:underline">{cat.name}</Link>
                </React.Fragment>
              ))}
            </SpecRow>
          )}
          <SpecRow label="台本">
            {post.link_to_plot ? "無料で読める（外部サイト）" : post.amazon_text_url || post.ISBN_13 ? "書籍あり" : "入手先は未確認"}
          </SpecRow>
        </dl>

        {/* 配役の図。男は塗り、女は線、その他は薄い塗り */}
        {castTotal > 0 && castTotal <= 40 && (
          <div className="mt-3" aria-label={`配役 ${castTotal}人（男${man}・女${woman}${others > 0 ? `・他${others}` : ""}）`}>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: man }).map((_, i) => <CastFigure key={`m${i}`} kind="man" />)}
              {Array.from({ length: woman }).map((_, i) => <CastFigure key={`w${i}`} kind="woman" />)}
              {Array.from({ length: others }).map((_, i) => <CastFigure key={`o${i}`} kind="other" />)}
            </div>
            <p className="mt-1 flex gap-3 text-xs text-gray-600">
              {man > 0 && <span className="inline-flex items-center gap-1"><CastFigure kind="man" small />男</span>}
              {woman > 0 && <span className="inline-flex items-center gap-1"><CastFigure kind="woman" small />女</span>}
              {others > 0 && <span className="inline-flex items-center gap-1"><CastFigure kind="other" small />その他</span>}
            </p>
          </div>
        )}

        {/* CTAボタン */}
        <PurchaseCTAs post={post} />
      </div>
    </div>
  );
};

const SpecRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-baseline gap-2 py-1">
    <dt className="text-gray-600 flex-shrink-0">{label}</dt>
    <span className="flex-1 border-b border-dotted border-gray-400 translate-y-[-4px]" aria-hidden="true" />
    <dd className="text-gray-900 text-right">{children}</dd>
  </div>
);

const CastFigure: React.FC<{ kind: "man" | "woman" | "other"; small?: boolean }> = ({ kind, small }) => {
  const size = small ? 10 : 16;
  const style =
    kind === "man"
      ? { fill: "#1A1A1A", stroke: "#1A1A1A" }
      : kind === "woman"
        ? { fill: "none", stroke: "#5E5A55" }
        : { fill: "#D9D5CF", stroke: "#D9D5CF" };
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 16 20" aria-hidden="true">
      <circle cx="8" cy="5" r="3.5" fill={style.fill} stroke={style.stroke} strokeWidth="1.5" />
      <path d="M2 19c0-4.5 2.7-7.5 6-7.5s6 3 6 7.5z" fill={style.fill} stroke={style.stroke} strokeWidth="1.5" />
    </svg>
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
  // 登録リンクが無くても ISBN から Amazon の商品ページを出す（ISBN-10 = 書籍の ASIN）
  const amazonHref = amazonBookUrl(post);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {post.link_to_plot && (
        <a href={post.link_to_plot} target="_blank" rel="noopener noreferrer"
          className={`${btnBase} bg-theater-primary-600 hover:bg-theater-primary-700 text-white`}>
          <FaBook className="text-xs" /> 台本を読む（外部サイト）
        </a>
      )}
      {amazonHref && (
        <a href={amazonHref} target="_blank" rel="noopener noreferrer sponsored"
          onClick={() => trackAffiliateClick("Amazon", post.title, post.id)}
          className={`${btnBase} border border-gray-400 bg-white text-gray-800 hover:bg-gray-50`}>
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
          className={`${btnBase} border border-gray-400 bg-white text-gray-800 hover:bg-gray-50`}>
          観劇三昧で観る
        </a>
      )}
    </div>
  );
};

// --- 作品詳細 ---
export const PostDetails: React.FC<PostPageProps> = ({ post }) => {
  const hasSynopsis = !!post.synopsis;
  const hasReview = !!post.content;
  const hasAuthorProfile = !!post.author.profile;
  const hasAiDescription = !!post.aiDescription;
  const hasContent = hasSynopsis || hasReview || hasAuthorProfile || hasAiDescription;

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

      {hasReview && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">感想・レビュー</h2>
          <div className="prose prose-sm max-w-none text-gray-700 mt-3">
            <CustomMarkdown content={post.content} />
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

        {/* エチュードメーカー バナー (com.gikyokutosyokan.etude) */}
        <a
          href="https://apps.apple.com/us/app/%E3%82%A8%E3%83%81%E3%83%A5%E3%83%BC%E3%83%89%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC/id6794500656"
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer hover:opacity-90 transition-opacity"
          aria-label="エチュードメーカー - 即興演劇のお題をワンタップで生成するiOSアプリ"
        >
          <OptimizedImage
            src="https://gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com/assets/banners/etude-rect.png"
            alt="エチュードメーカー - 即興演劇のお題をワンタップで生成"
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
