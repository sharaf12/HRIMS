"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { Users, Gauge, TrendingUp, Group } from "lucide-react";
import { useMemo } from "react";

const COLORS: Record<string, string> = {
  Excellent: "hsl(var(--chart-1))",
  Good: "hsl(var(--chart-2))",
  Satisfactory: "hsl(var(--chart-3))",
  "Needs Improvement": "hsl(var(--chart-4))",
  Poor: "hsl(var(--chart-5))",
};

export default function AdminDashboard() {
  const { employees } = useEmployeeData();

  const stats = useMemo(() => {
    if (!employees || employees.length === 0) {
        return {
            totalEmployees: 0,
            avgKpi: 0,
            avgProductivity: 0,
            performanceDistribution: {},
        };
    }
    const totalEmployees = employees.length;
    const avgKpi =
      employees.reduce((acc, emp) => acc + (emp["Average KPI (%)"] || 0), 0) /
      totalEmployees;
    const avgProductivity =
      employees.reduce((acc, emp) => acc + (emp["Productivity Rate (%)"] || 0), 0) /
      totalEmployees;
    const performanceDistribution = employees.reduce((acc, emp) => {
      const level = emp["Final Performance Level"];
      if (level) {
        acc[level] = (acc[level] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEmployees,
      avgKpi,
      avgProductivity,
      performanceDistribution,
    };
  }, [employees]);

  const kpiByDeptData = useMemo(() => {
     if (!employees || employees.length === 0) return [];
    const deptData: Record<string, { totalKpi: number; count: number }> = {};
    employees.forEach((emp) => {
      if (!deptData[emp.Department]) {
        deptData[emp.Department] = { totalKpi: 0, count: 0 };
      }
      deptData[emp.Department].totalKpi += emp["Average KPI (%)"] || 0;
      deptData[emp.Department].count++;
    });

    return Object.entries(deptData).map(([name, data]) => ({
      name,
      avgKpi: data.count > 0 ? data.totalKpi / data.count : 0,
    }));
  }, [employees]);

  const performanceData = useMemo(() => {
    return Object.entries(stats.performanceDistribution).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stats.performanceDistribution]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Currently in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average KPI</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgKpi.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Productivity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgProductivity.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Company-wide productivity rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Performance Mix
            </CardTitle>
            <Group className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-1">
             {Object.entries(stats.performanceDistribution).map(([level, count]) => (
                <Badge key={level} variant="secondary" className="text-xs">
                  {level}: {count}
                </Badge>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>KPI by Department</CardTitle>
            <CardDescription>
              Average Key Performance Indicator scores for each department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kpiByDeptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--secondary))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Bar dataKey="avgKpi" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Level Distribution</CardTitle>
            <CardDescription>
              A breakdown of final performance levels across the company.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="40%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  formatter={(value) => <span className="text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
