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
  const { currentResume, setCurrentResume, createNewResume, setAtsResult, undo, redo } = useResumeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showATS, setShowATS] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    const hashSection = window.location.hash.replace('#section=', '');
    return hashSection || 'personalInfo';
  });
  const [sectionHistory, setSectionHistory] = useState<string[]>([]);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => window.innerWidth >= 768);
  const atsTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSectionChange = useCallback((newSection: string) => {
    if (newSection !== activeSection) {
      setSectionHistory((prev) => [...prev, activeSection]);
      setActiveSection(newSection);
      window.history.pushState({ section: newSection }, '', `#section=${newSection}`);
    }
  }, [activeSection]);

  const handleBackNavigation = useCallback(() => {
    if (sectionHistory.length > 0) {
      const prevSection = sectionHistory[sectionHistory.length - 1];
      setSectionHistory((prev) => prev.slice(0, -1));
      setActiveSection(prevSection);
      window.history.pushState({ section: prevSection }, '', `#section=${prevSection}`);
    } else {
      window.history.length > 1 ? window.history.back() : (window.location.href = '/');
    }
  }, [sectionHistory]);

  useEffect(() => {
    const handlePopState = () => {
      const hashSection = window.location.hash.replace('#section=', '');
      if (hashSection && hashSection !== activeSection) {
        setActiveSection(hashSection);
        setSectionHistory((prev) => prev.slice(0, -1));
      } else if (sectionHistory.length > 0) {
        const prevSection = sectionHistory[sectionHistory.length - 1];
        setActiveSection(prevSection);
        setSectionHistory((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeSection, sectionHistory]);

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

  // Global Undo/Redo keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

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
    <div className={`flex flex-col h-screen transition-colors duration-300 bg-[#FAF7F2] dark:bg-gradient-to-br dark:from-[#2a0812] dark:via-[#140609] dark:to-[#080204] text-surface-900 dark:text-surface-100 relative overflow-hidden ${isDragging ? 'select-none cursor-col-resize' : ''}`}>
      {/* Animated Dark Red Gradient Glow matching Web Theme */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-600/25 via-rose-600/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-red-700/20 via-brand-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Builder Navbar ─────────────────────────────────────────── */}
      <BuilderNavbar
        resume={currentResume}
        showATS={showATS}
        onToggleATS={() => setShowATS(!showATS)}
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        onSetLayoutRatio={handleSetRatio}
        currentRatio={editorPct}
        onNavigateBack={handleBackNavigation}
      />

      {/* ── 3-Panel Layout ─────────────────────────────────────────── */}
      <div className="flex flex-row flex-1 overflow-hidden relative min-w-0 z-10">

        {/* Mobile Sidebar Overlay */}
        {isSidebarExpanded && (
          <div
            className="fixed inset-0 z-20 bg-black/25 backdrop-blur-xs md:hidden transition-opacity"
            onClick={() => setIsSidebarExpanded(false)}
          />
        )}

        {/* Left/Top: Section Sidebar */}
        <div className={`${isMobilePreview ? 'hidden' : 'flex'} flex-col bg-[#FAF7F2]/90 dark:bg-[#1a050b]/90 backdrop-blur-md border-r border-surface-200/60 dark:border-surface-800/60 z-30 shrink-0 h-full transition-all duration-300 ${
          isSidebarExpanded ? 'w-[240px] absolute md:relative inset-y-0 left-0 shadow-2xl md:shadow-none z-40' : 'w-[46px] sm:w-[56px] md:w-[64px]'
        } overflow-hidden`}>
          <SectionSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isExpanded={isSidebarExpanded}
            onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />
        </div>

        {/* Editor & Preview Split Area */}
        <div
          id="split-container"
          className="flex-1 flex flex-col lg:flex-row overflow-hidden min-w-0 h-full relative"
          style={{ '--editor-width': `${editorPct}%` } as React.CSSProperties}
        >
          {/* Center: Editor Form */}
          <div
            className={`${isMobilePreview ? 'hidden' : 'flex'} min-w-0 flex-1 lg:flex-none flex-col overflow-hidden bg-transparent editor-resizable-panel z-10`}
            style={isMobilePreview ? { width: '100%' } : undefined}
          >
            <EditorPanel
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>

          {/* Drag Splitter */}
          {!isMobilePreview && (
            <div
              onMouseDown={handleMouseDown}
              className={`hidden lg:flex w-1.5 hover:w-2 hover:bg-brand-500 cursor-col-resize transition-colors flex-shrink-0 z-20 items-center justify-center ${isDragging ? 'bg-brand-500 w-2' : 'bg-surface-200/80 dark:bg-surface-800/80'}`}
              title="Drag to resize Editor / Preview split"
            >
              <div className="w-0.5 h-8 bg-gray-400 dark:bg-gray-600 rounded-full" />
            </div>
          )}

          {/* Right: Live Preview */}
          <div
            className={`${isMobilePreview ? 'flex flex-1 w-full' : 'hidden lg:flex'} flex-col bg-black/5 dark:bg-black/20 backdrop-blur-xs overflow-hidden min-w-0 preview-resizable-panel z-10`}
            style={isMobilePreview ? { width: '100%' } : undefined}
          >
            <PreviewPanel
              isMobilePreview={isMobilePreview}
              onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
            />
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
