import { PrismaClient, Role, PostStatus } from "@prisma/client";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Human-readable categories
const categories = [
  { name: "Technology", slug: "technology", description: "Latest tech news, reviews, and insights" },
  { name: "Programming", slug: "programming", description: "Coding tutorials, best practices, and programming languages" },
  { name: "Web Development", slug: "web-development", description: "Frontend, backend, and full-stack development" },
  { name: "Mobile Development", slug: "mobile-development", description: "iOS, Android, and cross-platform mobile apps" },
  { name: "Data Science", slug: "data-science", description: "Machine learning, AI, and data analysis" },
  { name: "DevOps", slug: "devops", description: "Deployment, infrastructure, and automation" },
  { name: "Design", slug: "design", description: "UI/UX design, graphics, and user experience" },
  { name: "Business", slug: "business", description: "Startups, entrepreneurship, and business strategies" },
  { name: "Career", slug: "career", description: "Job search, career development, and professional growth" },
  { name: "Tutorials", slug: "tutorials", description: "Step-by-step guides and how-to articles" }
];

// Human-readable tags
const tags = [
  "React", "Vue.js", "Angular", "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust",
  "Node.js", "Express", "Next.js", "Nuxt.js", "Svelte", "Tailwind CSS", "Bootstrap", "Sass", "CSS",
  "HTML5", "Webpack", "Vite", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Firebase",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST API", "Microservices", "Serverless",
  "Machine Learning", "Artificial Intelligence", "Deep Learning", "TensorFlow", "PyTorch", "Pandas",
  "Data Visualization", "Tableau", "Power BI", "Git", "GitHub", "GitLab", "CI/CD", "Agile", "Scrum",
  "Testing", "Jest", "Cypress", "Selenium", "Unit Testing", "Integration Testing", "E2E Testing",
  "Security", "Authentication", "Authorization", "JWT", "OAuth", "SSL", "HTTPS", "Encryption",
  "Performance", "Optimization", "SEO", "Accessibility", "Responsive Design", "Mobile First",
  "Progressive Web App", "PWA", "Web Components", "API Design", "Database Design", "System Design"
];

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

  // Create users with different roles
  console.log("👥 Creating users...");
  
  const password = "asdffdsa";
  const hashedPassword = await hash(password);

  // Create users with different roles
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
          createdAt: user.createdAt,
          updatedAt: new Date(),
        },
      })
    )
  );

  // Create categories
  console.log("📂 Creating categories...");
  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          id: randomUUID(),
          name: category.name,
          slug: category.slug,
          description: category.description,
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      })
    )
  );

  // Create tags
  console.log("🏷️ Creating tags...");
  const createdTags = await Promise.all(
    tags.map((tag) =>
      prisma.tag.create({
        data: {
          id: randomUUID(),
          name: tag,
          slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        },
      })
    )
  );

  // Create posts
  console.log("📝 Creating posts...");
  const posts = await Promise.all(
    Array.from({ length: 50 }, async () => {
      const author = faker.helpers.arrayElement(users.filter(u => u.role === Role.author || u.role === Role.admin || u.role === Role.superAdmin));
      const category = faker.helpers.arrayElement(createdCategories);
      const title = faker.lorem.sentence(faker.number.int({ min: 4, max: 12 }));
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const content = faker.lorem.paragraphs(faker.number.int({ min: 5, max: 20 }));
      const excerpt = faker.lorem.sentence(faker.number.int({ min: 10, max: 30 }));
      const status = faker.helpers.arrayElement(Object.values(PostStatus));
      const publishedAt = status === PostStatus.published ? faker.date.past() : null;

      return prisma.post.create({
        data: {
          id: randomUUID(),
          title,
          slug,
          content,
          excerpt,
          featuredImage: faker.datatype.boolean() ? faker.image.url() : null,
          status,
          publishedAt,
          categoryId: category.id,
          authorId: author.id,
          viewCount: faker.number.int({ min: 0, max: 1000 }),
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        },
      });
    })
  );

  // Create post-tag relationships
  console.log("🔗 Creating post-tag relationships...");
  for (const post of posts) {
    const numberOfTags = faker.number.int({ min: 1, max: 5 });
    const selectedTags = faker.helpers.arrayElements(createdTags, numberOfTags);
    
    await Promise.all(
      selectedTags.map((tag) =>
        prisma.postTag.create({
          data: {
            id: randomUUID(),
            postId: post.id,
            tagId: tag.id,
          },
        })
      )
    );
  }

  // Create comments
  console.log("💬 Creating comments...");
  const publishedPosts = posts.filter(p => p.status === PostStatus.published);
  for (const post of publishedPosts.slice(0, 30)) { // Only comment on first 30 published posts
    const numberOfComments = faker.number.int({ min: 0, max: 10 });
    
    for (let i = 0; i < numberOfComments; i++) {
      const author = faker.helpers.arrayElement(users);
      await prisma.comment.create({
        data: {
          id: randomUUID(),
          content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
          postId: post.id,
          authorId: author.id,
          createdAt: faker.date.between({ from: post.createdAt, to: new Date() }),
          updatedAt: new Date(),
        },
      });
    }
  }

  // Create post views
  console.log("👀 Creating post views...");
  for (const post of publishedPosts) {
    const numberOfViews = faker.number.int({ min: 0, max: 100 });
    
    for (let i = 0; i < numberOfViews; i++) {
      const user = faker.datatype.boolean() ? faker.helpers.arrayElement(users) : null;
      await prisma.postView.create({
        data: {
          id: randomUUID(),
          postId: post.id,
          userId: user?.id,
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          createdAt: faker.date.between({ from: post.createdAt, to: new Date() }),
        },
      });
    }
  }

  // Create some verification records
  console.log("✅ Creating verification records...");
  await Promise.all(
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

  console.log("✅ Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`👥 Users created: ${users.length}`);
  console.log(`📂 Categories created: ${createdCategories.length}`);
  console.log(`🏷️ Tags created: ${createdTags.length}`);
  console.log(`📝 Posts created: ${posts.length}`);
  console.log(`💬 Comments created: ${publishedPosts.length * 5} (estimated)`);
  console.log(`👀 Post views created: ${publishedPosts.length * 50} (estimated)`);
  console.log(`✅ Verifications created: 5`);
  
  console.log("\n🔑 Login Credentials (password: asdffdsa):");
  console.log("👑 Super Admin: superadmin@example.com");
  console.log("👨‍💼 Admin: admin@example.com");
  console.log("👤 Authors: 5 random authors");
  console.log("👤 Members: 10 random members");
  
  console.log("\n📂 Categories:");
  categories.forEach(cat => console.log(`📂 ${cat.name} (${cat.slug})`));
  
  console.log("\n🏷️ Sample Tags:");
  createdTags.slice(0, 10).forEach(tag => console.log(`🏷️ ${tag.name}`));
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });