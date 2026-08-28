import { CropCategory, QualityGrade } from './index';

export interface Crop {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  farm_name: string;
  name: string;
  category: CropCategory | string;
  variety: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | 'crates' | string;
  price: number;
  harvest_date: string;
  quality: QualityGrade;
  location: string;
  state: string;
  image: string;
  description: string;
  shelf_life_days?: number;
  organic?: boolean;
  moisture_content?: number | string;
  created_at: string;
  is_available?: boolean;
}
