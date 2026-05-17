import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ProjectFrontmatter } from "@/types/project";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getProjectFrontmatter(slug: string): ProjectFrontmatter | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return { slug, ...data } as ProjectFrontmatter;
}

export function getAllProjects(): ProjectFrontmatter[] {
  return getAllProjectSlugs()
    .map(getProjectFrontmatter)
    .filter((p): p is ProjectFrontmatter => p !== null)
    .sort((a, b) => {
      // Featured/order first, then date desc
      const ao = a.order ?? 999;
      const bo = b.order ?? 999;
      if (ao !== bo) return ao - bo;
      return String(b.date).localeCompare(String(a.date));
    });
}

export function getFeaturedProjects(): ProjectFrontmatter[] {
  return getAllProjects().filter((p) => p.featured);
}
