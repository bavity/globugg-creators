# What you can build into Globugg

Everything here ships **inside the app**: on the map, in the video player or in the chat. It's credited to you. Contributions are data and art, never code, so they're safe to run and quick to review.

## <img src=".github/badges/map.svg" width="20" height="20" alt=""> On the map

### Map layers: places worth knowing
A layer is a set of pins people can switch on from the map: **murals, skate spots, street food, free Wi-Fi, water fountains, accessible restrooms, EV chargers, viewpoints, basketball courts, farmers markets…**
When someone turns your layer on, its pins appear under the live buggs, so they can see what's happening *and* what's always there.
→ [`map-layers/`](map-layers/)

### Trails: city quests
A trail is 3-12 spots in a city. Players walk it, **drop a bugg at each spot**, and earn your badge on their profile. Each spot shows a ring on the map until it's done.
Ideas: *Lagos Island after work*, *Brooklyn pizza crawl*, *Deep Ellum murals*, *campus first-week tour*, *best sunsets in Lisbon*.
→ [`trails/`](trails/)

### Challenges: themed weeks
A challenge has a hashtag, dates, an optional area and a badge. Buggs tagged with it light up on the map with a special pin, and the top ones are featured.
Ideas: *#sunsetweek*, *#streetfoodfriday*, *#rainydays*, *#marathonmorning* (around a race route), *#campusmoveinday*.
→ [`challenges/`](challenges/)

### Map themes: how the whole map looks
A full colour palette for the map: neon nights, retro paper, pastel, high contrast for low vision, colour-blind friendly. People choose it in Settings.
→ [`map-themes/`](map-themes/)

## <img src=".github/badges/clapperboard.svg" width="20" height="20" alt=""> On the videos

### Video frames
A transparent overlay recorded on top of a bugg: festival borders, team colours, birthday confetti, "live from…" banners. It's picked in the recorder.
→ [`video-frames/`](video-frames/)

### Sticker packs
Characters for the app's moments: the welcome screen, "Saved!" toasts, empty screens, badges and chat reactions.
→ [`stickers/`](stickers/)

## <img src=".github/badges/volume-2.svg" width="20" height="20" alt=""> In your ears

### Sound packs
The little tones for likes, saves, comments, a bugg going live, boosts, arriving and signing in: kalimba, 8-bit, lo-fi, nature, a city's street sounds. People pick a pack in Settings.
→ [`sound-packs/`](sound-packs/)

## <img src=".github/badges/message-circle.svg" width="20" height="20" alt=""> In the live chat

### Chat chips
The one-tap questions under a live video ("Is it busy right now?"), for each kind of place and in each language.
→ [`chat-chips/`](chat-chips/)

## Coming next

These come once the first types are live. Tell us in an [idea](../../issues/new?template=idea.yml) if you'd build one:

- **Event feeds:** a calendar link (iCal or RSS) for a venue or city, shown as upcoming-event pins (markets, gigs, matches).
- **Pin skins:** custom pin styles for big local events.
- **Translations:** the app in your language.

## How it reaches the app

1. You open a pull request. The automatic check tells you if anything's off.
2. The Globugg team reviews it for quality and safety.
3. On merge, a build bundles everything into **one catalog** (`scripts/build-catalog.mjs`) that the app downloads, so new layers, trails and themes appear **without an app update**.
