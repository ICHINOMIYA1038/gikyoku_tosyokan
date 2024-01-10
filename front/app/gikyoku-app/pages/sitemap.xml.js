import { PrismaClient } from "@prisma/client";

const EXTERNAL_DATA_URL = "https://gikyokutosyokan.com/";
const prisma = new PrismaClient();
function generateSiteMap(posts, authors, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     ${posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/posts/${id}`}</loc>
       </url>
     `;
       })
       .join("")}

     <!-- Add /authors/[id], /categories/[id], /authors, /categories, and other custom routes here -->
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/authors`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/categories`}</loc>
     </url>
     ${authors
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/authors/${id}`}</loc>
       </url>
     `;
       })
       .join("")}
     ${categories
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/categories/${id}`}</loc>
       </url>
     `;
       })
       .join("")}
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/about`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/contact`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/copyright`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/aboutus`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/posting-request`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/privacy-policy`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/press-release`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/tos`}</loc>
     </url>
     <url>
       <loc>${`${EXTERNAL_DATA_URL}/support/voluntary`}</loc>
     </url>
     <url>
     <loc>${`${EXTERNAL_DATA_URL}/editor`}</loc>
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
