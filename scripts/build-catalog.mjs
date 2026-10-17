// Builds dist/catalog.json: everything accepted in this repo, in one file the
// Globugg app downloads (with the art copied alongside). Run after validate.mjs.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const read = (f) => JSON.parse(readFileSync(f, "utf8"));
const list = (dir, ext) => (existsSync(dir) ? readdirSync(dir).filter((f) => extname(f) === ext).sort() : []);
const dirs = (dir) => (existsSync(dir) ? readdirSync(dir).filter((d) => statSync(join(dir, d)).isDirectory()).sort() : []);
const id = (f) => basename(f, extname(f));

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
// The pin icons map layers can use (see icons/README.md).
cpSync("icons", join("dist", "icons"), { recursive: true });

const stickerPacks = dirs("stickers")
  .map((d) => ({ id: d, ...read(join("stickers", d, "pack.json")) }))
  .filter((p) => p.stickers?.length) // the example pack is empty
  .map((p) => ({ ...p, stickers: p.stickers.map((s) => ({ ...s, url: `stickers/${p.id}/${s.file}` })) }));
for (const p of stickerPacks) cpSync(join("stickers", p.id), join("dist", "stickers", p.id), { recursive: true });

const videoFrames = dirs("video-frames")
  .filter((d) => existsSync(join("video-frames", d, read(join("video-frames", d, "frame.json")).file ?? "frame.png")))
  .map((d) => {
    const f = read(join("video-frames", d, "frame.json"));
    cpSync(join("video-frames", d), join("dist", "video-frames", d), { recursive: true });
    return { id: d, ...f, url: `video-frames/${d}/${f.file ?? "frame.png"}` };
  });

const soundPacks = dirs("sound-packs").map((d) => {
  const p = read(join("sound-packs", d, "pack.json"));
  cpSync(join("sound-packs", d), join("dist", "sound-packs", d), { recursive: true });
  return { id: d, ...p, sounds: Object.fromEntries(Object.entries(p.sounds).map(([slot, f]) => [slot, `sound-packs/${d}/${f}`])) };
});

const catalog = {
  version: 1,
  builtAt: new Date().toISOString(),
  mapThemes: list("map-themes", ".json").map((f) => ({ id: id(f), ...read(join("map-themes", f)) })),
  chatChips: list("chat-chips", ".json").map((f) => ({ id: id(f), ...read(join("chat-chips", f)) })),
  mapLayers: list("map-layers", ".geojson").map((f) => ({ id: id(f), ...read(join("map-layers", f)) })),
  trails: list("trails", ".json").map((f) => ({ id: id(f), ...read(join("trails", f)) })),
  challenges: list("challenges", ".json").map((f) => ({ id: id(f), ...read(join("challenges", f)) })),
  stickerPacks,
  videoFrames,
  soundPacks,
};
// Everyone credited anywhere in the catalog, for the app's contributors list.
const people = new Map();
for (const list of Object.values(catalog)) if (Array.isArray(list)) for (const item of list) if (item.author?.name) people.set(item.author.github ?? item.author.name, item.author);
catalog.contributors = [...people.values()].filter((a) => a.github !== "bavity");
writeFileSync("dist/catalog.json", JSON.stringify(catalog));
const counts = Object.entries(catalog).filter(([, v]) => Array.isArray(v)).map(([k, v]) => `${v.length} ${k}`);
console.log(`dist/catalog.json: ${counts.join(", ")}`);
