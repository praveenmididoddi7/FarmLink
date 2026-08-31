import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, DEMO_ACCOUNTS, DemoAccount } from '../services/authService';
import { INITIAL_USERS } from '../data/seedData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<User>;
  loginAsDemo: (role: UserRole) => Promise<User>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    role: UserRole;
    password?: string;
  }) => Promise<User>;
  logout: () => void;
  demoAccounts: DemoAccount[];
  availableUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return authService.getStoredUser();
  });

  const [token, setToken] = useState<string | null>(() => {
    return authService.getStoredToken();
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [availableUsers] = useState<User[]>(INITIAL_USERS);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getStoredToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const login = async (email?: string, password?: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (targetRole: UserRole): Promise<User> => {
    setLoading(true);
    try {
      const res = await authService.loginAsDemo(targetRole);
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    role: UserRole;
    password?: string;
  }): Promise<User> => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        loginAsDemo,
        register,
        logout,
        demoAccounts: DEMO_ACCOUNTS,
        availableUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
