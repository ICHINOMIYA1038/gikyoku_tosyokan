/**
 * 小劇場劇団追加シードスクリプト（バッチ2）
 * 500団体達成に向けた追加投入分
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-shogekijo-batch2.ts
 */

import { PrismaClient, Region, TheaterGroupType } from '@prisma/client';

const prisma = new PrismaClient();

type ShogekijoData = {
  name: string;
  slug: string;
  groupType: TheaterGroupType;
  description?: string;
  memberCount?: number;
  foundedYear?: number;
  prefecture: string;
  region: Region;
  website?: string;
  twitter?: string;
  instagram?: string;
  corich?: string;
  otherLinks?: string[];
};

const additionalGroups: ShogekijoData[] = [
  // ============================================================
  // 北海道 (HOKKAIDO) - 追加7団体
  // ============================================================
  {
    name: '札幌ハムプロジェクト',
    slug: 'sapporo-ham-project',
    groupType: 'PROFESSIONAL',
    description: '2004年設立。天野ジロ代表。札幌本部員8名・東京支部員4名からなる演劇企画運営団体。札幌演劇シーズン常連。',
    foundedYear: 2004,
    prefecture: '北海道',
    region: 'HOKKAIDO',
    website: 'https://hampro.jp/',
    twitter: 'hamproject',
  },
  {
    name: '劇団fireworks',
    slug: 'gekidan-fireworks',
    groupType: 'PROFESSIONAL',
    description: '2010年に米沢春花が北海学園大学在学中に旗揚げ。札幌を中心に函館・旭川・青森など道内外各地でも旅公演を展開。',
    foundedYear: 2010,
    prefecture: '北海道',
    region: 'HOKKAIDO',
    website: 'https://gekidan-fireworks.jimdofree.com/',
    twitter: '__fireworks__',
    corich: 'https://stage.corich.jp/troupe/6651',
  },
  {
    name: '演劇家族スイートホーム',
    slug: 'engeki-kazoku-sweet-home',
    groupType: 'AMATEUR',
    description: '2016年発足、2017年旗揚げ公演。札幌劇場祭TGR2018新人賞受賞。',
    foundedYear: 2016,
    prefecture: '北海道',
    region: 'HOKKAIDO',
  },
  {
    name: 'パスプア',
    slug: 'paspoor',
    groupType: 'PROFESSIONAL',
    description: '札幌を拠点に活動する劇団。札幌演劇シーズン2024に初選出され「きをみずもりをみる」を上演。',
    prefecture: '北海道',
    region: 'HOKKAIDO',
    website: 'https://www.paspoor.com/',
  },
  {
    name: '劇団words of hearts',
    slug: 'words-of-hearts',
    groupType: 'AMATEUR',
    description: '札幌で活動する劇団。コンカリーニョ等で公演を行い、札幌演劇シーズンにも参加。',
    prefecture: '北海道',
    region: 'HOKKAIDO',
    website: 'http://words-of-hearts.com/',
    twitter: 'wordsofhearts02',
  },
  {
    name: '劇団怪獣無法地帯',
    slug: 'kaiju-muhouchitai',
    groupType: 'AMATEUR',
    description: '2005年結成。棚田満・伊藤しょうこ・新井田琴江の3名の脚本・演出作品を軸に札幌で上演活動を展開。',
    foundedYear: 2005,
    prefecture: '北海道',
    region: 'HOKKAIDO',
    website: 'https://fakecourtney0421.wixsite.com/kaijyumuhouchitai',
    twitter: 'muz_kaijyu',
  },
  {
    name: 'さっぽろ人形浄瑠璃あしり座',
    slug: 'ashiri-za',
    groupType: 'AMATEUR',
    description: '札幌を拠点に人形浄瑠璃を上演する団体。札幌演劇シーズン2024にも参加。',
    prefecture: '北海道',
    region: 'HOKKAIDO',
  },

  // ============================================================
  // 東京都 (KANTO) - 追加20団体
  // ============================================================
  {
    name: 'ロロ',
    slug: 'lolo',
    groupType: 'PROFESSIONAL',
    description: '2009年に三浦直之が旗揚げ。王子小劇場「筆に覚えあり戯曲募集」に史上初入選。ポップで叙情的な作風で幅広い支持を獲得。',
    foundedYear: 2009,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'http://loloweb.jp/',
    twitter: 'llo88oll',
  },
  {
    name: '範宙遊泳',
    slug: 'hanchu-yuei',
    groupType: 'PROFESSIONAL',
    description: '2007年に山本卓卓が桜美林大学在学中に旗揚げ。映像と身体を融合させた独自の演劇表現で国内外で活躍。',
    foundedYear: 2007,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.hanchuyuei2017.com/',
    twitter: 'HANCHU_JAPAN',
  },
  {
    name: '柿喰う客',
    slug: 'kaki-kuu-kyaku',
    groupType: 'PROFESSIONAL',
    description: '2006年に中屋敷法仁が青山学院大学在学中に旗揚げ。「圧倒的なフィクション」を標榜し、虚構性の高い演劇を展開。玉置玲央ら個性派俳優が所属。',
    foundedYear: 2006,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'http://kaki-kuu-kyaku.com/',
  },
  {
    name: 'マームとジプシー',
    slug: 'mum-and-gypsy',
    groupType: 'PROFESSIONAL',
    description: '2007年に藤田貴大が設立。反復とリフレインを駆使した独自の演出手法で岸田國士戯曲賞受賞。国際的にも高い評価。',
    foundedYear: 2007,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'http://mum-gypsy.com/',
    twitter: 'mum_gypsy',
  },
  {
    name: '玉田企画',
    slug: 'tamada-kikaku',
    groupType: 'PROFESSIONAL',
    description: '2012年に玉田真也が立ち上げた演劇ユニット。日常の「変な空気」を精緻でリアルな口語体で再現する会話劇が特徴。',
    foundedYear: 2012,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://tamada-kikaku.com/',
    twitter: 'tamadashinya',
  },
  {
    name: 'ロ字ック',
    slug: 'rojick',
    groupType: 'PROFESSIONAL',
    description: '2010年に山田佳奈が設立。現代社会でコミュニケーション障害を抱え成熟しきれない人々を描く。',
    foundedYear: 2010,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'http://www.roji649.com/',
    corich: 'https://stage.corich.jp/troupe/4255',
  },
  {
    name: 'サンプル',
    slug: 'sample',
    groupType: 'PROFESSIONAL',
    description: '2007年に松井周が青年団から独立して旗揚げ。「自慢の息子」で岸田國士戯曲賞受賞。2017年に松井の1人ユニットとして再始動。',
    foundedYear: 2007,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'http://www.samplenet.org/',
  },
  {
    name: 'Q',
    slug: 'q-ichihara-satoko',
    groupType: 'PROFESSIONAL',
    description: '2011年に市原佐都子が始動。「バッコスの信女-ホルスタインの雌」で岸田國士戯曲賞受賞。人間の生理や欲望をテーマにした実験的作品。',
    foundedYear: 2011,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://qqq-qqq-qqq.com/',
    twitter: 'QQQ_9',
  },
  {
    name: 'TRASHMASTERS',
    slug: 'trashmasters',
    groupType: 'PROFESSIONAL',
    description: '2000年に中津留章仁らが旗揚げ。現代社会の問題を取り入れた骨太な人間ドラマを中心に上演。',
    foundedYear: 2000,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'http://lcp.jp/trash/',
    twitter: 'Trash_info',
    corich: 'https://stage.corich.jp/troupe/116',
  },
  {
    name: 'ミナモザ',
    slug: 'minamoza',
    groupType: 'PROFESSIONAL',
    description: '2001年に瀬戸山美咲が立ち上げた演劇ユニット。現実の事件や出来事をモチーフにした社会派作品で知られる。',
    foundedYear: 2001,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://minamoza.com/',
    twitter: 'minamoza',
  },
  {
    name: 'かもめマシーン',
    slug: 'kamome-machine',
    groupType: 'PROFESSIONAL',
    description: '2007年に萩原雄太が設立。既存の演劇の枠組みを問い直す実験的なパフォーマンスを展開。',
    foundedYear: 2007,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.kamomemachine.com/',
  },
  {
    name: 'たすいち',
    slug: 'tasuichi',
    groupType: 'PROFESSIONAL',
    description: '2007年に早稲田大学演劇倶楽部出身メンバーで旗揚げ。虚構とリアルの境界を探る作品を上演。',
    foundedYear: 2007,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://tasuichi.wixsite.com/tasuichi',
    instagram: 'tasuichi',
    corich: 'https://stage.corich.jp/troupe/1873',
  },
  {
    name: 'ワワフラミンゴ',
    slug: 'wawa-flamingo',
    groupType: 'PROFESSIONAL',
    description: '鳥山フキが主宰する演劇ユニット。佐藤佐吉演劇祭で受賞歴あり。独自のユーモアと身体性が特徴。',
    prefecture: '東京都',
    region: 'KANTO',
  },
  {
    name: 'サスペンデッズ',
    slug: 'suspendeds',
    groupType: 'PROFESSIONAL',
    description: '早川康介主宰。MITAKA"Next"Selection選出。「夜と森のミュンヒハウゼン」等で注目される。',
    prefecture: '東京都',
    region: 'KANTO',
  },
  {
    name: '劇団 文学座附属演劇研究所',
    slug: 'bungakuza-kenkyujo',
    groupType: 'PROFESSIONAL',
    description: '文学座の附属研究所として俳優・演出家を育成。多くの実力派を輩出し続ける日本演劇界の重要機関。',
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.bungakuza.com/',
  },
  {
    name: '劇団民藝',
    slug: 'gekidan-mingei',
    groupType: 'PROFESSIONAL',
    description: '1950年設立。滝沢修・宇野重吉が創設した新劇の名門。社会的テーマを重視したリアリズム演劇を上演。',
    foundedYear: 1950,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.gekidanmingei.co.jp/',
  },
  {
    name: '劇団東演',
    slug: 'gekidan-toen',
    groupType: 'PROFESSIONAL',
    description: '1956年設立。ロシア演劇をはじめとする翻訳劇と創作劇を上演する老舗劇団。',
    foundedYear: 1956,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.t-toen.com/',
  },
  {
    name: 'シス・カンパニー',
    slug: 'sis-company',
    groupType: 'PROFESSIONAL',
    description: '北村明子が代表を務めるプロデュース集団。段田安則、キムラ緑子ら実力派俳優を擁し話題作を次々と制作。',
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.siscompany.com/',
  },
  {
    name: '劇団青年劇場',
    slug: 'seinen-gekijo',
    groupType: 'PROFESSIONAL',
    description: '1964年設立。社会的なテーマを追求し、働く人々の視点から現代を描く創作劇を上演。',
    foundedYear: 1964,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.seinengekijo.co.jp/',
  },
  {
    name: '劇団風の子',
    slug: 'gekidan-kazenoko',
    groupType: 'PROFESSIONAL',
    description: '1950年設立。日本初の児童演劇専門プロ劇団。全国の子どもたちに向けて年間1000回以上の巡回公演を実施。',
    foundedYear: 1950,
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://www.kazenoko.co.jp/',
  },

  // ============================================================
  // 大阪府 (KANSAI) - 追加10団体
  // ============================================================
  {
    name: 'オパンポン創造社',
    slug: 'opanpon-sozosha',
    groupType: 'PROFESSIONAL',
    description: '2004年に野村有志が旗揚げした一人演劇ユニット。ペーソスと笑いを融合させ泥臭い人間模様を描く会話劇が持ち味。',
    foundedYear: 2004,
    prefecture: '大阪府',
    region: 'KANSAI',
    twitter: 'opanpon_s',
    corich: 'https://stage.corich.jp/troupe/7440',
  },
  {
    name: 'コトリ会議',
    slug: 'kotori-kaigi',
    groupType: 'PROFESSIONAL',
    description: '2007年結成。作・演出の山本正典が第27回OMS戯曲賞大賞受賞。CoRich舞台芸術まつり！2024春で準グランプリ。',
    foundedYear: 2007,
    prefecture: '大阪府',
    region: 'KANSAI',
    website: 'http://kotorikaigi.com/',
    twitter: 'kotorikaigi',
    corich: 'https://stage.corich.jp/troupe/4417',
  },
  {
    name: 'dracom',
    slug: 'dracom',
    groupType: 'PROFESSIONAL',
    description: '1992年に前身の劇団ドラマティック・カンパニーを旗揚げ、1998年に改称。筒井潤がリーダーを務める公演芸術集団。',
    foundedYear: 1992,
    prefecture: '大阪府',
    region: 'KANSAI',
    website: 'http://www.dracom.site/',
  },
  {
    name: '劇団Furure',
    slug: 'gekidan-furure',
    groupType: 'AMATEUR',
    description: '大阪を中心に活動している小劇団。',
    prefecture: '大阪府',
    region: 'KANSAI',
    website: 'https://furure.company/',
  },
  {
    name: 'かのうとおっさん',
    slug: 'kanou-to-ossan',
    groupType: 'AMATEUR',
    description: '大阪を拠点に活動する演劇ユニット。中之島春の文化祭などに参加。',
    prefecture: '大阪府',
    region: 'KANSAI',
  },
  {
    name: '大阪放送劇団',
    slug: 'osaka-hoso-gekidan',
    groupType: 'PROFESSIONAL',
    description: 'NHK大阪放送局との関わりで知られる劇団。大阪で長年にわたり演劇活動を展開。',
    prefecture: '大阪府',
    region: 'KANSAI',
    website: 'https://osakahousougekidan.wixsite.com/ohgr',
  },
  {
    name: 'NHK大阪児童劇団',
    slug: 'nhk-osaka-jido-gekidan',
    groupType: 'PROFESSIONAL',
    description: '大阪で演劇・ミュージカル・ダンス・ヴォイストレーニングの教育と公演を行う児童劇団。',
    prefecture: '大阪府',
    region: 'KANSAI',
    website: 'https://jigeki.com/',
  },
  {
    name: '劇団ようきたなぁ',
    slug: 'gekidan-yokitana',
    groupType: 'AMATEUR',
    description: '大阪を拠点に活動する劇団。関西の小劇場シーンで活動。',
    prefecture: '大阪府',
    region: 'KANSAI',
  },
  {
    name: '劇団ルービックキューブ',
    slug: 'gekidan-rubik-cube',
    groupType: 'AMATEUR',
    description: '大阪を拠点に活動する劇団。',
    prefecture: '大阪府',
    region: 'KANSAI',
  },
  {
    name: '劇団キラキラデストロイヤーズ',
    slug: 'kirakira-destroyers',
    groupType: 'AMATEUR',
    description: '大阪を拠点に活動する劇団。',
    prefecture: '大阪府',
    region: 'KANSAI',
  },

  // ============================================================
  // 京都府 (KANSAI) - 追加7団体
  // ============================================================
  {
    name: 'ニットキャップシアター',
    slug: 'knitcap-theater',
    groupType: 'PROFESSIONAL',
    description: '1999年設立。劇作家「ごまのはえ」の脚本を楽器や仮面を使ってイマジネーション豊かに表現。2017年に一般社団法人毛帽子事務所を設立。',
    foundedYear: 1999,
    prefecture: '京都府',
    region: 'KANSAI',
    website: 'https://knitcap.jp/',
    twitter: 'knitcaptheater',
  },
  {
    name: 'ルドルフ',
    slug: 'rudolf-kyoto',
    groupType: 'PROFESSIONAL',
    description: '京都で演劇を上演する劇団。THEATRE E9 KYOTO等で定期的に公演。',
    prefecture: '京都府',
    region: 'KANSAI',
    website: 'https://rudolf.kyoto.jp/',
  },
  {
    name: '劇団道学先生',
    slug: 'gekidan-dougaku-sensei',
    groupType: 'PROFESSIONAL',
    description: '京都を拠点に活動する劇団。中嶋敦彦が劇作を手がけ、社会派の作品を上演。',
    prefecture: '京都府',
    region: 'KANSAI',
  },
  {
    name: '劇団速度',
    slug: 'gekidan-sokudo',
    groupType: 'PROFESSIONAL',
    description: '京都を拠点に活動する劇団。',
    prefecture: '京都府',
    region: 'KANSAI',
  },
  {
    name: '正直者の会',
    slug: 'shojikimono-no-kai',
    groupType: 'PROFESSIONAL',
    description: '京都を拠点に活動する演劇団体。',
    prefecture: '京都府',
    region: 'KANSAI',
  },
  {
    name: 'Theatre E9 Kyoto',
    slug: 'theatre-e9-kyoto',
    groupType: 'PROFESSIONAL',
    description: '2019年開館。京都駅近くの鴨川のほとりに建つ90席のブラックボックス型小劇場。クラウドファンディングや企業協賛で設立された民間劇場。',
    foundedYear: 2019,
    prefecture: '京都府',
    region: 'KANSAI',
    website: 'https://askyoto.or.jp/e9/',
    instagram: 'theatre_e9kyoto',
  },
  {
    name: '京都ロマンポップ',
    slug: 'kyoto-roman-pop',
    groupType: 'AMATEUR',
    description: '京都を拠点に活動する劇団。',
    prefecture: '京都府',
    region: 'KANSAI',
  },

  // ============================================================
  // 愛知県 (CHUBU) - 追加6団体
  // ============================================================
  {
    name: '星の女子さん',
    slug: 'hoshi-no-joshisan',
    groupType: 'PROFESSIONAL',
    description: '2008年結成。主宰の渡山博崇が作・演出を手がけ、世界の童話や日本の民話をモチーフにメルヘンと現代社会が合わさった不可思議な世界を創る。',
    foundedYear: 2008,
    prefecture: '愛知県',
    region: 'CHUBU',
    website: 'https://hoshinojoshisan.wixsite.com/hoshinojoshisan',
    twitter: 'hoshinojoshisan',
  },
  {
    name: '演劇組織KIMYO',
    slug: 'engeki-soshiki-kimyo',
    groupType: 'PROFESSIONAL',
    description: '2007年旗揚げ。高校時代に結成した5人組が劇団化。音楽・ダンスを積極的に取り入れたダイナミックで芸術性の高い演劇が特徴。',
    foundedYear: 2007,
    prefecture: '愛知県',
    region: 'CHUBU',
    website: 'https://hanzaki-kimyo.jimdofree.com/',
    instagram: 'engeki_kimyo',
    corich: 'https://stage.corich.jp/troupe/5625',
  },
  {
    name: '劇団名芸',
    slug: 'gekidan-meigei',
    groupType: 'AMATEUR',
    description: '1962年設立。名古屋市天白区を拠点にシェイクスピア・チェーホフ等の古典からオリジナル作品まで幅広く上演。',
    foundedYear: 1962,
    prefecture: '愛知県',
    region: 'CHUBU',
    website: 'https://gekidanmeigei.whitesnow.jp/',
  },
  {
    name: 'THE REVUE TOKAI',
    slug: 'the-revue-tokai',
    groupType: 'AMATEUR',
    description: '東海地方を拠点にミュージカル・レヴュー公演を行う団体。',
    prefecture: '愛知県',
    region: 'CHUBU',
  },
  {
    name: '病み芝居',
    slug: 'yami-shibai',
    groupType: 'AMATEUR',
    description: '名古屋を拠点に活動する劇団。「夢腐論（ムフロン）」等の作品を上演。',
    prefecture: '愛知県',
    region: 'CHUBU',
  },
  {
    name: 'SOZO Selection',
    slug: 'sozo-selection',
    groupType: 'PROFESSIONAL',
    description: '名古屋を拠点に小劇場舞台を制作・上演するプロデュース団体。',
    prefecture: '愛知県',
    region: 'CHUBU',
  },

  // ============================================================
  // 福岡県 (KYUSHU_OKINAWA) - 追加7団体
  // ============================================================
  {
    name: 'ブルーエゴナク',
    slug: 'blue-egonaku',
    groupType: 'PROFESSIONAL',
    description: '2012年に穴迫信一を中心に結成。北九州を拠点に活動。九州の演劇シーンを牽引する実力派劇団。',
    foundedYear: 2012,
    prefecture: '福岡県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://buru-egonaku.com/',
    instagram: 'egonaku',
  },
  {
    name: '演劇ユニット そめごころ',
    slug: 'somegokoro',
    groupType: 'AMATEUR',
    description: '2012年に福岡大学演劇部出身メンバーで旗揚げ。君島史哉主宰。福岡市を拠点に活動。',
    foundedYear: 2012,
    prefecture: '福岡県',
    region: 'KYUSHU_OKINAWA',
    website: 'http://somegokoro.com/',
  },
  {
    name: '劇団さんぽ',
    slug: 'gekidan-sanpo',
    groupType: 'PROFESSIONAL',
    description: '福岡県を拠点に全国の子どもたちに演劇を届ける一般社団法人。子どもたちの「はじめの一歩、二歩、さんぽ」を応援。',
    prefecture: '福岡県',
    region: 'KYUSHU_OKINAWA',
    website: 'http://gekidansanpo.com/',
    instagram: 'gekidan.sanpo',
  },
  {
    name: '劇団ルート',
    slug: 'gekidan-route',
    groupType: 'AMATEUR',
    description: '福岡市東区で活動するミュージカル劇団。経験不問で誰もがミュージカルの世界に触れられる場を提供。',
    prefecture: '福岡県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://route.tsujimoto.studio/',
  },
  {
    name: '(劇)池田商会',
    slug: 'geki-ikeda-shokai',
    groupType: 'PROFESSIONAL',
    description: '福岡を拠点に活動する一般社団法人の演劇団体。',
    prefecture: '福岡県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://www.geki-ikeda.com/',
  },
  {
    name: '劇団午前0時になる前に',
    slug: 'gekidan-gozen-0ji',
    groupType: 'AMATEUR',
    description: '福岡で活動する劇団。',
    prefecture: '福岡県',
    region: 'KYUSHU_OKINAWA',
  },
  {
    name: 'Action Team J-ONE',
    slug: 'action-team-j-one',
    groupType: 'AMATEUR',
    description: '福岡で活動するアクションとパフォーマンスを融合させた劇団。',
    prefecture: '福岡県',
    region: 'KYUSHU_OKINAWA',
  },
];

