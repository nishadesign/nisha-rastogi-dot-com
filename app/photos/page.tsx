import type { Metadata } from "next";
import { PhotoWall } from "@/components/photos/PhotoWall";

export const metadata: Metadata = {
  title: "Photos",
  description: "A wall of photographs — moments from places, people, and life.",
};

export default function PhotosPage() {
  return <PhotoWall />;
}
