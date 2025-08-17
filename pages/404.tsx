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
              <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
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
            <p className="text-sm text-gray-500">
              よくアクセスされるページ
            </p>
            <div className="mt-4 space-y-2">
              <Link href="/posts" className="block text-blue-500 hover:underline">
                作品一覧
              </Link>
              <Link href="/authors" className="block text-blue-500 hover:underline">
                作者一覧
              </Link>
              <Link href="/categories" className="block text-blue-500 hover:underline">
                カテゴリー一覧
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}