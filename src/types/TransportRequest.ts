export type TransportStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'PENDING'
  | 'PENDING_FARMER'
  | 'ACCEPTED';

export interface TransportTimelineItem {
  status: TransportStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface TransportRequest {
  id: string;
  order_id: string;
  orderId?: string;
  crop?: string;
  crop_names?: string;
  crop_name?: string;
  quantity?: number;
  total_weight_kg?: number;
  cargo_weight_kg?: number;
  unit?: string;
  farmer?: string;
  pickup_farmer_name?: string;
  farmer_phone?: string;
  pickup_contact?: string;
  pickupLocation?: string;
  pickup_location: string;
  destination?: string;
  delivery_location?: string;
  buyer_name?: string;
  buyer_contact?: string;
  distance?: number;
  distance_km?: number;
  pickupDate?: string;
  pickup_date?: string;
  pickup_time?: string;
  delivery_time?: string;
  estimatedArrival?: string;
  estimatedEarnings?: number;
  estimated_cost?: number;
  delivery_cost?: number;
  special_instructions?: string;
  handling_instructions?: string;
  transporterId?: string;
  transport_provider_id?: string;
  provider_id?: string;
  transporterName?: string;
  transport_provider_name?: string;
  provider_name?: string;
  vehicle_number?: string;
  vehicle_type?: string;
  driver_name?: string;
  driver_phone?: string;
  status: TransportStatus;
  current_location?: string;
  createdAt?: string;
  created_at: string;
  timeline?: TransportTimelineItem[];
}
