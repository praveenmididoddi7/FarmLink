import React, { useState, useEffect } from 'react';
import { transportApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { TransportRequest } from '../../types';
import { Truck, MapPin, Package, ShieldCheck, CheckCircle2, Search, Filter } from 'lucide-react';

export const AvailableLoadsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [vehicleNo, setVehicleNo] = useState('MH-15-EG-8821');
  const [driverPhone, setDriverPhone] = useState('+91 94222 34567');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
        provider_name: user?.name || 'Kisan Cold Logistics',
        vehicle_number: vehicleNo,
        driver_phone: driverPhone
      });
      setAcceptingId(null);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingLoads = requests.filter(r => r.status === 'PENDING');
  const filtered = pendingLoads.filter(
    r =>
      r.pickup_location.toLowerCase().includes(search.toLowerCase()) ||
      r.delivery_location.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5 text-emerald-600" /> Farm-Gate Load Board
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Open Agricultural Freight Loads
          </h1>
          <p className="text-xs sm:text-sm text-emerald-700/80 font-medium">
            Discover verified farm-gate dispatch requests looking for refrigerated & ventilated transport
          </p>
        </div>

        {/* Search */}
        <div className="glass p-4 rounded-3xl border border-white/80 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-600 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by pickup mandi, delivery destination, or vehicle type..."
              className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Load Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full glass rounded-3xl p-12 text-center border border-white/80 text-emerald-800 text-xs font-medium">
              No pending farm loads matching search criteria.
            </div>
          ) : (
            filtered.map(load => (
              <div
                key={load.id}
                className="glass rounded-3xl border border-white/80 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:bg-white/75 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100/60">
                    <span className="text-xs font-extrabold text-emerald-950">Load #{load.id}</span>
                    <span className="text-base font-black text-emerald-950 font-['Outfit',sans-serif]">
                      ₹{load.estimated_cost.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-emerald-900 mt-3">
                    <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                        <div>
                          <span className="text-[10px] text-emerald-700 font-bold block">FROM (Farm Origin)</span>
                          <span className="font-extrabold text-emerald-950">{load.pickup_location}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-2 border-t border-emerald-100/60">
                        <div className="w-2 h-2 rounded-full bg-sky-600 mt-1 shrink-0" />
                        <div>
                          <span className="text-[10px] text-emerald-700 font-bold block">TO (Warehouse Hub)</span>
                          <span className="font-extrabold text-emerald-950">{load.delivery_location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-emerald-700/80 font-medium">Vehicle Required:</span>
                      <strong className="text-emerald-950 font-bold">{load.vehicle_type}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-700/80 font-medium">Cargo Payload:</span>
                      <strong className="text-emerald-950 font-bold">{load.cargo_weight_kg.toLocaleString()} kg</strong>
                    </div>
                  </div>
                </div>

                <div>
                  {acceptingId === load.id ? (
                    <div className="space-y-3 glass p-4 rounded-2xl border border-white/90">
                      <h5 className="font-bold text-xs text-emerald-950">Assign Vehicle & Driver</h5>
                      <input
                        type="text"
                        placeholder="Vehicle Plate Number"
                        value={vehicleNo}
                        onChange={e => setVehicleNo(e.target.value)}
                        className="w-full bg-white/80 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-950"
                      />
                      <input
                        type="text"
                        placeholder="Driver Phone Number"
                        value={driverPhone}
                        onChange={e => setDriverPhone(e.target.value)}
                        className="w-full bg-white/80 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-xs text-emerald-950 font-medium"
                      />
                      <div className="flex justify-end gap-2 pt-1">
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
                          Confirm & Assign
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAcceptingId(load.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Accept Farm Trip</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
