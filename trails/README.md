# Trails

A trail is a short city quest: 3-12 spots. Players drop a bugg at each spot to earn the trail's badge.

File name: lowercase-with-dashes, e.g. `lagos-island.json`. See [`dallas-downtown.json`](dallas-downtown.json).

```json
{
  "title": "Lagos Island after work",
  "city": "Lagos",
  "country": "NG",
  "author": { "name": "Your name", "github": "your-username" },
  "badge": { "name": "Island Hopper", "sticker": "wave" },
  "description": "From the jetty to the market before sunset.",
  "spots": [
    { "name": "Tarkwa Bay", "lat": 6.402, "lng": 3.395, "tags": ["beach"], "why": "Boats out from the jetty, surfers in the afternoon." }
  ]
}
```

- **3 to 12 spots**, each with a real `lat`/`lng` (right-click the place in Google Maps or Apple Maps to copy them). A spot counts when a bugg is dropped within about 150 m of it.
- `why`: one line, 10-160 characters.
- `badge.sticker`: one of the app's stickers (`wink`, `cool`, `thinking`, `laugh`, `thumbsup`, `boba`, `wave`, `giggle`, `cute`), or one from a sticker pack once it's merged.
- **Public places only**, and nothing that sends people somewhere unsafe or onto private property.
