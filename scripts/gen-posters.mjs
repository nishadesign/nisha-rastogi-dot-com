// Builds the poster frames the home gallery shows before (and instead of)
// video.
//
// A poster matters more than it looks like it does. It is the first thing
// painted in every card, it is what stays on screen while the video buffers,
// and on a phone that decides not to autoplay it is the *only* thing the
// visitor ever sees. It also can't go through next/image: <video poster> takes
// a plain URL, so whatever is referenced gets served byte for byte.
//
// The source art is full-resolution PNG (up to 4000x3000, 6.6MB) while a card
// renders at most ~1288 device pixels wide. This writes a WebP copy of each
// poster capped at that width, beside the original.
//
//   node scripts/gen-posters.mjs        (or: npm run posters)

import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Widest a gallery card is ever painted: ~644 CSS px in the single-column
// layout, doubled for a 2x display. The three-column desktop layout is
// narrower than this, so one size covers every breakpoint.
const MAX_WIDTH = 1280;
const QUALITY = 78;

const GALLERY = path.join(process.cwd(), "data", "gallery.ts");
const source = await readFile(GALLERY, "utf8");

const posters = [...source.matchAll(/poster:\s*"([^"]+)"/g)].map((m) => m[1]);
if (!posters.length) {
  console.error("no poster: entries found in data/gallery.ts");
  process.exit(1);
}

let before = 0;
let after = 0;
const rewrites = new Map();

for (const ref of posters) {
  const src = path.join(process.cwd(), "public", ref);
  const outRef = ref.replace(/\.(png|jpe?g)$/i, ".webp");
  const out = path.join(process.cwd(), "public", outRef);

  const srcSize = (await stat(src)).size;
  const { size } = await sharp(src)
    // Posters are screenshots and UI stills, so they were authored upright —
    // but rotate() is harmless when there is no EXIF flag and saves a repeat
    // of the sideways-photo problem if a camera still is ever used here.
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(out);

  before += srcSize;
  after += size;
  if (outRef !== ref) rewrites.set(ref, outRef);

  console.log(
    `  ${(srcSize / 1024).toFixed(0).padStart(6)}KB -> ${(size / 1024)
      .toFixed(0)
      .padStart(5)}KB  ${path.basename(outRef)}`
  );
}

// Point data/gallery.ts at the WebP copies. The originals stay on disk; other
// pages still reference them.
let updated = source;
for (const [from, to] of rewrites) {
  updated = updated.split(`poster: "${from}"`).join(`poster: "${to}"`);
}
if (updated !== source) await writeFile(GALLERY, updated);

const mb = (b) => (b / 1048576).toFixed(2) + "MB";
console.log(`\n${posters.length} posters: ${mb(before)} -> ${mb(after)}`);
console.log(`data/gallery.ts: ${rewrites.size} reference(s) updated`);
