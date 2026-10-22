import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Habit } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';
import { formatHabitSchedule } from '../utils/habits';

interface HabitOverviewProps {
  habit: Habit;
  totalCompleted: number;
  ratePercentage: string;
}

const HabitOverview: React.FC<HabitOverviewProps> = ({
  habit,
  totalCompleted,
  ratePercentage,
}) => {
  const { theme, isDark } = useTheme();
  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

  const formattedTitle = (habit.title || '').toUpperCase().replace(/\s+/g, '_');
  const timeSubtitle = formatHabitSchedule(habit);

  return (
    <View
      style={[
        styles.overviewCard,
        {
          backgroundColor: isDark ? '#161618' : '#FFFFFF',
          borderColor: subtleBorderColor,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={[styles.habitTitle, { color: theme.text }]}>
        {habit.emoji ? `${habit.emoji} ${formattedTitle}` : formattedTitle}
      </Text>
      {timeSubtitle ? (
        <Text style={[styles.habitSubtitle, { color: theme.textSecondary }]}>
          {timeSubtitle}
        </Text>
      ) : null}

      <View style={styles.statsRow}>
        <View
          style={[
            styles.miniStatCard,
            {
              backgroundColor: isDark ? '#0D140A' : '#F4FBF0',
              borderColor: isDark ? 'rgba(204, 255, 0, 0.45)' : 'rgba(98, 0, 238, 0.45)',
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>
            COMPLETED
          </Text>
          <Text style={[styles.miniStatValue, { color: theme.primary }]}>
            {totalCompleted} DAYS
          </Text>
        </View>

        <View
          style={[
            styles.miniStatCard,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
              borderColor: subtleBorderColor,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>
            RATE
          </Text>
          <Text style={[styles.miniStatValue, { color: theme.text }]}>
            {ratePercentage}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overviewCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
  },
  habitTitle: {
    fontSize: 20,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  habitSubtitle: {
    fontSize: 13,
    fontFamily: monoFont,
    marginTop: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
  },
  miniStatLabel: {
    fontSize: 10,
    fontFamily: monoFont,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  miniStatValue: {
    fontSize: 18,
    fontFamily: monoFont,
  },
});

export default HabitOverview;
