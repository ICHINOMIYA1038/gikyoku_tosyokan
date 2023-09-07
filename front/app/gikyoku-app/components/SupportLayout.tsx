import Header from "@/components/Header";
import Footer from "./Footer";
import Head from "next/head";
import SupportSidebar from "./Support/SupportSidebar";

function SupportLayout({ children, now }: any) {
  return (
    <div>
      <Head>
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
      <div className="md:flex max-w-4xl mx-auto">
        <div className="md:w-1/2 mx-2">
          <div className="mt-10 md:mx-20">
            <SupportSidebar now={now} />
          </div>
        </div>
        <div className="md:w-1/2 mx-2">
          <div className="mt-10 ">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SupportLayout;
