import React, { useState } from 'react';
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
  Info,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { AIChatModal } from './AIChatModal';
import { RoleBadge } from './RoleBadge';

export const Navbar: React.FC = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartCount = items.reduce((sum, it) => sum + it.quantity, 0);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Determine home link depending on role
  const homeLink = !isAuthenticated
    ? '/'
    : role === 'farmer'
    ? '/farmer/dashboard'
    : role === 'buyer'
    ? '/marketplace'
    : '/transport/dashboard';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_20px_rgba(5,150,105,0.04)]">
        {/* Clean Live Prototype Mandi Ticker Banner (No Role Switcher) */}
        <div className="bg-emerald-950 text-white text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="bg-emerald-600 text-emerald-50 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              Live Mandi Ticker
            </span>
            <div className="overflow-hidden whitespace-nowrap text-emerald-100/90 text-[11px] flex items-center gap-6">
              <span className="inline-flex items-center gap-1">
                🍅 <strong>Tomato (Nashik):</strong> ₹28/kg <span className="text-emerald-400 font-bold">(+11.5%)</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1">
                🧅 <strong>Onion (Lasalgaon):</strong> ₹32/kg <span className="text-emerald-400 font-bold">(+4.8%)</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1">
                🥔 <strong>Potato (Agra):</strong> ₹22/kg <span className="text-amber-400 font-bold">(+0.5%)</span>
              </span>
              <span className="hidden lg:inline-flex items-center gap-1">
                🌾 <strong>Wheat (Indore):</strong> ₹27/kg <span className="text-emerald-400 font-bold">(+2.1%)</span>
              </span>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-emerald-300/80 text-[10px] font-bold">
              <span>National Agri Escrow Active</span>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link to={homeLink} className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
                  <Sprout className="w-6 h-6 text-emerald-100" />
                </div>
                <div>
                  <span className="font-extrabold text-xl tracking-tight text-emerald-950 flex items-center gap-1 font-['Outfit',sans-serif]">
                    Farm<span className="text-emerald-600">Link</span>
                  </span>
                  <span className="text-[10px] block font-bold text-emerald-700/80 tracking-wider uppercase -mt-1">
                    Direct Agri Network
                  </span>
                </div>
              </Link>

              {/* Dynamic Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                {/* 1. Unauthenticated Navigation */}
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/marketplace"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/marketplace') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-emerald-600" /> Marketplace
                    </Link>
                    <Link
                      to="/market-prices"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/market-prices') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Mandi Prices
                    </Link>
                    <Link
                      to="/how-it-works"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/how-it-works') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> How It Works
                    </Link>
                    <Link
                      to="/about"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/about') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5 text-emerald-600" /> About
                    </Link>
                    <Link
                      to="/contact"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/contact') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Contact
                    </Link>
                  </>
                )}

                {/* 2. Farmer Navigation */}
                {isAuthenticated && role === 'farmer' && (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/farmer/dashboard') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Dashboard
                    </Link>
                    <Link
                      to="/farmer/listings"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/farmer/listings') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" /> My Listings
                    </Link>
                    <Link
                      to="/farmer/add-crop"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/farmer/add-crop') ? 'bg-emerald-600 text-white shadow-xs font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> List Crop
                    </Link>
                    <Link
                      to="/farmer/orders"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/farmer/orders') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 text-emerald-600" /> Orders
                    </Link>
                    <Link
                      to="/market-prices"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/market-prices') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Mandi Prices
                    </Link>
                    <Link
                      to="/farmer/predictions"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/farmer/predictions') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Predictions
                    </Link>
                  </>
                )}

                {/* 3. Buyer Navigation */}
                {isAuthenticated && role === 'buyer' && (
                  <>
                    <Link
                      to="/marketplace"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/marketplace') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-emerald-600" /> Marketplace
                    </Link>
                    <Link
                      to="/buyer/orders"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/buyer/orders') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 text-emerald-600" /> My Orders
                    </Link>
                    <Link
                      to="/market-prices"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/market-prices') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Mandi Prices
                    </Link>
                  </>
                )}

                {/* 4. Transporter Navigation */}
                {isAuthenticated && role === 'transport' && (
                  <>
                    <Link
                      to="/transport/dashboard"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/transport/dashboard') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-600" /> Fleet Dashboard
                    </Link>
                    <Link
                      to="/transport/loads"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/transport/loads') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 text-emerald-600" /> Available Loads
                    </Link>
                    <Link
                      to="/market-prices"
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive('/market-prices') ? 'bg-emerald-600/15 text-emerald-950 font-black' : 'text-emerald-900/80 hover:bg-white/60'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Mandi Prices
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Right Action Tools & Auth State */}
            <div className="flex items-center gap-2.5">
              {/* AI Agri-Advisor Trigger */}
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="glass border border-emerald-300/60 hover:bg-white text-emerald-900 px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Open AI Agricultural Advisor"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">AI Advisor</span>
              </button>

              {/* Buyer Cart Button (Buyer ONLY) */}
              {isAuthenticated && role === 'buyer' && (
                <Link
                  to="/cart"
                  className="relative glass border border-white/80 hover:bg-white text-emerald-950 p-2.5 rounded-2xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-700" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Unauthenticated Actions */}
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="glass border border-white/80 hover:bg-white text-emerald-950 px-3.5 py-2 rounded-2xl text-xs font-bold shadow-xs transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-2xl text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                /* Authenticated User Menu Dropdown */
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 glass border border-white/80 hover:bg-white p-1.5 pr-3 rounded-2xl transition-all cursor-pointer shadow-xs"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={user?.name || 'User'}
                      className="w-7 h-7 rounded-xl object-cover border border-emerald-500/30"
                    />
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-black text-emerald-950 leading-tight truncate max-w-[120px]">
                        {user?.name}
                      </div>
                      <div className="text-[10px] text-emerald-700/80 font-bold uppercase">
                        {role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-700 ml-0.5" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass rounded-2xl border border-white/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                      <div className="px-4 py-2 border-b border-emerald-100/60">
                        <p className="font-extrabold text-emerald-950 truncate">{user?.name}</p>
                        <p className="text-[11px] text-emerald-700/70 truncate">{user?.email}</p>
                        <div className="mt-1.5">
                          <RoleBadge role={user?.role || 'farmer'} />
                        </div>
                      </div>

                      {role === 'farmer' && (
                        <>
                          <Link
                            to="/farmer/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white/80 text-emerald-900 font-medium"
                          >
                            <Layers className="w-3.5 h-3.5 text-emerald-600" /> Farmer Dashboard
                          </Link>
                          <Link
                            to="/farmer/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white/80 text-emerald-900 font-medium"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-emerald-600" /> Farm Profile & Bank
                          </Link>
                        </>
                      )}

                      {role === 'buyer' && (
                        <>
                          <Link
                            to="/buyer/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white/80 text-emerald-900 font-medium"
                          >
                            <Package className="w-3.5 h-3.5 text-emerald-600" /> My Purchase Orders
                          </Link>
                          <Link
                            to="/buyer/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white/80 text-emerald-900 font-medium"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-emerald-600" /> Business Profile
                          </Link>
                        </>
                      )}

                      {role === 'transport' && (
                        <>
                          <Link
                            to="/transport/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-white/80 text-emerald-900 font-medium"
                          >
                            <Truck className="w-3.5 h-3.5 text-amber-600" /> Fleet Logistics Hub
                          </Link>
                        </>
                      )}

                      <div className="border-t border-emerald-100/60 my-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50/60 font-bold cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
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
                className="md:hidden glass p-2 rounded-2xl border border-white/80 text-emerald-950"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/60 p-4 space-y-3">
            {!isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                >
                  Marketplace
                </Link>
                <Link
                  to="/market-prices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                >
                  Mandi Prices
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                >
                  How It Works
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 bg-white/70 text-center mt-2"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {role === 'farmer' && (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      Farmer Dashboard
                    </Link>
                    <Link
                      to="/farmer/listings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      My Produce Listings
                    </Link>
                    <Link
                      to="/farmer/add-crop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600"
                    >
                      + List New Crop
                    </Link>
                    <Link
                      to="/farmer/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      Wholesale Orders
                    </Link>
                    <Link
                      to="/farmer/predictions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      AI Price Predictor
                    </Link>
                  </>
                )}

                {role === 'buyer' && (
                  <>
                    <Link
                      to="/marketplace"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/buyer/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      My Orders & Tracking
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      Cart ({totalCartCount})
                    </Link>
                  </>
                )}

                {role === 'transport' && (
                  <>
                    <Link
                      to="/transport/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      Fleet Dashboard
                    </Link>
                    <Link
                      to="/transport/loads"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 hover:bg-white/60"
                    >
                      Available Farm Loads
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/60 mt-2"
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
