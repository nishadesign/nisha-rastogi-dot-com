# Portfolio spec — nisha-rastogi.com v2

> Reverse-engineered from gabrielvaldivia.com (Next.js + Tailwind 4, also Payload CMS but we don't need that). This is the structure-like-gabriel spec — copy is yours, palette is monochrome, content is yours, structure is his.

---

## 1. Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind 4 + layered CSS custom properties (tokens)
- **Content:** MDX for projects + writing (`@next/mdx`)
- **Motion:** `motion` (Framer Motion) — restrained, page-transition fades
- **Hosting:** Vercel
- **Image optimization:** `next/image`

Why Next.js: SSG out of the box (SEO problem solved), MDX-friendly for case studies, Vercel-native deploy.

---

## 2. Token system (layered, gabriel-equivalent)

Three layers, all CSS custom properties:

### Layer 1 — primitives (`styles/tokens/primitives.css`)
Raw values only. No semantics.

```css
:root {
  /* Colors — pure values */
  --color-black: #000;
  --color-white: #fff;

  /* Type scale */
  --font-body: "Inter", system-ui, sans-serif;
  --font-heading: "Inter Display", "Inter", system-ui, sans-serif;
  --font-mono: "SF Mono", "Fira Code", ui-monospace, monospace;

  /* Spacing primitive */
  --spacing: 0.25rem; /* 4px base unit; tw uses spacing*N */

  /* Radius */
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;

  /* Motion */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Layer 2 — semantic (`styles/tokens/semantic.css`)
Intent-named. **All components read from this layer only.** Light + dark mode.

```css
:root {
  /* Light mode (default) — grey page, white cards */
  --color-content-rgb: 0 0 0;            /* primary text */
  --color-muted-rgb: 0 0 0 / 0.6;        /* secondary text */
  --color-background-rgb: 245 245 245;   /* page bg — light grey #F5F5F5 */
  --color-background-alt-rgb: 255 255 255; /* card bg — pure white */
  --color-background-alt-hover-rgb: 255 255 255;
  --color-border-rgb: 0 0 0 / 0.05;
  --color-border-strong-rgb: 0 0 0 / 0.2;
  --color-elevated-rgb: 255 255 255;
  --color-floating-rgb: 255 255 255 / 0.7; /* nav/popover bg */
  --color-inverse-rgb: 255 255 255;

  /* Accent slot — wired but disabled (points to content) */
  --color-accent-rgb: var(--color-content-rgb);

  --color-content: rgb(var(--color-content-rgb));
  --color-muted: rgb(var(--color-muted-rgb));
  --color-background: rgb(var(--color-background-rgb));
  --color-background-alt: rgb(var(--color-background-alt-rgb));
  --color-background-alt-hover: rgb(var(--color-background-alt-hover-rgb));
  --color-border: rgb(var(--color-border-rgb));
  --color-border-strong: rgb(var(--color-border-strong-rgb));
  --color-elevated: rgb(var(--color-elevated-rgb));
  --color-floating: rgb(var(--color-floating-rgb));
  --color-inverse: rgb(var(--color-inverse-rgb));
  --color-accent: rgb(var(--color-accent-rgb));
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-content-rgb: 255 255 255;
    --color-muted-rgb: 255 255 255 / 0.7;
    --color-background-rgb: 0 0 0;
    --color-background-alt-rgb: 255 255 255 / 0.1;
    --color-background-alt-hover-rgb: 255 255 255 / 0.15;
    --color-border-rgb: 255 255 255 / 0.2;
    --color-border-strong-rgb: 255 255 255 / 0.2;
    --color-elevated-rgb: 31 31 31;
    --color-floating-rgb: 64 64 64 / 0.6;
    --color-inverse-rgb: 0 0 0;
  }
}
```

### Layer 3 — components (`styles/tokens/components.css`)
Component-specific, optional. Only when a component needs its own token (e.g., button padding, card radius). Reads from semantic layer.

---

## 3. Typography (gabriel-exact)

Heading family: **Inter Display** (variable, free, Google Fonts). Body: **Inter**. Mono: system mono stack.

| Tag | Mobile (≤810px) | Tablet (810px+) | Desktop (1280px+) | Tracking | Weight | Line-height |
|---|---|---|---|---|---|---|
| h1 | 34px | 60px | 100px | -0.04em | 400 | 1.1 |
| h2 | 28px | 36px | 48px | -0.02em | 400 | 1.3 |
| h3 | 22px | 26px | 30px | -0.03em | 400 | 1.3 |
| h4 | clamp(20, 2vw, 24)px | — | — | -0.3px | 400 | 1.3 |
| h5 | (var --text-h5) | — | — | -0.02em | 500 | 1.3 |
| h6 | 13px | 14px | 14px | -0.03em | 400 | 1.2 |

Special on h6: `font-family: var(--font-mono); text-transform: uppercase`. **This is how meta strip labels (TEAM, SERVICES, DATE) render.**

### Body sizes

| Class | Mobile | Tablet | Desktop |
|---|---|---|---|
| `.text-body` | 16px | 18px | 20px |
| `.text-body-large` | 18px | 22px | 26px |
| `.text-body-xl` | 18px | 24px | 36px |
| `.text-caption` | 14px | 15px | 16px |

Body letter-spacing: -0.01em. Line-height: 1.4.

### Body element

```css
html { font-family: var(--font-body); color: var(--color-content); background: var(--color-background); -webkit-font-smoothing: antialiased; }
body { letter-spacing: -0.01em; line-height: 1.4; font-size: 16px; }
@media (min-width: 810px) { body { font-size: 18px } }
@media (min-width: 1280px) { body { font-size: var(--text-body) } }
```

---

## 4. Spacing & layout

Container: `max-w-[1400px] mx-auto px-5 tablet:px-10`.

Breakpoints (gabriel uses these):
- `tablet:` `≥ 810px`
- `desktop:` `≥ 1280px`

Section vertical rhythm: `gap-20` (80px) between major sections on desktop, `flex-col gap-20` is the page-level pattern.

Project case study grid: `grid grid-cols-1 desktop:grid-cols-6 desktop:grid-flow-dense gap-5 tablet:gap-10` — **6-column grid where individual content blocks span 1, 2, 3, 4, or 6 columns and 1–4 rows.** This is the bento pattern that makes case studies feel cinematic without requiring custom layouts per project.

Standard block sizes used on Daylight:
- `desktop:col-span-3 desktop:row-span-3` — square block
- `desktop:col-span-6 desktop:row-span-3` — wide-3
- `desktop:col-span-6 desktop:row-span-4` — wide-4 (tall hero or feature image)
- `desktop:col-span-2`, `desktop:col-span-4` — medium variants

Block padding: `bg-background-alt p-5 tablet:p-8 desktop:p-10` for **content blocks with text inside**. Image blocks have no padding (image fills container).

Block corner radius: `rounded-[14px] tablet:rounded-[20px] desktop:rounded-[30px]` — gets rounder at larger viewports. This is one of gabriel's signature moves.

---

## 5. Site architecture

### Pages (only what we're building tonight)

| Route | Purpose |
|---|---|
| `/` | Home — intro, work cards (preview of top projects), connect |
| `/work` | All projects index |
| `/work/[slug]` | Project detail page |

(About + Thoughts deferred per Nisha's instruction.)

### Navigation

Sticky top-right pill nav (gabriel pattern): `fixed top-0 right-0 z-50 hidden tablet:block p-10`. Mobile: hamburger.

Nav items: **Home · Work**. (No About, Thoughts, Chat, Playground, Clients, People for now — keep tight.)

Active item: `text-content opacity-100`. Inactive: `text-content opacity-30 hover:opacity-100`. Transition: `transition-all`.

### Page transition

```css
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-transition {
  animation: fadeInUp 0.5s ease-out both;
}
```

Wrap each page's main content in `<main className="page-transition">`.

---

## 6. Home page structure

Top-to-bottom (matches gabriel's home):

1. **Sticky nav** (top-right pill)
2. **Site title** — "Nisha Rastogi" — h1-style on left, persistent (also acts as home logo)
3. **Hero / positioning H1** — single confident line. Massive: `text-[34px] tablet:text-[60px] desktop:text-[100px]`. e.g. *"Founding designer for AI-native products."* `[CONFIRM]`
4. **Featured Work** — 5–6 project cards in a bento grid (mix of tall + wide + square, like gabriel's home). Each card has:
   - Project image/video (filling card)
   - Project name (h3)
   - One-line tagline (text-caption muted)
   - Hover: scale slightly, opacity reveal
5. **Connect** — short paragraph + email + LinkedIn + GitHub links
6. **Footer** — minimal

For the bento layout on the home, see `components/sections/featured-work.tsx`.

---

## 7. Project detail page structure

Reverse-engineered from /work/daylight:

1. **Sticky nav** (same as home)
2. **Site title** ("Nisha Rastogi") in same position
3. **Project H1** — `<h1>` with project title — uses default h1 sizing (34/60/100)
4. **Description paragraph** — sits directly under H1, no section heading. `text-body` muted-ish. Sets up the project in 2–4 sentences.
5. **Meta strip** — three columns, each with:
   - h6 mono uppercase label (TEAM / SERVICES / DATE)
   - Body content (people names / service tags / year)

   Layout: `flex gap-10 items-start` with `w-[50px] tablet:w-[100px] shrink-0 text-muted` left column for label, content right.
6. **Bento content grid** — `grid grid-cols-1 desktop:grid-cols-6 desktop:grid-flow-dense gap-5 tablet:gap-10`. Each block is one of:
   - **Text block**: heading (h3) + body paragraph(s). Padding p-5/p-8/p-10. Background `bg-background-alt`.
   - **Image block**: full-bleed image, fills the container, no padding.
   - **Video block**: looping video, no controls, no audio.
7. **Footer**

Each block individually controls col-span and row-span via MDX frontmatter (or component props in MDX body).

---

## 8. MDX content structure

### Project file shape: `content/projects/[slug].mdx`

```mdx
---
title: Data Library for Agentforce
slug: data-library
description: A workflow that turns messy enterprise data into reliable, production-ready context for AI agents.
team:
  - Sameer Vaidya
  - Sybil Shim
  - Chang Lu
  - Monil Sanghvi
