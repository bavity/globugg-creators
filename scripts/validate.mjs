// Checks every contribution before it's reviewed: run `node scripts/validate.mjs`.
// No dependencies, so it runs anywhere Node 20+ does (and in the GitHub Action).
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
// Globugg uses icons, not emoji: pins pick a name from icons/, and text stays words.
const EMOJI = /(?![\u00a9\u00ae\u2122])\p{Extended_Pictographic}/u;
const findEmoji = (v, path = "") => {
  if (typeof v === "string") return EMOJI.test(v) ? path || "a value" : null;
  if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { const hit = findEmoji(x, path ? `${path}.${k}` : k); if (hit) return hit; }
  return null;
};
const readJson = (file) => {
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    const hit = findEmoji(data);
    if (hit) fail(file, `${hit} contains an emoji. Use words instead (and for pins, an icon name from icons/)`);
    return data;
  } catch (e) {
    fail(file, `isn't valid JSON (${e.message})`);
    return null;
  }
};
const files = (dir, ext) => (existsSync(dir) ? readdirSync(dir).filter((f) => extname(f) === ext).map((f) => join(dir, f)) : []);
const ICONS = new Set(files("icons", ".svg").map((f) => basename(f, ".svg")));
const pngSize = (file) => {
  const b = readFileSync(file);
  if (b.length < 24 || b.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), alpha: b[25] === 6 || b[25] === 4 };
};
/** Width and height of a JPEG (from its frame header) or WebP, or null if it's neither. */
const photoSize = (file) => {
  const b = readFileSync(file);
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i + 9 < b.length; ) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
    return null;
  }
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") { const v = b.readUInt32LE(21); return { width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 }; }
    if (kind === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  return null;
};
const isColor = (v) => typeof v === "string" && /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(v);
const checkAuthor = (file, a) => {
  if (!a || typeof a.name !== "string" || !a.name.trim()) fail(file, `needs "author": { "name": "...", "github": "..." }`);
  else if (a.github && !/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(a.github)) fail(file, `author.github "${a.github}" isn't a GitHub username`);
};
const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ---------- Map themes ----------
const reference = readJson("map-themes/globugg-day.json");
const paletteKeys = Object.keys(reference?.palette ?? {});
for (const file of files("map-themes", ".json")) {
  if (!slug.test(basename(file, ".json"))) fail(file, "file name must be lowercase-with-dashes");
  const t = readJson(file);
  if (!t) continue;
  checkAuthor(file, t.author);
  if (typeof t.name !== "string" || t.name.length > 40) fail(file, `"name" is required (40 characters max)`);
  if (t.mode !== "light" && t.mode !== "dark") fail(file, `"mode" must be "light" or "dark"`);
  const p = t.palette ?? {};
  for (const k of paletteKeys) if (!isColor(p[k])) fail(file, `palette.${k} is missing or isn't a colour (#rrggbb or rgba(...))`);
  for (const k of Object.keys(p)) if (!paletteKeys.includes(k)) fail(file, `palette.${k} isn't a map colour (see globugg-day.json for the list)`);
}

// ---------- Chat chips ----------
for (const file of files("chat-chips", ".json")) {
  if (!/^[a-z]{2}(-[A-Z]{2})?-[a-z]+$/.test(basename(file, ".json"))) fail(file, `file name must be <language>-<category>, e.g. en-food or pt-BR-events`);
  const c = readJson(file);
  if (!c) continue;
  checkAuthor(file, c.author);
  if (!Array.isArray(c.chips) || c.chips.length < 3 || c.chips.length > 12) fail(file, "needs 3 to 12 chips");
  else
    c.chips.forEach((chip, i) => {
      if (typeof chip !== "string" || !chip.trim() || chip.length > 32) fail(file, `chip ${i + 1} must be 1-32 characters`);
    });
}

