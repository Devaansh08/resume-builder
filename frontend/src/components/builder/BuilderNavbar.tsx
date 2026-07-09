import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import type { Resume } from '../../types';
import {
  FileText, ChevronLeft, Download, BarChart3,
  Check, Smartphone, Monitor, Columns, Upload, PenLine
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

export function BuilderNavbar({ resume, showATS, onToggleATS, isMobilePreview, onToggleMobilePreview, onSetLayoutRatio, currentRatio = 48 }: BuilderNavbarProps) {
  const { isDirty, lastSaved, atsResult } = useResumeStore();
  const navigate = useNavigate();
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExportPDF = useCallback(async () => {
    await generatePDF(resume.id, resume.title);
  }, [resume]);

  const scoreColor =
    atsResult
      ? atsResult.score >= 80 ? '#10b981' : atsResult.score >= 60 ? '#d97706' : '#ef4444'
      : '#A89880';

  return (
    <header
      className="h-14 flex items-center px-4 gap-3 flex-shrink-0 relative z-30"
      style={{ backgroundColor: '#FDFCF8', borderBottom: '1px solid #DDD4BF' }}
    >
      {/* Logo + Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 transition-opacity hover:opacity-70"
        title="Back to home"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#C41E3A' }}>
          <PenLine size={14} className="text-white" />
        </div>
        <span className="hidden sm:flex items-center gap-1 text-sm font-semibold" style={{ color: '#1A1A3E' }}>
          <ChevronLeft size={14} style={{ color: '#8A7A60' }} />
          Home
        </span>
      </button>

      <div className="w-px h-5" style={{ backgroundColor: '#DDD4BF' }} />

      {/* Resume title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(196, 30, 58, 0.1)' }}>
          <FileText size={12} style={{ color: '#C41E3A' }} />
        </div>
        <span className="font-semibold text-sm truncate" style={{ color: '#1A1A3E' }}>
          {resume.title}
        </span>
      </div>

      {/* Save status */}
      <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: '#A89880' }}>
        {isDirty ? (
          <><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#d97706' }} /> Saving...</>
        ) : lastSaved ? (
          <><Check size={12} style={{ color: '#10b981' }} /> Saved locally</>
        ) : (
          <><Check size={12} style={{ color: '#10b981' }} /> Saved locally</>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Upload/Import Resume button */}
        <button
          type="button"
          onClick={() => setShowImportModal(true)}
          className="btn btn-sm gap-1.5 text-xs"
          style={{
            border: '1px solid rgba(196, 30, 58, 0.3)',
            color: '#C41E3A',
            backgroundColor: 'rgba(196, 30, 58, 0.04)',
            borderRadius: '8px',
            padding: '6px 12px',
          }}
          title="Upload or import existing PDF / DOCX resume"
        >
          <Upload size={13} />
          <span className="hidden lg:inline">Upload / Import</span>
        </button>

        {/* Layout Presets Toggle */}
        {onSetLayoutRatio && !isMobilePreview && (
          <div className="relative">
            <button
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
              className="btn btn-ghost btn-sm gap-1.5 text-xs"
              style={{ color: '#8A7A60' }}
              title="Adjust Editor / Preview split ratio"
            >
              <Columns size={15} />
              <span className="hidden xl:inline">Layout</span>
            </button>

            {showLayoutMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 rounded-xl shadow-xl py-1.5 z-50"
                style={{ backgroundColor: '#FDFCF8', border: '1px solid #DDD4BF' }}
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#A89880', borderBottom: '1px solid #EDE5D5' }}>
                  Panel Width Ratios
                </div>
                {[
                  { label: 'Compact Editor (35/65)', val: 35, match: (r: number) => r < 40 },
                  { label: 'Split 50 / 50', val: 50, match: (r: number) => r >= 40 && r <= 56 },
                  { label: 'Wide Editor (65/35)', val: 64, match: (r: number) => r > 56 },
                ].map(({ label, val, match }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { onSetLayoutRatio(val); setShowLayoutMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
                    style={{
                      color: match(currentRatio) ? '#C41E3A' : '#5C5040',
                      fontWeight: match(currentRatio) ? 600 : 400,
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(196, 30, 58, 0.04)')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span>{label}</span>
                    {match(currentRatio) && <Check size={12} style={{ color: '#C41E3A' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile/Desktop toggle */}
        <button
          onClick={onToggleMobilePreview}
          className="btn btn-sm p-2"
          style={{
            backgroundColor: isMobilePreview ? '#C41E3A' : 'transparent',
            color: isMobilePreview ? 'white' : '#8A7A60',
            border: isMobilePreview ? 'none' : '1px solid #DDD4BF',
            borderRadius: '8px',
          }}
          title="Toggle preview"
        >
          {isMobilePreview ? <Monitor size={15} /> : <Smartphone size={15} />}
        </button>

        {/* ATS Score */}
        <button
          onClick={onToggleATS}
          className="btn btn-sm gap-1.5 text-xs"
          style={{
            backgroundColor: showATS ? '#C41E3A' : 'transparent',
            color: showATS ? 'white' : '#5C5040',
            border: showATS ? 'none' : '1px solid #DDD4BF',
            borderRadius: '8px',
            padding: '6px 12px',
          }}
        >
          <BarChart3 size={14} />
          <span className="font-bold" style={{ color: showATS ? 'white' : scoreColor }}>
            {atsResult ? `${atsResult.score}` : '—'}
          </span>
          <span className="hidden md:inline">ATS Score</span>
        </button>

        {/* Export PDF */}
        <button
          onClick={handleExportPDF}
          className="btn btn-sm gap-1.5 text-xs font-semibold"
          style={{
            backgroundColor: '#C41E3A',
            color: 'white',
            borderRadius: '8px',
            padding: '6px 14px',
            boxShadow: '0 1px 4px rgba(196, 30, 58, 0.3)',
          }}
        >
          <Download size={14} />
          <span className="hidden md:inline">Download PDF</span>
        </button>
      </div>

      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </header>
  );
}
