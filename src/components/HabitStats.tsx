import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

interface HabitStatsProps {
  streak: number;
  doneTodayCount: number;
  totalHabits: number;
}

const HabitStats: React.FC<HabitStatsProps> = ({
  streak,
  doneTodayCount,
  totalHabits,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.statsRow}>
      <View
        style={[
          styles.statCard,
          styles.streakCard,
          {
            borderColor: theme.streakBorder,
            backgroundColor: theme.streakCardBg,
          },
        ]}
      >
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>STREAK</Text>
        <Text style={[styles.streakValue, { color: theme.primary }]}>
          {streak} DAYS
        </Text>
      </View>

      <View
        style={[
          styles.statCard,
          {
            backgroundColor: theme.cardCompleted,
            borderWidth: 1,
            borderColor: theme.subtleBorder,
          },
        ]}
      >
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>DONE TODAY</Text>
        <Text style={[styles.doneValue, { color: theme.text }]}>
          {doneTodayCount}/{totalHabits}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
  },
  streakCard: {
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  streakValue: {
    fontSize: 24,
    fontFamily: monoFont,
  },
  doneValue: {
    fontSize: 24,
    fontFamily: monoFont,
  },
});

export default HabitStats;
