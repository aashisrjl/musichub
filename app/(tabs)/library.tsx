import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Heart, ChevronRight, Smartphone } from 'lucide-react-native';
import CategoryCard from '@/components/CategoryCard';
import EmptyState from '@/components/EmptyState';
import { Colors, Typography, Spacing } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';
import {
  getCategoryCount,
  getAllSongs,
  getRecentlyPlayedSongs,
  getFavoriteSongs,
  getCategories,
} from '@/services/musicLibrary';

export default function LibraryScreen() {
  const router = useRouter();
  const { recentlyPlayed, favorites } = usePlayer();

  const allSongs = getAllSongs();
  const categories = getCategories();
  const recentSongs = useMemo(
    () => getRecentlyPlayedSongs(recentlyPlayed),
    [recentlyPlayed],
  );
  const favSongs = useMemo(() => getFavoriteSongs(favorites), [favorites]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../public/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Your Library</Text>
        </View>
      </View>

      {allSongs.length === 0 ? (
        <EmptyState
          title="No music found"
          message="Add your music files to:\n\nassets/musics/old_nepali/\nassets/musics/old_hindi/"
        />
      ) : (
        <>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Categories</Text>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.key}
                label={cat.label}
                description={cat.description}
                songCount={getCategoryCount(cat.key)}
                category={cat.key}
                onPress={() => router.push(`/category/${cat.key}`)}
              />
            ))}
          </View>

          {/* Device Music */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/device-music')}
            activeOpacity={0.7}>
            <View style={styles.listIcon}>
              <Smartphone size={22} color={Colors.gold} />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Device Music</Text>
              <Text style={styles.listSubtitle}>All music on your phone</Text>
            </View>
            <ChevronRight size={20} color={Colors.textTertiary} />
          </TouchableOpacity>

          {/* Recently Played */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/')}
            activeOpacity={0.7}>
            <View style={styles.listIcon}>
              <Clock size={22} color={Colors.gold} />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Recently Played</Text>
              <Text style={styles.listSubtitle}>
                {recentSongs.length} songs
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textTertiary} />
          </TouchableOpacity>

          {/* Favorites */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/favorites')}
            activeOpacity={0.7}>
            <View style={styles.listIcon}>
              <Heart size={22} color={Colors.gold} />
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listTitle}>Favorites</Text>
              <Text style={styles.listSubtitle}>{favSongs.length} songs</Text>
            </View>
            <ChevronRight size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
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
    paddingBottom: 24,
  },
  header: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
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
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    ...Typography.small,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: 2,
  },
  listSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
