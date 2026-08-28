import { Crop } from '../types';
import { cropApi } from './api';
import { INITIAL_CROPS } from '../data/seedData';

// Local storage key for offline/fallback persistence
const STORAGE_KEY = 'farmlink_crops_cache';

function getLocalCrops(): Crop[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_CROPS;
}

function setLocalCrops(crops: Crop[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
  } catch {}
}

export const cropService = {
  async getAll(params?: {
    category?: string;
    state?: string;
    search?: string;
    farmer_id?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<Crop[]> {
    try {
      const data = await cropApi.getAll(params);
      if (Array.isArray(data) && data.length > 0) {
        setLocalCrops(data);
        return data;
      }
    } catch (err) {
      console.warn('API error in cropService.getAll, using local cache', err);
    }

    let items = getLocalCrops();
    if (params?.farmer_id) {
      items = items.filter(c => c.farmer_id === params.farmer_id);
    }
    if (params?.category && params.category !== 'All') {
      items = items.filter(c => c.category === params.category);
    }
    if (params?.state && params.state !== 'All') {
      const st = params.state.toLowerCase();
      items = items.filter(c => c.state?.toLowerCase().includes(st) || c.location?.toLowerCase().includes(st));
    }
    if (params?.min_price) {
      items = items.filter(c => c.price >= params.min_price!);
    }
    if (params?.max_price) {
      items = items.filter(c => c.price <= params.max_price!);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.variety.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.farmer_name.toLowerCase().includes(q)
      );
    }
    return items;
  },

  async getById(id: string): Promise<Crop | null> {
    try {
      const data = await cropApi.getById(id);
      if (data) return data;
    } catch (err) {
      console.warn('API error in cropService.getById, using local cache', err);
    }
    const local = getLocalCrops();
    return local.find(c => c.id === id) || null;
  },

  async create(cropData: Partial<Crop>): Promise<Crop> {
    try {
      const created = await cropApi.create(cropData);
      if (created) {
        const local = getLocalCrops();
        setLocalCrops([created, ...local]);
        return created;
      }
    } catch (err) {
      console.warn('API error in cropService.create, using local fallback', err);
    }

    const fallbackCrop: Crop = {
      id: `crop_${Date.now()}`,
      farmer_id: cropData.farmer_id || 'usr_farmer_1',
      farmer_name: cropData.farmer_name || 'Ramesh Patel',
      farmer_phone: cropData.farmer_phone || '+91 98220 12345',
      farm_name: cropData.farm_name || 'Patel Organic Farms',
      name: cropData.name || 'Fresh Produce',
      category: cropData.category || 'Vegetables',
      variety: cropData.variety || 'Standard Variety',
      quantity: Number(cropData.quantity) || 100,
      unit: cropData.unit || 'kg',
      price: Number(cropData.price) || 30,
      harvest_date: cropData.harvest_date || new Date().toISOString().split('T')[0],
      quality: cropData.quality || 'Grade A (Standard)',
      location: cropData.location || 'Nashik, Maharashtra',
      state: cropData.state || 'Maharashtra',
      image: cropData.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      description: cropData.description || 'Fresh harvest ready for wholesale distribution.',
      moisture_content: cropData.moisture_content || '12%',
      created_at: new Date().toISOString(),
      is_available: true
    };

    const local = getLocalCrops();
    setLocalCrops([fallbackCrop, ...local]);
    return fallbackCrop;
  },

  async update(id: string, cropData: Partial<Crop>): Promise<Crop> {
    try {
      const updated = await cropApi.update(id, cropData);
      if (updated) {
        const local = getLocalCrops().map(c => (c.id === id ? { ...c, ...updated } : c));
        setLocalCrops(local);
        return updated;
      }
    } catch (err) {
      console.warn('API error in cropService.update, using local fallback', err);
    }

    const local = getLocalCrops().map(c => (c.id === id ? { ...c, ...cropData } : c));
    setLocalCrops(local);
    return local.find(c => c.id === id)!;
  },

  async delete(id: string): Promise<void> {
    try {
      await cropApi.delete(id);
    } catch (err) {
      console.warn('API error in cropService.delete', err);
    }
    const local = getLocalCrops().filter(c => c.id !== id);
    setLocalCrops(local);
  }
};
