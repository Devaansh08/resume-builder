import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import {
  FileText, ChevronLeft, Download, BarChart3,
  Check, Smartphone, Monitor, Columns
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { generatePDF } from '../../utils/pdf';

interface BuilderNavbarProps {
  resume: Resume;
  showATS: boolean;
  onToggleATS: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
  onSetLayoutRatio?: (pct: number) => void;
  currentRatio?: number;
}

export function BuilderNavbar({ resume, showATS, onToggleATS, isMobilePreview, onToggleMobilePreview, onSetLayoutRatio, currentRatio = 48 }: BuilderNavbarProps) {
  const { isDirty, lastSaved, atsResult } = useResumeStore();
  const navigate = useNavigate();
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  const handleExportPDF = useCallback(async () => {
    await generatePDF(resume.id, resume.title);
  }, [resume]);

  const scoreColor = atsResult
    ? atsResult.score >= 80 ? 'text-green-500' : atsResult.score >= 60 ? 'text-amber-500' : 'text-red-500'
    : 'text-gray-400';

  return (
    <header className="h-14 bg-white dark:bg-surface-900 border-b border-gray-100 dark:border-surface-800 flex items-center px-4 gap-3 flex-shrink-0 relative z-30">
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
        {/* Layout Presets Toggle */}
        {onSetLayoutRatio && !isMobilePreview && (
          <div className="relative">
            <button
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
              className="btn btn-ghost btn-sm gap-1.5 text-xs"
              title="Adjust Editor / Preview split ratio"
            >
              <Columns size={15} className="text-gray-500" />
              <span className="hidden xl:inline">Layout</span>
            </button>

            {showLayoutMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 rounded-xl shadow-xl py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-surface-800">
                  Panel Width Ratios
                </div>
                <button
                  type="button"
                  onClick={() => { onSetLayoutRatio(35); setShowLayoutMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 dark:hover:bg-brand-950/50 ${currentRatio < 40 ? 'text-brand-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <span>Compact Editor (35 / 65)</span>
                  {currentRatio < 40 && <Check size={12} />}
                </button>
                <button
                  type="button"
                  onClick={() => { onSetLayoutRatio(50); setShowLayoutMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 dark:hover:bg-brand-950/50 ${currentRatio >= 40 && currentRatio <= 56 ? 'text-brand-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <span>Split 50 / 50</span>
                  {currentRatio >= 40 && currentRatio <= 56 && <Check size={12} />}
                </button>
                <button
                  type="button"
                  onClick={() => { onSetLayoutRatio(64); setShowLayoutMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 dark:hover:bg-brand-950/50 ${currentRatio > 56 ? 'text-brand-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <span>Wide Editor (65 / 35)</span>
                  {currentRatio > 56 && <Check size={12} />}
                </button>
              </div>
            )}
          </div>
        )}

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
