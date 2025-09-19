"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Mail,
  Settings
} from "lucide-react";
import { User as UserType, Role } from "@prisma/client";
import { format } from "date-fns";

interface UserStatsProps {
  user: UserType;
}

const roleColors = {
  superAdmin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  admin: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  author: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  member: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const roleIcons = {
  superAdmin: Shield,
  admin: Shield,
  author: User,
  member: User,
};

export function UserStats({ user }: UserStatsProps) {
  const getRoleBadge = (role: Role) => {
    const Icon = roleIcons[role];
    return (
      <Badge className={roleColors[role]}>
        <Icon className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const accountAge = Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const stats = [
    {
      title: "Account Status",
      value: "Active",
      icon: CheckCircle,
      description: "Your account is active and ready to use",
      color: "text-green-600",
    },
    {
      title: "Email Status",
      value: user.emailVerified ? "Verified" : "Unverified",
      icon: user.emailVerified ? CheckCircle : XCircle,
      description: user.emailVerified ? "Your email is verified" : "Please verify your email",
      color: user.emailVerified ? "text-green-600" : "text-orange-600",
    },
    {
      title: "Account Age",
      value: `${accountAge} days`,
      icon: Calendar,
      description: "Days since account creation",
      color: "text-blue-600",
    },
    {
      title: "Profile Status",
      value: user.image ? "Complete" : "Incomplete",
      icon: Settings,
      description: user.image ? "Profile image is set" : "Add a profile image",
      color: user.image ? "text-green-600" : "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
      
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm font-mono">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Role:</span>
                {getRoleBadge(user.role)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Joined:</span>
                <span className="text-sm">
                  {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm">
                  {format(new Date(user.updatedAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
