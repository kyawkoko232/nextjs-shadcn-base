"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const isAdmin = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Get user with role from database
    const { db } = await import("@/db");
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if user has admin or superAdmin role
    const isAdminUser = user.role === 'admin' || user.role === 'superAdmin';
    
    return {
      success: isAdminUser,
      error: isAdminUser ? null : "Insufficient permissions",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error || "Failed to check permissions",
    };
  }
};
