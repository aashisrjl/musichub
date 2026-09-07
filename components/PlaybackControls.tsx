import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react-native';
import { Colors, Spacing } from '@/theme';
import { RepeatMode } from '@/types';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isShuffleEnabled: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  size?: 'normal' | 'large';
}

export default function PlaybackControls({
  isPlaying,
  isShuffleEnabled,
  repeatMode,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  size = 'normal',
}: PlaybackControlsProps) {
  const isLarge = size === 'large';
  const sideIconSize = isLarge ? 26 : 22;
  const centerIconSize = isLarge ? 34 : 28;
  const playButtonSize = isLarge ? 72 : 56;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onShuffle}
          style={styles.controlButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Shuffle
            size={sideIconSize}
            color={isShuffleEnabled ? Colors.gold : Colors.textSecondary}
            strokeWidth={2}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPrevious}
          style={styles.controlButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <SkipBack
            size={sideIconSize}
            color={Colors.text}
            fill={Colors.text}
            strokeWidth={0}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPlayPause}
          style={[
            styles.playButton,
            { width: playButtonSize, height: playButtonSize },
          ]}
          activeOpacity={0.8}>
          {isPlaying ? (
            <Pause
              size={centerIconSize}
              color={Colors.background}
              fill={Colors.background}
              strokeWidth={0}
            />
          ) : (
            <Play
              size={centerIconSize}
              color={Colors.background}
              fill={Colors.background}
              strokeWidth={0}
              style={{ marginLeft: 3 }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          style={styles.controlButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <SkipForward
            size={sideIconSize}
            color={Colors.text}
            fill={Colors.text}
            strokeWidth={0}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRepeat}
          style={styles.controlButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          {repeatMode === 'one' ? (
            <Repeat1
              size={sideIconSize}
              color={Colors.gold}
              strokeWidth={2}
            />
          ) : (
            <Repeat
              size={sideIconSize}
              color={repeatMode === 'all' ? Colors.gold : Colors.textSecondary}
              strokeWidth={2}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  playButton: {
    borderRadius: 999,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
