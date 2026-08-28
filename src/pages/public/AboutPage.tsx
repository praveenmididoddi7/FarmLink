import React from 'react';
import { Sprout, ShieldCheck, Cpu, Users, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Our Mission & Impact
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Eliminating Asymmetry in Agricultural Trade
          </h1>
          <p className="text-emerald-800/80 text-base leading-relaxed font-medium">
            FarmLink was built with a single resolute purpose: to replace fragmented, multi-tiered middleman cartels with transparent AI pricing, direct marketplace connections, and dependable freight logistics.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md space-y-3 hover:bg-white/75 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-emerald-950">Fair Price Discovery</h3>
            <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed font-medium">
              Our XGBoost and GenAI intelligence monitors over 3,000 APMC Mandis daily to provide farmers with predictive price ceilings and optimal harvest timing.
            </p>
          </div>

          <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md space-y-3 hover:bg-white/75 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-emerald-950">Escrow Protected Trading</h3>
            <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed font-medium">
              Eliminate defaults and payment delays. Buyers deposit funds into secure digital escrow, released instantly to farmers upon electronic gate verification.
            </p>
          </div>

          <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md space-y-3 hover:bg-white/75 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-700 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-emerald-950">Shared Cold Logistics</h3>
            <p className="text-xs sm:text-sm text-emerald-800/80 leading-relaxed font-medium">
              Integrated refrigerated and ventilated freight matching prevents up to 35% post-harvest spoilage and gives transporters return load visibility.
            </p>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="glass-card-dark text-white rounded-3xl p-8 sm:p-12 border border-emerald-500/30 shadow-2xl shadow-emerald-950/20">
          <h2 className="text-2xl font-black font-['Outfit',sans-serif] text-center mb-8 text-white">
            Empowering the Agrarian Backbone of India
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-emerald-300 font-['Outfit',sans-serif]">22%</div>
              <div className="text-xs text-emerald-100/80 mt-1 font-medium">Average Income Growth for Farmers</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-300 font-['Outfit',sans-serif]">0%</div>
              <div className="text-xs text-emerald-100/80 mt-1 font-medium">Middlemen Commission on Direct Lots</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-300 font-['Outfit',sans-serif]">14 Mandis</div>
              <div className="text-xs text-emerald-100/80 mt-1 font-medium">Integrated APMC Data Feeds</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-300 font-['Outfit',sans-serif]">24 Hrs</div>
              <div className="text-xs text-emerald-100/80 mt-1 font-medium">Guaranteed UPI Settlement</div>
            </div>
          </div>
        </div>

        {/* Team / Architecture note */}
        <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 text-xs text-emerald-800/90 space-y-2 shadow-xs font-medium">
          <h4 className="font-black text-emerald-950 text-sm">Technology Architecture</h4>
          <p>
            Built as a full-stack platform utilizing modern React, TypeScript, Express, PostgreSQL data models, XGBoost predictive algorithms, and Google GenAI agricultural intelligence.
          </p>
        </div>
      </div>
    </div>
  );
};
