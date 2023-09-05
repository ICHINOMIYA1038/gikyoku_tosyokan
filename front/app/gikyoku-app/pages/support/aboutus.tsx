import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="aboutus">
      <div className="support-document">
        <h2>運営者概要</h2>
        <h3>運営者:いちのみや(劇団かたかご)</h3>
        <br />
        <p>このサイトは個人が非営利で制作したサイトです。</p>
      </div>
    </SupportLayout>
  );
}

export default Home;
