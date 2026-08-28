import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  Package,
  Truck,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cropApi, orderApi } from '../../services/api';
import { Crop, Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useCart } from '../../context/CartContext';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const buyerId = user?.id || 'usr_buyer_1';
      const [cropsData, ordersData] = await Promise.all([
        cropApi.getAll(),
        orderApi.getAll({ buyer_id: buyerId })
      ]);
      setCrops(cropsData);
      setOrders(ordersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalSourcedAmount = orders.reduce((sum, o) => sum + (o.total_amount || o.total_price || 0), 0);
  const activeShipments = orders.filter(o => o.status === 'IN_TRANSIT' || o.status === 'PICKED_UP').length;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md shadow-emerald-900/5">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span>Buyer Procurement Portal • {user?.name || 'Priya Sharma'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Buyer Procurement
            </h1>
            <p className="text-xs sm:text-sm text-emerald-700/80 mt-0.5 font-medium">
              Source directly from verified farm gates across India with full quality grade assurance and escrow security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/marketplace"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Browse Live Marketplace</span>
            </Link>
          </div>
        </header>

        {/* 4 Stat Metric Cards (Frosted Glass) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1.5 hover:bg-white/70 transition-all">
            <span className="text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider block">Total Procurement</span>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
              ₹{(totalSourcedAmount || 184500).toLocaleString()}
            </h3>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Escrow Protected
            </div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1.5 hover:bg-white/70 transition-all">
            <span className="text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider block">Purchase Orders</span>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
              {orders.length}
            </h3>
            <div className="text-[11px] text-emerald-700/80 font-medium">Across 6 Mandi regions</div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1.5 hover:bg-white/70 transition-all">
            <span className="text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider block">Active Shipments</span>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
              {activeShipments} Trucks
            </h3>
            <div className="text-[11px] text-emerald-600 font-bold">GPS Reefer tracking live</div>
          </div>

          <div className="glass-card-dark p-5 rounded-3xl shadow-xl shadow-emerald-950/20 space-y-1.5 text-white">
            <span className="text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider block">Middlemen Saved</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              ~14.5%
            </h3>
            <div className="text-[11px] text-emerald-300 font-medium">Direct farm-gate pricing</div>
          </div>
        </section>

        {/* Two Columns: Active Orders Tracking & Recommended Fresh Harvests */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Orders */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-emerald-950">Recent Purchase Orders</h3>
                <p className="text-xs text-emerald-700/80 font-medium">Track shipment status and delivery receipts</p>
              </div>
              <Link to="/buyer/orders" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                View All Orders
              </Link>
            </div>

            <div className="glass rounded-3xl border border-white/80 shadow-xs divide-y divide-emerald-100/60 overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-emerald-700/60 text-xs font-medium">
                  No orders yet. Discover fresh crops in the marketplace!
                </div>
              ) : (
                orders.slice(0, 3).map(order => (
                  <div key={order.id} className="p-5 space-y-2.5 hover:bg-white/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-950">#{order.id}</span>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <span className="text-sm font-black text-emerald-950">
                        ₹{(order.total_amount || order.total_price || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-xs text-emerald-900 font-medium flex justify-between">
                          <span>{it.crop_name} ({it.quantity} {it.unit})</span>
                          <span className="text-emerald-700/80 font-semibold">₹{it.price_per_unit || it.unit_price}/{it.unit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-emerald-700/80 flex items-center justify-between pt-1 font-medium">
                      <span className="truncate max-w-[220px]">Delivery: {order.delivery_address}</span>
                      <Link to="/buyer/orders" className="text-emerald-700 font-bold hover:text-emerald-900">
                        Track Delivery →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fresh Direct Harvests for Immediate Procurement */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-emerald-950">Direct Farm-Gate Opportunities</h3>
                <p className="text-xs text-emerald-700/80 font-medium">Fresh harvests available today with quality guarantee</p>
              </div>
              <Link to="/marketplace" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                Explore All Produce
              </Link>
            </div>

            <div className="space-y-3">
              {crops.slice(0, 3).map(crop => (
                <div
                  key={crop.id}
                  className="glass p-4 rounded-2xl border border-white/80 shadow-xs flex items-center gap-4 hover:bg-white/80 transition-all"
                >
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-200/60 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-emerald-950 truncate">{crop.name}</h4>
                    <p className="text-[11px] text-emerald-700/80 truncate font-medium">{crop.variety} • {crop.location}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-black text-emerald-700">₹{crop.price}/{crop.unit}</span>
                      <span className="text-emerald-300">•</span>
                      <span className="text-emerald-900/80 font-medium">{crop.quantity.toLocaleString()} {crop.unit}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(crop, 50)}
                    className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-900 text-xs font-bold p-2.5 rounded-xl border border-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Add 50 {crop.unit}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
