"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, UserCheck, UserX, Users, UserPlus } from "lucide-react";
import { User as UserType, Role } from "@prisma/client";

interface UserStatsProps {
  users: UserType[];
}

export function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length;
  const verifiedUsers = users.filter(user => user.emailVerified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<Role, number>);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "All registered users",
      color: "text-blue-600",
    },
    {
      title: "Verified Users",
      value: verifiedUsers,
      icon: UserCheck,
      description: "Email verified users",
      color: "text-green-600",
    },
    {
      title: "Unverified Users",
      value: unverifiedUsers,
      icon: UserX,
      description: "Pending verification",
      color: "text-orange-600",
    },
  ];

  const roleStats = [
    {
      role: "Super Admin",
      count: roleCounts.superAdmin || 0,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      icon: Shield,
    },
    {
      role: "Admin",
      count: roleCounts.admin || 0,
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      icon: Shield,
    },
    {
      role: "Author",
      count: roleCounts.author || 0,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      icon: User,
    },
    {
      role: "Member",
      count: roleCounts.member || 0,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      icon: User,
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
          <CardTitle className="text-sm font-medium">User Roles Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roleStats.map((roleStat) => {
              const Icon = roleStat.icon;
              return (
                <div key={roleStat.role} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{roleStat.role}</div>
                    <div className="text-2xl font-bold">{roleStat.count}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
