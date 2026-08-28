import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Sprout,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShoppingCart,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { cropApi } from '../../services/api';
import { Crop, CropCategory, QualityGrade } from '../../types';
import { useCart } from '../../context/CartContext';

export const MarketplacePage: React.FC = () => {
  const { addToCart } = useCart();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    setLoading(true);
    try {
      const data = await cropApi.getAll();
      setCrops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices'];

  const filteredCrops = crops.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.variety.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.farmer_name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesGrade = selectedGrade === 'All' || c.quality.includes(selectedGrade);
    const matchesState = selectedState === 'All' || c.location.includes(selectedState);

    return matchesSearch && matchesCategory && matchesGrade && matchesState;
  });

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'qty_desc') return b.quantity - a.quantity;
    return 0;
  });

  const handleQuickAdd = (crop: Crop, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const qtyToAdd = crop.unit === 'ton' ? 2 : crop.unit === 'quintal' ? 10 : 50;
    addToCart(crop, qtyToAdd);
    setAddedToast(`Added ${qtyToAdd} ${crop.unit} of ${crop.name} to cart!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md shadow-emerald-900/5">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <Sprout className="w-3.5 h-3.5" /> Direct Agro Sourcing
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Wholesale Farm-Gate Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-emerald-700/80 mt-0.5">
              Procure farm-fresh crops directly from verified growers with full quality grade testing & guaranteed logistics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 glass px-4 py-2 rounded-2xl border border-white/80">
              Showing <strong className="text-emerald-950">{sortedCrops.length}</strong> active crop lots
            </span>
          </div>
        </header>

        {/* Floating Added To Cart Toast */}
        {addedToast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-900/90 backdrop-blur-xl text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{addedToast}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="glass p-5 rounded-3xl border border-white/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by crop, variety, mandi, or farmer name..."
                className="w-full bg-white/70 backdrop-blur-md border border-emerald-200/80 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-emerald-950 placeholder:text-emerald-700/50 focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Sorter */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white/70 backdrop-blur-md border border-emerald-200/80 rounded-2xl px-3.5 py-2 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
              >
                <option value="featured">Featured / Harvest Date</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="qty_desc">Volume Available: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-emerald-100/60">
            <span className="text-xs font-extrabold text-emerald-900 mr-1">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-white/60 text-emerald-900 hover:bg-white/90 border border-white/80'
                }`}
              >
                {cat}
              </button>
            ))}

            <span className="text-xs font-extrabold text-emerald-900 ml-4 mr-1">Grade:</span>
            {['All', 'Grade A+', 'Grade A', 'Organic'].map(g => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white/60 text-emerald-900 hover:bg-white/90 border border-white/80'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCrops.length === 0 ? (
            <div className="col-span-full glass rounded-3xl p-12 text-center border border-white/80 text-emerald-800 font-medium">
              No crops found matching your filter criteria. Try clearing search keywords.
            </div>
          ) : (
            sortedCrops.map(crop => (
              <Link
                key={crop.id}
                to={`/product/${crop.id}`}
                className="glass rounded-3xl border border-white/80 hover:border-emerald-400 overflow-hidden shadow-xs hover:shadow-md hover:bg-white/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-48 w-full bg-emerald-100/50 overflow-hidden">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-md text-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {crop.quality.split(' ')[0]} {crop.quality.split(' ')[1] || ''}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md text-emerald-950 text-xs font-black px-3 py-1 rounded-full shadow-xs border border-white/80">
                      ₹{crop.price} / {crop.unit}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-extrabold text-emerald-950 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-emerald-700/80 mt-0.5 font-medium">{crop.variety}</p>
                    </div>

                    <div className="space-y-1 text-xs text-emerald-900/80 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate">{crop.farmer_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="truncate">{crop.location}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50/60 p-2.5 rounded-2xl text-[11px] text-emerald-900 font-medium flex items-center justify-between border border-emerald-100/50">
                      <span>Harvest: {crop.harvest_date}</span>
                      <span>Moisture: {crop.moisture_content}%</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-0 border-t border-emerald-100/60 mt-2 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-emerald-700/70 font-semibold block">Available Lot</span>
                    <span className="text-xs font-black text-emerald-950">
                      {crop.quantity.toLocaleString()} {crop.unit}
                    </span>
                  </div>

                  <button
                    onClick={e => handleQuickAdd(crop, e)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-2xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>+ Add</span>
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
