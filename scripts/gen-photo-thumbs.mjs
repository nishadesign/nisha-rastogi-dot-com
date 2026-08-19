// Generates the WebP variants the photo wall renders from.
//
// Source of truth is public/photos/web/ (max 1600px, used by the lightbox).
// This writes two height-capped WebP copies of each file:
//
//   public/photos/thumb-480/  — covers laptop viewports at 2x
//   public/photos/thumb-900/  — covers tall displays at 2x
//
// The wall picks between them with srcset, so the browser downloads the
// smallest copy that still covers the tile at the device's pixel ratio.
// Tiles are height-constrained (height: 100%, width: auto), so the variants
// are capped by HEIGHT; the `w` descriptors in the srcset are derived from
// each photo's aspect ratio in data/photos.ts.
//
// Run after adding photos to public/photos/web/:  node scripts/gen-photo-thumbs.mjs

import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "photos");
const SRC = path.join(ROOT, "web");

// height cap -> output dir. The three caps bracket what a tile actually needs
// (a third of the viewport height, times the device pixel ratio): ~440px on a
// laptop, ~500px on a phone at 2x, ~900px on a tall display or a phone at 3x.
// Without the middle step a phone jumps straight to the 900 and downloads
// roughly twice the pixels it can show. Quality eases down as the variants
// grow, since the extra resolution hides the loss.
const VARIANTS = [
  { height: 480, dir: path.join(ROOT, "thumb-480"), quality: 74 },
  { height: 640, dir: path.join(ROOT, "thumb-640"), quality: 72 },
  { height: 900, dir: path.join(ROOT, "thumb-900"), quality: 70 },
];

const totals = new Map(VARIANTS.map((v) => [v.dir, 0]));

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
if (!files.length) {
  console.error(`no source images in ${SRC}`);
  process.exit(1);
}

await Promise.all(VARIANTS.map((v) => mkdir(v.dir, { recursive: true })));

let srcBytes = 0;
for (const file of files) {
  srcBytes += (await stat(path.join(SRC, file))).size;

  for (const { height, dir, quality } of VARIANTS) {
    const out = path.join(dir, file.replace(/\.(jpe?g|png)$/i, ".webp"));
    const { size } = await sharp(path.join(SRC, file))
      // 13 of the source JPEGs are landscape files carrying an EXIF
      // orientation flag that browsers honour when displaying them. WebP does
      // not carry that flag, so without baking the rotation in first, those
      // photos come out physically landscape and the wall renders them on
      // their side. rotate() with no argument applies the EXIF orientation
      // and clears it; it must come before resize so the height cap applies
      // to the upright image.
      .rotate()
      // withoutEnlargement: a source shorter than the cap is left alone
      // rather than upscaled into a bigger file with no more detail.
      .resize({ height, withoutEnlargement: true, fit: "inside" })
      .webp({ quality, effort: 6 })
      .toFile(out);
    totals.set(dir, totals.get(dir) + size);
  }
}

const mb = (b) => (b / 1048576).toFixed(1) + "MB";
console.log(`${files.length} photos`);
console.log(`  source (web/)    ${mb(srcBytes)}`);
for (const { dir } of VARIANTS) {
  console.log(`  ${path.basename(dir).padEnd(16)} ${mb(totals.get(dir))}`);
}
