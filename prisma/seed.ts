import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeders/users";
import { seedCategories } from "./seeders/categories";
import { seedTags } from "./seeders/tags";
import { seedPosts, seedPostTags } from "./seeders/posts";
import { seedComments } from "./seeders/comments";
import { seedPostViews } from "./seeders/views";
import { seedVerifications } from "./seeders/verifications";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (in reverse order of dependencies)
  console.log("🧹 Cleaning existing data...");
  
  // Only delete from tables that exist
  try {
    await prisma.postView.deleteMany();
  } catch (error) {
    console.log("⚠️ postView table doesn't exist, skipping...");
  }
  
  try {
    await prisma.postTag.deleteMany();
  } catch (error) {
    console.log("⚠️ postTag table doesn't exist, skipping...");
  }
  
  try {
    await prisma.comment.deleteMany();
  } catch (error) {
    console.log("⚠️ comment table doesn't exist, skipping...");
  }
  
  try {
    await prisma.post.deleteMany();
  } catch (error) {
    console.log("⚠️ post table doesn't exist, skipping...");
  }
  
  try {
    await prisma.tag.deleteMany();
  } catch (error) {
    console.log("⚠️ tag table doesn't exist, skipping...");
  }
  
  try {
    await prisma.category.deleteMany();
  } catch (error) {
    console.log("⚠️ category table doesn't exist, skipping...");
  }
  
  try {
    await prisma.session.deleteMany();
  } catch (error) {
    console.log("⚠️ session table doesn't exist, skipping...");
  }
  
  try {
    await prisma.account.deleteMany();
  } catch (error) {
    console.log("⚠️ account table doesn't exist, skipping...");
  }
  
  try {
    await prisma.verification.deleteMany();
  } catch (error) {
    console.log("⚠️ verification table doesn't exist, skipping...");
  }
  
  try {
    await prisma.user.deleteMany();
  } catch (error) {
    console.log("⚠️ user table doesn't exist, skipping...");
  }

  // Seed data in order
  const users = await seedUsers();
  const categories = await seedCategories();
  const tags = await seedTags();
  const posts = await seedPosts(users, categories, tags);
  await seedPostTags(posts, tags);
  await seedComments(users, posts);
  await seedPostViews(users, posts);
  await seedVerifications();

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`👥 Users created: ${users.length}`);
  console.log(`📂 Categories created: ${categories.length}`);
  console.log(`🏷️ Tags created: ${tags.length}`);
  console.log(`📝 Posts created: ${posts.length}`);
  console.log(`💬 Comments created: ~${posts.filter(p => p.status === 'published').length * 5} (estimated)`);
  console.log(`👀 Post views created: ~${posts.filter(p => p.status === 'published').length * 50} (estimated)`);
  console.log(`✅ Verifications created: 5`);
  
  console.log("\n🔑 Login Credentials (password: asdffdsa):");
  console.log("👑 Super Admin: superadmin@example.com");
  console.log("👨‍💼 Admin: admin@example.com");
  console.log("👤 Authors: 5 random authors");
  console.log("👤 Members: 10 random members");
  
  console.log("\n📂 Categories:");
  categories.forEach(cat => console.log(`📂 ${cat.name} (${cat.slug})`));
  
  console.log("\n🏷️ Sample Tags:");
  tags.slice(0, 10).forEach(tag => console.log(`🏷️ ${tag.name}`));
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });