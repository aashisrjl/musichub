import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Heart } from 'lucide-react-native';
import SongListItem from '@/components/SongListItem';
import EmptyState from '@/components/EmptyState';
import { Colors, Typography, Spacing } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';
import { getFavoriteSongs } from '@/services/musicLibrary';

export default function FavoritesScreen() {
  const { favorites } = usePlayer();
  const favSongs = useMemo(() => getFavoriteSongs(favorites), [favorites]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../public/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Favorites</Text>
        </View>
        {favSongs.length > 0 && (
          <Text style={styles.count}>{favSongs.length} songs</Text>
        )}
      </View>

      {favSongs.length === 0 ? (
        <EmptyState
          icon={<Heart size={32} color={Colors.gold} strokeWidth={1.5} />}
          title="No favorites yet"
          message="Tap the heart icon to save your favorite songs."
        />
      ) : (
        <FlatList
          data={favSongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongListItem song={item} queue={favSongs} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
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
  count: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 120,
  },
});
