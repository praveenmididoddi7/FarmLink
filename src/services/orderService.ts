import { Order, OrderStatus, TransportRequest } from '../types';
import { orderApi } from './api';
import { transportService } from './transportService';
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
    window.dispatchEvent(new Event('farmlink_orders_updated'));
  } catch {}
}

export const orderService = {
  async getAll(params?: { buyer_id?: string; farmer_id?: string; status?: string }): Promise<Order[]> {
    try {
      const data = await orderApi.getAll(params);
      if (Array.isArray(data)) {
        const local = getLocalOrders();
        const map = new Map<string, Order>();
        local.forEach(o => map.set(o.id, o));
        data.forEach(o => map.set(o.id, o));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {}
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
      items = items.filter(o => o.items && o.items.some(it => it.farmer_id === params.farmer_id));
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
        setLocalOrders([result.order, ...local.filter(o => o.id !== result.order.id)]);
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
        farmer_id: it.farmer_id || it.crop?.farmer_id || 'user_farmer_1',
        farmer_phone: it.farmer_phone || it.crop?.farmer_phone || '+91 98452 11029',
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
    let updatedOrder: Order | null = null;
    try {
      const res = await orderApi.updateStatus(id, status);
      if (res) {
        updatedOrder = res;
      }
    } catch (err) {
      console.warn('API error in orderService.updateStatus, applying locally', err);
    }

    const local = getLocalOrders().map(o => {
      if (o.id === id) {
        const item = { ...o, status, updated_at: new Date().toISOString() };
        if (!updatedOrder) updatedOrder = item;
        return item;
      }
      return o;
    });
    setLocalOrders(local);

    const orderToUse = updatedOrder || local.find(o => o.id === id);
    if (orderToUse) {
      if (status === 'CONFIRMED') {
        transportService.createOrActivateLoadForOrder(orderToUse);
      }
      return orderToUse;
    }

    return local[0];
  },

  async acceptOrder(id: string): Promise<Order> {
    return this.updateStatus(id, 'CONFIRMED');
  },

  async rejectOrder(id: string): Promise<Order> {
    return this.updateStatus(id, 'CANCELLED');
  }
};
