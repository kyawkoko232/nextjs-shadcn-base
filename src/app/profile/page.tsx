import { getCurrentUser } from "@/server/users";
import { UserProfile } from "@/components/user-profile";
import { UserStats } from "@/components/user-stats";
import { ProfileEditForm } from "@/components/forms/profile-edit-form";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.profile();

export default async function ProfilePage() {
  const { currentUser } = await getCurrentUser();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <UserStats user={currentUser} />
      <UserProfile user={currentUser} />
      <ProfileEditForm user={currentUser} />
    </div>
  );
}
