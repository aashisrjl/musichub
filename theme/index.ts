import { StyleSheet } from 'react-native';

export const Colors = {
  background: '#0A0A0B',
  surface: '#161618',
  surfaceElevated: '#1E1E22',
  surfaceHover: '#26262B',
  card: '#1C1C20',
  border: '#2A2A30',
  borderSubtle: '#222228',

  text: '#F5F5F7',
  textSecondary: '#A0A0A8',
  textTertiary: '#6B6B73',
  textMuted: '#4A4A52',

  gold: '#E8B86D',
  goldLight: '#F0CC8C',
  goldDark: '#C99A4F',
  goldDim: 'rgba(232, 184, 109, 0.15)',

  burgundy: '#7C2D3A',
  burgundyLight: '#9A3A4A',

  purple: '#3D2B5E',
  purpleLight: '#5A3F8A',

  success: '#4CAF50',
  warning: '#FFA726',
  error: '#EF5350',

  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayDark: 'rgba(0, 0, 0, 0.85)',
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const Typography = {
  hero: { fontSize: 34, fontWeight: '700' as const, lineHeight: 40 },
  title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
  heading: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 18 },
};

export const commonStyles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
