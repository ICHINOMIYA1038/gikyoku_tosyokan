import { useState } from 'react';
import Layout from '@/components/Layout';

export default function PerformanceDebugPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/performance');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ error: error instanceof Error ? error.message : 'Test failed' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'slow': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">パフォーマンス診断</h1>
        
        <button
          onClick={runTest}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'テスト実行中...' : 'パフォーマンステストを実行'}
        </button>

        {results && (
          <div className="mt-8 space-y-6">
            {results.error ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h2 className="text-red-800 font-bold">エラー</h2>
                <pre className="text-sm mt-2">{results.error}</pre>
              </div>
            ) : (
              <>
                {/* テスト結果 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">テスト結果</h2>
                  <div className="space-y-3">
                    {results.tests?.map((test: any, index: number) => (
                      <div key={index} className="border-b pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{test.name}</h3>
                            {test.result && (
                              <p className="text-sm text-gray-600">{test.result}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`font-bold ${getStatusColor(test.status)}`}>
                              {test.duration}
                            </span>
                            {test.status && (
                              <span className={`ml-2 text-sm ${getStatusColor(test.status)}`}>
                                ({test.status})
                              </span>
                            )}
                          </div>
                        </div>
                        {test.breakdown && (
                          <div className="mt-2 text-sm text-gray-600">
                            {Object.entries(test.breakdown).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                {key}: {value as string}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* サマリー */}
                {results.summary && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">サマリー</h2>
                    <div className="space-y-2">
                      <p>
                        <strong>総実行時間:</strong> {results.summary.total_test_time}
                      </p>
                      {results.summary.slowest_query?.name && (
                        <p>
                          <strong>最も遅いクエリ:</strong> {results.summary.slowest_query.name} 
                          ({results.summary.slowest_query.duration})
                        </p>
                      )}
                    </div>
                    
                    {results.summary.recommendations?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-bold mb-2">推奨事項:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {results.summary.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-red-600">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* データベース統計 */}
                {results.database_stats && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">データベース統計</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">テーブル</th>
                            <th className="text-right p-2">行数</th>
                            <th className="text-right p-2">デッド行</th>
                            <th className="text-left p-2">最終VACUUM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.database_stats.map((stat: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{stat.tablename}</td>
                              <td className="text-right p-2">{stat.row_count}</td>
                              <td className="text-right p-2">{stat.dead_rows}</td>
                              <td className="p-2 text-xs">
                                {stat.last_autovacuum || 'Never'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 環境情報 */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <h3 className="font-bold mb-2">環境情報</h3>
                  <p>Environment: {results.environment}</p>
                  <p>Database URL: {results.database_url}</p>
                  <p>Prisma URL: {results.prisma_url}</p>
                  <p>Timestamp: {results.timestamp}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}