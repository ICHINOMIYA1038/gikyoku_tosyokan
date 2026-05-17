import React from 'react';
import { FaInfoCircle, FaLightbulb, FaExclamationTriangle, FaQuoteLeft } from 'react-icons/fa';

export type CalloutType = 'info' | 'tip' | 'warn' | 'quote';

interface Props {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const STYLES: Record<CalloutType, { bg: string; border: string; icon: React.ReactNode; label: string; title: string }> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    icon: <FaInfoCircle className="text-blue-500" />,
    label: 'text-blue-700',
    title: 'POINT',
  },
  tip: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    icon: <FaLightbulb className="text-amber-500" />,
    label: 'text-amber-700',
    title: 'TIP',
  },
  warn: {
    bg: 'bg-rose-50',
    border: 'border-rose-400',
    icon: <FaExclamationTriangle className="text-rose-500" />,
    label: 'text-rose-700',
    title: '注意',
  },
  quote: {
    bg: 'bg-gray-50',
    border: 'border-gray-400',
    icon: <FaQuoteLeft className="text-gray-500" />,
    label: 'text-gray-700',
    title: 'QUOTE',
  },
};

const BlogCallout: React.FC<Props> = ({ type, title, children }) => {
  const s = STYLES[type];
  return (
    <div className={`my-7 rounded-r-lg border-l-4 ${s.border} ${s.bg} px-5 py-4`}>
      <div className={`flex items-center gap-2 mb-2 text-xs font-bold tracking-wider ${s.label}`}>
        <span className="text-base">{s.icon}</span>
        <span>{title || s.title}</span>
      </div>
      <div className="text-gray-700 leading-relaxed [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
};

export default BlogCallout;
