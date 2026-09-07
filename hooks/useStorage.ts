import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: '@musichub_favorites',
  RECENTLY_PLAYED: '@musichub_recently_played',
  SETTINGS: '@musichub_settings',
} as const;

export const StorageKeys = KEYS;

export async function loadFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveFavorites(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export async function loadRecentlyPlayed(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.RECENTLY_PLAYED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveRecentlyPlayed(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.RECENTLY_PLAYED, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export async function loadSettings<T>(defaults: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<T>) } : defaults;
  } catch {
    return defaults;
  }
}

export async function saveSettings<T>(settings: T): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export async function clearRecentlyPlayed(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.RECENTLY_PLAYED);
  } catch {
    // ignore
  }
}

export async function clearFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.FAVORITES);
  } catch {
    // ignore
  }
}
