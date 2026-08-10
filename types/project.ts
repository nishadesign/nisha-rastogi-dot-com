export type ProjectFrontmatter = {
  title: string;
  slug: string;
  description: string;
  tagline?: string;
  team?: string[];
  services?: string[];
  date: string | number;
  hero?: {
    src: string;
    alt: string;
    type?: "image" | "video";
  };
  /** Optional media list for the detail-page carousel. Falls back to `hero`. */
  gallery?: {
    src: string;
    alt: string;
    poster?: string;
    fit?: "cover" | "contain";
    /** CSS object-position for cropped media, e.g. "top" or "50% 20%". */
    position?: string;
  }[];
  order?: number;
  releaseNotes?: {
    label?: string;
    href: string;
  };
};
