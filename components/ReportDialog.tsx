import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaFlag, FaTimes } from 'react-icons/fa';

const REASONS = [
  'スパム・宣伝',
  '誹謗中傷・差別',
  '個人情報の露出',
  '著作権侵害',
  '不適切なコンテンツ',
  'なりすまし',
  'その他',
];

interface ReportDialogProps {
  targetType: 'comment' | 'announcement' | 'user';
  targetId: string | number;
  targetUrl?: string;
  onClose: () => void;
}

const ReportDialog: React.FC<ReportDialogProps> = ({ targetType, targetId, targetUrl, onClose }) => {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  if (!session) return null;

  const handleSubmit = async () => {
    if (!reason) return;
    setSending(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          details,
          targetType,
          targetId: String(targetId),
          targetUrl: targetUrl || window.location.href,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: '通報を受け付けました。ご協力ありがとうございます。' });
        setTimeout(onClose, 2000);
      } else {
        setResult({ ok: false, message: data.error || '通報に失敗しました' });
      }
    } catch {
      setResult({ ok: false, message: '通信エラーが発生しました' });
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FaFlag className="text-red-500" />
            コンテンツを通報
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <FaTimes />
          </button>
        </div>

        {result ? (
          <div className={`p-4 rounded-lg text-sm ${result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.message}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">通報の理由を選択してください</p>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">詳細（任意）</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="具体的な内容があればお書きください"
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-y"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason || sending}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  reason && !sending
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {sending ? '送信中...' : '通報する'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportDialog;
