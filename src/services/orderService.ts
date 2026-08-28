import { Order, OrderStatus, TransportRequest } from '../types';
import { orderApi } from './api';
import { INITIAL_ORDERS } from '../data/seedData';

const STORAGE_KEY = 'farmlink_orders_cache';

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ORDERS;
}

function setLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

export const orderService = {
  async getAll(params?: { buyer_id?: string; farmer_id?: string; status?: string }): Promise<Order[]> {
    try {
      const data = await orderApi.getAll(params);
      if (Array.isArray(data) && data.length > 0) {
        setLocalOrders(data);
        return data;
      }
    } catch (err) {
      console.warn('API error in orderService.getAll, using local cache', err);
    }

    let items = getLocalOrders();
    if (params?.buyer_id) {
      items = items.filter(o => o.buyer_id === params.buyer_id);
    }
    if (params?.farmer_id) {
      items = items.filter(o => o.items.some(it => it.farmer_id === params.farmer_id));
    }
    if (params?.status && params.status !== 'ALL') {
      items = items.filter(o => o.status === params.status);
    }
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const data = await orderApi.getById(id);
      if (data) return data;
    } catch (err) {
      console.warn('API error in orderService.getById', err);
    }
    const local = getLocalOrders();
    return local.find(o => o.id === id) || null;
  },

  async create(orderData: {
    buyer_id: string;
    buyer_name: string;
    buyer_phone: string;
    delivery_address: string;
    items: any[];
    payment_method: string;
    notes?: string;
  }): Promise<{ order: Order; transport?: TransportRequest }> {
    try {
      const result = await orderApi.create(orderData);
      if (result && result.order) {
        const local = getLocalOrders();
        setLocalOrders([result.order, ...local]);
        return result;
      }
    } catch (err) {
      console.warn('API error in orderService.create, creating local order', err);
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    let total = 0;
    const itemsFormatted = orderData.items.map(it => {
      const subtotal = (it.price_per_unit || it.unit_price || it.crop?.price || 25) * (it.quantity || 1);
      total += subtotal;
      return {
        crop_id: it.crop_id || it.crop?.id || 'crop_1',
        crop_name: it.crop_name || it.crop?.name || 'Fresh Crop',
        variety: it.variety || it.crop?.variety || '',
        farmer_name: it.farmer_name || it.crop?.farmer_name || 'Ramesh Patel',
        farmer_id: it.farmer_id || it.crop?.farmer_id || 'usr_farmer_1',
        farmer_phone: it.farmer_phone || it.crop?.farmer_phone || '+91 98220 12345',
        unit_price: it.price_per_unit || it.unit_price || it.crop?.price || 25,
        price_per_unit: it.price_per_unit || it.unit_price || it.crop?.price || 25,
        quantity: it.quantity || 1,
        unit: it.unit || it.crop?.unit || 'kg',
        image: it.image || it.crop?.image || '',
        subtotal
      };
    });

    const fallbackOrder: Order = {
      id: orderId,
      buyer_id: orderData.buyer_id,
      buyer_name: orderData.buyer_name,
      buyer_phone: orderData.buyer_phone,
      delivery_address: orderData.delivery_address,
      items: itemsFormatted,
      total_price: total,
      total_amount: total + 650,
      delivery_fee: 650,
      status: 'PENDING',
      payment_method: orderData.payment_method || 'UPI (Escrow)',
      payment_status: 'Escrow Secured',
      notes: orderData.notes,
      created_at: new Date().toISOString()
    };

    const local = getLocalOrders();
    setLocalOrders([fallbackOrder, ...local]);
    return { order: fallbackOrder };
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const res = await orderApi.updateStatus(id, status);
      if (res) {
        const local = getLocalOrders().map(o => (o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o));
        setLocalOrders(local);
        return res;
      }
    } catch (err) {
      console.warn('API error in orderService.updateStatus, applying locally', err);
    }

    const local = getLocalOrders().map(o => (o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o));
    setLocalOrders(local);
    return local.find(o => o.id === id)!;
  },

  async acceptOrder(id: string): Promise<Order> {
    return this.updateStatus(id, 'CONFIRMED');
  },

  async rejectOrder(id: string): Promise<Order> {
    return this.updateStatus(id, 'CANCELLED');
  }
};
