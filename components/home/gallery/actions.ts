"use server";

import { getAllProjectSlugs, getProjectFrontmatter } from "@/lib/projects";

export async function getGalleryProjectDetail(slug: string) {
  if (slug === "bio" || !getAllProjectSlugs().includes(slug)) {
    return null;
  }

  return getProjectFrontmatter(slug);
}
