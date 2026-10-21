import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHabits, saveHabits } from '../storage';
import { Habit } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

type HistoryDay = {
  dateStr: string;
  dayName: string;
  dayNum: number;
  monthName: string;
  isCompleted: boolean;
  isToday: boolean;
};

const getRecentDays = (history: string[], numDays = 35): HistoryDay[] => {
  const days: HistoryDay[] = [];
  const today = new Date();

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const dateStr = d.toISOString().split('T')[0];
    const isCompleted = (history || []).includes(dateStr);
    const isToday = i === 0;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNum = d.getDate();

    days.push({
      dateStr,
      dayName,
      dayNum,
      monthName,
      isCompleted,
      isToday,
    });
  }
  return days;
};

const HabitDetailsScreen = ({ route }: any) => {
  const { habitId } = route.params || {};
  const { theme, isDark } = useTheme();
  const [habit, setHabit] = useState<Habit | null>(null);

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

  const loadHabit = useCallback(() => {
    const habits = getHabits();
    const found = habits.find((h) => h.id === habitId);
    if (found) {
      setHabit(found);
    }
  }, [habitId]);

  useFocusEffect(
    useCallback(() => {
      loadHabit();
    }, [loadHabit])
  );

  const toggleDateCompletion = (dateStr: string) => {
    if (!habit) return;

    const habits = getHabits();
    const updatedHabits = habits.map((h) => {
      if (h.id === habit.id) {
        const hasDate = h.history.includes(dateStr);
        const newHistory = hasDate
          ? h.history.filter((d) => d !== dateStr)
          : [...h.history, dateStr];
        return { ...h, history: newHistory };
      }
      return h;
    });

    saveHabits(updatedHabits);
    const updatedCurrent = updatedHabits.find((h) => h.id === habit.id);
    if (updatedCurrent) {
      setHabit(updatedCurrent);
    }
  };

  const recentDays = useMemo(() => {
    return getRecentDays(habit?.history || [], 35);
  }, [habit?.history]);

  const totalCompleted = habit?.history?.length || 0;
  const formattedTitle = (habit?.title || '').toUpperCase().replace(/\s+/g, '_');
  const timeSubtitle =
    habit?.time && habit?.duration
      ? `${habit.time} · ${habit.duration}`
      : habit?.time
      ? `${habit.time}`
      : '08:00 AM · 30 min';

  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Habit not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Habit Overview Card */}
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
        <Text style={[styles.habitSubtitle, { color: theme.textSecondary }]}>
          {timeSubtitle}
        </Text>

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
              35-DAY RATE
            </Text>
            <Text style={[styles.miniStatValue, { color: theme.text }]}>
              {Math.round((recentDays.filter((d) => d.isCompleted).length / 35) * 100)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Heatmap Matrix Section */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        // ACTIVITY_HEATMAP (35 DAYS)
      </Text>
      <View
        style={[
          styles.heatmapCard,
          {
            backgroundColor: isDark ? '#161618' : '#FFFFFF',
            borderColor: subtleBorderColor,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.heatmapGrid}>
          {recentDays.map((day) => (
            <TouchableOpacity
              key={day.dateStr}
              activeOpacity={0.7}
              onPress={() => toggleDateCompletion(day.dateStr)}
              style={[
                styles.heatmapSquare,
                day.isCompleted
                  ? {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    }
                  : {
                      backgroundColor: isDark ? '#222226' : '#EAEAEA',
                      borderColor: subtleBorderColor,
                    },
                day.isToday && {
                  borderWidth: 1.5,
                  borderColor: isDark ? '#FFFFFF' : '#000000',
                },
              ]}
            >
              <Text
                style={[
                  styles.heatmapDayNum,
                  {
                    color: day.isCompleted
                      ? isDark
                        ? '#000000'
                        : '#FFFFFF'
                      : theme.textSecondary,
                  },
                ]}
              >
                {day.dayNum}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendSquare, { backgroundColor: isDark ? '#222226' : '#EAEAEA' }]}
            />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              MISSED
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, { backgroundColor: theme.primary }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              DONE
            </Text>
          </View>
        </View>
      </View>

      {/* Detailed History Log */}
      <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>
        // HISTORY_LOG
      </Text>

      <View style={styles.logList}>
        {[...recentDays].reverse().map((day) => (
          <TouchableOpacity
            key={`log-${day.dateStr}`}
            activeOpacity={0.8}
            onPress={() => toggleDateCompletion(day.dateStr)}
            style={[
              styles.logItem,
              {
                borderColor: day.isCompleted
                  ? (isDark ? 'rgba(204, 255, 0, 0.35)' : 'rgba(98, 0, 238, 0.35)')
                  : subtleBorderColor,
                borderWidth: 1,
                backgroundColor: day.isCompleted
                  ? (isDark ? '#0D140A' : '#F4FBF0')
                  : (isDark ? '#161618' : '#FFFFFF'),
              },
            ]}
          >
            <View>
              <Text style={[styles.logDateText, { color: theme.text }]}>
                {day.monthName} {day.dayNum}, {day.dateStr.split('-')[0]}
              </Text>
              <Text style={[styles.logDayText, { color: theme.textSecondary }]}>
                {day.dayName} {day.isToday ? '· TODAY' : ''}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                day.isCompleted
                  ? {
                      backgroundColor: isDark
                        ? 'rgba(204, 255, 0, 0.12)'
                        : 'rgba(98, 0, 238, 0.12)',
                    }
                  : {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: day.isCompleted ? theme.primary : theme.textSecondary },
                ]}
              >
                {day.isCompleted ? '[DONE]' : '[MISSED]'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    padding: 16,
    paddingBottom: 60,
  },
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
  sectionTitle: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 12,
  },
  heatmapCard: {
    padding: 16,
    borderRadius: 20,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  heatmapSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heatmapDayNum: {
    fontSize: 11,
    fontFamily: monoFont,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    fontFamily: monoFont,
  },
  logList: {
    gap: 10,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logDateText: {
    fontSize: 14,
    fontFamily: monoFont,
  },
  logDayText: {
    fontSize: 12,
    fontFamily: monoFont,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    fontFamily: monoFont,
  },
});

export default HabitDetailsScreen;