const STICKERS = ["wink", "cool", "thinking", "laugh", "thumbsup", "boba", "wave", "giggle", "cute"];
const checkBadge = (file, b) => {
  if (!b || typeof b.name !== "string" || !b.name.trim() || b.name.length > 30) fail(file, `needs "badge": { "name": "... (30 max)", "sticker": "..." }`);
  else if (!STICKERS.includes(b.sticker)) fail(file, `badge.sticker must be one of: ${STICKERS.join(", ")}`);
};
const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

// ---------- Trails ----------
for (const file of files("trails", ".json")) {
  if (!slug.test(basename(file, ".json"))) fail(file, "file name must be lowercase-with-dashes, e.g. lagos-island");
  const g = readJson(file);
  if (!g) continue;
  checkAuthor(file, g.author);
  checkBadge(file, g.badge);
  for (const k of ["city", "country", "title"]) if (typeof g[k] !== "string" || !g[k].trim()) fail(file, `"${k}" is required`);
  if (!/^[A-Z]{2}$/.test(g.country ?? "")) fail(file, `"country" must be a 2-letter code, e.g. US or NG`);
  if (!Array.isArray(g.spots) || g.spots.length < 3 || g.spots.length > 12) fail(file, "needs 3 to 12 spots");
  else
    g.spots.forEach((s, i) => {
      const where = `spot ${i + 1}`;
      if (typeof s.name !== "string" || !s.name.trim()) fail(file, `${where}: "name" is required`);
      if (typeof s.lat !== "number" || s.lat < -90 || s.lat > 90 || typeof s.lng !== "number" || s.lng < -180 || s.lng > 180) fail(file, `${where}: needs a real "lat" and "lng"`);
      if (typeof s.why !== "string" || s.why.length < 10 || s.why.length > 160) fail(file, `${where}: "why" should be 10-160 characters`);
    });
}

// ---------- Map layers (GeoJSON points) ----------
for (const file of files("map-layers", ".geojson")) {
  if (!slug.test(basename(file, ".geojson"))) fail(file, "file name must be lowercase-with-dashes");
  const l = readJson(file);
  if (!l) continue;
  checkAuthor(file, l.author);
  if (l.type !== "FeatureCollection") fail(file, `"type" must be "FeatureCollection"`);
  if (l.license !== "CC-BY-4.0" && l.license !== "ODbL-1.0") fail(file, `"license" must be "CC-BY-4.0" (your own data) or "ODbL-1.0" (from OpenStreetMap)`);
  if (typeof l.name !== "string" || !l.name.trim() || l.name.length > 40) fail(file, `"name" is required (40 max)`);
  if (!ICONS.has(l.icon)) fail(file, `"icon" must be one of the names in icons/ (e.g. "palette", "utensils"); see icons/README.md`);
  if (!Array.isArray(l.features) || l.features.length < 1 || l.features.length > 500) fail(file, "needs 1 to 500 places");
  else
    l.features.forEach((f, i) => {
      const [lng, lat] = f?.geometry?.coordinates ?? [];
      if (f?.geometry?.type !== "Point" || typeof lat !== "number" || typeof lng !== "number" || Math.abs(lat) > 90 || Math.abs(lng) > 180)
        fail(file, `place ${i + 1}: needs a Point with [lng, lat]`);
      if (typeof f?.properties?.name !== "string" || !f.properties.name.trim()) fail(file, `place ${i + 1}: needs properties.name`);
      if (f?.properties?.note && f.properties.note.length > 160) fail(file, `place ${i + 1}: note is 160 characters max`);
      const { address, image, imageCredit } = f?.properties ?? {};
      if (address !== undefined && (typeof address !== "string" || !address.trim() || address.length > 120)) fail(file, `place ${i + 1}: address is 120 characters max`);
      if (image !== undefined) {
        // Photos live in a folder named after the layer: map-layers/<layer>/<photo>.
        const photo = join("map-layers", basename(file, ".geojson"), String(image));
        if (typeof image !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*\.(jpe?g|webp)$/.test(image)) fail(file, `place ${i + 1}: image must be a lowercase-with-dashes .jpg or .webp file name`);
        else if (!existsSync(photo)) fail(file, `place ${i + 1}: ${photo} doesn't exist`);
        else {
          const size = photoSize(photo);
          if (!size) fail(photo, "isn't a JPEG or WebP image");
          else if (size.width < 800 || size.width > 1600 || size.width < size.height) fail(photo, `should be landscape, 800-1600 px wide (it's ${size.width}x${size.height})`);
          if (statSync(photo).size > 400_000) fail(photo, `is ${Math.round(statSync(photo).size / 1000)} KB; 400 KB max`);
        }
        if (typeof imageCredit !== "string" || imageCredit.trim().length < 3 || imageCredit.length > 120) fail(file, `place ${i + 1}: a photo needs "imageCredit" (who took it and its licence, 120 max)`);
      } else if (imageCredit !== undefined) fail(file, `place ${i + 1}: "imageCredit" without an "image"`);
    });
}

