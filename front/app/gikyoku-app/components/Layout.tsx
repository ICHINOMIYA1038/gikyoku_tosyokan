import Header from "@/components/Header";
import Footer from "./Footer";
import Head from "next/head";
import Script from "next/script";

function Layout({ children }: any) {
  return (
    <div>
      <Head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8691137965825158"
          crossOrigin="anonymous"
        ></Script>
        <title>戯曲図書館</title>
        <meta
          name="description"
          content="
        上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
          key="desc"
        />
        <meta property="og:title" content="戯曲を探す、戯曲図書館" />
        <meta
          property="og:description"
          content="上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
        />
        <meta property="og:image" content="https://gikyokutosyokan.logo.png" />
      </Head>
      <div className="sticky-header">
        <Header />
      </div>
      <div className="header-gap"></div>
      <div className="md:px-20 md:py-10">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
