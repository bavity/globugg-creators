# Map themes

A theme is a colour palette for the map. Copy [`globugg-day.json`](globugg-day.json), rename it (lowercase-with-dashes, e.g. `neon-night.json`) and change the colours.

- `"mode"`: `"light"` or `"dark"`, so pins and labels stay readable.
- Every key in `"palette"` is required. Colours are `#rrggbb` or `rgba(r, g, b, a)`.
- Keep labels (`label`, `city`, `roadLabel`, `countryLabel`) readable against `land` and `building`: aim for strong contrast.

Some of the keys: `land` is the base, `landZ0`/`landZ5`/`landZ8` are the base when zoomed far out, `water*` is water, `road*`/`motorway*` are roads and their outlines, `building*` are 3D buildings by height, `sky`/`horizon`/`lightColor` set the 3D view's sky and sunlight, and `halo` outlines text.

Tip: zoomed out, the land and water colours set the mood; zoomed in, the buildings and roads do.
