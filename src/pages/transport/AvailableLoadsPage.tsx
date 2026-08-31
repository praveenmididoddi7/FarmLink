import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Truck,
  Package,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Info,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transportService } from '../../services/transportService';
import { TransportRequest } from '../../types';

export const AvailableLoadsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loads, setLoads] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchLoads = async () => {
    setLoading(true);
    try {
      const data = await transportService.getAvailableLoads();
      setLoads(data);
    } catch (err) {
      console.error('Failed to load available trips', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
    const handleUpdate = () => fetchLoads();
    window.addEventListener('farmlink_transports_updated', handleUpdate);
    return () => window.removeEventListener('farmlink_transports_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAccept = async (loadId: string) => {
    setAcceptingId(loadId);
    try {
      await transportService.acceptLoad(loadId, {
        id: user?.id || 'usr_transport_1',
        name: user?.name || 'Gurpreet Singh (Kishan Express)',
        vehicleNumber: user?.vehicle_number || 'MH 12 QX 4821',
        driverPhone: user?.phone || '+91 98765 43210'
      });
      showToast('Delivery accepted successfully.');
      await fetchLoads();
    } catch (err) {
      console.error('Failed to accept load', err);
    } finally {
      setAcceptingId(null);
    }
  };

  // Unique locations for filtering
  const uniqueLocations = Array.from(
    new Set(
      loads.map(l => {
        const loc = l.pickupLocation || l.pickup_location || '';
        return loc.split(',')[0].trim();
      })
    )
  ).filter(Boolean);

  const filteredLoads = loads.filter(load => {
    const cropName = (load.crop || load.crop_names || '').toLowerCase();
    const pickup = (load.pickupLocation || load.pickup_location || '').toLowerCase();
    const destination = (load.destination || load.delivery_location || '').toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = cropName.includes(query) || pickup.includes(query) || destination.includes(query);
    const matchesCrop = selectedCrop === 'ALL' || cropName.includes(selectedCrop.toLowerCase());
    const matchesLocation =
      selectedLocation === 'ALL' ||
      pickup.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      destination.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCrop && matchesLocation;
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
              <p className="text-[11px] text-emerald-200">Load moved to your Active Deliveries tab.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5 text-emerald-600" /> Open Agricultural Freight Board
            </div>
            <h1 className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Available Loads
            </h1>
            <p className="text-sm text-emerald-800/80 font-medium mt-1">
              Browse confirmed farmer dispatch requests and accept freight loads instantly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/transporter/deliveries"
              className="glass hover:bg-white text-emerald-950 text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>View Active Deliveries</span>
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-emerald-600 absolute left-4 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by crop name, pickup farm mandi, or target city..."
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              />
            </div>

            {/* Crop Type Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 text-xs text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              >
                <option value="ALL">All Crop Categories</option>
                <option value="Tomato">Tomato</option>
                <option value="Onion">Onion</option>
                <option value="Rice">Basmati Rice</option>
                <option value="Turmeric">Turmeric</option>
                <option value="Chilli">Red Chilli</option>
                <option value="Potato">Potato</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3 py-2.5 text-xs text-emerald-950 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              >
                <option value="ALL">All Pickup Mandis</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Load Cards Grid */}
        {loading ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/80">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-emerald-800 font-bold">Scanning farm-gate load network...</p>
          </div>
        ) : filteredLoads.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/80 text-emerald-800 text-xs font-medium space-y-3">
            <Package className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-950">No loads match your active filters</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCrop('ALL');
                setSelectedLocation('ALL');
              }}
              className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoads.map(load => (
              <div
                key={load.id}
                className="glass rounded-3xl border border-white/80 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:bg-white/80 transition-all hover:shadow-md group"
              >
                <div className="space-y-4">
                  {/* Top Row: Crop & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl">
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
                        <h3 className="font-black text-sm text-emerald-950 leading-tight">
                          {load.crop || load.crop_names?.split('(')[0].trim() || 'Agricultural Cargo'}
                        </h3>
                        <span className="text-xs font-bold text-emerald-700">
                          {load.quantity || load.cargo_weight_kg || 500} {load.unit || 'kg'} payload
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                      {load.status || 'AVAILABLE'}
                    </span>
                  </div>

                  {/* Route & Mandi Details */}
                  <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block">PICKUP LOCATION</span>
                        <span className="font-extrabold text-emerald-950 leading-snug block">
                          {load.pickupLocation || load.pickup_location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-emerald-100/60">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-600 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block">DESTINATION HUB</span>
                        <span className="font-extrabold text-emerald-950 leading-snug block">
                          {load.destination || load.delivery_location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meta Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="space-y-0.5">
                      <span className="text-emerald-700/80 text-[11px] font-medium block">Distance:</span>
                      <span className="font-extrabold text-emerald-950">{load.distance || load.distance_km || 650} km</span>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="text-emerald-700/80 text-[11px] font-medium block">Pickup Date:</span>
                      <span className="font-extrabold text-emerald-950">
                        {load.pickupDate || load.pickup_date || 'Ready for Pickup'}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Earnings */}
                  <div className="glass p-3 rounded-2xl border border-emerald-200/80 flex items-center justify-between bg-emerald-50/40">
                    <span className="text-xs text-emerald-800 font-bold">Estimated Earnings</span>
                    <span className="text-base font-black text-emerald-950 font-['Outfit',sans-serif]">
                      ₹{(load.estimatedEarnings || load.estimated_cost || load.delivery_cost || 4500).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions: View Details & Accept Load */}
                <div className="flex items-center gap-2 pt-2 border-t border-emerald-100/60">
                  <Link
                    to={`/transporter/loads/${load.id}`}
                    className="flex-1 glass hover:bg-white text-emerald-950 font-bold py-2.5 rounded-2xl text-xs text-center border border-white/80 shadow-xs transition-all cursor-pointer"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAccept(load.id)}
                    disabled={acceptingId === load.id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer text-center"
                  >
                    {acceptingId === load.id ? 'Accepting...' : 'Accept Load'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
