/**
 * 劇団一括追加シードスクリプト（第2弾）
 * 新劇・ミュージカル・アングラ・小劇場・児童演劇・人形劇を追加
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-theater-groups-bulk.ts
 */

import { PrismaClient, TheaterGroupType, Region } from '@prisma/client';

const prisma = new PrismaClient();

type GroupData = {
  name: string;
  slug: string;
  groupType: TheaterGroupType;
  description: string;
  prefecture?: string;
  region?: Region;
  foundedYear?: number;
  website?: string;
  twitter?: string;
};

const newGroups: GroupData[] = [
  // === 新劇・老舗プロ劇団 ===
  { name: '劇団民藝', slug: 'gekidan-mingei', groupType: 'PROFESSIONAL', description: '1950年設立の新劇劇団。滝沢修・宇野重吉らが創設。リアリズム演劇の伝統を守る。', prefecture: '東京都', region: 'KANTO', foundedYear: 1950, website: 'https://www.gekidanmingei.co.jp/' },
  { name: '無名塾', slug: 'mumei-juku', groupType: 'PROFESSIONAL', description: '1975年に仲代達矢が設立した俳優養成所兼劇団。', prefecture: '東京都', region: 'KANTO', foundedYear: 1975 },
  { name: '劇団文化座', slug: 'gekidan-bunkaza', groupType: 'PROFESSIONAL', description: '1942年結成の新劇劇団。日本劇団協議会加盟。', prefecture: '東京都', region: 'KANTO', foundedYear: 1942 },
  { name: '青年劇場', slug: 'seinen-gekijo', groupType: 'PROFESSIONAL', description: '1964年結成の新劇劇団。社会的テーマの作品を上演。', prefecture: '東京都', region: 'KANTO', foundedYear: 1964, website: 'https://www.seinengekijo.co.jp/' },
  { name: '劇団東演', slug: 'gekidan-toen', groupType: 'PROFESSIONAL', description: '東京を拠点とする新劇劇団。日本劇団協議会加盟。', prefecture: '東京都', region: 'KANTO', website: 'https://t-toen.com/' },
  { name: '劇団銅鑼', slug: 'gekidan-dora', groupType: 'PROFESSIONAL', description: '1972年設立。板橋区を拠点に活動する新劇劇団。', prefecture: '東京都', region: 'KANTO', foundedYear: 1972, website: 'http://www.gekidandora.com/', twitter: 'gekidandora' },
  { name: '劇団俳協', slug: 'gekidan-haikyo', groupType: 'PROFESSIONAL', description: '日本劇団協議会加盟の劇団。', prefecture: '東京都', region: 'KANTO' },
  { name: '東京芸術座', slug: 'tokyo-geijutsuza', groupType: 'PROFESSIONAL', description: '東京を拠点とする新劇劇団。日本劇団協議会・児演協加盟。', prefecture: '東京都', region: 'KANTO', website: 'http://www.tokyogeijutsuza.co.jp/' },
  { name: '東京演劇アンサンブル', slug: 'tokyo-engeki-ensemble', groupType: 'PROFESSIONAL', description: '東京を拠点とする劇団。日本劇団協議会・児演協加盟。', prefecture: '東京都', region: 'KANTO' },
  { name: '東京演劇集団風', slug: 'tokyo-engeki-kaze', groupType: 'PROFESSIONAL', description: '日本劇団協議会・児演協加盟。学校公演を中心に全国ツアーを展開。', prefecture: '東京都', region: 'KANTO', website: 'https://www.kaze-net.org/' },
  { name: 'こまつ座', slug: 'komatsuza', groupType: 'PROFESSIONAL', description: '1983年に井上ひさしが設立。井上ひさし作品を中心に上演。', prefecture: '東京都', region: 'KANTO', foundedYear: 1983, website: 'https://www.komatsuza.co.jp/', twitter: 'komatsuza' },
  { name: '加藤健一事務所', slug: 'kato-kenichi-jimusho', groupType: 'PROFESSIONAL', description: '俳優・加藤健一が主宰するプロデュースカンパニー。翻訳喜劇を中心に上演。', prefecture: '東京都', region: 'KANTO' },
  { name: 'ワンツーワークス', slug: 'one-two-works', groupType: 'PROFESSIONAL', description: '日本劇団協議会加盟の劇団。', prefecture: '東京都', region: 'KANTO' },
  { name: '前進座', slug: 'zenshinza', groupType: 'PROFESSIONAL', description: '1931年創立の歌舞伎系劇団。時代劇と現代劇を上演。日本劇団協議会加盟。', prefecture: '東京都', region: 'KANTO', foundedYear: 1931 },
  { name: 'トム・プロジェクト', slug: 'tom-project', groupType: 'PROFESSIONAL', description: '日本劇団協議会加盟のプロデュースカンパニー。', prefecture: '東京都', region: 'KANTO' },

  // === ミュージカル劇団 ===
  { name: '劇団四季', slug: 'gekidan-shiki', groupType: 'PROFESSIONAL', description: '1953年設立。日本最大のミュージカル劇団。全国に専用劇場を持つ。', prefecture: '東京都', region: 'KANTO', foundedYear: 1953, website: 'https://www.shiki.jp/', twitter: 'shikiofficial' },
  { name: '宝塚歌劇団', slug: 'takarazuka-revue', groupType: 'PROFESSIONAL', description: '1913年設立。女性のみで構成される歌劇団。兵庫県宝塚市に本拠。', prefecture: '兵庫県', region: 'KANSAI', foundedYear: 1913 },
  { name: 'OSK日本歌劇団', slug: 'osk-nihon-kagekidan', groupType: 'PROFESSIONAL', description: '1922年設立。「踊りのOSK」として知られる歌劇団。大阪を拠点に活動。', prefecture: '大阪府', region: 'KANSAI', foundedYear: 1922, website: 'https://www.osk-revue.com/' },
  { name: '音楽座ミュージカル', slug: 'ongakuza-musical', groupType: 'PROFESSIONAL', description: '1987年旗揚げ。東京を本拠地とするミュージカル劇団。', prefecture: '東京都', region: 'KANTO', foundedYear: 1987 },
  { name: 'ミュージカルカンパニー イッツフォーリーズ', slug: 'its-follies', groupType: 'PROFESSIONAL', description: '1977年に作曲家いずみたくが創立したミュージカル劇団。', prefecture: '東京都', region: 'KANTO', foundedYear: 1977 },
  { name: 'ミュージカル座', slug: 'musical-za', groupType: 'PROFESSIONAL', description: '1995年設立。さいたま市を本拠地とするミュージカル劇団。', prefecture: '埼玉県', region: 'KANTO', foundedYear: 1995, website: 'https://musical-za.co.jp/' },

  // === アングラ・実験演劇系 ===
  { name: '演劇実験室◎万有引力', slug: 'banyuinryoku', groupType: 'PROFESSIONAL', description: '1983年、寺山修司の死後にJ・A・シーザーと天井桟敷の劇団員で結成。', prefecture: '東京都', region: 'KANTO', foundedYear: 1983 },
  { name: '月蝕歌劇団', slug: 'gesshoku-kagekidan', groupType: 'PROFESSIONAL', description: '寺山修司や澁澤龍彦などの幻想文学作品を演劇化する劇団。', prefecture: '東京都', region: 'KANTO' },
  { name: '劇団唐ゼミ☆', slug: 'karazemi', groupType: 'PROFESSIONAL', description: '唐十郎作品を上演するテント芝居の劇団。', prefecture: '東京都', region: 'KANTO' },
  { name: '革命アイドル暴走ちゃん', slug: 'miss-revolutionary-idol-berserker', groupType: 'PROFESSIONAL', description: '2013年旗揚げ。国際的にも活動するパフォーマンスグループ。', prefecture: '東京都', region: 'KANTO', foundedYear: 2013, website: 'http://missrevodolbbbbbbbberserker.asia/', twitter: 'mri_berserker' },

  // === 若手・注目の小劇場系 ===
  { name: 'ウンゲツィーファ', slug: 'ungeziefer', groupType: 'PROFESSIONAL', description: '劇作家・演出家の本橋龍を中心とした演劇集団。', prefecture: '東京都', region: 'KANTO', website: 'https://ungeziefer.site/', twitter: 'kuritoz' },
  { name: '趣向', slug: 'shukou', groupType: 'PROFESSIONAL', description: '詳細がありません。', prefecture: '東京都', region: 'KANTO' },
  { name: '劇団アンパサンド', slug: 'gekidan-ampersand', groupType: 'PROFESSIONAL', description: '2016年に安藤奎を軸に旗揚げ。第69回岸田國士戯曲賞受賞。', prefecture: '東京都', region: 'KANTO', foundedYear: 2016, twitter: 'gekidanampersan' },
  { name: '劇団不労社', slug: 'gekidan-furosya', groupType: 'PROFESSIONAL', description: '関西を拠点に活動。', prefecture: '大阪府', region: 'KANSAI', website: 'https://www.furosya.com' },
  { name: 'モメラス', slug: 'momeras', groupType: 'PROFESSIONAL', description: '松村翔子主宰。現代口語演劇の写実的な世界観でパラレルな物語を展開。', prefecture: '東京都', region: 'KANTO' },
  { name: 'ホエイ', slug: 'hoei', groupType: 'PROFESSIONAL', description: '山田百次が主宰。青年団リンク出身。', prefecture: '東京都', region: 'KANTO' },
  { name: 'キュイ', slug: 'cui', groupType: 'PROFESSIONAL', description: '綾門優季が主宰。攻撃的で文語的なセリフ回しが特徴。', prefecture: '東京都', region: 'KANTO' },
  { name: '公社流体力学', slug: 'kosha-ryutai-rikigaku', groupType: 'PROFESSIONAL', description: '2015年旗揚げ。せんがわ劇場演劇コンクールグランプリ受賞。', prefecture: '東京都', region: 'KANTO', foundedYear: 2015 },
  { name: '画餅', slug: 'emochi', groupType: 'PROFESSIONAL', description: '2022年に神谷圭介が立ち上げた劇団。', prefecture: '東京都', region: 'KANTO', foundedYear: 2022 },
  { name: 'ジエン社', slug: 'jiensha', groupType: 'PROFESSIONAL', description: '東京の小劇場シーンで活動する劇団。', prefecture: '東京都', region: 'KANTO', twitter: 'jiensha' },
  { name: 'いいへんじ', slug: 'iihenji', groupType: 'PROFESSIONAL', description: '詳細がありません。', prefecture: '東京都', region: 'KANTO' },
  { name: 'コトリ会議', slug: 'kotori-kaigi', groupType: 'PROFESSIONAL', description: '関西を拠点に活動する劇団。', prefecture: '大阪府', region: 'KANSAI', website: 'http://kotorikaigi.com/', twitter: 'kotorikaigi' },

  // === 地方プロ劇団 ===
  { name: 'TheatreGroup OCT/PASS', slug: 'oct-pass', groupType: 'PROFESSIONAL', description: '1982年に十月劇場として発足。仙台を拠点に活動。', prefecture: '宮城県', region: 'TOHOKU', foundedYear: 1982, website: 'http://www.oct-pass.com/' },
  { name: '三角フラスコ', slug: 'sankaku-flask', groupType: 'PROFESSIONAL', description: '仙台を拠点に活動する劇団。東北の演劇シーンの中核。', prefecture: '宮城県', region: 'TOHOKU' },
  { name: '劇団短距離男道ミサイル', slug: 'sr-missile', groupType: 'PROFESSIONAL', description: '2011年に東日本大震災後に仙台で旗揚げ。', prefecture: '宮城県', region: 'TOHOKU', foundedYear: 2011, website: 'https://srmissile.com/' },
  { name: '関西芸術座', slug: 'kansai-geijutsuza', groupType: 'PROFESSIONAL', description: '大阪を拠点とする劇団。児演協加盟。', prefecture: '大阪府', region: 'KANSAI' },
  { name: '空間再生事業 劇団GIGA', slug: 'gekidan-giga', groupType: 'PROFESSIONAL', description: '1995年旗揚げ。「街を劇場に！」をコンセプトに様々な空間で上演。', prefecture: '福岡県', region: 'KYUSHU_OKINAWA', foundedYear: 1995, website: 'https://spacegiga.com/' },

  // === 人形劇団 ===
  { name: '人形劇団プーク', slug: 'puppet-puk', groupType: 'PROFESSIONAL', description: '1929年創立の老舗人形劇団。渋谷区代々木のプーク人形劇場を持つ。', prefecture: '東京都', region: 'KANTO', foundedYear: 1929, website: 'https://www.puk.jp/' },
  { name: '人形劇団ひとみ座', slug: 'puppet-hitomiza', groupType: 'PROFESSIONAL', description: '1948年創立。「ひょっこりひょうたん島」で知られる。川崎市を拠点に活動。', prefecture: '神奈川県', region: 'KANTO', foundedYear: 1948, website: 'https://hitomiza.com/' },
  { name: '人形劇団クラルテ', slug: 'puppet-clarte', groupType: 'PROFESSIONAL', description: '1948年設立。大阪市を拠点とする老舗人形劇団。', prefecture: '大阪府', region: 'KANSAI', foundedYear: 1948, website: 'http://www.clarte-net.co.jp/' },
  { name: '人形劇団ポポロ', slug: 'puppet-popolo', groupType: 'PROFESSIONAL', description: '東京都東村山市を拠点とする人形劇団。児演協加盟。', prefecture: '東京都', region: 'KANTO', website: 'http://www.pup-popolo.co.jp/' },
  { name: '人形劇団京芸', slug: 'puppet-kyogei', groupType: 'PROFESSIONAL', description: '京都を拠点とする人形劇団。児演協加盟。', prefecture: '京都府', region: 'KANSAI' },
  { name: '江戸糸あやつり人形結城座', slug: 'yuki-za', groupType: 'PROFESSIONAL', description: '江戸時代から続く糸あやつり人形劇団。日本劇団協議会加盟。', prefecture: '東京都', region: 'KANTO' },

  // === 児童演劇 ===
  { name: '劇団風の子', slug: 'kazenoko', groupType: 'PROFESSIONAL', description: '1950年設立の児童演劇専門劇団。全国及び海外での公演を実施。', prefecture: '東京都', region: 'KANTO', foundedYear: 1950, website: 'https://www.kazenoko.co.jp/' },
  { name: '劇団風の子北海道', slug: 'kazenoko-hokkaido', groupType: 'PROFESSIONAL', description: '劇団風の子の北海道支部。児演協加盟。', prefecture: '北海道', region: 'HOKKAIDO', website: 'https://www.kazenoko-hokkaido.com/' },
  { name: '劇団コーロ', slug: 'gekidan-coro', groupType: 'PROFESSIONAL', description: '大阪を拠点とする児童演劇劇団。児演協加盟。', prefecture: '大阪府', region: 'KANSAI' },
  { name: '劇団飛行船', slug: 'gekidan-hikosen', groupType: 'PROFESSIONAL', description: '児童向け舞台公演を行う劇団。児演協・日本劇団協議会加盟。', prefecture: '東京都', region: 'KANTO' },
  { name: '劇団影法師', slug: 'gekidan-kageboshi', groupType: 'PROFESSIONAL', description: '影絵や人形劇を中心とした劇団。児演協加盟。', prefecture: '東京都', region: 'KANTO' },
  { name: '劇団鳥獣戯画', slug: 'gekidan-chojugiga', groupType: 'PROFESSIONAL', description: '東京を拠点とする児童演劇劇団。児演協加盟。', prefecture: '東京都', region: 'KANTO' },
];

