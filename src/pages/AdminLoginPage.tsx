import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert, ArrowRight, ShieldCheck, Key, Check } from 'lucide-react';
import { SproutDoodle } from '../components/common/DoodleAccents';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    isAdmin,
    loginWithEmail,
    loginWithGoogle,
    resetPassword,
    bootstrapAdmin,
    isLockedOut,
    lockoutRemaining,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);

  // If already signed in as admin, auto navigate to /admin
  React.useEffect(() => {
    if (currentUser && isAdmin) {
      onNavigate('/admin');
    }
  }, [currentUser, isAdmin, onNavigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (forgotMode) {
        await resetPassword(email);
        setSuccessMsg('Password reset link sent to your administrator email.');
      } else {
        await loginWithEmail(email, password);
        // Auth state listener checks admin role
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setErrorMsg(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.');
    }
  };

  const handleFirstAdminSetup = async () => {
    setBootstrapLoading(true);
    setErrorMsg(null);
    try {
      await bootstrapAdmin();
      setSuccessMsg('Your account has been granted Master Admin permissions! Redirecting...');
      setTimeout(() => onNavigate('/admin'), 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not bootstrap admin. Sign in first with Google or Email.');
    } finally {
      setBootstrapLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#3B2F2F] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Lock className="w-8 h-8 text-sunshine" />
        </div>
        <h2 className="font-serif text-3xl font-extrabold text-[#3B2F2F]">
          Little Sprout Control Center
        </h2>
        <p className="mt-2 text-xs text-[#6E5A5A]">
          Authorized Administrator Portal & Store Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-[#F4EADB] space-y-6">
          {/* Lockout Notice */}
          {isLockedOut && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Security Lockout Active</p>
                <p className="mt-0.5">
                  Too many failed attempts. Please wait <strong>{lockoutRemaining} seconds</strong> before retrying.
                </p>
              </div>
            </div>
          )}

          {/* Access Denied Warning (when signed in but not admin) */}
          {currentUser && !isAdmin && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Access Denied</p>
                  <p className="mt-0.5">
                    User <strong>{currentUser.email}</strong> does not possess the "admin" role in Firestore.
                  </p>
                </div>
              </div>

              {/* One-click First Admin Bootstrap */}
              <div className="pt-2 border-t border-red-200">
                <button
                  type="button"
                  onClick={handleFirstAdminSetup}
                  disabled={bootstrapLoading}
                  className="w-full py-2.5 px-3 bg-[#588469] hover:bg-[#436650] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{bootstrapLoading ? 'Granting...' : '👑 Grant Master Admin to this Account'}</span>
                </button>
                <span className="text-[10px] text-gray-500 block text-center mt-1">
                  Initial setup helper for development
                </span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-[#FDEEEB] text-[#E2725B] rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#EBF4EE] text-[#588469] rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#3B2F2F] block mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                disabled={isLockedOut}
                placeholder="admin@littlesproutplay.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
              />
            </div>

            {!forgotMode && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#3B2F2F]">Admin Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-[11px] text-[#E2725B] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  disabled={isLockedOut}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLockedOut}
              className="w-full py-3.5 bg-[#3B2F2F] hover:bg-[#251D1D] text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : forgotMode ? 'Send Reset Email' : 'Enter Admin Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {forgotMode && (
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="w-full text-center text-xs text-[#948282] hover:text-[#3B2F2F]"
              >
                ← Back to Login
              </button>
            )}
          </form>

          {/* Alternative Google Sign-in */}
          <div className="pt-4 border-t border-[#F4EADB]">
            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              className="w-full py-2.5 rounded-xl border border-[#F4EADB] hover:bg-[#FFF8EF] text-xs font-bold text-[#3B2F2F] flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-[#948282] hover:text-[#3B2F2F] hover:underline"
            >
              ← Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
