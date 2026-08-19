// Re-encodes the project videos to load fast without a visible quality cost,
// and verifies that claim rather than asserting it.
//
// The source files are not high quality, they are unoptimised: 2160p at up to
// 17 Mbps for footage that is displayed in a card at most 1288 device pixels
// wide, encoded at H.264 High Level 5.1/5.2. Apple documents High Level 4.2 as
// the ceiling for Safari and iOS, so those streams can simply refuse to decode
// on a phone — which looks identical to a video that never loaded.
//
// The approach here is the one fast sites use:
//   * cap the resolution at what the layout can actually paint, plus headroom
//   * encode to a QUALITY target (CRF) rather than a fixed bitrate, so each
//     clip spends exactly the bits its content needs — near-static screen
//     recordings collapse, busy footage keeps its detail
//   * stay inside H.264 Level 4.2 so every device can decode it
//   * drop audio (these are muted UI loops; none of them have an audio track)
//   * put the moov atom first so playback can start before the file finishes
//
// Every output is then scored with VMAF against its source, both scaled to the
// real display width. VMAF is Netflix's perceptual metric; >= 95 is the usual
// line for "visually indistinguishable". Anything below RETRY_CRF_AT is
// re-encoded at a higher quality setting and scored again.
//
//   node scripts/encode-videos.mjs            all gallery videos, in place
//   node scripts/encode-videos.mjs --dry      encode to a temp dir, report only
//   node scripts/encode-videos.mjs <paths...> specific files

import { execFile } from "node:child_process";
import { mkdtemp, readFile, rename, stat, unlink } from "node:fs/promises";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);

// Widest a card is ever painted: 644 CSS px in the single-column layout on a
// 2x screen. 1440 gives comfortable headroom above it.
const DISPLAY_WIDTH = 1288;
const MAX_WIDTH = 1440;
const CRF = 18;
const RETRY_CRF = 15;
const VMAF_FLOOR = 95;

// H.264 Level 4.2 limits: 8704 macroblocks per frame and 522240 per second.
// A macroblock is 16x16 px. Portrait clips are the binding case — a tall frame
// burns macroblocks fast — so the cap is derived from the aspect and frame rate
// rather than assumed.
const L42_MB_FRAME = 8704;
const L42_MB_SEC = 522240;

function maxWidthForLevel(aspect, fps) {
  // width * (width / aspect) / 256 <= min(perFrame, perSecond / fps)
  const budget = Math.min(L42_MB_FRAME, Math.floor(L42_MB_SEC / Math.max(fps, 1)));
  const w = Math.sqrt(budget * 256 * aspect);
  return Math.max(320, Math.floor(w / 2) * 2); // even width, keep yuv420p happy
}

async function probe(file) {
  const { stdout } = await run(ffmpegPath, ["-hide_banner", "-i", file], { encoding: "utf8" })
    .catch((e) => ({ stdout: e.stderr || "" }));
  const dim = stdout.match(/,\s(\d{2,5})x(\d{2,5})[,\s]/);
  const fps = stdout.match(/([\d.]+)\s+fps/);
  const hasAudio = /Stream #\d+:\d+.*: Audio:/.test(stdout);
  if (!dim) throw new Error("could not read dimensions");
  return {
    width: +dim[1], height: +dim[2],
    fps: fps ? Math.round(parseFloat(fps[1])) : 30,
    hasAudio,
  };
}

async function encode(src, out, width, crf) {
  await run(ffmpegPath, [
    "-y", "-hide_banner", "-loglevel", "error", "-i", src,
    "-vf", `scale=${width}:-2:flags=lanczos`,
    "-c:v", "libx264", "-crf", String(crf), "-preset", "slow",
    "-profile:v", "high", "-level:v", "4.2",
    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
    out,
  ]);
}

