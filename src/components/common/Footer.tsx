import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Cpu, Truck, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950/85 backdrop-blur-2xl text-emerald-200/80 border-t border-white/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600/90 border border-emerald-400/40 flex items-center justify-center text-white shadow-sm">
                <Sprout className="w-5 h-5 text-emerald-100" />
              </div>
              <span className="font-black text-xl text-white tracking-tight font-['Outfit',sans-serif]">
                Farm<span className="text-emerald-400">Link</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/70 leading-relaxed font-medium">
              Empowering farmers with AI-driven market intelligence, zero-brokerage direct buyer connections, and integrated freight logistics across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow Protected Direct Trading</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white text-xs font-extrabold uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/marketplace" className="hover:text-emerald-400 transition-colors">Direct Marketplace</Link></li>
              <li><Link to="/market-prices" className="hover:text-emerald-400 transition-colors">Live APMC Mandi Rates</Link></li>
              <li><Link to="/farmer/predictions" className="hover:text-emerald-400 transition-colors">AI Price Forecasting</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Role Solutions */}
          <div>
            <h4 className="text-white text-xs font-extrabold uppercase tracking-wider mb-3">Solutions</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/farmer/dashboard" className="hover:text-emerald-400 transition-colors">For Farmers & FPOs</Link></li>
              <li><Link to="/buyer/dashboard" className="hover:text-emerald-400 transition-colors">For Wholesale Buyers & Retailers</Link></li>
              <li><Link to="/transport/dashboard" className="hover:text-emerald-400 transition-colors">For Fleet & Truck Operators</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About FarmLink Vision</Link></li>
            </ul>
          </div>

          {/* Tech & Support */}
          <div>
            <h4 className="text-white text-xs font-extrabold uppercase tracking-wider mb-3">AI & Logistics Tech</h4>
            <p className="text-xs text-emerald-200/70 mb-3 leading-relaxed font-medium">
              Powered by machine learning price models and real-time Google GenAI agricultural intelligence.
            </p>
            <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/50 rounded-2xl p-3 text-xs space-y-1">
              <div className="text-white font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Price Model Engine</span>
              </div>
              <p className="text-[11px] text-emerald-200/70">
                Trained on 10+ years of APMC arrivals, seasonal weather indices & festival demand.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60 gap-3 font-medium">
          <div>
            © {new Date().getFullYear()} FarmLink Agro-Technologies Inc. Built for agricultural empowerment.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-emerald-300">About</Link>
            <Link to="/how-it-works" className="hover:text-emerald-300">Documentation</Link>
            <Link to="/contact" className="hover:text-emerald-300">APMC Helpdesk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
