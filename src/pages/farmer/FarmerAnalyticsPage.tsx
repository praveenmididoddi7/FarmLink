import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsApi } from '../../services/api';
import { TrendingUp, BarChart3, PieChart as PieIcon, DollarSign, Package, CheckCircle2, ArrowUpRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const FarmerAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const farmerId = user?.id || 'usr_farmer_1';
      const res = await analyticsApi.getFarmerAnalytics(farmerId);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const monthlySales = [
    { month: 'May', revenue: 64000, volume: 2200 },
    { month: 'Jun', revenue: 78000, volume: 2800 },
    { month: 'Jul', revenue: 95000, volume: 3400 },
    { month: 'Aug', revenue: 112000, volume: 4100 },
    { month: 'Sep', revenue: 128000, volume: 4600 },
    { month: 'Current', revenue: 145000, volume: 5200 }
  ];

  const categoryBreakdown = [
    { name: 'Vegetables (Tomato/Onion)', value: 58, color: '#059669' },
    { name: 'Grains & Pulses', value: 24, color: '#0284c7' },
    { name: 'Fruits & Tubers', value: 18, color: '#d97706' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Performance & Sales Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
            Farmer Sales & Revenue Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Track revenue growth, average realized price vs APMC Mandi, and wholesale volume trends
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-stone-500">Total Realized Revenue</span>
            <div className="text-2xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">₹4,28,000</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +22.4% vs Local Broker Rate
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-stone-500">Total Produce Dispatched</span>
            <div className="text-2xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">22,300 kg</div>
            <div className="text-[11px] text-stone-500">Across 14 Wholesale Batches</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-stone-500">Middlemen Fee Saved</span>
            <div className="text-2xl font-extrabold text-emerald-700 font-['Outfit',sans-serif]">₹34,240</div>
            <div className="text-[11px] text-stone-500">Zero commission on FarmLink</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-semibold text-stone-500">On-Time Settlement Rate</span>
            <div className="text-2xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">100%</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Average 2.4h UPI payout</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Growth Bar Chart */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Monthly Revenue & Volume Trend</h3>
                <p className="text-xs text-stone-500">Gross revenue earned directly from institutional buyers</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Last 6 Months
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="revenue" name="Revenue (₹)" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Pie Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Produce Volume Mix</h3>
            <p className="text-xs text-stone-500">Share of harvest categories listed & sold</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-stone-700">{cat.name}</span>
                  </div>
                  <span className="font-bold text-stone-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
