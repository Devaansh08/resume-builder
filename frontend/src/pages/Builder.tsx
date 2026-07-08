import { useEffect, useState, useRef } from 'react';
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

  // Ensure there is always a valid currentResume loaded in the builder
  useEffect(() => {
    setIsLoading(true);
    if (!currentResume) {
      // Try loading the most recent resume from local storage
      try {
        const localResumesMap = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
        const resumesList = Object.values(localResumesMap) as Array<typeof currentResume>;
        if (resumesList.length > 0 && resumesList[0]) {
          setCurrentResume(resumesList[0]);
        } else {
          // No local resume found, create a fresh one automatically
          const newResume = createNewResume('My Resume');
          setCurrentResume(newResume);
        }
      } catch {
        const newResume = createNewResume('My Resume');
        setCurrentResume(newResume);
      }
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update ATS score on resume change
  useEffect(() => {
    if (!currentResume) return;
    clearTimeout(atsTimerRef.current);
    atsTimerRef.current = setTimeout(() => {
      const result = scoreResume(currentResume.sections);
      setAtsResult(result);
    }, 500);
    return () => clearTimeout(atsTimerRef.current);
  }, [currentResume, setAtsResult]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-surface-950">
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
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-surface-950 overflow-hidden">
      {/* ── Builder Navbar ─────────────────────────────────────────── */}
      <BuilderNavbar
        resume={currentResume}
        showATS={showATS}
        onToggleATS={() => setShowATS(!showATS)}
        isMobilePreview={isMobilePreview}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
      />

      {/* ── 3-Panel Layout ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Section Sidebar */}
        <div className={`${isMobilePreview ? 'hidden' : 'flex'} w-[220px] flex-shrink-0 bg-white dark:bg-surface-900 border-r border-gray-100 dark:border-surface-800 flex-col`}>
          <SectionSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Center: Editor Form */}
        <div className={`${isMobilePreview ? 'hidden' : 'flex'} flex-1 min-w-0 flex-col overflow-hidden bg-gray-50 dark:bg-surface-950`}>
          <EditorPanel
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Right: Live Preview */}
        <div className={`${isMobilePreview ? 'flex flex-1' : 'hidden lg:flex'} w-[480px] xl:w-[520px] flex-shrink-0 flex-col bg-gray-200 dark:bg-surface-800 border-l border-gray-200 dark:border-surface-700 overflow-hidden`}>
          <PreviewPanel />
        </div>

        {/* ATS Panel — overlay on right */}
        {showATS && (
          <div className="w-[320px] flex-shrink-0 bg-white dark:bg-surface-900 border-l border-gray-100 dark:border-surface-800 overflow-y-auto animate-slide-in-right">
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
