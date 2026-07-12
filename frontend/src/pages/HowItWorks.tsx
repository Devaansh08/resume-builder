import React from 'react';
import { Sliders, Sparkles, ArrowRight, Check, Download, FileText, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/shared/PageHeader';
import { Footer } from '../components/layout/Footer';
import { useResumeStore } from '../store/resumeStore';

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const { createNewResume, setCurrentResume } = useResumeStore();

  const handleStartBlank = () => {
    const newResume = createNewResume('Untitled Resume', 'blank');
    setCurrentResume(newResume);
    navigate('/builder');
  };

  const handleCreateNew = () => {
    const newResume = createNewResume('Alex Rivera — Software Architect', 'software');
    setCurrentResume(newResume);
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-transparent flex flex-col justify-between">
      <PageHeader />

      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-24">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs">
            <Sliders size={14} /> How It Works
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-surface-900 dark:text-white leading-tight">
            Transfigure Your Career Story in Four Simple Steps
          </h1>
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-400">
            Our private, client-side editor turns fragmented notes into ATS-perfect, beautifully designed resumes.
          </p>
        </div>

        {/* STEP 1: Choose a Template */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-200/60 dark:border-surface-800">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Templates Category</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500 text-white">ATS Simple</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-500">Modern 2-Col</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Harvard', 'Modern', 'Minimal'].map((name, idx) => (
                <div key={name} className={`rounded-xl p-3.5 border text-center transition-all bg-white dark:bg-surface-850 ${idx === 1 ? 'border-brand-500 shadow-glow-sm' : 'border-gray-200 dark:border-surface-800 opacity-80'}`}>
                  <div className="w-full h-20 bg-[#F5F0E8] rounded-md mb-2.5 flex flex-col p-1.5 gap-1.5 overflow-hidden">
                    <div className="h-2 bg-gray-400 rounded w-10 mx-auto" />
                    <div className="h-1 bg-gray-300 rounded w-14" />
                    <div className="h-px w-full bg-gray-200" />
                    <div className="h-10 bg-gray-200 rounded flex-1" />
                  </div>
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-surface-900 dark:text-white">
              1. Choose an ATS-Verified Template
            </h2>
            <p className="text-base leading-relaxed text-surface-600 dark:text-surface-400">
              Select one of our 8 premium templates inspired by top career advisors and FlowCV. Swapping templates takes a single click — your data automatically re-formats without breaking margins or requiring re-typing.
            </p>
          </div>
        </div>

        {/* STEP 2: Add your experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
          <div className="space-y-4 lg:order-last">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-surface-900 dark:text-white">
              2. Add Your Experience & Bullet Points
            </h2>
            <p className="text-base leading-relaxed text-surface-600 dark:text-surface-400">
              Type directly into guided form fields or upload an existing PDF/DOCX to auto-populate your resume. Use our built-in rich text tools (`bold`, `italic`, bullet links) to make achievements pop.
            </p>
          </div>
          <div className="bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-6 rounded-3xl shadow-lg">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
              <span>Personal Information & Experience Editor</span>
              <span className="text-[10px] text-emerald-500 font-bold">● Local Auto-Saving</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white dark:bg-surface-800 p-3.5 rounded-xl border border-surface-200 dark:border-surface-700 space-y-2">
                <div className="text-xs font-bold text-surface-900 dark:text-white">Principal AI Infrastructure Lead — CloudScale Systems</div>
                <div className="text-[11px] text-surface-500 pl-2 border-l-2 border-brand-500">
                  • Architected distributed LLM inference gateway handling 3.5M+ daily queries.<br />
                  • Spearheaded migration to Kubernetes, slashing cloud costs by $280K annually.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: Customize layout & design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-6 rounded-3xl shadow-lg space-y-4">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 pb-3 border-b border-surface-200/60 dark:border-surface-800">
              Theme & Layout Studio
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Accent Color</span>
                <div className="flex gap-2">
                  {['#3b5bff', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                    <div key={color} className="w-6 h-6 rounded-full border border-white/60 shadow-sm" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Typography & Density</span>
                <span className="px-2.5 py-1 rounded-lg bg-brand-500 text-white font-bold text-[11px]">Inter + Compact Gap</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-surface-900 dark:text-white">
              3. Customize Colors, Fonts & Spacing
            </h2>
            <p className="text-base leading-relaxed text-surface-600 dark:text-surface-400">
              Fine-tune margins, line heights, font families, and accent colors so your resume matches your target industry whether academic, corporate, or tech.
            </p>
          </div>
        </div>

        {/* STEP 4: Download unlimited PDFs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
          <div className="space-y-4 lg:order-last">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-surface-900 dark:text-white">
              4. Download Instant Interactive PDF
            </h2>
            <p className="text-base leading-relaxed text-surface-600 dark:text-surface-400">
              Export print-perfect, A4/Letter PDFs with interactive clickable links for your email, LinkedIn, and project repositories. Zero fees, zero watermarks, 100% private.
            </p>
          </div>
          <div className="bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-8 rounded-3xl shadow-lg text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-500/10 text-brand-500 mb-4 animate-pulse">
              <Download size={26} />
            </div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">Ready for Recruiters!</h3>
            <p className="text-xs text-gray-500 mb-5">100% ATS Verified — Clickable Anchor Links Included.</p>
            <button onClick={handleCreateNew} className="px-6 py-3 text-sm font-bold bg-brand-500 text-white rounded-xl shadow-glow-sm hover:bg-brand-600 transition-colors flex items-center gap-2">
              <FileText size={16} /> Start Building Now
            </button>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-surface-900 dark:text-white">
            Ready to Transmute Your Resume?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleCreateNew} className="btn btn-primary btn-lg gap-2 font-extrabold">
              <Sparkles size={16} /> Open Builder with Demo Data
            </button>
            <button onClick={handleStartBlank} className="btn btn-outline btn-lg gap-2 font-bold">
              <PlusCircle size={16} /> Start Blank Resume
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