services:
  - Product Design
  - Strategy
date: 2025
hero:
  src: /images/projects/data-library/hero.png
  alt: Data Library hero
order: 1                      # display order on home (lower = earlier)
featured: true                # show on home page bento
homeBlock:
  colSpan: 6                  # width on home bento (1-6)
  rowSpan: 3                  # height on home bento (1-4)
---

<Block colSpan={6} rowSpan={3} variant="text">
  ## Problem

  The MVP connected enterprise data to AI agents, but admins didn't trust it — resulting in a poor user confidence rating of **2.9/7**. When an agent hallucinated, admins couldn't tell whether the issue was the data, the pipeline, or the model.
</Block>

<Block colSpan={6} rowSpan={4} variant="image">
  <Media src="/images/projects/data-library/lifecycle.png" alt="Data lifecycle diagram" />
</Block>

<Block colSpan={3} rowSpan={3} variant="text">
  ## Reframe

  I reframed the product from "connects data to AI" to a knowledge base for agents — structured around the questions admins actually ask: Connect, Process, Test & Validate, Deploy & Monitor.
</Block>

<Block colSpan={3} rowSpan={3} variant="image">
  <Media src="/images/projects/data-library/connect.png" alt="Connect step" />
</Block>

<Block colSpan={6} rowSpan={3} variant="text">
  ## Impact

  - **2.9 → 6.2 / 7** user confidence after redesign
  - **40% reduction** in customer support cases
  - **~80% increase** in product adoption
