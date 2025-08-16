import { PrismaClient } from "@prisma/client";

const EXTERNAL_DATA_URL = "https://gikyokutosyokan.com";
const prisma = new PrismaClient();
function generateSiteMap(posts, authors, categories) {
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

  // We generate the XML sitemap with the data
  const sitemap = generateSiteMap(posts, authors, categories);
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
