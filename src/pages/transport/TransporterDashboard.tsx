import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Truck,
  Package,
  TrendingUp,
  MapPin,
  ArrowRight,
  ChevronRight,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transportService, TransporterEarningsSummary } from '../../services/transportService';
import { TransportRequest } from '../../types';

export const TransporterDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [availableLoads, setAvailableLoads] = useState<TransportRequest[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<TransportRequest[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<TransporterEarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [acceptingLoadId, setAcceptingLoadId] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [available, active, earnings] = await Promise.all([
        transportService.getAvailableLoads(),
        transportService.getActiveDeliveries(user?.id),
        transportService.getTransporterEarnings(user?.id)
      ]);

      setAvailableLoads(available);
      setActiveDeliveries(active);
      setEarningsSummary(earnings);
    } catch (err) {
      console.error('Failed to load transporter data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const handleUpdate = () => loadAllData();
    window.addEventListener('farmlink_transports_updated', handleUpdate);
    return () => window.removeEventListener('farmlink_transports_updated', handleUpdate);
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAcceptLoad = async (loadId: string) => {
    setAcceptingLoadId(loadId);
    try {
      await transportService.acceptLoad(loadId, {
        id: user?.id || 'usr_transport_1',
        name: user?.name || 'Gurpreet Singh (Kishan Express)',
        vehicleNumber: user?.vehicle_number || 'MH 12 QX 4821',
        driverPhone: user?.phone || '+91 98765 43210'
      });
      showToast('Delivery accepted and added to active trips.');
      await loadAllData();
    } catch (err) {
      console.error('Failed to accept load', err);
    } finally {
      setAcceptingLoadId(null);
    }
  };

  const primaryActiveDelivery = activeDeliveries[0] || null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      {/* Floating Success Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Header (Title, Short description, 1-2 primary actions) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 mb-2">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fleet Operations • {user?.business_name || 'Kishan Express Logistics'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Fleet Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, {user?.name || 'Gurpreet Singh'}. Manage your fleet routes, accept open loads, and track live deliveries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/transporter/loads"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>View Available Loads</span>
            </Link>
            <Link
              to="/transporter/deliveries"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Active Deliveries</span>
            </Link>
          </div>
        </div>

        {/* 2. Important Statistics (4 Clean Metric Cards) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Active Deliveries</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {activeDeliveries.length}
            </h3>
            <p className="text-xs text-slate-500">In transit or pickup underway</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Available Loads</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {availableLoads.length}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold">Ready for dispatch</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Completed Deliveries</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {earningsSummary?.completedDeliveries || 48}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold">100% on-time completion</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              ₹{(earningsSummary?.totalEarnings || 124500).toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-slate-500">Secured in escrow payout</p>
          </div>
        </section>

        {/* 3. One Important Card: Active Delivery Spotlight */}
        {primaryActiveDelivery ? (
          <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-900">
                      Active Delivery Route
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {primaryActiveDelivery.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                    {primaryActiveDelivery.crop || primaryActiveDelivery.crop_names?.split('(')[0].trim() || 'Tomato'} •{' '}
                    {primaryActiveDelivery.quantity || primaryActiveDelivery.cargo_weight_kg || 500} {primaryActiveDelivery.unit || 'kg'}
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Freight Compensation</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{(primaryActiveDelivery.estimatedEarnings || primaryActiveDelivery.estimated_cost || 4500).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Farm Pickup</span>
                  <span className="font-semibold text-slate-900">
                    {primaryActiveDelivery.pickupLocation || primaryActiveDelivery.pickup_location || 'Nashik, Maharashtra'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Delivery Destination</span>
                  <span className="font-semibold text-slate-900">
                    {primaryActiveDelivery.destination || primaryActiveDelivery.delivery_location || 'Mumbai Warehouse, Maharashtra'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Current Checkpoint</span>
                  <span className="font-semibold text-emerald-700">
                    {primaryActiveDelivery.current_location || 'In Transit on NH-60'}
                  </span>
                </div>
                <div>
                  <Link
                    to={`/transporter/deliveries/${primaryActiveDelivery.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Update Checkpoint & Proof</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200/80 shadow-xs space-y-2">
            <Truck className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-900">No active delivery in progress</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your fleet has available capacity. Browse open farm loads below and accept a delivery job.
            </p>
          </div>
        )}

        {/* 4. Recent Activity: Available Loads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Available Agricultural Loads</h2>
              <p className="text-xs text-slate-500">Claim farm loads to fill your routes with guaranteed compensation</p>
            </div>
            <Link
              to="/transporter/loads"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All Loads ({availableLoads.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableLoads.slice(0, 3).map(load => (
              <div
                key={load.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {load.crop || load.crop_names?.split('(')[0].trim() || 'Produce Lot'}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {load.quantity || load.cargo_weight_kg || 500} {load.unit || 'kg'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {load.status || 'AVAILABLE'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">Pickup</span>
                      <span className="font-semibold text-slate-900 truncate block">
                        {load.pickupLocation || load.pickup_location}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-semibold">Destination</span>
                      <span className="font-semibold text-slate-900 truncate block">
                        {load.destination || load.delivery_location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-medium">{load.distance || load.distance_km || 450} km</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{(load.estimatedEarnings || load.estimated_cost || 4500).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to={`/transporter/loads/${load.id}`}
                    className="flex-1 text-center border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2 rounded-xl text-xs transition-colors"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAcceptLoad(load.id)}
                    disabled={acceptingLoadId === load.id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-xs transition-colors disabled:opacity-60 cursor-pointer text-center"
                  >
                    {acceptingLoadId === load.id ? 'Accepting...' : 'Accept Load'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
