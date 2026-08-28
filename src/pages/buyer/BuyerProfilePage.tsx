import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, User, Phone, Mail, MapPin, CheckCircle2, ShieldCheck, Building2, Save } from 'lucide-react';

export const BuyerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || 'FreshDirect Wholesale');
  const [phone, setPhone] = useState(user?.phone || '+91 98450 67890');
  const [location, setLocation] = useState(user?.location || 'Bengaluru, Karnataka');
  const [gstin, setGstin] = useState('29AABCU9603R1ZM');
  const [businessType, setBusinessType] = useState('Retail Supermarket Chain & Institutional Processor');
  const [warehouseAddress, setWarehouseAddress] = useState(
    'Central Distribution Center, Plot 8B, Yeshwanthpur APMC Wholesale Yard, Outer Ring Rd, Bengaluru - 560022'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" /> Buyer Account
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
            Organization & Warehouse Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Manage your procurement entity details, GSTIN compliance, and central cold warehouse receiving dock
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Buyer organization profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-stone-900">{name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Verified Bulk Buyer
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{location} • GSTIN: {gstin}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Company / Buyer Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Procurement Desk Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Business Classification</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Central Receiving Dock / Warehouse Address
              </label>
              <textarea
                rows={2}
                value={warehouseAddress}
                onChange={e => setWarehouseAddress(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Organization Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
