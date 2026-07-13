import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import {
  FileText, ChevronLeft, Download, BarChart3,
  Check, Smartphone, Monitor, Columns, Upload, PenLine, BookOpen, Sparkles, Sun, Moon, ArrowLeft, PlusCircle, Undo2, Redo2, Menu, X
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
  const { isDirty, lastSaved, atsResult, updateResumeTitle, loadSampleResume, themeMode = 'light', setThemeMode, undo, redo, history, historyIndex } = useResumeStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resume.title);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMockMenu, setShowMockMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <header className="h-14 bg-[#FAF7F2]/90 dark:bg-[#1a050b]/90 border-b border-surface-200/60 dark:border-surface-800/60 px-3 sm:px-4 flex items-center justify-between gap-2 flex-shrink-0 z-30 sticky top-0 transition-all duration-300 backdrop-blur-md relative overflow-visible">
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80 text-surface-900 dark:text-surface-100 group select-none font-bold text-sm shrink-0"
            title="Back to home"
          >
            <span className="hidden sm:inline">Resume Alchemist</span>
          </button>

          <button
            type="button"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="btn btn-ghost btn-sm gap-1 px-2.5 py-1 text-xs font-semibold text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700/60 transition-colors flex items-center shrink-0"
            title="Navigate back to previous page"
          >
            <ArrowLeft size={13} />
            <span className="hidden md:inline">Back</span>
          </button>

          <div className="w-px h-5 bg-surface-200 dark:bg-surface-800 shrink-0" />

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
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 shrink-0">
          {isDirty ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Saving...</>
          ) : lastSaved ? (
            <><Check size={12} className="text-emerald-500" /> Saved locally</>
          ) : (
            <><Check size={12} className="text-emerald-500" /> Saved locally</>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0 relative py-1">
          {/* Download PDF (High-priority action, always visible and accessible) */}
          <button
            onClick={handleDownloadPDF}
            className="btn btn-sm gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm shrink-0 whitespace-nowrap flex items-center select-none"
            title="Download high-quality PDF resume"
          >
            <Download size={14} className="shrink-0" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Mobile/Desktop toggle for view selection (visible only on mobile/tablet) */}
          <button
            onClick={onToggleMobilePreview}
            className={`btn btn-sm gap-1 px-2.5 py-1.5 rounded-lg transition-colors font-bold shrink-0 flex items-center shadow-xs whitespace-nowrap lg:hidden ${
              isMobilePreview
                ? 'bg-brand-500 text-white'
                : 'text-surface-700 dark:text-surface-200 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
            title="Toggle Mobile Preview / Editor"
          >
            {isMobilePreview ? <Monitor size={15} /> : <Smartphone size={15} />}
            <span className="text-xs">{isMobilePreview ? 'Edit' : 'Preview'}</span>
          </button>

          {/* Unified Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`btn btn-sm p-2 rounded-lg border transition-colors shrink-0 ${
              isMenuOpen
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'text-surface-700 dark:text-surface-200 border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
            title="Open editing tools menu"
          >
            {isMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>

          {/* Click Outside Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Hamburger Tools Dropdown (Column) */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-2xl p-4 z-50 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border border-surface-200/60 dark:border-surface-800/60 animate-in slide-in-from-top-2 duration-200 flex flex-col gap-3.5">
              {/* ATS Score Option */}
              <div>
                <button
                  type="button"
                  onClick={() => { onToggleATS(); setIsMenuOpen(false); }}
                  className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-lg transition-colors font-semibold border ${
                    showATS
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'text-surface-700 dark:text-surface-200 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} />
                    <span>ATS Score Analysis</span>
                  </div>
                  <span className={`font-bold px-1.5 py-0.5 rounded ${showATS ? 'bg-white/20 text-white' : atsResult ? getScoreColor(atsResult.score).split(' ')[0] : 'text-surface-400'}`}>
                    {atsResult ? `${atsResult.score}` : '—'}
                  </span>
                </button>
              </div>

              {/* Undo / Redo Row */}
              <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-800/60 pt-3">
                <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">History Actions</span>
                <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800/60 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700/50">
                  <button
                    type="button"
                    onClick={() => { undo(); setIsMenuOpen(false); }}
                    disabled={historyIndex <= 0 || !history?.length}
                    className="p-1.5 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { redo(); setIsMenuOpen(false); }}
                    disabled={historyIndex >= (history?.length ?? 0) - 1 || historyIndex < 0 || !history?.length}
                    className="p-1.5 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 size={13} />
                  </button>
                </div>
              </div>

              {/* Fresh Blank Resume */}
              <div className="border-t border-surface-200 dark:border-surface-800/60 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (confirm('Start a fresh blank resume? Any unsaved changes in the current resume will be cleared.')) {
                      loadSampleResume('blank');
                    }
                  }}
                  className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 font-bold transition-all shadow-xs"
                >
                  <PlusCircle size={14} />
                  <span>Fresh Blank Resume</span>
                </button>
              </div>

              {/* Upload/Import Resume */}
              <div>
                <button
                  type="button"
                  onClick={() => { setIsMenuOpen(false); setShowImportModal(true); }}
                  className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-brand-500/30 text-brand-600 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-500/10 hover:bg-brand-50 dark:hover:bg-brand-500/20 font-semibold transition-colors"
                >
                  <Upload size={14} />
                  <span>Upload / Import Resume</span>
                </button>
              </div>

              {/* Split Screen Slider (Desktop only) */}
              {onSetLayoutRatio && (
                <div className="flex flex-col gap-1.5 border-t border-surface-200 dark:border-surface-800/60 pt-3 hidden lg:flex">
                  <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">Layout Ratio</span>
                  <div className="flex items-center bg-surface-100 dark:bg-surface-800/60 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700/50 text-[10px] font-semibold w-full">
                    {[
                      { label: 'Wide Edit', pct: 60 },
                      { label: '50 / 50', pct: 50 },
                      { label: 'Wide Prev', pct: 40 },
                    ].map((opt) => (
                      <button
                        key={opt.pct}
                        type="button"
                        onClick={() => { onSetLayoutRatio(opt.pct); setIsMenuOpen(false); }}
                        className={`flex-1 py-1 rounded transition-all ${
                          currentRatio === opt.pct
                            ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm font-bold'
                            : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dark/Light Theme Row */}
              <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-800/60 pt-3">
                <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">Appearance Theme</span>
                <button
                  type="button"
                  onClick={() => { setThemeMode(isDark ? 'light' : 'dark'); setIsMenuOpen(false); }}
                  className="btn btn-sm px-2.5 py-1 rounded-lg text-surface-700 dark:text-surface-200 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex items-center gap-1.5 font-semibold text-xs"
                >
                  {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>

              {/* Load Mock Resumes Sub-menu */}
              <div className="flex flex-col gap-1 border-t border-surface-200 dark:border-surface-800/60 pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-surface-400 px-1 mb-1">
                  Load Authentic Sample Data
                </div>
                <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto pr-1">
                  {[
                    { label: 'Alex Rivera — Software Architect', type: 'software' as const },
                    { label: 'Sarah Jenkins — VP Product', type: 'product' as const },
                    { label: 'David Chen — Lead Analyst', type: 'finance' as const },
                    { label: 'Aarav Sharma — SDE Graduate', type: 'fresher' as const },
                  ].map(({ label, type }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { loadSampleResume(type); setIsMenuOpen(false); }}
                      className="text-left px-2 py-1.5 transition-colors rounded hover:bg-brand-50 dark:hover:bg-brand-500/10 text-[11px] font-medium text-surface-700 dark:text-surface-300 truncate"
                      title={label}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      </header>
    </>
  );
}
