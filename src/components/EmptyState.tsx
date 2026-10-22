import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

interface EmptyStateProps {
  hasHabits: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasHabits }) => {
  const { theme } = useTheme();

  return (
    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
      {hasHabits
        ? 'No habits match the current filter.'
        : 'No habits yet. Add your first one!'}
    </Text>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    fontFamily: monoFont,
  },
});

export default EmptyState;
