import { useRef, useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { ModernTemplate } from '../templates/ModernTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { ShrineTemplate } from '../templates/ShrineTemplate';
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate';
import { CreativeTemplate } from '../templates/CreativeTemplate';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { TemplateId } from '../../types';
import { FONT_OPTIONS } from '../../utils/defaults';

// All 10 template IDs mapped to actual unique components
const TEMPLATE_MAP: Record<TemplateId, React.ComponentType> = {
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
};

export function PreviewPanel() {
  const { currentResume, zoomLevel, setZoomLevel } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!currentResume) return null;

  const TemplateComponent = TEMPLATE_MAP[currentResume.template] || ModernTemplate;
  const fontObj = FONT_OPTIONS.find((f) => f.id === currentResume.theme.fontFamily);
  const fontFamilyCss = fontObj ? fontObj.family : currentResume.theme.fontFamily || 'Inter, sans-serif';

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 10, 150));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 10, 50));

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
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2.5 flex-shrink-0"
        style={{ borderBottom: '1px solid #DDD4BF', backgroundColor: '#EDE5D5' }}
      >
        <span className="section-label">Live Preview</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="btn btn-ghost p-1.5"
            style={{ color: '#8A7A60' }}
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs min-w-[42px] text-center font-mono" style={{ color: '#6A5E48' }}>{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            className="btn btn-ghost p-1.5"
            style={{ color: '#8A7A60' }}
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-ghost p-1.5 ml-1"
            style={{ color: '#8A7A60' }}
            title="Fullscreen preview"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div
        className="flex-1 overflow-auto flex justify-center p-6"
        style={{ backgroundColor: '#C8BAA0' }}
      >
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
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
              boxShadow: '0 4px 24px rgba(26, 26, 62, 0.2), 0 1px 4px rgba(26, 26, 62, 0.1)',
            }}
          >
            <TemplateComponent />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ borderTop: '1px solid #DDD4BF', backgroundColor: '#EDE5D5' }}
      >
        <span className="text-xs" style={{ color: '#8A7A60' }}>A4 · 794 × 1123px</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium capitalize" style={{ color: '#6A5E48' }}>
            {templateLabels[currentResume.template] || currentResume.template} template
          </span>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ backgroundColor: 'rgba(26, 26, 62, 0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsFullscreen(false)}
        >
          <div
            style={{
              transform: 'scale(0.85)',
              transformOrigin: 'center center',
              cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white shadow-2xl"
              style={{ width: '794px', minHeight: '1123px', fontFamily: fontFamilyCss }}
            >
              <TemplateComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
