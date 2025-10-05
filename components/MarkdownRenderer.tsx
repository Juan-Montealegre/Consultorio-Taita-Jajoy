import React from 'react';

const processBold = (text: string) => {
  if (!text) return <>{''}</>;
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      )}
    </>
  );
};

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  // Replace sequential newlines to ensure single spacing, then split.
  const lines = text.replace(/\n\s*\n/g, '\n').split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ')) {
          const content = trimmedLine.substring(2);
          return (
            <div key={i} className="flex items-start">
              <span className="mr-2 mt-1 text-secondary">&#8226;</span>
              <span className="flex-1">{processBold(content)}</span>
            </div>
          );
        }
        if (trimmedLine) {
            return <p key={i}>{processBold(trimmedLine)}</p>;
        }
        return null;
      })}
    </div>
  );
};

export default MarkdownRenderer;