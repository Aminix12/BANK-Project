'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('admin');
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('admin', JSON.stringify(data.admin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
