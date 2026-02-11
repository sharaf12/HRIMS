
"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  BarChart, Bar, ScatterChart, Scatter, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useEmployeeData } from "@/hooks/use-employee-data";
import { Gauge, TrendingUp, CalendarCheck, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const CHART_COLORS = {
  blue: "hsl(var(--chart-2))",
  green: "hsl(var(--chart-1))",
  orange: "hsl(var(--chart-5))",
  yellow: "hsl(var(--chart-4))",
  purple: "hsl(var(--chart-3))",
  red: "hsl(var(--destructive))",
};

const STACK_COLORS = [
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.yellow,
  CHART_COLORS.orange,
  "hsl(var(--ring))"
];

const PERFORMANCE_COLORS: Record<string, string> = {
  Excellent: CHART_COLORS.green,
  Good: CHART_COLORS.blue,
  Satisfactory: CHART_COLORS.yellow,
  "Needs Improvement": CHART_COLORS.orange,
  Poor: CHART_COLORS.red,
};

const chartOptions = {
    kpiTrend: "Quarterly KPI Trend",
    performanceDistribution: "Performance Rating Distribution",
    departmentKpi: "Department-wise KPI",
    avgKpiBySupervisor: "Team KPI by Supervisor",
    employeeDistByDept: "Employees by Department",
    avgKpiByJobTitle: "KPI by Job Title",
    projectsVsKpi: "Projects vs. KPI",
    avgAttendanceByDept: "Attendance by Department",
    avgTrainingByDept: "Training Hours by Department",
    hrAction: "HR Recommendation Distribution",
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const finalLabel = label || payload[0]?.payload?.name;
    return (
      <div className="rounded-lg border bg-background p-2.5 text-sm shadow-lg">
        {finalLabel && <p className="font-medium text-foreground mb-1">{finalLabel}</p>}
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.fill || pld.color || pld.stroke }}>
            {pld.name}: {typeof pld.value === 'number' ? pld.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : pld.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


export default function AdminDashboard() {
  const { employees, headers } = useEmployeeData();

  const [visibleCharts, setVisibleCharts] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    for (const key in chartOptions) {
        initialState[key] = true;
    }
    return initialState;
  });

  const handleChartVisibilityChange = (chartKey: string, checked: boolean) => {
      setVisibleCharts(prev => ({ ...prev, [chartKey]: checked }));
  };

  const requiredColumns = useMemo(() => {
    const findHeader = (keywords: string[]) => {
      for (const keyword of keywords) {
        const found = headers.find(h => h.toLowerCase().includes(keyword));
        if (found) return found;
      }
      return '';
    };

    return {
      kpi: findHeader(['kpi score (%)', 'average kpi (%)']),
      performance: findHeader(['performance rating', 'final performance level']),
      attendance: findHeader(['attendance rate (%)', 'attendance']),
      trainingHours: findHeader(['training hours attended', 'training hours']),
      department: findHeader(['department']),
      jobTitle: findHeader(['job title', 'role']),
      recommendation: findHeader(['system recommendation', 'retention action']),
      projects: findHeader(['projects completed']),
      supervisor: findHeader(['supervisor']),
      quarter: findHeader(['quarter']),
    };
  }, [headers]);

  const kpiCardStats = useMemo(() => {
    if (!employees || employees.length === 0) {
        return { avgKpi: 0, excellentPercent: 0, avgAttendance: 0, totalTraining: 0 };
    }
    const totalEmployees = employees.length;
    
    const avgKpi = requiredColumns.kpi
      ? employees.reduce((acc, emp) => acc + (Number(emp[requiredColumns.kpi]) || 0), 0) / totalEmployees
      : 0;

    const excellentCount = requiredColumns.performance
      ? employees.filter(e => String(e[requiredColumns.performance]).toLowerCase() === 'excellent').length
      : 0;
    const excellentPercent = totalEmployees > 0 ? (excellentCount / totalEmployees) * 100 : 0;
    
    const avgAttendance = requiredColumns.attendance
      ? employees.reduce((acc, emp) => acc + (Number(emp[requiredColumns.attendance]) || 0), 0) / totalEmployees
      : 0;

    const totalTraining = requiredColumns.trainingHours
      ? employees.reduce((acc, emp) => acc + (Number(emp[requiredColumns.trainingHours]) || 0), 0)
      : 0;

    return { avgKpi, excellentPercent, avgAttendance, totalTraining };
  }, [employees, requiredColumns]);

  const performanceDistributionData = useMemo(() => {
    if (!requiredColumns.performance) return [];
    const dist = employees.reduce((acc, emp) => {
      const level = emp[requiredColumns.performance];
      if (level) acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [employees, requiredColumns.performance]);

  const departmentKpiData = useMemo(() => {
    if (!requiredColumns.department || !requiredColumns.kpi) return [];
    const deptData: Record<string, { total: number; count: number }> = {};
    employees.forEach(emp => {
      const dept = emp[requiredColumns.department];
      if (!dept) return;
      if (!deptData[dept]) deptData[dept] = { total: 0, count: 0 };
      deptData[dept].total += (Number(emp[requiredColumns.kpi]) || 0);
      deptData[dept].count++;
    });
    return Object.entries(deptData).map(([name, data]) => ({
      name,
      'Average KPI': data.count > 0 ? data.total / data.count : 0
    }));
  }, [employees, requiredColumns.department, requiredColumns.kpi]);
  
 const hrActionData = useMemo(() => {
    if (!requiredColumns.department || !requiredColumns.recommendation) return { data: [], actions: [] };
    
    const allActions = [...new Set(employees.map(e => e[requiredColumns.recommendation]).filter(Boolean))] as string[];
    const deptActions: Record<string, Record<string, number>> = {};
    
    employees.forEach(emp => {
        const dept = emp[requiredColumns.department];
        const action = emp[requiredColumns.recommendation] || 'N/A';
        if (!dept) return;

        if (!deptActions[dept]) {
            deptActions[dept] = {};
        }
        deptActions[dept][action] = (deptActions[dept][action] || 0) + 1;
    });

    const data = Object.entries(deptActions).map(([name, values]) => ({ name, ...values }));
    
    return { data, actions: allActions };
}, [employees, requiredColumns.department, requiredColumns.recommendation]);

  const projectsVsKpiData = useMemo(() => {
    if (!requiredColumns.kpi || !requiredColumns.projects) return [];
    return employees.map(emp => ({
        kpi: emp[requiredColumns.kpi],
        projects: emp[requiredColumns.projects]
    })).filter(e => e.kpi && e.projects);
  }, [employees, requiredColumns.kpi, requiredColumns.projects]);

  const avgTrainingByDeptData = useMemo(() => {
      if (!requiredColumns.department || !requiredColumns.trainingHours) return [];
      const deptData: Record<string, { total: number; count: number }> = {};
      employees.forEach(emp => {
        const dept = emp[requiredColumns.department];
        if (!dept) return;
        if (!deptData[dept]) deptData[dept] = { total: 0, count: 0 };
        deptData[dept].total += (Number(emp[requiredColumns.trainingHours]) || 0);
        deptData[dept].count++;
      });
      return Object.entries(deptData).map(([name, data]) => ({
        name,
        'Average Hours': data.count > 0 ? data.total / data.count : 0
      }));
  }, [employees, requiredColumns.department, requiredColumns.trainingHours]);

 const kpiTrendData = useMemo(() => {
    const quarterCol = requiredColumns.quarter;
    const kpiCol = requiredColumns.kpi;
    
    if (!quarterCol || !kpiCol || !employees || employees.length === 0) {
      return [];
    }

    const quarterlyData = employees.reduce((acc, emp) => {
        const quarter = emp[quarterCol];
        const kpi = Number(emp[kpiCol]) || 0;

        if (quarter && typeof quarter === 'string' && quarter.toUpperCase().startsWith('Q')) {
            const normalizedQuarter = quarter.toUpperCase();
            if (!acc[normalizedQuarter]) {
                acc[normalizedQuarter] = { total: 0, count: 0 };
            }
            acc[normalizedQuarter].total += kpi;
            acc[normalizedQuarter].count++;
        }
        return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const chartData = ['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
        const data = quarterlyData[q];
        return {
            name: q,
            'Average KPI': data && data.count > 0 ? data.total / data.count : 0,
        };
    });

    const hasData = chartData.some(d => d['Average KPI'] > 0);
    return hasData ? chartData : [];
}, [employees, requiredColumns.quarter, requiredColumns.kpi]);

const employeeDistByDeptData = useMemo(() => {
    if (!requiredColumns.department) return [];
    const dist = employees.reduce((acc, emp) => {
        const dept = emp[requiredColumns.department] || 'Unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(dist).map(([name, value]) => ({ name, Employees: value }));
}, [employees, requiredColumns.department]);

const avgKpiByJobTitleData = useMemo(() => {
    if (!requiredColumns.jobTitle || !requiredColumns.kpi) return [];
    const roleData: Record<string, { total: number, count: number }> = {};
    employees.forEach(emp => {
        const role = emp[requiredColumns.jobTitle];
        if (!role) return;
        if (!roleData[role]) roleData[role] = { total: 0, count: 0 };
        roleData[role].total += (Number(emp[requiredColumns.kpi]) || 0);
        roleData[role].count++;
    });
    return Object.entries(roleData).map(([name, data]) => ({
      name,
      'Average KPI': data.count > 0 ? data.total / data.count : 0
    })).sort((a, b) => b['Average KPI'] - a['Average KPI']);
}, [employees, requiredColumns.jobTitle, requiredColumns.kpi]);

const avgAttendanceByDeptData = useMemo(() => {
    if (!requiredColumns.department || !requiredColumns.attendance) return [];
    const deptData: Record<string, { total: number, count: number }> = {};
    employees.forEach(emp => {
        const dept = emp[requiredColumns.department];
        if (!dept) return;
        if (!deptData[dept]) deptData[dept] = { total: 0, count: 0 };
        deptData[dept].total += (Number(emp[requiredColumns.attendance]) || 0);
        deptData[dept].count++;
    });
    return Object.entries(deptData).map(([name, data]) => ({
      name,
      'Average Attendance': data.count > 0 ? data.total / data.count : 0
    }));
}, [employees, requiredColumns.department, requiredColumns.attendance]);


const avgKpiBySupervisorData = useMemo(() => {
    if (!requiredColumns.supervisor || !requiredColumns.kpi) return [];
    const supervisorData: Record<string, { total: number, count: number }> = {};
    employees.forEach(emp => {
        const supervisor = emp[requiredColumns.supervisor];
        if (!supervisor) return;
        if (!supervisorData[supervisor]) supervisorData[supervisor] = { total: 0, count: 0 };
        supervisorData[supervisor].total += (Number(emp[requiredColumns.kpi]) || 0);
        supervisorData[supervisor].count++;
    });
    return Object.entries(supervisorData).map(([name, data]) => ({
      name,
      'Average Team KPI': data.count > 0 ? data.total / data.count : 0
    })).sort((a, b) => b['Average Team KPI'] - a['Average Team KPI']);
}, [employees, requiredColumns.supervisor, requiredColumns.kpi]);


  const isPerformanceDeepDiveVisible = 
    (visibleCharts.kpiTrend && kpiTrendData.length > 0) ||
    (visibleCharts.performanceDistribution && performanceDistributionData.length > 0) ||
    (visibleCharts.departmentKpi && departmentKpiData.length > 0) ||
    (visibleCharts.avgKpiBySupervisor && avgKpiBySupervisorData.length > 0);

  const isWorkforceProductivityVisible = 
    (visibleCharts.employeeDistByDept && employeeDistByDeptData.length > 0) ||
    (visibleCharts.avgKpiByJobTitle && avgKpiByJobTitleData.length > 0) ||
    (visibleCharts.projectsVsKpi && projectsVsKpiData.length > 0) ||
    (visibleCharts.avgAttendanceByDept && avgAttendanceByDeptData.length > 0);

  const isDevelopmentRetentionVisible =
    (visibleCharts.avgTrainingByDept && avgTrainingByDeptData.length > 0) ||
    (visibleCharts.hrAction && hrActionData.data.length > 0);

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold">HR Dashboard</h1>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Customize Dashboard
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>Show/Hide Visualizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(chartOptions).map(([key, label]) => (
                    <DropdownMenuCheckboxItem
                        key={key}
                        checked={visibleCharts[key]}
                        onCheckedChange={(checked) => handleChartVisibilityChange(key, !!checked)}
                    >
                        {label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
       </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Overall Performance Snapshot</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {requiredColumns.kpi && (
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average KPI Score</CardTitle>
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{kpiCardStats.avgKpi.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">Across all employee records</p>
                  </CardContent>
              </Card>
            )}
            {requiredColumns.performance && (
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">% Excellent Performers</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{kpiCardStats.excellentPercent.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">Employees rated as 'Excellent'</p>
                  </CardContent>
              </Card>
            )}
            {requiredColumns.attendance && (
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Attendance Rate</CardTitle>
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{kpiCardStats.avgAttendance.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">Company-wide average</p>
                  </CardContent>
              </Card>
            )}
            {requiredColumns.trainingHours && (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Training Hours</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpiCardStats.totalTraining.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Logged across the organization</p>
                </CardContent>
            </Card>
            )}
        </div>
      </section>

      {isPerformanceDeepDiveVisible && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Performance Deep Dive</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visibleCharts.kpiTrend && kpiTrendData.length > 0 && (
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-lg">Quarterly KPI Trend</CardTitle>
                        <CardDescription>Average KPI score across all employees per quarter.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={kpiTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="Average KPI" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
              )}
              
              {visibleCharts.performanceDistribution && performanceDistributionData.length > 0 && (
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-lg">Performance Rating</CardTitle>
                        <CardDescription>Distribution of employee performance ratings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={performanceDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                    {performanceDistributionData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={PERFORMANCE_COLORS[entry.name] || CHART_COLORS.blue} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" formatter={(value) => <span className="text-foreground text-sm">{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
              )}

              {visibleCharts.departmentKpi && departmentKpiData.length > 0 && (
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-lg">Department-wise KPI</CardTitle>
                        <CardDescription>Average KPI score for each department.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentKpiData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} content={<CustomTooltip />} />
                                <Bar dataKey="Average KPI" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
              )}
              
              {visibleCharts.avgKpiBySupervisor && avgKpiBySupervisorData.length > 0 && (
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-lg">Team KPI by Supervisor</CardTitle>
                          <CardDescription>Average team KPI score for each supervisor.</CardDescription>
                      </CardHeader>
                      <CardContent>
                           <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={avgKpiBySupervisorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                  <YAxis unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                  <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} content={<CustomTooltip />} />
                                  <Bar dataKey="Average Team KPI" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </CardContent>
                  </Card>
              )}
          </div>
        </section>
      )}
      
      {isWorkforceProductivityVisible && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Workforce & Productivity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visibleCharts.employeeDistByDept && employeeDistByDeptData.length > 0 && (
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-lg">Employees by Department</CardTitle>
                          <CardDescription>Total number of employee records in each department.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={employeeDistByDeptData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                  <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} content={<CustomTooltip />} />
                                  <Bar dataKey="Employees" fill={CHART_COLORS.purple} radius={[0, 4, 4, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </CardContent>
                  </Card>
              )}

              {visibleCharts.avgKpiByJobTitle && avgKpiByJobTitleData.length > 0 && (
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-lg">KPI by Job Title</CardTitle>
                          <CardDescription>Average KPI score for each job title.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={avgKpiByJobTitleData} margin={{bottom: 75 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                  <XAxis dataKey="name" angle={-45} textAnchor="end" stroke="hsl(var(--muted-foreground))" fontSize={12} interval={0} />
                                  <YAxis unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                                  <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} content={<CustomTooltip />} />
                                  <Bar dataKey="Average KPI" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </CardContent>
                  </Card>
              )}
              
              {visibleCharts.projectsVsKpi && projectsVsKpiData.length > 0 && <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Projects vs. KPI</CardTitle>
                      <CardDescription>Shows the relationship between projects completed and KPI score.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                              <CartesianGrid stroke="hsl(var(--border))" />
                              <XAxis type="number" dataKey="kpi" name="KPI Score" unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis type="number" dataKey="projects" name="Projects Completed" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                              <Scatter name="Employees" data={projectsVsKpiData} fill="hsl(var(--primary))" />
                          </ScatterChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>}
              
              {visibleCharts.avgAttendanceByDept && avgAttendanceByDeptData.length > 0 && (
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-lg">Attendance by Department</CardTitle>
                          <CardDescription>Average attendance rate per department.</CardDescription>
                      </CardHeader>
                      <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={avgAttendanceByDeptData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                              <YAxis unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }}/>
                              <Bar dataKey="Average Attendance" fill={CHART_COLORS.orange} radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                      </CardContent>
                  </Card>
              )}
          </div>
        </section>
      )}
      
      {isDevelopmentRetentionVisible && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Development & Retention</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {visibleCharts.avgTrainingByDept && avgTrainingByDeptData.length > 0 && <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Training Hours by Department</CardTitle>
                      <CardDescription>Average training hours per employee in each department.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={avgTrainingByDeptData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }}/>
                              <Bar dataKey="Average Hours" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>}
          
              {visibleCharts.hrAction && hrActionData.data.length > 0 && <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">HR Recommendation Distribution</CardTitle>
                      <CardDescription>Breakdown of retention actions and recommendations by department.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                           <BarChart data={hrActionData.data} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
                               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                               <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                               <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                               <Tooltip content={<CustomTooltip />} />
                               <Legend formatter={(value) => <span className="text-foreground text-sm">{value}</span>} />
                               {hrActionData.actions.map((action, index) => (
                                  <Bar
                                      key={action}
                                      dataKey={action}
                                      stackId="a"
                                      fill={STACK_COLORS[index % STACK_COLORS.length]}
                                  />
                              ))}
                           </BarChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>}
          </div>
         </section>
      )}
    </div>
  );
}
