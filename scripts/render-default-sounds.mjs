// Renders Globugg's built-in sounds (the same notes as the app's lib/sounds.ts)
// to WAV files in sound-packs/globugg-default/. Run: node scripts/render-default-sounds.mjs
import { writeFileSync } from "node:fs";

const RATE = 44100;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.5, G4 = 392, C4 = 261.63, E4 = 329.63;
const SOUNDS = {
  like: [{ f: E5, at: 0, len: 0.07, wave: "triangle" }, { f: A5, at: 0.06, len: 0.12, wave: "triangle" }],
  save: [{ f: G4, at: 0, len: 0.05, wave: "sine", gain: 0.9 }, { f: G5, at: 0.04, len: 0.1, wave: "sine", gain: 0.5 }],
  commentSent: [{ f: D5, to: A5, at: 0, len: 0.09, wave: "sine" }],
  commentIn: [{ f: C6, at: 0, len: 0.06, wave: "sine", gain: 0.25 }],
  dropLive: [C5, E5, G5].map((f, i) => ({ f, at: i * 0.08, len: 0.1, wave: "triangle" })).concat([{ f: C6, at: 0.24, len: 0.22, wave: "triangle" }]),
  boost: [{ f: G4, to: G5, at: 0, len: 0.18, wave: "sawtooth", gain: 0.25 }, { f: C6, at: 0.16, len: 0.25, wave: "sine" }, { f: E6, at: 0.2, len: 0.25, wave: "sine", gain: 0.5 }],
  welcome: [{ f: C4, at: 0, len: 0.45, gain: 0.6 }, { f: E4, at: 0.04, len: 0.42, gain: 0.5 }, { f: G4, at: 0.08, len: 0.4, gain: 0.5 }, { f: C5, at: 0.12, len: 0.38, wave: "triangle", gain: 0.5 }],
  arrive: [{ f: E5, at: 0, len: 0.25 }, { f: C5, at: 0.22, len: 0.35 }],
  error: [{ f: E4, at: 0, len: 0.12, wave: "triangle", gain: 0.7 }, { f: C4, at: 0.11, len: 0.18, wave: "triangle", gain: 0.7 }],
};
const wave = { sine: (p) => Math.sin(2 * Math.PI * p), triangle: (p) => 1 - 4 * Math.abs(Math.round(p - 0.25) - (p - 0.25)), sawtooth: (p) => 2 * (p - Math.floor(p + 0.5)) };

function render(notes) {
  const end = Math.max(...notes.map((n) => n.at + n.len)) + 0.05;
  const out = new Float32Array(Math.ceil(end * RATE));
  for (const n of notes) {
    const start = Math.floor(n.at * RATE), len = Math.floor(n.len * RATE);
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const t = i / RATE;
      const f = n.to ? n.f * Math.pow(n.to / n.f, i / len) : n.f;
      phase += f / RATE;
      const attack = Math.min(1, t / 0.008);
      const decay = Math.pow(0.0001, i / len); // exponential fade to silence
      out[start + i] += 0.6 * (n.gain ?? 1) * attack * decay * wave[n.wave ?? "sine"](phase % 1);
    }
  }
  const pcm = Buffer.alloc(44 + out.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + out.length * 2, 4); pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(RATE, 24);
  pcm.writeUInt32LE(RATE * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(out.length * 2, 40);
  out.forEach((v, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  return pcm;
}
for (const [name, notes] of Object.entries(SOUNDS)) writeFileSync(`sound-packs/globugg-default/${name}.wav`, render(notes));
console.log(`rendered ${Object.keys(SOUNDS).length} sounds`);
