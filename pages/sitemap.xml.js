import { prisma } from '@/lib/prisma';

const EXTERNAL_DATA_URL = "https://gikyokutosyokan.com";

const STUDENT_GROUP_TYPES = ['STUDENT', 'INTERCOLLEGE', 'ACADEMIC'];

function generateSiteMap(posts, authors, categories, blogPosts, theaterGroups, universities) {
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

     <!-- 大学演劇ランディングページ -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/university-theater`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>

     <!-- 劇団一覧ページ -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/theater-groups`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>

     <!-- 小劇場データベースページ -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/shogekijo`}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>

     <!-- 個別劇団ページ -->
     ${theaterGroups
       .map(({ slug, groupType }) => {
         const basePath = STUDENT_GROUP_TYPES.includes(groupType) ? 'theater-groups' : 'shogekijo';
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${basePath}/${slug}`}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.5</priority>
       </url>
     `;
       })
       .join("")}

     <!-- 個別大学ページ -->
     ${universities
       .map(({ slug }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/universities/${slug}`}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.5</priority>
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
  const theaterGroups = await prisma.theaterGroup.findMany({
    where: { isActive: true },
    select: { slug: true, groupType: true },
  });
  const universities = await prisma.university.findMany({
    select: { slug: true },
  });

  // We generate the XML sitemap with the data
  const sitemap = generateSiteMap(posts, authors, categories, blogPosts, theaterGroups, universities);
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
