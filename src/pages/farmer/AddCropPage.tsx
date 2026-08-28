import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  Sparkles,
  ArrowRight,
  Upload,
  Layers,
  MapPin,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { predictionService } from '../../services/predictionService';
import { CropCategory, QualityGrade } from '../../types';

export const AddCropPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = (location.state as any)?.prefill || {};

  const [name, setName] = useState(prefill.name || 'Tomato');
  const [category, setCategory] = useState<CropCategory | string>(prefill.category || 'Vegetables');
  const [variety, setVariety] = useState(prefill.variety || 'Hybrid Red (US 440)');
  const [quantity, setQuantity] = useState(prefill.quantity || 1500);
  const [unit, setUnit] = useState(prefill.unit || 'kg');
  const [price, setPrice] = useState(prefill.price || 32);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [quality, setQuality] = useState<QualityGrade>(prefill.quality || 'Grade A (Premium)');
  const [farmLocation, setFarmLocation] = useState(prefill.location || user?.location || 'Nashik APMC, Maharashtra');
  const [state, setState] = useState('Maharashtra');
  const [description, setDescription] = useState(
    'Direct harvest from farm gate. Freshly graded produce packed in standard ventilated crates ready for wholesale transport.'
  );
  const [moistureContent, setMoistureContent] = useState(prefill.moisture_content || '12%');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  );

  const [loading, setLoading] = useState(false);
  const [aiChecking, setAiChecking] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const handleAiPriceCheck = async () => {
    setAiChecking(true);
    try {
      const pred = await predictionService.predictPrice({
        crop: name,
        category,
        variety,
        quality_grade: quality,
        location: farmLocation,
        state,
        quantity
      });
      setPrice(pred.predicted_price);
      setAiRecommendation(
        `AI calculated optimal listing rate at ₹${pred.predicted_price}/${unit} based on current APMC demand trends.`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setAiChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newCrop = await cropService.create({
        farmer_id: user?.id || 'usr_farmer_1',
        farmer_name: user?.name || 'Ramesh Patel',
        farmer_phone: user?.phone || '+91 98220 12345',
        farm_name: user?.farm_name || `${user?.name || 'Patel'} Farms`,
        name,
        category,
        variety,
        quantity: Number(quantity),
        unit,
        price: Number(price),
        harvest_date: harvestDate,
        quality,
        location: farmLocation,
        state,
        image,
        description,
        moisture_content: moistureContent
      });

      navigate('/farmer/listings');
    } catch (err) {
      console.error('Failed to list crop', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm Inventory Intake</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            List Farm Produce for Wholesale
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 mt-1 font-medium">
            List your harvest directly to verified supermarket buyers and food processors with zero middleman commissions.
          </p>
        </div>

        {/* Listing Form */}
        <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md space-y-6 text-xs">
          {aiRecommendation && (
            <div className="p-4 rounded-2xl bg-emerald-100/60 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{aiRecommendation}</span>
              </div>
              <button
                type="button"
                onClick={() => setAiRecommendation(null)}
                className="text-emerald-800 hover:text-emerald-950 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-emerald-950 mb-1">Crop Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Tomato, Onion, Wheat"
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Fruits">Fruits</option>
                <option value="Pulses">Pulses</option>
                <option value="Spices">Spices</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">Variety / Cultivar</label>
              <input
                type="text"
                required
                value={variety}
                onChange={e => setVariety(e.target.value)}
                placeholder="e.g. US 440 Hybrid, Sharbati"
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">Quality Grade</label>
              <select
                value={quality}
                onChange={e => setQuality(e.target.value as QualityGrade)}
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              >
                <option value="Grade A+ (Export Quality)">Grade A+ (Export Quality)</option>
                <option value="Grade A (Premium)">Grade A (Premium)</option>
                <option value="Grade B (Standard)">Grade B (Standard)</option>
                <option value="Organic Certified">Organic Certified</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-emerald-950 mb-1">Available Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-950 mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                  <option value="crates">crates</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-emerald-950">Wholesale Price (₹/{unit})</label>
                <button
                  type="button"
                  onClick={handleAiPriceCheck}
                  disabled={aiChecking}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{aiChecking ? 'Evaluating APMC...' : 'AI Price Suggestion'}</span>
                </button>
              </div>
              <input
                type="number"
                required
                min="1"
                step="0.5"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-black font-['Outfit',sans-serif] text-emerald-950 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">Harvest / Dispatch Date</label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={e => setHarvestDate(e.target.value)}
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">Farm Pickup Location / Mandi</label>
              <input
                type="text"
                required
                value={farmLocation}
                onChange={e => setFarmLocation(e.target.value)}
                placeholder="e.g. Nashik Gate #2, Maharashtra"
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-emerald-950 mb-1">Produce Photo URL</label>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-emerald-950 mb-1">Produce Description & Packaging Details</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl p-3.5 font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="glass border border-white/80 hover:bg-white px-5 py-3 rounded-2xl font-bold text-emerald-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              <span>{loading ? 'Publishing Listing...' : 'Publish to Marketplace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
