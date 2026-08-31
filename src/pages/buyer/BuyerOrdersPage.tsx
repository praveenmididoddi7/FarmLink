import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { transportService } from '../../services/transportService';
import { useAuth } from '../../context/AuthContext';
import { Order, TransportRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Package,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Phone,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuyerOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [transports, setTransports] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('farmlink_orders_updated', handleUpdate);
    window.addEventListener('farmlink_transports_updated', handleUpdate);
    return () => {
      window.removeEventListener('farmlink_orders_updated', handleUpdate);
      window.removeEventListener('farmlink_transports_updated', handleUpdate);
    };
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const buyerId = user?.id || 'user_buyer_1';
      const [ordersData, transportsData] = await Promise.all([
        orderService.getAll({ buyer_id: buyerId }),
        transportService.getAll()
      ]);
      setOrders(ordersData);
      setTransports(transportsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (orderId: string) => {
    if (!window.confirm('Confirm that all produce lots have arrived and passed quality gate inspection? This will release escrow payout to the farmer.')) return;
    try {
      await orderService.updateStatus(orderId, 'DELIVERED');
      await loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5" /> Procurement History
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Track Purchase Orders & Logistics
            </h1>
            <p className="text-xs sm:text-sm text-emerald-700/80 font-medium">
              Live farm-gate shipments, reefer temperature verification, and escrow settlement release
            </p>
          </div>

          <Link
            to="/marketplace"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
          >
            <span>Browse More Produce</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center border border-white/80 text-emerald-800 font-medium shadow-xs">
              No orders placed yet.
            </div>
          ) : (
            orders.map(order => {
              const matchedTransport = transports.find(t => t.order_id === order.id);

              return (
                <div
                  key={order.id}
                  className="glass rounded-3xl border border-white/80 p-6 sm:p-8 shadow-xs space-y-6 hover:bg-white/70 transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-100/60 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 flex items-center justify-center font-black text-xs font-mono">
                        #{order.id.slice(-4)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-emerald-950">Purchase Order #{order.id}</h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-xs text-emerald-700/70 mt-0.5 font-medium">
                          Ordered on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-emerald-700/80 font-medium">Total Escrow Amount</div>
                      <div className="text-xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                        ₹{(order.total_amount || order.total_price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Shipment Tracking Progress Bar */}
                  <div className="glass p-4 rounded-2xl border border-white/80">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Live Logistics Status</span>
                      </span>
                      <span className="text-emerald-700">
                        {matchedTransport?.status ? `Transport: ${matchedTransport.status}` : 'Logistics Carrier Assigned'}
                      </span>
                    </div>

                    {/* Visual 4-step Tracker */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                      <div
                        className={`p-2 rounded-xl font-bold ${
                          order.status !== 'CANCELLED' ? 'bg-emerald-600 text-white shadow-xs' : 'glass text-emerald-700'
                        }`}
                      >
                        1. Escrow Deposited
                      </div>
                      <div
                        className={`p-2 rounded-xl font-bold ${
                          order.status === 'CONFIRMED' || order.status === 'PICKED_UP' || order.status === 'IN_TRANSIT' || order.status === 'DELIVERED'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'glass text-emerald-700'
                        }`}
                      >
                        2. Farmer Confirmed
                      </div>
                      <div
                        className={`p-2 rounded-xl font-bold ${
                          order.status === 'IN_TRANSIT' || order.status === 'DELIVERED'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'glass text-emerald-700'
                        }`}
                      >
                        3. In Transit (On Route)
                      </div>
                      <div
                        className={`p-2 rounded-xl font-bold ${
                          order.status === 'DELIVERED' ? 'bg-emerald-600 text-white shadow-xs' : 'glass text-emerald-700'
                        }`}
                      >
                        4. Inspected & Released
                      </div>
                    </div>

                    {matchedTransport && matchedTransport.vehicle_number && (
                      <div className="mt-3 pt-2 border-t border-emerald-100/60 text-xs text-emerald-800 flex flex-wrap items-center justify-between gap-2 font-medium">
                        <span>
                          Driver: <strong>{matchedTransport.provider_name}</strong> ({matchedTransport.driver_phone})
                        </span>
                        <span>Vehicle: <strong className="font-mono font-bold">{matchedTransport.vehicle_number}</strong></span>
                        <span>Location: <strong>{matchedTransport.current_location || 'En-route'}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block">
                      Ordered Crop Lots:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="glass p-3.5 rounded-2xl border border-white/80 flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="text-emerald-950 block font-black">{it.crop_name}</strong>
                            <span className="text-emerald-700/80 font-medium">₹{it.price_per_unit || it.unit_price}/{it.unit}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-950">
                              {it.quantity.toLocaleString()} {it.unit}
                            </span>
                            <span className="text-emerald-700 font-bold block">₹{(it.total || (it.price_per_unit || it.unit_price || 0) * it.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location & Confirmation Footer */}
                  <div className="pt-3 border-t border-emerald-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="text-emerald-700/80 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-md">{order.delivery_address}</span>
                    </div>

                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleConfirmDelivery(order.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Produce Inspection & Release Escrow Payout</span>
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-500/20 px-3.5 py-1.5 rounded-2xl border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Delivery Verified • Escrow Settled to Farmer</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
