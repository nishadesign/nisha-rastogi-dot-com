// The home gallery wall is a curated list of media tiles. Each tile shows its
// own video/image and opens a project overlay via `project` (the slug). Multiple
// tiles may point to the same project — the wall is just a set of project videos.

export type GalleryTile = {
  /** Unique id for React keys (tiles can repeat a project). */
  id: string;
  /** Project slug this tile opens in the overlay. */
  project: string;
  src?: string;
  /** Optional HEVC copy, offered ahead of `src`. Only worth adding where H.264
   *  cannot carry the clip at full size — see scripts/encode-videos.mjs. */
  hevc?: string;
  alt: string;
  poster?: string;
  aspect: string;
  fit?: "cover" | "contain";
  /** Render a custom interactive component instead of media. */
  component?: "multi-language" | "bio";
};

export const galleryTiles: GalleryTile[] = [
  {
    id: "bio-card",
    project: "bio",
    alt: "Bio card for Nisha Rastogi",
    aspect: "4/5",
    component: "bio",
  },
  {
    id: "data-library-filetree",
    project: "data-library",
    src: "/images/projects/data-library/status card.mp4",
    alt: "Data Library file tree",
    poster: "/images/projects/data-library/lib-home.webp",
    aspect: "4/3",
  },
  {
    id: "bots-to-agents-hero",
    project: "bots-to-agents",
    src: "/images/projects/bots-to-agents/hero.mp4",
    alt: "Bots to Agents",
    poster: "/images/projects/bots-to-agents/cover-bots-to-agents.webp",
    aspect: "4/3",
  },
  {
    id: "shoe-hero",
    project: "shoe",
    src: "/images/projects/shoe/shoe.mp4",
    alt: "Shoe",
    poster: "/images/projects/shoe/shoe.webp",
    aspect: "9/16",
  },
  {
    id: "agent-builder-card",
    project: "agent-builder",
    src: "/images/projects/agent-builder/hero-card.mp4",
    alt: "Agent Builder onboarding flow",
    poster: "/images/projects/agent-builder/hero-card-poster.webp",
    aspect: "5/4",
    fit: "cover",
  },
  {
    id: "multi-language-card",
    project: "multi-language-agents",
    alt: "Multi-language agents",
    aspect: "5/4",
    component: "multi-language",
  },
  {
    id: "patch-landing",
    project: "patch",
    src: "/images/projects/patch/landing-page.mp4",
    alt: "Patch landing page",
    poster: "/images/projects/patch/landing-page-poster.webp",
    aspect: "16/9",
  },
  {
    id: "wish-video-discovery",
    project: "wish-fashion",
    src: "/images/projects/wish-fashion/video-based.mp4",
    hevc: "/images/projects/wish-fashion/video-based.hevc.mp4",
    alt: "Wish video-based discovery",
    poster: "/images/projects/wish-fashion/product-description.webp",
    aspect: "9/16",
  },
  {
    id: "homing-hero",
    project: "homing",
    src: "/images/projects/homing/sender.mp4",
    poster: "/images/projects/homing/homing.webp",
    alt: "Homing",
    aspect: "4/3",
  },
];
