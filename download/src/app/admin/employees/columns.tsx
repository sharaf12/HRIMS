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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Employee } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export type EmployeeWithActions = Employee & {
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

const PerformanceBadge = ({ level }: { level: string }) => {
  const variant: "default" | "secondary" | "destructive" | "outline" = {
    Excellent: "default",
    Good: "secondary",
    Satisfactory: "outline",
    "Needs Improvement": "outline",
    Poor: "destructive"
  }[level] || "secondary";

  const className = {
     Excellent: "bg-green-600/80 hover:bg-green-600 text-white",
     Good: "bg-blue-500/80 hover:bg-blue-500 text-white",
     Satisfactory: "bg-yellow-500/80 hover:bg-yellow-500 text-black",
    "Needs Improvement": "bg-yellow-500/80 hover:bg-yellow-500 text-black",
    Poor: "bg-red-600/80 hover:bg-red-600 text-white"
  }[level];

  return <Badge variant={variant} className={className}>{level}</Badge>
}

const ActionsCell = ({ row }: { row: { original: EmployeeWithActions } }) => {
  const employee = row.original;
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Editing employee data is not yet implemented.",
    });
    // For future implementation, you would call:
    // employee.onEdit(employee);
  };

  return (
    <AlertDialog>
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
            onClick={() => navigator.clipboard.writeText(employee["Employee ID"])}
          >
            Copy Employee ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            employee &apos;{employee["Employee Name"]}&apos; and remove their data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => employee.onDelete(employee["Employee ID"])}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


export const columns: ColumnDef<EmployeeWithActions>[] = [
  {
    accessorKey: "Employee Name",
    header: "Name",
  },
  {
    accessorKey: "Employee ID",
    header: "ID",
  },
  {
    accessorKey: "Department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "Job Title",
    header: "Job Title",
  },
  {
    accessorKey: "Average KPI (%)",
    header: "KPI (%)",
    cell: ({ row }) => <div className="text-center">{row.getValue("Average KPI (%)")}</div>
  },
  {
    accessorKey: "Productivity Rate (%)",
    header: "Productivity (%)",
     cell: ({ row }) => <div className="text-center">{row.getValue("Productivity Rate (%)")}</div>
  },
  {
    accessorKey: "Final Performance Level",
    header: "Performance",
    cell: ({ row }) => <PerformanceBadge level={row.getValue("Final Performance Level")} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]
