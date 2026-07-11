import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { PenLine } from 'lucide-react';

interface SectionTitleEditorProps {
  sectionKey: string;
  defaultTitle: string;
}

export const SectionTitleEditor: React.FC<SectionTitleEditorProps> = React.memo(({ sectionKey, defaultTitle }) => {
  const title = useResumeStore((state) => state.currentResume?.sectionTitles?.[sectionKey] || defaultTitle);
  const updateSectionTitle = useResumeStore((state) => state.updateSectionTitle);

  return (
    <div className="flex items-center justify-between bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/80 dark:border-brand-800/60 rounded-xl px-3.5 py-2.5 mb-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300">
        <PenLine size={14} className="text-brand-500 flex-shrink-0" />
        <span>Resume Heading Title:</span>
      </div>
      <div className="flex-1 max-w-xs ml-3">
        <input
          type="text"
          value={title}
          onChange={(e) => updateSectionTitle(sectionKey, e.target.value)}
          placeholder={defaultTitle}
          className="w-full text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
          title="Customize how this heading title appears on your downloaded resume"
        />
      </div>
    </div>
  );
});

