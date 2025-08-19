import { useState } from 'react';
import Layout from '@/components/Layout';

type TestResult = {
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  size: number;
  cached: boolean;
  error?: string;
};

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const testEndpoints = [
    { name: 'TOPページデータ', url: '/api/home', method: 'GET' },
    { name: 'TOPページ（軽量版）', url: '/api/home-cached', method: 'GET' },
    { name: '検索API (キーワードなし)', url: '/api/search?page=1&per=8', method: 'GET' },
    { name: '検索API (キーワードあり)', url: '/api/search?keyword=恋&page=1&per=8', method: 'GET' },
    { name: '検索API（軽量版）', url: '/api/search-cached?keyword=恋&page=1&per=8', method: 'GET' },
    { name: 'カテゴリ一覧', url: '/api/categories', method: 'GET' },
    { name: 'カテゴリ一覧（軽量版）', url: '/api/categories-cached', method: 'GET' },
    { name: '作者一覧', url: '/api/authors', method: 'GET' },
    { name: '作者一覧（軽量版）', url: '/api/authors-cached', method: 'GET' },
    { name: '告知一覧', url: '/api/announcements?page=1&limit=10', method: 'GET' },
    { name: 'パフォーマンス診断', url: '/api/debug/performance', method: 'GET' },
  ];

  const testApi = async (name: string, url: string, method: string = 'GET') => {
    const startTime = performance.now();
    const result: TestResult = {
      endpoint: `${name} (${url})`,
      method,
      status: 0,
      duration: 0,
      size: 0,
      cached: false,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const endTime = performance.now();
      result.duration = Math.round(endTime - startTime);
      result.status = response.status;
      
      // キャッシュヒットの確認
      const cacheHeader = response.headers.get('X-Cache');
      result.cached = cacheHeader === 'HIT';

      // レスポンスサイズの取得
      const text = await response.text();
      result.size = new Blob([text]).size;

      if (!response.ok) {
        result.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      const endTime = performance.now();
      result.duration = Math.round(endTime - startTime);
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return result;
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults([]);
    
    const newResults: TestResult[] = [];
    
    for (const endpoint of testEndpoints) {
      const result = await testApi(endpoint.name, endpoint.url, endpoint.method);
      newResults.push(result);
      setResults([...newResults]);
      
      // 少し待機してサーバーに負荷をかけないようにする
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTesting(false);
  };

  const testCustomUrl = async () => {
    if (!customUrl) return;
    
    setTesting(true);
    const result = await testApi('カスタムURL', customUrl);
    setResults(prev => [...prev, result]);
    setTesting(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const getSpeedColor = (duration: number) => {
    if (duration < 200) return 'text-green-600';
    if (duration < 500) return 'text-yellow-600';
    if (duration < 1000) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSpeedLabel = (duration: number) => {
    if (duration < 200) return '高速';
    if (duration < 500) return '普通';
    if (duration < 1000) return '遅い';
    return '非常に遅い';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const averageDuration = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length)
    : 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">API速度テスト</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={runAllTests}
              disabled={testing}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? 'テスト中...' : '全APIをテスト'}
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              結果をクリア
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="/api/... カスタムURLを入力"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={testCustomUrl}
              disabled={testing || !customUrl}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              テスト
            </button>
          </div>

          {results.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold mb-2">統計</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">テスト数:</span>
                  <span className="ml-2 font-bold">{results.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">平均応答時間:</span>
                  <span className={`ml-2 font-bold ${getSpeedColor(averageDuration)}`}>
                    {averageDuration}ms
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">キャッシュヒット率:</span>
                  <span className="ml-2 font-bold">
                    {Math.round((results.filter(r => r.cached).length / results.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">エンドポイント</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">メソッド</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">ステータス</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">応答時間</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">速度</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">サイズ</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">キャッシュ</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">エラー</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{result.endpoint}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {result.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`font-bold ${result.status >= 200 && result.status < 300 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.status || '-'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm text-center font-bold ${getSpeedColor(result.duration)}`}>
                      {result.duration}ms
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        result.duration < 200 ? 'bg-green-100 text-green-700' :
                        result.duration < 500 ? 'bg-yellow-100 text-yellow-700' :
                        result.duration < 1000 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {getSpeedLabel(result.duration)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {formatSize(result.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {result.cached ? (
                        <span className="text-green-600 font-bold">HIT</span>
                      ) : (
                        <span className="text-gray-400">MISS</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600">
                      {result.error || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-3">速度の目安</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">
                <strong>高速:</strong> &lt;200ms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">
                <strong>普通:</strong> 200-500ms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">
                <strong>遅い:</strong> 500-1000ms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">
                <strong>非常に遅い:</strong> &gt;1000ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}