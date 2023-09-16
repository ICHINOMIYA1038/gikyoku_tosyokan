import Layout from "@/components/Layout";
import { PrismaClient, Author } from "@prisma/client";
import Link from "next/link";
import { AuthorPageProps, AuthorData } from "@/components/Type/type";
import { Head } from "next/document";

const prisma = new PrismaClient();

function AuthorListPage(authors: any) {
  return (
    <>
      <Head>
        <title>戯曲図書館</title>
        <meta
          name="description"
          content="
  上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
          key="desc"
        />
        <meta property="og:title" content="戯曲を探す、戯曲図書館" />
        <meta
          property="og:description"
          content="上演する脚本を探しの方に。上演時間や人数などから検索ができます。戯曲を探す、戯曲図書館。"
        />
        <meta property="og:image" content="https://gikyokutosyokan.logo.png" />
      </Head>
      <Layout>
        <div>
          <h1>Authors</h1>
          <ul>
            {authors.length == 0 &&
              authors.map((author: any) => (
                <li key={author.id}>
                  <Link href={`/authors/${author.id}`}>{author.name}</Link>
                </li>
              ))}
          </ul>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const authors = await prisma.author.findMany({
    include: {
      posts: {
        include: { author: true },
      },
    }, // Include the related author information
  });

  return {
    props: {
      authors,
    },
    revalidate: 3600, // You can adjust the revalidation period as needed
  };
}

export default AuthorListPage;
