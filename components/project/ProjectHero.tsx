type ProjectHeroProps = {
  title: string;
  description: string;
};

export function ProjectHero({ title, description }: ProjectHeroProps) {
  return (
    <header className="flex flex-col gap-8 tablet:gap-10 pt-6 tablet:pt-10">
      <h1>{title}</h1>
      <p
        className="text-body-large max-w-[60ch]"
        style={{ color: "var(--color-muted)" }}
      >
        {description}
      </p>
    </header>
  );
}
