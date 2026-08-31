import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  Navigation,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transportService } from '../../services/transportService';
import { TransportRequest, TransportStatus } from '../../types';

export const ActiveDeliveriesPage: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await transportService.getAllDeliveries(user?.id);
      setDeliveries(data);
    } catch (err) {
      console.error('Failed to load active deliveries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const handleUpdate = () => fetchDeliveries();
    window.addEventListener('farmlink_transports_updated', handleUpdate);
    return () => window.removeEventListener('farmlink_transports_updated', handleUpdate);
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickStatusUpdate = async (id: string, nextStatus: TransportStatus) => {
    try {
      await transportService.updateDeliveryStatus(id, nextStatus);
      showToast(`Trip updated to ${nextStatus.replace('_', ' ')}.`);
      await fetchDeliveries();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (d.status === 'ASSIGNED' || d.status === 'ACCEPTED' || d.status === 'PICKED_UP' || d.status === 'IN_TRANSIT')) ||
      d.status === statusFilter;

    const query = searchQuery.toLowerCase();
    const crop = (d.crop || d.crop_names || '').toLowerCase();
    const orderId = (d.order_id || d.orderId || d.id).toLowerCase();
    const pickup = (d.pickupLocation || d.pickup_location || '').toLowerCase();
    const dest = (d.destination || d.delivery_location || '').toLowerCase();

    const matchesQuery = crop.includes(query) || orderId.includes(query) || pickup.includes(query) || dest.includes(query);

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen py-8 text-emerald-950">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="glass bg-emerald-900/90 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">{toastMessage}</p>
              <p className="text-[11px] text-emerald-200">Buyer and farmer timelines updated in real-time.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Truck className="w-3.5 h-3.5 text-emerald-600" /> Active Fleet Manifest
            </div>
            <h1 className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Active Deliveries
            </h1>
            <p className="text-sm text-emerald-800/80 font-medium mt-1">
              Track in-transit consignments, update checkpoints, and execute farm-to-market handoffs.
            </p>
          </div>

          <Link
            to="/transporter/loads"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Package className="w-4 h-4" />
            <span>Find More Loads</span>
          </Link>
        </div>

        {/* Status Filter Tabs & Search */}
        <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ALL', label: 'All Trips' },
                { id: 'ASSIGNED', label: 'Assigned' },
                { id: 'PICKED_UP', label: 'Picked Up' },
                { id: 'IN_TRANSIT', label: 'In Transit' },
                { id: 'DELIVERED', label: 'Completed' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'glass hover:bg-white text-emerald-900 border border-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search delivery or Order ID..."
                className="w-full bg-white/70 border border-emerald-200/80 rounded-xl pl-10 pr-3 py-1.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        {loading ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/80">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-emerald-800 font-bold">Synchronizing active fleet telemetry...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/80 text-emerald-800 text-xs font-medium space-y-3">
            <Truck className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-base font-bold text-emerald-950">No deliveries found in this view</p>
            <p className="text-xs text-emerald-700/80">Check Available Loads to accept new agricultural assignments.</p>
            <Link
              to="/transporter/loads"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-xs"
            >
              Browse Open Loads
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map(delivery => {
              const isAssigned = delivery.status === 'ASSIGNED' || delivery.status === 'ACCEPTED';
              const isPickedUp = delivery.status === 'PICKED_UP';
              const isInTransit = delivery.status === 'IN_TRANSIT';
              const isDelivered = delivery.status === 'DELIVERED';

              return (
                <div
                  key={delivery.id}
                  className="glass rounded-3xl border border-white/80 p-6 shadow-xs hover:bg-white/85 transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-100/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
                        {(delivery.crop || delivery.crop_names || '').toLowerCase().includes('tomato')
                          ? '🍅'
                          : (delivery.crop || delivery.crop_names || '').toLowerCase().includes('onion')
                          ? '🧅'
                          : (delivery.crop || delivery.crop_names || '').toLowerCase().includes('rice')
                          ? '🌾'
                          : (delivery.crop || delivery.crop_names || '').toLowerCase().includes('turmeric')
                          ? '🌿'
                          : '📦'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-emerald-900">
                            #{delivery.order_id || delivery.orderId || delivery.id}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                              isDelivered
                                ? 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40'
                                : isInTransit
                                ? 'bg-amber-500/20 text-amber-900 border-amber-500/40 animate-pulse'
                                : 'bg-sky-500/20 text-sky-900 border-sky-500/40'
                            }`}
                          >
                            {delivery.status}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-emerald-950 mt-0.5 font-['Outfit',sans-serif]">
                          {delivery.crop || delivery.crop_names?.split('(')[0].trim() || 'Crop Consignment'} —{' '}
                          {delivery.quantity || delivery.cargo_weight_kg || 500} {delivery.unit || 'kg'}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 text-right">
                      <div>
                        <span className="text-[11px] text-emerald-700/80 font-medium block">Freight Settlement</span>
                        <span className="text-lg font-black text-emerald-950 font-['Outfit',sans-serif]">
                          ₹{(delivery.estimatedEarnings || delivery.estimated_cost || delivery.delivery_cost || 4500).toLocaleString()}
                        </span>
                      </div>

                      <Link
                        to={`/transporter/deliveries/${delivery.id}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <span>View Delivery</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Route & Live Checkpoint Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-1">
                      <span className="text-[10px] text-emerald-700 font-bold block">ORIGIN (Farm Gate)</span>
                      <p className="font-extrabold text-emerald-950 leading-snug truncate">
                        {delivery.pickupLocation || delivery.pickup_location}
                      </p>
                    </div>

                    <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-1">
                      <span className="text-[10px] text-emerald-700 font-bold block">DESTINATION HUB</span>
                      <p className="font-extrabold text-emerald-950 leading-snug truncate">
                        {delivery.destination || delivery.delivery_location}
                      </p>
                    </div>

                    <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-1">
                      <span className="text-[10px] text-emerald-700 font-bold block">LIVE CHECKPOINT</span>
                      <p className="font-extrabold text-emerald-950 leading-snug truncate">
                        {delivery.current_location || 'En route to farm pickup'}
                      </p>
                    </div>
                  </div>

                  {/* Lifecycle Quick Action Buttons */}
                  {!isDelivered && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-100/60">
                      <span className="text-xs text-emerald-800 font-medium">Quick Status Progression:</span>
                      <div className="flex items-center gap-2">
                        {isAssigned && (
                          <button
                            onClick={() => handleQuickStatusUpdate(delivery.id, 'PICKED_UP')}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                          >
                            Mark as Picked Up
                          </button>
                        )}
                        {isPickedUp && (
                          <button
                            onClick={() => handleQuickStatusUpdate(delivery.id, 'IN_TRANSIT')}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                          >
                            Start Transit (In Transit)
                          </button>
                        )}
                        {isInTransit && (
                          <button
                            onClick={() => handleQuickStatusUpdate(delivery.id, 'DELIVERED')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Delivered</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
