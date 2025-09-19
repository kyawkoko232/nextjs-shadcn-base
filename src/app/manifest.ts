import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js Blog App",
    short_name: "Blog App",
    description: "A modern blog application built with Next.js, TypeScript, and Tailwind CSS",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["blog", "news", "entertainment"],
    lang: "en",
    orientation: "portrait-primary",
    scope: "/",
  };
}
