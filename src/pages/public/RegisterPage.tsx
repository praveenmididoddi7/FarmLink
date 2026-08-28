import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ShoppingBag, Truck, Lock, Mail, User, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register({
        name,
        email,
        phone,
        location: location || 'Maharashtra, India',
        role,
        password
      });

      if (user.role === 'farmer') navigate('/farmer/dashboard', { replace: true });
      else if (user.role === 'buyer') navigate('/marketplace', { replace: true });
      else if (user.role === 'transport') navigate('/transport/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-800 mb-2 shadow-sm backdrop-blur-md">
            <Sprout className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Create FarmLink Account
          </h2>
          <p className="text-xs sm:text-sm text-emerald-700/80 font-medium">
            Join the digital direct agricultural network
          </p>
        </div>

        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          {error && (
            <div className="mb-4 glass border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Select */}
            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1.5">Select Account Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
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
                  onClick={() => setRole('buyer')}
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
                  onClick={() => setRole('transport')}
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
              <label className="block text-xs font-bold text-emerald-950 mb-1">Full Name / Business Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                />
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
              <label className="block text-xs font-bold text-emerald-950 mb-1">Phone Number (UPI / SMS Alerts)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">Location / Mandi Hub</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-emerald-100/60 text-center text-xs text-emerald-700/80 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
