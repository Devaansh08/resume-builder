import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import {
  FileText, ChevronLeft, Download, BarChart3,
  Check, Smartphone, Monitor
} from 'lucide-react';
import { useCallback } from 'react';
import { generatePDF } from '../../utils/pdf';

interface BuilderNavbarProps {
  resume: Resume;
  showATS: boolean;
  onToggleATS: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export function BuilderNavbar({ resume, showATS, onToggleATS, isMobilePreview, onToggleMobilePreview }: BuilderNavbarProps) {
  const { isDirty, lastSaved, atsResult } = useResumeStore();
  const navigate = useNavigate();

  const handleExportPDF = useCallback(async () => {
    await generatePDF(resume.id, resume.title);
  }, [resume]);

  const scoreColor = atsResult
    ? atsResult.score >= 80 ? 'text-green-500' : atsResult.score >= 60 ? 'text-amber-500' : 'text-red-500'
    : 'text-gray-400';

  return (
    <header className="h-14 bg-white dark:bg-surface-900 border-b border-gray-100 dark:border-surface-800 flex items-center px-4 gap-3 flex-shrink-0">
      {/* Back to Home */}
      <button onClick={() => navigate('/')} className="btn btn-ghost btn-sm gap-1.5 text-xs">
        <ChevronLeft size={16} /> Home
      </button>

      <div className="divider !h-5 w-px bg-gray-200 dark:bg-surface-700" />

      {/* Resume title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <FileText size={12} className="text-white" />
        </div>
        <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
          {resume.title}
        </span>
      </div>

      {/* Save status */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400">
        {isDirty ? (
          <><span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Auto-saved locally</>
        ) : lastSaved ? (
          <><Check size={12} className="text-green-500" /> Saved locally</>
        ) : (
          <><Check size={12} className="text-green-500" /> Saved locally</>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Mobile/Desktop toggle */}
        <button
          onClick={onToggleMobilePreview}
          className={`btn btn-sm ${isMobilePreview ? 'btn-primary' : 'btn-ghost'} p-2`}
          title="Toggle preview"
        >
          {isMobilePreview ? <Monitor size={16} /> : <Smartphone size={16} />}
        </button>

        {/* ATS */}
        <button
          onClick={onToggleATS}
          className={`btn btn-sm ${showATS ? 'btn-primary' : 'btn-ghost'} gap-1.5 text-xs`}
        >
          <BarChart3 size={14} />
          <span className={`font-bold ${scoreColor}`}>
            {atsResult ? `${atsResult.score}` : '—'}
          </span>
          <span className="hidden md:inline">ATS Score</span>
        </button>

        {/* Export PDF */}
        <button onClick={handleExportPDF} className="btn btn-primary btn-sm gap-1.5 text-xs">
          <Download size={14} />
          <span className="hidden md:inline">Download PDF</span>
        </button>
      </div>
    </header>
  );
}
