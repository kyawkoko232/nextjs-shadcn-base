"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Calendar, 
  Shield, 
  User, 
  CheckCircle, 
  XCircle,
  Edit,
  Settings,
  Crown,
  Star,
  Award,
  Clock,
  Activity
} from "lucide-react";
import { User as UserType, Role } from "@prisma/client";
import { format } from "date-fns";

interface UserProfileProps {
  user: UserType;
}

const roleColors = {
  superAdmin: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  admin: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
  author: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  member: "bg-gradient-to-r from-green-500 to-green-600 text-white",
};

const roleIcons = {
  superAdmin: Crown,
  admin: Shield,
  author: User,
  member: User,
};

export function UserProfile({ user }: UserProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: Role) => {
    const Icon = roleIcons[role];
    return (
      <Badge className={`${roleColors[role]} border-0 shadow-sm`}>
        <Icon className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const accountAge = Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-background shadow-lg">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {user.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.email.split('@')[0]}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleBadge(user.role)}
                  <Badge variant={user.emailVerified ? "default" : "secondary"} className="text-xs">
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="shadow-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="text-sm font-mono">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Role</p>
                    <div className="mt-1">{getRoleBadge(user.role)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Account Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                    <p className="text-sm font-semibold">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-semibold">
                      {format(new Date(user.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Account Age</p>
                <p className="text-2xl font-bold text-blue-700">{accountAge} days</p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Profile Status</p>
                <p className="text-2xl font-bold text-green-700">
                  {user.image ? "Complete" : "Incomplete"}
                </p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Verification</p>
                <p className="text-2xl font-bold text-purple-700">
                  {user.emailVerified ? "Verified" : "Pending"}
                </p>
              </div>
              <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-full">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
