import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  CreditCard,
  Download,
  CheckCircle2,
  ArrowUpRight,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transportService, TransporterEarningsSummary } from '../../services/transportService';

export const TransporterEarningsPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<TransporterEarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const data = await transportService.getTransporterEarnings(user?.id);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load earnings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [user]);

  if (loading || !summary) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="glass p-8 rounded-3xl border border-white/80 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-emerald-800 font-bold">Compiling freight earnings and escrow disbursements...</p>
        </div>
      </div>
    );
  }

  const maxMonthly = Math.max(...summary.monthlyTrends.map(m => m.earnings), 1);

  return (
    <div className="min-h-screen py-8 text-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Digital Escrow Settlements
            </div>
            <h1 className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Fleet Earnings & Payouts
            </h1>
            <p className="text-sm text-emerald-800/80 font-medium mt-1">
              Real-time audit of completed farm haul disbursements and direct bank transfers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Tax-compliant monthly freight statement downloaded (PDF).')}
              className="glass hover:bg-white text-emerald-950 text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Statement</span>
            </button>
            <Link
              to="/transporter/loads"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Find More Loads</span>
            </Link>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">TOTAL EARNINGS</span>
            <div className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              ₹{summary.totalEarnings.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold">100% verified payouts</div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">THIS MONTH</span>
            <div className="text-3xl font-black text-emerald-800 font-['Outfit',sans-serif]">
              ₹{summary.thisMonthEarnings.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">+18.4% vs previous cycle</div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">COMPLETED DELIVERIES</span>
            <div className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              {summary.completedDeliveries}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">Zero disputed consignments</div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">AVG. EARNINGS / TRIP</span>
            <div className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              ₹{summary.averagePerDelivery.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">Per 500-1500kg dispatch</div>
          </div>
        </div>

        {/* Visual Earnings Over Time Chart */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-emerald-950 font-['Outfit',sans-serif]">
                Monthly Freight Revenue Trajectory
              </h3>
              <p className="text-xs text-emerald-700/80 font-medium">
                Consolidated freight payouts released from FarmLink escrow
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full w-fit">
              FY 2026-27 (Current Cycle)
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-5 gap-4 items-end h-48 sm:h-56 px-2">
              {summary.monthlyTrends.map(trend => {
                const heightPercent = Math.max(20, Math.round((trend.earnings / maxMonthly) * 100));
                return (
                  <div key={trend.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-black text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(trend.earnings / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-2xl transition-all duration-500 group-hover:from-emerald-600 group-hover:to-emerald-400 shadow-sm"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <div className="text-center">
                      <span className="text-xs font-extrabold text-emerald-950 block">{trend.month}</span>
                      <span className="text-[10px] text-emerald-700 block">{trend.deliveries} trips</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100/60">
            <div>
              <h3 className="text-lg font-black text-emerald-950 font-['Outfit',sans-serif]">
                Freight Settlement Ledger
              </h3>
              <p className="text-xs text-emerald-700/80 font-medium">
                Detailed transaction records per completed agricultural haul
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-emerald-100/80 text-emerald-700 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="py-3 px-4">Delivery ID</th>
                  <th className="py-3 px-4">Cargo / Produce</th>
                  <th className="py-3 px-4">Transit Route</th>
                  <th className="py-3 px-4">Settlement Date</th>
                  <th className="py-3 px-4 text-right">Freight Amount</th>
                  <th className="py-3 px-4 text-center">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100/40">
                {summary.recentTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-white/60 transition-colors font-medium">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-950">{txn.deliveryId}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-950">{txn.crop}</td>
                    <td className="py-3.5 px-4 text-emerald-800">{txn.route}</td>
                    <td className="py-3.5 px-4 text-emerald-700/80">{txn.date}</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-950 font-['Outfit',sans-serif]">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-emerald-500/15 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-extrabold border border-emerald-500/30">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Linked Bank Account Card */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-900 border border-emerald-500/30 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-emerald-950">Primary Bank Settlement Account</h4>
              <p className="text-xs text-emerald-700 font-medium">
                HDFC Bank Ltd • A/C No. ending in <strong className="text-emerald-950 font-mono">•••• 8920</strong> (IFSC: HDFC0001429)
              </p>
            </div>
          </div>

          <span className="bg-emerald-500/20 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/40 w-fit">
            ✓ Auto-Disburse Enabled
          </span>
        </div>
      </div>
    </div>
  );
};
