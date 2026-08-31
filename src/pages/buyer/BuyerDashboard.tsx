import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Package,
  Truck,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cropApi, orderApi } from '../../services/api';
import { Crop, Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
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
      setCrops(cropsData.slice(0, 4));
      setOrders(ordersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalSourcedAmount = orders.reduce((sum, o) => sum + (o.total_amount || o.total_price || 0), 0);
  const activeShipments = orders.filter(o => o.status === 'IN_TRANSIT' || o.status === 'PICKED_UP').length;
  const activeOrder = orders.find(o => o.status === 'IN_TRANSIT' || o.status === 'PICKED_UP') || orders[0];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Header (Title, Short description, 1-2 primary actions) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Buyer Procurement Hub • {user?.name || 'Priya Sharma'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Buyer Procurement
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Source verified produce lots directly from farm gates across India with full escrow security and cold-chain tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/marketplace"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Browse Marketplace</span>
            </Link>

            <Link
              to="/buyer/orders"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>View Orders</span>
            </Link>
          </div>
        </div>

        {/* 2. Important Statistics (4 Clean Metric Cards) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Total Sourced Value</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              ₹{(totalSourcedAmount || 184500).toLocaleString()}
            </h3>
            <div className="flex items-center text-xs font-semibold text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>Escrow Protected</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Purchase Orders</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {orders.length}
            </h3>
            <p className="text-xs text-slate-500">Across verified Mandi regions</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Active Shipments</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {activeShipments} Trucks
            </h3>
            <p className="text-xs text-emerald-600 font-semibold">GPS fleet tracking active</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Middleman Savings</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit',sans-serif]">
              ~14.5%
            </h3>
            <p className="text-xs text-slate-500">Direct farm-gate realized price</p>
          </div>
        </section>

        {/* 3. One Important Card: Active Shipment Spotlight */}
        {activeOrder && (
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Shipment Spotlight: #{activeOrder.id}</span>
                    <StatusBadge status={activeOrder.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeOrder.items.map(i => `${i.crop_name} (${i.quantity} ${i.unit})`).join(', ')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Order</span>
                <span className="text-base font-black text-slate-900">
                  ₹{(activeOrder.total_amount || activeOrder.total_price || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
              <div>
                <span className="text-slate-500 block font-medium">Origin Farm Gate</span>
                <span className="font-bold text-slate-900">{activeOrder.farmer_name || 'Nashik District, Maharashtra'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Destination Delivery</span>
                <span className="font-bold text-slate-900">{activeOrder.delivery_address || 'Central Distribution Warehouse, Mumbai'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Transit Status</span>
                <span className="font-bold text-emerald-700">Reefer Truck En Route • Temperature Monitored</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Recent Activity: Purchase Orders & Recommended Produce */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Purchase Orders</h2>
                <p className="text-xs text-slate-500">Track delivery status and inspection receipts</p>
              </div>
              <Link to="/buyer/orders" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                <span>View All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading purchase history...</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <p>No orders yet. Discover fresh crops in the marketplace!</p>
                  <Link to="/marketplace" className="inline-block bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs">
                    Browse Produce
                  </Link>
                </div>
              ) : (
                orders.slice(0, 4).map(order => (
                  <div key={order.id} className="p-4 space-y-2 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-800">#{order.id.slice(-5)}</span>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        ₹{(order.total_amount || order.total_price || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-xs text-slate-700 font-medium flex justify-between">
                          <span>{it.crop_name} ({it.quantity} {it.unit})</span>
                          <span className="text-slate-500 font-semibold">₹{it.price_per_unit || it.unit_price}/{it.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fresh Crops Available for Procurement */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Available Fresh Harvests</h2>
                <p className="text-xs text-slate-500">Direct from verified growers</p>
              </div>
              <Link to="/marketplace" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                <span>Browse All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
              {crops.map(crop => (
                <div key={crop.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={crop.image} alt={crop.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{crop.name}</h4>
                      <p className="text-[11px] text-slate-500">{crop.variety} • {crop.location.split(',')[0]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-slate-900">₹{crop.price}/{crop.unit}</div>
                    <Link
                      to={`/product/${crop.id}`}
                      className="inline-block text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 mt-0.5"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
