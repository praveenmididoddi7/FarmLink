import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { Sparkles, TrendingUp, Calendar, Info, CheckCircle2 } from 'lucide-react';

export interface PricePoint {
  day: string;
  dayNum: number;
  historical: number | null;
  predicted: number | null;
  displayPrice: number;
  isPrediction: boolean;
  dateStr?: string;
}

// User specified sample data
const DEFAULT_TOMATO_DATA: PricePoint[] = [
  { day: 'Day 1', dayNum: 1, historical: 27, predicted: null, displayPrice: 27, isPrediction: false },
  { day: 'Day 2', dayNum: 2, historical: 28, predicted: null, displayPrice: 28, isPrediction: false },
  { day: 'Day 3', dayNum: 3, historical: 27.5, predicted: null, displayPrice: 27.5, isPrediction: false },
  { day: 'Day 4', dayNum: 4, historical: 29, predicted: null, displayPrice: 29, isPrediction: false },
  { day: 'Day 5', dayNum: 5, historical: 28.5, predicted: null, displayPrice: 28.5, isPrediction: false },
  { day: 'Day 6', dayNum: 6, historical: 30, predicted: null, displayPrice: 30, isPrediction: false },
  { day: 'Day 7', dayNum: 7, historical: 29, predicted: 29, displayPrice: 29, isPrediction: false }, // bridge point
  { day: 'Day 8', dayNum: 8, historical: null, predicted: 30, displayPrice: 30, isPrediction: true },
  { day: 'Day 9', dayNum: 9, historical: null, predicted: 30.5, displayPrice: 30.5, isPrediction: true },
  { day: 'Day 10', dayNum: 10, historical: null, predicted: 31, displayPrice: 31, isPrediction: true },
  { day: 'Day 11', dayNum: 11, historical: null, predicted: 31.5, displayPrice: 31.5, isPrediction: true },
  { day: 'Day 12', dayNum: 12, historical: null, predicted: 32, displayPrice: 32, isPrediction: true },
  { day: 'Day 13', dayNum: 13, historical: null, predicted: 32.5, displayPrice: 32.5, isPrediction: true },
  { day: 'Day 14', dayNum: 14, historical: null, predicted: 33, displayPrice: 33, isPrediction: true }
];

const ONION_DATA: PricePoint[] = [
  { day: 'Day 1', dayNum: 1, historical: 31, predicted: null, displayPrice: 31, isPrediction: false },
  { day: 'Day 2', dayNum: 2, historical: 32, predicted: null, displayPrice: 32, isPrediction: false },
  { day: 'Day 3', dayNum: 3, historical: 31.5, predicted: null, displayPrice: 31.5, isPrediction: false },
  { day: 'Day 4', dayNum: 4, historical: 33, predicted: null, displayPrice: 33, isPrediction: false },
  { day: 'Day 5', dayNum: 5, historical: 32.5, predicted: null, displayPrice: 32.5, isPrediction: false },
  { day: 'Day 6', dayNum: 6, historical: 34, predicted: null, displayPrice: 34, isPrediction: false },
  { day: 'Day 7', dayNum: 7, historical: 33.5, predicted: 33.5, displayPrice: 33.5, isPrediction: false },
  { day: 'Day 8', dayNum: 8, historical: null, predicted: 34.5, displayPrice: 34.5, isPrediction: true },
  { day: 'Day 9', dayNum: 9, historical: null, predicted: 35, displayPrice: 35, isPrediction: true },
  { day: 'Day 10', dayNum: 10, historical: null, predicted: 36, displayPrice: 36, isPrediction: true },
  { day: 'Day 11', dayNum: 11, historical: null, predicted: 36.8, displayPrice: 36.8, isPrediction: true },
  { day: 'Day 12', dayNum: 12, historical: null, predicted: 37.5, displayPrice: 37.5, isPrediction: true },
  { day: 'Day 13', dayNum: 13, historical: null, predicted: 38, displayPrice: 38, isPrediction: true },
  { day: 'Day 14', dayNum: 14, historical: null, predicted: 39, displayPrice: 39, isPrediction: true }
];

const POTATO_DATA: PricePoint[] = [
  { day: 'Day 1', dayNum: 1, historical: 21, predicted: null, displayPrice: 21, isPrediction: false },
  { day: 'Day 2', dayNum: 2, historical: 22, predicted: null, displayPrice: 22, isPrediction: false },
  { day: 'Day 3', dayNum: 3, historical: 21.5, predicted: null, displayPrice: 21.5, isPrediction: false },
  { day: 'Day 4', dayNum: 4, historical: 22.5, predicted: null, displayPrice: 22.5, isPrediction: false },
  { day: 'Day 5', dayNum: 5, historical: 22, predicted: null, displayPrice: 22, isPrediction: false },
  { day: 'Day 6', dayNum: 6, historical: 23, predicted: null, displayPrice: 23, isPrediction: false },
  { day: 'Day 7', dayNum: 7, historical: 22.5, predicted: 22.5, displayPrice: 22.5, isPrediction: false },
  { day: 'Day 8', dayNum: 8, historical: null, predicted: 23.5, displayPrice: 23.5, isPrediction: true },
  { day: 'Day 9', dayNum: 9, historical: null, predicted: 24, displayPrice: 24, isPrediction: true },
  { day: 'Day 10', dayNum: 10, historical: null, predicted: 24.5, displayPrice: 24.5, isPrediction: true },
  { day: 'Day 11', dayNum: 11, historical: null, predicted: 25, displayPrice: 25, isPrediction: true },
  { day: 'Day 12', dayNum: 12, historical: null, predicted: 25.5, displayPrice: 25.5, isPrediction: true },
  { day: 'Day 13', dayNum: 13, historical: null, predicted: 26, displayPrice: 26, isPrediction: true },
  { day: 'Day 14', dayNum: 14, historical: null, predicted: 26.5, displayPrice: 26.5, isPrediction: true }
];

