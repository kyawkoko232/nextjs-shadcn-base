import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

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

export async function seedTags() {
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

  console.log(`✅ Created ${createdTags.length} tags`);
  return createdTags;
}
