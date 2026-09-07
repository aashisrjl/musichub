import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Heart,
  ChevronDown,
  Disc3,
} from 'lucide-react-native';
import AlbumArtwork from './AlbumArtwork';
import ProgressBar from './ProgressBar';
import PlaybackControls from './PlaybackControls';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function formatTime(millis: number): string {
  if (!millis || millis <= 0) return '0:00';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function FullPlayer() {
  const {
    currentSong,
    isPlaying,
    position,
    duration,
    isShuffleEnabled,
    repeatMode,
    isPlayerVisible,
    hidePlayer,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeatMode,
    toggleFavorite,
    isFavorite,
    seekTo,
  } = usePlayer();

  const progress = duration > 0 ? position / duration : 0;

  const handleSeek = useCallback(
    (p: number) => {
      if (duration > 0) {
        seekTo(p * duration);
      }
    },
    [duration, seekTo],
  );

  if (!currentSong) return null;

  const fav = isFavorite(currentSong.id);

  if (!isPlayerVisible) return null;

  return (
    <View style={[styles.container, { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100, height: SCREEN_HEIGHT }]}>
        {/* Blurred background */}
        {currentSong.artwork ? (
          <View style={StyleSheet.absoluteFillObject}>
            <View style={StyleSheet.absoluteFillObject}>
              <BlurView
                intensity={60}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
              />
            </View>
            <View style={StyleSheet.absoluteFillObject}>
              <AlbumArtwork
                uri={currentSong.artwork}
                size={SCREEN_WIDTH}
                borderRadius={0}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
            <View style={styles.darkOverlay} />
          </View>
        ) : (
          <LinearGradient
            colors={[Colors.purple, Colors.burgundy, Colors.background]}
            style={StyleSheet.absoluteFillObject}
          />
        )}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={hidePlayer}
              style={styles.headerButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <ChevronDown size={28} color={Colors.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerLabel}>Now Playing</Text>
            </View>
            <View style={styles.headerButton} />
          </View>

          {/* Album artwork */}
          <View style={styles.artworkContainer}>
            <AlbumArtwork
              uri={currentSong.artwork}
              size={SCREEN_WIDTH - Spacing.xl * 2}
              borderRadius={Radius.xxl}
            />
          </View>

          {/* Song info */}
          <View style={styles.songInfo}>
            <View style={styles.titleRow}>
              <View style={styles.titleInfo}>
                <Text style={styles.title} numberOfLines={2}>
                  {currentSong.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {currentSong.artist}
                </Text>
                {currentSong.album ? (
                  <View style={styles.albumRow}>
                    <Disc3 size={14} color={Colors.textTertiary} />
                    <Text style={styles.album} numberOfLines={1}>
                      {currentSong.album}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(currentSong.id)}
                style={styles.heartButton}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <Heart
                  size={28}
                  color={fav ? Colors.gold : Colors.textSecondary}
                  fill={fav ? Colors.gold : 'transparent'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressSection}>
            <ProgressBar
              progress={progress}
              onSeek={handleSeek}
              height={5}
            />
            <View style={styles.timeRow}>
              <Text style={styles.time}>{formatTime(position)}</Text>
              <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <PlaybackControls
              isPlaying={isPlaying}
              isShuffleEnabled={isShuffleEnabled}
              repeatMode={repeatMode}
              onPlayPause={togglePlayPause}
              onPrevious={playPrevious}
              onNext={playNext}
              onShuffle={toggleShuffle}
              onRepeat={cycleRepeatMode}
              size="large"
            />
          </View>

          {/* Bottom info */}
          <View style={styles.bottomInfo}>
            <View style={styles.statusRow}>
              {isShuffleEnabled && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Shuffle On</Text>
                </View>
              )}
              {repeatMode !== 'off' && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    Repeat {repeatMode === 'one' ? 'One' : 'All'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  paddingTop: Spacing.xl,
  minHeight: SCREEN_HEIGHT,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 11, 0.75)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl * 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  songInfo: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 34,
    marginBottom: Spacing.xs,
  },
  artist: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  albumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  album: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  heartButton: {
    padding: Spacing.xs,
  },
  progressSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  time: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  bottomInfo: {
    paddingHorizontal: Spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    backgroundColor: Colors.glass,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  statusText: {
    ...Typography.small,
    color: Colors.gold,
    fontWeight: '600',
  },
});
