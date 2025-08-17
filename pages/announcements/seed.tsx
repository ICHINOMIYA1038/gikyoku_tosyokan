import { useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { FaDatabase, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function SeedAnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    created?: number;
    existing?: number;
  } | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/announcements/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          created: data.created,
          existing: data.existing,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'エラーが発生しました',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'ネットワークエラーが発生しました',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-theater-neutral-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <FaDatabase className="text-3xl text-theater-primary-500" />
              <h1 className="text-2xl font-bold text-theater-neutral-900">
                サンプルデータ作成
              </h1>
            </div>

            <div className="mb-6">
              <p className="text-theater-neutral-700 mb-4">
                公演告知掲示板のサンプルデータを作成します。
              </p>
              <ul className="list-disc list-inside text-sm text-theater-neutral-600 space-y-1">
                <li>5件のサンプル告知が作成されます</li>
                <li>既にデータがある場合は作成されません</li>
                <li>開発・テスト用途のみでご使用ください</li>
              </ul>
            </div>

            {result && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  result.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {result.success ? (
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                ) : (
                  <FaExclamationCircle className="text-red-500 mt-1 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.created !== undefined && (
                    <p className="text-sm text-gray-600 mt-1">
                      作成: {result.created}件
                    </p>
                  )}
                  {result.existing !== undefined && (
                    <p className="text-sm text-gray-600">
                      既存: {result.existing}件
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSeed}
                disabled={loading}
                className="flex-1 bg-theater-primary-500 hover:bg-theater-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    作成中...
                  </span>
                ) : (
                  'サンプルデータを作成'
                )}
              </button>
              <button
                onClick={() => router.push('/announcements')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                告知一覧を見る
              </button>
            </div>
          </div>

          {/* 開発環境のみの注意書き */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>注意:</strong> このページは開発環境専用です。本番環境では使用しないでください。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}