async function vmaf(encoded, source, workdir, dispW, dispH) {
  const log = path.join(workdir, "vmaf.json");
  // Both sides are forced to the same explicit WxH. Letting ffmpeg derive the
  // height with -2 rounds each input independently, and a one-pixel difference
  // makes libvmaf refuse the comparison outright.
  const chain =
    `[0:v]scale=${dispW}:${dispH}:flags=lanczos,setsar=1,format=yuv420p[e];` +
    `[1:v]scale=${dispW}:${dispH}:flags=lanczos,setsar=1,format=yuv420p[r];` +
    `[e][r]libvmaf=log_fmt=json:log_path=${log}`;
  await run(ffmpegPath, [
    "-hide_banner", "-loglevel", "error",
    "-i", encoded, "-i", source, "-lavfi", chain, "-f", "null", "-",
  ]);
  const m = JSON.parse(await readFile(log, "utf8")).pooled_metrics.vmaf;
  return { mean: m.mean, min: m.min };
}

const args = process.argv.slice(2);
const dry = args.includes("--dry");
let targets = args.filter((a) => !a.startsWith("--"));

if (!targets.length) {
  const gallery = await readFile(path.join(process.cwd(), "data", "gallery.ts"), "utf8");
  targets = [...gallery.matchAll(/src:\s*"([^"]+\.mp4)"/g)].map((m) =>
    path.join(process.cwd(), "public", m[1])
  );
}

const work = await mkdtemp(path.join(tmpdir(), "vid-"));
let before = 0, after = 0;
const rows = [];

for (const src of targets) {
  const name = path.basename(src);
  const info = await probe(src);
  const aspect = info.width / info.height;
  const width = Math.min(MAX_WIDTH, info.width, maxWidthForLevel(aspect, info.fps));
  const out = path.join(work, name.replace(/\s+/g, "_"));

  // Comparison size: the real display width, height following the source
  // aspect, both even.
  const dispW = Math.min(DISPLAY_WIDTH, info.width) & ~1;
  const dispH = Math.round(dispW / aspect) & ~1;

  await encode(src, out, width, CRF);
  let score = await vmaf(out, src, work, dispW, dispH);
  let usedCrf = CRF;
  if (score.mean < VMAF_FLOOR) {
    await encode(src, out, width, RETRY_CRF);
    score = await vmaf(out, src, work, dispW, dispH);
    usedCrf = RETRY_CRF;
  }

  const b = (await stat(src)).size, a = (await stat(out)).size;
  before += b; after += a;
  rows.push({ name, b, a, width: `${width}x${Math.round(width / aspect)}`,
              from: `${info.width}x${info.height}`, fps: info.fps,
              vmaf: score.mean, vmafMin: score.min, crf: usedCrf,
              audio: info.hasAudio });

  if (!dry) await rename(out, src);
  else await unlink(out).catch(() => {});
}

const mb = (n) => (n / 1048576).toFixed(2);
console.log(
  "file".padEnd(24) + "before".padStart(9) + "after".padStart(9) +
  "saved".padStart(7) + "  resolution".padEnd(26) + "VMAF".padStart(7) + "  min"
);
for (const r of rows) {
  console.log(
    r.name.padEnd(24) +
    (mb(r.b) + "MB").padStart(9) + (mb(r.a) + "MB").padStart(9) +
    (Math.round((1 - r.a / r.b) * 100) + "%").padStart(7) + "  " +
    `${r.from} -> ${r.width}`.padEnd(24) +
    r.vmaf.toFixed(1).padStart(7) + "  " + r.vmafMin.toFixed(1) +
    (r.crf !== CRF ? `  (crf ${r.crf})` : "") +
    (r.vmaf < VMAF_FLOOR ? "  BELOW FLOOR" : "")
  );
}
console.log(
  "\n" + rows.length + " videos: " + mb(before) + "MB -> " + mb(after) + "MB  (" +
  Math.round((1 - after / before) * 100) + "% smaller)"
);
console.log("All streams are H.264 High Level 4.2 or below, faststart, no audio track.");
console.log("VMAF >= 95 means visually indistinguishable from the source at display size.");
if (dry) console.log("\n--dry: nothing was written back.");
