export const lightTheme = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#888888',
  primary: '#6200EE',
  border: '#E0E0E0',
  subtleBorder: '#E5E5EA',
  tabBar: '#FFFFFF',

  // Custom button / card backgrounds
  buttonBackground: '#E5E5EA',
  cardCompleted: '#FFFFFF',
  cardPending: '#FFFFFF',

  // Stat Card & Borders
  completedBorder: 'rgba(98, 0, 238, 0.35)',
  streakBorder: 'rgba(98, 0, 238, 0.45)',
  streakCardBg: '#FFFFFF',

  // Badges
  doneBadgeBg: 'rgba(98, 0, 238, 0.12)',
  doneBadgeText: '#6200EE',
  pendingBadgeBg: 'rgba(255, 149, 0, 0.15)',
  pendingBadgeText: '#FF9500',

  // Selection Mode
  selectionBarBg: '#F5F5F5',
  selectionBarBorder: 'rgba(0, 0, 0, 0.06)',
  deleteButtonBg: '#FF3B30',
  deleteButtonText: '#FFFFFF',
  selectedCardBorder: '#FF3B30',
};

export const darkTheme = {
  background: '#000000',
  card: '#161618',
  text: '#FFFFFF',
  textSecondary: '#888888',
  primary: '#CCFF00',
  border: '#333333',
  subtleBorder: 'rgba(255, 255, 255, 0.08)',
  tabBar: '#000000',

  // Custom button / card backgrounds
  buttonBackground: '#1C1C1E',
  cardCompleted: '#161618',
  cardPending: '#161618',

  // Stat Card & Borders
  completedBorder: 'rgba(204, 255, 0, 0.35)',
  streakBorder: 'rgba(204, 255, 0, 0.45)',
  streakCardBg: '#0D140A',

  // Badges
  doneBadgeBg: 'rgba(204, 255, 0, 0.12)',
  doneBadgeText: '#CCFF00',
  pendingBadgeBg: 'rgba(255, 149, 0, 0.12)',
  pendingBadgeText: '#FF9500',

  // Selection Mode
  selectionBarBg: 'rgba(0, 0, 0, 0.86)',
  selectionBarBorder: 'rgba(255, 255, 255, 0.08)',
  deleteButtonBg: '#FF3B30',
  deleteButtonText: '#FFFFFF',
  selectedCardBorder: '#FF3B30',
};

export type ThemeType = typeof lightTheme;