import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="container-shell pt-20 pb-32 tablet:pb-40">
      <div
        className="flex flex-wrap gap-6 text-caption"
        style={{ color: "var(--color-muted)" }}
      >
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a
          href={`mailto:${profile.email}`}
          className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
        >
          Email
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
        >
          LinkedIn
        </a>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-[3px] transition-opacity duration-150 ease-out hover:opacity-60"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
