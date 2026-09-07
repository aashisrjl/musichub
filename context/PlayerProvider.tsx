import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { PlayerContext, PlayerContextValue } from './PlayerContext';
import { Song, RepeatMode, AppSettings } from '@/types';
import {
  loadFavorites,
  saveFavorites,
  loadRecentlyPlayed,
  saveRecentlyPlayed,
  loadSettings,
  saveSettings,
  clearFavorites as clearFavoritesStorage,
  clearRecentlyPlayed as clearRecentlyPlayedStorage,
} from '@/hooks/useStorage';

const DEFAULT_SETTINGS: AppSettings = {
  autoplay: true,
  shuffle: false,
  darkTheme: true,
};

const MAX_RECENT = 20;

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Song[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [autoplay, setAutoplayState] = useState(DEFAULT_SETTINGS.autoplay);
  const [darkTheme, setDarkThemeState] = useState(DEFAULT_SETTINGS.darkTheme);

  // Sleep timer
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(0);
  const sleepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track refs to avoid stale closures in onPlaybackStatusUpdate
  const currentIndexRef = useRef(currentIndex);
  const queueRef = useRef(queue);
  const repeatModeRef = useRef(repeatMode);
  const isShuffleRef = useRef(isShuffleEnabled);
  const originalQueueRef = useRef(originalQueue);

  currentIndexRef.current = currentIndex;
  queueRef.current = queue;
  repeatModeRef.current = repeatMode;
  isShuffleRef.current = isShuffleEnabled;
  originalQueueRef.current = originalQueue;

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      const [favs, recent, settings] = await Promise.all([
        loadFavorites(),
        loadRecentlyPlayed(),
        loadSettings(DEFAULT_SETTINGS),
      ]);
      setFavorites(favs);
      setRecentlyPlayed(recent);
      setAutoplayState(settings.autoplay);
      setDarkThemeState(settings.darkTheme);
      if (settings.shuffle) {
        setIsShuffleEnabled(settings.shuffle);
      }
    })();

    return () => {
      // Cleanup audio on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (status.error) {
          setError(`Unable to play this song.`);
          setIsPlaying(false);
        }
        return;
      }
      setError(null);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        // Handle end of song
        const mode = repeatModeRef.current;
        if (mode === 'one') {
          soundRef.current?.setPositionAsync(0);
          soundRef.current?.playAsync();
        } else {
          // Play next
          const curIdx = currentIndexRef.current;
          const q = queueRef.current;
          if (curIdx < q.length - 1) {
            // There is a next song
            playByIndex(curIdx + 1);
          } else {
            // Last song in queue
            if (mode === 'all') {
              // Loop back to start
              if (isShuffleRef.current && originalQueueRef.current.length > 0) {
                const reshuffled = shuffleArray(originalQueueRef.current);
                setQueue(reshuffled);
                playByIndex(0, reshuffled);
              } else {
                playByIndex(0);
              }
            } else {
              // Repeat off — stop
              setIsPlaying(false);
              soundRef.current?.setPositionAsync(0);
            }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const playByIndex = useCallback(
    async (index: number, customQueue?: Song[]) => {
      const q = customQueue ?? queueRef.current;
      if (index < 0 || index >= q.length) return;

      const song = q[index];
      setCurrentIndex(index);
      currentIndexRef.current = index;

      // Unload previous sound
      if (soundRef.current) {
        try {
          await soundRef.current.unloadAsync();
        } catch {
          // ignore
        }
        soundRef.current = null;
      }

      try {
        setError(null);
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.audioUri },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate,
        );
        soundRef.current = sound;
        setCurrentSong(song);
        setIsPlaying(true);
        setPosition(0);
        setDuration(0);

        // Add to recently played
        setRecentlyPlayed((prev) => {
          const filtered = prev.filter((id) => id !== song.id);
          const updated = [song.id, ...filtered].slice(0, MAX_RECENT);
          saveRecentlyPlayed(updated);
          return updated;
        });
      } catch {
        setError('Unable to play this song.');
        setIsPlaying(false);
      }
    },
    [onPlaybackStatusUpdate],
  );

  const playSong = useCallback(
    (song: Song, queueArg?: Song[]) => {
      const q = queueArg ?? [song];
      setOriginalQueue(q);
      originalQueueRef.current = q;

      let finalQueue = q;
      let index = q.findIndex((s) => s.id === song.id);

      if (isShuffleEnabled && q.length > 1) {
        // Shuffle but keep the selected song first
        const rest = q.filter((s) => s.id !== song.id);
        finalQueue = [song, ...shuffleArray(rest)];
        index = 0;
      }

      setQueue(finalQueue);
      queueRef.current = finalQueue;
      playByIndex(index, finalQueue);
    },
    [isShuffleEnabled, playByIndex],
  );

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch {
      // ignore
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (positionMillis: number) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(positionMillis);
      setPosition(positionMillis);
    } catch {
      // ignore
    }
  }, []);

  const playNext = useCallback(() => {
    const q = queueRef.current;
    const curIdx = currentIndexRef.current;

    if (isShuffleRef.current && q.length > 1) {
      // Pick a random next song different from current
      let randomIdx = curIdx;
      while (randomIdx === curIdx && q.length > 1) {
        randomIdx = Math.floor(Math.random() * q.length);
      }
      playByIndex(randomIdx);
      return;
    }

    if (curIdx < q.length - 1) {
      playByIndex(curIdx + 1);
    } else if (repeatModeRef.current === 'all') {
      if (isShuffleRef.current && originalQueueRef.current.length > 0) {
        const reshuffled = shuffleArray(originalQueueRef.current);
        setQueue(reshuffled);
        playByIndex(0, reshuffled);
      } else {
        playByIndex(0);
      }
    } else {
      // No next, repeat off — stop
      soundRef.current?.setPositionAsync(0);
      setIsPlaying(false);
    }
  }, [playByIndex]);

  const playPrevious = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.positionMillis > 3000) {
        await soundRef.current.setPositionAsync(0);
        setPosition(0);
        return;
      }
    } catch {
      // ignore
    }

    const q = queueRef.current;
    const curIdx = currentIndexRef.current;

    if (curIdx > 0) {
      playByIndex(curIdx - 1);
    } else if (repeatModeRef.current === 'all') {
      playByIndex(q.length - 1);
    } else {
      soundRef.current?.setPositionAsync(0);
      setPosition(0);
    }
  }, [playByIndex]);

  const toggleShuffle = useCallback(() => {
    setIsShuffleEnabled((prev) => {
      const next = !prev;
      if (next && originalQueueRef.current.length > 1) {
        // Shuffle the queue, keeping current song at its position
        const curSong = queueRef.current[currentIndexRef.current];
        if (curSong) {
          const rest = originalQueueRef.current.filter(
            (s) => s.id !== curSong.id,
          );
          const shuffled = [curSong, ...shuffleArray(rest)];
          setQueue(shuffled);
          queueRef.current = shuffled;
          setCurrentIndex(0);
          currentIndexRef.current = 0;
        }
      } else if (!next && originalQueueRef.current.length > 0) {
        // Restore original order
        const curSong = queueRef.current[currentIndexRef.current];
        if (curSong) {
          const restored = originalQueueRef.current;
          const newIdx = restored.findIndex((s) => s.id === curSong.id);
          setQueue(restored);
          queueRef.current = restored;
          setCurrentIndex(newIdx);
          currentIndexRef.current = newIdx;
        }
      }
      return next;
    });
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleFavorite = useCallback(
    (songId: string) => {
      setFavorites((prev) => {
        const isFav = prev.includes(songId);
        const updated = isFav
          ? prev.filter((id) => id !== songId)
          : [...prev, songId];
        saveFavorites(updated);
        return updated;
      });
    },
    [],
  );

  const isFavorite = useCallback(
    (songId: string) => favorites.includes(songId),
    [favorites],
  );

  const showPlayer = useCallback(() => setIsPlayerVisible(true), []);
  const hidePlayer = useCallback(() => setIsPlayerVisible(false), []);

  // Sleep timer
  const setSleepTimer = useCallback((minutes: number) => {
    const totalSeconds = minutes * 60;
    setSleepTimerActive(true);
    setSleepTimerRemaining(totalSeconds);

    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }

    sleepTimerRef.current = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev <= 1) {
          // Timer expired — stop music
          if (sleepTimerRef.current) {
            clearInterval(sleepTimerRef.current);
            sleepTimerRef.current = null;
          }
          setSleepTimerActive(false);
          if (soundRef.current) {
            soundRef.current.pauseAsync();
          }
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const cancelSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    setSleepTimerActive(false);
    setSleepTimerRemaining(0);
  }, []);

  const clearRecentlyPlayedHandler = useCallback(() => {
    setRecentlyPlayed([]);
    clearRecentlyPlayedStorage();
  }, []);

  const clearFavoritesHandler = useCallback(() => {
    setFavorites([]);
    clearFavoritesStorage();
  }, []);

  const setAutoplay = useCallback((enabled: boolean) => {
    setAutoplayState(enabled);
    loadSettings(DEFAULT_SETTINGS).then((s) => {
      saveSettings({ ...s, autoplay: enabled });
    });
  }, []);

  const setDarkTheme = useCallback((enabled: boolean) => {
    setDarkThemeState(enabled);
    loadSettings(DEFAULT_SETTINGS).then((s) => {
      saveSettings({ ...s, darkTheme: enabled });
    });
  }, []);

  // Persist shuffle setting
  useEffect(() => {
    loadSettings(DEFAULT_SETTINGS).then((s) => {
      saveSettings({ ...s, shuffle: isShuffleEnabled });
    });
  }, [isShuffleEnabled]);

  const value: PlayerContextValue = useMemo(
    () => ({
      currentSong,
      isPlaying,
      position,
      duration,
      queue,
      currentIndex,
      isShuffleEnabled,
      repeatMode,
      isPlayerVisible,
      sleepTimerActive,
      sleepTimerRemaining,
      error,
      favorites,
      recentlyPlayed,
      autoplay,
      darkTheme,
      playSong,
      togglePlayPause,
      seekTo,
      playNext,
      playPrevious,
      toggleShuffle,
      cycleRepeatMode,
      toggleFavorite,
      isFavorite,
      showPlayer,
      hidePlayer,
      setSleepTimer,
      cancelSleepTimer,
      clearRecentlyPlayed: clearRecentlyPlayedHandler,
      clearFavorites: clearFavoritesHandler,
      setAutoplay,
      setDarkTheme,
    }),
    [
      currentSong,
      isPlaying,
      position,
      duration,
      queue,
      currentIndex,
      isShuffleEnabled,
      repeatMode,
      isPlayerVisible,
      sleepTimerActive,
      sleepTimerRemaining,
      error,
      favorites,
      recentlyPlayed,
      autoplay,
      darkTheme,
      playSong,
      togglePlayPause,
      seekTo,
      playNext,
      playPrevious,
      toggleShuffle,
      cycleRepeatMode,
      toggleFavorite,
      isFavorite,
      showPlayer,
      hidePlayer,
      setSleepTimer,
      cancelSleepTimer,
      clearRecentlyPlayedHandler,
      clearFavoritesHandler,
      setAutoplay,
      setDarkTheme,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
