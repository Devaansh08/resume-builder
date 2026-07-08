import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Resume } from '../types';
import { ModernTemplate } from '../components/templates/ModernTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { MinimalTemplate } from '../components/templates/MinimalTemplate';
import { ShrineTemplate } from '../components/templates/ShrineTemplate';
import { useResumeStore } from '../store/resumeStore';
import { FileText, Eye, Download, Loader2 } from 'lucide-react';
import { generatePDF } from '../utils/pdf';

export default function SharedResumePage() {
  const { shareId } = useParams<{ shareId: string }>();
  const { setCurrentResume, currentResume } = useResumeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/share/${shareId}`);
        if (!res.ok) {
          setError('This resume is not publicly available or the link has expired.');
          return;
        }
        const data = await res.json();
        setCurrentResume(data.resume as Resume);
        setViewCount(data.shareInfo?.views || 0);
      } catch {
        setError('Failed to load resume.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [shareId, setCurrentResume]);

  const TEMPLATE_MAP: Record<string, React.ComponentType> = {
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <p className="text-gray-500">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">Resume Not Available</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/" className="btn btn-primary btn-md">Go Home</Link>
        </div>
      </div>
    );
  }

  if (!currentResume) return null;

  const TemplateComponent = TEMPLATE_MAP[currentResume.template] || ModernTemplate;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-surface-950">
      {/* Top bar */}
      <div className="sticky top-0 z-40 glass border-b border-white/20 dark:border-surface-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-sm">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Eye size={12} /> {viewCount} views
            </span>
            <button
              onClick={() => generatePDF(currentResume.id, currentResume.sections.personalInfo.name || 'Resume')}
              className="btn btn-primary btn-sm gap-1.5"
            >
              <Download size={14} /> Download PDF
            </button>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Build Yours Free →
            </Link>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="flex justify-center py-10 px-4">
        <div
          id="resume-preview"
          className="bg-white shadow-2xl"
          style={{ width: '794px', minHeight: '1123px' }}
        >
          <TemplateComponent />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center py-12 bg-gradient-to-r from-brand-500 to-purple-600">
        <h3 className="font-display font-bold text-2xl text-white mb-2">
          Create your own resume — it's free!
        </h3>
        <p className="text-brand-100 mb-6">ATS-optimized templates, live preview, PDF download</p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-6 py-3 rounded-2xl hover:bg-brand-50 transition-colors">
          Get Started Free →
        </Link>
      </div>
    </div>
  );
}
