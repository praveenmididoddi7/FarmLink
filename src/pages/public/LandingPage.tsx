import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Truck,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Bot,
  Zap,
  MapPin,
  Clock,
  Coins,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cropApi, marketApi } from '../../services/api';
import { Crop, MarketPriceRecord } from '../../types';

export const LandingPage: React.FC = () => {
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [featuredCrops, setFeaturedCrops] = useState<Crop[]>([]);
  const [mandiPrices, setMandiPrices] = useState<MarketPriceRecord[]>([]);
  const [selectedRoleTab, setSelectedRoleTab] = useState<'farmer' | 'buyer' | 'transport'>('farmer');

  useEffect(() => {
    cropApi.getAll().then(crops => setFeaturedCrops(crops.slice(0, 4))).catch(() => {});
    marketApi.getAll().then(prices => setMandiPrices(prices.slice(0, 6))).catch(() => {});
  }, []);

  const handleQuickDemo = async (role: 'farmer' | 'buyer' | 'transport') => {
    await switchDemoRole(role);
    if (role === 'farmer') navigate('/farmer/dashboard');
    else if (role === 'buyer') navigate('/buyer/dashboard');
    else if (role === 'transport') navigate('/transport/dashboard');
  };

  return (
    <div className="min-h-screen text-emerald-950">
      {/* Live Mandi Ticker Bar (Frosted) */}
      <div className="bg-emerald-950/80 backdrop-blur-xl text-emerald-200 py-2.5 px-4 overflow-hidden border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 shrink-0 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700/50 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <TrendingUp className="w-3.5 h-3.5" />
            <span>LIVE APMC MANDI RATES</span>
          </div>
          <div className="flex items-center gap-8 text-xs overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 font-medium">
            {mandiPrices.map(m => (
              <div key={m.id} className="inline-flex items-center gap-2">
                <span className="font-bold text-white">{m.crop} ({m.mandi}):</span>
                <span className="text-emerald-200">₹{m.modal_price}/kg</span>
                <span className={`text-[11px] font-extrabold ${m.change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {m.change_percent >= 0 ? `+${m.change_percent}%` : `${m.change_percent}%`}
                </span>
                <span className="text-emerald-700/80">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-bold text-emerald-900 border border-white/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Agricultural Commerce & Logistics</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-emerald-950 leading-tight font-['Outfit',sans-serif]">
                From Farm to Market, <br />
                <span className="text-emerald-700">
                  Without the Middlemen.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-900/80 max-w-2xl font-normal leading-relaxed">
                FarmLink connects farmers directly with wholesale buyers, provides AI-powered market predictions, and coordinates guaranteed freight logistics across India.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/marketplace"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/farmer/add-crop"
                  className="glass hover:bg-white/80 border border-white/80 text-emerald-950 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>List Your Crop</span>
                </Link>
              </div>

              {/* Demo Mode Instant Access Badges */}
              <div className="pt-4 border-t border-emerald-900/10">
                <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-2.5">
                  ⚡ 1-Click Interactive Evaluation Profiles:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleQuickDemo('farmer')}
                    className="glass hover:bg-emerald-600 hover:text-white text-emerald-950 border border-white/90 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Try as Farmer (Ramesh)
                  </button>
                  <button
                    onClick={() => handleQuickDemo('buyer')}
                    className="glass hover:bg-blue-600 hover:text-white text-emerald-950 border border-white/90 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" /> Try as Buyer (Priya)
                  </button>
                  <button
                    onClick={() => handleQuickDemo('transport')}
                    className="glass hover:bg-amber-600 hover:text-white text-emerald-950 border border-white/90 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-600" /> Try as Transporter (Gurpreet)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: AI Live Intelligence Widget (Frosted Glass) */}
            <div className="lg:col-span-5">
              <div className="glass-card-dark rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-950/20 text-left relative overflow-hidden border border-emerald-500/30">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600/80 flex items-center justify-center border border-emerald-400/40 shadow-xs">
                      <Bot className="w-5 h-5 text-emerald-100" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">AI Price Prediction Lab</h3>
                      <p className="text-xs text-emerald-300">XGBoost ML Regression Model</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-extrabold border border-emerald-400/30">
                    89% Confidence
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between bg-emerald-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-800/60">
                    <div>
                      <span className="text-[11px] text-emerald-300/80 font-medium block">Selected Produce</span>
                      <span className="font-bold text-white text-sm">Hybrid Tomato (Nashik APMC)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-300/80 font-medium block">Current Rate</span>
                      <span className="font-extrabold text-emerald-200 text-sm">₹28.00 / kg</span>
                    </div>
                  </div>

                  <div className="bg-emerald-900/80 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">Predicted 7-Day Target</span>
                      <span className="text-xl font-black text-emerald-400">₹32.50 / kg (+16%)</span>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
                      💡 <strong>AI Recommendation:</strong> Hold export-quality stock for 4–6 days. Perishable arrivals are contracting due to regional rainfall in Southern belts.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-emerald-300/80">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Farm Gates
                  </span>
                  <Link
                    to="/farmer/predictions"
                    className="text-emerald-300 hover:text-white font-bold flex items-center gap-1"
                  >
                    Try Full AI Tool <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Section (Frosted Glass) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="glass rounded-3xl p-8 border border-white/80 shadow-md grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 font-['Outfit',sans-serif]">45,000+</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-700/80 mt-1">Verified Farmers Connected</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 font-['Outfit',sans-serif]">₹14.8 Cr+</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-700/80 mt-1">Direct Trade GMV Handled</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 font-['Outfit',sans-serif]">98.6%</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-700/80 mt-1">On-Time Logistics Delivery</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 font-['Outfit',sans-serif]">+22.4%</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-700/80 mt-1">Average Farmer Earnings Boost</div>
          </div>
        </div>
      </section>

      {/* Interactive How FarmLink Works (Role Tabs) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider glass px-3.5 py-1.5 rounded-full border border-white/80">
              Streamlined Agricultural Workflow
            </span>
            <h2 className="text-3xl font-black text-emerald-950 mt-4 font-['Outfit',sans-serif]">
              How FarmLink Transforms Agricultural Trade
            </h2>
            <p className="text-emerald-700/80 text-sm sm:text-base mt-2 font-medium">
              Eliminating 4 to 6 layers of commission agents, brokers, and informal distress selling.
            </p>

            {/* Role Tab Selector */}
            <div className="flex justify-center mt-6">
              <div className="glass p-1.5 rounded-2xl border border-white/80 inline-flex gap-1.5 shadow-xs">
                <button
                  onClick={() => setSelectedRoleTab('farmer')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedRoleTab === 'farmer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-900 hover:bg-white/60'
                  }`}
                >
                  <Sprout className="w-4 h-4" /> For Farmers
                </button>
                <button
                  onClick={() => setSelectedRoleTab('buyer')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedRoleTab === 'buyer' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-900 hover:bg-white/60'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> For Buyers
                </button>
                <button
                  onClick={() => setSelectedRoleTab('transport')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedRoleTab === 'transport' ? 'bg-amber-600 text-white shadow-sm' : 'text-emerald-900 hover:bg-white/60'
                  }`}
                >
                  <Truck className="w-4 h-4" /> For Transporters
                </button>
              </div>
            </div>
          </div>

          {/* Workflow Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedRoleTab === 'farmer' && (
              <>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-800 font-black flex items-center justify-center mb-4 border border-emerald-500/30">
                    1
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">Check AI Price & List Crop</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Input your crop variety, quantity, and grade. AI recommends fair selling price based on real-time APMC Mandi trends.
                  </p>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-800 font-black flex items-center justify-center mb-4 border border-emerald-500/30">
                    2
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">Receive Direct Wholesale Orders</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Institutional buyers and retailers place orders. Accept or negotiate orders directly with zero commission fee.
                  </p>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-800 font-black flex items-center justify-center mb-4 border border-emerald-500/30">
                    3
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">Farm-Gate Pickup & Instant Pay</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Verified transport fleet picks up crop directly from your farm. Funds are settled via UPI/bank transfer instantly.
                  </p>
                </div>
              </>
            )}

            {selectedRoleTab === 'buyer' && (
              <>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-900 font-black flex items-center justify-center mb-4 border border-blue-500/30">
                    1
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">Discover Verified Produce</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Filter thousands of crop lots by grade (Export A+, Grade A), harvest freshness, moisture level, and farm location.
                  </p>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-900 font-black flex items-center justify-center mb-4 border border-blue-500/30">
                    2
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">Secure Escrow Checkout</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Order with transparent freight calculation. Payment is protected in escrow until produce is delivered and inspected.
                  </p>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-900 font-black flex items-center justify-center mb-4 border border-blue-500/30">
                    3
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">Real-Time GPS Fleet Tracking</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Track the insulated reefer truck from farm-gate to warehouse with real-time temperature logs and milestone updates.
                  </p>
                </div>
              </>
            )}

            {selectedRoleTab === 'transport' && (
              <>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 font-black flex items-center justify-center mb-4 border border-amber-500/30">
                    1
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">View Open Dispatch Requests</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Browse agricultural loads by tonnage, route corridor, freight rate, and cargo type (ventilated / insulated reefer).
                  </p>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 font-black flex items-center justify-center mb-4 border border-amber-500/30">
                    2
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">1-Click Job Acceptance</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Accept dispatch jobs matching your vehicle capacity. Eliminate empty return trips with automated reverse load matching.
                  </p>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/80 shadow-xs relative hover:bg-white/80 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 font-black flex items-center justify-center mb-4 border border-amber-500/30">
                    3
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">Guaranteed Freight Payouts</h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed font-normal">
                    Update digital delivery proof upon arrival. Freight charges are paid out within 24 hours without delay or deductions.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Marketplace Crops (Frosted Glass) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider glass px-3.5 py-1.5 rounded-full border border-white/80">
                Direct Farm-Gate Sourcing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-3 font-['Outfit',sans-serif]">
                Fresh Harvests Available Today
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View All 24+ Listed Produce</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCrops.map(crop => (
              <div
                key={crop.id}
                className="glass rounded-3xl border border-white/80 hover:border-emerald-400 overflow-hidden shadow-xs hover:shadow-md hover:bg-white/80 transition-all flex flex-col"
              >
                <div className="relative h-48 w-full bg-emerald-100/40 overflow-hidden">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-md text-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    {crop.quality.split(' ')[0]} {crop.quality.split(' ')[1] || ''}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md text-emerald-950 text-xs font-black px-3 py-1 rounded-full shadow-xs border border-white/80">
                    ₹{crop.price} / {crop.unit}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-emerald-950 text-sm line-clamp-1">{crop.name}</h3>
                    <p className="text-xs text-emerald-700/80 mt-0.5 font-medium">{crop.variety}</p>

                    <div className="mt-3 space-y-1 text-xs text-emerald-900/80 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate">{crop.farmer_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="truncate">{crop.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700/80">
                      {crop.quantity.toLocaleString()} {crop.unit} avail
                    </span>
                    <Link
                      to={`/product/${crop.id}`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Dark Frosted Glass Panel) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card-dark rounded-3xl p-8 sm:p-12 border border-emerald-500/30 text-white relative overflow-hidden shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-black text-white font-['Outfit',sans-serif]">
                Trusted Across India's Agricultural Belt
              </h2>
              <p className="text-emerald-200 text-sm mt-2">
                Hear from farmers, wholesale buyers, and fleet logistics managers using FarmLink every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/50 p-6 rounded-2xl">
                <p className="text-xs text-emerald-100 leading-relaxed mb-4 font-medium">
                  "Earlier, local brokers in Nashik took 8% commission and delayed payment by 3 weeks. On FarmLink, I sold 12 Tons of Red Onions directly to a supermarket chain in Bengaluru and received UPI settlement on the same day."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Ramesh Patel"
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                  />
                  <div>
                    <div className="font-bold text-sm text-white">Ramesh Patel</div>
                    <div className="text-xs text-emerald-300">Tomato & Onion Farmer, Nashik</div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/50 p-6 rounded-2xl">
                <p className="text-xs text-emerald-100 leading-relaxed mb-4 font-medium">
                  "As a wholesale distributor in Bengaluru, getting pesticide-tested Grade A produce with guaranteed cold-chain temperature logs was a headache. FarmLink gives us complete transparency and fair prices."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt="Priya Sharma"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                  />
                  <div>
                    <div className="font-bold text-sm text-white">Priya Sharma</div>
                    <div className="text-xs text-emerald-300">Procurement Lead, FreshDirect</div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/50 p-6 rounded-2xl">
                <p className="text-xs text-emerald-100 leading-relaxed mb-4 font-medium">
                  "Our 14ft reefer trucks used to run empty from Bengaluru back to Pune. With FarmLink load matching, our fleet utilization went from 60% to 92%, boosting our monthly freight earnings by ₹1.2 Lakhs."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80"
                    alt="Gurpreet Singh"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <div className="font-bold text-sm text-white">Gurpreet Singh</div>
                    <div className="text-xs text-emerald-300">Kishan Express Logistics, Pune</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass p-8 sm:p-10 rounded-3xl border border-white/80 shadow-md space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Ready to Experience Fair, AI-Powered Agro Trade?
            </h2>
            <p className="text-emerald-700/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
              Join thousands of progressive farmers and buyers trading with transparent price forecasts and guaranteed logistics.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Create Free Account
              </Link>
              <Link
                to="/marketplace"
                className="glass hover:bg-white/80 border border-emerald-300 text-emerald-950 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-xs"
              >
                Browse Live Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
