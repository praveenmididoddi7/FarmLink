import { User, UserRole } from '../types';
import { authApi } from './api';
import { INITIAL_USERS } from '../data/seedData';

export interface DemoAccount {
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  roleDesc: string;
  location: string;
  avatar: string;
  demoPassword?: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Ramesh Patel',
    email: 'farmer@farmlink.io',
    role: 'farmer',
    roleLabel: 'Farmer Account',
    roleDesc: 'Nashik Organic Farms (12 Acres • Maharashtra)',
    location: 'Nashik, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&auto=format&fit=crop&q=80',
    demoPassword: 'password123'
  },
  {
    name: 'Priya Sharma',
    email: 'buyer@farmlink.io',
    role: 'buyer',
    roleLabel: 'Wholesale Buyer',
    roleDesc: 'FreshDirect Retail & Supermarket Procurement (Bengaluru)',
    location: 'Bengaluru, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    demoPassword: 'password123'
  },
  {
    name: 'Gurpreet Singh',
    email: 'transport@farmlink.io',
    role: 'transport',
    roleLabel: 'Fleet Transporter',
    roleDesc: 'Kisan Cold Logistics (Reefer 10-Ton Truck Fleet)',
    location: 'Indore / Western Corridor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    demoPassword: 'password123'
  }
];

export const authService = {
  getStoredUser(): User | null {
    try {
      const saved = localStorage.getItem('farmlink_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('farmlink_token');
  },

  getDemoAccounts(): DemoAccount[] {
    return DEMO_ACCOUNTS;
  },

  async login(email: string, password?: string, role?: UserRole): Promise<{ user: User; token: string }> {
    try {
      const response = await authApi.login(email, role);
      if (response && response.user && response.token) {
        localStorage.setItem('farmlink_user', JSON.stringify(response.user));
        localStorage.setItem('farmlink_token', response.token);
        return response;
      }
    } catch (err) {
      console.warn('API login failed, falling back to local demo catalog', err);
    }

    // Fallback: match against seeded users or demo accounts
    const match =
      INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) ||
      DEMO_ACCOUNTS.find(d => d.email.toLowerCase() === email.toLowerCase()) ||
      (role ? INITIAL_USERS.find(u => u.role === role) : null) ||
      INITIAL_USERS[0];

    const fallbackUser: User = {
      id: (match as any).id || `usr_${match.role}_1`,
      name: match.name,
      email: match.email,
      role: match.role,
      phone: (match as any).phone || '+91 98765 43210',
      location: (match as any).location || 'India',
      avatar: match.avatar
    };

    const fallbackToken = `farmlink_jwt_${fallbackUser.id}_${Date.now()}`;
    localStorage.setItem('farmlink_user', JSON.stringify(fallbackUser));
    localStorage.setItem('farmlink_token', fallbackToken);

    return { user: fallbackUser, token: fallbackToken };
  },

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    role: UserRole;
    password?: string;
  }): Promise<{ user: User; token: string }> {
    try {
      const response = await authApi.register(userData);
      if (response && response.user && response.token) {
        localStorage.setItem('farmlink_user', JSON.stringify(response.user));
        localStorage.setItem('farmlink_token', response.token);
        return response;
      }
    } catch (err) {
      console.warn('API register failed, local fallback created', err);
    }

    const newUser: User = {
      id: `usr_${userData.role}_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      role: userData.role,
      avatar:
        userData.role === 'farmer'
          ? 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200&auto=format&fit=crop&q=80'
          : userData.role === 'buyer'
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    };

    const token = `farmlink_jwt_${newUser.id}_${Date.now()}`;
    localStorage.setItem('farmlink_user', JSON.stringify(newUser));
    localStorage.setItem('farmlink_token', token);

    return { user: newUser, token };
  },

  async loginAsDemo(role: UserRole): Promise<{ user: User; token: string }> {
    const demo = DEMO_ACCOUNTS.find(d => d.role === role) || DEMO_ACCOUNTS[0];
    return this.login(demo.email, demo.demoPassword, role);
  },

  logout(): void {
    localStorage.removeItem('farmlink_user');
    localStorage.removeItem('farmlink_token');
  }
};
