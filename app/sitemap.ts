import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { getAllThoughts } from "@/lib/thoughts";

const SITE_URL = "https://nisha-rastogi.com";

function parseDate(value: unknown): Date {
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/thoughts", "/photos", "/about"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = getAllProjects().map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    lastModified: parseDate(p.date),
  }));

  const thoughtRoutes = getAllThoughts().map((t) => ({
    url: `${SITE_URL}/thoughts/${t.slug}`,
    lastModified: parseDate(t.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...thoughtRoutes];
}
