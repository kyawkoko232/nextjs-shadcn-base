import { PrismaClient, Role } from "@prisma/client";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log("👥 Creating users...");

  const password = "asdffdsa";
  const hashedPassword = await hash(password);

  // Create users
  const users = await Promise.all([
    // Super Admin
    prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Super Admin",
        email: "superadmin@example.com",
        emailVerified: true,
        image: faker.image.avatar(),
        role: Role.superAdmin,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    }),
    // Admin
    prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Admin User",
        email: "admin@example.com",
        emailVerified: true,
        image: faker.image.avatar(),
        role: Role.admin,
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      },
    }),
    // Authors
    ...Array.from({ length: 5 }, () =>
      prisma.user.create({
        data: {
          id: randomUUID(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          emailVerified: true,
          image: faker.image.avatar(),
          role: Role.author,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      })
    ),
    // Members
    ...Array.from({ length: 10 }, () =>
      prisma.user.create({
        data: {
          id: randomUUID(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          emailVerified: faker.datatype.boolean(),
          image: faker.image.avatar(),
          role: Role.member,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      })
    ),
  ]);

  // Create accounts with passwords
  console.log("🔐 Creating user accounts with passwords...");
  await Promise.all(
    users.map((user) =>
      prisma.account.create({
        data: {
          id: randomUUID(),
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: hashedPassword,
          createdAt: user.createdAt,
          updatedAt: new Date(),
        },
      })
    )
  );

  console.log(`✅ Created ${users.length} users`);
  return users;
}
