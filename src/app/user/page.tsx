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
import { Separator } from "@/components/ui/separator";
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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={`/avatars/${employee["Employee ID"]}.png`} />
            <AvatarFallback className="text-3xl">
              {getInitials(employee["Employee Name"])}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{employee["Employee Name"]}</CardTitle>
            <CardDescription>{employee["Employee ID"]}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-4">
            <div className="flex items-center">
              <Briefcase className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>{employee["Job Title"]}</span>
            </div>
            <div className="flex items-center">
              <Building className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>{employee.Department}</span>
            </div>
            <div className="flex items-center">
              <User className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>Supervisor: {employee.Supervisor}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <Star className="h-8 w-8 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Average KPI</p>
                <p className="text-2xl font-bold">{employee["Average KPI (%)"]}%</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Zap className="h-8 w-8 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Productivity Rate</p>
                <p className="text-2xl font-bold">{employee["Productivity Rate (%)"]}%</p>
              </div>
            </div>
          </CardContent>
           <CardContent>
             <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">Final Performance Level:</p>
                <Badge className={
                    {
                      Excellent: "bg-green-600 text-white",
                      Good: "bg-blue-500 text-white",
                      Satisfactory: "bg-yellow-500 text-black",
                      "Needs Improvement": "bg-yellow-500 text-black",
                      Poor: "bg-red-600 text-white"
                    }[employee["Final Performance Level"]]
                }>
                  {employee["Final Performance Level"]}
                </Badge>
              </div>
           </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rewards & Retention</CardTitle>
          </CardHeader>
           <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <Gift className="h-8 w-8 text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Bonus Eligibility</p>
                <p className="text-2xl font-bold">{employee["Bonus Eligibility"]}</p>
                 <p className="text-xs text-muted-foreground">Reward Type: {employee["Reward Type"]}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Handshake className="h-8 w-8 text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Retention Action</p>
                <p className="text-xl font-semibold">{employee["Retention Action"]}</p>
                <p className="text-xs text-muted-foreground">Proactive measures for career growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
