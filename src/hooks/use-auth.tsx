"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Employee } from '@/lib/types';
import { useEmployeeData } from './use-employee-data';

type Role = 'admin' | 'user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: Role, employeeData?: Employee } | null;
  login: (username: string, pass: string, employees: Employee[], headers: string[]) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string; role: Role, employeeData?: Employee } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { employees, headers: employeeHeaders } = useEmployeeData();

  useEffect(() => {
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
    
    // Sync user data if they are an employee and the main data source changes
    if (user && user.role === 'user' && user.employeeData && employees.length > 0) {
        const idKey = employeeHeaders.find(h => h.toLowerCase().includes('id')) || employeeHeaders[0];
        const currentId = user.employeeData[idKey];
        const latestData = employees.find(e => String(e[idKey]) === String(currentId));

        // Prevents infinite loops by checking if data is actually different
        if (latestData && JSON.stringify(latestData) !== JSON.stringify(user.employeeData)) {
            const updatedUser = { ...user, employeeData: latestData };
            setUser(updatedUser);
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
    }

    const isAuthPage = pathname === '/login';

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push(user.role === 'admin' ? '/admin' : '/user');
    }
  }, [user, pathname, router, loading, employees, employeeHeaders]);

  const login = useCallback(async (username: string, pass: string, employees: Employee[], headers: string[]): Promise<boolean> => {
    if (username === 'admin' && pass === 'admin123') {
      const adminUserData = { username: 'admin', role: 'admin' as Role };
      setUser(adminUserData);
      sessionStorage.setItem('user', JSON.stringify(adminUserData));
      router.push('/admin');
      return true;
    }
    
    const idKey = headers.find(h => h.toLowerCase().includes('employee id')) || (headers.length > 0 ? headers[0] : '');
    if (!idKey) return false;

    const employeeData = employees.find(e => String(e[idKey]) === username);
    if (employeeData && pass === 'password123') {
      const userData = { username: String(employeeData[idKey]), role: 'user' as Role, employeeData };
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      router.push('/user');
      return true;
    }

    return false;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  }, [router]);
  
  const value = useMemo(() => ({ 
    isAuthenticated: !!user, 
    user, 
    login, 
    logout, 
    loading 
  }), [user, login, logout, loading]);

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
