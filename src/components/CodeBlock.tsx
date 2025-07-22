'use client';

import { useState } from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { CodeBlockProps } from '@/types/services';

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {title && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <span className="text-xs text-gray-500 uppercase font-mono">
            {language}
          </span>
        </div>
      )}

      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={copyToClipboard}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              copied
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {copied ? '복사됨!' : '복사'}
          </button>
        </div>

        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            borderRadius: 0,
            background: '#1e1e1e',
          }}
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
