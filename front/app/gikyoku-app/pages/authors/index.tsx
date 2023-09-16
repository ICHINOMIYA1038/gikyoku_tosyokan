import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { PrismaClient, Author } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

function AuthorListPage(authors: any) {
  return (
    <>
      <Seo />
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
