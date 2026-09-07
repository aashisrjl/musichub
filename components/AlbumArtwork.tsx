import React from 'react';
import { Image, View, StyleSheet, ImageStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Music } from 'lucide-react-native';
import { Colors, Radius } from '@/theme';

interface AlbumArtworkProps {
  uri?: string;
  size?: number;
  style?: ImageStyle;
  borderRadius?: number;
}

export default function AlbumArtwork({
  uri,
  size = 200,
  style,
  borderRadius,
}: AlbumArtworkProps) {
  const radius = borderRadius ?? Radius.lg;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size, borderRadius: radius }, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        styles.placeholder,
        style,
      ]}>
      <LinearGradient
        colors={[Colors.purple, Colors.burgundy]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Music size={size * 0.3} color={Colors.gold} strokeWidth={1.5} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
