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
  MoreHorizontal
} from "lucide-react";
import { User as UserType, Role } from "@prisma/client";
import { format } from "date-fns";

interface UserDetailCardProps {
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

export function UserDetailCard({ user }: UserDetailCardProps) {
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
      <Badge className={roleColors[role]}>
        <Icon className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getRoleBadge(user.role)}
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm font-mono">{user.email}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Role:</span>
              {getRoleBadge(user.role)}
            </div>
            
            <div className="flex items-center space-x-2">
              {user.emailVerified ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Joined:</span>
              <span className="text-sm">
                {format(new Date(user.createdAt), "MMM dd, yyyy 'at' h:mm a")}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="text-sm">
                {format(new Date(user.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">User Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>User ID: {user.id}</div>
            <div>Email Verified: {user.emailVerified ? "Yes" : "No"}</div>
            <div>Profile Image: {user.image ? "Set" : "Not set"}</div>
            <div>Account Type: {user.role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
