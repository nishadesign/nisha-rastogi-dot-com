type MetaStripProps = {
  team?: string[];
  date?: string | number;
  releaseNotes?: {
    label?: string;
    href: string;
  };
};

function MetaItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-10 items-center">
      <h6
        className="w-[50px] tablet:w-[100px] shrink-0"
        style={{ color: "var(--color-muted)" }}
      >
        {label}
      </h6>
      <div className="flex-1 text-body">{children}</div>
    </div>
  );
}

export function MetaStrip({ team, date, releaseNotes }: MetaStripProps) {
  return (
    <div className="flex flex-col gap-5">
      {team && team.length > 0 && (
        <MetaItem label="Team">
          <span>{team.join(", ")}</span>
        </MetaItem>
      )}
      {date && (
        <MetaItem label="Date">
          <span>{date}</span>
        </MetaItem>
      )}
      {releaseNotes?.href && (
        <MetaItem label="Shipped">
          <a
            href={releaseNotes.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full transition-[opacity,transform] duration-150 ease-out hover:opacity-60 active:scale-[0.97] text-caption"
            style={{
              backgroundColor: "var(--color-background-alt)",
              color: "var(--color-content)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "var(--color-border)",
            }}
          >
            {releaseNotes.label ?? "View release notes →"}
          </a>
        </MetaItem>
      )}
    </div>
  );
}
