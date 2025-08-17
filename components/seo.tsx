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
}: any) => {
  const defaultTitle = "戯曲図書館";
  const defaultDescription =
    "上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。";
  const defaultImg = "https://gikyokutosyokan.com/logo.png";
  const siteUrl = "https://gikyokutosyokan.com";

  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  const description = pageDescription ? pageDescription : defaultDescription;
  const url = pagePath ? `${siteUrl}${pagePath}` : siteUrl;
  const imgUrl = pageImg ? pageImg : defaultImg;
  const imgWidth = pageImgWidth ? pageImgWidth : 1280;
  const imgHeight = pageImgHeight ? pageImgHeight : 640;

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content="戯曲,脚本,演劇,上演時間,人数検索,戯曲図書館,演劇台本,舞台脚本" />
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
      <meta property="og:locale" content="ja_JP" />
      
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:site" content="@gikyokutosyokan" />
      <meta name="twitter:creator" content="@gikyokutosyokan" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imgUrl} />
      
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo.png" />
      <link rel="alternate" type="application/rss+xml" title="戯曲図書館 RSS Feed" href="/api/feed.xml" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

export default Seo;
