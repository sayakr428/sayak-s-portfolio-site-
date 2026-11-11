// Upload the site's heavy media to Cloudinary and write cdn-manifest.json (local path -> public delivery URL).
//
//   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name> node scripts/cdn-upload.mjs
//
// The secret is read from the environment only; it is never written to disk or into the site.
// Files are taken from public/ first, then _cdn_originals/ (where they live once moved off the site).
// Unchanged files (same SHA-1 as in the manifest) are skipped, so re-running only uploads what changed.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const m = /^cloudinary:\/\/(\d+):([^@]+)@([\w-]+)$/.exec(process.env.CLOUDINARY_URL ?? "");
if (!m) { console.error("Set CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>"); process.exit(1); }
const [, KEY, SECRET, CLOUD] = m;

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIRS = ["audio", "broll", "doors", "experience", "film", "footer", "index", "lab", "live", "me", "work"];
const SOURCES = [join(ROOT, "public"), join(ROOT, "_cdn_originals")];
const MANIFEST = join(ROOT, "cdn-manifest.json");
const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp"]), VIDEO = new Set([".mp4", ".webm", ".mov"]), AUDIO = new Set([".mp3", ".wav", ".m4a"]);

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { cloud: CLOUD, assets: {} };
manifest.cloud = CLOUD;

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = new Map();   // "/live/webgrow.mp4" -> absolute path (public/ wins over _cdn_originals/)
for (const base of [...SOURCES].reverse()) for (const dir of DIRS) {
  const d = join(base, dir); if (!existsSync(d)) continue;
  for (const f of walk(d)) files.set("/" + relative(base, f).replaceAll("\\", "/"), f);
}

// how each kind is delivered: automatic format + quality; images capped at 2400 px wide
const deliver = (type, ext, version, id) => {
  const t = type === "image" ? "f_auto,q_auto,c_limit,w_2400" : AUDIO.has(ext) ? "" : "q_auto";
  return `https://res.cloudinary.com/${CLOUD}/${type}/upload/${t ? t + "/" : ""}v${version}/${id}${ext}`;
};

let up = 0, skip = 0;
for (const [path, abs] of [...files].sort()) {
  const ext = extname(path).toLowerCase();
  const type = IMAGE.has(ext) ? "image" : VIDEO.has(ext) || AUDIO.has(ext) ? "video" : null;
  if (!type) continue;
  const buf = readFileSync(abs), sha = createHash("sha1").update(buf).digest("hex");
  if (manifest.assets[path]?.sha === sha) { skip++; continue; }
  const id = "portfolio" + path.slice(0, -ext.length);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { overwrite: "true", public_id: id, timestamp: String(timestamp) };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&") + SECRET;
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", KEY);
  form.append("signature", createHash("sha1").update(toSign).digest("hex"));
  form.append("file", new Blob([buf]), path.split("/").pop());
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/${type}/upload`, { method: "POST", body: form });
  const j = await res.json();
  if (!res.ok) { console.error(`FAIL ${path}: ${j.error?.message ?? res.status}`); process.exitCode = 1; continue; }
  manifest.assets[path] = { url: deliver(type, ext, j.version, id), sha, bytes: buf.length };
  up++; console.log(`up   ${path}  ${(buf.length / 1e6).toFixed(2)} MB`);
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + "\n");
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + "\n");
console.log(`done: ${up} uploaded, ${skip} unchanged, ${Object.keys(manifest.assets).length} in manifest`);
