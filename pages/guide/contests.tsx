import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import StructuredData from "@/components/StructuredData";
import Link from "next/link";
import { FaTrophy, FaCalendarAlt, FaYenSign, FaExternalLinkAlt, FaLightbulb, FaBook } from "react-icons/fa";
import AdSlot from "@/components/Ad/AdSlot";
import { AD_SLOTS } from "@/lib/adSlots";

type Contest = {
  name: string;
  organizer: string;
  deadline: string;
  prize: string;
  genre: string;
  url?: string;
  notes: string;
};

const MAJOR_CONTESTS: Contest[] = [
  {
    name: "岸田國士戯曲賞",
    organizer: "白水社",
    deadline: "前年に上演・出版された戯曲が対象",
    prize: "賞金50万円",
    genre: "プロ向け",
    notes: "日本で最も権威のある戯曲賞。新人からベテランまで幅広い作品が対象。受賞作は白水社から出版されます。",
  },
  {
    name: "日本劇作家協会新人戯曲賞",
    organizer: "日本劇作家協会",
    deadline: "毎年変動（公式サイトで確認）",
    prize: "賞金30万円",
    genre: "新人向け",
    notes: "プロの劇作家を目指す新人のための登竜門。上演済みの戯曲が対象です。",
  },
  {
    name: "AAF戯曲賞",
    organizer: "愛知県芸術劇場",
    deadline: "例年6月頃",
    prize: "大賞50万円＋リーディング上演",
    genre: "未上演作品",
    notes: "未上演の新作戯曲が対象。大賞作品はリーディング公演が行われます。応募資格に制限が少なく、挑戦しやすい賞。",
  },
  {
    name: "北海道戯曲賞",
    organizer: "北海道演劇財団",
    deadline: "例年9月頃",
    prize: "大賞30万円＋札幌での上演",
    genre: "地域不問",
    notes: "北海道に関連する作品に限らず応募可能。大賞作品は札幌で上演されます。",
  },
  {
    name: "せんだい短編戯曲賞",
    organizer: "仙台市市民文化事業団",
    deadline: "例年秋頃",
    prize: "大賞＋リーディング上演",
    genre: "短編（30分以内）",
    notes: "30分以内の短編戯曲が対象。初心者でも挑戦しやすい短編のコンテストです。",
  },
  {
    name: "OMS戯曲賞",
    organizer: "大阪ガス",
    deadline: "前年に関西で上演された作品",
    prize: "大賞50万円",
    genre: "関西上演作品",
    notes: "関西の小劇場で上演された戯曲が対象。関西の演劇シーンを盛り上げるための賞です。",
  },
];

const AMATEUR_CONTESTS: Contest[] = [
  {
    name: "高校演劇コンクール（全国大会）",
    organizer: "全国高等学校演劇協議会",
    deadline: "地区大会から勝ち上がり",
    prize: "最優秀賞ほか",
    genre: "高校演劇",
    notes: "高校の演劇部が参加する全国規模のコンクール。既成脚本・創作脚本どちらも可。地区→ブロック→全国の流れ。",
  },
  {
    name: "劇作家協会 戯曲セミナー",
    organizer: "日本劇作家協会",
    deadline: "年1回募集",
    prize: "プロの劇作家による添削指導",
    genre: "学習・育成",
    notes: "コンテストではありませんが、プロの劇作家から直接指導を受けられる貴重な機会。脚本を書き始めた方におすすめ。",
  },
  {
    name: "テアトロ新人戯曲賞",
    organizer: "テアトロ（雑誌）",
    deadline: "毎年変動",
    prize: "テアトロ誌掲載",
    genre: "新人向け",
    notes: "演劇雑誌「テアトロ」が主催する新人賞。掲載されることで多くの演劇人の目に触れる機会に。",
  },
];

const TIPS = [
  {
    title: "まずは短編から挑戦",
    description: "いきなり長編を書くのは大変。まずは15〜30分程度の短編から始めましょう。せんだい短編戯曲賞など、短編が対象のコンテストもあります。",
  },
  {
    title: "応募規定を必ず確認",
    description: "文字数、フォーマット、応募資格など、コンテストごとに異なります。せっかくの作品が規定外で落選しないよう、事前に確認を。",
  },
  {
    title: "上演を前提に書く",
    description: "戯曲は「上演されること」が前提の文学です。読んで面白いだけでなく、舞台上で映える作品を意識しましょう。",
  },
  {
    title: "他の作品を読む・観る",
    description: "良い脚本を書くには、多くの作品に触れることが大切。戯曲図書館で様々な作品を探して、自分の引き出しを増やしましょう。",
  },
  {
    title: "フィードバックをもらう",
    description: "書いた脚本を友人や演劇仲間に読んでもらい、感想をもらいましょう。読み合わせをすると、台詞の自然さや展開の問題点が見えてきます。",
  },
];

