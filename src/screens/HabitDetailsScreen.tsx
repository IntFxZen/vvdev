import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHabits, saveHabits } from '../storage';
import { Habit } from '../types';
import HabitOverview from '../components/HabitOverview';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';
import { formatDateKey } from '../utils/date';

type HistoryDay = {
  dateStr: string;
  dayName: string;
  dayNum: number;
  monthName: string;
  isCompleted: boolean;
  isToday: boolean;
};

const getRecentDays = (history: string[], createdAt?: string, maxDays = 35): HistoryDay[] => {
  const days: HistoryDay[] = [];
  const today = new Date();
  const createdDateStr =
    createdAt ||
    (history && history.length > 0
      ? [...history].sort()[0]
      : formatDateKey(today));

  for (let i = maxDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateStr = formatDateKey(d);

    // Skip dates before the habit creation date
    if (dateStr < createdDateStr) {
      continue;
    }

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
  const [habit, setHabit] = useState<Habit | null>(() => {
    if (!habitId) {
      return null;
    }
    return getHabits().find((item) => item.id === habitId) ?? null;
  });

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

  const loadHabit = useCallback(() => {
    const habits = getHabits();
    const found = habits.find((h) => h.id === habitId);
    setHabit(found ?? null);
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
        const history = h.history || [];
        const hasDate = history.includes(dateStr);
        const newHistory = hasDate
          ? history.filter((d) => d !== dateStr)
          : [...history, dateStr];
        return { ...h, history: newHistory };
      }
      return h;
    });

    const isSaved = saveHabits(updatedHabits);
    if (!isSaved) {
      Alert.alert(
        'Save Failed',
        'We could not update this habit right now. Please try again.'
      );
      return;
    }
    const updatedCurrent = updatedHabits.find((h) => h.id === habit.id);
    if (updatedCurrent) {
      setHabit(updatedCurrent);
    }
  };

  const recentDays = useMemo(() => {
    return getRecentDays(habit?.history || [], habit?.createdAt, 35);
  }, [habit?.history, habit?.createdAt]);

  const totalCompleted = habit?.history?.length || 0;

  const ratePercentage = useMemo(() => {
    if (!recentDays.length) return '0%';
    const count = recentDays.filter((d) => d.isCompleted).length;
    return `${Math.round((count / recentDays.length) * 100)}%`;
  }, [recentDays]);

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
      <HabitOverview
        habit={habit}
        totalCompleted={totalCompleted}
        ratePercentage={ratePercentage}
      />

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
  sectionTitle: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 12,
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
