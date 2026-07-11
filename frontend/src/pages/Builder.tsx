import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { SectionSidebar } from '../components/builder/SectionSidebar';
import { EditorPanel } from '../components/builder/EditorPanel';
import { PreviewPanel } from '../components/builder/PreviewPanel';
import { BuilderNavbar } from '../components/builder/BuilderNavbar';
import { ATSPanel } from '../components/builder/ATSPanel';
import { scoreResume } from '../utils/ats';
import {
  FileText, Loader2, PanelRightClose
} from 'lucide-react';

export default function BuilderPage() {
  const { currentResume, setCurrentResume, createNewResume, setAtsResult } = useResumeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showATS, setShowATS] = useState(false);
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const atsTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Panel sizing
  const [editorPct, setEditorPct] = useState<number>(() => {
    const saved = localStorage.getItem('resumeai_editor_pct');
    return saved ? Number(saved) : 48;
  });
  const [isDragging, setIsDragging] = useState(false);

  // Ensure there is always a valid currentResume loaded in the builder
  useEffect(() => {
    setIsLoading(true);
    if (!currentResume) {
      // Always initialize new/fresh user sessions with fresh demo data instead of leaking previous user's local storage!
      const newResume = createNewResume('Alex Rivera — Software Architect', 'software');
      setCurrentResume(newResume);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update ATS score on section changes only
  useEffect(() => {
    if (!currentResume?.sections) return;
    clearTimeout(atsTimerRef.current);
    atsTimerRef.current = setTimeout(() => {
      const result = scoreResume(currentResume.sections);
      setAtsResult(result);
    }, 500);
    return () => clearTimeout(atsTimerRef.current);
  }, [currentResume?.sections, setAtsResult]);

  // Drag resizing handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const sidebarWidth = 220;
      const availableWidth = window.innerWidth - sidebarWidth - (showATS ? 320 : 0);
      if (availableWidth <= 0) return;
      const x = e.clientX - sidebarWidth;
      let pct = (x / availableWidth) * 100;
      pct = Math.min(75, Math.max(25, pct));
      setEditorPct(pct);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem('resumeai_editor_pct', String(editorPct));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, editorPct, showATS]);

  const handleSetRatio = (pct: number) => {
    setEditorPct(pct);
    localStorage.setItem('resumeai_editor_pct', String(pct));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center animate-pulse-soft">
            <FileText size={24} className="text-white" />
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Loading your resume...
          </div>
        </div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No resume found</p>
          <Link to="/" className="btn btn-primary btn-md">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-100 dark:bg-transparent overflow-hidden ${isDragging ? 'select-none cursor-col-resize' : ''}`}>
      {/* ── Builder Navbar ─────────────────────────────────────────── */}
      <BuilderNavbar
        resume={currentResume}
        showATS={showATS}
        onToggleATS={() => setShowATS(!showATS)}
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        onSetLayoutRatio={handleSetRatio}
        currentRatio={editorPct}
      />

      {/* ── 3-Panel Layout ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative min-w-0">

        {/* Left/Top: Section Sidebar */}
        <div className={`${isMobilePreview ? 'hidden' : 'flex'} w-full md:w-[220px] flex-shrink-0 bg-white dark:bg-surface-900 border-b md:border-b-0 md:border-r border-gray-100 dark:border-surface-800 flex-col z-10 md:h-full h-auto max-h-[60px] md:max-h-none overflow-hidden`}>
          <SectionSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Editor & Preview Split Area */}
        <div
          className="flex-1 flex flex-col lg:flex-row overflow-hidden min-w-0 h-full relative"
          style={{ '--editor-width': `${editorPct}%` } as React.CSSProperties}
        >
          {/* Center: Editor Form */}
          <div
            className={`${isMobilePreview ? 'hidden' : 'flex'} min-w-0 flex-1 lg:flex-none flex-col overflow-hidden bg-gray-50 dark:bg-transparent editor-resizable-panel`}
            style={isMobilePreview ? { width: '100%' } : undefined}
          >
            <EditorPanel
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Drag Splitter */}
          {!isMobilePreview && (
            <div
              onMouseDown={handleMouseDown}
              className={`hidden lg:flex w-1.5 hover:w-2 hover:bg-brand-500 cursor-col-resize transition-colors flex-shrink-0 z-20 items-center justify-center ${isDragging ? 'bg-brand-500 w-2' : 'bg-gray-200 dark:bg-surface-800'}`}
              title="Drag to resize Editor / Preview split"
            >
              <div className="w-0.5 h-8 bg-gray-400 dark:bg-gray-600 rounded-full" />
            </div>
          )}

          {/* Right: Live Preview */}
          <div
            className={`${isMobilePreview ? 'flex flex-1 w-full' : 'hidden lg:flex'} flex-col bg-gray-200 dark:bg-surface-800 overflow-hidden min-w-0 preview-resizable-panel`}
            style={isMobilePreview ? { width: '100%' } : undefined}
          >
            <PreviewPanel />
          </div>
        </div>

        {/* ATS Panel — overlay on right */}
        {showATS && (
          <div className="w-[320px] flex-shrink-0 bg-white dark:bg-surface-900 border-l border-gray-100 dark:border-surface-800 overflow-y-auto animate-slide-in-right z-30">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-surface-800">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">ATS Analysis</h3>
              <button onClick={() => setShowATS(false)} className="btn btn-ghost p-1.5">
                <PanelRightClose size={16} />
              </button>
            </div>
            <ATSPanel />
          </div>
        )}
      </div>
    </div>
  );
}
