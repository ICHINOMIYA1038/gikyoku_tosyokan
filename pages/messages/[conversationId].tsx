import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaPaperPlane, FaUser } from 'react-icons/fa';

interface Props {
  conversationId: string;
}

export default function ConversationPage({ conversationId }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [other, setOther] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages/${conversationId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
      setOther(data.other);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // 10秒ごとにポーリング
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !other) return;
    setSending(true);
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: other.id, content: newMessage }),
    });
    if (res.ok) {
      setNewMessage('');
      await fetchMessages();
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <Seo pageTitle={`${other?.name || 'ユーザー'}とのメッセージ`} pageDescription="メッセージ" pagePath={`/messages/${conversationId}`} />
      <div className="container mx-auto px-4 py-4 max-w-3xl flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
        {/* ヘッダー */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <Link href="/messages" className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft />
          </Link>
          {other?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={other.image} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-400" />
            </div>
          )}
          <div>
            <Link href={`/users/${other?.id || ''}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm">
              {other?.name || 'ユーザー'}
            </Link>
          </div>
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theater-primary-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">メッセージを送信してやりとりを始めましょう</p>
          ) : (
            messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.isMine
                    ? 'bg-theater-primary-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  {m.content}
                  <p className={`text-[10px] mt-1 ${m.isMine ? 'text-white/60' : 'text-gray-400'}`}>
                    {new Date(m.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* 入力欄 */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力..."
              rows={1}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
              className={`px-4 rounded-xl transition-colors ${
                sending || !newMessage.trim()
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-theater-primary-600 hover:bg-theater-primary-700 text-white'
              }`}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  return { props: { conversationId: context.params?.conversationId as string } };
};
