import Layout from "@/components/Layout";
import { PrismaClient, Author } from "@prisma/client";
import Link from "next/link";
import { AuthorPageProps, AuthorData } from "@/components/Type/type";

const prisma = new PrismaClient();

function AuthorListPage(authors: any) {
  return (
    <Layout>
      <div>
        <h1>Authors</h1>
        <ul>
          {authors &&
            authors.map((author: any) => (
              <li key={author.id}>
                <Link href={`/authors/${author.id}`}>{author.name}</Link>
              </li>
            ))}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const authors = await prisma.author.findMany({
    include: { posts: true }, // Include the related author information
  });

  return {
    props: {
      authors,
    },
    revalidate: 3600, // You can adjust the revalidation period as needed
  };
}

export default AuthorListPage;
