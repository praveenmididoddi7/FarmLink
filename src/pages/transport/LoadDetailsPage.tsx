import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  ShieldCheck,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transportService } from '../../services/transportService';
import { TransportRequest } from '../../types';

export const LoadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [load, setLoad] = useState<TransportRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [vehicleNo, setVehicleNo] = useState(user?.vehicle_number || 'MH 12 QX 4821');
  const [driverPhone, setDriverPhone] = useState(user?.phone || '+91 98765 43210');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoad = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await transportService.getDeliveryById(id);
        setLoad(data);
      } catch (err) {
        console.error('Failed to load details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoad();
  }, [id]);

  const handleAcceptDelivery = async () => {
    if (!load) return;
    setAccepting(true);
    try {
      await transportService.acceptLoad(load.id, {
        id: user?.id || 'usr_transport_1',
        name: user?.name || 'Gurpreet Singh (Kishan Express)',
        vehicleNumber: vehicleNo,
        driverPhone: driverPhone
      });
      setToastMessage('Delivery accepted successfully.');
      setTimeout(() => {
        navigate(`/transporter/deliveries/${load.id}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to accept delivery', err);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="glass p-8 rounded-3xl border border-white/80 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-emerald-800 font-bold">Loading agricultural consignment details...</p>
        </div>
      </div>
    );
  }

  if (!load) {
    return (
      <div className="min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto glass p-8 rounded-3xl border border-white/80 space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-950">Load Consignment Not Found</h2>
          <p className="text-xs text-emerald-700">The requested freight request could not be located or has been archived.</p>
          <Link
            to="/transporter/loads"
            className="inline-block bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-xs"
          >
            Back to Available Loads
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = load.status === 'AVAILABLE' || load.status === 'PENDING';

  return (
    <div className="min-h-screen py-8 text-emerald-950">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="glass bg-emerald-900/90 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">{toastMessage}</p>
              <p className="text-[11px] text-emerald-200">Redirecting to live delivery tracking...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/transporter/loads"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 glass px-3.5 py-1.5 rounded-2xl border border-white/80"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Available Loads</span>
          </Link>

          <span
            className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
              isAvailable
                ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-800 border-amber-500/30'
            }`}
          >
            Status: {load.status}
          </span>
        </div>

        {/* Hero Card */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-100/60 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-900 flex items-center justify-center text-3xl shadow-xs">
                {(load.crop || load.crop_names || '').toLowerCase().includes('tomato')
                  ? '🍅'
                  : (load.crop || load.crop_names || '').toLowerCase().includes('onion')
                  ? '🧅'
                  : (load.crop || load.crop_names || '').toLowerCase().includes('rice')
                  ? '🌾'
                  : (load.crop || load.crop_names || '').toLowerCase().includes('turmeric')
                  ? '🌿'
                  : (load.crop || load.crop_names || '').toLowerCase().includes('potato')
                  ? '🥔'
                  : '📦'}
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 block">
                  Consignment #{load.id} • Order #{load.order_id || load.orderId || 'ORD-9021'}
                </span>
                <h1 className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                  {load.crop || load.crop_names?.split('(')[0].trim() || 'Agricultural Consignment'}
                </h1>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">
                  Payload: {load.quantity || load.cargo_weight_kg || 500} {load.unit || 'kg'}
                </p>
              </div>
            </div>

            <div className="text-right glass p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/50">
              <span className="text-xs text-emerald-700 block font-medium">Estimated Freight Earnings</span>
              <span className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                ₹{(load.estimatedEarnings || load.estimated_cost || load.delivery_cost || 4500).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">✓ Digital Escrow Secured</span>
            </div>
          </div>

          {/* Route Card */}
          <div className="glass p-5 rounded-2xl border border-white/80 space-y-4">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Route & Mandi Geography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">Farm Pickup Origin</span>
                </div>
                <p className="text-xs text-emerald-800 font-medium pl-4.5">
                  {load.pickupLocation || load.pickup_location}
                </p>
                <p className="text-[11px] text-emerald-700 pl-4.5">
                  Farmer: <strong className="text-emerald-950">{load.farmer || load.pickup_farmer_name || 'Ramesh Patel'}</strong> (
                  {load.farmer_phone || load.pickup_contact || '+91 98452 11029'})
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  <span className="text-xs font-bold text-emerald-950">Destination Wholesale Hub</span>
                </div>
                <p className="text-xs text-emerald-800 font-medium pl-4.5">
                  {load.destination || load.delivery_location}
                </p>
                <p className="text-[11px] text-emerald-700 pl-4.5">
                  Consignee: <strong className="text-emerald-950">{load.buyer_name || 'Verified Wholesale Buyer'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Consignment Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-0.5">
              <span className="text-emerald-700/80 text-[11px] block font-medium">Highway Distance</span>
              <span className="font-extrabold text-emerald-950 text-sm">{load.distance || load.distance_km || 650} km</span>
            </div>
            <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-0.5">
              <span className="text-emerald-700/80 text-[11px] block font-medium">Pickup Date</span>
              <span className="font-extrabold text-emerald-950 text-sm">{load.pickupDate || load.pickup_date || 'Ready for Pickup'}</span>
            </div>
            <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-0.5">
              <span className="text-emerald-700/80 text-[11px] block font-medium">Cargo Category</span>
              <span className="font-extrabold text-emerald-950 text-sm">{load.crop || 'Perishable'}</span>
            </div>
            <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-0.5">
              <span className="text-emerald-700/80 text-[11px] block font-medium">Vehicle Required</span>
              <span className="font-extrabold text-emerald-950 text-sm">{load.vehicle_type || '14ft Reefer / Tarpaulin'}</span>
            </div>
          </div>

          {/* Special Handling Instructions */}
          <div className="glass p-4 rounded-2xl border border-amber-300/60 bg-amber-50/40 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Special Handling & Temperature Instructions</span>
            </div>
            <p className="text-emerald-900/90 font-medium pl-6">
              {load.special_instructions ||
                load.handling_instructions ||
                'Ensure proper ventilation or set reefer cooling to 14°C - 16°C. Secure produce crates against sudden transit shocks.'}
            </p>
          </div>

          {/* Transporter Acceptance Form */}
          {isAvailable ? (
            <div className="glass p-6 rounded-2xl border border-emerald-300/80 space-y-4 bg-emerald-50/20">
              <h3 className="text-sm font-extrabold text-emerald-950">Confirm Vehicle & Accept Trip</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                    Assign Vehicle License Plate
                  </label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={e => setVehicleNo(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="e.g. MH 12 QX 4821"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                    Driver Mobile Number
                  </label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={e => setDriverPhone(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleAcceptDelivery}
                  disabled={accepting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Truck className="w-4 h-4" />
                  <span>{accepting ? 'Assigning Fleet...' : 'Accept Delivery'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-2">
              <Link
                to={`/transporter/deliveries/${load.id}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs inline-flex items-center gap-2 shadow-xs"
              >
                <span>Track Active Delivery</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
