import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";
import { pageMetadata } from "@/lib/metadata";
import { AuthRedirect } from "@/components/auth-redirect";

export const metadata = pageMetadata.login();

export default async function LoginPage() {
  return (
    <>
      <AuthRedirect />
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image
                width={50}
                height={50}
                src={"/better-auth-starter.png"}
                alt="Better Auth Starter Logo"
                priority
              />
            </div>
            Better Auth Starter
          </Link>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
