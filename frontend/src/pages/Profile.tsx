import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { db, storage } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Mail, LogOut, Upload, FileText, ArrowLeft } from 'lucide-react';
import { getInitials } from '../utils/helpers';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { displayName });
    } catch (err) {
      console.error('[Profile] Firestore update failed:', err);
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const storageRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-950">
      {/* Navbar */}
      <nav className="glass border-b border-white/20 dark:border-surface-800 px-4 h-14 flex items-center gap-3">
        <Link to="/dashboard" className="btn btn-ghost btn-sm gap-1.5 text-xs">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <span className="font-display font-bold text-gray-900 dark:text-white">
          Resume<span className="gradient-text">AI</span>
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-8">Profile</h1>

        <div className="card p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.displayName || 'U')
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-brand-600 transition-colors shadow-lg">
                <Upload size={12} className="text-white" />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{user?.displayName}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          </div>

          <div className="divider" />

          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Display Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input pl-10"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={user?.email || ''} readOnly className="input pl-10 opacity-60 cursor-not-allowed" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email is managed by your auth provider</p>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-md">
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>

          <div className="divider" />

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                <FileText size={16} className="text-brand-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">My Resumes</span>
              </Link>
            </div>
          </div>

          <div className="divider" />

          <button
            onClick={signOut}
            className="btn btn-ghost btn-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 w-full"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
