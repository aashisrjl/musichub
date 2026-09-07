import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { Song } from '@/types';

export interface DeviceScanResult {
  songs: Song[];
  error: string | null;
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') return false;
    const { status } = await MediaLibrary.requestPermissionsAsync(false);
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function checkMediaLibraryPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') return false;
    const { status } = await MediaLibrary.getPermissionsAsync(false);
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scanDeviceMusic(): Promise<DeviceScanResult> {
  try {
    if (Platform.OS === 'web') {
      return {
        songs: [],
        error: 'Device music scanning is not available on web. Use the bundled library instead.',
      };
    }

    const hasPermission = await checkMediaLibraryPermission();
    if (!hasPermission) {
      const granted = await requestMediaLibraryPermission();
      if (!granted) {
        return {
          songs: [],
          error: 'Permission denied. Grant media library access to scan your device for music.',
        };
      }
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 2000,
      sortBy: ['default', false],
    });

    const songs: Song[] = media.assets
      .filter((asset) => asset.duration > 0)
      .map((asset, index) => {
        const filename = asset.filename.replace(/\.[^/.]+$/, '');
        return {
          id: `device_${asset.id}`,
          title: filename,
          artist: 'Unknown Artist',
          category: 'device' as const,
          audioUri: asset.uri,
          artwork: index % 2 === 0 ? require('../public/logo.png') : require('../public/banner.jpeg'),
        };
      });

    return { songs, error: null };
  } catch {
    return {
      songs: [],
      error: 'Unable to scan device music. Please try again later.',
    };
  }
}
