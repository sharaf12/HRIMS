"use client";

import { DataTable } from "./data-table";
import { columns, EmployeeWithActions } from "./columns";
import { Employee } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/use-employee-data";

export default function EmployeesPage() {
  const { employees: employeeData, setEmployees: setEmployeeData } = useEmployeeData();
  const { toast } = useToast();

  const handleAddEmployee = (newEmployee: Employee) => {
    const updatedData = [newEmployee, ...employeeData];
    setEmployeeData(updatedData);
     toast({
      title: "Employee Added",
      description: `${newEmployee["Employee Name"]} has been added.`,
    });
  };

  const handleAddClick = () => {
    const newId = `E${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`;
    const newEmployee: Employee = {
      'Employee ID': newId,
      'Employee Name': 'New Hire',
      'Department': 'Engineering',
      'Job Title': 'Software Engineer',
      'Supervisor': 'Bob Williams',
      'Average KPI (%)': 80,
      'Productivity Rate (%)': 85,
      'Final Performance Level': 'Good',
      'Bonus Eligibility': 'No',
      'Reward Type': 'None',
      'Retention Action': 'Mentorship',
    };
    handleAddEmployee(newEmployee);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    const updatedData = employeeData.map(emp =>
        emp["Employee ID"] === updatedEmployee["Employee ID"] ? updatedEmployee : emp
      );
    setEmployeeData(updatedData);
     toast({
      title: "Employee Updated",
      description: `${updatedEmployee["Employee Name"]}'s data has been updated.`,
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employeeName = employeeData.find(e => e['Employee ID'] === employeeId)?.['Employee Name'];
    const updatedData = employeeData.filter(emp => emp["Employee ID"] !== employeeId);
    setEmployeeData(updatedData);
     toast({
      variant: "destructive",
      title: "Employee Deleted",
      description: `${employeeName} has been removed from the system.`,
    });
  };

  const employeesWithActions: EmployeeWithActions[] = employeeData.map(emp => ({
    ...emp,
    onEdit: handleUpdateEmployee,
    onDelete: handleDeleteEmployee
  }));

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-4">Employee Management</h1>
      <DataTable 
        columns={columns} 
        data={employeesWithActions}
        onAdd={handleAddClick}
      />
    </div>
  );
}
