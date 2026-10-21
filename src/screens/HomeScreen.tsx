import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Habit } from '../types';
import { getHabits, saveHabits } from '../storage';
import RoundCheckbox from '../components/RoundCheckbox';

const HomeScreen = ({ navigation }: any) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const today = new Date().toISOString().split('T')[0];

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
        style={[styles.card, { backgroundColor: item.color }]}
        onPress={() => navigation.navigate('HabitDetails', { habitTitle: item.title, habitId: item.id })}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>

        {/* Наш кастомный компонент */}
        <RoundCheckbox
          isChecked={isCompletedToday}
          onPress={() => toggleHabit(item.id)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {habits.length === 0 ? (
        <Text style={styles.emptyText}>Пока нет привычек. Добавьте первую!</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
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
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
});

export default HomeScreen;