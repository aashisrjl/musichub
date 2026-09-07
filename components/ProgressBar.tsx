import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Radius, Spacing } from '@/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  onSeek?: (progress: number) => void;
  style?: ViewStyle;
  trackColor?: string;
  fillColor?: string;
  height?: number;
}

export default function ProgressBar({
  progress,
  onSeek,
  style,
  trackColor = Colors.border,
  fillColor = Colors.gold,
  height = 4,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const [trackWidth, setTrackWidth] = React.useState(0);
  const [isSeeking, setIsSeeking] = React.useState(false);
  const [seekProgress, setSeekProgress] = React.useState(clampedProgress);

  const handlePress = (evt: GestureResponderEvent) => {
    if (!onSeek || trackWidth === 0) return;
    const x = evt.nativeEvent.locationX;
    const p = Math.max(0, Math.min(1, x / trackWidth));
    onSeek(p);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSeeking(true);
      },
      onPanResponderMove: (evt) => {
        if (trackWidth === 0) return;
        const x = evt.nativeEvent.moveX;
        const p = Math.max(0, Math.min(1, x / trackWidth));
        setSeekProgress(p);
      },
      onPanResponderRelease: (evt) => {
        if (trackWidth === 0 || !onSeek) return;
        const x = evt.nativeEvent.moveX;
        const p = Math.max(0, Math.min(1, x / trackWidth));
        setIsSeeking(false);
        onSeek(p);
      },
      onPanResponderTerminate: () => {
        setIsSeeking(false);
      },
    }),
  ).current;

  const displayProgress = isSeeking ? seekProgress : clampedProgress;

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
      <Pressable
        onPress={handlePress}
        style={[styles.track, { backgroundColor: trackColor, height }]}
        hitSlop={{ top: 20, bottom: 20 }}>
        <View
          style={[
            styles.fill,
            {
              width: `${displayProgress * 100}%`,
              backgroundColor: fillColor,
              height,
            },
          ]}
        />
      </Pressable>
      <View
        style={[
          styles.thumb,
          {
            left: `${displayProgress * 100}%`,
            transform: [{ scale: isSeeking ? 1.2 : 1 }],
          },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  track: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.gold,
    marginLeft: -7,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});
