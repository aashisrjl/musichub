import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Music } from 'lucide-react-native';
import AlbumArtwork from './AlbumArtwork';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    showPlayer,
    isPlayerVisible,
  } = usePlayer();

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim]);

  if (!currentSong || isPlayerVisible) return null;

  return (
    <Pressable
      onPress={showPlayer}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <LinearGradient
        colors={[Colors.surfaceElevated, Colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}>
        <View style={styles.artworkContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <AlbumArtwork
              uri={currentSong.artwork}
              size={44}
              borderRadius={Radius.sm}
            />
          </Animated.View>
          {isPlaying && (
            <View style={styles.playingIndicator}>
              <Music size={10} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
            </View>
          )}
        </View>
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
              color={Colors.background}
              fill={Colors.background}
              strokeWidth={0}
            />
          ) : (
            <Play
              size={22}
              color={Colors.background}
              fill={Colors.background}
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
  artworkContainer: {
    position: 'relative',
  },
  playingIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1.5,
    borderColor: Colors.gold,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
