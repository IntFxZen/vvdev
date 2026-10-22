import { Platform } from 'react-native';

export const appFont = Platform.select({
  ios: 'Lilex-Regular',
  android: 'Lilex-Regular',
  default: 'monospace',
});

export const monoFont = appFont;
