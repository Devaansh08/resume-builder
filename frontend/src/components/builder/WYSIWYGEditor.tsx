import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  ChevronDown, Type, Strikethrough, Sparkles, Copy, Check
} from 'lucide-react';
import { FONT_OPTIONS } from '../../utils/defaults';
import { parseTagsToHtml } from './RichText';

interface WYSIWYGEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  showWordCount?: boolean;
}

const PRESET_COLORS = [
  { label: 'Brand Red', hex: '#C41E3A' },
  { label: 'Crimson', hex: '#ef4444' },
  { label: 'Teal', hex: '#34C759' },
  { label: 'Royal Blue', hex: '#007AFF' },
  { label: 'Navy', hex: '#1e3a8a' },
  { label: 'Amber', hex: '#d97706' },
  { label: 'Purple', hex: '#8b5cf6' },
  { label: 'Dark', hex: '#1f2937' },
];

const PRESET_HIGHLIGHTS = [
  { label: 'Yellow', hex: '#fef08a' },
  { label: 'Green', hex: '#bbf7d0' },
  { label: 'Blue', hex: '#bfdbfe' },
  { label: 'Pink', hex: '#fbcfe8' },
];

const ATS_SUGGESTIONS = [
  'Spearheaded the development and launch of a cloud platform, driving $1.2M in annual revenue.',
  'Led a cross-functional engineering team of 14 to deliver a scalable architecture, reducing deployment times by 40%.',
  'Architected high-concurrency microservices scaling to over 18M active daily users with sub-85ms latency.',
  'Optimized database queries and indexing strategies, reducing query latency by 310% under concurrent load.',
  'Engineered real-time data pipelines processing over 1.2 terabytes of metadata daily without system degradation.',
  'Leveraged predictive modeling and machine learning to improve customer retention rates by 15% year-over-year.',
];

function rgbToHex(color: string): string {
  if (!color || color === 'inherit') return '';
  if (color.startsWith('#')) return color;
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return color;
  const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
  const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
  const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function serializeNodeToTags(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as HTMLElement;
  const tag = el.tagName.toUpperCase();

  if (tag === 'BR') return '\n';
  if (tag === 'HR') return '[HR]\n';

  let inner = Array.from(el.childNodes).map(serializeNodeToTags).join('');

  if (tag === 'LI') {
    const cleanInner = inner.trim().replace(/^[•\-–—*]\s*/, '');
    return `• ${cleanInner}\n`;
  }
  if (tag === 'UL' || tag === 'OL') {
    return inner.endsWith('\n') ? inner : `${inner}\n`;
  }
  if (tag === 'DIV' || tag === 'P') {
    let prefix = '';
    if (el.style.textAlign === 'center') prefix = '[CENTER]';
    if (el.style.textAlign === 'right') prefix = '[RIGHT]';
    if (el.style.textAlign === 'justify') prefix = '[JUSTIFY]';
    const isFirst = !el.previousSibling;
    if (/^[•\-–—*]\s+/.test(inner.trim())) {
      return (isFirst ? '' : '\n') + prefix + inner + (inner.endsWith('\n') ? '' : '\n');
    }
    const suffix = inner.endsWith('\n') ? '' : '\n';
    return (isFirst ? '' : '\n') + prefix + inner + suffix;
  }

  // Check formatting
  const fontWeight = el.style.fontWeight || window.getComputedStyle(el).fontWeight || '';
  const isBold = tag === 'B' || tag === 'STRONG' || fontWeight === 'bold' || parseInt(fontWeight, 10) >= 700;
  if (isBold && inner.trim()) {
    inner = `**${inner}**`;
  }

  const fontStyle = el.style.fontStyle || '';
  const isItalic = tag === 'I' || tag === 'EM' || fontStyle === 'italic';
  if (isItalic && inner.trim()) {
    inner = `*${inner}*`;
  }

  const textDec = el.style.textDecoration || '';
  const isUnderline = tag === 'U' || textDec.includes('underline');
  if (isUnderline && inner.trim()) {
    inner = `__${inner}__`;
  }

  const isStrike = tag === 'DEL' || tag === 'STRIKE' || tag === 'S' || textDec.includes('line-through');
  if (isStrike && inner.trim()) {
    inner = `~~${inner}~~`;
  }

  // Colors & Highlights & Fonts & Sizes
  const color = el.style.color || el.getAttribute('color');
  if (color && color !== 'inherit' && color !== 'rgb(0, 0, 0)' && color !== '#000000') {
    const hex = rgbToHex(color);
    if (hex && inner.trim()) {
      inner = `[COLOR:${hex}]${inner}[/COLOR]`;
    }
  }

  const bg = el.style.backgroundColor || (tag === 'MARK' ? '#fef08a' : '');
  if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
    const hex = rgbToHex(bg);
    if (hex && inner.trim()) {
      inner = `[HL:${hex}]${inner}[/HL]`;
    }
  }

  const fontSize = el.style.fontSize || el.getAttribute('size');
  if (fontSize && fontSize !== 'inherit') {
    let sz = fontSize;
    if (/^[0-9]+$/.test(sz)) sz = sz + 'px';
    if (inner.trim()) {
      inner = `[SIZE:${sz}]${inner}[/SIZE]`;
    }
  }

  const fontFamily = el.style.fontFamily || el.getAttribute('face');
  if (fontFamily && fontFamily !== 'inherit') {
    const cleanFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    if (cleanFont && inner.trim()) {
      inner = `[FONT:${cleanFont}]${inner}[/FONT]`;
    }
  }

  return inner;
}

