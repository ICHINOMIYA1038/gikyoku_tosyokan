/**
 * Programmatic SEO Landing Page Generator
 *
 * Queries the gikyoku_tosyokan DB for plays grouped by useful dimensions
 * (cast count ranges, playtime ranges, categories) and generates
 * markdown blog posts in both JA and EN for each combination with 5+ plays.
 *
 * Usage:
 *   npx tsx scripts/openclaw/generate-seo-landing-pages.ts
 *   npx tsx scripts/openclaw/generate-seo-landing-pages.ts --dry-run
 *   npx tsx scripts/openclaw/generate-seo-landing-pages.ts --limit 5
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const SITE_URL = 'https://gikyokutosyokan.com';
const POSTS_DIR = path.resolve(__dirname, '../../blog/posts');
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlayRow {
  id: number;
  title: string;
  synopsis: string | null;
  man: number | null;
  woman: number | null;
  totalNumber: number | null;
  playtime: number | null;
  averageRating: number | null;
  authorName: string;
  categories: string[];
}

interface PageDefinition {
  /** slug suffix (appended after date) */
  slug: string;
  /** JA page title */
  titleJa: string;
  /** EN page title */
  titleEn: string;
  /** JA meta description */
  descJa: string;
  /** EN meta description */
  descEn: string;
  /** JA intro paragraph explaining the use-case */
  introJa: string;
  /** EN intro paragraph explaining the use-case */
  introEn: string;
  /** Prisma where clause to select matching plays */
  where: Prisma.PostWhereInput;
  /** Tags for the blog post */
  tagsJa: string[];
  tagsEn: string[];
}

// ---------------------------------------------------------------------------
// Page definitions — one per targeted search combination
// ---------------------------------------------------------------------------

