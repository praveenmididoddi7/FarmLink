import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { cropApi } from '../../services/api';
import { Crop } from '../../types';

export const MyListingsPage: React.FC = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  useEffect(() => {
    loadCrops();
    const handleUpdate = () => loadCrops();
    window.addEventListener('farmlink_crops_updated', handleUpdate);
    return () => window.removeEventListener('farmlink_crops_updated', handleUpdate);
  }, [user]);

  const loadCrops = async () => {
    setLoading(true);
    try {
      const farmerId = user?.id || 'user_farmer_1';
      const data = await cropService.getAll({ farmer_id: farmerId });
      setCrops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this crop listing?')) return;
    try {
      await cropService.delete(id);
      setCrops(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCrop) return;
    try {
      const updated = await cropService.update(editingCrop.id, {
        price: editPrice,
        quantity: editQuantity
      });
      setCrops(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      setEditingCrop(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Produce Inventory
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              My Active Crop Listings
            </h1>
            <p className="text-xs sm:text-sm text-emerald-700/80 font-medium">
              Manage listed inventory, update pricing corridors, and monitor buyer interest
            </p>
          </div>

          <Link
            to="/farmer/add-crop"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Crop</span>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map(crop => (
            <div
              key={crop.id}
              className="glass rounded-3xl border border-white/80 overflow-hidden shadow-xs flex flex-col justify-between hover:bg-white/75 transition-all group"
            >
              <div>
                <div className="relative h-48 w-full bg-emerald-900/10 overflow-hidden">
                  <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl border border-emerald-500/30">
                    {crop.quality}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-emerald-950 text-xs font-black px-3 py-1 rounded-xl shadow-xs border border-white/80">
                    ₹{crop.price} / {crop.unit}
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-950">{crop.name}</h3>
                    <p className="text-xs text-emerald-700/80 font-medium">{crop.variety} • {crop.category}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-emerald-900 glass p-3.5 rounded-2xl border border-white/80">
                    <div className="flex justify-between">
                      <span className="text-emerald-700/80 font-medium">Available Stock:</span>
                      <span className="font-black text-emerald-950">{crop.quantity.toLocaleString()} {crop.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700/80 font-medium">Harvest Date:</span>
                      <span className="font-bold text-emerald-900">{crop.harvest_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700/80 font-medium">Moisture Content:</span>
                      <span className="font-bold text-emerald-900">{crop.moisture_content}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-800/80 line-clamp-2 leading-relaxed font-normal">{crop.description}</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 border-t border-emerald-100/60 mt-2 flex items-center justify-between">
                <Link
                  to={`/product/${crop.id}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buyer View
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCrop(crop);
                      setEditPrice(crop.price);
                      setEditQuantity(crop.quantity);
                    }}
                    className="p-2 text-emerald-700 hover:text-emerald-950 glass rounded-xl transition-colors cursor-pointer border border-white/80"
                    title="Quick Edit Price/Stock"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="p-2 text-rose-600 hover:text-rose-800 glass hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-white/80"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Edit Modal */}
        {editingCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
            <div className="glass rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-white/90 space-y-4">
              <h3 className="font-black text-base text-emerald-950">
                Update {editingCrop.name}
              </h3>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  Selling Price (₹ / {editingCrop.unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={editPrice}
                  onChange={e => setEditPrice(Number(e.target.value))}
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  Remaining Quantity ({editingCrop.unit})
                </label>
                <input
                  type="number"
                  value={editQuantity}
                  onChange={e => setEditQuantity(Number(e.target.value))}
                  className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingCrop(null)}
                  className="glass px-3.5 py-2 rounded-xl border border-white/80 text-xs font-bold text-emerald-900 hover:bg-white/80 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
