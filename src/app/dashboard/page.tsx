import { UserProfile } from "@/components/user-profile";
import { pageMetadata } from "@/lib/metadata";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Shield, Activity, Clock } from "lucide-react";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = pageMetadata.dashboard();

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const currentUser = session.user;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.name}!
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Your account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {currentUser.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  User
                </Badge>
                {currentUser.emailVerified && (
                  <Badge variant="default" className="bg-green-500">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Account Stats
            </CardTitle>
            <CardDescription>
              Your account activity and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Email</span>
                </div>
                <Badge variant={currentUser.emailVerified ? "default" : "secondary"}>
                  {currentUser.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Member since</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentUser.createdAt ? format(new Date(currentUser.createdAt), "MMM yyyy") : "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Account Status</span>
                </div>
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors">
                Edit Profile
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors">
                Change Password
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors">
                Account Settings
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Dashboard Content */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              Manage your account and explore features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your personal dashboard. Here you can manage your account settings, 
              view your profile information, and access various features of the application.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
