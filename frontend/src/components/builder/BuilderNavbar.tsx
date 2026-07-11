import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import {
  FileText, ChevronLeft, Download, BarChart3,
  Check, Smartphone, Monitor, Columns, Upload, PenLine, BookOpen, Sparkles, Sun, Moon, ArrowLeft, PlusCircle
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { generatePDF } from '../../utils/pdf';
import { ImportModal } from './ImportModal';

interface BuilderNavbarProps {
  resume: Resume;
  showATS: boolean;
  onToggleATS: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
  onSetLayoutRatio?: (pct: number) => void;
  currentRatio?: number;
}

export function BuilderNavbar({
  resume,
  showATS,
  onToggleATS,
  isMobilePreview,
  onToggleMobilePreview,
  onSetLayoutRatio,
  currentRatio = 50,
}: BuilderNavbarProps) {
  const navigate = useNavigate();
  const { isDirty, lastSaved, atsResult, updateResumeTitle, loadSampleResume, themeMode = 'light', setThemeMode } = useResumeStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resume.title);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMockMenu, setShowMockMenu] = useState(false);

  const isDark = themeMode === 'dark';

  const handleTitleSubmit = useCallback(() => {
    if (titleInput.trim() && titleInput !== resume.title) {
      updateResumeTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  }, [titleInput, resume.title, updateResumeTitle]);

  const handleDownloadPDF = async () => {
    await generatePDF(resume.id, resume.title);
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (s >= 60) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <>
      <header className="h-14 bg-white/95 dark:bg-surface-900/95 border-b border-surface-200 dark:border-surface-800 px-3 sm:px-4 flex items-center justify-between gap-2 flex-shrink-0 z-30 sticky top-0 transition-colors backdrop-blur-md">
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80 text-surface-900 dark:text-surface-100 group select-none font-bold text-sm"
            title="Back to home"
          >
            <span>Resume Alchemist</span>
          </button>

          <button
            type="button"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="btn btn-ghost btn-sm gap-1 px-2.5 py-1 text-xs font-semibold text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700/60 transition-colors flex items-center"
            title="Navigate back to previous page"
          >
            <ArrowLeft size={13} />
            <span className="hidden md:inline">Back</span>
          </button>

          <div className="w-px h-5 bg-surface-200 dark:bg-surface-800" />

          {/* Resume Title with Click-to-Rename */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-brand-500/10 dark:bg-brand-500/20">
              <FileText size={12} className="text-brand-500" />
            </div>
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="text-sm font-semibold bg-white dark:bg-surface-800 border border-brand-500 rounded px-2 py-0.5 text-surface-900 dark:text-surface-100 focus:outline-none w-full max-w-[100px] sm:max-w-[160px] md:max-w-[280px]"
              />
            ) : (
              <div
                onClick={() => { setTitleInput(resume.title); setIsEditingTitle(true); }}
                className="flex items-center gap-1.5 cursor-pointer group rounded px-1.5 py-0.5 hover:bg-surface-100 dark:hover:bg-surface-800 max-w-[100px] sm:max-w-[160px] md:max-w-[280px] truncate transition-colors"
                title="Click to rename resume"
              >
                <span className="font-semibold text-sm truncate text-surface-900 dark:text-surface-100">
                  {resume.title}
                </span>
                <PenLine size={12} className="text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Save status */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
          {isDirty ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Saving...</>
          ) : lastSaved ? (
            <><Check size={12} className="text-emerald-500" /> Saved locally</>
          ) : (
            <><Check size={12} className="text-emerald-500" /> Saved locally</>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
          {/* Fresh Blank Resume Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Start a fresh blank resume? Any unsaved changes in the current resume will be cleared.')) {
                loadSampleResume('blank');
              }
            }}
            className="btn btn-sm gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 font-bold transition-all shadow-xs shrink-0"
            title="Create a fresh blank resume"
          >
            <PlusCircle size={13} />
            <span className="hidden md:inline">Fresh Blank</span>
          </button>

          {/* Load Mock Resumes Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMockMenu(!showMockMenu)}
              className="btn btn-sm gap-1 text-xs px-2 sm:px-2.5 py-1.5 rounded-lg border border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/10 hover:bg-brand-50 dark:hover:bg-brand-500/20 font-medium transition-colors"
              title="Load authentic sample resume data"
            >
              <BookOpen size={13} />
              <span className="hidden lg:inline">Load Mock Data</span>
            </button>

            {showMockMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-60 rounded-xl shadow-xl py-1.5 z-50 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 animate-in slide-in-from-top-1"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 border-b border-surface-100 dark:border-surface-800 flex items-center gap-1">
                  <Sparkles size={11} className="text-brand-500" />
                  <span>Select Person & Field</span>
                </div>
                {[
                  { label: '⚡ Fresh Blank Resume', type: 'blank' as const, desc: 'Start building from scratch' },
                  { label: 'Alex Rivera — Software Architect', type: 'software' as const, desc: 'Full Stack & Cloud Architecture' },
                  { label: 'Sarah Jenkins — VP Product', type: 'product' as const, desc: 'AI SaaS & Growth Leadership' },
                  { label: 'David Chen — Lead Analyst', type: 'finance' as const, desc: 'Corporate Strategy & M&A' },
                  { label: 'Aarav Sharma — SDE Graduate', type: 'fresher' as const, desc: 'B.Tech CS / Fresher SDE' },
                ].map(({ label, type, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { loadSampleResume(type); setShowMockMenu(false); }}
                    className="w-full text-left px-3 py-2 transition-colors hover:bg-brand-50 dark:hover:bg-brand-500/10 border-b last:border-b-0 border-surface-50 dark:border-surface-800/50"
                  >
                    <div className="text-xs font-semibold text-surface-900 dark:text-surface-100">{label}</div>
                    <div className="text-[10px] text-surface-500 dark:text-surface-400">{desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upload/Import Resume button */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="btn btn-sm gap-1.5 text-xs px-2 sm:px-2.5 py-1.5 rounded-lg border border-brand-500/30 text-brand-600 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-500/10 hover:bg-brand-50 dark:hover:bg-brand-500/20 font-medium transition-colors"
            title="Upload or import existing PDF / DOCX resume"
          >
            <Upload size={13} />
            <span className="hidden xl:inline">Upload / Import</span>
          </button>

          {/* Split Screen Slider */}
          {onSetLayoutRatio && (
            <div className="hidden 2xl:flex items-center bg-surface-100 dark:bg-surface-800/60 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700/50 text-[11px] font-semibold">
              {[
                { label: 'Wide Editor', pct: 60 },
                { label: '50 / 50', pct: 50 },
                { label: 'Wide Preview', pct: 40 },
              ].map((opt) => (
                <button
                  key={opt.pct}
                  type="button"
                  onClick={() => onSetLayoutRatio(opt.pct)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    currentRatio === opt.pct
                      ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="btn btn-sm p-1.5 sm:p-2 rounded-lg text-surface-600 dark:text-surface-300 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>

        {/* Mobile/Desktop toggle */}
        <button
          onClick={onToggleMobilePreview}
          className={`btn btn-sm p-1.5 sm:p-2 rounded-lg transition-colors ${
            isMobilePreview
              ? 'bg-brand-500 text-white'
              : 'text-surface-600 dark:text-surface-300 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
          title="Toggle preview"
        >
          {isMobilePreview ? <Monitor size={15} /> : <Smartphone size={15} />}
        </button>

        {/* ATS Score */}
        <button
          onClick={onToggleATS}
          className={`btn btn-sm gap-1 sm:gap-1.5 text-xs px-2 sm:px-3 py-1.5 rounded-lg transition-colors font-semibold ${
            showATS
              ? 'bg-brand-500 text-white'
              : 'text-surface-700 dark:text-surface-200 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          <BarChart3 size={14} />
          <span className={`font-bold ${showATS ? 'text-white' : atsResult ? getScoreColor(atsResult.score).split(' ')[0] : 'text-surface-400'}`}>
            {atsResult ? `${atsResult.score}` : '—'}
          </span>
          <span className="hidden lg:inline">ATS Score</span>
        </button>

        {/* Download PDF */}
        <button
          onClick={handleDownloadPDF}
          className="btn btn-sm gap-1.5 text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>

      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </header>
    </>
  );
}
