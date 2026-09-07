import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Heart, MoreHorizontal, Play } from 'lucide-react-native';
import AlbumArtwork from './AlbumArtwork';
import { Song } from '@/types';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

interface SongListItemProps {
  song: Song;
  queue?: Song[];
  onMorePress?: (song: Song) => void;
}

export default function SongListItem({
  song,
  queue,
  onMorePress,
}: SongListItemProps) {
  const { playSong, currentSong, isPlaying, toggleFavorite, isFavorite } =
    usePlayer();
  const isCurrent = currentSong?.id === song.id;
  const fav = isFavorite(song.id);

  const handlePress = () => {
    playSong(song, queue ?? [song]);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.artworkWrapper}>
        <AlbumArtwork uri={song.artwork} size={52} borderRadius={Radius.md} />
        {isCurrent && isPlaying && (
          <View style={styles.playingIndicator}>
            <Play size={12} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.title, isCurrent && styles.titleActive]}
          numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist}
          {song.album ? `  ·  ${song.album}` : ''}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => toggleFavorite(song.id)}
        style={styles.iconButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Heart
          size={20}
          color={fav ? Colors.gold : Colors.textTertiary}
          fill={fav ? Colors.gold : 'transparent'}
          strokeWidth={2}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onMorePress?.(song)}
        style={styles.iconButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MoreHorizontal size={20} color={Colors.textTertiary} />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  pressed: {
    backgroundColor: Colors.surfaceHover,
  borderRadius: Radius.md,
  },
  artworkWrapper: {
    position: 'relative',
  },
  playingIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: 2,
  },
  titleActive: {
    color: Colors.gold,
  },
  artist: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  iconButton: {
    padding: Spacing.sm,
  },
});
