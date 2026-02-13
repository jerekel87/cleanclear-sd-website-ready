import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-900 rounded-2xl mb-5">
            <Shield className="w-7 h-7 text-sky-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Clean & Clear SD</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cleanclearsd.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white outline-none transition-all text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-900/60 text-white mt-6 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-400">
          <a href="/" className="hover:text-sky-600 transition-colors">
            Back to website
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
