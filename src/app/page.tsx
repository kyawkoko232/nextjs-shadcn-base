import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const metadata = pageMetadata.home();

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <header className="absolute top-0 right-0 flex justify-between items-center p-4 w-full">
        <div></div>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback className="text-xs">
                    {session.user.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">
                  Welcome, {session.user.name}
                </span>
              </div>
              <Link href="/dashboard">
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
          <ModeSwitcher />
        </div>
      </header>
      <div className="flex flex-col gap-5 items-center justify-center h-screen px-5 text-center">
        <Image
          src="/better-auth-starter.png"
          alt="Better Auth"
          width={100}
          height={100}
          className="rounded-lg dark:invert"
        />

        <h1 className="text-4xl font-bold">Better Auth Starter</h1>

        <p className="text-lg">
          This is a starter project for Better Auth. It is a simple project that
          uses Better Auth to authenticate users.
        </p>

        <div className="mt-4">
          {session ? (
            <Link href="/dashboard">
              <Button size="lg">
                <User className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
