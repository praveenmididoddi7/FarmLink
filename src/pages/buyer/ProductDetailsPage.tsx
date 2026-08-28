import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Truck,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShoppingCart,
  CheckCircle2,
  Phone,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronLeft
} from 'lucide-react';
import { cropApi } from '../../services/api';
import { Crop } from '../../types';
import { useCart } from '../../context/CartContext';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [quantity, setQuantity] = useState<number>(50);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) {
      cropApi
        .getById(id)
        .then(data => {
          setCrop(data);
          const initialQty = data.unit === 'ton' ? 2 : data.unit === 'quintal' ? 10 : 100;
          setQuantity(Math.min(initialQty, data.quantity));
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-800 text-sm font-bold">
        Loading produce specifications...
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-emerald-800 space-y-4">
        <p className="font-bold">Produce lot not found.</p>
        <Link to="/marketplace" className="text-emerald-700 font-bold underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(crop, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(crop, quantity);
    navigate('/checkout');
  };

  const lineTotal = crop.price * quantity;
  const estimatedFreight = Math.round(Math.max(450, quantity * 2.2 + 650));

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Navigation */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 glass px-3.5 py-1.5 rounded-full border border-white/80 hover:bg-white/80 transition-all shadow-xs"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Imagery & Farmer Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-3xl border border-white/80 overflow-hidden shadow-sm">
              <div className="relative h-96 w-full bg-emerald-100/30">
                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-500/30">
                  {crop.quality}
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-emerald-950 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs border border-white/80">
                  Harvested on: {crop.harvest_date}
                </div>
              </div>
            </div>

            {/* Farmer / Origin Details */}
            <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-xs space-y-4">
              <h3 className="font-black text-base text-emerald-950 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>Producer & Farm Gate Origin</span>
              </h3>

              <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center text-lg shadow-xs">
                    {crop.farmer_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">{crop.farmer_name}</h4>
                    <p className="text-xs text-emerald-700/80 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {crop.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    KYC Verified
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-900/90 leading-relaxed font-normal">{crop.description}</p>
            </div>
          </div>

          {/* Right Column: Pricing, Stepper & Procurement Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md space-y-6">
              <div>
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider glass px-3 py-1 rounded-full border border-white/80">
                  {crop.category} • {crop.variety}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif] mt-2">
                  {crop.name}
                </h1>
                <p className="text-xs font-mono text-emerald-700/70 mt-1">Lot ID: {crop.id}</p>
              </div>

              {/* Price Banner */}
              <div className="glass-card-dark text-white p-5 rounded-2xl space-y-1 shadow-lg shadow-emerald-950/20 border border-emerald-500/30">
                <span className="text-xs text-emerald-300 font-medium">Direct Farm-Gate Price</span>
                <div className="text-3xl font-black text-white font-['Outfit',sans-serif]">
                  ₹{crop.price} <span className="text-sm font-normal text-emerald-200">/ {crop.unit}</span>
                </div>
                <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 pt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Zero middleman markup applied
                </div>
              </div>

              {/* Quality & Moisture Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="glass p-3 rounded-2xl border border-white/80">
                  <span className="text-emerald-700/80 font-bold block text-[11px]">Quality Grade</span>
                  <strong className="text-emerald-950 text-xs mt-0.5 block truncate font-black">{crop.quality}</strong>
                </div>
                <div className="glass p-3 rounded-2xl border border-white/80">
                  <span className="text-emerald-700/80 font-bold block text-[11px]">Moisture Content</span>
                  <strong className="text-emerald-950 text-xs mt-0.5 block font-black">{crop.moisture_content}%</strong>
                </div>
                <div className="glass p-3 rounded-2xl border border-white/80">
                  <span className="text-emerald-700/80 font-bold block text-[11px]">Available Stock</span>
                  <strong className="text-emerald-950 text-xs mt-0.5 block font-black">{crop.quantity.toLocaleString()} {crop.unit}</strong>
                </div>
                <div className="glass p-3 rounded-2xl border border-white/80">
                  <span className="text-emerald-700/80 font-bold block text-[11px]">Harvest Date</span>
                  <strong className="text-emerald-950 text-xs mt-0.5 block font-black">{crop.harvest_date}</strong>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-2 pt-2 border-t border-emerald-100/60">
                <label className="block text-xs font-bold text-emerald-950">
                  Order Quantity ({crop.unit})
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(10, quantity - (crop.unit === 'ton' ? 1 : 25)))}
                    className="w-10 h-10 rounded-2xl glass hover:bg-white/90 text-emerald-950 font-black flex items-center justify-center text-lg border border-white/80 cursor-pointer shadow-xs"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={crop.quantity}
                    value={quantity}
                    onChange={e => setQuantity(Math.min(crop.quantity, Math.max(1, Number(e.target.value))))}
                    className="flex-1 text-center bg-white/70 border border-emerald-200/80 rounded-2xl py-2 font-black text-sm text-emerald-950 shadow-xs"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(crop.quantity, quantity + (crop.unit === 'ton' ? 1 : 25)))}
                    className="w-10 h-10 rounded-2xl glass hover:bg-white/90 text-emerald-950 font-black flex items-center justify-center text-lg border border-white/80 cursor-pointer shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="glass p-4 rounded-2xl space-y-2 text-xs border border-white/80">
                <div className="flex justify-between text-emerald-800">
                  <span>Produce Subtotal ({quantity} {crop.unit}):</span>
                  <span className="font-black text-emerald-950">₹{lineTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Estimated Freight Logistics:</span>
                  <span className="font-bold text-emerald-900">₹{estimatedFreight.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-950 pt-2 border-t border-emerald-100/60">
                  <span>Total Estimated Sourcing Cost:</span>
                  <span>₹{(lineTotal + estimatedFreight).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Direct Escrow Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full glass hover:bg-white/90 border border-white/80 text-emerald-950 font-bold py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {added ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <ShoppingCart className="w-4 h-4" />}
                  <span>{added ? 'Added to Cart!' : 'Add to Sourcing Cart'}</span>
                </button>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="flex items-center gap-2 text-xs text-emerald-700/80 justify-center font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Escrow Protection: Funds released only after warehouse inspection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
