import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { parseFile } from '../utils/fileParser';
import {
  FileText, Zap, Shield, Download, Eye, BarChart3,
  Sparkles, Star, Check, ArrowRight,
  Upload, Loader2, PenLine, BookOpen
} from 'lucide-react';
import { Footer } from '../components/layout/Footer';

const FEATURES = [
  { icon: <Zap size={20} />, title: 'ATS Optimized', desc: 'Every template built to pass Applicant Tracking Systems with 90%+ scores', color: 'bg-marker/30 text-amber-700' },
  { icon: <Eye size={20} />, title: 'Live Preview', desc: 'See your resume update in real-time as you type — no refresh needed', color: 'bg-rule/30 text-blue-700' },
  { icon: <Sparkles size={20} />, title: 'Smart Parser', desc: 'Upload your existing PDF or DOCX and let our parser auto-fill your sections', color: 'bg-mint/30 text-green-700' },
  { icon: <Download size={20} />, title: 'Free PDF Export', desc: 'Download print-perfect A4/Letter PDFs with no watermarks, forever free', color: 'bg-eraser/40 text-pink-700' },
  { icon: <Shield size={20} />, title: '100% Private', desc: 'Your data stays right in your browser. No account needed, complete privacy', color: 'bg-paper-300/60 text-stone-700' },
  { icon: <BarChart3 size={20} />, title: 'Resume Score', desc: 'Get detailed ATS analysis with actionable suggestions to improve your score', color: 'bg-margin-100 text-margin-700' },
];

const TEMPLATES = [
  { id: 'modern', name: 'Modern', badge: 'Most Popular', desc: 'Two-column with accent colors. Perfect for tech & design.' },
  { id: 'professional', name: 'Professional', badge: 'Classic', desc: 'Serif typography. Ideal for finance, law & business.' },
  { id: 'minimal', name: 'Minimal', badge: 'Clean', desc: 'Generous whitespace. Let your content shine.' },
  { id: 'executive', name: 'Executive', badge: 'Academic', desc: 'Harvard-style centered layout for prestigious roles.' },
  { id: 'creative', name: 'Creative', badge: 'Bold', desc: 'Color sidebar that makes you stand out.' },
  { id: 'shrine', name: 'Shrine', badge: 'Elegant', desc: 'Material Design warmth with peach & brown tones.' },
];

