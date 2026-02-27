/**
 * 小劇場劇団拡充シードスクリプト 第3弾
 * 低カバー県を中心にさらなる全国データ拡充
 *
 * 対象: 青森・秋田・山形・福島・岩手・宮城（東北）
 *       三重・岐阜・石川・静岡・新潟（中部）
 *       奈良・和歌山・滋賀・兵庫（関西）
 *       岡山・広島・山口・鳥取・島根・徳島・愛媛・香川（中国四国）
 *       長崎・大分・熊本・佐賀・宮崎・沖縄（九州沖縄）
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-shogekijo-expansion2.ts
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

const expansion2Groups: ShogekijoData[] = [
  // ============================================================
  // 青森県 (TOHOKU) - 3団体
  // ============================================================
  {
    name: '渡辺源四郎商店',
    slug: 'nabegen',
    groupType: 'PROFESSIONAL',
    description: '劇作家・畑澤聖悟を「店主」とする劇団。2005年プロデュース公演開始、2008年劇団化。CoRich舞台芸術まつり春グランプリ受賞。青森市しんまち本店を拠点に全国へ良質な作品を発信。',
    foundedYear: 2005,
    prefecture: '青森県',
    region: 'TOHOKU',
    website: 'https://www.nabegen.com/',
    twitter: 'nabegenhonten',
    corich: 'https://stage.corich.jp/troupe/253',
  },
  {
    name: '演劇ユニット 一揆の星',
    slug: 'ikki-no-hoshi',
    groupType: 'AMATEUR',
    description: '2022年結成、弘前市拠点。「地域でつくる、地域と作る、地域を創る」を合言葉に津軽の今を生きる人々を描く地域演劇を創作・上演。',
    foundedYear: 2022,
    prefecture: '青森県',
    region: 'TOHOKU',
    website: 'https://theaterikkistar.wixsite.com/2022',
    twitter: 'ikki_star',
  },
  {
    name: '劇団弘演',
    slug: 'gekidan-hiroen',
    groupType: 'AMATEUR',
    description: '1963年創立。「働きながら、働くもののために、地域に根ざした演劇活動を」をモットーに弘前市で60年以上活動を続ける老舗劇団。',
    foundedYear: 1963,
    prefecture: '青森県',
    region: 'TOHOKU',
    corich: 'https://stage.corich.jp/troupe/2937',
  },

  // ============================================================
  // 秋田県 (TOHOKU) - 3団体
  // ============================================================
  {
    name: '劇団ウィルパワー',
    slug: 'gekidan-willpower',
    groupType: 'AMATEUR',
    description: '1995年設立、秋田市拠点。代表・加賀屋のオリジナル作品を社会人・学生が上演する市民劇団。2024年第22回公演をあきた芸術劇場ミルハスで上演。',
    foundedYear: 1995,
    prefecture: '秋田県',
    region: 'TOHOKU',
    website: 'https://willpower-1.jimdosite.com/',
    twitter: 'willpower_akita',
  },
  {
    name: '劇団ほじなし',
    slug: 'gekidan-hojinashi',
    groupType: 'AMATEUR',
    description: '秋田県横手市を拠点に活動する劇団。10代から50代まで幅広い年代のメンバーが在籍。横手かまくらFMで毎月演劇ラジオ番組を放送中。',
    prefecture: '秋田県',
    region: 'TOHOKU',
    website: 'https://hojinasi.wixsite.com/hozzy-and-nancy',
    twitter: 'gekihoji',
  },
  {
    name: '大館市民劇場',
    slug: 'odate-shimin-gekijo',
    groupType: 'AMATEUR',
    description: '1988年に大館市内の劇団が合同して旗揚げ。自主公演を中心に演劇創造活動を行う市民劇団。秋田県演劇団体連盟加盟。',
    foundedYear: 1988,
    prefecture: '秋田県',
    region: 'TOHOKU',
  },

  // ============================================================
  // 山形県 (TOHOKU) - 3団体
  // ============================================================
  {
    name: '劇団のら',
    slug: 'gekidan-nora-yamagata',
    groupType: 'AMATEUR',
    description: '2010年結成、山形市拠点。「山形で最もエネルギッシュな若手劇団」を標榜し、オリジナル長編・コントオムニバスなどジャンルにこだわらない多彩な活動を展開。',
    foundedYear: 2010,
    prefecture: '山形県',
    region: 'TOHOKU',
    website: 'http://gekidannora.web.fc2.com/',
    corich: 'https://stage.corich.jp/troupe/10336',
  },
  {
    name: '劇団MOYU',
    slug: 'gekidan-moyu',
    groupType: 'PROFESSIONAL',
    description: '2016年設立。鈴木啓史考案のメソッド「状態」を軸に芸術活動を行う集団。山形県を拠点に舞台芸術祭「すぶたい」を主催。',
    foundedYear: 2016,
    prefecture: '山形県',
    region: 'TOHOKU',
    twitter: 'GekidanMOYU',
    corich: 'https://stage.corich.jp/troupe/19212',
  },
  {
    name: '劇団OneLife',
    slug: 'gekidan-onelife',
    groupType: 'AMATEUR',
    description: '2005年設立。山形県酒田市を拠点に活動するアマチュア演劇集団。中学生から50代まで幅広い年齢層のメンバーが在籍。',
    foundedYear: 2005,
    prefecture: '山形県',
    region: 'TOHOKU',
    website: 'https://gekidanonelive.wixsite.com/home',
  },

  // ============================================================
  // 福島県 (TOHOKU) - 3団体
  // ============================================================
  {
    name: '劇団カスカ・ダール',
    slug: 'gekidan-casca-dart',
    groupType: 'AMATEUR',
    description: '2016年設立の福島市の市民劇団。10代から70代まで幅広い年齢層のメンバーが在籍。定期公演のほかTV CM出演や演劇ワークショップも実施。',
    foundedYear: 2016,
    prefecture: '福島県',
    region: 'TOHOKU',
    website: 'https://duckyabukuma.wixsite.com/cascadarthome',
  },
  {
    name: '劇団ぴーひゃらら',
    slug: 'gekidan-peahyalala',
    groupType: 'AMATEUR',
    description: '1989年に会津若松市で旗揚げ。学生から年配まで老若男女が仕事や勉強をしながら稽古に参加し、年1回の定期公演を継続。',
    foundedYear: 1989,
    prefecture: '福島県',
    region: 'TOHOKU',
    corich: 'https://peahyalala.stage.corich.jp/',
  },
  {
    name: '演劇集団黒ヒゲキャラバン',
    slug: 'kurohige-caravan',
    groupType: 'AMATEUR',
    description: 'いわき市を拠点に活動する演劇集団。毎週火・木の19時～22時に稽古を行い、いわき市内の公共施設で定期的に公演を実施。',
    prefecture: '福島県',
    region: 'TOHOKU',
  },

  // ============================================================
  // 岩手県 (TOHOKU) - 2団体
  // ============================================================
  {
    name: 'トラブルカフェシアター',
    slug: 'trouble-cafe-theater',
    groupType: 'AMATEUR',
    description: '2000年結成、盛岡市拠点。「ふらっと観に来られる芝居」をコンセプトにエンターテイメント性の高い作品を上演。盛岡市民演劇賞大賞を複数回受賞。',
    foundedYear: 2000,
    prefecture: '岩手県',
    region: 'TOHOKU',
    twitter: 'tcafetheater',
    corich: 'https://stage.corich.jp/troupe/2761',
  },
  {
    name: '劇団・風紀委員会',
    slug: 'gekidan-fuki-iinkai',
    groupType: 'AMATEUR',
    description: '1991年旗揚げ、盛岡市拠点。岩手大学演劇サークル出身者により結成。盛岡芸術協会加盟の演劇団体として盛岡劇場等で公演活動を行う。',
    foundedYear: 1991,
    prefecture: '岩手県',
    region: 'TOHOKU',
    website: 'https://fuki-geki.com/',
  },

  // ============================================================
  // 宮城県 (TOHOKU) - 2団体
  // ============================================================
  {
    name: '劇団麦',
    slug: 'gekidan-mugi',
    groupType: 'AMATEUR',
    description: '1964年「劇研麦」として創立。仙台市太白区を拠点に60年以上活動を続ける老舗市民劇団。「わかりやすい芝居」をモットーに100回超の公演実績。',
    foundedYear: 1964,
    prefecture: '宮城県',
    region: 'TOHOKU',
    website: 'http://mugi1964.net/',
    twitter: 'GekidanMugi',
    corich: 'https://stage.corich.jp/troupe/2302',
  },
  {
    name: 'コマイぬ',
    slug: 'comainu',
    groupType: 'PROFESSIONAL',
    description: '2013年設立。芝原弘主宰の演劇ユニット。石巻市と仙台市を拠点に読み芝居や本公演を実施。東日本大震災にまつわる怪談の語りなど地域に根差した演劇活動を展開。',
    foundedYear: 2013,
    prefecture: '宮城県',
    region: 'TOHOKU',
    website: 'https://www.comainu.com/',
  },

  // ============================================================
  // 三重県 (CHUBU) - 7団体
  // ============================================================
  {
    name: '第七劇場',
    slug: 'dainanagekijo',
    groupType: 'PROFESSIONAL',
    description: '1999年に演出家・鳴海康平を中心に設立。2014年に東京から三重県津市美里町へ拠点を移転。古典戯曲を中心に国内25都市・海外5ヶ国11都市で公演実績。',
    foundedYear: 1999,
    prefecture: '三重県',
    region: 'CHUBU',
    website: 'https://dainanagekijo.tumblr.com/',
    twitter: 'Dainanagekijo',
    corich: 'https://stage.corich.jp/troupe/65',
  },
  {
    name: '演劇集団 青の会',
    slug: 'engeki-shudan-aonokai',
    groupType: 'PROFESSIONAL',
    description: '2019年設立。三重県鈴鹿市を拠点に俳優養成と舞台公演を行う新劇劇団。三重県警察の特殊詐欺被害防止寸劇75公演を務めるなど地域貢献にも注力。',
    foundedYear: 2019,
    prefecture: '三重県',
    region: 'CHUBU',
    website: 'https://aonokai01.amebaownd.com/',
    twitter: 'aonokai_jp',
    instagram: 'ao_no_kai',
  },
  {
    name: '演劇集団Cブレンド',
    slug: 'engeki-shudan-c-blend',
    groupType: 'AMATEUR',
    description: '三重県桑名市を中心に北勢地区で活動する演劇グループ。年1〜2回の演劇公演のほか映像制作やイベント企画も実施。桑名市文化協会所属。',
    prefecture: '三重県',
    region: 'CHUBU',
    website: 'http://c-blend.net/',
  },
  {
    name: '劇団伊勢',
    slug: 'gekidan-ise',
    groupType: 'AMATEUR',
    description: '三重県伊勢市で活動する老舗劇団。2024年に第80回公演を迎えるなど長い歴史を持つ。「劇場で観るのが一番」をモットーに実演を重視した活動を継続。',
    prefecture: '三重県',
    region: 'CHUBU',
    website: 'http://gekidan-ise.com/',
  },
  {
    name: '劇団津演',
    slug: 'gekidan-tsuen',
    groupType: 'AMATEUR',
    description: '三重県津市を拠点に活動する市民劇団。シェイクスピア作品など幅広い演目を上演し、地域に根差した演劇活動を展開。',
    prefecture: '三重県',
    region: 'CHUBU',
    website: 'https://gekidantsuen.wordpress.com/',
  },
  {
    name: '劇団花さつき',
    slug: 'gekidan-hanasatsuki',
    groupType: 'AMATEUR',
    description: '三重県鈴鹿市で活動する市民劇団。地域に密着した演劇活動を展開し、三重の舞台芸術シーンを支える。',
    prefecture: '三重県',
    region: 'CHUBU',
  },
  {
    name: '劇団松阪ドラマシティー',
    slug: 'gekidan-matsusaka-drama-city',
    groupType: 'AMATEUR',
    description: '三重県松阪市で活動する劇団。地域に根ざした演劇公演を定期的に開催。',
    prefecture: '三重県',
    region: 'CHUBU',
  },

  // ============================================================
  // 岐阜県 (CHUBU) - 3団体
  // ============================================================
  {
    name: '劇団芝居屋かいとうらんま',
    slug: 'kaitou-ranma',
    groupType: 'AMATEUR',
    description: '1983年に岐阜西濃地区の高校演劇部OBを中心に旗揚げ。大垣市・岐阜市を拠点にオリジナル脚本でシリアスからコメディ、ミュージカルまで幅広く上演。',
    foundedYear: 1983,
    prefecture: '岐阜県',
    region: 'CHUBU',
    website: 'https://kaitouranma.net/official/',
    twitter: 'kaitouramma',
    instagram: 'kaitou_ramma',
    corich: 'https://stage.corich.jp/troupe/6564',
  },
  {
    name: '劇団ゼロ',
    slug: 'gekidan-zero-gifu',
    groupType: 'AMATEUR',
    description: '1977年に岐阜市で結成。イギリス・フランス・アメリカの翻訳戯曲を中心にクリスティやトマの推理劇などを上演。2024年に第82回公演を達成。',
    foundedYear: 1977,
    prefecture: '岐阜県',
    region: 'CHUBU',
    website: 'http://www.gekidan-zero.com/',
  },
  {
    name: '劇団彗',
    slug: 'gekidan-sui',
    groupType: 'AMATEUR',
    description: '1999年に岐阜県演劇協会プロデュース「劇団よせなべII」から独立して結成。岐阜市内の小劇場で定期公演や演劇祭に参加。10代から70代まで幅広い世代が在籍。',
    foundedYear: 1999,
    prefecture: '岐阜県',
    region: 'CHUBU',
    website: 'https://gekidansui.wordpress.com/',
  },

  // ============================================================
  // 石川県 (CHUBU) - 2団体
  // ============================================================
  {
    name: '劇団nono',
    slug: 'gekidan-nono',
    groupType: 'AMATEUR',
    description: '石川県野々市市の市民劇団。にぎわいの里ののいちカミーノを練習拠点に活動。子どもから大人まで楽しめる公演を上演。',
    prefecture: '石川県',
    region: 'CHUBU',
    website: 'http://gekidan.nono1.jp/',
  },
  {
    name: '劇団N',
    slug: 'gekidan-n-nanao',
    groupType: 'AMATEUR',
    description: '1998年の旧中島町演劇教室をきっかけに設立された七尾市民劇団。能登演劇堂を活動拠点にオリジナル作品を毎年上演。「N」は能登・七尾・中島の頭文字。',
    foundedYear: 1998,
    prefecture: '石川県',
    region: 'CHUBU',
    website: 'https://gekidann.com/',
  },

  // ============================================================
  // 静岡県 (CHUBU) - 2団体
  // ============================================================
  {
    name: '演劇ユニット FOX WORKS',
    slug: 'fox-works',
    groupType: 'AMATEUR',
    description: '浜松市を拠点に活動する演劇ユニット。コメディからシリアスまで幅広い作品を制作。2017年にアトリエ「スケッチブックシアター」を開設。',
    prefecture: '静岡県',
    region: 'CHUBU',
    website: 'https://fox-works.webnode.jp/',
    twitter: 'WorksFox',
    corich: 'https://stage.corich.jp/troupe/15957',
  },
  {
    name: '劇団静岡県史',
    slug: 'gekidan-shizuoka-kenshi',
    groupType: 'AMATEUR',
    description: '2013年にSPAC企画で県民劇団として設立。静岡県の歴史を舞台化することを目的に活動。菊川市を拠点に県内各地や海外でも公演を実施。',
    foundedYear: 2013,
    prefecture: '静岡県',
    region: 'CHUBU',
    website: 'https://kenshi.cava.jp/',
    twitter: 'kenshi130413',
  },

  // ============================================================
  // 新潟県 (CHUBU) - 3団体
  // ============================================================
  {
    name: '劇団ハンニャーズ',
    slug: 'gekidan-hannyaazu',
    groupType: 'AMATEUR',
    description: '1995年結成（旧名：劇団一発屋、2006年改名）。新潟市南区拠点。主宰・中嶋かねまさのオリジナル作品を上演。2015年シネ・ウインド演劇賞大賞受賞。',
    foundedYear: 1995,
    prefecture: '新潟県',
    region: 'CHUBU',
    website: 'https://hannya-s.wixsite.com/828s',
    twitter: '0828s',
    corich: 'https://stage.corich.jp/troupe/1574',
  },
  {
    name: '劇団そらもよう',
    slug: 'gekidan-soramoyou',
    groupType: 'AMATEUR',
    description: '新潟市をメインに活動する演劇団体。「最後には空を見上げるように前向きで笑顔になるような芝居を作りたい」という思いで命名。',
    prefecture: '新潟県',
    region: 'CHUBU',
    twitter: 'gkdn_soramoyou',
    corich: 'https://stage.corich.jp/troupe/70444',
  },
  {
    name: '劇団ポイニクス',
    slug: 'gekidan-poinix',
    groupType: 'AMATEUR',
    description: '2023年4月設立。新潟県長岡市を拠点に「長岡の演劇を盛り上げたい」という志で活動する若手劇団。',
    foundedYear: 2023,
    prefecture: '新潟県',
    region: 'CHUBU',
    twitter: 'poinix_nagaoka',
    corich: 'https://stage.corich.jp/troupe/63349',
  },

  // ============================================================
  // 奈良県 (KANSAI) - 3団体
  // ============================================================
  {
    name: '劇団チャンサー',
    slug: 'gekidan-chancer',
    groupType: 'AMATEUR',
    description: '2009年設立。「奈良の人にもっと芝居に触れてもらいたい」を理念に活動するアマチュア劇団。第3回奈良LIVE草芝居リーグ優勝。',
    foundedYear: 2009,
    prefecture: '奈良県',
    region: 'KANSAI',
    website: 'http://chancer-nara.com/',
    corich: 'https://stage.corich.jp/troupe/8625',
  },
  {
    name: 'ヒミツミ',
    slug: 'himitsumi',
    groupType: 'AMATEUR',
    description: 'いとうゆうかが主宰する奈良拠点の演劇ユニット。「アナザー・ライフ・アンセム」等のオリジナル作品を小劇場で上演。',
    prefecture: '奈良県',
    region: 'KANSAI',
  },
  {
    name: '演劇ユニットH2S',
    slug: 'engeki-unit-h2s',
    groupType: 'AMATEUR',
    description: '奈良・関西圏で活動する演劇ユニット。小劇場での実験的な作品づくりに取り組み、近畿圏の演劇シーンで存在感を示す。',
    prefecture: '奈良県',
    region: 'KANSAI',
  },

  // ============================================================
  // 和歌山県 (KANSAI) - 3団体
  // ============================================================
  {
    name: '劇団ZERO',
    slug: 'gekidan-zero-wakayama',
    groupType: 'AMATEUR',
    description: '1989年に島田忠を中心に結成。音楽・ダンス・派手な衣装による斬新な舞台が特徴。小学校での演劇ワークショップや子供向け公演も実施。',
    foundedYear: 1989,
    prefecture: '和歌山県',
    region: 'KANSAI',
    website: 'https://gekidan-zero.jimdofree.com/',
  },
  {
    name: '渚会',
    slug: 'nagisa-kai-wakayama',
    groupType: 'AMATEUR',
    description: '2021年に劇団ZERO団員の石村渚が設立した新感覚朗読劇団。和歌山城ホール等で「きのくに夢物語」シリーズを上演。',
    foundedYear: 2021,
    prefecture: '和歌山県',
    region: 'KANSAI',
  },
  {
    name: '劇団宇宙の森',
    slug: 'gekidan-uchu-no-mori',
    groupType: 'AMATEUR',
    description: '和歌山を拠点に活動する劇団。地域密着型の演劇活動を通じて、人と人とのつながりを大切にした舞台を制作。',
    prefecture: '和歌山県',
    region: 'KANSAI',
    website: 'https://uchu-no-mori.com/',
  },

  // ============================================================
  // 滋賀県 (KANSAI) - 2団体
  // ============================================================
  {
    name: '演劇集団ビワコボスゴリラ',
    slug: 'biwako-boss-gorilla',
    groupType: 'AMATEUR',
    description: '滋賀県を拠点に高校演劇部OBメンバーで結成。「力強くも繊細な」演劇を目指し、近江演劇祭に参加。',
    prefecture: '滋賀県',
    region: 'KANSAI',
  },
  {
    name: '冷夢睡眠',
    slug: 'reiyumu-suimin',
    groupType: 'AMATEUR',
    description: '滋賀県を拠点に活動。高校演劇部の元メンバーが再集結し、「変わったものと変わらないもの」を大切にする創作活動を展開。',
    prefecture: '滋賀県',
    region: 'KANSAI',
  },

  // ============================================================
  // 兵庫県 (KANSAI) - 3団体
  // ============================================================
  {
    name: '劇団自由人会',
    slug: 'gekidan-jiyujinkai',
    groupType: 'PROFESSIONAL',
    description: '1994年設立。神戸市垂水区を拠点に年2回以上公演。「神戸曼荼羅」等のオリジナル作品で地域に根ざした演劇を展開。',
    foundedYear: 1994,
    prefecture: '兵庫県',
    region: 'KANSAI',
    website: 'http://jiyuujinkai.jp/',
    twitter: 'jiyuujinkai',
    corich: 'https://stage.corich.jp/troupe/7699',
  },
  {
    name: 'いるかHotel',
    slug: 'iruka-hotel',
    groupType: 'PROFESSIONAL',
    description: '1998年、阪神淡路大震災後に西宮市で設立。谷省吾が主宰。生きた関西弁の丁寧な台詞と繊細な演出で人間の強さ・弱さを描く。',
    foundedYear: 1998,
    prefecture: '兵庫県',
    region: 'KANSAI',
  },
  {
    name: '劇団風斜',
    slug: 'gekidan-fusha-kobe',
    groupType: 'AMATEUR',
    description: '神戸を拠点に長年活動を続ける小劇場劇団。兵庫県劇団協議会加盟。ハーバーランド近辺で週3〜4日稽古を行う。',
    prefecture: '兵庫県',
    region: 'KANSAI',
    website: 'https://gekidan-fusha.jimdofree.com/',
  },

  // ============================================================
  // 岡山県 (CHUGOKU_SHIKOKU) - 3団体
  // ============================================================
  {
    name: 'イロトリドリ',
    slug: 'irotridri-okayama',
    groupType: 'AMATEUR',
    description: '2024年1月結成。EN劇集団さんたばっぐ出身の精鋭が集結し、岡山でハイスピードファンタジーの演劇を届ける劇団。',
    foundedYear: 2024,
    prefecture: '岡山県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://www.irotridri.com/',
  },
  {
    name: '劇団夢幻月',
    slug: 'gekidan-mugenzuki',
    groupType: 'AMATEUR',
    description: '岡山を拠点とする劇術工房。天神山文化プラザ土曜劇場やファミリー劇場で公演を実施。独自の世界観を持つ舞台が特徴。',
    prefecture: '岡山県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://www7b.biglobe.ne.jp/~mooncat/',
    twitter: 'mugenzuki',
  },
  {
    name: '劇団ドレス',
    slug: 'gekidan-dress-okayama',
    groupType: 'AMATEUR',
    description: '岡山市を拠点に活動する喜劇・コメディ劇団。笑いを通じて地域の演劇文化を盛り上げる。',
    prefecture: '岡山県',
    region: 'CHUGOKU_SHIKOKU',
  },

  // ============================================================
  // 広島県 (CHUGOKU_SHIKOKU) - 4団体
  // ============================================================
  {
    name: 'メガジョッキ',
    slug: 'megajyokki',
    groupType: 'PROFESSIONAL',
    description: '2017年に竹野弘識が旗揚げした演劇プロデュースユニット。広島の山小屋シアターを拠点に県内外で活動。',
    foundedYear: 2017,
    prefecture: '広島県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://sites.google.com/view/megazyokki',
    twitter: 'mega_zyokki',
    corich: 'https://stage.corich.jp/troupe/22760',
  },
  {
    name: '劇団おぐら座',
    slug: 'gekidan-oguraza',
    groupType: 'AMATEUR',
    description: '広島を拠点に時代物の芝居・殺陣を中心に活動。ショー要素も取り入れたエンターテイメント性の高い舞台を上演。',
    prefecture: '広島県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://g-oguraza.amebaownd.com/',
    twitter: 'G_oguraza',
    corich: 'https://stage.corich.jp/troupe/20091',
  },
  {
    name: '劇団EEJAN-Pekapeka',
    slug: 'eejan-pekapeka',
    groupType: 'AMATEUR',
    description: '福山市水呑交流館を拠点に毎週水曜日に活動。福山の演劇シーンを支える地域密着型の劇団。',
    prefecture: '広島県',
    region: 'CHUGOKU_SHIKOKU',
  },
  {
    name: '劇団M（ねこMiMi）',
    slug: 'gekidan-m-nekomimi',
    groupType: 'AMATEUR',
    description: '福山市を拠点に毎週月・火の19時〜22時に公民館で稽古を行う劇団。地域に密着した演劇活動を継続的に展開。',
    prefecture: '広島県',
    region: 'CHUGOKU_SHIKOKU',
  },

  // ============================================================
  // 山口県 (CHUGOKU_SHIKOKU) - 3団体
  // ============================================================
  {
    name: '劇団ジャンク派',
    slug: 'gekidan-junkha',
    groupType: 'AMATEUR',
    description: '2018年4月結成。山口市を拠点に芝居・歌・ダンスを盛り込んだショースタイルの舞台を展開。生演奏と詩の朗読にこだわる。',
    foundedYear: 2018,
    prefecture: '山口県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://junk-ha.stage.corich.jp/',
    twitter: 'junk_ha',
    corich: 'https://stage.corich.jp/troupe/17347',
  },
  {
    name: 'チーム☆無所族',
    slug: 'team-mushozoku',
    groupType: 'AMATEUR',
    description: '山口県宇部市を中心に活動する演劇パフォーマンスユニット。演劇に加え朗読・イベント司会・ワークショップ等で地域を盛り上げる。',
    prefecture: '山口県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://t-musyozoku.main.jp/',
  },
  {
    name: '劇人motoProduction',
    slug: 'gekijin-moto-production',
    groupType: 'AMATEUR',
    description: '山口県で活動する演劇プロデュース団体。地域の劇場やイベントスペースで定期的に公演を実施し、山口の演劇文化を発信。',
    prefecture: '山口県',
    region: 'CHUGOKU_SHIKOKU',
  },

  // ============================================================
  // 鳥取県 (CHUGOKU_SHIKOKU) - 2団体
  // ============================================================
  {
    name: '劇団そらのゆめ',
    slug: 'gekidan-soranoyume-tottori',
    groupType: 'PROFESSIONAL',
    description: '演劇表現を用いて社会のあらゆる人が豊かに生きる力を育むことに貢献する団体。全国で上演活動を展開。',
    prefecture: '鳥取県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'http://soranoyume.com/',
  },
  {
    name: '演劇サークルSORA',
    slug: 'engeki-sora-tottori',
    groupType: 'AMATEUR',
    description: '鳥取を拠点に活動する演劇サークル。地域住民が気軽に演劇に参加できる場を提供し、鳥取の演劇文化の裾野を広げる。',
    prefecture: '鳥取県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://circlesora.jimdofree.com/',
  },

  // ============================================================
  // 島根県 (CHUGOKU_SHIKOKU) - 2団体
  // ============================================================
  {
    name: '劇団8ch',
    slug: 'gekidan-8ch',
    groupType: 'AMATEUR',
    description: '2017年5月結成。島根県大田市を拠点に活動。しまね演劇コンクール演出賞受賞。舞台だけでなくCM等映像作品にも出演・制作。',
    foundedYear: 2017,
    prefecture: '島根県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://gekidan8ch.wixsite.com/gekidan-enm',
  },
  {
    name: 'シンゲキ',
    slug: 'shingeki-shimane',
    groupType: 'AMATEUR',
    description: '島根を拠点とした演劇団体。定期的に公演活動を実施し、島根の演劇シーンに貢献。',
    prefecture: '島根県',
    region: 'CHUGOKU_SHIKOKU',
  },

  // ============================================================
  // 徳島県 (CHUGOKU_SHIKOKU) - 3団体
  // ============================================================
  {
    name: '演劇ユニット・コメット',
    slug: 'engeki-unit-comet',
    groupType: 'AMATEUR',
    description: '徳島県文化の森総合公園21世紀館を拠点に活動。2025年3月に第一回公演「棒になった男」を上演した新進演劇ユニット。',
    prefecture: '徳島県',
    region: 'CHUGOKU_SHIKOKU',
  },
  {
    name: '劇塾マデーラ',
    slug: 'gekijuku-madeira',
    groupType: 'AMATEUR',
    description: '徳島で活動する演劇塾・劇団。文化の森演劇フェスティバルに参加するなど地域の演劇シーンの一翼を担う。',
    prefecture: '徳島県',
    region: 'CHUGOKU_SHIKOKU',
  },
  {
    name: 'はこうまプロジェクト',
    slug: 'hakouma-project',
    groupType: 'AMATEUR',
    description: '徳島を拠点に活動する演劇プロジェクト。文化の森演劇フェスティバル等で公演を行い、地域の演劇文化を支える。',
    prefecture: '徳島県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'https://hakouma.ashnt.net/',
  },

  // ============================================================
  // 愛媛県 (CHUGOKU_SHIKOKU) - 2団体
  // ============================================================
  {
    name: 'パフォーマンスカンパニーリトルウイング',
    slug: 'little-wing-ehime',
    groupType: 'AMATEUR',
    description: '愛媛・四国を拠点に活動するパフォーマンスカンパニー。演劇を軸にした多彩なパフォーマンスを展開。',
    prefecture: '愛媛県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'http://littlewings1990.com/',
  },
  {
    name: '劇団プチミュージカル',
    slug: 'gekidan-petit-musical',
    groupType: 'AMATEUR',
    description: '四国を拠点に活動するミュージカル劇団。地域の舞台芸術の普及と若手人材の育成に取り組む。',
    prefecture: '愛媛県',
    region: 'CHUGOKU_SHIKOKU',
  },

  // ============================================================
  // 香川県 (CHUGOKU_SHIKOKU) - 2団体
  // ============================================================
  {
    name: '劇団R&C',
    slug: 'gekidan-r-and-c',
    groupType: 'AMATEUR',
    description: '1959年にRNC放送劇団として創立、1976年に独立し1993年に改称。ドラマ・ミュージカル・児童劇を上演する老舗劇団。',
    foundedYear: 1959,
    prefecture: '香川県',
    region: 'CHUGOKU_SHIKOKU',
  },
  {
    name: 'シアタービートニクス',
    slug: 'theater-beatniks',
    groupType: 'AMATEUR',
    description: '香川県で活動する劇団。かがわのえんげきネットワークに参加し、地域の演劇シーンの活性化に貢献。',
    prefecture: '香川県',
    region: 'CHUGOKU_SHIKOKU',
    website: 'http://www.t-beatniks.com/',
  },

  // ============================================================
  // 長崎県 (KYUSHU_OKINAWA) - 3団体
  // ============================================================
  {
    name: 'Kimamass',
    slug: 'kimamass-nagasaki',
    groupType: 'AMATEUR',
    description: '2009年長崎市で発足した総合創作団体。演劇を中心に朗読・文芸イベントも展開。九州若手劇団アワード！2023受賞。',
    foundedYear: 2009,
    prefecture: '長崎県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://www.kimamass.com/',
    twitter: 'kimamass',
  },
  {
    name: 'エヌケースリードリームプロ',
    slug: 'nk3-dream-pro',
    groupType: 'PROFESSIONAL',
    description: '長崎県を拠点に演劇製作・えんげき教室・市民参加型公演を通じて芸術による街づくりを目指す演劇製作所。',
    prefecture: '長崎県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://nk3-dream-pro.com/',
    instagram: 'art_management_nagasaki',
  },
  {
    name: '劇団ピピン',
    slug: 'gekidan-pipin-nagasaki',
    groupType: 'AMATEUR',
    description: '長崎市内で活動する劇団。ミュージカルや演劇公演のほか、ながさきピース文化祭等の地域文化イベントにも参加。',
    prefecture: '長崎県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://pipinweb.wordpress.com/',
  },

  // ============================================================
  // 大分県 (KYUSHU_OKINAWA) - 3団体
  // ============================================================
  {
    name: '劇団水中花',
    slug: 'gekidan-suichuka',
    groupType: 'AMATEUR',
    description: '2006年に演劇ユニットとして発足、2012年劇団化。大分市を拠点にオリジナル作品を上演。第11回九州戯曲賞受賞。',
    foundedYear: 2012,
    prefecture: '大分県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://gekidansuichuka-web.jimdofree.com/',
    twitter: 'suichuka_ooita',
    instagram: 'gekidan_suichuka_',
  },
  {
    name: '劇団OTC',
    slug: 'gekidan-otc-oita',
    groupType: 'AMATEUR',
    description: '1992年設立の大分市を拠点とする劇団。演劇初心者でも主役になれる環境づくりをモットーに活動。',
    foundedYear: 1992,
    prefecture: '大分県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://sites.google.com/view/gekidan-otc/',
    twitter: 'OTC14',
  },
  {
    name: '劇団不二野座',
    slug: 'gekidan-fujinoza',
    groupType: 'AMATEUR',
    description: '大分市を拠点に活動する劇団。2024年に第27回公演「無人駅～ホームな人々～」を上演するなど継続的に公演を開催。',
    prefecture: '大分県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://fujinoza.hp.peraichi.com/',
  },

  // ============================================================
  // 熊本県 (KYUSHU_OKINAWA) - 3団体
  // ============================================================
  {
    name: 'ゼーロンの会',
    slug: 'zeron-no-kai',
    groupType: 'AMATEUR',
    description: '熊本市を拠点に活動する演劇集団。サラ・ケインやビュヒナー作品など海外戯曲の上演に取り組む。',
    prefecture: '熊本県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://led-ze.com/',
  },
  {
    name: '劇団市民舞台',
    slug: 'gekidan-shimin-butai',
    groupType: 'AMATEUR',
    description: '城下町熊本を拠点に活動する市民劇団。2024年には能登半島地震チャリティ公演を実施。毎年秋に定期公演を開催。',
    prefecture: '熊本県',
    region: 'KYUSHU_OKINAWA',
    website: 'http://shimin-butai.com/',
  },
  {
    name: 'studio in.K.',
    slug: 'studio-ink-kumamoto',
    groupType: 'PROFESSIONAL',
    description: '2015年設立。元劇団四季の小松野希海が主宰する熊本のミュージカル製作スタジオ。演劇・ミュージカル・コンサートを毎月開催。',
    foundedYear: 2015,
    prefecture: '熊本県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://ink.tenkai.org/',
  },

  // ============================================================
  // 佐賀県 (KYUSHU_OKINAWA) - 1団体
  // ============================================================
  {
    name: '劇団芝居屋樂屋',
    slug: 'shibai-ya-gakuya-saga',
    groupType: 'AMATEUR',
    description: '佐賀県内で活動する劇団。地域に根ざした演劇活動を展開。',
    prefecture: '佐賀県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://shibaiyagakuya.jimdosite.com/',
  },

  // ============================================================
  // 宮崎県 (KYUSHU_OKINAWA) - 2団体
  // ============================================================
  {
    name: '劇団ゼロQ',
    slug: 'gekidan-zero-q',
    groupType: 'AMATEUR',
    description: '2008年宮崎県立芸術劇場の演劇人養成講座受講生により結成。宮崎市を拠点に口蹄疫ドキュメンタリーシアター等オリジナル作品を上演。',
    foundedYear: 2008,
    prefecture: '宮崎県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://gekidanzeroq.jimdofree.com/',
    twitter: 'gekidanzeroQ',
    corich: 'https://stage.corich.jp/troupe/4395',
  },
  {
    name: '演劇ユニット チックタックパーク',
    slug: 'tick-tack-park',
    groupType: 'AMATEUR',
    description: '宮崎を中心に活動する演劇ユニット。濱田明良と吉丸裕美の2人で構成。コント形式の見やすい作品づくりを心がけ県内各地で公演。',
    prefecture: '宮崎県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://ticktackpark.wixsite.com/offcial',
    twitter: 'Akira_ticktack',
  },

  // ============================================================
  // 沖縄県 (KYUSHU_OKINAWA) - 3団体
  // ============================================================
  {
    name: 'TEAM SPOT JUMBLE',
    slug: 'team-spot-jumble',
    groupType: 'PROFESSIONAL',
    description: '2006年結成。津波信一率いる沖縄のパフォーマンス集団。演劇にダンス・アクション・コメディを融合したエンターテインメントを創造。',
    foundedYear: 2006,
    prefecture: '沖縄県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://www.spot-jumble.com/',
    instagram: 'teamspotjumble',
  },
  {
    name: 'Theater TEN Company',
    slug: 'theater-ten-company',
    groupType: 'AMATEUR',
    description: '1994年に沖縄国際大学演劇部の創設メンバーで結成。那覇市安里のアトリエを拠点に現代演劇やワークショップ公演を展開。',
    foundedYear: 1994,
    prefecture: '沖縄県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://theater-ten.com/',
    twitter: 'gekidanttc',
    instagram: 'gekidanttc',
  },
  {
    name: '劇団リバースザワールド',
    slug: 'rebirth-the-world',
    groupType: 'AMATEUR',
    description: '西平寿久が座長を務める沖縄の劇団。CM・映画・テレビドラマ・舞台と幅広く活動し、沖縄演劇界で独自の存在感を放つ。',
    prefecture: '沖縄県',
    region: 'KYUSHU_OKINAWA',
    website: 'https://rebirth.engeki.okinawa/',
  },
];

async function main() {
  console.log('=== 小劇場劇団拡充シード第3弾 開始 ===\n');
  console.log(`投入対象: ${expansion2Groups.length}団体\n`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const group of expansion2Groups) {
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

  // 低カバー県チェック
  const allPrefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
  ];
  const prefCounts = new Map(byPrefecture.map(p => [p.prefecture, p._count]));
  const lowCoverage = allPrefectures.filter(p => (prefCounts.get(p) ?? 0) <= 2);
  if (lowCoverage.length > 0) {
    console.log(`\n  ⚠ 2団体以下の県: ${lowCoverage.join(', ')}`);
  } else {
    console.log(`\n  ✓ 全県3団体以上`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
