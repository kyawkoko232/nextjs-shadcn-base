import { getCurrentUser } from "@/server/users";
import { UserStats } from "@/components/user-stats";
import { UserProfile } from "@/components/user-profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.dashboard();

export default async function Dashboard() {
  const { currentUser } = await getCurrentUser();

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

      <UserStats user={currentUser} />
      <UserProfile user={currentUser} />
    </div>
  );
}
