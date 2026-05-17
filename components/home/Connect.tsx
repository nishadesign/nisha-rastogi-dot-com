import { profile } from "@/data/profile";

export function Connect() {
  return (
    <section className="container-shell py-16 tablet:py-20 desktop:py-32">
      <div className="flex flex-col gap-8 max-w-[60ch]">
        <h2>Connect</h2>
        <p
          className="text-body-large"
          style={{ color: "var(--color-muted)" }}
        >
          {profile.connect.paragraph}
        </p>
        <div
          className="flex flex-wrap gap-6 text-body"
          style={{ color: "var(--color-content)" }}
        >
          <a
            href={`mailto:${profile.email}`}
            className="underline underline-offset-[3px] transition-opacity hover:opacity-60"
          >
            Email
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-[3px] transition-opacity hover:opacity-60"
          >
            LinkedIn
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-[3px] transition-opacity hover:opacity-60"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
