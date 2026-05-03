import { PrismaClient } from "@prisma/client";

const EXTERNAL_DATA_URL = "https://gikyokutosyokan.com";
const prisma = new PrismaClient();
function generateSiteMap(posts, authors, categories, blogPosts, studentGroups, shogekijoGroups, venues, awardSlugs, venuePrefectureSlugs) {
  const currentDate = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- トップページ -->
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     
     <!-- 投稿ページ -->
     ${posts
       .map(({ id, updatedAt }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/posts/${id}`}</loc>
           <lastmod>${updatedAt ? new Date(updatedAt).toISOString() : currentDate}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 作者一覧・カテゴリ一覧 -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/authors`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/categories`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>
     
     <!-- 個別作者ページ -->
     ${authors
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/authors/${id}`}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join("")}
       
     <!-- 個別カテゴリページ -->
     ${categories
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/categories/${id}`}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join("")}
     
     <!-- オリジナル脚本ページ（重要） -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/diary/plot`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     
     <!-- ガイドページ（SEO重要） -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide/beginner/how-to-choose-script`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide/beginner/acting-basics`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide/school/culture-festival`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide/cast-size`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide/time`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide/club-management`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/guide/beginner/reading-script`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     
     <!-- 特集ページ（SEO重要） -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/special/seasonal`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     
     <!-- 用語集ページ（SEO重要） -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/glossary`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>

     <!-- 検索ランディングページ（SEO重要） -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/search/comedy`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/search/short`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/search/school`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>

     <!-- ブログ一覧ページ -->
     <url>
       <loc>${EXTERNAL_DATA_URL}/blog</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/blog/ja</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/blog/en</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>

     <!-- ブログ記事 -->
     ${blogPosts
       .map(({ slug, language, updatedAt }) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/blog/${language}/${slug}</loc>
           <lastmod>${updatedAt ? new Date(updatedAt).toISOString() : currentDate}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 大学演劇・学生劇団ページ -->
     <url>
       <loc>${EXTERNAL_DATA_URL}/theater-groups</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>
     ${studentGroups
       .map(({ slug }) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/theater-groups/${slug}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 小劇場・劇団ページ -->
     <url>
       <loc>${EXTERNAL_DATA_URL}/shogekijo</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>
     ${shogekijoGroups
       .map(({ slug }) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/shogekijo/${slug}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 劇場・ホール一覧ページ -->
     <url>
       <loc>${EXTERNAL_DATA_URL}/venues</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>
     ${venues
       .map(({ slug, updatedAt }) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/venues/${slug}</loc>
           <lastmod>${updatedAt ? new Date(updatedAt).toISOString() : currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 劇場・都道府県別ページ -->
     ${venuePrefectureSlugs
       .map((prefSlug) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/venues/region/${prefSlug}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 戯曲賞ページ -->
     <url>
       <loc>${EXTERNAL_DATA_URL}/awards</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     ${awardSlugs
       .map((slug) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/awards/${slug}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 追加検索ランディングページ -->
     <url>
       <loc>${EXTERNAL_DATA_URL}/search/futarishibai</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/search/bunkasai</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/search/short-plays</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>

     <!-- サポートページ -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/about`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/contact`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/copyright`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/aboutus`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.4</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/posting-request`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/privacy-policy`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/press-release`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.4</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/tos`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/voluntary`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.3</priority>
     </url>
     
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make API calls to gather the data for your site
  const posts = await prisma.post.findMany();
  const authors = await prisma.author.findMany();
  const categories = await prisma.category.findMany();
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, language: true, updatedAt: true },
  });

  // 大学演劇・学生劇団（theater-groups）
  const studentGroups = await prisma.theaterGroup.findMany({
    where: {
      isActive: true,
      groupType: { in: ['STUDENT', 'INTERCOLLEGE', 'ACADEMIC'] },
    },
    select: { slug: true },
  });

  // 小劇場・劇団（shogekijo）
  const shogekijoGroups = await prisma.theaterGroup.findMany({
    where: {
      isActive: true,
      groupType: { in: ['AMATEUR', 'PROFESSIONAL', 'YOUTH'] },
    },
    select: { slug: true },
  });

  // 劇場・ホール（venues）
  const venues = await prisma.venue.findMany({
    select: { slug: true, updatedAt: true },
  });

  // 戯曲賞スラッグ（PostAwardのawardNameからユニーク値を取得）
  const awardSlugs = ['kishida', 'tsuruyaNanboku', 'gekisakka-shinjin', 'oms', 'yomiuri', 'aaf'];

  // 劇場・都道府県別ページのスラッグ
  const PREFECTURE_SLUG_MAP = {
    '北海道': 'hokkaido', '青森県': 'aomori', '岩手県': 'iwate', '宮城県': 'miyagi',
    '秋田県': 'akita', '山形県': 'yamagata', '福島県': 'fukushima',
    '茨城県': 'ibaraki', '栃木県': 'tochigi', '群馬県': 'gunma',
    '埼玉県': 'saitama', '千葉県': 'chiba', '東京都': 'tokyo', '神奈川県': 'kanagawa',
    '新潟県': 'niigata', '富山県': 'toyama', '石川県': 'ishikawa', '福井県': 'fukui',
    '山梨県': 'yamanashi', '長野県': 'nagano', '岐阜県': 'gifu', '静岡県': 'shizuoka', '愛知県': 'aichi',
    '三重県': 'mie', '滋賀県': 'shiga', '京都府': 'kyoto',
    '大阪府': 'osaka', '兵庫県': 'hyogo', '奈良県': 'nara', '和歌山県': 'wakayama',
    '鳥取県': 'tottori', '島根県': 'shimane', '岡山県': 'okayama',
    '広島県': 'hiroshima', '山口県': 'yamaguchi',
    '徳島県': 'tokushima', '香川県': 'kagawa', '愛媛県': 'ehime', '高知県': 'kochi',
    '福岡県': 'fukuoka', '佐賀県': 'saga', '長崎県': 'nagasaki',
    '熊本県': 'kumamoto', '大分県': 'oita', '宮崎県': 'miyazaki',
    '鹿児島県': 'kagoshima', '沖縄県': 'okinawa',
  };
  const venuePrefectures = await prisma.venue.findMany({
    select: { prefecture: true },
    distinct: ['prefecture'],
  });
  const venuePrefectureSlugs = venuePrefectures
    .map((p) => PREFECTURE_SLUG_MAP[p.prefecture])
    .filter(Boolean);

  // We generate the XML sitemap with the data
  const sitemap = generateSiteMap(posts, authors, categories, blogPosts, studentGroups, shogekijoGroups, venues, awardSlugs, venuePrefectureSlugs);
  res.statusCode = 200;
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate"); // 24時間のキャッシュ
  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.end(sitemap);

  return {
    props: {},
  };
}

export default SiteMap;
