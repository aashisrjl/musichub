import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Music } from 'lucide-react-native';
import { SongCategory } from '@/types';
import { Colors, Typography, Spacing, Radius } from '@/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface CategoryCardProps {
  label: string;
  description: string;
  songCount: number;
  category: SongCategory;
  onPress: () => void;
}

export default function CategoryCard({
  label,
  description,
  songCount,
  onPress,
}: CategoryCardProps) {
  const isNepali = label.toLowerCase().includes('nepali');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <LinearGradient
        colors={
          isNepali
            ? [Colors.purple, Colors.burgundy]
            : [Colors.burgundy, Colors.purple]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.iconWrapper}>
          <Music size={24} color={Colors.gold} strokeWidth={1.5} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          <Text style={styles.count}>{songCount} songs</Text>
        </View>
        <ChevronRight size={22} color={Colors.textSecondary} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  label: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  count: {
    ...Typography.small,
    color: Colors.gold,
    fontWeight: '600',
  },
});
