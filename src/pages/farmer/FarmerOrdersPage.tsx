import React, { useState, useEffect } from 'react';
import { orderApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Package, MapPin, Phone, User, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';

export const FarmerOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const farmerId = user?.id || 'usr_farmer_1';
      const data = await orderApi.getAll({ farmer_id: farmerId });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderApi.updateStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'ALL') return true;
    return o.status === activeFilter;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5 text-emerald-600" /> Direct Buyer Orders
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Incoming Wholesale Orders
            </h1>
            <p className="text-xs sm:text-sm text-emerald-700/80 font-medium">
              Manage fulfillment, approve buyer purchase orders, and coordinate logistics handovers
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto glass p-1.5 rounded-2xl border border-white/80 self-start sm:self-auto shadow-xs">
            {['ALL', 'PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-900 hover:bg-white/60'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center border border-white/80 text-emerald-800 font-medium shadow-xs">
              No orders matching the selected status.
            </div>
          ) : (
            filteredOrders.map(order => (
              <div
                key={order.id}
                className="glass rounded-3xl border border-white/80 p-6 sm:p-7 shadow-xs space-y-5 hover:bg-white/70 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-100/60 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 flex items-center justify-center font-black text-xs font-mono">
                      #{order.id.slice(-4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-emerald-950">Order ID: {order.id}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-emerald-700/70 mt-0.5 font-medium">
                        Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-emerald-700/80 font-medium">Total Order Amount</div>
                    <div className="text-xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                      ₹{(order.total_amount || order.total_price || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Escrow Secured
                    </div>
                  </div>
                </div>

                {/* Items & Buyer Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                  {/* Items Col */}
                  <div className="md:col-span-7 space-y-3">
                    <span className="font-black text-emerald-950 uppercase tracking-wider text-[11px] block">
                      Ordered Crop Lots
                    </span>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="glass p-3.5 rounded-2xl border border-white/80 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-emerald-950 block">{item.crop_name}</span>
                            <span className="text-emerald-700/80 font-medium">
                              Unit Price: ₹{item.price_per_unit || item.unit_price}/{item.unit}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-950 text-sm">
                              {item.quantity.toLocaleString()} {item.unit}
                            </span>
                            <span className="text-emerald-700 font-bold block">₹{(item.total || (item.price_per_unit || item.unit_price || 0) * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buyer & Logistics Col */}
                  <div className="md:col-span-5 glass p-4 rounded-2xl border border-white/80 space-y-3">
                    <span className="font-black text-emerald-950 uppercase tracking-wider text-[11px] block">
                      Buyer & Logistics Details
                    </span>

                    <div className="space-y-2 text-emerald-900 font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="font-black text-emerald-950">{order.buyer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>{order.buyer_phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{order.delivery_address}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 border-t border-emerald-100/60">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Payment Method: {order.payment_method}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="pt-2 border-t border-emerald-100/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-emerald-700/80 font-medium">
                    Status: <strong className="text-emerald-950 font-bold">{order.status}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept & Confirm Order</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                          className="glass hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2 rounded-2xl transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PICKED_UP')}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/20"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Confirm Farm-Gate Pickup</span>
                      </button>
                    )}

                    {order.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'IN_TRANSIT')}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Mark In Transit</span>
                      </button>
                    )}

                    {order.status === 'IN_TRANSIT' && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-500/20 px-3.5 py-1.5 rounded-2xl border border-emerald-500/30">
                        Produce on Route to Buyer Warehouse
                      </span>
                    )}

                    {order.status === 'DELIVERED' && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-500/20 px-3.5 py-1.5 rounded-2xl border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivery Complete & Settled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
