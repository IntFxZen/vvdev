import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Habit } from '../types';
import { getHabits, saveHabits, removeHabits } from '../storage';
import RoundCheckbox from '../components/RoundCheckbox';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';

const formatLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateStreak = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;

  let maxStreak = 0;

  habits.forEach((habit) => {
    if (!habit.history || habit.history.length === 0) return;

    let currentHabitStreak = 0;
    let checkDate = new Date();
    const checkDateStr = formatLocalDateKey(checkDate);
    let isDone = habit.history.includes(checkDateStr);

    if (!isDone) {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = formatLocalDateKey(checkDate);
      isDone = habit.history.includes(yesterdayStr);
    }

    if (isDone) {
      while (true) {
        const dateStr = formatLocalDateKey(checkDate);
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
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const today = new Date();
  const todayDate = formatLocalDateKey(today);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
        const isCompletedToday = habit.history.includes(todayDate);
        const newHistory = isCompletedToday
          ? habit.history.filter((date) => date !== todayDate)
          : [...habit.history, todayDate];
        return { ...habit, history: newHistory };
      }
      return habit;
    });
    saveHabits(updatedHabits);
    setHabits(updatedHabits);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  const startSelection = (id?: string) => {
    setSelectionMode(true);
    if (id) {
      setSelectedIds((current) => (current.includes(id) ? current : [...current, id]));
    }
  };

  const clearSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const deleteSelectedHabits = () => {
    if (!selectedIds.length) return;
    removeHabits(selectedIds);
    setHabits(getHabits());
    clearSelection();
  };

  const streak = calculateStreak(habits);
  const doneTodayCount = habits.filter((h) => h.history.includes(todayDate)).length;

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

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>// HABITS</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Habit }) => {
    const isSelected = selectedIds.includes(item.id);
    const isCompletedToday = item.history.includes(todayDate);
    const formattedTitle = (item.title || '').toUpperCase().replace(/\s+/g, '_');
    const timeSubtitle = item.time && item.duration
      ? `${item.time} · ${item.duration}`
      : item.time
        ? `${item.time}`
        : '8:00 AM · 30 min';

    const completedBorderColor = isDark ? theme.primary : 'rgba(98, 0, 238, 0.35)';
    const cardBackground = selectionMode
      ? (isDark ? '#161618' : '#FFFFFF')
      : isDark
      ? '#161618'
      : isCompletedToday ? '#F4FBF0' : '#FFFFFF';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          {
            borderWidth: 0.8,
            borderColor: selectionMode
              ? (isSelected ? '#FF3B30' : subtleBorderColor)
              : isCompletedToday ? completedBorderColor : subtleBorderColor,
            backgroundColor: cardBackground,
          },
        ]}
        onPress={() => {
          if (selectionMode) {
            toggleSelection(item.id);
            return;
          }
          navigation.navigate('HabitDetails', {
            habitTitle: item.title,
            habitId: item.id,
          });
        }}
        onLongPress={() => {
          startSelection(item.id);
          Vibration.vibrate(10);
        }}
      >
        <View style={styles.checkboxWrapper}>
          <RoundCheckbox
            isChecked={selectionMode ? isSelected : isCompletedToday}
            variant={selectionMode ? 'delete' : 'check'}
            onPress={() => {
              if (selectionMode) {
                toggleSelection(item.id);
                return;
              }
              toggleHabit(item.id);
            }}
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

        {!selectionMode && (
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
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {selectionMode && (
        <View
          style={[
            styles.selectionBar,
            {
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.86)' : 'rgba(255, 255, 255, 0.96)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            },
          ]}
        >
          <Text style={[styles.selectionText, { color: theme.textSecondary }]}>
            {selectedIds.length} selected
          </Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              style={[styles.selectionAction, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}
              onPress={clearSelection}
            >
              <Text style={[styles.selectionActionText, { color: theme.text }]}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.selectionAction, { backgroundColor: '#FF3B30' }]}
              onPress={deleteSelectedHabits}
              disabled={!selectedIds.length}
            >
              <Text style={[styles.selectionActionText, { color: '#FFFFFF' }]}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
  selectionBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  selectionText: {
    fontSize: 14,
    fontFamily: monoFont,
    marginBottom: 8,
  },
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectionAction: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  selectionActionText: {
    fontSize: 14,
    fontFamily: monoFont,
    textAlign: 'center',
  },
});

export default HomeScreen;
