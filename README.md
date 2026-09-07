# MusicHub

**Your collection of timeless classics.**

A premium offline music player for React Native + Expo. No login, no internet, no server — just your music.

---

## Quick Start

1. Open the app — it launches directly, no authentication needed.
2. Browse by category (Old Nepali, Old Hindi) or search.
3. Tap a song to play it. The mini-player appears above the tab bar.
4. Tap the mini-player to open the full-screen player.

---

## Adding Your Music Files

### Where to place files

Place your `.mp3` files in:

```
assets/musics/old_nepali/    ← Nepali songs
assets/musics/old_hindi/     ← Hindi songs
```

For **web development/preview**, you can also use:

```
public/musics/old_nepali/
public/musics/old_hindi/
```

### Registering songs

Open `data/songs.ts` and add an entry for each song:

```typescript
{
  id: 'nepali_1',
  title: 'Resham Firiri',
  artist: 'Narayan Gopal',
  album: 'Classic Hits',
  category: 'old_nepali',
  audioUri: require('../assets/musics/old_nepali/resham_firiri.mp3'),
  artwork: 'https://example.com/album-art.jpg',  // optional
},
```

That's it — the song appears everywhere automatically (Home, Library, Search).

### Adding a new category

1. Add the key to `SongCategory` in `types/index.ts`:
   ```typescript
   export type SongCategory = 'old_nepali' | 'old_hindi' | 'old_english';
   ```
2. Add an entry to `CATEGORIES` in `data/songs.ts`
3. Add songs with that category

No other code changes needed.

---

## Features

- **Offline playback** — bundled audio files, no internet required
- **Full player controls** — play, pause, previous, next, seek, shuffle, repeat (off/all/one)
- **Mini-player** — persistent above tab bar, tap to expand
- **Full-screen player** — blurred artwork background, large controls
- **Favorites** — tap heart on any song, stored locally
- **Recently Played** — last 20 songs, shown on Home and Library
- **Search** — instant offline search by title, artist, album, category
- **Sleep Timer** — 15/30/45/60/90 min or custom, pauses music at zero
- **Background playback** — continues when screen is locked or app is backgrounded
- **Local storage** — favorites, recently played, and settings saved via AsyncStorage

---

## Architecture

```
data/songs.ts           ← Song registry (the ONLY file you edit to add music)
services/musicLibrary.ts ← Query functions (getAllSongs, searchSongs, etc.)
context/PlayerProvider.tsx ← Global audio state + playback logic
context/PlayerContext.ts  ← Context type + usePlayer hook
types/index.ts           ← TypeScript types
theme/index.ts           ← Colors, spacing, typography
components/              ← All UI components
app/(tabs)/              ← Tab screens (Home, Library, Search, Favorites, Settings)
app/category/[id].tsx    ← Category detail screen
```

## Version

1.0.0
