import React from 'react';
import { GlassTabs } from 'react-native-glass-tabs';
import { useTheme } from '../theme/ThemeContext';

// Импортируем наши вынесенные иконки
import { TodayIcon, ProgressIcon, SettingsIcon } from '../components/TabIcons';

import MainStack from './MainStack';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default function AppNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <GlassTabs
      key={isDark ? 'dark-tabs' : 'light-tabs'}
      tabs={[
        {
          name: 'TodayTab',
          component: MainStack,
          title: 'TODAY',
          header: false,
          renderIcon: ({ color }) => <TodayIcon color={color} />,
        },
        {
          name: 'ProgressTab',
          component: ProgressScreen,
          title: 'PROGRESS',
          header: false,
          renderIcon: ({ color }) => <ProgressIcon color={color} />,
        },
        {
          name: 'SettingsTab',
          component: SettingsScreen,
          title: 'SETTINGS',
          header: false,
          renderIcon: ({ color }) => <SettingsIcon color={color} />,
        },
      ]}
      primaryColor={theme.primary}
      inactiveColor={isDark ? '#888888' : '#666666'}
      colorScheme={isDark ? 'dark' : 'light'}
      floating={true}
      labeled={true}
    />
  );
}