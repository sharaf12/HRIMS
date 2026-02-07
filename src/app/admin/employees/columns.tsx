"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Employee } from "@/lib/types"

export type EmployeeWithActions = Employee & {
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

const PerformanceBadge = ({ level }: { level: string }) => {
  if (typeof level !== 'string') return null;
  const lowerLevel = level.toLowerCase();
  
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  
  const classMap = {
     excellent: "bg-green-600/80 hover:bg-green-600 text-white",
     good: "bg-blue-500/80 hover:bg-blue-500 text-white",
     satisfactory: "bg-yellow-500/80 hover:bg-yellow-500 text-black",
    "needs improvement": "bg-yellow-500/80 hover:bg-yellow-500 text-black",
    poor: "bg-red-600/80 hover:bg-red-600 text-white"
  };

  if (lowerLevel.includes("excellent")) variant = "default";
  else if (lowerLevel.includes("good")) variant = "secondary";
  else if (lowerLevel.includes("satisfactory")) variant = "outline";
  else if (lowerLevel.includes("poor") || lowerLevel.includes("improvement")) variant = "destructive";

  const selectedKey = Object.keys(classMap).find(k => lowerLevel.includes(k)) || 'good';
  const className = classMap[selectedKey as keyof typeof classMap];

  return <Badge variant={variant} className={className}>{level}</Badge>
}

const ActionsCell = ({ row }: { row: { original: EmployeeWithActions } }) => {
  const employee = row.original;
  const headers = Object.keys(employee).filter(k => k !== 'onEdit' && k !== 'onDelete');
  const idKey = headers.find(h => h.toLowerCase().includes('id')) || headers[0];
  
  const employeeId = employee[idKey];

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(employeeId)}
          >
            Copy Employee ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => employee.onEdit(employee)}>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => employee.onDelete(employeeId)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};

export const generateColumns = (headers: string[]): ColumnDef<EmployeeWithActions>[] => {
    const columns: ColumnDef<EmployeeWithActions>[] = headers.map(header => ({
        accessorKey: header,
        header: ({ column }) => {
            return (
                <div
                    className="flex items-center cursor-pointer whitespace-nowrap"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {header}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => {
            const value = row.getValue(header);
            if (header.toLowerCase().includes('performance level')) {
                return <PerformanceBadge level={String(value)} />;
            }
            return <div className="whitespace-nowrap" title={String(value)}>{String(value)}</div>
        },
    }));

    columns.push({
        id: "actions",
        cell: ActionsCell,
    });

    return columns;
}
