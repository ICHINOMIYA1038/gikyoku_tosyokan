import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { PrismaClient, Author } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

interface AuthorListPageProps {
  authors: Author[];
}

function AuthorListPage({ authors }: AuthorListPageProps) {
  return (
    <>
      <Seo 
        pageTitle="作者一覧"
        pageDescription="戯曲図書館に登録されている作者の一覧ページです。"
        pagePath="/authors"
      />
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">作者一覧</h1>
          {authors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authors.map((author: any) => (
                <Link 
                  key={author.id} 
                  href={`/authors/${author.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-semibold">{author.name}</h2>
                  {author.posts && author.posts.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      作品数: {author.posts.length}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">現在、表示できる作者がいません。</p>
          )}
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
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
    };
  } catch {
    return {
      notFound: true, // Return a 404 page
    };
  } finally {
    await prisma.$disconnect(); // リクエスト処理の最後で接続を切断
  }
}

export default AuthorListPage;