export default function ContestsPage() {
  return (
    <>
      <Seo
        pageTitle="脚本コンテスト・戯曲賞まとめ｜応募方法と受賞のコツ"
        pageDescription="日本の主要な脚本コンテスト・戯曲賞の情報をまとめました。岸田國士戯曲賞からアマチュア向けの賞まで、応募方法・賞金・締切を一覧で紹介。初めての応募に役立つコツも。"
        pagePath="/guide/contests"
        pageType="article"
      />
      <StructuredData
        type="FAQPage"
        faqItems={[
          {
            question: "脚本コンテストに応募するにはどうすればいい？",
            answer: "各コンテストの公式サイトで応募要項を確認してください。多くの場合、所定のフォーマットで戯曲を提出します。未上演作品が条件のものと、上演済み作品が条件のものがあるので注意。",
          },
          {
            question: "初心者でも応募できるコンテストはある？",
            answer: "はい。せんだい短編戯曲賞（30分以内の短編）やAAF戯曲賞（応募資格の制限が少ない）など、初心者でも挑戦しやすいコンテストがあります。",
          },
          {
            question: "脚本コンテストの賞金はどのくらい？",
            answer: "主要な賞では30万〜50万円程度です。賞金だけでなく、上演や出版の機会が得られることが大きなメリットです。",
          },
        ]}
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100 py-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/50 text-amber-800 text-sm font-medium mb-3">
                <FaTrophy />
                ガイド
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
                脚本コンテスト・戯曲賞まとめ
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                あなたの作品を世に出すチャンス。主要な戯曲賞から初心者向けのコンテストまで、応募に必要な情報をまとめました。
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-10">
            {/* 主要戯曲賞 */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaTrophy className="text-amber-500 text-xl" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  主要な戯曲賞・脚本コンテスト
                </h2>
              </div>
              <div className="space-y-4">
                {MAJOR_CONTESTS.map((contest) => (
                  <div
                    key={contest.name}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{contest.name}</h3>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        {contest.genre}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{contest.notes}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        {contest.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaYenSign className="text-gray-400" />
                        {contest.prize}
                      </span>
                      <span>主催: {contest.organizer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* アマチュア向け */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaBook className="text-green-500 text-xl" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  初心者・アマチュア向け
                </h2>
              </div>
              <div className="space-y-4">
                {AMATEUR_CONTESTS.map((contest) => (
                  <div
                    key={contest.name}
                    className="bg-white rounded-xl border border-green-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{contest.name}</h3>
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {contest.genre}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{contest.notes}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        {contest.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaYenSign className="text-gray-400" />
                        {contest.prize}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 応募のコツ */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaLightbulb className="text-yellow-500 text-xl" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  脚本コンテスト応募のコツ
                </h2>
              </div>
              <div className="space-y-3">
                {TIPS.map((tip, i) => (
                  <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 注意事項 */}
            <section className="mb-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="font-bold text-gray-900 mb-2">ご注意</h2>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>掲載情報は変更される場合があります。最新の情報は各主催者の公式サイトでご確認ください。</li>
                <li>締切日や応募条件は年度によって異なります。</li>
                <li>このページの情報は2026年3月時点のものです。</li>
              </ul>
            </section>

            <AdSlot slot={AD_SLOTS.BLOG_AFTER_TOC} format="horizontal" />

            {/* CTA */}
            <section className="text-center bg-amber-50 rounded-2xl p-8 border border-amber-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                コンテストに出す前に、名作を読もう
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                良い脚本を書くには、多くの作品に触れることが大切。戯曲図書館で受賞作品や人気作品をチェックしましょう。
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/posts"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-colors"
                >
                  <FaBook />
                  脚本を探す
                </Link>
                <Link
                  href="/lp/shindan"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-amber-400 text-amber-700 font-bold rounded-full hover:bg-amber-100 transition-colors"
                >
                  脚本診断を試す
                </Link>
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
}
