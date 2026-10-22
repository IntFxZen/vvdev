import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Habit } from '../types';
import { getHabits, saveHabits, removeHabits } from '../storage';
import HabitCard from '../components/HabitCard';
import HabitStats from '../components/HabitStats';
import SearchAndFilter, { CompletionFilter } from '../components/SearchAndFilter';
import SelectionBar from '../components/SelectionBar';
import EmptyState from '../components/EmptyState';
import HeaderAddButton from '../components/HeaderAddButton';
import { useTheme } from '../theme/ThemeContext';
import { monoFont } from '../theme/fonts';
import { formatDateKey } from '../utils/date';
import { longestCurrentStreak } from '../utils/habits';

const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>(() => getHabits());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');
  const [todayDate, setTodayDate] = useState(() => formatDateKey(new Date()));

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [todayDate]);

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
        <HeaderAddButton onPress={() => navigation.navigate('AddHabit')} />
      ),
    });
  }, [navigation, theme, formattedDate]);

  useFocusEffect(
    useCallback(() => {
      setHabits(getHabits());
      setTodayDate(formatDateKey(new Date()));
    }, [])
  );

  const toggleHabit = (id: string) => {
    const currentHabits = getHabits();
    const updatedHabits = currentHabits.map((habit) => {
      if (habit.id === id) {
        const history = habit.history || [];
        const isCompletedToday = history.includes(todayDate);
        const newHistory = isCompletedToday
          ? history.filter((date) => date !== todayDate)
          : [...history, todayDate];
        return { ...habit, history: newHistory };
      }
      return habit;
    });
    const isSaved = saveHabits(updatedHabits);
    if (!isSaved) {
      Alert.alert(
        'Save Failed',
        'We could not update this habit right now. Please try again.'
      );
      return;
    }
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
    const removed = removeHabits(selectedIds);
    if (!removed) {
      Alert.alert(
        'Delete Failed',
        'We could not delete selected habits right now. Please try again.'
      );
      return;
    }
    setHabits(getHabits());
    clearSelection();
  };

  const streak = longestCurrentStreak(habits);
  const doneTodayCount = habits.filter((h) => (h.history || []).includes(todayDate)).length;

  const filteredHabits = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return habits.filter((habit) => {
      const isDoneToday = (habit.history || []).includes(todayDate);
      if (completionFilter === 'done' && !isDoneToday) return false;
      if (completionFilter === 'pending' && isDoneToday) return false;

      if (!normalizedQuery) return true;
      const title = (habit.title || '').toLowerCase();
      const emoji = (habit.emoji || '').toLowerCase();
      return title.includes(normalizedQuery) || `${emoji} ${title}`.includes(normalizedQuery);
    });
  }, [habits, completionFilter, searchQuery, todayDate]);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <HabitStats
        streak={streak}
        doneTodayCount={doneTodayCount}
        totalHabits={habits.length}
      />
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>// HABITS</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Habit }) => (
    <HabitCard
      item={item}
      todayDate={todayDate}
      selectionMode={selectionMode}
      isSelected={selectedIds.includes(item.id)}
      onPress={() =>
        navigation.navigate('HabitDetails', {
          habitTitle: item.title,
          habitId: item.id,
        })
      }
      onLongPress={() => startSelection(item.id)}
      onToggle={() => toggleHabit(item.id)}
      onToggleSelection={() => toggleSelection(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {selectionMode && (
        <SelectionBar
          selectedCount={selectedIds.length}
          onClearSelection={clearSelection}
          onDeleteSelected={deleteSelectedHabits}
        />
      )}

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        completionFilter={completionFilter}
        onFilterChange={setCompletionFilter}
      />

      <FlatList
        data={filteredHabits}
        extraData={{ selectionMode, selectedIds, theme, todayDate }}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyState hasHabits={habits.length > 0} />}
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
  headerSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: monoFont,
    letterSpacing: 1,
    marginBottom: 12,
  },
});

export default HomeScreen;
