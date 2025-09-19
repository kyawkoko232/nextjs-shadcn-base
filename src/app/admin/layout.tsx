import { getCurrentUser } from "@/server/users";
import { isAdmin } from "@/server/permissions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = await getCurrentUser();
  const adminCheck = await isAdmin();

  if (!adminCheck.success) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
