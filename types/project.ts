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
  cardHero?: {
    src: string;
    alt: string;
    type?: "image" | "video";
    fit?: "cover" | "contain";
    poster?: string;
  };
  order?: number;
  featured?: boolean;
  homeBlock?: {
    colSpan: 1 | 2 | 3 | 4 | 5 | 6;
    rowSpan: 1 | 2 | 3 | 4;
  };
  externalUrl?: string;
  releaseNotes?: {
    label?: string;
    href: string;
  };
};

export type Project = ProjectFrontmatter & {
  // Computed at load time
};