const STATS = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '94%', label: 'ATS Pass Rate' },
  { value: '8', label: 'Free Templates' },
  { value: 'Zero', label: 'Sign-up Needed' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Software Engineer at Google', text: 'Landed my dream job using this builder. The ATS score feature and zero sign-up is amazing!', rotate: '-rotate-1' },
  { name: 'Rahul M.', role: 'Product Manager at Flipkart', text: 'Best free resume builder out there. The live preview and instant PDF export save so much time.', rotate: 'rotate-1' },
  { name: 'Ananya K.', role: 'Data Scientist at Microsoft', text: 'Uploaded my old resume and the parser filled everything out. Got a clean PDF in under 3 minutes!', rotate: '-rotate-1' },
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
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#F5F0E8' }}>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', overflow: 'hidden' }}
      />

      {/* Parsing Overlay */}
      {isParsing && (
        <div className="fixed inset-0 z-50 bg-ink-600/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in" style={{ backgroundColor: '#FDFCF8', border: '1px solid #EDE5D5' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft" style={{ backgroundColor: 'rgba(196, 30, 58, 0.1)' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: '#C41E3A' }} />
            </div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: '#1A1A3E' }}>Parsing Your Resume...</h3>
            <p className="text-sm" style={{ color: '#8A7A60' }}>Extracting text and organizing your sections.</p>
          </div>
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b" style={{ borderColor: 'rgba(184, 212, 232, 0.4)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#C41E3A' }}>
                <PenLine size={16} className="text-white" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-display font-bold text-xl" style={{ color: '#1A1A3E' }}>Resume</span>
                <span className="font-handwriting font-bold text-xl" style={{ color: '#C41E3A' }}>AI</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/templates" className="text-sm font-medium transition-colors" style={{ color: '#5C5040' }} onMouseOver={e => (e.currentTarget.style.color = '#1A1A3E')} onMouseOut={e => (e.currentTarget.style.color = '#5C5040')}>Templates</Link>
              <a href="#features" className="text-sm font-medium transition-colors" style={{ color: '#5C5040' }} onMouseOver={e => (e.currentTarget.style.color = '#1A1A3E')} onMouseOut={e => (e.currentTarget.style.color = '#5C5040')}>Features</a>
              <a href="#testimonials" className="text-sm font-medium transition-colors" style={{ color: '#5C5040' }} onMouseOver={e => (e.currentTarget.style.color = '#1A1A3E')} onMouseOut={e => (e.currentTarget.style.color = '#5C5040')}>Reviews</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <button onClick={handleUploadClick} className="btn btn-ghost btn-md hidden md:inline-flex gap-2 text-sm">
                <Upload size={15} /> Upload Resume
              </button>
              <button onClick={handleCreateNew} className="btn btn-primary btn-md gap-1.5 text-sm">
                Build Resume <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Ruled paper background */}
        <div className="absolute inset-0 paper-surface opacity-50" />
        {/* Red margin line */}
        <div className="absolute top-0 bottom-0 left-[80px] hidden xl:block" style={{ width: '2px', backgroundColor: '#C41E3A', opacity: 0.4 }} />
        {/* Hole punches */}
        <div className="absolute top-20 left-8 hidden xl:flex flex-col gap-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full border-2" style={{ borderColor: '#DDD4BF', backgroundColor: '#F5F0E8' }} />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">

          {/* Annotation badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 animate-fade-in" style={{ backgroundColor: 'rgba(196, 30, 58, 0.08)', border: '1.5px solid rgba(196, 30, 58, 0.2)' }}>
            <Sparkles size={13} style={{ color: '#C41E3A' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C41E3A' }}>Instant & Free — No Sign-in Required</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight animate-slide-up text-balance" style={{ color: '#1A1A3E' }}>
            Build Your{' '}
            <span className="font-handwriting gradient-text" style={{ fontSize: '1.1em' }}>ATS-Ready</span>{' '}
            Resume<br />In Minutes
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8 animate-slide-up leading-relaxed" style={{ color: '#6A5E48', animationDelay: '0.1s' }}>
            Upload an existing PDF or DOCX to auto-fill the editor, or build from scratch with 8 professional templates. Download as a print-perfect PDF instantly.
          </p>

          {/* Error message */}
          {errorMsg && (
            <div className="max-w-md mx-auto mb-6 p-3.5 rounded-xl text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.06)', border: '1px solid rgba(220, 38, 38, 0.2)', color: '#DC2626' }}>
              {errorMsg}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={handleUploadClick} className="btn btn-primary btn-xl shadow-glow-brand gap-2.5 w-full sm:w-auto">
              <Upload size={20} />
              Upload Resume (PDF/DOCX)
            </button>
            <button onClick={handleCreateNew} className="btn btn-secondary btn-xl gap-2 w-full sm:w-auto">
              <PenLine size={18} />
              Create from Scratch
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm animate-fade-in" style={{ animationDelay: '0.4s', color: '#8A7A60' }}>
            {['No sign-in or account', 'No watermarks ever', 'Upload PDF/DOCX/TXT', 'Instant A4 PDF download'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check size={14} style={{ color: '#10b981' }} />
                {item}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-handwriting font-bold text-4xl gradient-text">{stat.value}</div>
                <div className="text-xs mt-1 font-medium" style={{ color: '#8A7A60' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────────── */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 opacity-30 paper-surface" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 badge badge-brand mb-4">
              <BookOpen size={12} /> Features
            </div>
            <h2 className="font-display font-bold text-4xl mb-4" style={{ color: '#1A1A3E' }}>
              Everything you need to land your{' '}
              <span className="font-handwriting gradient-text" style={{ fontSize: '1.05em' }}>dream job</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#6A5E48' }}>
              Premium features that other builders charge for — all completely free, no sign-up ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card-hover p-6 group cursor-default animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#1A1A3E' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6A5E48' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates Preview ──────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 badge badge-brand mb-4">
              <FileText size={12} /> Templates
            </div>
            <h2 className="font-display font-bold text-4xl mb-4" style={{ color: '#1A1A3E' }}>
              8 <span className="font-handwriting gradient-text" style={{ fontSize: '1.05em' }}>Professional</span> Templates
            </h2>
            <p style={{ color: '#6A5E48' }}>All free. Switch anytime with a single click right in the editor.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES.map((t, i) => (
              <Link
                key={t.id}
                to="/templates"
                className="group block card-hover overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Template preview mockup */}
                <div className="h-44 relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#EDE5D5' }}>
                  {/* Notebook-paper template preview */}
                  <div className="w-24 h-32 bg-white rounded shadow-paper flex flex-col p-2 gap-1.5 group-hover:scale-105 transition-transform duration-300 relative">
                    <div className="h-1.5 rounded" style={{ backgroundColor: '#1A1A3E', width: '70%' }} />
                    <div className="h-1 rounded" style={{ backgroundColor: '#C41E3A', width: '50%' }} />
                    <div className="h-px w-full" style={{ backgroundColor: '#B8D4E8', marginTop: '2px' }} />
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-0.5 rounded" style={{ backgroundColor: '#DDD4BF', width: `${55 + j * 8}%` }} />
                    ))}
                    {/* Red margin line on template */}
                    <div className="absolute top-0 bottom-0 left-4" style={{ width: '1px', backgroundColor: '#C41E3A', opacity: 0.5 }} />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-brand text-[10px] py-0.5">{t.badge}</span>
                  </div>
                  <div className="absolute inset-0 bg-ink-600/0 group-hover:bg-ink-600/5 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#C41E3A', color: 'white' }}>Use Template</span>
                  </div>
                </div>

                <div className="p-4" style={{ borderTop: '1px solid #EDE5D5' }}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-semibold text-sm" style={{ color: '#1A1A3E' }}>{t.name}</div>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1" style={{ color: '#C41E3A' }}>Use <ArrowRight size={11} /></span>
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: '#8A7A60' }}>{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/templates" className="btn btn-outline btn-lg gap-2">
              View All 8 Templates <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 opacity-20 paper-surface" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl mb-4" style={{ color: '#1A1A3E' }}>
              Loved by <span className="font-handwriting gradient-text" style={{ fontSize: '1.1em' }}>50,000+</span> job seekers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={`sticky-note ${t.rotate} p-6 group hover:-translate-y-1`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 font-schoolbook" style={{ color: '#3A3028' }}>"{t.text}"</p>
                <div>
                  <div className="font-bold text-sm" style={{ color: '#1A1A3E' }}>{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#8A7A60' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl p-12 overflow-hidden noise" style={{ backgroundColor: '#1A1A3E' }}>
            {/* Ruled lines overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #B8D4E8 27px, #B8D4E8 28px)'
            }} />
            {/* Red margin decoration */}
            <div className="absolute top-0 bottom-0 left-12" style={{ width: '2px', backgroundColor: '#C41E3A', opacity: 0.4 }} />

            <div className="relative">
              <h2 className="font-display font-bold text-4xl text-white mb-4">
                Ready to land your dream job?
              </h2>
              <p className="mb-8 text-lg" style={{ color: '#B8D4E8' }}>
                No sign-in required. Upload your file or start fresh — it's completely free.
              </p>
              <button onClick={handleUploadClick} className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all text-base shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: '#C41E3A', color: 'white' }}>
                <Upload size={20} />
                Upload Resume & Start Editing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
