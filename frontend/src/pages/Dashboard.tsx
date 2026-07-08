import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useResumeStore } from '../store/resumeStore';
import {
  Plus, FileText, Trash2, Copy, Share2, Download, Search, LogOut,
  Moon, Sun, Monitor, User, MoreVertical, Clock, Sparkles, ChevronRight,
  ExternalLink
} from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import type { Resume, ThemeMode } from '../types';
import { getInitials, timeAgo, copyToClipboard } from '../utils/helpers';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { createNewResume, themeMode, setThemeMode, setCurrentResume } = useResumeStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Fetch resumes from Firestore + LocalStorage
  const fetchResumes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const q = query(collection(db, 'resumes'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Resume));
      
      // Merge with locally stored resumes so nothing is ever lost or missing
      const localResumesMap = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
      const localDocs = Object.values(localResumesMap) as Resume[];
      const mergedMap = new Map<string, Resume>();
      localDocs.filter(r => r.userId === user.uid).forEach(r => mergedMap.set(r.id, r));
      docs.forEach(r => mergedMap.set(r.id, r));

      const finalDocs = Array.from(mergedMap.values());
      finalDocs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setResumes(finalDocs);
    } catch (err) {
      console.error('[Dashboard] Failed to fetch resumes from Firestore, loading from localStorage:', err);
      const localResumesMap = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
      const localDocs = (Object.values(localResumesMap) as Resume[]).filter(r => r.userId === user.uid);
      localDocs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setResumes(localDocs);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    const resume = createNewResume(user.uid, 'My Resume');
    
    // Save locally first for instant availability
    const localResumes = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
    localResumes[resume.id] = resume;
    localStorage.setItem('resumeai_local_resumes', JSON.stringify(localResumes));

    // Optimistic UI update & navigate immediately!
    setCurrentResume(resume);
    setResumes(prev => [resume, ...prev]);
    setCreating(false);
    navigate(`/builder/${resume.id}`);

    // Sync to Firestore in background without blocking UI
    try {
      await setDoc(doc(db, 'resumes', resume.id), resume);
    } catch (err) {
      console.error('[Dashboard] Background Firestore create failed (saved locally):', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    setResumes(prev => prev.filter(r => r.id !== id));
    setActiveMenu(null);

    const localResumes = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
    delete localResumes[id];
    localStorage.setItem('resumeai_local_resumes', JSON.stringify(localResumes));

    try {
      await deleteDoc(doc(db, 'resumes', id));
    } catch (err) {
      console.error('[Dashboard] Background Firestore delete failed:', err);
    }
  };

  const handleDuplicate = async (resume: Resume) => {
    if (!user) return;
    const newResume: Resume = {
      ...resume,
      id: crypto.randomUUID(),
      title: `${resume.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const localResumes = JSON.parse(localStorage.getItem('resumeai_local_resumes') || '{}');
    localResumes[newResume.id] = newResume;
    localStorage.setItem('resumeai_local_resumes', JSON.stringify(localResumes));

    setResumes(prev => [newResume, ...prev]);
    setActiveMenu(null);

    try {
      await setDoc(doc(db, 'resumes', newResume.id), newResume);
    } catch (err) {
      console.error('[Dashboard] Background Firestore duplicate failed:', err);
    }
  };

  const handleShare = async (resume: Resume) => {
    const url = `${window.location.origin}/r/${resume.shareId || resume.id}`;
    const copied = await copyToClipboard(url);
    if (copied) alert('Share link copied to clipboard!');
    setActiveMenu(null);
  };

  const handleOpen = (resume: Resume) => {
    setCurrentResume(resume);
    navigate(`/builder/${resume.id}`);
  };

  const filtered = resumes.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themeOptions = [
    { mode: 'light', icon: <Sun size={14} />, label: 'Light' },
    { mode: 'dark', icon: <Moon size={14} />, label: 'Dark' },
    { mode: 'system', icon: <Monitor size={14} />, label: 'System' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-950">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 glass border-b border-white/20 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                Resume<span className="gradient-text">AI</span>
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-surface-800 rounded-xl p-1">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.mode}
                    onClick={() => setThemeMode(opt.mode as ThemeMode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      themeMode === opt.mode
                        ? 'bg-white dark:bg-surface-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>

              {/* User avatar */}
              <div className="relative group">
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user?.displayName || 'U')
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.displayName?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 glass-card shadow-glass rounded-2xl border border-gray-100 dark:border-surface-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-surface-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.displayName}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 rounded-lg mx-1 transition-colors">
                      <User size={14} /> Profile
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg mx-1 transition-colors w-full"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
              My Resumes
            </h1>
            <p className="text-gray-500 mt-1">
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''} · Last updated{' '}
              {resumes[0] ? timeAgo(new Date(resumes[0].updatedAt)) : 'never'}
            </p>
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="btn btn-primary btn-md"
          >
            {creating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              <><Plus size={18} /> New Resume</>
            )}
          </button>
        </div>

        {/* ── Search ─────────────────────────────────────────────────── */}
        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
        </div>

        {/* ── Resume Grid ────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-32 mb-4 rounded-xl" />
                <div className="skeleton h-4 w-3/4 mb-2 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles size={36} className="text-brand-400" />
            </div>
            <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No resumes found' : 'Create your first resume'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search term'
                : 'Build a professional, ATS-ready resume in minutes. 100% free.'}
            </p>
            {!searchQuery && (
              <button onClick={handleCreate} className="btn btn-primary btn-lg">
                <Plus size={20} /> Start Building
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resume) => (
              <div key={resume.id} className="card group relative overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                {/* Preview thumbnail */}
                <div
                  onClick={() => handleOpen(resume)}
                  className="h-44 bg-gradient-to-br from-brand-50 to-purple-50 dark:from-surface-800 dark:to-surface-700 flex items-center justify-center cursor-pointer relative overflow-hidden group/thumb"
                >
                  <FileText size={48} className="text-brand-200 dark:text-surface-600 group-hover/thumb:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-brand-500/5 group-hover/thumb:bg-brand-500/10 transition-colors" />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                    <span className="badge badge-brand text-xs">
                      <ExternalLink size={10} /> Open
                    </span>
                  </div>
                  {/* Template badge */}
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-white/80 dark:bg-surface-900/80 text-gray-600 dark:text-gray-400 capitalize text-xs">
                      {resume.template}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3
                        onClick={() => handleOpen(resume)}
                        className="font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-brand-500 transition-colors"
                      >
                        {resume.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                        <Clock size={11} />
                        {timeAgo(new Date(resume.updatedAt))}
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === resume.id ? null : resume.id); }}
                        className="btn btn-ghost p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenu === resume.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 glass-card shadow-glass rounded-xl border border-gray-100 dark:border-surface-700 z-20 animate-scale-in">
                          <button onClick={() => handleOpen(resume)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 rounded-lg mx-1 transition-colors w-full">
                            <ChevronRight size={14} /> Open Editor
                          </button>
                          <button onClick={() => handleDuplicate(resume)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 rounded-lg mx-1 transition-colors w-full">
                            <Copy size={14} /> Duplicate
                          </button>
                          <button onClick={() => handleShare(resume)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-700 rounded-lg mx-1 transition-colors w-full">
                            <Share2 size={14} /> Share Link
                          </button>
                          <div className="divider mx-2 my-1" />
                          <button onClick={() => handleDelete(resume.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg mx-1 transition-colors w-full">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleOpen(resume)}
                      className="flex-1 btn btn-primary btn-sm text-xs"
                    >
                      Edit Resume
                    </button>
                    <button className="btn btn-secondary btn-sm p-2">
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleShare(resume)}
                      className="btn btn-secondary btn-sm p-2"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Create new card */}
            <button
              onClick={handleCreate}
              className="card border-2 border-dashed border-gray-200 dark:border-surface-700 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition-all duration-300 flex flex-col items-center justify-center p-8 gap-3 group min-h-[280px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-brand-500" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-brand-500 transition-colors">
                  New Resume
                </div>
                <div className="text-xs text-gray-400 mt-1">Start from scratch</div>
              </div>
            </button>
          </div>
        )}
      </main>

      {/* Close menu on outside click */}
      {activeMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  );
}
