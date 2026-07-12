import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Upload, PlusCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export function PageHeader({ onUploadClick }: { onUploadClick?: () => void }) {
  const { themeMode, setThemeMode, createNewResume, setCurrentResume } = useResumeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = themeMode === 'dark';

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

  const navLinks = [
    { name: 'Templates', path: '/templates' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <nav className="fixed top-3 left-0 right-0 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-7xl z-50 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-surface-900/75 border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 transition-all">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group select-none">
            <span className="font-display font-bold text-lg sm:text-xl text-surface-900 dark:text-white tracking-tight">Resume</span>
            <span className="font-schoolbook font-bold text-lg sm:text-xl text-brand-600 dark:text-brand-400 italic">Alchemist</span>
          </Link>

          {/* Nav Links - Always show ALL links across every section/page */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-surface-600 dark:text-surface-300 hover:text-brand-500 dark:hover:text-brand-400'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right CTA + Actions */}
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

            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="btn btn-ghost btn-md hidden md:inline-flex gap-1.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 font-semibold"
              >
                <Upload size={15} /> Upload
              </button>
            )}

            {location.pathname !== '/builder' && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary btn-md hidden sm:inline-flex gap-1.5 text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-sm font-bold"
              >
                <Sparkles size={14} className="text-amber-300" /> Open Builder <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-surface-200/60 dark:border-surface-800 bg-white dark:bg-surface-900 px-4 py-4 space-y-3 animate-slide-down shadow-lg">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm font-semibold py-1.5 ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-surface-600 dark:text-surface-300 hover:text-brand-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 pt-2">
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
      </div>
    </nav>
  );
}
