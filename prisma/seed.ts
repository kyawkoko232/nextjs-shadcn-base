import { PrismaClient, Role } from "@prisma/client";
import { hash } from "argon2";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (in reverse order of dependencies)
  console.log("🧹 Cleaning existing data...");
  await prisma.invitation.deleteMany();
  await prisma.member.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // Create users with different roles
  console.log("👥 Creating users...");
  
  const password = "asdffdsa";
  const hashedPassword = await hash(password);

  // Create users
  const users = await Promise.all([
    // Organization Owner
    prisma.user.create({
      data: {
        id: randomUUID(),
        name: "John Owner",
        email: "owner@example.com",
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    // Organization Admin
    prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Jane Admin",
        email: "admin@example.com",
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    // Organization Member
    prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Bob Member",
        email: "member@example.com",
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=member",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    // Another Member
    prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Alice Developer",
        email: "alice@example.com",
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    // User without organization
    prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Charlie Solo",
        email: "charlie@example.com",
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Create accounts with passwords for all users
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );

  // Create organizations
  console.log("🏢 Creating organizations...");
  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        id: randomUUID(),
        name: "Acme Corporation",
        slug: "acme-corp",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=AC",
        createdAt: new Date(),
        metadata: JSON.stringify({
          industry: "Technology",
          size: "50-100 employees",
          description: "Leading technology company",
        }),
      },
    }),
    prisma.organization.create({
      data: {
        id: randomUUID(),
        name: "TechStart Inc",
        slug: "techstart",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=TS",
        createdAt: new Date(),
        metadata: JSON.stringify({
          industry: "Startup",
          size: "10-50 employees",
          description: "Innovative startup company",
        }),
      },
    }),
  ]);

  // Create memberships with different roles
  console.log("👥 Creating organization memberships...");
  await Promise.all([
    // Acme Corporation members
    prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[0].id,
        userId: users[0].id, // John Owner
        role: Role.owner,
        createdAt: new Date(),
      },
    }),
    prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[0].id,
        userId: users[1].id, // Jane Admin
        role: Role.admin,
        createdAt: new Date(),
      },
    }),
    prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[0].id,
        userId: users[2].id, // Bob Member
        role: Role.member,
        createdAt: new Date(),
      },
    }),
    prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[0].id,
        userId: users[3].id, // Alice Developer
        role: Role.member,
        createdAt: new Date(),
      },
    }),
    // TechStart Inc members
    prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[1].id,
        userId: users[1].id, // Jane Admin (also admin in TechStart)
        role: Role.owner,
        createdAt: new Date(),
      },
    }),
    prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[1].id,
        userId: users[3].id, // Alice Developer (member in both orgs)
        role: Role.admin,
        createdAt: new Date(),
      },
    }),
  ]);

  // Create some invitations
  console.log("📧 Creating sample invitations...");
  await Promise.all([
    prisma.invitation.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[0].id,
        email: "invited@example.com",
        role: "member",
        status: "pending",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        inviterId: users[0].id, // Invited by John Owner
      },
    }),
    prisma.invitation.create({
      data: {
        id: randomUUID(),
        organizationId: organizations[1].id,
        email: "newdev@example.com",
        role: "admin",
        status: "pending",
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        inviterId: users[1].id, // Invited by Jane Admin
      },
    }),
  ]);

  // Create some verification records
  console.log("✅ Creating verification records...");
  await Promise.all([
    prisma.verification.create({
      data: {
        id: randomUUID(),
        identifier: "email",
        value: "verification-token-1",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`👥 Users created: ${users.length}`);
  console.log(`🏢 Organizations created: ${organizations.length}`);
  console.log(`👥 Memberships created: 6`);
  console.log(`📧 Invitations created: 2`);
  console.log(`✅ Verifications created: 1`);
  
  console.log("\n🔑 Login Credentials (password: asdffdsa):");
  console.log("👑 Owner: owner@example.com");
  console.log("👨‍💼 Admin: admin@example.com");
  console.log("👤 Member: member@example.com");
  console.log("👩‍💻 Developer: alice@example.com");
  console.log("👤 Solo User: charlie@example.com");
  
  console.log("\n🏢 Organizations:");
  console.log("🏢 Acme Corporation (acme-corp) - 4 members");
  console.log("🚀 TechStart Inc (techstart) - 2 members");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
