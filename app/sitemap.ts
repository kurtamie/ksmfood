import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "http://localhost:3000";

const publicRoutes = [
  "",
  "/about/contact",
  "/about/ksm",
  "/gallery/event",
  "/gallery/menu",
  "/gallery/testimonial",
  "/gallery/video",
  "/services/aqiqah",
  "/services/bento",
  "/services/korporat",
  "/services/pondokan",
  "/services/prasmanan",
  "/services/ricebox",
  "/services/nasi-kotak",
  "/services/snackBox",
  "/services/tumpeng",
  "/services/wedding",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
