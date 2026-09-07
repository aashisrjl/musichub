import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Music } from 'lucide-react-native';
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
  const { playSong, togglePlayPause, currentSong, isPlaying } = usePlayer();
  const isCurrent = currentSong?.id === song.id;
  
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isCurrent && isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCurrent, isPlaying, pulseAnim]);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song, queue ?? [song]);
    }
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
          <View style={styles.artworkContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <AlbumArtwork
                uri={song.artwork}
                size={120}
                borderRadius={Radius.lg}
              />
            </Animated.View>
            {isCurrent && isPlaying && (
              <View style={styles.playingIndicator}>
                <Music size={16} color={Colors.gold} fill={Colors.gold} strokeWidth={0} />
              </View>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.featuredLabel}>Featured</Text>
            <Text style={styles.title} numberOfLines={2}>
              {song.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {song.artist}
            </Text>
            <View style={styles.playRow}>
              <TouchableOpacity
                onPress={handlePlay}
                style={styles.playButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {isCurrent && isPlaying ? (
                  <Pause size={20} color={Colors.background} fill={Colors.background} strokeWidth={0} />
                ) : (
                  <Play size={20} color={Colors.background} fill={Colors.background} strokeWidth={0} style={{ marginLeft: 2 }} />
                )}
              </TouchableOpacity>
              <Text style={styles.playLabel}>
                {isCurrent && isPlaying ? 'Pause' : 'Play'}
              </Text>
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
  artworkContainer: {
    position: 'relative',
  },
  playingIndicator: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: Colors.gold,
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
    gap: Spacing.sm,
  },
  playButton: {
    backgroundColor: Colors.gold,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playLabel: {
    ...Typography.label,
    color: Colors.text,
    fontWeight: '600',
  },
});
