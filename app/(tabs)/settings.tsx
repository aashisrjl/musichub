import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import {
  Moon,
  Play,
  Shuffle,
  Clock,
  Trash2,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import SleepTimerModal from '@/components/SleepTimerModal';
import { Colors, Typography, Spacing, Radius } from '@/theme';
import { usePlayer } from '@/context/PlayerContext';

export default function SettingsScreen() {
  const {
    autoplay,
    darkTheme,
    isShuffleEnabled,
    toggleShuffle,
    setAutoplay,
    setDarkTheme,
    clearRecentlyPlayed,
    clearFavorites,
    sleepTimerActive,
    sleepTimerRemaining,
  } = usePlayer();

  const [sleepTimerVisible, setSleepTimerVisible] = useState(false);

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClearRecent = () => {
    Alert.alert(
      'Clear Recently Played',
      'Are you sure you want to clear your recently played history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearRecentlyPlayed },
      ],
    );
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearFavorites },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../public/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Settings</Text>
        </View>
      </View>

      {/* Playback */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Playback</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => setSleepTimerVisible(true)}
          activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Moon size={20} color={Colors.gold} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Sleep Timer</Text>
              {sleepTimerActive ? (
                <Text style={styles.rowValue}>
                  Remaining: {formatRemaining(sleepTimerRemaining)}
                </Text>
              ) : (
                <Text style={styles.rowSubtitle}>Set a timer to stop music</Text>
              )}
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Play size={20} color={Colors.gold} />
            </View>
            <Text style={styles.rowTitle}>Autoplay</Text>
          </View>
          <Switch
            value={autoplay}
            onValueChange={setAutoplay}
            trackColor={{
              false: Colors.border,
              true: Colors.gold,
            }}
            thumbColor={autoplay ? Colors.background : Colors.textTertiary}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Shuffle size={20} color={Colors.gold} />
            </View>
            <Text style={styles.rowTitle}>Shuffle</Text>
          </View>
          <Switch
            value={isShuffleEnabled}
            onValueChange={toggleShuffle}
            trackColor={{
              false: Colors.border,
              true: Colors.gold,
            }}
            thumbColor={isShuffleEnabled ? Colors.background : Colors.textTertiary}
          />
        </View>
      </View>

      {/* Library */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Library</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={handleClearRecent}
          activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Clock size={20} color={Colors.gold} />
            </View>
            <Text style={styles.rowTitle}>Clear Recently Played</Text>
          </View>
          <Trash2 size={18} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={handleClearFavorites}
          activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Heart size={20} color={Colors.gold} />
            </View>
            <Text style={styles.rowTitle}>Clear Favorites</Text>
          </View>
          <Trash2 size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Appearance</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Moon size={20} color={Colors.gold} />
            </View>
            <Text style={styles.rowTitle}>Dark Theme</Text>
          </View>
          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{
              false: Colors.border,
              true: Colors.gold,
            }}
            thumbColor={darkTheme ? Colors.background : Colors.textTertiary}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.aboutCard}>
          <Image 
            source={require('../../public/logo.png')} 
            style={styles.aboutLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.aboutTitle}>MusicHub</Text>
            <Text style={styles.aboutTagline}>
              Your personal collection of timeless music.
            </Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          </View>
        </View>
      </View>

      <SleepTimerModal
        visible={sleepTimerVisible}
        onClose={() => setSleepTimerVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 24,
  },
  header: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    ...Typography.small,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  rowTitle: {
    ...Typography.label,
    color: Colors.text,
  },
  rowSubtitle: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rowValue: {
    ...Typography.small,
    color: Colors.gold,
    marginTop: 2,
    fontWeight: '600',
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  aboutLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: Spacing.lg,
  },
  aboutTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: 4,
  },
  aboutTagline: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  aboutVersion: {
    ...Typography.small,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
});
