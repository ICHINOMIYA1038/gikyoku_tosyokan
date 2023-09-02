import Layout from "@/components/Layout";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div className="support-document">
        <h2>運営者概要</h2>
        <h3>運営者</h3>
        <p>このサイトは個人が非営利で制作したサイトです。</p>
      </div>
    </Layout>
  );
}

export default Home;
