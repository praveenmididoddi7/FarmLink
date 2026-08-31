export type UserRole = 'farmer' | 'buyer' | 'transport' | 'transporter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  avatar?: string;
  farm_name?: string;
  farm_size?: string;
  business_name?: string;
  vehicle_type?: string;
  vehicle_number?: string;
  capacity?: string;
}
