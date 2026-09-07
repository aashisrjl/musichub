import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Settings, Clock, Smartphone, ChevronRight } from 'lucide-react-native';
import FeaturedCard from '@/components/FeaturedCard';
import SongCard from '@/components/SongCard';
import EmptyState from '@/components/EmptyState';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '@/context/PlayerContext';

import {
  getFeaturedSong,
  getRecentlyPlayedSongs,
  getAllSongs,
  getCategories,
  getSongsByCategory,
} from '@/services/musicLibrary';

export default function HomeScreen() {
  const router = useRouter();
  const { recentlyPlayed } = usePlayer();

  const featured = getFeaturedSong();
  const categories = getCategories();
  const recentSongs = useMemo(
    () => getRecentlyPlayedSongs(recentlyPlayed),
    [recentlyPlayed],
  );
  const allSongs = getAllSongs();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../public/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>MusicHub</Text>
            <Text style={styles.subtitle}>Your collection of timeless classics</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/search')}
            style={styles.iconButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Search size={22} color={Colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/settings')}
            style={styles.iconButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Settings size={22} color={Colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image 
          source={require('../../public/banner.jpeg')} 
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      {allSongs.length === 0 ? (
        <EmptyState
          title="No music found"
          message="Add your music files to:\n\nassets/musics/old_nepali/\nassets/musics/old_hindi/"
        />
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <View style={styles.section}>
              <FeaturedCard song={featured} queue={allSongs} />
            </View>
          )}

          {/* Dynamic Categories */}
          {categories.map((category) => {
            const categorySongs = getSongsByCategory(category.key);
            if (categorySongs.length === 0) return null;
            
            return (
              <View key={category.key} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{category.label}</Text>
                  <TouchableOpacity
                    onPress={() => router.push(`/category/${category.key}`)}>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={categorySongs}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <SongCard song={item} queue={categorySongs} />
                  )}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            );
          })}

          {/* Device Music */}
          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={styles.deviceCard}
              onPress={() => router.push('/device-music')}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.surfaceElevated, Colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.deviceGradient}>
              <View style={styles.deviceIcon}>
                <Smartphone size={24} color={Colors.gold} strokeWidth={1.5} />
              </View>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceTitle}>Device Music</Text>
                <Text style={styles.deviceSubtitle}>
                  Browse all music files on your phone
                </Text>
              </View>
              <ChevronRight size={22} color={Colors.textSecondary} />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Recently Played */}
          {recentSongs.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Clock size={18} color={Colors.gold} />
                  <Text style={styles.sectionTitle}>Recently Played</Text>
                </View>
              </View>
              <FlatList
                data={recentSongs.slice(0, 10)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SongCard song={item} queue={recentSongs} />
                )}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingTop: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bannerContainer: {
    marginBottom: Spacing.xl,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: Radius.lg,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.text,
  },
  seeAll: {
    ...Typography.label,
    color: Colors.gold,
  },
  horizontalList: {
    paddingHorizontal: 0,
  },
  deviceCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  deviceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: 2,
  },
  deviceSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
