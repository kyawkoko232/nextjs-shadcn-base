import { getCurrentUser } from "@/server/users";
import { getAllUsers } from "@/server/users";
import { isAdmin } from "@/server/permissions";
import { redirect } from "next/navigation";
import { UserTable } from "@/components/admin/user-table";
import { UserStats } from "@/components/admin/user-stats";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.adminUsers();

export default async function UsersPage() {
  const { currentUser } = await getCurrentUser();
  const adminCheck = await isAdmin();

  if (!adminCheck.success) {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <UserStats users={users} />
      <UserTable users={users} />
    </div>
  );
}
