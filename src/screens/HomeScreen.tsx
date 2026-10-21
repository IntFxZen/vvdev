import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Habit } from '../types';
import { getHabits, saveHabits } from '../storage';
import RoundCheckbox from '../components/RoundCheckbox';
import { useTheme } from '../theme/ThemeContext'; // <--- Импорт

const HomeScreen = ({ navigation }: any) => {
  const { theme, isDark, toggleTheme } = useTheme(); // <--- Достаем тему
  const [habits, setHabits] = useState<Habit[]>([]);
  const today = new Date().toISOString().split('T')[0];

  // Добавляем кнопку смены темы в шапку навигации
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      headerRight: () => (
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
          <Text style={{ fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, isDark]);

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

  const renderItem = ({ item }: { item: Habit }) => {
    const isCompletedToday = item.history.includes(today);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
        onPress={() => navigation.navigate('HabitDetails', { habitTitle: item.title, habitId: item.id })}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>

        <RoundCheckbox
          isChecked={isCompletedToday}
          onPress={() => toggleHabit(item.id)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {habits.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Пока нет привычек. Добавьте первую!</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Text style={[styles.fabText, { color: isDark ? '#000' : '#fff' }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Оставляем только структурные стили, цвета убираем
const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  emoji: { fontSize: 24, marginRight: 12 },
  cardTitle: { flex: 1, fontSize: 18, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { fontSize: 30, fontWeight: 'bold' },
});

export default HomeScreen;