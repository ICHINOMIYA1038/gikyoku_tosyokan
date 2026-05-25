/**
 * 小劇場劇団拡充シードスクリプト
 * 空白県・低カバー県を中心に全国の劇団データを追加投入
 *
 * 対象: 神奈川・千葉・埼玉・栃木・群馬・茨城・富山・福井・山梨・長野
 *       滋賀・奈良・徳島・愛媛・香川・高知・佐賀・鹿児島・宮崎
 *       山形・新潟・和歌山・鳥取・島根（補充分）
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-shogekijo-expansion.ts
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

const expansionGroups: ShogekijoData[] = [
  // ============================================================
  // 神奈川県 (KANTO) - 7団体
  // ============================================================
  {
    name: '劇団かに座',
    slug: 'gekidan-kaniza',
    groupType: 'AMATEUR',
    description: '1950年設立の横浜市民劇団。横浜駅徒歩6分の稽古場で週2回活動し、関内ホール等で公演を行う。',
    foundedYear: 1950,
    prefecture: '神奈川県',
    region: 'KANTO',
    website: 'https://kaniza.cloudfree.jp/',
    twitter: 'gekidan_kaniza',
    instagram: 'gekidankaniza',
    corich: 'https://stage.corich.jp/troupe/9507',
  },
  {
    name: '劇団麦の会',
    slug: 'gekidan-muginokai',
    groupType: 'AMATEUR',
    description: '1947年創立の横浜を拠点とするアマチュア劇団。東神奈川駅徒歩5分に専用稽古場を持ち、毎週木曜・土曜に活動。',
    foundedYear: 1947,
    prefecture: '神奈川県',
    region: 'KANTO',
    website: 'https://yokohamamuginokai.crayonsite.com/',
    corich: 'https://stage.corich.jp/troupe/5595',
  },
  {
    name: 'G/9-Project',
    slug: 'g9-project',
    groupType: 'AMATEUR',
    description: '1993年から横浜を拠点に活動する劇団。10代から50代の幅広い構成メンバーで、客席100名前後の小空間での公演を得意とする。',
    foundedYear: 1993,
    prefecture: '神奈川県',
    region: 'KANTO',
    website: 'https://www.g9-project.com/',
    twitter: 'g9project',
    instagram: 'g9project',
  },
  {
    name: '劇団糸',
    slug: 'gekidan-ito',
    groupType: 'AMATEUR',
    description: '横浜市で活動する小劇団。「地域と人」をテーマにオリジナルの脚本と音楽で作品を制作。',
    prefecture: '神奈川県',
    region: 'KANTO',
    website: 'https://gekiito.com/',
  },
  {
    name: '劇団かえる',
    slug: 'gekidan-kaeru',
    groupType: 'AMATEUR',
    description: '「演劇を身近に！」をコンセプトに横浜市内で活動する社会人劇団。週1回土日に稽古を行う。',
    prefecture: '神奈川県',
    region: 'KANTO',
    website: 'https://gekidankaeru.jimdofree.com/',
    twitter: 'gekidan__kaeru',
  },
  {
    name: 'オペラシアターこんにゃく座',
    slug: 'opera-theater-konnyakuza',
    groupType: 'PROFESSIONAL',
    description: '1971年設立の日本語オペラ専門カンパニー。川崎市多摩区を拠点に全国で公演を行い、日本語の美しさを活かしたオペラ作品を創作。',
    foundedYear: 1971,
    prefecture: '神奈川県',
    region: 'KANTO',
    website: 'https://www.konnyakuza.com/',
    twitter: 'konnyakuza',
  },
  {
    name: '劇団Q+',
    slug: 'gekidan-q-plus',
    groupType: 'PROFESSIONAL',
    description: '2014年に横浜の社会人劇団「横浜スタイル」を前身として活動開始。2021年以降はプロ志向の劇団として運営。',
    foundedYear: 2014,
    prefecture: '神奈川県',
    region: 'KANTO',
    website: 'https://www.gekidan-q.com/',
  },

  // ============================================================
  // 千葉県 (KANTO) - 7団体
  // ============================================================
  {
    name: '劇団十夢',
    slug: 'gekidan-tomu',
    groupType: 'AMATEUR',
    description: '千葉県船橋市を拠点に活動する劇団。参加者の9割以上が演劇未経験からスタートし、10代から50代まで幅広い世代が所属。',
    prefecture: '千葉県',
    region: 'KANTO',
    website: 'https://tomu.tv/',
    twitter: 'gekidan_tomu',
    corich: 'https://stage.corich.jp/troupe/4132',
  },
  {
    name: '劇団春夏秋冬ジンバブエ',
    slug: 'gekidan-shunkashuto-zimbabwe',
    groupType: 'AMATEUR',
    description: '千葉県を拠点に活動するアマチュア劇団。元プロから初心者まで幅広いメンバーが在籍し、歌やダンスを取り入れたわかりやすい舞台を制作。',
    prefecture: '千葉県',
    region: 'KANTO',
    website: 'https://www.zimbabwe.jp/',
  },
  {
    name: '劇団流星群',
    slug: 'gekidan-ryuuseigun',
    groupType: 'AMATEUR',
    description: '千葉と東京を拠点に活動する劇団。声優・舞台・イベント等の出演情報を発信し、20周年記念公演を企画。',
    prefecture: '千葉県',
    region: 'KANTO',
    website: 'https://shooting-star-family.com/',
    twitter: '_ssfamily_',
  },
  {
    name: '劇団ヒラガナ',
    slug: 'gekidan-hiragana',
    groupType: 'AMATEUR',
    description: '千葉県市川市を拠点に活動する劇団。定期的に公演を行い、新規団員も募集中。',
    prefecture: '千葉県',
    region: 'KANTO',
    website: 'https://www.kilt-inc.jp/hiragana/',
    twitter: 'gekidanhiragana',
    instagram: 'gekidan_hiragana',
  },
  {
    name: 'ほぼ・シニア劇団コダカラ',
    slug: 'hobo-senior-gekidan-kodakara',
    groupType: 'AMATEUR',
    description: '千葉県柏市を拠点とするシニア劇団。演劇経験の有無を問わず、やってみたい人たちが集まり活動。毎月第1・3日曜日に稽古。',
    prefecture: '千葉県',
    region: 'KANTO',
    website: 'https://k-kodakara.com/',
    corich: 'https://stage.corich.jp/troupe/67243',
  },
  {
    name: 'ちばミュージカルアカデミー',
    slug: 'chiba-musical-academy',
    groupType: 'AMATEUR',
    description: '千葉県を拠点にミュージカル公演を行う団体。「千葉から舞台芸術を発信」をモットーに活動。',
    prefecture: '千葉県',
    region: 'KANTO',
    website: 'https://www.c-musical.net/',
  },
  {
    name: '劇団Re:Start',
    slug: 'gekidan-restart',
    groupType: 'AMATEUR',
    description: '千葉県東金市を中心に活動する劇団。10周年記念公演を企画中。',
    prefecture: '千葉県',
    region: 'KANTO',
    website: 'https://showyourestart.amebaownd.com/',
    twitter: 'maoto33',
  },

  // ============================================================
  // 埼玉県 (KANTO) - 6団体
  // ============================================================
  {
    name: '劇団埼芸',
    slug: 'gekidan-saigei',
    groupType: 'AMATEUR',
    description: '1965年に埼玉県南部の4劇団が合流して結成。上尾市に稽古場を構え、新劇を中心に年2回程度の公演を行う。20代から80代まで在籍。',
    foundedYear: 1965,
    prefecture: '埼玉県',
    region: 'KANTO',
    website: 'https://gekidan-saigei.jimdofree.com/',
    twitter: 'gogosaigei',
  },
  {
    name: 'NPO法人劇団サードクォーター',
    slug: 'gekidan-third-quarter',
    groupType: 'AMATEUR',
    description: '2016年よりNPO法人として活動するさいたま市の地元密着劇団。12歳から82歳の社会人で構成され、演劇上演・教育機関への表現指導を実施。',
    foundedYear: 2016,
    prefecture: '埼玉県',
    region: 'KANTO',
    website: 'https://www.tqtqtq.org/',
  },
  {
    name: 'さいたま市民劇団',
    slug: 'saitama-shimin-gekidan',
    groupType: 'AMATEUR',
    description: '2011年設立のミュージカル劇団。「趣味の範囲で楽しむこと」がコンセプトで、15歳以上の経験不問の多様な参加者が活動。',
    foundedYear: 2011,
    prefecture: '埼玉県',
    region: 'KANTO',
    website: 'https://saitamashimingekidan.jimdofree.com/',
  },
  {
    name: '訪問演劇GIFT',
    slug: 'houmon-engeki-gift',
    groupType: 'AMATEUR',
    description: '埼玉県富士見市を拠点に活動するボランティア劇団。元介護士の主宰が、介護施設に演劇の楽しさを届ける活動を展開。',
    prefecture: '埼玉県',
    region: 'KANTO',
    website: 'https://www.houmonnenngekigift.com/',
  },
  {
    name: '劇団しゃれこうべ',
    slug: 'gekidan-sharekobe',
    groupType: 'AMATEUR',
    description: '東京都を拠点に活動する社会人劇団。劇団神戸（故・夏目俊二主宰）の姉妹劇団として設立され、代表が関東へ移住したことを機に旗揚げ。「大人が愉しむ劇空間をつくる」をキャッチフレーズに、サラリーマンとして働きながら演劇と真剣に向き合う劇団員が集まる。座付き衣装家（伊藤熹朔賞新人賞・兵庫県芸術奨励賞受賞）が在籍するのが強みで、チェーホフやシェイクスピア、井上ひさし作品など幅広いジャンルを上演。初心者向け演劇学校「遊びの部屋」も運営している。',
    prefecture: '東京都',
    region: 'KANTO',
    website: 'https://sharekobe.com/',
    twitter: 'g_sharekobe',
  },
  {
    name: '劇団WAO!',
    slug: 'gekidan-wao',
    groupType: 'AMATEUR',
    description: '「あの頃置き忘れた夢を叶える大人の集団」をキャッチフレーズに活動する劇団。埼玉・東京エリアで公演。',
    prefecture: '埼玉県',
    region: 'KANTO',
    website: 'https://www.gekidan-wao.com/',
  },

  // ============================================================
  // 栃木県 (KANTO) - 4団体
  // ============================================================
  {
    name: '劇団らくりん座',
    slug: 'gekidan-rakurinza',
    groupType: 'PROFESSIONAL',
    description: '1952年設立。栃木県那須塩原市を拠点に全国の子どもたちへ「生きる力」となる演劇を届けるプロ劇団。児童・青少年演劇を専門とする。',
    foundedYear: 1952,
    prefecture: '栃木県',
    region: 'KANTO',
    website: 'https://rakurinza.com/',
    twitter: 'rakurin2',
  },
  {
    name: '日穏 -bion-',
    slug: 'bion',
    groupType: 'PROFESSIONAL',
    description: '2008年設立。宇都宮市出身の岩瀬顕子が企画・脚本、丹治大吾が演出を手がけるプロデュース団体。戦争や差別を背景に笑いと涙のある作品を創作。',
    foundedYear: 2008,
    prefecture: '栃木県',
    region: 'KANTO',
    website: 'https://bion.jp/',
  },
  {
    name: '劇団仲間',
    slug: 'gekidan-nakama-tochigi',
    groupType: 'PROFESSIONAL',
    description: '1953年創立。主に児童向けの演劇作品を全国各地で上演する劇団。子どもたちに生の演劇体験を届ける活動を継続。',
    foundedYear: 1953,
    prefecture: '栃木県',
    region: 'KANTO',
    website: 'https://info277214.wixsite.com/gekidannakama',
  },
  {
    name: '演技EARTH',
    slug: 'engi-earth',
    groupType: 'AMATEUR',
    description: '栃木市の小劇場「笑輪館」を活動拠点とするアマチュア劇団。喜劇・コメディを中心に上演し、毎週水曜夜に稽古。',
    prefecture: '栃木県',
    region: 'KANTO',
  },

  // ============================================================
  // 群馬県 (KANTO) - 7団体
  // ============================================================
  {
    name: '劇団群馬中芸',
    slug: 'gekidan-gunma-chugei',
    groupType: 'PROFESSIONAL',
    description: '1962年11月設立。前橋市を拠点に群馬県・関東甲信地域を中心に活動する老舗劇団。',
    foundedYear: 1962,
    prefecture: '群馬県',
    region: 'KANTO',
    website: 'https://www.gunmachugei.com/',
  },
  {
    name: '劇団ろしなんて',
    slug: 'gekidan-roshinante',
    groupType: 'AMATEUR',
    description: '1971年9月設立の群馬県内有数の歴史あるアマチュア劇団。高崎市・前橋市を中心に活動し、令和5年度群馬県文化賞・文化功労賞を受賞。',
    foundedYear: 1971,
    prefecture: '群馬県',
    region: 'KANTO',
    website: 'https://gekidan-roshinante-since1971.jimdofree.com/',
    corich: 'https://stage.corich.jp/troupe/2620',
  },
  {
    name: '劇団ザ・マルクシアター',
    slug: 'gekidan-the-maruku-theater',
    groupType: 'AMATEUR',
    description: '1983年結成。群馬県前橋市を中心に活動するアマチュア劇団。YouTube「MARUKU MOVIE CHANNEL」で活動紹介も発信。',
    foundedYear: 1983,
    prefecture: '群馬県',
    region: 'KANTO',
    website: 'https://marukutheater.jimdofree.com/',
  },
  {
    name: 'ミュージカル劇団A-ile',
    slug: 'musical-gekidan-a-ile',
    groupType: 'AMATEUR',
    description: '2011年設立。社会人女性のみで構成される群馬県のミュージカル劇団。前橋市を拠点に仕事や家庭と両立しながら本格パフォーマンスを提供。',
    foundedYear: 2011,
    prefecture: '群馬県',
    region: 'KANTO',
    website: 'https://a-ile2011.com/',
  },
  {
    name: '劇団らん',
    slug: 'gekidan-ran-gunma',
    groupType: 'AMATEUR',
    description: '群馬県で活動する芝居集団。ぐんま演劇商店街に参加し、県内公演を中心に活動。',
    prefecture: '群馬県',
    region: 'KANTO',
    twitter: 'gekidan_ran',
  },
  {
    name: '劇団シブパ',
    slug: 'gekidan-shibupa',
    groupType: 'AMATEUR',
    description: '群馬県前橋市を中心に活動するアマチュア劇団。ぐんま演劇商店街に登録し地域の演劇活動に参加。',
    prefecture: '群馬県',
    region: 'KANTO',
    website: 'https://sites.google.com/view/shibupa',
  },
  {
    name: '演劇サークルSORA',
    slug: 'engeki-circle-sora',
    groupType: 'AMATEUR',
    description: '群馬県で活動する演劇サークル。初心者歓迎で幅広い世代が参加し、地域の文化活動に貢献。',
    prefecture: '群馬県',
    region: 'KANTO',
    website: 'https://circlesora.jimdofree.com/',
  },

  // ============================================================
  // 茨城県 (KANTO) - 6団体
  // ============================================================
  {
    name: '劇団創造市場',
    slug: 'gekidan-sozo-ichiba',
    groupType: 'AMATEUR',
    description: '1974年再結成。茨城県土浦市を拠点に活動する老舗劇団。社会人・学生が役者やスタッフとして参加し、毎週火・金・土の夜に稽古。',
    foundedYear: 1974,
    prefecture: '茨城県',
    region: 'KANTO',
    website: 'https://sozoichiba.com/',
    twitter: 'sozoichiba',
    corich: 'https://stage.corich.jp/troupe/2943',
  },
  {
    name: '劇団ACM',
    slug: 'gekidan-acm-mito',
    groupType: 'PROFESSIONAL',
    description: '水戸芸術館の開館と同時に設立された専属劇団（Acting Company Mito）。ACM劇場での公演のほか、小学生のための演劇鑑賞会やワークショップも実施。',
    foundedYear: 1990,
    prefecture: '茨城県',
    region: 'KANTO',
    website: 'https://www.arttowermito.or.jp/theatre/acm/',
    twitter: 'ACM_theatre',
  },
  {
    name: 'イチニノ',
    slug: 'ichinino',
    groupType: 'AMATEUR',
    description: '茨城発の演劇チーム。「1、2の」までは準備するので「3！」はみなさんご一緒にをコンセプトに、密度の濃い舞台空間を創出。',
    prefecture: '茨城県',
    region: 'KANTO',
    website: 'https://ichinino.jimdofree.com/',
    twitter: 'Ichinino_',
    corich: 'https://stage.corich.jp/troupe/12990',
  },
  {
    name: '劇団いばらき〜水戸黄門〜',
    slug: 'gekidan-ibaraki-mito-komon',
    groupType: 'AMATEUR',
    description: '茨城県水戸市を拠点に施設慰問公演を中心に活動する市民劇団。茨城を象徴する「水戸黄門」を題材にした演劇を上演。',
    prefecture: '茨城県',
    region: 'KANTO',
    website: 'http://ibaraki5650.com/',
  },
  {
    name: 'TEAM虹色の箱舟',
    slug: 'team-nijiiro-no-hakobune',
    groupType: 'AMATEUR',
    description: '茨城県南地域（牛久市・龍ヶ崎市・土浦市・つくば市）で活動する劇団。毎週日曜13時〜17時に稽古。',
    prefecture: '茨城県',
    region: 'KANTO',
    website: 'https://rainbowcoloredark.wixsite.com/theater',
    twitter: 'rainbowcolorark',
  },
  {
    name: '演劇の会MOO',
    slug: 'engeki-no-kai-moo',
    groupType: 'AMATEUR',
    description: '茨城県那珂市に稽古場を持つ劇団。喜劇・コメディを中心に上演し、初心者から経験者まで幅広く受け入れ。',
    prefecture: '茨城県',
    region: 'KANTO',
  },

  // ============================================================
  // 富山県 (CHUBU) - 4団体
  // ============================================================
  {
    name: 'SCOT（Suzuki Company of Toga）',
    slug: 'scot-suzuki-company-of-toga',
    groupType: 'PROFESSIONAL',
    description: '演出家・鈴木忠志が主宰する世界的に著名な劇団。1976年に富山県利賀村へ拠点を移し「演劇の聖地」として国際的に知られる。毎夏SCOTサマー・シーズンを開催。',
    foundedYear: 1966,
    prefecture: '富山県',
    region: 'CHUBU',
    website: 'https://www.scot-suzukicompany.com/',
    twitter: 'SCOT_Toga',
    instagram: 'scot_toga',
  },
  {
    name: '劇団フロンティア',
    slug: 'gekidan-frontier',
    groupType: 'AMATEUR',
    description: '1968年「黒部演研フロンティア」として結成。劇団員が自ら建設した「シアターフロンティア」を拠点に活動する富山県黒部市のアマチュア劇団。',
    foundedYear: 1968,
    prefecture: '富山県',
    region: 'CHUBU',
    website: 'http://www.theater-frontier.com/',
  },
  {
    name: '演劇集団富山舞台',
    slug: 'engeki-shudan-toyama-butai',
    groupType: 'PROFESSIONAL',
    description: '俳優・西村まさ彦が地元富山で2022年に設立。富山市八尾町の元酒蔵「双魚亭」を稽古場兼劇場とし、プロの俳優育成を目指す。',
    foundedYear: 2022,
    prefecture: '富山県',
    region: 'CHUBU',
    twitter: 'toyama_butai',
  },
  {
    name: '劇団ココロ跡',
    slug: 'gekidan-kokoroato',
    groupType: 'AMATEUR',
    description: '富山県を拠点に活動する劇団。20代中心のメンバーで定期的に公演を行っている。',
    prefecture: '富山県',
    region: 'CHUBU',
    website: 'https://kokoroato.com/',
  },

  // ============================================================
  // 福井県 (CHUBU) - 6団体
  // ============================================================
  {
    name: '演衆やむなし',
    slug: 'enshu-yamunashi',
    groupType: 'AMATEUR',
    description: '50年の歴史を閉じた「劇団福井青年劇場」の元団員6名が2015年に旗揚げ。現在15名が在籍し、5〜9ヶ月に1本のペースで作品を発表。',
    foundedYear: 2015,
    prefecture: '福井県',
    region: 'CHUBU',
    website: 'https://www.yamunashi.com/',
    twitter: 'fukui_yamunashi',
  },
  {
    name: 'さよならキャンプ',
    slug: 'sayonara-camp',
    groupType: 'AMATEUR',
    description: '福井県発の4人組演劇ユニット。寺院・体育館・ホームセンターなど従来の劇場にとらわれず様々な場所で公演を行い、演劇ワークショップも定期開催。',
    prefecture: '福井県',
    region: 'CHUBU',
    website: 'https://sayonara-camp.com/',
    twitter: 'sayonara_camp',
  },
  {
    name: 'フガフガLaboratory',
    slug: 'fugafuga-laboratory',
    groupType: 'AMATEUR',
    description: '2019年から活動する福井県の劇団。福井演劇連盟のカレンダー運営にも携わり、地域の演劇情報発信に貢献。',
    foundedYear: 2019,
    prefecture: '福井県',
    region: 'CHUBU',
    website: 'https://blog636.wixsite.com/fugalabo',
  },
  {
    name: '劇団久須夜',
    slug: 'gekidan-kusuya',
    groupType: 'AMATEUR',
    description: '福井県小浜市文化会館を拠点に活動するアマチュア劇団。第40作品を数える長い活動歴を持ち、地域に根ざした演劇活動を展開。',
    prefecture: '福井県',
    region: 'CHUBU',
    website: 'https://gekidankusuya.jimdofree.com/',
  },
  {
    name: '劇団AOITORI',
    slug: 'gekidan-aoitori',
    groupType: 'AMATEUR',
    description: '福井県越前市で活動する市民劇団。越前市の市民活動団体として登録され、地域の演劇文化に貢献している。',
    prefecture: '福井県',
    region: 'CHUBU',
  },
  {
    name: '福井劇の会',
    slug: 'fukui-geki-no-kai',
    groupType: 'AMATEUR',
    description: '福井県福井市を拠点に活動する演劇団体。公式ブログで活動情報を発信し、新規団員も随時募集している。',
    prefecture: '福井県',
    region: 'CHUBU',
  },

  // ============================================================
  // 山梨県 (CHUBU) - 2団体
  // ============================================================
  {
    name: '山梨演劇サークルLife',
    slug: 'yamanashi-engeki-circle-life',
    groupType: 'AMATEUR',
    description: '2017年発足。大人も子どもも参加できるミュージカル公演を年1回開催し、2020年度山梨県文化賞奨励賞を受賞。現在34名で活動中。',
    foundedYear: 2017,
    prefecture: '山梨県',
    region: 'CHUBU',
    website: 'https://engekicir-life.jimdofree.com/',
    twitter: 'engekicir_life',
    instagram: 'yamanashi.engeki.cir.life',
  },
  {
    name: '演劇ユニット ゼロ企画',
    slug: 'engeki-unit-zero-kikaku',
    groupType: 'AMATEUR',
    description: '2018年7月立ち上げ。「演劇でしかできない表現」を追求し、山梨の演劇の輪を広げる活動を展開する演劇ユニット。',
    foundedYear: 2018,
    prefecture: '山梨県',
    region: 'CHUBU',
    website: 'https://peraichi.com/landing_pages/view/zerokikaku/',
    instagram: 'zeroplanning',
  },

  // ============================================================
  // 長野県 (CHUBU) - 5団体
  // ============================================================
  {
    name: 'NPO法人劇空間夢幻工房',
    slug: 'npo-gekikukan-mugen-koubou',
    groupType: 'AMATEUR',
    description: '長野市を拠点に25年以上活動する演劇専門集団。2001年より毎夏野外劇を創作し続ける全国でも珍しい劇団。市民劇や演劇ワークショップも県内各地で展開。',
    foundedYear: 1999,
    prefecture: '長野県',
    region: 'CHUBU',
    website: 'http://g-mugen.main.jp/',
    twitter: 'mugen_koubou',
    corich: 'https://stage.corich.jp/troupe/12442',
  },
  {
    name: '劇団ココロワ',
    slug: 'gekidan-cocorowa-nagano',
    groupType: 'AMATEUR',
    description: '長野市を中心に活動するコメディ劇団。「舞台空間を通してココロの輪を広げる」をモットーに年2回の公演を目標に活動。2023年に20周年記念公演を開催。',
    foundedYear: 2003,
    prefecture: '長野県',
    region: 'CHUBU',
    twitter: 'cocorowa_info',
  },
  {
    name: 'シアターランポン',
    slug: 'theater-lampon',
    groupType: 'PROFESSIONAL',
    description: '2023年4月に松本市に移住した俳優たちが旗揚げ。松本市中央の古市ビルに拠点を持ち、小学校でのアウトリーチ活動も展開する一般社団法人。',
    foundedYear: 2023,
    prefecture: '長野県',
    region: 'CHUBU',
    website: 'https://lampon.info/',
    twitter: 'theatreLAMPON',
  },
  {
    name: '劇団野らぼう',
    slug: 'gekidan-norabou',
    groupType: 'AMATEUR',
    description: '松本市で主に野外で演劇公演を行う劇団。巨大人形を用いた人形劇や飲み屋巡回の流し芝居など、環境に合わせた独創的な作品を多数創作。',
    prefecture: '長野県',
    region: 'CHUBU',
    website: 'https://norabou.net/',
    twitter: 'norabou_',
  },
  {
    name: '劇團しなの８號',
    slug: 'gekidan-shinano-hachigo',
    groupType: 'AMATEUR',
    description: '松本市を中心に活動する劇団。2014〜15年にユニットとして活動後、3年の休止期間を経て2019年に劇団として正式に活動再開。',
    foundedYear: 2019,
    prefecture: '長野県',
    region: 'CHUBU',
    corich: 'https://stage.corich.jp/troupe/10558',
  },

  // ============================================================
  // 滋賀県 (KANSAI) - 3団体
  // ============================================================
  {
    name: '劇団まちプロ一座',
    slug: 'machipro-ichiza',
    groupType: 'AMATEUR',
    description: '社会福祉法人「共生シンフォニー まちかどプロジェクト」のもとで活動する滋賀県の劇団。障害のある人の実体験をもとにオリジナル脚本を作成し共生社会を訴える。',
    prefecture: '滋賀県',
    region: 'KANSAI',
  },
  {
    name: '劇団道草',
    slug: 'gekidan-michikusa',
    groupType: 'AMATEUR',
    description: '2018年1月に高校時代の演劇仲間が集まり結成した滋賀県の劇団。2018年7月に旗揚げ公演を行い、近江演劇祭にも参加。',
    foundedYear: 2018,
    prefecture: '滋賀県',
    region: 'KANSAI',
    website: 'https://gekidanmichikusa.jimdofree.com/',
  },
  {
    name: '演劇ユニット Spica',
    slug: 'engeki-unit-spica',
    groupType: 'AMATEUR',
    description: '滋賀県で活動する演劇ユニット。舞台監督・舞台美術家・俳優で構成され、近江演劇祭に参加するなど滋賀の演劇シーンで活動。',
    prefecture: '滋賀県',
    region: 'KANSAI',
  },

  // ============================================================
  // 奈良県 (KANSAI) - 2団体
  // ============================================================
  {
    name: '劇団良弁杉',
    slug: 'gekidan-robensugi',
    groupType: 'AMATEUR',
    description: '1994年に奈良市音声館開館とともに結成された市民劇団。東大寺二月堂に伝わる民話をもとにした創作ミュージカル「二月堂良弁杉」を制作・上演。',
    foundedYear: 1994,
    prefecture: '奈良県',
    region: 'KANSAI',
  },
  {
    name: 'あかねこフレンズ',
    slug: 'akaneko-friends',
    groupType: 'AMATEUR',
    description: '2020年夏に結成された奈良の音楽劇団。ソプラノ歌手の松尾茜が代表を務め、小学生から社会人まで幅広いメンバーが在籍。年に一度ミュージカル公演を上演。',
    foundedYear: 2020,
    prefecture: '奈良県',
    region: 'KANSAI',
    website: 'https://akaneko-mtc.com/',
  },

  // ============================================================
  // 徳島県 (CHUGOKU_SHIKOKU) - 2団体
  // ============================================================
  {
    name: 'todokeru,',
    slug: 'todokeru',
    groupType: 'AMATEUR',
    description: '2020年に主宰の沖繁実が設立した徳島の演劇団体。北島町を中心に、芝居を通してお客様にお届けすることを使命にオリジナル作品を上演。',
    foundedYear: 2020,
    prefecture: '徳島県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://todokeru.studio.site/',
    twitter: 'todokeru_engeki',
    instagram: 'todokeru_',
    corich: 'https://stage.corich.jp/troupe/20386',
  },
  {
    name: '劇団まんまる',
    slug: 'gekidan-manmaru',
    groupType: 'AMATEUR',
    description: '2015年春に徳島で活動を開始した劇団。ナンセンスコメディからシリアスな朗読劇まで幅広いジャンルを上演。即興芝居にも挑戦。',
    foundedYear: 2015,
    prefecture: '徳島県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://troupemanmaru.com/',
    corich: 'https://stage.corich.jp/troupe/14265',
  },

  // ============================================================
  // 愛媛県 (CHUGOKU_SHIKOKU) - 3団体
  // ============================================================
  {
    name: '劇団UZ',
    slug: 'gekidan-uz',
    groupType: 'AMATEUR',
    description: '2020年7月に松山市で設立された劇団。俳優・上松知史と座付き作家・伊豆野眸を中心に活動。オリジナル作品を年1〜2回上演。',
    foundedYear: 2020,
    prefecture: '愛媛県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://gekidanuz.wixsite.com/home',
    twitter: 'gekidan_uz',
  },
  {
    name: '世界劇団',
    slug: 'sekai-gekidan',
    groupType: 'PROFESSIONAL',
    description: '愛媛・松山を拠点に活動する劇団。本坊由華子が代表を務め、現代演劇やパフォーマンスアートを制作。豊岡演劇祭等にも参加し国内外で活動。',
    prefecture: '愛媛県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://worldtheater.main.jp/',
    twitter: 'worldtheatermat',
  },
  {
    name: '劇団こじか座',
    slug: 'gekidan-kojikaza',
    groupType: 'AMATEUR',
    description: '愛媛県松山市で長年活動する歴史あるアマチュア劇団。年間の施設訪問公演や本公演を中心に、地域に根差した演劇活動を展開。',
    prefecture: '愛媛県',
    region: 'CHUGOKU_SHIKOKU',
  },

  // ============================================================
  // 香川県 (CHUGOKU_SHIKOKU) - 2団体
  // ============================================================
  {
    name: '株式劇団マエカブ',
    slug: 'kabushiki-gekidan-maekabu',
    groupType: 'AMATEUR',
    description: '香川県高松市・坂出市で活動する劇団。本公演のほか、短編作品中心の演劇祭を高松市や琴平町で開催するなど、香川の演劇シーンを盛り上げる。',
    prefecture: '香川県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'http://www.maekabu.com/',
    twitter: 'mae_kabu',
  },
  {
    name: '劇団銀河鉄道',
    slug: 'gekidan-gingatetsudo',
    groupType: 'AMATEUR',
    description: '香川県高松市を拠点に活動するアマチュア劇団。オリジナルミュージカルをメインに、既成概念にとらわれない自由な舞台づくりを目指す。',
    prefecture: '香川県',
    region: 'CHUGOKU_SHIKOKU',
    twitter: 'gintetsu_t',
    instagram: 'gintetsu_takamatsu',
  },

  // ============================================================
  // 高知県 (CHUGOKU_SHIKOKU) - 2団体
  // ============================================================
  {
    name: 'シャカ力',
    slug: 'syakariki',
    groupType: 'AMATEUR',
    description: '2010年10月結成。四国劇王で初の二連覇を達成し、神奈川かもめ短編演劇祭で演出賞受賞。台本作成・出演からワークショップまで幅広く活動。',
    foundedYear: 2010,
    prefecture: '高知県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://syakariki-kochi001.amebaownd.com/',
    twitter: 'syakariki_kochi',
  },
  {
    name: '劇団笛の会',
    slug: 'gekidan-fue-no-kai',
    groupType: 'AMATEUR',
    description: '1958年に結成された高知県の劇団。演劇を通して平和の鐘を高らかに鳴らそうと長年にわたり活動を続ける老舗劇団。',
    foundedYear: 1958,
    prefecture: '高知県',
    region: 'CHUGOKU_SHIKOKU',
  },

  // ============================================================
  // 佐賀県 (KYUSHU_OKINAWA) - 3団体
  // ============================================================
  {
    name: '劇団さわげ',
    slug: 'gekidan-sawage',
    groupType: 'AMATEUR',
    description: '2014年に「佐賀の演劇文化を若手の力で盛り上げたい」と若手役者らで結成。ダンスや映像を使ったエンターテインメント性のある舞台が特徴。',
    foundedYear: 2014,
    prefecture: '佐賀県',
    region: 'KYUSHU_OKINAWA',
  },
  {
    name: '佐賀の八賢人おもてなし隊',
    slug: 'saga-hachikenjin-omotenashi',
    groupType: 'AMATEUR',
    description: '2012年旗揚げの役者ユニット。幕末・明治の佐賀出身八賢人のドラマを佐賀城本丸歴史館にて毎週日曜に上演。観客累計10万人超。',
    foundedYear: 2012,
    prefecture: '佐賀県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://sagahachikenjin.sagafan.jp/',
  },
  {
    name: '劇団とんとこパピィ',
    slug: 'tontoko-papii',
    groupType: 'AMATEUR',
    description: '嬉野市を拠点に活動する劇団。代表のいけうちしんが主宰し、演劇ユニット「トン・コヅーク」も立ち上げ小城市ゆめぷらっとなどで公演を展開。',
    prefecture: '佐賀県',
    region: 'KYUSHU_OKINAWA',
  },

  // ============================================================
  // 鹿児島県 (KYUSHU_OKINAWA) - 4団体
  // ============================================================
  {
    name: '劇団鳴かず飛ばず',
    slug: 'gekidan-nakatobi',
    groupType: 'AMATEUR',
    description: '2006年5月旗揚げの鹿児島の社会人劇団。「鹿児島に演劇文化を広め、郷土に演劇を楽しんでもらいたい」を理念に、舞台芝居とコントライブを上演。',
    foundedYear: 2006,
    prefecture: '鹿児島県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://nakatoba.net/',
    twitter: 'naka_toba',
  },
  {
    name: '演劇集団宇宙水槽',
    slug: 'engeki-shudan-cosmorium',
    groupType: 'AMATEUR',
    description: '2012年に鹿児島で結成。SFやファンタジーなど不思議な世界を描く。鹿児島市春の新人賞受賞。',
    foundedYear: 2012,
    prefecture: '鹿児島県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://cosmorium.jimdofree.com/',
    twitter: 'cosmorium1',
  },
  {
    name: '劇団LOKE',
    slug: 'gekidan-loke',
    groupType: 'PROFESSIONAL',
    description: '2001年結成、鹿児島市拠点。県内外でのイベント出演・自主公演・小中学校の芸術鑑賞会で上演。文化庁や県・市の文化事業で演劇講座の講師も務める。',
    foundedYear: 2001,
    prefecture: '鹿児島県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://gekidanloke2017.jimdofree.com/',
  },
  {
    name: '劇団上町クローズライン',
    slug: 'gekidan-kamimachi-clothesline',
    groupType: 'AMATEUR',
    description: '2007年結成の鹿児島の劇団。つかこうへい作品や鹿児島の隠れた英雄を描くオリジナル時代劇を中心に上演。役者と観客が一体化する劇空間を目指す。',
    foundedYear: 2007,
    prefecture: '鹿児島県',
    region: 'KYUSHU_OKINAWA',
    twitter: 'canmachi',
  },

  // ============================================================
  // 宮崎県 (KYUSHU_OKINAWA) - 2団体
  // ============================================================
  {
    name: '劇団SPC',
    slug: 'gekidan-spc',
    groupType: 'AMATEUR',
    description: '1982年に宮崎南高校メンバーが創立。三代目代表の海老原達郎が率い、2008年以降は宮崎を題材としたオリジナル作品の制作に注力。40年以上続く老舗劇団。',
    foundedYear: 1982,
    prefecture: '宮崎県',
    region: 'KYUSHU_OKINAWA',
    twitter: 'gekidanspc',
  },
  {
    name: '市民劇団25馬力',
    slug: 'shimin-gekidan-25bariki',
    groupType: 'AMATEUR',
    description: '宮崎県小林市を拠点に活動する市民劇団。旧小林市青年団の演劇活動を引き継ぎ、2001年に旗揚げ公演を開催。',
    foundedYear: 2001,
    prefecture: '宮崎県',
    region: 'KYUSHU_OKINAWA',
  },

  // ============================================================
  // 山形県 (TOHOKU) - 追加1団体（劇団山形は既存）
  // ============================================================
  {
    name: '芝居一座・風',
    slug: 'shibai-ichiza-kaze',
    groupType: 'AMATEUR',
    description: '平成元年（1989年）に旗揚げ。山形市を拠点に「楽しくなければ芝居じゃない」をモットーに年1回公演を上演する社会人劇団。',
    foundedYear: 1989,
    prefecture: '山形県',
    region: 'TOHOKU',
    website: 'https://r.goope.jp/gekidankaze/',
  },

  // ============================================================
  // 新潟県 (CHUBU) - 追加1団体（カタコンベは既存）
  // ============================================================
  {
    name: '劇団wOmb',
    slug: 'gekidan-womb',
    groupType: 'AMATEUR',
    description: '新潟県胎内市・新発田市・村上市・関川村周辺で活動する小劇場演劇団体。性別・経験を問わずメンバーを受け入れ、週末を中心に稽古を行う。',
    prefecture: '新潟県',
    region: 'CHUBU',
  },

  // ============================================================
  // 和歌山県 (KANSAI) - 追加1団体（演劇集団和歌山は既存）
  // ============================================================
  {
    name: '劇団紀州',
    slug: 'gekidan-kishu',
    groupType: 'AMATEUR',
    description: '2003年に芸道場として立ち上げられた和歌山の劇団。人情喜劇や時代劇を中心に、近年は現代劇やサスペンスも披露。',
    foundedYear: 2003,
    prefecture: '和歌山県',
    region: 'KANSAI',
  },

  // ============================================================
  // 鳥取県 (CHUGOKU_SHIKOKU) - 追加1団体（鳥の劇場は既存）
  // ============================================================
  {
    name: 'ミュージカル劇団ゆめ',
    slug: 'musical-gekidan-yume',
    groupType: 'AMATEUR',
    description: '鳥取県米子市を拠点に活動するミュージカル劇団。淀江公民館を練習場とし、年1回の公演のほか各種文化祭・音楽祭にも出演。韓国公演の実績もある。',
    prefecture: '鳥取県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://musicalyume.jimdofree.com/',
  },

  // ============================================================
  // 島根県 (CHUGOKU_SHIKOKU) - 追加1団体（Yプロジェクトは既存）
  // ============================================================
  {
    name: '劇団あしぶえ',
    slug: 'gekidan-ashibue',
    groupType: 'AMATEUR',
    description: '1966年に「松江演劇同好グループ」として結成。宍道湖の葦笛に由来する劇団名。しいの実シアターを活動拠点にNPO法人として運営。サントリー地域文化賞受賞。',
    foundedYear: 1966,
    prefecture: '島根県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://www.ashibue.jp/',
  },
];

// ========== メイン処理 ==========

async function main() {
  console.log('=== 小劇場劇団拡充シード開始 ===\n');
  console.log(`投入対象: ${expansionGroups.length}団体\n`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const group of expansionGroups) {
    try {
      const existing = await prisma.theaterGroup.findUnique({ where: { slug: group.slug } });

      if (existing) {
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
  if (errors > 0) console.log(`  エラー: ${errors}件`);

  // 結果サマリ
  const totalCount = await prisma.theaterGroup.count();
  const byRegion = await prisma.theaterGroup.groupBy({
    by: ['region'],
    _count: true,
    orderBy: { _count: { region: 'desc' } },
  });
  const byPrefecture = await prisma.theaterGroup.groupBy({
    by: ['prefecture'],
    _count: true,
    orderBy: { _count: { prefecture: 'desc' } },
  });

  console.log(`\n=== DB全体のサマリ ===`);
  console.log(`  劇団総数: ${totalCount}団体`);
  console.log(`\n  地域別:`);
  for (const r of byRegion) {
    console.log(`    ${r.region}: ${r._count}団体`);
  }
  console.log(`\n  都道府県別:`);
  for (const p of byPrefecture) {
    console.log(`    ${p.prefecture}: ${p._count}団体`);
  }

  // 空白県チェック
  const targetPrefectures = [
    '神奈川県', '千葉県', '埼玉県', '栃木県', '群馬県', '茨城県',
    '富山県', '福井県', '山梨県', '長野県',
    '滋賀県', '奈良県', '徳島県', '愛媛県', '香川県', '高知県',
    '佐賀県', '鹿児島県', '宮崎県',
  ];
  const prefCounts = new Map(byPrefecture.map(p => [p.prefecture, p._count]));
  const stillEmpty = targetPrefectures.filter(p => !prefCounts.has(p) || prefCounts.get(p) === 0);
  if (stillEmpty.length > 0) {
    console.log(`\n  ⚠ まだ0団体の対象県: ${stillEmpty.join(', ')}`);
  } else {
    console.log(`\n  ✓ 全対象県にデータ投入完了`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
