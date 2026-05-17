import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ThoughtFrontmatter } from "@/types/thought";

const THOUGHTS_DIR = path.join(process.cwd(), "content", "thoughts");

export function getAllThoughtSlugs(): string[] {
  if (!fs.existsSync(THOUGHTS_DIR)) return [];
  return fs
    .readdirSync(THOUGHTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getThoughtFrontmatter(slug: string): ThoughtFrontmatter | null {
  const filePath = path.join(THOUGHTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return { slug, ...data } as ThoughtFrontmatter;
}

export function getAllThoughts(): ThoughtFrontmatter[] {
  return getAllThoughtSlugs()
    .map(getThoughtFrontmatter)
    .filter((t): t is ThoughtFrontmatter => t !== null)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
