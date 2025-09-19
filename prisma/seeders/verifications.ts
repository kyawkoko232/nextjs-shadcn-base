import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedVerifications() {
  console.log("✅ Creating verification records...");
  
  const verifications = await Promise.all(
    Array.from({ length: 5 }, () =>
      prisma.verification.create({
        data: {
          id: randomUUID(),
          identifier: "email",
          value: faker.string.alphanumeric(32),
          expiresAt: faker.date.future(),
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      })
    )
  );

  console.log(`✅ Created ${verifications.length} verification records`);
  return verifications;
}
