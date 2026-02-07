"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Employee } from '@/lib/types';
import { useEmployeeData } from './use-employee-data';

type Role = 'admin' | 'user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: Role, employeeData?: Employee } | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string; role: Role, employeeData?: Employee } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { employees } = useEmployeeData();

  useEffect(() => {
    // This is a simple check to prevent flicker on protected routes.
    // In a real app, you'd verify a token here.
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from session storage", e)
      sessionStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login';

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push(user.role === 'admin' ? '/admin' : '/user');
    }
  }, [user, pathname, router, loading]);

  const login = async (username: string, pass: string) => {
    if (username === 'admin' && pass === 'admin123') {
      const adminUserData = { username: 'admin', role: 'admin' as Role };
      setUser(adminUserData);
      sessionStorage.setItem('user', JSON.stringify(adminUserData));
      router.push('/admin');
      return true;
    }
    
    // Employee login
    const employeeData = employees.find(e => e['Employee ID'] === username);
    if (employeeData && pass === 'password123') {
      const userData = { username: employeeData['Employee ID'], role: 'user' as Role, employeeData };
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      router.push('/user');
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  };
  
  const value = { isAuthenticated: !!user, user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
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
