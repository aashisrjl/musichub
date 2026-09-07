import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Smartphone, RefreshCw } from 'lucide-react-native';
import SongListItem from '@/components/SongListItem';
import EmptyState from '@/components/EmptyState';
import MiniPlayer from '@/components/MiniPlayer';
import FullPlayer from '@/components/FullPlayer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { Song } from '@/types';
import { scanDeviceMusic, requestMediaLibraryPermission } from '@/services/deviceMusic';

export default function DeviceMusicScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const doScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await scanDeviceMusic();
    setSongs(result.songs);
    setError(result.error);
    setLoading(false);
    setHasScanned(true);
  }, []);

  React.useEffect(() => {
    doScan();
  }, [doScan]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <ChevronLeft size={26} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerContent}>
            <Image 
              source={require('../public/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Device Music</Text>
          </View>
          <Text style={styles.count}>
            {loading ? 'Scanning...' : `${songs.length} songs found`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={doScan}
          style={styles.refreshButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <RefreshCw size={20} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      {loading && !hasScanned ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Scanning your device for music...</Text>
        </View>
      ) : error && songs.length === 0 ? (
        <EmptyState
          icon={<Smartphone size={32} color={Colors.gold} strokeWidth={1.5} />}
          title="No device music"
          message={error}
        />
      ) : songs.length === 0 ? (
        <EmptyState
          icon={<Smartphone size={32} color={Colors.gold} strokeWidth={1.5} />}
          title="No music found on device"
          message="No audio files were found on your device. Make sure you have music files saved locally."
        />
      ) : (
        <>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SongListItem song={item} queue={songs} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={doScan}
                tintColor={Colors.gold}
                colors={[Colors.gold]}
              />
            }
          />
        </>
      )}
      <FullPlayer />
      <View style={{ position: 'absolute', bottom: insets.bottom, left: 0, right: 0 }}>
        <MiniPlayer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
  },
  count: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.2)',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
});
