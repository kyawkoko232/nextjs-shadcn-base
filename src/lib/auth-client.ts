import { createAuthClient } from "better-auth/react"
import {
  lastLoginMethodClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  plugins: [lastLoginMethodClient()],
});

export const { signIn, signUp, useSession } = authClient