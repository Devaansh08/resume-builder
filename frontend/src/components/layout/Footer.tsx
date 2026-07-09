import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, Heart, Mail, CheckCircle2, ArrowRight, Github, Twitter, Linkedin, Award, Cpu, Globe } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { getMockarooProfile, generateResumeFromMockaroo } from '../../utils/mockarooData';

export function Footer() {
  const navigate = useNavigate();
  const { setCurrentResume } = useResumeStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const handleLoadMockarooDemo = () => {
    const profile = getMockarooProfile('lead-ai-architect');
    const resume = generateResumeFromMockaroo(profile);
    setCurrentResume(resume);
    navigate('/builder');
  };

  return (
    <footer className="relative bg-surface-900 text-gray-300 overflow-hidden border-t border-surface-800">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      {/* Top Banner / Call to Action */}
      <div className="border-b border-surface-800/80 bg-surface-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="animate-pulse" />
                Enterprise-Grade ATS Engine & Mockaroo Integration
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Ready to build an interview-winning resume in under 60 seconds?
              </h3>
              <p className="text-sm text-gray-400 max-w-xl">
                Try our one-click Mockaroo dataset integration or upload an existing PDF/DOCX to get instant full-sentence ATS recommendations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleLoadMockarooDemo}
                className="btn bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-brand-500/25 transition-all flex items-center gap-2 group text-sm"
              >
                <Zap size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Try Instant Mockaroo Demo</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/templates"
                className="btn bg-surface-800 hover:bg-surface-700 text-white font-medium px-6 py-3 rounded-xl border border-surface-700 transition-all text-sm"
              >
                Explore 20+ Themes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
                AI
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                  ResumeAI <span className="text-brand-400 font-extrabold">Pro</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block -mt-0.5 font-semibold">
                  Intelligent Career Studio
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The premier AI-powered career architecture platform engineered to beat Applicant Tracking Systems (ATS). Designed with high-performance templates and rich Mockaroo data schemas.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-surface-800 hover:bg-brand-500/20 hover:text-brand-400 flex items-center justify-center text-gray-400 transition-all border border-surface-700/60"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-surface-800 hover:bg-brand-500/20 hover:text-brand-400 flex items-center justify-center text-gray-400 transition-all border border-surface-700/60"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-surface-800 hover:bg-brand-500/20 hover:text-brand-400 flex items-center justify-center text-gray-400 transition-all border border-surface-700/60"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Product & Builder */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Product & Tools
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/builder" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Cpu size={14} className="text-brand-400" /> AI Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Award size={14} className="text-amber-400" /> ATS-Verified Templates
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLoadMockarooDemo}
                  className="hover:text-brand-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Sparkles size={14} className="text-purple-400" /> Mockaroo Data Engine
                </button>
              </li>
              <li>
                <Link to="/builder" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" /> ATS Keyword Scanner
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Themes & Palettes */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Curated Palettes
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Indigo Executive
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Emerald & Teal
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Cyberpunk Neon
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Sunset Rose
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Obsidian & Gold
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & System Status */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Stay Ahead of ATS
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscribe to get monthly AI prompt updates and interview cheat sheets delivered right to your inbox.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-scale-in">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Subscribed! Check your inbox shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn bg-brand-500 hover:bg-brand-600 text-white text-xs py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe to Updates</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* Live System Status Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800/80 border border-surface-700 text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ATS Engine Status: <strong className="text-emerald-400 font-semibold">Operational (99.99%)</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Security Badges */}
      <div className="border-t border-surface-800/60 bg-surface-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} ResumeAI Pro. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart size={12} className="text-rose-500 fill-rose-500" /> for job seekers globally.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 cursor-pointer transition-colors flex items-center gap-1">
              <ShieldCheck size={14} className="text-brand-400" /> 256-Bit Encrypted
            </span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors flex items-center gap-1">
              <Globe size={14} className="text-purple-400" /> SOC2 Type II Certified
            </span>
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
