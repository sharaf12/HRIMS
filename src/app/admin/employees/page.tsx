"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "./data-table";
import { generateColumns, EmployeeWithActions } from "./columns";
import { Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { EditEmployeeSheet } from "./edit-employee-sheet";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EmployeesPage() {
  const { employees: employeeData, setData: setEmployeeData, headers } = useEmployeeData();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [columns, setColumns] = useState<ColumnDef<EmployeeWithActions>[]>(() => generateColumns(headers));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  useEffect(() => {
    setColumns(generateColumns(headers));
  }, [headers]);

  const idKey = useMemo(() => headers.find(h => h.toLowerCase().includes('id')) || headers[0], [headers]);
  const nameKey = useMemo(() => headers.find(h => h.toLowerCase().includes('name')) || headers[1] || idKey, [headers, idKey]);

  if (headers.length === 0) {
    return (
        <div className="container mx-auto py-2 text-center">
            <h1 className="text-3xl font-bold mb-4">Employee Management</h1>
            <p>No employee data found. Please import a CSV file in the Data Operations page.</p>
        </div>
    )
  }

  const handleEditClick = useCallback((employee: Employee) => {
    const { onEdit, onDelete, ...data } = employee as EmployeeWithActions;
    setSelectedEmployee(data);
    setIsSheetOpen(true);
  }, []);

  const handleSheetOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsSheetOpen(false);
      setSelectedEmployee(null);
    } else {
      setIsSheetOpen(open);
    }
  }, []);

  const handleAddEmployee = useCallback((newEmployee: Employee) => {
    const updatedData = [newEmployee, ...employeeData];
    setEmployeeData(updatedData, headers);
     toast({
      title: "Employee Added",
      description: `${newEmployee[nameKey] || 'New Hire'} has been added.`,
    });
  }, [employeeData, headers, nameKey, setEmployeeData, toast]);

  const handleAddClick = useCallback(() => {
    const newId = `E${(Math.random() * 900 + 100).toFixed(0)}`;
    const newEmployee: Employee = {};
    
    headers.forEach(header => {
        newEmployee[header] = '';
    });
    newEmployee[idKey] = newId;
    newEmployee[nameKey] = 'New Hire';
    
    handleEditClick(newEmployee);
  }, [headers, idKey, nameKey, handleEditClick]);
  
  const handleUpdateEmployee = useCallback((updatedEmployee: Employee) => {
    const isNew = !employeeData.some(emp => emp[idKey] === updatedEmployee[idKey]);

    if (isNew) {
        handleAddEmployee(updatedEmployee);
    } else {
        const updatedData = employeeData.map(emp =>
            emp[idKey] === updatedEmployee[idKey] ? updatedEmployee : emp
        );
        setEmployeeData(updatedData, headers);
        toast({
            title: "Employee Updated",
            description: `${updatedEmployee[nameKey]}'s data has been updated.`,
        });
    }
  }, [employeeData, headers, idKey, nameKey, handleAddEmployee, setEmployeeData, toast]);

  const handleDeleteClick = useCallback((employeeId: string) => {
    const employee = employeeData.find(e => e[idKey] === employeeId);
    if (employee) {
        setEmployeeToDelete(employee);
        setIsDeleteDialogOpen(true);
    }
  }, [employeeData, idKey]);

  const confirmDeleteEmployee = useCallback(() => {
    if (!employeeToDelete) return;
    
    const employeeId = employeeToDelete[idKey];
    const employeeName = employeeToDelete[nameKey];
    
    const updatedData = employeeData.filter(emp => emp[idKey] !== employeeId);
    setEmployeeData(updatedData, headers);
    
    toast({
      variant: "destructive",
      title: "Employee Deleted",
      description: `${employeeName} has been removed from the system.`,
    });

    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  }, [employeeData, employeeToDelete, headers, idKey, nameKey, setEmployeeData, toast]);

  const employeesWithActions: EmployeeWithActions[] = useMemo(() => employeeData.map(emp => ({
    ...emp,
    onEdit: handleEditClick,
    onDelete: handleDeleteClick
  })), [employeeData, handleEditClick, handleDeleteClick]);

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-4">Employee Management</h1>
      <DataTable 
        columns={columns} 
        data={employeesWithActions}
        onAdd={handleAddClick}
        headers={headers}
      />
      <EditEmployeeSheet
        isOpen={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
        employee={selectedEmployee}
        onSave={handleUpdateEmployee}
      />
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              employee &apos;{employeeToDelete?.[nameKey]}&apos; and remove their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDeleteEmployee}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
