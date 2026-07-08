import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { FileText, Github, Mail, ArrowLeft, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithGithub, signUpWithEmail, signInWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [mode, setMode] = useState<'choose' | 'email'>('choose');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      if (msg.includes('operation-not-allowed')) {
        setError('Google sign-in is not enabled. Please enable it in Firebase Console > Authentication > Sign-in method.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithub = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGithub();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'GitHub sign-in failed';
      if (msg.includes('operation-not-allowed')) {
        setError('GitHub sign-in is not enabled. Please enable it in Firebase Console > Authentication > Sign-in method.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      if (msg.includes('email-already-in-use')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Invalid email or password. Please try again or create an account.');
      } else if (msg.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (msg.includes('operation-not-allowed')) {
        setError('Email/Password sign-in is not enabled. Please enable it in Firebase Console > Authentication > Sign-in method.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Card */}
        <div className="glass-card shadow-glass">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-glow-sm">
                <FileText size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                Resume<span className="gradient-text">AI</span>
              </span>
            </Link>

            {mode === 'choose' && (
              <>
                <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
                  Welcome back
                </h1>
                <p className="text-sm text-gray-500">Sign in to continue building your career</p>
              </>
            )}

            {mode === 'email' && (
              <>
                <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
                  {isSignUp ? 'Create Account' : 'Sign in with Email'}
                </h1>
                <p className="text-sm text-gray-500">
                  {isSignUp ? 'Enter your details to get started' : 'Enter your email and password'}
                </p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Auth Options */}
          {mode === 'choose' && (
            <div className="space-y-3">
              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-gray-700 dark:text-gray-200 font-medium hover:border-brand-300 hover:bg-brand-50/50 dark:hover:bg-surface-700 transition-all duration-200 group"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span className="flex-1 text-left">Continue with Google</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-500">→</span>
              </button>

              {/* GitHub */}
              <button
                onClick={handleGithub}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-gray-700 dark:text-gray-200 font-medium hover:border-gray-800 hover:bg-gray-50 dark:hover:bg-surface-700 transition-all duration-200 group"
              >
                <Github size={20} className="text-gray-800 dark:text-white" />
                <span className="flex-1 text-left">Continue with GitHub</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="divider flex-1" />
                <span className="text-xs text-gray-400">or</span>
                <div className="divider flex-1" />
              </div>

              {/* Email */}
              <button
                onClick={() => setMode('email')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-gray-700 dark:text-gray-200 font-medium hover:border-brand-300 hover:bg-brand-50/50 dark:hover:bg-surface-700 transition-all duration-200 group"
              >
                <Mail size={20} className="text-brand-500" />
                <span className="flex-1 text-left">Continue with Email</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-500">→</span>
              </button>

              {/* Guest mode */}
              <div className="divider mt-4" />
              <div className="flex items-center justify-center gap-2 pt-2">
                <Sparkles size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">
                  No account?{' '}
                  <Link to="/builder/new" className="text-brand-500 hover:text-brand-600 font-medium">
                    Try as guest
                  </Link>
                </span>
              </div>
            </div>
          )}

          {/* Email/Password form */}
          {mode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button type="submit" disabled={isLoading || !email || !password} className="btn btn-primary btn-md w-full">
                {isLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> {isSignUp ? 'Creating Account...' : 'Signing In...'}</>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>

              {/* Toggle Sign Up / Sign In */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); setConfirmPassword(''); }}
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>

              <button type="button" onClick={() => { setMode('choose'); setError(''); }} className="btn btn-ghost btn-md w-full">
                <ArrowLeft size={16} /> Back to options
              </button>
            </form>
          )}
        </div>

        {/* Terms note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-600">Terms</a> and{' '}
          <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
