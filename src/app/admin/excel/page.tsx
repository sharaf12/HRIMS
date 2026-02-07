
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { Employee } from "@/lib/types";

const convertToCSV = (data: any[], headers: string[]) => {
  if (!data || data.length === 0 || !headers || headers.length === 0) {
    return "";
  }
  const replacer = (_key: any, value: any) => (value === null ? "" : value);
  const csv = data.map((row) =>
    headers
      .map((fieldName) => JSON.stringify(row[fieldName] || '', replacer))
      .join(",")
  );
  csv.unshift(headers.join(","));
  return csv.join("\r\n");
};

const downloadCSV = (csvString: string, filename: string) => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const parseCSV = (csvString: string): { data: Record<string, any>[], headers: string[] } => {
    try {
        const lines = csvString.trim().split(/\r?\n/);
        if (lines.length < 1) return { data: [], headers: [] };

        const headerLine = lines[0].replace(/^\uFEFF/, '');
        const headers = (headerLine.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [])
            .map(h => h.replace(/"/g, '').trim());

        if (headers.length === 0 || lines.length < 2) {
            return { data: [], headers: headers };
        }

        const rows = lines.slice(1);

        const data = rows.map(rowString => {
            if (!rowString.trim()) return null;

            const values = rowString.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => {
                let value = v.trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1).replace(/""/g, '"');
                }
                return value;
            });
            
            const rowObject: Record<string, any> = {};
            headers.forEach((key, index) => {
                let value: any = values[index] ?? '';
                if (!isNaN(value as any) && value.trim() !== '') {
                    value = parseFloat(value);
                }
                rowObject[key] = value;
            });
            return rowObject;
        }).filter((e): e is Record<string, any> => e !== null);

        return { data, headers };
    } catch (error) {
        console.error("Error parsing CSV:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to parse CSV: ${error.message}`);
        }
        throw new Error("An unknown error occurred while parsing CSV.");
    }
};


export default function ExcelOperationsPage() {
  const { toast } = useToast();
  const { employees, setData, resetEmployees, headers } = useEmployeeData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDownload = () => {
    const csvData = convertToCSV(employees, headers);
    downloadCSV(csvData, "employees.csv");
    toast({
      title: "Download Started",
      description: "Your employee data is being downloaded as a CSV file.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a CSV file to import.",
      });
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const { data: newEmployees, headers: newHeaders } = parseCSV(text);
        if (newEmployees.length === 0 || newHeaders.length === 0) {
            throw new Error("CSV file appears to be empty or has no headers.")
        }
        setData(newEmployees, newHeaders);
        toast({
          title: "Import Successful",
          description: `Successfully imported ${newEmployees.length} employee records.`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: error.message || "Could not parse the CSV file.",
        });
      } finally {
        setIsImporting(false);
      }
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the selected file.",
        });
        setIsImporting(false);
    };
    reader.readAsText(selectedFile);
  };

  const handleRefresh = () => {
    resetEmployees();
    toast({
      title: "Data Reset",
      description: "Employee data has been reset to the original sample data.",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Data Operations</h1>
       <CardDescription>
        Here you can manage the application's employee data. You can upload a CSV file to use your own data, download the current data, or reset to the original sample data.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Download Data</CardTitle>
            <CardDescription>
              Download the current employee dataset as a CSV file. This is useful for seeing the required format for uploads.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <Download className="h-16 w-16 text-muted-foreground" />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV File
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>
              Upload a new CSV file to replace all existing data. This action
              cannot be undone. The first column should be a unique ID for each employee.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="excel-file">Select CSV File</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isImporting}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleImport}
              disabled={isImporting || !selectedFile}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? "Importing..." : "Import and Replace Data"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reset Data</CardTitle>
          <CardDescription>
            Revert the employee data to the original sample dataset that came with the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-12">
          <RefreshCw className="h-16 w-16 text-muted-foreground" />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Sample Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
