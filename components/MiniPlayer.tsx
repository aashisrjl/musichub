import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause } from 'lucide-react-native';
import AlbumArtwork from './AlbumArtwork';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    showPlayer,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <Pressable
      onPress={showPlayer}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <LinearGradient
        colors={[Colors.surfaceElevated, Colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}>
        <AlbumArtwork
          uri={currentSong.artwork}
          size={44}
          borderRadius={Radius.sm}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.playButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          {isPlaying ? (
            <Pause
              size={22}
              color={Colors.text}
              fill={Colors.text}
              strokeWidth={0}
            />
          ) : (
            <Play
              size={22}
              color={Colors.text}
              fill={Colors.text}
              strokeWidth={0}
              style={{ marginLeft: 2 }}
            />
          )}
        </TouchableOpacity>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.sm + 2,
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
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
