import { PrismaClient, PostStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedPosts(users: any[], categories: any[], tags: any[]) {
  console.log("📝 Creating posts...");
  
  const posts = await Promise.all(
    Array.from({ length: 50 }, async () => {
      const author = faker.helpers.arrayElement(users.filter(u => u.role === 'author' || u.role === 'admin' || u.role === 'superAdmin'));
      const category = faker.helpers.arrayElement(categories);
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

  console.log(`✅ Created ${posts.length} posts`);
  return posts;
}

export async function seedPostTags(posts: any[], tags: any[]) {
  console.log("🔗 Creating post-tag relationships...");
  
  for (const post of posts) {
    const numberOfTags = faker.number.int({ min: 1, max: 5 });
    const selectedTags = faker.helpers.arrayElements(tags, numberOfTags);
    
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

  console.log("✅ Created post-tag relationships");
}
