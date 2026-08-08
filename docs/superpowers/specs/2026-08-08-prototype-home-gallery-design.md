# Prototype Home — Gallery Wall + Floating Overlay

**Route:** `/lab/home` (experiment; real `/` untouched)
**Date:** 2026-08-08
**Status:** Approved design, ready for implementation plan

## Concept

A home-page exploration: instead of the current stacked Hero → FeaturedWork → Bio,
the page is a **masonry gallery wall** of animated project cards. Clicking a card
opens a **floating overlay panel** that scales up over the dimmed wall — the gallery
stays visible on all sides. The case study lives inside the panel and scrolls; the
wall waits behind it. No page navigation.

Reference feel: Cosmos/Savee-style masonry moodboard for the wall; Stripe-style
expanding card for the open interaction, but as a **floating panel** (margin on all
sides), not a bottom-anchored sheet.

## Layout — the wall

- **Masonry**: multi-column, varied card heights (Pinterest/moodboard feel).
  - Desktop 3 columns, tablet 2, mobile 1.
  - Column count and gaps use existing spacing tokens.
- **Full-bleed media cards** — each card is primarily its `cardHero` media, with a
  small title label overlaid (bottom-left).
- **Header strip** above the wall: name + live "Open to work" status dot (reuse the
  `status-ping` pattern from `TopBrand`), plus lightweight nav affordance
  (work / writing / about) — matching the minimal top bar shown in mockups.
- Cards sourced from `getAllProjects()`; varied heights driven per-project (see Open
  Questions — likely reuse `homeBlock.rowSpan` or a simple height cycle).

## Card animation

- Cards use **looping video / poster media**, via the existing
  `ProjectFrontmatter.cardHero` field which already supports
  `type: "video"`, `poster`, `fit`.
- Autoplay muted loop, `poster` shown before load / on reduced-motion.
- Respect `prefers-reduced-motion`: fall back to static poster, no autoplay.
- Hover: subtle lift (translateY) + shadow, consistent with existing card hover.
- Projects without video media fall back gracefully to a static image card.

## Interaction — the floating overlay

- Click a card → **floating panel** scales/fades in over a dimmed scrim.
  - **Generous margin** on all four sides — wall clearly visible around it.
  - Rounded corners, drop shadow, white surface.
  - ✕ button top-right; clicking the scrim also closes.
- Motion: scale from ~0.94 → 1 + opacity, ~340ms, existing ease `[0.23, 1, 0.32, 1]`.
- Panel content **scrolls internally**; wall behind does not scroll while open.
- Body scroll locked while open (mirror the pattern already used in `Nav.tsx` mobile menu).
- Close on ✕, scrim click, and **Escape** key.
- Reduced-motion: fade only, no scale.

## Overlay content

- **Placeholder for the prototype.** Scaffold the panel with dummy case-study
  content (hero block, title, subtitle, a couple of media blocks) + clearly marked
  `{/* TODO */}` notes. Real MDX wiring is out of scope for this pass.
- Structure the placeholder so swapping in real project content later is a small,
  obvious change (single content region keyed by the selected project's slug/title).

## Component structure

New, self-contained under `app/lab/home/` + `components/lab/gallery/`
(keeps the experiment isolated, mirrors how bento/multi-language were structured):

- `app/lab/home/page.tsx` — server component; loads projects via `getAllProjects()`,
  renders the wall client component. Own `metadata`.
- `components/lab/gallery/GalleryWall.tsx` — `"use client"`; owns open/close state,
  renders header strip + masonry of `GalleryCard`s + the `ProjectOverlay`.
- `components/lab/gallery/GalleryCard.tsx` — single animated media card (video/poster/
  image + title label + hover).
- `components/lab/gallery/ProjectOverlay.tsx` — the floating panel: scrim, panel,
  scale/fade motion, ✕ / scrim / Escape close, body-scroll lock, placeholder content.

State: single `selected` (project or null) held in `GalleryWall`. No global state,
no data-model changes, no new route in nav.

## Reuse / consistency

- `PageWrapper` for page shell.
- `motion/react` for panel + card motion (already a dependency).
- Existing tokens: `--color-*`, `font-mono`, `text-caption`, `block-radius`,
  `status-ping`, `hide-scrollbar`.
- Status dot pattern lifted from `TopBrand.tsx`.
- No changes to `/`, `Nav.tsx` special-casing, or shared components.

## Out of scope (YAGNI)

- Real case-study content in the overlay (placeholder only).
- Deep-linking / URL state per opened card.
- Filtering, sorting, search on the wall.
- Adding `/lab/home` to site nav.
- Touching the production home page.

## Open questions (resolve during planning, sensible defaults noted)

1. **Card height source** — reuse `homeBlock.rowSpan`, or a deterministic
   height cycle per index? *Default: simple height cycle for the prototype.*
2. **Header nav affordance** — real links to `/work` `/thoughts` `/about`, or
   decorative for now? *Default: real links, they already exist.*
