import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { parseFile } from '../utils/fileParser';
import {
  FileText, Zap, Shield, ShieldCheck, Download, Eye, BarChart3,
  Sparkles, Star, Check, ArrowRight,
  Upload, Loader2, PenLine, BookOpen, Sun, Moon, Palette, Sliders, LayoutGrid, PlusCircle
} from 'lucide-react';
import { Footer } from '../components/layout/Footer';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern (2-Column)',
    badge: 'Most Popular',
    atsScore: '100% ATS Verified • Auto-flow',
    bestFor: 'Tech, FAANG & Full-Stack Engineers',
    layoutStyle: 'sidebar-left',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    desc: 'Contemporary two-column architecture with a high-contrast sidebar, colored accent tags, and profile photo support.',
    features: [
      'Left accent column with skill pill tags',
      'Integrated profile portrait photo box',
      'Ideal for dense technical item listings',
    ],
  },
  {
    id: 'professional',
    name: 'Professional (Classic)',
    badge: 'Classic Serif',
    atsScore: '100% ATS Verified • Traditional',
    bestFor: 'Finance, Law, Investment Banking & MBAs',
    layoutStyle: 'classic-header',
    photoUrl: '',
    desc: 'Timeless serif typography with clean dividing lines and rigorous hierarchy. Trusted by Fortune 500 recruiters.',
    features: [
      'Merriweather / Garamond serif styling',
      'Formal horizontal section dividers',
      'Optimized for financial & legal rigor',
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal (Clean)',
    badge: 'Cleanest',
    atsScore: '100% ATS Verified • High Readability',
    bestFor: 'Designers, Architects & Senior Executives',
    layoutStyle: 'minimal-space',
    photoUrl: '',
    desc: 'Generous whitespace with unencumbered typography. Lets your quantifiable accomplishments speak directly.',
    features: [
      'Ultra-clean breathing space balance',
      'Zero visual clutter or distractors',
      'Maximum focus on bullet impact metrics',
    ],
  },
  {
    id: 'executive',
    name: 'Executive (Centered)',
    badge: 'Academic Gold',
    atsScore: '100% ATS Verified • Academic Standard',
    bestFor: 'Prestigious Roles, Research & Ivy League',
    layoutStyle: 'harvard-center',
    photoUrl: '',
    desc: 'Classic Harvard-style centered header with deep crimson accents. Prestigious, structured, and authoritative.',
    features: [
      'Prominent centered candidate header',
      'Traditional academic section ordering',
      'Refined university-approved margins',
    ],
  },
  {
    id: 'creative',
    name: 'Creative (Sidebar)',
    badge: 'Bold Split',
    atsScore: '100% ATS Verified • High Impact',
    bestFor: 'Product Designers, Marketers & Founders',
    layoutStyle: 'creative-split',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    desc: 'Eye-catching split architecture with bold left accent block and clean right-side project timeline.',
    features: [
      'Bold left colored block with photo',
      'Distinct visual separation of sections',
      'Captures recruiter attention in <3 seconds',
    ],
  },
  {
    id: 'shrine',
    name: 'Shrine (Material Warmth)',
    badge: 'Warm Material',
    atsScore: '100% ATS Verified • Material Design',
    bestFor: 'Consultants, Brand Managers & Creatives',
    layoutStyle: 'shrine-warm',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    desc: 'Material Design inspired aesthetic with warm peach tones, soft card borders, and elegant human-centric typography.',
    features: [
      'Warm earth & peach tone palette',
      'Soft card-style section separation',
      'Human-centric readable typography',
    ],
  },
];

