import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AlbumArtwork from './AlbumArtwork';
import { Song } from '@/types';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;

interface FeaturedCardProps {
  song: Song;
  queue?: Song[];
}

export default function FeaturedCard({ song, queue }: FeaturedCardProps) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isCurrent = currentSong?.id === song.id;

  const handlePlay = () => {
    playSong(song, queue ?? [song]);
  };

  return (
    <Pressable
      onPress={handlePlay}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <LinearGradient
        colors={[Colors.purple, Colors.burgundy, Colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.content}>
          <AlbumArtwork
            uri={song.artwork}
            size={120}
            borderRadius={Radius.lg}
          />
          <View style={styles.info}>
            <Text style={styles.featuredLabel}>Featured</Text>
            <Text style={styles.title} numberOfLines={2}>
              {song.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {song.artist}
            </Text>
            <View style={styles.playRow}>
              <View style={styles.playButton}>
                {isCurrent && isPlaying ? (
                  <Text style={styles.playingText}>Now Playing</Text>
                ) : (
                  <Text style={styles.playText}>Play</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    borderRadius: Radius.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  featuredLabel: {
    ...Typography.small,
    color: Colors.gold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  artist: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
  },
  playText: {
    ...Typography.label,
    color: Colors.background,
    fontWeight: '700',
  },
  playingText: {
    ...Typography.label,
    color: Colors.background,
    fontWeight: '700',
  },
});