</Block>
```

### Data files

```
data/
├── profile.ts          # name, links, contact
├── nav.ts              # nav items
└── home.ts             # home page copy (positioning H1, connect blurb)
```

---

## 9. Components (build list)

### Layout
- `components/layout/Nav.tsx` — sticky top-right pill nav, mobile hamburger
- `components/layout/SiteTitle.tsx` — "Nisha Rastogi" persistent h1
- `components/layout/Footer.tsx` — minimal
- `components/layout/PageWrapper.tsx` — wraps every page with the page-transition animation

### Home sections
- `components/home/Hero.tsx` — positioning H1
- `components/home/FeaturedWork.tsx` — bento grid of featured projects
- `components/home/ProjectCard.tsx` — single card (image + title + tagline)
- `components/home/Connect.tsx` — connect block

### Project detail sections
- `components/project/ProjectHero.tsx` — title + description
- `components/project/MetaStrip.tsx` — TEAM / SERVICES / DATE
- `components/project/ContentGrid.tsx` — bento grid wrapper
- `components/project/Block.tsx` — single bento block (text or media)
- `components/project/Media.tsx` — image or video, infers from extension

### Primitives
- `components/ui/Pill.tsx` — service tags (mono caps with border)
- `components/ui/Link.tsx` — opacity hover link

### MDX components (registered in `mdx-components.tsx`)
- `Block` — bento block with col/row span
- `Media` — auto image/video
- (h1-h6, p, ul, ol, etc. inherit from Tailwind base)

---

## 10. Motion

Gabriel uses three motion patterns, period:

1. **Page enter** — `fadeInUp` 0.5s on `.page-transition` wrap
2. **Hover scale** — `group-hover:scale-[1.03]` on cards, `transition-transform` on the inner wrapper, ease-out 0.3s
3. **Opacity hover** — links + nav items go from opacity-30/50 → opacity-100, transition-all, default duration

That's it. No scroll reveals, no parallax, no glitch. Discipline.

```css
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0, 0, 0.2, 1); transition-duration: 150ms; }
.group:hover .scale-[1.03] { scale: 1.03 }
```

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 11. SEO + meta

Every page:
- `<title>` — page-specific
- `<meta name="description">` — page-specific
- `<meta property="og:image">` — page hero (1200×630 minimum)
- `<meta property="og:title">` — same as `<title>`
- `<meta property="og:description">` — same as description

Use Next.js `generateMetadata` per route. Project pages pull from MDX frontmatter.

**This single change fixes the SEO blackout problem the current site has.**

---

## 12. Images

- Use `next/image` with `fill` mode inside aspect-ratio'd containers
- All project images live in `public/images/projects/[slug]/`
- Naming: `hero.{png,jpg,mp4}`, then descriptive: `connect.png`, `lifecycle.png`, etc.
- `loading="lazy"` for everything except hero (use `priority` for hero on detail page)

---

## 13. Differentiator from gabriel

**Two specific places this is yours, not his:**

1. **Monochrome palette, grey page, white cards.** Gabriel's accent is acid blue (`rgb(0, 31, 235)` light / `rgb(0, 157, 255)` dark) on a pure-white page. Yours is no-accent (`--color-accent` aliased to `--color-content`) on a light grey page (`#F5F5F5`) with white cards/blocks/media frames. The grey-vs-white contrast is the layered system; no chromatic accent ever appears.

