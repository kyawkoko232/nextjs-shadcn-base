import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/users";
import { isAdmin } from "@/server/permissions";
import { prisma } from "@/db";
import { z } from "zod";
import { hash } from "argon2";
import { randomUUID } from "crypto";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["member", "author", "admin", "superAdmin"]),
  emailVerified: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const { currentUser } = await getCurrentUser();
    const adminCheck = await isAdmin();

    if (!adminCheck.success) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: validatedData.name,
        email: validatedData.email,
        emailVerified: validatedData.emailVerified,
        role: validatedData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create account with password
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
