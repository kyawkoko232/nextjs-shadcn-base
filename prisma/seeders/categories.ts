import { PrismaClient } from "@prisma/client";
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

export async function seedCategories() {
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

  console.log(`✅ Created ${createdCategories.length} categories`);
  return createdCategories;
}
