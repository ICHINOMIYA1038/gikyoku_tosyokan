/**
 * 著者（劇作家）シードスクリプト
 * 著名劇作家のプロフィール・所属劇団・代表作等をDBに投入/更新
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-authors.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authors = [
  {
    name: '市原佐都子',
    group: 'Q',
    profile: '1988年生まれ、大阪府出身の劇作家・演出家。劇団Q主宰。城崎国際アートセンター芸術監督。人間の身体性や欲望をテーマにした作品で国際的に活躍。',
    masterpiece: 'バッコスの信女―ホルスタインの雌',
    website: 'https://qqq-qqq-qqq.com/',
    authorTwitter: 'https://x.com/qqq_9',
    groupTwitter: 'https://x.com/qqq_9',
  },
  {
    name: '谷賢一',
    group: 'DULL-COLORED POP',
    profile: '1982年生まれ、福島県出身の劇作家・演出家・翻訳家。明治大学卒、英国ケント大学留学。劇団DULL-COLORED POP主宰。社会的テーマを精緻な構成で描く。',
    masterpiece: '福島三部作',
    website: 'https://www.dcpop.org/',
    authorTwitter: 'https://x.com/playnote',
    groupTwitter: null,
  },
  {
    name: '福名理穂',
    group: 'ぱぷりか',
    profile: '1991年生まれ、広島県出身の劇作家・演出家。ぱぷりか主宰。広島弁を用いた現代口語演劇を創作し、役の内面を重視した繊細な作品が特徴。',
    masterpiece: '柔らかく搖れる',
    website: 'https://www.paprika-play.com/',
    authorTwitter: 'https://x.com/pap926',
    groupTwitter: 'https://x.com/pap926',
  },
  {
    name: '山本卓卓',
    group: '範宙遊泳',
    profile: '1987年生まれ、山梨県出身の劇作家・演出家。範宙遊泳主宰。舞台上に投影した文字・映像と俳優を組み合わせた独自の演出で注目を集める。',
    masterpiece: 'バナナの花は食べられる',
    website: 'https://www.hanchuyuei2017.com/',
    authorTwitter: 'https://x.com/suguru_2new',
    groupTwitter: null,
  },
  {
    name: '加藤拓也',
    group: '劇団た組。',
    profile: '1993年生まれ、大阪府出身の劇作家・演出家・映像作家。劇団た組。主宰。23歳で三越劇場最年少の作・演出を記録。映像・舞台の両分野で活躍。',
    masterpiece: 'ドードーが落下する',
    website: 'https://takumitheater.jp/',
    authorTwitter: 'https://x.com/katoh_takuya',
    groupTwitter: null,
  },
  {
    name: '金山寿甲',
    group: '東葛スポーツ',
    profile: '1975年生まれ、千葉県流山市出身の劇作家・演出家。東葛スポーツ主宰。ヒップホップの手法を演劇に取り入れ、リアルとフィクションが交錯する作風が特徴。',
    masterpiece: 'パチンコ（上）',
    website: 'http://www.tokatsusports.com/',
    authorTwitter: null,
    groupTwitter: 'https://x.com/tokatsusports',
  },
  {
    name: '池田亮',
    group: 'ゆうめい',
    profile: '1992年生まれの劇作家・演出家・造形作家。東京藝術大学大学院美術研究科修了。ゆうめい主宰。美術と演劇を融合した独自の作品を創作。',
    masterpiece: 'ハートランド',
    website: 'https://www.yu-mei.com/',
    authorTwitter: 'https://x.com/yyyry_ikeda',
    groupTwitter: 'https://x.com/y__u__m__e__i',
  },
  {
    name: '安藤奎',
    group: '劇団アンパサンド',
    profile: '1992年生まれ、大分県出身の劇作家・演出家。劇団アンパサンド主宰。第69回岸田國士戯曲賞受賞。',
    masterpiece: '歩かなくても棒に当たる',
    website: null,
    authorTwitter: 'https://x.com/kei_ando_',
    groupTwitter: 'https://x.com/gekidanampersan',
  },
  {
    name: '笠木泉',
    group: 'スヌーヌー',
    profile: '1976年生まれ、福島県いわき市出身の劇作家・演出家・女優。スヌーヌー主宰。遊園地再生事業団出身。第69回岸田國士戯曲賞受賞。',
    masterpiece: '海まで100年',
    website: 'https://snuunuu.com/',
    authorTwitter: 'https://x.com/izumikasagi',
    groupTwitter: 'https://x.com/snuunuu',
  },
  {
    name: '柴幸男',
    group: 'ままごと',
    profile: '1982年生まれ、愛知県一宮市出身の劇作家・演出家。ままごと主宰、青年団演出部所属。ループやサンプリングなど演劇外の発想を取り入れた演出が特徴。',
    masterpiece: 'わが星',
    website: 'https://mamagoto.org/',
    authorTwitter: null,
    groupTwitter: 'https://x.com/mama_goto',
  },
  {
    name: '松井周',
    group: 'サンプル',
    profile: '1972年生まれ、東京都出身の劇作家・演出家・俳優。サンプル主宰。NYタイムズで「日本で最も重要な演出家の一人」と評される。青年団出身。',
    masterpiece: '自慢の息子',
    website: null,
    authorTwitter: 'https://x.com/sample_net',
    groupTwitter: 'https://x.com/sample_net',
  },
  {
    name: '藤田貴大',
    group: 'マームとジプシー',
    profile: '1985年生まれ、北海道伊達市出身の劇作家・演出家。マームとジプシー主宰。26歳で岸田國士戯曲賞受賞。他ジャンル作家との共作も多数。',
    masterpiece: 'cocoon',
    website: 'http://mum-gypsy.com/',
    authorTwitter: 'https://x.com/fujita_takahiro',
    groupTwitter: null,
  },
  {
    name: '赤堀雅秋',
    group: 'THE SHAMPOO HAT',
    profile: '1971年生まれ、千葉県出身の劇作家・演出家・俳優・映画監督。THE SHAMPOO HAT主宰。舞台と映画の両分野で活躍。',
    masterpiece: '一丁目ぞめき',
    website: 'http://www.shampoohat.com/',
    authorTwitter: null,
    groupTwitter: null,
  },
  {
    name: '岩井秀人',
    group: 'ハイバイ',
    profile: '1974年生まれ、東京都小金井市出身の劇作家・演出家・俳優。ハイバイ主宰。自身のひきこもり経験を基にした家族をテーマにした作品で知られる。',
    masterpiece: 'て',
    website: 'https://hi-bye.net/',
    authorTwitter: 'https://x.com/iwaihideto',
    groupTwitter: null,
  },
  {
    name: '上田誠',
    group: 'ヨーロッパ企画',
    profile: '1979年生まれ、京都府出身の劇作家・演出家・脚本家。ヨーロッパ企画主宰。SFコメディを愛好し、アニメ「四畳半神話大系」脚本も手掛ける。',
    masterpiece: '来てけつかるべき新世界',
    website: 'https://www.europe-kikaku.com/',
    authorTwitter: 'https://x.com/uedamakoto_ek',
    groupTwitter: null,
  },
  {
    name: 'タニノクロウ',
    group: '庭劇団ペニノ',
    profile: '1976年生まれ、富山県出身の劇作家・演出家・元精神科医。庭劇団ペニノ主宰。作り込んだ舞台美術と上演空間へのこだわりが特徴。',
    masterpiece: '地獄谷温泉 無明ノ宿',
    website: 'https://niwagekidan.org/',
    authorTwitter: null,
    groupTwitter: 'https://x.com/niwagekidan',
  },
  {
    name: '神里雄大',
    group: '岡崎藝術座',
    profile: '1982年ペルー・リマ生まれの劇作家・演出家。岡崎藝術座主宰。日系ペルー人のルーツを持ち、移民や越境をテーマにした作品で国際的に評価される。',
    masterpiece: 'バルパライソの長い坂をくだる話',
    website: 'https://okazaki-art-theatre.com/',
    authorTwitter: null,
    groupTwitter: null,
  },
  {
    name: '松原俊太郎',
    group: null,
    profile: '1988年生まれ、熊本県出身の劇作家。神戸大学経済学部卒。劇団を持たず演出もしない「純粋劇作家」として活動。京都在住。',
    masterpiece: '山山',
    website: 'https://matsubarashuntaro.com/',
    authorTwitter: 'https://x.com/shuntaro_m',
    groupTwitter: null,
  },
  {
    name: '平田オリザ',
    group: '青年団',
    profile: '1962年生まれ、東京都出身の劇作家・演出家。青年団主宰。「現代口語演劇理論」を提唱し、日本現代演劇に大きな影響を与えた。芸術文化観光専門職大学学長。',
    masterpiece: '東京ノート',
    website: 'https://www.seinendan.org/',
    authorTwitter: null,
    groupTwitter: null,
  },
  {
    name: '野田秀樹',
    group: 'NODA・MAP',
    profile: '1955年生まれの劇作家・演出家・俳優。NODA・MAP主宰、東京芸術劇場芸術監督。名誉大英勲章OBE受勲、紫綬褒章受章。',
    masterpiece: 'フェイクスピア',
    website: 'https://www.nodamap.com/',
    authorTwitter: null,
    groupTwitter: null,
  },
  {
    name: '松尾スズキ',
    group: '大人計画',
    profile: '福岡県北九州市出身の劇作家・演出家・俳優・映画監督。大人計画主宰。多くの個性派俳優を輩出。',
    masterpiece: 'キレイ―神様と待ち合わせした女―',
    website: 'https://otonakeikaku.net/',
    authorTwitter: null,
    groupTwitter: null,
  },
  {
    name: '岡田利規',
    group: 'チェルフィッチュ',
    profile: '1973年生まれ、横浜市出身の劇作家・演出家・小説家。チェルフィッチュ主宰。超口語的な日本語とユニークなコレオグラフィーで世界的に評価される。大江健三郎賞受賞。',
    masterpiece: '三月の5日間',
    website: 'https://chelfitsch.net/',
    authorTwitter: 'https://x.com/chelfitsch',
    groupTwitter: 'https://x.com/chelfitsch',
  },
  {
    name: '蓬莱竜太',
    group: 'モダンスイマーズ',
    profile: '1976年生まれ、兵庫県神戸市出身の劇作家・演出家。モダンスイマーズ座付き作家。岸田國士戯曲賞・鶴屋南北戯曲賞など多数受賞。',
    masterpiece: 'まほろば',
    website: 'http://modernswimmers.com/',
    authorTwitter: 'https://x.com/ryucham01071',
    groupTwitter: null,
  },
  {
    name: '本谷有希子',
    group: '劇団、本谷有希子',
    profile: '1979年生まれ、石川県出身の劇作家・小説家・演出家。劇団、本谷有希子主宰。小説家としても芥川賞を受賞するなど、演劇と文学の両分野で高い評価。',
    masterpiece: '遭難、',
    website: 'https://www.motoyayukiko.com/',
    authorTwitter: 'https://x.com/gekidan_motoya',
    groupTwitter: 'https://x.com/gekidan_motoya',
  },
  {
    name: '前川知大',
    group: 'イキウメ',
    profile: '1974年生まれ、新潟県柏崎市出身の劇作家・演出家。イキウメ主宰。目に見えないものと人間の関わりを描き、SF的要素を取り入れた作品が特徴。',
    masterpiece: '太陽',
    website: 'https://www.ikiume.jp/',
    authorTwitter: 'https://x.com/ikiume_kataru',
    groupTwitter: 'https://x.com/ikiume_kataru',
  },
  {
    name: '横山拓也',
    group: 'iaku',
    profile: '1977年生まれ、大阪府吹田市出身の劇作家・演出家。iaku主宰。緻密な会話劇を得意とし、鶴屋南北戯曲賞・紀伊國屋演劇賞受賞。',
    masterpiece: 'モモンバのくくり罠',
    website: 'https://www.iaku.jp/',
    authorTwitter: 'https://x.com/takuyayokoyama',
    groupTwitter: null,
  },
  {
    name: '古川健',
    group: '劇団チョコレートケーキ',
    profile: '1978年生まれ、東京都出身の劇作家・俳優。劇団チョコレートケーキ所属。歴史を題材にした骨太な作品で知られ、読売演劇大賞大賞受賞。',
    masterpiece: '生き残った子孫たちへ 戦争六篇',
    website: 'https://www.geki-choco.com/',
    authorTwitter: null,
    groupTwitter: null,
  },
  {
    name: '三浦直之',
    group: 'ロロ',
    profile: '1987年生まれ、宮城県出身の劇作家・演出家。ロロ主宰。ポップカルチャーからの大胆な引用を特徴とし、高校演劇向け「いつ高シリーズ」を無料公開。',
    masterpiece: 'いつだって可笑しいほど誰もが誰か愛し愛されて第三小学校',
    website: 'http://loloweb.jp/',
    authorTwitter: 'https://x.com/miuranaoyuki',
    groupTwitter: null,
  },
  {
    name: '鄭義信',
    group: null,
    profile: '1957年生まれ、兵庫県姫路市出身の劇作家・脚本家・映画監督。在日コリアンの視点から日本の戦後史を描く作品で知られる。岸田國士戯曲賞・日本アカデミー賞脚本賞受賞。',
    masterpiece: '焼肉ドラゴン',
    website: null,
    authorTwitter: null,
    groupTwitter: null,
  },
];

async function main() {
  console.log('=== 著者シード開始 ===\n');
  console.log(`著者: ${authors.length}名を処理中...`);

  let created = 0;
  let updated = 0;

  for (const author of authors) {
    const existing = await prisma.author.findUnique({ where: { name: author.name } });

    await prisma.author.upsert({
      where: { name: author.name },
      update: {
        // 既存データがあるフィールドは上書きしない（既存の値を優先）
        // ただし空の場合は新しい値で埋める
        website: existing?.website || author.website || null,
        group: existing?.group || author.group || null,
        profile: existing?.profile || author.profile || null,
        masterpiece: existing?.masterpiece || author.masterpiece || null,
        authorTwitter: existing?.authorTwitter || author.authorTwitter || null,
        groupTwitter: existing?.groupTwitter || author.groupTwitter || null,
      },
      create: {
        name: author.name,
        website: author.website || null,
        group: author.group || null,
        profile: author.profile || null,
        masterpiece: author.masterpiece || null,
        authorTwitter: author.authorTwitter || null,
        groupTwitter: author.groupTwitter || null,
      },
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  console.log(`  完了: 新規 ${created}名, 更新 ${updated}名\n`);

  const totalCount = await prisma.author.count();
  console.log('=== 結果 ===');
  console.log(`  著者総数: ${totalCount}名`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
