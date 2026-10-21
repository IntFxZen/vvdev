import { createMMKV } from 'react-native-mmkv';
import { Habit } from '../types';

export const storage = createMMKV();

export const getHabits = (): Habit[] => {
  const habitsString = storage.getString('habits');
  return habitsString ? JSON.parse(habitsString) : [];
};

export const saveHabits = (habits: Habit[]) => {
  storage.set('habits', JSON.stringify(habits));
};


export const removeHabit = (id: string) => {
  const habits = getHabits().filter((habit) => habit.id !== id);
  saveHabits(habits);
};

export const removeHabits = (ids: string[]) => {
  if (!ids.length) return;
  const habits = getHabits().filter((habit) => !ids.includes(habit.id));
  saveHabits(habits);
};