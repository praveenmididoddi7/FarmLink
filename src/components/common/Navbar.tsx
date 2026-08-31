import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Truck,
  Sparkles,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  TrendingUp,
  Store,
  PlusCircle,
  Package,
  Layers,
  HelpCircle,
  Navigation,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { AIChatModal } from './AIChatModal';

export const Navbar: React.FC = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalCartCount = items.reduce((sum, it) => sum + it.quantity, 0);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/marketplace') return location.pathname === '/marketplace' || location.pathname.startsWith('/product');
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isTransporter = role === 'transport' || (role as any) === 'transporter';

  const homeLink = !isAuthenticated
    ? '/'
    : role === 'farmer'
    ? '/farmer/dashboard'
    : role === 'buyer'
    ? '/marketplace'
    : '/transporter/dashboard';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to={homeLink} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                    Farm<span className="text-emerald-600">Link</span>
                  </span>
                </div>
              </Link>

              {/* Desktop Role-Specific Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {/* 1. Public Visitor */}
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/marketplace"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/marketplace')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/market-prices"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/market-prices')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Mandi Prices
                    </Link>
                    <Link
                      to="/how-it-works"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/how-it-works')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      How It Works
                    </Link>
                  </>
                )}

                {/* 2. Farmer Role Navigation */}
                {isAuthenticated && role === 'farmer' && (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/farmer/dashboard')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/farmer/listings"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/farmer/listings')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/farmer/add-crop"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/farmer/add-crop')
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-emerald-700 font-bold hover:bg-emerald-50'
                      }`}
                    >
                      + List Crop
                    </Link>
                    <Link
                      to="/farmer/orders"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/farmer/orders')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/farmer/predictions"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/farmer/predictions')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      AI Insights
                    </Link>
                  </>
                )}

                {/* 3. Buyer Role Navigation */}
                {isAuthenticated && role === 'buyer' && (
                  <>
                    <Link
                      to="/marketplace"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/marketplace')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/buyer/orders"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/buyer/orders')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/cart"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        isActive('/cart')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>Cart</span>
                      {totalCartCount > 0 && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {totalCartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* 4. Transporter Role Navigation */}
                {isAuthenticated && isTransporter && (
                  <>
                    <Link
                      to="/transporter/dashboard"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/transporter/dashboard') || isActive('/transport/dashboard')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Fleet Dashboard
                    </Link>
                    <Link
                      to="/transporter/loads"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/transporter/loads') || isActive('/transport/loads')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Available Loads
                    </Link>
                    <Link
                      to="/transporter/deliveries"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/transporter/deliveries')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Deliveries
                    </Link>
                    <Link
                      to="/transporter/earnings"
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive('/transporter/earnings')
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Earnings
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Right Tools & Profile */}
            <div className="flex items-center gap-3">
              {/* AI Advisor Button */}
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 transition-colors border border-emerald-200/60 cursor-pointer"
                title="AI Agricultural Advisor"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Advisor</span>
              </button>

              {/* Unauthenticated Actions */}
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                /* Authenticated User Menu Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-50 border border-slate-200/70 transition-all cursor-pointer"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'}
                      alt={user?.name || 'User'}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                        {user?.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">
                        {isTransporter ? 'Transporter' : role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <div className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {isTransporter ? 'Transporter Account' : `${role} Account`}
                        </div>
                      </div>

                      {/* Farmer links */}
                      {role === 'farmer' && (
                        <>
                          <Link
                            to="/farmer/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" /> Farm Profile
                          </Link>
                          <Link
                            to="/market-prices"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <TrendingUp className="w-4 h-4 text-slate-400" /> Mandi Benchmark Rates
                          </Link>
                        </>
                      )}

                      {/* Buyer links */}
                      {role === 'buyer' && (
                        <>
                          <Link
                            to="/buyer/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" /> Company Profile
                          </Link>
                          <Link
                            to="/market-prices"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <TrendingUp className="w-4 h-4 text-slate-400" /> Mandi Benchmark Rates
                          </Link>
                        </>
                      )}

                      {/* Transporter links */}
                      {isTransporter && (
                        <>
                          <Link
                            to="/transporter/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" /> Fleet Profile
                          </Link>
                          <Link
                            to="/market-prices"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <TrendingUp className="w-4 h-4 text-slate-400" /> Mandi Benchmark Rates
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
            {!isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Marketplace
                </Link>
                <Link
                  to="/market-prices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Mandi Prices
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                >
                  How It Works
                </Link>
                <div className="pt-2 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-slate-800 border border-slate-200 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-emerald-600 rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {role === 'farmer' && (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/farmer/listings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/farmer/add-crop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50"
                    >
                      + List Crop
                    </Link>
                    <Link
                      to="/farmer/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/farmer/predictions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      AI Insights
                    </Link>
                  </>
                )}

                {role === 'buyer' && (
                  <>
                    <Link
                      to="/marketplace"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/buyer/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Cart ({totalCartCount})
                    </Link>
                  </>
                )}

                {isTransporter && (
                  <>
                    <Link
                      to="/transporter/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Fleet Dashboard
                    </Link>
                    <Link
                      to="/transporter/loads"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Available Loads
                    </Link>
                    <Link
                      to="/transporter/deliveries"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Deliveries
                    </Link>
                    <Link
                      to="/transporter/earnings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Earnings
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 mt-2"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global AI Agri-Advisor Modal */}
      {aiModalOpen && <AIChatModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />}
    </>
  );
};
