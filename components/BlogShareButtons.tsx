import React, { useState } from 'react';
import { FaLink, FaCheck } from 'react-icons/fa';
import {
  TwitterShareButton,
  LineShareButton,
  TwitterIcon,
  LineIcon,
} from 'react-share';

interface BlogShareButtonsProps {
  url: string;
  title: string;
}

const BlogShareButtons: React.FC<BlogShareButtonsProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const shareTitle = `${title} | 戯曲図書館`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">共有:</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="URLをコピー"
      >
        {copied ? (
          <>
            <FaCheck className="text-green-500" />
            <span>コピーしました</span>
          </>
        ) : (
          <>
            <FaLink />
            <span>URLをコピー</span>
          </>
        )}
      </button>
      <TwitterShareButton url={url} title={shareTitle}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LineShareButton url={url} title={shareTitle}>
        <LineIcon size={32} round />
      </LineShareButton>
    </div>
  );
};

export default BlogShareButtons;
