import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  ChevronDown, Minus, Type, Strikethrough
} from 'lucide-react';
import { FONT_OPTIONS } from '../../utils/defaults';

interface RichTextToolbarProps {
  value: string;
  onChange: (newValue: string) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  placeholderAction?: string;
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

export function RichTextToolbar({ value, onChange, inputRef, showWordCount = true }: RichTextToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [activeColor, setActiveColor] = useState('#C41E3A');
  const colorRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setShowColorPicker(false);
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) setShowFontPicker(false);
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setShowSizePicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getSelection = useCallback(() => {
    const el = inputRef?.current;
    if (!el || typeof el.selectionStart !== 'number') return null;
    return { el, start: el.selectionStart, end: typeof el.selectionEnd === 'number' ? el.selectionEnd : el.selectionStart };
  }, [inputRef]);

  const applyInline = useCallback((prefix: string, suffix: string = '', tagType?: 'SIZE' | 'FONT' | 'COLOR' | 'HL') => {
    const sel = getSelection();
    let target = value, start = 0, end = value.length;
    if (sel && sel.start !== sel.end) { target = value.substring(sel.start, sel.end); start = sel.start; end = sel.end; }
    else if (suffix !== '') { target = value || 'Text'; start = 0; end = value.length; }

    let cleaned = target;
    if (tagType === 'SIZE' || prefix.startsWith('[SIZE:')) cleaned = cleaned.replace(/\[SIZE:[^\]]+\]/g, '').replace(/\[\/SIZE\]/g, '');
    else if (tagType === 'FONT' || prefix.startsWith('[FONT:')) cleaned = cleaned.replace(/\[FONT:[^\]]+\]/g, '').replace(/\[\/FONT\]/g, '');
    else if (tagType === 'COLOR' || prefix.startsWith('[COLOR:')) cleaned = cleaned.replace(/\[COLOR:[^\]]+\]/g, '').replace(/\[\/COLOR\]/g, '');
    else if (tagType === 'HL' || prefix.startsWith('[HL:')) cleaned = cleaned.replace(/\[HL:[^\]]+\]/g, '').replace(/\[\/HL\]/g, '');
    else if (prefix === '**' && suffix === '**') cleaned = cleaned.replace(/\*\*/g, '');
    else if (prefix === '*' && suffix === '*') cleaned = cleaned.replace(/\*/g, '');
    else if (prefix === '__' && suffix === '__') cleaned = cleaned.replace(/__/g, '');
    else if (prefix === '~~' && suffix === '~~') cleaned = cleaned.replace(/~~/g, '');
    else if (suffix === '') {
      if (prefix.startsWith('[SPACING:')) cleaned = cleaned.replace(/\[SPACING:[^\]]+\]/g, '');
      else if (['[LEFT]', '[CENTER]', '[RIGHT]', '[JUSTIFY]'].includes(prefix)) cleaned = cleaned.replace(/\[LEFT\]|\[CENTER\]|\[RIGHT\]|\[JUSTIFY\]/g, '');
    }
    onChange(value.substring(0, start) + `${prefix}${cleaned}${suffix}` + value.substring(end));
  }, [value, onChange, getSelection]);

  const applyLinePrefix = useCallback((prefixChar: string) => {
    const sel = getSelection();
    if (sel && sel.start !== sel.end) {
      const { start, end } = sel;
      const modified = value.substring(start, end).split('\n')
        .map((line) => line.startsWith(prefixChar) ? line.substring(prefixChar.length) : `${prefixChar}${line}`).join('\n');
      onChange(value.substring(0, start) + modified + value.substring(end));
    } else {
      if (!value) { onChange(prefixChar); return; }
      const lines = value.split('\n');
      const last = lines.length - 1;
      lines[last] = lines[last].startsWith(prefixChar) ? lines[last].substring(prefixChar.length) : `${prefixChar}${lines[last]}`;
      onChange(lines.join('\n'));
    }
  }, [value, onChange, getSelection]);

  const insertHorizontalRule = useCallback(() => {
    const sel = getSelection();
    const pos = sel ? sel.start : value.length;
    const prevChar = pos > 0 ? value[pos - 1] : '\n';
    const prefix = prevChar === '\n' ? '[HR]\n' : '\n[HR]\n';
    onChange(value.substring(0, pos) + prefix + value.substring(sel ? sel.end : value.length));
  }, [value, onChange, getSelection]);

  const clearFormatting = useCallback(() => {
    onChange(value
      .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/__(.*?)__/g, '$1').replace(/~~(.*?)~~/g, '$1')
      .replace(/\[COLOR:.*?\](.*?)\[\/COLOR\]/gs, '$1').replace(/\[HL:.*?\](.*?)\[\/HL\]/gs, '$1')
      .replace(/\[SIZE:.*?\](.*?)\[\/SIZE\]/gs, '$1').replace(/\[FONT:.*?\](.*?)\[\/FONT\]/gs, '$1')
      .replace(/\[LEFT\]|\[CENTER\]|\[RIGHT\]|\[JUSTIFY\]/g, '').replace(/\[SPACING:.*?\]/g, '')
      .replace(/^[•✓›\-]\s/gm, '').replace(/^\d+\.\s/gm, '').replace(/^###\s|^##\s/gm, '').replace(/^    /gm, ''));
  }, [value, onChange]);

  const getActiveFont = () => (value.match(/\[FONT:([^\]]+)\]/)?.[1] || 'Calibri');
  const getActiveSize = () => (value.match(/\[SIZE:([^\]]+)\]/)?.[1] || '12px');

  return (
    <div className="relative select-none w-full">
      {/* ═══ Main Toolbar Bar ═══ */}
      <div className="bg-[#FAF7F2] dark:bg-surface-900 border border-gray-200 dark:border-surface-800 rounded-t-xl transition-colors">
        {/* ── Row: Formatting Controls ── */}
        <div className="flex items-center gap-0 px-2 py-1.5 flex-wrap">

          {/* B / I / U large buttons with labels */}
          <div className="flex items-center mr-2">
            {[
              { icon: <Bold size={16} />, label: 'BOLD', action: () => applyInline('**', '**') },
              { icon: <Italic size={16} />, label: 'ITALIC', action: () => applyInline('*', '*') },
              { icon: <Underline size={16} />, label: 'UNDERLINE', action: () => applyInline('__', '__') },
            ].map(btn => (
              <button key={btn.label} type="button" onClick={btn.action} title={btn.label}
                className="flex flex-col items-center justify-center w-12 h-12 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 active:bg-gray-200 dark:active:bg-surface-700 transition-all">
                <span className="mb-0.5">{btn.icon}</span>
                <span className="text-[8px] font-bold tracking-wider opacity-60">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-300 dark:bg-surface-700 mx-1.5 shrink-0" />

          {/* COLOR picker */}
          <div ref={colorRef} className="relative mr-1.5">
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-0.5">COLOR</span>
              <button type="button" onClick={() => { setShowColorPicker(!showColorPicker); setShowFontPicker(false); setShowSizePicker(false); }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-white dark:bg-surface-800 hover:bg-gray-50 dark:hover:bg-surface-700 border border-gray-200 dark:border-surface-700 transition-all">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: activeColor }} />
                <ChevronDown size={10} className="text-gray-400" />
              </button>
            </div>
            {showColorPicker && (
              <div className="absolute left-0 top-full mt-1.5 z-[999] bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-lg shadow-xl p-2.5 min-w-[150px]">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Text Color</span>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {PRESET_COLORS.map(c => (
                    <button key={c.hex} type="button" title={c.label}
                      onClick={() => { applyInline(`[COLOR:${c.hex}]`, '[/COLOR]', 'COLOR'); setActiveColor(c.hex); setShowColorPicker(false); }}
                      className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-surface-700 hover:border-gray-900 dark:hover:border-white hover:scale-110 transition-all shadow-sm"
                      style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Highlight</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_HIGHLIGHTS.map(h => (
                    <button key={h.hex} type="button" title={h.label}
                      onClick={() => { applyInline(`[HL:${h.hex}]`, '[/HL]', 'HL'); setShowColorPicker(false); }}
                      className="w-6 h-6 rounded border-2 border-gray-200 dark:border-surface-700 hover:border-gray-900 dark:hover:border-white hover:scale-110 transition-all shadow-sm"
                      style={{ backgroundColor: h.hex }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-300 dark:bg-surface-700 mx-1.5 shrink-0" />

          {/* FONT picker */}
          <div ref={fontRef} className="relative mr-1.5">
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-0.5">FONT</span>
              <button type="button" onClick={() => { setShowFontPicker(!showFontPicker); setShowColorPicker(false); setShowSizePicker(false); }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-surface-800 hover:bg-gray-50 dark:hover:bg-surface-700 border border-gray-200 dark:border-surface-700 text-xs text-gray-700 dark:text-gray-200 font-medium min-w-[100px] transition-all">
                <span className="truncate">{getActiveFont()}</span>
                <ChevronDown size={10} className="text-gray-400 ml-auto shrink-0" />
              </button>
            </div>
            {showFontPicker && (
              <div className="absolute left-0 top-full mt-1.5 z-[999] bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-lg shadow-xl p-1.5 w-64 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 gap-0.5">
                  {FONT_OPTIONS.map(f => (
                    <button key={f.id} type="button" style={{ fontFamily: f.family }}
                      onClick={() => { applyInline(`[FONT:${f.id}]`, '[/FONT]', 'FONT'); setShowFontPicker(false); }}
                      className="text-left px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 hover:text-gray-900 dark:hover:text-white transition-colors font-medium rounded truncate">
                      {f.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-300 dark:bg-surface-700 mx-1.5 shrink-0" />

          {/* SIZE */}
          <div ref={sizeRef} className="relative mr-1.5">
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-0.5">SIZE</span>
              <button type="button" onClick={() => { setShowSizePicker(!showSizePicker); setShowColorPicker(false); setShowFontPicker(false); }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-surface-800 hover:bg-gray-50 dark:hover:bg-surface-700 border border-gray-200 dark:border-surface-700 text-xs text-gray-700 dark:text-gray-200 font-mono transition-all">
                <span>{getActiveSize()}</span>
                <ChevronDown size={10} className="text-gray-400" />
              </button>
            </div>
            {showSizePicker && (
              <div className="absolute left-0 top-full mt-1.5 z-[999] bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-lg shadow-xl p-1.5 w-32">
                <div className="grid grid-cols-2 gap-0.5">
                {['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px'].map(sz => (
                  <button key={sz} type="button"
                    onClick={() => { applyInline(`[SIZE:${sz}]`, '[/SIZE]', 'SIZE'); setShowSizePicker(false); }}
                    className="w-full text-center px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {sz}
                  </button>
                ))}
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-300 dark:bg-surface-700 mx-1.5 shrink-0" />

          {/* ALIGNMENT */}
          <div className="flex flex-col items-center mr-1.5">
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-0.5">ALIGNMENT</span>
            <div className="flex items-center gap-0.5">
              {[
                { icon: <AlignLeft size={13} />, p: '[LEFT]' },
                { icon: <AlignCenter size={13} />, p: '[CENTER]' },
                { icon: <AlignRight size={13} />, p: '[RIGHT]' },
              ].map((a, i) => (
                <button key={i} type="button" onClick={() => applyInline(a.p)}
                  className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
                  {a.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-300 dark:bg-surface-700 mx-1.5 shrink-0" />

          {/* LIST */}
          <div className="flex flex-col items-center mr-1.5">
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-0.5">LIST</span>
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => applyLinePrefix('• ')} title="Bullet List"
                className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
                <List size={13} />
              </button>
              <button type="button" onClick={() => applyLinePrefix('1. ')} title="Numbered List"
                className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
                <ListOrdered size={13} />
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-300 dark:bg-surface-700 mx-1.5 shrink-0" />

          {/* EXTRAS: Strikethrough, Divider, Clear */}
          <div className="flex items-center gap-0.5 mr-1.5">
            <button type="button" onClick={() => applyInline('~~', '~~')} title="Strikethrough"
              className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
              <Strikethrough size={14} />
            </button>
            <button type="button" onClick={insertHorizontalRule} title="Divider Line"
              className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
              <Minus size={14} />
            </button>
            <button type="button" onClick={clearFormatting} title="Clear Formatting"
              className="p-1.5 rounded text-gray-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
              <Type size={14} />
            </button>
          </div>

          {/* Right side: Word count */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {showWordCount && (
              <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 px-2 py-1 rounded bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700">
                {wordCount} words
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
