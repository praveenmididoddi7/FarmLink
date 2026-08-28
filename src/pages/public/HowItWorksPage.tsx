import React from 'react';
import { Sprout, ShoppingBag, Truck, CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Step-by-Step Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            How FarmLink Coordinates the Agro Supply Chain
          </h1>
          <p className="text-emerald-700/80 text-sm sm:text-base font-medium">
            From the initial crop quality grading and AI price prediction, to escrow payment and cold-chain truck dispatch.
          </p>
        </div>

        {/* 4-Step Visual Flow */}
        <div className="space-y-6">
          <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md flex flex-col md:flex-row gap-6 items-start hover:bg-white/75 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
              1
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-emerald-950">Crop Listing & AI Fair Price Benchmark</h3>
                <span className="text-xs bg-emerald-500/15 text-emerald-900 px-3 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  Farmer Action
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed font-medium">
                The farmer lists produce by specifying variety, harvested quantity, moisture content, and quality grade (A+, A, B). The FarmLink AI engine cross-references 10+ years of regional APMC data and current weather signals to suggest an optimal price corridor.
              </p>
            </div>
          </div>

          <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md flex flex-col md:flex-row gap-6 items-start hover:bg-white/75 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-sky-600/30">
              2
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-emerald-950">Direct Marketplace Procurement & Escrow Deposit</h3>
                <span className="text-xs bg-sky-500/15 text-sky-900 px-3 py-0.5 rounded-full font-bold border border-sky-500/30">
                  Buyer Action
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed font-medium">
                Wholesalers, food processors, and supermarket chains browse fresh farm gate listings. When an order is placed, payment is safely held in Escrow. Zero broker commissions are deducted from either party.
              </p>
            </div>
          </div>

          <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md flex flex-col md:flex-row gap-6 items-start hover:bg-white/75 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-amber-600/30">
              3
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-emerald-950">Automated Logistics Dispatch & Real-Time Tracking</h3>
                <span className="text-xs bg-amber-500/15 text-amber-900 px-3 py-0.5 rounded-full font-bold border border-amber-500/30">
                  Transport Action
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed font-medium">
                A verified transport fleet operator claims the delivery request based on tonnage and route corridor. Real-time GPS status progression (Pending → Picked Up → In Transit → Delivered) keeps both farmer and buyer informed.
              </p>
            </div>
          </div>

          <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md flex flex-col md:flex-row gap-6 items-start hover:bg-white/75 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-emerald-800/30">
              4
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-emerald-950">Quality Confirmation & Instant Payout Release</h3>
                <span className="text-xs bg-emerald-500/15 text-emerald-900 px-3 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  Settlement
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed font-medium">
                Upon delivery verification at the destination warehouse, the escrow funds are automatically disbursed to the farmer's bank account via Instant UPI / IMPS, and logistics fees are credited to the driver.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <span>Explore the Live Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
