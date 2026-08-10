"use client";

import { Media } from "@/components/project/Media";
import { MultiLanguageCard } from "@/components/home/MultiLanguageCard";
import type { GalleryTile } from "@/data/gallery";
import type { ProjectFrontmatter } from "@/types/project";
import { BioGalleryCard } from "./BioGalleryCard";

export function GalleryCard({
  tile,
  bioProject,
}: {
  tile: GalleryTile;
  bioProject: ProjectFrontmatter | null;
}) {
  if (tile.component === "bio") {
    return <BioGalleryCard project={bioProject} />;
  }

  return (
    <div
      className="group relative block w-full overflow-hidden block-radius mb-4 tablet:mb-5 transition-transform duration-200 ease-out hover:-translate-y-1"
      style={{ aspectRatio: tile.aspect, backgroundColor: "var(--color-background-alt)" }}
    >
      <div className="absolute inset-0">
        {tile.component === "multi-language" ? (
          <MultiLanguageCard />
        ) : (
          tile.src && (
            <Media
              src={tile.src}
              alt={tile.alt}
              poster={tile.poster}
              fit={tile.fit ?? "cover"}
            />
          )
        )}
      </div>
    </div>
  );
}
