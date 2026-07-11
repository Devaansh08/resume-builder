import { useEffect, useState, useDeferredValue, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { ModernTemplate } from '../components/templates/ModernTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { MinimalTemplate } from '../components/templates/MinimalTemplate';
import { ShrineTemplate } from '../components/templates/ShrineTemplate';
import { ExecutiveTemplate } from '../components/templates/ExecutiveTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { IndianAcademicTemplate } from '../components/templates/IndianAcademicTemplate';
import { IndianCorporateTemplate } from '../components/templates/IndianCorporateTemplate';
import { ArrowLeft, ZoomIn, ZoomOut, Printer, Download, Sparkles } from 'lucide-react';
import type { TemplateId, Resume } from '../types';
import { FONT_OPTIONS } from '../utils/defaults';
import { generatePDF } from '../utils/pdf';

const TEMPLATE_MAP: Record<TemplateId, React.ComponentType<{ resume?: Resume }>> = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  google: MinimalTemplate,
  harvard: ExecutiveTemplate,
  stanford: ExecutiveTemplate,
  microsoft: ProfessionalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  shrine: ShrineTemplate,
  'indian-academic': IndianAcademicTemplate,
  'indian-corporate': IndianCorporateTemplate,
};

export default function FullPreviewPage() {
  const navigate = useNavigate();
  const { currentResume, createNewResume, setCurrentResume, zoomLevel, setZoomLevel } = useResumeStore();
  const deferredResume = useDeferredValue(currentResume);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1024);

  useEffect(() => {
    if (!currentResume) {
      const newResume = createNewResume('Alex Rivera — Software Architect', 'software');
      setCurrentResume(newResume);
    }
  }, [currentResume, createNewResume, setCurrentResume]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="animate-spin text-brand-500" size={20} />
          <span>Loading Standard Full Screen Preview...</span>
        </div>
      </div>
    );
  }

  const activeResume = deferredResume || currentResume;
  const TemplateComponent = TEMPLATE_MAP[activeResume.template] || ModernTemplate;

  const fontObj = FONT_OPTIONS.find((f) => f.id === activeResume.theme.fontFamily);
  const fontFamilyCss = fontObj ? fontObj.family : activeResume.theme.fontFamily || 'Inter, sans-serif';

  // Ensure 100% zoom fits the whole A4 page centered cleanly inside the viewport width!
  const baseScale = Math.max(Math.min((containerWidth - 64) / 794, 1), 0.35);
  const effectiveScale = baseScale * (zoomLevel / 100);

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 10, 200));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 10, 25));

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePDF(activeResume.id, activeResume.title || 'Resume');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-100 dark:bg-surface-950 text-surface-900 dark:text-surface-100 print:bg-white">
      {/* Top Navbar (Hidden when printing) */}
      <header className="h-14 px-4 sm:px-6 flex items-center justify-between bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 shadow-sm shrink-0 sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/builder')}
            className="btn btn-ghost px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <ArrowLeft size={15} className="text-brand-500" />
            <span>Back to Builder</span>
          </button>
          <div className="h-4 w-[1px] bg-surface-200 dark:bg-surface-700 hidden sm:block" />
          <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-surface-900 dark:text-white hidden sm:block">
            {activeResume.title || 'Untitled Resume'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold text-[11px] border border-brand-500/30 uppercase tracking-wider hidden md:inline-block">
            Standard Full Screen · A4 Format
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-0.5 border border-surface-200 dark:border-surface-700">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 25}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 disabled:opacity-40 transition-colors"
              title="Zoom Out (-10%)"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-2.5 text-xs font-mono font-bold text-surface-800 dark:text-surface-200">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-1.5 rounded hover:bg-white dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 disabled:opacity-40 transition-colors"
              title="Zoom In (+10%)"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-sm bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-800 dark:text-surface-200 font-semibold px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-700 flex items-center gap-1.5 text-xs transition-colors"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print / Save as PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="btn btn-sm btn-primary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            <Download size={14} />
            <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Full-Screen Preview Area */}
      <main ref={containerRef} className="flex-1 overflow-auto flex justify-center py-8 px-4 sm:px-8 bg-surface-200/70 dark:bg-surface-950 transition-colors print:p-0 print:bg-white">
        <div
          style={{
            width: `${794 * effectiveScale}px`,
            minHeight: `${1123 * effectiveScale}px`,
            transition: 'width 0.2s, min-height 0.2s',
          }}
          className="flex justify-center print:w-full print:min-h-0"
        >
          <div
            id={activeResume.id}
            style={{
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top center',
              width: '794px',
              fontFamily: fontFamilyCss,
            }}
            className="transition-transform duration-200 print:transform-none print:w-full"
          >
            <div
              className="bg-white text-gray-900 rounded-sm print:shadow-none print:rounded-none"
              style={{
                width: '794px',
                minHeight: '1123px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.08)',
              }}
            >
              <TemplateComponent resume={activeResume} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
