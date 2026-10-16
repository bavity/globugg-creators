# Chat chips

Chips are the one-tap questions under a live video, like "Is it busy right now?". They help people ask the person who's *there*.

File name: `<language>-<category>.json`, e.g. `en-food.json` or `pt-BR-events.json`.

```json
{
  "language": "en",
  "category": "food",
  "author": { "name": "Your name", "github": "your-username" },
  "chips": ["Rate the food ⭐", "Is it busy right now?", "Worth the wait?"]
}
```

- **3 to 12 chips**, each **32 characters or fewer**.
- Questions about *right now* work best: busy? queue? still on? worth it?
- One emoji at most per chip. Keep them friendly and neutral.
