import { generateMetadata, pageMetadata } from "./metadata";

// Utility function for generating dynamic metadata based on data
export function generateDynamicMetadata(data: {
  type: "post" | "category" | "tag" | "user";
  title: string;
  description: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  url?: string;
}) {
  switch (data.type) {
    case "post":
      return pageMetadata.post(
        data.title,
        data.description,
        data.author,
        data.publishedTime
      );
    
    case "category":
      return pageMetadata.category(data.title, data.description);
    
    case "tag":
      return pageMetadata.tag(data.title);
    
    case "user":
      return generateMetadata({
        title: `${data.title}'s Profile`,
        description: data.description,
        author: data.author,
        type: "profile",
      });
    
    default:
      return generateMetadata({
        title: data.title,
        description: data.description,
      });
  }
}

// Helper function for blog post metadata
export function generatePostMetadata(post: {
  title: string;
  excerpt: string;
  content: string;
  author: { name: string };
  publishedAt: Date | null;
  updatedAt: Date;
  featuredImage?: string | null;
  slug: string;
}) {
  return pageMetadata.post(
    post.title,
    post.excerpt || post.content.slice(0, 160) + "...",
    post.author.name,
    post.publishedAt?.toISOString(),
  );
}

// Helper function for category metadata
export function generateCategoryMetadata(category: {
  name: string;
  description: string;
  slug: string;
}) {
  return pageMetadata.category(category.name, category.description);
}

// Helper function for tag metadata
export function generateTagMetadata(tag: {
  name: string;
  description?: string;
}) {
  return pageMetadata.tag(tag.name);
}
