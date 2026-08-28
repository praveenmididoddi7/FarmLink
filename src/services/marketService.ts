import { MarketPriceRecord } from '../types';
import { marketApi } from './api';
import { INITIAL_MARKET_PRICES } from '../data/seedData';

export const marketService = {
  async getAll(params?: { state?: string; category?: string; search?: string }): Promise<MarketPriceRecord[]> {
    try {
      const data = await marketApi.getAll(params);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('API error in marketService.getAll, using seed data', err);
    }

    let list = [...INITIAL_MARKET_PRICES];
    if (params?.state && params.state !== 'All') {
      list = list.filter(m => m.state.toLowerCase() === params.state!.toLowerCase());
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter(m => m.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(m => m.crop.toLowerCase().includes(q) || m.mandi.toLowerCase().includes(q) || m.state.toLowerCase().includes(q));
    }
    return list;
  },

  getTopMovers(): MarketPriceRecord[] {
    return [...INITIAL_MARKET_PRICES].sort((a, b) => Math.abs(b.change_percent || 0) - Math.abs(a.change_percent || 0)).slice(0, 6);
  }
};
