import React, { useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Sparkles, ChevronDown, Indent, Outdent, Minus, Type, Strikethrough, Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon, Paintbrush, Palette, Highlighter, Heading1, Heading2,
  Check, ArrowUpRight, ArrowDownRight, CornerDownLeft
} from 'lucide-react';
import { FONT_OPTIONS } from '../../utils/defaults';

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

const PRESET_COLORS = [
  { label: 'Crimson Red', hex: '#ef4444' },
  { label: 'Royal Blue', hex: '#2563eb' },
  { label: 'Emerald Green', hex: '#10b981' },
  { label: 'Executive Navy', hex: '#1e3a8a' },
  { label: 'Amber Gold', hex: '#d97706' },
  { label: 'Amethyst Purple', hex: '#8b5cf6' },
  { label: 'Obsidian Dark', hex: '#1f2937' },
];

const PRESET_HIGHLIGHTS = [
  { label: 'Yellow Gold', hex: '#fef08a' },
  { label: 'Mint Green', hex: '#bbf7d0' },
  { label: 'Sky Blue', hex: '#bfdbfe' },
  { label: 'Rose Pink', hex: '#fbcfe8' },
];

export function RichTextToolbar({ value, onChange, inputRef, showWordCount = true }: RichTextToolbarProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout' | 'styles' | 'phrases'>('home');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showSpacingPicker, setShowSpacingPicker] = useState(false);
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

  const applyInline = useCallback((prefix: string, suffix: string = '', tagType?: 'SIZE' | 'FONT' | 'COLOR' | 'HL') => {
    const sel = getSelection();
    let target = value;
    let start = 0;
    let end = value.length;

    if (sel && sel.start !== sel.end) {
      target = value.substring(sel.start, sel.end);
      start = sel.start;
      end = sel.end;
    } else if (suffix !== '') {
      target = value || 'Text';
      start = 0;
      end = value.length;
    } else {
      target = value;
      start = 0;
      end = value.length;
    }

    let cleaned = target;
    if (tagType === 'SIZE' || prefix.startsWith('[SIZE:')) {
      cleaned = cleaned.replace(/\[SIZE:[^\]]+\]/g, '').replace(/\[\/SIZE\]/g, '');
    } else if (tagType === 'FONT' || prefix.startsWith('[FONT:')) {
      cleaned = cleaned.replace(/\[FONT:[^\]]+\]/g, '').replace(/\[\/FONT\]/g, '');
    } else if (tagType === 'COLOR' || prefix.startsWith('[COLOR:')) {
      cleaned = cleaned.replace(/\[COLOR:[^\]]+\]/g, '').replace(/\[\/COLOR\]/g, '');
    } else if (tagType === 'HL' || prefix.startsWith('[HL:')) {
      cleaned = cleaned.replace(/\[HL:[^\]]+\]/g, '').replace(/\[\/HL\]/g, '');
    } else if (prefix === '**' && suffix === '**') {
      cleaned = cleaned.replace(/\*\*/g, '');
    } else if (prefix === '*' && suffix === '*') {
      cleaned = cleaned.replace(/\*/g, '');
    } else if (prefix === '__' && suffix === '__') {
      cleaned = cleaned.replace(/__/g, '');
    } else if (suffix === '') {
      if (prefix.startsWith('[SPACING:')) {
        cleaned = cleaned.replace(/\[SPACING:[^\]]+\]/g, '');
      } else if (['[LEFT]', '[CENTER]', '[RIGHT]', '[JUSTIFY]'].includes(prefix)) {
        cleaned = cleaned.replace(/\[LEFT\]|\[CENTER\]|\[RIGHT\]|\[JUSTIFY\]/g, '');
      }
    }

    const replacement = `${prefix}${cleaned}${suffix}`;
    const next = value.substring(0, start) + replacement + value.substring(end);
    onChange(next);
  }, [value, onChange, getSelection]);

  const changeFontSize = useCallback((direction: 'up' | 'down') => {
    const SIZES = ['10px', '11px', '12px', '13px', '14px', '15px', '16px', '18px', '20px', '24px'];
    const sel = getSelection();
    let target = value || 'Text';
    let start = 0;
    let end = value.length;

    if (sel && sel.start !== sel.end) {
      target = value.substring(sel.start, sel.end);
      start = sel.start;
      end = sel.end;
    }

    const match = target.match(/\[SIZE:([0-9]+px)\]/);
    const currentSize = match ? match[1] : '13px';
    let idx = SIZES.indexOf(currentSize);
    if (idx === -1) idx = 3;

    if (direction === 'up' && idx < SIZES.length - 1) {
      idx++;
    } else if (direction === 'down' && idx > 0) {
      idx--;
    }

    const newSize = SIZES[idx];
    const cleaned = target.replace(/\[SIZE:[^\]]+\]/g, '').replace(/\[\/SIZE\]/g, '');
    const replacement = `[SIZE:${newSize}]${cleaned}[/SIZE]`;
    const next = value.substring(0, start) + replacement + value.substring(end);
    onChange(next);
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
    if (sel) {
      const { start, end } = sel;
      const prevChar = start > 0 ? value[start - 1] : '\n';
      const prefix = prevChar === '\n' ? '[HR]\n' : '\n[HR]\n';
      onChange(value.substring(0, start) + prefix + value.substring(end));
    } else {
      const prevChar = value.length > 0 ? value[value.length - 1] : '\n';
      const prefix = prevChar === '\n' ? '[HR]\n' : '\n[HR]\n';
      onChange(value + prefix);
    }
  }, [value, onChange, getSelection]);

  const clearFormatting = useCallback(() => {
    const cleaned = value
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/\[COLOR:.*?\](.*?)\[\/COLOR\]/gs, '$1')
      .replace(/\[HL:.*?\](.*?)\[\/HL\]/gs, '$1')
      .replace(/\[SIZE:.*?\](.*?)\[\/SIZE\]/gs, '$1')
      .replace(/\[FONT:.*?\](.*?)\[\/FONT\]/gs, '$1')
      .replace(/\[LEFT\]|\[CENTER\]|\[RIGHT\]|\[JUSTIFY\]/g, '')
      .replace(/\[SPACING:.*?\]/g, '')
      .replace(/^[•✓›\-]\s/gm, '')
      .replace(/^\d+\.\s/gm, '')
      .replace(/^###\s|^##\s/gm, '')
      .replace(/^    /gm, '');
    onChange(cleaned);
  }, [value, onChange]);

  const insertPhrase = useCallback((phrase: string) => {
    const sel = getSelection();
    if (sel && sel.start !== sel.end) {
      const { el, start, end } = sel;
      const next = value.substring(0, start) + phrase + value.substring(end);
      onChange(next);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + phrase.length, start + phrase.length);
      }, 0);
    } else {
      if (value && (value.includes('•') || value.includes('\n'))) {
        const lines = value.split('\n').filter(Boolean);
        const lastLine = lines[lines.length - 1] || '';
        if (lastLine.trim() === '•' || lastLine.trim() === '') {
          lines[lines.length - 1] = `• ${phrase}`;
        } else {
          lines.push(`• ${phrase}`);
        }
        onChange(lines.join('\n'));
      } else if (!value || !value.trim()) {
        onChange(phrase);
      } else {
        const sep = !value.endsWith(' ') && !value.endsWith('\n') ? ' \n\n' : '';
        onChange(`${value}${sep}${phrase}`);
      }
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
      className={`relative group overflow-hidden p-1.5 rounded-lg transition-all duration-200 ease-out transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center shrink-0 ${
        active 
          ? 'bg-brand-500 text-white shadow-md scale-105' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-700 hover:shadow-xs before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-brand-500 before:scale-x-0 group-hover:before:scale-x-100 before:transition-transform before:duration-200 before:origin-left'
      }`}
    >
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </button>
  );

  const Separator = () => (
    <div className="h-4 w-px mx-1 flex-shrink-0 bg-gray-300 dark:bg-surface-700" />
  );

  return (
    <div className="bg-gray-50 dark:bg-surface-900 border border-gray-200 dark:border-surface-800 rounded-t-lg select-none relative z-20 shadow-sm">
      {/* ── MS Word Top Ribbon Header ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 border-b border-gray-200 dark:border-surface-800 bg-gray-100 dark:bg-surface-950">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 min-w-[260px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-500 text-white text-[11px] font-bold tracking-wider mr-1 shadow-sm shrink-0">
            <Type size={12} />
            <span>WORD</span>
          </div>
          {(['home', 'insert', 'layout', 'styles', 'phrases'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setIsExpanded(true);
                if (tab === 'phrases') setShowPhrases(true);
                else setShowPhrases(false);
              }}
              className={`relative overflow-hidden px-2.5 py-1 rounded-t text-xs font-semibold capitalize transition-all duration-200 ease-out transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                activeTab === tab && isExpanded
                  ? 'bg-white dark:bg-surface-900 text-brand-600 dark:text-brand-400 border-t-2 border-brand-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-surface-800 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-brand-400 before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-200 before:origin-left'
              }`}
            >
              {tab === 'phrases' ? '✨ Quick Phrases' : tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => {
              const next = !showPhrases;
              setShowPhrases(next);
              if (next) setActiveTab('phrases');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-sm border ${
              showPhrases
                ? 'bg-brand-600 text-white border-brand-700 shadow-brand-500/30'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
            }`}
            title="Toggle AI Suggestion Box"
          >
            <Sparkles size={13} className="animate-pulse text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="hidden sm:inline">AI Suggestion Box</span>
            <span className="sm:hidden">AI Suggestions</span>
          </button>
          {showWordCount && (
            <span className="text-[10px] font-mono uppercase font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-surface-800 px-2 py-0.5 rounded border border-gray-200 dark:border-surface-700 shrink-0">
              {wordCount} words
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-surface-800 shrink-0"
            title={isExpanded ? 'Collapse Ribbon' : 'Expand Ribbon'}
          >
            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Floating AI Suggestion Box Overlay ────────────────────────────── */}
      {showPhrases && (
        <div className="p-3 bg-gradient-to-br from-amber-50/90 via-white to-brand-50/80 dark:from-surface-900 dark:via-surface-900 dark:to-brand-950/50 border-b-2 border-brand-500 animate-fade-in z-[100] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-start gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 min-w-0">
              <Sparkles size={14} className="shrink-0 mt-0.5" />
              <span className="leading-tight text-balance">AI Suggestion Box — Click any phrase to insert directly into your text box:</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPhrases(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold px-2 py-0.5 rounded hover:bg-gray-200/50 shrink-0 self-end sm:self-auto"
            >
              Close ✕
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
            {ATS_SUGGESTIONS.map((group) => (
              <div key={group.category} className="bg-white/90 dark:bg-surface-800/90 rounded-lg p-2 border border-brand-200/60 dark:border-surface-700 shadow-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1 px-1 flex items-center gap-1">
                  <span>⚡</span> {group.category}
                </div>
                <div className="space-y-1">
                  {group.sentences.map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => insertPhrase(phrase)}
                      className="w-full text-left p-1.5 text-xs rounded hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 text-gray-700 dark:text-gray-300 transition-colors border border-transparent hover:border-brand-600 flex items-start gap-1.5 group font-medium"
                    >
                      <span className="text-brand-500 group-hover:text-white mt-0.5 font-bold">•</span>
                      <span>{phrase}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab Panels Content ────────────────────────────────────────────── */}
      {isExpanded && !showPhrases && (
        <div key={activeTab} className="p-1.5 flex items-center overflow-x-auto no-scrollbar flex-nowrap md:flex-wrap gap-1 bg-gray-50/80 dark:bg-surface-900/90 text-xs border-b border-gray-100 dark:border-surface-800 animate-slide-down transition-all duration-200">
          {/* ── HOME TAB: Font, Size, Inline Formatting, Color, Alignment ───── */}
          {activeTab === 'home' && (
            <div className="flex items-center flex-nowrap md:flex-wrap gap-1 shrink-0">
              {/* Font Family Selector */}
              <select
                onChange={(e) => applyInline(`[FONT:${e.target.value}]`, '[/FONT]', 'FONT')}
                className="text-xs bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded px-1.5 py-1 text-gray-800 dark:text-gray-200 cursor-pointer max-w-[110px] truncate font-medium shrink-0"
                defaultValue="Calibri"
                title="Font Family"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>{f.id}</option>
                ))}
              </select>

              {/* Font Size Selector */}
              <select
                onChange={(e) => applyInline(`[SIZE:${e.target.value}]`, '[/SIZE]', 'SIZE')}
                className="text-xs bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded px-1 py-1 text-gray-800 dark:text-gray-200 cursor-pointer w-[60px] font-mono shrink-0"
                defaultValue="13px"
                title="Font Size"
              >
                {['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px'].map((sz) => (
                  <option key={sz} value={sz}>{sz.replace('px', '')}</option>
                ))}
              </select>

              <ToolButton onClick={() => changeFontSize('up')} title="Increase Font Size (A+)">
                <span className="font-bold text-[13px]">A⁺</span>
              </ToolButton>
              <ToolButton onClick={() => changeFontSize('down')} title="Decrease Font Size (A-)">
                <span className="font-bold text-[11px]">A⁻</span>
              </ToolButton>

              <Separator />

              {/* Inline Styles */}
              <div className="flex items-center gap-0.5 shrink-0">
                <ToolButton onClick={() => applyInline('**', '**')} title="Bold (**text**)">
                  <Bold size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('*', '*')} title="Italic (*text*)">
                  <Italic size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('__', '__')} title="Underline (__text__)">
                  <Underline size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('~~', '~~')} title="Strikethrough (~~text~~)">
                  <Strikethrough size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('~', '~')} title="Subscript (~sub~)">
                  <SubscriptIcon size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('^', '^')} title="Superscript (^sup^)">
                  <SuperscriptIcon size={14} />
                </ToolButton>
              </div>

              <Separator />

              {/* Font Color Picker Dropdown */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
                  className="p-1 rounded flex items-center gap-0.5 hover:bg-gray-200 dark:hover:bg-surface-800 text-gray-700 dark:text-gray-300"
                  title="Font Color"
                >
                  <Palette size={14} className="text-rose-500" />
                  <ChevronDown size={10} />
                </button>
                {showColorPicker && (
                  <div className="absolute left-0 top-full mt-1 z-50 p-2 rounded-lg shadow-xl bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 grid grid-cols-4 gap-1 min-w-[130px]">
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => { applyInline(`[COLOR:${col.hex}]`, '[/COLOR]', 'COLOR'); setShowColorPicker(false); }}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-surface-700 transition-transform hover:scale-110"
                        style={{ backgroundColor: col.hex }}
                        title={col.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Highlight Picker Dropdown */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
                  className="p-1 rounded flex items-center gap-0.5 hover:bg-gray-200 dark:hover:bg-surface-800 text-gray-700 dark:text-gray-300"
                  title="Highlight Color"
                >
                  <Highlighter size={14} className="text-amber-500" />
                  <ChevronDown size={10} />
                </button>
                {showHighlightPicker && (
                  <div className="absolute left-0 top-full mt-1 z-50 p-2 rounded-lg shadow-xl bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 grid grid-cols-4 gap-1 min-w-[110px]">
                    {PRESET_HIGHLIGHTS.map((hl) => (
                      <button
                        key={hl.hex}
                        type="button"
                        onClick={() => { applyInline(`[HL:${hl.hex}]`, '[/HL]', 'HL'); setShowHighlightPicker(false); }}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-surface-700 transition-transform hover:scale-110"
                        style={{ backgroundColor: hl.hex }}
                        title={hl.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Alignment Group */}
              <div className="flex items-center gap-0.5 shrink-0">
                <ToolButton onClick={() => applyInline('[LEFT]')} title="Align Left">
                  <AlignLeft size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('[CENTER]')} title="Align Center">
                  <AlignCenter size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('[RIGHT]')} title="Align Right">
                  <AlignRight size={14} />
                </ToolButton>
                <ToolButton onClick={() => applyInline('[JUSTIFY]')} title="Justify Text">
                  <AlignJustify size={14} />
                </ToolButton>
              </div>

              <Separator />

              {/* Format Painter / Clear Formatting */}
              <ToolButton onClick={clearFormatting} title="Clear All Formatting / Reset">
                <Type size={14} className="text-red-500" />
              </ToolButton>
            </div>
          )}

          {/* ── INSERT TAB: Horizontal Rule, Lists, Checkmarks, Line Spacing ── */}
          {activeTab === 'insert' && (
            <div className="flex items-center flex-nowrap md:flex-wrap gap-1.5 shrink-0">
              <ToolButton onClick={() => applyLinePrefix('• ')} title="Bullet List (•)">
                <List size={14} />
              </ToolButton>
              <ToolButton onClick={() => applyLinePrefix('1. ')} title="Numbered List (1.)">
                <ListOrdered size={14} />
              </ToolButton>
              <ToolButton onClick={() => applyLinePrefix('✓ ')} title="Checkmark List (✓)">
                <span className="font-bold text-sm">✓</span>
              </ToolButton>
              <Separator />
              <button
                type="button"
                onClick={insertHorizontalRule}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 hover:bg-gray-100 dark:hover:bg-surface-700 text-xs font-medium text-gray-700 dark:text-gray-300 shrink-0"
                title="Insert Horizontal Rule Divider"
              >
                <Minus size={14} />
                <span>Divider Line</span>
              </button>
              <Separator />
              {/* Line Spacing Selector */}
              <div className="relative flex items-center gap-1 shrink-0">
                <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium">Spacing:</span>
                <button
                  type="button"
                  onClick={() => setShowSpacingPicker(!showSpacingPicker)}
                  className="px-2 py-0.5 rounded bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 text-xs font-mono flex items-center gap-1"
                >
                  <span>1.4x</span>
                  <ChevronDown size={10} />
                </button>
                {showSpacingPicker && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 rounded-lg shadow-lg py-1 min-w-[80px]">
                    {['1.0', '1.15', '1.4', '1.6', '2.0'].map((sp) => (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => { applyInline(`[SPACING:${sp}]`); setShowSpacingPicker(false); }}
                        className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-surface-800 font-mono"
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LAYOUT TAB: Indentation, Margin adjustment ─────────────────── */}
          {activeTab === 'layout' && (
            <div className="flex items-center flex-nowrap md:flex-wrap gap-2 shrink-0">
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-gray-500 dark:text-gray-400 text-[11px]">Indentation:</span>
                <button
                  type="button"
                  onClick={() => applyIndent('out')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 hover:bg-gray-100 dark:hover:bg-surface-700 text-xs font-medium text-gray-700 dark:text-gray-300 shrink-0"
                  title="Shift Content Left (Outdent)"
                >
                  <Outdent size={14} />
                  <span>Outdent</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyIndent('in')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 hover:bg-gray-100 dark:hover:bg-surface-700 text-xs font-medium text-gray-700 dark:text-gray-300 shrink-0"
                  title="Shift Content Right (Indent)"
                >
                  <Indent size={14} />
                  <span>Indent</span>
                </button>
              </div>
              <Separator />
              <button
                type="button"
                onClick={clearFormatting}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-medium shrink-0"
              >
                <Type size={14} />
                <span>Reset Layout & Spacing</span>
              </button>
            </div>
          )}

          {/* ── STYLES TAB: Normal, No spacing, Headings ───────────────────── */}
          {activeTab === 'styles' && (
            <div className="flex items-center flex-nowrap md:flex-wrap gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => applyLinePrefix('')}
                className="px-2.5 py-1 rounded border border-gray-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-xs font-medium hover:border-brand-500 transition-colors shrink-0"
              >
                AaBbCc — Regular
              </button>
              <button
                type="button"
                onClick={() => applyInline('[SPACING:1.0]')}
                className="px-2.5 py-1 rounded border border-gray-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-xs font-medium leading-tight hover:border-brand-500 transition-colors shrink-0"
              >
                AaBbCc — No Spacing
              </button>
              <button
                type="button"
                onClick={() => applyLinePrefix('### ')}
                className="px-2.5 py-1 rounded border border-gray-300 dark:border-surface-700 bg-brand-50/50 dark:bg-brand-950/30 text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1 hover:border-brand-500 transition-colors shrink-0"
              >
                <Heading1 size={13} />
                <span>Heading 1</span>
              </button>
              <button
                type="button"
                onClick={() => applyLinePrefix('## ')}
                className="px-2.5 py-1 rounded border border-gray-300 dark:border-surface-700 bg-brand-50/30 dark:bg-brand-950/20 text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:border-brand-500 transition-colors shrink-0"
              >
                <Heading2 size={13} />
                <span>Heading 2</span>
              </button>
            </div>
          )}

          {/* ── QUICK PHRASES TAB: ATS Action bullet points ────────────────── */}
          {activeTab === 'phrases' && (
            <div className="w-full">
              <div className="flex items-start gap-1.5 mb-1.5 text-[11px] font-bold text-brand-600 dark:text-brand-400">
                <Sparkles size={13} className="shrink-0 mt-0.5" />
                <span className="leading-tight text-balance">Click any phrase to insert directly into your resume section:</span>
              </div>
              <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 pr-1">
                {ATS_SUGGESTIONS.map((group) => (
                  <div key={group.category} className="bg-white dark:bg-surface-800 rounded p-1.5 border border-gray-200 dark:border-surface-700">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 px-1">
                      {group.category}
                    </div>
                    {group.sentences.map((phrase) => (
                      <button
                        key={phrase}
                        type="button"
                        onClick={() => insertPhrase(phrase)}
                        className="w-full text-left p-1.5 text-xs rounded hover:bg-brand-50 dark:hover:bg-brand-950/40 text-gray-700 dark:text-gray-300 transition-colors border-b last:border-b-0 border-gray-100 dark:border-surface-700/50 flex items-start gap-1.5"
                      >
                        <span className="text-brand-500 mt-0.5">•</span>
                        <span>{phrase}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
