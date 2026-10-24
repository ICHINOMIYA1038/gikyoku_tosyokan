import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByTag, BlogPostMeta } from '@/lib/blog';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import BlogPostRow from '@/components/BlogPostRow';
import AdSlot from '@/components/Ad/AdSlot';
import { AD_SLOTS } from '@/lib/adSlots';

interface Props {
  tag: string;
  posts: BlogPostMeta[];
}

export default function TagPage({ tag, posts }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle={`「${tag}」の記事一覧`}
        pageDescription={`戯曲図書館ブログの「${tag}」タグが付いた記事一覧`}
        pagePath={`/blog/ja/tags/${encodeURIComponent(tag)}`}
      />
      <div className="max-w-6xl mx-auto pt-6 md:pt-8 pb-12">
        <Breadcrumb items={[{ name: 'ホーム', href: '/' }, { name: 'ブログ', href: '/blog/ja' }, { name: `#${tag}` }]} />
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">
            <h1 className="text-[26px] md:text-[32px] font-serif font-bold text-gray-900 leading-tight">#{tag}</h1>
            <p className="mt-2 text-base text-gray-600">「{tag}」の記事 {posts.length}本</p>

            {posts.length === 0 ? (
              <p className="mt-8 text-gray-700">このタグの記事はまだありません。</p>
            ) : (
              <ul className="mt-6 border-t border-[#D9D5CF]">
                {posts.map((post) => <BlogPostRow key={post.slug} post={post} />)}
              </ul>
            )}

            <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />
          </main>
          <aside className="lg:w-80">
            <BlogSidebar language="ja" />
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const tag = decodeURIComponent(params?.tag as string);
  const posts = await getPostsByTag(tag);
  return { props: { tag, posts } };
};
