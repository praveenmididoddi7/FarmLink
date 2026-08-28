import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, ShoppingBag, Truck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, demoAccounts } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('farmer@farmlink.io');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (userRole: UserRole) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login' && from !== '/register') {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === 'farmer') navigate('/farmer/dashboard', { replace: true });
    else if (userRole === 'buyer') navigate('/marketplace', { replace: true });
    else if (userRole === 'transport') navigate('/transport/dashboard', { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password, role);
      redirectAfterLogin(user.role);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoRole: UserRole) => {
    setLoading(true);
    setError('');
    try {
      const user = await loginAsDemo(demoRole);
      redirectAfterLogin(user.role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-800 mb-2 shadow-sm backdrop-blur-md">
            <Sprout className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Sign in to FarmLink
          </h2>
          <p className="text-xs sm:text-sm text-emerald-700/80 font-medium">
            Access your agricultural dashboard, AI price tools, and logistics hub
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick Sign-In */}
        <div className="glass p-5 rounded-3xl border border-white/80 text-xs space-y-3 shadow-md">
          <div className="flex items-center justify-between font-bold text-emerald-950">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Hackathon 1-Click Demo Logins:
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-900 px-2.5 py-0.5 rounded-full font-black border border-emerald-500/30">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('farmer')}
              disabled={loading}
              className="glass border border-white/80 hover:bg-white p-3 rounded-2xl text-center transition-all cursor-pointer shadow-xs group"
            >
              <Sprout className="w-5 h-5 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="font-black text-emerald-950 text-xs">Farmer Demo</div>
              <div className="text-[10px] text-emerald-700/80 truncate font-medium">Ramesh Patel</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('buyer')}
              disabled={loading}
              className="glass border border-white/80 hover:bg-white p-3 rounded-2xl text-center transition-all cursor-pointer shadow-xs group"
            >
              <ShoppingBag className="w-5 h-5 text-sky-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="font-black text-emerald-950 text-xs">Buyer Demo</div>
              <div className="text-[10px] text-emerald-700/80 truncate font-medium">Priya Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('transport')}
              disabled={loading}
              className="glass border border-white/80 hover:bg-white p-3 rounded-2xl text-center transition-all cursor-pointer shadow-xs group"
            >
              <Truck className="w-5 h-5 text-amber-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="font-black text-emerald-950 text-xs">Transporter Demo</div>
              <div className="text-[10px] text-emerald-700/80 truncate font-medium">Gurpreet Singh</div>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          {error && (
            <div className="mb-4 glass border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Tab Selection */}
            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1.5">Sign In As</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('farmer');
                    setEmail('farmer@farmlink.io');
                  }}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'farmer'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'glass text-emerald-950 border-white/80 hover:bg-white/80'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5" /> Farmer
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('buyer');
                    setEmail('buyer@farmlink.io');
                  }}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'buyer'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'glass text-emerald-950 border-white/80 hover:bg-white/80'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Buyer
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('transport');
                    setEmail('transport@farmlink.io');
                  }}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'transport'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'glass text-emerald-950 border-white/80 hover:bg-white/80'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> Transporter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@farmlink.io"
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-emerald-100/60 text-center text-xs text-emerald-700/80 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-800 hover:underline">
              Register New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
