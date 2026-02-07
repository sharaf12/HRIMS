"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Employee } from '@/lib/types';
import { employees as initialEmployees } from '@/lib/data';

const getHeadersFromData = (data: Employee[]) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
}

interface EmployeeDataContextType {
  employees: Employee[];
  headers: string[];
  setData: (data: Employee[], headers?: string[]) => void;
  resetEmployees: () => void;
}

const EmployeeDataContext = createContext<EmployeeDataContextType | undefined>(undefined);

export function EmployeeDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployeesState] = useState<Employee[]>(initialEmployees);
  const [headers, setHeaders] = useState<string[]>(getHeadersFromData(initialEmployees));

  const setData = useCallback((data: Employee[], customHeaders?: string[]) => {
      setEmployeesState(data);
      setHeaders(customHeaders || getHeadersFromData(data));
  }, []);

  const resetEmployees = useCallback(() => {
    setEmployeesState(initialEmployees);
    setHeaders(getHeadersFromData(initialEmployees));
  }, []);
  
  const value = useMemo(() => ({ employees, headers, setData, resetEmployees }), [employees, headers, setData, resetEmployees]);

  return (
    <EmployeeDataContext.Provider value={value}>
      {children}
    </EmployeeDataContext.Provider>
  );
}

export function useEmployeeData() {
  const context = useContext(EmployeeDataContext);
  if (context === undefined) {
    throw new Error('useEmployeeData must be used within an EmployeeDataProvider');
  }
  return context;
}
