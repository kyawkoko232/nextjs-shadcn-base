import { Metadata } from "next";

interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const defaultMetadata: MetadataConfig = {
  title: "Next.js Blog App",
  description: "A modern blog application built with Next.js, TypeScript, and Tailwind CSS",
  keywords: ["blog", "nextjs", "typescript", "tailwind", "react"],
  image: "/og-image.jpg",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  type: "website",
};

export function generateMetadata(config: Partial<MetadataConfig> = {}): Metadata {
  const metadata = { ...defaultMetadata, ...config };
  
  return {
    title: {
      default: metadata.title,
      template: `%s | ${defaultMetadata.title}`,
    },
    description: metadata.description,
    keywords: metadata.keywords?.join(", "),
    authors: metadata.author ? [{ name: metadata.author }] : undefined,
    creator: metadata.author,
    publisher: defaultMetadata.title,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(metadata.url!),
    alternates: {
      canonical: metadata.url,
    },
    openGraph: {
      type: metadata.type,
      locale: "en_US",
      url: metadata.url,
      title: metadata.title,
      description: metadata.description,
      siteName: defaultMetadata.title,
      images: metadata.image ? [
        {
          url: metadata.image,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ] : undefined,
      ...(metadata.publishedTime && { publishedTime: metadata.publishedTime }),
      ...(metadata.modifiedTime && { modifiedTime: metadata.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: metadata.image ? [metadata.image] : undefined,
      creator: metadata.author ? `@${metadata.author.toLowerCase().replace(/\s+/g, '')}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

// Predefined metadata for common pages
export const pageMetadata = {
  home: () => generateMetadata({
    title: "Home",
    description: "Welcome to our modern blog platform. Discover amazing articles, tutorials, and insights.",
  }),
  
  dashboard: () => generateMetadata({
    title: "Dashboard",
    description: "Your personal dashboard. View your profile, stats, and manage your account.",
  }),
  
  profile: () => generateMetadata({
    title: "Profile",
    description: "Manage your profile information, update your details, and view your activity.",
  }),
  
  login: () => generateMetadata({
    title: "Login",
    description: "Sign in to your account to access your dashboard and personalized content.",
  }),
  
  signup: () => generateMetadata({
    title: "Sign Up",
    description: "Create a new account to join our community and start your journey.",
  }),
  
  forgotPassword: () => generateMetadata({
    title: "Forgot Password",
    description: "Reset your password to regain access to your account.",
  }),
  
  resetPassword: () => generateMetadata({
    title: "Reset Password",
    description: "Set a new password for your account.",
  }),
  
  adminUsers: () => generateMetadata({
    title: "User Management",
    description: "Admin panel for managing users, roles, and permissions.",
  }),
  
  post: (title: string, description: string, author?: string, publishedTime?: string) => 
    generateMetadata({
      title,
      description,
      author,
      publishedTime,
      type: "article",
      image: "/og-post.jpg",
    }),
  
  category: (name: string, description: string) => 
    generateMetadata({
      title: `${name} Articles`,
      description: `Explore articles and posts in the ${name} category. ${description}`,
    }),
  
  tag: (name: string) => 
    generateMetadata({
      title: `#${name}`,
      description: `Articles and posts tagged with ${name}. Discover related content and insights.`,
    }),
};
