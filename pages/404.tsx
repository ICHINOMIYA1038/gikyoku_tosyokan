import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <Layout>
      <Seo
        pageTitle="404 - ページが見つかりません"
        pageDescription="お探しのページは見つかりませんでした。URLをご確認いただくか、トップページからお探しください。"
        pagePath="/404"
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            ページが見つかりません
          </h2>
          <p className="text-gray-500 mb-8">
            申し訳ございません。お探しのページは見つかりませんでした。
            <br />
            URLをご確認いただくか、下記のリンクからお探しください。
          </p>
          <div className="space-y-4">
            <Link href="/">
              <button className="w-full bg-theater-primary-600 text-white py-3 px-6 rounded-lg hover:bg-theater-primary-600 transition-colors">
                トップページへ戻る
              </button>
            </Link>
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              前のページへ戻る
            </button>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              人気のページ
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/" className="block p-2 bg-gray-50 rounded hover:bg-theater-primary-50 text-theater-primary-700">
                戯曲を検索
              </Link>
              <Link href="/authors" className="block p-2 bg-gray-50 rounded hover:bg-theater-primary-50 text-theater-primary-700">
                作者一覧
              </Link>
              <Link href="/categories" className="block p-2 bg-gray-50 rounded hover:bg-theater-primary-50 text-theater-primary-700">
                カテゴリ一覧
              </Link>
              <Link href="/blog/ja" className="block p-2 bg-gray-50 rounded hover:bg-theater-primary-50 text-theater-primary-700">
                ブログ
              </Link>
              <Link href="/announcements" className="block p-2 bg-gray-50 rounded hover:bg-theater-primary-50 text-theater-primary-700">
                上演告知
              </Link>
              <Link href="/theater-groups" className="block p-2 bg-gray-50 rounded hover:bg-theater-primary-50 text-theater-primary-700">
                劇団データベース
              </Link>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>こんな条件で探せます：</p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center">
                <Link href="/?maxPlaytime=30" className="px-3 py-1 bg-white border rounded-full text-theater-primary-600 hover:bg-theater-primary-50">30分以内の短編</Link>
                <Link href="/?minTotalCount=2&maxTotalCount=5" className="px-3 py-1 bg-white border rounded-full text-theater-primary-600 hover:bg-theater-primary-50">少人数</Link>
                <Link href="/categories/4" className="px-3 py-1 bg-white border rounded-full text-theater-primary-600 hover:bg-theater-primary-50">無料で読める</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}