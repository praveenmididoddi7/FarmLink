import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { orderApi } from '../../services/api';
import {
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { items, subtotal, estimatedDelivery, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(
    'FreshDirect Central Logistics Hub, Yeshwanthpur Wholesale Yard, Outer Ring Rd, Bengaluru - 560022'
  );
  const [phone, setPhone] = useState(user?.phone || '+91 98450 67890');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NET_BANKING' | 'ESCROW_RTGS'>('UPI');
  const [vehicleType, setVehicleType] = useState('Insulated Reefer (0-4°C)');
  const [notes, setNotes] = useState('Please ensure crate temperature logs are maintained during transit.');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen py-16 text-center space-y-4">
        <p className="text-emerald-800 text-sm font-medium">No items in cart to checkout.</p>
        <Link to="/marketplace" className="text-emerald-700 font-bold underline text-xs">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = items.map(it => ({
        crop_id: it.crop.id,
        crop_name: it.crop.name,
        variety: it.crop.variety || '',
        farmer_id: it.crop.farmer_id || 'user_farmer_1',
        farmer_name: it.crop.farmer_name || 'Ramesh Patel',
        farmer_phone: it.crop.farmer_phone || '+91 98452 11029',
        unit_price: it.crop.price,
        price_per_unit: it.crop.price,
        quantity: it.quantity,
        unit: it.crop.unit,
        image: it.crop.image,
        pickup_location: it.crop.location || 'Farm Gate',
        subtotal: it.crop.price * it.quantity,
        total: it.crop.price * it.quantity
      }));

      const res = await orderService.create({
        buyer_id: user?.id || 'user_buyer_1',
        buyer_name: user?.name || 'FreshDirect Wholesale (Priya Sharma)',
        buyer_phone: phone || user?.phone || '+91 98200 45678',
        delivery_address: deliveryAddress,
        items: orderItems,
        payment_method: paymentMethod,
        notes: `${notes} | Transport Mode: ${vehicleType}`
      });

      setOrderPlaced(res);
      clearCart();

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      console.error('Order creation failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {orderPlaced ? (
          /* Order Confirmation Card (Frosted Glass) */
          <div className="glass p-8 sm:p-12 rounded-3xl border border-white/80 shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider glass px-3.5 py-1 rounded-full border border-white/80">
                Payment Escrow Secured
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif] mt-3">
                Order #{orderPlaced.order.id} Placed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-700/80 max-w-lg mx-auto mt-1 font-medium">
                Your purchase order has been transmitted directly to the farmer. Automated transport dispatch request #{orderPlaced.transport.id} has been broadcast to verified fleet drivers.
              </p>
            </div>

            <div className="glass p-5 rounded-2xl border border-white/80 text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-emerald-700/80">Order ID:</span>
                <strong className="text-emerald-950 font-mono font-bold">{orderPlaced.order.id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700/80">Total Escrow Amount:</span>
                <strong className="text-emerald-700 text-sm font-black">₹{orderPlaced.order.total_amount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700/80">Delivery Status:</span>
                <span className="font-bold text-amber-700">Driver Assigned (Scheduled)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700/80">Destination:</span>
                <span className="font-semibold text-emerald-950 truncate max-w-[200px]">{orderPlaced.order.delivery_address}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/buyer/orders"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <span>Track Purchase Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/marketplace"
                className="glass hover:bg-white/90 border border-white/80 text-emerald-950 font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-xs"
              >
                Source More Produce
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form (Frosted Glass) */
          <>
            <div>
              <Link
                to="/cart"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 mb-2 glass px-3 py-1 rounded-full border border-white/80"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Cart
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif] mt-2">
                Secure Escrow Checkout
              </h1>
              <p className="text-xs sm:text-sm text-emerald-700/80 font-medium">
                Confirm destination warehouse, specify refrigerated logistics, and deposit escrow funds
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Step 1: Receiving Address */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs space-y-4">
                <h3 className="font-black text-base text-emerald-950 pb-2 border-b border-emerald-100/60 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Receiving Warehouse & Buyer Contact</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Buyer / Org Name</label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || 'FreshDirect Wholesale (Priya Sharma)'}
                      className="w-full bg-white/40 border border-emerald-200/60 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Recipient Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    Warehouse Delivery Address (GPS Geo-Tagged)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                  />
                </div>
              </div>

              {/* Step 2: Transport & Fleet Requirements */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs space-y-4">
                <h3 className="font-black text-base text-emerald-950 pb-2 border-b border-emerald-100/60 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>Logistics Carrier & Cargo Protection</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Transport Vehicle Specification</label>
                    <select
                      value={vehicleType}
                      onChange={e => setVehicleType(e.target.value)}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-amber-600 focus:outline-none shadow-xs"
                    >
                      <option value="Insulated Reefer (0-4°C)">Insulated Reefer (0–4°C for Perishables)</option>
                      <option value="Ventilated Closed Container (14ft)">Ventilated Closed Container (14ft)</option>
                      <option value="Tarpaulin Open Truck (Grain/Pulses)">Tarpaulin Open Truck (Grain/Pulses)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Handling / Driver Instructions</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-amber-600 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs space-y-4">
                <h3 className="font-black text-base text-emerald-950 pb-2 border-b border-emerald-100/60 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <span>Escrow Deposit Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-emerald-500 bg-white/90 shadow-sm'
                        : 'border-white/80 glass hover:bg-white/80'
                    }`}
                  >
                    <div className="font-black text-xs text-emerald-950">Instant UPI / QR</div>
                    <p className="text-[11px] text-emerald-700/80 mt-1 font-medium">Direct Bank Escrow via NPCI</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'NET_BANKING'
                        ? 'border-emerald-500 bg-white/90 shadow-sm'
                        : 'border-white/80 glass hover:bg-white/80'
                    }`}
                  >
                    <div className="font-black text-xs text-emerald-950">Corporate NetBanking</div>
                    <p className="text-[11px] text-emerald-700/80 mt-1 font-medium">HDFC, ICICI, SBI, Axis</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ESCROW_RTGS')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'ESCROW_RTGS'
                        ? 'border-emerald-500 bg-white/90 shadow-sm'
                        : 'border-white/80 glass hover:bg-white/80'
                    }`}
                  >
                    <div className="font-black text-xs text-emerald-950">RTGS / Virtual Escrow</div>
                    <p className="text-[11px] text-emerald-700/80 mt-1 font-medium">For Institutional & FPO Orders</p>
                  </button>
                </div>

                <div className="glass-card-dark text-white p-5 rounded-2xl flex items-center justify-between text-xs shadow-lg shadow-emerald-950/20 border border-emerald-500/30">
                  <div>
                    <span className="text-emerald-300 block text-[11px] font-medium">Total Escrow Amount to Authorize</span>
                    <span className="text-2xl font-black text-white font-['Outfit',sans-serif]">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-right text-[11px] text-emerald-200 font-medium">
                    <div>Produce: ₹{subtotal.toLocaleString()}</div>
                    <div>Freight: ₹{estimatedDelivery.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>{loading ? 'Securing Escrow Funds...' : 'Authorize Escrow & Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
