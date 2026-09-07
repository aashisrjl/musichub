import { createContext, useContext } from 'react';
import type { Song, RepeatMode } from '@/types';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  isShuffleEnabled: boolean;
  repeatMode: RepeatMode;
  isPlayerVisible: boolean;
  sleepTimerActive: boolean;
  sleepTimerRemaining: number;
  error: string | null;
}

export interface PlayerContextValue extends PlayerState {
  favorites: string[];
  recentlyPlayed: string[];
  autoplay: boolean;
  darkTheme: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlayPause: () => void;
  seekTo: (positionMillis: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
  setSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  clearRecentlyPlayed: () => void;
  clearFavorites: () => void;
  setAutoplay: (enabled: boolean) => void;
  setDarkTheme: (enabled: boolean) => void;
}

export const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}
