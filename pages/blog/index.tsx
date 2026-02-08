import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';

export default function BlogLanding() {
  const router = useRouter();

  useEffect(() => {
    const lang = navigator.language || '';
    router.replace(lang.startsWith('ja') ? '/blog/ja' : '/blog/en');
  }, [router]);

  return (
    <Layout>
      <Seo
        pageTitle="ブログ | Blog"
        pageDescription="戯曲図書館のブログ。公演情報・演劇ガイド・岸田國士賞受賞劇作家の紹介など。"
        pagePath="/blog"
        pageKeywords={['ブログ', '演劇', 'Japanese Theater', 'Blog']}
      />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">ブログ / Blog</h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog/ja"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            日本語の記事を読む
          </Link>
          <Link
            href="/blog/en"
            className="bg-gray-800 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Read in English
          </Link>
        </div>
      </div>
    </Layout>
  );
}
