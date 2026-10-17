# Sticker packs

People place stickers on their buggs from the drop screen, and they appear at Globugg's moments: the welcome screen, toasts ("Saved!") and empty screens. See [`globugg-moments/`](globugg-moments/) for a finished pack.

## Make a pack

1. Copy `example-pack/` to a new folder named after your pack, lowercase-with-dashes (e.g. `lagos-street-food`).
2. Add **4 to 12 stickers**. Each one is:
   - a **PNG, 512 × 512 px**, with a **transparent background**
   - **300 KB or smaller**
   - readable when small (about 56 px on screen), with a bold outline or a white "die-cut" border
3. List them in `pack.json`:

```json
{
  "name": "Lagos street food",
  "author": { "name": "Ada O.", "github": "ada-o" },
  "license": "CC-BY-4.0",
  "description": "Suya, puff-puff and friends, cheering you on.",
  "stickers": [
    { "file": "suya-wave.png", "name": "Suya waving", "tags": ["hello", "food"] },
    { "file": "puff-cheer.png", "name": "Puff-puff cheering", "tags": ["yay", "like"] }
  ]
}
```

Good tags say *when* the sticker fits: `hello`, `yay`, `like`, `thinking`, `oops`, `sleepy`, `wow`, `food`, `party`.
