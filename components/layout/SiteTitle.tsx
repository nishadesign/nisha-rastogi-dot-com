import Link from "next/link";
import { profile } from "@/data/profile";

export function SiteTitle() {
  return (
    <div className="container-shell pt-10 tablet:pt-16 pb-10">
      <Link
        href="/"
        className="inline-block transition-opacity duration-150 ease-out hover:opacity-60"
      >
        <span className="text-body-large" style={{ color: "var(--color-muted)" }}>
          {profile.name}
        </span>
      </Link>
    </div>
  );
}
