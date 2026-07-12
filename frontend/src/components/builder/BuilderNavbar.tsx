import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import {
  FileText, ArrowLeft, Download, BarChart3,
  Check, Smartphone, Monitor, Upload, PenLine, BookOpen, Sparkles, Sun, Moon, PlusCircle, Undo2, Redo2, Wrench
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
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);

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

  const mockProfiles = [
    { label: '⚡ Fresh Blank Resume', type: 'blank' as const, desc: 'Start building from scratch' },
    { label: 'Alex Rivera — Software Architect', type: 'software' as const, desc: 'Full Stack & Cloud Architecture' },
    { label: 'Sarah Jenkins — VP Product', type: 'product' as const, desc: 'AI SaaS & Growth Leadership' },
    { label: 'David Chen — Lead Analyst', type: 'finance' as const, desc: 'Corporate Strategy & M&A' },
    { label: 'Aarav Sharma — SDE Graduate', type: 'fresher' as const, desc: 'B.Tech CS / Fresher SDE' },
  ];

  return (
    <>
      <header className="h-14 bg-white/95 dark:bg-surface-900/95 border-b border-surface-200 dark:border-surface-800 px-3 sm:px-4 flex items-center justify-between gap-2 flex-shrink-0 z-30 sticky top-0 transition-colors backdrop-blur-md">
        {/* Left Section: Back & Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80 text-surface-900 dark:text-surface-100 font-bold text-sm select-none shrink-0"
            title="Back to home"
          >
            <span>Resume Alchemist</span>
          </button>

          <button
            type="button"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="btn btn-ghost btn-sm gap-1 px-2 py-1 text-xs font-semibold text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700/60 transition-colors flex items-center shrink-0"
            title="Navigate back"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="w-px h-5 bg-surface-200 dark:bg-surface-800 hidden sm:block shrink-0" />

          {/* Resume Title */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-brand-500/10 dark:bg-brand-500/20">
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
                className="text-sm font-semibold bg-white dark:bg-surface-800 border border-brand-500 rounded px-2 py-0.5 text-surface-900 dark:text-surface-100 focus:outline-none w-full max-w-[120px] sm:max-w-[200px] md:max-w-[260px]"
              />
            ) : (
              <div
                onClick={() => { setTitleInput(resume.title); setIsEditingTitle(true); }}
                className="flex items-center gap-1.5 cursor-pointer group rounded px-1.5 py-0.5 hover:bg-surface-100 dark:hover:bg-surface-800 max-w-[120px] sm:max-w-[200px] md:max-w-[260px] truncate transition-colors"
                title="Click to rename resume"
              >
                <span className="font-semibold text-sm truncate text-surface-900 dark:text-surface-100">
                  {resume.title}
                </span>
                <PenLine size={12} className="text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Save status (Tablet/Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 shrink-0">
          {isDirty ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Saving...</>
          ) : (
            <><Check size={12} className="text-emerald-500" /> Saved locally</>
          )}
        </div>

        {/* Desktop / Web Right Actions */}
        <div className="hidden md:flex items-center gap-1.5 ml-auto shrink-0">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 bg-surface-100 dark:bg-surface-800/60 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700/50">
            <button
              type="button"
              onClick={undo}
              disabled={historyIndex <= 0 || !history?.length}
              className="p-1.5 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={historyIndex >= (history?.length ?? 0) - 1 || historyIndex < 0 || !history?.length}
              className="p-1.5 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={13} />
            </button>
          </div>

          {/* Fresh Blank (Extra wide only) */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Start a fresh blank resume? Any unsaved changes will be cleared.')) {
                loadSampleResume('blank');
              }
            }}
            className="hidden xl:inline-flex btn btn-sm gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 font-bold transition-all shadow-xs shrink-0"
            title="Create a fresh blank resume"
          >
            <PlusCircle size={13} />
            <span>Fresh Blank</span>
          </button>

          {/* Load Mock Data */}
          <div className="relative hidden xl:inline-block">
            <button
              type="button"
              onClick={() => setShowMockMenu(!showMockMenu)}
              className="btn btn-sm gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/10 hover:bg-brand-50 dark:hover:bg-brand-500/20 font-medium transition-colors"
            >
              <BookOpen size={13} />
              <span>Load Mock Data</span>
            </button>

            {showMockMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl shadow-xl py-1.5 z-50 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 animate-in slide-in-from-top-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 border-b border-surface-100 dark:border-surface-800 flex items-center gap-1">
                  <Sparkles size={11} className="text-brand-500" />
                  <span>Select Person & Field</span>
                </div>
                {mockProfiles.map(({ label, type, desc }) => (
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

          {/* Upload / Import */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="hidden lg:inline-flex btn btn-sm gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-brand-500/30 text-brand-600 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-500/10 hover:bg-brand-50 dark:hover:bg-brand-500/20 font-medium transition-colors shrink-0"
          >
            <Upload size={13} />
            <span>Upload / Import</span>
          </button>

          {/* Condensed Tools Menu (Shown when xl screen hides individual buttons) */}
          <div className="relative xl:hidden">
            <button
              type="button"
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className="btn btn-sm gap-1 px-2.5 py-1.5 rounded-lg border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 font-semibold"
            >
              <Wrench size={13} />
              <span>Tools</span>
            </button>
            {showToolsMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl shadow-xl py-1.5 z-50 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 animate-in slide-in-from-top-1">
                <button
                  type="button"
                  onClick={() => { setShowToolsMenu(false); if (confirm('Start a fresh blank resume?')) loadSampleResume('blank'); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-surface-100 dark:hover:bg-surface-800 text-amber-600 dark:text-amber-400"
                >
                  <PlusCircle size={14} /> Fresh Blank Resume
                </button>
                <button
                  type="button"
                  onClick={() => { setShowToolsMenu(false); setShowImportModal(true); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-surface-100 dark:hover:bg-surface-800 text-brand-600 dark:text-brand-400"
                >
                  <Upload size={14} /> Upload / Import DOCX/PDF
                </button>
                <div className="border-t border-surface-100 dark:border-surface-800 my-1 pt-1 px-3 text-[10px] font-bold text-surface-400 uppercase">Load Mock Profiles</div>
                {mockProfiles.slice(1).map(({ label, type }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { loadSampleResume(type); setShowToolsMenu(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 truncate"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Split Screen Slider */}
          {onSetLayoutRatio && (
            <div className="hidden 2xl:flex items-center bg-surface-100 dark:bg-surface-800/60 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700/50 text-[11px] font-semibold shrink-0">
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

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="btn btn-sm p-2 rounded-lg text-surface-600 dark:text-surface-300 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>

          {/* Live Preview Toggle */}
          <button
            onClick={onToggleMobilePreview}
            className={`btn btn-sm gap-1 px-2.5 py-1.5 rounded-lg transition-colors font-bold shrink-0 flex items-center shadow-xs ${
              isMobilePreview
                ? 'bg-brand-500 text-white'
                : 'text-surface-700 dark:text-surface-200 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
            title="Toggle Mobile Preview / Editor"
          >
            {isMobilePreview ? <Monitor size={15} /> : <Smartphone size={15} />}
            <span className="text-xs">{isMobilePreview ? 'Edit Resume' : 'Live Preview'}</span>
          </button>

          {/* ATS Score */}
          <button
            onClick={onToggleATS}
            className={`btn btn-sm gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors font-semibold shrink-0 ${
              showATS
                ? 'bg-brand-500 text-white'
                : 'text-surface-700 dark:text-surface-200 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            <BarChart3 size={14} />
            <span className={`font-bold ${showATS ? 'text-white' : atsResult ? getScoreColor(atsResult.score).split(' ')[0] : 'text-surface-400'}`}>
              {atsResult ? `${atsResult.score}` : '—'}
            </span>
            <span className="hidden xl:inline">ATS Score</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="btn btn-sm gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm shrink-0"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Mobile Top Bar Quick Actions (< md screen) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="btn btn-sm p-1.5 rounded-lg text-surface-600 dark:text-surface-300 border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-sm gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-500 text-white hover:bg-brand-600 shadow-sm flex items-center"
          >
            <Download size={13} />
            <span>PDF</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Action Bar (< md screen) for thumb-friendly navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-surface-900/95 border-t border-surface-200 dark:border-surface-800 px-3 py-2 flex md:hidden items-center justify-around gap-1 backdrop-blur-md shadow-2xl">
        {/* Undo/Redo Group */}
        <div className="flex items-center gap-0.5 bg-surface-100 dark:bg-surface-800 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700">
          <button
            type="button"
            onClick={undo}
            disabled={historyIndex <= 0 || !history?.length}
            className="p-1.5 rounded text-surface-600 dark:text-surface-300 disabled:opacity-30"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={historyIndex >= (history?.length ?? 0) - 1 || historyIndex < 0 || !history?.length}
            className="p-1.5 rounded text-surface-600 dark:text-surface-300 disabled:opacity-30"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Tools Popup Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMobileTools(!showMobileTools)}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 text-[10px] font-semibold"
          >
            <Wrench size={16} className="text-brand-500" />
            <span>Tools</span>
          </button>

          {showMobileTools && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 rounded-xl shadow-2xl py-2 z-50 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 animate-in slide-in-from-bottom-2">
              <button
                type="button"
                onClick={() => { setShowMobileTools(false); if (confirm('Start a fresh blank resume?')) loadSampleResume('blank'); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-surface-100 dark:hover:bg-surface-800 text-amber-600 dark:text-amber-400"
              >
                <PlusCircle size={15} /> Fresh Blank Resume
              </button>
              <button
                type="button"
                onClick={() => { setShowMobileTools(false); setShowImportModal(true); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-surface-100 dark:hover:bg-surface-800 text-brand-600 dark:text-brand-400"
              >
                <Upload size={15} /> Upload / Import DOCX/PDF
              </button>
              <div className="border-t border-surface-100 dark:border-surface-800 my-1 pt-1 px-3 text-[10px] font-bold text-surface-400 uppercase">Load Mock Data</div>
              {mockProfiles.slice(1).map(({ label, type }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { loadSampleResume(type); setShowMobileTools(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 truncate"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ATS Score */}
        <button
          onClick={onToggleATS}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
            showATS ? 'bg-brand-500 text-white' : 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          <BarChart3 size={16} />
          <span>ATS: {atsResult ? atsResult.score : '—'}</span>
        </button>

        {/* Live Preview / Edit Toggle */}
        <button
          onClick={onToggleMobilePreview}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[10px] font-bold transition-colors shadow-xs ${
            isMobilePreview ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700'
          }`}
        >
          {isMobilePreview ? <Monitor size={16} /> : <Smartphone size={16} />}
          <span>{isMobilePreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </>
  );
}