export function WYSIWYGEditor({
  value,
  onChange,
  placeholder = 'Type here... Highlight words and use the toolbar above to style directly.',
  minHeight = '140px',
  showWordCount = true,
}: WYSIWYGEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastReportedRef = useRef<string>(value);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const colorRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setShowColorPicker(false);
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) setShowFontPicker(false);
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setShowSizePicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    if (value === lastReportedRef.current) return;
    if (document.activeElement === editorRef.current || editorRef.current.contains(document.activeElement)) return;

    lastReportedRef.current = value;
    const html = parseTagsToHtml(value);
    if ((value.includes('•') || value.includes('- ') || value.includes('* ')) && !html.includes('<li')) {
      const lines = value.split('\n').filter((l) => l.trim() !== '');
      const listItemsHtml = lines
        .map((l) => {
          const clean = l.replace(/^[•\-–—*]\s*/, '');
          return `<li style="margin-bottom: 4px;">${parseTagsToHtml(clean)}</li>`;
        })
        .join('');
      editorRef.current.innerHTML = `<ul style="list-style-type: disc; padding-left: 20px; margin: 4px 0;">${listItemsHtml}</ul>`;
    } else {
      editorRef.current.innerHTML = html;
    }
  }, [value]);

  const syncDOMToState = useCallback(() => {
    if (!editorRef.current) return;
    let backendTags = serializeNodeToTags(editorRef.current);
    backendTags = backendTags.replace(/\n+$/, '');
    lastReportedRef.current = backendTags;
    onChange(backendTags);
  }, [onChange]);

  const exec = (command: string, arg: string | null = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg || undefined);
    syncDOMToState();
  };

  const ensureSelection = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    let hasSelection = false;
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer) && selection.toString().trim() !== '') {
        hasSelection = true;
      }
    }
    if (!hasSelection) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const applySize = (sz: string) => {
    if (!editorRef.current) return;
    ensureSelection();
    document.execCommand('fontSize', false, '7');
    const fonts = editorRef.current.querySelectorAll('font[size="7"]');
    fonts.forEach((fontEl) => {
      const span = document.createElement('span');
      span.style.fontSize = sz;
      span.innerHTML = fontEl.innerHTML;
      fontEl.replaceWith(span);
    });
    syncDOMToState();
    setShowSizePicker(false);
  };

  const applyFont = (fontFamily: string) => {
    if (!editorRef.current) return;
    ensureSelection();
    document.execCommand('fontName', false, fontFamily);
    syncDOMToState();
    setShowFontPicker(false);
  };

  const applyColor = (hex: string) => {
    if (!editorRef.current) return;
    ensureSelection();
    document.execCommand('foreColor', false, hex);
    syncDOMToState();
    setShowColorPicker(false);
  };

  const applyHighlight = (hex: string) => {
    if (!editorRef.current) return;
    ensureSelection();
    document.execCommand('hiliteColor', false, hex);
    syncDOMToState();
    setShowColorPicker(false);
  };

  const clearFormatting = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('removeFormat', false, undefined);
    const spans = editorRef.current.querySelectorAll('span, font, b, i, u, strong, em');
    spans.forEach((el) => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent?.insertBefore(el.firstChild, el);
      }
      parent?.removeChild(el);
    });
    syncDOMToState();
  };

  const insertSuggestion = (phrase: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const ul = editorRef.current.querySelector('ul');
    if (ul) {
      const li = document.createElement('li');
      li.style.marginBottom = '4px';
      li.innerHTML = phrase;
      ul.appendChild(li);
    } else {
      const div = document.createElement('div');
      div.style.marginBottom = '4px';
      div.innerHTML = `• ${phrase}`;
      editorRef.current.appendChild(div);
    }
    syncDOMToState();
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 1500);
  };

  const wordCount = value ? value.replace(/\[[^\]]+\]/g, '').trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-sm overflow-visible transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 relative">
      <div className="bg-[#FAF7F2] dark:bg-surface-900 border-b border-gray-200 dark:border-surface-700 px-2.5 py-1.5 flex items-center justify-between gap-2 flex-wrap select-none relative z-20 rounded-t-xl overflow-visible">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center mr-1">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('bold')}
              title="Bold"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-800 transition-colors font-bold"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('italic')}
              title="Italic"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-800 transition-colors italic"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('underline')}
              title="Underline"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-800 transition-colors underline"
            >
              <Underline size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('strikeThrough')}
              title="Strikethrough"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-800 transition-colors"
            >
              <Strikethrough size={15} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-surface-700 mx-1 shrink-0" />

          <div ref={colorRef} className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setShowColorPicker(!showColorPicker); setShowFontPicker(false); setShowSizePicker(false); }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white dark:bg-surface-800 hover:bg-gray-100 dark:hover:bg-surface-700 border border-gray-200 dark:border-surface-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-2xs"
              title="Text & Highlight Color"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-brand-500 border border-gray-300 dark:border-surface-600" />
              <span>Color</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            {showColorPicker && (
              <div className="absolute left-0 top-full mt-1.5 z-50 bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-lg shadow-xl p-2.5 min-w-[170px]">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Text Color</span>
                <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyColor(c.hex)}
                      title={c.label}
                      className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-surface-700 hover:scale-110 transition-transform shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Highlight</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_HIGHLIGHTS.map((h) => (
                    <button
                      key={h.hex}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHighlight(h.hex)}
                      title={h.label}
                      className="w-6 h-6 rounded border border-gray-200 dark:border-surface-700 hover:scale-110 transition-transform shadow-2xs"
                      style={{ backgroundColor: h.hex }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={fontRef} className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setShowFontPicker(!showFontPicker); setShowColorPicker(false); setShowSizePicker(false); }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white dark:bg-surface-800 hover:bg-gray-100 dark:hover:bg-surface-700 border border-gray-200 dark:border-surface-700 text-xs font-medium text-gray-700 dark:text-gray-200 transition-all max-w-[110px] truncate"
              title="Font Family"
            >
              <span>Font</span>
              <ChevronDown size={12} className="text-gray-400 ml-auto" />
            </button>
            {showFontPicker && (
              <div className="absolute left-0 top-full mt-1.5 z-50 bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-lg shadow-xl p-1.5 w-48 max-h-56 overflow-y-auto">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyFont(f.id)}
                    style={{ fontFamily: f.family }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 hover:text-gray-900 dark:hover:text-white rounded transition-colors"
                  >
                    {f.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={sizeRef} className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setShowSizePicker(!showSizePicker); setShowColorPicker(false); setShowFontPicker(false); }}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-surface-800 hover:bg-gray-100 dark:hover:bg-surface-700 border border-gray-200 dark:border-surface-700 text-xs font-mono text-gray-700 dark:text-gray-200 transition-all"
              title="Font Size"
            >
              <span>Size</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            {showSizePicker && (
              <div className="absolute left-0 top-full mt-1.5 z-50 bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-lg shadow-xl p-1.5 w-28 grid grid-cols-2 gap-1">
                {['11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applySize(sz)}
                    className="text-center px-1.5 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 hover:text-gray-900 dark:hover:text-white rounded transition-colors"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-surface-700 mx-1 shrink-0" />

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('justifyLeft')}
              title="Align Left"
              className="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-surface-800 transition-all"
            >
              <AlignLeft size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('justifyCenter')}
              title="Align Center"
              className="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-surface-800 transition-all"
            >
              <AlignCenter size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-surface-800 transition-all"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-surface-800 transition-all"
            >
              <ListOrdered size={14} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-surface-700 mx-1 shrink-0" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearFormatting}
            title="Clear All Formatting"
            className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all flex items-center gap-1 text-xs font-semibold"
          >
            <Type size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-2xs border ${
              showSuggestions
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
            }`}
          >
            <Sparkles size={12} className="animate-pulse text-amber-500 dark:text-amber-400 shrink-0" />
            <span>AI Phrases</span>
          </button>

          {showWordCount && (
            <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase">
              {wordCount} words
            </span>
          )}
        </div>
      </div>

      {showSuggestions && (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/40 p-2.5 animate-slide-down">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> High-Impact ATS Action Phrases (Click to Add)
            </span>
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="text-[10px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
            {ATS_SUGGESTIONS.map((phrase, idx) => (
              <div
                key={idx}
                onClick={() => insertSuggestion(phrase)}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-surface-800 border border-amber-200/60 dark:border-amber-900/30 hover:border-amber-400 cursor-pointer group transition-all"
              >
                <span className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">{phrase}</span>
                <span className="shrink-0 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedPhrase === phrase ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        onInput={syncDOMToState}
        onBlur={syncDOMToState}
        style={{ minHeight }}
        className="p-3.5 text-sm text-gray-900 dark:text-gray-100 outline-none overflow-y-auto leading-relaxed focus:bg-amber-50/10 dark:focus:bg-surface-800 transition-colors"
        data-placeholder={placeholder}
      />
    </div>
  );
}
