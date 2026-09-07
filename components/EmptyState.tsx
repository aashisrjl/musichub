import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Music } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  style?: ViewStyle;
}

export default function EmptyState({
  icon,
  title,
  message,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        {icon ?? <Music size={32} color={Colors.gold} strokeWidth={1.5} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
