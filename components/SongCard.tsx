import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AlbumArtwork from './AlbumArtwork';
import { Song } from '@/types';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

const CARD_WIDTH = Math.min(Dimensions.get('window').width * 0.42, 180);

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export default function SongCard({ song, queue }: SongCardProps) {
  const { playSong, isPlaying, currentSong } = usePlayer();
  const isCurrent = currentSong?.id === song.id;

  const handlePlay = () => {
    playSong(song, queue ?? [song]);
  };

  return (
    <Pressable
      onPress={handlePlay}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.artworkContainer}>
        <AlbumArtwork uri={song.artwork} size={CARD_WIDTH} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.artworkOverlay}
        />
        <View
          style={[
            styles.playButton,
            isCurrent && isPlaying && styles.playButtonActive,
          ]}>
          <Play
            size={20}
            color={Colors.text}
            fill={Colors.text}
            strokeWidth={0}
          />
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {song.title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {song.artist}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: Spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  artworkContainer: {
    position: 'relative',
    marginBottom: Spacing.sm + 2,
  borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  artworkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  playButton: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: Colors.burgundy,
  },
  title: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: 2,
  },
  artist: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
