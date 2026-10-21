import { Platform } from 'react-native';

export const appFont = Platform.select({
  ios: 'Lilex-Regular', // PostScript Name в iOS
  android: 'lilex_regular', // Имя файла в android/app/src/main/assets/fonts/ без .ttf
  default: 'monospace',
});

export const monoFont = appFont;
