import Layout from "@/components/Layout";
import Link from "next/link";
import Seo from "@/components/seo";

const shortStoriesData = [
  {
    title: "骨壺",
    imgSrc: "/img/card_kotsutsubo.jpg",
    pdfSrc: "/pdf/hone.pdf",
    description:
      "「靴があっただけましやろ。」\n「靴やん」\n「和也の靴やで」\n「和也の靴やけど、和也は靴ちゃう…」",
  },
  {
    title: "背中に花が笑ってる",
    imgSrc: "/img/card_senaka.jpg",
    pdfSrc: "/pdf/senakani.pdf",
    description:
      "「子供は親の背中を見て育つんだから」\n「見せられないですよ、僕の背中なんて」",
  },
  {
    title: "ゴミ箱と大人",
    imgSrc: "/img/card_gomibako.jpg",
    pdfSrc: "/pdf/gomi.pdf",
    description:
      '「ビール飲めたら大人かなって」\n「なんやそれ。誰が言うたんやそれ\nあんた、"もう"はたちやねんから、大人やん」\n「さっきは"まだ"はたちって言ってた」',
  },
  {
    title: "初恋",
    imgSrc: "/img/card_hatsukoi.jpg",
    pdfSrc: "/pdf/hatsukoi.pdf",
    description:
      "「自殺しようとしてるんです、このビルの屋上で」\n「誰なの」\n「誰って、わかんないですけど」",
  },
  {
    title: "8月の空の下",
    imgSrc: "/img/card_8.jpg",
    pdfSrc: "/pdf/8.pdf",
    description:
      "「あなた、今日何の日か知ってる？」\n「燃えるゴミの日ですよね」\n「燃えるゴミじゃなくて燃やすゴミなの。それが問題なの。」",
  },
  {
    title: "すみか",
    imgSrc: "/img/card_sumika.jpg",
    pdfSrc: "/pdf/sumika.pdf",
    description:
      "「あんなの家族じゃないよ」\n「家族じゃん、ちゃんと血の繋がってる」\n「その家族に逃げられたくせに」",
  },
  {
    title: "食卓",
    imgSrc: "/img/card_syokutaku.jpg",
    pdfSrc: "/pdf/syokutaku.pdf",
    description:
      "「誰かと間違っているんじゃないかい？」\n「いえ、合ってますよ。ロープのある家を探しに来たんです」\n「なんに使うって言うんだい」\n「首を吊るんです」",
  },
  {
    title: "秘密",
    imgSrc: "/img/card_himitsu.jpg",
    pdfSrc: "/pdf/himitsu.pdf",
    description:
      "「親がサンタっていつ気づいた？」\n「そろそろかな、たっちゃんも」\n「子供ってなんでも一人で気づいちゃうんだから。親が教えなくても」",
  },
  {
    title: "ブルーシート",
    imgSrc: "/img/card_blue.jpg",
    pdfSrc: "/pdf/blue.pdf",
    description:
      "「僕だって人間なんですから」\n「なにそれ、俺が人間じゃないみたいな」\n「人間だからですよ、人間だから生きてほしいんです。」",
  },
];

const mediumStoriesData = [
  {
    title: "月の卒業式",
    imgSrc: "/img/tsuki.jpg",
    pdfSrc: "/pdf/tsukino.pdf",
    description:
      "「月がきれいですね」\n「うん」\n「月がきれいですね」\n「私、死にたい」",
  },
  {
    title: "横断歩道",
    imgSrc: "/img/card_oudanhodou.jpg",
    pdfSrc: "/pdf/oudanhodou.pdf",
    description:
      "「1次元は横に伸びる直線」\n「2次元はそれがさらに広がった平面」\n「3次元は高さが加わった空間」\n「3次元ってなんか生きてる感じがする」",
  },
  // 他の中編作品も同様に追加
];

const longStoriesData = [
  {
    title: "人形の舞",
    imgSrc: "/img/ningyou.jpg",
    pdfSrc: "/pdf/ningyou.pdf",
    description:
      "「これだけそっくりだと無理ないね。ひとりでに踊りだしたりして」\n「そこまでいったらもう本物の人間じゃないですか」\n「なに？人間なら踊るの？」\n「人間だから踊るわけじゃないけど、踊るのは人間です。」",
  },
  // 他の長編作品も同様に追加
];

const cardStyle = "bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 relative overflow-hidden flex flex-col h-96";
const sectionStyle = "border p-4 rounded-lg flex flex-col justify-between h-full";
const imgContainerStyle = "w-full relative flex items-center justify-center";
const imgStyle = "rounded-lg object-cover h-48 w-full";
const textContainerStyle = "p-4 flex flex-col justify-center flex-grow";

const ShortStories = () => {
  return (
    <div>
      <h3 className="text-3xl font-semibold my-5">短編作品</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shortStoriesData.map((story, index) => (
          <Link href={story.pdfSrc} target="_blank" key={index}>
            <div className={cardStyle}>
              <section className={sectionStyle}>
                <div className={imgContainerStyle}>
                  <img
                    className={imgStyle}
                    src={story.imgSrc}
                    alt={story.title}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className={textContainerStyle}>
                  <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
                  <p className="text-gray-700">{story.description}</p>
                </div>
              </section>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const MediumStories = () => {
  return (
    <div>
      <h3 className="text-3xl font-semibold my-5">中編作品</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediumStoriesData.map((story, index) => (
          <Link href={story.pdfSrc} target="_blank" key={index}>
            <div className={cardStyle}>
              <section className={sectionStyle}>
                <div className={imgContainerStyle}>
                  <img
                    className={imgStyle}
                    src={story.imgSrc}
                    alt={story.title}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className={textContainerStyle}>
                  <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
                  <p className="text-gray-700">{story.description}</p>
                </div>
              </section>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const LongStories = () => {
  return (
    <div>
      <h3 className="text-3xl font-semibold my-5">長編作品</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {longStoriesData.map((story, index) => (
          <Link href={story.pdfSrc} target="_blank" key={index}>
            <div className={cardStyle}>
              <section className={sectionStyle}>
                <div className={imgContainerStyle}>
                  <img
                    className={imgStyle}
                    src={story.imgSrc}
                    alt={story.title}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className={textContainerStyle}>
                  <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
                  <p className="text-gray-700">{story.description}</p>
                </div>
              </section>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function Portfolio() {
  return (
    <Layout>
      <Seo
        pageTitle="戯曲図書館オリジナル - 無料公開脚本"
        pageDescription="戯曲図書館オリジナルの無料公開脚本。上演料は無料です。"
        pagePath="https://gikyokutosyokan.com/diary/plot"
        pageImg="/img/og_image.jpg"
        pageImgWidth={1200}
        pageImgHeight={630}
      />
      <div className="container mx-auto ">
        <h2>戯曲図書館オリジナル 無料公開戯曲</h2>
        <p>これらは全て無料で公開中の脚本です</p>

        <p>上演やワークショップに許可は必要ありません。</p>
        <p>上演料は無料です。</p>
        <p>ワークショップに最適な短い脚本もあります。</p>

        <ShortStories />
        <MediumStories />
        <LongStories />
      </div>
    </Layout>
  );
}
