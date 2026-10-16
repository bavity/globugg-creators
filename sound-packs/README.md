# Sound packs

A sound pack replaces the little tones Globugg plays for actions. People pick a pack in Settings → Sounds. Listen to [`globugg-default/`](globugg-default/) first: it's the built-in set.

Make a folder (lowercase-with-dashes, e.g. `kalimba-garden`) with a `pack.json` and one WAV file for each sound you want to change. Any sound you leave out uses the default.

| Sound | When it plays |
|---|---|
| `like` | Like |
| `save` | Save |
| `commentSent` | Your comment sent |
| `commentIn` | Someone else's comment |
| `dropLive` | Your bugg is live |
| `boost` | Boosted |
| `welcome` | Signed in |
| `arrive` | Arrived at a bugg |
| `error` | Something didn't work |

```json
{
  "name": "Kalimba garden",
  "author": { "name": "Your name", "github": "your-username" },
  "license": "CC-BY-4.0",
  "description": "Soft thumb-piano plinks.",
  "sounds": { "like": "like.wav", "dropLive": "drop.wav" }
}
```

Each file must be:

- **WAV** (16-bit PCM), mono or stereo, 44.1 or 48 kHz
- **1.5 seconds or shorter** (most should be under 0.5 s; `commentIn` under 0.2 s)
- **150 KB or smaller**
- **gentle:** no sudden loud peaks, nothing that sounds like a phone ringtone, an alarm or a notification from another app. `commentIn` plays often in busy chats, so keep it very quiet.

Made with code? `scripts/render-default-sounds.mjs` shows how the defaults are generated.
