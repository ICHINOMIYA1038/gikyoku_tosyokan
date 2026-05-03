import SupportLayout from "@/components/SupportLayout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";

function Home() {
  return (
    <SupportLayout now="aboutus">
      <Seo
        pageTitle="運営者概要"
        pageDescription="戯曲図書館の運営者情報。大学での演劇経験をもとに、戯曲検索サービスを個人で開発・運営しています。"
        pagePath="/support/aboutus"
      />
      <StructuredData
        type="Organization"
      />
      <div className="support-document">
        <h2>運営者概要</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-theater-primary-100 rounded-full flex items-center justify-center text-theater-primary-600 text-2xl font-bold flex-shrink-0">
              F
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">ふみ</p>
              <p className="text-sm text-gray-500">戯曲図書館 運営者・開発者</p>
              <div className="flex gap-3 mt-2">
                <a
                  href="https://twitter.com/gikyokutosyokan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Twitter (公式)
                </a>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-lg mt-6 mb-3">経歴・演劇との関わり</h3>
        <p>大学在学時に演劇活動に取り組み、脚本選びの難しさを実感。自らの経験をもとに戯曲図書館を作成しました。</p>
        <p>現在は演劇活動は休止しており、個人で戯曲の執筆を行いながら、戯曲図書館の運営と改善を続けています。</p>

        <h3 className="font-bold text-lg mt-6 mb-3">好きな劇団・劇作家</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>好きな劇団: NODA・MAP / 劇団5454</li>
          <li>好きな劇作家: 鈴江俊郎さん / 鴻上尚史さん</li>
        </ul>

        <h3 className="font-bold text-lg mt-6 mb-3">サイトの運営体制</h3>
        <p>戯曲図書館は個人で運営しているサービスです。作品データの収集、サイトの開発・保守、ユーザーサポートをすべて一人で行っています。</p>
        <p className="text-sm text-gray-500 mt-2">
          そのため、対応にお時間をいただく場合がございます。ご理解のほどよろしくお願いいたします。
        </p>

        <h3 className="font-bold text-lg mt-6 mb-3">お問い合わせ</h3>
        <p>メール: gekidankatakago@gmail.com</p>
        <p>連絡はお問い合わせフォームまでよろしくお願いいたします。</p>
        <div className="text-blue-600 my-5">
          <Link href="/support/contact">お問い合わせフォーム</Link>
        </div>

        <h3 className="font-bold text-lg mt-6 mb-3">外部送信規律への対応</h3>
        <p>
          当サイトは、電気通信事業法第27条の12に定める外部送信規律に対応しています。
          外部送信される情報の詳細は
          <Link href="/support/privacy-policy" className="text-blue-600 hover:underline mx-1">
            プライバシーポリシー
          </Link>
          の「Cookieの利用と外部送信規律」をご確認ください。
        </p>

        <p className="text-xs text-gray-400 mt-8">
          最終更新日: 2026年5月
        </p>
      </div>
    </SupportLayout>
  );
}

export default Home;
