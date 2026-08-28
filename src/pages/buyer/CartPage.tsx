import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck, Store, ChevronLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, estimatedDelivery, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl glass text-emerald-700 flex items-center justify-center mx-auto border border-white/80 shadow-xs">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Your Sourcing Cart is Empty
          </h2>
          <p className="text-xs text-emerald-700/80 font-medium">
            Browse fresh crop listings directly from farmers across India with verified quality grades.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Store className="w-4 h-4" />
            <span>Explore Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <ShoppingCart className="w-3.5 h-3.5" /> Buyer Procurement Cart
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Wholesale Order Review ({items.length} Crop Lots)
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
          >
            Clear All Items
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ crop, quantity }) => (
              <div
                key={crop.id}
                className="glass p-5 rounded-3xl border border-white/80 shadow-xs flex flex-col sm:flex-row items-center gap-5 hover:bg-white/70 transition-all"
              >
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-emerald-200/60 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1 text-left w-full sm:w-auto">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-emerald-950 truncate">{crop.name}</h3>
                    <span className="text-xs font-black text-emerald-700">
                      ₹{(crop.price * quantity).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700/80 font-medium">{crop.variety} • {crop.quality}</p>
                  <p className="text-xs text-emerald-700/80 font-medium">Origin: {crop.farmer_name}, {crop.location}</p>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800">Rate: ₹{crop.price}/{crop.unit}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(crop.id, quantity - (crop.unit === 'ton' ? 1 : 25))}
                        className="w-8 h-8 rounded-xl glass hover:bg-white/90 text-emerald-950 font-black flex items-center justify-center text-xs cursor-pointer border border-white/80 shadow-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-emerald-950 min-w-[60px] text-center">
                        {quantity} {crop.unit}
                      </span>
                      <button
                        onClick={() => updateQuantity(crop.id, quantity + (crop.unit === 'ton' ? 1 : 25))}
                        className="w-8 h-8 rounded-xl glass hover:bg-white/90 text-emerald-950 font-black flex items-center justify-center text-xs cursor-pointer border border-white/80 shadow-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(crop.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50/80 transition-colors ml-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 pt-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Continue Sourcing More Produce</span>
            </Link>
          </div>

          {/* Sourcing Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass p-6 rounded-3xl border border-white/80 shadow-md space-y-5">
              <h3 className="font-black text-base text-emerald-950 pb-2 border-b border-emerald-100/60">
                Order Financial Summary
              </h3>

              <div className="space-y-2.5 text-xs text-emerald-800">
                <div className="flex justify-between">
                  <span>Produce Subtotal:</span>
                  <span className="font-black text-emerald-950">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reefer / Freight Logistics:</span>
                  <span className="font-bold text-emerald-900">₹{estimatedDelivery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Brokerage Fee:</span>
                  <span className="font-bold text-emerald-600">₹0.00 (Zero Commission)</span>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Protection Fee:</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>

                <div className="pt-3 border-t border-emerald-100/60 flex justify-between text-sm font-black text-emerald-950">
                  <span>Total Escrow Amount:</span>
                  <span className="text-emerald-700 text-base font-black">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>Proceed to Escrow Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="bg-emerald-500/15 p-3.5 rounded-2xl border border-emerald-500/30 text-[11px] text-emerald-900 space-y-1">
                <div className="font-black flex items-center gap-1 text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Buyer Escrow Guarantee</span>
                </div>
                <p className="text-emerald-800/80 leading-relaxed font-normal">
                  Your funds are secured in escrow until produce arrives at your warehouse and passes quality gate inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
