import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface AuthRedirectProps {
  redirectTo?: string;
}

export async function AuthRedirect({ redirectTo = "/dashboard" }: AuthRedirectProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect(redirectTo);
  }

  return null;
}
