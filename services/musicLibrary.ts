import { Song } from '@/types';
import { SONGS, CATEGORIES } from '@/data/songs';

export function getAllSongs(): Song[] {
  return SONGS;
}

export function getSongsByCategory(category: string): Song[] {
  return SONGS.filter((song) => song.category === category);
}

export function getOldNepaliSongs(): Song[] {
  return getSongsByCategory('old_nepali');
}

export function getOldHindiSongs(): Song[] {
  return getSongsByCategory('old_hindi');
}

export function getSongById(id: string): Song | undefined {
  return SONGS.find((song) => song.id === id);
}

export function searchSongs(query: string): Song[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];
  return SONGS.filter((song) => {
    return (
      song.title.toLowerCase().includes(trimmed) ||
      song.artist.toLowerCase().includes(trimmed) ||
      (song.album?.toLowerCase().includes(trimmed) ?? false) ||
      song.category.toLowerCase().includes(trimmed)
    );
  });
}

export function getRecentlyPlayedSongs(recentlyPlayedIds: string[]): Song[] {
  return recentlyPlayedIds
    .map((id) => getSongById(id))
    .filter((song): song is Song => song !== undefined);
}

export function getFavoriteSongs(favoriteIds: string[]): Song[] {
  return favoriteIds
    .map((id) => getSongById(id))
    .filter((song): song is Song => song !== undefined);
}

export function getFeaturedSong(): Song | undefined {
  return SONGS[0];
}

export function getCategoryCount(category: string): number {
  return getSongsByCategory(category).length;
}

export function getCategories() {
  return CATEGORIES;
}
