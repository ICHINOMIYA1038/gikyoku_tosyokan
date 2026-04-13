import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FaArrowLeft, FaPaperPlane, FaUser, FaCheckDouble } from 'react-icons/fa';

interface Props {
  conversationId: string;
}

export default function ConversationPage({ conversationId }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [other, setOther] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setOther(data.other);
      }
    } catch {}
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!newMessage.trim() || !other || sending) return;
    const content = newMessage.trim();
    setSending(true);
    setNewMessage('');

    // 楽観的更新
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      content,
      isMine: true,
      createdAt: new Date().toISOString(),
      sending: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: other.id, content }),
      });
      if (res.ok) {
        await fetchMessages();
      } else {
        // 失敗時はロールバック
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        setNewMessage(content);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setNewMessage(content);
    }
    setSending(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <Seo pageTitle={`${other?.name || ''}とのメッセージ`} pageDescription="メッセージ" pagePath={`/messages/${conversationId}`} />
      <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        {/* ヘッダー */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
          <Link href="/messages" className="text-gray-500 hover:text-gray-700 p-1">
            <FaArrowLeft />
          </Link>
          {other?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={other.image} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-theater-primary-100 flex items-center justify-center">
              <FaUser className="text-theater-primary-400" />
            </div>
          )}
          <Link href={`/users/${other?.id || ''}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm">
            {other?.name || 'ユーザー'}
          </Link>
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theater-primary-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-theater-primary-100 rounded-full flex items-center justify-center mb-4">
                <FaPaperPlane className="text-theater-primary-400 text-xl" />
              </div>
              <p className="text-gray-500 text-sm">メッセージを送信してやりとりを始めましょう</p>
            </div>
          ) : (
            <>
              {messages.map((m: any, i: number) => {
                // 日付区切り
                const showDate = i === 0 || new Date(m.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString();
                return (
                  <div key={m.id}>
                    {showDate && (
                      <div className="flex justify-center my-3">
                        <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                          {new Date(m.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${m.isMine ? 'order-2' : ''}`}>
                        <div className={`px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                          m.isMine
                            ? 'bg-theater-primary-600 text-white rounded-2xl rounded-br-md'
                            : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                        } ${m.sending ? 'opacity-60' : ''}`}>
                          {m.content}
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${m.isMine ? 'justify-end' : ''}`}>
                          <span className="text-[10px] text-gray-400">{formatTime(m.createdAt)}</span>
                          {m.isMine && m.readAt && <FaCheckDouble className="text-[10px] text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* 入力欄 */}
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                // auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力... (Enterで送信)"
              rows={1}
              maxLength={2000}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200 focus:border-theater-primary-400 resize-none leading-relaxed"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                sending || !newMessage.trim()
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-theater-primary-600 hover:bg-theater-primary-700 text-white'
              }`}
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 text-right">Shift+Enterで改行</p>
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
