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

  const matrixColumns = useMemo(() => {
    const days: { dateStr: string; intensity: number }[] = [];
    const todayObj = new Date();
    const totalDays = 126; // 18 weeks x 7 days

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(todayObj.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      let count = 0;
      habits.forEach((h) => {
        if (h.history && h.history.includes(dateStr)) {
          count++;
        }
      });

      const total = habits.length || 1;
      const ratio = count / total;
      let intensity = 0;
      if (count > 0) {
        if (ratio >= 0.75) intensity = 3;
        else if (ratio >= 0.4) intensity = 2;
        else intensity = 1;
      }

      days.push({ dateStr, intensity });
    }

    const cols = [];
    for (let c = 0; c < 18; c++) {
      cols.push(days.slice(c * 7, (c + 1) * 7));
    }
    return cols;
  }, [habits]);

  const currentMonthYear = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  }, []);

  const currentYear = useMemo(() => {
    return new Date().getFullYear().toString();
  }, []);

  const last7Days = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
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

      {/* Commit Board Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          // COMMIT_BOARD
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          {currentMonthYear}
        </Text>
      </View>

      <View
        style={[
          styles.commitBoardCard,
          {
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            borderColor: subtleBorderColor,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.fullMatrixContainer}>
          {matrixColumns.map((col, colIdx) => (
            <View key={`col-${colIdx}`} style={styles.fullMatrixColumn}>
              {col.map((dayData) => {
                let squareBg = isDark ? '#222226' : '#EAEAEA';
                if (dayData.intensity === 1) {
                  squareBg = isDark ? 'rgba(204, 255, 0, 0.35)' : 'rgba(98, 0, 238, 0.35)';
                } else if (dayData.intensity === 2) {
                  squareBg = isDark ? 'rgba(204, 255, 0, 0.7)' : 'rgba(98, 0, 238, 0.7)';
                } else if (dayData.intensity === 3) {
                  squareBg = theme.primary;
                }

                return (
                  <View
                    key={dayData.dateStr}
                    style={[
                      styles.fullMatrixSquare,
                      { backgroundColor: squareBg },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.intensityRow}>
          <Text style={[styles.intensityLabel, { color: theme.textSecondary }]}>
            INTENSITY:
          </Text>
          <View
            style={[
              styles.intensitySquare,
              { backgroundColor: isDark ? '#222226' : '#EAEAEA' },
            ]}
          />
          <View
            style={[
              styles.intensitySquare,
              {
                backgroundColor: isDark
                  ? 'rgba(204, 255, 0, 0.35)'
                  : 'rgba(98, 0, 238, 0.35)',
              },
            ]}
          />
          <View
            style={[
              styles.intensitySquare,
              {
                backgroundColor: isDark
                  ? 'rgba(204, 255, 0, 0.7)'
                  : 'rgba(98, 0, 238, 0.7)',
              },
            ]}
          />
          <View
            style={[styles.intensitySquare, { backgroundColor: theme.primary }]}
          />
          <Text style={[styles.intensityText, { color: theme.textSecondary }]}>
            NONE
          </Text>
          <Text style={[styles.intensityText, { color: theme.primary }]}>FULL</Text>
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

              <View style={styles.miniHeatmapRow}>
                {last7Days.map((dateStr) => {
                  const isDone = item.history && item.history.includes(dateStr);
                  return (
                    <View
                      key={dateStr}
                      style={[
                        styles.miniSquare,
                        {
                          backgroundColor: isDone
                            ? theme.primary
                            : isDark
                            ? '#222226'
                            : '#EAEAEA',
                        },
                      ]}
                    />
                  );
                })}
              </View>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: monoFont,
  },
  commitBoardCard: {
    padding: 16,
    borderRadius: 20,
  },
  fullMatrixContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  fullMatrixColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  fullMatrixSquare: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 3,
  },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  intensityLabel: {
    fontSize: 11,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  intensitySquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  intensityText: {
    fontSize: 11,
    fontFamily: monoFont,
    marginLeft: 2,
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
  miniHeatmapRow: {
    flexDirection: 'row',
    gap: 6,
  },
  miniSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});

export default ProgressScreen;