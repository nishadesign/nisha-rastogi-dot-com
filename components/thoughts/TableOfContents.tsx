"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector(".prose-thoughts");
    if (!article) return;

    const nodes = Array.from(
      article.querySelectorAll("h2, h3")
    ) as HTMLHeadingElement[];

    const list: Heading[] = nodes.map((node) => {
      const text = node.textContent ?? "";
      let id = node.id;
      if (!id) {
        id = slugify(text);
        node.id = id;
      }
      return {
        id,
        text,
        level: node.tagName === "H2" ? 2 : 3,
      };
    });

    setHeadings(list);

    if (list.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Pick the topmost visible heading
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topmost.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-32 hidden desktop:block"
    >
      <ul className="flex flex-col gap-3">
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.level === 3 ? "pl-4" : undefined}
          >
            <a
              href={`#${h.id}`}
              className="text-caption leading-tight transition-colors duration-150 ease-out inline-block"
              style={{
                color:
                  activeId === h.id
                    ? "var(--color-content)"
                    : "var(--color-muted)",
                opacity: activeId === h.id ? 1 : 0.7,
              }}
              onMouseEnter={(e) => {
                if (activeId !== h.id) {
                  e.currentTarget.style.color = "var(--color-content)";
                  e.currentTarget.style.opacity = "1";
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== h.id) {
                  e.currentTarget.style.color = "var(--color-muted)";
                  e.currentTarget.style.opacity = "0.7";
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
