import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { parseFile } from '../utils/fileParser';
import {
  FileText, Zap, Shield, Download, Eye, BarChart3,
  Sparkles, ChevronRight, Star, Check, ArrowRight, Github, Globe,
  Upload, Loader2
} from 'lucide-react';

const FEATURES = [
  { icon: <Zap size={22} />, title: 'ATS Optimized', desc: 'Every template is built to pass Applicant Tracking Systems with 90%+ scores' },
  { icon: <Eye size={22} />, title: 'Live Preview', desc: 'See your resume update in real-time as you type — no refresh needed' },
  { icon: <Sparkles size={22} />, title: 'AI-Powered & Parsed', desc: 'Upload your existing PDF or DOCX and let our smart parser fill out your sections automatically' },
  { icon: <Download size={22} />, title: 'Free PDF Export', desc: 'Download print-perfect A4/Letter PDFs with no watermarks, forever free' },
  { icon: <Shield size={22} />, title: '100% Local & Private', desc: 'Your data stays right in your browser. No account needed, complete privacy guaranteed' },
  { icon: <BarChart3 size={22} />, title: 'Resume Score', desc: 'Get detailed ATS analysis with actionable suggestions to improve your resume' },
];

const TEMPLATES = [
  { id: 'modern', name: 'Modern', gradient: 'from-blue-500 to-indigo-600', desc: 'Clean, professional, perfect for tech' },
  { id: 'minimal', name: 'Minimal', gradient: 'from-gray-500 to-slate-600', desc: 'Less is more — elegant simplicity' },
  { id: 'creative', name: 'Creative', gradient: 'from-purple-500 to-pink-600', desc: 'Stand out with bold typography' },
  { id: 'harvard', name: 'Harvard', gradient: 'from-red-600 to-red-800', desc: 'Classic academic format' },
];

const STATS = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '94%', label: 'ATS Pass Rate' },
  { value: '8', label: 'Free Templates' },
  { value: 'Instant', label: 'No Sign-up' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Software Engineer at Google', text: 'Landed my dream job using ResumeAI. The ATS score feature and zero sign-up required is amazing!' },
  { name: 'Rahul M.', role: 'Product Manager at Flipkart', text: 'Best free resume builder out there. The live preview and instant PDF upload save so much time.' },
  { name: 'Ananya K.', role: 'Data Scientist at Microsoft', text: 'Uploaded my old resume and the parser filled everything out. Downloaded a clean modern PDF in 3 minutes!' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { createNewResume, setCurrentResume } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateNew = () => {
    const resume = createNewResume('My Resume');
    setCurrentResume(resume);
    navigate('/builder');
  };

  const handleUploadClick = () => {
    setErrorMsg(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setErrorMsg(null);

    try {
      const parsedSections = await parseFile(file);
      const title = file.name.replace(/\.[^/.]+$/, '') || 'My Resume';
      const resume = createNewResume(title);
      resume.sections = parsedSections;
      setCurrentResume(resume);
      navigate('/builder');
    } catch (err: unknown) {
      console.error('[File Upload Parse Error]', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to parse file. Please try again or create from scratch.');
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 overflow-x-hidden">

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />

      {/* Parsing Overlay */}
      {isParsing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-surface-800 animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
              Parsing Your Resume...
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Extracting text and organizing your sections into our ATS-optimized builder.
            </p>
          </div>
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/20 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-glow-sm">
                <FileText size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                Resume<span className="gradient-text">AI</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/templates" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Templates</Link>
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Reviews</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <button onClick={handleUploadClick} className="btn btn-ghost btn-md hidden md:inline-flex gap-2">
                <Upload size={16} /> Upload Resume
              </button>
              <button onClick={handleCreateNew} className="btn btn-primary btn-md gap-1.5">
                Build Resume <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white dark:to-surface-950" />

        {/* Floating orbs */}
        <div className="absolute top-32 left-1/4 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles size={14} className="text-brand-500" />
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide">Instant & Free — No Sign-in Required</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up text-balance">
            Upload & Edit Your{' '}
            <span className="gradient-text">ATS-Ready</span>{' '}
            Resume<br />In Minutes
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Upload an existing PDF or DOCX to auto-fill the editor, or build from scratch using our 8 professional templates. Download instantly as print-perfect PDF.
          </p>

          {/* Error message */}
          {errorMsg && (
            <div className="max-w-md mx-auto mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleUploadClick}
              className="btn btn-primary btn-xl shadow-glow-brand gap-2.5 w-full sm:w-auto"
            >
              <Upload size={20} />
              Upload Resume (PDF/DOCX)
            </button>
            <button
              onClick={handleCreateNew}
              className="btn btn-secondary btn-xl gap-2 w-full sm:w-auto"
            >
              <Sparkles size={18} />
              Create from Scratch
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {['No sign-in or account', 'No watermarks ever', 'Upload PDF/DOCX/TXT', 'Instant A4 PDF download'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check size={14} className="text-green-500" />
                {item}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-3xl gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50/50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 badge badge-brand mb-4">
              <Zap size={12} /> Features
            </div>
            <h2 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-4">
              Everything you need to land your{' '}
              <span className="gradient-text">dream job</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Premium features that other builders charge for — all completely free without sign-up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title}
                className="card-hover p-6 group cursor-default animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates Preview ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 badge badge-brand mb-4">
              <FileText size={12} /> Templates
            </div>
            <h2 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-4">
              8 <span className="gradient-text">Professional</span> Templates
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              All free. Switch anytime with a single click right in the editor.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((t) => (
              <Link key={t.id} to="/templates"
                className="group block card-hover overflow-hidden">
                <div className={`h-40 bg-gradient-to-br ${t.gradient} flex items-center justify-center transition-transform group-hover:scale-105 duration-500`}>
                  <FileText size={48} className="text-white/30" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Preview</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/templates" className="btn btn-outline btn-lg">
              View All 8 Templates <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-gray-50/50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-4">
              Loved by <span className="gradient-text">50,000+</span> job seekers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card group hover:-translate-y-1 transition-transform duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative bg-gradient-to-br from-brand-500 to-purple-600 rounded-4xl p-12 overflow-hidden noise">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h2 className="font-display font-bold text-4xl text-white mb-4">
                Ready to land your dream job?
              </h2>
              <p className="text-brand-100 mb-8 text-lg">
                No sign-in required. Upload your file or start fresh now.
              </p>
              <button onClick={handleUploadClick} className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-2xl hover:bg-brand-50 transition-colors shadow-lg text-base">
                <Upload size={20} />
                Upload Resume & Start Editing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-surface-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500" />
              <span className="font-display font-bold text-gray-900 dark:text-white">
                Resume<span className="gradient-text">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help</a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <a href="https://github.com/devansh-kumar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 dark:hover:text-white transition-colors"><Github size={18} /></a>
              <a href="#" className="hover:text-gray-600 dark:hover:text-white transition-colors"><Globe size={18} /></a>
            </div>
          </div>
          <div className="text-center mt-8 text-xs text-gray-400">
            © 2026 ResumeAI. Developed by <a href="https://github.com/devansh-kumar" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 font-semibold underline">Devansh Kumar</a>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
