import { TransportRequest, TransportStatus } from '../types';
import { transportApi } from './api';
import { INITIAL_TRANSPORTS } from '../data/seedData';

const STORAGE_KEY = 'farmlink_transports_cache';

function getLocalTransports(): TransportRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_TRANSPORTS;
}

function setLocalTransports(transports: TransportRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transports));
  } catch {}
}

export const transportService = {
  async getAll(params?: { provider_id?: string; status?: string }): Promise<TransportRequest[]> {
    try {
      const data = await transportApi.getAll(params);
      if (Array.isArray(data) && data.length > 0) {
        setLocalTransports(data);
        return data;
      }
    } catch (err) {
      console.warn('API error in transportService.getAll, using local cache', err);
    }

    let items = getLocalTransports();
    if (params?.provider_id) {
      items = items.filter(t => (t.provider_id || t.transport_provider_id) === params.provider_id);
    }
    if (params?.status && params.status !== 'ALL') {
      items = items.filter(t => t.status === params.status);
    }
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async acceptDelivery(
    id: string,
    data: { provider_id: string; provider_name: string; vehicle_number?: string; driver_phone?: string }
  ): Promise<TransportRequest> {
    try {
      const res = await transportApi.accept(id, data);
      if (res) {
        const local = getLocalTransports().map(t => (t.id === id ? { ...t, ...res } : t));
        setLocalTransports(local);
        return res;
      }
    } catch (err) {
      console.warn('API error in transportService.acceptDelivery', err);
    }

    const local = getLocalTransports().map(t =>
      t.id === id
        ? {
            ...t,
            provider_id: data.provider_id,
            transport_provider_id: data.provider_id,
            provider_name: data.provider_name,
            transport_provider_name: data.provider_name,
            vehicle_number: data.vehicle_number || 'MH-12-QX-4821',
            driver_phone: data.driver_phone || '+91 94222 34567',
            status: 'ASSIGNED' as TransportStatus
          }
        : t
    );
    setLocalTransports(local);
    return local.find(t => t.id === id)!;
  },

  async updateStatus(id: string, status: TransportStatus, location?: string): Promise<TransportRequest> {
    try {
      const res = await transportApi.updateStatus(id, status, location);
      if (res) {
        const local = getLocalTransports().map(t => (t.id === id ? { ...t, status, current_location: location || t.current_location } : t));
        setLocalTransports(local);
        return res;
      }
    } catch (err) {
      console.warn('API error in transportService.updateStatus', err);
    }

    const local = getLocalTransports().map(t =>
      t.id === id
        ? {
            ...t,
            status,
            current_location: location || t.current_location
          }
        : t
    );
    setLocalTransports(local);
    return local.find(t => t.id === id)!;
  }
};
