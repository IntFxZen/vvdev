import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHabits } from '../storage';
import { Habit } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

const calculateStreak = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;
  let maxStreak = 0;

  habits.forEach((habit) => {
    if (!habit.history || habit.history.length === 0) return;

    let currentStreak = 0;
    let checkDate = new Date();
    const checkDateStr = checkDate.toISOString().split('T')[0];
    let isDone = habit.history.includes(checkDateStr);

    if (!isDone) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split('T')[0];
      isDone = habit.history.includes(yesterdayStr);
    }

    if (isDone) {
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (habit.history.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
  });

  return maxStreak;
};

const ProgressScreen = () => {
  const { theme, isDark } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, [])
  );

  const totalCompletions = useMemo(() => {
    return habits.reduce((acc, h) => acc + (h.history?.length || 0), 0);
  }, [habits]);

  const streak = useMemo(() => {
    return calculateStreak(habits);
  }, [habits]);

  const completionRate = useMemo(() => {
    if (habits.length === 0) return 0;
    const numDays = 30;
    const today = new Date();
    let completedCount = 0;

    for (let i = 0; i < numDays; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      habits.forEach((h) => {
        if (h.history && h.history.includes(dateStr)) {
          completedCount++;
        }
      });
    }

    const totalPossible = numDays * habits.length;
    return Math.round((completedCount / totalPossible) * 100) || 0;
  }, [habits]);

  const currentYear = useMemo(() => {
    return new Date().getFullYear().toString();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Habit Board</Text>
        <View
          style={[
            styles.yearBadge,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
              borderColor: subtleBorderColor,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.yearBadgeText, { color: theme.textSecondary }]}>
            {currentYear}
          </Text>
        </View>
      </View>

      {/* Top 3 Stat Cards */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            {
              borderColor: isDark ? 'rgba(204, 255, 0, 0.45)' : 'rgba(98, 0, 238, 0.45)',
              backgroundColor: isDark ? '#0D140A' : '#F4FBF0',
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TOTAL</Text>
          <Text style={[styles.totalValue, { color: theme.primary }]}>
            {totalCompletions}
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
              borderColor: subtleBorderColor,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>STREAK</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {streak}d
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
              borderColor: subtleBorderColor,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>RATE</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {completionRate}%
          </Text>
        </View>
      </View>

      {/* Per Habit Section */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>
        // PER_HABIT
      </Text>

      <View style={styles.perHabitList}>
        {habits.map((item) => {
          const formattedTitle = (item.title || '').toUpperCase().replace(/\s+/g, '_');

          return (
            <View
              key={item.id}
              style={[
                styles.habitRowCard,
                {
                  backgroundColor: isDark ? '#161618' : '#FFFFFF',
                  borderColor: subtleBorderColor,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.habitRowTitle, { color: theme.text }]}>
                {formattedTitle}
              </Text>

              <Text style={[styles.habitRowMeta, { color: theme.textSecondary }]}>
                {item.history?.length || 0} completions
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    padding: 16,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  yearBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  yearBadgeText: {
    fontSize: 12,
    fontFamily: monoFont,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 24,
    fontFamily: monoFont,
  },
  statValue: {
    fontSize: 24,
    fontFamily: monoFont,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 1,
  },
  perHabitList: {
    gap: 12,
    marginTop: 12,
  },
  habitRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  habitRowTitle: {
    fontSize: 14,
    fontFamily: monoFont,
    letterSpacing: 0.5,
    flex: 1,
  },
  habitRowMeta: {
    fontSize: 12,
    fontFamily: monoFont,
  },
});

export default ProgressScreen;
