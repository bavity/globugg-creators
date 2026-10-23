# Map layers

A layer is a set of pins people can switch on from the map, like murals, skate spots or water fountains. It's a [GeoJSON](https://geojson.io) file of points. Draw yours at **geojson.io**, then add the fields below.

File name: lowercase-with-dashes ending in `.geojson`, e.g. `lagos-street-food.geojson`. See [`dallas-murals.geojson`](dallas-murals.geojson).

```json
{
  "type": "FeatureCollection",
  "name": "Lagos street food",
  "category": "food",
  "icon": "utensils",
  "description": "Stalls that are usually open in the evening.",
  "author": { "name": "Your name", "github": "your-username" },
  "license": "CC-BY-4.0",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [3.3958, 6.4541] },
      "properties": {
        "name": "Suya spot",
        "note": "Best after 7 pm.",
        "address": "12 Admiralty Way, Lekki Phase 1, Lagos",
        "image": "suya-spot.jpg",
        "imageCredit": "Photo: Your name"
      }
    }
  ]
}
```

- **Coordinates are `[longitude, latitude]`**, longitude first, as GeoJSON requires.
- 1 to 500 places. Each needs `properties.name`; `note` is optional (160 characters max).
- `address` is optional (120 characters max). It shows on the place's card, and people can tap to copy it.
- `image` is an optional photo of the place, shown at the top of its card next to the **Go** button. Put it in a folder named after your layer, e.g. `map-layers/lagos-street-food/suya-spot.jpg`.
  - JPG or WebP, landscape, 800 to 1600 pixels wide, 400 KB max. The card crops it to 16:9, so keep the subject in the middle.
  - Your own photo, or one with an open licence (CC0, CC BY, CC BY-SA, public domain, or the Unsplash License). No faces in focus, no watermarks.
  - `imageCredit` is required with a photo: who took it and its licence, e.g. `Photo: Jane Doe, CC BY-SA 4.0, via Wikimedia Commons`. Photos keep their own licence; the rest of your layer is shared under CC BY 4.0.
- `icon`: the name of an icon for the layer's pins, from [`icons/`](../icons/) (e.g. `palette`, `utensils`, `music`). Need one that isn't there? Ask in an issue.
- `license`: `CC-BY-4.0` if you gathered the places yourself, or `ODbL-1.0` if they come from OpenStreetMap (then say so in `description`).
- Public places only. Layers are checked for accuracy before they go live, and places that close are removed.
