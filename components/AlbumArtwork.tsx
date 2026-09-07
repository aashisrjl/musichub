import React from 'react';
import { Image, View, StyleSheet, ImageStyle } from 'react-native';
import { Colors, Radius } from '@/theme';

interface AlbumArtworkProps {
  uri?: string | number | any;
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

  const fallbackUri = require('../public/logo.png');
  const actualUri = uri || fallbackUri;
  const imageSource = typeof actualUri === 'string' ? { uri: actualUri } : actualUri;

  return (
    <Image
      source={imageSource}
      style={[{ width: size, height: size, borderRadius: radius }, style]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({});
