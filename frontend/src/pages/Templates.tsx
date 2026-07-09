import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import type { TemplateId } from '../types';
import { FileText, ArrowRight, Upload } from 'lucide-react';
import { ImportModal } from '../components/builder/ImportModal';
import { Footer } from '../components/layout/Footer';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', gradient: 'from-blue-500 via-indigo-500 to-purple-600', desc: 'Two-column layout with vibrant accent colors. Perfect for tech & design roles.' },
  { id: 'professional', name: 'Professional', gradient: 'from-slate-600 to-slate-800', desc: 'Classic serif typography. Ideal for finance, law, and traditional industries.' },
  { id: 'minimal', name: 'Minimal', gradient: 'from-zinc-400 to-zinc-600', desc: 'Ultra-clean with generous whitespace. Less is more.' },
  { id: 'google', name: 'Google Style', gradient: 'from-blue-400 via-red-400 to-yellow-400', desc: 'Inspired by Google\'s resume format. Simple and highly ATS-friendly.' },
  { id: 'harvard', name: 'Harvard', gradient: 'from-red-700 to-red-900', desc: 'Classic academic format favored by top universities.' },
  { id: 'stanford', name: 'Stanford', gradient: 'from-red-500 to-orange-600', desc: 'Clean and modern. Great for MBA and academic applications.' },
  { id: 'microsoft', name: 'Microsoft', gradient: 'from-blue-600 to-cyan-500', desc: 'Corporate-ready with clear hierarchy. Perfect for FAANG applications.' },
  { id: 'creative', name: 'Creative', gradient: 'from-purple-500 via-pink-500 to-red-500', desc: 'Bold and expressive. Designed to stand out in creative industries.' },
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { currentResume, createNewResume, setCurrentResume, updateTemplate } = useResumeStore();
  const [showImportModal, setShowImportModal] = useState(false);

  const handleSelectTemplate = (templateId: string) => {
    if (currentResume) {
      updateTemplate(templateId as TemplateId);
    } else {
      const newResume = createNewResume('My Resume');
      newResume.template = templateId as TemplateId;
      setCurrentResume(newResume);
    }
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-white/20 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="btn btn-outline btn-md gap-1.5 border-brand-300 text-brand-600 dark:border-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40"
            >
              <Upload size={16} /> Upload (`.pdf / .docx`)
            </button>
            <button onClick={() => navigate('/builder')} className="btn btn-primary btn-md gap-1.5">
              Open Builder <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSuccess={() => navigate('/builder')} />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-4">
            Choose Your <span className="gradient-text">Template</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            8 professionally designed, ATS-optimized templates. All free.
            Switch anytime right inside the editor without losing your data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((t, i) => (
            <div
              key={t.id}
              onClick={() => handleSelectTemplate(t.id)}
              className="group card-hover overflow-hidden animate-slide-up cursor-pointer"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Preview */}
              <div className={`h-52 bg-gradient-to-br ${t.gradient} relative flex items-center justify-center`}>
                <div className="w-28 h-36 bg-white/20 rounded-lg shadow-lg flex flex-col p-3 gap-2 group-hover:scale-105 transition-transform duration-300">
                  <div className="h-2 bg-white/60 rounded" />
                  <div className="h-1.5 bg-white/40 rounded w-3/4" />
                  <div className="h-px bg-white/20 my-1" />
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-1 bg-white/30 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="badge bg-white/20 text-white text-xs border border-white/30">
                    Free
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.name}</h3>
                  <span className="text-brand-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Use <ArrowRight size={12} />
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pb-12">
          <p className="text-gray-500 mb-4">Not sure which to pick?</p>
          <button onClick={() => navigate('/builder')} className="btn btn-primary btn-xl shadow-glow-brand gap-2">
            Start Building — Switch Templates Anytime
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
