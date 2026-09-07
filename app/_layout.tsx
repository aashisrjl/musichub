import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { PlayerProvider } from '@/context/PlayerProvider';
import FullPlayer from '@/components/FullPlayer';
import { Colors } from '@/theme';
import { Audio } from 'expo-av';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeAndroid: 1,
      interruptionModeIOS: 1,
    });
  }, []);

  return (
    <PlayerProvider>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <FullPlayer />
      </View>
      <StatusBar style="light" />
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