// ---------- Challenges ----------
for (const file of files("challenges", ".json")) {
  if (!slug.test(basename(file, ".json"))) fail(file, "file name must be lowercase-with-dashes");
  const c = readJson(file);
  if (!c) continue;
  checkAuthor(file, c.author);
  checkBadge(file, c.badge);
  if (typeof c.title !== "string" || !c.title.trim() || c.title.length > 40) fail(file, `"title" is required (40 max)`);
  if (!/^[a-z0-9]{3,30}$/.test(c.hashtag ?? "")) fail(file, `"hashtag" must be 3-30 lowercase letters/numbers, without #`);
  if (!isDate(c.starts) || !isDate(c.ends) || c.ends < c.starts) fail(file, `"starts" and "ends" must be dates (YYYY-MM-DD), ends on or after starts`);
  else if ((Date.parse(c.ends) - Date.parse(c.starts)) / 86_400_000 > 31) fail(file, "challenges last 31 days at most");
  if (c.area != null && (typeof c.area.lat !== "number" || typeof c.area.lng !== "number" || typeof c.area.radiusKm !== "number" || c.area.radiusKm < 0.1 || c.area.radiusKm > 50))
    fail(file, `"area" is null (anywhere) or { "lat", "lng", "radiusKm" (0.1-50) }`);
}

// ---------- Sound packs ----------
const SOUND_SLOTS = ["like", "save", "commentSent", "commentIn", "dropLive", "boost", "welcome", "arrive", "error"];
const wavInfo = (file) => {
  const b = readFileSync(file);
  if (b.length < 44 || b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WAVE") return null;
  // Walk the chunks for "fmt " and "data".
  let fmt = null, dataLen = 0;
  for (let o = 12; o + 8 <= b.length; ) {
    const id = b.toString("ascii", o, o + 4), size = b.readUInt32LE(o + 4);
    if (id === "fmt ") fmt = { format: b.readUInt16LE(o + 8), channels: b.readUInt16LE(o + 10), rate: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22) };
    if (id === "data") dataLen = size;
    o += 8 + size + (size % 2);
  }
  return fmt && { ...fmt, seconds: dataLen / (fmt.rate * fmt.channels * (fmt.bits / 8)) };
};
for (const pack of existsSync("sound-packs") ? readdirSync("sound-packs").filter((d) => statSync(join("sound-packs", d)).isDirectory()) : []) {
  const dir = join("sound-packs", pack);
  if (!slug.test(pack)) fail(dir, "folder name must be lowercase-with-dashes");
  const meta = readJson(join(dir, "pack.json"));
  if (!meta) continue;
  checkAuthor(join(dir, "pack.json"), meta.author);
  if (meta.license !== "CC-BY-4.0") fail(join(dir, "pack.json"), `"license" must be "CC-BY-4.0"`);
  const sounds = meta.sounds ?? {};
  if (!Object.keys(sounds).length) fail(join(dir, "pack.json"), `"sounds" needs at least one sound`);
  for (const [slot, f] of Object.entries(sounds)) {
    if (!SOUND_SLOTS.includes(slot)) {
      fail(join(dir, "pack.json"), `"${slot}" isn't a sound (use: ${SOUND_SLOTS.join(", ")})`);
      continue;
    }
    const file = join(dir, f);
    if (!existsSync(file)) {
      fail(join(dir, "pack.json"), `"${f}" isn't in the folder`);
      continue;
    }
    const w = wavInfo(file);
    if (!w || w.format !== 1 || w.bits !== 16) fail(file, "must be a 16-bit PCM WAV");
    else {
      if (w.rate !== 44100 && w.rate !== 48000) fail(file, `must be 44.1 or 48 kHz (it's ${w.rate} Hz)`);
      if (w.seconds > 1.5) fail(file, `must be 1.5 s or shorter (it's ${w.seconds.toFixed(2)} s)`);
    }
    if (statSync(file).size > 150 * 1024) fail(file, "must be 150 KB or smaller");
  }
}

