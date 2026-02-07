"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { Award, Gift, TrendingUp } from "lucide-react";

export default function PerformancePage() {
  const { user } = useAuth();
  const employee = user?.employeeData;

  if (!employee) {
    return <div>Loading...</div>;
  }

  const performanceData = [
    { name: "KPI", value: employee["Average KPI (%)"], fill: "hsl(var(--primary))" },
    { name: "Productivity", value: employee["Productivity Rate (%)"], fill: "hsl(var(--accent))" },
  ];

  const gaugeData = [
    { name: "Score", value: employee["Average KPI (%)"] },
    { name: "Remaining", value: 100 - employee["Average KPI (%)"] },
  ]
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Your Performance Details</h1>
       <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Comparison</CardTitle>
            <CardDescription>Your KPI vs. Productivity Rate.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} layout="vertical" barSize={40}>
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--secondary))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KPI Gauge</CardTitle>
             <CardDescription>Your Key Performance Indicator score.</CardDescription>
          </CardHeader>
          <CardContent className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                 <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{employee["Average KPI (%)"]}%</span>
                <span className="text-muted-foreground">KPI Score</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reward & Recommendation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center p-4 border rounded-lg">
            <Gift className="mr-4 h-8 w-8 text-primary"/>
            <div>
              <p className="font-semibold">Bonus & Reward</p>
              <p className="text-sm text-muted-foreground">
                Bonus Eligibility: <span className="font-medium text-foreground">{employee["Bonus Eligibility"]}</span>
                <br />
                Reward Type: <span className="font-medium text-foreground">{employee["Reward Type"]}</span>
              </p>
            </div>
          </div>
           <div className="flex items-center p-4 border rounded-lg">
            <TrendingUp className="mr-4 h-8 w-8 text-accent"/>
            <div>
              <p className="font-semibold">Retention & Growth</p>
              <p className="text-sm text-muted-foreground">
                Retention Action: <span className="font-medium text-foreground">{employee["Retention Action"]}</span>
              </p>
            </div>
          </div>
           <div className="flex items-center p-4 border rounded-lg">
            <Award className="mr-4 h-8 w-8 text-yellow-400"/>
            <div>
              <p className="font-semibold">Final Performance Level</p>
              <p className="text-sm text-muted-foreground">
                Your calculated performance level is <span className="font-medium text-foreground">{employee["Final Performance Level"]}</span>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
