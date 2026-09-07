import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { X, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

interface SleepTimerModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESETS = [15, 30, 45, 60, 90];

function formatRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SleepTimerModal({
  visible,
  onClose,
}: SleepTimerModalProps) {
  const {
    sleepTimerActive,
    sleepTimerRemaining,
    setSleepTimer,
    cancelSleepTimer,
  } = usePlayer();
  const [customMinutes, setCustomMinutes] = useState('');

  const handleSet = (minutes: number) => {
    setSleepTimer(minutes);
    onClose();
  };

  const handleCustom = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      setSleepTimer(mins);
      setCustomMinutes('');
      onClose();
    }
  };

  const handleCancel = () => {
    cancelSleepTimer();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.sheet}
          onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Moon size={22} color={Colors.gold} />
              <Text style={styles.title}>Sleep Timer</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
              <X size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {sleepTimerActive && (
            <View style={styles.remainingContainer}>
              <Text style={styles.remainingLabel}>Remaining</Text>
              <Text style={styles.remainingValue}>
                {formatRemaining(sleepTimerRemaining)}
              </Text>
            </View>
          )}

          <View style={styles.presetsRow}>
            {PRESETS.map((mins) => (
              <TouchableOpacity
                key={mins}
                onPress={() => handleSet(mins)}
                style={styles.presetButton}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={[Colors.surfaceElevated, Colors.surface]}
                  style={styles.presetGradient}>
                  <Text style={styles.presetText}>{mins}</Text>
                  <Text style={styles.presetUnit}>min</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customSection}>
            <Text style={styles.customLabel}>Custom (minutes)</Text>
            <View style={styles.customRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter minutes"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
                value={customMinutes}
                onChangeText={setCustomMinutes}
                returnKeyType="done"
                onSubmitEditing={handleCustom}
              />
              <TouchableOpacity
                onPress={handleCustom}
                style={styles.customButton}
                activeOpacity={0.8}>
                <Text style={styles.customButtonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>

          {sleepTimerActive && (
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
              activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel Timer</Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.heading,
    color: Colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
  },
  remainingLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  remainingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.gold,
    fontVariant: ['tabular-nums'],
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  presetButton: {
    flex: 1,
    minWidth: 90,
  },
  presetPressed: {
    opacity: 0.8,
  },
  presetGradient: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  presetUnit: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  customSection: {
    marginBottom: Spacing.lg,
  },
  customLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  customRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customButton: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    ...Typography.label,
    color: Colors.background,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelText: {
    ...Typography.label,
    color: Colors.error,
    fontWeight: '600',
  },
});
