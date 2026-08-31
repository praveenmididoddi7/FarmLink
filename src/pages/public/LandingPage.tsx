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
  Bot,
  MapPin
} from 'lucide-react';
import { cropApi, marketApi } from '../../services/api';
import { Crop, MarketPriceRecord } from '../../types';

export const LandingPage: React.FC = () => {
  const [featuredCrops, setFeaturedCrops] = useState<Crop[]>([]);
  const [mandiPrices, setMandiPrices] = useState<MarketPriceRecord[]>([]);

  useEffect(() => {
    cropApi.getAll().then(crops => setFeaturedCrops(crops.slice(0, 4))).catch(() => {});
    marketApi.getAll().then(prices => setMandiPrices(prices.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* 1. Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transparent Farm-to-Market Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Direct Agricultural Trade, <br />
                <span className="text-emerald-600">Powered by Real-Time Data.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Connect farmers directly with verified wholesale buyers. Get AI-driven price intelligence and coordinate guaranteed freight delivery across India.
              </p>

              {/* 1-2 Primary Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/marketplace"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/farmer/add-crop"
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>List Your Crop</span>
                </Link>
              </div>
            </div>

            {/* Right Card: One Important AI Price Advisory Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">AI Market Intelligence</h3>
                      <p className="text-xs text-slate-500">APMC Mandi Price Trend</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    Active Curve
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-medium">Selected Commodity</span>
                      <span className="font-bold text-slate-900 text-sm">Hybrid Tomato (Nashik APMC)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block font-medium">Current Spot Price</span>
                      <span className="font-extrabold text-slate-900 text-sm">₹28.00 / kg</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-900">7-Day Price Forecast</span>
                      <span className="text-base font-black text-emerald-700">₹32.50 / kg (+16%)</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Recommended harvest dispatch window is within 4–6 days as regional Mandi arrivals tighten.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow payment protection
                  </span>
                  <Link to="/market-prices" className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1">
                    Mandi Rates <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">45,000+</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Verified Farmers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">₹14.8 Cr+</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Direct Trade Value</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">98.6%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">On-Time Deliveries</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit',sans-serif]">+22.4%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Farmer Income Realization</div>
          </div>
        </div>
      </section>

      {/* 3. Fresh Harvests (Recent Activity) */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fresh Harvest Listings</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Procure quality-graded crop lots directly from verified growers</p>
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All Produce</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCrops.map(crop => (
              <div
                key={crop.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                      {crop.quality.split(' ')[0]} {crop.quality.split(' ')[1] || ''}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{crop.name}</h3>
                        <p className="text-xs text-slate-500">{crop.variety}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">₹{crop.price}</span>
                        <span className="text-[11px] text-slate-500 block font-normal">/{crop.unit}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-slate-600 flex items-center gap-1.5 border-t border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{crop.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    to={`/product/${crop.id}`}
                    className="w-full block text-center bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold py-2 rounded-xl text-xs border border-slate-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Simple Workflow Section */}
      <section className="py-12 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">How FarmLink Operates</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
              A transparent three-step cycle connecting farms, wholesale buyers, and verified fleets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Farmers List Produce</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check AI price recommendations and list harvest lots directly without middleman cuts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Buyers Procure Securely</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Source directly with quality grading, transparent freight estimates, and escrow-backed payments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Fleets Deliver & Settle</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transporters claim loads along active corridors, providing GPS tracking and receiving instant digital payouts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
