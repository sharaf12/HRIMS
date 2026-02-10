"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Building,
  Star,
  Zap,
  Gift,
  Handshake,
  User,
} from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const employee = user?.employeeData;

  if (!employee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Employee Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not find performance data for your account.</p>
        </CardContent>
      </Card>
    );
  }
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const headers = Object.keys(employee);
  const idKey = headers.find(h => h.toLowerCase().includes('id')) || headers[0];
  const nameKey = headers.find(h => h.toLowerCase().includes('name')) || headers[1] || idKey;
  const jobTitleKey = headers.find(h => h.toLowerCase().includes('job title')) || '';
  const departmentKey = headers.find(h => h.toLowerCase().includes('department')) || '';
  const supervisorKey = headers.find(h => h.toLowerCase().includes('supervisor')) || '';
  const kpiKey = headers.find(h => h.toLowerCase().includes('kpi')) || '';
  const productivityKey = headers.find(h => h.toLowerCase().includes('productivity')) || '';
  const performanceKey = headers.find(h => h.toLowerCase().includes('performance level')) || '';
  const bonusKey = headers.find(h => h.toLowerCase().includes('bonus')) || '';
  const rewardKey = headers.find(h => h.toLowerCase().includes('reward')) || '';
  const retentionKey = headers.find(h => h.toLowerCase().includes('retention')) || '';


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={`/avatars/${employee[idKey]}.png`} />
            <AvatarFallback className="text-3xl">
              {getInitials(employee[nameKey])}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{employee[nameKey]}</CardTitle>
            <CardDescription>{employee[idKey]}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-4">
            {jobTitleKey && <div className="flex items-center">
              <Briefcase className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>{employee[jobTitleKey]}</span>
            </div>}
            {departmentKey && <div className="flex items-center">
              <Building className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>{employee[departmentKey]}</span>
            </div>}
            {supervisorKey && <div className="flex items-center">
              <User className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>Supervisor: {employee[supervisorKey]}</span>
            </div>}
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            {kpiKey && <div className="flex items-start gap-4">
              <Star className="h-8 w-8 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">{kpiKey}</p>
                <p className="text-2xl font-bold">{employee[kpiKey]}%</p>
              </div>
            </div>}
            {productivityKey && <div className="flex items-start gap-4">
              <Zap className="h-8 w-8 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">{productivityKey}</p>
                <p className="text-2xl font-bold">{employee[productivityKey]}%</p>
              </div>
            </div>}
          </CardContent>
           {performanceKey && <CardContent>
             <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">{performanceKey}:</p>
                <Badge>
                  {employee[performanceKey]}
                </Badge>
              </div>
           </CardContent>}
        </Card>
        
        {(bonusKey || rewardKey || retentionKey) && (
          <Card>
            <CardHeader>
              <CardTitle>Rewards & Retention</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {bonusKey && (
                <div className="flex items-start gap-4">
                  <Gift className="h-8 w-8 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">{bonusKey}</p>
                    <p className="text-2xl font-bold">{employee[bonusKey]}</p>
                    {rewardKey && (
                      <p className="text-xs text-muted-foreground">
                        {rewardKey}: {employee[rewardKey]}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {retentionKey && (
                <div className="flex items-start gap-4">
                  <Handshake className="h-8 w-8 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {retentionKey}
                    </p>
                    <p className="text-xl font-semibold">
                      {employee[retentionKey]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Proactive measures for career growth
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
