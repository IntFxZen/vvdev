import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Heatmap } from '@dt-workspace/react-native-heatmap';
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
  const heatmapWidth = Dimensions.get('window').width - 64;
  const heatmapWeeks = 18;
  const heatmapCellSpacing = 3;
  const heatmapCellSize = useMemo(() => {
    const innerWidth = heatmapWidth - (heatmapWeeks - 1) * heatmapCellSpacing;
    return Math.max(8, Math.floor(innerWidth / heatmapWeeks));
  }, [heatmapWidth]);

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

  const heatmapData = useMemo(() => {
    const days: { date: string; value: number }[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 125);

    for (let i = 0; i < 126; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];

      const doneCount = habits.filter((habit) => habit.history?.includes(dateStr)).length;
      let value = 0;

      if (doneCount >= 4) value = 4;
      else if (doneCount === 3) value = 3;
      else if (doneCount === 2) value = 2;
      else if (doneCount === 1) value = 1;

      days.push({ date: dateStr, value });
    }

    return days;
  }, [habits]);

  const heatmapColorScheme = useMemo(
    () =>
      isDark
        ? {
            name: 'habit-dark',
            colors: ['#222126', '#2F3A0A', '#5B7F00', '#9BDD00', '#CCFF00'],
            emptyColor: '#222126',
          }
        : {
            name: 'habit-light',
            colors: ['#F7F2FB', '#F2D7FF', '#D59DFF', '#8B50FF', '#6200EE'],
            emptyColor: '#EFEAF7',
          },
    [isDark]
  );

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

        <Heatmap
          data={heatmapData}
          startDate={new Date(Date.now() - 125 * 24 * 60 * 60 * 1000)}
          endDate={new Date()}
          width={heatmapWidth}
          height={heatmapCellSize * 7 + (7 - 1) * heatmapCellSpacing + 8}
          cellSize={heatmapCellSize}
          cellSpacing={heatmapCellSpacing}
          layout="calendar"
          cellShape="rounded"
          animated={false}
          showMonthLabels={false}
          showWeekdayLabels={false}
          colorScheme={heatmapColorScheme}
          theme={{
            colors: {
              background: 'transparent',
              text: theme.text,
              border: 'transparent',
              tooltip: '#111111',
              tooltipText: '#FFFFFF',
            },
            spacing: { cell: heatmapCellSpacing, margin: 0, padding: 0 },
            typography: {
              fontSize: 10,
              fontWeight: '500',
              fontFamily: monoFont,
            },
          }}
          style={{ width: '100%', alignSelf: 'stretch' }}
        />
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

    const completedBorderColor = isDark ? theme.primary : 'rgba(98, 0, 238, 0.35)';
    const cardBackground = isDark
      ? '#161618'
      : isCompletedToday ? '#F4FBF0' : '#FFFFFF';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          {
            borderWidth: 0.8,
            borderColor: isCompletedToday ? completedBorderColor : subtleBorderColor,
            backgroundColor: cardBackground,
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

