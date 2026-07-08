import { useRef, useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { ModernTemplate } from '../templates/ModernTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { ShrineTemplate } from '../templates/ShrineTemplate';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { TemplateId } from '../../types';

const TEMPLATE_MAP: Record<TemplateId, React.ComponentType> = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  google: ProfessionalTemplate,
  harvard: ProfessionalTemplate,
  stanford: MinimalTemplate,
  microsoft: ModernTemplate,
  creative: ModernTemplate,
  shrine: ShrineTemplate,
};

export function PreviewPanel() {
  const { currentResume, zoomLevel, setZoomLevel } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!currentResume) return null;

  const TemplateComponent = TEMPLATE_MAP[currentResume.template] || ModernTemplate;

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 10, 150));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 10, 50));

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 dark:border-surface-700 bg-gray-100 dark:bg-surface-800 flex-shrink-0">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Live Preview</span>
        <div className="flex items-center gap-1">
          <button onClick={handleZoomOut} className="btn btn-ghost p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-white">
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-gray-500 min-w-[40px] text-center">{zoomLevel}%</span>
          <button onClick={handleZoomIn} className="btn btn-ghost p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-white">
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-ghost p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-white ml-1"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-gray-300 dark:bg-surface-700 flex justify-center p-6">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200"
        >
          {/* A4 paper shadow */}
          <div
            ref={previewRef}
            id="resume-preview"
            className="bg-white shadow-2xl"
            style={{
              width: '794px', // A4 width at 96dpi
              minHeight: '1123px', // A4 height at 96dpi
            }}
          >
            <TemplateComponent />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-surface-700 bg-gray-100 dark:bg-surface-800 flex-shrink-0">
        <span className="text-xs text-gray-400">A4 · 1 page</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 capitalize">{currentResume.template} template</span>
        </div>
      </div>
    </div>
  );
}
