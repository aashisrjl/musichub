import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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
        <Text style={styles.title}>Favorites</Text>
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
