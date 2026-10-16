# Challenges

A challenge is a themed week. Buggs tagged with its hashtag get a special pin on the map, and the best ones are featured.

File name: lowercase-with-dashes, e.g. `sunset-week.json`. See [`sunset-week.json`](sunset-week.json).

```json
{
  "title": "Sunset Week",
  "hashtag": "sunsetweek",
  "description": "Drop a bugg of the sunset from anywhere.",
  "starts": "2026-11-02",
  "ends": "2026-11-08",
  "area": null,
  "badge": { "name": "Golden Hour", "sticker": "cool" },
  "author": { "name": "Your name", "github": "your-username" }
}
```

- `hashtag`: 3-30 lowercase letters and numbers, without the `#`.
- `starts` and `ends` are dates (YYYY-MM-DD), 31 days at most. Submit at least two weeks ahead so it can be scheduled.
- `area`: `null` for anywhere, or `{ "lat": 6.45, "lng": 3.39, "radiusKm": 5 }` for one place (0.1-50 km), such as a festival or a race route.
- `badge.sticker`: one of the app's stickers (see [trails](../trails/README.md)).
