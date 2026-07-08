import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { FileText, Github, Mail, ArrowLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithGithub, sendEmailOTP, verifyEmailOTP, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [mode, setMode] = useState<'choose' | 'email' | 'sent' | 'verifying' | 'confirmEmail'>('choose');
  const [email, setEmail] = useState('');
  const [confirmingEmailAddress, setConfirmingEmailAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for email verification link on mount
  useEffect(() => {
    const checkEmailLink = async () => {
      const { isSignInWithEmailLink } = await import('firebase/auth');
      const { auth } = await import('../services/firebase');

      if (isSignInWithEmailLink(auth, window.location.href)) {
        const storedEmail = localStorage.getItem('emailForSignIn');
        if (storedEmail) {
          setMode('verifying');
          setIsLoading(true);
          try {
            await verifyEmailOTP(storedEmail);
            localStorage.removeItem('emailForSignIn');
            navigate(from, { replace: true });
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Verification failed. The link may have expired or already been used.');
            setMode('choose');
          } finally {
            setIsLoading(false);
          }
        } else {
          // Email missing from localStorage (e.g. user clicked link on another device)
          setMode('confirmEmail');
        }
      }
    };
    checkEmailLink();
  }, [verifyEmailOTP, navigate, from]);

  useEffect(() => {
    if (user && !loading && mode !== 'verifying') {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from, mode]);

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
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
      setError(err instanceof Error ? err.message : 'GitHub sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setIsLoading(true);
    try {
      await sendEmailOTP(email);
      setMode('sent');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send email link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmingEmailAddress) return;
    setError('');
    setIsLoading(true);
    const prevMode = mode;
    setMode('verifying');
    try {
      await verifyEmailOTP(confirmingEmailAddress);
      localStorage.removeItem('emailForSignIn');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please check the email address and try again.');
      setMode(prevMode);
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
                  Sign in with Email
                </h1>
                <p className="text-sm text-gray-500">We'll send a magic link to your inbox</p>
              </>
            )}

            {mode === 'sent' && (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
                  Check your inbox!
                </h1>
                <p className="text-sm text-gray-500">
                  We sent a magic link to <strong>{email}</strong>.<br />
                  Click it to sign in instantly.
                </p>
              </>
            )}

            {mode === 'verifying' && (
              <>
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 size={32} className="text-brand-500 animate-spin" />
                </div>
                <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
                  Verifying Link
                </h1>
                <p className="text-sm text-gray-500">Signing you in securely, please wait...</p>
              </>
            )}

            {mode === 'confirmEmail' && (
              <>
                <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
                  Confirm your Email
                </h1>
                <p className="text-sm text-gray-500">
                  Please enter the email address where you received the sign-in link.
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

          {/* Email form */}
          {mode === 'email' && (
            <form onSubmit={handleEmailSend} className="space-y-4">
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

              <button type="submit" disabled={isLoading || !email} className="btn btn-primary btn-md w-full">
                {isLoading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Magic Link'}
              </button>

              <button type="button" onClick={() => setMode('choose')} className="btn btn-ghost btn-md w-full">
                <ArrowLeft size={16} /> Back to options
              </button>
            </form>
          )}

          {/* Sent confirmation */}
          {mode === 'sent' && (
            <div className="space-y-3">
              <button onClick={() => setMode('email')} className="btn btn-secondary btn-md w-full">
                Try different email
              </button>
              <button onClick={() => setMode('choose')} className="btn btn-ghost btn-md w-full">
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          )}

          {/* Confirm Email Form */}
          {mode === 'confirmEmail' && (
            <form onSubmit={handleEmailConfirm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={confirmingEmailAddress}
                  onChange={(e) => setConfirmingEmailAddress(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              <button type="submit" disabled={isLoading || !confirmingEmailAddress} className="btn btn-primary btn-md w-full">
                {isLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Confirm and Sign In'}
              </button>

              <button type="button" onClick={() => setMode('choose')} className="btn btn-ghost btn-md w-full">
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
