import React, { useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter,
  Sparkles, ChevronDown, Indent, Outdent, Minus, Type
} from 'lucide-react';

interface RichTextToolbarProps {
  value: string;
  onChange: (newValue: string) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  placeholderAction?: string;
  showWordCount?: boolean;
}

const ATS_SUGGESTIONS = [
  {
    category: 'Leadership & Impact',
    sentences: [
      'Spearheaded the development and launch of a multi-tenant cloud platform, driving $1.2M in annual recurring revenue.',
      'Led a cross-functional team of 14 engineers to deliver a scalable architecture, reducing deployment times by 40%.',
      'Orchestrated a comprehensive corporate rebrand across 18 international markets, driving a 140% surge in brand awareness.',
    ],
  },
  {
    category: 'Engineering & Performance',
    sentences: [
      'Architected high-concurrency microservices scaling to over 18 million active daily users with sub-85ms latency.',
      'Optimized database queries and indexing strategies, reducing query latency by 310% under high concurrent load.',
      'Implemented robust CI/CD pipelines using GitHub Actions, decreasing median deployment time from hours to minutes.',
    ],
  },
  {
    category: 'Data & Analytics',
    sentences: [
      'Engineered real-time data pipelines processing over 1.2 terabytes of metadata daily without system degradation.',
      'Leveraged predictive modeling and machine learning to improve customer retention rates by 15% year-over-year.',
      'Built automated dashboards tracking KPIs across 12 business units, reducing manual reporting time by 85%.',
    ],
  },
  {
    category: 'Product & Growth',
    sentences: [
      'Engineered a product-led growth onboarding funnel that increased free-to-paid conversion rates from 3.2% to 8.7%.',
      'Collaborated closely with product and design to map out user journeys, resulting in a 25% increase in engagement.',
      'Drove the go-to-market strategy for flagship products, generating $28M in incremental Annual Recurring Revenue.',
    ],
  },
];

