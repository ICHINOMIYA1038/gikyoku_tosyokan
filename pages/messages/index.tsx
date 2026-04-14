import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { FEATURES } from '@/lib/feature-flags';
import ComingSoon from '@/components/ComingSoon';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then((data) => { setConversations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!FEATURES.messages) {
    return (
      <Layout>
        <Seo pageTitle="メッセージ" pageDescription="戯曲図書館のメッセージ" pagePath="/messages" />
        <ComingSoon
          title="メッセージ（準備中）"
          description="メッセージ機能は現在準備中です。サービス開始までもうしばらくお待ちください。"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo pageTitle="メッセージ" pageDescription="戯曲図書館のメッセージ" pagePath="/messages" />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaEnvelope className="text-theater-primary-500" />
          メッセージ
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theater-primary-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">メッセージはまだありません</p>
            <p className="text-xs text-gray-400 mt-1">劇団員募集に応募するとメッセージのやりとりが始まります</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
            {conversations.map((c: any) => (
              <Link key={c.id} href={`/messages/${c.id}`} className="block p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {c.other?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.other.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm">{c.other?.name || 'ユーザー'}</p>
                      <p className="text-xs text-gray-400">{new Date(c.lastAt).toLocaleDateString('ja-JP')}</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="bg-theater-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {c.unread}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin?callbackUrl=/messages', permanent: false } };
  }
  return { props: {} };
};
