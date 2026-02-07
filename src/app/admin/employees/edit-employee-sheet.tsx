"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Employee } from "@/lib/types";

interface EditEmployeeSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  employee: Employee | null;
  onSave: (updatedEmployee: Employee) => void;
}

export function EditEmployeeSheet({
  isOpen,
  onOpenChange,
  employee,
  onSave,
}: EditEmployeeSheetProps) {
  const form = useForm<Employee>({
    defaultValues: employee || {},
  });
  
  useEffect(() => {
    if (employee && isOpen) {
      form.reset(employee);
    } else if (!isOpen) {
      form.reset();
    }
  }, [employee, isOpen]);

  const handleClose = (open: boolean) => {
    onOpenChange(open);
  };

  const onSubmit = (values: Employee) => {
    // Coerce numeric values back to numbers
    const processedValues = { ...values };
    if (employee) {
      Object.keys(employee).forEach(key => {
        if (typeof employee[key] === 'number') {
          processedValues[key] = parseFloat(processedValues[key]);
        }
      });
    }
    onSave(processedValues);
    onOpenChange(false);
  };

  if (!employee) return null;

  const headers = Object.keys(employee);
  const idKey = headers.find(h => h.toLowerCase().includes('id')) || headers[0];
  const nameKey = headers.find(h => h.toLowerCase().includes('name')) || headers[1] || idKey;
  const employeeName = employee[nameKey];

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Employee</SheetTitle>
          <SheetDescription>
            Update the details for {employeeName}.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4" noValidate>
             {headers.map(header => {
                const isNumeric = typeof employee[header] === 'number';
                return (
                 <FormField
                  key={header}
                  control={form.control}
                  name={header}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{header}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type={isNumeric ? 'number' : 'text'}
                          disabled={header === idKey} 
                          value={field.value ?? ''} 
                          onChange={field.onChange}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             )})}
             <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
