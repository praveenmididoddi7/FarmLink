import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Navigation,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transportApi } from '../../services/api';
import { TransportRequest, TransportStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const TransportDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [vehicleNo, setVehicleNo] = useState('MH-15-EG-8821');
  const [driverPhone, setDriverPhone] = useState('+91 94222 34567');
  const [updatingLocationId, setUpdatingLocationId] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    loadTransport();
  }, [user]);

  const loadTransport = async () => {
    setLoading(true);
    try {
      const data = await transportApi.getAll();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptLoad = async (id: string) => {
    try {
      await transportApi.accept(id, {
        provider_id: user?.id || 'usr_transport_1',
        provider_name: user?.name || 'Kisan Cold Logistics (Harpreet Singh)',
        vehicle_number: vehicleNo,
        driver_phone: driverPhone
      });
      setAcceptingId(null);
      await loadTransport();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: string, status: TransportStatus) => {
    try {
      await transportApi.updateStatus(id, status);
      await loadTransport();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLocation = async (id: string) => {
    if (!newLocation.trim()) return;
    try {
      const existing = requests.find(r => r.id === id);
      await transportApi.updateStatus(id, existing?.status || 'IN_TRANSIT', newLocation);
      setUpdatingLocationId(null);
      setNewLocation('');
      await loadTransport();
    } catch (e) {
      console.error(e);
    }
  };

  const activeShipments = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'PICKED_UP' || r.status === 'IN_TRANSIT');
  const availableLoads = requests.filter(r => r.status === 'PENDING');
  const completedShipments = requests.filter(r => r.status === 'DELIVERED');

  const totalEarnings = completedShipments.reduce((sum, r) => sum + r.estimated_cost, 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="glass-card-dark text-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 relative overflow-hidden border border-emerald-500/30">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold px-3.5 py-1 rounded-full mb-3 shadow-xs">
                <Truck className="w-3.5 h-3.5 text-emerald-400" /> Fleet Operations Hub • {user?.name || 'Kisan Cold Logistics'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] text-white">
                Agricultural Cold-Chain Logistics Hub
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl font-normal">
                Accept farm-gate produce pickups, maintain temperature logs, and maximize truck load factors across interstate corridors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/transport/loads"
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>View Available Farm Loads ({availableLoads.length})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">Active Freight Trips</span>
            <div className="text-2xl font-black text-amber-700 font-['Outfit',sans-serif]">
              {activeShipments.length}
            </div>
            <div className="text-[11px] text-emerald-800/80 font-medium">Live GPS tracking active</div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">Available Farm Loads</span>
            <div className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              {availableLoads.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold">Immediate pickup available</div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">Completed Deliveries</span>
            <div className="text-2xl font-black text-emerald-800 font-['Outfit',sans-serif]">
              {completedShipments.length || 18}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold">100% on-time SLA</div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700">Realized Freight Revenue</span>
            <div className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              ₹{(totalEarnings || 64500).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-800/80 font-medium">Direct carrier bank deposit</div>
          </div>
        </div>

        {/* Active Trips in Transit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-emerald-950">Active Freight Shipments</h3>
              <p className="text-xs text-emerald-700/80 font-medium">Update checkpoint milestones and live vehicle telemetry</p>
            </div>
            <span className="text-xs text-emerald-800 font-bold">
              {activeShipments.length} Ongoing Dispatches
            </span>
          </div>

          {activeShipments.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center border border-white/80 text-emerald-800 text-xs font-medium">
              No shipments currently assigned to your fleet. Accept a load from the open load board below!
            </div>
          ) : (
            <div className="space-y-4">
              {activeShipments.map(shipment => (
                <div
                  key={shipment.id}
                  className="glass rounded-3xl border border-white/80 p-6 sm:p-7 shadow-xs space-y-4 hover:bg-white/75 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-emerald-100/60 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-500/30 flex items-center justify-center font-black text-sm">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-emerald-950">Shipment #{shipment.id}</h4>
                          <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-950 border border-amber-500/30">
                            {shipment.status}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700/70 mt-0.5 font-medium">Linked Order #{shipment.order_id}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-emerald-700/80 block font-medium">Freight Payout</span>
                      <span className="text-lg font-black text-emerald-950 font-['Outfit',sans-serif]">
                        ₹{shipment.estimated_cost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Route & Cargo Specs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="glass p-4 rounded-2xl border border-white/80 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                        <div>
                          <span className="text-emerald-700 font-bold block text-[10px]">PICKUP (Farm Gate)</span>
                          <span className="font-extrabold text-emerald-950 leading-tight block">{shipment.pickup_location}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-2 border-t border-emerald-100/60">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-600 mt-1 shrink-0" />
                        <div>
                          <span className="text-emerald-700 font-bold block text-[10px]">DROP-OFF (Buyer Warehouse)</span>
                          <span className="font-extrabold text-emerald-950 leading-tight block">{shipment.delivery_location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-2xl border border-white/80 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-emerald-700/80 font-medium">Assigned Vehicle:</span>
                        <span className="font-bold text-emerald-950 font-mono">{shipment.vehicle_number || 'MH-15-EG-8821'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700/80 font-medium">Vehicle Type:</span>
                        <span className="font-bold text-emerald-950">{shipment.vehicle_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700/80 font-medium">Cargo Weight:</span>
                        <span className="font-bold text-emerald-950">{shipment.cargo_weight_kg.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700/80 font-medium">Current Checkpoint:</span>
                        <span className="font-black text-amber-700">{shipment.current_location || 'Departing Farm Gate'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Updates */}
                  <div className="pt-2 border-t border-emerald-100/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {updatingLocationId === shipment.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Pune Highway Toll Plaza, KM 142"
                            value={newLocation}
                            onChange={e => setNewLocation(e.target.value)}
                            className="bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-1.5 text-xs w-64 text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateLocation(shipment.id)}
                            className="bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setUpdatingLocationId(null)}
                            className="text-emerald-700 text-xs font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setUpdatingLocationId(shipment.id);
                            setNewLocation(shipment.current_location || '');
                          }}
                          className="text-xs font-bold text-emerald-900 glass hover:bg-white/80 px-3.5 py-1.5 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/80 shadow-xs"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Update GPS Checkpoint</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {shipment.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleUpdateStatus(shipment.id, 'PICKED_UP')}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all cursor-pointer shadow-xs"
                        >
                          Confirm Farm-Gate Cargo Loaded
                        </button>
                      )}

                      {shipment.status === 'PICKED_UP' && (
                        <button
                          onClick={() => handleUpdateStatus(shipment.id, 'IN_TRANSIT')}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all cursor-pointer shadow-xs"
                        >
                          Mark In Transit (On Route)
                        </button>
                      )}

                      {shipment.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleUpdateStatus(shipment.id, 'DELIVERED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Warehouse Delivery</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Loads from Nearby Farms */}
        <div className="space-y-4 pt-4 border-t border-emerald-100/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-emerald-950">Open Produce Loads Ready for Transport</h3>
              <p className="text-xs text-emerald-700/80 font-medium">Claim loads directly and earn instant guaranteed freight payouts</p>
            </div>
            <Link to="/transport/loads" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
              View All Loads →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableLoads.map(load => (
              <div
                key={load.id}
                className="glass p-6 rounded-3xl border border-white/80 shadow-xs space-y-4 hover:bg-white/75 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100/60">
                  <span className="text-xs font-extrabold text-emerald-950">Load Request #{load.id}</span>
                  <span className="text-base font-black text-emerald-950 font-['Outfit',sans-serif]">
                    ₹{load.estimated_cost.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-emerald-900 glass p-3.5 rounded-2xl border border-white/80">
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold w-16 shrink-0">From:</span>
                    <strong className="text-emerald-950">{load.pickup_location}</strong>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold w-16 shrink-0">To:</span>
                    <strong className="text-emerald-950">{load.delivery_location}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-100/60">
                    <span>Weight: <strong className="text-emerald-950">{load.cargo_weight_kg.toLocaleString()} kg</strong></span>
                    <span>Vehicle: <strong className="text-emerald-950">{load.vehicle_type}</strong></span>
                  </div>
                </div>

                {acceptingId === load.id ? (
                  <div className="space-y-3 glass p-4 rounded-2xl border border-white/90">
                    <h5 className="font-bold text-xs text-emerald-950">Assign Vehicle & Driver</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Vehicle Plate"
                        value={vehicleNo}
                        onChange={e => setVehicleNo(e.target.value)}
                        className="bg-white/80 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-950"
                      />
                      <input
                        type="text"
                        placeholder="Driver Phone"
                        value={driverPhone}
                        onChange={e => setDriverPhone(e.target.value)}
                        className="bg-white/80 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-medium"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setAcceptingId(null)}
                        className="glass px-3 py-1 text-xs text-emerald-800 hover:bg-white/80 rounded-xl border border-white/80"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAcceptLoad(load.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-xs"
                      >
                        Confirm & Claim
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAcceptingId(load.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Accept Trip & Lock Freight Rate</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
