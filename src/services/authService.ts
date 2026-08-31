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

export interface RegisteredUserRecord extends User {
  password?: string;
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

const REGISTERED_USERS_KEY = 'farmlink_registered_users';

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

  getRegisteredUsers(): RegisteredUserRecord[] {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveRegisteredUser(user: RegisteredUserRecord): void {
    try {
      const users = this.getRegisteredUsers();
      const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (existingIdx >= 0) {
        users[existingIdx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save registered user locally', err);
    }
  },

  async login(email?: string, password?: string): Promise<{ user: User; token: string }> {
    // 1. Strict validation of required fields
    if (!email || !email.trim()) {
      throw new Error('Email is required.');
    }
    if (!password || !password.trim()) {
      throw new Error('Password is required.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Attempt server-side API verification first
    try {
      const response = await authApi.login(cleanEmail, password);
      if (response && response.user && response.token) {
        localStorage.setItem('farmlink_user', JSON.stringify(response.user));
        localStorage.setItem('farmlink_token', response.token);
        return response;
      }
      throw new Error('Invalid email or password.');
    } catch (err: any) {
      // If server returned an explicit error response (e.g. 400, 401)
      if (err.response?.data?.error) {
        throw new Error(err.response.data.error);
      }
      if (err.response?.status === 401 || err.response?.status === 400) {
        throw new Error('Invalid email or password.');
      }

      // 3. Fallback verification for offline / client-only mode (STRICT verification with NO default fallback)
      // Check registered users in local storage
      const registered = this.getRegisteredUsers();
      const regMatch = registered.find(u => u.email.toLowerCase() === cleanEmail);
      if (regMatch) {
        if (regMatch.password === password) {
          const { password: _, ...userOnly } = regMatch;
          const token = `farmlink_jwt_${userOnly.id}_${Date.now()}`;
          localStorage.setItem('farmlink_user', JSON.stringify(userOnly));
          localStorage.setItem('farmlink_token', token);
          return { user: userOnly, token };
        } else {
          throw new Error('Invalid email or password.');
        }
      }

      // Check standard demo accounts
      const demoMatch = DEMO_ACCOUNTS.find(d => d.email.toLowerCase() === cleanEmail);
      if (demoMatch) {
        if (demoMatch.demoPassword === password) {
          const demoUser: User = {
            id: demoMatch.role === 'farmer' ? 'user_farmer_1' : demoMatch.role === 'buyer' ? 'user_buyer_1' : 'user_transport_1',
            name: demoMatch.name,
            email: demoMatch.email,
            role: demoMatch.role,
            phone: demoMatch.role === 'farmer' ? '+91 98452 11029' : demoMatch.role === 'buyer' ? '+91 98200 45678' : '+91 98765 43210',
            location: demoMatch.location,
            avatar: demoMatch.avatar
          };
          const token = `farmlink_jwt_${demoUser.id}_${Date.now()}`;
          localStorage.setItem('farmlink_user', JSON.stringify(demoUser));
          localStorage.setItem('farmlink_token', token);
          return { user: demoUser, token };
        } else {
          throw new Error('Invalid email or password.');
        }
      }

      // Check seeded INITIAL_USERS
      const initialMatch = INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);
      if (initialMatch) {
        if (password === 'password123') {
          const token = `farmlink_jwt_${initialMatch.id}_${Date.now()}`;
          localStorage.setItem('farmlink_user', JSON.stringify(initialMatch));
          localStorage.setItem('farmlink_token', token);
          return { user: initialMatch, token };
        } else {
          throw new Error('Invalid email or password.');
        }
      }

      // If credentials do NOT match any registered or seeded user, REJECT IMMEDIATELY.
      // NEVER FALL BACK TO A DEFAULT FARMER ACCOUNT!
      throw new Error('Invalid email or password.');
    }
  },

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    role: UserRole;
    password?: string;
  }): Promise<{ user: User; token: string }> {
    if (!userData.email || !userData.email.trim()) {
      throw new Error('Email is required.');
    }
    if (!userData.password || !userData.password.trim()) {
      throw new Error('Password is required.');
    }

    const cleanEmail = userData.email.trim().toLowerCase();

    try {
      const response = await authApi.register({
        ...userData,
        email: cleanEmail
      });
      if (response && response.user && response.token) {
        localStorage.setItem('farmlink_user', JSON.stringify(response.user));
        localStorage.setItem('farmlink_token', response.token);
        this.saveRegisteredUser({ ...response.user, password: userData.password });
        return response;
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        throw new Error(err.response.data.error);
      }
    }

    // Local client-side registration
    const newUser: User = {
      id: `usr_${userData.role}_${Date.now()}`,
      name: userData.name || 'New User',
      email: cleanEmail,
      phone: userData.phone || '+91 90000 00000',
      location: userData.location || 'India',
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
    this.saveRegisteredUser({ ...newUser, password: userData.password });

    return { user: newUser, token };
  },

  async loginAsDemo(role: UserRole): Promise<{ user: User; token: string }> {
    const demo = DEMO_ACCOUNTS.find(d => d.role === role);
    if (!demo) {
      throw new Error(`Demo account for role "${role}" not found.`);
    }
    return this.login(demo.email, demo.demoPassword || 'password123');
  },

  logout(): void {
    localStorage.removeItem('farmlink_user');
    localStorage.removeItem('farmlink_token');
  }
};
