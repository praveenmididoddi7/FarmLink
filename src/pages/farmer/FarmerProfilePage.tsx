import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sprout, User, Phone, Mail, MapPin, CheckCircle2, ShieldCheck, CreditCard, Save } from 'lucide-react';

export const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || 'Ramesh Patel');
  const [phone, setPhone] = useState(user?.phone || '+91 98220 12345');
  const [location, setLocation] = useState(user?.location || 'Nashik, Maharashtra');
  const [landArea, setLandArea] = useState('14.5 Acres');
  const [cropsGrown, setCropsGrown] = useState('Tomato, Red Onion, Green Chilli, Jyoti Potato');
  const [upiId, setUpiId] = useState('ramesh.patel@okaxis');
  const [bankAccount, setBankAccount] = useState('State Bank of India •••• 4921');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sprout className="w-3.5 h-3.5" /> Farmer Account & Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
            Farm Profile & Banking Setup
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Maintain your verified landholding records, direct UPI settlement IDs, and farm-gate dispatch coordinates
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and banking preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity & Land Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-stone-900">{name}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified FPO Member
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{location} • PM-Kisan ID: MH-NSK-2021-9982</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Farmer / Entity Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Farm / Mandi Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Cultivated Landholding</label>
                <input
                  type="text"
                  value={landArea}
                  onChange={e => setLandArea(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Primary Crops Cultivated</label>
              <input
                type="text"
                value={cropsGrown}
                onChange={e => setCropsGrown(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Banking / UPI Settlements Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Direct Escrow Payout Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">UPI ID (Instant Settlement)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bank Account</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Farm Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
