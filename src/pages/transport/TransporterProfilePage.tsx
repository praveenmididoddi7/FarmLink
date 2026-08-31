import React, { useState } from 'react';
import {
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  FileText,
  Save,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TransporterProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [businessName, setBusinessName] = useState(user?.business_name || 'Kishan Express Logistics');
  const [name, setName] = useState(user?.name || 'Gurpreet Singh');
  const [email, setEmail] = useState(user?.email || 'transport@farmlink.io');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [location, setLocation] = useState(user?.location || 'Indore / Western Corridor, India');
  const [vehicleNo, setVehicleNo] = useState(user?.vehicle_number || 'MH 12 QX 4821');
  const [vehicleType, setVehicleType] = useState(user?.vehicle_type || '14ft Insulated Reefer (10-Ton)');
  const [corridors, setCorridors] = useState('Indore • Nashik • Mumbai • Hyderabad • Bengaluru');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="min-h-screen py-8 text-emerald-950">
      {/* Toast */}
      {isSaved && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="glass bg-emerald-900/90 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">Fleet Profile Updated</p>
              <p className="text-[11px] text-emerald-200">Changes synchronized with your driver credential badge.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5 text-emerald-600" /> Carrier Verified Credentials
          </div>
          <h1 className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Fleet & Transporter Profile
          </h1>
          <p className="text-sm text-emerald-800/80 font-medium mt-1">
            Manage your registered transport entity, active vehicle fleet, and banking settlement settings.
          </p>
        </div>

        {/* Profile Card & Badges */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-emerald-100/60 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/80">
                {name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-emerald-950 font-['Outfit',sans-serif]">{name}</h2>
                  <span className="bg-emerald-500/20 text-emerald-900 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    VERIFIED TRANSPORTER
                  </span>
                </div>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">{businessName}</p>
                <p className="text-xs text-emerald-800/80">{location}</p>
              </div>
            </div>

            <div className="glass p-3.5 rounded-2xl border border-white/80 text-right">
              <span className="text-[10px] text-emerald-700 font-bold block uppercase">Fleet Rating</span>
              <div className="flex items-center justify-end gap-1 text-amber-600 font-black text-base">
                <span>★ 4.9</span>
                <span className="text-[11px] text-emerald-800/70 font-normal">(48 completed trips)</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                Fleet Business Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">Carrier Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">Primary Operator Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">Mobile Contact / WhatsApp</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-emerald-100/60">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                Primary Assigned Vehicle
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={e => setVehicleNo(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">Vehicle Type & Specs</label>
                  <input
                    type="text"
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">Active Operating Corridors</label>
                  <input
                    type="text"
                    value={corridors}
                    onChange={e => setCorridors(e.target.value)}
                    className="w-full bg-white/80 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
