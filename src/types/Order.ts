export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  crop_id: string;
  crop_name: string;
  variety?: string;
  farmer_name?: string;
  farmer_id?: string;
  farmer_phone?: string;
  unit_price?: number;
  price_per_unit?: number;
  quantity: number;
  unit: string;
  image?: string;
  subtotal?: number;
  total?: number;
  pickup_location?: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  total_price?: number;
  total_amount?: number;
  delivery_fee?: number;
  status: OrderStatus;
  payment_method: string;
  payment_status?: string;
  transport_request_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  estimated_delivery?: string;
}
