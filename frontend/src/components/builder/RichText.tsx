import React from 'react';

interface RichTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function RichText({ content, className = '', style = {} }: RichTextProps) {
  if (!content) return null;

  let align: 'left' | 'center' | 'right' | 'justify' = 'left';
  let text = content;

  // Extract alignment markers
  if (text.includes('[CENTER]')) {
    align = 'center';
    text = text.replace(/\[CENTER\]/g, '');
  }
  if (text.includes('[LEFT]')) {
    align = 'left';
    text = text.replace(/\[LEFT\]/g, '');
  }
  if (text.includes('[RIGHT]')) {
    align = 'right';
    text = text.replace(/\[RIGHT\]/g, '');
  }

  // Parse basic markdown: bold, italic, underline
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<u>$1</u>');

  return (
    <span
      className={className}
      style={{ display: 'block', textAlign: align, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
