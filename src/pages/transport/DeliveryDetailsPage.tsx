import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock,
  DollarSign,
  Phone,
  User,
  ShieldCheck,
  Navigation,
  FileText,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transportService } from '../../services/transportService';
import { TransportRequest, TransportStatus } from '../../types';

export const DeliveryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [delivery, setDelivery] = useState<TransportRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDelivery = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await transportService.getDeliveryById(id);
      setDelivery(data);
      if (data?.current_location) {
        setCustomLocation(data.current_location);
      }
    } catch (err) {
      console.error('Failed to load delivery details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
    const handleUpdate = () => fetchDelivery();
    window.addEventListener('farmlink_transports_updated', handleUpdate);
    return () => window.removeEventListener('farmlink_transports_updated', handleUpdate);
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = async (nextStatus: TransportStatus, customLoc?: string) => {
    if (!delivery) return;
    setUpdating(true);
    try {
      const locToUse = customLoc || customLocation || undefined;
      await transportService.updateDeliveryStatus(delivery.id, nextStatus, locToUse);
      showToast(`Status updated to ${nextStatus.replace('_', ' ')}.`);
      await fetchDelivery();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveCheckpoint = async () => {
    if (!delivery || !customLocation) return;
    setUpdating(true);
    try {
      await transportService.updateDeliveryStatus(delivery.id, delivery.status, customLocation);
      showToast('Live GPS checkpoint logged and shared with Buyer & Farmer.');
      await fetchDelivery();
    } catch (err) {
      console.error('Failed to save checkpoint', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="glass p-8 rounded-3xl border border-white/80 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-emerald-800 font-bold">Synchronizing real-time GPS telemetry...</p>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto glass p-8 rounded-3xl border border-white/80 space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-950">Delivery Not Found</h2>
          <p className="text-xs text-emerald-700">The delivery tracking record could not be found.</p>
          <Link
            to="/transporter/deliveries"
            className="inline-block bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-xs"
          >
            Back to Active Deliveries
          </Link>
        </div>
      </div>
    );
  }

  const isAssigned = delivery.status === 'ASSIGNED' || delivery.status === 'ACCEPTED';
  const isPickedUp = delivery.status === 'PICKED_UP';
  const isInTransit = delivery.status === 'IN_TRANSIT';
  const isDelivered = delivery.status === 'DELIVERED';

  // Timeline steps
  const steps = [
    {
      id: 'ASSIGNED',
      label: 'Load Assigned',
      sublabel: 'Transporter accepted consignor dispatch',
      completed: true,
      current: isAssigned
    },
    {
      id: 'PICKED_UP',
      label: 'Pickup Completed',
      sublabel: `Loaded at ${delivery.pickupLocation || delivery.pickup_location}`,
      completed: isPickedUp || isInTransit || isDelivered,
      current: isPickedUp
    },
    {
      id: 'IN_TRANSIT',
      label: 'In Transit',
      sublabel: delivery.current_location || 'En route on express corridor',
      completed: isInTransit || isDelivered,
      current: isInTransit
    },
    {
      id: 'DELIVERED',
      label: 'Delivered',
      sublabel: `Handover at ${delivery.destination || delivery.delivery_location}`,
      completed: isDelivered,
      current: isDelivered
    }
  ];

  return (
    <div className="min-h-screen py-8 text-emerald-950">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="glass bg-emerald-900/90 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">{toastMessage}</p>
              <p className="text-[11px] text-emerald-200">Synchronized across farm-to-buyer network.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/transporter/deliveries"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 glass px-3.5 py-1.5 rounded-2xl border border-white/80 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Active Deliveries</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-800/80 font-mono font-bold">
              Consignment ID: #{delivery.id} • Order #{delivery.order_id || delivery.orderId || 'ORD-9021'}
            </span>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full border ${
                isDelivered
                  ? 'bg-emerald-500/20 text-emerald-950 border-emerald-500/40'
                  : isInTransit
                  ? 'bg-amber-500/20 text-amber-950 border-amber-500/40'
                  : 'bg-sky-500/20 text-sky-950 border-sky-500/40'
              }`}
            >
              {delivery.status}
            </span>
          </div>
        </div>

        {/* Hero Consignment & Route Header */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-100/60 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Active Agricultural Freight
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                {delivery.crop || delivery.crop_names?.split('(')[0].trim() || 'Tomato'} —{' '}
                {delivery.quantity || delivery.cargo_weight_kg || 500} {delivery.unit || 'kg'}
              </h1>
              <p className="text-xs text-emerald-700/80 font-medium mt-1">
                Carrier: <strong className="text-emerald-950">{delivery.transporterName || user?.name || 'Gurpreet Singh'}</strong> • Vehicle:{' '}
                <strong className="text-emerald-950 font-mono">{delivery.vehicle_number || user?.vehicle_number || 'MH 12 QX 4821'}</strong>
              </p>
            </div>

            <div className="text-right glass p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40">
              <span className="text-xs text-emerald-700 block font-medium">Secured Freight Earnings</span>
              <span className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                ₹{(delivery.estimatedEarnings || delivery.estimated_cost || delivery.delivery_cost || 4500).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">✓ Direct Escrow Settlement</span>
            </div>
          </div>

          {/* Visual Route Points */}
          <div className="glass p-5 rounded-2xl border border-white/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold uppercase tracking-wider">
              <span>Origin Farm Gate</span>
              <span>{delivery.distance || delivery.distance_km || 650} km Corridor</span>
              <span>Destination Hub</span>
            </div>

            {/* Route Bar */}
            <div className="relative flex items-center justify-between">
              <div className="w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 shrink-0 z-10 flex items-center justify-center text-[9px] text-white font-bold">
                ✓
              </div>
              <div className="flex-1 h-1.5 bg-emerald-200 mx-2 relative overflow-hidden rounded-full">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                  style={{
                    width: isDelivered ? '100%' : isInTransit ? '70%' : isPickedUp ? '35%' : '15%'
                  }}
                />
              </div>
              <div
                className={`w-4 h-4 rounded-full ring-4 shrink-0 z-10 flex items-center justify-center text-[9px] text-white font-bold ${
                  isDelivered ? 'bg-emerald-600 ring-emerald-100' : 'bg-sky-600 ring-sky-100 animate-pulse'
                }`}
              >
                ●
              </div>
            </div>

            <div className="flex items-start justify-between text-xs pt-1">
              <div className="max-w-[45%]">
                <span className="font-extrabold text-emerald-950 block">
                  {delivery.pickupLocation || delivery.pickup_location}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Farmer: {delivery.farmer || delivery.pickup_farmer_name || 'Ramesh Patel'}
                </span>
              </div>
              <div className="max-w-[45%] text-right">
                <span className="font-extrabold text-emerald-950 block">
                  {delivery.destination || delivery.delivery_location}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Buyer: {delivery.buyer_name || 'FreshDirect Wholesale'}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Step Visual Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-extrabold text-emerald-950">Freight Progression Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    step.current
                      ? 'glass bg-emerald-100/60 border-emerald-500/60 shadow-sm ring-2 ring-emerald-400/40'
                      : step.completed
                      ? 'glass bg-emerald-50/30 border-emerald-300/40'
                      : 'glass bg-white/40 border-gray-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : step.current
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-emerald-200 text-emerald-800'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <span className="text-xs font-extrabold text-emerald-950">{step.label}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700/90 leading-tight">{step.sublabel}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button Based on Status */}
          <div className="glass p-5 rounded-2xl border border-emerald-300/80 bg-emerald-50/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-emerald-950">Next Required Fleet Action</h4>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  Advance the transport status to trigger automated buyer alerts and escrow verification.
                </p>
              </div>

              <div>
                {isAssigned && (
                  <button
                    onClick={() => handleUpdateStatus('PICKED_UP')}
                    disabled={updating}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>{updating ? 'Updating...' : 'Mark as Picked Up'}</span>
                  </button>
                )}

                {isPickedUp && (
                  <button
                    onClick={() => handleUpdateStatus('IN_TRANSIT')}
                    disabled={updating}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{updating ? 'Updating...' : 'Start Transit (In Transit)'}</span>
                  </button>
                )}

                {isInTransit && (
                  <button
                    onClick={() => handleUpdateStatus('DELIVERED')}
                    disabled={updating}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{updating ? 'Updating...' : 'Mark as Delivered'}</span>
                  </button>
                )}

                {isDelivered && (
                  <div className="inline-flex items-center gap-2 bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Delivery Handover Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Checkpoint / Location Update Section */}
          {!isDelivered && (
            <div className="glass p-5 rounded-2xl border border-white/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-600" /> Live GPS Checkpoint Broadcast
                </h4>
                <span className="text-[11px] text-emerald-700">Visible to Buyer & Farmer</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customLocation}
                  onChange={e => setCustomLocation(e.target.value)}
                  placeholder="e.g. Solapur-Hyderabad Highway (NH 65), Km 310"
                  className="flex-1 bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <button
                  onClick={handleSaveCheckpoint}
                  disabled={updating}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  Save Checkpoint
                </button>
              </div>

              {/* Quick simulated presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-emerald-700 font-bold">Quick Presets:</span>
                {[
                  'Farm Gate Loading Yard, Nashik',
                  'Kolhapur Bypass Toll Plaza (NH 48)',
                  'Solapur-Hyderabad Highway (NH 65), Km 310',
                  'Patancheru Outer Ring Road Toll, Hyderabad',
                  'Bowenpally Wholesale Terminal Gate 4'
                ].map(preset => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCustomLocation(preset);
                      handleUpdateStatus(delivery.status, preset);
                    }}
                    className="text-[10px] bg-white/70 hover:bg-white text-emerald-900 border border-emerald-200/80 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    {preset.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stakeholders Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Farmer Card */}
            <div className="glass p-4 rounded-2xl border border-white/80 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100/60">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Consignor (Farmer)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Pickup Point
                </span>
              </div>
              <p className="font-extrabold text-sm text-emerald-950">
                {delivery.farmer || delivery.pickup_farmer_name || 'Ramesh Patel'}
              </p>
              <p className="text-emerald-800/80 font-medium">
                {delivery.pickupLocation || delivery.pickup_location}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={`tel:${delivery.farmer_phone || delivery.pickup_contact || '+919845211029'}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Farmer ({delivery.farmer_phone || delivery.pickup_contact || '+91 98452 11029'})</span>
                </a>
              </div>
            </div>

            {/* Buyer Card */}
            <div className="glass p-4 rounded-2xl border border-white/80 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100/60">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Consignee (Buyer)</span>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Drop-off Point
                </span>
              </div>
              <p className="font-extrabold text-sm text-emerald-950">
                {delivery.buyer_name || 'Priya Sharma (FreshDirect)'}
              </p>
              <p className="text-emerald-800/80 font-medium">
                {delivery.destination || delivery.delivery_location}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={`tel:${delivery.buyer_contact || '+919820045678'}`}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Buyer ({delivery.buyer_contact || '+91 98200 45678'})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
