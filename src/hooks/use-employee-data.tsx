"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Employee } from '@/lib/types';
import { employees as initialEmployees } from '@/lib/data';

interface EmployeeDataContextType {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  resetEmployees: () => void;
}

const EmployeeDataContext = createContext<EmployeeDataContextType | undefined>(undefined);

export function EmployeeDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const resetEmployees = useCallback(() => {
    setEmployees(initialEmployees);
  }, []);
  
  const value = useMemo(() => ({ employees, setEmployees, resetEmployees }), [employees, resetEmployees]);

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