2. **`<em>` two-tone display headings.** When prose uses `<em>some words</em>` inside an h1/h2/h3, the emphasized words pop in solid black while the surrounding text drops to muted. This is a Wispr-style treatment from your old `design.md` — it's *your* signature. Gabriel doesn't do this.

   ```css
   h1, h2, h3 {
     color: var(--color-muted);
   }
   h1 em, h2 em, h3 em {
     color: var(--color-content);
     font-style: normal;
   }
   ```

   Use it sparingly: positioning H1, key project headers. Do **not** use everywhere.

---

## 14. What's deferred (not building tonight)

- About page (Life as a timeline)
- Thoughts page
- Chat / AI assistant on contact (gabriel-specific, not copying)
- Playground / Clients / People sections (gabriel-specific)
- Dark mode toggle (auto via prefers-color-scheme works for v1)
- Testimonials section (data exists from old repo — wire in next iteration)
- Capabilities chips
- Numbered Approach principles

---

## 15. CONFIRM list (decisions I'm making for Nisha while she sleeps)

These are flagged for review in `MORNING_NOTES.md`:

1. **[CONFIRM]** Positioning H1 line. Default: *"Founding designer for AI-native products."* — alt-1: *"Product designer for AI-native products."* — alt-2: a sharper line we workshop in the morning.
2. **[CONFIRM]** Featured project order on home: 1) Data Library, 2) Patch, 3) Agent Builder, 4) Bots to Agents, 5) Wish Fashion. (Skipping Bloom — it's "work in progress." Skipping Ojas — too old.)
3. **[CONFIRM]** Project taglines on home cards. Reusing existing taglines from the old `projects.json` for all but Data Library, where I'll write a sharper one ("A knowledge base for AI agents that admins actually trust").
4. **[CONFIRM]** Hero positioning vs Title positioning. Gabriel keeps "Gabriel Valdivia" as a separate H1 above the project content. We do the same: persistent "Nisha Rastogi" site title, then below it the work cards on home / project H1 on detail.
5. **[CONFIRM]** Auto dark mode (prefers-color-scheme) for v1. No manual toggle.
6. **[CONFIRM]** Connect section copy: "I'm building enterprise AI products at Salesforce. Looking for what's next." + email link + LinkedIn + GitHub. Placeholder until you write yours.
7. **[CONFIRM]** "Founding designer" vs "Product designer" framing. Defaulting to "Founding designer" since that's the role we discussed targeting. Easy to change.
