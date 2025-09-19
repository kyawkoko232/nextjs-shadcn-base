import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedComments(users: any[], posts: any[]) {
  console.log("💬 Creating comments...");
  
  const publishedPosts = posts.filter(p => p.status === 'published');
  let commentCount = 0;
  
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
      commentCount++;
    }
  }

  console.log(`✅ Created ${commentCount} comments`);
}
