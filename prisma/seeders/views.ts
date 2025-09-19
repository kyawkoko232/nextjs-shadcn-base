import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedPostViews(users: any[], posts: any[]) {
  console.log("👀 Creating post views...");
  
  const publishedPosts = posts.filter(p => p.status === 'published');
  let viewCount = 0;
  
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
      viewCount++;
    }
  }

  console.log(`✅ Created ${viewCount} post views`);
}
