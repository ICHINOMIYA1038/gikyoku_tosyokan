import Head from "next/head";

/**
 * モバイル最適化のためのメタタグとプリロード設定
 */
const MobileOptimizations = () => {
  return (
    <Head>
      {/* モバイル最適化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="戯曲図書館" />
      
      {/* テーマカラー */}
      <meta name="theme-color" content="#ec4899" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#db2777" media="(prefers-color-scheme: dark)" />
      
      {/* リソースヒント */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* タッチアイコン */}
      <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
      
      {/* アプリケーションバッジ */}
      <meta name="application-name" content="戯曲図書館" />
      <meta name="msapplication-TileColor" content="#ec4899" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
    </Head>
  );
};

export default MobileOptimizations;