const PAGE_DEFS: PageDefinition[] = [
  // --- Cast count ranges ---
  {
    slug: 'plays-for-1-2-actors',
    titleJa: '1〜2人で上演できるおすすめ戯曲【少人数向け脚本まとめ】',
    titleEn: 'Best Japanese Plays for 1-2 Actors',
    descJa: '1人芝居・2人芝居のおすすめ戯曲を厳選紹介。少人数で上演できる脚本をお探しの方に。',
    descEn: 'Curated list of Japanese plays that can be performed with just 1 or 2 actors. Perfect for intimate performances and auditions.',
    introJa:
      '少人数で上演できる戯曲は、稽古のスケジュール調整がしやすく、演技力を磨く練習にも最適です。一人芝居は役者の実力が問われる挑戦的な形式ですし、二人芝居は濃密な人間関係を描くのに向いています。ここでは、1〜2人で上演できるおすすめの戯曲をまとめました。',
    introEn:
      'Plays for 1-2 actors are ideal for intimate performances, acting workshops, and audition preparation. Monologue plays test an actor\'s range, while two-handers allow for intense, focused character dynamics. Here are some of the best Japanese plays written for small casts.',
    where: { totalNumber: { lte: 2, gte: 1 } },
    tagsJa: ['少人数', '一人芝居', '二人芝居', '戯曲', 'おすすめ'],
    tagsEn: ['small cast', 'monologue', 'two-hander', 'Japanese plays'],
  },
  {
    slug: 'plays-for-3-5-actors',
    titleJa: '3〜5人で上演できるおすすめ戯曲【小劇場・演劇部向け】',
    titleEn: 'Best Japanese Plays for 3-5 Actors',
    descJa: '3〜5人キャストの戯曲をまとめました。小劇場公演や演劇部の少人数公演にぴったりの作品を紹介。',
    descEn: 'Discover Japanese plays designed for 3-5 actors — perfect for small theater companies, drama clubs, and workshop performances.',
    introJa:
      '3〜5人規模の戯曲は、小劇場公演や演劇部の活動でもっとも使いやすい人数帯です。全員に見せ場があり、演出の自由度も高い。予算や稽古場の制約がある中でも質の高い公演が実現できます。',
    introEn:
      'Plays for 3-5 actors hit the sweet spot for small theater companies and drama clubs. Every actor gets meaningful stage time, and production costs stay manageable. These plays offer rich ensemble dynamics without requiring a large cast.',
    where: { totalNumber: { gte: 3, lte: 5 } },
    tagsJa: ['3人芝居', '4人芝居', '5人芝居', '小劇場', '戯曲'],
    tagsEn: ['small cast', '3-5 actors', 'ensemble', 'Japanese plays'],
  },
  {
    slug: 'plays-for-6-10-actors',
    titleJa: '6〜10人で上演できるおすすめ戯曲【中規模キャスト向け】',
    titleEn: 'Best Japanese Plays for 6-10 Actors',
    descJa: '6〜10人キャストの戯曲を厳選。中規模の劇団や演劇サークルにおすすめの作品を紹介します。',
    descEn: 'A curated selection of Japanese plays for 6-10 actors, ideal for mid-sized theater groups and university drama clubs.',
    introJa:
      '6〜10人規模の戯曲は、中規模の劇団や大学演劇サークルの公演に最適です。群像劇としての奥行きがありつつ、一人ひとりの役にも重みがある。この人数帯は日本の現代劇でもっとも層が厚く、名作が多いのが特徴です。',
    introEn:
      'Plays for 6-10 actors are the backbone of Japanese contemporary theater. This cast size enables rich ensemble storytelling while keeping each role significant. Many award-winning Japanese plays fall in this range.',
    where: { totalNumber: { gte: 6, lte: 10 } },
    tagsJa: ['中規模', '群像劇', '劇団', '戯曲', 'おすすめ'],
    tagsEn: ['medium cast', 'ensemble', '6-10 actors', 'Japanese plays'],
  },
  {
    slug: 'plays-for-large-cast',
    titleJa: '大人数（11人以上）で上演できるおすすめ戯曲【学校・劇団向け】',
    titleEn: 'Best Japanese Plays for Large Casts (11+ Actors)',
    descJa: '11人以上のキャストで上演できる戯曲を紹介。高校演劇・大学演劇・大規模劇団の公演に最適な作品まとめ。',
    descEn: 'Japanese plays for large casts of 11 or more actors. Ideal for school drama productions, university theater, and large companies.',
    introJa:
      '大人数キャストの戯曲は、高校演劇や大学演劇、劇団の本公演で重宝します。全員に出番がある作品を選ぶことで、団員のモチベーションも上がります。スペクタクルな演出が可能なのも大人数ならではの魅力です。',
    introEn:
      'Large-cast plays are essential for school productions, university drama festivals, and full-scale company performances. They offer spectacular staging possibilities and ensure every member of the group gets meaningful stage time.',
    where: { totalNumber: { gte: 11 } },
    tagsJa: ['大人数', '高校演劇', '大学演劇', '劇団', '戯曲'],
    tagsEn: ['large cast', 'school drama', 'university theater', 'Japanese plays'],
  },

  // --- Playtime ranges ---
  {
    slug: 'short-plays-under-30-minutes',
    titleJa: '30分以内で上演できる短い戯曲【短編戯曲おすすめまとめ】',
    titleEn: 'Short Japanese Plays Under 30 Minutes',
    descJa: '上演時間30分以内の短編戯曲をまとめました。ワークショップ・演劇祭・朗読劇にぴったりの作品を紹介。',
    descEn: 'Discover Japanese short plays under 30 minutes — perfect for festivals, workshops, showcases, and readings.',
    introJa:
      '30分以内の短編戯曲は、演劇ワークショップや短編演劇祭、朗読劇イベントにぴったり。短い時間の中で凝縮されたドラマを楽しめるのが魅力です。初めて演劇に挑戦する方の練習用としても最適。',
    introEn:
      'Short plays under 30 minutes pack dramatic punch into a compact format. They are ideal for theater festivals, drama workshops, showcase events, and readers\' theater. Many of these plays deliver surprisingly powerful stories in a brief runtime.',
    where: { playtime: { lte: 30 } },
    tagsJa: ['短編', '30分', '戯曲', 'ワークショップ', '朗読劇'],
    tagsEn: ['short plays', 'under 30 minutes', 'one-act', 'Japanese theater'],
  },
  {
    slug: 'plays-under-60-minutes',
    titleJa: '60分以内で上演できるおすすめ戯曲【1時間以内の脚本まとめ】',
    titleEn: 'Best Japanese Plays Under 60 Minutes',
    descJa: '上演時間60分以内の戯曲をまとめて紹介。小劇場公演やイベント上演にちょうどいい長さの作品。',
    descEn: 'Japanese plays that run under 60 minutes. Perfect length for small theater performances, festivals, and touring productions.',
    introJa:
      '60分以内の戯曲は、小劇場公演やイベント上演にちょうどいい長さ。観客の集中力が持続しやすく、1日に複数ステージを打つこともできます。制作費を抑えたい場合にも適しています。',
    introEn:
      'Plays under 60 minutes are the ideal length for small venue performances and touring productions. Audiences stay engaged throughout, and you can schedule multiple shows per day. These plays prove that great theater doesn\'t need to be long.',
    where: { playtime: { lte: 60 } },
    tagsJa: ['60分以内', '1時間', '戯曲', '小劇場', 'おすすめ'],
    tagsEn: ['under 60 minutes', 'one-hour plays', 'Japanese theater'],
  },
  {
    slug: 'full-length-plays-90-120-minutes',
    titleJa: '90〜120分の本格長編戯曲おすすめ【見応えある脚本まとめ】',
    titleEn: 'Best Full-Length Japanese Plays (90-120 Minutes)',
    descJa: '上演時間90〜120分の本格的な長編戯曲を紹介。劇団の本公演にふさわしい見応えのある作品を厳選。',
    descEn: 'Full-length Japanese plays running 90-120 minutes. Ideal for main-stage productions with rich, layered storytelling.',
    introJa:
      '90〜120分の長編戯曲は、劇団の本公演やコンクール出場作にふさわしいスケール感があります。登場人物の内面を深く掘り下げ、複雑な物語を展開できるのがこの上演時間の強みです。',
    introEn:
      'Full-length plays of 90-120 minutes allow for deep character development and complex narratives. These are main-stage works that showcase the full power of Japanese dramatic writing.',
    where: { playtime: { gte: 90, lte: 120 } },
    tagsJa: ['長編', '90分', '120分', '本公演', '戯曲'],
    tagsEn: ['full-length', '90-120 minutes', 'main stage', 'Japanese plays'],
  },

  // --- Genre / Category ---
  {
    slug: 'comedy-plays',
    titleJa: 'コメディ戯曲おすすめまとめ【笑える面白い脚本を厳選】',
    titleEn: 'Best Japanese Comedy Plays',
    descJa: '笑えるコメディ戯曲をまとめて紹介。観客を楽しませたい方におすすめの面白い脚本を厳選しました。',
    descEn: 'The best Japanese comedy plays — from sharp satire to heartwarming humor. Find the perfect script to make your audience laugh.',
    introJa:
      'コメディは演劇の王道ジャンル。観客との一体感が生まれやすく、集客力もあります。ここでは、笑いの質が高く、何度観ても楽しめるコメディ戯曲を厳選しました。風刺劇からドタバタ喜劇まで幅広くカバーしています。',
    introEn:
      'Comedy is the most audience-friendly genre in theater. From sharp social satire to slapstick farce, Japanese playwrights have created a rich tradition of comedic writing. These plays will keep your audience laughing — and thinking.',
    where: { categories: { some: { name: 'コメディ' } } },
    tagsJa: ['コメディ', '喜劇', '笑える', '戯曲', 'おすすめ'],
    tagsEn: ['comedy', 'funny', 'humor', 'Japanese plays'],
  },
  {
    slug: 'human-drama-plays',
    titleJa: 'ヒューマンドラマ戯曲おすすめまとめ【心に響く名作脚本】',
    titleEn: 'Best Japanese Human Drama Plays',
    descJa: '心に響くヒューマンドラマ戯曲をまとめて紹介。人間の絆や葛藤を描いた感動作品を厳選。',
    descEn: 'The finest Japanese human drama plays — stories of connection, conflict, and the human condition. Deeply moving scripts for serious theater.',
    introJa:
      'ヒューマンドラマは、人間の心の機微を丁寧に描くジャンルです。家族の絆、友情、喪失と再生――観客の心に長く残る作品が多いのが特徴。演じる側にとっても、役の内面を深く探求できるやりがいのあるジャンルです。',
    introEn:
      'Human drama is the heart of Japanese theater. These plays explore family bonds, friendship, loss, and redemption with nuance and emotional depth. They challenge actors to find truth in every moment and leave audiences profoundly moved.',
    where: { categories: { some: { name: 'ヒューマンドラマ' } } },
    tagsJa: ['ヒューマンドラマ', '感動', '名作', '戯曲', 'おすすめ'],
    tagsEn: ['human drama', 'emotional', 'moving', 'Japanese plays'],
  },
  {
    slug: 'tragedy-plays',
    titleJa: '悲劇・シリアス系戯曲おすすめまとめ【重厚な脚本を厳選】',
    titleEn: 'Best Japanese Tragedy and Serious Drama Plays',
    descJa: '悲劇・シリアス系の戯曲をまとめて紹介。重厚なテーマに挑みたい劇団・演劇部におすすめ。',
    descEn: 'Powerful Japanese tragedies and serious dramas. These plays tackle weighty themes with artistic ambition and emotional intensity.',
    introJa:
      '悲劇は演劇の根幹をなすジャンルです。人間の弱さ、社会の矛盾、避けられない運命――重いテーマに正面から向き合う作品は、観客に深い余韻を残します。コンクールや本格的な公演にもふさわしい重厚な作品を集めました。',
    introEn:
      'Tragedy has been at the core of theater since its origins. These Japanese plays confront human frailty, social injustice, and fate with unflinching honesty. They are demanding works that reward both performers and audiences with profound emotional experiences.',
    where: { categories: { some: { name: '悲劇' } } },
    tagsJa: ['悲劇', 'シリアス', '重厚', '戯曲', 'おすすめ'],
    tagsEn: ['tragedy', 'serious drama', 'intense', 'Japanese plays'],
  },

  // --- Special combinations ---
  {
    slug: 'free-to-read-plays',
    titleJa: '無料で読めるおすすめ戯曲まとめ【ネットで読める脚本】',
    titleEn: 'Free Japanese Plays You Can Read Online',
    descJa: 'インターネット上で無料で読める戯曲をまとめました。脚本探しの第一歩に最適なリストです。',
    descEn: 'Japanese plays you can read for free online. A great starting point for discovering new scripts and playwrights.',
    introJa:
      '戯曲を探す第一歩として、無料で全文が読める作品から始めるのがおすすめです。作家の公式サイトや青空文庫などで公開されている作品を中心に、質の高い戯曲をまとめました。気に入った作家が見つかれば、書籍版にも手を伸ばしてみてください。',
    introEn:
      'One of the best ways to discover Japanese theater is through plays available to read for free online. These scripts are published on authors\' websites, digital archives, and open libraries. Start here to find playwrights whose work resonates with you.',
    where: { categories: { some: { name: '無料で読める！' } } },
    tagsJa: ['無料', '読める', '戯曲', 'おすすめ', 'ネット'],
    tagsEn: ['free', 'read online', 'Japanese plays', 'scripts'],
  },
  {
    slug: 'social-issue-plays',
    titleJa: '社会問題を扱うおすすめ戯曲まとめ【考えさせられる脚本】',
    titleEn: 'Japanese Plays About Social Issues',
    descJa: '社会問題をテーマにした戯曲を紹介。差別・貧困・環境問題など、現代社会の課題に向き合う作品を厳選。',
    descEn: 'Japanese plays that tackle social issues — inequality, discrimination, environmental crisis, and more. Theater that makes you think.',
    introJa:
      '演劇は社会を映す鏡です。差別、貧困、環境問題、戦争の記憶――日本の劇作家たちは、時代の課題に鋭く切り込む作品を数多く生み出してきました。観客に問いかけ、議論を生む、そんな力を持つ戯曲を集めました。',
    introEn:
      'Theater has always been a mirror for society. Japanese playwrights have created powerful works addressing discrimination, poverty, environmental crisis, and the legacy of war. These plays provoke thought, spark dialogue, and challenge audiences to see the world differently.',
    where: { categories: { some: { name: '社会問題' } } },
    tagsJa: ['社会問題', '社会派', '戯曲', 'おすすめ', '考えさせられる'],
    tagsEn: ['social issues', 'political theater', 'Japanese plays'],
  },
  {
    slug: 'absurdist-plays',
    titleJa: '不条理劇のおすすめ戯曲まとめ【実験的・前衛的な脚本】',
    titleEn: 'Best Japanese Absurdist Plays',
    descJa: '不条理劇の名作戯曲をまとめて紹介。前衛的・実験的な演劇に挑戦したい方におすすめ。',
    descEn: 'The best Japanese absurdist plays — avant-garde, experimental, and thought-provoking scripts that push theatrical boundaries.',
    introJa:
      '不条理劇は、日常の論理を超えた世界を描くことで、逆に人間の本質を浮かび上がらせるジャンルです。別役実、安部公房をはじめ、日本には優れた不条理劇の伝統があります。実験的な演劇に挑戦したい方におすすめの作品を集めました。',
    introEn:
      'Absurdist theater strips away conventional logic to reveal deeper truths about the human condition. Japan has a rich tradition of absurdist drama, from Minoru Betsuyaku to Kobo Abe. These plays challenge directors, actors, and audiences in equal measure.',
    where: { categories: { some: { name: '不条理劇' } } },
    tagsJa: ['不条理劇', '前衛', '実験的', '戯曲', 'おすすめ'],
    tagsEn: ['absurdist', 'avant-garde', 'experimental', 'Japanese plays'],
  },
  {
    slug: 'period-drama-plays',
    titleJa: '時代劇・歴史劇のおすすめ戯曲まとめ【古典から近代まで】',
    titleEn: 'Best Japanese Period Drama and Historical Plays',
    descJa: '時代劇・歴史劇の戯曲をまとめて紹介。日本の歴史を舞台にした名作脚本を厳選しました。',
    descEn: 'Japanese period drama and historical plays — from samurai tales to Meiji-era stories. Experience Japan\'s history through theater.',
    introJa:
      '時代劇・歴史劇は、日本の歴史や文化を舞台上に蘇らせるジャンルです。武士の時代から明治・大正期まで、それぞれの時代を生きた人々のドラマを描いた作品を集めました。衣装や所作にもこだわれる、演出しがいのあるジャンルです。',
    introEn:
      'Period drama brings Japan\'s rich history to life on stage. From samurai-era tales to Meiji and Taisho period stories, these plays transport audiences to another time while exploring universal human themes.',
    where: { categories: { some: { name: '時代劇' } } },
    tagsJa: ['時代劇', '歴史劇', '戯曲', 'おすすめ', '日本史'],
    tagsEn: ['period drama', 'historical', 'samurai', 'Japanese plays'],
  },
  {
    slug: 'family-plays',
    titleJa: '家族がテーマのおすすめ戯曲まとめ【家族ドラマの名作脚本】',
    titleEn: 'Best Japanese Plays About Family',
    descJa: '家族をテーマにした戯曲を紹介。親子・夫婦・兄弟の絆と葛藤を描いた作品をまとめました。',
    descEn: 'Japanese plays about family — exploring bonds between parents, children, and siblings. Powerful domestic dramas for the stage.',
    introJa:
      '家族をテーマにした戯曲は、観客の誰もが共感できる普遍的なテーマを扱います。親子の確執、夫婦の危機、兄弟の絆――日常的な空間の中で、人間関係の核心に迫る作品を集めました。',
    introEn:
      'Family plays explore the most universal of human experiences — the complex bonds between parents and children, spouses, and siblings. These Japanese plays find extraordinary drama in ordinary domestic settings.',
    where: { categories: { some: { name: '家族' } } },
    tagsJa: ['家族', '親子', '戯曲', 'おすすめ', 'ドラマ'],
    tagsEn: ['family', 'domestic drama', 'Japanese plays'],
  },
  {
    slug: 'school-plays',
    titleJa: '学校が舞台のおすすめ戯曲まとめ【高校演劇・学園もの】',
    titleEn: 'Best Japanese School Setting Plays',
    descJa: '学校を舞台にした戯曲をまとめて紹介。高校演劇のコンクールや学園祭公演にもおすすめの作品。',
    descEn: 'Japanese plays set in schools — ideal for high school drama competitions and campus performances.',
    introJa:
      '学校を舞台にした戯曲は、高校演劇のコンクールや学園祭公演で特に人気があります。生徒たちが自分ごととして演じやすく、同世代の観客にも響きやすいのが強み。青春の輝きと苦悩を描いた作品を集めました。',
    introEn:
      'School-setting plays are a staple of Japanese high school drama competitions. Young actors can draw on their own experiences, and audiences of all ages connect with stories of youth, friendship, and growing up.',
    where: { categories: { some: { name: '学校' } } },
    tagsJa: ['学校', '高校演劇', '学園', '戯曲', 'おすすめ'],
    tagsEn: ['school', 'high school drama', 'campus', 'Japanese plays'],
  },
  {
    slug: 'horror-mystery-plays',
    titleJa: 'ホラー・ミステリ戯曲おすすめまとめ【怖い・謎解き脚本】',
    titleEn: 'Best Japanese Horror and Mystery Plays',
    descJa: 'ホラー・ミステリ系の戯曲をまとめて紹介。背筋が凍る恐怖劇と頭脳を刺激する推理劇を厳選。',
    descEn: 'Japanese horror and mystery plays — spine-chilling ghost stories and clever whodunits for the stage.',
    introJa:
      'ホラーとミステリは、演劇ならではの臨場感が活きるジャンルです。舞台上の暗闘や効果音による恐怖演出、伏線の回収による知的な快感――観客を最後まで釘付けにする力があります。怖い話や謎解きが好きな方におすすめの戯曲を集めました。',
    introEn:
      'Horror and mystery plays leverage the unique power of live theater — real darkness, real tension, and real surprises. Japanese playwrights have created chilling ghost stories and ingenious mysteries that keep audiences on the edge of their seats.',
    where: {
      categories: {
        some: { name: { in: ['ホラー', 'ミステリ'] } },
      },
    },
    tagsJa: ['ホラー', 'ミステリ', '怖い', '推理', '戯曲'],
    tagsEn: ['horror', 'mystery', 'thriller', 'Japanese plays'],
  },
  {
    slug: 'romance-plays',
    titleJa: '恋愛がテーマのおすすめ戯曲まとめ【ラブストーリー脚本】',
    titleEn: 'Best Japanese Romance and Love Story Plays',
    descJa: '恋愛をテーマにした戯曲を紹介。切ないラブストーリーから情熱的な恋物語まで厳選しました。',
    descEn: 'Japanese plays about love and romance — from bittersweet love stories to passionate dramas of the heart.',
    introJa:
      '恋愛をテーマにした戯曲は、舞台上で繰り広げられる感情の高まりが魅力です。出会いと別れ、すれ違い、禁断の恋――人間のもっとも強い感情を描く作品は、いつの時代も観客を惹きつけます。',
    introEn:
      'Love stories have captivated theater audiences for centuries. These Japanese plays explore romance in all its forms — first love, forbidden passion, bittersweet reunion, and heartbreaking loss. The live stage brings these emotional journeys to vivid life.',
    where: { categories: { some: { name: '恋愛' } } },
    tagsJa: ['恋愛', 'ラブストーリー', '戯曲', 'おすすめ'],
    tagsEn: ['romance', 'love story', 'Japanese plays'],
  },
  {
    slug: 'award-winning-plays',
    titleJa: '岸田國士戯曲賞受賞作品おすすめまとめ【戯曲の芥川賞】',
    titleEn: 'Kishida Kunio Drama Award Winners — Best Japanese Plays',
    descJa: '岸田國士戯曲賞の受賞・候補作をまとめて紹介。「戯曲の芥川賞」と呼ばれる名誉ある賞の作品一覧。',
    descEn: 'Winners and nominees of the Kishida Kunio Drama Award — Japan\'s most prestigious prize for playwriting.',
    introJa:
      '岸田國士戯曲賞は「戯曲の芥川賞」とも呼ばれ、日本でもっとも権威ある戯曲賞のひとつです。受賞作は時代を映す鏡であり、日本演劇の最先端を知ることができます。ここでは受賞作・候補作の中から特におすすめの作品を紹介します。',
    introEn:
      'The Kishida Kunio Drama Award is Japan\'s most prestigious prize for playwriting, often called "the Akutagawa Prize of drama." Winning plays represent the cutting edge of Japanese theater. Here are the award winners and notable nominees in our collection.',
    where: { categories: { some: { name: '岸田國士戯曲賞' } } },
    tagsJa: ['岸田國士戯曲賞', '受賞作', '名作', '戯曲', 'おすすめ'],
    tagsEn: ['Kishida award', 'award-winning', 'prestigious', 'Japanese plays'],
  },
  {
    slug: 'crying-emotional-plays',
    titleJa: '泣ける戯曲おすすめまとめ【感動して涙が出る脚本】',
    titleEn: 'Most Emotionally Moving Japanese Plays That Will Make You Cry',
    descJa: '泣ける・感動する戯曲をまとめて紹介。心に響く名作脚本を厳選しました。',
    descEn: 'The most emotionally powerful Japanese plays that will bring tears to your eyes. Deeply moving scripts for meaningful theater.',
    introJa:
      '「泣ける」戯曲には、人の心を動かす特別な力があります。喪失の悲しみ、家族の絆、人生の転機――感情を揺さぶられる体験は、演劇でしか味わえない贅沢です。客席が涙に包まれる、そんな感動作を集めました。',
    introEn:
      'The most powerful theater leaves audiences in tears — not from sadness alone, but from the overwhelming beauty of shared human experience. These Japanese plays deal with loss, love, and life\'s turning points with such emotional honesty that tears become inevitable.',
    where: { categories: { some: { name: { in: ['泣ける', '感動'] } } } },
    tagsJa: ['泣ける', '感動', '名作', '戯曲', 'おすすめ'],
    tagsEn: ['emotional', 'moving', 'tear-jerker', 'Japanese plays'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function truncateSynopsis(synopsis: string | null, maxLen: number): string {
  if (!synopsis) return '';
  const clean = synopsis.replace(/\n+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.substring(0, maxLen).replace(/[。、\s]+$/, '') + '…';
}

function playtimeLabel(minutes: number | null, lang: 'ja' | 'en'): string {
  if (!minutes) return lang === 'ja' ? '不明' : 'Unknown';
  if (lang === 'ja') return `約${minutes}分`;
  return `~${minutes} min`;
}

function castLabel(post: PlayRow, lang: 'ja' | 'en'): string {
  const parts: string[] = [];
  if (lang === 'ja') {
    if (post.man) parts.push(`男${post.man}`);
    if (post.woman) parts.push(`女${post.woman}`);
    if (post.others) parts.push(`その他${post.others}`);
    if (post.totalNumber) parts.push(`計${post.totalNumber}人`);
    return parts.join(' / ') || '不明';
  } else {
    if (post.man) parts.push(`${post.man}M`);
    if (post.woman) parts.push(`${post.woman}F`);
    if (post.others) parts.push(`${post.others} other`);
    if (post.totalNumber) parts.push(`${post.totalNumber} total`);
    return parts.join(' / ') || 'Unknown';
  }
}

function ratingStars(rating: number | null): string {
  if (!rating) return '';
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));
  return `${'★'.repeat(clamped)}${'☆'.repeat(5 - clamped)} ${rating.toFixed(1)}`;
}

// ---------------------------------------------------------------------------
// Markdown generation
// ---------------------------------------------------------------------------

function generateMarkdownJa(def: PageDefinition, plays: PlayRow[]): string {
  const frontmatter = [
    '---',
    `title: "${def.titleJa}"`,
    `date: "${TODAY}"`,
    `description: "${def.descJa}"`,
    `tags: ${JSON.stringify(def.tagsJa)}`,
    `language: "ja"`,
    '---',
  ].join('\n');

  const lines: string[] = [frontmatter, '', def.introJa, ''];

  // Table of contents
  lines.push('## 目次', '');
  plays.forEach((p, i) => {
    lines.push(`${i + 1}. [${p.title}（${p.authorName}）](#play-${p.id})`);
  });
  lines.push('');

  // Play entries
  plays.forEach((p, i) => {
    lines.push(`## ${i + 1}. ${p.title} {#play-${p.id}}`, '');
    lines.push(`**作者**: ${p.authorName}`, '');

    const meta: string[] = [];
    meta.push(`- **上演人数**: ${castLabel(p, 'ja')}`);
    meta.push(`- **上演時間**: ${playtimeLabel(p.playtime, 'ja')}`);
    if (p.averageRating) meta.push(`- **評価**: ${ratingStars(p.averageRating)}`);
    if (p.categories.length) meta.push(`- **ジャンル**: ${p.categories.join('、')}`);
    lines.push(meta.join('\n'), '');

    if (p.synopsis) {
      lines.push(truncateSynopsis(p.synopsis, 200), '');
    }

    lines.push(`[→ この戯曲の詳細を見る](${SITE_URL}/posts/${p.id})`, '');
    lines.push('---', '');
  });

  // Footer
  lines.push(
    '## まとめ',
    '',
    `以上、${def.titleJa.replace(/【.*】/, '')}をご紹介しました。気になる作品があれば、ぜひ詳細ページで内容を確認してみてください。`,
    '',
    `戯曲図書館では${plays.length > 100 ? '700' : plays.length * 3}作品以上の戯曲を掲載中です。[トップページ](${SITE_URL})から人数・上演時間・ジャンルで検索できます。`,
    ''
  );

  return lines.join('\n');
}

function generateMarkdownEn(def: PageDefinition, plays: PlayRow[]): string {
  const frontmatter = [
    '---',
    `title: "${def.titleEn}"`,
    `date: "${TODAY}"`,
    `description: "${def.descEn}"`,
    `tags: ${JSON.stringify(def.tagsEn)}`,
    `language: "en"`,
    '---',
  ].join('\n');

  const lines: string[] = [frontmatter, '', def.introEn, ''];

  // Table of contents
  lines.push('## Table of Contents', '');
  plays.forEach((p, i) => {
    lines.push(`${i + 1}. [${p.title} by ${p.authorName}](#play-${p.id})`);
  });
  lines.push('');

  // Play entries
  plays.forEach((p, i) => {
    lines.push(`## ${i + 1}. ${p.title} {#play-${p.id}}`, '');
    lines.push(`**Playwright**: ${p.authorName}`, '');

    const meta: string[] = [];
    meta.push(`- **Cast size**: ${castLabel(p, 'en')}`);
    meta.push(`- **Runtime**: ${playtimeLabel(p.playtime, 'en')}`);
    if (p.averageRating) meta.push(`- **Rating**: ${ratingStars(p.averageRating)}`);
    if (p.categories.length) meta.push(`- **Genre**: ${p.categories.join(', ')}`);
    lines.push(meta.join('\n'), '');

    if (p.synopsis) {
      lines.push(truncateSynopsis(p.synopsis, 200), '');
    }

    lines.push(`[View full details](${SITE_URL}/posts/${p.id})`, '');
    lines.push('---', '');
  });

  // Footer
  lines.push(
    '## Summary',
    '',
    `These are some of the best ${def.titleEn.toLowerCase().replace(/^best /, '')} in our collection. Click through to each play's detail page for full synopsis, cast breakdown, and reader reviews.`,
    '',
    `Gikyoku Tosyokan (Theater Script Library) features over ${plays.length > 100 ? '700' : plays.length * 3} Japanese plays searchable by cast size, runtime, and genre. [Browse the full collection](${SITE_URL}).`,
    ''
  );

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : PAGE_DEFS.length;

  const defs = PAGE_DEFS.slice(0, limit);

  console.log(`Generating SEO landing pages (${dryRun ? 'DRY RUN' : 'LIVE'})...`);
  console.log(`  Page definitions: ${defs.length}`);
  console.log(`  Output directory: ${POSTS_DIR}`);
  console.log('');

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  let generated = 0;

  for (const def of defs) {
    // Query plays matching this definition
    const posts = await prisma.post.findMany({
      where: def.where,
      include: {
        author: { select: { name: true } },
        categories: { select: { name: true } },
      },
      orderBy: [
        { averageRating: { sort: 'desc', nulls: 'last' } },
        { totalNumber: 'asc' },
      ],
      take: 30, // Cap at 30 per page for readability
    });

    if (posts.length < 5) {
      console.log(`  SKIP: ${def.slug} — only ${posts.length} plays (need 5+)`);
      continue;
    }

    const plays: PlayRow[] = posts.map((p) => ({
      id: p.id,
      title: p.title,
      synopsis: p.synopsis,
      man: p.man,
      woman: p.woman,
      totalNumber: p.totalNumber,
      playtime: p.playtime,
      averageRating: p.averageRating,
      authorName: p.author.name,
      categories: p.categories.map((c) => c.name),
    }));

    // Generate JA
    const jaSlug = `${TODAY}-${def.slug}-ja`;
    const jaContent = generateMarkdownJa(def, plays);
    const jaPath = path.join(POSTS_DIR, `${jaSlug}.md`);

    // Generate EN
    const enSlug = `${TODAY}-${def.slug}-en`;
    const enContent = generateMarkdownEn(def, plays);
    const enPath = path.join(POSTS_DIR, `${enSlug}.md`);

    if (dryRun) {
      console.log(`  [DRY] ${def.slug}: ${plays.length} plays`);
      console.log(`         JA → ${jaSlug}.md`);
      console.log(`         EN → ${enSlug}.md`);
    } else {
      fs.writeFileSync(jaPath, jaContent, 'utf-8');
      fs.writeFileSync(enPath, enContent, 'utf-8');
      console.log(`  OK: ${def.slug} (${plays.length} plays)`);
      console.log(`      JA → ${jaSlug}.md`);
      console.log(`      EN → ${enSlug}.md`);
    }

    generated += 2;
  }

  console.log(`\nDone! Generated ${generated} files (${generated / 2} JA + ${generated / 2} EN).`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
