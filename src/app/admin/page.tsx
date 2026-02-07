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
import { Users, Gauge, TrendingUp, Group, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const COLORS: Record<string, string> = {
  Excellent: "hsl(var(--chart-1))",
  Good: "hsl(var(--chart-2))",
  Satisfactory: "hsl(var(--chart-3))",
  "Needs Improvement": "hsl(var(--chart-4))",
  Poor: "hsl(var(--chart-5))",
};

const DataNotAvailable = ({ columnName }: { columnName: string }) => (
    <CardContent className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Data not available</p>
        <p className="text-xs text-muted-foreground">Column &apos;{columnName}&apos; not found in the uploaded data.</p>
    </CardContent>
);


export default function AdminDashboard() {
  const { employees, headers } = useEmployeeData();
  const isMobile = useIsMobile();

  const requiredColumns = useMemo(() => ({
    kpi: headers.find(h => h.toLowerCase().includes('kpi')) || '',
    productivity: headers.find(h => h.toLowerCase().includes('productivity')) || '',
    performance: headers.find(h => h.toLowerCase().includes('performance level')) || '',
    department: headers.find(h => h.toLowerCase().includes('department')) || '',
  }), [headers]);


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
    const avgKpi = requiredColumns.kpi
      ? employees.reduce((acc, emp) => acc + (emp[requiredColumns.kpi] || 0), 0) /
      totalEmployees : 0;
    const avgProductivity = requiredColumns.productivity
      ? employees.reduce((acc, emp) => acc + (emp[requiredColumns.productivity] || 0), 0) /
      totalEmployees : 0;
    const performanceDistribution = requiredColumns.performance ? employees.reduce((acc, emp) => {
      const level = emp[requiredColumns.performance];
      if (level) {
        acc[level] = (acc[level] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) : {};

    return {
      totalEmployees,
      avgKpi,
      avgProductivity,
      performanceDistribution,
    };
  }, [employees, requiredColumns]);

  const kpiByDeptData = useMemo(() => {
     if (!employees || employees.length === 0 || !requiredColumns.department || !requiredColumns.kpi) return [];
    const deptData: Record<string, { totalKpi: number; count: number }> = {};
    employees.forEach((emp) => {
      const dept = emp[requiredColumns.department];
      if (!deptData[dept]) {
        deptData[dept] = { totalKpi: 0, count: 0 };
      }
      deptData[dept].totalKpi += emp[requiredColumns.kpi] || 0;
      deptData[dept].count++;
    });

    return Object.entries(deptData).map(([name, data]) => ({
      name,
      avgKpi: data.count > 0 ? data.totalKpi / data.count : 0,
    }));
  }, [employees, requiredColumns]);

  const performanceData = useMemo(() => {
    return Object.entries(stats.performanceDistribution).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stats.performanceDistribution]);
  
  const performanceColors = useMemo(() => {
    const colorMap: Record<string, string> = {};
    performanceData.forEach(item => {
        const key = Object.keys(COLORS).find(c => item.name.toLowerCase().includes(c.toLowerCase()));
        colorMap[item.name] = key ? COLORS[key] : COLORS.Satisfactory;
    })
    return colorMap;
  }, [performanceData]);

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
            {requiredColumns.kpi ? <>
            <div className="text-2xl font-bold">{stats.avgKpi.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
            </> : <p className="text-xs text-muted-foreground">KPI column not found</p>}
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
             {requiredColumns.productivity ? <>
            <div className="text-2xl font-bold">
              {stats.avgProductivity.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Company-wide productivity rate
            </p>
             </> : <p className="text-xs text-muted-foreground">Productivity column not found</p>}
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
             {requiredColumns.performance && Object.entries(stats.performanceDistribution).length > 0 ? Object.entries(stats.performanceDistribution).map(([level, count]) => (
                <Badge key={level} variant="secondary" className="text-xs">
                  {level}: {count}
                </Badge>
              )) : <p className="text-xs text-muted-foreground">Performance column not found</p>}
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
            {kpiByDeptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={kpiByDeptData} margin={{ top: 5, right: 20, left: -10, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  unit="%"
                />
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
            ) : <DataNotAvailable columnName={!requiredColumns.department ? 'Department' : 'Average KPI (%)'} />}
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
            {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={isMobile ? 400 : 300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx={isMobile ? "50%" : "40%"}
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 80 : 100}
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
                  {performanceData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={performanceColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Legend
                  layout={isMobile ? "horizontal" : "vertical"}
                  verticalAlign={isMobile ? "bottom" : "middle"}
                  align={isMobile ? "center" : "right"}
                  iconType="circle"
                  formatter={(value) => <span className="text-white">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
             ) : <DataNotAvailable columnName={'Final Performance Level'} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
