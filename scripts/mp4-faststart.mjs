// Moves the `moov` atom to the front of an MP4 ("faststart"), in place.
//
// An MP4 keeps its media in `mdat` and its index — sample tables, codec
// config, durations — in `moov`. Most editors write `mdat` first and append
// `moov` at the end, because the index isn't final until encoding is done.
// A player cannot decode a single frame without `moov`, so when it sits at
// the end the browser has to go looking for it: it fetches the head, finds no
// index, range-requests the tail, then re-fetches. On a fast desktop
// connection that just looks like a delay. On a phone it often means the
// poster stays up and the video never starts.
//
// This is a remux, not a re-encode: the compressed samples are copied byte for
// byte, so quality is untouched. The only edit is to the chunk offset tables
// (`stco` / `co64`), which store absolute file positions and therefore all
// shift by the size of the moov box once it moves ahead of the media.
//
//   node scripts/mp4-faststart.mjs <files...>       rewrite the given files
//   node scripts/mp4-faststart.mjs --check <files>  report layout, change nothing

import { readFile, writeFile } from "node:fs/promises";

// --- box walking -----------------------------------------------------------

// Every MP4 box is [4-byte size][4-byte type][payload]. A size of 1 means the
// real size is a 64-bit value sitting just after the type; a size of 0 means
// "runs to end of file".
function readBoxes(buf, start = 0, end = buf.length) {
  const out = [];
  let p = start;
  while (p + 8 <= end) {
    let size = buf.readUInt32BE(p);
    const type = buf.toString("latin1", p + 4, p + 8);
    let header = 8;
    if (size === 1) {
      if (p + 16 > end) break;
      size = Number(buf.readBigUInt64BE(p + 8));
      header = 16;
    } else if (size === 0) {
      size = end - p;
    }
    if (size < header || p + size > end) break;
    out.push({ type, start: p, size, header, end: p + size });
    p += size;
  }
  return out;
}

// Containers whose payload is just more boxes; anything else is a leaf.
const CONTAINERS = new Set(["moov", "trak", "mdia", "minf", "stbl", "edts", "udta"]);

// Collect every chunk offset table in the tree. stco holds 32-bit offsets,
// co64 holds 64-bit ones; a file uses whichever its offsets fit in.
function findOffsetTables(buf, boxes, found = []) {
  for (const box of boxes) {
    if (box.type === "stco" || box.type === "co64") {
      found.push(box);
    } else if (CONTAINERS.has(box.type)) {
      findOffsetTables(buf, readBoxes(buf, box.start + box.header, box.end), found);
    }
  }
  return found;
}

// --- the rewrite -----------------------------------------------------------

function faststart(buf) {
  const top = readBoxes(buf);
  const ftyp = top.find((b) => b.type === "ftyp");
  const moov = top.find((b) => b.type === "moov");
  const mdat = top.find((b) => b.type === "mdat");

  if (!moov) throw new Error("no moov box — not a readable MP4");
  if (!mdat) throw new Error("no mdat box — not a readable MP4");
  if (moov.start < mdat.start) return null; // already faststart

  // moov moves ahead of everything that currently precedes it (except ftyp,
  // which stays first), so every byte of media slides forward by exactly the
  // size of the moov box.
  const delta = moov.size;

  const moovBuf = Buffer.from(buf.subarray(moov.start, moov.end));
  const tables = findOffsetTables(moovBuf, readBoxes(moovBuf, moov.header, moovBuf.length));
  if (!tables.length) throw new Error("no stco/co64 table — refusing to guess offsets");

  let patched = 0;
  for (const t of tables) {
    // version(1) + flags(3) + entry_count(4), then the entries themselves.
    const base = t.start + t.header;
    const count = moovBuf.readUInt32BE(base + 4);
    const first = base + 8;
    const width = t.type === "stco" ? 4 : 8;
    if (first + count * width > t.end) throw new Error(`${t.type} table overruns its box`);

    for (let i = 0; i < count; i++) {
      const at = first + i * width;
      if (width === 4) {
        const v = moovBuf.readUInt32BE(at) + delta;
        // A 32-bit table can't hold an offset past 4GB. Nothing here is close,
        // but silently wrapping would corrupt the file, so stop instead.
        if (v > 0xffffffff) throw new Error("offset overflows stco — needs co64");
        moovBuf.writeUInt32BE(v, at);
      } else {
        moovBuf.writeBigUInt64BE(moovBuf.readBigUInt64BE(at) + BigInt(delta), at);
      }
      patched++;
    }
  }

  // ftyp, then the relocated index, then everything else in its original
  // order minus the moov we lifted out.
  const rest = top.filter((b) => b !== ftyp && b !== moov);
  const parts = [];
  if (ftyp) parts.push(buf.subarray(ftyp.start, ftyp.end));
  parts.push(moovBuf);
  for (const b of rest) parts.push(buf.subarray(b.start, b.end));

  return { buf: Buffer.concat(parts), delta, chunks: patched, tables: tables.length };
}

// --- cli -------------------------------------------------------------------

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const files = args.filter((a) => a !== "--check");

if (!files.length) {
  console.error("usage: node scripts/mp4-faststart.mjs [--check] <files...>");
  process.exit(1);
}

let moved = 0;
let already = 0;
for (const file of files) {
  const buf = await readFile(file);
  const layout = readBoxes(buf)
    .map((b) => b.type)
    .join(">");

  let result;
  try {
    result = faststart(buf);
  } catch (err) {
    console.log(`  SKIP  ${file}\n        ${err.message}`);
    continue;
  }

  if (!result) {
    already++;
    console.log(`  ok    ${layout.padEnd(24)} ${file}`);
    continue;
  }

  if (checkOnly) {
    console.log(`  MOOV AT END  ${layout.padEnd(20)} ${file}`);
    continue;
  }

  // Sanity check the rewrite before it replaces the original: the output must
  // be the same length and must now lead with the index.
  if (result.buf.length !== buf.length) {
    console.log(`  SKIP  ${file}\n        size changed ${buf.length} -> ${result.buf.length}`);
    continue;
  }
  const after = readBoxes(result.buf).map((b) => b.type);
  if (after[0] !== "ftyp" || after[1] !== "moov") {
    console.log(`  SKIP  ${file}\n        unexpected output layout ${after.join(">")}`);
    continue;
  }

  await writeFile(file, result.buf);
  moved++;
  console.log(
    `  moved ${layout} -> ${after.join(">")}  (${result.chunks} chunks in ${result.tables} table(s))  ${file}`
  );
}

console.log(`\n${moved} rewritten, ${already} already faststart`);
