/**
 * 著者一括更新・追加シードスクリプト（第2弾）
 * - 既存著者のプロフィール補完（空の場合のみ上書き）
 * - 新規著名劇作家の追加
 * - プロフィール不明者に「詳細がありません。」を設定
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-authors-bulk.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// === 既存著者のプロフィール更新 ===
const profileUpdates: { id: number; profile: string; group?: string; masterpiece?: string; website?: string; authorTwitter?: string; groupTwitter?: string }[] = [
  { id: 84, profile: '1934年山形県生まれ、2010年没。劇作家・小説家・放送作家。NHK人形劇「ひょっこりひょうたん島」の台本を共作。「手鎖心中」で直木賞、戯曲「道元の冒険」で岸田國士戯曲賞受賞。', group: 'こまつ座', masterpiece: '父と暮せば', website: 'https://www.inouehisashi.jp/' },
  { id: 91, profile: '1924年東京府生まれ、1993年没。小説家・劇作家・演出家。「壁―S・カルマ氏の犯罪」で芥川賞、「砂の女」で読売文学賞受賞。1973年「安部公房スタジオ」を主宰し演劇活動を展開。ノーベル文学賞有力候補とも目された。', group: '安部公房スタジオ', masterpiece: '友達' },
  { id: 93, profile: '1967年大阪府生まれ。脚本家・戯曲家。19歳でフジテレビヤングシナリオ大賞を受賞しデビュー。「東京ラブストーリー」が社会現象に。2023年映画「怪物」で第76回カンヌ国際映画祭脚本賞受賞。', masterpiece: 'カルテット' },
  { id: 372, profile: '1940年東京生まれ、2024年没。劇作家・演出家・俳優。1963年「状況劇場」を旗揚げし紅テントで知られるアングラ演劇の旗手。「少女仮面」で岸田國士戯曲賞、「佐川君からの手紙」で芥川賞受賞。2021年文化功労者。', group: '唐組', masterpiece: '少女仮面', website: 'https://karagumi.or.jp/' },
  { id: 374, profile: '1939年中華民国山東省生まれ、2007年没。劇作家・演出家。1968年「転形劇場」の旗揚げに参加。台詞のない「沈黙劇」を確立。「小町風伝」で岸田國士戯曲賞受賞。', group: '転形劇場', masterpiece: '小町風伝' },
  { id: 122, profile: '1977年東京都生まれ。劇作家・脚本家。井上ひさしに師事。てがみ座主宰。「蜜柑とユウウツ」で鶴屋南北戯曲賞受賞。2023年NHK連続テレビ小説「らんまん」の脚本を担当し橋田賞受賞。', group: 'てがみ座', masterpiece: 'らんまん', website: 'https://tegamiza.net/', authorTwitter: 'https://x.com/tegamiza' },
  { id: 268, profile: '1977年生まれ。劇作家・演出家。ミナモザ主宰。2022年より日本劇作家協会会長。第70回芸術選奨文部科学大臣賞新人賞受賞。映画「アズミ・ハルコは行方不明」の脚本も手がける。', group: 'ミナモザ', masterpiece: '彼らの敵', website: 'https://minamoza.com/', authorTwitter: 'https://x.com/minamoza' },
  { id: 303, profile: '1976年東京都生まれ。劇作家・演出家・女優。1996年KAKUTA旗揚げ。「痕跡」で鶴屋南北戯曲賞、「荒れ野」で読売文学賞受賞。', group: 'KAKUTA', masterpiece: 'ひとよ', website: 'https://www.kakuta.tv/' },
  { id: 116, profile: '1964年秋田県生まれ。劇作家・演出家・高校教諭。渡辺源四郎商店主宰。教育と地域に根ざした演劇活動で知られる。', group: '渡辺源四郎商店', masterpiece: '親の顔が見たい', website: 'https://www.nabegen.com/', authorTwitter: 'https://x.com/nabegen4ro' },
  { id: 115, profile: '1972年東京都生まれ。劇作家・小説家。母は小説家・津島佑子、祖父は作家・太宰治。燈座主宰。', group: '燈座', masterpiece: '赤い砂を蹴る', website: 'https://nenishihara.com/' },
  { id: 46, profile: '1961年山梨県生まれ。現代美術家・演出家・劇作家。1983年「東京グランギニョル」を旗揚げ。2014年「ブルーシート」で岸田國士戯曲賞受賞。演劇・美術の境界を超えた活動で知られる。', masterpiece: 'ブルーシート' },
  { id: 43, profile: '1975年岡山県生まれ。劇作家・演出家・俳優。はえぎわ主宰。2012年「○○トアル風景」で岸田國士戯曲賞受賞。', group: 'はえぎわ', masterpiece: '○○トアル風景', website: 'https://haegiwa.net/' },
  { id: 270, profile: '1964年北海道生まれ。劇作家・演出家。1987年「演劇企画集団THE・ガジラ」を創立。1998年読売演劇大賞大賞・最優秀演出家賞受賞。桜美林大学教授。', group: 'THE・ガジラ', masterpiece: '寒花', website: 'https://gazira.info/' },
  { id: 139, profile: '1959年東京都生まれ。劇作家・演出家。1986年「新宿八犬伝」で岸田國士戯曲賞受賞。2013年「4 four」で鶴屋南北戯曲賞受賞。', group: 'ティーファクトリー', masterpiece: '新宿八犬伝', website: 'http://www.tfactory.jp/' },
  { id: 135, profile: '1947年愛知県生まれ。劇作家。1981年「あの大鴉、さえも」で岸田國士戯曲賞、「月ノ光」で読売文学賞受賞。2004年紫綬褒章受章。', group: 'キノG-7', masterpiece: '月ノ光' },
  { id: 136, profile: '1960年愛知県生まれ、2024年没。劇作家・演出家。少年王者舘主宰。名古屋を拠点に独自の幻想的・実験的な舞台を創作。', group: '少年王者舘', website: 'http://www.oujakan.jp/' },
  { id: 159, profile: '1970年奈良県生まれ。演出家・劇作家・俳優。カムカムミニキーナ主宰。全作品の作・演出を担当。', group: 'カムカムミニキーナ', website: 'https://www.3297.jp/' },
  { id: 193, profile: '1976年東京都生まれ。劇作家・演出家。1998年ONEOR8旗揚げ。日常の人間関係における心の機微を鋭い観察力で描く作風。', group: 'ONEOR8', masterpiece: '世界は嘘で出来ている', website: 'https://wp.oneor8.net/' },
  { id: 160, profile: '1973年大分県生まれ。劇作家。TRASHMASTERS主宰。社会問題と骨太な人間ドラマを描く。紀伊国屋演劇賞個人賞、千田是也賞受賞。', group: 'TRASHMASTERS', website: 'http://lcp.jp/trash/', authorTwitter: 'https://x.com/nakaturu' },
  { id: 370, profile: '1959年静岡県生まれ。劇作家・演出家・俳優。1984年M.O.P.結成。「東京原子核クラブ」で読売文学賞、「高き彼物」で鶴屋南北戯曲賞受賞。', masterpiece: '東京原子核クラブ' },
  { id: 371, profile: '1902年大阪生まれ、1996年没。劇作家。220編を超える戯曲を創作。代表作に「王将」三部作。1987年文化功労者。', masterpiece: '王将' },
  { id: 357, profile: '1943年生まれ。演出家・劇作家。アングラ演劇の代表的人物。黒色テントによる全国旅公演を展開。「鼠小僧次郎吉」で岸田國士戯曲賞受賞。', group: '鴎座', masterpiece: '鼠小僧次郎吉' },
  { id: 366, profile: '1911年横浜市生まれ、2001年没。劇作家。「常陸坊海尊」で芸術祭賞、「かさぶた式部考」で毎日芸術賞受賞。蜷川幸雄演出の「近松心中物語」が大ヒット。戦後を代表する女性劇作家。', masterpiece: '近松心中物語' },
  { id: 364, profile: '1926年熊本県生まれ、1988年没。劇作家。「日本人民共和国」で岸田國士戯曲賞受賞。代表作に「美しきものの伝説」「からゆきさん」。', masterpiece: '美しきものの伝説' },
  { id: 373, profile: '1940年朝鮮半島平壌生まれ、2011年没。劇作家。「上海バンスキング」で岸田國士戯曲賞受賞（400回以上上演）。杉並芸術会館初代館長。', masterpiece: '上海バンスキング' },
  { id: 368, profile: '1931年東京生まれ、2025年没。劇作家・演出家・俳優。「真田風雲録」で知られる。NHK大河ドラマ「風と雲と虹と」脚本担当。2001年紫綬褒章。', masterpiece: '真田風雲録' },
  { id: 365, profile: '1946年長野県生まれ、2003年没。劇作家・演出家。寺山修司の劇団天井桟敷に参加し共作で「身毒丸」等を執筆。「糸地獄」で岸田國士戯曲賞受賞。', masterpiece: '糸地獄' },
  { id: 356, profile: '1959年東京都生まれ。劇作家・演出家・脚本家。博報堂でコピーライターとして勤務しながらラッパ屋を旗揚げ。「をんな善哉」で鶴屋南北戯曲賞受賞。', group: 'ラッパ屋', masterpiece: 'をんな善哉', website: 'https://rappaya.jp/' },
  { id: 358, profile: '1956年青森県生まれ、2023年没。劇作家・演出家。弘前劇場主宰。青森県立美術館舞台芸術総監督。', group: '弘前劇場', masterpiece: '職員室の午後' },
  { id: 341, profile: '1977年東京都生まれ。劇作家・演出家・音楽家。FUKAIPRODUCE羽衣の全作品の作・演出・音楽を担当。公演の約7割が歌で構成される独自の「妙―ジカル」を創作。', },
  { id: 41, profile: '1971年愛媛県生まれ。振付家・演出家・劇作家。ニブロール主宰。「前向き！タイモン」で岸田國士戯曲賞受賞。ダンスと演劇の両分野で国際的に活動。近畿大学教授。', group: 'ニブロール', masterpiece: '前向き！タイモン', website: 'https://www.nibroll.com/' },
  { id: 47, profile: '1975年神奈川県生まれ。脚本家・演出家。ピチチ5主宰。「あたらしいエクスプロージョン」で岸田國士戯曲賞受賞。', group: 'ピチチ5', masterpiece: 'あたらしいエクスプロージョン', authorTwitter: 'https://x.com/m_fuckhara' },
  { id: 104, profile: '1975年神奈川県生まれ。劇作家・演出家・俳優・演技講師。SKY SOARTψWINGS代表。日本グローバル演劇教育協会代表理事。', group: 'SKY SOARTψWINGS', website: 'https://wias.tokyo/' },
  { id: 272, profile: '1976年福島県生まれ。劇作家・演出家。あおきりみかん主宰。名古屋を拠点に活動。「劇王」で4年連続優勝し「劇帝」の称号を獲得。', group: 'あおきりみかん', authorTwitter: 'https://x.com/yukikanome' },
  { id: 310, profile: '1978年北海道札幌市生まれ。劇作家・演出家・女優。黒色綺譚カナリア派主宰。', group: '黒色綺譚カナリア派', authorTwitter: 'https://x.com/muck_c' },
  { id: 324, profile: '1963年宮城県仙台市生まれ。劇作家・演出家。serial number主宰。2019年映画「新聞記者」で日本アカデミー賞優秀脚本賞受賞。', group: 'serial number', masterpiece: '新聞記者', website: 'https://serialnumber.jp/', authorTwitter: 'https://x.com/shimorix' },
  { id: 330, profile: '1977年大阪府生まれ。劇作家・俳優。劇団鹿殺し代表。映画「Gメン」がキネマ旬報読者選出日本映画賞1位。', group: '劇団鹿殺し', masterpiece: 'スーパースター', website: 'https://shika564.com/' },
  { id: 117, profile: '1966年長野県生まれ。劇作家・詩人・精神科医。光の領地代表。「同郷同年」でOMS戯曲賞大賞受賞。', group: '光の領地', masterpiece: '同郷同年' },
  { id: 363, profile: '1958年宮城県生まれ。女優・劇作家・演出家。1983年白井晃と「遊◎機械/全自動シアター」を結成。小学生キャラ「山田のぼる」が当たり役。' },
  { id: 359, profile: '1931年和歌山県生まれ、1984年没。小説家。「紀ノ川」で地位を確立。「華岡青洲の妻」で女流文学賞、「恍惚の人」「複合汚染」等のベストセラーを生んだ。戯曲も執筆。', masterpiece: '紀ノ川' },
  { id: 360, profile: '1934年東京生まれ。劇作家・演出家。児童青少年演劇にも注力。日本演出者協会元理事長。', masterpiece: 'しのだづま考' },
  { id: 367, profile: '1934年岩手県生まれ、2005年没。劇作家・演出家。「幼児たちの後の祭り」で岸田國士戯曲賞受賞。兵庫県立ピッコロ劇団初代代表。', masterpiece: '幼児たちの後の祭り' },
  { id: 361, profile: '1941年沖縄県生まれ、2013年没。劇作家・演出家。「人類館」で岸田國士戯曲賞受賞（沖縄出身者として初）。', masterpiece: '人類館' },
  { id: 362, profile: '劇団青い鳥の劇作・演出におけるペンネーム。1974年に女性6人で結成された劇団青い鳥は、作家・演出家を置かず全員で創作する独自の方式で活動。', group: '劇団青い鳥', website: 'https://aoitori.org/' },
  // 既にプロフィールがある著者のマスターピース・グループ等を補完
  { id: 176, profile: '1945年福岡県生まれ、2022年没。劇作家。「肥前松浦兄妹心中」で岸田國士戯曲賞受賞。北九州を舞台にした土着的な作品で知られる。', masterpiece: '肥前松浦兄妹心中' },
  { id: 180, profile: '1946年生まれ。劇作家。「漂流家族」「うお傳説」で岸田國士戯曲賞受賞。犯罪事件をモチーフにした作品を多数執筆。', masterpiece: '漂流家族' },
];

// === 新規著者 ===
const newAuthors: { name: string; profile: string; group?: string; masterpiece?: string; website?: string; authorTwitter?: string; groupTwitter?: string }[] = [
  { name: '内藤裕子', profile: '1975年埼玉県生まれ。劇作家・演出家。演劇集団円所属。「カタブイ、1972」で鶴屋南北戯曲賞受賞。', group: '演劇集団円', masterpiece: 'カタブイ、1972' },
  { name: '東憲司', profile: '1964年福岡県生まれ。劇作家・演出家。劇団桟敷童子代表。鶴屋南北戯曲賞をトリプル受賞。', group: '劇団桟敷童子', masterpiece: '泳ぐ機関車', website: 'https://www.sajikidouji.com/' },
  { name: '堀田清美', profile: '劇作家。1958年「島」で岸田國士戯曲賞受賞。', masterpiece: '島' },
  { name: '山崎正和', profile: '1934年京都市生まれ、2020年没。劇作家・評論家。「世阿彌」で岸田國士戯曲賞受賞。文化功労者。文化勲章受章。', masterpiece: '世阿彌' },
  { name: '清水邦夫', profile: '1936年新潟県生まれ、2021年没。劇作家・演出家。蜷川幸雄とのコンビで知られる。「ぼくらが非情の大河をくだる時」で岸田國士戯曲賞受賞。', group: '木冬社', masterpiece: '楽屋' },
  { name: '大橋泰彦', profile: '劇作家・演出家。「ゴジラ」で岸田國士戯曲賞受賞。劇団四畳半主宰。', group: '劇団四畳半', masterpiece: 'ゴジラ' },
  { name: '鈴江俊郎', profile: '劇作家・演出家。「髪をかきあげる」で岸田國士戯曲賞受賞。京都を拠点に活動。', masterpiece: '髪をかきあげる' },
  { name: '松田正隆', profile: '長崎県生まれ。劇作家。「海と日傘」で岸田國士戯曲賞受賞。立命館大学教授。マレビトの会代表。', group: 'マレビトの会', masterpiece: '海と日傘' },
  { name: '深津篤史', profile: '1966年兵庫県生まれ、2014年没。劇作家・演出家。桃園会主宰。「うちやまつり」で岸田國士戯曲賞受賞。', group: '桃園会', masterpiece: 'うちやまつり' },
  { name: '佃典彦', profile: '1964年名古屋市生まれ。劇作家・演出家・俳優。B級遊撃隊主宰。「ぬけがら」で岸田國士戯曲賞受賞。', group: 'B級遊撃隊', masterpiece: 'ぬけがら' },
  { name: '石澤富子', profile: '劇作家。「琵琶伝」で岸田國士戯曲賞受賞。', masterpiece: '琵琶伝' },
];

async function main() {
  console.log('=== 著者一括更新・追加シード開始 ===\n');

  // 1. 既存著者のプロフィール更新
  console.log(`プロフィール更新: ${profileUpdates.length}名を処理中...`);
  let profileUpdated = 0;
  for (const update of profileUpdates) {
    const existing = await prisma.author.findUnique({ where: { id: update.id } });
    if (!existing) {
      console.warn(`  警告: ID ${update.id} の著者が見つかりません`);
      continue;
    }
    await prisma.author.update({
      where: { id: update.id },
      data: {
        profile: existing.profile || update.profile,
        group: existing.group || update.group || undefined,
        masterpiece: existing.masterpiece || update.masterpiece || undefined,
        website: existing.website || update.website || undefined,
        authorTwitter: existing.authorTwitter || update.authorTwitter || undefined,
        groupTwitter: existing.groupTwitter || update.groupTwitter || undefined,
      },
    });
    profileUpdated++;
  }
  console.log(`  完了: ${profileUpdated}名更新\n`);

  // 2. 新規著者の追加
  console.log(`新規著者: ${newAuthors.length}名を処理中...`);
  let created = 0;
  let skipped = 0;
  for (const author of newAuthors) {
    const existing = await prisma.author.findUnique({ where: { name: author.name } });
    if (existing) {
      // 既存の場合はプロフィール補完のみ
      await prisma.author.update({
        where: { name: author.name },
        data: {
          profile: existing.profile || author.profile,
          group: existing.group || author.group || undefined,
          masterpiece: existing.masterpiece || author.masterpiece || undefined,
          website: existing.website || author.website || undefined,
          authorTwitter: existing.authorTwitter || author.authorTwitter || undefined,
          groupTwitter: existing.groupTwitter || author.groupTwitter || undefined,
        },
      });
      skipped++;
      continue;
    }
    await prisma.author.create({
      data: {
        name: author.name,
        profile: author.profile,
        group: author.group ?? null,
        masterpiece: author.masterpiece ?? null,
        website: author.website ?? null,
        authorTwitter: author.authorTwitter ?? null,
        groupTwitter: author.groupTwitter ?? null,
      },
    });
    created++;
  }
  console.log(`  新規: ${created}名, 既存更新: ${skipped}名\n`);

  // 3. プロフィールが空の全著者に「詳細がありません。」を設定
  const emptyProfileAuthors = await prisma.author.findMany({
    where: { OR: [{ profile: null }, { profile: '' }] },
    select: { id: true },
  });
  if (emptyProfileAuthors.length > 0) {
    console.log(`プロフィール空欄: ${emptyProfileAuthors.length}名に「詳細がありません。」を設定中...`);
    for (const a of emptyProfileAuthors) {
      await prisma.author.update({
        where: { id: a.id },
        data: { profile: '詳細がありません。' },
      });
    }
    console.log(`  完了\n`);
  }

  const totalCount = await prisma.author.count();
  const withProfile = await prisma.author.count({ where: { NOT: [{ profile: null }, { profile: '' }, { profile: '詳細がありません。' }] } });
  console.log('=== 結果 ===');
  console.log(`  著者総数: ${totalCount}名`);
  console.log(`  プロフィールあり: ${withProfile}名`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
