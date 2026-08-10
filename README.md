# nisha-rastogi.com

Personal portfolio for Nisha Rastogi — product designer at Salesforce, working on Agentforce.

Built with Next.js 15, TypeScript, Tailwind 4, and MDX.

## Live site

Deployed on Vercel.

## Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind 4 with layered CSS custom properties (primitives → semantic → components)
- **Content:** MDX for projects + thoughts (`@next/mdx` + `remark-frontmatter`)
- **Motion:** `motion` (Framer Motion) for fade-in scroll animations
- **Icons:** `lucide-react`
- **Hosting:** Vercel

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
nisha-rastogi-dotcom/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home
│   ├── about/                    # About + timeline
│   ├── work/                     # Project detail pages
│   └── thoughts/                 # Writing index + detail
│
├── components/
│   ├── layout/                   # TopBrand, BottomNav, Footer, PageWrapper
│   ├── home/                     # Gallery wall and custom gallery cards
│   ├── project/                  # Carousel, Media, MetaStrip, ContentGrid
│   ├── about/                    # Timeline
│   ├── thoughts/                 # TableOfContents
│   └── ui/                       # FadeIn (shared scroll animation)
│
├── content/
│   ├── projects/                 # MDX case studies
│   └── thoughts/                 # MDX articles
│
├── data/
│   ├── profile.ts                # Name, links, positioning H1, bio copy
│   ├── nav.ts                    # Nav items
│   └── timeline.ts               # About-page timeline entries
│
├── lib/
│   ├── projects.ts               # MDX frontmatter loader for projects
│   └── thoughts.ts               # MDX frontmatter loader for thoughts
│
├── styles/
│   └── tokens/                   # primitives.css, semantic.css, components.css
│
├── public/
│   └── images/                   # All static media (organized by section)
│
└── types/
    ├── project.ts
    └── thought.ts
```

## Adding a new project

1. Create `content/projects/your-slug.mdx`.
2. Drop assets into `public/images/projects/your-slug/`.
3. Fill in the frontmatter:

```yaml
---
title: Project name
slug: your-slug
description: Two-sentence summary that opens the case study.
tagline: Optional short project line.
team:
  - Person 1, Person 2
date: "Aug 2024 – Dec 2024"
hero:
  src: /images/projects/your-slug/hero.mp4    # detail page top
  alt: Hero alt text
order: 1            # display order; lower = earlier
releaseNotes:        # optional
  href: https://...
  label: View release notes →
---
```

4. Write the case study body using `<Block>` and `<Media>` MDX components.

### Block layout

```mdx
<Block colSpan={6} rowSpan={1} variant="text">
  <div className="flex flex-col gap-4">
    <h2>Section heading</h2>
    <p>Body paragraph.</p>
  </div>
</Block>

<Block colSpan={6} rowSpan={4} variant="media" aspectRatio={1.6}>
  <Media src="/images/projects/your-slug/screen.mp4" alt="Screen" fit="contain" />
</Block>

<SectionBreak />
```

`variant="text"` = padded card with prose. `variant="media"` = image or video frame.

`<Media>` auto-detects videos by extension (`.mp4`, `.webm`, `.mov`).

`fit="cover"` (default) crops to fill the frame. `fit="contain"` shows the whole asset, centered, with the white card backdrop visible around it.

`<SectionBreak />` adds extra vertical breathing room between major sections.

## Adding a new thought / article

1. Create `content/thoughts/your-slug.mdx`.
2. Drop images into `public/images/thoughts/your-slug/`.
3. Fill in the frontmatter:

```yaml
---
title: Article title
slug: your-slug
date: "2026-05"             # YYYY-MM sorts correctly
description: One-line summary.
---
```

4. Write the body in markdown — paragraphs, headings (`##`, `###`), lists, blockquotes, links, and images all render with the article styling.

The TOC sidebar auto-extracts every `<h2>` and `<h3>` heading and tracks the active section as you scroll.

## Tokens

Three layers in `styles/tokens/`:

- `primitives.css` — raw values (colors, fonts, spacing, motion). Don't read directly from components.
- `semantic.css` — intent-named (`--color-content`, `--color-background`, etc). **Components read from here.**
- `components.css` — component-specific tokens.

Light mode: page is light grey (`#F5F5F5`); cards / media frames are pure white. Dark mode flips this with appropriate elevations.

## Deploy

Vercel detects Next.js automatically. Push to `main`, deploy.
