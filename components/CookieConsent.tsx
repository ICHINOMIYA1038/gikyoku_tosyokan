import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getConsent, setConsent } from '@/lib/cookie-consent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setConsent('accepted');
    setVisible(false);
    window.location.reload();
  };

  const handleReject = () => {
    setConsent('rejected');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 text-sm text-gray-700">
            <p className="font-medium text-gray-900 mb-1">Cookieの使用について</p>
            <p className="text-xs text-gray-600">
              当サイトでは、サイト分析のためにGoogle Analytics、広告配信のためにGoogle AdSenseを使用しています。
              これらのサービスはCookieを使用して閲覧情報をGoogle LLCに送信します。
              詳しくは
              <Link href="/support/privacy-policy" className="text-blue-600 hover:underline mx-0.5">
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              拒否する
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-theater-primary-600 hover:bg-theater-primary-700 rounded-lg transition-colors"
            >
              同意する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
