import { useRef, useState, useDeferredValue, memo, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { ModernTemplate } from '../templates/ModernTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { ShrineTemplate } from '../templates/ShrineTemplate';
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate';
import { CreativeTemplate } from '../templates/CreativeTemplate';
import { IndianAcademicTemplate } from '../templates/IndianAcademicTemplate';
import { IndianCorporateTemplate } from '../templates/IndianCorporateTemplate';
import { ZoomIn, ZoomOut, Maximize2, ChevronDown, ExternalLink } from 'lucide-react';
import type { TemplateId, Resume } from '../../types';
import { FONT_OPTIONS } from '../../utils/defaults';

// All template IDs mapped to actual unique components
const TEMPLATE_MAP: Record<TemplateId, React.ComponentType<{ resume?: Resume }>> = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  google: MinimalTemplate,         // Google: clean minimal style (ATS friendly)
  harvard: ExecutiveTemplate,      // Harvard: centered executive academic
  stanford: ExecutiveTemplate,     // Stanford: centered academic style
  microsoft: ProfessionalTemplate, // Microsoft: clean professional corporate
  creative: CreativeTemplate,      // Creative: bold sidebar layout
  executive: ExecutiveTemplate,    // Executive: navy centered leadership
  shrine: ShrineTemplate,          // Shrine: Material Design warmth
  'indian-academic': IndianAcademicTemplate,
  'indian-corporate': IndianCorporateTemplate,
};

const MemoizedTemplateContainer = memo(({ template, resume }: { template: TemplateId; resume: Resume }) => {
  const TemplateComponent = TEMPLATE_MAP[template] || ModernTemplate;
  return <TemplateComponent resume={resume} />;
}, (prev, next) => prev.template === next.template && prev.resume === next.resume);

export function PreviewPanel() {
  const { currentResume, zoomLevel, setZoomLevel } = useResumeStore();
  const deferredResume = useDeferredValue(currentResume);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showZoomPresets, setShowZoomPresets] = useState(false);
  const [containerWidth, setContainerWidth] = useState(520);

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

  if (!currentResume) return null;
  const activeResume = deferredResume || currentResume;

  const fontObj = FONT_OPTIONS.find((f) => f.id === activeResume.theme.fontFamily);
  const fontFamilyCss = fontObj ? fontObj.family : activeResume.theme.fontFamily || 'Inter, sans-serif';

  // Ensure 100% zoom perfectly fits the whole A4 page centered with standard structure inside the live preview pane!
  const baseScale = Math.max(Math.min((containerWidth - 48) / 794, 1), 0.35);
  const effectiveScale = baseScale * (zoomLevel / 100);

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 10, 200));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 10, 25));

  const templateLabels: Record<TemplateId, string> = {
    modern: 'Modern',
    professional: 'Professional',
    minimal: 'Minimal',
    google: 'Google Style',
    harvard: 'Harvard',
    stanford: 'Stanford',
    microsoft: 'Microsoft',
    creative: 'Creative',
    executive: 'Executive',
    shrine: 'Shrine',
    'indian-academic': 'Indian Academic',
    'indian-corporate': 'Indian Corporate',
  };

  return (
    <div className="flex flex-col h-full bg-surface-100 dark:bg-surface-950 transition-colors">
      {/* Preview toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0 bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 shadow-2xs"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300">
          Live Preview
        </span>
        <div className="flex items-center gap-1 relative">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 25}
            className="btn btn-ghost p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 disabled:opacity-40"
            title="Zoom out (-10%)"
          >
            <ZoomOut size={14} />
          </button>

          {/* Zoom Level Button + Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowZoomPresets(!showZoomPresets)}
              className="px-2 py-1 rounded bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 text-xs font-mono text-surface-800 dark:text-surface-200 flex items-center gap-1 hover:border-brand-500 transition-colors min-w-[62px] justify-center shadow-xs"
              title="Click to select zoom preset"
            >
              <span>{zoomLevel}%</span>
              <ChevronDown size={11} />
            </button>

            {showZoomPresets && (
              <div className="absolute right-0 top-full mt-1.5 w-32 rounded-xl shadow-xl py-1.5 z-50 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 animate-in slide-in-from-top-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-surface-400 border-b border-surface-100 dark:border-surface-800">
                  Zoom Presets
                </div>
                {[25, 50, 75, 100, 125, 150, 200].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => { setZoomLevel(level); setShowZoomPresets(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                      zoomLevel === level
                        ? 'text-brand-600 dark:text-brand-400 font-bold bg-brand-50/50 dark:bg-brand-500/10'
                        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                    }`}
                  >
                    {level}%
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
            className="btn btn-ghost p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 disabled:opacity-40"
            title="Zoom in (+10%)"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-ghost p-1.5 ml-1 rounded hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300"
            title="Fullscreen preview"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={() => window.open('/preview', '_blank')}
            className="btn btn-ghost p-1.5 ml-0.5 rounded hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300"
            title="Open preview inside dedicated full browser tab"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center p-4 sm:p-6 bg-surface-200/60 dark:bg-surface-950 transition-colors"
      >
        <div
          style={{
            width: `${794 * effectiveScale}px`,
            minHeight: `${1123 * effectiveScale}px`,
            transition: 'width 0.2s, min-height 0.2s',
          }}
          className="flex justify-center"
        >
          <div
            style={{
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top center',
              width: '794px',
            }}
            className="transition-transform duration-200"
          >
            {/* A4 paper shadow */}
            <div
              ref={previewRef}
              id="resume-preview"
              className="bg-white text-gray-900"
              style={{
                width: '794px',    // A4 width at 96dpi
                minHeight: '1123px', // A4 height at 96dpi
                fontFamily: fontFamilyCss,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15), 0 1px 4px rgba(0, 0, 0, 0.08)',
              }}
            >
              <MemoizedTemplateContainer template={activeResume.template} resume={activeResume} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0 bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 text-xs text-surface-600 dark:text-surface-400"
      >
        <span>A4 · 794 × 1123px</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold capitalize text-brand-600 dark:text-brand-400">
            {templateLabels[activeResume.template] || activeResume.template} template
          </span>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-surface-900/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
          {/* Top Bar inside Fullscreen */}
          <div className="h-14 px-6 flex items-center justify-between border-b border-surface-800 bg-surface-900/90 shrink-0 text-white z-10">
            <div className="flex items-center gap-3">
              <span className="font-display font-extrabold text-lg text-white">Full Screen Preview</span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs border border-brand-500/30">
                Standard A4 Document · 100% Scale
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.open('/preview', '_blank')}
                className="px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-surface-700"
                title="Open inside separate dedicated full browser tab"
              >
                <ExternalLink size={14} />
                <span>Open in Full Tab</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Close Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Standard Full Screen Document Area */}
          <div className="flex-1 overflow-y-auto overflow-x-auto py-8 px-4 flex justify-center items-start">
            <div
              className="bg-white text-gray-900 rounded-sm shadow-2xl transition-all"
              style={{
                width: '794px',
                minHeight: '1123px',
                fontFamily: fontFamilyCss,
                boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
              }}
            >
              <MemoizedTemplateContainer template={activeResume.template} resume={activeResume} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