const STATS = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '94%', label: 'ATS Pass Rate' },
  { value: '8', label: 'Free Templates' },
  { value: 'Zero', label: 'Sign-up Needed' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Software Engineer at Google', text: 'Landed my dream job using Resume Alchemist! The ATS formatting feedback and instantaneous PDF export with zero sign-up is incredible!', rotate: '-rotate-1' },
  { name: 'Rahul M.', role: 'Product Manager at Flipkart', text: 'The best free resume editor available online. The live preview side-by-side layouts save so much trial and error.', rotate: 'rotate-1' },
  { name: 'Ananya K.', role: 'Data Scientist at Microsoft', text: 'Uploaded my old ugly DOCX resume, and the Alchemist parser structured everything beautifully into a clean template in minutes!', rotate: '-rotate-1' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { createNewResume, setCurrentResume, themeMode = 'light', setThemeMode } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDark = themeMode === 'dark';

  const handleCreateNew = () => {
    const resume = createNewResume('Alex Rivera — Software Architect', 'software');
    setCurrentResume(resume);
    navigate('/builder');
  };

  const handleStartBlank = () => {
    const resume = createNewResume('Untitled Fresh Resume', 'blank');
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
      const resume = createNewResume(title, 'blank');
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
    <div className="min-h-screen overflow-x-hidden transition-colors duration-300 bg-[#FAF7F2] dark:bg-gradient-to-br dark:from-[#2a0812] dark:via-[#140609] dark:to-[#080204] text-surface-900 dark:text-surface-100 relative">
      {/* Animated Dark Red Gradient Glow in Dark Mode */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-600/25 via-rose-600/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-red-700/20 via-brand-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

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
          <div className="rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft bg-brand-500/10">
              <Loader2 size={32} className="animate-spin text-brand-500" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-surface-900 dark:text-white">Transmuting Your Resume...</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">Extracting data and structuring sections.</p>
          </div>
        </div>
      )}

      {/* ── Rounded Glass Navbar ───────────────────────────────────────────── */}
      <nav className="fixed top-3 left-3 right-3 sm:left-6 sm:right-6 max-w-7xl mx-auto z-40 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-surface-900/75 border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 transition-all">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Text Only */}
            <Link to="/" className="flex items-center gap-2 group select-none">
              <span className="font-display font-bold text-lg sm:text-xl text-surface-900 dark:text-white tracking-tight">Resume</span>
              <span className="font-schoolbook font-bold text-lg sm:text-xl text-brand-600 dark:text-brand-400 italic">Alchemist</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/templates" className="text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Templates</Link>
              <a href="#steps" className="text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">How it works</a>
              <a href="#testimonials" className="text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Reviews</a>
            </div>

            {/* CTA + Theme Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
                className="p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors border border-surface-200 dark:border-surface-700"
                title="Toggle Dark/Light Mode"
              >
                {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 border border-surface-200 dark:border-surface-700"
                title="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <span className="font-bold text-sm leading-none block w-4 h-4 flex items-center justify-center">✕</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <button onClick={handleUploadClick} className="btn btn-ghost btn-md hidden md:inline-flex gap-1.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 font-semibold">
                <Upload size={15} /> Upload
              </button>
              <button onClick={handleStartBlank} className="btn btn-outline btn-md hidden sm:inline-flex gap-1.5 text-sm border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-bold shadow-xs">
                <PlusCircle size={15} /> Fresh Blank
              </button>
              <button onClick={handleCreateNew} className="btn btn-primary btn-md hidden sm:inline-flex gap-1.5 text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-sm font-bold">
                <Sparkles size={14} className="text-amber-300" /> Start with Demo <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-surface-200/60 dark:border-surface-800 bg-white dark:bg-surface-900 px-4 py-4 space-y-3 animate-slide-down shadow-lg">
            <Link
              to="/templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-brand-500 py-1"
            >
              Templates
            </Link>
            <a
              href="#steps"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-brand-500 py-1"
            >
              How it works
            </a>
            <a
              href="#testimonials"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-brand-500 py-1"
            >
              Reviews
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleUploadClick(); }}
                className="w-full btn btn-ghost btn-sm flex items-center justify-center gap-2 text-sm text-surface-700 dark:text-surface-200 py-2 border border-surface-200 dark:border-surface-700 font-semibold"
              >
                <Upload size={14} /> Upload PDF / DOCX
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleStartBlank(); }}
                className="w-full btn btn-outline btn-sm flex items-center justify-center gap-1.5 text-sm border-amber-400 text-amber-700 dark:text-amber-400 py-2 shadow-xs font-bold"
              >
                <PlusCircle size={14} /> Build Fresh Blank Resume
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleCreateNew(); }}
                className="w-full btn btn-primary btn-sm flex items-center justify-center gap-1.5 text-sm bg-brand-500 text-white py-2 shadow-sm font-bold"
              >
                <Sparkles size={14} className="text-amber-300" /> Start with Demo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Ruled paper background */}
        <div className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none" />
        {/* Red margin line */}
        <div className="absolute top-0 bottom-0 left-[80px] hidden xl:block w-[2px] bg-brand-500/30 dark:bg-brand-500/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Annotation badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-brand-500/10 border border-brand-500/20">
                <Sparkles size={13} className="text-brand-500 dark:text-brand-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Instant Alchemy — 100% Free & Private</span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-surface-900 dark:text-white">
                Create a <span className="font-schoolbook italic font-normal text-brand-500 dark:text-brand-400">professional resume</span> in minutes
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-surface-600 dark:text-surface-300 max-w-xl">
                Resume Alchemist makes it easy to structure, customize, and transfigure your career story. Upload an existing file or build fresh. Fully client-side data privacy.
              </p>

              {/* Error message */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                  {errorMsg}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3.5 pt-2">
                <button onClick={handleCreateNew} className="btn btn-primary btn-xl gap-2 w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand font-extrabold text-sm sm:text-base px-6">
                  <Sparkles size={18} className="text-amber-300 shrink-0" />
                  Start with Demo Resume <ArrowRight size={16} />
                </button>
                <button onClick={handleStartBlank} className="btn btn-xl gap-2 w-full sm:w-auto bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-2 border-amber-400/60 hover:bg-amber-500/25 dark:hover:bg-amber-500/30 shadow-md font-extrabold text-sm sm:text-base px-6 transition-all">
                  <PlusCircle size={18} className="shrink-0" />
                  Build Fresh Resume (Blank)
                </button>
                <button onClick={handleUploadClick} className="btn btn-secondary btn-xl gap-2 w-full sm:w-auto bg-white dark:bg-surface-800 text-surface-900 dark:text-white border border-surface-300 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 shadow-sm font-bold text-sm sm:text-base px-5">
                  <Upload size={18} className="text-brand-500 shrink-0" />
                  Upload PDF / DOCX
                </button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-6 text-sm text-surface-600 dark:text-surface-400 max-w-md">
                {['No sign-in or account', 'No watermarks ever', 'Local Browser Storage only', 'Instant A4 PDF download'].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-brand-500 shrink-0" />
                    <span className="font-medium text-xs">{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              {/* Decorative background aura */}
              <div className="absolute inset-0 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl -z-10 scale-95" />
              
              {/* Premium Floating Notebook Resume Card Mockup with Real Data */}
              <div className="w-full max-w-[380px] bg-[#F9F6F0] dark:bg-[#FAF7F2] border border-[#DDD4BF] rounded-2xl p-5 sm:p-6 shadow-2xl relative transform -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-500 ease-out select-none text-gray-800">
                {/* Red margin notebook accent line */}
                <div className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-[#C41E3A]/40" />

                {/* Resume Populated Real Data Contents */}
                <div className="space-y-3 ml-5">
                  {/* Header Row: Candidate Info & Portrait */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#E6DEC8] pb-2.5">
                    <div className="space-y-0.5">
                      <div className="font-display font-extrabold text-base sm:text-lg text-gray-900 leading-tight">Alex Morgan</div>
                      <div className="font-semibold text-[11px] sm:text-xs text-brand-600 tracking-wide">Senior Cloud Architect & AI Lead</div>
                      <div className="text-[9px] text-gray-500 font-medium">alex.morgan@alchemist.io • San Francisco, CA</div>
                    </div>
                    {/* Authentic Profile Picture */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-surface-200 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Section: Professional Experience */}
                  <div className="space-y-2 text-left">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-800 border-b border-[#E6DEC8] pb-0.5">
                      Experience
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-900">
                          <span>Principal AI Infrastructure Lead</span>
                          <span className="text-[9px] font-semibold text-gray-500">2023 – Present</span>
                        </div>
                        <div className="text-[9px] font-semibold text-brand-600">CloudScale Systems Inc.</div>
                        <div className="text-[9px] text-gray-700 leading-snug mt-0.5 pl-2 border-l-2 border-brand-500/30">
                          • Architected distributed LLM inference gateway handling 3.5M+ daily queries with sub-45ms latency.<br />
                          • Spearheaded migration of 40+ microservices to Kubernetes, slashing cloud costs by $280K annually.
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-900">
                          <span>Senior Software Engineer</span>
                          <span className="text-[9px] font-semibold text-gray-500">2020 – 2023</span>
                        </div>
                        <div className="text-[9px] font-semibold text-gray-600">DataGrid Corp</div>
                        <div className="text-[9px] text-gray-700 leading-snug mt-0.5 pl-2 border-l-2 border-gray-300">
                          • Engineered high-throughput Kafka streaming pipeline processing 100k+ real-time events per second.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Core Skills Matrix */}
                  <div className="space-y-1.5 pt-1 text-left">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-800 border-b border-[#E6DEC8] pb-0.5">
                      Skills & Expertise
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {['TypeScript', 'React 19', 'Python / PyTorch', 'AWS EKS', 'Kubernetes', 'GraphQL', 'Distributed Systems'].map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[8px] bg-white border border-[#DDD4BF] font-bold text-gray-700 shadow-2xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating overlay chip */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-surface-850 border border-brand-200 dark:border-surface-700 rounded-xl p-3 shadow-lg flex items-center gap-2.5 animate-bounce-slow">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-500/10">
                    <Sparkles size={16} className="text-brand-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-brand-600 dark:text-brand-400">Score Tracker</div>
                    <div className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1">
                      <span>96/100 ATS Passed</span>
                      <span className="text-emerald-500">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Steps / Features Section ───────────────────────────────────────── */}
      <section id="steps" className="py-28 relative border-t border-surface-200/50 dark:border-surface-800/40 bg-white/40 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-4">
              <Sliders size={12} /> How it works
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-surface-900 dark:text-white">
              Create and edit in four simple steps
            </h2>
          </div>

          {/* STEP 1: Choose a Template */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Mock template selector */}
            <div className="relative bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-5 sm:p-6 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-200/60 dark:border-surface-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-surface-500">Templates category</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-500 text-white">Simple</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-500">Modern</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-500">Creative</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Harvard', layout: 'centered' },
                  { name: 'Modern', layout: '2col' },
                  { name: 'Minimal', layout: 'clean' }
                ].map((mock, idx) => (
                  <div key={mock.name} className={`rounded-xl p-3 border text-center transition-all bg-white dark:bg-surface-850 cursor-pointer ${idx === 1 ? 'border-brand-500 shadow-glow-sm' : 'border-gray-200 dark:border-surface-800 opacity-75'}`}>
                    <div className="w-full h-16 bg-[#F5F0E8] rounded-md mb-2 flex flex-col p-1 gap-1 relative overflow-hidden">
                      <div className={`h-1.5 bg-gray-400 rounded w-8 ${mock.layout === 'centered' ? 'mx-auto' : ''}`} />
                      <div className="h-0.5 bg-gray-300 rounded w-12" />
                      <div className="h-px w-full bg-gray-200" />
                      <div className="flex gap-1">
                        <div className="h-8 bg-gray-200 rounded flex-1" />
                        {mock.layout === '2col' && <div className="h-8 bg-brand-500/20 rounded w-4" />}
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-gray-700 dark:text-gray-300">{mock.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Description */}
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-2xl text-surface-900 dark:text-white">
                1. Choose a template
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-surface-600 dark:text-surface-400">
                Select one of FlowCV-inspired premium ATS templates. Swapping templates takes one single click inside the editor — your content fits instantly without any formatting breaks or re-typing.
              </p>
            </div>
          </div>

          {/* STEP 2: Add your experience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
            {/* Left: Description (ordered first on large screens via CSS layout) */}
            <div className="space-y-4 lg:order-last">
              <h3 className="font-display font-extrabold text-2xl text-surface-900 dark:text-white">
                2. Add your experience
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-surface-600 dark:text-surface-400">
                Type details in the guided form fields. The Alchemist editor walks you through personal details, professional history, education, skills, and projects. You can upload files to auto-fill them instantly.
              </p>
            </div>
            {/* Right: Mock Form Card */}
            <div className="bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-5 sm:p-6 rounded-3xl shadow-lg">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">
                <span>Personal Information Form</span>
                <span className="text-[10px] text-brand-500 animate-pulse">● Auto-Saving</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8 space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Full Name</label>
                    <div className="w-full text-xs font-semibold bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded px-2.5 py-1.5 text-gray-800 dark:text-white">John Doe</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Job Title</label>
                    <div className="w-full text-xs font-semibold bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded px-2.5 py-1.5 text-gray-800 dark:text-white">Regional Sales Manager</div>
                  </div>
                </div>
                <div className="sm:col-span-4 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-500/30 dark:border-brand-400/30 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="Uploaded Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-brand-600 dark:text-brand-400 uppercase">Profile Photo Added</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Customize layout & design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Mock design selectors */}
            <div className="bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-5 sm:p-6 rounded-3xl shadow-lg space-y-4">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 pb-3 border-b border-surface-200/60 dark:border-surface-800">
                Theme & Layout Settings
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Columns</span>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 rounded bg-brand-500 text-white font-bold text-[10px]">One</span>
                    <span className="px-2 py-1 rounded bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 text-gray-500 text-[10px]">Two</span>
                    <span className="px-2 py-1 rounded bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 text-gray-500 text-[10px]">Mix</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Font size</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded px-1.5 font-mono">10.5pt</span>
                    <div className="w-20 h-1 bg-brand-500/20 rounded relative"><div className="absolute top-0 bottom-0 left-0 bg-brand-500 rounded" style={{ width: '60%' }} /></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Description */}
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-2xl text-surface-900 dark:text-white">
                3. Customize layout & design
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-surface-600 dark:text-surface-400">
                Adjust sizing, margins, spacing, and colors to make your resume reflect your unique taste. Changes update the live side-by-side preview in real-time.
              </p>
            </div>
          </div>

          {/* STEP 4: Download unlimited PDFs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
            {/* Left: Description */}
            <div className="space-y-4 lg:order-last">
              <h3 className="font-display font-extrabold text-2xl text-surface-900 dark:text-white">
                4. Download unlimited PDFs
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-surface-600 dark:text-surface-400">
                Export print-perfect, correctly formatted PDFs instantly. No watermarks. No fees. Zero advertising. What you build is completely yours.
              </p>
            </div>
            {/* Right: Mock download panel */}
            <div className="bg-gray-50/80 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-500/10 text-brand-500 mb-3 animate-pulse">
                <Download size={22} />
              </div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Resume Transmuted!</h4>
              <p className="text-[10px] text-gray-500 mb-4">Exported as ATS-Optimized, A4 format PDF.</p>
              <button className="px-5 py-2 text-xs font-bold bg-brand-500 text-white rounded-xl shadow-glow-sm hover:bg-brand-600 transition-colors flex items-center gap-1.5">
                <FileText size={13} />
                Download PDF
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── Templates Preview Section ───────────────────────────────────────── */}
      <section className="py-24 border-t border-surface-200/50 dark:border-surface-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-4">
              <LayoutGrid size={12} /> Templates Catalog
            </div>
            <h2 className="font-display font-bold text-4xl mb-4 text-surface-900 dark:text-white">
              Explore Our <span className="font-schoolbook italic font-normal text-brand-500 dark:text-brand-400">Magical Templates</span>
            </h2>
            <p className="text-surface-600 dark:text-surface-400">Completely free. Switch templates instantly within the builder dashboard.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((t) => (
              <Link
                key={t.id}
                to="/templates"
                className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* 100% Real Populated Miniature Resume Visual */}
                <div className="h-56 relative overflow-hidden bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800/80 dark:to-surface-900 p-3 flex items-center justify-center">
                  {/* Miniature Resume Sheet */}
                  <div className="w-full max-w-[250px] bg-white dark:bg-surface-800 rounded-lg shadow-md border border-gray-200 dark:border-surface-700 p-3 text-[7px] text-gray-800 dark:text-gray-200 group-hover:scale-[1.03] transition-transform duration-300 select-none overflow-hidden relative">
                    {/* Layout specific render */}
                    {t.layoutStyle === 'sidebar-left' && (
                      <div className="flex gap-2.5">
                        <div className="w-16 shrink-0 border-r border-gray-200 dark:border-surface-700 pr-1.5 space-y-1.5">
                          {t.photoUrl && (
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-500 mx-auto mb-1">
                              <img src={t.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="font-extrabold text-[8px] text-gray-900 dark:text-white leading-tight">Alex Morgan</div>
                          <div className="font-bold text-[6.5px] text-brand-600">Cloud & AI Architect</div>
                          <div className="text-[5.5px] text-gray-500">San Francisco, CA</div>
                          <div className="pt-1 border-t border-gray-200 dark:border-surface-700 space-y-0.5">
                            <div className="font-extrabold text-[6px] uppercase text-gray-700 dark:text-gray-300">Skills</div>
                            <div className="flex flex-wrap gap-0.5">
                              {['React', 'Node', 'AWS', 'K8s'].map((sk) => (
                                <span key={sk} className="px-1 py-0.2 rounded text-[5px] bg-brand-500/10 text-brand-700 font-semibold">{sk}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div>
                            <div className="font-extrabold text-[6.5px] uppercase tracking-wider text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-surface-700 pb-0.5">Experience</div>
                            <div className="mt-1 space-y-1">
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white flex justify-between">
                                  <span>Principal AI Engineer</span>
                                  <span className="text-[5.5px] text-gray-500">2023–Present</span>
                                </div>
                                <div className="text-[5.5px] font-semibold text-brand-600">CloudScale Systems</div>
                                <div className="text-[5.5px] text-gray-600 dark:text-gray-400 leading-snug">
                                  • Architected LLM inference gateway serving 3.5M+ queries.<br />
                                  • Reduced cloud cluster latency by 45ms P99 across 40 microservices.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {t.layoutStyle === 'classic-header' && (
                      <div className="space-y-1.5 font-serif">
                        <div className="text-center border-b-2 border-gray-800 dark:border-gray-200 pb-1">
                          <div className="font-bold text-[9px] text-gray-900 dark:text-white tracking-wide">Elena Rostova</div>
                          <div className="font-semibold text-[6.5px] text-gray-700 dark:text-gray-300">VP of Financial Planning & Analysis</div>
                          <div className="text-[5.5px] text-gray-500">elena.rostova@alchemist.io • New York, NY • +1 (555) 019-8472</div>
                        </div>
                        <div>
                          <div className="font-bold text-[6.5px] uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-300 dark:border-surface-600 pb-0.5 mb-1">Professional Experience</div>
                          <div className="space-y-1">
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white flex justify-between">
                                <span>Senior Director of FP&A</span>
                                <span>2021 – Present</span>
                              </div>
                              <div className="italic text-[6px] text-gray-700 dark:text-gray-300">Goldman Capital Holdings</div>
                              <div className="text-[5.5px] text-gray-600 dark:text-gray-400 leading-snug pl-1">
                                • Formulated multi-billion dollar DCF valuation models for 14 cross-border M&A deals.<br />
                                • Streamlined quarterly capital allocation process, saving $12.4M in overhead.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {t.layoutStyle === 'minimal-space' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline border-b border-gray-100 dark:border-surface-700 pb-1">
                          <div>
                            <div className="font-extrabold text-[9px] text-gray-900 dark:text-white">David Chen</div>
                            <div className="text-[6.5px] text-gray-500 font-medium">Principal Staff Product Designer</div>
                          </div>
                          <div className="text-[5.5px] text-gray-400 text-right">david.chen@alchemist.io<br />Seattle, WA</div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="font-bold text-[6.5px] uppercase tracking-widest text-gray-400">Selected Experience</div>
                          <div>
                            <div className="font-bold text-gray-800 dark:text-gray-200">Head of UX Architecture — Figma Inc.</div>
                            <div className="text-[5.5px] text-gray-600 dark:text-gray-400 leading-snug mt-0.5">
                              • Led redesign of design token system impacting 12M+ monthly active designers.<br />
                              • Drove 38% increase in collaborative workspace adoption across enterprise tiers.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {t.layoutStyle === 'harvard-center' && (
                      <div className="space-y-1.5 font-serif">
                        <div className="text-center border-b border-red-900/40 pb-1">
                          <div className="font-bold text-[9px] text-red-950 dark:text-red-300">Sarah Jenkins, Esq.</div>
                          <div className="text-[6px] font-semibold text-gray-700 dark:text-gray-300">Harvard Law Review Editor & Corporate Counsel</div>
                          <div className="text-[5.5px] text-gray-500">Boston, MA • s.jenkins@law.harvard.edu</div>
                        </div>
                        <div>
                          <div className="font-bold text-[6px] uppercase tracking-widest text-red-900 dark:text-red-400 border-b border-gray-300 dark:border-surface-600 pb-0.5 mb-1">Education & Honors</div>
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                              <span>Harvard Law School — Juris Doctor (J.D.)</span>
                              <span>Magna Cum Laude</span>
                            </div>
                            <div className="text-[5.5px] text-gray-600 dark:text-gray-400 leading-snug">
                              • Editor-in-Chief, Harvard Law Review. Dean Scholar Prize in Corporate Governance.<br />
                              • Lead Counsel for 8 Fortune 100 antitrust compliance audits.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {t.layoutStyle === 'creative-split' && (
                      <div className="flex gap-2">
                        <div className="w-16 shrink-0 bg-brand-500/10 p-1.5 rounded space-y-1 text-center">
                          {t.photoUrl && (
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-500 mx-auto">
                              <img src={t.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="font-extrabold text-[7.5px] text-brand-900 dark:text-brand-300">Vikram Mehta</div>
                          <div className="font-bold text-[5.5px] text-brand-600">Chief Brand Strategist</div>
                          <div className="text-[5px] text-gray-500">Mumbai / London</div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="font-extrabold text-[6.5px] uppercase text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-surface-700 pb-0.5">Key Campaigns</div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white">Global Rebrand — Nike Innovation</div>
                            <div className="text-[5.5px] text-gray-600 dark:text-gray-400 leading-snug mt-0.5">
                              • Directed multi-channel campaign generating $420M in consumer impressions.<br />
                              • Coordinated 24 agency partners across APAC and EMEA markets.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {t.layoutStyle === 'shrine-warm' && (
                      <div className="space-y-1.5 bg-[#FDFBF7] dark:bg-surface-800 p-1.5 rounded border border-[#E8DFC8]">
                        <div className="flex items-center gap-2 border-b border-[#E8DFC8] pb-1">
                          {t.photoUrl && (
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-600 shrink-0">
                              <img src={t.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <div className="font-extrabold text-[8.5px] text-amber-950 dark:text-amber-300">Maya Patel</div>
                            <div className="font-semibold text-[6px] text-amber-700">Senior Strategy Consultant</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-[6px] uppercase tracking-wider text-amber-900 dark:text-amber-400 pb-0.5">Client Impact</div>
                          <div className="text-[5.5px] text-gray-700 dark:text-gray-300 leading-snug">
                            • Delivered digital transformation roadmap for top-3 retail bank, lifting app NPS by +34.<br />
                            • Mentored 12 junior associates across strategy and operations tracks.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Badge top-right */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/50 backdrop-blur-md text-white border border-white/20 shadow-sm flex items-center gap-1">
                      <Sparkles size={10} className="text-amber-400" /> {t.badge}
                    </span>
                  </div>

                  {/* Hover overlay action */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 dark:group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-500 text-white shadow-lg flex items-center gap-1.5">
                      Use This Template <ArrowRight size={13} />
                    </span>
                  </div>
                </div>

                {/* Card Detailed Breakdown & Mentioning Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 border-t border-surface-100 dark:border-surface-800">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-base text-surface-900 dark:text-white group-hover:text-brand-500 transition-colors">{t.name}</div>
                      <span className="text-xs font-bold text-brand-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">Use <ArrowRight size={13} /></span>
                    </div>

                    {/* ATS & Target Role Details */}
                    <div className="space-y-1 mb-2.5 bg-surface-50 dark:bg-surface-800/60 p-2 rounded-xl border border-surface-200 dark:border-surface-700">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck size={13} className="shrink-0" />
                        <span>{t.atsScore}</span>
                      </div>
                      <div className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-gray-900 dark:text-white">Ideal For: </span>{t.bestFor}
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed text-surface-600 dark:text-surface-400 mb-3">{t.desc}</div>

                    {/* Key Feature Checklist Details */}
                    <div className="space-y-1 pt-2 border-t border-surface-100 dark:border-surface-800">
                      {t.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-surface-700 dark:text-surface-300 font-medium">
                          <Check size={13} className="text-brand-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full mt-2 py-2 px-3 rounded-xl font-bold text-xs bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs group-hover:shadow-md"
                  >
                    Select & Customize Template <ArrowRight size={13} />
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/templates" className="btn btn-outline btn-lg gap-2 border-surface-300 dark:border-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl px-6 py-3 font-semibold">
              View All 8 Templates <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 relative border-t border-surface-200/50 dark:border-surface-800/40">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl mb-4 text-surface-900 dark:text-white">
              Loved by <span className="font-schoolbook italic font-normal text-brand-500 dark:text-brand-400">50,000+</span> job seekers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={`rounded-2xl p-6 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm ${t.rotate} hover:-translate-y-1 transition-all`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 text-surface-700 dark:text-surface-300">"{t.text}"</p>
                <div>
                  <div className="font-bold text-sm text-surface-900 dark:text-white">{t.name}</div>
                  <div className="text-xs mt-0.5 text-surface-500 dark:text-surface-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl p-12 overflow-hidden bg-surface-900 dark:bg-surface-900/80 border border-surface-800 shadow-xl">
            {/* Red margin decoration */}
            <div className="absolute top-0 bottom-0 left-12 w-[2px] bg-brand-500 opacity-40" />

            <div className="relative z-10">
              <h2 className="font-display font-bold text-4xl text-white mb-4">
                Ready to land your dream job?
              </h2>
              <p className="mb-8 text-lg text-surface-300">
                No sign-in required. Upload your file or start fresh — it's completely free.
              </p>
              <button onClick={handleUploadClick} className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all text-base shadow-lg hover:-translate-y-0.5 bg-brand-500 text-white hover:bg-brand-600">
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