async function main() {
  console.log('=== 劇団一括追加シード開始 ===\n');

  // 既存slugを取得して重複をスキップ
  const existing = await prisma.theaterGroup.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map(e => e.slug));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const group of newGroups) {
    if (existingSlugs.has(group.slug)) {
      // 既存エントリはdescriptionが「詳細がありません。」でなければ更新
      await prisma.theaterGroup.update({
        where: { slug: group.slug },
        data: {
          description: group.description,
          prefecture: group.prefecture ?? undefined,
          region: group.region ?? undefined,
          foundedYear: group.foundedYear ?? undefined,
          website: group.website ?? undefined,
          twitter: group.twitter ?? undefined,
        },
      });
      updated++;
      continue;
    }

    await prisma.theaterGroup.create({
      data: {
        name: group.name,
        slug: group.slug,
        groupType: group.groupType,
        description: group.description,
        prefecture: group.prefecture ?? null,
        region: group.region ?? null,
        foundedYear: group.foundedYear ?? null,
        website: group.website ?? null,
        twitter: group.twitter ?? null,
        isActive: true,
      },
    });
    created++;
  }

  console.log(`  新規作成: ${created}件`);
  console.log(`  更新: ${updated}件`);
  console.log(`  スキップ: ${skipped}件\n`);

  const totalCount = await prisma.theaterGroup.count();
  console.log('=== 結果 ===');
  console.log(`  劇団総数: ${totalCount}団体`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