// ---------- Video frames ----------
for (const dirName of existsSync("video-frames") ? readdirSync("video-frames").filter((d) => statSync(join("video-frames", d)).isDirectory()) : []) {
  const dir = join("video-frames", dirName);
  const meta = readJson(join(dir, "frame.json"));
  if (!meta) continue;
  checkAuthor(join(dir, "frame.json"), meta.author);
  if (meta.license !== "CC-BY-4.0") fail(join(dir, "frame.json"), `"license" must be "CC-BY-4.0"`);
  if (typeof meta.name !== "string" || !/^\S{2,12}$/.test(meta.name)) fail(join(dir, "frame.json"), `"name" must be one word, 12 characters max (it's shown under the frame's tile), e.g. "Confetti"`);
  const file = join(dir, meta.file ?? "frame.png");
  if (dirName === "example" && !existsSync(file)) continue; // the template has no art
  if (!existsSync(file)) {
    fail(dir, `"${meta.file}" isn't in the folder`);
    continue;
  }
  const size = pngSize(file);
  if (!size) fail(file, "must be a PNG");
  else {
    if (size.width !== 1080 || size.height !== 1920) fail(file, `must be 1080×1920 (it's ${size.width}×${size.height})`);
    if (!size.alpha) fail(file, "needs a transparent middle (PNG with alpha)");
  }
  if (statSync(file).size > 600 * 1024) fail(file, "must be 600 KB or smaller");
}

// ---------- Sticker packs ----------
for (const pack of existsSync("stickers") ? readdirSync("stickers").filter((d) => statSync(join("stickers", d)).isDirectory()) : []) {
  const dir = join("stickers", pack);
  if (!slug.test(pack)) fail(dir, "folder name must be lowercase-with-dashes");
  const meta = readJson(join(dir, "pack.json"));
  if (!meta) continue;
  checkAuthor(join(dir, "pack.json"), meta.author);
  if (meta.license !== "CC-BY-4.0") fail(join(dir, "pack.json"), `"license" must be "CC-BY-4.0" (see CONTRIBUTING.md)`);
  const listed = new Set((meta.stickers ?? []).map((s) => s.file));
  for (const s of meta.stickers ?? []) {
    const file = join(dir, s.file ?? "");
    if (!s.file || !existsSync(file)) {
      fail(join(dir, "pack.json"), `sticker "${s.file}" isn't in the folder`);
      continue;
    }
    if (typeof s.name !== "string" || !s.name.trim()) fail(file, `needs a "name" in pack.json`);
    const size = pngSize(file);
    if (!size) fail(file, "must be a PNG");
    else {
      if (size.width !== 512 || size.height !== 512) fail(file, `must be 512×512 (it's ${size.width}×${size.height})`);
      if (!size.alpha) fail(file, "needs a transparent background (PNG with alpha)");
    }
    if (statSync(file).size > 300 * 1024) fail(file, "must be 300 KB or smaller");
  }
  for (const f of readdirSync(dir)) if (extname(f) === ".png" && !listed.has(f)) fail(join(dir, f), "isn't listed in pack.json");
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem${errors.length > 1 ? "s" : ""}:\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("✓ Everything looks good.");
