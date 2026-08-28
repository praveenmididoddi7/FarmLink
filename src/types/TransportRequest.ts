export type TransportStatus = 'PENDING' | 'AVAILABLE' | 'ASSIGNED' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface TransportRequest {
  id: string;
  order_id: string;
  crop_names?: string;
  total_weight_kg?: number;
  cargo_weight_kg?: number;
  pickup_location: string;
  pickup_farmer_name?: string;
  pickup_contact?: string;
  destination?: string;
  delivery_location?: string;
  buyer_name?: string;
  buyer_contact?: string;
  driver_phone?: string;
  distance_km?: number;
  delivery_cost?: number;
  estimated_cost?: number;
  transport_provider_id?: string;
  provider_id?: string;
  transport_provider_name?: string;
  provider_name?: string;
  vehicle_number?: string;
  vehicle_type?: string;
  status: TransportStatus;
  current_location?: string;
  pickup_time?: string;
  delivery_time?: string;
  created_at: string;
}
