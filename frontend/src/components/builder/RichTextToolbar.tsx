import React, { useState } from 'react';
import { Bold, Italic, List, CheckSquare, Sparkles, ChevronDown } from 'lucide-react';

interface RichTextToolbarProps {
  value: string;
  onChange: (newValue: string) => void;
  /** If provided, will target a specific textarea/input ref, otherwise modifies string value directly */
  inputRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  placeholderAction?: string;
}

const ACTION_VERBS = [
  'Spearheaded the development and launch of ',
  'Architected high-concurrency systems scaling to ',
  'Optimized database queries reducing latency by ',
  'Engineered robust microservices infrastructure using ',
  'Collaborated cross-functionally with design and product teams to ',
  'Led a team of engineers resulting in a ',
  'Implemented CI/CD pipelines decreasing deployment times by ',
  'Redesigned the frontend architecture improving performance by '
];

export function RichTextToolbar({ value, onChange, inputRef }: RichTextToolbarProps) {
  const [showVerbs, setShowVerbs] = useState(false);

  const formatSelection = (prefix: string, suffix: string = '') => {
    const el = inputRef?.current;
    if (el && typeof el.selectionStart === 'number') {
      const start = el.selectionStart;
      const end = typeof el.selectionEnd === 'number' ? el.selectionEnd : start;
      const selected = value.substring(start, end);
      const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}bold text${suffix}`;
      const next = value.substring(0, start) + replacement + value.substring(end);
      onChange(next);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
      }, 0);
    } else {
      onChange(`${value ? value + ' ' : ''}${prefix}text${suffix}`);
    }
  };

  const applyPrefixToLines = (prefixChar: string) => {
    const el = inputRef?.current;
    if (el && typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number' && el.selectionStart !== el.selectionEnd) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const before = value.substring(0, start);
      const selected = value.substring(start, end);
      const after = value.substring(end);

      const modified = selected
        .split('\n')
        .map((line) => (line.startsWith(prefixChar) ? line.substring(prefixChar.length) : `${prefixChar}${line}`))
        .join('\n');

      onChange(before + modified + after);
    } else {
      // Toggle prefix on current line or start
      const lines = value.split('\n');
      if (lines.length === 0 || value === '') {
        onChange(`${prefixChar}`);
      } else {
        const lastIndex = lines.length - 1;
        const lastLine = lines[lastIndex];
        if (lastLine.startsWith(prefixChar)) {
          lines[lastIndex] = lastLine.substring(prefixChar.length);
        } else {
          lines[lastIndex] = `${prefixChar}${lastLine}`;
        }
        onChange(lines.join('\n'));
      }
    }
  };

  const insertActionVerb = (verb: string) => {
    const el = inputRef?.current;
    if (el && typeof el.selectionStart === 'number') {
      const start = el.selectionStart;
      const end = typeof el.selectionEnd === 'number' ? el.selectionEnd : start;
      const next = value.substring(0, start) + verb + value.substring(end);
      onChange(next);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + verb.length, start + verb.length);
      }, 0);
    } else {
      onChange(`${value ? value + (value.endsWith(' ') || value.endsWith('\n') ? '' : ' ') : ''}${verb}`);
    }
    setShowVerbs(false);
  };

  return (
    <div className="flex items-center flex-wrap gap-1 bg-gray-100 dark:bg-surface-800/80 border border-gray-200 dark:border-surface-700 rounded-t-lg px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300">
      <button
        type="button"
        onClick={() => formatSelection('**', '**')}
        className="p-1 hover:bg-gray-200 dark:hover:bg-surface-700 rounded transition-colors"
        title="Bold (**text**)"
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        onClick={() => formatSelection('*', '*')}
        className="p-1 hover:bg-gray-200 dark:hover:bg-surface-700 rounded transition-colors"
        title="Italic (*text*)"
      >
        <Italic size={14} />
      </button>

      <div className="h-3.5 w-px bg-gray-300 dark:bg-surface-600 mx-0.5" />

      <button
        type="button"
        onClick={() => applyPrefixToLines('• ')}
        className="p-1 hover:bg-gray-200 dark:hover:bg-surface-700 rounded transition-colors"
        title="Bullet Point (• )"
      >
        <List size={14} />
      </button>
      <button
        type="button"
        onClick={() => applyPrefixToLines('✓ ')}
        className="p-1 hover:bg-gray-200 dark:hover:bg-surface-700 rounded transition-colors"
        title="Checkmark (✓ )"
      >
        <CheckSquare size={14} />
      </button>

      <div className="h-3.5 w-px bg-gray-300 dark:bg-surface-600 mx-0.5" />

      {/* Action Verbs dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowVerbs(!showVerbs)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-surface-900 hover:bg-gray-50 dark:hover:bg-surface-800 border border-gray-200 dark:border-surface-700 transition-colors font-medium text-brand-600 dark:text-brand-400"
          title="Insert powerful action phrase"
        >
          <Sparkles size={13} />
          <span>Quick Phrases</span>
          <ChevronDown size={12} />
        </button>

        {showVerbs && (
          <div className="absolute left-0 top-full mt-1 z-50 w-64 bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 rounded-xl shadow-xl py-1.5 max-h-56 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-surface-800">
              Impact Phrases
            </div>
            {ACTION_VERBS.map((verb) => (
              <button
                key={verb}
                type="button"
                onClick={() => insertActionVerb(verb)}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate"
              >
                {verb}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
