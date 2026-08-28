export * from './User';
export * from './Crop';
export * from './Order';
export * from './Prediction';
export * from './TransportRequest';

export type CropCategory = 'Vegetables' | 'Grains' | 'Fruits' | 'Pulses' | 'Commercial' | 'Spices' | 'Oilseeds';
export type CropQuality = 'Grade A+ (Export Quality)' | 'Grade A (Premium)' | 'Grade B (Standard)' | 'Organic Certified' | string;
export type QualityGrade = CropQuality;

export interface MarketPriceRecord {
  id: string;
  crop: string;
  category: CropCategory | string;
  mandi: string;
  state: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  previous_modal_price?: number;
  trend?: 'up' | 'down' | 'stable';
  change_percent?: number;
  arrival_tonnes?: number;
  date: string;
}

export interface CartItem {
  crop: import('./Crop').Crop;
  quantity: number;
}
