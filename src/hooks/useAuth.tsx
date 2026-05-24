'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { User } from '@/types';
import { DEMO_USERS } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_CREDENTIALS: Record<string, { password: string; user: User }> = {
  'admin@ncba.demo': { password: 'admin123', user: DEMO_USERS[0] },
  'manager@ncba.demo': { password: 'manager123', user: DEMO_USERS[1] },
  'officer@ncba.demo': { password: 'officer123', user: DEMO_USERS[2] },
  'auditor@ncba.demo': { password: 'auditor123', user: DEMO_USERS[3] },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const creds = VALID_CREDENTIALS[email.toLowerCase().trim()];
    if (creds && creds.password === password) {
      setUser(creds.user);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, isLoading }),
    [user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