// ========== メイン処理 ==========

async function main() {
  console.log('=== 小劇場劇団追加シード（バッチ2）開始 ===\n');
  console.log(`投入対象: ${additionalGroups.length}団体\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const group of additionalGroups) {
    try {
      const existing = await prisma.theaterGroup.findUnique({ where: { slug: group.slug } });

      if (existing) {
        // 既存エントリは更新
        await prisma.theaterGroup.update({
          where: { slug: group.slug },
          data: {
            name: group.name,
            groupType: group.groupType,
            description: group.description ?? null,
            memberCount: group.memberCount ?? null,
            foundedYear: group.foundedYear ?? null,
            prefecture: group.prefecture,
            region: group.region,
            website: group.website ?? null,
            twitter: group.twitter ?? null,
            instagram: group.instagram ?? null,
            corich: group.corich ?? null,
            otherLinks: group.otherLinks ?? [],
          },
        });
        updated++;
        console.log(`  更新: ${group.name} (${group.slug})`);
      } else {
        await prisma.theaterGroup.create({
          data: {
            name: group.name,
            slug: group.slug,
            groupType: group.groupType,
            description: group.description ?? null,
            memberCount: group.memberCount ?? null,
            foundedYear: group.foundedYear ?? null,
            prefecture: group.prefecture,
            region: group.region,
            website: group.website ?? null,
            twitter: group.twitter ?? null,
            instagram: group.instagram ?? null,
            corich: group.corich ?? null,
            otherLinks: group.otherLinks ?? [],
          },
        });
        created++;
        console.log(`  作成: ${group.name} (${group.slug})`);
      }
    } catch (e) {
      errors++;
      console.error(`  エラー: ${group.name} (${group.slug}) - ${e}`);
    }
  }

  console.log(`\n=== 処理完了 ===`);
  console.log(`  新規作成: ${created}団体`);
  console.log(`  更新: ${updated}団体`);
  if (skipped > 0) console.log(`  スキップ: ${skipped}団体`);
  if (errors > 0) console.log(`  エラー: ${errors}件`);

  // 結果サマリ
  const totalCount = await prisma.theaterGroup.count();
  const byRegion = await prisma.theaterGroup.groupBy({
    by: ['region'],
    _count: true,
    orderBy: { _count: { region: 'desc' } },
  });

  console.log(`\n全団体数: ${totalCount}`);
  console.log('\nリージョン別:');
  for (const r of byRegion) {
    console.log(`  ${r.region}: ${r._count}団体`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
