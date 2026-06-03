import { experience } from "@/data/experience";

export function Experience() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <h6>Experience</h6>
      <ul className="flex flex-col gap-3">
        {experience.map((entry) => (
          <li
            key={`${entry.start}-${entry.company}`}
            className="grid grid-cols-[8.5rem_1fr] gap-4 items-baseline"
          >
            <span
              className="font-mono text-caption uppercase tracking-[-0.03em]"
              style={{ color: "var(--color-muted)" }}
            >
              {entry.start} &mdash; {entry.end}
            </span>
            <span
              className="text-body"
              style={{ color: "var(--color-content)" }}
            >
              {entry.role} &middot; {entry.company}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
