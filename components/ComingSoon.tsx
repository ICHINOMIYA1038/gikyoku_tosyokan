import React from 'react';
import Link from 'next/link';
import { FaTools, FaArrowLeft } from 'react-icons/fa';

interface ComingSoonProps {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'この機能は準備中です',
  description = '現在、サービス開始に向けて準備を進めております。もうしばらくお待ちください。',
  backHref = '/',
  backLabel = 'トップページに戻る',
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-theater-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTools className="text-3xl text-theater-primary-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{description}</p>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-theater-primary-600 hover:bg-theater-primary-50 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          {backLabel}
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
