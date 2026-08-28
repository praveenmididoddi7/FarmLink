import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  HelpCircle,
  BarChart3,
  Info,
  CheckCircle2,
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { predictionService } from '../../services/predictionService';
import { PricePredictionResponse, PricePredictionRequest } from '../../types';

export const AIPredictionPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [crop, setCrop] = useState('Tomato');
  const [variety, setVariety] = useState('Hybrid Red (US 440)');
  const [category, setCategory] = useState('Vegetables');
  const [qualityGrade, setQualityGrade] = useState('Grade A (Premium)');
  const [location, setLocation] = useState('Nashik APMC, Maharashtra');
  const [quantity, setQuantity] = useState(2500);
  const [unit, setUnit] = useState('kg');
  const [rainfallIndex, setRainfallIndex] = useState('EXCESS');
  const [moisture, setMoisture] = useState(14);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricePredictionResponse | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: PricePredictionRequest = {
        crop,
        category,
        variety,
        quality_grade: qualityGrade,
        location,
        state: 'Maharashtra',
        quantity,
        rainfall_index: rainfallIndex,
        moisture_percent: moisture
      };

      const res = await predictionService.predictPrice(payload);
      setResult(res);
    } catch (err) {
      console.error('Prediction failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleListWithPredictedPrice = () => {
    if (!result) return;
    navigate('/farmer/add-crop', {
      state: {
        prefill: {
          name: crop,
          category,
          variety,
          quality: qualityGrade,
          location,
          quantity,
          unit,
          price: result.predicted_price,
          moisture_content: `${moisture}%`
        }
      }
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>AI Predictive Mandi Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Crop Price Forecasting Engine
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 mt-1 font-medium max-w-3xl">
            Powered by multi-variable machine learning analyzing APMC arrival velocity, regional rainfall anomalies, export demand indices, and moisture levels to forecast optimal selling windows.
          </p>
        </div>

        {/* Prediction Form & Result Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form on Left */}
          <div className="lg:col-span-5">
            <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
                <h2 className="text-base font-extrabold text-emerald-950 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" /> Input Crop Parameters
                </h2>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  Step 1
                </span>
              </div>

              <form onSubmit={handlePredict} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Crop Commodity</label>
                  <select
                    value={crop}
                    onChange={e => setCrop(e.target.value)}
                    className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                  >
                    <option value="Tomato">Tomato (Tamatar)</option>
                    <option value="Onion">Onion (Pyaz / Kanda)</option>
                    <option value="Potato">Potato (Aaloo)</option>
                    <option value="Wheat">Wheat (Gehun - Sharbati)</option>
                    <option value="Chilli">Green / Red Chilli (Mirchi)</option>
                    <option value="Mango">Alphonso Mango (Hapus)</option>
                    <option value="Rice">Basmati Rice (Paddy)</option>
                    <option value="Cotton">Raw Cotton (Kapas)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Grains">Grains</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Spices">Spices</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Quality Grade</label>
                    <select
                      value={qualityGrade}
                      onChange={e => setQualityGrade(e.target.value)}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    >
                      <option value="Grade A+ (Export Quality)">Grade A+ (Export)</option>
                      <option value="Grade A (Premium)">Grade A (Premium)</option>
                      <option value="Grade B (Standard)">Grade B (Standard)</option>
                      <option value="Organic Certified">Organic Certified</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Produce Variety / Cultivar</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={e => setVariety(e.target.value)}
                    placeholder="e.g. US 440 Hybrid / Nashik Red"
                    className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Harvest Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Unit</label>
                    <select
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    >
                      <option value="kg">kg (Kilograms)</option>
                      <option value="quintal">quintal (100 kg)</option>
                      <option value="ton">ton (1,000 kg)</option>
                      <option value="crates">crates</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-emerald-950 mb-1">Target Mandi / Region</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Nashik APMC, Maharashtra"
                    className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Weather / Rainfall Index</label>
                    <select
                      value={rainfallIndex}
                      onChange={e => setRainfallIndex(e.target.value)}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    >
                      <option value="EXCESS">Excess Rainfall (+40%)</option>
                      <option value="NORMAL">Normal Seasonal Rain</option>
                      <option value="LOW">Deficit Rainfall (-30%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-950 mb-1">Moisture Level (%)</label>
                    <input
                      type="number"
                      value={moisture}
                      onChange={e => setMoisture(Number(e.target.value))}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-3"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Analyzing Mandi & Weather Data...' : 'Run Price Prediction'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Results on Right */}
          <div className="lg:col-span-7 space-y-6">
            {!result ? (
              <div className="glass p-12 rounded-3xl border border-white/80 text-center space-y-4 shadow-md flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-16 h-16 rounded-3xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-lg font-black text-emerald-950">AI Forecasting Awaiting Parameters</h3>
                  <p className="text-xs text-emerald-700/80 font-medium mt-1">
                    Select your crop and harvest factors on the left to generate real-time price corridor predictions and harvest timing guidance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Top Prediction Highlights */}
                <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100/80 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md mr-2">
                        Forecast Output
                      </span>
                      <span className="font-extrabold text-emerald-950 text-sm">
                        {result.crop} • {variety}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800">Model Confidence:</span>
                      <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                        {result.confidence || 88}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="glass p-4 rounded-2xl border border-white/80">
                      <div className="text-emerald-700 text-[10px] font-extrabold uppercase">Current Mandi Price</div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                        ₹{result.current_market_price || 28} <span className="text-xs font-bold text-emerald-700">/{unit}</span>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-2xl border border-emerald-300/80 bg-emerald-50/50">
                      <div className="text-emerald-800 text-[10px] font-extrabold uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> AI Predicted Price
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-600 font-['Outfit',sans-serif]">
                        ₹{result.predicted_price} <span className="text-xs font-bold text-emerald-800">/{unit}</span>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-2xl border border-white/80 col-span-2 sm:col-span-1">
                      <div className="text-emerald-700 text-[10px] font-extrabold uppercase">Expected Trajectory</div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-950 font-['Outfit',sans-serif] flex items-center gap-1">
                        <TrendingUp className={`w-5 h-5 ${result.trend === 'decreasing' ? 'rotate-180 text-rose-500' : 'text-emerald-600'}`} />
                        <span className={result.trend === 'decreasing' ? 'text-rose-600' : 'text-emerald-600'}>
                          {result.price_change_percent && result.price_change_percent > 0 ? '+' : ''}
                          {result.price_change_percent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Strategic Recommendation */}
                  <div className="p-4 rounded-2xl bg-emerald-100/60 border border-emerald-300/60 text-xs text-emerald-950 space-y-1">
                    <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recommended Action
                    </div>
                    <p className="font-medium leading-relaxed">{result.recommendation}</p>
                    <div className="text-[11px] text-emerald-800 font-bold mt-1">
                      Optimal Sales Window: <span className="text-emerald-950">{result.best_selling_window}</span>
                    </div>
                  </div>

                  {/* 7-Day Projected Trajectory Area Chart */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-emerald-600" /> 7-Day Predicted Price Curve (₹/{unit})
                    </div>
                    <div className="h-56 w-full glass rounded-2xl p-3 border border-white/80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={result.seven_day_forecast}>
                          <defs>
                            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#064e3b' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#064e3b' }} domain={['auto', 'auto']} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderRadius: '16px',
                              border: '1px solid #d1fae5',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: '#064e3b'
                            }}
                          />
                          <Area type="monotone" dataKey="predicted_price" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#priceGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Action Button to List Produce with this price */}
                  <button
                    type="button"
                    onClick={handleListWithPredictedPrice}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <span>List This Crop on Marketplace at ₹{result.predicted_price}/{unit}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
