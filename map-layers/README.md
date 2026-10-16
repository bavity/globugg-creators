# Map layers

A layer is a set of pins people can switch on from the map, like murals, skate spots or water fountains. It's a [GeoJSON](https://geojson.io) file of points. Draw yours at **geojson.io**, then add the fields below.

File name: lowercase-with-dashes ending in `.geojson`, e.g. `lagos-street-food.geojson`. See [`dallas-murals.geojson`](dallas-murals.geojson).

```json
{
  "type": "FeatureCollection",
  "name": "Lagos street food",
  "category": "food",
  "icon": "🍢",
  "description": "Stalls that are usually open in the evening.",
  "author": { "name": "Your name", "github": "your-username" },
  "license": "CC-BY-4.0",
  "features": [
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [3.3958, 6.4541] }, "properties": { "name": "Suya spot", "note": "Best after 7 pm." } }
  ]
}
```

- **Coordinates are `[longitude, latitude]`**, longitude first, as GeoJSON requires.
- 1 to 500 places. Each needs `properties.name`; `note` is optional (160 characters max).
- `icon`: one emoji for the layer's pins.
- `license`: `CC-BY-4.0` if you gathered the places yourself, or `ODbL-1.0` if they come from OpenStreetMap (then say so in `description`).
- Public places only. Layers are checked for accuracy before they go live, and places that close are removed.
