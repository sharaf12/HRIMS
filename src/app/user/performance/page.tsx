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
import { Award, Gift, TrendingUp, AlertTriangle } from "lucide-react";

const DataNotAvailable = ({ featureName }: { featureName: string }) => (
    <Card>
        <CardHeader>
            <CardTitle>{featureName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Data not available</p>
            <p className="text-xs text-muted-foreground">Required column not found in your data.</p>
        </CardContent>
    </Card>
);

export default function PerformancePage() {
  const { user } = useAuth();
  const employee = user?.employeeData;

  if (!employee) {
    return <div>Loading...</div>;
  }
  
  const headers = Object.keys(employee);
  const kpiKey = headers.find(h => h.toLowerCase().includes('kpi')) || '';
  const productivityKey = headers.find(h => h.toLowerCase().includes('productivity')) || '';
  const performanceKey = headers.find(h => h.toLowerCase().includes('performance level')) || '';
  const bonusKey = headers.find(h => h.toLowerCase().includes('bonus')) || '';
  const rewardKey = headers.find(h => h.toLowerCase().includes('reward')) || '';
  const retentionKey = headers.find(h => h.toLowerCase().includes('retention')) || '';

  const performanceData = [
    ...(kpiKey ? [{ name: kpiKey, value: employee[kpiKey], fill: "hsl(var(--primary))" }] : []),
    ...(productivityKey ? [{ name: productivityKey, value: employee[productivityKey], fill: "hsl(var(--accent))" }] : []),
  ];

  const kpiValue = kpiKey ? employee[kpiKey] : 0;
  const gaugeData = [
    { name: "Score", value: kpiValue },
    { name: "Remaining", value: 100 - kpiValue },
  ]
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  const hasRewardData = bonusKey || rewardKey || retentionKey || performanceKey;

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Your Performance Details</h1>
       <div className="grid gap-6 md:grid-cols-2">
        {performanceData.length > 0 ? <Card>
          <CardHeader>
            <CardTitle>Score Comparison</CardTitle>
            <CardDescription>Your KPI vs. Productivity Rate.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} layout="vertical" barSize={40} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} tick={{ fill: 'hsl(var(--foreground))' }} />
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
        </Card> : <DataNotAvailable featureName="Score Comparison" />}
        
        {kpiKey ? <Card>
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
                <span className="text-4xl font-bold">{kpiValue}%</span>
                <span className="text-muted-foreground">KPI Score</span>
            </div>
          </CardContent>
        </Card> : <DataNotAvailable featureName="KPI Gauge"/>}
      </div>
      {hasRewardData && (
        <Card>
          <CardHeader>
            <CardTitle>Reward & Recommendation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(bonusKey || rewardKey) && (
              <div className="flex items-center p-4 border rounded-lg">
                <Gift className="mr-4 h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Bonus & Reward</p>
                  <p className="text-sm text-muted-foreground">
                    {bonusKey && (
                      <>
                        Bonus Eligibility:{' '}
                        <span className="font-medium text-foreground">
                          {employee[bonusKey]}
                        </span>
                        <br />
                      </>
                    )}
                    {rewardKey && (
                      <>
                        Reward Type:{' '}
                        <span className="font-medium text-foreground">
                          {employee[rewardKey]}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
            {retentionKey && (
              <div className="flex items-center p-4 border rounded-lg">
                <TrendingUp className="mr-4 h-8 w-8 text-accent" />
                <div>
                  <p className="font-semibold">Retention & Growth</p>
                  <p className="text-sm text-muted-foreground">
                    Retention Action:{' '}
                    <span className="font-medium text-foreground">
                      {employee[retentionKey]}
                    </span>
                  </p>
                </div>
              </div>
            )}
            {performanceKey && (
              <div className="flex items-center p-4 border rounded-lg">
                <Award className="mr-4 h-8 w-8 text-yellow-400" />
                <div>
                  <p className="font-semibold">Final Performance Level</p>
                  <p className="text-sm text-muted-foreground">
                    Your calculated performance level is{' '}
                    <span className="font-medium text-foreground">
                      {employee[performanceKey]}
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