interface PricePredictionChartProps {
  customData?: PricePoint[];
  cropName?: string;
  locationName?: string;
}

export const PricePredictionChart: React.FC<PricePredictionChartProps> = ({
  customData,
  cropName = 'Tomato (Hybrid Red)',
  locationName = 'Nashik APMC Mandi'
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');

  const chartData = customData || (selectedCrop === 'Onion' ? ONION_DATA : selectedCrop === 'Potato' ? POTATO_DATA : DEFAULT_TOMATO_DATA);

  // Calculate current vs predicted values
  const currentPrice = chartData[6]?.historical || 29;
  const targetPrice = chartData[13]?.predicted || 33;
  const priceDiff = Math.round((targetPrice - currentPrice) * 10) / 10;
  const pctChange = Math.round(((targetPrice - currentPrice) / currentPrice) * 1000) / 10;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as PricePoint;
      const isPred = dataPoint?.dayNum >= 8;
      const priceVal = dataPoint?.predicted ?? dataPoint?.historical ?? dataPoint?.displayPrice;

      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5 min-w-[170px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-900">{label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isPred ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isPred ? 'AI Forecast' : 'Historical Data'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-0.5">
            <span className="text-slate-500 font-medium">Spot Modal Rate:</span>
            <span className="font-black text-slate-900 text-sm">₹{priceVal} / kg</span>
          </div>
          {isPred && (
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>+{Math.round(((priceVal - currentPrice) / currentPrice) * 100)}% vs Today</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Header & Commodity Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              AI Price Forecast & Historical Trend
            </h3>
            <span className="hidden sm:inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Active Model (XGBoost + APMC Velocity)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            7-day historical rates vs. 7-day forward predictive curve for {locationName}
          </p>
        </div>

        {/* Commodity Tabs (if no custom data provided) */}
        {!customData && (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 self-start sm:self-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedCrop('Tomato')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCrop === 'Tomato'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tomato
            </button>
            <button
              type="button"
              onClick={() => setSelectedCrop('Onion')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCrop === 'Onion'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Onion
            </button>
            <button
              type="button"
              onClick={() => setSelectedCrop('Potato')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCrop === 'Potato'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Potato
            </button>
          </div>
        )}
      </div>

      {/* Metric Highlights Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Spot (Day 7)</span>
          <span className="font-extrabold text-slate-900 text-sm">₹{currentPrice} / kg</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">7-Day Target (Day 14)</span>
          <span className="font-extrabold text-emerald-700 text-sm">₹{targetPrice} / kg</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Projected Realization</span>
          <span className="font-extrabold text-emerald-600 text-sm">
            +{pctChange}% (+₹{priceDiff}/kg)
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Recommended Action</span>
          <span className="font-bold text-slate-800 text-xs truncate block">Hold & Dispatch Day 11-13</span>
        </div>
      </div>

      {/* Main Chart Container with guaranteed proper height */}
      <div className="w-full min-h-[300px] h-[320px] pt-2 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 25, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            {/* X Axis */}
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
              dy={5}
            />

            {/* Y Axis */}
            <YAxis
              domain={[
                (dataMin: number) => Math.max(0, Math.floor(dataMin - 3)),
                (dataMax: number) => Math.ceil(dataMax + 3)
              ]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `₹${v}`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Prediction Start Vertical Marker */}
            <ReferenceLine
              x="Day 7"
              stroke="#059669"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Prediction Starts (Day 8)',
                position: 'top',
                fill: '#059669',
                fontSize: 10,
                fontWeight: 700,
                offset: 10
              }}
            />

            {/* 1. Historical Price Line (Solid Deep Navy/Slate) */}
            <Line
              type="monotone"
              dataKey="historical"
              name="Historical Price"
              stroke="#334155"
              strokeWidth={3}
              dot={{
                r: 4.5,
                fill: '#334155',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6.5,
                fill: '#1e293b',
                stroke: '#ffffff',
                strokeWidth: 2.5
              }}
              connectNulls={false}
              isAnimationActive={false}
            />

            {/* 2. AI Predicted Price Line (Dashed Vibrant Emerald) */}
            <Line
              type="monotone"
              dataKey="predicted"
              name="AI Predicted Price"
              stroke="#059669"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{
                r: 4.5,
                fill: '#059669',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              activeDot={{
                r: 6.5,
                fill: '#047857',
                stroke: '#ffffff',
                strokeWidth: 2.5
              }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
        {/* Custom Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-700 inline-block border-2 border-white shadow-xs"></span>
            <span className="font-semibold text-slate-700">Historical Price (Day 1 – 7)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-emerald-600 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block -ml-1 border border-white"></span>
            <span className="font-bold text-emerald-800">AI Predicted Price (Day 8 – 14)</span>
          </div>
        </div>

        {/* Confidence Note */}
        <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Model Backtest Accuracy: <strong className="text-slate-800 font-semibold">91.4%</strong></span>
        </div>
      </div>
    </div>
  );
};
