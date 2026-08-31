import axios from 'axios';
import {
  Crop,
  Order,
  TransportRequest,
  MarketPriceRecord,
  PricePredictionRequest,
  PricePredictionResponse,
  DemandForecastData,
  AIRecommendation,
  User
} from '../types';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmlink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password?: string) => {
    const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData: Partial<User> & { password?: string }) => {
    const res = await api.post<{ token: string; user: User }>('/auth/register', userData);
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get<User[]>('/auth/users');
    return res.data;
  }
};

export const cropApi = {
  getAll: async (params?: { category?: string; state?: string; search?: string; farmer_id?: string; min_price?: number; max_price?: number }) => {
    const res = await api.get<Crop[]>('/crops', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<Crop>(`/crops/${id}`);
    return res.data;
  },
  create: async (cropData: Partial<Crop>) => {
    const res = await api.post<Crop>('/crops', cropData);
    return res.data;
  },
  update: async (id: string, cropData: Partial<Crop>) => {
    const res = await api.put<Crop>(`/crops/${id}`, cropData);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/crops/${id}`);
    return res.data;
  }
};

export const orderApi = {
  getAll: async (params?: { buyer_id?: string; farmer_id?: string; status?: string }) => {
    const res = await api.get<Order[]>('/orders', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },
  create: async (orderData: {
    buyer_id: string;
    buyer_name: string;
    buyer_phone: string;
    delivery_address: string;
    items: any[];
    payment_method: string;
    notes?: string;
  }) => {
    const res = await api.post<{ order: Order; transport: TransportRequest }>('/orders', orderData);
    return res.data;
  },
  updateStatus: async (id: string, status: string) => {
    const res = await api.patch<Order>(`/orders/${id}/status`, { status });
    return res.data;
  }
};

export const transportApi = {
  getAll: async (params?: { provider_id?: string; status?: string }) => {
    const res = await api.get<TransportRequest[]>('/transport', { params });
    return res.data;
  },
  accept: async (id: string, data: { provider_id: string; provider_name: string; vehicle_number?: string; driver_phone?: string }) => {
    const res = await api.post<TransportRequest>(`/transport/${id}/accept`, data);
    return res.data;
  },
  updateStatus: async (id: string, status: string, current_location?: string) => {
    const res = await api.patch<TransportRequest>(`/transport/${id}/status`, { status, current_location });
    return res.data;
  }
};

export const marketApi = {
  getAll: async (params?: { state?: string; category?: string; search?: string }) => {
    const res = await api.get<MarketPriceRecord[]>('/market-prices', { params });
    return res.data;
  }
};

export const predictionApi = {
  predictPrice: async (reqData: PricePredictionRequest) => {
    const res = await api.post<PricePredictionResponse>('/predictions/price', reqData);
    return res.data;
  },
  getDemandForecast: async (crop?: string) => {
    const res = await api.get<DemandForecastData>('/predictions/demand', { params: { crop } });
    return res.data;
  },
  getRecommendations: async () => {
    const res = await api.get<AIRecommendation[]>('/predictions/recommendations');
    return res.data;
  }
};

export const aiAdvisorApi = {
  ask: async (message: string, role?: string, cropContext?: any) => {
    const res = await api.post<{ reply: string; source: string }>('/ai/agri-advisor', { message, role, cropContext });
    return res.data;
  }
};

export const analyticsApi = {
  getFarmerAnalytics: async (farmerId: string) => {
    const res = await api.get<any>(`/analytics/farmer/${farmerId}`);
    return res.data;
  }
};

// Centralized Services Export
export { authService } from './authService';
export { cropService } from './cropService';
export { orderService } from './orderService';
export { predictionService } from './predictionService';
export { marketService } from './marketService';
export { transportService } from './transportService';