export function RichTextToolbar({ value, onChange, inputRef, showWordCount = true }: RichTextToolbarProps) {
  const [showPhrases, setShowPhrases] = useState(false);

  // Count words
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const getSelection = useCallback(() => {
    const el = inputRef?.current;
    if (!el || typeof el.selectionStart !== 'number') return null;
    return {
      el,
      start: el.selectionStart,
      end: typeof el.selectionEnd === 'number' ? el.selectionEnd : el.selectionStart,
    };
  }, [inputRef]);

  const applyInline = useCallback((prefix: string, suffix: string = '') => {
    const sel = getSelection();
    if (sel) {
      const { el, start, end } = sel;
      const selected = value.substring(start, end);
      const replacement = selected
        ? `${prefix}${selected}${suffix}`
        : `${prefix}text${suffix}`;
      const next = value.substring(0, start) + replacement + value.substring(end);
      onChange(next);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
      }, 0);
    } else {
      onChange(`${value ? value + ' ' : ''}${prefix}text${suffix}`);
    }
  }, [value, onChange, getSelection]);

  const applyLinePrefix = useCallback((prefixChar: string) => {
    const sel = getSelection();
    if (sel && sel.start !== sel.end) {
      const { start, end } = sel;
      const before = value.substring(0, start);
      const selected = value.substring(start, end);
      const after = value.substring(end);
      const modified = selected
        .split('\n')
        .map((line) => (line.startsWith(prefixChar) ? line.substring(prefixChar.length) : `${prefixChar}${line}`))
        .join('\n');
      onChange(before + modified + after);
    } else {
      const lines = value.split('\n');
      if (!value) {
        onChange(prefixChar);
        return;
      }
      const last = lines.length - 1;
      lines[last] = lines[last].startsWith(prefixChar)
        ? lines[last].substring(prefixChar.length)
        : `${prefixChar}${lines[last]}`;
      onChange(lines.join('\n'));
    }
  }, [value, onChange, getSelection]);

  const applyIndent = useCallback((direction: 'in' | 'out') => {
    const indent = '    '; // 4 spaces
    const sel = getSelection();
    if (sel && sel.start !== sel.end) {
      const { start, end } = sel;
      const before = value.substring(0, start);
      const selected = value.substring(start, end);
      const after = value.substring(end);
      const modified = selected
        .split('\n')
        .map((line) => direction === 'in' ? `${indent}${line}` : line.startsWith(indent) ? line.substring(indent.length) : line)
        .join('\n');
      onChange(before + modified + after);
    } else {
      const lines = value.split('\n');
      const last = lines.length - 1;
      lines[last] = direction === 'in'
        ? `${indent}${lines[last]}`
        : lines[last].startsWith(indent) ? lines[last].substring(indent.length) : lines[last];
      onChange(lines.join('\n'));
    }
  }, [value, onChange, getSelection]);

  const insertHorizontalRule = useCallback(() => {
    const sel = getSelection();
    const rule = '\n─────────────────────\n';
    if (sel) {
      const { start, end } = sel;
      onChange(value.substring(0, start) + rule + value.substring(end));
    } else {
      onChange(value + rule);
    }
  }, [value, onChange, getSelection]);

  const clearFormatting = useCallback(() => {
    const cleaned = value
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/^[•✓›\-]\s/gm, '')
      .replace(/^\d+\.\s/gm, '')
      .replace(/^    /gm, '');
    onChange(cleaned);
  }, [value, onChange]);

  const insertPhrase = useCallback((phrase: string) => {
    const sel = getSelection();
    if (sel) {
      const { el, start, end } = sel;
      const next = value.substring(0, start) + phrase + value.substring(end);
      onChange(next);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + phrase.length, start + phrase.length);
      }, 0);
    } else {
      const sep = value && !value.endsWith(' ') && !value.endsWith('\n') ? ' ' : '';
      onChange(`${value}${sep}${phrase}`);
    }
    setShowPhrases(false);
  }, [value, onChange, getSelection]);

  const ToolButton = ({ onClick, title, children, active = false }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active 
          ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-700'
      }`}
    >
      {children}
    </button>
  );

  const Separator = () => (
    <div className="h-4 w-px mx-0.5" style={{ backgroundColor: '#DDD4BF' }} />
  );

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="rounded-t-lg overflow-hidden border border-gray-200 dark:border-surface-800 border-b-0 bg-white dark:bg-surface-900"
    >
      {/* ── Toggle Header ────────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${isExpanded ? 'bg-gray-50 dark:bg-surface-800' : 'hover:bg-gray-50 dark:hover:bg-surface-800'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <Type size={14} className="text-brand-500" />
          MS Word Tools
          <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        {showWordCount && (
          <div className="text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </div>
        )}
      </div>

      {/* ── Toolbar Content ──────────────────────────────────────────── */}
      {isExpanded && (
        <div
          className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 animate-in slide-in-from-top-1 bg-gray-50 dark:bg-surface-800 border-t border-gray-200 dark:border-surface-700"
        >
          {/* ── Text Formatting Group ──────────────────────────────────── */}
          <div className="flex items-center gap-0.5">
            <ToolButton onClick={() => applyInline('**', '**')} title="Bold (**text**)">
              <Bold size={13} />
            </ToolButton>
            <ToolButton onClick={() => applyInline('*', '*')} title="Italic (*text*)">
              <Italic size={13} />
            </ToolButton>
            <ToolButton onClick={() => applyInline('__', '__')} title="Underline (__text__)">
              <Underline size={13} />
            </ToolButton>
          </div>

          <Separator />

          {/* ── Lists Group ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">
            <ToolButton onClick={() => applyLinePrefix('• ')} title="Bullet list (•)">
              <List size={13} />
            </ToolButton>
            <ToolButton onClick={() => applyLinePrefix('1. ')} title="Numbered list (1.)">
              <ListOrdered size={13} />
            </ToolButton>
            <ToolButton onClick={() => applyLinePrefix('✓ ')} title="Checkmark (✓)">
              <span style={{ fontSize: '12px', fontWeight: 700 }}>✓</span>
            </ToolButton>
          </div>

          <Separator />

          {/* ── Indent Group ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">
            <ToolButton onClick={() => applyIndent('out')} title="Shift Content Left (Outdent)">
              <Outdent size={13} />
            </ToolButton>
            <ToolButton onClick={() => applyIndent('in')} title="Shift Content Right (Indent)">
              <Indent size={13} />
            </ToolButton>
          </div>

          <Separator />

          {/* ── Alignment Shortcuts ──────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">
            <ToolButton onClick={() => applyInline('[LEFT]')} title="Align Left">
              <AlignLeft size={13} />
            </ToolButton>
            <ToolButton onClick={() => applyInline('[CENTER]')} title="Align Center">
              <AlignCenter size={13} />
            </ToolButton>
          </div>

          <Separator />

          {/* ── Extra Tools ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">
            <ToolButton onClick={insertHorizontalRule} title="Add Line (Horizontal Rule)">
              <Minus size={13} />
            </ToolButton>
            <ToolButton onClick={clearFormatting} title="Clear all formatting">
              <Type size={13} />
            </ToolButton>
          </div>

          <Separator />

          {/* ── ATS Phrases Dropdown ─────────────────────────────────────── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPhrases(!showPhrases)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors border ${
                showPhrases 
                  ? 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/20 dark:text-brand-400 dark:border-brand-500/30' 
                  : 'bg-white text-brand-500 border-brand-100 hover:bg-brand-50 dark:bg-surface-900 dark:text-brand-400 dark:border-surface-700 dark:hover:bg-surface-800'
              }`}
              title="Insert powerful ATS action phrase"
            >
              <Sparkles size={12} />
              <span className="hidden sm:inline">Quick Phrases</span>
              <ChevronDown size={11} className={`transition-transform ${showPhrases ? 'rotate-180' : ''}`} />
            </button>

            {showPhrases && (
              <div
                className="absolute left-0 top-full mt-1 z-50 rounded-xl shadow-xl py-2 max-h-72 overflow-y-auto bg-white dark:bg-surface-900 border border-gray-100 dark:border-surface-700"
                style={{ width: '340px' }}
              >
                {ATS_SUGGESTIONS.map((group) => (
                  <div key={group.category} className="mb-1 last:mb-0">
                    <div
                      className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-gray-50 dark:bg-surface-800 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-surface-700"
                    >
                      {group.category}
                    </div>
                    {group.sentences.map((phrase) => (
                      <button
                        key={phrase}
                        type="button"
                        onClick={() => insertPhrase(phrase)}
                        className="w-full text-left px-3 py-2 text-xs transition-colors text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-surface-800/50 hover:bg-brand-50 dark:hover:bg-brand-500/10"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
