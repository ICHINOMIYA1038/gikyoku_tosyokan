import LinkCard from "@/components/LinkCard";
import SupportLayout from "@/components/SupportLayout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";

function Home() {
  return (
    <SupportLayout now="about">
      <Seo
        pageTitle="戯曲図書館とは"
        pageDescription="戯曲図書館は、演劇の脚本を上演時間・人数・ジャンルで検索できる日本最大級の戯曲検索サービスです。レビューや上演報告を共有し、演劇を愛する人たちの交差点を目指しています。"
        pagePath="/support/about"
      />
      <StructuredData
        type="FAQPage"
        faqItems={[
          {
            question: '戯曲図書館とは？',
            answer: '戯曲図書館は、演劇・舞台の脚本を検索し、レビューや上演報告を共有できるサービスです。上演時間や人数から脚本を探せるほか、実際に上演した方の感想が次に演じる人の参考になります。',
          },
          {
            question: '脚本は読めますか？',
            answer: '著作権の観点から、戯曲の内容自体は公開しておりません。作品の情報や入手方法を掲載しています。面白いと思った作品はぜひ購入してお読みください。',
          },
          {
            question: '上演するにはどうすればいいですか？',
            answer: '掲載されている戯曲は作者や出版社に著作権があります。上演をご希望の際には、各作品ページに記載の著作者にご連絡ください。',
          },
          {
            question: 'コメントや上演報告は誰でも投稿できますか？',
            answer: 'はい、ユーザー登録不要でどなたでも投稿できます。感想・上演報告・レビュー・質問の4種類から選んでコメントできます。',
          },
          {
            question: 'データはどのように集められていますか？',
            answer: '作品情報は出版社の公開情報、作者の公式サイト、劇作家協会のデータベースなどの一次情報源から収集しています。上演時間やキャスト数は実際の台本情報に基づいています。ユーザーからの修正報告も受け付けており、正確性の維持に努めています。',
          },
        ]}
      />
      <StructuredData type="Organization" />
      <div className="support-document">
        <h2>戯曲図書館とは</h2>
        <p>
          <span className="font-bold">
            戯曲図書館は、戯曲を「探す・知る・語る」ためのサービスです。
          </span>
          上演時間・人数・ジャンルなどの条件から脚本を検索でき、実際に上演した方のレビューや感想を共有できる、日本の演劇コミュニティのための情報プラットフォームです。
        </p>

        <h3 className="font-bold text-xl mt-8 mb-3">ミッション</h3>
        <p>
          演劇に関わるすべての人が、最適な脚本と出会える場所を作ること。
          劇団の次の公演にぴったりの作品を見つけたい演出家、文化祭で初めて演劇に挑戦する学生、
          新しい戯曲を読みたい演劇ファンなど、さまざまな人が集まる<span className="font-bold under-line-blue">演劇を愛する人たちの交差点</span>を目指しています。
        </p>

        <h3 className="font-bold text-xl mt-8 mb-3">3つの使い方</h3>

        <div className="space-y-4 mb-8">
          <div className="bg-pink-50 border border-pink-100 rounded-lg p-4">
            <p className="font-bold text-pink-700 mb-1">探す</p>
            <p>上演時間・人数・ジャンルから、あなたの劇団にぴったりの脚本を検索。文化祭、学園祭、部活動の作品選びに。</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="font-bold text-blue-700 mb-1">知る</p>
            <p>あらすじ、上演時間、キャスト構成などの詳細情報に加え、他の人のレビューや評価を参考にできます。</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="font-bold text-green-700 mb-1">語る</p>
            <p>上演した感想、レビュー、質問を投稿して、演劇に関わる人同士で情報を共有。あなたの経験が誰かの次の舞台につながります。</p>
          </div>
        </div>

        <h3 className="font-bold text-xl mt-8 mb-3">データの収集と品質管理</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="mb-2">戯曲図書館に掲載されている作品情報は、以下の方針で収集・管理しています。</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><span className="font-bold">一次情報源の重視</span>：出版社の公開情報、作者の公式サイト、劇作家協会のデータベースなど、信頼性の高い情報源から収集しています。</li>
            <li><span className="font-bold">実データに基づく数値</span>：上演時間やキャスト人数は、実際の台本情報や上演実績に基づいています。</li>
            <li><span className="font-bold">ユーザーからの修正報告</span>：情報の誤りを発見された場合は、お問い合わせフォームから報告を受け付けています。</li>
            <li><span className="font-bold">定期的な情報更新</span>：新刊情報や受賞作品など、最新の演劇情報を定期的に追加・更新しています。</li>
          </ul>
        </div>

        <h3 className="font-bold text-xl mt-8 mb-3">編集方針</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>著作権を尊重し、戯曲の本文は掲載しません。作品の購入・上演許可取得を推奨しています。</li>
            <li>特定の作品や作者を不当に優遇・冷遇する評価は行いません。</li>
            <li>ユーザー投稿のレビューは、誹謗中傷や著作権侵害がないか確認のうえ掲載しています。</li>
            <li>ブログ記事・ガイドは、実際の演劇経験に基づいた実用的な情報提供を心がけています。</li>
          </ul>
        </div>

        <h3 className="font-bold text-xl mt-8 mb-3">脚本の本文について</h3>
        <p>著作権の観点から、戯曲の内容自体は公開しておりません。</p>
        <p>掲載されている戯曲は作者や出版社等に著作権があります。上演をご希望の際には、各作品ページに記載の著作者にご連絡ください。</p>

        <h3 className="font-bold text-xl mt-8 mb-3">このサイトの想い</h3>
        <p>
          一つの戯曲を制作するのに、劇作家は
          <span className="under-line-blue font-bold">多大な経験と時間</span>
          を要します。でも、その割に得られる利益はごくわずかです。
        </p>
        <p>
          そのわずかな利益を作者に還元できるように、戯曲を一つの文学として書店などで購入し読んで欲しいと思っています。
        </p>
        <p>
          戯曲図書館では作品の内容自体は公開できません。しかし、なるべく多くの情報を集め、多くの
          <span className="font-bold under-line-blue">
            「この本読んでみたい！」
          </span>
          を作る場所にできればと思っています。
        </p>
        <p>
          そして、上演した方の声が集まることで、まだ見ぬ名作との出会いが生まれる。そんな
          <span className="font-bold under-line-blue">
            演劇を愛する人たちの交差点
          </span>
          になれたら嬉しいです。
        </p>
        <p>
          面白いと思った作品はぜひ購入し、そしてできればその作者が書いた脚本で行われている劇場に足を運んでみてください。
        </p>

        <h3 className="font-bold text-xl mt-8 mb-3">運営者について</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
          <p className="mb-2">
            運営者<span className="font-bold">「ふみ」</span>は、大学時代に演劇活動を経験し、在学中に戯曲図書館を立ち上げました。
            自身の脚本選びの苦労から、演劇に関わる人が簡単に作品を探せるサービスの必要性を感じ、個人で開発・運営を続けています。
          </p>
          <p className="text-sm text-gray-600">
            詳しい運営者情報は<Link href="/support/aboutus" className="text-blue-600 hover:underline mx-1">運営者概要ページ</Link>をご覧ください。
          </p>
        </div>

        <h3 className="font-bold text-xl mt-8 mb-3">お問い合わせ</h3>
        <p>
          作品情報の修正依頼、掲載のご要望、その他ご質問は
          <Link href="/support/contact" className="text-blue-600 hover:underline mx-1">お問い合わせフォーム</Link>
          よりお気軽にご連絡ください。
        </p>
        <p className="text-sm text-gray-500 mt-1">
          メールアドレス: gekidankatakago@gmail.com
        </p>

        <h3 className="font-bold text-xl mt-8 mb-3">関連サイト</h3>
        <p>劇作家協会による戯曲デジタルアーカイブでは、戯曲を無料で読むことができ、上演許可の仲介もしてくれます。</p>
        <LinkCard href="https://playtextdigitalarchive.com/drama/list/dramaRa" />

        <p className="text-xs text-gray-400 mt-8">
          最終更新日: 2026年5月
        </p>
      </div>
    </SupportLayout>
  );
}

export default Home;
