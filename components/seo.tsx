import Head from "next/head";

const Seo = ({
  pageTitle,
  pageDescription,
  pagePath,
  pageImg,
  pageImgWidth,
  pageImgHeight,
  pageType = "website",
  twitterCardType = "summary_large_image",
  pageKeywords,
  hreflang,
  noindex,
  locale = "ja_JP",
  descriptionEn,
}: any) => {
  const isEnglish = locale === "en_US";
  const defaultTitle = isEnglish ? "Japanese Play Library" : "戯曲図書館";
  const defaultDescription = isEnglish
    ? "Search Japanese play scripts by cast size, duration, and genre. Read reviews, find performance reports, and discover your next theater production. Japan's largest play script search service."
    : "戯曲図書館は、演劇の脚本を上演時間・人数・ジャンルで検索できる日本最大級の戯曲検索サービスです。レビューや上演報告も共有できます。";
  const defaultImg = "https://gikyokutosyokan.com/logo.png";
  const siteUrl = "https://gikyokutosyokan.com";

  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  const description = pageDescription ? pageDescription : defaultDescription;
  const url = pagePath ? `${siteUrl}${pagePath}` : siteUrl;
  const imgUrl = pageImg ? pageImg : defaultImg;
  const imgWidth = pageImgWidth ? pageImgWidth : 1280;
  const imgHeight = pageImgHeight ? pageImgHeight : 640;

  // キーワードの生成（EN/JAで既定キーワードを分離）
  const defaultKeywordsJa = ["戯曲", "脚本", "演劇", "上演時間", "人数検索", "戯曲図書館", "演劇台本", "舞台脚本"];
  const defaultKeywordsEn = ["Japanese theater", "play scripts", "drama", "cast size search", "Japanese Play Library"];
  const defaultKeywords = isEnglish ? defaultKeywordsEn : defaultKeywordsJa;
  const keywords = pageKeywords ? [...pageKeywords, ...defaultKeywords].join(",") : defaultKeywords.join(",");

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="戯曲図書館" />
      <link rel="canonical" href={url} />
      
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={pageType} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />
      <meta property="og:locale" content={locale} />
      
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:site" content="@gikyokutosyokan" />
      <meta name="twitter:creator" content="@gikyokutosyokan" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imgUrl} />
      <meta name="twitter:domain" content="gikyokutosyokan.com" />

      {descriptionEn && <meta name="description" lang="en" content={descriptionEn} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {hreflang && hreflang.map((h: { lang: string; path: string }) => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={`${siteUrl}${h.path}`} />
      ))}
      {/* Default hreflang if none provided */}
      {!hreflang && (
        <>
          <link rel="alternate" hrefLang="ja" href={url} />
          <link rel="alternate" hrefLang="x-default" href={url} />
        </>
      )}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo.png" />
      <link rel="alternate" type="application/rss+xml" title="戯曲図書館 RSS Feed" href="/api/feed.xml" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export default Seo;
