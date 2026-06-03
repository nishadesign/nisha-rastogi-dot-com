import Link from "next/link";
import { profile } from "@/data/profile";

export function TopBrand() {
  return (
    <header className="fixed top-0 left-0 z-50 px-5 tablet:px-10 pt-6 tablet:pt-8">
      <Link
        href="/"
        className="text-body transition-opacity duration-150 ease-out hover:opacity-60"
        style={{ color: "var(--color-muted)" }}
      >
        {profile.name}
      </Link>
    </header>
  );
}
