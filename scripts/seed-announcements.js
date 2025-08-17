const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating sample announcements...');

  const announcements = [
    {
      title: '劇団青空 第15回公演「夏の夜の夢」',
      content: `シェイクスピアの名作「夏の夜の夢」を現代的にアレンジ！
      
妖精たちが織りなす幻想的な恋物語を、若手劇団員たちが情熱的に演じます。

【あらすじ】
アテネの森で繰り広げられる、4人の若者たちの恋の行方。妖精の王オーベロンと女王ティターニアの喧嘩に巻き込まれ、惚れ薬によって複雑に絡み合う恋愛模様。果たして真実の愛はどこにあるのか？

【見どころ】
・プロジェクションマッピングを使用した幻想的な森の演出
・生演奏による音楽
・若手俳優陣のフレッシュな演技

皆様のご来場を心よりお待ちしております！`,
      performanceDate: new Date('2024-07-20T14:00:00'),
      venue: '青山小劇場',
      ticketPrice: '前売 3,500円 / 当日 4,000円 / 学生 2,500円',
      contactInfo: `予約・お問い合わせ
メール: info@gekidan-aozora.com
電話: 03-1234-5678（平日10:00-18:00）
Web予約: https://example.com/reservation`,
      authorName: '劇団青空',
    },
    {
      title: '演劇ワークショップ「身体と声の表現」参加者募集',
      content: `初心者歓迎！プロの俳優による演劇ワークショップを開催します。

演劇の基礎となる身体表現と発声を中心に、楽しみながら学べる2日間のプログラムです。

【内容】
1日目：身体表現の基礎
- ストレッチとウォーミングアップ
- 空間認識とムーブメント
- 感情と身体の連動

2日目：声の表現
- 腹式呼吸と発声練習
- 台詞の読み方
- 簡単な場面練習

【講師】
山田太郎（俳優・演出家）
15年以上の舞台経験を持ち、数々の演劇ワークショップを主催。

対象：18歳以上（演劇経験不問）
定員：20名（先着順）
持ち物：動きやすい服装、飲み物`,
      performanceDate: new Date('2024-06-15T10:00:00'),
      venue: '市民文化センター 練習室A',
      ticketPrice: '2日間通し 8,000円（1日のみ参加 5,000円）',
      contactInfo: 'workshop@theater-academy.jp',
      authorName: '演劇アカデミー',
    },
    {
      title: '高校演劇部合同公演「青春グラフィティ2024」',
      content: `市内5つの高校演劇部による合同公演を開催します！

各校が20分の短編作品を上演。高校生たちの瑞々しい感性と情熱あふれる舞台をお楽しみください。

【プログラム】
第1部（13:00-14:30）
- 東高校「放課後の教室で」
- 西高校「僕らの夏休み」
- 南高校「図書室の秘密」

第2部（15:00-16:30）
- 北高校「卒業前夜」
- 中央高校「タイムカプセル」

各校の個性あふれる作品をぜひご覧ください。
入場無料ですが、整理券が必要です。`,
      performanceDate: new Date('2024-03-21T13:00:00'),
      venue: '市民会館大ホール',
      ticketPrice: '入場無料（要整理券）',
      contactInfo: '整理券配布：3月1日より市民会館窓口にて',
      authorName: '高校演劇部連盟',
    },
    {
      title: 'ミュージカル「街角のメロディー」オーディション開催',
      content: `新作オリジナルミュージカル「街角のメロディー」の出演者を募集します！

【募集役柄】
主役：男女各1名（20-30代）
アンサンブル：10名程度（年齢不問）

【オーディション内容】
- 歌唱（自由曲1曲・2分程度）
- ダンス（当日振付指導あり）
- 演技（当日配布の台本）

【稽古期間】
2024年8月〜10月（週3-4回）

【公演日程】
2024年11月1日〜3日（全5ステージ）

プロ・アマ問わず、熱意のある方のご応募をお待ちしています！`,
      performanceDate: new Date('2024-05-25T10:00:00'),
      venue: 'スタジオARK',
      ticketPrice: 'オーディション参加費：無料',
      contactInfo: `応募方法：メールにて履歴書（写真付き）を送付
audition@musical-melody.com
締切：5月20日必着`,
      authorName: 'プロデュースカンパニーARK',
    },
    {
      title: '朗読劇「銀河鉄道の夜」',
      content: `宮沢賢治の名作を朗読劇でお届けします。

シンプルな舞台装置と照明、そして俳優たちの声と身体表現のみで紡ぐ、想像力あふれる舞台。

音楽は生演奏のピアノとチェロ。
幻想的な銀河の旅をお楽しみください。

出演：
ジョバンニ：佐藤健一
カムパネルラ：鈴木翔太
ザネリ他：田中美咲

演出：山本花子

小学生以上推奨。
静かな演出のため、未就学児の入場はご遠慮ください。`,
      performanceDate: new Date('2024-04-10T19:00:00'),
      venue: '小劇場てあとる',
      ticketPrice: '一般 3,000円 / 高校生以下 1,500円',
      contactInfo: 'info@teatoru.jp / 080-9876-5432',
      authorName: '朗読集団ことのは',
    },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({
      data: announcement,
    });
  }

  console.log(`Created ${announcements.length} sample announcements`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });