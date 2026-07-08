import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import {
  FileText, Zap, Shield, Download, Eye, BarChart3,
  Sparkles, ChevronRight, Star, Check, ArrowRight, Github, Globe
} from 'lucide-react';

const FEATURES = [
  { icon: <Zap size={22} />, title: 'ATS Optimized', desc: 'Every template is built to pass Applicant Tracking Systems with 90%+ scores' },
  { icon: <Eye size={22} />, title: 'Live Preview', desc: 'See your resume update in real-time as you type — no refresh needed' },
  { icon: <Sparkles size={22} />, title: 'AI-Powered', desc: 'Generate professional summaries, bullet points & descriptions with AI' },
  { icon: <Download size={22} />, title: 'Free PDF Export', desc: 'Download print-perfect A4/Letter PDFs with no watermarks, forever free' },
  { icon: <Shield size={22} />, title: 'Secure & Private', desc: 'Your data is encrypted and stored securely on Firebase with full GDPR compliance' },
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
  { value: '< 3s', label: 'PDF Export' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Software Engineer at Google', text: 'Landed my dream job using ResumeAI. The ATS score feature helped me optimize my resume perfectly!' },
  { name: 'Rahul M.', role: 'Product Manager at Flipkart', text: 'Best free resume builder out there. The live preview and templates are incredible.' },
  { name: 'Ananya K.', role: 'Data Scientist at Microsoft', text: 'The AI bullet point generator saved me hours. My resume score jumped from 62 to 91!' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 dark:border-surface-800/50">
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
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-md">
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-md hidden md:inline-flex">Sign In</Link>
                  <Link to="/login" className="btn btn-primary btn-md">
                    Get Started Free <ChevronRight size={16} />
                  </Link>
                </>
              )}
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
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide">100% Free — No Credit Card Required</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up text-balance">
            Build Your{' '}
            <span className="gradient-text">ATS-Ready</span>{' '}
            Resume<br />In Minutes
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Professional resume builder with 8 templates, live preview, AI assistance,
            and instant PDF download. 100% free. No watermarks ever.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/login" className="btn btn-primary btn-xl shadow-glow-brand">
              <Sparkles size={20} />
              Create My Resume Free
            </Link>
            <Link to="/templates" className="btn btn-secondary btn-xl">
              View Templates <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {['No credit card', 'No watermarks', 'Free PDF export', 'ATS-optimized'].map((item) => (
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
              Premium features that other builders charge for — all completely free.
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
              All free. Switch anytime without losing your data.
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
                Join 50,000+ professionals who built their career with ResumeAI
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-4 rounded-2xl hover:bg-brand-50 transition-colors shadow-lg text-base">
                <Sparkles size={20} />
                Build My Resume — It's Free
              </Link>
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
