import ContactForm from "@/components/Form/ContactForm";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import SupportLayout from "@/components/SupportLayout";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="posting-request">
      <Seo
        pageTitle="掲載依頼"
        pageDescription="戯曲図書館への脚本掲載依頼はこちら。タイトル、あらすじ、人数、上演時間などの情報をお送りください。"
        pagePath="/support/posting-request"
      />
      <StructuredData
        type="FAQPage"
        faqItems={[
          {
            question: '掲載に必要な情報は何ですか？',
            answer: 'タイトル、あらすじ、男性人数、女性人数、そのほか人数、総人数、上演時間目安が必要です。紹介画像や感想・紹介文は任意です。',
          },
          {
            question: '審査はありますか？',
            answer: 'はい。お送りいただいた内容を精査したうえで掲載させていただきます。精査した結果、掲載できない場合もございます。',
          },
        ]}
      />
      <div className="support-document">
        <h2>掲載依頼に関して</h2>
        <p className="font-bold">戯曲図書館では掲載の依頼を承っております。</p>
        <p className="font-bold">
          お問い合わせフォームより以下の情報をお送りいただければ、こちらで内容を精査したうえで掲載させていただきます。
        </p>
        <ul className="my-5">
          <li>タイトル</li>
          <li>あらすじ</li>
          <li>紹介画像(任意)</li>
          <li>感想や紹介文など(任意)</li>
          <li>男性人数</li>
          <li>女性人数</li>
          <li>そのほか人数</li>
          <li>総人数</li>
          <li>上演時間目安</li>
        </ul>
        <h3 className="font-bold">【注意】</h3>
        <p>
          あらすじと紹介画像に関して、他者の著作権を侵害しないようにお願いいたします。
        </p>
        <p>また、精査した結果、掲載できない場合もございます。</p>
        <div className="mb-5"></div>
        <ContactForm />
      </div>
    </SupportLayout>
  );
}

export default Home;
