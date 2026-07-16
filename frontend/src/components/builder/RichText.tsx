import React from 'react';

interface RichTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function parseTagsToHtml(content: string): string {
  if (!content) return '';

  let text = content;

  // Extract alignment markers
  if (text.includes('[CENTER]')) text = text.replace(/\[CENTER\]/g, '');
  if (text.includes('[LEFT]')) text = text.replace(/\[LEFT\]/g, '');
  if (text.includes('[RIGHT]')) text = text.replace(/\[RIGHT\]/g, '');
  if (text.includes('[JUSTIFY]')) text = text.replace(/\[JUSTIFY\]/g, '');

  // Extract line spacing markers
  text = text.replace(/\[SPACING:[0-9.]+\]/g, '');

  // Clean any nested/duplicate tags before parsing
  text = text
    .replace(/(?:\[SIZE:[^\]]+\])+/g, (match) => {
      const all = match.match(/\[SIZE:([^\]]+)\]/g);
      return all && all.length > 0 ? all[all.length - 1] : match;
    })
    .replace(/(?:\[\/SIZE\])+/g, '[/SIZE]')
    .replace(/(?:\[COLOR:[^\]]+\])+/g, (match) => {
      const all = match.match(/\[COLOR:([^\]]+)\]/g);
      return all && all.length > 0 ? all[all.length - 1] : match;
    })
    .replace(/(?:\[\/COLOR\])+/g, '[/COLOR]')
    .replace(/(?:\[FONT:[^\]]+\])+/g, (match) => {
      const all = match.match(/\[FONT:([^\]]+)\]/g);
      return all && all.length > 0 ? all[all.length - 1] : match;
    })
    .replace(/(?:\[\/FONT\])+/g, '[/FONT]')
    .replace(/(?:\[HL:[^\]]+\])+/g, (match) => {
      const all = match.match(/\[HL:([^\]]+)\]/g);
      return all && all.length > 0 ? all[all.length - 1] : match;
    })
    .replace(/(?:\[\/HL\])+/g, '[/HL]');

  // Parse MS Word formatting tags repeatedly until balanced pairs are parsed
  let prevHtml = '';
  let html = text;
  let iterations = 0;
  while (html !== prevHtml && iterations < 5) {
    prevHtml = html;
    html = html
      // Headings
      .replace(/^### (.*$)/gm, '<div style="font-size: 1.15em; font-weight: 700; margin-top: 4px; margin-bottom: 2px;">$1</div>')
      .replace(/^## (.*$)/gm, '<div style="font-size: 1.25em; font-weight: 800; margin-top: 6px; margin-bottom: 3px;">$1</div>')
      // Horizontal Rule Divider Line
      .replace(/\[HR\]/g, '<hr style="border: none; border-top: 1.5px solid #cbd5e1; margin: 8px 0; width: 100%; opacity: 0.85;" />')
      .replace(/^[─-]{3,}$/gm, '<hr style="border: none; border-top: 1.5px solid #cbd5e1; margin: 8px 0; width: 100%; opacity: 0.85;" />')
      // Font Color
      .replace(/\[COLOR:([^\]]+)\](.*?)\[\/COLOR\]/gs, '<span style="color: $1;">$2</span>')
      // Highlight
      .replace(/\[HL:([^\]]+)\](.*?)\[\/HL\]/gs, '<mark style="background-color: $1; padding: 0 2px; border-radius: 2px;">$2</mark>')
      // Font Size
      .replace(/\[SIZE:([^\]]+)\](.*?)\[\/SIZE\]/gs, '<span style="font-size: $1;">$2</span>')
      // Font Family
      .replace(/\[FONT:([^\]]+)\](.*?)\[\/FONT\]/gs, '<span style="font-family: $1, sans-serif;">$2</span>')
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // Subscript & Superscript
      .replace(/~([^~\s]+)~/g, '<sub>$1</sub>')
      .replace(/\^([^\^\s]+)\^/g, '<sup>$1</sup>')
      // Bold, Italic, Underline
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>');
    iterations++;
  }

  // Final cleanup: strip any residual unclosed/malformed tags so they never show as raw text
  html = html.replace(/\[\/?(?:SIZE|COLOR|FONT|HL|SPACING|LEFT|CENTER|RIGHT|JUSTIFY|HR)[^\]]*\]/g, '');

  // Convert bullet point text lines (• or - at start of lines) into clean <ul><li> lists when not already HTML lists
  if (!html.includes('<ul') && !html.includes('<ol') && (html.includes('•') || /^\s*[\-\*]\s+/m.test(html))) {
    const lines = html.split('\n');
    let inList = false;
    let newHtml = '';
    for (const line of lines) {
      const trimmed = line.trim();
      const isBullet = /^[•\-–—*]\s+/.test(trimmed) || trimmed.startsWith('•');
      if (isBullet) {
        if (!inList) {
          newHtml += '<ul style="list-style-type: disc; padding-left: 20px; margin: 4px 0;">';
          inList = true;
        }
        const cleanContent = trimmed.replace(/^[•\-–—*]\s*/, '');
        newHtml += `<li style="margin-bottom: 4px;">${cleanContent}</li>`;
      } else {
        if (inList) {
          newHtml += '</ul>';
          inList = false;
        }
        if (trimmed) {
          newHtml += line + '\n';
        }
      }
    }
    if (inList) {
      newHtml += '</ul>';
    }
    html = newHtml.trim();
  }

  return html;
}

export function RichText({ content, className = '', style = {} }: RichTextProps) {
  if (!content) return null;

  let align: 'left' | 'center' | 'right' | 'justify' = 'left';
  let lineSpacing = '1.4';
  let text = content;

  // Extract alignment markers
  if (text.includes('[CENTER]')) {
    align = 'center';
  }
  if (text.includes('[LEFT]')) {
    align = 'left';
  }
  if (text.includes('[RIGHT]')) {
    align = 'right';
  }
  if (text.includes('[JUSTIFY]')) {
    align = 'justify';
  }

  // Extract line spacing markers
  const spacingMatch = text.match(/\[SPACING:([0-9.]+)\]/);
  if (spacingMatch) {
    lineSpacing = spacingMatch[1];
  }

  const html = parseTagsToHtml(content);

  return (
    <span
      className={className}
      style={{
        display: 'block',
        textAlign: align,
        lineHeight: lineSpacing,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
