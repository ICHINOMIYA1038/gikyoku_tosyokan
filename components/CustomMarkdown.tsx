import React from 'react';
import { marked } from 'marked';

interface CustomMarkdownProps {
    content: string;
}

const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ content }) => {
    // markedのオプションを設定
    marked.setOptions({
        breaks: true, // 改行を<br>に変換
        gfm: true, // GitHub Flavored Markdownを有効にする
    });

    const htmlContent = marked(content);

    return (
        <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default CustomMarkdown; 