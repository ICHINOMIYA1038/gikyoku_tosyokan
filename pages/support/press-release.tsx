import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import SupportLayout from "@/components/SupportLayout";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="press-release">
      <Seo
        pageTitle="プレスリリース"
        pageDescription="戯曲図書館のバージョン情報・プレスリリース。"
        pagePath="/support/press-release"
      />
      <div className="support-document">
        <h2>プレスリリース</h2>
        <h3>バージョン情報</h3>
        <p>2023.7.15, ベータ版を公開しました。</p>
      </div>
    </SupportLayout>
  );
}

export default Home;
