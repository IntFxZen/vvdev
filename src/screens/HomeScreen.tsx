import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Habit } from '../types';
import { getHabits, saveHabits } from '../storage';
import RoundCheckbox from '../components/RoundCheckbox';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

const calculateStreak = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;

  let maxStreak = 0;

  habits.forEach((habit) => {
    if (!habit.history || habit.history.length === 0) return;

    let currentHabitStreak = 0;
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
          currentHabitStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    if (currentHabitStreak > maxStreak) {
      maxStreak = currentHabitStreak;
    }
  });

  return maxStreak;
};

const HomeScreen = ({ navigation }: any) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const today = new Date().toISOString().split('T')[0];

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const subtleBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E5EA';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: formattedDate,
      headerTitleAlign: 'left',
      headerTitleStyle: {
        fontSize: 20,
        color: theme.text,
        fontFamily: monoFont,
      },
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      headerShadowVisible: false,
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleBtn}>
            <Text style={{ fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
                borderWidth: 1,
                borderColor: subtleBorderColor,
              },
            ]}
            onPress={() => navigation.navigate('AddHabit')}
            activeOpacity={0.7}
          >
            <Text style={[styles.addButtonText, { color: theme.primary }]}>+ NEW</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme, isDark, toggleTheme, formattedDate, subtleBorderColor]);

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
    }, [])
  );

  const toggleHabit = (id: string) => {
    const currentHabits = getHabits();
    const updatedHabits = currentHabits.map((habit) => {
      if (habit.id === id) {
        const isCompletedToday = habit.history.includes(today);
        const newHistory = isCompletedToday
          ? habit.history.filter((date) => date !== today)
          : [...habit.history, today];
        return { ...habit, history: newHistory };
      }
      return habit;
    });
    saveHabits(updatedHabits);
    setHabits(updatedHabits);
  };

  const streak = calculateStreak(habits);
  const doneTodayCount = habits.filter((h) => h.history.includes(today)).length;

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

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            styles.streakCard,
            {
              borderColor: isDark ? 'rgba(204, 255, 0, 0.45)' : 'rgba(98, 0, 238, 0.45)',
              backgroundColor: isDark ? '#0D140A' : '#F4FBF0',
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
              backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
              borderWidth: 1,
              borderColor: subtleBorderColor,
            },
          ]}
        >
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>DONE TODAY</Text>
          <Text style={[styles.doneValue, { color: theme.text }]}>
            {doneTodayCount}/{habits.length}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.heatmapCard,
          {
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            borderColor: subtleBorderColor,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.heatmapHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>// COMMIT_BOARD</Text>
          <Text style={[styles.heatmapMonth, { color: theme.textSecondary }]}>{currentMonthYear}</Text>
        </View>

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
          <Text style={[styles.intensityLabel, { color: theme.textSecondary }]}>INTENSITY:</Text>
          <View style={[styles.intensitySquare, { backgroundColor: isDark ? '#222226' : '#EAEAEA' }]} />
          <View style={[styles.intensitySquare, { backgroundColor: isDark ? 'rgba(204, 255, 0, 0.35)' : 'rgba(98, 0, 238, 0.35)' }]} />
          <View style={[styles.intensitySquare, { backgroundColor: isDark ? 'rgba(204, 255, 0, 0.7)' : 'rgba(98, 0, 238, 0.7)' }]} />
          <View style={[styles.intensitySquare, { backgroundColor: theme.primary }]} />
          <Text style={[styles.intensityText, { color: theme.textSecondary }]}>NONE</Text>
          <Text style={[styles.intensityText, { color: theme.primary }]}>FULL</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>// HABITS</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Habit }) => {
    const isCompletedToday = item.history.includes(today);
    const formattedTitle = (item.title || '').toUpperCase().replace(/\s+/g, '_');
    const timeSubtitle = item.time && item.duration
      ? `${item.time} · ${item.duration}`
      : item.time
        ? `${item.time}`
        : '8:00 AM · 30 min';

    const completedBorderColor = isDark ? 'rgba(204, 255, 0, 0.35)' : 'rgba(98, 0, 238, 0.35)';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          {
            borderWidth: 1,
            borderColor: isCompletedToday ? completedBorderColor : subtleBorderColor,
            backgroundColor: isCompletedToday
              ? (isDark ? '#0D140A' : '#F4FBF0')
              : (isDark ? '#161618' : '#FFFFFF'),
          },
        ]}
        onPress={() =>
          navigation.navigate('HabitDetails', {
            habitTitle: item.title,
            habitId: item.id,
          })
        }
      >
        <View style={styles.checkboxWrapper}>
          <RoundCheckbox
            isChecked={isCompletedToday}
            onPress={() => toggleHabit(item.id)}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {item.emoji ? `${item.emoji} ${formattedTitle}` : formattedTitle}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            {timeSubtitle}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.statusBadge,
            isCompletedToday
              ? {
                  backgroundColor: isDark
                    ? 'rgba(204, 255, 0, 0.12)'
                    : 'rgba(98, 0, 238, 0.12)',
                }
              : {
                  backgroundColor: isDark
                    ? 'rgba(255, 149, 0, 0.12)'
                    : 'rgba(255, 149, 0, 0.15)',
                },
          ]}
          onPress={() => toggleHabit(item.id)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: isCompletedToday ? theme.primary : '#FF9500' },
            ]}
          >
            {isCompletedToday ? '[DONE]' : '[PENDING]'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Пока нет привычек. Добавьте первую!
          </Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: {
    padding: 16,
    paddingBottom: 110,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  themeToggleBtn: {
    marginRight: 12,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  headerSection: {
    marginBottom: 8,
  },
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
  heatmapCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  heatmapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heatmapMonth: {
    fontSize: 12,
    fontFamily: monoFont,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 12,
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  checkboxWrapper: {
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: monoFont,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: monoFont,
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    fontFamily: monoFont,
  },
});

export default HomeScreen;